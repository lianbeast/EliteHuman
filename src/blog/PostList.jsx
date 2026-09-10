import { posts } from './markdown.js';

const fmt = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function PostList() {
  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto', padding: 'var(--space-6) var(--space-4) var(--space-5)' }}>
      <header style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(3rem, 8vw, 5rem)',
          letterSpacing: '0.02em', margin: 0, lineHeight: 1,
        }}>ELITEHUMAN</h1>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em',
          color: 'var(--ink-soft)', margin: 'var(--space-3) 0 0',
        }}>TRAINING JOURNAL — BODY · MIND · SPIRIT</p>
      </header>

      <main>
        {posts.length === 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>No posts yet.</p>
        )}
        {posts.map((p) => (
          <article key={p.slug} style={{ padding: 'var(--space-4) 0', borderTop: '1px solid var(--rule)' }}>
            <a href={`/post/${p.slug}`} className="post-link" style={{ textDecoration: 'none' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', margin: '0 0 var(--space-2)',
                lineHeight: 1.2, color: 'var(--ink)',
              }}>{p.title}</h2>
            </a>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--ink-soft)', marginBottom: 'var(--space-2)' }}>
              {fmt(p.date)}
            </div>
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--ink)' }}>{p.description}</p>
          </article>
        ))}
      </main>

      <footer style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--rule)' }}>
        <a href="/archive" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--accent)' }}>
          THE 105 MARKS →
        </a>
      </footer>
    </div>
  );
}
