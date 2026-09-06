# EliteHuman Spatial Dashboard — Design

Date: 2026-09-06
Status: Approved in brainstorming (all sections user-confirmed)
Type: Architectural (new view layered onto existing site)

## Goal

Scale EliteHuman into an immersive 3D spatial dashboard: full-viewport
Three.js canvas (aurora dome, particle field, 360° merch product) with
visionOS-style glassmorphic DOM panels floating above — workout planner,
merch store, calendar timeline, brand header. Dashboard becomes `/`;
the existing ascent journey moves to `/journey`; `/archive` unchanged.

## Decisions (locked in brainstorming)

1. **Routing: dashboard replaces `/`**; journey relocates to `/journey`.
   404 fallback + `routeOf` in `src/App.jsx` already handle arbitrary
   paths — no deploy changes.
2. **Merch 3D form: photo-textured monolith** — gallery image on a
   rounded slab, rotating 360°, glass rim. Existing 104 gym JPGs are
   the texture source. Color swatch swaps the product photo + rim tint.
3. **Data: localStorage + seed matrices** — `src/dashboard/data.js`
   exports seed matrices (lifts, WODs, schedule, merch SKUs). User logs
   persist under `eh:logs` (localStorage), merged with seeds on load.
   No backend.
4. **Architecture: DOM-overlay** — one full-viewport `<Canvas>` behind;
   glass panels are real DOM above it (backdrop-filter blurs the WebGL
   behind). Parallax tilts the DOM grid via `perspective() rotateX/Y`
   from pointer, lerped in rAF, zero React re-renders (ref + direct
   style write). No drei `<Html>`, no second canvas.

## Architecture

```
src/
  App.jsx                  → route table: '/' Dashboard, '/journey' Journey, '/archive' Archive
  dashboard/
    Dashboard.jsx          → mounts <SpatialCanvas/> + <GlassGrid/> + <Parallax/>; body overflow hidden
    SpatialCanvas.jsx      → own <Canvas>: SkyDome + Particles (own instances) + <MerchSlab/>
    MerchSlab.jsx          → photo-textured rounded slab, 360° spin, dispose-safe
    GlassGrid.jsx          → DOM panel layout grid
    Parallax.jsx           → pointer lerp → grid transform, rAF, no re-render
    panels/                → HeaderBar.jsx, WorkoutPanel.jsx, StorePanel.jsx, TimelinePanel.jsx
    charts/LineChart.jsx   → pure SVG polyline, neon grid lines
    useLocalLog.js         → localStorage merge hook
    data.js                → seed matrices + computed aggregates
  journey/                 → untouched, mounted at '/journey'
```

- Shared: `main.jsx`, `src/styles/tokens.css`, `ScrollRig` (journey only).
- Route unmount = full Canvas unmount = R3F auto-disposes. MerchSlab adds
  explicit texture/material `dispose()` in cleanup (spec memory requirement).
- Dashboard sets `document.body` overflow hidden (100vh fixed grid);
  overflow returns to auto under 720px width (single-column stack).

## Layout

```
┌────────────────────────────────────────────────────┐
│ ELITEHUMAN // SPATIAL OS v1.0 │ cap% │ time │ BAG[n]│  HeaderBar ~64px
├────────────────────────────────────────────────────┤
│ ┌───────────────┐                  ┌─────────────┐ │
│ │ WORKOUT       │                  │  MERCH 3D   │ │
│ │ tracking      │                  │  (canvas    │ │
│ │ matrix        │                  │   space,    │ │
│ │ charts ×4     │                  │   DOM ring) │ │
│ │ routine log   │                  │  size pills │ │
│ │ form          │                  │  swatches   │ │
│ │               │                  │  Add to Bag │ │
│ └───────────────┘                  └─────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ CALENDAR TIMELINE — horizontal scroll            │ │
│ │ [WOD][WOD][PLAT][WOD][PLAT] tags: open/full/coach│ │
│ └─────────────────────────────────────────────────┘ │
│        (WebGL canvas: dome + particles behind all)  │
└────────────────────────────────────────────────────┘
```

- CSS grid: `header / main(1fr) / timeline`; main = `1fr 0.9fr` columns.
  Gap 24px, padding 24px.
- Panel depth: header translateZ 0, left 40px, right 20px, timeline 60px —
  parallax tilt exposes layering.
- Glass token (`.glass`, defined once in dashboard CSS):
  `background: rgba(255,255,255,0.03); backdrop-filter: blur(25px)
  saturate(180%); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; color: #FFFFFF;`
- Accent: electric cyan `#3EF0D8` — progress bars, active pills, chart
  lines, capacity bar. Gold `#F0C75E` stays journey identity.
- Typography: existing tokens — `--font-display` headers, `--font-mono`
  data/labels.
- Charts: pure SVG `<polyline>` + grid lines
  `stroke: rgba(62,240,216,0.15)`. One `LineChart` component reused for
  Squat/Bench/Deadlift/WOD-time.
- Reduced motion (`altMode` via existing `prefers-reduced-motion`
  context): parallax off, slab spin static, bloom off.
- Touch/parallax: parallax off on `(pointer: coarse)`.
- Mobile (<720px): single column, body scrolls, canvas still behind.

## Data matrices

```js
LIFTS:    [{ lift:'Squat',    entries:[{d:'2026-08-02', v:315}, …] }, … ]
WODS:     [{ name:'Murph',    times: [{d:'2026-08-02', t:38.5}, …] }, … ]
SCHEDULE: [{ day:'Mon 09/07', slots:[{t:'06:00', kind:'wod'|'platform', tag:'open'|'full'|'coach'}] }]
MERCH:    [{ id:'eh-tee-001', name:'EliteHuman Ascent Tee',
             img:'/assets/img/1092….jpg', price:48,
             sizes:['S','M','L','XL'],
             colors:[{name, hex, img}] }]
```

- `useLocalLog`: `useLocalStorage('eh:logs', SEED_LOGS)` — JSON in/out.
  Log form submit appends `{date, exercise, sets, reps, rpe, volume}`;
  daily volume / active minutes / sets matrices recompute via `useMemo`.
- Merch interactions: size pill (cyan ring), color swatch swaps slab
  texture + rim emissive tint, "Add to Bag" pulses + increments
  HeaderBar `BAG [n]` counter (client state; no checkout).
- Header metrics: gym capacity = deterministic sine of wall-clock
  (morning/evening peaks), cyan bar + %; server time = 1s interval
  `toISOString` mono; status = "SYNCED" pulse dot. All client-side.

## Performance & memory

- Single rAF-driven render loop; parallax lerp + slab rotation inside
  `useFrame` (R3F owns the loop). No React state in animation paths.
- dpr `[1.5, 2]`, bloom `mipmapBlur` desktop / off touch / off altMode
  (mirror journey settings).
- Route switch unmounts Canvas → R3F disposes. MerchSlab cleanup calls
  `texture.dispose()`, `material.dispose()`, `geometry.dispose()`.
- Particles/SkyDome: own instances in dashboard canvas, same shader
  approach (uTime uniform, zero CPU per frame).

## Accessibility

- All panels real DOM: focusable, keyboard-navigable forms.
- Log form: labels, number inputs, RPE radio-group pills.
- Contrast: white on rgba(255,255,255,0.03) over dark canvas — panels
  sit on obsidian `#0A0A0C` background guaranteeing contrast.
- Reduced-motion honored for parallax + spin.
- Skip link pattern retained from App.

## Testing

- Vitest (jsdom, canvas mocked): `data.js` shape asserts; `useLocalLog`
  round-trip; `LineChart` renders polyline points from fixture; panel
  smoke renders; `routeOf` handles `/journey`.
- Playwright smoke: dashboard loads, log form submits + persists after
  reload, bag increments, journey link routes.
- Existing journey/archive tests must stay green (no regressions).

## Out of scope

- Real checkout / payments.
- Backend persistence or auth.
- New 3D model formats (GLB etc.) — photo-textured slab only.
- Journey visual changes (beyond route move).
