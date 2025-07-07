import { expect, test } from 'vitest';
import { theta } from '../src/index';

test('theta accuracy', () => {
  expect(Math.abs(theta(88, 1) - 0)).toBeLessThanOrEqual(1e-8);
});
