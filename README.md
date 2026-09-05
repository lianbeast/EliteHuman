# EliteHuman — 3D Ascent Site

Scroll-driven 3D immersive brand site. Body → Mind → Spirit → Apex. Plus a
browsable archive of all 105 @elitehuman Instagram posts.

## Stack

Vite · React 18 · @react-three/fiber · drei · postprocessing · Lenis · Vitest · Playwright

## Develop

    npm install
    npm run dev          # http://localhost:5173

## Scrape (one-time, populates public/assets/)

    export APIFY_TOKEN=...
    npm run scrape

## Test

    npm test                  # vitest unit
    npx playwright test       # e2e smoke

## Build & deploy

    npm run build             # static bundle in ./dist
    npm run deploy            # same, plus copies scraped assets into ./dist

`deploy` is local-only staging — no host is contacted. See "Deploy target" below.

## Deploy target

Any static host (Cloudflare Pages, Netlify, Vercel static, S3+CloudFront).
Upload the contents of `./dist`.

## Spec

- Design: docs/superpowers/specs/2026-09-04-elitehuman-3d-ascent-site-design.md
- Plan:  docs/superpowers/plans/2026-09-04-elitehuman-3d-ascent-site.md
