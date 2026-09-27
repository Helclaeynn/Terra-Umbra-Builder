import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
// Installer-only preparation; application source is ordinary TS/Vue after generation.
const lines=readFileSync(new URL('./apply-base.mjs',import.meta.url),'utf8').split('\n');
const targets=lines.map((line,index)=>line.startsWith("sub(sheet,'detail:item?.effect,compendiumId:item?.compendiumId,'")?index:-1).filter(index=>index>=0);
assert.equal(targets.length,1,'Locate the inventory-only edit precisely');
const from='inventory.push({id:purchase.uid,name:item?.name??purchase.itemId,detail:item?.effect,compendiumId:item?.compendiumId,';
const to='inventory.push({id:purchase.uid,name:item?.name??purchase.itemId,detail:[item?.effect,purchase.loanEffect].filter(Boolean).join("\\n"),compendiumId:item?.compendiumId,';
lines[targets[0]]=`sub(sheet,${JSON.stringify(from)},${JSON.stringify(to)});`;
const temporary=new URL('./.apply-checked.mjs',import.meta.url);
try{writeFileSync(temporary,lines.join('\n'));await import(temporary.href);}finally{try{unlinkSync(temporary);}catch{}}
await import('./finish.mjs');
