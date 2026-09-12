import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Zap, Sparkles, MapPin, Car, Activity, User, Shield, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, toggleRole } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-forest/10 dark:border-white/10 safe-pt transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest to-forest-2 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-forest dark:text-emerald-400 tracking-tight leading-none">
              EV GreenCharge
            </span>
            <span className="text-[10px] text-ink-soft dark:text-ink-muted font-medium">
              Charge Green. Drive Clean.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-heading font-medium transition-colors ${
                isActive ? 'bg-forest-100 dark:bg-forest-950/70 text-forest dark:text-emerald-400' : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-heading font-medium transition-colors ${
                isActive ? 'bg-forest-100 dark:bg-forest-950/70 text-forest dark:text-emerald-400' : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-heading font-medium transition-colors ${
                isActive ? 'bg-forest-100 dark:bg-forest-950/70 text-forest dark:text-emerald-400' : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`
            }
          >
            Map
          </NavLink>
          <NavLink
            to="/vehicles"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-heading font-medium transition-colors ${
                isActive ? 'bg-forest-100 dark:bg-forest-950/70 text-forest dark:text-emerald-400' : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`
            }
          >
            My EV
          </NavLink>
          <NavLink
            to="/ai"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-heading font-semibold transition-colors ${
                isActive
                  ? 'bg-forest text-white shadow-sm'
                  : 'text-forest dark:text-emerald-300 hover:bg-forest-50 dark:hover:bg-forest-950/50'
              }`
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            AI Assistant
          </NavLink>
          <NavLink
            to="/activity"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-heading font-medium transition-colors ${
                isActive ? 'bg-forest-100 dark:bg-forest-950/70 text-forest dark:text-emerald-400' : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`
            }
          >
            Activity
          </NavLink>
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2">
          {/* Role Pill Switch */}
          <button
            onClick={toggleRole}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-semibold bg-white dark:bg-paper-cardDark border border-forest/15 hover:border-forest text-forest dark:text-emerald-400 shadow-sm transition-all"
            title="Toggle between Driver and Operator mode"
          >
            <Shield className="w-3 h-3 text-leaf" />
            <span>{user?.role === 'operator' ? 'Operator' : 'Driver'}</span>
          </button>

          {/* Location Badge */}
          <Link
            to="/settings"
            className="hidden lg:flex items-center gap-1 text-xs text-ink-soft dark:text-ink-muted px-2 py-1 rounded-lg hover:bg-forest-50 dark:hover:bg-forest-950/30"
          >
            <MapPin className="w-3.5 h-3.5 text-forest dark:text-emerald-400" />
            <span className="truncate max-w-[110px]">{user?.city || 'Gandhinagar'}</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-ink-soft dark:text-ink-muted hover:text-forest hover:bg-forest-50 dark:hover:bg-forest-950/50 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* AI Quick Button on Mobile */}
          <Link
            to="/ai"
            className="md:hidden p-2 rounded-xl bg-forest-100 dark:bg-forest-950/60 text-forest dark:text-emerald-300"
            aria-label="AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-forest dark:text-emerald-400" />
          </Link>

          {/* Auth Button or Profile Link */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-forest-50 dark:hover:bg-forest-950/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-forest to-forest-2 text-white flex items-center justify-center font-heading font-bold text-xs shadow-sm">
                {user?.name?.charAt(0) || 'S'}
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-xl bg-forest text-white text-xs font-heading font-semibold hover:bg-forest-600 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
