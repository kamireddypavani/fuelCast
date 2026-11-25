// src/pages/dealer/DealerAddStationPage.tsx
import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Tag,
  message,
  Modal,
} from 'antd';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Crown,
  Sparkles,
  Phone,
  MessageSquare,
  Send,
  Radio as RadioIcon,
  MapPin,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

const { Title, Text } = Typography;
const { Option } = Select;

interface TankFormItem {
  id: string;
  name: string;
  fuelType: 'Diesel' | 'Petrol' | 'Speed Petrol' | 'DEF';
  capacityLiters: number;
  safeMinLiters: number;
}

export type DealerPlanTier = 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM';

interface PlanDetail {
  tier: DealerPlanTier;
  title: string;
  stationLimit: number;
  priceMonthly: string;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
}

interface DealerStation {
  id: string;
  name: string;
  code: string;
  city: string;
  area: string;
  depot: string;
  leadTime: string;
  tanksCount: number;
  totalCapacityLiters: number;
  status: 'Active' | 'Under Maintenance';
  telemetrySource: 'IoT ATG Probes' | 'Daily WhatsApp';
  lastSync: string;
}

const DEALER_PLANS: PlanDetail[] = [
  {
    tier: 'FREE',
    title: 'Free Starter Plan',
    stationLimit: 3,
    priceMonthly: '₹0 (Free Forever)',
    badge: 'Included by Admin',
    badgeColor: 'blue',
    description: 'Complimentary tier provided by Platform Admin for all onboarding station retailers.',
    features: [
      'Up to 3 Pump Stations free of charge',
      'Daily WhatsApp morning & evening stick dips',
      '1 Station Manager account per pump',
      'Standard depot refill order dispatch',
    ],
  },
  {
    tier: 'SILVER',
    title: 'Silver Plan',
    stationLimit: 6,
    priceMonthly: '₹1,999 / mo',
    badge: '3 Free + 3 Extended',
    badgeColor: 'default',
    description: 'Ideal for growing station retailers expanding along highway corridors.',
    features: [
      'Up to 6 Pump Stations (3 Free + 3 Extended)',
      'Automated IoT ATG (Veeder-Root) telemetry sync',
      'Multi-tank variance & low-stock early warnings',
      'Priority delivery order queue at depot gantry',
    ],
  },
  {
    tier: 'GOLD',
    title: 'Gold Plan',
    stationLimit: 10,
    priceMonthly: '₹3,999 / mo',
    badge: 'Recommended for 4+ Stations',
    badgeColor: 'gold',
    description: 'Required when adding 4th station. Unlocks multi-drop tanker delivery routing.',
    features: [
      'Up to 10 Pump Stations across districts',
      'Smart Multi-Drop Tanker Milk-Run routing',
      'Auto-predictive depletion ordering',
      'Direct WhatsApp dispatch concierge with distributor',
      'Dedicated logistics manager liaison',
    ],
  },
  {
    tier: 'PLATINUM',
    title: 'Platinum Plan',
    stationLimit: 25,
    priceMonthly: '₹7,999 / mo',
    badge: 'Enterprise Network',
    badgeColor: 'purple',
    description: 'For large station retailer holding companies with pumps across multiple districts.',
    features: [
      'Up to 25 Pump Stations with unlimited tanks',
      'Multi-depot OMC gantry allocation (BPCL + IOCL + HPCL)',
      'Direct ERP billing & tally ledger integration',
      '24/7 Priority Hazmat dispatch SLA',
    ],
  },
];

const INITIAL_STATIONS: DealerStation[] = [
  {
    id: 'st-1',
    name: 'Sharma Fuels (Benz Circle)',
    code: 'FC-VJA-01',
    city: 'Vijayawada',
    area: 'Benz Circle, NH-16 Corridor',
    depot: 'BPCL Kondapalli Depot',
    leadTime: '2 Days',
    tanksCount: 3,
    totalCapacityLiters: 45000,
    status: 'Active',
    telemetrySource: 'IoT ATG Probes',
    lastSync: 'Live (2 mins ago)',
  },
  {
    id: 'st-2',
    name: 'Sharma Express Station',
    code: 'FC-VJA-02',
    city: 'Mangalagiri',
    area: 'Mangalagiri Bypass Junction',
    depot: 'BPCL Kondapalli Depot',
    leadTime: '2 Days',
    tanksCount: 2,
    totalCapacityLiters: 35000,
    status: 'Active',
    telemetrySource: 'IoT ATG Probes',
    lastSync: 'Live (5 mins ago)',
  },
  {
    id: 'st-3',
    name: 'Sharma Highway Outpost',
    code: 'FC-GNT-03',
    city: 'Guntur',
    area: 'Tadepalli Highway Outpost',
    depot: 'IOCL Tadepalli Depot',
    leadTime: '1 Day',
    tanksCount: 2,
    totalCapacityLiters: 30000,
    status: 'Active',
    telemetrySource: 'Daily WhatsApp',
    lastSync: 'Today, 06:15 AM',
  },
];

export const DealerAddStationPage: React.FC = () => {
  const navigate = useNavigate();
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');
  const [form] = Form.useForm();

  // Owner's Stations List & Plan State
  const [stations, setStations] = useState<DealerStation[]>(INITIAL_STATIONS);
  const [currentPlan, setCurrentPlan] = useState<DealerPlanTier>('FREE');
  const [isContactAdminOpen, setIsContactAdminOpen] = useState<boolean>(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<DealerPlanTier>('GOLD');
  const [adminNote, setAdminNote] = useState<string>('Requesting upgrade to Gold Plan to add Station #4 on NH-16 Guntur Corridor.');

  const activePlanInfo = DEALER_PLANS.find((p) => p.tier === currentPlan) || DEALER_PLANS[0];
  const stationsCount = stations.length;
  const isLimitReached = stationsCount >= activePlanInfo.stationLimit;

  // Form states for new station
  const dataSource = 'Auto-sync';
  const [tanks, setTanks] = useState<TankFormItem[]>([
    {
      id: 't-1',
      name: 'Tank 1 (High Speed Diesel)',
      fuelType: 'Diesel',
      capacityLiters: 20000,
      safeMinLiters: 3000,
    },
    {
      id: 't-2',
      name: 'Tank 2 (Regular Petrol MS)',
      fuelType: 'Petrol',
      capacityLiters: 15000,
      safeMinLiters: 2500,
    },
    {
      id: 't-3',
      name: 'Tank 3 (Speed XP95)',
      fuelType: 'Speed Petrol',
      capacityLiters: 10000,
      safeMinLiters: 1500,
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
    setTanks(tanks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  // Submit new pump station
  const onFinish = (values: any) => {
    if (isLimitReached) {
      message.error(
        `Station limit of ${activePlanInfo.stationLimit} reached on your ${activePlanInfo.title}. Please contact the Platform Administrator to upgrade to the Gold Plan.`
      );
      setIsContactAdminOpen(true);
      return;
    }

    const newStation: DealerStation = {
      id: `st-${Date.now()}`,
      name: values.name || 'New Station',
      code: values.code || `FC-VJA-0${stations.length + 1}`,
      city: values.city || 'Vijayawada',
      area: values.area || 'Enikepadu Toll Plaza',
      depot: values.depot || 'BPCL Kondapalli Depot',
      leadTime: `${values.leadTime || 2} Days`,
      tanksCount: tanks.length,
      totalCapacityLiters: tanks.reduce((sum, t) => sum + Number(t.capacityLiters), 0),
      status: 'Active',
      telemetrySource: dataSource === 'Auto-sync' ? 'IoT ATG Probes' : 'Daily WhatsApp',
      lastSync: 'Just now (Initialized)',
    };

    setStations([...stations, newStation]);
    message.success(`Pump station "${newStation.name}" registered successfully to your retailer account!`);
    form.resetFields();
  };

  // Admin approval simulation
  const handleSimulateAdminApproval = (tier: DealerPlanTier) => {
    setCurrentPlan(tier);
    setIsContactAdminOpen(false);
    const upgraded = DEALER_PLANS.find((p) => p.tier === tier);
    message.success(`🎉 Administrator approved upgrade to ${upgraded?.title}! Quota extended to ${upgraded?.stationLimit} stations.`);
  };

  const handleSendAdminRequest = () => {
    message.success(`Upgrade request for ${selectedPlanForUpgrade} Plan sent to Platform Administrator. Admin will review and approve.`);
    setIsContactAdminOpen(false);
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', paddingBottom: 50, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* 1. Header with Back Navigation and Owner Profile */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
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
                My Station Network &amp; Onboarding
              </Title>
              <Tag
                color={isLimitReached ? 'warning' : 'success'}
                style={{
                  fontWeight: 700,
                  borderRadius: 100,
                  fontSize: 11,
                  padding: '1px 10px',
                }}
              >
                {isLimitReached ? '3 of 3 Stations Used (Quota Full)' : `${activePlanInfo.stationLimit - stationsCount} Slots Available`}
              </Tag>
            </div>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              Station Retailer Portal • Manage existing retail pumps and request quota expansion from Administrator.
            </Text>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#F1F5F9',
              border: '1px solid var(--border-color)',
              borderRadius: 100,
              padding: '4px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Retailer:</span>
            <strong style={{ color: 'var(--text-primary)' }}>Ramesh Sharma (Sharma Fuels)</strong>
          </div>
        </div>
      </div>

      {/* 2. SECTION 1: HOW MANY PUMP STATIONS THEY HAVE (SHOW THEM) */}
      <Card
        bordered={false}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 size={18} color="#2563EB" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 15 }}>
                My Registered Pump Stations ({stations.length} Active Stations)
              </span>
            </div>
            <Tag color="blue" style={{ fontWeight: 700, borderRadius: 100, fontSize: 11 }}>
              Plan: {activePlanInfo.title} ({stations.length}/{activePlanInfo.stationLimit} Used)
            </Tag>
          </div>
        }
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Row gutter={[14, 14]}>
          {stations.map((station, idx) => (
            <Col xs={24} md={8} key={station.id}>
              <div
                style={{
                  background: isDark ? 'rgba(15, 23, 42, 0.65)' : '#F8FAFC',
                  border: '1px solid var(--border-color)',
                  borderTop: '3px solid #2563EB',
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                      #{idx + 1} {station.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                      <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />
                      {station.area}, {station.city}
                    </div>
                  </div>
                  <Tag color="cyan" style={{ fontWeight: 700, margin: 0, fontSize: 10.5 }}>
                    {station.code}
                  </Tag>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 6,
                    fontSize: 11,
                    background: 'var(--hover-bg)',
                    padding: '8px 10px',
                    borderRadius: 6,
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Tanks:</span>{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{station.tanksCount} Tanks</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Capacity:</span>{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{station.totalCapacityLiters.toLocaleString()} L</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Depot:</span>{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{station.depot.split(' ')[0]}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Lead:</span>{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{station.leadTime}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, marginTop: 'auto' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#10B981', fontWeight: 600 }}>
                    <RadioIcon size={12} />
                    {station.telemetrySource}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>
                    {station.lastSync}
                  </span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 3. SECTION 2: TO ADD ANOTHER STATION -> SEE OUR PLANS & CONTACT ADMINISTRATOR */}
      <Card
        bordered={false}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Crown size={18} color="#F59E0B" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 15 }}>
                Subscription Plans to Add More Pump Stations
              </span>
            </div>
            <Button
              type="primary"
              icon={<MessageSquare size={14} />}
              onClick={() => setIsContactAdminOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              Contact Administrator to Upgrade Plan
            </Button>
          </div>
        }
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ marginBottom: 14, fontSize: 12.5, color: 'var(--text-secondary)' }}>
          The Platform Admin provides <strong>3 pump stations free of charge</strong> under your starter tier. When you want to add a <strong>4th station</strong> or more, view our plans below and contact the administrator to expand your quota:
        </div>

        {/* 4 Plan Tier Cards */}
        <Row gutter={[14, 14]}>
          {DEALER_PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.tier;
            const isGold = plan.tier === 'GOLD';

            return (
              <Col xs={24} sm={12} lg={6} key={plan.tier}>
                <div
                  style={{
                    border: isCurrent
                      ? '2px solid #2563EB'
                      : isGold
                        ? '2px solid #F59E0B'
                        : '1px solid var(--border-color)',
                    borderRadius: 12,
                    padding: '16px 14px',
                    background: isCurrent
                      ? (isDark ? 'rgba(37, 99, 235, 0.08)' : '#EFF6FF')
                      : isGold
                        ? (isDark ? 'rgba(245, 158, 11, 0.07)' : '#FFFBEB')
                        : 'var(--hover-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    boxShadow: isGold ? '0 4px 14px rgba(245, 158, 11, 0.15)' : 'none',
                    position: 'relative',
                  }}
                >
                  {isGold && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: 12,
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: '#FFFFFF',
                        fontSize: 9.5,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 10,
                        letterSpacing: 0.3,
                        boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
                      }}
                    >
                      RECOMMENDED FOR 4TH STATION
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{plan.title}</strong>
                      <Tag color={plan.badgeColor} style={{ margin: 0, fontWeight: 700, borderRadius: 100, fontSize: 10.5 }}>
                        {plan.stationLimit} Stations
                      </Tag>
                    </div>

                    <div style={{ fontSize: 16, fontWeight: 800, color: isGold ? '#F59E0B' : '#2563EB', margin: '6px 0' }}>
                      {plan.priceMonthly}
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.35 }}>
                      {plan.description}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ fontSize: 10.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <CheckCircle2 size={12} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type={isCurrent ? 'default' : isGold ? 'primary' : 'default'}
                    block
                    onClick={() => {
                      setSelectedPlanForUpgrade(plan.tier);
                      setIsContactAdminOpen(true);
                    }}
                    style={{
                      borderRadius: 6,
                      fontWeight: 700,
                      height: 32,
                      fontSize: 11.5,
                      background: isGold && !isCurrent ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : undefined,
                      border: isGold && !isCurrent ? 'none' : undefined,
                      color: isCurrent ? 'var(--text-primary)' : undefined,
                    }}
                  >
                    {isCurrent ? '✓ Current Plan (3 Stations)' : `Request ${plan.title.replace(' Plan', '')}`}
                  </Button>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* 4. SECTION 3: ADD NEW STATION FORM (UNLOCKED OR LOCKED WITH HELPER) */}
      <Card
        bordered={false}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} color="#10B981" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 15 }}>
                Register New Pump Station ({isLimitReached ? 'Station #4 - Quota Upgrade Required' : `Station #${stations.length + 1}`})
              </span>
            </div>
            {isLimitReached ? (
              <Tag color="warning" style={{ fontWeight: 700, borderRadius: 100 }}>
                Locked: Free Starter Limit (3/3 Used)
              </Tag>
            ) : (
              <Tag color="success" style={{ fontWeight: 700, borderRadius: 100 }}>
                Unlocked ({activePlanInfo.stationLimit - stations.length} Slots Available on {activePlanInfo.title})
              </Tag>
            )}
          </div>
        }
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {isLimitReached ? (
          <div
            style={{
              padding: '24px 20px',
              textAlign: 'center',
              background: isDark ? 'rgba(245, 158, 11, 0.05)' : '#FFFBEB',
              border: '1px dashed rgba(245, 158, 11, 0.4)',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F59E0B',
              }}
            >
              <Lock size={22} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              Station #4 Registration Locked Under Free Starter Tier
            </div>
            <div style={{ maxWidth: 540, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              You have currently connected all <strong>3 free pump stations</strong> provided by the Admin. To register Station #4, contact the administrator to activate the <strong>Gold Plan (supports up to 10 stations)</strong>.
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                type="primary"
                icon={<MessageSquare size={14} />}
                onClick={() => setIsContactAdminOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  height: 36,
                }}
              >
                Contact Administrator to Upgrade Plan
              </Button>
              <Button
                icon={<Sparkles size={14} />}
                onClick={() => handleSimulateAdminApproval('GOLD')}
                style={{ borderRadius: 8, height: 36, fontWeight: 600 }}
              >
                ⚡ Simulate Admin Approving Gold Plan (Instant Unlock)
              </Button>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: 'Sharma Fuels - Highway Outpost 4',
              code: `FC-VJA-0${stations.length + 1}`,
              leadTime: '2',
              depot: 'BPCL Kondapalli Depot',
              state: 'Andhra Pradesh',
              city: 'Vijayawada',
              area: 'NH-16 Enikepadu Toll Plaza',
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Pump Station Trade Name</span>}
                  name="name"
                  rules={[{ required: true, message: 'Please enter pump station name' }]}
                >
                  <Input placeholder="e.g. Sharma Fuels - Highway Outpost 4" style={{ borderRadius: 6, height: 36 }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  label={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Station Code</span>}
                  name="code"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g. FC-VJA-04" style={{ borderRadius: 6, height: 36 }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  label={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>City / District</span>}
                  name="city"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g. Vijayawada" style={{ borderRadius: 6, height: 36 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Area / Highway Corridor</span>}
                  name="area"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g. NH-16 Enikepadu Toll" style={{ borderRadius: 6, height: 36 }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Designated Oil Supply Depot</span>}
                  name="depot"
                >
                  <Select style={{ width: '100%', height: 36 }}>
                    <Option value="BPCL Kondapalli Depot">BPCL Kondapalli Depot (Vijayawada)</Option>
                    <Option value="IOCL Tadepalli Depot">IOCL Tadepalli Depot (Guntur)</Option>
                    <Option value="HPCL Cherlapally Terminal">HPCL Cherlapally Terminal (Hyderabad)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Delivery Lead Time</span>}
                  name="leadTime"
                >
                  <Select style={{ width: '100%', height: 36 }}>
                    <Option value="1">1 Day (Express Corridor)</Option>
                    <Option value="2">2 Days (Standard Delivery)</Option>
                    <Option value="3">3 Days (Outstation Bulk)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Underground Tanks */}
            <div style={{ marginTop: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>
                  Underground Storage Tanks ({tanks.length} Configured)
                </span>
                <Button size="small" type="dashed" icon={<Plus size={13} />} onClick={handleAddTank} style={{ borderRadius: 6 }}>
                  Add Tank
                </Button>
              </div>

              {tanks.map((tank) => (
                <div
                  key={tank.id}
                  style={{
                    background: 'var(--hover-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    marginBottom: 8,
                  }}
                >
                  <Row gutter={12} align="middle">
                    <Col xs={24} sm={7}>
                      <Input
                        value={tank.name}
                        onChange={(e) => handleTankChange(tank.id, 'name', e.target.value)}
                        placeholder="Tank Name"
                        style={{ height: 32 }}
                      />
                    </Col>
                    <Col xs={24} sm={6}>
                      <Select
                        value={tank.fuelType}
                        onChange={(val) => handleTankChange(tank.id, 'fuelType', val)}
                        style={{ width: '100%', height: 32 }}
                      >
                        <Option value="Diesel">💧 Diesel (HSD)</Option>
                        <Option value="Petrol">🟢 Regular Petrol (MS)</Option>
                        <Option value="Speed Petrol">🟣 Speed XP95</Option>
                        <Option value="DEF">🔵 DEF / AdBlue</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={5}>
                      <Select
                        value={tank.capacityLiters}
                        onChange={(val) => handleTankChange(tank.id, 'capacityLiters', val)}
                        style={{ width: '100%', height: 32 }}
                      >
                        <Option value={3000}>3,000 L (DEF)</Option>
                        <Option value={15000}>15,000 L</Option>
                        <Option value={20000}>20,000 L</Option>
                        <Option value={25000}>25,000 L</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Select
                        value={tank.safeMinLiters}
                        onChange={(val) => handleTankChange(tank.id, 'safeMinLiters', val)}
                        style={{ width: '100%', height: 32 }}
                      >
                        <Option value={500}>500 L</Option>
                        <Option value={2000}>2,000 L</Option>
                        <Option value={3000}>3,000 L</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={2} style={{ textAlign: 'right' }}>
                      {tanks.length > 1 && (
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<Trash2 size={13} />}
                          onClick={() => handleRemoveTank(tank.id)}
                        />
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <Button onClick={() => form.resetFields()} style={{ borderRadius: 6 }}>
                Reset Form
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  borderRadius: 6,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: 'none',
                }}
              >
                Register &amp; Activate Station #{stations.length + 1}
              </Button>
            </div>
          </Form>
        )}
      </Card>

      {/* 5. CONTACT ADMINISTRATOR MODAL */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={18} color="#2563EB" />
            <span style={{ fontWeight: 800, fontSize: 15 }}>Contact Platform Administrator for Plan Upgrade</span>
          </div>
        }
        open={isContactAdminOpen}
        onCancel={() => setIsContactAdminOpen(false)}
        footer={null}
        width={600}
        centered
        styles={{
          body: {
            maxHeight: 'calc(82vh - 60px)',
            overflowY: 'auto',
            paddingRight: 4,
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            In accordance with platform governance, the <strong>Platform Administrator</strong> provisions distributor licenses and station retailer quotas.
          </div>

          <div
            style={{
              background: isDark ? 'rgba(37, 99, 235, 0.08)' : '#EFF6FF',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: 8,
              padding: '10px 14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Selected Tier:</span>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#2563EB' }}>
                  {DEALER_PLANS.find((p) => p.tier === selectedPlanForUpgrade)?.title}
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500, marginLeft: 6 }}>
                    ({DEALER_PLANS.find((p) => p.tier === selectedPlanForUpgrade)?.stationLimit} Stations Quota)
                  </span>
                </div>
              </div>
              <Tag color="gold" style={{ fontWeight: 700, margin: 0, padding: '2px 8px' }}>
                {DEALER_PLANS.find((p) => p.tier === selectedPlanForUpgrade)?.priceMonthly}
              </Tag>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>
              Note for Administrator:
            </label>
            <Input.TextArea
              rows={2}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Explain why you want to expand stations and specify highway corridors..."
              style={{ borderRadius: 6, fontSize: 12 }}
            />
          </div>

          {/* Administrator Direct Channels */}
          <div
            style={{
              background: 'var(--hover-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 11.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12 }}>
              Platform Administrator Contact Desk:
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>
                <Phone size={12} style={{ display: 'inline', marginRight: 4, color: '#2563EB' }} />
                Admin Hotline:
              </span>
              <strong style={{ color: 'var(--text-primary)' }}>+91 98480 12345 (Toll-Free Desk)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>
                <MessageSquare size={12} style={{ display: 'inline', marginRight: 4, color: '#25D366' }} />
                Admin WhatsApp:
              </span>
              <strong style={{ color: '#25D366' }}>+91 98480 99999 (Immediate Approvals)</strong>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, flexWrap: 'wrap', gap: 8 }}>
            <Button
              size="small"
              icon={<Sparkles size={13} />}
              onClick={() => handleSimulateAdminApproval(selectedPlanForUpgrade)}
              style={{ fontWeight: 600, fontSize: 11.5, height: 32 }}
            >
              ⚡ Instant Admin Approval (Demo)
            </Button>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="small" onClick={() => setIsContactAdminOpen(false)} style={{ height: 32, fontSize: 12 }}>
                Cancel
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<Send size={13} />}
                onClick={handleSendAdminRequest}
                style={{ fontWeight: 700, background: '#2563EB', height: 32, fontSize: 12 }}
              >
                Send Request to Admin
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DealerAddStationPage;
