import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PollutionCalculationResult } from '../types';
import { PieChart as PieIcon, BarChart2, TrendingUp, AlertCircle, HelpCircle } from 'lucide-react';
import { GasExplanationGuide } from './GasExplanationGuide';

interface PollutionChartsProps {
  result: PollutionCalculationResult;
  theme?: 'dark' | 'light';
}

export const PollutionCharts: React.FC<PollutionChartsProps> = ({ result, theme = 'dark' }) => {
  const { pollutants, sources, ispuScore } = result;
  const isLight = theme === 'light';

  // 1. Source Share Data
  const sourceData = [
    { name: 'Emisi Kendaraan (Transportasi)', value: sources.vehicleSharePercent, color: '#0284C7' },
    { name: 'Emisi Pabrik (Industri/PLTU)', value: sources.factorySharePercent, color: '#9333EA' },
  ];

  // 2. Pollutant Concentration Data
  const pollutantData = [
    { name: 'PM2.5 (µg/m³)', value: pollutants.pm25, safeLimit: 15.5, color: '#EF4444' },
    { name: 'PM10 (µg/m³)', value: pollutants.pm10, safeLimit: 50.0, color: '#F59E0B' },
    { name: 'NO2 (µg/m³)', value: pollutants.no2, safeLimit: 65.0, color: '#3B82F6' },
    { name: 'SO2 (µg/m³)', value: pollutants.so2, safeLimit: 75.0, color: '#8B5CF6' },
    { name: 'O3 Ozon (µg/m³)', value: pollutants.o3, safeLimit: 100.0, color: '#10B981' },
  ];

  // 3. 24-Hour Forecast Simulated Data
  const hourlyData = [
    { time: '00:00', ispu: Math.round(ispuScore * 0.72) },
    { time: '03:00', ispu: Math.round(ispuScore * 0.65) },
    { time: '06:00', ispu: Math.round(ispuScore * 0.85) },
    { time: '08:00 (Puncak)', ispu: Math.round(ispuScore * 1.25) },
    { time: '11:00', ispu: Math.round(ispuScore * 1.1) },
    { time: '14:00', ispu: Math.round(ispuScore * 0.95) },
    { time: '18:00 (Puncak)', ispu: Math.round(ispuScore * 1.3) },
    { time: '21:00', ispu: Math.round(ispuScore * 1.05) },
  ];

  const tooltipStyle = isLight
    ? { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
    : { backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF' };

  const gridStroke = isLight ? '#E2E8F0' : '#1E293B';
  const axisStroke = isLight ? '#64748B' : '#94A3B8';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* CHART 1: Sumber Emisi Dominan */}
      <div className={`border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div>
          <div className={`flex items-center gap-2 border-b pb-3 mb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <PieIcon className="w-5 h-5 text-sky-500" />
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Proporsi Sumber Polusi Utama</h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Kendaraan Bermotor vs Cerobong Pabrik</p>
            </div>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: any) => [`${val}%`, 'Kontribusi Emisi']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`space-y-2 border-t pt-3 text-xs ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
          {sourceData.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{s.name}</span>
              </div>
              <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* CHART 2: Konsentrasi Parameter Polutan */}
      <div className={`border rounded-2xl p-5 shadow-lg lg:col-span-2 flex flex-col justify-between transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div>
          <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Konsentrasi Parameter Polutan Udara</h3>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Dibandingkan Ambang Batas Baku Mutu Udara Ambien KLHK</p>
              </div>
            </div>
            <span className={`text-[11px] px-2 py-1 rounded border ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              Partikulat & Gas
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pollutantData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" stroke={axisStroke} fontSize={11} />
                <YAxis stroke={axisStroke} fontSize={11} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: any) => [`${val}`, 'Konsentrasi Terdeteksi']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pollutantData.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-[11px] ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
        }`}>
          <span className={`flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            PM2.5 adalah partikel mikroskopis yang paling berbahaya bagi alveolus paru-paru.
          </span>
          <span className="font-mono">Standard: Permen LHK No. 14/2020</span>
        </div>
      </div>

      {/* CHART 3: Tren 24 Jam ISPU */}
      <div className={`border rounded-2xl p-5 shadow-lg lg:col-span-3 transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Proyeksi Tren Indeks Polusi (ISPU) 24 Jam</h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Fluktuasi harian berdasarkan siklus lalu lintas jam sibuk dan aktivitas pabrik
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className={`flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Proyeksi ISPU
            </span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ispuColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="time" stroke={axisStroke} fontSize={11} />
              <YAxis stroke={axisStroke} fontSize={11} domain={[0, 'dataMax + 20']} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: any) => [`${val}`, 'Indeks ISPU']}
              />
              <Area type="monotone" dataKey="ispu" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#ispuColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GAS & POLLUTANT EXPLANATION GUIDE FOR LAYPEOPLE */}
      <div className="lg:col-span-3">
        <GasExplanationGuide pollutants={pollutants} theme={theme} />
      </div>

    </div>
  );
};
