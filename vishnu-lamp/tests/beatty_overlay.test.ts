import { expect, it } from 'vitest';
import { beattyOverlay } from '../apps/lamp/src/pages/Witness';
import { beattyFront, beattyBack } from '@vishnu/core';

it('overlay indices match beatty sequences', () => {
  const k = 256;
  const overlay = beattyOverlay(k);
  expect(overlay.front).toEqual(beattyFront(k));
  expect(overlay.back).toEqual(beattyBack(k));
});
