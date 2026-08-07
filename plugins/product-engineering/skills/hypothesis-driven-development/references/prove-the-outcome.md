# Prove The Outcome

Use this reference during Phase 2.

## Order

1. Design
2. Plan
3. Implement
4. Deploy

## Required Context Before Each Phase 2 Step

Before drafting or revising Design, Plan, or Implement:

- Load the relevant expert reference:
  - Design: `references/lean-architecture-experts.md`
  - Plan: `references/lean-architecture-experts.md`; also load `references/dependency-direction-rule.md` when dependency direction is unclear
  - Implement: `references/lean-architecture-experts.md` and `references/pair-mob-programming-experts.md`
- Search the current backlog and the configured archive for related stories, hypotheses, acceptance criteria, plans, or outcomes before proposing the next artifact or implementation step.
- Read `.imdone/config.yml` to find `settings.cards.archiveFolder`; inspect that configured archive path when it exists, and use `.imdone/archive` as the fallback archive location when needed.
- Prefer targeted searches over broad reads. Search by the active story's domain terms, provider, feature area, and hypothesis language, then open only the most relevant matching stories or attachments.
- Summarize what prior story context was useful, what was not applicable, and what should influence the current Design, Plan, or Implement step.
- If no relevant prior story or archive context exists, state that explicitly in the artifact or the user-facing explanation so the gap is visible.

## Design

- Summarize the smallest clean approach.
- Identify the first boundary or module to touch.
- Name the dependency direction that must stay clean.
- Identify whether the story adds a new use case or variation that creates an axis of change in the touched path.
- Create at least one Mermaid diagram in `attachments/diagram.md` during Design.
- Use the diagrams to show the key boundary, flow, or code-change path that makes the design understandable to another engineer.
- Keep the diagrams small and practical; choose the diagram types that best fits the decision instead of defaulting to a flowchart.
- Keep Mermaid diagrams readable in both light and dark mode. Prefer default theme colors, avoid hard-coded light-only or dark-only fills/text, and use labels that still read clearly without custom styling.
- Avoid new layers unless the story forces them.
- When the slice touches an existing flow, look for obvious duplication in that touched path and prefer a small DRY cleanup over copying the same logic into one more branch.
- Prefer code as documentation. Favor clearer names, smaller helpers, simpler control flow, and stronger tests before adding explanatory prose.
- If the story is blocked and the blocker reason is vague, treat clarifying that reason as part of the design and planning problem rather than assuming implementation can proceed cleanly.
- Make sure the human understands why this boundary is first and what is intentionally not being changed yet.
- Before proceeding to Plan, make sure the design is understood by all relevant roles on the team.
- Before proceeding to Plan, make sure the team agrees the vertical slice can be delivered in 3 days or less. If not, slice it smaller.
- Ask:
  - 1 broad shared-understanding question
  - 1-2 narrow role-specific questions when the design is accepted too quickly or sounds correct but may not yet be shared
  - an alignment question when the next concrete change is still unclear
  - a critical question when the design may be bigger than the claimed slice, the boundary choice could be wrong, or the verification path depends on unproven assumptions
- Present every question with numbered answer choices, including a numbered free-form option when needed.
- If the answers expose mismatched understanding, revise `attachments/design.md` before moving to `attachments/plan.md`.

## Plan

- Make it execution-ready for an AI coding agent.
- Make it human-readable first.
- Always structure the implementation path as red/green/refactor.
- The first executable implementation task must be a red task that builds and runs a failing test, reproduction, or executable proof.
- Do not plan green implementation before the red task has been created and run.
- Make the red step explicit: the first failing test, reproduction, or executable proof that the current behavior is wrong or missing.
- Make the green step explicit: the smallest code change that makes the red step pass.
- Make the refactor step explicit: the local cleanup or contract tightening that preserves green behavior while improving readability or duplication.
- When the story adds a new use case or variation that creates an axis of change, make the refactor step explicitly restore the Clean Architecture dependency rule: policy and use-case code must not depend on delivery details.
- Load `references/dependency-direction-rule.md` whenever the plan crosses policy/detail boundaries or a new use case makes dependency direction relevant, even if the direction seems obvious.
- Include likely files or components when inferable.
- Include constraints so scope does not expand.
- End with verification.
- End with a final confirmation phase whose last executable task runs the full project test suite. Focused tests, smoke tests, demos, package checks, and linters may appear earlier, but the full suite must be the final implementation confirmation before Implement can be checked complete.
- Include the smallest feedback affordance or equivalent capture path that lets the target user provide feedback from the surface they use. For UI work this should be in-app; for CLI/API/automation work it may be command output plus help/feedback links, logs, persisted artifacts, audit records, metrics, or provider-visible state.
- Include the instrumentation/data capture work needed to measure the primary success metric: event name, payload fields, storage/query location, command output, persisted artifact, log record, provider field, or other durable evidence source, plus how to verify the signal is emitted.
- If no feedback or measurement mechanism is implemented yet, add the smallest implementation task to create or reuse one before implementation can be marked complete. Do not leave the evidence loop as a generic follow-up.
- Include README and changelog update tasks, or explicit checked decisions that neither artifact needs a change for this slice.
- If README content will change, load `references/readme-style-guide.md` before drafting that plan step so the update matches the existing README style.
- If changelog content will change, load `references/changelog-style-guide.md` before drafting that plan step so the update matches the existing changelog style.
- If the plan touches repeated logic in one flow or module, include the intended DRY extraction or consolidation step instead of planning another copy.
- If the new use case proves an axis of change, include the smallest dependency inversion or boundary move needed in the touched path; do not leave it as a future cleanup item.
- Prefer plan steps that improve readability through code shape and tests. Do not rely on follow-up comments or docs to explain avoidable complexity.
- If the story is blocked, make sure the plan records whether the blocker reason is clear enough to act on.
- If the blocker reason is vague, add a plan step to capture the missing blocker context in the issue or attachments before treating the work as handoff-ready.
- Periodically re-check shared-context fitness on the active story during Phase 2, especially after pivots, blocker discovery, or major plan rewrites. Use the single-story shared-context report when helpful.
- Prefer mergeable phases with no user-visible regression between them.
- `attachments/plan.md` must contain a real sequenced plan, not placeholders.
- Every executable step in `attachments/plan.md` must use markdown checkboxes in the form `- [ ]`.
- Every plan that includes implementation work must name red, green, and refactor in the phase steps rather than implying them.
- Every plan that includes implementation work must include README and changelog coverage: update them when user-facing behavior, CLI contract, docs, or release notes change, or include explicit no-change decisions when they do not apply. README and changelog update steps should mention the relevant style guide when content will be written.
- Every executable implementation phase must list tasks in the order they must be implemented. Do not rely on prose ordering outside the checklist.
- Every executable implementation phase must contain red, green, and refactor tasks in that order unless the phase is explicitly marked as non-executable planning or external evidence.
- The final executable implementation phase must be a confirmation phase, and its last executable task must run the full project test suite, such as `npm test`, `npm run test-ci`, `cargo test`, `go test ./...`, `pytest`, or the repository's documented equivalent.
- Before accepting a plan, run the strongest available evaluator. Preferred local evaluator: `node .codex/skills/hypothesis-driven-development/scripts/evaluate_hdd_plan.mjs <path-to-attachments/plan.md>`.
- If the evaluator reports missing red/green/refactor tasks, out-of-order tasks, or checked tasks after unchecked executable tasks, repair `attachments/plan.md` before implementation begins.
- Include:
  - `## Goal`
  - `## Risks / Unknowns`
  - `## Phases`
- Each phase should include:
  - purpose
  - entry point
  - files or boundaries
  - what is stubbed
  - what becomes real
- verification
  - regression risk
- Include 1-3 short code-focused snippets or pseudocode blocks for the highest-risk or least-obvious steps.
- Reuse and refine the Design diagrams in `attachments/diagram.md` when the Plan step needs more precision; add headings when more than one diagram is useful.
- Diagram the code-change path when the plan depends on touching multiple production files or modules in a specific order.
- Keep tests out of the diagrams unless the user explicitly wants them shown; describe test strategy in the plan text instead.
- Choose the diagram types that best matches the decision being communicated instead of defaulting to a flowchart.
- Keep the diagrams small and practical.
- Keep Mermaid diagrams readable in both light and dark mode. Avoid theme-dependent custom colors unless they are proven legible across both themes.
- Good defaults:
  - flowchart: control flow, handoff flow, or high-level data movement
  - sequenceDiagram: request/response order, sync timing, or actor/system interactions
  - classDiagram: a small set of domain objects or file/data shapes when structure is the main point
  - stateDiagram-v2: lifecycle or status transitions
  - erDiagram: persistent relationships when storage shape is the main risk
- flowchart with file/module nodes: code-change order or rollback boundaries across production code
- If the existing plan is prose-only, rewrite the actionable sequence as checkbox items.
- Before writing the final plan, ask:
  - at least one comprehension check confirming the human understands the execution path, first code change, or main regression risk
  - at least one critical question about the main failure mode, hidden dependency, rollback point, or evidence that the slice is actually complete
- Present every question with numbered answer choices, including a numbered free-form option when needed.
- If the human cannot answer that check clearly, revise the draft before writing the plan.

## Revising An Existing Plan

- Preserve completed phases.
- Update remaining phases to match what has been learned.
- Add a short progress note for pivots, new constraints, or eliminated risks by trying `imdone note <issueKey> "<note>"` first. Append directly to `attachments/progress-notes.md` only if `imdone note` is unavailable or exits non-zero for the current workspace.
- During implementation, capture user feedback, decisions, blockers, corrections, completed meaningful work, next steps, and newly learned constraints in `attachments/progress-notes.md` through `imdone note` when that command succeeds, or direct Markdown append only when `imdone note` is unavailable or fails, instead of leaving them only in conversation history.
- Use progress notes to capture both "what changed" and "why it changed" plus what must be remembered and what should be worked on next.
- Let `imdone note` add the full ISO timestamp and author when available; otherwise write the timestamp and best available author directly, so resumability includes ordering within the day.
- Tell the user which phase changed and the new execution path.
- Keep completed checklist items checked and leave future work unchecked.
- If the pivot is significant, ask one alignment or comprehension question before rewriting multiple phases.
- After a pivot, explicitly say what the old next step was and what the new next step is.

## Implement

- Define done in the order the code will change.
- Call out the first red test, first green change, and cleanup or contract step.
- Implement strictly top-to-bottom through `attachments/plan.md`.
- Build and execute the red task first. The first implementation command or code edit must create or run the failing test, reproduction, or executable proof from the plan.
- Do not start a task until the preceding executable task is checked in `attachments/plan.md`.
- Before checking any markdown task, evaluate that it is actually done using the best available proof for that task: failing test for red, passing targeted test for green, passing regression suite or focused checks for refactor, and explicit command/output notes when useful.
- After a task is evaluated done, check its markdown box before starting the next executable task.
- If a true red task cannot be executed locally, stop and record the evidence gate or blocker in `attachments/plan.md` instead of silently skipping to green.
- Before advancing past each implementation task, run `node .codex/skills/hypothesis-driven-development/scripts/evaluate_hdd_plan.mjs <path-to-attachments/plan.md>` when available. Treat failures as blockers to continuing.
- Implement the planned feedback affordance or equivalent capture path before marking implementation complete. For app-facing slices, this should be in-app unless the story records a product reason not to; for CLI/API/automation slices, implement or reuse the concrete output, help/feedback link, log, artifact, metric, or provider-visible state named in Success Metrics.
- Implement or wire the planned instrumentation/data capture for the success metric, including a verification step that proves the signal can be observed. If that mechanism is deferred, leave implementation incomplete because the slice is not end-to-end yet.
- DRY up repeated logic in the touched flow when it materially clarifies intent, removes parallel branches, or reduces handoff risk. Keep the refactor local to the slice.
- If the implementation added a new use case or variation that exposes an axis of change, refactor before completion so source-code dependencies point toward policy/use-case boundaries and details implement outward-facing ports or interfaces.
- Keep dependency-rule refactors local to the proven axis of change; do not introduce broad abstractions without a use case that needs them.
- Use code as documentation: prefer readable module boundaries, good function names, explicit data flow, and behavior-focused tests. Add comments only when the code cannot reasonably explain itself.
- Keep `attachments/demo.md` current during implementation. If the built path, visible outcome, fallback behavior, or operator steps change, revise the existing demo plan instead of creating a second demo artifact.
- If the root cause changes, update `attachments/plan.md` before continuing.
- If the user changes direction, clarifies scope, or gives implementation feedback, update affected plan steps in `attachments/plan.md` immediately and record the changed path and reason with `imdone note` first, falling back to a direct progress-note append only if `imdone note` is unavailable or fails.
- Add a new attachment when the implementation feedback would be hard to recover from the plan alone, such as a focused note for testing, rollout, API contract, review context, or a clarifying diagram.
- Prefer this pattern:
  - update the affected phase tasks in `attachments/plan.md`
  - run `imdone note <issueKey> "<old next step, new next step, status change, reason for the pivot, user feedback, discovered constraint, or warning for future resumption>"` first, or append that note directly to `attachments/progress-notes.md` only if `imdone note` is unavailable or fails
- Before checking `Implement` complete, make sure `attachments/demo.md` still matches the real behavior well enough for another human or AI to show the slice without reconstructing the flow from memory.
- Before checking `Implement` complete, run the full project test suite from the plan's final confirmation phase after focused checks and artifact-specific verification are green. If the full suite fails, treat that as implementation feedback: fix it, update the plan if the path changes, and do not check Implement complete until the full suite passes or a concrete blocker is recorded.
- If the next unchecked item requires a real-world meeting, deployment, customer action, or other external evidence, stop local implementation at that evidence gate. Record the blocker, the required outside action, and where the resulting evidence must be captured before more boxes are checked.

## Deploy

- Deploy is the final step of Prove the Outcome.
- Require evidence that the slice is live in an appropriate place for the slice.
- Accept evidence such as production, preview, local dogfood, package version, command output, environment, URL, artifact, provider-visible state, or release identifier.
- If deploy evidence depends on external validation, record the evidence gate or blocker instead of checking the gate complete.
- Treat Deploy as live-slice proof only; move to Confirm separately to prove the outcome happened.
- If implementation produces or updates a PR, first reference the current story and how the PR relates to it, then check whether the PR will be difficult to review with the current shared context.
- If the PR is hard to review, add review context to the issue or attachments before treating the work as implementation-complete.
- Before checking Implement complete, make sure the story still has enough shared context for another person to continue without interruption.
- Check the story-level Implement box only when implementation is genuinely complete.
