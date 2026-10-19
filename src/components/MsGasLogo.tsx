import React from 'react';

interface MsGasLogoProps {
  variant?: 'color' | 'dark' | 'white' | 'symbol';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withKorean?: boolean;
  className?: string;
}

export const MsGasLogo: React.FC<MsGasLogoProps> = ({
  variant = 'color',
  size = 'md',
  withKorean = true,
  className = '',
}) => {
  // Dimensions
  const heightMap = {
    sm: 26,
    md: 36,
    lg: 48,
    xl: 60,
  };

  const h = heightMap[size];

  // Colors based on variant
  const isDark = variant === 'dark' || variant === 'white';
  const tealColor = isDark ? '#FFFFFF' : '#0D6F8F';
  const gasColor = isDark ? '#FFFFFF' : '#2E2E2E';
  const subtextColor = isDark ? '#DCE2E8' : '#2E2E2E';
  const orbitAccent = isDark ? '#F8D94F' : '#0D6F8F';

  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 100 80"
        style={{ height: `${h}px`, width: `${(h * 100) / 80}px` }}
        className={`shrink-0 ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dynamic Orbital Swoosh Arc */}
        <path
          d="M 12 62 C 2 34 32 6 72 10 C 90 12 96 22 92 34 C 88 44 76 52 64 56 C 42 62 26 50 28 38 C 29 32 35 28 42 28 C 54 28 62 38 58 48 C 55 54 48 56 42 56"
          stroke={tealColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Stylized M */}
        <path
          d="M 24 58 L 34 22 L 48 44 L 58 22 L 68 58"
          stroke={tealColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stylized S */}
        <path
          d="M 86 30 C 84 24 76 22 70 24 C 64 26 62 31 66 36 C 70 41 82 43 82 50 C 82 56 74 60 66 58 C 58 56 56 50 56 48"
          stroke={tealColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 260 76"
        style={{ height: `${h}px`, width: `${(h * 260) / 76}px` }}
        className="shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="msTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#5EE2FF' : '#0D6F8F'} />
            <stop offset="100%" stopColor={isDark ? '#FFFFFF' : '#084C62'} />
          </linearGradient>
          <linearGradient id="msYellowAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F8D94F" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* --- Graphic Orbital Loop around MS --- */}
        <path
          d="M 12 58 C -4 30 26 4 68 8 C 86 10 94 20 89 32 C 85 41 73 48 60 52 C 40 57 26 46 28 35 C 29 29 35 25 42 25"
          stroke="url(#msTealGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Yellow Accent arc flick */}
        <path
          d="M 62 10 Q 76 13 84 20"
          stroke="url(#msYellowAccent)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* --- MS Emblem (Italic, dynamic industrial aesthetic) --- */}
        <g transform="skewX(-14)">
          {/* M letter */}
          <path
            d="M 28 60 L 36 20 L 51 44 L 62 20 L 70 60"
            stroke="url(#msTealGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* S letter */}
          <path
            d="M 88 28 C 85 22 77 20 71 22 C 64 24 63 30 67 35 C 72 40 85 42 85 50 C 85 57 77 61 68 59 C 60 57 57 51 57 48"
            stroke="url(#msTealGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* --- GAS Typography (Bold Modern Grotesque) --- */}
        <text
          x="112"
          y="56"
          fill={gasColor}
          fontFamily="'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="48"
          fontWeight="900"
          letterSpacing="0.5px"
        >
          GAS
        </text>

        {/* --- 엠에스가스 (Korean Brand Name) --- */}
        {withKorean && (
          <text
            x="114"
            y="72"
            fill={subtextColor}
            fontFamily="'Pretendard Variable', Pretendard, 'Noto Sans KR', sans-serif"
            fontSize="14"
            fontWeight="800"
            letterSpacing="-0.3px"
          >
            엠에스가스
          </text>
        )}
      </svg>
    </div>
  );
};
