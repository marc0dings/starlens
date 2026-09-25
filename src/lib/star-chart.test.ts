import { WORLD_HEIGHT, WORLD_WIDTH, worldPosition } from './star-chart';

describe('worldPosition', () => {
  it('maps right ascension 0h/24h to the world edges', () => {
    expect(worldPosition(0, 0).x).toBeCloseTo(0);
    expect(worldPosition(24, 0).x).toBeCloseTo(WORLD_WIDTH);
  });

  it('maps the celestial poles to the top/bottom edges and the equator to the middle', () => {
    expect(worldPosition(0, 90).y).toBeCloseTo(0);
    expect(worldPosition(0, -90).y).toBeCloseTo(WORLD_HEIGHT);
    expect(worldPosition(0, 0).y).toBeCloseTo(WORLD_HEIGHT / 2);
  });

  it('is monotonic in both axes', () => {
    const a = worldPosition(5, 10);
    const b = worldPosition(10, -10);
    expect(b.x).toBeGreaterThan(a.x);
    expect(b.y).toBeGreaterThan(a.y);
  });
});
