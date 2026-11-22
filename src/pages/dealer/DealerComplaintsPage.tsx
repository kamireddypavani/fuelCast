// src/pages/dealer/DealerComplaintsPage.tsx
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
  Badge,
} from 'antd';
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  FileProtectOutlined,
  CarOutlined,
  UserOutlined,
  DollarCircleOutlined,
  PhoneOutlined,
  SearchOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '../../redux/hooks';
import { MOCK_COMPLAINTS, MOCK_ORDERS } from '../../mock/fuelcastData';
import type { DealerComplaint, ComplaintCategory } from '../../types/fuelcast';

const { Title, Text } = Typography;

export const DealerComplaintsPage: React.FC = () => {
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');
  const [complaints, setComplaints] = useState<DealerComplaint[]>(MOCK_COMPLAINTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusTab, setStatusTab] = useState<'all' | 'pending' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();

  // Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'open' || c.status === 'investigating').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
  const totalCredits = complaints.reduce((sum, c) => sum + (c.creditNoteAmount || 0), 0);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((ticket) => {
      if (statusTab === 'pending' && ticket.status === 'resolved') return false;
      if (statusTab === 'resolved' && ticket.status !== 'resolved') return false;
      if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          ticket.ticketNumber.toLowerCase().includes(q) ||
          ticket.orderNumber.toLowerCase().includes(q) ||
          ticket.truckNumber.toLowerCase().includes(q) ||
          ticket.driverName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [complaints, statusTab, categoryFilter, searchQuery]);

  const handleCreateComplaint = (values: {
    orderNumber: string;
    category: ComplaintCategory;
    severity: 'Critical' | 'High' | 'Medium';
    dealerMessage: string;
    expectedResolution: string;
  }) => {
    const matchedOrder = MOCK_ORDERS.find((o) => o.orderNumber === values.orderNumber);
    const newComplaint: DealerComplaint = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderNumber: values.orderNumber,
      pumpId: 'pump-1',
      pumpName: 'Sharma Fuels',
      dealerName: 'Ramesh Sharma',
      dealerPhone: '+91 98765 43210',
      truckNumber: matchedOrder?.truckNumber || 'AP16 TX 2690',
      driverName: matchedOrder?.driverName || 'K. Subba Rao',
      driverPhone: matchedOrder?.driverPhone || '+91 96491 11223',
      category: values.category,
      severity: values.severity,
      dealerMessage: values.dealerMessage,
      expectedResolution: values.expectedResolution,
      createdAt: 'Just now',
      status: 'open',
    };

    setComplaints([newComplaint, ...complaints]);
    message.success(`Dispute ${newComplaint.ticketNumber} submitted to Krishna Petroleum Logistics!`);
    setIsModalOpen(false);
    form.resetFields();
  };

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
          label: 'Dip Shortage',
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
          label: 'Broken Seal',
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

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1280, margin: '0 auto' }}>
      {/* 1. Header */}
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
            Delivery Disputes & Concerns
          </Title>
          <Text style={{ fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' }}>
            Report delays, driver conduct, dip measurement shortages, or broken seals to your regional distributor.
          </Text>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Input
            prefix={<SearchOutlined style={{ color: isDark ? '#64748B' : '#94A3B8' }} />}
            placeholder="Search ticket, order, driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: 220,
              borderRadius: 8,
              background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#D9D9D9',
              color: isDark ? '#F8FAFC' : undefined,
            }}
            allowClear
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: '#2563EB', borderColor: '#2563EB', borderRadius: 8, fontWeight: 600 }}
            onClick={() => setIsModalOpen(true)}
          >
            Raise Dispute / Complaint
          </Button>
        </div>
      </div>

      {/* 2. Theme-Adaptive Compact KPI Strip */}
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
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                Total Disputes Raised
              </div>
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
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                Under Review
              </div>
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
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                Resolved & Justified
              </div>
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
              <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                Reimbursed Credits
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: isDark ? '#60A5FA' : '#2563EB', marginTop: 2 }}>
                ₹{totalCredits.toLocaleString('en-IN')}
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF',
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

      {/* 3. Filter Buttons */}
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
            Under Review ({pendingCount})
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
            Resolved & Justified ({resolvedCount})
          </Button>
        </div>

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

      {/* 4. Dispute Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredComplaints.length === 0 ? (
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
            <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>
              No Disputes in this View
            </div>
            <Text style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
              All fuel deliveries to your station are operating normally.
            </Text>
          </div>
        ) : (
          filteredComplaints.map((ticket) => {
            const cat = getCategoryInfo(ticket.category);
            const isResolved = ticket.status === 'resolved';

            return (
              <div
                key={ticket.id}
                style={{
                  background: isDark
                    ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(10, 16, 32, 0.96) 100%)'
                    : '#FFFFFF',
                  borderRadius: 12,
                  border: isResolved
                    ? isDark
                      ? '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid #E2E8F0'
                    : isDark
                    ? '1px solid rgba(245, 158, 11, 0.35)'
                    : '1px solid #FED7AA',
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Header row */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Tag
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F8FAFC',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                        color: isDark ? '#E2E8F0' : '#334155',
                        fontWeight: 700,
                        fontSize: 13,
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
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: cat.bg,
                        color: cat.color,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {cat.icon} {cat.label}
                    </span>
                    <Tag
                      color={ticket.severity === 'Critical' ? 'error' : ticket.severity === 'High' ? 'warning' : 'default'}
                      style={{ fontWeight: 600, margin: 0 }}
                    >
                      {ticket.severity} Priority
                    </Tag>
                  </div>

                  <Text style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B' }}>
                    Reported: {ticket.createdAt}
                  </Text>
                </div>

                {/* Split Content */}
                <Row gutter={[16, 16]} align="stretch">
                  {/* Left: Your Grievance & Vehicle */}
                  <Col xs={24} md={14}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>
                          Your Observation:
                        </div>
                        <div
                          style={{
                            background: isDark ? 'rgba(15, 23, 42, 0.75)' : '#FFFBEB',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #FEF3C7',
                            borderLeft: '3.5px solid #F59E0B',
                            borderRadius: 6,
                            padding: '10px 14px',
                            fontSize: 13.5,
                            color: isDark ? '#F1F5F9' : '#1E293B',
                            lineHeight: 1.5,
                          }}
                        >
                          "{ticket.dealerMessage}"
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, fontSize: 12, color: isDark ? '#94A3B8' : '#475569' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <CarOutlined style={{ color: '#60A5FA' }} />
                          <strong style={{ color: isDark ? '#CBD5E1' : '#334155' }}>Tanker:</strong> {ticket.truckNumber}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <UserOutlined style={{ color: '#34D399' }} />
                          <strong style={{ color: isDark ? '#CBD5E1' : '#334155' }}>Driver:</strong> {ticket.driverName}
                        </span>
                        <span>•</span>
                        <a href={`tel:${ticket.driverPhone}`} style={{ color: isDark ? '#93C5FD' : '#2563EB', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <PhoneOutlined size={11} /> {ticket.driverPhone}
                        </a>
                      </div>
                    </div>
                  </Col>

                  {/* Right: Distributor Justification */}
                  <Col xs={24} md={10}>
                    <div
                      style={{
                        height: '100%',
                        background: isResolved
                          ? isDark
                            ? 'rgba(16, 185, 129, 0.12)'
                            : '#F0FDF4'
                          : isDark
                          ? 'rgba(245, 158, 11, 0.12)'
                          : '#FFFBEB',
                        border: isResolved
                          ? isDark
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : '1px solid #BBF7D0'
                          : isDark
                          ? '1px solid rgba(245, 158, 11, 0.3)'
                          : '1px solid #FDE68A',
                        borderRadius: 8,
                        padding: '12px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      {isResolved ? (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <Badge
                              status="success"
                              text={
                                <strong style={{ color: isDark ? '#86EFAC' : '#166534', fontSize: 13 }}>
                                  Distributor Justification
                                </strong>
                              }
                            />
                            <span style={{ fontSize: 11, color: isDark ? '#86EFAC' : '#15803D' }}>
                              {ticket.justifiedAt}
                            </span>
                          </div>

                          <div style={{ fontSize: 12.5, color: isDark ? '#D1FAE5' : '#14532D', lineHeight: 1.5 }}>
                            {ticket.distributorJustification}
                          </div>

                          {ticket.actionTaken && (
                            <div
                              style={{
                                marginTop: 8,
                                background: isDark ? 'rgba(16, 185, 129, 0.22)' : '#DCFCE7',
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
                      ) : (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <Badge
                              status="processing"
                              text={
                                <strong style={{ color: isDark ? '#FCD34D' : '#B45309', fontSize: 13 }}>
                                  Awaiting Ops Review
                                </strong>
                              }
                            />
                            <span style={{ fontSize: 11, color: isDark ? '#FCD34D' : '#B45309' }}>Turnaround &lt;2h</span>
                          </div>

                          <div style={{ fontSize: 12.5, color: isDark ? '#FEF3C7' : '#92400E', lineHeight: 1.45 }}>
                            Transmitted to Krishna Petroleum Logistics. Operations manager is verifying Kondapalli depot logs and driver telematics.
                          </div>

                          {ticket.expectedResolution && (
                            <div style={{ marginTop: 8, fontSize: 11.5, color: isDark ? '#FDE68A' : '#78350F' }}>
                              <strong>Requested:</strong> {ticket.expectedResolution}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Raise Dispute */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ExclamationCircleOutlined style={{ color: '#E11D48', fontSize: 18 }} />
            <span style={{ fontWeight: 700 }}>Raise Delivery Dispute / Grievance</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={620}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateComplaint}
          initialValues={{
            orderNumber: 'ORD-2026-8841',
            category: 'tanker_delay',
            severity: 'High',
            expectedResolution: 'Demurrage waiver & immediate ETA update',
          }}
          style={{ marginTop: 12 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Related Delivery Order"
                name="orderNumber"
                rules={[{ required: true, message: 'Select the order' }]}
              >
                <Select
                  options={[
                    { value: 'ORD-2026-8841', label: 'ORD-2026-8841 (12,000 L Diesel - AP16 TX 2690)' },
                    { value: 'ORD-2026-8812', label: 'ORD-2026-8812 (12,000 L Diesel - AP16 TY 1102)' },
                    { value: 'ORD-2026-8855', label: 'ORD-2026-8855 (8,000 L Petrol - TS09 UB 5512)' },
                    { value: 'ORD-2026-8790', label: 'ORD-2026-8790 (16,000 L Diesel - AP16 TX 3390)' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Dispute Category"
                name="category"
                rules={[{ required: true, message: 'Select category' }]}
              >
                <Select
                  options={[
                    { value: 'tanker_delay', label: '⏱️ Tanker Delay (>2 Hours)' },
                    { value: 'dip_shortage', label: '📉 Dip Shortage / Fuel Variance' },
                    { value: 'driver_conduct', label: '👨‍✈️ Driver Conduct / Safety Violation' },
                    { value: 'seal_quality', label: '🔒 Broken Seal / Tampered Valve' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Urgency"
                name="severity"
                rules={[{ required: true, message: 'Select priority' }]}
              >
                <Select
                  options={[
                    { value: 'Critical', label: '🚨 Critical (Pump dry-out imminent / Halted decanting)' },
                    { value: 'High', label: '⚠️ High (Significant delay or >100L variance)' },
                    { value: 'Medium', label: 'ℹ️ Medium (Operational feedback / Conduct concern)' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Desired Resolution"
                name="expectedResolution"
                rules={[{ required: true, message: 'Please specify desired resolution' }]}
              >
                <Input placeholder="e.g. Credit note for 120L shortage, demurrage waiver" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Observation / Issue Description"
            name="dealerMessage"
            rules={[{ required: true, message: 'Please describe the issue in detail' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Detail what happened: e.g. Tanker was promised at 11:30 AM. Arrived at 2:45 PM. Compartment 2 dip measurement had 120 L shortage..."
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 12 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: '#2563EB', borderColor: '#2563EB', borderRadius: 6, fontWeight: 600 }}
              >
                Submit Dispute to Distributor
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DealerComplaintsPage;
