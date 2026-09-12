export interface CompatibilityResult {
  compatible: boolean;
  reason: string;
  maximumExpectedPowerKW: number;
  chargingSpeedCategory: 'AC Slow' | 'DC Fast' | 'DC Ultra-Fast';
}

export class VehicleCompatibilityService {
  checkCompatibility(
    vehicle: {
      connectorType: string;
      maxChargingPowerKW: number;
      type: string;
    },
    station: {
      connectors: string;
      chargingPowerKW: number;
    }
  ): CompatibilityResult {
    const stationConnectors = station.connectors
      .split(',')
      .map((c) => c.trim().toLowerCase());

    const vehicleConnector = vehicle.connectorType.trim().toLowerCase();

    // Check connector match:
    // e.g. "ccs2" matches "ccs2" or "ccs-2", "type 2" matches "type 2" or "type2"
    const isDirectMatch = stationConnectors.some(
      (sc) =>
        sc.replace(/[-\s]/g, '') === vehicleConnector.replace(/[-\s]/g, '') ||
        (vehicleConnector.includes('ccs') && sc.includes('ccs')) ||
        (vehicleConnector.includes('type 2') && sc.includes('type 2'))
    );

    if (!isDirectMatch) {
      return {
        compatible: false,
        reason: `Incompatible connector: vehicle requires ${vehicle.connectorType}, station provides ${station.connectors}`,
        maximumExpectedPowerKW: 0,
        chargingSpeedCategory: 'AC Slow',
      };
    }

    // Vehicle can charge up to the minimum of the station output and the vehicle's onboard BMS maximum limit
    const maximumExpectedPowerKW = Math.min(
      vehicle.maxChargingPowerKW,
      station.chargingPowerKW
    );

    let chargingSpeedCategory: 'AC Slow' | 'DC Fast' | 'DC Ultra-Fast' = 'AC Slow';
    if (maximumExpectedPowerKW >= 100) {
      chargingSpeedCategory = 'DC Ultra-Fast';
    } else if (maximumExpectedPowerKW >= 25) {
      chargingSpeedCategory = 'DC Fast';
    }

    return {
      compatible: true,
      reason: `Fully compatible: ${vehicle.connectorType} gun available. Maximum charging rate capped at ${maximumExpectedPowerKW} kW by ${
        station.chargingPowerKW < vehicle.maxChargingPowerKW ? 'station output' : 'vehicle BMS'
      }.`,
      maximumExpectedPowerKW,
      chargingSpeedCategory,
    };
  }
}

export const vehicleCompatibilityService = new VehicleCompatibilityService();
