import { Body } from 'astronomy-engine';

import {
  angleDiffDeg,
  getBodyHorizontalCoords,
  getStarHorizontalCoords,
  projectToScreen,
} from './astronomy';

describe('angleDiffDeg', () => {
  it('returns 0 for identical angles', () => {
    expect(angleDiffDeg(0, 0)).toBe(0);
    expect(angleDiffDeg(123.4, 123.4)).toBeCloseTo(0);
  });

  it('wraps around the 0°/360° boundary the short way', () => {
    expect(angleDiffDeg(350, 10)).toBeCloseTo(20);
    expect(angleDiffDeg(10, 350)).toBeCloseTo(-20);
  });

  it('always stays within (-180, 180]', () => {
    for (let a = 0; a < 360; a += 37) {
      for (let b = 0; b < 360; b += 53) {
        const diff = angleDiffDeg(a, b);
        expect(diff).toBeGreaterThan(-180);
        expect(diff).toBeLessThanOrEqual(180);
      }
    }
  });

  it('is antisymmetric', () => {
    expect(angleDiffDeg(30, 100)).toBeCloseTo(-angleDiffDeg(100, 30));
  });
});

describe('projectToScreen', () => {
  it('projects the exact direction the device points at to the origin', () => {
    const { x, y } = projectToScreen(123, 45, 123, 45);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });

  it('maps altitude differences straight to y, independent of azimuth', () => {
    const { y } = projectToScreen(200, 50, 200, 40);
    expect(y).toBeCloseTo(10);
  });

  it('compresses azimuth differences by cos(centerAlt) (gnomonic projection)', () => {
    const atEquator = projectToScreen(110, 0, 100, 0);
    expect(atEquator.x).toBeCloseTo(10);

    const at60Deg = projectToScreen(110, 60, 100, 60);
    expect(at60Deg.x).toBeCloseTo(10 * Math.cos((60 * Math.PI) / 180));
  });

  it('handles azimuth wraparound near 0°/360°', () => {
    const { x } = projectToScreen(5, 0, 355, 0);
    expect(x).toBeCloseTo(10);
  });
});

const VIENNA = { latitude: 48.2082, longitude: 16.3738 };

describe('getStarHorizontalCoords', () => {
  it('returns azimuth/altitude within their valid ranges', () => {
    // Betelgeuse
    const { azimuth, altitude } = getStarHorizontalCoords(5.919, 7.407, VIENNA, new Date('2024-06-01T22:00:00Z'));
    expect(azimuth).toBeGreaterThanOrEqual(0);
    expect(azimuth).toBeLessThan(360);
    expect(altitude).toBeGreaterThanOrEqual(-90);
    expect(altitude).toBeLessThanOrEqual(90);
  });

  it('places Polaris close to the observer latitude in altitude, near due north', () => {
    const { azimuth, altitude } = getStarHorizontalCoords(2.53, 89.264, VIENNA, new Date('2024-06-01T22:00:00Z'));
    expect(altitude).toBeGreaterThan(40);
    expect(altitude).toBeLessThan(56);
    expect(Math.min(azimuth, 360 - azimuth)).toBeLessThan(5);
  });
});

describe('getBodyHorizontalCoords', () => {
  it('returns azimuth/altitude within their valid ranges for the Sun', () => {
    const { azimuth, altitude } = getBodyHorizontalCoords(Body.Sun, VIENNA, new Date('2024-06-01T12:00:00Z'));
    expect(azimuth).toBeGreaterThanOrEqual(0);
    expect(azimuth).toBeLessThan(360);
    expect(altitude).toBeGreaterThanOrEqual(-90);
    expect(altitude).toBeLessThanOrEqual(90);
  });

  it('puts the sun high in the sky around midday in June at mid-latitude', () => {
    const { altitude } = getBodyHorizontalCoords(Body.Sun, VIENNA, new Date('2024-06-21T10:00:00Z'));
    expect(altitude).toBeGreaterThan(40);
  });

  it('puts the sun below the horizon at midnight', () => {
    const { altitude } = getBodyHorizontalCoords(Body.Sun, VIENNA, new Date('2024-06-21T23:30:00Z'));
    expect(altitude).toBeLessThan(0);
  });
});
