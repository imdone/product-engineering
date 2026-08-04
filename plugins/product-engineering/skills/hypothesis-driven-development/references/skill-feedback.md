# HDD Skill Feedback

Use this reference when the goal is to evaluate or improve the HDD skill itself.

## Purpose

Capture per-story evidence about whether the HDD workflow is teaching product-engineering behavior:

- explicit user-valued outcomes
- explicit product risk
- thin slices
- measurable evidence
- instrumentation or durable data capture for success metrics
- direct user feedback paths
- reduced handoff risk
- useful author feedback for `imdone-cli`

The feedback artifacts are not part of product delivery. They are instrumentation for the skill author.

## Files

- `attachments/hdd-skill-feedback.md`
- `attachments/hdd-skill-feedback.json`

## When To Write Them

- after a meaningful HDD session
- when the workflow hits an external-evidence gate
- when the skill guidance is unclear, repetitive, or weak
- before ending a session where the user is explicitly evaluating the skill
- when the session reveals product feedback that the `imdone-cli` author should see

## Markdown Shape

Use this shape for `attachments/hdd-skill-feedback.md`:

```md
# HDD Skill Feedback

## Latest Assessment

- Session date: 2026-03-29
- Phase reached: Define the Outcome
- Explicit user-valued outcome: yes
- Explicit primary risk: yes
- Thin slice: yes
- Measurable evidence: yes
- Instrumentation/data capture path: yes
- Direct user-feedback path: no
- External-evidence gate reached: no
- Handoff risk reduced: yes

## Friction

- The product-owner check added overhead in a solo async review.

## Author Signal

- The story needed a clearer path for packaging README attribution evidence, which suggests `imdone-cli` could benefit from a more standard evaluation-report workflow.

## Suggested Improvement

- Ask the product-owner question once, record the answer, then stop repeating it.

## Session History

### 2026-03-29

- Short note about what was learned in this session.
```

## JSON Shape

Use this shape for `attachments/hdd-skill-feedback.json`:

```json
{
  "session_date": "2026-03-29",
  "phase_reached": "Define the Outcome",
  "signals": {
    "explicit_user_valued_outcome": true,
    "explicit_primary_risk": true,
    "thin_slice": true,
    "measurable_evidence": true,
    "instrumentation_path": true,
    "direct_user_feedback_path": false,
    "external_evidence_gate_reached": false,
    "handoff_risk_reduced": true
  },
  "friction": [
    "The product-owner check added overhead in a solo async review."
  ],
  "author_signals": [
    "The story needed a clearer path for packaging README attribution evidence, which suggests imdone-cli could benefit from a more standard evaluation-report workflow."
  ],
  "suggested_improvement": "Ask the product-owner question once, record the answer, then stop repeating it."
}
```

## Evaluator

To aggregate feedback across HDD stories, run:

```bash
node .codex/skills/hypothesis-driven-development/scripts/evaluate_hdd_skill.mjs
```

Useful options:

```bash
node .codex/skills/hypothesis-driven-development/scripts/evaluate_hdd_skill.mjs --root .
node .codex/skills/hypothesis-driven-development/scripts/evaluate_hdd_skill.mjs --write-report /tmp/hdd-skill-report.md
node .codex/skills/hypothesis-driven-development/scripts/evaluate_hdd_skill.mjs --json-out /tmp/hdd-skill-report.json
```

The evaluator prefers the explicit feedback artifacts when present, then falls back to heuristics from the story and attachments.

## Bundling For The Author

To package the evaluator output plus raw story feedback into a bundle that can be sent back to the author, run:

```bash
node .codex/skills/hypothesis-driven-development/scripts/bundle_hdd_feedback.mjs --root . --outdir /tmp/hdd-feedback-bundle
```

This produces:

- a markdown report
- a JSON report
- copies of discovered `hdd-skill-feedback.md` and `.json` artifacts
- a zip archive ready to share with the author
