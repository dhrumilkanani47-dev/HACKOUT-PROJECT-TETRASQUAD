import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Zap, BatteryCharging, ArrowRight, Gauge, ShieldCheck } from 'lucide-react';
import { GreenScoreBadge } from '../common/GreenScoreBadge';

export const VehicleStatusCard = ({ vehicle, greeting = "Good morning 👋" }) => {
  const navigate = useNavigate();

  if (!vehicle) return null;

  const batteryPct = vehicle.currentBatteryPct || 68;
  const isCharging = batteryPct < 85;

  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
      {/* Top Greeting & Switch Vehicle */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-medium text-ink-soft dark:text-ink-muted block">
            {greeting}
          </span>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-ink dark:text-white leading-tight">
            {vehicle.name}
          </h2>
        </div>
        <Link
          to="/vehicles"
          className="text-xs font-heading font-semibold text-forest dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Switch EV</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Battery & Range Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 rounded-2xl p-4 mb-4">
        {/* Battery Circle */}
        <div className="flex items-center gap-3">
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center p-1.5 shrink-0"
            style={{
              background: `conic-gradient(var(--leaf, #3FA66B) ${batteryPct}%, rgba(15,61,46,0.12) 0)`
            }}
          >
            <div className="w-13 h-13 rounded-full bg-white dark:bg-paper-cardDark flex flex-col items-center justify-center">
              <span className="font-heading font-bold text-base text-forest dark:text-emerald-400">
                {batteryPct}%
              </span>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-heading font-semibold text-ink-soft dark:text-ink-muted">State of Charge</span>
            <div className="font-heading font-bold text-sm text-ink dark:text-white">
              {(vehicle.batteryCapacity * (batteryPct / 100)).toFixed(1)} / {vehicle.batteryCapacity} kWh
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Battery Health {vehicle.healthScore || 98}%
            </span>
          </div>
        </div>

        {/* Range Estimate */}
        <div className="sm:border-l sm:border-r border-forest/10 dark:border-white/5 sm:px-4 py-2 sm:py-0">
          <span className="text-[10px] uppercase font-heading font-semibold text-ink-soft dark:text-ink-muted">Estimated Range</span>
          <div className="font-heading font-bold text-2xl text-forest dark:text-emerald-400 mt-0.5">
            {vehicle.currentRangeEstimate || 308} <span className="text-sm font-normal text-ink-soft dark:text-ink-muted">km</span>
          </div>
          <span className="text-[11px] text-ink-soft dark:text-ink-muted">
            Standard: {vehicle.standardRange || 453} km
          </span>
        </div>

        {/* Vehicle Specs */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-ink-soft dark:text-ink-muted">Connector:</span>
            <b className="text-ink dark:text-white font-heading">{vehicle.connector}</b>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft dark:text-ink-muted">Max DC Power:</span>
            <b className="text-ink dark:text-white font-heading">{vehicle.maxChargingPower} kW</b>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft dark:text-ink-muted">Green Score:</span>
            <GreenScoreBadge score={vehicle.greenScore || 94} size="sm" showLabel={false} />
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => navigate('/map')}
          className="min-h-[44px] py-2.5 px-4 rounded-xl border border-forest/20 dark:border-white/10 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-forest dark:text-emerald-400 font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Zap className="w-4 h-4 text-forest dark:text-emerald-400" />
          <span>Find Best Charger</span>
        </button>

        <button
          onClick={() => navigate('/charging/st_01')}
          className="min-h-[44px] py-2.5 px-4 rounded-xl bg-forest hover:bg-forest-600 text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-soft transition-colors cursor-pointer"
        >
          <BatteryCharging className="w-4 h-4 text-emerald-300" />
          <span>Smart Charge Now</span>
        </button>
      </div>
    </div>
  );
};
