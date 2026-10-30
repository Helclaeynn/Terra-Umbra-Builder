import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const dir='tools/aseryn-release/';
const encoded=[1,2,3,4].map(n=>readFileSync(`${dir}payload.part${n}.b64`,'utf8').trim()).join('');
const bytes=gunzipSync(Buffer.from(encoded,'base64'),{maxOutputLength:1048576});
assert.equal(createHash('sha256').update(bytes).digest('hex'),'59b03926934a2f616b01a335b22260071dea23802a879fb3ce286853e1d852b5','Exact approved payload');
const m=JSON.parse(bytes.toString('utf8'));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const blob=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const hash=p=>blob(readFileSync(p));
const allowed=p=>typeof p==='string'&&!p.split('/').includes('..')&&!p.includes('\\')&&(p.startsWith('apps/')||p==='infrastructure/production/release-aseryn-talents.sh');
const paths=[...m.existing,...m.newFiles].map(r=>r.path).sort();
assert.equal(paths.length,20);assert.equal(new Set(paths).size,20);assert.ok(paths.every(allowed));
for(const r of m.newFiles)assert.equal(blob(Buffer.from(r.content,'utf8')),r.sha,'Reviewed new content '+r.path);
for(const r of m.preserved)assert.equal(hash(r.path),r.sha,'Unchanged source '+r.path);
if(process.argv[2]!=='verify'){
 assert.equal(git('diff','--cached','--name-only'),'','Empty index required');
 for(const r of m.existing)assert.equal(hash(r.path),r.before,'Exact predecessor '+r.path);
 for(const r of m.newFiles)assert.equal(existsSync(r.path),false,'Never overwrite a new concurrent file '+r.path);
 execFileSync('git',['apply','--index','--unidiff-zero','-'],{input:m.patch,encoding:'utf8'});
 for(const r of m.newFiles){mkdirSync(dirname(r.path),{recursive:true});writeFileSync(r.path,r.content,'utf8');}
 git('add','--',...m.newFiles.map(r=>r.path));
}
assert.deepEqual(git('diff','--cached','--name-only').split('\n').sort(),paths,'Only the approved 20 files');
for(const r of m.existing){assert.equal(hash(r.path),r.after,'Exact revised source '+r.path);assert.equal(git('rev-parse',':'+r.path),r.after);}
for(const r of m.newFiles){assert.equal(hash(r.path),r.sha);assert.equal(git('rev-parse',':'+r.path),r.sha);}
for(const r of m.preserved)assert.equal(hash(r.path),r.sha,'All other Natures and source catalogues preserved');
git('diff','--cached','--check');
console.log('ASERYN APPROVED SOURCE OK — 20 exact reviewed files; all base catalogues, Mage rules, Fleaux and canonical equipment unchanged');
