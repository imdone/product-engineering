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

Keep progress-note activation deterministic and prompt-free: an explicit HDD, HDD Light, or `imdone-ai` skill request, `imdone-session-story:v1` from `imdone hdd`, or `imdone-story-context:v1` from `imdone ai` enables capture for the resolved session story. An explicit opt-out always wins; without an explicit request or recognized marker, capture stays off. Never ask for consent to enable progress notes. Story tags and legacy `hddProgressNotes:enabled` metadata do not activate ordinary direct-agent sessions and are not required by recognized sessions.

Before opening a pull request:

```sh
npm test
```

When you also have the canonical imdone source locally, run the maintainer parity command documented in [README.md](./README.md). A public contributor does not need that repository to run the normal test suite.
