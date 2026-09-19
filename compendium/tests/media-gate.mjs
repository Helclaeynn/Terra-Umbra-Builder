import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const compendium=path.join(root,'compendium');
const manual=fs.readFileSync(path.join(compendium,'manual-media.js'),'utf8');
const overrides=JSON.parse(fs.readFileSync(path.join(compendium,'data','manual-overrides.json'),'utf8'));
const navigation=JSON.parse(fs.readFileSync(path.join(compendium,'data','navigation-v1.json'),'utf8'));
const guides=fs.readFileSync(path.join(compendium,'guide-articles.js'),'utf8');
const imageRoot=path.join(compendium,'images','manual');

const refs=new Set();
for(const match of manual.matchAll(/images\/manual\/[^'"\`\s)]+/g))refs.add(match[0]);
for(const entry of overrides.entries||[])for(const operation of entry.operations||[]){
  const text=JSON.stringify(operation.value??'');
  for(const match of text.matchAll(/images\/manual\/[^"\\\s]+/g))refs.add(match[0]);
}
const files=[];
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isDirectory())walk(full);else files.push(path.relative(compendium,full).replaceAll(path.sep,'/'));}}
walk(imageRoot);
const fileSet=new Set(files);
const missing=[...refs].filter(ref=>!fileSet.has(ref)).sort();
const orphans=files.filter(file=>!refs.has(file)).sort();
const validIds=new Set((navigation.entries||[]).map(entry=>entry.id).filter(Boolean));
for(const match of guides.matchAll(/\bid\s*:\s*['"]([^'"]+)['"]/g))validIds.add(match[1]);
const manualIds=[...manual.matchAll(/^\s*'([^']+)'\s*:\s*\{/gm)].map(match=>match[1]);
const unknownMappings=manualIds.filter(id=>!validIds.has(id)).sort();
const report={generatedAt:new Date().toISOString(),manualFiles:files.length,references:refs.size,missing,orphans,unknownMappings};
fs.writeFileSync('/tmp/tuc-media-audit.json',JSON.stringify(report,null,2)+'\n');
if(missing.length||orphans.length||unknownMappings.length){
  console.error(JSON.stringify(report,null,2));
  throw new Error(`Media Gate failed: ${missing.length} missing, ${orphans.length} orphan(s), ${unknownMappings.length} unknown mapping(s)`);
}
console.log(`MEDIA GATE OK — ${files.length} fichiers, ${refs.size} références, 0 manquant, 0 orphelin, 0 mapping inconnu.`);
