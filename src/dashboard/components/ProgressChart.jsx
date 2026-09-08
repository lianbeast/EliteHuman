import React from 'react';

export default function ProgressChart({ liftName }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.7rem',
      color: 'var(--cyan)',
      opacity: 0.8
    }}>
      <span>{liftName}</span>
      <div style={{
        width: '40px',
        height: '4px',
        background: 'rgba(62,240,216,0.2)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${Math.random() * 60 + 40}%`,
          background: 'var(--cyan)',
          boxShadow: '0 0 5px var(--cyan)'
        }} />
      </div>
    </div>
  );
}
