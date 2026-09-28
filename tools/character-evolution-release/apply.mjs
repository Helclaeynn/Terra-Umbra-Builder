import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const dir='tools/character-evolution-release/';
const manifest=JSON.parse(readFileSync(dir+'manifest.json','utf8'));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const hash=p=>{const b=readFileSync(p);return createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
const paths=manifest.existing.map(r=>r.path).sort();
assert.ok(paths.length>0&&paths.every(p=>p.startsWith('apps/')&&!p.includes('..')));
for(const r of manifest.newFiles)assert.equal(hash(r.path),r.sha,'Reviewed new file '+r.path);
if(process.argv[2]!=='verify'){
 assert.equal(git('diff','--cached','--name-only'),'','Empty index required');
 for(const r of manifest.existing)assert.equal(hash(r.path),r.before,'Exact predecessor '+r.path);
 // Exact whole-file hashes make this zero-context reviewed diff fail closed.
 git('apply','--index','--unidiff-zero',dir+'changes.patch');
}
assert.deepEqual(git('diff','--cached','--name-only').split('\n').sort(),paths,'No unrelated edits');
for(const r of manifest.existing){assert.equal(hash(r.path),r.after,'Reviewed result '+r.path);assert.equal(git('rev-parse',':'+r.path),r.after);}
for(const r of manifest.preserved)assert.equal(hash(r.path),r.sha,'Compendium unchanged '+r.path);
git('diff','--cached','--check');
console.log('CHARACTER EVOLUTION REVIEWED SOURCE OK — exact file hashes, no Compendium change, only approved application edits');
