// Post data lives in public/assets/posts.json (105 records scraped from
// @elitehuman). This module is the single read path for it.

const BASE = import.meta.env.BASE_URL;

let cache = null;

export async function loadPosts() {
  if (!cache) {
    const res = await fetch(`${BASE}assets/posts.json`);
    if (!res.ok) throw new Error(`posts.json ${res.status}`);
    const list = await res.json();
    // Newest first — the archive reads chronologically backwards from today.
    // `no` is the archive's own index, not the Instagram id.
    cache = [...list]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((p, i) => ({ ...p, no: String(i + 1).padStart(3, '0') }));
  }
  return cache;
}

export const imageUrl = (post) => `${BASE}assets/${post.img}`;

export const PILLARS = [
  {
    key: 'IRON',
    count: 83,
    blurb: 'Lifts, physique, the days you showed up anyway.',
  },
  {
    key: 'MIND',
    count: 20,
    blurb: 'Focus, ambition, the work behind the work.',
  },
  {
    key: 'SPIRIT',
    count: 2,
    blurb: 'Faith, breath, gratitude.',
  },
];

// Featured on home: one post per pillar with a usable sample.
export const FEATURED = [
  '1898879513073556510',
  '1872550099511803215',
  '1873324442688852446',
  '1901074259145668794',
];

export const IG_URL = 'https://www.instagram.com/elitehuman/';

// Brand motto. Set as live text, never baked into the logo PNG — the lockup
// has to stay legible, and the raster is brand-supplied artwork we don't crop.
// Authored verbatim by the brand, including its grammar. Do not "correct".
export const MOTTO = 'Your Limits Is Your Mentality';
