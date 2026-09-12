import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { StationCard } from '../map/StationCard';
import { STATIONS_DATA } from '../../utils/mockData';

export const NearbyStationsPreview = () => {
  const previewStations = STATIONS_DATA.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink dark:text-white leading-tight">
            Charging Around You
          </h2>
          <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
            Real-time open chargers in Gandhinagar &amp; Ahmedabad
          </p>
        </div>
        <Link
          to="/map"
          className="flex items-center gap-1 text-xs font-heading font-semibold text-forest dark:text-emerald-400 hover:underline"
        >
          <span>View all ({STATIONS_DATA.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {previewStations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
};
