#!/usr/bin/env node

import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const MERMAID_PACKAGE_VERSION = '12.0.0';
export const JSDOM_PACKAGE_VERSION = '27.0.1';

const execFileAsync = promisify(execFile);
const MERMAID_FENCE_RE = /^```mermaid[^\S\r\n]*\r?\n([\s\S]*?)^```[^\S\r\n]*$/gm;

export function extractMermaidBlocks(markdown) {
  const blocks = [];
  for (const match of markdown.matchAll(MERMAID_FENCE_RE)) {
    const startLine = markdown.slice(0, match.index).split(/\r?\n/).length;
    blocks.push({
      index: blocks.length + 1,
      line: startLine,
      source: match[1].trim(),
    });
  }
  return blocks;
}

function parserFromModule(module) {
  const api = module?.default || module;
  const parse = api?.parse;
  if (typeof parse !== 'function') {
    throw new Error('Mermaid parser module does not export parse()');
  }
  api.initialize?.({ startOnLoad: false });
  return parse.bind(api);
}

async function loadPinnedParser({
  env = process.env,
  run = execFileAsync,
  makeTemp = fs.mkdtemp,
  remove = fs.rm,
} = {}) {
  if (env.HDD_MERMAID_MODULE) {
    const modulePath = path.resolve(env.HDD_MERMAID_MODULE);
    const module = await import(pathToFileURL(modulePath).href);
    return { parse: parserFromModule(module), cleanup: async () => {} };
  }

  const tempDirectory = await makeTemp(path.join(os.tmpdir(), 'hdd-mermaid-parser-'));
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  try {
    await run(npmCommand, [
      'install',
      '--prefix', tempDirectory,
      '--no-save',
      '--package-lock=false',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      `mermaid@${MERMAID_PACKAGE_VERSION}`,
      `jsdom@${JSDOM_PACKAGE_VERSION}`,
    ], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    const jsdomPath = path.join(
      tempDirectory,
      'node_modules',
      'jsdom',
      'lib',
      'api.js',
    );
    const jsdomModule = await import(pathToFileURL(jsdomPath).href);
    const JSDOM = jsdomModule.JSDOM || jsdomModule.default?.JSDOM;
    if (typeof JSDOM !== 'function') {
      throw new Error('Pinned jsdom package does not export JSDOM');
    }
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;

    const modulePath = path.join(
      tempDirectory,
      'node_modules',
      'mermaid',
      'dist',
      'mermaid.core.mjs',
    );
    const module = await import(pathToFileURL(modulePath).href);
    return {
      parse: parserFromModule(module),
      cleanup: async () => {
        dom.window.close();
        if (previousWindow === undefined) delete globalThis.window;
        else globalThis.window = previousWindow;
        if (previousDocument === undefined) delete globalThis.document;
        else globalThis.document = previousDocument;
        await remove(tempDirectory, { recursive: true, force: true });
      },
    };
  } catch (error) {
    await remove(tempDirectory, { recursive: true, force: true });
    const detail = String(error?.stderr || error?.message || error).trim();
    throw new Error(
      `Unable to load pinned mermaid@${MERMAID_PACKAGE_VERSION} parser runtime. ` +
      `Check npm/network availability and retry. ${detail}`,
    );
  }
}

export async function validateMermaidFile(filePath, { parse } = {}) {
  const markdown = await fs.readFile(filePath, 'utf8');
  const blocks = extractMermaidBlocks(markdown);
  if (blocks.length === 0) {
    throw new Error(`${filePath}: no fenced Mermaid blocks found`);
  }

  for (const block of blocks) {
    try {
      await parse(block.source);
    } catch (error) {
      const detail = String(error?.message || error).trim();
      throw new Error(
        `${filePath}:${block.line} Mermaid block ${block.index} failed syntax validation\n${detail}`,
      );
    }
  }

  return blocks.length;
}

async function main(argv) {
  const filePaths = argv.slice(2);
  if (filePaths.length === 0 || filePaths.includes('-h') || filePaths.includes('--help')) {
    console.log('usage: validate_mermaid.mjs <markdown-file> [markdown-file...]');
    return filePaths.length === 0 ? 2 : 0;
  }

  let parser;
  try {
    parser = await loadPinnedParser();
    let diagramCount = 0;
    for (const filePath of filePaths) {
      diagramCount += await validateMermaidFile(path.resolve(filePath), parser);
    }
    console.log(
      `OK: validated ${diagramCount} Mermaid diagram(s) with mermaid@${MERMAID_PACKAGE_VERSION}.`,
    );
    return 0;
  } catch (error) {
    console.error(`ERROR: ${error?.message || error}`);
    return 1;
  } finally {
    await parser?.cleanup?.();
  }
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.exitCode = await main(process.argv);
}
