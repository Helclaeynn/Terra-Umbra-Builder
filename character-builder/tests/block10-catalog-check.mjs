import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';

const ROOT='character-builder';
const catalogPath=`${ROOT}/rulesets/terra-umbra/reality/equipment.json.gz.b64`;
const layer34=fs.readFileSync(`${ROOT}/app.parts/34-equipment-catalog-ux-lore.txt`,'utf8');
const layer35=fs.readFileSync(`${ROOT}/app.parts/35-equipment-specific-lore.txt`,'utf8');
const layer37=fs.readFileSync(`${ROOT}/app.parts/37-equipment-recurring-lifestyle-lore.txt`,'utf8');

function normText(v=''){
  return String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
}
function loose(v=''){return normText(v).replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function field(obj,names){
  const wanted=new Set(names.map(normText));
  for(const [k,v] of Object.entries(obj||{})) if(wanted.has(normText(k))&&v!==undefined&&v!==null&&v!=='') return v;
  return null;
}
function deepField(obj,names){
  for(const node of [obj,obj?.data,obj?.details].filter(Boolean)){
    const hit=field(node,names);if(hit!==null)return hit;
  }
  return null;
}
function collect(node,path=[],out=[]){
  if(Array.isArray(node)){node.forEach((v,i)=>collect(v,path.concat(i),out));return out}
  if(!node||typeof node!=='object')return out;
  const keys=Object.keys(node).map(normText);
  const hasName=keys.some(k=>['name','nom','augmentation','equipement','equipment','service','vehicule','vehicle','neuroprogramme','item','designation'].includes(k));
  const hasUseful=keys.some(k=>['prix','price','cout','cost','generation','gen','charge','stress','effet','effect','usage','fonction','fonction principale','description','dgt','degats'].includes(k));
  if(hasName&&hasUseful){out.push({...node,_path:path.join(' / ')});return out}
  for(const [k,v] of Object.entries(node))if(v&&typeof v==='object')collect(v,path.concat(k),out);
  return out;
}
function toNumber(v){
  if(typeof v==='number')return Number.isFinite(v)?v:null;if(v===null||v===undefined)return null;
  const m=String(v).replace(/\u00a0/g,' ').match(/-?\d[\d\s.,]*/);if(!m)return null;
  const n=Number(m[0].replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:null;
}
function priceText(item){
  return String(deepField(item.raw,['Prix','Price','Coût','Cout','Tarif','Prix indicatif','Prix de reference','Prix de référence','Fourchette indicative','Prix / accès','Prix / acces','priceLabel','price_label'])||'').trim();
}
function recurringKind(item){
  if(!item)return 'one_off';
  const n=normText(item.name||''),key=loose(item.name||''),cat=normText(`${item.category||''} ${deepField(item.raw,['Type','Section','Famille'])||''}`),price=normText(priceText(item));
  const context=normText(`${n} ${cat} ${deepField(item.raw,['Fréquence','Frequence','Périodicité','Periodicite','Facturation'])||''}`);
  if(item.vehicle)return 'durable_purchase';
  if(/\btrajet\b|\bintervention\b|\bseance\b|\bheure\b|\bheures\b|\bh\b|\bjour\b|\bverre\b|\btasse\b/.test(price)||key==='metro tram'||/^mas (court trajet|trajet long urbain)$/.test(key))return 'per_use';
  if(/\ban\b|annuel|annuelle|annuels|annuelles/.test(price)||/abonnement annuel/.test(context))return 'annual';
  if(/\bmois\b|mensuel|mensuelle|mensuels|mensuelles/.test(price)||/abonnement mensuel|dette mensuelle|pension mensuelle|loyer|leasing/.test(context))return 'monthly';
  if(/logement|planque/.test(cat)||/dortoir ouvrier|vladic micro logement|vladic studio|studio urbain ancien|appartement connecte|vladic familial|vladic grand|residence de cadre|penthouse|villa/.test(n)||/cache improvisee|piece box squat discret|studio garage anonyme|planque dediee|planque securisee|reseau de planques/.test(n))return 'monthly';
  if(key==='pass metro tram'||/^bull (basic|standard|premium|executive)$/.test(key))return 'monthly';
  if(/^careforce (bronze|silver|golden)$/.test(key))return 'annual';
  if(/stockage box atelier|media holonet reseaux/.test(key))return 'monthly';
  if(/abonnement|assurance|careforce/.test(context))return /\ban\b/.test(price)?'annual':/\bmois\b/.test(price)?'monthly':'one_off';
  if(/vehicule|arme|armure|augmentation|materiel|objet/.test(cat))return 'durable_purchase';
  return 'one_off';
}
function extractArray(source,name){
  const re=new RegExp(`const\\s+${name}\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);`);const m=source.match(re);
  if(!m)throw new Error(`Unable to extract ${name}`);return vm.runInNewContext(m[1]);
}
function mapped(name,pairs){
  const n=loose(name);let best=0;
  for(const [raw] of pairs){const k=loose(raw);if(k.length>=5&&(n===k||n.includes(k)||k.includes(n)))best=Math.max(best,k.length)}
  return best>0;
}

const packed=fs.readFileSync(catalogPath,'utf8').trim();
const raw=JSON.parse(zlib.gunzipSync(Buffer.from(packed,'base64')).toString('utf8'));
const rows=collect(raw);
const items=rows.map((row,i)=>{
  const name=String(field(row,['name','nom','augmentation','equipement','equipment','service','vehicule','vehicle','neuroprogramme','item','designation'])||`Entrée ${i+1}`).trim();
  const category=String(field(row,['category','categorie','catégorie','section','family','famille','type','groupe'])||row._path||'Équipement').trim();
  const catNorm=normText(category),nameNorm=normText(name);
  return {name,category,price:toNumber(field(row,['price','prix','cost','cout','coût'])??field(row,['priceMin','price_min'])),vehicle:catNorm.includes('vehicul')||catNorm==='vehicules'||catNorm.includes('vehicles'),neuro:catNorm.includes('neuroprogramme')||nameNorm.includes('neuroprogramme'),raw:row};
}).filter(x=>x.name&&!/^entree \d+$/i.test(normText(x.name)));

const byName=new Map(items.map(x=>[loose(x.name),x]));
const requireItem=name=>{const x=byName.get(loose(name));if(!x)throw new Error(`Catalogue item missing: ${name}`);return x};
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const expectedMonthly=['Pass metro/tram','Bull Basic','Bull Standard','Bull Premium','Bull Executive','Stockage / box / atelier','Media Holonet / reseaux'];
const expectedAnnual=['CeltX','Shelov','LadyDolla','CareForce Bronze','CareForce Silver','CareForce Golden'];
const excluded=['Metro / tram','MAS - court trajet','MAS - trajet long urbain'];

for(const name of expectedMonthly)assert(recurringKind(requireItem(name))==='monthly',`${name} must be monthly, got ${recurringKind(requireItem(name))}`);
for(const name of expectedAnnual)assert(recurringKind(requireItem(name))==='annual',`${name} must be annual, got ${recurringKind(requireItem(name))}`);
for(const name of excluded)assert(!['monthly','annual'].includes(recurringKind(requireItem(name))),`${name} must not enter Fixed Charges`);

for(const item of items){
  const p=normText(priceText(item)),kind=recurringKind(item);
  if(/\bmois\b/.test(p)&&!item.vehicle)assert(kind==='monthly',`${item.name}: source says /mois but classifier says ${kind}`);
  if(/\ban\b/.test(p)&&!item.vehicle)assert(kind==='annual',`${item.name}: source says /an but classifier says ${kind}`);
  if(/\btrajet\b|\bintervention\b|\bseance\b|\bheure\b|\bheures\b|\bh\b|\bjour\b|\bverre\b|\btasse\b/.test(p))assert(!['monthly','annual'].includes(kind),`${item.name}: per-use price incorrectly classified ${kind}`);
}

const historical=extractArray(layer34,'r34HistoricalWeaponLore');
const specific=extractArray(layer35,'r35SpecificLorePairs');
const sourceLoreFields=['Apparence','Aspect','Description physique','Présentation','Description','Principe','Rôle','Role','Usage',"Exemples d'usage",'Exemples usage','Fonction','Fonction principale','Notes','Note','Lecture','Effet','Effet actuel','Effet abrégé','Effet abrege','Profil','Profil / effet','Classe','Type'];
const unsupported=items.filter(item=>!mapped(item.name,historical)&&!mapped(item.name,specific)&&!deepField(item.raw,sourceLoreFields));
assert(unsupported.length===0,`Items without concrete lore source: ${unsupported.map(x=>x.name).join(', ')}`);

assert(layer37.includes('r35LifestyleDetail(p.base'), 'Base Lifestyle lore is not rendered by layer 37');
assert(layer37.includes("p.effective!==p.base")&&layer37.includes("r35LifestyleDetail(p.effective"), 'Effective Lifestyle lore is not rendered when changed');
assert(layer37.includes('const r37LoreBase=r34ItemLore'), 'Layer 37 must preserve the augmentation lore override from layer 36');

const recurring=items.filter(x=>['monthly','annual'].includes(recurringKind(x)));
console.log(`Block 10 catalog OK: ${items.length} equipment entries, ${recurring.length} recurring entries (${recurring.filter(x=>recurringKind(x)==='monthly').length} monthly / ${recurring.filter(x=>recurringKind(x)==='annual').length} annual).`);
console.log(`Required mobility subscriptions present: Pass metro/tram + 4 Bull tiers; MAS and Metro/tram per-use excluded.`);
console.log(`Concrete lore coverage OK: historical/source/specific lore available for every equipment entry.`);
