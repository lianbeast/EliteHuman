import { useState, useEffect } from 'react';
import { SEED_LOGS } from '../data.js';

const STORAGE_KEY = 'eh:logs';

export function useLocalLog() {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SEED_LOGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const addEntry = (type, data) => {
    setLogs(prev => {
      const next = { ...prev };
      if (type === 'lift') {
        const lift = next.lifts.find(l => l.lift === data.lift);
        if (lift) {
          lift.entries.push({ d: new Date().toISOString().split('T')[0], ...data });
        } else {
          next.lifts.push({ lift: data.lift, entries: [{ d: new Date().toISOString().split('T')[0], ...data }] });
        }
      } else if (type === 'wod') {
        const wod = next.wods.find(w => w.name === data.name);
        if (wod) {
          wod.times.push({ d: new Date().toISOString().split('T')[0], t: data.t });
        } else {
          next.wods.push({ name: data.name, times: [{ d: new Date().toISOString().split('T')[0], t: data.t }] });
        }
      }
      return next;
    });
  };

  return { logs, addEntry };
}
