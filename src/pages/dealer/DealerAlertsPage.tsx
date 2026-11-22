// src/pages/dealer/DealerAlertsPage.tsx
import React, { useState } from 'react';
import { Card, Tag, Button, message } from 'antd';
import { AlertTriangle, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StationAlert {
  id: string;
  title: string;
  description: string;
  level: 'critical' | 'warning' | 'info';
  timestamp: string;
  actionText: string;
  actionRoute?: string;
}

export const DealerAlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<StationAlert[]>([
    {
      id: 'alt-dlr-1',
      title: 'CRITICAL: Tank 1 (Main Diesel) Running Low',
      description:
        'Current volume is 4,200 L (21%). Safe threshold of 3,000 L will be breached within 14 hours. Depot lead time is 2 days. Order 12,000 L immediately.',
      level: 'critical',
      timestamp: 'Today, 06:15 AM',
      actionText: 'Go to Order Refill',
      actionRoute: '/dealer/orders',
    },
    {
      id: 'alt-dlr-2',
      title: 'Daily Dip Stick Reading Reminder',
      description:
        'Evening 10:00 PM closing dip stick reading is pending for Tanks 1, 2, and 3. Logging daily dips calibrates your AI consumption forecast.',
      level: 'warning',
      timestamp: 'Today, 09:30 PM',
      actionText: 'Record Dip Now',
      actionRoute: '/dealer/dashboard',
    },
    {
      id: 'alt-dlr-3',
      title: 'Decanting Delivery Variance Cleared',
      description:
        'Consignment ORD-2026-8790 delivered 11,880 L (120 L discrepancy within permissible 0.25% temperature expansion allowance).',
      level: 'info',
      timestamp: 'Yesterday, 04:30 PM',
      actionText: 'Acknowledge',
    },
  ]);

  const handleAction = (alert: StationAlert) => {
    if (alert.actionRoute) {
      navigate(alert.actionRoute);
    } else {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      message.success('Alert acknowledged and marked resolved.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
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
              Sharma Fuels Station Alerts
            </h2>
            <Tag color="red">{alerts.length} Active</Tag>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
            Telemetry warnings, low-stock thresholds, and stick dip operational reminders.
          </p>
        </div>

        <Button
          icon={<MessageCircle size={15} color="#25D366" />}
          onClick={() => message.info('Connecting to Krishna Petroleum WhatsApp Support Dispatcher...')}
        >
          Depot WhatsApp Helpline
        </Button>
      </div>

      {/* Alert Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {alerts.map((item) => {
          const isCritical = item.level === 'critical';
          const isWarning = item.level === 'warning';
          const borderColor = isCritical ? 'rgba(239, 68, 68, 0.4)' : isWarning ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color)';
          const bgColor = isCritical ? 'rgba(239, 68, 68, 0.05)' : isWarning ? 'rgba(245, 158, 11, 0.05)' : 'var(--panel-bg)';

          return (
            <Card
              key={item.id}
              bordered={false}
              style={{
                background: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                  {isCritical ? (
                    <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  ) : isWarning ? (
                    <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  ) : (
                    <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 15, fontWeight: 700 }}>
                        {item.title}
                      </h4>
                      <Tag color={isCritical ? 'error' : isWarning ? 'warning' : 'default'}>
                        {item.level.toUpperCase()}
                      </Tag>
                    </div>
                    <p style={{ margin: '6px 0 8px 0', color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      Logged at {item.timestamp}
                    </span>
                  </div>
                </div>

                <Button
                  type={isCritical ? 'primary' : 'default'}
                  danger={isCritical}
                  onClick={() => handleAction(item)}
                  icon={<ArrowRight size={14} />}
                >
                  {item.actionText}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DealerAlertsPage;
