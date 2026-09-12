import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { Bell, Sliders, Check } from 'lucide-react';

export const MobileNotificationsScreen = () => {
  const navigate = useNavigate();
  const [targetPrice, setTargetPrice] = useState(7.00);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
          {/* Card 1: Price drop alert matching attachment */}
          <div className="app-card py-2.5 px-3 bg-white">
            <span className="pill-tag amber">
              Price drop alert
            </span>
            <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
              Charging price dropped to <b className="font-heading text-emerald-700">₹6.90/kWh</b>, near your target of ₹{targetPrice.toFixed(2)}.
            </div>
            <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
              2 hours ago
            </div>
          </div>

          {/* Card 2: Best time tonight matching attachment */}
          <div className="app-card py-2.5 px-3 bg-white">
            <span className="pill-tag green">
              Best time tonight
            </span>
            <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
              High renewable availability expected <b>10 PM – 12 AM</b> with 84% wind generation.
            </div>
            <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
              5 hours ago
            </div>
          </div>

          {/* Card 3: Booking confirmed matching attachment */}
          <div className="app-card py-2.5 px-3 bg-white">
            <span className="pill-tag sky">
              Booking confirmed
            </span>
            <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
              Your slot at <b>GreenHub Station (Bay 03)</b> is confirmed.
            </div>
            <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
              10 hours ago
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
