# Foudre et Paratonnerre — 9 octobre 2026

Deux capacités sont désormais exécutées côté serveur : Foudre aseryne et Paratonnerre. Leurs ID et textes canoniques restent inchangés. Les variantes de Foudre, les rebonds et les zones restent assistés.

## Attaque de Foudre aseryne

Le personnage doit être un Aseryn Initié, posséder Conduction et Foudre aseryne et être Révélé. La simple possession du talent sans Conduction n’ouvre aucune attaque. L’attaque coûte 1 PA, choisit directement un participant de la campagne et exige une distance réelle confirmée de 0 à 20 m inclus.

Le jet est Volonté + Maîtrise spirituelle + d10e, avec les bonus de fiche décomposés. L’Edge avant le lancer utilise la règle existante. L’initiative reste celle du début du combat. La défense pertinente est choisie et confirmée avec le MJ : Physique/Esquive ou Occulte/Force mentale. Le serveur prend les valeurs de la fiche ; un total de défense arbitraire n’est pas envoyé à cette place.

Les dégâts valent marge de réussite + 7 DGT + bonus déclarés − protection électrique applicable. L’attaque doit dépasser la défense ; un échec narratif ne touche pas. Aucun double DGT ni Altération de Tir n’est appliqué aux marges 6 ou 11. Ce régime appartient à la Foudre, pas à tout équipement électrique : un taser conserve son calcul de Tir.

Les plaques, Kevlar, Armure corporelle et Armure conventionnelle sont ignorés. Les réductions explicitement électriques du profil et des protections possédées sélectionnées restent applicables. Une protection sans valeur électrique explicite — isolation, Faraday ou protection surnaturelle adaptée — nécessite un montant, une source et une confirmation du MJ. Les joueurs ne peuvent pas ajouter ce montant arbitré. Les réductions génériques physiques et capacités de réduction physique ne sont pas converties automatiquement en protection électrique.

La Rune de Garde reconnaît cette attaque comme surnaturelle sans case supplémentaire. Un véritable impact consomme la Rune ; une décharge détournée par Paratonnerre ne la consomme pas.

## Paratonnerre

Conduction, Foudre aseryne et Paratonnerre doivent être réellement possédés. Paratonnerre est disponible en Semi-Révélé ou Révélé : son prérequis Foudre aseryne doit être connu, sans imposer R à la réaction elle-même. Un Profane ou un personnage Voilé n’y a pas accès.

La réaction est proposée au propriétaire du personnage ciblé ou au MJ, contre une attaque principalement électrique. Elle coûte 1 PA et consomme une utilisation par round, même si le jet échoue. L’Aseryn doit pouvoir agir, percevoir l’attaque et confirmer un conducteur ou une zone valide proche. Aucune portée numérique absente du texte n’est inventée. La commande protège uniquement les dégâts qu’il aurait personnellement subis ; elle ne protège pas automatiquement un allié et ne crée aucun renvoi offensif.

Le jet de Foudre est opposé au résultat de l’attaque. À égalité ou au-dessus, hors échec narratif, les dégâts personnels sont annulés. Le résultat et ses dés apparaissent immédiatement. La résolution peut alors enregistrer 0 dégât sans dépenser un second PA de défense. Après un échec, une défense ordinaire reste possible et paie normalement son éventuel PA.

La fenêtre précède le choix de défense et la résolution. Aucun contournement après défense, clôture ou fin de combat n’est admis. Ce lot n’exécute pas les chaînes d’interpositions : une attaque déjà interceptée ne reçoit pas aussi Paratonnerre, et inversement.

L’Edge est disponible avant le jet et après un résultat échoué, une fois, tant que sa fenêtre reste ouverte. Forcer après le résultat met à jour les mêmes dés et la même opposition, sans dépenser de nouveau PA ni recharger le quota. Une attaque ayant déjà été opposée par Paratonnerre ne peut plus être réécrite par l’attaquant via une dépense d’Edge tardive. Les requêtes répétées identiques ne paient pas deux fois ; les versions anciennes sont refusées.

## Sources, confidentialité et couverture

Sources primaires : `apps/api/src/compendium-verite-v7-aseryns.ts`, table « Jet de Foudre » ; `apps/api/src/rules/truth/catalog-aseryn.ts`, ID de Conduction, Foudre aseryne et Paratonnerre ; catalogue de Réalité pour les protections électriques chiffrées. Le coût d’acquisition en PTV reste distinct du coût d’action.

Exécution : `rules/lightning.ts`, `rules/combat-damage.ts`, `campaign-combat.ts`, `character-edge.ts`. L’activation générique personnelle ne permet plus de contourner ces routes dédiées. Aucun talent, chiffre de spécialisation ou équipement ne se crée à partir du nom d’un pouvoir.

Les attaques du personnage utilisent le journal existant et les projections publiques existantes. Les détails privés de Paratonnerre et la destination de la décharge ne sont pas ajoutés au journal public des autres joueurs. Le MJ conserve le résultat complet et les PV ; le propriétaire dispose de sa réaction détaillée. Les tests API et DOM couvrent les permissions, prérequis, Révélation, portée, protection électrique, rejeu, horloges, Edge avant/après et conservation de la Rune après diversion. La recette Chrome ajoute les commandes de Foudre et Paratonnerre à 1 440, 390 et 320 pixels.

Restent assistés : Conduction sur circuit, Décharge maîtrisée, Foudre originelle et ses enseignements, Déferlement originel, Brise-magie, Arc en chaîne, Orage aseryn, Noire-Foudre, Foudre vaporeuse et Foudre du Silence. Les effets électriques hors d’une attaque enregistrée, les dégâts de zone et les capacités narratives de PNJ n’ont pas un nouveau moteur universel. Le MJ peut toujours diriger un jet existant vers une cible avec le régime Foudre et le vecteur Électricité.

## Validation et livraison

Implémentation : `096d14632ea2c057d45868f7835102c5c0e00a32`. Validation complète sur `b817dc100d420f09bfa608e2fdce5d923e5ce30c`, [CI 37991948220](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/37991948220) : API/PostgreSQL, suites UI et PDF, parcours Chrome à 1 440/390/320 pixels, Compose. Les logs confirment les tests LIGHTNING PURE, API et DOM et la diversion personnelle à chaque largeur. La base PostgreSQL temporaire des tests utilise le miroir officiel ECR après deux refus de téléchargement pour quota Docker Hub.

Publié sur `feature/tuc-web-v2`. Le garde `production-active` a désactivé le déploiement sur le serveur de production. Aucun personnage, inventaire ou état de séance de production n’a été modifié par cette livraison.
