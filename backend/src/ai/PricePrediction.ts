import { pricingEngine } from '../services/pricingEngine.js';

export class PricePrediction {
  get24HourForecast() {
    return pricingEngine.findBestChargingWindow();
  }
}

export const pricePrediction = new PricePrediction();
