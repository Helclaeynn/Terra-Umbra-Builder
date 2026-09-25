import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const source = await readFile(resolve(root, 'apps/api/src/compendium.ts'), 'utf8');
const dockerfile = await readFile(resolve(root, 'apps/api/Dockerfile'), 'utf8');
const workflow = await readFile(resolve(root, '.github/workflows/v2-dev.yml'), 'utf8');
const uploads = workflow.split('\n').filter((line) => line.trim().startsWith('rsync ') &&
  line.includes('compendium/source/'));
const assets = [...source.matchAll(/resolve\(COMPENDIUM_MEDIA_DIR,\s*"(source\/[a-z0-9-]+\.json)"\)/g)]
  .map((match) => match[1]);
assert.ok(assets.length >= 5, 'Expected Compendium source manifests');
for (const asset of assets) {
  await readFile(resolve(root, 'compendium', asset));
  assert.ok(dockerfile.split('\n').some((line) => line.trim() ===
    `COPY compendium/${asset} ./compendium-media/${asset}`),
    `${asset} must be included in the API runtime image`);
  assert.ok(uploads.some((line) => line.includes(`compendium/${asset}`)),
    `${asset} must be uploaded to the deployment host`);
}
console.log(`${assets.length} Compendium source manifests included in upload and API image.`);
