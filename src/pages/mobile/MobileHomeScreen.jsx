import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { HamburgerButton } from '../../components/navigation/HamburgerButton';
import {
  Bell,
  Sparkles,
  MapPin,
  Leaf,
  BatteryCharging,
  Sun,
  Wind,
  Flame,
  Car,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const MobileHomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles } = useVehicles();

  // Fallback vehicle list if none loaded
  const carList = vehicles && vehicles.length > 0 ? vehicles : [
    {
      id: 'veh_01',
      name: 'Nexon EV Long Range',
      nickname: 'Stealth Green',
      brand: 'Tata',
      batteryCapacity: 40.5,
      currentBatteryPct: 68,
      connector: 'CCS2',
      currentRangeEstimate: 308,
      isPrimary: true
    },
    {
      id: 'veh_02',
      name: 'Ather 450X',
      nickname: 'City Dart',
      brand: 'Ather',
      batteryCapacity: 3.7,
      currentBatteryPct: 84,
      connector: 'Type 2',
      currentRangeEstimate: 126,
      isPrimary: false
    },
    {
      id: 'veh_03',
      name: 'MG ZS EV',
      nickname: 'Family Cruiser',
      brand: 'MG',
      batteryCapacity: 50.3,
      currentBatteryPct: 32,
      connector: 'CCS2',
      currentRangeEstimate: 148,
      isPrimary: false
    }
  ];

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      {/* Top Section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Greeting Header with Hamburger Menu & Notifications */}
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

            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Bell className="w-4 h-4" />
            </div>
          </div>

          {/* Live Charging Price Main Display Card */}
          <div className="app-card bg-white border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10.5px] text-slate-500 flex items-center gap-1">
                  <span>Live charging price</span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    (Calibrated SLDC)
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
                <span className="pill-tag green shadow-xs">
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
              <span className="text-emerald-700 font-bold text-[9.5px]">72% Green Share</span>
            </div>
          </div>

          {/* Renewable & Green Score Display Row */}
          <div className="flex gap-2">
            <div className="app-card flex-1 text-center py-2.5 bg-white border border-green-100">
              <div className="text-[9.5px] text-slate-500 font-medium flex items-center justify-center gap-1">
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Renewable</span>
              </div>
              <b className="font-heading text-emerald-700 text-base font-bold">
                72%
              </b>
              <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">
                +8% peak solar
              </div>
            </div>

            <div className="app-card flex-1 text-center py-2.5 bg-white border border-green-100">
              <div className="text-[9.5px] text-slate-500 font-medium flex items-center justify-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" />
                <span>Green Score</span>
              </div>
              <b className="font-heading text-emerald-700 text-base font-bold">
                87
              </b>
              <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">
                Top 10% Eco Driver
              </div>
            </div>
          </div>

          {/* Action Buttons Row — ONLY ACTIVE CLICKABLE BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/map')}
              className="app-btn outline flex-1 text-[11.5px] py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
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

          {/* Live Recommendation Display Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <span className="font-heading font-bold text-emerald-950 text-[11.5px] block">
                  Best window at 2:00 PM (₹6.50/kWh)
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  89% solar energy • Save ₹72 today
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
              AI Plan
            </span>
          </div>

          {/* Car List Section */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-700" />
                <h3 className="font-heading font-bold text-xs text-slate-900">
                  Registered Vehicles ({carList.length})
                </h3>
              </div>
              <button
                onClick={() => navigate('/vehicles')}
                className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>View All &amp; Add</span>
                <span>›</span>
              </button>
            </div>

            {/* List of Cars */}
            <div className="flex flex-col gap-2">
              {carList.map((vehicle) => {
                const pct = vehicle.currentBatteryPct || 68;
                const range = vehicle.currentRangeEstimate || Math.round(((vehicle.standardRange || 453) * pct) / 100);
                const isPrimary = vehicle.isPrimary;
                const odo = vehicle.odometerKm || 14200;

                return (
                  <div
                    key={vehicle.id}
                    onClick={() => navigate('/vehicles')}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 transition-all hover:border-emerald-300 cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          <BatteryCharging className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                          <div className="font-heading font-bold text-[12.5px] text-slate-900 leading-tight">
                            {vehicle.name}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <span>{vehicle.connector || 'CCS2'} • {vehicle.batteryCapacity || 40} kWh</span>
                            <span>•</span>
                            <span className="font-mono text-slate-700 font-semibold">{odo.toLocaleString()} km run</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="px-1.5 py-0.5 bg-emerald-700 text-white rounded font-mono font-bold text-[9px] tracking-wide">
                          {vehicle.plateNumber || 'GJ 01 EV 0000'}
                        </div>
                        {isPrimary && (
                          <span className="pill-tag green text-[9px] px-1.5 py-0.5 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Battery progress and range estimate */}
                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 flex-1 mr-3">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-heading font-bold text-slate-800 text-[11px]">
                          {pct}%
                        </span>
                      </div>
                      <span className="text-[10.5px] text-emerald-700 font-bold shrink-0">
                        {range} km range
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomBar />
    </div>
  );
};

export default MobileHomeScreen;

