# Elite Human — Brand Guidelines (v1 Shop)

> Wear the Discipline. Train Body. Discipline Mind. Elevate Spirit.

## 1. Pillars → Product lines

| Pillar | Line | Ethos | Colors | Products |
|---|---|---|---|---|
| BODY | Performance | Gym-functional, sweat-proof, minimal branding | Black, charcoal, bone | Apex Heavy Tee, Stringer, 2-in-1 Short, Compression, Perf Zip |
| MIND | Essentials | Daily uniform, tonal, quiet | Off-black, bone, slate | Boxy Tee, Quiet Hoodie, Joggers, Cap, Socks |
| SPIRIT | Statement | Limited drops, journal quotes as back-prints | Off-black + Ember accent | Trinity Graphic Tee, Manifesto Hoodie, Beanie, Bottle, Tote |

## 2. Visual tokens

- `--eh-bg`: `#0C0A09` (off-black, shop)
- `--eh-bg-2`: `#1C1917` (smoke)
- `--eh-bone`: `#FAFAF9`
- `--eh-muted`: `#A8A29E`
- `--eh-line`: `rgba(250,250,249,0.14)`
- `--eh-accent`: `#C2410C` (Ember — SPIRIT drops + CTAs only)
- `--eh-paper`: `#F7F4EE` (journal stays paper — deliberate theme split)
- Display: system sans, 800 weight, uppercase, `letter-spacing: -0.02em`, `line-height: 0.95`
- Mono: Space Mono (labels, prices, sizes — already in repo)
- Radius: 2px cards, 999px pills for CTAs/sizes. No mixing.
- Imagery: high-contrast B&W training photography, 4:5. Picsum seeds as placeholders until real shoot. TODO: replace `picsum.photos/seed/elite-*` with `public/assets/product-*`.

## 3. Voice

- Short. Imperative. No hype-beast caps spam.
- Body: "Built for sets. Cut for after."
- Mind: "Quiet uniform. Daily standard."
- Spirit: "From the journal. Limited to 300."
- Never: "elegant nothing", fake percentages, lorem.

## 4. Checkout (local-only, no backend)

- Cart in `localStorage:eh-cart-v1`, orders in `eh-orders-v1`
- `/checkout` collects name/email/address, no card fields, demo banner
- Free shipping threshold $150, flat $8 under
