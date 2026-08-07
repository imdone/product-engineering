# Interaction Contract

Use this throughout the workflow.

## Operating Rules

- Draft, do not interrogate. Read context first, then propose a concrete answer.
- Be highly interactive. Human understanding is a primary outcome.
- Prefer short cycles of explain -> confirm understanding -> write.
- Keep drafts easy to scan. Prefer short paragraphs, short lists, and visible line breaks over dense walls of text.
- Ask critical questions, not just comprehension questions. Challenge weak evidence, hidden coupling, oversized slices, and unproven assumptions before writing.
- Keep the workflow anchored to user value. If a story only describes internal output, rewrite or challenge it until the user-visible or customer-visible outcome is explicit.
- Make risk explicit, but do not force artificial product-risk framing when the story is clearly enabling infrastructure.
- If a story is blocked, detect whether the blocker reason is specific enough to guide action. Treat vague blocker reasons as shared-context risk.
- If the next unchecked item depends on real-world action or evidence outside the workspace, do not fabricate progress. Record the exact evidence gate, what must happen next, and where the evidence should be captured.
- If implementation produces or updates a pull request, relate that PR back to the story and check whether the PR has enough shared context to review efficiently before treating implementation as complete.
- Before writing or revising an important artifact, make sure the human understands what is changing in plain language.
- If the user accepts something too quickly, ask one short check-back question when the artifact is important or likely to drive code changes.
- Never optimize for speed at the expense of understanding on Design, Plan, acceptance criteria, or major pivots.
- Keep everything thin and local. Prefer the smallest end-to-end slice that proves the hypothesis.
- Require measurable evidence. Push metrics toward observable behavior change, product data, and a clear measurement window rather than vague completion language.
- Require direct user evidence when confirming outcomes. If no user feedback exists yet, say so explicitly and treat the conclusion as provisional.
- Preserve clean dependency direction, but do not invent abstractions early. When a new use case creates a real axis of change, the dependency-rule refactor is part of implementation completion, not optional follow-up work.
- Red/green/refactor and top-to-bottom task order are mandatory during implementation. Build and execute red first, evaluate each task before checking it, check it before starting the next task, and stop if the preceding executable task is still unchecked.
- Treat `attachments/plan.md` as a live artifact. When implementation changes the path, update the plan immediately.
- When the user provides implementation feedback, decisions, corrections, or newly discovered constraints, update affected plan steps in `attachments/plan.md` when the execution path changes, and record the chronological note by trying `imdone note <issueKey> "<note>"` first. Append the note directly to `attachments/progress-notes.md` with an ISO timestamp and author only if `imdone note` is unavailable or exits non-zero for the current workspace.
- Create additional attachments when warranted for clarity and resumability, for example focused test notes, rollout notes, API notes, review context, or diagrams.
- Use this default recording pattern:
  - update `attachments/plan.md` only when the execution path, tasks, or checklist changes
  - try `imdone note <issueKey> "<note>"` first; append directly to `attachments/progress-notes.md` only if `imdone note` is unavailable or exits non-zero for the current workspace
  - include why the path changed, what feedback or constraint caused it, and what another human or AI should not have to rediscover
  - let `imdone note` write the full ISO timestamp and author into `attachments/progress-notes.md` when available; otherwise write the timestamp and best available author directly
- Prefer the plan over a new attachment unless the context would be hard to recover from the plan alone.
- Periodically check shared-context fitness, especially after pivots, blocker discovery, PR creation, before checking Implement complete, and before closing the story.
- Keep the user in the loop when the plan changes: state what changed, why it changed, and the new next step before or while editing the plan.
- Write confirmed changes immediately. Do not batch multiple accepted items if avoidable.
- When alignment is fuzzy, load the relevant reference file and ask 1-2 pointed questions before writing.
- Every user-facing question must include numbered answer choices using `1.`, `2.`, `3.` so the user can reply with the number alone. Do not ask bare yes/no, approval, push, product-owner, comprehension, or critical questions.
- When a free-form answer may be needed, make it a numbered option, for example `3. Something else: <details>`.
- When a checklist item is not applicable, preserve it visibly by striking through the item text rather than silently leaving it open or marking it complete.
- If an HDD-templated story is out of date relative to the current bundled format, tell the user what is misaligned and repair that structure with them before advancing the workflow item order.

## Lightweight Mode And Plan Checkpoint

Lightweight mode is selected as soon as the story is resolved and the story, progress notes, and attachment links are read, before applying or repairing any HDD template and before doing workflow artifact or phase work. It is not first introduced after planning. Ask for full or lightweight HDD with the numbered prompt from `references/session-setup.md` unless the engineer already made an explicit mode choice in the current conversation. Use lightweight mode only when the engineer explicitly chooses it for low-risk work. Recommend full HDD for high-risk, ambiguous, cross-team, or provider-sync-sensitive work unless the engineer explicitly chooses otherwise.

Before writing the plan in lightweight mode, capture the minimum success measure: observable outcome, feedback path, and evidence/data-capture mechanism. The plan must point at that outcome instead of task completion alone. Before plan approval, also capture a compact lightweight planning context: first boundary/module to touch, independent phases or coupled sources, main failure mode, constraints / what must not change, and evidence/output expectations. Keep this lightweight planning context short enough to prevent rediscovery without forcing a full design document or becoming full HDD. Keep lightweight mode context efficient: load only the current story, progress notes, minimum outcome fields, compact planning context, current plan, and the current-step artifact. Treat full-HDD-only artifacts such as full design/demo/success-metrics/dod as on-demand context, and load them only when the selected lightweight step requires them.

After the plan is drafted and evaluated, stop at the plan approval checkpoint. Do not edit product code yet. Ask:

```text
Plan checkpoint: the evaluated plan is ready. What should happen next?
1. Confirm this evaluated plan and continue with the selected path
2. Request plan changes
```

If the engineer confirms the evaluated plan, continue with the selected full or lightweight path. If the engineer requests changes, revise the plan and do not begin implementation until the revised evaluated plan is confirmed.

## Review Loop

For each unchecked item:
1. Read the story and target attachment.
2. Draft the smallest concrete answer that fits the current context.
3. Briefly explain what the draft is trying to clarify or decide.
4. If the artifact is important enough to drive implementation, or the context still feels ambiguous, load the relevant reference file and ask 1-2 alignment, comprehension, or critical questions before finalizing the draft.
5. Present it in this shape:

*[short expert quote or framing line]*

Use the prompt line from `references/review-diff-display.md`.
List the changed file paths, then briefly summarize what changed. Rely on the tool's built-in edit diff instead of replaying a diff in chat.

Which review response should I apply?

1. Accept as written
2. Request specific edits
3. Replace it with your wording

Formatting guidance:
- prefer 1 short paragraph or a short flat list instead of one long paragraph
- split acceptance criteria, metrics, demo steps, or sequenced behavior onto separate lines when possible
- keep critical questions short and separate from the main draft
- format critical questions with numbered answer choices
- apply the proposed change to the real target artifact before asking for approval
- list the changed file paths so the user can open them directly in the editor
- do not replay or restate diffs in chat; rely on the tool-provided edit diff
- follow `references/review-diff-display.md` for how to present the before/after block
- if a progress note was recorded, say that explicitly in the user-facing message after the story footer, for example: `📝 Progress note recorded in attachments/progress-notes.md`
- end the user-facing message with a visible indicator showing the active story key, a short story summary, and the HDD skill version from `imdone --version`. Example: `🧭 HDD v0.58.2 | SCRUM-260 — Share changelog section on prompt upgrade`

For Design, Plan, and major plan revisions, ask one short comprehension check before writing if the user has not already shown clear understanding.

If the user wants changes reverted or replaced, update the artifact and summarize the new revision. Do not paste a manual diff in chat.

## Continuation After Hypothesis

After `## Hypothesis` is accepted, written, and checked complete, ask once:

```text
Hypothesis is complete. Continue through the remaining HDD workflow without routine per-artifact interruption?
1. Yes, continue through all remaining phases unless a blocker, missing decision, external evidence gate, major pivot, push prompt, or user correction requires stopping
2. Continue through the evaluated Plan, then stop before product-code edits
3. Continue through the rest of Define the Outcome only
4. No, keep reviewing each artifact with me
```

If the user chooses option 1, 2, or 3:
- continue in checklist order and keep writing artifacts directly instead of asking the standard review prompt after every artifact
- still read the required focused references, inspect related work, run evaluators, and keep the issue and attachments current
- still stop for unclear product decisions, missing required context, hard blockers, external evidence gates, major plan or architecture pivots, failed evaluators, or newer user instructions
- for options 1 and 3, also stop for push prompts required by sync behavior; option 2 uses the narrower deferral rule below
- summarize the artifacts changed and verification performed at natural checkpoints instead of interrupting after each ordinary artifact
- for option 2, use a session-local continuation-through-Plan scope: continue through the remaining Define work, Design, and evaluated Plan; defer routine per-artifact review and defer routine phase and progress-note push prompts while that scope is active
- still stop option 2 for an explicit user-requested push, blocker, missing decision, external evidence gate, major pivot, user correction, required tool approval, or failed evaluator
- end option 2 at the evaluated Plan checkpoint before product-code edits; report current pending-change status there and offer the configured keep-local or push-now choice before the normal Plan approval checkpoint
- for option 3, resume normal review prompts after Define the Outcome is complete unless the user explicitly extends continuation

## Sync Behavior

- detect the provider from the story metadata comment before using provider-specific wording; use `jira:` or `github:` markers as the source of truth
- Use `imdone pull` when imdone is available and the local story needs the latest provider state before continuing.
- If imdone is unavailable, skip provider sync commands and record the needed provider refresh, publication, or review as an external evidence gate.
- If a sync conflict occurs during `imdone push`, resolve the file conflict, then run `imdone merge` before continuing.
- Follow `references/configuration.md` for push defaults and prompt behavior only in imdone projects.
- Before asking whether to run `imdone push`, check `imdone agent-config get-config` and only prompt when `push.imdoneStatus.hasPendingChanges` is true. If `imdone status` reports `Nothing to push`, skip the reminder. If imdone is unavailable, do not ask for `imdone push`.
- If push behavior is configured as `interval_prompt`, call `imdone agent-config get-config` before substantial work cycles and when deciding whether to prompt, and use `push.promptDue`, `push.elapsedMinutes`, and `push.nextPromptAt` instead of rough mental timing.
- In `interval_prompt` mode, call `imdone agent-config record-push-prompt` every time the workflow actually asks whether to run `imdone push`, including prompts triggered by elapsed time, major checkpoints, or explicit user requests.
- After `imdone push` succeeds, do not call an HDD-only sync timestamp setter. The `imdone push` command owns successful push sync timestamp recording; refresh state with `imdone agent-config get-config` when the workflow needs the updated timing.
- If `attachments/plan.md` is created from placeholder content into a real plan in an imdone project, treat that as a push-worthy checkpoint in `phase_prompt` mode.
- If a progress note is recorded in `attachments/progress-notes.md` in an imdone project, treat that as a push-worthy checkpoint in `phase_prompt` mode because resumability context changed materially.

After each phase in an imdone project:
- if `push.mode` is `phase_prompt`, ask:
  ```text
  Phase complete. Push changes now? (imdone push)
  1. Yes, run imdone push
  2. No, leave changes local
  ```
- after the first real plan is written and `push.mode` is `phase_prompt`, ask:
  ```text
  Plan updated. Push changes now? (imdone push)
  1. Yes, run imdone push
  2. No, leave changes local
  ```
- after a progress note is recorded and `push.mode` is `phase_prompt`, ask:
  ```text
  Progress note recorded. Push changes now? (imdone push)
  1. Yes, run imdone push
  2. No, leave changes local
  ```
- if `push.mode` is `interval_prompt` and `push.promptDue` is true, ask:
  ```text
  Phase complete and the push interval has elapsed. Push changes now? (imdone push)
  1. Yes, run imdone push
  2. No, leave changes local
  ```
- if `push.mode` is `interval_prompt` and `push.promptDue` is false, do not ask to push yet; if `imdone status` is clean, say nothing about pushing

If the user chooses yes, run `imdone push`, then call `imdone agent-config get-config` if the workflow needs refreshed timing. If no, leave the interval overdue state intact and remind the user to push before ending the session. If imdone is unavailable, skip this push prompt behavior entirely.
