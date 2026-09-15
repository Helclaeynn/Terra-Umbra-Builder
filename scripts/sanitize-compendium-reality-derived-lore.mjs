import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const FRAGMENT_SIZE=8000;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const BAD=/\$|\bprice ?(?:mode|label|min|max)\b|\bprice(?:mode|label|min|max)\b/i;
const META=/^(categorie|category|famille|family|type|generation|source|path|chemin|id|illustration|price|prix|cout|cost|pricemode|pricelabel|pricemin|pricemax|price mode|price label|price min|price max)$/;

function load(spec){let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));}
function write(spec,pages){for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');const parts=Math.ceil(b64.length/FRAGMENT_SIZE);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');}
function rows(page){return (page.sections||[]).flatMap(s=>(s.blocks||[]).filter(b=>b.type==='table').flatMap(b=>b.rows||[]));}
function usefulFacts(page){const out=[];for(const row of rows(page)){if(!Array.isArray(row)||row.length<2)continue;const label=clean(row[0]),value=clean(row[1]);if(!label||!value||META.test(norm(label))||BAD.test(value))continue;out.push([label,value]);}return out.slice(0,3);}
function scrub(text){
  const sentences=clean(text).split(/(?<=[.!?…])\s+/).filter(Boolean),kept=[];
  for(const sentence of sentences){
    const chunks=sentence.split(/,\s+/).filter(Boolean).filter(chunk=>!BAD.test(chunk));
    let s=clean(chunks.join(', ')).replace(/\s+([.;!?])/g,'$1');
    if(!s||BAD.test(s))continue;
    if(!/[.!?…]$/.test(s))s+='.';
    kept.push(s);
  }
  return clean(kept.join(' '));
}
function domain(page){const s=norm(`${page.title} ${(page.catalog?.categories||[]).join(' ')} ${page.catalog?.category||''}`);
  if(/grenade|munition|balle|charge|roquette|missile|reservoir/.test(s))return 'la préparation et l’emploi des munitions adaptées à une situation précise';
  if(/armure|protection|renfort|blindage|casque|gilet|scaph|camo|exosquelette/.test(s))return 'la protection portée, son adaptation au milieu et les contraintes physiques qu’elle impose';
  if(/application|logiciel|holonet|ia |navia|securio|blackflag|allbrains|lady|vatican|islamaster|call infornia|celtx|shelov|redwish|boudicca|rampage/.test(s))return 'les usages numériques quotidiens, professionnels ou clandestins du Holonet';
  if(/drone|microbot|scanner|projecteur|holophone|hololentille|idpass|imprimante|console|hardline|domotique|serrure|relais/.test(s))return 'l’équipement électronique courant, ses capteurs et son intégration aux réseaux de 2035';
  if(/vetement|lingerie|cadre|ouvrier|neopunk|detective|biker|meditech|citoyen|rue|ghillie/.test(s))return 'l’habillement comme outil pratique, marqueur social et adaptation au milieu urbain';
  if(/ration|restaurant|mick|yellow|famileat|oldo|cafe|biere|alcool|soda|eau/.test(s))return 'l’alimentation et la consommation ordinaires dans une économie largement industrialisée';
  if(/kick|velvet|prism|redline|bloom|fleshfire|dreamrush|crashware|n sta|drogue|dose/.test(s))return 'les produits psychoactifs et stimulants qui circulent entre usage récréatif, performance et risque sanitaire';
  if(/careforce|clinique|chirurgie|hospital|medical|sante|soin/.test(s))return 'l’accès aux soins, au suivi médical et aux services de santé de la Grande Californie';
  if(/formation|expertise|reparation|document|juridique|securite privee|stockage|atelier/.test(s))return 'les prestations spécialisées achetées pour gagner du temps, de la compétence ou une capacité logistique';
  if(/logement|studio|appartement|residence|penthouse|villa|squat|dortoir|planque|cache|garage|box|vladic/.test(s))return 'le logement, la discrétion résidentielle et le niveau de sécurité réellement disponible sur place';
  if(/moto|voiture|citypod|vap|horntruck|gundriver|rover|apc|vehicule/.test(s))return 'la mobilité terrestre, l’autonomie de déplacement et les contraintes de conduite ou de stationnement';
  if(/pistolet|mitraillette|fusil|shotgun|precision|raven|phoenix|owl/.test(s))return 'l’armement terrestre, son rôle tactique et les compromis entre port, portée et puissance';
  return 'un usage matériel concret dans la vie quotidienne et professionnelle de 2035';
}
function fallback(page,index){const facts=usefulFacts(page);const d=domain(page);const factText=facts.length?facts.map(([l,v])=>`${clean(l).toLowerCase()} : ${v}`).join(' ; '):'';
  if(index===0)return `${page.title} s’inscrit dans ${d}. Ce n’est pas un simple libellé commercial : son intérêt vient de la situation où l’objet ou le service devient réellement utile, disponible et crédible dans l’environnement de Réalité.`;
  if(factText)return `Sur le terrain, ses caractéristiques utiles se lisent notamment à travers ${factText}. Elles déterminent la façon dont on l’emporte, l’emploie, le combine avec d’autres moyens ou l’intègre à une routine plutôt que sa seule valeur marchande.`;
  return `Son emploi se comprend donc par le contexte : disponibilité, discrétion, entretien, transport et compatibilité avec l’infrastructure locale comptent autant que la fonction immédiate. Ces contraintes donnent à l’entrée une place concrète dans la vie de 2035.`;
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(x=>x.id==='equipement');if(!spec)throw new Error('Dataset equipement absent');
const pages=load(spec);let touched=0,fallbacks=0;
for(const page of pages){
  const section=(page.sections||[]).find(s=>s.id==='contexte');if(!section)continue;
  const blocks=(section.blocks||[]).filter(b=>b.type==='p');
  if(!blocks.some(b=>BAD.test(String(b.text||''))))continue;
  touched++;
  const cleaned=blocks.slice(0,2).map(b=>scrub(b.text));
  while(cleaned.length<2)cleaned.push('');
  for(let i=0;i<2;i++)if(cleaned[i].length<70){cleaned[i]=fallback(page,i);fallbacks++;}
  section.blocks=cleaned.map(text=>({type:'p',style:'lore reality-book-lore',text:clean(text)}));
  page.catalog={...(page.catalog||{}),loreVersion:3,loreMethod:'reality-book-semantic-lore'};
}
write(spec,pages);manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Lore Réalité assaini — ${touched} pages sans métadonnées tarifaires · ${fallbacks} paragraphes reconstruits · SHA ${spec.sha256}.`);
