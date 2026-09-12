import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { WhyThisPriceModal } from '../../components/mobile/WhyThisPriceModal';
import {
  Zap,
  MapPin,
  ShieldCheck,
  Clock,
  HelpCircle,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  XCircle,
  RefreshCw,
  Building2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useStations } from '../../context/StationContext';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../api/bookingApi';

export const MobileStationDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { stations } = useStations();
  const { user } = useAuth();
  const isOperator = user?.role === 'operator';
  const [showWhyPrice, setShowWhyPrice] = useState(false);
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  
  // Load active booking state from localStorage
  const [activeBooking, setActiveBooking] = useState(() => {
    try {
      const stored = localStorage.getItem(`egc_booking_obj_${id}`);
      if (stored) return JSON.parse(stored);
      const legacyTime = localStorage.getItem(`egc_booking_${id}`);
      if (legacyTime) {
        return { slotTime: legacyTime, status: 'pending' };
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [bookingToast, setBookingToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const station = stations.find((item) => item.id === id) || stations[0];
  const price = station?.pricePerKwh || 8.4;
  const availableChargers = station?.availableChargers ?? 4;
  const totalChargers = station?.totalChargers ?? 6;
  const connectors = station?.connectors?.length ? station.connectors : ['CCS2', 'Type 2'];
  const isFull = availableChargers <= 0 || station?.isAvailable === false;
  const timeSlots = ['10:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'];

  // Check & poll real-time booking status from backend SQLite (Drivers Only)
  const checkStatusFromBackend = useCallback(async () => {
    if (isOperator || !activeBooking) return;
    try {
      const company = station?.network || station?.companyName || 'Tata Power';
      const list = await bookingApi.getBookings({ company, timeRange: 'all' });
      if (Array.isArray(list) && list.length > 0) {
        const found = list.find(
          (b) =>
            (activeBooking.id && b.id === activeBooking.id) ||
            (b.stationId === (station?.id || id) && b.slotTime === activeBooking.slotTime)
        );
        if (found && found.status !== activeBooking.status) {
          const updated = {
            ...activeBooking,
            id: found.id,
            status: found.status,
            bayNumber: found.bayNumber,
            operatorNotes: found.operatorNotes,
          };
          setActiveBooking(updated);
          localStorage.setItem(`egc_booking_obj_${id}`, JSON.stringify(updated));
          if (found.status === 'accepted') {
            setBookingToast(`🟢 Great news! Your slot at ${found.slotTime} was ACCEPTED by Operator!`);
            setTimeout(() => setBookingToast(''), 5000);
          } else if (found.status === 'rejected') {
            setBookingToast(`🔴 Slot request was declined by Operator.`);
            setTimeout(() => setBookingToast(''), 5000);
          }
        }
      }
    } catch (err) {
      console.warn('Status poll error:', err);
    }
  }, [activeBooking, station, id, isOperator]);

  useEffect(() => {
    if (isOperator) return;
    // Initial sync
    checkStatusFromBackend();

    // Polling every 3.5s for instant live status updates
    const timer = setInterval(() => {
      checkStatusFromBackend();
    }, 3500);

    return () => clearInterval(timer);
  }, [checkStatusFromBackend, isOperator]);

  const handleCancelBooking = () => {
    localStorage.removeItem(`egc_booking_obj_${id}`);
    localStorage.removeItem(`egc_booking_${id}`);
    setActiveBooking(null);
    setBookingToast('Slot request cancelled');
    setTimeout(() => setBookingToast(''), 2500);
  };

  const handleBookSlot = async () => {
    if (isOperator) return;
    setIsSyncing(true);
    const companyName = station?.network || station?.companyName || 'Tata Power';
    
    // Save optimistic pending state
    const newBooking = {
      slotTime: selectedTime,
      slotDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      stationId: station?.id || id,
      stationName: station?.name || 'GreenHub Supercharger',
      companyName,
      bayNumber: 'Bay 02',
      estimatedPrice: price,
      createdAt: new Date().toISOString()
    };

    setActiveBooking(newBooking);
    localStorage.setItem(`egc_booking_obj_${id}`, JSON.stringify(newBooking));
    localStorage.setItem(`egc_booking_${id}`, selectedTime);

    setBookingToast('⏳ Request sent! Status: Pending Operator Approval');
    setTimeout(() => setBookingToast(''), 4000);

    // Sync to backend SQLite database in real-time
    const res = await bookingApi.createBooking({
      driverName: user?.name || 'EV Driver',
      driverEmail: user?.email || 'krushilgadhiya138@gmail.com',
      driverPhone: user?.phone || '+91 98250 12345',
      vehicleModel: 'Tata Nexon EV Long Range',
      vehiclePlate: 'GJ 01 EV 4821',
      companyName: companyName,
      stationId: station?.id || id,
      stationName: station?.name || 'GreenHub Supercharger',
      slotTime: selectedTime,
      slotDate: new Date().toISOString().split('T')[0],
      targetKwh: 25.0,
      estimatedPrice: price,
      bayNumber: 'Bay 02'
    });

    if (res?.booking?.id) {
      const persisted = { ...newBooking, id: res.booking.id };
      setActiveBooking(persisted);
      localStorage.setItem(`egc_booking_obj_${id}`, JSON.stringify(persisted));
    }
    setIsSyncing(false);
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title={isOperator ? "Station Management" : "Station Details"} onBack={() => navigate('/map')} />

        {/* Real-time booking toast notification */}
        {bookingToast && (
          <div className="mx-4 mt-2 p-2.5 rounded-xl bg-slate-900 text-white text-xs font-heading font-bold shadow-lg flex items-center justify-between gap-1.5 animate-fade-in border border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{bookingToast}</span>
            </div>
            <button onClick={() => setBookingToast('')} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Content Container matching Screen 05 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Station Visual Banner */}
          <div
            className="relative h-[78px] rounded-[16px] overflow-hidden flex items-center justify-between px-4 border border-green-200"
            style={{
              background: 'linear-gradient(120deg, #DCFCE7, #F0FDF4)',
            }}
          >
            <div className="z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-[9.5px] font-heading font-bold border border-emerald-300">
                {isOperator ? 'Your Station Branch' : 'Verified Green'}
              </span>
              <div className="text-[11.5px] text-emerald-950 font-heading font-extrabold mt-1">
                Solar Canopy + Battery Storage
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-200/60 flex items-center justify-center text-emerald-800">
              <Zap className="w-7 h-7" />
            </div>
          </div>

          {/* Station Title & Location */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-[18px] text-slate-900">
                {station?.name || 'GreenHub Station'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                {station?.network || 'Tata Power'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{station?.city || 'Ahmedabad'}, {station?.state || 'Gujarat'} · {station?.distanceKm || '1.8'} km</span>
            </div>
          </div>

          {/* Renewable Pill */}
          <div>
            <span className="pill-tag green">
              ☀ {station?.renewablePct || 90}% renewable now
            </span>
          </div>

          {/* Speed / Available / Price Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="app-card text-center py-2 px-1">
              <div className="text-[9px] text-slate-500 font-medium">Speed</div>
              <b className="font-heading text-[12px] text-slate-900">{station?.speedLabel || 'Fast DC'}</b>
            </div>

            <div className="app-card text-center py-2 px-1">
              <div className="text-[9px] text-slate-500 font-medium">Available</div>
              <b className="font-heading text-[12px] text-slate-900">{availableChargers} / {totalChargers}</b>
            </div>

            <div className="app-card text-center py-2 px-1">
              <div className="text-[9px] text-slate-500 font-medium">{isOperator ? 'Base Tariff' : 'Price'}</div>
              <b className="font-heading text-[12px] text-emerald-700 font-bold">₹{price.toFixed(2)}</b>
            </div>
          </div>

          {/* Why this price trigger card */}
          <button
            onClick={() => setShowWhyPrice(true)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-green-200 text-xs font-heading font-bold text-emerald-800 text-left hover:bg-green-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              Why is charging ₹{price.toFixed(2)}/kWh?
            </span>
            <span className="text-[11px] text-slate-500 font-normal">View breakdown ›</span>
          </button>

          {/* Connector Specs */}
          <div className="app-card text-xs space-y-1.5 py-2.5">
            <div className="text-[10px] text-slate-700 font-heading font-semibold">
              Supported Connectors &amp; Amenities:
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200">
                {connectors[0]} ({station?.powerKw || 60} kW)
              </span>
              {connectors.slice(1).map((connector) => (
                <span key={connector} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200">
                  {connector}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200">
                {station?.amenities?.[0] || 'AC Lounge & WiFi'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OPERATOR MANAGEMENT PANEL (OPERATOR) vs DRIVER SLOT BOOKING (DRIVER) */}
      {/* ========================================================================= */}
      <div className="p-4 pt-0">
        {isOperator ? (
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-3.5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-950 font-extrabold">
                    Operator Station Control
                  </span>
                  <h4 className="font-heading font-extrabold text-xs text-emerald-950 mt-0.5">
                    {station?.name || 'Branch Operations'}
                  </h4>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[9.5px] font-bold">
                🟢 Live & Online
              </span>
            </div>

            <div className="text-[10.5px] text-emerald-900 bg-white/80 p-2.5 rounded-xl border border-emerald-200/80 leading-snug">
              Station operators manage customer slot approvals and grid pricing. Slot booking is reserved for EV Drivers.
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => navigate('/operator/bookings')}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Slot Requests</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/manage-stations')}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-emerald-900 border border-emerald-300 font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                <span>Manage Pricing</span>
              </button>
            </div>
          </div>
        ) : (
          /* DRIVER ACTIONS */
          <>
            {/* 1. PENDING APPROVAL STATE */}
            {activeBooking && activeBooking.status === 'pending' && (
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-3 shadow-sm animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                      <Hourglass className="w-4 h-4 animate-spin" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.2 rounded-md bg-amber-500 text-slate-950 text-[9px] font-heading font-extrabold uppercase tracking-wide">
                          Pending Approval
                        </span>
                        <span className="text-[9.5px] font-mono text-amber-800 font-bold">
                          {activeBooking.slotTime}
                        </span>
                      </div>
                      <h4 className="font-heading font-extrabold text-xs text-amber-950 mt-0.5">
                        Awaiting Station Operator
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="p-1.5 rounded-lg text-amber-800 hover:bg-amber-200/60 transition-colors cursor-pointer"
                    aria-label="Cancel pending slot request"
                    title="Cancel request"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                  </button>
                </div>

                <div className="mt-2 text-[10px] text-amber-900/90 leading-snug bg-amber-100/60 p-2 rounded-xl border border-amber-200/60">
                  Your request for <b>{activeBooking.slotTime}</b> is queued with <b>{station?.network || 'Tata Power'}</b> operator in real-time.
                  <span className="block mt-0.5 text-amber-800 font-semibold">
                    ⚡ &quot;Start Charging&quot; will unlock automatically once the operator accepts your request.
                  </span>
                </div>

                <div className="mt-2.5 flex gap-2">
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-200/80 text-amber-900 font-heading font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-amber-300/80"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Waiting for Operator...</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="py-2 px-3 rounded-xl bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 font-heading font-bold text-xs cursor-pointer"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            )}

            {/* 2. ACCEPTED / APPROVED STATE (READY TO CHARGE) */}
            {activeBooking && activeBooking.status === 'accepted' && (
              <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-3 shadow-md animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.2 rounded-md bg-emerald-600 text-white text-[9px] font-heading font-extrabold uppercase">
                          Slot Approved
                        </span>
                        <span className="text-[9.5px] font-mono text-emerald-900 font-bold">
                          {activeBooking.slotTime}
                        </span>
                      </div>
                      <h4 className="font-heading font-extrabold text-xs text-emerald-950 mt-0.5">
                        Allocated: {activeBooking.bayNumber || 'Bay 02'}
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-emerald-100 cursor-pointer"
                    aria-label="Cancel confirmed slot"
                    title="Cancel slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 text-[10px] text-emerald-900 leading-snug bg-emerald-100/70 p-2 rounded-xl border border-emerald-200">
                  {activeBooking.operatorNotes || `Confirmed by ${station?.network || 'Tata Power'} Operator. Fast DC Charger Ready.`}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/charging')}
                  className="app-btn w-full text-xs font-bold mt-2.5 py-2.5 shadow-md flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Start Charging ({activeBooking.bayNumber || 'Bay 02'})</span>
                </button>
              </div>
            )}

            {/* 3. REJECTED / DECLINED STATE */}
            {activeBooking && activeBooking.status === 'rejected' && (
              <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-3 shadow-sm animate-slide-up">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="px-2 py-0.2 rounded-md bg-rose-600 text-white text-[9px] font-heading font-extrabold uppercase">
                      Request Declined
                    </span>
                    <h4 className="font-heading font-extrabold text-xs text-rose-950 mt-0.5">
                      Slot at {activeBooking.slotTime} Unavailable
                    </h4>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-rose-900 bg-rose-100/60 p-2 rounded-xl border border-rose-200">
                  {activeBooking.operatorNotes || 'Slot is unavailable due to peak grid scheduling. Please choose another time.'}
                </div>

                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="w-full mt-2.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-heading font-bold text-xs cursor-pointer"
                >
                  Choose Another Time Slot
                </button>
              </div>
            )}

            {/* 4. DEFAULT STATE: NO BOOKING */}
            {!activeBooking && (
              isFull ? (
                <div className="w-full rounded-xl bg-slate-100 border border-slate-200 py-3 text-center text-sm font-bold text-slate-500">
                  Slots Full
                </div>
              ) : (
                <div className="rounded-xl border border-green-200 bg-white p-2.5 shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" /> Choose a charging time
                    </span>
                    <span className="text-[9px] text-slate-400 font-normal">Real-time Operator Sync</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-1.5 rounded-lg text-[9px] font-bold border transition-colors cursor-pointer ${
                          selectedTime === slot
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-green-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleBookSlot}
                    disabled={isSyncing}
                    className="app-btn w-full text-sm font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Book {selectedTime} (Send Request)</span>
                      </>
                    )}
                  </button>
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Why This Price Modal */}
      <WhyThisPriceModal
        isOpen={showWhyPrice}
        onClose={() => setShowWhyPrice(false)}
        price={price}
      />
    </div>
  );
};

export default MobileStationDetailsScreen;
