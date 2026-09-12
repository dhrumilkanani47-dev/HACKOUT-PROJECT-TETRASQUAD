import { INITIAL_VEHICLES } from '../utils/mockData';
import { API_BASE } from './config';

export const vehicleApi = {
  async getVehicles() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/vehicles`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem('egc_vehicles', JSON.stringify(data));
            return data;
          }
        }
      } catch (e) {
        console.warn('vehicleApi: using local cache fallback', e);
      }
    }
    const saved = localStorage.getItem('egc_vehicles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_VEHICLES;
  },

  async addVehicle(vehicle) {
    const stdRange = Number(vehicle.standardRange) || 350;
    const soc = Number(vehicle.currentBatteryPct) || 80;
    const newVehicle = {
      id: vehicle.id || `veh_${Date.now()}`,
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
      isPrimary: Boolean(vehicle.isPrimary),
      latitude: vehicle.latitude || 23.1884,
      longitude: vehicle.longitude || 72.6289
    };

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/vehicles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVehicle)
        });
        if (res.ok) {
          const created = await res.json();
          // Update local cache
          const current = await this.getVehicles();
          const updated = [...current.filter(v => v.id !== created.id), created];
          localStorage.setItem('egc_vehicles', JSON.stringify(updated));
          return created;
        }
      } catch (e) {
        console.warn('vehicleApi: addVehicle backend offline, saving locally', e);
      }
    }

    const current = await this.getVehicles();
    const updated = [...current, newVehicle];
    localStorage.setItem('egc_vehicles', JSON.stringify(updated));
    return newVehicle;
  },

  async updateVehicle(id, updates) {
    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/vehicles/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates })
        });
      } catch (e) {
        console.warn('vehicleApi: updateVehicle backend error:', e);
      }
    }
    const current = await this.getVehicles();
    const updated = current.map(v => (v.id === id ? { ...v, ...updates } : v));
    localStorage.setItem('egc_vehicles', JSON.stringify(updated));
    return updated.find(v => v.id === id);
  },

  async setPrimary(id) {
    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/vehicles/set-primary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (e) {
        console.warn('vehicleApi: setPrimary backend error:', e);
      }
    }
    const current = await this.getVehicles();
    const updated = current.map(v => ({
      ...v,
      isPrimary: v.id === id
    }));
    localStorage.setItem('egc_vehicles', JSON.stringify(updated));
    return updated;
  },

  async deleteVehicle(id) {
    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/vehicles/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (e) {
        console.warn('vehicleApi: deleteVehicle backend error:', e);
      }
    }
    const current = await this.getVehicles();
    const updated = current.filter(v => v.id !== id);
    localStorage.setItem('egc_vehicles', JSON.stringify(updated));
    return updated;
  }
};

export default vehicleApi;
