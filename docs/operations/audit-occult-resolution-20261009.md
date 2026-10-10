# Résolutions occultes en partie — 9 octobre 2026

Cette passe relie les libérations déjà payées à de vraies mutations de PV et d’effets sur les cibles. Elle ne transforme pas chaque description du catalogue en algorithme.

## Parcours exécutables

| Parcours | Exécution | Arbitrage conservé |
| --- | --- | --- |
| Sort Mage / Spectre de Méphisto offensif | Un jet de lancement conservé ; défense individuelle ; dégâts = marge + bonus d’Amplitude 6/12/18/24 − protection ; aucun palier de Tir. | Fonction annoncée, cibles et étendue compatibles avec l’Affinité, protection réellement applicable. |
| Soin externe | PV effectivement rendus, plafond de soin réel, refus de résurrection et de destruction finale ; blessures de Trace du Néant effectivement soignées débloquées. | Un effet de soin réellement justifié et sa quantité, sans inventer un barème universel. |
| Modificateur ou condition libre | Une fonction principale, provenance, portée mécanique et durée finie ; les modificateurs alimentent les profils existants. | Justification du bonus/malus et de sa durée par le sort ou pouvoir utilisé. |
| Maintien Mage | 1 PA par round ultérieur ; durée prolongée ; une seule dépense par round ; retrait de tous les effets liés sur les cibles lorsque la concentration cesse, le lanceur devient incapable ou disparaît de la campagne. | Déterminer si le phénomène exige réellement un flux continu. |

Les coûts, quotas, prérequis, Aura, préparation, Tension et Revers restent ceux de l’activation existante. La résolution ne les paie pas une seconde fois. Un jet séparé de pouvoir doit provenir du même personnage, de la compétence prescrite et d’un événement postérieur à la libération. Un jet déjà résolu ne sert pas à une deuxième activation.

## Quatre conditions de catalogue

| Identifiant | Règle reliée |
| --- | --- |
| `belial_la_reine_des_dieux_facette_domination_injonction_souveraine` | Autorité contre Défense occulte ; ordre simple conservé comme condition jusqu’à la prochaine activation. Exécution de l’ordre à la table. |
| `belial_la_reine_des_dieux_facette_domination_decret_royal` | Interdit jusqu’à la fin de scène ; tentative réelle de violation donnant une nouvelle Défense occulte active gratuite ; succès retirant le Décret. |
| `belial_la_reine_des_dieux_facette_domination_souverainete_de_belial` | Une même injonction, un jet source, défense par cible ; chaque cible annoncée à 15 m maximum et conditions d’audition/compréhension confirmées. |
| `daemon_clean_oracle_tentateur_fantasmagorie_fantasmagorie` | Maîtrise spirituelle contre Défense occulte ; perception mentale décrite comme condition ; durée finie explicitement fixée par le MJ car le texte ne donne pas de durée universelle. |

Ces conditions n’automatisent ni les décisions de la victime, ni un acte suicidaire, ni le contenu d’une illusion. Elles permettent de jouer et suivre l’effet sans perdre son texte ou sa résistance.

## Autorité et confidentialité

- Seul le MJ de la campagne arbitre les conséquences. Le propriétaire peut choisir sa défense, consentir à un effet allié ou interrompre son propre maintien.
- Un soutien à un autre PJ exige un accord de son propriétaire. L’offre privée contient son personnage et la description proposée ; l’accord référence l’offre effectivement affichée et la même description doit être utilisée à la résolution.
- Les autres joueurs ne reçoivent ni les jets source privés, ni les PV ou paramètres de leurs voisins.
- Les défenses actives ordinaires coûtent 1 PA sous pression ; elles respectent les réserves physiques et l’impulsion de Frénésie. La résistance à une violation du Décret reste gratuite. Une réaction ne consomme pas une passe d’action ordinaire.
- Requêtes rejouées strictement identiques : aucune deuxième mutation. Une cible modifiée impose une nouvelle lecture de sa version.

## Rounds et séances

L’intention `hostile` annoncée pendant la préparation Mage/Spectre est conservée dans la libération. Une libération hostile réussie, les quatre conditions ciblées ci-dessus ou une offre de défense MJ suspendent le passage automatique tant que la conséquence reste à résoudre. Les préparations, soutiens et sorts narratifs ne bloquent pas un round à eux seuls.

Le MJ ou le lanceur peut classer une libération sans conséquence. Les PA déjà investis ne sont pas remboursés. Après résolution ou classement, le passage automatique reprend s’il n’y a plus de PA ni d’autre attaque en attente. L’initiative n’est pas recalculée.

Un véritable effet maintenu reste accessible si une séance suivante commence sans interrompre la scène. Son interruption retire ses effets malgré l’archivage du jet source. Les libérations non résolues et offres nouvelles restent limitées à la séance et à la scène courantes.

## Vérification

`check-occult-resolutions.mjs` couvre les calculs purs et des appels API avec une base isolée : autorité, source payée, échec/narration, protections, verrou optimiste, rejeu, consentement privé, soin/plafond/mort, défense active, Frénésie, maintien, Décret gratuit, pause des rounds automatiques, classement et continuité entre séances.

`occult-consent-dom.mjs` vérifie le panneau vide masqué, l’offre privée, le même identifiant lors d’une reprise réseau, la défense active et ses PA, la tentative de violation et l’échec d’actualisation privée. Ces contrôles locaux ont réussi ; la validation de publication relève du lot complet.

## Limites explicites

Le polymorphisme, transfert d’âme, prophétie, comportement d’une construction, récupération d’information, domination narrative et conséquences permanentes demandent toujours l’interprétation de leur texte à la table. Les effets libres sont des arbitrages enregistrés, pas des talents supplémentaires prétendument automatiques.

Ce parcours prend comme sources les libérations et activations des personnages, dont les jets et dépenses sont déjà protégés par le serveur. Les pouvoirs occultes libres d’un PNJ sans cette préparation structurée restent dans les outils d’effets et de jets assistés du MJ ; aucune compétence ou dépense manquante n’est fabriquée depuis sa prose.

## Edge avant et après le jet

Les libérations Mage/Spectre, les défenses actives de ce parcours et la résistance au Décret proposent Edge avant le jet, puis après tant que sa fenêtre reste ouverte. Un Edge remplace la contribution du dé par 20, sans recalculer le bonus déjà utilisé ni payer de PA supplémentaire. Une défense passive et un autosuccès n’ont aucun dé à forcer. Une préparation invalide ou un solde insuffisant ne persiste aucune mutation ; les requêtes identiques rejouées ne dépensent rien une seconde fois.

Après une libération, total, échec narratif et réussite intrinsèque sont recalculés. La Tension, l’alternance d’Affinité et les Revers dépendent de la préparation : ils restent dus, indépendamment du dé. La Volonté supérieure n’offre pas de réparation après sa catastrophe inévitable. La fenêtre exige la même version de jeu, séance, scène, combat et round ; une action suivante, une proposition à la cible, une opposition, un classement ou une résolution la ferme. Le bouton privé ne s’affiche plus quand cette fenêtre est fermée.

Après une défense, la source doit être encore non résolue et la version du défenseur intacte. Après une résistance échouée au Décret, seule la condition exacte encore active peut être retirée si le nouveau total atteint l’opposition d’origine ; une résistance suivante ferme l’ancien résultat. Un Décret peut rester actif entre séances, mais un résultat d’une séance clôturée ne peut plus être modifié. Les résultats et les boutons Edge restent privés au propriétaire ; le MJ conserve son accès aux sources, résultats et paramètres complets des fiches.
