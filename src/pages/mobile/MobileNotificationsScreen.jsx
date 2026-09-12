import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { Bell, Sliders, Check, TrendingDown, TrendingUp, CalendarCheck } from 'lucide-react';
import { useStations } from '../../context/StationContext';

export const MobileNotificationsScreen = () => {
  const navigate = useNavigate();
  const { stations } = useStations();
  const [targetPrice, setTargetPrice] = useState(7.00);
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

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Notifications" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 11 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          <div className="app-card py-2.5 px-3 bg-white">
            <span className="pill-tag amber flex items-center gap-1 w-fit"><TrendingUp className="w-3 h-3" /> High price nearby</span>
            <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
              {expensiveStation ? <><b>{expensiveStation.name}</b> is charging <b className="font-heading text-red-600">₹{expensiveStation.pricePerKwh.toFixed(2)}/kWh</b>.</> : 'No nearby high-price station data is available.'}
            </div>
            <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
              Nearby station price alert
            </div>
          </div>

          <div className="app-card py-2.5 px-3 bg-white">
            <span className="pill-tag green flex items-center gap-1 w-fit"><TrendingDown className="w-3 h-3" /> Low price nearby</span>
            <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
              {cheapestStation ? <><b>{cheapestStation.name}</b> is charging <b className="font-heading text-emerald-700">₹{cheapestStation.pricePerKwh.toFixed(2)}/kWh</b> and has {cheapestStation.availableChargers} slots available.</> : 'No nearby low-price station data is available.'}
            </div>
            <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
              Best nearby price
            </div>
          </div>

          <div className="app-card py-2.5 px-3 bg-white">
            <span className="pill-tag sky flex items-center gap-1 w-fit"><CalendarCheck className="w-3 h-3" /> Booking status</span>
            <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
              {bookingStation ? <><b>{bookingStation.name}</b> has a confirmed charging slot at <b>{bookingTime}</b>. You can cancel it from the station details screen.</> : 'No active charging slot is booked. Select a station on the map to reserve a time.'}
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
        </div>
      </div>
    </div>
  );
};

export default MobileNotificationsScreen;
