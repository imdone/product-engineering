# Shared Context Framing

Use this file only when the workflow needs to explain why story artifacts must stay current in the same workspace as implementation.

## Core Idea

Shared context means the people doing the work can see, update, and verify the same source of truth without leaving their main working environment.

In this workflow, that source of truth is the story plus its attachments in the backlog, kept in sync with Jira when needed.

## Why It Matters

When context lives somewhere else:
- learning is delayed
- updates get skipped
- plans drift from reality
- one person becomes the translator for everyone else

When context lives next to the work:
- the team can update the story while learning
- the plan stays aligned with implementation
- AI and humans can reference the same artifacts
- Jira remains a synced reporting surface instead of the only place context lives

## Signs You Need This Framing

Use this reference when:
- the plan is drifting from what implementation has uncovered
- the user needs a reason to keep `attachments/plan.md` current
- story updates are being postponed because they feel separate from the work
- the agent needs to justify updating story artifacts during implementation instead of only at the end

## Framing Lines

- "The map diverges from reality when documentation happens in a different workspace than discovery."
- "Shared context lets the team adapt together instead of relaying context through one person."
- "If the people discovering the constraint cannot update the plan immediately, the plan will go stale."
- "Keep the story where the work happens, then sync outward."
- "Jira can remain the reporting surface without being the only place the truth lives."

## Expert Quotes And Prompt Questions

Use these when you need to check for shared understanding explicitly. Pick one short quote, then ask one or two of the paired questions.
Convert each chosen question into a numbered-choice prompt before asking it.

### Jeff Patton

Source idea: documents help people who were there, but effective teams collaborate for shared understanding.

Questions:
- "If someone joined this story cold, what would they miss from the current story and attachments?"
- "Are we relying on memory or conversation for something that should be captured in the story right now?"

### Marty Cagan

Source idea: learning is wasted when one team member discovers something important and the rest of the team does not internalize it.

Questions:
- "What did we learn that the rest of the team or future AI run would not yet see in the artifacts?"
- "Which discovery from today would be wasted if we stopped without updating the story?"

### Martin Fowler / Ralph Johnson

Source idea: architecture is the shared understanding expert developers have of the system design.

Questions:
- "What is the current shared understanding of the design, in one or two sentences?"
- "Which design decision is important enough that it must be reflected in `attachments/design.md` or `attachments/plan.md`?"

### Birgitta Böckeler

Source idea: pair programming improves knowledge exchange, collaboration, and situational awareness on the team.

Questions:
- "If one teammate were out tomorrow, what context would the artifacts need so the work could continue cleanly?"
- "What does the team know right now that only exists tacitly and should be made explicit?"

### Jeff Bezos via Marty Cagan

Source idea: creativity comes from interaction and shared goals in a cross-functional team.

Questions:
- "Do we have a clear mission and specific goal for this phase, or are we mixing multiple concerns?"
- "What is the single goal everyone should be aligned on before implementation continues?"

### Product Learning Broadcast

Source idea: share the bigger learnings, what worked, what did not work, and what the team will try next.

Questions:
- "At the big-learning level, what worked, what did not work, and what are we trying next?"
- "If you had to brief another teammate in 30 seconds, what are the three takeaways?"

## Sources

- Jeff Patton, "Why Documents Fail And What You Can Do About It"
  https://jpattonassociates.com/documents-fail-can/
- Martin Fowler, "Software Architecture Guide"
  https://www.martinfowler.com/architecture/
- Marty Cagan, "Shared Learning"
  https://www.svpg.com/shared-learning/
- Marty Cagan, "Communicating Product Learnings"
  https://www.svpg.com/communicating-product-learnings/
- Marty Cagan, "Discovery When Working Remotely"
  https://www.svpg.com/discovery-when-working-remotely/
- Thoughtworks Technology Podcast, Birgitta Böckeler on pair programming and situational awareness
  https://www.thoughtworks.com/en-de/insights/podcasts/technology-podcasts/themes-from-technology-radar-volume-30

## Guidance For This Skill

- Update the story artifacts as soon as implementation changes understanding.
- Prefer local markdown artifacts as the working context, then sync them to Jira.
- When the plan changes, explain the change in plain language so the user stays aligned with the new path.
- Use this framing sparingly; only load it when context drift or workflow justification is the issue.
