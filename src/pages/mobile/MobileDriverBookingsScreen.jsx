import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { useAuth } from '../../context/AuthContext';
import { useStations } from '../../context/StationContext';
import { useVehicles } from '../../context/VehicleContext';
import { bookingApi } from '../../api/bookingApi';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  Zap,
  MapPin,
  Building2,
  Car,
  Navigation,
  ExternalLink,
  Plus,
  RefreshCw,
  Trash2,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';

export const MobileDriverBookingsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stations } = useStations();
  const { primaryVehicle, vehicles } = useVehicles();

  const activeVehicle = primaryVehicle || vehicles?.[0] || {
    name: 'Tata Nexon EV',
    plateNumber: 'GJ 01 EV 4821',
  };

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'accepted' | 'rejected'
  const [toastMsg, setToastMsg] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);

  // New Booking Modal Form State
  const [selectedStationId, setSelectedStationId] = useState(stations?.[0]?.id || 'st-01');
  const [selectedSlotTime, setSelectedSlotTime] = useState('11:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Fetch Driver's Bookings from backend SQLite + LocalStorage fallback
  const loadBookings = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      // 1. Fetch from SQLite backend
      const list = await bookingApi.getBookings({
        driverEmail: user?.email || '',
        timeRange: 'all',
      });

      // 2. Also check localStorage for any pending local keys
      const localBookings = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('egc_booking_obj_')) {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            if (val && val.slotTime) {
              localBookings.push(val);
            }
          }
        }
      } catch {
        // ignore
      }

      // Merge backend and local list (avoiding duplicate IDs)
      const mergedMap = new Map();
      (list || []).forEach((b) => mergedMap.set(b.id || `${b.stationId}-${b.slotTime}`, b));
      localBookings.forEach((b) => {
        const key = b.id || `${b.stationId}-${b.slotTime}`;
        if (!mergedMap.has(key)) {
          mergedMap.set(key, b);
        }
      });

      const mergedList = Array.from(mergedMap.values());
      // Sort: pending first, then accepted, then rejected
      mergedList.sort((a, b) => {
        const rank = (s) => (s === 'pending' ? 0 : s === 'accepted' ? 1 : 2);
        return rank(a.status) - rank(b.status);
      });

      setBookings(mergedList);
    } catch (err) {
      console.warn('Error loading driver bookings:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Real-time polling every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      loadBookings(true);
    }, 3500);
    return () => clearInterval(timer);
  }, [loadBookings]);

  // Handle Cancel / Withdraw Booking Request
  const handleCancelBooking = async (booking) => {
    try {
      if (booking.stationId) {
        localStorage.removeItem(`egc_booking_obj_${booking.stationId}`);
        localStorage.removeItem(`egc_booking_${booking.stationId}`);
      }
      // Optimistic remove
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      triggerToast('Slot request cancelled');
    } catch {
      // fallback
    }
  };

  // Submit New Slot Booking Request (Dispatched to Station Operator)
  const handleCreateBooking = async () => {
    setIsSubmitting(true);
    const targetStation = stations.find((s) => s.id === selectedStationId) || stations[0];
    const company = targetStation?.network || targetStation?.companyName || 'Tata Power';
    const price = targetStation?.pricePerKwh || 8.40;

    const newBookingData = {
      driverName: user?.name || 'EV Driver',
      driverEmail: user?.email || 'driver@evcharge.in',
      driverPhone: user?.phone || '+91 98250 12345',
      vehicleModel: activeVehicle?.name || 'Tata Nexon EV',
      vehiclePlate: activeVehicle?.plateNumber || 'GJ 01 EV 4821',
      companyName: company,
      stationId: targetStation?.id || 'st-01',
      stationName: targetStation?.name || 'GreenHub Solar Supercharger',
      slotTime: selectedSlotTime,
      slotDate: new Date().toISOString().split('T')[0],
      targetKwh: 25.0,
      estimatedPrice: price,
      bayNumber: 'Bay 02',
    };

    // Save optimistically to localStorage
    const optimisticBooking = {
      ...newBookingData,
      id: `local-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`egc_booking_obj_${targetStation?.id}`, JSON.stringify(optimisticBooking));
    localStorage.setItem(`egc_booking_${targetStation?.id}`, selectedSlotTime);

    setBookings((prev) => [optimisticBooking, ...prev]);
    setShowBookModal(false);
    triggerToast('⏳ Request sent! Dispatched to Station Operator');

    // Post to backend SQLite
    const res = await bookingApi.createBooking(newBookingData);
    if (res?.booking?.id) {
      const persisted = { ...optimisticBooking, id: res.booking.id };
      localStorage.setItem(`egc_booking_obj_${targetStation?.id}`, JSON.stringify(persisted));
      setBookings((prev) => prev.map((b) => (b.id === optimisticBooking.id ? persisted : b)));
    }
    setIsSubmitting(false);
  };

  // Filtered List
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return (b.status || 'pending').toLowerCase() === statusFilter;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const acceptedCount = bookings.filter((b) => b.status === 'accepted').length;
  const rejectedCount = bookings.filter((b) => b.status === 'rejected').length;

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none relative">
      {/* Toast feedback */}
      {toastMsg && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 bg-slate-900/95 text-white text-[11px] rounded-full shadow-lg font-heading font-medium animate-fade-in backdrop-blur-xs flex items-center gap-1.5 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Book Slot & Requests" onBack={() => navigate('/')} />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Header Action Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white shadow-xs border border-emerald-600/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-mono text-emerald-300 font-bold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Real-Time Slot Reservations</span>
              </div>
              <h3 className="font-heading font-extrabold text-[14px] mt-0.5 text-white">
                Driver Slot Requests
              </h3>
              <p className="text-[10px] text-emerald-100/90 mt-0.5">
                Sent directly to station operators for instant approval
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowBookModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-heading font-extrabold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Book Slot</span>
            </button>
          </div>

          {/* Quick Metrics Counter Row */}
          <div className="grid grid-cols-3 gap-2">
            <div
              onClick={() => setStatusFilter('pending')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950 hover:bg-amber-100/60'
              }`}
            >
              <span className={`text-[8.5px] uppercase font-bold block ${statusFilter === 'pending' ? 'text-amber-100' : 'text-amber-700'}`}>
                Pending
              </span>
              <b className="font-heading text-[15px]">{pendingCount}</b>
            </div>

            <div
              onClick={() => setStatusFilter('accepted')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                statusFilter === 'accepted'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <span className={`text-[8.5px] uppercase font-bold block ${statusFilter === 'accepted' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                Approved
              </span>
              <b className="font-heading text-[15px]">{acceptedCount}</b>
            </div>

            <div
              onClick={() => setStatusFilter('rejected')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                statusFilter === 'rejected'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950 hover:bg-rose-100/60'
              }`}
            >
              <span className={`text-[8.5px] uppercase font-bold block ${statusFilter === 'rejected' ? 'text-rose-100' : 'text-rose-700'}`}>
                Declined
              </span>
              <b className="font-heading text-[15px]">{rejectedCount}</b>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {[
              { id: 'all', label: `All Requests (${bookings.length})` },
              { id: 'pending', label: `⏳ Pending (${pendingCount})` },
              { id: 'accepted', label: `🟢 Approved (${acceptedCount})` },
              { id: 'rejected', label: `🔴 Declined (${rejectedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`text-[10.5px] font-heading font-bold px-2.5 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-emerald-800 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-xs font-heading font-medium">Syncing slot bookings...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 mb-2">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-slate-800 text-sm">
                No {statusFilter !== 'all' ? statusFilter : ''} Slot Requests Found
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                Book a charging slot in advance to skip queues and get guaranteed power.
              </p>
              <button
                type="button"
                onClick={() => setShowBookModal(true)}
                className="mt-3 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-heading font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Book a Charging Slot
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredBookings.map((b) => {
                const isPending = (b.status || 'pending').toLowerCase() === 'pending';
                const isAccepted = (b.status || '').toLowerCase() === 'accepted';
                const isRejected = (b.status || '').toLowerCase() === 'rejected';

                return (
                  <div
                    key={b.id || `${b.stationId}-${b.slotTime}`}
                    className={`rounded-2xl border p-3 shadow-xs transition-all animate-slide-up ${
                      isPending
                        ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400'
                        : isAccepted
                        ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-400 shadow-sm'
                        : 'bg-rose-50/70 border-rose-300'
                    }`}
                  >
                    {/* Header Row: Station & Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-white border border-slate-200 font-bold text-slate-700">
                            {b.companyName || 'Tata Power'}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {b.slotDate || 'Today'}
                          </span>
                        </div>
                        <h4 className="font-heading font-extrabold text-[13.5px] text-slate-900 mt-0.5 truncate">
                          {b.stationName || 'GreenHub Station'}
                        </h4>
                      </div>

                      {/* Status Tag */}
                      <div className="shrink-0">
                        {isPending && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-heading font-extrabold text-[9px] uppercase tracking-wide flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                            Pending Operator
                          </span>
                        )}
                        {isAccepted && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-heading font-extrabold text-[9px] uppercase tracking-wide flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Slot Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-heading font-extrabold text-[9px] uppercase tracking-wide flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Declined
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Bar: Time, Bay, Rate, Vehicle */}
                    <div className="grid grid-cols-3 gap-1.5 mt-2.5 text-center text-xs">
                      <div className="bg-white/80 p-1.5 rounded-xl border border-slate-200/80">
                        <span className="text-[8px] text-slate-400 block font-medium">Slot Time</span>
                        <b className="font-heading text-[11px] text-slate-800">{b.slotTime || '11:00 AM'}</b>
                      </div>
                      <div className="bg-white/80 p-1.5 rounded-xl border border-slate-200/80">
                        <span className="text-[8px] text-slate-400 block font-medium">Allocated Bay</span>
                        <b className="font-heading text-[11px] text-emerald-800">{b.bayNumber || 'Bay 02'}</b>
                      </div>
                      <div className="bg-white/80 p-1.5 rounded-xl border border-slate-200/80">
                        <span className="text-[8px] text-slate-400 block font-medium">Tariff Rate</span>
                        <b className="font-heading text-[11px] text-slate-800">₹{(b.estimatedPrice || 8.40).toFixed(2)}/kWh</b>
                      </div>
                    </div>

                    {/* Status Feedback Notes */}
                    <div className="mt-2 text-[10px] p-2 rounded-xl border leading-snug">
                      {isPending && (
                        <div className="text-amber-900 bg-amber-100/60 p-1.5 rounded-lg border border-amber-200/60">
                          ⏳ Your slot request is queued with <b>{b.companyName || 'Tata Power'}</b> station operator in real-time. You will receive immediate notification once approved.
                        </div>
                      )}
                      {isAccepted && (
                        <div className="text-emerald-900 bg-emerald-100/70 p-1.5 rounded-lg border border-emerald-200/70">
                          {b.operatorNotes || `Confirmed by Operator. Allocated to ${b.bayNumber || 'Bay 02'} (Fast DC 60kW). Ready to plug in!`}
                        </div>
                      )}
                      {isRejected && (
                        <div className="text-rose-900 bg-rose-100/60 p-1.5 rounded-lg border border-rose-200/60">
                          {b.operatorNotes || 'Slot is currently unavailable due to peak grid scheduling. Please select another time.'}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-2.5 flex items-center gap-2">
                      {isAccepted && (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate('/charging')}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Start Charging Now</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=23.1884,72.6289&travelmode=driving`;
                              window.open(mapsUrl, '_blank');
                            }}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                            title="Directions"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {isPending && (
                        <>
                          <button
                            type="button"
                            disabled
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-200 text-amber-900 font-heading font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-amber-300"
                          >
                            <Hourglass className="w-3.5 h-3.5 animate-spin" />
                            <span>Awaiting Station Operator...</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCancelBooking(b)}
                            className="py-2 px-3 rounded-xl bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 font-heading font-bold text-xs cursor-pointer active:scale-95 transition-all"
                          >
                            Withdraw
                          </button>
                        </>
                      )}

                      {isRejected && (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowBookModal(true)}
                            className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-heading font-bold text-xs active:scale-95 transition-all cursor-pointer"
                          >
                            Book Alternate Slot
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCancelBooking(b)}
                            className="p-2 rounded-xl bg-white text-slate-400 hover:text-rose-600 border border-slate-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK BOOK NEW SLOT MODAL */}
      {/* ========================================================================= */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="bg-white w-full max-w-sm rounded-3xl p-4 shadow-2xl border border-green-200 animate-slide-up flex flex-col gap-3">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-slate-900">
                    Reserve Charging Slot
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Direct real-time operator queue
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Select EV Charging Station */}
            <div>
              <label className="text-[10.5px] font-heading font-bold text-slate-700 block mb-1">
                Choose Charging Station:
              </label>
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="app-field w-full text-xs py-2 bg-slate-50 border border-green-200 text-slate-900 font-medium"
              >
                {stations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.network || 'Tata Power'} · ₹{(st.pricePerKwh || 8.40).toFixed(2)}/kWh)
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Choose Time Slot */}
            <div>
              <label className="text-[10.5px] font-heading font-bold text-slate-700 block mb-1">
                Choose Charging Time:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['10:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlotTime(slot)}
                    className={`py-2 rounded-xl text-[10px] font-heading font-bold border transition-all cursor-pointer ${
                      selectedSlotTime === slot
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-green-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Vehicle Info Card */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-700" />
                <div>
                  <div className="font-heading font-bold text-[11px] text-slate-900">{activeVehicle.name}</div>
                  <div className="text-[9.5px] text-slate-500 font-mono">{activeVehicle.plateNumber}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                Fast CCS2
              </span>
            </div>

            {/* Submit Request Button */}
            <button
              type="button"
              onClick={handleCreateBooking}
              disabled={isSubmitting}
              className="app-btn w-full text-xs font-extrabold py-2.5 shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-1"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting to Operator...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Send Request to Station Operator</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar Navigation */}
      <MobileBottomBar />
    </div>
  );
};

export default MobileDriverBookingsScreen;
