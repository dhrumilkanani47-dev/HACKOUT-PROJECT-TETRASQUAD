import React from 'react';
import { X, Sparkles, Info } from 'lucide-react';

export const WhyThisPriceModal = ({ isOpen, onClose, price = 8.40 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-up Sheet */}
      <div className="relative z-10 w-full max-w-[420px] bg-card dark:bg-[#141C18] rounded-t-[28px] border-t border-forest/20 dark:border-white/10 p-5 shadow-2xl animate-slide-up">
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-ink/15 dark:bg-white/20 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-forest dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-heading font-bold text-base text-forest dark:text-white">
              Why is charging ₹{price.toFixed(2)}/kWh?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-paper dark:bg-paper-cardDark flex items-center justify-center text-ink-soft hover:text-ink dark:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-ink-soft dark:text-ink-muted mb-4 leading-relaxed">
          Transparent, dynamic ₹/kWh pricing calibrated with live Gujarat SLDC solar injection, wind share, and grid thermal dispatch.
        </p>

        {/* Itemized Breakdown List matching attachment */}
        <div className="space-y-1 text-xs">
          <div className="app-list-row">
            <span className="text-ink-soft dark:text-ink-muted">Base energy cost</span>
            <b className="font-heading">₹7.50</b>
          </div>

          <div className="app-list-row">
            <span className="text-ink-soft dark:text-ink-muted">Solar contribution</span>
            <b className="text-forest-600 dark:text-emerald-400 font-heading">−₹0.60</b>
          </div>

          <div className="app-list-row">
            <span className="text-ink-soft dark:text-ink-muted">Wind contribution</span>
            <b className="text-forest-600 dark:text-emerald-400 font-heading">−₹0.20</b>
          </div>

          <div className="app-list-row">
            <span className="text-ink-soft dark:text-ink-muted">Grid demand</span>
            <b className="text-coal dark:text-rose-400 font-heading">+₹0.50</b>
          </div>

          <div className="app-list-row">
            <span className="text-ink-soft dark:text-ink-muted">Thermal generation</span>
            <b className="text-coal dark:text-rose-400 font-heading">+₹0.70</b>
          </div>

          <div className="app-list-row">
            <span className="text-ink-soft dark:text-ink-muted">Station charge</span>
            <b className="font-heading">+₹0.50</b>
          </div>

          {/* Divider and Final Price */}
          <div className="pt-3 mt-1 border-t border-forest/15 dark:border-white/10 flex justify-between items-center">
            <span className="font-heading font-bold text-ink dark:text-white text-sm">
              Estimated final price
            </span>
            <b className="font-heading font-extrabold text-forest dark:text-emerald-400 text-base">
              ₹{price.toFixed(2)}/kWh
            </b>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-4 pt-3 border-t border-dashed border-forest/10 dark:border-white/5 flex items-start gap-1.5 text-[10px] text-ink-soft dark:text-ink-muted">
          <Info className="w-3.5 h-3.5 text-forest/70 shrink-0 mt-0.5" />
          <span>Estimated price — actual station pricing may differ based on peak connector demand.</span>
        </div>

        {/* Dismiss CTA */}
        <button
          onClick={onClose}
          className="app-btn w-full mt-4 py-2.5 text-xs rounded-xl"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default WhyThisPriceModal;
