# SDD ledger — plan: docs/superpowers/plans/2026-09-04-elitehuman-3d-ascent-site.md
Task 1: complete (commits 6bdcf69..efb0dbc, review clean — controller-read review after subagent 429 death)
- Deviations ruled OK: fontsource pin 5.2.5 (upstream 5.3.0 breakage); user manually committed
- Deferred minors: test/setup.js missing until Task 2; .superpowers/ should be gitignored; allowScripts pnpm-ism
Tasks 3-14: complete (inline execution, plan-verbatim transcription — classifier outage blocked all subagent dispatch)
- Ruling: inline controller execution instead of per-task subagents — plan contained complete code, mechanical transcription + test runs. Cost if wrong: skipped per-task review gate; mitigated by 13/13 unit tests + build green + final review pending.
- Fixes made during transcription: jsdom matchMedia mock in test/setup.js; cleanup() in ScrollRig.test.jsx (plan test defect — DOM persisted between tests); vitest exclude smoke.spec.js (Playwright file, wrong runner); removed unused SPIRIT_WORDS export use; postprocessing Vector2 offset memoized.
- Build: 338KB gz — under 500KB budget. LCP check deferred to deploy-time.
Data seed: complete (commit 19333e0)
- Ruling: profile scraper (apify/instagram-profile-scraper) hard-caps latestPosts at 12; resultsType param legacy no-op. Switched to apify/instagram-post-scraper (official, $0.18 run) — 103 items, 105 unique posts after parse. tools/scrape.mjs contract unchanged for future re-scrapes.
- 104/105 images downloaded; 1 dead CDN URL (id 1104386633638093315) — Grid.jsx onError hides missing image. Cost if wrong: one post renders caption-only card.
