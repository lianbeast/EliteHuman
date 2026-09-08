import React, { useState, useRef, useEffect } from 'react';
import { useLocalLog } from '../hooks/useLocalLog.js';

export default function WorkoutLog() {
  const { logs, addEntry } = useLocalLog();
  const [form, setForm] = useState({ lift: 'Squat', v: '', r: '', rpe: '8' });
  const inputRef = useRef(null);

  // Focus first input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.v || !form.r) return;

    addEntry('lift', {
      lift: form.lift,
      v: parseInt(form.v, 10),
      r: parseInt(form.r, 10),
      rpe: parseInt(form.rpe, 10)
    });

    // Clear only the value/reps, keep the lift for sequential entries
    setForm(prev => ({ ...prev, v: '', r: '' }));
    inputRef.current?.focus();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-3)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <select
            value={form.lift}
            onChange={e => setForm(prev => ({ ...prev, lift: e.target.value }))}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'var(--chalk)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              padding: '0.4rem'
            }}
          >
            {logs.lifts.map(l => <option key={l.lift} value={l.lift}>{l.lift}</option>)}
          </select>

          <input
            ref={inputRef}
            type="number"
            placeholder="Weight"
            value={form.v}
            onChange={e => setForm(prev => ({ ...prev, v: e.target.value }))}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--chalk)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '0.4rem',
              fontFamily: 'var(--font-mono)',
              width: '80px'
            }}
          />

          <input
            type="number"
            placeholder="Reps"
            value={form.r}
            onChange={e => setForm(prev => ({ ...prev, r: e.target.value }))}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--chalk)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '0.4rem',
              fontFamily: 'var(--font-mono)',
              width: '60px'
            }}
          />

          <div style={{ display: 'flex', gap: '4px' }}>
            {[7, 8, 9, 10].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, rpe: val.toString() }))}
                style={{
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  border: `1px solid ${form.rpe === val.toString() ? 'var(--cyan)' : 'rgba(255,255,255,0.1)'}`,
                  background: form.rpe === val.toString() ? 'rgba(62,240,216,0.2)' : 'transparent',
                  color: 'var(--chalk)',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            background: 'var(--cyan)',
            color: 'var(--obsidian)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 'bold',
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          LOG SET
        </button>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', marginTop: 'var(--space-3)' }}>
        <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginBottom: 'var(--space-2)', opacity: 0.8 }}>
          RECENT ACTIVITY
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {logs.lifts.map(l => (
            <div key={l.lift} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--chalk)' }}>
              <span>{l.lift}</span>
              <span style={{ opacity: 0.6 }}>{l.entries[l.entries.length - 1]?.v} x {l.entries[l.entries.length - 1]?.r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
