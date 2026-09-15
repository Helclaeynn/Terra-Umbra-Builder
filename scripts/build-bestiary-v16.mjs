import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const spec=manifest.datasets.find(x=>x.id==='bestiaire');
if(!spec)throw new Error('Bestiaire absent du manifeste');

let base64='';
for(let i=0;i<spec.parts;i++)base64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
const rows=JSON.parse(zlib.gunzipSync(Buffer.from(base64,'base64')).toString('utf8'));
if(rows.length!==262)throw new Error(`Base inattendue: ${rows.length}`);

const enrichment={};
for(const file of [
  'enrich-01-revenants.json',
  'enrich-02-ombres-fees.json',
  'enrich-03-metamorphes-faune.json',
  'enrich-04-ruptures.json',
  'enrich-05-figures-reliques.json',
  'enrich-06-cleanups.json'
]) Object.assign(enrichment,JSON.parse(fs.readFileSync(`${DATA}/.working/${file}`,'utf8')));

const chapter2=rows.filter(r=>String(r.bestiary?.chapter||'').startsWith('2.'));
if(chapter2.length!==131)throw new Error(`Chapitre Vérité inattendu: ${chapter2.length}`);
const missing=chapter2.filter(r=>!enrichment[r.id]).map(r=>r.id);
if(missing.length)throw new Error(`Enrichissements manquants: ${missing.join(', ')}`);

for(const row of chapter2){
  const patch=enrichment[row.id];
  const section=(row.sections||[]).find(s=>s.id==='description');
  if(!section)throw new Error(`Description absente: ${row.id}`);
  const blocks=texts=>texts.map(text=>({type:'p',style:'lore',text}));
  if(Array.isArray(patch.replace))section.blocks=blocks(patch.replace);
  else if(Array.isArray(patch.append))section.blocks=[...(section.blocks||[]),...blocks(patch.append)];
  else throw new Error(`Patch invalide: ${row.id}`);
  row.status='canon_enrichi';
}

const dive={
  id:'bestiaire-v16-dive',title:'Dive',category:'Bestiaire',
  source:'TUC Bestiaire V16 enrichi — 15 septembre 2026',status:'canon_enrichi',audience:'player',
  tags:['2.2 Ombres et entités de l’Ombremonde','Voyageurs','VÉRITÉ','VOYAGEUR','TITAN','MAGEIUS'],
  illustration:{src:'assets/bestiary-placeholder.svg',alt:'Illustration à venir — Dive',caption:'Illustration à venir'},
  bestiary:{chapter:'2.2 Ombres et entités de l’Ombremonde',family:'Voyageurs',subfamily:'',role:'VÉRITÉ • VOYAGEUR • TITAN • MAGEIUS',hook:'Un Dive ordinaire est déjà une puissance ancienne. Les grands noms de leurs lignées dépassent ce profil et doivent être traités comme des figures majeures.'},
  sections:[
    {id:'description',title:'Description',level:2,blocks:[
      {type:'p',style:'lore',text:'Les Dives comptent parmi les plus anciens Voyageurs de la Terre. Titans, ogres, géants ou ashuras sont autant de noms donnés par les peuples qui les ont rencontrés sans toujours comprendre qu’ils observaient des lignées parentes. Leur taille et leur puissance physique ont nourri ces récits, mais leur véritable singularité vient du lien extraordinairement profond qui unit leur chair à un Mageius.'},
      {type:'p',style:'lore',text:'À l’époque où les frontières entre les mondes étaient plus souples, des Dives régnaient sur des territoires et des dimensions propres. Leurs guerres avec les Dieux Anciens, leurs alliances avec les Amazones et leurs rivalités avec les premiers Mages ont laissé des traces dans des mythes très éloignés les uns des autres. La fusion des anciens mondes, les massacres et les scellements ont dispersé les survivants ; beaucoup dorment encore dans des lieux que leurs ennemis avaient précisément conçus pour qu’ils ne puissent jamais revenir.'},
      {type:'p',style:'lore',text:'Plusieurs lignées célèbres se rattachent à Ymir sans que tous les Dives descendent de lui. Angrboda régna au nord, Grendel combattit aux côtés des Hyperboréens, Brimhild perdit son Mageius au profit d’un conquérant vampirique et Ravana, roi de l’Est, fit trembler les premiers Mages avant d’être scellé par Anahita. Ces noms rappellent surtout qu’un Dive rencontré aujourd’hui n’est pas nécessairement un monstre égaré : il peut être l’héritier d’une histoire commencée avant la plupart des civilisations humaines.'}
    ]},
    {id:'dossier-mj',title:'Dossier MJ · Profil, hook & informations',level:2,audience:'mj',blocks:[
      {type:'p',style:'spec',text:'CLASSIFICATION — 2.2 Ombres et entités de l’Ombremonde › Voyageurs'},
      {type:'p',style:'spec',text:'RÔLE — VÉRITÉ • VOYAGEUR • TITAN • MAGEIUS'},
      {type:'p',style:'spec',text:'MOUVEMENT 8 m  •  ACTIONS 3 PA  •  INITIATIVE 1d10e + 12'},
      {type:'p',style:'spec',text:'PERCEPTION 1d10e + 13  •  MAÎTRISE 1d10e + 15'},
      {type:'p',style:'spec',text:'DÉF. PHYSIQUE 12 (+1d10e active)  •  DÉF. OCCULTE 15 (+1d10e active)  •  PV 34  •  ARMURE 4'},
      {type:'p',style:'list',text:'ATTAQUE — Frappe titanesque — 1d10e + 15 • DGT 8 • Contact'},
      {type:'p',style:'list',text:'ATTAQUE — Décharge du Mageius — 1d10e + 14 vs Déf. occulte • DGT 6 occulte • portée 20 m'},
      {type:'p',style:'list',text:'TESTS UTILES — Athlétisme +14 • Savoirs +12 • Perception +13'},
      {type:'p',style:'list',text:'CAPACITÉ / INFO MJ — Mageius inné — Choisir 2 ou 3 manifestations propres à l’individu : force élémentaire, altération de matière, perception, déplacement ou autre expression cohérente. Elles utilisent 1d10e + 14 contre la Défense appropriée et doivent rester définies avant la confrontation.'},
      {type:'p',style:'list',text:'CAPACITÉ / INFO MJ — Force de titan — Le Dive traite comme ordinaires les efforts physiques qui demanderaient normalement plusieurs humains : défoncer une porte renforcée, déplacer une masse lourde ou maintenir un adversaire humain. Quand un jet reste nécessaire, utiliser ses valeurs normales plutôt qu’une réussite automatique.'},
      {type:'p',style:'list',text:'CAPACITÉ / INFO MJ — Voyageur des anciens plans — Peut franchir une frontière planaire lorsqu’un passage, un rite ou une condition réelle existe. Ce pouvoir ne fournit pas une téléportation tactique gratuite à chaque action.'},
      {type:'p',style:'list',text:'CAPACITÉ / INFO MJ — Longévité ancienne — Vieillit extrêmement lentement et résiste aux maladies ordinaires, mais n’est pas immortel par défaut. Les Dives royaux ou héroïques peuvent posséder des protections particulières.'},
      {type:'p',style:'callout',text:'FAIBLESSE / LIMITE — Lien au Mageius — Séparer, emprisonner ou blesser le Mageius d’un Dive est possible par des moyens occultes exceptionnels. Une telle atteinte réduit d’abord ses manifestations magiques et constitue un traumatisme majeur ; elle ne le tue pas automatiquement.'},
      {type:'p',style:'callout',text:'FAIBLESSE / LIMITE — Famine Blanche — Un Dive brisé par Vhodhal peut basculer vers la forme de Cyclope / Egam, où sa perception magique devient une faim capable de viser les pouvoirs eux-mêmes.'},
      {type:'p',style:'callout',text:'FAIBLESSE / LIMITE — Ancien, pas omniscient — Un Dive peut connaître des routes, guerres et puissances oubliées tout en comprenant mal les sociétés, technologies et rapports de force contemporains.'},
      {type:'p',style:'callout',text:'HOOK MJ — Un Dive ordinaire est déjà une puissance ancienne. Les grands noms de leurs lignées dépassent ce profil et doivent être traités comme des figures majeures.'}
    ]}
  ]
};

const gorgoneIndex=rows.findIndex(r=>r.id==='bestiaire-v15-gorgone');
if(gorgoneIndex<0)throw new Error('Gorgone absente');
rows.splice(gorgoneIndex+1,0,dive);

const forbidden=[/\bTUC\b/i,/classification/i,/\bcorpus\b/i,/\bfiche\b/i,/\bMJ\b/i,/\bsc[ée]nario\b/i,/bloc g[ée]n[ée]rique/i,/jouable/i,/catalogue d['’]?[ée]quipement/i,/source de corruption/i,/\btradition\s*:/i,/\borigine\s*:/i,/les archives/i,/les dossiers/i];
const exact=new Map();let paras=0;
for(const row of rows.filter(r=>String(r.bestiary?.chapter||'').startsWith('2.'))){
  const section=(row.sections||[]).find(s=>s.id==='description');
  if(!section||!Array.isArray(section.blocks)||section.blocks.length<2)throw new Error(`Lore trop court: ${row.id}`);
  for(const block of section.blocks){
    const text=String(block.text||'').trim();if(!text)throw new Error(`Paragraphe vide: ${row.id}`);
    for(const re of forbidden)if(re.test(text))throw new Error(`Terme non diégétique dans ${row.id}: ${re}`);
    const key=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    if(exact.has(key))throw new Error(`Paragraphe dupliqué: ${exact.get(key)} / ${row.id}`);
    exact.set(key,row.id);paras++;
  }
}

const ids=new Set(rows.map(r=>r.id));
const c1=rows.filter(r=>String(r.bestiary?.chapter||'').startsWith('1.')).length;
const c2=rows.filter(r=>String(r.bestiary?.chapter||'').startsWith('2.')).length;
if(rows.length!==263||ids.size!==263||c1!==131||c2!==132)throw new Error(`Comptage invalide: ${rows.length}/${ids.size}, ${c1}+${c2}`);
if(paras<300)throw new Error(`Enrichissement trop faible: ${paras} paragraphes`);

const json=JSON.stringify(rows);
const gz=zlib.gzipSync(Buffer.from(json,'utf8'),{level:9,mtime:0});
const outB64=gz.toString('base64');
const sha=crypto.createHash('sha256').update(outB64).digest('hex');
const prefix='v3-bestiaire-v16-enriched-263';
const chunkSize=8192,parts=Math.ceil(outB64.length/chunkSize);
for(const file of fs.readdirSync(DATA))if(/^v3-bestiaire-v15-262-final-\d{2}\.b64part$/.test(file)||/^v3-bestiaire-v16-enriched-263-\d{2}\.b64part$/.test(file))fs.unlinkSync(`${DATA}/${file}`);
for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,outB64.slice(i*chunkSize,(i+1)*chunkSize)+'\n');
fs.writeFileSync(`${DATA}/.working/bestiary-v16-decoded.json`,JSON.stringify(rows,null,2)+'\n');
spec.prefix=prefix;spec.parts=parts;spec.count=263;spec.sha256=sha;
manifest.generated='2026-09-15';manifest.expectedTotal=930;
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(`BUILT — 263 entrées · 131 Réalité + 132 Vérité · ${paras} paragraphes publics Vérité · ${parts} fragments · SHA ${sha}`);
