#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const requiredSharedSections = [
  '## Operating Model',
  '## Session Contract',
  '## Phase Execution',
  '### Phase 2.5: Deploy the Outcome',
  '## Lightweight Mode And Plan Approval',
  '## Persistent Rules'
];

export const requiredSharedFiles = [
  'SKILL.md',
  'agents/openai.yaml',
  'references/acceptance-criteria.md',
  'references/changelog-style-guide.md',
  'references/confirm-the-outcome.md',
  'references/define-the-outcome.md',
  'references/dependency-direction-rule.md',
  'references/deploy-the-outcome.md',
  'references/interaction-contract.md',
  'references/interactive-facilitation.md',
  'references/interactive-review-pattern.md',
  'references/lean-architecture-experts.md',
  'references/pair-mob-programming-experts.md',
  'references/product-builder-experts.md',
  'references/prove-the-outcome.md',
  'references/readme-style-guide.md',
  'references/review-diff-display.md',
  'references/session-setup.md',
  'references/skill-feedback.md',
  'references/solving-the-shared-context-problem.md',
  'references/vertical-slicing-experts.md',
  'scripts/bundle_hdd_feedback.mjs',
  'scripts/evaluate_hdd_plan.mjs',
  'scripts/evaluate_hdd_skill.mjs',
  'scripts/evaluate_progress_notes_contract.mjs'
];

export const forbiddenHardDependencies = [
  { label: 'imdone agent config', pattern: /imdone agent-config/i },
  { label: 'imdone provider pull', pattern: /imdone pull/i },
  { label: 'imdone provider push', pattern: /imdone push/i },
  { label: 'imdone template command', pattern: /imdone-template|imdone template/i },
  { label: 'imdone push state', pattern: /push\.mode|push\.promptDue|hasPendingChanges/i }
];

function readOption(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function evaluateParity({ canonicalDir, targetDir }) {
  const errors = [];
  const canonicalSkill = await fs.readFile(path.join(canonicalDir, 'SKILL.md'), 'utf8');
  const targetSkillPath = path.join(targetDir, 'SKILL.md');
  const targetSkill = (await exists(targetSkillPath))
    ? await fs.readFile(targetSkillPath, 'utf8')
    : '';

  for (const section of requiredSharedSections) {
    if (canonicalSkill.includes(section) && !targetSkill.includes(section)) {
      errors.push('Missing shared section: ' + section);
    }
  }

  for (const relativePath of requiredSharedFiles) {
    const canonicalPath = path.join(canonicalDir, relativePath);
    if ((await exists(canonicalPath)) && !(await exists(path.join(targetDir, relativePath)))) {
      errors.push('Missing shared file: ' + relativePath);
    }
  }

  const targetMarkdown = [];
  for (const relativePath of requiredSharedFiles.filter((file) => file.endsWith('.md'))) {
    const filePath = path.join(targetDir, relativePath);
    if (await exists(filePath)) {
      targetMarkdown.push(await fs.readFile(filePath, 'utf8'));
    }
  }
  const combinedTarget = targetMarkdown.join('\n');
  for (const dependency of forbiddenHardDependencies) {
    if (dependency.pattern.test(combinedTarget)) {
      errors.push('Forbidden hard dependency: ' + dependency.label);
    }
  }

  return errors;
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const canonicalDir = readOption('--canonical');
  const targetDir = readOption('--target');
  if (!canonicalDir || !targetDir) {
    console.error('Usage: npm run check:parity -- --canonical <skill-dir> --target <skill-dir>');
    process.exit(2);
  }

  const errors = await evaluateParity({
    canonicalDir: path.resolve(canonicalDir),
    targetDir: path.resolve(targetDir)
  });
  if (errors.length) {
    console.error(errors.map((error) => '- ' + error).join('\n'));
    process.exit(1);
  }
  console.log('OK: public HDD adaptation preserves shared workflow contracts without hard imdone dependencies.');
}
