import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const navigation=JSON.parse(fs.readFileSync(`${DATA}/navigation-v1.json`,'utf8'));
const navById=new Map((navigation.entries||[]).map(entry=>[entry.id,entry]));

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
  return rows.map(page=>({...page,dataset:page.dataset||spec.id,sourceCategory:page.category}));
}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function organisationRealm(article){
  const tags=(article?.tags||[]).map(norm);
  if(tags.includes('verite'))return 'Vérité';
  if(tags.includes('realite'))return 'Réalité';
  const text=norm(`${article?.title||''} ${(article?.tags||[]).join(' ')} ${article?.source||''}`);
  if(/vampir|garou|loup garou|mage|daemon|angelus|aseryn|atlante|exile|extral|chasseur|fleau|occulte|khinae/.test(text))return 'Vérité';
  return 'Réalité';
}
function displayCategory(page){return page.sourceCategory==='Organisations'?organisationRealm(page):page.sourceCategory}
function flatten(page){
  const bits=[];
  for(const section of page.sections||[]){
    bits.push(section?.title||'');
    for(const block of section?.blocks||[]){
      if(block?.type==='p')bits.push(block.text||'');
      else if(block?.type==='table')for(const row of block.rows||[])bits.push(...row);
    }
  }
  return norm(bits.join(' '));
}
function shingles(text,n=5){
  const words=text.split(' ').filter(Boolean);const set=new Set();
  for(let i=0;i<=words.length-n;i++)set.add(words.slice(i,i+n).join(' '));
  return set;
}
function jaccard(a,b){if(!a.size||!b.size)return 0;let inter=0;const small=a.size<=b.size?a:b,big=small===a?b:a;for(const value of small)if(big.has(value))inter++;return inter/(a.size+b.size-inter)}
function hash(text){return crypto.createHash('sha256').update(text).digest('hex')}

const pages=manifest.datasets.flatMap(loadDataset).filter(page=>['Réalité','Vérité'].includes(displayCategory(page)));
const byCategory=new Map([['Réalité',[]],['Vérité',[]]]);
for(const page of pages){page.virtualCategory=displayCategory(page);page._text=flatten(page);page._shingles=shingles(page._text);byCategory.get(page.virtualCategory).push(page)}

const report={generated:new Date().toISOString(),categories:{},genericOrganisations:[]};
for(const category of ['Réalité','Vérité']){
  const rows=byCategory.get(category);
  const titleMap=new Map(),contentMap=new Map(),similar=[];
  for(const page of rows){
    const nt=norm(page.title);if(nt){if(!titleMap.has(nt))titleMap.set(nt,[]);titleMap.get(nt).push(page)}
    if(page._text.length>=80){const h=hash(page._text);if(!contentMap.has(h))contentMap.set(h,[]);contentMap.get(h).push(page)}
  }
  for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
    const a=rows[i],b=rows[j];if(a._text.length<180||b._text.length<180)continue;
    const score=jaccard(a._shingles,b._shingles);
    if(score>=0.45)similar.push({score:Number(score.toFixed(3)),a:{id:a.id,title:a.title,sourceCategory:a.sourceCategory},b:{id:b.id,title:b.title,sourceCategory:b.sourceCategory}});
  }
  similar.sort((a,b)=>b.score-a.score);
  const titleDuplicates=[...titleMap.entries()].filter(([,items])=>items.length>1).map(([title,items])=>({title,items:items.map(p=>({id:p.id,title:p.title,sourceCategory:p.sourceCategory}))}));
  const contentDuplicates=[...contentMap.entries()].filter(([,items])=>items.length>1).map(([fingerprint,items])=>({fingerprint,items:items.map(p=>({id:p.id,title:p.title,sourceCategory:p.sourceCategory}))}));
  report.categories[category]={pages:rows.length,titleDuplicates,contentDuplicates,highOverlap:similar.slice(0,80)};
  console.log(`\n${category.toUpperCase()} — ${rows.length} pages virtuelles`);
  console.log(`  Titres dupliqués: ${titleDuplicates.length}`);
  console.log(`  Contenus identiques: ${contentDuplicates.length}`);
  console.log(`  Recouvrements >= 0.45: ${similar.length}`);
  for(const pair of similar.slice(0,30))console.log(`  OVERLAP ${pair.score} | ${pair.a.id} :: ${pair.a.title} <-> ${pair.b.id} :: ${pair.b.title}`);
  for(const dup of titleDuplicates)console.log(`  TITLE DUP | ${dup.items.map(x=>`${x.id} :: ${x.title}`).join(' <-> ')}`);
  for(const dup of contentDuplicates)console.log(`  CONTENT DUP | ${dup.items.map(x=>`${x.id} :: ${x.title}`).join(' <-> ')}`);
}

const organisations=pages.filter(page=>page.sourceCategory==='Organisations');
for(const page of organisations){
  const nav=navById.get(page.id);const navText=norm(`${nav?.group||''} ${nav?.subgroup||''}`);
  if(/autre organisation|autres organisations|divers/.test(navText)){
    const item={category:page.virtualCategory,id:page.id,title:page.title,tags:page.tags||[],source:page.source||'',group:nav?.group||'',subgroup:nav?.subgroup||''};
    report.genericOrganisations.push(item);
  }
}
console.log(`\nORGANISATIONS EN FOURRE-TOUT — ${report.genericOrganisations.length}`);
for(const item of report.genericOrganisations)console.log(`  ${item.category} | ${item.id} | ${item.title} | tags=${item.tags.join(' > ')||'—'} | ${item.group} > ${item.subgroup}`);

fs.mkdirSync('compendium/audits',{recursive:true});
fs.writeFileSync('compendium/audits/reality-truth-internal-v1.json',JSON.stringify(report,null,2)+'\n','utf8');
console.log('\nAudit Réalité/Vérité interne terminé.');
