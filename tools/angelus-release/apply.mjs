import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,writeFileSync,unlinkSync,mkdtempSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {brotliDecompressSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const hash=b=>createHash('sha256').update(b).digest('hex');
const dir=new URL('./',import.meta.url),parts=readdirSync(dir).filter(n=>/^payload\.part[0-9]+\.b64$/.test(n)).sort((a,b)=>Number(a.match(/[0-9]+/)[0])-Number(b.match(/[0-9]+/)[0]));
const payload=Buffer.from(parts.map(n=>readFileSync(new URL(n,dir),'utf8')).join(''),'base64');
assert.equal(hash(payload),'97fd0a336e9701edde6c58a6d60bfe695240870e77f2e47b45ae93a5c1f69be5');
const {files,patch,compendium}=JSON.parse(brotliDecompressSync(payload));
assert.equal(files.length,26);assert.equal(new Set(files.map(f=>f.path)).size,26);
for(const f of files){assert.ok(/^(apps\/|infrastructure\/production\/release-angelus-talents\.sh$)/.test(f.path)&&!f.path.includes('..'));}
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:20*1024*1024});
if(process.argv[2]!=='verify'){
 for(const f of files)assert.equal(existsSync(f.path)?hash(readFileSync(f.path)):null,f.before,'Source changed since review: '+f.path);
 assert.equal(compendium.path,'apps/api/src/compendium-verite-v7-angelus.ts');
 const source=readFileSync(compendium.path,'utf8'),start=source.indexOf('const SOURCE_PAYLOAD=')+21,end=source.indexOf(';\nconst article=');
 assert.ok(start>=21&&end>start);const tree=JSON.parse(source.slice(start,end));
 for(const change of compendium.changes){let target=tree;for(const key of change.path.slice(0,-1)){assert.ok(Object.hasOwn(target,key));target=target[key];}target[change.path.at(-1)]=change.value;}
 writeFileSync(compendium.path,source.slice(0,start)+JSON.stringify(tree)+source.slice(end));
 git('add',compendium.path);
 const file=join(mkdtempSync(join(tmpdir(),'tuc-angelus-')),'approved.patch');writeFileSync(file,patch);
 try{git('apply','--check','--unidiff-zero',file);git('apply','--index','--unidiff-zero',file);}finally{unlinkSync(file);}
}
for(const f of files)assert.equal(hash(readFileSync(f.path)),f.after,'Modified tested source: '+f.path);
assert.deepEqual(git('diff','--cached','--name-only').trim().split('\n').sort(),files.map(f=>f.path).sort(),'Only the approved application files may be published');
assert.equal(git('diff','--name-only').trim(),'','No unstaged application changes');
console.log('ANGELUS APPROVED SOURCE OK — 26 exact files; 55 revisions and saved options; stable IDs; no Fleau, Daemon, Mage, Aseryn, Extral or equipment rewrites');
