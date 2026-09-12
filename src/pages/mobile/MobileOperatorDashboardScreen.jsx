import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { useAuth } from '../../context/AuthContext';
import {
  Sliders,
  RefreshCw,
  Zap,
  TrendingUp,
  Activity,
  DollarSign,
  BarChart3,
  CheckCircle,
  Building2,
  BatteryCharging,
  Layers,
  X
} from 'lucide-react';

export const MobileOperatorDashboardScreen = () => {
  const navigate = useNavigate();
  const { updateProfile, user, setRole } = useAuth();

  // Operator Metrics as requested:
  // Total Stations: 50
  // Active Sessions: 23
  // Renewable Charging: 72%
  // Peak Load: 420 kW
  // Today's Cost: ₹18,450
  const [totalStations, setTotalStations] = useState(50);
  const [activeSessions, setActiveSessions] = useState(23);
  const [renewableCharging, setRenewableCharging] = useState(72);
  const [peakLoad, setPeakLoad] = useState(420);
  const [todayCost, setTodayCost] = useState(18450);

  const [activeModal, setActiveModal] = useState(null); // 'sessions' | 'pricing' | 'analytics' | null
  const [stationTariff, setStationTariff] = useState(8.40);
  const [sessionList, setSessionList] = useState([
    { id: 'S-201', station: 'GreenHub Station 04', vehicle: 'Tata Nexon EV', power: '48 kW', soc: '68%', status: 'Charging' },
    { id: 'S-202', station: 'GreenHub Station 12', vehicle: 'MG ZS EV', power: '52 kW', soc: '81%', status: 'Charging' },
    { id: 'S-203', station: 'GreenHub Station 07', vehicle: 'Mahindra XUV400', power: '36 kW', soc: '45%', status: 'Charging' },
    { id: 'S-204', station: 'GreenHub Station 22', vehicle: 'Hyundai Ioniq 5', power: '98 kW', soc: '74%', status: 'Fast DC' },
    { id: 'S-205', station: 'GreenHub Station 31', vehicle: 'BYD Atto 3', power: '44 kW', soc: '59%', status: 'Charging' }
  ]);

  const handleSwitchRole = (target) => {
    setRole(target);
    if (target === 'driver') navigate('/');
    if (target === 'grid_operator') navigate('/grid-operator');
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none relative">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav
          title="Operator Dashboard"
          onBack={() => navigate('/')}
          rightAction={
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSwitchRole('grid_operator')}
                className="text-[9.5px] font-heading font-bold text-sky-800 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-md hover:bg-sky-100 transition-colors"
                title="Switch to Grid Operator"
              >
                🌐 Grid
              </button>
              <button
                onClick={() => handleSwitchRole('driver')}
                className="text-[9.5px] font-heading font-bold text-emerald-900 bg-green-100 border border-green-200 px-1.5 py-0.5 rounded-md hover:bg-green-200 transition-colors"
                title="Switch to Driver"
              >
                🚗 Driver
              </button>
            </div>
          }
        />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-6 flex flex-col gap-3">
          {/* Station Status Subtitle */}
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">Active CPO Network</span>
              <b className="text-[13px] text-slate-900 font-heading font-extrabold">All Hub Operations</b>
            </div>
            <span className="pill-tag green text-[9.5px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Fleet Active
            </span>
          </div>

          {/* Requested Key Metrics Cards */}
          <div className="grid grid-cols-2 gap-2">
            {/* Total Stations: 50 */}
            <div className="app-card text-center py-2.5 px-2 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-medium">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>Total Stations</span>
              </div>
              <b className="font-heading text-[18px] text-slate-900 font-black">{totalStations}</b>
            </div>

            {/* Active Sessions: 23 */}
            <div className="app-card text-center py-2.5 px-2 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-medium">
                <BatteryCharging className="w-3 h-3 text-emerald-500" />
                <span>Active Sessions</span>
              </div>
              <b className="font-heading text-[18px] text-emerald-600 font-black">{activeSessions}</b>
            </div>
          </div>

          {/* Renewable Charging: 72% */}
          <div className="app-card py-2.5 px-3 bg-white border border-emerald-200 shadow-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10.5px] text-slate-600 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
                Renewable Charging
              </span>
              <b className="font-heading text-[15px] text-emerald-700 font-black">{renewableCharging}%</b>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${renewableCharging}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>Solar Rooftop & Wind PPA</span>
              <span>Target: 75%</span>
            </div>
          </div>

          {/* Peak Load (420 kW) & Today's Cost (₹18,450) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Peak Load: 420 kW */}
            <div className="app-card text-center py-2.5 px-2 bg-white border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Peak Load</div>
              <b className="font-heading text-[16px] text-amber-600 font-black">{peakLoad} kW</b>
              <div className="text-[8.5px] text-slate-400 mt-0.5">Transformer cap: 600 kW</div>
            </div>

            {/* Today's Cost: ₹18,450 */}
            <div className="app-card text-center py-2.5 px-2 bg-white border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Today's Cost</div>
              <b className="font-heading text-[16px] text-slate-900 font-black">₹{todayCost.toLocaleString('en-IN')}</b>
              <div className="text-[8.5px] text-emerald-600 mt-0.5 font-semibold">₹6,230 saved vs peak</div>
            </div>
          </div>

          {/* Requested Action Buttons: [Manage Sessions] [Pricing] [Station Analytics] */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[10.5px] font-heading font-bold text-slate-600">Quick Operations:</span>
            
            <button
              onClick={() => setActiveModal('sessions')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Manage Sessions
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">23 Active</span>
            </button>

            <button
              onClick={() => setActiveModal('pricing')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-white" />
                Pricing
              </span>
              <span className="text-[10px] bg-black/15 px-2 py-0.5 rounded-full font-mono">₹{stationTariff.toFixed(2)}/kWh</span>
            </button>

            <button
              onClick={() => setActiveModal('analytics')}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-600" />
                Station Analytics
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">+18% vs yesterday</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Sheet for [Manage Sessions] */}
      {activeModal === 'sessions' && (
        <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end backdrop-blur-xs">
          <div className="bg-white rounded-t-2xl p-4 max-h-[80%] flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Active Charging Sessions</h3>
                <p className="text-[10px] text-slate-500">Currently running across 50 charging stalls</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-60 pr-1">
              {sessionList.map((s) => (
                <div key={s.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-heading font-bold text-slate-800 text-[11px]">{s.vehicle}</div>
                    <div className="text-[9.5px] text-slate-500">{s.station} • {s.id}</div>
                  </div>
                  <div className="text-right">
                    <span className="pill-tag green text-[9px]">{s.status}</span>
                    <div className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">{s.power} • {s.soc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="app-btn w-full text-xs py-2 mt-1"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Modal / Sheet for [Pricing] */}
      {activeModal === 'pricing' && (
        <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end backdrop-blur-xs">
          <div className="bg-white rounded-t-2xl p-4 max-h-[80%] flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Station Tariff & Pricing Rules</h3>
                <p className="text-[10px] text-slate-500">Configure Dynamic Green Pricing per kWh</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading font-bold text-slate-700">Base Operator Rate:</span>
                <span className="font-heading font-extrabold text-emerald-700 text-sm">₹{stationTariff.toFixed(2)}/kWh</span>
              </div>
              <div className="flex gap-2 mt-2.5">
                <button
                  onClick={() => setStationTariff((p) => +(p - 0.25).toFixed(2))}
                  className="app-btn ghost flex-1 py-1.5 text-xs font-bold border border-slate-200"
                >
                  − ₹0.25
                </button>
                <button
                  onClick={() => setStationTariff((p) => +(p + 0.25).toFixed(2))}
                  className="app-btn outline flex-1 py-1.5 text-xs font-bold border-emerald-400 text-emerald-900"
                >
                  + ₹0.25
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between p-2 rounded-lg bg-green-50/60 border border-green-200">
                <span className="text-emerald-900 font-semibold">☀️ Solar Window Incentive:</span>
                <span className="font-mono text-emerald-700 font-bold">-₹1.50/kWh (11 AM - 3 PM)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200">
                <span className="text-amber-900 font-semibold">⚡ Evening Peak Surcharge:</span>
                <span className="font-mono text-amber-700 font-bold">+₹2.00/kWh (6 PM - 9 PM)</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="app-btn w-full text-xs py-2 mt-1"
            >
              Save Pricing Rules
            </button>
          </div>
        </div>
      )}

      {/* Modal / Sheet for [Station Analytics] */}
      {activeModal === 'analytics' && (
        <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end backdrop-blur-xs">
          <div className="bg-white rounded-t-2xl p-4 max-h-[85%] flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Station Analytics Overview</h3>
                <p className="text-[10px] text-slate-500">Live operational performance metrics</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500">Average Session Time</div>
                <b className="font-heading text-sm text-slate-800">38 mins</b>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500">Fleet Uptime</div>
                <b className="font-heading text-sm text-emerald-600">99.4%</b>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-heading font-bold text-slate-700 block mb-1">Peak Utilization Window</span>
              <p className="text-[10.5px] text-slate-600">
                Peak load hit <b className="text-amber-600">420 kW</b> at 1:45 PM during concurrent DC fast charging. Controlled curtailment kept grid stability score at 98%.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="app-btn w-full text-xs py-2 mt-1"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOperatorDashboardScreen;
