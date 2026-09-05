import { useEffect, useState } from 'react';
import { useProgress } from '../lib/progressContext.jsx';
import m from './milestones.json';
import { BASE_URL } from '../lib/base.js';

const STATS = [
  { n: 105, label: 'MARKS' },
  { n: 3, label: 'DISCIPLINES' },
  { n: 3290, label: 'REACTIONS' },
  { n: m.yearsOnPath, label: 'YEARS ON THE PATH' },
];

function useCountUp(target, run, ms = 1200) {
  const [v, setV] = useState(run ? 0 : target);
  useEffect(() => {
    if (!run) { setV(target); return; }
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return v;
}

function Stat({ s, run, altMode }) {
  const v = useCountUp(s.n, run && !altMode);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#F0C75E', lineHeight: 1 }}>{v.toLocaleString()}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(232,228,220,0.6)', marginTop: '0.5rem' }}>{s.label}</div>
    </div>
  );
}

export default function Outro() {
  const { progress, altMode } = useProgress();
  const run = progress > 0.92;
  return (
    <div aria-hidden={!run} style={{
      position: 'fixed', inset: 0, zIndex: 6, pointerEvents: run ? 'auto' : 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '2.5rem', opacity: run ? 1 : 0, transition: 'opacity 0.8s', padding: '4vh 6vw',
      background: run ? 'radial-gradient(ellipse at 50% 120%, rgba(201,162,39,0.14), transparent 60%)' : 'none',
    }}>
      {run && (
        <>
          <div style={{ display: 'flex', gap: 'clamp(2rem, 6vw, 5rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {STATS.map((s) => <Stat key={s.label} s={s} run={run} altMode={altMode} />)}
          </div>
          <p style={{ fontFamily: 'var(--font-quote)', fontStyle: 'italic', color: 'rgba(232,228,220,0.8)', fontSize: 'clamp(1rem, 2vw, 1.3rem)', maxWidth: '36rem', textAlign: 'center', margin: 0 }}>{m.trainingPhilosophy}</p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <img src={`${BASE_URL}assets/img/profile-hd.jpg`} alt="EliteHuman" width={56} height={56}
              style={{ borderRadius: '50%', boxShadow: '0 0 0 2px #C9A227, 0 0 24px rgba(201,162,39,0.4)' }} />
            <a href="/archive" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.25em', color: '#F0C75E', border: '1px solid #C9A227', padding: '1rem 2rem', textDecoration: 'none', fontSize: '0.85rem' }}>ENTER THE ARCHIVE →</a>
            <a href="https://www.instagram.com/elitehuman/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.25em', color: '#E8E4DC', textDecoration: 'none', fontSize: '0.85rem' }}>@ELITEHUMAN</a>
          </div>
        </>
      )}
    </div>
  );
}
