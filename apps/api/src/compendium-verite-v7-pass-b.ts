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
        text: "Les Extrals suivent une trajectoire très différente de celle des Exilés. Ils viennent de civilisations galactiques — mondes, systèmes, empires, alliances et guerres — ayant développé le voyage spatial et rencontré l’Humanité loin de la Terre. Leur implantation terrestre est, dans l’ensemble, beaucoup plus récente que celle des peuples d’Aèr."
      },
      {
        type: "p",
        text: "Il n’existe aucune « technologie extrale » unique. Chaque civilisation a suivi ses propres paradigmes et peut être extraordinairement avancée dans un domaine tout en étant moins impressionnante dans un autre. Biologie, psychisme, matériaux, ingénierie, informatique et énergie ne suivent pas partout les mêmes chemins."
      }
    ]
  },
  {
    id: "arriver-sur-terre",
    title: "Arriver sur une planète qui ne sait pas que vous existez",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Un nouvel arrivant peut avoir voyagé entre plusieurs systèmes avant de découvrir qu’à Los Angeles il doit apprendre à se faire passer pour une espèce qui ignore jusqu’à l’existence de sa planète d’origine. L’Hologramme rend cette implantation possible sans la rendre simple."
      },
      {
        type: "p",
        text: "Le Voile peut traduire une morphologie, mais il ne supprime ni besoins biologiques, ni culture, ni habitudes de communication, ni incompatibilités techniques. Les communautés extrales dépendent donc d’infrastructures très concrètes : logements adaptés, soins xénobiologiques, chaînes alimentaires compatibles, interfaces, traducteurs, fournisseurs et institutions capables de traiter une anatomie officiellement inexistante."
      }
    ]
  },
  {
    id: "talass",
    title: "Talass — penser la technique sans aimer la violence",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Talass sont de petits êtres segmentaires issus de formes fongiformes. Leur soie extrêmement conductrice, leurs capacités de déplacement, leurs aptitudes psychiques et leur rapport au Talwa’Etax produisent des solutions technologiques et perceptives qui ne ressemblent pas toujours à l’ingénierie humaine."
      },
      {
        type: "p",
        text: "Leur culture valorise fortement l’intellect et se méfie de la violence. Cette méfiance n’implique pas l’incapacité à se défendre : elle exprime plutôt l’idée que si une structure pouvait empêcher, négocier ou rendre inutile le conflit, devoir le résoudre par la force constitue déjà un échec de conception."
      },
      {
        type: "p",
        text: "La vie terrestre a renforcé chez certaines communautés un goût pour la politique. Négocier avec l’AIDH, le GAAC et les gouvernements humains oblige à transformer l’intelligence technique en intelligence institutionnelle ; un Talass peut donc devenir militant, diplomate ou organisateur sans renier sa culture scientifique."
      }
    ]
  },
  {
    id: "mosen",
    title: "Mo’sen — survivre à une histoire de domination",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Mo’sens sont de puissants reptiloïdes dont la cuirasse naturelle, les pics hormonaux et les sens prédateurs deviennent difficiles à ignorer lorsqu’ils se Révèlent. Leur histoire a toutefois été marquée par l’oppression exercée par d’autres branches apparentées et par les alliances nécessaires pour s’en libérer."
      },
      {
        type: "p",
        text: "Cette mémoire crée une sensibilité politique particulière à la dépendance. Une communauté capable de se nourrir, se défendre et négocier sans tutelle est culturellement plus sûre qu’une communauté très confortable dont un acteur extérieur peut couper les ressources en une décision."
      },
      {
        type: "p",
        text: "REPTILE représente la version la plus controversée de cette logique : influencer les structures humaines de l’intérieur afin qu’elles protègent les intérêts mo’sens. Beaucoup de Mo’sens rejettent pourtant cette stratégie et préfèrent GAAC, réseaux scientifiques ou intégration plus transparente. Brotherhood of Hate et Saeniaforming Army appartiennent à des branches plus radicales, généralement traitées comme menaces plutôt que comme organisations ordinaires."
      }
    ]
  },
  {
    id: "baseanh",
    title: "Baséanhs — la biologie comme laboratoire",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Baséanhs possèdent quatre bras, six yeux et des Tardollas capables de maintenir différents milieux cellulaires. Là où beaucoup d’espèces séparent nettement le corps de l’outil, un Baséanh peut faire de son organisme une infrastructure de culture biologique."
      },
      {
        type: "p",
        text: "Pharmacologie, acclimatation et biologie appliquée occupent donc une place majeure dans leur civilisation. Une préparation n’est pas une potion mystérieuse : elle résulte d’un milieu vivant entretenu, compris et capable de produire toxines, protéines, bactéries, traitements ou composés précis."
      },
      {
        type: "p",
        text: "Sur Terre, cette expertise les rend essentiels aux problèmes que la médecine humaine ne sait pas encore traiter. La Croix Verte et les Biobars incarnent cette philosophie : adapter localement air, humidité, nourriture, traitements et microclimats au lieu de prétendre transformer toute la planète."
      }
    ]
  },
  {
    id: "rocreen",
    title: "Rocréens — régénérer, communiquer, survivre par le réseau",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Rocréens sont des molluscoïdes amphibies dont le Noyau permet une reconstruction biologique remarquable. Cette capacité, associée à une communication psychique et à une histoire de prédateurs sociaux, donne à leur culture une relation particulière à la continuité du groupe."
      },
      {
        type: "p",
        text: "Partager une perception ou une information n’abolit pas les frontières individuelles, mais se négocie dans une culture où cette forme d’échange peut être aussi ordinaire que montrer une image. Leurs diasporas ont développé des réseaux clandestins particulièrement solides."
      },
      {
        type: "p",
        text: "La Mafia Shaediri en est l’exemple le plus célèbre ; les Shaekori en représentent une dimension plus fraternelle faite de refuges, extractions et relais distribués. Un Rocréen n’a pas besoin d’être criminel pour comprendre pourquoi une diaspora minoritaire valorise les routes qui continuent d’exister quand l’administration officielle ne répond plus."
      }
    ]
  },
  {
    id: "thalsios",
    title: "Thalsios — résoudre ce qui est devant soi",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Thalsios sont des amphibioïdes massifs, très sensibles à l’humidité et remarquablement précis de leurs mains. Longtemps exploités comme main-d’œuvre, ils ont développé une culture dans laquelle travail, réparation et résolution concrète des problèmes sont des moyens de reprendre du contrôle sur un environnement qui a souvent décidé à leur place."
      },
      {
        type: "p",
        text: "Leur physiologie rend la politique environnementale immédiatement tangible : eau, climatisation ou panne d’infrastructure peuvent devenir des questions de santé. Hydroguard est née de cette réalité, tandis que leur sens pratique les rend également très présents dans les organisations scientifiques comme la CTU, où il complète bien le goût talass pour l’ingénierie théorique."
      }
    ]
  },
  {
    id: "gaac",
    title: "GAAC — représenter sans gouverner",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Global Alliance of Alien Citizens sert de conseil officiel, d’espace d’auto-encadrement, de représentation et d’intégration légale. Elle aide les communautés à respecter les contraintes imposées par l’AIDH et à négocier avec des institutions terrestres qui ne peuvent publiquement reconnaître leur existence."
      },
      {
        type: "p",
        text: "Son pouvoir est d’abord institutionnel : procédures, relais, interlocuteurs et légitimité lorsqu’un problème biologique, juridique ou diplomatique ne peut être résolu par un service humain ordinaire. Le GAAC ne remplace ni les citoyennetés, ni les diasporas, ni les organisations culturelles ou scientifiques."
      },
      {
        type: "p",
        text: "Cette modestie est l’une de ses forces. Avec cinq espèces majeures et de nombreux profils plus rares, vouloir devenir un gouvernement unique provoquerait immédiatement une guerre de compétences. Le GAAC fonctionne mieux comme cadre partagé que comme autorité cherchant à effacer les intérêts particuliers."
      }
    ]
  },
  {
    id: "ctu",
    title: "CTU — rendre l’impossible transmissible",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Californian Talasses Union est une faction scientifique transespèce. Elle part d’un problème simple : posséder un appareil extraordinaire ne sert presque à rien si personne sur place ne sait le réparer, produire ses composants ou comprendre les étapes intermédiaires nécessaires à sa fabrication."
      },
      {
        type: "p",
        text: "La CTU cherche donc à déclasser intelligemment une technologie, créer des équivalents, encapsuler des procédures et bâtir des prototypes de transition. Elle ne veut pas rendre la Terre galactique en une nuit, mais construire un chemin reproductible entre ce qui existe déjà et ce qui resterait autrement une boîte noire importée."
      },
      {
        type: "p",
        text: "Cette philosophie attire naturellement Talass et Thalsios sans leur être exclusive. Elle possède aussi une dimension politique : diffuser une technologie réduit la dépendance envers celui qui la vend."
      }
    ]
  },
  {
    id: "croix-verte",
    title: "Croix Verte / Ligue Baséanne — rendre la Terre habitable pour plusieurs espèces",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Croix Verte travaille sur l’acclimatation et l’intervention xénobiologique. Une planète entière ne peut être terraformée pour chaque visiteur, mais un habitat, une clinique ou une zone de travail peuvent être adaptés localement."
      },
      {
        type: "p",
        text: "Microclimats, substitutions métaboliques, conversion de traitements et supports vitaux permettent de maintenir temporairement une espèce que la médecine locale ignore presque entièrement. Le Baséanh y trouve un terrain naturel sans exclusivité absolue."
      },
      {
        type: "p",
        text: "Une grande partie de son travail consiste précisément à faire en sorte que rien de spectaculaire ne se produise : que le patient survive, que l’air soit respirable, que la nourriture soit compatible et que personne n’ait à expliquer pourquoi une ambulance humaine ne pouvait pas résoudre le problème."
      }
    ]
  },
  {
    id: "reptile",
    title: "REPTILE — protéger par l’infiltration",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Majoritairement mo’senne, REPTILE considère que la sécurité réelle vient de la capacité à faire agir les systèmes humains dans le bon sens avant qu’une crise n’éclate. L’organisation infiltre, influence ou recrute à l’intérieur d’institutions dont les décisions affectent les Extrals."
      },
      {
        type: "p",
        text: "Elle ne cherche pas seulement des « amis haut placés » : elle construit des mandats dormants, répartit les décisions et cherche à faire survivre un dispositif même si un membre central disparaît. Pour ses adversaires, REPTILE prouve pourquoi les Extrals ne devraient pas être laissés sans contrôle ; pour ses membres, il prouve qu’une minorité incapable d’influencer les structures décidant de son avenir est déjà à leur merci."
      }
    ]
  },
  {
    id: "shaediri",
    title: "Mafia Shaediri — une frontière qui commence au dernier kilomètre",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Mafia Shaediri est rocréenne par origine mais ouverte à d’autres espèces via les Shaekori. Elle maîtrise la zone où une marchandise existe quelque part dans le réseau galactique mais ne peut franchir légalement les derniers obstacles jusqu’à son utilisateur terrestre."
      },
      {
        type: "p",
        text: "Transpondeurs, soutes aveugles, fenêtres orbitales, routes cislunaires, provenance brouillée et importations noires appartiennent à cette culture. La filière ne garantit jamais que tout soit disponible : sa puissance est de savoir ce qui peut réellement arriver, par où, à quel prix et avec quel risque."
      },
      {
        type: "p",
        text: "L’échelle reste terrestre. Le réseau extérieur fait venir la marchandise ; le contrebandier local rend le dernier segment possible. La Shaediri permet ainsi à la galaxie d’avoir des conséquences locales sans transformer chaque intermédiaire en capitaine de vaisseau interstellaire."
      }
    ]
  },
  {
    id: "hydroguard",
    title: "Hydroguard / THDF — vivre là où l’environnement tue avant l’ennemi",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Hydroguard est née d’une expertise hydrométrique et d’intervention qui a progressivement pris une dimension militaire. Sous l’eau, déplacement, pression ou sauvetage peuvent tuer aussi sûrement qu’une arme ; combat et extraction ne sont donc jamais totalement séparés."
      },
      {
        type: "p",
        text: "Abysswatchers, Deepknights, Mermaid Soldiers et Mola Mola sont différents visages d’une même culture opérationnelle, pas quatre organisations autonomes. Thalsios et Rocréens y sont particulièrement présents, avec des ouvertures à d’autres espèces capables de supporter l’environnement."
      },
      {
        type: "p",
        text: "Sur Terre, Hydroguard intervient lorsque les infrastructures humaines deviennent inadaptées : profondeur, habitats immergés, accidents liés à des technologies extrales ou zones dont la physique environnementale rend une unité classique inefficace."
      }
    ]
  },
  {
    id: "smrc-agi",
    title: "SMRC / AGI — rendre les corps compatibles",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le SMRC recherche la compatibilité génétique entre espèces ; l’AGI en représente une façade ou expression plus publique, particulièrement présente chez les Thalsios. Leur travail produit des modifications orgienétiques, augmentations biologiques durables capables d’ajouter des fonctions réelles au corps."
      },
      {
        type: "p",
        text: "L’Hologramme traduit une greffe durablement intégrée avec le reste du corps, mais ne transforme pas la modification en détail insignifiant. Plaques mo’sennes, branchies thaliosses ou tissus rocréens régénératifs peuvent devenir des choix médicaux, professionnels ou culturels."
      },
      {
        type: "p",
        text: "Le projet est à la fois scientifique et politique : plus les espèces deviennent biologiquement compatibles, moins elles dépendent d’infrastructures séparées. Mais emprunter les fonctions d’un autre organisme brouille aussi la frontière entre adaptation et appropriation. Les hybrides entre surnaturel terrestre et orgienétique extrale restent des cas exceptionnels, davantage faits pour expériences, menaces ou scénarios que pour une normalité sociale."
      }
    ]
  },
  {
    id: "sra",
    title: "SRA — chercher sans transformer chaque réponse en pouvoir",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Shadow Research Agency étudie les anomalies, collecte des données et construit des protocoles scientifiques. Sa spécificité vient de ses laboratoires, dossiers, missions et de l’accès à des phénomènes que la science publique ne peut officiellement reconnaître."
      },
      {
        type: "p",
        text: "Elle n’a pas besoin d’une « magie de scientifique » pour être importante : mesurer correctement une anomalie, comparer des expériences et produire une hypothèse reproductible est déjà extraordinairement rare lorsque le monde peut modifier les données que l’on tente d’enregistrer."
      },
      {
        type: "p",
        text: "La SRA sert souvent de pont entre savoir profane et Vérité. Ses chercheurs peuvent découvrir un phénomène avant d’avoir le vocabulaire culturel permettant de l’interpréter, produisant autant de grandes avancées que d’erreurs mémorables."
      }
    ]
  },
  {
    id: "emeraude-sanglante",
    title: "Émeraude Sanglante — la réponse radicale à l’Armée noire",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "L’Émeraude Sanglante est une faction militaire talass radicalisée, officiellement presque détruite, dont la réputation vient de son succès exceptionnel contre l’Armée noire Ad’rak. Son existence contredit l’image d’un peuple talass incapable d’assumer la violence : certains ont décidé que refuser de préparer la guerre revenait à laisser l’adversaire en choisir le moment."
      },
      {
        type: "p",
        text: "Sa doctrine combine armures adaptées à la mobilité talass et méthodes destinées à démanteler méthodiquement des adversaires physiquement supérieurs : ouvrir une brèche, l’exploiter puis l’agrandir jusqu’à ce que la masse cesse d’être décisive."
      },
      {
        type: "p",
        text: "Cette radicalisation rend la faction difficilement compatible avec une intégration ordinaire. Même chez les Talass, elle demeure rare et clandestine, bien plus marquée par la guerre que la plupart des institutions extrales ne souhaitent l’admettre publiquement."
      }
    ]
  },
  {
    id: "extrals-2035",
    title: "Les Extrals en 2035 — une diaspora récente, déjà divisée",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Il n’existe pas de communauté extrale uniforme. Le GAAC fournit un cadre et les organisations créent des routes et des savoirs, mais les espèces ont des histoires suffisamment différentes pour que deux Extrals puissent avoir moins en commun culturellement que deux Humains de continents opposés."
      },
      {
        type: "p",
        text: "La Terre accélère pourtant certains rapprochements. Être cachés par le même Hologramme, dépendre des mêmes infrastructures spécialisées et négocier avec les mêmes gouvernements crée des solidarités nouvelles. CTU, Croix Verte, routes Shaediri et opérations Hydroguard produisent progressivement une culture extrale terrestre."
      },
      {
        type: "p",
        text: "Cette culture reste jeune. Contrairement aux Exilés, beaucoup peuvent encore nommer la planète, le système ou l’organisation qui les a envoyés ici. La question « quel monde est vraiment le nôtre ? » n’est pas encore ancienne ; pour certains, elle commence seulement à se poser."
      }
    ]
  }
];

const HOMO_ADRAK: Section[] = [
  {
    id: "aidh-ichei",
    title: "AIDH — une Humanité qui ne vient pas de la Terre",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "L’AIDH appartient aux Mondes Technologiques humains et vient du système d’Ichéi. Ses membres considèrent généralement Ichéi Prime comme le berceau de leur civilisation. Pour beaucoup, la Terre n’est donc pas la « maison de l’espèce », mais un autre grand foyer humain, ancien, autonome et culturellement distinct."
      },
      {
        type: "p",
        text: "Les Humains galactiques ont reconstruit autour d’Ichéi une histoire complète de leur civilisation et se trompent eux aussi sur l’origine la plus ancienne de l’Humanité : celle-ci reste liée à Aèr. Le rapport entre Humains d’Ichéi et Humains terrestres est donc celui de deux branches culturelles séparées par des trajectoires historiques immenses, pas celui d’une population revenant consciemment vers son berceau."
      },
      {
        type: "p",
        text: "Pour un agent de l’AIDH, la Terre est surtout un monde humain chargé d’anomalies que les autres sociétés ne rencontrent pas à la même concentration. Magie, peuples d’Aèr et surtout Hologramme rendent la planète stratégiquement unique."
      }
    ]
  },
  {
    id: "aidh-hologramme",
    title: "L’AIDH & l’Hologramme",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "L’AIDH a participé à la création de l’Hologramme et continue à l’alimenter et le stabiliser avec d’autres acteurs. Elle possède des technologies capables d’interagir directement avec la Cohérence : invariants, capteurs, enregistrements invariants, confinement, biphysique, anti-possession et protocoles de terrain."
      },
      {
        type: "p",
        text: "Cette connaissance ne signifie ni omniscience ni contrôle exclusif du système. Sa relation à la Terre mêle protection, surveillance et intérêt stratégique. Certains agents veulent préserver la planète d’une attention galactique dangereuse ; d’autres craignent qu’une Terre réunissant forte densité magique et accélération technologique ne recrée des conditions que des civilisations anciennes ont déjà appris à redouter."
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
        text: "Les Homo Superior ne sont pas une espèce. Ils restent Humains. Génétique, nanites, conditionnement et optimisation neurologique ont cependant poussé leurs capacités assez loin pour qu’un observateur terrestre puisse facilement les classer comme autre chose."
      },
      {
        type: "p",
        text: "Pour l’AIDH, ils représentent un programme, une doctrine et une technologie appliqués à l’Humanité. Pour les sociétés augmentées de 2035, ils posent une question plus dérangeante : à partir de quel niveau de modification une amélioration cesse-t-elle d’être un simple équipement pour devenir une culture du corps entière ?"
      },
      {
        type: "p",
        text: "Les Seigneur-Généraux restent des figures humaines exceptionnelles hors échelle PJ. Un Homo Superior ne progresse pas naturellement vers ce statut simplement en accumulant les capacités de son programme."
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
        text: "Les Ad’rak sont de véritables Extrals, très grands et capables d’une puissance physique comparable à certaines Natures terrestres dangereuses. Un adulte mesure environ 2,60 m chez les hommes et 2,20 m chez les femmes ; leur corps est construit pour une violence et une contrainte physique que la majorité des espèces n’affronte jamais directement."
      },
      {
        type: "p",
        text: "Sur Terre, les profils ordinaires ou jouables sont surtout des réfugiés, dissidents, descendants de communautés libres ou anciens sujets ayant échappé à l’Armée noire. Les loyalistes ne constituent pas une trajectoire normale de personnage : ils appartiennent à une puissance dont objectifs et méthodes les placent généralement du côté des menaces."
      },
      {
        type: "p",
        text: "Cette distinction empêche de réduire toute l’espèce à son armée. Un Ad’rak libre construit son identité dans l’ombre d’une puissance qui a façonné la réputation de son peuple, et sa simple présence peut provoquer la peur chez des Extrals qui connaissent cette histoire mieux que la plupart des Humains."
      }
    ]
  },
  {
    id: "nelakna",
    title: "Les Arts de Nel’Akna",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Arts de Nel’Akna montrent qu’une culture guerrière ad’rak peut être discipline, forme et tradition plutôt que brutalité pure. Nel’Akna, connue sur Terre sous le nom de Tejana, est la dernière grande prêtresse libre connue de cet ancien ordre sacerdotal martial lié aux lunes-sanctuaires Ad’rak."
      },
      {
        type: "p",
        text: "Les Formes anciennes peuvent être transmises au-delà de l’espèce par un véritable maître, tandis que le Souffle écarlate reste beaucoup plus rare et dépend d’une capacité réelle à le faire circuler. La force ad’rak est réelle ; ce qu’un individu choisit d’en faire demeure une question personnelle, culturelle et politique."
      }
    ]
  },
  {
    id: "deux-profils-rares",
    title: "Deux profils rares, deux statuts différents",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Homo Superior et Ad’rak partagent une place périphérique dans le dossier des Mondes Technologiques mais ne doivent jamais être confondus. Le premier est un Humain profondément transformé par les sciences de l’AIDH ; le second est une espèce extrale véritable dont une fraction seulement se trouve sur Terre."
      },
      {
        type: "p",
        text: "Ils restent des profils rares du corpus, pas deux grandes Natures autonomes équivalentes aux Vampires, Garous, Mages ou Angelus. Leur intérêt vient précisément de ce qu’ils révèlent sur l’échelle galactique du monde et sur les limites de la définition humaine de l’espèce."
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
