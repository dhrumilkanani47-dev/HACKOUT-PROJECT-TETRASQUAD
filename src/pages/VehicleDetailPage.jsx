import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { CostCalculator } from '../components/vehicles/CostCalculator';
import { ArrowLeft, Car, Zap, BatteryCharging, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { GreenScoreBadge } from '../components/common/GreenScoreBadge';

export const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, updateVehicle, deleteVehicle, setPrimaryVehicle } = useVehicles();

  const vehicle = vehicles.find((v) => v.id === id) || vehicles[0];

  const [currentPct, setCurrentPct] = useState(vehicle?.currentBatteryPct || 65);
  const [targetPct, setTargetPct] = useState(vehicle?.targetBatteryPct || 85);
  const [isSaved, setIsSaved] = useState(false);

  if (!vehicle) {
    return (
      <div className="min-h-screen p-6 text-center">
        <p>Vehicle not found.</p>
        <button onClick={() => navigate('/vehicles')} className="mt-4 px-4 py-2 bg-forest text-white rounded-xl">
          Back to Garage
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    await updateVehicle(vehicle.id, {
      currentBatteryPct: currentPct,
      targetBatteryPct: targetPct
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete ${vehicle.name} from your garage?`)) {
      await deleteVehicle(vehicle.id);
      navigate('/vehicles');
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/vehicles')}
              className="p-2 rounded-xl border border-forest/15 dark:border-white/10 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-ink-soft dark:text-ink-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-heading font-semibold uppercase text-forest dark:text-emerald-400">
                {vehicle.type}
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest dark:text-white">
                {vehicle.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!vehicle.isPrimary && (
              <button
                onClick={() => setPrimaryVehicle(vehicle.id)}
                className="px-3 py-1.5 rounded-xl border border-forest/20 text-xs font-heading font-semibold text-forest dark:text-emerald-400 hover:bg-forest-50"
              >
                Set Primary
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl border border-coal/20 text-coal hover:bg-coal-light/30"
              title="Delete Vehicle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vehicle Overview Hero */}
        <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-forest-100 dark:bg-forest-950/80 flex items-center justify-center text-forest dark:text-leaf">
                <Car className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs text-ink-soft dark:text-ink-muted">Brand &amp; Model</span>
                <h3 className="font-heading font-bold text-base text-ink dark:text-white">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <span className="text-xs text-emerald-600 font-medium">BMS Active</span>
              </div>
            </div>

            <div className="sm:border-l sm:border-r border-forest/10 dark:border-white/5 sm:px-4 py-2 sm:py-0">
              <span className="text-xs text-ink-soft dark:text-ink-muted">Health Score</span>
              <div className="font-heading font-bold text-2xl text-forest dark:text-emerald-400">
                {vehicle.healthScore || 98}%
              </div>
              <span className="text-[11px] text-ink-soft dark:text-ink-muted">Optimal Thermal Balance</span>
            </div>

            <div>
              <span className="text-xs text-ink-soft dark:text-ink-muted">Green Score</span>
              <div className="mt-1">
                <GreenScoreBadge score={vehicle.greenScore || 94} size="md" />
              </div>
            </div>
          </div>

          {/* Real-time SoC Battery sliders */}
          <div className="p-4 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-heading font-semibold mb-1">
                <span className="text-ink-soft dark:text-ink-muted">Live Battery Charge (SoC)</span>
                <span className="text-forest dark:text-emerald-400">{currentPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentPct}
                onChange={(e) => setCurrentPct(Number(e.target.value))}
                className="w-full accent-forest cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-heading font-semibold mb-1">
                <span className="text-ink-soft dark:text-ink-muted">Target Battery Limit</span>
                <span className="text-forest dark:text-emerald-400">{targetPct}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={targetPct}
                onChange={(e) => setTargetPct(Number(e.target.value))}
                className="w-full accent-leaf cursor-pointer"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-forest text-white font-heading font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Battery Telemetry Updated</span>
                </>
              ) : (
                <span>Update Battery State</span>
              )}
            </button>
          </div>
        </div>

        {/* Cost & Energy Estimator */}
        <CostCalculator vehicle={{ ...vehicle, currentBatteryPct: currentPct, targetBatteryPct: targetPct }} />
      </div>
    </div>
  );
};
