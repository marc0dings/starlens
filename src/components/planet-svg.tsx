import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { PlanetVisual } from '@/data/planets';

interface PlanetSvgProps {
  visual: PlanetVisual;
  size?: number;
}

export function PlanetSvg({ visual, size = 100 }: PlanetSvgProps) {
  const gradientId = `planet-gradient-${useId()}`;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id={gradientId} cx="35%" cy="30%" r="75%">
          <Stop offset="0%" stopColor={visual.colorAlt} stopOpacity={1} />
          <Stop offset="100%" stopColor={visual.color} stopOpacity={1} />
        </RadialGradient>
      </Defs>
      {visual.hasRings && (
        <Ellipse
          cx={cx}
          cy={cy}
          rx={r * 1.9}
          ry={r * 0.5}
          stroke={visual.colorAlt}
          strokeWidth={r * 0.12}
          fill="none"
          opacity={0.6}
        />
      )}
      <Circle cx={cx} cy={cy} r={r} fill={`url(#${gradientId})`} />
    </Svg>
  );
}
