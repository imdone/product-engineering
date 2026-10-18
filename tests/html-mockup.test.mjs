import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import test from 'node:test';
const roots = ['plugins/product-engineering/skills/hypothesis-driven-development'];

const plan = `# Plan
## Phase 1
- [ ] Red: run failing interaction tests.
- [ ] Green: implement accepted behavior.
- [ ] Refactor: consolidate state handling.
- [ ] Evaluation: render the real implementation in the accepted states and viewports, compare actual-state screenshots with the accepted mockup, correct material mismatches and re-evaluate.
- [ ] Documentation: README no-change decision; CHANGELOG no-change decision.
- [ ] Confirmation: run npm test as the final full test suite.
`;

for (const root of roots) {
  test(`${root}: conditional HTML review guidance`, async () => {
    const design = await fs.readFile(path.join(root, 'references/prove-the-outcome.md'), 'utf8');
    assert.match(design, /UI change.*(?:Full|Lightweight)|(?:Full|Lightweight).*UI change/is);
    assert.match(design, /clickable.*HTML|HTML.*clickable/is);
    assert.match(design, /accepted.*HTML.*(?:plan|task)/is);
  });

  test(`${root}: captures review evidence`, async () => {
    const guidance = await fs.readFile(path.join(root, 'references/prove-the-outcome.md'), 'utf8');
    assert.match(guidance, /mockup_presented/);
    assert.match(guidance, /mockup_decided/);
  });

  for (const scenario of ['missing-link', 'missing-file', 'wrong-plan-link', 'omitted-plan-link', 'valid', 'encoded-space', 'non-ui']) {
    test(`${root}: ${scenario}`, async () => {
      const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'hdd-html-contract-'));
      try {
        const { evaluate } = await import(pathToFileURL(path.resolve(root, 'scripts/evaluate_hdd_plan.mjs')).href);
        const name = scenario === 'encoded-space' ? 'mockup with spaces.html' : 'mockup.html';
        const href = scenario === 'encoded-space' ? './mockup%20with%20spaces.html#desktop' : './mockup.html';
        if (scenario !== 'missing-file') await fs.writeFile(path.join(directory, name), '<!doctype html><title>Mockup</title>');
        await fs.writeFile(path.join(directory, 'other.html'), '<title>Other</title>');
        let design = '# Design\n## UX mockup decision\nRequired and accepted by the product owner.\n';
        if (scenario !== 'missing-link') design += `\n[Accepted HTML mockup](${href})\n`;
        if (scenario === 'non-ui') design = '# Design\n## UX mockup decision\nNot applicable: no user-visible UI change.\n';
        await fs.writeFile(path.join(directory, 'design.md'), design);
        const link = scenario === 'wrong-plan-link' ? './other.html' : href;
        const content = plan + (['omitted-plan-link', 'non-ui'].includes(scenario) ? '' : `\n[Accepted mockup](${link})\n`);
        const planPath = path.join(directory, 'plan.md');
        await fs.writeFile(planPath, content);
        const findings = evaluate(planPath);
        if (['valid', 'encoded-space', 'non-ui'].includes(scenario)) assert.deepEqual(findings, []);
        else assert.ok(findings.some(({ message }) => /HTML|accepted.*artifact|accepted.*mockup.*link/i.test(message)), JSON.stringify(findings));
      } finally { await fs.rm(directory, { recursive: true, force: true }); }
    });
  }
}
