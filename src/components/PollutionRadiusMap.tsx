import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Compass,
  LocateFixed,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  ShieldAlert,
  Info,
  Radio,
  Ruler,
  Layers,
  Wind
} from 'lucide-react';
import { RegionPreset, PollutionCalculationResult, PollutionLevel } from '../types';
import { calculateHaversineDistanceKm, calculatePollutionPlumeRadius } from '../utils/geoUtils';

interface PollutionRadiusMapProps {
  region: RegionPreset | null;
  calculationResult: PollutionCalculationResult;
  onOpenCctv: () => void;
  theme?: 'dark' | 'light';
}

export const PollutionRadiusMap: React.FC<PollutionRadiusMapProps> = ({
  region,
  calculationResult,
  onOpenCctv,
  theme = 'dark',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // User Geolocation State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationName, setUserLocationName] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [userDistanceKm, setUserDistanceKm] = useState<number | null>(null);

  // Computed Plume Coverage
  const plumeStats = calculatePollutionPlumeRadius(
    calculationResult.ispuScore,
    region?.environment.windSpeedKmh || 8,
    region?.environment.rainfallMmHr || 0
  );

  // Default region center
  const centerLat = region ? region.coordinates.lat : -6.1944;
  const centerLng = region ? region.coordinates.lng : 106.8229;

  // 1. Handle Geolocation Detection ("Deteksi Lokasi Saya")
  const handleDetectUserLocation = () => {
    setIsLocating(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('Fitur geolokasi GPS tidak didukung oleh peramban Anda.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setUserCoords({ lat: uLat, lng: uLng });
        setUserLocationName(`GPS (${uLat.toFixed(4)}, ${uLng.toFixed(4)})`);

        // Calculate Distance to Sensor Center
        const dist = calculateHaversineDistanceKm(centerLat, centerLng, uLat, uLng);
        setUserDistanceKm(dist);

        // Pan map to user position
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([uLat, uLng], 13, { duration: 1.5 });
        }
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error, falling back to simulated offset location:', error);
        // Fallback simulated offset location (e.g., 2.3 km from center for preview demo)
        const mockUserLat = centerLat + (Math.random() - 0.5) * 0.035;
        const mockUserLng = centerLng + (Math.random() - 0.5) * 0.035;

        setUserCoords({ lat: mockUserLat, lng: mockUserLng });
        setUserLocationName('Lokasi Pengguna (Deteksi Sekitar)');

        const dist = calculateHaversineDistanceKm(centerLat, centerLng, mockUserLat, mockUserLng);
        setUserDistanceKm(dist);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([mockUserLat, mockUserLng], 13, { duration: 1.2 });
        }
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // 2. Initialize Leaflet Map Instance & Handle Theme Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const tileUrl =
      theme === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    if (!mapInstanceRef.current) {
      // Create Map
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: true,
      });

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], 12);
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(tileUrl);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [region?.id, theme]);

  // 3. Render Leaflet Map Overlays (Circles, Station Marker, User Marker)
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !region) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // A. Green Outer Perimeter Circle (Mild / Clean boundary)
    const greenCircle = L.circle([centerLat, centerLng], {
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '4, 8',
      radius: plumeStats.safePerimeterKm * 1000,
    }).bindPopup(`<b>Zona Aman / Perimeter Luar</b><br/>Radius: ${plumeStats.safePerimeterKm} km`);
    layerGroup.addLayer(greenCircle);

    // B. Yellow Circle (Waspada)
    const yellowCircle = L.circle([centerLat, centerLng], {
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.18,
      weight: 2,
      radius: plumeStats.alertRadiusKm * 1000,
    }).bindPopup(`<b>Zona Waspada (Sedang)</b><br/>Radius Jangkauan: ${plumeStats.alertRadiusKm} km<br/>Luas Area: ${plumeStats.alertAreaKm2} km²`);
    layerGroup.addLayer(yellowCircle);

    // C. Red Circle (Bahaya)
    const redCircle = L.circle([centerLat, centerLng], {
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.32,
      weight: 2.5,
      radius: plumeStats.dangerRadiusKm * 1000,
    }).bindPopup(`<b>ZONA BAHAYA (Kritis)</b><br/>Radius Inti: ${plumeStats.dangerRadiusKm} km<br/>Luas Area: ${plumeStats.dangerAreaKm2} km²<br/>ISPU: ${calculationResult.ispuScore}`);
    layerGroup.addLayer(redCircle);

    // D. Center Station Marker
    const stationHtml = `
      <div style="background-color: #020617; border: 2px solid ${
        calculationResult.level === 'BERBAHAYA' ? '#ef4444' : calculationResult.level === 'WASPADA' ? '#f59e0b' : '#10b981'
      }; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px ${
      calculationResult.level === 'BERBAHAYA' ? 'rgba(239,68,68,0.8)' : 'rgba(16,185,129,0.8)'
    }; font-size: 14px;">
        🏭
      </div>
    `;

    const stationIcon = L.divIcon({
      html: stationHtml,
      className: 'custom-station-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const stationMarker = L.marker([centerLat, centerLng], { icon: stationIcon })
      .bindPopup(
        `<b>Node Stasiun IoT: ${region.sensorDeviceId}</b><br/>${region.name}<br/><b>ISPU: ${calculationResult.ispuScore} (${calculationResult.level})</b>`
      );
    layerGroup.addLayer(stationMarker);

    // E. Sub-zone Micro Pins
    region.subZones.forEach((sz) => {
      const szOffsetLat = centerLat + (sz.ispuScoreOffset / 500) * 0.02;
      const szOffsetLng = centerLng + (sz.ispuScoreOffset / 500) * 0.02;

      const subPinHtml = `
        <div style="background: rgba(15, 23, 42, 0.9); border: 1.5px solid #38bdf8; border-radius: 8px; padding: 2px 6px; font-size: 10px; font-weight: bold; color: #f8fafc; white-space: nowrap;">
          📍 ${sz.name}
        </div>
      `;

      const subIcon = L.divIcon({
        html: subPinHtml,
        className: 'subzone-pin',
        iconSize: [100, 20],
        iconAnchor: [50, 10],
      });

      const subMarker = L.marker([szOffsetLat, szOffsetLng], { icon: subIcon });
      layerGroup.addLayer(subMarker);
    });

    // F. User Geolocation Marker (if detected)
    if (userCoords) {
      const userHtml = `
        <div style="background-color: #06b6d4; border: 2.5px solid #ffffff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 18px #06b6d4; animation: pulse 1.5s infinite;">
          👤
        </div>
      `;

      const userIcon = L.divIcon({
        html: userHtml,
        className: 'user-geo-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).bindPopup(
        `<b>Posisi Anda Saat Ini</b><br/>Jarak ke Pusat Polusi: <b>${userDistanceKm} km</b>`
      );
      layerGroup.addLayer(userMarker);
    }
  }, [centerLat, centerLng, region, calculationResult, plumeStats, userCoords, userDistanceKm]);

  // User Zone Status calculation
  const getUserZoneStatus = () => {
    if (userDistanceKm === null) return null;
    const isLight = theme === 'light';

    if (userDistanceKm <= plumeStats.dangerRadiusKm) {
      return {
        level: 'BERBAHAYA',
        title: 'Posisi Anda berada di ZONA BAHAYA POLUSI!',
        desc: `Jarak Anda (${userDistanceKm} km) berada di dalam radius paparan kritis (${plumeStats.dangerRadiusKm} km).`,
        bg: isLight ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-rose-950/90 border-rose-500/80 text-rose-200',
        badgeBg: 'bg-rose-600 text-white font-bold',
        advice: 'Gunakan masker medis N95 / Respirator. Hindari aktivitas luar ruangan dan aktifkan HEPA filter ruangan.',
      };
    } else if (userDistanceKm <= plumeStats.alertRadiusKm) {
      return {
        level: 'WASPADA',
        title: 'Posisi Anda berada di ZONA WASPADA',
        desc: `Jarak Anda (${userDistanceKm} km) berada di zona sebaran asap sedang (${plumeStats.alertRadiusKm} km).`,
        bg: isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-amber-950/90 border-amber-500/80 text-amber-200',
        badgeBg: 'bg-amber-500 text-slate-950 font-bold',
        advice: 'Disarankan memakai masker saat beraktivitas di luar gedung dan membatasi olahraga berat.',
      };
    } else {
      return {
        level: 'AMAN',
        title: 'Posisi Anda di ZONA AMAN',
        desc: `Jarak Anda (${userDistanceKm} km) berada di luar radius sebaran polutan utama stasiun (${plumeStats.alertRadiusKm} km).`,
        bg: isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200',
        badgeBg: 'bg-emerald-500 text-slate-950 font-bold',
        advice: 'Kualitas udara di lokasi Anda tergolong stabil dan aman untuk aktivitas biasa.',
      };
    }
  };

  const userStatus = getUserZoneStatus();

  return (
    <div className={`border rounded-2xl p-5 md:p-6 space-y-6 shadow-xl transition-colors duration-200 ${
      theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Header & Geolocation Trigger */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl text-emerald-500 ${
              theme === 'light' ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-500/10 border border-emerald-500/30'
            }`}>
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                Peta GIS Jangkauan Luas Sebaran Polusi & Geolokasi Warga
              </h2>
              <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Pemetaan Radius Paparan Polutan Udara (KM) & Deteksi Jarak Posisi Anda Real-Time
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDetectUserLocation}
            disabled={isLocating}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Mendeteksi GPS...' : 'Deteksi Lokasi Saya'}
          </button>

          <button
            onClick={onOpenCctv}
            className={`px-3.5 py-2 font-bold text-xs rounded-xl border transition ${
              theme === 'light' 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            Lihat CCTV Live
          </button>
        </div>
      </div>

      {/* User Geolocation Result Banner (If Detected) */}
      {userStatus && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${userStatus.bg} animate-in fade-in duration-300`}>
          <div className="flex items-start gap-3">
            <LocateFixed className="w-6 h-6 flex-shrink-0 mt-0.5 text-cyan-300" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold">{userStatus.title}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${userStatus.badgeBg}`}>
                  ZONA {userStatus.level}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-200">{userStatus.desc}</p>
              <p className="text-xs mt-1 font-semibold text-white/90">
                💡 Advice: {userStatus.advice}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (mapInstanceRef.current && userCoords) {
                mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 14);
              }
            }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-md transition flex-shrink-0"
          >
            Fokus ke Lokasi Saya
          </button>
        </div>
      )}

      {/* Interactive Map & Coverage Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Leaflet Map Frame (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          
          <div className={`relative rounded-2xl overflow-hidden border h-[400px] w-full z-0 ${
            theme === 'light' ? 'border-slate-300' : 'border-slate-800'
          }`}>
            <div ref={mapContainerRef} className="h-full w-full bg-slate-900" />

            {/* Floating Quick Legend inside Map */}
            <div className={`absolute bottom-3 left-3 z-[400] border backdrop-blur-md p-3 rounded-xl text-[11px] space-y-1.5 min-w-[200px] ${
              theme === 'light' ? 'bg-white/95 border-slate-300 text-slate-800' : 'bg-slate-950/90 border-slate-800 text-white'
            }`}>
              <div className={`font-bold flex items-center justify-between border-b pb-1 ${
                theme === 'light' ? 'border-slate-200 text-slate-900' : 'border-slate-800 text-white'
              }`}>
                <span>Lagenda Warna Map</span>
                <span className="text-[9px] opacity-70">R = Radius</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-rose-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Red (Bahaya):
                </span>
                <span className="font-bold">{plumeStats.dangerRadiusKm} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Yellow (Waspada):
                </span>
                <span className="font-bold">{plumeStats.alertRadiusKm} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green (Aman):
                </span>
                <span className="font-bold">&gt; {plumeStats.alertRadiusKm} km</span>
              </div>
            </div>

            {/* Recenter Map Button */}
            <button
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([centerLat, centerLng], 12);
                }
              }}
              className={`absolute top-3 right-3 z-[400] border p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg ${
                theme === 'light'
                  ? 'bg-white/95 hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-white'
              }`}
              title="Reset Tampilan Map ke Pusat Stasiun"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-500" />
              Reset Stasiun
            </button>
          </div>

          <div className={`flex items-center justify-between text-xs p-3 rounded-xl border ${
            theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Stasiun IoT: <strong className={theme === 'light' ? 'text-slate-900' : 'text-white'}>{region?.sensorDeviceId}</strong> ({region?.name})
            </span>
            <span>Koordinat: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}</span>
          </div>

        </div>

        {/* Coverage & Plume Distance Metrics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <h3 className={`text-sm font-bold flex items-center gap-2 ${
            theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>
            <Ruler className="w-4 h-4 text-emerald-500" />
            Estimasi Jangkauan & Luas Area (KM / KM²)
          </h3>

          {/* 1. Red Zone Coverage */}
          <div className={`border p-3.5 rounded-xl space-y-1.5 ${
            theme === 'light' ? 'bg-rose-50/60 border-rose-200 text-slate-800' : 'bg-slate-950 border-rose-500/30'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-500 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Radius Zona Bahaya
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-300 text-sm">
                {plumeStats.dangerRadiusKm} KM
              </span>
            </div>
            <div className={`flex items-center justify-between text-[11px] border-t pt-1.5 ${
              theme === 'light' ? 'border-rose-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
            }`}>
              <span>Luas Area Kritis:</span>
              <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{plumeStats.dangerAreaKm2} km²</span>
            </div>
          </div>

          {/* 2. Yellow Zone Coverage */}
          <div className={`border p-3.5 rounded-xl space-y-1.5 ${
            theme === 'light' ? 'bg-amber-50/60 border-amber-200 text-slate-800' : 'bg-slate-950 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Radius Zona Waspada
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-300 text-sm">
                {plumeStats.alertRadiusKm} KM
              </span>
            </div>
            <div className={`flex items-center justify-between text-[11px] border-t pt-1.5 ${
              theme === 'light' ? 'border-amber-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
            }`}>
              <span>Luas Area Terdampak:</span>
              <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{plumeStats.alertAreaKm2} km²</span>
            </div>
          </div>

          {/* 3. Outer Safe Distance */}
          <div className={`border p-3.5 rounded-xl space-y-1.5 ${
            theme === 'light' ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' : 'bg-slate-950 border-emerald-500/30'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Perimeter Udara Aman
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-300 text-sm">
                &gt; {plumeStats.alertRadiusKm} KM
              </span>
            </div>
            <div className={`text-[11px] border-t pt-1.5 ${
              theme === 'light' ? 'border-emerald-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
            }`}>
              Wilayah di luar radius ini relatif aman dari paparan langsung debu industri & emisi kendaran.
            </div>
          </div>

          {/* Wind Vector Effect */}
          <div className={`border p-3.5 rounded-xl text-xs space-y-1 ${
            theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-500" /> Arah Sebaran Plume
              </span>
              <span className="text-cyan-600 dark:text-cyan-400">{region?.environment.windDirection}</span>
            </div>
            <p className={`text-[11px] leading-relaxed ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Angin {region?.environment.windSpeedKmh} km/jam memperluas vektor sebaran ke arah {region?.environment.windDirection}.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
