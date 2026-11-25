import React, { useState } from 'react';
import { Row, Col, Card, Typography, Form, Input, InputNumber, TimePicker, Select, Button, Table, Tag, Space, message } from 'antd';
import { SlidersOutlined, CalendarOutlined, SaveOutlined, SafetyCertificateOutlined, GlobalOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { MOCK_HOLIDAYS } from '../../mock/fuelcastData';
import type { HolidaySurge } from '../../types/fuelcast';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const MasterSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [holidays] = useState<HolidaySurge[]>(MOCK_HOLIDAYS);

  const handleSaveSettings = () => {
    message.success('Master settings saved! All AI forecasting algorithms updated in real time.');
  };

  const holidayColumns = [
    {
      title: 'Festival / Event',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <strong style={{ color: 'var(--text-primary)' }}>{text}</strong>
      ),
    },
    {
      title: 'Dates Active',
      dataIndex: 'date',
      key: 'date',
      render: (date: string, r: any) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{date || r?.date || r?.dates || 'Ongoing'}</span>
      ),
    },
    {
      title: 'Demand Multiplier',
      dataIndex: 'surgeMultiplier',
      key: 'surgeMultiplier',
      render: (m: number, r: any) => {
        const mult = m ?? r?.surgeMultiplier ?? r?.multiplier ?? 1.15;
        return (
          <Tag color="orange" style={{ fontWeight: 600 }}>
            +{Math.round((mult - 1) * 100)}% Surge ({mult}x)
          </Tag>
        );
      },
    },
    {
      title: 'Scope & Fuel Types',
      dataIndex: 'impactType',
      key: 'impactType',
      render: (impact: string, r: any) => {
        const types: string[] = Array.isArray(r?.fuelTypes) ? r.fuelTypes : ['Petrol & Diesel'];
        const impactLabel = impact || r?.impactType || 'Regional';
        return (
          <Space size={4}>
            <Tag color="cyan">{impactLabel}</Tag>
            {types.map((t, idx) => (
              <Tag key={idx} color="blue">{t}</Tag>
            ))}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ paddingBottom: 40, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            Master Platform Settings &amp; Demand Surges
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Global thresholds, 4,000 L tanker compartment rounding rules, and festival multipliers.
          </Text>
        </div>
        <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
          Configuration
        </Tag>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSaveSettings}
        initialValues={{
          morningRun: dayjs('06:00', 'HH:mm'),
          eveningRun: dayjs('22:00', 'HH:mm'),
          criticalDays: 1.0,
          warningDays: 3.0,
          compartmentSize: 4000,
          safetyBuffer: 2500,
          currency: 'INR',
          fuelUnit: 'Litres',
          timezone: 'Asia/Kolkata (IST)',
        }}
      >
        <Row gutter={[20, 20]}>
          {/* Left Column: Schedules & Risk Thresholds */}
          <Col xs={24} lg={12}>
            {/* 1. Sync Windows */}
            <Card
              title={
                <Space>
                  <SlidersOutlined style={{ color: '#2563EB' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>1. Daily Reading Windows (IST)</span>
                </Space>
              }
              style={{
                background: 'var(--panel-bg)',
                borderColor: 'var(--border-color)',
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Morning Opening Run</span>}
                    name="morningRun"
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Evening Closing Run</span>}
                    name="eveningRun"
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Readings submitted after these windows trigger an automated WhatsApp alert to the pump manager.
              </Text>
            </Card>

            {/* 2. Stock Risk Thresholds */}
            <Card
              title={
                <Space>
                  <SafetyCertificateOutlined style={{ color: '#EF4444' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>2. AI Stock Risk Rules</span>
                </Space>
              }
              style={{
                background: 'var(--panel-bg)',
                borderColor: 'var(--border-color)',
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Critical Red Threshold</span>}
                    name="criticalDays"
                    extra="Triggers high-priority refill suggestion."
                  >
                    <InputNumber min={0.5} max={3} step={0.1} addonAfter="days" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Warning Amber Threshold</span>}
                    name="warningDays"
                    extra="Flags tank on dashboard as Order Soon."
                  >
                    <InputNumber min={1} max={7} step={0.5} addonAfter="days" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 3. Tanker Rules & Localization */}
            <Card
              title={
                <Space>
                  <GlobalOutlined style={{ color: '#10B981' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>3. Tanker Logistics &amp; Indian Standards</span>
                </Space>
              }
              style={{
                background: 'var(--panel-bg)',
                borderColor: 'var(--border-color)',
                borderRadius: 12,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Compartment Alignment</span>}
                    name="compartmentSize"
                    extra="Auto-rounds orders to fit standard tanker bays."
                  >
                    <Select>
                      <Option value={4000}>4,000 Litres (AP/Telangana Standard)</Option>
                      <Option value={5000}>5,000 Litres</Option>
                      <Option value={6000}>6,000 Litres</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Minimum Dead-Stock Buffer</span>}
                    name="safetyBuffer"
                    extra="Suction pipe bottom dead-stock."
                  >
                    <InputNumber min={1000} max={5000} step={500} addonAfter="L" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Currency</span>} name="currency">
                    <Input disabled value="INR (₹)" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Volume Unit</span>} name="fuelUnit">
                    <Input disabled value="Litres (L)" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Timezone</span>} name="timezone">
                    <Input disabled value="IST (UTC+05:30)" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column: Festival Surge Multipliers */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <CalendarOutlined style={{ color: '#F59E0B' }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      Holiday &amp; Festival Demand Surges
                    </span>
                  </Space>
                  <Button
                    size="small"
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => message.info('Adding custom festival demand rule')}
                  >
                    Add Festival
                  </Button>
                </div>
              }
              style={{
                background: 'var(--panel-bg)',
                borderColor: 'var(--border-color)',
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Paragraph style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                FuelCast automatically multiplies forecasted daily consumption during regional festival periods to prevent dry-outs during high highway transit surges.
              </Paragraph>
              <Table
                dataSource={holidays}
                columns={holidayColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>

            {/* Save Button Card */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button size="large">Reset to Defaults</Button>
              <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />}>
                Save Master Settings
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default MasterSettingsPage;
