import { STATIONS_DATA, HOSPITALS_DATA } from '../utils/mockData';
import { API_BASE } from './config';

export const stationApi = {
  async getStations(filters = {}) {
    if (API_BASE) {
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await fetch(`${API_BASE}/stations?${query}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('stationApi: using mock fallback', e);
      }
    }
    await new Promise(r => setTimeout(r, 200));
    let results = [...STATIONS_DATA];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.network.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    }

    if (filters.network && filters.network !== 'all') {
      results = results.filter(s => s.networkId === filters.network);
    }

    if (filters.fastOnly) {
      results = results.filter(s => s.isFast);
    }

    if (filters.availableOnly) {
      results = results.filter(s => s.availableChargers > 0);
    }

    if (filters.lowCostOnly) {
      results = results.filter(s => s.pricePerKwh <= 7.80);
    }

    if (filters.greenOnly) {
      results = results.filter(s => s.renewablePct >= 80);
    }

    if (filters.nearHospital) {
      results = results.filter(s => s.isHospitalNearby);
    }

    return results;
  },

  async getStationById(id) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/stations/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('stationApi: using mock fallback', e);
      }
    }
    const station = STATIONS_DATA.find(s => s.id === id);
    if (!station) {
      return STATIONS_DATA[0]; // fallback
    }
    return station;
  },

  async getHospitals() {
    return HOSPITALS_DATA;
  }
};
