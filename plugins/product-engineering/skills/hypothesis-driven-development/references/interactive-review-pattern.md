# Interactive Review Pattern

Use this reference when you need the exact review and prompt behavior.

## Prompt Shape

Present drafts in this shape:

*[short expert quote or framing line]*

Use the prompt line from `references/review-diff-display.md`.
List the changed file paths, then briefly summarize what changed. Rely on the tool's built-in edit diff instead of replaying a diff in chat.

Which review response should I apply?

1. Accept as written
2. Request specific edits
3. Replace it with your wording

## Draft Style

- Prefer 1 short paragraph or a short flat list instead of one long paragraph.
- Split acceptance criteria, metrics, demo steps, or sequenced behavior onto separate lines when possible.
- Keep critical questions short and separate from the main draft.
- Use at most one short quote or framing line before a draft.
- Apply the proposed change to the real target artifact before asking for approval.
- List the changed file paths so the user can open them directly in the editor.
- Do not replay or restate diffs in chat.
- Follow `references/review-diff-display.md` for how to present the before/after block.

## Review Checks

- For important artifacts, ask 1-2 alignment, comprehension, or critical questions before writing if understanding is unclear.
- For Design, Plan, and major plan revisions, ask one short comprehension check before writing if the user has not already shown clear understanding.
- Every user-facing question must include numbered answer choices using `1.`, `2.`, `3.` so the user can reply with the number alone.
- When a free-form answer may be needed, make it a numbered option, for example `3. Something else: <details>`.

## Product Owner Flow

For Define the Outcome artifacts under human review:
- ask first and separately:
  ```text
  Is a product owner in the room for this review?
  1. Yes
  2. No
  ```
- after the product-owner presence answer is known, ask for artifact approval in a separate prompt
- if yes, ask:
  ```text
  Does the product owner agree with this [artifact]?
  1. Yes, they agree
  2. No, revise before writing
  3. Not sure / needs async review
  ```
- if no, note that product-owner review is missing and call out the resulting risk
- do not ask whether a product owner is in the room again once the user has already answered for the current review flow, unless the context clearly changes or a new Define the Outcome review starts later
