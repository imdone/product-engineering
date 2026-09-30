import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { evaluate } from '../plugins/product-engineering/skills/hypothesis-driven-development/scripts/evaluate_hdd_plan.mjs';

const structurallyCompletePlan = `# Implementation Plan

## Phase 1 — Responsive navigation

- [ ] **Red:** add failing story-owned tests for the accepted navigation states and viewport variants.
- [ ] **Green:** make the renderer contract pass with the smallest implementation.
- [ ] **Refactor:** consolidate shared menu markup without changing behavior.
- [ ] **Evaluation:** run DOM, unit, structural, accessibility, and layout checks for the accepted responsive behavior.
- [ ] **Documentation:** README no-change decision; CHANGELOG no-change decision.
- [ ] **Final full-suite proof:** run npm test as the final implementation confirmation.
`;

async function withStory(design, plan, callback) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'hdd-visual-fidelity-'));
  try {
    await fs.writeFile(path.join(directory, 'design.md'), design);
    const planPath = path.join(directory, 'plan.md');
    await fs.writeFile(planPath, plan);
    await callback(planPath);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

test('rejects a UX plan whose accepted mockup is never compared with the rendered implementation', async () => {
  const design = `# Technical Design

## UX Mockup Decision

**Required and accepted by the product owner.**

- [Expanded desktop navigation](./desktop-navigation-mockup.png)
- [Collapsed narrow navigation](./narrow-navigation-mockup.png)

The accepted states cover the normal desktop viewport and minimum supported width.
`;

  await withStory(design, structurallyCompletePlan, async (planPath) => {
    const findings = evaluate(planPath);
    assert.ok(
      findings.some(({ message }) => /accepted mockup.*rendered implementation|visual fidelity/i.test(message)),
      `expected a visual-fidelity finding, received: ${JSON.stringify(findings)}`
    );
  });
});

test('does not require implementation fidelity evidence for an explicit non-UX design', async () => {
  const design = `# Technical Design

## UX Mockup Decision

**Not applicable.** This refactor changes no user-visible layout or interaction.
`;

  await withStory(design, structurallyCompletePlan, async (planPath) => {
    assert.deepEqual(evaluate(planPath), []);
  });
});

test('accepts a UX plan with direct rendered comparison and a mismatch correction loop', async () => {
  const design = `# Technical Design

## UX Mockup Decision

**Required and accepted by the product owner.**

- [Expanded desktop navigation](./desktop-navigation-mockup.png)
- [Collapsed narrow navigation](./narrow-navigation-mockup.png)
`;
  const plan = structurallyCompletePlan.replace(
    '- [ ] **Evaluation:** run DOM, unit, structural, accessibility, and layout checks for the accepted responsive behavior.',
    '- [ ] **Evaluation:** render the real implementation in every accepted state and viewport, capture durable actual-state screenshots, and compare them directly with the accepted mockup. If a material mismatch remains, reopen the smallest correction and repeat the visual evaluation.'
  );

  await withStory(design, plan, async (planPath) => {
    assert.deepEqual(evaluate(planPath), []);
  });
});

test('rejects ceremonial screenshot language without mismatch correction and re-evaluation', async () => {
  const design = `# Technical Design

## UX Mockup Decision

**Required and accepted by the product owner.**
`;
  const plan = structurallyCompletePlan.replace(
    '- [ ] **Evaluation:** run DOM, unit, structural, accessibility, and layout checks for the accepted responsive behavior.',
    '- [ ] **Evaluation:** render implementation screenshots for the accepted mockup states and viewports, then compare them for visual fidelity.'
  );

  await withStory(design, plan, async (planPath) => {
    const findings = evaluate(planPath);
    assert.ok(findings.some(({ message }) => /corrects and re-evaluates material mismatches/i.test(message)));
  });
});

test('enforces an accepted UX follow-on after an initial non-UX decision', async () => {
  const design = `# Technical Design

### UX mockup decision for the original policy slice

**Not applicable.** The policy-only change has no product surface.

## Follow-on — Feedback modal

**UX mockup decision:** Required — this follow-on changes a user interaction.

**Proposed-state mockup:** [Feedback modal](./feedback-modal.png)

**Product-owner review:** Accepted.
`;

  await withStory(design, structurallyCompletePlan, async (planPath) => {
    const findings = evaluate(planPath);
    assert.ok(findings.some(({ message }) => /visual fidelity/i.test(message)));
  });
});
