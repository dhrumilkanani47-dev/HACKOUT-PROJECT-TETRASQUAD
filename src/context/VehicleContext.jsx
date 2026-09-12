import React, { createContext, useContext, useState, useEffect } from 'react';
import { vehicleApi } from '../api/vehicleApi';
import { INITIAL_VEHICLES } from '../utils/mockData';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.getVehicles();
      setVehicles(data || INITIAL_VEHICLES);
    } catch (e) {
      setVehicles(INITIAL_VEHICLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const primaryVehicle = vehicles.find(v => v.isPrimary) || vehicles[0] || INITIAL_VEHICLES[0];

  const addVehicle = async (vehicleData) => {
    const created = await vehicleApi.addVehicle({
      ...vehicleData,
      isPrimary: vehicles.length === 0
    });
    setVehicles(prev => [...prev, created]);
    return created;
  };

  const updateVehicle = async (id, updates) => {
    const updated = await vehicleApi.updateVehicle(id, updates);
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
    return updated;
  };

  const setPrimaryVehicle = async (id) => {
    const updated = await vehicleApi.setPrimary(id);
    setVehicles(updated);
  };

  const deleteVehicle = async (id) => {
    const updated = await vehicleApi.deleteVehicle(id);
    setVehicles(updated);
  };

  const calculateChargeCost = (vehicle, targetPct, pricePerKwh) => {
    if (!vehicle) return { energyKwh: 0, cost: 0, timeMinutes: 0 };
    const currentPct = vehicle.currentBatteryPct || 20;
    const target = targetPct !== undefined ? targetPct : (vehicle.targetBatteryPct || 80);
    const pctDiff = Math.max(0, target - currentPct);
    const energyNeeded = (pctDiff / 100) * vehicle.batteryCapacity;
    const cost = energyNeeded * (pricePerKwh || 8.40);
    // Rough charging time calculation assuming DC Fast (maxChargingPower or 50kW average with taper)
    const effectivePower = Math.min(vehicle.maxChargingPower || 50, 60) * 0.85;
    const timeMinutes = Math.round((energyNeeded / effectivePower) * 60);

    return {
      energyKwh: Number(energyNeeded.toFixed(2)),
      cost: Number(cost.toFixed(2)),
      timeMinutes: Math.max(5, timeMinutes)
    };
  };

  return (
    <VehicleContext.Provider value={{
      vehicles,
      primaryVehicle,
      loading,
      addVehicle,
      updateVehicle,
      setPrimaryVehicle,
      deleteVehicle,
      calculateChargeCost,
      refreshVehicles: loadVehicles
    }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) throw new Error('useVehicles must be used within a VehicleProvider');
  return context;
};
