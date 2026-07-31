import React, { useState } from 'react';
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Flame,
  Wind,
  Activity,
  ShieldAlert,
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Factory,
  Car
} from 'lucide-react';
import { PollutantBreakdown } from '../types';

interface GasExplanationGuideProps {
  pollutants?: PollutantBreakdown;
  theme?: 'dark' | 'light';
}

export interface GasInfoItem {
  id: keyof PollutantBreakdown | 'hc';
  code: string;
  name: string;
  laymanTitle: string; // Judul Bahasa Awam
  iconBg: string;
  iconColor: string;
  source: string;
  definition: string;
  laymanImpact: string; // Dampak Bagi Orang Awam
  symptoms: string[];
  safeLimitKLHK: string;
  vulnerableGroups: string;
  preventionTip: string;
}

export const GAS_DATABASE: GasInfoItem[] = [
  {
    id: 'pm25',
    code: 'PM2.5',
    name: 'Partikel Mikroskopis Halus (< 2.5 µm)',
    laymanTitle: 'Debu Super Halus (Penembus Darah)',
    iconBg: 'bg-rose-500/10 border-rose-500/30',
    iconColor: 'text-rose-500',
    source: 'Knalpot bus/truk diesel, asap pembakaran sampah, & cerobong batubara PLTU',
    definition: 'Debu jelaga yang ukurannya 30 kali lebih kecil dari tebal sehelai rambut manusia. Saking kecilnya, ia melayang lama di udara dan tidak tersaring oleh bulu hidung.',
    laymanImpact: 'Sangat berbahaya karena dapat menembus kantung udara paru-paru (alveolus) hingga masuk ke dalam aliran darah manusia. Menjadi pemicu utama serangan jantung, stroke, dan kanker paru.',
    symptoms: [
      'Batuk kering tidak kunjung sembuh',
      'Nyeri / sesak di dada saat bernapas',
      'Napas berbunyi (mengi / asma kambuh)',
      'Penurunan fungsi paru jangka panjang'
    ],
    safeLimitKLHK: '15.5 µg/m³ (Batas Aman Rata-Rata Harian KLHK)',
    vulnerableGroups: 'Balita, Anak-Anak, Penderita Asma, Lansia, & Pasien Jantung',
    preventionTip: 'Gunakan masker standar N95 / KN95 saat keluar rumah. Gunakan Air Purifier bermodal HEPA filter di dalam ruangan.'
  },
  {
    id: 'pm10',
    code: 'PM10',
    name: 'Debu Kasar (< 10 µm)',
    laymanTitle: 'Debu Jalanan & Konstruksi',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    iconColor: 'text-amber-500',
    source: 'Gesekan ban kendaraan di jalan retak, material pabrik semen, & proyek bangunan',
    definition: 'Partikel debu kasar ataujelaga berdiameter di bawah 10 mikron. Terhirup hingga ke tenggorokan dan saluran pernapasan atas.',
    laymanImpact: 'Mengiritasi mukosa hidung, mata, dan tenggorokan. Menyebabkan gangguan pernapasan atas (ISPA), bersin berulang, dan mata perih berair.',
    symptoms: [
      'Bersin-bersin dan hidung tersumbat',
      'Mata merah, perih, dan berair',
      'Tenggorokan gatal dan batuk berdahak',
      'Infeksi Saluran Pernapasan Akut (ISPA)'
    ],
    safeLimitKLHK: '50.0 µg/m³ (Batas Aman Rata-Rata Harian KLHK)',
    vulnerableGroups: 'Pekerja lapangan, pengendara motor, & anak sekolah',
    preventionTip: 'Gunakan masker medis saat berkendara motor, cuci muka dan bilas hidung dengan larutan saline setelah beraktivitas outdoor.'
  },
  {
    id: 'no2',
    code: 'NO2',
    name: 'Nitrogen Dioksida',
    laymanTitle: 'Gas Knalpot & Bakaran Suhu Tinggi',
    iconBg: 'bg-sky-500/10 border-sky-500/30',
    iconColor: 'text-sky-500',
    source: 'Mesin mobil bensin/diesel, bus kota, motor, & boiler pabrik',
    definition: 'Gas beracun berwarna cokelat kemerahan dengan bau tajam menusuk yang dihasilkan dari pembakaran bahan bakar pada suhu tinggi.',
    laymanImpact: 'Merusak lapisan pelindung paru-paru dan melumpuhkan sistem kekebalan organ pernapasan, membuat tubuh sangat mudah terserang infeksi virus flu atau pneumonia.',
    symptoms: [
      'Sensasi terbakar di tenggorokan',
      'Sesak napas mendadak saat olahraga',
      'Daya tahan paru merosot terhadap flu',
      'Serangan asma hebat pada anak'
    ],
    safeLimitKLHK: '65.0 µg/m³ (Batas Aman Rata-Rata Harian KLHK)',
    vulnerableGroups: 'Anak-anak sekolah, penderita asma, & lansia',
    preventionTip: 'Hindari berada di pinggir jalan raya berlampu merah padat pada jam sibuk (07.00 - 09.00 & 17.00 - 19.00).'
  },
  {
    id: 'so2',
    code: 'SO2',
    name: 'Sulfur Dioksida',
    laymanTitle: 'Gas Belerang Industri & Batubara',
    iconBg: 'bg-purple-500/10 border-purple-500/30',
    iconColor: 'text-purple-500',
    source: 'PLTU Batubara, kilang minyak, pabrik logam, & pembakaran minyak murni',
    definition: 'Gas tidak berwarna tetapi berbau sangat menyengat seperti belerang galian atau korek api yang baru dinyalakan.',
    laymanImpact: 'Menyebabkan penyempitan saluran napas secara instant. Merupakan zat utama pembentuk hujan asam yang merusak tanaman, kendaraan, dan bangunan.',
    symptoms: [
      'Dada terasa sempit dan terikat',
      'Batuk keras dan iritasi mata hebat',
      'Napas berbunyi (wheezing)',
      'Iritasi kulit jika terpapar hujan asam'
    ],
    safeLimitKLHK: '75.0 µg/m³ (Batas Aman Rata-Rata Harian KLHK)',
    vulnerableGroups: 'Masyarakat pemukiman sekitar kawasan industri & PLTU',
    preventionTip: 'Tutup jendela rumah jika tinggal dekat wilayah pabrik, gunakan exhaust fan berfilter saat udara berbau menyengat.'
  },
  {
    id: 'co',
    code: 'CO',
    name: 'Karbon Monoksida',
    laymanTitle: 'Gas Tak Berbau Pemicu Pusing & Lemas',
    iconBg: 'bg-red-500/10 border-red-500/30',
    iconColor: 'text-red-500',
    source: 'Knalpot kendaraan macet, generator mesin, & genset di tempat tertutup',
    definition: 'Gas tak berwarna dan TAK BERBAU. Sangat berbahaya karena korban tidak menyadari sedang menghirup gas beracun ini.',
    laymanImpact: 'Gas CO mengikat sel darah merah 200 kali lebih kuat daripada oksigen! Mengakibatkan otak dan organ tubuh kekurangan pasokan oksigen mendadak.',
    symptoms: [
      'Sakit kepala berdenyut & pusing melayang',
      'Mual dan lemas tanpa sebab',
      'Konsentrasi menurun & pandangan kabur',
      'Pingsan / kehilangan kesadaran jika pekat'
    ],
    safeLimitKLHK: '10.000 µg/m³ (10 mg/m³) Batas Aman',
    vulnerableGroups: 'Pengendara di dalam kemacetan panjang, teknisi bengkel',
    preventionTip: 'Jangan pernah menyalakan AC mobil dalam keadaan berhenti lama dengan jendela tertutup rapat di tempat parkir tertutup.'
  },
  {
    id: 'o3',
    code: 'O3',
    name: 'Ozon Permukaan (Ground-level Ozone)',
    laymanTitle: 'Smog Terik Sinar Matahari',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
    iconColor: 'text-emerald-500',
    source: 'Reaksi kimia gas knalpot (NOx + HC) dengan sinar matahari terik di siang bolong',
    definition: 'Bukan ozon pelindung di langit tinggi, melainkan ozon polutan berbahaya di permukaan tanah tempat manusia bernapas.',
    laymanImpact: 'Bertindak seperti "sengatan matahari pada paru-paru". Mengikis lapisan dinding sel pernapasan dan memperparah reaksi alergi.',
    symptoms: [
      'Sakit / perih saat menghela napas dalam',
      'Batuk berulang saat beraktivitas siang',
      'Tenggorokan terasa teriritasi kering',
      'Penurunan vitalitas stamina'
    ],
    safeLimitKLHK: '100.0 µg/m³ (Batas Aman Rata-Rata 8 Jam)',
    vulnerableGroups: 'Olahragawan luar ruangan siang hari & anak-anak main di lapangan',
    preventionTip: 'Geser jadwal olahraga atau joging ke pagi hari sebelum jam 08.00 pagi atau sore hari setelah matahari redup.'
  },
  {
    id: 'hc',
    code: 'HC / VOC',
    name: 'Hidrokarbon & Senyawa Organik Uap',
    laymanTitle: 'Uap Bensin, Cat & Pelarut Kimia',
    iconBg: 'bg-teal-500/10 border-teal-500/30',
    iconColor: 'text-teal-500',
    source: 'Uap bensin SPBU, cat dinding, uap oli mesin, & pelarut industri',
    definition: 'Gas uap organik yang mudah menguap ke udara dari bahan bakar minyak, cat, atau produk kimia rumah tangga.',
    laymanImpact: 'Sebagian hidrokarbon bersifat karsinogenik (pemicu kanker). Menimbulkan pusing cepat dan iritasi mata serta hidung.',
    symptoms: [
      'Pusing dan pening mendadak',
      'Mual dan bau kimia menyengat',
      'Iritasi hidung dan saluran napas',
      'Resiko karsinogenik paparan kronis'
    ],
    safeLimitKLHK: '160.0 µg/m³ (Batas Aman Rata-Rata 3 Jam)',
    vulnerableGroups: 'Petugas SPBU, tukang cat, pekerja industri kimia',
    preventionTip: 'Gunakan masker dengan filter karbon aktif saat mengisi bensin atau mengecat rumah.'
  }
];

export const GasExplanationGuide: React.FC<GasExplanationGuideProps> = ({
  pollutants,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('pm25');

  const filteredGasList = GAS_DATABASE.filter(g => 
    g.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.laymanTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.laymanImpact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusForPollutant = (gasId: string) => {
    if (!pollutants) return { statusText: 'Normal', colorClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    
    let currentVal = 0;
    let safeLimit = 50;

    if (gasId === 'pm25') { currentVal = pollutants.pm25; safeLimit = 15.5; }
    else if (gasId === 'pm10') { currentVal = pollutants.pm10; safeLimit = 50; }
    else if (gasId === 'no2') { currentVal = pollutants.no2; safeLimit = 65; }
    else if (gasId === 'so2') { currentVal = pollutants.so2; safeLimit = 75; }
    else if (gasId === 'o3') { currentVal = pollutants.o3; safeLimit = 100; }
    else if (gasId === 'co') { currentVal = pollutants.co * 1000; safeLimit = 10000; } // ppm to ug
    else if (gasId === 'hc') { currentVal = 120; safeLimit = 160; }

    const ratio = currentVal / safeLimit;
    if (ratio > 1.5) {
      return { statusText: `${currentVal.toFixed(1)} (Bahaya > Limit)`, colorClass: 'bg-rose-500/20 text-rose-500 border-rose-500/30' };
    } else if (ratio > 0.8) {
      return { statusText: `${currentVal.toFixed(1)} (Waspada)`, colorClass: 'bg-amber-500/20 text-amber-500 border-amber-500/30' };
    } else {
      return { statusText: `${currentVal.toFixed(1)} (Aman)`, colorClass: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' };
    }
  };

  return (
    <div className={`border rounded-2xl p-5 sm:p-6 shadow-lg space-y-5 transition-colors duration-200 ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Header Title */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <HelpCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className={`text-base sm:text-lg font-extrabold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Panduan Pemahaman Gas & Polutan Udara (Untuk Orang Awam)
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Penjelasan mudah bahasa sehari-hari tentang bahaya PM2.5, NO2, SO2, CO, O3, dan dampaknya pada tubuh
            </p>
          </div>
        </div>

        {/* Search Input Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama gas (mis: PM2.5, CO)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border transition outline-none ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                : 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* Intro Layman Card */}
      <div className={`p-4 rounded-xl border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
        isLight ? 'bg-sky-50/80 border-sky-200 text-sky-900' : 'bg-sky-950/40 border-sky-800/60 text-sky-200'
      }`}>
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-sky-500 shrink-0 hidden sm:block" />
          <div>
            <p className="font-bold text-xs">💡 Mengapa Orang Awam Wajib Paham Gas Polutan Udara?</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Polusi udara bukan sekadar "debu biasa". Masing-masing gas memiliki mekanisme bahaya yang berbeda—mulai dari PM2.5 yang merusak darah hingga CO yang tak berbau namun memicu pusing lemas mendadak.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-lg font-mono font-bold text-[10px] bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30 shrink-0">
          7 PARAMETER KLHK & WHO
        </span>
      </div>

      {/* Accordion / Cards List of Pollutants */}
      <div className="space-y-3">
        {filteredGasList.map((gas) => {
          const isExpanded = expandedId === gas.id;
          const statusInfo = getStatusForPollutant(gas.id);

          return (
            <div
              key={gas.id}
              className={`border rounded-xl transition-all overflow-hidden ${
                isLight
                  ? isExpanded ? 'bg-slate-50 border-slate-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
                  : isExpanded ? 'bg-slate-950/90 border-slate-700 shadow-md' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : gas.id)}
                className="p-4 cursor-pointer flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1.5 rounded-lg border font-black text-xs font-mono shrink-0 ${gas.iconBg} ${gas.iconColor}`}>
                    {gas.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-extrabold text-xs sm:text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {gas.laymanTitle}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.colorClass}`}>
                        {statusInfo.statusText}
                      </span>
                    </div>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {gas.name} • Sumber: {gas.source}
                    </p>
                  </div>
                </div>

                <button className={`p-1.5 rounded-lg border transition ${
                  isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded Body Content */}
              {isExpanded && (
                <div className={`p-4 pt-0 border-t space-y-4 animate-in fade-in duration-200 ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  
                  {/* Definition & Simple Impact Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5" />
                        Apa Itu Gas / Polutan Ini?
                      </span>
                      <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {gas.definition}
                      </p>
                    </div>

                    <div className={`p-3 rounded-xl border space-y-1 ${
                      isLight ? 'bg-rose-50/70 border-rose-200' : 'bg-rose-950/30 border-rose-900/40'
                    }`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Bahaya Utama bagi Orang Awam
                      </span>
                      <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {gas.laymanImpact}
                      </p>
                    </div>
                  </div>

                  {/* Symptoms List & Vulnerable Groups */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    
                    {/* Symptoms */}
                    <div className={`p-3 rounded-xl border space-y-1.5 ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <span className="font-bold text-[11px] text-amber-500 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" />
                        Gejala Fisik yang Dirasakan:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside">
                        {gas.symptoms.map((sym, idx) => (
                          <li key={idx}>{sym}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Vulnerable Groups */}
                    <div className={`p-3 rounded-xl border space-y-1.5 ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <span className="font-bold text-[11px] text-purple-500 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Paling Berbahaya Bagi:
                      </span>
                      <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {gas.vulnerableGroups}
                      </p>
                      <div className="pt-1">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Baku Mutu: {gas.safeLimitKLHK}
                        </span>
                      </div>
                    </div>

                    {/* Prevention Tip */}
                    <div className={`p-3 rounded-xl border space-y-1.5 ${
                      isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-emerald-950/30 border-emerald-900/40'
                    }`}>
                      <span className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Tips Perlindungan Diri:
                      </span>
                      <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {gas.preventionTip}
                      </p>
                    </div>

                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
