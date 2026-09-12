import { INITIAL_VEHICLES } from '../utils/mockData';
import { API_BASE } from './config';

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
    const stdRange = Number(vehicle.standardRange) || 350;
    const soc = Number(vehicle.currentBatteryPct) || 80;
    const newVehicle = {
      id: `veh_${Date.now()}`,
      name: vehicle.name || 'New Electric Vehicle',
      nickname: vehicle.nickname || 'Green Commuter',
      type: vehicle.type || 'SUV',
      brand: vehicle.brand || 'Tata',
      model: vehicle.model || vehicle.name || 'EV Pro',
      plateNumber: (vehicle.plateNumber || 'GJ 01 EV 9999').toUpperCase(),
      odometerKm: Number(vehicle.odometerKm) || 1200,
      year: Number(vehicle.year) || new Date().getFullYear(),
      vin: vehicle.vin || `IND${Date.now().toString().slice(-8)}EV`,
      batteryCapacity: Number(vehicle.batteryCapacity) || 40.5,
      currentBatteryPct: soc,
      targetBatteryPct: Number(vehicle.targetBatteryPct) || 85,
      connector: vehicle.connector || 'CCS2',
      maxChargingPower: Number(vehicle.maxChargingPower) || 50,
      standardRange: stdRange,
      currentRangeEstimate: Math.round((stdRange * soc) / 100),
      greenScore: vehicle.greenScore || 94,
      healthScore: vehicle.healthScore || 99,
      efficiency: vehicle.efficiency || '135 Wh/km',
      insuranceExpiry: vehicle.insuranceExpiry || 'Dec 2026',
      serviceDueKm: (Number(vehicle.odometerKm) || 1200) + 10000,
      isPrimary: vehicle.isPrimary || current.length === 0,
      ...vehicle
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
