// Terra Umbra — 40 Aseryn revisions approved on 2026-09-29. Canonical IDs and prerequisites are retained.
export type AserynRevision = { number:number; cost:number; effect:string; effectDetails:string; activation:string; runtimeLore?:string; elementEffects?:Record<string,string> };
export const aserynRevisions:Record<string,AserynRevision> = {
  "aseryn_routes_communes_aserynes_vivacite_aseryne_reflexe_impossible": {
    "number": 1,
    "cost": 2,
    "effect": "Une fois par round, vous pouvez effectuer une Défense active physique sans payer son PA, même surpris. Les autres Défenses actives restent payantes ; vous devez pouvoir physiquement vous défendre.",
    "effectDetails": "Une fois par round, vous pouvez effectuer une Défense active physique sans payer son PA, même surpris. Les autres Défenses actives restent payantes ; vous devez pouvoir physiquement vous défendre.\n\nLe +1 Esquive de Réflexes défensifs reste utile si les deux talents sont possédés. Aucune seconde défense contre une même attaque. La défense gratuite n’est pas un gain de PA ajouté à la réserve.",
    "activation": "Réaction gratuite · 1/round",
    "runtimeLore": "Le réflexe aseryn devance la décision consciente et arrache une défense au danger."
  },
  "aseryn_routes_communes_aserynes_vivacite_aseryne_surcadence_nerveuse": {
    "number": 2,
    "cost": 3,
    "effect": "Une fois par scène, au début d’un round, gagnez 1 PA utilisable pour toute action, y compris offensive, sans coût d’activation. Il suit les passes normales et ne se cumule pas avec un autre gain direct de PA.",
    "effectDetails": "Une fois par scène, au début d’un round, gagnez 1 PA utilisable pour toute action, y compris offensive, sans coût d’activation. Il suit les passes normales et ne se cumule pas avec un autre gain direct de PA.\n\nLe choix se fait au début du round. Aucun renouvellement des limites par round ou par scène, dont l’attaque double d’Ambidextre. Plafond normal avec ce gain : 4 PA.",
    "activation": "Début du round · gratuit · 1/scène",
    "runtimeLore": "Le système nerveux libère une brève réserve de vitesse pour accomplir un geste décisif."
  },
  "aseryn_routes_communes_aserynes_esprit_fulgurant_pensee_parallele": {
    "number": 3,
    "cost": 1,
    "effect": "Vous pouvez assurer une surveillance active tout en menant une tâche intellectuelle ou une communication. Ignorez jusqu’à −3 de malus provenant uniquement du partage de l’attention, sans obtenir d’action ni de concentration complexe supplémentaire.",
    "effectDetails": "Vous pouvez assurer une surveillance active tout en menant une tâche intellectuelle ou une communication. Ignorez jusqu’à −3 de malus provenant uniquement du partage de l’attention, sans obtenir d’action ni de concentration complexe supplémentaire.",
    "activation": "Passif"
  },
  "aseryn_routes_communes_aserynes_perception_electromagnetique_signature_electrique": {
    "number": 4,
    "cost": 1,
    "effect": "Vous reconnaissez une signature électromagnétique déjà étudiée tant qu’elle reste suffisamment similaire.",
    "effectDetails": "SR/R Après avoir étudié une machine, un artefact alimenté ou une source énergétique, l'Aseryn peut mémoriser sa signature électromagnétique et la reconnaître ultérieurement si elle reste suffisamment similaire.\n\nPas de pistage à distance ni de localisation d’une machine éteinte par ce seul talent.",
    "activation": "Passif"
  },
  "aseryn_routes_communes_aserynes_perception_electromagnetique_perception_neuromotrice": {
    "number": 5,
    "cost": 3,
    "effect": "À 3 m maximum, si vous détectez l’activité nerveuse ou électromécanique d’une cible connue comme présente, vous défendez contre ses mouvements sans les malus dus au seul défaut de vision. Une fois par round, bénéficiez aussi de +3 à une Défense active physique contre cette cible.",
    "effectDetails": "À 3 m maximum, si vous détectez l’activité nerveuse ou électromécanique d’une cible connue comme présente, vous défendez contre ses mouvements sans les malus dus au seul défaut de vision. Une fois par round, bénéficiez aussi de +3 à une Défense active physique contre cette cible.\n\nLe blindage, le brouillage ou l’absence de signal pertinent neutralisent le bénéfice. Il ne révèle ni identité ni Nature et n’autorise pas une défense autrement impossible.",
    "activation": "Passif · bonus 1/round"
  },
  "aseryn_origines_jouables_mulien_empreinte_etincelle_psychique_reseau_mulien": {
    "number": 6,
    "cost": 3,
    "effect": "Pour 1 PA, reliez jusqu’à cinq alliés consentants et vous-même dans un rayon de 100 m autour de vous, jusqu’à la fin de la scène. Le réseau transmet les mots, images et perceptions volontairement partagés, sans lecture forcée ni action gratuite.",
    "effectDetails": "Pour 1 PA, reliez jusqu’à cinq alliés consentants et vous-même dans un rayon de 100 m autour de vous, jusqu’à la fin de la scène. Le réseau transmet les mots, images et perceptions volontairement partagés, sans lecture forcée ni action gratuite.\n\nUne barrière psychique adaptée interrompt la liaison ; les participants sortis de portée perdent le lien. Ce talent ne transmet pas les connaissances ou les compétences complètes des membres.",
    "activation": "1 PA · scène"
  },
  "aseryn_origines_jouables_hyperboreen_empreinte_corps_hyperboreen_detente_hyperboreenne": {
    "number": 7,
    "cost": 1,
    "effect": "Une fois par round, votre Déplacement peut devenir un bond sans élan couvrant votre distance normale horizontalement, ou sa moitié verticalement. Une réception praticable reste nécessaire ; le Déplacement coûte son PA normal.",
    "effectDetails": "Une fois par round, votre Déplacement peut devenir un bond sans élan couvrant votre distance normale horizontalement, ou sa moitié verticalement. Une réception praticable reste nécessaire ; le Déplacement coûte son PA normal.\n\nLa distance normale est 5 + Athlétisme mètres. Le talent ne donne ni vol ni déplacement gratuit et n’annule pas les dangers particuliers du point de réception.",
    "activation": "Déplacement · 1 PA · 1/round",
    "runtimeLore": "Le corps hyperboréen convertit son élan interne en un bond dépassant les possibilités humaines."
  },
  "aseryn_origines_jouables_hyperboreen_empreinte_corps_hyperboreen_reflexe_de_duel": {
    "number": 8,
    "cost": 2,
    "effect": "Une fois par round, après une Défense active réussie contre une attaque de mêlée, l’agresseur subit −3 à sa Défense contre votre prochaine attaque de mêlée dirigée contre lui, avant la fin du round suivant. Cette attaque reste payante et cet avantage ne se cumule pas avec lui-même.",
    "effectDetails": "Une fois par round, après une Défense active réussie contre une attaque de mêlée, l’agresseur subit −3 à sa Défense contre votre prochaine attaque de mêlée dirigée contre lui, avant la fin du round suivant. Cette attaque reste payante et cet avantage ne se cumule pas avec lui-même.",
    "activation": "1/round",
    "runtimeLore": "Une parade ou une esquive réussie dévoile immédiatement une ouverture dans la garde adverse."
  },
  "aseryn_origines_jouables_lemurian_empreinte_heritage_nymphal_dechainement_nymphal": {
    "number": 9,
    "cost": 3,
    "effect": "Pour 2 PA, une fois par scène, déchaînez votre élément : Air repousse, Eau gêne déplacements et tirs, Terre façonne le terrain et Feu embrase une zone. Seule la variante correspondant à votre Résonance héritée est disponible.",
    "effectDetails": "R — 2 PA — 1/Scène Air — Front de tempête : Cône d’environ 10 m. Chaque cible exposée oppose sa Défense physique ; en réussite elle est repoussée jusqu’à environ 5 m selon masse et terrain et peut être Renversée si approprié. Fumées, gaz, poussières et flammes ordinaires non protégés sont dispersés. Pas de dégâts automatiques. Eau — Marée suspendue : À 20 m maximum, une zone de 4 m de rayon est saturée d’eau en mouvement jusqu’à la fin de la scène. Les flammes ordinaires sont éteintes ; la traverser consomme deux fois plus de distance de mouvement et les tirs non adaptés qui la traversent subissent −3. Pas de noyade automatique ni de cumul de plusieurs exemplaires de cette gêne. Terre — Soulèvement tellurique : Sur un support minéral connecté, créer pour la scène un couvert total de quelques mètres, un fossé/obstacle, une rampe/plateforme, fermer brutalement une ouverture terrestre ou soulever une petite zone pour Renverser ses occupants. Ne détruit pas automatiquement un bâtiment et ne manipule pas une structure entière hors échelle. Feu — Brasier primordial : Zone d’environ 4 m de rayon, portée courte/moyenne. Attaque surnaturelle directe DGT 8, Incendiaire ; une Altération appropriée peut provoquer Enflammé. Pas de second effet gratuit. L’héritage lémurian s’étend aux quatre grands éléments : Air, Eau, Terre et Feu.",
    "activation": "2 PA · 1/scène",
    "elementEffects": {
      "air": "Pour 2 PA, une fois par scène, un cône de 10 m repousse jusqu’à 5 m les cibles dont la Défense physique est vaincue et peut les renverser. Il disperse fumées, gaz, poussières et flammes ordinaires exposés, sans dégâts automatiques.",
      "eau": "Pour 2 PA, une fois par scène, saturez d’eau une zone de 4 m de rayon à 20 m maximum jusqu’à la fin de la scène. Les flammes ordinaires s’éteignent, la traversée consomme deux fois plus de distance et les tirs non adaptés subissent −3, sans noyade automatique.",
      "terre": "Pour 2 PA, une fois par scène, façonnez un support minéral connecté en couvert total, obstacle, fossé, rampe ou plateforme de quelques mètres pour la scène. Vous pouvez fermer une ouverture ou soulever une petite zone pour renverser ses occupants, sans détruire automatiquement un bâtiment.",
      "feu": "Pour 2 PA, une fois par scène, frappez une zone de 4 m de rayon à courte ou moyenne portée avec DGT 8, Incendiaire. Une Altération appropriée peut provoquer Enflammé, sans second effet gratuit."
    }
  },
  "aseryn_origines_jouables_seratheen_empreinte_sang_mele_mosaique_ancestrale": {
    "number": 10,
    "cost": 3,
    "effect": "Une seconde Trace devient une Signature complète, sans bonus d’Attribut, et ouvre les talents de cette Origine. Aucun nouvel achat d’Atavisme marqué ou d’Héritage éveillé n’est exigé pour cette seconde lignée.",
    "effectDetails": "Une seconde Trace devient une Signature complète, sans bonus d’Attribut, et ouvre les talents de cette Origine. Aucun nouvel achat d’Atavisme marqué ou d’Héritage éveillé n’est exigé pour cette seconde lignée.\n\nLes talents de la nouvelle Origine restent à acheter. Les deux Signatures ne doublent pas un même bonus équivalent.",
    "activation": "Passif",
    "runtimeLore": "Deux héritages peuvent pleinement s’exprimer dans une même ascendance sans fusionner leurs origines."
  },
  "aseryn_traditions_des_treize_athegos_le_seigneur_prendre_la_tete": {
    "number": 11,
    "cost": 2,
    "effect": "Une fois par scène, dans une passe où vous agissez, jusqu’à deux alliés qui n’ont pas encore agi peuvent agir immédiatement après vous, même si des adversaires auraient dû agir avant eux. Chacun dépense son PA et perd son ancien emplacement dans cette passe.",
    "effectDetails": "Une fois par scène, dans une passe où vous agissez, jusqu’à deux alliés qui n’ont pas encore agi peuvent agir immédiatement après vous, même si des adversaires auraient dû agir avant eux. Chacun dépense son PA et perd son ancien emplacement dans cette passe.\n\nLes alliés doivent pouvoir recevoir l’ordre et disposer d’une action dans cette passe. Aucune action supplémentaire ni transfert entre passes.",
    "activation": "1/scène",
    "runtimeLore": "Le commandement impose aux alliés un tempo commun avant que l’adversaire ne reprenne l’initiative."
  },
  "aseryn_traditions_des_treize_sundosia_l_aventuriere_improvisation_d_aventurier": {
    "number": 12,
    "cost": 2,
    "effect": "L’annulation de jusqu’à −3 de malus dus au détournement crédible d’un objet, véhicule ou élément du décor devient passive. Elle peut s’appliquer à un usage offensif réalisable, mais ne crée ni outil absent, ni arme supérieure, ni dégâts supplémentaires.",
    "effectDetails": "L’annulation de jusqu’à −3 de malus dus au détournement crédible d’un objet, véhicule ou élément du décor devient passive. Elle peut s’appliquer à un usage offensif réalisable, mais ne crée ni outil absent, ni arme supérieure, ni dégâts supplémentaires.",
    "activation": "Passif"
  },
  "aseryn_traditions_des_treize_sundosia_l_aventuriere_s_adapter_ou_mourir": {
    "number": 13,
    "cost": 3,
    "effect": "Une fois par scène, après un échec non narratif dû à une situation ou un environnement nouveau, identifiez la difficulté apprise. Jusqu’à la fin de la scène, les actions directement confrontées à cette même difficulté bénéficient d’une réduction d’un niveau de Difficulté.",
    "effectDetails": "Une fois par scène, après un échec non narratif dû à une situation ou un environnement nouveau, identifiez la difficulté apprise. Jusqu’à la fin de la scène, les actions directement confrontées à cette même difficulté bénéficient d’une réduction d’un niveau de Difficulté.\n\nL’échec initial reste acquis. Ce n’est pas une réduction de tous les jets dans un nouveau lieu et les réductions génériques équivalentes ne s’empilent pas.",
    "activation": "1/scène"
  },
  "aseryn_traditions_des_treize_cairiah_l_architecte_il_de_structure": {
    "number": 14,
    "cost": 1,
    "effect": "Après examen, vous identifiez les supports, fragilités et possibilités de consolidation d’une structure, avec +3 pour les défauts cachés. Une fois par scène, exploiter une faiblesse identifiée donne +3 au premier test pour forcer, saboter ou consolider cette structure.",
    "effectDetails": "Après examen, vous identifiez les supports, fragilités et possibilités de consolidation d’une structure, avec +3 pour les défauts cachés. Une fois par scène, exploiter une faiblesse identifiée donne +3 au premier test pour forcer, saboter ou consolider cette structure.\n\nUne observation ou un examen réellement possible reste requis. Les deux bonus ne s’additionnent pas sur le même test et aucun effondrement n’est garanti sans moyens matériels adaptés.",
    "activation": "Passif · exploitation 1/scène"
  },
  "aseryn_traditions_des_treize_cairiah_l_architecte_fortification": {
    "number": 15,
    "cost": 2,
    "effect": "Après quelques minutes de travail avec les matériaux et outils nécessaires, vos barricades et couverts aménagés offrent +6 Défense au lieu de +3 contre les directions réellement protégées. Ce bonus remplace celui du couvert partiel et ne s’y ajoute pas.",
    "effectDetails": "Après quelques minutes de travail avec les matériaux et outils nécessaires, vos barricades et couverts aménagés offrent +6 Défense au lieu de +3 contre les directions réellement protégées. Ce bonus remplace celui du couvert partiel et ne s’y ajoute pas.\n\nPas de construction instantanée ni de matériau créé. Le couvert reste physique, contournable et destructible ; il ne devient pas un couvert total.",
    "activation": "Quelques minutes de préparation"
  },
  "aseryn_traditions_des_treize_cairiah_l_architecte_position_maitresse": {
    "number": 16,
    "cost": 3,
    "effect": "Après trente minutes de préparation, jusqu’à trois ouvrages bénéficient de Fortification et jusqu’à trois défenseurs briefés gagnent +3 à leur première Défense active de chaque round lorsqu’ils défendent cette position. Une seule position bénéficie à la fois de cette coordination.",
    "effectDetails": "Après trente minutes de préparation, jusqu’à trois ouvrages bénéficient de Fortification et jusqu’à trois défenseurs briefés gagnent +3 à leur première Défense active de chaque round lorsqu’ils défendent cette position. Une seule position bénéficie à la fois de cette coordination.\n\nLes ouvrages ordinaires ne disparaissent pas lors d’un changement de position. Le bonus de coordination cesse hors de la position et ne se cumule pas avec une autre circonstance défensive équivalente ; les PA des Défenses actives restent dus.",
    "activation": "30 minutes de préparation"
  },
  "aseryn_traditions_des_treize_eydreas_le_chercheur_reprendre_le_raisonnement": {
    "number": 17,
    "cost": 2,
    "effect": "Une fois par scène, après un test réussi d’analyse, d’enquête ou de diagnostic intellectuel, comptez un DR supplémentaire pour la précision des conclusions, jusqu’à DR 5. Cela ne fournit aucune preuve absente et n’augmente ni dégâts ni PV soignés.",
    "effectDetails": "Une fois par scène, après un test réussi d’analyse, d’enquête ou de diagnostic intellectuel, comptez un DR supplémentaire pour la précision des conclusions, jusqu’à DR 5. Cela ne fournit aucune preuve absente et n’augmente ni dégâts ni PV soignés.",
    "activation": "1/scène",
    "runtimeLore": "Eydreas pousse une conclusion juste jusqu’au détail qui lui donne toute sa valeur."
  },
  "aseryn_traditions_des_treize_eydreas_le_chercheur_detruire_la_fausse_certitude": {
    "number": 18,
    "cost": 2,
    "effect": "Une fois par scène, à partir des indices disponibles, le MJ indique une vérification concrète permettant de départager deux explications, lorsqu’une telle vérification existe. Ceux qui exécutent ce protocole bénéficient de +3 aux tests directement nécessaires à cette vérification.",
    "effectDetails": "Une fois par scène, à partir des indices disponibles, le MJ indique une vérification concrète permettant de départager deux explications, lorsqu’une telle vérification existe. Ceux qui exécutent ce protocole bénéficient de +3 aux tests directement nécessaires à cette vérification.\n\nPas de preuve créée ni de résultat révélé à l’avance. Un seul protocole préparé actif ; le même test ne reçoit pas plusieurs fois ce bonus.",
    "activation": "1/scène",
    "runtimeLore": "Le doute devient un protocole précis pour confronter deux explications aux faits."
  },
  "aseryn_traditions_des_treize_natyel_le_nourricier_lire_la_terre": {
    "number": 19,
    "cost": 1,
    "effect": "Après quelques minutes d’examen du milieu naturel, vous repérez ses ressources et gagnez +3 pour trouver une ressource difficile ou en vérifier la salubrité. Une eau ou un aliment courant manifestement impropre est reconnu sans test après examen.",
    "effectDetails": "Après quelques minutes d’examen du milieu naturel, vous repérez ses ressources et gagnez +3 pour trouver une ressource difficile ou en vérifier la salubrité. Une eau ou un aliment courant manifestement impropre est reconnu sans test après examen.\n\nPas de révélation automatique d’une substance surnaturelle inconnue ni de nourriture créée.",
    "activation": "Quelques minutes d’examen"
  },
  "aseryn_traditions_des_treize_natyel_le_nourricier_la_famille_ne_manque_de_rien": {
    "number": 20,
    "cost": 2,
    "effect": "Une fois par scénario, révélez une préparation antérieure crédible assurant nourriture, eau et abri simple à cinq personnes pendant trois jours. Les lieux, réserves et moyens doivent avoir pu être préparés ; aucun argent ni équipement rare n’est créé.",
    "effectDetails": "Une fois par scénario, révélez une préparation antérieure crédible assurant nourriture, eau et abri simple à cinq personnes pendant trois jours. Les lieux, réserves et moyens doivent avoir pu être préparés ; aucun argent ni équipement rare n’est créé.\n\nUne vraie rupture de ravitaillement est visée, pas un revenu supplémentaire. Ce talent ne donne pas de munitions spéciales, de véhicule ni de ressource occulte.",
    "activation": "1/scénario"
  },
  "aseryn_traditions_des_treize_erith_la_sentinelle_alerte_fulgurante": {
    "number": 21,
    "cost": 2,
    "effect": "Une fois par scène, pour 1 PA en Réaction, votre avertissement immédiat permet à jusqu’à trois alliés de ne pas être Surpris par le danger que vous venez de détecter. Ils doivent pouvoir recevoir l’alerte et ne gagnent aucun PA.",
    "effectDetails": "Une fois par scène, pour 1 PA en Réaction, votre avertissement immédiat permet à jusqu’à trois alliés de ne pas être Surpris par le danger que vous venez de détecter. Ils doivent pouvoir recevoir l’alerte et ne gagnent aucun PA.",
    "activation": "Réaction · 1 PA · 1/scène"
  },
  "aseryn_traditions_des_treize_lisirast_l_archiviste_index_vivant": {
    "number": 22,
    "cost": 2,
    "effect": "Lorsque vous comparez vos archives mémorisées à un document, une scène ou un témoignage réellement disponible, vous repérez les différences factuelles accessibles à cette comparaison. Les tests pour en tirer des liens ou des conclusions bénéficient de +3.",
    "effectDetails": "Lorsque vous comparez vos archives mémorisées à un document, une scène ou un témoignage réellement disponible, vous repérez les différences factuelles accessibles à cette comparaison. Les tests pour en tirer des liens ou des conclusions bénéficient de +3.\n\nAucun document absent n’est créé et les ressemblances ne prouvent pas automatiquement l’identité d’une personne.",
    "activation": "Passif",
    "runtimeLore": "Les archives deviennent un outil de comparaison plutôt qu’un simple réservoir de souvenirs."
  },
  "aseryn_traditions_des_treize_lisirast_l_archiviste_chambre_scellee": {
    "number": 23,
    "cost": 2,
    "effect": "Un secret majeur compartimenté reste inaccessible à une lecture mentale superficielle, même si une question le remet à l’esprit. Une fouille ciblée ou une altération de ce secret rencontre +3 à votre Défense occulte ; un seul secret est protégé à la fois.",
    "effectDetails": "Un secret majeur compartimenté reste inaccessible à une lecture mentale superficielle, même si une question le remet à l’esprit. Une fouille ciblée ou une altération de ce secret rencontre +3 à votre Défense occulte ; un seul secret est protégé à la fois.\n\nLe +3 ne se cumule pas avec une résistance mentale substantiellement équivalente. L’inconscience n’ouvre pas le compartiment ; une lecture profonde réussie peut le franchir.",
    "activation": "Passif"
  },
  "aseryn_traditions_des_treize_lisithas_le_juge_contradiction": {
    "number": 24,
    "cost": 1,
    "effect": "Vous repérez les contradictions entre les déclarations entendues et les faits personnellement établis. Une fois par scène, mettre explicitement une contradiction en évidence donne +3 au test social qui s’appuie directement dessus.",
    "effectDetails": "Vous repérez les contradictions entre les déclarations entendues et les faits personnellement établis. Une fois par scène, mettre explicitement une contradiction en évidence donne +3 au test social qui s’appuie directement dessus.\n\nCe n’est pas une détection de mensonge : un interlocuteur peut être sincère et se tromper. Aucun fait extérieur non connu n’est automatiquement révélé.",
    "activation": "Passif · bonus 1/scène"
  },
  "aseryn_traditions_des_treize_lisithas_le_juge_arbitrage": {
    "number": 25,
    "cost": 1,
    "effect": "Une fois par scène, lorsque les parties acceptent votre arbitrage, identifiez le désaccord et les concessions possibles d’après les faits exposés. Vous gagnez +3 au test de Diplomatie visant à conclure ce compromis.",
    "effectDetails": "Une fois par scène, lorsque les parties acceptent votre arbitrage, identifiez le désaccord et les concessions possibles d’après les faits exposés. Vous gagnez +3 au test de Diplomatie visant à conclure ce compromis.\n\nCe bonus ne force ni obéissance ni engagement surnaturel.",
    "activation": "1/scène"
  },
  "aseryn_traditions_des_treize_lisithas_le_juge_autorite_du_jugement": {
    "number": 26,
    "cost": 3,
    "effect": "Une fois par scène, après avoir exposé un fait ou raisonnement pertinent, dépensez 1 PA et opposez Esprit + Diplomatie à Volonté + Force Mentale de jusqu’à trois interlocuteurs. Ceux contre lesquels vous réussissez suspendent l’escalade violente jusqu’au début du round suivant, tant que votre camp respecte la même trêve.",
    "effectDetails": "Une fois par scène, après avoir exposé un fait ou raisonnement pertinent, dépensez 1 PA et opposez Esprit + Diplomatie à Volonté + Force Mentale de jusqu’à trois interlocuteurs. Ceux contre lesquels vous réussissez suspendent l’escalade violente jusqu’au début du round suivant, tant que votre camp respecte la même trêve.\n\nCible des êtres capables de comprendre le raisonnement, pas une machine ni une créature sans compréhension pertinente. Ce n’est pas une domination : ils restent libres de se retirer ou de se protéger et ne cèdent aucun autre intérêt.",
    "activation": "1 PA · 1/scène",
    "runtimeLore": "Le jugement interrompt l’escalade et ouvre un instant de parole au cœur du conflit."
  },
  "aseryn_traditions_des_treize_selerias_l_aimante_je_te_connais": {
    "number": 27,
    "cost": 2,
    "effect": "Pour 1 PA en Réaction, une fois par round, apportez une Assistance +3 à la résistance d’un proche contre une peur ou une manipulation affective. Le lien et une communication réelle restent indispensables ; une seule Assistance s’applique.",
    "effectDetails": "Pour 1 PA en Réaction, une fois par round, apportez une Assistance +3 à la résistance d’un proche contre une peur ou une manipulation affective. Le lien et une communication réelle restent indispensables ; une seule Assistance s’applique.",
    "activation": "Réaction · 1 PA · 1/round"
  },
  "aseryn_traditions_des_treize_selerias_l_aimante_la_famille_tient": {
    "number": 28,
    "cost": 3,
    "effect": "Une fois par scène, pour 1 PA, réduisez d’un cran le Stress psychologique de jusqu’à trois proches capables de recevoir votre soutien, même pendant le combat. Les minima imposés par les blessures et les effets surnaturels toujours actifs demeurent applicables.",
    "effectDetails": "Une fois par scène, pour 1 PA, réduisez d’un cran le Stress psychologique de jusqu’à trois proches capables de recevoir votre soutien, même pendant le combat. Les minima imposés par les blessures et les effets surnaturels toujours actifs demeurent applicables.\n\nPaniqué devient Tendu et Tendu devient Normal ; ce n’est ni un soin ni une dissipation. Chaque proche doit être réellement lié au personnage.",
    "activation": "1 PA · 1/scène",
    "runtimeLore": "Un lien personnel maintient le groupe uni lorsque la peur menace de le disperser."
  },
  "aseryn_dratyn_la_maitresse_de_la_foudre_talents_communs_de_dratyn_paratonnerre": {
    "number": 29,
    "cost": 2,
    "effect": "Une fois par round, pour 1 PA en Réaction, opposez votre Jet de Foudre à une décharge électrique visant vous-même ou un allié situé à 5 m maximum. En réussite, détournez-la vers un conducteur ou une zone sûre accessible, sans la renvoyer gratuitement sur un adversaire.",
    "effectDetails": "Une fois par round, pour 1 PA en Réaction, opposez votre Jet de Foudre à une décharge électrique visant vous-même ou un allié situé à 5 m maximum. En réussite, détournez-la vers un conducteur ou une zone sûre accessible, sans la renvoyer gratuitement sur un adversaire.\n\nL’intervention est annoncée avant résolution ; on ne relance pas rétroactivement une défense déjà ratée. Une zone ne perd que l’exposition de la cible effectivement protégée, pas tous ses effets sur les autres.",
    "activation": "Réaction · 1 PA · 1/round"
  },
  "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_esprit_noire_foudre_atteindre_l_immateriel": {
    "number": 30,
    "cost": 2,
    "effect": "La Noire-Foudre peut traverser les obstacles purement matériels, même un couvert total, pour atteindre une cible immatérielle réellement perçue à portée normale. Les protections spirituelles ou spécialement adaptées restent applicables.",
    "effectDetails": "La Noire-Foudre peut traverser les obstacles purement matériels, même un couvert total, pour atteindre une cible immatérielle réellement perçue à portée normale. Les protections spirituelles ou spécialement adaptées restent applicables.\n\nPas de tir aveugle, de nouvelle détection ni d’allongement automatique des 20 m de portée.",
    "activation": "Passif"
  },
  "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_esprit_noire_foudre_eclipse_noire": {
    "number": 31,
    "cost": 3,
    "effect": "Pour 2 PA, une fois par scène, ciblez jusqu’à trois créatures immatérielles ou effets métaphysiques temporaires réellement perçus à portée. Un même Jet de Foudre est comparé à chaque Défense ou Puissance : les créatures subissent DGT 9 et les effets temporaires vaincus sont dissipés.",
    "effectDetails": "Pour 2 PA, une fois par scène, ciblez jusqu’à trois créatures immatérielles ou effets métaphysiques temporaires réellement perçus à portée. Un même Jet de Foudre est comparé à chaque Défense ou Puissance : les créatures subissent DGT 9 et les effets temporaires vaincus sont dissipés.\n\nChaque cible occupe un emplacement. Aucun cumul de dégâts et de suppression de l’existence sur une créature : elle conserve ses PV. Les protections spirituelles pertinentes s’appliquent ; les composantes d’un être incarné doivent être effectivement exposées selon Fulguration spirituelle.",
    "activation": "2 PA · 1/scène",
    "runtimeLore": "La Noire-Foudre se divise entre plusieurs présences spirituelles ou effets métaphysiques."
  },
  "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_erosion_foudre_vaporeuse_foudre_vaporeuse": {
    "number": 32,
    "cost": 1,
    "effect": "En sacrifiant 2 points de dégâts d’un coup réussi avant réduction, diminuez de 2, sans passer sous 0, une Armure ou Protection matérielle directement touchée jusqu’à la fin de la scène. Une même couche ne subit cet effet qu’une fois ; Ruine des protections remplace −2 par −3, sans addition.",
    "effectDetails": "En sacrifiant 2 points de dégâts d’un coup réussi avant réduction, diminuez de 2, sans passer sous 0, une Armure ou Protection matérielle directement touchée jusqu’à la fin de la scène. Une même couche ne subit cet effet qu’une fois ; Ruine des protections remplace −2 par −3, sans addition.\n\nRuine conserve l’ouverture aux protections surnaturelles immatérielles. L’armure attaquée peut être érodée même si elle ne protégeait pas de la Foudre : l’intérêt peut être d’aider les autres attaquants.",
    "activation": "Sur une attaque réussie"
  },
  "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_erosion_foudre_vaporeuse_eroder_l_affliction": {
    "number": 33,
    "cost": 2,
    "effect": "Pour 1 PA, un Jet de Foudre réussi contre une affliction occulte active atténue ses effets pour la scène : malus réduit de 3 et difficulté de résistance abaissée d’un niveau lorsqu’ils existent. Cela ne retire aucun point de Corruption et ne supprime ni Nature ni lien fondamental.",
    "effectDetails": "Pour 1 PA, un Jet de Foudre réussi contre une affliction occulte active atténue ses effets pour la scène : malus réduit de 3 et difficulté de résistance abaissée d’un niveau lorsqu’ils existent. Cela ne retire aucun point de Corruption et ne supprime ni Nature ni lien fondamental.\n\nLa jauge de Corruption reste inchangée.\n\nJet de Foudre contre le résultat d’origine de l’affliction, ou contre 15 / 18 / 21 / 25 selon sa puissance. L’effet n’est pas nécessairement guéri.",
    "activation": "1 PA"
  },
  "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_erosion_foudre_vaporeuse_reduire_en_poussiere": {
    "number": 34,
    "cost": 3,
    "effect": "Après un Jet de Foudre réussi contre la Puissance d’un effet occulte actif, une fois par scène, détruisez cet effet s’il est temporaire ou suspendez-le pour la scène s’il est durable et interruptible. Une créature dotée de PV, sa Nature et les liens fondamentaux ne sont pas des effets supprimables de cette manière.",
    "effectDetails": "Après un Jet de Foudre réussi contre la Puissance d’un effet occulte actif, une fois par scène, détruisez cet effet s’il est temporaire ou suspendez-le pour la scène s’il est durable et interruptible. Une créature dotée de PV, sa Nature et les liens fondamentaux ne sont pas des effets supprimables de cette manière.\n\nAucune réussite gratuite : le jet et son coût normal doivent être résolus. Ne modifie pas la jauge de Corruption.\n\nLes effets primordiaux ou explicitement indestructibles restent hors de portée.",
    "activation": "Après un Jet de Foudre · 1/scène"
  },
  "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_fin_foudre_du_silence_trait_du_silence": {
    "number": 35,
    "cost": 2,
    "effect": "Pour 1 PA, une fois par scène, projetez un Trait du Silence de DGT 9 divisant par deux la Protection électrique applicable, arrondie à l’inférieur. La précision permet d’atteindre un composant lorsque la marge et la situation l’autorisent, jamais d’effacer automatiquement un organe.",
    "effectDetails": "Pour 1 PA, une fois par scène, projetez un Trait du Silence de DGT 9 divisant par deux la Protection électrique applicable, arrondie à l’inférieur. La précision permet d’atteindre un composant lorsque la marge et la situation l’autorisent, jamais d’effacer automatiquement un organe.",
    "activation": "1 PA · 1/scène"
  },
  "aseryn_conseil_de_la_foudre_voie_des_ancetres_memoire_empruntee": {
    "number": 36,
    "cost": 2,
    "effect": "Après communion avec un Ancêtre compétent, choisissez une Compétence correspondant à son expérience et bénéficiez de +3 à ses tests jusqu’à la fin de la scène. Aucun pouvoir, prérequis biologique ou savoir secret absent de cet Ancêtre n’est obtenu.",
    "effectDetails": "Après communion avec un Ancêtre compétent, choisissez une Compétence correspondant à son expérience et bénéficiez de +3 à ses tests jusqu’à la fin de la scène. Aucun pouvoir, prérequis biologique ou savoir secret absent de cet Ancêtre n’est obtenu.\n\nUne compétence et une communion préparée actives à la fois. Pas d’empilement avec un bonus équivalent de l’Ancêtre.\n\nUne communion par scène.",
    "activation": "Communion · 1/scène",
    "runtimeLore": "Une communion préparée laisse l’expérience du mort accompagner une discipline pendant toute la scène."
  },
  "aseryn_conseil_de_la_foudre_voie_des_ancetres_conseil_des_morts": {
    "number": 37,
    "cost": 3,
    "effect": "Une fois par scénario, plusieurs Ancêtres réellement consultés aident à préparer une opération précise. Jusqu’à cinq participants briefés peuvent chacun relancer un échec non narratif directement lié à ce plan pendant sa scène d’exécution, en conservant le second résultat.",
    "effectDetails": "Une fois par scénario, plusieurs Ancêtres réellement consultés aident à préparer une opération précise. Jusqu’à cinq participants briefés peuvent chacun relancer un échec non narratif directement lié à ce plan pendant sa scène d’exécution, en conservant le second résultat.\n\nUne seule relance de talent par test. Le plan est fixé avant l’action : aucune prévision omnisciente ni possibilité de le redéfinir après l’échec pour englober n’importe quel jet.",
    "activation": "Préparation rituelle · 1/scénario",
    "runtimeLore": "Les Ancêtres confrontent leurs expériences pour préparer les vivants à une opération précise."
  },
  "aseryn_conseil_de_la_foudre_voie_du_vaisseau_main_de_l_ancetre": {
    "number": 38,
    "cost": 2,
    "effect": "Pendant une possession coopérative, une fois par round, l’Ancêtre apporte +3 à une action relevant de son expertise. À Compétence 0, son guidage permet une action de connaissance, de procédure ou de coordination, sans prêter de capacité physique absente.",
    "effectDetails": "Pendant une possession coopérative, une fois par round, l’Ancêtre apporte +3 à une action relevant de son expertise. À Compétence 0, son guidage permet une action de connaissance, de procédure ou de coordination, sans prêter de capacité physique absente.\n\nLe PA de l’action reste dû ; aucun tour d’Ancêtre indépendant. Pas de deuxième +3 équivalent sur le même test.",
    "activation": "Possession coopérative · 1/round",
    "runtimeLore": "Le mort guide le geste qu’il connaît sans donner au corps une seconde réserve d’actions."
  },
  "aseryn_conseil_de_la_foudre_voie_du_vaisseau_laisser_la_place": {
    "number": 39,
    "cost": 3,
    "effect": "Une fois par scène, laissez un Ancêtre consentant piloter le corps jusqu’à la fin de la scène : pour ses expertises, utilisez le meilleur de votre rang et du sien, le rang emprunté étant plafonné à 6. Vos Attributs, PV, PA, Talents et limites physiques restent les vôtres ; vous pouvez reprendre le contrôle.",
    "effectDetails": "Une fois par scène, laissez un Ancêtre consentant piloter le corps jusqu’à la fin de la scène : pour ses expertises, utilisez le meilleur de votre rang et du sien, le rang emprunté étant plafonné à 6. Vos Attributs, PV, PA, Talents et limites physiques restent les vôtres ; vous pouvez reprendre le contrôle.\n\nL’Ancêtre doit avoir un profil fixé avec le MJ avant emploi. Aucun Talent surnaturel ni ressource propre de l’Ancêtre n’est prêté. Pour un test utilisant son rang emprunté, Main de l’Ancêtre et Mémoire empruntée ne rajoutent pas +3 : l’emprunt remplace leur guidage. Le rang emprunté est plafonné à 6.",
    "activation": "Possession coopérative · 1/scène",
    "runtimeLore": "L’Ancêtre prête son expertise au corps vivant sans lui imposer une autre Nature."
  },
  "aseryn_conseil_de_la_foudre_voie_du_gardien_de_la_grotte_fermer_la_porte": {
    "number": 40,
    "cost": 2,
    "effect": "Une fois par round, pour 1 PA en Réaction, accordez Assistance +3 à la résistance d’une créature à 10 m contre une possession ou une intrusion spirituelle. Si vous êtes la cible, appliquez directement +3 à votre résistance ; le PA dépensé est celui de votre Défense active, pas un second PA.",
    "effectDetails": "Une fois par round, pour 1 PA en Réaction, accordez Assistance +3 à la résistance d’une créature à 10 m contre une possession ou une intrusion spirituelle. Si vous êtes la cible, appliquez directement +3 à votre résistance ; le PA dépensé est celui de votre Défense active, pas un second PA.\n\nUne seule Assistance et pas de cumul avec une protection substantiellement équivalente. L’effet doit pouvoir être perçu ; il ne dissipe pas une possession déjà établie, rôle d’Expulsion rituelle.",
    "activation": "Réaction · 1 PA · 1/round"
  }
};
export function applyAserynRevisions<T extends {id:string;cost:number;effect:string}>(catalog:readonly T[]):Array<T & Partial<AserynRevision>> {
  return catalog.map(talent => {
    const revision=aserynRevisions[talent.id];
    return revision ? {...talent,...revision} : talent;
  });
}
