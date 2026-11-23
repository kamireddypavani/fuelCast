// src/pages/dealer/DealerStationPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Tag,
  Button,
  Table,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  Badge,
  Alert,
  message,
  Tooltip,
  Segmented,
} from 'antd';
import {
  AlertTriangle,
  MapPin,
  Droplet,
  MessageSquare,
  Truck,
  Radio,
  RefreshCw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { MOCK_PUMPS, MOCK_ORDERS } from '../../mock/fuelcastData';
import type { Reading } from '../../types/fuelcast';

export const DealerStationPage: React.FC = () => {
  const navigate = useNavigate();
  // Retail Dealer is scoped to Sharma Fuels (pump-1)
  const myPump = MOCK_PUMPS[0];
  const myOrders = MOCK_ORDERS.filter((o) => o.pumpId === myPump.id);

  const [isDipModalOpen, setIsDipModalOpen] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [telemetryViewMode, setTelemetryViewMode] = useState<string>('sensor');
  const [isSyncingSensors, setIsSyncingSensors] = useState<boolean>(false);
  const [dipForm] = Form.useForm();
  const [orderForm] = Form.useForm();

  // 4 Detailed IoT Sensor Probes Telemetry across Petrol, Diesel, Speed XP95, and DEF
  const [sensorTankData] = useState([
    {
      id: 'tank-1',
      name: 'Tank 1 (High Speed Diesel)',
      fuelCode: 'HSD (Diesel)',
      fuelType: 'Diesel',
      capacityLiters: 20000,
      currentLiters: 4200,
      safeMinLiters: 3000,
      percentage: 21,
      daysRemaining: 2.1,
      dailyConsumption: 2000,
      hourlyBurnRate: 83.3,
      sensorId: 'ATG-SN-4410',
      sensorModel: 'Magnetostrictive Probe Mk IV',
      probeLevelMm: 410,
      tankHeightMm: 2050,
      ullageLiters: 15800,
      waterMm: 0.0,
      temperatureC: 28.4,
      sensorSignalPct: 98,
      lastSync: 'Live (15s ago)',
      lastManualDipMm: 410,
      lastManualDipLiters: 4200,
      recommendedOrderLiters: 12000,
      color: '#2563EB',
      gradient: 'linear-gradient(180deg, #38BDF8 0%, #1D4ED8 100%)',
      status: 'Critical' as const,
    },
    {
      id: 'tank-2',
      name: 'Tank 2 (Regular Petrol)',
      fuelCode: 'MS (Motor Spirit 91)',
      fuelType: 'Petrol',
      capacityLiters: 15000,
      currentLiters: 8550,
      safeMinLiters: 2500,
      percentage: 57,
      daysRemaining: 4.9,
      dailyConsumption: 1750,
      hourlyBurnRate: 72.9,
      sensorId: 'ATG-SN-4411',
      sensorModel: 'Magnetostrictive Probe Mk IV',
      probeLevelMm: 1140,
      tankHeightMm: 2000,
      ullageLiters: 6450,
      waterMm: 0.0,
      temperatureC: 27.9,
      sensorSignalPct: 95,
      lastSync: 'Live (25s ago)',
      lastManualDipMm: 820,
      lastManualDipLiters: 8550,
      recommendedOrderLiters: 4000,
      color: '#10B981',
      gradient: 'linear-gradient(180deg, #34D399 0%, #059669 100%)',
      status: 'Order Soon' as const,
    },
    {
      id: 'tank-3',
      name: 'Tank 3 (Speed Premium XP95)',
      fuelCode: 'XP95 (High Octane Petrol)',
      fuelType: 'Speed',
      capacityLiters: 10000,
      currentLiters: 7900,
      safeMinLiters: 1500,
      percentage: 79,
      daysRemaining: 18.0,
      dailyConsumption: 440,
      hourlyBurnRate: 18.3,
      sensorId: 'ATG-SN-4412',
      sensorModel: 'Magnetostrictive Probe Mk IV',
      probeLevelMm: 1580,
      tankHeightMm: 2000,
      ullageLiters: 2100,
      waterMm: 0.0,
      temperatureC: 28.1,
      sensorSignalPct: 99,
      lastSync: 'Live (8s ago)',
      lastManualDipMm: 1150,
      lastManualDipLiters: 7900,
      recommendedOrderLiters: 0,
      color: '#A855F7',
      gradient: 'linear-gradient(180deg, #C084FC 0%, #7E22CE 100%)',
      status: 'Optimal' as const,
    },
    {
      id: 'tank-4',
      name: 'Tank 4 (DEF / AdBlue Automotive Urea)',
      fuelCode: 'DEF (BS6 Emissions Fluid)',
      fuelType: 'DEF',
      capacityLiters: 3000,
      currentLiters: 1850,
      safeMinLiters: 500,
      percentage: 62,
      daysRemaining: 15.4,
      dailyConsumption: 120,
      hourlyBurnRate: 5.0,
      sensorId: 'ATG-SN-4413',
      sensorModel: 'Ultrasonic Liquid Probe',
      probeLevelMm: 1240,
      tankHeightMm: 2000,
      ullageLiters: 1150,
      waterMm: 0.0,
      temperatureC: 26.5,
      sensorSignalPct: 96,
      lastSync: 'Live (45s ago)',
      lastManualDipMm: 1240,
      lastManualDipLiters: 1850,
      recommendedOrderLiters: 1000,
      color: '#06B6D4',
      gradient: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 100%)',
      status: 'Optimal' as const,
    },
  ]);

  const handleRefreshSensors = () => {
    setIsSyncingSensors(true);
    setTimeout(() => {
      setIsSyncingSensors(false);
      message.success('IoT ATG Sensor Probes re-polled via 4G gateway. All 4 telemetry channels nominal.');
    }, 600);
  };

  const [recentDips, setRecentDips] = useState<Reading[]>([
    {
      id: 'dip-1',
      timestamp: 'Today, 06:15 AM IST',
      tankName: 'Tank 1 (Main Diesel)',
      dipMm: 410,
      stockLiters: 4200,
      type: 'Opening',
      recordedBy: 'Ramesh Sharma (Self)',
      status: 'Synced',
    },
    {
      id: 'dip-2',
      timestamp: 'Today, 06:15 AM IST',
      tankName: 'Tank 2 (Regular Petrol)',
      dipMm: 820,
      stockLiters: 8550,
      type: 'Opening',
      recordedBy: 'Ramesh Sharma (Self)',
      status: 'Synced',
    },
    {
      id: 'dip-3',
      timestamp: 'Yesterday, 10:00 PM IST',
      tankName: 'Tank 1 (Main Diesel)',
      dipMm: 440,
      stockLiters: 4500,
      type: 'Closing',
      recordedBy: 'Night Shift Manager',
      status: 'Manual',
    },
  ]);

  const handleRecordDip = (values: any) => {
    const newRecord: Reading = {
      id: `dip-${Date.now()}`,
      timestamp: 'Just now',
      tankName: values.tankName,
      dipMm: values.dipMm,
      stockLiters: values.stockLiters,
      type: values.dipType,
      recordedBy: 'Ramesh Sharma (Self)',
      status: 'Manual',
    };
    setRecentDips([newRecord, ...recentDips]);
    message.success('Stick dip logged! AI depletion forecast updated.');
    setIsDipModalOpen(false);
    dipForm.resetFields();
  };

  const handleRequestRefill = (values: any) => {
    message.success(`Refill order requested for ${values.quantity} L of ${values.fuelType}! Sent to Krishna Fuels dispatch desk.`);
    setIsOrderModalOpen(false);
    orderForm.resetFields();
  };

  const dipColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (t: string) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t}</span>,
    },
    {
      title: 'Tank',
      dataIndex: 'tankName',
      key: 'tankName',
      render: (t: string) => <strong style={{ color: 'var(--text-primary)' }}>{t}</strong>,
    },
    {
      title: 'Dip Level (mm)',
      dataIndex: 'dipMm',
      key: 'dipMm',
      render: (d: number) => <span>{d} mm</span>,
    },
    {
      title: 'Volume (L)',
      dataIndex: 'stockLiters',
      key: 'stockLiters',
      render: (v: number) => <strong>{v.toLocaleString('en-IN')} L</strong>,
    },
    {
      title: 'Session',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color={type === 'Opening' ? 'blue' : 'purple'}>{type} Dip</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'Synced' ? 'success' : 'processing'} text={<span style={{ color: 'var(--text-primary)' }}>{status}</span>} />
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Station Banner Header */}
      <div
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 22, fontWeight: 800 }}>
              {myPump.name}
            </h2>
            <Tag color="green">Station Live (Auto-Sync)</Tag>
            <Tag color="blue">{myPump.code}</Tag>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 12.5, color: 'var(--text-secondary)' }}>
            <span>
              <MapPin size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              {myPump.area}, {myPump.city} ({myPump.state})
            </span>
            <span>•</span>
            <span>Supply Depot: <strong>{myPump.depot}</strong> (Lead time: {myPump.leadTimeDays}d)</span>
            <span>•</span>
            <span>Owner: <strong>{myPump.dealerName}</strong> ({myPump.dealerPhone})</span>
          </div>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<Droplet size={15} />}
            onClick={() => setIsDipModalOpen(true)}
            style={{ background: '#2563EB', fontWeight: 600 }}
          >
            Record Dip Reading
          </Button>
          <Button
            type="default"
            icon={<Truck size={15} />}
            onClick={() => setIsOrderModalOpen(true)}
            style={{ fontWeight: 600 }}
          >
            Order Refill
          </Button>
          <Button
            icon={<MessageSquare size={15} style={{ color: '#25D366' }} />}
            onClick={() => message.info('Opening WhatsApp chat with Krishna Fuels dispatcher (+91 98480 12345)...')}
          >
            WhatsApp Depot
          </Button>
        </Space>
      </div>

      {/* Critical Stock Warning Banner (if any tank < 3 days) */}
      <Alert
        message={
          <Space>
            <AlertTriangle style={{ color: '#EF4444' }} size={16} />
            <strong style={{ color: 'var(--text-primary)' }}>
              Critical Low Stock Alert: Tank 1 (Main Diesel) requires refill!
            </strong>
          </Space>
        }
        description={
          <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            Current stock is <strong>4,200 L</strong> (21% capacity). At average consumption of 2,000 L/day, this tank will breach safe minimum (3,000 L) within <strong>14 hours</strong> and run completely dry in <strong>2.1 days</strong>.
          </div>
        }
        type="error"
        showIcon={false}
        action={
          <Space>
            <Button
              type="default"
              icon={<Sparkles size={13} color="#A855F7" />}
              onClick={() => navigate('/dealer/forecast')}
              style={{ fontWeight: 600, fontSize: 12, borderRadius: 6 }}
            >
              AI Run-Dry Predictor
            </Button>
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => setIsOrderModalOpen(true)}
              style={{ fontWeight: 600, borderRadius: 6 }}
            >
              Refill 12,000 L Now
            </Button>
          </Space>
        }
        style={{
          borderRadius: 10,
          border: '1px solid rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.08)',
        }}
      />

      {/* Smart IoT Sensor Telemetry & Underground Tanks Center */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}>
                Live Underground Tanks &amp; IoT Sensor Telemetry
              </h3>
              <Tag color="cyan" style={{ borderRadius: 100, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Radio size={12} /> ATG Probes Active
              </Tag>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Automatic Tank Gauging (ATG) magnetostrictive probes reading height, ullage, volume &amp; water ingress every 30s.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Segmented
              value={telemetryViewMode}
              onChange={(val) => setTelemetryViewMode(val as string)}
              options={[
                { label: '📡 Live IoT Sensors', value: 'sensor' },
                { label: '📏 Stick Dip Calibration', value: 'calibration' },
              ]}
              size="small"
            />
            <Button
              size="small"
              icon={<RefreshCw size={12} className={isSyncingSensors ? 'animate-spin' : ''} />}
              onClick={handleRefreshSensors}
              style={{ fontWeight: 600, fontSize: 12 }}
            >
              Sync Telemetry
            </Button>
          </div>
        </div>

        <Row gutter={[14, 14]}>
          {sensorTankData.map((tank) => {
            const isCritical = tank.status === 'Critical';
            const isWarning = tank.status === 'Order Soon';
            const badgeColor = isCritical ? 'error' : isWarning ? 'warning' : 'success';
            const safeMinPct = (tank.safeMinLiters / tank.capacityLiters) * 100;

            return (
              <Col xs={24} sm={12} xl={6} key={tank.id}>
                <Card
                  bordered={false}
                  styles={{ body: { padding: '14px 14px' } }}
                  style={{
                    background: 'var(--panel-bg)',
                    border: `1.5px solid ${isCritical ? 'rgba(239,68,68,0.5)' : isWarning ? 'rgba(245,158,11,0.4)' : 'var(--border-color)'}`,
                    borderRadius: 12,
                    boxShadow: isCritical ? '0 0 16px rgba(239,68,68,0.12)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Tank Header with Probe ID and Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {tank.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                          {tank.fuelCode}
                        </span>
                        <Tooltip title={`Installed Sensor: ${tank.sensorModel}`}>
                          <Tag style={{ fontSize: 9.5, margin: 0, padding: '0 4px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                            {tank.sensorId}
                          </Tag>
                        </Tooltip>
                      </div>
                    </div>
                    <Tag color={badgeColor} style={{ fontWeight: 700, borderRadius: 6, margin: 0, fontSize: 11 }}>
                      {tank.daysRemaining.toFixed(1)}d left
                    </Tag>
                  </div>

                  {/* Visual Underground Tank Cross-Section with Probe Rod */}
                  <div
                    style={{
                      position: 'relative',
                      height: 124,
                      background: 'radial-gradient(ellipse at bottom, rgba(15, 23, 42, 0.95) 0%, rgba(5, 10, 20, 0.98) 100%)',
                      borderRadius: 16,
                      border: '2px solid rgba(255, 255, 255, 0.14)',
                      overflow: 'hidden',
                      margin: '6px 0 12px 0',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Top Manhole Collar & Sensor Transmitter Box */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 52,
                        height: 12,
                        background: '#334155',
                        borderBottomLeftRadius: 6,
                        borderBottomRightRadius: 6,
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderTop: 'none',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                      }}
                    >
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                      <span style={{ fontSize: 7, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5 }}>ATG</span>
                    </div>

                    {/* Vertical Stainless Steel Probe Rod */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 4,
                        background: 'linear-gradient(90deg, #94A3B8 0%, #E2E8F0 50%, #64748B 100%)',
                        zIndex: 5,
                        boxShadow: '0 0 4px rgba(0,0,0,0.8)',
                      }}
                    />

                    {/* Ullage Air Space Readout (Top Chamber) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 16,
                        left: 10,
                        right: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 6,
                        fontSize: 10,
                        color: '#94A3B8',
                      }}
                    >
                      <span>Free Ullage:</span>
                      <strong style={{ color: '#F8FAFC' }}>+{tank.ullageLiters.toLocaleString()} L</strong>
                    </div>

                    {/* Liquid Fuel Fill Layer */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${tank.percentage}%`,
                        background: tank.gradient,
                        transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 2,
                        boxShadow: `0 -2px 10px ${tank.color}66`,
                      }}
                    >
                      {/* Fluid Surface Meniscus Wave Highlight */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: 'rgba(255, 255, 255, 0.75)',
                          boxShadow: '0 0 6px rgba(255, 255, 255, 0.9)',
                        }}
                      />
                    </div>

                    {/* Safe Minimum Buffer Threshold Line */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: `${safeMinPct}%`,
                        left: 0,
                        right: 0,
                        borderTop: '1.5px dashed #EF4444',
                        zIndex: 4,
                      }}
                      title={`Safe Minimum Threshold: ${tank.safeMinLiters.toLocaleString()} L`}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          right: 6,
                          top: -14,
                          fontSize: 8.5,
                          fontWeight: 700,
                          color: '#EF4444',
                          background: 'rgba(0,0,0,0.7)',
                          padding: '0 3px',
                          borderRadius: 3,
                        }}
                      >
                        Safe Min {tank.safeMinLiters / 1000}k L
                      </span>
                    </div>

                    {/* Centered Liquid Volume & Depth Readout */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zIndex: 6,
                        color: '#FFFFFF',
                        textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                      }}
                    >
                      <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: -0.2 }}>
                        {tank.currentLiters.toLocaleString()} L
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                        {tank.percentage}% • {tank.probeLevelMm} mm dip
                      </div>
                    </div>

                    {/* Bottom Water Ingress Sensor Probe */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        left: 8,
                        fontSize: 8.5,
                        color: '#60A5FA',
                        zIndex: 6,
                        background: 'rgba(0,0,0,0.6)',
                        padding: '1px 4px',
                        borderRadius: 3,
                      }}
                    >
                      Water: {tank.waterMm} mm (Pure)
                    </div>
                  </div>

                  {/* 4-Metric IoT Sensor Telemetry Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px 8px',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      background: 'var(--hover-bg)',
                      padding: '8px 10px',
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <span>Sensor Dip:</span>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12 }}>
                        {tank.probeLevelMm} <span style={{ fontSize: 10, fontWeight: 500 }}>mm</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span>Refill Space:</span>
                      <div style={{ fontWeight: 700, color: '#10B981', fontSize: 12 }}>
                        +{tank.ullageLiters.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 500 }}>L</span>
                      </div>
                    </div>

                    <div>
                      <span>Burn Rate:</span>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tank.hourlyBurnRate.toFixed(0)} L/hr
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span>Daily Outflow:</span>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tank.dailyConsumption.toLocaleString()} L/d
                      </div>
                    </div>
                  </div>

                  {/* Calibration Mode Display (When Toggle Active) */}
                  {telemetryViewMode === 'calibration' && (
                    <div
                      style={{
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: 6,
                        padding: '6px 8px',
                        marginBottom: 10,
                        fontSize: 10.5,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
                        <span>Physical Stick Dip:</span>
                        <strong>{tank.lastManualDipMm} mm ({tank.lastManualDipLiters} L)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', marginTop: 2, fontWeight: 600 }}>
                        <span>Variance:</span>
                        <span>0 L (0.0% - Certified)</span>
                      </div>
                    </div>
                  )}

                  {/* Live Sensor Diagnostics Strip */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      padding: '4px 0',
                      borderTop: '1px solid var(--border-color)',
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                      Signal: {tank.sensorSignalPct}%
                    </span>
                    <span>Temp: {tank.temperatureC}°C</span>
                    <span>{tank.lastSync}</span>
                  </div>

                  {/* Action Recommendation Banner */}
                  <div style={{ marginTop: 'auto' }}>
                    {isCritical ? (
                      <div
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 6,
                          padding: '6px 8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>
                            Dry in {tank.daysRemaining} days!
                          </div>
                          <div style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>
                            Take {tank.recommendedOrderLiters.toLocaleString()} L refill
                          </div>
                        </div>
                        <Button
                          size="small"
                          type="primary"
                          danger
                          onClick={() => setIsOrderModalOpen(true)}
                          style={{ height: 24, fontSize: 11, fontWeight: 700 }}
                        >
                          Refill Now
                        </Button>
                      </div>
                    ) : isWarning ? (
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: 6,
                          padding: '6px 8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600 }}>
                            Order in {tank.daysRemaining} days
                          </div>
                          <div style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>
                            Ullage accepts 4k L
                          </div>
                        </div>
                        <Button
                          size="small"
                          onClick={() => setIsOrderModalOpen(true)}
                          style={{ height: 24, fontSize: 11 }}
                        >
                          Order
                        </Button>
                      </div>
                    ) : (
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: 6,
                          padding: '6px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 10.5,
                          color: '#10B981',
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Optimal Stock (Safe for {tank.daysRemaining.toFixed(0)} days)</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      <Row gutter={[20, 20]}>
        {/* Left Column: Recent Dip History (14 cols) */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Droplet size={16} style={{ color: '#2563EB' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Station Stick Dip History</span>
                </Space>
                <Button size="small" onClick={() => setIsDipModalOpen(true)}>
                  + Log Dip
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
              dataSource={recentDips}
              columns={dipColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Right Column: Active Tanker Refill Orders (10 cols) */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <Truck size={16} style={{ color: '#10B981' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Active Refill Orders</span>
              </Space>
            }
            style={{
              background: 'var(--panel-bg)',
              borderColor: 'var(--border-color)',
              borderRadius: 12,
            }}
          >
            {myOrders.length === 0 ? (
              <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No active orders for this station.
              </div>
            ) : (
              myOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong style={{ color: 'var(--primary-color)' }}>{ord.orderNumber}</strong>
                    <Tag color="processing">In Transit</Tag>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {ord.quantityLiters.toLocaleString('en-IN')} L of {ord.fuelType}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Depot: {ord.depot}
                  </div>

                  {/* Driver & Truck Pill */}
                  <div
                    style={{
                      background: 'rgba(37,99,235,0.08)',
                      borderRadius: 8,
                      padding: '8px 10px',
                      marginTop: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Tanker AP16 TX 2690</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Driver: K. Appa Rao (+91 98481 12345)</div>
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => message.info('Live GPS: Tanker is at Mangalagiri Bypass (18 km away). ETA 42 mins.')}
                    >
                      Track GPS
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Card>
        </Col>
      </Row>

      {/* Record Dip Reading Modal */}
      <Modal
        title={<span style={{ color: 'var(--text-primary)' }}>Record Stick Dip Reading</span>}
        open={isDipModalOpen}
        onCancel={() => setIsDipModalOpen(false)}
        footer={null}
      >
        <Form form={dipForm} layout="vertical" onFinish={handleRecordDip} style={{ marginTop: 16 }}>
          <Form.Item label="Tank Selection" name="tankName" initialValue="Tank 1 (Main Diesel)" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Tank 1 (Main Diesel)">Tank 1 (Main Diesel)</Select.Option>
              <Select.Option value="Tank 2 (Regular Petrol)">Tank 2 (Regular Petrol)</Select.Option>
              <Select.Option value="Tank 3 (Speed Premium)">Tank 3 (Speed Premium)</Select.Option>
              <Select.Option value="Tank 4 (DEF / AdBlue)">Tank 4 (DEF / AdBlue)</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Stick Dip (mm)" name="dipMm" rules={[{ required: true }]}>
                <InputNumber min={0} max={2500} style={{ width: '100%' }} placeholder="e.g. 410" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Calculated Litres (L)" name="stockLiters" rules={[{ required: true }]}>
                <InputNumber min={0} max={30000} style={{ width: '100%' }} placeholder="e.g. 4200" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Reading Session" name="dipType" initialValue="Opening">
            <Select>
              <Select.Option value="Opening">Morning 06:00 AM (Opening Stock)</Select.Option>
              <Select.Option value="Closing">Night 10:00 PM (Closing Stock)</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <Button onClick={() => setIsDipModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save Dip Reading
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Refill Request Modal */}
      <Modal
        title={<span style={{ color: 'var(--text-primary)' }}>Request Refill Tanker</span>}
        open={isOrderModalOpen}
        onCancel={() => setIsOrderModalOpen(false)}
        footer={null}
      >
        <Form form={orderForm} layout="vertical" onFinish={handleRequestRefill} style={{ marginTop: 16 }}>
          <Form.Item label="Fuel Type" name="fuelType" initialValue="Diesel" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Diesel">Diesel (HSD) - 2.1 days remaining (Critical)</Select.Option>
              <Select.Option value="Petrol">Regular Petrol (MS) - 4.9 days remaining</Select.Option>
              <Select.Option value="Speed Premium">Speed Premium (XP95) - 18 days remaining</Select.Option>
              <Select.Option value="DEF">DEF / AdBlue (Automotive Urea) - 15.4 days remaining</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Order Quantity (Aligned to 4,000 L compartments)"
            name="quantity"
            initialValue={12000}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={4000}>4,000 L (1 Compartment)</Select.Option>
              <Select.Option value={8000}>8,000 L (2 Compartments)</Select.Option>
              <Select.Option value={12000}>12,000 L (3 Compartments - Recommended)</Select.Option>
              <Select.Option value={16000}>16,000 L (4 Compartments - Full Tanker)</Select.Option>
              <Select.Option value={20000}>20,000 L (5 Compartments - Super Tanker)</Select.Option>
            </Select>
          </Form.Item>

          <Alert
            message="Auto-dispatch note: Order request will be immediately routed to Krishna Fuels depot gantry with priority lead time (2 days)."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={() => setIsOrderModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit Refill Request
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DealerStationPage;
