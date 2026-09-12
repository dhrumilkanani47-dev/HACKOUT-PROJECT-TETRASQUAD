import React, { useState } from 'react';
import { Calculator, Zap, ArrowRight, TrendingDown } from 'lucide-react';
import { formatCurrency, formatEnergy } from '../../utils/formatters';

export const CostCalculator = ({ vehicle, defaultPrice = 7.20 }) => {
  const [currentPct, setCurrentPct] = useState(vehicle?.currentBatteryPct || 30);
  const [targetPct, setTargetPct] = useState(vehicle?.targetBatteryPct || 80);
  const [tariff, setTariff] = useState(defaultPrice);

  const capacity = vehicle?.batteryCapacity || 40.5;
  const pctDiff = Math.max(0, targetPct - currentPct);
  const energyRequired = (pctDiff / 100) * capacity;
  const estimatedCost = energyRequired * tariff;
  const estimatedKmAdded = Math.round((energyRequired / (capacity / (vehicle?.standardRange || 450))));

  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-950/80 flex items-center justify-center">
          <Calculator className="w-4 h-4 text-forest dark:text-leaf" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-base text-ink dark:text-white">
            EV Charge Cost &amp; Energy Estimator
          </h3>
          <span className="text-xs text-ink-soft dark:text-ink-muted">
            For {vehicle?.name || 'Tata Nexon EV Long Range'} ({capacity} kWh pack)
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-xs font-heading font-semibold mb-1">
            <span className="text-ink-soft dark:text-ink-muted">Current Battery %</span>
            <span className="text-forest dark:text-emerald-400">{currentPct}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="95"
            value={currentPct}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCurrentPct(v);
              if (v >= targetPct) setTargetPct(Math.min(100, v + 10));
            }}
            className="w-full accent-forest dark:accent-emerald-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-heading font-semibold mb-1">
            <span className="text-ink-soft dark:text-ink-muted">Target Battery %</span>
            <span className="text-forest dark:text-emerald-400">{targetPct}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={targetPct}
            onChange={(e) => {
              const v = Number(e.target.value);
              setTargetPct(v);
              if (v <= currentPct) setCurrentPct(Math.max(0, v - 10));
            }}
            className="w-full accent-leaf cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-heading font-semibold mb-1">
            <span className="text-ink-soft dark:text-ink-muted">Electricity Rate (₹/kWh)</span>
            <span className="text-forest dark:text-emerald-400">₹{tariff.toFixed(2)}/kWh</span>
          </div>
          <input
            type="range"
            min="5.00"
            max="15.00"
            step="0.20"
            value={tariff}
            onChange={(e) => setTariff(Number(e.target.value))}
            className="w-full accent-amber cursor-pointer"
          />
        </div>
      </div>

      {/* Itemized Calculation Summary Box (Prompt section 31) */}
      <div className="p-4 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between">
          <span className="text-ink-soft dark:text-ink-muted">Current battery:</span>
          <b className="font-heading text-ink dark:text-white">{currentPct}%</b>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft dark:text-ink-muted">Target battery:</span>
          <b className="font-heading text-ink dark:text-white">{targetPct}%</b>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft dark:text-ink-muted">Energy required:</span>
          <b className="font-heading text-forest dark:text-emerald-400">{energyRequired.toFixed(2)} kWh</b>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft dark:text-ink-muted">Estimated range added:</span>
          <b className="font-heading text-sky">+{estimatedKmAdded} km</b>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft dark:text-ink-muted">Price tariff:</span>
          <b className="font-heading text-ink dark:text-white">₹{tariff.toFixed(2)}/kWh</b>
        </div>
        <div className="flex justify-between pt-2 border-t border-forest/10 dark:border-white/10 text-base font-bold">
          <span className="font-heading text-forest dark:text-emerald-400">Estimated Total Cost:</span>
          <span className="font-heading text-forest dark:text-emerald-400">
            ₹{estimatedCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
