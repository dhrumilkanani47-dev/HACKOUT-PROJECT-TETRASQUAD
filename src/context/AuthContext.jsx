import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
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
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('egc_auth_token') ? true : true;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync user profile to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('egc_user_profile', JSON.stringify(user));
    }
  }, [user]);

  // Helper to build app user object from Supabase session user
  const mapSupabaseUser = (sbUser, existingRole) => {
    if (!sbUser) return INITIAL_USER;
    const meta = sbUser.user_metadata || {};
    return {
      ...INITIAL_USER,
      id: sbUser.id,
      email: sbUser.email || INITIAL_USER.email,
      name: meta.name || meta.full_name || sbUser.email?.split('@')[0] || INITIAL_USER.name,
      role: meta.role || existingRole || user?.role || 'driver',
      phone: meta.phone || INITIAL_USER.phone,
      state: meta.state || INITIAL_USER.state,
      city: meta.city || INITIAL_USER.city
    };
  };

  // Listen to Supabase auth state changes & initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.user) {
        setSession(currentSession);
        setUser((prev) => {
          const mapped = mapSupabaseUser(currentSession.user, prev?.role);
          return { ...prev, ...mapped, email: currentSession.user.email, id: currentSession.user.id };
        });
        setIsAuthenticated(true);
        localStorage.setItem('egc_auth_token', currentSession.access_token);
      }
    }).catch(err => console.warn('Supabase getSession error:', err));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && newSession?.user) {
        setSession(newSession);
        setUser((prev) => {
          const mapped = mapSupabaseUser(newSession.user, prev?.role);
          return { ...prev, ...mapped, email: newSession.user.email, id: newSession.user.id };
        });
        setIsAuthenticated(true);
        localStorage.setItem('egc_auth_token', newSession.access_token);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsAuthenticated(false);
        localStorage.removeItem('egc_auth_token');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Supabase Email + Password Login
  const login = async ({ email, password, role = 'driver' }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const updatedUser = {
          ...mapSupabaseUser(data.user, role),
          role: role || data.user.user_metadata?.role || 'driver'
        };
        setUser(updatedUser);
        setSession(data.session);
        setIsAuthenticated(true);
        if (data.session?.access_token) {
          localStorage.setItem('egc_auth_token', data.session.access_token);
        }
        return { user: updatedUser, session: data.session };
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // Supabase Email + Password Sign Up
  const signup = async ({ email, password, name = '', role = 'driver', phone = '', state = 'Gujarat', city = 'Gandhinagar' }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
            role,
            phone,
            state,
            city
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const updatedUser = {
          ...INITIAL_USER,
          id: data.user.id,
          email: data.user.email,
          name: name || email.split('@')[0],
          role,
          phone,
          state,
          city
        };
        setUser(updatedUser);
        if (data.session) {
          setSession(data.session);
          setIsAuthenticated(true);
          localStorage.setItem('egc_auth_token', data.session.access_token);
        }
        return { user: updatedUser, session: data.session, userConfirmed: !!data.session };
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // Supabase Google OAuth
  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  };

  // Fast Demo / Guest Login for rapid evaluation
  const loginDemo = (selectedRole = 'driver', emailOverride) => {
    const roleEmailMap = {
      driver: 'shani.kakadiya@daiict.ac.in',
      operator: 'operator.greenhub@evcharge.in',
      grid_operator: 'gridcontrol@gujaratgrid.gov.in'
    };
    const demoUser = {
      ...INITIAL_USER,
      email: emailOverride || roleEmailMap[selectedRole] || INITIAL_USER.email,
      role: selectedRole,
      name: selectedRole === 'grid_operator'
        ? 'Gujarat SLDC Operator'
        : selectedRole === 'operator'
        ? 'GreenHub Station Operator'
        : 'Shani Kakadiya'
    };
    setUser(demoUser);
    setIsAuthenticated(true);
    localStorage.setItem('egc_auth_token', 'demo_token_' + selectedRole);
    return demoUser;
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

  // Toggle or cycle between the 3 roles: driver -> operator -> grid_operator -> driver
  const toggleRole = () => {
    const roleCycle = {
      driver: 'operator',
      operator: 'grid_operator',
      grid_operator: 'driver'
    };
    const nextRole = roleCycle[user.role] || 'driver';
    updateProfile({ role: nextRole });
    return nextRole;
  };

  const setRole = (newRole) => {
    updateProfile({ role: newRole });
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout notice:', e);
    }
    localStorage.removeItem('egc_auth_token');
    setSession(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      isLoading,
      login,
      signup,
      loginWithGoogle,
      loginDemo,
      logout,
      updateProfile,
      updateLocation,
      toggleRole,
      setRole
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
