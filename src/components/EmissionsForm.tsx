import React from 'react';
import { VehicleData, FactoryData, EnvironmentalData } from '../types';
import { Car, Factory, Wind, Sliders, RefreshCw, Layers } from 'lucide-react';

interface EmissionsFormProps {
  vehicles: VehicleData;
  factory: FactoryData;
  environment: EnvironmentalData;
  onChangeVehicles: (vehicles: VehicleData) => void;
  onChangeFactory: (factory: FactoryData) => void;
  onChangeEnvironment: (env: EnvironmentalData) => void;
  onResetToDefaults: () => void;
  theme?: 'dark' | 'light';
}

export const EmissionsForm: React.FC<EmissionsFormProps> = ({
  vehicles,
  factory,
  environment,
  onChangeVehicles,
  onChangeFactory,
  onChangeEnvironment,
  onResetToDefaults,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  const handleVehicleChange = (key: keyof VehicleData, val: number) => {
    onChangeVehicles({ ...vehicles, [key]: Math.max(0, val) });
  };

  const handleFactoryChange = <K extends keyof FactoryData>(key: K, val: FactoryData[K]) => {
    onChangeFactory({ ...factory, [key]: val });
  };

  const handleEnvChange = <K extends keyof EnvironmentalData>(key: K, val: EnvironmentalData[K]) => {
    onChangeEnvironment({ ...environment, [key]: val });
  };

  return (
    <div id="emissions-form-panel" className={`border rounded-2xl p-5 sm:p-6 shadow-lg space-y-6 transition-colors duration-200 ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Panel Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Sliders className="w-5 h-5 text-emerald-500" />
            Kalkulator Parameter Emisi & Simulasi Real-Time
          </h3>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Sesuaikan jumlah kendaraan, cerobong industri, dan parameter cuaca untuk mengestimasi dampak polusi udara.
          </p>
        </div>
        <button
          id="reset-parameters-btn"
          onClick={onResetToDefaults}
          className={`self-start sm:self-auto px-3 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
          Reset Parameter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 1: KENDARAAN BERMOTOR */}
        <div className={`rounded-xl p-4 border space-y-4 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className={`flex items-center gap-2 border-b pb-2.5 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <Car className="w-4 h-4 text-sky-500" />
            <h4 className={`text-sm font-bold ${isLight ? 'text-sky-800' : 'text-sky-300'}`}>1. Total Kendaraan Melintas (per Hari)</h4>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Sepeda Motor */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Sepeda Motor (2-Stroke/4-Stroke)</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">{vehicles.motorcycles.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={vehicles.motorcycles}
                onChange={(e) => handleVehicleChange('motorcycles', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-sky-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>

            {/* Mobil Bensin */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Mobil Penumpang Bensin</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">{vehicles.gasolineCars.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={vehicles.gasolineCars}
                onChange={(e) => handleVehicleChange('gasolineCars', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-sky-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>

            {/* Mobil Diesel / SUV */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Mobil Diesel / SUV Heavy</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">{vehicles.dieselCars.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="250"
                value={vehicles.dieselCars}
                onChange={(e) => handleVehicleChange('dieselCars', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-sky-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>

            {/* Bus Kota / BRT */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Bus Rapit Transit / Angkutan Umum</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">{vehicles.buses.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={vehicles.buses}
                onChange={(e) => handleVehicleChange('buses', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-sky-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>

            {/* Truk Kontainer Heavy */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Truk Berat / Kontainer Logistik</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">{vehicles.heavyTrucks.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25000"
                step="250"
                value={vehicles.heavyTrucks}
                onChange={(e) => handleVehicleChange('heavyTrucks', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-sky-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CEROBONG PABRIK & INDUSTRI */}
        <div className={`rounded-xl p-4 border space-y-4 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className={`flex items-center gap-2 border-b pb-2.5 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <Factory className="w-4 h-4 text-purple-500" />
            <h4 className={`text-sm font-bold ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>2. Emisi Pabrik & Cerobong Industri</h4>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Industry Type Select */}
            <div>
              <label className={`block mb-1 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Kategori Industri Utama</label>
              <select
                value={factory.industryType}
                onChange={(e) => handleFactoryChange('industryType', e.target.value as any)}
                className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none ${
                  isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <option value="PLTU Batubara">PLTU Batubara (Power Plant)</option>
                <option value="Pabrik Semen">Pabrik Semen & Material</option>
                <option value="Kimia & Petrokimia">Industri Kimia & Petrokimia</option>
                <option value="Tekstil & Boiler">Tekstil & Boiler Industri</option>
                <option value="Manufaktur Umum">Manufaktur Umum & Otomotif</option>
              </select>
            </div>

            {/* Cerobong Aktif */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Jumlah Cerobong Asap Aktif</span>
                <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">{factory.stackCount} Cerobong</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={factory.stackCount}
                onChange={(e) => handleFactoryChange('stackCount', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className={`block mb-1 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Bahan Bakar Industri</label>
              <select
                value={factory.fuelType}
                onChange={(e) => handleFactoryChange('fuelType', e.target.value as any)}
                className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none ${
                  isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <option value="Batubara">Batubara (Coal)</option>
                <option value="MFO / Minyak Berat">MFO / Minyak Berat (Heavy Fuel)</option>
                <option value="Gas Alam">Gas Alam (Natural Gas)</option>
                <option value="Biomasa / Kayu">Biomasa / Kayu Industry</option>
              </select>
            </div>

            {/* Konsumsi Bahan Bakar (Ton/Hari) */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Konsumsi Bahan Bakar</span>
                <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">{factory.fuelConsumptionTonsPerDay} Ton/Hari</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={factory.fuelConsumptionTonsPerDay}
                onChange={(e) => handleFactoryChange('fuelConsumptionTonsPerDay', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>

            {/* Scrubber Efficiency */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Efisiensi Wet Scrubber / Filter</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{factory.scrubberEfficiency}% Filtered</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={factory.scrubberEfficiency}
                onChange={(e) => handleFactoryChange('scrubberEfficiency', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: PARAMETER LINGKUNGAN & CUACA */}
        <div className={`rounded-xl p-4 border space-y-4 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className={`flex items-center gap-2 border-b pb-2.5 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <Wind className="w-4 h-4 text-emerald-500" />
            <h4 className={`text-sm font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>3. Kondisi Cuaca & Atmosfer</h4>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Arah Mata Angin */}
            <div>
              <label className={`block mb-1 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Arah Mata Angin (Wind Direction)</label>
              <select
                value={environment.windDirection || 'Barat Laut'}
                onChange={(e) => {
                  const dir = e.target.value as any;
                  let deg = 315;
                  if (dir === 'Utara') deg = 0;
                  else if (dir === 'Timur Laut') deg = 45;
                  else if (dir === 'Timur') deg = 90;
                  else if (dir === 'Tenggara') deg = 135;
                  else if (dir === 'Selatan') deg = 180;
                  else if (dir === 'Barat Daya') deg = 225;
                  else if (dir === 'Barat') deg = 270;
                  else if (dir === 'Barat Laut') deg = 315;

                  onChangeEnvironment({
                    ...environment,
                    windDirection: dir,
                    windDirectionDegrees: deg,
                  });
                }}
                className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none ${
                  isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <option value="Utara">Utara (0°)</option>
                <option value="Timur Laut">Timur Laut (45°)</option>
                <option value="Timur">Timur (90°)</option>
                <option value="Tenggara">Tenggara (135°)</option>
                <option value="Selatan">Selatan (180°)</option>
                <option value="Barat Daya">Barat Daya (225°)</option>
                <option value="Barat">Barat (270°)</option>
                <option value="Barat Laut">Barat Laut (315°)</option>
              </select>
            </div>

            {/* Curah Hujan */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Curah Hujan (Rainfall Washout)</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{environment.rainfallMmHr || 0} mm/jam</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={environment.rainfallMmHr || 0}
                onChange={(e) => {
                  const mm = Number(e.target.value);
                  let cond: any = 'Cerah / Tanpa Hujan';
                  if (mm > 15) cond = 'Hujan Lebat / Badai (>15 mm/jam)';
                  else if (mm >= 6) cond = 'Hujan Sedang (6-15 mm/jam)';
                  else if (mm >= 1) cond = 'Hujan Ringan (1-5 mm/jam)';

                  onChangeEnvironment({
                    ...environment,
                    rainfallMmHr: mm,
                    rainfallCondition: cond,
                  });
                }}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
              <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                *Hujan meluruhkan partikel PM2.5 & PM10 dari atmosfer secara alami.
              </span>
            </div>

            {/* Kecepatan Angin */}

            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Kecepatan Angin (Dispersion)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{environment.windSpeedKmh} km/jam</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                value={environment.windSpeedKmh}
                onChange={(e) => handleEnvChange('windSpeedKmh', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
              <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                *Angin kencang membantu mendispersikan partikel polusi.
              </span>
            </div>

            {/* Suhu Udara */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Suhu Udara</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{environment.temperatureC} °C</span>
              </div>
              <input
                type="range"
                min="20"
                max="42"
                value={environment.temperatureC}
                onChange={(e) => handleEnvChange('temperatureC', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>

            {/* Kelembaban */}
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Kelembaban Udara</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{environment.humidityPercent}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                value={environment.humidityPercent}
                onChange={(e) => handleEnvChange('humidityPercent', Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
              />
            </div>

            {/* Inversi Suhu Toggle */}
            <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
              <label className={`flex items-center justify-between cursor-pointer p-2 rounded-lg border transition ${
                isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className={`font-semibold block text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Lapisan Inversi Suhu</span>
                    <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Jebakan emisi di lapisan udara bawah</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={environment.inversionLayer}
                  onChange={(e) => handleEnvChange('inversionLayer', e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-700 rounded focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
