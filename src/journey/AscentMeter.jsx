import { useProgress } from '../lib/progressContext.jsx';
import { BANDS } from '../lib/bands.js';

const ZONES = [
  { min: 0.0, label: 'IRON' },
  { min: BANDS[0], label: 'MIND' },
  { min: BANDS[1], label: 'VIBRATION' },
  { min: BANDS[2], label: 'APEX' },
];

export default function AscentMeter() {
  const { progress } = useProgress();
  const z = [...ZONES].reverse().find((zone) => progress >= zone.min) ?? ZONES[0];
  return (
    // m-2: skip-link target must be focusable + announce progress to screen readers (aria-hidden removed)
    <div id="ascent-meter" role="progressbar" aria-valuemin={0} aria-valuemax={1} aria-valuenow={progress.toFixed(2)} aria-label="Ascent progress" tabIndex={-1} style={{
      position: 'fixed', right: '1.5rem', top: '20vh', height: '60vh', width: '2px',
      background: 'rgba(232,228,220,0.15)', zIndex: 10,
    }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%',
        height: `${progress * 100}%`,
        background: 'linear-gradient(180deg, #F0C75E, #C9A227)',
        boxShadow: '0 0 12px #C9A227',
        transition: 'height 60ms linear',
      }} />
      <div style={{
        position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
        color: '#E8E4DC', textAlign: 'right', whiteSpace: 'nowrap',
      }}>
        ALT {progress.toFixed(2)}<br />
        <span style={{ color: '#C9A227' }}>{z.label}</span>
      </div>
    </div>
  );
}
