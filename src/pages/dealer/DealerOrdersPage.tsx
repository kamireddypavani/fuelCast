// src/pages/dealer/DealerOrdersPage.tsx
import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Select, message, Badge, Space } from 'antd';
import {
  Truck,
  PlusCircle,
  Clock,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import { MOCK_ORDERS } from '../../mock/fuelcastData';
import type { RefillOrder } from '../../types/fuelcast';

export const DealerOrdersPage: React.FC = () => {
  // Scoped strictly to Sharma Fuels (pump-1)
  const [orders, setOrders] = useState<RefillOrder[]>(
    MOCK_ORDERS.filter((o) => o.pumpId === 'pump-1')
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreateOrder = (values: { fuelType: string; quantityLiters: number }) => {
    const newOrder: RefillOrder = {
      id: `ord-dlr-${Date.now()}`,
      orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      pumpId: 'pump-1',
      pumpName: 'Sharma Fuels',
      location: 'Benz Circle, Vijayawada',
      fuelType: values.fuelType,
      quantityLiters: values.quantityLiters,
      suggestedDate: 'Today',
      confirmedDate: 'Today',
      stage: 'to_dispatch',
      dealerContact: '+91 98765 43210',
      depot: 'BPCL Kondapalli Depot',
      truckNumber: 'AP16 TX 2690',
      driverName: 'K. Appa Rao',
      driverPhone: '+91 94401 22334',
      estimatedDelivery: 'In 35 mins',
      urgency: 'Critical',
    };

    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('Refill request dispatched to BPCL Kondapalli Depot & Krishna Logistics!');
  };

  const getStageTag = (stage: RefillOrder['stage']) => {
    switch (stage) {
      case 'waiting_for_dealer':
        return <Tag color="default">1. Waiting for Confirmation</Tag>;
      case 'to_accept':
        return <Tag color="error">2. Pending Depot Acceptance</Tag>;
      case 'to_dispatch':
        return <Tag color="warning">3. Loading Tanker at Depot</Tag>;
      case 'on_the_way':
        return <Tag color="processing">4. Tanker En Route (GPS Active)</Tag>;
      case 'delivered':
        return <Tag color="success">5. Decanted &amp; Verified</Tag>;
      default:
        return <Tag>{stage}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, r: RefillOrder) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{text}</span>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            Depot: {r.depot}
          </div>
        </div>
      ),
    },
    {
      title: 'Fuel & Volume',
      key: 'fuel',
      render: (_: unknown, r: RefillOrder) => (
        <div>
          <Badge
            color={r.fuelType === 'Diesel' ? '#38bdf8' : '#f59e0b'}
            text={<span style={{ fontWeight: 600 }}>{r.fuelType}</span>}
          />
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
            {r.quantityLiters.toLocaleString()} L
          </div>
        </div>
      ),
    },
    {
      title: 'Status & Timeline',
      key: 'stage',
      render: (_: unknown, r: RefillOrder) => (
        <div>
          {getStageTag(r.stage)}
          {r.estimatedDelivery && (
            <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {r.estimatedDelivery}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Assigned Tanker & Driver',
      key: 'tanker',
      render: (_: unknown, r: RefillOrder) =>
        r.truckNumber ? (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Truck size={14} color="#38bdf8" /> {r.truckNumber}
            </div>
            {r.driverName && (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {r.driverName} ({r.driverPhone})
              </div>
            )}
          </div>
        ) : (
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Awaiting Tanker Assignment</span>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, r: RefillOrder) => (
        <Space>
          {r.driverPhone && (
            <Button
              size="small"
              icon={<MessageSquare size={13} color="#25D366" />}
              onClick={() => message.info(`Opening WhatsApp chat with driver ${r.driverName} (${r.driverPhone})`)}
            >
              WhatsApp
            </Button>
          )}
          {r.stage === 'on_the_way' && (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === r.id ? { ...o, stage: 'delivered' } : o))
                );
                message.success('Delivery marked as Decanted & Verified!');
              }}
            >
              Confirm Decanted
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 22, fontWeight: 800 }}>
              Sharma Fuels Refill Deliveries
            </h2>
            <Tag color="cyan">Retail Station Orders</Tag>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
            Track depot tanker dispatches, driver ETA, and decanted replenishment volumes.
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusCircle size={16} />}
          onClick={() => setIsModalOpen(true)}
          style={{
            height: 40,
            borderRadius: 8,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          }}
        >
          Request Tanker Refill
        </Button>
      </div>

      {/* Orders Table */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={17} color="#38bdf8" />
            <span style={{ fontWeight: 700 }}>Active &amp; Past Refill Consignments</span>
          </div>
        }
        bordered={false}
        style={{ background: 'var(--panel-bg)', borderRadius: 12 }}
      >
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </Card>

      {/* Refill Request Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusCircle size={18} color="#2563eb" />
            <span>Order Tanker Refill for Sharma Fuels</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontWeight: 600, fontSize: 12 }}>
            <MapPin size={13} />
            <span>Delivery Destination: Benz Circle, Vijayawada</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
            Supplying Depot: BPCL Kondapalli Depot • Estimated transit time: 45 mins
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={handleCreateOrder}>
          <Form.Item
            name="fuelType"
            label="Fuel Product"
            initialValue="Diesel"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 'Diesel', label: 'High Speed Diesel (HSD) - Tank 1' },
                { value: 'Petrol', label: 'Motor Spirit Petrol (MS) - Tank 2' },
                { value: 'Speed Petrol', label: 'Speed Premium Petrol - Tank 3' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="quantityLiters"
            label="Refill Volume (Litres)"
            initialValue={12000}
            rules={[{ required: true }]}
            extra="Depot tanker compartments are calibrated in 4,000 L multiples (e.g., 4k, 8k, 12k, 16k L)."
          >
            <Select
              options={[
                { value: 4000, label: '4,000 Litres (1 Compartment)' },
                { value: 8000, label: '8,000 Litres (2 Compartments)' },
                { value: 12000, label: '12,000 Litres (3 Compartments - Full Tanker)' },
                { value: 16000, label: '16,000 Litres (4 Compartments - Heavy Truck)' },
              ]}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Confirm &amp; Transmit to Depot
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DealerOrdersPage;
