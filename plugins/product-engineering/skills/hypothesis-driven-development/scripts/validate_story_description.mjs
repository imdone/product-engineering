#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function measureStoryDescription(content, { limit = null } = {}) {
  if (typeof content !== 'string' || (limit !== null && (!Number.isSafeInteger(limit) || limit <= 0))) {
    throw new Error('Expected story text and an optional positive integer local budget.');
  }
  const withoutComments = content.replace(/<!--[\s\S]*?-->/g, '');
  const description = (withoutComments.startsWith('# ') ? withoutComments.split('\n').slice(1).join('\n') : withoutComments).trim();
  return {
    schemaVersion: 1, status: 'unverified', representation: 'local-markdown',
    countUnit: 'utf16-code-units', measuredSize: description.length, limit,
    localStatus: limit === null ? 'no-local-budget' : description.length > limit ? 'over-local-budget' : 'within-local-budget',
    reason: 'Final provider conversion, generated metadata, and attachment URLs have not been validated.',
    nextAction: 'Use an available read-only provider-description validator before publishing; preserve all evidence and record the remaining validation gate.'
  };
}

async function main(args) {
  try {
    if (!args[0] || args[0].startsWith('--') || ![1, 3].includes(args.length) || (args.length === 3 && args[1] !== '--limit')) throw new Error('Invalid arguments');
    const limit = args.length === 3 ? Number(args[2]) : null;
    const result = measureStoryDescription(await fs.readFile(args[0], 'utf8'), { limit });
    process.stdout.write(JSON.stringify(result) + '\n');
    return 2;
  } catch {
    process.stdout.write(JSON.stringify({ status: 'error', message: 'Expected a readable story file and optional --limit <positive integer>.' }) + '\n');
    return 3;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.exitCode = await main(process.argv.slice(2));
}
