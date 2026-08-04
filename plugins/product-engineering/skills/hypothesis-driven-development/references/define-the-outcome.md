# Define The Outcome

Use this reference during Phase 1.

## Order

1. Problem Framing
2. Hypothesis
3. Vertical Slice
4. Acceptance Criteria
5. Validate Assumptions
6. Demo Plan

## Problem Framing

- Require a user-provided or user-confirmed problem framing before drafting or approving Hypothesis.
- Write the framing in a dedicated `## Problem Framing` section above `## Hypothesis`, not inside the checklist item.
- If the issue already contains enough context, draft the framing from the story and ask the user to confirm it with numbered choices before writing or checking the item.
- If the issue does not contain enough context, ask the user for the framing before writing other Define the Outcome artifacts.
- The framing must name:
  - the user, customer, or operational role affected
  - the problem, pain, or workflow breakdown
  - why it matters now, including impact or evidence
  - the current workaround or failure mode when known
  - what would be observably better if the problem were solved
- For enabling, CLI, infrastructure, or internal workflow stories, use the affected internal user or automation workflow instead of forcing an external-customer frame.
- Do not mark Hypothesis complete until Problem Framing exists and was provided or confirmed by the user in the current HDD session.

## Product Owner Review

Before reviewing any Define the Outcome artifact with a human:
- ask:
  ```text
  Is a product owner in the room for this review?
  1. Yes
  2. No
  ```
- ask that question separately from artifact approval
- once the answer is known for the current review flow, do not ask it again unless the context clearly changes

If a product owner is present:
- ask whether they agree with each artifact before writing it, using numbered choices:
  ```text
  Does the product owner agree with this [artifact]?
  1. Yes, they agree
  2. No, revise before writing
  3. Not sure / needs async review
  ```

If a product owner is not present:
- explicitly record that absence as added product/alignment risk
- make assumptions more conservative
- in solo or async refinement, ask once, record the answer or absence, then proceed without repeating the question on every artifact

## Hypothesis

- Write the hypothesis in a dedicated `## Hypothesis` section above `## Define the Outcome`, not inside the checklist item.
- Identify which of Cagan's four risks the hypothesis primarily addresses.
- Keep the hypothesis outcome-focused rather than implementation-focused.
- After the user or product owner accepts the hypothesis and the checklist item is marked complete, offer the continuation choice from `references/interaction-contract.md` so the user can decide whether HDD should continue through the rest of the workflow without routine per-artifact interruption.

## Vertical Slice

- Before drafting the slice, search the current backlog and the configured archive for related stories, experiments, hypotheses, acceptance criteria, or outcomes that could sharpen the slice.
- Read `.imdone/config.yml` to find `settings.cards.archiveFolder`; inspect that configured archive path when it exists, and use `.imdone/archive` as the fallback archive location when needed.
- Record the useful prior stories under a dedicated `## Related Work` section above `## Define the Outcome`.
- Link the story files directly in `## Related Work` and add one short note per link explaining why it matters to the slice.
- If no relevant prior work exists, say that explicitly in `## Related Work` instead of leaving the section implied.
- Write the slice in a dedicated `## Vertical Slice` section above `## Define the Outcome`, not inside the checklist item.
- Make sure the story has a clear user- or customer-facing outcome.
- Include appetite with the slice.
- Frame the slice as an experiment:
  - who the user is
  - what behavior changes
  - what the team expects to learn
- Include the evidence loop in the slice. A complete slice must name:
  - the user-visible behavior being delivered
  - the feedback path available from the delivered surface
  - the measurement/data-capture mechanism that will show whether the outcome happened
- If any part of that evidence loop is missing, narrow the behavior until the slice can include it instead of deferring feedback or measurement to a later story.

## Acceptance Criteria

- Write the criteria in a dedicated `## Acceptance Criteria` section above `## Define the Outcome`, not inside the checklist item.
- Acceptance criteria must be binary and testable.
- If criteria are weak, use `references/acceptance-criteria.md`.
- If the criteria still cannot be made binary, narrow the slice before locking it.

## Success Metrics

- Metrics should be specific and easy to verify.
- Prefer observable behavior change over code-path completion.
- Prefer product data tied to user behavior or business outcomes over internal output metrics alone.
- Require an easy feedback path as part of the slice. For app-facing slices, make it in-app and name the exact affordance, where it appears, who sees it, and where the feedback is stored or reviewed.
- For app-facing slices, require an instrumentation/data capture plan. Name the event, field, log, query, dashboard, or other durable data source that will measure the primary metric after delivery.
- For CLI, API, automation, or infrastructure slices, treat that interface as the app surface. Require the nearest implemented feedback or measurement mechanism, such as command output, help text with feedback links, structured logs, persisted artifacts, audit records, metrics, or provider-visible state.
- If the slice is not app-facing, explicitly record why an in-app feedback path does not apply and name the nearest equivalent way to capture user feedback.
- Do not accept a metric that depends only on a human manually noticing behavior unless the story records why automated instrumentation is impossible for this slice and names the concrete implemented artifact, log, command output, or other durable evidence source that will capture evidence.
- If no feedback or measurement mechanism exists yet, make implementing or reusing one part of the slice. Do not check Success Metrics complete until the evidence loop is included in the slice.
- When the hypothesis claims a user-perception, trust, adoption, or value change, do not stop at implementation verification. Include both:
  - a verification path showing the feature works as intended
  - an outcome-evidence path showing how you will learn whether users actually felt or behaved differently
- If the slice can only measure implementation correctness right now, say that explicitly and record what later user evidence would still be needed to confirm the hypothesis.

## Validate Assumptions

- Write the assumption check in a dedicated `## Validate Assumptions` section above `## Define the Outcome`, not inside the checklist item.
- Name the one thing that would kill the story if false.
- If no product owner is present, explicitly name the missing product decision or stakeholder confirmation that could kill the story if false.

## Demo Plan

- Show setup, key action, and visible outcome.
- Include the feedback or measurement mechanism in the demo when possible, and note how the data capture can be verified without waiting for the full measurement window.

## Review Behavior

- Ask critical questions when the outcome sounds plausible but still hides product uncertainty, vague evidence, or multiple bundled changes.
- If the story is blocked, check whether the blocker reason is concrete enough to act on.
- If the blocker reason is vague, call that out explicitly as shared-context risk and ask what information is missing, who owns it, and what next unblock step should be captured.
- If the user and story artifacts do not appear aligned, ask a short alignment question before locking the draft in.
- If the user and story artifacts appear aligned too quickly, ask a critical question about failure modes, evidence, or hidden assumptions before locking the draft in.
