# EliteHuman — 3D Immersive Ascent Site: Design Spec

Date: 2026-09-04
Status: Approved by client (design sections 1–5, this conversation)
Project root: `/mnt/data/Applications/Play-Site/EliteHuman`

## 1. Subject

EliteHuman — personal transformation brand (body + mind + spirit) built on the
owner's Instagram content (@elitehuman, 105 posts, 2018 era: gym photography +
long passionate captions mixing hustle/mindset/spirituality).

- **Audience:** fitness-oriented people hungry for depth beyond aesthetics.
- **Page's single job:** the visitor *feels* an ascent from iron to gold in one scroll.
- **Site goal:** immersive brand showcase (no commerce, no funnel). Secondary page:
  browsable archive of the 105 IG posts.

## 2. Core Concept — Color = Altitude

The background/palette maps to scroll depth. Gold is not an accent — it is the
destination. Scroll is altitude.

### Palette (tokens)

| Token | Hex | Role |
|---|---|---|
| Obsidian | `#0A0A0C` | Floor — night iron, page base |
| Iron | `#1C1D22` | Steel, plates, mid-dark structure |
| Chalk | `#E8E4DC` | Body text, high contrast on obsidian |
| Ember Gold | `#C9A227` | Mind-zone glow, links |
| Solar Gold | `#F0C75E` | Summit bloom peak |

### Typography (3 voices = 3 pillars)

- **Big Shoulders** — condensed industrial display. Zone titles, hero.
  (@fontsource/big-shoulders-display)
- **Spectral** — literary serif. Quote captions in 3D space and DOM.
  (@fontsource/spectral)
- **Space Mono** — eyebrows, altitude readouts, chalk-stencil utility.
  (@fontsource/space-mono)

## 3. Journey Page (index route) — Scroll = Altitude

Camera on a CatmullRom spline; Lenis smooth scroll; one `progress` scalar
(0–1) drives camera position, fog, palette lerp, DOM text reveals, and the
Ascent Meter. ~6 viewport-heights per zone; total scroll ≈ 24–28 vh-units.

### Zones

| Zone | Progress | Altitude marker | 3D world | Copy (from real captions) |
|---|---|---|---|---|
| BODY | 0–25% | `LVL 01 — IRON` | Procedural gym: barbell + plates built from primitives (no GLB), floor grid, chalk-dust particles, hard white rim light, obsidian fog. Camera starts bench-press POV (lying, looking up at loaded bar). | "We create our own circumstances." → "Ordinary isn't gonna cut it." |
| MIND | 25–60% | `LVL 02 — FRACTURE` | Shattered light-shards (additive planes); caption words floating in 3D as chalk text: BREATHE · GAME FACE · GREATNESS · ORDINARY ✕. | "Wake up. Game face on." "This is life testing you." |
| SPIRIT | 60–90% | `LVL 03 — VIBRATION` | Custom gold-gradient sky dome shader; ascending particle column ("vibrations"); sun sprite; bloom peak. | "With faith we emit vibrations into the universe — and attract what we want most." |
| SUMMIT | 90–100% | `APEX` | Camera settles above cloud layer, still. | "You are an elite human." CTA → Archive ("See the 105 marks") |

### Signature UI element — Ascent Meter

Fixed hairline gold gauge on the right edge, fills with scroll; Space Mono
altitude readout (`ALT 0.42 — MIND`). Encodes the whole metaphor. Everything
else on the page stays quiet around it.

### Zone transitions

Brief chromatic aberration pulse between zones (reality bending between planes).
Disabled on mobile and when `prefers-reduced-motion`.

### Profanity

Captions keep their authentic raw voice ("wake the f*** up"). Client has veto.

### Preloader

"CHALKING HANDS" — plate-loading counter 0–100%. Sets tone, gates heavy scene init.

## 4. Archive Page ("The 105 Marks")

- Monochrome plate grid: chalk captions on obsidian; images desaturated until
  hover, when gold floods in.
- Filters: IRON / MIND / SPIRIT — auto-tagged by caption-keyword classifier,
  then a client review pass before ship.
- Click → lightbox: full caption, date, IG link.
- Subtle CSS `perspective()` tilt; no 3D engine on this page.

## 5. Tech Architecture

```
Vite + React 18 + @react-three/fiber + drei + postprocessing
Lenis (smooth scroll) · troika-three-text (3D words) · @fontsource (self-hosted)
```

### Structure

```
EliteHuman/
  index.html            (Vite root)
  src/
    main.jsx
    App.jsx             — router: journey / archive
    journey/
      Journey.jsx       — canvas + scroll rig
      ScrollRig.jsx     — Lenis + progress scalar (single source of truth)
      zones/Body.jsx Mind.jsx Spirit.jsx Summit.jsx
      AscentMeter.jsx
      Preloader.jsx
      shaders/SkyDome.js Particles.js
    archive/
      Archive.jsx Grid.jsx Lightbox.jsx pillarClassify.js
    styles/             — tokens.css, journey.css, archive.css
  public/assets/
    posts.json          — {id, caption, date, pillar, img, likes, igUrl}
    img/                — downloaded IG photos (local; CDN URLs expire)
  tools/
    scrape.mjs          — Apify profile run → image download → posts.json → pillar tagging
```

### Scroll rig

One `progress` value (0–1) drives: camera spline position, fog density, palette
lerp (obsidian→gold), DOM text reveals, Ascent Meter. No other scroll state.

### Scrape pipeline (`tools/scrape.mjs`)

1. Apify `apify/instagram-profile-scraper` full-profile run (all 105 posts).
2. Download every image locally (Instagram CDN URLs expire — never hotlink).
3. Emit `public/assets/posts.json` with {id, caption, date, pillar, img, likes, igUrl}.
4. Keyword classifier assigns pillar tags (IRON/MIND/SPIRIT) client reviews.

### Performance

- DPR clamp 1.5–2; particle counts per device tier.
- Mobile: drop chromatic aberration, lower bloom resolution.
- Bundle target < 500KB gz initial; LCP < 2.5s desktop.
- Static deploy (any CDN/static host).

### Accessibility floor

- `prefers-reduced-motion` → static camera per zone, scroll-snap sections, no Lenis.
- All key text lives in DOM; 3D words are decorative only.
- Archive images alt-texted; chalk-on-obsidian contrast ≥ 7:1; visible focus rings.

## 6. Build Sequence

1. Scaffold + scrape pipeline (data first — informs copy)
2. Journey skeleton (scroll rig + spline + zones blocked out)
3. Zone polish (materials, particles, words)
4. Postfx + transitions
5. Archive page
6. Preloader + perf/a11y pass
7. Static deploy

## 7. Out of Scope

- Commerce, newsletter, coaching funnel, contact forms.
- CMS — content is a static JSON snapshot of the 2018 IG archive.
- Multi-language.
- Real-time IG sync — pipeline re-runs manually.
