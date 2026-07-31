import React from 'react';
import { HealthRiskAdvisory, PollutionLevel } from '../types';
import { HeartPulse, Stethoscope, Shield, Home, Baby, Activity, AlertCircle, BookOpen, ChevronRight } from 'lucide-react';

interface HealthRiskSectionProps {
  healthRisk: HealthRiskAdvisory;
  level: PollutionLevel;
  theme?: 'dark' | 'light';
  onOpenDiseaseCatalog?: () => void;
}

export const HealthRiskSection: React.FC<HealthRiskSectionProps> = ({ 
  healthRisk, 
  level, 
  theme = 'dark',
  onOpenDiseaseCatalog 
}) => {
  const isLight = theme === 'light';

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Kritis':
        return isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Tinggi':
        return isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Sedang':
        return isLight ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div id="health-risk-panel" className={`border rounded-2xl p-5 sm:p-6 shadow-lg space-y-5 transition-colors duration-200 ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Section Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-500" />
          <div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Risiko Kesehatan Masyarakat & Panduan Medis</h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Evaluasi dampak kesehatan berdasarkan indeks polutan mikroskopis (PM2.5, SO2, NO2).
            </p>
          </div>
        </div>

        <span
          className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRiskBadgeColor(
            healthRisk.respiratoryRiskLevel
          )}`}
        >
          Risiko Saluran Napas: {healthRisk.respiratoryRiskLevel}
        </span>
      </div>

      {/* Main Risk Advisories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Risk for General Public */}
        <div className={`border rounded-xl p-4 space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
            isLight ? 'text-slate-800' : 'text-slate-200'
          }`}>
            <Activity className="w-4 h-4 text-sky-500" />
            Dampak Kesehatan Populasi Umum
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{healthRisk.generalPublicRisk}</p>
        </div>

        {/* Risk for Vulnerable Groups */}
        <div className={`border rounded-xl p-4 space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
            isLight ? 'text-slate-800' : 'text-slate-200'
          }`}>
            <Baby className="w-4 h-4 text-pink-500" />
            Risiko Kelompok Rentan (Anak, Lansia & ISPA)
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{healthRisk.vulnerableGroupsRisk}</p>
        </div>

      </div>

      {/* Practical Action Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        
        {/* Mask Recommendation */}
        <div className={`border p-3.5 rounded-xl space-y-1.5 ${
          isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Shield className="w-4 h-4" />
            Rekomendasi Masker
          </div>
          <p className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{healthRisk.recommendedMask}</p>
        </div>

        {/* Outdoor Advice */}
        <div className={`border p-3.5 rounded-xl space-y-1.5 ${
          isLight ? 'bg-sky-50/60 border-sky-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
            <Stethoscope className="w-4 h-4" />
            Aktivitas Luar Ruangan
          </div>
          <p className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{healthRisk.outdoorActivityAdvice}</p>
        </div>

        {/* Indoor Air Purifier */}
        <div className={`border p-3.5 rounded-xl space-y-1.5 ${
          isLight ? 'bg-purple-50/60 border-purple-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
            <Home className="w-4 h-4" />
            Proteksi Ruangan / Indoor
          </div>
          <p className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{healthRisk.indoorPurifierAdvice}</p>
        </div>

      </div>

      {/* Interactive Disease Catalog Banner */}
      {onOpenDiseaseCatalog && (
        <div className={`p-4 border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
          isLight 
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-emerald-200 hover:border-emerald-300 shadow-sm' 
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-emerald-500/30 hover:border-emerald-500/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border shrink-0 ${
              isLight ? 'bg-white border-emerald-200 text-emerald-600' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Katalog Penyakit Akibat Polusi Udara (ISPA, Asma, PPOK, Jantung & Mata)
              </h4>
              <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Pelajari gejala klinis, polutan pemicu (PM2.5, NO2, SO2), populasi rentan, dan langkah pertolongan pertama.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDiseaseCatalog}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Buka Katalog Penyakit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hospital preparedness alert for Berbahaya level */}
      {level === 'BERBAHAYA' && (
        <div className={`mt-2 p-3 border rounded-xl text-xs flex items-center gap-2 ${
          isLight ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
        }`}>
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            <strong>Peringatan Faskes & Puskesmas:</strong> Lonjakan kasus ISPA, Asma, dan Iritasi Mata diproyeksikan meningkat hingga 65%. RSUD dianjurkan menyediakan ruang oksigen darurat.
          </span>
        </div>
      )}

    </div>
  );
};
