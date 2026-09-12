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
    const saved = localStorage.getItem('egc_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PAST_SESSIONS;
  },

  async addSession(session) {
    const current = await this.getPastSessions();
    const newSession = {
      id: `ses_${Date.now()}`,
      date: new Date().toISOString(),
      ...session
    };
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
