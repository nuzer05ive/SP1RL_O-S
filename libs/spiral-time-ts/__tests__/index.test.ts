import { getJulianDay, lap, wobble, overlap, solveSpiralTime } from '../index';

test('julian day works', () => {
  expect(getJulianDay('1970-01-02')).toBe(1);
});

test('lap calculation', () => {
  expect(lap(90)).toBe(1);
});

test('wobble and overlap positive', () => {
  const w = wobble(2);
  const o = overlap(2);
  expect(w).toBeGreaterThan(0);
  expect(o).toBeCloseTo(2 * Math.pow((1 + Math.sqrt(5)) / 2, -3));
});

test('solver output', () => {
  const res = solveSpiralTime(0);
  expect(res).toHaveProperty('seconds');
  expect(res).toHaveProperty('clock');
});
