/**
 * Geo & Dispersion Radius Utility Functions
 */

// Haversine formula to calculate distance in kilometers between two lat/lng points
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  return Number(distanceKm.toFixed(2));
}

// Calculate Pollution Dispersion Radius & Surface Area Coverage in km²
export interface PollutionPlumeRadiusResult {
  dangerRadiusKm: number; // Red Zone Radius
  alertRadiusKm: number; // Yellow Zone Radius
  safePerimeterKm: number; // Green Outer Perimeter
  dangerAreaKm2: number; // Surface area in km² (pi * r²)
  alertAreaKm2: number;
  totalAffectedAreaKm2: number;
}

export function calculatePollutionPlumeRadius(
  ispuScore: number,
  windSpeedKmh: number,
  rainfallMmHr: number
): PollutionPlumeRadiusResult {
  // Base radius scaling with ISPU
  // ISPU 50 -> Danger 0.8 km, Alert 2.5 km
  // ISPU 150 -> Danger 3.5 km, Alert 8.0 km
  // ISPU 300 -> Danger 8.5 km, Alert 18.0 km

  let baseDangerKm = 0.5 + (ispuScore / 300) * 6.5;
  let baseAlertKm = 1.8 + (ispuScore / 300) * 14.0;

  // Wind speeds carry plume further out
  const windExpansionFactor = 1 + (windSpeedKmh / 20) * 0.45;

  // Rain reduces airborne particulate radius
  const rainReductionFactor = rainfallMmHr > 10 ? 0.6 : rainfallMmHr > 2 ? 0.8 : 1.0;

  const dangerRadiusKm = Number((baseDangerKm * windExpansionFactor * rainReductionFactor).toFixed(2));
  const alertRadiusKm = Number((baseAlertKm * windExpansionFactor * rainReductionFactor).toFixed(2));
  const safePerimeterKm = Number((alertRadiusKm * 1.8).toFixed(2));

  // Area in sq km (pi * r^2)
  const dangerAreaKm2 = Number((Math.PI * Math.pow(dangerRadiusKm, 2)).toFixed(1));
  const alertAreaKm2 = Number((Math.PI * Math.pow(alertRadiusKm, 2)).toFixed(1));
  const totalAffectedAreaKm2 = alertAreaKm2;

  return {
    dangerRadiusKm,
    alertRadiusKm,
    safePerimeterKm,
    dangerAreaKm2,
    alertAreaKm2,
    totalAffectedAreaKm2,
  };
}
