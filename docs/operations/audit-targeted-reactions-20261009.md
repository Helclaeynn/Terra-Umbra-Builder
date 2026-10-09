# Soutiens ciblés et réactions — 9 octobre 2026

Ce complément décrit sept talents et un trait gratuit désormais reliés à une résolution serveur. Il ne change aucun texte canonique et n’ajoute aucune capacité au catalogue. Les sources restent celles des lignes de l’inventaire global.

| Capacité | Résolution effective | Conditions restant à confirmer |
| --- | --- | --- |
| Suture | Stabilise un agonisant vivant, arrête le saignement ordinaire de Maître des lames ; aucun soin de PV, aucune résurrection | Contact, créature vivante, blessure accessible aux soins ordinaires ; 1 PA en combat |
| Réfection vitale | Volonté + Maîtrise spirituelle + d10e contre 18 ; rend 4 + DR PV, DR par tranche de 3 de marge, maximum 5 ; plafonds de soins et réserve nanitique appliqués | Contact et blessure régénérable ; 1 PA en combat ; une réussite par scénario et bénéficiaire, même avec plusieurs lanceurs |
| Rune de Garde | Une rune active par runiste ; réduction 6 sur le premier impact surnaturel réussi, puis consommation ; une protection par scénario et bénéficiaire | Dix minutes d’inscription achevées hors combat, support réellement porté ; vecteur occulte reconnu, autre impact surnaturel confirmé par le MJ |
| Gardien de la Meute | Pelage Gris Révélé : 1 PA, changement de cible avant défense ; portée strictement inférieure au Déplacement | Allié et interposition physiquement possible |
| Riposte du Gardien | Après cette interposition : +3 au prochain jet contre le même agresseur, consommé au jet ; expire après le round suivant | L’agresseur doit être un participant identifié ; attaque normale et coût normal |
| Interposition de Caendis | 1 PA, redirige une attaque physique vers l’intervenant situé à 2 m maximum | Talent accessible, allié, trajet physiquement possible |
| Interposition doctrinale | 1 PA, une fois par round ; Agilité + Esquive + d10e ; conserve la meilleure défense entre bénéficiaire et intervenant | Attaque perçue, allié proche et intervention physiquement possible ; aucune portée numérique inventée |
| Riposte d’Ashorn | Après défense active réussie contre Mêlée/Pugilat : attaque normale immédiate contre l’agresseur, sans PA supplémentaire, une fois par scène | Arme réellement possédée ou attaque naturelle ; portée confirmée ; lancer avant clôture de l’attaque initiale |

## Accès, consentement et horloges

Le serveur vérifie possession, formation/réseau, conscience, Révélation, participation, état et PA. Un joueur proposant un soutien sur une autre fiche crée une demande privée : le propriétaire du bénéficiaire ou le MJ doit l’accepter. Aucun PA, Edge ou soin n’est consommé à la proposition. L’acceptation utilise la proposition enregistrée, vérifie à nouveau les versions et applique les mutations dans une transaction. Le MJ peut appliquer directement un soutien à un PJ ou PNJ.

La résolution de soutien conserve les PV numériques pour le bénéficiaire et le MJ. Le lanceur reçoit le détail de son jet et du soin sans les PV avant/après d’un tiers. Les autres joueurs ne reçoivent ni demandes ni résultats techniques privés. Le suivi est réservé à la campagne autorisée.

Les identifiants de requête permettent de réessayer une réponse réseau perdue sans payer deux fois. Les quotas reçus et la rune ne se rechargent pas par sauvegarde, changement de révélation, de scène ou de lanceur. Le changement de scénario les remet à zéro. Les propositions devenues anciennes après changement de round, combat, scène ou scénario ne peuvent plus être acceptées.

Les interventions doivent précéder défense, résolution et annulation. Une seule intervention est admise par attaque ; les chaînes de réactions restent hors de ce lot. Une réaction dépense les PA de l’intervenant sans lui donner un tour ordinaire supplémentaire. La riposte d’Ashorn fonctionne même lorsque la défense a dépensé son dernier PA. L’Edge avant le jet est disponible pour Réfection, Interposition doctrinale et les attaques/défenses ordinaires ; forcer après coup un soutien déjà appliqué n’est pas proposé.

## Sources et vérifications

Sources : `rules/truth/exile-revision.ts` (Suture, Réfection, Rune), `catalog-exile.ts` (Ashorn), `catalog-garou.ts` et `runtime-structure.ts` (Gardien), `catalog-extral.ts` (AIDH), catalogue Aseryn chargé par `truth/rules.ts` (Caendis), `compendium/source/rules-diagrams-v1.json`, article `regles-resolution-des-tests` (DR).

Exécution : `rules/targeted-powers.ts`, `campaign-targeted-powers.ts`, `campaign-combat.ts`, `live-effect-application.ts`. Contrôles : `scripts/check-targeted-powers.mjs` dans la suite API avec PostgreSQL embarqué et `tests/campaign-targeted-dom.mjs` dans la suite UI. Les tests couvrent notamment propriété, consentement, versions, rejeu, refus après mort, quota par bénéficiaire, sauvegarde falsifiée, rune consommée une fois, portée stricte, mauvaise cible, intervention tardive, bonus lié à l’agresseur et riposte sans PA restant.

Restent à intégrer : sorts Mage sur cible/zone, illusions/domination, protections collectives et transferts, autres ripostes et interceptions, renvoi Neuro, Foudre/Paratonnerre, chaînes de réactions et conséquences narratives. Les montants et ressources de ces capacités ne doivent pas être confondus avec une résolution complète.
