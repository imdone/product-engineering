# Acceptance Criteria

Use this file when the story is missing an `## Acceptance Criteria` section, when criteria are vague, or when they are not binary.

Core rules:
- Every story should have an `## Acceptance Criteria` section.
- Each criterion should be binary and testable.
- If a criterion is ambiguous, look for the missing precondition before widening the behavior statement.
- Prefer: given `[precondition]`, when `[action]`, then `[observable result]`.

## Quick Checks

- Can a reviewer answer yes or no without interpretation?
- Does the criterion name the setup or precondition clearly?
- Does it describe a visible action?
- Does it end with an observable result rather than an intention?

## Rewrite Pattern

Turn this:
- "The attachment flow should work correctly."

Into this:
- "Given a provider-backed issue with one new local attachment, when the user runs the repository's approved sync command, then the attachment is uploaded and the issue body link points to the uploaded file."

## Alignment Questions

Convert the chosen stem into a numbered-choice prompt before asking it.

- "What has to already be true before this criterion is tested?"
- "What exact user action triggers this behavior?"
- "What visible result would prove success?"
- "Could two reviewers disagree about whether this passed?"

If yes, the criterion is not binary yet.
