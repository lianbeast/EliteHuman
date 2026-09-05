import { describe, it, expect } from 'vitest';
import { parsePosts, classifyPillar } from './scrape.mjs';

describe('parsePosts', () => {
  it('maps actor output → posts.json shape', () => {
    const actorOut = [{
      id: '2223713079',
      username: 'elitehuman',
      latestPosts: [
        { id: 'p1', caption: 'We create our own circumstances.', timestamp: '2018-11-24T23:44:18.000Z', displayUrl: 'https://x/1.jpg', likesCount: 42, shortCode: 'abc' },
        { id: 'p2', caption: 'Breathe. Meditate. Happy Friday!', timestamp: '2018-09-21T13:48:17.000Z', displayUrl: 'https://x/2.jpg', likesCount: 20, shortCode: 'def' },
        { id: 'p3', caption: 'Just a flex shot.', timestamp: '2018-09-19T12:59:19.000Z', displayUrl: 'https://x/3.jpg', likesCount: 28, shortCode: 'ghi' },
      ],
    }];
    const posts = parsePosts(actorOut);
    expect(posts).toHaveLength(3);
    expect(posts[0]).toMatchObject({ id: 'p1', pillar: 'MIND', img: 'img/p1.jpg', igUrl: 'https://www.instagram.com/p/abc/' });
    expect(posts[1].pillar).toBe('SPIRIT');
    expect(posts[2].pillar).toBe('IRON');
  });
});

describe('classifyPillar', () => {
  it('returns IRON/MIND/SPIRIT based on caption keywords', () => {
    expect(classifyPillar('faith vibrations breathe meditate')).toBe('SPIRIT');
    expect(classifyPillar('gym grind gains workout')).toBe('IRON');
    expect(classifyPillar('mindset focus hustle')).toBe('MIND');
  });
});
