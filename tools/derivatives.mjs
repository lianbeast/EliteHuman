// Builds the WebP derivatives the site actually serves, and drops the originals
// from the deploy. Sources stay in git — they are the archive.
//
//   node tools/derivatives.mjs
//
// Idempotent: an existing derivative is skipped, so re-running after a scraper
// refresh only pays for new posts.

import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { join } from 'node:path';

const run = promisify(execFile);

const ROOT = new URL('..', import.meta.url).pathname;
const IMG = join(ROOT, 'public/assets/img');
const OUT = join(IMG, 'w');
const SHOP = join(IMG, 'shop');
const BRAND = join(ROOT, 'public/brand');

// Two tiers for a grid cell that is at most ~350 CSS px wide at 2x, and the
// source width itself for the post figure and lightbox. Anything wider than
// the source is a lie the browser would charge us for.
const WIDTHS = [400, 800];

const TIERS = (srcWidth) =>
  [...new Set([...WIDTHS.filter((w) => w < srcWidth), srcWidth])].sort((a, b) => a - b);

const postId = (post) => post.img.replace(/.*?([\w-]+)\.\w+$/, '$1');

const exists = (p) => stat(p).then(() => true, () => false);

async function width(file) {
  const { stdout } = await run('magick', ['identify', '-format', '%w', `${file}[0]`]);
  return Number(stdout);
}

async function toWebp(src, out, w) {
  await run('magick', [src, '-resize', `${w}x`, '-quality', '80', '-define', 'webp:method=6', '-strip', out]);
}

const tiers = {};
await mkdir(OUT, { recursive: true });
let made = 0;
let skipped = 0;

const posts = JSON.parse(await readFile(join(ROOT, 'public/assets/posts.json'), 'utf8'));
for (const post of posts) {
  const src = join(ROOT, 'public/assets', post.img);
  // A record without a photograph is a scrape miss, and an empty tier list
  // reads downstream as `-undefined.webp` — a 404 on every route that shows
  // it. Fail here, where the cause is nameable, rather than ship it.
  if (!(await exists(src))) {
    throw new Error(`no source image for ${post.img} — re-scrape, or drop the record`);
  }
  const w = await width(src);
  if (w < WIDTHS[0]) {
    // Too small to resize down to a grid tier, but it still needs a served
    // file — named for its own width like every other tier, since the URL is
    // built from the width alone.
    tiers[post.img] = [w];
    for (const t of tiers[post.img]) {
      const out = join(OUT, `${postId(post)}-${t}.webp`);
      if (await exists(out)) {
        skipped += 1;
        continue;
      }
      await toWebp(src, out, t);
      made += 1;
    }
    continue;
  }
  tiers[post.img] = TIERS(w);
  for (const t of tiers[post.img]) {
    const out = join(OUT, `${postId(post)}-${t}.webp`);
    if (await exists(out)) {
      skipped += 1;
      continue;
    }
    await toWebp(src, out, t);
    made += 1;
  }
}

// Shop squares: 640w serves the product cards, the source serves the detail
// page, which is the widest image on the site.
for (const file of (await readdir(SHOP)).filter((f) => f.endsWith('.jpg'))) {
  const base = file.replace(/\.\w+$/, '');
  const w = await width(join(SHOP, file));
  for (const t of [...new Set([640, w])].filter((t) => t <= w).sort((a, b) => a - b)) {
    const out = join(OUT, `shop-${base}-${t}.webp`);
    if (await exists(out)) {
      skipped += 1;
      continue;
    }
    await toWebp(join(SHOP, file), out, t);
    made += 1;
  }
}

// The lockup renders 42px tall in the header, 112px in the footer, 320px wide on
// the profile. 320w and 640w cover all three at 2x, from a 216 KB PNG.
for (const [w, name] of [[320, 'logo-320.webp'], [640, 'logo-640.webp']]) {
  const out = join(BRAND, name);
  if (await exists(out)) {
    skipped += 1;
    continue;
  }
  await run('magick', [join(BRAND, 'logo.png'), '-resize', `${w}x`, '-quality', '80', '-define',
    'webp:method=6', '-strip', out]);
  made += 1;
}

await writeFile(join(ROOT, 'src/tiers.json'), JSON.stringify(tiers));
console.log(`derived ${made} (${skipped} already current) · ${Object.keys(tiers).length} posts mapped`);
