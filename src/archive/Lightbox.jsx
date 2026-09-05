import { useEffect } from 'react';

export default function Lightbox({ post, onClose }) {
  useEffect(() => {
    // N-4: no key listener while lightbox closed
    if (!post) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, post]);

  if (!post) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Post detail" onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,12,0.95)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%', background: '#0A0A0C', border: '1px solid #C9A227', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <img src={`/assets/${post.img}`} alt={post.caption} style={{ width: '100%' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#C9A227', letterSpacing: '0.2em' }}>{post.pillar} · {new Date(post.date).toLocaleDateString()}</div>
          <p style={{ fontFamily: 'var(--font-quote)', fontSize: '1.1rem', color: '#E8E4DC', lineHeight: 1.5, margin: '1rem 0' }}>{post.caption}</p>
          <a href={post.igUrl} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', color: '#F0C75E', letterSpacing: '0.15em' }}>VIEW ON IG →</a>
          <button onClick={onClose} aria-label="Close" style={{ display: 'block', marginTop: '1.5rem', background: 'none', border: '1px solid #E8E4DC', color: '#E8E4DC', padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>CLOSE [ESC]</button>
        </div>
      </div>
    </div>
  );
}
