import assert from 'node:assert/strict';
import {livePowerRegistry,explicitPower,usableRegisteredPower,registeredTruthPowers,validatedPowerEffects} from '../dist/rules/live-power-registry.js';
import {truthCoreRules} from '../dist/rules/truth/core-rules.js';
import {terraUmbraCreationRules} from '../dist/rules/terra-umbra-creation.js';
const ids=new Set(),skills=new Set(terraUmbraCreationRules.skills.map(s=>s.id));
for(const rule of livePowerRegistry){
 assert(!ids.has(rule.id),'duplicate '+rule.id);ids.add(rule.id);
 assert(truthCoreRules.catalogs[rule.nature].some(t=>t.id===rule.id),rule.id);
 assert(Number.isSafeInteger(rule.cost)&&rule.cost>=0&&rule.cost<=2,rule.id+' cost');
 assert([null,'round','scene','day','scenario'].includes(rule.limit));
 assert(['test','scene','scenario'].includes(rule.duration)||Number.isSafeInteger(rule.duration)&&rule.duration>0);
 if(rule.testExpiresRounds!==undefined)assert(rule.duration==='test'&&Number.isSafeInteger(rule.testExpiresRounds)&&rule.testExpiresRounds>=0&&rule.testExpiresRounds<=1000);
 for(const effect of rule.effects){assert(Number.isSafeInteger(effect.amount)&&effect.amount>=0);assert((effect.skills??[]).every(s=>skills.has(s)),rule.id+' invalid skill');assert.equal(effect.target,'self');}
}
const make=(nature,owned,choices={},consciousness='initie')=>({truth:{nature,consciousness,truthTalents:owned,choices},progression:{truthTalents:[]}});
const r={revelation:'r',powerUses:{}};
const garou=make('garou',['deferlement_ecarlate','surregime'],{blood:'sang_ecarlate',pelage:'rouge'});
assert(usableRegisteredPower(garou,r,'deferlement_ecarlate'));
assert(usableRegisteredPower(garou,r,'surregime'));
assert.equal(explicitPower('deferlement_ecarlate').cost,0,'prose access still mentions1PA but reviewed effect explicitly free');
assert.equal(explicitPower('surregime').maxPa,5);
assert(!usableRegisteredPower(garou,{revelation:'sr'},'deferlement_ecarlate'));
assert(!usableRegisteredPower(make('garou',['surregime'],garou.truth.choices),r,'surregime'));
assert(!usableRegisteredPower(make('garou',garou.truth.truthTalents,{blood:'sang_sculpteur',pelage:'rouge'}),r,'surregime'));
assert(!usableRegisteredPower({...garou,truth:{...garou.truth,consciousness:'profane'}},r,'surregime'));
const withProgression=make('garou',[],garou.truth.choices);withProgression.progression.truthTalents=['deferlement_ecarlate'];
assert(usableRegisteredPower(withProgression,r,'deferlement_ecarlate'));
const chosen=explicitPower('deferlement_ecarlate');
assert.throws(()=>validatedPowerEffects(chosen,{skill:'athletisme'}),/power_context_required/);
assert.throws(()=>validatedPowerEffects(chosen,{contextConfirmed:true}),/power_skill_required/);
assert.throws(()=>validatedPowerEffects(chosen,{contextConfirmed:true,skill:'commerce'}),/power_skill_unavailable/);
assert.deepEqual(validatedPowerEffects(chosen,{contextConfirmed:true,skill:'athletisme'})[0].skills,['athletisme']);
assert.equal(validatedPowerEffects(chosen,{contextConfirmed:true,skill:'athletisme',amount:99,cost:0})[0].amount,3,'no client amount');
const mosen=make('extral',['extral-carapace-de-combat','extral-osteodermes-renforces','extral-angle-de-cuirasse'],{species:'mosen'});
assert(usableRegisteredPower(mosen,r,'extral-carapace-de-combat'));
assert(!usableRegisteredPower(make('extral',['extral-carapace-de-combat'],{species:'mosen'}),r,'extral-carapace-de-combat'));
assert(!usableRegisteredPower(make('extral',mosen.truth.truthTalents,{species:'homo_superior'}),r,'extral-carapace-de-combat'));
const shot=explicitPower('extral-impact-titanesque');assert.equal(shot.effects[0].amount,4);assert.equal(shot.route,'attack');
const reduction=explicitPower('exile-encaisser');assert.equal(reduction.effects[0].kind,'reduction');assert.equal(reduction.effects[0].amount,5);assert.equal(reduction.cost,0);
const thulkar=make('exile',['exile-encaisser','exile-peau-epaisse'],{people:'thulkar',network:'aucune'});
assert(usableRegisteredPower(thulkar,r,'exile-encaisser'));
assert(!usableRegisteredPower(make('exile',['exile-encaisser'],thulkar.truth.choices),r,'exile-encaisser'));
const experience=make('exile',['exile-experience-accumulee','exile-souvenir-ordonne'],{people:'elye'});
assert(usableRegisteredPower(experience,{revelation:'v'},'exile-experience-accumulee'));
const trained=make('exile',['exile-reglage-de-maitre'],{people:'elye',network:'aucune',exileBuild:{trainings:[{uid:'training',network:'atelier_clans',learned:true,mentor:'Artisan réel',conditions:'Apprentissage terminé'}]}});
assert(usableRegisteredPower(trained,{revelation:'v'},'exile-reglage-de-maitre'));
const prefix='aseryn_routes_communes_aserynes_vivacite_aseryne_';
const reflex=make('aseryn',[prefix+'reflexe_impossible',prefix+'depart_fulgurant'],{origin:'hyperboreen'});
assert(usableRegisteredPower(reflex,{revelation:'sr'},prefix+'reflexe_impossible'));
assert(!usableRegisteredPower(make('aseryn',[prefix+'reflexe_impossible'],reflex.truth.choices),r,prefix+'reflexe_impossible'));
const percussion='aseryn_origines_jouables_hyperboreen_empreinte_corps_hyperboreen_percussion';
assert(!usableRegisteredPower(make('aseryn',[percussion],{origin:'aerilien'}),r,percussion));
assert(usableRegisteredPower(make('aseryn',[percussion],{origin:'hyperboreen'}),r,percussion));
const used={...r,powerUses:{'round:deferlement_ecarlate':1,'scene:surregime':1}};
assert(registeredTruthPowers(garou,used).every(p=>p.used));
assert(!registeredTruthPowers(garou,r).some(p=>p.used));
assert.equal(explicitPower('invented-free-super-power'),undefined);
assert(!usableRegisteredPower(make('vampire',['deferlement_ecarlate'],{blood:'sang_ecarlate'}),r,'deferlement_ecarlate'),'a shared canonical ID never executes a Garou rule on a Vampire');
assert.equal(explicitPower('exile-entre-deux-etats').route,'external','semi-immaterial restrictions require a targeted procedure');
assert.equal(explicitPower('extral-crete-de-mosenine').route,'external','physical-only PA must not be turned into unrestricted action points');
assert.equal(explicitPower('chasseurs_catholiques_ordre_de_magdalena_jugement_jugement').testExpiresRounds,1,'Judgment cannot be retained after the end of the next round');
const agile=make('garou',['deplacement_agile'],{blood:'sang_naturel',pelage:'rouge'});
assert(!usableRegisteredPower(agile,{...r,form:'human'},'deplacement_agile'));
assert(usableRegisteredPower(agile,{...r,form:'animal'},'deplacement_agile'));
const repair=make('extral',['extral-cycle-de-reparation'],{species:'homo_superior'});
assert(!usableRegisteredPower(repair,{revelation:'v',swarmFunctional:false},'extral-cycle-de-reparation'));
assert(usableRegisteredPower(repair,{revelation:'v',swarmFunctional:true},'extral-cycle-de-reparation'));
console.log(`LIVE POWER REGISTRY OK — ${livePowerRegistry.length} explicit definitions, access, prerequisites, real training, stable IDs, fixed effects, contextual and skill constraints`);

if(process.argv.includes('--audit')){
 const {writeFile}=await import('node:fs/promises');
 const {terraUmbraTruthRules:truth}=await import('../dist/rules/truth/rules.js');
 const {dedicatedPowerIds}=await import('../dist/rules/live-mechanics.js');
 const families=['garou','khinae','extral','exile','aseryn','humain'];
 const plain=value=>String(value??'').replaceAll('|','\\|').replace(/\s+/g,' ').trim();
 const effects=rule=>rule.effects.map(e=>`${e.kind} ${e.mode==='replace'?'valeur ':e.amount>=0?'+':''}${e.amount}${e.skills?' ['+e.skills.join(', ')+']':''}`).join(' ; ')||'Réaction / coût';
 const detail=rule=>`${rule.cost} PA ; ${rule.limit?'1/'+rule.limit:'sans quota'} ; durée ${rule.duration}${rule.testExpiresRounds!==undefined?' (expiration à la fin du round courant + '+rule.testExpiresRounds+')':rule.duration==='test'&&rule.limit==='round'?' (expiration à la fin du round courant)':''} ; ${effects(rule)}${rule.context?' ; contexte déclaré':''}${rule.route==='external'?' ; NON ACTIVABLE : '+rule.notes:''}`;
 let report=`# Audit des capacités de Vérité — 9 octobre 2026\n\nPérimètre : les six catalogues Garou, Khinae, Extral, Exilé, Aseryn et humain, leurs traits gratuits, plus les 227 capacités de Corruption. Les catalogues Vampire, Mage, Daemon et Angelus sont suivis dans les rapports et l’inventaire global du même lot.\n\nCet inventaire est exhaustif sur son périmètre. Chaque Talent et capacité de Corruption est identifié par son ID canonique et classé ; les traits gratuits sont référencés par leur ID ou leur chemin canonique. Une ligne « Registre » certifie une définition mécanique explicite et contrôlée ; elle ne suffit pas, à elle seule, à prouver un branchement d’action ou une validation de toute sa fiction. Le journal d’intégration et les tests API du lot font cette distinction. Les chiffres du texte ne sont jamais exécutés par inférence.\n\n## Résultat de la lecture\n\n- Les capacités personnelles à bonus fixe, coûts, quota, durée, Armure corporelle, DGT, Perforant et réduction des dégâts sont décrites explicitement dans live-power-registry.ts. Les circonstances nécessaires sont confirmées avant résolution ; aucun sens, cible valide ou moyen matériel n’est inventé.\n- Les défenses gratuites et leurs permissions de Surprise sont distinctes des gains de PA. Brume défensive, Déchaînement élémentaire, Chair intermittente et Perception neuromotrice coûtent chacun le PA de la défense, sans un second paiement.\n- Les bonus de Déferlement écarlate suivent son effet révisé (sans PA d’activation), même si son ancien champ access mentionne encore 1 PA. Le registre prévaut sur ce raccourci contradictoire.\n- Le registre vérifie les prérequis par ID, y compris les Extral/Aseryn dont la source ne fournissait qu’un prerequisiteName. Les formations Exilées acquises et les origines Aseryn éveillées sont reconnues ; un achat conservé mais devenu incompatible ne donne pas d’effet.\n- Une seule Armure corporelle est retenue. Muscle tassé et Mains de guerre remplacent le DGT du Pugilat naturel : ce ne sont pas des bonus ajoutés à une arme tenue. Encaisser et Angle de cuirasse interviennent après Armure/Protection.\n- Les ressources et profils narratifs (Traces, mémoire, esprit, greffe, rune, appareil, préparation biologique, territoire, pacte) restent définis avec le MJ. L’existence d’une entrée de suivi ne prouve jamais la création de son objet ou l’accord d’un tiers.\n\n## Points exigeant encore un arbitrage ou une procédure ciblée\n\n| Mécanique | Contrôle nécessaire | Effet interdit par défaut |\n|---|---|---|\n| Bonus au prochain test | Choisir la Compétence du contexte réel avant le jet, consommer le quota et le bonus une fois | Bonus permanent de +3 sur tous les tests |\n| Riposte / interposition / déplacement de réaction | Événement déclencheur, cible, portée et fenêtre avant résolution | Deuxième attaque gratuite ou défense doublée |\n| Surrégime / Surcadence / Crête | Fenêtre normale, PA temporaire, plafond et restrictions d’action ; Crête est physique | Initiative recalculée ou PA libre sans restriction |\n| Frénésie / Fureur / Furie de survie | Entrée/sortie, Impulsion, origine du stress, véritables franchissements de blessures, délai | Déclenchement par changement de maximum de PV ou recharge après soin |\n| Griffe d’entrave / Trace du Néant / Plaie consacrée | Dégâts effectivement infligés et PV temporairement non régénérables ; source/expiration | Suppression de tous les soins ou suspension permanente |\n| Peur / domination / illusions | Opposition, cible compatible, protections et nouveaux tests de libération | Réussite forcée ou obéissance déduite du seul bouton |\n| Réfection vitale / Rune de Garde | Limite par scénario portée par le bénéficiaire, indépendamment du lanceur | Recharge par autre auteur, réinscription, nouvelle scène ou nouveau combat |\n| Foudre / Paratonnerre | Jet de Foudre, défense/protection pertinentes, conducteur/zone sûre et moment de réaction | Esquive ordinaire substituée au Jet de Foudre, réflexion gratuite |\n| Nucléomancie | Vecteur thermique/radiologique, armure réellement adaptée et Souillure physique | Armure matérielle générique bloquant toutes les radiations |\n| Pacte / Miette / Vol de secret | Capacité exacte réellement acquise et observée, coûts/conditions et borne du profil | Copie libre de tous les pouvoirs de la source |\n| Technomagie / réseaux / sabotage | Objet, matériaux, autorité, moyens, circuit et temps de préparation existants | Objet, argent, énergie ou institution créés par déclaration |\n\n## Corruption : admission et conséquences\n\nLa possession d’un ID de Corruption est distincte de la possession d’un Talent de Nature. Elle se lit dans truth.corruptionTalents et progression.corruptionTalents. Les achats nécessitent l’admission MJ et l’initiation ; aucune activation du bloc par un Profane n’est déduite de son seul niveau de Corruption.\n\nUn DON n’est actif que pour la Source dominante et la profondeur requise : Marqué à 1 ; Envahi à la moitié d’Intégrité arrondie au supérieur ; Au bord à max(1, Intégrité − 1). Une baisse de profondeur ou un changement de Source le rend dormant. Un RITE demeure connu après défection/purification mais son emploi garde la Souillure. Une FAVEUR exige que son lien extérieur subsiste ; une purification du lien la rend dormante. Le coût cost du catalogue est en PTV, jamais en PA. Le champ access de l’import peut être tronqué ou collé à la prose : les coûts d’action ne doivent pas être tirés du coût PTV.\n\nLes gains automatiques de Corruption écrits dans Dévorer sa mort, Scission de survie, Dernière fonction, Cocon de survie, Dernier instant, Mort différée et certains rites restent supplémentaires à la Souillure. Atteindre l’Intégrité exige un Test de Bascule immédiat, avec l’exception écrite de Dernier instant à la sortie de Stase. Une grâce MJ n’est pas l’exécution de ces capacités.\n\n## Couverture par famille\n\n| Famille | Entrées canoniques | Définitions explicites au registre | Règles restant assistées / textuelles |\n|---|---:|---:|---:|\n`;
 for(const nature of families){const all=truth.catalogs[nature],registered=all.filter(t=>explicitPower(t.id)).length;report+=`| ${nature} | ${all.length} | ${registered} | ${all.length-registered} |\n`;}
 report+=`| corruption | ${truth.corruption.talents.length} | 0 dans ce registre | ${truth.corruption.talents.length} — commandes de Corruption suivies séparément |\n`;
 const nativeCoverage=new Map([
  ['Régénération lente','Action dédiée de récupération horaire hors combat ; forme, vie et blessures régénérables contrôlées'],
  ['Corps de guerre','Profil de forme Khinae et régénération de round ; pas une attaque gratuite'],
  ['Rythme Khinae','PA de forme après délai de Mue ; pas de relance d’Initiative'],
  ['Corps Enchaîné','Profil de forme Enchaînée et interdiction de Mue hybride'],
  ['Cuirasse mo’senne','Projection explicite live-free-traits · Armure corporelle 1 en R, initié'],
  ['Griffes et dentition','Projection explicite live-free-traits · Pugilat naturel DGT 2 en R, initié'],
  ['Pugilat Ad’rak','Projection explicite live-free-traits · Pugilat naturel DGT 2 SR / DGT 3 R, initié']
 ]);
 let nativeCount=0;
 report+='\n## Traits gratuits et propriétés innées\n\nLes traits gratuits ne sont pas des achats de Talents et ne doivent pas être soumis à la possession d’un ID acheté. Leur profil biologique, perception ou permission narrative ne crée aucune action gratuite. Un trait sans ID est référencé par son chemin dans la structure canonique, jamais par un identifiant d’exécution inventé. La colonne de couverture décrit le branchement réellement identifié ; tout bonus conditionnel non branché reste à confirmer et suivre avec le MJ. Les modules consacrés aux effets et aux ressources complètent cet inventaire, notamment pour les propriétés qui ne se résument pas à un nombre.\n';
 for(const nature of families){
  const structure=truth.structure.natures[nature],rows=[...structure.baseFreeTraits.map((trait,index)=>({trait,when:{},reference:`structure.natures.${nature}.baseFreeTraits[${index}]`})),...structure.freeTraitRules.flatMap((rule,index)=>rule.traits.map((trait,traitIndex)=>({trait,when:rule.when,reference:trait.id??`structure.natures.${nature}.freeTraitRules[${index}].traits[${traitIndex}]`})))];
  nativeCount+=rows.length;report+=`\n### ${nature} — ${rows.length} traits gratuits\n\n| Référence canonique | Trait | Conditions | Accès / effet | Couverture identifiée |\n|---|---|---|---|---|\n`;
  for(const {trait,when,reference} of rows)report+=`| ${plain(reference)} | ${plain(trait.name)} | ${plain(Object.keys(when).length?JSON.stringify(when):'Nature initiée ; contexte de la règle')} | ${plain((trait.access??'Accès à lire dans la règle')+' ; '+trait.effect)} | ${plain(nativeCoverage.get(trait.name)??'Texte / arbitrage MJ ; aucune réussite, immunité ou valeur automatiquement déduite')} |\n`;
 }
 report+=`\nTotal supplémentaire : **${nativeCount} traits gratuits** sur ces six familles, distincts des **${families.reduce((sum,n)=>sum+truth.catalogs[n].length,0)} Talents** et des **${truth.corruption.talents.length} capacités de Corruption** inventoriés ci-dessous. Les variantes corporelles Khinae sont modélisées lorsqu’un profil chiffré explicite existe dans khinae.ts ; leurs permissions de milieu, de déplacement, de camouflage et de perception restent de la fiction arbitrée.\n`;
 for(const nature of families){
  report+=`\n## ${nature} — classement règle par règle\n\n| ID | Capacité | Couverture | Coût / quota / effet explicitement décrit ou limite | Source |\n|---|---|---|---|---|\n`;
  for(const t of truth.catalogs[nature]){
   const rule=explicitPower(t.id),coverage=rule?'Registre · '+rule.route:dedicatedPowerIds.has(t.id)?'Action dédiée existante':'Texte / commande assistée';
   const notes=rule?detail(rule):'Accès '+(t.access||'non renseigné')+' ; '+(t.activation||'aucun coût/délai structuré')+' ; effets narratifs/ciblés à arbitrer, aucune valeur inventée';
   report+=`| ${plain(t.id)} | ${plain(t.name)} | ${plain(coverage)} | ${plain(notes)} | ${plain(t.compendiumId||'catalogue canonique')} |\n`;
  }
 }
 report+='\n## Corruption — classement règle par règle\n\nToutes les entrées ci-dessous conservent le texte du catalogue et leur admission propre. Les conséquences de Source, profondeur, lien, Souillure et Bascule ne sont pas remplacées par un bonus générique. Le registre personnel ci-dessus ne les exécute pas.\n\n| ID | Capacité | Type / profondeur / Source | Prérequis | Couverture |\n|---|---|---|---|---|\n';
 for(const t of truth.corruption.talents)report+=`| ${plain(t.id)} | ${plain(t.name)} | ${plain(t.kind+' · '+(t.depth||'sans profondeur')+' · '+t.sourceName)} | ${plain(t.prerequisiteName||'—')} | Commande assistée et arbitrage du texte |\n`;
 report+='\n## Vérification du registre\n\ncheck-live-power-registry.mjs contrôle les IDs, les coûts/quotas explicites, les Skills autorisées, la non-conversion du coût PTV en PA, l’accès V/SR/R, les prérequis transitifs, les formations apprises, les achats de progression, les contraintes de Sang et de Nature, le refus d’un contexte non confirmé et l’impossibilité de choisir un montant libre. Les tests API d’intégration vérifient séparément la consommation réelle, la concurrence/idempotence, le journal et les frontières de remise à zéro.\n';
 await writeFile('../../docs/operations/audit-truth-capabilities-20261009.md',report);
 console.log(`TRUTH CAPABILITY AUDIT GENERATED — ${families.reduce((sum,n)=>sum+truth.catalogs[n].length,0)+truth.corruption.talents.length} canonical talents/corruption + ${nativeCount} native traits classified`);
}
