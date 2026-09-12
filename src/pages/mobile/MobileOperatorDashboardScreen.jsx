import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { Sliders, Zap, TrendingUp, Radio, Leaf, Activity, Clock3 } from 'lucide-react';
import { ProfilePhotoUploader } from '../../components/common/ProfilePhotoUploader';

export const MobileOperatorDashboardScreen = () => {
  const navigate = useNavigate();
  const [stationTariff, setStationTariff] = useState(8.40);
  const [activeChargers] = useState(23);

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Operator Dashboard" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 12 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-green-200 p-3">
            <ProfilePhotoUploader />
            <div>
              <b className="block text-sm font-heading text-slate-900">Network Operations</b>
              <span className="text-[10px] text-slate-500">GreenHub Supercharger Network</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="app-card p-3 bg-white"><Radio className="w-4 h-4 text-emerald-600" /><span className="block text-[9px] text-slate-500 mt-1">Charging Stations</span><b className="font-heading text-lg text-slate-900">50</b></div>
            <div className="app-card p-3 bg-white"><Activity className="w-4 h-4 text-emerald-600" /><span className="block text-[9px] text-slate-500 mt-1">Active Charging</span><b className="font-heading text-lg text-slate-900">23</b></div>
            <div className="app-card p-3 bg-white"><Clock3 className="w-4 h-4 text-amber-600" /><span className="block text-[9px] text-slate-500 mt-1">Scheduled Sessions</span><b className="font-heading text-lg text-slate-900">41</b></div>
            <div className="app-card p-3 bg-white"><Leaf className="w-4 h-4 text-emerald-600" /><span className="block text-[9px] text-slate-500 mt-1">Renewable Energy</span><b className="font-heading text-lg text-emerald-700">72%</b></div>
          </div>

          <div className="app-card p-3 bg-emerald-50 border border-emerald-200">
            <div className="flex justify-between items-center"><span className="text-[10px] text-emerald-900 font-semibold">Average Green Score</span><b className="text-emerald-800 font-heading text-lg">86</b></div>
            <div className="h-1.5 bg-emerald-100 rounded-full mt-2"><div className="h-full w-[86%] bg-emerald-500 rounded-full" /></div>
            <p className="text-[9px] text-emerald-800 mt-2">Renewable availability is highest from 11 AM to 3 PM.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="app-card p-3 bg-white"><span className="text-[9px] text-slate-500">Today's Energy Cost</span><b className="block font-heading text-base text-slate-900 mt-1">₹18,450</b></div>
            <div className="app-card p-3 bg-white"><span className="text-[9px] text-slate-500">Peak Load</span><b className="block font-heading text-base text-slate-900 mt-1">420 kW</b></div>
          </div>
          {/* Station Name Subtitle */}
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Station: <b className="text-slate-900 font-heading font-bold">GreenHub Supercharger</b>
            </span>
            <span className="pill-tag green text-[9.5px]">
              ● Online & Serving
            </span>
          </div>

          {/* Row 1: Sessions & Revenue matching attachment */}
          <div className="grid grid-cols-2 gap-2">
            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Sessions</div>
              <b className="font-heading text-[15px] text-slate-900">128</b>
            </div>

            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Revenue</div>
              <b className="font-heading text-[15px] text-slate-900">₹24,580</b>
            </div>
          </div>

          {/* Row 2: Renewable & Chargers matching attachment */}
          <div className="grid grid-cols-2 gap-2">
            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Renewable</div>
              <b className="font-heading text-[15px] text-emerald-700 font-bold">78%</b>
            </div>

            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Chargers</div>
              <b className="font-heading text-[15px] text-slate-900">{activeChargers} / 6</b>
            </div>
          </div>

          {/* Session Trend Bar Chart matching attachment */}
          <div className="app-card py-3 px-3 bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9.5px] text-slate-500 font-medium">
                Session trend (Past 7 Days)
              </span>
              <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18% peak utilization
              </span>
            </div>

            {/* 7-Bar Chart matching attachment styles */}
            <div className="flex items-end gap-2 h-16 pt-2 pb-1 border-b border-green-100">
              {/* Bar 1: 40% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '40%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Mon</span>
              </div>

              {/* Bar 2: 55% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '55%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Tue</span>
              </div>

              {/* Bar 3: 30% low */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-green-100 rounded-t-sm transition-all" style={{ height: '30%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Wed</span>
              </div>

              {/* Bar 4: 70% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '70%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Thu</span>
              </div>

              {/* Bar 5: 60% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '60%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Fri</span>
              </div>

              {/* Bar 6: 35% low */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-green-100 rounded-t-sm transition-all" style={{ height: '35%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Sat</span>
              </div>

              {/* Bar 7: 48% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '48%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Sun</span>
              </div>
            </div>
          </div>

          {/* Operator Fast Control: Tariff Margin */}
          <div className="app-card py-2.5 px-3 bg-white">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10.5px] font-heading font-semibold text-slate-600">
                Station Base Rate:
              </span>
              <b className="font-heading text-emerald-800 font-extrabold">
                ₹{stationTariff.toFixed(2)}/kWh
              </b>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStationTariff((p) => +(p - 0.2).toFixed(2))}
                className="app-btn ghost flex-1 py-1.5 text-xs font-bold"
              >
                − ₹0.20
              </button>
              <button
                onClick={() => setStationTariff((p) => +(p + 0.2).toFixed(2))}
                className="app-btn outline flex-1 py-1.5 text-xs font-bold"
              >
                + ₹0.20
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOperatorDashboardScreen;
