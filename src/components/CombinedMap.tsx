import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Video,
  Maximize2,
  Minimize2,
  Layers,
  Activity,
  X,
  Eye,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { RegionPreset, PollutionCalculationResult } from '../types';
import { RegionMap } from './RegionMap';
import { PollutionRadiusMap } from './PollutionRadiusMap';

interface CombinedMapProps {
  region: RegionPreset | null;
  calculationResult: PollutionCalculationResult;
  onOpenCctv: () => void;
  theme?: 'dark' | 'light';
}

export const CombinedMap: React.FC<CombinedMapProps> = ({
  region,
  calculationResult,
  onOpenCctv,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [mapMode, setMapMode] = useState<'both' | 'region' | 'radius'>('both');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!region) return null;

  const renderMapContent = (inFullscreen = false) => (
    <div className="space-y-4">
      {/* Map Header / Toolbar */}
      <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        {/* Title & Status */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500 border border-sky-500/20 shrink-0">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Peta Terpadu Wilayah & GIS Radar Sebaran
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                GPS & SENSOR LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {region.name} • {region.province} (Skor ISPU: <strong className="text-emerald-500">{calculationResult.ispuScore}</strong>)
            </p>
          </div>
        </div>

        {/* View Mode Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Mode Switcher Tabs */}
          <div className={`flex items-center p-1 rounded-lg border text-xs font-semibold ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'
          }`}>
            <button
              onClick={() => setMapMode('both')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapMode === 'both'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Keduanya
            </button>
            <button
              onClick={() => setMapMode('region')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapMode === 'region'
                  ? 'bg-sky-600 text-white font-bold shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Peta Sensor
            </button>
            <button
              onClick={() => setMapMode('radius')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapMode === 'radius'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Radar GIS
            </button>
          </div>

          {/* Direct CCTV Live Stream Launcher */}
          <button
            onClick={onOpenCctv}
            title="Buka Kamera CCTV Live Pemantauan Udara"
            className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 bg-rose-600 text-white border-rose-500 hover:bg-rose-700 shadow-sm transition"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <Video className="w-3.5 h-3.5" />
            <span>Lihat CCTV Live</span>
          </button>

          {/* Fullscreen Enlarge Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Kecilkan Tampilan Peta" : "Perbesar Peta Layar Penuh"}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition ${
              isFullscreen
                ? 'bg-amber-600 text-white border-amber-500 hover:bg-amber-700'
                : isLight ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-white" />
                <span>Kecilkan</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-sky-500" />
                <span>Perbesar Map</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Views Display Layout */}
      {mapMode === 'both' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-sky-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Peta Sensor & Zona Sub-Wilayah
              </span>
              <span className="text-[10px] text-slate-400">Klik zona untuk skor ISPU</span>
            </div>
            <RegionMap
              region={region}
              calculationResult={calculationResult}
              onOpenCctv={onOpenCctv}
              theme={theme}
            />
          </div>

          <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-purple-500 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                GIS Radar Radius Plume Asap & GPS User
              </span>
              <span className="text-[10px] text-slate-400">Peta Interaktif Leaflet</span>
            </div>
            <PollutionRadiusMap
              region={region}
              calculationResult={calculationResult}
              onOpenCctv={onOpenCctv}
              theme={theme}
            />
          </div>
        </div>
      )}

      {mapMode === 'region' && (
        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-sky-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Peta Sensor & Zona Sub-Wilayah ({region.subZones.length} Sub-Zona)
            </span>
          </div>
          <RegionMap
            region={region}
            calculationResult={calculationResult}
            onOpenCctv={onOpenCctv}
            theme={theme}
          />
        </div>
      )}

      {mapMode === 'radius' && (
        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-purple-500 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Radar GIS Radius Sebaran Asap & Pemetaan GPS
            </span>
          </div>
          <PollutionRadiusMap
            region={region}
            calculationResult={calculationResult}
            onOpenCctv={onOpenCctv}
            theme={theme}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Normal On-Page Map Display */}
      <div className={`p-4 rounded-2xl border transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'
      }`}>
        {renderMapContent(false)}
      </div>

      {/* Expanded / Fullscreen Modal Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 flex flex-col justify-start">
          <div className={`max-w-7xl w-full mx-auto p-4 sm:p-6 rounded-2xl border shadow-2xl my-auto ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase">
                  MODE MAP PERBESAR FULLSCREEN
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Tampilan Maksimal Peta Wilayah & Radius GIS
                </span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderMapContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
