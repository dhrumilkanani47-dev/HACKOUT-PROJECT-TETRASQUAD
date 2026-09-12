import { CURRENT_LIVE_METRICS, HOURLY_GRID_DATA } from '../utils/mockData';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const pricingApi = {
  async getLiveMetrics() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/pricing/live`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('pricingApi: fallback to mock live data', e);
      }
    }
    return CURRENT_LIVE_METRICS;
  },

  async getHourlyCurve() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/pricing/hourly`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('pricingApi: fallback to mock curve', e);
      }
    }
    return HOURLY_GRID_DATA;
  }
};
