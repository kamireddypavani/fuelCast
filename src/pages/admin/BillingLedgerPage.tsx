import React from 'react';
import { Row, Col, Card, Typography, Table, Button, Tag, Space, Badge, message } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
;

const { Title, Text } = Typography;

export const BillingLedgerPage: React.FC = () => {
  const invoices = [
    {
      id: 'INV-2026-1101',
      distributor: 'Krishna Fuels & Telemetry',
      pumpsBilled: 32,
      tier: 'Standard (₹449/pump)',
      subtotal: 14368,
      gst: 2586,
      total: 16954,
      dueDate: '05 Dec 2026',
      status: 'Paid',
    },
    {
      id: 'INV-2026-1102',
      distributor: 'Deccan Petroleum Network',
      pumpsBilled: 54,
      tier: 'Enterprise (₹399/pump)',
      subtotal: 21546,
      gst: 3878,
      total: 25424,
      dueDate: '05 Dec 2026',
      status: 'Pending',
    },
    {
      id: 'INV-2026-1103',
      distributor: 'Coastal Energy Logistics',
      pumpsBilled: 28,
      tier: 'Standard (₹449/pump)',
      subtotal: 12572,
      gst: 2263,
      total: 14835,
      dueDate: '05 Dec 2026',
      status: 'Paid',
    },
    {
      id: 'INV-2026-1104',
      distributor: 'Rayalaseema Fuel Carriers',
      pumpsBilled: 14,
      tier: 'Small (₹499/pump)',
      subtotal: 6986,
      gst: 1257,
      total: 8243,
      dueDate: '28 Nov 2026',
      status: 'Overdue',
    },
  ];

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <strong style={{ color: '#2563EB' }}>{text}</strong>
      ),
    },
    {
      title: 'Distributor Partner',
      dataIndex: 'distributor',
      key: 'distributor',
      render: (text: string, r: any) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.tier}</div>
        </div>
      ),
    },
    {
      title: 'Active Pumps',
      dataIndex: 'pumpsBilled',
      key: 'pumpsBilled',
      render: (pumps: number) => (
        <span style={{ color: 'var(--text-primary)' }}>{pumps} Pumps</span>
      ),
    },
    {
      title: 'Invoice Total (incl. 18% GST)',
      dataIndex: 'total',
      key: 'total',
      render: (tot: number) => (
        <strong style={{ color: 'var(--text-primary)' }}>
          ₹{tot.toLocaleString('en-IN')}
        </strong>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{date}</span>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Paid') color = 'success';
        if (status === 'Pending') color = 'warning';
        if (status === 'Overdue') color = 'error';
        return <Badge status={color as any} text={<span style={{ color: 'var(--text-primary)' }}>{status}</span>} />;
      },
    },
    {
      title: 'Invoice Action',
      key: 'action',
      render: (_: any, r: any) => (
        <Button
          size="small"
          icon={<FilePdfOutlined />}
          onClick={() => message.success(`Downloading PDF for invoice ${r.id}...`)}
        >
          PDF
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
            Subscription Plans &amp; Billing Ledger
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            SaaS subscription tiers, monthly automated GST billing, and payment tracking.
          </Text>
        </div>
        <Space>
          <Button
            type="primary"
            onClick={() => message.success('Generated monthly GST invoices for all 12 distributors!')}
          >
            Generate Invoices
          </Button>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
            Invoices
          </Tag>
        </Space>
      </div>

      {/* Top 3 Pricing Tier Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#38BDF8' }}>SMALL NETWORK TIER</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>
              ₹499 <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>/ pump / month</span>
            </div>
            <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>Up to 20 retail pumps</li>
              <li>Twice-daily automated AI forecasting</li>
              <li>WhatsApp low-stock alerts to dealers</li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '2px solid #2563EB',
              borderRadius: 12,
              position: 'relative',
            }}
          >
            <Tag color="blue" style={{ position: 'absolute', top: 12, right: 12 }}>MOST POPULAR</Tag>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2563EB' }}>STANDARD LOGISTICS TIER</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>
              ₹449 <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>/ pump / month</span>
            </div>
            <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>21 to 50 retail stations</li>
              <li>Full 5-stage Order Kanban &amp; Refill Calendar</li>
              <li>Multi-compartment tanker optimization</li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#A855F7' }}>ENTERPRISE DISTRIBUTOR TIER</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>
              ₹399 <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>/ pump / month</span>
            </div>
            <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>50+ retail pumps (Volume pricing)</li>
              <li>Custom ERP / SAP data integration</li>
              <li>Dedicated account manager &amp; custom SLAs</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Ledger Table Card */}
      <Card
        title={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Monthly Invoice Ledger</span>}
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
        }}
      >
        <Table
          dataSource={invoices}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default BillingLedgerPage;
