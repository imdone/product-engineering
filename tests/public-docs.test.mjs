import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');

test('documents independent use and public feedback', async () => {
  const readme = await fs.readFile(path.join(root, 'README.md'), 'utf8');
  const packageManifest = JSON.parse(
    await fs.readFile(path.join(root, 'package.json'), 'utf8')
  );

  assert.match(readme, /without imdone/i);
  assert.match(readme, /install|copy/i);
  assert.match(
    readme,
    /codex plugin marketplace add imdone\/product-engineering --ref main/i
  );
  assert.match(
    readme,
    /codex plugin add product-engineering@product-engineering/i
  );
  assert.match(
    readme,
    /claude plugin marketplace add imdone\/product-engineering/i
  );
  assert.match(
    readme,
    /claude plugin install product-engineering@product-engineering/i
  );
  assert.match(readme, /github\.com\/imdone\/product-engineering\/issues/i);
  assert.match(readme, /What is HDD/i);
  assert.match(readme, /do (I|you) need imdone/i);
  assert.equal(
    packageManifest.repository.url,
    'https://github.com/imdone/product-engineering.git'
  );
  assert.equal(
    packageManifest.bugs.url,
    'https://github.com/imdone/product-engineering/issues'
  );
});
