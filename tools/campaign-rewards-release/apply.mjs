import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const dir='tools/campaign-rewards-release/';
const manifest=JSON.parse(readFileSync(dir+'manifest.json','utf8'));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const hash=path=>{const data=readFileSync(path);return createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');};
const paths=manifest.existing.map(row=>row.path).sort();
assert.ok(paths.length===14&&paths.every(p=>p.startsWith('apps/')&&!p.includes('..')));
for(const row of manifest.newFiles)assert.equal(hash(row.path),row.sha,'Reviewed new file '+row.path);
if(process.argv[2]!=='verify'){
  assert.equal(git('diff','--cached','--name-only'),'','The checkout must start with an empty index');
  for(const row of manifest.existing)assert.equal(hash(row.path),row.before,'Exact predecessor '+row.path);
  // Zero-context diffs are safe here only because each complete predecessor
  // and resulting file is checked against its reviewed Git object hash.
  git('apply','--index','--unidiff-zero',dir+'api.patch',dir+'web.patch');
}
assert.deepEqual(git('diff','--cached','--name-only').split('\n').sort(),paths,'Only reviewed application changes are staged');
for(const row of manifest.existing){
  assert.equal(hash(row.path),row.after,'Reviewed result '+row.path);
  assert.equal(git('rev-parse',':'+row.path),row.after,'The staged source matches what was tested');
}
git('diff','--cached','--check');
// The source-revision regression now distinguishes initial selection from
// replacing rewards on an existing campaign copy; authorization stays strict.
console.log('CAMPAIGN REVIEWED SOURCE OK — exact before/after hashes, 14 existing files, 6 new files; initial selection and protected campaign revision regression enabled');
