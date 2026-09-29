// Daemon revisions approved by the authors, 29 September 2026. Base catalogue and other Natures are preserved.
export const daemonRevisions:Record<string,{number:number;cost:number;access:string;activation:string;effect:string;effectDetails:string}> = {
  "alabor_les_eaux_primordiales_facette_flots_etreinte_liquide": {
    "number": 2,
    "cost": 2,
    "access": "R",
    "activation": "1 PA · 20 m · scène",
    "effect": "Pour 1 PA, emprisonnez pour la scène une cible dans une masse d’eau suffisante à 20 m maximum, après un Jet divin contre sa Défense physique. Se libérer coûte 1 PA et demande Vigueur + Athlétisme contre le résultat initial ; aucune noyade automatique.",
    "effectDetails": "Pour 1 PA, emprisonnez pour la scène une cible dans une masse d’eau suffisante à 20 m maximum, après un Jet divin contre sa Défense physique. Se libérer coûte 1 PA et demande Vigueur + Athlétisme contre le résultat initial ; aucune noyade automatique."
  },
  "alabor_les_eaux_primordiales_facette_flots_deferlante": {
    "number": 3,
    "cost": 3,
    "access": "R",
    "activation": "3 PA · 1/scène · rayon 5 m à 20 m",
    "effect": "Pour 3 PA, une fois par scène, projetez l’eau disponible sur une zone de 5 m de rayon à 20 m maximum : un Jet divin contre chaque Défense physique, DGT 12 et recul jusqu’à 3 m si le terrain le permet. Les dégâts ne surviennent qu’une fois ; les débris et l’eau déplacés restent réels.",
    "effectDetails": "Pour 3 PA, une fois par scène, projetez l’eau disponible sur une zone de 5 m de rayon à 20 m maximum : un Jet divin contre chaque Défense physique, DGT 12 et recul jusqu’à 3 m si le terrain le permet. Les dégâts ne surviennent qu’une fois ; les débris et l’eau déplacés restent réels."
  },
  "alabor_les_eaux_primordiales_facette_pression_fond_des_oceans": {
    "number": 6,
    "cost": 3,
    "access": "R",
    "activation": "3 PA · 1/scène · rayon 5 m à 20 m",
    "effect": "Pour 3 PA, une fois par scène, imposez DGT 12 par pression directe dans une zone de 5 m de rayon à 20 m, avec un Jet divin contre chaque Défense occulte. Jusqu’à la fin de la scène, traverser cette zone consomme deux fois la distance normale, sans nouveaux dégâts automatiques.",
    "effectDetails": "Pour 3 PA, une fois par scène, imposez DGT 12 par pression directe dans une zone de 5 m de rayon à 20 m, avec un Jet divin contre chaque Défense occulte. Jusqu’à la fin de la scène, traverser cette zone consomme deux fois la distance normale, sans nouveaux dégâts automatiques."
  },
  "alabor_les_eaux_primordiales_facette_pluie_fecondite_eaux_nourricieres": {
    "number": 8,
    "cost": 2,
    "access": "SR/R",
    "activation": "10 minutes · 1/jour",
    "effect": "Après dix minutes de préparation d’une zone irriguée de 10 m de rayon, une heure de croissance végétale naturelle y équivaut à une journée et le prochain repos récupérateur de ses bénéficiaires rend 2 PV supplémentaires. Une même zone ou personne n’en bénéficie qu’une fois par jour ; ni nourriture instantanée ni guérison en combat.",
    "effectDetails": "Après dix minutes de préparation d’une zone irriguée de 10 m de rayon, une heure de croissance végétale naturelle y équivaut à une journée et le prochain repos récupérateur de ses bénéficiaires rend 2 PV supplémentaires. Une même zone ou personne n’en bénéficie qu’une fois par jour ; ni nourriture instantanée ni guérison en combat."
  },
  "alabor_les_eaux_primordiales_facette_pluie_fecondite_deluge": {
    "number": 9,
    "cost": 3,
    "access": "R",
    "activation": "2 PA · 1/scène · rayon 15 m à 30 m",
    "effect": "Pour 2 PA, une fois par scène, installez une pluie torrentielle dans un rayon de 15 m à 30 m maximum jusqu’à la fin de la scène. Les tirs et perceptions visuelles qui la traversent subissent −3, les déplacements y consomment deux fois la distance normale et les flammes ordinaires s’éteignent.",
    "effectDetails": "Pour 2 PA, une fois par scène, installez une pluie torrentielle dans un rayon de 15 m à 30 m maximum jusqu’à la fin de la scène. Les tirs et perceptions visuelles qui la traversent subissent −3, les déplacements y consomment deux fois la distance normale et les flammes ordinaires s’éteignent."
  },
  "astaroth_la_civilisation_facette_savoir_comprehension_universelle": {
    "number": 11,
    "cost": 2,
    "access": "SR/R",
    "activation": "Étude préalable · scène",
    "effect": "Après étude d’une documentation pertinente, choisissez un domaine de connaissance : vos tests de connaissance dans ce domaine gagnent +3 pour la scène, même si vous y étiez déjà compétent. Cela ne fournit ni expérience pratique ni faculté physique et ne cumule pas un autre +3 équivalent.",
    "effectDetails": "Après étude d’une documentation pertinente, choisissez un domaine de connaissance : vos tests de connaissance dans ce domaine gagnent +3 pour la scène, même si vous y étiez déjà compétent. Cela ne fournit ni expérience pratique ni faculté physique et ne cumule pas un autre +3 équivalent."
  },
  "astaroth_la_civilisation_facette_savoir_convergence_des_savoirs": {
    "number": 12,
    "cost": 3,
    "access": "SR/R",
    "activation": "1 PA · 1/scène",
    "effect": "Une fois par scène, après 1 PA de réflexion, le MJ indique un lien nouveau réellement déductible des sources que vous avez étudiées. Le test intellectuel qui exploite cette conclusion gagne 2 DR en cas de réussite, maximum DR 5, sans créer de preuve absente.",
    "effectDetails": "Une fois par scène, après 1 PA de réflexion, le MJ indique un lien nouveau réellement déductible des sources que vous avez étudiées. Le test intellectuel qui exploite cette conclusion gagne 2 DR en cas de réussite, maximum DR 5, sans créer de preuve absente."
  },
  "astaroth_la_civilisation_facette_ecriture_uvre_de_civilisation": {
    "number": 15,
    "cost": 3,
    "access": "SR/R",
    "activation": "Préparation et étude · scène",
    "effect": "Un traité, plan ou enseignement que vous avez réellement préparé permet à ses lecteurs sérieux de bénéficier de +3 aux tests directement fondés sur son contenu pendant une scène d’application. Ce bénéfice ne fournit aucune compétence absente et ne se cumule pas avec un ouvrage équivalent.",
    "effectDetails": "Un traité, plan ou enseignement que vous avez réellement préparé permet à ses lecteurs sérieux de bénéficier de +3 aux tests directement fondés sur son contenu pendant une scène d’application. Ce bénéfice ne fournit aucune compétence absente et ne se cumule pas avec un ouvrage équivalent."
  },
  "astaroth_la_civilisation_facette_arts_creation_muse_divine": {
    "number": 17,
    "cost": 2,
    "access": "SR/R",
    "activation": "Œuvre · scène",
    "effect": "Votre œuvre communique réellement l’émotion ou l’idée choisie, même au-delà d’une barrière de langue, et donne +3 au premier test social qui exploite ce message auprès de son public dans la scène. Une influence hostile exige un Jet divin contre la Défense occulte ; elle ne crée ni obéissance ni faux souvenir.",
    "effectDetails": "Votre œuvre communique réellement l’émotion ou l’idée choisie, même au-delà d’une barrière de langue, et donne +3 au premier test social qui exploite ce message auprès de son public dans la scène. Une influence hostile exige un Jet divin contre la Défense occulte ; elle ne crée ni obéissance ni faux souvenir."
  },
  "belial_la_reine_des_dieux_facette_destruction_aneantissement": {
    "number": 27,
    "cost": 3,
    "access": "R",
    "activation": "2 PA · 1/scène",
    "effect": "Pour 2 PA, toujours une fois par scène : DGT 15 et pénétration 6 contre objet ou barrière, DGT 12 et pénétration 3 contre une créature. La Défense et la Protection adaptées restent applicables ; aucun artefact majeur n’est supprimé automatiquement.",
    "effectDetails": "Pour 2 PA, toujours une fois par scène : DGT 15 et pénétration 6 contre objet ou barrière, DGT 12 et pénétration 3 contre une créature. La Défense et la Protection adaptées restent applicables ; aucun artefact majeur n’est supprimé automatiquement.\n\nObjet, structure ou barrière : Protection adaptée. Une attaque directe contre une créature oppose la Défense occulte. Le pouvoir ne détruit pas automatiquement une protection mythique."
  },
  "diablo_la_nuit_qui_regarde_facette_nuit_nuit_absolue": {
    "number": 30,
    "cost": 3,
    "access": "R",
    "activation": "2 PA · 1/scène · rayon 15 m",
    "effect": "Pour 2 PA, une fois par scène, créez jusqu’à la fin de la scène une obscurité divine de 15 m de rayon centrée sur vous à l’activation. Vous y voyez ; les autres doivent posséder une perception surnaturelle adaptée, et les lumières ordinaires n’y fonctionnent pas.",
    "effectDetails": "Pour 2 PA, une fois par scène, créez jusqu’à la fin de la scène une obscurité divine de 15 m de rayon centrée sur vous à l’activation. Vous y voyez ; les autres doivent posséder une perception surnaturelle adaptée, et les lumières ordinaires n’y fonctionnent pas."
  },
  "diablo_la_nuit_qui_regarde_facette_cauchemar_cauchemar_eveille": {
    "number": 32,
    "cost": 2,
    "access": "SR/R",
    "activation": "1 PA · 20 m · scène",
    "effect": "Pour 1 PA, imposez à une cible à 20 m un cauchemar personnel après un Jet divin contre sa Défense occulte : −3 aux actions exigeant calme ou concentration pour la scène. Elle peut consacrer 1 PA, une fois par round, à Volonté + Force Mentale contre le résultat initial pour y mettre fin.",
    "effectDetails": "Pour 1 PA, imposez à une cible à 20 m un cauchemar personnel après un Jet divin contre sa Défense occulte : −3 aux actions exigeant calme ou concentration pour la scène. Elle peut consacrer 1 PA, une fois par round, à Volonté + Force Mentale contre le résultat initial pour y mettre fin."
  },
  "diablo_la_nuit_qui_regarde_facette_cauchemar_terreur_primordiale": {
    "number": 33,
    "cost": 3,
    "access": "R",
    "activation": "2 PA · 1/scène · 10 m",
    "effect": "Pour 2 PA, une fois par scène, les cibles choisies et perçues à 10 m affrontent le même Jet divin avec leur Défense occulte : en échec, elles sont Paniquées pendant un round puis Tendues pour la scène. Elles peuvent ensuite briser l’effet par 1 PA et Volonté + Force Mentale contre le résultat initial, une fois par round.",
    "effectDetails": "Pour 2 PA, une fois par scène, les cibles choisies et perçues à 10 m affrontent le même Jet divin avec leur Défense occulte : en échec, elles sont Paniquées pendant un round puis Tendues pour la scène. Elles peuvent ensuite briser l’effet par 1 PA et Volonté + Force Mentale contre le résultat initial, une fois par round."
  },
  "diablo_la_nuit_qui_regarde_facette_devoration_la_nuit_apprend": {
    "number": 35,
    "cost": 2,
    "access": "R",
    "activation": "Deux usages de l’Écho · scène",
    "effect": "Un Écho obtenu par Rémanence nocturne peut être reproduit deux fois avant la fin de la scène, au coût normal de sa version élémentaire. Cela ne copie ni un Sang complet ni les ressources, prérequis biologiques ou pouvoirs uniques du porteur d’origine.",
    "effectDetails": "Un Écho obtenu par Rémanence nocturne peut être reproduit deux fois avant la fin de la scène, au coût normal de sa version élémentaire. Cela ne copie ni un Sang complet ni les ressources, prérequis biologiques ou pouvoirs uniques du porteur d’origine."
  },
  "lilith_desir_sexe_plaisir_et_attachement_facette_desir_plaisir_eveiller_le_desir": {
    "number": 38,
    "cost": 2,
    "access": "SR/R",
    "activation": "1 PA · scène",
    "effect": "Pour 1 PA, après opposition à la Défense occulte, intensifiez un désir réellement possible chez la cible et gagnez +3 aux tests sociaux qui l’exploitent pendant la scène. Elle conserve ses limites et peut refuser ; ni orientation, ni consentement, ni personnalité ne sont réécrits.",
    "effectDetails": "Pour 1 PA, après opposition à la Défense occulte, intensifiez un désir réellement possible chez la cible et gagnez +3 aux tests sociaux qui l’exploitent pendant la scène. Elle conserve ses limites et peut refuser ; ni orientation, ni consentement, ni personnalité ne sont réécrits.\n\nJet : Charisme + Influence ou Diplomatie + 1d10e contre Défense occulte. Un sentiment n’est jamais un consentement ni une injonction automatique."
  },
  "lilith_desir_sexe_plaisir_et_attachement_facette_fertilite_chair_chair_feconde": {
    "number": 41,
    "cost": 2,
    "access": "SR/R",
    "activation": "1 PA · contact · scène",
    "effect": "Pour 1 PA au contact, modulez pour la scène une fonction hormonale ou reproductive d’une cible consentante, ou après opposition à sa Défense occulte. Vous pouvez suspendre une perturbation ordinaire de ce registre, pas guérir n’importe quelle maladie ou infliger un handicap arbitraire.",
    "effectDetails": "Pour 1 PA au contact, modulez pour la scène une fonction hormonale ou reproductive d’une cible consentante, ou après opposition à sa Défense occulte. Vous pouvez suspendre une perturbation ordinaire de ce registre, pas guérir n’importe quelle maladie ou infliger un handicap arbitraire."
  },
  "lilith_desir_sexe_plaisir_et_attachement_facette_fertilite_chair_fecondite_divine": {
    "number": 42,
    "cost": 3,
    "access": "R",
    "activation": "Rituel · 1 heure",
    "effect": "Un rituel d’une heure permet une restauration ou modification reproductive durable et biologiquement cohérente, définie avec le MJ à partir d’un examen réel. Il ne crée ni vie à partir de rien ni grossesse automatique et ne reproduit pas une signature unique de Duc.",
    "effectDetails": "Un rituel d’une heure permet une restauration ou modification reproductive durable et biologiquement cohérente, définie avec le MJ à partir d’un examen réel. Il ne crée ni vie à partir de rien ni grossesse automatique et ne reproduit pas une signature unique de Duc.\n\nLa portée de la modification doit être convenue avant le rituel, dans le seul registre reproductif. La volonté des personnes concernées reste respectée ; aucun résultat biologique ou signature de Duc n’est inventé par le formulaire."
  },
  "lilith_desir_sexe_plaisir_et_attachement_facette_attachement_sentiments_attiser_apaiser": {
    "number": 44,
    "cost": 2,
    "access": "SR/R",
    "activation": "1 PA · scène",
    "effect": "Pour 1 PA, modifiez un sentiment existant pour la scène : apaiser une peur réduit d’un cran le Stress psychologique qui en découle, tandis qu’attiser une émotion impose −3 aux actions qui la contrarient directement. Une cible hostile oppose sa Défense occulte ; les minima de blessures et les autres causes de Stress demeurent.",
    "effectDetails": "Pour 1 PA, modifiez un sentiment existant pour la scène : apaiser une peur réduit d’un cran le Stress psychologique qui en découle, tandis qu’attiser une émotion impose −3 aux actions qui la contrarient directement. Une cible hostile oppose sa Défense occulte ; les minima de blessures et les autres causes de Stress demeurent."
  },
  "mammon_l_ineluctable_facette_mort_la_fin_vient": {
    "number": 48,
    "cost": 3,
    "access": "R",
    "activation": "1 PA · 1/scène",
    "effect": "Une fois par scène, pour 1 PA, frappez à DGT 12 une cible à 25 % de ses PV maximum ou moins ; les PV perdus par cette frappe ne peuvent être régénérés avant la fin de la scène. Si elle tombe à 0 PV ou moins, la stabilisation garde son surcoût d’un niveau jusqu’à la fin du round suivant, sans empêcher les soins adaptés.",
    "effectDetails": "Une fois par scène, pour 1 PA, frappez à DGT 12 une cible à 25 % de ses PV maximum ou moins ; les PV perdus par cette frappe ne peuvent être régénérés avant la fin de la scène. Si elle tombe à 0 PV ou moins, la stabilisation garde son surcoût d’un niveau jusqu’à la fin du round suivant, sans empêcher les soins adaptés.\n\nLa condition de 25 % se calcule sur les PV maximum de la cible au moment de l’attaque. Seuls les PV effectivement perdus à cette frappe sont concernés ; les soins adaptés ne sont pas interdits."
  },
  "mammon_l_ineluctable_facette_destin_delivrance_derniere_destination": {
    "number": 54,
    "cost": 2,
    "access": "SR/R",
    "activation": "1 PA · 1/scène",
    "effect": "Une fois par scène, lorsqu’une issue précise est déjà engagée, percevez le dernier obstacle réel qui l’empêche encore et une action immédiatement praticable pour le lever. Votre premier test pour accomplir cette action gagne +3 ; le talent ne choisit pas l’issue à votre place et ne prédit pas tout l’avenir.",
    "effectDetails": "Une fois par scène, lorsqu’une issue précise est déjà engagée, percevez le dernier obstacle réel qui l’empêche encore et une action immédiatement praticable pour le lever. Votre premier test pour accomplir cette action gagne +3 ; le talent ne choisit pas l’issue à votre place et ne prédit pas tout l’avenir."
  },
  "mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_spectre_affine": {
    "number": 55,
    "cost": 1,
    "access": "R",
    "activation": "Progression · par Spectre",
    "effect": "Choisissez une Affinité spectrale possédée : elle passe à Maîtrise Affinée, autorisant précision, formes complexes et division simple d’un effet. Ce développement se paie par Affinité, sans ouvrir la progression d’un véritable Mage.",
    "effectDetails": "Choisissez une Affinité spectrale possédée : elle passe à Maîtrise Affinée, autorisant précision, formes complexes et division simple d’un effet. Ce développement se paie par Affinité, sans ouvrir la progression d’un véritable Mage.\n\nLe premier achat canonique améliore le premier Spectre ; le second exemplaire porte exclusivement sur le second Spectre et coûte également 1 PTV. Aucun bonus d’Attribut ou de Maîtrise spirituelle n’est accordé."
  },
  "mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_spectre_amplifie": {
    "number": 56,
    "cost": 2,
    "access": "R",
    "activation": "Progression · par Spectre",
    "effect": "Choisissez une Affinité spectrale possédée : elle atteint l’Amplitude Significative et ses effets Mineurs gagnent un niveau de réduction de Difficulté intrinsèque. Les PA, portées et Défenses normales restent applicables ; le Spectre ne produit toujours ni Tension ni Revers.",
    "effectDetails": "Choisissez une Affinité spectrale possédée : elle atteint l’Amplitude Significative et ses effets Mineurs gagnent un niveau de réduction de Difficulté intrinsèque. Les PA, portées et Défenses normales restent applicables ; le Spectre ne produit toujours ni Tension ni Revers.\n\nLe premier achat canonique améliore le premier Spectre ; développer le second coûte également 2 PTV. La Difficulté intrinsèque ne descend pas sous 12 ; ni la Défense adverse ni les PA ne diminuent."
  },
  "mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_polyphonie_occulte": {
    "number": 57,
    "cost": 3,
    "access": "R",
    "activation": "Progression · second Spectre",
    "effect": "Choisissez une seconde Affinité spectrale différente, qui commence en Initiale / Mineure. Ses paliers se développent séparément par Spectre affiné et Spectre amplifié, sans jamais dépasser Affinée / Significative.",
    "effectDetails": "Choisissez une seconde Affinité spectrale différente, qui commence en Initiale / Mineure. Ses paliers se développent séparément par Spectre affiné et Spectre amplifié, sans jamais dépasser Affinée / Significative.\n\nLes deux Affinités doivent être distinctes et choisies parmi les quinze domaines du moteur magique. Aucun Écho, Œuvre, Volonté supérieure ou accès à la Roue des Mageius n’est accordé. Une ancienne acquisition reste conservée et payée lorsque son choix reste à compléter."
  },
  "mephisto_l_occulte_la_parole_et_le_hasard_facette_parole_chant_mot_irresistible": {
    "number": 59,
    "cost": 2,
    "access": "SR/R",
    "activation": "Réaction · 1 PA · 1/scène",
    "effect": "Une fois par scène, pour 1 PA en Réaction avant sa résolution, adressez une phrase compréhensible à un interlocuteur et opposez Charisme + Diplomatie à sa Défense occulte pour interrompre son action. Il conserve son PA et peut choisir une autre action ; aucun ordre suicidaire ni domination durable n’est imposé.",
    "effectDetails": "Une fois par scène, pour 1 PA en Réaction avant sa résolution, adressez une phrase compréhensible à un interlocuteur et opposez Charisme + Diplomatie à sa Défense occulte pour interrompre son action. Il conserve son PA et peut choisir une autre action ; aucun ordre suicidaire ni domination durable n’est imposé."
  },
  "mephisto_l_occulte_la_parole_et_le_hasard_facette_parole_chant_verbe_historique": {
    "number": 60,
    "cost": 3,
    "access": "SR/R",
    "activation": "3 PA · 1/scène",
    "effect": "Pour 3 PA de discours, une fois par scène, vos alliés qui l’entendent gagnent +3 sur une catégorie d’action précise et annoncée jusqu’à la fin de la scène. Le discours peut être préparé sur des rounds consécutifs ; il ne fournit aucune compétence et ne cumule pas un soutien équivalent.",
    "effectDetails": "Pour 3 PA de discours, une fois par scène, vos alliés qui l’entendent gagnent +3 sur une catégorie d’action précise et annoncée jusqu’à la fin de la scène. Le discours peut être préparé sur des rounds consécutifs ; il ne fournit aucune compétence et ne cumule pas un soutien équivalent.\n\nLe discours s’adresse aux alliés capables de l’entendre ; la catégorie d’action est fixée avant le test, pas après les résultats."
  },
  "mephisto_l_occulte_la_parole_et_le_hasard_facette_fortune_illusion_mensonge_du_monde": {
    "number": 62,
    "cost": 2,
    "access": "SR/R",
    "activation": "1 PA · rayon 3 m à 20 m · scène",
    "effect": "Pour 1 PA, créez pour la scène une illusion multisensorielle dans une zone de 3 m de rayon à 20 m, en déclarant si elle est extérieure ou directement mentale. Une illusion extérieure est perceptible par les capteurs adaptés et se démasque par Perception ; une illusion mentale affronte la Défense occulte et ne produit aucune matière réelle.",
    "effectDetails": "Pour 1 PA, créez pour la scène une illusion multisensorielle dans une zone de 3 m de rayon à 20 m, en déclarant si elle est extérieure ou directement mentale. Une illusion extérieure est perceptible par les capteurs adaptés et se démasque par Perception ; une illusion mentale affronte la Défense occulte et ne produit aucune matière réelle."
  },
  "mephisto_l_occulte_la_parole_et_le_hasard_facette_fortune_illusion_fortune_volee": {
    "number": 63,
    "cost": 3,
    "access": "Réaction",
    "activation": "Réaction · 1 PA · 1/scène",
    "effect": "Une fois par scène, pour 1 PA en Réaction après un jet adverse réussi mais avant ses conséquences, imposez à un adversaire visible de relancer son d10e et de conserver le second résultat. Vous gagnez +3 à votre prochain test avant la fin du round suivant, sans deuxième relance de talent sur le même test.",
    "effectDetails": "Une fois par scène, pour 1 PA en Réaction après un jet adverse réussi mais avant ses conséquences, imposez à un adversaire visible de relancer son d10e et de conserver le second résultat. Vous gagnez +3 à votre prochain test avant la fin du round suivant, sans deuxième relance de talent sur le même test.\n\nLa réaction vise un jet que l’adversaire vient de réussir. Le second résultat est conservé même s’il est meilleur ; les conséquences du premier résultat ne sont pas appliquées avant la relance."
  },
  "satan_le_juge_facette_sentence_chaines_du_coupable": {
    "number": 65,
    "cost": 2,
    "access": "SR/R",
    "activation": "1 PA · scène",
    "effect": "Pour 1 PA, après avoir établi la culpabilité pour un acte précis, opposez votre Jet divin à la Défense occulte pour immobiliser la cible jusqu’à la fin de la scène. Se libérer coûte 1 PA et Volonté + Force Mentale contre le résultat initial ; une accusation inventée ne donne aucun effet.",
    "effectDetails": "Pour 1 PA, après avoir établi la culpabilité pour un acte précis, opposez votre Jet divin à la Défense occulte pour immobiliser la cible jusqu’à la fin de la scène. Se libérer coûte 1 PA et Volonté + Force Mentale contre le résultat initial ; une accusation inventée ne donne aucun effet."
  },
  "satan_le_juge_facette_ordre_paix_treve": {
    "number": 68,
    "cost": 2,
    "access": "SR/R",
    "activation": "2 PA · rayon 10 m · scène",
    "effect": "Pour 2 PA, établissez une Trêve de 10 m de rayon pour la scène : quiconque veut engager une attaque doit réussir Volonté + Force Mentale 15, une fois par tentative payée. En échec l’attaque ne part pas et le PA est consommé ; les Défenses restent toujours possibles, pour tous les camps.",
    "effectDetails": "Pour 2 PA, établissez une Trêve de 10 m de rayon pour la scène : quiconque veut engager une attaque doit réussir Volonté + Force Mentale 15, une fois par tentative payée. En échec l’attaque ne part pas et le PA est consommé ; les Défenses restent toujours possibles, pour tous les camps."
  },
  "satan_le_juge_facette_ordre_paix_loi_du_juge": {
    "number": 69,
    "cost": 3,
    "access": "SR/R",
    "activation": "2 PA · rayon 10 m · scène",
    "effect": "Pour 2 PA, annoncez pour la scène une règle de paix claire, réalisable et applicable à tous dans un rayon de 10 m. Une violation volontaire entraîne 3 PV irréductibles après échec d’une résistance occulte contre le Jet divin initial, au maximum une sanction par personne et par round, sans créer de culpabilité morale.",
    "effectDetails": "Pour 2 PA, annoncez pour la scène une règle de paix claire, réalisable et applicable à tous dans un rayon de 10 m. Une violation volontaire entraîne 3 PV irréductibles après échec d’une résistance occulte contre le Jet divin initial, au maximum une sanction par personne et par round, sans créer de culpabilité morale.\n\nLa règle doit être publique, compréhensible, raisonnablement réalisable, non suicidaire et destinée à rétablir l’ordre ou la paix. Elle vaut également pour le Daemon et ses alliés ; une convention violée ne fabrique pas la culpabilité nécessaire aux Talents de Sentence."
  },
  "satan_le_juge_facette_vengeance_dette": {
    "number": 70,
    "cost": 1,
    "access": "SR/R",
    "activation": "Gratuit · 1/round",
    "effect": "Une fois par round, lorsqu’un ennemi blesse volontairement le Daemon ou un protégé, marquez-le gratuitement pour gagner +3 à votre prochain jet contre lui dans la scène. Une seule dette est active et le bonus ne se cumule pas avec une représaille équivalente.",
    "effectDetails": "Une fois par round, lorsqu’un ennemi blesse volontairement le Daemon ou un protégé, marquez-le gratuitement pour gagner +3 à votre prochain jet contre lui dans la scène. Une seule dette est active et le bonus ne se cumule pas avec une représaille équivalente."
  },
  "satan_le_juge_facette_vengeance_retour_des_actes": {
    "number": 71,
    "cost": 2,
    "access": "SR/R",
    "activation": "Réaction · 1 PA",
    "effect": "Pour 1 PA en Réaction après avoir subi un effet hostile, opposez votre Jet divin à la Défense occulte de son auteur. En réussite, le contrecoup lui impose −3 à une famille d’actions cohérente avec ce que vous avez subi jusqu’à la fin de son prochain round, sans copier son pouvoir ni annuler votre propre dommage.",
    "effectDetails": "Pour 1 PA en Réaction après avoir subi un effet hostile, opposez votre Jet divin à la Défense occulte de son auteur. En réussite, le contrecoup lui impose −3 à une famille d’actions cohérente avec ce que vous avez subi jusqu’à la fin de son prochain round, sans copier son pouvoir ni annuler votre propre dommage."
  },
  "satan_le_juge_facette_vengeance_il_pour_il": {
    "number": 72,
    "cost": 3,
    "access": "SR/R",
    "activation": "1 PA · 1/scène",
    "effect": "Une fois par scène, pour 1 PA, opposez votre Jet divin à la Défense occulte de l’auteur d’une attaque dont vous avez constaté les dommages dans cette scène. En réussite, il perd autant de PV que sa victime en avait réellement perdu, maximum 12 et sans ajout de marge ; aucun cumul de plusieurs attaques n’est permis.",
    "effectDetails": "Une fois par scène, pour 1 PA, opposez votre Jet divin à la Défense occulte de l’auteur d’une attaque dont vous avez constaté les dommages dans cette scène. En réussite, il perd autant de PV que sa victime en avait réellement perdu, maximum 12 et sans ajout de marge ; aucun cumul de plusieurs attaques n’est permis."
  },
  "lucifer_le_soleil_dechu_facette_soleil_halo_du_jour": {
    "number": 74,
    "cost": 2,
    "access": "R",
    "activation": "1 PA · rayon 10 m · scène",
    "effect": "Pour 1 PA, rayonnez sur 10 m pour la scène : les créatures réellement vulnérables au solaire y subissent −3 à leurs actions. Les ténèbres surnaturelles mineures sont repoussées après opposition à leur Puissance ; aucun dégât périodique gratuit n’est ajouté.",
    "effectDetails": "Pour 1 PA, rayonnez sur 10 m pour la scène : les créatures réellement vulnérables au solaire y subissent −3 à leurs actions. Les ténèbres surnaturelles mineures sont repoussées après opposition à leur Puissance ; aucun dégât périodique gratuit n’est ajouté."
  },
  "lucifer_le_soleil_dechu_facette_soleil_aube_implacable": {
    "number": 75,
    "cost": 3,
    "access": "R",
    "activation": "3 PA · 1/scène · rayon 15 m",
    "effect": "Pour 3 PA, une fois par scène, déployez une aube de 15 m de rayon : un Jet divin contre chaque Défense, DGT 12 de base aux cibles hostiles vulnérables au solaire, plus le seul +3 de Radiance originelle. Le même résultat dissipe les ténèbres temporaires dont il surpasse la Puissance, sans seconde vague de dégâts.",
    "effectDetails": "Pour 3 PA, une fois par scène, déployez une aube de 15 m de rayon : un Jet divin contre chaque Défense, DGT 12 de base aux cibles hostiles vulnérables au solaire, plus le seul +3 de Radiance originelle. Le même résultat dissipe les ténèbres temporaires dont il surpasse la Puissance, sans seconde vague de dégâts.\n\nLe rayonnement physique affronte la Défense physique ; le +3 de Radiance originelle n’est compté qu’une fois, jamais une fois par libellé. Les êtres seulement habitués à la nuit ne sont pas des cibles vulnérables au solaire."
  },
  "lucifer_le_soleil_dechu_facette_courage_gloire_du_jour": {
    "number": 81,
    "cost": 3,
    "access": "R",
    "activation": "1 PA · 1/scène · 5 alliés à 10 m",
    "effect": "Une fois par scène, pour 1 PA, jusqu’à cinq alliés à 10 m ignorent pour la scène les conséquences de Tendu et Paniqué provenant de la seule peur. Les blessures, les autres contraintes et leur liberté de battre en retraite restent inchangées.",
    "effectDetails": "Une fois par scène, pour 1 PA, jusqu’à cinq alliés à 10 m ignorent pour la scène les conséquences de Tendu et Paniqué provenant de la seule peur. Les blessures, les autres contraintes et leur liberté de battre en retraite restent inchangées."
  },
  "belzebuth_la_vie_sans_jugement_moral_facette_regeneration_printemps": {
    "number": 84,
    "cost": 3,
    "access": "R",
    "activation": "1 PA · 1/scène · 3 alliés à 10 m",
    "effect": "Une fois par scène, pour 1 PA, jusqu’à trois alliés à 10 m récupèrent chacun 3 + DR PV à partir du même Jet divin. La saturation commune aux soins de cette source demeure applicable à chacun.",
    "effectDetails": "Une fois par scène, pour 1 PA, jusqu’à trois alliés à 10 m récupèrent chacun 3 + DR PV à partir du même Jet divin. La saturation commune aux soins de cette source demeure applicable à chacun.\n\nSève vitale, Reconstruction et Printemps d’un même Élu partagent la saturation de guérison sur une cible. La Faveur Deuxième printemps de Perséphone conserve son exception écrite : jusqu’à 2 PV une fois par scénario."
  },
  "belzebuth_la_vie_sans_jugement_moral_facette_nature_evolution_evolution_dirigee": {
    "number": 86,
    "cost": 2,
    "access": "R",
    "activation": "1 PA · scène",
    "effect": "Pour 1 PA, donnez à vous-même ou à une cible consentante jusqu’à deux adaptations simples du registre d’Adaptation pour la scène. Elles n’accordent ni PA ni hausse arbitraire d’Attribut et remplacent les adaptations équivalentes précédentes.",
    "effectDetails": "Pour 1 PA, donnez à vous-même ou à une cible consentante jusqu’à deux adaptations simples du registre d’Adaptation pour la scène. Elles n’accordent ni PA ni hausse arbitraire d’Attribut et remplacent les adaptations équivalentes précédentes."
  },
  "belzebuth_la_vie_sans_jugement_moral_facette_nature_evolution_forme_superieure": {
    "number": 87,
    "cost": 3,
    "access": "R",
    "activation": "2 PA · scène · 2 propriétés",
    "effect": "Pour 2 PA, adoptez pour la scène jusqu’à deux propriétés de votre répertoire défini avant l’achat : vol soutenu, Armure corporelle 3, arme naturelle DGT 7 ou corps amphibie des profondeurs. Aucun PA supplémentaire ni cumul d’Armures corporelles n’est accordé.",
    "effectDetails": "Pour 2 PA, adoptez pour la scène jusqu’à deux propriétés de votre répertoire défini avant l’achat : vol soutenu, Armure corporelle 3, arme naturelle DGT 7 ou corps amphibie des profondeurs. Aucun PA supplémentaire ni cumul d’Armures corporelles n’est accordé.\n\nRépertoire disponible : vol soutenu au Déplacement normal, Armure corporelle 3, arme naturelle DGT 7, corps amphibie des profondeurs. Le répertoire sauvegardé ne signifie pas que ces propriétés sont toutes activées ; deux au maximum sont adoptées pour une scène. On conserve la meilleure Armure corporelle, sans sommer deux sources corporelles."
  },
  "belzebuth_la_vie_sans_jugement_moral_facette_maladie_miasme": {
    "number": 88,
    "cost": 1,
    "access": "SR/R",
    "activation": "1 PA · 20 m",
    "effect": "Pour 1 PA, imposez à une cible perçue à 20 m un Miasme après un Jet divin contre sa Défense occulte : −3 à une famille d’actions jusqu’à la fin de son prochain round. Contrairement à l’Affliction du Châtiment, le pouvoir ne demande pas le contact et reste utilisable en SR.",
    "effectDetails": "Pour 1 PA, imposez à une cible perçue à 20 m un Miasme après un Jet divin contre sa Défense occulte : −3 à une famille d’actions jusqu’à la fin de son prochain round. Contrairement à l’Affliction du Châtiment, le pouvoir ne demande pas le contact et reste utilisable en SR."
  },
  "belzebuth_la_vie_sans_jugement_moral_facette_maladie_contagion": {
    "number": 89,
    "cost": 2,
    "access": "R",
    "activation": "Après Miasme / Affliction · profil défini",
    "effect": "Vous pouvez transformer un Miasme réussi — ou votre Affliction de Châtiment — en maladie transmissible dont le profil est fixé avec le MJ avant usage. Transmission, incubation, résistance et fin de l’affection doivent être définies ; ce n’est ni une contamination automatique de foule ni un malus qui s’empile.",
    "effectDetails": "Vous pouvez transformer un Miasme réussi — ou votre Affliction de Châtiment — en maladie transmissible dont le profil est fixé avec le MJ avant usage. Transmission, incubation, résistance et fin de l’affection doivent être définies ; ce n’est ni une contamination automatique de foule ni un malus qui s’empile.\n\nUn Miasme doit avoir réellement réussi ; un Châtiment peut aussi employer son Affliction de Fonction, y compris lorsque cette Fonction a été apprise secondairement. La pathologie ne s’invente pas après les résistances."
  },
  "belzebuth_la_vie_sans_jugement_moral_facette_maladie_pestilence": {
    "number": 90,
    "cost": 3,
    "access": "R",
    "activation": "3 PA · 1/scène · rayon 10 m à 30 m",
    "effect": "Pour 3 PA, une fois par scène, frappez une zone de 10 m de rayon à 30 m : chaque cible qui échoue à sa Défense occulte subit une pathologie surnaturelle définie, avec −3 aux actions physiques pour la scène. Sa durée ultérieure, sa transmission et ses soins sont fixés avant usage, sans décès automatique ni aggravation par empilement.",
    "effectDetails": "Pour 3 PA, une fois par scène, frappez une zone de 10 m de rayon à 30 m : chaque cible qui échoue à sa Défense occulte subit une pathologie surnaturelle définie, avec −3 aux actions physiques pour la scène. Sa durée ultérieure, sa transmission et ses soins sont fixés avant usage, sans décès automatique ni aggravation par empilement."
  },
  "abigor_le_ciel_qui_frappe_d_en_haut_facette_vent_ciel_seigneur_des_courants": {
    "number": 93,
    "cost": 3,
    "access": "R",
    "activation": "Déplacement aérien · PA normaux",
    "effect": "Vos déplacements aériens permettent désormais un vol soutenu ou stationnaire, jusqu’à deux fois votre Déplacement normal, en portant éventuellement une personne si votre charge le permet. Vous dépensez normalement vos PA pour vous déplacer, sans en gagner pour attaquer ou agir ; cette exception autorise à rester en l’air entre deux rounds.",
    "effectDetails": "Vos déplacements aériens permettent désormais un vol soutenu ou stationnaire, jusqu’à deux fois votre Déplacement normal, en portant éventuellement une personne si votre charge le permet. Vous dépensez normalement vos PA pour vous déplacer, sans en gagner pour attaquer ou agir ; cette exception autorise à rester en l’air entre deux rounds."
  },
  "abigor_le_ciel_qui_frappe_d_en_haut_facette_orage_arc_celeste": {
    "number": 95,
    "cost": 2,
    "access": "R",
    "activation": "Après un éclair réussi · 1/round",
    "effect": "Une fois par round, après un éclair réussi, frappez jusqu’à deux autres cibles distinctes à 3 m maximum de la première, avec DGT 5. Chacune oppose sa Défense au même jet ; ces rebonds ne produisent aucun rebond supplémentaire.",
    "effectDetails": "Une fois par round, après un éclair réussi, frappez jusqu’à deux autres cibles distinctes à 3 m maximum de la première, avec DGT 5. Chacune oppose sa Défense au même jet ; ces rebonds ne produisent aucun rebond supplémentaire."
  },
  "abigor_le_ciel_qui_frappe_d_en_haut_facette_orage_foudre_de_chatiment": {
    "number": 96,
    "cost": 3,
    "access": "R",
    "activation": "2 PA · 1/scène",
    "effect": "Pour 2 PA, une fois par scène, lancez une Foudre de châtiment à DGT 12 qui ignore jusqu’à 3 points de Protection réellement applicable à l’électricité. Le tonnerre reste massif et l’attaque ne peut pas être discrète.",
    "effectDetails": "Pour 2 PA, une fois par scène, lancez une Foudre de châtiment à DGT 12 qui ignore jusqu’à 3 points de Protection réellement applicable à l’électricité. Le tonnerre reste massif et l’attaque ne peut pas être discrète."
  },
  "abigor_le_ciel_qui_frappe_d_en_haut_facette_tempete_il_de_la_tempete": {
    "number": 98,
    "cost": 2,
    "access": "R",
    "activation": "1 PA · rayon 3 m · scène",
    "effect": "Vous ménagez dans une tempête un espace calme de 3 m de rayon autour de vous, protégeant ceux qui s’y trouvent de ses vents et projections ordinaires pour la scène. Une tempête surnaturelle étrangère exige d’abord un Jet divin contre sa Puissance ; l’abri n’arrête pas les attaques qui n’en proviennent pas.",
    "effectDetails": "Vous ménagez dans une tempête un espace calme de 3 m de rayon autour de vous, protégeant ceux qui s’y trouvent de ses vents et projections ordinaires pour la scène. Une tempête surnaturelle étrangère exige d’abord un Jet divin contre sa Puissance ; l’abri n’arrête pas les attaques qui n’en proviennent pas.\n\nActivation : 1 PA selon le coût commun des actions non gratuites. L’espace calme ne protège ni d’une balle tirée de l’extérieur ni d’un pouvoir sans rapport avec la tempête."
  },
  "abigor_le_ciel_qui_frappe_d_en_haut_facette_tempete_typhon": {
    "number": 99,
    "cost": 3,
    "access": "R",
    "activation": "3 PA · 1/scène · rayon 10 m à 30 m",
    "effect": "Pour 3 PA, une fois par scène, et frappe une zone de 10 m de rayon à 30 m : DGT 12, recul jusqu’à 3 m et terrain bouleversé selon les obstacles réels. Chaque cible se défend contre le même jet ; aucun dégât répété ni typhon régional n’est créé.",
    "effectDetails": "Pour 3 PA, une fois par scène, et frappe une zone de 10 m de rayon à 30 m : DGT 12, recul jusqu’à 3 m et terrain bouleversé selon les obstacles réels. Chaque cible se défend contre le même jet ; aucun dégât répété ni typhon régional n’est créé."
  },
  "baal_la_guerre_elle_meme_facette_strategie_victoire_lecture_du_champ_de_bataille": {
    "number": 106,
    "cost": 1,
    "access": "SR/R",
    "activation": "1 PA · bonus 1/scène",
    "effect": "Après 1 PA d’observation, identifiez la faiblesse tactique actuellement exploitable ou l’appui dont dépend le rapport de force. Une fois par scène, la première action de vous-même ou d’un allié qui exploite ce diagnostic gagne +3, sans révéler un ennemi entièrement imperceptible.",
    "effectDetails": "Après 1 PA d’observation, identifiez la faiblesse tactique actuellement exploitable ou l’appui dont dépend le rapport de force. Une fois par scène, la première action de vous-même ou d’un allié qui exploite ce diagnostic gagne +3, sans révéler un ennemi entièrement imperceptible."
  },
  "morrighan_la_corneille_etrangere_facette_guerre_frenesie_fureur_de_la_corneille": {
    "number": 109,
    "cost": 1,
    "access": "R",
    "activation": "Frénésie volontaire · R",
    "effect": "En Frénésie volontaire, votre bonus aux tests physiques passe de +1 à +3. Les règles d’Impulsion et la perte de contrôle restent applicables, sans PA supplémentaire ni cumul avec un autre bonus équivalent de Frénésie.",
    "effectDetails": "En Frénésie volontaire, votre bonus aux tests physiques passe de +1 à +3. Les règles d’Impulsion et la perte de contrôle restent applicables, sans PA supplémentaire ni cumul avec un autre bonus équivalent de Frénésie.\n\nLe +3 est un bonus conditionnel aux tests physiques en Frénésie, pas une hausse des Attributs ou des PV maximum."
  },
  "morrighan_la_corneille_etrangere_facette_guerre_frenesie_sang_du_champ_de_bataille": {
    "number": 110,
    "cost": 2,
    "access": "R",
    "activation": "Après mise hors combat · 1/round",
    "effect": "Une fois par round, lorsqu’un véritable adversaire tombe hors combat à 10 m, votre prochaine attaque physique réussie avant la fin du round suivant gagne +2 DGT. Ce bénéfice est distinct du bonus de test de Frénésie et ne s’empile pas avec lui-même.",
    "effectDetails": "Une fois par round, lorsqu’un véritable adversaire tombe hors combat à 10 m, votre prochaine attaque physique réussie avant la fin du round suivant gagne +2 DGT. Ce bénéfice est distinct du bonus de test de Frénésie et ne s’empile pas avec lui-même."
  },
  "morrighan_la_corneille_etrangere_facette_guerre_frenesie_morrigu": {
    "number": 111,
    "cost": 3,
    "access": "R",
    "activation": "2 PA · 1/scène · 3 alliés à 10 m",
    "effect": "Pour 2 PA, une fois par scène, jusqu’à trois alliés à 10 m gagnent +2 DGT au corps à corps et ignorent les conséquences de Tendu et Paniqué causées uniquement par la peur pour la scène. Les minima dus aux blessures restent applicables et aucune Frénésie n’est imposée.",
    "effectDetails": "Pour 2 PA, une fois par scène, jusqu’à trois alliés à 10 m gagnent +2 DGT au corps à corps et ignorent les conséquences de Tendu et Paniqué causées uniquement par la peur pour la scène. Les minima dus aux blessures restent applicables et aucune Frénésie n’est imposée."
  },
  "morrighan_la_corneille_etrangere_facette_mort_presages_annonce_de_la_chute": {
    "number": 114,
    "cost": 3,
    "access": "SR/R",
    "activation": "Observer 1 round · 1/scène",
    "effect": "Une fois par scène, après avoir observé une cible pendant un round, le MJ indique une faiblesse réelle et actuellement exploitable. Jusqu’à la fin de la scène, vos attaques qui l’exploitent ignorent 3 points de Protection pertinente, sans créer une vulnérabilité ou contourner une invulnérabilité fondamentale.",
    "effectDetails": "Une fois par scène, après avoir observé une cible pendant un round, le MJ indique une faiblesse réelle et actuellement exploitable. Jusqu’à la fin de la scène, vos attaques qui l’exploitent ignorent 3 points de Protection pertinente, sans créer une vulnérabilité ou contourner une invulnérabilité fondamentale."
  },
  "morrighan_la_corneille_etrangere_facette_royaute_magie_sorcellerie_des_corneilles": {
    "number": 116,
    "cost": 2,
    "access": "SR/R",
    "activation": "Rituel · 10 minutes · difficulté 15",
    "effect": "Choisissez un domaine rituel étroit lié à Morrighan et définissez ses usages Initials / Mineurs avec le MJ avant l’achat. Chaque rituel demande dix minutes et suit une Difficulté de base 15, les portées et oppositions du moteur magique, sans ouvrir d’autre Affinité ni les Techniques Mage.",
    "effectDetails": "Choisissez un domaine rituel étroit lié à Morrighan et définissez ses usages Initials / Mineurs avec le MJ avant l’achat. Chaque rituel demande dix minutes et suit une Difficulté de base 15, les portées et oppositions du moteur magique, sans ouvrir d’autre Affinité ni les Techniques Mage.\n\nLes PA tactiques, portée et opposition d’un effet restent ceux du moteur magique adapté à son usage Initial / Mineur. Le rituel ne donne ni Affinité de Mage ni technique personnelle ; le répertoire saisi ne constitue pas une validation MJ."
  },
  "morrighan_la_corneille_etrangere_facette_royaute_magie_couronne_noire": {
    "number": 117,
    "cost": 3,
    "access": "R",
    "activation": "1 PA · 1/scène · 3 esprits",
    "effect": "Une fois par scène, pour 1 PA, opposez votre autorité divine à la Défense occulte de jusqu’à trois esprits mineurs de Mort ou de Guerre qui reconnaissent Morrighan. En réussite, vous obtenez pour la scène un passage, une trêve ou un témoignage qu’ils peuvent réellement fournir, sans serviteur combattant ni connaissance créée.",
    "effectDetails": "Une fois par scène, pour 1 PA, opposez votre autorité divine à la Défense occulte de jusqu’à trois esprits mineurs de Mort ou de Guerre qui reconnaissent Morrighan. En réussite, vous obtenez pour la scène un passage, une trêve ou un témoignage qu’ils peuvent réellement fournir, sans serviteur combattant ni connaissance créée.\n\nLes esprits doivent réellement reconnaître Morrighan et disposer du passage ou de l’information demandée. Aucun lien de servitude permanent n’est créé."
  },
  "daemon_clean_oracle_tentateur_lecture_mentale_lecture_superficielle": {
    "number": 122,
    "cost": 1,
    "access": "SR/R",
    "activation": "1 PA",
    "effect": "Pour 1 PA en SR ou R, opposez Volonté + Maîtrise spirituelle à la Défense occulte pour saisir l’émotion dominante, l’intention immédiate ou le sujet de pensée actif. Aucun souvenir profond n’est révélé.",
    "effectDetails": "Pour 1 PA en SR ou R, opposez Volonté + Maîtrise spirituelle à la Défense occulte pour saisir l’émotion dominante, l’intention immédiate ou le sujet de pensée actif. Aucun souvenir profond n’est révélé."
  },
  "daemon_clean_oracle_tentateur_fantasmagorie_songe_obsedant": {
    "number": 125,
    "cost": 2,
    "access": "SR/R",
    "activation": "Prochain sommeil · 1/scénario",
    "effect": "Une fois par scénario, au prochain sommeil réel d’une cible affectée par votre Fantasmagorie, vous pouvez établir quelques minutes de dialogue onirique et recevoir ses réponses volontaires. Une cible hostile peut refuser par une résistance occulte ; ce lien ne lit ni souvenirs cachés ni pensées non exprimées.",
    "effectDetails": "Une fois par scénario, au prochain sommeil réel d’une cible affectée par votre Fantasmagorie, vous pouvez établir quelques minutes de dialogue onirique et recevoir ses réponses volontaires. Une cible hostile peut refuser par une résistance occulte ; ce lien ne lit ni souvenirs cachés ni pensées non exprimées.\n\nLe dialogue porte sur des réponses volontairement exprimées ; aucune réponse, conviction ou information inconnue n’est créée. Le dépôt d’une image par Rêve empoisonné de Xezbeth reste distinct de ce dialogue."
  },
  "daemon_clean_oracle_tentateur_influence_prophetie_appel_du_prophete": {
    "number": 127,
    "cost": 1,
    "access": "SR/R",
    "activation": "Après Vision des âmes",
    "effect": "Après une Vision des âmes réussie, identifiez plus précisément la Divinité d’une marque connue ou la nature d’un lien divin actif, ainsi que les résonances prophétiques accessibles. Une dissimulation spirituelle reste opposable et aucun nom véritable ni Attribut complet n’est révélé.",
    "effectDetails": "Après une Vision des âmes réussie, identifiez plus précisément la Divinité d’une marque connue ou la nature d’un lien divin actif, ainsi que les résonances prophétiques accessibles. Une dissimulation spirituelle reste opposable et aucun nom véritable ni Attribut complet n’est révélé.\n\nL’effet lit une résonance de la cible : il n’accorde pas l’origine Ancien Prophète ni sa Rémanence au Daemon."
  },
  "daemon_clean_chatiment_tourmenteur_affliction_maladie_sacree": {
    "number": 129,
    "cost": 2,
    "access": "R",
    "activation": "2 PA · contact · profil défini",
    "effect": "Pour 2 PA au contact, imposez après opposition occulte une pathologie surnaturelle définie avant usage : symptômes, malus, durée et moyens de résistance ou de fin. Le talent reste distinct d’une propagation collective et n’accorde pas gratuitement les connaissances anatomiques nécessaires à une intervention précise.",
    "effectDetails": "Pour 2 PA au contact, imposez après opposition occulte une pathologie surnaturelle définie avant usage : symptômes, malus, durée et moyens de résistance ou de fin. Le talent reste distinct d’une propagation collective et n’accorde pas gratuitement les connaissances anatomiques nécessaires à une intervention précise."
  },
  "daemon_clean_chatiment_tourmenteur_terreur_terreur": {
    "number": 130,
    "cost": 1,
    "access": "SR/R",
    "activation": "1 PA · 1/scène · 3 témoins à 10 m",
    "effect": "Une fois par scène, pour 1 PA après une Affliction ou une blessure que vous avez réellement infligée, imposez votre Terreur à jusqu’à trois témoins à 10 m. Ceux qui échouent à leur Défense occulte deviennent Tendus jusqu’à la fin de leur prochain round, sans panique automatique.",
    "effectDetails": "Une fois par scène, pour 1 PA après une Affliction ou une blessure que vous avez réellement infligée, imposez votre Terreur à jusqu’à trois témoins à 10 m. Ceux qui échouent à leur Défense occulte deviennent Tendus jusqu’à la fin de leur prochain round, sans panique automatique."
  },
  "daemon_clean_chatiment_tourmenteur_terreur_hantise_du_condamne": {
    "number": 131,
    "cost": 2,
    "access": "SR/R",
    "activation": "Marque · 100 m · scénario",
    "effect": "Jusqu’à la fin du scénario, vous reconnaissez l’âme d’une victime marquée par votre Terreur et ressentez sa direction approximative à 100 m maximum. Une protection spirituelle adaptée peut masquer le lien ; aucun emplacement exact ni parcours à travers les obstacles n’est fourni.",
    "effectDetails": "Jusqu’à la fin du scénario, vous reconnaissez l’âme d’une victime marquée par votre Terreur et ressentez sa direction approximative à 100 m maximum. Une protection spirituelle adaptée peut masquer le lien ; aucun emplacement exact ni parcours à travers les obstacles n’est fourni."
  },
  "daemon_clean_chatiment_tourmenteur_destruction_destruction_daemoniaque": {
    "number": 132,
    "cost": 2,
    "access": "R",
    "activation": "1 PA · contact · scène",
    "effect": "Pour 1 PA au contact, après un Jet divin contre la Défense occulte, neutralisez pour la scène un Talent actif angélique ou daemoniaque identifiable et l’un de vos propres Talents actifs encore utilisables. Ni Empreinte, ni passif, ni Nature entière ne peut être choisi ; les effets maintenus qui dépendent du Talent ciblé cessent.",
    "effectDetails": "Pour 1 PA au contact, après un Jet divin contre la Défense occulte, neutralisez pour la scène un Talent actif angélique ou daemoniaque identifiable et l’un de vos propres Talents actifs encore utilisables. Ni Empreinte, ni passif, ni Nature entière ne peut être choisi ; les effets maintenus qui dépendent du Talent ciblé cessent."
  },
  "daemon_clean_fonctions_daemoniaques_formation_secondaire_formation_secondaire": {
    "number": 141,
    "cost": 3,
    "access": "Option avancée",
    "activation": "Apprentissage · Fonction secondaire",
    "effect": "Après mentor et accord narratif, choisissez une deuxième Fonction différente : vous recevez son Empreinte et pouvez acheter ses talents, sans obtenir une seconde Divinité ni Faveur. Le Builder doit mémoriser ce choix et appliquer ses véritables accès ; une case cochée par le joueur n’est pas une autorisation MJ.",
    "effectDetails": "Après mentor et accord narratif, choisissez une deuxième Fonction différente : vous recevez son Empreinte et pouvez acheter ses talents, sans obtenir une seconde Divinité ni Faveur. Le Builder doit mémoriser ce choix et appliquer ses véritables accès ; une case cochée par le joueur n’est pas une autorisation MJ.\n\nIl faut un mentor, du temps narratif et une justification dans la Cour. La Fonction principale, les bonus de Divinité et la Maisonnée restent uniques ; le choix ou un texte du joueur ne vaut pas autorisation MJ."
  }
};
export const propheticRemanence = {
  "id": "daemon_origine_ancien_prophete_remanence_prophetique",
  "name": "Rémanence prophétique",
  "cost": 2,
  "access": "SR/R",
  "activation": "Selon la manifestation définie",
  "group": "Origine de l’Élu › Ancien Prophète",
  "prerequisiteName": "Ancien Prophète ; manifestation définie avec le MJ",
  "effect": "Vous manifestez une cicatrice étroite de l’Attribut que votre âme a réellement porté avant sa refonte, selon les effets et limites définis avec le MJ. Elle ne rend ni l’Attribut cosmique, ni les prières, ni le statut de Prophète actuel.",
  "effectDetails": "Exclusif à l’origine Ancien Prophète, rare et soumise à accord MJ. Avant achat, le joueur et le MJ définissent une manifestation étroite : ancien Attribut, effet, PA, portée, cadence, conditions et limites. Le formulaire conserve la description et ne constitue jamais une autorisation MJ. Aucun Attribut cosmique, prière, rang ou pouvoir supplémentaire n’est attribué automatiquement.",
  "runtimeLore": "L’âme choisie garde une cicatrice de son ancienne charge cosmique, sans redevenir ce qu’elle portait autrefois."
};
export function applyDaemonRevisions<T extends {id:string}>(catalog:readonly T[]){return [...catalog.map(row=>daemonRevisions[row.id]?{...row,...daemonRevisions[row.id]}:row),propheticRemanence];}
