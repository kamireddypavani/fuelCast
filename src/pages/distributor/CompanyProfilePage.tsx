// src/pages/distributor/CompanyProfilePage.tsx
import React, { useState, useMemo } from 'react';
import { Card, Tag, Table, Button, Modal, Input, Select, message } from 'antd';
import {
  Truck,
  Users,
  Fuel,
  CheckCheck,
  Navigation,
  PackageCheck,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_TANKERS, MOCK_DRIVERS, MOCK_DISTRIBUTORS } from '../../mock/fuelcastData';
import type { TankerTruck, Driver, FuelType } from '../../types/fuelcast';

export const CompanyProfilePage: React.FC = () => {
  const distributor = MOCK_DISTRIBUTORS[0]; // Krishna Petroleum Logistics

  // Dynamic state for tankers and drivers managed by the distributor
  const [tankers, setTankers] = useState<TankerTruck[]>(MOCK_TANKERS);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);

  // Modal visibility states
  const [isAddTankerOpen, setIsAddTankerOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  // New Tanker Form state
  const [newReg, setNewReg] = useState('');
  const [newCapacity, setNewCapacity] = useState<number>(16000);
  const [newFuelCarried, setNewFuelCarried] = useState<FuelType>('Diesel');
  const [newAssignedDriverId, setNewAssignedDriverId] = useState<string>('none');

  // New Driver Form state
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newLicenseNumber, setNewLicenseNumber] = useState('');
  const [newLicenseExpiry, setNewLicenseExpiry] = useState('15 Dec 2028');
  const [newAssignedTruckId, setNewAssignedTruckId] = useState<string>('none');

  // Fleet operational aggregates
  const totalTankers = tankers.length;
  const availableCount = useMemo(
    () => tankers.filter((t) => t.status === 'Available').length,
    [tankers]
  );
  const inTransitCount = useMemo(
    () => tankers.filter((t) => t.status === 'On the way' || t.status === 'Returning').length,
    [tankers]
  );
  const loadingCount = useMemo(
    () => tankers.filter((t) => t.status === 'Loading in depot').length,
    [tankers]
  );
  const totalCapacity = useMemo(
    () => tankers.reduce((sum, t) => sum + t.capacityLiters, 0),
    [tankers]
  );
  const activeDriversCount = useMemo(
    () => drivers.filter((d) => d.status === 'On duty').length,
    [drivers]
  );

  const fleetMetrics = [
    {
      label: 'Total Fleet',
      value: `${totalTankers} Tankers`,
      sub: `${(totalCapacity / 1000).toFixed(0)}k L Payload`,
      icon: <Truck size={14} />,
      color: '#2563EB',
      bgBadge: 'rgba(37, 99, 235, 0.1)',
    },
    {
      label: 'Available Standby',
      value: `${availableCount} Tanker${availableCount > 1 ? 's' : ''}`,
      sub: 'Depot Ready',
      icon: <CheckCheck size={14} />,
      color: '#10B981',
      bgBadge: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'In Transit',
      value: `${inTransitCount} Tankers`,
      sub: 'Highway Moving',
      icon: <Navigation size={14} />,
      color: '#38BDF8',
      bgBadge: 'rgba(56, 189, 248, 0.1)',
    },
    {
      label: 'Depot Loading',
      value: `${loadingCount} Tanker`,
      sub: 'Gantry Armed',
      icon: <PackageCheck size={14} />,
      color: '#F59E0B',
      bgBadge: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Drivers on Duty',
      value: `${activeDriversCount} Drivers`,
      sub: '100% Hazmat Certified',
      icon: <Users size={14} />,
      color: '#8B5CF6',
      bgBadge: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  // Helper: compute compartment breakdown array
  const getCompartmentsForCapacity = (cap: number): number[] => {
    if (cap === 12000) return [4000, 4000, 4000];
    if (cap === 16000) return [4000, 4000, 4000, 4000];
    if (cap === 20000) return [5000, 5000, 5000, 5000];
    if (cap === 24000) return [6000, 6000, 6000, 6000];
    return [cap / 2, cap / 2];
  };

  // Add Tanker Handler
  const handleAddTanker = () => {
    if (!newReg.trim()) {
      message.error('Please enter the tanker vehicle registration number');
      return;
    }

    const assignedDriverObj = drivers.find((d) => d.id === newAssignedDriverId);
    const assignedDriverName = assignedDriverObj ? assignedDriverObj.name : 'Unassigned';
    const assignedDriverPhone = assignedDriverObj ? assignedDriverObj.phone : '-';

    const newTruck: TankerTruck = {
      id: `truck-${Date.now()}`,
      registration: newReg.trim().toUpperCase(),
      capacityLiters: newCapacity,
      compartments: getCompartmentsForCapacity(newCapacity),
      assignedDriver: assignedDriverName,
      driverPhone: assignedDriverPhone,
      status: 'Available',
      fuelCarried: newFuelCarried,
      currentDestination: 'Free at depot standby',
    };

    setTankers((prev) => [newTruck, ...prev]);

    // Update driver's assigned truck if selected
    if (assignedDriverObj) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === assignedDriverObj.id ? { ...d, assignedTruck: newTruck.registration } : d))
      );
    }

    setIsAddTankerOpen(false);
    setNewReg('');
    message.success(`Tanker ${newTruck.registration} (${newCapacity.toLocaleString()} L) onboarded to fleet`);
  };

  // Add Driver Handler
  const handleAddDriver = () => {
    if (!newDriverName.trim() || !newDriverPhone.trim() || !newLicenseNumber.trim()) {
      message.error('Please fill in driver name, phone, and commercial license number');
      return;
    }

    const assignedTruckObj = tankers.find((t) => t.id === newAssignedTruckId);
    const assignedTruckReg = assignedTruckObj ? assignedTruckObj.registration : 'Unassigned';

    const newDrv: Driver = {
      id: `drv-${Date.now()}`,
      name: newDriverName.trim(),
      phone: newDriverPhone.trim(),
      licenseNumber: newLicenseNumber.trim().toUpperCase(),
      licenseExpiry: newLicenseExpiry.trim(),
      status: 'On duty',
      assignedTruck: assignedTruckReg,
      totalTrips: 0,
    };

    setDrivers((prev) => [newDrv, ...prev]);

    // Update tanker's assigned driver if selected
    if (assignedTruckObj) {
      setTankers((prev) =>
        prev.map((t) =>
          t.id === assignedTruckObj.id
            ? { ...t, assignedDriver: newDrv.name, driverPhone: newDrv.phone }
            : t
        )
      );
    }

    setIsAddDriverOpen(false);
    setNewDriverName('');
    setNewDriverPhone('');
    setNewLicenseNumber('');
    message.success(`Driver ${newDrv.name} onboarded with commercial Hazmat license`);
  };

  const tankerColumns = [
    {
      title: 'Registration',
      dataIndex: 'registration',
      key: 'registration',
      render: (reg: string) => <strong style={{ color: 'var(--primary-color)' }}>{reg}</strong>,
    },
    {
      title: 'Capacity & Compartments',
      key: 'compartments',
      render: (_: unknown, record: TankerTruck) => (
        <div>
          <div><strong>{record.capacityLiters.toLocaleString('en-IN')} L</strong></div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {record.compartments.map((comp, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 10,
                  background: 'var(--hover-bg)',
                  border: '1px solid var(--border-color)',
                  padding: '1px 5px',
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                {comp / 1000}k
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned Driver',
      dataIndex: 'assignedDriver',
      key: 'assignedDriver',
      render: (d: string, record: TankerTruck) => (
        <div>
          <div style={{ fontWeight: 600 }}>{d}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{record.driverPhone}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const color =
          st === 'On the way'
            ? 'processing'
            : st === 'Available'
              ? 'success'
              : st === 'Loading in depot'
                ? 'warning'
                : 'cyan';
        return (
          <Tag color={color} style={{ borderRadius: 4, fontWeight: 700, padding: '1px 8px' }}>
            {st}
          </Tag>
        );
      },
    },
    {
      title: 'Current Mission / Destination',
      key: 'dest',
      render: (_: unknown, r: TankerTruck) => (
        <span style={{ fontSize: 12 }}>{r.currentDestination || 'Free at depot standby'}</span>
      ),
    },
  ];

  const driverColumns = [
    {
      title: 'Driver Name',
      dataIndex: 'name',
      key: 'name',
      render: (n: string) => <strong>{n}</strong>,
    },
    { title: 'Contact', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Commercial Hazmat License',
      dataIndex: 'licenseNumber',
      key: 'licenseNumber',
      render: (lic: string) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{lic}</span>,
    },
    { title: 'Valid Until', dataIndex: 'licenseExpiry', key: 'licenseExpiry' },
    {
      title: 'Duty Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => (
        <Tag color={st === 'On duty' ? 'success' : 'default'} style={{ borderRadius: 4, fontWeight: 700 }}>
          {st}
        </Tag>
      ),
    },
    {
      title: 'Assigned Tanker',
      dataIndex: 'assignedTruck',
      key: 'assignedTruck',
      render: (tr: string) => (
        <Tag color="blue" style={{ borderRadius: 4, fontWeight: 600 }}>
          {tr}
        </Tag>
      ),
    },
    {
      title: 'Completed Trips',
      dataIndex: 'totalTrips',
      key: 'totalTrips',
      render: (t: number) => <strong>{t} trips</strong>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Clean, Borderless Top Header Row */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontWeight: 700 }}>
            Tanker Fleet &amp; Driver Logistics
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            • {distributor.headquarters} Dedicated Fleet
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              borderRadius: 6,
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Fuel size={13} color="var(--primary-color)" />
            <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Active Fleet Payload:</span>
            <strong style={{ fontSize: 12.5, color: 'var(--primary-color)' }}>
              {totalCapacity.toLocaleString('en-IN')} L
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Compact 5-Metric Quick Stats Strip */}
      <div
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '8px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 10,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {fleetMetrics.map((m) => (
          <div
            key={m.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 6,
              background: m.bgBadge,
              border: `1px solid ${m.color}25`,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: m.color,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 11.5,
                boxShadow: `0 2px 6px ${m.color}44`,
                flexShrink: 0,
              }}
            >
              {m.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: 1,
                }}
              >
                {m.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Fleet Tankers Table */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={16} color="var(--primary-color)" />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13.5 }}>
                Active Tanker Fleet &amp; Compartment Configurations
              </span>
            </div>
            <Button
              type="primary"
              size="small"
              icon={<Plus size={13} />}
              onClick={() => setIsAddTankerOpen(true)}
              style={{
                borderRadius: 6,
                fontWeight: 600,
                height: 28,
                fontSize: 11.5,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              }}
            >
              Add Tanker
            </Button>
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
          columns={tankerColumns}
          dataSource={tankers}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 4. Driver Roster Table */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} color="var(--primary-color)" />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13.5 }}>
                Assigned Tanker Drivers Roster
              </span>
            </div>
            <Button
              size="small"
              icon={<Plus size={13} />}
              onClick={() => setIsAddDriverOpen(true)}
              style={{
                borderRadius: 6,
                fontWeight: 600,
                height: 28,
                fontSize: 11.5,
              }}
            >
              Add Driver
            </Button>
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
          columns={driverColumns}
          dataSource={drivers}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* MODAL 1: Add New Tanker to Distributor Fleet */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={17} color="var(--primary-color)" />
            <span style={{ fontWeight: 800 }}>Onboard New Tanker Truck</span>
          </div>
        }
        open={isAddTankerOpen}
        onCancel={() => setIsAddTankerOpen(false)}
        onOk={handleAddTanker}
        okText="Register Tanker"
        cancelText="Cancel"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Vehicle Registration Number (RTO):
            </label>
            <Input
              placeholder="e.g. AP16 TZ 8840 or TS09 UB 5521"
              value={newReg}
              onChange={(e) => setNewReg(e.target.value)}
              style={{ borderRadius: 6 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Tank Gross Capacity:
              </label>
              <Select
                style={{ width: '100%' }}
                value={newCapacity}
                onChange={setNewCapacity}
                options={[
                  { value: 12000, label: '12,000 L (3 x 4k Compartments)' },
                  { value: 16000, label: '16,000 L (4 x 4k Compartments) [Standard]' },
                  { value: 20000, label: '20,000 L (4 x 5k Compartments)' },
                  { value: 24000, label: '24,000 L (4 x 6k Articulated Bowsers)' },
                ]}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Dedicated Fuel Type:
              </label>
              <Select
                style={{ width: '100%' }}
                value={newFuelCarried}
                onChange={setNewFuelCarried}
                options={[
                  { value: 'Diesel', label: '💧 Diesel (HSD)' },
                  { value: 'Petrol', label: '🟢 Petrol (MS)' },
                  { value: 'Speed Petrol', label: '🟣 Speed XP95' },
                ]}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Assign Primary Driver:
            </label>
            <Select
              style={{ width: '100%' }}
              value={newAssignedDriverId}
              onChange={setNewAssignedDriverId}
              options={[
                { value: 'none', label: 'Unassigned (Reserve Tanker at Depot)' },
                ...drivers.map((d) => ({
                  value: d.id,
                  label: `${d.name} (${d.phone}) • Currently on ${d.assignedTruck}`,
                })),
              ]}
            />
          </div>
        </div>
      </Modal>

      {/* MODAL 2: Add New Driver to Distributor Roster */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={17} color="var(--primary-color)" />
            <span style={{ fontWeight: 800 }}>Onboard New Commercial Driver</span>
          </div>
        }
        open={isAddDriverOpen}
        onCancel={() => setIsAddDriverOpen(false)}
        onOk={handleAddDriver}
        okText="Onboard Driver"
        cancelText="Cancel"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Driver Full Name:
              </label>
              <Input
                placeholder="e.g. M. Ramesh Kumar"
                value={newDriverName}
                onChange={(e) => setNewDriverName(e.target.value)}
                style={{ borderRadius: 6 }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Phone Number (WhatsApp):
              </label>
              <Input
                placeholder="e.g. +91 98483 12345"
                value={newDriverPhone}
                onChange={(e) => setNewDriverPhone(e.target.value)}
                style={{ borderRadius: 6 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Commercial Hazmat License No:
              </label>
              <Input
                placeholder="e.g. AP16 20210049281"
                value={newLicenseNumber}
                onChange={(e) => setNewLicenseNumber(e.target.value)}
                style={{ borderRadius: 6 }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                License Expiry Date:
              </label>
              <Input
                placeholder="e.g. 15 Dec 2028"
                value={newLicenseExpiry}
                onChange={(e) => setNewLicenseExpiry(e.target.value)}
                style={{ borderRadius: 6 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Assign to Tanker:
            </label>
            <Select
              style={{ width: '100%' }}
              value={newAssignedTruckId}
              onChange={setNewAssignedTruckId}
              options={[
                { value: 'none', label: 'Unassigned (Reserve Pool / Standby)' },
                ...tankers.map((t) => ({
                  value: t.id,
                  label: `${t.registration} (${(t.capacityLiters / 1000).toFixed(0)}k L) • Current Driver: ${t.assignedDriver}`,
                })),
              ]}
            />
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 6,
              padding: '8px 10px',
              fontSize: 11,
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ShieldCheck size={14} color="#10B981" />
            <span>Driver will be verified for petroleum terminal hazardous transport compliance.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyProfilePage;
