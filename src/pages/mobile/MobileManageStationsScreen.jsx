import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { useAuth } from '../../context/AuthContext';
import {
  Radio,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const MobileManageStationsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOperator = user?.role === 'operator';

  // Company Selection ('all' | 'tata' | 'jio_bp' | 'ather' | 'delta')
  const [selectedCompany, setSelectedCompany] = useState(isOperator ? 'tata' : 'all');
  const [tariffUpdates, setTariffUpdates] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const companies = [
    { id: 'all', name: 'All Networks', badge: '50 Stations', color: 'emerald' },
    { id: 'tata', name: 'Tata Power', badge: '18 Stations', color: 'blue' },
    { id: 'jio_bp', name: 'Jio-bp', badge: '14 Stations', color: 'green' },
    { id: 'ather', name: 'Ather Energy', badge: '10 Stations', color: 'amber' },
    { id: 'delta', name: 'Delta EV', badge: '8 Stations', color: 'purple' },
  ];

  const stationsList = [
    {
      id: 'st_01',
      name: 'GreenHub Solar Supercharger',
      company: 'tata',
      companyName: 'Tata Power',
      city: 'Gandhinagar',
      address: 'Infocity Circle, DAIICT Road',
      speed: '150 kW Fast DC',
      totalBays: 6,
      activeBays: 4,
      basePrice: 8.40,
      renewable: '90% Solar',
      status: 'Online',
      uptime: '99.2%',
    },
    {
      id: 'st_02',
      name: 'Tata Power EZ Charge Hub',
      company: 'tata',
      companyName: 'Tata Power',
      city: 'Ahmedabad',
      address: 'SG Highway, Bodakdev',
      speed: '60 kW DC',
      totalBays: 4,
      activeBays: 3,
      basePrice: 9.10,
      renewable: '75% Clean',
      status: 'Online',
      uptime: '98.5%',
    },
    {
      id: 'st_03',
      name: 'Jio-bp pulse Express Bay',
      company: 'jio_bp',
      companyName: 'Jio-bp',
      city: 'Ahmedabad',
      address: 'Prahlad Nagar Garden',
      speed: '120 kW Fast DC',
      totalBays: 4,
      activeBays: 2,
      basePrice: 7.80,
      renewable: '84% Wind/Solar',
      status: 'Online',
      uptime: '99.4%',
    },
    {
      id: 'st_04',
      name: 'Jio-bp Highway Super Station',
      company: 'jio_bp',
      companyName: 'Jio-bp',
      city: 'Gandhinagar',
      address: 'Koba Highway Cross Road',
      speed: '150 kW Fast DC',
      totalBays: 8,
      activeBays: 6,
      basePrice: 8.20,
      renewable: '88% Clean',
      status: 'Online',
      uptime: '97.9%',
    },
    {
      id: 'st_05',
      name: 'Ather Grid Fast Pod 01',
      company: 'ather',
      companyName: 'Ather Energy',
      city: 'Ahmedabad',
      address: 'Vastrapur Lake Road',
      speed: '22 kW AC / DC',
      totalBays: 4,
      activeBays: 4,
      basePrice: 6.90,
      renewable: '92% Solar',
      status: 'Online',
      uptime: '99.8%',
    },
    {
      id: 'st_06',
      name: 'Ather Grid Infocity Hub',
      company: 'ather',
      companyName: 'Ather Energy',
      city: 'Gandhinagar',
      address: 'Infocity IT Park Gate 2',
      speed: '22 kW Fast Pod',
      totalBays: 6,
      activeBays: 5,
      basePrice: 7.20,
      renewable: '86% Clean',
      status: 'Online',
      uptime: '99.1%',
    },
    {
      id: 'st_07',
      name: 'Delta Ultra-Fast Charging Station',
      company: 'delta',
      companyName: 'Delta EV',
      city: 'Gandhinagar',
      address: 'GIFT City SEZ Tower',
      speed: '240 kW Ultra DC',
      totalBays: 8,
      activeBays: 7,
      basePrice: 9.80,
      renewable: '94% GIFT Clean Mix',
      status: 'Online',
      uptime: '99.9%',
    },
    {
      id: 'st_08',
      name: 'Delta Exicom Clean Charger',
      company: 'delta',
      companyName: 'Delta EV',
      city: 'Ahmedabad',
      address: 'Science City Road',
      speed: '120 kW Fast DC',
      totalBays: 4,
      activeBays: 3,
      basePrice: 8.60,
      renewable: '80% Solar',
      status: 'Online',
      uptime: '98.8%',
    },
  ];

  const filteredStations = selectedCompany === 'all'
    ? stationsList
    : stationsList.filter((s) => s.company === selectedCompany);

  const handleAdjustTariff = (stationId, delta) => {
    setTariffUpdates((prev) => {
      const current = prev[stationId] ?? stationsList.find((s) => s.id === stationId)?.basePrice;
      const updated = Math.max(5.00, +(current + delta).toFixed(2));
      return { ...prev, [stationId]: updated };
    });
    setToastMsg('Tariff updated successfully!');
    setTimeout(() => setToastMsg(''), 1800);
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Manage Stations" onBack={() => navigate('/')} />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Header Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-white/20">
                  {isOperator ? 'Operator Network Portal' : 'Live EV Network'}
                </span>
                <h3 className="font-heading font-extrabold text-sm mt-1">
                  {isOperator ? 'Company Station Fleet Manager' : 'Explore All Charging Networks'}
                </h3>
              </div>
              <Radio className="w-6 h-6 text-emerald-200" />
            </div>
            <p className="text-[10px] text-emerald-100 mt-1">
              {isOperator
                ? 'Select a company network below to manage station tariffs and chargers.'
                : 'Drivers can view all multi-brand stations and dynamic electricity tariffs.'}
            </p>
          </div>

          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl text-center text-xs font-heading font-bold border border-emerald-300 animate-fade-in flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> {toastMsg}
            </div>
          )}

          {/* Company Selector Tab Section (Tata Power, Jio-bp, Ather, Delta) */}
          <div>
            <div className="flex justify-between items-center mb-1.5 px-0.5">
              <label className="text-[11px] font-heading font-bold text-slate-800">
                Select Company Network:
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                {filteredStations.length} Stations Found
              </span>
            </div>

            {/* Horizontal Scrollable Company Selector Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {companies.map((co) => {
                const isSelected = selectedCompany === co.id;
                return (
                  <button
                    key={co.id}
                    onClick={() => setSelectedCompany(co.id)}
                    className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-sm border border-emerald-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-emerald-800 border border-slate-200'
                    }`}
                  >
                    <span>{co.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stations List for Selected Company */}
          <div className="flex flex-col gap-2.5">
            {filteredStations.map((station) => {
              const currentPrice = tariffUpdates[station.id] ?? station.basePrice;
              return (
                <div
                  key={station.id}
                  className="app-card bg-white border border-green-200 p-3 shadow-2xs hover:border-emerald-400 transition-colors"
                >
                  {/* Station Title & Status */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold border border-slate-200">
                          {station.companyName}
                        </span>
                        <span className="pill-tag green text-[9px] py-0.5 px-2">
                          ● {station.status} ({station.uptime})
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-xs text-slate-900 mt-1">
                        {station.name}
                      </h4>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {station.address}, {station.city}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] text-slate-400">Live Rate</div>
                      <b className="font-heading text-emerald-700 text-sm font-extrabold block">
                        ₹{currentPrice.toFixed(2)}
                        <span className="text-[9px] font-normal text-slate-500">/kWh</span>
                      </b>
                    </div>
                  </div>

                  {/* Charger Stats Bar */}
                  <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-dashed border-green-100 text-center text-xs">
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[8.5px] text-slate-400 font-medium">Speed</div>
                      <b className="font-heading text-[10.5px] text-slate-800">{station.speed}</b>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[8.5px] text-slate-400 font-medium">Bays Active</div>
                      <b className="font-heading text-[10.5px] text-slate-800">{station.activeBays} / {station.totalBays}</b>
                    </div>
                    <div className="bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-200/50">
                      <div className="text-[8.5px] text-emerald-800 font-medium">Clean Mix</div>
                      <b className="font-heading text-[10.5px] text-emerald-900">{station.renewable}</b>
                    </div>
                  </div>

                  {/* Operator Controls: Adjust Price on this station */}
                  {isOperator ? (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-heading font-semibold text-slate-600">
                        Adjust Station Tariff:
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleAdjustTariff(station.id, -0.2)}
                          className="app-btn ghost py-1 px-2.5 text-[10.5px] font-bold rounded-lg"
                        >
                          − ₹0.20
                        </button>
                        <button
                          onClick={() => handleAdjustTariff(station.id, +0.2)}
                          className="app-btn outline py-1 px-2.5 text-[10.5px] font-bold rounded-lg"
                        >
                          + ₹0.20
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/station/${station.id}`)}
                      className="w-full mt-2 py-1.5 text-xs font-heading font-bold text-emerald-800 bg-green-50 hover:bg-green-100 rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <span>View Station Details & Slot Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <MobileBottomBar />
    </div>
  );
};

export default MobileManageStationsScreen;
