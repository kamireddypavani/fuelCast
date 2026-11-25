import React, { useState } from 'react';
import { Card, Typography, Table, Button, Tag, Space, Input, Select, Badge, message } from 'antd';
import { SearchOutlined, KeyOutlined, WhatsAppOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export const UserDirectoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const users = [
    {
      id: 'u-1',
      name: 'Ramesh Sharma',
      role: 'Station Retailer',
      tenant: 'Sharma Fuels',
      phone: '+91 98765 43210',
      email: 'ramesh.sharma@gmail.com',
      authMethod: 'WhatsApp Bot / Passwordless',
      status: 'Active',
    },
    {
      id: 'u-2',
      name: 'Anil Varma',
      role: 'Distributor Staff',
      tenant: 'Krishna Fuels & Telemetry',
      phone: '+91 98480 99887',
      email: 'anil.varma@krishnafuels.in',
      authMethod: 'Password + 2FA',
      status: 'Active',
    },
    {
      id: 'u-3',
      name: 'K. Appa Rao',
      role: 'Tanker Driver',
      tenant: 'Krishna Fleet Logistics',
      phone: '+91 98481 12345',
      email: 'driver.apparao@gmail.com',
      authMethod: 'SMS Dispatch',
      status: 'Active',
    },
    {
      id: 'u-4',
      name: 'Suresh Reddy',
      role: 'Station Retailer',
      tenant: 'Balaji Petroleum Center',
      phone: '+91 99887 76655',
      email: 'balaji.gachibowli@gmail.com',
      authMethod: 'WhatsApp Bot',
      status: 'Active',
    },
    {
      id: 'u-5',
      name: 'Aditya Reddy',
      role: 'Platform Super Admin',
      tenant: 'FuelCast Global',
      phone: '+91 99000 11223',
      email: 'aditya.reddy@fuelcast.in',
      authMethod: 'SAML SSO + TOTP',
      status: 'Active',
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase()) ||
      u.tenant.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = selectedRole === 'All' || u.role.includes(selectedRole);
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: 'User & Organization',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, r: any) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.tenant}</div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'blue';
        if (role.includes('Retailer') || role.includes('Owner') || role.includes('Dealer')) color = 'orange';
        if (role.includes('Driver')) color = 'green';
        if (role.includes('Admin')) color = 'purple';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Contact Details',
      key: 'contact',
      render: (_: any, r: any) => (
        <div>
          <div style={{ color: 'var(--text-primary)', fontSize: 12 }}>{r.phone}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{r.email}</div>
        </div>
      ),
    },
    {
      title: 'Authentication Mode',
      dataIndex: 'authMethod',
      key: 'authMethod',
      render: (method: string) => (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{method}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'Active' ? 'success' : 'default'} text={<span style={{ color: 'var(--text-primary)' }}>{status}</span>} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: any) => (
        <Space size="small">
          <Button
            size="small"
            icon={<KeyOutlined />}
            onClick={() => message.success(`Password reset link dispatched to ${r.email}!`)}
          >
            Reset
          </Button>
          <Button
            size="small"
            icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
            onClick={() => message.success(`WhatsApp invitation resent to ${r.phone}!`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            Multi-Tenant User Management
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Unified directory across dealers, tanker drivers, distributor operations, and system administrators.
          </Text>
        </div>
        <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
          User Directory
        </Tag>
      </div>

      <Card
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
        }}
      >
        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <Input
            placeholder="Search by name, phone, email, or tenant..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 320 }}
            allowClear
          />
          <Select
            value={selectedRole}
            onChange={setSelectedRole}
            style={{ width: 180 }}
          >
            <Option value="All">All User Roles</Option>
            <Option value="Retailer">Station Retailers</Option>
            <Option value="Driver">Tanker Drivers</Option>
            <Option value="Distributor">Distributor Staff</Option>
            <Option value="Admin">Platform Admins</Option>
          </Select>
          <div style={{ marginLeft: 'auto' }}>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              Showing {filteredUsers.length} active users
            </Text>
          </div>
        </div>

        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default UserDirectoryPage;
