import { AIMode } from '../types/index.js';
import { calculateDistanceKm } from '../utils/geo.js';
import { vehicleCompatibilityService } from './vehicleCompatibilityService.js';
import { pricingEngine } from './pricingEngine.js';

export interface StationWithDetails {
  id: string;
  networkId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  connectors: string;
  chargingPowerKW: number;
  availability: string;
  pricePerKWh: number;
  priceType: string;
  availableChargers: number;
  totalChargers: number;
  network?: {
    name: string;
    logo?: string | null;
  };
}

export interface RankedStation {
  station: StationWithDetails;
  totalScore: number;
  distanceKm: number;
  estimatedPricePerKWh: number;
  estimatedCostInr: number;
  chargingTimeMinutes: number;
  greenScore: number;
  renewablePercentage: number;
  isCompatible: boolean;
  scoringFactors: {
    distanceScore: number;
    priceScore: number;
    availabilityScore: number;
    speedScore: number;
    greenScore: number;
  };
  reasons: string[];
}

export class StationRankingService {
  rankStations(
    stations: StationWithDetails[],
    userLocation: { latitude: number; longitude: number },
    vehicle: {
      connectorType: string;
      maxChargingPowerKW: number;
      batteryCapacityKWh: number;
      currentBatteryPercentage: number;
      targetBatteryPercentage: number;
      type: string;
    },
    mode: AIMode = 'SMART'
  ): RankedStation[] {
    const dynamicPrice = pricingEngine.calculateDynamicPrice();

    const ranked: RankedStation[] = stations.map((st) => {
      const distanceKm = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        st.latitude,
        st.longitude
      );

      const comp = vehicleCompatibilityService.checkCompatibility(vehicle, st);
      const effectivePowerKW = comp.maximumExpectedPowerKW || 7.2;

      // Energy required
      const deltaPct = Math.max(0, vehicle.targetBatteryPercentage - vehicle.currentBatteryPercentage);
      const energyNeededKWh = (deltaPct / 100) * vehicle.batteryCapacityKWh / 0.90; // 90% charging efficiency

      // Realistic charging duration (in minutes)
      const chargingTimeMinutes = Math.round((energyNeededKWh / effectivePowerKW) * 60);

      // Price: use actual station price if available, otherwise dynamic price
      const effectivePrice = st.pricePerKWh || dynamicPrice.estimatedPricePerKWh;
      const estimatedCostInr = Math.round(energyNeededKWh * effectivePrice * 10) / 10;

      // Green Score: higher if station has high renewable energy (mocked/derived per station)
      const greenBonus = st.name.toLowerCase().includes('solar') || st.name.toLowerCase().includes('green') ? 15 : 0;
      const stationGreenScore = Math.min(100, dynamicPrice.greenScore + greenBonus);
      const renewablePct = Math.min(100, dynamicPrice.renewablePercentage + (greenBonus > 0 ? 10 : 0));

      // Compute Individual Component Scores (0 - 100)
      const distanceScore = Math.max(0, Math.min(100, Math.round(100 - distanceKm * 4))); // 25km = 0
      const priceScore = Math.max(0, Math.min(100, Math.round(100 - (effectivePrice - 4) * 10))); // ₹4=100, ₹14=0
      const availabilityScore = st.availableChargers > 0
        ? Math.round((st.availableChargers / Math.max(st.totalChargers, 1)) * 100)
        : 5;
      const speedScore = Math.min(100, Math.round((effectivePowerKW / 150) * 100));
      const greenScoreVal = stationGreenScore;

      // Weights based on AI Mode
      let wDist = 0.25;
      let wPrice = 0.25;
      let wAvail = 0.20;
      let wSpeed = 0.15;
      let wGreen = 0.15;

      if (mode === 'CHEAPEST') {
        wPrice = 0.50;
        wDist = 0.15;
        wAvail = 0.15;
        wSpeed = 0.10;
        wGreen = 0.10;
      } else if (mode === 'GREENEST') {
        wGreen = 0.50;
        wDist = 0.15;
        wPrice = 0.15;
        wAvail = 0.10;
        wSpeed = 0.10;
      } else if (mode === 'FASTEST') {
        wSpeed = 0.40;
        wDist = 0.30;
        wAvail = 0.20;
        wPrice = 0.05;
        wGreen = 0.05;
      } else if (mode === 'EMERGENCY') {
        wDist = 0.50;
        wAvail = 0.35;
        wSpeed = 0.15;
        wPrice = 0.00;
        wGreen = 0.00;
      }

      let totalScore = Math.round(
        distanceScore * wDist +
        priceScore * wPrice +
        availabilityScore * wAvail +
        speedScore * wSpeed +
        greenScoreVal * wGreen
      );

      // Incompatible stations penalized heavily
      if (!comp.compatible) {
        totalScore = Math.max(0, totalScore - 50);
      }

      const reasons: string[] = [];
      if (comp.compatible) {
        reasons.push(`Compatible with your ${vehicle.connectorType} connector`);
      } else {
        reasons.push(comp.reason);
      }

      if (distanceKm <= 3) {
        reasons.push(`Very close (${distanceKm} km away)`);
      }
      if (effectivePrice <= 7.50) {
        reasons.push(`Low tariff of ₹${effectivePrice.toFixed(2)}/kWh`);
      }
      if (stationGreenScore >= 85) {
        reasons.push(`High Green Score (${stationGreenScore}/100) with ${renewablePct}% clean energy`);
      }
      if (st.availableChargers > 0) {
        reasons.push(`${st.availableChargers} of ${st.totalChargers} charging bays currently open`);
      }

      return {
        station: st,
        totalScore,
        distanceKm,
        estimatedPricePerKWh: effectivePrice,
        estimatedCostInr,
        chargingTimeMinutes,
        greenScore: stationGreenScore,
        renewablePercentage: renewablePct,
        isCompatible: comp.compatible,
        scoringFactors: {
          distanceScore,
          priceScore,
          availabilityScore,
          speedScore,
          greenScore: greenScoreVal,
        },
        reasons,
      };
    });

    // Sort descending by total score
    return ranked.sort((a, b) => b.totalScore - a.totalScore);
  }
}

export const stationRankingService = new StationRankingService();
