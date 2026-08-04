import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  forbiddenHardDependencies,
  requiredSharedFiles,
  requiredSharedSections
} from '../scripts/check-hdd-parity.mjs';

const root = path.resolve(import.meta.dirname, '..');
const pluginRoot = path.join(root, 'plugins/product-engineering');
const skillRoot = path.join(pluginRoot, 'skills/hypothesis-driven-development');

async function read(relativePath) {
  return fs.readFile(path.join(root, relativePath), 'utf8');
}

async function markdownFiles(directory) {
  const results = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...await markdownFiles(entryPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(entryPath);
    }
  }
  return results;
}

test('ships the required public package and plugin files', async () => {
  const requiredFiles = [
    'README.md',
    'LICENSE.md',
    'CONTRIBUTING.md',
    'plugins/product-engineering/.codex-plugin/plugin.json',
    'templates/hypothesis-driven-development.md',
    'templates/lightweight-hypothesis-driven-development.md',
    'examples/plain-markdown-story.md',
    ...requiredSharedFiles.map((file) =>
      path.join('plugins/product-engineering/skills/hypothesis-driven-development', file)
    )
  ];

  for (const relativePath of requiredFiles) {
    const stat = await fs.stat(path.join(root, relativePath));
    assert.equal(stat.isFile(), true, relativePath);
  }
});

test('uses a matching package and plugin identity', async () => {
  const packageManifest = JSON.parse(await read('package.json'));
  const pluginManifest = JSON.parse(
    await read('plugins/product-engineering/.codex-plugin/plugin.json')
  );

  assert.equal(packageManifest.name, '@imdone/product-engineering');
  assert.ok(packageManifest.files.includes('scripts'));
  assert.equal(pluginManifest.name, 'product-engineering');
  assert.equal(path.basename(pluginRoot), pluginManifest.name);
  assert.equal(pluginManifest.skills, './skills/');
  assert.equal(pluginManifest.repository, 'https://github.com/imdone/product-engineering');
});

test('preserves shared HDD workflow sections', async () => {
  const skill = await fs.readFile(path.join(skillRoot, 'SKILL.md'), 'utf8');
  for (const section of requiredSharedSections) {
    assert.ok(skill.includes(section), section);
  }
});

test('has no hard imdone dependency in public HDD markdown', async () => {
  const contents = await Promise.all(
    (await markdownFiles(skillRoot)).map((file) => fs.readFile(file, 'utf8'))
  );
  const combined = contents.join('\n');

  for (const dependency of forbiddenHardDependencies) {
    assert.doesNotMatch(combined, dependency.pattern, dependency.label);
  }
});
