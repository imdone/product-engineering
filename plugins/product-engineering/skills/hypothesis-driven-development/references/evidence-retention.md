# Verification evidence and temporary output

Read this before running verification, writing its evidence, cleaning up, or resuming interrupted checks. Durable evidence should let someone assess the result and repeat the check without storing its entire output.

## Temporary raw output

Use a session-owned directory in the operating system's temporary storage, outside the repository and backlog. Capture stdout/stderr, full test-runner JSON/XML/TAP reports, coverage maps, profiler output, and diagnostic traces there when needed for investigation. The rule applies regardless of extension: renaming output to Markdown, compressing it, or putting it in another attachment subdirectory does not make it a summary.

Do not copy, attach, stage, commit, upload, or bundle these raw outputs as story evidence. An explicitly requested raw deliverable can be retained at the destination the user specifies; otherwise temporary output is disposable.

## Durable result

Update the story's existing verification summary or progress notes; create a small results ledger only when needed. Record the useful facts:

- command and relevant flags, scope, date, and tested version/commit or environment;
- exit status and pass/fail/skip counts, including honest distinctions between focused, full-suite, retry, simulated, and live proof;
- coverage aggregates or measured outcomes relevant to the change, with gaps and limitations;
- for failures, the failing behavior, a short redacted error excerpt when needed, the diagnosis or unresolved blocker, and the next action;
- the conclusion, reproduction instructions, and links to durable inputs or deliverables needed to evaluate it.

Keep the summary proportional to the decision. Do not embed full test-case arrays, stack traces, coverage maps, or copies of the transcript in Markdown or JSON. A command's generated JSON is raw output unless it has been reduced to the relevant result fields. Do not claim success or invent missing counts when output is incomplete.

## Cleanup

After extracting and checking the summary, delete the raw output and the temporary directory owned by this verification. Do this for red, green, failed, cancelled, and superseded runs; a failure is captured by its concise diagnostic and reproducible command. While actively diagnosing, retain only the temporary output still needed, then delete it before handoff. On resumption, finish summarizing any recoverable interrupted output and clean up that session's temporary files. If interrupted output is unavailable, record the gap and rerun when necessary.

Do not leave durable links to temporary or deleted files. Verification summaries, regression tests, reproduction inputs, source fixtures, accepted designs, screenshots, deliverables, and compact audit/measurement records remain durable; this cleanup is not permission to remove them or alter provider/recovery state. Existing raw attachments should be summarized and removed when the user requests cleanup; repair their links together without modifying unrelated story evidence. Do not perform provider sync as part of local cleanup.
