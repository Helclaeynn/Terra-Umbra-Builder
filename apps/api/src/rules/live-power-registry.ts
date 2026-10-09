import {truthCoreRules} from './truth/core-rules.js';
import {liveTruthState,powerAllowed,usableKhinaeTalent} from './play-truth.js';
import {normalizeExileBuild,exileHordes} from './truth/exile-build.js';
import {normalizeExtralBuild,extralNetworkAccess} from './truth/extral-build.js';
import {terraUmbraCreationRules} from './terra-umbra-creation.js';

/** Reviewed identifiers and values only. Effect prose is displayed, never interpreted. */
export type RegisteredPowerRoute='activate'|'roll'|'attack'|'defense'|'damage'|'heal'|'passive'|'external';
export type RegisteredPowerLimit='round'|'scene'|'day'|'scenario'|null;
export type RegisteredPowerDuration='test'|'scene'|'scenario'|number;
export type RegisteredPowerEffect={
 kind:'skill'|'damage'|'armor'|'reduction'|'healing'|'pa'|'piercing';amount:number;
 mode?:'bonus'|'replace';skills?:readonly string[];domain?:'physical'|'mental'|'social'|'intellectual';
 stacking?:'circumstance'|'body'|'named';target:'self';
};
export type RegisteredPowerRule={
 id:string;nature:string;name:string;route:RegisteredPowerRoute;cost:number;
 limit:RegisteredPowerLimit;duration:RegisteredPowerDuration;effects:readonly RegisteredPowerEffect[];
 context:string|null;params?:{skill?:boolean};
 /** No claim that a condition or range is detected by the application. */
 notes:string;surprise?:boolean;physicalOnly?:boolean;maxPa?:number;paScope?:'physical'|'any';allowedForms?:readonly string[];requiresFunctionalSwarm?:boolean;testExpiresRounds?:number;
};
type RuleInput=Omit<RegisteredPowerRule,'name'|'nature'>;
const list:RegisteredPowerRule[]=[];
const add=(nature:string,input:RuleInput)=>{
 const entry=(truthCoreRules.catalogs as Record<string,readonly any[]>)[nature]?.find(t=>t.id===input.id);
 if(!entry)throw new Error('Unknown canonical power: '+input.id);
 list.push({...input,nature,name:entry.name,allowedForms:input.id==='deplacement_agile'?['animal','hybrid']:input.allowedForms,requiresFunctionalSwarm:['extral-cycle-de-reparation','extral-reserve-nanitique','extral-surcadence-somatique'].includes(input.id)||input.requiresFunctionalSwarm,params:{skill:input.effects.some(e=>e.kind==='skill'&&(!e.skills||e.skills.length>1))}});
};
const skill=(amount:number,skills?:readonly string[],domain?:RegisteredPowerEffect['domain']):RegisteredPowerEffect=>({kind:'skill',amount,skills,domain,stacking:'circumstance',target:'self'});
const physical=['athletisme','pugilat','melee','constitution','tir','pilotage','furtivite','esquive','larcin'] as const;
const social=['seduction','diplomatie','commerce','representation','autorite'] as const;
const technical=['mecanique','soin','savoirs','investigation','neurodive'] as const;
const everySkill:readonly string[]=terraUmbraCreationRules.skills.map(s=>s.id);
const one=(nature:string,id:string,amount:number,limit:RegisteredPowerLimit,context:string,skills?:readonly string[],cost=0,duration:RegisteredPowerDuration='test',notes='Le contexte doit être confirmé avant le jet ; les circonstances équivalentes ne se cumulent pas.')=>add(nature,{id,route:duration==='test'?'roll':'activate',cost,limit,duration,effects:[skill(amount,skills)],context,notes});
const defense=(nature:string,id:string,cost:number,bonus:number,limit:RegisteredPowerLimit,surprise:boolean,context:string|null=null)=>add(nature,{id,route:'defense',cost,limit,duration:'test',effects:bonus?[skill(bonus,['esquive'])]:[],context,surprise,physicalOnly:true,notes:'Le PA indiqué comprend la Défense active. Il faut rester conscient et physiquement capable de réagir ; une seule Défense par attaque.'});
const damage=(nature:string,id:string,amount:number,limit:RegisteredPowerLimit,context:string)=>add(nature,{id,route:'damage',cost:0,limit,duration:'test',effects:[{kind:'reduction',amount,mode:'bonus',stacking:'named',target:'self'}],context,physicalOnly:true,notes:'Réduction après Armure et Protection, minimum 0. La zone et la compatibilité de l’atteinte restent à confirmer.'});
const armor=(nature:string,id:string,amount:number,cost:number,context:string|null=null)=>add(nature,{id,route:cost?'activate':'passive',cost,limit:null,duration:'scene',effects:[{kind:'armor',amount,mode:'replace',stacking:'body',target:'self'}],context,notes:'Une seule valeur d’Armure corporelle : retenir la meilleure applicable, puis ajouter une armure portée compatible ; aucun cumul entre couches corporelles.'});
const pa=(nature:string,id:string,maximum:number,context:string)=>add(nature,{id,route:'activate',cost:0,limit:'scene',duration:1,effects:[{kind:'pa',amount:1,stacking:'named',target:'self'}],context,maxPa:maximum,paScope:id==='extral-crete-de-mosenine'?'physical':'any',notes:'Gain pour le round uniquement, sans modifier Initiative ni renouveler de quota ; ne se cumule pas avec un autre gain direct de PA.'});

// Garou. Blood counterparts are copied only where the canonical Khinae entry exists.
one('garou','aura_effacee',3,null,'Vous suivez, approchez ou contournez une proie.',['furtivite']);
one('garou','deplacement_agile',3,null,'Forme Animal ou Hybride ; franchissement, escalade ou rattrapage réellement possible exploitant les appuis du terrain.',['athletisme']);
one('garou','traque_infatigable',3,null,'La piste est déjà acquise et réellement difficile à conserver.',['survie','perception']);
one('garou','memoire_d_ulfhednar',3,'scenario','Initiation réellement reçue et mémoire martiale, militaire ou de Survie identifiée ; choisissez la Compétence cohérente.',everySkill,1,'scene');
one('garou','ralliement_de_meute',3,'scene','Nouveau test contre un effet de peur, Frénésie ou domination identifié ; seul le proche reconnu visé reçoit ce bonus.',['force_mentale','maitrise_spirituelle'],1,'test','Effet sur un bénéficiaire : l’action ciblée doit porter le bonus à sa nouvelle résistance. Ne pas ajouter à la résistance du lanceur.');
// Mark the preceding rule as external: only a targeted support handler may apply it.
list[list.length-1].route='external';
one('garou','deferlement_ecarlate',3,'round','Déclarez avant un test physique, avec le coût normal du test.',physical);
pa('garou','surregime',5,'Sang et corps Khinae utilisables ; déclaration dans une fenêtre normale avant la fin du round.');
one('garou','devoration_de_savoir',2,null,'Consommation réelle d’un organe adéquat d’un mort récent ; choisissez une Compétence réellement possédée par la source.',everySkill,0,'scene','Une seule connaissance dévorée active ; aucun prérequis permanent, Talent, Sang ou mémoire intégrale emprunté.');
one('garou','heritage_de_chair',3,null,'Même consommation réelle et Compétence de Dévoration de savoir ; la connaissance choisie remplace le bonus de base.',everySkill,0,'scenario','Une connaissance active ; remplace Dévoration +2, aucun cumul, aucun prérequis permanent.');
one('garou','bibliotheque_vivante',3,'scene','Après réflexion, rapprochement réellement déductible de souvenirs acquis ; premier test intellectuel qui l’exploite.',['mecanique','langages_argot','savoirs','soin','investigation'],1);
defense('garou','vitesse_impossible',0,0,'round',true);
defense('garou','brume_defensive',1,3,null,false,'La brume peut réellement protéger contre cette attaque physique ; pas de perception la neutralisant ni de couvert équivalent.');
defense('garou','dechainement_elementaire',1,3,null,false,'Un élément en quantité suffisante permet matériellement cette défense. Le PA inclut la Défense, sans protection mentale.');
// Record the offensively usable alternative separately in notes; this defense rule never creates an attack.
list[list.length-1].notes+=' L’attaque alternative DGT 6 à 20 m est une autre résolution à 1 PA, Volonté + Force mentale contre Défense physique ; aucun double effet.';
for(const rule of [...list].filter(p=>p.nature==='garou')){
 const id='khinae_blood_'+rule.id;
 if((truthCoreRules.catalogs.khinae as readonly any[]).some(t=>t.id===id))add('khinae',{...rule,id});
}

// Extrals: reviewed species and organizational techniques.
one('extral','extral-poussee-hormonale',3,'scene','Avant un test reposant directement sur Vigueur, Agilité, Athlétisme ou combat physique.',physical);
armor('extral','extral-osteodermes-renforces',2,0);
armor('extral','extral-carapace-de-combat',3,1);
armor('extral','extral-densification-osseuse',1,0);
armor('extral','extral-vieux-cuir',3,0);
add('extral',{id:'extral-muscle-tasse',route:'passive',cost:0,limit:null,duration:'scene',effects:[{kind:'damage',amount:4,mode:'replace',skills:['pugilat'],stacking:'body',target:'self'}],context:'Pugilat naturel, sans autre arme.',notes:'DGT de base 4 au lieu de 1, jamais +4 sur une arme.'});
damage('extral','extral-angle-de-cuirasse',2,'round','Coup physique perçu sur une zone effectivement cuirassée.');
pa('extral','extral-surcadence-somatique',4,'Au début de votre activation, essaim Homo Superior fonctionnel.');
pa('extral','extral-crete-de-mosenine',4,'Au début du round ; PA réservé au Déplacement, Pugilat, Mêlée, Défense active ou effort physique significatif.');
list[list.length-1].route='external';
list[list.length-1].notes+=' Procédure ciblée requise : le PA physique et la fenêtre de début de round ne sont pas encore contrôlés ensemble. Ce registre interdit donc une activation libre de ce gain.';
add('extral',{id:'extral-impact-titanesque',route:'attack',cost:0,limit:'scene',duration:'test',effects:[{kind:'damage',amount:4,mode:'bonus',skills:['pugilat','melee'],stacking:'named',target:'self'}],context:'Déclaration avant une attaque de Pugilat ou de Mêlée entièrement consacrée à la puissance.',notes:'Attaque normalement payée ; +4 DGT seulement en réussite ; aucune baisse de Défense ni Altération automatiquement inventée.'});
defense('extral','extral-reflexe-de-chasse',0,0,'round',false);
defense('extral','extral-reflexe-conditionne',0,3,'scene',true);
add('extral',{id:'extral-cycle-de-reparation',route:'heal',cost:1,limit:'scenario',duration:'test',effects:[{kind:'healing',amount:6,target:'self'}],context:'Conscient, vivant et essaim fonctionnel.',notes:'Soin personnel plafonné au maximum, sans Réserve nanitique ; récupération naturelle doublée hors combat séparément.'});
add('extral',{id:'extral-reserve-nanitique',route:'passive',cost:0,limit:'scenario',duration:'test',effects:[{kind:'healing',amount:3,target:'self'}],context:'Premier soin externe qui rend effectivement des PV ; essaim fonctionnel.',notes:'Exclut repos, Cycle et régénération. Le premier soin éligible consomme le quota, même si le plafond de PV réduit le bonus.'});
one('extral','extral-sursaut-d-expression',3,'scene','Greffon compatible réellement possédé, sur-régime payé selon ses coûts ; premier test exploitant sa fonction pendant le round.',everySkill);
one('extral','extral-fenetre-orbitale',3,null,'Créneau réel de surveillance, trafic ou synchronisation repéré et transit clandestin préparé ; premier test l’exploitant.',everySkill);
one('extral','extral-decision-distribuee',3,null,'Responsable indisponible et relais effectivement briefés ; tests de coordination nécessaires à la continuité de l’opération.',everySkill,0,'scene');
add('extral',{id:'extral-exploiter-la-breche',route:'attack',cost:0,limit:'round',duration:'test',effects:[{kind:'piercing',amount:2,target:'self'}],context:'Attaque visant explicitement une brèche créée ou identifiée par la Doctrine du Géant.',notes:'Réduit de 2 l’Armure applicable ; ne s’ajoute pas à un Démantèlement méthodique équivalent.'});
add('extral',{id:'extral-onde-ecarlate',route:'attack',cost:0,limit:'round',duration:'test',effects:[{kind:'piercing',amount:2,skills:['pugilat'],target:'self'}],context:'Attaque de Pugilat par le Souffle à 5 m maximum, cible réellement atteignable.',notes:'Jet et DGT normaux du Pugilat ; attaque payante. Pas de contact physique, saisie ou Enchaînement. Repoussement 1 m + DR après blessure à arbitrer.'});

// Previously prepared contextual entries now have a reviewed context and a fixed bonus.
for(const [id,skills,context] of [
 ['extral-rebond-d-appui',['athletisme'],'Bonds réellement difficiles exploitant des surfaces et appuis accessibles.'],
 ['extral-vision-des-fractures',['perception','savoirs'],'Fracture dimensionnelle active ou résidu réellement perçu ; estimer ancienneté, stabilité ou danger.'],
 ['extral-digestion-selective',['constitution'],'Résistance à un poison ou une toxine ingérés, pas une immunité universelle.'],
 ['extral-culture-de-secours',['soin'],'Premiers soins ou Stabilisation avec une culture réellement préparée et disponible.'],
 ['extral-peau-saturee',['constitution'],'Chaleur ou feu ordinaires ; aucun plasma ni température physiquement extrême.'],
 ['extral-lecture-vibratoire',['perception'],'Contact avec le milieu conducteur, vibrations faibles à 10 m maximum.'],
 ['extral-branchies-barometriques',['perception'],'Détection d’une présence par perturbation perceptible d’air ou d’eau à 5 m maximum.'],
 ['extral-resonance-holographique',['perception'],'Acclimatation terrestre prolongée et fluctuation de l’Hologramme réellement ressentie.'],
 ['extral-ancrage-de-masse',['athletisme','pugilat'],'Résister à une projection, renversement, poussée ou déplacement forcé purement physique.'],
 ['extral-saisie-ecrasante',['pugilat','athletisme'],'Maintenir une prise déjà réussie sur une cible sensiblement plus petite.'],
 ['extral-declassement-fonctionnel',['mecanique'],'Tâche technique avec outils nécessaires ; sacrifice réel d’une fonction secondaire pour maintenir l’essentielle.'],
 ['extral-emulation-de-composant',['mecanique'],'Dix minutes, matériaux, outils et fonction connue ; substitut temporaire physiquement réalisable.'],
 ['extral-stabilisation-exotique',['soin'],'Stabilisation d’une physiologie réellement inconnue, moyens minimaux disponibles.'],
 ['extral-servomusculature',['athletisme'],'Armure assistée réellement adaptée ; effort exploitant sa servomusculature sans relever les limites de force.'],
 ['extral-tolerance-au-greffon',['constitution'],'Résister à un rejet ou conflit biologique d’une greffe compatible, sans lever une incompatibilité fondamentale.']
] as const)one('extral',id,3,null,context,skills);
one('extral','extral-sous-le-tir',3,'round','Résister à la suppression ou intimidation en approchant un adversaire sensiblement plus massif sous le feu.',['force_mentale']);
one('extral','extral-deuxieme-paire-experte',2,null,'Hors combat, tâche manuelle où la seconde paire de bras peut réellement fournir une Assistance ; ni attaque, ni défense, ni pouvoir strictement personnel.',technical);

// Exiles. Descriptions deliberately preserve exclusions and replacement rules.
one('exile','exile-lecture-des-etres',3,'scene','Quelques minutes d’interaction réelles ; premier test social exploitant directement la lecture indiquée par le MJ.',social);
one('exile','exile-experience-accumulee',3,'scenario','Expérience ancienne plausible définie avant le premier jet ; choisissez une Compétence du domaine précis.',everySkill,0,'scene');
one('exile','exile-ca-devrait-marcher',3,'scene','Tâche technique simple et véritable détournement crédible d’un outil ; les éléments indispensables sont présents.',technical);
one('exile','exile-diagnostic-sauvage',3,null,'Après 1 PA d’examen d’un sous-système réellement accessible ; diagnostic ou première réparation fondée sur cet examen.',technical,1);
one('exile','exile-impossible-non-mal-prepare',3,'scenario','Appareil réel, fonction nouvelle techniquement plausible, connaissances, matériaux et énergie présents.',technical,1);
one('exile','exile-monter-au-defi',3,'scene','Véritable défi adverse accepté ouvertement, un seul défi actif ; choisissez la Compétence répondant directement au défi.',everySkill,0,'scene');
one('exile','exile-pousser-la-limite',3,'scene','Pousser réellement vos capacités sur ce test, avant son résultat.',everySkill);
one('exile','exile-lire-le-terrain',3,'scene','Après 1 PA d’observation, premier test personnel exploitant une position, menace ou route déductible du terrain.',everySkill,1);
one('exile','exile-dependance-critique',3,null,'Après 1 PA d’inspection, premier sabotage exploitant la dépendance d’un dispositif compris.',technical,1);
one('exile','exile-retourner-l-etiquette',3,'scene','Prochaine action sociale exploitant la violation explicite d’un protocole ou engagement par l’interlocuteur.',social);
one('exile','exile-reglage-de-maitre',3,null,'Équipement compris et réellement réglé quelques minutes ; fonction précise et Compétence choisies, un réglage actif par objet.',everySkill,0,'scene');
one('exile','exile-surcadence',3,'scene','Test exploitant une augmentation réellement installée ; en échec narratif, sa fonction devient Surchargée.',everySkill);
one('exile','exile-trouver-quelqu-un-qui-sait',3,'scenario','Briefing réellement obtenu d’un expert du réseau ; Compétence intellectuelle directement fondée sur ses conseils.', ['mecanique','langages_argot','savoirs','soin','investigation'],0,'scene');
one('exile','exile-feu-croise',3,'round','Allié menaçant la même cible depuis un angle réellement distinct ; une attaque à distance.',['tir']);
one('exile','exile-route-grise',3,'scene','Route réellement existante contournant un contrôle ordinaire ; premier test de passage qui l’exploite.',everySkill);
one('exile','exile-epaulement',3,'round','Vous et un allié êtes au contact de la même cible depuis des positions distinctes.',['melee','pugilat']);
one('exile','exile-mauvais-moment',3,'round','Cet adversaire vient de rater une attaque de Mêlée/Pugilat contre vous ; prochaine attaque contre lui avant la fin du round.',['melee','pugilat','tir']);
one('exile','exile-frapper-ou-ca-cede',3,'round','La cible est Tendue ou pire à cause des blessures, ou Paniquée ; action exploitant directement cette faiblesse.',everySkill);
one('exile','exile-contrepied',3,'scene','Erreur adverse préexistante sur vos capacités, exploitée par la prochaine action ; simple ignorance du geste insuffisante.',everySkill);
one('exile','exile-interdisciplinarite',3,'round','Approche non offensive impliquant deux Compétences réellement pertinentes possédées à 1+ ; ni Défense ni pouvoir strictement personnel.',everySkill);
pa('exile','exile-la-reussite-appelle-la-reussite',4,'Mise à l’Agonie adverse ou réussite opposée déterminante DR 3+ réellement résolue.');
damage('exile','exile-encaisser',5,'scene','Attaque physique n’ignorant pas explicitement toutes les résistances physiques.');
armor('exile','exile-peau-epaisse',1,0);
add('exile',{id:'exile-mains-de-guerre',route:'passive',cost:0,limit:null,duration:'scene',effects:[{kind:'damage',amount:3,mode:'replace',skills:['pugilat'],stacking:'body',target:'self'}],context:'Pugilat naturel, sans autre arme.',notes:'DGT de base 3 au lieu de 1, jamais +3 ajouté.'});
add('exile',{id:'exile-force-de-rupture',route:'attack',cost:0,limit:null,duration:'test',effects:[{kind:'piercing',amount:2,target:'self'}],context:'Attaque volontaire d’un objet, porte, structure ou véhicule immobilisé ; jamais armure portée par une créature.',notes:'Ignore 2 Protection matérielle applicable ; aucune hausse du DGT.'});
defense('exile','exile-chair-intermittente',1,3,'scene',false,'Attaque purement physique, sans effet surnaturel ou biphysique.');
add('exile',{id:'exile-entre-deux-etats',route:'external',cost:1,limit:'scene',duration:'scene',effects:[skill(3,['esquive'])],context:'État semi-immatériel : aucune attaque physique ni manipulation lourde tant qu’il dure ; défense contre le purement physique uniquement.',notes:'Procédure ciblée nécessaire : l’interdiction d’attaque et de manipulation, la défense uniquement physique et l’abandon au début d’activation doivent être suivis ensemble. Ce registre ne permet pas une activation libre du seul bonus. La Défense reste payante. Pas d’invulnérabilité ni passage dimensionnel.'});

for(const [id,skills,context] of [
 ['exile-endurance-obstinee',['constitution'],'Endurance corporelle : fatigue, manque de sommeil, marche forcée, froid ou effort prolongé ; pas un effet surnaturel ciblé.'],
 ['exile-masse-enracinee',['athletisme','pugilat'],'Résister à une projection, renversement, recul ou déplacement forcé par contrainte physique.'],
 ['exile-volonte-incompressible',['force_mentale','maitrise_spirituelle'],'Domination, possession, contrainte mentale ou injonction surnaturelle imposant un comportement contraire à votre volonté.'],
 ['exile-meme-pas-peur',['force_mentale'],'Peur ou intimidation reposant surtout sur taille, statut, réputation ou menace ordinaire.'],
 ['exile-poigne-thulkar',['pugilat','athletisme'],'Résister au désarmement ou maintenir une saisie physique déjà obtenue.'],
 ['exile-douleur-familiere',['constitution','force_mentale'],'Résistance provoquée directement par douleur physique, blessure ou menace de souffrance.'],
 ['exile-se-fondre-dans-le-decor',['furtivite'],'Immobilité dans un couvert naturel réel.'],
 ['exile-standard',['mecanique','savoirs'],'Recherche d’un vice caché dans un domaine connu, examen et moyens adaptés réels.'],
 ['exile-aucune-reverence',['force_mentale','maitrise_spirituelle'],'Pression fondée explicitement sur statut sacré, noblesse, divinité, prophétie ou autorité religieuse revendiquée.'],
 ['exile-ancrage-de-realite',['force_mentale','maitrise_spirituelle'],'Résister à une transition V/SR/R forcée ou empêchée ; pas à un capteur révélant la forme Voilée.'],
 ['exile-vivre-de-peu',['survie','constitution'],'Environnement possédant réellement eau, abri et ressources minimales ; survie liée à pénurie ou endurance quotidienne.']
] as const)one('exile',id,3,null,context,skills);

// Aseryn: identifiers intentionally include their canonical complete paths.
const aseryn=(suffix:string)=>'aseryn_'+suffix;
defense('aseryn',aseryn('routes_communes_aserynes_vivacite_aseryne_reflexe_impossible'),0,0,'round',true);
pa('aseryn',aseryn('routes_communes_aserynes_vivacite_aseryne_surcadence_nerveuse'),4,'Au début d’un round, sans autre gain direct de PA.');
one('aseryn',aseryn('routes_communes_aserynes_perception_electromagnetique_lecture_de_champ'),3,null,'Utilisation focalisée du Sens électromagnétique ; déterminer nature, intensité ou origine probable d’un phénomène.',['perception']);
defense('aseryn',aseryn('routes_communes_aserynes_perception_electromagnetique_perception_neuromotrice'),1,3,'round',false,'Cible connue présente à 3 m ; activité nerveuse/électromécanique effectivement perçue, sans blindage ni brouillage bloquant.');
one('aseryn',aseryn('origines_jouables_hyperboreen_empreinte_corps_hyperboreen_appuis_du_nord'),3,null,'Résister à une saisie, renversement ou déplacement physique forcé.',['athletisme','pugilat']);
add('aseryn',{id:aseryn('origines_jouables_hyperboreen_empreinte_corps_hyperboreen_percussion'),route:'attack',cost:0,limit:'round',duration:'test',effects:[{kind:'damage',amount:2,mode:'bonus',skills:['melee','pugilat'],stacking:'named',target:'self'}],context:'Déplacement volontaire d’au moins 3 m avant cette attaque de mêlée ; choisir le bonus de DGT, sans repoussement gratuit en plus.',notes:'+2 DGT après attaque réussie ; le Déplacement et l’attaque sont normalement payés.'});
one('aseryn',aseryn('traditions_des_treize_cairiah_l_architecte_il_de_structure'),3,'scene','Structure réellement examinée et faiblesse identifiée ; premier test pour forcer, saboter ou consolider la structure.',everySkill);
one('aseryn',aseryn('traditions_des_treize_theana_la_guerisseuse_il_de_theana'),3,null,'Diagnostic rare, complexe, masqué ou surnaturel dans votre domaine avec examen réel.',['soin']);
one('aseryn',aseryn('conseil_de_la_foudre_technique_commune_nom_des_ancetres'),3,null,'Identifier un Ancêtre officiellement conservé par votre propre communauté à partir de signes réels.',['savoirs']);
one('aseryn',aseryn('conseil_de_la_foudre_voie_des_ancetres_memoire_empruntee'),3,'scene','Communion préparée avec un Ancêtre réellement compétent ; une seule Compétence correspondant à son expérience.',everySkill,0,'scene');
one('aseryn',aseryn('conseil_de_la_foudre_voie_du_vaisseau_main_de_l_ancetre'),3,'round','Possession coopérative par un Ancêtre consentant ; action relevant de son expertise réelle, sans prêt de capacité physique.',everySkill);

// Humans: no numerical bonus is inferred from sacred, Angelic or elemental properties.
one('humain','chasseurs_catholiques_ordre_de_magdalena_jugement_jugement',3,'scene','Source surnaturelle réellement identifiée à 10 m maximum ; prochain rite de Magdalena contre cette même source avant fin du prochain round.',['maitrise_spirituelle'],1);
list[list.length-1].testExpiresRounds=1;
one('humain','chasseurs_independants_heritages_modulaires_marque_par_la_proie_resonance_etrangere',3,null,'Résistance contre un pouvoir de la famille réelle de votre marque ; en échec la source apprend cette résonance.',['force_mentale','maitrise_spirituelle','constitution'],1);
one('humain','table_ronde_lignees_et_armes_de_merlin_heritage_chevaleresque_aucun_enchantement_ne_detourne',3,null,'Serment de Quête toujours valable ; influence surnaturelle vous contraignant directement à le trahir.',['force_mentale','maitrise_spirituelle']);

const explicitPrerequisites:Record<string,readonly string[]>={
 'extral-carapace-de-combat':['extral-osteodermes-renforces','extral-angle-de-cuirasse'],
 'extral-vieux-cuir':['extral-densification-osseuse','extral-muscle-tasse'],
 'extral-muscle-tasse':['extral-densification-osseuse'],
 'extral-angle-de-cuirasse':['extral-osteodermes-renforces'],
 'extral-crete-de-mosenine':['extral-reflexe-de-chasse','extral-surpuissance'],
 'extral-reflexe-de-chasse':['extral-poussee-hormonale'],
 'extral-surpuissance':['extral-reflexe-de-chasse'],
 [aseryn('routes_communes_aserynes_vivacite_aseryne_reflexe_impossible')]:[aseryn('routes_communes_aserynes_vivacite_aseryne_depart_fulgurant')],
 [aseryn('routes_communes_aserynes_vivacite_aseryne_surcadence_nerveuse')]:[aseryn('routes_communes_aserynes_vivacite_aseryne_reflexe_impossible')],
 [aseryn('conseil_de_la_foudre_voie_des_ancetres_memoire_empruntee')]:[aseryn('conseil_de_la_foudre_voie_des_ancetres_ecouter_les_ancetres')],
 [aseryn('conseil_de_la_foudre_voie_du_vaisseau_main_de_l_ancetre')]:[aseryn('conseil_de_la_foudre_voie_du_vaisseau_accueil_du_mort')]
};
export const livePowerRegistry:ReadonlyArray<RegisteredPowerRule>=list;
const indexed=new Map(list.map(rule=>[rule.id,rule]));
export const explicitPower=(id:string)=>indexed.get(id);
export const registeredPowerIds=new Set(indexed.keys());
const normal=(v:unknown)=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ').toLowerCase();
function whenAllowed(data:any,entry:any){
 const t=liveTruthState(data);
 if(t.nature==='extral'&&typeof entry.when?.network==='string'){
  const access=extralNetworkAccess(String(t.choices.species??''),entry.when.network),training=normalizeExtralBuild(t.choices.extralBuild);
  if(!access||(access==='O'||access==='R')&&(!training.training.trim()||training.trainingNetwork!==entry.when.network))return false;
 }
 const networks=new Set<string>([String(t.choices.network??'')]);
 if(t.nature==='exile'){
  const valid=(truthCoreRules.structure.natures.exile.choices as readonly any[]).find(c=>c.key==='network')?.optionsBy?.[String(t.choices.people??'')]??[];
  if(!valid.some((n:any)=>n.id===t.choices.network))networks.clear();
  for(const training of normalizeExileBuild(t.choices.exileBuild).trainings)if(training.learned&&training.mentor.trim()&&training.conditions.trim())networks.add(training.network);
  if(exileHordes.some(h=>networks.has(h)))networks.add('horde_commune');
 }
 if(entry.when&&!Object.entries(entry.when).every(([key,value])=>key==='network'&&t.nature==='exile'?typeof value==='string'&&networks.has(value):Array.isArray(value)?value.includes(t.choices[key]):value===t.choices[key]))return false;
 if(t.nature==='aseryn'){
  const group=normal(entry.group),needles=truthCoreRules.visibility.needles.aseryn as Record<string,readonly string[]>;
  if(group.includes('routes communes aserynes'))return true;
  const origins=new Set([String(t.choices.origin??'')]);
  const inherited='aseryn_origines_jouables_seratheen_empreinte_sang_mele_';
  if(t.choices.origin==='seratheen'&&t.truthTalents.includes(inherited+'atavisme_marque')&&t.truthTalents.includes(inherited+'heritage_eveille')){
   const traces=['aserynTrace1','aserynTrace2',...(t.truthTalents.includes(inherited+'sang_pluriel')?['aserynTrace3']:[])].map(k=>String(t.choices[k]??''));
   if(traces.includes(String(t.choices.aserynAtavism)))origins.add(String(t.choices.aserynAtavism));
   if(t.truthTalents.includes(inherited+'mosaique_ancestrale')&&traces.includes(String(t.choices.aserynMosaic))&&t.choices.aserynMosaic!==t.choices.aserynAtavism)origins.add(String(t.choices.aserynMosaic));
  }
  return [...origins,String(t.choices.tradition??''),String(t.choices.seratheenTradition??'')].some(key=>needles[key]?.some(needle=>group.includes(normal(needle))));
 }
 return true;
}
export type RegisteredPowerState={revelation:string;powerUses?:Record<string,number>;form?:string;swarmFunctional?:boolean};
export function usableRegisteredPower(data:any,state:RegisteredPowerState,id:string){
 const rule=indexed.get(id);if(!rule||rule.requiresFunctionalSwarm&&state.swarmFunctional===false||rule.allowedForms&&!rule.allowedForms.includes(state.form??'human'))return false;
 const t=liveTruthState(data);if(t.consciousness==='profane'||t.nature!==rule.nature||!t.truthTalents.includes(id))return false;
 const catalog=(truthCoreRules.catalogs as Record<string,readonly any[]>)[rule.nature]??[],byId=new Map(catalog.map(entry=>[entry.id,entry]));
 const ready=(key:string,ancestors=new Set<string>()):boolean=>{
  const entry=byId.get(key);if(!entry||!t.truthTalents.includes(key)||ancestors.has(key)||!whenAllowed(data,entry))return false;
  const chain=new Set([...ancestors,key]);
  const required=[...(entry.requiredTalentIds??[]),...(entry.prerequisite?[entry.prerequisite]:[]),...(explicitPrerequisites[key]??[])];
  if(required.some(requiredId=>!ready(requiredId,chain)))return false;
  if(entry.anyRequiredTalentIds?.length&&!entry.anyRequiredTalentIds.some((requiredId:string)=>ready(requiredId,chain)))return false;
  return true;
 };
 if(!ready(id))return false;
 if(['garou','khinae'].includes(rule.nature)&&!usableKhinaeTalent(data,id.replace(/^khinae_blood_/,'')))return false;
 const access=String(byId.get(id)?.access??'R');
 const stage=/(?:^|\W)V(?:\W|$)/.test(access)?'v':/(?:^|\W)SR(?:\W|$)/.test(access)?'sr':'r';
 return powerAllowed({stage},state.revelation);
}
export function registeredTruthPowers(data:any,state:RegisteredPowerState){
 return list.filter(rule=>usableRegisteredPower(data,state,rule.id)).map(rule=>({...rule,used:!!rule.limit&&(state.powerUses?.[`${rule.limit}:${rule.id}`]??0)>0}));
}
/** Narrow fixed list is enforced; clients cannot choose amount, cost, duration or quota. */
export function validatedPowerEffects(rule:RegisteredPowerRule,params:{contextConfirmed?:unknown;skill?:unknown}={}){
 if(rule.context&&params.contextConfirmed!==true)throw new Error('power_context_required');
 const choiceRequired=rule.effects.some(e=>e.kind==='skill'&&(!e.skills||e.skills.length>1));
 if(choiceRequired){
  if(typeof params.skill!=='string'||!everySkill.includes(params.skill))throw new Error('power_skill_required');
  if(rule.effects.some(e=>e.kind==='skill'&&e.skills&&!e.skills.includes(params.skill as string)))throw new Error('power_skill_unavailable');
 }
 return rule.effects.map(effect=>effect.kind==='skill'&&choiceRequired?{...effect,skills:[params.skill as string]}:{...effect});
}
