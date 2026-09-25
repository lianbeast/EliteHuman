# Elite Human — Design System (v1, archive-first)

Monochrome editorial. The photographs are the only color on the site; everything
else is black, white, and hairline rules. Type does the work.

---

## 1. Product context

**What it is:** a public archive of 105 Instagram posts by @elitehuman, written and
photographed by one person between October 2015 and November 2018. Every image
and caption on the site is real content pulled from that account — nothing is
placeholder, nothing is stock, nothing is generated.

**What it is not:** not a store. There is no cart, no checkout, no product page.
Not a blog either — there is no long-form writing; the captions *are* the writing.

**Job to be done:** a visitor lands, understands in ~3 seconds that this is a
three-year record of somebody training and thinking out loud, can browse it by
theme, and can read any single post in full.

**The three pillars** (assigned per post by caption keywords, in `tools/scrape.mjs`):

| Pillar  | Posts | What it covers                                    |
| ------- | ----- | ------------------------------------------------- |
| `IRON`  | 83    | Training, physique, effort, the gym, consistency  |
| `MIND`  | 20    | Mindset, focus, ambition, circumstance, discipline |
| `SPIRIT`| 2     | Faith, breathing, meditation, gratitude            |

IRON dominates 4:1. The visual system must not make SPIRIT feel like an
afterthought or a rounding error — it is a third of the brand, just a small
sample of the archive.

**Voice:** first person, plainspoken, unpolished. The captions are full of
emojis, `#hashtags`, and `—` separators used as rules. Do not rewrite them into
marketing copy. Show them as written. Where a caption is long (up to 1,562
chars), the full text belongs in the post view; the grid shows only a trimmed
opening.

**Audience:** people who already know the account, plus strangers who land on a
single shared post and want context.

---

## 2. Architecture

Three routes, no more:

| Route        | Purpose                                                        |
| ------------ | -------------------------------------------------------------- |
| `/`          | Home. Brand statement + a curated slice of the archive.        |
| `/archive`   | The full 105. Filterable grid, chronological, with lightbox.   |
| `/post/:id`  | One post. Full image, full caption, prev/next, link to source.  |

**Home is not a duplicate of the archive.** Home = statement + preview. Archive =
the whole record, with controls. If a section could live on either page, it lives
on the archive.

**Data:** `public/assets/posts.json`, fetched at runtime. Fields: `id`, `caption`,
`date` (ISO), `pillar`, `img` (`img/<id>.jpg`), `likes`, `igUrl`. Images live in
`public/assets/img/`. 105 posts, 106 images (one extra is the profile avatar).

---

## 3. Color

Monochrome. One neutral ramp, one hairline, zero accent hues.

```css
--paper:      #FAFAFA;  /* page background, light */
--ink:        #0A0A0A;  /* primary text, light theme */
--ink-2:      #6B6B6B;  /* secondary text, captions, metadata */
--ink-3:      #A8A8A8;  /* tertiary, disabled, placeholder */
--rule:       rgba(10, 10, 10, 0.12);   /* hairlines, borders */
--rule-firm:  rgba(10, 10, 10, 0.28);   /* focus rings, active states */
--void:       #0A0A0A;  /* page background, dark theme */
--bone:       #FAFAFA;  /* primary text, dark theme */
--bone-2:     #A8A8A8;
--bone-3:     #6B6B6B;
--rule-dark:  rgba(250, 250, 249, 0.16);
```

**Rules:**
- No accent color. No red, no ember, no brand blue. The photographs are the sole
  source of hue on the site.
- Dark mode is a genuine theme (`prefers-color-scheme`), inverting the ramp. It
  is not an optional flourish — the archive should feel right in a dark room.
- Hairlines carry all structure. If a layout needs a box to be readable, it
  needs more whitespace, not a heavier border.
- Colored text is forbidden. The Instagram link is underlined, not blue.

---

## 4. Typography

Two families, self-hosted via `@fontsource` — no external font requests.

**Spectral** — a serif with a literary, slightly editorial voice. Display and
body. Weights 200–800 available; this system uses 200, 400, 600, 700.

**Space Mono** — a monospace. Every piece of metadata, label, numeral, and index.
Weights 400, 700. Never used for paragraphs — it is a labelling voice, not a
reading one.

```css
--font-display: 'Spectral', Georgia, serif;
--font-body:    'Spectral', Georgia, serif;
--font-mono:    'Space Mono', ui-monospace, monospace;
```

### Type scale

| Token           | Family   | Size                          | Weight | Tracking  | Case |
| --------------- | -------- | ----------------------------- | ------ | --------- | ---- |
| `--t-hero`      | Spectral | `clamp(3.5rem, 13vw, 11rem)` | 700    | `-0.03em` | none |
| `--t-section`   | Spectral | `clamp(2.25rem, 6vw, 4.5rem)`| 700    | `-0.02em` | none |
| `--t-title`     | Spectral | `clamp(1.5rem, 3vw, 2.25rem)`| 600    | `-0.01em` | none |
| `--t-body`      | Spectral | `1.0625rem` (17px)            | 400    | `0`       | none |
| `--t-lede`      | Spectral | `1.375rem` (22px)             | 300    | `0`       | none |
| `--t-label`     | Mono     | `0.6875rem` (11px)            | 700    | `0.18em`  | UPPER |
| `--t-meta`      | Mono     | `0.75rem` (12px)              | 400    | `0.08em`  | none |

**Rules:**
- Hero and section headings set tight (`line-height: 0.92` for hero, `1.02` for
  section). Body sets at `1.65`. Captions set at `1.6` — slightly looser than
  body, because these are someone else's words and should feel unhurried.
- Labels are uppercase, 11px, tracked `0.18em`. They are the connective tissue of
  the layout — use them liberally for section numbering, filters, and metadata.
- Never center a paragraph of body text. Measure stays at 34rem / 68ch.
- Numerals in the archive (post numbers, like counts, dates) are always mono.

---

## 5. Space, layout, structure

8px base scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`.

```css
--gut:  clamp(1.25rem, 5vw, 5rem);  /* page side gutter */
--max:  100rem;                      /* content ceiling */
```

- **Page shell:** side gutters via `--gut`, content ceiling `--max`, centered.
- **Vertical rhythm:** sections separated by `1px solid var(--rule)` full-bleed
  rules and 96–192px of space. Never by a card, never by a background change.
- **Photo grid:** the archive grid is 2 columns mobile, 3 at ≥768px, 4 at ≥1280px.
  Gutter 16–24px. Photos are square-cropped (`object-fit: cover`) so the grid
  stays even regardless of source aspect.
- **The grid is the page.** On `/archive`, the grid starts high — minimal header,
  filter row, then photos. No intro section competing with the content.
- **Alignment:** everything left-aligned. No centered layouts except a single
  statement line in a hero, and even that is left-aligned on desktop.
- **Asymmetry is welcome:** cards may vary in height, and a section may start at
  a different left offset. But the outer gutter is sacred.

---

## 6. Photo treatment — the one rule that matters

**All photographs are grayscale by default. Hover or focus returns full color.**

```css
.photo { filter: grayscale(100%) contrast(1.02); transition: filter 240ms ease-out; }
.photo:hover, .photo:focus-visible { filter: none; }
```

- Grayscale, not reduced opacity or opacity-over-black. Desaturation keeps the
  tonal range intact; a dark overlay kills it.
- On touch devices (no hover), the grid shows grayscale permanently; the post
  view shows full color. Never block content behind a hover-only reveal.
- In the lightbox and post view, images are **full color** — the reveal has
  already happened, and the reader has committed to that post.
- Post detail images are shown at `max-height: 80vh`, `object-fit: contain`,
  never cropped. These are the real artifacts.
- `loading="lazy"` on everything below the first row.

---

## 7. Components

**Archive grid card** — square photo, no border, no shadow, no rounded corner
except a deliberate asymmetry (`0 0 2px 0` at most). Below the photo, a mono
metadata line: post number, date, like count. The whole card is one click target
opening the lightbox. Cards are `<button>`, not divs.

**Pillar filter** — a single row of mono labels: `ALL · IRON 83 · MIND 20 ·
SPIRIT 2`, each with its count always visible so the distribution is legible
without clicking. Active state: ink underline (`--rule-firm`), 1px. Not a pill,
not a filled chip. Filters live in the URL query so a filtered view is
shareable.

**Lightbox** — full-bleed overlay, `rgba(10,10,10,0.96)`. The post image at
natural aspect, caption below in `--t-body`, prev/next arrows, `←` and `→`
keyboard navigation, `Escape` to close. Focus is trapped; on close, focus
returns to the card that opened it.

**Post view** — single column, 68ch. Image full color. Caption verbatim,
preserving emoji, hashtags, and line breaks. Below: date, pillar, like count, and
a plain underlined link to the original on Instagram. Prev/next at the page
edges.

**Section label** — mono, 11px, uppercase, tracked, prefixed with a numeral
(`01 — THE RECORD`). The numbering makes the page scannable as an index.

**Hairline** — `1px solid var(--rule)`. Full-bleed for section breaks, inset for
metadata separators. The only divider in the system.

**No cards.** There are no elevated surfaces, no shadows, no background panels
differentiating one region from another. Structure comes from type, space, and
rules.

---

## 8. Motion

Restrained. The content is archival; motion should confirm, not perform.

| Interaction          | Motion                                          |
| -------------------- | ----------------------------------------------- |
| Photo grayscale→color | `filter` 240ms `ease-out`                       |
| Link / button hover  | `opacity` or `border-color`, 120ms              |
| Lightbox open / close| `opacity` + `scale(0.98 → 1)`, 160ms             |
| Filter change         | grid reflow, no animation beyond the photo fades |
| Page transition       | none                                            |

- One easing curve: `cubic-bezier(0.2, 0, 0, 1)` for layout, `ease-out` for
  color. No bounce, no spring, no parallax, no scroll-jacking, no marquee.
- `prefers-reduced-motion: reduce` → all transitions and transforms to 0ms. The
  grayscale reveal is the one exception: it still works, it just switches
  instantly.

---

## 9. Accessibility

Non-negotiable, not a pass at the end.

- **Contrast:** ink `#0A0A0A` on paper `#FAFAFA` is 18.9:1. Secondary `#6B6B6B` on
  paper is 5.1:1. Both clear AA for their sizes. Dark theme mirrors this.
- **Grayscale photos are decorative content with a text alternative** — every
  post card carries the post number and date as text, so a screen-reader user
  gets the structure even though the image is monochrome. Photos use `alt`
  describing the post, never a filename.
- **Focus is always visible:** `outline: 1px solid var(--rule-firm)` with 2px
  offset, on a dark background `outline-color` flips to `--bone`. Never
  `outline: none` without a replacement.
- **Lightbox:** `role="dialog"` `aria-modal="true"`, focus trapped, labelled by
  the post number, focus restored to the invoking card on close.
- **Filters** are real `<button>`s with `aria-pressed`. The count lives in the
  accessible name (`"IRON, 83 posts"`).
- **Target size:** 44×44px minimum on all interactive elements, including grid
  cards and arrows.
- **Headings** are a single ordered hierarchy per page, no skipped levels.
- **Keyboard:** full archive navigation without a mouse — cards are focusable in
  DOM order, lightbox traps and restores, `←`/`→` move between posts.
- **Motion:** honoured per §8.

---

## 10. Non-negotiables

Things a generated design must not do, in this project:

1. No accent color, no gradients, no neon, no glassmorphism.
2. No rounded card containers, no shadows, no floating panels.
3. No fabricated copy. Only real captions and real counts from `posts.json`.
   Numbers must be exact: 105 posts, 83 IRON, 20 MIND, 2 SPIRIT, 2015–2018.
4. No product imagery, no shop UI, no cart, no price.
5. No invented logo mark, no initials-as-logo, no SVG substitute. The wordmark
   is the text "ELITE HUMAN" set in Spectral — it is a wordmark, not a logo
   image, and that is the intended treatment.
6. No dark mode as a bolted-on toggle unless both themes are designed properly.
7. No third-party font or script requests. Spectral and Space Mono only.
