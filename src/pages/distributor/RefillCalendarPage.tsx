// src/pages/distributor/RefillCalendarPage.tsx
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Tag,
  Select,
  Alert,
  Radio,
  message,
} from 'antd';
import {
  CalendarOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const RefillCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'month' | 'week'>('week');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');

  // Days in calendar November 2026 (Full 7-Day Timeline)
  const calendarDays = [
    { date: 18, day: 'Wed', orders: [] },
    { date: 19, day: 'Thu', orders: [] },
    {
      date: 20,
      day: 'Fri',
      orders: [
        {
          id: 'ord-104',
          pump: 'Sri Venkateswara Outpost',
          area: 'NH-16 Enikepadu',
          fuel: 'Diesel',
          qty: '16,000 L',
          truck: 'AP16 TY 8820',
          status: 'Delivered',
        },
      ],
    },
    {
      date: 21,
      day: 'Sat',
      isToday: true,
      orders: [
        {
          id: 'ord-101',
          pump: 'Sharma Fuels',
          area: 'Benz Circle, Vijayawada',
          fuel: 'Diesel',
          qty: '12,000 L',
          truck: 'AP16 TX 2690',
          status: 'In Transit',
          urgent: true,
        },
        {
          id: 'ord-102',
          pump: 'Krishna Fuels & Telemetry',
          area: 'MG Road, Vijayawada',
          fuel: 'Petrol',
          qty: '8,000 L',
          truck: 'Unassigned',
          status: 'Depot Queued',
          urgent: true,
        },
      ],
    },
    {
      date: 22,
      day: 'Sun',
      orders: [
        {
          id: 'ord-103',
          pump: 'Balaji Petroleum Center',
          area: 'Gachibowli, Hyderabad',
          fuel: 'Diesel',
          qty: '12,000 L',
          truck: 'TS09 UB 5512',
          status: 'Scheduled',
        },
      ],
    },
    {
      date: 23,
      day: 'Mon',
      orders: [
        {
          id: 'ord-105',
          pump: 'Amaravathi Express Station',
          area: 'Kaza Toll, Guntur',
          fuel: 'Diesel',
          qty: '8,000 L',
          truck: 'Unassigned',
          status: 'Owner Request',
        },
      ],
    },
    { date: 24, day: 'Tue', orders: [] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '2px 0',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontWeight: 700 }}>
              Refill Delivery Calendar &amp; Schedule
            </h2>
            <Tag color="blue" style={{ borderRadius: 100, fontWeight: 700 }}>
              November 2026
            </Tag>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Forward timeline planner • Track upcoming station deliveries and plan depot gantry batches.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Radio.Group
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            size="small"
            buttonStyle="solid"
          >
            <Radio.Button value="week">Week View</Radio.Button>
            <Radio.Button value="month">Month View</Radio.Button>
          </Radio.Group>

          <Button
            type="primary"
            size="small"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/distributor/orders')}
            style={{ borderRadius: 6, fontWeight: 600, height: 28, fontSize: 12 }}
          >
            Refill Pipeline
          </Button>
        </div>
      </div>

      {/* 2. AI Dispatch Advisory Banner */}
      <Alert
        message={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ThunderboltOutlined style={{ color: '#EAB308', fontSize: 16 }} />
            <strong style={{ color: 'var(--text-primary)' }}>AI Dispatch Optimization Opportunity</strong>
          </div>
        }
        description={
          <div style={{ color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.35 }}>
            Sharma Fuels (12,000 L Diesel) and Krishna Fuels (8,000 L Petrol) both require urgent weekend refills on the Benz Circle corridor.
            Combine both into <strong>Tanker AP16 TX 2690 (20,000 L total)</strong> on Saturday morning to eliminate 62 km deadhead travel and save ₹2,480 in diesel transport costs.
          </div>
        }
        type="warning"
        showIcon={false}
        action={
          <Button
            type="primary"
            size="small"
            style={{ background: '#2563EB', borderColor: '#2563EB', marginTop: 4, borderRadius: 5, fontWeight: 600 }}
            onClick={() => message.success('Combined multi-drop schedule applied for AP16 TX 2690!')}
          >
            Apply Combined Schedule
          </Button>
        }
        style={{
          borderRadius: 10,
          border: '1px solid rgba(234,179,8,0.3)',
          background: 'rgba(234,179,8,0.08)',
        }}
      />

      {/* 3. Full-Width 7-Day Refill Schedule Grid (Option 2: Spacious & Clutter-Free) */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined style={{ color: '#2563EB' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 13.5 }}>
                7-Day Delivery Timeline Grid (Nov 18 – Nov 24)
              </span>
            </div>
            <Select
              value={selectedFuel}
              onChange={setSelectedFuel}
              size="small"
              style={{ width: 130 }}
            >
              <Select.Option value="All">All Fuels</Select.Option>
              <Select.Option value="Diesel">Diesel Only</Select.Option>
              <Select.Option value="Petrol">Petrol Only</Select.Option>
            </Select>
          </div>
        }
        bordered={false}
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 10,
          }}
        >
          {calendarDays.map((col, idx) => (
            <div
              key={idx}
              style={{
                background: col.isToday ? 'rgba(37,99,235,0.06)' : 'var(--bg-primary)',
                border: col.isToday ? '2px solid #2563EB' : '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '10px 8px',
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: 6,
                }}
              >
                <Text strong style={{ color: col.isToday ? '#2563EB' : 'var(--text-primary)', fontSize: 13 }}>
                  {col.day} {col.date}
                </Text>
                {col.isToday && (
                  <Tag color="blue" style={{ margin: 0, fontSize: 10, padding: '0 5px', fontWeight: 700 }}>
                    TODAY
                  </Tag>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {col.orders.length === 0 ? (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      opacity: 0.6,
                    }}
                  >
                    No deliveries
                  </div>
                ) : (
                  col.orders.map((ord: any, oIdx: number) => {
                    const isDiesel = ord.fuel === 'Diesel';
                    return (
                      <div
                        key={oIdx}
                        style={{
                          background: 'var(--panel-bg)',
                          borderLeft: `3px solid ${isDiesel ? '#2563EB' : '#10B981'}`,
                          borderRadius: 6,
                          padding: '8px 9px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          fontSize: 11,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                        }}
                      >
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                          {ord.pump}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                          {ord.area}
                        </div>
                        <div style={{ color: isDiesel ? '#2563EB' : '#10B981', fontWeight: 700, marginTop: 2 }}>
                          {ord.qty} • {ord.fuel}
                        </div>
                        <div
                          style={{
                            color: 'var(--text-secondary)',
                            marginTop: 4,
                            paddingTop: 4,
                            borderTop: '1px dashed var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: 10,
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{ord.truck}</span>
                          <Tag
                            color={ord.status === 'Delivered' ? 'success' : ord.status === 'In Transit' ? 'processing' : 'warning'}
                            style={{ margin: 0, fontSize: 9, padding: '0 4px', borderRadius: 3 }}
                          >
                            {ord.status}
                          </Tag>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RefillCalendarPage;
