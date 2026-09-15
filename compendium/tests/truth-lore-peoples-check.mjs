import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function load(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function textOf(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])).join(' ')}

const truth=load('verite');
const legacy=load('lore');
if(truth.length<82)throw new Error(`Vérité: régression sous le socle 82 (${truth.length})`);
if(legacy.length!==392)throw new Error(`392 pages lore consolidées attendues, ${legacy.length}`);
const visible=[...truth,...legacy.filter(page=>page.category==='Vérité')];
const expected=['14. Daemons','16. Aseryns','18. Extrals, Homo Superior et Ad’rak','Talass','Mo’sen','Baséanh','Rocréen','Thalsios','Homo Superior','Ad’rak'];
const batch=visible.filter(page=>page.loreBook?.batch==='peoples-v1');
if(batch.length!==10)throw new Error(`10 pages peuples V6 attendues, ${batch.length}`);
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bDéfense occulte\b|\bdifficult[eé]\s*\d+|\bco[uû]t\s*[:—-]|TUC Talent/i;
for(const title of expected){
  const matches=visible.filter(page=>norm(page.title)===norm(title));
  if(matches.length!==1)throw new Error(`${title}: ${matches.length} page(s) visibles, attendu 1`);
  const page=matches[0];
  if(page.loreBook?.batch!=='peoples-v1')throw new Error(`${title}: batch book-first absent`);
  if(page.source!=='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx')throw new Error(`${title}: source V6 absente`);
  if(!(page.tags||[]).includes('Lore V6'))throw new Error(`${title}: tag Lore V6 absent`);
  if(!page.nav?.group||!page.nav?.subgroup)throw new Error(`${title}: navigation explicite absente`);
  if(forbidden.test(textOf(page)))throw new Error(`${title}: mécanique détectée`);
  if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${title}: table mécanique interdite`);
}
function page(title){return visible.find(item=>norm(item.title)===norm(title))}
function requireSections(title,names){const sections=new Set((page(title).sections||[]).map(section=>section.title));for(const name of names)if(!sections.has(name))throw new Error(`${title}: section manquante ${name}`)}
requireSections('14. Daemons',['Une âme choisie','Les Temples anciens','Après la Guerre céleste','Les Daemons en 2035']);
requireSections('16. Aseryns',['Les Treize','Atlantide, catastrophes et diasporas','Accelyr : une culture à la vitesse du corps','Les Aseryns en 2035']);
requireSections('18. Extrals, Homo Superior et Ad’rak',[
  'Des peuples de l’Histoire galactique',
  'Le GAAC et les communautés terrestres',
  'L’AIDH et Ichéi',
  'Hydroguard et THDF — vivre là où l’environnement tue avant l’ennemi',
  'SMRC et AGI — rendre les corps compatibles',
  'SRA — chercher sans transformer chaque réponse en pouvoir',
  'Émeraude Sanglante — une réponse radicale à l’Armée noire',
  'Une culture terrestre extrale en train de naître'
]);
const extrals=textOf(page('18. Extrals, Homo Superior et Ad’rak'));
for(const needle of ['THDF','SMRC','AGI','Shadow Research Agency','Émeraude Sanglante','Armée noire'])if(!extrals.includes(needle))throw new Error(`Extrals: couverture V6 manquante (${needle})`);
for(const title of ['Talass','Mo’sen','Baséanh','Rocréen','Thalsios','Homo Superior','Ad’rak'])if((page(title).sections||[]).length<3)throw new Error(`${title}: fiche trop mince`);
const adrak=textOf(page('Ad’rak'));if(!/2[,.]60\s*m/i.test(adrak)||!/2[,.]20\s*m/i.test(adrak)||!/Arm[eé]e noire/i.test(adrak))throw new Error('Ad’rak: taille ou contexte Armée noire incomplet');
const homo=textOf(page('Homo Superior'));if(!/restent? Humains?/i.test(homo)||!/AIDH/i.test(homo))throw new Error('Homo Superior: nature humaine/AIDH incomplète');
const extralSpecies=['Talass','Mo’sen','Baséanh','Rocréen','Thalsios'];for(const title of extralSpecies)if(!(page(title).tags||[]).includes('Extrals'))throw new Error(`${title}: tag Extrals absent`);
const ids=new Set();for(const item of [...truth,...legacy]){if(ids.has(item.id))throw new Error(`ID global dupliqué: ${item.id}`);ids.add(item.id)}
console.log(`LORE PEUPLES V6 OK — 10 pages book-first · Vérité ${truth.length} · lore consolidé ${legacy.length} · couverture organisations Extrals verrouillée · aucun doublon ni mécanique.`);
