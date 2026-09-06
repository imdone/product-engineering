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
    'CHANGELOG.md',
    'LICENSE.md',
    'CONTRIBUTING.md',
    '.agents/plugins/marketplace.json',
    '.claude-plugin/marketplace.json',
    'plugins/product-engineering/.codex-plugin/plugin.json',
    'plugins/product-engineering/.claude-plugin/plugin.json',
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
  assert.equal(packageManifest.version, '0.2.3');
  assert.ok(packageManifest.files.includes('.agents'));
  assert.ok(packageManifest.files.includes('.claude-plugin'));
  assert.ok(packageManifest.files.includes('scripts'));
  assert.equal(pluginManifest.name, 'product-engineering');
  assert.equal(path.basename(pluginRoot), pluginManifest.name);
  assert.equal(pluginManifest.skills, './skills/');
  assert.equal(pluginManifest.repository, 'https://github.com/imdone/product-engineering');
});

test('publishes matching Codex and Claude marketplace entries', async () => {
  const packageManifest = JSON.parse(await read('package.json'));
  const codexMarketplace = JSON.parse(
    await read('.agents/plugins/marketplace.json')
  );
  const claudeMarketplace = JSON.parse(
    await read('.claude-plugin/marketplace.json')
  );
  const codexPlugin = JSON.parse(
    await read('plugins/product-engineering/.codex-plugin/plugin.json')
  );
  const claudePlugin = JSON.parse(
    await read('plugins/product-engineering/.claude-plugin/plugin.json')
  );

  assert.equal(codexMarketplace.name, 'product-engineering');
  assert.equal(codexMarketplace.interface.displayName, 'Product Engineering');
  assert.equal(codexMarketplace.plugins.length, 1);
  assert.deepEqual(codexMarketplace.plugins[0], {
    name: 'product-engineering',
    source: {
      source: 'local',
      path: './plugins/product-engineering'
    },
    policy: {
      installation: 'AVAILABLE',
      authentication: 'ON_INSTALL'
    },
    category: 'Productivity'
  });

  assert.equal(claudeMarketplace.name, 'product-engineering');
  assert.equal(claudeMarketplace.plugins.length, 1);
  assert.equal(claudeMarketplace.plugins[0].name, 'product-engineering');
  assert.equal(
    claudeMarketplace.plugins[0].source,
    './plugins/product-engineering'
  );

  assert.equal(codexPlugin.name, 'product-engineering');
  assert.equal(claudePlugin.name, codexPlugin.name);
  assert.equal(codexPlugin.version, packageManifest.version);
  assert.equal(claudePlugin.version, codexPlugin.version);
  assert.equal(claudePlugin.repository, codexPlugin.repository);
});

test('uses one shared HDD skill payload for both platforms', async () => {
  const skills = await fs.readdir(path.join(pluginRoot, 'skills'));
  assert.deepEqual(skills, ['hypothesis-driven-development']);
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

test('preserves explicit-HDD-session progress-note and current-first targeting contracts', async () => {
  const skill = await fs.readFile(path.join(skillRoot, 'SKILL.md'), 'utf8');

  assert.match(skill, /#HDD-template.*#HDD-light-template/is);
  assert.match(skill, /imdone-session-story:v1/i);
  assert.match(skill, /imdone-story-context:v1/i);
  assert.match(skill, /hddProgressNotes:enabled/i);
  assert.match(skill, /accepted[^\n]*persist[^\n]*story metadata/i);
  assert.match(skill, /decline[^\n]*unrecognized[^\n]*session/i);
  assert.match(skill, /activation[^\n]*detection[^\n]*require[^\n]*using this HDD skill[^\n]*imdone-session-story:v1/i);
  assert.match(skill, /story tags[^\n]*hddProgressNotes:enabled[^\n]*do not activate[^\n]*direct-agent/i);
  assert.match(skill, /imdone ai[^\n]*stays quiet[^\n]*session-story marker[^\n]*imdone-story-context:v1[^\n]*takes precedence/i);
  assert.match(skill, /current story[^\n]*first/i);
  assert.match(skill, /one[^\n]*HDD-eligible alternative/i);
  assert.match(skill, /Jira keys[^\n]*numeric GitHub/i);
  assert.match(skill, /sessionStoryKey[^\n]*active_story/i);
  assert.match(skill, /imdone status <sessionStoryKey> -f json/i);
  assert.match(skill, /imdone push <sessionStoryKey>/i);
  assert.match(skill, /do not persist[^\n]*raw context[^\n]*ranking scores/i);
});

test('identifies every progress-note target with a human-readable story title', async () => {
  const contract = await fs.readFile(
    path.join(skillRoot, 'references/interaction-contract.md'),
    'utf8'
  );

  assert.match(contract, /progress-note target confirmation/i);
  assert.match(
    contract,
    /every displayed (?:target|alternative)[^\n]*issue key[^\n]*(?:story title|concise description)/i
  );
  assert.match(contract, /KEY: human-readable story title/i);
  assert.match(contract, /never[^\n]*bare issue key/i);
});
