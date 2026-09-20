type Block={type:"p";text:string;style?:string}|{type:"table";rows:unknown[][]};
type Section={id:string;title:string;level:number;audience?:"mj";blocks:Block[]};
type Article={id:string;dataset:string;category:string;sourceCategory:string;title:string;source:string;status:string;rebuildV2:true;tags:string[];sections:Section[]};
const SOURCE="TUC_Verite_V7_CROSSAUDIT_2026-09-10.docx";
const SOURCE_PAYLOAD={
  "lore": [
    {
      "id": "ouverture",
      "title": "Repère",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "« Ils ne sont pas nés anges. Elynea leur a appris à le devenir. »"
        }
      ]
    },
    {
      "id": "des-creations-d-aer",
      "title": "Des créations d’Aèr",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les premiers Anges viennent d’Aèr. À l’origine, ils étaient des créatures artificielles élémentaires, proches de golems d’air et d’eau, capables d’agir mais dépourvues de la continuité personnelle qui caractérise aujourd’hui les Angelus. Elynea, elle￾même issue de puissances divines d’Aèr, déposa une fraction de sa propre essence en eux et transforma leur condition. La Transcendance leur donna initiative, intelligence, affinité avec la Lumière et surtout une véritable identité persistante. L’Angelus moderne n’est donc pas une espèce céleste éternelle ayant toujours existé sous cette forme, mais le résultat d’une œuvre divine accomplie sur des créations d’Aèr."
        }
      ]
    },
    {
      "id": "la-guerre-celeste-et-la-religion-humaine",
      "title": "La Guerre céleste et la religion humaine",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Après la Guerre céleste, la victoire d’Elynea fut aussi religieuse. Les grandes traditions monothéistes de la Terre se développèrent dans le sillage de sa propagande : Elynea y prit la place du Dieu unique tandis que les anciennes Divinités polythéistes furent progressivement diabolisées, invisibilisées ou absorbées dans le récit de puissances infernales. Cela ne signifie pourtant pas que les religions monothéistes modernes servent les Angelus. Des millénaires d’histoire, de théologie, de schismes et d’institutions humaines les ont rendues autonomes. L’Église, notamment, conserve une véritable méfiance à l’égard des Angelus et ne considère pas qu’une créature ailée mérite obéissance simplement parce qu’elle affirme agir au nom du Ciel. Dans un monde où possessions, illusions et manipulations existent, cette prudence est parfaitement rationnelle."
        }
      ]
    },
    {
      "id": "incarnation-et-eveil",
      "title": "Incarnation et Éveil",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Angelus peuvent vivre sur Terre au travers d’incarnations qui commencent très tôt. Une âme transcendée peut être déposée dans un nourrisson et grandir réellement au milieu des Humains. Enfance, éducation, amis, profession et relations appartiennent alors pleinement à l’Angelus, même lorsque l’Éveil ramène plus tard des souvenirs célestes beaucoup plus anciens. Cette continuité produit des êtres capables d’être à la fois très anciens et profondément contemporains. Une mission reçue d’un Archange n’efface pas la famille qui les a élevés ni les années passées dans une profession terrestre. Leur identité est la superposition de ces expériences, pas le remplacement de l’une par l’autre."
        }
      ]
    },
    {
      "id": "une-psychologie-non-humaine",
      "title": "Une psychologie non humaine",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Angelus possèdent des émotions mais entretiennent souvent avec elles une distance particulière. Ils peuvent aimer, souffrir, jalouser, haïr ou faire leur deuil sans interpréter instinctivement les réactions affectives comme le ferait un Humain. Chez certains, des décennies d’incarnation rendent cette différence presque invisible ; chez d’autres, elle produit une étrange impression de compréhension intellectuelle sans intuition émotionnelle."
        }
      ]
    },
    {
      "id": "l-arbre-de-vie",
      "title": "L’Arbre de Vie",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La grande œuvre terrestre d’Elynea est l’Arbre de Vie, architecture spirituelle destinée à organiser les Angelus et canaliser la Transcendance. Les Angelus ordinaires en forment les racines, Elynea le tronc et les Archanges les grandes branches. L’Auréole relie l’âme angélique à cet ensemble et sert de passage à l’énergie, à l’information spirituelle et à certaines transitions entre espaces célestes. Les ailes appartiennent elles aussi à la Transcendance : elles sont des manifestations énergétiques plutôt que de simples membres biologiques. Les Yeux célestes permettent de percevoir certaines Vérités derrière le Voile sans forcer pour autant une cible à se Révéler."
        }
      ]
    },
    {
      "id": "trones-vertus-et-dominations",
      "title": "Trônes, Vertus et Dominations",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La Nature angélique décrit davantage la manière d’agir. Le Trône observe, poursuit, identifie et juge. La Vertu agit sur passions, vices, blessures intérieures et purification, avec toute l’ambiguïté d’un pouvoir capable d’apaiser ou d’armer les émotions. La Domination est l’exécuteur, spécialisé dans la destruction ciblée et l’élimination de proies identifiées."
        }
      ]
    },
    {
      "id": "archanges-seraphins-et-dissidences",
      "title": "Archanges, Séraphins et dissidences",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Chaque Angelus possède un lien profond avec un Archange. Les Séraphins les plus importants ont également produit des lignées d’enseignement, maisons et écoles qui transmettent des interprétations particulières du devoir céleste. La hiérarchie n’est pas immobile : des Archanges renégats existent, parfois non parce qu’ils auraient trahi Elynea mais parce qu’ils furent jugés trop indépendants, dangereux ou incompatibles avec la place qui leur était assignée."
        }
      ]
    },
    {
      "id": "les-angelus-en-2035",
      "title": "Les Angelus en 2035",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La Californie contemporaine est un environnement étrange pour des êtres issus d’une architecture céleste hiérarchisée. Les religions humaines qui leur doivent une partie de leur histoire ne leur obéissent pas nécessairement ; les lois publiques ne reconnaissent aucune autorité à leurs titres ; les individus qu’ils protègent peuvent refuser la protection proposée. C’est peut-être la conséquence la plus profonde du cadeau d’Elynea. Les premiers Anges étaient des outils. La Transcendance leur a donné une volonté propre. Des siècles plus tard, chaque Angelus doit encore déterminer ce que signifie servir un ordre supérieur lorsque cette volonté lui permet précisément de ne pas être d’accord avec lui."
        }
      ]
    },
    {
      "id": "des-etres-fabriques-avant-d-etre-celestes",
      "title": "Des êtres fabriqués avant d'être célestes",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Angelus ne sont pas des esprits éternels apparus spontanément au-dessus de l'Humanité. Leurs ancêtres furent des créatures artificielles d'Aèr, des golems primitifs transformés par la Transcendance jusqu'à devenir les êtres que les religions humaines reconnaîtraient plus tard comme angéliques. Cette origine reste perceptible dans leur rapport à la fonction, à la hiérarchie et à la forme : ils ont été conçus avant d'apprendre à être des personnes. Elynea elle-même appartient à l'histoire des dieux d'Aèr. Après la Guerre céleste, sa victoire et son ascension produisirent l'une des plus grandes réécritures religieuses de l'histoire humaine. Elle devint le Dieu unique des traditions monothéistes, tandis que les anciens dieux vaincus furent progressivement reclassés comme forces démoniaques. Cette histoire explique l'immense influence des Angelus sur les symboles religieux sans faire des Églises modernes leurs administrations terrestres. Des siècles de théologie, de politique et de vie humaine ont produit des institutions autonomes. Un Angelus peut être accueilli comme miracle, suspecté comme imposteur ou considéré comme une créature dont l'existence ne suffit pas à régler une question doctrinale."
        }
      ]
    },
    {
      "id": "incarnation-et-personne-mortelle",
      "title": "Incarnation et personne mortelle",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Comme chez les Daemons, l'incarnation dans un enfant crée une vraie vie. L'identité humaine n'est pas une façade déposée au moment de l'Éveil. Une personne peut grandir, aimer, travailler et construire des convictions qui ne correspondent pas parfaitement à ce qu'un Archange ou une ancienne fonction attend d'elle. Cette réalité rend l'Éveil angélique profondément intime. L'être découvre qu'il appartient à une architecture immense, qu'un Archange peut lui être lié et que sa propre âme possède une histoire qui dépasse son existence consciente. Il ne cesse pourtant pas d'être l'enfant devenu adulte qui a vécu jusque￾là. Le conflit entre devoir céleste et identité mortelle n'est donc pas un accident de parcours ; il est l'une des conséquences normales de l'incarnation. Certains Angelus embrassent leur fonction. D'autres la négocient. Les renégats rappellent que la hiérarchie céleste elle-même n'est pas une machine unanimement obéissante."
        }
      ]
    },
    {
      "id": "l-arbre-de-vie-comme-architecture-politique-et-spirituelle",
      "title": "L'Arbre de Vie comme architecture politique et spirituelle",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les dix Sephiroth ne sont pas seulement des catégories de pouvoirs. Elles organisent une vision du monde, des fonctions, des Archanges et des traditions de Transcendance. Trônes, Vertus et Dominations décrivent des Natures angéliques différentes ; les Séraphins et Maisonnées donnent à cette structure une profondeur politique supplémentaire. Un Archange lié n'est pas un compagnon que l'on remplace parce qu'un autre pouvoir paraît plus intéressant. Le lien est intrinsèque à l'histoire de l'Angelus. Les cas où plusieurs Sephiroth ou plusieurs autorités se superposent sont des anomalies de grande importance, pas une manière normale de progresser. Les Archanges renégats prouvent également que l'Arbre ne se réduit pas à une liste de postes parfaitement alignés sur la volonté d'Elynea. Création, Connaissance, Secrets, Pardon, Devoir, Charité, Sexualité, Grandeur, Vérité ou Destruction peuvent exister dans des relations conflictuelles avec l'ordre dominant."
        }
      ]
    },
    {
      "id": "les-angelus-et-les-religions-de-2035",
      "title": "Les Angelus et les religions de 2035",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La modernité leur impose un paradoxe. Jamais leurs symboles n'ont été aussi largement reproduits, et jamais le monde humain n'a été aussi capable de les filmer, de les analyser ou de les confronter à une institution théologique qui ne leur obéit pas automatiquement. Une Église peut posséder des Chasseurs, des exorcistes et des archives sur des manifestations célestes. Elle peut coopérer avec un Angelus dans une crise puis refuser de reconnaître son interprétation d'un texte religieux. Des croyants peuvent le considérer comme une preuve de foi ; d'autres comme une épreuve précisément destinée à tester leur discernement. L'Angelus de 2035 n'entre donc pas dans un monde qui attendait son retour. Il entre dans des sociétés qui ont construit pendant des siècles une religion à partir de traces de son histoire et qui ne sont pas prêtes à lui rendre l'autorité qu'il imagine parfois posséder."
        }
      ]
    },
    {
      "id": "l-arbre-de-vie-comme-architecture-de-fonctions",
      "title": "L'Arbre de Vie comme architecture de fonctions",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les dix Sephiroth ne décrivent pas seulement une hiérarchie décorative. Elles organisent une partie de la culture angelique autour de fonctions, de principes et d'Archanges qui servent de références à des êtres historiquement conçus pour accomplir quelque chose. Cette origine explique pourquoi le langage de la mission reste si puissant parmi eux. Être lié à un Archange ne signifie pas posséder un compagnon extérieur que l'on pourrait changer selon les circonstances. Le lien fait partie de la structure même de l'Angelus. Il influence la manière dont la Transcendance s'exprime, les devoirs que l'individu croit reconnaître et parfois les conflits intérieurs lorsque la mission héritée rencontre une vie moderne qui n'a rien prévu pour elle. Les Natures de Trône, Vertu et Domination ajoutent une autre couche à cette identité. Elles ne doivent pas être confondues avec un simple grade administratif : elles décrivent des manières différentes dont l'être angélique a été façonné et dont sa présence s'inscrit dans l'ordre céleste."
        }
      ]
    },
    {
      "id": "apres-la-victoire-le-probleme-de-l-autonomie",
      "title": "Après la victoire, le problème de l'autonomie",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "L'histoire officielle de la victoire d'Elynea pourrait laisser croire que les Angelus vivent dans un ordre parfaitement cohérent. Des millénaires d'existence ont produit l'inverse. Une créature capable de vivre parmi les Humains, de s'incarner, d'aimer et de connaître plusieurs civilisations développe inévitablement une lecture personnelle de ce que signifie servir. Certains restent extrêmement proches de l'interprétation la plus stricte de leur fonction. D'autres considèrent que la victoire céleste appartient à une époque dont les conséquences doivent aujourd'hui être assumées plutôt que répétées. La question des anciens dieux et des Daemons divise particulièrement : ennemi cosmologique pour les uns, adversaire historique pour les autres, personne individuelle qu'il faut juger sur ses actes pour quelques-uns. Cette diversité explique pourquoi rencontrer un Angelus ne permet pas de prévoir automatiquement son comportement. L'alignement avec Elynea n'efface ni la personnalité ni des siècles d'expérience."
        }
      ]
    },
    {
      "id": "les-religions-humaines-ne-sont-pas-leur-territoire",
      "title": "Les religions humaines ne sont pas leur territoire",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "L'un des malentendus les plus dangereux consiste à imaginer qu'un Angelus peut entrer dans une église et revendiquer l'obéissance de l'institution au nom de sa Nature. Pour un croyant humain, l'apparence angélique peut être un signe bouleversant ; pour une hiérarchie religieuse, elle peut tout autant être une tentation, une fraude, une créature inconnue ou une épreuve. Les religions ont développé leur théologie, leur droit, leurs autorités et leurs divisions sans demander quotidiennement des instructions à des êtres de Vérité. Un prêtre peut donc refuser un Angelus en toute sincérité religieuse. Une Église peut enquêter sur lui. Des Chasseurs issus d'un ordre religieux peuvent considérer qu'une apparition doit être vérifiée avant d'être crue. Cette indépendance est l'une des conséquences les plus ironiques de la victoire d'Elynea : les institutions nées de sa domination culturelle sont devenues suffisamment humaines pour ne plus être de simples prolongements de ses anciens serviteurs."
        }
      ]
    }
  ],
  "r1": [
    {
      "id": "concept-et-architecture",
      "title": "Concept et architecture",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Principe — Un Angelus est une créature artificielle d'Aèr devenue un individu par Transcendance. Les Anges primitifs étaient des êtres élémentaires proches du golem, liés à l'air et à l'eau et dépendants de leurs créateurs. Elynea a déposé en eux une parcelle de sa propre essence, leur donnant initiative, intelligence, affinité avec la lumière et une véritable continuité personnelle."
        },
        {
          "type": "p",
          "text": "Origine d'Elynea — Elynea est elle-même issue d'une conception divine particulière : elle a deux mères, la Déesse de la Lumière et la Déesse de la Vengeance, ainsi qu'un Éon de Gaerras, grand esprit lié à l'Invincibilité. Cette origine explique la coexistence, dans l'Arbre de Vie, de la lumière, de la protection, du jugement et d'une dureté parfois implacable. Elle reste d'abord un élément de lore, pas une mécanique générique."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Formule d'identité\nSon corps est une incarnation.\nSon âme est transcendée.\nSon Auréole est une connexion.\nIl est une racine de l'Arbre de Vie."
        },
        {
          "type": "table",
          "rows": [
            [
              "Couche",
              "Rôle"
            ],
            [
              "Nature angélique",
              "Comment l'Angelus agit : Trône, Vertu ou Domination."
            ],
            [
              "Sephira",
              "Quel principe de l'Arbre de Vie traverse sa Transcendance."
            ],
            [
              "Archange lié",
              "L'unique Archange auquel l'Angelus est lié et dont il reçoit le Don."
            ],
            [
              "Séraphin patron",
              "L'école personnelle ou la Maisonnée qui lui transmet une Faveur."
            ],
            [
              "Rang de Transcendance",
              "Angelus, Chérubin, exceptionnellement Séraphin."
            ]
          ]
        },
        {
          "type": "p",
          "text": "Lien archangélique unique — Un Angelus sert un seul Archange. Ce lien fait partie de sa Transcendance et n'est pas une affiliation que l'on collectionne. Changer d'Archange est un événement métaphysique et narratif exceptionnel, pas une option normale de progression."
        }
      ]
    },
    {
      "id": "reincarnation-eveil-et-revelation",
      "title": "Réincarnation, Éveil et Révélation",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Mode jouable — Pour les PJ, le mode normal est la Réincarnation : l'âme angélique est déposée dans un nourrisson, grandit dans une vraie vie mortelle puis s'éveille à sa nature. Apparition, Invocation, Émissaire ou autres manifestations restent des outils de lore, de PNJ ou de scénario."
        },
        {
          "type": "p",
          "text": "Éveil angélique — L'Éveil est distinct de la Révélation. Il s'agit du moment où l'incarnation comprend ou récupère sa nature angélique. Une fois éveillé, passer de V à SR ou R ne coupe pas les souvenirs."
        },
        {
          "type": "table",
          "rows": [
            [
              "État",
              "Expression"
            ],
            [
              "V — Voilé",
              "Incarnation physiquement humaine sous l'Hologramme. Les souvenirs restent présents, mais les pouvoirs angéliques ne sont pas utilisables sauf mention explicite."
            ],
            [
              "SR — Semi-Révélé",
              "La Transcendance affleure. Auréole, Yeux célestes et pouvoirs subtils deviennent accessibles. Un observateur V voit encore un humain."
            ],
            [
              "R — Révélé",
              "Forme angélique véritable : apparence transcendée, ailes d'énergie, lumière et traits propres au Sephira/Archange. Les pouvoirs physiques et ouvertement célestes sont normalement R."
            ]
          ]
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Transition — Sous pression, changer d'état suit la règle générale du Voile : 1 PA par transition, sans jet sauf opposition active. Un Angelus peut passer directement V vers R si rien ne l'en empêche."
        },
        {
          "type": "p",
          "text": "Continuité corporelle — Il n'existe qu'un seul historique de blessures et de PV. Une augmentation temporaire de Vigueur en R augmente le maximum de PV mais ne soigne jamais les PV actuels. Revenir à une forme de maximum inférieur plafonne les PV actuels à ce nouveau maximum ; se révéler à nouveau ne recrée aucun PV perdu."
        },
        {
          "type": "p",
          "text": "Règle d'état — Aucun pouvoir angélique n'est utilisable en V sauf s'il porte explicitement l'étiquette V. Les profils R d'un Sephira remplacent les profils SR ; ils ne s'additionnent jamais."
        }
      ]
    },
    {
      "id": "detachement-celeste",
      "title": "Détachement céleste",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Nature psychologique - Un Angelus possède des émotions, mais il les comprend moins intuitivement qu'un humain. Il peut aimer, souffrir, désirer ou haïr ; son rapport aux réactions affectives reste cependant plus froid, analytique et parfois étranger. Résistance émotionnelle - Passif - V/SR/R L'Angelus gagne +3 pour résister aux effets surnaturels reposant directement sur la peur, le désir, la honte, la colère, l'attachement, la séduction ou une autre manipulation affective. Ce bonus ne s'applique pas à une argumentation rationnelle, une menace factuelle, une autorité administrative ou une domination sans composante émotionnelle. Difficulté d'empathie - Passif - V/SR/R Lorsqu'un test demande de comprendre intuitivement une émotion complexe, ambiguë ou non exprimée, la difficulté augmente d'un niveau. Cela ne pénalise pas toutes les interactions sociales : négocier, mentir, commander ou comprendre une émotion clairement exprimée restent normaux."
        }
      ]
    },
    {
      "id": "aura-aureole-et-arbre-de-vie",
      "title": "Aura, Auréole et Arbre de Vie",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Aura — L'Aura est une concentration transcendée de lumière, d'air, d'eau et d'expérience circulant par l'Auréole. Elle est une réserve physiologique et métaphysique propre aux Angelus, pas un mana universel."
        },
        {
          "type": "table",
          "rows": [
            [
              "Rang",
              "Bonus de Transcendance",
              "Aura maximale"
            ],
            [
              "Angelus",
              "+0",
              "3 + Force Mentale, maximum 8"
            ],
            [
              "Chérubin",
              "+2",
              "3 + Force Mentale + 2, maximum 10"
            ],
            [
              "Séraphin exceptionnel",
              "+4",
              "3 + Force Mentale + 4, maximum 12"
            ]
          ]
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Valeur de Force Mentale — Seule la valeur permanente de la Compétence compte pour calculer l'Aura maximale. Un bonus temporaire de Force Mentale ne crée jamais d'Aura supplémentaire."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Réserve initiale — Hors pression, si rien n'empêche spirituellement la connexion, un Angelus peut prendre le temps nécessaire pour remplir complètement son Aura avant une scène importante."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Ouvrir l'Auréole — 1 PA — SR/R\nL'Angelus ouvre son portail spirituel vers le Paradis et récupère 2 Aura. Aucun jet en situation normale. Dans un Lieu sacré de l'Arbre, il récupère 3 Aura à la place. Les effets qui remplacent la quantité de recharge ne s'additionnent pas entre eux."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Interruption de connexion — Un pouvoir qui coupe explicitement une créature céleste de son plan, scelle les passages spirituels ou isole l'âme peut empêcher la recharge. Il ne vide pas l'Aura déjà stockée."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Pouvoirs à plusieurs PA — Le coût d'Aura est engagé et retiré dès le premier PA investi. Si l'action est interrompue et définitivement perdue, l'Aura l'est également."
        },
        {
          "type": "p",
          "text": "Lieu sacré — Un lieu sacré de l'Arbre est une zone fortement alimentée par des croyants, des marques d'Elynea, un Prophète ou la présence durable d'un Archange. Il ne se fabrique pas en quelques secondes par un acte symbolique opportuniste."
        }
      ]
    },
    {
      "id": "nature-commune-pouvoirs-angeliques",
      "title": "Nature commune — pouvoirs angéliques",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "style": "tech",
          "text": "Âme transcendée - Passif - V/SR/R À la destruction définitive de l'incarnation, l'âme de l'Angelus retourne vers le Paradis par l'Arbre de Vie. Cela n'est pas un respawn : la mort de l'incarnation met fin à la présence du personnage dans la situation. Une nouvelle incarnation relève d'un événement de campagne."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Yeux célestes - SR/R Activation : 1 PA sous pression et 1 Aura ; les Yeux restent actifs pour la scène. L'Angelus distingue les formes véritables derrière l'Hologramme, les illusions surnaturelles, les transformations occultes et les dissimulations fondées sur une altération surnaturelle de perception. Une dissimulation activement protégée peut demander Esprit + Perception contre sa résistance. Les Yeux ne révèlent jamais automatiquement Sang, Cour, Talents, PV, pensées ou nom véritable."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Yeux et Voile - Voir la Vérité d'une créature V ne matérialise pas son anatomie véritable. L'Angelus peut percevoir la forme vampirique ou monstrueuse superposée à l'humain, mais il ne peut pas viser une aile, une corne ou une griffe qui n'est pas physiquement présente. Les Yeux ne voient pas à travers les murs et ne remplacent pas Perception."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Ailes transcendées - R - 1 PA - 1 Aura L'Angelus déploie ses ailes d'énergie. Elles traversent normalement vêtements et armures et restent déployées pour la scène. Elles accordent +1 Agilité au total, quel que soit le nombre de paires. Elles ne permettent pas le vol stationnaire par défaut."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Initiative et Ailes - Le +1 Agilité ne recalcule jamais des PA d'Initiative déjà déterminés pour le combat en cours."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Impulsion céleste - R - 1 Aura Avec un Déplacement, l'Angelus dépense 1 Aura pour doubler la distance, franchir verticalement des obstacles importants, amortir une chute et ignorer la plupart des terrains difficiles ordinaires. Il doit terminer le mouvement sur un support valide."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Égide d'Aura - SR/R - Réaction Réaction contre une attaque visant directement l'âme, l'esprit, l'essence surnaturelle ou constituée principalement de puissance divine/spirituelle. Après le calcul des dégâts, dépenser 1 à 3 Aura ; chaque point réduit 2 dégâts. Ne fonctionne pas contre une balle, une chute ou du feu strictement ordinaire."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Canalisation des prières - Passif - SR/R L'Angelus est une racine de l'Arbre de Vie : sa présence transcendée canalise vers Elynea les prières et résonances associées à son Sephira. La mécanique principale est l'amélioration de recharge dans les Lieux sacrés ; elle ne donne pas de bonus automatique empilable aux Compétences."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Sens du Réseau - Passif - SR/R L'Angelus reconnaît instinctivement qu'il se trouve dans une zone fortement connectée à son Sephira. Un foyer suffisamment puissant à proximité peut donner une direction approximative, jamais des coordonnées précises."
        }
      ]
    },
    {
      "id": "talents-communs",
      "title": "Talents communs",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:nature-commune-pouvoirs-angeliques-talents-communs}}"
        }
      ]
    },
    {
      "id": "progression-de-transcendance",
      "title": "Progression de Transcendance",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Angelus Ailes: 1 paire • Natures: 1 Nature Aura: bonus +0, plafond 8 Chérubin Ailes: 2 paires • Natures: 2 Natures Aura: bonus +2, plafond 10 Séraphin Ailes: 3 paires • Natures: 3 Natures Aura: bonus +4, plafond 12 - exceptionnel",
          "style": "tech"
        },
        {
          "type": "p",
          "text": "{{Talents|group=angelus:progression-de-transcendance}}"
        },
        {
          "type": "p",
          "text": "Activation des Ailes - Un Chérubin paie toujours 1 Aura pour déployer toutes ses ailes et ne gagne que +1 Agilité au total. Le rang représente surtout une capacité supérieure à contenir et canaliser la Transcendance. Séraphin - Il n'existe pas de Talent standard permettant de devenir Séraphin. Le rang est normalement réservé aux PNJ ou à un accomplissement de fin de campagne décidé par le MJ/Elynea. S'il survient, il donne la troisième Nature, une troisième paire d'ailes et le bonus d'Aura correspondant. Devenir Séraphin ne crée pas automatiquement une Faveur personnelle transmissible à d'autres Angelus."
        }
      ]
    },
    {
      "id": "nature-trone",
      "title": "Nature : Trône",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Rôle - Le Trône est un juge, un chasseur et un enquétéur spirituel. Il trouve la cible, comprend ce qu'elle est, la marque et rend ses pouvoirs vulnerables. Télépathie céleste - Gratuit - SR/R - 1 PA - 1 Aura Communication mentale bidirectionnelle avec une cible consentante perçue, jusqu'à la fin de la scène. Le sens général traverse les langues sans transmettre toute la culture ni lire les pensées. Un seul interlocuteur télépathique actif à la fois ; ouvrir un nouveau lien ferme l'ancien."
        },
        {
          "type": "p",
          "text": "{{Talents|group=angelus:nature-trone}}"
        }
      ]
    },
    {
      "id": "nature-vertu",
      "title": "Nature : Vertu",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Rôle - La Vertu est une machine de conversion spirituelle : elle absorbe les pulsions et vices, apaise, soigne l'âme et peut réinjecter cette puissance sous la forme d'un Péché capital. Purification - Gratuit - SR/R - 1 PA Au contact ou très près, absorber peur, rage, honte, haine, désir incontrôlable, obsession ou autre impulsion intense. Émotion naturelle sur cible consentante : pas de jet, l'emprise immédiate disparaît sans effacer la personnalité. Effet surnaturel : Volonté + Maîtrise spirituelle contre la difficulté ou le résultat d'origine. La première et la seconde Purification réellement significatives de la scène peuvent chacune rendre 1 Aura ; au-delà, l'énergie repart vers l'Arbre sans recharge personnelle."
        },
        {
          "type": "p",
          "text": "{{Talents|group=angelus:nature-vertu}}"
        },
        {
          "type": "p",
          "text": "Péché Effet Colère +3 aux attaques physiques, +2 DGT, -3 Défense occulte. Orgueil +3 à la Compétence sociale contextuelle et aux résistances à l’intimidation ; impossible de bénéficier d’Assistance. Luxure +3 aux interactions fondées sur désir/charme et +3 pour lire le désir ; -3 contre distractions affectives. Envie Choisir une Compétence visible chez une cible : la traiter jusqu'à 2, sans jamais dépasser la valeur observée. Péché Effet Avarice +3 pour acquérir, conserver, protéger ou arracher un objet/ressource clairement désiré ; -3 pour l'abandonner volontairement. Gourmandise Première mise hors combat significative ou consommation d'une ressource importante : récupérer 3 PV ou 2 Aura si Angelus. Les 3 PV comptent pour la Saturation. Paresse Si le bénéficiaire ne se Déplace pas pendant son round : +3 Défense physique et occulte jusqu'au prochain round ; son Déplacement est divisé par deux.",
          "style": "tech"
        }
      ]
    },
    {
      "id": "nature-domination",
      "title": "Nature : Domination",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Rôle - La Domination est le combattant céleste, mais davantage sniper, prédateur et exécuteur que guerrier de ligne. Elle choisit une cible, crée sa fenêtre et termine le travail. Lame céleste - Gratuit - R - 1 PA Sacrifier 1 à 3 PV et dépenser 1 Aura pour matérialiser une arme divine liée à l'Angelus pour la scène : 1 PV = DGT 7, 2 PV = DGT 9, 3 PV = DGT 11. Les PV sacrifiés réduisent le maximum tant que l'arme existe et ne peuvent pas être soignés ; impossible de sacrifier sous 1 PV. Une seule Lame active. Forme de mêlée ou de tir ; aucune munition ordinaire nécessaire."
        },
        {
          "type": "p",
          "text": "{{Talents|group=angelus:nature-domination}}"
        }
      ]
    }
  ],
  "r2": [
    {
      "id": "les-dix-sephiroth",
      "title": "Les dix Sephiroth",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Kether porte domination, conscience et unité ; Hokhma sagesse, pureté et magie ; Bina compréhension, intellect et destin ; Hesed miséricorde, guérison et créativité ; Gueburah force, justice et guerre ; Tiph’Ereth foi, dévotion et sacrifice ; Nesah amour, succès et sexualité ; Hod savoir, science et grandeur ; Yessod rêves, illusion et imagination ; Malkhouth mort, monde physique et poids. Chaque Angelus est principalement transcendé au travers d’un de ces principes, qui colore la manière dont l’énergie céleste passe en lui."
        }
      ]
    },
    {
      "id": "les-dix-sephiroth",
      "title": "Les dix Sephiroth",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Règle générale - Chaque Angelus est transcendé sur un seul Sephira. Le Sephira détermine un profil d'Attributs SR/R, un Don fondamental gratuit et trois Facettes de progression. Le profil R remplace le SR."
        }
      ]
    },
    {
      "id": "kether-la-couronne",
      "title": "Kether — La Couronne",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Volonté, +1 Charisme R +2 Volonté, +1 Charisme Nœud de conscience - Don fondamental - SR/R - 1 PA - 1 Aura Relier jusqu'à trois participants consentants, Angelus compris, dans une même zone opérationnelle (environ 100 m). Pour la scène, chacun connaît la position approximative des autres, leur état général et les intentions volontairement partagées. Si un membre sort de portée, son lien est suspendu jusqu'à son retour."
        }
      ]
    },
    {
      "id": "facette-domination",
      "title": "Facette : Domination",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-kether-la-couronne-facette-domination}}"
        }
      ]
    },
    {
      "id": "facette-conscience",
      "title": "Facette : Conscience",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-kether-la-couronne-facette-conscience}}"
        }
      ]
    },
    {
      "id": "facette-unite",
      "title": "Facette : Unité",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-kether-la-couronne-facette-unite}}"
        }
      ]
    },
    {
      "id": "hokhma-la-sagesse",
      "title": "Hokhma — La Sagesse",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Esprit, +1 Volonté R +2 Esprit, +1 Volonté Essence pure - Don fondamental - Passif - SR/R +3 contre corruption surnaturelle, possession et altération hostile de l'âme. Ne protège pas contre la persuasion ordinaire."
        }
      ]
    },
    {
      "id": "facette-sagesse",
      "title": "Facette : Sagesse",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hokhma-la-sagesse-facette-sagesse}}"
        }
      ]
    },
    {
      "id": "facette-purete",
      "title": "Facette : Pureté",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hokhma-la-sagesse-facette-purete}}"
        }
      ]
    },
    {
      "id": "facette-magie",
      "title": "Facette : Magie",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hokhma-la-sagesse-facette-magie}}"
        }
      ]
    },
    {
      "id": "bina-la-comprehension",
      "title": "Bina — La Compréhension",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Esprit, +1 Volonté R +2 Esprit, +1 Volonté Schéma causal - Don fondamental - SR/R - 1 PA - 1 Aura Après avoir examiné une situation concrète, demander : 'Quel est ici le facteur limitant le plus évident ?' Le MJ révèle un facteur qu'un observateur exceptionnel pourrait raisonnablement déduire, jamais un secret invisible par miracle."
        }
      ]
    },
    {
      "id": "facette-intellect",
      "title": "Facette : Intellect",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-bina-la-comprehension-facette-intellect}}"
        }
      ]
    },
    {
      "id": "facette-destin",
      "title": "Facette : Destin",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-bina-la-comprehension-facette-destin}}"
        }
      ]
    },
    {
      "id": "facette-limitations",
      "title": "Facette : Limitations",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-bina-la-comprehension-facette-limitations}}"
        }
      ]
    },
    {
      "id": "hesed-la-misericorde",
      "title": "Hesed — La Miséricorde",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Volonté, +1 Charisme R +1 Volonté, +2 Charisme Main misericordieuse - Don fondamental - SR/R - 1 PA - 1 Aura Au contact : stabiliser automatiquement une cible, supprimer une douleur incapacitante simple jusqu'à la fin du prochain round, ou lui rendre 1 PV. Le soin de PV compte pour la Saturation de l'Arbre."
        }
      ]
    },
    {
      "id": "facette-misericorde",
      "title": "Facette : Miséricorde",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hesed-la-misericorde-facette-misericorde}}"
        }
      ]
    },
    {
      "id": "facette-guerison",
      "title": "Facette : Guérison",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hesed-la-misericorde-facette-guerison}}"
        }
      ]
    },
    {
      "id": "facette-creativite",
      "title": "Facette : Créativité",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hesed-la-misericorde-facette-creativite}}"
        }
      ]
    },
    {
      "id": "gueburah-la-force",
      "title": "Gueburah — La Force",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Vigueur, +1 Volonté R +2 Vigueur, +1 Volonté Impact de Gueburah - Don fondamental - R Une fois par round, après une attaque physique réussie : dépenser 1 Aura pour choisir +2 DGT ou un renversement/une projection significative. Pas les deux."
        }
      ]
    },
    {
      "id": "facette-force",
      "title": "Facette : Force",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-gueburah-la-force-facette-force}}"
        }
      ]
    },
    {
      "id": "facette-justice",
      "title": "Facette : Justice",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-gueburah-la-force-facette-justice}}"
        }
      ]
    },
    {
      "id": "facette-guerre",
      "title": "Facette : Guerre",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-gueburah-la-force-facette-guerre}}"
        }
      ]
    },
    {
      "id": "tiph-ereth-la-beaute",
      "title": "Tiph'Ereth — La Beauté",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Charisme, +1 Volonté R +2 Charisme, +1 Volonté Dévotion céleste - Don fondamental - Passif - V/SR/R Choisir une personne, communauté, cause ou principe auquel le personnage est sincèrement dévoué. +3 pour résister aux effets qui cherchent directement à le contraindre à trahir ou abandonner cette dévotion. Changer de dévotion demande une vraie évolution narrative."
        }
      ]
    },
    {
      "id": "facette-foi",
      "title": "Facette : Foi",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-tiph-ereth-la-beaute-facette-foi}}"
        }
      ]
    },
    {
      "id": "facette-devotion",
      "title": "Facette : Dévotion",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-tiph-ereth-la-beaute-facette-devotion}}"
        }
      ]
    },
    {
      "id": "facette-sacrifice",
      "title": "Facette : Sacrifice",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-tiph-ereth-la-beaute-facette-sacrifice}}"
        }
      ]
    },
    {
      "id": "nesah-la-victoire",
      "title": "Nesah — Là Victoire",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Charisme, +1 Agilité R +2 Charisme, +1 Agilité Élan du succès - Don fondamental - SR/R - 1/Scène Après avoir échoue à un test de 2 points ou moins, dépenser 1 Aura pour transformer le résultat en réussite simple DR 0. Jamais sur Échec narratif ; compte comme modification surnaturelle du résultat."
        }
      ]
    },
    {
      "id": "facette-succes",
      "title": "Facette : Succès",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-nesah-la-victoire-facette-succes}}"
        }
      ]
    },
    {
      "id": "facette-amour",
      "title": "Facette : Amour",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-nesah-la-victoire-facette-amour}}"
        }
      ]
    },
    {
      "id": "facette-sexualite",
      "title": "Facette : Sexualité",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-nesah-la-victoire-facette-sexualite}}"
        }
      ]
    },
    {
      "id": "hod-la-gloire",
      "title": "Hod — La Gloire",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Esprit, +1 Charisme R +2 Esprit, +1 Charisme Illumination - Don fondamental - SR/R - 1 PA - 1 Aura Une fois par scène, sur un test intellectuel, scientifique ou technique dans lequel l'Angelus possède au moins 1 point de Compétence : +3. Aucun téléchargement de Compétence inexistante."
        }
      ]
    },
    {
      "id": "facette-gloire",
      "title": "Facette : Gloire",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hod-la-gloire-facette-gloire}}"
        }
      ]
    },
    {
      "id": "facette-science",
      "title": "Facette : Science",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hod-la-gloire-facette-science}}"
        }
      ]
    },
    {
      "id": "facette-savoir",
      "title": "Facette : Savoir",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-hod-la-gloire-facette-savoir}}"
        }
      ]
    },
    {
      "id": "yessod-la-fondation",
      "title": "Yessod — La Fondation",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Esprit, +1 Charisme R +2 Esprit, +1 Charisme Image pensée - Don fondamental - SR/R - 1 PA - 1 Aura Créer une illusion visuelle et/ou sonore simple, statique ou repetitive, dans un volume d'environ 2 m. Elle dure la scène ou jusqu'à dissipation."
        }
      ]
    },
    {
      "id": "facette-reves",
      "title": "Facette : Rêves",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-yessod-la-fondation-facette-reves}}"
        }
      ]
    },
    {
      "id": "facette-illusion",
      "title": "Facette : Illusion",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-yessod-la-fondation-facette-illusion}}"
        }
      ]
    },
    {
      "id": "facette-imagination",
      "title": "Facette : Imagination",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-yessod-la-fondation-facette-imagination}}"
        }
      ]
    },
    {
      "id": "malkhouth-le-royaume",
      "title": "Malkhouth — Le Royaume",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Empreinte SR +1 Vigueur, +1 Volonté R +2 Vigueur, +1 Volonté Ancrage du Royaume - Don fondamental - SR/R - Réaction - 1 Aura +3 contre déplacement surnaturel forcé, téléportation hostile, bannissement ou déphasage imposé."
        }
      ]
    },
    {
      "id": "facette-mort",
      "title": "Facette : Mort",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-malkhouth-le-royaume-facette-mort}}"
        }
      ]
    },
    {
      "id": "facette-monde-physique",
      "title": "Facette : Monde physique",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-malkhouth-le-royaume-facette-monde-physique}}"
        }
      ]
    },
    {
      "id": "facette-poids",
      "title": "Facette : Poids",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=angelus:les-dix-sephiroth-malkhouth-le-royaume-facette-poids}}"
        }
      ]
    },
    {
      "id": "archanges-en-fonction-dons-archangeliques",
      "title": "Archanges en fonction — Dons archangéliques",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Principe — Le Sephira fournit l'arbre principal ; l'Archange lié fournit un seul Don gratuit, très caractéristique. Un Angelus ne collectionne pas les Archanges. Les Dons actifs coûtent généralement 2 Aura, sauf mention contraire."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Remiel - Essence des Cieux - Kether - SR/R À la création, choisir une Expression : Vent, Eau ou Foudre. Hors enjeu, produire/manipuler l'élément à petite échelle. Sous pression : Volonté + Maîtrise spirituelle. Une fois par round, 2 Aura permettent une manifestation : attaque physique DGT 6, poussée/déplacement significatif ou manipulation environnementale cohérente. Ce n'est pas une Affinité Mage."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Gabrielle - Parole céleste - Hokhma - SR/R - 1 PA - 2 Aura Pour une prise de parole réellement destinée à convaincre, expliquer, exhorter, négocier ou imposer une conclusion par l'argumentation : +3 au test social. Le sens général est compris même sans langue commune parfaite, sans traduction technique mot à mot et sans contrainte mentale."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Barachiel - Bénédiction - Bina - SR/R - 1 PA - 2 Aura Bénir une autre créature perçue. Jusqu'à la fin de son prochain round, elle bénéficie d'une Assistance céleste +2 sur le premier test de son choix. Fonctionne même si l'Angelus ne possède pas la Compétence et peut fonctionner en combat. Ne cible jamais l'utilisateur."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Raphael - Restauration parfaite - Hesed - Passif - SR/R +3 contre maladies, poisons et altérations physiques internes. Une fois par scène, lorsqu'un pouvoir surnaturel du personnage rend effectivement au moins 1 PV, retirer simultanement une conséquence physique secondaire cohérente : fièvre, douleur, nausée, intoxication, fatigue pathologique, saignement, infection ou trouble temporaire. Ne fait pas repousser un membre pour 1 PV."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Michel - Rien à craindre - Gueburah - SR/R - Réaction - 2 Aura - 1/Scène Lorsqu'un effet de peur, terreur ou intimidation surnaturelle devrait imposer Tendu/Paniqué, forcer la fuite, empêcher d'avancer ou faire perdre une action, l'Angelus peut l'ignorer intégralement pour la scène. Une incapacité physique demeure ; une manifestation directement archangélique ou d'Elynea peut explicitement contourner cet effet si le lore le justifie."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Zophielle - Regard de Splendeur - Tiph'Ereth - SR/R - 1 PA - 2 Aura La cible doit voir le visage ou le regard. Charisme + Compétence sociale contextuelle contre Défense occulte. Réussite : Captivée pour la scène : +3 aux interactions sociales de l'Angelus envers elle et test Volonté + Force Mentale 15 pour lui porter délibérément un coup de grâce. Une fois pendant l'effet, une demande simple et raisonnablement réalisable doit être accomplie ou la cible tente une nouvelle Défense occulte pour briser définitivement la Captivation."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Azazel - Frontière céleste - Nesah - R - 1 PA - 2 Aura Créer une barrière plane de lumière jusqu'à environ 3 m x 3 m à 15 m : Protection 6, 6 PV, dure la scène. Une seule active. Elle doit apparaître dans un espace libre ; jamais à travers une créature ni dans un objet plein. Peut servir de mur, bouclier, plafond/plancher bref ou fermeture."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Urielle - Lumière de la Phénix - Hod - SR/R En R, feu et chaleur ordinaires ne peuvent à eux seuls réduire l'Angelus sous 1 PV ; les feux divins/surnaturels majeurs tuent normalement. Pour 2 Aura, manipuler lumière et chaleur lumineuse à petite échelle pour la scène : éclairer, aveugler brièvement, distordre une image, enflammer un combustible ; attaque directe physique DGT 6 pour 1 PA."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Camaelle - Éclair de colère - Yessod - SR/R - Réaction - 3 Aura - 1/Scène L'Angelus obtient immédiatement 1 PA supplémentaire à dépenser avant la fin du round. Il peut servir à une action normale. Une seule activation par scène ; aucun effet ne peut utiliser ce PA pour déclencher une nouvelle capacité donnant elle-même des PA supplémentaires."
        },
        {
          "type": "p",
          "style": "tech",
          "text": "Azrael - Blessure de l'âme - Malkhouth - SR/R - Réaction - 1/round Lorsqu'une attaque de l'Angelus réussit et inflige des dégâts à une cible dotée d'une âme/essence blessable, dépenser 2 Aura pour ignorer jusqu'à 3 points d'Armure ou de Protection applicable. Aucun DGT supplémentaire. Égide d'Aura fonctionne encore normalement si elle est applicable."
        }
      ]
    },
    {
      "id": "seraphins-patrons-maisonnees-actives",
      "title": "Séraphins patrons — Maisonnées actives",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Règle - Un Angelus a un seul Séraphin patron principal et une seule Faveur séraphique active. Changer de patron est un changement réel d'école/maisonnée : l'ancienne Faveur devient dormante. La Faveur ne doit pas reproduire simplement le Don archangélique ou un Talent du Sephira avec un meilleur chiffre."
        }
      ]
    },
    {
      "id": "remiel-purim-jugement-dernier",
      "title": "Remiel — Purim, Jugement dernier",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Faute accumulée - SR/R - 1/Scène Lorsqu'une cible perçue commet volontairement un acte grave contre une autre personne dans la scène, la marquer Fautive. La prochaine fois qu'elle échoue à une Défense occulte contre cet Angelus, elle devient aussi Tendue jusqu'à la fin de son prochain round. La faute doit être réelle dans la fiction."
        }
      ]
    },
    {
      "id": "remiel-ochotiel-pesanteur",
      "title": "Remiel — Ochotiel, Pesanteur",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Poids intérieur - SR/R - 1/Scène Après qu'une cible échoue à une Défense occulte contre un pouvoir de l'Angelus, son Déplacement est divisé par deux et elle ne peut utiliser bond, vol ou déplacement surnaturel jusqu'à la fin de son prochain round."
        }
      ]
    },
    {
      "id": "gabrielle-belohim-volonte",
      "title": "Gabrielle — Belohim, Volonté",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Jusqu'au bout - SR/R - 1/Scène Au début d'une action, déclarer que le personnage l'accomplira. Jusqu'à sa résolution, douleur, Tendu/Paniqué, peur, intimidation et distraction émotionnelle ne peuvent faire perdre cette action ni imposer de malus. Les blessures et incapacités physiques réelles demeurent."
        }
      ]
    },
    {
      "id": "gabrielle-arathim-loi",
      "title": "Gabrielle — Arathim, Loi",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Qualification céleste - SR/R Après avoir assisté à une action, déterminer si elle a réellement violé une règle, un serment, un contrat ou une loi précise connue du personnage. Une fois par scène, lorsqu'il agit immédiatement pour faire respecter cette règle, il peut ignorer une complication sociale/juridique secondaire qui l'empêcherait simplement d'intervenir. Ne détecte pas le Bien ou le Mal."
        }
      ]
    },
    {
      "id": "barachiel-assim-planification",
      "title": "Barachiel — Assim, Planification",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Contingence - SR/R - 1/Scène Lors d'une préparation réelle, définir un événement plausible et une réponse simple préparée. Si l'événement survient, la personne désignée peut immédiatement effectuer un demi-déplacement en Réaction ou une manipulation simple préparée. Une seule Contingence active."
        }
      ]
    },
    {
      "id": "barachiel-razael-sagesse",
      "title": "Barachiel — Razael, Sagesse",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Le moindre mal - SR/R - 1/Scénario Face à plusieurs solutions réellement comprises, demander laquelle entraînera vraisemblablement le moins de souffrance/pertes pour l'ensemble des personnes concernées. Le MJ répond avec les informations raisonnablement accessibles à la résonance de Razael. Pas de prescience absolue."
        }
      ]
    },
    {
      "id": "raphael-hazel-sel-larmes",
      "title": "Raphael — Hazel, Sel/Larmes",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les choses vont mal - SR/R - 1/Scène Une cible proche qui vient de subir une vraie déception, perte ou souffrance émotionnelle résonne avec Hazel. La prochaine fois qu'elle réussit un test avant la fin de son prochain round, elle relance son d10e et conserve le second résultat. Compte comme modification surnaturelle hostile du jet."
        }
      ]
    },
    {
      "id": "raphael-sobronielle-creativite",
      "title": "Raphael — Sobronielle, Créativité",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Détour creatif - SR/R - 1/Scène Pour resoudre un problème, proposer une Compétence différente de celle normalement attendue en expliquant une approche réellement créative et credible. Le MJ valide la pertinence. La Faveur ne permet pas de remplacer arbitrairement n'importe quelle Compétence."
        }
      ]
    },
    {
      "id": "michel-esdrael-sang",
      "title": "Michel — Esdrael, Sang",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Sang révélé - SR/R Lorsqu'une créature vivante perd des PV et verse du sang à portée de perception, mémoriser sa signature sanguine pour la scène. Une seule signature : reconnaître automatiquement ce sang, suivre une trace réelle sans test ordinaire, distinguer une fausse piste. Une fois par scène, si le sang reste accessible, savoir si la cible est encore à proximité immédiate. Pas de vision à travers les murs."
        }
      ]
    },
    {
      "id": "michel-graphiel-epee-de-dieu",
      "title": "Michel — Graphiel, Épée de Dieu",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Arme sacrée - R Pour 1 Aura, une arme réelle tenue devient divine pour la scène, ne peut être brisée par une force ordinaire et peut réapparaître dans la main pour 1 Aura si elle est simplement désarmée et reste dans la scène. Aucun bonus de DGT ; ce n'est pas une Lame céleste."
        }
      ]
    },
    {
      "id": "zophielle-georah-passion",
      "title": "Zophielle — Georah, Passion",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Feu intérieur - SR/R - 1/Scène Une créature consentante exprime une passion, un désir ou un objectif auquel elle tient réellement. Une fois dans la scène, lorsqu'un effet de peur, découragement, douleur ou manipulation émotionnelle devrait directement l'empêcher de poursuivre cet objectif, elle peut l'ignorer jusqu'à la fin de son action en cours."
        }
      ]
    },
    {
      "id": "zophielle-thirielle-charme",
      "title": "Zophielle — Thirielle, Charme",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Seconde impression - SR/R - 1/Scène Lorsqu'un test social de l'Angelus échoue sans Échec narratif, l'attitude de la cible ne peut pas se dégrader à cause de cet échec et elle accepte une seconde tentative si la fiction le permet. Le second jet est normal."
        }
      ]
    },
    {
      "id": "azazel-nehemiel-haine",
      "title": "Azazel — Nehemiel, Haine",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Amour retourné - SR/R - Réaction - 2 Aura - 1/Scène Lorsqu'un effet surnaturel reposant explicitement sur désir, charme, amour, attachement ou séduction cible l'Angelus et qu'il réussit sa Défense occulte, il peut retourner une version cohérente de l'effet contre son auteur. L'auteur compare sa Défense au résultat initial. Un effet non réversible ne peut pas être renvoyé."
        }
      ]
    },
    {
      "id": "azazel-hassiel-defense",
      "title": "Azazel — Hassiel, Défense",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Rien ne passe - SR/R - Réaction - 2 Aura - 1/Scène Lorsqu'un effet directement ciblé provenant d'une source visible est arrêté par la Défense de l'Angelus, protéger également une seconde cible adjacente qui aurait subi le même effet. Ne fonctionne pas contre une explosion environnementale, un gaz de zone ou un effondrement."
        }
      ]
    },
    {
      "id": "urielle-danael-flammes",
      "title": "Urielle — Danael, Flammes",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Feu repris - R - Réaction - 1/Scène Lorsqu'un feu réel, ordinaire ou surnaturel mais pas divin supérieur, devrait infliger des dégâts à l'Angelus ou une cible adjacente, réduire les dégâts finaux de 3 et récupérer 1 Aura si au moins 1 dégât a réellement été annulé."
        }
      ]
    },
    {
      "id": "urielle-agriel-lumiere-celeste",
      "title": "Urielle — Agriel, Lumière céleste",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Reflet fugitif - R - Réaction - 1 Aura - 1/round Après avoir réussi une Défense active physique contre une attaque nécessitant de localiser précisément le corps, se déplacer immédiatement de 2 m vers un emplacement valide. Ce n'est pas une téléportation."
        }
      ]
    },
    {
      "id": "camaelle-jachim-orage",
      "title": "Camaelle — Jachim, Orage",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Onde de tonnerre - R - 1 Aura - 1/round Lorsqu'il utilise Impulsion céleste ou Éclair de colère, accompagner le mouvement d'une détonation. À la fin du mouvement, une créature à 2 m peut être repoussée de plusieurs mètres si elle échoue à une Défense physique appropriée. Aucun dégât."
        }
      ]
    },
    {
      "id": "camaelle-sabbathiel-colere",
      "title": "Camaelle — Sabbathiel, Colère",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Corps de rage - R - 1/Scène Au début du round, entrer en rage jusqu'au début du suivant : Armure 3 contre dégâts physiques et surnaturels directs, +2 DGT aux attaques physiques ; à la fin, subir 2 PV irréductibles. Aucune action demandant calme, délicatesse ou patience pendant la rage."
        }
      ]
    },
    {
      "id": "azrael-barabbiel-ames",
      "title": "Azrael — Barabbiel, Âmes",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Écho des vaincus - SR/R - 1/Scénario Lorsqu'une créature dotée d'une âme meurt dans la scène après avoir été directement affrontée par l'Angelus, conserver un Écho spirituel jusqu'à la fin du scénario. Un seul Écho. Plus tard, 1 PA + 1 Aura : poser une question sur un savoir réel de la victime, lui faire reconnaître un élément ou manifester brièvement sa silhouette. Ce n'est pas l'âme complète."
        }
      ]
    },
    {
      "id": "azrael-pithormim-cle-des-enfers",
      "title": "Azrael — Pithormim, Clé des Enfers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Sens des seuils - SR/R Ressentir automatiquement un portail dimensionnel actif, une fissure, un passage vers Paradis/Enfer/Ombremonde ou un sceau qui en retient un à proximité. Une fois par scène, au contact d'un tel seuil, +3 à une tentative destinée spécifiquement à le fermer, stabiliser, maintenir ou empêcher son ouverture."
        }
      ]
    },
    {
      "id": "archanges-renegats",
      "title": "Archanges renégats",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Statut - Renégat ne signifie pas automatiquement traître. Elynea avait plus de candidats que de places dans les dix Sephiroth : certains Archanges ont été jugés moins efficaces, incohérents, politiquement dangereux ou trop indépendants ; d'autres ont effectivement dépassé les bornes. Ils restent des composants marqués par Elynea et peuvent servir de réserve si un Gardien disparaît. Lien des serviteurs - Un Angelus lié à un Archange renégat reste lié à cet Archange unique. Il ne gagne pas le Don du Gardien actuel. Le Sephira actuellement ouvert par le Gardien correspondant peut seulement servir de relais pour faire circuler à nouveau le Don du Renégat. Il ne s'agit pas de servir deux Archanges. Les cas à plusieurs Sephiroth sont des exceptions de PNJ/scénario, pas une progression normale."
        }
      ]
    },
    {
      "id": "metatron-creation",
      "title": "Metatron — Création",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Forge céleste - Kether - SR/R - 1 PA - 2 Aura Créer un objet solide simple de lumière transcendée dont l'Angelus comprend réellement forme et fonction : outil, chaîne, récipient, barre, bouclier matériel, pièce mécanique simple, clé connue. Objet manipulable par une personne, dure la scène. Pas d'électronique fonctionnelle, artefact, mécanisme inconnu ni objet magique."
        }
      ]
    },
    {
      "id": "manakielle-connaissance",
      "title": "Manakielle — Connaissance",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Connexion de connaissance - Hokhma - SR/R - 1 PA - 2 Aura Choisir une cible perçue. Si elle résiste : Volonté + Maîtrise spirituelle contre Défense occulte. Poser une question factuelle précise sur quelque chose qu'elle sait réellement ; sur réussite, obtenir la réponse correspondant à son savoir conscient. Une question = un fait discret, jamais un téléchargement complet."
        }
      ]
    },
    {
      "id": "razielle-secrets",
      "title": "Razielle — Secrets",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "La ou se cache le secret - Bina - SR/R - 1 PA - 2 Aura Examiner personne, lieu, objet ou ensemble de documents et chercher ce qui est intentionnellement dissimulé. Sur cible résistante : Esprit + Perception contre Défense occulte. Réussite : le MJ révèle la nature du secret important le plus pertinent et une voie permettant potentiellement de l'atteindre, pas le secret complet. Une seule utilisation réussie par scène sur la même cible/lieu/objet."
        }
      ]
    },
    {
      "id": "tsadqiel-pardon",
      "title": "Tsadqiel — Pardon",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Pardon accordé - Hesed - SR/R - 1 PA - 2 Aura - 1/Scène par cible Une cible qui regrette sincèrement un acte ou est accablée par lui peut recevoir le Pardon : supprimer Tendu/Paniqué provenant du remords/culpabilité, ou tenter de briser un effet surnaturel fondé explicitement sur culpabilité, vengeance, rétribution ou condamnation de cet acte. Volonté + Maîtrise spirituelle contre la puissance si opposé. N'efface pas le passé ni la responsabilité juridique."
        }
      ]
    },
    {
      "id": "selaphielle-devoir",
      "title": "Selaphielle — Devoir",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Relève - Gueburah - SR/R - Réaction, 1 PA - 2 Aura - 1/Scène Au début d'une scène, définir un devoir concret : protéger X, tenir un accès, livrer un objet, ramener quelqu'un vivant. Lorsqu'un allié proche échoue à une action indispensable à ce devoir, l'Angelus peut faire jusqu'à un demi-déplacement et tenter la même tâche avec ses propres caractéristiques si la fiction le permet. Ce n'est pas une relance du jet de l'allié."
        }
      ]
    },
    {
      "id": "sachielle-charite",
      "title": "Sachielle — Charité",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Charité céleste - Tiph'Ereth - SR/R - 2 PA - 3 Aura - 1/Scène Choisir un Talent actif de 1 PTV que l'Angelus possède parmi ses Talents de Nature ou de Sephira et le confier à une cible consentante au contact. Elle peut l'utiliser une seule fois avant la fin de la scène. Le coût d'Aura de cette utilisation est déjà payé par Sachielle, mais le coût en PA, sacrifice de PV et fréquence restent. Impossible de transmettre Nature, Don archangélique, Faveur séraphique, Talent 2/3 PTV, Talent dépendant d'un prérequis absent ou Charité céleste elle-même. L'état V/SR/R du Talent doit être respecté."
        }
      ]
    },
    {
      "id": "hanaelle-sexualite",
      "title": "Hanaelle — Sexualité",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Intimité souveraine - Nesah - SR/R Lors d'une interaction sexuelle ou romantique directe, percevoir si le consentement immédiat d'une personne est réel, absent ou surnaturellement altéré. Ne révèle ni fantasmes ni orientation. Une fois par scène : 1 PA + 2 Aura au contact pour opposer Volonté + Maîtrise spirituelle à un effet qui contraint directement désir, attirance ou comportement sexuel/romantique ; victoire = effet brisé sur cette cible."
        }
      ]
    },
    {
      "id": "sandalphon-grandeur",
      "title": "Sandalphon — Grandeur",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Grandeur déployée - Hod - SR/R - 1/Scène Lorsqu'un pouvoir non directement dommageable est activé, 2 Aura permettent une fois par scène de doubler soit la portée, soit le rayon/zone, soit le nombre maximal de cibles d'un effet résolu directement. Ne modifie jamais DGT, DR, Protection, difficulté, durée, ressources, PV rendus, Aura transférée, Talents prêtés ou pouvoirs copiés."
        }
      ]
    },
    {
      "id": "mebahel-verite",
      "title": "Mebahel — Vérité",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Parole vraie - Yessod - SR/R - 1 PA - 2 Aura Choisir une cible capable de parler. Volonté + Maîtrise spirituelle contre Défense occulte. Jusqu'à la fin de son prochain round, elle ne peut volontairement prononcer une affirmation qu'elle sait fausse. Elle peut se taire, éluder, refuser de répondre ou se tromper sincèrement. L'Angelus ne peut lui-même volontairement mentir tant que l'effet est maintenu."
        }
      ]
    },
    {
      "id": "muriel-destruction",
      "title": "Muriel — Destruction",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Rupture nourricière - Malkhouth - R - Passif - 1/Scène Lorsque l'Angelus provoque directement la mort réelle d'une créature incarnée possédant une âme et que cette mort sépare effectivement âme et corps, récupérer 3 Aura. Une fois par scène, et seulement si la mort est une conséquence significative du conflit/situation ; exécuter une victime préparée, un animal captif ou un figurant sans défense uniquement pour recharger ne fonctionne pas."
        }
      ]
    },
    {
      "id": "seraphins-des-archanges-renegats",
      "title": "Séraphins des Archanges renégats",
      "level": 2,
      "blocks": []
    },
    {
      "id": "metatron-aralim-construction",
      "title": "Metatron — Aralim, Construction",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Plan incarné - R - 2 Aura - 1/Scène Après avoir réellement étudié le plan d'une structure, matérialiser pour la scène une portion fonctionnelle simple jusqu'à environ 3 m : mur, escalier, plateforme, passerelle, support, porte. Pas de machine entière ni d'électronique."
        }
      ]
    },
    {
      "id": "manakielle-siloelle-energie",
      "title": "Manakielle — Siloelle, Énergie",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Réserve vive - SR/R - 1/Scène Lorsque l'Angelus commence son round à 0 Aura, récupérer immédiatement 2 Aura, sans PA et sans dépasser le maximum."
        }
      ]
    },
    {
      "id": "razielle-jessim-mystique",
      "title": "Razielle — Jessim, Mystique",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Incertitude - SR/R - Réaction - 2 Aura - 1/Scène Après la réussite d'un pouvoir surnaturel visible utilisant 1d10e, forcer son utilisateur à relancer uniquement son d10e et conserver le second résultat. Toutes les autres composantes restent identiques. Compte comme la modification surnaturelle hostile du jet."
        }
      ]
    },
    {
      "id": "tsadqiel-rubiel-purete",
      "title": "Tsadqiel — Rubiel, Pureté",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Légèreté de l'innocent - SR/R - 1 Aura - 1/Scène Une cible consentante qui n'est ni Tendue ni Paniquée devient exceptionnellement légère jusqu'au début de son prochain round : Déplacement x2, ignore terrain difficile ordinaire et pénalités ordinaires de poids/fatigue/encombrement, amortit une chute raisonnable. Si elle est ravagée par une culpabilité réelle et consciente, l'effet ne fonctionne pas."
        }
      ]
    },
    {
      "id": "selaphielle-bethel-metal",
      "title": "Selaphielle — Bethel, Métal",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Métal docile - R - 1 PA - 1 Aura Au contact d'un métal non vivant, le rendre momentanément malléable comme une argile très dense pendant environ une minute : plier, refermer une fissure, remodeler une plaque, coincer une serrure, changer sommairement une pièce. Le métal garde ensuite sa nouvelle forme. Un objet porté/tenu par un adversaire demande une opposition appropriée."
        }
      ]
    },
    {
      "id": "sachielle-chiloel-resignation",
      "title": "Sachielle — Chiloel, Résignation",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "À quoi bon ? - SR/R - Réaction - 2 Aura - 1/Scène Lorsqu'une cible visible échoue à un test important, Volonté + Maîtrise spirituelle contre Défense occulte. Réussite : jusqu'à la fin de son prochain round, elle ne peut volontairement retenter exactement le même objectif. Si elle était dans une action à plusieurs PA, les PA déjà investis sont perdus. Elle peut faire autre chose."
        }
      ]
    },
    {
      "id": "hanaelle-phanaelle-prudence",
      "title": "Hanaelle — Phanaelle, Prudence",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Pas cette fois - SR/R - Réaction - 1 Aura - 1/Scène Lorsqu'une action hostile est déclarée directement contre l'Angelus, avant le jet, se déplacer immédiatement de 2 m vers une position valide et raisonnablement accessible. L'action est ensuite résolue depuis la nouvelle situation ; si la cible n'est plus valide, l'attaquant peut choisir une autre cible valide ou perdre l'action."
        }
      ]
    },
    {
      "id": "sandalphon-pergamin-perseverance",
      "title": "Sandalphon — Pergamin, Persévérance",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Continue - SR/R - Réaction - 1 Aura - 1/Scène Lorsqu'une action en cours d'un allié visible est interrompue par dégâts, déplacement forcé, perte de concentration, échec d'un test de maintien ou autre interruption extérieure, les PA/progrès déjà investis ne sont pas perdus. L'allié peut reprendre l'action dès qu'il en est capable. Ne transforme pas un échec final en réussite."
        }
      ]
    },
    {
      "id": "mebahel-henael-avertissement",
      "title": "Mebahel — Henael, Avertissement",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Je t'avais prévenu - SR/R - Réaction - 2 Aura - 1/Scène Lorsqu'un allié visible est sur le point de déclencher un danger immédiat qu'il n'a pas identifié (piège, embuscade, catastrophe mécanique, attaque cachée...), la clairvoyance permet de l'avertir avant résolution. Il n'est pas considéré Surpris et peut interrompre/modifier son action si c'est physiquement possible. Le danger complet n'est pas nécessairement révélé."
        }
      ]
    },
    {
      "id": "muriel-osael-colere",
      "title": "Muriel — Osael, Colère",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ne me tourne pas le dos - R - Réaction - 1 Aura - 1/Scène Lorsqu'une cible visible inflige effectivement des dégâts à l'Angelus, elle devient l'Objet de sa Colère jusqu'à la fin de la scène. Une fois par round, si elle effectue un Déplacement destiné à s'éloigner de lui, l'Angelus peut immédiatement se déplacer de 2 m dans sa direction, sans PA. Pas de téléportation ni d'attaque gratuite."
        }
      ]
    }
  ]
};
const article=(id:string,category:"Vérité"|"Règles",title:string,tags:string[],sections:unknown):Article=>({id,dataset:"verite-v7",category,sourceCategory:category,title,source:SOURCE,status:"canon_enrichi",rebuildV2:true,tags,sections:sections as Section[]});
export const COMPENDIUM_VERITE_V7_ANGELUS_ARTICLES:Article[]=[
article("verite-v7-angelus-elynea-arbre-vie","Vérité","Angelus — Elynea & l’Arbre de Vie",["Vérité","Angelus","Elynea","Arbre de Vie","Sephiroth","Archanges","Séraphins"],SOURCE_PAYLOAD.lore),
article("regles-verite-v7-angelus-nature-revelation-transcendance","Règles","Nature angélique, Révélation & Transcendance",["Vérité","Angelus","Aura","Auréole","Transcendance","Trône","Vertu","Domination"],SOURCE_PAYLOAD.r1),
article("regles-verite-v7-angelus-sephiroth-archanges-seraphins","Règles","Sephiroth, Archanges & Séraphins",["Vérité","Angelus","Sephiroth","Archanges","Séraphins","Faveurs"],SOURCE_PAYLOAD.r2)
];
export const COMPENDIUM_VERITE_V7_ANGELUS_NAVIGATION=[
{id:"verite-v7-angelus-elynea-arbre-vie",dataset:"verite-v7",category:"Vérité",group:"Peuples & Natures",groupOrder:30,subgroup:"Angelus",subgroupOrder:40,pageOrder:10,displayTitle:"Angelus — Elynea & l’Arbre de Vie"},
{id:"regles-verite-v7-angelus-nature-revelation-transcendance",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Angelus",subgroupOrder:60,pageOrder:10,displayTitle:"Nature angélique, Révélation & Transcendance"},
{id:"regles-verite-v7-angelus-sephiroth-archanges-seraphins",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Angelus",subgroupOrder:60,pageOrder:20,displayTitle:"Sephiroth, Archanges & Séraphins"}
];