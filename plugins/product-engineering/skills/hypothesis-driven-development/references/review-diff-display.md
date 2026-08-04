# Review Diff Display

Use this reference for how HDD review messages should present proposed changes after the real artifact has been updated.

## Prompt Line

Use this line in the review prompt:

Based on your story, I've applied the proposed change.

## Display Rules

- List the changed file paths in chat so the user can open them directly in the editor.
- Briefly summarize what changed.
- Rely on the tool's built-in edit diff instead of pasting a manual diff in chat.
- If multiple files changed, identify the primary reviewed artifact and list the other changed file paths briefly in chat.
