import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { WhyThisPriceModal } from '../../components/mobile/WhyThisPriceModal';
import { Zap, MapPin, ShieldCheck, Clock, HelpCircle } from 'lucide-react';

export const MobileStationDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showWhyPrice, setShowWhyPrice] = useState(false);

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Station Details" onBack={() => navigate('/map')} />

        {/* Content Container matching Screen 05 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Station Visual Banner matching attachment */}
          <div
            className="relative h-[78px] rounded-[16px] overflow-hidden flex items-center justify-between px-4 border border-green-200"
            style={{
              background: 'linear-gradient(120deg, #DCFCE7, #F0FDF4)',
            }}
          >
            <div className="z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-[9.5px] font-heading font-bold border border-emerald-300">
                Verified Green
              </span>
              <div className="text-[11.5px] text-emerald-950 font-heading font-extrabold mt-1">
                Solar Canopy + Battery Storage
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-200/60 flex items-center justify-center text-emerald-800">
              <Zap className="w-7 h-7" />
            </div>
          </div>

          {/* Station Title & Location matching attachment */}
          <div>
            <h2 className="font-heading font-extrabold text-[18px] text-slate-900">
              GreenHub Station
            </h2>
            <div className="text-[11px] text-slate-500 -mt-0.5">
              Ahmedabad, Gujarat · 1.8 km
            </div>
          </div>

          {/* Renewable Pill matching attachment */}
          <div>
            <span className="pill-tag green">
              ☀ 90% renewable now
            </span>
          </div>

          {/* Speed / Available / Price Stats Row matching attachment */}
          <div className="grid grid-cols-3 gap-2">
            <div className="app-card text-center py-2 px-1">
              <div className="text-[9px] text-slate-500 font-medium">Speed</div>
              <b className="font-heading text-[12px] text-slate-900">Fast DC</b>
            </div>

            <div className="app-card text-center py-2 px-1">
              <div className="text-[9px] text-slate-500 font-medium">Available</div>
              <b className="font-heading text-[12px] text-slate-900">4 / 6</b>
            </div>

            <div className="app-card text-center py-2 px-1">
              <div className="text-[9px] text-slate-500 font-medium">Price</div>
              <b className="font-heading text-[12px] text-emerald-700 font-bold">₹8.40</b>
            </div>
          </div>

          {/* Why this price trigger card */}
          <button
            onClick={() => setShowWhyPrice(true)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-green-200 text-xs font-heading font-bold text-emerald-800 text-left hover:bg-green-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              Why is charging ₹8.40/kWh?
            </span>
            <span className="text-[11px] text-slate-500 font-normal">View breakdown ›</span>
          </button>

          {/* Connector Specs */}
          <div className="app-card text-xs space-y-1.5 py-2.5">
            <div className="text-[10px] text-slate-700 font-heading font-semibold">
              Supported Connectors & Amenities:
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200">
                CCS2 (60 kW)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200">
                Type 2 (22 kW)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200">
                AC Lounge & WiFi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Now Primary Action Button matching attachment */}
      <div className="p-4 pt-0">
        <button
          onClick={() => navigate('/charging')}
          className="app-btn w-full text-sm font-bold shadow-md"
        >
          Book Now
        </button>
      </div>

      {/* Why This Price Modal (Screen 06) */}
      <WhyThisPriceModal
        isOpen={showWhyPrice}
        onClose={() => setShowWhyPrice(false)}
        price={8.40}
      />
    </div>
  );
};

export default MobileStationDetailsScreen;
