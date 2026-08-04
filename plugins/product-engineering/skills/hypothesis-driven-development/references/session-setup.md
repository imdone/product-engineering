# Session Setup

Use this before the first workflow artifact is drafted.

## Initial Read

Before choosing full or lightweight HDD, resolve the story using the repository's own conventions. Read the story, progress notes, and attachment links. Then defer every other artifact until the selected mode and current step require it.

If the repository has an `AGENTS.md`, contributor guide, issue template, or local workflow instructions, read the relevant instructions before editing.

## Full HDD Artifact Map

Use the story attachments as the source of truth when full HDD or the current step requires them:

- `attachments/success-metrics.md`
- `attachments/demo.md`
- `attachments/design.md`
- `attachments/plan.md`
- `attachments/progress-notes.md`; when missing, read legacy `Progress notes:` sections in `attachments/plan.md`
- `attachments/diagram.md` for purpose-fit Mermaid diagrams
- `attachments/dod.md`
- `attachments/hdd-skill-feedback.md` and `attachments/hdd-skill-feedback.json` when present

If an attachment is empty, placeholder-only, or stock-template content, use the repository's HDD template and referenced partials as fallback.

If an attachment is missing:

- create or draft only the artifact needed for the current workflow step
- do not pre-seed later-phase attachments
- keep placeholder-only future-phase files out of the way

For lightweight mode, load only the current story, progress notes, minimum outcome fields, compact planning context, current plan, and current-step artifact. Defer full-HDD-only artifacts until needed.

## Resolve The Story

Use an issue key, issue number, filename, or story path supplied by the user. Otherwise:

- prefer the story already active in the conversation
- inspect repository-native issue/work directories for the most recently active story
- confirm the candidate with the user before editing when more than one candidate is plausible

After resolving the story:

1. Read the story, progress notes, and attachment links.
2. Detect the backing provider only from explicit metadata or repository context.
3. Stay provider-neutral when no provider marker exists.
4. Keep session state in the story and its linked artifacts.

## Choose Full Or Lightweight HDD

Ask the engineer as soon as the initial read is complete, before applying or repairing templates:

```text
HDD mode for <issueKey>?
1. Full HDD for high-risk, ambiguous, cross-team, provider-sync-sensitive, or implementation-heavy work
2. Lightweight HDD for low-risk work; still capture problem framing, minimum success measure, observable outcome, feedback path, evidence/data-capture mechanism, plan, progress notes, deploy evidence, and retrospective learning
3. Something else: <details>
```

Lightweight mode still requires an observable outcome, feedback path, evidence/data-capture mechanism, compact planning context, and the evaluated-plan checkpoint.

## Template Handling

After the mode is selected:

- Full HDD: apply or repair the repository's full HDD template when one exists; otherwise create the expected headings and current-step attachments directly.
- Lightweight HDD: use a lightweight template only when the engineer asks or the story already uses one; otherwise keep the story sparse around Problem, Current Plan, Progress notes, and Closeout.
- Preserve accepted content when repairing an outdated template.
- Continue from the next honest unchecked item instead of restarting the workflow.

For full HDD, keep these sections above `## Define the Outcome`:

- `## Problem Framing`
- `## Hypothesis`
- `## Related Work`
- `## Vertical Slice`
- `## Acceptance Criteria`
- `## Validate Assumptions`

Back `Measure Results` and `Retrospect` with `## Results` and `## Retrospect` in `attachments/success-metrics.md`.

## Attachment Index

Use the issue/story file as the attachment index:

- link every existing issue attachment
- add a link in the same pass when creating a new attachment
- preserve existing template links
- keep links current when attachment names change

## Extract Current Context

Capture:

- user-visible behavior that must change
- user-provided or user-confirmed problem framing
- customer or team outcome that should improve
- constraints that must not change
- likely files or subsystems involved
- completion evidence
- provider only when explicitly detectable
- completed versus pending checklist items
- blocker reason and whether another person can act on it
