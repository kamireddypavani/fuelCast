// src/pages/dealer/DealerProfilePage.tsx
import React from 'react';
import { Card, Descriptions, Tag, Row, Col } from 'antd';
import {
  Building2,
  ShieldCheck,
  Fuel,
} from 'lucide-react';

export const DealerProfilePage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
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
              Sharma Fuels Station Profile
            </h2>
            <Tag color="success">Operating &amp; Connected</Tag>
            <Tag color="blue">FC-VJA-01</Tag>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
            Retail outlet configuration, supplying depot agreement, and telemetry integration settings.
          </p>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Column: Station Details */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={17} color="#38bdf8" />
                <span style={{ fontWeight: 700 }}>Station &amp; Ownership Information</span>
              </div>
            }
            bordered={false}
            style={{ background: 'var(--panel-bg)', borderRadius: 12 }}
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Retail Outlet Name">
                <span style={{ fontWeight: 600 }}>Sharma Fuels</span>
              </Descriptions.Item>
              <Descriptions.Item label="Station Identifier">FC-VJA-01</Descriptions.Item>
              <Descriptions.Item label="Dealer Principal">Ramesh Sharma</Descriptions.Item>
              <Descriptions.Item label="Contact Phone">+91 98765 43210</Descriptions.Item>
              <Descriptions.Item label="Official Email">dealer@sharmafuels.in</Descriptions.Item>
              <Descriptions.Item label="Station Address">
                Benz Circle, Bandar Road, Vijayawada - 520010, Andhra Pradesh
              </Descriptions.Item>
              <Descriptions.Item label="Geo Coordinates">
                16.5062° N, 80.6480° E
              </Descriptions.Item>
              <Descriptions.Item label="PESO License Number">
                PESO/AP/VJA/2019/8812 (Valid till 31-Dec-2029)
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Right Column: Depot & Hardware Assets */}
        <Col xs={24} lg={10}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={17} color="#10b981" />
                  <span style={{ fontWeight: 700 }}>Depot Supply Agreement</span>
                </div>
              }
              bordered={false}
              style={{ background: 'var(--panel-bg)', borderRadius: 12 }}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Designated Supply Depot">
                  <span style={{ fontWeight: 600 }}>BPCL Kondapalli Depot</span>
                </Descriptions.Item>
                <Descriptions.Item label="Transit Distance">28 km (approx. 45 min tanker run)</Descriptions.Item>
                <Descriptions.Item label="Depot Standard Lead Time">
                  <Tag color="warning">2 Days Guaranteed</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Parent Logistics Partner">
                  Krishna Petroleum Logistics Ltd.
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Fuel size={17} color="#f59e0b" />
                  <span style={{ fontWeight: 700 }}>Underground Tanks Calibration</span>
                </div>
              }
              bordered={false}
              style={{ background: 'var(--panel-bg)', borderRadius: 12 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>Tank 1 (Main Diesel)</span>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Capacity: 20,000 L • Safe Min: 3,000 L</div>
                  </div>
                  <Tag color="blue">HSD</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>Tank 2 (Regular Petrol)</span>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Capacity: 15,000 L • Safe Min: 2,500 L</div>
                  </div>
                  <Tag color="green">MS</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>Tank 3 (Speed Premium)</span>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Capacity: 10,000 L • Safe Min: 1,500 L</div>
                  </div>
                  <Tag color="purple">Speed MS</Tag>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DealerProfilePage;
