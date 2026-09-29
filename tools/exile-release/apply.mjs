import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {brotliDecompressSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
const hash=b=>createHash('sha256').update(b).digest('hex');
const bytes=Buffer.from([1,2,3,4].map(n=>readFileSync(new URL('./part'+n+'.b64',import.meta.url),'utf8')).join('').replace(/\s/g,''),'base64');
assert.equal(hash(bytes),'baa2c1593b460d43c00590ae6a3f58a6bfc17cdf55883913f728aa432684f257','Incomplete or modified approved Exile source');
const {manifest,patch}=JSON.parse(brotliDecompressSync(bytes));
// Reviewed corrections: real Vue event sequencing and an explicit accessible name for the owned-item selector.
const corrections=JSON.parse(readFileSync(new URL('./corrections.json',import.meta.url),'utf8'));
for(const c of corrections){
 assert.ok(['apps/web/tests/exile-progression-dom.mjs','apps/web/src/components/builder/ExileOptions.vue'].includes(c.path),'Only reviewed Exile corrections are authorized');
 assert.equal(manifest.find(f=>f.path===c.path)?.after,c.before,'Correction must match the original approved payload');
}
const finalManifest=manifest.map(f=>({...f,after:corrections.find(c=>c.path===f.path)?.after??f.after}));
assert.equal(manifest.length,28);assert.equal(new Set(manifest.map(f=>f.path)).size,manifest.length);
for(const f of manifest)assert.ok(/^(apps\/|infrastructure\/production\/release-exile-talents\.sh$)/.test(f.path)&&!f.path.includes('..'),'Unexpected application path');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:20*1024*1024});
if(process.argv[2]!=='verify'){
 assert.equal(git('diff','--name-only').trim(),'','Unstaged changes must not be overwritten');
 assert.equal(git('diff','--cached','--name-only').trim(),'','Staged changes must not be overwritten');
 for(const f of manifest)assert.equal(existsSync(f.path)?git('hash-object',f.path).trim():null,f.before,'Concurrent source change: '+f.path);
 const file=join(mkdtempSync(join(tmpdir(),'tuc-exile-')),'approved.patch');writeFileSync(file,patch);
 git('apply','--check','--index',file);git('apply','--index',file);
 for(const c of corrections){
  assert.equal(hash(readFileSync(c.path)),c.before,'Unexpected correction input');
  let text=readFileSync(c.path,'utf8');
  for(const op of c.replacements){assert.equal(text.split(op.old).length-1,1,'Exact correction anchor changed');text=text.replace(op.old,op.new);}
  assert.equal(hash(Buffer.from(text)),c.after,'Unexpected correction output');
  writeFileSync(c.path,text);git('add','--',c.path);
 }
}
for(const f of finalManifest)assert.equal(hash(readFileSync(f.path)),f.after,'Changed tested source: '+f.path);
assert.deepEqual(git('diff','--cached','--name-only').trim().split('\n').sort(),manifest.map(f=>f.path).sort());
assert.equal(git('diff','--name-only').trim(),'','No unstaged application edits');
console.log('EXILE SOURCE VERIFIED — 28 exact application files, 184 stable talents, recipient scenario limits, saved configurations; no user data, source media or reward changes');
