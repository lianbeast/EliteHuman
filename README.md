# ELITE HUMAN

> Wear the Discipline. Train Body. Discipline Mind. Elevate Spirit.

A clothing-brand storefront grown out of a training journal — performance wear (Body),
daily essentials (Mind), and numbered limited drops (Spirit), plus the journal and
archive it all came from.

**Live:** https://lianbeast.github.io/EliteHuman/

## Built With

- Vite + React 18
- Local-data shop (no backend — cart in `localStorage`, demo checkout)
- Vitest + Playwright

## Getting Started

Prerequisites: Node 20+ and npm.

```sh
npm install
npm run dev        # http://localhost:5173/EliteHuman/
```

## Usage

| Route | Page |
|---|---|
| `/` | Storefront home |
| `/shop` (`?pillar=BODY\|MIND\|SPIRIT`) | Catalog, 14 pieces |
| `/product/:slug` | Product + size picker |
| `/checkout` | Demo checkout (stored locally, no payment) |
| `/manifesto` | Brand, size guide, shipping |
| `/journal`, `/post/:slug`, `/archive` | Training journal + 105-mark archive |

```sh
npm test                  # unit tests
npx playwright test       # e2e smoke
npm run build             # static bundle in ./dist
```

Shop artwork lives in `public/assets/shop/` — regenerate with
`node tools/make-shop-art.mjs`. Brand rules: `docs/brand-guidelines.md`.

## Roadmap

- [ ] Order history page (orders already save to `localStorage`)
- [ ] Real product photography to replace vector placeholders
- [ ] Real checkout (Shopify / Stripe) when ready

## License

All rights reserved — Elite Human.

## Contact

studio@elitehuman.example
