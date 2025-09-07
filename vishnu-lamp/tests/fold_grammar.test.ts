import { describe, expect, it } from 'vitest';
import { hinge, slider, string, accordion, compose } from '../apps/lamp/src/ui/popFold';

describe('fold grammar', () => {
  it('composes primitives', () => {
    const spec = compose(hinge(1), slider(2), string(3), accordion(4));
    expect(spec.hinge).toBeDefined();
    expect(spec.slider).toBeDefined();
    expect(spec.string).toBeDefined();
    expect(spec.accordion).toBeDefined();
  });

  it('idempotent application', () => {
    const h = hinge(0.5);
    const spec = compose(h, h);
    expect(spec.hinge).toBeCloseTo(h.hinge!);
  });

  it('phi micro-dither within epsilon', () => {
    const h = hinge(1);
    expect(Math.abs(h.hinge! - 1)).toBeLessThanOrEqual(1e-3);
  });
});
