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
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Building2,
  Car,
  Zap,
  Mail,
  Send,
  Filter,
  RefreshCw,
  Plus,
  ShieldCheck,
  ChevronRight,
  Info,
  Radio,
  FileText,
  User,
  Phone,
  Layers,
  X
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

  // Modal State for Accept / Reject Action
  const [activeModal, setActiveModal] = useState(null); // { type: 'accept' | 'reject', booking: {...} }
  const [selectedBay, setSelectedBay] = useState('Bay 02');
  const [operatorNote, setOperatorNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [lastDispatchedEmail, setLastDispatchedEmail] = useState(null);

  // New Simulated Request Modal
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [simDriverName, setSimDriverName] = useState('Krushil Gadhiya');
  const [simDriverEmail, setSimDriverEmail] = useState('krushilgadhiya138@gmail.com');
  const [simVehicle, setSimVehicle] = useState('Tata Nexon EV');
  const [simPlate, setSimPlate] = useState('GJ 01 EV 4821');
  const [simSlotTime, setSimSlotTime] = useState('02:00 PM');

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

      setBookings(list);
      setStats(statsData);
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

  // Real-time polling every 6 seconds to capture live driver booking requests
  useEffect(() => {
    const timer = setInterval(() => {
      loadData(true);
    }, 6000);
    return () => clearInterval(timer);
  }, [loadData]);

  // Handle Open Accept Modal
  const handleOpenAccept = (booking) => {
    setSelectedBay(booking.bayNumber || 'Bay 01');
    setOperatorNote(`Allocated to ${booking.bayNumber || 'Bay 01'} · Fast CCS2 Ready · 90% Verified Solar Mix`);
    setActiveModal({ type: 'accept', booking });
  };

  // Handle Open Reject Modal
  const handleOpenReject = (booking) => {
    setOperatorNote('Grid peak shaving protocol in effect. Suggested off-peak solar window: 1:00 PM – 3:30 PM.');
    setActiveModal({ type: 'reject', booking });
  };

  // Submit Operator Decision
  const handleConfirmAction = async () => {
    if (!activeModal?.booking) return;
    setIsSubmitting(true);

    try {
      const res = await bookingApi.updateStatus({
        bookingId: activeModal.booking.id,
        status: activeModal.type === 'accept' ? 'accepted' : 'rejected',
        bayNumber: selectedBay,
        operatorNotes: operatorNote,
        operatorName: `${registeredCompany} Station Operator`
      });

      if (res.success) {
        setLastDispatchedEmail({
          recipient: res.emailSentTo,
          subject: res.emailDraft?.subject,
          body: res.emailDraft?.body,
          status: activeModal.type === 'accept' ? 'Accepted' : 'Rejected',
          bookingId: activeModal.booking.id,
          driverName: activeModal.booking.driverName
        });
        setShowEmailPreview(true);
        triggerToast(`Request ${activeModal.type === 'accept' ? 'Accepted' : 'Rejected'} & Email Sent!`);
        setActiveModal(null);
        await loadData();
      } else {
        triggerToast('Failed to update status. Please try again.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error updating status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate Incoming Driver Request
  const handleSimulateRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await bookingApi.createBooking({
        driverName: simDriverName,
        driverEmail: simDriverEmail,
        driverPhone: '+91 98250 12345',
        vehicleModel: simVehicle,
        vehiclePlate: simPlate,
        companyName: registeredCompany,
        stationId: 'st_01',
        stationName: `${registeredCompany} Supercharger Hub`,
        slotTime: simSlotTime,
        slotDate: new Date().toISOString().split('T')[0],
        targetKwh: 28.0,
        estimatedPrice: 8.40,
        bayNumber: 'Bay 02'
      });

      if (res.success) {
        setIsSimulateOpen(false);
        triggerToast('⚡ New Driver Request Received in Real-Time!');
        await loadData();
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to create simulation request.');
    }
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-slate-50 select-none relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 bg-slate-900 text-white text-[11px] rounded-full shadow-lg font-heading font-medium animate-fade-in flex items-center gap-1.5 backdrop-blur-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
                    Real-Time Dispatch Desk
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

              <button
                onClick={() => setIsSimulateOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-[10px] font-heading font-extrabold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                title="Send test driver booking request"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Test Req</span>
              </button>
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
                <Clock className="w-3 h-3 text-emerald-600" /> Time Horizon &amp; 1-Day Queue:
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
                <button
                  onClick={() => setIsSimulateOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[10.5px] font-bold shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Send Test Booking Request
                </button>
              </div>
            ) : (
              bookings.map((booking) => {
                const isPending = booking.status === 'pending';
                const isAccepted = booking.status === 'accepted';
                const isRejected = booking.status === 'rejected';

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
                        {isPending && <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {isAccepted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isRejected && <XCircle className="w-3 h-3 text-rose-600" />}
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

                    {/* Action Controls for Operator */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono text-slate-400">
                        ID: {booking.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleOpenReject(booking)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10.5px] font-heading font-bold flex items-center gap-1 active:scale-95 transition-all"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Deny / Reject</span>
                            </button>

                            <button
                              onClick={() => handleOpenAccept(booking)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-heading font-extrabold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Accept Request</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setLastDispatchedEmail({
                                  recipient: booking.driverEmail,
                                  subject: isAccepted ? `Slot Confirmed · ${booking.stationName}` : `Slot Request Update`,
                                  body: `Status: ${booking.status.toUpperCase()}\nStation: ${booking.stationName}\nSlot: ${booking.slotDate} ${booking.slotTime}\nVehicle: ${booking.vehiclePlate}\nNotes: ${booking.operatorNotes}`,
                                  status: isAccepted ? 'Accepted' : 'Rejected',
                                  bookingId: booking.id,
                                  driverName: booking.driverName
                                });
                                setShowEmailPreview(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-heading font-bold flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>View Mail Log</span>
                            </button>

                            {/* Re-evaluate / Change status button */}
                            <button
                              onClick={() => isAccepted ? handleOpenReject(booking) : handleOpenAccept(booking)}
                              className="px-2 py-1 rounded-lg text-[9.5px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold"
                            >
                              Modify
                            </button>
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

      {/* ------------------------------------------------------------- */}
      {/* ACCEPT / REJECT OPERATOR ACTION MODAL */}
      {/* ------------------------------------------------------------- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-[390px] bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {activeModal.type === 'accept' ? (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-rose-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-heading font-extrabold text-[14px] text-slate-900">
                    {activeModal.type === 'accept' ? 'Confirm Slot & Allocate Bay' : 'Deny Slot Request'}
                  </h4>
                  <div className="text-[10px] text-slate-500">
                    Driver: <b>{activeModal.booking.driverName}</b> ({activeModal.booking.vehiclePlate})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 flex flex-col gap-3">
              {activeModal.type === 'accept' && (
                <div>
                  <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1.5">
                    Assign Charging Bay:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Bay 01', 'Bay 02', 'Bay 03', 'Bay 04'].map((bay) => (
                      <button
                        key={bay}
                        type="button"
                        onClick={() => {
                          setSelectedBay(bay);
                          setOperatorNote(`Allocated to ${bay} · Fast DC CCS2 Ready · 90% Verified Solar Mix`);
                        }}
                        className={`py-1.5 rounded-xl text-[10px] font-heading font-extrabold border transition-all ${
                          selectedBay === bay
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        ⚡ {bay}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal.type === 'reject' && (
                <div>
                  <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1.5">
                    Quick Rejection Reason:
                  </label>
                  <div className="flex flex-col gap-1">
                    {[
                      'Grid peak shaving protocol in effect. Suggested off-peak window: 1:00 PM – 3:30 PM.',
                      'Charging bay undergoing scheduled maintenance.',
                      'Full station capacity booked for this specific time slot.'
                    ].map((reason, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setOperatorNote(reason)}
                        className={`p-2 rounded-xl text-left text-[10px] font-medium border transition-all ${
                          operatorNote === reason
                            ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1">
                  Operator Note &amp; Email Message to Driver:
                </label>
                <textarea
                  value={operatorNote}
                  onChange={(e) => setOperatorNote(e.target.value)}
                  rows={2}
                  className="app-field w-full text-xs p-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl"
                  placeholder="Note to driver..."
                />
              </div>

              {/* Real-time Email Alert Banner */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Real-time notification email will be dispatched directly to <b>{activeModal.booking.driverEmail}</b>.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="app-btn ghost flex-1 py-2 text-xs font-bold"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className={`app-btn flex-1 py-2 text-xs font-bold text-white shadow-md ${
                  activeModal.type === 'accept' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                ) : activeModal.type === 'accept' ? (
                  'Confirm & Send Email'
                ) : (
                  'Deny & Send Email'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* REAL-TIME EMAIL DISPATCH PREVIEW MODAL */}
      {/* ------------------------------------------------------------- */}
      {showEmailPreview && lastDispatchedEmail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-[400px] bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-[13.5px] text-slate-900">
                    Real-Time Email Dispatched
                  </h4>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered to Driver Inbox
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">To:</span>
                  <b className="text-slate-800 font-mono text-[11px]">{lastDispatchedEmail.recipient}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <b className="text-slate-900 text-[11px] truncate max-w-[220px]">{lastDispatchedEmail.subject}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className={`pill-tag ${lastDispatchedEmail.status === 'Accepted' ? 'green' : 'red'} text-[9px]`}>
                    {lastDispatchedEmail.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1">
                  Email Content Sent:
                </label>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[10px] whitespace-pre-line leading-relaxed max-h-[200px] overflow-y-auto border border-slate-800 shadow-inner">
                  {lastDispatchedEmail.body}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowEmailPreview(false)}
                className="app-btn w-full py-2 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SIMULATE INCOMING DRIVER REQUEST MODAL */}
      {/* ------------------------------------------------------------- */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <form
            onSubmit={handleSimulateRequest}
            className="w-full max-w-[390px] bg-white rounded-3xl p-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-[14px] text-slate-900">
                    Simulate Driver Slot Request
                  </h4>
                  <div className="text-[10px] text-slate-500">
                    Creates instant real-time incoming request for {registeredCompany}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 flex flex-col gap-2.5 text-xs">
              <div>
                <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1">
                  Driver Name:
                </label>
                <input
                  type="text"
                  value={simDriverName}
                  onChange={(e) => setSimDriverName(e.target.value)}
                  required
                  className="app-field w-full text-xs p-2 bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1">
                  Driver Email (for live notification email):
                </label>
                <input
                  type="email"
                  value={simDriverEmail}
                  onChange={(e) => setSimDriverEmail(e.target.value)}
                  required
                  className="app-field w-full text-xs p-2 bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1">
                    Vehicle Model:
                  </label>
                  <input
                    type="text"
                    value={simVehicle}
                    onChange={(e) => setSimVehicle(e.target.value)}
                    required
                    className="app-field w-full text-xs p-2 bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1">
                    Plate Number:
                  </label>
                  <input
                    type="text"
                    value={simPlate}
                    onChange={(e) => setSimPlate(e.target.value)}
                    required
                    className="app-field w-full text-xs p-2 bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-heading font-bold text-slate-700 mb-1">
                  Preferred Time Slot:
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSimSlotTime(slot)}
                      className={`py-1.5 rounded-lg text-[9.5px] font-heading font-bold border transition-all ${
                        simSlotTime === slot
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSimulateOpen(false)}
                className="app-btn ghost flex-1 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="app-btn flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md"
              >
                Submit Test Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MobileOperatorBookingsScreen;
