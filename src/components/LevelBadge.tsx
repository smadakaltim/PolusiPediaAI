import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, Flame, Car, Factory, Wind } from 'lucide-react';
import { PollutionCalculationResult, PollutionLevel } from '../types';

interface LevelBadgeProps {
  result: PollutionCalculationResult;
  regionName: string;
  theme?: 'dark' | 'light';
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ result, regionName, theme = 'dark' }) => {
  const { ispuScore, level, primaryPollutant, pollutants, sources } = result;

  const isLight = theme === 'light';

  // Level Styling Configuration
  const levelConfigs: Record<
    PollutionLevel,
    {
      title: string;
      subtitle: string;
      bgGradient: string;
      borderColor: string;
      badgeColor: string;
      textColor: string;
      scoreBg: string;
      icon: React.ReactNode;
      barBg: string;
    }
  > = {
    AMAN: {
      title: 'KATEGORI 1: AMAN (GOOD AIR QUALITY)',
      subtitle: 'Kualitas udara sangat bersih dan sehat. Bebas dari paparan risiko polusi tinggi.',
      bgGradient: isLight ? 'from-emerald-50 via-white to-white' : 'from-emerald-950/80 via-slate-900 to-slate-900',
      borderColor: isLight ? 'border-emerald-300' : 'border-emerald-500/40',
      badgeColor: 'bg-emerald-500 text-slate-950 font-extrabold',
      textColor: isLight ? 'text-emerald-700' : 'text-emerald-400',
      scoreBg: isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
      barBg: 'bg-emerald-500',
    },
    WASPADA: {
      title: 'KATEGORI 2: WASPADA (MODERATE / WARNING)',
      subtitle: 'Kualitas udara dalam ambang batas sedang. Perlu kewaspadaan khusus untuk kelompok rentan.',
      bgGradient: isLight ? 'from-amber-50 via-white to-white' : 'from-amber-950/80 via-slate-900 to-slate-900',
      borderColor: isLight ? 'border-amber-300' : 'border-amber-500/40',
      badgeColor: 'bg-amber-500 text-slate-950 font-extrabold',
      textColor: isLight ? 'text-amber-800' : 'text-amber-400',
      scoreBg: isLight ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      icon: <AlertTriangle className="w-10 h-10 text-amber-500 animate-bounce" />,
      barBg: 'bg-amber-500',
    },
    BERBAHAYA: {
      title: 'KATEGORI 3: BERBAHAYA (HAZARDOUS / SEVERE)',
      subtitle: 'KONDISI DARURAT POLUSI! Udara sangat beracun dan membahayakan kesehatan populasi umum.',
      bgGradient: isLight ? 'from-rose-50 via-white to-white' : 'from-rose-950/90 via-slate-900 to-slate-900',
      borderColor: isLight ? 'border-rose-300' : 'border-rose-500/60',
      badgeColor: 'bg-rose-600 text-white font-extrabold shadow-lg shadow-rose-900/20',
      textColor: isLight ? 'text-rose-700' : 'text-rose-400',
      scoreBg: isLight ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-rose-500/20 border-rose-500/40 text-rose-300',
      icon: <AlertOctagon className="w-10 h-10 text-rose-600 animate-pulse" />,
      barBg: 'bg-rose-600',
    },
  };

  const config = levelConfigs[level];

  // Calculate percentage indicator for ISPU Meter (0 to 300+)
  const meterPercentage = Math.min(100, Math.max(5, (ispuScore / 300) * 100));

  return (
    <div
      id="level-badge-card"
      className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} p-5 sm:p-6 shadow-xl transition-all duration-300 ${
        isLight ? 'text-slate-800' : 'text-slate-100'
      }`}
    >
      {/* Background Subtle Accent */}
      <div className={`absolute -right-12 -top-12 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-slate-200/50' : 'bg-slate-800/20'
      }`}></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Status & Description */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${config.badgeColor}`}>
              {level}
            </span>
            <span className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-md border ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}>
              <Info className="w-3.5 h-3.5 opacity-70" />
              {regionName}
            </span>
          </div>

          <div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${config.textColor} flex items-center gap-3`}>
              {config.icon}
              {config.title}
            </h2>
            <p className={`text-sm mt-1 max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {config.subtitle}
            </p>
          </div>

          {/* Primary Pollutant Info */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isLight ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
            }`}>
              <Flame className="w-4 h-4 text-amber-500" />
              <span>
                Polutan Dominan: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-semibold'}>{primaryPollutant}</strong>
              </span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isLight ? 'bg-sky-50/80 border-sky-200 text-sky-900' : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
            }`}>
              <Wind className="w-4 h-4 text-sky-500" />
              <span>
                Konsentrasi PM2.5: <strong className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{pollutants.pm25} µg/m³</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Large ISPU Score & Gauge */}
        <div className={`flex flex-col items-center lg:items-end justify-center min-w-[200px] border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <span className={`text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Indeks Standar Pencemar Udara (ISPU)
          </span>

          <div className={`mt-1 mb-2 px-6 py-2 rounded-2xl border ${config.scoreBg} flex items-baseline gap-1 shadow-inner`}>
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">{ispuScore}</span>
            <span className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>/ 500</span>
          </div>

          {/* ISPU Meter Progress Bar */}
          <div className={`w-full max-w-[220px] rounded-full h-2.5 overflow-hidden border mt-1 ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800/90 border-slate-700/60'
          }`}>
            <div
              className={`h-full ${config.barBg} transition-all duration-700 ease-out`}
              style={{ width: `${meterPercentage}%` }}
            ></div>
          </div>

          <div className={`flex justify-between text-[10px] w-full max-w-[220px] mt-1 font-mono ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span>0 (Aman)</span>
            <span>150 (Waspada)</span>
            <span>300+ (Bahaya)</span>
          </div>
        </div>

      </div>

      {/* Quick Source Balance Bar */}
      <div className={`mt-5 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs ${
        isLight ? 'border-slate-200' : 'border-slate-800/80'
      }`}>
        <div className={`rounded-xl p-2.5 border flex items-center justify-between ${
          isLight ? 'bg-sky-50/60 border-sky-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-sky-500" />
            <span>Emisi Kendaraan (Transportasi):</span>
          </div>
          <span className={`font-mono font-bold ${isLight ? 'text-sky-800' : 'text-sky-300'}`}>
            {sources.vehicleSharePercent}% ({sources.vehicleEmissionsKgDay.toLocaleString('id-ID')} kg/hari)
          </span>
        </div>

        <div className={`rounded-xl p-2.5 border flex items-center justify-between ${
          isLight ? 'bg-purple-50/60 border-purple-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-purple-500" />
            <span>Emisi Pabrik (Industri & PLTU):</span>
          </div>
          <span className={`font-mono font-bold ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>
            {sources.factorySharePercent}% ({sources.factoryEmissionsKgDay.toLocaleString('id-ID')} kg/hari)
          </span>
        </div>
      </div>

    </div>
  );
};
