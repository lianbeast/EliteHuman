// Post data lives in public/assets/posts.json (105 records scraped from
// @elitehuman). This module is the single read path for it.

const BASE = import.meta.env.BASE_URL;

let cache = null;

// Retry fetch with exponential backoff for transient network errors.
async function fetchWithRetry(url, retries = 2) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise((r) => setTimeout(r, 300 * (3 - retries)));
    return fetchWithRetry(url, retries - 1);
  }
}

export async function loadPosts() {
  if (!cache) {
    const list = await fetchWithRetry(`${BASE}assets/posts.json`);
    // Newest first — the archive reads chronologically backwards from today.
    // `no` is the archive's own index, not the Instagram id.
    cache = [...list]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((p, i) => ({ ...p, no: String(i + 1).padStart(3, '0') }));
  }
  return cache;
}

// Widths each photograph was converted to, by tools/derivatives.mjs. Bundled
// rather fetched: 4 KB in the JS, and no render race for the map to arrive.
import TIERS from './tiers.json';

const url = (img, w) => `${BASE}assets/img/w/${img.replace(/.*?([\w-]+)\.\w+$/, '$1')}-${w}.webp`;

/** `sizes` for a grid cell. Mirrors the .grid breakpoints in styles.css: two
 *  columns below 768px, three to 1280px, four above. */
export const gridSizes = '(max-width: 767px) 46vw, (max-width: 1279px) 31vw, 23vw';

/** Every tier, for the browser to choose from with `sizes`. */
export const srcSet = (post) => TIERS[post.img].map((w) => `${url(post.img, w)} ${w}w`).join(', ');

/** Largest tier — the post figure and the lightbox, the two widest images. */
export const imageUrlFull = (post) => url(post.img, TIERS[post.img].at(-1));

/** Grid cell. `src` is the 800w tier; the `srcSet` above it lets a phone
 *  settle for 400w instead of paying for both. */
export const imageUrl = (post) => url(post.img, TIERS[post.img].at(-2) ?? TIERS[post.img].at(-1));

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
