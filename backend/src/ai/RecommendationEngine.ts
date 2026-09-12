import { AIMode, AIRecommendationResult } from '../types/index.js';
import { StationWithDetails, stationRankingService } from '../services/stationRankingService.js';
import { confidenceEngine } from './ConfidenceEngine.js';

export interface RecommendationContext {
  userLocation: { latitude: number; longitude: number };
  vehicle: {
    id: string;
    brand: string;
    model: string;
    connectorType: string;
    maxChargingPowerKW: number;
    batteryCapacityKWh: number;
    currentBatteryPercentage: number;
    targetBatteryPercentage: number;
    type: string;
  };
  mode: AIMode;
  stations: StationWithDetails[];
}

export class RecommendationEngine {
  getRecommendation(context: RecommendationContext): AIRecommendationResult | null {
    if (!context.stations || context.stations.length === 0) {
      return null;
    }

    const ranked = stationRankingService.rankStations(
      context.stations,
      context.userLocation,
      context.vehicle,
      context.mode
    );

    if (ranked.length === 0) return null;

    const top = ranked[0];
    const confidence = confidenceEngine.calculate({
      hasLiveAvailability: top.station.availableChargers > 0,
      hasActualPrice: top.station.priceType === 'ACTUAL',
    });

    return {
      stationId: top.station.id,
      stationName: top.station.name,
      networkName: top.station.network?.name || 'EV Network',
      score: top.totalScore,
      estimatedPricePerKWh: top.estimatedPricePerKWh,
      distanceKm: top.distanceKm,
      renewablePercentage: top.renewablePercentage,
      greenScore: top.greenScore,
      chargingTimeMinutes: top.chargingTimeMinutes,
      estimatedCostInr: top.estimatedCostInr,
      reasons: top.reasons,
      confidence: confidence.level,
      action: {
        type: 'OPEN_STATION',
        label: 'View Station Details & Navigate',
        stationId: top.station.id,
        payload: {
          stationId: top.station.id,
          latitude: top.station.latitude,
          longitude: top.station.longitude,
          estimatedCostInr: top.estimatedCostInr,
          mode: context.mode,
        },
      },
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
