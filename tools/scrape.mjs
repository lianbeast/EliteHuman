// tools/scrape.mjs
import { ApifyClient } from 'apify-client';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PILLAR_KEYWORDS = {
  IRON:  ['gym', 'workout', 'gain', 'flex', 'bicep', 'shred', 'abs', 'muscle', 'fitness', 'bodybuilding', 'fitfam', 'lift', 'iron'],
  MIND:  ['mindset', 'focus', 'hustle', 'grind', 'ordinary', 'greatness', 'game face', 'wake', 'create', 'circumstances'],
  SPIRIT:['faith', 'breathe', 'meditate', 'blessed', 'vibration', 'universe', 'spiritual', 'gratitude', 'pray', 'soul', 'journey'],
};

export function classifyPillar(caption = '') {
  const text = caption.toLowerCase();
  const scores = { IRON: 0, MIND: 0, SPIRIT: 0 };
  for (const [pillar, words] of Object.entries(PILLAR_KEYWORDS)) {
    for (const w of words) if (text.includes(w)) scores[pillar]++;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] === 0 ? 'MIND' : best[0]; // default to MIND if nothing matches
}

export function parsePosts(actorOutput) {
  const profile = actorOutput[0];
  if (!profile?.latestPosts) return [];
  return profile.latestPosts.map((p) => ({
    id: p.id,
    caption: (p.caption || '').trim(),
    date: p.timestamp,
    pillar: classifyPillar(p.caption || ''),
    img: `img/${p.id}.jpg`,
    likes: p.likesCount ?? 0,
    igUrl: `https://www.instagram.com/p/${p.shortCode}/`,
  }));
}

async function downloadImage(url, dest) {
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`Failed ${url}: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(dest, buf);
}

export async function runScrape({ user = 'elitehuman', token, outDir = 'public/assets' } = {}) {
  if (!token) throw new Error('APIFY_TOKEN required');
  const client = new ApifyClient({ token });
  const run = await client.actor('apify/instagram-profile-scraper').call({
    usernames: [user],
    resultsType: 'posts',
    resultsLimit: 200,
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  const posts = parsePosts(items);
  const imgDir = path.join(outDir, 'img');
  if (!existsSync(imgDir)) await mkdir(imgDir, { recursive: true });
  const enriched = await Promise.all(posts.map(async (post) => {
    const source = items[0].latestPosts.find((p) => p.id === post.id);
    if (!source?.displayUrl) return post;
    try {
      await downloadImage(source.displayUrl, path.join(imgDir, `${post.id}.jpg`));
    } catch (e) {
      console.warn(`Skip image ${post.id}:`, e.message);
    }
    return post;
  }));
  await writeFile(path.join(outDir, 'posts.json'), JSON.stringify(enriched, null, 2));
  return enriched;
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const token = process.env.APIFY_TOKEN;
  if (!token) { console.error('Set APIFY_TOKEN'); process.exit(1); }
  runScrape({ token }).then((p) => { console.log(`Wrote ${p.length} posts`); process.exit(0); })
    .catch((e) => { console.error(e); process.exit(1); });
}
