import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../api/bookingApi';
import {
  CalendarCheck,
  Clock,
  Check,
  X,
  AlertCircle,
  Search,
  Building2,
  Car,
  Zap,
  RefreshCw,
  User,
  Phone,
  Mail,
  Info
} from 'lucide-react';

export const MobileOperatorBookingsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Operator's Company
  const registeredCompany = user?.companyName?.trim() || 'Tata Power';

  // State
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0, todayActive: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'accepted' | 'rejected'
  const [timeRange, setTimeRange] = useState('today'); // 'today' | 'yesterday' | 'past7days' | 'all'
  const [toastMsg, setToastMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Fetch Bookings & Stats
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [list, statsData] = await Promise.all([
        bookingApi.getBookings({
          company: registeredCompany,
          status: statusFilter,
          timeRange: timeRange,
          search: searchQuery
        }),
        bookingApi.getStats({ company: registeredCompany })
      ]);

      setBookings(list || []);
      setStats(statsData || { total: 0, pending: 0, accepted: 0, rejected: 0, todayActive: 0 });
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [registeredCompany, statusFilter, timeRange, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time polling every 5 seconds to capture live driver booking requests
  useEffect(() => {
    const timer = setInterval(() => {
      loadData(true);
    }, 5000);
    return () => clearInterval(timer);
  }, [loadData]);

  // Instant 1-Click Accept or Reject Handler
  const handleUpdateStatus = async (booking, newStatus) => {
    setUpdatingId(booking.id);
    const bayNumber = booking.bayNumber || 'Bay 02';
    const notes =
      newStatus === 'accepted'
        ? `Allocated to ${bayNumber} · Fast CCS2 Ready · 90% Verified Solar Mix`
        : 'Slot unavailable due to grid peak management. Please choose alternate solar window.';

    // 1. Optimistic local state update for instant UI feedback
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, status: newStatus, bayNumber, operatorNotes: notes }
          : b
      )
    );

    // Update stats optimistically
    setStats((prev) => {
      const oldStatus = booking.status;
      return {
        ...prev,
        pending: oldStatus === 'pending' ? Math.max(0, prev.pending - 1) : prev.pending,
        accepted: newStatus === 'accepted' ? prev.accepted + (oldStatus !== 'accepted' ? 1 : 0) : (oldStatus === 'accepted' ? Math.max(0, prev.accepted - 1) : prev.accepted),
        rejected: newStatus === 'rejected' ? prev.rejected + (oldStatus !== 'rejected' ? 1 : 0) : (oldStatus === 'rejected' ? Math.max(0, prev.rejected - 1) : prev.rejected),
      };
    });

    triggerToast(
      newStatus === 'accepted'
        ? `✅ Accepted ${booking.driverName}'s booking (${bayNumber})`
        : `❌ Denied ${booking.driverName}'s booking`
    );

    // 2. Call backend in real-time
    try {
      await bookingApi.updateStatus({
        bookingId: booking.id,
        status: newStatus,
        bayNumber: bayNumber,
        operatorNotes: notes,
        operatorName: `${registeredCompany} Station Operator`
      });
    } catch (err) {
      console.error('Error updating status in backend:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-slate-50 select-none relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 bg-slate-900 text-white text-[11px] rounded-full shadow-lg font-heading font-medium animate-fade-in flex items-center gap-1.5 backdrop-blur-xs">
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav
          title="Slot Booking Requests"
          onBack={() => navigate('/operator')}
          rightAction={
            <button
              onClick={() => loadData(true)}
              className={`p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
              title="Refresh Real-Time Requests"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          }
        />

        {/* Content Container */}
        <div className="px-3.5 pt-2 pb-5 flex flex-col gap-2.5">
          {/* Operator Company Header Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-800 text-white shadow-sm border border-emerald-500/30">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-white/20 font-bold backdrop-blur-xs">
                    Operator Dispatch Desk
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-400 text-emerald-950 font-heading font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
                    Live Sync
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-[15.5px] mt-1.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-300" />
                  <span>{registeredCompany}</span>
                </h3>
                <p className="text-[10px] text-emerald-100 mt-0.5">
                  Showing slot requests strictly for <b>{registeredCompany}</b> branches
                </p>
              </div>
            </div>

            {/* Quick Summary Counts Row */}
            <div className="mt-3 pt-2.5 border-t border-white/15 grid grid-cols-4 gap-1.5 text-center">
              <div className="p-1 rounded-lg bg-white/10">
                <div className="text-[8.5px] text-emerald-100">All Total</div>
                <div className="font-heading text-[13px] font-black">{stats.total}</div>
              </div>
              <div className="p-1 rounded-lg bg-amber-400/20 border border-amber-300/30 text-amber-200">
                <div className="text-[8.5px]">Pending</div>
                <div className="font-heading text-[13px] font-black">{stats.pending}</div>
              </div>
              <div className="p-1 rounded-lg bg-emerald-400/20 border border-emerald-300/30 text-emerald-200">
                <div className="text-[8.5px]">Accepted</div>
                <div className="font-heading text-[13px] font-black">{stats.accepted}</div>
              </div>
              <div className="p-1 rounded-lg bg-rose-400/20 border border-rose-300/30 text-rose-200">
                <div className="text-[8.5px]">Rejected</div>
                <div className="font-heading text-[13px] font-black">{stats.rejected}</div>
              </div>
            </div>
          </div>

          {/* Time Horizon Filter (1-Day Queue Policy vs All History) */}
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-heading font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" /> Time Horizon:
              </span>
              <span className="text-[8.5px] text-slate-500 font-medium">
                Auto-clears daily queue · Saved forever in DB
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'today', label: 'Today (Active)' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: 'past7days', label: 'Past 7 Days' },
                { id: 'all', label: 'All History' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id)}
                  className={`py-1 px-1.5 rounded-lg text-[9.5px] font-heading font-bold transition-all ${
                    timeRange === t.id
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Tabs & Real-Time Search Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'all', label: 'All Requests' },
                { id: 'pending', label: '⏳ Pending' },
                { id: 'accepted', label: '✅ Accepted' },
                { id: 'rejected', label: '❌ Denied' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`py-1.5 rounded-xl text-[10px] font-heading font-bold border transition-all ${
                    statusFilter === s.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search driver name, plate #, station branch..."
                className="app-field w-full text-xs pl-8 pr-7 py-2 bg-white border border-slate-200 text-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bookings List Section */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-heading font-bold text-slate-800">
                Incoming Slot Applications ({bookings.length})
              </span>
              <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {registeredCompany} Isolated Fleet
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
                <span>Synchronizing slot applications...</span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-300 text-center text-slate-500 space-y-2">
                <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="font-heading font-bold text-xs text-slate-700">No Applications Found</div>
                <p className="text-[10.5px] text-slate-400 max-w-[240px] mx-auto">
                  {timeRange === 'today'
                    ? "No pending slot requests received today for your company. New requests will notify automatically."
                    : "No historical records match the selected status or date filters."}
                </p>
              </div>
            ) : (
              bookings.map((booking) => {
                const isPending = booking.status === 'pending';
                const isAccepted = booking.status === 'accepted';
                const isRejected = booking.status === 'rejected';
                const isBusy = updatingId === booking.id;

                return (
                  <div
                    key={booking.id}
                    className={`app-card p-3.5 bg-white border transition-all ${
                      isPending
                        ? 'border-amber-300 ring-1 ring-amber-200/60 shadow-xs'
                        : isAccepted
                        ? 'border-emerald-200 hover:border-emerald-300'
                        : 'border-slate-200 opacity-80'
                    }`}
                  >
                    {/* Header Row: Driver & Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading font-bold text-xs ${
                            isPending
                              ? 'bg-amber-100 text-amber-800'
                              : isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-heading font-bold text-[13px] text-slate-900 flex items-center gap-1.5">
                            <span>{booking.driverName}</span>
                            {booking.isToday && (
                              <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                                Today
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" />
                            <span>{booking.driverPhone || '+91 98250 12345'}</span>
                            <span>·</span>
                            <Mail className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[120px]">{booking.driverEmail}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[9.5px] font-heading font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                          isPending
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isAccepted
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {isPending && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                        {isAccepted && <Check className="w-3 h-3 text-emerald-600" />}
                        {isRejected && <X className="w-3 h-3 text-rose-600" />}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[10.5px] truncate font-medium">{booking.stationName}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[10.5px] font-bold text-slate-900">
                          {booking.slotDate} · {booking.slotTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Car className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-[10.5px] font-mono text-slate-800">
                          {booking.vehiclePlate} ({booking.vehicleModel?.split(' ')[0] || 'EV'})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-[10.5px] font-bold">
                          ₹{booking.estimatedPrice?.toFixed(2)}/kWh · {booking.targetKwh} kWh
                        </span>
                      </div>
                    </div>

                    {/* Operator Note / Bay Assignment Display */}
                    {booking.operatorNotes && (
                      <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 flex items-start gap-1.5">
                        <Info className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                        <div>
                          {booking.bayNumber && isAccepted && (
                            <b className="text-emerald-800 mr-1">[{booking.bayNumber}]</b>
                          )}
                          <span>{booking.operatorNotes}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Controls for Operator (Instant 1-Click Accept / Reject) */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono text-slate-400">
                        ID: {booking.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isPending ? (
                          <>
                            <button
                              disabled={isBusy}
                              onClick={() => handleUpdateStatus(booking, 'rejected')}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10.5px] font-heading font-extrabold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                              <span>Reject</span>
                            </button>

                            <button
                              disabled={isBusy}
                              onClick={() => handleUpdateStatus(booking, 'accepted')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-heading font-black flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                              <span>Accept</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {isAccepted ? (
                              <button
                                disabled={isBusy}
                                onClick={() => handleUpdateStatus(booking, 'rejected')}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-heading font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                                <span>Change to Reject</span>
                              </button>
                            ) : (
                              <button
                                disabled={isBusy}
                                onClick={() => handleUpdateStatus(booking, 'accepted')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-heading font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Change to Accept</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <MobileBottomBar />
    </div>
  );
};

export default MobileOperatorBookingsScreen;
