// src/pages/distributor/DistributorComplaintsPage.tsx
import React, { useState, useMemo } from 'react';
import {
  Typography,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  message,
  InputNumber,
  Badge,
} from 'antd';
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  CarOutlined,
  UserOutlined,
  DollarCircleOutlined,
  PhoneOutlined,
  SendOutlined,
  EditOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '../../redux/hooks';
import { MOCK_COMPLAINTS } from '../../mock/fuelcastData';
import type { DealerComplaint, ComplaintCategory } from '../../types/fuelcast';

const { Title, Text } = Typography;

export const DistributorComplaintsPage: React.FC = () => {
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');
  const [complaints, setComplaints] = useState<DealerComplaint[]>(MOCK_COMPLAINTS);
  const [statusTab, setStatusTab] = useState<'all' | 'pending' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [justifyingTicket, setJustifyingTicket] = useState<DealerComplaint | null>(null);
  const [form] = Form.useForm();

  // Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'open' || c.status === 'investigating').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
  const totalCredits = complaints.reduce((sum, c) => sum + (c.creditNoteAmount || 0), 0);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return complaints.filter((ticket) => {
      // 1. Status Filter
      if (statusTab === 'pending' && ticket.status === 'resolved') return false;
      if (statusTab === 'resolved' && ticket.status !== 'resolved') return false;

      // 2. Category Filter
      if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          ticket.ticketNumber.toLowerCase().includes(q) ||
          ticket.pumpName.toLowerCase().includes(q) ||
          ticket.dealerName.toLowerCase().includes(q) ||
          ticket.orderNumber.toLowerCase().includes(q) ||
          ticket.truckNumber.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [complaints, statusTab, categoryFilter, searchQuery]);

  // Category Info helper
  const getCategoryInfo = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'tanker_delay':
        return {
          label: 'Tanker Delay',
          color: isDark ? '#FBBF24' : '#D97706',
          bg: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7',
          icon: <ClockCircleOutlined />,
        };
      case 'dip_shortage':
        return {
          label: 'Dip Shortage / Variance',
          color: isDark ? '#F87171' : '#DC2626',
          bg: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
          icon: <ExclamationCircleOutlined />,
        };
      case 'driver_conduct':
        return {
          label: 'Driver Conduct',
          color: isDark ? '#C084FC' : '#7C3AED',
          bg: isDark ? 'rgba(124, 58, 237, 0.2)' : '#EDE9FE',
          icon: <UserOutlined />,
        };
      case 'seal_quality':
        return {
          label: 'Broken Seal / Security',
          color: isDark ? '#FB923C' : '#EA580C',
          bg: isDark ? 'rgba(234, 88, 12, 0.2)' : '#FFEDD5',
          icon: <FileProtectOutlined />,
        };
      default:
        return {
          label: 'General Concern',
          color: isDark ? '#60A5FA' : '#2563EB',
          bg: isDark ? 'rgba(37, 99, 235, 0.2)' : '#DBEAFE',
          icon: <InfoCircleOutlined />,
        };
    }
  };

  // Quick Justification Templates
  const applyQuickTemplate = (templateType: string) => {
    if (!justifyingTicket) return;

    if (templateType === 'gantry_delay') {
      form.setFieldsValue({
        justificationType: 'depot_gantry_delay',
        distributorJustification: `BPCL Kondapalli Gantry loading pump experienced an unexpected breaker trip, delaying 14 outbound tankers. Tanker ${justifyingTicket.truckNumber} has departed and telematics confirms arrival within 35 minutes. Priority decanting arranged.`,
        actionTaken: 'Depot gantry log shared with dealer; demurrage fee waived.',
        status: 'resolved',
      });
    } else if (templateType === 'traffic_jam') {
      form.setFieldsValue({
        justificationType: 'highway_toll_congestion',
        distributorJustification: `Severe vehicular congestion at NH-16 Kaza Toll Plaza due to highway lane maintenance. Driver ${justifyingTicket.driverName} has crossed the bottleneck; live GPS telemetry shows 8 km remaining to your station.`,
        actionTaken: 'Live GPS link sent via WhatsApp; driver instructed for immediate discharge.',
        status: 'resolved',
      });
    } else if (templateType === 'temp_dip') {
      form.setFieldsValue({
        justificationType: 'temp_dip_variance',
        distributorJustification: `Variance analyzed under OISD thermal expansion standards (loading at 36°C vs 28°C delivery). Discrepancy confirmed and fully approved for compensation credit.`,
        actionTaken: `Credit note issued for fuel shortage. Adjusted in monthly billing ledger.`,
        creditNoteAmount: 10800,
        status: 'resolved',
      });
    } else if (templateType === 'driver_safety') {
      form.setFieldsValue({
        justificationType: 'driver_counseling',
        distributorJustification: `Safety protocol violation investigated. Driver ${justifyingTicket.driverName} summoned for formal reprimand. Mandatory static earthing safety drill completed before next dispatch.`,
        actionTaken: 'Formal written reprimand in driver safety record. Safety protocol verified.',
        status: 'resolved',
      });
    }
  };

  const handleOpenJustifyModal = (ticket: DealerComplaint) => {
    setJustifyingTicket(ticket);
    form.setFieldsValue({
      status: ticket.status === 'open' ? 'resolved' : ticket.status,
      justificationType:
        ticket.category === 'tanker_delay'
          ? 'depot_gantry_delay'
          : ticket.category === 'dip_shortage'
          ? 'temp_dip_variance'
          : 'driver_counseling',
      distributorJustification: ticket.distributorJustification || '',
      actionTaken: ticket.actionTaken || 'Verified with depot dispatch supervisor.',
      creditNoteAmount: ticket.creditNoteAmount || (ticket.category === 'dip_shortage' ? 10800 : undefined),
    });
  };

  const handleSubmitJustification = (values: {
    status: 'investigating' | 'resolved';
    distributorJustification: string;
    actionTaken: string;
    creditNoteAmount?: number;
  }) => {
    if (!justifyingTicket) return;

    const updatedComplaints = complaints.map((c) => {
      if (c.id === justifyingTicket.id) {
        return {
          ...c,
          status: values.status,
          distributorJustification: values.distributorJustification,
          actionTaken: values.actionTaken,
          creditNoteAmount: values.creditNoteAmount,
          justifiedAt: 'Just now',
          resolvedBy: 'Anil Varma (Distributor Ops)',
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    message.success(`Ticket ${justifyingTicket.ticketNumber} updated. Official justification sent to dealer!`);
    setJustifyingTicket(null);
  };

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1280, margin: '0 auto' }}>
      {/* 1. Clean Executive Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <Title
            level={3}
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 22,
              color: isDark ? '#F8FAFC' : '#0F172A',
            }}
          >
            Owner Disputes &amp; Justifications
          </Title>
          <Text style={{ fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' }}>
            Review, investigate, and provide official justifications for delivery delays, shortages, or driver conduct.
          </Text>
        </div>

        {/* Search & Category Filter right in header */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Input
            prefix={<SearchOutlined style={{ color: isDark ? '#64748B' : '#94A3B8' }} />}
            placeholder="Search station, dealer, ticket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: 240,
              borderRadius: 8,
              background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#D9D9D9',
              color: isDark ? '#F8FAFC' : undefined,
            }}
            allowClear
          />

          <Select
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            style={{ width: 190 }}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'tanker_delay', label: '⏱️ Tanker Delays' },
              { value: 'dip_shortage', label: '📉 Dip Shortages' },
              { value: 'driver_conduct', label: '👨‍✈️ Driver Conduct' },
              { value: 'seal_quality', label: '🔒 Broken Seals' },
            ]}
          />
        </div>
      </div>

      {/* 2. Sleek Theme-Adaptive KPI Metrics Strip */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: isDark
                ? 'linear-gradient(145deg, rgba(17, 27, 49, 0.94) 0%, rgba(10, 16, 32, 0.98) 100%)'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>Total Complaints</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A', marginTop: 2 }}>
                {totalCount}
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#CBD5E1' : '#475569',
              }}
            >
              <FileProtectOutlined style={{ fontSize: 20 }} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: isDark
                ? 'linear-gradient(145deg, rgba(17, 27, 49, 0.94) 0%, rgba(10, 16, 32, 0.98) 100%)'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderLeft: '3.5px solid #E11D48',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>Action Required</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#E11D48', marginTop: 2 }}>
                {pendingCount}
              </div>
            </div>
            <Tag color="error" style={{ borderRadius: 100, fontWeight: 600, margin: 0, padding: '2px 10px' }}>
              Pending
            </Tag>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: isDark
                ? 'linear-gradient(145deg, rgba(17, 27, 49, 0.94) 0%, rgba(10, 16, 32, 0.98) 100%)'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderLeft: '3.5px solid #10B981',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>Justified &amp; Settled</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#10B981', marginTop: 2 }}>
                {resolvedCount}
              </div>
            </div>
            <Tag color="success" style={{ borderRadius: 100, fontWeight: 600, margin: 0, padding: '2px 10px' }}>
              Resolved
            </Tag>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: isDark
                ? 'linear-gradient(145deg, rgba(17, 27, 49, 0.94) 0%, rgba(10, 16, 32, 0.98) 100%)'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderLeft: '3.5px solid #2563EB',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>Credits Compensated</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: isDark ? '#60A5FA' : '#2563EB', marginTop: 2 }}>
                ₹{totalCredits.toLocaleString('en-IN')}
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: isDark ? 'rgba(37, 99, 235, 0.18)' : '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#60A5FA' : '#2563EB',
              }}
            >
              <DollarCircleOutlined style={{ fontSize: 20 }} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Streamlined Filter Pills Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type={statusTab === 'all' ? 'primary' : 'default'}
            style={{
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 13,
              background: statusTab !== 'all' && isDark ? 'rgba(255, 255, 255, 0.06)' : undefined,
              borderColor: statusTab !== 'all' && isDark ? 'rgba(255, 255, 255, 0.12)' : undefined,
              color: statusTab !== 'all' && isDark ? '#E2E8F0' : undefined,
            }}
            onClick={() => setStatusTab('all')}
          >
            All Disputes ({totalCount})
          </Button>
          <Button
            type={statusTab === 'pending' ? 'primary' : 'default'}
            danger={statusTab === 'pending'}
            style={{
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 13,
              background: statusTab !== 'pending' && isDark ? 'rgba(255, 255, 255, 0.06)' : undefined,
              borderColor: statusTab !== 'pending' && isDark ? 'rgba(255, 255, 255, 0.12)' : undefined,
              color: statusTab !== 'pending' && isDark ? '#E2E8F0' : undefined,
            }}
            onClick={() => setStatusTab('pending')}
          >
            Needs Justification ({pendingCount})
          </Button>
          <Button
            type={statusTab === 'resolved' ? 'primary' : 'default'}
            style={{
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 13,
              backgroundColor: statusTab === 'resolved' ? '#10B981' : isDark ? 'rgba(255, 255, 255, 0.06)' : undefined,
              borderColor: statusTab === 'resolved' ? '#10B981' : isDark ? 'rgba(255, 255, 255, 0.12)' : undefined,
              color: statusTab === 'resolved' ? '#FFFFFF' : isDark ? '#E2E8F0' : undefined,
            }}
            onClick={() => setStatusTab('resolved')}
          >
            Resolved ({resolvedCount})
          </Button>
        </div>

        <Text style={{ fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' }}>
          Showing <strong>{filteredTickets.length}</strong> of {totalCount} dispute tickets
        </Text>
      </div>

      {/* 4. Highly Readable, User-Friendly Dispute Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredTickets.length === 0 ? (
          <div
            style={{
              background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderRadius: 12,
              textAlign: 'center',
              padding: '48px 20px',
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 40, color: '#10B981', marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>No Disputes Matching Filter</div>
            <Text style={{ color: isDark ? '#94A3B8' : '#64748B' }}>All deliveries are running smoothly or match your search criteria.</Text>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const cat = getCategoryInfo(ticket.category);
            const isActionNeeded = ticket.status === 'open' || ticket.status === 'investigating';

            return (
              <div
                key={ticket.id}
                style={{
                  background: isDark
                    ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(10, 16, 32, 0.96) 100%)'
                    : '#FFFFFF',
                  borderRadius: 12,
                  border: isActionNeeded
                    ? isDark ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid #FCA5A5'
                    : isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Top Row: Station Info & Meta Badges */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 10,
                    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                    paddingBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                      {ticket.pumpName}
                    </span>
                    <span style={{ fontSize: 13, color: isDark ? '#64748B' : '#94A3B8' }}>•</span>
                    <span style={{ fontSize: 13, color: isDark ? '#CBD5E1' : '#334155', fontWeight: 500 }}>
                      Owner: {ticket.dealerName}
                    </span>
                    <a
                      href={`tel:${ticket.dealerPhone}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: isDark ? '#60A5FA' : '#2563EB',
                        background: isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontWeight: 500,
                      }}
                    >
                      <PhoneOutlined size={11} /> {ticket.dealerPhone}
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F8FAFC',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
                        color: isDark ? '#E2E8F0' : '#334155',
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      {ticket.ticketNumber}
                    </Tag>
                    <Tag
                      style={{
                        background: isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF',
                        color: isDark ? '#93C5FD' : '#1D4ED8',
                        border: isDark ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid #BFDBFE',
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      Order #{ticket.orderNumber}
                    </Tag>
                    <Tag
                      color={ticket.severity === 'Critical' ? 'error' : ticket.severity === 'High' ? 'warning' : 'default'}
                      style={{ fontWeight: 600, margin: 0 }}
                    >
                      {ticket.severity}
                    </Tag>
                    <Text style={{ fontSize: 12, marginLeft: 4, color: isDark ? '#94A3B8' : '#64748B' }}>
                      {ticket.createdAt}
                    </Text>
                  </div>
                </div>

                {/* Main Split Section: Left = Owner's Issue, Right = Distributor Status & Action */}
                <Row gutter={[16, 16]} align="stretch">
                  {/* Left Column (60%): What the Owner reported */}
                  <Col xs={24} md={14}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <div>
                        {/* Category Badge */}
                        <div style={{ marginBottom: 6 }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '3px 10px',
                              borderRadius: 6,
                              background: cat.bg,
                              color: cat.color,
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {cat.icon}
                            {cat.label}
                          </span>
                        </div>

                        {/* Grievance Statement */}
                        <div
                          style={{
                            background: isDark ? 'rgba(15, 23, 42, 0.75)' : '#F8FAFC',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                            borderLeft: `3.5px solid ${isActionNeeded ? '#EF4444' : '#10B981'}`,
                            borderRadius: 6,
                            padding: '10px 14px',
                            fontSize: 13.5,
                            color: isDark ? '#F1F5F9' : '#1E293B',
                            lineHeight: 1.55,
                          }}
                        >
                          "{ticket.dealerMessage}"
                        </div>
                      </div>

                      {/* Fleet Logistics Pill */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          marginTop: 10,
                          fontSize: 12,
                          color: isDark ? '#94A3B8' : '#475569',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <CarOutlined style={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                          <strong style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>Tanker:</strong> {ticket.truckNumber}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <UserOutlined style={{ color: isDark ? '#34D399' : '#059669' }} />
                          <strong style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>Driver:</strong> {ticket.driverName} ({ticket.driverPhone})
                        </span>
                      </div>
                    </div>
                  </Col>

                  {/* Right Column (40%): Distributor's Official Justification & Action */}
                  <Col xs={24} md={10}>
                    <div
                      style={{
                        height: '100%',
                        background: isActionNeeded
                          ? isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2'
                          : isDark ? 'rgba(16, 185, 129, 0.1)' : '#F0FDF4',
                        border: isActionNeeded
                          ? isDark ? '1px solid rgba(239, 68, 68, 0.28)' : '1px solid #FECACA'
                          : isDark ? '1px solid rgba(16, 185, 129, 0.28)' : '1px solid #BBF7D0',
                        borderRadius: 8,
                        padding: '12px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      {isActionNeeded ? (
                        <>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <Badge status="error" text={<strong style={{ color: isDark ? '#FCA5A5' : '#991B1B', fontSize: 13 }}>Action Required</strong>} />
                              <span style={{ fontSize: 11.5, color: isDark ? '#F87171' : '#991B1B', fontWeight: 500 }}>
                                {ticket.status === 'investigating' ? 'Investigating Telematics' : 'Awaiting Justification'}
                              </span>
                            </div>
                            <div style={{ fontSize: 12.5, color: isDark ? '#FECDD3' : '#7F1D1D', marginTop: 4, lineHeight: 1.4 }}>
                              {ticket.expectedResolution ? (
                                <span><strong style={{ color: isDark ? '#FFF1F2' : '#7F1D1D' }}>Owner Requested:</strong> {ticket.expectedResolution}</span>
                              ) : (
                                <span>Station Owner is waiting for operational explanation &amp; ETA.</span>
                              )}
                            </div>
                          </div>

                          <div style={{ marginTop: 12, textAlign: 'right' }}>
                            <Button
                              type="primary"
                              icon={<SendOutlined />}
                              style={{ background: '#2563EB', borderColor: '#2563EB', borderRadius: 6, fontWeight: 600 }}
                              onClick={() => handleOpenJustifyModal(ticket)}
                            >
                              Write Justification / Resolve
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <Badge status="success" text={<strong style={{ color: isDark ? '#6EE7B7' : '#166534', fontSize: 13 }}>Justified &amp; Settled</strong>} />
                              <span style={{ fontSize: 11, color: isDark ? '#34D399' : '#15803D' }}>{ticket.justifiedAt}</span>
                            </div>

                            <div style={{ fontSize: 12.5, color: isDark ? '#D1FAE5' : '#14532D', marginTop: 4, lineHeight: 1.45 }}>
                              {ticket.distributorJustification}
                            </div>

                            {ticket.actionTaken && (
                              <div
                                style={{
                                  marginTop: 8,
                                  background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7',
                                  padding: '4px 8px',
                                  borderRadius: 4,
                                  fontSize: 11.5,
                                  color: isDark ? '#A7F3D0' : '#166534',
                                  fontWeight: 600,
                                }}
                              >
                                Settlement: {ticket.actionTaken}
                              </div>
                            )}
                          </div>

                          <div style={{ marginTop: 10, textAlign: 'right' }}>
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              style={{
                                borderRadius: 6,
                                fontSize: 12,
                                background: isDark ? 'rgba(255, 255, 255, 0.06)' : undefined,
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : undefined,
                                color: isDark ? '#E2E8F0' : undefined,
                              }}
                              onClick={() => handleOpenJustifyModal(ticket)}
                            >
                              Edit Note / Compensation
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })
        )}
      </div>

      {/* 5. User-Friendly Justification Modal with 1-Click Templates */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileProtectOutlined style={{ color: '#2563EB', fontSize: 18 }} />
            <span style={{ fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>
              Submit Justification &amp; Resolve Dispute: {justifyingTicket?.ticketNumber}
            </span>
          </div>
        }
        open={Boolean(justifyingTicket)}
        onCancel={() => setJustifyingTicket(null)}
        footer={null}
        width={720}
        destroyOnClose
      >
        {justifyingTicket && (
          <div>
            {/* Owner Grievance Context */}
            <div
              style={{
                background: isDark ? 'rgba(15, 23, 42, 0.75)' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '10px 14px',
                margin: '12px 0 16px 0',
              }}
            >
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                Owner Grievance ({justifyingTicket.pumpName} - {justifyingTicket.dealerName}):
              </div>
              <div style={{ fontSize: 13, color: isDark ? '#F1F5F9' : '#0F172A', marginTop: 3 }}>
                &ldquo;{justifyingTicket.dealerMessage}&rdquo;
              </div>
            </div>

            {/* Quick 1-Click Justification Templates */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#94A3B8' : '#475569', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <ThunderboltOutlined style={{ color: '#F59E0B' }} />
                <span>Quick Justification Templates (Click to auto-fill):</span>
              </div>
              <Space wrap size={8}>
                <Button
                  size="small"
                  style={{
                    borderRadius: 6,
                    fontSize: 12,
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : undefined,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : undefined,
                    color: isDark ? '#E2E8F0' : undefined,
                  }}
                  onClick={() => applyQuickTemplate('gantry_delay')}
                >
                  ⚡ Gantry Outage &amp; Demurrage Waiver
                </Button>
                <Button
                  size="small"
                  style={{
                    borderRadius: 6,
                    fontSize: 12,
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : undefined,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : undefined,
                    color: isDark ? '#E2E8F0' : undefined,
                  }}
                  onClick={() => applyQuickTemplate('traffic_jam')}
                >
                  🚦 Highway Traffic &amp; Live GPS
                </Button>
                <Button
                  size="small"
                  style={{
                    borderRadius: 6,
                    fontSize: 12,
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : undefined,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : undefined,
                    color: isDark ? '#E2E8F0' : undefined,
                  }}
                  onClick={() => applyQuickTemplate('temp_dip')}
                >
                  🌡️ Thermal Dip Shortage Credit Note
                </Button>
                <Button
                  size="small"
                  style={{
                    borderRadius: 6,
                    fontSize: 12,
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : undefined,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : undefined,
                    color: isDark ? '#E2E8F0' : undefined,
                  }}
                  onClick={() => applyQuickTemplate('driver_safety')}
                >
                  🛡️ Driver Safety Drill
                </Button>
              </Space>
            </div>

            {/* Form */}
            <Form form={form} layout="vertical" onFinish={handleSubmitJustification}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Justification Reason Code"
                    name="justificationType"
                    rules={[{ required: true, message: 'Select a reason code' }]}
                  >
                    <Select
                      options={[
                        { value: 'depot_gantry_delay', label: 'Depot Gantry Loading / Equipment Delay' },
                        { value: 'highway_toll_congestion', label: 'Highway Traffic / Toll Plaza Bottleneck' },
                        { value: 'temp_dip_variance', label: 'Dip Variance Verified (Temperature Coefficient)' },
                        { value: 'driver_counseling', label: 'Driver Safety Protocol Violation - Counseled' },
                        { value: 'seal_inspection_verified', label: 'Security Seal Checked at Depot Gate' },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Update Status"
                    name="status"
                    rules={[{ required: true, message: 'Select status' }]}
                  >
                    <Select
                      options={[
                        { value: 'resolved', label: '✅ Resolved & Justified (Close Dispute)' },
                        { value: 'investigating', label: '⏳ Investigating (Keep Under Gantry Telematics)' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Official Explanation &amp; Findings (Transmitted to Owner)"
                name="distributorJustification"
                rules={[{ required: true, message: 'Please provide formal explanation for the station owner' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Explain why the delay or variance occurred and when the tanker is reaching..."
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={14}>
                  <Form.Item
                    label="Settlement Action Taken"
                    name="actionTaken"
                    rules={[{ required: true, message: 'Specify settlement or action' }]}
                  >
                    <Input placeholder="e.g. Demurrage waived, Credit Note issued, Driver safety drill" />
                  </Form.Item>
                </Col>

                <Col span={10}>
                  <Form.Item label="Compensation Amount (₹ if applicable)" name="creditNoteAmount">
                    <InputNumber
                      style={{ width: '100%' }}
                      prefix="₹"
                      placeholder="e.g. 10800"
                      formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <Space>
                  <Button onClick={() => setJustifyingTicket(null)}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ background: '#2563EB', borderColor: '#2563EB', borderRadius: 6, fontWeight: 600 }}
                  >
                    Publish Justification &amp; Update
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DistributorComplaintsPage;
