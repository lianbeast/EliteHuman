export const SEED_LOGS = {
  lifts: [
    { lift: 'Squat', entries: [{ d: '2026-08-01', v: 315, r: 5, rpe: 8 }, { d: '2026-08-08', v: 320, r: 5, rpe: 9 }] },
    { lift: 'Bench', entries: [{ d: '2026-08-01', v: 225, r: 8, rpe: 7 }, { d: '2026-08-08', v: 230, r: 8, rpe: 8 }] },
    { lift: 'Deadlift', entries: [{ d: '2026-08-01', v: 405, r: 3, rpe: 8 }, { d: '2026-08-08', v: 415, r: 3, rpe: 9 }] },
  ],
  wods: [
    { name: 'Murph', times: [{ d: '2026-08-01', t: 38.5 }, { d: '2026-08-15', t: 37.2 }] },
    { name: 'Fran', times: [{ d: '2026-08-01', t: 2.1 }, { d: '2026-08-15', t: 2.0 }] },
  ],
  schedule: [
    { day: 'Mon 09/07', slots: [{ t: '06:00', kind: 'wod', tag: 'open' }, { t: '17:00', kind: 'platform', tag: 'coach' }] },
    { day: 'Tue 09/08', slots: [{ t: '06:00', kind: 'wod', tag: 'full' }] },
  ]
};
