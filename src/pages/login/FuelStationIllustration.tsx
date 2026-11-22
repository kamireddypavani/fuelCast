import React from 'react';

export const FuelStationIllustration: React.FC = () => {
  return (
    <div className="fuel-station-wrapper">
      {/* Floating Status Chip: Sharma Fuels (Low Fuel Alert) */}
      <div className="floating-chip chip-warning">
        <div className="chip-badge badge-red">
          <span className="pulse-dot" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="chip-content">
          <div className="chip-title">Sharma Fuels, diesel</div>
          <div className="chip-subtitle">
            <span className="highlight-warning">2.1 days left</span> • Order suggested
          </div>
        </div>
      </div>

      {/* Floating Status Chip: Refill Accepted (Success Dispatch) */}
      <div className="floating-chip chip-success">
        <div className="chip-badge badge-green">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="chip-content">
          <div className="chip-title">Refill accepted</div>
          <div className="chip-subtitle">
            <span className="highlight-success">12,000 L</span> arrives Sat, 21 Nov
          </div>
        </div>
      </div>

      {/* Fuel Station Canopy & Pumps SVG Illustration */}
      <svg
        className="station-svg"
        viewBox="0 0 500 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Canopy Roof Gradient */}
          <linearGradient id="canopyGrad" x1="250" y1="10" x2="250" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Electric Blue Canopy Accent Stripe */}
          <linearGradient id="blueStripe" x1="30" y1="36" x2="470" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Downward Light Cones */}
          <linearGradient id="lightCone1" x1="120" y1="45" x2="120" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lightCone2" x1="250" y1="45" x2="250" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lightCone3" x1="380" y1="45" x2="380" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </linearGradient>

          {/* Pump Body Gradient */}
          <linearGradient id="pumpWhiteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="pumpBlueTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Left City Skyline Silhouette with Glowing Windows */}
        <g opacity="0.65">
          <rect x="8" y="96" width="20" height="56" fill="#080f24" rx="1.5" />
          <rect x="32" y="78" width="24" height="74" fill="#0c1635" rx="1.5" />
          <rect x="60" y="90" width="20" height="62" fill="#091228" rx="1.5" />
          {/* Windows */}
          <rect x="36" y="84" width="3" height="3" fill="#fbbf24" opacity="0.85" />
          <rect x="46" y="84" width="3" height="3" fill="#fbbf24" opacity="0.85" />
          <rect x="36" y="94" width="3" height="3" fill="#fbbf24" opacity="0.85" />
          <rect x="46" y="104" width="3" height="3" fill="#fbbf24" opacity="0.85" />
          <rect x="13" y="106" width="2.5" height="2.5" fill="#fbbf24" opacity="0.75" />
          <rect x="20" y="118" width="2.5" height="2.5" fill="#fbbf24" opacity="0.75" />
          <rect x="66" y="98" width="2.5" height="2.5" fill="#fbbf24" opacity="0.8" />
        </g>

        {/* Right City Skyline Silhouette with Glowing Windows */}
        <g opacity="0.65">
          <rect x="415" y="84" width="22" height="68" fill="#091228" rx="1.5" />
          <rect x="441" y="74" width="26" height="78" fill="#0c1635" rx="1.5" />
          <rect x="471" y="95" width="20" height="57" fill="#080f24" rx="1.5" />
          {/* Windows */}
          <rect x="447" y="80" width="3" height="3" fill="#fbbf24" opacity="0.85" />
          <rect x="457" y="80" width="3" height="3" fill="#fbbf24" opacity="0.85" />
          <rect x="447" y="92" width="3" height="3" fill="#fbbf24" opacity="0.85" />
          <rect x="457" y="104" width="3" height="3" fill="#fbbf24" opacity="0.85" />
          <rect x="421" y="94" width="2.5" height="2.5" fill="#fbbf24" opacity="0.75" />
          <rect x="428" y="108" width="2.5" height="2.5" fill="#fbbf24" opacity="0.75" />
          <rect x="477" y="104" width="2.5" height="2.5" fill="#fbbf24" opacity="0.75" />
        </g>

        {/* Downward Floodlights */}
        <polygon points="90,45 150,45 185,155 55,155" fill="url(#lightCone1)" />
        <polygon points="220,45 280,45 315,155 185,155" fill="url(#lightCone2)" />
        <polygon points="350,45 410,45 445,155 315,155" fill="url(#lightCone3)" />

        {/* Ground Pavement & Islands */}
        <rect x="20" y="152" width="460" height="10" rx="3" fill="#0D152F" />
        <rect x="35" y="150" width="430" height="2" fill="#1E293B" />

        {/* Canopy Support Pillars */}
        <rect x="100" y="45" width="10" height="106" fill="#CBD5E1" opacity="0.8" rx="2" />
        <rect x="390" y="45" width="10" height="106" fill="#CBD5E1" opacity="0.8" rx="2" />

        {/* Canopy Roof Slab */}
        <path d="M30 18H470L455 45H45L30 18Z" fill="url(#canopyGrad)" />
        {/* Canopy Upper Rim */}
        <rect x="28" y="15" width="444" height="4" rx="2" fill="#F8FAFC" />
        {/* Canopy Fascia Blue Racing Stripe */}
        <rect x="42" y="32" width="416" height="6" rx="2" fill="url(#blueStripe)" />

        {/* ================= PUMP 1 (Left Dispenser) ================= */}
        <g className="pump-group" transform="translate(115, 82)">
          <rect x="-6" y="66" width="56" height="4" rx="2" fill="#1E293B" />
          <rect x="0" y="0" width="44" height="66" rx="6" fill="url(#pumpWhiteGrad)" />
          <rect x="0" y="0" width="44" height="14" rx="5" fill="url(#pumpBlueTop)" />
          {/* LED Display */}
          <rect x="6" y="20" width="32" height="18" rx="2.5" fill="#060B18" />
          <rect x="10" y="24" width="24" height="4.5" rx="1" fill="#38BDF8" opacity="0.9" />
          <rect x="10" y="31" width="14" height="3.5" rx="1" fill="#34D399" opacity="0.85" />
          {/* Nozzles */}
          <rect x="-3" y="28" width="3" height="20" rx="1.5" fill="#0F172A" />
          <path d="M-1.5 32C-6 42 -5 58 3 64" stroke="#0F172A" strokeWidth="2" fill="none" />
          <rect x="44" y="28" width="3" height="20" rx="1.5" fill="#0F172A" />
          <path d="M45.5 32C50 42 49 58 41 64" stroke="#0F172A" strokeWidth="2" fill="none" />
        </g>

        {/* ================= PUMP 2 (Center Dispenser) ================= */}
        <g className="pump-group" transform="translate(228, 82)">
          <rect x="-6" y="66" width="56" height="4" rx="2" fill="#1E293B" />
          <rect x="0" y="0" width="44" height="66" rx="6" fill="url(#pumpWhiteGrad)" />
          <rect x="0" y="0" width="44" height="14" rx="5" fill="url(#pumpBlueTop)" />
          {/* LED Display */}
          <rect x="6" y="20" width="32" height="18" rx="2.5" fill="#060B18" />
          <rect x="10" y="24" width="24" height="4.5" rx="1" fill="#38BDF8" opacity="0.9" />
          <rect x="10" y="31" width="14" height="3.5" rx="1" fill="#34D399" opacity="0.85" />
          {/* Nozzles */}
          <rect x="-3" y="28" width="3" height="20" rx="1.5" fill="#0F172A" />
          <path d="M-1.5 32C-6 42 -5 58 3 64" stroke="#0F172A" strokeWidth="2" fill="none" />
          <rect x="44" y="28" width="3" height="20" rx="1.5" fill="#0F172A" />
          <path d="M45.5 32C50 42 49 58 41 64" stroke="#0F172A" strokeWidth="2" fill="none" />
        </g>

        {/* ================= PUMP 3 (Right Dispenser) ================= */}
        <g className="pump-group" transform="translate(341, 82)">
          <rect x="-6" y="66" width="56" height="4" rx="2" fill="#1E293B" />
          <rect x="0" y="0" width="44" height="66" rx="6" fill="url(#pumpWhiteGrad)" />
          <rect x="0" y="0" width="44" height="14" rx="5" fill="url(#pumpBlueTop)" />
          {/* LED Display */}
          <rect x="6" y="20" width="32" height="18" rx="2.5" fill="#060B18" />
          <rect x="10" y="24" width="24" height="4.5" rx="1" fill="#38BDF8" opacity="0.9" />
          <rect x="10" y="31" width="14" height="3.5" rx="1" fill="#34D399" opacity="0.85" />
          {/* Nozzles */}
          <rect x="-3" y="28" width="3" height="20" rx="1.5" fill="#0F172A" />
          <path d="M-1.5 32C-6 42 -5 58 3 64" stroke="#0F172A" strokeWidth="2" fill="none" />
          <rect x="44" y="28" width="3" height="20" rx="1.5" fill="#0F172A" />
          <path d="M45.5 32C50 42 49 58 41 64" stroke="#0F172A" strokeWidth="2" fill="none" />
        </g>
      </svg>
    </div>
  );
};

export default FuelStationIllustration;
