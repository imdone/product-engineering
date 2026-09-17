import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const skillRoot = path.join(
  root,
  'plugins/product-engineering/skills/hypothesis-driven-development'
);

async function read(relativePath) {
  return fs.readFile(path.join(skillRoot, relativePath), 'utf8');
}

test('defines reminder eligibility separately from natural-stop placement', async () => {
  const contract = await read('references/interaction-contract.md');

  assert.match(contract, /natural stopping point/i);
  assert.match(contract, /required (?:approval|decision)/i);
  assert.match(contract, /blocker[\s\S]*external evidence gate/i);
  assert.match(contract, /evaluated[- ]Plan checkpoint/i);
  assert.match(contract, /Deploy[\s\S]*Confirm[\s\S]*handoff/i);
  assert.match(contract, /session (?:work is complete|handoff)/i);
  assert.match(contract, /phase[\s\S]*plan[\s\S]*progress[- ]note[\s\S]*do not[\s\S]*stopping point/i);
  assert.match(contract, /useful work[\s\S]*continue[\s\S]*without[\s\S]*reminder/i);
});

test('uses one non-blocking story-scoped reminder contract', async () => {
  const skill = await read('SKILL.md');
  const contract = await read('references/interaction-contract.md');
  const configuration = await read('references/configuration.md');
  const combined = `${skill}\n${contract}\n${configuration}`;

  assert.match(combined, /imdone status <sessionStoryKey> -f json/i);
  assert.match(contract, /run `imdone push <sessionStoryKey>` when ready/i);
  assert.match(contract, /not (?:a )?question/i);
  assert.match(contract, /does not offer[\s\S]*agent[\s\S]*push/i);
  assert.match(configuration, /natural stopping point/i);
  assert.match(skill, /natural stopping point/i);
  assert.doesNotMatch(combined, /Push changes now\?/i);
  assert.doesNotMatch(combined, /(?:Yes, run imdone push|No, leave changes local)/i);
  assert.doesNotMatch(combined, /ask whether to (?:run )?`?imdone push/i);
});

test('keeps explicit user-requested targeted pushes outside reminder policy', async () => {
  const contract = await read('references/interaction-contract.md');

  assert.match(contract, /explicit(?:ly)? user-requested[\s\S]*imdone push <(?:issueKey|sessionStoryKey)>/i);
  assert.match(contract, /reminder[\s\S]*does not[\s\S]*(?:prohibit|block)[\s\S]*explicit/i);
});
