import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const skillRoot = path.join(
  root,
  'plugins/product-engineering/skills/hypothesis-driven-development'
);

test('requires a conditional UX mockup and review gate during Design', async () => {
  const [skill, designGuidance] = await Promise.all([
    fs.readFile(path.join(skillRoot, 'SKILL.md'), 'utf8'),
    fs.readFile(path.join(skillRoot, 'references/prove-the-outcome.md'), 'utf8')
  ]);

  assert.match(skill, /Design.*UX.*mockup/is);
  assert.match(designGuidance, /UX mockup decision/i);
  assert.match(
    designGuidance,
    /layout.*interaction.*navigation.*responsive.*visual hierarchy/is
  );
  assert.match(designGuidance, /create.*link.*fit-for-purpose mockup/is);
  assert.match(designGuidance, /numbered.*product-owner review/is);
  assert.match(designGuidance, /accept.*revise.*defer/is);
  assert.match(designGuidance, /attachments\/progress-notes\.md/i);
  assert.match(designGuidance, /(?:do not begin|block).*Plan.*accepted/is);
  assert.match(designGuidance, /not applicable.*(?:specific|concrete).*reason/is);
  assert.match(designGuidance, /bitmap.*code-native/is);
  assert.doesNotMatch(designGuidance, /must use (?:ImageGen|imagegen)/i);
});
