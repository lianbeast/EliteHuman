<!-- impeccable:design-contract 1 -->

# Elite Human — Design Direction

**Chosen world: high-contrast street.** Bold black on bone, oversized
lettering, brutalist structure, product-first. The archive is the brand's proof,
not its front page. This replaces the incumbent monochrome editorial look
(`.superdesign/design-system.md`); the old system is anti-reference, not
authority. Product truth, routes, captions, and counts from PRODUCT.md survive.

## Thesis
A streetwear brand page does not introduce itself with a paragraph. It leads
with the product — a full-bleed garment on the first viewport — and lets the
record earn belief later. The archive is a secondary route, reached from the
nav, that proves the brand is a three-year practice rather than a logo.

## Surface mode
`Persuade` on `/` and `/shop` and `/shop/:id` (visitor decides whether to buy).
`Read` on `/archive` and `/post/:id` (visitor reads the record).

## Direction contract
- **Palette:** black `#0A0A0A` / bone `#FAFAFA` / accent clay `#C44A2C`
  (single hue, used sparingly — buttons, active states, one highlight per
  section). No other color. Photographs are the only other source of hue.
- **Type:** display = `Archivo Black`, self-hosted via `@fontsource`, uppercase
  and tracked; body = `Spectral`; data/labels = `Space Mono`. Numerals, prices,
  counts are tabular (`font-variant-numeric: tabular-nums`). Display scale caps
  at 6rem. No system face may stand in for the display voice — if the display
  package is not installed the build fails rather than falling back to Impact.
- **Layout:** full-bleed sections, hard 1px rules, left-aligned, generous
  gutters. Oversized display type breaks the grid deliberately. Cards are
  rectangular product panels, never the old square photo cards.
- **Motion:** one authored moment (the hero photograph reveal via `clip-path`
  + `opacity`, with a staggered rise on the hero type), `ease-out` everywhere
  else. No parallax, no scroll-jacking.
- **States:** product hover (scale + shadow), cart badge count, filter
  active, empty cart, out-of-stock, 404.

## Components
- **Wordmark:** the brand's own stacked lockup — chrome shield above chrome
  "ELITE HUMAN" — as `brand/logo.png` (transparent, 1444×699). Sized by height
  only so the intrinsic ratio never shifts masthead rhythm: 32–42px in the
  masthead, 56–112px in the footer. Chrome reads on the dark paper and is the
  brand asset, not a theme inversion. Favicons use the shield alone:
  `brand/mark-32/192/512.png`. The 368 KB `EliteHuman-Logo.png` is a rejected
  asset — mojibake line, baked-in carousel chevron, photographic background.
  It ships nowhere and must not return to `public/`.
- **Nav:** slim full-bleed bar, brand left, links right. Mobile collapses to a
  sheet.
- **Hero:** full-bleed the record's own strongest photograph (post
  `1870461511266088094`, 80 likes — founder mid-session) rather than a stock
  garment. Grayscale + `contrast(1.06)` so the archive's only hue stays the
  page's only hue; two-stop left-to-right scrim for type legibility. Display
  type set at 9ch measure over it. `figcaption` carries
  `no · date · pillar · likes` and links to the post, so the "this is the
  record" claim is auditable rather than asserted. Below it the pillar counts
  run as a hairline-divided tabular row, each cell a link into
  `/archive?pillar=`.
- **Product card:** image, name, price, pillar tag. Rectangular, no rounded
  corners, one hairline bottom rule.
- **Cart sheet:** slides in from the right on a scrim. Line items, total,
  checkout CTA. Empty state is a real state.
- **Archive grid:** now a documentary grid — 2/3/4 cols, monochrome photos,
  grayscale default, color on hover (kept from the old system — it earned its
  place). Filter row is mono labels with counts.

## Anti-goals
- No gradient text, no glass, no rounded-card softness, no centered body
  paragraphs, no section numbers as decoration, no invented logo mark, no
  emoji as icons, no third-party font script beyond the two families.