# HDD Skill Configuration

Use project-local configuration when the HDD workflow should reuse the same behavior across sessions.

Preferred command boundary: `imdone agent-config`

Canonical storage path: `backlog/.imdone/agent-config.yml`

Do not read or update agent configuration by parsing YAML directly. Do not call local skill helper scripts for configuration state. The CLI resolves the correct backlog-scoped config path from any project subdirectory and may read legacy `.imdone/hdd-skill.yml` as a migration fallback internally.

Current supported shape:

```yaml
push:
  mode: phase_prompt
  interval_minutes: 10
active_story:
  key: SCRUM-267
```

Supported keys:

- `push.mode`
  - `phase_prompt`
  - `interval_prompt`
- `push.interval_minutes`
  - positive integer minutes
  - only used when `push.mode` is `interval_prompt`
- `push.session_started_at`
  - ISO timestamp for the current HDD session baseline
  - written by `imdone agent-config begin-session`
- `push.last_prompt_at`
  - ISO timestamp for the most recent push prompt shown to the user
  - written by `imdone agent-config record-push-prompt`
- `push.last_push_at`
  - ISO timestamp for the most recent successful `imdone push`
  - command-owned sync timing; HDD reads it through `imdone agent-config get-config` and does not set it directly
- `push.imdoneStatus`
  - current `imdone status` result collected by `imdone agent-config get-config`
  - includes `hasPendingChanges`, which must be true before the workflow asks whether to run `imdone push`
- `active_story.key`
  - optional saved HDD story key
  - local-only resume pointer
  - should be managed through `imdone agent-config` rather than edited inline during the HDD workflow

Smart defaults:

- `push.mode: phase_prompt`
- `push.interval_minutes: 10`

Resolution order:

1. Explicit user instruction in the current conversation
2. Stored push config in `backlog/.imdone/agent-config.yml`
3. Interactive setup answers when push config is missing
4. Smart defaults offered during that interactive setup

Interactive setup behavior when push config is missing:

- Treat both of these as "missing" and prompt the user:
  - `imdone agent-config get-config` returns `push.status: "missing"`
  - the config exists but has no stored `push` block yet
- `get-config` returns `push.status: "missing"` in that case and still includes the smart default values as suggested answers, not as silently accepted choices.

1. Ask whether the user wants, using numbered choices:
   1. `Prompt after each phase (Default)`
   2. `Prompt on a timed interval`
2. If they choose the timed interval option, ask for the interval in minutes using numbered choices:
   1. `Use 10 minutes (Default)`
   2. `Use a different interval: <minutes>`
3. Make it clear the user can choose the default option instead of customizing values.
4. Write the resolved values through `imdone agent-config set-push-config` so later HDD sessions reuse the same defaults.
5. After config is stored, call `imdone agent-config begin-session` so interval timing starts for the current HDD session.
6. Use the written config values for the current session.

Push prompt behavior:

- Before any push reminder, use `imdone agent-config get-config` and check `push.imdoneStatus.hasPendingChanges`.
- Only ask whether to run `imdone push` when `imdone status` reports pending changes. If `imdone status` reports `Nothing to push`, do not remind the user even when the phase or interval condition is due.
- `push.promptDue` is already gated by both elapsed interval and pending `imdone status` changes.

- `phase_prompt`: ask whether to push after each completed phase, after `attachments/plan.md` is first written with a real plan, and after a progress note is recorded in `attachments/progress-notes.md`, but only when `imdone status` reports pending changes.
- `interval_prompt`: call `imdone agent-config get-config` when deciding whether the interval has elapsed and use `push.promptDue`, `push.elapsedMinutes`, and `push.nextPromptAt` instead of rough mental timing. Check this before substantive work cycles, when a major checkpoint or risk boundary is reached, and when the user explicitly asks to sync earlier. After any push reminder is shown, call `imdone agent-config record-push-prompt` for visibility. After a successful `imdone push`, rely on the command-owned sync timestamp and refresh state with `imdone agent-config get-config` when timing is needed.

When push config is missing, writing `backlog/.imdone/agent-config.yml` or adding the missing `push` block from the prompted setup through `imdone agent-config` is the expected behavior.
After push config exists, do not edit it unless the user explicitly asks for that.

Agent config command:

```text
imdone agent-config get-config
imdone agent-config begin-session
imdone agent-config get-active-story
imdone agent-config record-push-prompt
imdone agent-config set-push-config --mode phase_prompt --interval-minutes 10
imdone agent-config set-active-story --key SCRUM-267
```

Use `imdone agent-config get-config` when the workflow needs push reminder settings such as `phase_prompt` versus `interval_prompt`.
If `imdone agent-config get-config` returns `push.status: "missing"`, ask the user to choose their reminder behavior before proceeding with workflow work.
Use `imdone agent-config begin-session` after push config is available so interval timing starts from the current HDD session instead of an older run.
Use `imdone agent-config record-push-prompt` every time the workflow actually asks whether to run `imdone push`, including early prompts caused by major checkpoints or explicit user requests. Do not call it when `imdone status` is clean and no prompt is shown.
Do not call an HDD-only command to set sync timestamps after `imdone push`; successful sync commands own their own sync timing, and HDD should read the resulting state through `imdone agent-config get-config`.
Use `imdone agent-config set-push-config` when interactive setup or an explicit user instruction changes push reminder behavior.
Use `imdone agent-config get-active-story` when the workflow needs either a valid saved story with a resolved local issue path or a no-valid-story result.
