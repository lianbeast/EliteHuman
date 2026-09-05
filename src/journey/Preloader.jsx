import { useEffect, useState } from 'react';

export default function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    const tick = () => {
      i = Math.min(100, i + 2 + Math.random() * 4);
      setN(Math.floor(i));
      if (i < 100) setTimeout(tick, 30);
      else onDone?.();
    };
    tick();
  }, [onDone]);
  return (
    <div role="status" aria-live="polite" style={{
      position: 'fixed', inset: 0, background: '#0A0A0C', zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', color: '#E8E4DC', letterSpacing: '0.2em',
    }}>
      <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>CHALKING HANDS</div>
      <div style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', marginTop: '1rem', color: '#C9A227' }}>
        {String(n).padStart(3, '0')}%
      </div>
    </div>
  );
}
