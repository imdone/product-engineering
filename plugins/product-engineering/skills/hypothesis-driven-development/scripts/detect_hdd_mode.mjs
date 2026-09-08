#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

function closingMetadata(issueText) {
  const text = String(issueText || '');
  const closingEnd = text.match(/-->\s*$/);
  if (!closingEnd) return '';
  const openingIndex = text.lastIndexOf('<!--', closingEnd.index);
  if (openingIndex === -1) return '';
  return text.slice(openingIndex + 4, closingEnd.index);
}

function templateMode(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return null;
  if (/lightweight[_-]hypothesis[_-]driven[_-]development/.test(normalized)) return 'lightweight';
  if (/hypothesis[_-]driven[_-]development/.test(normalized)) return 'full';
  return null;
}

export function detectHddMode(issueText) {
  const metadata = closingMetadata(issueText);
  if (!metadata) return { mode: 'ask', source: null };

  const templateModes = new Set(
    [...metadata.matchAll(/^\s*imdoneTemplate:\s*([^\s]+)\s*$/gmi)]
      .map(match => templateMode(match[1]))
      .filter(Boolean)
  );
  if (templateModes.size > 1) return { mode: 'ask', source: 'conflict' };
  if (templateModes.size === 1) {
    return { mode: [...templateModes][0], source: 'imdoneTemplate' };
  }

  if (/#HDD-light-template\b/i.test(metadata)) {
    return { mode: 'lightweight', source: '#HDD-light-template' };
  }
  if (/#HDD-template\b/i.test(metadata)) {
    return { mode: 'full', source: '#HDD-template' };
  }
  return { mode: 'ask', source: null };
}

async function main() {
  const issuePath = process.argv[2];
  if (!issuePath) {
    process.stderr.write('Usage: detect_hdd_mode.mjs <issue-file>\n');
    process.exitCode = 2;
    return;
  }
  const issueText = await readFile(path.resolve(issuePath), 'utf8');
  process.stdout.write(`${JSON.stringify(detectHddMode(issueText))}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
