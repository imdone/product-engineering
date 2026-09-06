import assert from 'node:assert/strict';
import test from 'node:test';

import { detectHddMode } from '../plugins/product-engineering/skills/hypothesis-driven-development/scripts/detect_hdd_mode.mjs';

test('infers Full HDD from saved full-template metadata or a standalone full tag', () => {
  assert.deepEqual(detectHddMode('# Story\n\n<!--\nimdoneTemplate:template_stock_hypothesis_driven_development\n-->'), {
    mode: 'full',
    source: 'imdoneTemplate'
  });
  assert.deepEqual(detectHddMode('# Story\n\n<!--\n#HDD-template\n-->'), {
    mode: 'full',
    source: '#HDD-template'
  });
});

test('infers Lightweight HDD from lightweight metadata including the legacy dual-tag shape', () => {
  assert.deepEqual(detectHddMode('# Story\n\n<!--\nimdoneTemplate:template_stock_lightweight_hypothesis_driven_development\n-->'), {
    mode: 'lightweight',
    source: 'imdoneTemplate'
  });
  assert.deepEqual(detectHddMode('# Story\n\n<!--\n#HDD-light-template #HDD-template\n-->'), {
    mode: 'lightweight',
    source: '#HDD-light-template'
  });
});

test('asks only when closing metadata is missing or contains conflicting template identities', () => {
  assert.deepEqual(detectHddMode('# Story\n\nDiscuss #HDD-template in the body.'), {
    mode: 'ask',
    source: null
  });
  assert.deepEqual(detectHddMode('# Story\n\n<!--\nimdoneTemplate:template_stock_hypothesis_driven_development\nimdoneTemplate:template_stock_lightweight_hypothesis_driven_development\n-->'), {
    mode: 'ask',
    source: 'conflict'
  });
  assert.deepEqual(detectHddMode('<!-- #HDD-template -->\n# Story\n\n<!-- unrelated closing metadata -->'), {
    mode: 'ask',
    source: null
  });
});
