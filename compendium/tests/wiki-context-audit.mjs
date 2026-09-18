import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {createWikiLinker,WIKI_GENERIC_SINGLE} from '../wiki-links.js';
import {WIKI_EXPLICIT_TARGETS,WIKI_SEARCH_FALLBACKS,WIKI_STRICT_SURFACE_ALIASES,WIKI_CASE_SENSITIVE_ALIASES} from '../onboarding-data.js';
import {GUIDE_ARTICLES,GUIDE_NAVIGATION} from '../guide-articles.js';

const root=new URL('../',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('data/manifest-v3.json',root),'utf8'));
const navigation=JSON.parse(fs.readFileSync(new URL('data/navigation-v1.json',root),'utf8'));
const navEntries=[...(Array.isArray(navigation)?navigation:(navigation.entries||[])),...GUIDE_NAVIGATION];
const navById=new Map(navEntries.map(entry=>[entry.id,entry]));

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(new URL(`data/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,root),'utf8');
  const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64.replace(/\s+/g,''),'base64')).toString('utf8'));
  assert.ok(Array.isArray(rows),`${spec.id}: dataset non tabulaire`);
  return rows;
}
function normalized(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function articleContext(article,dataset){
  const nav=navById.get(article.id)||{};
  return {...article,dataset,category:nav.category||article.category||'',group:nav.group||'',subgroup:nav.subgroup||'',title:article.title||nav.displayTitle||nav.title||article.id};
}

const articles=[];
for(const spec of manifest.datasets)for(const row of loadDataset(spec))articles.push(articleContext(row,spec.id));
assert.equal(articles.length,manifest.expectedTotal,`Corpus wiki source: ${articles.length} articles, attendu ${manifest.expectedTotal}`);
for(const row of GUIDE_ARTICLES)articles.push(articleContext(structuredClone(row),'guide'));
assert.equal(articles.length,manifest.expectedTotal+GUIDE_ARTICLES.length,`Corpus wiki runtime: guides éditoriaux manquants`);
const ids=new Set(articles.map(a=>a.id));
const linker=createWikiLinker(articles,{explicitTargets:WIKI_EXPLICIT_TARGETS,strictSurfaceAliases:WIKI_STRICT_SURFACE_ALIASES,caseSensitiveAliases:WIKI_CASE_SENSITIVE_ALIASES,searchFallbacks:WIKI_SEARCH_FALLBACKS});
const explicitAliases=new Set(Object.keys(WIKI_EXPLICIT_TARGETS).map(normalized));
const anchorRe=/<a class="wiki-link"[^>]*data-wiki-id="([^"]+)"[^>]*>([^<]*)<\/a>/g;
let blocks=0,directLinks=0;
const byCategory=new Map();

function auditText(text,current){
  blocks++;
  const html=linker.linkify(text,current);anchorRe.lastIndex=0;let match;
  while((match=anchorRe.exec(html))){
    const [,targetId,label]=match;directLinks++;
    assert.ok(ids.has(targetId),`${current.id}: lien vers ID absent ${targetId}`);
    assert.notEqual(targetId,current.id,`${current.id}: auto-lien détecté sur ${label}`);
    const key=normalized(label);
    if(key&&!explicitAliases.has(key)&&!key.includes(' '))assert.ok(!WIKI_GENERIC_SINGLE.has(key),`${current.id}: nom commun auto-lié « ${label} » -> ${targetId}`);
    const target=navById.get(targetId);const cat=target?.category||'autre';byCategory.set(cat,(byCategory.get(cat)||0)+1);
  }
}

for(const article of articles){
  for(const section of article.sections||[])for(const block of section.blocks||[]){
    if(block?.type==='p')auditText(block.text||'',article);
    else if(block?.type==='table')for(const row of block.rows||[])for(const cell of row||[])auditText(cell||'',article);
  }
}

const crawlerContext={id:'audit-crawler',category:'Réalité',dataset:'lore',group:'Pègre, Crawlers & anti-systèmes',subgroup:'Crawlers',title:'Audit'};
const crawler=linker.linkify('Des réseaux de Crawlers assurent la circulation des contacts et des informations.',crawlerContext);
assert.doesNotMatch(crawler,/>réseaux<\/a>/i,'« réseaux » ne doit pas devenir un lien matériel générique');
assert.match(crawler,/data-wiki-id="realite-lore-crawlers-underlife"[^>]*>Crawlers<\/a>/i,'Crawlers doit privilégier sa page de lore');

const daemonContext={id:'audit-daemon',category:'Vérité',dataset:'verite',group:'Natures, peuples & traditions',subgroup:'Daemons',title:'Audit'};
const gods=linker.linkify('Les Daemons servent des Divinités. Belial est l’une de ces puissances.',daemonContext);
assert.match(gods,/data-wiki-id="verite-050-14-daemons"[^>]*>Daemons<\/a>/);
assert.match(gods,/data-wiki-id="verite-lore-anciennes-divinites"[^>]*>Divinités<\/a>/);
assert.match(gods,/data-wiki-id="verite-lore-divinite-belial"[^>]*>Belial<\/a>/);

const temple=linker.linkify('Le Temple de Belial organise ses fidèles.',daemonContext);
assert.match(temple,/data-wiki-id="lore-daemon-temples-temple-belial"[^>]*>Temple de Belial<\/a>/,'Le titre spécifique doit gagner sur le mot Belial seul');

const truthContext={id:'audit-truth-guide',category:'Vérité',dataset:'guide',group:'Entrer dans la Vérité',subgroup:'Guides du nouveau joueur',title:'Audit'};
const edgeContext={id:'audit-edge',category:'Règles',dataset:'moteur',group:'Réalité — Création & progression',subgroup:'Edge',title:'Edge'};
const edgeVerb=linker.linkify('Le personnage révèle un potentiel physique, mental ou social supérieur à ce que sa répartition initiale laissait encore apparaître.',edgeContext);
assert.doesNotMatch(edgeVerb,/data-wiki-id="verite-006-voile-semi-revele-revele"/,'Le verbe « révèle » ne doit jamais devenir un lien vers l’état Révélé');
const revealedState=linker.linkify('Un personnage Révélé exprime suffisamment sa Nature pour confronter le monde ordinaire à sa Vérité.',truthContext);
assert.match(revealedState,/data-wiki-id="verite-006-voile-semi-revele-revele"[^>]*>Révélé<\/a>/,'L’état Révélé doit rester lié');

const truthTerms=linker.linkify("Un être Voilé peut devenir Semi-Révélé puis Révélé. La Corruption commence par une Souillure. L'Ombremonde reste distinct.",truthContext);
assert.match(truthTerms,/data-wiki-id="verite-006-voile-semi-revele-revele"[^>]*>Voilé<\/a>/);
assert.match(truthTerms,/data-wiki-id="verite-006-voile-semi-revele-revele"[^>]*>Semi-Révélé<\/a>/);
assert.match(truthTerms,/data-wiki-id="verite-006-voile-semi-revele-revele"[^>]*>Révélé<\/a>/);
assert.match(truthTerms,/data-wiki-id="verite-056-20-corruption"[^>]*>Corruption<\/a>/);
assert.match(truthTerms,/data-wiki-id="verite-056-20-corruption"[^>]*>Souillure<\/a>/);
assert.match(truthTerms,/data-wiki-id="verite-023-l-ombremonde-le-reste-du-monde"[^>]*>L(?:&#39;|’)Ombremonde<\/a>/);

const elisions=linker.linkify("Les passages d’Aèr et l’Hologramme relient plusieurs couches de l’histoire.",truthContext);
assert.match(elisions,/data-wiki-id="verite-lore-aer-monde-et-heritages"[^>]*>Aèr<\/a>/,'d’Aèr doit pouvoir lier le nom Aèr malgré l’élision');
assert.match(elisions,/data-wiki-id="verite-002-le-voile-et-l-hologramme"[^>]*>Hologramme<\/a>/,'l’Hologramme doit pouvoir lier le concept malgré l’élision');

const khinaeTerms=linker.linkify('Les Khinae corrompus partagent une racine avec les Vampires, tandis que les Loups descendants de Khinae forment les Garous.',truthContext);
assert.match(khinaeTerms,/data-wiki-id="verite-lore-khinae-originels"[^>]*>Khinae corrompus<\/a>/);
assert.match(khinaeTerms,/data-wiki-id="verite-046-10-vampires"[^>]*>Vampires<\/a>/);
assert.match(khinaeTerms,/data-wiki-id="verite-047-11-garous-loups-descendants-de-khinae"[^>]*>Loups descendants de Khinae<\/a>/);

const ordinaryContext={id:'audit-ordinary',category:'Réalité',dataset:'realite',group:'Grande Californie & société',subgroup:'Vie quotidienne',title:'Audit'};
const ordinaryTerms=linker.linkify("La corruption municipale nourrit un cycle économique ; un chasseur de prime porte un voile devant le visage après une révélation divine.",ordinaryContext);
assert.doesNotMatch(ordinaryTerms,/data-wiki-id="verite-056-20-corruption"/,'La corruption ordinaire ne doit pas pointer vers la Corruption des Fléaux');
assert.doesNotMatch(ordinaryTerms,/data-wiki-id="verite-033-le-cycle-le-neant-et-ce-que-la-mort-revele"/,'Un cycle ordinaire ne doit pas pointer vers le Cycle cosmologique');
assert.doesNotMatch(ordinaryTerms,/data-wiki-id="verite-055-19-formation-et-doctrine-de-chasseur"/,'Un chasseur de prime ne doit pas pointer vers les Chasseurs');
assert.doesNotMatch(ordinaryTerms,/data-wiki-id="verite-002-le-voile-et-l-hologramme"/,'Un voile ordinaire ne doit pas pointer vers le Voile');
assert.doesNotMatch(ordinaryTerms,/data-wiki-id="verite-006-voile-semi-revele-revele"/,'Une révélation ordinaire ne doit pas pointer vers la Révélation surnaturelle');

const neuroCorruption={id:'realite-022-7-corruption-de-programmes-et-materiel',category:'Règles',dataset:'moteur',group:'Réalité — Neurodive',subgroup:'Règles de Neurodive',title:'7. Corruption de programmes et matériel'};
const neuroTerms=linker.linkify("Corruption sur échec narratif — le Neuroprogramme devient indisponible.",neuroCorruption);
assert.doesNotMatch(neuroTerms,/data-wiki-id="verite-056-20-corruption"/,'La Corruption logicielle Neurodive ne doit pas pointer vers les Fléaux');

const pegreContext={id:'regles-realite-talents-sphere-pegre',category:'Règles',dataset:'moteur',group:'Réalité — Talents & désavantages',subgroup:'Sphères',title:'Talents de Sphère — Pègre'};
const pegreCorruption=linker.linkify('Corruption locale',pegreContext);
assert.doesNotMatch(pegreCorruption,/data-wiki-id="verite-056-20-corruption"/,'La Corruption locale de la Pègre est une notion ordinaire de Réalité');

const garouContext={id:'verite-047-11-garous-loups-descendants-de-khinae',category:'Vérité',dataset:'verite',group:'Natures, peuples & traditions',subgroup:'Garous & descendants de Khinae',title:'11. Garous — Loups descendants de Khinae'};
const sangChasseur=linker.linkify('Le Sang Chasseur est l’une des directions de l’héritage de Khinae.',garouContext);
assert.match(sangChasseur,/data-wiki-id="regles-verite-garou-sang-chasseur-thorkel"[^>]*>Sang Chasseur<\/a>/,'Sang Chasseur doit pointer vers Thorkel, pas vers la doctrine humaine');

const hunterEquipment={id:'equipement-011-owl-lc-014-chasseur',category:'Équipement & Objets',dataset:'equipement',group:'Équipement de Réalité',subgroup:'Armement — Armes de jet & trait',title:'Owl LC-014 Chasseur'};
const hunterProduct=linker.linkify("Le LC-014 Chasseur est un lanceur de trait ; les Chasseurs de Vérité peuvent néanmoins l'utiliser.",hunterEquipment);
assert.doesNotMatch(hunterProduct,/data-wiki-id="verite-055-19-formation-et-doctrine-de-chasseur"[^>]*>Chasseur<\/a> est/,'Le nom du produit Chasseur ne doit pas devenir un lien de lore');
assert.match(hunterProduct,/data-wiki-id="verite-055-19-formation-et-doctrine-de-chasseur"[^>]*>Chasseurs<\/a>/,'La mention explicite des Chasseurs reste liée');

const vampireProduct={id:'equipement-009-phoenix-pw-026-vampire-killer',category:'Équipement & Objets',dataset:'equipement',group:'Équipement de Réalité',subgroup:'Armement — Armes de mêlée',title:'Phoenix PW-026 Vampire Killer'};
const vampireName=linker.linkify("La PW-026 Vampire Killer est un produit marketing ; elle n'est pas automatiquement efficace contre un Vampire.",vampireProduct);
const vampireLinks=(vampireName.match(/data-wiki-id="verite-046-10-vampires"/g)||[]).length;
assert.equal(vampireLinks,1,'Vampire Killer ne doit pas lier le mot du nom commercial ; la mention conceptuelle Vampire doit rester liée');

const equipmentContext={id:'audit-equipment',category:'Équipement & Objets',dataset:'equipement',group:'Équipement de Réalité',subgroup:'Vie quotidienne',title:'Audit'};
const exactEquipment=linker.linkify('Media Holonet / reseaux',equipmentContext);
assert.match(exactEquipment,/data-wiki-id="equipement-212-media-holonet-reseaux"/,'Un titre matériel exact reste cliquable vers son équipement');

const ammoReserve=linker.linkify("Sa grande réserve de munitions limite les rechargements.",equipmentContext);
assert.doesNotMatch(ammoReserve,/data-wiki-id="lore-gouvernement-grande-reserve"/,'Une grande réserve de munitions ne doit pas pointer vers la Grande Réserve amérindienne');
const geoReserve=linker.linkify("Tokala négocie pour la grande réserve des nations amérindiennes de Californie.",ordinaryContext);
assert.match(geoReserve,/data-wiki-id="lore-gouvernement-grande-reserve"[^>]*>(?:la )?grande réserve<\/a>/,'La Grande Réserve doit rester liée lorsque le contexte géographique est explicite');

const familyContext={id:'audit-family',category:'Équipement & Objets',dataset:'augmentations',group:'Augmentations',subgroup:'Audio',title:'Audit'};
const implantFamily=linker.linkify("Dans la famille Audio, les composants sont miniaturisés.",familyContext);
assert.doesNotMatch(implantFamily,/data-wiki-id="lore-pegre-la-famille"/,'Une famille d’implants ne doit pas pointer vers la mafia La Famille');
const mafiaFamily=linker.linkify("La Famille contrôle plusieurs intérêts mafieux.",ordinaryContext);
assert.match(mafiaFamily,/data-wiki-id="lore-pegre-la-famille"[^>]*>La Famille<\/a>/,'Le nom propre La Famille doit rester lié');

const cbacCorruption=linker.linkify("Californian Bureau of Abuses and Corruption (CBAC)",ordinaryContext);
assert.doesNotMatch(cbacCorruption,/data-wiki-id="verite-056-20-corruption"/,'La corruption institutionnelle du CBAC ne doit pas pointer vers la Corruption des Fléaux');
const occultCorruption=linker.linkify("Dans la Vérité, la Corruption par un Fléau commence souvent par une Souillure.",truthContext);
assert.match(occultCorruption,/data-wiki-id="verite-056-20-corruption"[^>]*>Corruption<\/a>/,'La Corruption surnaturelle doit rester liée');

const religiousAwakening=linker.linkify("Le principe bouddhiste d’éveil reste central dans cette religion.",ordinaryContext);
assert.doesNotMatch(religiousAwakening,/data-wiki-id="verite-007-se-reveler-n-est-pas-s-eveiller"/,'Un éveil religieux ordinaire ne doit pas pointer vers l’Éveil d’une Nature');
const supernaturalAwakening=linker.linkify("L’Éveil peut précéder la première Révélation consciente.",truthContext);
assert.match(supernaturalAwakening,/data-wiki-id="verite-007-se-reveler-n-est-pas-s-eveiller"[^>]*>Éveil<\/a>/,'L’Éveil surnaturel capitalisé doit rester lié');

const ordinaryEarth=linker.linkify("La terre est humide après la pluie.",ordinaryContext);
assert.doesNotMatch(ordinaryEarth,/data-wiki-id="pnj-060-terre"/,'Le nom commun terre ne doit jamais pointer vers le PNJ Terre');

const genericCatalog=linker.linkify("Le quartier combine sécurité privée, service juridique, réalité augmentée et une zone abandonnée.",ordinaryContext);
assert.doesNotMatch(genericCatalog,/data-wiki-id="equipement-210-securite-privee"/,'La sécurité privée générique ne doit pas pointer vers une fiche d’achat');
assert.doesNotMatch(genericCatalog,/data-wiki-id="equipement-209-service-juridique"/,'Le service juridique générique ne doit pas pointer vers une fiche d’achat');
assert.doesNotMatch(genericCatalog,/data-wiki-id="augmentation-086-realite-augmentee-holonet"/,'La réalité augmentée générique ne doit pas pointer vers une augmentation');
assert.doesNotMatch(genericCatalog,/data-wiki-id="equipement-219-squat-zone-abandonnee"/,'Une zone abandonnée générique ne doit pas pointer vers une fiche d’achat');

const bestiaryEquipment={id:'audit-bestiary-equipment',category:'Bestiaire',dataset:'bestiaire',group:'PNJ de Réalité',subgroup:'Corporations',title:'Audit'};
const weaponStat=linker.linkify('ATTAQUE — Raven SG-025 « Riot Control » — 1d10e + 10 • DGT 12 • Portée 15 m',bestiaryEquipment);
assert.match(weaponStat,/data-wiki-id="equipement-043-raven-sg-025-riot-control"/,'Une arme nommée dans un profil Bestiaire doit rester liée à sa fiche matériel');

console.log(`WIKI CONTEXT AUDIT OK — ${articles.length} articles · ${blocks} blocs audités · ${directLinks} liens directs · destinations: ${[...byCategory.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${v}`).join(' · ')}`);
