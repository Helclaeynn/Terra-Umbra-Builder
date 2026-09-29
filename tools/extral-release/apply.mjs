import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {brotliDecompressSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
const hash=b=>createHash('sha256').update(b).digest('hex');
const dir=new URL('./',import.meta.url);
const encoded=[1,2,3].map(n=>readFileSync(new URL('complete-part0'+n+'.b64',dir),'utf8')).join('').replace(/\s/g,'');
const bytes=Buffer.from(encoded,'base64');
assert.equal(hash(bytes),'2a73b86fe10b1798aad754dbd39b824d5ceaf25f1ab47abdbf648f0e75c04a63','Incomplete or modified release payload');
const {manifest,patch}=JSON.parse(brotliDecompressSync(bytes));
assert.equal(manifest.length,22);assert.equal(new Set(manifest.map(f=>f.path)).size,manifest.length);
for(const f of manifest)assert.ok(/^(apps\/|infrastructure\/production\/release-extral-talents\.sh$)/.test(f.path)&&!f.path.includes('..'));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:20*1024*1024});
if(process.argv[2]!=='verify'){
 assert.equal(git('diff','--name-only').trim(),'','Unstaged changes must not be overwritten');
 assert.equal(git('diff','--cached','--name-only').trim(),'','Staged changes must not be overwritten');
 for(const f of manifest)assert.equal(existsSync(f.path)?git('hash-object',f.path).trim():null,f.before,'Concurrent source change: '+f.path);
 const file=join(mkdtempSync(join(tmpdir(),'tuc-extral-')),'approved.patch');writeFileSync(file,patch);
 git('apply','--check','--index',file);git('apply','--index',file);
}
for(const f of manifest)assert.equal(hash(readFileSync(f.path)),f.after,'Changed tested source: '+f.path);
assert.deepEqual(git('diff','--cached','--name-only').trim().split('\n').sort(),manifest.map(f=>f.path).sort());
assert.equal(git('diff','--name-only').trim(),'','No unstaged application edits');
console.log('EXTRAL SOURCE VERIFIED — 22 exact application files, complete checked payload; no media, user data, other Nature or campaign reward changes');
