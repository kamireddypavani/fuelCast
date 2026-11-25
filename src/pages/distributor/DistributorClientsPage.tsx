// src/pages/distributor/DistributorClientsPage.tsx
import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Input, Select, message } from 'antd';
import {
  Users,
  UserPlus,
  Building2,
  Phone,
  Mail,
  CreditCard,
  Crown,
  CheckCircle2,
  Fuel,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ClientDealer {
  id: string;
  name: string;
  tradeName: string;
  phone: string;
  email: string;
  city: string;
  stationsCount: number;
  planTier: 'Free' | 'Silver' | 'Gold' | 'Platinum';
  stationLimit: number;
  creditLimitInr: number;
  primaryDepot: string;
  status: 'Active' | 'Pending Verification';
  joinedDate: string;
}

const INITIAL_CLIENTS: ClientDealer[] = [
  {
    id: 'client-1',
    name: 'Ramesh Sharma',
    tradeName: 'Sharma Fuels Enterprise',
    phone: '+91 98765 43210',
    email: 'ramesh@sharmafuels.in',
    city: 'Vijayawada',
    stationsCount: 3,
    planTier: 'Free',
    stationLimit: 3,
    creditLimitInr: 1500000,
    primaryDepot: 'BPCL Kondapalli Depot',
    status: 'Active',
    joinedDate: '12 Jan 2025',
  },
  {
    id: 'client-2',
    name: 'K. Venkateswara Rao',
    tradeName: 'Krishna Group & Retail Outlets',
    phone: '+91 98480 12345',
    email: 'kvrao@krishnafuels.com',
    city: 'Vijayawada',
    stationsCount: 6,
    planTier: 'Gold',
    stationLimit: 10,
    creditLimitInr: 3500000,
    primaryDepot: 'BPCL Kondapalli Depot',
    status: 'Active',
    joinedDate: '18 Mar 2025',
  },
  {
    id: 'client-3',
    name: 'Suresh Reddy',
    tradeName: 'Balaji Petroleum Center Ltd.',
    phone: '+91 99890 55442',
    email: 'suresh@balajipetrol.in',
    city: 'Hyderabad',
    stationsCount: 4,
    planTier: 'Gold',
    stationLimit: 10,
    creditLimitInr: 2500000,
    primaryDepot: 'HPCL Cherlapally Terminal',
    status: 'Active',
    joinedDate: '04 Jun 2025',
  },
  {
    id: 'client-4',
    name: 'P. Anand Kumar',
    tradeName: 'Highway Star Outposts',
    phone: '+91 97001 22334',
    email: 'anand.highway@gmail.com',
    city: 'Vijayawada',
    stationsCount: 2,
    planTier: 'Free',
    stationLimit: 3,
    creditLimitInr: 1200000,
    primaryDepot: 'BPCL Kondapalli Depot',
    status: 'Active',
    joinedDate: '22 Aug 2025',
  },
  {
    id: 'client-5',
    name: 'Ch. Madhav Rao',
    tradeName: 'Annapurna Auto Networks',
    phone: '+91 94401 98765',
    email: 'madhav@annapurnafuels.com',
    city: 'Hyderabad',
    stationsCount: 3,
    planTier: 'Free',
    stationLimit: 3,
    creditLimitInr: 1800000,
    primaryDepot: 'HPCL Cherlapally Terminal',
    status: 'Active',
    joinedDate: '10 Oct 2025',
  },
  {
    id: 'client-6',
    name: 'G. Koteswara Rao',
    tradeName: 'Amaravathi Highway Express',
    phone: '+91 93901 55667',
    email: 'kotesh@amaravathifuels.in',
    city: 'Guntur',
    stationsCount: 14,
    planTier: 'Platinum',
    stationLimit: 25,
    creditLimitInr: 7500000,
    primaryDepot: 'IOCL Tadepalli Depot',
    status: 'Active',
    joinedDate: '15 Dec 2025',
  },
];

export const DistributorClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientDealer[]>(INITIAL_CLIENTS);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // New Client Form state
  const [newName, setNewName] = useState('');
  const [newTradeName, setNewTradeName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Vijayawada');
  const [newDepot, setNewDepot] = useState('BPCL Kondapalli Depot');
  const [newCreditLimit, setNewCreditLimit] = useState<number>(1500000);

  const totalStationsManaged = clients.reduce((sum, c) => sum + c.stationsCount, 0);

  const handleOnboardClient = () => {
    if (!newName.trim() || !newTradeName.trim() || !newPhone.trim()) {
      message.error('Please enter dealer name, trade name, and contact phone');
      return;
    }

    const newClient: ClientDealer = {
      id: `client-${Date.now()}`,
      name: newName.trim(),
      tradeName: newTradeName.trim(),
      phone: newPhone.trim(),
      email: `${newName.toLowerCase().replace(/\s+/g, '')}@fueldealers.in`,
      city: newCity,
      stationsCount: 1, // initial station
      planTier: 'Free',
      stationLimit: 3, // default free 3 stations from admin
      creditLimitInr: newCreditLimit,
      primaryDepot: newDepot,
      status: 'Active',
      joinedDate: 'Today',
    };

    setClients([newClient, ...clients]);
    setIsOnboardModalOpen(false);
    setNewName('');
    setNewTradeName('');
    setNewPhone('');
    message.success(`Station Retailer "${newClient.tradeName}" onboarded with 3 Free Stations quota.`);
  };

  const columns = [
    {
      title: 'Station Retailer',
      key: 'name',
      render: (_: unknown, record: ClientDealer) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{record.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{record.tradeName}</div>
        </div>
      ),
    },
    {
      title: 'Contact Details',
      key: 'contact',
      render: (_: unknown, record: ClientDealer) => (
        <div style={{ fontSize: 11.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Phone size={11} color="var(--primary-color)" />
            <span>{record.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', marginTop: 2 }}>
            <Mail size={11} />
            <span>{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Region & Depot',
      key: 'region',
      render: (_: unknown, record: ClientDealer) => (
        <div style={{ fontSize: 11.5 }}>
          <div><strong>{record.city}</strong></div>
          <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>{record.primaryDepot}</div>
        </div>
      ),
    },
    {
      title: 'Stations & Subscription Plan',
      key: 'plan',
      render: (_: unknown, record: ClientDealer) => {
        const isFree = record.planTier === 'Free';
        const isGold = record.planTier === 'Gold';
        const isPlatinum = record.planTier === 'Platinum';
        const tagColor = isPlatinum ? 'purple' : isGold ? 'gold' : isFree ? 'blue' : 'default';

        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <Tag color={tagColor} style={{ margin: 0, fontWeight: 700, borderRadius: 4 }}>
                {record.planTier} Plan
              </Tag>
              <strong style={{ fontSize: 11.5 }}>
                {record.stationsCount} / {record.stationLimit} Pumps
              </strong>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
              {isFree ? 'Admin provided 3 free stations' : `${record.stationLimit} stations unlocked`}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Credit Limit',
      dataIndex: 'creditLimitInr',
      key: 'creditLimitInr',
      render: (amt: number) => (
        <div>
          <strong>₹{(amt / 100000).toFixed(1)} Lakhs</strong>
          <div style={{ fontSize: 10.5, color: '#10B981', fontWeight: 600 }}>Active Credit</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button
          size="small"
          icon={<ArrowRight size={12} />}
          onClick={() => navigate('/distributor/orders')}
          style={{ borderRadius: 5, fontSize: 11 }}
        >
          View Refills
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Top Header Row */}
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
              Retail Clients &amp; Station Retailers
            </h2>
            <Tag color="blue" style={{ borderRadius: 100, fontWeight: 700 }}>
              {clients.length} Active Retailers
            </Tag>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Distributor Tier 2 Management • Onboard station retailers, monitor station holdings, and supply bulk fuel.
          </span>
        </div>

        <Button
          type="primary"
          icon={<UserPlus size={14} />}
          onClick={() => setIsOnboardModalOpen(true)}
          style={{
            borderRadius: 6,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            height: 32,
            fontSize: 12,
          }}
        >
          Onboard Station Retailer
        </Button>
      </div>

      {/* 2. Top Summary Metrics Strip */}
      <div
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '8px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(37,99,235,0.08)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={14} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Clients</div>
            <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{clients.length} Registered Retailers</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.08)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#10B981', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fuel size={14} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Retail Pumps</div>
            <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{totalStationsManaged} Stations Connected</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(245,158,11,0.08)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F59E0B', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crown size={14} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Plan Tiers</div>
            <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>3 Free • 2 Gold • 1 Plat</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(139,92,246,0.08)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#8B5CF6', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={14} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Credit Limit</div>
            <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>₹1.76 Crores</strong>
          </div>
        </div>
      </div>

      {/* 3. Client Dealers Table */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} color="var(--primary-color)" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13.5 }}>
              Active Station Retailers &amp; Station Allowances
            </span>
          </div>
        }
        bordered={false}
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Table
          columns={columns}
          dataSource={clients}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 4. Onboard Client Dealer Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserPlus size={18} color="var(--primary-color)" />
            <span style={{ fontWeight: 800 }}>Onboard New Station Retailer</span>
          </div>
        }
        open={isOnboardModalOpen}
        onCancel={() => setIsOnboardModalOpen(false)}
        onOk={handleOnboardClient}
        okText="Onboard Retailer"
        cancelText="Cancel"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 10 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Station Retailer Name:
            </label>
            <Input
              placeholder="e.g. Ramesh Sharma"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ borderRadius: 6 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Station Business / Trade Name:
            </label>
            <Input
              placeholder="e.g. Sharma Fuels Enterprise"
              value={newTradeName}
              onChange={(e) => setNewTradeName(e.target.value)}
              style={{ borderRadius: 6 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Phone Number (WhatsApp):
              </label>
              <Input
                placeholder="e.g. +91 98765 43210"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={{ borderRadius: 6 }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Primary Operating City:
              </label>
              <Input
                placeholder="e.g. Vijayawada"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                style={{ borderRadius: 6 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Designated Supply Depot:
              </label>
              <Select
                value={newDepot}
                onChange={setNewDepot}
                style={{ width: '100%' }}
                options={[
                  { value: 'BPCL Kondapalli Depot', label: 'BPCL Kondapalli Depot' },
                  { value: 'IOCL Tadepalli Depot', label: 'IOCL Tadepalli Depot' },
                  { value: 'HPCL Cherlapally Terminal', label: 'HPCL Cherlapally Terminal' },
                ]}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Approved Credit Limit (INR):
              </label>
              <Select
                value={newCreditLimit}
                onChange={setNewCreditLimit}
                style={{ width: '100%' }}
                options={[
                  { value: 1000000, label: '₹10 Lakhs' },
                  { value: 1500000, label: '₹15 Lakhs (Standard)' },
                  { value: 2500000, label: '₹25 Lakhs' },
                  { value: 5000000, label: '₹50 Lakhs' },
                ]}
              />
            </div>
          </div>

          <div
            style={{
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: 6,
              padding: '8px 10px',
              fontSize: 11,
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={14} color="#2563EB" />
            <span>New station retailer will automatically receive <strong>3 Free Stations</strong> allowance from Platform Admin.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DistributorClientsPage;
