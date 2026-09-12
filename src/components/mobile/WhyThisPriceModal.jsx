import React from 'react';
import { X, Sparkles, Info } from 'lucide-react';

export const WhyThisPriceModal = ({ isOpen, onClose, price = 8.40 }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-up Sheet */}
      <div className="relative z-10 w-full bg-white rounded-t-[28px] border-t border-green-200 px-5 pt-4 pb-5 shadow-2xl animate-slide-up flex flex-col">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="font-heading font-extrabold text-[15px] text-slate-900 leading-tight">
              Why is charging ₹{price.toFixed(2)}/kWh?
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11.5px] text-slate-500 mb-3.5 leading-relaxed">
          Transparent, dynamic ₹/kWh pricing calibrated with live Gujarat SLDC solar injection, wind share, and grid thermal dispatch.
        </p>

        {/* Itemized Breakdown List */}
        <div className="space-y-0.5 text-xs">
          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Base energy cost</span>
            <b className="font-heading text-slate-900">₹7.50</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Solar contribution</span>
            <b className="text-slate-900 font-heading">−₹0.60</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Wind contribution</span>
            <b className="text-slate-900 font-heading">−₹0.20</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Grid demand</span>
            <b className="text-slate-900 font-heading">+₹0.50</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Thermal generation</span>
            <b className="text-slate-900 font-heading">+₹0.70</b>
          </div>

          <div className="app-list-row">
            <span className="text-slate-600 font-medium">Station charge</span>
            <b className="font-heading text-slate-900">+₹0.50</b>
          </div>

          {/* Divider and Final Price */}
          <div className="pt-3 mt-1 border-t border-green-100 flex justify-between items-center">
            <span className="font-heading font-extrabold text-slate-900 text-sm">
              Estimated final price
            </span>
            <b className="font-heading font-extrabold text-emerald-700 text-base">
              ₹{price.toFixed(2)}/kWh
            </b>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-3.5 pt-2.5 border-t border-dashed border-green-100 flex items-start gap-1.5 text-[10.5px] text-slate-500 leading-snug">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>Estimated price — actual station pricing may differ based on peak connector demand.</span>
        </div>

        {/* Dismiss CTA */}
        <button
          onClick={onClose}
          className="app-btn w-full mt-3.5 py-2.5 text-xs rounded-xl font-bold shadow-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default WhyThisPriceModal;
