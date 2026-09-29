// Approved Angelus revisions, 29 September 2026. Stable IDs preserve existing purchases.
export type AngelusRevision={number:number;cost:number;effect:string;effectDetails:string;activation:string;access:string;name?:string;runtimeLore?:string};
export const angelusRevisions:Record<string,AngelusRevision> = {
  "nature_commune_pouvoirs_angeliques_talents_communs_reserve_transcendee": {
    "number": 1,
    "cost": 1,
    "effect": "Votre maximum d’Aura augmente de 2 après application du plafond de votre rang. Cet achat n’est possible qu’une fois et ne recharge pas l’Aura courante.",
    "effectDetails": "Votre maximum d’Aura augmente de 2 après application du plafond de votre rang. Cet achat n’est possible qu’une fois et ne recharge pas l’Aura courante.\n\nMaximum = min(plafond de rang, 3 + Force Mentale permanente + bonus de rang) + 2. Angelus : bonus 0, plafond 8 ; Chérubin : bonus 2, plafond 10. Un bonus temporaire de Compétence ne crée jamais d’Aura. Aucun remplissage automatique de la réserve courante.",
    "activation": "Passif · acquisition unique",
    "access": "V/SR/R · Passif · acquisition unique"
  },
  "nature_commune_pouvoirs_angeliques_talents_communs_porte_du_paradis": {
    "number": 2,
    "cost": 2,
    "effect": "Pour 1 PA et 1 Aura, établissez jusqu’à la fin de la scène une communication mentale avec un autre Angelus connu, consentant et relié à l’Arbre sur le même monde, quelle que soit la distance. Le lien transmet uniquement les messages volontairement échangés, sans lecture des pensées, partage des sens ni transfert d’Aura.",
    "effectDetails": "Pour 1 PA et 1 Aura, établissez jusqu’à la fin de la scène une communication mentale avec un autre Angelus connu, consentant et relié à l’Arbre sur le même monde, quelle que soit la distance. Le lien transmet uniquement les messages volontairement échangés, sans lecture des pensées, partage des sens ni transfert d’Aura.\n\nL’Arbre est un lien métaphysique, pas un territoire que l’on visite. Vous restez dans votre corps et ne déplacez ni votre âme ni votre incarnation. L’interlocuteur doit être réellement connu et accepter l’échange ; aucune réponse automatique d’Elynea ou d’un Archange et aucune connaissance nouvelle ne sont garanties. Une rupture effective de la connexion à l’Arbre interrompt la liaison.",
    "activation": "1 PA · 1 Aura · scène",
    "access": "SR/R · 1 PA · 1 Aura · scène",
    "name": "Liaison céleste",
    "runtimeLore": "L’Auréole porte une parole choisie entre deux âmes reliées à l’Arbre, sans transformer ce lien métaphysique en lieu de passage."
  },
  "progression_de_transcendance_transcendance_cherubique": {
    "number": 3,
    "cost": 3,
    "effect": "Après au moins 3 PTV investis dans votre Nature primaire et l’événement narratif requis, obtenez le rang Chérubin et choisissez une seconde Nature. Vous recevez son pouvoir fondamental et l’accès à ses talents, avec +2 au bonus et au plafond d’Aura de rang.",
    "effectDetails": "Après au moins 3 PTV investis dans votre Nature primaire et l’événement narratif requis, obtenez le rang Chérubin et choisissez une seconde Nature. Vous recevez son pouvoir fondamental et l’accès à ses talents, avec +2 au bonus et au plafond d’Aura de rang.\n\nPas de nouvelle Sephira, de nouvel Archange ou de Séraphin standard. Les deux paires d’ailes ne donnent toujours que +1 Agilité au total. Les 3 PTV préalables ne comprennent pas les talents communs ou ceux du Sephira. Le prérequis narratif doit rester un accord réel, non une approbation fabriquée par le formulaire.",
    "activation": "Progression · 3 PTV préalables de Nature",
    "access": "Progression · Progression · 3 PTV préalables de Nature"
  },
  "nature_trone_marque_du_trone": {
    "number": 4,
    "cost": 1,
    "effect": "Après observation de l’âme ou lien télépathique, marquez une cible pour 1 PA et 1 Aura, avec opposition occulte si elle résiste. Jusqu’à la fin du scénario, reconnaissez cette âme et percevez sa direction approximative à 100 m maximum ; une seule marque de ce talent à la fois.",
    "effectDetails": "Après observation de l’âme ou lien télépathique, marquez une cible pour 1 PA et 1 Aura, avec opposition occulte si elle résiste. Jusqu’à la fin du scénario, reconnaissez cette âme et percevez sa direction approximative à 100 m maximum ; une seule marque de ce talent à la fois.\n\nLe marquage ne donne ni coordonnées, ni vision à travers les murs ; un isolement spirituel adapté peut en bloquer la perception.",
    "activation": "1 PA · 1 Aura · 100 m · scénario",
    "access": "SR/R · 1 PA · 1 Aura · 100 m · scénario"
  },
  "nature_vertu_fardeau_partage": {
    "number": 5,
    "cost": 1,
    "effect": "Pour 1 PA en Réaction et 1 Aura, faites relancer la résistance émotionnelle ratée d’un allié perçu à 10 m maximum, qui conserve le second résultat. S’il échoue encore, vous subissez −3 aux actions exigeant calme ou concentration jusqu’à la fin de votre prochain round.",
    "effectDetails": "Pour 1 PA en Réaction et 1 Aura, faites relancer la résistance émotionnelle ratée d’un allié perçu à 10 m maximum, qui conserve le second résultat. S’il échoue encore, vous subissez −3 aux actions exigeant calme ou concentration jusqu’à la fin de votre prochain round.\n\nUne seule relance de Talent par test ; aucune relance en cascade. Le PA découle de la règle générale des Réactions. Aucune nouvelle limitation par scène n’est ajoutée.",
    "activation": "Réaction · 1 PA · 1 Aura · 10 m",
    "access": "SR/R · Réaction · 1 PA · 1 Aura · 10 m"
  },
  "nature_vertu_purification_de_l_ame": {
    "number": 6,
    "cost": 2,
    "effect": "Pour 2 PA et 2 Aura, opposez Volonté + Maîtrise spirituelle à la Puissance d’une malédiction, possession ou autre altération hostile de l’âme pour la retirer. Cela ne supprime pas une Nature ou une Marque fondamentale et ne retire pas, à lui seul, des points de Corruption.",
    "effectDetails": "Pour 2 PA et 2 Aura, opposez Volonté + Maîtrise spirituelle à la Puissance d’une malédiction, possession ou autre altération hostile de l’âme pour la retirer. Cela ne supprime pas une Nature ou une Marque fondamentale et ne retire pas, à lui seul, des points de Corruption.\n\nPrérequis Apaisement profond conservé ; règles de purification chiffrée de la Corruption réservées à la passe Fléaux.",
    "activation": "2 PA · 2 Aura · opposition",
    "access": "SR/R · 2 PA · 2 Aura · opposition"
  },
  "nature_vertu_chatiment_capital": {
    "number": 7,
    "cost": 3,
    "effect": "Pour 2 PA et 3 Aura, une fois par scène, appliquez à vous-même ou à un allié consentant un des sept Péchés pour la scène, avec ses avantages et contreparties. Envie accorde +2 dans une Compétence réellement observée, sans copier ses talents ou ses secrets.",
    "effectDetails": "Pour 2 PA et 3 Aura, une fois par scène, appliquez à vous-même ou à un allié consentant un des sept Péchés pour la scène, avec ses avantages et contreparties. Envie accorde +2 dans une Compétence réellement observée, sans copier ses talents ou ses secrets.\n\nLes six autres variantes sont conservées. Le +2 d’Envie est un bonus temporaire de pratique : il ne transfère ni talent, ni connaissance secrète, ni prérequis biologique. Purifier le Châtiment retire ensemble les avantages et les contreparties. La ressource fictionnelle absorbée par la Vertu reste requise.",
    "activation": "2 PA · 3 Aura · 1/scène",
    "access": "R · 2 PA · 3 Aura · 1/scène"
  },
  "nature_domination_marque_de_l_assassin": {
    "number": 8,
    "cost": 1,
    "effect": "Pour 1 PA et 1 Aura, marquez une cible visible jusqu’à la fin de la scène. La première attaque réussie contre elle à chaque round ignore 2 points de Protection ; la marque reste en place et vous ne pouvez en maintenir qu’une.",
    "effectDetails": "Pour 1 PA et 1 Aura, marquez une cible visible jusqu’à la fin de la scène. La première attaque réussie contre elle à chaque round ignore 2 points de Protection ; la marque reste en place et vous ne pouvez en maintenir qu’une.\n\nUne seule attaque bénéficie de la marque dans un round, quel que soit son auteur ; plusieurs exemplaires équivalents ne s’additionnent pas. Le bonus n’est pas une pénétration permanente de toutes les armes.",
    "activation": "1 PA · 1 Aura · scène",
    "access": "R · 1 PA · 1 Aura · scène"
  },
  "nature_domination_poursuite_celeste": {
    "number": 9,
    "cost": 2,
    "effect": "Une fois par round, lorsqu’une cible que vous avez marquée s’éloigne volontairement par un déplacement physique, vous pouvez l’attaquer avec votre Lame céleste avant son départ pour 1 PA en Réaction et 1 Aura. La cible doit être à portée au moment de l’attaque ; aucune poursuite après une téléportation déjà résolue.",
    "effectDetails": "Une fois par round, lorsqu’une cible que vous avez marquée s’éloigne volontairement par un déplacement physique, vous pouvez l’attaquer avec votre Lame céleste avant son départ pour 1 PA en Réaction et 1 Aura. La cible doit être à portée au moment de l’attaque ; aucune poursuite après une téléportation déjà résolue.\n\nRemplace le +3 après Impulsion, sans ajouter d’attaque gratuite ni renouveler les limites d’Ambidextre. Les marques personnelles de la Domination ou du Trône peuvent servir si elles sont réellement actives.",
    "activation": "Réaction · 1 PA · 1 Aura · 1/round",
    "access": "R · Réaction · 1 PA · 1 Aura · 1/round"
  },
  "nature_domination_mise_a_mort": {
    "number": 10,
    "cost": 3,
    "effect": "Une fois par scène, pour 1 PA et 3 Aura, attaquez avec la Lame céleste une cible à 25 % de ses PV maximum ou moins : +6 DGT et 3 Protection ignorée. Le +6 remplace celui de Miséricorde ; une cible tombée à 0 ou moins ne peut être stabilisée avant le début de votre prochain round.",
    "effectDetails": "Une fois par scène, pour 1 PA et 3 Aura, attaquez avec la Lame céleste une cible à 25 % de ses PV maximum ou moins : +6 DGT et 3 Protection ignorée. Le +6 remplace celui de Miséricorde ; une cible tombée à 0 ou moins ne peut être stabilisée avant le début de votre prochain round.\n\nLe coût passe de 2 à 1 PA ; coût PTV, condition de PV, pénétration et effet de stabilisation conservés. Le non-cumul explicite avec Miséricorde évite un +10 de même intention. Aucune destruction automatique d’âme ou négation d’une sauvegarde de Nature supérieure.",
    "activation": "1 PA · 3 Aura · 1/scène",
    "access": "R · 1 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_kether_la_couronne_facette_conscience_regard_partage": {
    "number": 11,
    "cost": 1,
    "effect": "Pour 1 PA et 1 Aura, percevez les sensations volontairement partagées d’un membre consentant de votre Nœud jusqu’à la fin de la scène. Le lien reste limité à la portée du Nœud et ne vous transfère pas ses compétences ni l’usage de ses pouvoirs.",
    "effectDetails": "Pour 1 PA et 1 Aura, percevez les sensations volontairement partagées d’un membre consentant de votre Nœud jusqu’à la fin de la scène. Le lien reste limité à la portée du Nœud et ne vous transfère pas ses compétences ni l’usage de ses pouvoirs.\n\nLe Nœud initial coûte séparément 1 PA et 1 Aura ; ses trois participants incluent le créateur. Recevoir une perception n’accorde pas une action au partenaire.",
    "activation": "1 PA · 1 Aura · scène",
    "access": "SR/R · 1 PA · 1 Aura · scène"
  },
  "les_dix_sephiroth_kether_la_couronne_facette_conscience_conscience_distribuee": {
    "number": 12,
    "cost": 3,
    "effect": "Pour 1 PA et 2 Aura, une fois par scène, les membres de votre Nœud peuvent utiliser la meilleure Défense occulte passive du groupe contre les effets mentaux ou perceptifs jusqu’à la fin de la scène. Cela ne remplace pas les caractéristiques de leurs Défenses actives et cesse pour un membre dont le lien est suspendu.",
    "effectDetails": "Pour 1 PA et 2 Aura, une fois par scène, les membres de votre Nœud peuvent utiliser la meilleure Défense occulte passive du groupe contre les effets mentaux ou perceptifs jusqu’à la fin de la scène. Cela ne remplace pas les caractéristiques de leurs Défenses actives et cesse pour un membre dont le lien est suspendu.\n\nLa meilleure valeur doit être réellement applicable à l’effet considéré ; les résistances conditionnelles ne deviennent pas des bonus universels. La durée de scène remplace la protection d’une seule Réaction.",
    "activation": "1 PA · 2 Aura · 1/scène",
    "access": "SR/R · 1 PA · 2 Aura · 1/scène"
  },
  "les_dix_sephiroth_kether_la_couronne_facette_unite_synchronisation": {
    "number": 13,
    "cost": 2,
    "effect": "Une fois par scène, pour 1 PA et 2 Aura, jusqu’à deux autres membres de votre Nœud peuvent agir immédiatement après vous dans la passe en cours. Ils doivent encore avoir leur action dans cette passe, la paient normalement et perdent leur ancien emplacement : aucune action supplémentaire.",
    "effectDetails": "Une fois par scène, pour 1 PA et 2 Aura, jusqu’à deux autres membres de votre Nœud peuvent agir immédiatement après vous dans la passe en cours. Ils doivent encore avoir leur action dans cette passe, la paient normalement et perdent leur ancien emplacement : aucune action supplémentaire.\n\nRemplace la micro-mobilité par une modification d’ordre d’action. Une passe ne peut être rejouée et une action déjà accomplie n’est pas récupérée.",
    "activation": "1 PA · 2 Aura · 1/scène",
    "access": "SR/R · 1 PA · 2 Aura · 1/scène"
  },
  "les_dix_sephiroth_hokhma_la_sagesse_facette_sagesse_vision_sereine": {
    "number": 14,
    "cost": 3,
    "effect": "Une fois par scène, pour 1 PA et 3 Aura, confrontez votre plan aux indices connus : le MJ indique une hypothèse contredite par ces indices et une vérification concrète possible. La première tentative pour effectuer cette vérification gagne +3.",
    "effectDetails": "Une fois par scène, pour 1 PA et 3 Aura, confrontez votre plan aux indices connus : le MJ indique une hypothèse contredite par ces indices et une vérification concrète possible. La première tentative pour effectuer cette vérification gagne +3.\n\nIl n’est plus nécessaire d’avoir découvert soi-même que le plan est faux. Aucune information impossible à déduire, fausse piste créée artificiellement ou solution automatique ; sans contradiction accessible, le MJ le signale.",
    "activation": "1 PA · 3 Aura · 1/scène",
    "access": "SR/R · 1 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_hokhma_la_sagesse_facette_purete_dissipation": {
    "number": 15,
    "cost": 1,
    "effect": "Pour 1 PA et 1 Aura, opposez Volonté + Maîtrise spirituelle à une pollution spirituelle ou un effet impur mineur pour le dissiper. Ce talent ne retire pas directement de points de Corruption et ne modifie aucune Nature fondamentale.",
    "effectDetails": "Pour 1 PA et 1 Aura, opposez Volonté + Maîtrise spirituelle à une pollution spirituelle ou un effet impur mineur pour le dissiper. Ce talent ne retire pas directement de points de Corruption et ne modifie aucune Nature fondamentale.",
    "activation": "1 PA · 1 Aura",
    "access": "SR/R · 1 PA · 1 Aura"
  },
  "les_dix_sephiroth_hokhma_la_sagesse_facette_purete_exorcisme_lumineux": {
    "number": 16,
    "cost": 3,
    "effect": "Une fois par scène, pour 3 PA et 3 Aura, tentez de libérer jusqu’à trois hôtes perçus à 5 m de possessions ou de parasites spirituels identifiés. Comparez votre même jet à chaque Puissance : chaque réussite expulse l’intrus sans blesser l’hôte, mais ne détruit pas l’entité ni une Nature.",
    "effectDetails": "Une fois par scène, pour 3 PA et 3 Aura, tentez de libérer jusqu’à trois hôtes perçus à 5 m de possessions ou de parasites spirituels identifiés. Comparez votre même jet à chaque Puissance : chaque réussite expulse l’intrus sans blesser l’hôte, mais ne détruit pas l’entité ni une Nature.\n\nLa portée de groupe et l’absence de dommage d’expulsion différencient le talent d’une purification individuelle. Plusieurs intrus distincts sur un même hôte restent des effets distincts, pas une purge universelle.",
    "activation": "3 PA · 3 Aura · 1/scène · 5 m",
    "access": "R · 3 PA · 3 Aura · 1/scène · 5 m"
  },
  "les_dix_sephiroth_bina_la_comprehension_facette_intellect_simulation": {
    "number": 17,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, une fois par scène, préparez avec un allié un risque précis et sa réponse. S’il survient pendant cette scène, le participant désigné peut effectuer gratuitement une Défense active ou une manipulation simple correspondant à cette réponse.",
    "effectDetails": "Pour 1 PA et 2 Aura, une fois par scène, préparez avec un allié un risque précis et sa réponse. S’il survient pendant cette scène, le participant désigné peut effectuer gratuitement une Défense active ou une manipulation simple correspondant à cette réponse.\n\nUn seul risque, une seule réponse et une seule utilisation ; le bénéficiaire peut être l’Angelus. Aucun bonus +3 en supplément : le bénéfice est la Réaction préparée sans PA, pas une attaque gratuite ni un tour supplémentaire. Le déclencheur doit être matériellement réalisable ; pas d’immunité à un danger imprévisible.",
    "activation": "1 PA · 2 Aura · 1/scène",
    "access": "SR/R · 1 PA · 2 Aura · 1/scène"
  },
  "les_dix_sephiroth_bina_la_comprehension_facette_intellect_planification_superieure": {
    "number": 18,
    "cost": 3,
    "effect": "Une fois par scénario, après une préparation réelle, identifiez avec le MJ deux risques prévisibles de l’opération. Jusqu’à trois participants briefés peuvent chacun relancer un échec non narratif répondant à l’un de ces risques pendant la scène d’exécution, en gardant le second résultat.",
    "effectDetails": "Une fois par scénario, après une préparation réelle, identifiez avec le MJ deux risques prévisibles de l’opération. Jusqu’à trois participants briefés peuvent chacun relancer un échec non narratif répondant à l’un de ces risques pendant la scène d’exécution, en gardant le second résultat.\n\nCoût d’Aura inchangé : aucun. Le plan et les participants sont fixés avant l’opération ; pas de connaissance de secrets impossibles à anticiper et pas de cumul de relances sur un même test.",
    "activation": "Préparation réelle · 1/scénario · sans Aura",
    "access": "SR/R · Préparation réelle · 1/scénario · sans Aura"
  },
  "les_dix_sephiroth_bina_la_comprehension_facette_destin_fenetre_du_destin": {
    "number": 19,
    "cost": 3,
    "effect": "Une fois par scène, pour 1 PA en Réaction et 3 Aura, un allié perçu à 10 m qui vient de subir un échec non narratif peut relancer son d10e et conserver le second résultat. Il ne repaie pas l’action, mais cette relance compte dans la limite d’un seul Talent de relance par test.",
    "effectDetails": "Une fois par scène, pour 1 PA en Réaction et 3 Aura, un allié perçu à 10 m qui vient de subir un échec non narratif peut relancer son d10e et conserver le second résultat. Il ne repaie pas l’action, mais cette relance compte dans la limite d’un seul Talent de relance par test.\n\nLa restriction « échec de 3 points ou moins » est supprimée ; l’action est rejugée avant application de ses conséquences, ce n’est plus une seconde action distincte qui contourne la règle des relances.",
    "activation": "Réaction · 1 PA · 3 Aura · 1/scène · 10 m",
    "access": "SR/R · Réaction · 1 PA · 3 Aura · 1/scène · 10 m"
  },
  "les_dix_sephiroth_bina_la_comprehension_facette_limitations_frontiere_de_bina": {
    "number": 20,
    "cost": 3,
    "effect": "Pour 2 PA et 3 Aura, une fois par scène, établissez pour la scène une frontière de 10 m de rayon interdisant au choix téléportation, intangibilité ou invisibilité surnaturelle. Toute tentative d’y utiliser le procédé choisi doit vaincre votre jet d’installation, alliés compris.",
    "effectDetails": "Pour 2 PA et 3 Aura, une fois par scène, établissez pour la scène une frontière de 10 m de rayon interdisant au choix téléportation, intangibilité ou invisibilité surnaturelle. Toute tentative d’y utiliser le procédé choisi doit vaincre votre jet d’installation, alliés compris.\n\nJet d’installation : Volonté + Maîtrise spirituelle + 1d10e ; la tentative oppose le jet approprié de sa source. La victoire permet cette tentative, pas la destruction automatique du champ. La frontière n’arrache pas une Nature passive et ne rematérialise pas rétroactivement un corps déjà intangible. L’ajout d’une opposition est une règle proposée.",
    "activation": "2 PA · 3 Aura · 1/scène",
    "access": "R · 2 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_hesed_la_misericorde_facette_misericorde_grace_accordee": {
    "number": 21,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, retirez à jusqu’à trois alliés perçus à 5 m un état temporaire de douleur, fatigue ou choc dont la cause active a cessé. Aucun PV n’est rendu et les minima imposés par les blessures ou un effet encore actif demeurent.",
    "effectDetails": "Pour 1 PA et 2 Aura, retirez à jusqu’à trois alliés perçus à 5 m un état temporaire de douleur, fatigue ou choc dont la cause active a cessé. Aucun PV n’est rendu et les minima imposés par les blessures ou un effet encore actif demeurent.\n\nLa différence nouvelle est le secours de groupe ; pas une guérison biologique définitive ni une suppression de toutes les blessures.",
    "activation": "1 PA · 2 Aura · 5 m",
    "access": "SR/R · 1 PA · 2 Aura · 5 m"
  },
  "les_dix_sephiroth_hesed_la_misericorde_facette_creativite_idee_feconde": {
    "number": 22,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, après un bref échange sur un problème créatif réel, jusqu’à trois alliés bénéficient de Prendre son temps sans délai sur leur prochaine tentative directement liée au problème. Les connaissances et moyens matériels nécessaires restent requis.",
    "effectDetails": "Pour 1 PA et 2 Aura, après un bref échange sur un problème créatif réel, jusqu’à trois alliés bénéficient de Prendre son temps sans délai sur leur prochaine tentative directement liée au problème. Les connaissances et moyens matériels nécessaires restent requis.\n\nL’avantage expire à la fin de la scène. Aucune seconde application équivalente sur un même test et aucun bonus de +3 ajouté arbitrairement à Prendre son temps.",
    "activation": "1 PA · 2 Aura",
    "access": "SR/R · 1 PA · 2 Aura"
  },
  "les_dix_sephiroth_hesed_la_misericorde_facette_creativite_etincelle_nouvelle": {
    "number": 23,
    "cost": 3,
    "effect": "Une fois par scène, pour 1 PA et 3 Aura, le MJ indique une approche inhabituelle réalisable avec vos connaissances et moyens disponibles. Le premier test directement destiné à la mettre en œuvre gagne 2 DR s’il réussit, maximum DR 5.",
    "effectDetails": "Une fois par scène, pour 1 PA et 3 Aura, le MJ indique une approche inhabituelle réalisable avec vos connaissances et moyens disponibles. Le premier test directement destiné à la mettre en œuvre gagne 2 DR s’il réussit, maximum DR 5.\n\nNe convertit pas un échec en réussite et ne crée aucun matériel, savoir ou nouveau pouvoir. La piste peut bénéficier à l’Angelus ou à un allié qui la comprend réellement.",
    "activation": "1 PA · 3 Aura · 1/scène",
    "access": "SR/R · 1 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_gueburah_la_force_facette_force_force_irresistible": {
    "number": 24,
    "cost": 3,
    "effect": "Une fois par scène, pour 1 PA et 3 Aura, vous ne pouvez être renversé ou déplacé de force par un effet de Puissance inférieure à 21 tant que vos appuis existent, jusqu’à la fin de la scène. Une attaque physique réussie de la scène gagne +3 DGT, à la place du +2 d’Impact de Gueburah s’il aurait été utilisé.",
    "effectDetails": "Une fois par scène, pour 1 PA et 3 Aura, vous ne pouvez être renversé ou déplacé de force par un effet de Puissance inférieure à 21 tant que vos appuis existent, jusqu’à la fin de la scène. Une attaque physique réussie de la scène gagne +3 DGT, à la place du +2 d’Impact de Gueburah s’il aurait été utilisé.\n\nLe +3 ne devient pas un bonus à toutes les attaques. Détruire l’appui, un effondrement ou une force majeure ne sont pas niés. La référence 21 reprend l’échelle commune « majeur » ; les effets ordinaires incapables de déplacer les appuis n’arrachent pas le personnage.",
    "activation": "1 PA · 3 Aura · 1/scène",
    "access": "R · 1 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_gueburah_la_force_facette_justice_proportion": {
    "number": 25,
    "cost": 1,
    "effect": "Lorsque vous mettez hors combat un agresseur identifié par une attaque directement contrôlée, vous pouvez le laisser à 0 PV, Stabilisé. Ce choix ne coûte ni PA supplémentaire ni Aura et ne contrôle pas les victimes d’une explosion ou d’un danger indirect.",
    "effectDetails": "Lorsque vous mettez hors combat un agresseur identifié par une attaque directement contrôlée, vous pouvez le laisser à 0 PV, Stabilisé. Ce choix ne coûte ni PA supplémentaire ni Aura et ne contrôle pas les victimes d’une explosion ou d’un danger indirect.\n\nCoût proposé : 1 PTV au lieu de 2 ; l’identité judiciaire et la condition d’agresseur sont conservées. On n’ajoute pas une action de combat ni une immunité aux dégâts ultérieurs.",
    "activation": "Sans PA ni Aura supplémentaires",
    "access": "SR/R · Sans PA ni Aura supplémentaires"
  },
  "les_dix_sephiroth_gueburah_la_force_facette_guerre_formation_celeste": {
    "number": 26,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, coordonnez jusqu’à trois alliés proches pour la scène : leur première Défense active physique de chaque round gagne +3 tant qu’ils restent chacun à 3 m d’un autre membre de la formation. Les PA de défense restent dus et les gênes ordinaires qu’ils se causent mutuellement sont ignorées.",
    "effectDetails": "Pour 1 PA et 2 Aura, coordonnez jusqu’à trois alliés proches pour la scène : leur première Défense active physique de chaque round gagne +3 tant qu’ils restent chacun à 3 m d’un autre membre de la formation. Les PA de défense restent dus et les gênes ordinaires qu’ils se causent mutuellement sont ignorées.\n\nPas de cumul avec une protection circonstancielle substantiellement équivalente ; la formation n’annule ni explosion ni tir traversant réellement un corps allié.",
    "activation": "1 PA · 2 Aura · scène",
    "access": "R · 1 PA · 2 Aura · scène"
  },
  "les_dix_sephiroth_gueburah_la_force_facette_guerre_redeploiement": {
    "number": 27,
    "cost": 3,
    "effect": "Une fois par scène, pour 2 PA et 3 Aura, jusqu’à trois alliés à 10 m choisissent chacun entre un Déplacement complet immédiat et une Défense active physique gratuite avant votre prochain round. Chaque allié n’utilise qu’une option, sans attaque gratuite ni réserve générale de PA.",
    "effectDetails": "Une fois par scène, pour 2 PA et 3 Aura, jusqu’à trois alliés à 10 m choisissent chacun entre un Déplacement complet immédiat et une Défense active physique gratuite avant votre prochain round. Chaque allié n’utilise qu’une option, sans attaque gratuite ni réserve générale de PA.\n\nUn déplacement reste physiquement possible et une défense ne devient pas autorisée en Surprise par ce seul effet. La Réaction spécialisée ne déclenche pas un nouveau gain de PA.",
    "activation": "2 PA · 3 Aura · 1/scène",
    "access": "R · 2 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_tiph_ereth_la_beaute_facette_foi_foi_partagee": {
    "number": 28,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, jusqu’à trois alliés perçus à 10 m gagnent +3 pour résister à peur, désespoir et contraintes visant à briser leur volonté jusqu’à la fin de la scène. Ce bonus ne se cumule pas avec une résistance affective équivalente déjà applicable.",
    "effectDetails": "Pour 1 PA et 2 Aura, jusqu’à trois alliés perçus à 10 m gagnent +3 pour résister à peur, désespoir et contraintes visant à briser leur volonté jusqu’à la fin de la scène. Ce bonus ne se cumule pas avec une résistance affective équivalente déjà applicable.",
    "activation": "1 PA · 2 Aura · scène",
    "access": "SR/R · 1 PA · 2 Aura · scène"
  },
  "les_dix_sephiroth_tiph_ereth_la_beaute_facette_devotion_communion": {
    "number": 29,
    "cost": 3,
    "effect": "Pour 1 PA, confiez jusqu’à 3 de vos Aura à un allié consentant à 10 m : un Angelus les reçoit dans la limite de sa réserve, un autre personnage reçoit une Égide prêtée pour la scène. Cette Égide ne peut servir qu’à absorber 2 dégâts spirituels par Aura confiée, avec le PA normal de Réaction.",
    "effectDetails": "Pour 1 PA, confiez jusqu’à 3 de vos Aura à un allié consentant à 10 m : un Angelus les reçoit dans la limite de sa réserve, un autre personnage reçoit une Égide prêtée pour la scène. Cette Égide ne peut servir qu’à absorber 2 dégâts spirituels par Aura confiée, avec le PA normal de Réaction.\n\nCoût conservé à 3 PTV : c’est l’ouverture aux autres Natures qui justifie le prix. Une Égide prêtée par personne à la fois, non cumulable ; elle n’emploie pas Égide renforcée du donneur, ne recharge pas un Mageius, ne protège pas des balles et ne peut être transférée de nouveau. L’Aura est réellement retirée du donneur ; aucune restitution d’un reste expiré.",
    "activation": "1 PA · transfert de 1 à 3 Aura · 10 m",
    "access": "SR/R · 1 PA · transfert de 1 à 3 Aura · 10 m"
  },
  "les_dix_sephiroth_tiph_ereth_la_beaute_facette_sacrifice_offrande": {
    "number": 30,
    "cost": 1,
    "effect": "Une fois par round, sans dépenser de PA, perdez 1 PV irréductible pour récupérer 2 Aura, sans dépasser votre maximum. Ce PV ne peut être récupéré avant la fin de la scène.",
    "effectDetails": "Une fois par round, sans dépenser de PA, perdez 1 PV irréductible pour récupérer 2 Aura, sans dépasser votre maximum. Ce PV ne peut être récupéré avant la fin de la scène.\n\nLe caractère gratuit est une proposition explicite de clarification. Les dégâts restent réels et ne sont ni absorbés par Égide ni rendus par la fin d’un effet ; la connexion coupée ne remplit pas gratuitement la réserve. Une seule Offrande par round, pas par action.",
    "activation": "Sans PA · 1 PV · 1/round",
    "access": "SR/R · Sans PA · 1 PV · 1/round"
  },
  "les_dix_sephiroth_tiph_ereth_la_beaute_facette_sacrifice_don_de_soi": {
    "number": 31,
    "cost": 2,
    "effect": "Pour 1 PA en Réaction et 1 Aura, prenez jusqu’à 5 des dégâts finaux d’un allié perçu à 10 m à sa place. Ces dégâts sont irréductibles pour vous et ne peuvent pas être transmis une seconde fois.",
    "effectDetails": "Pour 1 PA en Réaction et 1 Aura, prenez jusqu’à 5 des dégâts finaux d’un allié perçu à 10 m à sa place. Ces dégâts sont irréductibles pour vous et ne peuvent pas être transmis une seconde fois.\n\nLes dégâts sont répartis après les réductions de la victime ; aucune double application d’Armure, Égide ou d’une autre redirection sur le même dommage. Ce talent ne remplace pas les règles de Mort.",
    "activation": "Réaction · 1 PA · 1 Aura · 10 m",
    "access": "SR/R · Réaction · 1 PA · 1 Aura · 10 m"
  },
  "les_dix_sephiroth_nesah_la_victoire_facette_succes_inarretable": {
    "number": 32,
    "cost": 2,
    "effect": "Une fois par scène, pour 1 PA et 3 Aura, conservez les PA et progrès déjà investis dans une action longue malgré une interruption extérieure ou un échec intermédiaire, jusqu’à la fin de la scène. Vous pouvez la reprendre dès que les conditions le permettent ; un échec final n’est pas transformé en réussite.",
    "effectDetails": "Une fois par scène, pour 1 PA et 3 Aura, conservez les PA et progrès déjà investis dans une action longue malgré une interruption extérieure ou un échec intermédiaire, jusqu’à la fin de la scène. Vous pouvez la reprendre dès que les conditions le permettent ; un échec final n’est pas transformé en réussite.\n\nConserver des progrès ne fait pas agir en étant inconscient ou privé du matériel nécessaire ; aucune réserve nouvelle de PA. Une tentative entièrement résolue et échouée ne peut pas être recommencée gratuitement.",
    "activation": "1 PA · 3 Aura · 1/scène",
    "access": "SR/R · 1 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_nesah_la_victoire_facette_amour_lien_du_cur": {
    "number": 33,
    "cost": 1,
    "effect": "Avec une personne consentante envers laquelle existe une affection réelle, sentez son état émotionnel général à 100 m maximum, même sans la voir. Un seul lien de ce talent est actif ; ni pensée précise ni position ne sont révélées.",
    "effectDetails": "Avec une personne consentante envers laquelle existe une affection réelle, sentez son état émotionnel général à 100 m maximum, même sans la voir. Un seul lien de ce talent est actif ; ni pensée précise ni position ne sont révélées.\n\nAucun coût d’Aura ajouté ; caractère V/SR/R conservé. Une protection spirituelle adaptée peut isoler le lien.",
    "activation": "Lien consenti · 100 m",
    "access": "V/SR/R · Lien consenti · 100 m"
  },
  "les_dix_sephiroth_nesah_la_victoire_facette_amour_harmonie": {
    "number": 34,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, deux personnes consentantes réellement liées affectivement peuvent s’Assister aussi en combat pour la scène, avec +3 au lieu de +2. Chacune doit posséder la compétence pertinente et payer le PA d’Assistance ; une seule Assistance compte par test.",
    "effectDetails": "Pour 1 PA et 2 Aura, deux personnes consentantes réellement liées affectivement peuvent s’Assister aussi en combat pour la scène, avec +3 au lieu de +2. Chacune doit posséder la compétence pertinente et payer le PA d’Assistance ; une seule Assistance compte par test.\n\nLes bénéficiaires peuvent inclure l’Angelus. Le talent ne fait pas agir gratuitement le partenaire et ne permet pas de cumuler Harmonie avec une Assistance équivalente.",
    "activation": "1 PA · 2 Aura · scène",
    "access": "SR/R · 1 PA · 2 Aura · scène"
  },
  "les_dix_sephiroth_nesah_la_victoire_facette_sexualite_comprehension_du_desir": {
    "number": 35,
    "cost": 1,
    "effect": "Supprimez la difficulté de Détachement céleste pour comprendre désir, attirance et intimité, et gagnez +3 aux tests d’interprétation de ces motivations. Cela ne provoque aucun désir ni consentement et ne révèle pas automatiquement les secrets intimes.",
    "effectDetails": "Supprimez la difficulté de Détachement céleste pour comprendre désir, attirance et intimité, et gagnez +3 aux tests d’interprétation de ces motivations. Cela ne provoque aucun désir ni consentement et ne révèle pas automatiquement les secrets intimes.\n\nSensibilité mortelle garde sa portée générale ; le +3 spécialisé reste utile lorsque les deux talents sont acquis. Ce n’est pas un +3 universel de séduction.",
    "activation": "Passif",
    "access": "V/SR/R · Passif"
  },
  "les_dix_sephiroth_nesah_la_victoire_facette_sexualite_extase_apaisante": {
    "number": 36,
    "cost": 1,
    "effect": "Après une interaction intime réellement consentie et suffisamment longue, la cible peut sortir de Tendu ou récupérer 2 Aura si elle est Angelus. Une fois par scène par cible, sans geste opportuniste en combat ni dépassement du maximum d’Aura.",
    "effectDetails": "Après une interaction intime réellement consentie et suffisamment longue, la cible peut sortir de Tendu ou récupérer 2 Aura si elle est Angelus. Une fois par scène par cible, sans geste opportuniste en combat ni dépassement du maximum d’Aura.\n\nEffet conservé ; seul le coût passe de 2 à 1 PTV. L’accès V est conservé, ce qui distingue la récupération d’Aura de l’ouverture habituelle de l’Auréole ; les causes actives de Stress et minima de blessures restent applicables.",
    "activation": "Intimité consentie",
    "access": "V/SR/R · Intimité consentie"
  },
  "les_dix_sephiroth_nesah_la_victoire_facette_sexualite_union_de_nesah": {
    "number": 37,
    "cost": 3,
    "effect": "Après une véritable intimité consentie, chacun des deux partenaires peut relancer un test ayant subi un échec non narratif pour protéger directement l’autre pendant la prochaine scène, et conserve le second résultat. Un seul lien de ce talent est actif par personne et la relance ne se cumule pas avec une autre relance de Talent.",
    "effectDetails": "Après une véritable intimité consentie, chacun des deux partenaires peut relancer un test ayant subi un échec non narratif pour protéger directement l’autre pendant la prochaine scène, et conserve le second résultat. Un seul lien de ce talent est actif par personne et la relance ne se cumule pas avec une autre relance de Talent.\n\nPas seulement une défense : retenir l’autre au bord d’une chute ou neutraliser son agresseur immédiat peut convenir. Une justification lointaine de protection ne rend pas tous les tests éligibles ; ni compagnon gratuit ni action supplémentaire.",
    "activation": "Préparation intime consentie · prochaine scène",
    "access": "V/SR/R · Préparation intime consentie · prochaine scène"
  },
  "les_dix_sephiroth_hod_la_gloire_facette_gloire_heraut": {
    "number": 38,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, jusqu’à trois alliés qui perçoivent votre intervention gagnent +3 contre peur et intimidation jusqu’à la fin de la scène. Une protection affective équivalente ne se cumule pas avec ce bonus.",
    "effectDetails": "Pour 1 PA et 2 Aura, jusqu’à trois alliés qui perçoivent votre intervention gagnent +3 contre peur et intimidation jusqu’à la fin de la scène. Une protection affective équivalente ne se cumule pas avec ce bonus.\n\nLa différence avec Foi partagée relève du Sephira et du contexte ; un personnage ne possède pas normalement les deux Sephiroth, donc ce parallèle n’exige pas une refonte artificielle.",
    "activation": "1 PA · 2 Aura · scène",
    "access": "SR/R · 1 PA · 2 Aura · scène"
  },
  "les_dix_sephiroth_hod_la_gloire_facette_gloire_presence_glorieuse": {
    "number": 39,
    "cost": 3,
    "effect": "Une fois par scène, pour 2 PA et 3 Aura, votre présence impose une véritable audience à un public capable de vous percevoir : ceux qui veulent vous écarter sans vous écouter opposent leur Défense occulte à votre Charisme + Autorité. Pour la scène, vos tests sociaux adressés à ce public gagnent +3, sans imposer l’accord, la soumission ou l’arrêt d’un combat.",
    "effectDetails": "Une fois par scène, pour 2 PA et 3 Aura, votre présence impose une véritable audience à un public capable de vous percevoir : ceux qui veulent vous écarter sans vous écouter opposent leur Défense occulte à votre Charisme + Autorité. Pour la scène, vos tests sociaux adressés à ce public gagnent +3, sans imposer l’accord, la soumission ou l’arrêt d’un combat.\n\nL’audience suffit à exposer une intervention cohérente, pas à retenir indéfiniment le public. Les personnes en danger immédiat peuvent se protéger et partir. C’est un renforcement surnaturel explicite ; il ne modifie pas la Renommée permanente ni les récompenses MJ.",
    "activation": "2 PA · 3 Aura · 1/scène",
    "access": "R · 2 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_hod_la_gloire_facette_science_analyse_fonctionnelle": {
    "number": 40,
    "cost": 1,
    "effect": "Après 1 PA d’observation d’un dispositif que vos connaissances permettent réellement d’analyser, gagnez +3 au diagnostic de sa panne ou de son point faible. Une réussite indique quel élément accessible examiner ou manipuler pour confirmer ce diagnostic.",
    "effectDetails": "Après 1 PA d’observation d’un dispositif que vos connaissances permettent réellement d’analyser, gagnez +3 au diagnostic de sa panne ou de son point faible. Une réussite indique quel élément accessible examiner ou manipuler pour confirmer ce diagnostic.\n\nPas de connaissance d’une technologie entièrement étrangère, de vision des circuits à travers les murs ou de diagnostic omniscient. Le bonus ne se cumule pas avec Illumination sur le même test ; l’intérêt supplémentaire est sa répétabilité sans Aura et l’exploitation précise du diagnostic.",
    "activation": "1 PA · examen technique",
    "access": "V/SR/R · 1 PA · examen technique"
  },
  "les_dix_sephiroth_hod_la_gloire_facette_science_optimisation": {
    "number": 41,
    "cost": 2,
    "effect": "Après quelques minutes de travail et 2 Aura, un dispositif que vous comprenez confère +3 à ses utilisations pertinentes jusqu’à la fin de la scène. Vous ne pouvez maintenir qu’un dispositif optimisé à la fois ; aucune statistique permanente n’est augmentée.",
    "effectDetails": "Après quelques minutes de travail et 2 Aura, un dispositif que vous comprenez confère +3 à ses utilisations pertinentes jusqu’à la fin de la scène. Vous ne pouvez maintenir qu’un dispositif optimisé à la fois ; aucune statistique permanente n’est augmentée.\n\nLe dispositif doit être réel et accessible ; le bonus concerne ses usages effectivement améliorés, pas toutes les compétences du porteur. Aucun cumul avec une amélioration équivalente et aucun effet conservé par export, rechargement ou changement de propriétaire.",
    "activation": "Préparation · 2 Aura · scène",
    "access": "V/SR/R · Préparation · 2 Aura · scène"
  },
  "les_dix_sephiroth_hod_la_gloire_facette_science_solution_de_terrain": {
    "number": 42,
    "cost": 3,
    "effect": "Une fois par scénario, assemblez ou remettez en fonctionnement en 1 PA un outil spécialisé temporaire qui demanderait normalement une véritable préparation technique. Les composants, connaissances et test technique restent requis ; l’outil fonctionne jusqu’à la fin de la scène.",
    "effectDetails": "Une fois par scénario, assemblez ou remettez en fonctionnement en 1 PA un outil spécialisé temporaire qui demanderait normalement une véritable préparation technique. Les composants, connaissances et test technique restent requis ; l’outil fonctionne jusqu’à la fin de la scène.\n\nLe bénéfice est le temps miraculeusement gagné. Pas de matériaux créés, d’artefact, de technologie incomprise ou de marchandise revendable ; les composants réels restent ceux de l’opération.",
    "activation": "1 PA · 1/scénario",
    "access": "V/SR/R · 1 PA · 1/scénario"
  },
  "les_dix_sephiroth_hod_la_gloire_facette_savoir_evidence_revelee": {
    "number": 43,
    "cost": 3,
    "effect": "Une fois par scène, pour 1 PA et 3 Aura, faites apparaître une déduction nouvelle réellement fondée sur les informations réunies. Jusqu’à trois participants qui comprennent cette déduction gagnent +3 à leur premier test qui l’exploite directement pendant la scène.",
    "effectDetails": "Une fois par scène, pour 1 PA et 3 Aura, faites apparaître une déduction nouvelle réellement fondée sur les informations réunies. Jusqu’à trois participants qui comprennent cette déduction gagnent +3 à leur premier test qui l’exploite directement pendant la scène.\n\nAucun indice inventé, secret inaccessible ou réussite automatique. La distinction avec Mémoire lumineuse est la mise en relation et la transmission exploitable, pas le simple rappel.",
    "activation": "1 PA · 3 Aura · 1/scène",
    "access": "SR/R · 1 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_yessod_la_fondation_facette_reves_visiteur_de_songes": {
    "number": 44,
    "cost": 1,
    "effect": "Pendant votre sommeil ou une méditation prolongée, rejoignez le rêve d’une personne endormie et consentante à 10 m maximum. Vous pouvez y dialoguer, mais n’accédez pas de force à ses souvenirs et revenez si elle se réveille ou rompt le contact.",
    "effectDetails": "Pendant votre sommeil ou une méditation prolongée, rejoignez le rêve d’une personne endormie et consentante à 10 m maximum. Vous pouvez y dialoguer, mais n’accédez pas de force à ses souvenirs et revenez si elle se réveille ou rompt le contact.\n\nAucun coût d’Aura ajouté ; le passage reste un échange onirique, pas une téléportation corporelle ou un moyen d’agir physiquement pendant le sommeil.",
    "activation": "Sommeil ou méditation · 10 m",
    "access": "SR/R · Sommeil ou méditation · 10 m"
  },
  "les_dix_sephiroth_yessod_la_fondation_facette_reves_prison_onirique": {
    "number": 45,
    "cost": 2,
    "effect": "Une fois par scène, pour 1 PA et 2 Aura, enfermez pour la scène une cible déjà endormie dans son rêve après opposition occulte. Un événement extérieur violent lui permet une nouvelle résistance pour se réveiller ; le talent n’endort pas une cible éveillée.",
    "effectDetails": "Une fois par scène, pour 1 PA et 2 Aura, enfermez pour la scène une cible déjà endormie dans son rêve après opposition occulte. Un événement extérieur violent lui permet une nouvelle résistance pour se réveiller ; le talent n’endort pas une cible éveillée.\n\nCoût : 2 PTV au lieu de 3, 2 Aura au lieu de 3, fréquence scène au lieu de scénario ; portée 20 m. Le critère d’un effet mental profond reste possible uniquement s’il a déjà placé la cible dans un état équivalent permettant ce contact, pas une simple distraction.",
    "activation": "1 PA · 2 Aura · 1/scène · 20 m",
    "access": "SR/R · 1 PA · 2 Aura · 1/scène · 20 m"
  },
  "les_dix_sephiroth_yessod_la_fondation_facette_illusion_fantasmagorie_celeste": {
    "number": 46,
    "cost": 1,
    "effect": "Pour 1 PA et 1 Aura, créez pour la scène une illusion extérieure mobile, multisensorielle et de taille humaine à 20 m maximum. Un observateur qui l’examine oppose sa Perception à votre jet ; elle n’exerce aucune force réelle ni dégât matériel.",
    "effectDetails": "Pour 1 PA et 1 Aura, créez pour la scène une illusion extérieure mobile, multisensorielle et de taille humaine à 20 m maximum. Un observateur qui l’examine oppose sa Perception à votre jet ; elle n’exerce aucune force réelle ni dégât matériel.\n\nImage pensée conserve ses formes simples, statiques ou répétitives. Les perceptions surnaturelles adaptées s’appliquent ; voir une illusion ne donne pas automatiquement une résistance répétée à chaque seconde. Les capteurs suivent les composantes réellement simulées.",
    "activation": "1 PA · 1 Aura · 20 m · scène",
    "access": "SR/R · 1 PA · 1 Aura · 20 m · scène"
  },
  "les_dix_sephiroth_yessod_la_fondation_facette_illusion_monde_trompeur": {
    "number": 47,
    "cost": 3,
    "effect": "Pour 3 PA et 3 Aura, une fois par scène, transformez pour la scène l’apparence perceptive d’une zone de 10 m de rayon située à 20 m maximum. Un seul jet sert de référence aux observateurs qui résistent ; les murs et créatures illusoires n’ont ni masse ni actions propres.",
    "effectDetails": "Pour 3 PA et 3 Aura, une fois par scène, transformez pour la scène l’apparence perceptive d’une zone de 10 m de rayon située à 20 m maximum. Un seul jet sert de référence aux observateurs qui résistent ; les murs et créatures illusoires n’ont ni masse ni actions propres.\n\nLes détails et sens simulés restent cohérents avec Fantasmagorie céleste. Aucun double combattant, faux plancher porteur ni dégât gratuit ; les effets matériels relèvent de l’Imagination.",
    "activation": "3 PA · 3 Aura · 1/scène",
    "access": "R · 3 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_yessod_la_fondation_facette_imagination_esquisse_lumineuse": {
    "number": 48,
    "cost": 1,
    "effect": "Pour 1 PA et 1 Aura, projetez pour la scène une maquette lumineuse précise d’un objet ou d’un plan que vous comprenez réellement. Son étude apporte +3 aux tests de conception, comparaison ou diagnostic directement fondés sur ce modèle ; une seule maquette active.",
    "effectDetails": "Pour 1 PA et 1 Aura, projetez pour la scène une maquette lumineuse précise d’un objet ou d’un plan que vous comprenez réellement. Son étude apporte +3 aux tests de conception, comparaison ou diagnostic directement fondés sur ce modèle ; une seule maquette active.\n\nLe modèle est librement dessiné et animé à portée de perception, mais il n’invente aucun détail inconnu. Il n’accorde ni bonus universel de combat ni plan parfait d’une installation jamais examinée : le bénéfice est un outil mental collectif exploitable.",
    "activation": "1 PA · 1 Aura · scène",
    "access": "SR/R · 1 PA · 1 Aura · scène"
  },
  "les_dix_sephiroth_yessod_la_fondation_facette_imagination_idee_incarnee": {
    "number": 49,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, créez pour la scène une forme semi-solide de 3 m maximum remplissant une fonction simple : marche, corde, plateforme ou petit outil. Elle peut soutenir jusqu’à 200 kg et possède 6 PV sans Armure ; aucune attaque ou action autonome.",
    "effectDetails": "Pour 1 PA et 2 Aura, créez pour la scène une forme semi-solide de 3 m maximum remplissant une fonction simple : marche, corde, plateforme ou petit outil. Elle peut soutenir jusqu’à 200 kg et possède 6 PV sans Armure ; aucune attaque ou action autonome.\n\nLa forme doit apparaître dans un espace libre et respecter la fonction définie. Un support doit posséder des ancrages cohérents ; il ne déplace pas gratuitement sa charge et ne forme pas une prison inviolable autour d’un adversaire.",
    "activation": "1 PA · 2 Aura · scène",
    "access": "R · 1 PA · 2 Aura · scène"
  },
  "les_dix_sephiroth_yessod_la_fondation_facette_imagination_reve_rendu_reel": {
    "number": 50,
    "cost": 3,
    "effect": "Pour 2 PA et 3 Aura, une fois par scène, créez pour la scène un auxiliaire solide de taille humaine, mobile et capable d’une seule tâche définie, avec 10 PV et Armure 3. Ses actions tactiques utilisent vos PA ; il ne possède ni attaque autonome, ni pouvoir copié, ni intelligence polyvalente.",
    "effectDetails": "Pour 2 PA et 3 Aura, une fois par scène, créez pour la scène un auxiliaire solide de taille humaine, mobile et capable d’une seule tâche définie, avec 10 PV et Armure 3. Ses actions tactiques utilisent vos PA ; il ne possède ni attaque autonome, ni pouvoir copié, ni intelligence polyvalente.\n\nRépertoire à convenir avant acquisition : porteur (charge 200 kg), manipulateur simple ou rempart mobile, par exemple. Rayon de contrôle 30 m ; mobilité normale d’un personnage, sans vol implicite. Pour une tâche incertaine, le créateur emploie sa propre Compétence pertinente, pas un profil expert inventé ; un seul auxiliaire actif, pas de PA indépendants. Les paramètres de l’auxiliaire doivent être inscrits sur la fiche.",
    "activation": "2 PA · 3 Aura · 1/scène",
    "access": "R · 2 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_malkhouth_le_royaume_facette_mort_main_psychopompe": {
    "number": 51,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura auprès d’un mort récent, retenez son âme jusqu’à dix minutes et opposez votre jet aux tentatives de capture spirituelle. Cela n’accorde ni résurrection, ni contrôle, ni accès automatique au retour d’un Daemon vers sa Divinité ou d’un Angelus vers l’Arbre.",
    "effectDetails": "Pour 1 PA et 2 Aura auprès d’un mort récent, retenez son âme jusqu’à dix minutes et opposez votre jet aux tentatives de capture spirituelle. Cela n’accorde ni résurrection, ni contrôle, ni accès automatique au retour d’un Daemon vers sa Divinité ou d’un Angelus vers l’Arbre.\n\nLa rétention ne fait pas parler automatiquement l’âme et n’empêche pas toute puissance supérieure d’intervenir. Fenêtre de dix minutes ; aucun revenu d’Aura ni conservation illimitée.",
    "activation": "1 PA · 2 Aura · 10 minutes",
    "access": "SR/R · 1 PA · 2 Aura · 10 minutes"
  },
  "les_dix_sephiroth_malkhouth_le_royaume_facette_monde_physique_densite": {
    "number": 52,
    "cost": 2,
    "effect": "Pour 1 PA et 2 Aura, votre corps gagne Armure corporelle 3 contre les dégâts physiques jusqu’à la fin de la scène. Elle se cumule avec une Armure portée compatible, mais seule la meilleure couche corporelle s’applique.",
    "effectDetails": "Pour 1 PA et 2 Aura, votre corps gagne Armure corporelle 3 contre les dégâts physiques jusqu’à la fin de la scène. Elle se cumule avec une Armure portée compatible, mais seule la meilleure couche corporelle s’applique.\n\nLa durée de scène est le renforcement ; le cumul corporel/porté applique la règle commune explicite. Pas de cumul avec une autre Armure corporelle 3/4/6 ni de réduction des PV sacrifiés.",
    "activation": "1 PA · 2 Aura · scène",
    "access": "R · 1 PA · 2 Aura · scène"
  },
  "les_dix_sephiroth_malkhouth_le_royaume_facette_monde_physique_realite_verrouillee": {
    "number": 53,
    "cost": 3,
    "effect": "Pour 2 PA et 3 Aura, une fois par scène, ancrez une zone de 10 m de rayon jusqu’à la fin de la scène. Devenir intangible ou se téléporter dans, vers ou hors de cette zone demande de vaincre votre jet d’installation, alliés compris.",
    "effectDetails": "Pour 2 PA et 3 Aura, une fois par scène, ancrez une zone de 10 m de rayon jusqu’à la fin de la scène. Devenir intangible ou se téléporter dans, vers ou hors de cette zone demande de vaincre votre jet d’installation, alliés compris.\n\nN’annule pas une intangibilité déjà active, ne force pas une créature à prendre un corps et ne bloque pas l’invisibilité. Bina conserve le choix de l’invisibilité ; Malkhouth ancre les deux procédés de déplacement incorporel. Une réussite adverse autorise sa tentative sans détruire tout le champ.",
    "activation": "2 PA · 3 Aura · 1/scène",
    "access": "R · 2 PA · 3 Aura · 1/scène"
  },
  "les_dix_sephiroth_malkhouth_le_royaume_facette_poids_fardeau": {
    "number": 54,
    "cost": 1,
    "effect": "Pour 1 PA et 1 Aura, opposez Volonté + Maîtrise spirituelle à la Défense occulte d’une cible : ses déplacements sont divisés par deux et ses tests de mobilité subissent −3 jusqu’à la fin de son prochain round. Les ralentissements équivalents ne se multiplient pas.",
    "effectDetails": "Pour 1 PA et 1 Aura, opposez Volonté + Maîtrise spirituelle à la Défense occulte d’une cible : ses déplacements sont divisés par deux et ses tests de mobilité subissent −3 jusqu’à la fin de son prochain round. Les ralentissements équivalents ne se multiplient pas.\n\nPortée 20 m ; aucun dégât automatique, immobilisation totale ou interdiction de téléportation.",
    "activation": "1 PA · 1 Aura · 20 m",
    "access": "SR/R · 1 PA · 1 Aura · 20 m"
  },
  "les_dix_sephiroth_malkhouth_le_royaume_facette_poids_poids_du_royaume": {
    "number": 55,
    "cost": 3,
    "effect": "Pour 2 PA et 3 Aura, une fois par scène, alourdissez pour la scène une zone de 10 m de rayon à 30 m maximum. Les ennemis qui échouent à l’opposition occulte voient leurs déplacements divisés par deux et ne peuvent plus gagner d’altitude dans la zone, sans chute ou dégât automatiques.",
    "effectDetails": "Pour 2 PA et 3 Aura, une fois par scène, alourdissez pour la scène une zone de 10 m de rayon à 30 m maximum. Les ennemis qui échouent à l’opposition occulte voient leurs déplacements divisés par deux et ne peuvent plus gagner d’altitude dans la zone, sans chute ou dégât automatiques.\n\nUn seul jet d’installation, pas de nouvelle attaque gratuite à chaque round. Les obstacles réellement produits affectent le terrain ; ne pas cumuler un même ralentissement en ×4. Le talent n’interdit ni téléportation ni passage intangible, rôle de Réalité verrouillée.",
    "activation": "2 PA · 3 Aura · 1/scène",
    "access": "R · 2 PA · 3 Aura · 1/scène"
  }
};
export function applyAngelusRevisions<T extends {id:string}>(catalog:readonly T[]){return catalog.map(row=>angelusRevisions[row.id]?{...row,...angelusRevisions[row.id]}:row);}
