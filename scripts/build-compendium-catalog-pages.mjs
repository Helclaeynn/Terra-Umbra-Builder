import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import vm from 'node:vm';

const ROOT='character-builder/rulesets/terra-umbra/reality';
const DATA='compendium/data';
const ASSETS='compendium/assets';
const MANIFEST=`${DATA}/manifest-v3.json`;
const R47='character-builder/app.parts/47-reality-missing-augmentations.txt';
const FRAGMENT_SIZE=8000;

const NAME_KEYS=['name','nom','augmentation','equipement','equipment','service','vehicule','vehicle','neuroprogramme','item','designation'];
const CATEGORY_KEYS=['category','categorie','catégorie','section','family','famille','type','groupe'];
const GENERATION_KEYS=['generation','génération','gen'];
const PRICE_KEYS=['price','prix','cost','cout','coût'];
const CHARGE_KEYS=['charge'];
const STRESS_KEYS=['stress'];
const SLOT_KEYS=['slots','slot','emplacements','emplacement'];
const EFFECT_KEYS=['effect','effet','fonction principale','fonction','usage','description','profil','speciaux','spéciaux'];
const USEFUL_KEYS=['prix','price','cout','cost','generation','gen','charge','stress','effet','effect','usage','fonction','fonction principale','description','dgt','degats'];
const CANONICAL_SKIP=new Set([...NAME_KEYS,...CATEGORY_KEYS,...GENERATION_KEYS,...PRICE_KEYS,...CHARGE_KEYS,...STRESS_KEYS,...SLOT_KEYS,...EFFECT_KEYS,'id','_path'].map(normText));

function normText(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function slug(value){return normText(value).replace(/\s+/g,'-').replace(/^-+|-+$/g,'')||'item';}
function field(obj,names){
  const entries=Object.entries(obj||{});
  for(const wanted of names){
    const n=normText(wanted),hit=entries.find(([k])=>normText(k)===n);
    if(hit&&hit[1]!==undefined&&hit[1]!==null&&hit[1]!=='')return hit[1];
  }
  return null;
}
function numberValue(v){
  if(typeof v==='number')return Number.isFinite(v)?v:null;
  if(v===null||v===undefined)return null;
  const m=String(v).replace(/\u00a0/g,' ').match(/-?\d[\d\s.,]*/);if(!m)return null;
  const n=Number(m[0].replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:null;
}
function collect(node,pathParts=[],out=[]){
  if(Array.isArray(node)){node.forEach((v,i)=>collect(v,pathParts.concat(i),out));return out;}
  if(!node||typeof node!=='object')return out;
  const keys=Object.keys(node).map(normText),nameKeys=NAME_KEYS.map(normText);
  const hasName=keys.some(k=>nameKeys.includes(k)),hasUseful=keys.some(k=>USEFUL_KEYS.includes(k));
  if(hasName&&hasUseful){out.push({...node,_path:pathParts.join(' / ')});return out;}
  for(const [k,v] of Object.entries(node))if(v&&typeof v==='object')collect(v,pathParts.concat(k),out);
  return out;
}
function decodeBase64Gzip(b64,label){
  const clean=String(b64).replace(/^\uFEFF/,'').replace(/\s+/g,'');
  if(!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)||clean.length%4!==0)throw new Error(`${label}: Base64 invalide`);
  return JSON.parse(zlib.gunzipSync(Buffer.from(clean,'base64')).toString('utf8'));
}
function loadCompressed(file){return decodeBase64Gzip(fs.readFileSync(file,'utf8'),file);}
function loadSafe(name){
  const safeDir=path.join(ROOT,'safe'),manifestPath=path.join(safeDir,`${name}.manifest.json`);
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  if(!Array.isArray(manifest.chunks)||!manifest.chunks.length)throw new Error(`${name}: manifeste safe sans fragments`);
  const b64=manifest.chunks.map(file=>fs.readFileSync(path.join(safeDir,file),'utf8').replace(/\s+/g,'')).join('');
  return {raw:decodeBase64Gzip(b64,`${name} safe`),manifest};
}
function normalizeCatalog(raw,kind){
  const rows=collect(raw),seen=new Map();
  return rows.map((row,i)=>{
    const name=String(field(row,NAME_KEYS)||`Entrée ${i+1}`).trim();
    const category=String(field(row,CATEGORY_KEYS)||row._path||(kind==='augmentation'?'Augmentations':'Équipement')).trim();
    const generation=numberValue(field(row,GENERATION_KEYS)),price=numberValue(field(row,PRICE_KEYS));
    const charge=numberValue(field(row,CHARGE_KEYS)),stress=numberValue(field(row,STRESS_KEYS));
    const slots=field(row,SLOT_KEYS),effect=String(field(row,EFFECT_KEYS)||'').trim();
    const base=String(field(row,['id'])||slug(`${kind}-${category}-${name}-${generation||0}-${price??'x'}`));
    const n=(seen.get(base)||0)+1;seen.set(base,n);
    const catalogId=n===1?base:`${base}-${n}`;
    return {catalogId,kind,name,category,generation,price,charge,stress,slots,effect,raw:row,sourceType:null};
  }).filter(x=>x.name&&!/^entree \d+$/i.test(normText(x.name)));
}
function structuredEquipment(raw,sourceType){
  const rows=Array.isArray(raw?.entries)?raw.entries:[];
  return rows.map((row,i)=>{
    const name=String(row.name||`Entrée ${i+1}`).trim(),mode=normText(String(row.priceMode||''));
    const price=mode==='exact'?numberValue(row.price):numberValue(row.priceMin);
    return {
      catalogId:`${sourceType}-${row.id||slug(name)}`,kind:'equipment',name,
      category:sourceType==='vehicle'?'Véhicules':`Neuroprogramme — ${row.category||'Divers'}`,
      generation:null,price,charge:null,stress:null,slots:null,effect:String(row.effect||'').trim(),
      raw:row,sourceType
    };
  });
}
function appendUniqueEquipment(target,items){
  const existing=new Set(target.map(x=>normText(`${x.name}|${x.category}`)));
  for(const item of items){const key=normText(`${item.name}|${item.category}`);if(existing.has(key))continue;existing.add(key);target.push(item);}
}
function r47Aug(id,name,category,generation,price,charge,stress,slots,effect,raw={}){
  return {catalogId:`augmentation-v9-${id}`,kind:'augmentation',name,category,generation,price,charge,stress,slots,effect,sourceType:'v9-reconciliation',raw:{name,category,generation,price,charge,stress,slots,effect,...raw}};
}
function loadR47(){
  const source=fs.readFileSync(R47,'utf8'),marker='const r47MissingAugmentations=';
  const start=source.indexOf(marker);if(start<0)throw new Error('Réconciliation V9: liste r47 introuvable');
  const exprStart=start+marker.length,end=source.indexOf(';\nconst r47Installed',exprStart);
  if(end<0)throw new Error('Réconciliation V9: fin de liste r47 introuvable');
  const expression=source.slice(exprStart,end).trim();
  const rows=vm.runInNewContext(expression,{r47Aug},{timeout:1000});
  if(!Array.isArray(rows))throw new Error('Réconciliation V9: liste invalide');
  return rows;
}
function appendR47(target){
  const existing=new Set(target.map(x=>`${normText(x.name)}|${x.generation??'x'}`));let installed=0;
  for(const item of loadR47()){
    const key=`${normText(item.name)}|${item.generation??'x'}`;
    if(existing.has(key))continue;existing.add(key);target.push(item);installed++;
  }
  return installed;
}
function stableVariant(text,count=4){const h=crypto.createHash('sha1').update(text).digest();return h[0]%count;}
function equipmentProfile(item){
  const s=normText(`${item.category} ${item.name} ${item.effect}`);
  if(/arme|pistolet|fusil|carabine|shotgun|mitrail|munition|lame|couteau|matraque|taser/.test(s))return ['l’armement civil, professionnel ou de sécurité','les personnels armés, convoyeurs, agents de sécurité et particuliers qui privilégient un matériel éprouvé','sa présence dit autant du niveau de risque accepté que du milieu dans lequel son porteur évolue'];
  if(/armure|protection|gilet|casque|blind|bouclier/.test(s))return ['les protections personnelles devenues ordinaires dans les métiers exposés','les agents de terrain, équipes de secours, vigiles et travailleurs confrontés à un environnement hostile','son intérêt tient moins à l’apparence qu’à la capacité de rester opérationnel quand la situation se dégrade'];
  if(/medical|médical|soin|trauma|chirurg|pharma|medkit|secours/.test(s))return ['la médecine de terrain et les soins rapides de la Grande Californie','les secouristes, équipes mobiles, cliniques privées et voyageurs qui ne peuvent pas compter sur une prise en charge immédiate','ce type de matériel est souvent choisi pour gagner de précieuses minutes avant l’arrivée d’une véritable équipe médicale'];
  if(/camera|caméra|surveillance|detect|détect|capteur|scanner|sécurité|alarme/.test(s))return ['l’économie de la surveillance et du contrôle d’accès','les sociétés de sécurité, techniciens, enquêteurs et propriétaires soucieux de documenter ce qui se passe autour d’eux','dans les zones très équipées, sa discrétion compte presque autant que ses performances'];
  if(/ordinateur|terminal|deck|comm|radio|phone|téléphone|réseau|dataslate|tablette|neuro|informat/.test(s))return ['l’écosystème numérique qui accompagne chaque déplacement et chaque transaction','les professionnels mobiles, techniciens, cadres et indépendants qui vivent connectés aux réseaux californiens','sa valeur réelle dépend autant de l’accès aux réseaux et aux services que du matériel lui-même'];
  if(/outil|kit|atelier|réparation|maintenance|mécan|mecani|techni|soud/.test(s))return ['les métiers techniques qui maintiennent la mégapole en état de fonctionner','les mécaniciens, techniciens, monteurs, récupérateurs et équipes de maintenance','on le retrouve aussi bien dans des ateliers impeccables que dans les caisses cabossées des travailleurs de l’Underlife'];
  if(/pass|abonnement|mensuel|premium|executive|standard|basic|service|contrat|assurance|transport|metro|métro|tram|taxi/.test(s))return ['les services du quotidien, où l’accès vaut souvent davantage que la possession','les habitants qui achètent du temps, de la mobilité ou de la tranquillité plutôt qu’un objet supplémentaire','ce qui est payé ici est surtout la continuité du service et la place qu’il donne dans la vie urbaine'];
  if(/vêtement|vetement|tenue|mode|luxe|bijou|montre/.test(s))return ['les signes matériels par lesquels la Grande Californie affiche statut, profession et appartenance','ceux qui doivent être reconnus au premier regard dans un milieu social ou professionnel précis','le choix du modèle est rarement neutre : il peut ouvrir une porte, rassurer un interlocuteur ou au contraire attirer l’attention'];
  if(/logement|hôtel|hotel|appartement|studio|loyer|repas|nourriture|boisson/.test(s))return ['l’infrastructure quotidienne qui transforme des crédits en confort, sécurité et stabilité','les habitants qui cherchent à préserver une routine malgré la pression de la mégapole','ce genre de dépense paraît banal jusqu’au moment où l’accès disparaît, révélant à quel point il structure la vie courante'];
  return ['le marché foisonnant des biens et services de la Grande Californie','les habitants, indépendants et professionnels qui recherchent une solution immédiatement disponible','sa diffusion dépend surtout du quartier, du réseau de distribution et du niveau de vie de l’acheteur'];
}
function augmentationProfile(item){
  const s=normText(`${item.category} ${item.name} ${item.effect}`);
  if(/neural|neurale|cerveau|mémoire|memoire|cognit|synap|réflex|reflex/.test(s))return ['l’augmentation neurale, où l’électronique s’insère au plus près de la perception et de la décision','les opérateurs, analystes, combattants et spécialistes qui acceptent de confier une partie de leurs performances à une interface implantée'];
  if(/oeil|œil|oculaire|vision|rétine|retine|audit|oreille|sonar|sensor/.test(s))return ['les augmentations sensorielles, conçues pour étendre ce que le corps peut percevoir','les professionnels de terrain, tireurs, techniciens et enquêteurs pour qui manquer une information coûte plus cher que l’intervention elle-même'];
  if(/muscl|osse|squelette|bras|jambe|membre|force|tendon/.test(s))return ['les renforcements structurels du corps, à mi-chemin entre chirurgie réparatrice et recherche de performance','les travailleurs lourds, personnels d’intervention, combattants et accidentés qui veulent dépasser les limites d’une reconstruction ordinaire'];
  if(/derm|peau|armure|blind|carapace|sous-cutan/.test(s))return ['les protections implantées, presque invisibles jusqu’au moment où elles doivent encaisser un choc','les personnes exposées à la violence ou à des environnements où un équipement externe serait trop voyant ou trop encombrant'];
  if(/coeur|cœur|sang|circul|respir|poumon|rein|foie|organe|métabol|metabol/.test(s))return ['les systèmes internes qui modifient directement l’endurance, la récupération ou la survie de l’organisme','les patients lourds, professionnels de milieux extrêmes et individus pour qui une défaillance biologique n’est plus acceptable'];
  if(/interface|port|connect|neurodrive|réseau|reseau|donnée|donnee/.test(s))return ['les interfaces homme-machine qui font du corps un terminal à part entière','les techniciens, plongeurs de réseau et professionnels pour qui l’accès direct aux systèmes est devenu une seconde nature'];
  return ['la chirurgie augmentique terrestre, désormais assez mature pour mêler réparation, confort et amélioration volontaire','ceux qui considèrent le corps comme une plateforme perfectible, malgré le coût biologique et psychologique que toute implantation peut finir par imposer'];
}
function priceLore(price){
  if(price===null)return 'Sa disponibilité varie fortement selon le fournisseur et le quartier.';
  if(price<250)return 'Son prix le place parmi les achats que l’on peut croiser sans appartenir aux élites.';
  if(price<1500)return 'Son coût reste accessible à ceux qui en ont un besoin régulier ou professionnel.';
  if(price<7500)return 'L’investissement devient suffisamment important pour être réfléchi, assuré ou financé.';
  if(price<=20000)return 'Son acquisition représente un engagement financier sérieux, généralement réservé à un usage professionnel ou à un train de vie solide.';
  return 'Son prix le situe bien au-delà de l’achat impulsif : l’accès dépend autant des ressources que du réseau capable de le fournir.';
}
function generationLore(item){
  if(item.kind!=='augmentation'||item.generation===null)return '';
  if(item.generation>=2)return 'La deuxième génération vise des performances supérieures et une intégration plus ambitieuse, au prix d’une implantation plus exigeante.';
  return 'Cette génération appartient aux technologies augmentiques éprouvées, largement comprises par les cliniques capables de les poser et de les entretenir.';
}
function loreParagraphs(item){
  const [context,users,meaning]=item.kind==='augmentation'?augmentationProfile(item):equipmentProfile(item),v=stableVariant(`${item.name}|${item.category}|${item.generation??''}`);
  const identity=item.kind==='augmentation'&&item.generation!==null?`${item.name} de génération ${item.generation}`:item.name;
  const first=[
    `Dans la Grande Californie, ${identity} appartient à ${context}. Son nom circule surtout chez ${users}.`,
    `${identity} s’inscrit dans ${context}. On le rencontre principalement chez ${users}.`,
    `Autour de ${identity} s’est développé tout un usage lié à ${context}. Il intéresse d’abord ${users}.`,
    `Dans les vitrines, ateliers et réseaux spécialisés de la Grande Californie, ${identity} relève de ${context}. Il est surtout recherché par ${users}.`
  ][v];
  const second=item.kind==='augmentation'
    ?`${priceLore(item.price)} ${generationLore(item)} Pour ${identity}, une pose sérieuse suppose suivi, entretien et acceptation des contraintes propres à ce type d’implant.`.replace(/\s+/g,' ').trim()
    :`${priceLore(item.price)} Pour ${item.name}, dans la famille « ${item.category} », ${meaning}.`;
  return [first,second];
}
function displayValue(value){
  if(value===null||value===undefined||value==='')return '';
  if(Array.isArray(value))return value.map(displayValue).filter(Boolean).join(' · ');
  if(typeof value==='object')return JSON.stringify(value);
  if(typeof value==='boolean')return value?'Oui':'Non';
  return String(value).trim();
}
function labelKey(key){return String(key).replace(/[_-]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase());}
function mechanicsRows(item){
  const rows=[],add=(label,value)=>{const s=displayValue(value);if(s)rows.push([label,s]);};
  add('Catégorie',item.category);add('Prix',field(item.raw,PRICE_KEYS));
  if(item.kind==='augmentation')add('Génération',field(item.raw,GENERATION_KEYS));
  add('Charge',field(item.raw,CHARGE_KEYS));add('Stress',field(item.raw,STRESS_KEYS));add('Emplacements',field(item.raw,SLOT_KEYS));add('Effet / usage',field(item.raw,EFFECT_KEYS));
  for(const [key,value] of Object.entries(item.raw||{})){
    if(CANONICAL_SKIP.has(normText(key)))continue;
    if(value&&typeof value==='object'&&!Array.isArray(value))continue;
    const shown=displayValue(value);if(shown)rows.push([labelKey(key),shown]);
  }
  const uniq=[],seen=new Set();for(const row of rows){const k=`${normText(row[0])}|${row[1]}`;if(seen.has(k))continue;seen.add(k);uniq.push(row);}return uniq;
}
function baseTitle(item){return item.kind==='augmentation'&&item.generation!==null?`${item.name} — Génération ${item.generation}`:item.name;}
function assignDisplayTitles(items){
  const groups=new Map();for(const item of items){const key=normText(baseTitle(item));if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item);}
  for(const group of groups.values()){
    if(group.length===1){group[0].displayTitle=baseTitle(group[0]);continue;}
    let candidates=group.map(item=>`${baseTitle(item)} — ${item.category}`);
    const counts=new Map();for(const t of candidates)counts.set(normText(t),(counts.get(normText(t))||0)+1);
    candidates=candidates.map((t,i)=>counts.get(normText(t))===1?t:`${t} — ${group[i].price!==null?`${group[i].price} $`:String(field(group[i].raw,PRICE_KEYS)||'prix distinct')}`);
    const seen=new Set();for(let i=0;i<group.length;i++){
      const key=normText(candidates[i]);
      if(seen.has(key))throw new Error(`Collision réelle non résolue: ${baseTitle(group[i])} (${group[i].category})`);
      seen.add(key);group[i].displayTitle=candidates[i];
    }
  }
}
function articleFor(item,index){
  const category=item.kind==='augmentation'?'Augmentations':'Équipement',prefix=item.kind==='augmentation'?'augmentation':'equipement';
  const displayTitle=item.displayTitle||baseTitle(item),[p1,p2]=loreParagraphs(item),tags=['Réalité',category,item.category].filter(Boolean);
  if(item.kind==='augmentation'&&item.generation!==null)tags.push(`Génération ${item.generation}`);
  return {
    id:`${prefix}-${String(index+1).padStart(3,'0')}-${slug(item.name)}`,title:displayTitle,category,status:'canon_recent',source:'Catalogue Réalité du Builder',tags:[...new Set(tags)],
    illustration:{src:item.kind==='augmentation'?'assets/augmentation-placeholder.svg':'assets/equipment-placeholder.svg',alt:`Illustration de ${displayTitle}`,caption:'Illustration à venir'},
    catalog:{kind:item.kind,id:item.catalogId,category:item.category,generation:item.generation,price:item.price,sourceType:item.sourceType||null},
    sections:[
      {id:'contexte',title:'Dans la Grande Californie',level:2,blocks:[{type:'p',style:'lore',text:p1},{type:'p',style:'lore',text:p2}]},
      {id:'proprietes',title:'Propriétés',level:2,blocks:[{type:'table',rows:mechanicsRows(item)}]}
    ]
  };
}
function dedupeFaceCaster(items){
  const hits=items.map((item,index)=>({item,index})).filter(({item})=>normText(item.name)==='facecaster dfl');
  if(hits.length!==2)throw new Error(`FaceCaster DFL: ${hits.length} occurrences runtime avant dédoublonnage, attendu 2`);
  const preferred=hits.find(({item})=>/neuro|objet usuel|materiel technique/.test(normText(`${item.category} ${item.sourceType||''}`)))||hits[0];
  const filtered=items.filter((item,index)=>normText(item.name)!=='facecaster dfl'||index===preferred.index);
  if(filtered.filter(item=>normText(item.name)==='facecaster dfl').length!==1)throw new Error('FaceCaster DFL: dédoublonnage invalide');
  return {items:filtered,sourceCount:hits.length,removed:hits.length-1,kept:preferred.item};
}
function groupAugmentations(items){
  const groups=new Map();
  for(const item of items){const key=normText(item.name);if(!groups.has(key))groups.set(key,{name:item.name,variants:[]});groups.get(key).variants.push(item);}
  const rows=[...groups.values()];
  for(const group of rows)group.variants.sort((a,b)=>(a.generation??999)-(b.generation??999)||normText(a.category).localeCompare(normText(b.category))||a.catalogId.localeCompare(b.catalogId));
  return rows.sort((a,b)=>normText(a.name).localeCompare(normText(b.name),'fr'));
}
function augmentationArticleFor(group,index){
  const variants=group.variants,categories=[...new Set(variants.map(x=>x.category).filter(Boolean))],generations=[...new Set(variants.map(x=>x.generation).filter(x=>x!==null&&x!==undefined))].sort((a,b)=>a-b);
  const representative={...variants[0],name:group.name,category:categories.join(' · ')||'Augmentations',generation:null,price:null,effect:variants.map(x=>x.effect).filter(Boolean).join(' ')};
  const [p1,p2]=loreParagraphs(representative),generationCounts=new Map();
  for(const variant of variants){const key=variant.generation??'x';generationCounts.set(key,(generationCounts.get(key)||0)+1);}
  const sections=[{id:'contexte',title:'Dans la Grande Californie',level:2,blocks:[{type:'p',style:'lore',text:p1},{type:'p',style:'lore',text:p2}]}];
  variants.forEach((variant,i)=>{
    const gKey=variant.generation??'x',base=variant.generation!==null&&variant.generation!==undefined?`Génération ${variant.generation}`:'Propriétés';
    const title=(generationCounts.get(gKey)||0)>1?`${base} — ${variant.category}`:base;
    sections.push({id:`proprietes-${variant.generation??'x'}-${String(i+1).padStart(2,'0')}-${slug(variant.category)}`,title,level:2,blocks:[{type:'table',rows:mechanicsRows(variant)}]});
  });
  const tags=['Réalité','Augmentations',...categories,...generations.map(g=>`Génération ${g}`)];
  return {
    id:`augmentation-${String(index+1).padStart(3,'0')}-${slug(group.name)}`,title:group.name,category:'Augmentations',status:'canon_recent',source:'Catalogue Réalité du Builder',tags:[...new Set(tags.filter(Boolean))],
    illustration:{src:'assets/augmentation-placeholder.svg',alt:`Illustration de ${group.name}`,caption:'Illustration à venir'},
    catalog:{kind:'augmentation',id:`augmentation-${slug(group.name)}`,category:categories[0]||'Augmentations',categories,generation:null,generations,price:null,variants:variants.map(v=>({id:v.catalogId,category:v.category,generation:v.generation,price:v.price,sourceType:v.sourceType||null}))},
    sections
  };
}
function writeDataset(id,prefix,rows){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(path.join(DATA,file));
  const payload=JSON.stringify(rows),b64=zlib.gzipSync(Buffer.from(payload,'utf8'),{level:9}).toString('base64'),parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(path.join(DATA,`${prefix}-${String(i).padStart(2,'0')}.b64part`),b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  return {id,prefix,parts,count:rows.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')};
}
function placeholder(title,subtitle){return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#101820"/><rect x="36" y="36" width="1128" height="603" rx="24" fill="none" stroke="#63717b" stroke-width="3" stroke-dasharray="14 12"/><text x="600" y="315" text-anchor="middle" fill="#d6dde2" font-family="Arial,sans-serif" font-size="48">${title}</text><text x="600" y="370" text-anchor="middle" fill="#8d9aa3" font-family="Arial,sans-serif" font-size="24">${subtitle}</text></svg>`;}

fs.mkdirSync(DATA,{recursive:true});fs.mkdirSync(ASSETS,{recursive:true});
const augRaw=loadCompressed(`${ROOT}/augmentations.json.gz.b64`),equipSafe=loadSafe('equipment'),neuroSafe=loadSafe('neuroprograms'),vehicleSafe=loadSafe('vehicles');
const augItems=normalizeCatalog(augRaw,'augmentation'),equipRuntimeItems=normalizeCatalog(equipSafe.raw,'equipment');
const installedR47=appendR47(augItems);
appendUniqueEquipment(equipRuntimeItems,structuredEquipment(neuroSafe.raw,'neuroprogram'));
appendUniqueEquipment(equipRuntimeItems,structuredEquipment(vehicleSafe.raw,'vehicle'));

const expectedEquipmentRuntime=Number(equipSafe.manifest.entries||0)+Number(neuroSafe.manifest.entries||0)+Number(vehicleSafe.manifest.entries||0);
if(equipRuntimeItems.length!==expectedEquipmentRuntime)throw new Error(`Parité Builder équipement runtime: ${equipRuntimeItems.length}, attendu ${expectedEquipmentRuntime}`);
if(installedR47!==14||augItems.length!==146)throw new Error(`Parité Builder augmentations runtime: ${augItems.length}, réconciliation V9 installée ${installedR47}/14`);

const faceCasterResult=dedupeFaceCaster(equipRuntimeItems),equipItems=faceCasterResult.items;
if(equipItems.length!==expectedEquipmentRuntime-1)throw new Error(`Équipement visible après FaceCaster: ${equipItems.length}, attendu ${expectedEquipmentRuntime-1}`);
assignDisplayTitles(equipItems);

const augGroups=groupAugmentations(augItems);
if(augGroups.length!==64)throw new Error(`Pages d’augmentations groupées: ${augGroups.length}, attendu 64`);
const nestedVariantCount=augGroups.reduce((sum,g)=>sum+g.variants.length,0);
if(nestedVariantCount!==146)throw new Error(`Variantes d’augmentations après regroupement: ${nestedVariantCount}, attendu 146`);

const augRows=augGroups.map(augmentationArticleFor),equipRows=equipItems.map(articleFor),allRows=[...augRows,...equipRows];
if(new Set(allRows.map(x=>x.id)).size!==allRows.length)throw new Error('IDs de pages catalogue dupliqués');
if(new Set(allRows.map(x=>`${x.category}|${normText(x.title)}`)).size!==allRows.length)throw new Error('Titres de pages catalogue dupliqués');

const equipSpec=writeDataset('equipement','v3-equipement-builder-v1',equipRows),augSpec=writeDataset('augmentations','v3-augmentations-builder-v1',augRows);
fs.writeFileSync(`${ASSETS}/equipment-placeholder.svg`,placeholder('Illustration à venir','Équipement · Terra Umbra California'));
fs.writeFileSync(`${ASSETS}/augmentation-placeholder.svg`,placeholder('Illustration à venir','Augmentation · Terra Umbra California'));

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));manifest.generated=new Date().toISOString().slice(0,10);
for(const cat of ['Équipement','Augmentations'])if(!manifest.categories.includes(cat))manifest.categories.push(cat);
manifest.datasets=manifest.datasets.filter(x=>!['equipement','augmentations'].includes(x.id));
const realityIndex=manifest.datasets.findIndex(x=>x.id==='realite');manifest.datasets.splice(realityIndex>=0?realityIndex+1:manifest.datasets.length,0,equipSpec,augSpec);
manifest.expectedTotal=manifest.datasets.reduce((sum,x)=>sum+Number(x.count||0),0);fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');

console.log(`Catalogue Compendium généré — ${equipRows.length} équipements · ${augRows.length} augmentations (${nestedVariantCount} variantes runtime) · total V3 ${manifest.expectedTotal}`);
console.log(`Sources runtime — base équipement ${equipSafe.manifest.entries} + Neuro ${neuroSafe.manifest.entries} + véhicules ${vehicleSafe.manifest.entries} = ${expectedEquipmentRuntime} · augmentations base ${augItems.length-installedR47} + V9 ${installedR47} = ${augItems.length}`);
console.log(`FaceCaster DFL — ${faceCasterResult.sourceCount} entrées runtime, ${faceCasterResult.removed} retirée, 1 page visible (${faceCasterResult.kept.category}).`);
console.log(`Augmentations — ${augItems.length} variantes regroupées en ${augRows.length} pages.`);
console.log(`Équipement SHA ${equipSpec.sha256}`);console.log(`Augmentations SHA ${augSpec.sha256}`);