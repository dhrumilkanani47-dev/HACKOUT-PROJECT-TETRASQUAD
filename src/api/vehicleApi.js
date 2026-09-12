import { INITIAL_VEHICLES } from '../utils/mockData';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const vehicleApi = {
  async getVehicles() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/vehicles`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('vehicleApi: using mock fallback', e);
      }
    }
    const saved = localStorage.getItem('egc_vehicles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_VEHICLES;
  },

  async addVehicle(vehicle) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/vehicles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicle)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('vehicleApi: using mock fallback', e);
      }
    }
    const current = await this.getVehicles();
    const newVehicle = {
      id: `veh_${Date.now()}`,
      ...vehicle,
      healthScore: 99,
      greenScore: vehicle.greenScore || 92
    };
    const updated = [...current, newVehicle];
    localStorage.setItem('egc_vehicles', JSON.stringify(updated));
    return newVehicle;
  },

  async updateVehicle(id, updates) {
    const current = await this.getVehicles();
    const updated = current.map(v => (v.id === id ? { ...v, ...updates } : v));
    localStorage.setItem('egc_vehicles', JSON.stringify(updated));
    return updated.find(v => v.id === id);
  },

  async setPrimary(id) {
    const current = await this.getVehicles();
    const updated = current.map(v => ({
      ...v,
      isPrimary: v.id === id
    }));
    localStorage.setItem('egc_vehicles', JSON.stringify(updated));
    return updated;
  },

  async deleteVehicle(id) {
    const current = await this.getVehicles();
    const updated = current.filter(v => v.id !== id);
    localStorage.setItem('egc_vehicles', JSON.stringify(updated));
    return updated;
  }
};
