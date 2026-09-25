// Generated from the final V1 Builder runtime audit. Do not hand-edit.
export const truthRuntimeStructure = {
  "ptvInitial": 5,
  "consciousness": [
    {
      "id": "profane",
      "name": "Profane"
    },
    {
      "id": "initie",
      "name": "Initié"
    }
  ],
  "natures": {
    "humain": {
      "id": "humain",
      "name": "Humain / Chasseur",
      "description": "L’Humanité n’est pas extérieure à la Vérité. Un Humain peut rester totalement Profane, devenir Initié, rejoindre la Chasse, apprendre une tradition occulte ou martiale et utiliser des technologies qui dépassent la Réalité ordinaire. Il ne possède pas d’arbre racial : ce qu’il acquiert vient de sa formation, de ses alliances et de ce qu’il a réellement découvert.",
      "choices": [
        {
          "key": "hunterTradition",
          "label": "Voie / tradition de Chasse",
          "optional": true,
          "options": [
            {
              "id": "aucune",
              "name": "Aucune / profane",
              "description": "Aucune tradition de Chasse : le personnage ne suit pas de doctrine structurée et conserve ses PTV tant qu’il reste Profane."
            },
            {
              "id": "doctrine_commune",
              "name": "Doctrine commune de Chasse",
              "description": "Le socle partagé des vrais Chasseurs : identifier avant de frapper, conserver la poursuite et exploiter une faiblesse réellement comprise."
            },
            {
              "id": "catholique",
              "name": "Chasseurs catholiques",
              "description": "Trois ordres secrets partagent une liturgie de terrain : Arianwen pour la traque, Ephraïm pour l’exorcisme et Magdalena pour le jugement et le scellement."
            },
            {
              "id": "khalsa",
              "name": "Khālsā",
              "description": "Une tradition de guerriers Chasseurs fondée sur le serment, la protection d’autrui et le refus des emprises surnaturelles."
            },
            {
              "id": "taoiste",
              "name": "Taoïstes",
              "description": "Les Gu et Shimazu recherchent l’équilibre du Yin et du Yang ; les secrets Shi travaillent au contraire avec un contact méthodique au Néant."
            },
            {
              "id": "kabbale",
              "name": "Kabbale",
              "description": "Des initiés exploitent les dix Sephiroth comme principes occultes sans devenir pour autant des Angelus."
            },
            {
              "id": "nizarite",
              "name": "Nizarites / Asāsīyūn",
              "description": "Les Nizarites associent les Arts du Djinn à une doctrine de Chasse fondée sur la marque, la poursuite et l’ancrage de la proie."
            },
            {
              "id": "onmyoji",
              "name": "Onmyoji",
              "description": "Des Chasseurs shinto spécialisés dans les Shikigami, les sceaux, les noms et les pactes spirituels."
            },
            {
              "id": "neopaien",
              "name": "Néopaïens",
              "description": "Des pratiques modernes et syncrétiques autour des morts, de la terre, des seuils, des présages et des serments."
            },
            {
              "id": "lueurs_azmenor",
              "name": "Lueurs d’Azménor",
              "description": "Une petite tradition issue d’un héritage azménorien : ses visions viennent réellement du Néant, mais leur interprétation peut être erronée."
            },
            {
              "id": "xenoshield",
              "name": "Xenoshield",
              "description": "Une organisation experte en xénobiologie hostile, confinement et contre-technologie, mais profondément biaisée contre les Extrals — et infiltrée par certains d’entre eux."
            },
            {
              "id": "independant",
              "name": "Chasseur indépendant",
              "description": "Des Chasseurs sans uniforme ni doctrine unique, souvent construits autour d’un traumatisme, d’un secret familial ou d’une proie particulière."
            },
            {
              "id": "table_ronde",
              "name": "Table Ronde",
              "description": "Les descendants des chevaliers choisis par Merlin perpétuent des lignées de Chasse et des armes uniques qui restent des objets de fiction, jamais des achats PTV."
            }
          ]
        }
      ],
      "baseFreeTraits": [],
      "freeTraitRules": []
    },
    "vampire": {
      "id": "vampire",
      "name": "Vampire",
      "description": "Descendant de l’héritage Khinae corrompu par les Fléaux, le Vampire est un prédateur surnaturel vivant plutôt qu’un cadavre animé. Les Sang-purs existent mais restent rares ; la majorité des Vampires de 2035 sont des Transformés, parfois très jeunes malgré l’existence d’anciens ayant perdu des décennies ou des siècles en torpeur. Cour d’origine, Maison, Sang noir et fidélités sont des axes distincts, tandis que la mort véritable condamne l’âme vampirique au Néant.",
      "choices": [
        {
          "key": "court",
          "label": "Cour d’origine",
          "optional": false,
          "options": [
            {
              "id": "krovni_rytsari",
              "name": "Krovni Rytsari",
              "description": "Grande tradition occidentale de la noblesse vampirique, la Krovni organise le pouvoir autour du rang, du serment, du commandement et de la guerre. Ses structures féodales se sont adaptées aux holdings, sociétés de sécurité, réseaux politiques ou criminels modernes : l’honneur y est réel, mais l’intrigue et la stratégie à très long terme le sont tout autant."
            },
            {
              "id": "alghul_almalakiu",
              "name": "Alghul Almalakiu",
              "description": "Issue des premières civilisations mésopotamiennes, l’Alghul considère l’ancienneté comme une accumulation irremplaçable de savoirs, de langues, de rites et de souvenirs. Sa culture de conservation s’étend aux morts, au sang, aux restes et désormais aux archives numériques : détruire un ancien peut équivaloir à brûler une bibliothèque unique."
            },
            {
              "id": "oru_ayeraye",
              "name": "Oru Ayeraye",
              "description": "L’Oru réunit l’héritage de plusieurs anciennes Cours africaines marquées par les guerres de lignées, les puissances d’ombre et les alliances avec des Deimons. La maîtrise des Ténèbres et la relation aux créatures liées aux Maisons y comptent souvent autant que le lignage lui-même, selon des rapports allant du partenariat à l’exploitation réciproque."
            },
            {
              "id": "ihuito_meztzi",
              "name": "Ihuito Meztzi",
              "description": "L’Ihuito a prospéré dans les Amériques sous l’ombre de Quetzalcoatl. Le sang y est à la fois nourriture, héritage, puissance et continuité sacrée ; la Cour assume frontalement la prédation et conserve une histoire où religion, autorité et condition vampirique se sont longtemps confondues."
            },
            {
              "id": "shi_hun_zhe",
              "name": "Shi Hun Zhe",
              "description": "Le Shi Hun Zhe rassemble d’anciennes lignées d’Extrême-Orient autour de l’œuvre de Xinya et d’une lecture du Vampire comme être fondamentalement déséquilibré entre Yin, Yang, Hun et Po. Sa culture a conservé une architecture administrative quasi impériale — ministères, justice, finances, diplomatie, sécurité — adaptée au monde de 2035."
            }
          ]
        },
        {
          "key": "blood",
          "label": "Sang noir",
          "optional": false,
          "options": [
            {
              "id": "sang_ecarlate",
              "name": "Sang Écarlate — Anya",
              "description": "Sang d’Anya centré sur la force, la vitesse et la perception hématique. Il transforme la lecture du sang en avantage de chasse puis permet au Vampire de pousser brutalement son corps au-delà de son régime ordinaire."
            },
            {
              "id": "sang_primal",
              "name": "Sang Primal — Lyssa",
              "description": "Sang de Lyssa consacré à la métamorphose animale et à la dissolution en brume. Il permet d’adopter des formes naturelles puis de traiter le corps vampirique comme une matière plus fluide, capable d’échapper aux contraintes physiques ordinaires."
            },
            {
              "id": "sang_hypocrite",
              "name": "Sang Hypocrite — Briaerus",
              "description": "Sang de Briaerus fondé sur le mensonge visuel, les doubles et l’illusion. Sa progression va de leurres locaux à des mises en scène multisensorielles capables de fausser toute une situation sans créer de matière réelle."
            },
            {
              "id": "sang_venimeux",
              "name": "Sang Venimeux — Huitzitia",
              "description": "Sang d’Huitzitia mêlant perception thermique et production de toxines biologiques. Le Vampire apprend à façonner ses propres fluides en venins spécialisés puis à contaminer son environnement proche."
            },
            {
              "id": "sang_masque",
              "name": "Sang Masqué — Kazuo",
              "description": "Sang de Kazuo dédié à l’infiltration et à l’imitation. Presque entièrement utilisable en Semi-Révélation, il copie visage, voix et morphologie sans transmettre les souvenirs, compétences ou secrets de la personne imitée."
            },
            {
              "id": "sang_aveugle",
              "name": "Sang Aveugle — Ashream",
              "description": "Sang d’Ashream tourné vers les perceptions non visuelles et le plan astral. Écholocation et vision astrale élargissent d’abord les sens, avant de permettre au Vampire de projeter sa conscience hors d’un corps laissé vulnérable."
            },
            {
              "id": "sang_traqueur",
              "name": "Sang Traqueur — Go’Ndai",
              "description": "Sang de Go’Ndai centré sur l’analyse anatomique et la manipulation hématique. Il lit le corps comme un réseau vivant, repère ses défaillances puis apprend à transformer le sang en outil, membre ou arme surnaturelle."
            },
            {
              "id": "sang_glacial",
              "name": "Sang Glacial — Vjärmod",
              "description": "Sang de Vjärmod fondé sur le drain de chaleur et le gel surnaturel. Sa puissance commence au contact puis s’étend jusqu’à transformer une zone entière en environnement hostile par le froid."
            },
            {
              "id": "sang_ardent",
              "name": "Sang Ardent — Larisha",
              "description": "Sang de Larisha consacré à la chaleur, la brûlure et l’embrasement. Il peut marquer une cible au contact, enflammer la matière réellement combustible et finir par saturer l’environnement de chaleur surnaturelle."
            },
            {
              "id": "sang_orageux",
              "name": "Sang Orageux — Branimir",
              "description": "Sang de Branimir fondé sur l’électricité biologique et la conduction. Il surcharge d’abord les nerfs au contact, puis transforme l’espace proche en milieu conducteur où ses décharges peuvent se propager."
            },
            {
              "id": "sang_revelateur",
              "name": "Sang Révélateur — Zhi Xia",
              "description": "Sang de Zhi Xia consacré à la pensée, au dévoilement et à la destruction des mensonges surnaturels. Il lit d’abord l’esprit et les impressions présentes, puis confronte illusions, transformations ou pouvoirs actifs à une Vérité plus difficile à falsifier."
            },
            {
              "id": "sang_condamne",
              "name": "Sang Condamné — Ashelia",
              "description": "Sang d’Ashelia lié à la dévoration magique et au remplacement du corps. Sa faim peut absorber vitalité ou manifestations surnaturelles et conduit, à son extrême, à l’abandon d’une enveloppe condamnée pour une autre — au prix de conséquences monstrueuses."
            }
          ]
        },
        {
          "key": "hunterTradition",
          "label": "Tradition de Chasse",
          "optional": true,
          "options": [
            {
              "id": "aucune",
              "name": "Aucune / profane",
              "description": "Aucune tradition de Chasse : le personnage ne suit pas de doctrine structurée et conserve ses PTV tant qu’il reste Profane."
            },
            {
              "id": "lavandiere",
              "name": "Lavandière (Vampire)",
              "description": "Vampires indépendants spécialisés dans la chasse des Vampires dangereux, des Moroï et des Strygoï ; leur tradition se greffe sur une progression vampirique normale."
            }
          ]
        }
      ],
      "baseFreeTraits": [
        {
          "name": "Âme condamnée",
          "access": "—",
          "effect": "À la mort véritable, l’âme vampirique ne rejoint pas le Cycle : elle finit dans le Néant."
        },
        {
          "name": "Petite immortalité",
          "access": "R",
          "effect": "Le véritable corps ne vieillit pas tant que sa Nature est régulièrement Révélée."
        },
        {
          "name": "Physiologie maudite",
          "access": "R",
          "effect": "+3 Constitution contre les maladies ordinaires ; peut ralentir ou interrompre ses fonctions vitales."
        },
        {
          "name": "Sens prédateurs",
          "access": "SR",
          "effect": "Vision claire dans l’obscurité naturelle et perception fine du sang frais."
        },
        {
          "name": "Prédation sanguine",
          "access": "R · 1 PA",
          "effect": "Prédation par Pugilat ; une réussite peut rendre des PV selon le DR et la vitalité réellement prélevée."
        },
        {
          "name": "Effacement prédateur",
          "access": "R",
          "effect": "Peut tenter de se dissimuler dans des ombres suffisantes."
        },
        {
          "name": "Fascination vampirique",
          "access": "SR · 1 PA",
          "effect": "Charisme + Diplomatie contre Volonté + Force Mentale pour imposer l’attention."
        },
        {
          "name": "Stase",
          "access": "R · 2 PA",
          "effect": "Le Vampire devient inerte ; la dégradation naturelle et les hémorragies s’interrompent."
        },
        {
          "name": "Malédiction vampirique",
          "access": "R",
          "effect": "La Révélation expose la corruption à ses contre-forces, notamment le Soleil Ennemi."
        }
      ],
      "freeTraitRules": [
        {
          "when": {
            "court": "krovni_rytsari"
          },
          "traits": [
            {
              "name": "Prédateur de guerre",
              "access": "R",
              "effect": "Tant qu’il n’est pas Surpris, le Vampire gagne +3 à sa Défense passive et active contre les attaques physiques.",
              "source": "Empreinte gratuite de Cour"
            }
          ]
        },
        {
          "when": {
            "court": "alghul_almalakiu"
          },
          "traits": [
            {
              "name": "Écho des Morts",
              "access": "R",
              "effect": "En touchant un cadavre ou une quantité significative de sang, le Vampire perçoit des traces utiles laissées par la mort : cause probable, violence, émotion finale, présence marquante, etc.",
              "source": "Empreinte gratuite de Cour"
            }
          ]
        },
        {
          "when": {
            "court": "oru_ayeraye"
          },
          "traits": [
            {
              "name": "Enfant des Ténèbres",
              "access": "R · 1 PA",
              "effect": "Dans une zone suffisamment obscure, le Vampire fait un avec l’ombre. Tant que l’effet s’applique, il n’est pas vu et ne peut être directement ciblé ; ce n’est pas un Couvert matériel et aucun capteur profane ne le contourne.",
              "source": "Empreinte gratuite de Cour"
            }
          ]
        },
        {
          "when": {
            "court": "ihuito_meztzi"
          },
          "traits": [
            {
              "name": "Cycle du Sang",
              "access": "R",
              "effect": "Une fois par scène, après une Prédation sanguine réussie, le prochain Talent de Sang utilisé avant la fin du round coûte 1 PA de moins, minimum 0.",
              "source": "Empreinte gratuite de Cour"
            }
          ]
        },
        {
          "when": {
            "court": "shi_hun_zhe"
          },
          "traits": [
            {
              "name": "Équilibre dérobé",
              "access": "R",
              "effect": "Après s’être nourri, une fois par scène, le Vampire peut consumer le Hun/Yang absorbé pour obtenir une résistance contre une faiblesse ou un effet surnaturel auquel sa Nature ne lui permettrait normalement pas de résister.",
              "source": "Empreinte gratuite de Cour"
            }
          ]
        }
      ]
    },
    "garou": {
      "id": "garou",
      "name": "Garou",
      "description": "Le Garou est un descendant lupin de Khinae resté lié au Cycle des âmes. Sa Nature vient d’un lignage ancien, jamais d’une morsure, et peut dormir plusieurs générations avant de s’éveiller. L’Appel de la Meute, les sens, la régénération et la Mue structurent sa vie ; le Pelage est une tradition culturelle, tandis que le Sang vif exprime une potentialité plus profonde de l’héritage Khinae.",
      "choices": [
        {
          "key": "pelage",
          "label": "Pelage",
          "optional": false,
          "options": [
            {
              "id": "pelages_gris",
              "name": "Pelages Gris",
              "description": "Culture historiquement occidentale plaçant la protection directe de la Meute au centre de l’identité garoue. Protéger peut signifier s’interposer, organiser la défense ou détruire la menace avant qu’elle n’atteigne les siens ; cette responsabilité produit aussi bien des gardiens altruistes que des lignées très autoritaires."
            },
            {
              "id": "pelages_noirs",
              "name": "Pelages Noirs",
              "description": "Tradition territoriale issue de nombreuses lignées natives de l’Ouest américain. Le lieu, les trajets, les frontières et la chasse collective forment un réseau vivant pour la Meute ; les Noirs excellent à défendre une zone, mais leurs conflits de territoire peuvent devenir particulièrement violents."
            },
            {
              "id": "pelages_blancs",
              "name": "Pelages Blancs",
              "description": "Héritage septentrional ayant fait de la discipline martiale, de la mémoire et de la coordination une véritable culture. Une Meute Blanche fonctionne volontiers comme une unité entraînée à agir ensemble depuis des années, avec toute l’efficacité — et tous les dangers — d’une organisation qui valorise l’obéissance."
            },
            {
              "id": "pelages_roux",
              "name": "Pelages Roux",
              "description": "Tradition historiquement liée à des lignées de l’Est américain et à une maîtrise extrêmement fine de la Mue. Pour les Roux, se transformer n’est pas seulement devenir hybride : c’est employer exactement la part de Nature nécessaire, comme un langage corporel et un outil d’adaptation."
            },
            {
              "id": "pelages_bruns",
              "name": "Pelages Bruns",
              "description": "Tradition apparue en Extrême-Orient, plus proche des esprits, des Kami et de certaines puissances locales. Son idéal n’est pas d’étouffer la Bête mais de comprendre suffisamment l’instinct pour négocier avec lui ; pacte, respect du lieu et maîtrise intérieure comptent autant que la force brute."
            },
            {
              "id": "pelages_dores",
              "name": "Pelages Dorés",
              "description": "Tradition née entre Moyen-Orient et Asie, souvent la plus inquiétante aux yeux des autres Garous. Les Dorés conservent des méthodes de dévoration occulte permettant d’acquérir Traces, souvenirs ou propriétés surnaturelles, brouillant volontairement la frontière entre transmission, prédation et tabou."
            }
          ]
        },
        {
          "key": "blood",
          "label": "Sang vif",
          "optional": true,
          "options": [
            {
              "id": "sang_naturel",
              "name": "Sang Naturel — Vortigern",
              "description": "Sang vif de Vortigern lié aux éléments et à l’accord primordial. Il exprime une relation instinctive à des forces naturelles que le Khinae apprend progressivement à canaliser plutôt qu’à simplement subir."
            },
            {
              "id": "sang_alpha",
              "name": "Sang Alpha — Ohtana",
              "description": "Sang d’Ohtana consacré à la dominance et à la cohésion. Chez un Loup il s’exprime naturellement autour de la Meute ; chez un autre descendant de Khinae, il suit la logique sociale propre à sa Lignée plutôt que d’inventer artificiellement une hiérarchie lupine."
            },
            {
              "id": "sang_revelateur",
              "name": "Sang Révélateur — Ceallachán",
              "description": "Sang de Ceallachán lié à la pensée et à la destruction des mensonges surnaturels. Il pousse l’héritage Khinae vers la lecture de ce qui se cache derrière l’apparence et la confrontation directe aux tromperies occultes."
            },
            {
              "id": "sang_ecarlate",
              "name": "Sang Écarlate — Keyna",
              "description": "Sang de Keyna centré sur la puissance physique et la perception du sang. Il fait du corps et de la chasse hématique une même spécialisation, plus brutale que la plupart des Sangs de perception."
            },
            {
              "id": "sang_sculpteur",
              "name": "Sang Sculpteur — Svenn",
              "description": "Sang de Svenn consacré au modelage de matière et de chair. Il traite le corps et certaines structures physiques comme des formes susceptibles d’être altérées par un héritage Khinae particulièrement plastique."
            },
            {
              "id": "sang_funeste",
              "name": "Sang Funeste — Verica",
              "description": "Sang de Verica lié à la mort, aux spectres et à la violence immatérielle. Il rapproche le prédateur du monde des morts sans faire de lui un nécromancien universel."
            },
            {
              "id": "sang_primal",
              "name": "Sang Primal — Khuyildar",
              "description": "Sang de Khuyildar fondé sur l’assimilation animale et la brume. Il explore la plasticité prédatrice de Khinae en ajoutant d’autres propriétés animales et des expressions corporelles plus fluides."
            },
            {
              "id": "sang_chasseur",
              "name": "Sang Chasseur — Thorkel",
              "description": "Sang de Thorkel consacré à la traque absolue et à la disparition. Il pousse l’instinct de poursuite jusqu’à faire du porteur un prédateur spécialisé dans la conservation du contact et l’effacement de sa propre présence."
            },
            {
              "id": "sang_de_sagesse",
              "name": "Sang de Sagesse — Tomoko",
              "description": "Sang de Tomoko centré sur la mémoire et l’assimilation des savoirs. Sa prédation s’exprime moins par la force que par la capacité à conserver, incorporer et réutiliser ce qui a été appris."
            },
            {
              "id": "sang_enrage",
              "name": "Sang Enragé — Asulf",
              "description": "Sang d’Asulf consacré à la Frénésie volontaire. Il permet de traiter la rage prédatrice non comme un accident subi, mais comme un état dangereux que le porteur apprend à ouvrir, orienter puis refermer."
            },
            {
              "id": "sang_enchaine",
              "name": "Sang Enchaîné — Jayanti",
              "description": "Sang de Jayanti qui remplace la forme hybride par un véritable corps de guerre humain révélé. Il conserve mains, armes et précision technique tout en développant une puissance surhumaine, mais interdit la Mue hybride selon les règles du Sang."
            },
            {
              "id": "sang_vengeur",
              "name": "Sang Vengeur — Astaphium",
              "description": "Sang d’Astaphium lié aux plaies, à la douleur et à la violence de la Mue. Il transforme les blessures et la souffrance du corps en vecteurs de riposte plutôt qu’en simple coût à encaisser."
            }
          ]
        }
      ],
      "baseFreeTraits": [
        {
          "name": "Âme du Cycle",
          "access": "—",
          "effect": "À sa mort véritable, le Garou rejoint normalement le Cycle des âmes."
        },
        {
          "name": "Appel de la Meute",
          "access": "—",
          "effect": "Le Garou est profondément grégaire ; sa Meute peut inclure des proches de toute Nature."
        },
        {
          "name": "Hiérarchie instinctive",
          "access": "SR",
          "effect": "Ressent dominance et danger sans que cette perception force l’obéissance."
        },
        {
          "name": "Sens éveillés",
          "access": "SR",
          "effect": "Odorat et ouïe fournissent des informations inaccessibles à un humain ordinaire."
        },
        {
          "name": "Bravoure lupine",
          "access": "SR",
          "effect": "+3 pour résister à la peur ou à l’intimidation surnaturelle."
        },
        {
          "name": "Régénération lente",
          "access": "R",
          "effect": "Sous forme humaine révélée ou animale : récupération surnaturelle hors combat."
        }
      ],
      "freeTraitRules": [
        {
          "when": {
            "pelage": "pelages_gris"
          },
          "traits": [
            {
              "name": "Gardien de la Meute",
              "access": "R · Réaction 1 PA",
              "effect": "Lorsqu’un allié situé à moins d’un Déplacement est ciblé par une attaque physique et que l’interposition est possible, le Gris peut immédiatement se déplacer jusqu’à lui et devenir la cible de l’attaque.",
              "source": "Tradition gratuite de Pelage"
            }
          ]
        },
        {
          "when": {
            "pelage": "pelages_noirs"
          },
          "traits": [
            {
              "name": "Territoire de la Meute",
              "access": "R",
              "effect": "Après avoir parcouru et instinctivement marqué un site cohérent, le Garou le considère comme son territoire jusqu’à ce qu’il en choisisse un autre. Une créature vivante qui s’y introduit ne peut pas le Surprendre sans vaincre son instinct dans une opposition appropriée.",
              "source": "Tradition gratuite de Pelage"
            }
          ]
        },
        {
          "when": {
            "pelage": "pelages_blancs"
          },
          "traits": [
            {
              "name": "Discipline de Fenrir",
              "access": "R",
              "effect": "À la fin d’un round, le Garou peut conserver 1 PA inutilisé jusqu’au début de son round suivant. Ce PA ne peut servir qu’à une Réaction : Défense active, déplacement d’urgence ou Talent explicitement utilisable en Réaction.",
              "source": "Tradition gratuite de Pelage"
            }
          ]
        },
        {
          "when": {
            "pelage": "pelages_roux"
          },
          "traits": [
            {
              "name": "Mue partielle",
              "access": "R · 1 PA",
              "effect": "Sous forme humaine révélée, le Roux manifeste jusqu’à la fin du round une propriété morphologique de sa forme animale ou hybride. La Mue partielle ne donne jamais l’Armure corporelle 2, le +1 PA ou la régénération de combat complète de l’hybride.",
              "source": "Tradition gratuite de Pelage"
            }
          ]
        },
        {
          "when": {
            "pelage": "pelages_bruns"
          },
          "traits": [
            {
              "name": "Accord des Kami",
              "access": "SR",
              "effect": "Le Garou perçoit les esprits/Keltas suffisamment présents et peut tenter de communiquer avec eux. Une fois par scène, dans un lieu spirituellement marqué, il peut obtenir une impression simple : danger, violence passée, perturbation surnaturelle, émotion dominante…",
              "source": "Tradition gratuite de Pelage"
            }
          ]
        },
        {
          "when": {
            "pelage": "pelages_dores"
          },
          "traits": [
            {
              "name": "Trace dévorée",
              "access": "R",
              "effect": "Après avoir mangé une quantité significative de chair ou un organe d’une créature surnaturelle récemment morte, le Garou conserve jusqu’à son prochain repos une seule Trace de sa nature. Une nouvelle Trace remplace l’ancienne ; elle ne copie jamais un sort complet, une mémoire, une Compétence ou un pouvoir unique.",
              "source": "Tradition gratuite de Pelage"
            }
          ]
        },
        {
          "when": {
            "blood": "sang_enchaine"
          },
          "traits": [
            {
              "name": "Corps Enchaîné",
              "access": "R",
              "effect": "+2 Vigueur, +2 Agilité, +1 PA par round et Déplacement environ ×2. Le Garou conserve mains, armes, armures, véhicules, augmentations et toutes les possibilités d’un corps humain. En contrepartie : pas d’Armure corporelle 2, pas de DGT 5 gratuit, pas de régénération de combat 2 PV/round et aucune Mue hybride.",
              "source": "Règle native du Sang vif"
            }
          ]
        }
      ]
    },
    "khinae": {
      "id": "khinae",
      "name": "Descendant de Khinae",
      "description": "Les descendants non lupins de Khinae regroupent des lignées prédatrices très différentes : canidés errants, renards, félins, rapaces, requins, serpents, Boudas, Berserkirs ou crocodiliens. Leur héritage rejoint normalement le Cycle et autorise transformation, régénération et forme hybride, mais les instincts proprement lupins — Meute, Hiérarchie et Pelages — ne sont pas universels. Chaque Lignée conserve donc sa propre morphologie et sa propre logique sociale.",
      "choices": [
        {
          "key": "lineage",
          "label": "Lignée",
          "optional": false,
          "options": [
            {
              "id": "canides_errants",
              "name": "Canidés errants",
              "description": "Coyotes, chacals, lycaons, dholes et dingos sont les descendants de Khinae ayant connu le plus de succès après les Loups. Sans société comparable aux Pelages, ils ont construit leur survie autour de la poursuite, de l’endurance et de la capacité à vivre sans territoire stable."
            },
            {
              "id": "renards",
              "name": "Renards",
              "description": "Les Renards Khinae libres sont rares : beaucoup de leurs anciennes lignées ont cédé à V’Aagor. Leur ruse surnaturelle n’est pas une illusion universelle ; elle agit surtout sur les traces laissées derrière eux — odeurs, sons, pistes et fausses directions."
            },
            {
              "id": "grands_felins",
              "name": "Grands félins",
              "description": "Tigres, Lions, Panthères, Jaguars et Pumas comptent parmi les Khinae les plus redoutables individuellement et les moins enclins à bâtir de grandes sociétés. Leur Nature privilégie embuscade, bond, discrétion et domination physique d’une proie isolée."
            },
            {
              "id": "chats",
              "name": "Chats",
              "description": "Les petits Félins ont survécu moins par puissance brute que par curiosité, diplomatie et capacité à vivre au voisinage d’êtres beaucoup plus dangereux. Un Chat peut devenir intermédiaire entre monstres sans jamais accepter d’être le familier ou le serviteur de qui que ce soit."
            },
            {
              "id": "rapaces",
              "name": "Rapaces",
              "description": "Aigles, Faucons, Hiboux et Vautours sont des Khinae construits autour des hauteurs, de la perception et du mouvement aérien. Leur forme animale ouvre une géographie inaccessible aux lignées terrestres, mais leur corps et leur équipement restent soumis aux limites réelles de leur morphologie."
            },
            {
              "id": "requins",
              "name": "Requins",
              "description": "Les Requins sont des prédateurs Khinae marins dont la vie sociale et la chasse s’organisent autour de littoraux, ports, profondeurs et installations aquatiques. Vitesse, pression, sang et électroréception remplacent les repères territoriaux d’un prédateur terrestre."
            },
            {
              "id": "serpents",
              "name": "Serpents",
              "description": "Les Serpents regroupent lignées venimeuses, constrictrices et furtives. Leur variante morphologique détermine l’arme biologique principale et leur rapport à l’attente, à la chaleur et à l’économie de mouvement diffère profondément de celui des mammifères Khinae."
            },
            {
              "id": "boudas",
              "name": "Boudas",
              "description": "Les Boudas sont des Hommes-Hyènes sociaux, organisés autour de Bandes plutôt que de Meutes lupines. Leur cohésion est réelle mais suit ses propres codes, et leurs lignées combinent robustesse, charognage et agressivité collective sans acquérir gratuitement les traditions de Pelage."
            },
            {
              "id": "berserkirs",
              "name": "Berserkirs",
              "description": "Les Berserkirs sont des Hommes-Ours massifs issus d’anciennes lignées autrefois proches des Ulfhednars. Leur héritage privilégie masse, endurance et puissance immédiate ; la forme animale choisie nuance ensuite froid, nage, grimpe ou gabarit."
            },
            {
              "id": "crocodiliens",
              "name": "Crocodiliens",
              "description": "Les Crocodiliens sont une branche lourde de Khinae spécialisée dans l’embuscade aquatique et la patience prédatrice. Armure naturelle, puissance de saisie et adaptation au milieu dominent leur Nature, avec des variantes allant du grand crocodile au caïman plus compact."
            }
          ]
        },
        {
          "key": "variant",
          "label": "Variante morphologique",
          "optional": false,
          "dependsOn": "lineage",
          "options": [],
          "optionsBy": {
            "canides_errants": [
              {
                "id": "coyote",
                "name": "Coyote",
                "description": "Gabarit compact ; milieux urbains encombrés comme terrain adapté."
              },
              {
                "id": "chacal_dhole",
                "name": "Chacal / Dhole",
                "description": "Charognard robuste ; distingue sang frais et charogne récente."
              },
              {
                "id": "lycaon",
                "name": "Lycaon",
                "description": "Coureur de fond, particulièrement adapté à la poursuite continue."
              },
              {
                "id": "dingo",
                "name": "Dingo",
                "description": "Aridophile, tolère chaleur et manque d’eau."
              }
            ],
            "renards": [
              {
                "id": "roux",
                "name": "Roux",
                "description": "Profil équilibré, lisières et zones humaines peu denses."
              },
              {
                "id": "fennec",
                "name": "Fennec",
                "description": "Physiologie désertique et écoute exceptionnelle."
              },
              {
                "id": "arctique",
                "name": "Arctique",
                "description": "Adapté au froid intense et au camouflage neige/glace."
              },
              {
                "id": "gris_forestier",
                "name": "Gris / forestier",
                "description": "Grimpe et progression en terrain boisé/accidenté."
              }
            ],
            "grands_felins": [
              {
                "id": "tigre",
                "name": "Tigre",
                "description": "Profil de référence ; excellent nageur."
              },
              {
                "id": "lion",
                "name": "Lion",
                "description": "Plus massif ; peut reconnaître une petite troupe durable sans mécanique de Meute."
              },
              {
                "id": "panthere",
                "name": "Panthère",
                "description": "Plus agile, escalade et progression nocturne."
              },
              {
                "id": "jaguar",
                "name": "Jaguar",
                "description": "À l’aise dans l’eau et la végétation dense."
              },
              {
                "id": "puma",
                "name": "Puma",
                "description": "Agile en terrain montagneux et changements d’élévation."
              }
            ],
            "chats": [
              {
                "id": "domestique",
                "name": "Domestique",
                "description": "Forme animale crédible comme chat ordinaire."
              },
              {
                "id": "sauvage",
                "name": "Sauvage",
                "description": "Plus robuste, moins facile à banaliser."
              },
              {
                "id": "nocturne",
                "name": "Nocturne",
                "description": "Perception et déplacement naturels en faible lumière."
              },
              {
                "id": "grimpeur",
                "name": "Grimpeur",
                "description": "Griffes et articulations adaptées aux surfaces verticales."
              }
            ],
            "rapaces": [
              {
                "id": "aigle",
                "name": "Aigle",
                "description": "Puissant, vision longue portée."
              },
              {
                "id": "faucon",
                "name": "Faucon",
                "description": "Très agile, vitesse horizontale."
              },
              {
                "id": "hibou",
                "name": "Hibou",
                "description": "Nocturne et silencieux."
              },
              {
                "id": "vautour",
                "name": "Vautour",
                "description": "Endurant et adapté aux charognes."
              }
            ],
            "requins": [
              {
                "id": "requin_blanc",
                "name": "Requin blanc",
                "description": "Profil de référence, froid et grandes profondeurs."
              },
              {
                "id": "bouledogue",
                "name": "Bouledogue",
                "description": "Eau douce/salée et transitions de milieu."
              },
              {
                "id": "requin_tigre",
                "name": "Requin tigre",
                "description": "Digestion robuste et régime opportuniste."
              },
              {
                "id": "requin_marteau",
                "name": "Requin marteau",
                "description": "Électroréception fine et grande agilité."
              },
              {
                "id": "requin_baleine",
                "name": "Requin baleine",
                "description": "Très grand gabarit, moins prédateur."
              }
            ],
            "serpents": [
              {
                "id": "vipere",
                "name": "Vipère — hémotoxique",
                "description": "Venin hémotoxique."
              },
              {
                "id": "cobra",
                "name": "Cobra — neurotoxique",
                "description": "Venin neurotoxique."
              },
              {
                "id": "constricteur",
                "name": "Python / Boa — constricteur",
                "description": "Plus puissant, sans venin, spécialisé en constriction."
              },
              {
                "id": "furtif",
                "name": "Couleuvre / petite lignée furtive",
                "description": "Petit gabarit et très grande agilité."
              }
            ],
            "boudas": [
              {
                "id": "tachetee",
                "name": "Hyène tachetée",
                "description": "Plus massive et puissante."
              },
              {
                "id": "rayee",
                "name": "Hyène rayée",
                "description": "Plus mobile et discrète."
              },
              {
                "id": "brune",
                "name": "Hyène brune",
                "description": "Tolérance aux charognes et milieux arides."
              }
            ],
            "berserkirs": [
              {
                "id": "brun_grizzly",
                "name": "Brun / Grizzly",
                "description": "Masse, puissance et robustesse."
              },
              {
                "id": "polaire",
                "name": "Polaire",
                "description": "Froid extrême, nage et immersion glaciale."
              },
              {
                "id": "ours_noir",
                "name": "Ours noir",
                "description": "Plus mobile et meilleur grimpeur."
              }
            ],
            "crocodiliens": [
              {
                "id": "nil_marin",
                "name": "Crocodile du Nil / marin",
                "description": "Grand gabarit, eau libre."
              },
              {
                "id": "alligator",
                "name": "Alligator",
                "description": "Plus mobile à terre."
              },
              {
                "id": "caiman",
                "name": "Caïman",
                "description": "Gabarit réduit, zones encombrées."
              },
              {
                "id": "gavial",
                "name": "Gavial",
                "description": "Moins blindé, capture aquatique rapide."
              }
            ]
          }
        },
        {
          "key": "blood",
          "label": "Sang vif",
          "optional": true,
          "options": [
            {
              "id": "sang_naturel",
              "name": "Sang Naturel — Vortigern",
              "description": "Sang vif de Vortigern lié aux éléments et à l’accord primordial. Il exprime une relation instinctive à des forces naturelles que le Khinae apprend progressivement à canaliser plutôt qu’à simplement subir."
            },
            {
              "id": "sang_alpha",
              "name": "Sang Alpha — Ohtana",
              "description": "Sang d’Ohtana consacré à la dominance et à la cohésion. Chez un Loup il s’exprime naturellement autour de la Meute ; chez un autre descendant de Khinae, il suit la logique sociale propre à sa Lignée plutôt que d’inventer artificiellement une hiérarchie lupine."
            },
            {
              "id": "sang_revelateur",
              "name": "Sang Révélateur — Ceallachán",
              "description": "Sang de Ceallachán lié à la pensée et à la destruction des mensonges surnaturels. Il pousse l’héritage Khinae vers la lecture de ce qui se cache derrière l’apparence et la confrontation directe aux tromperies occultes."
            },
            {
              "id": "sang_ecarlate",
              "name": "Sang Écarlate — Keyna",
              "description": "Sang de Keyna centré sur la puissance physique et la perception du sang. Il fait du corps et de la chasse hématique une même spécialisation, plus brutale que la plupart des Sangs de perception."
            },
            {
              "id": "sang_sculpteur",
              "name": "Sang Sculpteur — Svenn",
              "description": "Sang de Svenn consacré au modelage de matière et de chair. Il traite le corps et certaines structures physiques comme des formes susceptibles d’être altérées par un héritage Khinae particulièrement plastique."
            },
            {
              "id": "sang_funeste",
              "name": "Sang Funeste — Verica",
              "description": "Sang de Verica lié à la mort, aux spectres et à la violence immatérielle. Il rapproche le prédateur du monde des morts sans faire de lui un nécromancien universel."
            },
            {
              "id": "sang_primal",
              "name": "Sang Primal — Khuyildar",
              "description": "Sang de Khuyildar fondé sur l’assimilation animale et la brume. Il explore la plasticité prédatrice de Khinae en ajoutant d’autres propriétés animales et des expressions corporelles plus fluides."
            },
            {
              "id": "sang_chasseur",
              "name": "Sang Chasseur — Thorkel",
              "description": "Sang de Thorkel consacré à la traque absolue et à la disparition. Il pousse l’instinct de poursuite jusqu’à faire du porteur un prédateur spécialisé dans la conservation du contact et l’effacement de sa propre présence."
            },
            {
              "id": "sang_de_sagesse",
              "name": "Sang de Sagesse — Tomoko",
              "description": "Sang de Tomoko centré sur la mémoire et l’assimilation des savoirs. Sa prédation s’exprime moins par la force que par la capacité à conserver, incorporer et réutiliser ce qui a été appris."
            },
            {
              "id": "sang_enrage",
              "name": "Sang Enragé — Asulf",
              "description": "Sang d’Asulf consacré à la Frénésie volontaire. Il permet de traiter la rage prédatrice non comme un accident subi, mais comme un état dangereux que le porteur apprend à ouvrir, orienter puis refermer."
            },
            {
              "id": "sang_enchaine",
              "name": "Sang Enchaîné — Jayanti",
              "description": "Sang de Jayanti qui remplace la forme hybride par un véritable corps de guerre humain révélé. Il conserve mains, armes et précision technique tout en développant une puissance surhumaine, mais interdit la Mue hybride selon les règles du Sang."
            },
            {
              "id": "sang_vengeur",
              "name": "Sang Vengeur — Astaphium",
              "description": "Sang d’Astaphium lié aux plaies, à la douleur et à la violence de la Mue. Il transforme les blessures et la souffrance du corps en vecteurs de riposte plutôt qu’en simple coût à encaisser."
            }
          ]
        }
      ],
      "baseFreeTraits": [
        {
          "name": "Âme du Cycle",
          "access": "—",
          "effect": "À sa mort véritable, le descendant de Khinae rejoint normalement le Cycle des âmes."
        },
        {
          "name": "Régénération lente",
          "access": "R · humain révélé / animal",
          "effect": "Récupère 1 PV par heure hors combat."
        },
        {
          "name": "Instinct de Lignée",
          "access": "SR/R",
          "effect": "La Frénésie et les perceptions instinctives prennent l’animal de la Lignée comme référence ; elles ne donnent ni Appel de la Meute ni Hiérarchie lupine par défaut."
        },
        {
          "name": "Corps de guerre",
          "access": "R · hybride",
          "effect": "En hybride : +3 aux tests de Pugilat et Régénération de 2 PV au début de chaque round tant que le personnage reste vivant et maintient la forme."
        },
        {
          "name": "Rythme Khinae",
          "access": "R · hybride",
          "effect": "À partir du round suivant l’achèvement de la Mue hybride : +1 PA à chaque round, au-delà du maximum normal."
        }
      ],
      "freeTraitRules": [
        {
          "when": {
            "lineage": "canides_errants"
          },
          "traits": [
            {
              "name": "Piste nomade",
              "access": "SR",
              "effect": "Après identification directe d’une odeur, la distingue du bruit olfactif ordinaire pour la scène tant qu’une trace physique existe.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "renards"
          },
          "traits": [
            {
              "name": "Odeur mouvante",
              "access": "SR",
              "effect": "Peut atténuer, accentuer ou déformer sa propre odeur naturelle sans imiter encore parfaitement un individu précis.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "grands_felins"
          },
          "traits": [
            {
              "name": "Silence du grand fauve",
              "access": "SR",
              "effect": "Ses déplacements naturels ne suffisent pas à révéler sa position lorsqu’il possède déjà un couvert ou une dissimulation crédible.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "chats"
          },
          "traits": [
            {
              "name": "Inoffensif par nature",
              "access": "SR",
              "effect": "Un instinct surnaturel de prédation ne le classe pas automatiquement comme menace majeure tant qu’il ne manifeste pas d’hostilité.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "rapaces"
          },
          "traits": [
            {
              "name": "Bond ailé",
              "access": "R · Animal/Hybride",
              "effect": "Un Déplacement peut devenir un grand bond soutenu par les ailes ; pas de vol stationnaire.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "requins"
          },
          "traits": [
            {
              "name": "Sang qui refuse l’abysse",
              "access": "SR/R",
              "effect": "1/scène, peut relancer une exposition biologique directe à la Corruption de Thul.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "serpents"
          },
          "traits": [
            {
              "name": "Corps ophidien",
              "access": "R · Animal/Hybride",
              "effect": "Locomotion sans membres, enroulement et compression corporelle impossibles pour un humain.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "boudas"
          },
          "traits": [
            {
              "name": "Bande de ricanement",
              "access": "SR/R",
              "effect": "Au début d’une scène/chasse, reconnaît jusqu’à trois consentants comme sa Bande pour les Talents de Lignée.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "berserkirs"
          },
          "traits": [
            {
              "name": "Masse ursine",
              "access": "R · Hybride",
              "effect": "Une force humaine ordinaire ne peut normalement pas le renverser, pousser ou soulever.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "crocodiliens"
          },
          "traits": [
            {
              "name": "Fossile de vase",
              "access": "R · Animal/Hybride",
              "effect": "Peut rester presque parfaitement immobile et ralentir ses fonctions ; le mouvement seul ne suffit plus à le détecter.",
              "source": "Signature gratuite de Lignée"
            }
          ]
        },
        {
          "when": {
            "lineage": "canides_errants",
            "variant": "coyote"
          },
          "traits": [
            {
              "name": "Variante — Coyote",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Gabarit compact ; milieux urbains encombrés comme terrain adapté."
            }
          ]
        },
        {
          "when": {
            "lineage": "canides_errants",
            "variant": "chacal_dhole"
          },
          "traits": [
            {
              "name": "Variante — Chacal / Dhole",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Charognard robuste ; distingue sang frais et charogne récente."
            }
          ]
        },
        {
          "when": {
            "lineage": "canides_errants",
            "variant": "lycaon"
          },
          "traits": [
            {
              "name": "Variante — Lycaon",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Coureur de fond, particulièrement adapté à la poursuite continue."
            }
          ]
        },
        {
          "when": {
            "lineage": "canides_errants",
            "variant": "dingo"
          },
          "traits": [
            {
              "name": "Variante — Dingo",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Aridophile, tolère chaleur et manque d’eau."
            }
          ]
        },
        {
          "when": {
            "lineage": "renards",
            "variant": "roux"
          },
          "traits": [
            {
              "name": "Variante — Roux",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Profil équilibré, lisières et zones humaines peu denses."
            }
          ]
        },
        {
          "when": {
            "lineage": "renards",
            "variant": "fennec"
          },
          "traits": [
            {
              "name": "Variante — Fennec",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Physiologie désertique et écoute exceptionnelle."
            }
          ]
        },
        {
          "when": {
            "lineage": "renards",
            "variant": "arctique"
          },
          "traits": [
            {
              "name": "Variante — Arctique",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Adapté au froid intense et au camouflage neige/glace."
            }
          ]
        },
        {
          "when": {
            "lineage": "renards",
            "variant": "gris_forestier"
          },
          "traits": [
            {
              "name": "Variante — Gris / forestier",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Grimpe et progression en terrain boisé/accidenté."
            }
          ]
        },
        {
          "when": {
            "lineage": "grands_felins",
            "variant": "tigre"
          },
          "traits": [
            {
              "name": "Variante — Tigre",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Profil de référence ; excellent nageur."
            }
          ]
        },
        {
          "when": {
            "lineage": "grands_felins",
            "variant": "lion"
          },
          "traits": [
            {
              "name": "Variante — Lion",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Plus massif ; peut reconnaître une petite troupe durable sans mécanique de Meute."
            }
          ]
        },
        {
          "when": {
            "lineage": "grands_felins",
            "variant": "panthere"
          },
          "traits": [
            {
              "name": "Variante — Panthère",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Plus agile, escalade et progression nocturne."
            }
          ]
        },
        {
          "when": {
            "lineage": "grands_felins",
            "variant": "jaguar"
          },
          "traits": [
            {
              "name": "Variante — Jaguar",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "À l’aise dans l’eau et la végétation dense."
            }
          ]
        },
        {
          "when": {
            "lineage": "grands_felins",
            "variant": "puma"
          },
          "traits": [
            {
              "name": "Variante — Puma",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Agile en terrain montagneux et changements d’élévation."
            }
          ]
        },
        {
          "when": {
            "lineage": "chats",
            "variant": "domestique"
          },
          "traits": [
            {
              "name": "Variante — Domestique",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Forme animale crédible comme chat ordinaire."
            }
          ]
        },
        {
          "when": {
            "lineage": "chats",
            "variant": "sauvage"
          },
          "traits": [
            {
              "name": "Variante — Sauvage",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Plus robuste, moins facile à banaliser."
            }
          ]
        },
        {
          "when": {
            "lineage": "chats",
            "variant": "nocturne"
          },
          "traits": [
            {
              "name": "Variante — Nocturne",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Perception et déplacement naturels en faible lumière."
            }
          ]
        },
        {
          "when": {
            "lineage": "chats",
            "variant": "grimpeur"
          },
          "traits": [
            {
              "name": "Variante — Grimpeur",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Griffes et articulations adaptées aux surfaces verticales."
            }
          ]
        },
        {
          "when": {
            "lineage": "rapaces",
            "variant": "aigle"
          },
          "traits": [
            {
              "name": "Variante — Aigle",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Puissant, vision longue portée."
            }
          ]
        },
        {
          "when": {
            "lineage": "rapaces",
            "variant": "faucon"
          },
          "traits": [
            {
              "name": "Variante — Faucon",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Très agile, vitesse horizontale."
            }
          ]
        },
        {
          "when": {
            "lineage": "rapaces",
            "variant": "hibou"
          },
          "traits": [
            {
              "name": "Variante — Hibou",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Nocturne et silencieux."
            }
          ]
        },
        {
          "when": {
            "lineage": "rapaces",
            "variant": "vautour"
          },
          "traits": [
            {
              "name": "Variante — Vautour",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Endurant et adapté aux charognes."
            }
          ]
        },
        {
          "when": {
            "lineage": "requins",
            "variant": "requin_blanc"
          },
          "traits": [
            {
              "name": "Variante — Requin blanc",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Profil de référence, froid et grandes profondeurs."
            }
          ]
        },
        {
          "when": {
            "lineage": "requins",
            "variant": "bouledogue"
          },
          "traits": [
            {
              "name": "Variante — Bouledogue",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Eau douce/salée et transitions de milieu."
            }
          ]
        },
        {
          "when": {
            "lineage": "requins",
            "variant": "requin_tigre"
          },
          "traits": [
            {
              "name": "Variante — Requin tigre",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Digestion robuste et régime opportuniste."
            }
          ]
        },
        {
          "when": {
            "lineage": "requins",
            "variant": "requin_marteau"
          },
          "traits": [
            {
              "name": "Variante — Requin marteau",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Électroréception fine et grande agilité."
            }
          ]
        },
        {
          "when": {
            "lineage": "requins",
            "variant": "requin_baleine"
          },
          "traits": [
            {
              "name": "Variante — Requin baleine",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Très grand gabarit, moins prédateur."
            }
          ]
        },
        {
          "when": {
            "lineage": "serpents",
            "variant": "vipere"
          },
          "traits": [
            {
              "name": "Variante — Vipère — hémotoxique",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Venin hémotoxique."
            }
          ]
        },
        {
          "when": {
            "lineage": "serpents",
            "variant": "cobra"
          },
          "traits": [
            {
              "name": "Variante — Cobra — neurotoxique",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Venin neurotoxique."
            }
          ]
        },
        {
          "when": {
            "lineage": "serpents",
            "variant": "constricteur"
          },
          "traits": [
            {
              "name": "Variante — Python / Boa — constricteur",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Plus puissant, sans venin, spécialisé en constriction."
            }
          ]
        },
        {
          "when": {
            "lineage": "serpents",
            "variant": "furtif"
          },
          "traits": [
            {
              "name": "Variante — Couleuvre / petite lignée furtive",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Petit gabarit et très grande agilité."
            }
          ]
        },
        {
          "when": {
            "lineage": "boudas",
            "variant": "tachetee"
          },
          "traits": [
            {
              "name": "Variante — Hyène tachetée",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Plus massive et puissante."
            }
          ]
        },
        {
          "when": {
            "lineage": "boudas",
            "variant": "rayee"
          },
          "traits": [
            {
              "name": "Variante — Hyène rayée",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Plus mobile et discrète."
            }
          ]
        },
        {
          "when": {
            "lineage": "boudas",
            "variant": "brune"
          },
          "traits": [
            {
              "name": "Variante — Hyène brune",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Tolérance aux charognes et milieux arides."
            }
          ]
        },
        {
          "when": {
            "lineage": "berserkirs",
            "variant": "brun_grizzly"
          },
          "traits": [
            {
              "name": "Variante — Brun / Grizzly",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Masse, puissance et robustesse."
            }
          ]
        },
        {
          "when": {
            "lineage": "berserkirs",
            "variant": "polaire"
          },
          "traits": [
            {
              "name": "Variante — Polaire",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Froid extrême, nage et immersion glaciale."
            }
          ]
        },
        {
          "when": {
            "lineage": "berserkirs",
            "variant": "ours_noir"
          },
          "traits": [
            {
              "name": "Variante — Ours noir",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Plus mobile et meilleur grimpeur."
            }
          ]
        },
        {
          "when": {
            "lineage": "crocodiliens",
            "variant": "nil_marin"
          },
          "traits": [
            {
              "name": "Variante — Crocodile du Nil / marin",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Grand gabarit, eau libre."
            }
          ]
        },
        {
          "when": {
            "lineage": "crocodiliens",
            "variant": "alligator"
          },
          "traits": [
            {
              "name": "Variante — Alligator",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Plus mobile à terre."
            }
          ]
        },
        {
          "when": {
            "lineage": "crocodiliens",
            "variant": "caiman"
          },
          "traits": [
            {
              "name": "Variante — Caïman",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Gabarit réduit, zones encombrées."
            }
          ]
        },
        {
          "when": {
            "lineage": "crocodiliens",
            "variant": "gavial"
          },
          "traits": [
            {
              "name": "Variante — Gavial",
              "access": "Gratuit",
              "source": "Biologie Khinae",
              "effect": "Moins blindé, capture aquatique rapide."
            }
          ]
        }
      ]
    },
    "mage": {
      "id": "mage",
      "name": "Mage",
      "description": "Un Mage est un Humain lié à un Mageius, structure magique quasi autonome qui lui permet d’imposer sa volonté au réel. Sa magie n’est pas une liste fermée de sorts : elle dépend d’Affinités, de Maîtrise, d’Amplitude et surtout de ce que le personnage comprend réellement du phénomène qu’il veut modifier. Il peut improviser dans une Affinité non éveillée en Maîtrise Initiale / Amplitude Mineure avec +1 niveau de difficulté ; les rangs supérieurs exigent son éveil. Le Mageius peut aussi porter des Échos de porteurs plus anciens sans remplacer l’identité actuelle du Mage.",
      "choices": [
        {
          "key": "mageiusType",
          "label": "Type de Mageius",
          "optional": false,
          "options": [
            {
              "id": "kaharal",
              "name": "Kaharal",
              "description": "Mageius de Matière. Kaharal travaille la structure du monde physique par Architétramancie, Morphomancie et Alchimie : bâtir, transformer ou recomposer exige de comprendre ce que la matière est réellement."
            },
            {
              "id": "meldir",
              "name": "Meldir",
              "description": "Mageius d’Énergie. Meldir s’exprime par Photomancie, Acratomancie et Médéomancie : lumière, états énergétiques et restauration sont traités comme des phénomènes à manipuler plutôt que comme des effets abstraits."
            },
            {
              "id": "elinaeth",
              "name": "Elinaeth",
              "description": "Mageius de Réalité. Elinaeth couvre Télékinésie, Divination et Chronomancie : forces, information et continuum deviennent manipulables, mais les effets les plus ambitieux demandent maîtrise, connaissance et précision."
            },
            {
              "id": "mestherak",
              "name": "Mestherak",
              "description": "Mageius de l’axe spectral. Spectromancie, Hématomancie et Nécromancie travaillent âme, sang, mort et essence vitale ; ce Mageius est particulièrement puissant dès qu’il faut comprendre ce qui persiste derrière le corps."
            },
            {
              "id": "discella",
              "name": "Discella",
              "description": "Mageius de l’Ombre et de l’Esprit. Skiamancie, Pseudomancie et Pathomancie agissent sur l’Ombre surnaturelle, la perception et les malédictions, trois domaines proches en apparence mais métaphysiquement distincts."
            }
          ]
        },
        {
          "key": "dominantAffinity",
          "label": "Affinité dominante",
          "optional": false,
          "dependsOn": "mageiusType",
          "options": [],
          "optionsBy": {
            "kaharal": [
              {
                "id": "architetramancie",
                "name": "Architétramancie",
                "description": "Affinité native de Kaharal. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "morphomancie",
                "name": "Morphomancie",
                "description": "Affinité native de Kaharal. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "alchimie",
                "name": "Alchimie",
                "description": "Affinité native de Kaharal. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              }
            ],
            "meldir": [
              {
                "id": "photomancie",
                "name": "Photomancie",
                "description": "Affinité native de Meldir. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "acratomancie",
                "name": "Acratomancie",
                "description": "Affinité native de Meldir. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "medeomancie",
                "name": "Médéomancie",
                "description": "Affinité native de Meldir. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              }
            ],
            "elinaeth": [
              {
                "id": "telekinesie",
                "name": "Télékinésie",
                "description": "Affinité native de Elinaeth. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "divination",
                "name": "Divination",
                "description": "Affinité native de Elinaeth. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "chronomancie",
                "name": "Chronomancie",
                "description": "Affinité native de Elinaeth. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              }
            ],
            "mestherak": [
              {
                "id": "spectromancie",
                "name": "Spectromancie",
                "description": "Affinité native de Mestherak. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "hematomancie",
                "name": "Hématomancie",
                "description": "Affinité native de Mestherak. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "necromancie",
                "name": "Nécromancie",
                "description": "Affinité native de Mestherak. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              }
            ],
            "discella": [
              {
                "id": "skiamancie",
                "name": "Skiamancie",
                "description": "Affinité native de Discella. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "pseudomancie",
                "name": "Pseudomancie",
                "description": "Affinité native de Discella. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              },
              {
                "id": "pathomancie",
                "name": "Pathomancie",
                "description": "Affinité native de Discella. Commence gratuitement en Maîtrise Initiale / Amplitude Mineure."
              }
            ]
          }
        }
      ],
      "baseFreeTraits": [
        {
          "name": "Vision à travers le Voile",
          "access": "SR/R",
          "effect": "Perçoit les créatures et phénomènes accessibles à son niveau de Révélation."
        },
        {
          "name": "Perception magique",
          "access": "SR/R",
          "effect": "Ressent nœuds, enchantements, traces et présences magiques."
        },
        {
          "name": "Protection du Mageius",
          "access": "SR/R",
          "effect": "+3 Défense occulte contre les effets surnaturels agissant directement sur le Mage."
        }
      ],
      "freeTraitRules": [
        {
          "when": {
            "mageiusType": "kaharal",
            "dominantAffinity": "architetramancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Architétramancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "kaharal",
            "dominantAffinity": "morphomancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Morphomancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "kaharal",
            "dominantAffinity": "alchimie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Alchimie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "meldir",
            "dominantAffinity": "photomancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Photomancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "meldir",
            "dominantAffinity": "acratomancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Acratomancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "meldir",
            "dominantAffinity": "medeomancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Médéomancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "elinaeth",
            "dominantAffinity": "telekinesie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Télékinésie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "elinaeth",
            "dominantAffinity": "divination"
          },
          "traits": [
            {
              "name": "Affinité dominante — Divination",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "elinaeth",
            "dominantAffinity": "chronomancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Chronomancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "mestherak",
            "dominantAffinity": "spectromancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Spectromancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "mestherak",
            "dominantAffinity": "hematomancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Hématomancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "mestherak",
            "dominantAffinity": "necromancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Nécromancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "discella",
            "dominantAffinity": "skiamancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Skiamancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "discella",
            "dominantAffinity": "pseudomancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Pseudomancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        },
        {
          "when": {
            "mageiusType": "discella",
            "dominantAffinity": "pathomancie"
          },
          "traits": [
            {
              "name": "Affinité dominante — Pathomancie",
              "access": "Gratuit",
              "source": "Mageius",
              "effect": "Commence en Maîtrise Initiale / Amplitude Mineure. Résonance dominante : 1/scène, relancer le d10e d’un test utilisant directement cette Affinité et conserver le second résultat."
            }
          ]
        }
      ]
    },
    "daemon": {
      "id": "daemon",
      "name": "Daemon",
      "description": "Un Daemon n’est pas une espèce mais une âme morte choisie par une ancienne Divinité, retirée du Cycle puis reforgée comme Élu et porte de sa puissance. Chaque incarnation ajoute une vraie vie à cette histoire antérieure. La Divinité marque l’âme en profondeur, la Fonction est un rôle appris dans sa Cour et la Maisonnée une culture de service ; les anciens dieux ne se réduisent pas à une incarnation abstraite du Mal malgré leur démonisation après la victoire d’Elynea.",
      "choices": [
        {
          "key": "function",
          "label": "Fonction principale",
          "optional": false,
          "options": [
            {
              "id": "oracle",
              "name": "Oracle / Tentateur",
              "description": "Fonction tournée vers les âmes, les pensées, les rêves et l’influence. L’Oracle — ou Tentateur — comprend comment une volonté se forme et comment l’atteindre, mais sa Fonction reste un métier appris : sa Divinité demeure l’empreinte métaphysique la plus profonde."
            },
            {
              "id": "tourmenteur",
              "name": "Châtiment / Tourmenteur",
              "description": "Fonction du Châtiment : peur, souffrance, maladie et affliction du corps ou de l’esprit. Le Tourmenteur apprend à imposer ou exploiter ces états comme instruments, sans que cela fixe à lui seul sa morale ou les domaines de sa Divinité."
            },
            {
              "id": "legionnaire",
              "name": "Chevalier / Légionnaire",
              "description": "Fonction martiale des Cours daemoniaques. Le Chevalier ou Légionnaire est formé pour porter la puissance de sa Cour dans l’affrontement, mais deux Chevaliers de Divinités différentes peuvent incarner des forces et des méthodes radicalement opposées."
            }
          ]
        },
        {
          "key": "divinity",
          "label": "Divinité",
          "optional": false,
          "options": [
            {
              "id": "alabor",
              "name": "Alabor — Eaux primordiales",
              "description": "Alabor porte les Eaux primordiales : profondeur, pression, mouvement et fécondité. Sa puissance évoque moins une simple magie de l’eau qu’une force antérieure aux formes stables, capable d’engloutir, porter ou remodeler ce qui s’y abandonne."
            },
            {
              "id": "astaroth",
              "name": "Astaroth — Civilisation",
              "description": "Astaroth porte la Civilisation, le savoir et la création. Ses Daemons héritent d’un rapport aux œuvres construites, aux techniques et à l’accumulation de connaissance : faire, comprendre et transmettre peuvent être aussi sacrés que combattre."
            },
            {
              "id": "belial",
              "name": "Belial — Reine des Dieux",
              "description": "Belial porte le Feu, la Domination et la royauté. Sa marque mêle puissance, autorité et chaleur destructrice ; elle peut produire grandeur, ambition et ordre aussi naturellement que tyrannie ou incendie."
            },
            {
              "id": "diablo",
              "name": "Diablo — Nuit",
              "description": "Diablo porte la Nuit et la peur. Ses domaines concernent ce qui se cache, ce que l’obscurité laisse imaginer et la manière dont la peur transforme le comportement ; la Nuit n’est pas automatiquement mensonge, mais elle refuse la sécurité de la pleine lumière."
            },
            {
              "id": "lilith",
              "name": "Lilith — Désir",
              "description": "Lilith porte désir, plaisir, attachement et fertilité. Son domaine touche aux liens intimes et au corps vivant, capables de produire amour, création et autonomie autant qu’obsession ou dépendance ; le désir n’y est jamais réductible à une simple séduction."
            },
            {
              "id": "mammon",
              "name": "Mammon — Inéluctable",
              "description": "Mammon porte la mort, la vieillesse et l’Inéluctable. Sa puissance parle de fin, d’usure et de passage : elle peut achever, accélérer ou rappeler que toute chose se termine, mais aussi offrir le repos lorsque prolonger la souffrance n’a plus de sens."
            },
            {
              "id": "mephisto",
              "name": "Méphisto — Occulte, Parole et Hasard",
              "description": "Méphisto porte l’Occulte, la parole et le hasard. Ses Daemons travaillent volontiers sur les structures cachées, les mots qui changent une situation et les opportunités imprévisibles ; comprendre une règle secrète compte souvent autant que la puissance brute."
            },
            {
              "id": "satan",
              "name": "Satan — Juge",
              "description": "Satan porte le Jugement, la sentence et l’ordre. Sa marque demande d’identifier une responsabilité avant de trancher et distingue idéalement preuve, culpabilité et punition — même si ses serviteurs peuvent transformer cette exigence en autoritarisme implacable."
            },
            {
              "id": "lucifer",
              "name": "Lucifer — Soleil déchu",
              "description": "Lucifer conserve le Soleil, le cycle, la vie et le courage malgré sa place dans les récits de chute. Sa puissance est rayonnante, vitale et cyclique : elle peut inspirer, brûler, protéger ou exiger que l’on affronte ce qui terrifie plutôt que de s’y soumettre."
            },
            {
              "id": "belzebuth",
              "name": "Belzébuth — Vie",
              "description": "Belzébuth porte la Vie jusque dans l’évolution, la maladie et la mutation. Guérison et infection appartiennent donc au même domaine : sa marque considère le vivant comme un système capable de croître, s’adapter, proliférer ou devenir monstrueusement autre."
            },
            {
              "id": "abigor",
              "name": "Abigor — Ciel",
              "description": "Abigor est le Ciel violent : vent, orage et tempête. Sa marque privilégie mouvement, pression atmosphérique et puissance soudaine ; il est la force d’un ciel qui cesse d’être décor pour devenir acteur."
            },
            {
              "id": "baal",
              "name": "Baal — Guerre",
              "description": "Baal incarne la Guerre. Son domaine ne se limite pas au goût du combat : stratégie, meurtre, blessure, discipline, courage et coût humain de la violence sont autant de facettes possibles de la même puissance."
            },
            {
              "id": "morrighan",
              "name": "Morrighan — Corneille étrangère",
              "description": "Morrighan occupe une place singulière autour de la guerre, de la frénésie, des présages, de la mort et de la royauté. Sa marque associe le champ de bataille à ce qui l’annonce, à ceux qui y règnent et à ce qui subsiste lorsque la violence est passée."
            }
          ]
        },
        {
          "key": "patron",
          "label": "Maisonnée / Patron",
          "optional": false,
          "dependsOn": "divinity",
          "options": [],
          "optionsBy": {
            "alabor": [
              {
                "id": "vephar",
                "name": "Vephar — Brumes",
                "description": "Ambiguïté et approche indirecte. Faveur — Brume de Scylla : 1 PA, 1/scène, brume de 5 m pour la scène ; −3 perceptions et tirs qui la traversent, sans malus pour le Daemon."
              },
              {
                "id": "forneus",
                "name": "Forneus — Vagues",
                "description": "Ténacité, avancer puis revenir. Faveur — Élan de la vague : 1/scène après un Déplacement, effectuer immédiatement un second Déplacement ou repousser fortement une cible touchée."
              },
              {
                "id": "zagan",
                "name": "Zagan — Pression",
                "description": "Force contenue et patience écrasante. Faveur — Pression distribuée : 1/scène, appliquer la contrainte/poussée d’un pouvoir de Pression à une seconde cible proche, sans dégâts supplémentaires."
              },
              {
                "id": "shax",
                "name": "Shax — Pluie",
                "description": "Fertilité et cruauté, donner ou retirer l’eau. Faveur — Pluie révélatrice : 1/scène dans une pluie, les silhouettes/mouvements physiques sont révélés pendant un round et les dissimulations visuelles légères ne protègent pas du Daemon."
              }
            ],
            "astaroth": [
              {
                "id": "ardat_lili",
                "name": "Ardat-Lili — Arts",
                "description": "Création, beauté et inspiration. Faveur — Inspiration contagieuse : création artistique DR 2+, 1/scène, un observateur touché reçoit +2 à son prochain test cohérent avec l’idée/émotion transmise."
              },
              {
                "id": "byleth",
                "name": "Byleth — Inventivité",
                "description": "Expérimentation et innovation. Faveur — Prototype : 1/scénario, improviser depuis des composants plausibles un outil temporaire répondant à un besoin précis ; Prendre son temps sans le délai normal, prototype fragile/limité."
              },
              {
                "id": "asmodee",
                "name": "Asmodée — Mathématiques",
                "description": "Formaliser et opposer la logique d’un phénomène. Faveur — Mise en équation : Réaction 1/scène, +3 Défense occulte contre un pouvoir ciblé ; après usage, comprendre sa structure logique générale sans apprendre ses Talents."
              },
              {
                "id": "morax",
                "name": "Morax — Médecine",
                "description": "Science médicale et observation clinique. Faveur — Diagnostic du Duc : après 1 PA d’examen, connaître la principale cause médicale accessible ; le prochain test de Soins correspondant bénéficie de Prendre son temps sans délai."
              },
              {
                "id": "alocer",
                "name": "Alocer — Informatique",
                "description": "Information numérique, architecture et réseaux. Faveur — Chemin de code : 1/scène, après un test informatique réussi, obtenir en plus une information structurelle utile sur le système."
              }
            ],
            "belial": [
              {
                "id": "marchosias",
                "name": "Marchosias — Victoire",
                "description": "Courage, loyauté, persévérance. Faveur — Victoire arrachée : 1/scène, un échec de 3 points ou moins devient une réussite simple DR 0 ; jamais sur Échec narratif."
              },
              {
                "id": "demona",
                "name": "Demona — Destruction",
                "description": "Pragmatisme et efficacité. Faveur — Démolition méthodique : après 1 PA d’observation d’un objet/structure/barrière/protection, le MJ indique la partie accessible dont la destruction aura la conséquence fonctionnelle la plus importante."
              }
            ],
            "diablo": [
              {
                "id": "xezbeth",
                "name": "Xezbeth — Cauchemars",
                "description": "Renseignement par la peur et mensonges obsédants. Faveur — Rêve empoisonné : après une peur/illusion réussie, 1/scène, marquer la victime ; son prochain sommeil reprend le thème et peut contenir un message simple."
              },
              {
                "id": "balam",
                "name": "Balam — Peur",
                "description": "Faire face au danger et imposer sa présence. Faveur — Dogue noir : 1/scène lorsqu’un adversaire visible engage volontairement au contact, test occulte ; sur échec la cible doit garder ses distances ou subit −3 à sa première attaque contre le Daemon."
              },
              {
                "id": "amon",
                "name": "Amon — Obscurité",
                "description": "Absorber ce qui s’oppose à la Nuit. Faveur — Mange-lumière : Réaction 1/scène contre lumière/solaire, +3 à la Défense ; si résistance réussie, la manifestation est aussi affaiblie/éteinte quand possible."
              },
              {
                "id": "anammalech",
                "name": "Anammalech — Nuit",
                "description": "Discrétion et présence dans les coulisses. Faveur — Ombre de la Nuit : 1/scène dans une obscurité réelle et sans action hostile, les perceptions surnaturelles cherchant simplement le Daemon doivent battre sa Furtivité."
              }
            ],
            "lilith": [
              {
                "id": "meririm",
                "name": "Meririm — Charme",
                "description": "Liberté sexuelle, plaisir, absence de honte. Faveur — Accueil de Meririm : 1/scène, envers une personne éprouvant déjà attirance/affection/désir, savoir si une demande précise serait acceptée, refusée ou négociable et quelle limite bloque."
              },
              {
                "id": "babalon",
                "name": "Babalon — Fertilité",
                "description": "Corps souverain et biologie comme puissance. Faveur — Cycle parfait : 1/scène avec un Talent de Fertilité/Chair, ignorer un obstacle biologique ordinaire ; jamais une protection surnaturelle/divine."
              },
              {
                "id": "gusoyn",
                "name": "Gusoyn — Manipulation",
                "description": "Comprendre les rapports humains et utiliser les désirs plutôt que contraindre. Faveur — Levier intime : après 1 PA d’observation, le MJ indique le principal levier émotionnel/social perceptible ; une action réellement pertinente peut recevoir le bonus circonstanciel normal."
              },
              {
                "id": "sytry",
                "name": "Sytry — Secrets féminins",
                "description": "Intimité, désir féminin, discrétion et renseignement. Faveur — Secret du désir : 1/scène, sur une cible de physiologie féminine, Voir le désir peut révéler un désir enfoui ou consciemment retenu."
              }
            ],
            "mammon": [
              {
                "id": "alastor",
                "name": "Alastor — Souffrance",
                "description": "La douleur comme mémoire d’une vie. Faveur — Écho de douleur : 1/scène contre une cible ayant déjà perdu des PV, attaque occulte ; réussite : −3 à sa prochaine action."
              },
              {
                "id": "abrahel",
                "name": "Abrahel — Âge",
                "description": "Tout se dégrade et finit. Faveur — Mémoire du corps : 1/scène au contact, lire âge biologique, altérations de vieillissement/rajeunissement et principales séquelles du temps ; le prochain Talent de Vieillesse peut cibler précisément une faiblesse."
              },
              {
                "id": "apollyon",
                "name": "Apollyon — Destruction",
                "description": "Ce qui doit mourir doit pouvoir être brisé. Faveur — Mort des choses : 1/scène, une attaque contre objet/structure/construction surnaturelle ignore 3 Protection."
              },
              {
                "id": "eurynome",
                "name": "Eurynome — Repos",
                "description": "Mort paisible, psychopompie et fin de la souffrance. Faveur — Repos accordé : 1/scène, 1 PA au contact, mettre fin à peur/douleur/agitation surnaturelle sur une cible consentante si la cause immédiate a disparu."
              }
            ],
            "mephisto": [
              {
                "id": "crocell",
                "name": "Crocell — Parole",
                "description": "Rhétorique, répartie et influence publique. Faveur — Répartie de Crocell : Réaction 1/scène après une action sociale réussie contre le Daemon, effectuer immédiatement un test social opposé ; résultat supérieur annule l’effet."
              },
              {
                "id": "abrasax",
                "name": "Abrasax — Magie",
                "description": "Étudier les systèmes occultes. Faveur — Leçon de Merlin : 1/scène, réduire d’un niveau la difficulté intrinsèque d’un usage du Spectre de Mageius, minimum 12 ; jamais la Défense d’une cible."
              },
              {
                "id": "paimon",
                "name": "Paimon — Mensonge",
                "description": "Mensonge cohérent et défendable. Faveur — Mensonge parfait : 1/scène après un mensonge réussi, toute capacité surnaturelle voulant établir que l’affirmation était mensongère doit battre le résultat original."
              },
              {
                "id": "vinea",
                "name": "Vinea — Vérité",
                "description": "La réalité importe. Faveur — Faux reconnu : 1/scène en entendant une affirmation factuelle, savoir si l’orateur ment volontairement ; ne révèle pas la vérité."
              }
            ],
            "satan": [
              {
                "id": "samael",
                "name": "Samael — Sentence",
                "description": "Enquêter avant de condamner. Faveur — Dossier clos : après culpabilité confirmée par Jugement, 1/scène, marquer la cible pour la scène ; les Talents de Sentence n’ont plus à réétablir cette culpabilité."
              },
              {
                "id": "cali",
                "name": "Cali — Vengeance",
                "description": "Dette, poursuite et représailles ciblées. Faveur — Poursuite de Cali : lorsqu’une créature blesse volontairement le Daemon ou un protégé, 1/scène, ressentir sa direction approximative et si elle s’éloigne/se rapproche dans la zone générale."
              },
              {
                "id": "barbatos",
                "name": "Barbatos — Paix",
                "description": "Maîtrise de soi et ordre durable. Faveur — Paix intérieure : 1/scène, une personne proche peut retenter avec +3 un test pour sortir de Frénésie, rage, peur ou perte de contrôle émotionnelle."
              },
              {
                "id": "acham",
                "name": "Acham — Jugement",
                "description": "Intégrité, preuve et justice morale. Faveur — Œil du magistrat : 1/scène en enquête/interrogatoire, demander quelle contradiction, dissimulation de preuve ou incohérence perceptible est la plus importante."
              }
            ],
            "lucifer": [
              {
                "id": "adramalech",
                "name": "Adramalech — Rayonnement",
                "description": "Gloire et présence étendue. Faveur — Rayonnement : 1/scène, doubler portée ou rayon d’un pouvoir ; jamais dégâts ni nombre de cibles choisies individuellement."
              },
              {
                "id": "abalim",
                "name": "Abalim — Splendeur",
                "description": "Majesté et beauté solaire. Faveur — Splendeur du Soleil : à Révélation complète, 1/scène, ennemis proches opposent Défense occulte ; échec : −3 à leurs actions directement hostiles jusqu’à la fin du prochain round."
              }
            ],
            "belzebuth": [
              {
                "id": "persephone",
                "name": "Perséphone — Régénération",
                "description": "Médecine et préservation de la vie. Faveur — Deuxième printemps : 1/scénario, une cible déjà saturée par une guérison de Belzébuth peut récupérer jusqu’à 2 PV supplémentaires."
              },
              {
                "id": "baphomet",
                "name": "Baphomet — Évolution",
                "description": "Corps modifiable, adaptation et expérimentation. Faveur — Sélection immédiate : 1/scène à la première exposition à un danger environnemental/poison/maladie/condition physique, +3 pour résister ; réussite peut produire une adaptation mineure pour la scène."
              }
            ],
            "abigor": [
              {
                "id": "astarte",
                "name": "Astarté — Lune",
                "description": "Espionnage mondain, cycles, beauté et pouvoir indirect. Faveur — Clarté lunaire : vision parfaite sous ciel nocturne ; 1/scène sous lumière lunaire, relancer son d10e et garder le second résultat."
              },
              {
                "id": "furfur",
                "name": "Furfur — Typhons",
                "description": "Mobilité, technologie militaire, frapper puis disparaître. Faveur — Momentum du Typhon : 1/scène après au moins un Déplacement normal dans le round, prochaine attaque du round +3 DGT."
              }
            ],
            "baal": [
              {
                "id": "ereshkigal",
                "name": "Ereshkigal — Meurtre",
                "description": "Neutraliser vite, efficacité létale. Faveur — Premier sang : 1/scène, attaque contre une cible Surprise ou ignorant la présence du Daemon +3 DGT."
              },
              {
                "id": "leraje",
                "name": "Leraje — Blessures",
                "description": "Précision et rendre chaque coup coûteux. Faveur — Blessure aggravée : 1/scène après avoir infligé des PV, la cible perd 2 PV supplémentaires à la fin de son prochain round sauf 1 PA consacré à stopper l’aggravation."
              },
              {
                "id": "focalor",
                "name": "Focalor — Dignité",
                "description": "Insoumission et refus de plier. Faveur — Dignité humaine : +3 Défense occulte contre les pouvoirs imposant explicitement soumission, obéissance, humiliation ou servitude."
              }
            ],
            "morrighan": [
              {
                "id": "nemain",
                "name": "Nemain — Frénésie",
                "description": "Fureur contrôlée et instinct de bataille. Faveur — Premier hurlement : en entrant en Frénésie, 1/scène, +3 à la première action physique avant la fin du prochain round."
              },
              {
                "id": "huginn",
                "name": "Huginn — Pensée",
                "description": "Observation et stratégie. Faveur — Pensée fulgurante : 1/scène sur un test d’Esprit/réflexion, bénéficier de Prendre son temps sans consacrer le temps supplémentaire."
              },
              {
                "id": "ibn_al_berih",
                "name": "Ibn al-Berih — Malheur",
                "description": "Attendre l’erreur. Faveur — Mauvais présage : Réaction 1/scène, faire relancer à une cible visible son d10e après une réussite ; elle garde le second résultat."
              },
              {
                "id": "nankilslas",
                "name": "Nankil’slas — Tromperie",
                "description": "Plans indirects et fausses identités. Faveur — Identité mouvante : 1/scène, après observation d’un milieu social, adopter une couverture plausible et ignorer pour la scène un malus de statut dû uniquement à l’absence d’appartenance."
              },
              {
                "id": "rhiannon",
                "name": "Rhiannon — Colère",
                "description": "Répondre à l’agression. Faveur — Courroux de Boadicée : après avoir subi des dégâts, 1/scène, +3 à la prochaine action directement contre l’auteur."
              },
              {
                "id": "cuchulainn",
                "name": "Cúchulainn — Courage",
                "description": "Héroïsme frontal et protection. Faveur — Courage du Héros : 1/scène, 1 PA, alliés proches +3 contre peur et intimidation surnaturelle jusqu’à la fin du prochain round."
              }
            ]
          }
        }
      ],
      "baseFreeTraits": [
        {
          "name": "Âme élue",
          "access": "V/SR/R",
          "effect": "L’âme est liée à sa Divinité et retirée du Cycle ordinaire."
        },
        {
          "name": "Vision des âmes",
          "access": "SR/R",
          "effect": "Lit la nature spirituelle générale d’une créature perçue."
        },
        {
          "name": "Assimilation des prières",
          "access": "SR/R",
          "effect": "Dans un Lieu de Résonance, la Faveur divine peut soutenir une action cohérente avec une Facette."
        }
      ],
      "freeTraitRules": [
        {
          "when": {
            "function": "oracle"
          },
          "traits": [
            {
              "name": "Télépathie",
              "access": "SR/R",
              "effect": "Communiquer mentalement avec une créature consentante perçue à environ 30 m. La cible peut répondre ; aucun accès gratuit à ses pensées.",
              "source": "Empreinte gratuite de Fonction"
            }
          ]
        },
        {
          "when": {
            "function": "tourmenteur"
          },
          "traits": [
            {
              "name": "Affliction",
              "access": "R · 1 PA · contact",
              "effect": "Volonté + Maîtrise spirituelle contre Défense occulte : douleur, nausée, faiblesse, vertige ou spasme ; −3 à une famille cohérente d’actions jusqu’à la fin du prochain round.",
              "source": "Empreinte gratuite de Fonction"
            }
          ]
        },
        {
          "when": {
            "function": "legionnaire"
          },
          "traits": [
            {
              "name": "Lame infernale",
              "access": "R · 1 PA",
              "effect": "Sacrifier 1 à 3 PV irréductibles : Lame divine DGT 7/9/11, de mêlée ou de tir, liée au Chevalier. Les PV sacrifiés réduisent aussi le maximum tant que la Lame existe.",
              "source": "Empreinte gratuite de Fonction"
            }
          ]
        },
        {
          "when": {
            "divinity": "alabor"
          },
          "traits": [
            {
              "name": "Corps des Profondeurs",
              "access": "R",
              "effect": "Respirer sous l’eau ; noyade et pression hydraulique ordinaires ne peuvent tuer le Daemon. Les manipulations insignifiantes de liquide sont triviales.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "astaroth"
          },
          "traits": [
            {
              "name": "Mémoire des Écrits",
              "access": "SR/R",
              "effect": "En touchant un document et en se concentrant, assimiler rapidement son contenu lisible, même dans une langue inconnue ; cela ne transmet ni expérience pratique ni Compétence.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "belial"
          },
          "traits": [
            {
              "name": "Feu de la Reine",
              "access": "R",
              "effect": "Produire et manipuler feu et chaleur à proximité ; le feu ordinaire ne peut à lui seul faire passer le Daemon sous 1 PV.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "diablo"
          },
          "traits": [
            {
              "name": "Rémanence nocturne",
              "access": "SR/R",
              "effect": "Lorsqu’un Vampire ou une Ombre utilise directement un pouvoir surnaturel contre le Daemon, conserver un Écho utilisable une fois dans la scène sous une forme limitée.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "lilith"
          },
          "traits": [
            {
              "name": "Grâce de Lilith",
              "access": "SR/R",
              "effect": "Une créature éprouvant réellement attirance, désir, amour ou affection doit réussir Volonté + Force Mentale 15 pour achever volontairement le Daemon.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "mammon"
          },
          "traits": [
            {
              "name": "Permission de mourir",
              "access": "R",
              "effect": "Au seuil de Mort, l’âme ne quitte pas immédiatement le corps tant que Mammon ne l’autorise pas ; le corps reste incapable d’agir sans effet spécifique.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "mephisto"
          },
          "traits": [
            {
              "name": "Spectre de Mageius",
              "access": "R",
              "effect": "Choisir une Affinité à la création ; usages Initiale/Mineure avec Volonté + Maîtrise spirituelle selon le moteur magique.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "satan"
          },
          "traits": [
            {
              "name": "Jugement",
              "access": "SR/R",
              "effect": "Face à une accusation précise, discerner si l’âme de la cible porte réellement la responsabilité de l’acte ; ne détecte jamais le Bien ou le Mal abstrait.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "lucifer"
          },
          "traits": [
            {
              "name": "Radiance originelle",
              "access": "SR/R",
              "effect": "Les pouvoirs offensifs divins de Lucifer comptent comme solaires et gagnent leur avantage contre les créatures intrinsèquement vulnérables au solaire.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "belzebuth"
          },
          "traits": [
            {
              "name": "Vies offertes",
              "access": "SR/R",
              "effect": "Lorsqu’il devrait mourir, le Daemon peut sacrifier 1 Vigueur pour le reste de l’incarnation et revenir immédiatement à 1 PV ; Vigueur ne peut descendre sous 1.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "abigor"
          },
          "traits": [
            {
              "name": "Souffle du Ciel",
              "access": "R",
              "effect": "Pas de besoin normal de respirer ; les substances inhalées ordinaires ne peuvent tuer ou empoisonner le Daemon.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "baal"
          },
          "traits": [
            {
              "name": "Instinct de Guerre",
              "access": "SR/R",
              "effect": "En SR : +1 aux tests de Mêlée, Pugilat et Tir ; en R : +2 à ces mêmes tests.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "morrighan"
          },
          "traits": [
            {
              "name": "Forme spirituelle",
              "access": "R",
              "effect": "Le serviteur possède une forme animale ou végétale symbolique et peut l’adopter en 1 PA, avec ses propriétés naturelles évidentes.",
              "source": "Empreinte gratuite de Divinité"
            }
          ]
        },
        {
          "when": {
            "divinity": "alabor",
            "patron": "vephar"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Vephar — Brumes",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Ambiguïté et approche indirecte. Faveur — Brume de Scylla : 1 PA, 1/scène, brume de 5 m pour la scène ; −3 perceptions et tirs qui la traversent, sans malus pour le Daemon."
            }
          ]
        },
        {
          "when": {
            "divinity": "alabor",
            "patron": "forneus"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Forneus — Vagues",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Ténacité, avancer puis revenir. Faveur — Élan de la vague : 1/scène après un Déplacement, effectuer immédiatement un second Déplacement ou repousser fortement une cible touchée."
            }
          ]
        },
        {
          "when": {
            "divinity": "alabor",
            "patron": "zagan"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Zagan — Pression",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Force contenue et patience écrasante. Faveur — Pression distribuée : 1/scène, appliquer la contrainte/poussée d’un pouvoir de Pression à une seconde cible proche, sans dégâts supplémentaires."
            }
          ]
        },
        {
          "when": {
            "divinity": "alabor",
            "patron": "shax"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Shax — Pluie",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Fertilité et cruauté, donner ou retirer l’eau. Faveur — Pluie révélatrice : 1/scène dans une pluie, les silhouettes/mouvements physiques sont révélés pendant un round et les dissimulations visuelles légères ne protègent pas du Daemon."
            }
          ]
        },
        {
          "when": {
            "divinity": "astaroth",
            "patron": "ardat_lili"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Ardat-Lili — Arts",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Création, beauté et inspiration. Faveur — Inspiration contagieuse : création artistique DR 2+, 1/scène, un observateur touché reçoit +2 à son prochain test cohérent avec l’idée/émotion transmise."
            }
          ]
        },
        {
          "when": {
            "divinity": "astaroth",
            "patron": "byleth"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Byleth — Inventivité",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Expérimentation et innovation. Faveur — Prototype : 1/scénario, improviser depuis des composants plausibles un outil temporaire répondant à un besoin précis ; Prendre son temps sans le délai normal, prototype fragile/limité."
            }
          ]
        },
        {
          "when": {
            "divinity": "astaroth",
            "patron": "asmodee"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Asmodée — Mathématiques",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Formaliser et opposer la logique d’un phénomène. Faveur — Mise en équation : Réaction 1/scène, +3 Défense occulte contre un pouvoir ciblé ; après usage, comprendre sa structure logique générale sans apprendre ses Talents."
            }
          ]
        },
        {
          "when": {
            "divinity": "astaroth",
            "patron": "morax"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Morax — Médecine",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Science médicale et observation clinique. Faveur — Diagnostic du Duc : après 1 PA d’examen, connaître la principale cause médicale accessible ; le prochain test de Soins correspondant bénéficie de Prendre son temps sans délai."
            }
          ]
        },
        {
          "when": {
            "divinity": "astaroth",
            "patron": "alocer"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Alocer — Informatique",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Information numérique, architecture et réseaux. Faveur — Chemin de code : 1/scène, après un test informatique réussi, obtenir en plus une information structurelle utile sur le système."
            }
          ]
        },
        {
          "when": {
            "divinity": "belial",
            "patron": "marchosias"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Marchosias — Victoire",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Courage, loyauté, persévérance. Faveur — Victoire arrachée : 1/scène, un échec de 3 points ou moins devient une réussite simple DR 0 ; jamais sur Échec narratif."
            }
          ]
        },
        {
          "when": {
            "divinity": "belial",
            "patron": "demona"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Demona — Destruction",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Pragmatisme et efficacité. Faveur — Démolition méthodique : après 1 PA d’observation d’un objet/structure/barrière/protection, le MJ indique la partie accessible dont la destruction aura la conséquence fonctionnelle la plus importante."
            }
          ]
        },
        {
          "when": {
            "divinity": "diablo",
            "patron": "xezbeth"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Xezbeth — Cauchemars",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Renseignement par la peur et mensonges obsédants. Faveur — Rêve empoisonné : après une peur/illusion réussie, 1/scène, marquer la victime ; son prochain sommeil reprend le thème et peut contenir un message simple."
            }
          ]
        },
        {
          "when": {
            "divinity": "diablo",
            "patron": "balam"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Balam — Peur",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Faire face au danger et imposer sa présence. Faveur — Dogue noir : 1/scène lorsqu’un adversaire visible engage volontairement au contact, test occulte ; sur échec la cible doit garder ses distances ou subit −3 à sa première attaque contre le Daemon."
            }
          ]
        },
        {
          "when": {
            "divinity": "diablo",
            "patron": "amon"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Amon — Obscurité",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Absorber ce qui s’oppose à la Nuit. Faveur — Mange-lumière : Réaction 1/scène contre lumière/solaire, +3 à la Défense ; si résistance réussie, la manifestation est aussi affaiblie/éteinte quand possible."
            }
          ]
        },
        {
          "when": {
            "divinity": "diablo",
            "patron": "anammalech"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Anammalech — Nuit",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Discrétion et présence dans les coulisses. Faveur — Ombre de la Nuit : 1/scène dans une obscurité réelle et sans action hostile, les perceptions surnaturelles cherchant simplement le Daemon doivent battre sa Furtivité."
            }
          ]
        },
        {
          "when": {
            "divinity": "lilith",
            "patron": "meririm"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Meririm — Charme",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Liberté sexuelle, plaisir, absence de honte. Faveur — Accueil de Meririm : 1/scène, envers une personne éprouvant déjà attirance/affection/désir, savoir si une demande précise serait acceptée, refusée ou négociable et quelle limite bloque."
            }
          ]
        },
        {
          "when": {
            "divinity": "lilith",
            "patron": "babalon"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Babalon — Fertilité",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Corps souverain et biologie comme puissance. Faveur — Cycle parfait : 1/scène avec un Talent de Fertilité/Chair, ignorer un obstacle biologique ordinaire ; jamais une protection surnaturelle/divine."
            }
          ]
        },
        {
          "when": {
            "divinity": "lilith",
            "patron": "gusoyn"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Gusoyn — Manipulation",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Comprendre les rapports humains et utiliser les désirs plutôt que contraindre. Faveur — Levier intime : après 1 PA d’observation, le MJ indique le principal levier émotionnel/social perceptible ; une action réellement pertinente peut recevoir le bonus circonstanciel normal."
            }
          ]
        },
        {
          "when": {
            "divinity": "lilith",
            "patron": "sytry"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Sytry — Secrets féminins",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Intimité, désir féminin, discrétion et renseignement. Faveur — Secret du désir : 1/scène, sur une cible de physiologie féminine, Voir le désir peut révéler un désir enfoui ou consciemment retenu."
            }
          ]
        },
        {
          "when": {
            "divinity": "mammon",
            "patron": "alastor"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Alastor — Souffrance",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "La douleur comme mémoire d’une vie. Faveur — Écho de douleur : 1/scène contre une cible ayant déjà perdu des PV, attaque occulte ; réussite : −3 à sa prochaine action."
            }
          ]
        },
        {
          "when": {
            "divinity": "mammon",
            "patron": "abrahel"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Abrahel — Âge",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Tout se dégrade et finit. Faveur — Mémoire du corps : 1/scène au contact, lire âge biologique, altérations de vieillissement/rajeunissement et principales séquelles du temps ; le prochain Talent de Vieillesse peut cibler précisément une faiblesse."
            }
          ]
        },
        {
          "when": {
            "divinity": "mammon",
            "patron": "apollyon"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Apollyon — Destruction",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Ce qui doit mourir doit pouvoir être brisé. Faveur — Mort des choses : 1/scène, une attaque contre objet/structure/construction surnaturelle ignore 3 Protection."
            }
          ]
        },
        {
          "when": {
            "divinity": "mammon",
            "patron": "eurynome"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Eurynome — Repos",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Mort paisible, psychopompie et fin de la souffrance. Faveur — Repos accordé : 1/scène, 1 PA au contact, mettre fin à peur/douleur/agitation surnaturelle sur une cible consentante si la cause immédiate a disparu."
            }
          ]
        },
        {
          "when": {
            "divinity": "mephisto",
            "patron": "crocell"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Crocell — Parole",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Rhétorique, répartie et influence publique. Faveur — Répartie de Crocell : Réaction 1/scène après une action sociale réussie contre le Daemon, effectuer immédiatement un test social opposé ; résultat supérieur annule l’effet."
            }
          ]
        },
        {
          "when": {
            "divinity": "mephisto",
            "patron": "abrasax"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Abrasax — Magie",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Étudier les systèmes occultes. Faveur — Leçon de Merlin : 1/scène, réduire d’un niveau la difficulté intrinsèque d’un usage du Spectre de Mageius, minimum 12 ; jamais la Défense d’une cible."
            }
          ]
        },
        {
          "when": {
            "divinity": "mephisto",
            "patron": "paimon"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Paimon — Mensonge",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Mensonge cohérent et défendable. Faveur — Mensonge parfait : 1/scène après un mensonge réussi, toute capacité surnaturelle voulant établir que l’affirmation était mensongère doit battre le résultat original."
            }
          ]
        },
        {
          "when": {
            "divinity": "mephisto",
            "patron": "vinea"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Vinea — Vérité",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "La réalité importe. Faveur — Faux reconnu : 1/scène en entendant une affirmation factuelle, savoir si l’orateur ment volontairement ; ne révèle pas la vérité."
            }
          ]
        },
        {
          "when": {
            "divinity": "satan",
            "patron": "samael"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Samael — Sentence",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Enquêter avant de condamner. Faveur — Dossier clos : après culpabilité confirmée par Jugement, 1/scène, marquer la cible pour la scène ; les Talents de Sentence n’ont plus à réétablir cette culpabilité."
            }
          ]
        },
        {
          "when": {
            "divinity": "satan",
            "patron": "cali"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Cali — Vengeance",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Dette, poursuite et représailles ciblées. Faveur — Poursuite de Cali : lorsqu’une créature blesse volontairement le Daemon ou un protégé, 1/scène, ressentir sa direction approximative et si elle s’éloigne/se rapproche dans la zone générale."
            }
          ]
        },
        {
          "when": {
            "divinity": "satan",
            "patron": "barbatos"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Barbatos — Paix",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Maîtrise de soi et ordre durable. Faveur — Paix intérieure : 1/scène, une personne proche peut retenter avec +3 un test pour sortir de Frénésie, rage, peur ou perte de contrôle émotionnelle."
            }
          ]
        },
        {
          "when": {
            "divinity": "satan",
            "patron": "acham"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Acham — Jugement",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Intégrité, preuve et justice morale. Faveur — Œil du magistrat : 1/scène en enquête/interrogatoire, demander quelle contradiction, dissimulation de preuve ou incohérence perceptible est la plus importante."
            }
          ]
        },
        {
          "when": {
            "divinity": "lucifer",
            "patron": "adramalech"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Adramalech — Rayonnement",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Gloire et présence étendue. Faveur — Rayonnement : 1/scène, doubler portée ou rayon d’un pouvoir ; jamais dégâts ni nombre de cibles choisies individuellement."
            }
          ]
        },
        {
          "when": {
            "divinity": "lucifer",
            "patron": "abalim"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Abalim — Splendeur",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Majesté et beauté solaire. Faveur — Splendeur du Soleil : à Révélation complète, 1/scène, ennemis proches opposent Défense occulte ; échec : −3 à leurs actions directement hostiles jusqu’à la fin du prochain round."
            }
          ]
        },
        {
          "when": {
            "divinity": "belzebuth",
            "patron": "persephone"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Perséphone — Régénération",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Médecine et préservation de la vie. Faveur — Deuxième printemps : 1/scénario, une cible déjà saturée par une guérison de Belzébuth peut récupérer jusqu’à 2 PV supplémentaires."
            }
          ]
        },
        {
          "when": {
            "divinity": "belzebuth",
            "patron": "baphomet"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Baphomet — Évolution",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Corps modifiable, adaptation et expérimentation. Faveur — Sélection immédiate : 1/scène à la première exposition à un danger environnemental/poison/maladie/condition physique, +3 pour résister ; réussite peut produire une adaptation mineure pour la scène."
            }
          ]
        },
        {
          "when": {
            "divinity": "abigor",
            "patron": "astarte"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Astarté — Lune",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Espionnage mondain, cycles, beauté et pouvoir indirect. Faveur — Clarté lunaire : vision parfaite sous ciel nocturne ; 1/scène sous lumière lunaire, relancer son d10e et garder le second résultat."
            }
          ]
        },
        {
          "when": {
            "divinity": "abigor",
            "patron": "furfur"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Furfur — Typhons",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Mobilité, technologie militaire, frapper puis disparaître. Faveur — Momentum du Typhon : 1/scène après au moins un Déplacement normal dans le round, prochaine attaque du round +3 DGT."
            }
          ]
        },
        {
          "when": {
            "divinity": "baal",
            "patron": "ereshkigal"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Ereshkigal — Meurtre",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Neutraliser vite, efficacité létale. Faveur — Premier sang : 1/scène, attaque contre une cible Surprise ou ignorant la présence du Daemon +3 DGT."
            }
          ]
        },
        {
          "when": {
            "divinity": "baal",
            "patron": "leraje"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Leraje — Blessures",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Précision et rendre chaque coup coûteux. Faveur — Blessure aggravée : 1/scène après avoir infligé des PV, la cible perd 2 PV supplémentaires à la fin de son prochain round sauf 1 PA consacré à stopper l’aggravation."
            }
          ]
        },
        {
          "when": {
            "divinity": "baal",
            "patron": "focalor"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Focalor — Dignité",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Insoumission et refus de plier. Faveur — Dignité humaine : +3 Défense occulte contre les pouvoirs imposant explicitement soumission, obéissance, humiliation ou servitude."
            }
          ]
        },
        {
          "when": {
            "divinity": "morrighan",
            "patron": "nemain"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Nemain — Frénésie",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Fureur contrôlée et instinct de bataille. Faveur — Premier hurlement : en entrant en Frénésie, 1/scène, +3 à la première action physique avant la fin du prochain round."
            }
          ]
        },
        {
          "when": {
            "divinity": "morrighan",
            "patron": "huginn"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Huginn — Pensée",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Observation et stratégie. Faveur — Pensée fulgurante : 1/scène sur un test d’Esprit/réflexion, bénéficier de Prendre son temps sans consacrer le temps supplémentaire."
            }
          ]
        },
        {
          "when": {
            "divinity": "morrighan",
            "patron": "ibn_al_berih"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Ibn al-Berih — Malheur",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Attendre l’erreur. Faveur — Mauvais présage : Réaction 1/scène, faire relancer à une cible visible son d10e après une réussite ; elle garde le second résultat."
            }
          ]
        },
        {
          "when": {
            "divinity": "morrighan",
            "patron": "nankilslas"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Nankil’slas — Tromperie",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Plans indirects et fausses identités. Faveur — Identité mouvante : 1/scène, après observation d’un milieu social, adopter une couverture plausible et ignorer pour la scène un malus de statut dû uniquement à l’absence d’appartenance."
            }
          ]
        },
        {
          "when": {
            "divinity": "morrighan",
            "patron": "rhiannon"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Rhiannon — Colère",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Répondre à l’agression. Faveur — Courroux de Boadicée : après avoir subi des dégâts, 1/scène, +3 à la prochaine action directement contre l’auteur."
            }
          ]
        },
        {
          "when": {
            "divinity": "morrighan",
            "patron": "cuchulainn"
          },
          "traits": [
            {
              "name": "Faveur de Maisonnée — Cúchulainn — Courage",
              "access": "Gratuit",
              "source": "Patron daemoniaque",
              "effect": "Héroïsme frontal et protection. Faveur — Courage du Héros : 1/scène, 1 PA, alliés proches +3 contre peur et intimidation surnaturelle jusqu’à la fin du prochain round."
            }
          ]
        }
      ]
    },
    "angelus": {
      "id": "angelus",
      "name": "Angelus",
      "description": "Les Angelus descendent de créatures artificielles d’Aèr transcendées par Elynea jusqu’à devenir des individus reliés à l’Arbre de Vie. Leur incarnation terrestre constitue une vraie vie : famille, métier et convictions ne disparaissent pas lorsque reviennent des souvenirs célestes plus anciens. Nature angélique, Sephirah, Archange lié et école séraphique sont des couches distinctes d’une Transcendance qui n’impose ni obéissance automatique des religions humaines ni personnalité unique.",
      "choices": [
        {
          "key": "angelNature",
          "label": "Nature angélique",
          "optional": false,
          "options": [
            {
              "id": "trone",
              "name": "Trône",
              "description": "Le Trône est juge, chasseur et enquêteur spirituel. Il observe, poursuit, identifie et marque avant de condamner : ses pouvoirs privilégient la lecture de l’âme, la traque et la vulnérabilisation d’une cible plutôt que sa destruction immédiate."
            },
            {
              "id": "vertu",
              "name": "Vertu",
              "description": "La Vertu agit sur passions, vices, blessures intérieures et purification. Elle peut apaiser, absorber, soigner ou réinjecter ce qu’elle a contenu ; cette Nature angélique est volontairement ambiguë, car la même maîtrise des émotions peut devenir secours ou arme."
            },
            {
              "id": "domination",
              "name": "Domination",
              "description": "La Domination est l’exécuteur céleste. Plus prédateur ciblé que guerrier de ligne, elle identifie une proie, crée sa fenêtre d’attaque puis concentre sa Transcendance sur l’élimination rapide d’une menace précise."
            }
          ]
        },
        {
          "key": "sephirah",
          "label": "Sephirah",
          "optional": false,
          "options": [
            {
              "id": "kether",
              "name": "Kether — Couronne",
              "description": "Kether, la Couronne, porte domination, conscience et unité. Sa Transcendance relie volontés et perceptions autour d’un centre commun : commander, partager et faire agir plusieurs êtres comme un ensemble sont ses grands motifs."
            },
            {
              "id": "hokhma",
              "name": "Hokhma — Sagesse",
              "description": "Hokhma, la Sagesse, porte sagesse, pureté et magie. Elle colore l’Angelus d’une recherche de clarté et de résistance à ce qui corrompt ou déforme l’âme, avec une affinité particulière pour la compréhension des puissances spirituelles."
            },
            {
              "id": "bina",
              "name": "Bina — Compréhension",
              "description": "Bina, la Compréhension, porte intellect, structure et destin. Elle pousse l’Angelus à voir les limites, les causes et les formes qui organisent une situation plutôt qu’à seulement réagir à ses effets visibles."
            },
            {
              "id": "hesed",
              "name": "Hesed — Miséricorde",
              "description": "Hesed, la Miséricorde, porte guérison, créativité et grâce. Sa puissance cherche l’issue qui restaure, protège ou offre une seconde chance, sans pour autant interdire la fermeté lorsque sauver exige d’agir."
            },
            {
              "id": "gueburah",
              "name": "Gueburah — Force",
              "description": "Gueburah, la Force, porte justice et guerre. Sa Transcendance transforme la puissance physique ou spirituelle en acte décisif : frapper, tenir, imposer une limite ou défendre ce qui a été jugé digne de l’être."
            },
            {
              "id": "tiphereth",
              "name": "Tiph’Ereth — Beauté",
              "description": "Tiph’Ereth porte foi, dévotion et sacrifice. Elle donne du poids aux engagements et à ce que l’Angelus accepte réellement d’offrir de lui-même, jusqu’à faire de la fidélité à une personne, une cause ou un principe une force métaphysique."
            },
            {
              "id": "nesah",
              "name": "Nesah — Victoire",
              "description": "Nesah porte amour, succès et sexualité. Sa Transcendance touche au désir d’aboutir, aux liens qui poussent à continuer et à la capacité d’entraîner une réussite au-delà de l’individu isolé."
            },
            {
              "id": "hod",
              "name": "Hod — Gloire",
              "description": "Hod porte savoir, science et grandeur. Elle favorise compréhension, méthode et illumination intellectuelle : l’Angelus ne reçoit pas gratuitement toute réponse, mais sa relation à la connaissance devient elle-même une voie de puissance."
            },
            {
              "id": "yessod",
              "name": "Yessod — Fondation",
              "description": "Yessod porte rêves, illusion et imagination. Sa Transcendance agit sur les images mentales et les formes perçues, non pour transformer toute chose en mensonge mais pour donner une réalité opératoire à ce qui naît d’abord dans l’esprit."
            },
            {
              "id": "malkhouth",
              "name": "Malkhouth — Royaume",
              "description": "Malkhouth porte mort, monde physique et poids. Elle ancre la Transcendance dans ce qui est matériel, présent et difficile à déplacer : incarnation, gravité, frontières et continuité du corps deviennent ses grands thèmes."
            }
          ]
        },
        {
          "key": "archangel",
          "label": "Archange lié",
          "optional": false,
          "dependsOn": "sephirah",
          "options": [],
          "optionsBy": {
            "kether": [
              {
                "id": "remiel",
                "name": "Remiel",
                "description": "Essence des Cieux — SR/R. Choisir Vent, Eau ou Foudre. 2 Aura, 1/round : attaque physique DGT 6, poussée/déplacement significatif ou manipulation environnementale cohérente."
              },
              {
                "id": "metatron",
                "name": "Metatron",
                "description": "Forge céleste — Kether, SR/R, 1 PA, 2 Aura. Créer pour la scène un objet solide simple de lumière transcendée dont forme et fonction sont réellement comprises."
              }
            ],
            "hokhma": [
              {
                "id": "gabrielle",
                "name": "Gabrielle",
                "description": "Parole céleste — SR/R, 1 PA, 2 Aura. +3 à une prise de parole destinée à convaincre/expliquer/exhorter/négocier ; le sens général traverse les langues sans contrainte mentale."
              },
              {
                "id": "manakielle",
                "name": "Manakielle",
                "description": "Connexion de connaissance — Hokhma, SR/R, 1 PA, 2 Aura. Poser une question factuelle précise sur quelque chose qu’une cible sait réellement ; opposition si elle résiste."
              }
            ],
            "bina": [
              {
                "id": "barachiel",
                "name": "Barachiel",
                "description": "Bénédiction — SR/R, 1 PA, 2 Aura. Une autre créature reçoit une Assistance céleste +2 sur le premier test de son choix jusqu’à la fin de son prochain round, même en combat."
              },
              {
                "id": "razielle",
                "name": "Razielle",
                "description": "Là où se cache le secret — Bina, SR/R, 1 PA, 2 Aura. Examiner personne/lieu/objet/documents : sur réussite, révéler la nature du secret important et une voie permettant potentiellement de l’atteindre."
              }
            ],
            "hesed": [
              {
                "id": "raphael",
                "name": "Raphael",
                "description": "Restauration parfaite — passif SR/R. +3 contre maladies, poisons et altérations internes ; 1/scène lorsqu’un pouvoir rend des PV, retirer aussi une conséquence physique secondaire cohérente."
              },
              {
                "id": "tsadqiel",
                "name": "Tsadqiel",
                "description": "Pardon accordé — Hesed, SR/R, 1 PA, 2 Aura, 1/scène/cible. Sur une cible sincèrement accablée : supprimer Tendu/Paniqué de culpabilité ou tenter de briser un effet surnaturel fondé sur culpabilité/rétribution."
              }
            ],
            "gueburah": [
              {
                "id": "michel",
                "name": "Michel",
                "description": "Rien à craindre — SR/R, Réaction 2 Aura, 1/scène. Ignorer intégralement pour la scène un effet surnaturel de peur/terreur/intimidation qui devrait imposer état, fuite ou perte d’action."
              },
              {
                "id": "selaphielle",
                "name": "Selaphielle",
                "description": "Relève — Gueburah, SR/R, Réaction 1 PA, 2 Aura, 1/scène. Définir un devoir ; lorsqu’un allié échoue à une action indispensable à ce devoir, se déplacer à demi et tenter soi-même la tâche si possible."
              }
            ],
            "tiphereth": [
              {
                "id": "zophielle",
                "name": "Zophielle",
                "description": "Regard de Splendeur — SR/R, 1 PA, 2 Aura. Charisme + Influence contre Défense occulte : Captivée pour la scène, +3 social et forte hésitation à porter un coup de grâce."
              },
              {
                "id": "sachielle",
                "name": "Sachielle",
                "description": "Charité céleste — Tiph’Ereth, SR/R, 2 PA, 3 Aura, 1/scène. Confier à une cible consentante un Talent actif de Nature/Sephira à 1 PTV pour une utilisation dans la scène, sous limites strictes."
              }
            ],
            "nesah": [
              {
                "id": "azazel",
                "name": "Azazel",
                "description": "Frontière céleste — R, 1 PA, 2 Aura. Barrière de lumière 3×3 m à 15 m : Protection 6, 6 PV, une seule active pour la scène."
              },
              {
                "id": "hanaelle",
                "name": "Hanaelle",
                "description": "Intimité souveraine — Nesah, SR/R. Percevoir le consentement immédiat réel/absent/altéré dans une interaction romantique/sexuelle ; 1/scène peut tenter de briser une contrainte surnaturelle de désir."
              }
            ],
            "hod": [
              {
                "id": "urielle",
                "name": "Urielle",
                "description": "Lumière du Phénix — SR/R. En R, feu/chaleur ordinaires ne réduisent pas sous 1 PV ; 2 Aura pour manipuler lumière/chaleur, attaque directe DGT 6 pour 1 PA."
              },
              {
                "id": "sandalphon",
                "name": "Sandalphon",
                "description": "Grandeur déployée — Hod, SR/R, 1/scène. Pour 2 Aura lors d’un pouvoir non dommageable : doubler portée, rayon/zone ou nombre maximal de cibles ; jamais les dégâts/DR/durée/ressources."
              }
            ],
            "yessod": [
              {
                "id": "camaelle",
                "name": "Camaelle",
                "description": "Éclair de colère — SR/R, Réaction, 3 Aura, 1/scène. Obtenir immédiatement +1 PA à dépenser avant la fin du round."
              },
              {
                "id": "mebahel",
                "name": "Mebahel",
                "description": "Parole vraie — Yessod, SR/R, 1 PA, 2 Aura. Une cible vaincue en opposition ne peut volontairement prononcer une affirmation qu’elle sait fausse jusqu’à la fin de son prochain round."
              }
            ],
            "malkhouth": [
              {
                "id": "azrael",
                "name": "Azrael",
                "description": "Blessure de l’âme — SR/R, Réaction 1/round. Après une attaque réussie qui inflige des dégâts, 2 Aura pour ignorer jusqu’à 3 Armure/Protection applicable."
              },
              {
                "id": "muriel",
                "name": "Muriel",
                "description": "Rupture nourricière — Malkhouth, R, passif, 1/scène. Quand l’Angelus provoque directement une mort significative séparant réellement âme et corps, récupérer 3 Aura."
              }
            ]
          }
        },
        {
          "key": "seraph",
          "label": "Séraphin patron",
          "optional": false,
          "dependsOn": "archangel",
          "options": [],
          "optionsBy": {
            "remiel": [
              {
                "id": "purim",
                "name": "Purim — Jugement dernier",
                "description": "Faute accumulée — SR/R, 1/scène. Marquer Fautive une cible qui commet volontairement un acte grave ; son prochain échec de Défense occulte contre l’Angelus la rend aussi Tendue jusqu’à la fin de son prochain round."
              },
              {
                "id": "ochotiel",
                "name": "Ochotiel — Pesanteur",
                "description": "Poids intérieur — SR/R, 1/scène. Après un échec de Défense occulte contre un pouvoir de l’Angelus : Déplacement ÷2 et aucun bond/vol/déplacement surnaturel jusqu’à la fin du prochain round."
              }
            ],
            "metatron": [
              {
                "id": "aralim",
                "name": "Aralim — Construction",
                "description": "Plan incarné — R, 2 Aura, 1/scène. Après étude réelle du plan d’une structure, matérialiser pour la scène une portion fonctionnelle simple jusqu’à environ 3 m."
              }
            ],
            "gabrielle": [
              {
                "id": "belohim",
                "name": "Belohim — Volonté",
                "description": "Jusqu’au bout — SR/R, 1/scène. Déclarer une action : douleur, peur, Tendu/Paniqué, intimidation et distraction émotionnelle ne peuvent faire perdre ni pénaliser cette action ; incapacité physique demeure."
              },
              {
                "id": "arathim",
                "name": "Arathim — Loi",
                "description": "Qualification céleste — SR/R. Après une action, déterminer si elle viole réellement une règle/serment/contrat/loi précise connue ; 1/scène, en agissant immédiatement pour la faire respecter, ignorer une complication sociale/juridique secondaire empêchant seulement l’intervention."
              }
            ],
            "manakielle": [
              {
                "id": "siloelle",
                "name": "Siloelle — Énergie",
                "description": "Réserve vive — SR/R, 1/scène. Commencer son round à 0 Aura : récupérer immédiatement 2 Aura sans PA, jusqu’au maximum."
              }
            ],
            "barachiel": [
              {
                "id": "assim",
                "name": "Assim — Planification",
                "description": "Contingence — SR/R, 1/scène. Pendant une vraie préparation, définir un événement plausible et une réponse simple préparée ; au déclenchement, une personne désignée obtient demi-déplacement en Réaction ou manipulation simple préparée."
              },
              {
                "id": "razael",
                "name": "Razael — Sagesse",
                "description": "Le moindre mal — SR/R, 1/scénario. Face à plusieurs solutions réellement comprises, demander laquelle causera vraisemblablement le moins de souffrance/pertes ; pas de prescience absolue."
              }
            ],
            "razielle": [
              {
                "id": "jessim",
                "name": "Jessim — Mystique",
                "description": "Incertitude — SR/R, Réaction 2 Aura, 1/scène. Après réussite d’un pouvoir surnaturel visible utilisant 1d10e, forcer son utilisateur à relancer seulement le d10e et garder le second résultat."
              }
            ],
            "raphael": [
              {
                "id": "hazel",
                "name": "Hazel — Sel / Larmes",
                "description": "Les choses vont mal — SR/R, 1/scène. Une cible proche venant de subir une vraie déception/perte/souffrance émotionnelle devra relancer son d10e lors de sa prochaine réussite avant la fin de son prochain round et garder le second résultat."
              },
              {
                "id": "sobronielle",
                "name": "Sobronielle — Créativité",
                "description": "Détour créatif — SR/R, 1/scène. Proposer une Compétence différente de celle normalement attendue en expliquant une approche réellement créative et crédible ; validation MJ."
              }
            ],
            "tsadqiel": [
              {
                "id": "rubiel",
                "name": "Rubiel — Pureté",
                "description": "Légèreté de l’innocent — SR/R, 1 Aura, 1/scène. Une cible consentante non Tendue/Paniquée : Déplacement ×2, ignore terrain difficile et pénalités ordinaires de poids/fatigue/encombrement, amortit une chute raisonnable jusqu’au prochain round."
              }
            ],
            "michel": [
              {
                "id": "esdrael",
                "name": "Esdrael — Sang",
                "description": "Sang révélé — SR/R. Mémoriser pour la scène une signature sanguine visible ; reconnaître ce sang, suivre une trace réelle sans test ordinaire et distinguer une fausse piste. Une signature à la fois."
              },
              {
                "id": "graphiel",
                "name": "Graphiel — Épée de Dieu",
                "description": "Arme sacrée — R. Pour 1 Aura, une arme réelle tenue devient divine pour la scène, incassable par force ordinaire et rappelable en main pour 1 Aura si simplement désarmée ; aucun bonus DGT."
              }
            ],
            "selaphielle": [
              {
                "id": "bethel",
                "name": "Bethel — Métal",
                "description": "Métal docile — R, 1 PA, 1 Aura. Au contact, rendre un métal non vivant malléable environ une minute puis conserver la nouvelle forme ; opposition si objet porté/tenu par un adversaire."
              }
            ],
            "zophielle": [
              {
                "id": "georah",
                "name": "Georah — Passion",
                "description": "Feu intérieur — SR/R, 1/scène. Une cible consentante nomme une passion/objectif réel ; une fois dans la scène elle peut ignorer jusqu’à la fin de son action un effet de peur/découragement/douleur/manipulation qui l’empêcherait directement de le poursuivre."
              },
              {
                "id": "thirielle",
                "name": "Thirielle — Charme",
                "description": "Seconde impression — SR/R, 1/scène. Après un échec social non narratif, l’attitude de la cible ne se dégrade pas à cause de cet échec et une seconde tentative est admise si la fiction le permet."
              }
            ],
            "sachielle": [
              {
                "id": "chiloel",
                "name": "Chiloel — Résignation",
                "description": "À quoi bon ? — SR/R, Réaction 2 Aura, 1/scène. Après l’échec important d’une cible visible, opposition occulte : réussite = elle ne peut volontairement retenter exactement le même objectif jusqu’à la fin de son prochain round."
              }
            ],
            "azazel": [
              {
                "id": "nehemiel",
                "name": "Nehemiel — Haine",
                "description": "Amour retourné — SR/R, Réaction 2 Aura, 1/scène. Après avoir résisté à un effet de désir/charme/amour/attachement/séduction, retourner une version cohérente de l’effet contre son auteur si réversible."
              },
              {
                "id": "hassiel",
                "name": "Hassiel — Défense",
                "description": "Rien ne passe — SR/R, Réaction 2 Aura, 1/scène. Lorsqu’un effet ciblé visible est arrêté par la Défense de l’Angelus, protéger aussi une seconde cible adjacente qui aurait subi le même effet."
              }
            ],
            "hanaelle": [
              {
                "id": "phanaelle",
                "name": "Phanaelle — Prudence",
                "description": "Pas cette fois — SR/R, Réaction 1 Aura, 1/scène. Lorsqu’une action hostile est déclarée directement contre l’Angelus avant le jet, se déplacer immédiatement de 2 m vers une position valide ; l’action est résolue depuis la nouvelle situation."
              }
            ],
            "urielle": [
              {
                "id": "danael",
                "name": "Danael — Flammes",
                "description": "Feu repris — R, Réaction, 1/scène. Lorsqu’un feu réel non divin supérieur devrait blesser l’Angelus ou une cible adjacente : réduire les dégâts finaux de 3 et récupérer 1 Aura si au moins 1 dégât est annulé."
              },
              {
                "id": "agriel",
                "name": "Agriel — Lumière céleste",
                "description": "Reflet fugitif — R, Réaction 1 Aura, 1/round. Après une Défense active physique réussie contre une attaque exigeant la localisation précise du corps, se déplacer immédiatement de 2 m vers une position valide."
              }
            ],
            "sandalphon": [
              {
                "id": "pergamin",
                "name": "Pergamin — Persévérance",
                "description": "Continue — SR/R, Réaction 1 Aura, 1/scène. Lorsqu’une action en cours d’un allié visible est interrompue extérieurement, les PA/progrès déjà investis ne sont pas perdus et l’action peut être reprise."
              }
            ],
            "camaelle": [
              {
                "id": "jachim",
                "name": "Jachim — Orage",
                "description": "Onde de tonnerre — R, 1 Aura, 1/round. Avec Impulsion céleste ou Éclair de colère, produire une détonation en fin de mouvement pouvant repousser une créature à 2 m sur échec de Défense physique ; aucun dégât."
              },
              {
                "id": "sabbathiel",
                "name": "Sabbathiel — Colère",
                "description": "Corps de rage — R, 1/scène. Jusqu’au début du prochain round : Armure 3, +2 DGT physiques, puis 2 PV irréductibles ; aucune action demandant calme/délicatesse/patience."
              }
            ],
            "mebahel": [
              {
                "id": "henael",
                "name": "Henael — Avertissement",
                "description": "Je t’avais prévenu — SR/R, Réaction 2 Aura, 1/scène. Avertir un allié visible juste avant un danger immédiat non identifié : il n’est pas Surpris et peut interrompre/modifier son action si physiquement possible."
              }
            ],
            "azrael": [
              {
                "id": "barabbiel",
                "name": "Barabbiel — Âmes",
                "description": "Écho des vaincus — SR/R, 1/scénario. Après la mort dans la scène d’une créature dotée d’une âme directement affrontée, conserver un Écho jusqu’à la fin du scénario ; plus tard 1 PA + 1 Aura pour poser une question, reconnaître un élément ou manifester brièvement sa silhouette."
              },
              {
                "id": "pithormim",
                "name": "Pithormim — Clé des Enfers",
                "description": "Sens des seuils — SR/R. Détecter à proximité portail/fissure/passage dimensionnel ou sceau qui en retient un ; 1/scène au contact, +3 pour fermer/stabiliser/maintenir/empêcher son ouverture."
              }
            ],
            "muriel": [
              {
                "id": "osael",
                "name": "Osael — Colère",
                "description": "Ne me tourne pas le dos — R, Réaction 1 Aura, 1/scène. Une cible visible qui inflige des dégâts devient l’Objet de la Colère pour la scène ; 1/round lorsqu’elle s’éloigne, l’Angelus peut se déplacer immédiatement de 2 m vers elle."
              }
            ]
          }
        }
      ],
      "baseFreeTraits": [
        {
          "name": "Âme transcendée",
          "access": "V/SR/R",
          "effect": "À la destruction de l’incarnation, l’âme retourne vers le Paradis par l’Arbre de Vie."
        },
        {
          "name": "Yeux célestes",
          "access": "SR/R",
          "effect": "Perçoit formes véritables, illusions et transformations occultes."
        },
        {
          "name": "Ailes transcendées",
          "access": "R",
          "effect": "Déploie des ailes d’énergie."
        }
      ],
      "freeTraitRules": [
        {
          "when": {
            "angelNature": "trone"
          },
          "traits": [
            {
              "name": "Télépathie céleste",
              "access": "SR/R · 1 PA · 1 Aura",
              "effect": "Communication mentale bidirectionnelle avec une cible consentante perçue pour la scène ; le sens général traverse les langues, sans lecture de pensées.",
              "source": "Pouvoir fondamental gratuit de Nature"
            }
          ]
        },
        {
          "when": {
            "angelNature": "vertu"
          },
          "traits": [
            {
              "name": "Purification",
              "access": "SR/R · 1 PA",
              "effect": "Absorber peur, rage, honte, haine, désir incontrôlable ou obsession ; peut aussi lutter contre un effet émotionnel surnaturel. Les deux premières Purifications significatives de la scène peuvent rendre chacune 1 Aura.",
              "source": "Pouvoir fondamental gratuit de Nature"
            }
          ]
        },
        {
          "when": {
            "angelNature": "domination"
          },
          "traits": [
            {
              "name": "Lame céleste",
              "access": "R · 1 PA",
              "effect": "Sacrifier 1 à 3 PV et 1 Aura : arme divine DGT 7/9/11 pour la scène. Les PV sacrifiés réduisent le maximum et ne peuvent être soignés tant que la Lame existe.",
              "source": "Pouvoir fondamental gratuit de Nature"
            }
          ]
        },
        {
          "when": {
            "sephirah": "kether"
          },
          "traits": [
            {
              "name": "Nœud de conscience",
              "access": "SR/R · 1 PA · 1 Aura",
              "effect": "Relier jusqu’à trois participants consentants à environ 100 m : position approximative, état général et intentions volontairement partagées.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "hokhma"
          },
          "traits": [
            {
              "name": "Essence pure",
              "access": "Passif · SR/R",
              "effect": "+3 contre corruption surnaturelle, possession et altération hostile de l’âme.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "bina"
          },
          "traits": [
            {
              "name": "Schéma causal",
              "access": "SR/R · 1 PA · 1 Aura",
              "effect": "Après examen d’une situation concrète, demander au MJ quel est le facteur limitant le plus évident qu’un observateur exceptionnel pourrait déduire.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "hesed"
          },
          "traits": [
            {
              "name": "Main miséricordieuse",
              "access": "SR/R · 1 PA · 1 Aura",
              "effect": "Au contact : stabiliser automatiquement, supprimer une douleur incapacitante simple jusqu’au prochain round ou rendre 1 PV.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "gueburah"
          },
          "traits": [
            {
              "name": "Impact de Gueburah",
              "access": "R",
              "effect": "1/round après une attaque physique réussie, dépenser 1 Aura pour +2 DGT ou un renversement/une projection significative.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "tiphereth"
          },
          "traits": [
            {
              "name": "Dévotion céleste",
              "access": "Passif · V/SR/R",
              "effect": "Choisir une personne, communauté, cause ou principe : +3 pour résister aux effets cherchant directement à forcer sa trahison ou son abandon.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "nesah"
          },
          "traits": [
            {
              "name": "Élan du succès",
              "access": "SR/R · 1/scène",
              "effect": "Après un échec de 2 points ou moins, dépenser 1 Aura pour transformer le résultat en réussite simple DR 0 ; jamais sur Échec narratif.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "hod"
          },
          "traits": [
            {
              "name": "Illumination",
              "access": "SR/R · 1 PA · 1 Aura",
              "effect": "1/scène, +3 à un test intellectuel, scientifique ou technique dans lequel l’Angelus possède au moins 1 point de Compétence.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "yessod"
          },
          "traits": [
            {
              "name": "Image pensée",
              "access": "SR/R · 1 PA · 1 Aura",
              "effect": "Créer pour la scène une illusion visuelle et/ou sonore simple, statique ou répétitive, dans un volume d’environ 2 m.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "malkhouth"
          },
          "traits": [
            {
              "name": "Ancrage du Royaume",
              "access": "SR/R · Réaction · 1 Aura",
              "effect": "+3 contre déplacement surnaturel forcé, téléportation hostile, bannissement ou déphasage imposé.",
              "source": "Don fondamental gratuit du Sephirah"
            }
          ]
        },
        {
          "when": {
            "sephirah": "kether",
            "archangel": "remiel"
          },
          "traits": [
            {
              "name": "Archange lié — Remiel",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Essence des Cieux — SR/R. Choisir Vent, Eau ou Foudre. 2 Aura, 1/round : attaque physique DGT 6, poussée/déplacement significatif ou manipulation environnementale cohérente."
            }
          ]
        },
        {
          "when": {
            "sephirah": "kether",
            "archangel": "metatron"
          },
          "traits": [
            {
              "name": "Archange lié — Metatron",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Forge céleste — Kether, SR/R, 1 PA, 2 Aura. Créer pour la scène un objet solide simple de lumière transcendée dont forme et fonction sont réellement comprises."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hokhma",
            "archangel": "gabrielle"
          },
          "traits": [
            {
              "name": "Archange lié — Gabrielle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Parole céleste — SR/R, 1 PA, 2 Aura. +3 à une prise de parole destinée à convaincre/expliquer/exhorter/négocier ; le sens général traverse les langues sans contrainte mentale."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hokhma",
            "archangel": "manakielle"
          },
          "traits": [
            {
              "name": "Archange lié — Manakielle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Connexion de connaissance — Hokhma, SR/R, 1 PA, 2 Aura. Poser une question factuelle précise sur quelque chose qu’une cible sait réellement ; opposition si elle résiste."
            }
          ]
        },
        {
          "when": {
            "sephirah": "bina",
            "archangel": "barachiel"
          },
          "traits": [
            {
              "name": "Archange lié — Barachiel",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Bénédiction — SR/R, 1 PA, 2 Aura. Une autre créature reçoit une Assistance céleste +2 sur le premier test de son choix jusqu’à la fin de son prochain round, même en combat."
            }
          ]
        },
        {
          "when": {
            "sephirah": "bina",
            "archangel": "razielle"
          },
          "traits": [
            {
              "name": "Archange lié — Razielle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Là où se cache le secret — Bina, SR/R, 1 PA, 2 Aura. Examiner personne/lieu/objet/documents : sur réussite, révéler la nature du secret important et une voie permettant potentiellement de l’atteindre."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hesed",
            "archangel": "raphael"
          },
          "traits": [
            {
              "name": "Archange lié — Raphael",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Restauration parfaite — passif SR/R. +3 contre maladies, poisons et altérations internes ; 1/scène lorsqu’un pouvoir rend des PV, retirer aussi une conséquence physique secondaire cohérente."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hesed",
            "archangel": "tsadqiel"
          },
          "traits": [
            {
              "name": "Archange lié — Tsadqiel",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Pardon accordé — Hesed, SR/R, 1 PA, 2 Aura, 1/scène/cible. Sur une cible sincèrement accablée : supprimer Tendu/Paniqué de culpabilité ou tenter de briser un effet surnaturel fondé sur culpabilité/rétribution."
            }
          ]
        },
        {
          "when": {
            "sephirah": "gueburah",
            "archangel": "michel"
          },
          "traits": [
            {
              "name": "Archange lié — Michel",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Rien à craindre — SR/R, Réaction 2 Aura, 1/scène. Ignorer intégralement pour la scène un effet surnaturel de peur/terreur/intimidation qui devrait imposer état, fuite ou perte d’action."
            }
          ]
        },
        {
          "when": {
            "sephirah": "gueburah",
            "archangel": "selaphielle"
          },
          "traits": [
            {
              "name": "Archange lié — Selaphielle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Relève — Gueburah, SR/R, Réaction 1 PA, 2 Aura, 1/scène. Définir un devoir ; lorsqu’un allié échoue à une action indispensable à ce devoir, se déplacer à demi et tenter soi-même la tâche si possible."
            }
          ]
        },
        {
          "when": {
            "sephirah": "tiphereth",
            "archangel": "zophielle"
          },
          "traits": [
            {
              "name": "Archange lié — Zophielle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Regard de Splendeur — SR/R, 1 PA, 2 Aura. Charisme + Influence contre Défense occulte : Captivée pour la scène, +3 social et forte hésitation à porter un coup de grâce."
            }
          ]
        },
        {
          "when": {
            "sephirah": "tiphereth",
            "archangel": "sachielle"
          },
          "traits": [
            {
              "name": "Archange lié — Sachielle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Charité céleste — Tiph’Ereth, SR/R, 2 PA, 3 Aura, 1/scène. Confier à une cible consentante un Talent actif de Nature/Sephira à 1 PTV pour une utilisation dans la scène, sous limites strictes."
            }
          ]
        },
        {
          "when": {
            "sephirah": "nesah",
            "archangel": "azazel"
          },
          "traits": [
            {
              "name": "Archange lié — Azazel",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Frontière céleste — R, 1 PA, 2 Aura. Barrière de lumière 3×3 m à 15 m : Protection 6, 6 PV, une seule active pour la scène."
            }
          ]
        },
        {
          "when": {
            "sephirah": "nesah",
            "archangel": "hanaelle"
          },
          "traits": [
            {
              "name": "Archange lié — Hanaelle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Intimité souveraine — Nesah, SR/R. Percevoir le consentement immédiat réel/absent/altéré dans une interaction romantique/sexuelle ; 1/scène peut tenter de briser une contrainte surnaturelle de désir."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hod",
            "archangel": "urielle"
          },
          "traits": [
            {
              "name": "Archange lié — Urielle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Lumière du Phénix — SR/R. En R, feu/chaleur ordinaires ne réduisent pas sous 1 PV ; 2 Aura pour manipuler lumière/chaleur, attaque directe DGT 6 pour 1 PA."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hod",
            "archangel": "sandalphon"
          },
          "traits": [
            {
              "name": "Archange lié — Sandalphon",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Grandeur déployée — Hod, SR/R, 1/scène. Pour 2 Aura lors d’un pouvoir non dommageable : doubler portée, rayon/zone ou nombre maximal de cibles ; jamais les dégâts/DR/durée/ressources."
            }
          ]
        },
        {
          "when": {
            "sephirah": "yessod",
            "archangel": "camaelle"
          },
          "traits": [
            {
              "name": "Archange lié — Camaelle",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Éclair de colère — SR/R, Réaction, 3 Aura, 1/scène. Obtenir immédiatement +1 PA à dépenser avant la fin du round."
            }
          ]
        },
        {
          "when": {
            "sephirah": "yessod",
            "archangel": "mebahel"
          },
          "traits": [
            {
              "name": "Archange lié — Mebahel",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Parole vraie — Yessod, SR/R, 1 PA, 2 Aura. Une cible vaincue en opposition ne peut volontairement prononcer une affirmation qu’elle sait fausse jusqu’à la fin de son prochain round."
            }
          ]
        },
        {
          "when": {
            "sephirah": "malkhouth",
            "archangel": "azrael"
          },
          "traits": [
            {
              "name": "Archange lié — Azrael",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Blessure de l’âme — SR/R, Réaction 1/round. Après une attaque réussie qui inflige des dégâts, 2 Aura pour ignorer jusqu’à 3 Armure/Protection applicable."
            }
          ]
        },
        {
          "when": {
            "sephirah": "malkhouth",
            "archangel": "muriel"
          },
          "traits": [
            {
              "name": "Archange lié — Muriel",
              "access": "Gratuit",
              "source": "Don archangélique",
              "effect": "Rupture nourricière — Malkhouth, R, passif, 1/scène. Quand l’Angelus provoque directement une mort significative séparant réellement âme et corps, récupérer 3 Aura."
            }
          ]
        },
        {
          "when": {
            "sephirah": "kether",
            "archangel": "remiel",
            "seraph": "purim"
          },
          "traits": [
            {
              "name": "Séraphin patron — Purim — Jugement dernier",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Faute accumulée — SR/R, 1/scène. Marquer Fautive une cible qui commet volontairement un acte grave ; son prochain échec de Défense occulte contre l’Angelus la rend aussi Tendue jusqu’à la fin de son prochain round."
            }
          ]
        },
        {
          "when": {
            "sephirah": "kether",
            "archangel": "remiel",
            "seraph": "ochotiel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Ochotiel — Pesanteur",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Poids intérieur — SR/R, 1/scène. Après un échec de Défense occulte contre un pouvoir de l’Angelus : Déplacement ÷2 et aucun bond/vol/déplacement surnaturel jusqu’à la fin du prochain round."
            }
          ]
        },
        {
          "when": {
            "sephirah": "kether",
            "archangel": "metatron",
            "seraph": "aralim"
          },
          "traits": [
            {
              "name": "Séraphin patron — Aralim — Construction",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Plan incarné — R, 2 Aura, 1/scène. Après étude réelle du plan d’une structure, matérialiser pour la scène une portion fonctionnelle simple jusqu’à environ 3 m."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hokhma",
            "archangel": "gabrielle",
            "seraph": "belohim"
          },
          "traits": [
            {
              "name": "Séraphin patron — Belohim — Volonté",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Jusqu’au bout — SR/R, 1/scène. Déclarer une action : douleur, peur, Tendu/Paniqué, intimidation et distraction émotionnelle ne peuvent faire perdre ni pénaliser cette action ; incapacité physique demeure."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hokhma",
            "archangel": "gabrielle",
            "seraph": "arathim"
          },
          "traits": [
            {
              "name": "Séraphin patron — Arathim — Loi",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Qualification céleste — SR/R. Après une action, déterminer si elle viole réellement une règle/serment/contrat/loi précise connue ; 1/scène, en agissant immédiatement pour la faire respecter, ignorer une complication sociale/juridique secondaire empêchant seulement l’intervention."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hokhma",
            "archangel": "manakielle",
            "seraph": "siloelle"
          },
          "traits": [
            {
              "name": "Séraphin patron — Siloelle — Énergie",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Réserve vive — SR/R, 1/scène. Commencer son round à 0 Aura : récupérer immédiatement 2 Aura sans PA, jusqu’au maximum."
            }
          ]
        },
        {
          "when": {
            "sephirah": "bina",
            "archangel": "barachiel",
            "seraph": "assim"
          },
          "traits": [
            {
              "name": "Séraphin patron — Assim — Planification",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Contingence — SR/R, 1/scène. Pendant une vraie préparation, définir un événement plausible et une réponse simple préparée ; au déclenchement, une personne désignée obtient demi-déplacement en Réaction ou manipulation simple préparée."
            }
          ]
        },
        {
          "when": {
            "sephirah": "bina",
            "archangel": "barachiel",
            "seraph": "razael"
          },
          "traits": [
            {
              "name": "Séraphin patron — Razael — Sagesse",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Le moindre mal — SR/R, 1/scénario. Face à plusieurs solutions réellement comprises, demander laquelle causera vraisemblablement le moins de souffrance/pertes ; pas de prescience absolue."
            }
          ]
        },
        {
          "when": {
            "sephirah": "bina",
            "archangel": "razielle",
            "seraph": "jessim"
          },
          "traits": [
            {
              "name": "Séraphin patron — Jessim — Mystique",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Incertitude — SR/R, Réaction 2 Aura, 1/scène. Après réussite d’un pouvoir surnaturel visible utilisant 1d10e, forcer son utilisateur à relancer seulement le d10e et garder le second résultat."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hesed",
            "archangel": "raphael",
            "seraph": "hazel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Hazel — Sel / Larmes",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Les choses vont mal — SR/R, 1/scène. Une cible proche venant de subir une vraie déception/perte/souffrance émotionnelle devra relancer son d10e lors de sa prochaine réussite avant la fin de son prochain round et garder le second résultat."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hesed",
            "archangel": "raphael",
            "seraph": "sobronielle"
          },
          "traits": [
            {
              "name": "Séraphin patron — Sobronielle — Créativité",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Détour créatif — SR/R, 1/scène. Proposer une Compétence différente de celle normalement attendue en expliquant une approche réellement créative et crédible ; validation MJ."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hesed",
            "archangel": "tsadqiel",
            "seraph": "rubiel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Rubiel — Pureté",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Légèreté de l’innocent — SR/R, 1 Aura, 1/scène. Une cible consentante non Tendue/Paniquée : Déplacement ×2, ignore terrain difficile et pénalités ordinaires de poids/fatigue/encombrement, amortit une chute raisonnable jusqu’au prochain round."
            }
          ]
        },
        {
          "when": {
            "sephirah": "gueburah",
            "archangel": "michel",
            "seraph": "esdrael"
          },
          "traits": [
            {
              "name": "Séraphin patron — Esdrael — Sang",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Sang révélé — SR/R. Mémoriser pour la scène une signature sanguine visible ; reconnaître ce sang, suivre une trace réelle sans test ordinaire et distinguer une fausse piste. Une signature à la fois."
            }
          ]
        },
        {
          "when": {
            "sephirah": "gueburah",
            "archangel": "michel",
            "seraph": "graphiel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Graphiel — Épée de Dieu",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Arme sacrée — R. Pour 1 Aura, une arme réelle tenue devient divine pour la scène, incassable par force ordinaire et rappelable en main pour 1 Aura si simplement désarmée ; aucun bonus DGT."
            }
          ]
        },
        {
          "when": {
            "sephirah": "gueburah",
            "archangel": "selaphielle",
            "seraph": "bethel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Bethel — Métal",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Métal docile — R, 1 PA, 1 Aura. Au contact, rendre un métal non vivant malléable environ une minute puis conserver la nouvelle forme ; opposition si objet porté/tenu par un adversaire."
            }
          ]
        },
        {
          "when": {
            "sephirah": "tiphereth",
            "archangel": "zophielle",
            "seraph": "georah"
          },
          "traits": [
            {
              "name": "Séraphin patron — Georah — Passion",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Feu intérieur — SR/R, 1/scène. Une cible consentante nomme une passion/objectif réel ; une fois dans la scène elle peut ignorer jusqu’à la fin de son action un effet de peur/découragement/douleur/manipulation qui l’empêcherait directement de le poursuivre."
            }
          ]
        },
        {
          "when": {
            "sephirah": "tiphereth",
            "archangel": "zophielle",
            "seraph": "thirielle"
          },
          "traits": [
            {
              "name": "Séraphin patron — Thirielle — Charme",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Seconde impression — SR/R, 1/scène. Après un échec social non narratif, l’attitude de la cible ne se dégrade pas à cause de cet échec et une seconde tentative est admise si la fiction le permet."
            }
          ]
        },
        {
          "when": {
            "sephirah": "tiphereth",
            "archangel": "sachielle",
            "seraph": "chiloel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Chiloel — Résignation",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "À quoi bon ? — SR/R, Réaction 2 Aura, 1/scène. Après l’échec important d’une cible visible, opposition occulte : réussite = elle ne peut volontairement retenter exactement le même objectif jusqu’à la fin de son prochain round."
            }
          ]
        },
        {
          "when": {
            "sephirah": "nesah",
            "archangel": "azazel",
            "seraph": "nehemiel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Nehemiel — Haine",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Amour retourné — SR/R, Réaction 2 Aura, 1/scène. Après avoir résisté à un effet de désir/charme/amour/attachement/séduction, retourner une version cohérente de l’effet contre son auteur si réversible."
            }
          ]
        },
        {
          "when": {
            "sephirah": "nesah",
            "archangel": "azazel",
            "seraph": "hassiel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Hassiel — Défense",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Rien ne passe — SR/R, Réaction 2 Aura, 1/scène. Lorsqu’un effet ciblé visible est arrêté par la Défense de l’Angelus, protéger aussi une seconde cible adjacente qui aurait subi le même effet."
            }
          ]
        },
        {
          "when": {
            "sephirah": "nesah",
            "archangel": "hanaelle",
            "seraph": "phanaelle"
          },
          "traits": [
            {
              "name": "Séraphin patron — Phanaelle — Prudence",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Pas cette fois — SR/R, Réaction 1 Aura, 1/scène. Lorsqu’une action hostile est déclarée directement contre l’Angelus avant le jet, se déplacer immédiatement de 2 m vers une position valide ; l’action est résolue depuis la nouvelle situation."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hod",
            "archangel": "urielle",
            "seraph": "danael"
          },
          "traits": [
            {
              "name": "Séraphin patron — Danael — Flammes",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Feu repris — R, Réaction, 1/scène. Lorsqu’un feu réel non divin supérieur devrait blesser l’Angelus ou une cible adjacente : réduire les dégâts finaux de 3 et récupérer 1 Aura si au moins 1 dégât est annulé."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hod",
            "archangel": "urielle",
            "seraph": "agriel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Agriel — Lumière céleste",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Reflet fugitif — R, Réaction 1 Aura, 1/round. Après une Défense active physique réussie contre une attaque exigeant la localisation précise du corps, se déplacer immédiatement de 2 m vers une position valide."
            }
          ]
        },
        {
          "when": {
            "sephirah": "hod",
            "archangel": "sandalphon",
            "seraph": "pergamin"
          },
          "traits": [
            {
              "name": "Séraphin patron — Pergamin — Persévérance",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Continue — SR/R, Réaction 1 Aura, 1/scène. Lorsqu’une action en cours d’un allié visible est interrompue extérieurement, les PA/progrès déjà investis ne sont pas perdus et l’action peut être reprise."
            }
          ]
        },
        {
          "when": {
            "sephirah": "yessod",
            "archangel": "camaelle",
            "seraph": "jachim"
          },
          "traits": [
            {
              "name": "Séraphin patron — Jachim — Orage",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Onde de tonnerre — R, 1 Aura, 1/round. Avec Impulsion céleste ou Éclair de colère, produire une détonation en fin de mouvement pouvant repousser une créature à 2 m sur échec de Défense physique ; aucun dégât."
            }
          ]
        },
        {
          "when": {
            "sephirah": "yessod",
            "archangel": "camaelle",
            "seraph": "sabbathiel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Sabbathiel — Colère",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Corps de rage — R, 1/scène. Jusqu’au début du prochain round : Armure 3, +2 DGT physiques, puis 2 PV irréductibles ; aucune action demandant calme/délicatesse/patience."
            }
          ]
        },
        {
          "when": {
            "sephirah": "yessod",
            "archangel": "mebahel",
            "seraph": "henael"
          },
          "traits": [
            {
              "name": "Séraphin patron — Henael — Avertissement",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Je t’avais prévenu — SR/R, Réaction 2 Aura, 1/scène. Avertir un allié visible juste avant un danger immédiat non identifié : il n’est pas Surpris et peut interrompre/modifier son action si physiquement possible."
            }
          ]
        },
        {
          "when": {
            "sephirah": "malkhouth",
            "archangel": "azrael",
            "seraph": "barabbiel"
          },
          "traits": [
            {
              "name": "Séraphin patron — Barabbiel — Âmes",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Écho des vaincus — SR/R, 1/scénario. Après la mort dans la scène d’une créature dotée d’une âme directement affrontée, conserver un Écho jusqu’à la fin du scénario ; plus tard 1 PA + 1 Aura pour poser une question, reconnaître un élément ou manifester brièvement sa silhouette."
            }
          ]
        },
        {
          "when": {
            "sephirah": "malkhouth",
            "archangel": "azrael",
            "seraph": "pithormim"
          },
          "traits": [
            {
              "name": "Séraphin patron — Pithormim — Clé des Enfers",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Sens des seuils — SR/R. Détecter à proximité portail/fissure/passage dimensionnel ou sceau qui en retient un ; 1/scène au contact, +3 pour fermer/stabiliser/maintenir/empêcher son ouverture."
            }
          ]
        },
        {
          "when": {
            "sephirah": "malkhouth",
            "archangel": "muriel",
            "seraph": "osael"
          },
          "traits": [
            {
              "name": "Séraphin patron — Osael — Colère",
              "access": "Gratuit",
              "source": "Faveur séraphique",
              "effect": "Ne me tourne pas le dos — R, Réaction 1 Aura, 1/scène. Une cible visible qui inflige des dégâts devient l’Objet de la Colère pour la scène ; 1/round lorsqu’elle s’éloigne, l’Angelus peut se déplacer immédiatement de 2 m vers elle."
            }
          ]
        }
      ]
    },
    "aseryn": {
      "id": "aseryn",
      "name": "Aseryn",
      "description": "Les Aseryns sont un peuple terrestre créé par Serathè avant les civilisations humaines historiques. Leur physiologie extrêmement rapide, leur sens électromagnétique et leur potentiel lié à la Foudre ne résument pas une civilisation ancienne, dispersée et politiquement diverse. Origine ou diaspora et Tradition des Treize sont des héritages culturels distincts, jamais des castes biologiques.",
      "choices": [
        {
          "key": "origin",
          "label": "Origine / diaspora",
          "optional": false,
          "options": [
            {
              "id": "aerilien",
              "name": "Aérilien / Néo-Atlante",
              "description": "Héritiers des populations d’Aèr et de la continuité néo-atlante, les Aériliens portent la mémoire de centres très anciens de la civilisation aseryne. Leur origine décrit une diaspora et une culture, pas un degré supérieur de pureté biologique."
            },
            {
              "id": "mulien",
              "name": "Mûlien",
              "description": "Les Mûliens viennent d’une autre grande continuité historique aseryne, façonnée par des territoires, des migrations et des réponses politiques propres. Cette origine colore les références culturelles du personnage sans enfermer sa Tradition des Treize."
            },
            {
              "id": "hyperboreen",
              "name": "Hyperboréen",
              "description": "Les Hyperboréens représentent une diaspora ancienne dont la mémoire s’est construite loin des premiers centres atlantes. Leur héritage reste pleinement aseryn tout en portant des traditions régionales et politiques distinctes."
            },
            {
              "id": "lemurian",
              "name": "Lémurian",
              "description": "Les Lémurians appartiennent à une branche historique séparée de la civilisation aseryne, avec ses propres survivances et adaptations. Le choix décrit d’où vient le personnage, pas quelle fonction des Treize il doit suivre."
            },
            {
              "id": "seratheen",
              "name": "Serathéen",
              "description": "Les Serathéens sont une diaspora aseryne, pas une sous-espèce ni une caste. En Amérique du Nord, certains suivent le Conseil de la Foudre, mais cette tradition locale ne définit jamais tous les Serathéens."
            }
          ]
        },
        {
          "key": "tradition",
          "label": "Tradition des Treize",
          "optional": false,
          "options": [
            {
              "id": "athegos",
              "name": "Athegos — Seigneur",
              "description": "Tradition du Seigneur : responsabilité, direction et pouvoir organisé. Elle enseigne à tenir une structure et répondre de ce qu’elle devient, plutôt qu’à revendiquer automatiquement une noblesse."
            },
            {
              "id": "sundosia",
              "name": "Sundosia — Aventurière",
              "description": "Tradition de l’Aventurière : mobilité, découverte et action au-delà des cadres établis. Elle valorise ceux qui vont là où les cartes culturelles ou politiques cessent d’être sûres."
            },
            {
              "id": "caendis",
              "name": "Caendis — Protecteur",
              "description": "Tradition du Protecteur : défense des personnes, lieux et continuités jugées dignes d’être préservées. Sa force vient de l’engagement envers ce qui doit survivre."
            },
            {
              "id": "cairiah",
              "name": "Cairiah — Architecte",
              "description": "Tradition de l’Architecte : concevoir, organiser et donner une forme durable aux systèmes. Elle peut s’exprimer dans les structures matérielles comme sociales ou techniques."
            },
            {
              "id": "eydreas",
              "name": "Eydreas — Chercheur",
              "description": "Tradition du Chercheur : comprendre avant d’utiliser. Elle privilégie méthode, enquête et production de savoir au sein d’une civilisation où l’ancienneté ne dispense jamais de vérifier."
            },
            {
              "id": "seryn",
              "name": "Seryn — Artisan",
              "description": "Tradition de l’Artisan : savoir-faire, précision et création maîtrisée. Elle considère la qualité de l’œuvre comme une forme de continuité culturelle."
            },
            {
              "id": "natyel",
              "name": "Natyel — Nourricier",
              "description": "Tradition du Nourricier : entretenir ce qui permet à une communauté de vivre et de durer. La fonction dépasse la nourriture et touche aux ressources, aux soins et à la continuité quotidienne."
            },
            {
              "id": "erith",
              "name": "Erith — Sentinelle",
              "description": "Tradition de la Sentinelle : veille, vigilance et réaction aux menaces. Elle forme ceux qui remarquent ce qui change avant que le danger n’ait déjà franchi la porte."
            },
            {
              "id": "lisirast",
              "name": "Lisirast — Archiviste",
              "description": "Tradition de l’Archiviste : conserver mémoire, preuves et continuité. Dans une civilisation millénaire, perdre une information peut être une catastrophe aussi grave que perdre un territoire."
            },
            {
              "id": "lisithas",
              "name": "Lisithas — Juge",
              "description": "Tradition du Juge : peser, arbitrer et trancher selon un cadre compris. Elle n’accorde pas une morale automatique mais une responsabilité face aux décisions qui engagent les autres."
            },
            {
              "id": "selerias",
              "name": "Selerias — Aimante",
              "description": "Tradition de l’Aimante : lien, attraction et cohésion. Elle explore ce qui rapproche réellement les personnes plutôt qu’une simple capacité de charme social."
            },
            {
              "id": "theana",
              "name": "Theana — Guérisseuse",
              "description": "Tradition de la Guérisseuse : restaurer corps, fonction et continuité. Elle traite le soin comme un savoir exigeant plutôt que comme une bénédiction abstraite."
            },
            {
              "id": "dratyn",
              "name": "Dratyn — Maîtresse de la Foudre",
              "description": "Tradition de la Maîtresse de la Foudre : canaliser l’héritage électromagnétique aseryn avec une discipline spécifique. Elle ne transforme pas tous les Aseryns en utilisateurs automatiques de la Foudre."
            }
          ]
        },
        {
          "key": "seratheenTradition",
          "label": "Tradition serathéenne",
          "optional": true,
          "options": [
            {
              "id": "aucune",
              "name": "Aucune",
              "description": ""
            },
            {
              "id": "conseil_foudre",
              "name": "Conseil de la Foudre (Amérique du Nord)",
              "description": ""
            }
          ]
        }
      ],
      "baseFreeTraits": [
        {
          "name": "Accelyr",
          "access": "V/SR/R",
          "effect": "Langue aseryne parlée à une vitesse que l’oreille et le cerveau humains ne suivent normalement pas."
        },
        {
          "name": "Physiologie aseryne",
          "access": "V/SR/R",
          "effect": "Longévité exceptionnelle et activité neuromusculaire rapide."
        },
        {
          "name": "Sens électromagnétique",
          "access": "SR/R",
          "effect": "Perçoit les sources et variations électromagnétiques significatives."
        }
      ],
      "freeTraitRules": []
    },
    "exile": {
      "id": "exile",
      "name": "Exilé",
      "description": "Elyë, Whurten, Ashyll, Thulkar et Azménoriens sont les principales communautés venues d’Aèr. Beaucoup vivent sur Terre depuis bien avant l’Hologramme et y sont nés depuis de nombreuses générations : être Exilé ne signifie donc pas nécessairement être un voyageur récemment arrivé. Le peuple décrit une physiologie et un héritage ; réseaux, métiers, factions et traditions restent des choix séparés.",
      "choices": [
        {
          "key": "people",
          "label": "Peuple exilé",
          "optional": false,
          "options": [
            {
              "id": "elye",
              "name": "Elyë — Elfes",
              "description": "Les Elyë sont les descendants des peuples elfiques d’Aèr installés sur Terre, porteurs de traditions anciennes mais pleinement capables d’être nés et socialisés dans le monde moderne. Leur physiologie et leur sensibilité au Flux ne dictent ni faction ni métier."
            },
            {
              "id": "whurten",
              "name": "Whurten — Nains",
              "description": "Les Whurten sont les héritiers nains d’Aèr : corps denses, endurance et cultures techniques anciennes ont façonné leurs communautés. Runes, clans et réseaux contemporains sont des traditions distinctes que tous les Whurten ne partagent pas automatiquement."
            },
            {
              "id": "ashyll",
              "name": "Ashyll — Gobelins",
              "description": "Les Ashyll sont les héritiers gobelins d’Aèr, réputés pour l’adaptation, l’inventivité et la survie dans les interstices des grandes structures. Leur culture réelle dépasse largement la caricature du bricolage et se décline en réseaux très différents."
            },
            {
              "id": "thulkar",
              "name": "Thulkar — Orques",
              "description": "Les Thulkar sont les héritiers orques d’Aèr, physiquement puissants et porteurs de traditions communautaires variées. Horde, syndicat ou autre appartenance est un choix social : aucune organisation ne définit biologiquement le peuple entier."
            },
            {
              "id": "azmenorien",
              "name": "Azménorien",
              "description": "Les Azménoriens héritent d’une civilisation de technomagie avancée et d’une relation ancienne au Néant. Leur peuple ne se confond ni avec les Servants de Pluton ni avec une profession de technomage : ces voies sont des formations ou des réseaux supplémentaires."
            }
          ]
        },
        {
          "key": "network",
          "label": "Tradition / réseau",
          "optional": true,
          "dependsOn": "people",
          "options": [
            {
              "id": "aucune",
              "name": "Aucune tradition sélectionnée",
              "description": "Conserve les PTV disponibles ; les Talents raciaux du peuple restent accessibles."
            }
          ],
          "optionsBy": {
            "elye": [
              {
                "id": "aucune",
                "name": "Aucune tradition sélectionnée",
                "description": "Conserve les PTV disponibles ; les Talents raciaux du peuple restent accessibles."
              },
              {
                "id": "protocoles_continuite",
                "name": "Protocoles de Continuité — Silcenters",
                "description": "Formation commune de continuité et de gestion V/SR/R ; n’est pas une espèce ni une faction biologique."
              },
              {
                "id": "hds",
                "name": "HDS — Hologram Distorsion Skill",
                "description": "Cursus spécialisé lié à la Distorsion de l’Hologramme."
              },
              {
                "id": "faucon_malachite",
                "name": "Croix d’Emphyrra — Faucon de Malachite",
                "description": "Branche de terrain : autonomie, rupture de l’Artifice et maîtrise du terrain."
              },
              {
                "id": "serpentaire_citrine",
                "name": "Croix d’Emphyrra — Serpentaire de Citrine",
                "description": "Branche d’ascendant, d’exigence et de Haute Magie de Citrine."
              },
              {
                "id": "aigle_larvikite",
                "name": "Croix d’Emphyrra — Aigle de Larvikite",
                "description": "Branche d’intransigeance et de rites des anciens dieux."
              },
              {
                "id": "hibou_onyx",
                "name": "Croix d’Emphyrra — Hibou d’Onyx",
                "description": "Branche de science des Ombres et de symbiose d’Onyx."
              }
            ],
            "whurten": [
              {
                "id": "aucune",
                "name": "Aucune tradition sélectionnée",
                "description": "Conserve les PTV disponibles ; les Talents raciaux du peuple restent accessibles."
              },
              {
                "id": "protocoles_continuite",
                "name": "Protocoles de Continuité — Silcenters",
                "description": "Formation commune de continuité et de gestion V/SR/R ; n’est pas une espèce ni une faction biologique."
              },
              {
                "id": "hds",
                "name": "HDS — Hologram Distorsion Skill",
                "description": "Cursus spécialisé lié à la Distorsion de l’Hologramme."
              },
              {
                "id": "runes_whurten",
                "name": "Runes whurtennes",
                "description": "Tradition whurtenne de runes. L’accès relève de la tradition, pas automatiquement de la biologie."
              },
              {
                "id": "atelier_clans",
                "name": "Atelier des Clans",
                "description": "Tradition whurtenne d’atelier, d’ingénierie et de transmission."
              },
              {
                "id": "iron_law",
                "name": "Iron Law",
                "description": "Tradition whurtenne structurée autour de la loi, de l’engagement et de la discipline."
              }
            ],
            "ashyll": [
              {
                "id": "aucune",
                "name": "Aucune tradition sélectionnée",
                "description": "Conserve les PTV disponibles ; les Talents raciaux du peuple restent accessibles."
              },
              {
                "id": "protocoles_continuite",
                "name": "Protocoles de Continuité — Silcenters",
                "description": "Formation commune de continuité et de gestion V/SR/R ; n’est pas une espèce ni une faction biologique."
              },
              {
                "id": "hds",
                "name": "HDS — Hologram Distorsion Skill",
                "description": "Cursus spécialisé lié à la Distorsion de l’Hologramme."
              },
              {
                "id": "green_union",
                "name": "Green Union",
                "description": "Organisation ashyll sans arbre PTV propre : statut, réseau et fiction, pas achat de capacités."
              },
              {
                "id": "quatre_empereurs",
                "name": "Ligue des Quatre Empereurs",
                "description": "Réseau ashyll : doctrine du levier et empire invisible."
              },
              {
                "id": "syndicat_jade",
                "name": "Syndicat de Jade",
                "description": "Réseau ashyll : contrebande, courtage occulte, garde et réseau de Jade."
              }
            ],
            "thulkar": [
              {
                "id": "aucune",
                "name": "Aucune tradition sélectionnée",
                "description": "Conserve les PTV disponibles ; les Talents raciaux du peuple restent accessibles."
              },
              {
                "id": "protocoles_continuite",
                "name": "Protocoles de Continuité — Silcenters",
                "description": "Formation commune de continuité et de gestion V/SR/R ; n’est pas une espèce ni une faction biologique."
              },
              {
                "id": "hds",
                "name": "HDS — Hologram Distorsion Skill",
                "description": "Cursus spécialisé lié à la Distorsion de l’Hologramme."
              },
              {
                "id": "syndicat_jade",
                "name": "Syndicat de Jade",
                "description": "Réseau ashyll : contrebande, courtage occulte, garde et réseau de Jade."
              },
              {
                "id": "horde_commune",
                "name": "Formation de Horde — commune",
                "description": "Formation thulkar commune aux Hordes."
              },
              {
                "id": "horde_divine",
                "name": "Horde Divine",
                "description": "Doctrine d’Ashorn."
              },
              {
                "id": "horde_marais",
                "name": "Horde des Marais",
                "description": "Doctrine de la Réussite."
              },
              {
                "id": "horde_fantome",
                "name": "Horde Fantôme",
                "description": "Doctrine de l’Intégration."
              },
              {
                "id": "horde_cendres",
                "name": "Horde des Cendres",
                "description": "Doctrine du Chantier."
              },
              {
                "id": "horde_rose",
                "name": "Horde de la Rose",
                "description": "Doctrine de la Polyvalence."
              }
            ],
            "azmenorien": [
              {
                "id": "aucune",
                "name": "Aucune tradition sélectionnée",
                "description": "Conserve les PTV disponibles ; les Talents raciaux du peuple restent accessibles."
              },
              {
                "id": "protocoles_continuite",
                "name": "Protocoles de Continuité — Silcenters",
                "description": "Formation commune de continuité et de gestion V/SR/R ; n’est pas une espèce ni une faction biologique."
              },
              {
                "id": "hds",
                "name": "HDS — Hologram Distorsion Skill",
                "description": "Cursus spécialisé lié à la Distorsion de l’Hologramme."
              },
              {
                "id": "servants_pluton",
                "name": "Servants de Pluton",
                "description": "Héritage azménorien : ingénierie xéno et Silence de Pluton."
              },
              {
                "id": "technomagie_azmenor",
                "name": "Technomagie azménorienne moderne",
                "description": "Tradition avancée mêlant lois naturelles et magiques ; les PTV donnent des techniques, jamais l’équipement lui-même."
              }
            ]
          }
        },
        {
          "key": "hunterTradition",
          "label": "Tradition de Chasse",
          "optional": true,
          "dependsOn": "people",
          "options": [
            {
              "id": "aucune",
              "name": "Aucune / profane",
              "description": "Aucune tradition de Chasse : le personnage ne suit pas de doctrine structurée et conserve ses PTV tant qu’il reste Profane."
            },
            {
              "id": "chasse_fantastique",
              "name": "Chasse Fantastique — Vénerie surnaturelle",
              "description": "Ancienne armée punitive elfique de la Guerre de la Magie devenue Vénerie surnaturelle : poursuite, chevauchée, coordination et Tempête anti-magique."
            }
          ],
          "optionsBy": {
            "azmenorien": [
              {
                "id": "aucune",
                "name": "Aucune / profane",
                "description": "Aucune tradition de Chasse : le personnage ne suit pas de doctrine structurée et conserve ses PTV tant qu’il reste Profane."
              },
              {
                "id": "chasse_fantastique",
                "name": "Chasse Fantastique — Vénerie surnaturelle",
                "description": "Ancienne armée punitive elfique de la Guerre de la Magie devenue Vénerie surnaturelle : poursuite, chevauchée, coordination et Tempête anti-magique."
              },
              {
                "id": "lueurs_azmenor",
                "name": "Lueurs d’Azménor",
                "description": "Une petite tradition issue d’un héritage azménorien : ses visions viennent réellement du Néant, mais leur interprétation peut être erronée."
              }
            ]
          }
        }
      ],
      "baseFreeTraits": [],
      "freeTraitRules": [
        {
          "when": {
            "people": "elye"
          },
          "traits": [
            {
              "id": "free-exile-elye-0",
              "name": "Ambidextrie naturelle",
              "effect": "SR/R : aucune pénalité due au seul usage de la main non dominante ; aucune attaque supplémentaire."
            },
            {
              "id": "free-exile-elye-1",
              "name": "Affinité elfique à la Magie",
              "effect": "Trait d’accès aux traditions magiques compatibles ; aucun sort gratuit."
            },
            {
              "id": "free-exile-elye-2",
              "name": "Longévité",
              "effect": "Trait narratif de longévité elyë."
            }
          ]
        },
        {
          "when": {
            "people": "whurten"
          },
          "traits": [
            {
              "id": "free-exile-whurten-0",
              "name": "Sens magnétique",
              "effect": "V/SR/R : connaît instinctivement le nord magnétique et ressent les anomalies importantes ; Esprit + Perception affine direction/intensité/source."
            }
          ]
        },
        {
          "when": {
            "people": "ashyll"
          },
          "traits": [
            {
              "id": "free-exile-ashyll-0",
              "name": "Ouïe ashyll",
              "effect": "V/SR/R : circonstances favorables (+3) aux perceptions auditives quand un son réel est suffisamment présent."
            },
            {
              "id": "free-exile-ashyll-1",
              "name": "Petite morphologie",
              "effect": "Fiction : accès aux espaces et couverts compatibles ; aucun bonus chiffré automatique."
            }
          ]
        },
        {
          "when": {
            "people": "azmenorien"
          },
          "traits": [
            {
              "id": "free-exile-azmenorien-0",
              "name": "Ailes sombres",
              "effect": "R : immenses sauts, franchissement vertical et amortissement des chutes ; pas de vol libre."
            },
            {
              "id": "free-exile-azmenorien-1",
              "name": "Don magique azménorien",
              "effect": "Trait d’accès aux traditions magiques compatibles ; aucun sort gratuit."
            }
          ]
        }
      ]
    },
    "extral": {
      "id": "extral",
      "name": "Extral / Humain galactique",
      "description": "Talass, Mo’sen, Baséanh, Rocréens et Thalsios appartiennent à des civilisations galactiques dont l’implantation terrestre est récente et très diverse. S’y ajoutent des cas rares comme les Ad’rak et les Humains galactiques de l’AIDH, dont certains programmes produisent les exceptionnels Homo Superior. Une espèce ou un profil biologique ne détermine jamais automatiquement le réseau, la doctrine ou l’équipement du personnage.",
      "choices": [
        {
          "key": "species",
          "label": "Profil / peuple",
          "optional": false,
          "options": [
            {
              "id": "talass",
              "name": "Talass",
              "description": "Les Talass appartiennent à une civilisation extrale dont la physiologie, la culture et les technologies se sont développées hors de l’histoire terrestre. Leur présence sur Terre est récente : leur espèce ne décide pas automatiquement du réseau politique ou professionnel qu’ils rejoignent."
            },
            {
              "id": "mosen",
              "name": "Mo’sen",
              "description": "Les Mo’sen sont une autre population galactique à part entière, avec ses propres adaptations biologiques et références culturelles. Les traiter comme une simple variante esthétique d’Humain effacerait précisément ce que leur origine extrale change dans leur rapport au monde."
            },
            {
              "id": "baseanh",
              "name": "Baséanh",
              "description": "Les Baséanh appartiennent aux civilisations galactiques implantées récemment sur Terre. Leur culture dispose de ses propres institutions et réseaux, tandis que leurs choix personnels peuvent les conduire loin des organisations traditionnellement associées à leur peuple."
            },
            {
              "id": "rocreen",
              "name": "Rocréen",
              "description": "Les Rocréens sont un peuple extral dont la physiologie et les traditions se sont développées dans un environnement galactique différent de la Terre. Réseau, doctrine et profession restent des couches acquises, jamais des conséquences automatiques de l’espèce."
            },
            {
              "id": "thalsios",
              "name": "Thalsios",
              "description": "Les Thalsios appartiennent aux communautés galactiques arrivées dans l’espace terrestre avec leurs technologies et leur histoire propres. Leur identité de peuple ne doit pas être confondue avec les organisations par lesquelles certains d’entre eux transitent ou travaillent."
            },
            {
              "id": "homo_superior",
              "name": "Homo Superior — Humain AIDH",
              "description": "Les Homo Superior sont des Humains galactiques extrêmement rares issus de programmes de l’AIDH, pas une espèce extraterrestre. Leur puissance et leur formation peuvent être exceptionnelles, mais l’AIDH, ses doctrines et ses services restent des affiliations distinctes."
            },
            {
              "id": "adrak",
              "name": "Ad’rak — origine restreinte",
              "description": "Les Ad’rak sont une population galactique rare et physiquement formidable : environ 2,60 m pour un mâle adulte et 2,20 m pour une femelle, avec une puissance brute capable de rivaliser avec certaines grandes Natures de Vérité. Ils ne sont pas de simples Humains surdimensionnés ; leurs Arts de Nel et réseaux éventuels restent des apprentissages séparés."
            }
          ]
        },
        {
          "key": "network",
          "label": "Réseau / doctrine",
          "optional": true,
          "dependsOn": "species",
          "options": [
            {
              "id": "aucune",
              "name": "Aucun réseau / doctrine",
              "description": "Le personnage conserve son arbre de profil uniquement."
            }
          ],
          "optionsBy": {
            "talass": [
              {
                "id": "aucune",
                "name": "Aucun réseau / doctrine",
                "description": "Le personnage conserve son arbre de profil uniquement."
              },
              {
                "id": "continuite",
                "name": "Protocoles de Continuité",
                "description": "Formation commune V/SR/R ; reconnue dans les communautés Extrals et naturelle dans plusieurs parcours AIDH."
              },
              {
                "id": "ctu",
                "name": "CTU — Californian Talasses Union",
                "description": "Ingénierie de transition et diffusion technologique. Talass/Thalsios : accès naturel ; autres profils : accès organisé selon parcours."
              },
              {
                "id": "croix_verte",
                "name": "Croix Verte / Ligue Baséanne",
                "description": "Xénobiologie, acclimatation et survie interespèce. Biobars, laboratoires et stocks restent des ressources réelles, jamais des achats PTV."
              },
              {
                "id": "reptile",
                "name": "REPTILE",
                "description": "Doctrine d’infiltration institutionnelle. Mo’sen : accès naturel ; autres profils : recrutement réel ; Homo Superior : restreint."
              },
              {
                "id": "shaediri",
                "name": "Mafia Shaediri",
                "description": "Frontière noire, marché xéno et réseau Shaekori. Rocréen : accès naturel ; autres profils via intégration réelle."
              },
              {
                "id": "hydroguard",
                "name": "Hydroguard / THDF",
                "description": "Combat hydrostatique et sauvetage abyssal. Thalsios/Rocréen : accès naturel ; autres profils selon recrutement."
              }
            ],
            "mosen": [
              {
                "id": "aucune",
                "name": "Aucun réseau / doctrine",
                "description": "Le personnage conserve son arbre de profil uniquement."
              },
              {
                "id": "continuite",
                "name": "Protocoles de Continuité",
                "description": "Formation commune V/SR/R ; reconnue dans les communautés Extrals et naturelle dans plusieurs parcours AIDH."
              },
              {
                "id": "ctu",
                "name": "CTU — Californian Talasses Union",
                "description": "Ingénierie de transition et diffusion technologique. Talass/Thalsios : accès naturel ; autres profils : accès organisé selon parcours."
              },
              {
                "id": "croix_verte",
                "name": "Croix Verte / Ligue Baséanne",
                "description": "Xénobiologie, acclimatation et survie interespèce. Biobars, laboratoires et stocks restent des ressources réelles, jamais des achats PTV."
              },
              {
                "id": "reptile",
                "name": "REPTILE",
                "description": "Doctrine d’infiltration institutionnelle. Mo’sen : accès naturel ; autres profils : recrutement réel ; Homo Superior : restreint."
              },
              {
                "id": "shaediri",
                "name": "Mafia Shaediri",
                "description": "Frontière noire, marché xéno et réseau Shaekori. Rocréen : accès naturel ; autres profils via intégration réelle."
              },
              {
                "id": "smrc",
                "name": "SMRC / AGI — Orgienétique",
                "description": "Maîtrise des architectures biologiques. Les PTV donnent le savoir-faire, jamais la greffe ou l’augmentation elle-même."
              }
            ],
            "baseanh": [
              {
                "id": "aucune",
                "name": "Aucun réseau / doctrine",
                "description": "Le personnage conserve son arbre de profil uniquement."
              },
              {
                "id": "continuite",
                "name": "Protocoles de Continuité",
                "description": "Formation commune V/SR/R ; reconnue dans les communautés Extrals et naturelle dans plusieurs parcours AIDH."
              },
              {
                "id": "ctu",
                "name": "CTU — Californian Talasses Union",
                "description": "Ingénierie de transition et diffusion technologique. Talass/Thalsios : accès naturel ; autres profils : accès organisé selon parcours."
              },
              {
                "id": "croix_verte",
                "name": "Croix Verte / Ligue Baséanne",
                "description": "Xénobiologie, acclimatation et survie interespèce. Biobars, laboratoires et stocks restent des ressources réelles, jamais des achats PTV."
              },
              {
                "id": "reptile",
                "name": "REPTILE",
                "description": "Doctrine d’infiltration institutionnelle. Mo’sen : accès naturel ; autres profils : recrutement réel ; Homo Superior : restreint."
              },
              {
                "id": "shaediri",
                "name": "Mafia Shaediri",
                "description": "Frontière noire, marché xéno et réseau Shaekori. Rocréen : accès naturel ; autres profils via intégration réelle."
              },
              {
                "id": "hydroguard",
                "name": "Hydroguard / THDF",
                "description": "Combat hydrostatique et sauvetage abyssal. Thalsios/Rocréen : accès naturel ; autres profils selon recrutement."
              },
              {
                "id": "smrc",
                "name": "SMRC / AGI — Orgienétique",
                "description": "Maîtrise des architectures biologiques. Les PTV donnent le savoir-faire, jamais la greffe ou l’augmentation elle-même."
              }
            ],
            "homo_superior": [
              {
                "id": "aucune",
                "name": "Aucun réseau / doctrine",
                "description": "Le personnage conserve son arbre de profil uniquement."
              },
              {
                "id": "continuite",
                "name": "Protocoles de Continuité",
                "description": "Formation commune V/SR/R ; reconnue dans les communautés Extrals et naturelle dans plusieurs parcours AIDH."
              },
              {
                "id": "ctu",
                "name": "CTU — Californian Talasses Union",
                "description": "Ingénierie de transition et diffusion technologique. Talass/Thalsios : accès naturel ; autres profils : accès organisé selon parcours."
              },
              {
                "id": "croix_verte",
                "name": "Croix Verte / Ligue Baséanne",
                "description": "Xénobiologie, acclimatation et survie interespèce. Biobars, laboratoires et stocks restent des ressources réelles, jamais des achats PTV."
              },
              {
                "id": "hydroguard",
                "name": "Hydroguard / THDF",
                "description": "Combat hydrostatique et sauvetage abyssal. Thalsios/Rocréen : accès naturel ; autres profils selon recrutement."
              },
              {
                "id": "aidh_intervention",
                "name": "Doctrine d’Intervention AIDH",
                "description": "Doctrine indépendante de la physiologie Homo Superior. Homo Superior : accès naturel ; auxiliaire Extral : admission restreinte puis formation."
              },
              {
                "id": "aidh_coherence",
                "name": "Protocoles de Cohérence AIDH",
                "description": "Formation sensible liée à l’Hologramme et aux systèmes invariants ; exige matériel AIDH/compatible, jamais fourni par les PTV."
              }
            ],
            "adrak": [
              {
                "id": "aucune",
                "name": "Aucun réseau / doctrine",
                "description": "Le personnage conserve son arbre de profil uniquement."
              },
              {
                "id": "continuite",
                "name": "Protocoles de Continuité",
                "description": "Formation commune V/SR/R ; reconnue dans les communautés Extrals et naturelle dans plusieurs parcours AIDH."
              },
              {
                "id": "ctu",
                "name": "CTU — Californian Talasses Union",
                "description": "Ingénierie de transition et diffusion technologique. Talass/Thalsios : accès naturel ; autres profils : accès organisé selon parcours."
              },
              {
                "id": "croix_verte",
                "name": "Croix Verte / Ligue Baséanne",
                "description": "Xénobiologie, acclimatation et survie interespèce. Biobars, laboratoires et stocks restent des ressources réelles, jamais des achats PTV."
              },
              {
                "id": "reptile",
                "name": "REPTILE",
                "description": "Doctrine d’infiltration institutionnelle. Mo’sen : accès naturel ; autres profils : recrutement réel ; Homo Superior : restreint."
              },
              {
                "id": "shaediri",
                "name": "Mafia Shaediri",
                "description": "Frontière noire, marché xéno et réseau Shaekori. Rocréen : accès naturel ; autres profils via intégration réelle."
              },
              {
                "id": "hydroguard",
                "name": "Hydroguard / THDF",
                "description": "Combat hydrostatique et sauvetage abyssal. Thalsios/Rocréen : accès naturel ; autres profils selon recrutement."
              },
              {
                "id": "smrc",
                "name": "SMRC / AGI — Orgienétique",
                "description": "Maîtrise des architectures biologiques. Les PTV donnent le savoir-faire, jamais la greffe ou l’augmentation elle-même."
              },
              {
                "id": "nelakna",
                "name": "Arts de Nel’Akna",
                "description": "Tradition sacerdotale martiale Ad’rak distincte de l’Armée noire."
              }
            ]
          }
        },
        {
          "key": "hunterTradition",
          "label": "Tradition de Chasse",
          "optional": true,
          "options": [
            {
              "id": "aucune",
              "name": "Aucune / profane",
              "description": "Aucune tradition de Chasse : le personnage ne suit pas de doctrine structurée et conserve ses PTV tant qu’il reste Profane."
            },
            {
              "id": "xenoshield",
              "name": "Xenoshield",
              "description": "Une organisation experte en xénobiologie hostile, confinement et contre-technologie, mais profondément biaisée contre les Extrals — et infiltrée par certains d’entre eux."
            }
          ]
        }
      ],
      "baseFreeTraits": [],
      "freeTraitRules": [
        {
          "when": {
            "species": "talass"
          },
          "traits": [
            {
              "id": "free-extral-talass-0",
              "name": "Anatomie segmentaire",
              "effect": "Physiologie segmentaire talass."
            },
            {
              "id": "free-extral-talass-1",
              "name": "Bond talass",
              "effect": "Morphologie adaptée aux bonds et changements d’appui."
            },
            {
              "id": "free-extral-talass-2",
              "name": "Adhérence naturelle",
              "effect": "Adhérence physiologique talass."
            },
            {
              "id": "free-extral-talass-3",
              "name": "Soie conductrice",
              "effect": "Production de soie conductrice."
            },
            {
              "id": "free-extral-talass-4",
              "name": "Affinité Talwa’Etax",
              "effect": "Affinité psychique naturelle au Talwa’Etax."
            }
          ]
        },
        {
          "when": {
            "species": "mosen"
          },
          "traits": [
            {
              "id": "free-extral-mosen-0",
              "name": "Cuirasse mo’senne",
              "effect": "Armure corporelle 1 ; se cumule avec une armure portée réellement compatible."
            },
            {
              "id": "free-extral-mosen-1",
              "name": "Griffes et dentition",
              "effect": "Pugilat DGT 2."
            },
            {
              "id": "free-extral-mosen-2",
              "name": "Digestion absolue",
              "effect": "Physiologie digestive mo’senne."
            },
            {
              "id": "free-extral-mosen-3",
              "name": "Thermotolérance",
              "effect": "Tolérance thermique naturelle."
            }
          ]
        },
        {
          "when": {
            "species": "baseanh"
          },
          "traits": [
            {
              "id": "free-extral-baseanh-0",
              "name": "Tardollas",
              "effect": "Capacité biologique de culture ; normalement 2 préparations actives à la fois."
            },
            {
              "id": "free-extral-baseanh-1",
              "name": "Quatre bras",
              "effect": "Deux paires de bras ; aucun PA, Attaque, Défense active ou Réaction supplémentaire par défaut."
            },
            {
              "id": "free-extral-baseanh-2",
              "name": "Immunité adaptative",
              "effect": "+3 aux résistances contre maladies, poisons, toxines et contamination biologique."
            },
            {
              "id": "free-extral-baseanh-3",
              "name": "Stabilité manuelle",
              "effect": "Stabilité naturelle de la quadrimanie baséanne."
            }
          ]
        },
        {
          "when": {
            "species": "rocreen"
          },
          "traits": [
            {
              "id": "free-extral-rocreen-0",
              "name": "Amphibie",
              "effect": "Physiologie amphibie rocréenne."
            },
            {
              "id": "free-extral-rocreen-1",
              "name": "Noyau rocréen",
              "effect": "Noyau biologique central de la physiologie et de la régénération rocréennes."
            },
            {
              "id": "free-extral-rocreen-2",
              "name": "Quadrimanie rocréenne",
              "effect": "Morphologie quadrimanuelle rocréenne."
            },
            {
              "id": "free-extral-rocreen-3",
              "name": "Résonance psychique",
              "effect": "Résonance psychique naturelle rocréenne."
            }
          ]
        },
        {
          "when": {
            "species": "thalsios"
          },
          "traits": [
            {
              "id": "free-extral-thalsios-0",
              "name": "Amphibie thalsios",
              "effect": "Physiologie amphibie thalsiosse."
            },
            {
              "id": "free-extral-thalsios-1",
              "name": "Charpente cartilagineuse",
              "effect": "+3 contre fracture, bris osseux ou trauma squelettique."
            },
            {
              "id": "free-extral-thalsios-2",
              "name": "Toucher thalsios",
              "effect": "Sensibilité tactile naturelle thalsiosse."
            }
          ]
        },
        {
          "when": {
            "species": "homo_superior"
          },
          "traits": [
            {
              "id": "free-extral-homo_superior-0",
              "name": "Essaim nanitique AIDH",
              "effect": "Population nanitique durable intégrée ; substrat des Talents Homo Superior, pas équipement interchangeable."
            },
            {
              "id": "free-extral-homo_superior-1",
              "name": "Homéostasie assistée",
              "effect": "Connaît automatiquement son état physiologique général sans identifier automatiquement cause ou traitement."
            },
            {
              "id": "free-extral-homo_superior-2",
              "name": "Hémostase nanitique",
              "effect": "Un Saignement ordinaire s’arrête automatiquement à la fin du round ; ne soigne pas et ne Stabilise pas."
            },
            {
              "id": "free-extral-homo_superior-3",
              "name": "Organisme optimisé",
              "effect": "+3 aux tests exclusivement destinés à résister aux effets physiologiques d’un environnement naturel hostile ; pas aux impossibilités biologiques."
            },
            {
              "id": "free-extral-homo_superior-4",
              "name": "Métabolisme de campagne",
              "effect": "Peut fonctionner quelques jours avec sommeil réduit, repas irréguliers et effort prolongé sans pénalité notable."
            }
          ]
        },
        {
          "when": {
            "species": "adrak"
          },
          "traits": [
            {
              "id": "free-extral-adrak-0",
              "name": "Gabarit Ad’rak",
              "effect": "R : allonge et masse considérables ; contraintes réelles de véhicule, mobilier, passage et armure. Une arme humaine à deux mains peut souvent être maniée à une main si l’ergonomie le permet ; aucune attaque supplémentaire."
            },
            {
              "id": "free-extral-adrak-1",
              "name": "Force Ad’rak",
              "effect": "Peut tenter normalement des actions de force hors échelle humaine ; pas de jet quand l’issue n’est réellement pas incertaine."
            },
            {
              "id": "free-extral-adrak-2",
              "name": "Pugilat Ad’rak",
              "effect": "SR : DGT 2 ; R : DGT 3."
            },
            {
              "id": "free-extral-adrak-3",
              "name": "Compatibilité terrestre",
              "effect": "Physiologie proche de l’Humain pour respiration, eau, grande partie de l’alimentation et environnements ordinaires."
            }
          ]
        }
      ]
    }
  }
} as const;
