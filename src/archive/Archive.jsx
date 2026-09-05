import { useEffect, useState } from 'react';
import Grid from './Grid.jsx';
import Lightbox from './Lightbox.jsx';
import { classifyPillar } from './pillarClassify.js';

export default function Archive() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetch('/assets/posts.json')
      .then((r) => r.json())
      .then((d) => setPosts(d.map((p) => ({ ...p, pillar: p.pillar || classifyPillar(p.caption) }))))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div style={{ minHeight: '100dvh', padding: '8vh 6vw', color: '#E8E4DC' }}>
      <a href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#C9A227', letterSpacing: '0.2em', textDecoration: 'none' }}>← BACK TO ASCENT</a>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(3rem, 8vw, 6rem)', margin: '1rem 0 0.5rem', letterSpacing: '0.02em' }}>
        THE 105 MARKS
      </h1>
      <p style={{ fontFamily: 'var(--font-quote)', color: 'rgba(232,228,220,0.7)', maxWidth: '40rem', marginBottom: '3rem' }}>
        Every post from the @elitehuman archive — body, mind, spirit.
      </p>
      <Grid posts={posts} onOpen={setOpen} />
      <Lightbox post={open} onClose={() => setOpen(null)} />
    </div>
  );
}
