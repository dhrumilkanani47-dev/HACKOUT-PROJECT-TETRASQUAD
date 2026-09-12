import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../../context/VehicleContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import {
  Car,
  Plus,
  BatteryCharging,
  Zap,
  Gauge,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  X,
  Star,
  Activity,
  ChevronRight,
  Info,
  Hash,
  Award,
  Radio,
  MapPin,
  Navigation,
  Compass,
  Signal,
  Lock,
  Thermometer,
  BellRing,
  RotateCw,
  ExternalLink
} from 'lucide-react';

export const MobileVehiclesScreen = () => {
  const navigate = useNavigate();
  const { vehicles, primaryVehicle, addVehicle, setPrimaryVehicle, deleteVehicle } = useVehicles();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [trackingVehicle, setTrackingVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Live Tracking Simulation States
  const [isDriving, setIsDriving] = useState(false);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [isRefreshingGps, setIsRefreshingGps] = useState(false);
  const [lastPingTime, setLastPingTime] = useState('Just now');

  // Add Vehicle Form State
  const [newBrand, setNewBrand] = useState('Tata');
  const [newName, setNewName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newType, setNewType] = useState('SUV');
  const [newPlate, setNewPlate] = useState('');
  const [newOdometer, setNewOdometer] = useState('');
  const [newBatteryCapacity, setNewBatteryCapacity] = useState('40.5');
  const [newStandardRange, setNewStandardRange] = useState('453');
  const [newBatteryPct, setNewBatteryPct] = useState('80');
  const [newConnector, setNewConnector] = useState('CCS2');
  const [newMaxPower, setNewMaxPower] = useState('50');
  const [newYear, setNewYear] = useState('2024');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleRefreshGps = () => {
    setIsRefreshingGps(true);
    setTimeout(() => {
      setIsRefreshingGps(false);
      setLastPingTime('Just now');
      showToast('Live GPS coordinates & telemetry refreshed');
    }, 600);
  };

  const handleToggleDriving = () => {
    if (isDriving) {
      setIsDriving(false);
      setLiveSpeed(0);
      showToast('Vehicle state: Parked');
    } else {
      setIsDriving(true);
      setLiveSpeed(34);
      showToast('Vehicle state: In Motion (34 km/h)');
    }
  };

  const handleRemoteChirp = (vehName) => {
    showToast(`🚨 Signal sent: Flashed lights & chirped horn on ${vehName}`);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Please enter a vehicle model name');
      return;
    }

    const vehicleData = {
      name: newName.trim(),
      brand: newBrand,
      model: newName.trim(),
      nickname: newNickname.trim() || 'My EV',
      type: newType,
      plateNumber: (newPlate.trim() || 'GJ 01 EV 9999').toUpperCase(),
      odometerKm: Number(newOdometer) || 1500,
      batteryCapacity: Number(newBatteryCapacity) || 40,
      standardRange: Number(newStandardRange) || 350,
      currentBatteryPct: Number(newBatteryPct) || 80,
      connector: newConnector,
      maxChargingPower: Number(newMaxPower) || 50,
      year: Number(newYear) || 2024,
      greenScore: 95,
      healthScore: 99,
      efficiency: newType === 'Scooter' ? '35 Wh/km' : '135 Wh/km',
      insuranceExpiry: 'Dec 2026'
    };

    try {
      const created = await addVehicle(vehicleData);
      setShowAddModal(false);
      // Reset fields
      setNewName('');
      setNewNickname('');
      setNewPlate('');
      setNewOdometer('');
      showToast(`Added ${created.name} successfully!`);
    } catch (err) {
      showToast('Failed to add vehicle');
    }
  };

  const handleSetPrimary = async (vehicleId, vehicleName) => {
    try {
      await setPrimaryVehicle(vehicleId);
      showToast(`${vehicleName} set as primary vehicle`);
      if (selectedVehicle && selectedVehicle.id === vehicleId) {
        setSelectedVehicle(prev => ({ ...prev, isPrimary: true }));
      }
    } catch (err) {
      showToast('Failed to update primary vehicle');
    }
  };

  const handleDelete = async (vehicleId, vehicleName) => {
    if (vehicles.length <= 1) {
      showToast('Cannot delete the only registered vehicle');
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${vehicleName}?`)) {
      try {
        await deleteVehicle(vehicleId);
        setSelectedVehicle(null);
        showToast(`${vehicleName} removed`);
      } catch (err) {
        showToast('Failed to remove vehicle');
      }
    }
  };

  // Helper location description based on vehicle type
  const getVehicleLocation = (v) => {
    if (!v) return { area: 'InfoCity Gate 2, Gandhinagar', coords: '23.1925° N, 72.6288° E', city: 'Gandhinagar' };
    const isScooter = v.type === 'Scooter' || v.type === 'Motorcycle' || v.brand === 'Ather' || v.brand === 'Ola';
    if (isScooter) {
      return { area: 'Prahlad Nagar Cross Road, SG Highway', coords: '23.0125° N, 72.5088° E', city: 'Ahmedabad' };
    }
    return { area: 'InfoCity Campus, Sector 0, Gandhinagar', coords: '23.1925° N, 72.6288° E', city: 'Gandhinagar' };
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/95 text-white text-xs rounded-full shadow-2xl font-heading font-medium animate-fade-in backdrop-blur-xs flex items-center gap-1.5 border border-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav
          title="All Vehicles"
          onBack={() => navigate('/')}
        />

        <div className="px-5 pt-2 pb-6 flex flex-col gap-3">
          {/* Header Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-emerald-300 font-semibold uppercase tracking-wider block">
                EV Fleet &amp; Live Telematics
              </span>
              <h2 className="font-heading font-extrabold text-[17px] text-white">
                {vehicles.length} {vehicles.length === 1 ? 'Registered Vehicle' : 'Registered Vehicles'}
              </h2>
              <p className="text-[10.5px] text-emerald-100 mt-0.5">
                Primary: <b className="text-white">{primaryVehicle?.name || 'Nexon EV'}</b>
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-xl bg-white text-emerald-900 font-heading font-bold text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {/* List of Vehicles */}
          <div className="flex flex-col gap-2.5">
            {vehicles.map((v) => {
              const pct = v.currentBatteryPct || 70;
              const range = v.currentRangeEstimate || Math.round(((v.standardRange || 453) * pct) / 100);
              const isPrimary = v.isPrimary;
              const loc = getVehicleLocation(v);

              return (
                <div
                  key={v.id}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer group active:scale-[0.99] ${
                    isPrimary
                      ? 'bg-gradient-to-b from-green-50/50 to-white border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Top Row: Brand, Name & Primary Badge */}
                  <div
                    onClick={() => setSelectedVehicle(v)}
                    className="flex items-start justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Car className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-heading font-extrabold text-[14px] text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {v.name}
                          </h3>
                          {isPrimary && (
                            <span className="pill-tag green text-[9px] px-2 py-0.5 font-bold">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {v.brand} • {v.type || 'SUV'} • {v.batteryCapacity || 40} kWh
                        </div>
                      </div>
                    </div>

                    {/* Number Plate (Indian Green EV Style) */}
                    <div className="px-2 py-1 bg-emerald-700 text-white rounded-md border border-emerald-900 shadow-2xs font-mono font-bold text-[10px] tracking-wider shrink-0 flex items-center gap-1">
                      <span>{v.plateNumber || 'GJ 01 EV 0000'}</span>
                    </div>
                  </div>

                  {/* Live GPS Telematics Connection Strip */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrackingVehicle(v);
                    }}
                    className="mt-2.5 p-2 bg-emerald-950/90 text-white rounded-xl border border-emerald-500/30 flex items-center justify-between hover:bg-emerald-900 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <div className="text-left">
                        <div className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <span>Live GPS Connected</span>
                          <span className="text-[9px] text-emerald-400/80 font-normal">({loc.city})</span>
                        </div>
                        <div className="text-[9.5px] text-slate-300 truncate max-w-[190px]">
                          {loc.area}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-2 py-1 bg-emerald-500 text-emerald-950 rounded-lg text-[10px] font-heading font-extrabold flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <Radio className="w-3 h-3" />
                      <span>Track</span>
                    </button>
                  </div>

                  {/* Battery & Odometer Stats Strip */}
                  <div
                    onClick={() => setSelectedVehicle(v)}
                    className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">Odometer:</span>
                      <b className="font-heading text-slate-900">
                        {(v.odometerKm || 12450).toLocaleString()} km
                      </b>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium">Range:</span>
                      <b className="font-heading text-emerald-700 font-bold">
                        {range} km
                      </b>
                    </div>
                  </div>

                  {/* Battery SoC Progress Bar */}
                  <div
                    onClick={() => setSelectedVehicle(v)}
                    className="mt-2 flex items-center gap-2"
                  >
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-heading font-bold text-[11px] text-slate-700 shrink-0">
                      {pct}%
                    </span>
                  </div>

                  {/* View Details Hint */}
                  <div
                    onClick={() => setSelectedVehicle(v)}
                    className="mt-2 flex items-center justify-between text-[10px] text-emerald-700 font-bold"
                  >
                    <span>Tap to view full vehicle specs &amp; diagnostics</span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VEHICLE DETAILS MODAL (WITH LIVE LOCATION BUTTON INSTEAD OF SMART CHARGE) */}
      {/* ========================================================================= */}
      {selectedVehicle && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
          {/* Backdrop Tap to Close */}
          <div className="absolute inset-0" onClick={() => setSelectedVehicle(null)} />

          <div className="relative z-10 w-full max-h-[92%] bg-white rounded-t-[28px] border-t border-green-200 px-5 pt-4 pb-6 shadow-2xl animate-slide-up flex flex-col overflow-y-auto">
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 shrink-0" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-extrabold text-[16px] text-slate-900 leading-tight">
                      {selectedVehicle.name}
                    </h3>
                    {selectedVehicle.isPrimary && (
                      <span className="pill-tag green text-[9px] px-1.5 py-0.5 font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {selectedVehicle.nickname || selectedVehicle.brand} • {selectedVehicle.type || 'SUV'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedVehicle(null)}
                aria-label="Close"
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* License Plate & Real-Time Status Card */}
            <div className="my-3 p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-widest font-semibold block">
                  Registered Number Plate
                </span>
                <div className="font-mono font-extrabold text-[16px] tracking-wider text-white mt-0.5">
                  {selectedVehicle.plateNumber || 'GJ 01 EV 0000'}
                </div>
              </div>

              <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Telematics Live</span>
              </div>
            </div>

            {/* Live Location Quick Access Chip */}
            <div
              onClick={() => {
                const target = selectedVehicle;
                setSelectedVehicle(null);
                setTrackingVehicle(target);
              }}
              className="mb-3 p-2.5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-white cursor-pointer hover:border-emerald-400 transition-all shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-heading font-extrabold text-white flex items-center gap-1">
                    <span>Live GPS Location</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">LIVE</span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate max-w-[200px]">
                    {getVehicleLocation(selectedVehicle).area}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Core Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 text-[10.5px] mb-0.5">
                  <Gauge className="w-3.5 h-3.5 text-slate-400" />
                  <span>Total Odometer</span>
                </div>
                <div className="font-heading font-extrabold text-[13px] text-slate-900">
                  {(selectedVehicle.odometerKm || 12450).toLocaleString()} km
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 text-[10.5px] mb-0.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Battery Capacity</span>
                </div>
                <div className="font-heading font-extrabold text-[13px] text-slate-900">
                  {selectedVehicle.batteryCapacity || 40.5} kWh
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 text-[10.5px] mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Est. Range</span>
                </div>
                <div className="font-heading font-extrabold text-[13px] text-emerald-700">
                  {selectedVehicle.currentRangeEstimate || 312} km
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 text-[10.5px] mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-sky-500" />
                  <span>Max DC Power</span>
                </div>
                <div className="font-heading font-extrabold text-[13px] text-slate-900">
                  {selectedVehicle.maxChargingPower || 50} kW
                </div>
              </div>
            </div>

            {/* Additional Diagnostic Details */}
            <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2 text-[11px]">
              <div className="flex justify-between items-center text-slate-600">
                <span>Connector Type:</span>
                <b className="text-slate-800 font-mono font-medium">{selectedVehicle.connector || 'CCS2 (Combined)'}</b>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Battery Health (SOH):</span>
                <b className="text-emerald-700 font-medium">{selectedVehicle.healthScore || 99}% (Optimal)</b>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Green Energy Score:</span>
                <b className="text-emerald-700 font-medium">{selectedVehicle.greenScore || 95} / 100</b>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Insurance Validity:</span>
                <b className="text-emerald-800 font-medium">{selectedVehicle.insuranceExpiry || '15 Nov 2026'}</b>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Next Service Due:</span>
                <b className="text-slate-800 font-medium">{(selectedVehicle.serviceDueKm || 25000).toLocaleString()} km</b>
              </div>
            </div>

            {/* ========================================================= */}
            {/* ACTION BUTTONS (REAL-TIME LIVE LOCATION INSTEAD OF SMART CHARGE) */}
            {/* ========================================================= */}
            <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-slate-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const v = selectedVehicle;
                    setSelectedVehicle(null);
                    setTrackingVehicle(v);
                  }}
                  className="app-btn flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                  <span>Live Location</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVehicle(null);
                    navigate('/charging');
                  }}
                  className="app-btn outline flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Live Charging</span>
                </button>
              </div>

              {!selectedVehicle.isPrimary && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(selectedVehicle.id, selectedVehicle.name)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Set as Primary EV</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDelete(selectedVehicle.id, selectedVehicle.name)}
                className="w-full py-2 text-red-600 hover:bg-red-50 rounded-xl font-heading font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Vehicle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REAL-TIME LIVE EV TELEMATICS & LOCATION MODAL (REAL-TIME TRACKING) */}
      {/* ========================================================================= */}
      {trackingVehicle && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-950/75 backdrop-blur-sm transition-opacity animate-fade-in">
          {/* Backdrop Tap to Close */}
          <div className="absolute inset-0" onClick={() => setTrackingVehicle(null)} />

          <div className="relative z-10 w-full max-h-[94%] bg-[#0B1321] text-white rounded-t-[30px] border-t border-emerald-500/40 px-5 pt-4 pb-6 shadow-2xl animate-slide-up flex flex-col overflow-y-auto">
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-[16px] text-white leading-tight">
                      {trackingVehicle.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-500 text-emerald-950 rounded font-mono font-bold text-[9.5px]">
                      {trackingVehicle.plateNumber || 'GJ 01 EV 0000'}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Signal className="w-3 h-3 text-emerald-400" />
                    <span>Real-Time OBD-II Link · Signal 98% (5G IoT)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTrackingVehicle(null)}
                aria-label="Close"
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ========================================================= */}
            {/* INTERACTIVE LIVE GPS RADAR MAP CARD */}
            {/* ========================================================= */}
            <div className="my-3 relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#070D18] shadow-inner p-4 flex flex-col justify-between min-h-[190px]">
              {/* Stylized Grid Vector Map Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2ee6a8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Top Map Bar: Status & GPS Refresh */}
              <div className="relative z-10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[10px] text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isDriving ? '🚗 Moving · 34 km/h' : '🟢 Parked Securely'}</span>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshGps}
                  className="flex items-center gap-1 text-[10.5px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors cursor-pointer"
                >
                  <RotateCw className={`w-3 h-3 ${isRefreshingGps ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>{lastPingTime}</span>
                </button>
              </div>

              {/* Central Pulsing GPS Marker */}
              <div className="relative z-10 flex flex-col items-center justify-center my-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 animate-ping absolute" />
                  <div className="w-12 h-12 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center shadow-[0_0_20px_#2ee6a8]">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="mt-2 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  {getVehicleLocation(trackingVehicle).coords}
                </span>
              </div>

              {/* Bottom Address Banner */}
              <div className="relative z-10 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-heading font-bold text-white leading-snug">
                      {getVehicleLocation(trackingVehicle).area}
                    </div>
                    <div className="text-[9.5px] text-slate-400">
                      Gujarat, India • GPS Accuracy: ±2.4m
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleDriving}
                  className="text-[9.5px] font-bold px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-emerald-950 transition-colors shrink-0"
                >
                  {isDriving ? 'Simulate Stop' : 'Simulate Drive'}
                </button>
              </div>
            </div>

            {/* Live Telematics Stat Cards */}
            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div className="p-2.5 rounded-xl bg-[#121B2A] border border-slate-800 flex flex-col items-center text-center">
                <BatteryCharging className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-[10px] text-slate-400">Battery SoC</span>
                <b className="text-[13px] text-white font-mono">{trackingVehicle.currentBatteryPct || 76}%</b>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121B2A] border border-slate-800 flex flex-col items-center text-center">
                <Zap className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-[10px] text-slate-400">Live Range</span>
                <b className="text-[13px] text-emerald-400 font-mono">
                  {trackingVehicle.currentRangeEstimate || 248} km
                </b>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121B2A] border border-slate-800 flex flex-col items-center text-center">
                <Thermometer className="w-4 h-4 text-sky-400 mb-1" />
                <span className="text-[10px] text-slate-400">Cabin Temp</span>
                <b className="text-[13px] text-white font-mono">23.5°C</b>
              </div>
            </div>

            {/* Nearest Green Charging Station Proximity */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/30 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-heading font-extrabold text-white">
                    Nearest Station: Tata Power Fast Charger
                  </div>
                  <div className="text-[10px] text-emerald-300">
                    650m away • ₹6.50/kWh (Solar Green Window Open 🟢)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTrackingVehicle(null);
                  navigate('/map');
                }}
                className="px-2.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 rounded-xl text-[10.5px] font-heading font-extrabold shrink-0 shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>Navigate</span>
              </button>
            </div>

            {/* Quick Remote Telematics Controls */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRemoteChirp(trackingVehicle.name)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span>Flash &amp; Honk</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrackingVehicle(null);
                  navigate('/map');
                }}
                className="app-btn py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open Full Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ADD NEW VEHICLE MODAL FORM */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
          {/* Backdrop Tap to Close */}
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />

          <div className="relative z-10 w-full max-h-[92%] bg-white rounded-t-[28px] border-t border-green-200 px-5 pt-4 pb-6 shadow-2xl animate-slide-up flex flex-col overflow-y-auto">
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-[15px] text-slate-900 leading-tight">
                    Add New Electric Vehicle
                  </h3>
                  <p className="text-[10.5px] text-slate-500">
                    Enter your EV specifications for AI Smart Charging &amp; Live GPS
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              {/* Brand & Type Row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    EV Brand *
                  </label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="app-field w-full"
                  >
                    <option value="Tata">Tata Motors</option>
                    <option value="Ather">Ather Energy</option>
                    <option value="MG">MG Motor</option>
                    <option value="Ola">Ola Electric</option>
                    <option value="Mahindra">Mahindra EV</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Kia">Kia</option>
                    <option value="BYD">BYD</option>
                    <option value="Hero">Hero Electric</option>
                    <option value="Other">Other EV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Body Type *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="app-field w-full"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Scooter">2-Wheeler (Scooter)</option>
                    <option value="Motorcycle">2-Wheeler (Motorcycle)</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
              </div>

              {/* Model Name */}
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                  Model Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexon EV Long Range, Ather 450X, ZS EV"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="app-field w-full"
                />
              </div>

              {/* License Plate & Running Kilometers */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Number Plate *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GJ 01 EV 1234"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                    className="app-field w-full font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Running km (Odometer) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 14500"
                    value={newOdometer}
                    onChange={(e) => setNewOdometer(e.target.value)}
                    className="app-field w-full font-mono"
                  />
                </div>
              </div>

              {/* Battery Capacity & Standard Range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Battery Capacity (kWh) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    placeholder="e.g. 40.5"
                    value={newBatteryCapacity}
                    onChange={(e) => setNewBatteryCapacity(e.target.value)}
                    className="app-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Standard Range (km) *
                  </label>
                  <input
                    type="number"
                    min="20"
                    placeholder="e.g. 453"
                    value={newStandardRange}
                    onChange={(e) => setNewStandardRange(e.target.value)}
                    className="app-field w-full"
                  />
                </div>
              </div>

              {/* Current Battery % & Connector */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Current Battery SoC (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 80"
                    value={newBatteryPct}
                    onChange={(e) => setNewBatteryPct(e.target.value)}
                    className="app-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Connector Type *
                  </label>
                  <select
                    value={newConnector}
                    onChange={(e) => setNewConnector(e.target.value)}
                    className="app-field w-full"
                  >
                    <option value="CCS2">CCS2 (Combined)</option>
                    <option value="Type 2">Type 2 (Mennekes)</option>
                    <option value="GB/T">GB/T Standard</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                </div>
              </div>

              {/* Nickname & Max Charging Power */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Vehicle Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City Runner"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="app-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Max DC Fast Power (kW)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 50"
                    value={newMaxPower}
                    onChange={(e) => setNewMaxPower(e.target.value)}
                    className="app-field w-full"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="app-btn w-full py-3 text-xs rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Save &amp; Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <MobileBottomBar />
    </div>
  );
};

export default MobileVehiclesScreen;
