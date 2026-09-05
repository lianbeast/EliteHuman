import { describe, it, expect } from 'vitest';
import { clamp01, smoothstep, smootherstep, lerp, map } from './easing.js';

describe('easing', () => {
  it('clamp01', () => { expect(clamp01(-0.5)).toBe(0); expect(clamp01(1.5)).toBe(1); expect(clamp01(0.4)).toBe(0.4); });
  it('smoothstep endpoints', () => { expect(smoothstep(0)).toBe(0); expect(smoothstep(1)).toBe(1); });
  it('smootherstep endpoints', () => { expect(smootherstep(0)).toBe(0); expect(smootherstep(1)).toBe(1); });
  it('lerp', () => { expect(lerp(0, 10, 0.25)).toBe(2.5); });
  it('map', () => { expect(map(0.5, 0, 1, 0, 100)).toBe(50); });
});
