// Apply only the approved Mage changes. No production data, hidden fetch, or forced push.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
const manifest=JSON.parse(readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const patch=gunzipSync(Buffer.from([1,2,3,4,5].map(n=>readFileSync(new URL(`./patch.part${n}.b64`,import.meta.url),'utf8').trim()).join(''),'base64'));
assert.equal(hash(patch),manifest.patchSha256,'Exact reviewed patch');
if(process.argv[2]!=='verify'){
  assert.equal(execFileSync('git',['status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim(),'','Clean tracked source required');
  execFileSync('git',['fetch','--depth=1','origin',manifest.base],{stdio:'inherit'});
  execFileSync('git',['diff','--exit-code',manifest.base,'HEAD','--','apps','infrastructure','compendium','character-builder'],{stdio:'inherit'});
  execFileSync('git',['apply','--check','--index','-'],{input:patch});
  execFileSync('git',['apply','--index','-'],{input:patch});
}
const changed=execFileSync('git',['diff','--cached','--name-only'],{encoding:'utf8'}).trim().split('\n').filter(Boolean).sort();
assert.deepEqual(changed,Object.keys(manifest.files).sort());
for(const [path,digest] of Object.entries(manifest.files))assert.equal(hash(readFileSync(path)),digest,path);
execFileSync('git',['diff','--cached','--check'],{stdio:'inherit'});
console.log('MAGE APPROVED PATCH OK — 24 exact files; all base catalogues, Aseryn revisions, Daemons, Fléaux, equipment and user data untouched');
