/**
 * Real-Time EV Slot Booking API Client
 * Seamlessly interfaces with the Python SQLite Backend Server and provides instant real-time sync.
 */

const API_BASE = 'http://localhost:5000/api';
const LOCAL_BOOKINGS_KEY = 'egc_shared_bookings';

const readLocalBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeLocalBookings = (bookings) => {
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
};

const matchesFilters = (booking, { company = '', status = '', search = '', driverEmail = '' }) => {
  const searchText = `${booking.driverName || ''} ${booking.stationName || ''} ${booking.stationId || ''}`.toLowerCase();
  return (!company || company === 'all' || booking.companyName === company)
    && (!status || status === 'all' || booking.status === status)
    && (!driverEmail || booking.driverEmail === driverEmail)
    && (!search || searchText.includes(search.toLowerCase()));
};

export const bookingApi = {
  async getBookings({ company = '', status = '', timeRange = 'all', search = '', driverEmail = '' } = {}) {
    try {
      const params = new URLSearchParams();
      if (company && company !== 'all') params.append('company', company);
      if (status && status !== 'all') params.append('status', status);
      if (timeRange && timeRange !== 'all') params.append('timeRange', timeRange);
      if (search) params.append('search', search);
      if (driverEmail) params.append('driverEmail', driverEmail);

      const res = await fetch(`${API_BASE}/bookings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const remoteBookings = data.bookings || [];
        const merged = new Map(remoteBookings.map((booking) => [booking.id || `${booking.stationId}-${booking.slotTime}-${booking.driverEmail}`, booking]));
        readLocalBookings().filter((booking) => matchesFilters(booking, { company, status, search, driverEmail })).forEach((booking) => {
          const key = booking.id || `${booking.stationId}-${booking.slotTime}-${booking.driverEmail}`;
          if (!merged.has(key)) merged.set(key, booking);
        });
        return Array.from(merged.values());
      }
    } catch (err) {
      console.warn('[bookingApi] Backend offline, using local cache:', err);
    }
    return readLocalBookings().filter((booking) => matchesFilters(booking, { company, status, search, driverEmail }));
  },

  async getStats({ company = '', timeRange = 'today' } = {}) {
    try {
      const params = new URLSearchParams();
      if (company && company !== 'all') params.append('company', company);
      if (timeRange) params.append('timeRange', timeRange);

      const res = await fetch(`${API_BASE}/bookings/stats?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[bookingApi] Stats fetch error:', err);
    }
    const bookings = readLocalBookings().filter((booking) => !company || company === 'all' || booking.companyName === company);
    return {
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === 'pending').length,
      accepted: bookings.filter((booking) => booking.status === 'accepted').length,
      rejected: bookings.filter((booking) => booking.status === 'rejected').length,
      timeRange
    };
  },

  async createBooking(bookingData) {
    const localBooking = {
      ...bookingData,
      id: `local-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    writeLocalBookings([...readLocalBookings(), localBooking]);

    try {
      const res = await fetch(`${API_BASE}/bookings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        const result = await res.json();
        if (result?.booking) {
          const bookings = readLocalBookings().map((booking) => booking.id === localBooking.id ? { ...booking, ...result.booking } : booking);
          writeLocalBookings(bookings);
        }
        return result;
      }
    } catch (err) {
      console.error('[bookingApi] createBooking error:', err);
    }
    return { success: true, booking: localBooking, local: true };
  },

  async updateStatus({ bookingId, status, bayNumber, operatorNotes, operatorName }) {
    const localBookings = readLocalBookings();
    const localMatch = localBookings.find((booking) => booking.id === bookingId);
    if (localMatch) {
      writeLocalBookings(localBookings.map((booking) => booking.id === bookingId
        ? { ...booking, status, bayNumber, operatorNotes, operatorName, updatedAt: new Date().toISOString() }
        : booking));
    }

    try {
      const res = await fetch(`${API_BASE}/bookings/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          status,
          bayNumber,
          operatorNotes,
          operatorName
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('[bookingApi] updateStatus error:', err);
    }
    return { success: Boolean(localMatch), local: Boolean(localMatch) };
  }
};

export default bookingApi;
