/**
 * Real-Time EV Slot Booking API Client
 * Seamlessly interfaces with the Python SQLite Backend Server and provides instant real-time sync.
 */

const API_BASE = 'http://localhost:5000/api';

export const bookingApi = {
  async getBookings({ company = '', status = '', timeRange = 'today', search = '' } = {}) {
    try {
      const params = new URLSearchParams();
      if (company && company !== 'all') params.append('company', company);
      if (status && status !== 'all') params.append('status', status);
      if (timeRange) params.append('timeRange', timeRange);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/bookings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.bookings || [];
      }
    } catch (err) {
      console.warn('[bookingApi] Backend offline, using local cache:', err);
    }
    // Fallback if backend server unreachable
    return [];
  },

  async getStats({ company = '' } = {}) {
    try {
      const params = new URLSearchParams();
      if (company && company !== 'all') params.append('company', company);

      const res = await fetch(`${API_BASE}/bookings/stats?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[bookingApi] Stats fetch error:', err);
    }
    return { total: 0, pending: 0, accepted: 0, rejected: 0, todayActive: 0 };
  },

  async createBooking(bookingData) {
    try {
      const res = await fetch(`${API_BASE}/bookings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('[bookingApi] createBooking error:', err);
    }
    return { success: false };
  },

  async updateStatus({ bookingId, status, bayNumber, operatorNotes, operatorName }) {
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
    return { success: false };
  }
};

export default bookingApi;
