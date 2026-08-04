# Dependency Direction Rule

Use this file when the design or plan needs a simple rule for dependency direction.

Core rule:
- More important things must not depend on less important things.
- Policy, business rules, and core decisions are more important than delivery details, framework code, transport, storage, and UI wiring.
- If the execution flow goes from a more important thing to a less important thing, introduce an interface at the important boundary and invert the dependency so the less important thing implements it.
- When a new use case creates an axis of change, refactor the touched path so dependencies follow this rule before treating implementation as complete. Keep the abstraction as small as the new use case proves necessary.

## Framing Lines

- "More important things should not depend on less important things."
- "Let flow go outward, but keep source-code dependencies inward."
- "If policy needs detail at runtime, depend on an interface, not the detail."
- "Execution can point one way while dependencies point the other."
- "Use dependency inversion when the call path crosses from important policy into replaceable detail."

## Quick Heuristic

Ask of each dependency:
- Does this code express policy or detail?
- If the dependency changed tomorrow, would the business rule need to change too?
- Is this dependency here because of runtime flow, or because the source code is coupled unnecessarily?
- Did this story add a new use case or variation that proves this dependency now has an axis of change?

If the answer is "detail" or "runtime flow only":
- prefer an interface owned by the more important side
- let the less important side implement it
- keep the important side unaware of framework, storage, HTTP, provider, or UI specifics

If the story added a new use case or real variation:
- treat dependency-rule cleanup as part of the refactor step, not as follow-up work
- move only the dependency boundary needed by the touched path
- avoid broad architecture rewrites beyond the proven axis of change

## Examples

Good:
- Use case depends on `AttachmentStore`
- GitHub adapter implements `AttachmentStore`
- UI/controller depends on use case

Bad:
- Use case imports `GitHubAdapter`
- Domain rule imports web framework request objects
- Story plan says "call the database directly from the core logic because that's where the flow goes"

## Alignment Questions

Convert the chosen stem into a numbered-choice prompt before asking it.

- "Which part of this change is the policy, and which part is just delivery detail?"
- "Is a more important module importing a less important one right now?"
- "Does the runtime flow need dependency inversion here, or is a direct dependency acceptable?"
- "What interface should be owned by the more important side if this dependency needs to cross outward?"
- "If we swapped the provider or transport layer tomorrow, what code should remain unchanged?"
- "What new use case or variation proves this boundary needs to change now?"
