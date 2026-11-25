import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Table,
  Button,
  Tag,
  Space,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export const TeamRolesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  const teamMembers = [
    {
      id: 'usr-1',
      name: 'Aditya Reddy',
      email: 'aditya.reddy@fuelcast.in',
      role: 'Super Admin',
      twoFactor: 'Enforced (TOTP)',
      lastActive: 'Today, 11:42 AM IST',
      status: 'Active',
    },
    {
      id: 'usr-2',
      name: 'Pavani K.',
      email: 'pavani.k@fuelcast.in',
      role: 'Operations Engineer',
      twoFactor: 'Enforced (SMS)',
      lastActive: 'Today, 10:15 AM IST',
      status: 'Active',
    },
    {
      id: 'usr-3',
      name: 'Sunil Verma',
      email: 'sunil.verma@fuelcast.in',
      role: 'Support Specialist',
      twoFactor: 'Enforced (TOTP)',
      lastActive: 'Yesterday, 06:30 PM IST',
      status: 'Active',
    },
    {
      id: 'usr-4',
      name: 'Deepa N.',
      email: 'deepa.n@fuelcast.in',
      role: 'Billing Manager',
      twoFactor: 'Pending Setup',
      lastActive: '3 days ago',
      status: 'Pending 2FA',
    },
  ];

  const handleInvite = (values: any) => {
    message.success(`Security invite sent to ${values.email}! Two-step setup required upon first login.`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Administrator',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, r: any) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.email}</div>
        </div>
      ),
    },
    {
      title: 'Assigned Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'blue';
        if (role === 'Super Admin') color = 'purple';
        if (role === 'Operations Engineer') color = 'cyan';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Two-Step Security',
      dataIndex: 'twoFactor',
      key: 'twoFactor',
      render: (twoFactor: string) => {
        const isEnforced = (twoFactor || '').includes('Enforced');
        return (
          <Badge
            status={isEnforced ? 'success' : 'warning'}
            text={<span style={{ color: 'var(--text-primary)', fontSize: 12 }}>{twoFactor || 'Not Enabled'}</span>}
          />
        );
      },
    },
    {
      title: 'Last Active Session',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (time: string) => (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{time}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, r: any) => (
        <Button
          size="small"
          onClick={() => message.info(`Session invalidated for ${r.name}. Re-authentication required.`)}
        >
          Revoke Session
        </Button>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            Platform Team &amp; Security Roles
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Admin access permissions, mandatory two-step verification, and active security sessions.
          </Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Invite Admin
          </Button>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
            RBAC Policies
          </Tag>
        </Space>
      </div>

      {/* Security Policies Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Mandatory 2FA</strong>
                <Text style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Enforced for all admin roles</Text>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>New Device Alerts</strong>
                <Text style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Email notification on unknown IP</Text>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Auto Session Timeout</strong>
                <Text style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Log out after 30m idle</Text>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Team Table Card */}
      <Card
        title={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Active Platform Administrators</span>}
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
        }}
      >
        <Table
          dataSource={teamMembers}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Invite Admin Modal */}
      <Modal
        title={<span style={{ color: 'var(--text-primary)' }}>Invite Administrator</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleInvite} style={{ marginTop: 16 }}>
          <Form.Item
            label={<span style={{ color: 'var(--text-primary)' }}>Full Name</span>}
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Rohith Kumar" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: 'var(--text-primary)' }}>Official Email</span>}
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="rohith@fuelcast.in" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: 'var(--text-primary)' }}>Role Permission Tier</span>}
            name="role"
            initialValue="Operations Engineer"
          >
            <Select>
              <Option value="Super Admin">Super Admin (Unrestricted System Access)</Option>
              <Option value="Operations Engineer">Operations Engineer (Manage Syncs &amp; Forecasting)</Option>
              <Option value="Support Specialist">Support Specialist (Read-Only Telemetry &amp; Nudges)</Option>
              <Option value="Billing Manager">Billing Manager (Invoices &amp; Ledger Access)</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Send Admin Invitation
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamRolesPage;
