import React from 'react';
import { useLocalLog } from '../hooks/useLocalLog.js';

export default function CalendarIsland({ onSlotClick }) {
  const { logs } = useLocalLog();
  const schedule = logs.schedule || [];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3',
      width: '100%',
      height: '100%'
    }}>
      <div style={{
        display: 'flex',
        gap: 'var(--space-3)',
        overflowX: 'auto',
        paddingBottom: 'var(--space-2)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {schedule.map((day, i) => (
          <div key={i} style={{
            minWidth: '140px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: 'var(--space-3)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}>
            <div style={{
              color: 'var(--cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              marginBottom: 'var(--space-2)',
              textTransform: 'uppercase'
            }}>
              {day.day}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {day.slots.map((slot, j) => (
                <div
                  key={j}
                  onClick={() => onSlotClick?.(slot)}
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--chalk)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 8px',
                    background: slot.tag === 'full' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.03)',
                    borderRadius: '6px',
                    border: `1px solid ${slot.tag === 'full' ? 'rgba(255,0,0,0.2)' : 'rgba(255,255,255,0.05)'}`
                  }}
                >
                  <span>{slot.t} {slot.kind === 'wod' ? 'WOD' : 'PLAT'}</span>
                  <span style={{
                    fontSize: '0.6rem',
                    color: slot.tag === 'full' ? '#ff4d4d' : 'var(--cyan)',
                    textTransform: 'uppercase'
                  }}>
                    {slot.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
