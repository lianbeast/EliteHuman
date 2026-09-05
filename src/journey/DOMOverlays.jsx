import { useProgress } from '../lib/progressContext.jsx';

const PANELS = [
  { min: 0.0, eyebrow: 'LVL 01 — IRON', title: 'BODY', quote: 'We create our own circumstances.', caption: "Ordinary isn't gonna cut it." },
  { min: 0.25, eyebrow: 'LVL 02 — FRACTURE', title: 'MIND', quote: 'Wake up. Game face on.', caption: 'This is life testing you — are you gonna stand down?' },
  { min: 0.6, eyebrow: 'LVL 03 — VIBRATION', title: 'SPIRIT', quote: 'With faith we emit vibrations into the universe', caption: 'and attract what we want most.' },
  { min: 0.9, eyebrow: 'APEX', title: 'ELITEHUMAN', quote: 'You are an elite human.', caption: 'See the 105 marks.', cta: { href: '/archive', label: 'Enter the archive' } },
];

function activePanel(p) {
  return [...PANELS].reverse().find((z) => p >= z.min) ?? PANELS[0];
}

export default function DOMOverlays() {
  const { progress } = useProgress();
  const z = activePanel(progress);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
      padding: '6vh 6vw',
    }}>
      <div style={{ maxWidth: '40rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.25em', color: '#C9A227' }}>
          {z.eyebrow}
        </div>
        {z === PANELS[0]
          ? <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(4rem, 12vw, 9rem)',
              lineHeight: 0.9, margin: '0.5rem 0 1rem', color: '#E8E4DC', letterSpacing: '0.02em',
            }}>{z.title}</h1>
          : <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(4rem, 12vw, 9rem)',
              lineHeight: 0.9, margin: '0.5rem 0 1rem', color: '#E8E4DC', letterSpacing: '0.02em',
            }}>{z.title}</h2>}
        <p style={{
          fontFamily: 'var(--font-quote)', fontStyle: 'italic', fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
          color: '#E8E4DC', margin: 0, lineHeight: 1.3,
        }}>"{z.quote}"</p>
        <p style={{ fontFamily: 'var(--font-quote)', fontSize: '1rem', color: 'rgba(232,228,220,0.7)', marginTop: '0.5rem' }}>{z.caption}</p>
        {z.cta && (
          <a href={z.cta.href} style={{
            pointerEvents: 'auto', display: 'inline-block', marginTop: '1.5rem',
            padding: '0.75rem 1.5rem', border: '1px solid #C9A227',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', color: '#F0C75E',
            textDecoration: 'none',
          }}>{z.cta.label} →</a>
        )}
      </div>
    </div>
  );
}
