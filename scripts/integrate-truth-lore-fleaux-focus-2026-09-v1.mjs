import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE_PREFIX='compendium/source/fleaux-focus-2026-09-v1-';
const SOURCE_PARTS=12;
const SOURCE_DOCUMENT='TUC_Vérité_ les créatures_focus  sur les Fléaux(2).docx';
const BATCH='fleaux-focus-2026-09-v1';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
let sourceText='';for(let i=0;i<SOURCE_PARTS;i++)sourceText+=fs.readFileSync(`${SOURCE_PREFIX}${String(i).padStart(2,'0')}.jsonpart`,'utf8');
const source=JSON.parse(sourceText);
if(source.schemaVersion!==3||source.sourceDocument!==SOURCE_DOCUMENT||source.profiles?.length!==39||source.plagues?.length!==7)throw new Error('Source Fléaux focus invalide');

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9']+/g,' ').trim()}
function slug(value){return norm(value).replace(/\s+/g,'-')||'section'}
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function writeDataset(id,pages,prefix){
  const old=specFor(id).prefix;removePrefix(prefix);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  Object.assign(specFor(id),{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});
  if(old!==prefix)removePrefix(old);
  return {parts,count:pages.length};
}
function union(...groups){return [...new Set(groups.flat().filter(Boolean))]}
function pSection(title,paragraphs,{audience,idPrefix='fleaux-focus'}={}){
  return {id:`${idPrefix}-${slug(title)}`,title,level:3,...(audience?{audience}:{}),blocks:(paragraphs||[]).filter(Boolean).map(text=>({type:'p',style:'lore',text:String(text).trim()}))};
}
function appendSection(page,title,paragraphs,opts={}){
  const section=pSection(title,paragraphs,opts);page.sections=(page.sections||[]).filter(s=>s.id!==section.id&&norm(s.title)!==norm(title));page.sections.push(section);return section;
}
function pageById(pages,id){const matches=pages.filter(p=>p.id===id);if(matches.length!==1)throw new Error(`${id}: ${matches.length} page(s), attendu 1`);return matches[0]}
function plague(title){const p=source.plagues.find(x=>norm(x.title)===norm(title));if(!p)throw new Error(`Fléau source absent: ${title}`);return p}
function cult(plagueTitle,cultTitle){const p=plague(plagueTitle),c=p.cultes.find(x=>norm(x.title)===norm(cultTitle));if(!c)throw new Error(`Culte source absent: ${plagueTitle}/${cultTitle}`);return c}
function profileByHeading(heading,real=''){const matches=source.profiles.filter(p=>norm(p.heading)===norm(heading)&&(real?norm(p.metadata?.nomRealite)===norm(real):true));if(matches.length!==1)throw new Error(`Profil source ambigu/absent ${heading}${real?` / ${real}`:''}: ${matches.length}`);return matches[0]}
function loreParas(c){return [...(c.history||[]),...(c.functioning||[]),...(c.other||[])]}
function sourceProfileSections(pr){
  const sections=[];
  if(pr.metaLines?.length)sections.push({id:'fleaux-focus-dossier',title:'Dossier — Focus Fléaux',level:2,blocks:pr.metaLines.map(text=>({type:'p',style:'Normal',text}))});
  if(pr.reality?.length)sections.push({id:'fleaux-focus-realite',title:'Informations Réalité — Focus Fléaux',level:2,blocks:pr.reality.map(text=>({type:'p',style:'Normal',text}))});
  if(pr.truth?.length)sections.push({id:'fleaux-focus-verite',title:'Informations Vérité — Focus Fléaux',level:2,audience:'mj',blocks:pr.truth.map(text=>({type:'p',style:'Normal',text}))});
  if(pr.other?.length)sections.push({id:'fleaux-focus-informations',title:'Informations — Focus Fléaux',level:2,blocks:pr.other.map(text=>({type:'p',style:'Normal',text}))});
  return sections;
}
function cleanUnknown(v){const s=String(v||'').trim();return !s||s==='_'||s==='---'||s==='Aucun'? '':s}
function profileNav(pr){
  const race=norm(pr.metadata?.race),aff=norm(pr.metadata?.affiliations);
  if(/vampire/.test(race))return {group:'Figures de Vérité',groupOrder:70,subgroup:'Vampires',subgroupOrder:10,pageOrder:500};
  if(/humaine|humain/.test(race)&&/chasseur|crawler|merc/.test(aff))return {group:'Chasseurs',groupOrder:60,subgroup:'Chasseurs & réseaux de Chasse',subgroupOrder:10,pageOrder:500};
  if(/fleau superieur/.test(race))return {group:'Corruption & menaces',groupOrder:80,subgroup:'Fléaux & figures de Rupture',subgroupOrder:10,pageOrder:500};
  return {group:'Corruption & menaces',groupOrder:80,subgroup:'Abominations',subgroupOrder:20,pageOrder:500};
}
function enrichProfile(page,pr){
  const sameSource=/créatures_focus\s+sur les fléaux/i.test(String(page.source||''));
  if(sameSource){
    page.sections=(page.sections||[]).filter(s=>!['dossier','informations realite','informations verite'].includes(norm(s.title))&&!String(s.id||'').startsWith('pnj-'));
  }
  page.sections=(page.sections||[]).filter(s=>!String(s.id||'').startsWith('fleaux-focus-'));
  page.sections.push(...sourceProfileSections(pr));
  page.tags=union(page.tags||[],['Vérité','Fléaux','Focus Fléaux 2026-09'],[cleanUnknown(pr.metadata?.race),cleanUnknown(pr.metadata?.affiliations)]);
  page.loreSources=union(page.loreSources||[],[SOURCE_DOCUMENT]);
  if(!page.pnj)page.pnj={};
  const md=pr.metadata||{};
  if(cleanUnknown(md.nomVerite))page.pnj.nom_verite=cleanUnknown(md.nomVerite);
  if(cleanUnknown(md.race))page.pnj.race=cleanUnknown(md.race);
  if(cleanUnknown(md.age))page.pnj.age=cleanUnknown(md.age);
  if(cleanUnknown(md.origine))page.pnj.origine=cleanUnknown(md.origine);
  if(cleanUnknown(md.affiliations)){page.pnj.affiliations=cleanUnknown(md.affiliations);page.pnj.statut=page.pnj.statut||cleanUnknown(md.affiliations)}
  page.pnj.tags=union(page.pnj.tags||[],[cleanUnknown(md.race),cleanUnknown(md.affiliations)]);
  page.pnj.relations=union(page.pnj.relations||[],pr.relations||[]);
  page.pnj.completeness='detailed';
  page.loreBook={...(page.loreBook||{}),focusBatch:BATCH,focusSource:SOURCE_DOCUMENT};
}
function newProfilePage(id,title,pr){
  const md=pr.metadata||{},nav=profileNav(pr);
  return {id,title,category:'Personnages',source:SOURCE_DOCUMENT,status:'source_detaillee',tags:union(['Vérité','Fléaux','Focus Fléaux 2026-09'],[cleanUnknown(md.race),cleanUnknown(md.affiliations)]),nav,
    pnj:{nom_verite:cleanUnknown(md.nomVerite),race:cleanUnknown(md.race),age:cleanUnknown(md.age),origine:cleanUnknown(md.origine),statut:cleanUnknown(md.affiliations),statut_verite:'',portrait:'',tags:union([cleanUnknown(md.race),cleanUnknown(md.affiliations)]),relations:pr.relations||[],completeness:'detailed',affiliations:cleanUnknown(md.affiliations)},
    loreBook:{focusBatch:BATCH,focusSource:SOURCE_DOCUMENT},sections:sourceProfileSections(pr)};
}
function cultPage(id,title,sourceCult,pageOrder){
  const sections=[];
  if(sourceCult.history?.length)sections.push(pSection('Histoire',sourceCult.history,{idPrefix:`${id}-focus`}));
  if(sourceCult.functioning?.length)sections.push(pSection('Fonctionnement',sourceCult.functioning,{idPrefix:`${id}-focus`}));
  if(sourceCult.other?.length)sections.push(pSection('Compléments',sourceCult.other,{idPrefix:`${id}-focus`}));
  if(sourceCult.profiles?.length)sections.push(pSection('Figures liées',sourceCult.profiles.map(name=>`Voir la fiche de ${name}.`),{idPrefix:`${id}-focus`}));
  return {id,title,category:'Vérité',source:SOURCE_DOCUMENT,status:'canon_enrichi',tags:['Vérité','Fléaux','Cultes','Focus Fléaux 2026-09'],nav:{group:'Corruption & Fléaux',groupOrder:40,subgroup:'Cultes des Fléaux',subgroupOrder:30,pageOrder},loreBook:{focusBatch:BATCH,focusSource:SOURCE_DOCUMENT},sections};
}

const lore=loadDataset('lore'),pnj=loadDataset('pnj'),truth=loadDataset('verite');
const initial={lore:lore.length,pnj:pnj.length,truth:truth.length};

// 1. Context + six Fléaux + Delanial: enrich canonical pages, never replace V6 core.
appendSection(pageById(lore,'lore-plagues-contexte'),'Focus Fléaux — nature générale, hiérarchie et rapport au Néant',source.context,{idPrefix:'fleaux-focus'});
appendSection(pageById(truth,'verite-056-20-corruption'),'Focus Fléaux — corruption des mortels et annihilation',source.context.slice(5),{idPrefix:'fleaux-focus'});
appendSection(pageById(truth,'verite-057-21-les-six-fleaux-et-le-faux-septieme'),'Focus Fléaux — classification des entités',source.context.slice(0,5),{idPrefix:'fleaux-focus'});

const plagueTargets=[
  ["Mloxol v'aagor",'lore-plagues-mloxol-vaagor','Dossier détaillé — Mloxol V’Aagor'],
  ["Ux'sharith Bellatheis",'lore-plagues-uxsharith-bellatheis','Dossier détaillé — Ux’Sharith Bellatheis'],
  ["Vhodhal’nact'ru",'lore-plagues-vhodhal-nactru','Dossier détaillé — Vhodhal’nact’ru'],
  ["C'thath vhadhi",'lore-plagues-cthath-vhadhi','Dossier détaillé — C’Thath Vhadhi'],
  ["Gajh’ shaoggith",'lore-plagues-gajh-shaoggith','Dossier détaillé — Gajh’Shaoggith'],
  ["K'thuhuth'lul",'lore-plagues-kthuhuthlul','Dossier détaillé — K’thuhuth’lul / Thul'],
];
for(const [srcTitle,id,sectionTitle] of plagueTargets){const p=plague(srcTitle);appendSection(pageById(lore,id),sectionTitle,[...(p.intro||[]),...(p.info||[])],{idPrefix:'fleaux-focus'});}
const del=plague('Delanial');appendSection(pageById(lore,'lore-plagues-delanial'),'Dossier détaillé — Delanial',del.intro,{idPrefix:'fleaux-focus'});const father=cult('Delanial','Le père de L’Ombre');appendSection(pageById(lore,'lore-plagues-delanial'),'Le Père de l’Ombre — histoire et fonctionnement',loreParas(father),{idPrefix:'fleaux-focus'});

// 2. Six cult pages, only autonomous objects absent from corpus.
const newLore=[
  cultPage('lore-plagues-cultes-vaagor','Cultes de V’Aagor — Longinus, Œil Blanc, Fontaine, Faux et Gouffre',{title:'Cultes de V’Aagor',history:[],functioning:[],other:[],profiles:[]},10),
  cultPage('lore-plagues-cultes-uxsharith','Cultes d’Ux’Sharith — Saintes Lagunes, Bellatheis et Grand Savoir',{title:'Cultes d’Ux’Sharith',history:[],functioning:[],other:[],profiles:[]},20),
  cultPage('lore-plagues-cultes-vhodhal','Cultes de Vhodhal — Loge d’Écume et Sang d’Ivoire',{title:'Cultes de Vhodhal',history:[],functioning:[],other:[],profiles:[]},30),
  cultPage('lore-plagues-eden-gris','Le culte de l’Éden Gris',cult("C'thath vhadhi",'Le culte de l’Eden gris'),40),
  cultPage('lore-plagues-mere-primordiale','La Mère Primordiale',cult('Gajh’ shaoggith','La mère primordiale'),50),
  cultPage('lore-plagues-sombre-culte','Le Sombre Culte',cult("K'thuhuth'lul",'Le sombre Culte'),60),
];
function combinedCultSections(page,plagueTitle,names){page.sections=[];let order=0;for(const name of names){const c=cult(plagueTitle,name);if(c.history?.length)page.sections.push(pSection(`${name} — Histoire`,c.history,{idPrefix:`cult-${++order}`}));if(c.functioning?.length)page.sections.push(pSection(`${name} — Fonctionnement`,c.functioning,{idPrefix:`cult-${++order}`}));if(c.other?.length)page.sections.push(pSection(`${name} — Compléments`,c.other,{idPrefix:`cult-${++order}`}));if(c.profiles?.length)page.sections.push(pSection(`${name} — Figures liées`,c.profiles.map(x=>`Voir la fiche de ${x}.`),{idPrefix:`cult-${++order}`}));}}
combinedCultSections(newLore[0],"Mloxol v'aagor",['L’ordre de Longinus','La secte de l’œil blanc','La « fontaine de ténèbres »','La confrérie de la faux','Le Gouffre infini']);
combinedCultSections(newLore[1],"Ux'sharith Bellatheis",['L’ordre des Saintes Lagunes','La secte de Bellatheis','Le culte du Grand Savoir']);
combinedCultSections(newLore[2],"Vhodhal’nact'ru",['La Loge d’écume','Le sang d’ivoire']);
for(const page of newLore){if(lore.some(p=>p.id===page.id))throw new Error(`Nouvelle page déjà existante: ${page.id}`);lore.push(page)}

// 3. Cross-faction enrichments: short references, full lore remains on cult pages.
appendSection(pageById(lore,'lore-hunters-confreries'),'Ordres de Chasse passés sous influence des Fléaux',[
  'L’Ordre de Longinus, ancien ordre de Chasseurs chrétiens, a refusé la réforme qui devait l’absorber dans l’ordre d’Arianwen avant de devenir le masque d’une influence de V’Aagor.',
  'L’Ordre des Saintes Lagunes constitue un autre héritage de Chasse devenu inséparable de l’histoire d’Ux’Sharith et des Psycolors. Les dossiers complets sont conservés dans Corruption & Fléaux.'
],{idPrefix:'fleaux-focus'});
appendSection(pageById(lore,'lore-vampire-courts-oru-histoire'),'La Fontaine des Ténèbres et l’héritage oshirique',['Le dossier Fléaux rattache la Fontaine des Ténèbres à l’histoire de Neeba Ngubenani et des Oru Ayeraye. Le culte complet est détaillé dans les Cultes de V’Aagor.'],{idPrefix:'fleaux-focus'});
appendSection(pageById(lore,'lore-vampire-courts-krovni-histoire'),'Le Sang d’Ivoire',['Le Sang d’Ivoire apparaît dans le dossier de Vhodhal comme une tradition vampirique touchée par la Famine Blanche. Son histoire complète reste regroupée dans les Cultes de Vhodhal.'],{idPrefix:'fleaux-focus'});
appendSection(pageById(lore,'lore-extrals-groups-reptile'),'Mère Primordiale et Shaoggith',['Le dossier Fléaux relie une partie du réseau à la Mère Primordiale et à Gajh’Shaoggith ; ces éléments relèvent de la Vérité et sont détaillés dans la page dédiée au culte.'],{idPrefix:'fleaux-focus'});

// 4. Enrich 25 existing PNJs.
const existingProfiles=[
  ['Anastasia Vargas','pnj-083-anastasia-vargas'],
  ['L’ombre-Pape','pnj-100-ombre-pape-valentino-sombra'],
  ['Stephania Volkov','pnj-101-stephania-volkov'],
  ['Azaliah Springer','pnj-086-azaliah-springer'],
  ['Noah Brenneman','pnj-096-noah-brenneman'],
  ['Olayinka Najja','pnj-098-olayinka-najja'],
  ['Neals Corvo','pnj-truth-neals-corvo'],
  ['Mirrissi','pnj-095-mir-a-stephens'],
  ['Tellia Fedirivna Skrypnyk','pnj-103-tellia-fedirivna-skrypnyk'],
  ['Kennisha Arnold','pnj-089-kennisha-arnold'],
  ['Lidira','pnj-091-lidira'],
  ['Nora  Shakir','pnj-097-nora-shakir'],
  ['Ana Diana De la Caza','pnj-082-ana-diana-de-la-caza'],
  ['Yegor Karamovich','pnj-105-yegor-karamov','Yegor KARAMOV'],
  ['Yegor Karamovich','pnj-084-arkady-karamov','Arkady KARAMOV'],
  ['Selm Scytheri','pnj-102-sven-scythe'],
  ['Miluska Voroshilov','pnj-094-mila-shilove'],
  ['Maximilian Valentin Von Stroheim','pnj-093-maximilian-valentin-von-stroheim'],
  ['Aristaeus','pnj-085-arthur-savas'],
  ['Margareta Diaconescu','pnj-092-margareta-diaconescu'],
  ['Ulfric Tamer','pnj-104-ulfric-tamer'],
  ['Leona Elliott','pnj-090-leona-elliott'],
  ['Shy Krerath','pnj-081-aberration-z-87'],
  ['Olla Berwick','pnj-099-olla-berwick'],
  ['Grim','pnj-133-grim-grigoria-ravinsky'],
];
for(const [heading,id,real] of existingProfiles){enrichProfile(pageById(pnj,id),profileByHeading(heading,real||''))}

// 5. Create exactly 14 truly absent figures.
const newProfiles=[
  ['Neeba Ngubenani','pnj-fleaux-neeba-ngubenani','Neeba NGUBENANI'],
  ['Fredegonda','pnj-fleaux-fredegonda','Fredegonda VONRIM'],
  ['Baldwin de Vandrick','pnj-fleaux-baldwin-de-vandrick','Baldwin de Vandrick'],
  ['Rolf de Vandrick','pnj-fleaux-rolf-de-vandrick','Rolf de VANDRICK'],
  ['Raghnaid Maccalmain.','pnj-fleaux-raghnaid-maccalmain','Raghnaid MACCALMAIN'],
  ['Siadara','pnj-fleaux-siadara','Sianna DANEIN / Siadara'],
  ['le roi du givre','pnj-fleaux-roi-du-givre','Le Roi du Givre'],
  ['Ryong Myung-Sook','pnj-fleaux-ryong-myung-sook','RYONG Myung-Sook'],
  ['Am’Mleeac','pnj-fleaux-am-mleeac','Am’Mleeac'],
  ['« Dagon »','pnj-fleaux-dagon','Dagon / Aberration Z-19'],
  ['Telipinu','pnj-fleaux-telipinu','Telipinu / Aberration Z-75'],
  ['R’Sheraag','pnj-fleaux-r-sheraag','R’Sheraag / Aberration Z-45'],
  ["Dsherra'neth",'pnj-fleaux-dsherra-neth',"Dsherra'neth / Aberration Z-47"],
  ['Peste des vases','pnj-fleaux-pestiria','Pestiria — Peste des vases'],
];
for(const [heading,id,title] of newProfiles){if(pnj.some(p=>p.id===id))throw new Error(`PNJ nouveau déjà existant ${id}`);pnj.push(newProfilePage(id,title,profileByHeading(heading)))}

// Provenance/tags on touched lore/truth pages.
for(const pages of [lore,truth])for(const page of pages){if((page.sections||[]).some(s=>String(s.id||'').includes('fleaux-focus'))){page.tags=union(page.tags||[],['Focus Fléaux 2026-09']);page.loreSources=union(page.loreSources||[],[SOURCE_DOCUMENT]);page.loreBook={...(page.loreBook||{}),focusBatch:BATCH,focusSource:SOURCE_DOCUMENT}}}

if(lore.length!==initial.lore+6)throw new Error(`Lore: +6 attendu, ${initial.lore}->${lore.length}`);
if(pnj.length!==initial.pnj+14)throw new Error(`PNJ: +14 attendu, ${initial.pnj}->${pnj.length}`);
if(truth.length!==initial.truth)throw new Error('Vérité: aucun ajout de page attendu');
for(const pages of [lore,pnj,truth]){const ids=new Set();for(const page of pages){if(ids.has(page.id))throw new Error(`ID dupliqué ${page.id}`);ids.add(page.id)}}

const wl=writeDataset('lore',lore,'v3-lore-v11');
const wp=writeDataset('pnj',pnj,'v3-pnj-v3');
const wt=writeDataset('verite',truth,'v3-verite-lore-v13');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`FLÉAUX FOCUS 2026-09 — 6 pages lore créées · 14 PNJ créés · 25 PNJ enrichis · hubs et six Fléaux enrichis.`);
console.log(`LORE ${initial.lore}->${lore.length} (${wl.parts}) · PNJ ${initial.pnj}->${pnj.length} (${wp.parts}) · VÉRITÉ ${truth.length} (${wt.parts}) · TOTAL ${manifest.expectedTotal}.`);
