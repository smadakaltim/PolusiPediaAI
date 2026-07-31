import React from 'react';
import { AiAnalysisResponse, PollutionCalculationResult } from '../types';
import { Sparkles, X, CheckCircle, Clock, Calendar, ShieldCheck, DollarSign, Printer, Share2 } from 'lucide-react';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AiAnalysisResponse | null;
  calculation: PollutionCalculationResult;
  regionName: string;
  theme?: 'dark' | 'light';
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  data,
  calculation,
  regionName,
  theme = 'dark',
}) => {
  if (!isOpen || !data) return null;

  const isLight = theme === 'light';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto ${
      isLight ? 'bg-slate-900/50' : 'bg-slate-950/80'
    }`}>
      <div className={`relative w-full max-w-4xl border rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700/80 text-slate-200'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700/80'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 border rounded-xl text-emerald-500 ${
              isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/20 border-emerald-500/40'
            }`}>
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Dokumen Strategis Pemda Berbasis AI Gemini
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Laporan Komprehensif Kebijakan Mitigasi Udara: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{regionName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className={`p-2 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Printer className="w-4 h-4" /> Cetak / Export PDF
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition ${
                isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Executive Summary */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-emerald-950/40 border-emerald-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Ringkasan Eksekutif Kepala Daerah</span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                ISPU Score: {calculation.ispuScore} ({calculation.level})
              </span>
            </div>
            <p className={`leading-relaxed font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{data.summary}</p>
          </div>

          {/* Key Drivers */}
          <div className="space-y-2">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Clock className="w-4 h-4 text-sky-500" />
              Faktor Utama Pemicu Polusi (Key Pollution Drivers)
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.keyDrivers.map((driver, idx) => (
                <li key={idx} className={`p-3 border rounded-lg flex items-start gap-2 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Action Plan Roadmap */}
          <div className="space-y-4 pt-2">
            <h3 className={`text-sm font-bold flex items-center gap-2 border-b pb-2 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-white border-slate-800'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Roadmap Tindakan Mitigasi Kebijakan Pemda
            </h3>

            {/* 24 Hours Emergency Steps */}
            <div className={`border rounded-xl p-4 space-y-2 ${
              isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-950/70 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                1. Langkah Darurat 24 Jam Pertama (Immediate Emergency Action)
              </div>
              <div className="space-y-2 pl-2">
                {data.pemdaMitigationActionPlan.immediate24h.map((step, idx) => (
                  <div key={idx} className={`flex items-start gap-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 30 Days Tactical Steps */}
            <div className={`border rounded-xl p-4 space-y-2 ${
              isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-950/70 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                2. Kebijakan Taktis 30 Hari Ke Depan (Medium-Term Policy)
              </div>
              <div className="space-y-2 pl-2">
                {data.pemdaMitigationActionPlan.mediumTerm30d.map((step, idx) => (
                  <div key={idx} className={`flex items-start gap-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Long Term Strategy */}
            <div className={`border rounded-xl p-4 space-y-2 ${
              isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-950/70 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                3. Strategi Jangka Panjang (Long-Term Structural Policy)
              </div>
              <div className="space-y-2 pl-2">
                {data.pemdaMitigationActionPlan.longTermPolicy.map((step, idx) => (
                  <div key={idx} className={`flex items-start gap-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health & Economic Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className={`p-4 border rounded-xl space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-300">
                Analisis Risiko Medis & Kesehatan Paru
              </h4>
              <p className={`leading-relaxed text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.healthRiskDetailed}</p>
            </div>

            <div className={`p-4 border rounded-xl space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-300 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Estimasi Dampak Ekonomi & Produktivitas
              </h4>
              <p className={`leading-relaxed text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.economicImpactEstimate}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <span>Diproses oleh Gemini 3.6 Flash AI • Standar KLHK RI</span>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isLight ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            Tutup Dokumen
          </button>
        </div>

      </div>
    </div>
  );
};
