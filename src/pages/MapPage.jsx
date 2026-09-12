import React, { useState, useMemo } from 'react';
import { useStations } from '../context/StationContext';
import { useAuth } from '../context/AuthContext';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { MapFilters } from '../components/map/MapFilters';
import { StationCard } from '../components/map/StationCard';
import { FloatingAiButton } from '../components/common/FloatingAiButton';
import { Search, Map as MapIcon, List, Crosshair, X, Navigation, Zap, Hospital } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const MapPage = () => {
  const { stations, hospitals, loading, selectedStation, setSelectedStation } = useStations();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'

  const initialNetwork = searchParams.get('network') || 'all';
  const [selectedNetwork, setSelectedNetwork] = useState(initialNetwork);

  // Filter logic
  const filteredStations = useMemo(() => {
    let list = [...stations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.network.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
      );
    }

    if (selectedNetwork !== 'all') {
      list = list.filter((s) => s.networkId === selectedNetwork);
    }

    if (activeFilterTab === 'chargers') {
      // Show only EV stations
    } else if (activeFilterTab === 'hospitals') {
      // Filter stations near hospital
      list = list.filter((s) => s.isHospitalNearby);
    } else if (activeFilterTab === 'fast') {
      list = list.filter((s) => s.isFast || s.powerKw >= 50);
    } else if (activeFilterTab === 'available') {
      list = list.filter((s) => s.availableChargers > 0);
    } else if (activeFilterTab === 'low_cost') {
      list = list.filter((s) => s.pricePerKwh <= 7.80);
    } else    if (activeFilterTab === 'green') {
      list = list.filter((s) => s.renewablePct >= 80);
    } else if (activeFilterTab === 'near_hospitals') {
      list = list.filter((s) => s.isHospitalNearby);
    }

    return list;
  }, [stations, searchQuery, selectedNetwork, activeFilterTab]);

  // Calculate top recommended station based on price and distance
  const topRecommended = useMemo(() => {
    if (!stations.length) return null;
    return [...stations].sort((a, b) => {
      const distA = a.distanceKm || 2.5;
      const distB = b.distanceKm || 2.5;
      const priceA = a.pricePerKwh || 8.4;
      const priceB = b.pricePerKwh || 8.4;
      const scoreA = (40 - distA * 4) + ((12 - priceA) / 6) * 40 + (a.availableChargers > 0 ? 15 : 0);
      const scoreB = (40 - distB * 4) + ((12 - priceB) / 6) * 40 + (b.availableChargers > 0 ? 15 : 0);
      return scoreB - scoreA;
    })[0];
  }, [stations]);

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-4">
        
        {/* Top Search Bar & View Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft dark:text-ink-muted" />
            <input
              type="text"
              placeholder="Search station, network, area or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-4 rounded-2xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium placeholder:text-ink-soft/70 focus:outline-none focus:border-forest"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Map / List View Toggle */}
          <div className="flex bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-2xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('map')}
              className={`min-h-[38px] px-3 rounded-xl font-heading text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`min-h-[38px] px-3 rounded-xl font-heading text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List ({filteredStations.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Chips (All, EV Chargers, Hospitals, Fast Chargers, Available Now, Low Cost, Green Energy, Near Hospitals) */}
        <MapFilters
          activeTab={activeFilterTab}
          onTabChange={setActiveFilterTab}
          activeNetwork={selectedNetwork}
          onNetworkChange={setSelectedNetwork}
        />

        {/* Map View */}
        {viewMode === 'map' ? (
          <div className="space-y-4">
            <InteractiveMap
              stations={filteredStations}
              hospitals={hospitals}
              selectedStation={selectedStation}
              recommendedStationId={topRecommended?.id}
              onSelectStation={(st) => setSelectedStation(st)}
              userLocation={{
                lat: user?.latitude || 23.1884,
                lng: user?.longitude || 72.6289,
                label: `${user?.city || 'Gandhinagar'} (You)`
              }}
            />

            {/* Selected Station Bottom Sheet / Preview Drawer */}
            {selectedStation ? (
              <div className="relative animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-heading font-semibold uppercase text-forest dark:text-emerald-400">
                    Selected Station
                  </span>
                  <button
                    onClick={() => setSelectedStation(null)}
                    className="text-xs text-ink-soft hover:text-forest flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear selection</span>
                  </button>
                </div>
                <StationCard station={selectedStation} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStations.slice(0, 3).map((st) => (
                  <StationCard
                    key={st.id}
                    station={st}
                    onNavigate={() => setSelectedStation(st)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.length > 0 ? (
              filteredStations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white dark:bg-paper-cardDark rounded-3xl border border-forest/10 p-6">
                <Zap className="w-10 h-10 text-ink-soft mx-auto mb-2 opacity-50" />
                <h3 className="font-heading font-bold text-base text-ink dark:text-white">
                  No matching charging stations found
                </h3>
                <p className="text-xs text-ink-soft dark:text-ink-muted mt-1">
                  Try adjusting your filter chips or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilterTab('all');
                    setSelectedNetwork('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-forest text-white text-xs font-heading font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating AI Button */}
      <FloatingAiButton />
    </div>
  );
};
