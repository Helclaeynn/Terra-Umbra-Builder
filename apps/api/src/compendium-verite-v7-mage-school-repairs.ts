type ParagraphBlock = { type: "p"; text: string; style?: string };
type TableBlock = { type: "table"; rows: unknown[][] };
type Block = ParagraphBlock | TableBlock;
export type MagicRuleSection = { id: string; title: string; level: number; audience?: "mj"; blocks: Block[] };

type MagicSchool = {
  title: string;
  description: string[];
  mastery: string[][];
  examples: string[];
  limits: string[];
};

const MAGIC_SCHOOLS: MagicSchool[] = [
  {
    "title": "Architétramancie — magie des éléments",
    "description": [
      "L’Architétramancie manifeste et manipule des phénomènes élémentaires : feu, eau, air, terre, glace, foudre, vibrations et autres orientations cohérentes avec la tradition du Mage. À l’éveil, le Mage choisit au moins une orientation élémentaire qu’il connaît réellement ; élargir son répertoire demande entraînement, progression ou Technique."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Créer, déplacer, intensifier ou diminuer un phénomène simple."
      ],
      [
        "Affinée",
        "Formes précises, plusieurs manifestations simples, sélection partielle des zones touchées."
      ],
      [
        "Supérieure",
        "Pression, température, propagation, courants, gradients et interactions complexes."
      ],
      [
        "Magistrale",
        "Exploitation profonde d’un principe élémentaire ; ouvre les spécialisations dignes d’une Magie personnelle."
      ]
    ],
    "examples": [
      "Allumer une torche ou produire une flamme contrôlée. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Pas de défense hors opposition.",
      "Projeter une lance de feu sur un adversaire. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense physique si projectile évitable ; DGT magique +6.",
      "Créer un mur de flammes fermant une pièce. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Stato ; dégâts à ceux qui le traversent selon effet annoncé.",
      "Geler un véhicule ou projeter plusieurs ennemis par une onde d’air. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense physique des cibles affectées.",
      "Embraser un bâtiment ou provoquer un séisme destructeur local. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 La finesse de sélection dépend de la Maîtrise.",
      "Déclencher un séisme ou une tempête affectant un quartier. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Très forte Tension ; Canalisation souvent indispensable."
    ],
    "limits": [
      "• Une forte Amplitude n’accorde pas automatiquement la finesse nécessaire pour épargner précisément les alliés au cœur d’une vaste zone.",
      "• La magie ne donne pas une connaissance scientifique gratuite : exploiter un phénomène subtil exige de comprendre suffisamment ce phénomène.",
      "• Les formes extrêmes comme une magie sismique parfaitement contrôlée peuvent devenir des Œuvres personnelles/familiales."
    ]
  },
  {
    "title": "Morphomancie — magie du Modelage",
    "description": [
      "La Morphomancie modifie la forme, la densité et l’organisation de la matière sans nécessairement changer sa substance. Elle excelle sur le corps vivant, mais toute modification hostile interne doit vaincre la Défense occulte et respecter le Principe de désignation."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Modifier simplement forme, densité ou proportions."
      ],
      [
        "Affinée",
        "Remodelage précis d’anatomie ou de structures complexes."
      ],
      [
        "Supérieure",
        "Organes fonctionnels, métamorphoses cohérentes, plusieurs systèmes interdépendants."
      ],
      [
        "Magistrale",
        "Réorganisation radicale tout en conservant un ensemble fonctionnel ; base des grandes métamorphoses personnelles."
      ]
    ],
    "examples": [
      "Modifier temporairement son visage ou ses empreintes. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Endo : difficulté −1 niveau.",
      "Densifier localement ses os ou former des griffes. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Bonus mécanique limité par l’effet annoncé ; maintien si nécessaire.",
      "Se métamorphoser en animal fonctionnel. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Endo ; connaissances anatomiques pertinentes.",
      "Altérer lourdement le corps d’un adversaire. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte ; pas d’instakill anatomique par simple formulation.",
      "Créer une chimère pleinement fonctionnelle ou transformer complètement un autre être. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Défense occulte si hostile ; permanence non gratuite.",
      "Transformer simultanément une foule ou remodeler massivement une structure. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 La sélection fine des victimes exige une très haute Maîtrise."
    ],
    "limits": [
      "• La Morphomancie ne remplace pas la Médéomancie : fermer mécaniquement une plaie n’efface pas automatiquement les PV perdus.",
      "• Une transformation durable et avantageuse ne donne pas gratuitement des augmentations permanentes d’Attributs ; elle relève d’une Technique, d’un maintien ou d’une Œuvre personnelle.",
      "• Cibler un organe interne précis exige connaissance + localisation crédible ; le nom de l’organe ne suffit pas."
    ]
  },
  {
    "title": "Alchimie — magie des atomes",
    "description": [
      "L’Alchimie manipule composition, séparation et recombinaison de la matière. Elle devient d’autant plus redoutable que le Mage possède de vrais savoirs en chimie, matériaux, pharmacologie ou physique."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Déplacer, séparer ou concentrer une substance connue."
      ],
      [
        "Affinée",
        "Recombinaisons chimiques et contrôle précis des réactions."
      ],
      [
        "Supérieure",
        "Chaînes complexes sans respecter toutes les conditions normales de pression, température ou catalyse."
      ],
      [
        "Magistrale",
        "Manipulation atomique extrêmement fine ; les phénomènes nucléaires restent hors usage générique."
      ]
    ],
    "examples": [
      "Purifier un verre d’eau ou séparer une contamination simple. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Aucun effet inventé sans connaître la substance ciblée.",
      "Concentrer un acide ou produire un composé irritant connu. Maîtrise min.: Affinée • Amplitude: Mineure • PA: 1 • Diff. base: 15 Si attaque directe : défense appropriée selon vecteur.",
      "Transformer chimiquement le contenu d’un réservoir ou saturer une pièce de gaz. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Stato possible ; exposition physique après création.",
      "Fragiliser une structure métallique importante. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Objet : difficulté ou résistance structurelle comme seuil.",
      "Modifier plusieurs tonnes de matériau ou neutraliser une contamination industrielle. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Exige connaissances réelles des matériaux.",
      "Altérer la composition d’une vaste zone environnementale. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Les conséquences secondaires restent réelles."
    ],
    "limits": [
      "• « Je transforme ça en neurotoxine » exige de connaître ce que le Mage cherche réellement à produire.",
      "• Fusion/fission nucléaire, transformation de matière en arme nucléaire et transmutations énergétiques extrêmes sont des Œuvres personnelles/familiales, pas des conséquences automatiques d’Alchimie Magistrale.",
      "• La magie ne fournit pas gratuitement les données de laboratoire manquantes."
    ]
  },
  {
    "title": "Photomancie — magie de la Lumière",
    "description": [
      "La Photomancie contrôle la lumière comme phénomène réel et, aux niveaux élevés, comme principe surnaturel. Elle se distingue de l’illusion : un effet photomantique modifie réellement la lumière présente dans le monde."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Créer, réduire, diriger ou intensifier la lumière."
      ],
      [
        "Affinée",
        "Spectres, réflexion, réfraction et plusieurs trajectoires."
      ],
      [
        "Supérieure",
        "Constructions lumineuses complexes, focalisation, protections et interactions surnaturelles."
      ],
      [
        "Magistrale",
        "Lumière utilisée comme principe magique, pas seulement comme illumination."
      ]
    ],
    "examples": [
      "Créer une source lumineuse ou éteindre une zone sombre. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Pas de défense si purement utilitaire.",
      "Éblouir une cible ou lancer un faisceau offensif. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense physique si faisceau évitable ; +6 dégâts.",
      "Aveugler un groupe ou illuminer intégralement une grande pièce. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense physique/Perception selon l’effet.",
      "Créer plusieurs faisceaux indépendants ou un écran lumineux. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Comportement multiple permis par la Maîtrise.",
      "Baigner un bâtiment dans une Lumière surnaturelle hostile à certaines entités. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Effets spéciaux dépendent de Techniques appropriées.",
      "Créer une manifestation lumineuse majeure à l’échelle d’un quartier. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Très visible ; conséquences sur le Voile évidentes."
    ],
    "limits": [
      "• Photomancie ne crée pas automatiquement des hallucinations : elle agit sur la lumière réelle.",
      "• Une caméra peut normalement enregistrer une modification photomantique si l’Hologramme ne la réécrit pas ensuite.",
      "• Les effets sacrés/divins ne sont pas inclus gratuitement : la Lumière magique n’est pas automatiquement une énergie religieuse."
    ]
  },
  {
    "title": "Acratomancie — magie des Sceaux",
    "description": [
      "L’Acratomancie attache une règle magique à un support, un objet, un emplacement ou une condition. Elle récompense la préparation, la logique et l’anticipation."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Un déclencheur, une condition et un effet simples."
      ],
      [
        "Affinée",
        "Délais, identités, exceptions et plusieurs conditions."
      ],
      [
        "Supérieure",
        "Réseaux de Sceaux, enchantements élaborés et stockage d’effets."
      ],
      [
        "Magistrale",
        "Architectures magiques complètes orchestrant plusieurs fonctions."
      ]
    ],
    "examples": [
      "Poser une alarme sur une porte. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Sceau passif, peut durer tant que son ancrage reste intact.",
      "Créer une rune qui libère un effet Mineur au contact. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Compte comme Sceau chargé.",
      "Protéger une pièce avec un piège sélectif. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Déclenchement selon conditions définies.",
      "Stocker temporairement un objet ou un sort dans un Sceau. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 La capacité exacte dépend de la nature du stockage.",
      "Sécuriser un bâtiment entier par un réseau de Sceaux. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Peut demander préparation matérielle/temps narratif.",
      "Structurer magiquement une zone urbaine par un vaste réseau. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4+ • Diff. base: 25 Rituel long presque obligatoire."
    ],
    "limits": [
      "• Sceaux chargés actifs simultanément : 1 / 2 / 3 / 4 selon Maîtrise Initiale / Affinée / Supérieure / Magistrale. Les alarmes et marquages passifs ancrés dans un lieu ne comptent pas nécessairement dans cette limite.",
      "• La Tension d’un Sceau chargé est payée lors de son inscription/chargement ; son déclenchement ultérieur n’exige pas que le Mageius soit actif.",
      "• Préparer une réserve infinie de « grenades magiques » est impossible sans Magie personnelle ou infrastructure spéciale."
    ]
  },
  {
    "title": "Médéomancie — magie de Guérison",
    "description": [
      "La Médéomancie restaure l’intégrité fonctionnelle d’un être vivant. Les connaissances médicales permettent des soins beaucoup plus précis ; la magie ne remplace pas automatiquement un diagnostic que le Mage ne sait pas faire."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Plaies, saignements, stabilisation et traumatismes simples."
      ],
      [
        "Affinée",
        "Fractures, tissus profonds et organes simples."
      ],
      [
        "Supérieure",
        "Organes complexes, membres, lésions surnaturelles."
      ],
      [
        "Magistrale",
        "Reconstruction biologique extrême et restauration au-delà de la médecine normale."
      ]
    ],
    "examples": [
      "Stabiliser un Agonisant. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Contact conseillé ; peut être automatique pour un grand Mage hors pression.",
      "Refermer des blessures et rendre 1 + DR PV. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Une cible ne peut pas être « farmée » en soins.",
      "Réparer une blessure grave et rendre 3 + DR PV. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Connaissance médicale utile pour effets précis.",
      "Réparer un organe sévèrement endommagé. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Peut exiger Soin/Savoirs comme permission fictionnelle.",
      "Reconstruire un membre ou rendre 5 + DR PV à défaut d’effet ciblé. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Permanence naturelle si véritable réparation biologique.",
      "Traiter simultanément de nombreuses victimes d’un désastre biologique. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Logistique et diagnostic restent pertinents."
    ],
    "limits": [
      "• Un organisme ayant récupéré des PV par Médéomancie ne peut plus en récupérer par Médéomancie avant la fin de la scène ou une véritable période de repos. De nouvelles blessures peuvent toujours être stabilisées.",
      "• Résurrection véritable : hors magie générique. Elle exige Œuvre personnelle, sacrifices, conditions ou autres exceptions majeures.",
      "• Médéomancie restaure ; elle ne remplace pas la Morphomancie pour fabriquer arbitrairement de nouvelles anatomies."
    ]
  },
  {
    "title": "Télékinésie — magie des forces",
    "description": [
      "La Télékinésie applique forces, pressions et mouvements sans contact. Sa dangerosité dépend énormément de la précision du Mage et de sa compréhension des systèmes qu’il manipule."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Pousser, tirer, soulever, maintenir une force simple."
      ],
      [
        "Affinée",
        "Plusieurs vecteurs et manipulations précises."
      ],
      [
        "Supérieure",
        "Champs de force, pressions différenciées, mouvements autonomes complexes."
      ],
      [
        "Magistrale",
        "Ingénierie de forces invisibles : armures, lames de pression, architectures dynamiques."
      ]
    ],
    "examples": [
      "Attirer une arme posée ou repousser une personne. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense physique si hostile et évitable.",
      "Projeter un objet comme projectile. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense physique ; +6 dégâts avant protection physique.",
      "Soulever une voiture ou immobiliser plusieurs personnes. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Vigueur/Athlétisme ou Défense selon la forme de contrainte.",
      "Former un écran de pression ou manipuler plusieurs trajectoires. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien si champ persistant.",
      "Soutenir une portion de bâtiment ou écraser une structure massive. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Objet : résistance structurelle possible.",
      "Déplacer une masse colossale ou exercer une force cohérente sur une vaste zone. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Précision sélective très coûteuse en Maîtrise."
    ],
    "limits": [
      "• La Télékinésie ne donne pas de vision interne. On ne « télékinèse » pas un cervelet caché sans moyen de désignation approprié.",
      "• Un objet projeté est une menace physique : armure et défense physique s’appliquent normalement.",
      "• Créer une armure/lame invisible extrêmement efficace peut relever d’une Œuvre personnelle comme spécialisation du domaine."
    ]
  },
  {
    "title": "Divination — magie de l’information et des possibles",
    "description": [
      "La Divination extrait des informations du présent, des traces, des relations et des futurs possibles. Elle ne transforme pas le Mage en narrateur omniscient et ne fournit pas automatiquement des connaissances qu’il ne sait pas formuler."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Question immédiate, impression, danger proche, trace simple."
      ],
      [
        "Affinée",
        "Recherche ciblée, observation éloignée liée, plusieurs futurs proches."
      ],
      [
        "Supérieure",
        "Ramifications causales, prévisions complexes, analyse stratégique."
      ],
      [
        "Magistrale",
        "Lecture très large des conséquences, probabilités et relations entre événements."
      ]
    ],
    "examples": [
      "Pressentir un danger immédiat. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Information courte, souvent qualitative.",
      "Retrouver une chose proche à partir d’un lien pertinent. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Le lien doit réellement désigner la cible.",
      "Observer magiquement un lieu connu ou lié. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Hors vue autorisé si le lien fait partie de l’effet.",
      "Comparer plusieurs futurs immédiats avant une opération. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Les décisions futures peuvent invalider une branche.",
      "Prévoir les principales issues d’une bataille ou d’un projet majeur. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Informations riches mais non omniscientes.",
      "Lire les tendances d’une catastrophe ou d’une guerre à l’échelle urbaine. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Le résultat porte sur tendances, pivots et probabilités."
    ],
    "limits": [
      "• Le Mage doit poser une question, définir un sujet ou disposer d’un lien. « Dis-moi tout » n’est pas une cible valable.",
      "• Le futur est probabiliste : les choix de personnes informées de la prophétie peuvent modifier ce qui était le plus probable.",
      "• Divination donne un avantage informationnel, pas le scénario du MJ page par page."
    ]
  },
  {
    "title": "Chronomancie — magie du temps",
    "description": [
      "La Chronomancie modifie l’écoulement local du temps. Les altérations du continuum sont dangereuses ; le voyage physique dans le passé ou le futur dépasse la magie générique des PJ."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Accélérer ou ralentir légèrement un processus simple."
      ],
      [
        "Affinée",
        "Plusieurs rythmes et petites bulles temporelles."
      ],
      [
        "Supérieure",
        "Accélérations fortes, suspension brève, véritables effets tactiques sur le rythme d’action."
      ],
      [
        "Magistrale",
        "Altérations très poussées du continuum local, à la frontière de ce qui reste raisonnablement sûr."
      ]
    ],
    "examples": [
      "Ralentir une chute ou accélérer une action non-combattante. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Effet bref ; maintien si prolongé.",
      "Déplacer légèrement l’ordre d’initiative ou ralentir un adversaire. Maîtrise min.: Affinée • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense occulte si imposé directement.",
      "Accorder +1 PA/round à une cible. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien 1 PA/round ; ne se cumule pas avec autre Chronomancie identique.",
      "Accélérer ou ralentir un petit groupe. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte pour cibles hostiles.",
      "Modifier fortement le rythme temporel d’une grande zone. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Les interactions entre intérieur/extérieur peuvent être complexes.",
      "Placer une portion de quartier dans une altération temporelle majeure. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Risque de conséquences narratives importantes."
    ],
    "limits": [
      "• +1 PA/round exige au minimum Maîtrise Supérieure + Amplitude Significative. Une cible ne peut gagner plus de +1 PA/round par Chronomancie générique.",
      "• Voyage physique dans le passé/futur, réécriture sûre de l’Histoire ou boucle temporelle stable : Œuvres personnelles/NPC exceptionnels."
    ]
  },
  {
    "title": "Spectromancie — magie spectrale",
    "description": [
      "La Spectromancie agit sur les âmes désincarnées, spectres, empreintes spirituelles et formes incorporelles. Elle ne réanime pas la chair et ne remplace pas la Nécromancie."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Percevoir, communiquer et toucher magiquement un spectre."
      ],
      [
        "Affinée",
        "Déplacer, protéger, contraindre ou ancrer une âme."
      ],
      [
        "Supérieure",
        "Projection de l’âme, possession contrôlée, manipulation de plusieurs spectres."
      ],
      [
        "Magistrale",
        "Restructuration complexe d’une existence spectrale et vastes phénomènes spirituels."
      ]
    ],
    "examples": [
      "Voir et parler à un spectre présent. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Pas de contrôle automatique.",
      "Repousser ou maintenir un esprit. Maîtrise min.: Affinée • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense occulte de l’entité.",
      "Forcer une manifestation ou projeter brièvement sa conscience. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien selon durée.",
      "Contraindre plusieurs spectres ou déplacer une âme sur une grande distance liée. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Défense occulte des esprits concernés.",
      "Projeter durablement son âme dans un réceptacle préparé. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Connaissance du réceptacle et ancrage nécessaires.",
      "Provoquer une manifestation spectrale massive sur une zone urbaine. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Faire venir ne signifie pas contrôler."
    ],
    "limits": [
      "• Spectromancie = âme ; Nécromancie = cadavre/état de mort ; Médéomancie = vie/restauration.",
      "• L’Essence Invocative fait venir une entité qui préexiste. Elle ne la crée pas et ne l’asservit pas gratuitement.",
      "• Possession et projection exigent des conditions de désignation/ancrage cohérentes."
    ]
  },
  {
    "title": "Hématomancie — magie du Sang",
    "description": [
      "L’Hématomancie manipule le sang comme matière, système biologique et support magique. Elle est très directe mais reste soumise à la désignation : le Mage peut viser une personne et sa circulation globale, pas sélectionner gratuitement une microstructure invisible qu’il ne sait pas localiser."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Sang visible ou accessible ; mouvements et effets globaux simples."
      ],
      [
        "Affinée",
        "Circulation, coagulation, pression et contrôle précis."
      ],
      [
        "Supérieure",
        "Sang comme vecteur autonome, lien ou extension de la volonté."
      ],
      [
        "Magistrale",
        "Contrôle hématique extrêmement poussé, effets de masse et techniques signatures."
      ]
    ],
    "examples": [
      "Faire ramper du sang exposé ou arrêter une hémorragie. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Pas de Défense si sang libre et non contesté.",
      "Perturber globalement la circulation d’une cible. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense occulte ; attaque directe +6 dégâts si destructive.",
      "Bloquer un membre par circulation ou contrôler plusieurs litres de sang. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte si sang interne.",
      "Utiliser son propre sang comme plusieurs vecteurs actifs. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Comportement autonome limité par Maîtrise/maintien.",
      "Manipuler le sang de plusieurs individus dans une vaste scène. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Chaque cible compare sa Défense occulte.",
      "Affecter la circulation d’une population importante dans une vaste zone. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Sélection fine et létalité restent limitées par le sort annoncé."
    ],
    "limits": [
      "• Une cible vivante contenant son sang peut être visée globalement parce que le Mage identifie la personne ; cibler une artériole invisible précise exige connaissance + localisation.",
      "• « J’arrête son cœur » ou « je bouche un vaisseau cérébral » ne contourne pas les PV : c’est une description d’attaque à résoudre normalement.",
      "• Les gouttes autonomes, liens hématiques à distance ou effets chirurgicalement précis sont d’excellents candidats à des Magies personnelles/familiales."
    ]
  },
  {
    "title": "Nécromancie — magie de la Mort",
    "description": [
      "La Nécromancie travaille sur les cadavres, l’état de mort et les structures mortes. Elle peut animer un corps sans lui rendre son âme."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Préserver, mouvoir ou modifier un cadavre simple."
      ],
      [
        "Affinée",
        "Animation cohérente et contrôle de plusieurs corps."
      ],
      [
        "Supérieure",
        "Morts-vivants spécialisés, autonomies simples et cohorte organisée."
      ],
      [
        "Magistrale",
        "Systèmes nécromantiques durables, armées ou territoires de mort."
      ]
    ],
    "examples": [
      "Empêcher un cadavre de se décomposer. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Effet reconstructif/restrictif sur matière morte.",
      "Animer un cadavre simple pour une tâche directe. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Maintien si comportement actif complexe.",
      "Animer plusieurs serviteurs morts. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Une cohorte générique active à la fois.",
      "Créer un mort-vivant spécialisé et relativement autonome. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Fonctions spéciales exigent vraie conception magique.",
      "Lever une unité importante de morts. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Ordres complexes peuvent exiger maintien/commandement.",
      "Éveiller un cimetière ou imposer un domaine nécromantique local. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Rituel/Canalisation souvent nécessaire."
    ],
    "limits": [
      "• Un Mage ne peut entretenir qu’une cohorte nécromantique générique pleinement liée et active à la fois ; créer une nouvelle cohorte remplace ou libère la précédente, sauf Technique/Magie personnelle.",
      "• Les armées historiques permanentes de grands nécromanciens sont des accomplissements spécialisés, pas un stockpile gratuit de sorts Mineurs.",
      "• Animer un corps ≠ remettre son âme dedans. La résurrection véritable traverse d’autres domaines et reste exceptionnelle."
    ]
  },
  {
    "title": "Pseudomancie — magie des Illusions",
    "description": [
      "La Pseudomancie manipule apparence et perception. Une illusion placée dans le monde et une hallucination imposée directement à un esprit ne se défendent pas de la même manière."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Un sens, un son, une image ou une apparence simple."
      ],
      [
        "Affinée",
        "Illusion multisensorielle cohérente."
      ],
      [
        "Supérieure",
        "Illusions multiples, réactives et partiellement autonomes."
      ],
      [
        "Magistrale",
        "Environnement perceptif complet et cohérent à grande échelle."
      ]
    ],
    "examples": [
      "Modifier une voix ou cacher visuellement un petit objet. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Observation opposée si quelqu’un a une raison de douter.",
      "Créer un déguisement visuel et sonore cohérent. Maîtrise min.: Affinée • Amplitude: Mineure • PA: 1 • Diff. base: 15 Esprit + Perception contre résultat si l’illusion est examinée.",
      "Transformer l’apparence d’une pièce entière. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien si illusion active et réactive.",
      "Imposer une hallucination ciblée à une personne. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte.",
      "Remplacer perceptivement un bâtiment ou une rue. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Les interactions physiques réelles peuvent trahir l’illusion.",
      "Imposer une fausse réalité cohérente à un quartier. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Très forte charge de maintien/Canalisation selon durée."
    ],
    "limits": [
      "• Illusion placée dans le monde : Esprit + Perception peut la confronter si le personnage dispose d’un motif de doute. Hallucination imposée : Défense occulte.",
      "• Une illusion ne devient pas physiquement réelle grâce à un gros DR.",
      "• Créer du sommeil, un monde de rêve autonome ou une illusion qui acquiert des effets matériels relève d’Œuvres personnelles/familiales."
    ]
  },
  {
    "title": "Pathomancie — magie des Malédictions",
    "description": [
      "La Pathomancie attache à une cible une règle négative surnaturelle : faiblesse, contrainte, condition, interdiction ou dégradation. Plus la règle est durable et sophistiquée, plus Maîtrise et Amplitude montent."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Gêne précise, courte et simple."
      ],
      [
        "Affinée",
        "Condition, déclencheur ou durée sérieuse."
      ],
      [
        "Supérieure",
        "Malédictions complexes, transmissibles ou multiconditionnelles."
      ],
      [
        "Magistrale",
        "Véritable loi personnelle surnaturelle ou fléau de grande ampleur."
      ]
    ],
    "examples": [
      "Imposer −3 sur une famille précise d’actions pendant un court moment. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense occulte.",
      "Faire dysfonctionner un objet ou fragiliser temporairement une capacité. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Objet : résistance éventuelle selon nature.",
      "Bloquer une capacité pendant une scène. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte ; préciser exactement ce qui est bloqué.",
      "Attacher une malédiction conditionnelle durable à une personne. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Durée/ancrage contribuent à l’Amplitude.",
      "Maudire durablement un groupe limité ou une organisation locale. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Cibles identifiables nécessaires.",
      "Imposer un fléau à une importante population ou zone. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Conditions et sélection doivent être définies avant le jet."
    ],
    "limits": [
      "• « Pour toujours » n’est jamais gratuit : durée longue, transmission et permanence font partie de la puissance réelle du sort.",
      "• Une malédiction doit définir clairement sa cible et sa règle ; les formulations vagues ne donnent pas plus de puissance.",
      "• Attaquer directement le Mageius d’un autre Mage, forcer le Revers ou arracher le Mageius sont des techniques spécialisées exceptionnelles."
    ]
  },
  {
    "title": "Skiamancie — magie des Ombres",
    "description": [
      "La Skiamancie contrôle l’Ombre comme substance et milieu surnaturel réel. Elle ne se confond ni avec l’absence de lumière ni avec une illusion."
    ],
    "mastery": [
      [
        "Maîtrise",
        "Ce qu’elle autorise"
      ],
      [
        "Initiale",
        "Étendre, déplacer ou épaissir une Ombre."
      ],
      [
        "Affinée",
        "Lui donner forme, consistance ou fonction simple."
      ],
      [
        "Supérieure",
        "Ombres autonomes, passages et zones occultantes complexes."
      ],
      [
        "Magistrale",
        "Utiliser l’Ombre comme véritable milieu métaphysique à grande échelle."
      ]
    ],
    "examples": [
      "Étendre une ombre ou créer un appendice sombre. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Peut fournir couvert/interaction selon effet annoncé.",
      "Engloutir une petite zone dans des ténèbres surnaturelles. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 La Photomancie peut interagir mais ne « dissipe » pas automatiquement l’Ombre.",
      "Créer plusieurs formes d’ombre capables d’interagir. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien si autonomie active.",
      "Passer entre deux ombres identifiées dans la portée autorisée. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Les deux extrémités doivent être désignables ; hors vue exige Technique/ancrage.",
      "Faire vivre les ombres d’un bâtiment entier. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Sélection et comportement dépendent de la Maîtrise.",
      "Transformer une portion urbaine en manifestation active de l’Ombre. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Effet métaphysique massif, très risqué pour le Voile."
    ],
    "limits": [
      "• Photomancie = lumière réelle ; Pseudomancie = perception ; Skiamancie = Ombre surnaturelle.",
      "• Un passage d’ombre générique ne permet pas de téléporter vers un lieu inconnu non désignable.",
      "• Créer des Deimons, royaumes d’ombre autonomes ou passages intermondes durables relève de Magies personnelles/familiales."
    ]
  }
];

const MAGIC_SCHOOL_BY_TITLE = new Map(MAGIC_SCHOOLS.map((school) => [school.title, school]));

/**
 * Restores the canonical table and card boundaries lost during the DOCX import.
 * Section identity, titles, levels and ordering remain those of the generated page.
 */
export function repairMageSchoolSections(sections: MagicRuleSection[]): MagicRuleSection[] {
  let activeSchool: MagicSchool | undefined;

  return sections.map((section) => {
    const school = MAGIC_SCHOOL_BY_TITLE.get(section.title);
    if (school) {
      activeSchool = school;
      return {
        ...section,
        blocks: [
          ...school.description.map((text): ParagraphBlock => ({ type: "p", text })),
          { type: "table", rows: school.mastery }
        ]
      };
    }

    if (activeSchool && section.title === "Exemples de sorts (repères, pas une liste fermée)") {
      return {
        ...section,
        blocks: activeSchool.examples.map((text): ParagraphBlock => ({
          type: "p",
          text: text.replaceAll(" • ", " — "),
          style: "tech"
        }))
      };
    }

    if (activeSchool && section.title === "Limites et garde-fous") {
      const limits = activeSchool.limits.map((text): ParagraphBlock => ({ type: "p", text, style: "list" }));
      activeSchool = undefined;
      return { ...section, blocks: limits };
    }

    return section;
  });
}
