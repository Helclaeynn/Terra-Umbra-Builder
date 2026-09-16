import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function check(label,names,pages,{contains=false}={}){
  const titles=pages.map(p=>({id:p.id,title:p.title,n:norm(p.title)}));
  const missing=[];
  for(const name of names){const q=norm(name);const hit=titles.find(t=>contains?(t.n.includes(q)||q.includes(t.n)):t.n===q);if(!hit)missing.push(name)}
  console.log(`${label} — ${names.length-missing.length}/${names.length} couverts${missing.length?` · manquants: ${missing.join(' | ')}`:''}`);
  return missing;
}
const equipment=load('equipement'),augmentations=load('augmentations');
console.log(`CATALOG COVERAGE — équipement ${equipment.length} · augmentations ${augmentations.length}`);
const neuro=["D-Fence","Shieldic","MyWall","2-Fence","Omnithorns","Castland","Datablast","Dark Holes","Darksword","Langoliers","Calamities Reign","Darkalibur","OverLoad IV","King Crash","Ace-BurnX","Zero K","Icewall","Data-Shield","Stealthy Timmy","Jorgmunworm","Nanaruto","Swampro","Sutr","Neurald","Sicarius","Groundswell","Duppli'cat"];
const mobility=['Pass métro/tram','MAS - court trajet','MAS - trajet long urbain','Bull Basic','Bull Standard','Bull Premium','Bull Executive'];
const services=['Flashmergencies','CareForce Bronze','CareForce Silver','CareForce Golden','Black Clinic','Clinique courante','Chirurgie / hospitalisation','Service juridique','Sécurité privée'];
const lodging=['Squat / zone abandonnée','Dortoir ouvrier','Vladic micro-logement','Vladic studio','Studio urbain ancien','Vladic familial','Appartement connecté','Vladic grand/protégé','Résidence de cadre sécurisée','Penthouse / villa'];
const tech=['N-Sta','Holophone','Hololentilles','IDpass','Byron Zippo','Projecteur holographique','FaceCaster DFL','Essaim de microbots','Drone civil','Serrure intelligente','Relais Holonet portable','Scanner portable','Imprimante polymère','Scanner 3D','Kit médical','Kit technique','Cyberconsole Neurodive','Kit hardline'];
const weapons=['Couteau de combat','Owl KA-73 Last Encounter','Phoenix PCK-08 Feather','Raven AR-027 Rampager','Owl SR-029 Hoot','Bastion','Manticore','Hellstorm','Doorbell','Breacher','Wasp','Wallbreaker','Salamander','Purifier'];
const aug=['Teinte dermique modulable','Lentilles polychromes','Tatouage lumineux','Cheveux artificiels','CyberAudio','CyberOeil','Anticorps robotiques','Armure dermique','Poche dermique','Cyberbras','Support de membres surnuméraires','Support multioptique','Bio tatouage'];
const groups=[
 ['Neuroprogrammes',neuro,equipment,{}],['Mobilité',mobility,equipment,{}],['Services',services,equipment,{}],['Logements',lodging,equipment,{}],['Matériel',tech,equipment,{}],['Armement',weapons,equipment,{}],['Augmentations repères',aug,augmentations,{contains:true}],
];
let totalMissing=0;for(const [label,names,pages,opts] of groups)totalMissing+=check(label,names,pages,opts).length;
const sample=equipment.slice(0,3).map(p=>({id:p.id,title:p.title,keys:Object.keys(p).sort(),tags:p.tags,source:p.source}));
console.log(`EQUIPMENT SAMPLE ${JSON.stringify(sample)}`);
if(totalMissing)throw new Error(`Couverture catalogue incomplète: ${totalMissing} repère(s) manquant(s)`);
console.log('CATALOG COVERAGE OK — repères mécaniques résiduels couverts par les datasets dédiés.');
