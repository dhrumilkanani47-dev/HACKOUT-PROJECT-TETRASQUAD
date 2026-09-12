import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Zap, BatteryCharging, Edit3, Star, ShieldCheck, Check } from 'lucide-react';
import { GreenScoreBadge } from '../common/GreenScoreBadge';

export const VehicleCard = ({ vehicle, isPrimary, onSetPrimary }) => {
  const navigate = useNavigate();

  const handleCharge = () => {
    navigate('/map');
  };

  const handleEdit = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  const batteryPct = vehicle.currentBatteryPct || 65;

  return (
    <div className={`bg-white dark:bg-paper-cardDark border rounded-3xl p-5 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between ${
      isPrimary ? 'border-forest/40 dark:border-emerald-500/40 ring-1 ring-forest/20' : 'border-forest/15 dark:border-white/10'
    }`}>
      <div>
        {/* Card Header: Type Badge, Nickname, Primary Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest dark:text-emerald-300 text-[10.5px] font-heading font-semibold">
                {vehicle.type || 'Electric 4W'}
              </span>
              {vehicle.nickname && (
                <span className="text-xs text-ink-soft dark:text-ink-muted">
                  "{vehicle.nickname}"
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-lg text-ink dark:text-white mt-1">
              {vehicle.name}
            </h3>
            <span className="text-xs text-ink-soft dark:text-ink-muted">
              {vehicle.brand} {vehicle.model}
            </span>
          </div>

          {isPrimary ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest text-white text-[10px] font-heading font-semibold">
              <Check className="w-3 h-3" />
              <span>Primary EV</span>
            </span>
          ) : (
            <button
              onClick={() => onSetPrimary && onSetPrimary(vehicle.id)}
              className="text-[10px] text-ink-soft hover:text-forest dark:hover:text-emerald-400 font-heading font-medium"
            >
              Set as primary
            </button>
          )}
        </div>

        {/* Battery & Health Gauge */}
        <div className="p-3.5 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 my-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-ink-soft dark:text-ink-muted font-heading font-semibold">Battery State</span>
            <span className="font-heading font-bold text-sm text-forest dark:text-emerald-400">
              {batteryPct}% ({(vehicle.batteryCapacity * (batteryPct / 100)).toFixed(1)} kWh)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-forest/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-leaf transition-all duration-500"
              style={{ width: `${batteryPct}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-ink-soft dark:text-ink-muted">
            <span>Est. Range: ~{vehicle.currentRangeEstimate || 300} km</span>
            <span>Pack: {vehicle.batteryCapacity} kWh</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-t border-b border-forest/10 dark:border-white/5 mb-4">
          <div>
            <span className="text-[10px] text-ink-soft dark:text-ink-muted block uppercase font-heading">Connector</span>
            <b className="font-heading text-xs text-ink dark:text-white">{vehicle.connector}</b>
          </div>
          <div>
            <span className="text-[10px] text-ink-soft dark:text-ink-muted block uppercase font-heading">Max Power</span>
            <b className="font-heading text-xs text-forest dark:text-emerald-400">{vehicle.maxChargingPower} kW</b>
          </div>
          <div>
            <span className="text-[10px] text-ink-soft dark:text-ink-muted block uppercase font-heading">Green Score</span>
            <GreenScoreBadge score={vehicle.greenScore || 92} size="sm" showLabel={false} />
          </div>
        </div>
      </div>

      {/* Buttons: Charge & Edit (touch target >= 44px) */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCharge}
          className="min-h-[44px] py-2.5 px-3 rounded-xl bg-forest hover:bg-forest-600 text-white font-heading font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-300" />
          <span>Charge</span>
        </button>

        <button
          onClick={handleEdit}
          className="min-h-[44px] py-2.5 px-3 rounded-xl border border-forest/20 dark:border-white/10 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-forest dark:text-emerald-400 font-heading font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit &amp; Details</span>
        </button>
      </div>
    </div>
  );
};
