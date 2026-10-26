import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { measureStoryDescription } from '../plugins/product-engineering/skills/hypothesis-driven-development/scripts/validate_story_description.mjs';

const script = path.resolve(import.meta.dirname, '../plugins/product-engineering/skills/hypothesis-driven-development/scripts/validate_story_description.mjs');
test('HDD uses root-only issue links and described recursive directory READMEs', async () => {
  const guide = await fs.readFile(path.resolve(import.meta.dirname, '../plugins/product-engineering/skills/hypothesis-driven-development/references/description-size.md'), 'utf8');
  assert.match(guide, /issue file[^\n]*only[^\n]*directly[^\n]*attachments/);
  assert.match(guide, /every subdirectory[^\n]*README\.md/i);
  assert.match(guide, /links and descriptions[^\n]*immediate files and child directories/i);
  assert.match(guide, /attachments\/README\.md/);
  assert.doesNotMatch(guide, /Keep direct links to the key workflow artifacts/);
});
test('portable local measurement never certifies the final provider description', () => {
  const result = measureStoryDescription('# #DOING Example\n😀e\u0301\n<!--\njira:TEST-1\n-->', { limit: 4 });
  assert.equal(result.measuredSize, 4);
  assert.equal(result.countUnit, 'utf16-code-units');
  assert.equal(result.status, 'unverified');
  assert.equal(result.localStatus, 'within-local-budget');
  assert.equal(measureStoryDescription('# Story\n12345', { limit: 4 }).localStatus, 'over-local-budget');
  assert.equal(measureStoryDescription('# Story\nsmall').limit, null);
  assert.throws(() => measureStoryDescription('body', { limit: -1 }));
});
test('standalone command works without imdone, writes no story changes, and handles bad input safely', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'hdd-local-size-'));
  const file = path.join(root, 'story.md');
  const original = '# #DOING Example\n\nLocal evidence';
  try {
    await fs.writeFile(file, original);
    const run = spawnSync(process.execPath, [script, file, '--limit', '32767'], { encoding: 'utf8', env: { PATH: '' } });
    assert.equal(run.status, 2);
    assert.equal(JSON.parse(run.stdout).status, 'unverified');
    assert.equal(await fs.readFile(file, 'utf8'), original);
    assert.deepEqual(await fs.readdir(root), ['story.md']);
    for (const args of [[file, '--limit', 'bad'], [path.join(root, 'missing')], [file, '--unknown']]) {
      const bad = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { PATH: '' } });
      assert.equal(bad.status, 3);
      assert.equal(JSON.parse(bad.stdout).status, 'error');
      assert.equal(bad.stdout.includes(root), false);
    }
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
