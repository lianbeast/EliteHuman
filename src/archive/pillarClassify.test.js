import { describe, it, expect } from 'vitest';
import { classifyPillar } from './pillarClassify.js';

describe('classifyPillar', () => {
  it('IRON', () => expect(classifyPillar('gym grind gains')).toBe('IRON'));
  it('MIND', () => expect(classifyPillar('mindset focus')).toBe('MIND'));
  it('SPIRIT', () => expect(classifyPillar('faith meditate universe')).toBe('SPIRIT'));
  it('default MIND on empty', () => expect(classifyPillar('')).toBe('MIND'));
});
