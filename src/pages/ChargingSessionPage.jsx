import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStations } from '../context/StationContext';
import { useVehicles } from '../context/VehicleContext';
import { PriceBadge } from '../components/common/PriceBadge';
import { GreenScoreBadge } from '../components/common/GreenScoreBadge';
import {
  Zap,
  Navigation,
  Sun,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  StopCircle,
  Play,
  ArrowLeft,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChargingSessionPage = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { stations, activeSession, startChargingSession, stopChargingSession, setActiveSession } = useStations();
  const { primaryVehicle, updateVehicle } = useVehicles();

  const station = stations.find((s) => s.id === stationId) || stations[0];

  // Charging simulator local state
  const [isCharging, setIsCharging] = useState(false);
  const [currentPct, setCurrentPct] = useState(primaryVehicle?.currentBatteryPct || 30);
  const [deliveredKwh, setDeliveredKwh] = useState(0.0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isCharging) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setDeliveredKwh((prev) => Number((prev + 0.15).toFixed(2)));
        setCurrentPct((prev) => {
          if (prev >= 85) {
            setIsCharging(false);
            confetti();
            setShowSummary(true);
            return 85;
          }
          return Number((prev + 0.4).toFixed(1));
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCharging]);

  const handleStartCharge = () => {
    setIsCharging(true);
    setShowSummary(false);
    startChargingSession(station, primaryVehicle);
  };

  const handleStopCharge = () => {
    setIsCharging(false);
    setShowSummary(true);
    confetti();
    if (primaryVehicle) {
      updateVehicle(primaryVehicle.id, { currentBatteryPct: Math.round(currentPct) });
    }
    stopChargingSession();
  };

  const runningCost = (deliveredKwh * station.pricePerKwh).toFixed(2);
  const co2Avoided = (deliveredKwh * 0.82 * (station.renewablePct / 100)).toFixed(1);

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">

        {/* Top Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-forest/15 dark:border-white/10 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-ink-soft dark:text-ink-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-heading font-semibold uppercase text-forest dark:text-emerald-400">
              {isCharging ? '⚡ Active Charging Session' : 'Station Details'}
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest dark:text-white">
              {station.name}
            </h1>
          </div>
        </div>

        {/* ACTIVE CHARGING SESSION CARD (Screen 8) */}
        {isCharging ? (
          <div className="bg-white dark:bg-paper-cardDark border-2 border-forest dark:border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-elevated text-center space-y-6 animate-pulse-slow">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-white text-xs font-heading font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Charging in Progress • {station.powerKw} kW DC</span>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex justify-center my-4">
              <div
                className="relative w-44 h-44 rounded-full flex items-center justify-center p-3 shadow-glow-green"
                style={{
                  background: `conic-gradient(var(--leaf, #3FA66B) ${currentPct}%, rgba(15,61,46,0.12) 0)`
                }}
              >
                <div className="w-36 h-36 rounded-full bg-white dark:bg-paper-cardDark flex flex-col items-center justify-center">
                  <span className="font-heading font-bold text-4xl text-forest dark:text-emerald-400 leading-none">
                    {Math.round(currentPct)}%
                  </span>
                  <span className="text-xs text-ink-soft dark:text-ink-muted font-heading font-semibold uppercase mt-1">
                    Charged
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                  </span>
                </div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5">
                <span className="text-[10px] text-ink-soft dark:text-ink-muted uppercase font-heading">Energy Delivered</span>
                <b className="font-heading text-base text-ink dark:text-white block mt-0.5">{deliveredKwh} kWh</b>
              </div>

              <div className="p-3 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5">
                <span className="text-[10px] text-ink-soft dark:text-ink-muted uppercase font-heading">Live Tariff</span>
                <b className="font-heading text-base text-forest dark:text-emerald-400 block mt-0.5">₹{station.pricePerKwh.toFixed(2)}/kWh</b>
              </div>

              <div className="p-3 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5">
                <span className="text-[10px] text-ink-soft dark:text-ink-muted uppercase font-heading">Running Cost</span>
                <b className="font-heading text-base text-forest dark:text-emerald-400 block mt-0.5">₹{runningCost}</b>
              </div>

              <div className="p-3 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5">
                <span className="text-[10px] text-ink-soft dark:text-ink-muted uppercase font-heading">CO₂ Avoided</span>
                <b className="font-heading text-base text-emerald-600 dark:text-emerald-400 block mt-0.5">{co2Avoided} kg</b>
              </div>
            </div>

            {/* Stop Charging Button */}
            <button
              onClick={handleStopCharge}
              className="w-full min-h-[48px] py-3 rounded-2xl border-2 border-coal text-coal hover:bg-coal-light font-heading font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <StopCircle className="w-5 h-5" />
              <span>Stop Charging</span>
            </button>
          </div>
        ) : showSummary ? (
          /* POST SESSION SUMMARY MODAL */
          <div className="bg-white dark:bg-paper-cardDark border border-forest/20 rounded-3xl p-6 sm:p-8 shadow-elevated space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-heading font-semibold text-emerald-600 uppercase">
                  Session Completed Successfully
                </span>
                <h2 className="font-heading font-bold text-xl text-ink dark:text-white">
                  Green Charging Impact Summary
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft dark:text-ink-muted">Station:</span>
                <b className="font-heading text-ink dark:text-white">{station.name}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft dark:text-ink-muted">Energy Delivered:</span>
                <b className="font-heading text-forest dark:text-emerald-400">{deliveredKwh} kWh</b>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft dark:text-ink-muted">Total Cost Paid:</span>
                <b className="font-heading text-ink dark:text-white">₹{runningCost} (@ ₹{station.pricePerKwh}/kWh)</b>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft dark:text-ink-muted">Renewable Energy Share:</span>
                <b className="font-heading text-emerald-600 dark:text-emerald-400">{station.renewablePct}% Clean</b>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft dark:text-ink-muted">CO₂ Avoided:</span>
                <b className="font-heading text-emerald-600 dark:text-emerald-400">{co2Avoided} kg</b>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/activity')}
                className="min-h-[44px] py-2.5 px-4 rounded-xl border border-forest/20 text-forest dark:text-emerald-400 font-heading font-semibold text-xs text-center"
              >
                View in Activity
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="min-h-[44px] py-2.5 px-4 rounded-xl bg-forest text-white font-heading font-semibold text-xs text-center"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* STATION DETAILS CARD */
          <div className="space-y-6">
            <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-heading font-semibold text-forest-600 dark:text-emerald-400">
                    {station.network} • {station.distanceKm} km away
                  </span>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-ink dark:text-white mt-0.5">
                    {station.name}
                  </h2>
                  <p className="text-xs text-ink-soft dark:text-ink-muted mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {station.address}
                  </p>
                </div>
                <PriceBadge price={station.pricePerKwh} size="sm" priceType={station.priceType} />
              </div>

              {/* Station Specs Pill Grid */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 text-center">
                <div>
                  <span className="text-[10px] uppercase font-heading text-ink-soft dark:text-ink-muted">Charging Speed</span>
                  <b className="font-heading text-sm text-ink dark:text-white block mt-0.5">{station.powerKw} kW DC</b>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-heading text-ink-soft dark:text-ink-muted">Available Bays</span>
                  <b className="font-heading text-sm text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {station.availableChargers} / {station.totalChargers}
                  </b>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-heading text-ink-soft dark:text-ink-muted">Green Score</span>
                  <b className="font-heading text-sm text-forest dark:text-emerald-400 block mt-0.5">
                    {station.greenScore}/100
                  </b>
                </div>
              </div>

              {/* Connectors & Opening Status */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-forest/10 dark:border-white/5">
                  <span className="text-ink-soft dark:text-ink-muted">Supported Connectors:</span>
                  <b className="text-ink dark:text-white font-heading">{station.connectors.join(', ')}</b>
                </div>
                <div className="flex justify-between py-1.5 border-b border-forest/10 dark:border-white/5">
                  <span className="text-ink-soft dark:text-ink-muted">Renewable Power Mix:</span>
                  <b className="text-forest dark:text-emerald-400 font-heading">{station.renewablePct}% Solar + Wind</b>
                </div>
                <div className="flex justify-between py-1.5 border-b border-forest/10 dark:border-white/5">
                  <span className="text-ink-soft dark:text-ink-muted">Operating Status:</span>
                  <b className="text-ink dark:text-white font-heading">{station.openingStatus}</b>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-ink-soft dark:text-ink-muted">Telemetry Status:</span>
                  <b className="text-emerald-600 dark:text-emerald-400 font-heading">Verified live ({station.lastUpdated})</b>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <span className="text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted block mb-2">
                  Station Amenities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {station.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-forest-50 dark:bg-forest-950/50 text-forest dark:text-emerald-300 text-[11px] font-medium border border-forest/10"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Navigate & Start Charging */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[48px] py-2.5 px-4 rounded-2xl border border-forest/20 text-forest dark:text-emerald-400 font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-forest-50 dark:hover:bg-forest-950/40"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Navigate</span>
                </a>

                <button
                  onClick={handleStartCharge}
                  className="min-h-[48px] py-2.5 px-4 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-soft transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-emerald-300" />
                  <span>Start Charging</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
