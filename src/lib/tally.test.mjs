import { describe, it, expect } from 'vitest';
import { easeOut, frameValue } from './tally.js';

describe('tally math', () => {
  it('easeOut(0) is 0', () => expect(easeOut(0)).toBe(0));
  it('easeOut(1) is 1', () => expect(easeOut(1)).toBe(1));
  it('easeOut is monotonic and faster than linear early', () => {
    const e = easeOut(0.5);
    expect(e).toBeGreaterThan(0.5);
    expect(e).toBeLessThan(1);
  });
  it('frameValue returns to and caps at to', () => {
    const to = 105;
    expect(frameValue(to, 1)).toBe(to);
    expect(frameValue(to, 0)).toBe(0);
    const v = frameValue(to, 0.5);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(to);
  });
  it('frameValue is monotonic', () => {
    const to = 83;
    const v0 = frameValue(to, 0);
    const v05 = frameValue(to, 0.5);
    const v1 = frameValue(to, 1);
    expect(v0).toBeLessThan(v05);
    expect(v05).toBeLessThan(v1);
  });
});
