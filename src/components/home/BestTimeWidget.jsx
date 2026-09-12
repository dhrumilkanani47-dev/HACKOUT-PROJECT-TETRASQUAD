import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, ShieldAlert, CheckCircle2, TrendingDown } from 'lucide-react';
import { CURRENT_LIVE_METRICS } from '../../utils/mockData';

export const BestTimeWidget = () => {
  const [isScheduled, setIsScheduled] = useState(false);
  const data = CURRENT_LIVE_METRICS.smartChargingWindow;

  const handleSchedule = () => {
    setIsScheduled(true);
    setTimeout(() => {
      // notification / feedback
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-forest-950/80 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-forest dark:text-leaf" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-ink dark:text-white leading-tight">
              Best Time to Charge
            </h2>
            <span className="text-xs text-ink-soft dark:text-ink-muted">
              Dynamic SLDC Solar Tariff Forecast
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-heading text-xs font-semibold">
          ● Best Window
        </span>
      </div>

      {/* Best Window Card */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 mb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[11px] font-heading font-semibold uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">
              Recommended Slot
            </span>
            <div className="font-heading font-bold text-xl sm:text-2xl text-forest dark:text-emerald-300 mt-0.5">
              {data.bestWindow}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-ink-soft dark:text-ink-muted">Est. Tariff</span>
            <div className="font-heading font-bold text-lg text-forest dark:text-emerald-400">
              ₹{data.bestPrice.toFixed(2)}/kWh
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/60 text-center">
          <div>
            <span className="text-[10px] text-ink-soft dark:text-ink-muted block">Renewable</span>
            <b className="font-heading text-sm text-forest dark:text-emerald-300">{data.bestRenewable}%</b>
          </div>
          <div>
            <span className="text-[10px] text-ink-soft dark:text-ink-muted block">Green Score</span>
            <b className="font-heading text-sm text-forest dark:text-emerald-300">{data.bestGreenScore}/100</b>
          </div>
          <div>
            <span className="text-[10px] text-ink-soft dark:text-ink-muted block">Estimated Saving</span>
            <b className="font-heading text-sm text-amber flex items-center justify-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" />
              ₹{data.saving}
            </b>
          </div>
        </div>
      </div>

      {/* Avoid Peak Window Alert */}
      <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 mb-4 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-coal shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-heading font-bold text-coal dark:text-rose-300">
            Avoid Peak: {data.worstWindow} (₹{data.worstPrice.toFixed(2)}/kWh)
          </span>
          <p className="text-[11px] text-ink-soft dark:text-ink-muted mt-0.5">
            {data.worstReason}
          </p>
        </div>
      </div>

      {/* Schedule Button */}
      <button
        onClick={handleSchedule}
        className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-heading font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          isScheduled
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'bg-forest hover:bg-forest-600 text-white shadow-soft'
        }`}
      >
        {isScheduled ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Smart Schedule Active for 2:00 PM</span>
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>Schedule Charging</span>
          </>
        )}
      </button>
    </div>
  );
};
