# Changelog Style Guide

Use this when an HDD plan includes changelog changes.

## Purpose

The changelog records changes in the format used by the target project. HDD agents should make changelog entries that fit the project they are working in, not a fixed imdone-cli release-note style.

Before drafting changelog content, inspect the target project's existing changelog, release notes, changesets, or equivalent release artifact and follow its structure.

## Voice

- Match the existing changelog's audience, tense, voice, and amount of detail.
- Preserve the project's current convention for labels such as Added, Changed, Fixed, Security, Breaking, or version headings.
- Include user-visible behavior, compatibility impact, migration notes, or support-relevant detail at the same level the project already uses.
- Avoid implementation-only detail unless the existing changelog uses it or it explains a visible behavior, diagnosis path, or compatibility boundary.

## Structure

- Add entries under the current unreleased, next version, changeset, or release-note location used by the project.
- Preserve the existing bullet style, heading style, date/version format, grouping, and ordering.
- Keep entries flat unless the existing changelog already uses nested details.
- Group related entries near each other when the project already groups by feature area or change type.

## Content Checks

- Mention user-visible behavior for product, CLI, API, UI, or workflow changes.
- Mention compatibility or migration impact when users might need to act.
- Do not duplicate README instructions; summarize the shipped change in the project's changelog style.
- If the change is internal only and changelog does not need an update, say that explicitly in the plan.
- If the target project has no changelog or release-note artifact, the plan should record the explicit no-change decision or identify the project's equivalent release-note location.
