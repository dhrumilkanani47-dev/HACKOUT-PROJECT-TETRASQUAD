import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import { Plus, Car, Zap, BatteryCharging, ShieldCheck } from 'lucide-react';

export const VehiclesPage = () => {
  const { vehicles, loading, setPrimaryVehicle } = useVehicles();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest/10 dark:border-white/10 pb-4">
          <div>
            <span className="text-xs font-heading font-semibold uppercase text-forest dark:text-emerald-400">
              Vehicle Garage
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest dark:text-white">
              My Electric Vehicles
            </h1>
            <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
              Manage your connected electric cars, SUVs &amp; two-wheelers for automated charge optimization.
            </p>
          </div>

          <Link
            to="/vehicles/add"
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-soft transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </Link>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                isPrimary={v.isPrimary}
                onSetPrimary={setPrimaryVehicle}
              />
            ))}
          </div>
        )}

        {/* Quick Add Banner if user has few vehicles */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-forest-100 to-forest-50 dark:from-forest-950/60 dark:to-forest-900/40 border border-forest/15 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-ink dark:text-white">
                Support for 2W &amp; 4W EVs across India
              </h3>
              <p className="text-xs text-ink-soft dark:text-ink-muted">
                Tata Nexon/Tiago/Curvv, Mahindra XUV400, MG ZS, Ola S1, Ather 450X, TVS iQube &amp; more.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/vehicles/add')}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-forest text-white font-heading font-semibold text-xs whitespace-nowrap"
          >
            + Add Another EV
          </button>
        </div>
      </div>
    </div>
  );
};
