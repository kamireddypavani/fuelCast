// src/pages/distributor/AlertsCenterPage.tsx
import React, { useState } from 'react';
import { Row, Col, Card, Tag, Button, message, Progress } from 'antd';
import { AlertTriangle, CheckCircle2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ALERTS } from '../../mock/fuelcastData';
import type { AlertItem } from '../../types/fuelcast';

export const AlertsCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);

  const handleResolve = (id: string, actionMsg: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    message.success(actionMsg);
  };

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
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 22, fontWeight: 800 }}>
            Operations Alerts &amp; Exceptions
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
            Proactive warnings for dry-out risks, missing dip readings, and delivery volume discrepancies.
          </p>
        </div>
        <Tag color="error" style={{ fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 8 }}>
          {alerts.length} Actionable Items
        </Tag>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Column: Categorized Alert Cards */}
        <Col xs={24} lg={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.length === 0 ? (
              <Card style={{ background: 'var(--panel-bg)', textAlign: 'center', padding: 40, borderRadius: 12 }}>
                <CheckCircle2 size={40} color="#10B981" style={{ marginBottom: 10 }} />
                <h3>All Systems Operating Smoothly</h3>
                <p style={{ color: 'var(--text-secondary)' }}>No active dry-out warnings or missing telemetry records.</p>
              </Card>
            ) : (
              alerts.map((alert) => {
                const isHigh = alert.severity === 'high';
                return (
                  <div
                    key={alert.id}
                    style={{
                      background: 'var(--panel-bg)',
                      border: `1.5px solid ${isHigh ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                      borderRadius: 12,
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          background: isHigh ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isHigh ? '#ef4444' : '#f59e0b',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <AlertTriangle size={18} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                            {alert.title}
                          </span>
                          <Tag color={isHigh ? 'error' : 'warning'} style={{ fontSize: 10, borderRadius: 4 }}>
                            {alert.severity.toUpperCase()}
                          </Tag>
                          <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                            {alert.timestamp}
                          </span>
                        </div>
                        <p style={{ margin: '6px 0 0 0', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                          {alert.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
                      {alert.type === 'critical_tank' && (
                        <Button
                          type="primary"
                          onClick={() => {
                            navigate('/distributor/orders');
                            handleResolve(alert.id, 'Navigated to Order Kanban to process refill');
                          }}
                        >
                          Review Order
                        </Button>
                      )}

                      {alert.type === 'missing_reading' && (
                        <Button
                          type="primary"
                          icon={<MessageCircle size={14} />}
                          style={{ background: '#25D366', borderColor: '#25D366' }}
                          onClick={() => handleResolve(alert.id, 'WhatsApp reminder dispatched to pump manager')}
                        >
                          Remind Retailer
                        </Button>
                      )}

                      {alert.type === 'delivery_short' && (
                        <Button
                          onClick={() => handleResolve(alert.id, 'Shortage noted and flagged for depot reconciliation')}
                        >
                          Audit Discrepancy
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Col>

        {/* Right Column: Daily Notification Dispatch Stats */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Alert Distribution Channels</span>}
            bordered={false}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                  <span>WhatsApp Business API</span>
                  <strong>184 messages (68%)</strong>
                </div>
                <Progress percent={68} strokeColor="#25D366" showInfo={false} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                  <span>Push / Web In-App</span>
                  <strong>54 alerts (20%)</strong>
                </div>
                <Progress percent={20} strokeColor="#2563eb" showInfo={false} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                  <span>SMS Fallback</span>
                  <strong>32 messages (12%)</strong>
                </div>
                <Progress percent={12} strokeColor="#f59e0b" showInfo={false} />
              </div>

              <div
                style={{
                  marginTop: 10,
                  padding: 12,
                  background: 'var(--hover-bg)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                }}
              >
                💡 Automated threshold alert rules are active: warnings fire at <strong>3 days remaining</strong> and escalate to urgent at <strong>1.5 days</strong>.
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AlertsCenterPage;
