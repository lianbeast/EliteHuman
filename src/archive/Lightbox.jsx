import { useEffect } from 'react';
import { BASE_URL } from '../lib/base.js';

export default function Lightbox({ post, onClose, onNav }) {
  useEffect(() => {
    // N-4: no key listener while lightbox closed
    if (!post) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav?.(1);
      if (e.key === 'ArrowLeft') onNav?.(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNav, post]);

  if (!post) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Post detail" onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,12,0.92)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 3rem)' }}>
      {onNav && (
        <>
          <button aria-label="Previous post" onClick={(e) => { e.stopPropagation(); onNav(-1); }}
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: '1px solid #C9A227', color: '#F0C75E', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', padding: '0.6rem 1rem', cursor: 'pointer' }}>‹</button>
          <button aria-label="Next post" onClick={(e) => { e.stopPropagation(); onNav(1); }}
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: '1px solid #C9A227', color: '#F0C75E', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', padding: '0.6rem 1rem', cursor: 'pointer' }}>›</button>
        </>
      )}
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', width: '100%', background: '#0A0A0C', border: '1px solid #C9A227', boxShadow: '0 0 60px rgba(201,162,39,0.15)', padding: 'clamp(1rem, 3vw, 2.5rem)', display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 'clamp(1rem, 3vw, 2.5rem)' }}>
        <img src={`${BASE_URL}assets/${post.img}`} alt={post.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
            <span style={{ color: '#0A0A0C', background: '#C9A227', padding: '0.2rem 0.6rem' }}>{post.pillar}</span>
            <span style={{ color: 'rgba(232,228,220,0.6)' }}>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <p style={{ fontFamily: 'var(--font-quote)', fontSize: '1.1rem', color: '#E8E4DC', lineHeight: 1.5, margin: '1rem 0', overflowY: 'auto', flex: 1 }}>{post.caption}</p>
          <a href={post.igUrl} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', color: '#F0C75E', letterSpacing: '0.15em' }}>VIEW ON IG →</a>
          <button onClick={onClose} aria-label="Close" style={{ alignSelf: 'flex-start', marginTop: '1.5rem', background: 'none', border: '1px solid #E8E4DC', color: '#E8E4DC', padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>CLOSE [ESC]</button>
        </div>
      </div>
    </div>
  );
}
