# Craft Floor — Elite Human high-contrast street

Date: 2026-09-25
Mode: Persuade / Read
Baseline: DESIGN.md direction contract. Tokens in src/styles.css.

## Checkpoints

### Visual targets
- Desktop 1440px: hero oversized t-hero, left-aligned, product-first /shop first viewport
- Mobile 375px: wordmark, nav compact, filters scroll, cart sheet full-width, tappable 44px targets

### Contrast & color
- Text/ink vs paper: #FAFAFA on #0A0A0A ≥ 18:1
- Ink-2 vs paper: #A8A8A8 on #0A0A0A ≥ 7:1
- Accent clay #C44A2C: buttons/focus rings readable
- No other hue introduced; photos only color outside palette

### Type
- Display: Archivo Black uppercase, tracked, clamp scaling
- Body: Spectral regular/300, lede 1.125–1.5rem
- Mono: Space Mono for labels/meta/tabs; tabular-nums for prices/counts
- Hierarchy: h1 t-hero → t-section → t-title → t-body

### Layout & rhythm
- Gutters: --gut clamp(1.25rem,4vw,4rem)
- Sections: hard 1px rule --rule
- Grid: shop 1/2/3 col; archive 2/3/4 col; product detail 1fr 1fr ≥900px
- Cards: rectangular, no radius, hairline bottom rule, grayscale→color hover

### Component states
- Masthead sticky, cart badge count visible
- Filters: aria-pressed true → underline rule-firm
- Product card: image grayscale default, color on hover/focus
- Size picker: .is-active border/background swap
- Cart sheet: scrim, close on Esc/overlay click, empty state
- Lightbox: focus trap, Esc closes, ArrowLeft/Right step
- Focus-visible: 2px clay ring

### Copy & content
- Captions verbatim from posts.json, no rewrite
- Brand line exact: “Wear Discipline. Train Body. Discipline Mind. Elevate Spirit.”
- Shop blurbs product-first, no invented claims
- Prices formatted $xx, tabular

### Performance & a11y
- Images lazy-loading, width/height set, aspect-ratio preserved
- Buttons min-height 44px
- Links underline-offset 0.25em
- Selection background clay
- Reduced motion respects prefers-reduced-motion

### Issues to verify
- Product-2..6.jpg currently placeholders (copies of product-1). Replace with real product photos for launch.
- Verify /shop?pillar=IRON / MIND filter URL persistence.
- Verify cart localStorage persists after reload.
- Verify 404 for unknown /shop/:id and /post/:id shows empty state.

## Screenshots needed
- Desktop 1440: /  /shop  /shop/:id  /archive  /post/:id
- Mobile 375: /  /shop  /shop/:id  cart open
- States: empty cart, filter active, out-of-stock (stock>0 now)

## Next actions
- Swap placeholder product images for real product photography per provenance.
- Run visual regression capture 1440+375 via artifact.
- Harden error states, 404, empty filters.
