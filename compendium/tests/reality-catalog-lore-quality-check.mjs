import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const IDS=['equipement','augmentations'];
const LIMIT=0.60;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const words=value=>norm(value).split(/\s+/).filter(Boolean);
const stop=new Set('le la les un une des du de d au aux et ou a en dans sur pour par avec sans son sa ses ce cet cette ces il elle ils elles est sont etre plus moins que qui se ne pas comme entre vers tout toute tous toutes leur leurs meme ainsi afin alors donc'.split(' '));
const forbidden=[
  /dans les vitrines, ateliers et réseaux spécialisés/i,/son nom circule surtout chez/i,/il est surtout recherché par/i,/on le rencontre principalement chez/i,
  /sa présence dit autant du niveau de risque/i,/du milieu dans lequel son porteur évolue/i,/l’investissement devient suffisamment important pour être réfléchi/i,
  /effet documenté/i,/montant de référence/i,/tarification indiquée/i,/prix de référence retenu/i,/figure dans la catégorie/i,/appartient à la catégorie/i,
  /aucun effet ni propriété supplémentaire/i,/seules? sa catégorie et sa tarification/i,/\bprice ?(?:mode|label|min|max)\b/i
];
function load(spec){let b64='';for(let i=0;i<spec.parts;i++){const p=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;if(!fs.existsSync(p))throw new Error(`${spec.id}: fragment absent ${p}`);b64+=fs.readFileSync(p,'utf8').replace(/\s+/g,'');}const sha=crypto.createHash('sha256').update(b64).digest('hex');if(sha!==spec.sha256)throw new Error(`${spec.id}: SHA ${sha} != ${spec.sha256}`);return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));}
function context(page){const s=(page.sections||[]).find(s=>s.id==='contexte');return (s?.blocks||[]).filter(b=>b.type==='p'&&String(b.text||'').trim());}
function rows(page){return (page.sections||[]).flatMap(s=>(s.blocks||[]).filter(b=>b.type==='table').flatMap(b=>b.rows||[]));}
function shingleSet(text,title=''){const titleWords=new Set(words(title));const w=words(text).filter(x=>!titleWords.has(x));const out=new Set();for(let i=0;i<=w.length-4;i++)out.add(w.slice(i,i+4).join(' '));return out;}
function jaccard(a,b){if(!a.size||!b.size)return 0;let common=0;for(const x of a)if(b.has(x))common++;return common/(a.size+b.size-common);}
function extraVocabulary(page,text){const mech=new Set([...words(page.title),...rows(page).flatMap(r=>Array.isArray(r)?r.flatMap(words):[])]);return new Set(words(text).filter(w=>w.length>3&&!stop.has(w)&&!mech.has(w)));}
function assertContains(page,needles){if(!page)throw new Error(`Page de contrôle absente: ${needles.join(', ')}`);const text=norm(context(page).map(b=>b.text).join(' '));for(const needle of needles)if(!text.includes(norm(needle)))throw new Error(`${page.title}: apport diégétique attendu absent (${needle})`);}

const all=[];const byTitle=new Map();let sourceDriven=0,derived=0,augmentations=0;
for(const id of IDS){
  const spec=manifest.datasets.find(x=>x.id===id);if(!spec)throw new Error(`${id}: dataset absent`);
  if(spec.quality?.loreVersion!==3||Number(spec.quality?.maxIdenticalTextRatio)!==LIMIT||spec.quality?.method!=='reality-book-semantic-lore')throw new Error(`${id}: métadonnées lore V3 absentes ou incohérentes`);
  for(const page of load(spec)){
    const blocks=context(page),text=blocks.map(b=>String(b.text||'')).join(' '),grounding=page.catalog?.loreGrounding;
    if(blocks.length!==2)throw new Error(`${page.title}: ${blocks.length} paragraphes, attendu 2`);
    if(page.catalog?.loreVersion!==3||page.catalog?.loreMethod!=='reality-book-semantic-lore')throw new Error(`${page.title}: traçabilité lore V3 absente`);
    if(text.length<150)throw new Error(`${page.title}: contexte trop pauvre (${text.length})`);
    if(/\$/.test(text))throw new Error(`${page.title}: le lore répète encore un prix`);
    for(const re of forbidden)if(re.test(text))throw new Error(`${page.title}: reformulation technique/générique interdite (${re})`);
    const extra=extraVocabulary(page,text);if(extra.size<10)throw new Error(`${page.title}: moins de 10 termes substantifs absents du tableau (${[...extra].join(', ')})`);
    const psets=blocks.map(b=>shingleSet(b.text,page.title));if(jaccard(psets[0],psets[1])>LIMIT)throw new Error(`${page.title}: paragraphes internes trop similaires`);
    if(grounding==='derived')derived++;else if(grounding==='augmentation')augmentations++;else sourceDriven++;
    if(!['book','curated','book-context','neuro-book','derived','augmentation'].includes(grounding))throw new Error(`${page.title}: loreGrounding V3 invalide (${grounding})`);
    const item={page,set:shingleSet(text,page.title)};all.push(item);byTitle.set(norm(page.title),page);
  }
}

const sparseSource=JSON.parse(fs.readFileSync('compendium/source/reality-lore-v3-sparse.json','utf8')).entries||{};
for(const title of Object.keys(sparseSource)){const page=byTitle.get(norm(title));if(!page)throw new Error(`Source V8 non reliée au Compendium: ${title}`);if(!['book','book-context'].includes(page.catalog?.loreGrounding))throw new Error(`${title}: source V8 non utilisée (${page.catalog?.loreGrounding})`);}
const neuroSource=JSON.parse(fs.readFileSync('compendium/source/reality-lore-v3-neuro.json','utf8')).entries||{};
for(const title of Object.keys(neuroSource)){const page=byTitle.get(norm(title));if(!page)throw new Error(`Neuroprogramme V8 absent: ${title}`);if(page.catalog?.loreGrounding!=='neuro-book')throw new Error(`${title}: lore Neuro V8 non utilisé`);}

assertContains(byTitle.get('bastion'),['mitrailleuse lourde','60','appui','bande bastion']);
assertContains(byTitle.get('bande bastion'),['60','mitrailleuse lourde','bastion','alimentation']);
assertContains(byTitle.get('2 fence'),['deux agents humanoides','interception','dix minutes','reinitialisation']);
assertContains(byTitle.get('hellstorm'),['gatling','200','suppression']);
assertContains(byTitle.get('bull executive'),['train de vie aise','abonnement','mobilite']);

let worst={ratio:0,a:'',b:''};
for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
  const ratio=jaccard(all[i].set,all[j].set);if(ratio>worst.ratio)worst={ratio,a:all[i].page.title,b:all[j].page.title};
  if(ratio>LIMIT)throw new Error(`Lore Réalité >60% similaire (Jaccard ${(ratio*100).toFixed(1)}%): ${all[i].page.title} / ${all[j].page.title}`);
}
console.log(`Lore Réalité V3 OK — ${all.length} pages · ${sourceDriven} source/book · ${derived} dérivées · ${augmentations} augmentations · max ${(worst.ratio*100).toFixed(1)}% (${worst.a} / ${worst.b}) · chaque page apporte du vocabulaire absent de son tableau.`);
