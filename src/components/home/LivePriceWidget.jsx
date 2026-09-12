import React, { useState } from 'react';
import { Zap, HelpCircle, Sun, Wind, Flame, Activity, X } from 'lucide-react';
import { PriceBadge } from '../common/PriceBadge';
import { GreenScoreBadge } from '../common/GreenScoreBadge';
import { CURRENT_LIVE_METRICS } from '../../utils/mockData';

export const LivePriceWidget = ({ onWhyPriceClick }) => {
  const [showModal, setShowModal] = useState(false);
  const metrics = CURRENT_LIVE_METRICS;
  const { breakdown } = metrics;

  const handleOpenWhy = () => {
    if (onWhyPriceClick) {
      onWhyPriceClick();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-forest-950/80 flex items-center justify-center">
              <Zap className="w-5 h-5 text-forest dark:text-leaf" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-ink dark:text-white leading-tight">
                Current Charging Price
              </h2>
              <span className="text-xs text-ink-soft dark:text-ink-muted">
                {metrics.priceType}
              </span>
            </div>
          </div>
          <PriceBadge price={metrics.pricePerKwh} size="sm" />
        </div>

        {/* Live Price Display */}
        <div className="flex items-baseline justify-between py-2 border-b border-forest/10 dark:border-white/5">
          <div className="flex items-baseline gap-1">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-forest dark:text-emerald-400">
              ₹{metrics.pricePerKwh.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-ink-soft dark:text-ink-muted">/kWh</span>
          </div>
          <GreenScoreBadge score={metrics.greenScore} size="md" />
        </div>

        {/* Grid composition metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-2.5 rounded-xl bg-forest-50 dark:bg-forest-950/40 border border-forest/10 dark:border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-forest dark:text-emerald-300 font-medium">
              <Sun className="w-3.5 h-3.5 text-amber" />
              <span>Solar</span>
            </div>
            <div className="font-heading font-bold text-base text-forest dark:text-white mt-0.5">
              {metrics.energyMix.solar}%
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-forest-50 dark:bg-forest-950/40 border border-forest/10 dark:border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-forest dark:text-emerald-300 font-medium">
              <Wind className="w-3.5 h-3.5 text-sky" />
              <span>Wind</span>
            </div>
            <div className="font-heading font-bold text-base text-forest dark:text-white mt-0.5">
              {metrics.energyMix.wind}%
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-coal-light/50 dark:bg-coal-950/30 border border-coal/10 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-coal dark:text-coal-300 font-medium">
              <Flame className="w-3.5 h-3.5 text-coal" />
              <span>Thermal</span>
            </div>
            <div className="font-heading font-bold text-base text-coal dark:text-coal-300 mt-0.5">
              {metrics.energyMix.coal}%
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-sky-light/50 dark:bg-sky-950/30 border border-sky/10 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-sky-dark dark:text-sky-300 font-medium">
              <Activity className="w-3.5 h-3.5 text-sky" />
              <span>Grid Load</span>
            </div>
            <div className="font-heading font-bold text-base text-sky-dark dark:text-sky-300 mt-0.5">
              {metrics.gridDemand}%
            </div>
          </div>
        </div>

        {/* Why this price button */}
        <button
          onClick={handleOpenWhy}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-forest/20 dark:border-white/10 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-forest dark:text-emerald-400 font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-forest dark:text-emerald-400" />
          <span>Why this price?</span>
        </button>
      </div>

      {/* Why This Price Modal / Bottom Sheet */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white dark:bg-paper-cardDark rounded-t-3xl sm:rounded-3xl border border-forest/15 dark:border-white/10 p-5 shadow-elevated animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-forest-100 dark:bg-forest-950/80 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-forest dark:text-leaf" />
                </div>
                <h3 className="font-heading font-bold text-base text-ink dark:text-white">
                  Why is charging ₹{metrics.pricePerKwh.toFixed(2)}/kWh?
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-ink-soft dark:text-ink-muted hover:text-forest rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ink-soft dark:text-ink-muted mb-4">
              Real-time transparent breakdown based on Gujarat & Western Grid merit-order dispatch.
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-forest/10 dark:border-white/10">
                <span className="text-ink-soft dark:text-ink-muted">Base energy generation cost</span>
                <span className="font-heading font-bold text-ink dark:text-white">₹{breakdown.baseEnergyCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-forest/10 dark:border-white/10">
                <span className="text-ink-soft dark:text-ink-muted">Solar merit benefit (High yield)</span>
                <span className="font-heading font-bold text-forest dark:text-emerald-400">−₹{Math.abs(breakdown.solarBenefit).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-forest/10 dark:border-white/10">
                <span className="text-ink-soft dark:text-ink-muted">Wind contribution benefit</span>
                <span className="font-heading font-bold text-forest dark:text-emerald-400">−₹{Math.abs(breakdown.windBenefit).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-forest/10 dark:border-white/10">
                <span className="text-ink-soft dark:text-ink-muted">Grid peak demand adjustment</span>
                <span className="font-heading font-bold text-coal dark:text-coal-300">+₹{breakdown.gridDemandAdjustment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-forest/10 dark:border-white/10">
                <span className="text-ink-soft dark:text-ink-muted">Thermal generation adjustment</span>
                <span className="font-heading font-bold text-coal dark:text-coal-300">+₹{breakdown.thermalGenerationAdj.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-forest/10 dark:border-white/10">
                <span className="text-ink-soft dark:text-ink-muted">Station / Network delivery fee</span>
                <span className="font-heading font-bold text-ink dark:text-white">+₹{breakdown.stationNetworkFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2 border-forest/20 dark:border-white/20">
                <span className="font-heading font-bold text-sm text-forest dark:text-emerald-400">Estimated Final Price</span>
                <span className="font-heading font-bold text-lg text-forest dark:text-emerald-400">
                  ₹{metrics.pricePerKwh.toFixed(2)}/kWh
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-forest-50 dark:bg-forest-950/60 text-[11px] text-ink-soft dark:text-ink-muted flex items-center gap-2">
              <span className="text-forest font-bold">ℹ️</span>
              <span>Estimated price — actual station pricing may differ based on peak parking and network surcharge.</span>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full min-h-[44px] py-2.5 rounded-xl bg-forest text-white font-heading font-semibold text-sm hover:bg-forest-600 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
