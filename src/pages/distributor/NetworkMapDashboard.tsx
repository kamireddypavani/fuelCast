// src/pages/distributor/NetworkMapDashboard.tsx
import React, { useState } from 'react';
import { Card, Tag, Button, Switch, message, Radio } from 'antd';
import {
  Navigation,
  Fuel,
  Truck,
  CheckCircle2,
  Sparkles,
  Zap,
  Split,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Building2,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { MOCK_PUMPS } from '../../mock/fuelcastData';
import type { PumpStation } from '../../types/fuelcast';

export const NetworkMapDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');

  // Selected station for inspection spotlight
  const [selectedPump, setSelectedPump] = useState<PumpStation>(MOCK_PUMPS[0]); // Sharma Fuels

  // Route Optimization Mode: 'consolidated' (Case 1: Smart Multi-Drop) vs 'separate' (Two separate tankers)
  const [routeMode, setRouteMode] = useState<'consolidated' | 'separate'>('consolidated');

  // Map layer controls
  const [showTraffic, setShowTraffic] = useState(true);
  const [mapTheme, setMapTheme] = useState<'street' | 'satellite'>('street');
  const [isDispatched, setIsDispatched] = useState(false);

  // Key locations in Vijayawada logistics corridor
  const depotLocation = {
    name: 'BPCL Kondapalli Depot & Gantry Relay',
    role: 'Our Base / Supply Hub',
    address: 'Kondapalli Industrial Estate, Vijayawada',
    x: 160,
    y: 110,
  };

  const point1 = {
    pump: MOCK_PUMPS[0], // Sharma Fuels
    label: 'Point 1 (Stop 1)',
    name: 'Sharma Fuels',
    area: 'Benz Circle, Vijayawada',
    orderVolume: 8000,
    fuelType: 'Diesel',
    x: 480,
    y: 240,
    legDistance: '18.4 km',
    legTime: '28 mins',
    urgency: 'Critical',
    daysLeft: 2.1,
  };

  const point2 = {
    pump: MOCK_PUMPS[1], // Krishna Fuels
    label: 'Point 2 (Stop 2)',
    name: 'Krishna Fuels & Telemetry',
    area: 'MG Road, Vijayawada',
    orderVolume: 8000,
    fuelType: 'Diesel',
    x: 430,
    y: 330,
    legDistance: '6.2 km',
    legTime: '14 mins',
    urgency: 'Critical',
    daysLeft: 1.8,
  };

  // Other background network stations
  const otherStations = [
    { pump: MOCK_PUMPS[3], name: 'Sri Venkateswara Highway Outpost', area: 'NH-16 Enikepadu', x: 610, y: 170, days: 4.2 },
    { pump: MOCK_PUMPS[5], name: 'Amaravathi Express Station', area: 'Kaza Toll Plaza', x: 490, y: 440, days: 3.5 },
    { pump: MOCK_PUMPS[2], name: 'Balaji Petroleum Center', area: 'Gachibowli, Hyd', x: 90, y: 430, days: 2.8 },
  ];

  // Dispatch handler
  const handleDispatchTanker = () => {
    setIsDispatched(true);
    message.success(
      'Tanker AP16 TX 2690 dispatched on Smart Multi-Drop Route to Stop 1 (Sharma Fuels) & Stop 2 (Krishna Fuels).'
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Header with View Controls */}
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
            Geospatial Dispatch &amp; Route Optimization Map
          </h2>
          <Tag color="processing" style={{ borderRadius: 100, fontWeight: 700, padding: '1px 8px' }}>
            Live GPS Highway Relay
          </Tag>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Traffic Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 11.5,
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: showTraffic ? '#10B981' : '#94A3B8' }} />
            <span>Live Traffic:</span>
            <Switch
              size="small"
              checked={showTraffic}
              onChange={setShowTraffic}
            />
          </div>

          {/* Map Layer Style */}
          <Radio.Group
            value={mapTheme}
            onChange={(e) => setMapTheme(e.target.value)}
            size="small"
            buttonStyle="solid"
          >
            <Radio.Button value="street">Street Map</Radio.Button>
            <Radio.Button value="satellite">Satellite</Radio.Button>
          </Radio.Group>

          <Button
            size="small"
            icon={<Navigation size={13} />}
            onClick={() => navigate('/distributor/orders')}
            style={{ borderRadius: 6, height: 28, fontSize: 12 }}
          >
            Refill Pipeline
          </Button>
        </div>
      </div>

      {/* 2. Intelligent Multi-Drop Case Switcher Strip (Directly addressing Case 1 & Case 2) */}
      <div
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: routeMode === 'consolidated' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: routeMode === 'consolidated' ? '#2563EB' : '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {routeMode === 'consolidated'
                ? 'Case 1: Smart Consolidated Multi-Drop Route (Recommended)'
                : 'Case 2 Comparison: Two Separate Dedicated Dispatches'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {routeMode === 'consolidated'
                ? '1 Tanker (16,000 L) delivers 8,000 L to Point 1 (Sharma Fuels) + 8,000 L to Point 2 (Krishna Fuels) in one circular run.'
                : '2 separate tankers dispatched independently to Point 1 and Point 2, causing duplicate highway mileage.'}
            </div>
          </div>
        </div>

        {/* Toggle between Consolidated and Separate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            type={routeMode === 'consolidated' ? 'primary' : 'default'}
            size="small"
            icon={<Zap size={12} />}
            onClick={() => setRouteMode('consolidated')}
            style={{ borderRadius: 6, fontWeight: 600, height: 28, fontSize: 11.5 }}
          >
            Smart 1-Tanker Multi-Drop
          </Button>
          <Button
            type={routeMode === 'separate' ? 'primary' : 'default'}
            size="small"
            icon={<Split size={12} />}
            onClick={() => setRouteMode('separate')}
            style={{ borderRadius: 6, fontWeight: 600, height: 28, fontSize: 11.5 }}
          >
            Separate 2 Tankers
          </Button>
        </div>
      </div>

      {/* 3. Main Interactive Map & Route Guidance Split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(360px, 1.2fr)',
          gap: 14,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Google Maps Interactive Canvas */}
        <Card
          bordered={false}
          style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 10,
            padding: 0,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
          styles={{ body: { padding: 0 } }}
        >
          {/* Map Top Bar */}
          <div
            style={{
              padding: '8px 14px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--hover-bg)',
              fontSize: 11.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--text-primary)' }}>
              <Navigation size={13} color="var(--primary-color)" />
              <span>Vijayawada – Guntur Highway Corridor (NH-16 &amp; NH-65)</span>
            </div>

            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} /> Our Base (Depot)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} /> Critical Station (&lt;2.5d)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} /> Safe (&gt;4d)
              </span>
            </div>
          </div>

          {/* Realistic Google Maps Graphic Canvas */}
          <div
            style={{
              position: 'relative',
              height: 540,
              background:
                mapTheme === 'satellite'
                  ? 'linear-gradient(145deg, #0f1f1d 0%, #081112 100%)'
                  : isDark
                    ? '#0b1329'
                    : '#e8edf3',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            {/* SVG Base Layers: Roads, Highway Arterials & Krishna River */}
            <svg width="100%" height="100%" viewBox="0 0 740 540" style={{ position: 'absolute', top: 0, left: 0 }}>
              {/* Krishna River (Natural curve across Vijayawada) */}
              <path
                d="M 50 260 Q 220 220, 360 270 T 520 370 T 700 480"
                fill="none"
                stroke={isDark ? '#1e3a5f' : '#bfdbfe'}
                strokeWidth="28"
                strokeLinecap="round"
                opacity={isDark ? 0.6 : 0.8}
              />
              <text
                x="240"
                y="245"
                fill={isDark ? '#38bdf8' : '#2563eb'}
                fontSize="10"
                fontWeight="700"
                letterSpacing="2"
                opacity={0.6}
              >
                KRISHNA RIVER • PRAKASAM BARRAGE
              </text>

              {/* City Street Grid Lines (Google Maps styled subtle grid) */}
              <g stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} strokeWidth="1">
                {[80, 160, 240, 320, 400, 480].map((y) => (
                  <line key={`h-${y}`} x1="0" y1={y} x2="740" y2={y} />
                ))}
                {[120, 240, 360, 480, 600].map((x) => (
                  <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="540" />
                ))}
              </g>

              {/* Secondary Arterials */}
              <path
                d="M 120 40 L 260 200 L 480 240 L 680 200"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}
                strokeWidth="4"
              />
              <path
                d="M 360 40 L 430 330 L 490 520"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}
                strokeWidth="4"
              />

              {/* Major Highway: NH-16 (Kolkata - Chennai Corridor) */}
              <path
                d="M 160 110 Q 320 180, 480 240 T 490 440 T 520 540"
                fill="none"
                stroke={isDark ? '#334155' : '#cbd5e1'}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 160 110 Q 320 180, 480 240 T 490 440 T 520 540"
                fill="none"
                stroke={showTraffic ? (isDark ? '#059669' : '#10b981') : '#94a3b8'}
                strokeWidth="4"
                strokeDasharray="8 6"
              />
              <text
                x="530"
                y="300"
                fill={isDark ? '#64748b' : '#94a3b8'}
                fontSize="10"
                fontWeight="700"
                letterSpacing="1"
              >
                NH-16 EXPRESSWAY
              </text>

              {/* Connecting Road between Point 1 (Benz Circle) and Point 2 (MG Road) */}
              <path
                d="M 480 240 L 430 330"
                fill="none"
                stroke={isDark ? '#475569' : '#cbd5e1'}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <text x="465" y="290" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" fontWeight="600">
                MG Rd (6.2 km)
              </text>

              {/* ROUTE VISUALIZATION (CASE 1 vs CASE 2) */}
              {routeMode === 'consolidated' ? (
                // CASE 1: Single Smart Combined Route (Depot -> Point 1 -> Point 2 -> Return)
                <g>
                  {/* Glowing Route Polyline */}
                  <path
                    d="M 160 110 Q 320 180, 480 240 L 430 330 Q 280 240, 160 110"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(37, 99, 235, 0.6))' }}
                  />
                  {/* Leg 1: Depot -> Point 1 Arrow Marker */}
                  <polygon points="340,185 325,180 330,195" fill="#2563EB" />
                  {/* Leg 2: Point 1 -> Point 2 Arrow Marker */}
                  <polygon points="455,290 460,275 448,280" fill="#2563EB" />
                  {/* Leg 3: Point 2 -> Return Depot Arrow Marker */}
                  <polygon points="260,200 275,210 270,195" fill="#38BDF8" />

                  {/* Waypoint badges on path */}
                  <rect x="290" y="150" width="75" height="18" rx="4" fill="rgba(15,23,42,0.85)" />
                  <text x="296" y="163" fill="#38BDF8" fontSize="9.5" fontWeight="700">
                    Leg 1: 18.4 km
                  </text>

                  <rect x="440" y="275" width="70" height="18" rx="4" fill="rgba(15,23,42,0.85)" />
                  <text x="446" y="288" fill="#F59E0B" fontSize="9.5" fontWeight="700">
                    Leg 2: 6.2 km
                  </text>
                </g>
              ) : (
                // SEPARATE RUNS: Two distinct tankers driving back and forth
                <g>
                  {/* Tanker 1 Route (Depot -> Point 1 -> Depot) */}
                  <path
                    d="M 160 110 Q 320 180, 480 240 Q 320 190, 160 110"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                  {/* Tanker 2 Route (Depot -> Point 2 -> Depot) */}
                  <path
                    d="M 160 110 Q 240 220, 430 330 Q 260 210, 160 110"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                </g>
              )}

              {/* Animated / Active Tanker Position */}
              <g
                transform={`translate(${isDispatched ? 450 : 320}, ${isDispatched ? 270 : 180})`}
                style={{ transition: 'transform 0.8s ease' }}
              >
                <circle r="14" fill="#2563EB" style={{ filter: 'drop-shadow(0 2px 8px rgba(37,99,235,0.7))' }} />
                <circle r="18" fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.6">
                  <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            {/* MAP PINS & LABELS */}

            {/* 1. "Our Location" / Oil Depot Supply Base */}
            <div
              style={{
                position: 'absolute',
                top: depotLocation.y,
                left: depotLocation.x,
                transform: 'translate(-50%, -100%)',
                zIndex: 30,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#1D4ED8',
                  color: '#FFFFFF',
                  padding: '5px 10px',
                  borderRadius: 20,
                  boxShadow: '0 4px 14px rgba(29, 78, 216, 0.45)',
                  border: '2px solid #FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <Building2 size={13} />
                <span style={{ fontSize: 11, fontWeight: 800 }}>Our Base (Depot Hub)</span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '6px solid #1D4ED8',
                }}
              />
            </div>

            {/* 2. Destination 1: Point 1 (Sharma Fuels, Benz Circle) */}
            <div
              onClick={() => setSelectedPump(point1.pump)}
              style={{
                position: 'absolute',
                top: point1.y,
                left: point1.x,
                transform: 'translate(-50%, -100%)',
                zIndex: selectedPump.id === point1.pump.id ? 35 : 25,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: selectedPump.id === point1.pump.id ? '#DC2626' : (isDark ? '#1E293B' : '#FFFFFF'),
                  color: selectedPump.id === point1.pump.id ? '#FFFFFF' : 'var(--text-primary)',
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: '2px solid #EF4444',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#EF4444',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9.5,
                    fontWeight: 800,
                  }}
                >
                  1
                </span>
                <span style={{ fontSize: 11, fontWeight: 700 }}>Point 1: {point1.name}</span>
                <Tag color="error" style={{ margin: 0, padding: '0 4px', fontSize: 9.5, fontWeight: 700, borderRadius: 3 }}>
                  8k L
                </Tag>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '6px solid #EF4444',
                }}
              />
            </div>

            {/* 3. Destination 2: Point 2 (Krishna Fuels, MG Road) */}
            <div
              onClick={() => setSelectedPump(point2.pump)}
              style={{
                position: 'absolute',
                top: point2.y,
                left: point2.x,
                transform: 'translate(-50%, -100%)',
                zIndex: selectedPump.id === point2.pump.id ? 35 : 25,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: selectedPump.id === point2.pump.id ? '#DC2626' : (isDark ? '#1E293B' : '#FFFFFF'),
                  color: selectedPump.id === point2.pump.id ? '#FFFFFF' : 'var(--text-primary)',
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: '2px solid #EF4444',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#EF4444',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9.5,
                    fontWeight: 800,
                  }}
                >
                  2
                </span>
                <span style={{ fontSize: 11, fontWeight: 700 }}>Point 2: {point2.name}</span>
                <Tag color="error" style={{ margin: 0, padding: '0 4px', fontSize: 9.5, fontWeight: 700, borderRadius: 3 }}>
                  8k L
                </Tag>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '6px solid #EF4444',
                }}
              />
            </div>

            {/* Background Network Stations */}
            {otherStations.map((st) => (
              <div
                key={st.name}
                onClick={() => setSelectedPump(st.pump)}
                style={{
                  position: 'absolute',
                  top: st.y,
                  left: st.x,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  opacity: 0.75,
                  zIndex: 15,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    background: isDark ? 'rgba(15,23,42,0.85)' : '#FFFFFF',
                    border: '1px solid var(--border-color)',
                    padding: '3px 8px',
                    borderRadius: 14,
                    fontSize: 10,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.days <= 3 ? '#F59E0B' : '#10B981' }} />
                  <span style={{ fontWeight: 600 }}>{st.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{st.days}d</span>
                </div>
              </div>
            ))}

            {/* On-Map Floating Tanker Telemetry HUD */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.94)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 11,
                backdropFilter: 'blur(8px)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: '#2563EB',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  Tanker AP16 TX 2690 (16,000 L)
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                  Driver: <strong>K. Subba Rao</strong> • 4 Compartments [4k | 4k | 4k | 4k]
                </div>
              </div>
            </div>

            {/* Map Canvas Zoom / Center Controls */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                zIndex: 40,
              }}
            >
              <Button
                size="small"
                icon={<ZoomIn size={13} />}
                onClick={() => message.info('Map Zoomed In')}
                style={{ width: 30, height: 30, padding: 0 }}
              />
              <Button
                size="small"
                icon={<ZoomOut size={13} />}
                onClick={() => message.info('Map Zoomed Out')}
                style={{ width: 30, height: 30, padding: 0 }}
              />
              <Button
                size="small"
                icon={<Crosshair size={13} />}
                onClick={() => message.success('Re-centered on Active Route')}
                style={{ width: 30, height: 30, padding: 0 }}
              />
            </div>

            {/* Traffic Advisory Strip */}
            {showTraffic && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.94)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 10.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  zIndex: 40,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  NH-16 Corridor Traffic: <strong>Normal (Green)</strong> • 3 min slowdown near Benz Circle
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Right Column: Case 1 & Case 2 Route Intelligence & Dispatch Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* CASE 1: Efficiency & Financial Comparison Box */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={16} color="#F59E0B" />
                <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>
                  Route Cost &amp; Fleet Efficiency Analysis
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
            {routeMode === 'consolidated' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Winner Banner */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 11.5,
                  }}
                >
                  <div style={{ color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} /> Smart Multi-Drop Saves ₹3,850 &amp; 55.7 km!
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.35 }}>
                    By loading one 16,000 L tanker to supply both Point 1 &amp; Point 2 on the same corridor, you avoid running two separate vehicles.
                  </div>
                </div>

                {/* Metrics Table */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    fontSize: 11.5,
                  }}
                >
                  <div style={{ background: 'var(--hover-bg)', padding: '8px 10px', borderRadius: 6 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>Total Distance</div>
                    <strong style={{ fontSize: 13, color: '#10B981' }}>46.7 km</strong>
                    <div style={{ fontSize: 9.5, color: '#10B981' }}>-54% vs 2 trips</div>
                  </div>

                  <div style={{ background: 'var(--hover-bg)', padding: '8px 10px', borderRadius: 6 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>Tankers Deployed</div>
                    <strong style={{ fontSize: 13, color: '#2563EB' }}>1 Tanker</strong>
                    <div style={{ fontSize: 9.5, color: '#10B981' }}>1 Tanker spared</div>
                  </div>

                  <div style={{ background: 'var(--hover-bg)', padding: '8px 10px', borderRadius: 6 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>Estimated Transit Time</div>
                    <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>1h 14m</strong>
                    <div style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>Incl. both decants</div>
                  </div>

                  <div style={{ background: 'var(--hover-bg)', padding: '8px 10px', borderRadius: 6 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>Diesel &amp; Toll Cost</div>
                    <strong style={{ fontSize: 13, color: '#10B981' }}>₹2,950</strong>
                    <div style={{ fontSize: 9.5, color: '#10B981' }}>Save ₹3,850</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Inefficiency Warning Banner */}
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 11.5,
                  }}
                >
                  <div style={{ color: '#EF4444', fontWeight: 800 }}>
                    ⚠️ Inefficient: Two Independent Trips
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.35 }}>
                    Tanker 1 goes to Point 1 and returns (48 km). Tanker 2 goes to Point 2 and returns (54 km). Total 102.4 km driven with 2 drivers engaged.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11.5 }}>
                  <div style={{ background: 'var(--hover-bg)', padding: '8px 10px', borderRadius: 6 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>Total Distance</div>
                    <strong style={{ fontSize: 13, color: '#EF4444' }}>102.4 km</strong>
                  </div>
                  <div style={{ background: 'var(--hover-bg)', padding: '8px 10px', borderRadius: 6 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>Tankers Blocked</div>
                    <strong style={{ fontSize: 13, color: '#EF4444' }}>2 Tankers</strong>
                  </div>
                  <div style={{ background: 'var(--hover-bg)', padding: '8px 10px', borderRadius: 6 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>Total Cost</div>
                    <strong style={{ fontSize: 13, color: '#EF4444' }}>₹6,800</strong>
                  </div>
                  <div style={{ background: 'var(--hover-bg)', padding: '8px 10px', borderRadius: 6 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 10.5 }}>Drivers Required</div>
                    <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>2 Drivers</strong>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* CASE 2: Step-by-Step Waypoint Guidance ("Where he needs to send the tankers") */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Navigation size={16} color="var(--primary-color)" />
                <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>
                  Delivery Waypoint Sequence &amp; Instructions
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Waypoint 0: Depot Base */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'var(--hover-bg)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#2563EB',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10.5,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  D
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                      Start: {depotLocation.name}
                    </strong>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>08:30 AM</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Load <strong>16,000 L Diesel</strong> across 4 Compartments [C1: 4k, C2: 4k, C3: 4k, C4: 4k].
                  </div>
                </div>
              </div>

              {/* Waypoint 1: Stop 1 (Sharma Fuels) */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'rgba(239, 68, 68, 0.04)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#EF4444',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10.5,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                      Stop 1: {point1.name} (Benz Circle)
                    </strong>
                    <span style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>ETA: 08:58 AM</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Transit: 18.4 km via NH-16.
                  </div>
                  <div
                    style={{
                      background: 'rgba(37, 99, 235, 0.08)',
                      padding: '4px 8px',
                      borderRadius: 4,
                      marginTop: 4,
                      fontSize: 10.5,
                      color: '#2563EB',
                      fontWeight: 600,
                    }}
                  >
                    👉 Decant 8,000 L (Discharge C1 &amp; C2). 8,000 L remaining on tanker.
                  </div>
                </div>
              </div>

              {/* Waypoint 2: Stop 2 (Krishna Fuels) */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'rgba(239, 68, 68, 0.04)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#EF4444',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10.5,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                      Stop 2: {point2.name} (MG Road)
                    </strong>
                    <span style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>ETA: 09:22 AM</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Transit: 6.2 km from Stop 1 down MG Road.
                  </div>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      padding: '4px 8px',
                      borderRadius: 4,
                      marginTop: 4,
                      fontSize: 10.5,
                      color: '#10B981',
                      fontWeight: 600,
                    }}
                  >
                    👉 Decant balance 8,000 L (Discharge C3 &amp; C4). Tanker fully empty.
                  </div>
                </div>
              </div>

              {/* Dispatch Action Button */}
              <Button
                type="primary"
                block
                size="large"
                icon={isDispatched ? <Check size={16} /> : <Truck size={16} />}
                disabled={isDispatched}
                onClick={handleDispatchTanker}
                style={{
                  fontWeight: 700,
                  height: 38,
                  fontSize: 12.5,
                  borderRadius: 6,
                  background: isDispatched
                    ? '#10B981'
                    : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                }}
              >
                {isDispatched ? 'Tanker Dispatched on Multi-Drop Route' : 'Dispatch Tanker on this Multi-Drop Route'}
              </Button>
            </div>
          </Card>

          {/* Selected Station Spotlight Inspector */}
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Fuel size={15} color="var(--primary-color)" />
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                    Station Inspector: {selectedPump.name}
                  </span>
                </div>
                <Tag color={selectedPump.minDaysLeft <= 2.5 ? 'error' : 'default'} style={{ margin: 0, fontWeight: 700 }}>
                  {selectedPump.minDaysLeft.toFixed(1)}d Stock Left
                </Tag>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Location:</span>
                <strong>{selectedPump.area}, {selectedPump.city}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Owner Contact:</span>
                <span style={{ color: '#2563EB', fontWeight: 600 }}>{selectedPump.dealerPhone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Main Tank (Diesel):</span>
                <strong style={{ color: selectedPump.minDaysLeft <= 2.5 ? '#EF4444' : '#10B981' }}>
                  {selectedPump.tanks[0]?.currentLiters.toLocaleString()} L / {selectedPump.tanks[0]?.capacityLiters.toLocaleString()} L
                </strong>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <Button
                  size="small"
                  block
                  onClick={() => navigate(`/distributor/orders?pump=${selectedPump.id}`)}
                  style={{ borderRadius: 5, fontSize: 11 }}
                >
                  Create Refill Order
                </Button>
                <Button
                  size="small"
                  block
                  onClick={() => navigate(`/distributor/pumps/${selectedPump.id}`)}
                  style={{ borderRadius: 5, fontSize: 11 }}
                >
                  Full Telemetry
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NetworkMapDashboard;
