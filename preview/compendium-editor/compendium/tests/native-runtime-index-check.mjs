import fs from 'node:fs';
import zlib from 'node:zlib';
import {articleHash} from '../editor/override-engine.js';
import {applyCommittedOverridesToMap} from '../editor/native-overrides.js';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const articles=new Map();
for(const spec of manifest.datasets){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
  for(const row of rows){
    if(!row?.id)continue;
    row.dataset=row.dataset||spec.id;
    articles.set(row.id,row);
  }
}
if(articles.size!==manifest.expectedTotal)throw new Error(`Corpus de test incomplet: ${articles.size}/${manifest.expectedTotal}`);

const flattenText=article=>{
  const bits=[article.title,article.source||'',...(article.tags||[])];
  if(article.pnj){
    const p=article.pnj;
    bits.push(p.nom_verite||'',p.race||'',p.age||'',p.origine||'',p.statut||'',p.statut_verite||'',...(p.relations||[]));
  }
  for(const section of article.sections||[]){
    bits.push(section.title||'');
    for(const block of section.blocks||[]){
      if(block.type==='p')bits.push(block.text||'');
      else if(block.type==='table')for(const row of block.rows||[])bits.push(...row);
    }
  }
  return bits.join(' ').toLowerCase();
};

const marker='zzoverrideindexprobe';
if([...articles.values()].some(article=>flattenText(article).includes(marker)))throw new Error('Le marqueur de test existe déjà dans le corpus.');
const base=[...articles.values()].find(article=>article.sections?.length)||[...articles.values()][0];
const hash=await articleHash(base);
const payload={version:1,entries:[{
  articleId:base.id,
  baseHash:hash,
  updatedAt:new Date().toISOString(),
  note:'Test synthétique CI',
  operations:[
    {op:'replace',path:'/title',value:`${base.title} ${marker}`},
    {op:'replace',path:'/tags',value:[...(base.tags||[]),marker]},
  ],
}]};

const summary=await applyCommittedOverridesToMap(articles,payload,{strict:true});
if(summary.applied!==1)throw new Error(`Override synthétique non appliqué: ${summary.applied}`);
const effective=articles.get(base.id);
if(!effective.__editorialOverride)throw new Error('Marqueur __editorialOverride absent.');
if(!flattenText(effective).includes(marker))throw new Error('Le contenu édité n’est pas indexable par flattenText.');
const searchHits=[...articles.values()].filter(article=>flattenText(article).includes(marker));
if(searchHits.length!==1||searchHits[0].id!==base.id)throw new Error(`Recherche synthétique incohérente: ${searchHits.length} résultat(s).`);
if(effective.category!==base.category||effective.id!==base.id)throw new Error('L’override a altéré un champ structurel protégé.');

console.log(`Native runtime index OK: ${base.id} devient recherchable via override sans modifier le corpus source.`);
