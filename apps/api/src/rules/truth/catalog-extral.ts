// Generated from the final V1 Builder runtime audit. Do not hand-edit.
export const truthCatalogExtral = [
  {
    "id": "extral-rebond-d-appui",
    "name": "Rebond d’appui",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Lors d'un Déplacement effectué principalement par bonds, le Talass peut utiliser : mur ; mobilier ; plafond ; véhicule ; autre surface suffisamment solide comme point d'appui pour changer brutalement de direction. Il n'a pas besoin de reprendre son élan entre deux bonds. Ça ne rallonge pas à lui seul la distance normale de Déplacement.",
    "group": "Talass › Voie I — Cinétique segmentaire — 8 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Le Talass traite chaque surface solide comme une occasion de rediriger son mouvement. Mur, plafond ou mobilier devient un appui fugace qui casse la trajectoire sans exiger un nouvel élan."
  },
  {
    "id": "extral-zero-g-natif",
    "name": "Zéro-G natif",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Rebond d'appui",
    "effect": "Le Talass ne subit pas de difficulté simplement parce qu'il évolue : en apesanteur ; en gravité très faible ; dans une structure où « haut » et « bas » changent constamment. Tant qu'une surface est accessible, il peut s'y accrocher puis se propulser normalement. Ça ne lui donne évidemment pas de propulsion dans le vide absolu sans aucun point d'appui.",
    "group": "Talass › Voie I — Cinétique segmentaire — 8 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Pour un Talass, l’apesanteur n’est pas une perte de repères mais un environnement normal. Tant qu’un support existe, il se fixe puis se propulse avec la même assurance qu’une créature terrestre marche sur son sol."
  },
  {
    "id": "extral-detachement-reflexe",
    "name": "Détachement réflexe",
    "cost": 2,
    "access": "R",
    "activation": "Réaction — 1/Scène",
    "prerequisiteName": "",
    "effect": "Lorsqu'un segment périphérique est : saisi ; coincé ; attaché ; happé par un mécanisme le Talass peut volontairement le détacher. Il se libère immédiatement de cette contrainte précise. Le détachement ne provoque aucun dégât supplémentaire, mais : le segment est réellement perdu jusqu'à ce qu'il soit récupéré, remplacé ou réattaché. Un Talass qui abandonne sa main pour échapper à des menottes n'a plus cette main cinq secondes plus tard par magie. Le Talent ne fonctionne jamais sur le segment vital.",
    "group": "Talass › Voie I — Cinétique segmentaire — 8 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Un segment Talass peut être abandonné plutôt que devenir le point par lequel tout le corps est capturé. La perte est réelle, mais la liberté immédiate vaut parfois davantage qu’un membre périphérique récupérable plus tard."
  },
  {
    "id": "extral-trajectoire-impossible",
    "name": "Trajectoire impossible",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Rebond d'appui",
    "effect": "Lors d'un Déplacement, le Talass peut enchaîner ses bonds sur les surfaces environnantes de manière complètement imprévisible. Pour ce Déplacement : murs et plafonds utilisables ne réclament aucun PA supplémentaire ; les franchissements ordinaires ne demandent pas de test d'Athlétisme ; jusqu'au début de son prochain tour, une attaque reposant sur l'anticipation de sa trajectoire subit une circonstance défavorable de −3. Ne fonctionne évidemment pas dans un espace totalement ouvert sans surfaces permettant ces rebonds.",
    "group": "Talass › Voie I — Cinétique segmentaire — 8 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Une pièce pleine d’obstacles devient un réseau de vecteurs pour le Talass. Bonds et appuis s’enchaînent si vite que prévoir sa position suivante devient plus difficile que simplement le suivre des yeux."
  },
  {
    "id": "extral-vision-des-fractures",
    "name": "Vision des fractures",
    "cost": 1,
    "access": "SR/R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Le Talass perçoit directement : brèche dimensionnelle active ; perturbation importante du continuum ; résidu récent d'une ouverture vers l'Espace N/Néant. Il n'en connaît pas automatiquement : la cause ; la destination ; la dangerosité. Il sait simplement : « l'espace n'est pas normal ici ».",
    "group": "Talass › Voie II — Trame de soie — 7 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Les Talass sentent certaines blessures de l’espace comme d’autres sentent une odeur de brûlé. Brèche dimensionnelle, résidu de Néant ou continuité troublée indiquent que le lieu n’est plus parfaitement normal, sans expliquer pourquoi."
  },
  {
    "id": "extral-trame-sensible",
    "name": "Trame sensible",
    "cost": 1,
    "access": "R",
    "activation": "préparation : quelques minutes",
    "prerequisiteName": "",
    "effect": "Le Talass peut déployer une très fine toile de soie sur une petite zone. Tant qu'il reste connecté à la trame, il ressent : rupture d'un fil ; traction ; vibration ; contact significatif. Il peut donc identifier approximativement où la toile a été perturbée. Elle n'identifie pas ce qui l'a touchée.",
    "group": "Talass › Voie II — Trame de soie — 7 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "La soie fine devient un organe étendu tant que le Talass y reste relié. Toute traction ou rupture significative revient jusqu’à lui comme une vibration localisable sans révéler ce qui a touché le fil."
  },
  {
    "id": "extral-relais-conducteur",
    "name": "Relais conducteur",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Trame sensible",
    "effect": "La soie produite par le Talass peut servir de conducteur fiable à des effets appropriés : signal électrique ; données compatibles ; Talwa’Etax ; phénomène magique fonctionnant réellement par conduction/contact. Le personnage peut traiter l'autre extrémité d'un fil continu comme un point de contact distant. Le Talent : n'augmente jamais la puissance ; ne permet pas de traverser une protection qui arrêterait normalement l'effet ; ne rend pas offensif un phénomène qui ne l'était pas.",
    "group": "Talass › Voie II — Trame de soie — 7 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "La soie Talass peut transporter ce qui accepte vraiment la conduction : charge, données, Talwa ou contact magique approprié. Le fil ne crée aucune puissance ; il déplace simplement le point où elle peut passer."
  },
  {
    "id": "extral-reseau-de-soie",
    "name": "Réseau de soie",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Relais conducteur",
    "effect": "Le Talass peut construire une trame reliant plusieurs points d'une même zone. Pour ses propres effets compatibles : tous les nœuds de la trame sont considérés comme directement reliés. Il peut ainsi : interroger plusieurs capteurs ; transmettre un signal ; utiliser son Talwa depuis un autre point du réseau ; centraliser les informations de plusieurs fils sensibles. Un réseau typique couvre : une pièce, un petit atelier, l'intérieur d'un véhicule ou une zone comparable. Pas un quartier entier.",
    "group": "Talass › Voie II — Trame de soie — 7 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Une trame relie plusieurs nœuds du même espace et transforme la zone en petit réseau physique. Capteurs, signaux et Talwa peuvent y circuler comme s’ils partageaient une même architecture câblée."
  },
  {
    "id": "extral-projection-du-talwa",
    "name": "Projection du Talwa",
    "cost": 1,
    "access": "SR/R",
    "activation": "Actif — 1 PA",
    "prerequisiteName": "",
    "effect": "Le Talass projette brièvement son sens psychique autour de lui. Dans une pièce ou environ 10 mètres, il obtient une perception grossière : volumes ; masses ; obstacles ; êtres en mouvement. Il ne reconnaît pas automatiquement les individus et ne lit aucune pensée. Les barrières dimensionnelles véritables bloquent le scan.",
    "group": "Talass › Voie III — Talwa’Etax — 7 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Le Talass étend brièvement sa perception psychique à la pièce. Masses, volumes et mouvements apparaissent comme un relief grossier, assez pour comprendre l’espace mais trop pauvre pour lire des pensées ou reconnaître chaque individu."
  },
  {
    "id": "extral-lien-talwa",
    "name": "Lien Talwa",
    "cost": 1,
    "access": "SR/R",
    "activation": "Actif — cible consentante",
    "prerequisiteName": "",
    "effect": "Le Talass établit avec une créature proche un lien télépathique simple. Ils peuvent échanger : mots mentaux ; images simples ; impressions sensorielles élémentaires. Le lien dure jusqu'à la fin de la scène tant qu'ils restent raisonnablement proches.",
    "group": "Talass › Voie III — Talwa’Etax — 7 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Le Talwa peut devenir fil mental entre deux êtres proches. Pensées formulées, images simples et impressions élémentaires circulent volontairement sans ouvrir pour autant l’ensemble de l’esprit de l’un à l’autre."
  },
  {
    "id": "extral-main-du-talwa",
    "name": "Main du Talwa",
    "cost": 2,
    "access": "SR/R",
    "activation": "",
    "prerequisiteName": "Projection du Talwa",
    "effect": "Le personnage manipule télékinétiquement un petit objet situé dans la zone de son Talwa. Il peut : déplacer ; tirer ; pousser ; tourner ; actionner un mécanisme léger. La précision peut nécessiter un test approprié. Cette Technique ne permet pas encore : d'étrangler quelqu'un ; de projeter un adversaire ; de transformer chaque stylo en projectile mortel.",
    "group": "Talass › Voie III — Talwa’Etax — 7 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Le Talwa saisit un petit objet à distance comme une main légère sans doigts visibles. Il pousse, tourne ou actionne ce que sa puissance permet, sans transformer la télékinésie en arme absolue contre les corps."
  },
  {
    "id": "extral-champ-entropique",
    "name": "Champ entropique",
    "cost": 3,
    "access": "SR/R",
    "activation": "",
    "prerequisiteName": "Projection du Talwa",
    "effect": "Après une Projection du Talwa, le Talass peut maintenir une empreinte psychique de la zone jusqu'à la fin de la scène. Il perçoit alors tout déplacement significatif dans cette zone : même si la créature se déplace furtivement. Il obtient : direction ; position approximative ; importance grossière du déplacement. Pas identité, nature ou intentions. Une créature parfaitement immobile ne produit pas cette perturbation.",
    "group": "Talass › Voie III — Talwa’Etax — 7 PTV",
    "when": {
      "species": "talass"
    },
    "runtimeLore": "Après avoir projeté son Talwa, le Talass garde une empreinte psychique du volume exploré. Un déplacement important qui traverse cette empreinte trouble le champ et révèle direction et position approximatives."
  },
  {
    "id": "extral-poussee-hormonale",
    "name": "Poussée hormonale",
    "cost": 1,
    "access": "R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Avant un test reposant directement sur : Vigueur ; Agilité ; Athlétisme ; combat physique le Mo'sen libère brutalement de la Mosenine. Le test bénéficie d'une : circonstance favorable +3.",
    "group": "Mo’sen › Voie I — Mosenine — 8 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Avant l’effort, le Mo’sen déclenche une décharge endocrinienne calibrée pour ce geste précis. Force, vitesse ou coordination bénéficient de cette montée sans modifier durablement son organisme."
  },
  {
    "id": "extral-reflexe-de-chasse",
    "name": "Réflexe de chasse",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Poussée hormonale",
    "effect": "Lorsqu'il est attaqué et qu'il n'est pas surpris, le Mo'sen peut effectuer une Défense active sans dépenser le PA normalement requis. Ça ne lui permet pas de défendre activement s'il est réellement surpris.",
    "group": "Mo’sen › Voie I — Mosenine — 8 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Le prédateur défend avant d’avoir décidé de défendre. Tant qu’il n’est pas véritablement surpris, la perception de l’attaque suffit à déclencher une réponse corporelle plus rapide que le coût normal d’une garde consciente."
  },
  {
    "id": "extral-surpuissance",
    "name": "Surpuissance",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Poussée hormonale",
    "effect": "Pendant un round, le personnage compte sa Vigueur comme supérieure de 2 uniquement pour : soulever ; pousser ; retenir ; forcer ; lutter physiquement contre une prise. Cette hausse : n'augmente pas ses PV ; n'augmente pas les dégâts ; ne modifie aucune autre valeur dérivée.",
    "group": "Mo’sen › Voie I — Mosenine — 8 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "La Mosenine peut détourner tout le corps vers l’effort de force brute. Pendant quelques secondes, chaque groupe musculaire sert à pousser, retenir ou arracher, sans transformer cette surcharge en réserve de vie ou en dégâts supplémentaires."
  },
  {
    "id": "extral-crete-de-mosenine",
    "name": "Crête de Mosenine",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Réflexe de chasse + Surpuissance",
    "effect": "Au début de son tour, le Mo'sen obtient : +1 PA pour ce round. Ce PA supplémentaire ne peut servir qu'à : Déplacement ; Pugilat ; Mêlée ; Défense active ; action physique significative. Après la fin du round, aucune autre Technique de Mosenine ne peut être utilisée jusqu'à la fin de la scène.",
    "group": "Mo’sen › Voie I — Mosenine — 8 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "La crête libère d’un seul coup la Mosenine accumulée. Le Mo’sen gagne une poussée physique immédiate, mais son organisme entre ensuite dans une phase où aucune nouvelle pointe hormonale comparable ne peut être rappelée."
  },
  {
    "id": "extral-thermovision",
    "name": "Thermovision",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Le Mo'sen peut percevoir naturellement les différences thermiques importantes. Il distingue notamment un organisme chaud : dans l'obscurité ; dans une fumée légère ; derrière un camouflage visuel ordinaire. Une isolation thermique appropriée fonctionne normalement.",
    "group": "Mo’sen › Voie II — Sens du prédateur — 7 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "La chaleur devient une couche naturelle de la vision Mo’sen. Un corps chaud se détache dans l’obscurité ou la fumée légère tant que rien n’isole réellement sa signature thermique."
  },
  {
    "id": "extral-gouter-l-air",
    "name": "Goûter l'air",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Les organes sensoriels du Mo'sen lui permettent de « goûter » chimiquement son environnement. Il peut remarquer : présence récente d'un individu ; sang ; fumée ; substance volatile ; contamination évidente. L'analyse précise demande toujours une compétence adaptée.",
    "group": "Mo’sen › Voie II — Sens du prédateur — 7 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Le Mo’sen lit la chimie ambiante avec ses organes sensoriels. Sang, fumée, passage récent ou contamination volatile laissent dans l’air un goût distinct, indice biologique plutôt qu’analyse de laboratoire."
  },
  {
    "id": "extral-triangulation-predatrice",
    "name": "Triangulation prédatrice",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Thermovision ou Goûter l'air",
    "effect": "Lorsqu'une créature proche tente de se dissimuler sans être : hermétiquement isolée ; thermiquement masquée ; totalement immobile le Mo'sen peut opposer sa Perception à sa furtivité même sans ligne de vue parfaite. Il utilise l'ensemble : chaleur + odeur + vibrations + sons graves.",
    "group": "Mo’sen › Voie II — Sens du prédateur — 7 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Odeur, chaleur, vibrations et sons graves ne sont jamais évalués séparément. Le Mo’sen les croise instinctivement jusqu’à reconstituer où se cache une proie que les yeux seuls ne pourraient plus suivre."
  },
  {
    "id": "extral-verrou-sensoriel",
    "name": "Verrou sensoriel",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Triangulation prédatrice",
    "effect": "Après avoir effectivement détecté une cible, le Mo'sen peut mémoriser sa signature sensorielle. Jusqu'à la fin de la scène, tant qu'elle reste à courte distance, il connaît approximativement sa position même : dans l'obscurité ; derrière une couverture visuelle ; dans une foule. Le verrou se brise si la cible : quitte réellement la zone ; se place derrière une isolation appropriée ; neutralise explicitement les signatures utilisées.",
    "group": "Mo’sen › Voie II — Sens du prédateur — 7 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Une cible correctement détectée laisse dans la mémoire sensorielle une signature composite. Tant qu’elle reste proche et ne masque pas réellement ses traces, le Mo’sen continue d’en sentir la position approximative à travers foule et obscurité."
  },
  {
    "id": "extral-digestion-selective",
    "name": "Digestion sélective",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Lorsqu'un poison ou une toxine a été ingéré, le Mo'sen bénéficie de : +3 à son test de résistance. Il ne s'agit pas d'une immunité universelle aux poisons.",
    "group": "Mo’sen › Voie III — Cuirasse métabolique — 8 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Le système digestif Mo’sen filtre avec une efficacité prédatrice ce qui a été avalé. Les toxines ingérées rencontrent une chimie faite pour trier nourriture et menace plutôt qu’un simple estomac humanoïde."
  },
  {
    "id": "extral-osteodermes-renforces",
    "name": "Ostéodermes renforcés",
    "cost": 2,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "L’Armure corporelle du Mo'sen passe de : 1 à 2.",
    "group": "Mo’sen › Voie III — Cuirasse métabolique — 8 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Les plaques sous-cutanées s’épaississent jusqu’à constituer une protection permanente. Le Mo’sen porte désormais sur lui une armure vivante plus dense, issue de sa propre croissance plutôt que d’un équipement ajouté."
  },
  {
    "id": "extral-angle-de-cuirasse",
    "name": "Angle de cuirasse",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Ostéodermes renforcés",
    "effect": "Quand une attaque touche une zone naturellement très protégée et que le Mo'sen la voit venir, il peut présenter volontairement ses plaques les plus épaisses. Après application de l'armure : réduire encore les dégâts de 1. Ne fonctionne pas sur une attaque visant explicitement une zone peu cuirassée.",
    "group": "Mo’sen › Voie III — Cuirasse métabolique — 8 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Le Mo’sen sait offrir à l’impact la partie la plus dure de ses plaques. Voir venir le coup lui permet de tourner juste assez pour que la zone naturellement blindée absorbe une part supplémentaire de la violence."
  },
  {
    "id": "extral-carapace-de-combat",
    "name": "Carapace de combat",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Ostéodermes renforcés + Angle de cuirasse",
    "effect": "Pendant un round : Armure corporelle +1 supplémentaire. Donc Protection 3 avec Ostéodermes renforcés. Le Mo'sen contracte muscles et plaques pour transformer momentanément son corps en bunker biologique.",
    "group": "Mo’sen › Voie III — Cuirasse métabolique — 8 PTV",
    "when": {
      "species": "mosen"
    },
    "runtimeLore": "Muscles et ostéodermes se contractent ensemble et transforment momentanément la peau en véritable cuirasse biologique. La mobilité reste possible, mais chaque mouvement se fait dans un corps devenu plus fermé et plus dense."
  },
  {
    "id": "extral-culture-de-secours",
    "name": "Culture de secours",
    "cost": 1,
    "access": "R",
    "activation": "préparation",
    "prerequisiteName": "",
    "effect": "Le Baséanh sait produire des cultures biologiques simples permettant de remplacer le matériel médical de base : coagulant ; antiseptique ; gel nutritif ; agents réparateurs simples. Il peut donc effectuer les premiers soins ou une Stabilisation sans trousse médicale, avec les tests normaux.",
    "group": "Baséanh › Voie I — Pharmacopée des Tardollas — 8 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Pour un Baséanh, beaucoup d’outils médicaux sont d’abord des fonctions biologiques. Coagulant, antiseptique ou gel nutritif peuvent être cultivés sur place lorsque la trousse manque mais que la vie doit être stabilisée."
  },
  {
    "id": "extral-antidote-cible",
    "name": "Antidote ciblé",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Culture de secours",
    "effect": "Après avoir obtenu un échantillon d'un poison, toxique ou agent infectieux encore actif, le Baséanh peut produire un contre-agent temporaire. Une cible traitée peut effectuer : un nouveau test de résistance avec +3. Ça ne ressuscite pas un mort et ne retire pas des dégâts déjà infligés.",
    "group": "Baséanh › Voie I — Pharmacopée des Tardollas — 8 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "La pharmacopée baséanne part toujours d’un agent réel. Une fois poison ou infection étudié, le Baséanh cultive un contre-agent conçu pour offrir au corps une seconde occasion de résister plutôt qu’une guérison miraculeuse."
  },
  {
    "id": "extral-catalyse-therapeutique",
    "name": "Catalyse thérapeutique",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Culture de secours",
    "effect": "Après environ 10 minutes de traitement : test de Médecine difficulté 15. En réussite : récupération de 2 + DR PV. Le Talent ne : régénère pas un membre ; supprime pas une séquelle ; fonctionne pas plusieurs fois sur la même cible dans la même scène.",
    "group": "Baséanh › Voie I — Pharmacopée des Tardollas — 8 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "La médecine baséanne accélère les processus que l’organisme possède déjà. Après quelques minutes de traitement, tissus et circulation reprennent plus efficacement leur travail, sans prétendre remplacer un membre ou effacer une séquelle."
  },
  {
    "id": "extral-banque-vivante",
    "name": "Banque vivante",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Antidote ciblé + Catalyse thérapeutique",
    "effect": "Le Baséanh peut maintenir : 4 préparations actives au lieu de 2. De plus, avec un échantillon biologique viable qu'il sait cultiver, il peut en créer une copie stable avant la fin de la scène sans laboratoire complet. Ça ne permet pas de reproduire : organisme immensément complexe ; artefact surnaturel ; propriété dont il ignore complètement le fonctionnement.",
    "group": "Baséanh › Voie I — Pharmacopée des Tardollas — 8 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Les Tardollas servent aussi de réserve biologique mobile. Un Baséanh expérimenté peut y maintenir davantage de préparations et conserver un échantillon viable assez longtemps pour le reproduire sans recréer ce qu’il ne comprend pas."
  },
  {
    "id": "extral-jet-glandulaire",
    "name": "Jet glandulaire",
    "cost": 1,
    "access": "R",
    "activation": "Actif — 1 PA",
    "prerequisiteName": "",
    "effect": "Le Baséanh peut expulser à courte portée le contenu d'une de ses Tardollas. Jet : Agilité + Tir + 1d10e contre la défense normale. L'effet dépend de la préparation projetée.",
    "group": "Baséanh › Voie II — Arsenal biologique — 8 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Les Tardollas ne servent pas qu’au soin. Le Baséanh peut projeter leur contenu à distance, transformant sa propre pharmacopée en vecteur de combat selon ce qu’il a réellement préparé."
  },
  {
    "id": "extral-toxine-cultivee",
    "name": "Toxine cultivée",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Jet glandulaire",
    "effect": "Le Baséanh peut préparer une neurotoxine de combat. Sur exposition suffisante : Vigueur + Constitution difficulté 15. En échec : −3 aux tests physiques jusqu'à la fin du prochain round. Une protection hermétique empêche normalement l'exposition.",
    "group": "Baséanh › Voie II — Arsenal biologique — 8 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Le Baséanh élève une neurotoxine comme d’autres préparent des munitions. Son efficacité dépend de l’exposition et de la physiologie de la cible, ce qui rend une protection hermétique aussi pertinente qu’une bonne résistance corporelle."
  },
  {
    "id": "extral-secretion-de-guerre",
    "name": "Sécrétion de guerre",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Jet glandulaire",
    "effect": "Lors de la culture, choisir : Corrosive attaque DGT 2 ; armure normale. ou : Adhésive un membre ou objet touché est collé ; pour se libérer : 1 PA + Vigueur + Athlétisme, difficulté 15. Sur un objet immobile, aucun jet d'attaque n'est nécessaire dans des conditions ordinaires.",
    "group": "Baséanh › Voie II — Arsenal biologique — 8 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Une Tardolla de guerre peut être cultivée pour ronger ou pour coller. Dans les deux cas, le Baséanh ne lance pas un pouvoir abstrait : il projette une substance réelle dont la chimie impose ensuite ses propres contraintes."
  },
  {
    "id": "extral-purge-explosive",
    "name": "Purge explosive",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Toxine cultivée ou Sécrétion de guerre",
    "effect": "Lorsqu'il est saisi ou menacé à très courte portée, le Baséanh peut brutalement vider ses Tardollas autour de lui. Il choisit une préparation offensive qu'il possède réellement. Toutes les créatures immédiatement au contact sont exposées à son effet. En contrepartie : toutes ses préparations actives sont perdues. Il ne peut pas conserver miraculeusement « celle qu'il n'a pas crachée ».",
    "group": "Baséanh › Voie II — Arsenal biologique — 8 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Acculé au contact, le Baséanh peut sacrifier tout son stock d’un coup. Les glandes se vident autour de lui dans une décharge biologique qui affecte chacun assez proche pour recevoir la préparation choisie."
  },
  {
    "id": "extral-coordination-independante",
    "name": "Coordination indépendante",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Les quatre mains peuvent être utilisées avec la même précision. Aucun malus dû uniquement à une « main non dominante ». Cela n'accorde toujours aucune attaque supplémentaire.",
    "group": "Baséanh › Voie III — Quadrimanie maîtrisée — 7 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Chez le Baséanh entraîné, aucune des quatre mains n’est une auxiliaire maladroite. Chacune peut prendre l’outil principal avec la même précision, même si cette quadrimanie n’invente jamais des actions supplémentaires."
  },
  {
    "id": "extral-ancrage-manuel",
    "name": "Ancrage manuel",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Pour une tâche de précision où le Baséanh peut utiliser ses membres supplémentaires pour se stabiliser : ignorer une circonstance défavorable provenant uniquement d'un support instable ou d'un mouvement du corps.",
    "group": "Baséanh › Voie III — Quadrimanie maîtrisée — 7 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Quatre membres permettent au Baséanh de créer son propre support. Sur une tâche fine, deux mains travaillent tandis que les autres stabilisent le corps ou l’outil, annulant l’instabilité que subirait un opérateur bipède."
  },
  {
    "id": "extral-deuxieme-paire-experte",
    "name": "Deuxième paire experte",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Coordination indépendante",
    "effect": "Lorsqu'une tâche manuelle bénéficierait réellement d'un assistant dont le rôle serait uniquement : tenir ; stabiliser ; présenter ; maintenir ouvert ; manipuler un second outil le Baséanh peut assurer lui-même ce rôle avec sa seconde paire de bras. Il reçoit alors : le bonus normal d'Assistance +2. Jamais sur : attaque ; Défense active ; pouvoir strictement personnel.",
    "group": "Baséanh › Voie III — Quadrimanie maîtrisée — 7 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Là où un technicien humain demanderait quelqu’un pour tenir, ouvrir ou présenter une pièce, le Baséanh emploie sa seconde paire de bras. Il devient son propre assistant tant que la tâche reste vraiment manuelle."
  },
  {
    "id": "extral-rechargement-quadrimanuel",
    "name": "Rechargement quadrimanuel",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Coordination indépendante",
    "effect": "Si : la munition est immédiatement accessible ; l'arme ou l'appareil peut raisonnablement être manipulé avec ses mains libres ; le Baséanh peut effectuer un Rechargement sans payer son PA normal. Ne fonctionne pas sur : arme lourde ; rechargement nécessitant installation ; dispositif demandant plusieurs étapes complexes.",
    "group": "Baséanh › Voie III — Quadrimanie maîtrisée — 7 PTV",
    "when": {
      "species": "baseanh"
    },
    "runtimeLore": "Une paire maintient l’arme pendant que l’autre nourrit le mécanisme. Sur les équipements adaptés, le rechargement cesse d’interrompre le rythme d’action du Baséanh parce que ses mains ne travaillent jamais toutes sur la même étape."
  },
  {
    "id": "extral-cicatrisation-humide",
    "name": "Cicatrisation humide",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Lorsque le Rocréen est immergé ou maintenu dans un environnement suffisamment humide pour hydrater complètement ses tissus : tout effet de Saignement ordinaire cesse immédiatement. Une blessure ainsi maintenue ne développe pas non plus normalement de complication infectieuse provenant simplement de son ouverture. De plus : toute récupération naturelle de PV hors combat est doublée tant qu’elle s’effectue dans ces conditions.",
    "group": "Rocréen › Voie I — Régénération du Noyau — 8 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Les tissus rocréens se réparent mieux lorsque l’eau les maintient dans leur milieu préféré. Saignement et infection ordinaire reculent, tandis que la récupération naturelle profite directement de cette hydratation complète."
  },
  {
    "id": "extral-regeneration-active",
    "name": "Régénération active",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Cicatrisation humide",
    "effect": "Si son noyau est intact, le Rocréen accélère brutalement sa reconstruction cellulaire : récupère 4 PV. S’il est alors immergé ou abondamment hydraté : récupère 6 PV à la place. Cette régénération peut refermer des plaies très importantes, mais ne fait pas repousser instantanément un membre entier pendant le combat : cela reste le domaine de Reconstruction organique. À 0 PV et Stabilisé, le Rocréen peut utiliser Régénération active au round suivant. Dans ce cas, l’utilisation occupe toute son activation et consomme tous les PA dont il dispose pour ce round, quel que soit leur nombre. Il peut rester immobile et donner l’impression d’être toujours hors de combat, mais ne peut pas régénérer puis se déplacer, se relever ou attaquer dans le même round.",
    "group": "Rocréen › Voie I — Régénération du Noyau — 8 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Le Rocréen peut ordonner à son noyau de privilégier la reconstruction immédiate. Les tissus referment brutalement les lésions, et l’eau disponible accélère encore ce processus sans transformer une repousse complexe en miracle instantané."
  },
  {
    "id": "extral-reconstruction-organique",
    "name": "Reconstruction organique",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Cicatrisation humide",
    "effect": "Le Rocréen peut reconstruire biologiquement un œil, un doigt, un morceau d’organe, un segment périphérique ou un membre entier tant que son noyau reste intact. Ce processus demande de quelques heures à plusieurs jours selon l’importance, avec hydratation et nutrition suffisantes. Ce n’est pas une capacité de combat.",
    "group": "Rocréen › Voie I — Régénération du Noyau — 8 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Le noyau contient le plan vivant dont le reste du corps peut être rebâti. Avec temps, eau et nutriments, œil, organe ou membre repoussent comme une continuation lente de la même morphologie."
  },
  {
    "id": "extral-noyau-obstine",
    "name": "Noyau obstiné",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Régénération active + Reconstruction organique",
    "effect": "Quand le Rocréen tombe à 0 PV ou moins sans atteindre son seuil de mort : si son noyau est intact, il est automatiquement Stabilisé à la fin du round. Il peut toujours être achevé avant cela. Un coup détruisant réellement le noyau ignore évidemment cette Technique.",
    "group": "Rocréen › Voie I — Régénération du Noyau — 8 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Le noyau reste la dernière certitude biologique du Rocréen. Tant qu’il survit intact, le corps tente spontanément de revenir à un état stable même après un effondrement qui aurait laissé une autre espèce mourir sans intervention."
  },
  {
    "id": "extral-lien-de-banc",
    "name": "Lien de banc",
    "cost": 1,
    "access": "SR/R",
    "activation": "Actif",
    "prerequisiteName": "",
    "effect": "Le Rocréen peut lier mentalement une créature consentante disposant d'une sensibilité télépathique compatible. Ils peuvent communiquer mentalement à courte distance.",
    "group": "Rocréen › Voie II — Réseau psychique — 8 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Le banc commence par une connexion mentale simple entre esprits compatibles. Mots, intentions et signaux circulent sans voix tant que les deux consciences restent assez proches pour maintenir le lien."
  },
  {
    "id": "extral-partage-sensoriel",
    "name": "Partage sensoriel",
    "cost": 2,
    "access": "SR/R",
    "activation": "",
    "prerequisiteName": "Lien de banc",
    "effect": "Le Rocréen choisit un membre du réseau. Jusqu'au début de son prochain tour, il peut percevoir par : un des sens de cet allié. Son propre corps continue évidemment d'exister pendant qu'il regarde ailleurs.",
    "group": "Rocréen › Voie II — Réseau psychique — 8 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Le Rocréen peut emprunter momentanément un sens à un membre du réseau. Il regarde, écoute ou ressent depuis un autre corps sans oublier que le sien demeure quelque part, vulnérable et toujours réel."
  },
  {
    "id": "extral-relais-psychique",
    "name": "Relais psychique",
    "cost": 2,
    "access": "SR/R",
    "activation": "",
    "prerequisiteName": "Lien de banc",
    "effect": "Un membre du réseau peut servir de relais à un autre. Un réseau peut ainsi fonctionner à travers : jusqu'à trois intermédiaires proches les uns des autres. Ça permet un groupe dispersé dans un bâtiment ou une petite zone. Pas une télépathie transcontinentale.",
    "group": "Rocréen › Voie II — Réseau psychique — 8 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Le réseau rocréen sait passer par ses propres membres. Une conscience transmet le lien à une autre et permet au banc de s’étendre dans un bâtiment sans prétendre abolir toute limite de distance."
  },
  {
    "id": "extral-conscience-distribuee",
    "name": "Conscience distribuée",
    "cost": 3,
    "access": "SR/R",
    "activation": "",
    "prerequisiteName": "Partage sensoriel + Relais psychique",
    "effect": "Tant que le Rocréen est connecté à au moins un allié : toute menace effectivement perçue par le réseau est considérée comme perçue par lui. Ainsi : il ne peut pas être Surpris par quelque chose que son réseau voit clairement ; il peut connaître la position d'un ennemi vu par un allié ; il peut effectuer une Défense active s'il est physiquement capable de réagir. Mais : connaître la position de quelqu'un derrière un mur ne crée pas une ligne de tir à travers le mur.",
    "group": "Rocréen › Voie II — Réseau psychique — 8 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Dans un banc psychique, ce que voit l’un devient une alerte pour les autres. Le Rocréen connecté n’a pas besoin de tourner la tête vers une menace qu’un membre du réseau perçoit déjà clairement."
  },
  {
    "id": "extral-ventouses",
    "name": "Ventouses",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Le mucus et les structures tentaculaires permettent au Rocréen de se fixer solidement aux surfaces. Il peut grimper sur des surfaces normalement très difficiles à saisir.",
    "group": "Rocréen › Voie III — Glandes rocréennes — 9 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Mucus et structures tentaculaires créent des points d’accroche sur des surfaces que des mains ordinaires trouveraient inutilisables. Le Rocréen grimpe en multipliant les contacts plutôt qu’en cherchant une prise unique."
  },
  {
    "id": "extral-jet-d-encre",
    "name": "Jet d'encre",
    "cost": 1,
    "access": "R",
    "activation": "Actif — 1 PA — 1/Scène",
    "prerequisiteName": "",
    "effect": "Le Rocréen projette un liquide opaque et collant. Une cible touchée ou une petite zone aspergée impose : −3 aux tests reposant directement sur la vision jusqu'à nettoyage ou sortie de la zone.",
    "group": "Rocréen › Voie III — Glandes rocréennes — 9 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Une glande expulse une encre épaisse qui remplit les yeux et macule la zone. La gêne persiste jusqu’à ce qu’elle soit nettoyée ou contournée, exactement comme on attendrait d’un liquide opaque réellement projeté."
  },
  {
    "id": "extral-colle-organique",
    "name": "Colle organique",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Ventouses",
    "effect": "Jet à courte portée : Agilité + Tir. Sur réussite, le personnage peut coller : un membre ; une arme ; un objet ; deux surfaces ensemble. Pour se libérer : 1 PA + Vigueur + Athlétisme difficulté 15.",
    "group": "Rocréen › Voie III — Glandes rocréennes — 9 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Le mucus rocréen peut devenir une colle de combat assez forte pour immobiliser un membre, fixer une arme ou solidariser deux surfaces. Se libérer revient alors à vaincre une matière physique, pas une injonction abstraite."
  },
  {
    "id": "extral-venin-rocreen",
    "name": "Venin rocréen",
    "cost": 2,
    "access": "R",
    "activation": "Actif — 1 PA — 1/Scène",
    "prerequisiteName": "",
    "effect": "Le Rocréen projette son venin sur une cible proche. Après une attaque réussie : Vigueur + Constitution difficulté 15. En échec : −3 aux tests physiques jusqu'à la fin du prochain round. Une protection hermétique peut empêcher le contact.",
    "group": "Rocréen › Voie III — Glandes rocréennes — 9 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Le venin rocréen attaque la physiologie plutôt que l’armure. S’il atteint réellement l’organisme, il ralentit et affaiblit brièvement le corps ; une enveloppe hermétique peut donc rendre la toxine parfaitement inutile."
  },
  {
    "id": "extral-cocktail-glandulaire",
    "name": "Cocktail glandulaire",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "deux Talents parmi Jet d'encre, Colle organique, Venin rocréen",
    "effect": "Lors d'une projection glandulaire, le Rocréen peut combiner : deux effets glandulaires qu'il connaît dans une même attaque. Chaque effet est ensuite résolu normalement. Une seule attaque, pas deux.",
    "group": "Rocréen › Voie III — Glandes rocréennes — 9 PTV",
    "when": {
      "species": "rocreen"
    },
    "runtimeLore": "Les glandes rocréennes peuvent expulser deux sécrétions dans le même jet. Les effets se mêlent sur la cible parce que le corps a réellement combiné les produits avant la projection."
  },
  {
    "id": "extral-peau-saturee",
    "name": "Peau saturée",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "La peau extrêmement humide du Thalsios lui donne : +3 pour résister aux effets de chaleur ou de feu ordinaires. Ça ne protège pas sérieusement d'un plasma ou d'une température physiquement extrême.",
    "group": "Thalsios › Voie I — Densification thalsiosse — 8 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "La peau thalsiosse retient tant d’humidité qu’une partie de la chaleur ordinaire y est absorbée et répartie. Flammes et températures raisonnables peinent davantage à la brûler, sans faire d’elle une protection contre un plasma."
  },
  {
    "id": "extral-densification-osseuse",
    "name": "Densification osseuse",
    "cost": 2,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "La densité croissante de ses tissus lui confère : Armure corporelle 1.",
    "group": "Thalsios › Voie I — Densification thalsiosse — 8 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "Avec le temps, l’ossature thalsiosse devient assez dense pour encaisser comme une protection interne. L’armure vient de la matière même du corps plutôt que d’une plaque ajoutée sur la peau."
  },
  {
    "id": "extral-muscle-tasse",
    "name": "Muscle tassé",
    "cost": 2,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Densification osseuse",
    "effect": "Le développement musculaire thalsios améliore considérablement ses impacts naturels. Son Pugilat utilise : DGT 2 au lieu de DGT 1.",
    "group": "Thalsios › Voie I — Densification thalsiosse — 8 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "Le muscle thalsios se compacte au lieu de simplement grossir. Ses impacts deviennent plus lourds parce qu’une masse musculaire anormalement dense transmet davantage de force dans chaque coup naturel."
  },
  {
    "id": "extral-vieux-cuir",
    "name": "Vieux cuir",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Densification osseuse + Muscle tassé",
    "effect": "Le corps du Thalsios a atteint une densification majeure. Sa Armure corporelle passe de : 1 à 2. Ce Talent ne signifie pas nécessairement que le PJ est biologiquement vieux de plusieurs siècles : il représente un niveau de densification normalement associé aux Thalsios âgés.",
    "group": "Thalsios › Voie I — Densification thalsiosse — 8 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "La densification avancée donne à la peau et aux tissus l’aspect du vieux cuir épais même chez un individu relativement jeune. Ce stade physiologique constitue une seconde couche de protection corporelle permanente."
  },
  {
    "id": "extral-lecture-vibratoire",
    "name": "Lecture vibratoire",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Quand il touche : le sol ; un mur ; une structure ; l'eau le Thalsios peut percevoir les déplacements importants transmis par ce milieu. Il obtient : direction et distance grossières. Pas identité.",
    "group": "Thalsios › Voie II — Sensibilité thalsiosse — 7 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "Sol, mur ou eau peuvent servir de membrane au Thalsios. En contact avec eux, il perçoit les déplacements importants transmis dans le matériau et en retire direction et distance approximatives."
  },
  {
    "id": "extral-branchies-barometriques",
    "name": "Branchies barométriques",
    "cost": 1,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Les variations d'air et de pression autour du personnage sont extrêmement perceptibles. Un être proche qui : bouge ; déplace brutalement l'air ; passe derrière lui peut être détecté même sans ligne de vue. Un test de Perception peut rester nécessaire contre une furtivité réelle.",
    "group": "Thalsios › Voie II — Sensibilité thalsiosse — 7 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "Les branchies thalsiosses sentent les microvariations de pression comme une peau extrêmement sensible. Un corps qui déplace brutalement l’air proche peut donc être remarqué même hors du champ visuel."
  },
  {
    "id": "extral-resonance-holographique",
    "name": "Résonance holographique",
    "cost": 2,
    "access": "R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Accès naturel : Thalsios ayant grandi durablement sur Terre. Le personnage perçoit les variations locales de densité de l'Hologramme. Il peut remarquer : proximité immédiate d'une présence que le Voile doit fortement traduire ; changement brutal V/SR/R ; apparition ou disparition importante de Vérité. Il ne sait pas : quelle espèce ; quelle créature ; quelle capacité. Il ressent simplement : « le Voile vient de travailler ici ». Un Thalsios non terrestre peut développer le Talent après une longue acclimatation.",
    "group": "Thalsios › Voie II — Sensibilité thalsiosse — 7 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "Les Thalsios acclimatés à la Terre finissent par sentir quand l’Hologramme se tend autour d’une présence ou d’une transition. Ils perçoivent la variation sans recevoir automatiquement l’identité de ce que le Voile est en train de traduire."
  },
  {
    "id": "extral-cartographie-vibratoire",
    "name": "Cartographie vibratoire",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "Lecture vibratoire + Branchies barométriques",
    "effect": "Jusqu'à la fin du round, le Thalsios obtient une carte extrêmement précise des êtres en mouvement dans une petite zone autour de lui, typiquement une pièce ou environ 10 mètres. Il peut les localiser malgré : obscurité ; fumée ; obstacle visuel léger ; invisibilité purement optique. Une isolation vibratoire ou un obstacle qui découple physiquement les surfaces peut bloquer cette perception.",
    "group": "Thalsios › Voie II — Sensibilité thalsiosse — 7 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "En laissant les vibrations dessiner l’espace, le Thalsios obtient pour quelques secondes une carte des mouvements autour de lui. Fumée, obscurité et invisibilité optique comptent peu tant que le milieu transmet encore les oscillations."
  },
  {
    "id": "extral-invariance",
    "name": "Invariance",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Le personnage peut relancer : un test de Stress ou de résistance à un effet mental. On applique la règle générale : un même test ne bénéficie jamais de plusieurs relances de Talent.",
    "group": "Thalsios › Voie III — Constance thalsiosse — 8 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "Le Thalsios peut refuser une première conclusion émotionnelle ou mentale et reprendre une fois sa résistance. Cette seconde tentative exprime sa stabilité profonde, pas une immunité générale à ce qui le touche."
  },
  {
    "id": "extral-retard-de-reaction",
    "name": "Retard de réaction",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Réaction — 1/Scène",
    "prerequisiteName": "",
    "effect": "Après avoir échoué à une résistance mentale produisant un effet durable : l'effet ne commence qu'à la fin du prochain tour du Thalsios. Il dispose donc d'un bref instant où son comportement reste pleinement sien. Ça n'annule pas l'effet.",
    "group": "Thalsios › Voie III — Constance thalsiosse — 8 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "Même lorsqu’une influence mentale gagne, elle ne trouve pas toujours immédiatement prise sur un Thalsios. Son esprit conserve un court intervalle de comportement autonome avant que l’effet durable ne commence réellement."
  },
  {
    "id": "extral-retour-a-l-equilibre",
    "name": "Retour à l'équilibre",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "",
    "prerequisiteName": "Invariance",
    "effect": "Lorsqu'un effet mental possède une durée mesurée en rounds : réduire sa durée de 1 round, minimum 1. Si l'effet dure normalement toute la scène sans nouveau test : le Thalsios obtient un nouveau test de résistance à la fin de son prochain round. Une seule fois par application.",
    "group": "Thalsios › Voie III — Constance thalsiosse — 8 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "La Constance tend naturellement à ramener l’esprit vers son état précédent. Les influences temporaires s’épuisent plus vite, et celles qui devraient durer toute une scène rencontrent au moins une occasion supplémentaire d’être rejetées."
  },
  {
    "id": "extral-habituation",
    "name": "Habituation",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "",
    "prerequisiteName": "Retour à l'équilibre",
    "effect": "Après avoir réussi à résister à une source mentale précise pendant une scène : cette même source ne peut plus lui imposer exactement le même effet pendant le reste de la scène. Il s'est stabilisé contre elle. Une capacité réellement différente du même adversaire fonctionne normalement. Ça crée quelque chose d'assez thalsios : le premier assaut psychique est dangereux ; le cinquième identique commence à ne plus faire grand-chose.",
    "group": "Thalsios › Voie III — Constance thalsiosse — 8 PTV",
    "when": {
      "species": "thalsios"
    },
    "runtimeLore": "Une première résistance réussie laisse dans la constance thalsiosse un nouvel équilibre. La même source ne peut plus produire exactement la même intrusion mentale pendant la scène, comme si l’esprit s’était accordé contre elle."
  },
  {
    "id": "extral-revelation-drillee",
    "name": "Révélation drillée",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Pendant son propre tour, le personnage peut effectuer V→SR, SR→R ou V→R sans payer le PA normalement requis. Le Talent ne permet pas de contourner une Révélation impossible ou activement bloquée.",
    "group": "Protocoles de Continuité — 7 PTV",
    "when": {
      "network": "continuite"
    },
    "runtimeLore": "Changer d’état fait partie de l’entraînement, pas d’un rituel hésitant. La Révélation devient un geste intégré au mouvement du tour, tant qu’aucune force extérieure ne l’empêche réellement."
  },
  {
    "id": "extral-repli-reflexe",
    "name": "Repli réflexe",
    "cost": 1,
    "access": "SR/R",
    "activation": "Réaction — 1/Scène",
    "prerequisiteName": "",
    "effect": "Lorsqu’un changement réel et imprévu de situation menace soudain d’exposer sa Vérité - nouvel observateur, caméra, patrouille, irruption, changement de contexte comparable - le personnage peut revenir immédiatement à V sans payer de PA. Le Talent n’efface rien de ce qui a déjà été vu et ne peut pas être déclenché par une mise en scène volontaire du personnage ou de ses alliés uniquement pour obtenir un repli gratuit.",
    "group": "Protocoles de Continuité — 7 PTV",
    "when": {
      "network": "continuite"
    },
    "runtimeLore": "Quand un nouveau témoin menace soudain de voir trop loin, la Continuité privilégie le réflexe de couverture. Le personnage replie immédiatement sa Révélation, sans effacer ce que quelqu’un a déjà eu le temps d’observer."
  },
  {
    "id": "extral-coordination-de-continuite",
    "name": "Coordination de Continuité",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "1 PA",
    "prerequisiteName": "",
    "effect": "Le personnage peut fournir l’Assistance normale +2 en combat sur un test non offensif d’un allié malgré l’interdiction générale de l’assistance de combat. Il doit posséder la Compétence pertinente à 1+, être réellement en mesure d’aider et dépenser 1 PA. Jamais sur une Attaque, une Défense active ou un pouvoir strictement personnel.",
    "group": "Protocoles de Continuité — 7 PTV",
    "when": {
      "network": "continuite"
    },
    "runtimeLore": "Les Protocoles de Continuité apprennent à aider sans casser le rythme du combat. Un opérateur compétent peut consacrer une part de son attention à l’action technique d’un allié et réellement améliorer son exécution."
  },
  {
    "id": "extral-transition-en-chaine",
    "name": "Transition en chaîne",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "",
    "prerequisiteName": "Révélation drillée + Repli réflexe",
    "effect": "Pendant un round, les transitions personnelles V/SR/R ne coûtent aucun PA. Elles ne créent aucune nouvelle fenêtre d’action ou de Réaction : elles ne peuvent avoir lieu qu’à un moment où le personnage aurait normalement la possibilité de changer d’état. Le Talent ne révèle jamais quelqu’un d’autre et ne permet aucun soin par changement répété de forme.",
    "group": "Protocoles de Continuité — 7 PTV",
    "when": {
      "network": "continuite"
    },
    "runtimeLore": "La Continuité permet d’enchaîner plusieurs transitions sans laisser chaque passage dévorer une part du rythme d’action. Cela reste une succession d’états possibles, jamais une source cachée d’actions supplémentaires."
  },
  {
    "id": "extral-purge-systemique",
    "name": "Purge systémique",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "Réaction — 1/Scène",
    "prerequisiteName": "",
    "effect": "Après l’échec d’un test de résistance contre poison, toxine, maladie ou contamination biologique, le personnage déclenche une adaptation nanitique et relance le test. Le second résultat est définitif.",
    "group": "Homo Superior — Humain AIDH › Homéostasie celltech — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "Face à un agent biologique hostile, l’essaim modifie brutalement sa réponse interne. Ce second passage ne promet pas l’immunité ; il offre au corps une adaptation immédiate à ce qui vient précisément de le dépasser."
  },
  {
    "id": "extral-reserve-nanitique",
    "name": "Réserve nanitique",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Une fois par ensemble de blessures, lorsqu’un effet réel de soins lui rend des PV, l’Homo Superior récupère 1 PV supplémentaire. Ne fonctionne pas sur récupération naturelle, Cycle de réparation ou une régénération indépendante.",
    "group": "Homo Superior — Humain AIDH › Homéostasie celltech — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "Lorsqu’un soin réel ouvre déjà un cycle de reconstruction, les nanites y injectent leur propre réserve. Elles amplifient légèrement la récupération sans pouvoir se nourrir indéfiniment de leur propre travail."
  },
  {
    "id": "extral-compensation-traumatique",
    "name": "Compensation traumatique",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Réaction — 1/Scène",
    "prerequisiteName": "",
    "effect": "Lorsqu’une blessure ou une Altération compromet une fonction corporelle sans l’avoir physiquement détruite, les nanites réorganisent temporairement tissus et contrôle neural et reportent la conséquence fonctionnelle jusqu’à la fin de la scène. Peut concerner une jambe endommagée, un bras traumatisé, une vision brouillée ou un choc neural ; ne recrée pas un membre amputé, un œil détruit ou un organe irrémédiablement perdu.",
    "group": "Homo Superior — Humain AIDH › Homéostasie celltech — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "Les nanites ne font pas repousser ce qui a disparu, mais elles savent contourner une fonction blessée. Elles redistribuent commande nerveuse et soutien tissulaire pour maintenir provisoirement l’usage d’un membre ou d’un sens encore physiquement présent."
  },
  {
    "id": "extral-cycle-de-reparation",
    "name": "Cycle de réparation",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "Actif — 2 PA — 1/Scène",
    "prerequisiteName": "",
    "effect": "Conscient, au-dessus du seuil de mort et avec son essaim fonctionnel, le personnage récupère 3 PV. Sa récupération naturelle de PV hors combat est également doublée.",
    "group": "Homo Superior — Humain AIDH › Homéostasie celltech — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "L’essaim celltech entretient en permanence un travail de réparation que l’organisme ordinaire n’effectuerait qu’au repos. Quand le porteur lui laisse la main, la fermeture des lésions s’accélère nettement."
  },
  {
    "id": "extral-poussee-myofibrillaire",
    "name": "Poussée myofibrillaire",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "1/round",
    "prerequisiteName": "",
    "effect": "Lorsqu’il dépense 1 PA pour se Déplacer, le personnage peut couvrir une distance nettement supérieure ou franchir sans test un obstacle banal normalement impossible pour un Humain. Un obstacle réellement dangereux ou une opposition impose toujours un test normal.",
    "group": "Homo Superior — Humain AIDH › Conditionnement suprahumain — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "Les fibres artificiellement optimisées peuvent libérer une poussée de déplacement hors des standards humains. Un obstacle banal devient franchissable dans l’élan, sans transformer pour autant une impossibilité réelle en simple formalité."
  },
  {
    "id": "extral-reflexe-d-impact",
    "name": "Réflexe d’impact",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Réaction — 1 PA — 1/round",
    "prerequisiteName": "",
    "effect": "Quand une attaque réussie lui inflige une Altération, le personnage peut empêcher une conséquence immédiate de chute, désarmement, perte d’équilibre ou incapacité momentanée liée au choc. Les dégâts restent intégralement appliqués ; une destruction physique réelle n’est pas annulée.",
    "group": "Homo Superior — Humain AIDH › Conditionnement suprahumain — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "L’Homo Superior absorbe l’information du choc avant d’en subir toutes les conséquences motrices. Il peut garder son arme, ses appuis ou son équilibre quand l’impact aurait normalement provoqué une perte de contrôle immédiate."
  },
  {
    "id": "extral-fonctionnement-sous-contrainte",
    "name": "Fonctionnement sous contrainte",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Passif — 1/round",
    "prerequisiteName": "",
    "effect": "Lorsqu’une douleur, un choc, un vertige ou une perturbation purement physiologique devrait interrompre une action en cours ou empêcher le personnage d’accomplir une action qu’il reste physiquement capable d’exécuter, il peut poursuivre normalement. Ne supprime ni immobilisation, ni inconscience, ni effet mental, ni membre détruit, ni malus numérique indépendant, ni incapacité matérielle réelle.",
    "group": "Homo Superior — Humain AIDH › Conditionnement suprahumain — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "Le conditionnement suprahumain apprend au corps à poursuivre malgré douleur, choc ou vertige tant que la fonction physique existe encore. La discipline ne répare rien : elle empêche seulement le trouble de devenir l’ordre qui fait cesser l’action."
  },
  {
    "id": "extral-surcadence-somatique",
    "name": "Surcadence somatique",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Au début d’une activation, le personnage gagne +1 PA pour le round, pouvant atteindre 4 PA. Le PA inutilisé disparaît à la fin du round et l’Initiative n’est pas modifiée.",
    "group": "Homo Superior — Humain AIDH › Conditionnement suprahumain — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "Pendant quelques secondes, métabolisme et contrôle neuromusculaire dépassent leur cadence normale. Le corps gagne un temps d’action supplémentaire qu’il ne pourrait soutenir au-delà du round sans sortir de son régime prévu."
  },
  {
    "id": "extral-verrou-neuroemotionnel",
    "name": "Verrou neuroémotionnel",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "Réaction — 1/Scène",
    "prerequisiteName": "",
    "effect": "Après l’échec d’un test de Stress qui devrait aggraver l’état de plusieurs niveaux, limiter l’aggravation à un seul niveau. Par exemple, Normal → Paniqué devient Normal → Tendu. L’échec reste un échec.",
    "group": "Homo Superior — Humain AIDH › Neurodiscipline AIDH — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "Lorsqu’un choc psychique devrait faire basculer trop loin l’état émotionnel, le verrou AIDH casse la chute en deux. L’échec reste présent, mais le système refuse qu’une seule secousse traverse plusieurs seuils d’un coup."
  },
  {
    "id": "extral-reflexe-conditionne",
    "name": "Réflexe conditionné",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Réaction — 1 PA — 1/Scène",
    "prerequisiteName": "",
    "effect": "Lorsqu’il est Surpris par une attaque, le personnage peut malgré la Surprise effectuer une Défense active contre cette attaque en payant normalement 1 PA. Le surprenant agit toujours hors de l’ordre normal et conserve les autres avantages fictionnels de la Surprise.",
    "group": "Homo Superior — Humain AIDH › Neurodiscipline AIDH — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "L’entraînement AIDH prépare une défense jusque dans la surprise. Le corps peut lever une garde avant que la conscience n’ait fini d’admettre l’attaque, à condition qu’il dispose encore du temps d’action nécessaire."
  },
  {
    "id": "extral-cloisonnement-fonctionnel",
    "name": "Cloisonnement fonctionnel",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "1/round",
    "prerequisiteName": "",
    "effect": "Avant un test, le personnage isole temporairement ses fonctions cognitives de son état émotionnel : Tendu utilise les règles de dé de Normal ; Paniqué utilise celles de Tendu. L’état réel de Stress ne change pas.",
    "group": "Homo Superior — Humain AIDH › Neurodiscipline AIDH — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "La Neurodiscipline apprend à séparer provisoirement émotion et exécution. La peur ou la tension existent encore, mais les circuits chargés d’accomplir la tâche sont maintenus à distance de leur perturbation la plus immédiate."
  },
  {
    "id": "extral-traitement-parallele",
    "name": "Traitement parallèle",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "1/round",
    "prerequisiteName": "",
    "effect": "Une fois par round, le personnage peut réaliser gratuitement en parallèle une action purement cognitive ou d’interface qui coûterait normalement 1 PA : scan, lecture tactique, transfert de données, commande simple d’interface ou consultation immédiate. L’action gratuite ne peut être offensive, contestée, modifier directement l’état, la position, les PV ou les capacités d’un autre acteur, ni constituer une seconde action physique. Une interface ou un système réellement utilisable reste nécessaire.",
    "group": "Homo Superior — Humain AIDH › Neurodiscipline AIDH — 8 PTV",
    "when": {
      "species": "homo_superior"
    },
    "runtimeLore": "Une partie de l’architecture cognitive reste disponible pour une tâche simple d’interface ou de lecture pendant que le reste agit. Cette pensée parallèle ne devient jamais une seconde action complexe cachée dans le même instant."
  },
  {
    "id": "extral-ancrage-de-masse",
    "name": "Ancrage de masse",
    "cost": 1,
    "access": "SR/R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Circonstances favorables (+3) pour résister à une projection, un renversement, une poussée ou un déplacement forcé purement physique. Ne protège pas contre téléportation, gravité anormale ou déplacement surnaturel sans prise physique.",
    "group": "Ad’rak — origine restreinte › Colosse Ad’rak — 9 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "Un Ad’rak sait quand cesser de bouger. Il abaisse son centre de gravité, verrouille ses appuis et oppose au choc toute la masse d’un corps conçu pour que le monde recule avant lui."
  },
  {
    "id": "extral-briseur-de-prise",
    "name": "Briseur de prise",
    "cost": 2,
    "access": "SR/R",
    "activation": "Réaction — 1 PA — 1/round",
    "prerequisiteName": "",
    "effect": "Lorsqu’il est saisi, retenu ou entravé par une contrainte physique contre laquelle sa force peut réellement agir, l’Ad’rak peut immédiatement tenter de la rompre avec Vigueur + Athlétisme contre l’opposition applicable, sans attendre son activation.",
    "group": "Ad’rak — origine restreinte › Colosse Ad’rak — 9 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "Être saisi ne signifie pas être tenu lorsqu’on possède la puissance d’un Ad’rak. Le corps répond immédiatement contre la contrainte physique, arrachant la prise avant que l’adversaire n’ait le temps de la transformer en contrôle durable."
  },
  {
    "id": "extral-charge-de-rupture",
    "name": "Charge de rupture",
    "cost": 3,
    "access": "R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Après un Déplacement vers une cible suivi d’une attaque de mêlée réussie durant le même round et infligeant au moins 1 dégât, l’Ad’rak peut renverser la cible ou la repousser de 2 m + DR. Une cible sensiblement plus massive peut opposer un test approprié de Vigueur.",
    "group": "Ad’rak — origine restreinte › Colosse Ad’rak — 9 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "Une charge Ad’rak ne cherche pas seulement à blesser. L’élan entier continue après l’impact, convertissant la masse du colosse en poussée capable de renverser ou de chasser une cible moins bien ancrée."
  },
  {
    "id": "extral-mur-vivant",
    "name": "Mur vivant",
    "cost": 3,
    "access": "R",
    "activation": "Réaction — 1 PA — 1/round",
    "prerequisiteName": "",
    "effect": "Lorsqu’une créature de taille comparable ou inférieure tente de traverser l’espace immédiatement contrôlé par l’Ad’rak, celui-ci peut lui barrer physiquement le passage : Vigueur + Athlétisme + 1d10e contre Vigueur ou Agilité + Athlétisme + 1d10e de la cible. En réussite, le déplacement est stoppé à son contact.",
    "group": "Ad’rak — origine restreinte › Colosse Ad’rak — 9 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "La largeur d’un Ad’rak peut devenir une fortification mobile. Lorsqu’il décide qu’un passage est fermé, le franchir revient à déplacer physiquement celui qui tient la ligne."
  },
  {
    "id": "extral-saisie-ecrasante",
    "name": "Saisie écrasante",
    "cost": 1,
    "access": "SR/R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Une fois une saisie obtenue, une cible sensiblement plus petite est réellement immobilisée par la masse Ad’rak jusqu’à ce qu’elle rompe la saisie. Le Talent ne crée aucune action supplémentaire.",
    "group": "Ad’rak — origine restreinte › Puissance de guerre — 9 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "Une fois refermée, la saisie d’un Ad’rak devient une cage de muscles et de poids. Une créature nettement plus petite doit réellement vaincre cette masse pour retrouver sa liberté de mouvement."
  },
  {
    "id": "extral-passer-en-force",
    "name": "Passer en force",
    "cost": 2,
    "access": "R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Après un échec non narratif à un test de Vigueur visant uniquement à briser, arracher, soulever, retenir ou déplacer un obstacle matériel, l’Ad’rak peut choisir de réussir quand même avec DR 0. Le MJ impose alors une conséquence appropriée : 2 PV ignorant l’Armure à cause de l’effort, position compromise, bruit énorme, objet manipulé endommagé, perte de temps ou autre conséquence directement liée.",
    "group": "Ad’rak — origine restreinte › Puissance de guerre — 9 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "Certaines traditions Ad’rak considèrent qu’un obstacle matériel n’a pas à gagner simplement parce qu’il a résisté une première fois. Le guerrier force alors le résultat, quitte à payer l’ouverture par la douleur, le bruit ou la casse."
  },
  {
    "id": "extral-projection-de-masse",
    "name": "Projection de masse",
    "cost": 3,
    "access": "R",
    "activation": "Actif — 1 PA",
    "prerequisiteName": "cible déjà maintenue ou saisie",
    "effect": "Opposition Vigueur + Pugilat + 1d10e contre Vigueur + Athlétisme + 1d10e. En réussite, une cible de taille comparable ou inférieure est projetée de 2 m + DR et renversée. Si elle percute violemment une surface solide avant la fin de cette distance, elle subit 1 + DR dégâts, Armure applicable.",
    "group": "Ad’rak — origine restreinte › Puissance de guerre — 9 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "La projection Ad’rak n’est pas un tour de lutte subtil : elle saisit la différence de force et la transforme en trajectoire. Une cible assez légère quitte le sol et découvre brutalement ce que vaut son environnement comme point d’arrêt."
  },
  {
    "id": "extral-impact-titanesque",
    "name": "Impact titanesque",
    "cost": 3,
    "access": "R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Avant une attaque de Pugilat ou de Mêlée, l’Ad’rak peut annoncer un coup entièrement consacré à la puissance. En cas de réussite : +2 DGT ; si l’attaque produit une Altération, celle-ci peut prendre la forme d’une projection, d’une destruction locale d’un objet porté ou de l’effondrement d’un appui, si la fiction le permet. Jusqu’à sa prochaine activation, l’Ad’rak subit −3 à sa Défense passive et active contre les attaques qu’il perçoit, car il s’est totalement engagé dans son coup.",
    "group": "Ad’rak — origine restreinte › Puissance de guerre — 9 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "L’Ad’rak sacrifie toute prudence pour un seul coup d’une violence totale. Le geste expose sa garde, mais ce qu’il atteint reçoit la force d’une masse lancée sans réserve, assez pour projeter ou rompre un appui."
  },
  {
    "id": "extral-tenir-la-ligne",
    "name": "Tenir la ligne",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "Réaction — 1 PA — 1/round",
    "prerequisiteName": "",
    "effect": "Quand une créature à portée de mêlée tente de passer physiquement à côté de l’Ad’rak ou de quitter sa zone immédiate et que la géométrie le permet, il peut se repositionner pour continuer à lui barrer le passage. Aucune attaque gratuite n’est créée.",
    "group": "Ad’rak — origine restreinte › Traditions guerrières Ad’rak — 8 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "Tenir la ligne consiste à rester exactement là où la fuite adverse voudrait trouver un passage. L’Ad’rak ajuste ses appuis et son corps pour continuer à fermer la zone sans transformer cette vigilance en attaque gratuite."
  },
  {
    "id": "extral-corps-pour-corps",
    "name": "Corps pour corps",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Réaction — 1 PA",
    "prerequisiteName": "",
    "effect": "Lorsqu’un allié immédiatement adjacent est ciblé par une attaque de mêlée, l’Ad’rak peut échanger sa position avec lui et devenir la cible de l’attaque, avant la Défense. Il se défend ensuite normalement.",
    "group": "Ad’rak — origine restreinte › Traditions guerrières Ad’rak — 8 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "Les guerriers Ad’rak apprennent à protéger les leurs avec leur propre volume. Un pas latéral suffit parfois à remplacer un allié dans la trajectoire d’une attaque et à faire du colosse la cible voulue."
  },
  {
    "id": "extral-duel-de-guerre",
    "name": "Duel de guerre",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Après avoir réussi une attaque de mêlée contre une cible, l’Ad’rak peut la désigner jusqu’à la fin de sa prochaine activation. Si elle attaque volontairement quelqu’un d’autre tout en restant à sa portée de mêlée, l’Ad’rak peut dépenser 1 PA en Réaction pour effectuer immédiatement une attaque de mêlée contre elle.",
    "group": "Ad’rak — origine restreinte › Traditions guerrières Ad’rak — 8 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "Le duel Ad’rak crée une menace simple : ignorer le guerrier expose immédiatement son flanc. Tant que l’ennemi reste à portée, détourner son attention devient un choix qui peut être puni sur-le-champ."
  },
  {
    "id": "extral-ne-pas-rompre",
    "name": "Ne pas rompre",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "Réaction — 1/Scène",
    "prerequisiteName": "",
    "effect": "Lorsqu’une blessure devrait faire passer l’Ad’rak en état Paniqué, il peut continuer à appliquer les règles de dé de l’état Tendu jusqu’à la fin de la scène. Son état réel reste Paniqué. Le Talent ne s’applique pas à un Paniqué provoqué principalement par une attaque mentale, un traumatisme psychologique ou un effet surnaturel.",
    "group": "Ad’rak — origine restreinte › Traditions guerrières Ad’rak — 8 PTV",
    "when": {
      "species": "adrak"
    },
    "runtimeLore": "La tradition refuse qu’une blessure physique suffise à briser la ligne intérieure du combattant. Même paniqué par sa propre chair, l’Ad’rak conserve pour quelques minutes la discipline nécessaire pour agir sans sombrer entièrement dans l’état qui l’a frappé."
  },
  {
    "id": "extral-garde-du-sanctuaire",
    "name": "Garde du Sanctuaire",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "Passif",
    "prerequisiteName": "",
    "effect": "Pour une Défense active contre une attaque de mêlée, le pratiquant peut utiliser Agilité + Mêlée + 1d10e ou Agilité + Pugilat + 1d10e à la place d’Agilité + Esquive + 1d10e. Le coût reste 1 PA.",
    "group": "Ad’rak — origine restreinte › Arts de Nel’Akna — 16 PTV › Formes anciennes — 8 PTV",
    "when": {
      "network": "nelakna"
    },
    "runtimeLore": "La Garde du Sanctuaire préfère une arme ou le corps entraîné à une esquive dispersée. Le pratiquant reçoit l’attaque dans une structure de parade conçue pour protéger un lieu, un maître ou un passage."
  },
  {
    "id": "extral-cercle-interieur",
    "name": "Cercle intérieur",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Réaction — 1/round",
    "prerequisiteName": "",
    "effect": "Après une Défense active réussie contre une attaque de mêlée, le pratiquant peut se déplacer immédiatement de 1 mètre autour de son adversaire sans PA, en restant au contact ou à portée de mêlée sur une position réellement accessible.",
    "group": "Ad’rak — origine restreinte › Arts de Nel’Akna — 16 PTV › Formes anciennes — 8 PTV",
    "when": {
      "network": "nelakna"
    },
    "runtimeLore": "Les formes anciennes de Nel’Akna apprennent à ne jamais répondre au choc de face. Après avoir détourné l’attaque, le combattant glisse autour de l’adversaire et transforme la défense en nouvel angle de contrôle."
  },
  {
    "id": "extral-enchainement-des-anciennes-formes",
    "name": "Enchaînement des anciennes formes",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "1/round",
    "prerequisiteName": "",
    "effect": "Après une attaque de Pugilat réussie, et après résolution normale des dégâts, le pratiquant peut appliquer sans PA supplémentaire et sans second jet l’une des conséquences suivantes si elle est physiquement plausible : établir une saisie, désarmer, renverser ou déplacer la cible de 1 mètre. Le Talent n’autorise pas l’impossible : la première attaque a déjà tranché la qualité de l’ouverture, mais la morphologie et les masses restent réelles.",
    "group": "Ad’rak — origine restreinte › Arts de Nel’Akna — 16 PTV › Formes anciennes — 8 PTV",
    "when": {
      "network": "nelakna"
    },
    "runtimeLore": "Chez les Ad’rak, une frappe réussie n’est souvent que la première syllabe d’une phrase martiale. La même ouverture peut devenir saisie, désarmement ou chute sans qu’un second échange soit nécessaire."
  },
  {
    "id": "extral-retour-de-la-main-vide",
    "name": "Retour de la main vide",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "",
    "prerequisiteName": "Garde du Sanctuaire",
    "effect": "Après une Défense active réussie contre une attaque de mêlée, le pratiquant peut immédiatement effectuer une attaque de Pugilat ou de Mêlée contre l’assaillant. Cette riposte ne peut elle-même déclencher un nouveau Retour de la main vide.",
    "group": "Ad’rak — origine restreinte › Arts de Nel’Akna — 16 PTV › Formes anciennes — 8 PTV",
    "when": {
      "network": "nelakna"
    },
    "runtimeLore": "Lorsqu’un assaillant vient mourir sur la garde de Nel’Akna, la réponse part avant qu’il ait repris sa posture. La défense réussie laisse le bras adverse ouvert et appelle immédiatement la contre-attaque."
  },
  {
    "id": "extral-souffle-profond",
    "name": "Souffle profond",
    "cost": 1,
    "access": "SR/R",
    "activation": "Réaction — 1/Scène",
    "prerequisiteName": "",
    "effect": "Après l’échec non narratif d’un test physique où la Vigueur ou l’Agilité est réellement déterminante - effort, saut, course, résistance corporelle ou maintien d’une prise - le pratiquant peut relancer le d10. Le second résultat est définitif.",
    "group": "Ad’rak — origine restreinte › Arts de Nel’Akna — 16 PTV › Souffle écarlate — 8 PTV",
    "when": {
      "network": "nelakna"
    },
    "runtimeLore": "Nel’Akna apprend à chercher plus loin que la première défaillance du corps. Quand force ou agilité lâchent sans catastrophe, une seconde poussée de Souffle tente de reprendre le geste avant qu’il ne soit perdu."
  },
  {
    "id": "extral-pas-ecarlate",
    "name": "Pas écarlate",
    "cost": 2,
    "access": "R",
    "activation": "1/round",
    "prerequisiteName": "",
    "effect": "Lors d’un Déplacement, le pratiquant peut manifester son Souffle et accomplir un franchissement impossible par simple performance physique : bond horizontal ou vertical extraordinaire, course brève sur une surface très inclinée ou verticale, changement d’appui brutal, franchissement d’un groupe ou accélération fulgurante. Ne donne aucun PA, ne permet pas de voler ni de rester sur un mur ; un vrai danger ou une opposition impose toujours un test approprié.",
    "group": "Ad’rak — origine restreinte › Arts de Nel’Akna — 16 PTV › Souffle écarlate — 8 PTV",
    "when": {
      "network": "nelakna"
    },
    "runtimeLore": "Le Pas écarlate transforme l’élan en trajectoire anormale : mur, pente ou vide bref cessent d’être des limites ordinaires. Le pratiquant ne vole pas ; il accomplit simplement un franchissement que son corps seul n’aurait jamais permis."
  },
  {
    "id": "extral-onde-ecarlate",
    "name": "Onde écarlate",
    "cost": 2,
    "access": "R",
    "activation": "1/round",
    "prerequisiteName": "",
    "effect": "Le pratiquant projette son Souffle à travers un mouvement de frappe et peut effectuer une attaque de Pugilat contre une cible jusqu’à 5 mètres : Vigueur + Pugilat + 1d10e contre la Défense normale. L’Onde utilise le DGT normal du Pugilat du personnage, réduit l’Armure de la cible de 2 contre cette attaque et, si au moins 1 dégât est infligé, repousse la cible de 1 m + DR lorsque sa masse et son ancrage le permettent. L’Onde compte comme attaque de Pugilat pour son jet et ses dégâts, mais ne constitue pas un contact physique : elle ne permet ni saisie, ni désarmement physique, ni Enchaînement des anciennes formes.",
    "group": "Ad’rak — origine restreinte › Arts de Nel’Akna — 16 PTV › Souffle écarlate — 8 PTV",
    "when": {
      "network": "nelakna"
    },
    "runtimeLore": "Un mouvement de frappe suffit à projeter le Souffle au-delà du poing. L’impact atteint une cible distante comme si la masse du combattant avait franchi l’espace avec lui, repoussant ce qu’elle parvient réellement à ébranler."
  },
  {
    "id": "extral-dechainement-ecarlate",
    "name": "Déchaînement écarlate",
    "cost": 3,
    "access": "R",
    "activation": "Début d’activation — 1/Scène",
    "prerequisiteName": "",
    "effect": "Jusqu’à la fin du round, le pratiquant gagne +1 PA,, puis choisit Vitesse ou Puissance. Vitesse : le premier Déplacement du round ne coûte aucun PA. Puissance : une seule attaque de Pugilat, Mêlée ou Onde écarlate réussie pendant le round augmente sa marge de +3 uniquement pour le calcul des dégâts et des effets physiques. Cela ne transforme pas le résultat du jet pour déclencher d’autres capacités ou prérequis.",
    "group": "Ad’rak — origine restreinte › Arts de Nel’Akna — 16 PTV › Souffle écarlate — 8 PTV",
    "when": {
      "network": "nelakna"
    },
    "runtimeLore": "Le Souffle écarlate peut envahir tout le corps pendant quelques secondes. Selon la manière dont il est libéré, il devient vitesse brutale ou puissance concentrée, toujours au prix d’un rythme impossible à maintenir longtemps."
  },
  {
    "id": "extral-declassement-fonctionnel",
    "name": "Déclassement fonctionnel",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec accès réel à un appareil trop avancé et aux outils nécessaires, le personnage peut volontairement sacrifier une fonction secondaire ou réduire les performances pour rendre l’ensemble exploitable avec une infrastructure locale insuffisante. Il ne crée aucune pièce manquante",
    "group": "Organisations Extrals › CTU — Californian Talasses Union — 16 PTV › Ingénierie de transition — 8 PTV",
    "when": {
      "network": "ctu"
    },
    "runtimeLore": "Quand l’infrastructure ne suit pas, la CTU accepte de perdre de la performance pour sauver la fonction essentielle. Une technologie trop avancée est volontairement simplifiée jusqu’au niveau que l’environnement local peut réellement soutenir."
  },
  {
    "id": "extral-emulation-de-composant",
    "name": "Émulation de composant",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Le personnage peut concevoir un substitut local et temporaire à un composant exotique introuvable, à partir de matériaux et d’outils réellement disponibles. Le substitut reproduit la fonction nécessaire, pas toute la technologie d’origine",
    "group": "Organisations Extrals › CTU — Californian Talasses Union — 16 PTV › Ingénierie de transition — 8 PTV",
    "when": {
      "network": "ctu"
    },
    "runtimeLore": "Un composant exotique introuvable peut être remplacé par une imitation fonctionnelle bricolée avec le monde disponible. Elle ne reproduit pas la technologie entière ; elle tient juste la place nécessaire pour que le système continue."
  },
  {
    "id": "extral-standard-terrestre",
    "name": "Standard terrestre",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Le personnage peut adapter durablement alimentation, connectique, interface ou protocole d’une technologie xéno afin qu’elle fonctionne avec un standard terrestre approprié sans exiger l’infrastructure d’origine",
    "group": "Organisations Extrals › CTU — Californian Talasses Union — 16 PTV › Ingénierie de transition — 8 PTV",
    "when": {
      "network": "ctu"
    },
    "runtimeLore": "Alimentation, connectique ou protocole cessent d’être des frontières culturelles. La CTU traduit durablement l’interface xéno vers un standard terrestre cohérent afin que l’appareil puisse vivre loin de son infrastructure d’origine."
  },
  {
    "id": "extral-prototype-de-transition",
    "name": "Prototype de transition",
    "cost": 3,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec temps, atelier et matériaux, le personnage peut produire un prototype local reproduisant une fonction majeure d’une technologie supérieure par des étapes intermédiaires moins avancées. Le prototype reste un objet réel : il peut être volé, cassé ou réparé",
    "group": "Organisations Extrals › CTU — Californian Talasses Union — 16 PTV › Ingénierie de transition — 8 PTV",
    "when": {
      "network": "ctu"
    },
    "runtimeLore": "L’ingénieur construit un pont technique entre deux âges. Le prototype reproduit une fonction majeure avec des solutions intermédiaires, moins élégantes mais suffisamment locales pour être entretenues, volées ou cassées comme n’importe quel objet."
  },
  {
    "id": "extral-interface-vulgarisee",
    "name": "Interface vulgarisée",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Le personnage peut encapsuler une interface xéno de façon qu’un opérateur formé mais non spécialiste puisse utiliser ses fonctions prévues sans comprendre le paradigme technique complet",
    "group": "Organisations Extrals › CTU — Californian Talasses Union — 16 PTV › Diffusion technologique — 8 PTV",
    "when": {
      "network": "ctu"
    },
    "runtimeLore": "Une technologie xéno peut recevoir une façade compréhensible par un opérateur local. La CTU encapsule la complexité au lieu de l’enseigner tout entière, permettant l’usage prévu sans transmettre le paradigme complet qui se cache dessous."
  },
  {
    "id": "extral-procedure-encapsulee",
    "name": "Procédure encapsulée",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Une procédure avancée peut être transformée en chaîne d’opérations reproductible par des techniciens locaux disposant des outils appropriés, sans leur transmettre toute la théorie d’origine",
    "group": "Organisations Extrals › CTU — Californian Talasses Union — 16 PTV › Diffusion technologique — 8 PTV",
    "when": {
      "network": "ctu"
    },
    "runtimeLore": "La CTU transforme une expertise rare en procédure transmissible. Chaque étape est isolée, sécurisée et reproductible afin qu’une équipe locale puisse accomplir le processus sans posséder la théorie qui l’a rendu possible."
  },
  {
    "id": "extral-atelier-distribue",
    "name": "Atelier distribué",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Un processus complexe peut être réparti entre plusieurs ateliers ou équipes disposant chacun de moyens incomplets, puis assemblé sans exiger que chaque site maîtrise toute la chaîne technologique",
    "group": "Organisations Extrals › CTU — Californian Talasses Union — 16 PTV › Diffusion technologique — 8 PTV",
    "when": {
      "network": "ctu"
    },
    "runtimeLore": "La CTU sait qu’un atelier incomplet peut devenir un maillon utile plutôt qu’un échec. Une fabrication complexe est divisée entre plusieurs sites, chacun produisant la partie qu’il est réellement capable de maîtriser."
  },
  {
    "id": "extral-industrialisation-frugale",
    "name": "Industrialisation frugale",
    "cost": 3,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec une infrastructure réelle et les ressources nécessaires, le personnage peut transformer un prototype de transition en petite chaîne reproductible localement. Le Talent ne finance ni l’usine, ni les matières, ni le personnel",
    "group": "Organisations Extrals › CTU — Californian Talasses Union — 16 PTV › Diffusion technologique — 8 PTV",
    "when": {
      "network": "ctu"
    },
    "runtimeLore": "Un prototype de transition peut devenir petite série lorsque l’infrastructure locale est organisée autour de ses vraies contraintes. La CTU simplifie la chaîne sans faire disparaître machines, matières ni personnel nécessaires."
  },
  {
    "id": "extral-microclimat-de-fortune",
    "name": "Microclimat de fortune",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec des matériaux réellement disponibles, créer rapidement une petite zone temporairement compatible avec les besoins vitaux d’une espèce connue : humidité, température, composition d’air ou contraintes comparables",
    "group": "Organisations Extrals › Croix Verte / Ligue Baséanne — 16 PTV › Acclimatation artificielle — 8 PTV",
    "when": {
      "network": "croix_verte"
    },
    "runtimeLore": "Avec quelques matériaux et un bon diagnostic xénobiologique, une petite zone peut être corrigée assez vite pour devenir temporairement respirable, humide ou thermiquement acceptable à une espèce donnée."
  },
  {
    "id": "extral-substitution-metabolique",
    "name": "Substitution métabolique",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Transformer ou combiner des ressources locales afin qu’elles remplacent temporairement une ressource biologique normalement incompatible : nutriment, électrolyte, support respiratoire ou besoin métabolique comparable",
    "group": "Organisations Extrals › Croix Verte / Ligue Baséanne — 16 PTV › Acclimatation artificielle — 8 PTV",
    "when": {
      "network": "croix_verte"
    },
    "runtimeLore": "Le besoin biologique compte plus que le produit d’origine. La Croix Verte transforme des ressources locales pour fournir nutriment, électrolyte ou support respiratoire sous une forme que l’organisme étranger peut réellement utiliser."
  },
  {
    "id": "extral-acclimatation-transitoire",
    "name": "Acclimatation transitoire",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Préparer un organisme connu afin qu’il supporte temporairement un milieu biologiquement incompatible mais pas instantanément létal, typiquement pour une scène ou une opération courte. Le Talent ne permet pas de survivre au vide ou à une impossibilité physique absolue",
    "group": "Organisations Extrals › Croix Verte / Ligue Baséanne — 16 PTV › Acclimatation artificielle — 8 PTV",
    "when": {
      "network": "croix_verte"
    },
    "runtimeLore": "La Croix Verte prépare un organisme à subir pendant un temps un environnement qui n’est pas le sien. Métabolisme, respiration ou équilibre interne sont soutenus juste assez pour rendre l’opération possible sans prétendre abolir les lois physiques."
  },
  {
    "id": "extral-habitat-de-survie",
    "name": "Habitat de survie",
    "cost": 3,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "À partir d’une infrastructure imparfaite et de ressources réelles, établir un habitat minimal capable de maintenir durablement en vie une petite population d’une espèce connue dans un environnement normalement incompatible",
    "group": "Organisations Extrals › Croix Verte / Ligue Baséanne — 16 PTV › Acclimatation artificielle — 8 PTV",
    "when": {
      "network": "croix_verte"
    },
    "runtimeLore": "Une infrastructure imparfaite peut devenir un milieu vivable si l’on comprend exactement ce que l’espèce exige. La Ligue baséanne assemble air, température, humidité et ressources en un habitat minimal capable de durer."
  },
  {
    "id": "extral-pont-metabolique",
    "name": "Pont métabolique",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Adapter un traitement, nutriment ou support biologique connu afin qu’un organisme d’une autre espèce puisse l’utiliser sans incompatibilité fondamentale",
    "group": "Organisations Extrals › Croix Verte / Ligue Baséanne — 16 PTV › Intervention xénobiologique — 8 PTV",
    "when": {
      "network": "croix_verte"
    },
    "runtimeLore": "La Ligue baséanne construit une compatibilité provisoire entre organisme et ressource. Aliment, médicament ou support biologique est reformulé jusqu’à devenir assimilable par une physiologie qui l’aurait normalement rejeté."
  },
  {
    "id": "extral-conversion-therapeutique",
    "name": "Conversion thérapeutique",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Convertir un traitement conçu pour une physiologie en une version fonctionnelle pour une autre espèce connue, avec ressources et analyse appropriées",
    "group": "Organisations Extrals › Croix Verte / Ligue Baséanne — 16 PTV › Intervention xénobiologique — 8 PTV",
    "when": {
      "network": "croix_verte"
    },
    "runtimeLore": "Un traitement n’est utile que s’il parle la langue du corps qui le reçoit. Le spécialiste traduit dosage, vecteur et métabolisme d’une physiologie connue vers une autre sans prétendre que deux espèces sont chimiquement identiques."
  },
  {
    "id": "extral-stabilisation-exotique",
    "name": "Stabilisation exotique",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Le personnage peut tenter de Stabiliser un organisme extraterrestre inconnu sans connaître préalablement son anatomie détaillée, en utilisant les signes vitaux et principes xénobiologiques disponibles. Le jet de soins reste nécessaire",
    "group": "Organisations Extrals › Croix Verte / Ligue Baséanne — 16 PTV › Intervention xénobiologique — 8 PTV",
    "when": {
      "network": "croix_verte"
    },
    "runtimeLore": "Face à une espèce inconnue, le xénobiologiste cherche d’abord ce qui est universel : circulation, échange, pression, intégrité. Il stabilise la fonction vitale avant de prétendre comprendre l’anatomie entière."
  },
  {
    "id": "extral-support-vital-universel",
    "name": "Support vital universel",
    "cost": 3,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec du matériel et des ressources réelles, le personnage peut maintenir temporairement en vie une physiologie extraterrestre inconnue malgré l’absence de protocole médical ou d’anatomie complète, jusqu’à obtention d’un traitement adapté",
    "group": "Organisations Extrals › Croix Verte / Ligue Baséanne — 16 PTV › Intervention xénobiologique — 8 PTV",
    "when": {
      "network": "croix_verte"
    },
    "runtimeLore": "Quand aucun protocole n’existe encore, la Croix Verte fabrique un maintien de vie à partir de principes fondamentaux. L’objectif n’est pas de guérir l’inconnu, seulement de lui acheter le temps nécessaire pour qu’un vrai traitement soit trouvé."
  },
  {
    "id": "extral-compartimentation-reptilienne",
    "name": "Compartimentation reptilienne",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Une cellule préparée est organisée de façon qu’une compromission n’établisse pas automatiquement le lien avec les autres cellules. Une enquête doit trouver une connexion concrète ; le Talent ne crée pas de faux papiers ni d’identité parfaite",
    "group": "Organisations Extrals › REPTILE — 8 PTV",
    "when": {
      "network": "reptile"
    },
    "runtimeLore": "REPTILE construit ses cellules comme des pièces qui n’ont pas besoin de connaître le plan complet. Une compromission locale révèle ce qui existe localement, pas une connexion imaginaire vers toutes les autres structures."
  },
  {
    "id": "extral-mandat-dormant",
    "name": "Mandat dormant",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Après une vraie préparation dans une institution infiltrée, le personnage peut laisser un ordre conditionnel légalement ou administrativement plausible qui sera exécuté lorsque son déclencheur survient, même en son absence",
    "group": "Organisations Extrals › REPTILE — 8 PTV",
    "when": {
      "network": "reptile"
    },
    "runtimeLore": "Un ordre conditionnel bien placé peut dormir dans la procédure jusqu’au jour où son déclencheur survient. REPTILE s’appuie sur la légitimité apparente du système lui-même plutôt que sur une intervention de dernière minute."
  },
  {
    "id": "extral-decision-distribuee",
    "name": "Décision distribuée",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Un réseau préparé peut poursuivre une opération et prendre les décisions prévues même si son centre ou son responsable est indisponible ; neutraliser un seul relais ne suffit pas à faire s’effondrer le dispositif",
    "group": "Organisations Extrals › REPTILE — 8 PTV",
    "when": {
      "network": "reptile"
    },
    "runtimeLore": "Le réseau a déjà réparti responsabilités et seuils de décision avant que le centre tombe. Une opération préparée continue donc à vivre dans ses relais au lieu d’attendre qu’une seule personne lui redonne la permission d’exister."
  },
  {
    "id": "extral-le-systeme-agit",
    "name": "Le système agit",
    "cost": 3,
    "access": "R",
    "activation": "Accès : Mo’sen N ; Talass/Baséanh/Rocréen/Thalsios/Ad’rak O si réellement recrutés ; Homo Superior R.",
    "prerequisiteName": "",
    "effect": "1/Scénario, lorsqu’une institution réellement infiltrée dispose déjà de l’autorité, du personnel et des moyens nécessaires, le personnage peut faire déclencher une action importante préparée en amont sans devoir intervenir personnellement au moment critique. Le Talent ne crée jamais une autorité inexistante ni un pouvoir que l’institution ne possède pas",
    "group": "Organisations Extrals › REPTILE — 8 PTV",
    "when": {
      "network": "reptile"
    },
    "runtimeLore": "L’infiltration réussie devient réellement dangereuse lorsque l’institution peut agir sans la présence de l’infiltré. REPTILE déclenche alors un mécanisme administratif ou opérationnel déjà préparé et disposant de moyens authentiques."
  },
  {
    "id": "extral-transpondeur-fantome",
    "name": "Transpondeur fantôme",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Préparer une signature ou identification de transit cohérente pour tromper les contrôles routiniers d’un trajet local, tant qu’aucune enquête ciblée ne dispose d’un élément compromettant",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Frontière noire — 8 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "Un transit clandestin est plus crédible lorsqu’il ressemble à quelque chose qui devrait vraiment être là. Le faux transpondeur reprend les codes et habitudes du trafic local jusqu’au moment où une enquête possède enfin une raison précise de douter."
  },
  {
    "id": "extral-soute-aveugle",
    "name": "Soute aveugle",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec un véhicule ou local réellement modifiable, créer une zone dissimulée conçue pour échapper aux inspections et scans de routine. Un contrôle ciblé ou une technologie explicitement adaptée peut toujours la trouver",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Frontière noire — 8 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "La soute aveugle est pensée contre l’inspection routinière : volumes morts, blindage et accès détourné. Elle n’est pas magique ; une recherche ciblée ou un scanner conçu pour ce type de cache peut toujours la débusquer."
  },
  {
    "id": "extral-fenetre-orbitale",
    "name": "Fenêtre orbitale",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Identifier et exploiter un créneau réel de surveillance, trafic ou synchronisation pour déplacer clandestinement un appareil ou une cargaison entre Terre, orbite et infrastructure proche",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Frontière noire — 8 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "La Frontière noire vit dans les moments où les réseaux de surveillance ne regardent pas au même endroit. Le Shaediri identifie ces fenêtres réelles et y fait passer appareil ou cargaison sans inventer d’invisibilité."
  },
  {
    "id": "extral-route-cislunaire",
    "name": "Route cislunaire",
    "cost": 3,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec accès au réseau et aux moyens de transport réels, construire une route clandestine cohérente Terre ↔ orbite ↔ Lune utilisant relais, fenêtres et nœuds locaux. Le Talent n’ouvre pas une route galactique gratuite",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Frontière noire — 8 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "Une route clandestine Terre-orbite-Lune est faite de relais, de créneaux et de gens qui ferment les yeux. Le réseau Shaediri sait assembler ces fragments en trajet cohérent sans transformer la contrebande locale en portail galactique."
  },
  {
    "id": "extral-substitution-galactique",
    "name": "Substitution galactique",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Identifier dans le marché xéno une alternative fonctionnelle à un composant ou produit rare lorsque l’original est indisponible. Il faut encore trouver et payer l’objet",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Marché xéno — 8 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "Le marché xéno contient souvent plusieurs technologies répondant au même besoin. Le Shaediri sait chercher l’alternative fonctionnelle quand le composant exact manque, à condition que quelqu’un la vende encore et que le personnage puisse la payer."
  },
  {
    "id": "extral-provenance-brouillee",
    "name": "Provenance brouillée",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Faire transiter une acquisition réelle par suffisamment de relais et substitutions pour que sa provenance ne soit pas automatiquement lisible ; une enquête disposant de preuves peut toujours remonter la chaîne",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Marché xéno — 8 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "Chaque intermédiaire change un détail de l’histoire de l’objet : facture, transporteur, entrepôt, propriétaire. À la fin, la provenance devient difficile à lire d’un coup, mais aucune preuve concrète n’est effacée par principe."
  },
  {
    "id": "extral-chaine-interdite",
    "name": "Chaîne interdite",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Utiliser les filières existantes pour sourcer un bien contrôlé ou interdit non unique. La disponibilité, le prix, les délais et les risques restent réels",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Marché xéno — 8 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "La Mafia Shaediri connaît les mains qui acceptent de vendre ce qui ne devrait pas circuler. Le réseau ouvre l’accès au bien interdit, mais ne fait disparaître ni prix, délai, rareté ni risque."
  },
  {
    "id": "extral-importation-noire",
    "name": "Importation noire",
    "cost": 3,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Une filière Shaediri peut faire parvenir jusqu’à la zone de campagne un objet rare mais non unique disponible quelque part dans son réseau. L’objet n’est jamais gratuit, le délai est réel et un artefact unique ou narrativement inaccessible reste inaccessible",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Marché xéno — 8 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "Une filière noire peut faire voyager un objet rare de relais en relais jusqu’à la campagne. Ce qui arrive est bien réel, acheté quelque part, et reste soumis à toutes les difficultés qu’implique son transport clandestin."
  },
  {
    "id": "extral-refuge-fraternel",
    "name": "Refuge fraternel",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Dans une zone où un réseau Shaekori existe réellement, trouver un refuge clandestin difficile à relier au personnage sans piste concrète",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Shaekori — 7 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "Une ville où vit la Fraternité contient aussi ses portes discrètes. Le membre sait quel appartement, atelier ou arrière-salle peut devenir refuge sans que le lieu soit automatiquement relié à lui par les contrôles ordinaires."
  },
  {
    "id": "extral-relais-brule",
    "name": "Relais brûlé",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Lorsqu’un relais est compromis, le réseau peut le sacrifier sans exposer automatiquement les autres nœuds et basculer une opération vers une voie alternative préparée",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Shaekori — 7 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "Un relais compromis est parfois moins précieux que les liens qu’il protège. Les Shaekori savent l’abandonner proprement, couper ses connexions et faire basculer l’opération vers une voie préparée avant que l’incendie ne gagne le réseau."
  },
  {
    "id": "extral-extraction-fraternelle",
    "name": "Extraction fraternelle",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "1/Scénario, avec un réseau local réel et une voie praticable, organiser l’extraction d’un membre ou allié depuis une position dangereuse mais non totalement verrouillée. Cela prend le temps nécessaire et n’invoque pas une équipe depuis le néant",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Shaekori — 7 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "Les Shaekori ne laissent pas facilement un des leurs enfermé derrière eux. Si un réseau local possède réellement une voie de sortie, il peut organiser l’extraction avec les personnes et les moyens déjà présents dans la zone."
  },
  {
    "id": "extral-reseau-sans-centre",
    "name": "Réseau sans centre",
    "cost": 2,
    "access": "R",
    "activation": "Accès : Rocréen N ; autres espèces O via vraie intégration, y compris Ad’rak ; Homo Superior R.",
    "prerequisiteName": "",
    "effect": "La destruction ou compromission d’un nœud important ne paralyse pas automatiquement la structure locale ; une enquête doit cartographier séparément les autres relais",
    "group": "Organisations Extrals › Mafia Shaediri — 23 PTV › Shaekori — 7 PTV",
    "when": {
      "network": "shaediri"
    },
    "runtimeLore": "La Fraternité refuse le point unique dont dépendraient tous les autres. Chaque relais connaît assez peu du reste pour que la chute d’un nœud important oblige encore l’adversaire à reconstruire toute la cartographie."
  },
  {
    "id": "extral-equilibrage-brutal",
    "name": "Équilibrage brutal",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Les turbulences, changements de courant ou pertes d’orientation dans un milieu liquide ne suffisent pas à interrompre une action physique que le personnage peut réellement accomplir",
    "group": "Organisations Extrals › Hydroguard / THDF — 16 PTV › Combat hydrostatique — 8 PTV",
    "when": {
      "network": "hydroguard"
    },
    "runtimeLore": "Courants et remous déplacent l’environnement, pas la discipline du combattant. La Hydroguard sait conserver suffisamment d’orientation pour poursuivre l’action malgré les secousses ordinaires d’un milieu violent."
  },
  {
    "id": "extral-propulsion-vectorielle",
    "name": "Propulsion vectorielle",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec une propulsion, une nage ou un dispositif approprié, le personnage peut changer brutalement de direction, s’arrêter ou repartir dans un espace tridimensionnel sans perdre une activation à se réorienter",
    "group": "Organisations Extrals › Hydroguard / THDF — 16 PTV › Combat hydrostatique — 8 PTV",
    "when": {
      "network": "hydroguard"
    },
    "runtimeLore": "Une propulsion maîtrisée permet de casser net une trajectoire aquatique. L’opérateur change d’axe, freine ou repart sans perdre de temps à remettre son corps dans un « haut » et un « bas » qui n’existent plus vraiment."
  },
  {
    "id": "extral-poussee-d-interception",
    "name": "Poussée d’interception",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Réaction, 1 PA, 1/round : se déplacer immédiatement sur une courte trajectoire dans le milieu liquide pour intercepter un danger, rejoindre une cible ou se placer entre elle et une menace, si la distance est physiquement couverte",
    "group": "Organisations Extrals › Hydroguard / THDF — 16 PTV › Combat hydrostatique — 8 PTV",
    "when": {
      "network": "hydroguard"
    },
    "runtimeLore": "Dans l’eau, l’interception se joue en trois dimensions. Le combattant hydrostatique lance son corps sur une courte trajectoire pour rejoindre, couvrir ou couper une menace avant que la distance ne se referme autrement."
  },
  {
    "id": "extral-percee-hydrostatique",
    "name": "Percée hydrostatique",
    "cost": 3,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "1/Scène : lors d’un Déplacement aquatique ou sous pression, franchir dans la même action un courant violent, une zone de turbulence ou un obstacle de milieu normalement capable de stopper le mouvement ; une impossibilité physique absolue reste impossible",
    "group": "Organisations Extrals › Hydroguard / THDF — 16 PTV › Combat hydrostatique — 8 PTV",
    "when": {
      "network": "hydroguard"
    },
    "runtimeLore": "La Hydroguard apprend à lire le courant comme un terrain qui se traverse, non comme un mur. Une poussée bien choisie permet de franchir turbulence et pression sans que le milieu impose automatiquement l’arrêt."
  },
  {
    "id": "extral-remorquage-de-combat",
    "name": "Remorquage de combat",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Dans l’eau, déplacer une cible inconsciente ou consentante de gabarit comparable sans que le remorquage réduise à lui seul le Déplacement normal",
    "group": "Organisations Extrals › Hydroguard / THDF — 16 PTV › Sauvetage abyssal — 8 PTV",
    "when": {
      "network": "hydroguard"
    },
    "runtimeLore": "Dans l’eau, un corps neutralisé n’a pas à devenir une ancre. L’entraînement THDF apprend à le placer dans le flux du déplacement pour que le sauvetage conserve l’allure normale du nageur."
  },
  {
    "id": "extral-partage-de-survie",
    "name": "Partage de survie",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec une réserve, un recycleur ou une physiologie réellement compatible, partager temporairement un support respiratoire ou vital avec une cible adjacente sans perdre l’usage du dispositif pour soi-même",
    "group": "Organisations Extrals › Hydroguard / THDF — 16 PTV › Sauvetage abyssal — 8 PTV",
    "when": {
      "network": "hydroguard"
    },
    "runtimeLore": "Une réserve vitale bien comprise peut nourrir deux organismes au lieu d’un seul. Le sauveteur partage air ou support sans condamner immédiatement son propre système, tant que leur physiologie et le dispositif l’acceptent réellement."
  },
  {
    "id": "extral-sas-humain",
    "name": "Sas humain",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec équipement et quelques instants de préparation, faire passer une cible vivante par une transition de pression, température ou milieu qui exigerait normalement un sas spécialisé complet, tant que les limites physiques restent survivables",
    "group": "Organisations Extrals › Hydroguard / THDF — 16 PTV › Sauvetage abyssal — 8 PTV",
    "when": {
      "network": "hydroguard"
    },
    "runtimeLore": "Avec équipement et quelques secondes de discipline, le sauveteur remplace une partie du travail d’un sas complet. Il accompagne le corps à travers pression, température ou changement de milieu sans prétendre rendre survivable ce qui ne l’est pas."
  },
  {
    "id": "extral-extraction-abyssale",
    "name": "Extraction abyssale",
    "cost": 3,
    "access": "R",
    "activation": "Accès : Thalsios N ; Rocréen N ; Baséanh O ; Talass O ; Mo’sen R ; Ad’rak O ; Homo Superior O.",
    "prerequisiteName": "",
    "effect": "1/Scène : lorsqu’une cible est neutralisée dans un environnement aquatique dangereux, combiner saisie, remorquage et franchissement d’un obstacle de milieu en une seule intervention d’extraction. Le matériel nécessaire reste nécessaire",
    "group": "Organisations Extrals › Hydroguard / THDF — 16 PTV › Sauvetage abyssal — 8 PTV",
    "when": {
      "network": "hydroguard"
    },
    "runtimeLore": "Le sauvetage abyssal ne sépare pas saisir, franchir et remorquer. L’opérateur transforme ces gestes en une seule séquence d’extraction, tant que matériel, voie et survie physique rendent encore la manœuvre possible."
  },
  {
    "id": "extral-veille-genetique",
    "name": "Veille génétique",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Le porteur entraîné sait reconnaître immédiatement qu’une de ses modifications orgienétiques entre en rejet, dysfonction ou conflit physiologique et peut distinguer la modification concernée sans diagnostic complet",
    "group": "Organisations Extrals › SMRC / AGI — Orgienétique — 16 PTV › Expression mosaïque — 8 PTV",
    "when": {
      "network": "smrc"
    },
    "runtimeLore": "Les conflits entre greffes ont des signes subtils avant de devenir catastrophes. Le porteur entraîné reconnaît quelle modification commence à rejeter, dériver ou perturber l’organisme avant même d’en connaître toute la cause."
  },
  {
    "id": "extral-profil-phenotypique",
    "name": "Profil phénotypique",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Une modification conçue avec plusieurs modes d’expression peut être basculée volontairement entre ces modes sans intervention chirurgicale, dans les limites prévues par sa conception",
    "group": "Organisations Extrals › SMRC / AGI — Orgienétique — 16 PTV › Expression mosaïque — 8 PTV",
    "when": {
      "network": "smrc"
    },
    "runtimeLore": "Une même modification peut contenir plusieurs expressions prévues. Le porteur apprend à passer d’un profil à l’autre comme il changerait l’état d’un organe spécialisé, sans chirurgie supplémentaire."
  },
  {
    "id": "extral-sursaut-d-expression",
    "name": "Sursaut d’expression",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "1/Scène, une modification biologique compatible peut être poussée temporairement au-delà de son régime normal pendant un round pour accomplir une fonction explicitement prévue comme sur-régime par sa conception. Cela n’invente jamais une nouvelle fonction",
    "group": "Organisations Extrals › SMRC / AGI — Orgienétique — 16 PTV › Expression mosaïque — 8 PTV",
    "when": {
      "network": "smrc"
    },
    "runtimeLore": "L’AGI sait pousser un greffon exactement dans le régime d’urgence prévu par ses concepteurs. Pendant quelques secondes, la fonction existante monte au-delà de sa norme sans inventer une capacité que la modification n’a jamais possédée."
  },
  {
    "id": "extral-heritage-recombine",
    "name": "Héritage recombiné",
    "cost": 3,
    "access": "SR/R",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Si une modification reproduit réellement l’architecture biologique nécessaire à un Talent racial extral, le personnage peut acheter ce Talent en accès R ; tous les prérequis et conditions restent applicables. L’accès ne concerne que le Talent réellement justifié, jamais l’arbre entier",
    "group": "Organisations Extrals › SMRC / AGI — Orgienétique — 16 PTV › Expression mosaïque — 8 PTV",
    "when": {
      "network": "smrc"
    },
    "runtimeLore": "L’Expression mosaïque peut reconstruire assez fidèlement une architecture raciale pour en rendre certaines aptitudes accessibles. Le porteur n’hérite pas d’un peuple entier : seulement de ce que la greffe reproduit biologiquement de manière crédible."
  },
  {
    "id": "extral-tolerance-au-greffon",
    "name": "Tolérance au greffon",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Le personnage peut intégrer et utiliser une modification orgienétique d’origine xéno compatible sans que sa simple étrangeté biologique suffise à provoquer un rejet automatique ; les incompatibilités réelles restent réelles",
    "group": "Organisations Extrals › SMRC / AGI — Orgienétique — 16 PTV › Architecture organique — 8 PTV",
    "when": {
      "network": "smrc"
    },
    "runtimeLore": "Le corps entraîné à l’orgienétique sait accueillir une biologie xéno compatible sans la traiter comme un ennemi par simple étrangeté. Une incompatibilité véritable reste pourtant une incompatibilité, quelle que soit la sophistication de l’intégration."
  },
  {
    "id": "extral-redondance-biologique",
    "name": "Redondance biologique",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Une modification conçue avec redondance peut maintenir temporairement sa fonction malgré la destruction ou panne d’un de ses éléments, jusqu’à la fin de la scène ou jusqu’à ce que la structure entière soit réellement détruite",
    "group": "Organisations Extrals › SMRC / AGI — Orgienétique — 16 PTV › Architecture organique — 8 PTV",
    "when": {
      "network": "smrc"
    },
    "runtimeLore": "Une architecture vivante peut posséder son propre système de secours. Quand un élément local tombe, le doublon organique prend la fonction jusqu’à ce que la structure entière soit réellement compromise."
  },
  {
    "id": "extral-compensation-croisee",
    "name": "Compensation croisée",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "1/Scène, une augmentation biologique compatible peut soutenir temporairement un autre système physiologique défaillant jusqu’à la fin de la scène, sans réparer la lésion elle-même",
    "group": "Organisations Extrals › SMRC / AGI — Orgienétique — 16 PTV › Architecture organique — 8 PTV",
    "when": {
      "network": "smrc"
    },
    "runtimeLore": "Une greffe peut parfois soutenir temporairement la fonction d’une autre partie du corps. L’AGI redirige alors capacité, circulation ou signal pour maintenir l’organisme jusqu’à la fin de la crise sans prétendre réparer la lésion."
  },
  {
    "id": "extral-architecture-quadrigenique",
    "name": "Architecture quadrigénique",
    "cost": 3,
    "access": "R",
    "activation": "Accès : Baséanh N ; Thalsios N ; Mo’sen O ; Rocréen O ; Talass R expérimental ; Ad’rak O ; Homo Superior R.",
    "prerequisiteName": "",
    "effect": "Le porteur peut maintenir une architecture complexe de plusieurs modifications hétérogènes conçues pour coopérer, sans que leur coexistence crée à elle seule une incompatibilité fonctionnelle. Les limitations et fonctions propres de chaque greffe restent inchangées",
    "group": "Organisations Extrals › SMRC / AGI — Orgienétique — 16 PTV › Architecture organique — 8 PTV",
    "when": {
      "network": "smrc"
    },
    "runtimeLore": "L’orgienétique avancée ne juxtapose pas des greffes ; elle conçoit leurs interfaces. Plusieurs modifications étrangères peuvent donc partager le même organisme sans entrer automatiquement en guerre biologique lorsqu’elles ont été pensées pour coopérer."
  },
  {
    "id": "extral-mobilite-cuirassee",
    "name": "Mobilité cuirassée",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Une armure lourde adaptée et correctement calibrée ne transforme pas à elle seule les mouvements Talass maîtrisés en actions impossibles ; le porteur peut exploiter normalement les articulations et vecteurs prévus par l’équipement",
    "group": "Organisations Extrals › Émeraude Sanglante — 16 PTV › Armure d’Émeraude — 8 PTV",
    "when": {
      "network": "emeraude"
    },
    "runtimeLore": "Les Talass de l’Émeraude ne considèrent pas l’armure lourde comme une boîte autour de leur cinétique. Un modèle correctement adapté préserve les articulations et vecteurs nécessaires à leurs bonds au lieu de les condamner à marcher comme des humanoïdes ordinaires."
  },
  {
    "id": "extral-servomusculature",
    "name": "Servomusculature",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Avec une armure assistée appropriée, le porteur peut employer sa servomusculature pour accomplir des efforts que sa petite morphologie ne pourrait pas entreprendre seule. La capacité dépend toujours des caractéristiques réelles de l’armure",
    "group": "Organisations Extrals › Émeraude Sanglante — 16 PTV › Armure d’Émeraude — 8 PTV",
    "when": {
      "network": "emeraude"
    },
    "runtimeLore": "La servomusculature transforme une petite morphologie en opérateur d’armure lourde. Les moteurs portent une partie de l’effort et permettent des tâches de force qui resteraient impossibles au Talass nu."
  },
  {
    "id": "extral-verrou-inertiel",
    "name": "Verrou inertiel",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Réaction, 1/round : avec une armure compatible, empêcher un renversement ou déplacement forcé purement physique en verrouillant instantanément la structure, si l’effet reste dans les capacités mécaniques du système",
    "group": "Organisations Extrals › Émeraude Sanglante — 16 PTV › Armure d’Émeraude — 8 PTV",
    "when": {
      "network": "emeraude"
    },
    "runtimeLore": "L’armure peut devenir ancre pendant une fraction de seconde. Joints, appuis et inertie se verrouillent ensemble pour refuser une poussée physique qui reste encore dans les capacités mécaniques du système."
  },
  {
    "id": "extral-armure-obstinee",
    "name": "Armure obstinée",
    "cost": 3,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "1/Scène : lorsqu’un système d’armure devrait être neutralisé par une panne locale non catastrophique, le porteur peut maintenir ses fonctions essentielles jusqu’à la fin de la scène. Une destruction réelle du système ne peut être ignorée",
    "group": "Organisations Extrals › Émeraude Sanglante — 16 PTV › Armure d’Émeraude — 8 PTV",
    "when": {
      "network": "emeraude"
    },
    "runtimeLore": "Une Armure d’Émeraude est conçue pour continuer après la première panne. Le porteur sait isoler un défaut local et maintenir les fonctions essentielles jusqu’à la fin de l’engagement tant que la structure n’est pas réellement détruite."
  },
  {
    "id": "extral-sous-le-tir",
    "name": "Sous le tir",
    "cost": 1,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Une fois par round, quand le personnage se déplace vers un adversaire sensiblement plus grand ou plus lourd sous feu hostile, une simple pression de tir ne suffit pas à interrompre son Déplacement ; les impacts et effets réels restent appliqués",
    "group": "Organisations Extrals › Émeraude Sanglante — 16 PTV › Doctrine du Géant — 8 PTV",
    "when": {
      "network": "emeraude"
    },
    "runtimeLore": "Avancer sur plus massif que soi est une discipline de volonté autant que de trajectoire. La simple pression des tirs ne suffit pas à casser l’approche d’un Talass formé, même si chaque impact réel continue évidemment de compter."
  },
  {
    "id": "extral-ouvrir-la-cuirasse",
    "name": "Ouvrir la cuirasse",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Après une attaque réussie produisant une Altération sur une cible protégée, le personnage peut choisir de créer une brèche exploitable dans sa protection plutôt qu’une autre Altération appropriée",
    "group": "Organisations Extrals › Émeraude Sanglante — 16 PTV › Doctrine du Géant — 8 PTV",
    "when": {
      "network": "emeraude"
    },
    "runtimeLore": "Quand une attaque réussie offre le choix d’une conséquence, la Doctrine du Géant préfère parfois la chirurgie au spectaculaire. Elle transforme l’impact en défaut exploitable dans la cuirasse plutôt qu’en autre effet immédiat."
  },
  {
    "id": "extral-exploiter-la-breche",
    "name": "Exploiter la brèche",
    "cost": 2,
    "access": "",
    "activation": "",
    "prerequisiteName": "",
    "effect": "Une fois par round, lorsqu’une cible possède une brèche créée ou identifiée par la Doctrine du Géant, une attaque du personnage visant explicitement cette brèche réduit de 2 l’Armure applicable",
    "group": "Organisations Extrals › Émeraude Sanglante — 16 PTV › Doctrine du Géant — 8 PTV",
    "when": {
      "network": "emeraude"
    },
    "runtimeLore": "Une protection déjà ouverte n’a pas besoin d’être vaincue une seconde fois. L’Émeraude Sanglante dirige son attaque dans la faiblesse existante et fait travailler le coup contre ce qui reste derrière plutôt que contre toute l’armure."
  },
  {
    "id": "extral-demantelement-methodique",
    "name": "Démantèlement méthodique",
    "cost": 3,
    "access": "R",
    "activation": "",
    "prerequisiteName": "",
    "effect": "1/Scène : après avoir créé ou exploité une brèche sur une cible plus massive, le personnage peut coordonner l’escouade pour que la brèche reste exploitable jusqu’à la fin du round par les alliés capables de la viser. Aucun bonus d’attaque n’est créé et la géométrie doit le permettre",
    "group": "Organisations Extrals › Émeraude Sanglante — 16 PTV › Doctrine du Géant — 8 PTV",
    "when": {
      "network": "emeraude"
    },
    "runtimeLore": "La Doctrine du Géant apprend à ne pas perdre une brèche dès qu’elle est créée. Le premier combattant la maintient lisible pour l’escouade afin que plusieurs alliés puissent viser le même défaut avant que la cible ne se réorganise."
  },
  {
    "id": "extral-releve-de-position",
    "name": "Relève de position",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "1/round",
    "prerequisiteName": "",
    "effect": "Au début d’une passe, avant que l’un des deux ait agi dans cette passe, le personnage et un allié consentant disposant chacun d’au moins 1 PA peuvent échanger leur position dans l’ordre d’Initiative pour cette passe uniquement. Ils doivent pouvoir communiquer et participer à la même action tactique. Aucun PA n’est créé.",
    "group": "Doctrines AIDH › Doctrine d’Intervention AIDH — 8 PTV",
    "when": {
      "network": "aidh_intervention"
    },
    "runtimeLore": "La doctrine d’intervention traite l’initiative comme une ressource d’équipe. Deux agents préparés peuvent échanger leur place dans la séquence afin que celui dont la fonction est devenue urgente agisse au bon moment."
  },
  {
    "id": "extral-interposition-doctrinale",
    "name": "Interposition doctrinale",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Réaction — 1 PA — 1/round",
    "prerequisiteName": "",
    "effect": "Quand un allié proche est ciblé par une attaque que le personnage perçoit et contre laquelle il peut physiquement intervenir, celui-ci effectue Agilité + Esquive + 1d10e. L’attaque doit dépasser la meilleure Défense entre celle de la cible et celle obtenue par l’intervenant. La fiction détermine s’il dévie, tire l’allié ou s’interpose ; aucune impossibilité physique n’est créée.",
    "group": "Doctrines AIDH › Doctrine d’Intervention AIDH — 8 PTV",
    "when": {
      "network": "aidh_intervention"
    },
    "runtimeLore": "L’AIDH entraîne ses opérateurs à lire une attaque comme un problème de trajectoire. Tirer un allié, dévier ou prendre sa place devient un réflexe coordonné, sans jamais abolir les impossibilités physiques du terrain."
  },
  {
    "id": "extral-releve-immediate",
    "name": "Relève immédiate",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Réaction — 1 PA — 1/round",
    "prerequisiteName": "",
    "effect": "Quand un allié visible tombe à 0 PV ou moins, est immobilisé, mis hors de combat ou perd brutalement sa capacité à tenir sa position, le personnage peut immédiatement effectuer un Déplacement vers lui. S’il termine au contact, il peut accomplir gratuitement une manipulation simple directement liée à sa sécurisation : le saisir, le tirer derrière un couvert adjacent, récupérer l’objet qu’il vient de lâcher ou prendre son relais sur un dispositif. Aucun soin ou attaque gratuit.",
    "group": "Doctrines AIDH › Doctrine d’Intervention AIDH — 8 PTV",
    "when": {
      "network": "aidh_intervention"
    },
    "runtimeLore": "Quand un équipier tombe, l’AIDH considère la position vide comme une brèche à combler immédiatement. L’opérateur se déplace vers lui et accomplit le geste de sécurisation le plus simple avant que la scène ne se désorganise."
  },
  {
    "id": "extral-sequence-coordonnee",
    "name": "Séquence coordonnée",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "1/Scène",
    "prerequisiteName": "",
    "effect": "Choisir un allié pouvant communiquer avec le personnage. Jusqu’à la fin du round, chaque fois que les deux sont autorisés à agir dans la même passe, le premier peut faire jouer l’autre immédiatement après lui, avant la poursuite normale de l’ordre d’Initiative. Chacun ne dépense que le PA normalement disponible dans cette passe, ne peut agir qu’une fois dans cette passe et ne gagne aucun PA.",
    "group": "Doctrines AIDH › Doctrine d’Intervention AIDH — 8 PTV",
    "when": {
      "network": "aidh_intervention"
    },
    "runtimeLore": "Deux agents qui partagent la même séquence tactique peuvent enchaîner leurs activations comme un seul mouvement collectif. Aucun temps n’est créé ; seule l’ordre des gestes devient volontairement synchronisé."
  },
  {
    "id": "extral-calibration-de-coherence",
    "name": "Calibration de cohérence",
    "cost": 1,
    "access": "V/SR/R",
    "activation": "Actif — 1 PA",
    "prerequisiteName": "",
    "effect": "Avec un capteur AIDH ou compatible, déterminer si l’Hologramme est activement sollicité dans une zone proche : fonctionnement normal, Révélation récente ou en cours, contrainte active sur le Voile, anomalie de cohérence ou stabilisation artificielle. Ne révèle pas la forme réelle d’une cible V et n’identifie pas automatiquement son espèce.",
    "group": "Doctrines AIDH › Protocoles de Cohérence AIDH — 8 PTV",
    "when": {
      "network": "aidh_coherence"
    },
    "runtimeLore": "Un capteur AIDH ne voit pas la Vérité nue, mais il reconnaît quand l’Hologramme travaille. Révélation, contrainte, anomalie ou stabilisation artificielle laissent des signatures assez nettes pour être distinguées."
  },
  {
    "id": "extral-chaine-invariante",
    "name": "Chaîne invariante",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "",
    "prerequisiteName": "Calibration de cohérence",
    "effect": "Avec un dispositif d’Enregistrement invariant, relier pour le reste de la scène un unique flux ordinaire - caméra, micro, capteur, terminal ou transmission - de façon que toute modification ultérieure par l’Hologramme devienne détectable comme rupture d’intégrité. Cela ne rend pas les données absolument indestructibles.",
    "group": "Doctrines AIDH › Protocoles de Cohérence AIDH — 8 PTV",
    "when": {
      "network": "aidh_coherence"
    },
    "runtimeLore": "L’Enregistrement invariant protège moins l’image que son intégrité. Une fois le flux attaché à une chaîne de cohérence, toute réécriture ultérieure par l’Hologramme laisse une rupture détectable dans le dossier."
  },
  {
    "id": "extral-ancrage-de-terrain",
    "name": "Ancrage de terrain",
    "cost": 2,
    "access": "V/SR/R",
    "activation": "Actif — 1 PA — maintien 1 PA/round",
    "prerequisiteName": "",
    "effect": "Avec un dispositif AIDH approprié, ancrer une cible consentante à courte portée dans son état V/SR/R actuel. Lorsqu’un effet extérieur tente de forcer son changement d’état, l’opérateur peut opposer Esprit + Technologie + 1d10e au test normalement utilisé par l’effet ; si celui-ci possède déjà une procédure d’opposition spécifique, elle prévaut. La cible peut toujours changer volontairement d’état. L’Ancrage ne révèle personne, ne force jamais R→V et plusieurs protections équivalentes ne cumulent pas leurs valeurs.",
    "group": "Doctrines AIDH › Protocoles de Cohérence AIDH — 8 PTV",
    "when": {
      "network": "aidh_coherence"
    },
    "runtimeLore": "Les dispositifs AIDH de cohérence peuvent fixer une personne à l’état sous lequel le monde la traite déjà. L’ancrage ne révèle rien : il rend simplement plus difficile à une force extérieure d’imposer un changement de couche du Voile."
  },
  {
    "id": "extral-fenetre-invariante",
    "name": "Fenêtre invariante",
    "cost": 3,
    "access": "V/SR/R",
    "activation": "",
    "prerequisiteName": "Chaîne invariante",
    "effect": "Avec un projecteur de cohérence approprié, créer jusqu’à la fin du round suivant une petite zone d’observation instrumentale stable. Les phénomènes réellement observés dans la zone ne sont pas immédiatement réinterprétés dans les données reliées au système et peuvent être transférés vers une Chaîne invariante. La Fenêtre ne Révèle personne, ne montre pas la Vérité d’une cible V, ne change aucun état V/SR/R et n’éteint pas l’Hologramme.",
    "group": "Doctrines AIDH › Protocoles de Cohérence AIDH — 8 PTV",
    "when": {
      "network": "aidh_coherence"
    },
    "runtimeLore": "La Fenêtre invariante crée un petit espace où l’instrumentation résiste quelques instants à la réinterprétation du Voile. Elle n’arrache personne à V ; elle permet seulement aux données correctement reliées de rester ce qu’elles ont réellement observé."
  }
] as const;
