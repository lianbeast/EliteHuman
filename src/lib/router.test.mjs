import { describe, it, expect } from 'vitest';
import { pathOf, searchOf, hrefTo } from './router.js';

const BASE = '/EliteHuman/';

describe('pathOf', () => {
  it('strips the vite base path', () => {
    expect(pathOf('/EliteHuman/')).toBe('/');
    expect(pathOf('/EliteHuman/archive')).toBe('/archive');
    expect(pathOf('/EliteHuman/post/123')).toBe('/post/123');
  });

  it('normalizes a trailing slash and bare root', () => {
    expect(pathOf('/EliteHuman/archive/')).toBe('/archive');
    expect(pathOf('/')).toBe('/');
    expect(pathOf('')).toBe('/');
  });

  it('passes through a base-less dev-server path', () => {
    expect(pathOf('/archive')).toBe('/archive');
  });
});

describe('searchOf', () => {
  it('pulls the query string off a route href', () => {
    expect(searchOf('/archive?pillar=IRON')).toBe('?pillar=IRON');
    expect(searchOf('/archive')).toBe('');
  });
});

describe('hrefTo', () => {
  it('re-adds the base exactly once', () => {
    expect(hrefTo('/archive')).toBe('/EliteHuman/archive');
    expect(hrefTo('/')).toBe('/EliteHuman/');
  });
});
