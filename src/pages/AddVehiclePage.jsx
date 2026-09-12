import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { VEHICLE_TYPES, CONNECTOR_TYPES, VEHICLE_PRESETS } from '../utils/constants';
import { Car, Zap, ArrowLeft, Check, Sparkles } from 'lucide-react';

export const AddVehiclePage = () => {
  const { addVehicle } = useVehicles();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'SUV',
    brand: 'Tata',
    model: 'Nexon EV Long Range',
    nickname: 'My Green Ride',
    batteryCapacity: 40.5,
    connector: 'CCS2',
    maxChargingPower: 50,
    currentBatteryPct: 65,
    targetBatteryPct: 85,
    standardRange: 453
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      type: preset.type,
      brand: preset.brand,
      model: preset.model,
      batteryCapacity: preset.capacity,
      connector: preset.connector,
      maxChargingPower: preset.maxPower,
      standardRange: preset.standardRange,
      name: `${preset.brand} ${preset.model}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const vehiclePayload = {
        ...formData,
        name: `${formData.brand} ${formData.model}`,
        currentRangeEstimate: Math.round((formData.standardRange || 400) * (formData.currentBatteryPct / 100)),
        greenScore: 94
      };
      await addVehicle(vehiclePayload);
      navigate('/vehicles');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* Header with back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-forest/15 dark:border-white/10 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-ink-soft dark:text-ink-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-heading font-semibold uppercase text-forest dark:text-emerald-400">
              New EV Registration
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest dark:text-white">
              Add Vehicle
            </h1>
          </div>
        </div>

        {/* Quick Popular Presets in India */}
        <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber" />
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-ink-soft dark:text-ink-muted">
              Quick Select Popular Indian EV Models
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VEHICLE_PRESETS.slice(0, 6).map((preset, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                  formData.model === preset.model
                    ? 'bg-forest-100 dark:bg-forest-950/70 border-forest text-forest dark:text-emerald-300 font-semibold shadow-xs'
                    : 'bg-paper-card dark:bg-paper-surface border-forest/10 dark:border-white/5 hover:border-forest/30 text-ink dark:text-white'
                }`}
              >
                <div className="font-heading font-bold truncate">{preset.brand} {preset.model}</div>
                <div className="text-[10px] text-ink-soft dark:text-ink-muted mt-0.5">
                  {preset.capacity} kWh • {preset.connector}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1.5">
              Vehicle Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {VEHICLE_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-heading font-semibold transition-all cursor-pointer ${
                    formData.type === type
                      ? 'bg-forest text-white border-forest'
                      : 'bg-paper-card dark:bg-paper-surface border-forest/10 dark:border-white/5 text-ink-soft dark:text-ink-muted'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brand */}
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                placeholder="e.g. Tata, Mahindra, MG, Ola, Ather"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Model Name
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                placeholder="e.g. Nexon EV, XUV400, S1 Pro"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nickname */}
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Vehicle Nickname (Optional)
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                placeholder="e.g. Daily Commuter"
              />
            </div>

            {/* Battery Capacity (kWh) */}
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Battery Capacity (kWh)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.batteryCapacity}
                onChange={(e) => setFormData({ ...formData, batteryCapacity: Number(e.target.value) })}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                placeholder="e.g. 40.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Connector Type */}
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Primary Connector
              </label>
              <select
                value={formData.connector}
                onChange={(e) => setFormData({ ...formData, connector: e.target.value })}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
              >
                {CONNECTOR_TYPES.map((c) => (
                  <option key={c.id} value={c.name.split(' ')[0]}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Charging Power (kW) */}
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Max DC Charging Power (kW)
              </label>
              <input
                type="number"
                value={formData.maxChargingPower}
                onChange={(e) => setFormData({ ...formData, maxChargingPower: Number(e.target.value) })}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                placeholder="e.g. 50"
              />
            </div>
          </div>

          {/* Current & Target Battery sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5">
              <div className="flex justify-between text-xs font-heading font-semibold mb-1">
                <span className="text-ink-soft dark:text-ink-muted">Current Battery %</span>
                <span className="text-forest dark:text-emerald-400">{formData.currentBatteryPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.currentBatteryPct}
                onChange={(e) => setFormData({ ...formData, currentBatteryPct: Number(e.target.value) })}
                className="w-full accent-forest cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5">
              <div className="flex justify-between text-xs font-heading font-semibold mb-1">
                <span className="text-ink-soft dark:text-ink-muted">Default Target %</span>
                <span className="text-forest dark:text-emerald-400">{formData.targetBatteryPct}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={formData.targetBatteryPct}
                onChange={(e) => setFormData({ ...formData, targetBatteryPct: Number(e.target.value) })}
                className="w-full accent-leaf cursor-pointer"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] py-3 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-sm shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{isSubmitting ? 'Saving...' : 'Save & Register Vehicle'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
