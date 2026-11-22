// src/pages/dealer/DealerAiForecastPage.tsx
import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Tag,
  Button,
  Table,
  Select,
  Typography,
  Radio,
  Modal,
  Form,
  message,
} from 'antd';
import {
  Sparkles,
  TrendingDown,
  Calendar,
  Clock,
  Flame,
  CheckCircle2,
  Truck,
  RefreshCw,
  Sliders,
  PartyPopper,
  Car,
  ArrowLeft,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

const { Title, Text } = Typography;

// 7-Day Stock Depletion Simulation Data (Past 3 Days Actual + Future 4 Days AI Forecast)
const BASE_DEPLETION_DATA = [
  { date: 'Nov 19 (Wed)', diesel: 10400, petrol: 13800, speed: 8900, def: 2100, isActual: true },
  { date: 'Nov 20 (Thu)', diesel: 8200, petrol: 12050, speed: 8460, def: 1980, isActual: true },
  { date: 'Nov 21 (Today)', diesel: 4200, petrol: 8550, speed: 7900, def: 1850, isActual: true },
  { date: 'Nov 22 (Sat - Day 1)', diesel: 2050, petrol: 5900, speed: 7300, def: 1720, isForecast: true },
  { date: 'Nov 23 (Sun - Day 2)', diesel: 0, petrol: 3100, speed: 6750, def: 1590, isForecast: true, stockoutDiesel: true },
  { date: 'Nov 24 (Mon - Day 3)', diesel: 0, petrol: 700, speed: 6200, def: 1470, isForecast: true, stockoutPetrol: true },
  { date: 'Nov 25 (Tue - Day 4)', diesel: 0, petrol: 0, speed: 5650, def: 1350, isForecast: true },
];

// 24-Hour Hourly Consumption Curve (Peak Hours Breakdown)
const HOURLY_CONSUMPTION_DATA = [
  { hour: '00:00', diesel: 25, petrol: 10, total: 35, period: 'Night Highway Lull' },
  { hour: '02:00', diesel: 30, petrol: 8, total: 38, period: 'Night Freight' },
  { hour: '04:00', diesel: 45, petrol: 15, total: 60, period: 'Early Morning Transit' },
  { hour: '06:00', diesel: 90, petrol: 65, total: 155, period: 'Early Commuter Flow' },
  { hour: '08:00', diesel: 110, petrol: 145, total: 255, period: '⚡ Morning Office Rush' },
  { hour: '10:00', diesel: 95, petrol: 130, total: 225, period: 'Morning Commercial' },
  { hour: '12:00', diesel: 115, petrol: 90, total: 205, period: 'Midday City Traffic' },
  { hour: '14:00', diesel: 140, petrol: 75, total: 215, period: '⚡ Highway Truck Logistics' },
  { hour: '16:00', diesel: 125, petrol: 95, total: 220, period: 'Intercity Coaches' },
  { hour: '18:00', diesel: 135, petrol: 170, total: 305, period: '🔥 Evening Mega Rush' },
  { hour: '20:00', diesel: 120, petrol: 150, total: 270, period: 'Evening Shopping Flow' },
  { hour: '22:00', diesel: 60, petrol: 45, total: 105, period: 'Night Cooldown' },
];

export const DealerAiForecastPage: React.FC = () => {
  const navigate = useNavigate();
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');

  // Interactive AI Multiplier Simulation State
  const [simulationScenario, setSimulationScenario] = useState<'normal' | 'weekend' | 'festival' | 'harvest'>('weekend');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedRefillFuel, setSelectedRefillFuel] = useState<string>('Diesel');
  const [orderForm] = Form.useForm();

  // Multiplier calculation based on user selection
  const scenarioMultipliers = {
    normal: { factor: 1.0, label: 'Standard Weekday Baseline', badge: '1.0x Burn', surgeDesc: 'Baseline city and highway commuter traffic.' },
    weekend: { factor: 1.28, label: 'Weekend Highway Travel Surge', badge: '+28% Surge', surgeDesc: 'Heavy Friday-to-Sunday intercity private cars and tourist buses along NH-16.' },
    festival: { factor: 1.48, label: 'Festival & Holiday Rush (Diwali / Sankranti)', badge: '+48% Surge', surgeDesc: 'Homecoming festival migration with 2.5x personal car and bike refills.' },
    harvest: { factor: 1.35, label: 'Agricultural Harvest Tractor Surge', badge: '+35% Diesel', surgeDesc: 'Local Andhra farming tractors and agri-transport trucks taking bulk diesel.' },
  }[simulationScenario];

  // Dynamic Multi-Tank Run-Dry Calculations
  const tanksForecast = [
    {
      id: 'tank-1',
      name: 'Tank 1 (Main Diesel)',
      fuel: 'Diesel (HSD)',
      color: '#38BDF8',
      currentLiters: 4200,
      capacityLiters: 20000,
      safeMinLiters: 3000,
      baseDailyBurn: 2000,
      adjustedDailyBurn: Math.round(2000 * scenarioMultipliers.factor),
      hoursToSafeMin: Math.max(0, Number(((4200 - 3000) / (2000 * scenarioMultipliers.factor / 24)).toFixed(1))),
      hoursToBlank: Number((4200 / (2000 * scenarioMultipliers.factor / 24)).toFixed(1)),
      runDryDate: simulationScenario === 'festival' ? 'Saturday, 02:30 PM (Tomorrow)' : 'Saturday, 07:15 PM (Tomorrow)',
      recommendedOrderLiters: 12000,
      urgency: 'CRITICAL RUN-DRY',
      urgencyColor: '#EF4444',
      status: 'Runs completely BLANK in < 40 hours!',
    },
    {
      id: 'tank-2',
      name: 'Tank 2 (Regular Petrol MS)',
      fuel: 'Petrol (MS)',
      color: '#10B981',
      currentLiters: 8550,
      capacityLiters: 15000,
      safeMinLiters: 2500,
      baseDailyBurn: 1750,
      adjustedDailyBurn: Math.round(1750 * scenarioMultipliers.factor),
      hoursToSafeMin: Number(((8550 - 2500) / (1750 * scenarioMultipliers.factor / 24)).toFixed(1)),
      hoursToBlank: Number((8550 / (1750 * scenarioMultipliers.factor / 24)).toFixed(1)),
      runDryDate: simulationScenario === 'festival' ? 'Sunday, 11:00 PM (3 days)' : 'Monday, 04:30 PM (4 days)',
      recommendedOrderLiters: 4000,
      urgency: 'ORDER SOON',
      urgencyColor: '#F59E0B',
      status: 'Sufficient for weekend, breaches buffer Monday',
    },
    {
      id: 'tank-3',
      name: 'Tank 3 (Speed Premium XP95)',
      fuel: 'Speed XP95',
      color: '#A855F7',
      currentLiters: 7900,
      capacityLiters: 10000,
      safeMinLiters: 1500,
      baseDailyBurn: 440,
      adjustedDailyBurn: Math.round(440 * (simulationScenario === 'festival' ? 1.6 : scenarioMultipliers.factor)),
      hoursToSafeMin: Number(((7900 - 1500) / (440 * scenarioMultipliers.factor / 24)).toFixed(1)),
      hoursToBlank: Number((7900 / (440 * scenarioMultipliers.factor / 24)).toFixed(1)),
      runDryDate: 'Dec 09 (16.5 days remaining)',
      recommendedOrderLiters: 0,
      urgency: 'OPTIMAL',
      urgencyColor: '#10B981',
      status: 'Adequate reserve for over 2 weeks',
    },
    {
      id: 'tank-4',
      name: 'Tank 4 (DEF / AdBlue Fluid)',
      fuel: 'DEF (BS6 Fluid)',
      color: '#06B6D4',
      currentLiters: 1850,
      capacityLiters: 3000,
      safeMinLiters: 500,
      baseDailyBurn: 120,
      adjustedDailyBurn: Math.round(120 * scenarioMultipliers.factor),
      hoursToSafeMin: Number(((1850 - 500) / (120 * scenarioMultipliers.factor / 24)).toFixed(1)),
      hoursToBlank: Number((1850 / (120 * scenarioMultipliers.factor / 24)).toFixed(1)),
      runDryDate: 'Dec 06 (14 days remaining)',
      recommendedOrderLiters: 1000,
      urgency: 'OPTIMAL',
      urgencyColor: '#10B981',
      status: 'Adequate reserve for 14 days',
    },
  ];

  // Table Columns
  const tableColumns = [
    {
      title: 'Underground Tank & Fuel',
      key: 'tank',
      render: (_: any, r: any) => (
        <div>
          <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>{r.name}</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {r.currentLiters.toLocaleString()} L of {r.capacityLiters.toLocaleString()} L ({Math.round((r.currentLiters / r.capacityLiters) * 100)}%)
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Current Burn Velocity',
      key: 'burn',
      render: (_: any, r: any) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12.5 }}>
            {r.adjustedDailyBurn.toLocaleString()} L / day
          </div>
          <div style={{ fontSize: 10.5, color: '#F59E0B' }}>
            {scenarioMultipliers.badge} applied ({r.baseDailyBurn} L base)
          </div>
        </div>
      ),
    },
    {
      title: 'Hours to Safe Minimum (3,000 L)',
      key: 'buffer',
      render: (_: any, r: any) => (
        <div>
          <span style={{ fontWeight: 700, color: r.hoursToSafeMin <= 24 ? '#EF4444' : 'var(--text-primary)' }}>
            {r.hoursToSafeMin} hours
          </span>
          <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
            {r.hoursToSafeMin <= 24 ? '🚨 Breaches buffer TODAY' : 'Buffer safe'}
          </div>
        </div>
      ),
    },
    {
      title: 'Predicted ZERO FUEL (Blank) Time',
      key: 'blank',
      render: (_: any, r: any) => (
        <div>
          <div style={{ fontWeight: 800, color: r.urgencyColor, fontSize: 12.5 }}>
            {r.runDryDate}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
            Countdown: ~{r.hoursToBlank} hours left
          </div>
        </div>
      ),
    },
    {
      title: 'AI Proactive Action',
      key: 'action',
      render: (_: any, r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {r.recommendedOrderLiters > 0 ? (
            <Button
              size="small"
              type={r.urgency === 'CRITICAL RUN-DRY' ? 'primary' : 'default'}
              danger={r.urgency === 'CRITICAL RUN-DRY'}
              icon={<Truck size={12} />}
              onClick={() => {
                setSelectedRefillFuel(r.fuel);
                setIsOrderModalOpen(true);
              }}
              style={{ fontWeight: 700, borderRadius: 6, fontSize: 11.5 }}
            >
              Order {r.recommendedOrderLiters.toLocaleString()} L Now
            </Button>
          ) : (
            <Tag color="success" style={{ fontWeight: 600, borderRadius: 4, margin: 0 }}>
              <CheckCircle2 size={11} style={{ display: 'inline', marginRight: 4 }} />
              Optimal
            </Tag>
          )}
        </div>
      ),
    },
  ];

  const handleRefillSubmit = (values: any) => {
    message.success(`Refill order for ${values.quantity || 12000} L of ${selectedRefillFuel} dispatched to BPCL Kondapalli Depot!`);
    setIsOrderModalOpen(false);
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', paddingBottom: 50, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header with Live Prediction Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/dealer/dashboard')}
            style={{
              background: 'var(--panel-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: 8,
              height: 36,
              width: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Title level={3} style={{ margin: 0, color: 'var(--text-primary)', fontSize: 20, fontWeight: 800 }}>
                FuelCast AI Depletion &amp; Peak Hour Predictor
              </Title>
              <Tag color="purple" style={{ fontWeight: 700, borderRadius: 100, fontSize: 11 }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                Self-Learning Model v3.2
              </Tag>
            </div>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              Learns 90-day hourly sales velocity, peak commuter rush, weekend surges &amp; festival spikes to prevent blank tanks.
            </Text>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            icon={<RefreshCw size={13} />}
            onClick={() => message.success('Telemetry re-analyzed: 2,160 past hours re-indexed with 98.4% model confidence.')}
            style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}
          >
            Re-train on Recent Dips
          </Button>
          <Button
            type="primary"
            icon={<Truck size={13} />}
            onClick={() => setIsOrderModalOpen(true)}
            style={{ borderRadius: 6, fontWeight: 700, fontSize: 12, background: '#2563EB' }}
          >
            Quick Tanker Order
          </Button>
        </div>
      </div>

      {/* 2. Interactive AI Scenario & Traffic Multiplier Selector */}
      <Card
        bordered={false}
        styles={{ body: { padding: '14px 18px' } }}
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Sliders size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                Active Demand Simulation: <span style={{ color: '#A855F7' }}>{scenarioMultipliers.label}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                {scenarioMultipliers.surgeDesc}
              </div>
            </div>
          </div>

          <Radio.Group
            value={simulationScenario}
            onChange={(e) => setSimulationScenario(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="normal">Weekday (1.0x)</Radio.Button>
            <Radio.Button value="weekend">
              <Car size={12} style={{ display: 'inline', marginRight: 4 }} />
              Weekend (+28%)
            </Radio.Button>
            <Radio.Button value="festival">
              <PartyPopper size={12} style={{ display: 'inline', marginRight: 4 }} />
              Festival / Holiday (+48%)
            </Radio.Button>
            <Radio.Button value="harvest">
              <Flame size={12} style={{ display: 'inline', marginRight: 4 }} />
              Harvest Tractor (+35%)
            </Radio.Button>
          </Radio.Group>
        </div>
      </Card>

      {/* 3. 4 AI Forecast KPI Cards */}
      <Row gutter={[12, 12]}>
        {/* Card 1: Immediate Zero Stockout Alert */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            styles={{ body: { padding: '12px 14px' } }}
            style={{
              background: isDark
                ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.16) 0%, rgba(15, 23, 42, 0.9) 100%)'
                : '#FEF2F2',
              border: '1.5px solid rgba(239, 68, 68, 0.45)',
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>
                  🚨 Predicted Zero Fuel
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#EF4444', marginTop: 2, lineHeight: 1.1 }}>
                  28.5 Hours
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                  Tank 1 (Diesel) runs BLANK
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
                  Saturday ~07:15 PM without refill
                </div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                <TrendingDown size={18} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 2: Peak Rush Hour Velocity */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            styles={{ body: { padding: '12px 14px' } }}
            style={{
              background: isDark ? 'var(--panel-bg)' : '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase' }}>
                  ⚡ Peak Hour Outflow
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2, lineHeight: 1.1 }}>
                  305 L / hr
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                  Evening Rush (06 PM - 09 PM)
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
                  Burns 42% of daily volume
                </div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                <Clock size={18} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: AI Learning Confidence */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            styles={{ body: { padding: '12px 14px' } }}
            style={{
              background: isDark ? 'var(--panel-bg)' : '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>
                  🎯 Model Accuracy
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#10B981', marginTop: 2, lineHeight: 1.1 }}>
                  98.4%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                  90 Days Historical Training
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
                  Error variance &lt; 38 L per delivery
                </div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 4: Recommended Weekend Inflow */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            styles={{ body: { padding: '12px 14px' } }}
            style={{
              background: isDark ? 'var(--panel-bg)' : '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                  🚚 Tanker Inflow Required
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#2563EB', marginTop: 2, lineHeight: 1.1 }}>
                  16,000 L
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                  12k L Diesel + 4k L Petrol
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
                  Order before Fri 11 AM to arrive Sat
                </div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                <Truck size={18} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 4. Multi-Day Stock Depletion Curve & 24-Hour Peak Hours Grid */}
      <Row gutter={[16, 16]}>
        {/* Left: 7-Day Stock Depletion Curve to Zero Fuel (14 cols) */}
        <Col xs={24} lg={15}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13.5 }}>
                  Multi-Day Stock Depletion Trajectory (Day 1 → Day 2 → Day 3 Run-Dry)
                </span>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38BDF8' }} />
                    Diesel (Runs dry Sat night)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
                    Petrol (Runs dry Mon)
                  </span>
                </div>
              </div>
            }
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BASE_DEPLETION_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastDiesel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="forecastPetrol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} tickFormatter={(v) => `${v / 1000}k L`} />
                  <RechartsTooltip contentStyle={{ background: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: 8, fontSize: 12 }} />
                  <ReferenceLine y={3000} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Safe Min (3k L)', fill: '#EF4444', fontSize: 10, position: 'top' }} />
                  <ReferenceLine x="Nov 21 (Today)" stroke="#38BDF8" strokeDasharray="2 2" label={{ value: 'Today', fill: '#38BDF8', fontSize: 10, position: 'insideTopLeft' }} />
                  <Area
                    type="monotone"
                    dataKey="diesel"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    fill="url(#forecastDiesel)"
                    name="Diesel (HSD)"
                  />
                  <Area
                    type="monotone"
                    dataKey="petrol"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#forecastPetrol)"
                    name="Regular Petrol (MS)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div
              style={{
                marginTop: 10,
                padding: '8px 12px',
                background: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 11.5,
              }}
            >
              <span style={{ color: '#EF4444', fontWeight: 700 }}>
                ⚠️ Multi-Day Run-Dry Forecast:
              </span>
              <span style={{ color: 'var(--text-primary)' }}>
                Day 1 (Fri): Burns 2,150 L → Day 2 (Sat): Burns 2,400 L → <strong>Day 3 (Sun): PUMPS COMPLETELY EMPTY (BLANK)</strong>
              </span>
            </div>
          </Card>
        </Col>

        {/* Right: 24-Hour Peak Hours Outflow (9 cols) */}
        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13.5 }}>
                  Hourly Peak Traffic Burn Velocity
                </span>
                <Tag color="orange" style={{ margin: 0, fontWeight: 700, fontSize: 10.5 }}>
                  Top Peak: 06 PM
                </Tag>
              </div>
            }
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOURLY_CONSUMPTION_DATA} margin={{ top: 10, right: 10, left: -14, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="hour" stroke="var(--text-secondary)" fontSize={9.5} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={9.5} tickLine={false} />
                  <RechartsTooltip contentStyle={{ background: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="total" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Total Fuel (L/hr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginTop: 10 }}>
              <span>Morning Peak: <strong>08:00 - 10:30 AM</strong></span>
              <span>Evening Rush: <strong>05:30 - 09:30 PM</strong></span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 5. Run-Dry Prediction Table for All 4 Tanks */}
      <Card
        bordered={false}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
              Zero-Stockout Runway Matrix (All 4 Underground Tanks)
            </span>
            <Tag color="blue" style={{ fontWeight: 600 }}>
              Supply Depot SLA: 2 Days (BPCL Kondapalli)
            </Tag>
          </div>
        }
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Table
          dataSource={tanksForecast}
          columns={tableColumns}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 6. Upcoming Regional Festival & Highway Traffic Calendar */}
      <Card
        bordered={false}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color="#A855F7" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13.5 }}>
              Upcoming Highway Corridor Traffic &amp; Surge Calendar
            </span>
          </div>
        }
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={8}>
            <div
              style={{
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: 12.5 }}>Nov 28 - Dec 01</strong>
                <Tag color="orange">+25% Petrol</Tag>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                Karthika Masam Temple Corridor
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                High weekend pilgrim traffic to Amaravathi &amp; Vijayawada Kanaka Durga temple.
              </div>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div
              style={{
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: 12.5 }}>Dec 24 - Jan 02</strong>
                <Tag color="purple">+35% Combined</Tag>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                Year-End Holiday Highway Surge
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                NH-16 Hyderabad-Vijayawada-Vizag interstate express coaches and tourist traffic.
              </div>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div
              style={{
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: 12.5 }}>Jan 13 - Jan 17</strong>
                <Tag color="red">+50% Mega Surge</Tag>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                Sankranti Harvest Mega Surge
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                Highest annual peak: homecoming mass transit + agricultural tractor diesel demand.
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 7. Quick Refill Tanker Order Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={18} color="#2563EB" />
            <span style={{ fontWeight: 800 }}>Dispatch Proactive Refill Order</span>
          </div>
        }
        open={isOrderModalOpen}
        onCancel={() => setIsOrderModalOpen(false)}
        footer={null}
      >
        <Form form={orderForm} layout="vertical" onFinish={handleRefillSubmit} style={{ marginTop: 14 }}>
          <Form.Item label="Target Fuel Tank" name="fuel" initialValue={selectedRefillFuel}>
            <Select onChange={(val) => setSelectedRefillFuel(val)}>
              <Select.Option value="Diesel">Tank 1: Diesel (HSD) - Runs BLANK in 28.5 hrs (Critical)</Select.Option>
              <Select.Option value="Petrol">Tank 2: Petrol (MS) - Runs dry Monday (Order Soon)</Select.Option>
              <Select.Option value="Speed">Tank 3: Speed XP95 - Optimal (16 days)</Select.Option>
              <Select.Option value="DEF">Tank 4: DEF / AdBlue - Optimal (14 days)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Refill Quantity (Standard 4,000 L Compartments)" name="quantity" initialValue={12000}>
            <Select>
              <Select.Option value={4000}>4,000 L (1 Compartment - Safe Top-Up)</Select.Option>
              <Select.Option value={8000}>8,000 L (2 Compartments)</Select.Option>
              <Select.Option value={12000}>12,000 L (3 Compartments - AI Recommended)</Select.Option>
              <Select.Option value={16000}>16,000 L (4 Compartments - Full Tanker)</Select.Option>
            </Select>
          </Form.Item>

          <div
            style={{
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: 700, color: '#2563EB', marginBottom: 2 }}>
              AI Smart Delivery Timing:
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Order submitted now will be queued at BPCL Kondapalli Depot for dispatch tomorrow morning, arriving at Sharma Fuels by 02:00 PM (well ahead of the 07:15 PM zero-stockout threshold).
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsOrderModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ fontWeight: 700, background: '#2563EB' }}>
              Confirm &amp; Transmit Order to Depot
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DealerAiForecastPage;
