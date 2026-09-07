import { useProgress } from '../lib/progressContext.jsx';
import { zoneAt } from '../lib/bands.js';
import { splitWords, staggerDelay } from '../lib/reveal.js';
import { clamp01 } from '../lib/easing.js';

const PANELS = [
  { zone: 'body',   eyebrow: 'LVL 01 — IRON',      title: 'BODY',       quote: 'We create our own circumstances.', caption: "Ordinary isn't gonna cut it." },
  { zone: 'mind',   eyebrow: 'LVL 02 — FRACTURE',  title: 'MIND',       quote: 'Wake up. Game face on.',            caption: 'This is life testing you — are you gonna stand down?' },
  { zone: 'spirit', eyebrow: 'LVL 03 — VIBRATION', title: 'SPIRIT',     quote: 'With faith we emit vibrations into the universe', caption: 'and attract what we want most.' },
  { zone: 'summit', eyebrow: 'APEX',               title: 'ELITEHUMAN', quote: 'You are an elite human.',           caption: 'See the 105 marks.', cta: { href: '/archive', label: 'Enter the archive' } },
];

const W = ({ children, d }) => (
  <span className="rv-word"><span style={{ transitionDelay: `${d}ms` }}>{children}</span></span>
);

const WordLine = ({ text }) => (
  <>
    {splitWords(text).map((w, i) => <W key={`${w}-${i}`} d={staggerDelay(i)}>{w}</W>).reduce((acc, w, i) => (i === 0 ? [w] : [...acc, ' ', w]), [])}
  </>
);

function Panel({ z, active }) {
  const Tag = z.zone === 'body' ? 'h1' : 'h2';
  return (
    <div className={active ? 'rv-in' : ''} style={{
      maxWidth: '40rem',
      opacity: active ? 1 : 0,
      transition: 'opacity 0.45s',
    }}>
      <div className="rv-eyebrow" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.25em', color: '#C9A227' }}>
        {z.eyebrow}
      </div>
      <Tag style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(4rem, 12vw, 9rem)',
        lineHeight: 0.9, margin: '0.5rem 0 1rem', color: '#E8E4DC', letterSpacing: '0.02em',
      }}>{z.title}</Tag>
      <p style={{
        fontFamily: 'var(--font-quote)', fontStyle: 'italic', fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
        color: '#E8E4DC', margin: 0, lineHeight: 1.3,
      }}>"<WordLine text={z.quote} />"</p>
      <p style={{ fontFamily: 'var(--font-quote)', fontSize: '1rem', color: 'rgba(232,228,220,0.7)', marginTop: '0.5rem' }}><WordLine text={z.caption} /></p>
      {z.cta && (
        <a href={z.cta.href} style={{
          display: 'inline-block', marginTop: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
          letterSpacing: '0.25em', color: '#F0C75E', border: '1px solid #C9A227',
          padding: '0.9rem 1.8rem', textDecoration: 'none',
        }}>{z.cta.label} →</a>
      )}
    </div>
  );
}

export default function DOMOverlays() {
  const { progress } = useProgress();
  const zone = zoneAt(progress);
  const heroLift = clamp01(progress / 0.06); // hero title clears as camera pulls back
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
      padding: '6vh 6vw',
    }}>
      <div style={{
        transform: `translateY(${-heroLift * 40}vh)`,
        opacity: 1 - heroLift * 0.9,
        transition: 'transform 0.1s linear, opacity 0.1s linear',
      }}>
        {PANELS.map((z) => (
          <div key={z.zone} style={{ display: z.zone === zone ? 'block' : 'none' }} aria-hidden={z.zone !== zone}>
            <Panel z={z} active={z.zone === zone} />
          </div>
        ))}
      </div>
    </div>
  );
}
