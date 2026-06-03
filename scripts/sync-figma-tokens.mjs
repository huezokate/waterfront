#!/usr/bin/env node
// Reverse sync: pull Figma variable values INTO tokens.json.
// Flow: change a variable in Figma → capture its values into figma-vars.json
//       (format: { "paper/cream": "#F4ECD8", "accent/vermilion": "#B33A2B", ... }
//        — exactly what the Figma MCP `get_variable_defs` returns for colours) →
//       run `npm run tokens:sync` → tokens.json is patched → run `npm run tokens`.
//
// Usage: node scripts/sync-figma-tokens.mjs [path-to-figma-vars.json]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS = resolve(__dirname, '../src/design/tokens.json');
const DUMP = resolve(process.cwd(), process.argv[2] || 'figma-vars.json');

if (!existsSync(DUMP)) {
  console.error(`✗ No Figma dump at ${DUMP}.\n  Capture it via the Figma MCP get_variable_defs and save as figma-vars.json:\n  { "paper/cream": "#F4ECD8", "accent/vermilion": "#B33A2B", ... }`);
  process.exit(1);
}

const tokens = JSON.parse(readFileSync(TOKENS, 'utf8'));
const figma = JSON.parse(readFileSync(DUMP, 'utf8'));

const norm = (v) => String(v).trim().toUpperCase();
const changes = [];
for (const [name, tok] of Object.entries(tokens.color || {})) {
  if (!tok.figma || !(tok.figma in figma)) continue;
  const next = norm(figma[tok.figma]);
  if (!/^#?[0-9A-F]{6}$/.test(next)) continue;          // colours only
  const nextHex = next.startsWith('#') ? next : `#${next}`;
  if (norm(tok.$value) !== norm(nextHex)) {
    changes.push({ token: name, figma: tok.figma, from: tok.$value, to: nextHex });
    tok.$value = nextHex;
  }
}

if (changes.length === 0) {
  console.log('✓ tokens.json already in sync with Figma — no changes.');
} else {
  writeFileSync(TOKENS, JSON.stringify(tokens, null, 2) + '\n');
  console.log(`✓ Patched ${changes.length} token(s) from Figma:`);
  for (const c of changes) console.log(`  ${c.token}  (${c.figma})  ${c.from} → ${c.to}`);
  console.log('\n  Next: run `npm run tokens` to regenerate CSS.');
}
