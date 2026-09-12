import { solarService, SolarTelemetry } from '../../services/solarService.js';
import { windService, WindTelemetry } from '../../services/windService.js';

export class RenewableAdapter {
  async getSolar(state: string): Promise<SolarTelemetry> {
    return solarService.getSolarTelemetry(state);
  }

  async getWind(state: string): Promise<WindTelemetry> {
    return windService.getWindTelemetry(state);
  }
}

export const renewableAdapter = new RenewableAdapter();
