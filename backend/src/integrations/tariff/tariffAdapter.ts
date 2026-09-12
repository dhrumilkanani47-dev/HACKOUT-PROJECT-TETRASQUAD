import { tariffService } from '../../services/tariffService.js';

export class TariffAdapter {
  getDiscomTariff(state: string, hour?: number) {
    return tariffService.getApplicableTariff(state, hour);
  }
}

export const tariffAdapter = new TariffAdapter();
