import React from 'react';
import { PemdaMitigationPolicy, PollutionLevel } from '../types';
import { Building2, Sparkles, CheckCircle2, ShieldAlert, Bus, Factory, TreePine, Briefcase } from 'lucide-react';

interface PemdaMitigationCardProps {
  policies: PemdaMitigationPolicy[];
  level: PollutionLevel;
  onTriggerAiAnalysis: () => void;
  isAiLoading: boolean;
  theme?: 'dark' | 'light';
}

export const PemdaMitigationCard: React.FC<PemdaMitigationCardProps> = ({
  policies,
  level,
  onTriggerAiAnalysis,
  isAiLoading,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transportasi':
        return <Bus className="w-4 h-4 text-sky-500" />;
      case 'Industri':
        return <Factory className="w-4 h-4 text-purple-500" />;
      case 'Lingkungan & Ruang Hijau':
        return <TreePine className="w-4 h-4 text-emerald-500" />;
      case 'Kebijakan Darurat & WFH':
        return <Briefcase className="w-4 h-4 text-amber-500" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Tinggi':
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          isLight ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        }`}>PRIORITAS TINGGI</span>;
      case 'Sedang':
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          isLight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>PRIORITAS SEDANG</span>;
      default:
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        }`}>PROGRAM RUTIN</span>;
    }
  };

  return (
    <div id="pemda-mitigation-panel" className={`border rounded-2xl p-5 sm:p-6 shadow-lg space-y-5 transition-colors duration-200 ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Section Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Rekomendasi Tindakan Mitigasi Pemerintah Daerah (Pemda)</h3>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Panduan kebijakan operasional dan regulasi bagi Dinas Lingkungan Hidup, Dinas Perhubungan, dan Satpol PP.
          </p>
        </div>

        {/* AI Generator CTA */}
        <button
          id="generate-ai-plan-btn"
          onClick={onTriggerAiAnalysis}
          disabled={isAiLoading}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-900/20 border border-emerald-400/30 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 text-emerald-200 ${isAiLoading ? 'animate-spin' : ''}`} />
          {isAiLoading ? 'Menganalisis dengan Gemini AI...' : 'Generate Roadmap AI Pemda'}
        </button>
      </div>

      {/* Level Banner Context */}
      {level === 'BERBAHAYA' && (
        <div className={`p-3.5 border rounded-xl text-xs flex items-start gap-3 ${
          isLight ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
        }`}>
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <strong className="font-bold block mb-0.5">PERINGATAN DARURAT KUALITAS UDARA Daerah:</strong>
            Indeks polusi saat ini telah melampaui ambang batas bahaya. Pemerintah Daerah disarankan menerbitkan Surat Keputusan (SK) Tanggap Darurat Bencana Air Pollution.
          </div>
        </div>
      )}

      {/* Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((policy, idx) => (
          <div
            key={idx}
            className={`border rounded-xl p-4 transition-all space-y-2.5 flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`flex items-center gap-1.5 text-xs font-medium ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {getCategoryIcon(policy.category)}
                  {policy.category}
                </span>
                {getPriorityBadge(policy.priority)}
              </div>

              <h4 className={`text-sm font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>{policy.title}</h4>
              <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{policy.description}</p>
            </div>

            <div className={`pt-2 border-t text-[11px] flex items-center gap-1.5 ${
              isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                Target Dampak: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{policy.expectedImpact}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
