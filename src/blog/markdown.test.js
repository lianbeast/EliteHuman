import { describe, it, expect } from 'vitest';
import { parseFrontmatter, posts, getPost } from './markdown.js';

describe('parseFrontmatter', () => {
  it('splits meta and body', () => {
    const fm = parseFrontmatter('---\ntitle: T\ndate: 2026-01-01\n---\n\nHello');
    expect(fm.meta.title).toBe('T');
    expect(fm.meta.date).toBe('2026-01-01');
    expect(fm.body.startsWith('\nHello')).toBe(true);
  });
  it('returns null without frontmatter', () => {
    expect(parseFrontmatter('# no frontmatter')).toBeNull();
  });
});

describe('posts', () => {
  it('every post has title and YYYY-MM-DD date', () => {
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) {
      expect(p.title, p.slug).toBeTruthy();
      expect(p.date, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it('is sorted newest first', () => {
    const dates = posts.map((p) => p.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
  it('getPost round-trips a slug', () => {
    expect(getPost(posts[0].slug).slug).toBe(posts[0].slug);
  });
});
