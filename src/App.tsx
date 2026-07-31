import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LevelBadge } from './components/LevelBadge';
import { CombinedMap } from './components/CombinedMap';
import { RegionMap } from './components/RegionMap';
import { PollutionRadiusMap } from './components/PollutionRadiusMap';
import { CctvModal } from './components/CctvModal';
import { EmissionsForm } from './components/EmissionsForm';
import { PollutionCharts } from './components/PollutionCharts';
import { PemdaMitigationCard } from './components/PemdaMitigationCard';
import { HealthRiskSection } from './components/HealthRiskSection';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { DiseaseCatalogModal } from './components/DiseaseCatalogModal';
import { GasExplanationGuide } from './components/GasExplanationGuide';
import { REGION_PRESETS } from './data/regions';
import {
  RegionPreset,
  VehicleData,
  FactoryData,
  EnvironmentalData,
  PollutionCalculationResult,
  AiAnalysisResponse,
} from './types';
import { calculatePollution } from './utils/pollutionCalculator';
import { Sparkles, Activity, ShieldCheck, FileText, Info, Compass, HeartPulse, Building2, Sliders, MapPin, Layers } from 'lucide-react';

export default function App() {
  // 1. Initial State Selection
  const [selectedRegion, setSelectedRegion] = useState<RegionPreset | null>(REGION_PRESETS[0]);
  const [vehicles, setVehicles] = useState<VehicleData>(REGION_PRESETS[0].vehicles);
  const [factory, setFactory] = useState<FactoryData>(REGION_PRESETS[0].factory);
  const [environment, setEnvironment] = useState<EnvironmentalData>(REGION_PRESETS[0].environment);

  const [activeTab, setActiveTab] = useState<string>('monitor');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Theme State (Dark Mode default, Light Mode toggleable)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('airpulse_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('airpulse_theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // CCTV Modal State
  const [cctvModalOpen, setCctvModalOpen] = useState<boolean>(false);

  // Disease Catalog Modal State
  const [diseaseCatalogModalOpen, setDiseaseCatalogModalOpen] = useState<boolean>(false);

  // 2. Calculation State
  const [calculationResult, setCalculationResult] = useState<PollutionCalculationResult>(() =>
    calculatePollution(
      REGION_PRESETS[0].vehicles,
      REGION_PRESETS[0].factory,
      REGION_PRESETS[0].environment,
      REGION_PRESETS[0].populationTotal
    )
  );

  // 3. AI Modal & State
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiData, setAiData] = useState<AiAnalysisResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Recalculate pollution whenever parameters change
  const runCalculation = useCallback(() => {
    const popTotal = selectedRegion ? selectedRegion.populationTotal : 1500000;
    const res = calculatePollution(vehicles, factory, environment, popTotal);
    setCalculationResult(res);
    setLastUpdatedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [vehicles, factory, environment, selectedRegion]);

  useEffect(() => {
    runCalculation();
  }, [runCalculation]);


  // Handle Region Change
  const handleSelectRegion = (region: RegionPreset) => {
    setSelectedRegion(region);
    setVehicles(region.vehicles);
    setFactory(region.factory);
    setEnvironment(region.environment);
  };

  // Reset parameters to current preset defaults
  const handleResetToDefaults = () => {
    if (selectedRegion) {
      setVehicles(selectedRegion.vehicles);
      setFactory(selectedRegion.factory);
      setEnvironment(selectedRegion.environment);
    } else {
      setVehicles(REGION_PRESETS[0].vehicles);
      setFactory(REGION_PRESETS[0].factory);
      setEnvironment(REGION_PRESETS[0].environment);
    }
  };

  // Real-Time Sensor Fluctuation Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setVehicles((prev) => {
        const delta = Math.floor((Math.random() - 0.48) * 120);
        const heavyDelta = Math.floor((Math.random() - 0.48) * 15);
        return {
          ...prev,
          motorcycles: Math.max(1000, prev.motorcycles + delta * 2),
          gasolineCars: Math.max(500, prev.gasolineCars + delta),
          heavyTrucks: Math.max(100, prev.heavyTrucks + heavyDelta),
        };
      });

      setEnvironment((prev) => {
        const windDelta = Number(((Math.random() - 0.5) * 0.4).toFixed(1));
        return {
          ...prev,
          windSpeedKmh: Math.max(1, Math.min(30, Number((prev.windSpeedKmh + windDelta).toFixed(1)))),
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Call Gemini AI Endpoint
  const handleTriggerAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/pollution/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionName: selectedRegion ? selectedRegion.name : 'Wilayah Pengamatan Custom',
          ispuScore: calculationResult.ispuScore,
          level: calculationResult.level,
          primaryPollutant: calculationResult.primaryPollutant,
          pollutants: calculationResult.pollutants,
          vehicles,
          factory,
          environment,
          sources: calculationResult.sources,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Gagal menghubungi server AI Gemini.');
      }

      const data: AiAnalysisResponse = await response.json();
      setAiData(data);
      setAiModalOpen(true);
    } catch (err: any) {
      console.error('Error triggering AI analysis:', err);
      setAiError(err.message || 'Terjadi kesalahan sistem saat memproses rekomendasi AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
        : 'bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white'
    }`}>
      
      {/* App Header */}
      <Header
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={isSimulating}
        onToggleSimulating={() => setIsSimulating(!isSimulating)}
        lastUpdatedTime={lastUpdatedTime}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCctv={() => setCctvModalOpen(true)}
        onOpenDiseaseCatalog={() => setDiseaseCatalogModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error notification banner if AI API fails */}
        {aiError && (
          <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center justify-between">
            <span>{aiError}</span>
            <button onClick={() => setAiError(null)} className="text-slate-400 hover:text-white underline">
              Tutup
            </button>
          </div>
        )}

        {/* 1. Primary Status Badge (3-Level Categorization: AMAN, WASPADA, BERBAHAYA) */}
        <LevelBadge
          result={calculationResult}
          regionName={selectedRegion ? selectedRegion.name : 'Kawasan Custom (Manual Parameter)'}
          theme={theme}
        />

        {/* Feature View 1 & 2: Peta Terpadu Wilayah, GIS Radar & CCTV Live */}
        {(activeTab === 'map' || activeTab === 'monitor' || activeTab === 'radius') && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CombinedMap
              region={selectedRegion}
              calculationResult={calculationResult}
              onOpenCctv={() => setCctvModalOpen(true)}
              theme={theme}
            />

            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Grafik Parameter ISPU Real-time
                </h3>
              </div>
              <PollutionCharts result={calculationResult} theme={theme} />
            </div>
          </div>
        )}

        {/* Feature View 3: Kalkulator Parameter Emisi Kendaraan, Pabrik & Cuaca */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <EmissionsForm
              vehicles={vehicles}
              factory={factory}
              environment={environment}
              onChangeVehicles={setVehicles}
              onChangeFactory={setFactory}
              onChangeEnvironment={setEnvironment}
              onResetToDefaults={handleResetToDefaults}
              theme={theme}
            />
            <div className="pt-2">
              <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                <Activity className="w-4 h-4 text-emerald-500" />
                Hasil Estimasi Polusi Real-Time Berdasarkan Parameter di Atas
              </h3>
              <PollutionCharts result={calculationResult} theme={theme} />
            </div>
          </div>
        )}

        {/* Feature View 4: Terpisah - Riwayat & Risiko Penyakit Polusi Udara */}
        {activeTab === 'kesehatan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      MODUL TERPISAH: Riwayat & Katalog Penyakit Polusi Udara
                    </h3>
                    <p className="text-xs text-slate-400">Anjuran medis, analisis risiko organ, dan katalog penyakit polusi lengkap</p>
                  </div>
                </div>
                <button
                  onClick={() => setDiseaseCatalogModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition shadow"
                >
                  Buka Katalog Full
                </button>
              </div>
              <HealthRiskSection 
                healthRisk={calculationResult.healthRisk} 
                level={calculationResult.level} 
                theme={theme}
                onOpenDiseaseCatalog={() => setDiseaseCatalogModalOpen(true)}
              />
            </div>
            
            {/* Panduan & Penjelasan Gas Polutan untuk Orang Awam */}
            <GasExplanationGuide pollutants={calculationResult.pollutants} theme={theme} />
            
            <PollutionCharts result={calculationResult} theme={theme} />
          </div>
        )}

        {/* Feature View 5: Rekomendasi Kebijakan Pemda & AI Roadmap */}
        {activeTab === 'mitigasi' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <PemdaMitigationCard
              policies={calculationResult.pemdaPolicies}
              level={calculationResult.level}
              onTriggerAiAnalysis={handleTriggerAiAnalysis}
              isAiLoading={isAiLoading}
              theme={theme}
            />
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Ringkasan Dampak Kesehatan Masyarakat
                </h3>
              </div>
              <HealthRiskSection 
                healthRisk={calculationResult.healthRisk} 
                level={calculationResult.level} 
                theme={theme}
                onOpenDiseaseCatalog={() => setDiseaseCatalogModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Feature View 6: Mode Lengkap (Full Dashboard Terorganisir & Terpisah) */}
        {(activeTab === 'semua' || !['map', 'calculator', 'kesehatan', 'mitigasi'].includes(activeTab)) && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Full Dashboard Banner Header */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/30' 
                : 'bg-gradient-to-r from-emerald-50 via-white to-slate-50 border-emerald-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`text-base font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Full Integrated Dashboard Polusi Pedia
                  </h2>
                  <p className="text-xs text-slate-400">
                    Seluruh modul pemantauan, peta terpadu GIS, simulasi emisi, dan medis terpisah dalam satu tampilan terpadu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Full Dashboard Ready
                </span>
              </div>
            </div>

            {/* SEKSI 1: PETA TERPADU WILAYAH & GIS RADAR SEBARAN */}
            <section className="space-y-4">
              <CombinedMap
                region={selectedRegion}
                calculationResult={calculationResult}
                onOpenCctv={() => setCctvModalOpen(true)}
                theme={theme}
              />
            </section>

            {/* SEKSI 2: GRAFIK & MONITORING ISPU REAL-TIME */}
            <section className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      SEKSI 2: Monitoring Indeks ISPU & Grafik Parameter Polutan
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tren histori jam-ke-jam, konsentrasi PM2.5, NO2, SO2, CO, dan O3
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                  GRAPH & CHARTS
                </span>
              </div>
              <PollutionCharts result={calculationResult} theme={theme} />
            </section>

            {/* SEKSI 3: KALKULATOR EMISI VEHICLE & INDUSTRY */}
            <section className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      SEKSI 3: Kalkulator Simulasi Parameter Emisi & Cuaca
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pengaturan jumlah kendaraan, daya produksi pabrik, kecepatan angin, dan kelembapan
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hidden sm:inline-block">
                  SIMULASI PARAMETER
                </span>
              </div>
              <EmissionsForm
                vehicles={vehicles}
                factory={factory}
                environment={environment}
                onChangeVehicles={setVehicles}
                onChangeFactory={setFactory}
                onChangeEnvironment={setEnvironment}
                onResetToDefaults={handleResetToDefaults}
                theme={theme}
              />
            </section>

            {/* SEKSI 4: MODUL TERPISAH RISIKO KESEHATAN & MEDIS */}
            <section className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      SEKSI 4: Modul Terpisah Risiko Kesehatan & Katalog Penyakit Polusi
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluasi medis WHO, proteksi populasi rentan, rekomendasi APD/masker, dan katalog 8 penyakit
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hidden sm:inline-block">
                  TERPISAH • ANALISIS MEDIS
                </span>
              </div>
              <HealthRiskSection 
                healthRisk={calculationResult.healthRisk} 
                level={calculationResult.level} 
                theme={theme}
                onOpenDiseaseCatalog={() => setDiseaseCatalogModalOpen(true)}
              />
            </section>

            {/* SEKSI 5: REKOMENDASI KEBIJAKAN PEMDA & AI ROADMAP */}
            <section className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      SEKSI 5: Rekomendasi Kebijakan Pemda & AI Strategy Roadmap
                    </h3>
                    <p className="text-xs text-slate-400">
                      Panduan regulasi daerah (WFH, Ganjil-Genap, Uji Emisi) dan analisis kecerdasan buatan Gemini AI
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hidden sm:inline-block">
                  REGULASI & AI GEMINI
                </span>
              </div>
              <PemdaMitigationCard
                policies={calculationResult.pemdaPolicies}
                level={calculationResult.level}
                onTriggerAiAnalysis={handleTriggerAiAnalysis}
                isAiLoading={isAiLoading}
                theme={theme}
              />
            </section>

          </div>
        )}

      </main>

      {/* CCTV Camera Feed Modal */}
      <CctvModal
        isOpen={cctvModalOpen}
        onClose={() => setCctvModalOpen(false)}
        region={selectedRegion}
        ispuScore={calculationResult.ispuScore}
        theme={theme}
      />

      {/* AI Analysis Modal */}
      <AiAnalysisModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        data={aiData}
        calculation={calculationResult}
        regionName={selectedRegion ? selectedRegion.name : 'Wilayah Pengamatan Custom'}
        theme={theme}
      />

      {/* Disease Catalog Modal */}
      <DiseaseCatalogModal
        isOpen={diseaseCatalogModalOpen}
        onClose={() => setDiseaseCatalogModalOpen(false)}
        currentIspuScore={calculationResult.ispuScore}
        currentPollutionLevel={calculationResult.level}
        theme={theme}
      />


      {/* Footer */}
      <footer className={`border-t mt-12 py-6 text-xs transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-white border-slate-200 text-slate-600'
          : 'bg-slate-900 border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Sistem Pemantauan Polusi Pedia AI Pemda • Berbasis Standar KLHK RI & AI Gemini</span>
          </div>
          <div className={`flex items-center gap-4 ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-500'
          }`}>
            <span>Level 1: AMAN (0-50)</span>
            <span>Level 2: WASPADA (51-150)</span>
            <span>Level 3: BERBAHAYA (151+)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
