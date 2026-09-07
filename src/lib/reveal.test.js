import { describe, it, expect } from 'vitest';
import { splitWords, staggerDelay } from './reveal.js';

describe('reveal utils', () => {
  it('splits into words', () => {
    expect(splitWords('Wake up. Game face on.')).toEqual(['Wake', 'up.', 'Game', 'face', 'on.']);
  });
  it('stagger steps by 60ms', () => {
    expect(staggerDelay(0)).toBe(0);
    expect(staggerDelay(3)).toBe(180);
  });
});
