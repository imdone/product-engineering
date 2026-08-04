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

test('hard-dependency guard rejects mandatory imdone prerequisites', () => {
  const hardDependencies = [
    'HDD requires imdone-cli installed before the session can begin.',
    'You must configure imdone before using this skill.',
    'Stop the workflow when imdone is unavailable.'
  ];

  for (const text of hardDependencies) {
    assert.ok(
      forbiddenHardDependencies.some(({ pattern }) => pattern.test(text)),
      text
    );
  }
});

test('uses deterministic imdone integrations with a complete tool-neutral fallback', async () => {
  const contractFiles = [
    'plugins/product-engineering/skills/hypothesis-driven-development/SKILL.md',
    'plugins/product-engineering/skills/hypothesis-driven-development/references/session-setup.md',
    'plugins/product-engineering/skills/hypothesis-driven-development/references/interaction-contract.md',
    'plugins/product-engineering/skills/hypothesis-driven-development/references/prove-the-outcome.md'
  ];
  const combined = (
    await Promise.all(contractFiles.map((file) => read(file)))
  ).join('\n');

  assert.match(combined, /imdone --version/);
  assert.match(combined, /imdone agent-config get-config/);
  assert.match(combined, /status:\s*[`'"]?ok/i);
  assert.match(combined, /imdone note <issueKey> "<note>"/);
  assert.match(
    combined,
    /direct(?:ly)?[^\n]*progress-notes\.md[^\n]*(?:only if|when)[^\n]*imdone note[^\n]*(?:unavailable|fails|exits non-zero)/i
  );
  assert.match(combined, /imdone template|imdone-template/);
  assert.match(combined, /imdone pull/);
  assert.match(combined, /imdone push/);
  assert.match(combined, /plain Markdown/i);
  assert.match(combined, /external evidence gate/i);
});
