import fs from 'node:fs';
import path from 'node:path';

const ROOT='character-builder/rulesets/terra-umbra/truth/talents';
const rows=[];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else if(entry.isFile()&&entry.name.endsWith('.json')){
      const parsed=JSON.parse(fs.readFileSync(full,'utf8'));
      if(!Array.isArray(parsed)) continue;
      for(const item of parsed){
        if(!item||!item.name||!item.group) continue;
        rows.push({...item,__file:full.replaceAll('\\','/')});
      }
    }
  }
}
walk(ROOT);
const byGroup=new Map();
for(const row of rows){
  if(!byGroup.has(row.group)) byGroup.set(row.group,[]);
  byGroup.get(row.group).push(row);
}
console.log(`TRUTH TALENT GROUPS — ${rows.length} entrées · ${byGroup.size} groupes`);
for(const [group,items] of [...byGroup.entries()].sort((a,b)=>a[0].localeCompare(b[0],'fr'))){
  const files=[...new Set(items.map(item=>item.__file))];
  console.log(`GROUP | ${group} | ${items.length} | ${files.join(',')}`);
  console.log(`  ${items.map(item=>item.name).join(' · ')}`);
}
