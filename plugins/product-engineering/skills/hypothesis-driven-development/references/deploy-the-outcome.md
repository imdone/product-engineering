# Deploy The Outcome

Use this reference during the Deploy gate between Phase 2 and Phase 3.

## Gate Purpose

- Deploy is the final step of Prove the Outcome.
- Deploy proves the slice is live somewhere appropriate for the slice.
- Confirm is separate and comes after Deploy; it proves the outcome happened.

## Evidence

Accept evidence that the slice is live in a place the slice can reasonably reach:

- production
- preview
- local dogfood
- package version
- command output
- environment
- URL
- artifact
- provider-visible state
- release identifier

If the needed evidence depends on outside validation, record an evidence gate or blocker instead of checking Deploy complete.

## Guardrails

- Do not mark outcome confirmation from Deploy evidence alone.
- Do not mark progress beyond what the evidence honestly shows.
- If the slice is live but not yet observable, record that gap explicitly and keep Confirm open.
