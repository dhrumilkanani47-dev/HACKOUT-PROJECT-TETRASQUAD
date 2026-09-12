import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, ShieldCheck, TrendingDown, Sun } from 'lucide-react';
import { CURRENT_LIVE_METRICS } from '../../utils/mockData';

export const AiRecommendationCard = () => {
  const navigate = useNavigate();
  const rec = CURRENT_LIVE_METRICS.aiRecommendation;

  const handleUseRecommendation = () => {
    navigate('/dashboard');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0F3D2E] to-[#155C41] text-white rounded-3xl p-5 sm:p-6 shadow-elevated">
      {/* Decorative Glow */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-leaf/25 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/15 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber" />
          </div>
          <span className="font-heading font-semibold text-xs tracking-wider uppercase text-emerald-200">
            GreenCharge AI Recommendation
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-heading font-medium text-emerald-300">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{rec.confidence} Confidence ({rec.confidenceScore}%)</span>
        </div>
      </div>

      {/* Main Action Callout */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <Clock className="w-5 h-5 text-amber shrink-0 self-center" />
          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            "{rec.actionText}"
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 pl-7">
          {rec.reasoning}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-t border-white/15">
        <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
          <div className="text-[10px] text-emerald-200 font-heading uppercase font-semibold">Expected Price</div>
          <div className="font-heading font-bold text-lg text-white mt-0.5">₹{rec.expectedPrice.toFixed(2)}<span className="text-xs font-normal">/kWh</span></div>
        </div>

        <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
          <div className="text-[10px] text-emerald-200 font-heading uppercase font-semibold">Renewable Share</div>
          <div className="font-heading font-bold text-lg text-emerald-300 mt-0.5 flex items-center gap-1">
            <Sun className="w-4 h-4 text-amber" />
            {rec.renewablePct}%
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
          <div className="text-[10px] text-emerald-200 font-heading uppercase font-semibold">Est. Saving</div>
          <div className="font-heading font-bold text-lg text-amber mt-0.5 flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-amber" />
            ₹{rec.estimatedSavingInr}
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
          <div className="text-[10px] text-emerald-200 font-heading uppercase font-semibold">Green Score</div>
          <div className="font-heading font-bold text-lg text-emerald-300 mt-0.5">{rec.greenScore}/100</div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleUseRecommendation}
        className="mt-4 w-full min-h-[44px] py-3 px-4 rounded-xl bg-white text-forest hover:bg-forest-50 font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer group"
      >
        <span>Use Recommendation</span>
        <ArrowRight className="w-4 h-4 text-forest group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
