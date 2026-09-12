import { solarService } from '../services/solarService.js';
import { windService } from '../services/windService.js';
import { gridService } from '../services/gridService.js';

export class EnergyForecast {
  async get24HourEnergyForecast(state: string = 'Gujarat') {
    const [solar, wind, grid] = await Promise.all([
      solarService.getSolarTelemetry(state),
      windService.getWindTelemetry(state),
      gridService.getGridConditions(state),
    ]);

    const hourly = [];
    for (let h = 0; h < 24; h++) {
      const s = solar.solarForecast[h].solarPercentage;
      const w = wind.windForecast[h].windPercentage;
      const d = grid.demandForecast[h].demand;
      const renewableTotal = Math.min(95, Math.round(s * 0.65 + w * 0.35 + (h >= 18 ? 16 : 10)));

      hourly.push({
        hour: h,
        time: `${h.toString().padStart(2, '0')}:00`,
        solarPercentage: s,
        windPercentage: w,
        renewablePercentage: renewableTotal,
        gridDemand: d,
        status: renewableTotal >= 70 ? 'CLEAN' : renewableTotal >= 40 ? 'BALANCED' : 'HIGH_CARBON',
      });
    }

    return {
      regionalGrid: grid.regionalGrid,
      state,
      lastUpdated: new Date().toISOString(),
      hourly,
    };
  }
}

export const energyForecast = new EnergyForecast();
