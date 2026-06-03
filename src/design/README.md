# Design tokens — source of truth & Figma round-trip

`tokens.json` is the **single source of truth** for the Victorian Broadsheet design system.
CSS variables and (via sync) the Figma variables both derive from it.

## Files
- `tokens.json` — the tokens. Each has `$value`, `css` (the `--vb-*` name), and `figma`
  (the matching Figma variable name).
- `../styles/tokens.generated.css` — GENERATED `:root { --vb-* }`. Never edit by hand.
- `../../scripts/build-tokens.mjs` — tokens.json → generated CSS.
- `../../scripts/sync-figma-tokens.mjs` — Figma values → tokens.json (reverse).

## Forward: edit a token in code
1. Edit a `$value` in `tokens.json`.
2. `npm run tokens` → regenerates `tokens.generated.css`.
3. `victorian.css` `@import`s it, so the app + `/library` page update.
   (`prebuild` runs this automatically before every `npm run build`.)

## Reverse: a variable changed in Figma → update tokens
1. Pull the live values via the Figma MCP `get_variable_defs` on a node that uses them
   (e.g. the UI-Kit swatches), and save the `{ "figma/name": "#hex", ... }` object as
   `figma-vars.json` at the repo root.
2. `npm run tokens:sync` → patches `tokens.json` for any colour whose `figma` value changed.
3. `npm run tokens` → regenerate CSS. Commit.

The `/library` route renders entirely from `tokens.json`, so it's the quickest way to eyeball
code↔Figma parity. The Figma UI Kit lives on the **"Victorian · UI Kit"** page (node 210:239).
