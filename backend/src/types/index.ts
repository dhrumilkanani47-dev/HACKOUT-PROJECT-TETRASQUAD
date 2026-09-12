export type UserRole = 'DRIVER' | 'OPERATOR';

export type AIMode = 'SMART' | 'CHEAPEST' | 'GREENEST' | 'FASTEST' | 'EMERGENCY';

export type PriceType = 'ACTUAL' | 'ESTIMATED' | 'DEMO' | 'FORECAST';

export type StationStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EnergyMix {
  solar: number;
  wind: number;
  hydro: number;
  coal: number;
  gas: number;
  other: number;
}

export interface DynamicPriceBreakdown {
  baseEnergyCost: number;
  gridDemandAdjustment: number;
  fossilFuelAdjustment: number;
  peakHourAdjustment: number;
  solarBenefit: number;
  windBenefit: number;
  stationFee: number;
  estimatedPrice: number;
}

export interface DynamicPriceResult {
  estimatedPricePerKWh: number;
  priceType: PriceType;
  renewablePercentage: number;
  fossilPercentage: number;
  greenScore: number;
  priceStatus: 'CHEAP' | 'GOOD' | 'NORMAL' | 'EXPENSIVE';
  recommendation: string;
  carbonEstimate: number; // kg CO2 / kWh
  confidence: ConfidenceLevel;
  energyMix: EnergyMix;
  breakdown: DynamicPriceBreakdown;
}

export interface AIAction {
  type: 'OPEN_MAP' | 'FILTER_STATIONS' | 'SELECT_VEHICLE' | 'OPEN_STATION' | 'OPEN_SCHEDULER' | 'START_NAVIGATION';
  label: string;
  stationId?: string;
  vehicleId?: string;
  payload?: Record<string, any>;
}

export interface AIRecommendationResult {
  stationId: string;
  stationName: string;
  networkName: string;
  score: number;
  estimatedPricePerKWh: number;
  distanceKm: number;
  renewablePercentage: number;
  greenScore: number;
  chargingTimeMinutes: number;
  estimatedCostInr: number;
  reasons: string[];
  confidence: ConfidenceLevel;
  action: AIAction;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
