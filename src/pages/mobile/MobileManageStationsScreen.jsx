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
  Building2,
  X,
  Sparkles,
} from 'lucide-react';

export const MobileManageStationsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOperator = user?.role === 'operator';

  // Operator Company Name from sign-in / profile
  const registeredCompany = user?.companyName?.trim() || 'Tata Power';
  const registeredCompanyKey = registeredCompany.toLowerCase().replace(/[^a-z0-9]/g, '_');

  // Initial Predefined Stations List
  const [stationsList, setStationsList] = useState([
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
  ]);

  // Determine standard company key or custom
  const getInitialCompanyKey = () => {
    const lower = registeredCompany.toLowerCase();
    if (lower.includes('tata')) return 'tata';
    if (lower.includes('jio')) return 'jio_bp';
    if (lower.includes('ather')) return 'ather';
    if (lower.includes('delta')) return 'delta';
    return registeredCompanyKey;
  };

  const [selectedCompany, setSelectedCompany] = useState(getInitialCompanyKey());
  const [tariffUpdates, setTariffUpdates] = useState({});
  const [toastMsg, setToastMsg] = useState('');
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);

  // New Station Form State
  const [newStationName, setNewStationName] = useState('');
  const [newStationCity, setNewStationCity] = useState(user?.city || 'Gandhinagar');
  const [newStationAddress, setNewStationAddress] = useState('');
  const [newStationSpeed, setNewStationSpeed] = useState('150 kW Fast DC');
  const [newStationPrice, setNewStationPrice] = useState(8.50);

  // Built-in company list with dynamic operator company inclusion
  const defaultCompanies = [
    { id: 'all', name: 'All Networks', badge: 'All Fleet' },
    { id: 'tata', name: 'Tata Power', badge: '18 Stations' },
    { id: 'jio_bp', name: 'Jio-bp', badge: '14 Stations' },
    { id: 'ather', name: 'Ather Energy', badge: '10 Stations' },
    { id: 'delta', name: 'Delta EV', badge: '8 Stations' },
  ];

  const hasCustomCompany = !['tata', 'jio_bp', 'ather', 'delta'].includes(getInitialCompanyKey());
  const companies = hasCustomCompany
    ? [
        { id: 'all', name: 'All Networks', badge: 'Fleet' },
        { id: registeredCompanyKey, name: registeredCompany, badge: 'Your Company' },
        { id: 'tata', name: 'Tata Power', badge: '18 Stations' },
        { id: 'jio_bp', name: 'Jio-bp', badge: '14 Stations' },
        { id: 'ather', name: 'Ather Energy', badge: '10 Stations' },
        { id: 'delta', name: 'Delta EV', badge: '8 Stations' },
      ]
    : defaultCompanies;

  const filteredStations = selectedCompany === 'all'
    ? stationsList
    : stationsList.filter((s) => s.company === selectedCompany || s.companyName?.toLowerCase() === selectedCompany.toLowerCase());

  const handleAdjustTariff = (stationId, delta) => {
    setTariffUpdates((prev) => {
      const current = prev[stationId] ?? stationsList.find((s) => s.id === stationId)?.basePrice;
      const updated = Math.max(5.00, +(current + delta).toFixed(2));
      return { ...prev, [stationId]: updated };
    });
    setToastMsg('Tariff updated successfully!');
    setTimeout(() => setToastMsg(''), 1800);
  };

  const handleCreateStation = (e) => {
    e.preventDefault();
    if (!newStationName.trim()) return;

    const newSt = {
      id: `st_custom_${Date.now()}`,
      name: newStationName.trim(),
      company: registeredCompanyKey,
      companyName: registeredCompany,
      city: newStationCity,
      address: newStationAddress.trim() || 'Main Ring Road',
      speed: newStationSpeed,
      totalBays: 4,
      activeBays: 4,
      basePrice: parseFloat(newStationPrice) || 8.50,
      renewable: '85% Green Mix',
      status: 'Online',
      uptime: '99.9%',
    };

    setStationsList([newSt, ...stationsList]);
    setSelectedCompany(registeredCompanyKey);
    setIsAddStationOpen(false);
    setNewStationName('');
    setNewStationAddress('');
    setToastMsg(`Station added under ${registeredCompany}!`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Manage Stations" onBack={() => navigate('/')} />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Operator Company Header Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-sm border border-emerald-500/30">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-white/20 font-bold backdrop-blur-xs">
                    Operator Network Portal
                  </span>
                  <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-emerald-400 text-emerald-950 font-heading font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-[15px] mt-1.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-300" />
                  <span>{registeredCompany}</span>
                </h3>
                <p className="text-[10px] text-emerald-100 mt-0.5">
                  Managing charging stations &amp; dynamic green tariffs for <b>{registeredCompany}</b>
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 text-emerald-200" />
              </div>
            </div>

            {/* Quick Action to Add Station */}
            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between">
              <span className="text-[10px] text-emerald-100">
                Active Fleet: <b>{stationsList.filter((s) => s.company === registeredCompanyKey || s.companyName?.toLowerCase() === registeredCompany.toLowerCase()).length || stationsList.length} Hubs</b>
              </span>
              <button
                onClick={() => setIsAddStationOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-300 hover:bg-emerald-200 text-emerald-950 font-heading font-bold text-[10.5px] flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Add Station</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl text-center text-xs font-heading font-bold border border-emerald-300 animate-fade-in flex items-center justify-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> {toastMsg}
            </div>
          )}

          {/* Company Selector Tab Section */}
          <div>
            <div className="flex justify-between items-center mb-1.5 px-0.5">
              <label className="text-[11px] font-heading font-bold text-slate-800 flex items-center gap-1">
                <span>Filter by Network / Company:</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                {filteredStations.length} Stations
              </span>
            </div>

            {/* Horizontal Scrollable Company Selector Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {companies.map((co) => {
                const isSelected = selectedCompany === co.id;
                const isUserCo = co.name.toLowerCase() === registeredCompany.toLowerCase() || co.id === registeredCompanyKey;
                return (
                  <button
                    key={co.id}
                    onClick={() => setSelectedCompany(co.id)}
                    className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-sm border border-emerald-600 ring-2 ring-emerald-400/30'
                        : isUserCo
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-emerald-800 border border-slate-200'
                    }`}
                  >
                    <span>{co.name}</span>
                    {isUserCo && <span className="text-[9px] px-1 rounded bg-emerald-700 text-white font-mono">Yours</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stations List for Selected Company */}
          <div className="flex flex-col gap-2.5">
            {filteredStations.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-heading font-bold text-xs text-slate-700">No stations registered yet for {registeredCompany}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Click "Add Station" above to deploy your first charging hub.</p>
                <button
                  onClick={() => setIsAddStationOpen(true)}
                  className="app-btn mt-3 py-1.5 px-4 text-xs font-bold"
                >
                  + Add Station to {registeredCompany}
                </button>
              </div>
            ) : (
              filteredStations.map((station) => {
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
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono font-bold border border-emerald-200">
                            🏢 {station.companyName}
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
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-heading font-semibold text-slate-600 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-emerald-600" /> Set Station Tariff:
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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ADD STATION MODAL FOR OPERATOR */}
      {isAddStationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" /> Add Charging Station
                </h4>
                <p className="text-[10px] text-slate-500">Adding to company: <b>{registeredCompany}</b></p>
              </div>
              <button
                onClick={() => setIsAddStationOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStation} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-700 block mb-1">Station Hub Name</label>
                <input
                  type="text"
                  required
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  placeholder="e.g. GIFT City Fast Hub 02"
                  className="app-field w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newStationCity}
                    onChange={(e) => setNewStationCity(e.target.value)}
                    className="app-field w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 block mb-1">Base Price (₹/kWh)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={newStationPrice}
                    onChange={(e) => setNewStationPrice(e.target.value)}
                    className="app-field w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 block mb-1">Address / Landmark</label>
                <input
                  type="text"
                  required
                  value={newStationAddress}
                  onChange={(e) => setNewStationAddress(e.target.value)}
                  placeholder="e.g. Near Infocity Circle"
                  className="app-field w-full text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 block mb-1">Charger Speed Type</label>
                <select
                  value={newStationSpeed}
                  onChange={(e) => setNewStationSpeed(e.target.value)}
                  className="app-field w-full text-xs bg-slate-50 font-semibold"
                >
                  <option value="60 kW DC Fast">60 kW DC Fast</option>
                  <option value="120 kW Fast DC">120 kW Fast DC</option>
                  <option value="150 kW Fast DC">150 kW Fast DC</option>
                  <option value="240 kW Ultra DC">240 kW Ultra DC</option>
                  <option value="22 kW Fast AC">22 kW Fast AC</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStationOpen(false)}
                  className="app-btn ghost flex-1 py-2 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="app-btn flex-1 py-2 font-bold"
                >
                  Create Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MobileBottomBar />
    </div>
  );
};

export default MobileManageStationsScreen;
