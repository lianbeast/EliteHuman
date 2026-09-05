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
Playwright e2e: ENV-BLOCKED (2026-09-05)
- Ruling: runner wedges pre-test on this machine (npx AND direct cli.js; chrome spawns then dies; zero test output). Not a site defect — manual chrome --headless --dump-dom verified: journey page WebGL renders w/ --enable-unsafe-swiftshader (ascent-meter present), archive renders 105 cards, posts.json + images serve 200. Swiftshader software-GL makes each frame ~100× slower; test timeouts would be unreliable even if runner worked.
- Config kept (playwright.config.js: channel 'chrome', --no-sandbox, --enable-unsafe-swiftshader, PW_NO_SERVER escape hatch) for CI or a machine with real GPU.
- Test-code bug fixed while here: smoke.spec.js getByRole('button').first() matched filter chip not post card → locator('article[role="button"]').first().
- Cost if wrong: e2e unverified on this machine — deploy-time smoke on real host still recommended.
