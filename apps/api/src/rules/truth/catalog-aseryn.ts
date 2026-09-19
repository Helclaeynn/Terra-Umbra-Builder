// Generated from the final V1 Builder runtime audit. Do not hand-edit.
export const truthCatalogAseryn = [
  {
    "id": "aseryn_routes_communes_aserynes_vivacite_aseryne_depart_fulgurant",
    "name": "Départ fulgurant",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Routes communes aserynes › Vivacité aseryne",
    "effect": "SR/R — Passif Après avoir déterminé normalement le nombre de PA du personnage, ajoutez +3 à son score d'Initiative uniquement pour déterminer son ordre d'action dans les passes. Ce bonus ne modifie jamais le nombre de PA obtenu.",
    "runtimeLore": "La vivacité aseryne se voit d’abord dans l’instant où le personnage entre réellement dans l’action. Son système nerveux place sa décision plus tôt dans la séquence du combat, sans lui donner davantage de gestes qu’il n’en possède."
  },
  {
    "id": "aseryn_routes_communes_aserynes_vivacite_aseryne_reflexe_impossible",
    "name": "Réflexe impossible",
    "cost": 2,
    "access": "SR/R",
    "prerequisiteName": "Départ fulgurant",
    "group": "Routes communes aserynes › Vivacité aseryne",
    "effect": "Prérequis : Départ fulgurant | SR/R — Réaction Lorsqu’il est Surpris, l’Aseryn peut malgré tout dépenser 1 PA pour effectuer une Défense active contre une attaque dont il a conscience. Il reste Surpris pour les autres effets applicables.",
    "runtimeLore": "Même surpris, un Aseryn peut parfois arracher au système nerveux le temps d’une vraie défense. La stupeur existe encore, mais l’attaque consciente rencontre un réflexe impossible qui refuse de rester entièrement passif."
  },
  {
    "id": "aseryn_routes_communes_aserynes_vivacite_aseryne_surcadence_nerveuse",
    "name": "Surcadence nerveuse",
    "cost": 3,
    "access": "SR/R",
    "prerequisiteName": "Réflexe impossible",
    "group": "Routes communes aserynes › Vivacité aseryne",
    "effect": "Prérequis : Réflexe impossible | SR/R — Réaction — 1/Scène L'Aseryn gagne immédiatement 1 PA utilisable avant la fin du round. Ce PA ne peut servir qu'à un Déplacement, une Défense active ou une action significative non offensive. Il ne peut pas servir à attaquer, activer un pouvoir offensif ou déclencher une chaîne de gains de PA.",
    "runtimeLore": "Une fois par scène, le corps peut ouvrir une réserve nerveuse normalement gardée hors d’atteinte. Ce surcroît sert à bouger, esquiver ou accomplir une action non offensive urgente, accélération brève plutôt qu’une frénésie de coups supplémentaires."
  },
  {
    "id": "aseryn_routes_communes_aserynes_esprit_fulgurant_traitement_accelere",
    "name": "Traitement accéléré",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Routes communes aserynes › Esprit fulgurant",
    "effect": "SR/R — 1/Scène Sur une tâche intellectuelle où le temps supplémentaire ne sert qu'à réfléchir, calculer ou comparer des informations déjà disponibles, l'Aseryn peut bénéficier de Prendre son temps sans consommer le délai supplémentaire.",
    "runtimeLore": "Pour l’Aseryn, certaines longues réflexions ne sont longues que parce qu’un cerveau ordinaire traite les étapes l’une après l’autre. Le traitement accéléré comprime ce temps sans fournir la moindre information qui n’était pas déjà disponible."
  },
  {
    "id": "aseryn_routes_communes_aserynes_esprit_fulgurant_pensee_parallele",
    "name": "Pensée parallèle",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Routes communes aserynes › Esprit fulgurant",
    "effect": "SR/R — Passif L'Aseryn peut conserver une activité mentale simple en arrière-plan pendant qu'il agit : garder un compte, suivre plusieurs communications, poursuivre une comparaison simple ou maintenir un bref échange Accelyr. Cela n'autorise jamais deux tests simultanés, deux actions, deux pouvoirs maintenus ou deux concentrations complexes.",
    "runtimeLore": "Une partie de la pensée aseryne peut rester active en arrière-plan comme une note tenue. Compte, comparaison ou échange simple continue pendant l’action principale, sans jamais devenir une seconde concentration complexe dissimulée."
  },
  {
    "id": "aseryn_routes_communes_aserynes_esprit_fulgurant_decision_fulgurante",
    "name": "Décision fulgurante",
    "cost": 2,
    "access": "SR/R",
    "prerequisiteName": "Traitement accéléré",
    "group": "Routes communes aserynes › Esprit fulgurant",
    "effect": "Prérequis : Traitement accéléré | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur Esprit, relancez le 1d10e et conservez le second résultat.",
    "runtimeLore": "L’Esprit fulgurant sait parfois retrouver la bonne voie après qu’une première conclusion vient de céder. L’échec intellectuel n’est pas effacé : il provoque une reprise immédiate du raisonnement avant que l’erreur ne se fige."
  },
  {
    "id": "aseryn_routes_communes_aserynes_perception_electromagnetique_lecture_de_champ",
    "name": "Lecture de champ",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Routes communes aserynes › Perception électromagnétique",
    "effect": "SR/R Lors d'une utilisation focalisée du Sens électromagnétique, l'Aseryn bénéficie de +3 pour déterminer la nature, l'intensité et l'origine probable d'un phénomène électromagnétique.",
    "runtimeLore": "Un champ électromagnétique possède intensité, direction et texture. L’Aseryn entraîné ne se contente plus de le sentir : il distingue suffisamment ses propriétés pour estimer quel type de source pourrait l’avoir produit."
  },
  {
    "id": "aseryn_routes_communes_aserynes_perception_electromagnetique_cartographie_inductive",
    "name": "Cartographie inductive",
    "cost": 2,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Routes communes aserynes › Perception électromagnétique",
    "effect": "SR/R — 1 PA Dans un rayon d'environ 10 m, l'Aseryn peut dresser une cartographie grossière des câbles actifs, machines alimentées et principales sources électromagnétiques à travers des obstacles ordinaires. Il n'en lit ni le contenu ni la fonction exacte.",
    "runtimeLore": "Les réseaux électriques dessinent une géographie invisible. En lisant l’induction à travers les obstacles ordinaires, l’Aseryn obtient le relief grossier des câbles actifs, machines alimentées et foyers électromagnétiques sans savoir encore ce qu’ils font."
  },
  {
    "id": "aseryn_routes_communes_aserynes_perception_electromagnetique_signature_electrique",
    "name": "Signature électrique",
    "cost": 2,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Routes communes aserynes › Perception électromagnétique",
    "effect": "SR/R Après avoir étudié une machine, un artefact alimenté ou une source énergétique, l'Aseryn peut mémoriser sa signature électromagnétique et la reconnaître ultérieurement si elle reste suffisamment similaire.",
    "runtimeLore": "Une machine alimentée possède une signature aussi reconnaissable qu’un bruit de moteur. Après l’avoir étudiée, l’Aseryn peut la retrouver plus tard tant que ses caractéristiques électriques n’ont pas été profondément modifiées."
  },
  {
    "id": "aseryn_routes_communes_aserynes_perception_electromagnetique_perception_neuromotrice",
    "name": "Perception neuromotrice",
    "cost": 3,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Routes communes aserynes › Perception électromagnétique",
    "effect": "SR/R À très courte portée, lorsqu'il sait qu'une cible est présente, l'Aseryn peut percevoir le déclenchement de mouvements reposant sur une activité nerveuse ou électromécanique détectable. Les pénalités provenant uniquement de l'impossibilité de voir son mouvement ne s'appliquent pas à ses Défenses contre elle. Une fois par scène, il peut en outre recevoir +3 à une Défense active contre une telle cible. Blindage, brouillage ou absence de signature pertinente peuvent neutraliser ce Talent.",
    "runtimeLore": "Avant qu’un muscle ou un moteur ne bouge franchement, une activité électrique a souvent déjà commencé. À très courte portée, l’Aseryn lit ce prélude et peut défendre son corps contre un mouvement que ses yeux n’auraient pas encore eu le temps d’interpréter."
  },
  {
    "id": "aseryn_origines_jouables_aerilien_neo_atlante_empreinte_resonance_d_aer_lecture_des_flux",
    "name": "Lecture des flux",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Aérilien / Néo-Atlante › Empreinte — Résonance d’Aèr",
    "effect": "SR/R — 1 PA Esprit + Perception permet de distinguer la grande nature d'une manifestation : sort actif, rituel, objet imprégné, lieu saturé, portail, etc. Le DR augmente la précision sans révéler automatiquement l'auteur ou tous les mécanismes.",
    "runtimeLore": "Les flux magiques ont des comportements assez différents pour qu’un Aérilien entraîné en distingue les grandes catégories. Il reconnaît rituel, objet imprégné, portail ou lieu saturé sans recevoir pour autant le dossier complet de leur origine."
  },
  {
    "id": "aseryn_origines_jouables_aerilien_neo_atlante_empreinte_resonance_d_aer_memoire_de_resonance",
    "name": "Mémoire de résonance",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Aérilien / Néo-Atlante › Empreinte — Résonance d’Aèr",
    "effect": "SR/R Après avoir étudié une signature magique directement perceptible, l'Aérilien peut reconnaître ultérieurement la même signature ou la même source si elle n'a pas été profondément altérée.",
    "runtimeLore": "Une signature magique étudiée peut être mémorisée comme on retient une voix. Si la source n’a pas été profondément transformée, l’Aérilien reconnaît plus tard la même résonance même dans un contexte différent."
  },
  {
    "id": "aseryn_origines_jouables_aerilien_neo_atlante_empreinte_resonance_d_aer_ancrage_d_aer",
    "name": "Ancrage d’Aèr",
    "cost": 2,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Aérilien / Néo-Atlante › Empreinte — Résonance d’Aèr",
    "effect": "SR/R — Réaction — 1/Scène Après un échec non narratif à une défense occulte contre un effet explicitement magique ou lié à un Mageius, relancez le 1d10e et conservez le second résultat.",
    "runtimeLore": "La résonance d’Aèr demeure chez certains Aéryliens comme un point d’ancrage face à la magie et au Mageius. Lorsqu’une défense occulte vient tout juste de céder, cet héritage permet à l’esprit de se replacer une fois dans son accord d’origine."
  },
  {
    "id": "aseryn_origines_jouables_mulien_empreinte_etincelle_psychique_telepathie_mulienne",
    "name": "Télépathie mûlienne",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Mûlien › Empreinte — Étincelle psychique",
    "effect": "SR/R — 1 PA — Scène L'Étincelle psychique devient une communication bidirectionnelle avec une cible consentante, tant que les conditions de portée et de contact mental sont maintenues.",
    "runtimeLore": "Chez le Mûlien, la communication mentale devient réellement bidirectionnelle lorsqu’une cible accepte le lien. Deux consciences peuvent alors échanger directement, sans que cette proximité autorise l’une à fouiller automatiquement l’autre."
  },
  {
    "id": "aseryn_origines_jouables_mulien_empreinte_etincelle_psychique_perception_mentale",
    "name": "Perception mentale",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Mûlien › Empreinte — Étincelle psychique",
    "effect": "SR/R — 1 PA Esprit + Perception permet de sentir approximativement la présence de consciences proches. Le Talent ne révèle ni pensées ni identité et ne produit pas une cartographie exacte à travers les murs. Une dissimulation ou défense occulte peut s'y opposer.",
    "runtimeLore": "L’Étincelle psychique ressent la présence de consciences proches comme des foyers dans un espace mental. Elle indique qu’un esprit est là sans dessiner son visage, son nom ni sa pensée sur une carte intérieure parfaite."
  },
  {
    "id": "aseryn_origines_jouables_mulien_empreinte_etincelle_psychique_effleurement_de_pensee",
    "name": "Effleurement de pensée",
    "cost": 2,
    "access": "SR/R",
    "prerequisiteName": "Télépathie mûlienne",
    "group": "Origines jouables › Mûlien › Empreinte — Étincelle psychique",
    "effect": "Prérequis : Télépathie mûlienne | SR/R — 1 PA Volonté + Maîtrise spirituelle contre la Défense occulte de la cible. En réussite, le Mûlien perçoit la pensée consciente dominante ou l'intention immédiate, jamais des souvenirs complets, des secrets profonds ou l'ensemble de l'esprit.",
    "runtimeLore": "La télépathie mûlienne commence par un contact avec ce qui occupe déjà la conscience. Une pensée dominante ou une intention immédiate peut affleurer, mais la profondeur biographique d’un esprit reste derrière d’autres portes."
  },
  {
    "id": "aseryn_origines_jouables_mulien_empreinte_etincelle_psychique_reseau_mulien",
    "name": "Réseau mûlien",
    "cost": 3,
    "access": "SR/R",
    "prerequisiteName": "Télépathie mûlienne",
    "group": "Origines jouables › Mûlien › Empreinte — Étincelle psychique",
    "effect": "Prérequis : Télépathie mûlienne | SR/R — 1 PA — Scène Jusqu'à trois participants consentants peuvent partager un réseau mental tant qu'ils restent dans la même zone opérationnelle et que la liaison n'est pas rompue.",
    "runtimeLore": "Plusieurs esprits consentants peuvent former un réseau de conversation mentale. Chacun reste lui-même, mais paroles et signaux n’ont plus besoin d’air ni de gestes tant que le lien mûlien demeure ouvert entre eux."
  },
  {
    "id": "aseryn_origines_jouables_hyperboreen_empreinte_corps_hyperboreen_detente_hyperboreenne",
    "name": "Détente hyperboréenne",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Hyperboréen › Empreinte — Corps hyperboréen",
    "effect": "SR/R — 1/round Lors d'un Déplacement, l'Hyperboréen peut parcourir 2 m supplémentaires. Ce bonus est additif, jamais multiplicatif.",
    "runtimeLore": "La détente hyperboréenne transforme le déplacement en succession d’appuis puissants. Quelques mètres supplémentaires apparaissent non par téléportation, mais parce que chaque poussée du corps exploite toute la force disponible."
  },
  {
    "id": "aseryn_origines_jouables_hyperboreen_empreinte_corps_hyperboreen_appuis_du_nord",
    "name": "Appuis du Nord",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Hyperboréen › Empreinte — Corps hyperboréen",
    "effect": "SR/R +3 pour résister à une saisie, un renversement ou un déplacement physique forcé.",
    "runtimeLore": "Le corps hyperboréen sait rendre sa masse utile. Lorsqu’on tente de le saisir, le renverser ou le pousser, ses appuis se placent avec la certitude d’un peuple habitué à tenir sur des terres qui pardonnent peu les chutes."
  },
  {
    "id": "aseryn_origines_jouables_hyperboreen_empreinte_corps_hyperboreen_percussion",
    "name": "Percussion",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "",
    "group": "Origines jouables › Hyperboréen › Empreinte — Corps hyperboréen",
    "effect": "R — 1/round Après avoir volontairement parcouru au moins 3 m avant une attaque de mêlée réussie, choisissez : +2 DGT, ou repousser la cible de 2 m si sa morphologie et la situation le permettent.",
    "runtimeLore": "Un Hyperboréen qui prend réellement son élan peut transformer la course en percussion. Le choc sert alors soit à approfondir l’impact, soit à déplacer l’adversaire comme une masse rencontrée par une autre lancée à pleine vitesse."
  },
  {
    "id": "aseryn_origines_jouables_hyperboreen_empreinte_corps_hyperboreen_reflexe_de_duel",
    "name": "Réflexe de duel",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "",
    "group": "Origines jouables › Hyperboréen › Empreinte — Corps hyperboréen",
    "effect": "R — 1/round Après une Défense active réussie contre une attaque de mêlée, l'Hyperboréen peut immédiatement se repositionner de 2 m vers une position valide. Ce n'est pas un Déplacement complet.",
    "runtimeLore": "Le duel hyperboréen ne s’arrête pas à la parade. Une défense réussie ouvre immédiatement un angle de repositionnement, petit déplacement qui empêche l’adversaire de retrouver exactement la distance qu’il croyait avoir imposée."
  },
  {
    "id": "aseryn_origines_jouables_hyperboreen_empreinte_corps_hyperboreen_exploit_physique",
    "name": "Exploit physique",
    "cost": 3,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Hyperboréen › Empreinte — Corps hyperboréen",
    "effect": "SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur des capacités physiques, relancez le 1d10e et conservez le second résultat.",
    "runtimeLore": "Dans l’urgence physique, l’héritage hyperboréen peut offrir une seconde tentative là où le corps venait d’échouer. Force, coordination ou endurance retrouvent momentanément l’exploit que la première exécution n’avait pas réussi à produire."
  },
  {
    "id": "aseryn_origines_jouables_lemurian_empreinte_heritage_nymphal_sens_elementaire",
    "name": "Sens élémentaire",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Lémurian › Empreinte — Héritage nymphal",
    "effect": "SR/R L'Aseryn perçoit avec précision la présence, le mouvement et les perturbations de son élément à proximité, dans les limites naturelles de ce que l'élément peut transmettre.",
    "runtimeLore": "Un Lémurian sent son élément par les variations qu’il transporte. Mouvement de l’air, courant de l’eau, tension du sol ou chaleur du feu deviennent une perception supplémentaire limitée par la manière dont le milieu lui-même peut transmettre l’information."
  },
  {
    "id": "aseryn_origines_jouables_lemurian_empreinte_heritage_nymphal_faconnage_nymphal",
    "name": "Façonnage nymphal",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Origines jouables › Lémurian › Empreinte — Héritage nymphal",
    "effect": "SR/R — 1 PA sous pression L'Aseryn peut manipuler une quantité modeste de son élément déjà présent pour un usage utilitaire et non directement dommageable.",
    "runtimeLore": "Le Façonnage nymphal travaille avec l’élément déjà présent. L’Aseryn le rassemble, le déplace ou le modèle pour un usage concret, révélant une parenté avec le milieu plutôt qu’une simple télékinésie déguisée."
  },
  {
    "id": "aseryn_origines_jouables_lemurian_empreinte_heritage_nymphal_manifestation_elementaire",
    "name": "Manifestation élémentaire",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "",
    "group": "Origines jouables › Lémurian › Empreinte — Héritage nymphal",
    "effect": "R — 1 PA L'Aseryn peut produire une quantité limitée de son élément pour un usage utilitaire. Ce Talent n'est pas, à lui seul, une attaque.",
    "runtimeLore": "La Manifestation permet d’appeler une petite quantité de l’élément même quand le décor n’en offre pas assez. La création reste modeste et utile : lumière, eau, souffle ou matière élémentaire au service d’une action plutôt qu’une attaque implicite."
  },
  {
    "id": "aseryn_origines_jouables_lemurian_empreinte_heritage_nymphal_corps_accorde",
    "name": "Corps accordé",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "",
    "group": "Origines jouables › Lémurian › Empreinte — Héritage nymphal",
    "effect": "R Air — Corps des hauteurs : Les chutes ordinaires ne causent normalement plus de dégâts tant que l’Aseryn est conscient et dispose d’un minimum d’espace pour se stabiliser. Un Déplacement peut devenir un grand bond soutenu permettant de franchir un vide ou de gagner/perdre fortement de l’altitude ; il doit terminer sur un support réel. Ce n’est jamais du vol stationnaire. Eau — Corps amphibie : L’Aseryn respire indéfiniment dans l’eau, voit et agit normalement sous l’eau, supporte les pressions naturelles correspondant à des profondeurs où un humain ne pourrait pas fonctionner et se déplace sans les pénalités ordinaires d’un corps humain. Les environnements surnaturels ou abyssaux peuvent toujours le menacer. Terre — Corps de pierre : En R : Armure corporelle 2 contre les dommages matériels. Une force physique humaine ordinaire ne suffit normalement pas à le renverser ou à le déplacer contre sa volonté s’il est solidement appuyé au sol. Feu — Corps incandescent : Le corps supporte sans dommage les flammes ordinaires, la chaleur naturelle extrême et la fumée/chaleur produite directement par son propre feu nymphal. Il reçoit Réduction 2 [Feu] contre les dégâts principalement thermiques ou de feu ; les attaques surnaturelles ou armes suffisamment puissantes restent capables de le blesser.",
    "runtimeLore": "L’héritage nymphal n’est pas une décoration élémentaire mais une adaptation du corps à son élément. Air, eau, terre ou feu modifient respiration, appuis, résistance et manière d’habiter un milieu comme s’il avait toujours été naturel."
  },
  {
    "id": "aseryn_origines_jouables_lemurian_empreinte_heritage_nymphal_dechainement_nymphal",
    "name": "Déchaînement nymphal",
    "cost": 3,
    "access": "R",
    "prerequisiteName": "",
    "group": "Origines jouables › Lémurian › Empreinte — Héritage nymphal",
    "effect": "R — 2 PA — 1/Scène Air — Front de tempête : Cône d’environ 10 m. Chaque cible exposée oppose sa Défense physique ; en réussite elle est repoussée jusqu’à environ 5 m selon masse et terrain et peut être Renversée si approprié. Fumées, gaz, poussières et flammes ordinaires non protégés sont dispersés. Pas de dégâts automatiques. Eau — Marée suspendue : Petite zone d’environ 4 m de rayon à courte portée, saturée d’eau en mouvement pendant un round. Les flammes ordinaires sont éteintes ; mouvements et projectiles non adaptés sont fortement gênés. Sortir précipitamment de la masse peut demander Vigueur + Athlétisme contre le jet nymphal. Un round ne suffit pas à noyer magiquement une cible. Terre — Soulèvement tellurique : Sur un support minéral connecté, créer pour la scène un couvert total de quelques mètres, un fossé/obstacle, une rampe/plateforme, fermer brutalement une ouverture terrestre ou soulever une petite zone pour Renverser ses occupants. Ne détruit pas automatiquement un bâtiment et ne manipule pas une structure entière hors échelle. Feu — Brasier primordial : Zone d’environ 4 m de rayon, portée courte/moyenne. Attaque surnaturelle directe DGT 8, Incendiaire ; une Altération appropriée peut provoquer Enflammé. Pas de second effet gratuit. L’héritage lémurian s’étend aux quatre grands éléments : Air, Eau, Terre et Feu.",
    "runtimeLore": "Quand l’héritage lémurian se déchaîne, l’élément cesse d’être utilitaire et transforme le terrain. Tempête, masse d’eau, soulèvement minéral ou brasier expriment chacun la même idée : laisser le milieu agir à l’échelle d’une scène entière."
  },
  {
    "id": "aseryn_origines_jouables_seratheen_empreinte_sang_mele_atavisme_marque",
    "name": "Atavisme marqué",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Origines jouables › Serathèen › Empreinte — Sang mêlé",
    "effect": "Passif Choisissez l'une de vos Traces. Elle devient la Signature complète de l'Origine correspondante, sans accorder son bonus d'Attribut : Aérilienne = Résonance d'Aèr + Acclimatation arcanique ; Mûlienne = Étincelle psychique + Présence mentale ; Hyperboréenne = Corps hyperboréen ; Lémurienne = Héritage nymphal complet.",
    "runtimeLore": "Le sang serathèen peut laisser une lignée ancestrale remonter avec une netteté inhabituelle. Une Trace mineure devient assez forte pour reproduire la véritable Signature d’une Origine, sans réécrire pour autant toute la constitution du personnage."
  },
  {
    "id": "aseryn_origines_jouables_seratheen_empreinte_sang_mele_sang_pluriel",
    "name": "Sang pluriel",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Origines jouables › Serathèen › Empreinte — Sang mêlé",
    "effect": "Passif — une seule fois Gagnez une troisième Trace ancestrale mineure différente.",
    "runtimeLore": "Certains sangs mêlés portent encore une troisième rumeur ancestrale. Elle reste légère, simple Trace supplémentaire dans un organisme dont l’histoire familiale refuse décidément de se laisser réduire à deux branches."
  },
  {
    "id": "aseryn_origines_jouables_seratheen_empreinte_sang_mele_heritage_eveille",
    "name": "Héritage éveillé",
    "cost": 2,
    "access": "",
    "prerequisiteName": "Atavisme marqué",
    "group": "Origines jouables › Serathèen › Empreinte — Sang mêlé",
    "effect": "Prérequis : Atavisme marqué | Passif Le personnage peut acheter les Talents d'Origine associés à la Trace choisie comme s'il appartenait à cette Origine. Il ne gagne aucun Talent gratuitement.",
    "runtimeLore": "Une Trace devenue pleinement éveillée n’est plus seulement souvenir biologique. Le Serathèen peut désormais apprendre les techniques qui appartiennent à cette lignée comme un héritier tardif revenu réclamer une tradition longtemps restée silencieuse."
  },
  {
    "id": "aseryn_origines_jouables_seratheen_empreinte_sang_mele_mosaique_ancestrale",
    "name": "Mosaïque ancestrale",
    "cost": 3,
    "access": "",
    "prerequisiteName": "Héritage éveillé",
    "group": "Origines jouables › Serathèen › Empreinte — Sang mêlé",
    "effect": "Prérequis : Héritage éveillé | Passif Héritage éveillé peut désormais s'appliquer à une seconde Trace, permettant de développer deux lignées d'Origine différentes.",
    "runtimeLore": "Le Serathèen cesse de chercher une origine dominante et accepte la mosaïque. Deux héritages différents peuvent être développés côte à côte, chacun conservant sa logique propre au lieu de fusionner en une lignée artificielle."
  },
  {
    "id": "aseryn_traditions_des_treize_athegos_le_seigneur_ordre_fulgurant",
    "name": "Ordre fulgurant",
    "cost": 1,
    "access": "V/SR/R",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Athegos — le Seigneur",
    "effect": "V/SR/R — 1/round L'Aseryn peut fournir une Assistance +2 en combat, normalement interdite, à un allié qu'il peut réellement conseiller et avec lequel il peut communiquer. Les conditions normales d'Assistance restent valables, notamment la Compétence minimale requise. Avec un autre Aseryn, l'ordre peut être transmis en Accelyr.",
    "runtimeLore": "Athegos commande au rythme de la bataille. Une consigne lancée au bon moment devient une véritable aide tactique même au milieu des échanges, parce qu’elle s’adresse à un allié capable de comprendre et d’exécuter ce conseil."
  },
  {
    "id": "aseryn_traditions_des_treize_athegos_le_seigneur_prendre_la_tete",
    "name": "Prendre la tête",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Athegos — le Seigneur",
    "effect": "1/Scène Au début d'un round, désignez jusqu'à deux alliés capables de comprendre Athegos. Jusqu'à la fin du round, ils peuvent volontairement agir après lui au sein de leur passe d'Initiative, même si leur ordre normal les placerait avant. Aucun PA n'est gagné.",
    "runtimeLore": "Prendre la tête signifie offrir aux autres un tempo auquel se raccrocher. Les alliés peuvent choisir d’attendre le geste d’Athegos puis d’agir dans son sillage, formation volontaire qui ne crée aucune seconde supplémentaire."
  },
  {
    "id": "aseryn_traditions_des_treize_athegos_le_seigneur_une_seule_decision",
    "name": "Une seule décision",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Athegos — le Seigneur",
    "effect": "1 PA — 1/Scène Athegos transmet un plan bref à jusqu'à trois alliés consentants. Chacun reçoit +2 à sa première action directement nécessaire à ce plan avant le début du prochain round d'Athegos. Ce bonus est une Assistance.",
    "runtimeLore": "Un plan bref transmis par Athegos devient une décision commune plutôt qu’une suite d’initiatives concurrentes. Chacun sait quelle première action sert réellement l’objectif partagé avant que la scène ne recommence à se disperser."
  },
  {
    "id": "aseryn_traditions_des_treize_sundosia_l_aventuriere_toujours_une_issue",
    "name": "Toujours une issue",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Sundosia — l’Aventurière",
    "effect": "1/Scène Quand une approche, un accès ou un itinéraire vient de se révéler impraticable, le joueur peut demander au MJ quelle autre possibilité réaliste peut immédiatement être tentée avec ce que le personnage perçoit ou sait. Le Talent n'invente aucun passage qui n'existe pas.",
    "runtimeLore": "Une voie qui se ferme n’épuise pas l’esprit de l’Aventurière. Sundosia balaie ce qu’elle voit et sait pour retrouver l’autre option réellement disponible, sans faire apparaître une porte secrète que le lieu n’a jamais contenue."
  },
  {
    "id": "aseryn_traditions_des_treize_sundosia_l_aventuriere_improvisation_d_aventurier",
    "name": "Improvisation d’aventurier",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Sundosia — l’Aventurière",
    "effect": "1/Scène Lorsqu'un objet, véhicule, équipement ou élément du décor est utilisé de manière crédible hors de son usage prévu, ignorez jusqu'à -3 de malus circonstanciel provenant uniquement de cette improvisation.",
    "runtimeLore": "Sundosia a survécu assez longtemps pour voir qu’un objet utile n’est pas toujours utilisé comme son fabricant l’avait prévu. L’improvisation crédible cesse d’être maladroite lorsque l’Aventurière trouve immédiatement la prise, l’angle ou l’usage de circonstance."
  },
  {
    "id": "aseryn_traditions_des_treize_sundosia_l_aventuriere_s_adapter_ou_mourir",
    "name": "S’adapter ou mourir",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Sundosia — l’Aventurière",
    "effect": "1/Scène Après un échec non narratif principalement causé par un environnement, un moyen de déplacement ou une situation que Sundosia n'avait encore jamais rencontrée, la prochaine tentative pertinente de la scène voit sa difficulté réduite d'un niveau. Cette réduction reste soumise au plafond général de réduction de difficulté.",
    "runtimeLore": "Le premier échec dans un milieu réellement nouveau devient une leçon accélérée. Sundosia assimile ce que l’environnement vient de lui apprendre et adapte la tentative suivante au lieu de répéter le comportement qui a déjà montré ses limites."
  },
  {
    "id": "aseryn_traditions_des_treize_caendis_le_protecteur_interposition",
    "name": "Interposition",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Caendis — le Protecteur",
    "effect": "Réaction — 1 PA Lorsqu'un allié situé à 2 m maximum est directement ciblé par une attaque physique, Caendis peut se déplacer dans la trajectoire si cela est matériellement possible et devenir la cible de l'attaque.",
    "runtimeLore": "L’interposition de Caendis est un choix physique, pas une aura abstraite. Il se jette réellement entre l’attaque et son allié et accepte que la menace change de cible parce que son propre corps occupe désormais la trajectoire."
  },
  {
    "id": "aseryn_traditions_des_treize_caendis_le_protecteur_garde_rapprochee",
    "name": "Garde rapprochée",
    "cost": 2,
    "access": "",
    "prerequisiteName": "Interposition",
    "group": "Traditions des Treize › Caendis — le Protecteur",
    "effect": "Prérequis : Interposition | 1/round +3 à une Défense active effectuée alors que Caendis protège directement quelqu'un d'autre.",
    "runtimeLore": "Protéger quelqu’un change la manière dont Caendis défend. Sa garde cesse d’être centrée sur sa propre survie et devient plus précise, parce que chaque parade sait exactement quel corps elle refuse de laisser atteindre."
  },
  {
    "id": "aseryn_traditions_des_treize_caendis_le_protecteur_aucun_ne_passera",
    "name": "Aucun ne passera",
    "cost": 3,
    "access": "",
    "prerequisiteName": "Garde rapprochée",
    "group": "Traditions des Treize › Caendis — le Protecteur",
    "effect": "Prérequis : Garde rapprochée | 1/Scène Lorsqu'il utilise Interposition, Caendis peut déclarer ce Talent. Jusqu'au début de son prochain round, il peut effectuer jusqu'à deux Interpositions supplémentaires sans payer leur coût en PA, à condition que chaque déplacement reste physiquement possible. Les Défenses actives éventuelles coûtent toujours leurs PA normaux.",
    "runtimeLore": "Caendis peut devenir une ligne que l’adversaire doit traverser plusieurs fois. Après la première interposition, le Protecteur garde son corps prêt à reprendre la trajectoire d’autres attaques tant que ses jambes peuvent réellement atteindre ceux qu’il couvre."
  },
  {
    "id": "aseryn_traditions_des_treize_cairiah_l_architecte_il_de_structure",
    "name": "Œil de structure",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Cairiah — l’Architecte",
    "effect": "Passif Après une observation suffisante d'une construction, fortification, installation fixe ou structure naturelle, Cairiah identifie les supports principaux, fragilités structurelles manifestes, zones protégées, risques d'effondrement et possibilités réalistes de consolidation. Les défauts cachés ou structures très complexes peuvent nécessiter un test.",
    "runtimeLore": "Une structure raconte comment elle tient debout. Cairiah lit supports, charges, zones faibles et possibilités de consolidation comme d’autres lisent une carte, sans inventer ce qu’un défaut réellement caché ne laisse pas voir."
  },
  {
    "id": "aseryn_traditions_des_treize_cairiah_l_architecte_fortification",
    "name": "Fortification",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Cairiah — l’Architecte",
    "effect": "Préparation de quelques minutes Avec des matériaux adaptés et des outils raisonnables, Cairiah peut aménager une vraie position : barricade, accès renforcé, couvert, abri, consolidation ou poste protégé. Une position correctement construite procure Couvert +3 contre les menaces auxquelles elle a été conçue pour faire face. Aucun usage instantané en combat.",
    "runtimeLore": "Cairiah transforme un lieu en position plutôt qu’en simple décor. Matériaux, angles et accès sont organisés selon la menace prévue, produisant une fortification réelle qui vaut parce qu’elle a été construite avant que le combat n’arrive."
  },
  {
    "id": "aseryn_traditions_des_treize_cairiah_l_architecte_position_maitresse",
    "name": "Position maîtresse",
    "cost": 3,
    "access": "",
    "prerequisiteName": "Fortification",
    "group": "Traditions des Treize › Cairiah — l’Architecte",
    "effect": "Prérequis : Fortification | Préparation d’environ 30 minutes minimum Avec une zone réellement aménageable et des ressources suffisantes, Cairiah peut préparer jusqu'à trois ouvrages cohérents avec le terrain.",
    "runtimeLore": "Avec du temps, l’Architecte ne prépare plus un seul abri mais un petit système défensif. Plusieurs ouvrages se complètent et donnent au terrain une logique de circulation, de protection et de repli pensée comme un ensemble."
  },
  {
    "id": "aseryn_traditions_des_treize_eydreas_le_chercheur_hypothese_adverse",
    "name": "Hypothèse adverse",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Eydreas — le Chercheur",
    "effect": "1/Scène Après avoir construit une hypothèse à partir d'indices, le joueur peut demander : « Quel élément que j'ai déjà observé cadre le moins bien avec mon hypothèse ? » Le MJ désigne un détail existant s'il y en a un ; aucune information nouvelle n'est créée.",
    "runtimeLore": "Le Chercheur combat sa propre hypothèse en demandant quelle observation résiste le mieux à son modèle. Le détail gênant redevient visible au lieu d’être inconsciemment repoussé parce qu’il compliquait une explication séduisante."
  },
  {
    "id": "aseryn_traditions_des_treize_eydreas_le_chercheur_reprendre_le_raisonnement",
    "name": "Reprendre le raisonnement",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Eydreas — le Chercheur",
    "effect": "1/Scène Après un échec non narratif à un test d'analyse, compréhension, enquête ou diagnostic intellectuel, relancez le 1d10e et conservez le second résultat.",
    "runtimeLore": "Un échec d’analyse n’oblige pas Eydreas à abandonner la piste. Il peut reprendre le raisonnement depuis l’endroit où il s’est probablement tordu et tenter une nouvelle fois d’organiser les mêmes informations."
  },
  {
    "id": "aseryn_traditions_des_treize_eydreas_le_chercheur_detruire_la_fausse_certitude",
    "name": "Détruire la fausse certitude",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Eydreas — le Chercheur",
    "effect": "1/Scénario Quand le groupe s'est engagé dans une explication ou un plan fondé sur des faits connus, le joueur peut demander quelle hypothèse importante actuellement tenue pour vraie repose sur les preuves les plus fragiles. Le MJ désigne la faiblesse du raisonnement, pas la vérité objective.",
    "runtimeLore": "Eydreas sait qu’un raisonnement dangereux peut être cohérent tout en reposant sur une fondation trop fragile. Une fois par scénario, il désigne la certitude du groupe qui mérite le plus d’être remise en cause, sans recevoir la vérité qui la remplacera."
  },
  {
    "id": "aseryn_traditions_des_treize_seryn_l_artisane_main_de_seryn",
    "name": "Main de Seryn",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Seryn — l’Artisane",
    "effect": "1/Scène Pour fabriquer, réparer ou modifier quelque chose que Seryn maîtrise réellement, elle peut bénéficier de Prendre son temps sans consommer le délai supplémentaire.",
    "runtimeLore": "Les mains de l’Artisane savent retrouver immédiatement le calme d’un atelier, même lorsque le temps manque. Pour un travail réellement maîtrisé, Seryn bénéficie de la précision d’une longue préparation sans obtenir des heures qui n’existent pas."
  },
  {
    "id": "aseryn_traditions_des_treize_seryn_l_artisane_adaptation_de_terrain",
    "name": "Adaptation de terrain",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Seryn — l’Artisane",
    "effect": "Préparation de quelques minutes Seryn modifie un équipement connu pour répondre à une contrainte précise : ergonomie, montage, étanchéité, alimentation, équilibre, protection d'une partie fragile, etc. Jusqu'à la fin de la scène, l'équipement ignore jusqu'à -3 de malus provenant de cette contrainte.",
    "runtimeLore": "Seryn adapte l’objet à la contrainte plutôt que d’exiger du monde qu’il soit commode. Quelques modifications ciblées d’ergonomie, d’étanchéité, de montage ou de protection rendent un équipement familier plus apte à la scène présente."
  },
  {
    "id": "aseryn_traditions_des_treize_seryn_l_artisane_refuser_la_panne",
    "name": "Refuser la panne",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Seryn — l’Artisane",
    "effect": "1/Scène — 1 PA Un équipement que Seryn utilise ou peut immédiatement atteindre devient inutilisable à cause d'une panne ou détérioration réparable. Elle le remet provisoirement en fonctionnement jusqu'à la fin de la scène. Il reste réellement endommagé et devra être réparé ensuite.",
    "runtimeLore": "Seryn refuse qu’une panne réparable décide seule du sort de la scène. Elle ramène l’équipement endommagé à un fonctionnement provisoire, bricolage de survie qui laisse intacte la nécessité d’une vraie réparation ensuite."
  },
  {
    "id": "aseryn_traditions_des_treize_natyel_le_nourricier_lire_la_terre",
    "name": "Lire la terre",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Natyel — le Nourricier",
    "effect": "Passif après quelques minutes Dans un environnement naturel, Natyel identifie les sources plausibles d'eau et de nourriture, les déséquilibres écologiques manifestes, les passages récents de faune significative et les zones les plus adaptées à la subsistance.",
    "runtimeLore": "La terre parle à Natyel en traces de vie et de ressources. Eau, nourriture, passages de faune et déséquilibres écologiques deviennent lisibles après quelques minutes d’attention à un environnement naturel."
  },
  {
    "id": "aseryn_traditions_des_treize_natyel_le_nourricier_prelevement_efficace",
    "name": "Prélèvement efficace",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Natyel — le Nourricier",
    "effect": "Passif Après une chasse, collecte ou récupération naturelle réussie, comptez DR +1 uniquement pour déterminer la quantité ou la qualité des ressources obtenues, sans dépasser DR 5 et sans accroître les dégâts écologiques.",
    "runtimeLore": "Le Nourricier prélève sans gaspiller ce qu’un milieu peut réellement offrir. Une chasse ou une collecte réussie fournit davantage d’usage grâce à la connaissance de la ressource, pas parce que la nature produit soudain plus qu’elle ne possédait."
  },
  {
    "id": "aseryn_traditions_des_treize_natyel_le_nourricier_la_famille_ne_manque_de_rien",
    "name": "La famille ne manque de rien",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Natyel — le Nourricier",
    "effect": "1/Scénario Quand nourriture, eau, abri ou ressource naturelle devient une menace réelle, Natyel peut révéler avoir raisonnablement anticipé une réserve ou une solution de subsistance lors d'une occasion antérieure où cela était possible. Il ne peut pas inventer rétroactivement de l'argent, une arme, un équipement rare ou une ressource qui n'aurait pas pu être préparée.",
    "runtimeLore": "Natyel pense la subsistance avant qu’elle devienne une urgence. Lorsqu’un manque réel apparaît, il peut révéler la réserve ou la solution modeste qu’un Nourricier prudent avait eu une occasion crédible de préparer bien plus tôt."
  },
  {
    "id": "aseryn_traditions_des_treize_erith_la_sentinelle_veille_d_erith",
    "name": "Veille d’Erith",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Erith — la Sentinelle",
    "effect": "Passif +3 pour détecter une embuscade, une intrusion ou une approche hostile lorsque le personnage assure réellement une surveillance.",
    "runtimeLore": "La veille d’Erith est une discipline active. Quand elle assume réellement la surveillance, changements de rythme, approche hostile et détails d’embuscade reçoivent toute l’attention d’un esprit qui n’est pas distrait par le reste."
  },
  {
    "id": "aseryn_traditions_des_treize_erith_la_sentinelle_alerte_fulgurante",
    "name": "Alerte fulgurante",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Erith — la Sentinelle",
    "effect": "Réaction — 1/Scène Lorsqu'Erith détecte un danger avant un allié capable de recevoir son avertissement, cet allié n'est pas considéré Surpris par ce danger.",
    "runtimeLore": "Erith sait qu’une alerte n’a de valeur que si elle arrive avant l’impact. Lorsqu’elle détecte la menace la première, son avertissement peut arracher un allié à l’ignorance juste assez tôt pour qu’il ne subisse pas le danger comme une surprise totale."
  },
  {
    "id": "aseryn_traditions_des_treize_erith_la_sentinelle_perimetre_sous_controle",
    "name": "Périmètre sous contrôle",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Erith — la Sentinelle",
    "effect": "Préparation de 10 minutes Après avoir étudié un lieu raisonnablement délimité — appartement, étage, petit camp, portion d’entrepôt, cour — Erith établit son périmètre pour la scène. Il conserve instinctivement l’état pertinent des accès et zones qu’il a pu intégrer et sait immédiatement qu’un changement physique grossier s’y produit. Une intrusion hostile empruntant un accès ou trajet intégré au périmètre ne peut pas le Surprendre par de simples moyens ordinaires de Furtivité. L’intrus peut rester caché après son entrée et Erith ne connaît pas automatiquement son identité ni sa position précise. Téléportation, passage dimensionnel, accès réellement inconnu, capacité surnaturelle spécifiquement adaptée ou altération du périmètre depuis l’extérieur peuvent contourner la veille.",
    "runtimeLore": "Après avoir étudié un lieu, la Sentinelle en garde un modèle vivant. Portes, passages et zones intégrées au périmètre ont pour elle un état attendu ; une intrusion grossière devient donc immédiatement une anomalie, même si l’intrus reste ensuite caché."
  },
  {
    "id": "aseryn_traditions_des_treize_lisirast_l_archiviste_memoire_d_archive",
    "name": "Mémoire d’archive",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Lisirast — l’Archiviste",
    "effect": "Passif Ce que Lisirast a volontairement décidé d'archiver mentalement peut être restitué avec une très grande précision. Le Talent n'accorde pas une mémoire eidétique permanente de tout ce qu'il a vécu.",
    "runtimeLore": "Une mémoire volontairement archivée n’est pas abandonnée au polissage ordinaire du souvenir. Lisirast la conserve avec une précision méthodique, comme une pièce classée que l’on pourra ressortir sans prétendre avoir enregistré chaque instant de sa vie."
  },
  {
    "id": "aseryn_traditions_des_treize_lisirast_l_archiviste_index_vivant",
    "name": "Index vivant",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Lisirast — l’Archiviste",
    "effect": "1/Scène Sur un sujet déjà étudié, le joueur peut demander au MJ de lui rappeler une information pertinente déjà rencontrée par le personnage mais oubliée par le joueur. Aucune information nouvelle n'est créée.",
    "runtimeLore": "L’Archiviste ne produit pas des souvenirs qu’il n’a jamais eus. Il sait en revanche retrouver dans ce qu’il a déjà étudié l’information pertinente que le temps ou le joueur avait laissée glisser hors de l’attention."
  },
  {
    "id": "aseryn_traditions_des_treize_lisirast_l_archiviste_chambre_scellee",
    "name": "Chambre scellée",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Lisirast — l’Archiviste",
    "effect": "Passif Lisirast peut compartimenter un secret majeur à la fois. Une lecture mentale superficielle ne peut pas tomber dessus accidentellement et une tentative visant spécifiquement ce secret subit +3 à la difficulté ou à la Défense appropriée. La perte de conscience n'ouvre pas automatiquement le compartiment.",
    "runtimeLore": "Lisirast sait cacher un secret même à l’intérieur de son propre esprit. Il compartimente volontairement cette mémoire derrière une porte mentale que la curiosité superficielle ne rencontre pas et qu’une fouille ciblée doit réellement forcer."
  },
  {
    "id": "aseryn_traditions_des_treize_lisithas_le_juge_contradiction",
    "name": "Contradiction",
    "cost": 1,
    "access": "V/SR/R",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Lisithas — le Juge",
    "effect": "V/SR/R — Passif Lorsqu'une personne exprime pendant la scène deux affirmations directement incompatibles, Lisithas remarque automatiquement la contradiction. Cela ne détecte pas le mensonge et ne remplace pas une enquête lorsque la contradiction dépend d'informations extérieures complexes.",
    "runtimeLore": "Deux affirmations incompatibles sonnent faux à Lisithas même si chacune paraît plausible séparément. Il remarque la contradiction interne au discours, ce qui n’est ni une preuve de mensonge ni la solution d’une enquête plus vaste."
  },
  {
    "id": "aseryn_traditions_des_treize_lisithas_le_juge_plaidoyer_raisonne",
    "name": "Plaidoyer raisonné",
    "cost": 2,
    "access": "V/SR/R",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Lisithas — le Juge",
    "effect": "V/SR/R Lorsqu'il cherche à convaincre par un raisonnement construit sur des faits, règles, contrats, obligations ou engagements connus, Lisithas peut utiliser Esprit + Diplomatie à la place de Charisme + Diplomatie. Ce Talent ne s'applique pas à la séduction, la flatterie ou l'inspiration purement émotionnelle.",
    "runtimeLore": "Lisithas sait convaincre en construisant une chaîne de faits, de règles et d’engagements. Son autorité vient alors de la solidité du raisonnement plutôt que du charme personnel, méthode peu utile lorsque seule l’émotion devrait emporter l’adhésion."
  },
  {
    "id": "aseryn_traditions_des_treize_lisithas_le_juge_arbitrage",
    "name": "Arbitrage",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Lisithas — le Juge",
    "effect": "1/Scène Lorsque deux parties acceptent réellement Lisithas comme arbitre, il peut conduire une discussion contradictoire puis demander au MJ : quel est le véritable point de désaccord ? quel fait connu est le plus déterminant ? quelle concession réaliste de chaque côté permettrait un compromis ? Les réponses sont limitées à ce que Lisithas peut déduire des informations exposées.",
    "runtimeLore": "Lisithas arbitre en séparant les positions, les faits et les concessions possibles. Lorsque les deux parties reconnaissent son rôle, il peut faire apparaître le véritable nœud du désaccord sans transformer le jugement en oracle."
  },
  {
    "id": "aseryn_traditions_des_treize_lisithas_le_juge_autorite_du_jugement",
    "name": "Autorité du jugement",
    "cost": 3,
    "access": "",
    "prerequisiteName": "Plaidoyer raisonné",
    "group": "Traditions des Treize › Lisithas — le Juge",
    "effect": "Prérequis : Plaidoyer raisonné | 1/Scène Après avoir réellement exposé son raisonnement, Lisithas effectue un test social approprié. En réussite, les personnes neutres, hésitantes ou ayant volontairement accepté son arbitrage cessent l'escalade immédiate assez longtemps pour entendre la décision et pouvoir y répondre. Ce n'est pas une domination mentale.",
    "runtimeLore": "L’autorité du Juge vient après le raisonnement, pas à sa place. Une fois l’affaire exposée, sa parole impose assez de calme aux hésitants et à ceux qui ont accepté l’arbitrage pour que la décision puisse être entendue avant la reprise de l’escalade."
  },
  {
    "id": "aseryn_traditions_des_treize_selerias_l_aimante_lien_entretenu",
    "name": "Lien entretenu",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Selerias — l’Aimante",
    "effect": "Passif Lorsqu'elle aide une personne avec laquelle elle entretient un lien établi, Selerias peut fournir une Assistance fondée sur son soutien, sa connaissance de la personne ou sa coordination même si elle possède 0 dans la Compétence technique concernée, à condition que ce ne soit précisément pas l'expertise technique qui constitue l'aide.",
    "runtimeLore": "L’Aimante peut être utile sans connaître le métier de l’autre, précisément parce qu’elle le connaît lui. Soutien, anticipation et coordination deviennent une Assistance valable tant que le problème n’exige pas de sa part l’expertise technique absente."
  },
  {
    "id": "aseryn_traditions_des_treize_selerias_l_aimante_je_te_connais",
    "name": "Je te connais",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Selerias — l’Aimante",
    "effect": "1/Scène Lorsqu'un proche résiste à une manipulation surnaturelle émotionnelle, une peur, une rupture forcée de confiance ou un effet affectif comparable, Selerias peut lui fournir Assistance +2, y compris en combat si elle peut communiquer avec lui.",
    "runtimeLore": "Selerias connaît assez un proche pour l’aider à se retrouver lorsqu’une émotion étrangère cherche à le remodeler. Sa voix et leur histoire commune offrent un point fixe contre peur, rupture de confiance ou manipulation affective."
  },
  {
    "id": "aseryn_traditions_des_treize_selerias_l_aimante_la_famille_tient",
    "name": "La famille tient",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Selerias — l’Aimante",
    "effect": "1 PA — 1/Scène Choisissez un allié avec lequel Selerias possède un lien personnel réel et avec lequel elle peut communiquer. Si les circonstances permettraient normalement à cet allié d'effectuer un test pour sortir de Tendu ou Paniqué, il en sort automatiquement sans effectuer le test. Si aucun test ne serait normalement possible, le Talent ne contourne pas cette impossibilité.",
    "runtimeLore": "Un lien entretenu peut retenir quelqu’un au moment où la tension ou la panique commence à l’emporter. Selerias ne supprime pas une impossibilité profonde ; elle rappelle simplement au proche le chemin de retour lorsqu’il existe encore."
  },
  {
    "id": "aseryn_traditions_des_treize_theana_la_guerisseuse_il_de_theana",
    "name": "Œil de Theana",
    "cost": 1,
    "access": "V/SR/R",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Theana — la Guérisseuse",
    "effect": "V/SR/R Pour un diagnostic courant dans son domaine, aucun jet n'est nécessaire dès lors qu'un examen réel est possible et que rien ne masque anormalement le problème. Face à un cas rare, complexe, masqué ou surnaturel, +3 au test de diagnostic.",
    "runtimeLore": "L’œil de Theana reconnaît sans théâtre ce que son expérience médicale a déjà appris à voir. Les cas courants deviennent évidents à l’examen ; les situations rares ou masquées bénéficient plutôt d’un regard exceptionnellement bien entraîné."
  },
  {
    "id": "aseryn_traditions_des_treize_theana_la_guerisseuse_medecine_de_terrain",
    "name": "Médecine de terrain",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Theana — la Guérisseuse",
    "effect": "Passif Ignorez jusqu'à -3 de malus circonstanciel provenant d'un lieu inadéquat, du déplacement du patient ou d'outils improvisés mais réellement fonctionnels. Le Talent ne crée jamais un matériel indispensable absent.",
    "runtimeLore": "La médecine de terrain consiste à faire correctement avec un lieu mauvais et des outils imparfaits. Theana compense mouvement, improvisation et environnement tant que ce qui est absolument indispensable au soin existe encore vraiment."
  },
  {
    "id": "aseryn_traditions_des_treize_theana_la_guerisseuse_geste_salvateur",
    "name": "Geste salvateur",
    "cost": 2,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Theana — la Guérisseuse",
    "effect": "1/Scène Après un échec non narratif à un test de soins d'urgence ou de stabilisation, relancez le 1d10e et conservez le second résultat.",
    "runtimeLore": "Theana garde dans ses mains la possibilité d’un second geste quand l’urgence médicale vient de mal tourner. Un échec de stabilisation peut être repris immédiatement, comme si l’instinct de la Guérisseuse refusait de laisser le patient à cette première issue."
  },
  {
    "id": "aseryn_traditions_des_treize_theana_la_guerisseuse_l_impossible_reste_possible",
    "name": "L’impossible reste possible",
    "cost": 3,
    "access": "",
    "prerequisiteName": "",
    "group": "Traditions des Treize › Theana — la Guérisseuse",
    "effect": "1/Scénario Un acte médical normalement réalisable serait impossible uniquement à cause des conditions matérielles présentes. Si Theana dispose malgré tout des éléments absolument indispensables, elle peut tenter l'intervention à Difficulté 21, ou à sa difficulté normale si celle-ci est supérieure.",
    "runtimeLore": "Pour Theana, des conditions terribles ne rendent pas automatiquement impossible une médecine dont les éléments vitaux sont encore présents. Elle peut tenter l’intervention que d’autres renonceraient à entreprendre, tout en restant soumise à la difficulté réelle du cas."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_talents_communs_de_dratyn_conduction",
    "name": "Conduction",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Dratyn — la Maîtresse de la Foudre › Talents communs de Dratyn",
    "effect": "SR/R — 1 PA sous pression L'Aseryn peut guider, attirer, interrompre ou redistribuer un courant électrique déjà existant : exploiter un conducteur, provoquer ou empêcher un arc, charger ou décharger un objet, influencer un circuit simple. Il ne produit pas encore sa propre Foudre.",
    "runtimeLore": "Avant de produire sa propre foudre, l’Aseryn apprend à écouter celle qui existe déjà. Courants, conducteurs et charges deviennent des chemins qu’il peut ouvrir, fermer ou dévier sans confondre cette maîtrise avec la création d’énergie."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_talents_communs_de_dratyn_foudre_aseryne",
    "name": "Foudre aseryne",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Conduction",
    "group": "Dratyn — la Maîtresse de la Foudre › Talents communs de Dratyn",
    "effect": "Prérequis : Conduction | R — 1 PA L'Aseryn peut générer et projeter sa propre Foudre. Il gagne l'attaque de Foudre standard, DGT 7, selon les règles communes ci-dessus.",
    "runtimeLore": "La Foudre aseryne naît du corps comme une extension naturelle de sa charge intérieure. Elle ne dépend plus d’un câble ou d’un orage extérieur : l’Aseryn devient lui-même la source capable de projeter l’éclair."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_talents_communs_de_dratyn_decharge_maitrisee",
    "name": "Décharge maîtrisée",
    "cost": 1,
    "access": "R",
    "prerequisiteName": "Foudre aseryne",
    "group": "Dratyn — la Maîtresse de la Foudre › Talents communs de Dratyn",
    "effect": "Prérequis : Foudre aseryne | R L'Aseryn sait moduler intensité et durée : alimenter ou décharger un appareil, provoquer un choc non destiné à tuer, neutraliser une installation électrique ordinaire accessible, souder ou brûler localement un matériau conducteur, etc. En cas d'incertitude, utilisez un Jet de Foudre contre une difficulté appropriée.",
    "runtimeLore": "Une fois la foudre acquise, Dratyn enseigne à ne pas tout résoudre par la violence maximale. Intensité et durée deviennent assez fines pour alimenter, neutraliser, souder ou provoquer un choc contrôlé avec le même phénomène qui sert au combat."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_talents_communs_de_dratyn_paratonnerre",
    "name": "Paratonnerre",
    "cost": 2,
    "access": "SR/R",
    "prerequisiteName": "Foudre aseryne",
    "group": "Dratyn — la Maîtresse de la Foudre › Talents communs de Dratyn",
    "effect": "Prérequis : Foudre aseryne | SR/R — Réaction — 1 PA — 1/round Lorsqu'une attaque ou manifestation principalement électrique frappe l'Aseryn ou passe suffisamment près, il peut opposer un Jet de Foudre au résultat de l'effet. En réussite, il détourne la décharge vers un conducteur ou une zone valide proche et annule les dégâts qu'il aurait personnellement subis. Il ne renvoie pas automatiquement l'attaque sur un adversaire.",
    "runtimeLore": "Le Paratonnerre transforme l’Aseryn en chemin volontaire pour une décharge qui allait le frapper. Il saisit la logique du courant et la conduit vers un point sûr ou conducteur, sans faire de cette défense un renvoi automatique contre l’assaillant."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_talents_communs_de_dratyn_arc_en_chaine",
    "name": "Arc en chaîne",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Foudre aseryne",
    "group": "Dratyn — la Maîtresse de la Foudre › Talents communs de Dratyn",
    "effect": "Prérequis : Foudre aseryne | R — 1/Scène Après un Jet de Foudre réussi contre une cible, une seconde cible située à 3 m maximum de la première peut être frappée par le même résultat. Elle se défend normalement. La seconde décharge est DGT 5. Un seul rebond.",
    "runtimeLore": "Après le premier impact, Dratyn peut laisser un reste de charge chercher une seconde présence proche. L’arc ne devient pas une tempête autonome : il bondit une seule fois, prolongement affaibli mais encore dangereux de la décharge initiale."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_talents_communs_de_dratyn_orage_aseryn",
    "name": "Orage aseryn",
    "cost": 3,
    "access": "R",
    "prerequisiteName": "Foudre aseryne",
    "group": "Dratyn — la Maîtresse de la Foudre › Talents communs de Dratyn",
    "effect": "Prérequis : Foudre aseryne | R — 2 PA — 1/Scène L'Aseryn libère une décharge dans une zone de 3 m de rayon à portée. Un seul Jet de Foudre est comparé individuellement à la Défense de chaque cible. DGT 7.",
    "runtimeLore": "L’Orage aseryn cesse de choisir une seule trajectoire. La charge éclate dans une petite zone et cherche chaque corps séparément, comme si un nuage de tempête avait été comprimé à hauteur d’homme puis ouvert d’un coup."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_createur_foudre_originelle_foudre_originelle",
    "name": "Foudre originelle",
    "cost": 1,
    "access": "R",
    "prerequisiteName": "Foudre aseryne + enseignement du Créateur",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Créateur — Foudre originelle",
    "effect": "Prérequis : Foudre aseryne + enseignement du Créateur | R Lorsque le personnage le souhaite, ses attaques de Foudre deviennent originelles : DGT 9. La magie active et ses constructions deviennent des cibles valides : mur magique, manifestation élémentaire maintenue, familier constitué de magie, protection de Mageius, etc.",
    "runtimeLore": "Cette foudre remonte à une expression plus ancienne que les simples arcs électriques. Elle brûle le monde physique, mais sait aussi trouver un mur de sort, un familier constitué de magie ou une protection de Mageius comme s’ils possédaient leur propre conductivité."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_createur_foudre_originelle_brise_magie",
    "name": "Brise-magie",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Foudre originelle",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Créateur — Foudre originelle",
    "effect": "Prérequis : Foudre originelle | R — 1 PA L'Aseryn vise directement un effet magique actif. Effectuez un Jet de Foudre contre son résultat de lancement s'il est connu, sinon contre une difficulté 15 / 18 / 21 / 25 selon sa puissance. En réussite, un effet temporaire ou maintenu est détruit. Un enchantement permanent, un lieu magique ou un artefact majeur n'est au mieux neutralisé pour la scène que si sa nature permet réellement une interruption.",
    "runtimeLore": "La Foudre originelle de Dratyn reconnaît la magie comme une structure conductrice à briser. Au lieu de chercher une chair, la décharge s’accroche au sort actif et tente d’en disperser l’architecture."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_createur_foudre_originelle_deferlement_originel",
    "name": "Déferlement originel",
    "cost": 3,
    "access": "R",
    "prerequisiteName": "Brise-magie",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Créateur — Foudre originelle",
    "effect": "Prérequis : Brise-magie | R — 2 PA — 1/Scène Une attaque de Foudre originelle passe à DGT 13. Les Protections d'origine magique ne réduisent pas ses dégâts. Si la cible est elle-même une manifestation magique, le résultat du Jet peut également servir à la briser selon Brise-magie, sans second jet.",
    "runtimeLore": "Quand Dratyn libère toute la violence de la Foudre originelle, protections et constructions magiques deviennent elles-mêmes matière à l’impact. La décharge frappe assez profondément pour blesser la cible et défaire, dans le même mouvement, ce qui était fait de magie."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_esprit_noire_foudre_noire_foudre",
    "name": "Noire-Foudre",
    "cost": 1,
    "access": "R",
    "prerequisiteName": "Foudre aseryne + enseignement de l’Esprit",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Esprit — Noire-Foudre",
    "effect": "Prérequis : Foudre aseryne + enseignement de l’Esprit | R La décharge devient presque invisible et ne révèle pas automatiquement la position de son utilisateur par un éclair lumineux. Elle peut affecter normalement les esprits, Ombres et créatures immatérielles ; contre une cible purement immatérielle, utilisez sa Défense occulte et sa Protection occulte plutôt que l'armure physique.",
    "runtimeLore": "La Noire-Foudre ressemble moins à un éclair qu’à une absence brusque de lumière dans le trajet de la décharge. Sa discrétion n’est qu’un effet secondaire : sa vraie singularité est d’être chez elle parmi Ombres, esprits et formes sans chair."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_esprit_noire_foudre_atteindre_l_immateriel",
    "name": "Atteindre l’immatériel",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Noire-Foudre",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Esprit — Noire-Foudre",
    "effect": "Prérequis : Noire-Foudre | R Lorsqu'il attaque une créature réellement immatérielle qu'il peut effectivement percevoir, les obstacles purement matériels ne lui fournissent pas de Protection et l'armure matérielle est ignorée. Ce Talent ne localise pas une cible inconnue et ne permet pas de frapper au hasard à travers plusieurs étages.",
    "runtimeLore": "La Noire-Foudre ne s’arrête pas devant une cloison qui n’existe que pour la matière. Si l’esprit visé est réellement perçu, la décharge suit sa présence immatérielle plutôt que le béton, le métal ou l’armure qu’un corps physique aurait utilisés."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_esprit_noire_foudre_fulguration_spirituelle",
    "name": "Fulguration spirituelle",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Noire-Foudre",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Esprit — Noire-Foudre",
    "effect": "Prérequis : Noire-Foudre | R — 1/Scène L'Aseryn peut viser la composante immatérielle d'un être seulement lorsque celle-ci est réellement exposée ou activement engagée : possession, projection astrale, forme spirituelle, pouvoir mental maintenu ou phénomène comparable. L'attaque est alors opposée à la Défense occulte et ignore les Protections purement matérielles. Les dégâts restent des PV normaux.",
    "runtimeLore": "Dratyn apprend à viser non le corps, mais la part spirituelle momentanément exposée par une possession, une projection ou un pouvoir mental maintenu. La fulguration traverse alors les défenses matérielles pour heurter ce qui agit réellement derrière elles."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_esprit_noire_foudre_eclipse_noire",
    "name": "Éclipse noire",
    "cost": 3,
    "access": "R",
    "prerequisiteName": "Fulguration spirituelle",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Esprit — Noire-Foudre",
    "effect": "Prérequis : Fulguration spirituelle | R — 2 PA — 1/Scène Contre un esprit, une Ombre, une construction immatérielle ou un phénomène magique principalement métaphysique : DGT 9, sans Protection matérielle. Si la cible est un effet plutôt qu'une créature et que le Jet dépasse sa difficulté ou son résultat d'origine, l'effet est détruit.",
    "runtimeLore": "L’Éclipse noire est une tempête réduite à ce qui peut mourir sans corps. Esprits, Ombres et phénomènes métaphysiques reçoivent une décharge dont la violence n’a aucun besoin de traverser une armure matérielle."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_erosion_foudre_vaporeuse_foudre_vaporeuse",
    "name": "Foudre vaporeuse",
    "cost": 1,
    "access": "R",
    "prerequisiteName": "Foudre aseryne + enseignement de l’Érosion",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Érosion — Foudre vaporeuse",
    "effect": "Prérequis : Foudre aseryne + enseignement de l’Érosion | R Après une attaque réussie, l'Aseryn peut sacrifier 2 points de dégâts. Une Protection directement touchée est alors réduite de 2 jusqu'à la fin de la scène. Une même Protection ne peut subir cette réduction qu'une fois par cette version du Talent. La Foudre peut dégrader une armure physique ordinaire même si celle-ci n'aurait pas protégé contre la décharge elle-même, afin d'ouvrir la cible aux attaques des alliés.",
    "runtimeLore": "La Foudre vaporeuse laisse derrière elle moins une brûlure qu’une usure. Protection, armure ou barrière directement frappée se délite, comme si la décharge avait arraché une couche de cohésion destinée à ne pas revenir avant la fin de l’affrontement."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_erosion_foudre_vaporeuse_eroder_l_affliction",
    "name": "Éroder l’affliction",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Foudre vaporeuse",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Érosion — Foudre vaporeuse",
    "effect": "Prérequis : Foudre vaporeuse | R — 1 PA Une malédiction, corruption, maladie surnaturelle ou altération occulte active peut être ciblée directement. Jet de Foudre contre son résultat d'origine ou une difficulté 15 / 18 / 21 / 25. En réussite, l'affliction est affaiblie pour la scène : un malus chiffré est réduit de 3 ; si elle impose des tests de résistance, leur difficulté baisse d'un niveau. L'effet n'est pas nécessairement guéri.",
    "runtimeLore": "L’Érosion peut cibler une affliction plutôt que celui qui la porte. La Foudre vaporeuse travaille sur la malédiction, la corruption ou la maladie surnaturelle comme sur une matière friable, diminuant son emprise sans prétendre avoir déjà guéri sa victime."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_erosion_foudre_vaporeuse_ruine_des_protections",
    "name": "Ruine des protections",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Foudre vaporeuse",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Érosion — Foudre vaporeuse",
    "effect": "Prérequis : Foudre vaporeuse | R La réduction de Protection de Foudre vaporeuse passe de -2 à -3 et peut affecter une Protection issue d'un pouvoir surnaturel même sans matérialité physique.",
    "runtimeLore": "En approfondissant l’Érosion, l’Aseryn ne distingue plus une plaque d’acier d’une protection surnaturelle par principe. Toute défense qui possède une cohérence propre peut être rongée lorsque la Foudre vaporeuse trouve réellement son point d’appui."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_erosion_foudre_vaporeuse_reduire_en_poussiere",
    "name": "Réduire en poussière",
    "cost": 3,
    "access": "R",
    "prerequisiteName": "Éroder l’affliction",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Érosion — Foudre vaporeuse",
    "effect": "Prérequis : Éroder l’affliction | R — 1/Scène Après avoir réussi à cibler directement une malédiction, corruption, protection surnaturelle, effet magique ou manifestation immatérielle, l'Aseryn peut pousser l'Érosion jusqu'à la rupture. Si l'effet n'est ni primordial ni explicitement indestructible, il est supprimé pour la scène. S'il était déjà temporaire, il est détruit définitivement ; une altération durable peut revenir ensuite.",
    "runtimeLore": "Une altération déjà suffisamment érodée peut finalement perdre sa capacité à se maintenir. L’Aseryn pousse la dégradation jusqu’au seuil où la malédiction, la protection ou la manifestation doit s’effondrer au lieu de seulement s’affaiblir."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_fin_foudre_du_silence_foudre_du_silence",
    "name": "Foudre du Silence",
    "cost": 1,
    "access": "R",
    "prerequisiteName": "Foudre aseryne + enseignement de la Fin",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Fin — Foudre du Silence",
    "effect": "Prérequis : Foudre aseryne + enseignement de la Fin | R La décharge ne produit pratiquement ni tonnerre ni crépitement. DGT 7. Hors attaque, l'Aseryn peut appliquer son effet d'effacement avec une extrême précision pour graver, sectionner ou supprimer de très petites quantités de matière sans ravager ce qui les entoure, lorsque la fiction le permet.",
    "runtimeLore": "La Foudre du Silence est presque muette parce qu’une part de ce qu’elle touche est simplement retranchée. Employée avec finesse, cette même logique permet de sectionner ou d’effacer une quantité minuscule de matière sans ravager tout ce qui l’entoure."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_fin_foudre_du_silence_trace_du_neant",
    "name": "Trace du Néant",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Foudre du Silence",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Fin — Foudre du Silence",
    "effect": "Prérequis : Foudre du Silence | R Les dégâts infligés par la Foudre du Silence ne peuvent pas être récupérés par une Régénération surnaturelle avant la fin de la scène. Contre un Fléau ou une engeance directement issue d'un Fléau, cette propriété affecte réellement les mécanismes qui lui permettent de persister.",
    "runtimeLore": "Une plaie laissée par le Silence ne se referme pas surnaturellement comme une blessure ordinaire. Le Néant a touché l’endroit, et les forces qui reconstruisent d’habitude la chair ou les engeances d’un Fléau n’y trouvent plus immédiatement de prise."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_fin_foudre_du_silence_trait_du_silence",
    "name": "Trait du Silence",
    "cost": 2,
    "access": "R",
    "prerequisiteName": "Foudre du Silence",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Fin — Foudre du Silence",
    "effect": "Prérequis : Foudre du Silence | R — 2 PA — 1/Scène L'Aseryn concentre la Foudre du Silence en un trait extrêmement fin : DGT 9. Toute Protection électrique réellement applicable est divisée par deux, arrondie à l'inférieur. Lorsque la marge et la situation le permettent, le Trait peut effacer un composant physique précis ; il ne permet jamais d'annoncer arbitrairement « j'efface son cerveau » sur une réussite ordinaire.",
    "runtimeLore": "Le Trait du Silence concentre la Fin dans une ligne assez fine pour chercher une pièce plutôt qu’une masse. Blindage électrique et matière sont forcés de composer avec une attaque qui veut retrancher précisément ce qu’elle a réussi à atteindre."
  },
  {
    "id": "aseryn_dratyn_la_maitresse_de_la_foudre_specialisation_de_foudre_fin_foudre_du_silence_fin_veritable",
    "name": "Fin véritable",
    "cost": 3,
    "access": "R",
    "prerequisiteName": "Trace du Néant + Trait du Silence",
    "group": "Dratyn — la Maîtresse de la Foudre › Spécialisation de Foudre › Fin — Foudre du Silence",
    "effect": "Prérequis : Trace du Néant + Trait du Silence | R — Passif Lorsqu'un Fléau ou une de ses engeances subit de la Foudre du Silence et remplit les conditions qui permettraient réellement sa destruction, ses mécanismes habituels de régénération, reconstitution, retour depuis des restes, transfert dans une autre enveloppe ou survie par simple persistance surnaturelle ne suffisent pas automatiquement à l'en sauver. Le Talent ne contourne jamais les conditions narratives nécessaires pour rendre un Fléau majeur vulnérable.",
    "runtimeLore": "La Fin ne se contente pas de blesser ce qui devrait un jour disparaître. Lorsqu’un Fléau a enfin été rendu réellement vulnérable, la trace du Silence l’empêche de transformer sa vieille persistance en échappatoire automatique."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_technique_commune_nom_des_ancetres",
    "name": "Nom des Ancêtres",
    "cost": 1,
    "access": "V/SR/R",
    "prerequisiteName": "",
    "group": "Conseil de la Foudre › Technique commune",
    "effect": "V/SR/R Le personnage a été formé aux généalogies, récits et identités spirituelles du Conseil. Lorsqu'un esprit lié au Conseil se présente, Esprit + Connaissance appropriée permet de l'identifier par son comportement, son langage, ses souvenirs exprimés et les rites qui lui sont associés ; +3 s'il s'agit d'un Ancêtre officiellement conservé par sa propre communauté.",
    "runtimeLore": "Le Conseil enseigne les morts comme une lignée encore présente, pas comme un catalogue abstrait. Noms, récits, habitudes et rites permettent à l’Aseryn de reconnaître quel Ancêtre lui parle lorsque sa communauté en a conservé la mémoire."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_des_ancetres_ecouter_les_ancetres",
    "name": "Écouter les Ancêtres",
    "cost": 1,
    "access": "",
    "prerequisiteName": "",
    "group": "Conseil de la Foudre › Voie des Ancêtres",
    "effect": "Rituel Auprès d'un esprit du Conseil auquel le personnage a réellement accès, il peut demander conseil sur un sujet que cet Ancêtre a pu connaître ou comprendre. Le MJ répond selon les connaissances, la personnalité et le point de vue du mort ; aucun esprit n'est omniscient.",
    "runtimeLore": "Écouter les Ancêtres consiste à demander aux morts ce qu’ils peuvent réellement savoir. La réponse porte leur caractère, leurs souvenirs et parfois leurs angles morts, parce que mourir n’a jamais rendu quelqu’un omniscient."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_des_ancetres_memoire_empruntee",
    "name": "Mémoire empruntée",
    "cost": 2,
    "access": "",
    "prerequisiteName": "Écouter les Ancêtres",
    "group": "Conseil de la Foudre › Voie des Ancêtres",
    "effect": "Prérequis : Écouter les Ancêtres | 1/Scène Après une véritable communion avec un Ancêtre compétent dans un domaine, le personnage reçoit +3 à un test précis auquel l'expérience de l'Ancêtre s'applique réellement. Le bonus ne donne pas accès à une capacité surnaturelle ou physique que le corps du personnage ne peut exécuter.",
    "runtimeLore": "Un Ancêtre compétent peut prêter sa manière de penser le temps d’un geste précis. Le vivant conserve son propre corps, mais une expérience étrangère lui souffle l’ordre juste des étapes qu’elle a répétées autrefois."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_des_ancetres_conseil_des_morts",
    "name": "Conseil des morts",
    "cost": 3,
    "access": "",
    "prerequisiteName": "Mémoire empruntée",
    "group": "Conseil de la Foudre › Voie des Ancêtres",
    "effect": "Prérequis : Mémoire empruntée | 1/Scénario Après avoir consulté plusieurs Ancêtres pertinents sur une décision importante, le joueur peut demander : « Parmi les options que nous avons identifiées, laquelle les Ancêtres considéreraient-ils comme la moins dangereuse, et pourquoi ? » La réponse reflète leurs connaissances et leur jugement, pas une prédiction parfaite du futur.",
    "runtimeLore": "Les Ancêtres n’annoncent pas l’avenir : ils comparent le dilemme actuel à leurs propres vies. En les consultant réellement, l’Aseryn reçoit le choix qu’ils jugeraient le moins dangereux, avec les raisons et les préjugés de ceux qui parlent."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_du_vaisseau_accueil_du_mort",
    "name": "Accueil du mort",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Conseil de la Foudre › Voie du Vaisseau",
    "effect": "SR/R — Rituel Le personnage peut servir volontairement de Vaisseau à un Ancêtre consentant. Il reste conscient ; l'Ancêtre peut percevoir et parler à travers lui sans prendre automatiquement le contrôle du corps. Hors d'un lieu rituellement sûr, la possession dure au maximum une scène sauf ancrage exceptionnel établi par le scénario.",
    "runtimeLore": "Le Vaisseau offre volontairement sa chair comme lieu d’accueil à un Ancêtre consentant. Deux consciences partagent alors la même enveloppe sans que le mort devienne automatiquement maître des gestes du vivant."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_du_vaisseau_main_de_l_ancetre",
    "name": "Main de l’Ancêtre",
    "cost": 2,
    "access": "",
    "prerequisiteName": "Accueil du mort",
    "group": "Conseil de la Foudre › Voie du Vaisseau",
    "effect": "Prérequis : Accueil du mort | 1/Scène Pendant une possession coopérative, un Ancêtre possédant réellement l'expertise pertinente peut guider une action : +3 au test concerné. Si le personnage possède 0 dans la Compétence, l'Ancêtre peut permettre le test quand il s'agit principalement de connaissance, procédure ou coordination ; il ne lui prête pas une capacité physique inexistante.",
    "runtimeLore": "Pendant une possession coopérative, une main peut être guidée par quelqu’un qui a accompli ce geste toute une vie. L’Ancêtre corrige procédure et coordination, sans pouvoir inventer dans le corps vivant une aptitude physique qu’il ne possède pas."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_du_vaisseau_laisser_la_place",
    "name": "Laisser la place",
    "cost": 3,
    "access": "",
    "prerequisiteName": "Main de l’Ancêtre",
    "group": "Conseil de la Foudre › Voie du Vaisseau",
    "effect": "Prérequis : Main de l’Ancêtre | 1/Scène Pour une action complexe ou une très courte séquence cohérente, le personnage laisse l'Ancêtre prendre réellement le contrôle moteur. L'action reçoit +3 si elle correspond à une expertise réelle de l'Ancêtre. Le corps conserve ses propres Attributs, PV, Talents et limites physiques ; aucun tour ni PA supplémentaire n'est créé.",
    "runtimeLore": "Dans un moment choisi, le Vaisseau cesse de seulement écouter et laisse l’Ancêtre prendre les commandes. La vieille expertise retrouve alors des mains nouvelles, mais demeure prisonnière de la force, des blessures et des capacités du corps qui l’héberge."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_du_gardien_de_la_grotte_sens_des_morts",
    "name": "Sens des morts",
    "cost": 1,
    "access": "SR/R",
    "prerequisiteName": "",
    "group": "Conseil de la Foudre › Voie du Gardien de la Grotte",
    "effect": "SR/R — Passif Le personnage perçoit la présence immédiate d'un esprit désincarné ou d'une possession active à proximité. Il ne connaît pas automatiquement l'identité, les intentions ou la position exacte derrière un obstacle. Esprit + Perception permet d'affiner la localisation ou l'état.",
    "runtimeLore": "Les morts ont pour le Gardien une présence différente du silence ordinaire. Une désincarnation ou une possession active trouble immédiatement son environnement spirituel, sans lui livrer pour autant le nom ni l’intention de ce qui se tient là."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_du_gardien_de_la_grotte_fermer_la_porte",
    "name": "Fermer la porte",
    "cost": 2,
    "access": "",
    "prerequisiteName": "Sens des morts",
    "group": "Conseil de la Foudre › Voie du Gardien de la Grotte",
    "effect": "Prérequis : Sens des morts | Réaction — 1/Scène Lorsqu'une créature à courte portée doit résister à une possession ou une intrusion spirituelle, le Gardien peut lui fournir Assistance +2, même en combat. S'il est lui-même la cible, il reçoit directement +3 au test de résistance.",
    "runtimeLore": "Fermer la porte revient à renforcer la frontière d’une âme au moment où quelque chose tente de la franchir. Le Gardien transmet ce réflexe de clôture à un proche, ou le resserre autour de lui-même lorsqu’il est visé."
  },
  {
    "id": "aseryn_conseil_de_la_foudre_voie_du_gardien_de_la_grotte_expulsion_rituelle",
    "name": "Expulsion rituelle",
    "cost": 3,
    "access": "SR/R",
    "prerequisiteName": "Fermer la porte",
    "group": "Conseil de la Foudre › Voie du Gardien de la Grotte",
    "effect": "Prérequis : Fermer la porte | SR/R — 2 PA sous pression Sur une personne possédée, Volonté + Maîtrise spirituelle + 1d10e contre la Défense occulte ou la résistance de l'entité. En réussite, l'esprit est forcé de quitter l'hôte. Il n'est ni détruit, ni banni définitivement, ni automatiquement renvoyé à la Grotte.",
    "runtimeLore": "Le Gardien de la Grotte sait où couper le lien qui permet à un esprit d’habiter un autre corps. L’expulsion rend l’hôte à lui-même, sans prétendre détruire l’intrus ni décider où celui-ci ira ensuite."
  }
] as const;
