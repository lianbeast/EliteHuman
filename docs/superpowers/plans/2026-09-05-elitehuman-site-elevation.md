# EliteHuman Site Elevation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the journey/archive site to 60fps max-drama per spec — GPU particles, zone culling, 8000vh rebanded journey (15/40/70), hero cold-open, DOM choreography, timeline stations, stats outro, editorial archive.

**Architecture:** Single `progress` scalar stays the source of truth. New `src/lib/bands.js` is the single band-constant module every consumer imports. Zones self-cull via `useFrame` visibility. Particles move to GPU time-uniform shaders. DOM panels gain word-mask reveals. New `src/sections/Outro.jsx` + `milestones.json` close the arc.

**Tech Stack:** Vite, React 18, @react-three/fiber + drei + postprocessing, Lenis, troika-three-text, Vitest (jsdom), Playwright. **No new dependencies.**

**Spec:** `docs/superpowers/specs/2026-09-05-elitehuman-site-elevation-design.md`

## Global Constraints

- No new npm dependencies.
- Palette tokens fixed: obsidian `#0A0A0C`, iron `#1C1D22`, chalk `#E8E4DC`, ember `#C9A227`, solar `#F0C75E`.
- Fonts: Big Shoulders Display (display), Spectral (quote), Space Mono (mono) — existing @fontsource.
- Reduced-motion (`altMode`) must keep working: 4×100vh snap sections, static camera, crossfade panels, no postfx.
- No real-time shadow maps (contact-shadow planes only).
- DOM animations use only transform/opacity/filter.
- Every task ends green: `npm test` passes.

---

### Task 1: bands module (single source of truth)

**Files:**
- Create: `src/lib/bands.js`
- Test: `src/lib/bands.test.js`

**Interfaces:**
- Produces: `BANDS = [0.15, 0.40, 0.70]` (zone upper bounds BODY/MIND/SPIRIT; SUMMIT = rest), `ZONE_MIN = [0, 0.15, 0.40, 0.70]`, `zoneAt(p)` → `'body'|'mind'|'spirit'|'summit'`, `bandCenter(i)` → midpoint of zone i, `bandHalf(i)` → half-width, `CULL_PAD = 0.08`.

- [ ] **Step 1: Write failing test**

```js
import { describe, it, expect } from 'vitest';
import { BANDS, zoneAt, bandCenter, bandHalf } from './bands.js';

describe('bands', () => {
  it('exports 15/40/70 boundaries', () => {
    expect(BANDS).toEqual([0.15, 0.40, 0.70]);
  });
  it('zoneAt maps progress to zone names', () => {
    expect(zoneAt(0)).toBe('body');
    expect(zoneAt(0.15)).toBe('mind');
    expect(zoneAt(0.4)).toBe('spirit');
    expect(zoneAt(0.7)).toBe('summit');
    expect(zoneAt(1)).toBe('summit');
  });
  it('bandCenter/half give sane ranges', () => {
    expect(bandCenter(0)).toBeCloseTo(0.075);
    expect(bandHalf(0)).toBeCloseTo(0.075);
    expect(bandCenter(3)).toBeCloseTo(0.85);
    expect(bandHalf(3)).toBeCloseTo(0.15);
  });
});
```

- [ ] **Step 2: Run test, verify fails** — `npm test -- src/lib/bands.test.js` → FAIL (module not found).
- [ ] **Step 3: Implement**

```js
// Single source of truth for zone banding. Every consumer (camera, overlays,
// meter, CA pulse, altMode snap) imports from here — retune once, whole site follows.
export const BANDS = [0.15, 0.40, 0.70]; // upper bounds of body/mind/spirit; summit = 1
export const CULL_PAD = 0.08;

const ZONE_NAMES = ['body', 'mind', 'spirit', 'summit'];
const starts = [0, ...BANDS, 1];

export function zoneAt(p) {
  for (let i = BANDS.length - 1; i >= 0; i--) if (p >= BANDS[i]) return ZONE_NAMES[i + 1];
  return ZONE_NAMES[0];
}
export function bandCenter(i) { return (starts[i] + starts[i + 1]) / 2; }
export function bandHalf(i) { return (starts[i + 1] - starts[i]) / 2; }
```

- [ ] **Step 4: Run test, verify passes** — `npm test -- src/lib/bands.test.js` → PASS.
- [ ] **Step 5: Commit** — `git add src/lib/bands.js src/lib/bands.test.js && git commit -m "feat: bands module — single zone banding source (15/40/70)"`

---

### Task 2: GPU particles rewrite

**Files:**
- Modify: `src/journey/three/Particles.jsx` (full rewrite)

**Interfaces:**
- Consumes: nothing new. Props API unchanged: `{ count, area, color, size, opacity }` (default `area=[6,4,4]`).
- Produces: same component name/default export; zero per-frame JS particle math (one uniform write).

- [ ] **Step 1: Rewrite component**

```jsx
import { useMemo } from 'react';
import * as THREE from 'three';

// GPU particles: positions static in buffer, all motion in vertex shader via uTime.
// ponytail: no per-particle speed variance — uniform rise rate; add attribute seed if drift needs variety.
const VERT = `
  attribute float seed;
  uniform float uTime;
  uniform vec3 uArea;
  uniform float uSize;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * 0.15 * (0.6 + seed * 0.8), uArea.y);
    p.x += sin(uTime * 0.4 + seed * 20.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (200.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, uOpacity * smoothstep(0.5, 0.1, d));
  }`;

export default function Particles({ count = 200, area = [6, 4, 4], color = '#E8E4DC', size = 0.02, opacity = 0.6, tick = null }) {
  const { positions, seeds, uniforms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * area[0];
      pos[i * 3 + 1] = Math.random() * area[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      seed[i] = Math.random();
    }
    return {
      positions: pos, seeds: seed,
      uniforms: {
        uTime: { value: 0 },
        uArea: { value: new THREE.Vector3(...area) },
        uSize: { value: size * 50 },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
    };
  }, [count, area, color, size, opacity]); // ponytail: re-memo on prop change, not per frame

  const ref = (el) => { if (el) el.material.uniforms.uTime = uniforms.uTime; };
  return (
    <points ref={ref} onUpdate={(s) => { if (s) s.material.uniforms.uTime = uniforms.uTime; }}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms}
        transparent depthWrite={false}
        onBeforeRender={(s) => { uniforms.uTime.value = s.clock ? uniforms.uTime.value : uniforms.uTime.value; }}
      />
    </points>
  );
}
```

Wait — that render is overcomplicated. Cleaner: keep `useFrame` writing the single uniform (allowed — it's 1 write, not 550):

```jsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERT = `
  attribute float seed;
  uniform float uTime;
  uniform vec3 uArea;
  uniform float uSize;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * 0.15 * (0.6 + seed * 0.8), uArea.y);
    p.x += sin(uTime * 0.4 + seed * 20.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (200.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, uOpacity * smoothstep(0.5, 0.1, d));
  }`;

export default function Particles({ count = 200, area = [6, 4, 4], color = '#E8E4DC', size = 0.02, opacity = 0.6 }) {
  const mat = useRef();
  const { positions, seeds, uniforms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * area[0];
      pos[i * 3 + 1] = Math.random() * area[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      seed[i] = Math.random();
    }
    return {
      positions: pos, seeds: seed,
      uniforms: {
        uTime: { value: 0 },
        uArea: { value: new THREE.Vector3(...area) },
        uSize: { value: size * 50 },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
    };
  }, [count, area, color, size, opacity]);

  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime; });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={mat} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}
```

(Use the second version. The first listing is retained here only so the executor sees the rejected alternative and its reason: ref-tunneling uniforms is fragile.)

- [ ] **Step 2: Visual check** — `npm run dev`, scroll BODY zone: chalk dust rises/drifts same as before. Console: no errors.
- [ ] **Step 3: Run full suite** — `npm test` → PASS.
- [ ] **Step 4: Commit** — `git commit -am "perf: GPU particles — one uniform write per frame, motion in vertex shader"`

---

### Task 3: Zone culling + shadow removal + dpr/Lenis tuning

**Files:**
- Modify: `src/journey/Journey.jsx`, `src/journey/zones/Body.jsx`, `Mind.jsx`, `Spirit.jsx`, `Summit.jsx`, `src/journey/ScrollRig.jsx`, `src/journey/CameraSpline.jsx`, `src/App.jsx`

**Interfaces:**
- Consumes: `zoneAt`, `CULL_PAD` from `src/lib/bands.js`.
- Produces: `ZoneBand` wrapper component (`src/journey/three/ZoneBand.jsx`) with prop `{ band: 0|1|2|3, children }`; zones wrapped in it. `BANDS` in `Journey.jsx` CA pulse replaced by bands import.

- [ ] **Step 1: Create `src/journey/three/ZoneBand.jsx`**

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useProgress } from '../../lib/progressContext.jsx';
import { bandCenter, bandHalf, CULL_PAD } from '../../lib/bands.js';

// Culls subtree when camera's scroll band is far from this zone's band.
export default function ZoneBand({ band = 0, children }) {
  const ref = useRef();
  useFrame(() => {
    const { progress } = useProgressRead();
  });
}
```

No — `useProgress` hook can't be called inside useFrame. Correct form:

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useProgress } from '../../lib/progressContext.jsx';
import { bandCenter, bandHalf, CULL_PAD } from '../../lib/bands.js';

// Culls subtree when scroll progress is far from this zone's band.
export default function ZoneBand({ band = 0, children }) {
  const ref = useRef();
  const { progress } = useProgress();
  const c = bandCenter(band), h = bandHalf(band);
  useFrame(() => {
    ref.current.visible = Math.abs(progress - c) < h + CULL_PAD;
  });
  return <group ref={ref}>{children}</group>;
}
```

- [ ] **Step 2: Body.jsx** — remove `castShadow`/`receiveShadow` from all meshes, drop `castShadow` from directionalLight, wrap return in `<ZoneBand band={0}>`. Replace barbell/plates with instanced rack: keep existing primitives, add second plate stack (`<Plate x={-1.7}/>` etc. duplicates fine) and two upright posts:

```jsx
// add inside Barbell group:
{[-1.9, 1.9].map((x) => (
  <mesh key={x} position={[x, 1.2, -2.1]}>
    <boxGeometry args={[0.08, 2.4, 0.08]} />
    <meshStandardMaterial color="#1C1D22" metalness={0.7} roughness={0.4} />
  </mesh>
))}
```

Plus contact shadow plane under barbell (radial-gradient texture):

```jsx
import { useMemo } from 'react';
import * as THREE from 'three';
function ContactShadow() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.55)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0, -0.98, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5, 1.6]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}
```

- [ ] **Step 3: Mind.jsx / Spirit.jsx / Summit.jsx** — wrap each zone root in `<ZoneBand band={1|2|3}/>`. Remove any castShadow leftovers (none present). Spirit particles: `count` 400→600.
- [ ] **Step 4: Journey.jsx** — `dpr={[1, 1.75]}`; CA pulse `BANDS` import from bands.js (drop local const); Bloom `resolution` on touch: `<Bloom intensity={1.2} luminanceThreshold={0.2} mipmapBlur resolutionScale={isTouch ? 0.5 : 1} />`; add drei `<Preload all />` inside Suspense.
- [ ] **Step 5: ScrollRig.jsx** — `lerp: 0.16`; remove altMode duplicated band logic, snap steps stay quarter-based but use BANDS: `setProgress(Math.round(raw * 4) / 4)` unchanged (quarters still match 4 zones: 0/0.25/0.5/0.75 land inside body/mind/spirit/summit under 15/40/70 banding — 0.25 ∈ mind ✓, 0.5 ∈ spirit ✓, 0.75 ∈ summit ✓).
- [ ] **Step 6: CameraSpline.jsx** — replace hardcoded band arithmetic with BANDS import; add hero pull-back: first 6% of BODY band camera retreats from `bodyClose` waypoint to `body`:

```js
const WAYPOINTS = {
  bodyClose: new THREE.Vector3(0, 0.9, 2.2), // hero cold-open: low, behind bar
  body: new THREE.Vector3(0, 0.4, 4),
  mind: new THREE.Vector3(0, 1.5, 6),
  spirit: new THREE.Vector3(0, 4, 5),
  summit: new THREE.Vector3(0, 7, 0),
};
// segment function: p in [0,0.06) → lerp(bodyClose, body, p/0.06), look fixed at LOOKS.body
```

- [ ] **Step 7: App.jsx Spacer** — `height: '2500vh'` → `'8000vh'` (altMode branch unchanged).
- [ ] **Step 8: Run suite + visual** — `npm test` PASS; `npm run dev`: zones appear/disappear at correct scroll distances; no shadow-map pass in renderer info (check `gl.shadowMap` unused).
- [ ] **Step 9: Commit** — `git commit -am "perf: zone culling, contact shadows, dpr budget, Lenis 0.16, hero pull-back waypoint"`

---

### Task 4: SkyDome aurora shader + Sun corona + Summit clouds

**Files:**
- Modify: `src/journey/three/SkyDome.jsx`, `src/journey/zones/Spirit.jsx`, `src/journey/zones/Summit.jsx`

**Interfaces:**
- Produces: SkyDome fragment with banded noise (`uTime` drift); Sun gets additive corona sprite (no postfx dependency). Summit gains cloud plane w/ noise displacement.

- [ ] **Step 1: SkyDome FRAG replacement**

```glsl
varying vec3 vWorldPos;
uniform vec3 uBottom; uniform vec3 uMid; uniform vec3 uTop;
uniform float uTime;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
void main() {
  float h = normalize(vWorldPos).y * 0.5 + 0.5;
  vec3 col = mix(uBottom, uMid, smoothstep(0.0, 0.5, h));
  col = mix(col, uTop, smoothstep(0.5, 1.0, h));
  // aurora bands: horizontal noise ribbons drifting, fading with altitude
  float band = noise(vec2(vWorldPos.x * 0.05 + uTime * 0.02, h * 3.0));
  float band2 = noise(vec2(vWorldPos.x * 0.03 - uTime * 0.015, h * 2.0 + 5.0));
  col += (uTop - uMid) * 0.18 * smoothstep(0.45, 0.75, h) * (band * 0.6 + band2 * 0.4);
  gl_FragColor = vec4(col, 1.0);
}
```

Add `uTime` uniform + `useFrame` clock write (same one-write pattern as Particles). VERT unchanged.

- [ ] **Step 2: Spirit.jsx Sun corona** — wrap Sun in additive glow:

```jsx
function Sun() {
  return (
    <group position={[0, 8, -10]}>
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#F0C75E" />
      </mesh>
      <sprite scale={[9, 9, 1]}>
        <spriteMaterial color="#F0C75E" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
}
```

(Solar texture on sprite optional; plain color + additive reads as glow at this scale.)

- [ ] **Step 3: Summit.jsx cloud layer** — noise-displaced plane:

```jsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CLOUD_VERT = `
  uniform float uTime;
  varying float vH;
  void main() {
    vec3 p = position;
    p.z += sin(p.x * 0.4 + uTime * 0.15) * 0.3 + sin(p.y * 0.5 + uTime * 0.1) * 0.2;
    vH = p.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`;
const CLOUD_FRAG = `
  varying float vH;
  void main() {
    vec3 col = mix(vec3(0.75, 0.72, 0.66), vec3(0.94, 0.90, 0.80), smoothstep(-0.4, 0.4, vH));
    gl_FragColor = vec4(col, 0.92);
  }`;

export function CloudLayer() {
  const mat = useRef();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime; });
  return (
    <mesh position={[0, 3.2, -4]} rotation={[-Math.PI / 2.55, 0, 0]}>
      <planeGeometry args={[40, 24, 48, 32]} />
      <shaderMaterial ref={mat} vertexShader={CLOUD_VERT} fragmentShader={CLOUD_FRAG} uniforms={uniforms} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}
```

Summit zone composition (replaces current 22 lines): ambient gold light, CloudLayer at `y≈3.2` (camera at summit `y=7` looks down through/above it), existing Words stay if any, plus timeline plaques arrive in Task 6.

- [ ] **Step 4: Run suite + visual** — `npm test` PASS. Dev scroll: SPIRIT sky ribbons drift; SUMMIT camera settles above soft clouds.
- [ ] **Step 5: Commit** — `git commit -am "feat: aurora sky shader, sun corona, summit cloud layer"`

---

### Task 5: DOM overlay choreography (word-mask reveals)

**Files:**
- Modify: `src/journey/DOMOverlays.jsx`
- Create: `src/lib/reveal.js`, `src/lib/reveal.test.js`
- Create: `src/styles/reveal.css`

**Interfaces:**
- Produces: `splitWords(text)` → `string[]`; `staggerDelay(i, per=60)` → `ms`. CSS classes `rv-word`, `rv-in`, `rv-out`. DOMOverlays uses bands import; panels keyed by zone; reveal state = zone changed.

- [ ] **Step 1: Test reveal utils**

```js
import { describe, it, expect } from 'vitest';
import { splitWords, staggerDelay } from './reveal.js';

describe('reveal utils', () => {
  it('splits into words', () => {
    expect(splitWords('Wake up. Game face on.')).toEqual(['Wake', 'up.', 'Game', 'face', 'on.']);
  });
  it('stagger steps by 60ms', () => {
    expect(staggerDelay(0)).toBe(0);
    expect(staggerDelay(3)).toBe(180);
  });
});
```

- [ ] **Step 2: Run, verify fails** → implement `splitWords = (t) => t.split(' ')`, `staggerDelay = (i, per = 60) => i * per`. Verify passes.
- [ ] **Step 3: reveal.css**

```css
.rv-word { display: inline-block; overflow: hidden; vertical-align: bottom; }
.rv-word > span {
  display: inline-block;
  transform: translateY(110%) scale(0.98); filter: blur(6px); opacity: 0;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s, opacity 0.6s;
}
.rv-in .rv-word > span { transform: translateY(0) scale(1); filter: blur(0); opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .rv-word > span { transition: opacity 0.3s; transform: none; filter: none; }
  .rv-in .rv-word > span { opacity: 1; }
}
```

- [ ] **Step 4: DOMOverlays rewrite** — import `splitWords/staggerDelay` + `zoneAt` from bands; PANELS get `zone` field matching `zoneAt` names (`body/mind/spirit/summit`); active panel derived via `zoneAt(progress)`; wrapper div gets className `rv-in` when zone active (mounted keyed by zone so remount triggers entrance); title/quote/caption words mapped:

```jsx
const W = ({ children, d }) => (
  <span className="rv-word"><span style={{ transitionDelay: `${d}ms` }}>{children}</span></span>
);
// quote: splitWords(z.quote).map((w, i) => <W key={i} d={staggerDelay(i)}>{w}</W>) joined with spaces
```

Panel switch: on zone change, previous panel fades out (className swap `rv-out` 300ms) then new mounts. Simplest correct: keep all 4 panels mounted, toggle `rv-in` per active zone — mount-once, class-toggle, GPU-only. Eyebrow: `translateX` slide via same class mechanism.
- [ ] **Step 5: Run suite + visual** — `npm test` PASS. Dev: scroll into MIND — words rise/blurs-in staggered; exiting zone reverses.
- [ ] **Step 6: Commit** — `git commit -am "feat: word-mask DOM reveals with stagger, reduced-motion crossfade"`

---

### Task 6: Timeline stations (Summit plaques) + Outro band + milestones

**Files:**
- Create: `src/journey/three/Plaques.jsx`, `src/sections/Outro.jsx`, `src/sections/milestones.json`
- Modify: `src/journey/zones/Summit.jsx`, `src/App.jsx` (mount Outro), `src/styles/tokens.css` (add `--gold-glow` shadow token)

**Interfaces:**
- Consumes: `useProgress`, `zoneAt`. Outro reads `milestones.json` (static import).
- Produces: Outro visible when `progress > 0.92`; counters animate via rAF count-up (respect altMode: no count animation, render final). Plaques: drei `<Text>` gold on obsidian plaque meshes at fixed positions on summit climb path (progress-driven opacity).

- [ ] **Step 1: milestones.json**

```json
{
  "yearsOnPath": 8,
  "trainingPhilosophy": "Iron sharpens the body. Stillness sharpens the mind.",
  "personalNote": "Edit these — your numbers, your words."
}
```

- [ ] **Step 2: Plaques.jsx** — three stations:

```jsx
import { Text } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useProgress } from '../../lib/progressContext.jsx';

const STATIONS = [
  { p: 0.74, pos: [-2.2, 4.6, -1.5], year: '2015', line: 'STOP wishing START doing.' },
  { p: 0.82, pos: [2.4, 5.4, -2.5], year: '2017', line: 'Dragon-flag era — Bruce Lee inspiration.' },
  { p: 0.9,  pos: [-1.8, 6.2, -3.5], year: '2018', line: 'Full-body training peak. 80 reactions.' },
];

export default function Plaques() {
  const grp = useRef();
  const { progress } = useProgress();
  useFrame(() => {
    grp.current?.children.forEach((c, i) => {
      const near = Math.max(0, 1 - Math.abs(progress - STATIONS[i].p) / 0.05);
      c.scale.setScalar(0.9 + near * 0.1);
      c.traverse((o) => { if (o.material) o.material.opacity = 0.15 + near * 0.85; });
    });
  });
  return (
    <group ref={grp}>
      {STATIONS.map((s, i) => (
        <group key={s.year} position={s.pos}>
          <mesh>
            <boxGeometry args={[2.2, 1.1, 0.06]} />
            <meshStandardMaterial color="#0A0A0C" metalness={0.4} roughness={0.5} transparent opacity={0.2} />
          </mesh>
          <Text position={[0, 0.28, 0.04]} fontSize={0.22} color="#C9A227" anchorX="center" outlineWidth={0.004} outlineColor="#000">{s.year}</Text>
          <Text position={[0, -0.12, 0.04]} fontSize={0.14} color="#E8E4DC" anchorX="center" maxWidth={2} overflowWrap="break-word" outlineWidth={0.004} outlineColor="#000">{s.line}</Text>
        </group>
      ))}
    </group>
  );
}
```

Mount inside Summit's ZoneBand. (troika Text transparency: set `material-transparent` prop via `material={{ transparent: true }}` on Text if opacity traversal needed — drei Text accepts `material` overrides; if traversal doesn't hit troika materials, set `transparent` + per-frame `text.material.opacity` refs directly. Executor: verify plaques fade near progress anchors, adjust to ref-array if traverse misses.)

- [ ] **Step 3: Outro.jsx**

```jsx
import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../lib/progressContext.jsx';
import m from './milestones.json';
import { BASE_URL } from '../lib/base.js';

const STATS = [
  { n: 105, label: 'MARKS' },
  { n: 3, label: 'DISCIPLINES' },
  { n: 3290, label: 'REACTIONS' },
  { n: m.yearsOnPath, label: 'YEARS ON THE PATH' },
];

function useCountUp(target, run, ms = 1200) {
  const [v, setV] = useState(run ? 0 : target);
  useEffect(() => {
    if (!run) return;
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return v;
}

export default function Outro() {
  const { progress, altMode } = useProgress();
  const run = progress > 0.92;
  return (
    <div aria-hidden={!run} style={{
      position: 'fixed', inset: 0, zIndex: 6, pointerEvents: run ? 'auto' : 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '2.5rem', opacity: run ? 1 : 0, transition: 'opacity 0.8s', padding: '4vh 6vw',
      background: run ? 'radial-gradient(ellipse at 50% 120%, rgba(201,162,39,0.14), transparent 60%)' : 'none',
    }}>
      {run && (
        <>
          <div style={{ display: 'flex', gap: 'clamp(2rem, 6vw, 5rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {STATS.map((s) => <Stat key={s.label} s={s} run={run} altMode={altMode} />)}
          </div>
          <p style={{ fontFamily: 'var(--font-quote)', fontStyle: 'italic', color: 'rgba(232,228,220,0.8)', fontSize: 'clamp(1rem, 2vw, 1.3rem)', maxWidth: '36rem', textAlign: 'center', margin: 0 }}>{m.trainingPhilosophy}</p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <img src={`${BASE_URL}assets/img/profile-hd.jpg`} alt="" width={56} height={56}
              style={{ borderRadius: '50%', boxShadow: '0 0 0 2px #C9A227, 0 0 24px rgba(201,162,39,0.4)' }} />
            <a href="/archive" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.25em', color: '#F0C75E', border: '1px solid #C9A227', padding: '1rem 2rem', textDecoration: 'none', fontSize: '0.85rem' }}>ENTER THE ARCHIVE →</a>
            <a href="https://www.instagram.com/elitehuman/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.25em', color: '#E8E4DC', textDecoration: 'none', fontSize: '0.85rem' }}>@ELITEHUMAN</a>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ s, run, altMode }) {
  const v = useCountUp(s.n, run && !altMode);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#F0C75E', lineHeight: 1 }}>{v.toLocaleString()}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(232,228,220,0.6)', marginTop: '0.5rem' }}>{s.label}</div>
    </div>
  );
}
```

- [ ] **Step 4: App.jsx** — mount `<Outro />` after `<DOMOverlays />` inside ProgressProvider (journey route only). Summit.jsx: add `<Plaques />`.
- [ ] **Step 5: Run suite + visual** — `npm test` PASS. Dev: scroll to end — stats count up, philosophy fades, logo + CTAs. Reduced-motion: final numbers render instantly, plaques static.
- [ ] **Step 6: Commit** — `git commit -am "feat: summit timeline plaques + stats outro band with count-up + milestones.json"`

---

### Task 7: Hero cold-open + profile logo fixed mark

**Files:**
- Modify: `src/journey/DOMOverlays.jsx` (hero variant of body panel), `src/App.jsx` (fixed logo), `src/styles/reveal.css`

**Interfaces:**
- Consumes: CameraSpline `bodyClose` pull-back (Task 3), profile-hd.jpg.
- Produces: hero title rises behind bar via existing `rv-word` mechanism + additional `translateY(30vh)` easing tied to first 6% progress (parallax-out on scroll start).

- [ ] **Step 1: App.jsx fixed logo** (journey route, after skip link):

```jsx
<a href="https://www.instagram.com/elitehuman/" target="_blank" rel="noreferrer" aria-label="EliteHuman Instagram"
  style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 20, lineHeight: 0 }}>
  <img src={`${BASE_URL}assets/img/profile-hd.jpg`} alt="EliteHuman" width={44} height={44}
    style={{ borderRadius: '50%', boxShadow: '0 0 0 1.5px #C9A227, 0 0 18px rgba(201,162,39,0.35)' }} />
</a>
```

- [ ] **Step 2: Hero title parallax in DOMOverlays** — body panel renders when `zoneAt(p) === 'body'`; add wrapper transform: `translateY(${clamp01(progress / 0.06) * -40}vh)` + opacity `1 - clamp01(progress / 0.06)` so title lifts and clears as camera pulls back (mount in same fixed container; pointer-events none).

- [ ] **Step 3: Visual** — Dev: load page → title behind bar silhouette, logo top-left gold-ringed; first scroll wheel: title lifts/fades, camera retreats, BODY copy takes over.
- [ ] **Step 4: Run suite** — `npm test` PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat: hero cold-open — title parallax-out behind bar, fixed gold-ring logo"`

---

### Task 8: Archive modernization

**Files:**
- Modify: `src/archive/Archive.jsx`, `Grid.jsx`, `Lightbox.jsx`
- Create: `src/styles/archive.css`

**Interfaces:**
- Consumes: existing posts flow. Lightbox gains `onNav(dir)` optional prop; Archive passes `{prev, next}` posts.

- [ ] **Step 1: archive.css** — editorial stagger grid + hover flood + tilt:

```css
.arc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem 1rem; }
.arc-card { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s; transform-style: preserve-3d; }
.arc-card:nth-child(even) { transform: translateY(2.5rem); }
.arc-card:hover, .arc-card:focus-visible { border-color: #C9A227; }
.arc-img { filter: grayscale(1) contrast(1.05); transition: filter 0.5s, transform 0.6s cubic-bezier(0.16,1,0.3,1); }
.arc-card:hover .arc-img { filter: grayscale(0) sepia(0.35) hue-rotate(-8deg) saturate(1.3); transform: scale(1.04); }
@media (prefers-reduced-motion: reduce) { .arc-card, .arc-img { transition: none; } .arc-card:nth-child(even) { transform: none; } }
@media (pointer: fine) { .arc-grid { perspective: 800px; } .arc-card.tilt { transform: translateY(2.5rem) rotate3d(var(--rx), var(--ry), 0, 4deg); } }
```

- [ ] **Step 2: Grid.jsx** — classes replace inline styles for card/grid/img; pointer-tracked tilt:

```jsx
const onMove = (e) => {
  if (e.pointerType === 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  e.currentTarget.style.setProperty('--ry', (x * 8).toFixed(2));
  e.currentTarget.style.setProperty('--rx', (-y * 8).toFixed(2));
  e.currentTarget.classList.add('tilt');
};
const onLeave = (e) => e.currentTarget.classList.remove('tilt');
// card: <article className="arc-card" onPointerMove={onMove} onPointerLeave={onLeave} ...>
```

Filter pills: active pill gold-filled; on filter change animate re-order via `order` style flip (CSS `transition` doesn't animate grid re-flow — acceptable: cards fade 250ms on remount via key={filter} on grid container).

- [ ] **Step 3: Lightbox.jsx** — full-bleed: image left 55%, caption right; pillar chip + date mono; arrow-key nav:

```jsx
// in key listener (post open):
if (e.key === 'Escape') onClose();
if (e.key === 'ArrowRight') onNav?.(1);
if (e.key === 'ArrowLeft') onNav?.(-1);
// nav buttons ‹ › fixed at viewport edges; backdrop blur: backdrop-filter: blur(8px)
```

Archive passes `onNav={(d) => { const i = list.findIndex(x => x.id === open?.id); const n = list[(i + d + list.length) % list.length]; setOpen(n); }}` — list = currently filtered list (filter state must lift from Grid to Archive).

- [ ] **Step 4: Run suite + visual** — `npm test` PASS. Dev `/archive`: stagger grid, hover gold flood + tilt, lightbox arrows loop within filter.
- [ ] **Step 5: Commit** — `git commit -am "feat: editorial archive — stagger grid, tilt+gold hover, full-bleed lightbox with keyboard nav"`

---

### Task 9: Playwright smoke + final verification

**Files:**
- Modify: `test/` (existing e2e specs — read dir first), possibly `playwright.config.js`

**Interfaces:** none new.

- [ ] **Step 1: Read existing test dir, extend journey spec** — assertions: (a) hero title visible at load, logo img present; (b) after `mouse.wheel` ×N or `evaluate(scrollTo)` progress > 0.9 → outro stats visible; (c) `/archive` renders 105 cards; (d) lightbox opens + ArrowRight changes caption. Mirror existing spec structure/helpers.
- [ ] **Step 2: Run `npm test` (vitest) + `npx playwright test`** — both green.
- [ ] **Step 3: Reduced-motion check** — dev server + emulate `prefers-reduced-motion: reduce`: snap sections work, no postfx crash, outro renders final numbers.
- [ ] **Step 4: Commit** — `git commit -am "test: e2e coverage for elevation — hero, outro, archive, lightbox nav"`

---

## Self-Review (done)

1. **Spec coverage:** perf fixes (T2/T3) ✓, bands 15/40/70 (T1) ✓, hero cold-open (T3 waypoint + T7) ✓, zone rebuilds incl. aurora/corona/clouds (T3/T4) ✓, DOM choreography (T5) ✓, timeline stations (T6) ✓, outro+stats+milestones (T6) ✓, logo fixed mark (T7) ✓, archive (T8) ✓, testing (T9) ✓. Logo asset usage: T6 outro + T7 fixed mark ✓.
2. **Placeholders:** none — every step has code; the one "executor: verify" note (plaque traverse) names the fallback.
3. **Type consistency:** `zoneAt/bandCenter/bandHalf/CULL_PAD` (T1) used verbatim in T3; `splitWords/staggerDelay` (T5) used in T7; `onNav(dir)` (T8) matches Archive wiring.
