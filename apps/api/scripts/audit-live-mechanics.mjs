import {access,mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {terraUmbraTruthRules as truth} from '../dist/rules/truth/rules.js';
import {truthRuntimeStructure} from '../dist/rules/truth/runtime-structure.js';
import {terraUmbraCreationRules as reality} from '../dist/rules/terra-umbra-creation.js';
import {terraUmbraCreationRules as realityBaseline} from '../dist/rules/terra-umbra-creation-base.js';
import {realityTalentRevision} from '../dist/rules/reality-talents-revision.js';
import {V9_MISSING_AUGMENTATIONS} from '../dist/rules/reality-v9-augmentations.js';
import {getRealityRules} from '../dist/rules/reality.js';
import {dedicatedPowerIds} from '../dist/rules/live-mechanics.js';
import {livePowerRegistry} from '../dist/rules/live-power-registry.js';
import {truthWeaponProfiles} from '../dist/rules/live-truth-items.js';
import {vampirePowerRules} from '../dist/rules/live-vampire.js';
import {lightningIds} from '../dist/rules/lightning.js';
import {actionRestrictionIds} from '../dist/rules/live-action-restrictions.js';
import {frenzyDedicatedIds} from '../dist/rules/live-frenzy-ids.js';
import {occultPowerIds} from '../dist/rules/occult-resolution.js';
import {targetedRules,interpositionRules} from '../dist/rules/targeted-powers.js';
const gameplayAudit='audit-gameplay-and-ux-20261010.md',lightningAudit='audit-lightning-variants-20261009.md',restrictionAudit='audit-action-restrictions-20261009.md';
const lightningCoverage=new Map([
 [lightningIds.foudre,{implemented:['R et Conduction possédée ; 1 PA ; Volonté + Maîtrise spirituelle ; cible à 20 m maximum ; marge + DGT 7 moins protection électrique, sans paliers de Tir ni Armure ordinaire.'],remaining:['Distance, trajectoire et défense pertinente confirmées avec le MJ ; protection sans valeur électrique explicite arbitrée par le MJ.']}],
 [lightningIds.paratonnerre,{implemented:['SR/R et prérequis possédés ; réaction 1 PA, 1/round avant défense ; personnel ou un allié à 5 m maximum selon la révision Aseryn finale ; Jet de Foudre opposé ; dégâts annulés en réussite ; Edge avant/après avec rejeu contrôlé.'],remaining:['Conducteur ou zone valide proche, alliance et perception confirmés ; ne renvoie pas la décharge offensivement ; une seule intervention, pas de chaîne.']}],
 ...[[lightningIds.orage,7,2,'Zone de rayon 3 m, cibles réelles sélectionnées et centre à 20 m.'],[lightningIds.originelle,9,1,'Enseignement créateur réellement acquis confirmé.'],[lightningIds.deferlement,13,2,'1/scène ; part magique de la protection électrique identifiée par le MJ, seule cette part est ignorée.'],[lightningIds.noire,7,1,'Enseignement spirituel confirmé ; discrétion descriptive.'],[lightningIds.fulguration,7,1,'1/scène ; composante immatérielle exposée et perçue, arbitrage MJ.'],[lightningIds.eclipse,9,2,'1/scène ; jusqu’à trois cibles immatérielles réellement perçues ; chemin distinct contre un effet métaphysique temporaire réellement suivi.'],[lightningIds.vaporeuse,7,1,'Érosion d’une couche directement touchée par sacrifice de 2 DGT, décision MJ et état persistant.'],[lightningIds.silence,7,1,'Enseignement de la Fin confirmé ; discrétion descriptive ; blessures Trace/Fin traitées si ces passifs sont réellement disponibles.'],[lightningIds.trait,9,1,'1/scène ; protection électrique divisée par deux ; coût final révisé de 1 PA ; blessures Trace/Fin traitées si disponibles.']].map(([id,damage,cost,detail])=>[id,{implemented:[`Attaque ciblée : ${cost} PA ; marge + DGT ${damage} ; portée 20 m ; prérequis et Révélation vérifiés côté serveur.`,detail],remaining:['Enseignement, perception, trajectoire et protections pertinentes confirmés ; discrétion, classifications occultes et vulnérabilité spirituelle restent arbitrées.']}]),
 [lightningIds.arc,{implemented:['Après impact électrique réel : un seul rebond sur une autre cible à 3 m maximum ; même résultat offensif, DGT 5, défense normale ; 1/scène, fenêtre et rejeu contrôlés.'],remaining:['Proximité, trajectoire et conducteur réels confirmés ; aucune chaîne automatique.']}],
 [lightningIds.ruine,{coverage:'calcul passif ciblé / confirmation MJ',implemented:['Foudre vaporeuse disponible et couche réellement touchée : sacrifice de 2 DGT ; érosion −3 au lieu de −2, y compris une protection surnaturelle sans matérialité ; une fois par couche/scène.'],remaining:['Couche, valeur de Protection, matérialité et contact direct confirmés par le MJ ; pas de bonus universel contre toute défense.']}],
 [lightningIds.atteindre,{coverage:'métadonnées / arbitrage MJ',implemented:['Pré-requis et Révélation vérifiés ; les attaques de spécialisation Esprit portent la métadonnée de traversée des obstacles matériels.'],remaining:['Terrain, couvert, cible immatérielle réellement perçue et trajectoire restent confirmés ; aucun moteur de visibilité ou détection automatique.']}],
 [lightningIds.trace,{coverage:'blessures ciblées / régénération contrôlée',implemented:['Pertes réelles dues à la Foudre du Silence suivies sur PJ/PNJ jusqu’à fin de scène ; plafond de régénération surnaturelle abaissé sans retirer des PV déjà présents ; soins externes/récupération ordinaire peuvent réduire la trace.'],remaining:['Le suivi concerne les commandes Garou, nanitiques, Vampire et les effets déclarés comme régénération ; anatomie, reconstitution fictionnelle et sources non représentées restent à arbitrer.']}],
 [lightningIds.fin,{coverage:'destruction ciblée / confirmation MJ',implemented:['Sur impact Silence réellement mortel : confirmation MJ du Fléau/engeance, vulnérabilité et conditions de destruction ; état final persistant empêchant survie et régénération automatiques ; Grâce MJ explicite.'],remaining:['Aucune vulnérabilité spirituelle déduite automatiquement ; un Fléau majeur ne devient pas destructible par seul jet, nom ou case de Talent.']}],
 ...[lightningIds.briseMagie,lightningIds.affliction,lightningIds.poussiere].map(id=>[id,{implemented:['Résolution contre un effet PJ/PNJ réellement suivi : opposition à sa Puissance, évolution/destruction/suspension selon sa classification canonique ; versions et source contrôlées.'],remaining:['Classification temporaire, maintenue, durable ou interruptible et Puissance décidées par le MJ ; pas de Souillure/Corruption effacée automatiquement ni de transformation arbitraire d’un texte en effet.']}])
]);
const restrictionCoverage=new Map([
 [actionRestrictionIds.crest,{implemented:['Début de round et 1/scène : +1 PA physique réservé, plafond 4, aucun cumul avec autre gain direct ; contrôle serveur des dépenses admissibles.'],remaining:['Début de round réel et contexte confirmés ; pas de Tir, Magie, Neuro ou PA par round supplémentaire.']}],
 [actionRestrictionIds.between,{implemented:['1 PA sous pression, 1/scène ; interdit attaques physiques et manipulations lourdes ; +3 uniquement à Défense active contre le purement physique ; sortie dédiée au début d’activation.'],remaining:['Passage et sortie matériellement possibles confirmés ; aucune Défense passive ou protection universelle.']}],
 ...[...frenzyDedicatedIds].map(id=>[id,{implemented:[id==='furie_de_survie'?'Traversée réelle sous 50% puis 25% des PV, une fois par seuil/scène ; +3 au prochain test physique avant fin du round suivant ; pas de déclencheur par simple forme/maximum.':id.includes('rage_lucide')?'Frénésie volontaire réellement active : ignore le −3 de concentration et conserve la reconnaissance des proches ; ne dispense pas de l’Impulsion.':id.includes('fureur_croissante')?'Entrée volontaire contrôlée, 1 PA sous pression ; +1/+2/+3 physique par rounds réellement écoulés ; interruption et nouvelle entrée suivies.':'Frénésie volontaire Morrighan Révélé ; +3 physique sans PA supplémentaire ; cause et Impulsion enregistrées.'],remaining:['Cause, Impulsion, obstacle reconnu et origine de la peur explicitement déclarés ; au moins un PA réellement consacré à l’Impulsion si possible ; aucune attaque ou cible forcée automatiquement.']}])
]);
const occultCoverage=new Map(Object.values(occultPowerIds).map(id=>[id,{implemented:[id===occultPowerIds.phantasm?'Libération réelle puis opposition Maîtrise spirituelle / Défense occulte ; condition narrative finie avec durée explicite décidée par le MJ.':'Libération réelle puis opposition Autorité / Défense occulte ; condition ciblée avec durée canonique ; Souveraineté admet plusieurs cibles à 15 m, Décret ouvre la résistance prévue contre une violation réelle.','Consentement allié ou choix de défense propriétaire/MJ ; source, jet, versions, coûts déjà payés et rejeu vérifiés.'],remaining:['Ordre/illusion, perception, légitimité narrative et effets réellement possibles arbitrés ; aucune prise de contrôle ou exécution automatique de la fiction.']}]));
const targetedCoverage=new Map([
 ...lightningCoverage,
 ...targetedRules.map(r=>[r.id,{implemented:[r.context,`Coût ${r.cost} PA sous pression ; consentement du bénéficiaire ou application MJ ; mutation atomique et rejeu contrôlé.`],remaining:['Contact, blessure ordinaire ou support porté confirmé dans la fiction.']}]),
 ...interpositionRules.filter(r=>!r.id.startsWith('trait:')).map(r=>[r.id,{implemented:[`Réaction avant défense/résolution ; 1 PA ; quota ${r.limit??'aucun'} ; portée ${r.range??'proximité physique confirmée'}.`,r.kind==='redirect'?'Changement de cible ; protections et défense du véritable intervenant.':'Jet Agilité + Esquive ; meilleure défense conservée pour le bénéficiaire.'],remaining:['Alliance, perception et trajectoire physiquement possibles confirmées ; une intervention par attaque.']}]),
 ['riposte_du_gardien',{implemented:['Après interposition du Gardien : +3 au prochain jet d’attaque contre le même agresseur, jusqu’à la fin du round suivant ; consommation au jet.'],remaining:['Déplacement et interposition physiquement possibles confirmés.']}],
 ['exile-riposte-d-ashorn',{implemented:['Après défense active réussie contre Mêlée/Pugilat : attaque normale immédiate contre l’agresseur à portée ; 0 PA supplémentaire ; 1/scène.'],remaining:['Portée réelle confirmée ; riposte à lancer avant résolution ou annulation de l’attaque initiale.']}]
]);
// A definition in a module is distinct from execution through a target resolver.
const realityAudit=JSON.parse(await readFile('../../docs/operations/audit-reality-coverage-20261009.json','utf8'));
const realityRows=new Map(realityAudit.entries.map(r=>[r.family+':'+r.id,r]));
const inventoryOnlyImplementation='Inventaire / acquisition / attribution MJ et affichage du profil canonique.';
const ablativeItemIds=new Set(['armures-basiques-raven-black-feathers','armures-basiques-owl-bullets-fear','armures-basiques-phoenix-sun-shield','armures-basiques-byron-punk-life','modules-d-armure-plaques-ablatives']);
for(const r of realityAudit.entries)if(r.family==='equipment'&&ablativeItemIds.has(r.id)){
 const implemented=r.id==='modules-d-armure-plaques-ablatives'?'Plaques réellement montées sur une armure sélectionnée : +1 pendant deux impacts matériels applicables ; pas de cumul de modules identiques.':'Charges Ablatif par exemplaire/UID ; un impact applicable consomme une charge, même sans PV perdus ; bonus typé disparaît à zéro, autres couches conservées.';
 if(!r.implemented.includes(implemented))r.implemented.push(implemented);
 r.pending=['Port effectif, compatibilité et montage confirmés ; remplacement/recharge réellement disponible, réservé au MJ en combat ; aucune remise à zéro par round, scène ou scénario.'];
}
const truthItemResourceCoverage=new Map([
 ['verite-24-brigandine-de-garde',{implemented:['Armure matérielle 2 proposée parmi les objets possédés ; Rune −3 sur la première source surnaturelle positive d’une attaque contre laquelle la Brigandine est réellement sélectionnée ; charge par scénario.'],remaining:['Port et compatibilité confirmés ; sources sans sélection de protection portée restent arbitrées.']}],
 ['verite-24-jeton-de-garde',{implemented:['Réaction contre dommages surnaturels positifs : −2, 1 PA ordinaire payé ; copie possédée détruite une seule fois et non recréée par scène/scénario.'],remaining:['Réaction possible, perception et portée réelles ; une copie supplémentaire doit être réellement acquise.']}],
 ['verite-25-blaster-atomus',{implemented:['Mode rafale/concentré conservé ; changement gratuit une fois par activation serveur ; aucun tir supplémentaire gratuit.'],remaining:['Vecteur énergétique et morphologie arbitrés ; lancement MJ confirmé ; munitions de rafale/suppression ne sont pas déduites du nombre d’impacts.']}],
 ['verite-26-custodian-ar-9',{implemented:['Mode standard/perforant persistant ; changement 1 PA sous pression en plus de l’attaque ; autorisation réelle confirmée ; réserve seulement si déclarée.'],remaining:['Le perforant consomme davantage de matière : nombre réel déclaré, aucun multiplicateur universel inventé ; signature AIDH et suppression sont contextuelles.']}],
 ['verite-26-duplex-ar-12',{implemented:['Mode assaut/dispersion persistant ; changement 1 PA sous pression ; dispersion une seule cible, consomme exactement 3 unités de réserve déclarée ; rejeu atomique avec le PA.'],remaining:['Aucune réserve initiale de 1 500 inventée à partir d’une estimation ; verrou AIDH, port et compatibilité confirmés.']}],
 ['verite-26-helios-pr-8',{implemented:['Usage intensif déclaré interdit un autre usage intensif jusqu’à la prochaine activation ; tir ordinaire conservé ; nouvel affrontement ne prolonge pas un refroidissement passé.'],remaining:['Vecteur Plasma et qualification de l’usage intensif arbitrés ; aucun dégât de feu périodique créé gratuitement.']}]
]);
const realitySources=new Map();
const sourceRef=(file,selector)=>`${file}#${selector}`;
function talentSources(items,selector){
 for(const [i,t] of items.entries()){
  const definitionSource=sourceRef('apps/api/src/rules/terra-umbra-creation-base.ts',`terraUmbraCreationRules.talents.${selector}[${i}]`);
  realitySources.set('talent:'+t.id,realityTalentRevision[t.id]
   ?{source:sourceRef('apps/api/src/rules/reality-talents-revision.ts',`realityTalentRevision[${JSON.stringify(t.id)}].effect`),definitionSource}
   :{source:definitionSource});
 }
}
for(const family of ['origin','sphere'])for(const [group,items] of Object.entries(realityBaseline.talents[family]))talentSources(items,`${family}[${JSON.stringify(group)}]`);
for(const family of ['common','expertise'])talentSources(realityBaseline.talents[family],family);
async function catalogSources(file,family,selector,compressed=false){
 const text=await readFile('../../'+file,'utf8');
 const raw=JSON.parse(compressed?gunzipSync(Buffer.from(text.replace(/\s+/g,''),'base64')).toString('utf8'):text);
 const entries=selector==='catalog.entries'?raw.catalog.entries:raw.entries;
 for(const [i,item] of entries.entries())realitySources.set(family+':'+item.id,{source:sourceRef(file,`${selector}[${i}]`),canonical:item});
}
await catalogSources('compendium/source/current-equipment-catalog-v1.json','equipment','catalog.entries');
await catalogSources('character-builder/rulesets/terra-umbra/reality/safe/neuroprograms.part01.b64','equipment','entries',true);
await catalogSources('character-builder/rulesets/terra-umbra/reality/safe/vehicles.part01.b64','equipment','entries',true);
await catalogSources('character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64','augmentation','entries',true);
for(const [i,item] of V9_MISSING_AUGMENTATIONS.entries())if(!realitySources.has('augmentation:'+item.id))realitySources.set('augmentation:'+item.id,{source:sourceRef('apps/api/src/rules/reality-v9-augmentations.ts',`V9_MISSING_AUGMENTATIONS[${i}]`),canonical:item});
for(const r of realityAudit.entries){
 const provenance=realitySources.get(r.family+':'+r.id);
 assert(provenance,`Missing versioned Reality source: ${r.family}:${r.id}`);
 r.source=provenance.source;
 if(provenance.definitionSource)r.definitionSource=provenance.definitionSource;
 // Inventory, acquisition and display are useful operations, but are not a mechanical calculation.
 const calculated=r.implemented.some(text=>text!==inventoryOnlyImplementation);
 r.coverage=calculated?'calcul ciblé / contexte':r.family==='talent'?'texte / arbitrage MJ':'inventaire / arbitrage MJ';
}
const traitSources=new Map();
function traitSource(nature,t,selector,baseline){
 const definitionSource=sourceRef('apps/api/src/rules/truth/runtime-structure.ts',`truthRuntimeStructure.natures.${nature}.${selector}`);
 if(JSON.stringify(t)===JSON.stringify(baseline))return {source:definitionSource};
 assert.equal(nature,'extral',`Unexpected trait revision: ${nature}:${selector}`);
 if(t.id==='free-extral-talass-fractures')return {source:sourceRef('apps/api/src/rules/truth/extral-build.ts','applyExtralStructure (id="free-extral-talass-fractures")')};
 assert(baseline,`Unidentified added trait: ${nature}:${selector}`);
 return {source:sourceRef('apps/api/src/rules/truth/extral-build.ts',`innate[${JSON.stringify(t.name)}]`),definitionSource};
}
const truthItemsAudit=JSON.parse(await readFile('../../docs/operations/audit-truth-items-20261009.json','utf8'));
const rows=[];
const add=(family,item,coverage,details={})=>rows.push({family,id:item.id,name:item.name,source:item.compendiumId??null,canonicalEffect:item.effectDetails??item.effect??item.properties??null,coverage,...details});
const talents=[...Object.values(reality.talents.origin).flat(),...Object.values(reality.talents.sphere).flat(),...reality.talents.common,...reality.talents.expertise];
for(const t of new Map(talents.map(t=>[t.id,t])).values()){
 const r=realityRows.get('talent:'+t.id);add('Réalité · talents',t,r.coverage,{source:r.source,...(r.definitionSource?{definitionSource:r.definitionSource}:{}),implemented:r.implemented,manual:r.manual,remaining:r.pending,audit:'audit-reality-20261009.md'});
}
for(const [nature,items] of Object.entries(truth.catalogs))for(const t of items){
 const rule=livePowerRegistry.find(p=>p.nature===nature&&p.id===t.id),v=nature==='vampire'?vampirePowerRules[t.id]:null;
 let coverage='texte / activation assistée',implemented=[],remaining=['Cible, contexte, opposition et conséquences particulières à résoudre explicitement.'];
 if(targetedCoverage.has(t.id)){coverage=targetedCoverage.get(t.id).coverage??'résolution ciblée / réaction serveur';({implemented,remaining}=targetedCoverage.get(t.id));}
 else if(restrictionCoverage.has(t.id)){coverage='action dédiée / contraintes serveur';({implemented,remaining}=restrictionCoverage.get(t.id));}
 else if(occultCoverage.has(t.id)){coverage='résolution ciblée / opposition assistée';({implemented,remaining}=occultCoverage.get(t.id));}
 else if(rule){coverage=rule.route==='external'?'définition contrôlée / résolution externe':rule.route==='passive'?'calcul passif ciblé':'action dédiée / calcul ciblé';implemented=[`Route ${rule.route} ; coût ${rule.cost} PA ; quota ${rule.limit??'aucun'} ; durée ${rule.duration}.`,...rule.effects.map(e=>`${e.kind} ${e.amount}${e.skills?' : '+e.skills.join(', '):''}.`)];remaining=[rule.notes,...(rule.context?[rule.context]:[])];}
 else if(dedicatedPowerIds.has(t.id)){coverage='action dédiée / quota serveur';implemented=['Défense spéciale, réparation nanitique ou récupération selon identifiant explicite.'];}
 else if(v){coverage=['vampire','defense','passive'].includes(v.route)?'ressource / action dédiée':'activation assistée / coût contrôlé';implemented=[`Route ${v.route} ; coût ${v.cost} PA ; quota ${v.limit??'aucun'} ; entretien ${v.maintenance??0} PA/round.`];}
 else if(['mage','daemon','angelus'].includes(nature)){coverage=nature==='mage'?'construction / ressource dédiée':'ressource / activation assistée';implemented=['Préparation et ressources de Nature via commandes dédiées ; le coût doit être fixe et défini pour être exécuté.'];remaining=['Le journal de préparation/activation ne résout pas automatiquement la cible, la zone, les soins/transferts ou les conséquences narratives.'];}
 add('Vérité · '+nature,t,coverage,{access:t.access??'R',implemented,remaining,audit:lightningCoverage.has(t.id)?lightningAudit:restrictionCoverage.has(t.id)?restrictionAudit:occultCoverage.has(t.id)?gameplayAudit:targetedCoverage.has(t.id)?'audit-targeted-reactions-20261009.md':nature==='vampire'?'audit-vampire-20261009.md':['mage','daemon','angelus'].includes(nature)?'audit-nature-resources-20261009.md':'audit-truth-capabilities-20261009.md'});
}
for(const [nature,n] of Object.entries(truth.structure.natures)){
 let flatIndex=0;
 const baseline=truthRuntimeStructure.natures[nature];
 const addTrait=(t,selector,auditId,base)=>{
  const provenance=traitSource(nature,t,selector,base);
  traitSources.set(auditId,{...provenance,name:t.name,effect:t.effect});
  const guardian=nature==='garou'&&t.name==='Gardien de la Meute';
  add('Traits · '+nature,{...t,id:`trait:${flatIndex++}`},guardian?'réaction serveur / cible redirigée':'trait conditionnel / calcul partiel',{...provenance,...(guardian?{implemented:['Pelage Gris, Révélé ; réaction 1 PA avant défense ; allié à moins d’un Déplacement ; cible redirigée.']}:{}),remaining:guardian?['Alliance et trajectoire physiquement possibles confirmées ; une intervention par attaque.']:['Voir audit individuel des traits : attributs et profils corporels sont calculés ; un texte ne constitue pas une action automatique.'],audit:guardian?'audit-targeted-reactions-20261009.md':'audit-truth-items-20261009.md'});
 };
 for(const [i,t] of n.baseFreeTraits.entries())addTrait(t,`baseFreeTraits[${i}]`,`${nature}:base:${i}`,baseline.baseFreeTraits[i]);
 for(const [i,rule] of n.freeTraitRules.entries())for(const [j,t] of rule.traits.entries())addTrait(t,`freeTraitRules[${i}].traits[${j}]`,`${nature}:choice:${i}:${j}`,baseline.freeTraitRules[i]?.traits[j]);
}
for(const t of truthItemsAudit.freeTraits){
 const provenance=traitSources.get(t.id);
 assert(provenance,`Missing trait provenance: ${t.id}`);
 assert.equal(t.name,provenance.name,`Trait audit identity mismatch: ${t.id}`);
 assert.equal(t.canonicalEffect,provenance.effect,`Trait audit effect mismatch: ${t.id}`);
 t.source=provenance.source;
 if(t.nature==='garou'&&t.name==='Gardien de la Meute')Object.assign(t,{coverage:'Réaction dédiée',implemented:'Révélé, Pelage Gris : interposition 1 PA avant défense, portée strictement inférieure au Déplacement ; change la cible.',pending:'Alliance et trajectoire physiquement possibles confirmées ; une intervention par attaque.'});
 if(provenance.definitionSource)t.definitionSource=provenance.definitionSource;
}
assert.equal(truthItemsAudit.freeTraits.length,traitSources.size);
truthItemsAudit.sourceFiles=truthItemsAudit.sourceFiles.filter(file=>file!=='.v2-rules-data (Réalité seulement)');
for(const file of ['apps/api/src/rules/truth/runtime-structure.ts','apps/api/src/rules/truth/extral-build.ts'])if(!truthItemsAudit.sourceFiles.includes(file))truthItemsAudit.sourceFiles.push(file);
for(const t of truth.corruption.talents)add('Vérité · corruption',t,'acquisition / arbitrage MJ',{remaining:['Dons/Rites/Faveurs, Souillure et Test de Bascule ne sont pas un moteur universel de résolution.'],audit:'audit-truth-capabilities-20261009.md'});
for(const t of truth.equipment){
 const profiles=truthWeaponProfiles.filter(w=>w.sourceId===t.id),resource=truthItemResourceCoverage.get(t.id),auditRow=truthItemsAudit.equipment.find(r=>r.id===t.id);
 assert(auditRow,`Missing individual Truth item audit: ${t.id}`);
 if(resource){
  auditRow.coverage=profiles.some(p=>p.requiresAdjudication)?'profil_assiste':'calcule_partiel';
  auditRow.implemented=[...profiles.map(w=>`${w.label} : DGT ${w.damage}, Perforant ${w.penetration}, ${w.damageType??'vecteur à arbitrer'}`),...resource.implemented].join(' ');
  auditRow.pending=resource.remaining.join(' ');auditRow.bindings=[...new Set([...auditRow.bindings,'live-item-resources','campaign-combat','character-live-mechanics'])];
 }
 add('Vérité · objets',t,resource?'ressource finie / résolution ciblée':profiles.length?'profil explicite / exceptions assistées':'inventaire / arbitrage MJ',{implemented:[...profiles.map(w=>w.label+' : DGT '+w.damage+', Perforant '+w.penetration+', '+(w.damageType??'vecteur à arbitrer')),...(resource?.implemented??[])],remaining:resource?.remaining??['Profils à vecteur inconnu : résolution assistée. Autres ressources, rites, véhicules et exceptions à consulter individuellement.'],audit:resource?gameplayAudit:'audit-truth-items-20261009.md'});
}
truthItemsAudit.counts.equipmentCoverage=Object.fromEntries([...new Set(truthItemsAudit.equipment.map(r=>r.coverage))].map(c=>[c,truthItemsAudit.equipment.filter(r=>r.coverage===c).length]));
for(const file of ['apps/api/src/rules/live-item-resources.ts','apps/api/src/rules/live-action-restrictions.ts','apps/api/src/rules/live-frenzy.ts'])if(!truthItemsAudit.sourceFiles.includes(file))truthItemsAudit.sourceFiles.push(file);
const equipment=getRealityRules();
for(const item of [...equipment.equipment,...equipment.augmentations]){
 const family=item.kind==='augmentation'?'augmentation':'equipment',r=realityRows.get(family+':'+item.id);
 const canonical=realitySources.get(family+':'+item.id)?.canonical;
 assert(canonical,`Missing catalog entry: ${family}:${item.id}`);
 const {_path,...loaded}=item.data;
 assert.deepEqual(loaded,item.neuro||item.vehicle||family==='augmentation'?canonical:canonical.data,`Loaded catalog differs from versioned source: ${family}:${item.id}`);
 add(family==='augmentation'?'Réalité · augmentations':'Réalité · équipement',item,r.coverage,{source:r.source,implemented:r.implemented,manual:r.manual,remaining:r.pending,audit:ablativeItemIds.has(item.id)?gameplayAudit:'audit-reality-20261009.md'});
}
const summary=Object.fromEntries([...new Set(rows.map(r=>r.family))].map(f=>[f,{total:rows.filter(r=>r.family===f).length,coverage:Object.fromEntries([...new Set(rows.filter(r=>r.family===f).map(r=>r.coverage))].map(c=>[c,rows.filter(r=>r.family===f&&r.coverage===c).length]))}]));
assert.equal(rows.length,2553);
assert.equal(new Set(rows.map(r=>r.family+':'+r.id)).size,rows.length);
assert.equal(realityAudit.entries.length,635);
assert.equal(summary['Réalité · équipement'].coverage['inventaire / arbitrage MJ'],189,'Plaques ablatives gains a real mounted/finite resource resolver; 190 was the previous inventory-only baseline');
for(const row of rows)assert.equal(typeof row.source==='string'&&row.source.trim().length>0,true,`Missing source: ${row.family}:${row.id}`);
const files=new Set([...rows,...realityAudit.entries,...truthItemsAudit.freeTraits].flatMap(r=>[r.source,r.definitionSource]).filter(s=>s?.includes('#')).map(s=>s.split('#')[0]));
for(const file of files)await access('../../'+file);
for(const audit of new Set(rows.map(r=>r.audit)))await access('../../docs/operations/'+audit);
await mkdir('../../docs/operations',{recursive:true});
await writeFile('../../docs/operations/audit-reality-coverage-20261009.json',JSON.stringify(realityAudit,null,2)+'\n');
await writeFile('../../docs/operations/audit-truth-items-20261009.json',JSON.stringify(truthItemsAudit,null,2)+'\n');
await writeFile('../../docs/operations/live-mechanics-inventory.json',JSON.stringify({date:'2026-10-10',scope:'Toutes les entrées des catalogues canoniques versionnés ; audit technique individuel complémentaire, sans prétendre automatiser tout le texte. Exclut les modifications conservées uniquement en base de production.',supplemental:'135 identifiants Mage générés, constructions typées et deux développements du second Spectre : audit-nature-resources-20261009.md ; procédures de cible, Frénésie, charges et UX : audit-gameplay-and-ux-20261010.md.',total:rows.length,summary,entries:rows},null,2)+'\n');
console.log(JSON.stringify({total:rows.length,summary},null,2));
