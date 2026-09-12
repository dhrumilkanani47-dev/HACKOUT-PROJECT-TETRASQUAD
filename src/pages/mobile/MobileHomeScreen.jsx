import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { WhyThisPriceModal } from '../../components/mobile/WhyThisPriceModal';
import { Bell, Sparkles, ChevronRight, Zap } from 'lucide-react';

export const MobileHomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showWhyPrice, setShowWhyPrice] = useState(false);

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-card dark:bg-[#121815] select-none">
      {/* Top Section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-3 flex flex-col gap-3">
          {/* Greeting Header with Notification Bell */}
          <div className="flex items-center justify-between mt-1">
            <div>
              <div className="text-[11px] text-ink-soft dark:text-ink-muted">
                Good morning, {user?.name?.split(' ')[0] || 'Shani'}
              </div>
              <div className="font-heading font-bold text-[16px] text-ink dark:text-white -mt-0.5">
                Drive green today
              </div>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-xl bg-paper dark:bg-paper-cardDark text-ink-soft dark:text-ink-muted hover:text-forest transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber animate-pulse" />
            </button>
          </div>

          {/* Live Charging Price Main Card matching attachment */}
          <div
            onClick={() => setShowWhyPrice(true)}
            className="app-card cursor-pointer hover:border-forest/40 transition-all hover:shadow-xs group"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] text-ink-soft dark:text-ink-muted flex items-center gap-1">
                  <span>Live charging price</span>
                  <span className="text-[9px] text-forest dark:text-emerald-400 group-hover:underline flex items-center">
                    (Why this price?)
                  </span>
                </div>
                <div className="font-heading font-bold text-[22px] text-forest dark:text-emerald-400 leading-tight">
                  ₹8.40
                  <span className="text-[11px] font-medium text-ink-soft dark:text-ink-muted ml-0.5">
                    /kWh
                  </span>
                </div>
              </div>
              <span className="pill-tag green">
                ● Good time
              </span>
            </div>
          </div>

          {/* Renewable & Green Score Row matching attachment */}
          <div className="flex gap-2">
            <div
              onClick={() => navigate('/smart-charge')}
              className="app-card flex-1 text-center py-2.5 cursor-pointer hover:border-forest/40 transition-colors"
            >
              <div className="text-[9.5px] text-ink-soft dark:text-ink-muted">
                Renewable
              </div>
              <b className="font-heading text-forest-600 dark:text-emerald-400 text-base">
                72%
              </b>
            </div>

            <div
              onClick={() => navigate('/price-score')}
              className="app-card flex-1 text-center py-2.5 cursor-pointer hover:border-forest/40 transition-colors"
            >
              <div className="text-[9.5px] text-ink-soft dark:text-ink-muted">
                Green Score
              </div>
              <b className="font-heading text-forest-600 dark:text-emerald-400 text-base">
                87
              </b>
            </div>
          </div>

          {/* Action Buttons Row matching attachment */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/map')}
              className="app-btn outline flex-1 text-[11.5px] py-2.5 rounded-xl font-bold"
            >
              Find Station
            </button>
            <button
              onClick={() => navigate('/smart-charge')}
              className="app-btn flex-1 text-[11.5px] py-2.5 rounded-xl font-bold shadow-xs"
            >
              Smart Charge
            </button>
          </div>

          {/* Live Recommendation Mini Banner */}
          <div
            onClick={() => navigate('/smart-charge')}
            className="p-2.5 rounded-xl bg-forest-50 dark:bg-forest-950/40 border border-forest/10 dark:border-white/10 flex items-center justify-between cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber shrink-0" />
              <div>
                <span className="font-heading font-semibold text-forest dark:text-emerald-300 text-[11px] block">
                  Best window at 2:00 PM (₹6.50/kWh)
                </span>
                <span className="text-[10px] text-ink-soft dark:text-ink-muted">
                  89% solar energy • Save ₹72
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-soft" />
          </div>

          {/* Active Vehicle Quick Snippet */}
          <div
            onClick={() => navigate('/charging')}
            className="p-2.5 rounded-xl bg-paper dark:bg-paper-cardDark border border-line flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-forest/10 dark:bg-emerald-500/20 text-forest dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-ink dark:text-white">
                  Tata Nexon EV (68%)
                </div>
                <div className="text-[10px] text-ink-soft dark:text-ink-muted">
                  308 km range estimate
                </div>
              </div>
            </div>
            <span className="pill-tag sky text-[10px]">
              Ready
            </span>
          </div>
        </div>
      </div>

      {/* Why This Price Modal (Screen 06) */}
      <WhyThisPriceModal
        isOpen={showWhyPrice}
        onClose={() => setShowWhyPrice(false)}
        price={8.40}
      />

      {/* Bottom Navigation (Screen 03) */}
      <MobileBottomBar />
    </div>
  );
};

export default MobileHomeScreen;
