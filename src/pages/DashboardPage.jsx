import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';
import { VehicleStatusCard } from '../components/dashboard/VehicleStatusCard';
import { DynamicPriceChart } from '../components/dashboard/DynamicPriceChart';
import { LivePriceWidget } from '../components/home/LivePriceWidget';
import { AiRecommendationCard } from '../components/home/AiRecommendationCard';
import { EnergyMixDonut } from '../components/home/EnergyMixDonut';
import { BestTimeWidget } from '../components/home/BestTimeWidget';
import { OperatorView } from '../components/dashboard/OperatorView';
import { FloatingAiButton } from '../components/common/FloatingAiButton';
import { SkeletonCard, SkeletonChart } from '../components/common/SkeletonLoader';
import { ShieldCheck, UserCheck, Sparkles, MapPin } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { primaryVehicle, loading } = useVehicles();
  const [selectedWhyPrice, setSelectedWhyPrice] = useState(false);

  const isOperator = user?.role === 'operator';

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* Top Header & User Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest/10 dark:border-white/10 pb-4">
          <div>
            <span className="text-xs font-heading font-semibold text-forest dark:text-emerald-400">
              {isOperator ? '⚡ Charge Point Operator Mode' : '🚗 EV Driver Dashboard'}
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest dark:text-white">
              Welcome, {user?.name || 'Driver'} 👋
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-ink-muted mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-forest dark:text-emerald-400" />
              <span>{user?.city || 'Gandhinagar'}, {user?.state || 'Gujarat'} • Real-time SLDC Telemetry</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-forest dark:text-emerald-300 text-xs font-heading font-semibold border border-forest/10 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Grid Normal (50.02 Hz)
            </span>
          </div>
        </div>

        {/* If Operator Mode is active */}
        {isOperator ? (
          <OperatorView />
        ) : (
          /* Driver View */
          <>
            {/* Primary Vehicle Status Card */}
            {loading ? (
              <SkeletonCard />
            ) : (
              <VehicleStatusCard
                vehicle={primaryVehicle}
                greeting="Good morning 👋"
              />
            )}

            {/* AI Recommendation & Live Tariff Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AiRecommendationCard />
              <LivePriceWidget />
            </div>

            {/* 24-Hour Price Graph & Energy Mix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DynamicPriceChart />
              </div>
              <div className="lg:col-span-1">
                <EnergyMixDonut />
              </div>
            </div>

            {/* Smart Charging Optimal Time */}
            <BestTimeWidget />
          </>
        )}
      </div>

      {/* Floating AI Button */}
      <FloatingAiButton />
    </div>
  );
};
