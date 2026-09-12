export interface RangePredictionInput {
  currentBatteryPercentage: number;
  batteryCapacityKWh: number;
  vehicleEfficiencyWhPerKm?: number; // e.g. 132 Wh/km for Nexon EV, 32 for Ather
  ambientTemperatureC?: number;      // e.g. 35C in Indian summer
  tripDistanceKm?: number;
}

export interface RangePredictionResult {
  estimatedRangeKm: number;
  usableEnergyKWh: number;
  efficiencyWhPerKm: number;
  estimatedArrivalBatteryPct: number | null;
  canReachDestination: boolean | null;
  temperatureImpact: string;
  disclaimer: string;
  confidence: 'HIGH' | 'MEDIUM';
}

export class RangePrediction {
  predict(input: RangePredictionInput): RangePredictionResult {
    let efficiency = input.vehicleEfficiencyWhPerKm ?? 135; // default 135 Wh/km for Indian 4W EVs

    // Temperature impact: Extreme heat (>38C) or cold (<15C) increases HVAC/cooling load by 6-12%
    const temp = input.ambientTemperatureC ?? 32;
    let tempImpactFactor = 1.0;
    let tempDesc = 'Normal thermal operating range (optimal efficiency).';

    if (temp >= 40) {
      tempImpactFactor = 1.12; // 12% higher consumption due to AC & battery cooling
      tempDesc = 'High ambient heat (>40°C) increases cabin AC & battery cooling load by ~12%.';
    } else if (temp >= 36) {
      tempImpactFactor = 1.06;
      tempDesc = 'Warm weather (~36°C) incurs mild AC auxiliary power consumption (+6%).';
    } else if (temp <= 14) {
      tempImpactFactor = 1.08;
      tempDesc = 'Lower temperatures mildly decrease lithium battery chemical discharge rate.';
    }

    const effectiveEfficiency = efficiency * tempImpactFactor;

    // Remaining usable battery (reserve buffer 5%)
    const usableEnergyKWh = (input.currentBatteryPercentage / 100) * input.batteryCapacityKWh;
    const estimatedRangeKm = Math.round((usableEnergyKWh / (effectiveEfficiency / 1000)));

    let estimatedArrivalBatteryPct: number | null = null;
    let canReachDestination: boolean | null = null;

    if (input.tripDistanceKm !== undefined && input.tripDistanceKm > 0) {
      const energyRequiredForTripKWh = (input.tripDistanceKm * effectiveEfficiency) / 1000;
      const remainingEnergyKWh = usableEnergyKWh - energyRequiredForTripKWh;
      const arrivalPct = Math.round((remainingEnergyKWh / input.batteryCapacityKWh) * 100);

      estimatedArrivalBatteryPct = Math.max(0, arrivalPct);
      canReachDestination = remainingEnergyKWh > (input.batteryCapacityKWh * 0.05); // >5% reserve
    }

    return {
      estimatedRangeKm,
      usableEnergyKWh: Math.round(usableEnergyKWh * 10) / 10,
      efficiencyWhPerKm: Math.round(effectiveEfficiency),
      estimatedArrivalBatteryPct,
      canReachDestination,
      temperatureImpact: tempDesc,
      disclaimer: 'Estimated real-world range based on current driving conditions, AC usage and state of charge. Actual range varies with driving style and terrain.',
      confidence: 'HIGH',
    };
  }
}

export const rangePrediction = new RangePrediction();
