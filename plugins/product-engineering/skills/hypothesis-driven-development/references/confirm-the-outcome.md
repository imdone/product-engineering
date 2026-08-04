# Confirm The Outcome

Use this reference during Phase 3.

Deploy proves the slice is live. Confirm proves the outcome happened.

## Order

1. Definition of Done
2. Measure Results
3. Retrospect

## Definition Of Done

- Use `attachments/dod.md` as the checklist.
- Treat this as a DoD review, not a shipping review. Confirm the delivered behavior, the measured result, and the close / iterate / pivot / stop decision.
- Every confirmation or evidence question must include numbered answer choices, including a numbered free-form option when custom evidence may be needed.
- Confirm unchecked items one by one instead of accepting a vague blanket yes.
- If a DoD item is confirmed not applicable, strike through the checklist text instead of leaving it as a normal unchecked item.
- Prefer this shape for not-applicable items: `- [ ] ~~Feature flags cleaned up (if applicable)~~`
- Add a short note only when the reason would not be obvious from the item text itself.
- Use alignment questions if "done" sounds implied rather than explicit.
- If the user says "done" quickly, ask a concrete evidence question so both sides know what was actually verified.

## Measure Results

- Write results in the dedicated `## Results` section of `attachments/success-metrics.md`, not inside the checklist item.
- Surface the exact metrics from `attachments/success-metrics.md`.
- Ask whether each metric moved and whether a real user ran it.
- Confirm that the planned feedback and instrumentation/data-capture mechanisms were actually implemented or reused, not merely described.
- Confirm that the planned instrumentation/data capture exists and produced observable data for the measurement window.
- Do not accept Deploy evidence alone here; outcome confirmation requires measured evidence that the intended result happened.
- For app-facing slices, confirm that the in-app feedback path exists, is discoverable, and captured at least one real or test feedback submission before treating feedback collection as ready.
- For CLI, API, automation, or infrastructure slices, confirm that the equivalent feedback or measurement mechanism exists and produced observable evidence, such as command output, logs, persisted artifacts, audit records, metrics, or provider-visible state.
- Ask what direct user feedback was gathered and whether it supports or contradicts the product data.
- If product data exists without user feedback, mark the outcome as only partially confirmed.
- If user feedback exists without product data from instrumentation, mark the outcome as only partially confirmed.
- If the story only says "no telemetry", relies on manual observation without a concrete evidence source, or defers feedback/measurement to a later story, do not check Measure Results. The current slice is not complete until the evidence loop is implemented or the slice is narrowed to include one.
- If answers are vague, use a product or shared-context alignment question to force specificity.

## Retrospect

- Write the retrospective in the dedicated `## Retrospect` section of `attachments/success-metrics.md`, not inside the checklist item.
- Draft what worked, what did not, and the next step.
- Make the decision explicit: iterate, pivot, or close.
