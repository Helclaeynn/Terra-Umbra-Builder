# Audit de la Foudre — variantes et effets, 9 octobre 2026

Branche : `feature/tuc-web-v2`. Cette passe étend le lot Foudre/Paratonnerre ; elle ne constitue pas un déploiement en production.

## Sources faisant foi

La table « Règles communes de Foudre » de `apps/api/src/compendium-verite-v7-aseryns.ts` fixe Volonté + Maîtrise spirituelle + d10e, 20 m, dégâts par marge, protection électrique adaptée et absence des paliers de Tir.

Les talents viennent de `apps/api/src/rules/truth/catalog-aseryn.ts`. Le paquet effectivement utilisé par le Builder applique ensuite `apps/api/src/rules/truth/aseryn-revision.ts`. Ces révisions priment sur le catalogue importé lorsqu’elles diffèrent : **Trait du Silence coûte 1 PA**, **Éclipse noire peut viser jusqu’à trois présences ou effets perçus**, et **Paratonnerre peut protéger un allié à 5 m maximum**. La précédente restriction de Paratonnerre au seul utilisateur est donc corrigée dans le moteur et dans cet audit.

L’acquisition d’un talent spécialisé représente son enseignement reçu. Le moteur vérifie chaque ID possédé, toute la chaîne de prérequis et la Révélation ; il ne déduit pas une formation de la simple origine aseryne. La formation narrative et une éventuelle seconde spécialisation demeurent des décisions de campagne.

## Attaques réellement branchées

`lightningAttacks` alimente les options possédées du personnage. `lightningPlan` vérifie les cibles avant paiement, puis la route de combat paie le coût et le quota et enregistre le jet.

| Attaque | DGT | PA | Exécution et limites |
|---|---:|---:|---|
| Foudre aseryne | 7 | 1 | Cible directe à 20 m maximum. |
| Foudre originelle | 9 | 1 | Chaîne Conduction → Foudre → Originelle réellement possédée. |
| Déferlement originel | 13 | 2 | Une fois par scène ; protections magiques confirmées par le MJ exclues. |
| Orage aseryn | 7 | 2 | Une fois par scène ; centre à 20 m, rayon de 3 m ; un jet commun, défenses et dégâts distincts par cible. |
| Noire-Foudre | 7 | 1 | Cible immatérielle réellement perçue et confirmée : Défense/Protection occultes. Aucun droit automatique de choisir la défense la plus faible d’une cible ordinaire. |
| Fulguration spirituelle | 7 | 1 | Une fois par scène ; composante immatérielle exposée ou engagée, perçue et confirmée ; Défense occulte imposée. |
| Éclipse noire | 9 | 2 | Une fois par scène ; jusqu’à trois cibles immatérielles perçues ; même jet, Défense occulte imposée et résolution individuelle. |
| Foudre vaporeuse | 7 | 1 | Sacrifice de 2 dégâts avant réduction ; érosion d’une couche directement atteinte choisie et confirmée par le MJ. |
| Foudre du Silence | 7 | 1 | Attaque chiffrée ; ses propriétés silencieuses demeurent une information de fiction. |
| Trait du Silence | 9 | 1 | Une fois par scène ; protection applicable divisée par deux, arrondie à l’inférieur. Pas d’effacement gratuit d’organe. |

Les armures physiques ordinaires ne réduisent aucune de ces attaques. La protection pertinente est électrique, ou occulte pour une cible réellement immatérielle. Une protection supplémentaire ou sa part magique demande un arbitrage explicite du MJ ; le serveur ne transforme pas une armure quelconque en isolation.

**Arc en chaîne** est une action après une première attaque de Foudre effectivement résolue et réussie. Une autre cible à 3 m maximum reçoit le même score à DGT 5 et se défend normalement. Un seul rebond, une fois par scène, aucun nouveau jet ni PA d’attaque ; une seconde demande ou un rebond de rebond est refusé.

**Paratonnerre** peut protéger l’utilisateur ou un allié confirmé à 5 m maximum. La réaction coûte 1 PA, une fois par round, en SR/R, avant toute défense choisie ou résolution. Le propriétaire du réacteur ou le MJ agit. Une réussite annule seulement l’impact enregistré sur la cible protégée : les autres victimes de la zone restent exposées. Destination sûre/conductrice confirmée, aucun renvoi offensif gratuit. Edge avant ou après une opposition échouée conserve le même acteur et le même impact et ne dépense pas un second PA.

## Érosion, effets magiques et blessures

**Vaporeuse/Ruine** enregistrent l’érosion de la couche exacte pour la scène : −2, ou −3 avec Ruine, sans cumul entre les deux. Sacrifier deux points exige une attaque réussie ayant au moins deux dégâts avant réduction. Une couche ne peut subir cette version deux fois. La réduction peut servir aux attaques ultérieures ; sa disparition est liée à la scène. Les protections spirituelles, les couverts et leur nature restent confirmés par le MJ.

La route **`/api/campaigns/:id/lightning-effects`** et le composant **CampaignLightningEffects** permettent au MJ de choisir un talent possédé et un effet réellement présent dans `state.effects` ou `data.liveEffects`. Le résultat de lancement d’une résolution occulte liée fait foi ; à défaut, le MJ choisit 15/18/21/25 et décrit son arbitrage. Aucun effet, ennemi, PV, Nature ou point de Corruption n’est créé ou effacé par une simple description.

- **Brise-magie** détruit un effet temporaire vaincu ; un effet durable interruptible est suspendu pour la scène.
- **Éroder l’affliction** atténue de 3 un malus négatif enregistré, sans guérir automatiquement la malédiction ni retirer de Corruption. Les résistances fictionnelles ou difficultés sans représentation exécutable ne sont pas inventées par le moteur.
- **Éclipse noire** peut dissiper jusqu’à trois effets métaphysiques temporaires perçus avec le même jet ; une créature à PV passe par la route d’attaque et conserve ses PV.
- **Réduire en poussière** réutilise exclusivement un jet payé, réussi et lié à l’effet exact. Aucun nouveau jet gratuit. Effet temporaire détruit, effet durable interruptible suspendu pour la scène ; effets primordiaux, indestructibles et créatures exclus.

Les effets durables suspendus ou atténués gardent une restauration protégée. La fin de scène remet uniquement les effets encore présents et inchangés dans leur état antérieur : un effet retiré ou remplacé n’est jamais ressuscité. Les liens de maintien ne sont pas effacés par une suspension ; la destruction nettoie les liens devenus sans effet.

**Trace du Néant** conserve les PV réellement perdus par Silence/Trait. Seule cette part est inaccessible à la régénération surnaturelle jusqu’à la fin de scène : les autres blessures restent régénérables. Le plafond suit le maximum actuel de la forme sans oublier la blessure ni diminuer arbitrairement les PV actuels. Stase/prédation vampiriques, récupération surnaturelle, régénération et réparation disposent de ce plafond. Un soin externe réel peut soigner la blessure ; il n’est pas assimilé automatiquement à une régénération. Les soins périodiques emploient une classification explicite `healingKind`, sans déduction par leur nom.

**Fin véritable** exige le talent et Trace, une attaque Silence réellement létale, un Fléau/engeance confirmé par le MJ et des conditions de destruction réellement accomplies, accompagnées d’une note. Elle ne détruit pas gratuitement une cible vivante et ne contourne aucun verrou narratif. La destruction finale survit à la scène et empêche une survie automatique ; une grâce explicite du MJ peut lever cet état pendant la recette.

## Garanties et contrôles

Les mutations portent les versions des fiches ; les demandes répétées avec le même UUID et le même contenu ne paient et n’appliquent qu’une fois. Une demande différente réutilisant cet UUID est refusée. Les sources et jets cessent d’être réutilisables après une frontière de scène/séance ou un combat fermé. Les outils d’effets sont réservés au MJ, les coûts utilisent le véritable pool de PA et respectent ses réserves physiques. Initiative et PA par round restent ceux du combat.

Contrôles exécutés localement sur PostgreSQL embarqué et DOM :

- `check-lightning-variants.mjs` : prérequis complets, coûts de la révision, quotas, portée, perception, zones et protections.
- `check-lightning-variants-api.mjs` : dix options, coûts/dégâts/quota, jet unique d’Orage/Éclipse, défenses indépendantes, Vaporeuse persistée, Arc payé une seule fois, Paratonnerre allié 5 m, blessures Trace/stase/soins ordinaires/fin de scène et Fin avec grâce.
- `check-lightning-effects.mjs` : vrais effets, accès MJ, versions, répétitions, jet payé/Poussière/Edge, suspension et restauration sans résurrection.
- `check-lightning-wounds.mjs` : PV réels, changements de maximum, soins distincts, expiration exacte, destruction finale conditionnée et typage explicite des soins périodiques.
- `lightning-effects-dom.mjs` : outil fermé sans polling, sélection, confirmation fraîche, résultat détaillé, suite du jet payé et reprise exacte d’un envoi sans réponse.

La validation complète du lot et la recette navigateur responsive sont suivies par la CI de la branche ; cet audit ne remplace pas leurs résultats.

## Arbitrages de fiction qui restent explicites

Conduction sur circuits, Décharge maîtrisée, conducteurs accessibles, ciblage d’un composant, discrétion visuelle/sonore, effacement précis de matière, obstacles et vulnérabilité d’un Fléau exigent une situation décrite et l’arbitrage du MJ. Le moteur ne simule pas un réseau électrique ou une géométrie de scène et ne transforme pas ces clauses en bonus numériques inventés. Les PNJ utilisant une capacité sans acquisition structurée restent pilotés par le MJ. Ces cas ne bloquent pas la passe UX : les actions chiffrées ci-dessus sont accessibles, leurs conditions restent contextualisées.
