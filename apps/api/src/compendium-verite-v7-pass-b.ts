import { editorializeTruthSections } from "./compendium-verite-v7-editorial.js";

type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };
type Section = { id: string; title: string; level: number; audience?: "mj"; blocks: Block[] };
type Article = {
  id: string;
  dataset: string;
  category: string;
  sourceCategory: string;
  title: string;
  source: string;
  status: string;
  rebuildV2: true;
  tags: string[];
  sections: Section[];
};

const SOURCE = "TUC_Verite_V7_CROSSAUDIT_2026-09-10.docx";

const article = (
  id: string,
  category: "Vérité" | "Règles",
  title: string,
  tags: string[],
  sections: Section[]
): Article => ({
  id,
  dataset: "verite-v7",
  category,
  sourceCategory: category,
  title,
  source: SOURCE,
  status: "canon_enrichi",
  rebuildV2: true,
  tags,
  sections: editorializeTruthSections(sections) as Section[]
});

const EXILES: Section[] = [
  {
    id: "peuples-autres-mondes",
    title: "Des peuples d’autres mondes devenus terrestres",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le terme Exilé désigne principalement les peuples venus d’Aèr par les passages entre les mondes, ainsi que quelques lignées issues de Gaerras ou de mondes aujourd’hui disparus. Elyë, Whurtens, Ashylls, Thulkars et Azménoriens forment les grandes communautés connues. Ils ne partagent ni biologie ni civilisation uniques : leur point commun est historique et cosmologique."
      },
      {
        type: "p",
        text: "Le mot donne facilement une image fausse de migration récente. Beaucoup de ces communautés vivent sur Terre depuis très longtemps, souvent depuis bien avant l’Hologramme. La majorité de leurs membres de 2035 sont nés ici, comme leurs parents et parfois des dizaines de générations avant eux. Aèr peut être une mémoire familiale, un héritage culturel, une destination lointaine ou un monde qu’ils n’ont jamais vu."
      },
      {
        type: "p",
        text: "L’ironie humaine tient à une histoire encore plus ancienne : l’Humanité elle-même possède une origine lointaine liée à Aèr qu’elle a oubliée. Les Exilés d’Aèr ne sont donc pas simplement des étrangers venus s’installer sur un monde humain ; ils vivent auprès d’un peuple qui a perdu la mémoire d’une part de sa propre histoire."
      }
    ]
  },
  {
    id: "cultures-transformees",
    title: "Des cultures transformées par la Terre",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les sociétés exilées terrestres ne sont pas des copies modernisées de celles d’Aèr. Des peuples autrefois séparés ont dû cohabiter, des traditions se sont mélangées et de nouvelles institutions sont nées pour répondre à des problèmes inconnus sur le monde d’origine. Les catastrophes, le Voile, la vie clandestine et les siècles de coexistence avec les sociétés humaines ont produit une histoire proprement terrestre."
      },
      {
        type: "p",
        text: "Un Elyë californien peut n’avoir jamais vu Aèr ; un Thulkar arrivé depuis six mois peut devoir apprendre simultanément la circulation, l’Holonet et le fonctionnement du Voile ; un Ashyll peut être plus à l’aise sur un marché clandestin de Los Angeles qu’un Humain né dans le même quartier. L’exil est donc moins une distance géographique qu’une relation à l’héritage."
      },
      {
        type: "p",
        text: "Pour beaucoup, la Californie ou la Terre entière est le seul foyer réellement vécu. Les nouveaux arrivants existent toujours, mais ils sont minoritaires face à des diasporas anciennes. La question centrale n’est plus seulement « d’où viens-tu ? », mais « quel monde considères-tu comme le tien ? »."
      }
    ]
  },
  {
    id: "silcenters",
    title: "Les Silcenters — villes de la seconde appartenance",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Silcenters sont souvent décrits comme des centres d’accueil, ce qui est beaucoup trop réducteur. Ce sont des communautés de Vérité complètes : logements, commerces, écoles, lieux de formation, réseaux de solidarité et infrastructures capables d’accueillir des morphologies ou usages que la Réalité ordinaire rend difficiles."
      },
      {
        type: "p",
        text: "Pour un nouvel arrivant, un Silcenter sert de sas vers le droit terrestre, la monnaie, la conduite, l’informatique, le Holonet et les comportements sociaux contemporains. Pour une famille installée depuis plusieurs générations, il peut n’être qu’un quartier où les grands-parents parlent d’Aèr sans mesurer chaque mot et où les enfants savent qu’ils ne sont pas seuls à posséder une autre forme sous le Voile."
      },
      {
        type: "p",
        text: "Le Conseil des Anciens donne au réseau une dimension politique sans transformer tous les Exilés en citoyens d’un État parallèle. Ses sièges, alliances et équilibres reflètent des histoires anciennes ; certaines communautés y sont mieux représentées que d’autres, et les structures de représentation peuvent paraître avoir vieilli moins vite que la société qu’elles organisent."
      },
      {
        type: "p",
        text: "Les Protocoles de Continuité sont nés de cette expérience collective : apprendre à passer entre états, agir ensemble et empêcher qu’une crise individuelle ne devienne une rupture publique. La HDS s’est développée comme spécialisation plus poussée dans certains cursus, particulièrement sous l’influence de l’Union Elfique. Ces disciplines ne définissent pas les Silcenters ; elles montrent comment une communauté transforme la contrainte du Voile en savoir transmissible."
      }
    ]
  },
  {
    id: "elye",
    title: "Elyë — vivre avec des siècles devant soi",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La longévité elyë transforme profondément la famille, l’éducation et la mémoire. Une décision politique peut encore être discutée par quelqu’un qui se souvient personnellement du contexte dans lequel elle fut prise plusieurs générations humaines plus tôt. Cette continuité ne garantit pas la sagesse : elle permet aussi de porter très longtemps fidélités, erreurs et traumatismes."
      },
      {
        type: "p",
        text: "Sur Terre, les anciennes lignées elfiques ont été fortement brassées par les migrations et les Silcenters. La culture moderne est moins obsédée par la pureté d’origine qu’une lecture simplifiée d’Aèr pourrait le laisser croire, même si certaines distinctions restent fortes lorsqu’elles touchent à la Guerre de la Magie ou à la manière dont l’Hologramme a modifié le développement des enfants."
      },
      {
        type: "p",
        text: "Chez les Elyë maintenus Voilés, l’Hologramme peut pousser la maturation physique vers un rythme proche de celui des Humains. Pour certains, cette adaptation a permis de sauver des générations après les catastrophes ; pour d’autres, elle a volé une part fondamentale de l’enfance elfique. L’affinité avec la Magie demeure importante sans faire de chaque Elyë un Mage."
      }
    ]
  },
  {
    id: "union-elfique-croix-emphyrra",
    title: "Union Elfique & Croix d’Emphyrra",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "L’Union Elfique est une force culturelle et scolaire majeure : elle préserve cursus, langues, mémoires et outils d’intégration. Son investissement dans la HDS répond à une question profondément elyë : comment vivre longtemps dans un monde dont la cohérence cherche continuellement à vous traduire ?"
      },
      {
        type: "p",
        text: "La Croix d’Emphyrra rassemble quatre traditions idéologiques, pas quatre sous-races. Le Faucon de Malachite valorise autonomie, terrain et rupture de l’artifice lorsqu’il devient une prison. Le Serpentaire de Citrine porte une exigence plus élitiste et une Haute Magie difficile d’accès. L’Aigle de Larvikite conserve un rapport plus intransigeant aux anciens dieux et aux rites. Le Hibou d’Onyx travaille avec les Ombres et des formes de symbiose qui inquiètent souvent ceux qui n’en connaissent que les manifestations."
      },
      {
        type: "p",
        text: "On n’y naît pas comme on naît Elyë : on entre dans ces traditions par l’éducation, l’adhésion, le mentorat et parfois des épreuves qui engagent une véritable vision du monde."
      }
    ]
  },
  {
    id: "whurtens",
    title: "Whurtens — faire durer le monde",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Whurtens ont conservé une relation profonde à l’artisanat, aux profondeurs, aux runes et à la fiabilité. Là où une improvisation brillante peut être admirée chez les Ashylls, le Whurten traditionnel veut surtout que la solution fonctionne encore dans vingt ans et qu’un autre artisan puisse la réparer en comprenant ce qui a été construit."
      },
      {
        type: "p",
        text: "Cette culture ne rejette ni électronique, ni augmentations, ni technologies terrestres. Elle demande ce qu’elles deviennent lorsque la maintenance disparaît, qui possède les plans et combien de temps les pièces resteront remplaçables. Une civilisation de produits jetables peut donc paraître techniquement brillante et culturellement absurde."
      },
      {
        type: "p",
        text: "Les Ymirin incarnent surtout une force politique et institutionnelle liée aux sièges whurtens du Conseil des Anciens. Les Elegarin sont plus ouverts à la mixité, au commerce et aux échanges ; les Traditionalistes portent davantage les runes, les clans, les anciens dieux, les langues et les savoirs. Les Duergar Nidavellin et Vagorrin appartiennent à des branches beaucoup plus difficiles à intégrer dans une vie ordinaire et ne représentent pas la trajectoire normale d’un Whurten terrestre de 2035."
      }
    ]
  },
  {
    id: "atelier-iron-law",
    title: "Atelier des Clans & Iron Law",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "L’Atelier des Clans transpose la philosophie whurtenne de maintenance au monde moderne : restaurer, fiabiliser, régler et prolonger la vie d’un équipement réel devient une discipline en soi, qu’il soit terrestre, exilé ou hybride."
      },
      {
        type: "p",
        text: "Iron Law pousse une idée différente mais apparentée : une augmentation ne devrait pas être un empilement de fonctions fragiles, mais une architecture assez robuste pour devenir une part durable de l’individu sans le condamner à une dépendance permanente. L’idéologie est transespèce, même si elle reste fortement marquée par la pensée whurtenne."
      }
    ]
  },
  {
    id: "ashylls",
    title: "Ashylls — survivre entre les systèmes",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Ashylls ont fait de l’adaptation une culture. Leur morphologie, leur ouïe et leur génie technique comptent, mais leur force historique vient surtout de leur capacité à comprendre comment circule la valeur : argent, information, accès, dette, faveur ou marchandise."
      },
      {
        type: "p",
        text: "La Terre offre presque un environnement idéal à cette compétence : juridictions superposées, corporations, chaînes logistiques, mafias et Underlife. Un Ashyll n’est pas naturellement criminel ; il appartient simplement à une culture qui sait depuis longtemps que la différence entre un marché et une frontière dépend souvent de celui qui écrit la règle."
      }
    ]
  },
  {
    id: "green-union-ligue-jade",
    title: "Green Union, Ligue des Quatre Empereurs & Syndicat de Jade",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "La Green Union représente une stratégie d’intégration et de respectabilité : travailler avec Silcenters, institutions et réseaux légaux pour qu’un jeune Ashyll puisse étudier, travailler ou créer une entreprise sans devoir commencer sa vie par le marché noir. Ses critiques craignent toutefois que l’intégration devienne conformité et fasse oublier les réseaux qui ont permis au peuple de survivre."
      },
      {
        type: "p",
        text: "La Ligue des Quatre Empereurs ne confond pas richesse et argent liquide. Elle construit avant la négociation un environnement de sociétés écrans, structures juridiques, capitaux, contrats, positions de marché et menaces. Sa culture considère la conversation comme la dernière étape d’un travail de pouvoir commencé bien avant."
      },
      {
        type: "p",
        text: "Le Syndicat de Jade est l’une des grandes infrastructures criminelles de l’Underlife de Vérité. Protection, contrebande, courtage occulte et circulation de marchandises impossibles à transporter proprement font sa force. Son efficacité tient au réseau : savoir si une chose existe, qui la transporte, quel risque elle représente et ce qui sera demandé en échange. Le Syndicat n’est pas exclusivement ashyll ; les Thulkars y disposent aussi d’un accès important et d’autres Exilés peuvent y être intégrés."
      }
    ]
  },
  {
    id: "thulkars",
    title: "Thulkars — la Horde comme culture, pas comme foule",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La puissance physique des Thulkars est évidente, mais leurs Hordes montrent pourquoi elle ne suffit pas à définir leur civilisation. Une Horde est une culture d’action collective avec sa doctrine, ses valeurs, sa façon de se déplacer, de combattre et de définir la réussite. Deux Thulkars peuvent partager une anatomie et diverger presque sur tout le reste. La Formation de Horde commune enseigne les réflexes qui permettent à plusieurs individus de fonctionner comme un ensemble — se déployer, s’épauler, relever quelqu’un ou déplacer une formation — avant que les doctrines spécialisées ne donnent un sens propre à cette coordination."
      },
      {
        type: "p",
        text: "La Horde Divine est tactique : plans, fixation de cible, ripostes et coordination héritées d’Ashorn. La Horde des Marais privilégie l’opportunisme et la capacité à exploiter une faiblesse plutôt qu’une pureté tactique abstraite. La Horde Fantôme travaille l’intégration, l’identité cloisonnée et la disparition dans la Réalité ; beaucoup de ses membres sont nés sur Terre et sa spécialité n’est donc pas de « jouer l’Humain », mais de maintenir plusieurs couches de vie sous pression."
      },
      {
        type: "p",
        text: "La Horde des Cendres fait de la construction, de l’infrastructure, de la réparation et de la logistique une véritable doctrine de guerre. La Horde de la Rose valorise polyvalence, éducation, arts, représentation et formation croisée, en refusant le stéréotype de l’Orque réduit à la force brute."
      },
      {
        type: "p",
        text: "Les Hordes Abyssale et Maudite appartiennent à des trajectoires plus sombres. La première se rapproche de la Corruption de Thul lorsqu’elle est réellement corrompue ; la seconde demeure un élément de lore sans progression PJ propre. D’autres petites Hordes existent sans nécessairement justifier une doctrine universellement enseignée."
      }
    ]
  },
  {
    id: "azmenoriens",
    title: "Azménoriens — survivants d’une réussite trop grande",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Azménoriens portent une relation unique entre magie et technologie. Leur âge d’or a démontré que lois naturelles et transgression magique pouvaient coopérer à des échelles que les civilisations modernes ne savent plus reproduire. Il a aussi démontré qu’une réussite suffisamment grande peut devenir plus dangereuse qu’un échec."
      },
      {
        type: "p",
        text: "La Technomagie ancienne a permis des Portails des Mondes stables, des manipulations du Néant et des architectures dont l’Hologramme planétaire reste l’un des héritages les plus impressionnants. La catastrophe qui suivit explique une culture moderne beaucoup plus méfiante envers l’expansion incontrôlée."
      },
      {
        type: "p",
        text: "Les Servants de Pluton sont experts des technologies xéno et de la discrétion stratégique. Ils considèrent que la Terre devient dangereuse non parce qu’elle est faible, mais parce qu’elle réunit de nouveau croissance technologique rapide et forte densité magique. Leur objectif est aussi d’éviter qu’elle devienne assez visible ou ambitieuse pour attirer une attention galactique qu’elle ne pourrait pas supporter. Cette doctrine crée avec l’AIDH une relation faite de compréhension mutuelle du danger et de profonde méfiance sur la manière de le gérer."
      }
    ]
  },
  {
    id: "technomagie-moderne",
    title: "Technomagie moderne & Lueurs d’Azménor",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "La reconstruction moderne n’essaie pas de restaurer immédiatement l’âge d’or. Elle travaille par procédures limitées : Convergence entre systèmes physiques et magiques, Fracture locale de certaines continuités, Arsenal de Rupture capable d’observer ou d’agir sous le Voile. Un prototype peut être utilisé par quelqu’un qui n’est pas technomage si sa conception le permet ; la compétence exceptionnelle appartient à celui qui sait le construire, pas à l’objet lui-même."
      },
      {
        type: "p",
        text: "Les Lueurs d’Azménor suivent une autre trajectoire, tournée vers la Chasse, les Fléaux et le Néant. Elles rappellent que l’héritage azménorien ne se réduit pas à la technique : lorsqu’un peuple a déjà ouvert des portes qu’il aurait préféré ne jamais voir, certains descendants consacrent leur existence à reconnaître ce qui cherche encore à passer."
      }
    ]
  },
  {
    id: "societe-exilee",
    title: "Une société exilée, pas cinq musées",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "En 2035, ces peuples se croisent depuis suffisamment longtemps pour que les frontières culturelles restent réelles sans être étanches. Un Whurten peut apprendre dans un atelier ashyll, un Elyë travailler avec des Thulkars, un Azménorien vivre dans un Silcenter dominé par d’autres traditions. Les organisations accueillent parfois des membres extérieurs lorsqu’ils possèdent les relations et la formation nécessaires."
      },
      {
        type: "p",
        text: "L’Exilé moderne se définit donc moins par une fidélité obligatoire à un peuple que par la manière dont il choisit de porter un héritage qui a déjà changé. La Terre n’est plus seulement le lieu de l’exil. Pour beaucoup, elle est devenue la maison où cet héritage a appris à survivre."
      }
    ]
  }
];

const EXTRALS: Section[] = [
  {
    id: "histoire-galactique",
    title: "Des peuples de l’Histoire galactique",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Extrals viennent de civilisations galactiques ayant développé le voyage spatial et rencontré l’Humanité loin de la Terre. Leur implantation terrestre est globalement beaucoup plus récente que celle des Exilés. Il n’existe aucune « technologie extrale » unique : chaque civilisation a suivi ses propres paradigmes."
      },
      {
        type: "p",
        text: "Le Voile peut traduire une morphologie, mais il ne supprime ni besoins biologiques, ni culture, ni habitudes de communication, ni incompatibilités techniques. Les diasporas dépendent donc de logements adaptés, soins xénobiologiques, interfaces, chaînes alimentaires et institutions capables de traiter une anatomie officiellement inexistante."
      }
    ]
  },
  {
    id: "cinq-peuples",
    title: "Les cinq principales communautés terrestres",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Peuple", "Repère"],
          ["Talass", "Petits êtres segmentaires, soie très conductrice, aptitudes psychiques et culture privilégiant intellect, technique et réduction de la violence."],
          ["Mo’sen", "Reptiloïdes cuirassés marqués par une histoire de domination ; indépendance et contrôle des conditions de protection sont des enjeux centraux."],
          ["Baséanh", "Quatre bras, six yeux et Tardollas : leur propre biologie peut servir d’infrastructure de culture et de technologie vivante."],
          ["Rocréen", "Molluscoïdes amphibies à Noyau régénératif, communication psychique et diasporas clandestines particulièrement solides."],
          ["Thalsios", "Amphibioïdes massifs très sensibles à l’humidité, précis de leurs mains et culturellement tournés vers réparation, adaptation et résolution concrète."]
        ]
      }
    ]
  },
  {
    id: "gaac-organisations",
    title: "GAAC, organisations et diasporas",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le GAAC représente, négocie et facilite l’intégration sans constituer un gouvernement unique. Il fournit procédures, relais, interlocuteurs et légitimité à des communautés qui conservent leurs propres citoyennetés, diasporas et fidélités."
      },
      {
        type: "p",
        text: "La CTU cherche à rendre transmissibles des technologies trop avancées pour rester des boîtes noires importées. La Croix Verte adapte localement habitats et soins à plusieurs physiologies. REPTILE protège les intérêts mo’sens par l’influence et l’infiltration. La Mafia Shaediri maîtrise les derniers kilomètres du marché noir galactique, tandis qu’Hydroguard travaille là où l’environnement lui-même devient une menace opérationnelle."
      }
    ]
  },
  {
    id: "catalogue-builder",
    title: "Un catalogue canonique de 161 Talents",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Famille", "Nombre"],
          ["Profils Talass, Mo’sen, Baséanh, Rocréen & Thalsios", 61],
          ["Protocoles de Continuité", 4],
          ["Organisations Extrals", 56],
          ["Sous-total de cette page", 121]
        ]
      },
      {
        type: "p",
        text: "Le Builder reste la source mécanique détaillée. Cette page couvre les cinq communautés principales, les Protocoles de Continuité et les organisations Extrals ; Homo Superior, Ad’rak et les doctrines AIDH disposent d’une page distincte afin de ne pas confondre diaspora extrale, humanité transformée et espèce rare."
      }
    ]
  }
];

const HOMO_ADRAK: Section[] = [
  {
    id: "aidh",
    title: "AIDH — une Humanité des Mondes Technologiques",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "L’AIDH appartient aux Mondes Technologiques humains et son centre historique se situe dans le système d’Ichéi. Pour beaucoup de ses membres, la Terre est une planète humaine périphérique. L’organisation possède des sciences et infrastructures très supérieures aux standards terrestres dans plusieurs domaines."
      },
      {
        type: "p",
        text: "Invariants, capteurs de cohérence, confinement, biphysique et anti-possession permettent d’interagir avec Terra Umbra sans rendre l’AIDH omnisciente ni propriétaire de l’Hologramme. Sa relation à la Terre mêle protection, surveillance et intérêt stratégique."
      }
    ]
  },
  {
    id: "homo-superior",
    title: "Homo Superior — une extrémité de la science humaine",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Homo Superior restent des Humains. Génétique, nanites, conditionnement et optimisation neurologique poussent leurs capacités assez loin pour que la distinction paraisse moins évidente à un observateur terrestre, mais il ne s’agit jamais d’une nouvelle espèce."
      },
      {
        type: "p",
        text: "Ils représentent un programme et une culture du corps propres à l’AIDH. Les Seigneur-Généraux restent des figures hors échelle PJ : ils ne constituent pas le dernier rang naturel de la progression Homo Superior."
      }
    ]
  },
  {
    id: "adrak",
    title: "Ad’rak — les géants qui ne résument pas leur empire",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Ad’rak sont une espèce extrale véritable, très grande et extrêmement puissante physiquement. Les individus présents sur Terre sont surtout réfugiés, dissidents, descendants de communautés libres ou anciens sujets ayant échappé à l’Armée noire."
      },
      {
        type: "p",
        text: "Un PJ Ad’rak loyal à l’Armée noire n’est pas le cadre ordinaire de cette origine. Leur existence rappelle surtout que les cinq peuples représentés autour du GAAC ne constituent qu’une fraction des civilisations galactiques possibles."
      }
    ]
  },
  {
    id: "distinction",
    title: "Deux profils rares, deux statuts différents",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Profil", "Nature", "Repère"],
          ["Homo Superior", "Humain", "Humanité transformée par les sciences AIDH ; aucune espèce nouvelle."],
          ["Ad’rak", "Extral", "Espèce véritable ; origine PJ restreinte dans le cadre terrestre."]
        ]
      }
    ]
  },
  {
    id: "builder",
    title: "Repère Builder",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Famille", "Talents"],
          ["Homo Superior", 12],
          ["Ad’rak", 20],
          ["Doctrines AIDH", 8],
          ["Total", 40]
        ]
      },
      {
        type: "p",
        text: "Le détail mécanique reste dans le Builder. Cette page sert précisément à empêcher trois confusions : Homo Superior n’est pas un Extral, Ad’rak n’est pas un programme humain, et l’AIDH n’est pas une espèce."
      }
    ]
  }
];

const CHASSEURS: Section[] = [
  {
    id: "du-temoin-au-chasseur",
    title: "Du témoin au Chasseur",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le premier trait commun aux Chasseurs est de s’être souvenus. Certains Humains survivent à la Vérité sans laisser le Voile recoudre complètement leur perception. Ils deviennent réellement Chasseurs lorsqu’ils apprennent à agir consciemment dans ce monde et que l’Hologramme cesse de traiter leurs souvenirs comme ceux d’un civil à reconduire vers l’ignorance."
      },
      {
        type: "p",
        text: "La Chasse commence par l’identification. Une faiblesse folklorique fausse, une munition inadéquate ou une méthode de neutralisation incomplète tue plus sûrement qu’un manque de courage. Le Chasseur expérimenté demande d’abord ce qu’est la cible et ce qu’elle a fait, avant de demander comment elle meurt."
      }
    ]
  },
  {
    id: "association",
    title: "L’Association comme infrastructure de survie",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Morrighan a fondé l’Association des Chasseurs pour fournir une infrastructure commune, pas une doctrine unique. Bars, restaurants, garages et ateliers servent de relais d’information, de matériel, de contrats et d’expérience. Les anciens Chasseurs y conservent une valeur considérable même lorsqu’ils ne peuvent plus partir sur le terrain."
      },
      {
        type: "p",
        text: "La Confrérie du Bestiaire documente créatures et phénomènes, mais ses dossiers restent des observations faillibles. Les habilitations GT structurent la confiance par domaines ; elles donnent accès à des dossiers et interlocuteurs, jamais gratuitement à une arme, une relique ou un prototype."
      }
    ]
  },
  {
    id: "habilitations",
    title: "Habilitations GT",
    level: 3,
    blocks: [
      {
        type: "table",
        rows: [
          ["Code", "Domaine"],
          ["GT-01", "Surnaturel général / opérations de base"],
          ["GT-11", "Surnaturels civilisés, notamment Vampires et Garous"],
          ["GT-02", "Féerique et petites créatures monstrueuses"],
          ["GT-22", "Elfique / Aèr / Exilés"],
          ["GT-03", "Extrals invasifs de danger limité"],
          ["GT-33", "Domaine Extral large"],
          ["GT-00", "Habilitation transversale exceptionnelle"]
        ]
      },
      {
        type: "p",
        text: "Hunt100 est une reconnaissance tardive exceptionnelle et narrative. Hunt15 relève du worldbuilding légendaire et n’est pas une progression PJ. Observers et Confrérie du Bestiaire sont des fonctions ou statuts, pas des arbres de PTV."
      }
    ]
  },
  {
    id: "chasser-n-est-pas-hair",
    title: "Chasser n’est pas haïr une espèce",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Une Nature ne prouve ni culpabilité ni innocence. Un Vampire peut être criminel ou allié, un Exilé la victime et un Angelus la source du problème. Les traditions sérieuses séparent Nature et comportement. Xenoshield illustre l’échec inverse : de vraies compétences techniques contre les Extrals deviennent dangereuses lorsqu’elles sont transformées en certitudes morales."
      }
    ]
  },
  {
    id: "traditions",
    title: "Les grandes traditions",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Tradition", "Repère"],
          ["Lavandières", "Vampires indépendants spécialisés contre Vampires dangereux, Moroï et Strygoï."],
          ["Ordres catholiques", "Arianwen pour la traque, Ephraïm pour l’exorcisme, Magdalena pour jugement et scellement."],
          ["Khālsā", "Serment, protection, liberté et rupture des emprises."],
          ["Taoïstes Gu et Shimazu / Shi", "Équilibre du Yin et du Yang ; les secrets Shi utilisent un contact méthodique et dangereux avec le Néant."],
          ["Kabbale", "Principes des dix Sephiroth sans devenir Angelus."],
          ["Nizarites", "Arts du Djinn et doctrine de Chasse."],
          ["Onmyoji", "Shikigami, sceaux, noms et pactes spirituels."],
          ["Néopaïens", "Morts, terre, seuils, présages et serments."],
          ["Chasse Fantastique", "Héritage de la Vénerie elfique née de la Guerre de la Magie."],
          ["Lueurs d’Azménor", "Visions réelles du Néant sans garantie d’interprétation correcte."],
          ["Xenoshield", "Contre-intrusion Extral techniquement compétente mais idéologiquement xénophobe."],
          ["Indépendants", "Héritages familiaux, traumatismes, bricolages et spécialisations sans doctrine commune."],
          ["Table Ronde", "Lignées des chevaliers choisis par Merlin et armes uniques créées pour leurs héritiers."]
        ]
      }
    ]
  },
  {
    id: "catalogue-builder",
    title: "Un catalogue canonique de 266 Talents",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Famille", "Nombre"],
          ["Doctrine commune de Chasse", 4],
          ["Lavandières", 4],
          ["Chasseurs catholiques", 40],
          ["Khālsā", 20],
          ["Taoïstes", 20],
          ["Kabbale", 20],
          ["Nizarites / Asāsīyūn", 18],
          ["Onmyoji", 20],
          ["Néopaïens", 20],
          ["Chasse Fantastique", 20],
          ["Lueurs d’Azménor", 20],
          ["Xenoshield", 20],
          ["Chasseurs indépendants", 20],
          ["Table Ronde", 20],
          ["Total", 266]
        ]
      },
      {
        type: "p",
        text: "Le détail des 266 Talents reste dans le Builder. Le Compendium conserve la logique de la Chasse, le rôle de l’Association, les habilitations, les traditions et la distinction essentielle entre méthode spécialisée et vérité universelle."
      }
    ]
  }
];

const CORRUPTION: Section[] = [
  {
    id: "humanite-integrite",
    title: "Humanité & Intégrité",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Humanité mesure la continuité de l’identité, du libre arbitre et du rapport au corps malgré les transformations. Le terme est métaphysique : il ne mesure ni l’espèce ni la ressemblance avec Homo sapiens. L’Intégrité vaut Force Mentale + Humanité, minimum 1, en ne comptant que les valeurs permanentes."
      },
      {
        type: "p",
        text: "Charge augmentique et Corruption utilisent la même limite d’Intégrité mais restent deux jauges indépendantes : elles ne s’additionnent jamais et l’une ne réduit pas le seuil de l’autre. Le Stress augmentique maximal vaut Vigueur + Humanité."
      }
    ]
  },
  {
    id: "profondeur",
    title: "Profondeur de l’emprise",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["État", "Condition", "Conséquence générale"],
          ["Sain", "Corruption 0", "Aucune Source dominante ; Dons de Corruption dormants."],
          ["Marqué", "Corruption 1+", "Premiers Dons de la Source accessibles."],
          ["Envahi", "Corruption ≥ moitié de l’Intégrité, arrondie au supérieur", "Dons de profondeur moyenne accessibles."],
          ["Au bord de la Rupture", "Corruption ≥ max(1, Intégrité − 1)", "Dons les plus dangereux accessibles."],
          ["Seuil atteint", "Corruption = Intégrité", "Test de Bascule immédiat."]
        ]
      },
      {
        type: "p",
        text: "La Corruption ne récupère jamais naturellement par repos, thérapie, temps ou simple éloignement d’un culte. La réduire exige un moyen rare et explicitement capable de purifier la Source."
      }
    ]
  },
  {
    id: "sources-concurrentes",
    title: "Une seule Source dominante",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Un personnage n’a qu’une seule jauge de Corruption. Si une nouvelle Source de Fléau tente d’entrer, on résout d’abord le gain réel puis on compare l’emprise actuelle à la quantité entrante. La plus forte assimile l’autre et tous les points deviennent ceux de la Source dominante."
      },
      {
        type: "p",
        text: "En cas d’égalité exacte, la préséance est : V’Aagor → Sharith → Vhodhal → Vhadhi → Shaoggith → Thul. Cette liste ne mesure jamais la puissance cosmique ; elle sert uniquement à départager deux emprises égales sur un même individu."
      }
    ]
  },
  {
    id: "exposition",
    title: "Exposition & gain de Corruption",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Vecteur", "Test"],
          ["Physique / biologique", "Vigueur + Constitution + 1d10e"],
          ["Mental / spirituel / essentiel", "Volonté + Force Mentale + 1d10e"]
        ]
      },
      {
        type: "table",
        rows: [
          ["Intensité", "Difficulté"],
          ["Mineure", 12],
          ["Courante", 15],
          ["Forte", 18],
          ["Majeure", 21],
          ["Exceptionnelle", 25]
        ]
      },
      {
        type: "p",
        text: "Réussite : aucune Corruption. Échec : +1 Corruption de la Source. Échec narratif : +2. Humanité n’est pas ajoutée au test : elle fixe l’Intégrité. Un Test de Corruption ou de Souillure ne bénéficie normalement ni d’Assistance ni de Prendre son temps, sauf règle explicitement conçue pour cela."
      },
      {
        type: "p",
        text: "Une exposition environnementale continue à un même vecteur ordinaire ne provoque normalement qu’un seul test par scène, sauf hausse réelle d’intensité ou nouveau vecteur. Les activations surnaturelles de culte sont chacune une nouvelle ouverture et peuvent provoquer leur propre Souillure."
      }
    ]
  },
  {
    id: "don-rite-faveur",
    title: "DON, RITE & FAVEUR",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Type", "Définition", "Après purification ou rupture"],
          ["DON", "Capacité rendue possible par la Corruption déjà présente.", "Devient dormant si la Source change ou si la profondeur requise n’est plus atteinte."],
          ["RITE", "Technique apprise manipulant un principe de Fléau.", "Reste connue ; l’utiliser demeure corrupteur."],
          ["FAVEUR", "Pouvoir accordé ou alimenté par un Patron, une marque ou un lien extérieur.", "Devient dormante si le lien correspondant est réellement rompu."]
        ]
      },
      {
        type: "p",
        text: "Les PTV achètent la maîtrise de Dons auxquels la Source et la profondeur donnent accès. Un seul arbre de Dons de Corruption est actif à la fois. Les Dons d’une ancienne Source restent sur la fiche mais deviennent dormants et leurs PTV ne sont jamais remboursés."
      }
    ]
  },
  {
    id: "souillure",
    title: "Souillure des Rites & Faveurs",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Coût du pouvoir", "Difficulté de Souillure"],
          ["1 PTV", "15 — Normal"],
          ["2 PTV", "18 — Difficile"],
          ["3 PTV", "21 — Très difficile"],
          ["Exceptionnel", "25 si le texte l’indique"]
        ]
      },
      {
        type: "p",
        text: "Chaque activation surnaturelle d’un RITE ou d’une FAVEUR provoque un Test de Souillure, même si le pouvoir principal échoue. Par défaut il utilise Volonté + Force Mentale ; un pouvoir explicitement corporel peut utiliser Vigueur + Constitution. Un maintien ne reteste qu’à l’activation initiale."
      },
      {
        type: "p",
        text: "Un DON personnel n’impose pas de Souillure à chaque usage par défaut : il exploite une Corruption déjà installée. Certains Dons ou pouvoirs indiquent toutefois un gain automatique de Corruption, qui peut s’ajouter au Test de Souillure d’un RITE ou d’une FAVEUR."
      }
    ]
  },
  {
    id: "bascule",
    title: "Atteindre l’Intégrité — la Bascule",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Lorsque Corruption = Intégrité, effectuer immédiatement Volonté + Maîtrise spirituelle + 1d10e contre difficulté 18. En réussite, le personnage tient mais reste à Corruption maximale. Toute nouvelle exposition qui aurait dû ajouter au moins 1 point déclenche un nouveau Test de Bascule."
      },
      {
        type: "p",
        text: "En échec, la Source dominante produit normalement une Rupture et le personnage sort du cadre PJ standard. La forme dépend du Fléau, des Dons, du culte, de la dernière exposition et de la Nature d’origine."
      }
    ]
  },
  {
    id: "purification",
    title: "Purification & objets souillés",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Une purification explicite retire seulement le nombre de points indiqué. À 0, la Source dominante disparaît et les Dons deviennent dormants ; les Rites restent connus et les Faveurs ne cessent que si leur lien externe est réellement rompu."
      },
      {
        type: "p",
        text: "Purifier un porteur ne purifie pas automatiquement une relique, une greffe ou une Calamitechnologie. Un objet corrompu indique sa Source, son vecteur, la difficulté et fréquence de Souillure, ses propriétés, contrecoups et moyens de confinement. Il ne donne jamais automatiquement les Dons du Fléau."
      }
    ]
  }
];

const FLEAUX: Section[] = [
  {
    id: "cadre",
    title: "Six Sources cosmiques",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les six Fléaux ne sont ni des espèces jouables ordinaires ni des classes. Ce sont des puissances cosmiques dont l’essence altère êtres, lieux et parfois systèmes. La partie jouable se situe avant la Rupture : le personnage conserve sa Nature et ses relations tout en portant une Source qui ouvre progressivement des Dons."
      },
      {
        type: "table",
        rows: [
          ["Fléau", "Principe", "Corruption", "Tentation"],
          ["Vhodhal", "Dévorer", "Famine Blanche", "Tout peut devenir nourriture."],
          ["V’Aagor", "Annexer / unir", "Sombre-Vérité", "Tout peut devenir une partie de moi."],
          ["Ux’Sharith", "Séparer / décomposer", "Division", "Tout possède une ligne de coupe."],
          ["C’Thath Vhadhi", "Réaffecter / adapter", "Métastase", "Je peux devenir la solution."],
          ["Gajh’Shaoggith", "Engendrer / proliférer", "Germination", "Je peux mettre la solution au monde."],
          ["Thul", "Fixer / empêcher le devenir", "Fixation", "Pourquoi laisser quoi que ce soit changer ?"]
        ]
      }
    ]
  },
  {
    id: "echelle",
    title: "Fléaux Anciens, supérieurs & Abominations",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les six grandes Sources sont des Fléaux Anciens : leur essence agit presque comme une loi hostile du monde. Un Fléau supérieur peut naître d’une convergence, d’un fragment autonome, d’une descendance impossible ou d’une conséquence devenue immense. Les Fléaux inférieurs et Abominations sont des êtres réécrits, créations fonctionnelles ou Ruptures devenues inséparables d’une Source."
      },
      {
        type: "p",
        text: "Vaincre une manifestation, un avatar ou une Abomination ne signifie pas avoir tué la puissance cosmique. Les Fléaux Anciens et supérieurs n’utilisent normalement pas de profil de mort ordinaire."
      }
    ]
  },
  {
    id: "rupture-et-cultes",
    title: "Rupture, Hologramme & cultes",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "À la Bascule, la Corruption cesse d’être quelque chose dans le personnage et devient ce qu’il est. Avant Rupture, l’Hologramme le traite normalement selon sa Nature d’origine ; après Rupture, aucune traduction humaine cohérente n’est garantie."
      },
      {
        type: "p",
        text: "Une voie de culte n’est pas nécessairement une voie de Corruption. RITES et FAVEURS peuvent être appris ou reçus à Corruption 0, mais leur emploi provoque la Souillure. Les Dons dépendent au contraire de la Source dominante et de la profondeur d’emprise."
      }
    ]
  },
  {
    id: "dons",
    title: "Les Dons ne sont pas un second catalogue de Compendium",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les arbres de Dons décrivent ce que chaque Source permet avant la Rupture. Ils suivent le moteur commun DON / RITE / FAVEUR, les seuils Marqué, Envahi et Au bord, ainsi que les règles de Souillure et de Bascule. Le Compendium conserve ces principes et les identités des six Sources sans transformer chaque Fléau en une page-listing mécanique."
      }
    ]
  }
];

const DELANIAL: Section[] = [
  {
    id: "rumeur",
    title: "Le Père de l’Ombre",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Dans certains dossiers et cultes de l’Ombre-Monde, Delanial est appelé Septième Fléau, Fléau de l’Ombre-Monde ou Père de l’Ombre. Des Ombres, Dives et Deimons ont interprété son passage comme celui d’un créateur, au point qu’un culte décentralisé lui a survécu."
      },
      {
        type: "p",
        text: "Les récits les mieux informés insistent surtout sur l’ancienneté, la puissance passive et l’influence profonde de Delanial dans l’Ombre-Monde. Les certitudes publiques s’arrêtent là : ses véritables rapports avec les grandes puissances ne sont pas une connaissance ordinaire."
      }
    ]
  },
  {
    id: "classification-mj",
    title: "Classification MJ — le faux Septième Fléau",
    level: 2,
    audience: "mj",
    blocks: [
      {
        type: "p",
        text: "Delanial n’est pas un Fléau. C’est un Légionnaire des Puissances, réfugié qui cherche à demeurer caché des autres Puissances. Il n’existe aucune Source de Corruption Delanial, aucun Don, aucune Bascule et aucune place pour lui dans la préséance des six Fléaux."
      },
      {
        type: "p",
        text: "Il peut exercer une influence comparable à une Source et affronter des manifestations de niveau Fléau sans devenir un « super-Fléau ». Son intervention contre V’Aagor puis l’effacement de cette intervention relèvent d’une catégorie cosmologique différente."
      }
    ]
  },
  {
    id: "ombremonde-mj",
    title: "Ombre-Monde, Anahita & Morrighan",
    level: 2,
    audience: "mj",
    blocks: [
      {
        type: "p",
        text: "Delanial s’est réfugié dans l’Ombre-Monde et a profondément participé à sa structuration sans posséder toute la dimension ni toutes les Ombres. Il a créé le Mageius d’Anahita lors d’un événement unique, non reproductible par Talent ou Rite. Morrighan fait partie des très rares personnes qui le connaissent comme individu."
      },
      {
        type: "p",
        text: "Le culte du Père de l’Ombre ne lui obéit pas : Delanial a tenté de le supprimer et il n’ouvre aucune progression PTV. Il n’a pas de fiche de combat ordinaire ; on peut négocier, obtenir une aide, contrer une conséquence ou une projection, mais pas le réduire à une réserve de PV."
      }
    ]
  }
];

const EQUIPEMENT: Section[] = [
  {
    id: "loi-commune",
    title: "Objet réel, disponibilité réelle, acquisition fictionnelle",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Tous les catalogues de Vérité suivent la même loi : les réseaux ouvrent des voies d’accès, ils ne créent pas la marchandise. Un Talent, une habilitation ou des PTV ne donnent jamais automatiquement un objet. Prix, dette, relation, commande, mission, vol ou autorisation restent des éléments de fiction réels."
      },
      {
        type: "p",
        text: "L’équipement de Chasse ne remplace pas le catalogue d’armement de Réalité. Lorsqu’un objet terrestre existe déjà, son profil profane et son prix de base restent ceux du catalogue unifié ; Vérité n’ajoute que les propriétés surnaturelles, usages de Chasse, statuts ou modifications explicitement indiqués."
      }
    ]
  },
  {
    id: "proprietes",
    title: "Propriétés communes",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Propriété", "Règle"],
          ["Perforant X", "Ignore X points d’Armure matérielle seulement."],
          ["Sacré", "Consécration réelle ; n’agit que sur vulnérabilités et Talents qui la reconnaissent."],
          ["Angélique", "Sacré céleste ; divin lorsque la règle concernée le prévoit."],
          ["Solaire", "Effet surnaturel de Soleil ; des UV ordinaires ne sont pas le Soleil."],
          ["Incendiaire", "Feu ; une Altération appropriée peut Enflammer."],
          ["EMP / Ion", "Affecte les systèmes technologiques exposés, pas la magie, l’âme ou une biologie purement organique."],
          ["Invariant", "Résiste aux corrections ordinaires ; ne voit jamais plus que le capteur auquel il est relié."],
          ["Calibré", "Préparé contre une signature connue ; jamais universel."],
          ["Surchauffe", "Impose un refroidissement après usage intensif selon le profil."],
          ["Verrouillé", "Exige une autorisation biologique, psychique, nanitique ou cryptographique."]
        ]
      }
    ]
  },
  {
    id: "chasse",
    title: "Équipement de Chasse",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "L’arsenal de Chasse combine armes profanes adaptées, munitions spécialisées, matériel rituel, capture physique, confinement, investigation et prototypes Raven. Une faiblesse n’existe que si la cible la possède réellement : l’argent, le fer froid, le Sacré ou le Solaire ne deviennent jamais des bonus génériques contre « le surnaturel »."
      },
      {
        type: "p",
        text: "Les dispositifs de contention doivent correspondre au mécanisme réellement identifié. Une cage calibrée contre l’immatérialité n’arrête pas par principe une téléportation, une extraction technologique ou une magie sans rapport. Cette logique de diagnostic reste centrale dans tout l’équipement spécialisé."
      }
    ]
  },
  {
    id: "marche-exile",
    title: "Marché de Vérité des Exilés",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Jadecenters et Palameta alimentent un marché noir magique ; les ateliers whurtens fournissent runes, supports et réparations ; les réseaux azménoriens produisent des prototypes technomagiques ; loges et marchés occultes font circuler consommables et reliques mineures. Les grandes pièces antiques restent hors catalogue."
      },
      {
        type: "table",
        rows: [
          ["Rareté", "Disponibilité typique", "Ordre de prix terrestre"],
          ["V0 — courant", "Composant, support, arme ordinaire adaptée", "100 à 2 000 $"],
          ["V1 — spécialisé", "Rune chargée, capteur occulte simple, arme préparée", "2 000 à 10 000 $"],
          ["V2 — rare", "Objet runique durable, technomagie portable", "10 000 à 50 000 $"],
          ["V3 — prototype", "Arsenal de Rupture, installations de contention", "50 000 à 150 000 $"],
          ["V4 — exceptionnel", "Prototype majeur, pièce antique, commande politiquement sensible", "Prix + dette + scénario"]
        ]
      }
    ]
  },
  {
    id: "aidh",
    title: "Technologie AIDH & Cohérence",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le matériel AIDH générique est robuste, verrouillé, réparable avec les bonnes infrastructures et pensé pour fonctionner en réseau. L’intégration nanitique peut rendre une interface fluide sans créer de bonus gratuit de Compétence. Un capteur générique ne voit jamais automatiquement la Vérité d’une cible Voilée."
      },
      {
        type: "p",
        text: "Les appareils conçus pour Terra Umbra — invariants, capteurs de cohérence, ancrages, fenêtres d’observation, optiques de Vérité, quarantaine et anti-possession — soutiennent des fonctions précises. Ils ne remplacent pas les Talents de Cohérence et n’éteignent jamais l’Hologramme par simple présence."
      }
    ]
  },
  {
    id: "hors-catalogue",
    title: "Ce qui reste hors catalogue",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Armes de Merlin, Excalibur/Ymir, reliques divines majeures, objets cosmologiques, Portails des Mondes, composants structurants de l’Hologramme, artefacts personnels de figures légendaires et prototypes uniques de PNJ restent des objets de campagne. Ils ne possèdent ni prix ni niveau de rareté standard."
      }
    ]
  }
];

export const COMPENDIUM_VERITE_V7_PASS_B_ARTICLES: Article[] = [
  article(
    "verite-v7-exiles-peuples-silcenters-traditions",
    "Vérité",
    "Exilés — peuples d’Aèr & société terrestre",
    ["Vérité", "Exilés", "Aèr", "Silcenters", "Elyë", "Whurten", "Ashyll", "Thulkar", "Azménorien"],
    EXILES
  ),
  article(
    "verite-v7-extrals-gaac-aidh-diasporas",
    "Vérité",
    "Extrals — peuples galactiques & GAAC",
    ["Vérité", "Extrals", "GAAC", "Talass", "Mo’sen", "Baséanh", "Rocréen", "Thalsios"],
    EXTRALS
  ),
  article(
    "verite-v7-homo-superior-adrak-profils-rares",
    "Vérité",
    "Homo Superior & Ad’rak — profils rares",
    ["Vérité", "AIDH", "Homo Superior", "Ad’rak", "Profils rares", "Armée noire"],
    HOMO_ADRAK
  ),
  article(
    "verite-v7-chasseurs-doctrine-association-traditions",
    "Vérité",
    "Chasseurs — savoir, survivre & transmettre",
    ["Vérité", "Chasseurs", "Association", "GT", "Traditions de Chasse", "Confrérie du Bestiaire"],
    CHASSEURS
  ),
  article(
    "regles-verite-v7-corruption-integrite-bascule",
    "Règles",
    "Corruption, Souillure, Bascule & purification",
    ["Vérité", "Corruption", "Humanité", "Intégrité", "Souillure", "Bascule", "DON", "RITE", "FAVEUR"],
    CORRUPTION
  ),
  article(
    "verite-v7-six-fleaux-sources-rupture",
    "Vérité",
    "Les six Fléaux",
    ["Vérité", "Fléaux", "Vhodhal", "V’Aagor", "Sharith", "Vhadhi", "Shaoggith", "Thul", "Rupture"],
    FLEAUX
  ),
  article(
    "verite-v7-delanial-pere-ombre",
    "Vérité",
    "Delanial — le faux Septième",
    ["Vérité", "Delanial", "Ombre-Monde", "Père de l’Ombre", "MJ"],
    DELANIAL
  ),
  article(
    "regles-verite-v7-equipement-proprietes-acquisition",
    "Règles",
    "Propriétés, accès, confinement & compatibilités",
    ["Vérité", "Équipement", "Chasse", "Raven", "AIDH", "Runes", "Technomagie", "Jade"],
    EQUIPEMENT
  )
];

export const COMPENDIUM_VERITE_V7_PASS_B_NAVIGATION = [
  {
    id: "verite-v7-exiles-peuples-silcenters-traditions",
    dataset: "verite-v7",
    category: "Vérité",
    group: "Peuples & Natures",
    groupOrder: 30,
    subgroup: "Exilés",
    subgroupOrder: 60,
    pageOrder: 10,
    displayTitle: "Exilés — peuples, Silcenters & traditions"
  },
  {
    id: "verite-v7-extrals-gaac-aidh-diasporas",
    dataset: "verite-v7",
    category: "Vérité",
    group: "Peuples & Natures",
    groupOrder: 30,
    subgroup: "Extrals",
    subgroupOrder: 70,
    pageOrder: 10,
    displayTitle: "Extrals — GAAC, AIDH & diasporas"
  },
  {
    id: "verite-v7-homo-superior-adrak-profils-rares",
    dataset: "verite-v7",
    category: "Vérité",
    group: "Peuples & Natures",
    groupOrder: 30,
    subgroup: "Extrals",
    subgroupOrder: 70,
    pageOrder: 20,
    displayTitle: "Homo Superior & Ad’rak — profils rares"
  },
  {
    id: "verite-v7-chasseurs-doctrine-association-traditions",
    dataset: "verite-v7",
    category: "Vérité",
    group: "Chasse & organisations",
    groupOrder: 50,
    subgroup: "Chasseurs",
    subgroupOrder: 10,
    pageOrder: 10,
    displayTitle: "Chasseurs — doctrine, Association & traditions"
  },
  {
    id: "verite-v7-six-fleaux-sources-rupture",
    dataset: "verite-v7",
    category: "Vérité",
    group: "Corruption & Fléaux",
    groupOrder: 60,
    subgroup: "Fléaux",
    subgroupOrder: 10,
    pageOrder: 20,
    displayTitle: "Les six Fléaux — Sources, tentations & Rupture"
  },
  {
    id: "verite-v7-delanial-pere-ombre",
    dataset: "verite-v7",
    category: "Vérité",
    group: "Corruption & Fléaux",
    groupOrder: 60,
    subgroup: "Fléaux",
    subgroupOrder: 10,
    pageOrder: 30,
    displayTitle: "Delanial — le Père de l’Ombre"
  },
  {
    id: "regles-verite-v7-corruption-integrite-bascule",
    dataset: "verite-v7",
    category: "Règles",
    group: "Vérité — Corruption",
    groupOrder: 85,
    subgroup: "Corruption",
    subgroupOrder: 10,
    pageOrder: 10,
    displayTitle: "Corruption, Souillure, Bascule & purification"
  },
  {
    id: "regles-verite-v7-equipement-proprietes-acquisition",
    dataset: "verite-v7",
    category: "Règles",
    group: "Vérité — Équipement",
    groupOrder: 90,
    subgroup: "Principes communs",
    subgroupOrder: 10,
    pageOrder: 10,
    displayTitle: "Propriétés, accès, confinement & compatibilités"
  }
];
