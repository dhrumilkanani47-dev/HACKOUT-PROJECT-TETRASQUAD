import { INITIAL_USER, PAST_SESSIONS, NOTIFICATIONS_DATA, OPERATOR_DATA } from '../utils/mockData';
import { API_BASE } from './config';

export const profileApi = {
  async getProfile() {
    const saved = localStorage.getItem('egc_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USER;
  },

  async updateProfile(updates) {
    const current = await this.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem('egc_user_profile', JSON.stringify(updated));
    return updated;
  },

  async getPastSessions() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/sessions`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem('egc_sessions', JSON.stringify(data));
            return data;
          }
        }
      } catch (e) {
        console.warn('profileApi: using session cache fallback', e);
      }
    }
    const saved = localStorage.getItem('egc_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PAST_SESSIONS;
  },

  async addSession(session) {
    const newSession = {
      id: session.id || `ses_${Date.now()}`,
      date: session.date || new Date().toISOString(),
      ...session
    };

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/sessions/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSession)
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.session) {
            const current = await this.getPastSessions();
            const updated = [json.session, ...current.filter(s => s.id !== json.session.id)];
            localStorage.setItem('egc_sessions', JSON.stringify(updated));
            return json.session;
          }
        }
      } catch (e) {
        console.warn('profileApi: addSession backend error:', e);
      }
    }

    const current = await this.getPastSessions();
    const updated = [newSession, ...current];
    localStorage.setItem('egc_sessions', JSON.stringify(updated));
    return newSession;
  },

  async getNotifications() {
    return NOTIFICATIONS_DATA;
  },

  async getOperatorData() {
    return OPERATOR_DATA;
  }
};

export default profileApi;
