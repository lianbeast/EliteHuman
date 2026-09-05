# EliteHuman — Site Elevation: Design Spec

Date: 2026-09-05
Status: Approved in conversation (all sections). Supersedes nothing — extends `2026-09-04-elitehuman-3d-ascent-site-design.md`.
Project root: worktree `main-2`

## 0. Problem

Frontpage sluggish + visually basic. Causes audited in current code:

1. `Particles.jsx` mutates 550 particle positions per frame in JS, re-uploads buffer each frame.
2. No zone culling — all 4 zones, shadows, postfx render constantly.
3. `dpr=[1.5, 2]` + full-res Bloom + ChromaticAberration on retina.
4. Lenis `lerp: 0.1` — laggy trailing feel.
5. Default shadow maps, unconfigured.

Inelegance: primitive zones (2-cylinder barbell, random shards, flat gradient dome), static DOM panels.

## 1. Goals

- 60fps scroll journey; GPU-only animation loops.
- Max-drama zone visuals on top of the perf-clean base.
- Full brand arc: hero cold-open → 4 zones + timeline stations → stats outro.
- Archive elevated to editorial grade.
- All reduced-motion paths preserved.

## 2. Perf Foundation (Task: everything else sits on this)

| Fix | Implementation |
|---|---|
| GPU particles | `Particles.jsx`: positions static in buffer; `useFrame` writes single `uTime` uniform; vertex shader computes rise/drift via `mod()`. 550→0 CPU ops/frame. Same props API (`count, area, color, size, opacity`). |
| Zone culling | Each zone: `useFrame` sets `group.visible = |progress - bandCenter| < bandHalf + 0.08`. Shadow casters included. |
| DPR budget | `dpr={[1, 1.75]}`; Bloom resolution halved on touch (`isTouch` flag already exists). |
| Lenis | `lerp: 0.16`, `wheelMultiplier: 1.0`. |
| Shadows | Drop real-time shadow maps entirely. Contact-shadow planes under barbell/plates + AO-ish vignette via postfx. Static feel, zero cost. |
| Material warm-up | After preloader, `requestIdleCallback` pre-compile zone materials (drei `<Preload all />`). |

## 3. Journey Rebuild — 8000vh, Bands 15/40/70

Scroll spacer: 2500vh → **8000vh** (altMode stays 4×100vh snap sections).
Bands: BODY 0–15%, MIND 15–40%, SPIRIT 40–70%, SUMMIT 70–100%.
All consumers of band constants (DOMOverlays, AscentMeter, CameraSpline, CAPulse, ScrollRig altMode) retuned to single `BANDS` export from one module (`src/lib/bands.js`).

### Hero cold-open (0–6%)
- Camera low, behind barbell silhouette, looking up.
- ELITEHUMAN in Big Shoulders rises behind bar as chalk swirls settle; camera pulls back over first 6%.
- Profile logo (gold ring, `public/assets/img/profile-hd.jpg`) top-left, fixed.
- Iron-cold palette; gold only hinted (logo ring + ascent meter hairline).

### BODY — LVL 01 IRON (0–15%)
- POV chalk-dust (GPU), rack + plate stacks (instanced), breathing floor grid pulse (shader).
- Words: BREATHE. GAME FACE. chalk-stencil.

### MIND — LVL 02 FRACTURE (15–40%)
- Shards get shader: refractive/gold-tinted, band-entrance burst animation.
- CA pulse stronger at 15% and 40% boundaries.
- Floating words orbit slow.

### SPIRIT — LVL 03 VIBRATION (40–70%)
- SkyDome: aurora-band gradient shader (2D noise bands, subtle drift).
- Rising gold particle column denser (600, still GPU).
- Sun with soft corona (sprite + additive glow, no postfx dependency).

### SUMMIT — APEX (70–100%)
- Timeline stations on final climb — 3 plaques (Space Mono, gold hairline):
  1. 2015 "STOP wishing START doing." (first post)
  2. 2017 dragon-flag Bruce Lee era (60-like post)
  3. 2018 full-body training peak (80-like top post)
- Camera settles above cloud layer: noise-textured plane, shader-displaced, soft.
- APEX panel + archive CTA.

### Outro band (DOM, after summit settle ~92–100%)
- Stats counters animate in: 105 marks · 3 disciplines · 2015→2018 · 3,290 reactions.
- Personal milestones from `src/sections/milestones.json` (placeholders: `yearsOnPath: 8`, `trainingPhilosophy`) — owner edits after ship.
- Profile logo, socials row, archive CTA.

## 4. DOM Overlay Choreography

- Word-mask reveals: each word wrapped `<span>` with clip mask, `translateY + blur` in, 60ms stagger, triggered on band entry, reverse-out on exit.
- Kinetic eyebrow: altitude readout + zone code slide horizontally as progress crosses bands.
- GPU-only properties (transform/opacity/filter). No layout props animated.
- Reduced motion: crossfade only; altMode snap quarters retained.

## 5. Archive Modernization

- Editorial stagger grid (2-col offset rows), images desaturated → gold flood on hover (CSS `filter: sepia+hue-rotate`).
- Pointer-tracked 3D tilt, max 4°, `perspective: 800px`, disabled reduced-motion + touch (tap → lightbox directly).
- Filter pills: animated selection; FLIP-lite re-order (transform transitions, no library).
- Lightbox: full-bleed obsidian, Spectral caption, Space Mono date/IG-link, pillar chip, arrow-key nav, Esc close.
- 105 posts unchanged; classifier untouched.

## 6. Files

```
src/lib/bands.js                     (new: single BANDS source)
src/journey/three/Particles.jsx      (GPU rewrite)
src/journey/three/SkyDome.jsx        (aurora shader)
src/journey/zones/Body.jsx Mind.jsx Spirit.jsx Summit.jsx
src/journey/CameraSpline.jsx        (waypoints + hero pull-back)
src/journey/DOMOverlays.jsx          (word-mask choreography)
src/journey/AscentMeter.jsx          (band retune)
src/App.jsx + src/journey/ScrollRig.jsx (8000vh, lerp 0.16)
src/sections/Outro.jsx               (new)
src/sections/milestones.json         (new, owner-editable)
src/archive/Grid.jsx Lightbox.jsx Archive.jsx
public/assets/img/profile.jpg profile-hd.jpg   (added)
```

## 7. Testing

- Vitest: extend for `bands.js` math, word-mask stagger utility, Outro counter logic; existing easing/classifier/ScrollRig tests stay green.
- Playwright smoke: hero renders, scroll reaches summit, outro stats visible, archive loads 105, lightbox opens + keyboard nav.
- Manual: reduced-motion + touch paths.
- Perf acceptance: journey scroll holds 60fps desktop (Chrome, M-class GPU), no per-frame buffer uploads (verified by code inspection).

## 8. Non-goals

- No new dependencies. No commerce, no CMS. No archive re-classification. Logo stays as IG profile silhouette.
