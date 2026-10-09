# Audit mécanique Réalité — 9 octobre 2026

## Périmètre et méthode

Lecture des **122 talents de Réalité**, **367 équipements** et **146 augmentations** du catalogue actif. Les textes actifs proviennent de `terra-umbra-creation.ts`, qui applique la révision d'auteur `reality-talents-revision.ts` à la base historique ; la base seule n'est donc pas le canon final. Les profils d'équipement viennent du catalogue courant, des programmes Neuro et des véhicules. Les règles V9 versionnées dans `compendium-realite-v9-rules.ts` précisent les dérivées, l'augmentique, le Neurocombat et la protection.

L'inventaire [audit-reality-coverage-20261009.json](audit-reality-coverage-20261009.json) contient **635 entrées individuelles**, avec texte/profil canonique, calculs disponibles, arbitrages matériels et mécanique encore à connecter. Chaque `source` désigne le fichier versionné et l'entrée exacte ; `definitionSource` conserve la définition d'origine pour les talents révisés. Le champ `implemented` décrit les opérations disponibles, y compris l'inventaire ; `coverage` distingue le calcul mécanique de la simple acquisition, attribution et présentation. **189 des 367 équipements ne disposent que de ce suivi d'inventaire ; 178 ont un calcul ciblé.** La recette des routes et de l'interface reste nécessaire pour valider le comportement final. Aucun score n'est inventé à partir du nom ou du lore d'un objet.

## Constats concrets corrigés

| Point | Règle canonique | Correction intégrée et testée |
|---|---|---|
| Santé de fer et récupération doublée | +2 PV après les multiplicateurs, par 24 h avec repos | `realityDailyRecovery` multiplie la récupération de base puis ajoute 2 ; Constitution4, multiplicateur2 donne10 PV, pas12 |
| Régénération passive | Récupération naturelle quotidienne ×2, aucun double soin instantané | Multiplicateur de récupération dans `liveRealityProfile` ; pas de soin de combat généré |
| Poings de fer | DGT2 aux mains nues, bonus Pugilat+1 | `bareHandDamage` distingue talent du DGT1 ordinaire et des armes naturelles de Vérité |
| Réflexes défensifs | Défense active possible sous Surprise ; 1 PA, capacité physique réelle ; +1 Esquive de test | `permitsSurprisedDefense` et bonus de test ; aucune modification de la Défense passive |
| Contact à portée métrique | Lance1,5m et fouet3,5m restent des armes de contact | `realityWeaponProfile` utilise le Type canonique ; il ne confond plus toute portée autre que «Contact» avec Tir |
| DGT liés à Vigueur | Nextar Championship DGT V+2 | Formule explicite, calcul avec Vigueur actuelle ; les profils X/variable restent à préciser |
| Vecteur de dommages | Feu, Chimique et Électricité explicites utilisent leurs protections propres | Vecteurs documentés reconnus ; EMP seul n'est jamais converti en dégâts électriques |
| Réalignement spinal | +1 Athlétisme général | Bonus de test automatique ; aucune hausse de Rang permanent ou Initiative implicite |
| Défense électronique | G1+2 / G2+1 Défense Neuro, pas occulte | Bonus séparé de Défense Neuro |
| Maillage squelettique | Protection2/1 contre impacts, chute, écrasement et fracture | Réduction Antichoc explicite ; aucun blindage contre lame ou balle généralisé |
| Renfort d'armure | Module Renfort+1 sur un vecteur | Propriété additive séparée de la meilleure couche ; deux exemplaires identiques ne doivent pas se cumuler |
| Bonus V9 | Booster sensoriel3/2, scanner2, Gecko main/pied2 | Cinq bonus contextuels préparés, avec conditions matérielles lisibles |
| Booster d'adrénaline | +1PA max4 pour2/1rounds ; contrecoup Stress2/1 ; usage limité par scène | Activation, durée, quota et contrecoup dans des helpers dédiés, changement de round idempotent |
| Neuroprogrammes | Rang permanent, interface compatible, chargement et Unsinkable | Éligibilité et capacité contrôlées ; chargement ne fournit jamais rang ni PA gratuit |
| Munitions | Capacité explicite, Tir simple1charge ; rechargement normal1PA sous pression | Chargeurs séparés par UID, réserve déclarée décrémentée, validation des charges et absence de recharge scène/sauvegarde |

La clause Réflexes défensifs est explicitement révisée dans `reality-talents-revision.ts`, sous cet ID. La phrase ancienne de la base refusant une vraie Surprise est remplacée par la révision approuvée le 27 septembre.

## Talents, rangs et bonus

`compendium-realite-v9-rules.ts`, section Talents, stipule qu'un bonus de Talent n'augmente pas la valeur brute permanente utilisée par les dérivées, sauf indication explicite. Les rangs achetés et choix marqués permanents pilotent PV, Défense passive, Initiative de base, déplacement, Intégrité et Rang Neuro. Les +1 d'expertise pilotent le jet approprié.

Le module ajoute **31 contextes explicites** aux contextes déjà préparés. Les compétences et valeurs nommées dans les règles sont reprises. Un bonus dont le texte ne nomme aucune compétence apparaît comme contexte opt-in pour le test réellement concerné, avec son périmètre visible ; aucune compétence permanente n'est choisie par inférence. Exemple : Enfant du quartier ne transforme pas tous les jets Investigation en +3. Le joueur doit déclarer la recherche dans son quartier d'enfance. Un choix manquant pour Sens accru, Culture produit ou Présence remarquable n'active pas automatiquement le bonus.

Les bonus équivalents gardent leur meilleure valeur. Omerta et Omerta familiale constituent l'exception explicite +4. Mental d'acier n'est pas un troisième bonus dans ce cas. Les bonus manuels conservent leur fonction d'arbitrage et doivent apparaître séparément dans le journal.

## Charges et Stress augmentiques

`liveRealityProfile` calcule Charge permanente, Stress brut, malus Neurocompatibilité nulle, meilleure réduction Stabilité augmentique/Iron Law et Stress temporaire. La désactivation d'une fonction ne fait pas disparaître l'implant ni sa Charge/sollicitation permanente. Iron Law ne réduit que le Stress d'implants cybermécaniques intégrés, minimum zéro par implant. Les sources biologiques ne sont pas converties implicitement en Cyber.

Le helper `augmenticCrisis` reprend la table V9 : égalité à l'Intégrité ou au maximum de Stress DD15 ; dépassement1 DD18 ; dépassement2 DD21 ; dépassement3+ DD25. Si deux causes concernent la même crise, garder la difficulté la plus forte et faire un seul test Volonté+Maîtrise spirituelle. Le déclencheur majeur relève de la scène ; une égalité seule ne déclenche pas arbitrairement un jet à chaque rafraîchissement.

La Frénésie n'accorde aucun PA. Son impulsion est définie ; si possible au moins1PA/round y est consacré. Actions exigeant calme/précision cognitive/concentration : circonstance−3. Sortie volontaire DD15, DD12 si la cause a disparu. Ces conséquences nécessitent un état Frénésie et une commande de test ; le simple affichage de la Charge ne prouve pas leur application.

**Adrénaline :** le catalogue dit «Stress temporaire» sans préciser augmentique. Le contrecoup est traité comme ajout de1/2 niveaux au Stress général, plafonné à Paniqué ; G2 sur un état Tendu donne donc Paniqué. Aucune durée arbitraire de disparition n'est inventée. Un Stress psychologique existant plus fort reste applicable. Si le combat se termine pendant l'impulsion, finaliser le contrecoup évite de conserver un bonus puis de le réutiliser gratuitement dans un autre combat.

## Neurocombat

Canon V9 :

| Action | Condition et formule |
|---|---|
| Défense passive Neuro | Volonté+Force Mentale |
| Défense active Neuro | 1PA, programme défensif chargé, Volonté+Force Mentale+1d10e et effet du programme choisi |
| Neuroattaque | 1PA, programme offensif chargé, Volonté+Neurodive+1d10e |
| PV neuronaux d'une cible vivante | Marge, plus bonus de dégâts explicite ; ignore l'Armure physique |
| Changement du chargement | Libre hors pression ; 1PA sous pression pour le changement de configuration |
| Sacrifice de programme | Copie locale détruite, annule3PV restants ; slot grillé jusqu'à fin de Neurocombat et redémarrage sûr |

Six programmes défensifs ordinaires sont profilés : D-Fence, Shieldic, MyWall, 2-Fence, Omnithorns et Castland. Six offensifs sont profilés en dégâts de marge : Datablast, Dark Holes, Darksword, Langoliers, Calamities Reign et Darkalibur. Un choix de programme défensif unique est requis ; leurs bonus ne se somment pas. Le Rang est 0/1/2/3/4 pour Neurodive permanent0/1–3/4–6/7–9/10–15 ; Neurodriver ajoute un emplacement si Rang positif, sans augmenter le Rang.

Les conditions particulières de Zero K, Icewall ou Nanaruto ne sont pas assimilées à une défense universelle. Les contrôles OverLoad IV, King Crash et Ace-BurnX ne reçoivent aucun faux DGT. Les IA/programmes ciblés ont des états logiciels selon marge ; ils ne doivent pas recevoir une jauge arbitraire de PV humains.

`configureNeuroLoad` contrôle propriété, UID, interfaces, Unsinkable, Rang, capacité et slots grillés. `neuroSacrifice` ne choisit que des copies chargées, retire la copie locale de l'inventaire et bloque son slot ; aucun changement de scène ne recrée une licence détruite. L'appel doit se faire après défense/réductions et avant perte des PV, exclusivement sur un dommage Neuro. Les effets secondaires restent visibles individuellement dans l'inventaire.

`rebootNeuro` permet ensuite un redémarrage sûr explicitement confirmé, hors combat, pour un personnage vivant et conscient disposant toujours d'un Rang et d'une interface compatibles. Il libère les slots grillés et vide le chargement ; il ne restaure aucune copie ni licence sacrifiée, ne rend aucun PA et ne coûte aucun PA hors pression. Même après ce redémarrage, une copie dont la quantité est zéro ne peut pas être rechargée. La gestion d'un Neurocombat indépendant pendant un combat physique reste distincte : cette commande minimale exige que le combat suivi par l'application soit terminé.

## Charges d'armes et munitions

`weaponMagazine` et `consumeWeaponCharge` suivent chaque arme possédée par son UID. La première utilisation considère prêt le chargeur de capacité canonique ; aucune quantité de réserve n'est créée. Le Tir simple consomme une charge, même si le jet échoue. Une arme sans capacité explicite ne reçoit aucun nombre arbitraire de cartouches. Les indications «6 usages» et «5 usages» des projecteurs sont reconnues comme capacités de six et cinq utilisations, sans les convertir en cartouches ordinaires.

Le Moteur définit le nombre d'impacts de Rafale, mais pas son nombre de cartouches. Rafale et Suppression demandent donc une consommation réellement déclarée ; les impacts infligés ne deviennent jamais trois cartouches par supposition. Le mode doit être permis par Rafale ou Automatique. Le débit doit se faire une seule fois au lancement idempotent, avant le jet, dans la même transaction que le PA.

`reloadWeapon` vérifie l'arme réellement possédée, son état et la capacité. Le PA normal du rechargement est confirmé par la clause de Rechargement quadrimanuel, qui permet expressément de ne pas le payer. Hors pression le PA n'est pas débité. Avec une réserve déclarée (`ammoCount[UID]`), les charges transférées sont retirées de cette réserve ; une réserve nulle ne peut être contournée par une simple confirmation. Sans réserve numérique, le joueur confirme l'existence de munitions accessibles pour cette recharge. Ce suivi ne prouve pas leur compatibilité ni ne génère un achat gratuit. Une correction par `configureWeaponMagazine` relève du MJ en combat et d'une déclaration d'inventaire hors combat.

Les deux champs `magazines` et `ammoCount` sont des états protégés. Les commandes de scène, round, révélation ou sauvegarde ne les renouvellent pas. Une exception gratuite de rechargement est fournie par le serveur après ses conditions et son quota, jamais par une valeur `freeReload` envoyée par le joueur. Les magasins des PNJ, les installations complexes, le ravitaillement bio-organique et les consommables à profils particuliers exigent encore leur procédure propre.

Le branchement serveur est vérifié : `campaign-combat.ts` débite la charge avant le jet et le PA dans la transaction du lancement. Le rejeu de la même requête ne débite pas une seconde fois ; une nouvelle attaque avec un chargeur vide échoue sans consommer de PA. `character-live-mechanics.ts` expose recharge et déclaration, et la sauvegarde protège les deux compteurs. Le panneau de ressources et les options d'attaque affichent les charges.

## Combat, état et PA : vérifications de conception

L'Initiative reste unique par combat. Les PA du round proviennent de cette Initiative ; ils ne sont pas relancés au changement de round. Les blessures imposent les minima Stress à50% et25%. À0PV, Agonie et limite d'action suivent leur règle ; aucune baisse PA inventée à «Blessé» ou «Gravement blessé». Les minima de blessures, le Stress psychologique et les effets de douleur sont distincts.

Les jets généraux utilisent le d10 explosif avec la table Stress active. Un échec narratif d'attaque doit empêcher un succès par le seul total élevé. Edge forcing remplace le résultat par son résultat garanti, et Edge escape garde une référence à une conséquence létale réelle ; les usages sont idempotents et ne sont pas des relances gratuites.

La portée, les passes, Défense active, Surprise, mouvement, armure, Perforant et vecteur sont des choix/états différents. Une arme présentant Zone, Autoguide, Hypodermique ou EMP reste soumise à ces règles même si ses DGT de base sont calculables. Le calcul de DGT seul ne prouve pas l'intégration de toutes ses propriétés.

La liste d'attaque utilise désormais le profil canonique d'une arme, même si son nom figurait déjà dans une table historique du bestiaire. Cette priorité corrige les allonges de mêlée et les DGT liés à la Vigueur pour les PJ et les PNJ. Les armes augmentiques de Pugilat consomment le prochain bonus de Pugilat ; elles ne sont plus assimilées à Mêlée lors de cette consommation. Les gains directs de PA ne se cumulent pas avec l'Adrénaline dans le même round, y compris sa réattribution au second round ; une capacité plafonnée à 4 ne retire jamais des PA déjà accordés au-delà de son propre plafond.

La Défense Neuro active emploie le total du test Force Mentale, la Défense électronique et un seul programme chargé. La Défense passive garde sa formule permanente. Envoyer le nom d'un programme dans une défense passive ne donne aucun bonus gratuit. Les effets physiques et de compétence affectent les attaques et défenses des PNJ. Une brèche d'Armure n'affecte que la zone réellement déclarée ; sans zone, elle reste à arbitrer manuellement. Deux exemplaires d'un même Renfort d'armure ne s'additionnent pas.

Les nouvelles armes de Vérité sont suivies dans leur propre module : 74 profils explicites et neuf protections matérielles possédées. Les vecteurs Laser, Plasma, Ion et EMP indéterminés exigent une décision MJ explicite, conservée au journal ; aucun de ces profils ne devient silencieusement Balistique. Les régimes Custodian/Duplex paient désormais le changement et persistent ; Atomus suit son changement gratuit par activation. Les réserves déclarées et refroidissement Helios ont leurs handlers ; les autres ressources restent assistées. La Lame céleste préparée comme arme de tir utilise Tir, et l'arme de Forme daemoniaque exige l'état Révélé.

## Mécaniques qui demandent encore une action ou un état concret

Les entrées JSON documentent chaque cas. Les familles prioritaires sont :

1. **Réalité à effet signature :** attaque double Ambidextre atomique, Viser gratuit Tireur de précision, relances Profil calibré/Omerta familiale/Conseiller, atténuation Stable, effet Doc de choc associé au soigneur, quota premier Stress Ministère, économie progression Apprentissage fulgurant.
2. **Munitions et modes :** relation arme-munition, procédure PNJ, exception quadrimanuelle et quota, rafale/suppression/dispersion, Raven Night bonus 5 non doublé, Venom test Constitution DD 15 et poison 2 si des PV passent, injection hypodermique et propriétés spéciales. Le suivi chargeur/restant/rechargement des armes possédées est connecté et testé ; il ne résout pas à lui seul ces modes et propriétés.
3. **Protections matérielles :** Ablatif est désormais consommé par impact applicable et exemplaire PJ/PNJ ; plaques liées à un support sélectionné confirmé. Les slots, compatibilités, Antichoc6 du Scaph sous l'eau, Protection3 Estomac blindé dans le tube digestif et perte d'étanchéité après perforation restent contextuels.
4. **Neuro secondaire :** retours Shieldic/Omnithorns seulement si des PV passent, interceptions 2-Fence, effets limités à la prochaine activation, contrôle/expulsion, programmes corrompus, sauvegardes et licences, environnement réellement connecté et cycle de Neurocombat indépendant. Le redémarrage sûr hors combat libérant les slots sans recréer les copies est désormais couvert.
5. **Consommables et durées :** N-Sta1h et1/h, Crashware, Kick avant Initiative uniquement, Velvet psychologique sans réduire blessures, Autoinjecteur3doses1/round, poison/dépendance et retour de produit. Ne pas utiliser l'heure réelle du serveur comme temps fictif.
6. **Véhicules :** Structure, Blindage, conducteur/Pilotage/autopilote, dommages aux occupants, collision et piratage. Un véhicule n'a pas une réserve PA supplémentaire.
7. **Prestations et droits :** 18talents à quotas narratifs dans l'inventaire ; Dette de faveur ne se recharge pas au scénario ; Nid de frelons3nuits cumulées même en changeant de refuge.

Ces effets bénéficient d'un moteur d'effets/ressources explicites et de journaux. Leur arbitrage matériel reste nécessaire : aucune fonction de logiciel ne crée une connexion avec un implant hors ligne, aucun Contact n'est un succès automatique de persuasion et un soin ne reconstruit pas un membre absent sans règle autorisant cet effet.

## Contradiction de source à résoudre

Deux sections V9 divergent sur **Viser et Verrouillage** : «Portée et Verrouillage» autorise leur cumul si les deux actions sont payées ; la section modules optiques ordonne de prendre le meilleur bonus de ciblage entre Dispositif de visée, Viser et Verrouillage. Le moteur ne doit pas choisir tacitement une version ni fournir +6 systématique. Conserver l'arbitrage MJ et harmoniser la règle auteur avant automatisation de ce cumul.

## Vérifications exécutables

`apps/api/scripts/check-live-reality.mjs` vérifie les formules récupération, DGT, bonus Neuro, Charge/Stress, réduction non cumulée, absence d'interface/Unsinkable, capacité et slots brûlés, chargement/sacrifice/redémarrage sûr, durée et quota Adrénaline, Surprise, protections, magasins distincts par UID, réserve épuisée non contournable et consommation multi-tir non inventée. Le redémarrage refuse combat, absence de confirmation, incapacité et incompatibilité ; la capacité réouverte n'autorise jamais une copie détruite. Tests purs réussis le 9 octobre 2026. La validation globale API/DOM/CI doit inclure ce script et les scénarios routes qui consomment les mêmes états.

`check-integration-reality.mjs` vérifie le ciblage fixe des effets, la consommation du prochain test, les quotas préparés, l'exclusion des anciens contextes permettant un contournement, le jet serveur des Spectres, les plafonds de sacrifice et l'accessibilité des commandes Angelus.

`check-reality-combat.mjs` teste les armes canoniques, les copies par UID, les armes augmentiques, la Lame de tir, les effets PNJ et la zone d'Armure. Son hook API vérifie une tentative de bonus gratuit sur Défense Neuro passive, le total complet de Force Mentale en actif, le rejeu d'une attaque et le refus d'un chargeur vide sans payer de PA.

Son scénario `checkNeuroRestart` crée une fiche autonome et vérifie les droits du propriétaire, le refus d'un autre compte, le blocage en combat, la confirmation obligatoire, le rejeu idempotent et les champs protégés. Après redémarrage, la copie sacrifiée conserve sa quantité zéro et reste impossible à charger ; une copie fraîche possédée peut être chargée dans le slot libéré. Ce scénario API passe avec le harness complet.

Le harness API complet `check-character-play.mjs`, exécuté dans PGlite isolé le 9 octobre 2026, passe avec ces hooks ainsi que les tests de combat, rounds, Edge, Vampire, Nature, registre, effets, catalogue et réparations du Dive. La compilation TypeScript API passe. Les tests DOM et la compilation Web sont recensés dans l'audit global du lot.

Le [complément mécaniques et UX](audit-gameplay-and-ux-20261010.md) ajoute les compteurs d’Ablatif, le remplacement réel et les tests de résolution PJ/PNJ. Les Plaques ablatives quittent la couverture uniquement d’inventaire : 189 entrées restent dans cette catégorie, contre 190 auparavant, sans changer les 367 équipements.
