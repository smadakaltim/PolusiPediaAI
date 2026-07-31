import React, { useState, useMemo } from 'react';
import { POLLUTION_DISEASES, PollutionDisease } from '../data/diseasesData';
import { PollutionLevel } from '../types';
import { 
  X, Search, Stethoscope, AlertTriangle, ShieldCheck, HeartPulse, 
  Activity, Baby, Eye, Brain, Flame, Info, CheckCircle2, ChevronRight,
  Filter, Sparkles, UserX, ShieldAlert
} from 'lucide-react';

interface DiseaseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIspuScore?: number;
  currentPollutionLevel?: PollutionLevel;
  theme?: 'dark' | 'light';
}

export const DiseaseCatalogModal: React.FC<DiseaseCatalogModalProps> = ({
  isOpen,
  onClose,
  currentIspuScore = 85,
  currentPollutionLevel = 'WASPADA',
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>(POLLUTION_DISEASES[0].id);

  if (!isOpen) return null;

  const categories = ['Semua', 'Respiratori Akut', 'Respiratori Kronis', 'Kardiovaskular', 'Mata & Kulit', 'Saraf & Perkembangan', 'Onkologi'];

  const filteredDiseases = POLLUTION_DISEASES.filter((disease) => {
    const matchesCategory = selectedCategory === 'Semua' || disease.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      disease.name.toLowerCase().includes(query) ||
      disease.shortDesc.toLowerCase().includes(query) ||
      disease.pollutants.some(p => p.toLowerCase().includes(query)) ||
      disease.symptoms.some(s => s.toLowerCase().includes(query)) ||
      disease.riskGroups.some(r => r.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const activeDisease = POLLUTION_DISEASES.find(d => d.id === selectedDiseaseId) || POLLUTION_DISEASES[0];

  const getDiseaseIcon = (iconType: PollutionDisease['iconType']) => {
    switch (iconType) {
      case 'ispa':
        return <Activity className="w-5 h-5 text-sky-500" />;
      case 'asma':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'copd':
        return <Stethoscope className="w-5 h-5 text-purple-500" />;
      case 'heart':
        return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'eye':
        return <Eye className="w-5 h-5 text-amber-500" />;
      case 'cancer':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'brain':
        return <Brain className="w-5 h-5 text-pink-500" />;
      default:
        return <Stethoscope className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getSeverityBadge = (severity: PollutionDisease['severity']) => {
    switch (severity) {
      case 'Kritis':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">RISIKO KRITIS</span>;
      case 'Tinggi':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">RISIKO TINGGI</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30">RISIKO SEDANG</span>;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md overflow-y-auto ${
      isLight ? 'bg-slate-900/60' : 'bg-slate-950/80'
    }`}>
      <div className={`relative w-full max-w-5xl border rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700/80 text-slate-100'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b gap-3 ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 border rounded-xl text-emerald-500 ${
              isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/20 border-emerald-500/40'
            }`}>
              <Stethoscope className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Katalog & Panduan Penyakit Akibat Polusi Udara
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  STANDAR MEDIS KLHK / WHO
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Panduan komprehensif gejala, pemicu polutan, pertolongan pertama, dan pencegahan kesehatan masyarakat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Active ISPU Badge context */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono ${
              currentPollutionLevel === 'BERBAHAYA' 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400' 
                : currentPollutionLevel === 'WASPADA'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            }`}>
              <Activity className="w-3.5 h-3.5" />
              <span>ISPU Saat Ini: <strong>{currentIspuScore}</strong> ({currentPollutionLevel})</span>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition ${
                isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className={`p-4 border-b space-y-3 ${
          isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-2.5 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari penyakit, gejala (mis: batuk, sesak, mata), atau polutan (PM2.5)..."
                className={`w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none transition ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500' 
                    : 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            <span className={`text-[11px] font-semibold mr-1 shrink-0 flex items-center gap-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <Filter className="w-3 h-3" /> Kategori:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition text-xs shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isLight
                      ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Main Content (Split View: Disease List vs Detailed View) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Column: Diseases List (5 cols) */}
          <div className={`lg:col-span-5 border-r overflow-y-auto p-3 space-y-2.5 max-h-[500px] lg:max-h-none ${
            isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/40'
          }`}>
            <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <span>Daftar Penyakit ({filteredDiseases.length})</span>
              <span>Klik untuk detail</span>
            </div>

            {filteredDiseases.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Tidak ada penyakit yang cocok dengan pencarian "{searchQuery}".
              </div>
            ) : (
              filteredDiseases.map((d) => {
                const isSelected = d.id === selectedDiseaseId;
                const isHeightenedRisk = currentPollutionLevel === d.ispuTriggerLevel || (currentPollutionLevel === 'BERBAHAYA' && d.ispuTriggerLevel === 'WASPADA');
                
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDiseaseId(d.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 relative group ${
                      isSelected
                        ? isLight
                          ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-slate-800/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                        : isLight
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isLight ? 'bg-slate-100' : 'bg-slate-950'
                    }`}>
                      {getDiseaseIcon(d.iconType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {d.category}
                        </span>
                        {getSeverityBadge(d.severity)}
                      </div>

                      <h4 className={`text-xs font-bold truncate ${
                        isSelected 
                          ? isLight ? 'text-emerald-700' : 'text-emerald-400'
                          : isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {d.name}
                      </h4>

                      <p className={`text-[11px] line-clamp-2 mt-1 leading-snug ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {d.shortDesc}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px]">
                        <div className="flex items-center gap-1 flex-wrap">
                          {d.pollutants.map((p) => (
                            <span key={p} className="px-1.5 py-0.2 rounded font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {p}
                            </span>
                          ))}
                        </div>

                        {isHeightenedRisk && (
                          <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Berisiko Naik Saat Ini
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 self-center transition ${
                      isSelected ? 'text-emerald-500 transform translate-x-0.5' : 'text-slate-400 opacity-50 group-hover:opacity-100'
                    }`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Disease View (7 cols) */}
          <div className="lg:col-span-7 p-5 overflow-y-auto space-y-5 max-h-[500px] lg:max-h-none">
            
            {/* Detail Title Header */}
            <div className={`p-4 border rounded-2xl space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {activeDisease.category}
                </span>
                {getSeverityBadge(activeDisease.severity)}
              </div>

              <div>
                <h3 className={`text-base sm:text-lg font-extrabold flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {getDiseaseIcon(activeDisease.iconType)}
                  {activeDisease.name}
                </h3>
                <p className={`text-xs mt-1.5 leading-relaxed font-medium ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {activeDisease.description}
                </p>
              </div>

              {/* Key Indicators Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Polutan Pemicu Utama:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {activeDisease.pollutants.map(p => (
                      <span key={p} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Waktu Onset / Kemunculan:</span>
                  <span className={`font-semibold text-[11px] block mt-0.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {activeDisease.incubationOrOnset}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Ambang ISPU Berisiko:</span>
                  <span className={`font-bold text-[11px] block mt-0.5 ${
                    activeDisease.ispuTriggerLevel === 'BERBAHAYA' ? 'text-rose-500' : 'text-amber-500'
                  }`}>
                    {activeDisease.ispuTriggerLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Gejala Klinis (Symptoms) */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                <Activity className="w-4 h-4 text-sky-500" />
                Gejala Klinis yang Harus Diwaspadai
              </h4>
              <div className={`p-3.5 border rounded-xl space-y-2 ${
                isLight ? 'bg-sky-50/50 border-sky-100' : 'bg-slate-950/80 border-slate-800'
              }`}>
                {activeDisease.symptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Populas Rentan (Risk Groups) */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                <Baby className="w-4 h-4 text-pink-500" />
                Kelompok Populasi Paling Rentan
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeDisease.riskGroups.map((group, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                      isLight
                        ? 'bg-pink-50 border-pink-200 text-pink-800'
                        : 'bg-pink-950/40 border-pink-500/30 text-pink-300'
                    }`}
                  >
                    <UserX className="w-3.5 h-3.5 text-pink-500" />
                    {group}
                  </span>
                ))}
              </div>
            </div>

            {/* Pertolongan Pertama (First Aid) & Pencegahan (Prevention) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* First Aid */}
              <div className={`p-4 border rounded-xl space-y-2.5 ${
                isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" /> Pertolongan Pertama
                </div>
                <ul className="space-y-2 text-xs">
                  {activeDisease.firstAid.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span className={isLight ? 'text-slate-800 font-medium' : 'text-slate-300'}>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention */}
              <div className={`p-4 border rounded-xl space-y-2.5 ${
                isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Langkah Pencegahan
                </div>
                <ul className="space-y-2 text-xs">
                  {activeDisease.prevention.map((prev, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span className={isLight ? 'text-slate-800 font-medium' : 'text-slate-300'}>{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Info className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Informasi dikompilasi berdasarkan pedoman medis Kementerian Kesehatan RI & WHO Air Quality Guidelines.</span>
          </div>

          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl font-semibold transition shrink-0 ${
              isLight ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            Tutup Katalog
          </button>
        </div>

      </div>
    </div>
  );
};
