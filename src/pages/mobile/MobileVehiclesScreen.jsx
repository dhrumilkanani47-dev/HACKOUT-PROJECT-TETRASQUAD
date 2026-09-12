import React, { useState } from 'react';
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
  Award
} from 'lucide-react';

export const MobileVehiclesScreen = () => {
  const navigate = useNavigate();
  const { vehicles, primaryVehicle, addVehicle, setPrimaryVehicle, deleteVehicle } = useVehicles();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Header Summary Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-sm flex items-center justify-between border border-emerald-500/30">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-white/20 font-bold">
                My EV Fleet
              </span>
              <h2 className="font-heading font-extrabold text-[16px] mt-1">
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

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer group active:scale-[0.99] ${
                    isPrimary
                      ? 'bg-gradient-to-b from-green-50/50 to-white border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Top Row: Brand, Name & Primary Badge */}
                  <div className="flex items-start justify-between">
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

                  {/* Battery & Odometer Stats Strip */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
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
                  <div className="mt-2 flex items-center gap-2">
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
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                    <span>Tap to view full vehicle specs &amp; diagnostics</span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Vehicle Quick Prompt Card */}
          <div
            onClick={() => setShowAddModal(true)}
            className="p-3.5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 flex items-center justify-center gap-2 text-emerald-800 font-heading font-bold text-xs cursor-pointer hover:bg-emerald-50 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Add Another Electric Vehicle</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VEHICLE FULL DETAILS MODAL / SHEET */}
      {/* ========================================================================= */}
      {selectedVehicle && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
          {/* Backdrop Tap to Close */}
          <div className="absolute inset-0" onClick={() => setSelectedVehicle(null)} />

          <div className="relative z-10 w-full max-h-[90%] bg-white rounded-t-[28px] border-t border-green-200 px-5 pt-4 pb-6 shadow-2xl animate-slide-up flex flex-col overflow-y-auto">
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Car className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-[16px] text-slate-900 leading-tight">
                      {selectedVehicle.name}
                    </h3>
                    {selectedVehicle.isPrimary && (
                      <span className="pill-tag green text-[9px] px-1.5 py-0.5 font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.nickname ? `• "${selectedVehicle.nickname}"` : ''}
                  </div>
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

            {/* Number Plate in Bold Indian Green EV Plate Design */}
            <div className="my-2 p-3 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-xl flex items-center justify-between text-white shadow-sm border border-emerald-700">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-300 uppercase">IND</span>
                <span className="font-mono font-extrabold text-base tracking-widest">
                  {selectedVehicle.plateNumber || 'GJ 01 EV 0000'}
                </span>
              </div>
              <span className="text-[9.5px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
                Registered EV
              </span>
            </div>

            {/* Spec & Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 my-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9.5px] text-slate-500 flex items-center gap-1 font-medium">
                  <Gauge className="w-3.5 h-3.5 text-slate-400" /> Running Kilometers
                </span>
                <b className="font-heading text-[13px] text-slate-900 mt-1 block">
                  {(selectedVehicle.odometerKm || 18420).toLocaleString()} km
                </b>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9.5px] text-slate-500 flex items-center gap-1 font-medium">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" /> Current Range
                </span>
                <b className="font-heading text-[13px] text-emerald-700 font-bold mt-1 block">
                  {selectedVehicle.currentRangeEstimate || 308} km ({selectedVehicle.currentBatteryPct || 68}%)
                </b>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9.5px] text-slate-500 flex items-center gap-1 font-medium">
                  <BatteryCharging className="w-3.5 h-3.5 text-amber-500" /> Battery Pack
                </span>
                <b className="font-heading text-[13px] text-slate-900 mt-1 block">
                  {selectedVehicle.batteryCapacity || 40.5} kWh
                </b>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9.5px] text-slate-500 flex items-center gap-1 font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" /> Battery Health
                </span>
                <b className="font-heading text-[13px] text-emerald-700 font-bold mt-1 block">
                  {selectedVehicle.healthScore || 98}% Excellent
                </b>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9.5px] text-slate-500 flex items-center gap-1 font-medium">
                  <Zap className="w-3.5 h-3.5 text-sky-500" /> Fast Charging
                </span>
                <b className="font-heading text-[13px] text-slate-900 mt-1 block">
                  {selectedVehicle.maxChargingPower || 50} kW ({selectedVehicle.connector || 'CCS2'})
                </b>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9.5px] text-slate-500 flex items-center gap-1 font-medium">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Efficiency
                </span>
                <b className="font-heading text-[13px] text-slate-900 mt-1 block">
                  {selectedVehicle.efficiency || '132 Wh/km'}
                </b>
              </div>
            </div>

            {/* Additional Registration & Insurance Info */}
            <div className="p-3 bg-green-50/50 rounded-xl border border-green-200 text-[11px] space-y-1.5 my-1">
              <div className="flex justify-between items-center text-slate-600">
                <span>Model Year:</span>
                <b className="font-heading text-slate-900">{selectedVehicle.year || 2024}</b>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>VIN / Chassis Number:</span>
                <b className="font-mono text-slate-900 text-[10px]">{selectedVehicle.vin || 'MAT612056NP182934'}</b>
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

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-slate-200">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVehicle(null);
                    navigate('/smart-charge');
                  }}
                  className="app-btn flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Smart Charge</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedVehicle(null);
                    navigate('/charging');
                  }}
                  className="app-btn outline flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Live Charging</span>
                </button>
              </div>

              {!selectedVehicle.isPrimary && (
                <button
                  onClick={() => handleSetPrimary(selectedVehicle.id, selectedVehicle.name)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Set as Primary EV</span>
                </button>
              )}

              <button
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
      {/* 2. ADD NEW VEHICLE MODAL FORM */}
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
                    Enter your EV specifications for AI Smart Charging
                  </p>
                </div>
              </div>

              <button
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
