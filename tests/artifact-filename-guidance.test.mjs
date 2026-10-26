import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const setup = await fs.readFile(new URL('../plugins/product-engineering/skills/hypothesis-driven-development/references/session-setup.md', import.meta.url), 'utf8');
test('artifact creation guidance prevents nonportable names without renaming existing evidence', () => {
  assert.match(setup, /### Portable artifact filenames/);
  assert.match(setup, /before creating.*(?:file|folder)/is);
  for (const value of ['2026-10-26T20-06-43Z', 'CON', 'NFC']) assert.ok(setup.includes(value));
  assert.match(setup, /do not.*(?:rename|relocate).*existing/is);
});
