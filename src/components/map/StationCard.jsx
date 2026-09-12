import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Navigation, ArrowRight, Sun, ShieldCheck, MapPin, Plus } from 'lucide-react';
import { PriceBadge } from '../common/PriceBadge';
import { GreenScoreBadge } from '../common/GreenScoreBadge';

export const StationCard = ({ station, onNavigate, isCompact = false }) => {
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/charging/${station.id}`);
  };

  const handleNav = (e) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(station);
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div
      onClick={handleDetails}
      className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Network, Availability, Price Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-semibold text-forest-600 dark:text-emerald-300">
                {station.network}
              </span>
              <span className="text-[11px] text-ink-soft dark:text-ink-muted">
                • {station.distanceKm} km away
              </span>
            </div>
            <h3 className="font-heading font-bold text-base text-ink dark:text-white mt-0.5 group-hover:text-forest dark:group-hover:text-emerald-400 transition-colors leading-snug">
              {station.name}
            </h3>
          </div>
          <PriceBadge price={station.pricePerKwh} size="xs" priceType={station.priceType} />
        </div>

        {/* Address and Hospital alert if applicable */}
        <p className="text-xs text-ink-soft dark:text-ink-muted line-clamp-1 mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-ink-soft shrink-0" />
          {station.address}
        </p>

        {station.isHospitalNearby && station.nearbyHospital && (
          <div className="mb-3 px-2 py-1 rounded-lg bg-sky-light/60 dark:bg-sky-950/40 text-sky-dark dark:text-sky-300 text-[10.5px] font-medium flex items-center gap-1.5 border border-sky/15">
            <span className="w-4 h-4 rounded-full bg-sky text-white flex items-center justify-center text-[10px] font-bold">✚</span>
            <span className="truncate">Near {station.nearbyHospital}</span>
          </div>
        )}

        {/* Specs Pill Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 mb-3 text-center">
          <div>
            <span className="text-[9.5px] text-ink-soft dark:text-ink-muted uppercase font-heading block">Speed</span>
            <b className="font-heading text-xs text-ink dark:text-white">{station.powerKw} kW DC</b>
          </div>
          <div>
            <span className="text-[9.5px] text-ink-soft dark:text-ink-muted uppercase font-heading block">Available</span>
            <b className={`font-heading text-xs ${station.availableChargers > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-coal'}`}>
              {station.availableChargers} / {station.totalChargers}
            </b>
          </div>
          <div>
            <span className="text-[9.5px] text-ink-soft dark:text-ink-muted uppercase font-heading block">Price</span>
            <b className="font-heading text-xs text-forest dark:text-emerald-400">₹{station.pricePerKwh.toFixed(2)}</b>
          </div>
        </div>

        {/* Renewable & Connectors */}
        <div className="flex items-center justify-between text-xs text-ink-soft dark:text-ink-muted mb-4">
          <div className="flex items-center gap-1 text-forest-600 dark:text-emerald-400 font-semibold font-heading text-[11px]">
            <Sun className="w-3.5 h-3.5 text-amber" />
            <span>{station.renewablePct}% Renewable</span>
          </div>
          <GreenScoreBadge score={station.greenScore} size="sm" showLabel={false} />
        </div>
      </div>

      {/* Buttons: Navigate & View Details (Touch target >= 44px) */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-forest/10 dark:border-white/5">
        <button
          onClick={handleNav}
          className="min-h-[44px] py-2 px-3 rounded-xl border border-forest/20 dark:border-white/10 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-forest dark:text-emerald-400 font-heading font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Navigate</span>
        </button>

        <button
          onClick={handleDetails}
          className="min-h-[44px] py-2 px-3 rounded-xl bg-forest hover:bg-forest-600 text-white font-heading font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
