import React, { useState } from 'react';
import {
  Compass,
  CloudRain,
  Droplets,
  Users,
  Radio,
  Video,
  MapPin,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Info,
  Wind,
  Shield,
  Activity,
  Maximize2
} from 'lucide-react';
import {
  RegionPreset,
  PollutionCalculationResult,
  MapSubZone,
  PollutionLevel,
} from '../types';

interface RegionMapProps {
  region: RegionPreset | null;
  calculationResult: PollutionCalculationResult;
  onOpenCctv: () => void;
  theme?: 'dark' | 'light';
}

export const RegionMap: React.FC<RegionMapProps> = ({
  region,
  calculationResult,
  onOpenCctv,
  theme = 'dark',
}) => {
  const [selectedSubZone, setSelectedSubZone] = useState<MapSubZone | null>(null);

  if (!region) return null;

  const isLight = theme === 'light';
  const currentLevel = calculationResult.level;
  const ispu = calculationResult.ispuScore;
  const env = region.environment;

  // Determine Zone Color Class
  const getZoneColorClass = (lvl: PollutionLevel) => {
    switch (lvl) {
      case 'AMAN':
        return {
          bg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/10',
          border: isLight ? 'border-emerald-300' : 'border-emerald-500/40',
          text: isLight ? 'text-emerald-700' : 'text-emerald-400',
          badgeBg: 'bg-emerald-500',
          hex: '#10b981',
          shadow: isLight ? 'shadow-sm' : 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
        };
      case 'WASPADA':
        return {
          bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10',
          border: isLight ? 'border-amber-300' : 'border-amber-500/40',
          text: isLight ? 'text-amber-800' : 'text-amber-400',
          badgeBg: 'bg-amber-500',
          hex: '#f59e0b',
          shadow: isLight ? 'shadow-sm' : 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
        };
      case 'BERBAHAYA':
        return {
          bg: isLight ? 'bg-rose-50' : 'bg-rose-500/10',
          border: isLight ? 'border-rose-300' : 'border-rose-500/40',
          text: isLight ? 'text-rose-700' : 'text-rose-400',
          badgeBg: 'bg-rose-500',
          hex: '#ef4444',
          shadow: isLight ? 'shadow-sm' : 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        };
    }
  };

  const zoneTheme = getZoneColorClass(currentLevel);

  // Sub-zones calculated ISPU
  const subZonesWithScores: MapSubZone[] = region.subZones.map((sz) => {
    const szIspu = Math.max(12, Math.min(500, ispu + sz.ispuScoreOffset));
    let szLvl: PollutionLevel = 'AMAN';
    if (szIspu > 150) szLvl = 'BERBAHAYA';
    else if (szIspu > 50) szLvl = 'WASPADA';

    return {
      ...sz,
      ispuScore: szIspu,
      level: szLvl,
    };
  });

  const activeSubZone = selectedSubZone
    ? subZonesWithScores.find((sz) => sz.id === selectedSubZone.id) || subZonesWithScores[0]
    : subZonesWithScores[0];

  return (
    <div className={`border rounded-2xl p-5 md:p-6 space-y-6 shadow-xl transition-colors duration-200 ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Top Header & Population Overview */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5 ${
        isLight ? 'border-slate-200' : 'border-slate-800/80'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl text-emerald-500 ${
              isLight ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-500/10 border border-emerald-500/30'
            }`}>
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Peta Pemantauan Wilayah & Node Sensor IoT AirPulse
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {region.name} • Koordinat: {region.coordinates.lat}, {region.coordinates.lng}
              </p>
            </div>
          </div>
        </div>

        {/* Population Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`px-3.5 py-2 rounded-xl border flex items-center gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <Users className="w-4 h-4 text-cyan-500" />
            <div>
              <div className={`text-[10px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Penduduk</div>
              <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {region.populationTotal.toLocaleString('id-ID')} jiwa
              </div>
            </div>
          </div>

          <div className={`px-3.5 py-2 rounded-xl border flex items-center gap-3 ${
            isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <Shield className="w-4 h-4 text-amber-500" />
            <div>
              <div className={`text-[10px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Estimasi Terdampak</div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {calculationResult.affectedPopulationEstimate.toLocaleString('id-ID')} jiwa
              </div>
            </div>
          </div>

          {/* CCTV Quick Trigger Button */}
          <button
            onClick={onOpenCctv}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            CCTV Real-Time
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Meteorological Compass Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Visual Map Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Map Container Canvas / Frame */}
          <div className={`relative border rounded-2xl p-4 overflow-hidden min-h-[360px] flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-100'
          } ${zoneTheme.border} ${zoneTheme.shadow}`}>
            
            {/* Grid Overlay / Radar Scan lines */}
            <div className={`absolute inset-0 [background-size:16px_16px] opacity-40 pointer-events-none ${
              isLight ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]' : 'bg-[radial-gradient(#1e293b_1px,transparent_1px)]'
            }`} />

            {/* Radar Scan Light Beam Animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 animate-pulse pointer-events-none" />

            {/* Map Top Status Bar */}
            <div className={`relative z-10 flex items-center justify-between gap-2 border backdrop-blur-md px-3.5 py-2 rounded-xl text-xs ${
              isLight ? 'bg-slate-50/95 border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-900/90 border-slate-800/90 text-white'
            }`}>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-ping" />
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{region.sensorDeviceId}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                  isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  ONLINE • 10 SEC UPDATE
                </span>
              </div>

              {/* Status Badge */}
              <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${zoneTheme.bg} ${zoneTheme.text} border ${zoneTheme.border}`}>
                ZONA: {currentLevel} (ISPU {ispu})
              </div>
            </div>

            {/* Visual Sub-Zone Map Nodes (Grid Layout) */}
            <div className="relative z-10 my-6 grid grid-cols-2 gap-3 sm:gap-4">
              {subZonesWithScores.map((sz) => {
                const szTheme = getZoneColorClass(sz.level);
                const isSelected = activeSubZone.id === sz.id;

                return (
                  <button
                    key={sz.id}
                    onClick={() => setSelectedSubZone(sz)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      isLight ? `${szTheme.bg} bg-white shadow-sm hover:bg-slate-50` : szTheme.bg
                    } ${szTheme.border} ${
                      isSelected ? 'ring-2 ring-emerald-500 scale-[1.02] shadow-md' : 'hover:scale-[1.01] hover:border-slate-400'
                    }`}
                  >
                    {/* Zone color status indicator dot */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {sz.districtType}
                      </span>
                      <span className={`w-2.5 h-2.5 rounded-full ${szTheme.badgeBg} animate-pulse`} />
                    </div>

                    <h4 className={`text-xs font-bold transition ${
                      isLight ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-300'
                    }`}>
                      {sz.name}
                    </h4>

                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-[11px] font-mono ${
                        isLight ? 'text-slate-700 font-semibold' : 'text-slate-300'
                      }`}>ISPU: {sz.ispuScore}</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${szTheme.text} ${
                        isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-950/80'
                      }`}>
                        {sz.level}
                      </span>
                    </div>

                    {/* IoT Sensor Marker Icon */}
                    <div className="absolute -bottom-2 -right-2 opacity-15 group-hover:opacity-30 transition">
                      <Radio className={`w-12 h-12 ${isLight ? 'text-slate-800' : 'text-slate-100'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Bottom Legend: Zone Color Legend */}
            <div className={`relative z-10 border backdrop-blur-md p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs ${
              isLight ? 'bg-slate-50/95 border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-900/90 border-slate-800/90 text-slate-100'
            }`}>
              <span className={`font-semibold flex items-center gap-1.5 ${
                isLight ? 'text-slate-700' : 'text-slate-400'
              }`}>
                <Layers className="w-3.5 h-3.5 text-emerald-500" /> Lagenda Zona Polusi:
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Aman (0-50)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                  <span className="text-amber-800 dark:text-amber-400 font-bold">Waspada (51-150)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                  <span className="text-rose-700 dark:text-rose-400 font-bold">Bahaya (151+)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Selected Sub-Zone Detail Bar */}
          <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                Mikro-Node Aktif: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{activeSubZone.name}</strong> ({activeSubZone.districtType}) • Nilai ISPU Area: <strong className={getZoneColorClass(activeSubZone.level).text}>{activeSubZone.ispuScore}</strong>
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Meteorological Parameters (Wind Direction, Humidity, Rainfall) (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <h3 className={`text-sm font-bold flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <Wind className="w-4 h-4 text-cyan-500" />
            Parameter Meteorologi & Cuaca Lapangan
          </h3>

          {/* 1. Wind Direction Compass Rose */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 text-xs font-bold ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                <Compass className="w-4 h-4 text-emerald-500" />
                Arah Mata Angin
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {env.windDirection} ({env.windDirectionDegrees}°)
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Visual Compass Needle Container */}
              <div className={`relative w-20 h-20 border rounded-full flex items-center justify-center flex-shrink-0 shadow-inner ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700/80'
              }`}>
                {/* Compass Directions Labels */}
                <span className="absolute top-1 text-[9px] font-bold text-slate-400">U</span>
                <span className="absolute right-1 text-[9px] font-bold text-slate-400">T</span>
                <span className="absolute bottom-1 text-[9px] font-bold text-slate-400">S</span>
                <span className="absolute left-1 text-[9px] font-bold text-slate-400">B</span>

                {/* Rotating Needle */}
                <div
                  className="w-1 h-12 bg-gradient-to-t from-rose-500 to-cyan-400 rounded-full transition-transform duration-700 shadow-lg"
                  style={{ transform: `rotate(${env.windDirectionDegrees}deg)` }}
                />
                <div className={`w-3 h-3 border-2 rounded-full z-10 ${
                  isLight ? 'bg-slate-800 border-white' : 'bg-white border-slate-900'
                }`} />
              </div>

              <div className={`text-xs space-y-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <div>
                  Kecepatan Angin: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{env.windSpeedKmh} km/jam</strong>
                </div>
                <div className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Angin berhembus menuju arah opposite ({env.windDirection}), membawa sebaran polutan dari pusat kawasan industri/jalan ke pemukiman.
                </div>
              </div>
            </div>
          </div>

          {/* 2. Air Humidity % */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={`flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <Droplets className="w-4 h-4 text-cyan-500" /> Kelembapan Udara
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono">{env.humidityPercent}%</span>
            </div>

            {/* Progress bar */}
            <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, env.humidityPercent)}%` }}
              />
            </div>

            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {env.humidityPercent >= 80
                ? 'Kelembapan udara tinggi (>80%) memicu kondensasi uap dan memperlambat pembubaran debu PM2.5.'
                : 'Kelembapan sedang, tingkat dispersi aerosol tergolong stabil.'}
            </p>
          </div>

          {/* 3. Rainfall (Curah Hujan mm/hr) */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={`flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <CloudRain className="w-4 h-4 text-blue-500" /> Curah Hujan & Peluruhan Polusi
              </span>
              <span className={`font-mono ${env.rainfallMmHr > 0 ? 'text-blue-600 dark:text-blue-400 font-bold' : isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {env.rainfallMmHr} mm/jam
              </span>
            </div>

            <div className={`p-2.5 border rounded-lg text-[11px] space-y-1 ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div className="font-semibold text-blue-600 dark:text-blue-300">{env.rainfallCondition}</div>
              <div className={`leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{calculationResult.rainfallEffectText}</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
