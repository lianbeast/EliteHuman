import React, { useMemo } from 'react';
import { useLocalLog } from '../hooks/useLocalLog.js';

export default function ProgressChart({ liftName }) {
  const { logs } = useLocalLog();

  const data = useMemo(() => {
    const lift = logs.lifts.find(l => l.lift === liftName);
    if (!lift) return [];
    return lift.entries.map(e => e.v);
  }, [logs, liftName]);

  if (data.length < 2) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--chalk)', opacity: 0.4, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
        Insufficient data for {liftName}
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 200;
  const height = 60;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ position: 'relative', width, height, marginTop: 'var(--space-2)' }}>
      {/* Grid lines */}
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        <line x1="0" y1="0" x2={width} y2="0" stroke="rgba(62,240,216,0.1)" strokeWidth="1" />
        <line x1="0" y1={height} x2={width} y2={height} stroke="rgba(62,240,216,0.1)" strokeWidth="1" />
        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="rgba(62,240,216,0.05)" strokeWidth="1" />
      </svg>
      {/* Data line */}
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
        <polyline
          points={points}
          fill="none"
          stroke="var(--cyan)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px var(--cyan))' }}
        />
        {data.map((v, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * width}
            cy={height - ((v - min) / range) * height}
            r="2"
            fill="var(--chalk)"
          />
        ))}
      </svg>
      <div style={{ position: 'absolute', bottom: -15, left: 0, fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
        {min}kg
      </div>
      <div style={{ position: 'absolute', bottom: -15, right: 0, fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
        {max}kg
      </div>
    </div>
  );
}
