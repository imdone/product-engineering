# Contributing

Hypothesis Driven Development improves through real examples, corrections, and evidence from product-engineering work.

Start with a [GitHub issue](https://github.com/imdone/product-engineering/issues) describing:

- the story or workflow you were trying to use
- what became unclear, heavy, or incorrect
- the behavior you expected
- any prompt, artifact, or evidence that helps reproduce the gap

Good contributions include clearer templates, representative examples, skill interaction improvements, stronger evaluators, and better tool-neutral guidance.

Keep the public method usable with local Markdown. imdone may be described as an optional operational layer, but public workflow execution and tests must not require imdone commands, configuration, provider access, or proprietary source.

Before opening a pull request:

```sh
npm test
```

When you also have the canonical imdone source locally, run the maintainer parity command documented in [README.md](./README.md). A public contributor does not need that repository to run the normal test suite.
