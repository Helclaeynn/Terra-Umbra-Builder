import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const list=JSON.parse(readFileSync('/tmp/compact-talents-paths.json','utf8'));
const filename='apps/web/package.json',pkg=JSON.parse(readFileSync(filename,'utf8'));
assert.equal(pkg.scripts['test:reality-talents'],'node tests/reality-talents-integration.mjs');
pkg.scripts['test:reality-talents']+=' && node tests/reality-talents-compact.mjs';
writeFileSync(filename,JSON.stringify(pkg,null,2)+'\n');list.push(filename);
const file='apps/web/src/components/builder/CharacterSummary.vue';let s=readFileSync(file,'utf8');
s=s.replace('<dt>{{ context.label }} · bonus de Talent +{{ context.bonus }}</dt><dd>{{ context.total }}</dd>','<span>{{ context.label }} · bonus de Talent +{{ context.bonus }}</span><strong>{{ context.total }}</strong>');
s=s.replace('.skill-context-total{display:flex;','.sheet-skill-groups dl > div{flex-wrap:wrap}\n.skill-context-total{flex-basis:100%;display:flex;').replace('.skill-context-total dt{','.skill-context-total span{').replace('.skill-context-total dd{','.skill-context-total strong{');
writeFileSync(file,s);
// Presentation was explicitly changed by the author: effect first, optional lore closed.
// Replace the obsolete order assertion with exact content, default visibility and reopening checks.
const selectorTest='apps/web/tests/talent-selector-dom.mjs';let test=readFileSync(selectorTest,'utf8');
const old="assert.match(d.querySelector('.talent-detail').textContent,/Brave.*Lore du talent.*Effet Brave/s);";
assert.equal(test.split(old).length-1,1,'Known old presentation contract');
test=test.replace(old,`assert.match(d.querySelector('.talent-detail').textContent,/Brave.*Effet Brave.*Détails.*Lore du talent/s);
assert.equal(d.querySelector('.talent-detail [data-talent-summary]').textContent,'Effet Brave');
const loreDetails=d.querySelector('.talent-detail .talent-details');
assert.equal(loreDetails.open,false,'Lore is closed while the short effect stays visible');
assert.equal(loreDetails.querySelector('.talent-ambience').textContent,'Lore du talent');
loreDetails.querySelector('summary').click();
await until(()=>loreDetails.open);
assert.equal(loreDetails.querySelector('.talent-ambience').textContent,'Lore du talent','Opening details retains complete lore');
loreDetails.querySelector('summary').click();
await until(()=>!loreDetails.open);`);
writeFileSync(selectorTest,test);list.push(selectorTest);
writeFileSync('/tmp/compact-talents-paths.json',JSON.stringify([...new Set(list)]));
