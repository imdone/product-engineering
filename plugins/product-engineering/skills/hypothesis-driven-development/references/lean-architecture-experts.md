# Lean Architecture Framing

Use this file for short framing lines during design, plan maintenance, and implementation. Prefer quotes that steer toward smaller, cleaner changes.

## Kent Beck

**Use for:** Design, Tasks, Implement

- "Make it work, make it right, make it fast."
- "First make the change easy, then make the easy change."
- "Use the fewest elements needed right now."

## Martin Fowler

**Use for:** Design, Implement, Retrospect

- "Architecture is about the important stuff."
- "Refactor after pressure appears."
- "Evolve the design as the needs become concrete."

## Robert C. Martin

**Use for:** Design, Tasks

- "Keep dependencies pointing inward."
- "Separate policy from delivery only when it helps changeability."
- "Do not add ceremony without a reason."

## Sandi Metz

**Use for:** Design, Implement

- "Duplication is cheaper than the wrong abstraction."
- "Wait until the variation is real."
- "A bad abstraction hides the real design."

## John Ousterhout

**Use for:** Design, Tasks

- "Complexity grows from dependencies and obscurity."
- "A new abstraction should reduce cognitive load."
- "Add structure only when it makes the system easier to change."

## Quick Mapping

- Design: Kent Beck, Martin Fowler, Robert C. Martin, Sandi Metz, John Ousterhout
- Tasks: Kent Beck, Robert C. Martin, John Ousterhout
- Implement: Kent Beck, Martin Fowler, Sandi Metz
- Retrospect: Martin Fowler

## Alignment Questions

Use these when design or plan details are drifting.
Convert the chosen stem into a numbered-choice prompt before asking it.

- "What is the first boundary or module we should touch, and why there first?"
- "What dependency direction must stay clean for this story?"
- "What is real in this phase and what is still stubbed?"
- "Are we introducing an abstraction because the story needs it, or because it feels tidy?"
- "If another engineer read this plan, would they know the next concrete change to make?"
