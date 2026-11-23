import React, { useState } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Radio, Progress, Typography, Tag, Space, message, Timeline } from 'antd';
import { PlusOutlined, DeleteOutlined, WhatsAppOutlined, SafetyCertificateOutlined, InfoCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, } = Typography;
const { Option } = Select;

interface TankFormItem {
  id: string;
  name: string;
  fuelType: 'Diesel' | 'Petrol' | 'Speed Petrol';
  capacityLiters: number;
  safeMinLiters: number;
}

export const AddPumpPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<'Auto-sync' | 'Manual entry' | 'CSV upload'>('Auto-sync');
  const [tanks, setTanks] = useState<TankFormItem[]>([
    {
      id: 't-1',
      name: 'Tank 1 (Main Diesel)',
      fuelType: 'Diesel',
      capacityLiters: 20000,
      safeMinLiters: 3000,
    },
    {
      id: 't-2',
      name: 'Tank 2 (Regular Petrol)',
      fuelType: 'Petrol',
      capacityLiters: 15000,
      safeMinLiters: 2500,
    },
  ]);

  const handleAddTank = () => {
    const nextIdx = tanks.length + 1;
    setTanks([
      ...tanks,
      {
        id: `t-${Date.now()}`,
        name: `Tank ${nextIdx} (${nextIdx % 2 === 1 ? 'Diesel' : 'Petrol'})`,
        fuelType: nextIdx % 2 === 1 ? 'Diesel' : 'Petrol',
        capacityLiters: 15000,
        safeMinLiters: 2500,
      },
    ]);
  };

  const handleRemoveTank = (id: string) => {
    if (tanks.length <= 1) {
      message.warning('At least one tank is required for a fuel station.');
      return;
    }
    setTanks(tanks.filter((t) => t.id !== id));
  };

  const handleTankChange = (id: string, field: keyof TankFormItem, value: any) => {
    setTanks(
      tanks.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const onFinish = (values: any) => {
    message.success(`Pump "${values.name || 'Station'}" registered successfully! Activation in progress.`);
    navigate('/distributor/dashboard');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <Space align="center">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/distributor/dashboard')}
              style={{ background: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
            <div>
              <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
                Add New Pump Station
              </Title>
              <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Register a new retail station to auto-forecast fuel depletion and coordinate tanker dispatch.
              </Text>
            </div>
          </Space>
        </div>
        <Tag color="blue" style={{ padding: '6px 14px', fontSize: 13, borderRadius: 20 }}>
          Onboarding Wizard
        </Tag>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Form Details (16 cols) */}
        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              leadTime: '2',
              depot: 'BPCL Kondapalli Depot',
              state: 'Andhra Pradesh',
              city: 'Vijayawada',
            }}
          >
            {/* 1. Station Details */}
            <Card
              title={
                <Space>
                  <SafetyCertificateOutlined style={{ color: '#2563EB' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>1. Station Location &amp; Logistics</span>
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
                <Col xs={24} sm={16}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Pump Station Name</span>}
                    name="name"
                    rules={[{ required: true, message: 'Please enter pump station name' }]}
                  >
                    <Input placeholder="e.g. Sri Venkateswara Highway Outpost" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Station Code</span>}
                    name="code"
                    rules={[{ required: true, message: 'Station code required' }]}
                  >
                    <Input placeholder="e.g. FC-VJA-05" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>City / Region</span>}
                    name="city"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="e.g. Vijayawada" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Area / Highway</span>}
                    name="area"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="e.g. NH-16 Benz Circle" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>State</span>}
                    name="state"
                  >
                    <Select>
                      <Option value="Andhra Pradesh">Andhra Pradesh</Option>
                      <Option value="Telangana">Telangana</Option>
                      <Option value="Karnataka">Karnataka</Option>
                      <Option value="Tamil Nadu">Tamil Nadu</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={16}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Assigned Supply Depot</span>}
                    name="depot"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="BPCL Kondapalli Depot">BPCL Kondapalli Depot (Vijayawada)</Option>
                      <Option value="HPCL Vijayawada Terminal">HPCL Vijayawada Terminal</Option>
                      <Option value="IOCL Tadepalli Depot">IOCL Tadepalli Depot (Guntur)</Option>
                      <Option value="IOCL Ghatkesar Depot">IOCL Ghatkesar Depot (Hyderabad)</Option>
                      <Option value="HPCL Cherlapally Terminal">HPCL Cherlapally Terminal</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Delivery Lead Time</span>}
                    name="leadTime"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="1">1 Day (Immediate Priority)</Option>
                      <Option value="2">2 Days (Standard Corridor)</Option>
                      <Option value="3">3 Days (Outstation / Rural)</Option>
                      <Option value="4">4 Days (Long Haul)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 2. Dealer Contact */}
            <Card
              title={
                <Space>
                  <WhatsAppOutlined style={{ color: '#25D366' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>2. Station Owner Contact &amp; WhatsApp Alerts</span>
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
                <Col xs={24} sm={8}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Station Owner / Manager Name</span>}
                    name="dealerName"
                    rules={[{ required: true, message: 'Owner name required' }]}
                  >
                    <Input placeholder="e.g. Ramesh Sharma" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>WhatsApp Phone Number</span>}
                    name="dealerPhone"
                    rules={[{ required: true, message: 'Mobile number required for alerts' }]}
                    extra="Automated morning/evening dip reminders and refill approvals are sent here."
                  >
                    <Input placeholder="+91 98765 43210" prefix={<WhatsAppOutlined style={{ color: '#25D366' }} />} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label={<span style={{ color: 'var(--text-primary)' }}>Email Address</span>}
                    name="dealerEmail"
                    rules={[{ type: 'email' }]}
                  >
                    <Input placeholder="dealer@fuelcast.in" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 3. Fuel Tanks Setup */}
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>3. Fuel Tanks Setup ({tanks.length} Tanks)</span>
                  <Button
                    type="dashed"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddTank}
                    style={{ borderColor: '#2563EB', color: '#2563EB' }}
                  >
                    Add Tank
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
              {tanks.map((tank, idx) => (
                <div
                  key={tank.id}
                  style={{
                    background: 'var(--bg-primary)',
                    padding: 16,
                    borderRadius: 10,
                    marginBottom: 12,
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Text style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Compartment {idx + 1}
                    </Text>
                    {tanks.length > 1 && (
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveTank(tank.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Tank Nickname</span>} style={{ marginBottom: 8 }}>
                        <Input
                          value={tank.name}
                          onChange={(e) => handleTankChange(tank.id, 'name', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Fuel Type</span>} style={{ marginBottom: 8 }}>
                        <Select
                          value={tank.fuelType}
                          onChange={(v) => handleTankChange(tank.id, 'fuelType', v)}
                        >
                          <Option value="Diesel">Diesel (HSD)</Option>
                          <Option value="Petrol">Regular Petrol (MS)</Option>
                          <Option value="Speed Petrol">Speed Premium (XP)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={5}>
                      <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Capacity (L)</span>} style={{ marginBottom: 8 }}>
                        <Input
                          type="number"
                          value={tank.capacityLiters}
                          onChange={(e) => handleTankChange(tank.id, 'capacityLiters', Number(e.target.value))}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={5}>
                      <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Safe Min (L)</span>} style={{ marginBottom: 8 }}>
                        <Input
                          type="number"
                          value={tank.safeMinLiters}
                          onChange={(e) => handleTankChange(tank.id, 'safeMinLiters', Number(e.target.value))}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card>

            {/* 4. Reading Source Selection */}
            <Card
              title={
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  4. Reading Telemetry Source
                </span>
              }
              style={{
                background: 'var(--panel-bg)',
                borderColor: 'var(--border-color)',
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <Radio.Group
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                style={{ width: '100%' }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <div
                      onClick={() => setDataSource('Auto-sync')}
                      style={{
                        border: `2px solid ${dataSource === 'Auto-sync' ? '#2563EB' : 'var(--border-color)'}`,
                        borderRadius: 10,
                        padding: 16,
                        cursor: 'pointer',
                        background: dataSource === 'Auto-sync' ? 'rgba(37,99,235,0.06)' : 'var(--bg-primary)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Radio value="Auto-sync">
                          <strong style={{ color: 'var(--text-primary)' }}>Auto-sync (IoT ATG)</strong>
                        </Radio>
                        <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          TLS-450 / Veeder-Root console syncs live dip readings twice daily automatically.
                        </Text>
                      </Space>
                    </div>
                  </Col>

                  <Col xs={24} sm={8}>
                    <div
                      onClick={() => setDataSource('Manual entry')}
                      style={{
                        border: `2px solid ${dataSource === 'Manual entry' ? '#2563EB' : 'var(--border-color)'}`,
                        borderRadius: 10,
                        padding: 16,
                        cursor: 'pointer',
                        background: dataSource === 'Manual entry' ? 'rgba(37,99,235,0.06)' : 'var(--bg-primary)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Radio value="Manual entry">
                          <strong style={{ color: 'var(--text-primary)' }}>Manual Entry</strong>
                        </Radio>
                        <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          Station owner or manager enters morning/evening stick dips via WhatsApp bot or web form.
                        </Text>
                      </Space>
                    </div>
                  </Col>

                  <Col xs={24} sm={8}>
                    <div
                      onClick={() => setDataSource('CSV upload')}
                      style={{
                        border: `2px solid ${dataSource === 'CSV upload' ? '#2563EB' : 'var(--border-color)'}`,
                        borderRadius: 10,
                        padding: 16,
                        cursor: 'pointer',
                        background: dataSource === 'CSV upload' ? 'rgba(37,99,235,0.06)' : 'var(--bg-primary)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Radio value="CSV upload">
                          <strong style={{ color: 'var(--text-primary)' }}>CSV Batch Upload</strong>
                        </Radio>
                        <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          Automated daily spreadsheet upload from billing or distributor ERP software.
                        </Text>
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Radio.Group>
            </Card>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/distributor/dashboard')} size="large">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large" style={{ minWidth: 160 }}>
                Activate Pump Station
              </Button>
            </div>
          </Form>
        </Col>

        {/* Right Column: Quota & Onboarding Timeline (8 cols) */}
        <Col xs={24} lg={8}>
          {/* Plan Quota Card */}
          <Card
            title={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Distributor Plan Quota</span>}
            style={{
              background: 'var(--panel-bg)',
              borderColor: 'var(--border-color)',
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Pumps Monitored</Text>
                <Text strong style={{ color: 'var(--text-primary)' }}>33 of 40 Used</Text>
              </div>
              <Progress percent={82.5} strokeColor="#2563EB" showInfo={false} />
            </div>
            <div
              style={{
                background: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: 8,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <InfoCircleOutlined style={{ color: '#2563EB', fontSize: 16 }} />
              <Text style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                <strong>7 slots remaining</strong> on your Krishna Fuels Standard Plan. Need more? Contact platform admin.
              </Text>
            </div>
          </Card>

          {/* Onboarding Timeline Preview */}
          <Card
            title={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>What happens next?</span>}
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
                      <strong style={{ color: 'var(--text-primary)' }}>1. WhatsApp Welcome Sent</strong>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                        Station owner receives automated setup message with instructions for daily dip submissions.
                      </p>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>2. 30 Days of History Loaded</strong>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                        Baseline sales patterns are established from past tank dips and ERP billing history.
                      </p>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>3. AI Forecast Runs at 11:30 PM</strong>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                        FuelCast models compute depletion curves, safe minimum breaches, and refill dates.
                      </p>
                    </div>
                  ),
                },
                {
                  color: 'gray',
                  children: (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>4. Pump Goes Fully Live</strong>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                        Shows up on Network Dashboard, Highway Map, and Refill Dispatch Calendar.
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddPumpPage;
