# Product Engineering

Open methods, templates, and AI skills for building software as a learning process.

[![skills.sh](https://skills.sh/b/imdone/product-engineering)](https://skills.sh/imdone/product-engineering/hypothesis-driven-development)

The first included method is Hypothesis Driven Development (HDD): frame the problem, state what you believe will improve, deliver the smallest end-to-end slice, capture evidence, deploy it, and confirm whether the outcome happened.

You can practice HDD without imdone. The public skill works with Markdown files and the issue tracker, editor, or AI coding agent you already use.

## What You Get

- a repository-hosted marketplace for Codex and Claude Code
- one shared plugin under `plugins/product-engineering/`
- the full HDD skill, focused references, and plan evaluators
- full and lightweight Markdown story templates
- a plain-Markdown example that does not require a provider integration
- an issue and contribution path for improving the method

## Install From The Marketplace

Both Codex and Claude Code use this GitHub repository as the marketplace and install the same `product-engineering` plugin payload.

### Codex

```sh
codex plugin marketplace add imdone/product-engineering --ref main
codex plugin add product-engineering@product-engineering
```

### Claude Code

```sh
claude plugin marketplace add imdone/product-engineering
claude plugin install product-engineering@product-engineering
```

### skills.sh

```sh
npx skills add imdone/product-engineering --skill hypothesis-driven-development
```

The first public install makes the skill eligible for automatic skills.sh listing through anonymous aggregate install telemetry. Browse the skill at [skills.sh/imdone/product-engineering/hypothesis-driven-development](https://skills.sh/imdone/product-engineering/hypothesis-driven-development).

Then ask your coding agent:

> Use the hypothesis-driven-development skill for this story. Read the story and HDD artifacts, then follow the session contract.

## Try HDD Without A Plugin

Clone this repository:

```sh
git clone https://github.com/imdone/product-engineering.git
cd product-engineering
npm test
```

To practice without an AI plugin loader, copy the full template into your work tracker or repository:

```sh
cp templates/hypothesis-driven-development.md my-hdd-story.md
```

Keep the story plus its evidence together. This plain-Markdown path does not require Codex, Claude Code, or imdone.

## The HDD Loop

1. **Define the Outcome** — confirm the problem, hypothesis, vertical slice, acceptance criteria, success measures, assumptions, and demo.
2. **Prove the Outcome** — design, plan with red/green/refactor, implement top-to-bottom, and run the full project test suite.
3. **Deploy the Outcome** — capture proof that the slice is live in an appropriate place.
4. **Confirm the Outcome** — review done-ness, measure the result, collect direct feedback, and decide whether to close, iterate, or pivot.

Full HDD fits ambiguous, high-risk, cross-team, or implementation-heavy work. Lightweight HDD keeps the same evidence and plan-approval discipline while using fewer artifacts for low-risk changes.

## Why Imdone Is Optional

HDD is the method. imdone is an optional operational layer for teams that want the story, attachments, chronological notes, and Jira or GitHub state synchronized as shared working memory.

If you want that operational layer, learn more at [imdone.io](https://imdone.io) or install the [imdone CLI from npm](https://www.npmjs.com/package/imdone-cli).

The public skill checks whether imdone is installed and whether the current workspace supports its project features. When those deterministic checks pass, it uses imdone for session state, progress notes, templates, and user-approved provider sync; in particular, it tries `imdone note` before writing a progress note directly. Existing full or lightweight template metadata selects the saved HDD mode before the skill asks a setup question. In an enabled marked session, the retained session story is the automatic note target; an explicitly named Jira key or numeric GitHub issue redirects only that note without changing session or global current state. If imdone is absent or a command fails, HDD continues with local Markdown and external evidence gates. No imdone command, account, or project configuration is required to practice the method.

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

This maintainer check compares shared workflow contracts, guarded optional-imdone integrations, and their tool-neutral fallbacks. It rejects only hard or unguarded imdone dependencies. The published package and its normal `npm test` run do not require the proprietary repository.
