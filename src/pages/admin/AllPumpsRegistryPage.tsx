import React, { useState } from 'react';
import { Table, Card, Typography, Input, Select, Tag, Button, Space, Badge, message } from 'antd';
import { SearchOutlined, EyeOutlined, SettingOutlined, CloudSyncOutlined, FormOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MOCK_PUMPS } from '../../mock/fuelcastData';
import type { PumpStation } from '../../types/fuelcast';

const { Title, Text } = Typography;
const { Option } = Select;

export const AllPumpsRegistryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');

  const filteredPumps = MOCK_PUMPS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.code.toLowerCase().includes(searchText.toLowerCase()) ||
      p.city.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesSource = selectedSource === 'All' || p.dataSource === selectedSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const columns = [
    {
      title: 'Station & Code',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, r: PumpStation) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            Code: {r.code} • {r.area}
          </div>
        </div>
      ),
    },
    {
      title: 'City & State',
      key: 'location',
      render: (_: any, r: PumpStation) => (
        <div>
          <div style={{ color: 'var(--text-primary)', fontSize: 12 }}>{r.city}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{r.state}</div>
        </div>
      ),
    },
    {
      title: 'Supply Depot',
      dataIndex: 'depot',
      key: 'depot',
      render: (depot: string, r: PumpStation) => (
        <div>
          <div style={{ color: 'var(--text-primary)', fontSize: 12 }}>{depot}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Lead time: {r.leadTimeDays}d</div>
        </div>
      ),
    },
    {
      title: 'Telemetry Source',
      dataIndex: 'dataSource',
      key: 'dataSource',
      render: (source: string) => {
        let color = 'blue';
        let icon = <CloudSyncOutlined />;
        if (source === 'Manual entry') {
          color = 'orange';
          icon = <FormOutlined />;
        } else if (source === 'CSV upload') {
          color = 'green';
          icon = <FileExcelOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {source}
          </Tag>
        );
      },
    },
    {
      title: 'Last Reading Dip',
      dataIndex: 'lastReadingTime',
      key: 'lastReadingTime',
      render: (time: string) => (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{time}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let badgeStatus = 'default';
        if (status === 'Live') badgeStatus = 'success';
        if (status === 'Setting up') badgeStatus = 'processing';
        if (status === 'Inactive') badgeStatus = 'error';
        return <Badge status={badgeStatus as any} text={<span style={{ color: 'var(--text-primary)' }}>{status}</span>} />;
      },
    },
    {
      title: 'Stock Health',
      key: 'health',
      render: (_: any, r: PumpStation) => {
        const days = r.minDaysLeft || 3.5;
        const isCritical = days < 2.0;
        return (
          <Tag color={isCritical ? 'red' : days < 4.0 ? 'orange' : 'green'}>
            {days.toFixed(1)}d left
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: PumpStation) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/distributor/pumps/${r.id}`)}
          >
            Telemetry
          </Button>
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => message.info(`Editing parameters for ${r.name}`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            System-Wide Pump Stations Registry
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            All 296 retail pumps across Andhra Pradesh &amp; Telangana distributor networks.
          </Text>
        </div>
        <Space>
          <Button type="primary" onClick={() => navigate('/distributor/pumps/new')}>
            + Onboard Pump
          </Button>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
            296 Stations
          </Tag>
        </Space>
      </div>

      <Card
        style={{
          background: 'var(--panel-bg)',
          borderColor: 'var(--border-color)',
          borderRadius: 12,
        }}
      >
        {/* Filters Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <Input
            placeholder="Search by pump name, code or city..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 140 }}
          >
            <Option value="All">All Statuses</Option>
            <Option value="Live">Live</Option>
            <Option value="Setting up">Setting up</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
          <Select
            value={selectedSource}
            onChange={setSelectedSource}
            style={{ width: 160 }}
          >
            <Option value="All">All Sources</Option>
            <Option value="Auto-sync">Auto-sync (IoT)</Option>
            <Option value="Manual entry">Manual Entry</Option>
            <Option value="CSV upload">CSV Batch</Option>
          </Select>
          <div style={{ marginLeft: 'auto' }}>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              Showing {filteredPumps.length} of 296 pumps
            </Text>
          </div>
        </div>

        <Table
          dataSource={filteredPumps}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AllPumpsRegistryPage;
