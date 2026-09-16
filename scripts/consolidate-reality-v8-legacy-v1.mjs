import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const BATCH='reality-v8-legacy-v1';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function load(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){if(!prefix)return;for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function writeDataset(id,pages,prefix){
  const spec=specFor(id),old=spec.prefix;removePrefix(old);if(prefix!==old)removePrefix(prefix);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  Object.assign(spec,{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});
}
function byId(pages,id){const page=pages.find(p=>p.id===id);if(!page)throw new Error(`Page absente: ${id}`);return page}
function p(text){return {type:'p',style:'lore reality-book-lore legacy-consolidation',text:String(text).trim()}}
function upsertSection(page,id,title,paragraphs){
  page.sections=page.sections||[];
  const section={id,title,level:3,blocks:paragraphs.map(p)};
  const index=page.sections.findIndex(s=>s.id===id);
  if(index>=0)page.sections[index]=section;else page.sections.push(section);
}

const legacyIds=[
  'lore-vie-quotidienne-urbanisme-strates',
  'lore-vie-quotidienne-alimentation-base',
  'lore-vie-quotidienne-alimentation',
  'lore-vie-quotidienne-logement-robotique',
  'lore-vie-quotidienne-transports-urbains',
  'lore-vie-quotidienne-transports-longue-distance',
  'lore-vie-quotidienne-energie',
  'lore-vie-quotidienne-materiaux',
  'lore-vie-quotidienne-holonet',
  'lore-vie-quotidienne-realite-augmentee-ia',
  'lore-vie-quotidienne-musique-mode',
  'lore-vie-quotidienne-cinema-jeux-sport',
  'lore-vie-quotidienne-sante',
  'lore-vie-quotidienne-sexualite',
  'lore-vie-quotidienne-medias-drogues',
  'lore-vie-quotidienne-augmentations-organiques',
  'lore-vie-quotidienne-augmentations-cyber',
  'lore-vie-quotidienne-troubles-augmentiques',
];
const legacySet=new Set(legacyIds);

let reality=load('realite');
let lore=load('lore');
const beforeReality=reality.length,beforeLore=lore.length;
const present=legacyIds.filter(id=>lore.some(page=>page.id===id));
if(present.length!==0&&present.length!==legacyIds.length)throw new Error(`Famille Réalité legacy partielle: ${present.length}/${legacyIds.length}`);

const material=byId(reality,'realite-lore-vie-materielle-2035');
const identity=byId(reality,'realite-lore-identite-culture-information');
for(const page of [material,identity]){
  if(page.realityBook?.batch!=='reality-setting-v1')throw new Error(`${page.id}: cible V8 book-first attendue`);
  page.realityLegacyConsolidation={batch:BATCH,sources:legacyIds,sourceDocuments:['TUC_Realite_V8_LIVRE_JDR_PAO_RESPIRATION_TOC_2026-09-09.docx','TUC_vie quotidienne.docx']};
}

// Cette matière provient d'une édition manuelle qui ciblait l'ancienne page
// lore-vie-quotidienne-alimentation-base. La page ayant été retirée après
// consolidation, son contenu utile est pérennisé ici au lieu de conserver
// un override orphelin.
upsertSection(material,'legacy-reality-alimentation-base-editee','Alimentation de base et production de masse',[
  'La ration universelle combine vitamines, protéines, lipides, sucres, sels minéraux et fibres afin de fournir l’essentiel de la dose quotidienne nécessaire à un être humain moyen. Il existe des variantes adaptées aux grandes tranches d’âge. Bon marché, compacte et volontairement peu séduisante, elle a été conçue comme assurance contre les famines et produite en quantités constantes.',
  'Les céréales — blé, riz, soja et autres cultures de masse — restent intensivement produites. Elles offrent une alimentation moins complète qu’une ration universelle mais beaucoup plus satisfaisante au quotidien et servent de base à une part considérable de l’industrie alimentaire.',
  'L’élevage d’insectes fournit des protéines, vitamines et autres nutriments en très grande quantité tout en valorisant des masses biologiques qui seraient autrement perdues, notamment des déchets végétaux. La matière obtenue est généralement reconditionnée en farines, pâtes ou purées utilisées dans d’innombrables préparations ; la consommation de l’insecte entier reste beaucoup moins courante.'
]);

upsertSection(identity,'legacy-reality-intimite-sexualite','Intimité, sexualité et présence à distance',[
  'La sexualité de 2035 reste d’abord une pratique sociale ordinaire, mais les augmentations, l’Holonet, la réalité virtuelle et les hologrammes ont élargi les manières d’habiter l’intimité. Une apparence peut être modifiée rapidement, des interfaces sensorielles peuvent transmettre des sensations à distance et certains dispositifs physiques peuvent être pilotés ou scénarisés par le réseau. Le couple, le mariage, la fidélité, la jalousie et l’attachement n’ont pas disparu pour autant : les technologies ont multiplié les pratiques sans remplacer les relations humaines.',
  'La compagnie intime et la prostitution sont légales et encadrées en Grande Californie. Réservation, paiement et identité professionnelle passent souvent par l’Holonet ; une partie du secteur descend de réseaux autrefois mafieux qui se sont transformés en entreprises déclarées. L’encadrement vise notamment à limiter l’exploitation et l’esclavage sexuel plutôt qu’à prétendre que le marché n’existe pas.',
  'La pornographie est devenue une branche majeure des industries immersives. Hologrammes, avatars, modifications d’apparence, réalité virtuelle et interfaces sensorielles permettent à un même acteur ou studio de produire des expériences très différentes. Les sexbots et dispositifs téléopérés brouillent volontairement la frontière entre jouet, spectacle enregistré et prestation à distance.',
  'La liberté technique n’efface ni le droit ni les tabous. Ce qui reste interdit par la loi demeure interdit lorsqu’une simulation prétend l’imiter, tandis que les normes morales varient fortement selon les communautés, les religions, les milieux professionnels et les choix personnels.'
]);

upsertSection(material,'legacy-reality-drogues-regulation','Drogues, stimulants et économie de rue',[
  'Le recul de certaines productions agricoles traditionnelles a déplacé une partie du marché des psychotropes vers la synthèse chimique, la biotechnologie et les produits conçus pour un monde connecté. Les substances classiques existent encore, mais elles côtoient des molécules destinées à surcharger les sens, interagir avec des augmentations ou accompagner une expérience virtuelle.',
  'Certaines drogues sont pensées spécifiquement pour les augmentations organiques ou sensorielles ; d’autres sont entièrement virtuelles et prennent la forme de logiciels capables de modifier brutalement une expérience de Neurodive. Le risque ne vient donc pas seulement de la toxicité : dépendance, surcharge sensorielle, Stress augmentique, perte de jugement et interaction avec un implant peuvent être tout aussi dangereux.',
  'Le statut d’un produit varie selon juridiction, corporation et réseau de distribution. Les catégories Libre, Contrôlé, Illégal et Crawler décrivent surtout l’accès social au produit ; la rue reste assez fournie pour que ces substances ne soient pas réservées aux riches, mais leur disponibilité n’en fait pas des améliorations sans conséquence.'
]);

upsertSection(identity,'legacy-reality-cyber-bio-culture','Cyber, biogénétique et cultures augmentiques',[
  'Cybermécanique et biogénétique ne sont pas deux générations d’une même technologie. Le Cyber privilégie le catalogue, la modularité, la réparation technique et les fonctions spécialisées ; il peut aussi offrir une surface d’attaque lorsqu’il reste connecté. La biogénétique est conçue à partir du patrimoine du bénéficiaire, demande culture et maturation, coûte beaucoup plus cher à fonction comparable, se soigne comme un tissu vivant et n’est normalement pas piratable en elle-même.',
  'Cette différence technique est devenue une différence culturelle. L’imaginaire populaire associe encore volontiers le Cyber visible aux ateliers, à la rue, au travail industriel et aux corps qui assument leur transformation, tandis que le Bio discret conserve une image de richesse, de médecine premium et d’intégration parfaite. Ces frontières se brouillent à mesure que les technologies se diffusent, mais elles continuent d’influencer la manière dont une augmentation est regardée.',
  'L’apparence augmentée est ainsi devenue un langage social. Montrer une articulation métallique, masquer complètement une prothèse sous une peau synthétique ou choisir un remplacement biologique raconte autant l’accès économique, la profession et l’appartenance culturelle que la simple fonction du dispositif.'
]);

upsertSection(identity,'legacy-reality-troubles-augmentiques','Stress augmentique, dépendance et identité corporelle',[
  'Dans le langage courant, les « troubles augmentiques » recouvrent plusieurs réalités différentes plutôt qu’un diagnostic unique. Une interface cybernétique complexe peut imposer une sollicitation neurologique permanente ; l’accumulation d’augmentations peut rendre certaines crises plus brutales lorsque le personnage est déjà en Surcharge ou sous forte pression. Le V8 traite cette tension par le Stress augmentique et, dans les cas aigus, par la Frénésie augmentique.',
  'La dimension psychologique ne se réduit pas à la violence. Une transformation répétée de l’apparence ou du schéma corporel peut compliquer la relation à son propre corps, tandis qu’une dépendance à la modification, à la stimulation ou à un traitement peut devenir aussi réelle qu’une dépendance à une substance. À cela s’ajoutent les dépendances économiques : entretien, médicaments, assurance ou implant financé par un employeur peuvent rendre un corps technologiquement performant mais contractuellement captif.',
  'La biogénétique possède ses propres complications. Le rejet existe, même s’il est normalement faible lorsque le traitement est correctement personnalisé ; des fonctions réellement nouvelles peuvent demander une adaptation corporelle et neurologique, et les interventions hormonales ou métaboliques peuvent produire des effets physiologiques aigus. Ces risques ne signifient pas qu’un Augmenté perd automatiquement son empathie, son identité ou son libre arbitre : ils décrivent des complications possibles, pas une personnalité obligatoire.'
]);

lore=lore.filter(page=>!legacySet.has(page.id));
if(lore.some(page=>legacySet.has(page.id)))throw new Error('Scories Réalité legacy encore présentes après consolidation');
if(present.length===legacyIds.length&&beforeLore-lore.length!==legacyIds.length)throw new Error(`Retrait Réalité legacy incomplet: ${beforeLore-lore.length}/${legacyIds.length}`);

const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+/i;
for(const page of [material,identity])for(const section of page.sections||[]){if(!String(section.id||'').startsWith('legacy-reality-'))continue;const text=(section.blocks||[]).map(block=>block.text||'').join(' ');if(forbidden.test(text))throw new Error(`${page.id}/${section.id}: mécanique chiffrée détectée`);if((section.blocks||[]).some(block=>block.type==='table'))throw new Error(`${page.id}/${section.id}: table interdite`)}

writeDataset('realite',reality,'v3-realite-v4');
writeDataset('lore',lore,'v3-lore-v9');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`CONSOLIDATION RÉALITÉ V8 — ${present.length} pages legacy retirées · 5 thèmes utiles fusionnés dans 2 pages book-first.`);
console.log(`RÉALITÉ ${beforeReality} -> ${reality.length} · LORE ${beforeLore} -> ${lore.length} · total V3 ${manifest.expectedTotal}.`);
