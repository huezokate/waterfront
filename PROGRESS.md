# TimeLens — Progress Log

## Session — 2026-06-02 (Victorian Broadsheet build)

### Done
- **Research** (3 streams): tour-app UX/engagement, Victorian-newspaper UI + living-image motion,
  WCAG 2.2 AA (contrast-verified palette). Plus a browsing/IA research pass for multi-location.
  Artifacts in `~/docs/active/work/` (lisa story S-001).
- **Design system** "Victorian Broadsheet" (Direction A: blackletter masthead + IM Fell body +
  vermilion accent on newsprint cream), WCAG AA.
- **Yerba Buena page** (`/yerba-buena`): 5 periods → 25 events → side-stories; living-image heroes
  (Ken Burns + grain + sepia→colour), printer's-rule timeline w/ reading-progress, chapter-aware
  audio bar, breadcrumb + "up next".
- **Then/Now slider** (1848 ⇄ 2020 cove), accessible (click/drag/keyboard).
- **Bottom-sheet side-stories** (peek → expand; lorem + plate placeholders).
- **Explore browse home** (`/explore`): featured location, theme chips, location stubs, bottom nav.
- **Deploy**: GitHub Pages auto-deploy → https://huezokate.github.io/waterfront/#/explore
  (historic images downscaled 653MB→51MB).
- **Figma**: assembled mockup (192:2); component library — 7 components + Living Image variant set
  (203:238); **atomic UI Kit** + Chip/Button/Nav Tab variant components (210:239).
- **Token pipeline**: `src/design/tokens.json` source of truth → generated CSS; Figma→tokens sync
  script; `/library` style-guide page renders from tokens. Round-trip proven end-to-end.

### Pick up tomorrow (next steps, roughly prioritised)
1. **Rewire molecules to atoms** — make Period Card / Side-story / Audio Bar consume the new
   Chip/Button/Nav Tab/etc. component instances (true composition, not look-alike frames).
2. **Promote remaining atoms to variant components** — Badge (Featured/Soon/Tag), Timeline Tick
   (Active/Default), Progress Dot (Read/Unread), Audio Play, Close.
3. **Code Connect** — link each Figma component to its React file for round-trip.
4. **Close the token loop both ways** — add a code→Figma writer (use_figma) so `tokens.json`
   changes can push back into Figma variables (currently Figma→code is automated, code→Figma manual).
5. **Second real location** (e.g. Portsmouth Square) so the location-switch/browse flow has 2 walks.
6. **Map + Saved tabs** — currently visual stubs; build the map+bottom-sheet browse view.
7. **Then/Now real present-day photos** (currently 1848 map ⇄ 2020 map).
8. **Bottom sheet drag-to-expand gesture** (currently grip/button toggle).
9. **Real audio/video production** (narration + living-image clips).

### How to resume
- Code: `cd ~/Documents/projects/timelens && npm run dev` → http://localhost:5173/#/explore
- Figma UI Kit: file `PzEPUP1Bv0amoNA3ufvfut`, page "Victorian · UI Kit" (210:239)
- lisa: `lisa status` (home dir) — story S-002 holds tomorrow's tickets.
