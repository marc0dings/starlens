import Svg, { Circle, Line } from 'react-native-svg';

import { Night } from '@/constants/theme';
import { Constellation } from '@/data/constellations';

interface ConstellationSvgProps {
  constellation: Constellation;
  size?: number;
  starColor?: string;
  lineColor?: string;
}

function radiusForMagnitude(mag: number) {
  const r = 4.4 - mag * 0.55;
  return Math.max(1.4, Math.min(4.5, r));
}

/**
 * Renders a self-contained line-art illustration of a constellation, normalized to fit
 * `size` regardless of where the constellation actually sits on the celestial sphere.
 */
export function ConstellationSvg({
  constellation,
  size = 120,
  starColor = Night.star,
  lineColor = Night.line,
}: ConstellationSvgProps) {
  const { stars, lines } = constellation;
  const decs = stars.map((s) => s.dec);
  const minDec = Math.min(...decs);
  const maxDec = Math.max(...decs);
  const midDec = (minDec + maxDec) / 2;

  // Right ascension is in hours (0–24) and declination in degrees (–90–90) — they are
  // not directly comparable. Convert RA to degrees of arc (×15) and shrink it by
  // cos(dec) to account for RA circles narrowing away from the celestial equator,
  // otherwise the illustration comes out squashed into a thin sliver.
  const cosMidDec = Math.cos((midDec * Math.PI) / 180);
  const rasDeg = stars.map((s) => s.ra * 15 * cosMidDec);
  const minRaDeg = Math.min(...rasDeg);
  const maxRaDeg = Math.max(...rasDeg);
  const midRaDeg = (minRaDeg + maxRaDeg) / 2;

  const padding = size * 0.18;
  const spanRaDeg = Math.max(maxRaDeg - minRaDeg, 4);
  const spanDec = Math.max(maxDec - minDec, 4);
  const scale = Math.min((size - 2 * padding) / spanRaDeg, (size - 2 * padding) / spanDec);

  function toXY(ra: number, dec: number) {
    return {
      x: size / 2 - (ra * 15 * cosMidDec - midRaDeg) * scale,
      y: size / 2 - (dec - midDec) * scale,
    };
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {lines.map(([a, b], index) => {
        const pa = toXY(stars[a].ra, stars[a].dec);
        const pb = toXY(stars[b].ra, stars[b].dec);
        return (
          <Line
            key={index}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={lineColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}
      {stars.map((star, index) => {
        const p = toXY(star.ra, star.dec);
        return <Circle key={index} cx={p.x} cy={p.y} r={radiusForMagnitude(star.mag)} fill={starColor} />;
      })}
    </Svg>
  );
}
