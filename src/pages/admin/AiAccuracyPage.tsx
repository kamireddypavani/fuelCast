import React from 'react';
import { Row, Col, Card, Typography, Table, Button, Tag, Progress, Space, message } from 'antd';
import { LineChartOutlined, SlidersOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const AiAccuracyPage: React.FC = () => {
  const lowConfidencePumps = [
    {
      id: 'pump-4',
      name: 'Sri Venkateswara Highway Outpost',
      code: 'FC-VJA-04',
      reason: 'NH-16 bridge repair traffic diversion caused sudden +38% diesel surge.',
      confidence: 76,
      currentMape: 6.8,
      status: 'Needs Review',
    },
    {
      id: 'pump-5',
      name: 'Annapurna Auto Fuels',
      code: 'FC-HYD-02',
      reason: 'Manual stick dip missed for 3 days; baseline estimated via neighbor interpolation.',
      confidence: 81,
      currentMape: 5.4,
      status: 'Needs Dip',
    },
  ];

  const columns = [
    {
      title: 'Station & Code',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, r: any) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.code}</div>
        </div>
      ),
    },
    {
      title: 'Variance Anomaly Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{reason}</span>
      ),
    },
    {
      title: 'Model Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (conf: number) => (
        <div style={{ width: 120 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: conf < 80 ? '#EF4444' : '#F59E0B' }}>
            {conf}% Confidence
          </div>
          <Progress
            percent={conf}
            size="small"
            strokeColor={conf < 80 ? '#EF4444' : '#F59E0B'}
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, r: any) => (
        <Button
          size="small"
          type="primary"
          icon={<SlidersOutlined />}
          onClick={() => message.success(`Recalibrating model weights for ${r.name}...`)}
        >
          Recalibrate
        </Button>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            AI Forecast Accuracy &amp; Model Telemetry
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Continuous backtesting of Prophet time-series and LightGBM ensemble depletion algorithms.
          </Text>
        </div>
        <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
          AI Analytics
        </Tag>
      </div>

      {/* Accuracy KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Global Hybrid Accuracy</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#10B981', marginTop: 4 }}>97.1%</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Across 296 monitored retail stations
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Mean Absolute Error (MAPE)</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#2563EB', marginTop: 4 }}>2.9%</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Target SLA is &lt; 5.0% error
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Stock-out Prevention Rate</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#A855F7', marginTop: 4 }}>100%</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Zero unexpected pump dry-outs in 90 days
            </div>
          </Card>
        </Col>
      </Row>

      {/* Model Comparison Card */}
      <Card
        title={
          <Space>
            <LineChartOutlined style={{ color: '#2563EB' }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Algorithmic Model Benchmark Comparison</span>
          </Space>
        }
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div
              style={{
                background: 'var(--bg-primary)',
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Prophet Time-Series Engine</strong>
                <Tag color="blue">Primary Baseline</Tag>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>94.6% Accuracy</div>
              <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Captures weekly seasonality (higher highway trucking on Fridays/Sundays) and long-term trend shifts.
              </Text>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                background: 'var(--bg-primary)',
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong style={{ color: 'var(--text-primary)' }}>LightGBM Gradient Boosting</strong>
                <Tag color="purple">Machine Learning</Tag>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>96.2% Accuracy</div>
              <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Incorporates weather patterns, diesel price adjustments, and national highway traffic index.
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Pumps to Check (Low Confidence Table) */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              Pumps to Check • Low Confidence Anomalies ({lowConfidencePumps.length})
            </span>
            <Tag color="warning">Calibration Recommended</Tag>
          </div>
        }
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
        }}
      >
        <Table
          dataSource={lowConfidencePumps}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AiAccuracyPage;
