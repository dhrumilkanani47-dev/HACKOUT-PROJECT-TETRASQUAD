import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';
import { StationProvider } from './context/StationContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { AddVehiclePage } from './pages/AddVehiclePage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { ChargingSessionPage } from './pages/ChargingSessionPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <VehicleProvider>
        <StationProvider>
          <div className="min-h-screen bg-paper dark:bg-paper-dark text-ink dark:text-white flex flex-col font-sans selection:bg-leaf/20 selection:text-forest">
            {/* Top Navigation Bar */}
            <Navbar />

            {/* Application Routes */}
            <main className="flex-1">
              <Routes>
                {/* Public / Landing */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Dashboard & Core Features */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/map" element={<MapPage />} />
                <Route
                  path="/vehicles"
                  element={
                    <ProtectedRoute>
                      <VehiclesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vehicles/add"
                  element={
                    <ProtectedRoute>
                      <AddVehiclePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vehicles/:id"
                  element={
                    <ProtectedRoute>
                      <VehicleDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/charging/:stationId" element={<ChargingSessionPage />} />
                <Route path="/ai" element={<AiAssistantPage />} />
                <Route
                  path="/activity"
                  element={
                    <ProtectedRoute>
                      <ActivityPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Mobile Bottom Navigation Bar (Logged in) */}
            <BottomNav />
          </div>
        </StationProvider>
      </VehicleProvider>
    </AuthProvider>
  );
};

export default App;
