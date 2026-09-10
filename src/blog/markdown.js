import { marked } from 'marked';

// Parse '---\nkey: value\n---\nbody' frontmatter. Returns { meta, body } or null.
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: m[2] };
}

const files = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default', eager: true });

// All posts, newest first. [{ slug, title, date, description, html }]
export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const fm = parseFrontmatter(raw);
    if (!fm) throw new Error(`posts: bad frontmatter in ${path}`);
    const slug = path.slice('/posts/'.length, -3);
    return {
      slug,
      title: fm.meta.title,
      date: fm.meta.date,
      description: fm.meta.description || '',
      html: marked.parse(fm.body),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug) => posts.find((p) => p.slug === slug);
