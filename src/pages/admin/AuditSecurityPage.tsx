import React, { useState } from 'react';
import { Card, Typography, Table, Button, Tag, Space, Select, Input, Alert, message } from 'antd';
import { SafetyCertificateOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export const AuditSecurityPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');

  const auditEvents = [
    {
      id: 'aud-109',
      timestamp: 'Today, 11:34 AM IST',
      category: 'Orders',
      actor: 'Ramesh Sharma (Retailer)',
      action: 'Confirmed 12,000 L Diesel refill order ORD-2026-8841 via WhatsApp bot.',
      ipAddress: '49.207.214.12 (Airtel AP)',
      severity: 'Info',
    },
    {
      id: 'aud-108',
      timestamp: 'Today, 10:15 AM IST',
      category: 'Settings',
      actor: 'Aditya Reddy (Super Admin)',
      action: 'Updated safe minimum threshold for Tank 1 (Main Diesel) from 2,500 L to 3,000 L.',
      ipAddress: '182.73.190.54 (FuelCast HQ)',
      severity: 'Medium',
    },
    {
      id: 'aud-107',
      timestamp: 'Today, 06:15 AM IST',
      category: 'Telemetry',
      actor: 'IoT Sync Engine',
      action: 'Automated batch dip ingestion: 289 of 296 retail tanks synced successfully.',
      ipAddress: 'AWS Lambda (ap-south-1)',
      severity: 'Info',
    },
    {
      id: 'aud-106',
      timestamp: 'Yesterday, 11:45 PM IST',
      category: 'Auth',
      actor: 'Unknown (IP: 103.21.144.18)',
      action: 'Failed login attempt for user "admin@fuelcast.in". Account locked for 15 mins.',
      ipAddress: '103.21.144.18 (ACT Fibernet)',
      severity: 'High',
    },
    {
      id: 'aud-105',
      timestamp: 'Yesterday, 04:20 PM IST',
      category: 'Billing',
      actor: 'Automated Billing Cron',
      action: 'Generated monthly GST invoice INV-2026-1101 for Krishna Fuels (₹16,954).',
      ipAddress: 'Internal System',
      severity: 'Info',
    },
  ];

  const filteredEvents = auditEvents.filter((ev) => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch =
      ev.action.toLowerCase().includes(searchText.toLowerCase()) ||
      ev.actor.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const columns = [
    {
      title: 'Timestamp (IST)',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time: string) => (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{time}</span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => {
        let color = 'blue';
        if (cat === 'Auth') color = 'red';
        if (cat === 'Orders') color = 'green';
        if (cat === 'Settings') color = 'orange';
        if (cat === 'Billing') color = 'purple';
        return <Tag color={color}>{cat}</Tag>;
      },
    },
    {
      title: 'Actor / Identity',
      dataIndex: 'actor',
      key: 'actor',
      render: (actor: string) => (
        <strong style={{ color: 'var(--text-primary)', fontSize: 12 }}>{actor}</strong>
      ),
    },
    {
      title: 'Action Performed',
      dataIndex: 'action',
      key: 'action',
      render: (act: string) => (
        <span style={{ color: 'var(--text-primary)', fontSize: 12 }}>{act}</span>
      ),
    },
    {
      title: 'IP Address / Node',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip: string) => (
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{ip}</span>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (sev: string) => {
        let color = 'default';
        if (sev === 'High') color = 'error';
        if (sev === 'Medium') color = 'warning';
        return <Tag color={color}>{sev}</Tag>;
      },
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            System Audit Log &amp; DPDPA Compliance
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Immutable administrative event trail and Indian Digital Personal Data Protection Act compliance tools.
          </Text>
        </div>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.success('Exported 30-day encrypted audit log (CSV)!')}
          >
            Export Log
          </Button>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
            Compliance
          </Tag>
        </Space>
      </div>

      {/* DPDPA Compliance Banner */}
      <Alert
        message={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#10B981', fontSize: 16 }} />
            <strong style={{ color: 'var(--text-primary)' }}>India DPDPA (2023) Data Protection Status: Fully Compliant</strong>
          </Space>
        }
        description={
          <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            All dealer telemetry, driver GPS tracks, and WhatsApp chat transcripts are encrypted at rest with AES-256 and stored exclusively within Indian territory (AWS ap-south-1 Hyderabad region).
          </div>
        }
        type="success"
        showIcon={false}
        style={{
          marginBottom: 20,
          borderRadius: 10,
          border: '1px solid rgba(16,185,129,0.3)',
          background: 'rgba(16,185,129,0.08)',
        }}
        action={
          <Space>
            <Button
              size="small"
              onClick={() => message.info('DSAR Subject Access Request portal ready.')}
            >
              Handle DSAR
            </Button>
            <Button
              size="small"
              danger
              onClick={() => message.info('Right to Erasure compliance request tool opened.')}
            >
              Right to Erasure
            </Button>
          </Space>
        }
      />

      {/* Audit Log Table */}
      <Card
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <Input
            placeholder="Search audit actions, actors, or IP addresses..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 340 }}
            allowClear
          />
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 160 }}
          >
            <Option value="All">All Categories</Option>
            <Option value="Orders">Orders</Option>
            <Option value="Telemetry">Telemetry</Option>
            <Option value="Settings">Settings</Option>
            <Option value="Auth">Authentication</Option>
            <Option value="Billing">Billing</Option>
          </Select>
          <div style={{ marginLeft: 'auto' }}>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              Showing {filteredEvents.length} events
            </Text>
          </div>
        </div>

        <Table
          dataSource={filteredEvents}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AuditSecurityPage;
