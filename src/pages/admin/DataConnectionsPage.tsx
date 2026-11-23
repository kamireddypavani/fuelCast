import React from 'react';
import { Row, Col, Card, Typography, Table, Button, Tag, Space, Timeline, message } from 'antd';
import { CloudSyncOutlined, ReloadOutlined, CheckCircleOutlined, ClockCircleOutlined, WhatsAppOutlined, FormOutlined, DisconnectOutlined } from '@ant-design/icons';
import { MOCK_FAILED_SYNCS } from '../../mock/fuelcastData';

const { Title, Text } = Typography;

export const DataConnectionsPage: React.FC = () => {
  const handleRetryAll = () => {
    message.loading({ content: 'Retrying sync on all 5 desynced consoles...', key: 'retry-all' });
    setTimeout(() => {
      message.success({ content: '3 consoles re-established connection! 2 remain offline.', key: 'retry-all' });
    }, 1200);
  };

  const handleNudgeOwner = (name: string) => {
    message.success(`Automated WhatsApp nudge sent to station owner at ${name}!`);
  };

  const failedSyncColumns = [
    {
      title: 'Pump Station & Tenant',
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
      title: 'Failure Category',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => {
        let color = 'error';
        if (reason.includes('Dealer') || reason.includes('Owner')) color = 'warning';
        return <Tag color={color}>{reason}</Tag>;
      },
    },
    {
      title: 'Last Ping',
      dataIndex: 'failedAt',
      key: 'failedAt',
      render: (time: string) => (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{time}</span>
      ),
    },
    {
      title: 'Recovery Action',
      key: 'action',
      render: (_: any, r: any) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => {
              message.success(`Retrying ATG console connection for ${r.pumpName}...`);
            }}
          >
            Retry
          </Button>
          <Button
            size="small"
            icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
            onClick={() => handleNudgeOwner(r.pumpName)}
          >
            Nudge Owner
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            Data Connections &amp; Telemetry Pipelines
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Monitor automated tank gauge (ATG) IoT sync runs, CSV batch ingestions, and failed dip alerts.
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRetryAll}>
            Retry All Failed (5)
          </Button>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
            IoT Pipelines
          </Tag>
        </Space>
      </div>

      {/* Sync Health Counters */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 12 }}>
              <span>Auto-Sync (IoT ATG)</span>
              <CloudSyncOutlined style={{ color: '#2563EB', fontSize: 16 }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>
              214 Pumps
            </div>
            <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>
              72.3% of total network (Active)
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
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 12 }}>
              <span>Manual WhatsApp Dip</span>
              <FormOutlined style={{ color: '#F59E0B', fontSize: 16 }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>
              61 Pumps
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              20.6% manual submissions
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
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 12 }}>
              <span>CSV Batch Imports</span>
              <CheckCircleOutlined style={{ color: '#10B981', fontSize: 16 }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>
              21 Pumps
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              7.1% ERP synced daily
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
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 12 }}>
              <span>Desynced / Offline</span>
              <DisconnectOutlined style={{ color: '#EF4444', fontSize: 16 }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#EF4444', marginTop: 6 }}>
              5 Pumps
            </div>
            <div style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>
              Requires attention
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {/* Left Column: Scheduled Runs Timeline (10 cols) */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#2563EB' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Daily Ingestion Pipeline Runs</span>
              </Space>
            }
            style={{
              background: 'var(--panel-bg)',
              borderColor: 'var(--border-color)',
              borderRadius: 12,
            }}
          >
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        06:00 AM • Morning Opening Dip Run
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        289 of 296 received on schedule (97.6%). Average sync latency 4.2 minutes across Veeder-Root consoles.
                      </div>
                      <Tag color="success" style={{ marginTop: 4 }}>Completed</Tag>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        02:00 PM • Mid-Day Sales Re-calibration
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        294 pumps processed. Recalculated burn rates for high-traffic highway stations on NH-16.
                      </div>
                      <Tag color="success" style={{ marginTop: 4 }}>Completed</Tag>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        10:00 PM • Closing Stock Dip Run
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        Scheduled execution in 9 hours. Ingests night dips to feed AI overnight forecast at 11:30 PM IST.
                      </div>
                      <Tag color="processing" style={{ marginTop: 4 }}>Upcoming (10:00 PM IST)</Tag>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Right Column: Failed Syncs Recovery Table (14 cols) */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  Failed Telemetry Connections (5 Pumps)
                </span>
                <Tag color="error">Needs Recovery</Tag>
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

export default DataConnectionsPage;
