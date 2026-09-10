import { getPost, posts } from './markdown.js';

const fmt = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Adjacent posts in the sorted list (posts are newest-first).
const adjacent = (slug) => {
  const i = posts.findIndex((p) => p.slug === slug);
  return { newer: posts[i - 1], older: posts[i + 1] };
};

export default function Post({ slug }) {
  const post = getPost(slug);
  if (!post) {
    return (
      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
        <p style={{ fontFamily: 'var(--font-mono)' }}>No such post.</p>
        <a href="/" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>← Back to the journal</a>
      </div>
    );
  }
  const { newer, older } = adjacent(slug);
  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto', padding: 'var(--space-5) var(--space-4) var(--space-5)' }}>
      <nav style={{ marginBottom: 'var(--space-4)' }}>
        <a href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--accent)' }}>← ELITEHUMAN</a>
      </nav>
      <article>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', margin: '0 0 var(--space-3)', lineHeight: 1.1,
        }}>{post.title}</h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--ink-soft)', marginBottom: 'var(--space-4)' }}>
          {fmt(post.date)}
        </div>
        {/* markdown body — authored in-repo, sanitized by marked's default escapes */}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <nav style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        {older ? <a href={`/post/${older.slug}`} style={{ color: 'var(--accent)' }}>← {older.title}</a> : <span />}
        {newer ? <a href={`/post/${newer.slug}`} style={{ color: 'var(--accent)', textAlign: 'right' }}>{newer.title} →</a> : <span />}
      </nav>
    </div>
  );
}
