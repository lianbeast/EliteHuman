import { describe, it, expect } from 'vitest';
import { BANDS, zoneAt, bandCenter, bandHalf } from './bands.js';

describe('bands', () => {
  it('exports 15/40/70 boundaries', () => {
    expect(BANDS).toEqual([0.15, 0.40, 0.70]);
  });
  it('zoneAt maps progress to zone names', () => {
    expect(zoneAt(0)).toBe('body');
    expect(zoneAt(0.15)).toBe('mind');
    expect(zoneAt(0.4)).toBe('spirit');
    expect(zoneAt(0.7)).toBe('summit');
    expect(zoneAt(1)).toBe('summit');
  });
  it('bandCenter/half give sane ranges', () => {
    expect(bandCenter(0)).toBeCloseTo(0.075);
    expect(bandHalf(0)).toBeCloseTo(0.075);
    expect(bandCenter(3)).toBeCloseTo(0.85);
    expect(bandHalf(3)).toBeCloseTo(0.15);
  });
});
