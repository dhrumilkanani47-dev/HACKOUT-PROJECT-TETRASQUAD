import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import {
  Bell,
  Sliders,
  Check,
  TrendingDown,
  TrendingUp,
  CalendarCheck,
  Activity,
  Zap,
  Leaf,
  AlertTriangle,
  BatteryCharging,
  Layers
} from 'lucide-react';
import { useStations } from '../../context/StationContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNotificationsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stations } = useStations();
  const role = user?.role || 'driver';

  // Driver alert state
  const [targetPrice, setTargetPrice] = useState(7.00);

  // Operator alert state
  const [occupancyThreshold, setOccupancyThreshold] = useState(80);

  // Grid Operator alert state
  const [frequencyThreshold, setFrequencyThreshold] = useState(49.85);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const bookingStation = stations.find((station) => localStorage.getItem(`egc_booking_${station.id}`));
  const bookingTime = bookingStation ? localStorage.getItem(`egc_booking_${bookingStation.id}`) : null;

  const nearbyStations = useMemo(() => stations.filter((station) => (station.distanceKm || 99) <= 5), [stations]);
  const cheapestStation = [...nearbyStations].sort((a, b) => a.pricePerKwh - b.pricePerKwh)[0];
  const expensiveStation = [...nearbyStations].sort((a, b) => b.pricePerKwh - a.pricePerKwh)[0];

  const handleSaveTarget = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav
          title={
            role === 'grid_operator'
              ? 'Grid Alerts & Data'
              : role === 'operator'
              ? 'Station Alerts'
              : 'Notifications & Alerts'
          }
          onBack={handleBack}
        />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          {/* GRID OPERATOR ALERTS */}
          {role === 'grid_operator' && (
            <>
              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag green flex items-center gap-1 w-fit">
                  <Activity className="w-3 h-3" /> Grid Stability Alert
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  Gujarat SLDC Frequency is currently <b>50.02 Hz (Nominal)</b>. All regional feeders and substation transformers are balanced.
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Real-time telemetry update • SLDC Feed
                </div>
              </div>

              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag sky flex items-center gap-1 w-fit">
                  <Leaf className="w-3 h-3 text-emerald-600" /> Renewable Surge
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  High solar injection detected across Charanka & Dholera solar parks (<b>64% clean energy mix</b>). Optimal window for EV charging absorption.
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Clean energy dispatch recommendation
                </div>
              </div>

              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag amber flex items-center gap-1 w-fit">
                  <AlertTriangle className="w-3 h-3" /> Peak Demand Advisory
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  Peak evening demand anticipated between <b>18:00 – 21:00 IST</b>. Consider triggering dynamic tariff incentives to prevent feeder bottlenecks.
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Grid load balancing notification
                </div>
              </div>

              {/* Grid Frequency Alert Setting */}
              <div className="app-card mt-2 py-3 px-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    Frequency Low Alert: {frequencyThreshold.toFixed(2)} Hz
                  </span>
                  {savedSuccess && (
                    <span className="text-[9.5px] text-emerald-700 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Saved
                    </span>
                  )}
                </div>

                <input
                  type="range"
                  min="49.50"
                  max="50.20"
                  step="0.05"
                  value={frequencyThreshold}
                  onChange={(e) => setFrequencyThreshold(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
                />

                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-medium">
                  <span>49.50 Hz (Critical trip)</span>
                  <span>50.20 Hz (High)</span>
                </div>

                <button
                  onClick={handleSaveTarget}
                  className="app-btn w-full mt-2.5 py-2 text-xs rounded-xl font-bold shadow-xs"
                >
                  Update Grid Alert Threshold
                </button>
              </div>
            </>
          )}

          {/* STATION OPERATOR ALERTS */}
          {role === 'operator' && (
            <>
              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag amber flex items-center gap-1 w-fit">
                  <BatteryCharging className="w-3 h-3" /> High Station Occupancy
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  Charging hub Gandhinagar Central has <b>3 of 4 bays occupied (75% load)</b>. High traffic expected during next 2 hours.
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Live station capacity alert
                </div>
              </div>

              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag sky flex items-center gap-1 w-fit">
                  <CalendarCheck className="w-3 h-3" /> Slot Booking Request
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  A driver requested a <b>45-minute CCS2 fast charging slot</b> for a Tata Nexon EV at 16:00 IST. Check slot booking requests to approve.
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Booking queue notification
                </div>
              </div>

              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag green flex items-center gap-1 w-fit">
                  <TrendingDown className="w-3 h-3" /> Green Energy Tariff Window
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  Grid renewable availability is above 60%. Lowering tariffs to <b>₹7.20/kWh</b> could increase station turnover by ~24%.
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Revenue optimization advice
                </div>
              </div>

              {/* Occupancy Alert Threshold Setting */}
              <div className="app-card mt-2 py-3 px-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    High Occupancy Alert Threshold: {occupancyThreshold}%
                  </span>
                  {savedSuccess && (
                    <span className="text-[9.5px] text-emerald-700 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Saved
                    </span>
                  )}
                </div>

                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={occupancyThreshold}
                  onChange={(e) => setOccupancyThreshold(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
                />

                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-medium">
                  <span>50% (Moderate)</span>
                  <span>95% (Near full capacity)</span>
                </div>

                <button
                  onClick={handleSaveTarget}
                  className="app-btn w-full mt-2.5 py-2 text-xs rounded-xl font-bold shadow-xs"
                >
                  Update Capacity Alert Target
                </button>
              </div>
            </>
          )}

          {/* EV DRIVER ALERTS (Default / Driver) */}
          {role !== 'operator' && role !== 'grid_operator' && (
            <>
              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag amber flex items-center gap-1 w-fit">
                  <TrendingUp className="w-3 h-3" /> High price nearby
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  {expensiveStation ? (
                    <>
                      <b>{expensiveStation.name}</b> is charging{' '}
                      <b className="font-heading text-red-600">
                        ₹{expensiveStation.pricePerKwh.toFixed(2)}/kWh
                      </b>.
                    </>
                  ) : (
                    'No nearby high-price station data is available.'
                  )}
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Nearby station price alert
                </div>
              </div>

              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag green flex items-center gap-1 w-fit">
                  <TrendingDown className="w-3 h-3" /> Low price nearby
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  {cheapestStation ? (
                    <>
                      <b>{cheapestStation.name}</b> is charging{' '}
                      <b className="font-heading text-emerald-700">
                        ₹{cheapestStation.pricePerKwh.toFixed(2)}/kWh
                      </b>{' '}
                      and has {cheapestStation.availableChargers} slots available.
                    </>
                  ) : (
                    'No nearby low-price station data is available.'
                  )}
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Best nearby price
                </div>
              </div>

              <div className="app-card py-2.5 px-3 bg-white">
                <span className="pill-tag sky flex items-center gap-1 w-fit">
                  <CalendarCheck className="w-3 h-3" /> Booking status
                </span>
                <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                  {bookingStation ? (
                    <>
                      <b>{bookingStation.name}</b> has a confirmed charging slot at{' '}
                      <b>{bookingTime}</b>. You can cancel it from the station details screen.
                    </>
                  ) : (
                    'No active charging slot is booked. Select a station on the map to reserve a time.'
                  )}
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                  Booking update
                </div>
              </div>

              {/* Set Price Alert Target setting section */}
              <div className="app-card mt-2 py-3 px-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    Target Price Alert: ₹{targetPrice.toFixed(2)}/kWh
                  </span>
                  {savedSuccess && (
                    <span className="text-[9.5px] text-emerald-700 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Saved
                    </span>
                  )}
                </div>

                <input
                  type="range"
                  min="5.50"
                  max="9.50"
                  step="0.25"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
                />

                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-medium">
                  <span>₹5.50 (Super cheap)</span>
                  <span>₹9.50 (Normal)</span>
                </div>

                <button
                  onClick={handleSaveTarget}
                  className="app-btn w-full mt-2.5 py-2 text-xs rounded-xl font-bold shadow-xs"
                >
                  Update Alert Target
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNotificationsScreen;
