# Audit des effets ciblés et périodiques — 9 octobre 2026

## Périmètre et vérification

Source normative : règles locales du dépôt, jamais un modèle générique de poison/feu. Le moteur pur `apps/api/src/rules/live-effects.ts` exécute seulement des paramètres validés ou les huit profils explicitement listés ci-dessous. Le routeur de table doit toujours vérifier propriété de la capacité/munition, accès de Vérité, protection/exposition, résistance, marge d'attaque, autorité MJ et paiement. Une preuve envoyée par un joueur n'est pas une preuve serveur.

Le script `apps/api/scripts/check-live-effects.mjs` vérifie les profils chiffrés, les bornes, les limites de cumul, les échéances, la distinction round/activation, la répétition d'un événement, le consentement et le coût en PA. Ce contrôle du moteur n'atteste pas à lui seul que toutes les capacités du corpus ont un parcours automatique d'attaque, de résistance et d'application.

## Profils canoniques explicitement représentés

| Source exacte | Condition nécessaire | Effet suivi | Fin / cumul / coût |
|---|---|---|---|
| `maitre_des_lames` — `reality-talents-revision.ts` | Attaque avec lame réussie, marge 6+, au moins 1 PV infligé, cible pouvant saigner ; choix de cette Altération | Perte de 2 PV à la fin du round suivant puis chaque round, sans seconde Armure | Une seule plaie par cible ; compression accessible 1 PA ou soin approprié. Fin de combat/scène n'est pas un soin |
| Khinae serpents, variante vipère — `truth/khinae.ts` | Morphologie autorisée, morsure infligeant au moins 1 PV, exposition, échec Vigueur + Constitution 15 | 1 PV irréductible au début des deux prochaines activations | Une exposition par cible et scène. Deux activations réelles, pas deux PA ni deux rounds |
| Khinae serpents, variante cobra — `truth/khinae.ts` | Morphologie autorisée, morsure, exposition, échec Vigueur + Constitution 15 | Maximum 1 PA physique à la prochaine activation | Fin de cette activation. Ne retire pas les PA mentaux/socials ; une exposition par cible et scène |
| `extral-venin-rocreen` — `truth/extral-revision.ts` | Capacité R disponible, attaque réussie à 10 m, exposition réelle, échec Vigueur + Constitution 15 ; protection hermétique exclut exposition | −3 aux tests physiques | Fin du prochain round ; 1 PA, 1/scène ; ne réduit pas génériquement les PA |
| `munitions-speciales-phoenix-hack` — `current-equipment-catalog-v1.json` | Altération obtenue, cible connectée/augmentée pertinente | −3 Défense Neuro | Fin de la prochaine activation. Aucun piratage complet ni malus à la Défense physique |
| `munitions-lourdes-consommables-grenade-flash-doorbell` — même source | Altération et exposition visuelle | −3 aux tests surtout visuels | Fin de la prochaine activation. Le caractère visuel du test reste une décision explicite |
| `extral-jet-d-encre` — `truth/extral-revision.ts` | Capacité disponible et vision réellement gênée, cible/zone atteinte dans les limites décrites | −3 aux tests visuels | Jusqu'au nettoyage ou à la sortie de zone ; 1 PA, 1/scène ; nettoyage accessible 1 PA |
| `extral-ouvrir-la-cuirasse` — même source | Altération appropriée, attaque capable de détériorer la protection matérielle, zone identifiée | −2 Armure matérielle de cette zone | Scène ou réparation ; une seule brèche de ce talent par zone |

Les identifiants `khinae-serpent-vipere` et `khinae-serpent-cobra` sont des clés de profils anatomiques du moteur, pas des talents achetables ajoutés au Builder. Le contrôleur vérifie lignée, variante, forme et état de révélation. Les limites « exposition par cible/scène » utilisent un compteur source-cible-scène protégé même si l'effet a déjà expiré. Le Cobra commence à la prochaine activation via `startsAt` ; `physicalPaSpent` compte les dépenses physiques dans cette activation et ne réduit jamais la réserve totale de PA mentale/sociale.

## Ce qui reste à l'arbitrage MJ

- Déterminer exposition, protection hermétique, saignement possible, vision utilisée par un test, zone touchée, capacité d'une arme à détériorer l'Armure et traitement effectivement approprié.
- Valider l'attaque et le jet de résistance qui déclenchent un effet. Les nombres ci-dessus n'annulent pas ces étapes.
- Définir un effet libre avec source, cible, portée d'application, valeur, durée, cumul et éventuelle périodicité. Il est enregistré comme **effet explicitement arbitré**, sans inventer un chiffre issu de la description d'un talent.
- Cocher un cumul additif uniquement lorsqu'une règle le permet. Les effets équivalents prennent le meilleur bénéfice et le malus équivalent le plus sévère ; les plaies et brèches listées sont exclusives.
- Appliquer l'Armure appropriée une seule fois à chaque tick réductible. Le routeur doit charger une Armure protégée de la cible ou un paramètre explicitement arbitré par le MJ. Les profils marqués `ignore` perdent directement les PV annoncés.
- Avancer les activations réelles lorsque la table ne dispose pas d'un événement non ambigu. Une dépense de PA ne vaut pas automatiquement une nouvelle activation.

## Munitions et capacités sans profil automatique inventé

| Texte canonique | Traitement correct |
|---|---|
| Phoenix Pyro : dégâts Feu, aucun DoT générique | Pas de dégâts périodiques ajoutés automatiquement ; embrasement uniquement si Altération/environnement cohérent, arbitrage MJ |
| Raven Flash : peut aveugler/éblouir | Pas de −3 universel fabriqué ; condition narrative validée selon exposition |
| Raven Volto : peut immobiliser ou faire perdre une passe future | Pas de retrait automatique arbitraire de PA ; décision selon cible et fiction |
| Phoenix Blast : projection/renversement | Déplacement/renversement compatible avec masse et appui, aucune télékinésie garantie |
| Owl Liquid : complication d'une plaie | Pas de saignement ou malus universel automatiquement fabriqué |
| Owl Rust : neutralisation d'une fonction augmentique accessible | Identifier la fonction et la durée réellement prévues, pas une extinction de toutes les augmentations |
| Cri surnaturel, malédiction, entrave ou conséquence sans valeurs complètes | Arbitrage explicite ; le moteur de suivi n'établit pas les paramètres à la place du canon |

## Contrat d'intégration serveur

1. Charger des effets protégés depuis la base, sous le verrou de campagne/acteur, avec la version de mutation.
2. Vérifier le participant source, le participant cible, les permissions, la capacité canonique et la décision MJ. Un effet hostile ou libre exige le MJ. Un effet consenti peut être soumis par sa source autorisée et accepté par sa cible ; un booléen de consentement du client ne suffit pas.
3. Valider le brouillon (`validateEffectDraft`) et le matérialiser (`createLiveEffect`). `planEffectMutation` vérifie les droits dérivés du contrôleur et les PA, puis `addLiveEffect` impose identifiants uniques et non-cumul. Le routeur `/api/campaigns/:id/mechanics` consomme réellement les PA et quotas de la source dans la même transaction. Une référence `sourceActionId` vérifiée à une attaque déjà payée de cette source sur cette cible évite de payer une seconde fois son PA ; la référence doit dater d'après le dernier changement de scène/scénario. En dehors du combat, le coût en action reste indiqué sans fabriquer de réserve de PA. Les doses/paquets de munitions ne sont pas automatiquement décrémentés par l'ajout d'une Altération après un tir : cette opération suit l'effet, pas une nouvelle consommation de tir.
4. Persister effets, version, coût et journal dans la même transaction idempotente. La propriété des effets et des curseurs ne peut pas être remplacée via la sauvegarde générale d'une fiche.
5. Pour chaque frontière réelle de round/activation, appeler `tickLiveEffects`, appliquer ses applications aux PV avec les bornes d'Agonie/mort du profil, puis sauvegarder le curseur et les expirations dans la même transaction. Les applications précèdent les expirations à la même frontière. Un replay du même compteur n'applique aucun second dégât.
6. Calculer les modificateurs avant les jets avec `effectModifiers`. Un effet visuel est appliqué uniquement si le contexte du jet a été déclaré visuel. Le détail du jet identifie les composantes effectivement retenues.
7. Retirer un effet avec autorité MJ, ou un traitement/self-dismiss autorisé et payé. Le propriétaire d'une fiche ne peut pas supprimer librement un venin hostile ou une Altération.
8. Une nouvelle scène expire les seuls effets `scene`. Une plaie `manual` continue jusqu'à traitement. Si un nouveau combat remet les rounds à 1, translater les horloges avec `rebaseLiveEffects` ou conserver une horloge de table monotone. Ne jamais renouveler un quota à cette occasion.

## Bornes et limites pratiques

- 100 effets maximum par collection/acteur, noms et références de 150 caractères maximum, compétences de 100 caractères maximum ; clés inconnues rejetées.
- Montants entiers entre −100 et 100 ; dégâts/soins strictement positifs ; plafond PA physique 0–5. Durées et ticks bornés à 1000, horloges bornées à 100000.
- Le moteur n'invente aucune rétroactivité : une frontière sautée ne provoque pas une rafale implicite de dégâts historiques. Le routeur avance les frontières consécutivement ou le MJ traite le temps écoulé explicitement.
- `remainingTicks` limite des occurrences ; `expires` limite une durée. Les curseurs empêchent le doublage d'une occurrence.
- La présence d'un profil dans ce moteur signifie que son **suivi chiffré** est disponible. Elle n'affirme pas que l'intégralité du parcours offensif de chaque Nature/munition est automatisée.
