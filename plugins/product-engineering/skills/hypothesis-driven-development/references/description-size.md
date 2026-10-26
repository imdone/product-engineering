# Description size and evidence navigation

Read this after material story-description or evidence-index growth and before handing off an evaluated Plan. A provider description has a different budget from the story's attachment files. Preserve evidence rather than silently truncating it to fit.

## Root files and directory READMEs

The issue file lists only the files directly inside `attachments/`. Do not list files from attachment subdirectories in the issue, including nested Design, Plan, progress-note, and mockup files.

Create `attachments/README.md` as the root navigation file. Every subdirectory under `attachments/` has a `README.md`, including intermediate directories that contain only child directories. Each README contains links and descriptions of its immediate files and child directories; child-directory links target that child's `README.md`. Omit a self-link to README.md. Use relative links from the README's actual location. Descriptions explain the purpose or evidence in each entry; filenames alone are insufficient.

The issue links directly to root-level attachment files, including `attachments/README.md`. That root README links to child READMEs; readers follow them recursively to all nested evidence. Keep the root README's navigation current as files or directories are added or renamed. Preserve duplicate basenames in different directories and accepted artifact identities.

For example, the issue links to `./attachments/README.md` and `./attachments/demo.md`. The root README links to `design/README.md` with a short description. That directory README links to `diagram.md` and `mockups/README.md`, each with a description. The mockups README links to the intended revisioned HTML and supporting files. Direct HTML links remain in Design, Plan, and the user-facing agent review; the issue reaches them through the README hierarchy.

Apply this approved convention without moving or deleting evidence: remove deep attachment entries from the issue index and replace their navigation with described README links. Preserve artifact paths and contents, other story context, and explicit accepted-revision labels. Update existing READMEs in place without discarding explanatory prose. Exclude internal provider metadata such as `.metadata.yml`, temporary files, and symlinks. This does not authorize provider sync or migration of unrelated stories. Check both local navigation and provider link conversion/round trips before claiming remote evidence access works; record any unresolved limitation.

## Prefer an available read-only provider check

In an imdone project, check whether `imdone validate-description --help` is available. If so, run `imdone validate-description <sessionStoryKey> -f json`. The command reads only local context, never authenticates or publishes. It returns 0 valid, 1 invalid, 2 unverified, or 3 command/input failure. Do not mistake every nonzero exit for invalidity; inspect the bounded status and reason.

- Valid describes the converted representation for one local snapshot, including generated metadata and resolved attachment identities. It is not a guarantee for a later push; push checks the actual outgoing field again.
- Invalid identifies the issue/field, count units, measured size and limit, and correction path. Propose moving supporting detail into a documented attachment subdirectory and removing redundant description links without losing evidence. Recheck after changes.
- Unverified means that provider policy, pending/missing attachment identity, changed files, or other conversion context prevents a definitive claim. State that uncertainty and record the next validation step. Do not use fallback local attachment URLs to certify a later upload-resolved description.
- Command/input failure requires diagnosing the local input or using the portable fallback; never run push, template, lint-with-writes, or authenticated provider setup merely to obtain a size check.

Report only safe size/status fields; do not paste descriptions, attachment URLs, auth headers, or credentials into notes. Users may save JSON output as an evidence attachment. The CLI provides an issue-report link; sending feedback is the user's choice.

## Portable fallback without imdone

Run `node <skill-root>/scripts/validate_story_description.mjs <issue-file>` and, only when a local budget is known, add `--limit <positive-integer>`. This helper uses Node's standard library and never requires imdone, a network connection, a provider account, or configuration changes. It excludes the title and HTML comments, reports local Markdown size in UTF-16 code units, and writes only JSON to stdout.

Its provider status is always unverified (exit 2), even below a local budget. An over-local-budget result is a local authoring signal, not proof that provider conversion is over its limit: conversion may expand or shrink text. Generated metadata, provider markup, repo-link rewriting, and attachment URLs are not included. Bad input returns exit 3. Record the remaining provider-validation evidence gate and continue local HDD work when possible.

Do not invent a universal provider limit or claim that UTF-16 units match every provider's counting semantics. Use a known policy or observed provider response, name the units, and keep unresolved live-provider behavior provisional. At the Plan checkpoint, report the strongest available result and its scope; a fallback unverified result alone does not require a new permission prompt or authorize publishing.
