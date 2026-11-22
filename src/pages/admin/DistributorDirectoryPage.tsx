import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Table,
  Button,
  Tag,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Badge,
  message,
} from 'antd';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DISTRIBUTORS } from '../../mock/fuelcastData';
import type { Distributor } from '../../types/fuelcast';

const { Title, Text } = Typography;
const { Option } = Select;

export const DistributorDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [distributors, setDistributors] = useState<Distributor[]>(MOCK_DISTRIBUTORS);

  const handleAddDistributor = (values: any) => {
    const newDist: Distributor = {
      id: `dst-${Date.now()}`,
      companyName: values.name,
      headquarters: `${values.city}, ${values.state}`,
      activePumps: 0,
      planQuota: Number(values.limit) || 40,
      planTier: values.planTier || 'Standard',
      contactPerson: values.contactPerson,
      phone: values.phone,
      email: values.email,
      status: 'Active',
      joinedDate: 'Today',
      lastActive: 'Just now',
      monthlyFeeInr: values.planTier === 'Enterprise' ? 24000 : 16000,
    };
    setDistributors([newDist, ...distributors]);
    message.success(`Distributor "${values.name}" invited successfully! Activation email dispatched.`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Distributor Partner',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string, r: Distributor) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text || r.companyName}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {r.headquarters} • Tenant ID: {r.id}
          </div>
        </div>
      ),
    },
    {
      title: 'Plan Tier',
      dataIndex: 'planTier',
      key: 'planTier',
      render: (tier: string) => (
        <Tag color={tier === 'Enterprise' ? 'purple' : tier === 'Growth' ? 'cyan' : 'blue'}>
          {tier} Plan
        </Tag>
      ),
    },
    {
      title: 'Pumps Monitored',
      key: 'pumps',
      render: (_: any, r: Distributor) => {
        const percent = Math.round((r.activePumps / r.planQuota) * 100);
        return (
          <div style={{ width: 160 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
              <span style={{ color: 'var(--text-primary)' }}>{r.activePumps} of {r.planQuota} pumps</span>
              <span style={{ color: 'var(--text-secondary)' }}>{percent}%</span>
            </div>
            <Progress
              percent={percent}
              size="small"
              strokeColor={percent >= 90 ? '#FAAD14' : '#2563EB'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: 'Primary Contact',
      key: 'contact',
      render: (_: any, r: Distributor) => (
        <div>
          <div style={{ color: 'var(--text-primary)', fontSize: 12 }}>{r.contactPerson}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{r.phone}</div>
        </div>
      ),
    },
    {
      title: 'Monthly Run Rate',
      dataIndex: 'monthlyFeeInr',
      key: 'monthlyFeeInr',
      render: (fee: number) => (
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          ₹{(fee || 16000).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'Active' ? 'success' : 'warning'} text={<span style={{ color: 'var(--text-primary)' }}>{status}</span>} />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, r: Distributor) => (
        <Space size="small">
          <Button
            size="small"
            type="link"
            onClick={() => {
              message.info(`Switching view to ${r.companyName}...`);
              navigate('/distributor/dashboard');
            }}
          >
            Launch Portal &rarr;
          </Button>
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
            Distributor Partner Management
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Manage fuel distribution companies, monitored pump quotas, and tenant configurations.
          </Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusCircle size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            Add a Distributor
          </Button>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
            Distributor Hubs
          </Tag>
        </Space>
      </div>

      {/* Distributors Table Card */}
      <Card
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
        }}
      >
        <Table
          dataSource={distributors}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add Distributor Modal */}
      <Modal
        title={<span style={{ color: 'var(--text-primary)' }}>Onboard New Distributor Tenant</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDistributor} style={{ marginTop: 16 }}>
          <Form.Item
            label={<span style={{ color: 'var(--text-primary)' }}>Company / Network Name</span>}
            name="name"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="e.g. Telangana Highway Distributors" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ color: 'var(--text-primary)' }}>Headquarters City</span>}
                name="city"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. Warangal" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ color: 'var(--text-primary)' }}>State</span>}
                name="state"
                rules={[{ required: true }]}
                initialValue="Telangana"
              >
                <Select>
                  <Option value="Andhra Pradesh">Andhra Pradesh</Option>
                  <Option value="Telangana">Telangana</Option>
                  <Option value="Karnataka">Karnataka</Option>
                  <Option value="Tamil Nadu">Tamil Nadu</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ color: 'var(--text-primary)' }}>Plan Tier</span>}
                name="planTier"
                initialValue="Standard"
              >
                <Select>
                  <Option value="Growth">Growth (Up to 20 Pumps)</Option>
                  <Option value="Standard">Standard (Up to 40 Pumps)</Option>
                  <Option value="Enterprise">Enterprise (50+ Pumps)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ color: 'var(--text-primary)' }}>Pump Quota Limit</span>}
                name="limit"
                initialValue="40"
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ color: 'var(--text-primary)' }}>Contact Person</span>}
                name="contactPerson"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. Suresh Varma" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ color: 'var(--text-primary)' }}>Phone Number</span>}
                name="phone"
                rules={[{ required: true }]}
              >
                <Input placeholder="+91 94401 12345" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ color: 'var(--text-primary)' }}>Admin Email Address</span>}
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="operations@network.com" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Send Tenant Invite
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DistributorDirectoryPage;
