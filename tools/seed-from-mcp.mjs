// tools/seed-from-mcp.mjs — one-time seed: posts.json + img/ from MCP-fetched dataset JSON
// usage: node tools/seed-from-mcp.mjs <dataset-items.json> [outDir]
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { classifyPillar } from './scrape.mjs';

const [file, outDir = 'public/assets'] = process.argv.slice(2);
if (!file) { console.error('usage: node tools/seed-from-mcp.mjs <dataset.json>'); process.exit(1); }

const { items } = JSON.parse(await readFile(file, 'utf8'));
const posts = items.map((p) => ({
  id: p.id,
  caption: (p.caption || '').trim(),
  date: p.timestamp,
  pillar: classifyPillar(p.caption || ''),
  img: `img/${p.id}.jpg`,
  likes: p.likesCount ?? 0,
  igUrl: `https://www.instagram.com/p/${p.shortCode}/`,
}));

const imgDir = path.join(outDir, 'img');
if (!existsSync(imgDir)) await mkdir(imgDir, { recursive: true });
let ok = 0;
for (const p of posts) {
  const src = items.find((i) => i.id === p.id);
  if (!src?.displayUrl) continue;
  try {
    const r = await fetch(src.displayUrl, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    await writeFile(path.join(imgDir, `${p.id}.jpg`), Buffer.from(await r.arrayBuffer()));
    ok++;
  } catch (e) { console.warn(`Skip image ${p.id}: ${e.message}`); }
}
await writeFile(path.join(outDir, 'posts.json'), JSON.stringify(posts, null, 2));
console.log(`Wrote ${posts.length} posts, ${ok} images`);
