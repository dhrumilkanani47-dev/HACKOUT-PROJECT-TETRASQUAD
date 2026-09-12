import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeroScene } from '../components/3d/HeroScene';
import { LivePriceWidget } from '../components/home/LivePriceWidget';
import { AiRecommendationCard } from '../components/home/AiRecommendationCard';
import { BestTimeWidget } from '../components/home/BestTimeWidget';
import { ChargingNetworks } from '../components/home/ChargingNetworks';
import { EnergyMixDonut } from '../components/home/EnergyMixDonut';
import { GreenScoreExplainer } from '../components/home/GreenScoreExplainer';
import { HowItWorks } from '../components/home/HowItWorks';
import { NearbyStationsPreview } from '../components/home/NearbyStationsPreview';
import { Footer } from '../components/home/Footer';
import { FloatingAiButton } from '../components/common/FloatingAiButton';
import { Zap, Sparkles, MapPin, ArrowRight, ShieldCheck, TrendingDown, Sun } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  const handleSelectNetwork = (networkId) => {
    setSelectedNetwork(networkId);
    navigate(`/map?network=${networkId}`);
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-8">
        
        {/* 1. HERO SECTION: 3D EV Charging Scene */}
        <section className="space-y-4">
          <HeroScene />

          {/* 2. HERO CONTENT & CTA (Section 7) */}
          <div className="text-center max-w-2xl mx-auto py-2 sm:py-4 px-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest dark:text-emerald-300 font-heading text-xs font-semibold mb-3 border border-forest/15">
              <Sparkles className="w-3.5 h-3.5 text-amber" />
              <span>India-First Smart Grid AI Assistant</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-forest dark:text-emerald-400 tracking-tight leading-tight">
              Charge smarter.<br />
              <span className="text-forest-600 dark:text-emerald-300">Charge greener.</span>
            </h1>
            <p className="text-sm sm:text-base text-ink-soft dark:text-ink-muted mt-3 leading-relaxed">
              AI-powered EV charging that helps you find the best time, station and energy mix across India.
            </p>

            {/* Buttons: Find My Best Charge & Explore Stations (Touch target >= 44px) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                onClick={() => navigate('/map')}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-elevated transition-all cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-emerald-300" />
                <span>Find My Best Charge</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/map')}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl border-2 border-forest text-forest dark:text-emerald-400 dark:border-emerald-400/40 hover:bg-forest-50 dark:hover:bg-forest-950/40 font-heading font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Explore Stations</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. CURRENT CHARGING PRICE & AI RECOMMENDATION GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LivePriceWidget />
          <AiRecommendationCard />
        </section>

        {/* 4. BEST TIME TO CHARGE & ENERGY MIX */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BestTimeWidget />
          <EnergyMixDonut />
        </section>

        {/* 5. CHARGING AROUND YOU (Nearby Preview) */}
        <section>
          <NearbyStationsPreview />
        </section>

        {/* 6. CHARGING NETWORKS (Jio-bp, Tata Power, ChargeZone, Statiq, etc.) */}
        <section>
          <ChargingNetworks
            selectedNetwork={selectedNetwork}
            onSelectNetwork={handleSelectNetwork}
          />
        </section>

        {/* 7. GREEN SCORE & HOW IT WORKS */}
        <section className="space-y-6">
          <GreenScoreExplainer score={94} />
          <HowItWorks />
        </section>

        {/* 8. FINAL CLOSING CTA BAND */}
        <section className="relative overflow-hidden bg-gradient-to-br from-forest to-forest-2 text-white rounded-3xl p-8 sm:p-12 text-center shadow-elevated">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="font-heading font-bold text-2xl sm:text-4xl leading-tight">
              Together for a cleaner, greener tomorrow
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              One connected flow — from finding a station to understanding exactly why it costs what it costs.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/signup"
                className="min-h-[44px] px-6 py-3 rounded-xl bg-white text-forest font-heading font-bold text-sm shadow-md hover:bg-forest-50 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/ai"
                className="min-h-[44px] px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-heading font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber" />
                <span>Try GreenCharge AI</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 9. FOOTER */}
        <Footer />
      </div>

      {/* Floating AI Button */}
      <FloatingAiButton />
    </div>
  );
};
