import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

interface StarLensMarkProps {
  size?: number;
}

/** The StarLens brand mark: a four-pointed star inside a lens ring. */
export function StarLensMark({ size = 76 }: StarLensMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="starlensGlow" cx="50%" cy="42%" r="65%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="55%" stopColor="#CFC8FF" stopOpacity={1} />
          <Stop offset="100%" stopColor="#8B7CFA" stopOpacity={1} />
        </RadialGradient>
      </Defs>
      <Circle cx={50} cy={50} r={46} fill="none" stroke="#8B7CFA" strokeOpacity={0.55} strokeWidth={3} />
      <Path
        d="M50 12 L58 42 L88 50 L58 58 L50 88 L42 58 L12 50 L42 42 Z"
        fill="url(#starlensGlow)"
      />
      <Circle cx={50} cy={50} r={6.5} fill="#FFFFFF" />
    </Svg>
  );
}
