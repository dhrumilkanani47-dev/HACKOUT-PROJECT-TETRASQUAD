export type DetectedIntent =
  | 'FIND_CHARGER'
  | 'CHEAPEST_CHARGER'
  | 'GREENEST_CHARGER'
  | 'FASTEST_CHARGER'
  | 'BEST_TIME'
  | 'CHARGING_COST'
  | 'RANGE'
  | 'STATION_COMPARISON'
  | 'HOSPITAL_NEARBY'
  | 'NETWORK_COMPARISON'
  | 'TRIP_PLANNING'
  | 'CHARGING_SCHEDULE'
  | 'GENERAL_QUERY';

export interface ParsedIntentResult {
  intent: DetectedIntent;
  confidence: number;
  extractedKeywords: string[];
}

export class IntentParser {
  parse(message: string): ParsedIntentResult {
    const text = message.toLowerCase();

    if (text.includes('cheap') || text.includes('lowest price') || text.includes('least cost') || text.includes('save money')) {
      return { intent: 'CHEAPEST_CHARGER', confidence: 0.95, extractedKeywords: ['cheap', 'cost'] };
    }

    if (text.includes('green') || text.includes('solar') || text.includes('clean') || text.includes('eco') || text.includes('renewable')) {
      return { intent: 'GREENEST_CHARGER', confidence: 0.94, extractedKeywords: ['green', 'solar', 'renewable'] };
    }

    if (text.includes('fast') || text.includes('quick') || text.includes('urgent') || text.includes('high speed') || text.includes('150kw')) {
      return { intent: 'FASTEST_CHARGER', confidence: 0.92, extractedKeywords: ['fast', 'speed'] };
    }

    if (text.includes('when') || text.includes('best time') || text.includes('time to charge') || text.includes('off peak') || text.includes('window')) {
      return { intent: 'BEST_TIME', confidence: 0.93, extractedKeywords: ['time', 'window'] };
    }

    if (text.includes('range') || text.includes('reach') || text.includes('how far') || text.includes('distance can i go')) {
      return { intent: 'RANGE', confidence: 0.96, extractedKeywords: ['range', 'battery'] };
    }

    if (text.includes('cost') || text.includes('how much') || text.includes('bill') || text.includes('estimate cost')) {
      return { intent: 'CHARGING_COST', confidence: 0.91, extractedKeywords: ['cost', 'estimate'] };
    }

    if (text.includes('hospital') || text.includes('emergency') || text.includes('medical') || text.includes('clinic')) {
      return { intent: 'HOSPITAL_NEARBY', confidence: 0.98, extractedKeywords: ['hospital', 'emergency'] };
    }

    if (text.includes('compare') || (text.includes('tata') && text.includes('jio')) || (text.includes('chargezone') && text.includes('statiq'))) {
      return { intent: 'STATION_COMPARISON', confidence: 0.90, extractedKeywords: ['compare', 'networks'] };
    }

    if (text.includes('trip') || text.includes('route') || text.includes('highway') || text.includes('ahmedabad to mumbai')) {
      return { intent: 'TRIP_PLANNING', confidence: 0.92, extractedKeywords: ['trip', 'route'] };
    }

    if (text.includes('schedule') || text.includes('book') || text.includes('reserve') || text.includes('slot')) {
      return { intent: 'CHARGING_SCHEDULE', confidence: 0.94, extractedKeywords: ['schedule', 'reserve'] };
    }

    if (text.includes('find') || text.includes('charger') || text.includes('station') || text.includes('near me') || text.includes('where')) {
      return { intent: 'FIND_CHARGER', confidence: 0.90, extractedKeywords: ['find', 'station'] };
    }

    return { intent: 'GENERAL_QUERY', confidence: 0.70, extractedKeywords: [] };
  }
}

export const intentParser = new IntentParser();
