---
name: hypothesis-driven-development
description: Guide a story through hypothesis-driven development from user-confirmed problem framing through hypothesis, design, plan, implementation, deploy evidence, and outcome confirmation. Use when the user wants to refine a story, define or repair binary acceptance criteria, create or revise an AI-executable plan, add success metrics or demo steps, validate dependency direction, or check progress against the workflow artifacts.
---

# Hypothesis-Driven Development

## Tool-Neutral Boundary

HDD works from story files and durable artifacts in the user's workspace. Do not require a particular issue tracker, provider CLI, or project-management product.

- store current state in the issue/story file and linked attachments when they exist
- record chronological notes directly in `attachments/progress-notes.md` or the repository's local progress-note equivalent
- when a team already uses imdone, `imdone note <issueKey> "<note>"` is an optional shortcut for the same chronological record; it is never required
- use repository-native templates and provider sync tools only when the user asks and the workspace already supports them
- describe publishing, provider sync, reviews, and other outside actions as external evidence gates when they cannot be completed locally

## Operating Model

Guide a story through outcome-focused phases with explicit Deploy and Confirm gates:
- Define the Outcome
- Prove the Outcome
- Deploy the Outcome
- Confirm the Outcome

Purpose:
- leave the story with a small, current, execution-ready plan for an AI coding agent
- train outcome-first product-engineering behavior, not just artifact production
- reduce handoff risk with explicit assumptions, measurable evidence, and direct user-feedback paths
- make every vertical slice end-to-end: the slice must include the user-visible behavior, a way for the user to provide feedback from the delivered surface, and an implemented measurement/data-capture mechanism that can show whether the outcome happened
- make Deploy a first-class gate at the end of Prove the Outcome, after Implement, and require evidence that the slice is live in an appropriate place such as production, preview, local dogfood, package version, command output, environment, URL, artifact, provider-visible state, or release identifier
- keep Confirm the Outcome as its own post-deploy phase that proves the outcome happened, not merely that code shipped
- keep touched implementation paths maintainable by preferring small DRY refactors and code-as-documentation during planning and implementation
- make implementation plans explicitly use red/green/refactor so test-first intent, smallest green change, and cleanup are visible in the plan itself
- require every implementation plan to end with a final confirmation phase that runs the full project test suite as the last executable proof before implementation can be marked complete
- require top-to-bottom implementation: build and execute the red step first, evaluate each markdown task as done before checking it, and do not start the next task while the preceding executable task is unchecked
- once the plan is accepted, keep implementing until the whole plan is done; do not stop between planned tasks just to ask whether to continue, summarize status, or re-confirm the already-approved direction
- capture implementation feedback in story artifacts so humans and AI can regain context after interruptions
- when decisions, blockers, corrections, completed meaningful work, or next steps happen during a session, record a concise progress note in the story's progress-note artifact so the story can guide what should be worked on next
- make evidence-bearing progress notes use a tiny lab-notebook shape when possible: `Observation: <what I saw>`, `Evidence: <test count / captured response / command output / commit>`, `Decision: <what we're doing about it, and why over the alternative>`, and `Next: <what the next person should do / trust>`
- make `attachments/progress-notes.md` or the local equivalent the default place to record pivots and corrections, using `attachments/plan.md` only for the execution plan and task checklist
- treat `attachments/demo.md` as a single evolving proof artifact: define it early, then revise it during implementation when the real behavior, commands, or visible outcomes change

Non-goals:
- do not produce free-floating advice when the story artifacts should be updated instead
- do not advance phases or mark progress beyond the current honest step
- do not invent evidence when the next step depends on external validation or an unblock from outside the tool boundary

## Session Contract

Before doing workflow work:

1. Read `references/session-setup.md`.
2. Resolve the story, then load the current story, progress notes, attachment links, and only the artifacts needed for the selected mode and current step.
3. Resolve workspace conventions from `references/session-setup.md`: story location, attachment layout, progress-note artifact, templates, and any user-requested provider sync boundary.
4. Ask the engineer to choose full or lightweight HDD as soon as the story is resolved and the story, progress notes, and attachment links are read, before applying or repairing any HDD template and before doing workflow artifact or phase work. Use the exact numbered prompt in `references/session-setup.md` unless the engineer already made an explicit mode choice in the current conversation.
5. Handle templates by selected mode using `references/session-setup.md`: full HDD applies or repairs the full HDD template when needed; lightweight HDD templates are optional and used only when the engineer asks or one is already present. Use the full HDD expected headings for full mode, and keep lightweight HDD sparse around Problem, Current Plan, and the Progress notes attachment.
6. Make sure the issue file links to every issue attachment that exists so artifacts are easy to find from the story. If the template already includes a link, leave it where it is. Duplicate links are acceptable.
7. Read `references/interaction-contract.md` and follow it throughout the session.

Provider detection rule:
- detect the backing provider from the issue markdown HTML comment metadata
- if the metadata contains `jira:<KEY>`, treat the story as Jira-backed
- if the metadata contains `github:<NUMBER>` or another GitHub issue identifier, treat the story as GitHub-backed
- if neither marker is present, use provider-neutral wording and avoid inventing provider-specific behavior

`references/interaction-contract.md` owns:
- the draft -> confirm -> write loop
- question style and pacing
- when to ask comprehension or critical questions
- publish and provider-sync behavior
- external-evidence gates
- plan freshness and shared-context checks
- how to handle blocked stories

## Phase Execution

Run only the current phase and current unchecked item. Skip anything already checked.

### Phase 1: Define the Outcome

Order:
1. Problem Framing
2. Hypothesis
3. Vertical Slice
4. Acceptance Criteria
5. Validate Assumptions
6. Demo Plan

Write locations:
- Problem Framing: inline in `## Problem Framing` above `## Hypothesis`
- Hypothesis: inline in `## Hypothesis` above `## Define the Outcome`
- Related Work: inline in `## Related Work` above `## Define the Outcome`
- Vertical Slice: inline in `## Vertical Slice` above `## Define the Outcome`
- Acceptance Criteria: inline in `## Acceptance Criteria` above `## Define the Outcome`
- Success Metrics: `attachments/success-metrics.md`
- Validate Assumptions: inline in `## Validate Assumptions` above `## Define the Outcome`
- Demo Plan: `attachments/demo.md`

Load `references/define-the-outcome.md` only when working this phase.
Before Hypothesis, require a user-provided or user-confirmed problem framing. If the issue already contains enough context, draft the framing from the story and ask the user to confirm it with numbered choices. If the issue does not contain enough context, ask the user for the problem framing before writing outcome artifacts.
After Hypothesis is confirmed and checked complete, offer the user the continuation option in `references/interaction-contract.md` so they can choose whether the agent should continue through the remaining HDD work without routine per-artifact interruption.
During Vertical Slice, first inspect related past stories or experiments in the current backlog plus the configured archive, then link the useful ones under `## Related Work` so the slice benefits from prior decisions and evidence.
During Success Metrics, require both a user feedback path and an implemented measurement/data-capture mechanism as part of the slice. For app-facing work, prefer in-app feedback plus product instrumentation. For CLI, API, automation, or infrastructure work, treat that interface as the app surface and require a concrete equivalent such as command output, help/feedback links, structured logs, persisted artifacts, audit records, metrics, or provider-visible state. Do not accept "no telemetry", "manual observation only", or "follow-up later" as complete for the current slice.

### Phase 2: Prove the Outcome

Order:
1. Design
2. Plan
3. Implement
4. Deploy

Write locations:
- Design: `attachments/design.md` and at least one Mermaid diagram in `attachments/diagram.md`
- Plan: `attachments/plan.md` using explicit red/green/refactor sequencing
- Progress notes from feedback, pivots, and discovered constraints: append to `attachments/progress-notes.md` or the local equivalent with an ISO timestamp and author when possible. For evidence-bearing notes, use Observation, Evidence, Decision, and Next. Read legacy `Progress notes:` in `attachments/plan.md` only as backward-compatible context.

Load `references/prove-the-outcome.md` only when working this phase.
Use it for implementation hygiene guidance, including DRY cleanup in touched flows and code-as-documentation defaults.
During Design, Plan, and Implement, always load the relevant expert reference before drafting or building, and inspect related past stories or hypotheses in the current backlog plus the configured archive so the work benefits from prior decisions and evidence.
During Plan and Implement, include the concrete feedback affordance and data-capture mechanism needed to evaluate `attachments/success-metrics.md` as part of the end-to-end slice. For app-facing work this means UI feedback plus analytics/telemetry. For CLI, API, automation, or infrastructure work this means a concrete implemented equivalent such as command output, help/feedback links, structured logs, persisted files, audit records, metrics, or provider-visible state.
During Plan, always include README and changelog coverage: either concrete update tasks or explicit no-change decisions when those artifacts do not apply to the slice. When planning README or changelog content changes, load the corresponding style guide first: `references/readme-style-guide.md` or `references/changelog-style-guide.md`.
During Plan, always end the implementation plan with a final confirmation phase whose last executable task runs the full project test suite, for example `npm test`, `npm run test-ci`, `cargo test`, `go test ./...`, or the repository's documented equivalent. Focused tests and targeted verifications belong earlier; they do not replace the final full-suite run.
During Plan and Implement, use the strongest available evaluator to prevent missed steps. When `attachments/plan.md` exists locally, run `scripts/evaluate_hdd_plan.mjs` before accepting a plan and before advancing past an implementation task; repair missing, skipped, or out-of-order tasks before continuing.
After the plan is accepted, implementation is the default action until every planned task is complete and verified. Continue through the plan without asking the user to approve each next task. Pause only when a required user decision, external evidence gate, tool approval, hard blocker, or newer user instruction prevents meaningful local progress.

### Phase 2.5: Deploy the Outcome

Load `references/deploy-the-outcome.md` when working this gate.

Use Deploy as the final step of Prove the Outcome, after Implement.
- Require evidence that the slice is live in an appropriate place for the slice.
- Accept evidence such as production, preview, local dogfood, package version, command output, environment, URL, artifact, provider-visible state, or release identifier.
- If external validation is required before evidence exists, record an evidence gate or blocker rather than checking Deploy complete.
- Do not treat Deploy as outcome confirmation; it only proves the slice is live.

### Phase 3: Confirm the Outcome

Order:
1. Definition of Done
2. Measure Results
3. Retrospect

Write locations:
- Definition of Done: `attachments/dod.md`
- Measure Results: `## Results` in `attachments/success-metrics.md`
- Retrospect: `## Retrospect` in `attachments/success-metrics.md`

Confirm happens after Deploy. Deploy proves the slice is live; Confirm proves the outcome happened.

Load `references/confirm-the-outcome.md` only when working this phase.

## Focused References

Load only the reference file needed for the current decision:
- setup and attachment rules: `references/session-setup.md`
- Define Outcome workflow: `references/define-the-outcome.md`
- Prove Outcome workflow: `references/prove-the-outcome.md`
- Deploy Outcome workflow: `references/deploy-the-outcome.md`
- Confirm Outcome workflow: `references/confirm-the-outcome.md`
- review prompt shape and product-owner flow: `references/interactive-review-pattern.md`
- acceptance-criteria rewrite help: `references/acceptance-criteria.md`
- slicing and demo questions: `references/vertical-slicing-experts.md`
- hypothesis, metrics, and results questions: `references/product-builder-experts.md`
- design, plan, and architecture questions: `references/lean-architecture-experts.md`
- dependency direction or inversion questions: `references/dependency-direction-rule.md`
- README content changes: `references/readme-style-guide.md`
- changelog content changes: `references/changelog-style-guide.md`
- comprehension checks or facilitation help: `references/interactive-facilitation.md`
- implementation collaboration or done framing: `references/pair-mob-programming-experts.md`
- skill feedback artifact rules: `references/skill-feedback.md`
- shared-context framing only when needed: `references/solving-the-shared-context-problem.md`

## Lightweight Mode And Plan Approval

`references/session-setup.md` owns the full or lightweight HDD choice timing, initial read, template choice, and full-HDD artifact map. `references/interaction-contract.md` owns lightweight mode and plan approval operating detail: choose lightweight mode during story triage/Define as soon as the story is resolved; capture a minimum success measure before the plan with observable outcome, feedback path, and evidence/data-capture mechanism; capture lightweight planning context before plan approval with first boundary or module, independent phases or coupled sources, main failure mode, constraints / what must not change, and evidence/output expectations without forcing a full design document; keep context efficient by loading only the current story, progress notes, minimum outcome fields, compact planning context, current plan, and current-step artifact while deferring full-HDD-only context such as full design/demo/success-metrics/dod unless the selected lightweight step requires it; stop at the evaluated plan checkpoint and do not edit product code before approval so the engineer can confirm the plan or request plan changes. Do not duplicate those rules here; load the owning references for the current step.

## Persistent Rules

- Safe to re-run after interruption.
- Prefer updating current story artifacts over free-floating advice.
- Keep the issue file current as an attachment index. When an issue attachment exists or is created, make sure the issue file links to it. Leave existing template links in place, and accept duplicates when adding missing links is simpler than normalizing them.
- Keep HDD session state in the current story and linked Markdown artifacts so another human or agent can resume without proprietary state.
- Only run provider sync or publishing commands when the user requests them or has already approved that workflow; otherwise record the exact external evidence gate.
- Do not mark Hypothesis complete until `## Problem Framing` exists and the user has provided or confirmed it during the HDD session.
- After Hypothesis is complete, ask once whether to continue through the remaining HDD workflow without routine per-artifact interruption. Respect the chosen continuation scope until a blocker, missing decision, external evidence gate, major pivot, push prompt, or user correction requires stopping.
- When the session-local continuation-through-Plan scope is selected, `references/interaction-contract.md` overrides routine review timing: defer routine per-artifact review until the evaluated Plan checkpoint. Do not defer explicit user-requested publishing or sync, blockers, missing decisions, external evidence gates, major pivots, user corrections, required tool approvals, or failed evaluators.
- Every HDD user-facing question must include numbered answer choices so the user can reply with a number alone. Use a numbered free-form option when the user may need to correct the framing or provide custom details.
- End each user-facing HDD message with a visible indicator showing the active story key or name and a short summary, for example: `🧭 HDD | Story — Short summary`.
- When progress notes are recorded, explicitly say so in the user-facing message after the story footer, using a visible indicator such as: `📝 Progress note recorded in attachments/progress-notes.md`
- Rely on the tool's built-in edit diff. In chat, list changed file paths and summarize the change instead of replaying diffs.
- Default recording pattern for pivots and corrections:
  - update the affected phase steps in `attachments/plan.md`
  - append a short progress note to the local progress-note artifact for decisions, blockers, corrections, completed meaningful work, next steps, what changed, why it changed, and what must be remembered; when the note carries evidence, use Observation, Evidence, Decision, and Next
  - include the best available author and a full ISO timestamp
  - add a new attachment only when the plan is no longer enough to recover the reasoning or boundary cleanly
- No supported skill alias field was found in the current local skill format, so keep the canonical skill name `hypothesis-driven-development` unless alias support is added to the skill loader.
- If the next honest step is outside the tool boundary, record the unblock note or evidence gate instead of pretending the story can advance locally.
- Treat provider issue creation and sync as serialized repository operations unless the selected tool explicitly proves concurrent creation is safe for local state, attachment upload, and issue refresh.
- During Phase 2, do not draft Design, Plan, or Implement artifacts from only the active story. First load the relevant expert reference, then search current backlog stories and the configured archive for similar hypotheses, acceptance criteria, plans, or outcomes. Summarize only the useful prior context; do not bulk-load unrelated archived work.
- If Deploy depends on external validation, stop at the evidence gate and record the blocker instead of checking progress beyond honest evidence.
- Before checking Implement complete, run the full project test suite from the plan's final confirmation phase after all focused checks are green. If the full suite fails, fix the failure or record a concrete blocker and leave Implement unchecked.
