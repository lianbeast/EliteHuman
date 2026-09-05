import { BASE_URL } from '../lib/base.js';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Grid({ posts, onOpen, filter, onFilter }) {
  const list = filter === 'ALL' ? posts : posts.filter((p) => p.pillar === filter);

  const onMove = (e) => {
    if (e.pointerType === 'touch' || reducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--ry', (x * 8).toFixed(2));
    e.currentTarget.style.setProperty('--rx', (-y * 8).toFixed(2));
    e.currentTarget.classList.add('tilt');
  };
  const onLeave = (e) => {
    e.currentTarget.classList.remove('tilt');
    e.currentTarget.style.removeProperty('--rx');
    e.currentTarget.style.removeProperty('--ry');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', flexWrap: 'wrap', alignItems: 'center' }}>
        {['ALL', 'IRON', 'MIND', 'SPIRIT'].map((f) => (
          <button key={f} className="arc-pill" onClick={() => onFilter(f)} aria-pressed={filter === f}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', color: 'rgba(232,228,220,0.5)', fontSize: '0.75rem' }}>{list.length} MARKS</span>
      </div>
      <div key={filter} className="arc-grid arc-fade">
        {list.map((p) => (
          <article key={p.id} className="arc-card" onPointerMove={onMove} onPointerLeave={onLeave}
            onClick={() => onOpen(p)} tabIndex={0} role="button"
            onKeyDown={(e) => e.key === 'Enter' && onOpen(p)}
            style={{ fontFamily: 'var(--font-quote)' }}>
            <div style={{ aspectRatio: '1', background: '#1C1D22', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <img className="arc-img" src={`${BASE_URL}assets/${p.img}`} alt={p.caption.slice(0, 80)} loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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
