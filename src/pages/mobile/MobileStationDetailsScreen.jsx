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
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-card dark:bg-[#121815] select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Station Details" onBack={() => navigate('/map')} />

        {/* Content Container matching Screen 05 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Station Visual Banner matching attachment */}
          <div
            className="relative h-[78px] rounded-[16px] overflow-hidden flex items-center justify-between px-4 border border-forest/10 dark:border-white/10"
            style={{
              background: 'linear-gradient(120deg, #DCEBDF, #EEF0E6)',
            }}
          >
            <div className="z-10">
              <span className="px-2 py-0.5 rounded-full bg-forest text-white text-[9.5px] font-heading font-semibold">
                Verified Green
              </span>
              <div className="text-[11px] text-forest font-heading font-bold mt-1">
                Solar Canopy + Battery Storage
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-forest/15 flex items-center justify-center text-forest">
              <Zap className="w-7 h-7" />
            </div>
          </div>

          {/* Station Title & Location matching attachment */}
          <div>
            <h2 className="font-heading font-bold text-[16px] text-forest dark:text-emerald-400">
              GreenHub Station
            </h2>
            <div className="text-[11px] text-ink-soft dark:text-ink-muted -mt-0.5">
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
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Speed</div>
              <b className="font-heading text-[12px] text-ink dark:text-white">Fast DC</b>
            </div>

            <div className="app-card text-center py-2 px-1">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Available</div>
              <b className="font-heading text-[12px] text-ink dark:text-white">4 / 6</b>
            </div>

            <div className="app-card text-center py-2 px-1">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Price</div>
              <b className="font-heading text-[12px] text-forest-600 dark:text-emerald-400">₹8.40</b>
            </div>
          </div>

          {/* Why this price trigger card */}
          <button
            onClick={() => setShowWhyPrice(true)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-paper dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 text-xs font-heading font-semibold text-forest dark:text-emerald-400 text-left hover:border-forest/40 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber" />
              Why is charging ₹8.40/kWh?
            </span>
            <span className="text-[11px] text-ink-soft dark:text-ink-muted">View breakdown ›</span>
          </button>

          {/* Connector Specs */}
          <div className="app-card text-xs space-y-1.5 py-2.5">
            <div className="text-[10px] text-ink-soft dark:text-ink-muted font-heading font-semibold">
              Supported Connectors & Amenities:
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-paper dark:bg-paper-cardDark text-[10px] font-mono border border-line">
                CCS2 (60 kW)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-paper dark:bg-paper-cardDark text-[10px] font-mono border border-line">
                Type 2 (22 kW)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-paper dark:bg-paper-cardDark text-[10px] font-mono border border-line">
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
