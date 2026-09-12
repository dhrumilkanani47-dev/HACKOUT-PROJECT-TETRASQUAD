import { INITIAL_USER } from '../utils/mockData';
import { API_BASE } from './config';

export const authApi = {
  async login(credentials) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error('Login failed');
        return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, fallback to demo auth', err);
      }
    }
    // Demo fallback
    await new Promise(r => setTimeout(r, 400));
    return {
      token: 'demo_jwt_token_12345',
      user: {
        ...INITIAL_USER,
        email: credentials.email || INITIAL_USER.email,
        ...(credentials.role ? { role: credentials.role } : {}),
        ...(credentials.companyName ? { companyName: credentials.companyName } : {})
      }
    };
  },

  async signup(data) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Signup failed');
        return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, fallback to demo signup', err);
      }
    }
    await new Promise(r => setTimeout(r, 500));
    return {
      token: 'demo_jwt_token_12345',
      user: {
        ...INITIAL_USER,
        name: data.name || INITIAL_USER.name,
        email: data.email || INITIAL_USER.email,
        phone: data.phone || INITIAL_USER.phone,
        state: data.state || INITIAL_USER.state,
        city: data.city || INITIAL_USER.city
      }
    };
  },

  async getCurrentUser() {
    return INITIAL_USER;
  }
};
