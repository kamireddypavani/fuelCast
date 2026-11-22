// src/pages/distributor/NetworkDashboard.tsx
import React, { useState } from 'react';
import { Row, Col, Card, Table, Tag, Button, Progress, message } from 'antd';
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  Fuel,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { MOCK_PUMPS } from '../../mock/fuelcastData';
import type { PumpStation } from '../../types/fuelcast';

interface TelemetryStackedPoint {
  date: string;
  diesel: number;
  petrol: number;
  speed: number;
  total: number;
  phase: 'actual' | 'forecast' | 'refill';
  note?: string;
}

const TELEMETRY_STACKED_DATA: TelemetryStackedPoint[] = [
  { date: 'Nov 1', diesel: 18400, petrol: 9800, speed: 4200, total: 32400, phase: 'actual' },
  { date: 'Nov 4', diesel: 16800, petrol: 8900, speed: 3900, total: 29600, phase: 'actual' },
  { date: 'Nov 7', diesel: 15200, petrol: 8100, speed: 3600, total: 26900, phase: 'actual' },
  { date: 'Nov 11', diesel: 13500, petrol: 7300, speed: 3200, total: 24000, phase: 'actual' },
  { date: 'Nov 14', diesel: 11900, petrol: 6600, speed: 2900, total: 21400, phase: 'actual' },
  { date: 'Nov 18', diesel: 9800, petrol: 5700, speed: 2500, total: 18000, phase: 'actual' },
  { date: 'Today (Nov 21)', diesel: 8400, petrol: 4900, speed: 2200, total: 15500, phase: 'actual', note: 'Morning Dip Synced (15,500 L)' },
  { date: 'Nov 23 (Sun)', diesel: 6200, petrol: 3800, speed: 1800, total: 11800, phase: 'forecast', note: 'Depleted to Critical Buffer (11,800 L)' },
  { date: 'Nov 24 (Mon)', diesel: 16200, petrol: 8800, speed: 3800, total: 28800, phase: 'refill', note: 'Refill Arrived: +17,000 L across 4 tankers' },
  { date: 'Nov 26 (Wed)', diesel: 14100, petrol: 7600, speed: 3400, total: 25100, phase: 'forecast', note: 'Post-Refill Buffer Secure' },
  { date: 'Nov 28 (Fri)', diesel: 12000, petrol: 6500, speed: 3000, total: 21500, phase: 'forecast' },
];

const CustomStackedTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as TelemetryStackedPoint;
    const isCritical = data.total <= 12000;
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.96)',
          border: `1px solid ${isCritical ? '#EF4444' : 'rgba(255, 255, 255, 0.12)'}`,
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
          fontSize: 11.5,
          color: '#E2E8F0',
          backdropFilter: 'blur(8px)',
          minWidth: 200,
        }}
      >
        <div style={{ fontWeight: 700, color: '#FFF', marginBottom: 4, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 3 }}>
          <span>{label}</span>
          <span style={{ color: isCritical ? '#EF4444' : '#38BDF8', fontWeight: 700 }}>
            Total: {data.total.toLocaleString('en-IN')} L
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', margin: '2px 0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A855F7' }} /> Speed (XP95):
          </span>
          <strong>{data.speed.toLocaleString('en-IN')} L</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', margin: '2px 0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} /> Regular Petrol:
          </span>
          <strong>{data.petrol.toLocaleString('en-IN')} L</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', margin: '2px 0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38BDF8' }} /> Main Diesel:
          </span>
          <strong>{data.diesel.toLocaleString('en-IN')} L</strong>
        </div>
        {data.note && (
          <div style={{ color: data.phase === 'refill' ? '#10B981' : isCritical ? '#EF4444' : '#38BDF8', fontSize: 10.5, marginTop: 4, paddingTop: 3, borderTop: '1px dashed rgba(255,255,255,0.1)', fontWeight: 600 }}>
            {data.note}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const NetworkDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');
  const [pumps] = useState<PumpStation[]>(MOCK_PUMPS);

  const atRiskPumps = pumps.filter((p) => p.minDaysLeft <= 3);
  const orderSoonPumps = pumps.filter((p) => p.minDaysLeft > 3 && p.minDaysLeft <= 5);

  const urgentColumns = [
    {
      title: 'Station & Location',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PumpStation) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12.5 }}>{text}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            <MapPin size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
            {record.area}, {record.city}
          </div>
        </div>
      ),
    },
    {
      title: 'Critical Tank',
      key: 'criticalTank',
      render: (_: unknown, record: PumpStation) => {
        const critTank = record.tanks.reduce((prev, curr) =>
          curr.daysRemaining < prev.daysRemaining ? curr : prev
        );
        return (
          <div>
            <span style={{ fontWeight: 600, fontSize: 12 }}>{critTank.fuelType}</span>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {critTank.currentLiters.toLocaleString('en-IN')} L / {critTank.capacityLiters.toLocaleString('en-IN')} L
            </div>
          </div>
        );
      },
    },
    {
      title: 'Days Left',
      dataIndex: 'minDaysLeft',
      key: 'minDaysLeft',
      sorter: (a: PumpStation, b: PumpStation) => a.minDaysLeft - b.minDaysLeft,
      render: (days: number) => {
        const isCritical = days <= 2.5;
        return (
          <Tag color={isCritical ? 'error' : 'warning'} style={{ fontWeight: 700, borderRadius: 6, padding: '1px 6px', fontSize: 11.5 }}>
            {days.toFixed(1)} days left
          </Tag>
        );
      },
    },
    {
      title: 'Delivery Lead',
      dataIndex: 'leadTimeDays',
      key: 'leadTimeDays',
      render: (days: number) => <span style={{ fontSize: 12 }}>{days} day{days > 1 ? 's' : ''}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: PumpStation) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button
            type="primary"
            size="small"
            style={{ borderRadius: 6, fontSize: 11.5, fontWeight: 600, height: 26, padding: '0 8px' }}
            onClick={() => navigate(`/distributor/orders?pump=${record.id}`)}
          >
            Plan Refill
          </Button>
          <Button
            size="small"
            style={{ borderRadius: 6, fontSize: 11.5, height: 26, padding: '0 8px' }}
            onClick={() => navigate(`/distributor/pumps/${record.id}`)}
          >
            Telemetry
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {/* Top Header: Symmetrical, Flat & Clean Single Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}>
            Good morning, Anil
          </h2>
          <Tag color="error" style={{ borderRadius: 100, fontWeight: 700, padding: '0 8px', fontSize: 11 }}>
            3 pumps at risk today
          </Tag>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            icon={<MapPin size={13} />}
            onClick={() => navigate('/distributor/dashboard/map')}
            style={{ borderRadius: 6, fontWeight: 600, height: 28, fontSize: 12 }}
          >
            Interactive Map
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<Calendar size={13} />}
            onClick={() => navigate('/distributor/calendar')}
            style={{ borderRadius: 6, fontWeight: 600, height: 28, fontSize: 12 }}
          >
            Refill Calendar
          </Button>
        </div>
      </div>

      {/* 4 Theme-Adaptive Top KPI Cards - Symmetrical Gutter & Zero-Scroll Fit */}
      <Row gutter={[8, 8]}>
        {/* Card 1: Total Monitored Pumps */}
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card
            bordered={false}
            styles={{ body: { padding: '8px 12px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }}
            style={{
              width: '100%',
              background: isDark
                ? 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.32) 0%, transparent 65%), linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(10, 15, 29, 0.96) 100%)'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderBottom: '2.5px solid #2563EB',
              borderRadius: 8,
              boxShadow: isDark
                ? '0 4px 16px rgba(37, 99, 235, 0.25), var(--shadow-sm)'
                : '0 1px 3px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  minWidth: 38,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.35) 0%, rgba(30, 58, 138, 0.5) 100%)'
                    : '#EFF6FF',
                  border: isDark ? '1px solid rgba(96, 165, 250, 0.45)' : '1px solid #BFDBFE',
                }}
              >
                <Fuel size={18} color={isDark ? '#60A5FA' : '#2563EB'} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                  Total Monitored Pumps
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.1 }}>
                  32
                </div>
                <div style={{ fontSize: 10, color: '#10B981', fontWeight: 500, marginTop: 1 }}>
                  ● 100% active telemetry
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 2: Pumps at Risk */}
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card
            bordered={false}
            styles={{ body: { padding: '8px 12px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }}
            style={{
              width: '100%',
              background: isDark
                ? 'radial-gradient(circle at top right, rgba(239, 68, 68, 0.28) 0%, transparent 65%), linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(10, 15, 29, 0.96) 100%)'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderBottom: '2.5px solid #EF4444',
              borderRadius: 8,
              boxShadow: isDark
                ? '0 4px 16px rgba(239, 68, 68, 0.25), var(--shadow-sm)'
                : '0 1px 3px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  minWidth: 38,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.35) 0%, rgba(127, 29, 29, 0.5) 100%)'
                    : '#FEF2F2',
                  border: isDark ? '1px solid rgba(248, 113, 113, 0.45)' : '1px solid #FECACA',
                }}
              >
                <AlertTriangle size={18} color={isDark ? '#F87171' : '#DC2626'} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                  Pumps at Risk
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#DC2626', lineHeight: 1.1 }}>
                  {atRiskPumps.length}
                </div>
                <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 500, marginTop: 1 }}>
                  ● Critical refill queue
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: Refills Scheduled This Week */}
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card
            bordered={false}
            styles={{ body: { padding: '8px 12px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }}
            style={{
              width: '100%',
              background: isDark
                ? 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.28) 0%, transparent 65%), linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(10, 15, 29, 0.96) 100%)'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderBottom: '2.5px solid #F59E0B',
              borderRadius: 8,
              boxShadow: isDark
                ? '0 4px 16px rgba(245, 158, 11, 0.25), var(--shadow-sm)'
                : '0 1px 3px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  minWidth: 38,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(120, 53, 15, 0.5) 100%)'
                    : '#FFFBEB',
                  border: isDark ? '1px solid rgba(251, 191, 36, 0.45)' : '1px solid #FDE68A',
                }}
              >
                <div style={{ position: 'relative', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={17} color={isDark ? '#FBBF24' : '#D97706'} />
                  <Clock size={8} color={isDark ? '#FBBF24' : '#D97706'} style={{ position: 'absolute', bottom: -1, right: -2 }} />
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                  Refills This Week
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.1 }}>
                  5
                </div>
                <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 500, marginTop: 1 }}>
                  ● 68k L in 4 tankers
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 4: Average Tank Days Remaining */}
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card
            bordered={false}
            styles={{ body: { padding: '8px 12px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }}
            style={{
              width: '100%',
              background: isDark
                ? 'radial-gradient(circle at top right, rgba(6, 182, 212, 0.32) 0%, transparent 65%), linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(10, 15, 29, 0.96) 100%)'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderBottom: '2.5px solid #06B6D4',
              borderRadius: 8,
              boxShadow: isDark
                ? '0 4px 16px rgba(6, 182, 212, 0.25), var(--shadow-sm)'
                : '0 1px 3px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  minWidth: 38,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, rgba(19, 78, 74, 0.5) 100%)'
                    : '#F0FDFA',
                  border: isDark ? '1px solid rgba(34, 211, 238, 0.45)' : '1px solid #99F6E4',
                }}
              >
                <TrendingDown size={18} color={isDark ? '#38BDF8' : '#0D9488'} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                  Avg Tank Days Left
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.1 }}>
                  6.8 <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#CBD5E1' : '#64748B' }}>days</span>
                </div>
                <div style={{ fontSize: 10, color: '#06B6D4', fontWeight: 500, marginTop: 1 }}>
                  ● +0.4d vs last week
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Middle Section: Depletion Visualizer & Status Breakdown - Symmetrical Gutter */}
      <Row gutter={[8, 8]} align="stretch">
        {/* Left: 30-Day Network Stock Depletion & AI Refill Forecast */}
        <Col xs={24} lg={16} style={{ display: 'flex' }}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12.5 }}>
                  30-Day Network Stock Depletion &amp; AI Refill Forecast
                </span>
                <div style={{ display: 'flex', gap: 10, fontSize: 10.5, color: 'var(--text-secondary)', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A855F7', border: '1px solid #FFFFFF' }} />
                    Speed (XP95)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', border: '1px solid #FFFFFF' }} />
                    Petrol (MS)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38BDF8', border: '1px solid #FFFFFF' }} />
                    Diesel (HSD)
                  </span>
                  <Tag color="processing" style={{ fontSize: 9.5, borderRadius: 4, padding: '0 4px', margin: 0 }}>
                    Auto 06:00 AM
                  </Tag>
                </div>
              </div>
            }
            bordered={false}
            styles={{
              body: { flex: 1, padding: '6px 12px 6px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
              header: { minHeight: 32, padding: '0 12px' },
            }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              {/* Stacked Multi-Layer Area Chart - 110px Height */}
              <div style={{ width: '100%', height: 110 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TELEMETRY_STACKED_DATA} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dieselGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.65} />
                        <stop offset="95%" stopColor="#0284C7" stopOpacity={0.25} />
                      </linearGradient>
                      <linearGradient id="petrolGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.65} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.25} />
                      </linearGradient>
                      <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C084FC" stopOpacity={0.65} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.25} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={9.5} tickLine={false} />
                    <YAxis
                      stroke="var(--text-secondary)"
                      fontSize={9.5}
                      tickLine={false}
                      domain={[0, 36000]}
                      tickFormatter={(v: number) => `${v / 1000}k L`}
                    />
                    <Tooltip content={<CustomStackedTooltip />} cursor={{ stroke: 'rgba(56, 189, 248, 0.4)', strokeDasharray: '3 3' }} />
                    <ReferenceLine y={12000} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Buffer 12k L', fill: '#EF4444', fontSize: 9, position: 'top' }} />
                    <ReferenceLine x="Today (Nov 21)" stroke="#38BDF8" strokeDasharray="2 2" label={{ value: 'Today', fill: '#38BDF8', fontSize: 9, position: 'insideTopLeft' }} />
                    <Area
                      type="monotone"
                      dataKey="diesel"
                      stackId="fuel"
                      stroke="#38BDF8"
                      strokeWidth={1.8}
                      fill="url(#dieselGrad)"
                      dot={{ r: 3, strokeWidth: 1.5, fill: '#FFFFFF', stroke: '#38BDF8' }}
                      activeDot={{ r: 4.5, strokeWidth: 2, fill: '#38BDF8', stroke: '#FFFFFF' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="petrol"
                      stackId="fuel"
                      stroke="#10B981"
                      strokeWidth={1.8}
                      fill="url(#petrolGrad)"
                      dot={{ r: 3, strokeWidth: 1.5, fill: '#FFFFFF', stroke: '#10B981' }}
                      activeDot={{ r: 4.5, strokeWidth: 2, fill: '#10B981', stroke: '#FFFFFF' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="speed"
                      stackId="fuel"
                      stroke="#A855F7"
                      strokeWidth={1.8}
                      fill="url(#speedGrad)"
                      dot={{ r: 3, strokeWidth: 1.5, fill: '#FFFFFF', stroke: '#A855F7' }}
                      activeDot={{ r: 4.5, strokeWidth: 2, fill: '#A855F7', stroke: '#FFFFFF' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom Operational Status Bar - Single Line */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border-color)', fontSize: 10 }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Capacity: <strong style={{ color: 'var(--text-primary)' }}>480,000 L</strong> (32 pumps)
                </span>
                <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                  Nov 24 Inflow: <strong>+17,000 L (4 tankers)</strong>
                </span>
                <span style={{ color: '#EF4444' }}>
                  Buffer Threshold: <strong>12,000 L</strong>
                </span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right: Pumps by Status Breakdown & Quick Alert Dispatch */}
        <Col xs={24} lg={8} style={{ display: 'flex' }}>
          <Card
            title={<span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12.5 }}>Pumps by Risk Status</span>}
            bordered={false}
            styles={{
              body: { flex: 1, padding: '6px 12px 6px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
              header: { minHeight: 32, padding: '0 12px' },
            }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 1 }}>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>Safe (&gt; 5 days)</span>
                  <span style={{ fontWeight: 700 }}>23 pumps (72%)</span>
                </div>
                <Progress percent={72} strokeColor="#10B981" showInfo={false} size="small" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 1 }}>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>Order soon (3 - 5 days)</span>
                  <span style={{ fontWeight: 700 }}>{orderSoonPumps.length + 4} pumps (19%)</span>
                </div>
                <Progress percent={19} strokeColor="#f59e0b" showInfo={false} size="small" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 1 }}>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>At risk (&lt; 3 days)</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>{atRiskPumps.length} pumps (9%)</span>
                </div>
                <Progress percent={9} strokeColor="#ef4444" showInfo={false} size="small" />
              </div>

              {/* Live Alerts Snippet */}
              <div
                style={{
                  background: 'var(--hover-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 6,
                  padding: '5px 8px',
                  marginTop: 2,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                    <MessageSquare size={11} style={{ marginRight: 4, verticalAlign: 'middle', color: '#25D366' }} />
                    WhatsApp Alerts
                  </span>
                  <span style={{ fontSize: 10, color: '#25D366', fontWeight: 600 }}>Active</span>
                </div>
                <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: '1px 0 3px 0', lineHeight: 1.25 }}>
                  Automated warnings sent to dealers for Sharma Fuels and Krishna Fuels.
                </p>
                <Button
                  size="small"
                  block
                  icon={<ArrowUpRight size={10} />}
                  onClick={() => navigate('/distributor/alerts')}
                  style={{ fontSize: 10, height: 20, padding: 0 }}
                >
                  View All Operations Alerts
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section: Urgent Pumps Table - Directly Visible, Fits Screen */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12.5 }}>
              Most Urgent Pumps Requiring Action
            </span>
            <Button
              size="small"
              icon={<RefreshCw size={11} />}
              onClick={() => message.success('Telemetry re-synchronized from depot relays')}
              style={{ fontSize: 11, height: 24 }}
            >
              Refresh Dips
            </Button>
          </div>
        }
        bordered={false}
        styles={{ body: { padding: '4px 8px' }, header: { minHeight: 32, padding: '0 12px' } }}
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Table
          columns={urgentColumns}
          dataSource={pumps}
          rowKey="id"
          pagination={{ pageSize: 3, size: 'small', showSizeChanger: false }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default NetworkDashboard;
