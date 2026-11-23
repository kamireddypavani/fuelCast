// src/pages/distributor/PumpDetailPage.tsx
import React, { useState } from 'react';
import { Row, Col, Card, Tag, Button, Table, message } from 'antd';
import {
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PUMPS } from '../../mock/fuelcastData';
import type { Tank, Reading } from '../../types/fuelcast';

export const PumpDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pump = MOCK_PUMPS.find((p) => p.id === id) || MOCK_PUMPS[0];

  const [tanks] = useState<Tank[]>(pump.tanks);

  const mockReadings: Reading[] = [
    { id: 'r-1', timestamp: 'Today, 06:15 AM', tankName: 'Main Diesel', dipMm: 410, stockLiters: 4200, type: 'Opening', recordedBy: 'D. Kumar (Staff)', status: 'Synced' },
    { id: 'r-2', timestamp: 'Today, 06:15 AM', tankName: 'Regular Petrol', dipMm: 820, stockLiters: 8550, type: 'Opening', recordedBy: 'D. Kumar (Staff)', status: 'Synced' },
    { id: 'r-3', timestamp: 'Today, 06:15 AM', tankName: 'Speed Premium', dipMm: 1150, stockLiters: 7900, type: 'Opening', recordedBy: 'D. Kumar (Staff)', status: 'Synced' },
    { id: 'r-4', timestamp: 'Yesterday, 10:00 PM', tankName: 'Main Diesel', dipMm: 440, stockLiters: 4500, type: 'Closing', recordedBy: 'Ramesh Sharma', status: 'Synced' },
    { id: 'r-5', timestamp: 'Yesterday, 10:00 PM', tankName: 'Regular Petrol', dipMm: 860, stockLiters: 9000, type: 'Closing', recordedBy: 'Ramesh Sharma', status: 'Synced' },
  ];

  const readingColumns = [
    { title: 'Recorded Time', dataIndex: 'timestamp', key: 'timestamp' },
    { title: 'Tank', dataIndex: 'tankName', key: 'tankName', render: (t: string) => <strong>{t}</strong> },
    { title: 'Dip Stick (mm)', dataIndex: 'dipMm', key: 'dipMm', render: (dip: number) => `${dip} mm` },
    {
      title: 'Current Stock',
      dataIndex: 'stockLiters',
      key: 'stockLiters',
      render: (stock: number) => <span style={{ fontWeight: 700 }}>{stock.toLocaleString('en-IN')} L</span>,
    },
    {
      title: 'Reading Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Opening' ? 'blue' : 'purple'} style={{ borderRadius: 4 }}>
          {type} Dip
        </Tag>
      ),
    },
    { title: 'Recorded By', dataIndex: 'recordedBy', key: 'recordedBy' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle2 size={13} /> {status}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header Card */}
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/distributor/dashboard')}
            shape="circle"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 22, fontWeight: 800 }}>
                {pump.name}
              </h2>
              <Tag color="success" style={{ fontWeight: 700, borderRadius: 6 }}>
                Live Telemetry Active
              </Tag>
              <Tag color="geekblue" style={{ borderRadius: 6 }}>
                Code: {pump.code}
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
              <MapPin size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              {pump.area}, {pump.city}, {pump.state} • Depot: {pump.depot} (Lead time: {pump.leadTimeDays} days)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            icon={<Phone size={14} />}
            onClick={() => window.open(`tel:${pump.dealerPhone}`)}
            style={{ fontWeight: 600, borderRadius: 8 }}
          >
            Call Owner
          </Button>
          <Button
            type="primary"
            icon={<Calendar size={14} />}
            onClick={() => navigate(`/distributor/orders?pump=${pump.id}`)}
            style={{ fontWeight: 700, borderRadius: 8 }}
          >
            Plan Refill Order
          </Button>
        </div>
      </div>

      {/* Horizontal Visual Fuel Tanks (Core S4 Specification) */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 16 }}>
              Horizontal Cylindrical Tank Telemetry Visualizers
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Updated via Auto-Sync Dips (06:15 AM IST)
            </span>
          </div>
        }
        bordered={false}
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Row gutter={[20, 20]}>
          {tanks.map((tank) => {
            const isCritical = tank.daysRemaining <= 2.5;
            const isWarning = tank.daysRemaining > 2.5 && tank.daysRemaining <= 5;
            const statusBadgeText = isCritical ? 'At risk' : isWarning ? 'Order soon' : 'Safe';

            return (
              <Col xs={24} md={8} key={tank.id}>
                <div
                  style={{
                    background: 'var(--hover-bg)',
                    border: `1.5px solid ${isCritical ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                    borderRadius: 12,
                    padding: '16px 18px',
                    position: 'relative',
                    boxShadow: isCritical ? '0 0 16px rgba(239, 68, 68, 0.12)' : 'none',
                  }}
                >
                  {/* Tank Title & Days Remaining Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {tank.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {tank.fuelType}
                      </div>
                    </div>
                    <Tag
                      color={isCritical ? 'error' : isWarning ? 'warning' : 'success'}
                      style={{ fontWeight: 700, borderRadius: 6, fontSize: 12, padding: '2px 8px' }}
                    >
                      {tank.daysRemaining.toFixed(1)} days left ({statusBadgeText})
                    </Tag>
                  </div>

                  {/* Horizontal Visual Cylindrical Tank Simulation */}
                  <div
                    style={{
                      position: 'relative',
                      height: 56,
                      background: 'rgba(8, 14, 30, 0.8)',
                      borderRadius: 28,
                      border: '2px solid rgba(255, 255, 255, 0.15)',
                      overflow: 'hidden',
                      margin: '14px 0 10px 0',
                    }}
                  >
                    {/* Liquid Level Wave Simulation */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${tank.percentage}%`,
                        background: isCritical
                          ? 'linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)'
                          : isWarning
                            ? 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)'
                            : 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
                        borderRadius: '28px 0 0 28px',
                        transition: 'width 0.6s ease',
                      }}
                    />

                    {/* Safe Minimum Red Marker Line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: `${(tank.safeMinLiters / tank.capacityLiters) * 100}%`,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: '#ffffff',
                        boxShadow: '0 0 4px #000000',
                        zIndex: 5,
                      }}
                      title={`Safe Minimum: ${tank.safeMinLiters.toLocaleString()} L`}
                    />

                    {/* Centered Volume Text inside Tank */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 14,
                        color: '#ffffff',
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        zIndex: 6,
                      }}
                    >
                      {tank.currentLiters.toLocaleString('en-IN')} L ({tank.percentage}%)
                    </div>
                  </div>

                  {/* Safe Minimum & Capacity Subtext */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    <span>Min Safe Buffer: <strong>{tank.safeMinLiters.toLocaleString('en-IN')} L</strong></span>
                    <span>Total Capacity: <strong>{tank.capacityLiters.toLocaleString('en-IN')} L</strong></span>
                  </div>

                  {/* Daily Consumption Stat */}
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 8,
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                    }}
                  >
                    <span>Avg. Daily Sales:</span>
                    <strong>{tank.dailyConsumption.toLocaleString('en-IN')} L / day</strong>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Middle Split: 30-Day Multi-Line Chart & Dealer Card */}
      <Row gutter={[16, 16]}>
        {/* Left: 30-Day Litres Sold per Day */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  Litres Sold Per Day — Last 30 Days Telemetry
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Comparison: Diesel vs Regular Petrol vs Speed
                </span>
              </div>
            }
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ height: 220, position: 'relative' }}>
              <svg viewBox="0 0 650 200" width="100%" height="100%" preserveAspectRatio="none">
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="50" x2="650" y2="50" stroke="var(--border-color)" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="650" y2="100" stroke="var(--border-color)" strokeDasharray="3 3" />
                <line x1="0" y1="150" x2="650" y2="150" stroke="var(--border-color)" strokeDasharray="3 3" />

                {/* Diesel Curve (Blue) */}
                <path
                  d="M0,80 Q100,50 200,90 T400,60 T650,75"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                {/* Petrol Curve (Amber) */}
                <path
                  d="M0,120 Q100,105 200,130 T400,110 T650,115"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
                {/* Speed Premium Curve (Emerald) */}
                <path
                  d="M0,170 Q100,165 200,175 T400,160 T650,168"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              </svg>

              {/* Chart Legend */}
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 3, background: '#2563eb' }} /> Diesel (Avg 2,000 L)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 3, background: '#f59e0b' }} /> Petrol (Avg 1,740 L)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 3, background: '#10b981' }} /> Speed Premium (Avg 440 L)
                </span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right: Dealer Info Card & WhatsApp Action */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Owner Operations Contact</span>}
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  {pump.dealerName[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                    {pump.dealerName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Station Owner &amp; Retail Partner
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div><strong>Phone:</strong> {pump.dealerPhone}</div>
                <div><strong>Email:</strong> {pump.dealerEmail}</div>
                <div><strong>Depot Link:</strong> {pump.depot}</div>
                <div><strong>Sync Mode:</strong> {pump.dataSource}</div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Button
                  type="primary"
                  icon={<MessageCircle size={16} />}
                  style={{
                    background: '#25D366',
                    borderColor: '#25D366',
                    fontWeight: 700,
                    borderRadius: 8,
                    height: 38,
                  }}
                  onClick={() => {
                    const msg = encodeURIComponent(`Hi ${pump.dealerName}, FuelCast telemetry indicates Tank 1 (Diesel) is down to 2.1 days. Would you like to confirm a 12,000 L refill order?`);
                    window.open(`https://wa.me/${pump.dealerPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                  }}
                >
                  Chat on WhatsApp
                </Button>

                <Button
                  onClick={() => message.success(`Login credentials SMS re-sent to ${pump.dealerPhone}`)}
                  style={{ borderRadius: 8, fontSize: 12 }}
                >
                  Resend Owner Portal Login
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Latest Opening & Closing Dip Readings Table */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Daily Opening &amp; Closing Dip Stick Readings Table
            </span>
            <Button
              size="small"
              onClick={() => message.info('Reading history exported to CSV')}
            >
              Export Readings (.CSV)
            </Button>
          </div>
        }
        bordered={false}
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Table
          columns={readingColumns}
          dataSource={mockReadings}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default PumpDetailPage;
