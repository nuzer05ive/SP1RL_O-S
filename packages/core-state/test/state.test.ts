import { expect, test } from 'vitest';
import { useSpiralState } from '../src/index';

test('tick updates selectors', () => {
  const { tick } = useSpiralState.getState();
  tick();
  expect(useSpiralState.getState().node).toBe(1);
});
