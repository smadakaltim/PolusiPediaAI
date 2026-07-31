import {
  VehicleData,
  FactoryData,
  EnvironmentalData,
  PollutantBreakdown,
  EmissionSourceBreakdown,
  HealthRiskAdvisory,
  PemdaMitigationPolicy,
  PollutionCalculationResult,
  PollutionLevel,
} from '../types';

/**
 * Calculates real-time pollution metrics, ISPU score, classification level,
 * source contribution, health risks, and local government mitigation policies.
 */
export function calculatePollution(
  vehicles: VehicleData,
  factory: FactoryData,
  environment: EnvironmentalData,
  populationTotal: number = 1500000
): PollutionCalculationResult {

  // 1. Calculate Daily & Hourly Vehicle Emissions (kg/day)
  // Factors in grams/vehicle/day (assuming average 15 km urban drive per vehicle)
  const vehicleCoKg =
    (vehicles.motorcycles * 8 +
      vehicles.gasolineCars * 18 +
      vehicles.dieselCars * 6 +
      vehicles.buses * 35 +
      vehicles.lightTrucks * 25 +
      vehicles.heavyTrucks * 60) /
    1000;

  const vehicleNoxKg =
    (vehicles.motorcycles * 0.8 +
      vehicles.gasolineCars * 2.5 +
      vehicles.dieselCars * 7.5 +
      vehicles.buses * 42.0 +
      vehicles.lightTrucks * 22.0 +
      vehicles.heavyTrucks * 75.0) /
    1000;

  const vehiclePm25Kg =
    (vehicles.motorcycles * 0.15 +
      vehicles.gasolineCars * 0.2 +
      vehicles.dieselCars * 1.8 +
      vehicles.buses * 8.5 +
      vehicles.lightTrucks * 5.2 +
      vehicles.heavyTrucks * 18.5) /
    1000;

  const vehiclePm10Kg = vehiclePm25Kg * 1.45;

  const vehicleSo2Kg =
    (vehicles.motorcycles * 0.05 +
      vehicles.gasolineCars * 0.1 +
      vehicles.dieselCars * 1.2 +
      vehicles.buses * 6.0 +
      vehicles.lightTrucks * 3.5 +
      vehicles.heavyTrucks * 14.0) /
    1000;

  const totalVehicleEmissionsKg =
    vehicleCoKg + vehicleNoxKg + vehiclePm25Kg + vehiclePm10Kg + vehicleSo2Kg;

  // 2. Calculate Daily Factory Emissions (kg/day)
  // Scrubber Efficiency Factor
  const filterPass = Math.max(0.05, 1 - factory.scrubberEfficiency / 100);

  let fuelPm25Factor = 3.5; // kg PM2.5 per ton fuel
  let fuelSo2Factor = 12.0; // kg SO2 per ton fuel
  let fuelNoxFactor = 6.0; // kg NOx per ton fuel
  let fuelCoFactor = 2.0; // kg CO per ton fuel

  switch (factory.fuelType) {
    case 'Batubara':
      fuelPm25Factor = 6.5;
      fuelSo2Factor = 18.0;
      fuelNoxFactor = 8.5;
      fuelCoFactor = 3.0;
      break;
    case 'MFO / Minyak Berat':
      fuelPm25Factor = 4.2;
      fuelSo2Factor = 22.0;
      fuelNoxFactor = 9.0;
      fuelCoFactor = 1.5;
      break;
    case 'Gas Alam':
      fuelPm25Factor = 0.2;
      fuelSo2Factor = 0.1;
      fuelNoxFactor = 3.5;
      fuelCoFactor = 0.8;
      break;
    case 'Biomasa / Kayu':
      fuelPm25Factor = 7.0;
      fuelSo2Factor = 2.0;
      fuelNoxFactor = 4.0;
      fuelCoFactor = 12.0;
      break;
  }

  // Multiply by active stacks & operating hours proportion
  const stackMultiplier = factory.stackCount * (factory.operatingHoursPerDay / 24);
  const factoryPm25Kg = factory.fuelConsumptionTonsPerDay * fuelPm25Factor * filterPass * (stackMultiplier / 5);
  const factoryPm10Kg = factoryPm25Kg * 1.6;
  const factorySo2Kg = factory.fuelConsumptionTonsPerDay * fuelSo2Factor * filterPass * (stackMultiplier / 5);
  const factoryNoxKg = factory.fuelConsumptionTonsPerDay * fuelNoxFactor * (stackMultiplier / 5);
  const factoryCoKg = factory.fuelConsumptionTonsPerDay * fuelCoFactor * (stackMultiplier / 5);

  const totalFactoryEmissionsKg =
    factoryPm25Kg + factoryPm10Kg + factorySo2Kg + factoryNoxKg + factoryCoKg;

  // Source contribution
  const grandTotalEmissionsKg = Math.max(1, totalVehicleEmissionsKg + totalFactoryEmissionsKg);
  const vehicleSharePercent = Math.round((totalVehicleEmissionsKg / grandTotalEmissionsKg) * 100);
  const factorySharePercent = Math.min(100, Math.max(0, 100 - vehicleSharePercent));

  // 3. Environmental Dispersion & Rainfall Washout Model
  // Wind dilutes concentration; Inversion layer traps pollutants; Temp/Humidity affect secondary PM and Ozone
  const windFactor = Math.max(0.3, 14 / (environment.windSpeedKmh + 2)); // Wind speeds > 15 dilution
  const inversionFactor = environment.inversionLayer ? 2.2 : 1.0; // Inversion layer traps emissions
  const humidityFactor = 1 + (environment.humidityPercent - 50) * 0.005; // Humidity increases PM loading
  const tempOzoneFactor = 1 + Math.max(0, environment.temperatureC - 28) * 0.04; // Sun & temp generate ground O3

  // Rain washout factor (Wet Deposition reduces PM2.5 and PM10)
  let rainWashoutFactor = 1.0;
  let rainfallEffectText = 'Kondisi cuaca cerah/kering. Tidak ada efek peluruhan polutan oleh hujan.';

  if (environment.rainfallMmHr > 15) {
    rainWashoutFactor = 0.35; // 65% PM washed out
    rainfallEffectText = `Hujan Lebat (${environment.rainfallMmHr} mm/jam) meluruhkan ~65% partikel debu PM2.5 & PM10 secara alami.`;
  } else if (environment.rainfallMmHr >= 6) {
    rainWashoutFactor = 0.60; // 40% PM washed out
    rainfallEffectText = `Hujan Sedang (${environment.rainfallMmHr} mm/jam) membantu meluruhkan ~40% konsentrasi polutan udara.`;
  } else if (environment.rainfallMmHr >= 1) {
    rainWashoutFactor = 0.82; // 18% PM washed out
    rainfallEffectText = `Hujan Ringan (${environment.rainfallMmHr} mm/jam) memberikan efek peluruhan ringan (~18%) pada udara ambien.`;
  }

  const dispersionMultiplier = windFactor * inversionFactor * humidityFactor;

  // Final Ambient Concentrations (ug/m3 or ppm)
  const pm25Concentration = Math.round(
    Math.max(5, (vehiclePm25Kg * 0.08 + factoryPm25Kg * 0.12) * dispersionMultiplier * rainWashoutFactor)
  );
  const pm10Concentration = Math.round(pm25Concentration * 1.55);
  const no2Concentration = Math.round(
    Math.max(8, (vehicleNoxKg * 0.06 + factoryNoxKg * 0.08) * dispersionMultiplier)
  );
  const so2Concentration = Math.round(
    Math.max(4, (vehicleSo2Kg * 0.04 + factorySo2Kg * 0.14) * dispersionMultiplier)
  );
  const coConcentration = Number(
    Math.max(0.4, (vehicleCoKg * 0.0008 + factoryCoKg * 0.0005) * dispersionMultiplier).toFixed(1)
  );
  const o3Concentration = Math.round((no2Concentration * 0.85 + 10) * tempOzoneFactor);


  // 4. Calculate Indonesian ISPU (Indeks Standar Pencemar Udara) Score
  // ISPU formula based on PM2.5 breakpoint (primary pollutant for health)
  let ispuScore = 0;
  if (pm25Concentration <= 15.5) {
    ispuScore = Math.round((50 / 15.5) * pm25Concentration);
  } else if (pm25Concentration <= 55.4) {
    ispuScore = Math.round(51 + ((100 - 51) / (55.4 - 15.6)) * (pm25Concentration - 15.6));
  } else if (pm25Concentration <= 150.4) {
    ispuScore = Math.round(101 + ((200 - 101) / (150.4 - 55.5)) * (pm25Concentration - 55.5));
  } else if (pm25Concentration <= 250.4) {
    ispuScore = Math.round(201 + ((300 - 201) / (250.4 - 150.5)) * (pm25Concentration - 150.5));
  } else {
    ispuScore = Math.round(301 + ((500 - 301) / (500 - 250.5)) * (pm25Concentration - 250.5));
  }

  ispuScore = Math.min(500, Math.max(10, ispuScore));

  // Determine Primary Pollutant
  let primaryPollutant = 'PM2.5';
  if (so2Concentration > 120) primaryPollutant = 'SO2';
  else if (no2Concentration > 150) primaryPollutant = 'NO2';
  else if (o3Concentration > 160) primaryPollutant = 'O3 (Ozon Muka Tanah)';

  // 5. Categorize into 3 Levels: AMAN, WASPADA, BERBAHAYA
  let level: PollutionLevel = 'AMAN';
  if (ispuScore <= 50) {
    level = 'AMAN';
  } else if (ispuScore <= 150) {
    level = 'WASPADA';
  } else {
    level = 'BERBAHAYA';
  }

  // 6. Generate Health Risk Advisories
  let healthRisk: HealthRiskAdvisory;
  if (level === 'AMAN') {
    healthRisk = {
      generalPublicRisk: 'Kualitas udara sangat baik. Aman untuk beraktivitas di luar ruangan tanpa pembatasan.',
      vulnerableGroupsRisk: 'Risiko kesehatan sangat rendah bagi lansia, anak-anak, dan penderita penyakit pernapasan.',
      respiratoryRiskLevel: 'Rendah',
      recommendedMask: 'Masker tidak diperlukan.',
      outdoorActivityAdvice: 'Sangat direkomendasikan untuk olahraga outdoor, bersepeda, dan aktivitas keluarga.',
      indoorPurifierAdvice: 'Air purifier opsional, ventilasi udara alami sangat baik.',
    };
  } else if (level === 'WASPADA') {
    healthRisk = {
      generalPublicRisk: 'Udara mengandung polutan sedang. Masyarakat umum dapat merasakan iritasi tenggorokan ringan saat beraktivitas berat.',
      vulnerableGroupsRisk: 'Peringatan khusus bagi anak-anak, lansia, wanita hamil, dan penderita asthma/ISPA. Gejala batuk dan sesak napas dapat meningkat.',
      respiratoryRiskLevel: 'Sedang',
      recommendedMask: 'Masker Bedah Medis / Masker Kain Berkualitas saat berada di area publik lalu lintas tinggi.',
      outdoorActivityAdvice: 'Kurangi olahraga fisik berat di luar ruangan, terutama di dekat jalan raya utama atau kawasan industri.',
      indoorPurifierAdvice: 'Gunakan air purifier HEPA di ruang tidur dan ruang keluarga. Tutup jendela jika tinggal di pinggir jalan utama.',
    };
  } else {
    healthRisk = {
      generalPublicRisk: 'BAHAYA KESEHATAN AKUT! Paparan jangka pendek dapat memicu gangguan pernapasan berat, iritasi mata parah, sakit kepala, dan penurunan fungsi paru-paru.',
      vulnerableGroupsRisk: 'SANGAT BERBAHAYA! Risiko serangan asthma mendadak, penyakit jantung koroner memburuk, infeksi saluran pernapasan akut (ISPA) berat pada balita.',
      respiratoryRiskLevel: 'Kritis',
      recommendedMask: 'Masker Respirator N95 / KN95 WAJIB digunakan jika terpaksa keluar rumah.',
      outdoorActivityAdvice: 'HENTIKAN seluruh aktivitas luar ruangan! Batasi mobilitas non-darurat dan tetap berada di ruangan tertutup.',
      indoorPurifierAdvice: 'Nalakan Air Purifier HEPA secara terus-menerus. Tutup rapat celah pintu dan jendela.',
    };
  }

  // 7. Generate Pemda Mitigation Policies based on Level & Source dominancy
  const pemdaPolicies: PemdaMitigationPolicy[] = [];

  if (level === 'AMAN') {
    pemdaPolicies.push(
      {
        category: 'Transportasi',
        title: 'Pemeliharaan Zona Emisi Rendah & Uji Emisi Berkala',
        description: 'Lanjutkan razia uji emisi kendaraan gratis di terminal dan jalan arteri untuk mempertahankan kualitas udara.',
        priority: 'Rutin',
        expectedImpact: 'Mencegah lonjakan emisi dari kendaraan yang tidak terawat.',
      },
      {
        category: 'Lingkungan & Ruang Hijau',
        title: 'Perluasan Hutan Kota & Ruang Terbuka Hijau (RTH)',
        description: 'Tanam pohon penyerap polutan (Sansevieria, Trembesi, Mahoni) di sepanjang median jalan protokol.',
        priority: 'Rutin',
        expectedImpact: 'Meningkatkan penyerapan CO2 dan sekuestrasi partikulat alami.',
      }
    );
  } else if (level === 'WASPADA') {
    if (vehicleSharePercent >= 50) {
      pemdaPolicies.push({
        category: 'Transportasi',
        title: 'Penerapan Kebijakan Ganjil-Genap Extended & Manajemen Traffic',
        description: 'Perluas jam berlaku aturan Ganjil-Genap dan tingkatkan armada Bus Rapid Transit (BRT) gratis.',
        priority: 'Tinggi',
        expectedImpact: 'Menurunkan volume kendaraan pribadi hingga 25% di koridor utama.',
      });
    }

    if (factorySharePercent >= 30) {
      pemdaPolicies.push({
        category: 'Industri',
        title: 'Inspeksi Emisi Cerobong Pabrik & Audit CNOx/SOx',
        description: 'Dinas Lingkungan Hidup melakukan Sidak Continuous Emission Monitoring System (CEMS) pada pabrik dan boiler.',
        priority: 'Tinggi',
        expectedImpact: 'Memastikan pabrik mengoperasikan wet scrubber dan electrostatic precipitator secara penuh.',
      });
    }

    pemdaPolicies.push({
      category: 'Kebijakan Darurat & WFH',
      title: 'Himbauan Hybrid Working (50% WFH) Sektor Non-Esensial',
      description: 'Himbauan Pemda kepada perkantoran dan ASN untuk menerapkan sistem kerja fleksibel guna mengurangi kemacetan jam sibuk.',
      priority: 'Sedang',
      expectedImpact: 'Menurunkan beban kemacetan puncak pagi & sore.',
    });
  } else {
    // BERBAHAYA Level Policies
    pemdaPolicies.push(
      {
        category: 'Kebijakan Darurat & WFH',
        title: 'Instruksi Tanggap Darurat WFH 75% & Pembelajaran Jarak Jauh (PJJ)',
        description: 'Peraturan Kepala Daerah untuk WFH 75% perkantoran dan sekolah diliburkan/PJJ sementara hingga ISPU kembali di bawah 100.',
        priority: 'Tinggi',
        expectedImpact: 'Penurunan drastis pergerakan masyarakat dan pemicu emisi kendaraan harian.',
      },
      {
        category: 'Industri',
        title: 'Penghentian Operasional Sementara Pabrik Emisi Tinggi & Pembatasan Truk',
        description: 'Perintah pembatasan kapasitas produksi pabrik batubara/MFO hingga 50% dan pembatasan jam melintas truk berat.',
        priority: 'Tinggi',
        expectedImpact: 'Menurunkan beban emisi SO2, NOx, dan PM2.5 industri hingga 40%.',
      },
      {
        category: 'Transportasi',
        title: 'Penyiraman Jalan Protokol & Teknologi Modifikasi Cuaca (TMC)',
        description: 'Mobil Water Cannon Dinas Pemadam Kebakaran menyiram jalanan untuk mengikat debu PM, bekerjasama dengan BMKG untuk rekayasa hujan buatan.',
        priority: 'Tinggi',
        expectedImpact: 'Meluruhkan partikel PM2.5 mengambang di atmosfer secara cepat.',
      }
    );
  }

  // Calculate affected population based on ISPU level
  let exposureRatio = 0.15; // 15% affected at AMAN
  if (level === 'WASPADA') exposureRatio = 0.45; // 45% affected at WASPADA
  else if (level === 'BERBAHAYA') exposureRatio = 0.85; // 85% affected at BERBAHAYA

  const affectedPopulationEstimate = Math.round(populationTotal * exposureRatio);

  return {
    ispuScore,
    level,
    primaryPollutant,
    pollutants: {
      pm25: pm25Concentration,
      pm10: pm10Concentration,
      co: coConcentration,
      no2: no2Concentration,
      so2: so2Concentration,
      o3: o3Concentration,
    },
    sources: {
      vehicleEmissionsKgDay: Math.round(totalVehicleEmissionsKg),
      factoryEmissionsKgDay: Math.round(totalFactoryEmissionsKg),
      vehicleSharePercent,
      factorySharePercent,
    },
    healthRisk,
    pemdaPolicies,
    affectedPopulationEstimate,
    rainfallEffectText,
    calculatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };

}
