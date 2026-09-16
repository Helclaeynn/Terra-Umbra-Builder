import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const SOURCE_DIR='compendium/source';
const MANIFEST=`${SOURCE_DIR}/truth-mechanics-v6-fixed.manifest.json`;
const BUILDER_ROOT='character-builder/rulesets/terra-umbra/truth/talents';
const CHAPTER_SCOPE={10:'/vampire/',11:'/garou/',13:'/mage',14:'/daemon',15:'/angelus',16:'/aseryn/',17:'/exile/',18:'/extral/'};
const STOP=new Set('acces avec dans pour par sur sous une des les aux est sont etre être cette ce ces son sa ses leur leurs peut peuvent plus moins sans entre comme lors lorsque chaque tout toute tous toutes qui que quoi dont elle elles il ils lui afin alors apres après avant car donc mais ou où et ni si ne pas du de la le un au a à d l en y se s r sr ptv pa dr scene scène round tour test jet effet effets cible cibles action actions fois point points cout coût niveau voie talent talents capacite capacité'.split(/\s+/));

function sha(value){return crypto.createHash('sha256').update(value).digest('hex')}
function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function terms(value){return new Set(normalize(value).split(/\s+/).filter(word=>word.length>=3&&!STOP.has(word)&&!/^[0-9]+$/.test(word)))}
function jaccard(a,b){if(!a.size||!b.size)return 0;let hit=0;for(const item of a)if(b.has(item))hit++;return hit/(a.size+b.size-hit)}
function walkArrays(root){const rows=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.isFile()&&entry.name.endsWith('.json')){const parsed=JSON.parse(fs.readFileSync(full,'utf8'));if(Array.isArray(parsed))for(const item of parsed)if(item&&item.name)rows.push({...item,__file:full.replaceAll('\\','/')})}}}walk(root);return rows}
function locateCards(decoded){if(Array.isArray(decoded))return{cards:decoded,path:'$'};if(!decoded||typeof decoded!=='object')return{cards:null,path:null};for(const key of ['cards','entries','items','mechanics','techCards','tech_cards'])if(Array.isArray(decoded[key]))return{cards:decoded[key],path:`$.${key}`};const arrays=Object.entries(decoded).filter(([,value])=>Array.isArray(value)).sort((a,b)=>b[1].length-a[1].length);return arrays.length?{cards:arrays[0][1],path:`$.${arrays[0][0]}`}:{cards:null,path:null}}
function asObject(card,columns){if(!Array.isArray(card))return card||{};const out={};for(let i=0;i<card.length;i++)out[String(columns?.[i]??i)]=card[i];return out}
function clean(value){return value==null?'':String(value).trim()}
function mechanicTitle(value){
  let title=clean(value);
  title=title.replace(/\s*[—–-]\s*\d+\s*PTV\b.*$/i,'');
  const markers=[
    /(?=Acc[eè]s\s*:)/i,/(?=Profil\s*:)/i,/(?=Condition\s*:)/i,/(?=D[eé]finition\s*:)/i,
    /(?=Aspect\s*:)/i,/(?=Nature\s*:)/i,/(?=Culture de Maisonn[eé]e\s*:)/i,/(?=Bonus de Transcendance\s*:)/i,
    /(?=Ailes\s*:)/i,/(?=SR\s*:)/i,/(?=Limite\s*:)/i,/(?=Principe\s*:)/i,/(?=Difficult[eé] de base\s*:)/i,
    /(?=Contrecoup imm[eé]diat\s*:)/i,/(?=Ma[iî]trise min\.\s*:)/i,/(?=Test de r[eé]sistance\s*:)/i
  ];
  let cut=title.length;
  for(const marker of markers){const m=title.match(marker);if(m&&m.index<cut)cut=m.index}
  return title.slice(0,cut).trim().replace(/[|•—–-]+\s*$/,'').trim();
}
function inc(map,key,n=1){map.set(key,(map.get(key)||0)+n)}
function categoryCandidates(chapter,builder){const scope=CHAPTER_SCOPE[chapter];return scope?builder.filter(item=>item.__file.includes(scope)):[]}
function bestSemantic(row,builder){const candidates=categoryCandidates(row.chapter,builder),rowTitle=terms(row.title),rowText=terms(row.text);let best=null;for(const item of candidates){const titleScore=jaccard(rowTitle,terms(item.name)),effectScore=jaccard(rowText,terms([item.effect,item.description,item.access,item.prerequisiteName].filter(Boolean).join(' '))),combined=Math.max(effectScore,titleScore*.85,(effectScore*.8)+(titleScore*.2));if(!best||combined>best.score)best={item,score:combined,titleScore,effectScore}}return best}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
if(manifest.encoding!=='gzip+base64-parts')throw new Error(`Encodage V6 inattendu: ${manifest.encoding}`);
if(!Array.isArray(manifest.parts)||manifest.parts.length!==8)throw new Error(`Fragments V6: ${manifest.parts?.length||0}, attendu 8`);
let b64='';for(const part of manifest.parts){const file=`${SOURCE_DIR}/${part}`;if(!fs.existsSync(file))throw new Error(`Fragment V6 absent: ${part}`);b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'')}
const gzipBytes=Buffer.from(b64,'base64'),jsonBytes=zlib.gunzipSync(gzipBytes),decoded=JSON.parse(jsonBytes.toString('utf8'));
const hashes={base64:sha(Buffer.from(b64,'utf8')),gzip:sha(gzipBytes),json:sha(jsonBytes)},hashMode=Object.entries(hashes).find(([,value])=>value===manifest.sha256)?.[0]||null;if(!hashMode)throw new Error(`SHA V6 non reconnu: ${manifest.sha256}`);
const located=locateCards(decoded),rawCards=located.cards;if(!Array.isArray(rawCards)||rawCards.length!==882||rawCards.length!==manifest.entries)throw new Error(`Cartes V6: ${rawCards?.length||0}, attendu 882`);
const columns=Array.isArray(decoded?.columns)?decoded.columns:[],cards=rawCards.map(card=>asObject(card,columns));
if(!columns.includes('chapter')||!columns.includes('heading3')||!columns.includes('heading4')||!columns.includes('title')||!columns.includes('text'))throw new Error(`Colonnes V6 inattendues: ${JSON.stringify(columns)}`);

const builder=walkArrays(BUILDER_ROOT);if(builder.length!==347)throw new Error(`Builder Vérité: ${builder.length}, attendu 347`);
const builderByName=new Map();for(const item of builder){const key=normalize(item.name);if(!builderByName.has(key))builderByName.set(key,[]);builderByName.get(key).push(item)}
const rows=cards.map((card,index)=>{const rawTitle=clean(card.title),title=mechanicTitle(rawTitle),chapter=clean(card.chapter),h3=clean(card.heading3),h4=clean(card.heading4),h5=clean(card.heading5),text=clean(card.text),matches=builderByName.get(normalize(title))||[];return{index:index+1,rawTitle,title,chapter,h3,h4,h5,text,matches,exact:matches.length>0}});if(rows.some(row=>!row.title))throw new Error('Une carte V6 au moins ne possède pas de titre normalisé');

const chapterStats=new Map(),headingStats=new Map();for(const row of rows){if(!chapterStats.has(row.chapter))chapterStats.set(row.chapter,{total:0,exact:0,unmatched:0,titles:new Set()});const stat=chapterStats.get(row.chapter);stat.total++;stat.titles.add(normalize(row.title));if(row.exact)stat.exact++;else stat.unmatched++;const pathKey=[row.chapter,row.h3||'—',row.h4||'—',row.h5||'—'].join(' › ');if(!headingStats.has(pathKey))headingStats.set(pathKey,{total:0,exact:0,unmatched:0});const hs=headingStats.get(pathKey);hs.total++;if(row.exact)hs.exact++;else hs.unmatched++}
const exact=rows.filter(row=>row.exact),unmatched=rows.filter(row=>!row.exact),exactNames=new Set(exact.map(row=>normalize(row.title)));const v6NameCounts=new Map();for(const row of rows)inc(v6NameCounts,normalize(row.title));const duplicateV6Names=[...v6NameCounts.entries()].filter(([,count])=>count>1).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr'));const semantic=unmatched.filter(row=>CHAPTER_SCOPE[row.chapter]).map(row=>({...row,best:bestSemantic(row,builder)}));

console.log(`TRUTH V6 SOURCE — ${rows.length} cartes · 8 fragments · SHA ${hashMode} validé.`);console.log(`BUILDER — ${builder.length} capacités · ${builderByName.size} noms normalisés.`);console.log(`OVERLAP NORMALIZED TITLE — ${exact.length} cartes / ${exactNames.size} noms Builder distincts.`);console.log(`V6 REMAINING — ${unmatched.length} cartes.`);console.log(`V6 DUPLICATE TITLES — ${duplicateV6Names.length} noms répétés.`);
console.log('CHAPTER COVERAGE');for(const [chapter,stat] of [...chapterStats.entries()].sort((a,b)=>Number(a[0])-Number(b[0])))console.log(`  ch.${chapter}: ${stat.total} · Builder ${stat.exact} · restant ${stat.unmatched} · ${stat.titles.size} titres distincts`);
console.log('SEMANTIC CANDIDATES AFTER TITLE NORMALIZATION');for(const chapter of Object.keys(CHAPTER_SCOPE)){const scoped=semantic.filter(row=>row.chapter===chapter&&row.best),c70=scoped.filter(row=>row.best.score>=.70).length,c50=scoped.filter(row=>row.best.score>=.50).length,c35=scoped.filter(row=>row.best.score>=.35).length;console.log(`  ch.${chapter}: >=0.70 ${c70} · >=0.50 ${c50} · >=0.35 ${c35} / ${scoped.length}`);for(const row of scoped.sort((a,b)=>b.best.score-a.best.score).slice(0,8))console.log(`    ${row.best.score.toFixed(3)} | ${row.title} ~= ${row.best.item.name}`)}
console.log('UNMATCHED GROUP COUNTS');for(const [group,stat] of [...headingStats.entries()].filter(([,stat])=>stat.unmatched>0).sort((a,b)=>Number(a[0].split(' › ')[0])-Number(b[0].split(' › ')[0])||a[0].localeCompare(b[0],'fr')))console.log(`  ${group}: ${stat.unmatched}/${stat.total}`);
console.log('UNMATCHED SAMPLE BY CHAPTER');for(const chapter of [...new Set(unmatched.map(row=>row.chapter))].sort((a,b)=>Number(a)-Number(b))){console.log(`  CHAPTER ${chapter}`);for(const row of unmatched.filter(item=>item.chapter===chapter).slice(0,12))console.log(`    ${row.index} | ${row.h3||'—'} | ${row.h4||'—'} | ${row.h5||'—'} | ${row.title}`)}
