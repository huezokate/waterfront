# TimeLens — CLAUDE.md

Mobile-first React app: a **Victorian-newspaper** historical walking-tour of San Francisco.
Users walk the streets where events happened 100+ years ago; each spot's history is told
through audio + text + historic imagery, with images that "come alive" (sepia→colour, Ken
Burns). First fully-built location: **Yerba Buena Cove** (5 periods → 25 dated events).

> Pivot note: an earlier version was a dark/steel-blue QR-scan app (still at route `/`,
> legacy). All NEW work uses the **Victorian Broadsheet** design system below.

## Stack
- React 18 + TypeScript + Vite + React Router v6 (**HashRouter** — for GitHub Pages subpath)
- Plain CSS with custom properties (no Tailwind/UI libs)
- Dev: `npm run dev` → `http://localhost:5173`
- Source repo: https://github.com/huezokate/timelens.git
- **Demo repo + deploy**: https://github.com/huezokate/waterfront.git (pushed as `waterfront` remote)

## Deploy (GitHub Pages, auto)
- `.github/workflows/deploy.yml` builds on push to `main` → Pages.
- Vite `base: '/waterfront/'` (build only); assets via `import.meta.env.BASE_URL` (`asset()` helper in `src/lib/asset.ts`).
- **Live:** https://huezokate.github.io/waterfront/#/explore
- Every push to `waterfront/main` auto-updates the live site.

## Routes
- `/explore` — Victorian browse home (featured location, theme chips, location stubs, bottom nav)
- `/yerba-buena` — the built location (periods → events → side-stories)
- `/library` — design-system style guide (renders from `tokens.json`; links to Figma UI Kit)
- `/` `/group/:id` `/location/:id` `/scan` — legacy old app (do not extend)

## Design system — Victorian Broadsheet
- **Tokens source of truth:** `src/design/tokens.json` (color/font/size/space/radius). Each token
  has `css` (the `--vb-*` name) and `figma` (matching Figma variable name).
- `npm run tokens` → generates `src/styles/tokens.generated.css` (**never edit by hand**).
  Runs automatically on `prebuild`. `victorian.css` `@import`s it.
- **Figma → code sync:** save a `get_variable_defs` dump as `figma-vars.json`, then
  `npm run tokens:sync` → patches `tokens.json` → `npm run tokens`. See `src/design/README.md`.
- Palette (all WCAG 2.2 AA): cream `#F4ECD8`, ink `#1A1A1A`, vermilion `#B33A2B`,
  oxblood `#7A2E22`, indigo `#3B4A6B`, gold `#C8A04B` (dark grounds only). Full set in tokens.json.
- Fonts (in `index.html`): UnifrakturCook (masthead, **display-only**), IM Fell English (body),
  IM Fell English SC (labels), IM Fell Double Pica (display).

## Figma (file `PzEPUP1Bv0amoNA3ufvfut`)
- **"Victorian · UI Kit"** (node `210:239`) — atomic UI kit (swatches → type → rules → controls →
  cards) + variant components: `Chip`, `Button`, `Nav Tab`.
- **"Victorian · Library"** (node `203:238`) — 7 composed components + Living Image variant set
  (Dormant⇄Alive, real plate + image filters).
- **"CLAUDE 01"** (node `192:2`) — assembled Yerba Buena page mockup.
- Variables: "Victorian Broadsheet" collection (13 colours) + 7 text styles.

## Key files
```
src/design/tokens.json          # token source of truth (+ README.md)
src/styles/victorian.css        # all component styles (imports tokens.generated.css)
src/styles/tokens.generated.css # GENERATED — do not edit
src/lib/asset.ts                # BASE_URL-aware public asset paths
src/data/yerbaBuena.json        # 5 periods → 25 events → side-stories
src/data/sfLocations.ts         # multi-location catalog (1 live + stubs)
src/pages/YerbaBuena.tsx        # LivingImage, ThenNow, SideStory, BottomSheet, PeriodSection, Article
src/pages/Explore.tsx           # browse home + VbNav
src/pages/Library.tsx           # style guide (renders from tokens.json)
scripts/build-tokens.mjs        # tokens.json → CSS
scripts/sync-figma-tokens.mjs   # Figma dump → tokens.json
public/historic/                # downscaled historic plates (653MB→51MB)
```

## Conventions
- Mobile-first; app shell max-width 430px.
- No hardcoded colours outside `tokens.json` / `--vb-*` vars.
- All motion wrapped in `@media (prefers-reduced-motion: reduce)`.
- 48px touch targets; body ≥16px; reflow clean at 320px (fluid `clamp()` display type).
- "Living image" = CSS Ken Burns + grain + sepia→colour-on-scroll (no real video yet).

## Do Not
- Edit `tokens.generated.css` by hand (regenerate from `tokens.json`).
- Reintroduce the old dark/steel-blue palette for Victorian work.
- Commit `JIMMY PIX/` or `*.xlsx` (gitignored — raw source archive).
- Use BrowserRouter (Pages needs HashRouter) or absolute `/historic/...` (use `asset()`).
