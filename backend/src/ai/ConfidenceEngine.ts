import { ConfidenceLevel } from '../types/index.js';

export interface ConfidenceInput {
  dataAgeSeconds?: number;
  sourcesCount?: number;
  hasLiveAvailability?: boolean;
  hasActualPrice?: boolean;
  hasWeatherTelemetry?: boolean;
}

export class ConfidenceEngine {
  calculate(input: ConfidenceInput = {}): {
    level: ConfidenceLevel;
    score: number; // 0 - 100
    factors: string[];
  } {
    let score = 70;
    const factors: string[] = [];

    const age = input.dataAgeSeconds ?? 45;
    if (age <= 120) {
      score += 15;
      factors.push('Fresh telemetry (<2 mins old)');
    } else if (age > 600) {
      score -= 20;
      factors.push('Telemetry older than 10 mins');
    }

    if (input.hasLiveAvailability) {
      score += 10;
      factors.push('Live OCPP port status verified');
    }

    if (input.hasActualPrice) {
      score += 10;
      factors.push('Verified station retail pricing');
    } else {
      factors.push('Derived dynamic pricing model');
    }

    if ((input.sourcesCount ?? 2) >= 3) {
      score += 5;
      factors.push('Multi-source cross validation (SLDC + Weather + Network)');
    }

    const clampedScore = Math.min(Math.max(score, 20), 99);
    let level: ConfidenceLevel = 'MEDIUM';
    if (clampedScore >= 85) {
      level = 'HIGH';
    } else if (clampedScore < 50) {
      level = 'LOW';
    }

    return {
      level,
      score: clampedScore,
      factors,
    };
  }
}

export const confidenceEngine = new ConfidenceEngine();
