import fs from 'node:fs';
import zlib from 'node:zlib';
const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const navigation=JSON.parse(fs.readFileSync(`${DATA}/navigation-v1.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent ${id}`);let b='';for(let i=0;i<spec.parts;i++)b+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b,'base64')).toString('utf8'))}
function byId(pages,id){const p=pages.find(x=>x.id===id);if(!p)throw new Error(`Page absente ${id}`);return p}
function flat(p){return [p.title||'',...(p.sections||[]).flatMap(s=>[s.title||'',...(s.blocks||[]).map(b=>b.text||'')])].join(' ')}
const lore=load('lore'),pnj=load('pnj'),truth=load('verite');
let sourceText='';for(let i=0;i<12;i++)sourceText+=fs.readFileSync(`compendium/source/fleaux-focus-2026-09-v1-${String(i).padStart(2,'0')}.jsonpart`,'utf8');
const source=JSON.parse(sourceText);
if(source.schemaVersion!==3||source.plagues?.length!==7||source.profiles?.length!==39)throw new Error('Source Fléaux structurée incomplète');
if(source.plagues.reduce((n,p)=>n+(p.cultes?.length||0),0)!==14)throw new Error('Source Fléaux: 14 cultes attendus');
if(!source.context?.join(' ').includes('Vos cauchemars vous obsèdent')||!source.context?.join(' ').includes('Un Fléau Ancien'))throw new Error('Source Fléaux: couverture/contexte incomplets');
for(const subtitle of ['Roi des fléaux','Reine des fléaux','La famine véritable','Le nœud de la causalité','La mère des Fléaux','Le Fléau de Lovecraft','Le dieu de l’Ombre-Monde'])if(!source.plagues.some(p=>p.subtitle===subtitle))throw new Error(`Sous-titre source absent: ${subtitle}`);
const yegor=source.profiles.filter(p=>p.heading==='Yegor Karamovich').map(p=>p.metadata?.nomRealite);
if(!yegor.includes('Yegor KARAMOV')||!yegor.includes('Arkady KARAMOV'))throw new Error('Les deux profils Karamov ne sont pas distingués par leur identité source');
const newLore=['lore-plagues-cultes-vaagor','lore-plagues-cultes-uxsharith','lore-plagues-cultes-vhodhal','lore-plagues-eden-gris','lore-plagues-mere-primordiale','lore-plagues-sombre-culte'];
const newPnj=['pnj-fleaux-neeba-ngubenani','pnj-fleaux-fredegonda','pnj-fleaux-baldwin-de-vandrick','pnj-fleaux-rolf-de-vandrick','pnj-fleaux-raghnaid-maccalmain','pnj-fleaux-siadara','pnj-fleaux-roi-du-givre','pnj-fleaux-ryong-myung-sook','pnj-fleaux-am-mleeac','pnj-fleaux-dagon','pnj-fleaux-telipinu','pnj-fleaux-r-sheraag','pnj-fleaux-dsherra-neth','pnj-fleaux-pestiria'];
const enrichedPnj=['pnj-083-anastasia-vargas','pnj-100-ombre-pape-valentino-sombra','pnj-101-stephania-volkov','pnj-086-azaliah-springer','pnj-096-noah-brenneman','pnj-098-olayinka-najja','pnj-truth-neals-corvo','pnj-095-mir-a-stephens','pnj-103-tellia-fedirivna-skrypnyk','pnj-089-kennisha-arnold','pnj-091-lidira','pnj-097-nora-shakir','pnj-082-ana-diana-de-la-caza','pnj-105-yegor-karamov','pnj-084-arkady-karamov','pnj-102-sven-scythe','pnj-094-mila-shilove','pnj-093-maximilian-valentin-von-stroheim','pnj-085-arthur-savas','pnj-092-margareta-diaconescu','pnj-104-ulfric-tamer','pnj-090-leona-elliott','pnj-081-aberration-z-87','pnj-099-olla-berwick','pnj-133-grim-grigoria-ravinsky'];
if(lore.length<355||pnj.length<237||truth.length<78)throw new Error(`Comptes sous le socle Fléaux lore=${lore.length} pnj=${pnj.length} vérité=${truth.length}`);
if(manifest.expectedTotal<1890)throw new Error(`Total V3 ${manifest.expectedTotal}, minimum Fléaux 1890`);
for(const id of newLore){const p=byId(lore,id);if(p.category!=='Vérité'||p.nav?.group!=='Corruption & Fléaux'||p.nav?.subgroup!=='Cultes des Fléaux')throw new Error(`${id}: navigation source incohérente`);if((p.sections||[]).length<2)throw new Error(`${id}: page trop mince`);const n=navigation.entries.find(e=>e.id===id);if(!n||n.category!=='Vérité'||n.group!=='Corruption & Fléaux'||n.subgroup!=='Cultes des Fléaux')throw new Error(`${id}: navigation publiée absente`)}
for(const id of newPnj){const p=byId(pnj,id);if(p.category!=='Personnages'||p.pnj?.completeness!=='detailed')throw new Error(`${id}: fiche PNJ incomplète`);if(!(p.sections||[]).some(s=>s.id==='fleaux-focus-dossier'))throw new Error(`${id}: dossier source absent`);if(p.stats||p.pnj?.stats)throw new Error(`${id}: statistiques inventées dans une passe lore-only`)}
for(const id of enrichedPnj){const p=byId(pnj,id);if(!(p.sections||[]).some(s=>String(s.id).startsWith('fleaux-focus-')))throw new Error(`${id}: enrichissement Focus Fléaux absent`)}
for(const id of ['lore-plagues-contexte','lore-plagues-vhodhal-nactru','lore-plagues-mloxol-vaagor','lore-plagues-uxsharith-bellatheis','lore-plagues-cthath-vhadhi','lore-plagues-gajh-shaoggith','lore-plagues-kthuhuthlul','lore-plagues-delanial']){const p=byId(lore,id);if(!(p.sections||[]).some(s=>String(s.id).startsWith('fleaux-focus-')))throw new Error(`${id}: dossier Focus Fléaux absent`)}
for(const id of ['verite-056-20-corruption','verite-057-21-les-six-fleaux-et-le-faux-septieme']){const p=byId(truth,id);if(!(p.sections||[]).some(s=>String(s.id).startsWith('fleaux-focus-')))throw new Error(`${id}: enrichissement source absent`)}
const vaagor=flat(byId(lore,'lore-plagues-mloxol-vaagor'));for(const needle of ['Mloxol','Roi des fléaux','Ombre-Pape'])if(!vaagor.includes(needle))throw new Error(`V’Aagor: détail absent ${needle}`);
const sombre=flat(byId(lore,'lore-plagues-sombre-culte'));for(const needle of ['Dagon','Telipinu','R’Sheraag',"Dsherra'neth",'Peste des vases','Grim'])if(!sombre.includes(needle))throw new Error(`Sombre Culte: figure absente ${needle}`);
const context=flat(byId(lore,'lore-plagues-contexte'));for(const needle of ['Fléau Ancien','Fléaux supérieurs','Abominations supérieures','Néant'])if(!context.includes(needle))throw new Error(`Contexte Fléaux: ${needle} absent`);
for(const p of [...newLore.map(id=>byId(lore,id)),...newPnj.map(id=>byId(pnj,id))])if(JSON.stringify(p).match(/\.(?:png|jpe?g|webp|gif)/i))throw new Error(`${p.id}: image ajoutée alors que la passe est lore-only`);
console.log('FLÉAUX FOCUS 2026-09 OK — 6 pages de cultes + 14 PNJ nouveaux + 25 PNJ enrichis + 10 pages centrales enrichies, sans images.');
