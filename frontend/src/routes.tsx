import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { WatchesPage } from './pages/watches/WatchesPage';
import { WatchDetailPage } from './pages/watches/WatchDetailPage';
import { AddWatchPage } from './pages/watches/AddWatchPage';
import { TransferPage } from './pages/transfers/TransferPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsLayout } from './pages/settings/SettingsLayout';
import { AccountSettings } from './pages/settings/AccountSettings';
import { SecuritySettings } from './pages/settings/SecuritySettings';
import { NotificationsSettings } from './pages/settings/NotificationsSettings';
import { PrivacySettings } from './pages/settings/PrivacySettings';
import { HelpSettings } from './pages/settings/HelpSettings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/auth/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="watches" element={<WatchesPage />} />
        <Route path="watches/add" element={<AddWatchPage />} />
        <Route path="watches/:id" element={<WatchDetailPage />} />
        <Route path="transfer/:watchId" element={<TransferPage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Settings routes */}
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="account" replace />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="notifications" element={<NotificationsSettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="help" element={<HelpSettings />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
