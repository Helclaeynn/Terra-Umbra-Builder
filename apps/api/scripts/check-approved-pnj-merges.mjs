import assert from 'node:assert/strict';
import pg from 'pg';
import Fastify from 'fastify';
import {APPROVED_PNJ_ALIASES,applyApprovedPnjMerges} from '../dist/compendium-pnj-approved-merges.js';
const primary='pnj-crawlers-docx-dragoslav-memic',alias='pnj-portraits-chasseurs-autres-cai7-kai-sieben';
const map=new Map([[primary,{id:primary,title:'Dragoslav Memic',image:{src:'uploads/chosen.png'},sections:[{id:'section-2',blocks:[{type:'p',text:'Texte principal'}]}]}],[alias,{id:alias,audience:'mj',image:{src:'images/private.webp'},sections:[{id:'section-2',blocks:[{type:'p',text:'Secret secondaire'}]}]}],['nia',{id:'nia',title:'Nia Allen'}],['nina',{id:'nina',title:'Nina Allen'}]]);
applyApprovedPnjMerges(map);assert.equal(map.size,3);assert.equal(map.get(primary).image.src,'uploads/chosen.png');assert.equal(map.get(primary).gallery[0].portraitVisibility,'mj');assert.equal(map.get(primary).sections[1].audience,'mj');applyApprovedPnjMerges(map);assert.equal(map.get(primary).sections.length,2);assert.ok(map.has('nia')&&map.has('nina'));
let published=[];let role='admin';
pg.Pool.prototype.query=async sql=>({rows:String(sql).includes('FROM sessions s')?[{id:'audit',role,is_active:true}]:String(sql).includes('WHERE published IS NOT NULL')?published:[],rowCount:0});
process.env.DATABASE_URL??='postgres://audit:audit@127.0.0.1:1/audit';
const {getCompendiumQualityCorpus,registerCompendiumRoutes,invalidateCompendiumCorpus}=await import('../dist/compendium.js');
const app=Fastify();await registerCompendiumRoutes(app);
const original=await app.inject({url:`/api/compendium/editor/articles/${alias}`,headers:{cookie:'__Host-tuc_session=audit'}});
assert.equal(original.statusCode,200);assert.equal(original.json().article.id,primary);
// The legacy published row is still read under its old base hash, so an
// existing author biography is merged without rewriting that database row.
const {pool}=await import('../dist/db.js');
const source=original.json().article,baseHash=original.json().baseHash;
published=[{articleId:primary,baseHash,published:{...source,sections:[{id:'section-2',title:'Biographie publiée',blocks:[{type:'p',text:'Biographie publiée complémentaire conservée.'}]},{id:'secret',title:'Dossier MJ',audience:'mj',blocks:[{type:'p',text:'SECRET-SECONDARY-ONLY'}]}]}}];
invalidateCompendiumCorpus();let corpus=await getCompendiumQualityCorpus();assert.equal(corpus.databaseEditSummary.applied,1);assert.ok(corpus.articles.find(a=>a.id===primary).sections.some(s=>JSON.stringify(s).includes('Biographie publiée complémentaire')));
for(const [oldId,id] of Object.entries(APPROVED_PNJ_ALIASES)){
 assert.ok(!corpus.articles.some(a=>a.id===oldId));assert.ok(!corpus.navigationIds.includes(oldId));
 for(const path of [`/api/compendium/articles/${oldId}`,`/api/compendium/wiki-preview/${oldId}`]){const r=await app.inject({url:path});assert.equal(r.statusCode,200,r.body);assert.equal(r.json().article?.id??r.json().id,id);assert.ok(!r.body.includes('SECRET-SECONDARY-ONLY'));}
}
const preview=await app.inject({url:`/api/compendium/wiki-preview/${alias}?section=section-2`});assert.equal(preview.statusCode,200,preview.body);assert.ok(preview.json().snippet.includes('Biographie publiée complémentaire'));
const {approvedAliasArticle}=await import('../dist/compendium-pnj-approved-merges.js');assert.equal(approvedAliasArticle(map.get(primary),alias).sections[1].id,'section-2');
for(const q of ['Dragoslav','Feng','Niich','Karamov']){const r=await app.inject({url:`/api/compendium/search?category=Personnages&q=${q}`});assert.equal(r.statusCode,200);assert.equal(r.json().items.filter(a=>Object.values(APPROVED_PNJ_ALIASES).includes(a.id)).length,1);}
assert.ok(corpus.articles.some(a=>a.id==='pnj-portraits-corporations-nia-allen'));assert.ok(corpus.articles.some(a=>a.id==='pnj-temples-daemoniaques-nina-allen'));
await app.close();await pool.end();console.log('APPROVED PNJ MERGES OK — four exact decisions, Nia/Nina separate, old article/editor/section links, published biography, private sources and portraits, unchanged base hashes and idempotence.');
