# Changelog

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
