// src/pages/distributor/OrderKanbanPage.tsx
import React, { useState, useMemo } from 'react';
import {
  Tag,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  Drawer,
  Steps,
  message,
  Tooltip,
} from 'antd';
import {
  Search,
  Plus,
  Clock,
  PackageCheck,
  Truck,
  CheckCheck,
  MapPin,
  Phone,
  MessageCircle,
  FileText,
  ChevronRight,
  Navigation,
  Sparkles,
  RefreshCw,
  Fuel,
  ArrowRight,
  AlertCircle,
  XCircle,
  Edit3,
  Check,
  Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { MOCK_ORDERS, MOCK_PUMPS } from '../../mock/fuelcastData';
import type { RefillOrder, OrderStage, FuelType } from '../../types/fuelcast';

export const OrderKanbanPage: React.FC = () => {
  const navigate = useNavigate();
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');
  const [orders, setOrders] = useState<RefillOrder[]>(MOCK_ORDERS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [fuelFilter, setFuelFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  // Modal / Drawer state
  const [selectedOrder, setSelectedOrder] = useState<RefillOrder | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // Modify Order Modal state (Dealer requested 10k -> distributor sends 5k with comment)
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [orderToModify, setOrderToModify] = useState<RefillOrder | null>(null);
  const [modifiedVolume, setModifiedVolume] = useState<number>(6000);
  const [distributorComment, setDistributorComment] = useState<string>(
    'Allocating partial load today due to depot allocation limit; balance scheduled for tomorrow morning.'
  );

  // Reject Order Modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState<RefillOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Credit limit exceeded');
  const [rejectionComment, setRejectionComment] = useState<string>(
    'Please clear outstanding invoice for previous delivery before new dispatch can be authorized.'
  );

  // New Order Form state
  const [newPumpId, setNewPumpId] = useState(MOCK_PUMPS[0].id);
  const [newFuelType, setNewFuelType] = useState<FuelType>('Diesel');
  const [newQuantity, setNewQuantity] = useState<number>(12000);
  const [newUrgency, setNewUrgency] = useState<'Critical' | 'Warning' | 'Routine'>('Critical');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.pumpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFuel = fuelFilter === 'all' || order.fuelType === fuelFilter;
      const matchesUrgency = urgencyFilter === 'all' || order.urgency === urgencyFilter;
      return matchesSearch && matchesFuel && matchesUrgency;
    });
  }, [orders, searchQuery, fuelFilter, urgencyFilter]);

  // Stage definitions reflecting the real-world flow
  const stages: {
    stage: OrderStage;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgBadge: string;
  }[] = [
      {
        stage: 'waiting_for_dealer',
        title: 'Owner Requests',
        description: 'Incoming orders submitted by station owners',
        icon: <Clock size={14} />,
        color: '#F59E0B',
        bgBadge: 'rgba(245, 158, 11, 0.12)',
      },
      {
        stage: 'to_accept',
        title: 'Depot Queued',
        description: 'Approved & queued at oil depot terminal',
        icon: <PackageCheck size={14} />,
        color: '#3B82F6',
        bgBadge: 'rgba(59, 130, 246, 0.12)',
      },
      {
        stage: 'to_dispatch',
        title: 'Dispatched',
        description: 'Tanker loaded & driver allocated',
        icon: <Truck size={14} />,
        color: '#EAB308',
        bgBadge: 'rgba(234, 179, 8, 0.12)',
      },
      {
        stage: 'on_the_way',
        title: 'In Transit',
        description: 'Tanker en route on highway with live GPS',
        icon: <Navigation size={14} />,
        color: '#38BDF8',
        bgBadge: 'rgba(56, 189, 248, 0.12)',
      },
      {
        stage: 'delivered',
        title: 'Delivered',
        description: 'Decanted into underground tanks & reconciled',
        icon: <CheckCheck size={14} />,
        color: '#10B981',
        bgBadge: 'rgba(16, 185, 129, 0.12)',
      },
    ];

  // Stage transition helper
  const moveOrder = (orderId: string, nextStage: OrderStage, toastMsg: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, stage: nextStage };
          if (nextStage === 'to_dispatch' && !updated.truckNumber) {
            updated.truckNumber = 'AP16 TX 2690';
            updated.driverName = 'K. Nageswara Rao';
            updated.driverPhone = '+91 98481 44552';
          }
          if (nextStage === 'on_the_way' && !updated.estimatedDelivery) {
            updated.estimatedDelivery = 'Today, 02:45 PM (35 min away)';
          }
          if (nextStage === 'delivered') {
            updated.deliveryVarianceLiters = 0;
          }
          return updated;
        }
        return ord;
      })
    );
    message.success(toastMsg);
  };

  // 1. Direct Accept Handler (Accept Full Volume as requested)
  const handleDirectAccept = (order: RefillOrder) => {
    moveOrder(
      order.id,
      'to_accept',
      `Order ${order.orderNumber} accepted (${order.quantityLiters.toLocaleString()} L) & queued at ${order.depot}`
    );
  };

  // 2. Open Modify Allocation Modal (e.g. 10k requested -> allocate 5k + comment)
  const openModifyModal = (order: RefillOrder) => {
    setOrderToModify(order);
    setModifiedVolume(Math.round(order.quantityLiters / 2)); // default suggestion: half allocation
    setDistributorComment(
      `Allocating ${Math.round(order.quantityLiters / 2).toLocaleString()} L today due to depot compartment limits; balance scheduled tomorrow.`
    );
    setIsModifyModalOpen(true);
  };

  // Submit Modified Allocation with Note
  const submitModifiedAllocation = () => {
    if (!orderToModify) return;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderToModify.id) {
          return {
            ...ord,
            originalRequestedLiters: ord.quantityLiters,
            quantityLiters: modifiedVolume,
            distributorNote: distributorComment,
            stage: 'to_accept',
          };
        }
        return ord;
      })
    );

    setIsModifyModalOpen(false);
    message.success(
      `Order modified to ${modifiedVolume.toLocaleString()} L. Notification & comment sent to dealer (${orderToModify.pumpName}).`
    );
  };

  // 3. Open Reject Modal
  const openRejectModal = (order: RefillOrder) => {
    setOrderToReject(order);
    setRejectionReason('Credit limit exceeded');
    setRejectionComment('Please clear outstanding invoice for previous delivery before new dispatch.');
    setIsRejectModalOpen(true);
  };

  // Submit Rejection with Reason
  const submitRejection = () => {
    if (!orderToReject) return;

    // Remove from active pipeline and notify
    setOrders((prev) => prev.filter((ord) => ord.id !== orderToReject.id));
    setIsRejectModalOpen(false);
    message.warning(
      `Refill order ${orderToReject.orderNumber} rejected (${rejectionReason}). Reason sent to dealer.`
    );
  };

  // Create manual order handler
  const handleCreateOrder = () => {
    const targetPump = MOCK_PUMPS.find((p) => p.id === newPumpId) || MOCK_PUMPS[0];
    const newOrder: RefillOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2026-${Math.floor(8850 + Math.random() * 100)}`,
      pumpId: targetPump.id,
      pumpName: targetPump.name,
      location: `${targetPump.area}, ${targetPump.city}`,
      fuelType: newFuelType,
      quantityLiters: newQuantity,
      suggestedDate: 'Today (Nov 22)',
      stage: 'waiting_for_dealer', // Starts as a new dealer request
      dealerContact: targetPump.dealerPhone,
      depot: targetPump.depot,
      urgency: newUrgency,
    };
    setOrders([newOrder, ...orders]);
    setIsNewOrderModalOpen(false);
    message.success(`Refill request placed for ${targetPump.name} (${newQuantity.toLocaleString('en-IN')} L)`);
  };

  // Pipeline metrics
  const totalVolume = orders.reduce((sum, o) => sum + o.quantityLiters, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Clean, Flat & Borderless Header (No Boxed Container) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '2px 0 2px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontWeight: 700 }}>
            Refill Logistics &amp; Dispatch Pipeline
          </h2>
          {/* Alerts badge commented out as requested
          <Tag
            color={criticalCount > 0 ? 'error' : 'success'}
            style={{
              borderRadius: 100,
              fontWeight: 700,
              padding: '1px 8px',
              fontSize: 11,
              border: 'none',
            }}
          >
            {criticalCount > 0 ? `🚨 ${criticalCount} Urgent Refill${criticalCount > 1 ? 's' : ''}` : 'All Clear'}
          </Tag>
          */}
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div
            style={{
              background: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(37, 99, 235, 0.06)',
              border: isDark ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(37, 99, 235, 0.2)',
              borderRadius: 6,
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Fuel size={13} color={isDark ? '#38BDF8' : '#2563EB'} />
            <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Active Pipeline:</span>
            <strong style={{ fontSize: 12.5, color: isDark ? '#38BDF8' : '#2563EB' }}>
              {totalVolume.toLocaleString('en-IN')} L
            </strong>
          </div>

          <Button
            type="primary"
            size="small"
            icon={<Plus size={13} />}
            onClick={() => setIsNewOrderModalOpen(true)}
            style={{
              borderRadius: 6,
              fontWeight: 600,
              height: 30,
              fontSize: 12,
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            }}
          >
            New Order Request
          </Button>

          <Tooltip title="Synchronize with depot gantry system">
            <Button
              size="small"
              icon={<RefreshCw size={13} />}
              onClick={() => message.success('Depot order relays synchronized')}
              style={{ borderRadius: 6, height: 30, width: 30, padding: 0 }}
            />
          </Tooltip>
        </div>
      </div>

      {/* 2. Interactive Horizontal Lifecycle Stepper Strip (Compact, NO duplicate numbers) */}
      <div
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '8px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 8,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {stages.map((st, idx) => {
          const stageVolume = orders
            .filter((o) => o.stage === st.stage)
            .reduce((sum, o) => sum + o.quantityLiters, 0);

          return (
            <div
              key={st.stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                borderRadius: 6,
                background: st.bgBadge,
                border: `1px solid ${st.color}33`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: st.color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 11.5,
                  boxShadow: `0 2px 6px ${st.color}55`,
                  flexShrink: 0,
                }}
              >
                {st.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {st.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>
                  {stageVolume > 0 ? `${(stageVolume / 1000).toFixed(0)}k Liters` : '0 Liters'}
                </div>
              </div>

              {idx < 4 && (
                <div
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ArrowRight size={10} opacity={0.4} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar (Compact) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Input
            placeholder="Search station, city, order ID..."
            prefix={<Search size={13} color="var(--text-muted)" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            size="small"
            style={{ maxWidth: 280, borderRadius: 6, height: 30, fontSize: 12 }}
          />

          <Select
            value={fuelFilter}
            onChange={setFuelFilter}
            size="small"
            style={{ width: 125, height: 30 }}
            options={[
              { value: 'all', label: 'All Fuels' },
              { value: 'Diesel', label: '💧 Diesel' },
              { value: 'Petrol', label: '🟢 Petrol' },
              { value: 'Speed Petrol', label: '🟣 Speed' },
            ]}
          />

          <Select
            value={urgencyFilter}
            onChange={setUrgencyFilter}
            size="small"
            style={{ width: 125, height: 30 }}
            options={[
              { value: 'all', label: 'All Urgencies' },
              { value: 'Critical', label: '🔴 Critical' },
              { value: 'Warning', label: '🟡 Warning' },
              { value: 'Routine', label: '🟢 Routine' },
            ]}
          />
        </div>

        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
          <strong>{filteredOrders.length}</strong> orders in pipeline
        </div>
      </div>

      {/* 4. Frameless Floating Swimlanes (Strict 1fr grid - ZERO horizontal scroll) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 10,
          alignItems: 'start',
          width: '100%',
        }}
      >
        {stages.map((st) => {
          const colOrders = filteredOrders.filter((o) => o.stage === st.stage);

          return (
            <div
              key={st.stage}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                minWidth: 0,
              }}
            >
              {/* Clean Swimlane Header: Pure Heading & Count */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 2px',
                  borderBottom: `2px solid ${st.color}`,
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {st.title}
                </span>

                <Badge
                  count={colOrders.length}
                  size="small"
                  style={{
                    backgroundColor: colOrders.length > 0 ? st.color : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                    color: colOrders.length > 0 ? '#FFF' : 'var(--text-secondary)',
                    boxShadow: 'none',
                    fontWeight: 700,
                    fontSize: 10,
                  }}
                />
              </div>

              {/* Cards Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colOrders.length === 0 ? (
                  <div
                    style={{
                      border: isDark ? '1px dashed var(--border-color)' : '1px dashed #CBD5E1',
                      borderRadius: 8,
                      padding: '24px 8px',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: 11,
                      background: isDark ? 'rgba(255, 255, 255, 0.015)' : '#FFFFFF',
                    }}
                  >
                    No orders waiting
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const isModified = order.originalRequestedLiters !== undefined;
                    const fuelColor =
                      order.fuelType === 'Diesel'
                        ? '#38BDF8'
                        : order.fuelType === 'Petrol'
                          ? '#10B981'
                          : '#A855F7';

                    const fuelDisplayColor = isDark
                      ? fuelColor
                      : order.fuelType === 'Diesel'
                        ? '#0284C7'
                        : order.fuelType === 'Petrol'
                          ? '#059669'
                          : '#7C3AED';

                    return (
                      <div
                        key={order.id}
                        style={{
                          background: isDark
                            ? 'linear-gradient(145deg, rgba(17, 27, 49, 0.94) 0%, rgba(10, 16, 32, 0.98) 100%)'
                            : '#FFFFFF',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                          borderRadius: 8,
                          padding: '10px 11px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          boxShadow: isDark
                            ? '0 2px 8px rgba(0, 0, 0, 0.25)'
                            : '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
                          transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailDrawerOpen(true);
                        }}
                      >
                        {/* Row 1: Order ID */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              color: isDark ? '#94A3B8' : '#64748B',
                              letterSpacing: '0.2px',
                            }}
                          >
                            {order.orderNumber}
                          </span>
                          {/* Alert Urgency Tag commented out as requested
                          <Tag
                            color={isCritical ? 'error' : isWarning ? 'warning' : 'default'}
                            style={{
                              fontSize: 9.5,
                              margin: 0,
                              borderRadius: 3,
                              fontWeight: 700,
                              padding: '0 4px',
                              lineHeight: '16px',
                              height: 16,
                            }}
                          >
                            {isCritical ? 'Critical' : isWarning ? 'Low' : 'Routine'}
                          </Tag>
                          */}
                        </div>

                        {/* Row 2: Station Name & Location */}
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {order.pumpName}
                          </div>
                          <div
                            style={{
                              fontSize: 10.5,
                              color: isDark ? '#94A3B8' : '#64748B',
                              marginTop: 2,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            <MapPin size={10} color={isDark ? '#38BDF8' : '#2563EB'} />
                            {order.location}
                          </div>
                        </div>

                        {/* Row 3: Fuel Type & Volume Capsule */}
                        <div
                          style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                            border: isDark ? `1px solid ${fuelColor}25` : `1px solid ${fuelColor}33`,
                            borderRadius: 6,
                            padding: '5px 8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              color: fuelDisplayColor,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: fuelDisplayColor }} />
                            {order.fuelType}
                          </span>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                            {order.quantityLiters.toLocaleString('en-IN')} L
                          </span>
                        </div>

                        {/* Row 3.5: Modified Allocation Banner (When distributor changed requested volume) */}
                        {isModified && (
                          <div
                            style={{
                              background: isDark ? 'rgba(245, 158, 11, 0.08)' : '#FFFBEB',
                              border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid #FDE68A',
                              borderRadius: 4,
                              padding: '3px 6px',
                              fontSize: 9.5,
                              color: isDark ? '#F59E0B' : '#B45309',
                            }}
                          >
                            <div>Requested: <strong>{order.originalRequestedLiters?.toLocaleString()} L</strong></div>
                            {order.distributorNote && (
                              <div style={{ color: isDark ? '#CBD5E1' : '#475569', fontStyle: 'italic', marginTop: 1 }}>
                                &ldquo;{order.distributorNote}&rdquo;
                              </div>
                            )}
                          </div>
                        )}

                        {/* Row 4: Dynamic Logistics Metadata (Only when active tanker, ETA or variance exists) */}
                        {(order.truckNumber ||
                          order.estimatedDelivery ||
                          (order.deliveryVarianceLiters !== undefined && order.deliveryVarianceLiters !== 0)) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 10 }}>
                              {order.truckNumber && (
                                <div style={{ color: isDark ? '#38BDF8' : '#0284C7', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  <Truck size={11} />
                                  <strong>{order.truckNumber}</strong>
                                </div>
                              )}

                              {order.estimatedDelivery && (
                                <div style={{ color: isDark ? '#10B981' : '#059669', display: 'flex', alignItems: 'center', gap: 4, fontSize: 9.5 }}>
                                  <Clock size={10} />
                                  {order.estimatedDelivery}
                                </div>
                              )}

                              {order.deliveryVarianceLiters !== undefined && order.deliveryVarianceLiters !== 0 && (
                                <div
                                  style={{
                                    color: isDark ? '#EF4444' : '#DC2626',
                                    background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
                                    border: isDark ? 'none' : '1px solid #FEE2E2',
                                    padding: '2px 5px',
                                    borderRadius: 4,
                                    fontWeight: 600,
                                    fontSize: 9.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                  }}
                                >
                                  <AlertCircle size={10} /> Variance: {order.deliveryVarianceLiters} L
                                </div>
                              )}
                            </div>
                          )}

                        {/* Row 5: Action Footer */}
                        <div
                          style={{
                            marginTop: 2,
                            paddingTop: 6,
                            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #F1F5F9',
                            display: 'flex',
                            gap: 5,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* STAGE 1: Dealer Requests -> Accept, Modify & Comment, or Reject */}
                          {order.stage === 'waiting_for_dealer' && (
                            <>
                              <Button
                                type="primary"
                                size="small"
                                style={{
                                  flex: 1,
                                  fontWeight: 700,
                                  borderRadius: 5,
                                  height: 25,
                                  fontSize: 10.5,
                                  background: '#10B981',
                                  borderColor: '#10B981',
                                }}
                                icon={<Check size={11} />}
                                onClick={() => handleDirectAccept(order)}
                              >
                                Accept
                              </Button>

                              <Tooltip title="Modify quantity & send note to dealer">
                                <Button
                                  size="small"
                                  style={{
                                    borderRadius: 5,
                                    height: 25,
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    padding: '0 6px',
                                    background: isDark ? 'transparent' : '#FFFFFF',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1',
                                    color: isDark ? '#F8FAFC' : '#1E293B',
                                  }}
                                  icon={<Edit3 size={11} />}
                                  onClick={() => openModifyModal(order)}
                                >
                                  Modify
                                </Button>
                              </Tooltip>

                              <Tooltip title="Reject request with reason note">
                                <Button
                                  size="small"
                                  danger
                                  style={{
                                    borderRadius: 5,
                                    height: 25,
                                    width: 25,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isDark ? 'transparent' : '#FFF1F2',
                                    borderColor: isDark ? undefined : '#FECDD3',
                                  }}
                                  icon={<XCircle size={12} />}
                                  onClick={() => openRejectModal(order)}
                                />
                              </Tooltip>
                            </>
                          )}

                          {/* STAGE 2: Depot Queued -> Assign Tanker */}
                          {order.stage === 'to_accept' && (
                            <>
                              <Button
                                type="primary"
                                size="small"
                                style={{
                                  flex: 1,
                                  fontWeight: 700,
                                  borderRadius: 5,
                                  height: 25,
                                  fontSize: 11,
                                  background: '#2563EB',
                                }}
                                icon={<ChevronRight size={11} />}
                                onClick={() =>
                                  moveOrder(
                                    order.id,
                                    'to_dispatch',
                                    `Order ${order.orderNumber} assigned to Tanker AP16 TX 2690 at ${order.depot}`
                                  )
                                }
                              >
                                Allocate Tanker
                              </Button>
                              <Button
                                size="small"
                                style={{
                                  borderRadius: 5,
                                  height: 25,
                                  fontSize: 10.5,
                                  padding: '0 6px',
                                  background: isDark ? 'transparent' : '#FFFFFF',
                                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1',
                                  color: isDark ? '#F8FAFC' : '#1E293B',
                                }}
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsDetailDrawerOpen(true);
                                }}
                              >
                                Details
                              </Button>
                            </>
                          )}

                          {/* STAGE 3: Dispatched -> Start Transit */}
                          {order.stage === 'to_dispatch' && (
                            <Button
                              type="primary"
                              size="small"
                              block
                              icon={<Truck size={11} />}
                              style={{
                                background: '#F59E0B',
                                borderColor: '#F59E0B',
                                fontWeight: 700,
                                borderRadius: 5,
                                height: 25,
                                fontSize: 11,
                              }}
                              onClick={() =>
                                moveOrder(
                                  order.id,
                                  'on_the_way',
                                  `Tanker ${order.truckNumber || 'AP16 TX 2690'} departed depot en route to ${order.pumpName}`
                                )
                              }
                            >
                              Dispatch Tanker
                            </Button>
                          )}

                          {/* STAGE 4: In Transit -> Confirm Decanted */}
                          {order.stage === 'on_the_way' && (
                            <div style={{ display: 'flex', gap: 5, width: '100%' }}>
                              <Button
                                type="primary"
                                size="small"
                                style={{
                                  flex: 1,
                                  background: '#10B981',
                                  borderColor: '#10B981',
                                  fontWeight: 700,
                                  borderRadius: 5,
                                  height: 25,
                                  fontSize: 11,
                                }}
                                icon={<CheckCheck size={11} />}
                                onClick={() =>
                                  moveOrder(
                                    order.id,
                                    'delivered',
                                    `Order ${order.orderNumber} decanted & verified at ${order.pumpName}`
                                  )
                                }
                              >
                                Decanted
                              </Button>
                              <Tooltip title="View tanker live position on Map">
                                <Button
                                  size="small"
                                  style={{
                                    borderRadius: 5,
                                    height: 25,
                                    width: 25,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isDark ? 'transparent' : '#FFFFFF',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1',
                                  }}
                                  icon={<Navigation size={12} color={isDark ? '#38BDF8' : '#0284C7'} />}
                                  onClick={() => navigate('/distributor/dashboard/map')}
                                />
                              </Tooltip>
                            </div>
                          )}

                          {/* STAGE 5: Delivered */}
                          {order.stage === 'delivered' && (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1px 2px',
                              }}
                            >
                              <span style={{ fontSize: 10.5, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                                <CheckCheck size={11} /> Decanted
                              </span>
                              <Button
                                type="link"
                                size="small"
                                style={{ fontSize: 10.5, padding: 0, height: 'auto', color: isDark ? '#38BDF8' : '#0284C7' }}

                                icon={<FileText size={10} />}
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsDetailDrawerOpen(true);
                                }}
                              >
                                Challan
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Modify Allocation Quantity & Add Comment for Dealer */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Edit3 size={16} color="#F59E0B" />
            <span style={{ fontWeight: 800 }}>Modify Allocation &amp; Send Note to Owner</span>
          </div>
        }
        open={isModifyModalOpen}
        onCancel={() => setIsModifyModalOpen(false)}
        onOk={submitModifiedAllocation}
        okText="Approve with Note"
        cancelText="Cancel"
      >
        {orderToModify && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
            <div
              style={{
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 12,
              }}
            >
              <div><strong>Station:</strong> {orderToModify.pumpName} ({orderToModify.location})</div>
              <div><strong>Owner:</strong> {orderToModify.dealerContact}</div>
              <div style={{ marginTop: 4, color: isDark ? '#38BDF8' : '#0284C7', fontWeight: 700 }}>
                Requested Volume: {orderToModify.quantityLiters.toLocaleString()} L of {orderToModify.fuelType}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Approved Allocation (Liters):
              </label>
              <Select
                style={{ width: '100%' }}
                value={modifiedVolume}
                onChange={setModifiedVolume}
                options={[
                  { value: 4000, label: '4,000 L (Partial Compartment)' },
                  { value: 5000, label: '5,000 L (Half Load)' },
                  { value: 6000, label: '6,000 L (Standard Compartment)' },
                  { value: 8000, label: '8,000 L' },
                  { value: 10000, label: '10,000 L' },
                  { value: 12000, label: '12,000 L (Full Request)' },
                ]}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Distributor Comment for Owner (WhatsApp &amp; Portal Notification):
              </label>
              <Input.TextArea
                rows={3}
                value={distributorComment}
                onChange={(e) => setDistributorComment(e.target.value)}
                placeholder="Explain why the volume was adjusted..."
                style={{ borderRadius: 6 }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: Reject Refill Request with Reason */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444' }}>
            <XCircle size={16} />
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Reject Refill Request</span>
          </div>
        }
        open={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        onOk={submitRejection}
        okText="Confirm Rejection"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        {orderToReject && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
            <div
              style={{
                background: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid #FECACA',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 12,
              }}
            >
              <div>Rejecting Order: <strong>{orderToReject.orderNumber}</strong></div>
              <div>Station: <strong>{orderToReject.pumpName}</strong></div>
              <div>Requested: {orderToReject.quantityLiters.toLocaleString()} L {orderToReject.fuelType}</div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Primary Rejection Reason:
              </label>
              <Select
                style={{ width: '100%' }}
                value={rejectionReason}
                onChange={setRejectionReason}
                options={[
                  { value: 'Credit limit exceeded', label: '💳 Credit limit exceeded (Payment overdue)' },
                  { value: 'Depot quota allocation freeze', label: '🏢 Depot terminal quota allocation freeze' },
                  { value: 'Insufficient tank ullage', label: '⛽ Insufficient tank ullage (Risk of overflow)' },
                  { value: 'Highway road block / Transit restriction', label: '🚧 Transit corridor blocked / strike' },
                  { value: 'Other operational reason', label: '📝 Other operational reason' },
                ]}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Explanation Note for Owner:
              </label>
              <Input.TextArea
                rows={3}
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                placeholder="Provide details for the station owner..."
                style={{ borderRadius: 6 }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Comprehensive Order Details Drawer */}
      <Drawer
        title={
          selectedOrder ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: 16 }}>{selectedOrder.orderNumber}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12, marginLeft: 8 }}>
                  • {selectedOrder.pumpName}
                </span>
              </div>
              <Tag color={selectedOrder.urgency === 'Critical' ? 'error' : 'default'} style={{ fontWeight: 700 }}>
                {selectedOrder.urgency}
              </Tag>
            </div>
          ) : (
            'Order Details'
          )
        }
        placement="right"
        width={460}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
        styles={{ body: { padding: '20px 24px', background: 'var(--bg-primary)' } }}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Distributor Allocation Comment Alert (if modified) */}
            {selectedOrder.distributorNote && (
              <div
                style={{
                  background: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FFFBEB',
                  border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #FDE68A',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: 12,
                }}
              >
                <div style={{ color: isDark ? '#F59E0B' : '#B45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Send size={13} /> Distributor Note to Owner:
                </div>
                <div style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>
                  &ldquo;{selectedOrder.distributorNote}&rdquo;
                </div>
                {selectedOrder.originalRequestedLiters && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 4 }}>
                    Owner Requested: {selectedOrder.originalRequestedLiters.toLocaleString()} L ➔ Approved: {selectedOrder.quantityLiters.toLocaleString()} L
                  </div>
                )}
              </div>
            )}

            {/* 5-Step Order Progress Visualizer */}
            <div
              style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '14px',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>
                Refill Order Lifecycle:
              </div>
              <Steps
                direction="vertical"
                size="small"
                current={
                  selectedOrder.stage === 'waiting_for_dealer'
                    ? 0
                    : selectedOrder.stage === 'to_accept'
                      ? 1
                      : selectedOrder.stage === 'to_dispatch'
                        ? 2
                        : selectedOrder.stage === 'on_the_way'
                          ? 3
                          : 4
                }
                items={[
                  { title: '1. Owner Refill Request', description: 'Station owner submitted order for required fuel' },
                  { title: '2. Distributor Approval & Queue', description: 'Volume approved & queued for depot allocation' },
                  { title: '3. Depot Gantry Loading', description: selectedOrder.depot },
                  { title: '4. In Transit (Tanker)', description: selectedOrder.truckNumber ? `Tanker: ${selectedOrder.truckNumber}` : 'Awaiting tanker' },
                  { title: '5. Delivered & Decanted', description: 'Underground tank dip variance matched' },
                ]}
              />
            </div>

            {/* Station & Contact Card */}
            <div
              style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '14px',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
                Retail Station &amp; Owner:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Station:</span>
                  <strong>{selectedOrder.pumpName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Location:</span>
                  <span>{selectedOrder.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Owner Phone:</span>
                  <a href={`tel:${selectedOrder.dealerContact}`} style={{ color: isDark ? '#38BDF8' : '#0284C7', fontWeight: 600 }}>
                    {selectedOrder.dealerContact}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button
                  size="small"
                  block
                  icon={<Phone size={13} />}
                  onClick={() => window.open(`tel:${selectedOrder.dealerContact}`)}
                >
                  Call Owner
                </Button>
                <Button
                  size="small"
                  block
                  icon={<MessageCircle size={13} color="#25D366" />}
                  onClick={() => message.success(`WhatsApp message opened for ${selectedOrder.dealerContact}`)}
                >
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Cargo & Fuel Payload Details */}
            <div
              style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '14px',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
                Fuel Specification &amp; Volume:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{selectedOrder.fuelType}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#38BDF8' : '#0284C7' }}>
                  {selectedOrder.quantityLiters.toLocaleString('en-IN')} Liters
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                Supply Depot: <strong>{selectedOrder.depot}</strong>
              </div>
            </div>

            {/* Quick Actions Footer inside Drawer */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <Button
                type="primary"
                block
                style={{ fontWeight: 700 }}
                onClick={() => {
                  navigate(`/distributor/pumps/${selectedOrder.pumpId}`);
                  setIsDetailDrawerOpen(false);
                }}
              >
                View Station Telemetry
              </Button>
              <Button
                block
                onClick={() => {
                  navigate('/distributor/dashboard/map');
                  setIsDetailDrawerOpen(false);
                }}
              >
                Locate on Map
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Manual Refill Order Creation Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="var(--primary-color)" />
            <span style={{ fontWeight: 800 }}>Create New Refill Request</span>
          </div>
        }
        open={isNewOrderModalOpen}
        onCancel={() => setIsNewOrderModalOpen(false)}
        onOk={handleCreateOrder}
        okText="Submit Order Request"
        cancelText="Cancel"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Select Retail Station:
            </label>
            <Select
              style={{ width: '100%' }}
              value={newPumpId}
              onChange={setNewPumpId}
              options={MOCK_PUMPS.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.city}) • Min ${p.minDaysLeft.toFixed(1)}d left`,
              }))}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Fuel Type:
              </label>
              <Select
                style={{ width: '100%' }}
                value={newFuelType}
                onChange={setNewFuelType}
                options={[
                  { value: 'Diesel', label: '💧 Diesel (HSD)' },
                  { value: 'Petrol', label: '🟢 Regular Petrol (MS)' },
                  { value: 'Speed Petrol', label: '🟣 Speed XP95' },
                ]}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Quantity (Liters):
              </label>
              <Select
                style={{ width: '100%' }}
                value={newQuantity}
                onChange={setNewQuantity}
                options={[
                  { value: 4000, label: '4,000 L' },
                  { value: 5000, label: '5,000 L' },
                  { value: 6000, label: '6,000 L (1 Compartment)' },
                  { value: 8000, label: '8,000 L' },
                  { value: 10000, label: '10,000 L' },
                  { value: 12000, label: '12,000 L (2 Compartments)' },
                  { value: 16000, label: '16,000 L' },
                  { value: 20000, label: '20,000 L (Full Tanker)' },
                ]}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Dispatch Urgency:
            </label>
            <Select
              style={{ width: '100%' }}
              value={newUrgency}
              onChange={setNewUrgency}
              options={[
                { value: 'Critical', label: '🚨 Critical (Stockout Risk < 48 hrs)' },
                { value: 'Warning', label: '⚠️ Warning (Refill within 3-4 days)' },
                { value: 'Routine', label: '🟢 Routine Restock' },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderKanbanPage;
