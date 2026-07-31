import React, { useState, useEffect } from 'react';
import { Wind, ShieldAlert, Cpu, Activity, MapPin, Sliders, RefreshCw, Video, Sun, Moon, Stethoscope, Compass, Building2, LayoutGrid, HeartPulse, ChevronRight } from 'lucide-react';

import { REGION_PRESETS } from '../data/regions';
import { RegionPreset } from '../types';

interface HeaderProps {
  selectedRegion: RegionPreset | null;
  onSelectRegion: (region: RegionPreset) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimulating: boolean;
  onToggleSimulating: () => void;
  lastUpdatedTime: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCctv?: () => void;
  onOpenDiseaseCatalog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRegion,
  onSelectRegion,
  activeTab,
  setActiveTab,
  isSimulating,
  onToggleSimulating,
  lastUpdatedTime,
  theme,
  onToggleTheme,
  onOpenCctv,
  onOpenDiseaseCatalog,
}) => {

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) +
          ' • ' +
          now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="app-header" className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'} border-b sticky top-0 z-30 shadow-md transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-emerald-500 ${theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
              <Wind className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Polusi Pedia <span className="text-emerald-500">AI</span>
                </h1>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 ${
                  theme === 'dark' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  <Cpu className="w-3 h-3" /> Pemda Real-Time
                </span>
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Better Future and New Environment
              </p>
            </div>
          </div>

          {/* Controls & Region Switcher */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Live Regional Selector */}
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm ${
              theme === 'dark' ? 'bg-slate-800/80 border-slate-700/80 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <select
                id="region-select"
                value={selectedRegion?.id || ''}
                onChange={(e) => {
                  const region = REGION_PRESETS.find((r) => r.id === e.target.value);
                  if (region) onSelectRegion(region);
                }}
                className={`bg-transparent text-xs sm:text-sm font-medium focus:outline-none cursor-pointer pr-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                <option value="" className={theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800'}>
                  Custom Mode (Manual Input)
                </option>
                {REGION_PRESETS.map((r) => (
                  <option key={r.id} value={r.id} className={theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800'}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                theme === 'dark'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-100 text-amber-600 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>Mode Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Mode Gelap</span>
                </>
              )}
            </button>

            {/* Live Simulation Pulse Toggle */}
            <button
              id="toggle-simulation-btn"
              onClick={onToggleSimulating}
              title={isSimulating ? 'Jeda Simulasi Real-time' : 'Mulai Simulasi Real-time'}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                isSimulating
                  ? theme === 'dark' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-emerald-100 border-emerald-400 text-emerald-800'
                  : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-500' : ''}`} />
              {isSimulating ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live
                </span>
              ) : (
                'Paused'
              )}
            </button>

          </div>
        </div>

        {/* Simplified Header Quick Navigation Tabs */}
        <div className={`mt-3 pt-2.5 border-t text-xs flex flex-wrap items-center justify-between gap-2 ${
          theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          {/* Main Navigation Tab Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('semua')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'semua' || !['map', 'calculator', 'mitigasi', 'kesehatan'].includes(activeTab)
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Full Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'map' || activeTab === 'monitor' || activeTab === 'radius'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Peta & GIS Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Kalkulator Emisi</span>
            </button>

            <button
              onClick={() => setActiveTab('mitigasi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'mitigasi'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Mitigasi Pemda</span>
            </button>
          </div>

          {/* Dedicated Quick Action Triggers for Disease History & CCTV */}
          <div className="flex items-center gap-2">
            {onOpenDiseaseCatalog && (
              <button
                onClick={onOpenDiseaseCatalog}
                title="Buka Katalog & Riwayat Penyakit Polusi Udara"
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  theme === 'dark'
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                    : 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Riwayat Penyakit</span>
              </button>
            )}

            {onOpenCctv && (
              <button
                onClick={onOpenCctv}
                title="Buka CCTV Pemantau Polusi Real-Time"
                className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 bg-rose-600 text-white border-rose-500 hover:bg-rose-700 shadow-sm transition"
              >
                <Video className="w-3.5 h-3.5" />
                <span>CCTV Live</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-header live ticker */}
        <div className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between text-[11px] ${
          theme === 'dark' ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          <div className="flex items-center gap-2">
            <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>Waktu Sistem:</span>
            <span className={`font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{currentTime || 'Loading clock...'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Update Terakhir: <strong className={`font-mono ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{lastUpdatedTime}</strong>
            </span>
            <span className={theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}>•</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              KLHK / Permen LHK No. 14 Tahun 2020 Standard
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
