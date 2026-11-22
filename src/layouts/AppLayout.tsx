import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/common/AppSidebar';
import AppHeader from '../components/common/AppHeader';
import styles from './AppLayout.module.css';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  // 64px collapsed, 240px expanded
  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <Layout className={styles.layout}>
      {/* 1. Left Fixed Sidebar */}
      <AppSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* 2. Right Main Layout */}
      <Layout className={styles.mainLayout} style={{ marginLeft: sidebarWidth }}>
        {/* Top Header */}
        <AppHeader />

        {/* Dynamic Page Content */}
        <Content className={styles.content}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
