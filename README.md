# Product Engineering

Open methods, templates, and AI skills for building software as a learning process.

The first included method is Hypothesis Driven Development (HDD): frame the problem, state what you believe will improve, deliver the smallest end-to-end slice, capture evidence, deploy it, and confirm whether the outcome happened.

You can practice HDD without imdone. The public skill works with Markdown files and the issue tracker, editor, or AI coding agent you already use.

## What You Get

- an installable Codex plugin under `plugins/product-engineering/`
- the full HDD skill, focused references, and plan evaluators
- full and lightweight Markdown story templates
- a plain-Markdown example that does not require a provider integration
- an issue and contribution path for improving the method

## Try HDD Without Imdone

Clone this repository:

```sh
git clone https://github.com/imdone/product-engineering.git
cd product-engineering
npm test
```

To use the skill directly in a Codex project before marketplace publication, copy its directory into the project's skills folder:

```sh
mkdir -p .codex/skills
cp -R plugins/product-engineering/skills/hypothesis-driven-development .codex/skills/
```

Then ask your coding agent:

> Use the hypothesis-driven-development skill for this story. Read the story and HDD artifacts, then follow the session contract.

To practice without an AI skill loader, copy `templates/hypothesis-driven-development.md` into your work tracker or repository and keep the story plus its evidence together.

## The HDD Loop

1. **Define the Outcome** — confirm the problem, hypothesis, vertical slice, acceptance criteria, success measures, assumptions, and demo.
2. **Prove the Outcome** — design, plan with red/green/refactor, implement top-to-bottom, and run the full project test suite.
3. **Deploy the Outcome** — capture proof that the slice is live in an appropriate place.
4. **Confirm the Outcome** — review done-ness, measure the result, collect direct feedback, and decide whether to close, iterate, or pivot.

Full HDD fits ambiguous, high-risk, cross-team, or implementation-heavy work. Lightweight HDD keeps the same evidence and plan-approval discipline while using fewer artifacts for low-risk changes.

## Why Imdone Is Optional

HDD is the method. imdone is an optional operational layer for teams that want the story, attachments, chronological notes, and Jira or GitHub state synchronized as shared working memory.

The public method records progress directly in local Markdown. Teams already using imdone can use `imdone note` as a convenient bridge, but no imdone command, account, or project configuration is required.

## Feedback And Contributions

Open an [issue](https://github.com/imdone/product-engineering/issues) when:

- the workflow is unclear or too heavy
- a template misses a real product-engineering case
- the skill behaves differently across coding agents
- a shared HDD behavior has drifted

See [CONTRIBUTING.md](./CONTRIBUTING.md) before proposing a change.

## Reviewer Check

Before treating the first public version as validated, ask a reviewer:

- What is HDD?
- When would you use it?
- Do you need imdone to try it?
- Where would you give feedback or contribute an improvement?
- What would imdone make easier for a team already using HDD?

## Maintainer Parity Check

The imdone-bundled HDD skill is the authoritative behavior source. When both repositories are available locally, compare the public adaptation with it explicitly:

```sh
npm run check:parity -- \
  --canonical ../imdone-jira-plugin/cli-package/public/.codex/plugins/imdone/skills/hypothesis-driven-development \
  --target ./plugins/product-engineering/skills/hypothesis-driven-development
```

This maintainer check compares shared workflow contracts and rejects hard imdone dependencies. The published package and its normal `npm test` run do not require the proprietary repository.
