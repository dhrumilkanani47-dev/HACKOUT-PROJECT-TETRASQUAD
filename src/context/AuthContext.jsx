import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { profileApi } from '../api/profileApi';
import { INITIAL_USER } from '../utils/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('egc_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('egc_auth_token'));
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('egc_user_profile', JSON.stringify(user));
    }
  }, [user]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('egc_auth_token', data.token);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (formData) => {
    setIsLoading(true);
    try {
      const data = await authApi.signup(formData);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('egc_auth_token', data.token);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (stateName, cityName, lat, lng, source = 'Manual Selection') => {
    const updated = await profileApi.updateProfile({
      state: stateName,
      city: cityName,
      latitude: lat || user.latitude,
      longitude: lng || user.longitude,
      locationSource: source
    });
    setUser(updated);
    return updated;
  };

  const updateProfile = async (updates) => {
    const updated = await profileApi.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem('egc_auth_token');
    localStorage.removeItem('egc_user_profile');
    localStorage.removeItem('egc_last_route');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
      updateLocation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
