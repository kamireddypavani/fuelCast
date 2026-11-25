import React from 'react';
import { Avatar, Dropdown, Space, Badge } from 'antd';
import { User, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import ThemeToggle from '../ThemeToggle';
import styles from './AppHeader.module.css';

export const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const activeRole = currentUser?.role || 'DISTRIBUTOR';

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getProfilePath = () => {
    if (activeRole === 'ADMIN') return '/admin/roles';
    if (activeRole === 'DEALER') return '/dealer/profile';
    return '/distributor/profile';
  };

  const getAlertsPath = () => {
    if (activeRole === 'DEALER') return '/dealer/alerts';
    if (activeRole === 'ADMIN') return '/admin/notifications';
    return '/distributor/alerts';
  };

  const userMenuItems = [
    {
      key: 'user-header',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {currentUser?.title} • {currentUser?.tenantName}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' as const },
    {
      key: 'profile',
      icon: <User size={15} />,
      label: 'Account Profile',
      onClick: () => navigate(getProfilePath()),
    },
    {
      key: 'alerts',
      icon: <Bell size={15} />,
      label: 'Alerts & Messages',
      onClick: () => navigate(getAlertsPath()),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogOut size={15} />,
      label: 'Sign Out',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className={styles.header}>
      {/* Right-aligned Header Controls: Theme Toggle, Notifications, User Profile & Sign Out */}
      <div className={styles.rightSection}>
        {/* Dark / Light Mode Switcher */}
        <ThemeToggle />

        {/* Notifications Icon with Unread Badge */}
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Alerts"
          onClick={() => navigate(getAlertsPath())}
          title="Notifications & Alerts"
        >
          <Badge count={activeRole === 'DEALER' ? 2 : 4} size="small" offset={[-2, 2]}>
            <Bell size={20} style={{ color: 'inherit' }} />
          </Badge>
        </button>

        {/* User Dropdown */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <Space className={styles.userProfile}>
            <Avatar
              style={{
                backgroundColor:
                  activeRole === 'ADMIN'
                    ? '#7c3aed'
                    : activeRole === 'DEALER'
                      ? '#059669'
                      : 'var(--primary-color)',
                fontWeight: 700,
              }}
            >
              {currentUser?.name?.[0] || 'U'}
            </Avatar>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{currentUser?.name}</span>
              <span className={styles.userRole}>
                {currentUser?.role === 'ADMIN'
                  ? 'Platform Super Admin'
                  : currentUser?.role === 'DEALER'
                    ? 'Station Retailer'
                    : 'Regional Distributor'}
              </span>
            </div>
          </Space>
        </Dropdown>
      </div>
    </header>
  );
};

export default AppHeader;
