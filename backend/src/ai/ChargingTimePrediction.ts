export interface ChargingTimeInput {
  batteryCapacityKWh: number;
  currentBatteryPercentage: number;
  targetBatteryPercentage: number;
  vehicleMaxPowerKW: number;
  stationPowerKW: number;
}

export interface ChargingTimeResult {
  estimatedMinutes: number;
  durationFormatted: string;
  fastChargingMinutes: number; // 0-80%
  taperChargingMinutes: number; // 80-100%
  averagePowerKW: number;
  energyRequiredKWh: number;
}

export class ChargingTimePrediction {
  predict(input: ChargingTimeInput): ChargingTimeResult {
    const current = Math.min(100, Math.max(0, input.currentBatteryPercentage));
    const target = Math.min(100, Math.max(current, input.targetBatteryPercentage));
    const maxUsablePowerKW = Math.min(input.vehicleMaxPowerKW, input.stationPowerKW);

    // 1. Fast Charging Phase (up to 80% SoC)
    const fastTarget = Math.min(target, 80);
    const fastDeltaPct = Math.max(0, fastTarget - Math.min(current, 80));
    const fastEnergyKWh = (fastDeltaPct / 100) * input.batteryCapacityKWh / 0.92;
    // Power during fast phase averages ~90% of max power
    const fastPowerKW = maxUsablePowerKW * 0.90;
    const fastChargingMinutes = fastPowerKW > 0 ? (fastEnergyKWh / fastPowerKW) * 60 : 0;

    // 2. Taper Charging Phase (80% to 100% SoC)
    // Lithium BMS tapers current sharply above 80% to protect cells, averaging ~40% of peak power
    const taperCurrent = Math.max(current, 80);
    const taperDeltaPct = Math.max(0, target - taperCurrent);
    const taperEnergyKWh = (taperDeltaPct / 100) * input.batteryCapacityKWh / 0.90;
    const taperPowerKW = Math.max(3.3, maxUsablePowerKW * 0.40);
    const taperChargingMinutes = taperPowerKW > 0 ? (taperEnergyKWh / taperPowerKW) * 60 : 0;

    const totalMinutes = Math.round(fastChargingMinutes + taperChargingMinutes);
    const totalEnergyKWh = Math.round((fastEnergyKWh + taperEnergyKWh) * 10) / 10;

    let durationFormatted = `${totalMinutes} mins`;
    if (totalMinutes >= 60) {
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      durationFormatted = mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`;
    }

    const avgPower = totalMinutes > 0 ? Math.round((totalEnergyKWh / (totalMinutes / 60)) * 10) / 10 : maxUsablePowerKW;

    return {
      estimatedMinutes: totalMinutes,
      durationFormatted,
      fastChargingMinutes: Math.round(fastChargingMinutes),
      taperChargingMinutes: Math.round(taperChargingMinutes),
      averagePowerKW: avgPower,
      energyRequiredKWh: totalEnergyKWh,
    };
  }
}

export const chargingTimePrediction = new ChargingTimePrediction();
