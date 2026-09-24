/**
 * A static, pannable all-sky chart uses a simple equirectangular projection:
 * right ascension maps to x, declination maps to y, independent of observer time/location.
 */
export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 1200;

export function worldPosition(ra: number, dec: number): { x: number; y: number } {
  return {
    x: (ra / 24) * WORLD_WIDTH,
    y: ((90 - dec) / 180) * WORLD_HEIGHT,
  };
}
