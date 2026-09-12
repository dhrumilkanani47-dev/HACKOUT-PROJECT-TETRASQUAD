import { CURRENT_LIVE_METRICS, HOURLY_GRID_DATA } from '../utils/mockData';
import { API_BASE } from './config';

export const pricingApi = {
  async getLiveMetrics() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/pricing/best-window`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.currentPrice) {
            return {
              ...CURRENT_LIVE_METRICS,
              pricePerKwh: json.data.currentPrice.estimatedPricePerKWh,
              priceType: json.data.currentPrice.label || 'Estimated charging price',
              greenScore: json.data.currentPrice.greenScore,
              status: json.data.currentPrice.status,
              smartChargingWindow: {
                bestWindow: json.data.bestWindow,
                bestPrice: json.data.bestPrice,
                bestRenewable: json.data.bestRenewable,
                bestGreenScore: json.data.bestGreenScore,
                saving: json.data.estimatedSavingInr,
              },
            };
          }
        }
      } catch (e) {
        console.warn('pricingApi: fallback to mock live data', e);
      }
    }
    return CURRENT_LIVE_METRICS;
  },

  async getHourlyCurve() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/pricing/forecast`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.forecast) {
            return json.data.forecast;
          }
        }
      } catch (e) {
        console.warn('pricingApi: fallback to mock curve', e);
      }
    }
    return HOURLY_GRID_DATA;
  }
};
