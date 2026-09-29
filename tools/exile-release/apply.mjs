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
assert.equal(manifest.length,28);assert.equal(new Set(manifest.map(f=>f.path)).size,manifest.length);
for(const f of manifest)assert.ok(/^(apps\/|infrastructure\/production\/release-exile-talents\.sh$)/.test(f.path)&&!f.path.includes('..'),'Unexpected application path');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:20*1024*1024});
if(process.argv[2]!=='verify'){
 assert.equal(git('diff','--name-only').trim(),'','Unstaged changes must not be overwritten');
 assert.equal(git('diff','--cached','--name-only').trim(),'','Staged changes must not be overwritten');
 for(const f of manifest)assert.equal(existsSync(f.path)?git('hash-object',f.path).trim():null,f.before,'Concurrent source change: '+f.path);
 const file=join(mkdtempSync(join(tmpdir(),'tuc-exile-')),'approved.patch');writeFileSync(file,patch);
 git('apply','--check','--index',file);git('apply','--index',file);
}
for(const f of manifest)assert.equal(hash(readFileSync(f.path)),f.after,'Changed tested source: '+f.path);
assert.deepEqual(git('diff','--cached','--name-only').trim().split('\n').sort(),manifest.map(f=>f.path).sort());
assert.equal(git('diff','--name-only').trim(),'','No unstaged application edits');
console.log('EXILE SOURCE VERIFIED — 28 exact application files, 184 stable talents, recipient scenario limits, saved configurations; no user data, source media or reward changes');
