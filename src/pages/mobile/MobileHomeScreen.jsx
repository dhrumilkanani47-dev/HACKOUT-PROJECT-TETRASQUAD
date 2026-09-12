import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';
import { useStations } from '../../context/StationContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { WhyThisPriceModal } from '../../components/mobile/WhyThisPriceModal';
import { HamburgerButton } from '../../components/navigation/HamburgerButton';
import {
  Bell,
  Sparkles,
  ChevronRight,
  Zap,
  MapPin,
  Leaf,
  BatteryCharging,
  Sun,
  Wind,
  Flame,
  ArrowRight,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export const MobileHomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { primaryVehicle } = useVehicles();
  const { stations } = useStations();
  const [showWhyPrice, setShowWhyPrice] = useState(false);

  // Active or primary vehicle data
  const vehicleName = primaryVehicle?.name || 'Tata Nexon EV';
  const batteryPct = primaryVehicle?.currentBatteryPct || 68;
  const rangeKm = Math.round(((primaryVehicle?.rangeKm || 453) * batteryPct) / 100);

  // Nearest recommended station
  const nearestStation = stations?.[0] || {
    id: 'st_ahmedabad_1',
    name: 'GreenHub Station',
    location: 'Ahmedabad, Gujarat',
    distanceKm: 1.8,
    availableSlots: 4,
    totalSlots: 6,
    pricePerKwh: 8.40,
    renewablePct: 90
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      {/* Top Section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-4 flex flex-col gap-3">
          {/* Greeting Header with Hamburger Menu, Profile Avatar & Notification Bell */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2.5">
              <HamburgerButton className="p-1.5 bg-slate-100/90 text-slate-700 hover:text-emerald-700 rounded-xl transition-transform active:scale-95" />
              <button
                onClick={() => navigate('/profile')}
                className="text-left group cursor-pointer"
                title="View Profile"
              >
                <div className="text-[11px] text-slate-500 flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
                  <span>Good morning, {user?.name?.split(' ')[0] || 'Shani'}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">›</span>
                </div>
                <div className="font-heading font-extrabold text-[17px] text-slate-900 -mt-0.5 group-hover:text-emerald-800 transition-colors">
                  Drive green today
                </div>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate('/charging')}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all active:scale-95 cursor-pointer"
                title="Scan QR to Charge"
              >
                <QrCode className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all active:scale-95 cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Live Charging Price Main Card */}
          <div
            onClick={() => setShowWhyPrice(true)}
            className="app-card cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all active:scale-[0.99] group bg-white border border-green-200"
            role="button"
            tabIndex={0}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10.5px] text-slate-500 flex items-center gap-1">
                  <span>Live charging price</span>
                  <span className="text-[10px] text-emerald-700 font-bold group-hover:underline flex items-center gap-0.5">
                    (Why this price?)
                  </span>
                </div>
                <div className="font-heading font-extrabold text-[24px] text-emerald-700 leading-tight flex items-baseline">
                  ₹8.40
                  <span className="text-[11px] font-medium text-slate-500 ml-1">
                    /kWh
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="pill-tag green hover:brightness-95 transition-all shadow-xs">
                  ● Good time
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Gujarat SLDC Live</span>
              </div>
            </div>

            {/* Live Grid Mix Micro Bar */}
            <div className="mt-2.5 pt-2 border-t border-green-50 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-800 font-medium">
                  <Sun className="w-3 h-3 text-amber-500" /> Solar 52%
                </span>
                <span className="flex items-center gap-1 text-emerald-800 font-medium">
                  <Wind className="w-3 h-3 text-sky-500" /> Wind 20%
                </span>
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Flame className="w-3 h-3 text-red-400" /> Coal 28%
                </span>
              </div>
              <span className="text-emerald-700 font-bold text-[9.5px]">Breakdown ›</span>
            </div>
          </div>

          {/* Renewable & Green Score Row */}
          <div className="flex gap-2">
            <div
              onClick={() => navigate('/price-score')}
              className="app-card flex-1 text-center py-2.5 cursor-pointer hover:border-emerald-400 hover:shadow-sm transition-all active:scale-[0.98] group bg-white"
              role="button"
              tabIndex={0}
            >
              <div className="text-[9.5px] text-slate-500 font-medium flex items-center justify-center gap-1">
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Renewable</span>
              </div>
              <b className="font-heading text-emerald-700 text-base font-bold group-hover:text-emerald-800">
                72%
              </b>
              <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">
                +8% peak solar
              </div>
            </div>

            <div
              onClick={() => navigate('/price-score')}
              className="app-card flex-1 text-center py-2.5 cursor-pointer hover:border-emerald-400 hover:shadow-sm transition-all active:scale-[0.98] group bg-white"
              role="button"
              tabIndex={0}
            >
              <div className="text-[9.5px] text-slate-500 font-medium flex items-center justify-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" />
                <span>Green Score</span>
              </div>
              <b className="font-heading text-emerald-700 text-base font-bold group-hover:text-emerald-800">
                87
              </b>
              <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">
                Top 10% Eco Driver
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/map')}
              className="app-btn outline flex-1 text-[11.5px] py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Find Station</span>
            </button>
            <button
              onClick={() => navigate('/smart-charge')}
              className="app-btn flex-1 text-[11.5px] py-2.5 rounded-xl font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Charge</span>
            </button>
          </div>

          {/* Live Recommendation Mini Banner */}
          <div
            onClick={() => navigate('/smart-charge')}
            className="p-3 rounded-xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-200 flex items-center justify-between cursor-pointer text-xs hover:border-green-300 hover:shadow-xs transition-all active:scale-[0.99] group"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <span className="font-heading font-bold text-emerald-950 text-[11.5px] block group-hover:text-emerald-700 transition-colors">
                  Best window at 2:00 PM (₹6.50/kWh)
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  89% solar energy • Save ₹72 today
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
          </div>

          {/* Active Vehicle Quick Snippet */}
          <div
            onClick={() => navigate('/charging')}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:border-green-300 hover:bg-green-50/40 transition-all active:scale-[0.99] group"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                <BatteryCharging className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {vehicleName} ({batteryPct}%)
                </div>
                <div className="text-[10px] text-slate-500">
                  {rangeKm} km range estimate • Tap to start session
                </div>
              </div>
            </div>
            <span className="pill-tag sky text-[10px] group-hover:brightness-95 transition-all">
              Ready
            </span>
          </div>

          {/* Nearest Verified Station Quick Action */}
          <div
            onClick={() => navigate(`/station/${nearestStation.id || 'st_ahmedabad_1'}`)}
            className="p-2.5 rounded-xl bg-white border border-green-100 flex items-center justify-between cursor-pointer hover:border-emerald-300 hover:shadow-xs transition-all active:scale-[0.99] group"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                <Zap className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs text-slate-900 flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
                  <span>{nearestStation.name}</span>
                  <span className="text-[9px] text-slate-400 font-normal">({nearestStation.distanceKm || '1.8'} km)</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  {nearestStation.availableSlots || 4}/{nearestStation.totalSlots || 6} chargers free • ₹{nearestStation.pricePerKwh?.toFixed(2) || '8.40'}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/station/${nearestStation.id || 'st_ahmedabad_1'}`);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-heading font-bold text-[10px] hover:bg-emerald-200 transition-colors flex items-center gap-0.5"
            >
              <span>View</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
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

