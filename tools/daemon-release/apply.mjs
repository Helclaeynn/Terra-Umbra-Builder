import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,writeFileSync,unlinkSync,mkdtempSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const hash=b=>createHash('sha256').update(b).digest('hex');
const dir=new URL('./',import.meta.url),parts=readdirSync(dir).filter(n=>/^payload\.part[0-9]+\.b64$/.test(n)).sort((a,b)=>Number(a.match(/[0-9]+/)[0])-Number(b.match(/[0-9]+/)[0]));
const payload=Buffer.from(parts.map(n=>readFileSync(new URL(n,dir),'utf8')).join(''),'base64');
assert.equal(hash(payload),'d8f4d7a9afdf60cf348972700ba3cbcc165d720e078a9e1c12ab977191fa85ac');
const {files,patch}=JSON.parse(gunzipSync(payload));
assert.equal(files.length,28);assert.equal(new Set(files.map(f=>f.path)).size,28);
for(const f of files){assert.ok(/^(apps\/|infrastructure\/production\/release-daemon-talents\.sh$)/.test(f.path)&&!f.path.includes('..'));}
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:20*1024*1024});
if(process.argv[2]!=='verify'){
 for(const f of files)assert.equal(existsSync(f.path)?hash(readFileSync(f.path)):null,f.before,'Source changed since review: '+f.path);
 const file=join(mkdtempSync(join(tmpdir(),'tuc-daemon-')),'approved.patch');writeFileSync(file,patch);
 try{git('apply','--check','--unidiff-zero',file);git('apply','--index','--unidiff-zero',file);}finally{unlinkSync(file);}
}
for(const f of files)assert.equal(hash(readFileSync(f.path)),f.after,'Modified tested source: '+f.path);
assert.deepEqual(git('diff','--cached','--name-only').trim().split('\n').sort(),files.map(f=>f.path).sort(),'Only the approved application files may be published');
assert.equal(git('diff','--name-only').trim(),'','No unstaged application changes');
console.log('DAEMON APPROVED SOURCE OK — 28 exact files; 62 revisions and saved options; no Angelus, Fleau, base catalogue, Mage, Aseryn or equipment rewrites');
