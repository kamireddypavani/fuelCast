import React, { useMemo, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useAppSelector } from './redux/hooks';
import type { UserRole } from './redux/slices/authSlice';
import { resolveThemeDefinition, createAntdThemeConfig, applyThemeToDocument } from './theme/themeManager';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/login/login';

// Dealer Retail Station Pages
import { DealerStationPage } from './pages/dealer/DealerStationPage';
import { DealerOrdersPage } from './pages/dealer/DealerOrdersPage';
import { DealerAlertsPage } from './pages/dealer/DealerAlertsPage';
import { DealerProfilePage } from './pages/dealer/DealerProfilePage';
import { DealerAddStationPage } from './pages/dealer/DealerAddStationPage';
import { DealerComplaintsPage } from './pages/dealer/DealerComplaintsPage';
import { DealerAiForecastPage } from './pages/dealer/DealerAiForecastPage';

// Distributor Module Pages (S Series)
import NetworkDashboard from './pages/distributor/NetworkDashboard';
import NetworkMapDashboard from './pages/distributor/NetworkMapDashboard';
import PumpDetailPage from './pages/distributor/PumpDetailPage';
import OrderKanbanPage from './pages/distributor/OrderKanbanPage';
import AlertsCenterPage from './pages/distributor/AlertsCenterPage';
import CompanyProfilePage from './pages/distributor/CompanyProfilePage';
import RefillCalendarPage from './pages/distributor/RefillCalendarPage';
import DistributorClientsPage from './pages/distributor/DistributorClientsPage';
import { DistributorComplaintsPage } from './pages/distributor/DistributorComplaintsPage';

// Admin SaaS Module Pages (A Series)
import PlatformDashboard from './pages/admin/PlatformDashboard';
import AllPumpsRegistryPage from './pages/admin/AllPumpsRegistryPage';
import DistributorDirectoryPage from './pages/admin/DistributorDirectoryPage';
import DataConnectionsPage from './pages/admin/DataConnectionsPage';
import MasterSettingsPage from './pages/admin/MasterSettingsPage';
import NotificationsHubPage from './pages/admin/NotificationsHubPage';
import BillingLedgerPage from './pages/admin/BillingLedgerPage';
import AiAccuracyPage from './pages/admin/AiAccuracyPage';
import TeamRolesPage from './pages/admin/TeamRolesPage';
import UserDirectoryPage from './pages/admin/UserDirectoryPage';
import AuditSecurityPage from './pages/admin/AuditSecurityPage';

import './styles/global.css';

/**
 * Senior Developer Enterprise RoleRedirect:
 * Redirects user to their dedicated portal based on their authenticated role.
 */
const RoleRedirect: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user?.role === 'DEALER') {
    return <Navigate to="/dealer/dashboard" replace />;
  }
  return <Navigate to="/distributor/dashboard" replace />;
};

/**
 * Strict Role Route Guard:
 * Blocks unauthorized role access. If an Administrator, Distributor, or Dealer attempts
 * to open another role's screens, they are immediately redirected back to their own portal.
 */
const RoleRoute: React.FC<{ role: UserRole; children: React.ReactNode }> = ({ role, children }) => {
  const user = useAppSelector((state) => state.auth.user);
  if (user?.role !== role) {
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'DEALER') return <Navigate to="/dealer/dashboard" replace />;
    return <Navigate to="/distributor/dashboard" replace />;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
  // 1. Stand-alone Login Page
  {
    path: '/login',
    element: <LoginPage />,
  },
  // 2. Main Portal Shell
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <RoleRedirect />,
      },
      {
        path: 'dashboard',
        element: <RoleRedirect />,
      },

      // --- Dealer Retail Station Routes (Dealer Only) ---
      {
        path: 'dealer/dashboard',
        element: (
          <RoleRoute role="DEALER">
            <DealerStationPage />
          </RoleRoute>
        ),
      },
      {
        path: 'dealer/forecast',
        element: (
          <RoleRoute role="DEALER">
            <DealerAiForecastPage />
          </RoleRoute>
        ),
      },
      {
        path: 'dealer/stations/new',
        element: (
          <RoleRoute role="DEALER">
            <DealerAddStationPage />
          </RoleRoute>
        ),
      },
      {
        path: 'dealer/orders',
        element: (
          <RoleRoute role="DEALER">
            <DealerOrdersPage />
          </RoleRoute>
        ),
      },
      {
        path: 'dealer/complaints',
        element: (
          <RoleRoute role="DEALER">
            <DealerComplaintsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'dealer/alerts',
        element: (
          <RoleRoute role="DEALER">
            <DealerAlertsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'dealer/profile',
        element: (
          <RoleRoute role="DEALER">
            <DealerProfilePage />
          </RoleRoute>
        ),
      },

      // --- Distributor Module Routes (Distributor Only) ---
      {
        path: 'distributor/dashboard',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <NetworkDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/clients',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <DistributorClientsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/dashboard/map',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <NetworkMapDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/pumps/new',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <DealerAddStationPage />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/pumps/:id',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <PumpDetailPage />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/orders',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <OrderKanbanPage />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/alerts',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <AlertsCenterPage />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/profile',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <CompanyProfilePage />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/calendar',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <RefillCalendarPage />
          </RoleRoute>
        ),
      },
      {
        path: 'distributor/complaints',
        element: (
          <RoleRoute role="DISTRIBUTOR">
            <DistributorComplaintsPage />
          </RoleRoute>
        ),
      },

      // --- Admin SaaS Module Routes (Administrator Only) ---
      {
        path: 'admin/dashboard',
        element: (
          <RoleRoute role="ADMIN">
            <PlatformDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/pumps',
        element: (
          <RoleRoute role="ADMIN">
            <AllPumpsRegistryPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/distributors',
        element: (
          <RoleRoute role="ADMIN">
            <DistributorDirectoryPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/connections',
        element: (
          <RoleRoute role="ADMIN">
            <DataConnectionsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/settings',
        element: (
          <RoleRoute role="ADMIN">
            <MasterSettingsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/notifications',
        element: (
          <RoleRoute role="ADMIN">
            <NotificationsHubPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/billing',
        element: (
          <RoleRoute role="ADMIN">
            <BillingLedgerPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/ai-accuracy',
        element: (
          <RoleRoute role="ADMIN">
            <AiAccuracyPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/roles',
        element: (
          <RoleRoute role="ADMIN">
            <TeamRolesPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <RoleRoute role="ADMIN">
            <UserDirectoryPage />
          </RoleRoute>
        ),
      },
      {
        path: 'admin/audit',
        element: (
          <RoleRoute role="ADMIN">
            <AuditSecurityPage />
          </RoleRoute>
        ),
      },
    ],
  },
  // 3. Fallback catch-all
  {
    path: '*',
    element: <RoleRedirect />,
  },
]);

export default function App() {
  const activeThemeId = useAppSelector((state) => state.theme.activeThemeId);
  const themeConfig = useMemo(() => {
    const def = resolveThemeDefinition(activeThemeId);
    return createAntdThemeConfig(def);
  }, [activeThemeId]);

  useEffect(() => {
    const def = resolveThemeDefinition(activeThemeId);
    applyThemeToDocument(def);
  }, [activeThemeId]);

  return (
    <ConfigProvider theme={themeConfig}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
