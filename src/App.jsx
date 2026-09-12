import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';
import { StationProvider } from './context/StationContext';
import { DrawerProvider } from './context/DrawerContext';
import { MobileAppShell } from './components/mobile/MobileAppShell';

// 13 Mobile Screens from Attachment
import { MobileSplashScreen } from './pages/mobile/MobileSplashScreen';
import { MobileLoginScreen } from './pages/mobile/MobileLoginScreen';
import { MobileHomeScreen } from './pages/mobile/MobileHomeScreen';
import { MobileMapScreen } from './pages/mobile/MobileMapScreen';
import { MobileStationDetailsScreen } from './pages/mobile/MobileStationDetailsScreen';
import { MobileSmartChargingScreen } from './pages/mobile/MobileSmartChargingScreen';
import { MobileChargingSessionScreen } from './pages/mobile/MobileChargingSessionScreen';
import { MobilePriceGreenScoreScreen } from './pages/mobile/MobilePriceGreenScoreScreen';
import { MobileHistoryScreen } from './pages/mobile/MobileHistoryScreen';
import { MobileNotificationsScreen } from './pages/mobile/MobileNotificationsScreen';
import { MobileOperatorDashboardScreen } from './pages/mobile/MobileOperatorDashboardScreen';
import { MobileProfileScreen } from './pages/mobile/MobileProfileScreen';
import { useAuth } from './context/AuthContext';

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RequireOperator = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === 'operator' ? children : <Navigate to="/" replace />;
};

const PublicOnly = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export const App = () => {
  return (
    <AuthProvider>
      <VehicleProvider>
        <StationProvider>
          <DrawerProvider>
            <MobileAppShell>
              <Routes>
                {/* Screen 01: Splash Screen */}
                <Route path="/splash" element={<MobileSplashScreen />} />

                {/* Screen 02: Login / Sign Up */}
                <Route path="/login" element={<PublicOnly><MobileLoginScreen /></PublicOnly>} />
                <Route path="/signup" element={<PublicOnly><MobileLoginScreen /></PublicOnly>} />

                {/* Screen 03: Home / Dashboard */}
                <Route path="/" element={<RequireAuth><MobileHomeScreen /></RequireAuth>} />
                <Route path="/dashboard" element={<RequireAuth><MobileHomeScreen /></RequireAuth>} />

                {/* Screen 04: Map & Charging Stations */}
                <Route path="/map" element={<RequireAuth><MobileMapScreen /></RequireAuth>} />

                {/* Screen 05: Station Details */}
                <Route path="/station/:id" element={<RequireAuth><MobileStationDetailsScreen /></RequireAuth>} />

                {/* Screen 07: Smart Charging */}
                <Route path="/smart-charge" element={<RequireAuth><MobileSmartChargingScreen /></RequireAuth>} />

                {/* Screen 08: Charging Session Progress */}
                <Route path="/charging" element={<RequireAuth><MobileChargingSessionScreen /></RequireAuth>} />
                <Route path="/charging/:stationId" element={<RequireAuth><MobileChargingSessionScreen /></RequireAuth>} />

                {/* Screen 09: Price & Green Score */}
                <Route path="/price-score" element={<RequireAuth><MobilePriceGreenScoreScreen /></RequireAuth>} />

                {/* Screen 10: Charging History */}
                <Route path="/history" element={<RequireAuth><MobileHistoryScreen /></RequireAuth>} />
                <Route path="/activity" element={<RequireAuth><MobileHistoryScreen /></RequireAuth>} />

                {/* Screen 11: Notifications & Price Alert */}
                <Route path="/notifications" element={<RequireAuth><MobileNotificationsScreen /></RequireAuth>} />

                {/* Screen 12: Operator Dashboard */}
                <Route path="/operator" element={<RequireOperator><MobileOperatorDashboardScreen /></RequireOperator>} />

                {/* Screen 13: Profile & Settings */}
                <Route path="/profile" element={<RequireAuth><MobileProfileScreen /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><MobileProfileScreen /></RequireAuth>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MobileAppShell>
          </DrawerProvider>
        </StationProvider>
      </VehicleProvider>
    </AuthProvider>
  );
};

export default App;
