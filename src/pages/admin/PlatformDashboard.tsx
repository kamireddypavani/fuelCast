import React from 'react';
import { Row, Col, Card, Typography, Progress, Table, Tag, Button, Badge, Space, message } from 'antd';
import {
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  SendOutlined,
  DatabaseOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MOCK_DISTRIBUTORS, MOCK_FAILED_SYNCS } from '../../mock/fuelcastData';

const { Title, Text } = Typography;

export const PlatformDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleRetrySync = (id: string, pumpName: string) => {
    message.loading({ content: `Initiating telemetry retry for ${pumpName}...`, key: id });
    setTimeout(() => {
      message.success({ content: `Telemetry sync restored for ${pumpName}! 2 tanks updated.`, key: id });
    }, 800);
  };

  const distributorColumns = [
    {
      title: 'Distributor Partner',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string, r: any) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text || r.companyName}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {r.headquarters} • Code: {r.id.toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      title: 'Plan Tier',
      dataIndex: 'planTier',
      key: 'planTier',
      render: (tier: string) => (
        <Tag color={tier === 'Enterprise' ? 'purple' : 'blue'}>{tier}</Tag>
      ),
    },
    {
      title: 'Pumps Monitored',
      key: 'pumps',
      render: (_: any, r: any) => {
        const percent = Math.round((r.activePumps / r.planQuota) * 100);
        return (
          <div style={{ width: 140 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
              <span style={{ color: 'var(--text-primary)' }}>{r.activePumps} / {r.planQuota}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{percent}%</span>
            </div>
            <Progress percent={percent} size="small" strokeColor={percent > 90 ? '#FAAD14' : '#2563EB'} showInfo={false} />
          </div>
        );
      },
    },
    {
      title: 'Monthly Run-Rate',
      dataIndex: 'monthlyFeeInr',
      key: 'monthlyFeeInr',
      render: (fee: number) => (
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          ₹{(fee || 14000).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Health',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'Active' ? 'success' : 'warning'} text={<span style={{ color: 'var(--text-primary)' }}>{status}</span>} />
      ),
    },
  ];

  const failedSyncColumns = [
    {
      title: 'Pump Station',
      dataIndex: 'pumpName',
      key: 'pumpName',
      render: (text: string, r: any) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.distributorName}</div>
        </div>
      ),
    },
    {
      title: 'Failure Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => (
        <Tag color="error">{reason}</Tag>
      ),
    },
    {
      title: 'Last Reading Attempt',
      dataIndex: 'failedAt',
      key: 'failedAt',
      render: (time: string) => (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{time}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, r: any) => (
        <Button
          size="small"
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => handleRetrySync(r.id, r.pumpName)}
        >
          Retry Sync
        </Button>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            Platform Executive Overview
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            SaaS Administration • Multi-Tenant Telemetry Monitor &amp; System Health.
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => message.success('Telemetry pipelines refreshed across all 12 distributors!')}
          >
            Refresh All
          </Button>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
            Super Admin Dashboard
          </Tag>
        </Space>
      </div>

      {/* Top 4 Platform KPIs */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 13 }}>
              <span>Distributor Partners</span>
              <SafetyCertificateOutlined style={{ color: '#2563EB', fontSize: 18 }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
              12
            </div>
            <div style={{ fontSize: 12, color: '#10B981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpOutlined />
              <span>+2 onboarded this month</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 13 }}>
              <span>Monitored Pumps</span>
              <DatabaseOutlined style={{ color: '#38BDF8', fontSize: 18 }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
              296
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              284 Live • 8 Setup • 4 Inactive
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 13 }}>
              <span>Readings Compliance</span>
              <ThunderboltOutlined style={{ color: '#F59E0B', fontSize: 18 }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
              98.3%
            </div>
            <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>
              291 of 296 received on time (SLA 95%)
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 13 }}>
              <span>WhatsApp Alerts Sent</span>
              <SendOutlined style={{ color: '#10B981', fontSize: 18 }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
              412
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Zero critical alert delivery misses
            </div>
          </Card>
        </Col>
      </Row>

      {/* Background Services Status Bar */}
      <Card
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size="large">
            <div>
              <Text style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>Telemetry Sync Engine</Text>
              <Badge status="processing" text={<span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Healthy (32ms avg)</span>} />
            </div>
            <div>
              <Text style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>AI Forecasting (Prophet/LightGBM)</Text>
              <Badge status="success" text={<span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Active (Last run 11:30 PM IST)</span>} />
            </div>
            <div>
              <Text style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>WhatsApp Cloud API</Text>
              <Badge status="success" text={<span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Connected (99.98% delivery)</span>} />
            </div>
            <div>
              <Text style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>DPDPA Data Residency</Text>
              <Badge status="success" text={<span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AWS ap-south-1 (Hyderabad)</span>} />
            </div>
          </Space>
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => navigate('/admin/connections')}
          >
            Configure Pipelines
          </Button>
        </div>
      </Card>

      <Row gutter={[20, 20]}>
        {/* Left Column: Distributor Directory Overview (14 cols) */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Active Distributor Partners</span>
                <Button size="small" onClick={() => navigate('/admin/distributors')}>
                  View All (12)
                </Button>
              </div>
            }
            style={{
              background: 'var(--panel-bg)',
              borderColor: 'var(--border-color)',
              borderRadius: 12,
            }}
          >
            <Table
              dataSource={MOCK_DISTRIBUTORS}
              columns={distributorColumns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Right Column: Failed Syncs Recovery Table (10 cols) */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Failed Syncs Requiring Action (5)</span>
                <Tag color="error">Action Needed</Tag>
              </div>
            }
            style={{
              background: 'var(--panel-bg)',
              borderColor: 'var(--border-color)',
              borderRadius: 12,
            }}
          >
            <Table
              dataSource={MOCK_FAILED_SYNCS}
              columns={failedSyncColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlatformDashboard;
