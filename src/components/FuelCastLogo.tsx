import React from 'react';

interface FuelCastLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
  textColor?: string;
}

export const FuelCastLogo: React.FC<FuelCastLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  iconOnly = false,
  textColor,
}) => {
  const sizeMap = {
    sm: { iconSize: 28, fontSize: '18px', taglineSize: '10px', gap: '8px' },
    md: { iconSize: 38, fontSize: '24px', taglineSize: '12px', gap: '10px' },
    lg: { iconSize: 48, fontSize: '30px', taglineSize: '13px', gap: '12px' },
    xl: { iconSize: 58, fontSize: '38px', taglineSize: '15px', gap: '14px' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`fuelcast-brand ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        userSelect: 'none',
      }}
    >
      {/* Precision Vector FuelCast Droplet Icon */}
      <svg
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.45))' }}
      >
        <defs>
          {/* Droplet Body Gradient */}
          <linearGradient id="dropletGrad" x1="50" y1="8" x2="50" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="35%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>

          {/* Droplet Outline Glow */}
          <linearGradient id="dropletStroke" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>

          {/* Orbit Swoosh Gradient (Orange to Purple) */}
          <linearGradient id="swooshGrad" x1="8" y1="86" x2="92" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="40%" stopColor="#EC4899" />
            <stop offset="85%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          {/* Chart Bars Gradient */}
          <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>

        {/* Droplet Silhouette */}
        <path
          d="M50 10C50 10 22 46 22 66C22 81.464 34.536 92 50 92C65.464 92 78 81.464 78 66C78 46 50 10 50 10Z"
          fill="url(#dropletGrad)"
          stroke="url(#dropletStroke)"
          strokeWidth="2.5"
        />

        {/* Upward Fuel Bar Chart */}
        <rect x="33" y="66" width="7" height="15" rx="2" fill="url(#barGrad1)" />
        <rect x="44" y="58" width="7" height="23" rx="2" fill="url(#barGrad2)" />
        <rect x="55" y="48" width="7" height="33" rx="2" fill="url(#barGrad3)" />

        {/* Trend Forecast Line */}
        <path
          d="M32 70L45 61L58 48L68 38"
          stroke="#F8FAFC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Glowing Peak Dot on Trend Line */}
        <circle cx="68" cy="38" r="4" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Dynamic Refill Orbital Swoosh Ring */}
        <path
          d="M12 78C12 78 30 94 65 88C88 84 94 68 85 55C80 47 70 45 62 48"
          stroke="url(#swooshGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.75))' }}
        />
      </svg>

      {/* Brand Typography & Tagline */}
      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
            <span
              style={{
                fontSize: currentSize.fontSize,
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: textColor || 'var(--text-primary)',
                fontFamily: "'Inter', sans-serif",
                transition: 'color 0.25s ease',
              }}
            >
              Fuel
            </span>
            <span
              style={{
                fontSize: currentSize.fontSize,
                fontWeight: 800,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(135deg, #38BDF8 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Cast
            </span>
            <span
              style={{
                fontSize: currentSize.fontSize,
                fontWeight: 900,
                color: '#F97316',
                lineHeight: 1,
              }}
            >
              .
            </span>
          </div>

          {showTagline && (
            <span
              style={{
                fontSize: currentSize.taglineSize,
                fontWeight: 700,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--text-secondary, #94A3B8)',
                marginTop: '4px',
                fontFamily: "'Inter', sans-serif",
                transition: 'color 0.25s ease',
              }}
            >
              Predict. Plan. Refill.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FuelCastLogo;
