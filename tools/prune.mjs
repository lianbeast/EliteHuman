// Drops the archive sources from the build. public/assets/img/*.jpg and
// brand/logo.png stay in git — they are the record, and the scraper overwrites
// them — but nothing links to them any more, so shipping them is dead weight.
//
//   node tools/prune.mjs   (runs as part of `npm run build`)

import { readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');

const drop = async (p) => {
  const size = await stat(p).then((s) => s.size).catch(() => 0);
  await rm(p, { force: true });
  return size;
};

let freed = 0;
for (const file of await readdir(join(DIST, 'assets/img')).catch(() => [])) {
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) freed += await drop(join(DIST, 'assets/img', file));
}
for (const file of await readdir(join(DIST, 'assets/img/shop')).catch(() => [])) {
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) freed += await drop(join(DIST, 'assets/img/shop', file));
}
freed += await drop(join(DIST, 'brand/logo.png'));

console.log(`✓ pruned ${(freed / 1024 / 1024).toFixed(1)} MB of archive sources from dist`);
