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
        text: "La puissance physique des Thulkars est évidente, mais leurs Hordes montrent pourquoi elle ne suffit pas à définir leur civilisation. Une Horde est une culture d’action collective avec sa doctrine, ses valeurs, sa façon de se déplacer, de combattre et de définir la réussite. Deux Thulkars peuvent partager une anatomie et diverger presque sur tout le reste."
      },
      {
        type: "p",
        text: "La Formation de Horde commune enseigne les réflexes qui permettent à plusieurs individus de fonctionner comme un ensemble — se déployer, s’épauler, relever quelqu’un ou déplacer une formation — avant que les doctrines spécialisées ne donnent un sens propre à cette coordination."
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
    id: "temoin-chasseur",
    title: "Du témoin au Chasseur",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le premier trait commun aux Chasseurs n’est ni le courage ni la violence : c’est de s’être souvenus. Des Humains survivent à une rencontre de Vérité puis voient le Voile recoudre progressivement leur perception — l’horreur devient accident, la créature un homme, le massacre une attaque animale. Chez certains, une cicatrice, un détail ou une conviction refuse pourtant de disparaître."
      },
      {
        type: "p",
        text: "Cette résistance ne suffit pas à faire immédiatement un Chasseur. Certains passent des années à chercher, nier ou croire qu’ils deviennent fous. Le basculement intervient lorsqu’ils apprennent à agir consciemment dans la Vérité et que l’Hologramme cesse de traiter leurs souvenirs comme ceux d’un civil à ramener vers l’ignorance. Ils ne deviennent pas omniscients : ils conservent simplement ce qu’ils ont réellement vécu."
      }
    ]
  },
  {
    id: "preparer",
    title: "Préparer avant de combattre",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Une créature surnaturelle n’est pas dangereuse uniquement parce qu’elle est forte. Elle peut se régénérer, disparaître, changer de corps, posséder quelqu’un, traverser un seuil ou survivre à ce qui aurait dû la tuer. La Chasse commence donc par l’identification : comprendre ce que l’on poursuit, distinguer une faiblesse réelle du folklore et déterminer ce que « neutraliser » signifie réellement pour cette cible."
      },
      {
        type: "p",
        text: "Les Chasseurs expérimentés survivent parce qu’ils arrivent avec ce qu’il fallait apporter. Une mauvaise munition, un rite incomplet, une légende fausse ou une poursuite engagée sur le territoire idéal de la proie suffisent à transformer le courage en épitaphe."
      }
    ]
  },
  {
    id: "trouver-les-autres",
    title: "Survivre signifie trouver les autres",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La majorité des Chasseurs ne commence pas dans une immense organisation. Beaucoup sont seuls, avec quelques notes, un souvenir traumatique et des certitudes très approximatives. Cette solitude est l’une de leurs principales causes de mortalité."
      },
      {
        type: "p",
        text: "Ceux qui durent finissent souvent par trouver un Bar de Chasseurs, un intermédiaire de l’Association ou simplement quelqu’un capable de répondre : « Oui. Je sais ce que tu as vu. » Un nom en entraîne un autre : exorciste, spécialiste, ancien, personne possédant la bonne munition ou sachant que le conseil trouvé sur l’Holonet est faux."
      },
      {
        type: "p",
        text: "Les vétérans ne sont pas ceux qui n’ont jamais eu besoin de personne ; ce sont ceux qui ont compris assez tôt qu’un métier fondé sur les secrets devient mortel lorsque chacun conserve les siens."
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
        text: "Morrighan fonda l’Association des Chasseurs pour fournir une infrastructure commune plutôt qu’une doctrine unique. Bars, restaurants, garages et ateliers deviennent des points de rencontre, d’échange de matériel, d’information, de contrats et d’erreurs apprises à prix fort."
      },
      {
        type: "p",
        text: "Cette infrastructure est souvent tenue par ceux qui ne chassent plus. Blessure, âge ou dette peuvent mettre fin aux opérations de terrain sans effacer vingt ans d’expérience. Dans une profession où les jeunes meurent surtout de ce qu’ils ignorent, un ancien derrière un comptoir peut sauver davantage de vies qu’un combattant exceptionnel."
      },
      {
        type: "p",
        text: "Les habilitations GT structurent la confiance par domaines plutôt que comme une simple échelle de puissance. Elles indiquent quels dossiers, interlocuteurs et contrats l’Association accepte de confier à quelqu’un, et attestent surtout qu’il a appris à ne pas confondre toutes les créatures de Vérité avec une même menace."
      }
    ]
  },
  {
    id: "habilitations",
    title: "Habilitations GT, Hunt & reconnaissance",
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
        text: "Hunt100 est une reconnaissance extrêmement rare liée à des trajectoires exceptionnelles. Hunt15 appartient à une autre échelle encore : quelques noms légendaires dont les histoires et les possessions circulent dans la Chasse comme rappel qu’il existe toujours quelqu’un de plus dangereux que la dernière chose rencontrée."
      }
    ]
  },
  {
    id: "confrerie-bestiaire",
    title: "La Confrérie du Bestiaire",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Confrérie rassemble observateurs, intellectuels et vétérans qui documentent créatures et phénomènes, puis diffusent une partie de leurs travaux sur l’Holonet de Vérité. Ces dossiers sauvent des vies mais ne sont jamais considérés comme infaillibles."
      },
      {
        type: "p",
        text: "Une observation incomplète peut devenir une règle fausse répétée cent fois ; publier des informations sur un ancien Vampire peut aussi lui apprendre exactement qui s’intéresse à lui. La Confrérie est donc une mémoire collective, pas une autorité omnisciente."
      }
    ]
  },
  {
    id: "chasser-pas-hair",
    title: "Chasser n’est pas haïr une espèce",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La différence entre Chasseur et tueur apparaît lorsque l’identification contredit le préjugé. Un Vampire peut être criminel ou allié, un Exilé la victime, un Angelus la source du problème, et une créature réputée monstrueuse n’avoir commis aucun acte justifiant sa destruction."
      },
      {
        type: "p",
        text: "Les traditions sérieuses apprennent donc à séparer Nature et comportement, même lorsqu’elles se spécialisent dans une famille de menaces. Les Lavandières chassent des Vampires dangereux, Moroï et Strygoï sans conclure que tout Vampire mérite automatiquement la mort ; les ordres catholiques distinguent traque, exorcisme, jugement et scellement parce que chaque problème ne se résout pas par le même geste."
      }
    ]
  },
  {
    id: "traditions-historiques",
    title: "Les traditions comme réponses historiques",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Chaque grande tradition de Chasse est née d’un problème concret. Les Lavandières sont des Vampires indépendants spécialisés contre les leurs lorsqu’ils deviennent dangereux. Les ordres catholiques se divisent notamment entre Arianwen pour la traque, Ephraïm pour l’exorcisme et Magdalena pour le jugement et le scellement."
      },
      {
        type: "p",
        text: "Les Khālsā travaillent autour du serment, de la protection et de la liberté face aux emprises. Les taoïstes Gu et Shimazu cultivent l’équilibre du Yin et du Yang, tandis que les secrets Shi utilisent un lien beaucoup plus dangereux au Néant. Les Kabbalistes exploitent les Sephiroth comme principes sans devenir Angelus ; les Nizarites associent Arts du Djinn et doctrine de Chasse ; les Onmyoji travaillent avec Shikigami, noms, sceaux et pactes spirituels."
      },
      {
        type: "p",
        text: "Les Néopaïens ont reconstruit des pratiques autour des morts, de la terre, des seuils, des présages et des serments. La Chasse Fantastique conserve la mémoire d’une ancienne armée punitive elfique de la Guerre de la Magie. Les Lueurs d’Azménor reçoivent de vraies visions du Néant sans jamais être certaines de les interpréter correctement. La Table Ronde transmet les lignées des chevaliers choisis par Merlin et les armes uniques créées pour leurs héritiers."
      },
      {
        type: "p",
        text: "Cette diversité reste une force tant qu’elle s’accompagne d’humilité. Une tradition exceptionnelle dans son domaine devient dangereuse lorsqu’elle décide que ce domaine explique tout le reste du monde."
      }
    ]
  },
  {
    id: "xenoshield",
    title: "Xenoshield — le spécialiste aveuglé par son propre préjugé",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Xenoshield est profondément xénophobe vis-à-vis des Extrals. L’organisation possède de vraies compétences en xénobiologie hostile, contre-technologie, confinement et interception, mais confond volontiers origine non terrestre et menace potentielle. Sa culture de suspicion lui donne précisément l’impression de posséder le discernement qui lui manque parfois le plus."
      },
      {
        type: "p",
        text: "L’ironie est que Xenoshield est noyauté par des Extrals sans le savoir. Sous le Voile, certains membres peuvent parfaitement passer pour Humains aux yeux de leurs propres camarades : quelques-uns servent sincèrement l’organisation, d’autres l’utilisent ou l’infiltrent."
      },
      {
        type: "p",
        text: "Ses méthodes techniques restent utiles lorsqu’elles établissent des faits matériels ; l’erreur commence quand ces faits deviennent des certitudes politiques ou morales."
      }
    ]
  },
  {
    id: "independants",
    title: "Les indépendants",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Chasseurs indépendants n’ont ni uniforme ni doctrine commune. Certains sont des survivants dont toute la méthode s’est construite autour d’un traumatisme ; d’autres héritent d’un secret familial, bricolent technologie et reliques, portent une marque laissée par une proie ou consacrent leur existence à un individu unique."
      },
      {
        type: "p",
        text: "Certains n’ont qu’une arme à feu, du sel et du courage ; d’autres portent des augmentations auxquelles sont fixées des reliques. Leur diversité est immense, mais leur faiblesse commune reste l’isolement. Trouver le premier Bar de Chasseurs avant la première erreur fatale décide souvent si leur histoire dure plus de quelques mois."
      }
    ]
  },
  {
    id: "bouddhistes-grand-traqueur",
    title: "Les Chasseurs bouddhistes & le Grand Traqueur",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Il existe une tradition si rare qu’elle ne compte qu’une poignée de représentants dans le monde. Ces Chasseurs bouddhistes utilisent le Néant selon des méthodes que presque personne d’autre ne comprend assez pour reproduire ; leur enseignement circule à peine hors de quelques lignées de transmission."
      },
      {
        type: "p",
        text: "Leur plus grand représentant est le Grand Traqueur, figure légendaire depuis des siècles dans les milieux surnaturels. Sa réputation ne vient pas seulement de sa puissance ou de sa longévité dans la Chasse, mais de l’absence totale de catégorie protectrice dans ses proies : Vampire, Angelus, Chasseur ou autre puissance peuvent tous devenir une cible."
      },
      {
        type: "p",
        text: "La légende rappelle une vérité inconfortable : savoir tuer des monstres n’empêche personne de devenir, aux yeux de quelqu’un d’autre, la prochaine chose à traquer."
      }
    ]
  },
  {
    id: "blessure-sociale",
    title: "Se souvenir est une blessure sociale",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le premier coût de la Chasse n’est pas toujours une cicatrice physique. C’est souvent l’impossibilité de revenir à une conversation ordinaire : se rappeler un corps que les proches ont oublié, une créature que les enregistrements ne montrent plus correctement ou une mort dont le rapport officiel donne une explication que l’on sait fausse."
      },
      {
        type: "p",
        text: "Beaucoup essaient d’abord de convaincre. Ils montrent des fichiers, racontent l’histoire, reviennent sur les lieux. Le Voile transforme alors leur certitude en isolement : les proches s’inquiètent, les collègues parlent d’obsession et les institutions médicalisent parfois ce qui ressemble objectivement à une conviction impossible à vérifier."
      },
      {
        type: "p",
        text: "Le futur Chasseur ne devient pas nécessairement plus violent. Il devient quelqu’un qui accepte que le monde ne lui rendra pas facilement la preuve dont il a besoin pour se sentir sain. Trouver un autre initié est souvent ce qui l’empêche de se briser."
      }
    ]
  },
  {
    id: "californie-2035",
    title: "La Californie comme territoire de Chasse",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Grande Californie concentre en 2035 une diversité de Vérité inhabituelle : anciennes communautés exilées, diasporas extrales récentes, Natures intégrées à la société, corporations capables de financer des recherches interdites, mafias transportant ce que la loi ne comprend pas, esprits, cultes et institutions publiques en reconstruction."
      },
      {
        type: "p",
        text: "Cette densité produit des contrats que les vieux manuels ne prévoyaient pas. Une disparition peut mêler technologie extrale, dette vampirique et culte humain ; une clinique noire peut soigner la proie poursuivie ; une corporation peut déclencher un phénomène sans comprendre que son prototype reproduit un principe de Vérité ancien."
      },
      {
        type: "p",
        text: "L’Association fournit des points d’appui, la Confrérie de l’information et les traditions des méthodes, mais aucune structure ne remplace le jugement. Le Chasseur qui survit n’est pas celui qui connaît par cœur le plus grand nombre de faiblesses : c’est celui qui demande d’abord « qu’est-ce que c’est ? », puis « qu’est-ce que ça a fait ? », et seulement ensuite « comment est-ce que ça meurt ? »."
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
    id: "six-sources",
    title: "Six catastrophes capables de raisonner",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les six Fléaux ne forment ni une espèce ni un panthéon ordinaire. Ce sont des Sources cosmiques dont l’existence impose une logique au réel : dévorer, annexer, diviser, adapter, engendrer ou fixer. Elles peuvent réfléchir, négocier et poursuivre des objectifs, mais leur pensée reste enfermée dans ce principe au point qu’un échange avec elles ressemble moins à une diplomatie qu’à une conversation avec une catastrophe consciente."
      },
      {
        type: "table",
        rows: [
          ["Source", "Principe", "Empreinte"],
          ["Vhodhal", "Dévorer", "Famine Blanche"],
          ["V’Aagor", "Annexer / unir", "Sombre-Vérité"],
          ["Ux’Sharith", "Séparer / décomposer", "Division"],
          ["C’Thath Vhadhi", "Réaffecter / adapter", "Métastase"],
          ["Gajh’Shaoggith", "Engendrer / proliférer", "Germination"],
          ["Thul", "Fixer / empêcher le devenir", "Fixation"]
        ]
      },
      {
        type: "p",
        text: "Leurs relations anciennes ne ressemblent pas davantage à celles d’une famille stable. Sharith a contenu et dirigé Vhodhal ; V’Aagor a annexé, relié ou contraint d’autres Sources ; alliances, fragments et descendances ont produit des êtres qui peuvent servir leur origine, la haïr ou simplement chercher à survivre à ce qu’ils sont."
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
        text: "Les six grandes Sources sont des Fléaux Anciens : leur essence agit presque comme une loi hostile du monde. Leur présence ne produit pas seulement des monstres ; elle force matière, vie, identité ou changement à entrer dans une manière unique de fonctionner."
      },
      {
        type: "p",
        text: "Les Fléaux supérieurs peuvent naître d’une convergence, d’un fragment devenu autonome, d’une descendance impossible ou d’une conséquence assez vaste pour acquérir sa propre existence. Le mot « enfant » est souvent pratique mais trompeur lorsque filiation, possession, causalité et reproduction se confondent."
      },
      {
        type: "p",
        text: "Les Fléaux inférieurs, Abominations et Ruptures sont les menaces que l’on rencontre le plus souvent sur le terrain. Un Chasseur peut détruire une créature, couper un culte ou sceller une manifestation sans avoir détruit la Source cosmique qui se trouve derrière."
      }
    ]
  },
  {
    id: "vhodhal",
    title: "Vhodhal — la Famine Blanche",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Vhodhal est la faim portée à une échelle où la notion même de nourriture cesse d’être biologique. Matière, énergie, douleur, fonction, espace et jusqu’à la mort peuvent devenir des prises dès lors que la Famine apprend à les reconnaître."
      },
      {
        type: "p",
        text: "Les textes anciens l’appellent Famine véritable, Bouche absolue, Crocs du chaos ou Chien de la Reine. Ses quatre « regards » décrivent une compréhension des formes, des énergies, des structures mentales et des trames temporelles : plus Vhodhal comprend une chose, plus elle peut finir par l’envisager comme consommable."
      },
      {
        type: "p",
        text: "Ux’Sharith est longtemps décrite comme la puissance capable de donner une direction à cette faim, d’où le titre de Chien de la Reine. Cette relation n’avait rien d’affectueux : la Division imposait assez de séparation dans l’appétit de Vhodhal pour qu’une intention puisse momentanément exister entre deux besoins de dévorer."
      },
      {
        type: "p",
        text: "La Famine Blanche produit des Ruptures très différentes selon la Nature touchée : Wendigos, Bêtes Faramines, Sangs d’Ivoire, Noctiels ou Egams ne sont pas une même espèce, mais la même loi de dévoration appliquée à des organismes différents. La Loge d’Écume transforme cette faim en religion et apprend à nourrir le manque avec la destruction d’autrui."
      }
    ]
  },
  {
    id: "vaagor",
    title: "V’Aagor — la Sombre-Vérité",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "V’Aagor incarne l’Unité, l’appropriation et la fusion. Son ombre n’est pas un symbole esthétique : elle représente une continuité qui peut englober objets, corps, territoires et liens jusqu’à brouiller la frontière entre ce qui appartient au porteur et ce qui est devenu une extension de lui."
      },
      {
        type: "p",
        text: "Les archives qui le nomment Mloxol V’Aagor parlent parfois du « Roi des Fléaux ». Il ne s’agit pas d’une monarchie paisible : le titre conserve surtout la mémoire d’une puissance capable d’annexer, contraindre ou relier plusieurs Sources. Sa forme fondamentale est décrite comme une matière sombre sans anatomie stable, tour à tour fluide, solide, lourde ou presque sans masse."
      },
      {
        type: "p",
        text: "V’Aagor est l’opposé naturel de Sharith : elle sépare, il rejoint. Leur ancienne association permettait à la Division de produire des fragments et à l’Unité de les rattacher à une volonté plus vaste, combinaison qui explique plusieurs horreurs attribuées aux premiers âges des Fléaux."
      },
      {
        type: "p",
        text: "Ses cultes modernes ne forment aucune Église unique. Le Deimonisme travaille avec les créatures d’Ombre ; Longinus a transformé une ancienne tradition de Chasse en Ombre-Église ; la Confrérie de la Faux cherche une tutelle directe ; la Fontaine des Ténèbres exploite la condition vampirique ; l’Œil Blanc porte des marques extérieures. Le Gouffre Infini mêle même V’Aagor à Thul."
      },
      {
        type: "p",
        text: "Les Ruptures aagoriennes vont du Fragment ou Assimilé à l’Oshirique vampirique, aux Sœurs de l’Œil Blanc ou à des Abominations façonnées par la Faux. Un Deimon corrompu reste fondamentalement un Deimon : aucun peuple d’Ombre n’est naturellement servile envers V’Aagor."
      }
    ]
  },
  {
    id: "sharith",
    title: "Ux’Sharith Bellatheis — la Division",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Sharith incarne division, décomposition, fragmentation, fission et lecture des structures. Son principe ne crée normalement pas une propriété nouvelle : il révèle, isole, redistribue, dégrade ou détache ce qui existait déjà."
      },
      {
        type: "p",
        text: "Reine de la Discorde, Mère des Couleurs ou Reine des Fléaux sont des titres anciens qui expriment une position de puissance plus qu’une administration. Sharith pouvait imposer sa logique à d’autres Sources, notamment Vhodhal, tout en restant elle-même prise dans une relation d’alliance et de contrainte avec V’Aagor."
      },
      {
        type: "p",
        text: "La Division dépasse la cassure matérielle : lumière, énergie, structure, pouvoir ou conscience peuvent être forcés à révéler les différences qui existaient déjà en eux. L’image du prisme revient souvent dans ses mythes : les couleurs ne sont pas inventées, elles deviennent visibles lorsque l’unité est brisée."
      },
      {
        type: "p",
        text: "Cette logique a nourri l’Archilogomancie, qui comprend en décomposant, la Nucléomancie, qui pousse le principe jusque dans la matière, et Bellatheis, qui conserve des héritages biologiques et cultuels anciens. Les Psycolors appartiennent aux expressions post-Rupture et restent des créatures rares plutôt qu’une école ordinaire."
      },
      {
        type: "p",
        text: "Les récits de Sharith parlent d’essence dispersée, de fragments, de descendances et d’identités qui se séparent sans jamais redevenir exactement ce qu’elles furent. Détruire une manifestation locale ne garantit donc jamais que tout ce que la Division avait déjà détaché ait disparu avec elle."
      }
    ]
  },
  {
    id: "vhadhi",
    title: "C’Thath Vhadhi — la Métastase",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Vhadhi change la fonction des choses. Elle ne mutile pas au hasard : elle reconnecte causalités, organes, objets et usages jusqu’à ce que l’ensemble remplisse le rôle devenu nécessaire. Son surnom de Nœud de la Causalité ne signifie pas qu’elle commande au destin, mais qu’elle redéfinit la relation entre une chose et ce à quoi elle sert."
      },
      {
        type: "p",
        text: "Sa tentation est l’une des plus séduisantes : adaptation, guérison, amélioration et continuité peuvent sembler préférables à la faiblesse. Le danger apparaît quand identité, espèce ou forme cessent d’avoir une valeur propre dès lors qu’une fonction jugée plus utile peut les remplacer."
      },
      {
        type: "p",
        text: "L’Éden Gris a bâti sa longévité sur cette ambiguïté. Ses racines mêlent alchimie, quête d’immortalité et évolution dirigée ; génétique, biologie et ingénierie lui ont ensuite fourni de nouveaux langages. Il attire souvent par l’espoir : malades, personnes se vivant comme inadaptées et chercheurs convaincus que la Nature ne devrait pas avoir le dernier mot."
      },
      {
        type: "p",
        text: "La Forge Grise représente sa dimension d’infrastructure, tandis qu’Am’Mleeac montre qu’un Fléau supérieur lié à Vhadhi peut développer sa propre trajectoire. Héméra et Aristaeus illustrent des Ruptures conscientes extrêmement avancées : une créature métastasée peut rester rationnelle et même satisfaite tout en ayant perdu la possibilité de vouloir autre chose que la Finalité qui l’a reconstruite."
      }
    ]
  },
  {
    id: "shaoggith",
    title: "Gajh’Shaoggith — la Germination",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Shaoggith fait vivre ce qui ne devrait pas vivre. Toute chair peut devenir graine, toute blessure naissance potentielle et tout organisme milieu de culture. Là où Vhadhi transforme une chose pour résoudre un problème, Shaoggith préfère mettre au monde quelque chose qui le résoudra."
      },
      {
        type: "p",
        text: "Les descriptions les plus anciennes parlent d’une masse vivante titanesque, presque astrale, hérissée de membres et de gueules reptiliennes. Une écaille, une dent ou un fragment abandonné pouvait devenir le départ d’une nouvelle prolifération."
      },
      {
        type: "p",
        text: "Ses créations ne forment pas une espèce stable. Elles se ramifient, dégénèrent, se recombinent et donnent naissance à des lignées de plus en plus éloignées de leur première forme. Des traditions reptiliennes galactiques attribuent à son passage une part de l’histoire des Mo’sen, Chez’zons et Xe’wens, sans que cela signifie une Corruption héréditaire actuelle."
      },
      {
        type: "p",
        text: "Le culte de la Mère Primordiale possède une implantation extrale importante et traite la Terre à la fois comme tombeau et sanctuaire. Le nom de Tiamat apparaît dans plusieurs traditions humaines, souvenir déformé possible d’une catastrophe biologique plus ancienne."
      },
      {
        type: "p",
        text: "Les Cycles prolongent la Germination après la Rupture : une Abomination peut encore muer, se reproduire et changer de fonction. Li’loth a dépassé plusieurs Cycles ; Shy’Krerath, Rulfam, Tiamandra, Nahfr et les grandes engeances montrent jusqu’où cette prolifération peut conduire."
      }
    ]
  },
  {
    id: "thul",
    title: "Thul — la Fixation",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Thul cherche la fin du devenir. Il transforme jusqu’à obtenir une forme qu’il estime définitive, puis tente d’empêcher évolution, vieillissement, métamorphose, dégradation et parfois Temps lui-même. Il constitue ainsi la contradiction la plus nette de Shaoggith : la Germination multiplie les futurs, la Fixation veut qu’il n’en reste plus aucun."
      },
      {
        type: "p",
        text: "Les cultes abyssaux le relient aux profondeurs, aux civilisations noyées et aux organismes fossiles encore vivants. Des archives anciennes rapprochent ses manifestations de Mû et de récits marins ensuite reformulés par la littérature lovecraftienne ; ces mythes ne sont pas des rapports exacts, mais ils conservent des motifs récurrents de villes englouties, sommeil immense et retour d’un état ancien."
      },
      {
        type: "p",
        text: "Thul n’est pas libéré en 2035. Il demeure endormi ou emprisonné sous Mû, et la plupart des rencontres passent par Patrons, Abominations, cultes ou émanations. Le Sombre Culte, Dagon, Telipinu et la Horde Abyssale ne forment pas une Église centralisée : ce sont des foyers distincts autour d’une Source captive."
      },
      {
        type: "p",
        text: "La peur thulienne n’est pas seulement d’être transformé en monstre, mais d’être conservé : blessure qui ne guérit ni ne s’aggrave, âme qui ne peut partir, corps qui ne vieillit plus sans réellement vivre mieux, cité qui refuse de mourir ou adaptation devenue inutile mais impossible à perdre."
      },
      {
        type: "p",
        text: "Fossiles vivants, Abyssaux profondément métissés, Myxiniens, hybrides et âmes figées figurent parmi ses Ruptures. Dagon, Telipinu, R’Sheraag, Dsherra’neth, Pestiria, Olla et Greem’Sha appartiennent aux grandes figures de cette écologie ; la destruction d’une incarnation, comme Telipinu l’illustre, n’implique pas forcément l’annihilation de l’entité derrière elle."
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
        text: "Dans les dossiers rares qui le mentionnent, Delanial est appelé Fléau de l’Ombre-Monde, Septième Fléau ou Père de l’Ombre. Son ancienneté, sa puissance passive et son influence sur une dimension entière rendent la confusion compréhensible."
      },
      {
        type: "p",
        text: "Son passage a laissé assez de traces pour que des Ombres, Dives et Deimons l’interprètent comme un créateur. Un culte décentralisé du Père de l’Ombre est né de cette erreur et a survécu même aux tentatives de Delanial lui-même pour le faire disparaître."
      }
    ]
  },
  {
    id: "classification-mj",
    title: "Classification MJ — le faux Septième",
    level: 2,
    audience: "mj",
    blocks: [
      {
        type: "p",
        text: "Delanial n’est pas un Fléau. C’est un Légionnaire des Puissances, avant tout un réfugié cherchant à demeurer caché des autres Puissances. Sa cosmologie est différente de celle des six Sources, même lorsqu’il peut exercer une influence comparable à la leur."
      },
      {
        type: "p",
        text: "Il a déjà été capable d’affronter des manifestations de niveau Fléau sans devenir pour autant un « super-Fléau ». Son intervention contre V’Aagor puis l’effacement de cette intervention montrent précisément qu’une puissance hors échelle peut appartenir à une autre catégorie cosmologique."
      },
      {
        type: "p",
        text: "Cette distinction rappelle que les classifications des Chasseurs sont des outils de compréhension, pas des lois imposées au monde. Toutes les puissances immenses ne sont pas des Fléaux et toutes les religions de Vérité ne comprennent pas correctement l’objet qu’elles vénèrent."
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
        text: "Delanial s’est réfugié dans l’Ombre-Monde et a profondément participé à sa structuration, devenant une sorte de Démiurge caché sans posséder toute la dimension ni toutes les Ombres."
      },
      {
        type: "p",
        text: "Il a créé le Mageius d’Anahita lors d’un événement unique qui ne constitue pas une technique transmissible. Morrighan fait partie des très rares personnes capables de le connaître comme individu et de comprendre qu’il ne relève pas de la classification des Fléaux."
      },
      {
        type: "p",
        text: "Le culte du Père de l’Ombre ne lui obéit pas. Delanial n’est ni son fondateur volontaire ni son dieu consentant ; le culte existe parce que certaines créatures ont transformé les traces de son passage en récit de création."
      },
      {
        type: "p",
        text: "Delanial n’est pas une créature que l’on comprend correctement en la réduisant à un affrontement direct. Une histoire peut porter sur une négociation, une conséquence de son intervention, un secret, une projection ou l’aide impossible d’une puissance qui préférerait que personne ne sache qu’elle existe."
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
