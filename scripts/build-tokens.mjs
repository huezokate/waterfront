#!/usr/bin/env node
// Generate CSS custom properties from the design-token source of truth.
// Usage: node scripts/build-tokens.mjs   (or `npm run tokens`)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../src/design/tokens.json');
const OUT = resolve(__dirname, '../src/styles/tokens.generated.css');

const tokens = JSON.parse(readFileSync(SRC, 'utf8'));

const lines = [];
const groupOrder = ['color', 'font', 'size', 'space', 'radius'];
for (const group of groupOrder) {
  const g = tokens[group];
  if (!g) continue;
  lines.push(`  /* ${group} */`);
  for (const [name, tok] of Object.entries(g)) {
    if (!tok.css) continue;
    lines.push(`  ${tok.css}: ${tok.$value};`);
  }
  lines.push('');
}

const css = `/* ============================================================================
   GENERATED FILE — do not edit by hand.
   Source of truth: src/design/tokens.json  →  run \`npm run tokens\`
   ============================================================================ */
:root {
${lines.join('\n').replace(/\n+$/, '')}
}
`;

writeFileSync(OUT, css);
const count = groupOrder.reduce((n, g) => n + Object.keys(tokens[g] || {}).length, 0);
console.log(`✓ tokens → ${OUT.split('/').slice(-2).join('/')}  (${count} tokens)`);
