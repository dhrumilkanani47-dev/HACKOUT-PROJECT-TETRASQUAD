import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Fuel, Leaf, MapPin, Zap } from 'lucide-react';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';

const HISTORY_SESSIONS = {
  h_01: {
    station: 'GreenHub Solar Supercharger',
    address: 'Infocity Circle, Gandhinagar',
    date: '12 Sep',
    time: '1:12 PM - 1:48 PM',
    energy: '24.5 kWh',
    pricePerKwh: '₹18.00/kWh',
    totalCost: '₹441.00',
    renewablePct: 92,
    source: 'Solar + Wind mix',
    score: 94,
  },
  h_02: {
    station: 'SunCharge Station',
    address: 'SG Highway, Ahmedabad',
    date: '5 Sep',
    time: '11:05 AM - 11:38 AM',
    energy: '18.2 kWh',
    pricePerKwh: '₹18.02/kWh',
    totalCost: '₹328.00',
    renewablePct: 78,
    source: 'Solar + Grid mix',
    score: 88,
  },
  h_03: {
    station: 'EcoVolt Station',
    address: 'GIFT City Boulevard, Gandhinagar',
    date: '28 Aug',
    time: '6:20 PM - 7:10 PM',
    energy: '32.0 kWh',
    pricePerKwh: '₹18.00/kWh',
    totalCost: '₹576.00',
    renewablePct: 65,
    source: 'Wind + Grid mix',
    score: 79,
  },
  h_04: {
    station: 'Jio-bp pulse Express',
    address: 'SG Highway, Ahmedabad',
    date: '19 Aug',
    time: '2:15 PM - 2:52 PM',
    energy: '21.0 kWh',
    pricePerKwh: '₹18.00/kWh',
    totalCost: '₹378.00',
    renewablePct: 84,
    source: 'Solar + Wind mix',
    score: 90,
  },
};

export const MobileHistoryDetailsScreen = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const session = HISTORY_SESSIONS[sessionId] || HISTORY_SESSIONS.h_01;
  const fossilPct = 100 - session.renewablePct;

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Session Details" onBack={() => navigate('/history')} />

        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="pill-tag green text-[9px]">Completed charging</span>
                <h2 className="font-heading text-[17px] font-extrabold text-slate-900 mt-1.5">{session.station}</h2>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1"><MapPin className="w-3 h-3" />{session.address}</div>
              </div>
              <div className="text-right text-[10px] text-slate-500">{session.date}<br />{session.time}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="app-card p-3 bg-white"><Zap className="w-4 h-4 text-emerald-600" /><span className="block text-[9px] text-slate-500 mt-1">Energy used</span><b className="font-heading text-base text-slate-900">{session.energy}</b></div>
            <div className="app-card p-3 bg-white"><span className="text-[9px] text-slate-500">Cost per kWh</span><b className="block font-heading text-base text-emerald-700 mt-2">{session.pricePerKwh}</b></div>
            <div className="app-card p-3 bg-white"><span className="text-[9px] text-slate-500">Total cost</span><b className="block font-heading text-base text-slate-900 mt-2">{session.totalCost}</b></div>
            <div className="app-card p-3 bg-white"><span className="text-[9px] text-slate-500">Green score</span><b className="block font-heading text-base text-emerald-700 mt-2">{session.score}/100</b></div>
          </div>

          <div className="app-card p-3 bg-white border border-emerald-200">
            <div className="flex items-center justify-between mb-2"><b className="font-heading text-xs text-slate-900">Energy mix during session</b><span className="text-[9px] text-slate-500">{session.source}</span></div>
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-200"><div className="w-[var(--renewable)] bg-emerald-500" style={{ '--renewable': `${session.renewablePct}%` }} /><div className="flex-1 bg-slate-500" /></div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-800 font-semibold"><Leaf className="w-3.5 h-3.5" /> Renewable: {session.renewablePct}%</span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold"><Fuel className="w-3.5 h-3.5" /> Fossil fuel: {fossilPct}%</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[10px] text-slate-600">
            This session used {session.energy} at {session.pricePerKwh}. The charging mix was {session.renewablePct}% renewable energy from the station's solar and wind supply.
          </div>
        </div>
      </div>
      <MobileBottomBar />
    </div>
  );
};

export default MobileHistoryDetailsScreen;
