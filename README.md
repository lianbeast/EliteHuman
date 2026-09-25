# ELITE HUMAN

> Wear the Discipline. Train Body. Discipline Mind. Elevate Spirit.

The @elitehuman archive: 105 Instagram posts, 2015—2018, kept as a monochrome
editorial record. No shop, no blog engine — three routes and the original
photographs and captions.

**Live:** https://lianbeast.github.io/EliteHuman/

## Built With

- Vite + React 18
- Zero backend — posts fetched at runtime from `public/assets/posts.json`
- Vitest (unit) + Playwright-core (browser verification)

## Getting Started

Prerequisites: Node 20+ and npm.

```sh
npm install
npm run dev        # http://localhost:5173/EliteHuman/
```

## Usage

| Route | Page |
|---|---|
| `/` | Brand statement + selected marks + pillars |
| `/archive` (`?pillar=IRON\|MIND\|SPIRIT`) | All 105 marks, filterable, with lightbox |
| `/post/:id` | One mark, full caption, prev/next |

```sh
npm test           # unit tests (router, scrape)
npm run build      # static bundle in ./dist
npm run preview    # serve the build on :4173
npm run scrape     # refresh public/assets/posts.json + img/ from Instagram
```

## Content

- `public/assets/posts.json` — 105 records: id, caption, date, pillar, img, likes, igUrl
- `public/assets/img/` — the original photographs
- `.superdesign/design-system.md` — the monochrome editorial contract (type scale,
  colour ramp, photo treatment, accessibility rules) the build follows

Pillar split is fixed by the archive itself: IRON 83, MIND 20, SPIRIT 2.

## License

All rights reserved — Elite Human.
