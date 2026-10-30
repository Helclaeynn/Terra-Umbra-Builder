import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const connection=new URL(process.env.DATABASE_URL);connection.searchParams.set('options','-c default_transaction_read_only=on');process.env.DATABASE_URL=connection.toString();
const {pool}=await import('./dist/db.js');const {default:Fastify}=await import('fastify');const {registerCompendiumRoutes,getCompendiumQualityCorpus}=await import('./dist/compendium.js');const {APPROVED_PNJ_ALIASES}=await import('./dist/compendium-pnj-approved-merges.js');
const baseline=JSON.parse(readFileSync('/app/merge-baseline.json','utf8'));const corpus=await getCompendiumQualityCorpus();assert.equal(corpus.articles.length,baseline.total-4);assert.deepEqual(corpus.databaseEditSummary,baseline.databaseEdits);
const app=Fastify();await registerCompendiumRoutes(app);
for(const [oldId,id] of Object.entries(APPROVED_PNJ_ALIASES)){
 assert.ok(!corpus.articles.some(a=>a.id===oldId));assert.ok(corpus.articles.some(a=>a.id===id));
 const r=await app.inject({url:`/api/compendium/articles/${oldId}`});assert.equal(r.statusCode,200,r.body);assert.equal(r.json().article.id,id);
}
for(const id of ['pnj-portraits-corporations-nia-allen','pnj-temples-daemoniaques-nina-allen'])assert.ok(corpus.articles.some(a=>a.id===id));
const drag=corpus.articles.find(a=>a.id==='pnj-crawlers-docx-dragoslav-memic');assert.ok(drag.sections.some(s=>s.id==='merged-pnj-portraits-chasseurs-autres-cai7-kai-sieben-section-2'),'Production secondary published biography retained');assert.ok(drag.image.src.includes('uploads/'),'Author chosen portrait retained');assert.ok(drag.gallery.some(m=>m.src.includes('portrait-04-010')),'Additional portrait retained');
for(const path of ['/api/compendium/meta','/api/compendium/wiki-index?compact=1','/api/compendium/search?q=Dragoslav']){const r=await app.inject({url:path});assert.equal(r.statusCode,200,r.body);}
await app.close();await pool.end();console.log(JSON.stringify({result:'APPROVED PNJ PRODUCTION READONLY CHECK PASSED',total:corpus.articles.length,merged:4,databaseEdits:corpus.databaseEditSummary,niaNinaSeparate:true,publishedBiographyPreserved:true}));
