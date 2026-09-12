import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { WhyThisPriceModal } from '../../components/mobile/WhyThisPriceModal';
import { HamburgerButton } from '../../components/navigation/HamburgerButton';
import { Bell, Sparkles, ChevronRight, Zap } from 'lucide-react';

export const MobileHomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showWhyPrice, setShowWhyPrice] = useState(false);

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      {/* Top Section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-3 flex flex-col gap-3">
          {/* Greeting Header with Hamburger Menu and Notification Bell */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2.5">
              <HamburgerButton className="p-1.5 bg-slate-100/90 text-slate-700 hover:text-emerald-700 rounded-xl" />
              <div>
                <div className="text-[11px] text-slate-500">
                  Good morning, {user?.name?.split(' ')[0] || 'Shani'}
                </div>
                <div className="font-heading font-extrabold text-[17px] text-slate-900 -mt-0.5">
                  Drive green today
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-emerald-700 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>
          </div>

          {/* Live Charging Price Main Card */}
          <div
            onClick={() => setShowWhyPrice(true)}
            className="app-card cursor-pointer hover:border-emerald-400 transition-all hover:shadow-sm group bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span>Live charging price</span>
                  <span className="text-[9.5px] text-emerald-700 font-semibold group-hover:underline flex items-center">
                    (Why this price?)
                  </span>
                </div>
                <div className="font-heading font-extrabold text-[24px] text-emerald-700 leading-tight">
                  ₹8.40
                  <span className="text-[11px] font-medium text-slate-500 ml-0.5">
                    /kWh
                  </span>
                </div>
              </div>
              <span className="pill-tag green">
                ● Good time
              </span>
            </div>
          </div>

          {/* Renewable & Green Score Row */}
          <div className="flex gap-2">
            <div
              onClick={() => navigate('/smart-charge')}
              className="app-card flex-1 text-center py-2.5 cursor-pointer hover:border-emerald-300 transition-colors"
            >
              <div className="text-[9.5px] text-slate-500 font-medium">
                Renewable
              </div>
              <b className="font-heading text-emerald-700 text-base font-bold">
                72%
              </b>
            </div>

            <div
              onClick={() => navigate('/price-score')}
              className="app-card flex-1 text-center py-2.5 cursor-pointer hover:border-emerald-300 transition-colors"
            >
              <div className="text-[9.5px] text-slate-500 font-medium">
                Green Score
              </div>
              <b className="font-heading text-emerald-700 text-base font-bold">
                87
              </b>
            </div>
          </div>

          {/* Action Buttons Row */}
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
            className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 flex items-center justify-between cursor-pointer text-xs hover:border-green-300 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="font-heading font-bold text-emerald-950 text-[11.5px] block">
                  Best window at 2:00 PM (₹6.50/kWh)
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  89% solar energy • Save ₹72
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Active Vehicle Quick Snippet */}
          <div
            onClick={() => navigate('/charging')}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:border-green-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <div className="font-heading font-bold text-xs text-slate-900">
                  Tata Nexon EV (68%)
                </div>
                <div className="text-[10px] text-slate-500">
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
