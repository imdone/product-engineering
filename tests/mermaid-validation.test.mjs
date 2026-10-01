import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  MERMAID_PACKAGE_VERSION,
  extractMermaidBlocks,
  validateMermaidFile,
} from '../plugins/product-engineering/skills/hypothesis-driven-development/scripts/validate_mermaid.mjs';

test('extracts every fenced Mermaid block with source line context', () => {
  const blocks = extractMermaidBlocks([
    '# Diagram',
    '',
    '```mermaid',
    'sequenceDiagram',
    '  A->>B: valid',
    '```',
    '',
    '```mermaid',
    'flowchart LR',
    '  A --> B',
    '```',
  ].join('\n'));

  assert.equal(MERMAID_PACKAGE_VERSION, '12.0.0');
  assert.deepEqual(blocks.map(({ index, line }) => ({ index, line })), [
    { index: 1, line: 3 },
    { index: 2, line: 8 },
  ]);
});

test('reports the file, fence line, and block when Mermaid parsing fails', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'hdd-mermaid-test-'));
  const filePath = path.join(directory, 'diagram.md');
  await fs.writeFile(filePath, [
    '# Broken',
    '',
    '```mermaid',
    'sequenceDiagram',
    '  A->>B: close; next open restores default',
    '  else failed',
    '```',
  ].join('\n'));

  try {
    await assert.rejects(
      validateMermaidFile(filePath, {
        parse: async source => {
          if (source.includes(';')) throw new Error('Parse error on line 2');
        },
      }),
      error => {
        assert.match(error.message, /diagram\.md:3 Mermaid block 1 failed syntax validation/);
        assert.match(error.message, /Parse error on line 2/);
        return true;
      },
    );
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('fails closed when the requested Markdown has no Mermaid block', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'hdd-mermaid-test-'));
  const filePath = path.join(directory, 'diagram.md');
  await fs.writeFile(filePath, '# No diagram\n');

  try {
    await assert.rejects(
      validateMermaidFile(filePath, { parse: async () => {} }),
      /no fenced Mermaid blocks found/,
    );
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
