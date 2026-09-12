import React, { createContext, useContext, useState, useEffect } from 'react';
import { stationApi } from '../api/stationApi';
import { STATIONS_DATA, HOSPITALS_DATA } from '../utils/mockData';

const StationContext = createContext();

export const StationProvider = ({ children }) => {
  const [stations, setStations] = useState(STATIONS_DATA);
  const [hospitals, setHospitals] = useState(HOSPITALS_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    network: 'all',
    fastOnly: false,
    availableOnly: false,
    lowCostOnly: false,
    greenOnly: false,
    nearHospital: false,
    activeTab: 'all' // 'all' | 'chargers' | 'hospitals' | 'fast' | 'available' | 'low_cost' | 'green' | 'near_hospitals'
  });

  // Active charging session simulation state
  const [activeSession, setActiveSession] = useState(null);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await stationApi.getStations(filters);
      setStations(data);
    } catch (e) {
      setStations(STATIONS_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      network: 'all',
      fastOnly: false,
      availableOnly: false,
      lowCostOnly: false,
      greenOnly: false,
      nearHospital: false,
      activeTab: 'all'
    });
  };

  const startChargingSession = (station, vehicle) => {
    const session = {
      id: `ses_active_${Date.now()}`,
      stationId: station.id,
      stationName: station.name,
      network: station.network,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      startTime: new Date().toISOString(),
      startBatteryPct: vehicle.currentBatteryPct || 30,
      currentBatteryPct: vehicle.currentBatteryPct || 30,
      targetBatteryPct: vehicle.targetBatteryPct || 85,
      pricePerKwh: station.pricePerKwh,
      renewablePct: station.renewablePct,
      powerKw: station.powerKw,
      energyDeliveredKwh: 0.1,
      currentCost: (0.1 * station.pricePerKwh),
      status: 'CHARGING', // 'CHARGING' | 'PAUSED' | 'COMPLETED'
      elapsedSeconds: 0
    };
    setActiveSession(session);
    return session;
  };

  const stopChargingSession = () => {
    if (!activeSession) return null;
    const completedSession = {
      ...activeSession,
      status: 'COMPLETED',
      endTime: new Date().toISOString()
    };
    setActiveSession(null);
    return completedSession;
  };

  return (
    <StationContext.Provider value={{
      stations,
      hospitals,
      loading,
      filters,
      selectedStation,
      activeSession,
      setSelectedStation,
      setFilters,
      updateFilter,
      resetFilters,
      startChargingSession,
      stopChargingSession,
      setActiveSession,
      refreshStations: fetchStations
    }}>
      {children}
    </StationContext.Provider>
  );
};

export const useStations = () => {
  const context = useContext(StationContext);
  if (!context) throw new Error('useStations must be used within a StationProvider');
  return context;
};
