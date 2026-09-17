# Changelog

## 0.2.5 - 2026-09-17

### Changed

- Replace reply-required push questions with non-blocking, story-scoped reminders shown only when HDD is already yielding at a natural stopping point; the developer remains responsible for running `imdone push <sessionStoryKey>`.
- Align the public skill with prompt-free event-triggered progress-note activation for explicit HDD and `imdone-ai` sessions while preserving opt-out and quiet ordinary sessions.

## 0.2.4 - 2026-09-08

### Changed

- Enable event-triggered progress-note capture without a separate consent prompt when users explicitly request Full or Lightweight HDD or `imdone-ai`, or launch through `imdone hdd` or `imdone ai`; explicit opt-out wins and all other sessions stay capture-off.
- Infer saved Full or Lightweight HDD mode from closing story metadata and automatically confirm the retained session story for ordinary progress notes while preserving explicit note-only redirects and fail-closed recovery.

## 0.2.3 - 2026-09-05

### Changed

- Require an explicitly marked HDD session for event-triggered progress-note activation, keep ordinary direct-agent and `imdone ai` sessions quiet even for tagged or previously enabled stories, persist accepted activation as `hddProgressNotes:enabled`, and recommend the current story first plus at most one HDD-eligible alternative.
- Scope push reminders to the selected session story so unrelated dirty stories never trigger a prompt and only the targeted `imdone push <sessionStoryKey>` command is offered.

## 0.2.2 - 2026-08-15

### Changed

- Require progress-note target confirmations and alternatives to show both the issue key and a human-readable title or concise description instead of a bare key.
- Linked the optional imdone operational layer to imdone.io and the imdone-cli npm package from the public README.

## 0.2.1 - 2026-08-04

### Fixed

- Restored deterministic optional-imdone behavior: use supported imdone session, template, and user-approved sync workflows when available, try `imdone note` before direct Markdown progress-note writes, and continue without imdone when checks or commands fail.

### Added

- Added skills.sh installation and discovery guidance for the public `hypothesis-driven-development` skill.

## 0.2.0 - 2026-08-04

### Added

- Published one shared Hypothesis Driven Development skill through repository marketplaces for Codex and Claude Code.
- Added public templates, examples, contribution guidance, package validation, and marketplace installation checks.
