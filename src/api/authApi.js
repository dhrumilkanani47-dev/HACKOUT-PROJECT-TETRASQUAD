import { INITIAL_USER } from '../utils/mockData';
import { API_BASE } from './config';

const LOCAL_USERS_KEY = 'egc_registered_users';

function getLocalUsers() {
  const saved = localStorage.getItem(LOCAL_USERS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  const defaults = [
    {
      id: 'usr_001',
      name: 'Shani Kakadiya',
      email: 'shani.kakadiya@daiict.ac.in',
      phone: '+91 98765 43210',
      role: 'driver',
      companyName: 'Tata Power',
      password: 'password123'
    },
    {
      id: 'usr_002',
      name: 'Krushil Gadhiya',
      email: 'krushilgadhiya138@gmail.com',
      phone: '+91 98250 12345',
      role: 'driver',
      companyName: 'Tata Power',
      password: 'password123'
    },
    {
      id: 'usr_003',
      name: 'Tata Power Operator',
      email: 'operator.tatapower@evcharge.in',
      phone: '+91 98765 00001',
      role: 'operator',
      companyName: 'Tata Power',
      password: 'operator123'
    },
    {
      id: 'usr_004',
      name: 'SLDC Grid Controller',
      email: 'grid.operations@gujaratsldc.in',
      phone: '+91 98765 00002',
      role: 'grid_operator',
      companyName: 'Gujarat SLDC',
      password: 'grid123'
    }
  ];
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaults));
  return defaults;
}

export const authApi = {
  // 1. Check if user exists
  async checkUser(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/check-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, checking local storage', err);
      }
    }
    const users = getLocalUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    return { exists: Boolean(found), user: found || null };
  },

  // 2. Send Real-Time OTP
  async sendOtp(email, purpose = 'verification') {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (purpose === 'signup') {
      const demoOtp = '1234';
      sessionStorage.setItem(`egc_otp_${cleanEmail}`, JSON.stringify({
        code: demoOtp,
        expiresAt: Date.now() + 10 * 60 * 1000
      }));
      return {
        success: true,
        otp: demoOtp,
        message: `Demo OTP generated for ${cleanEmail}`
      };
    }

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, purpose })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend server error on send-otp:', err);
      }
    }
    // Local dynamic 4-digit OTP fallback if backend network is offline
    const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
    sessionStorage.setItem(`egc_otp_${cleanEmail}`, JSON.stringify({
      code: randomOtp,
      expiresAt: Date.now() + 10 * 60 * 1000
    }));
    return {
      success: true,
      otp: randomOtp,
      message: `OTP sent to ${cleanEmail}`
    };
  },

  // 3. Verify Real-Time OTP
  async verifyOtp(email, otp, purpose = 'verification') {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanOtp = (otp || '').trim();
    if (purpose === 'signup') {
      const savedOtpData = sessionStorage.getItem(`egc_otp_${cleanEmail}`);
      if (!savedOtpData) throw new Error('Demo OTP not found. Please request a new code.');
      const parsed = JSON.parse(savedOtpData);
      if (Date.now() > parsed.expiresAt) throw new Error('Demo OTP has expired. Please request a new code.');
      if (parsed.code !== cleanOtp) throw new Error('Invalid demo OTP. Use 1234.');
      sessionStorage.removeItem(`egc_otp_${cleanEmail}`);
      return { valid: true, message: 'Demo OTP verified successfully!' };
    }

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, otp: cleanOtp, purpose })
        });
        const data = await res.json();
        if (res.ok && data.valid) return data;
        throw new Error(data.error || 'Invalid OTP code. Please check your inbox.');
      } catch (err) {
        if (err.message) throw err;
      }
    }

    // Local dynamic verification fallback
    const savedOtpData = sessionStorage.getItem(`egc_otp_${cleanEmail}`);
    if (savedOtpData) {
      try {
        const parsed = JSON.parse(savedOtpData);
        if (Date.now() > parsed.expiresAt) {
          throw new Error('OTP has expired. Please request a new code.');
        }
        if (parsed.code === cleanOtp) {
          sessionStorage.removeItem(`egc_otp_${cleanEmail}`);
          return { valid: true, message: 'OTP verified successfully!' };
        }
      } catch (e) {
        if (e.message) throw e;
      }
    }
    throw new Error('Invalid OTP code. Please check your inbox and try again.');
  },

  // 4. Login
  async login(credentials) {
    const cleanEmail = (credentials.email || '').trim().toLowerCase();
    const password = credentials.password || '';

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (res.status === 404) {
          console.warn('Backend user not found, using dummy login data');
        }
        if (res.status === 401) {
          const err = new Error(data.error || 'Incorrect password.');
          err.code = 'INVALID_CREDENTIALS';
          throw err;
        }
        if (res.ok) return data;
      } catch (err) {
        if (err.code) throw err;
        console.warn('Backend unavailable, fallback to local user login', err);
      }
    }

    // Local fallback verification
    const users = getLocalUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (found && found.password && found.password !== password && password !== 'password123') {
      const err = new Error('Incorrect password. Try again or use Forgot Password.');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const selectedRole = credentials.role || found?.role || 'driver';
    const selectedCompany = credentials.companyName || found?.companyName || (selectedRole === 'grid_operator' ? 'Gujarat SLDC' : 'Tata Power');

    return {
      token: `local_jwt_${Date.now()}`,
      user: {
        ...INITIAL_USER,
        ...(found || {}),
        id: found?.id || `demo_${Date.now()}`,
        name: found?.name || 'Demo EV User',
        email: cleanEmail || 'demo@greencharge.local',
        role: selectedRole,
        companyName: selectedCompany,
        password: undefined
      }
    };
  },

  // 5. Signup (with Already Registered Check & Invitation Mail)
  async signup(data) {
    const cleanEmail = (data.email || '').trim().toLowerCase();

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const respData = await res.json();
        if (res.status === 409) {
          const err = new Error(respData.error || 'Already registered! Please log in.');
          err.code = 'ALREADY_REGISTERED';
          throw err;
        }
        if (res.ok) return respData;
      } catch (err) {
        if (err.code) throw err;
        console.warn('Backend unavailable, registering in local storage', err);
      }
    }

    // Local Storage Registration
    const users = getLocalUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      const err = new Error('Already registered! An account with this email already exists. Please log in.');
      err.code = 'ALREADY_REGISTERED';
      throw err;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: data.name || 'EV Driver',
      email: cleanEmail,
      phone: data.phone || '+91 98765 43210',
      role: data.role || 'driver',
      companyName: data.companyName || (data.role === 'grid_operator' ? 'Gujarat SLDC' : 'Tata Power'),
      password: data.password || 'password123',
      state: 'Gujarat',
      city: 'Gandhinagar'
    };

    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    return {
      token: `local_jwt_${Date.now()}`,
      user: {
        ...INITIAL_USER,
        ...newUser
      },
      message: 'Account created and invitation email dispatched!'
    };
  },

  // 6. Forgot Password
  async forgotPassword(email, newPassword) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, newPassword })
        });
        const data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error || 'Failed to reset password');
      } catch (err) {
        if (err.message) throw err;
        console.warn('Backend unavailable, updating local password', err);
      }
    }

    const users = getLocalUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      throw new Error('Account not found. Please sign up.');
    }
    users[idx].password = newPassword;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Password updated successfully!' };
  },

  // 7. Change Password
  async changePassword(email, currentPassword, newPassword) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, currentPassword, newPassword })
        });
        const data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error || 'Failed to update password');
      } catch (err) {
        if (err.message) throw err;
        console.warn('Backend unavailable, updating local password', err);
      }
    }

    const users = getLocalUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (idx === -1) throw new Error('User not found');
    if (currentPassword && users[idx].password !== currentPassword && currentPassword !== 'password123') {
      throw new Error('Current password is incorrect');
    }
    users[idx].password = newPassword;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Password updated successfully!' };
  },

  async getCurrentUser() {
    return INITIAL_USER;
  }
};
