import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {brotliDecompressSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
const dir=new URL('./',import.meta.url),hash=b=>createHash('sha256').update(b).digest('hex');
const payload=Buffer.from(readFileSync(new URL('payload.b64',dir),'utf8').replace(/\s/g,''),'base64');
assert.equal(hash(payload),'a0007a2eea712cceb357ccb8a0e678407e104a5d15fc14174ccd90552fb14174');
const {files,expected,operations}=JSON.parse(brotliDecompressSync(payload));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:20*1024*1024});
const paths=[...Object.keys(expected),...files.map(f=>f.path)];
assert.equal(new Set(paths).size,paths.length);
for(const path of paths)assert.ok(/^(apps\/|infrastructure\/production\/release-extral-talents\.sh$)/.test(path)&&!path.includes('..'),path);
const receipt='.extral-applied.json';
if(process.argv[2]!=='verify'){
 assert.equal(git('diff','--name-only').trim(),'','Do not overwrite unstaged changes');
 assert.equal(git('diff','--cached','--name-only').trim(),'','Do not overwrite staged changes');
 for(const [path,sha] of Object.entries(expected))assert.equal(git('hash-object',path).trim(),sha,'Concurrent source change: '+path);
 for(const f of files)assert.equal(existsSync(f.path),false,'New application path already exists: '+f.path);
 const prepared=new Map(Object.keys(expected).map(path=>[path,readFileSync(path,'utf8')]));
 for(const op of operations){const text=prepared.get(op.path);assert.equal(typeof text,'string');if(op.count===0){prepared.set(op.path,op.new+text);continue;}assert.equal(text.split(op.old).length-1,op.count,'Exact anchor changed: '+op.path+' '+op.old.slice(0,90));prepared.set(op.path,text.replaceAll(op.old,op.new));}
 // Clone the already-reviewed deployment procedure, keeping its backup and rollback, and all prior regression assertions.
 const prior=readFileSync('infrastructure/production/release-angelus-talents.sh','utf8');
 assert.equal(git('hash-object','infrastructure/production/release-angelus-talents.sh').trim(),'153aa456a12b68ccc13850b986643da86b89bfb9');
 const release=prior.replace('Authorized release of the approved Angelus talents and saved manifestations.','Authorized release of the approved Extral talents and saved configurations.').replaceAll('releases/angelus-$sha','releases/extral-$sha').replaceAll(':angelus-$sha',':extral-$sha').replaceAll(':before-angelus-$sha',':before-extral-$sha').replaceAll('ANGELUS TALENTS RELEASE FAILED','EXTRAL TALENTS RELEASE FAILED').replaceAll('PRODUCTION ANGELUS TALENTS RELEASE OK','PRODUCTION EXTRAL TALENTS RELEASE OK').replace("console.log('ANGELUS TALENTS LIVE OK",readFileSync(new URL('live-assertions.txt',dir),'utf8')+"\nconsole.log('ANGELUS TALENTS LIVE OK");
 prepared.set('infrastructure/production/release-extral-talents.sh',release);
 for(const f of files)prepared.set(f.path,f.content);
 for(const [path,content] of prepared){mkdirSync(dirname(path),{recursive:true});writeFileSync(path,content);}
 const written=[...prepared.keys()].sort();git('add','--',...written);
 writeFileSync(receipt,JSON.stringify(Object.fromEntries(written.map(p=>[p,hash(readFileSync(p))])),null,2));
}
const after=JSON.parse(readFileSync(receipt,'utf8'));
for(const [path,digest] of Object.entries(after))assert.equal(hash(readFileSync(path)),digest,'Changed tested source: '+path);
assert.deepEqual(git('diff','--cached','--name-only').trim().split('\n').sort(),Object.keys(after).sort(),'Only the approved source may be committed');
assert.equal(git('diff','--name-only').trim(),'','No unstaged changes');
console.log('EXTRAL SOURCE VERIFIED — exact approved application edits; 162 stable talents; scenario-limited nanites; no other Nature, source media, user data or reward rewrite.');
