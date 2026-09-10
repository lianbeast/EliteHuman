# EliteHuman Blog Redesign — Design

Date: 2026-09-10
Status: approved (in-chat design confirmed; user asked to proceed directly to implementation)

## Goal

Replace the 3D scroll-journey site with a personal training/fitness blog.
Same EliteHuman identity and voice, entirely new visual direction: a
printed training journal on the web.

## Decisions (from brainstorming)

| Question | Decision |
|---|---|
| Content | Training/fitness writing |
| Visual direction | Fully new (not obsidian/gold) |
| Authoring | Markdown files in repo (`posts/*.md`) |
| Existing archive | Keep archive grid, re-skin to match |
| Home layout | Post list (chronological) |
| Tech approach | Rebuild in place (Vite+React kept) |
| New look | Ink & paper editorial |

## Visual identity — "Ink & Paper"

- Background: warm off-white paper `#F7F4EE`
- Text: near-black ink `#141412`
- Single accent: editorial red `#C0392B` (links, hover states, rules)
- Hairline rules `1px solid rgba(20,20,18,0.15)` between posts
- Typography: one high-quality serif family for display and body
  (load one Google-font variable file via @fontsource; fallback Georgia).
  Mono for dates/meta only.
- Generous whitespace; measure ~65ch for article body; no shadows, no
  glass, no gradients.

## Structure

```
posts/*.md            # posts: frontmatter (title, date, description) + body
src/blog/
  PostList.jsx        # home: masthead + chronological list
  Post.jsx            # single post: rendered markdown
  markdown.js         # tiny loader: import.meta.glob + frontmatter parse
src/archive/          # kept: Grid, Lightbox, pillarClassify (restyled)
src/App.jsx           # routes: / , /post/:slug , /archive
```

### Deleted

- `src/journey/` (all), `src/dashboard/` (all), `src/sections/`
- `src/lib/progressContext.jsx`, `easing.js`, `bands.js`, `reveal.js`
  and their tests, `src/styles/glass.css`, `reveal.css`, `archive.css`
  (rewritten for paper skin)
- `test/smoke.spec.js` journey expectations (rewritten for blog routes)
- Dependencies: `three`, `@react-three/fiber`, `@react-three/drei`,
  `@react-three/postprocessing`, `lenis`, `troika-three-text`,
  `@fontsource/big-shoulders-display`
- `index.html`: remove three.js-related meta/links if any

### Kept

- `src/archive/Grid.jsx`, `Lightbox.jsx`, `pillarClassify.js` (+ test)
- `public/assets/posts.json` + all archive images — untouched data
- Vite config, GitHub Actions CI, Pages deploy, `BASE_URL` routing
  pattern in `App.jsx`

## Pages

### Home `/`
- Masthead: `ELITEHUMAN` in serif caps, one-line about beneath.
- Post list, newest first: large serif title (link), date (mono),
  2-line description. Hairline rule between entries. Hover: title red.
- Footer link to `/archive` ("The 105 Marks").

### Post `/post/:slug`
- Serif title, mono date, rendered markdown body at ~65ch measure.
- Back link to home. Unknown slug → "not found" note + link home.

### Archive `/archive`
- Existing Grid + Lightbox behavior, restyled: paper background, ink
  text, red accent replaces gold. Pillar buttons become ink/red text.

## Markdown pipeline

- `import.meta.glob('/posts/*.md', { query: '?raw', eager: true })`
- Frontmatter: `---\ntitle: X\ndate: YYYY-MM-DD\ndescription: X\n---`
- Parse with a ~15-line regex split (no gray-matter dependency).
- Render with `marked` (only new dependency).
- Sort posts by date desc.

## Testing

- Keep: `pillarClassify.test.js`, `tools/scrape.test.mjs`
- New: `markdown.test.js` — frontmatter parse (title/date required,
  date `YYYY-MM-DD`, body separated); every `posts/*.md` parses.
- Playwright smoke: rewrite journey expectations → home renders
  masthead + post list; archive route renders grid.

## Out of scope

- RSS, tags/categories, dark mode, code highlighting, analytics,
  pagination (add when >20 posts), comments. None now; YAGNI.
