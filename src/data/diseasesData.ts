export interface PollutionDisease {
  id: string;
  name: string;
  category: 'Respiratori Akut' | 'Respiratori Kronis' | 'Kardiovaskular' | 'Mata & Kulit' | 'Saraf & Perkembangan' | 'Onkologi';
  pollutants: string[];
  severity: 'Sedang' | 'Tinggi' | 'Kritis';
  shortDesc: string;
  description: string;
  symptoms: string[];
  riskGroups: string[];
  incubationOrOnset: string;
  firstAid: string[];
  prevention: string[];
  ispuTriggerLevel: 'AMAN' | 'WASPADA' | 'BERBAHAYA';
  iconType: 'ispa' | 'asma' | 'copd' | 'heart' | 'eye' | 'bronchitis' | 'cancer' | 'brain';
}

export const POLLUTION_DISEASES: PollutionDisease[] = [
  {
    id: 'ispa',
    name: 'Infeksi Saluran Pernapasan Akut (ISPA)',
    category: 'Respiratori Akut',
    pollutants: ['PM2.5', 'PM10', 'NO2'],
    severity: 'Tinggi',
    shortDesc: 'Peradangan mendadak pada hidung, tenggorokan, dan saluran napas akibat partikel iritan.',
    description: 'ISPA adalah penyakit paling umum akibat polusi udara. Partikel PM2.5 dan PM10 masuk ke dalam mukosa hidung dan tenggorokan, memicu reaksi inflamasi, infeksi sekunder bakteri/virus, dan pembentukan dahak berlebih.',
    symptoms: [
      'Batuk kering atau berdahak',
      'Tenggorokan gatal dan sakit saat menelan',
      'Hidung tersumbat / pilek encer',
      'Demam ringan hingga sedang (37.5°C - 38.5°C)',
      'Sakit kepala dan lemas'
    ],
    riskGroups: ['Balita & Anak-anak', 'Lansia (>60 tahun)', 'Pengendara Sepeda Motor', 'Pekerja Lapangan'],
    incubationOrOnset: '6 - 24 jam setelah terpapar udara kotor',
    firstAid: [
      'Istirahat total di ruangan ber-AC / Air Purifier',
      'Minum air putih hangat minimal 2.5 liter per hari',
      'Kumur air garam hangat untuk meredakan tenggorokan',
      'Konsumsi vitamin C dan imunostimulan'
    ],
    prevention: [
      'Gunakan masker medis / N95 saat keluar rumah',
      'Gunakan nasal spray salin setelah beraktivitas luar',
      'Nyalakan Air Purifier HEPA filter di dalam rumah'
    ],
    ispuTriggerLevel: 'WASPADA',
    iconType: 'ispa',
  },
  {
    id: 'asma-eksaserbasi',
    name: 'Serangan Asma Akut (Eksaserbasi Asma)',
    category: 'Respiratori Akut',
    pollutants: ['SO2', 'NO2', 'O3', 'PM2.5'],
    severity: 'Kritis',
    shortDesc: 'Penyempitan bronchus mendadak yang memicu sesak napas berat dan mengi.',
    description: 'Gas Sulfur Dioksida (SO2) dan Nitrogen Dioksida (NO2) merangsang bronkospasme pada penderita asma. Saluran napas membengkak dan memproduksi lendir kental secara masif.',
    symptoms: [
      'Sesak napas hebat saat menghembuskan napas',
      'Suara mengi / bengek (wheezing) yang jelas terdengar',
      'Dada terasa sangat sempit atau seperti ditindih',
      'Kesulitan berbicara dalam satu kalimat utuh',
      'Bibir atau ujung jari tampak kebiruan (sianosis)'
    ],
    riskGroups: ['Penderita Asma Bawaan', 'Anak-anak', 'Atlit / Olahragawan Luar Ruangan'],
    incubationOrOnset: 'Sangat cepat (15 menit - 2 jam paparan SO2/NO2)',
    firstAid: [
      'Gunakan inhaler bronkodilator (Salbutamol) 2-4 semprotan segera',
      'Posisikan penderita duduk tegak (jangan berbaring)',
      'Jauhkan dari sumber polusi / asap kendaraan',
      'Segera bawa ke UGD jika tidak membaik dalam 15 menit'
    ],
    prevention: [
      'Selalu bawa inhaler pelega ke mana saja',
      'Hindari berolahraga di luar saat indeks SO2 tinggi',
      'Pantau terus Indeks Standar Pencemar Udara (ISPU)'
    ],
    ispuTriggerLevel: 'WASPADA',
    iconType: 'asma',
  },
  {
    id: 'ppok',
    name: 'Penyakit Paru Obstruktif Kronis (PPOK)',
    category: 'Respiratori Kronis',
    pollutants: ['PM2.5', 'Asap Industri', 'CO'],
    severity: 'Kritis',
    shortDesc: 'Kerusakan permanen pada alveolus paru yang mengakibatkan hambatan aliran udara kronis.',
    description: 'Paparan PM2.5 dan emisi pabrik jangka panjang merusak dinding alveolus paru (emfisema) dan memicu bronkitis kronis. Penurunan fungsi paru-paru ini bersifat ireversibel.',
    symptoms: [
      'Batuk kronis berdahak kental saban pagi',
      'Sesak napas bertahap yang makin memberat saat berjalan',
      'Kelelahan ekstrem karena kekurangan oksigen',
      'Dada membusung (barrel chest)',
      'Penurunan berat badan tanpa sebab jelas'
    ],
    riskGroups: ['Lansia', 'Perokok Pasif & Aktif', 'Warga Sekitar Kawasan Industri/PLTU'],
    incubationOrOnset: 'Progresif bertahun-tahun akibat paparan akumulatif',
    firstAid: [
      'Pemberian terapi oksigen tambahan sesuai petunjuk dokter',
      'Latihan pernapasan Pursed-lip breathing',
      'Pemberian inhaler kortikosteroid kombinasi'
    ],
    prevention: [
      'Relokasi aktivitas dari jalur emisi industri berat',
      'Gunakan respirator N95 berfilter karbon aktif',
      'Skrining spiometri tahunan bagi warga usia >40 tahun'
    ],
    ispuTriggerLevel: 'BERBAHAYA',
    iconType: 'copd',
  },
  {
    id: 'bronkitis',
    name: 'Bronkitis Akut & Subakut',
    category: 'Respiratori Akut',
    pollutants: ['PM10', 'NO2', 'SO2'],
    severity: 'Sedang',
    shortDesc: 'Peradangan pada mukosa bronkus utama yang menyebabkan produksi dahak berlebih.',
    description: 'Gas SO2 dan abu debu jalanan (PM10) mengiritasi sel epitel bersilia pada percabangan bronkus. Akibatnya silia paru lumpuh sementara dan dahak menumpuk.',
    symptoms: [
      'Batuk berdahak berwarna kuning kehijauan',
      'Rasa terbakar atau nyeri di dada bagian tengah',
      'Napas berbunyi kasar',
      'Demam ringan dan pegal-pegal'
    ],
    riskGroups: ['Pengendara Sepeda Motor', 'Anak Sekolah', 'Pedagang Kaki Lima'],
    incubationOrOnset: '1 - 3 hari setelah terpapar debu tebal',
    firstAid: [
      'Minum ekspektoran / pengencer dahak',
      'Inhalasi uap air hangat yang diberi minyak kayu putih/menthol',
      'Hindari paparan asap rokok dan debu jalanan'
    ],
    prevention: [
      'Pakai masker kain berlapis ganda atau masker medis minimal 3-ply',
      'Cuci muka dan hidung seusai berkendara'
    ],
    ispuTriggerLevel: 'WASPADA',
    iconType: 'bronchitis',
  },
  {
    id: 'kardiovaskular',
    name: 'Penyakit Jantung Koroner & Stroke Polusi',
    category: 'Kardiovaskular',
    pollutants: ['PM2.5', 'CO', 'NO2'],
    severity: 'Kritis',
    shortDesc: 'Penyumbatan pembuluh darah akibat partikel ultrafine PM2.5 menembus membran paru masuk ke darah.',
    description: 'Partikel mikro PM2.5 (<2.5 mikron) mampu menembus kantong udara paru-paru dan masuk langsung ke pembuluh darah sistemik, menyebabkan aterosklerosis, pengentalan darah, dan lonjakan tekanan darah.',
    symptoms: [
      'Nyeri dada menjalar ke lengan kiri atau rahang (Angina)',
      'Jantung berdebar keras (palpitasi)',
      'Sakit kepala hebat atau pusing berputar mendadak',
      'Kelemahan atau kebas pada satu sisi anggota tubuh'
    ],
    riskGroups: ['Lansia (>55 tahun)', 'Penderita Hipertensi & Diabetes', 'Riwayat Jantung'],
    incubationOrOnset: 'Bisa serangan mendadak saat puncak polusi CO/PM2.5',
    firstAid: [
      'Bawa penderita berbaring setengah duduk',
      'Longgarkan pakaian dan berikan ruang udara segar',
      'Segera hubungi ambulans / panggil layanan darurat 112'
    ],
    prevention: [
      'Hindari beraktivitas fisik berat di luar saat PM2.5 tinggi',
      'Kontrol rutin tekanan darah dan kadar kolesterol',
      'Konsumsi makanan tinggi antioksidan (buah & sayur)'
    ],
    ispuTriggerLevel: 'BERBAHAYA',
    iconType: 'heart',
  },
  {
    id: 'konjungtivitis-mata',
    name: 'Iritasi Mata & Konjungtivitis Smog',
    category: 'Mata & Kulit',
    pollutants: ['O3', 'SO2', 'Partikel Debu PM10'],
    severity: 'Sedang',
    shortDesc: 'Peradangan selaput bening mata akibat paparan gas asam dan ozon permukaan.',
    description: 'Gas Ozon (O3) dan Sulfur Dioksida bertindak sebagai zat asam lemah saat bereaksi dengan air mata, merusak lapisan film air mata dan memicu inflamasi konjungtiva.',
    symptoms: [
      'Mata merah, perih, dan terasa mengganjal pasir',
      'Air mata keluar berlebihan',
      'Kelopak mata bengkak atau gatal',
      'Sensitif terhadap cahaya (fotofobia)'
    ],
    riskGroups: ['Pengendara Sepeda Motor tanpa Helm Visor', 'Pengguna Lensa Kontak', 'Pejalan Kaki'],
    incubationOrOnset: 'Langsung terjadi saat terpapar kabut asap',
    firstAid: [
      'Teteskan obat tetes mata penyegar / artificial tears tanpa pengawet',
      'Jangan mengucek mata dengan tangan kotor',
      'Bilas dengan cairan salin steril jika ada debu masuk'
    ],
    prevention: [
      'Gunakan kacamata pelindung (goggles) saat berkendara motor',
      'Lepaskan lensa kontak saat kondisi kabut asap parah'
    ],
    ispuTriggerLevel: 'WASPADA',
    iconType: 'eye',
  },
  {
    id: 'kanker-paru',
    name: 'Kanker Paru-paru & Malignansi',
    category: 'Onkologi',
    pollutants: ['PM2.5 Karsinogenik', 'Benzena', 'Poliaromatik Hidrokarbon (PAH)'],
    severity: 'Kritis',
    shortDesc: 'Pertumbuhan sel ganas di paru akibat mutasi DNA yang dipicu partikel kimia toksik.',
    description: 'Badan Kesehatan Dunia (WHO / IARC) mengklasifikasikan polusi udara luar ruangan dan PM2.5 sebagai Karsinogen Grup 1 bagi manusia. Senyawa PAH dan hidrokarbon yang menempel pada PM2.5 memicu mutasi genetik sel paru.',
    symptoms: [
      'Batuk berdarah atau dahak bercak darah',
      'Suara serak menetap lebih dari 3 minggu',
      'Nyeri dada parah yang memburuk saat bernapas dalam',
      'Penurunan berat badan dan nafsu makan drastis'
    ],
    riskGroups: ['Warga Tinggal >10 Tahun di Kawasan Industri/Jalan Utama', 'Perokok'],
    incubationOrOnset: 'Latensi panjang (10 - 25 tahun paparan berkelanjutan)',
    firstAid: [
      'Pemeriksaan CT-Scan thorax dosis rendah (Low-dose CT)',
      'Konsultasi ke Dokter Spesialis Paru Onkologi'
    ],
    prevention: [
      'Dukungan regulasi emisi pemda untuk penutupan cerobong ilegal',
      'Penggunaan filter HEPA mutu tinggi di rumah',
      'Pemeriksaan kesehatan paru berkala'
    ],
    ispuTriggerLevel: 'BERBAHAYA',
    iconType: 'cancer',
  },
  {
    id: 'stunting-neuro',
    name: 'Gangguan Perkembangan Otak Balita & Stunting',
    category: 'Saraf & Perkembangan',
    pollutants: ['PM2.5', 'Timbal (Pb)', 'CO'],
    severity: 'Tinggi',
    shortDesc: 'Hambatan kognitif dan pertumbuhan fisik janin/balita akibat toksisitas neuro-inflamasi.',
    description: 'Ibu hamil yang menghirup PM2.5 dan Timbal mengalami penurunan pasokan oksigen ke plasenta. Partikel nano sanggup menembus sawar darah otak bayi, memicu neuroinflamasi yang mengganggu konsentrasi dan IQ.',
    symptoms: [
      'Keterlambatan bicara (speech delay) pada balita',
      'Gangguan pemusatan perhatian dan hiperaktivitas (ADHD)',
      'Tinggi badan anak di bawah standar kurva pertumbuhan (Stunting)',
      'Sering sakit ISPA berulang'
    ],
    riskGroups: ['Ibu Hamil', 'Bayi Baru Lahir (Neonatal)', 'Balita Usia 0-5 Tahun'],
    incubationOrOnset: 'Terjadi sejak masa gestasi (dalam kandungan) hingga usia balita',
    firstAid: [
      'Konsultasi gizi dan nutrisi kaya zat besi & asam folat',
      'Evakuasi ibu hamil ke area dengan kualitas udara bersih saat polusi ekstrem'
    ],
    prevention: [
      'Pemasangan Air Purifier di kamar ibu hamil dan bayi',
      'Gunakan masker N95 khusus saat ibu hamil keluar rumah'
    ],
    ispuTriggerLevel: 'WASPADA',
    iconType: 'brain',
  }
];
