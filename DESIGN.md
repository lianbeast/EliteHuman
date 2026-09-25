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
- **Type:** display = a condensed grotesque set via Google Fonts
  (`Oswald`/`Inter`), body = `Inter`. Numerals, prices, counts are tabular
  (`font-variant-numeric: tabular-nums`). Labels are uppercase, tracked.
  The old Spectral/Space-Mono literary voice is retired.
- **Layout:** full-bleed sections, hard 1px rules, left-aligned, generous
  gutters. Oversized display type breaks the grid deliberately. Cards are
  rectangular product panels, never the old square photo cards.
- **Motion:** one authored moment (the hero garment reveal via `clip-path`
  + `opacity`), `ease-out` everywhere else. No parallax, no scroll-jacking.
- **States:** product hover (scale + shadow), cart badge count, filter
  active, empty cart, out-of-stock, 404.

## Components
- **Wordmark:** text "ELITE HUMAN" in the display face, uppercase, tracked.
  Paired with the brand shield (`public/brand/shield.svg`) at ~0.7× cap height.
  The shield is `currentColor`-masked so it inverts with the theme; the text is
  the wordmark, the shield is the mark.
- **Nav:** slim full-bleed bar, brand left, links right. Mobile collapses to a
  sheet.
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