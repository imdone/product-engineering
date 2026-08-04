# README Style Guide

Use this when an HDD plan includes README changes.

## Purpose

The README explains the project to its intended users and contributors. HDD agents should make README changes that fit the project they are working in, not a fixed imdone-cli house style.

Before drafting README content, inspect the target project's existing README and any nearby docs that clearly set the README voice, structure, and level of detail.

## Voice

- Match the existing README's audience, tone, and vocabulary.
- Keep the same level of detail as adjacent sections.
- Prefer the project's established way of explaining features, commands, APIs, screenshots, examples, or configuration.
- Use active, concrete language unless the existing README intentionally uses a different style.
- Avoid release-history phrasing such as "added", "fixed", or "changed" unless the README already uses upgrade-note language.

## Structure

- Place new content near the existing section that owns the workflow or command.
- Preserve the existing heading hierarchy, table style, list style, example style, and code-fence language choices.
- Do not create a new top-level section unless the feature introduces a major new workflow and the README's current organization supports it.
- Keep examples in the same format used by nearby sections.
- Update any table of contents, command index, generated docs section, or cross-links when headings change.

## Content Checks

- Name user-facing commands, APIs, settings, or file paths exactly.
- Include only stable behavior users can rely on after the story ships.
- If the change affects a command contract, include the smallest useful example.
- If the change is internal only and README does not need an update, say that explicitly in the plan.
- If the target project has no README, the plan should either create one using the project's apparent documentation conventions or record why README creation is out of scope.
