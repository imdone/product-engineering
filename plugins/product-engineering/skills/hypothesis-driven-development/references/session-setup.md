# Session Setup

Use this before the first workflow artifact is drafted.

## Initial Read

Before resolving full or lightweight HDD, read the story, progress notes, and attachment links. Then defer every other artifact until the resolved mode and current step require it. Do not bulk-load full-HDD-only context during initial setup.

## Full HDD Artifact Map

Use the story attachments as the source of truth when full HDD or the current step requires them:
- `attachments/success-metrics.md`
- `attachments/demo.md`
- `attachments/design.md`
- `attachments/plan.md`
- `attachments/progress-notes.md`; when this file is missing, read legacy `Progress notes:` sections in `attachments/plan.md` as backward-compatible implementation progress context
- `attachments/diagram.md` for purpose-fit Mermaid diagrams when diagrams will reduce ambiguity; keep them in one Markdown file with clear headings
- `attachments/dod.md`
- `attachments/hdd-skill-feedback.md` if present
- `attachments/hdd-skill-feedback.json` if present
- `backlog/.imdone/agent-config.yml` if imdone is available, read through `imdone agent-config`; do not read or edit it directly

If an attachment is empty, placeholder-only, or still stock-template content, use `.imdone/templates/stock/hypothesis-driven-development.md` and the referenced partial in `.imdone/templates/stock/partials/` as fallback.

If an attachment file is missing:
- create or draft only the artifact needed for the current workflow step
- do not pre-seed later-phase attachments unless the workflow has actually reached that phase
- keep placeholder-only future-phase files out of the way unless the story already links to them and the user wants them created now

For lightweight mode, keep setup context efficient: load only the current story, progress notes, minimum outcome fields, compact planning context, current plan, and the current-step artifact. Treat full-HDD-only artifacts such as full design/demo/success-metrics/dod as deferred context; read or create them only when the selected lightweight step requires them.

## Deterministic Tool Availability And Push Reminder Setup

Before resolving the story, determine imdone availability with these deterministic checks:

1. Run `imdone --version`.
   - Exit 0 means the `imdone` command is installed.
   - Non-zero exit or command-not-found means imdone command features are unavailable.
2. If `imdone --version` succeeds, run `imdone agent-config get-config`.
   - Exit 0 with JSON `status: "ok"` means the current workspace is initialized enough for HDD session state and push reminder behavior.
   - Non-zero exit or a non-ok status means do not use `imdone agent-config`, push reminders, active-story persistence, or provider sync prompts for this session.
3. For progress notes, use a separate command-specific check: try `imdone note <issueKey> "<note>"` when a note must be recorded. Append directly to `attachments/progress-notes.md` only if `imdone note` is unavailable or exits non-zero for the current workspace.

- if imdone is available and `push.status` is `configured`, use the stored reminder settings for this session
- if imdone is available and `push.status` is `missing`, ask the user to choose their push reminder behavior using `references/configuration.md`, then persist it with `imdone agent-config set-push-config` before continuing
- when checking whether to remind about pushing in an imdone project, use the `imdone status` result returned by `get-config`; only prompt when pending changes exist
- do not silently accept smart defaults when push config is missing in an imdone project; present them as the default option the user can choose
- after push config exists, call `imdone agent-config begin-session` so interval timing starts from this HDD session instead of stale wall-clock time from an older run
- if the deterministic checks fail, skip push reminder setup and use plain Markdown artifacts as the session state; record provider sync or publishing as an external evidence gate when needed

## Resolve The Story

If an issue key is provided, open:
`backlog/current-sprint/{issueKey}-*/issue-{issueKey}.md`

If no issue key is provided:
- prefer the story already active in this conversation
- otherwise, when imdone is available, call `imdone agent-config get-active-story` to check for one saved local HDD story
- if the helper returns a valid story path, use that story
- otherwise use the most recently modified `backlog/current-sprint/*/issue-*.md`
- confirm the candidate with the user before editing

After the story is confirmed, read the story, progress notes, and attachment links before asking anything. Then load only the artifacts needed for the selected mode and current step.
After the story is confirmed in an imdone project, call `imdone agent-config set-active-story --key <issueKey>` so the next no-key HDD session can resume that story. If imdone is unavailable, rely on the conversation and local Markdown paths for resumption.

## Resolve Full Or Lightweight HDD

Resolve mode during story triage/Define, as soon as the story, progress notes, and attachment links are read. This happens before applying or repairing any HDD template, before template repair, and before doing workflow artifact or phase work.

Use an explicit Full or Lightweight HDD choice from the current conversation when one exists. Otherwise run `node <skill-root>/scripts/detect_hdd_mode.mjs <issue-file>` when the script is available, or apply the same closing-metadata rules directly:

- `imdoneTemplate` values containing `lightweight_hypothesis_driven_development`, or `#HDD-light-template`, select Lightweight HDD.
- `imdoneTemplate` values containing `hypothesis_driven_development` without `lightweight`, or a standalone `#HDD-template`, select Full HDD.
- A lightweight marker wins over its legacy companion full tag when both `#HDD-light-template` and `#HDD-template` are present.
- Body mentions do not select a mode; inspect only the closing HTML metadata comment.
- Conflicting explicit `imdoneTemplate` identities return `ask` instead of guessing.

Continue with the inferred mode without asking the engineer to repeat the saved story decision. Ask the numbered choice below only when metadata is missing, conflicting, or cannot be inferred safely and the engineer has not already chosen a mode in the current conversation.

Use this numbered prompt:

```text
HDD mode for <issueKey>?
1. Full HDD for high-risk, ambiguous, cross-team, provider-sync-sensitive, or implementation-heavy work
2. Lightweight HDD for low-risk work; still capture problem framing, minimum success measure, observable outcome, feedback path, evidence/data-capture mechanism, plan, progress notes, deploy evidence, and retrospective learning
3. Something else: <details>
```

Lightweight mode still requires a minimum success measure before planning: observable outcome, feedback path, and evidence/data-capture mechanism. It also requires compact lightweight planning context before plan approval: first boundary/module to touch, independent phases or coupled sources, main failure mode, constraints / what must not change, and evidence/output expectations, without forcing a full design document. The plan approval checkpoint still applies to both full and lightweight HDD paths: after the evaluated plan exists, do not edit product code until the engineer can confirm the evaluated plan or request plan changes.

Detect the issue provider from the issue file metadata comment before using provider-specific language or assumptions:
- read the closing HTML comment in the issue markdown
- if it contains `jira:`, treat the story as Jira-backed
- if it contains `github:`, treat the story as GitHub-backed
- if neither marker is present, stay provider-neutral and do not invent provider-specific sync or field behavior
- use this detected provider when talking about sync, blockers, rollout notes, or evidence capture

Use the issue file as the attachment index for issue attachments:
- make sure every existing issue attachment is linked from the issue file so artifacts are easy to find
- when you create a new issue attachment, add or update an issue-file link in the same pass
- if the template already includes a link, leave it where it is
- duplicate links are acceptable when adding a missing link is simpler than normalizing existing ones
- keep links current when attachment names change or when new focused attachments are added for clarity

After full or lightweight HDD is resolved, handle templates by mode:
- for full HDD, detect this by the absence of `#HDD-template` in the issue content or by obviously missing full HDD template structure
- if full HDD was selected, apply template `hypothesis_driven_development` when it exists locally; otherwise apply `stock_hypothesis_driven_development`
- lightweight HDD does not require applying a template. If the story already has `#HDD-light-template`, work with it. If the engineer asks for a lightweight template, apply `lightweight_hypothesis_driven_development` when it exists locally; otherwise apply `stock_lightweight_hypothesis_driven_development`. Otherwise continue lightweight HDD without requiring a template by maintaining the core problem/current-plan/progress-notes contract in the issue and attachments.
- explain briefly when you are switching the story onto a full HDD template, or when the engineer explicitly asked for the optional lightweight template
- if a template was applied, re-read the story and attachments, then continue the HDD workflow
- For full HDD, make sure `## Problem Framing`, `## Acceptance Criteria`, `## Vertical Slice`, `## Related Work`, `## Hypothesis`, and `## Validate Assumptions` live above `## Define the Outcome`; the checklist should only track whether those sections and attachment artifacts are complete
- For full HDD, make sure `Measure Results` and `Retrospect` are backed by `## Results` and `## Retrospect` sections in `attachments/success-metrics.md`; the checklist should only track completion
- For lightweight HDD, keep `## Problem` and `## Current Plan` in the issue when a sparse template is used, keep progress notes in `attachments/progress-notes.md`, and add other sections or attachments only when the selected lightweight step requires them.

If imdone is unavailable, repair Markdown by selected mode instead of blocking on template tooling. For full HDD, use the full HDD expected headings and attachment filenames. For lightweight HDD, do not recreate the full HDD structure; keep the story sparse with `## Problem`, `## Current Plan`, a Progress notes link or attachment, `## Closeout`, and only the extra artifacts the current risk justifies.

If the story already has `#HDD-template` but its sections, headings, or checklist order no longer match the current bundled HDD format:
- treat it as an outdated HDD story that should be repaired with the user, not ignored
- explain what is out of alignment before editing, for example missing checklist items, old heading names, or section order drift
- repair the structure first so the current skill and current story agree on what is complete vs pending
- preserve accepted content when repairing; rewrite structure and checklist state without discarding validated decisions
- after repair, continue from the next honest unchecked item instead of restarting the workflow

Extract:
- user-visible behavior that must change
- user-provided or user-confirmed problem framing
- user or customer outcome that should improve
- constraints that must not change
- likely files or subsystems involved
- how completion will be verified
- which provider backs the story based on `jira:` or `github:` metadata in the HTML comment
- which checkboxes are done vs pending
- whether the story is blocked and whether the blocker reason is specific enough for another person to act on
