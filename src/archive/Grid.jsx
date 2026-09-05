import { useState } from 'react';

export default function Grid({ posts, onOpen }) {
  const [filter, setFilter] = useState('ALL');
  const list = filter === 'ALL' ? posts : posts.filter((p) => p.pillar === filter);
  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', flexWrap: 'wrap' }}>
        {['ALL', 'IRON', 'MIND', 'SPIRIT'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
            style={{ background: 'none', border: '1px solid currentColor', color: filter === f ? '#F0C75E' : '#E8E4DC', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            {f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: 'rgba(232,228,220,0.5)' }}>{list.length} MARKS</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {list.map((p) => (
          <article key={p.id} onClick={() => onOpen(p)} tabIndex={0} role="button"
            onKeyDown={(e) => e.key === 'Enter' && onOpen(p)}
            style={{ background: '#0A0A0C', border: '1px solid #1C1D22', padding: '1rem', cursor: 'pointer', fontFamily: 'var(--font-quote)' }}>
            <div style={{ aspectRatio: '1', background: '#1C1D22', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <img src={`/assets/${p.img}`} alt="" loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)', transition: 'filter 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0%) sepia(0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(100%) contrast(1.1)')} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#C9A227', letterSpacing: '0.2em' }}>{p.pillar}</div>
            <p style={{ fontSize: '0.95rem', color: '#E8E4DC', margin: '0.25rem 0 0.5rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.caption}</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(232,228,220,0.5)' }}>{new Date(p.date).toLocaleDateString()}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
