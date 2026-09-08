import React from 'react';

export default function CalendarIsland() {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '100%',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.8rem',
      color: 'var(--chalk)'
    }}>
      {days.map((day, i) => (
        <div key={day} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-2)',
          opacity: i === 6 ? 1 : 0.5
        }}>
          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>{day}</span>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: i === 6 ? 'var(--cyan)' : 'rgba(255,255,255,0.2)',
            boxShadow: i === 6 ? '0 0 8px var(--cyan)' : 'none'
          }} />
        </div>
      ))}
    </div>
  );
}
