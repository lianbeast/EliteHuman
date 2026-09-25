<!-- impeccable:product-schema 1 -->

# Elite Human — Product Record

## What it is
Elite Human is a gym + street clothing brand, built around one real three-year
record: 105 Instagram posts by @elitehuman, October 2015 – November 2018, written
and photographed by one person. The archive is the brand's proof. The shop is
the product. The brand voice is first-person, plainspoken, unpolished.

## Job to be done
A visitor lands on a clothing brand site and needs to know, within seconds:
*what you sell, why it is worth wearing, and what the record behind it is.*
The shop answers the first. The archive answers the second. Neither is
decorative.

## Audience
People who already follow @elitehuman, plus strangers who arrive via a product
or a post and want the context of the record behind the mark.

## Evidence
Real content, nothing invented:
- `public/assets/posts.json` — 105 records: `id`, `caption`, `date`, `pillar`,
  `img`, `likes`, `igUrl`.
- `public/assets/img/` — 106 original photographs (105 posts + 1 founder profile).
- Pillar split is fixed by the archive itself: IRON 83, MIND 20, SPIRIT 2.
- Brand line, verbatim: *Wear Discipline. Train Body. Discipline Mind. Elevate Spirit.*

## Constraints
- No backend, no auth, no server. Static site, runtime data fetch, cart held in
  localStorage. Checkout is a local demo flow — no real orders are placed.
- Deployed on GitHub Pages at `/EliteHuman/` (base URL baked into `vite.config.js`).
- Three archive routes are non-negotiable and must keep working:
  `/`, `/archive` (`?pillar=`), `/post/:id`.
- Numbers must stay exact: 105 posts, 83 IRON, 20 MIND, 2 SPIRIT, 2015–2018.
- Captions are shown verbatim — full emojis, hashtags, line breaks. Never
  rewritten into marketing copy.
- No invented logo mark. The wordmark is text. The one exception is the shield
  monogram the brand supplied, in `public/brand/` (`logo.png` stacked lockup,
  `mark-32/192/512.png` shield alone). A screenshot of the shield — the shield
  cropped from `logo.png` — is not a logo asset and ships nowhere.

## Known gaps
- **Product photography does not exist.** `assets/img/shop/product-1..6.jpg` are
  byte-identical copies of one placeholder (verified by checksum), so the shop
  grid shows the same garment six times. Real product shots must replace them
  before launch. The hero was deliberately built on archive photography rather
  than shop imagery, so this gap is not amplified by the front page.
- No prices, sizes, or inventory were authored by the brand. Shop values are
  authored here for this build and are placeholders until the brand confirms.

## Platform
`web`

## Stack
Vite + React 18, self-hosted fonts via `@fontsource`, Vitest for unit tests,
GitHub Pages deploy. Chosen by the build, not offered.