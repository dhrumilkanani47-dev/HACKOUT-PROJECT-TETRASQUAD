import { rangePrediction } from './RangePrediction.js';

export interface TripPlanInput {
  origin: { name: string; latitude: number; longitude: number };
  destination: { name: string; latitude: number; longitude: number };
  totalDistanceKm: number;
  currentBatteryPercentage: number;
  batteryCapacityKWh: number;
  vehicleEfficiencyWhPerKm?: number;
}

export class TripPlanner {
  planTrip(input: TripPlanInput) {
    const rangeResult = rangePrediction.predict({
      currentBatteryPercentage: input.currentBatteryPercentage,
      batteryCapacityKWh: input.batteryCapacityKWh,
      vehicleEfficiencyWhPerKm: input.vehicleEfficiencyWhPerKm,
      tripDistanceKm: input.totalDistanceKm,
    });

    const stopsNeeded = Math.max(0, Math.ceil((input.totalDistanceKm - rangeResult.estimatedRangeKm * 0.85) / (rangeResult.estimatedRangeKm * 0.70)));

    return {
      totalDistanceKm: input.totalDistanceKm,
      currentRangeKm: rangeResult.estimatedRangeKm,
      canCompleteWithoutCharging: (rangeResult.canReachDestination === true),
      stopsNeeded,
      recommendedChargingStops: stopsNeeded > 0 ? [
        {
          stopNumber: 1,
          locationName: 'Midway Highway Hypercharger Plaza',
          distanceFromOriginKm: Math.round(rangeResult.estimatedRangeKm * 0.75),
          recommendedChargePct: 80,
          estimatedChargingTimeMinutes: 28,
        }
      ] : [],
      advice: stopsNeeded === 0
        ? 'You have sufficient charge to reach your destination with safe buffer.'
        : `Plan for ${stopsNeeded} quick fast-charging stop(s) along the corridor.`,
    };
  }
}

export const tripPlanner = new TripPlanner();
