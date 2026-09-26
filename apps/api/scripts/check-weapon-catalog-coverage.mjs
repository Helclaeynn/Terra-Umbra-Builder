import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {copyFile,mkdir,mkdtemp,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../../',import.meta.url)).replace(/\/$/,'');
const readJson=async file=>JSON.parse(await readFile(file,'utf8'));
const normal=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const isWeapon=category=>String(category??'').startsWith('Armes — ');
const rulesRoot=await mkdtemp(join(tmpdir(),'tuc-weapon-coverage-'));
process.env.DATABASE_URL??='postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=join(root,'compendium/data');
process.env.COMPENDIUM_MEDIA_DIR=join(root,'compendium');
process.env.TUC_REALITY_RULES_ROOT=rulesRoot;
await copyFile(join(root,'compendium/source/current-equipment-catalog-v1.json'),join(rulesRoot,'current-equipment-catalog-v1.json'));
await copyFile(join(root,'character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64'),join(rulesRoot,'augmentations.json.gz.b64'));
await mkdir(join(rulesRoot,'lore'));
for(const filename of await readdir(join(root,'compendium/source'))){
  if(/^reality-lore-v3-.*\.json$/.test(filename))await copyFile(join(root,'compendium/source',filename),join(rulesRoot,'lore',filename));
}
process.chdir(join(root,'apps/api'));
const {pool}=await import(join(root,'apps/api/dist/db.js'));
pool.query=async sql=>{
  if(/FROM compendium_custom_articles|FROM compendium_portrait_visibility|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles|FROM compendium_deleted_articles/.test(String(sql)))return {rows:[]};
  throw new Error('Unexpected DB query: '+sql);
};
const {getRealityRules}=await import(join(root,'apps/api/dist/rules/reality.js'));
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(join(root,'apps/api/dist/compendium.js'));
const {default:Fastify}=await import(join(root,'apps/api/node_modules/fastify/fastify.js'));
const app=Fastify();
try{
  await registerCompendiumRoutes(app);
  const current=(await readJson(join(rulesRoot,'current-equipment-catalog-v1.json'))).catalog.entries;
  const source=await readJson(join(root,'compendium/source/sharp-weapons-restoration-v1.json'));
  const added=source.entries.filter(item=>item.disposition==='add');
  const preserved=source.entries.filter(item=>item.disposition==='preserve');
  assert.equal(added.length,11);
  assert.equal(preserved.length,5);
  const runtime=getRealityRules().equipment;
  const weapons=runtime.filter(item=>isWeapon(item.sourceCategory));
  const {articles}=await getCompendiumQualityCorpus();
  const pages=articles.filter(article=>isWeapon(article.catalog?.category));
  assert.equal(weapons.length,124,'Les 113 armes existantes et les 11 ajouts doivent atteindre le Builder.');
  assert.equal(pages.length,weapons.length,'Toute arme du catalogue doit atteindre le Builder, et réciproquement.');
  assert.equal(new Set(weapons.map(item=>item.id)).size,weapons.length,'Aucun identifiant d’arme dupliqué.');
  for(const page of pages){
    const matches=weapons.filter(item=>item.id===page.catalog.id);
    assert.equal(matches.length,1,`${page.id}: fiche sans correspondance unique dans le Builder`);
    const item=matches[0],canonical=current.find(row=>row.id===item.id);
    assert.ok(canonical,item.id);
    assert.deepEqual(item.data,canonical.data,`${item.id}: statistiques perdues pendant le chargement API`);
    assert.equal(item.price,canonical.price??canonical.priceMin??null,`${item.id}: prix divergent`);
    const cells=page.sections.flatMap(section=>section.blocks??[]).filter(block=>block.type==='table').flatMap(block=>(block.rows??[]).flat()).map(normal);
    assert.ok(cells.includes(normal(item.priceLabel)),`${page.id}: prix ou condition d’acquisition absent de la fiche`);
    for(const [key,value] of Object.entries(item.data)){
      if(value==null||!normal(value))continue;
      assert.ok(cells.includes(normal(value)),`${page.id}: ${key}=${value} absent des règles de la fiche`);
    }
    const media=page.illustration??page.image;
    assert.ok(media?.src&&!/placeholder/i.test(media.src),`${page.id}: illustration manquante`);
  }
  for(const item of preserved){
    const actual=current.find(row=>row.id===item.catalogId);
    assert.deepEqual(actual,item.builder,`${item.name}: l’arbitrage de conservation des valeurs existantes doit être respecté`);
  }
  for(const item of added){
    const actual=weapons.find(row=>row.id===item.catalogId);
    assert.ok(actual.lore.trim(),`${item.name}: lore absent du Builder`);
    const page=pages.find(row=>row.id===item.articleId);
    assert.ok(page,item.articleId);
    assert.equal(page.illustration?.src,item.illustration.src,item.articleId);
    const response=await app.inject({method:'GET',url:'/api/compendium/media/'+item.illustration.src});
    assert.equal(response.statusCode,200,item.articleId);
    assert.match(response.headers['content-type'],/image\/webp/,item.articleId);
    assert.deepEqual(response.rawPayload,await readFile(join(root,'compendium',item.illustration.src)),item.articleId);
    if(item.illustration.sha256)assert.equal(createHash('sha256').update(response.rawPayload).digest('hex'),item.illustration.sha256,item.articleId);
  }
  const stretchy=weapons.find(item=>item.id==='armes-melee-stretchy');
  assert.ok(stretchy,'Stretchy manquant');
  assert.equal(stretchy.price,700);
  assert.equal(stretchy.data.DGT,'6');
  assert.equal(stretchy.data['Cap.'],'4');
  const restricted=weapons.filter(item=>/mission|special/.test(normal(item.priceLabel)));
  assert.equal(restricted.length,12,'Les onze armes spéciales et New Partisan restent conditionnelles.');
  assert.ok(restricted.every(item=>item.price===null),'Mission/Spécial ne doit jamais devenir un prix gratuit.');
  console.log(`WEAPON COVERAGE OK — ${weapons.length} armes Compendium/Builder, règles complètes, ${added.length} nouvelles illustrations servies, cinq valeurs existantes conservées, Stretchy et conditions Mission/Spécial.`);
}finally{
  await app.close();
  await pool.end();
  await rm(rulesRoot,{recursive:true,force:true});
}
