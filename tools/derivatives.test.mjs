// src/data.js turns an empty tier list into `-undefined.webp`, and the URL it
// builds is `<id>-<width>.webp` — a tier that names a file the converter never
// wrote is a 404 on every route showing the post. This guards the map the
// bundler reads against the files actually on disk.
import { describe, it, expect } from 'vitest';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = async (p) => JSON.parse(await readFile(join(ROOT, p), 'utf8'));
const postId = (img) => img.replace(/.*?([\w-]+)\.\w+$/, '$1');

describe('tiers.json', () => {
  it('covers every post with a non-empty width list', async () => {
    const posts = await read('public/assets/posts.json');
    const tiers = await read('src/tiers.json');
    expect(posts.filter((p) => !tiers[p.img]?.length).map((p) => p.img)).toEqual([]);
  });

  it('has no entry for a post that no longer exists', async () => {
    const posts = await read('public/assets/posts.json');
    const tiers = await read('src/tiers.json');
    const known = new Set(posts.map((p) => p.img));
    expect(Object.keys(tiers).filter((k) => !known.has(k))).toEqual([]);
  });

  it('names a file that exists for every width it lists', async () => {
    const tiers = await read('src/tiers.json');
    const missing = [];
    for (const [img, widths] of Object.entries(tiers)) {
      for (const w of widths) {
        const f = join(ROOT, 'public/assets/img/w', `${postId(img)}-${w}.webp`);
        if (!(await stat(f).catch(() => false))) missing.push(`${img} @${w}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
