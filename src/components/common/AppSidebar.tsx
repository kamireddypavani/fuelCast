import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Fuel,
  Kanban,
  BellRing,
  Truck,
  PlusCircle,
  Calendar,
  ShieldAlert,
  Building2,
  Radio,
  Sliders,
  Send,
  CreditCard,
  LineChart,
  UserCheck,
  History,
  Users,
  ChevronLeft,
  Sparkles,
  Shield,
  Gauge,
  AlertCircle,
} from 'lucide-react';
import { useAppSelector } from '../../redux/hooks';
import { FuelCastLogo } from '../FuelCastLogo';
import styles from './AppSidebar.module.css';

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((state) => state.auth.user);
  const role = currentUser?.role || 'DISTRIBUTOR';

  // 1. Dealer Specific Navigation Items (Only Dealer screens)
  const dealerMenuItems = [
    {
      key: '/dealer/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: '/dealer/forecast',
      icon: <Sparkles size={18} />,
      label: 'AI Fuel Forecast',
    },
    {
      key: '/dealer/orders',
      icon: <Kanban size={18} />,
      label: 'Refill Deliveries',
    },
    {
      key: '/dealer/stations/new',
      icon: <PlusCircle size={18} />,
      label: 'Add Pump Station',
    },
    {
      key: '/dealer/complaints',
      icon: <AlertCircle size={18} />,
      label: 'Delivery Disputes',
    },
    {
      key: '/dealer/alerts',
      icon: <BellRing size={18} />,
      label: 'Station Alerts',
    },
    {
      key: '/dealer/profile',
      icon: <Building2 size={18} />,
      label: 'Station Profile & Depot',
    },
  ];

  // 2. Distributor Regional Network Navigation Items
  const distributorMenuItems = [
    {
      key: '/distributor/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: '/distributor/dashboard/map',
      icon: <MapPin size={18} />,
      label: 'Network Map',
    },
    {
      key: '/distributor/pumps/pump-1',
      icon: <Fuel size={18} />,
      label: 'Station Tanks',
    },
    {
      key: '/distributor/orders',
      icon: <Kanban size={18} />,
      label: 'Refill Pipeline',
    },
    /* Commented out Alerts menu as requested
    {
      key: '/distributor/alerts',
      icon: <BellRing size={18} />,
      label: 'Alerts',
    },
    */
    {
      key: '/distributor/profile',
      icon: <Truck size={18} />,
      label: 'Tanker Fleet',
    },
    {
      key: '/distributor/clients',
      icon: <Users size={18} />,
      label: 'Retailer Management',
    },
    {
      key: '/distributor/complaints',
      icon: <AlertCircle size={18} />,
      label: 'Retailer Assistance',
    },
    {
      key: '/distributor/calendar',
      icon: <Calendar size={18} />,
      label: 'Refill Schedule',
    },
  ];

  // 3. Admin Global SaaS Navigation Items
  const adminMenuItems = [
    {
      key: '/admin/dashboard',
      icon: <ShieldAlert size={18} />,
      label: 'Platform Overview',
    },
    {
      key: '/admin/pumps',
      icon: <Fuel size={18} />,
      label: 'All Pumps Registry',
    },
    {
      key: '/admin/distributors',
      icon: <Building2 size={18} />,
      label: 'Distributor Directory',
    },
    {
      key: '/admin/connections',
      icon: <Radio size={18} />,
      label: 'Data Connections',
    },
    {
      key: '/admin/settings',
      icon: <Sliders size={18} />,
      label: 'Master Settings',
    },
    {
      key: '/admin/notifications',
      icon: <Send size={18} />,
      label: 'WhatsApp Hub',
    },
    {
      key: '/admin/billing',
      icon: <CreditCard size={18} />,
      label: 'Billing & Ledger',
    },
    {
      key: '/admin/ai-accuracy',
      icon: <LineChart size={18} />,
      label: 'AI Forecast Accuracy',
    },
    {
      key: '/admin/roles',
      icon: <UserCheck size={18} />,
      label: 'Team & Roles',
    },
    {
      key: '/admin/users',
      icon: <Users size={18} />,
      label: 'User Directory',
    },
    {
      key: '/admin/audit',
      icon: <History size={18} />,
      label: 'Audit & Compliance',
    },
  ];

  // The sidebar renders ONLY the menu items for the logged-in user's role
  const menuItems =
    role === 'ADMIN'
      ? adminMenuItems
      : role === 'DEALER'
        ? dealerMenuItems
        : distributorMenuItems;

  const roleMeta = {
    ADMIN: {
      badge: 'Platform Administrator',
      name: currentUser?.tenantName || 'FuelCast Global SaaS',
      className: styles.personaAdmin,
      letter: 'A',
      icon: <Shield size={16} />,
    },
    DISTRIBUTOR: {
      badge: 'Regional Distributor',
      name: currentUser?.tenantName || 'Krishna Petroleum',
      className: styles.personaDistributor,
      letter: 'D',
      icon: <Building2 size={16} />,
    },
    DEALER: {
      badge: 'Station Retailer',
      name: currentUser?.stationName || 'Sharma Fuels (Benz Circle)',
      className: styles.personaDealer,
      letter: 'R',
      icon: <Gauge size={16} />,
    },
  }[role];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={256}
      collapsedWidth={68}
      className={styles.sider}
    >
      {/* Brand Header with FuelCast Logo on Left and Collapse Toggle on Right */}
      <div className={`${styles.logoContainer} ${collapsed ? styles.collapsedLogo : ''}`}>
        {!collapsed ? (
          <>
            <div className={styles.logoWrapper}>
              <FuelCastLogo size="sm" iconOnly={false} showTagline={false} />
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              className={styles.topCollapseBtn}
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        ) : (
          <Tooltip title="Expand Sidebar" placement="right">
            <button
              type="button"
              onClick={onToggleCollapse}
              className={styles.collapsedExpandBtn}
              aria-label="Expand Sidebar"
            >
              <FuelCastLogo size="sm" iconOnly={true} showTagline={false} />
            </button>
          </Tooltip>
        )}
      </div>

      {/* Role / Persona Banner */}
      {!collapsed ? (
        <div className={styles.personaContainer}>
          <div className={styles.personaCard}>
            <div className={`${styles.personaIcon} ${roleMeta.className}`}>
              {roleMeta.icon}
            </div>
            <div className={styles.personaMeta}>
              <span className={styles.personaRoleBadge}>{roleMeta.badge}</span>
              <span className={styles.personaName} title={roleMeta.name}>
                {roleMeta.name}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.collapsedPersonaPill}>
          <Tooltip title={`${roleMeta.badge} • ${roleMeta.name}`} placement="right">
            <div className={`${styles.collapsedPersonaDot} ${roleMeta.className}`}>
              {roleMeta.letter}
            </div>
          </Tooltip>
        </div>
      )}

      {/* Navigation Menu (Strictly scoped to the logged-in user's role) */}
      <div className={styles.menuScrollArea}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          className={styles.menu}
        />
      </div>

      {/* Bottom Ambient Petrol Pump Widget - Commented out as requested */}
      {/*
      {!collapsed && (
        <div className={styles.ambientWidget}>
          <div className={styles.ambientBadge}>
            <Sparkles size={12} className={styles.sparkleIcon} />
            <span>AI Telemetry Active</span>
          </div>
          <div className={styles.ambientSlogan}>
            &ldquo;Never run dry again. Refill on time. Two readings a day, zero stockouts.&rdquo;
          </div>
          <div className={styles.ambientPumpsGraphic}>
            <div className={styles.miniPump} />
            <div className={styles.miniPump} />
            <div className={styles.miniPump} />
          </div>
        </div>
      )}
      */}
    </Sider>
  );
};

export default AppSidebar;
