import React, { useState } from 'react';
import { Row, Col, Card, Typography, Radio, Select, Input, Button, Tag, Space, message } from 'antd';
import { WhatsAppOutlined, SendOutlined, CheckCircleOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const NotificationsHubPage: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'te' | 'hi'>('en');
  const [templateType, setTemplateType] = useState<string>('low_stock');

  const templates: Record<string, Record<'en' | 'te' | 'hi', string>> = {
    low_stock: {
      en: `⚠️ *FuelCast Stock Warning*\n\nStation: *Sharma Fuels, Benz Circle*\nTank: *Tank 1 (Diesel)*\nCurrent Stock: *4,200 L (21%)*\nDepletion: *2.1 days remaining*\nSafe Minimum: *3,000 L*\n\nSuggested Refill: *12,000 L (3 compartments)*\n\nReply *1* to Confirm Refill\nReply *2* to Postpone by 24h`,
      te: `⚠️ *ఫ్యూయెల్ కాస్ట్ స్టాక్ హెచ్చరిక*\n\nస్టేషన్: *శర్మ ఫ్యూయెల్స్, బెంజ్ సర్కిల్*\nట్యాంక్: *ట్యాంక్ 1 (డీజిల్)*\nప్రస్తుత నిల్వ: *4,200 లీటర్లు (21%)*\nమిగిలిన రోజులు: *2.1 రోజులు*\n\nసిఫార్సు రీఫిల్: *12,000 లీటర్లు*\n\nరీఫిల్ ఆర్డర్ నిర్ధారించడానికి *1* అని రిప్లై ఇవ్వండి.`,
      hi: `⚠️ *फ्यूलकास्ट स्टॉक चेतावनी*\n\nस्टेशन: *शर्मा फ्यूल्स, बेंज सर्कल*\nटैंक: *टैंक 1 (डीजल)*\nवर्तमान स्टॉक: *4,200 L (21%)*\nअनुमानित समय: *2.1 दिन शेष*\n\nसुझाया गया रिफिल: *12,000 L*\n\nस्वीकार करने के लिए *1* लिखकर भेजें।`,
    },
    order_dispatched: {
      en: `🚚 *FuelCast Dispatch Notice*\n\nTanker: *AP16 TX 2690* (Driver: K. Appa Rao)\nOrder: *12,000 L Diesel*\nDestination: *Sharma Fuels, Benz Circle*\nEstimated Arrival: *Today, 02:30 PM*\n\nTrack GPS Live: https://fuelcast.in/track/ord-101`,
      te: `🚚 *ఫ్యూయెల్ కాస్ట్ డిస్పాచ్ సమాచారం*\n\nట్యాంకర్: *AP16 TX 2690* (డ్రైవర్: కె. అప్పారావు)\nఆర్డర్: *12,000 లీటర్ల డీజిల్*\nచేరుకునే సమయం: *ఈరోజు మధ్యాహ్నం 02:30*\n\nలైవ్ ట్రాకింగ్: https://fuelcast.in/track/ord-101`,
      hi: `🚚 *फ्यूलकास्ट डिस्पैच सूचना*\n\nटैंकर: *AP16 TX 2690* (ड्राइवर: के. अप्पा राव)\nमात्रा: *12,000 L डीजल*\nपहुंचने का समय: *आज दोपहर 02:30*\n\nलाइव ट्रैक करें: https://fuelcast.in/track/ord-101`,
    },
  };

  const handleTestSend = () => {
    message.success('Test WhatsApp message delivered to registered developer phone (+91 98765 43210)!');
  };

  return (
    <div style={{ paddingBottom: 40, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>
            WhatsApp &amp; SMS Notifications Hub
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Multi-lingual WhatsApp template manager, automated bot dispatch, and utility cost tracking.
          </Text>
        </div>
        <Tag color="purple" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
          Gateway Active
        </Tag>
      </div>

      {/* Metrics Row */}
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
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Delivery Success SLA</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#10B981', marginTop: 4 }}>99.8%</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              412 alerts sent this week
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
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Read Rate (Under 15 Mins)</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>84.2%</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              High dealer responsiveness
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
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Monthly API Billing Cost</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#2563EB', marginTop: 4 }}>₹12,480</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              @ ₹0.145 per utility session
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {/* Left Column: Template Editor (14 cols) */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <WhatsAppOutlined style={{ color: '#25D366' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Interactive Template Studio</span>
              </Space>
            }
            style={{
              background: 'var(--panel-bg)',
              borderColor: 'var(--border-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                Alert Template Type:
              </Text>
              <Select
                value={templateType}
                onChange={setTemplateType}
                style={{ width: '100%' }}
              >
                <Option value="low_stock">Critical Low Stock Warning &amp; 1-Click Refill</Option>
                <Option value="order_dispatched">Tanker Dispatched &amp; Live GPS Tracking</Option>
              </Select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                Language:
              </Text>
              <Radio.Group
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="en">English (Default)</Radio.Button>
                <Radio.Button value="te">తెలుగు (Telugu)</Radio.Button>
                <Radio.Button value="hi">हिन्दी (Hindi)</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                Message Template Body:
              </Text>
              <TextArea
                rows={9}
                value={templates[templateType][selectedLang]}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 13,
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={handleTestSend} icon={<SendOutlined />}>
                Send Test WhatsApp
              </Button>
              <Button type="primary" onClick={() => message.success('Meta WhatsApp Cloud API template updated!')}>
                Publish Template to Meta
              </Button>
            </div>
          </Card>
        </Col>

        {/* Right Column: Live Phone Mockup Preview (10 cols) */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <GlobalOutlined style={{ color: '#2563EB' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Live WhatsApp Phone Preview</span>
              </Space>
            }
            style={{
              background: 'var(--panel-bg)',
              borderColor: 'var(--border-color)',
              borderRadius: 12,
            }}
          >
            {/* Phone Screen Frame */}
            <div
              style={{
                width: 290,
                margin: '0 auto',
                borderRadius: 24,
                border: '6px solid #1e293b',
                background: '#0B141B',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              }}
            >
              {/* WhatsApp Header */}
              <div
                style={{
                  background: '#1F2C34',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  FC
                </div>
                <div>
                  <div style={{ color: '#E9EDEF', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>FuelCast AI</span>
                    <CheckCircleOutlined style={{ color: '#00A884', fontSize: 12 }} />
                  </div>
                  <div style={{ color: '#8696A0', fontSize: 10 }}>Official Verified Business</div>
                </div>
              </div>

              {/* Chat Canvas */}
              <div
                style={{
                  padding: 12,
                  minHeight: 330,
                  background: '#0B141B',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                {/* Incoming Message Bubble */}
                <div
                  style={{
                    background: '#005C4B',
                    borderRadius: '8px 8px 8px 0px',
                    padding: '8px 10px',
                    maxWidth: '92%',
                    color: '#E9EDEF',
                    fontSize: 11,
                    lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {templates[templateType][selectedLang]}
                  <div style={{ textAlign: 'right', fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                    10:15 AM ✓✓
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationsHubPage;
