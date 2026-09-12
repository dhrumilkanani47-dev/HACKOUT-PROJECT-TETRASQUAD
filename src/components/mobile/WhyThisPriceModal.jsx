import React from 'react';
import { X, Sparkles, Info } from 'lucide-react';

export const WhyThisPriceModal = ({ isOpen, onClose, price = 8.40 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-up Sheet */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-t-[28px] border-t border-green-200 p-5 shadow-2xl animate-slide-up">
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-green-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Why is charging ₹{price.toFixed(2)}/kWh?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
          Transparent, dynamic ₹/kWh pricing calibrated with live Gujarat SLDC solar injection, wind share, and grid thermal dispatch.
        </p>

        {/* Itemized Breakdown List matching attachment */}
        <div className="space-y-1 text-xs">
          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Base energy cost</span>
            <b className="font-heading text-slate-900">₹7.50</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Solar contribution</span>
            <b className="text-emerald-700 font-heading">−₹0.60</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Wind contribution</span>
            <b className="text-emerald-700 font-heading">−₹0.20</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Grid demand</span>
            <b className="text-red-600 font-heading">+₹0.50</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Thermal generation</span>
            <b className="text-red-600 font-heading">+₹0.70</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Station charge</span>
            <b className="font-heading text-slate-900">+₹0.50</b>
          </div>

          {/* Divider and Final Price */}
          <div className="pt-3 mt-1 border-t border-green-100 flex justify-between items-center">
            <span className="font-heading font-bold text-slate-900 text-sm">
              Estimated final price
            </span>
            <b className="font-heading font-extrabold text-emerald-700 text-base">
              ₹{price.toFixed(2)}/kWh
            </b>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-4 pt-3 border-t border-dashed border-green-100 flex items-start gap-1.5 text-[10px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>Estimated price — actual station pricing may differ based on peak connector demand.</span>
        </div>

        {/* Dismiss CTA */}
        <button
          onClick={onClose}
          className="app-btn w-full mt-4 py-2.5 text-xs rounded-xl font-bold shadow-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default WhyThisPriceModal;
