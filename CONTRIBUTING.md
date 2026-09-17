# Contributing

Hypothesis Driven Development improves through real examples, corrections, and evidence from product-engineering work.

Start with a [GitHub issue](https://github.com/imdone/product-engineering/issues) describing:

- the story or workflow you were trying to use
- what became unclear, heavy, or incorrect
- the behavior you expected
- any prompt, artifact, or evidence that helps reproduce the gap

Good contributions include clearer templates, representative examples, skill interaction improvements, stronger evaluators, and better tool-neutral guidance.

Keep the public method usable with local Markdown. imdone may be described as an optional operational layer, but public workflow execution and tests must not require imdone commands, configuration, provider access, or proprietary source.

Every bundled HDD change to shared behavior must update the canonical open-source `product-engineering` public adaptation in the same change and keep the maintainer parity contract green. Treat an in-package or vendored copy as a delivery fixture, not as evidence that this repository was updated.

Keep the retained HDD session story as the automatic progress-note target. Confirm it through the correlated lifecycle without a redundant target question; allow an explicitly named, locally resolvable Jira key or numeric GitHub issue as a note-only redirect without mutating current or session story state. Use bounded HDD-eligible recommendations only as fail-closed recovery when automatic confirmation cannot complete.

Infer Full or Lightweight HDD from closing story metadata before asking the engineer to repeat the choice: `#HDD-template` selects Full HDD, while `#HDD-light-template` or the corresponding lightweight `imdoneTemplate` selects Lightweight HDD. Lightweight metadata wins over a legacy companion full tag.

Before opening a pull request:

```sh
npm test
```

When you also have the canonical imdone source locally, run the maintainer parity command documented in [README.md](./README.md). A public contributor does not need that repository to run the normal test suite.
