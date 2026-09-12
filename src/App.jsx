import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';
import { StationProvider } from './context/StationContext';
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

export const App = () => {
  return (
    <AuthProvider>
      <VehicleProvider>
        <StationProvider>
          <MobileAppShell>
            <Routes>
              {/* Screen 01: Splash Screen */}
              <Route path="/splash" element={<MobileSplashScreen />} />

              {/* Screen 02: Login / Sign Up */}
              <Route path="/login" element={<MobileLoginScreen />} />
              <Route path="/signup" element={<MobileLoginScreen />} />

              {/* Screen 03: Home / Dashboard */}
              <Route path="/" element={<MobileHomeScreen />} />
              <Route path="/dashboard" element={<MobileHomeScreen />} />

              {/* Screen 04: Map & Charging Stations */}
              <Route path="/map" element={<MobileMapScreen />} />

              {/* Screen 05: Station Details */}
              <Route path="/station/:id" element={<MobileStationDetailsScreen />} />

              {/* Screen 07: Smart Charging */}
              <Route path="/smart-charge" element={<MobileSmartChargingScreen />} />

              {/* Screen 08: Charging Session Progress */}
              <Route path="/charging" element={<MobileChargingSessionScreen />} />
              <Route path="/charging/:stationId" element={<MobileChargingSessionScreen />} />

              {/* Screen 09: Price & Green Score */}
              <Route path="/price-score" element={<MobilePriceGreenScoreScreen />} />

              {/* Screen 10: Charging History */}
              <Route path="/history" element={<MobileHistoryScreen />} />
              <Route path="/activity" element={<MobileHistoryScreen />} />

              {/* Screen 11: Notifications & Price Alert */}
              <Route path="/notifications" element={<MobileNotificationsScreen />} />

              {/* Screen 12: Operator Dashboard */}
              <Route path="/operator" element={<MobileOperatorDashboardScreen />} />

              {/* Screen 13: Profile & Settings */}
              <Route path="/profile" element={<MobileProfileScreen />} />
              <Route path="/settings" element={<MobileProfileScreen />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MobileAppShell>
        </StationProvider>
      </VehicleProvider>
    </AuthProvider>
  );
};

export default App;
