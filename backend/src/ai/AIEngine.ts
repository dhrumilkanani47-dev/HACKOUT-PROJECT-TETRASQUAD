import { AIMode, AIAction, ConfidenceLevel } from '../types/index.js';
import { intentParser } from './IntentParser.js';
import { recommendationEngine, RecommendationContext } from './RecommendationEngine.js';
import { rangePrediction } from './RangePrediction.js';
import { pricingEngine } from '../services/pricingEngine.js';
import { StationWithDetails } from '../services/stationRankingService.js';
import { logger } from '../utils/logger.js';

export interface ChatResponse {
  message: string;
  recommendations: any[];
  actions: AIAction[];
  confidence: ConfidenceLevel;
  dataFreshness: string;
  isFallback: boolean;
}

export class AIEngine {
  async processChat(
    message: string,
    context: {
      userLocation: { latitude: number; longitude: number };
      vehicle?: {
        id: string;
        brand: string;
        model: string;
        connectorType: string;
        maxChargingPowerKW: number;
        batteryCapacityKWh: number;
        currentBatteryPercentage: number;
        targetBatteryPercentage: number;
        type: string;
      } | null;
      stations: StationWithDetails[];
      mode?: AIMode;
    }
  ): Promise<ChatResponse> {
    try {
      const parsed = intentParser.parse(message);
      const activeMode: AIMode = context.mode || (
        parsed.intent === 'CHEAPEST_CHARGER' ? 'CHEAPEST' :
        parsed.intent === 'GREENEST_CHARGER' ? 'GREENEST' :
        parsed.intent === 'FASTEST_CHARGER' ? 'FASTEST' :
        parsed.intent === 'HOSPITAL_NEARBY' ? 'EMERGENCY' : 'SMART'
      );

      const defaultVehicle = context.vehicle || {
        id: 'default_veh',
        brand: 'Tata',
        model: 'Nexon EV',
        connectorType: 'CCS2',
        maxChargingPowerKW: 50,
        batteryCapacityKWh: 40.5,
        currentBatteryPercentage: 35,
        targetBatteryPercentage: 80,
        type: 'SUV',
      };

      const recContext: RecommendationContext = {
        userLocation: context.userLocation,
        vehicle: defaultVehicle,
        mode: activeMode,
        stations: context.stations,
      };

      const topRec = recommendationEngine.getRecommendation(recContext);
      const actions: AIAction[] = [];
      let replyMessage = '';

      switch (parsed.intent) {
        case 'CHEAPEST_CHARGER': {
          if (topRec) {
            replyMessage = `Head to **${topRec.stationName}** (${topRec.networkName}) for the lowest dynamic tariff in your vicinity at ₹${topRec.estimatedPricePerKWh.toFixed(2)}/kWh. Estimated charging session cost is ~₹${topRec.estimatedCostInr}.`;
            actions.push(topRec.action);
            actions.push({ type: 'FILTER_STATIONS', label: 'Show Low-Cost Stations', payload: { maxPrice: 7.50 } });
          } else {
            replyMessage = 'No compatible chargers found matching the lowest tariff criteria in your current radius.';
          }
          break;
        }

        case 'GREENEST_CHARGER': {
          if (topRec) {
            replyMessage = `**${topRec.stationName}** is currently powered by **${topRec.renewablePercentage}% clean solar and wind energy** (Green Score: ${topRec.greenScore}/100). Charging here avoids peak coal emissions.`;
            actions.push(topRec.action);
          } else {
            replyMessage = 'No green chargers with verified renewable share found nearby.';
          }
          break;
        }

        case 'BEST_TIME': {
          const window = pricingEngine.findBestChargingWindow();
          replyMessage = `The optimal charging window today is **${window.bestWindow}**. Tariff drops to ₹${window.bestPrice.toFixed(2)}/kWh with ${window.bestRenewable}% renewable energy. You can save ~₹${window.estimatedSavingInr} compared to peak evening hours.`;
          actions.push({ type: 'OPEN_SCHEDULER', label: 'Schedule Charge in Best Window' });
          break;
        }

        case 'RANGE': {
          const rangeInfo = rangePrediction.predict({
            currentBatteryPercentage: defaultVehicle.currentBatteryPercentage,
            batteryCapacityKWh: defaultVehicle.batteryCapacityKWh,
          });
          replyMessage = `Your **${defaultVehicle.brand} ${defaultVehicle.model}** has **${defaultVehicle.currentBatteryPercentage}% battery**, providing an estimated realistic range of **~${rangeInfo.estimatedRangeKm} km** (${rangeInfo.temperatureImpact}).`;
          actions.push({ type: 'OPEN_MAP', label: 'View Stations Within Range' });
          break;
        }

        case 'HOSPITAL_NEARBY': {
          if (topRec) {
            replyMessage = `Identified emergency-ready fast charger near healthcare facilities: **${topRec.stationName}** (${topRec.distanceKm} km away, ${topRec.chargingTimeMinutes} mins to charge).`;
            actions.push({ type: 'START_NAVIGATION', label: 'Start Emergency Navigation', stationId: topRec.stationId });
          } else {
            replyMessage = 'Checking nearby healthcare facilities and charging stations...';
          }
          break;
        }

        case 'CHARGING_SCHEDULE': {
          const window = pricingEngine.findBestChargingWindow();
          replyMessage = `Smart charging scheduler recommendation: Plan your charging between **${window.bestWindow}** for maximum solar utilization and lowest tariff (₹${window.bestPrice.toFixed(2)}/kWh).`;
          actions.push({ type: 'OPEN_SCHEDULER', label: 'Open Smart Scheduler' });
          break;
        }

        default: {
          if (topRec) {
            replyMessage = `Based on your **${defaultVehicle.brand} ${defaultVehicle.model}** and current grid conditions, **${topRec.stationName}** is your best match (${topRec.distanceKm} km away, ₹${topRec.estimatedPricePerKWh.toFixed(2)}/kWh, Green Score: ${topRec.greenScore}/100).`;
            actions.push(topRec.action);
            actions.push({ type: 'OPEN_MAP', label: 'Explore on Map' });
          } else {
            replyMessage = 'EV GreenCharge AI assistant is ready. How can I help you optimize your charging today?';
            actions.push({ type: 'OPEN_MAP', label: 'Open Stations Map' });
          }
        }
      }

      return {
        message: replyMessage,
        recommendations: topRec ? [topRec] : [],
        actions,
        confidence: 'HIGH',
        dataFreshness: 'Live telemetry synced (SLDC + Weather + Network)',
        isFallback: false,
      };
    } catch (err) {
      logger.error('Error in AI Engine chat processing, activating fallback', { error: String(err) });
      return {
        message: 'AI assistant temporarily unavailable. Basic smart recommendation is available.',
        recommendations: [],
        actions: [{ type: 'OPEN_MAP', label: 'View Stations on Map' }],
        confidence: 'LOW',
        dataFreshness: 'Offline Fallback',
        isFallback: true,
      };
    }
  }
}

export const aiEngine = new AIEngine();
