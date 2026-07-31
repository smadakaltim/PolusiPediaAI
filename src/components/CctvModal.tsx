import React, { useState, useEffect, useRef } from 'react';
import { Camera, Eye, Radio, Shield, AlertTriangle, RefreshCw, X, Play, Volume2, Video, Cpu, Car, Truck } from 'lucide-react';
import { RegionPreset } from '../types';

interface CctvModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: RegionPreset | null;
  ispuScore: number;
  theme?: 'dark' | 'light';
}

export const CctvModal: React.FC<CctvModalProps> = ({
  isOpen,
  onClose,
  region,
  ispuScore,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [activeAngle, setActiveAngle] = useState<number>(1);
  const [showAiBoxes, setShowAiBoxes] = useState<boolean>(true);
  const [showSmokeHeatmap, setShowSmokeHeatmap] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [vehicleCount, setVehicleCount] = useState<number>(42);
  const [smokeLevelPct, setSmokeLevelPct] = useState<number>(Math.min(98, Math.round((ispuScore / 200) * 100)));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) +
          ' ' +
          now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fluctuate AI counts
  useEffect(() => {
    const timer = setInterval(() => {
      setVehicleCount((prev) => Math.max(15, Math.min(120, prev + Math.floor((Math.random() - 0.48) * 5))));
      setSmokeLevelPct(Math.min(99, Math.max(5, Math.round((ispuScore / 200) * 100 + (Math.random() - 0.5) * 6))));
    }, 2500);
    return () => clearInterval(timer);
  }, [ispuScore]);

  // Canvas simulation renderer for live CCTV video stream
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    // Simulated cars moving
    const cars = [
      { x: 50, y: 180, speed: 2.2, type: 'car', color: '#10b981' },
      { x: 180, y: 210, speed: 1.8, type: 'truck', color: '#f59e0b' },
      { x: 320, y: 190, speed: 3.0, type: 'moto', color: '#06b6d4' },
      { x: 450, y: 220, speed: 2.5, type: 'car', color: '#3b82f6' },
      { x: 100, y: 240, speed: 1.5, type: 'bus', color: '#ec4899' },
    ];

    const render = () => {
      step += 1;
      const w = canvas.width;
      const h = canvas.height;

      // Dark asphalt & city background
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, w, h);

      // Sky / Smog overlay based on ISPU
      const smogOpacity = Math.min(0.75, ispuScore / 250);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(1, ispuScore > 150 ? `rgba(180, 83, 9, ${0.4 + smogOpacity * 0.4})` : `rgba(30, 41, 59, 0.8)`);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.5);

      // Factory Stack / Buildings Silhouette
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 60, 50, 100);
      ctx.fillRect(100, 40, 80, 120);
      ctx.fillRect(200, 80, 60, 80);
      ctx.fillRect(480, 50, 70, 110);

      // Chimney Stack smoke if industrial or high ISPU
      if (region?.cctvStreamType === 'industrial' || ispuScore > 80) {
        ctx.save();
        ctx.fillStyle = `rgba(148, 163, 184, ${0.25 + (ispuScore / 300) * 0.5})`;
        for (let i = 0; i < 3; i++) {
          const smokeY = (100 - ((step * 1.5 + i * 40) % 80));
          const smokeR = 12 + (100 - smokeY) * 0.25;
          ctx.beginPath();
          ctx.arc(125 + Math.sin((step + i * 20) * 0.05) * 8, smokeY + 20, smokeR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Roadway lines
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.lineTo(w, h * 0.55);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Lane markings
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([15, 15]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.75);
      ctx.lineTo(w, h * 0.75);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Moving Vehicles
      cars.forEach((car) => {
        car.x = (car.x + car.speed) % (w + 60);

        ctx.fillStyle = car.color;
        let carW = 32;
        let carH = 18;
        if (car.type === 'truck') {
          carW = 55;
          carH = 24;
        } else if (car.type === 'bus') {
          carW = 65;
          carH = 22;
        } else if (car.type === 'moto') {
          carW = 16;
          carH = 10;
        }

        ctx.fillRect(car.x - 30, car.y, carW, carH);

        // Headlights
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(car.x - 30 + carW, car.y + 2, 4, 4);
        ctx.fillRect(car.x - 30 + carW, car.y + carH - 6, 4, 4);

        // AI Bounding Box Overlay if enabled
        if (showAiBoxes) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(car.x - 34, car.y - 4, carW + 8, carH + 8);

          // AI Label
          ctx.fillStyle = '#10b981';
          ctx.font = '9px monospace';
          ctx.fillText(`${car.type.toUpperCase()} 98%`, car.x - 34, car.y - 6);
        }
      });

      // Smoke Heatmap / Haze Layer if enabled
      if (showSmokeHeatmap && ispuScore > 50) {
        const heatmapGrad = ctx.createRadialGradient(w * 0.4, h * 0.4, 20, w * 0.4, h * 0.4, 220);
        if (ispuScore > 150) {
          heatmapGrad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
          heatmapGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.2)');
          heatmapGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          heatmapGrad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
          heatmapGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.1)');
          heatmapGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = heatmapGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Camera Reticle Crosshair Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, showAiBoxes, showSmokeHeatmap, ispuScore, region, activeAngle]);

  if (!isOpen || !region) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200 ${
      isLight ? 'bg-slate-900/50' : 'bg-slate-950/80'
    }`}>
      <div className={`border rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700/80 text-slate-100'
      }`}>
        
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 border rounded-xl text-emerald-500 ${
              isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Kamera CCTV Pemantau Polusi Real-Time
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-500 border border-rose-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  LIVE 4K STREAM
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {region.cctvLocationName} • {region.cctvCameraId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative bg-black flex-1 min-h-[320px] flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-full object-cover max-h-[420px]"
          />

          {/* CCTV HUD Overlay Top Left */}
          <div className="absolute top-4 left-4 z-10 bg-slate-950/80 border border-slate-800 backdrop-blur-md px-3 py-2 rounded-xl text-xs space-y-1 font-mono text-slate-100">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>REC • {region.cctvCameraId}</span>
            </div>
            <div className="text-slate-300 text-[11px]">{currentTime || 'LIVE STREAMING'}</div>
            <div className="text-slate-400 text-[10px]">FPS: 30.0 | RES: 3840x2160 | H.265</div>
          </div>

          {/* CCTV HUD Overlay Top Right (AI Metrics) */}
          <div className="absolute top-4 right-4 z-10 bg-slate-950/85 border border-slate-800 backdrop-blur-md p-3 rounded-xl text-xs space-y-2 min-w-[180px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-emerald-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> AI Optical Counter
              </span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">AKTIF</span>
            </div>

            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Car className="w-3 h-3 text-cyan-400" /> Kendaraan Lintas:
                </span>
                <span className="font-bold text-white">{vehicleCount} / mnt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-amber-400" /> Truk/Bus Diesel:
                </span>
                <span className="font-bold text-amber-400">{Math.round(vehicleCount * 0.22)} / mnt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" /> Indeks Asap / Asap:
                </span>
                <span className={`font-bold ${smokeLevelPct > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {smokeLevelPct}%
                </span>
              </div>
            </div>
          </div>

          {/* CCTV HUD Bottom Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-950/80 border border-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl flex items-center justify-between gap-4 text-xs text-slate-100">
            <div className="flex items-center gap-3 text-slate-300">
              <span className="font-semibold text-slate-200">Sudut Kamera:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setActiveAngle(angle)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      activeAngle === angle
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Kamera #{angle}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                <input
                  type="checkbox"
                  checked={showAiBoxes}
                  onChange={(e) => setShowAiBoxes(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                Kotak AI Deteksi
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                <input
                  type="checkbox"
                  checked={showSmokeHeatmap}
                  onChange={(e) => setShowSmokeHeatmap(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                Layer Heatmap Asap
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-between text-xs ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Terhubung langsung ke Command Center Dinas Perhubungan & DLH Pemda</span>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-2 font-bold rounded-xl transition ${
              isLight ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            Tutup Kamera
          </button>
        </div>

      </div>
    </div>
  );
};
