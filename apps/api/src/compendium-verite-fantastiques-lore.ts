type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };

type Section = {
  id: string;
  title: string;
  level: number;
  audience?: "mj";
  blocks: Block[];
};

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

const SOURCE = "TUC_Vérité_ les espèces  fantastiques.docx";
const p = (text: string): Block => ({ type: "p", text });

export const COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES: Article[] = [
  {
    id: "verite-fantastiques-dragons-peuples-rares-aer",
    dataset: "verite-fantastiques",
    category: "Vérité",
    sourceCategory: "Vérité",
    title: "Dragons & peuples rares d’Aèr",
    source: SOURCE,
    status: "canon_source",
    rebuildV2: true,
    tags: ["Vérité", "Exilés", "Aèr", "Nareysvors", "Dragons", "Vala’Eraï", "Keltas", "Lycans", "Berserk", "Kweets"],
    sections: [
      {
        id: "nareysvors",
        title: "Nareysvors — les Dragons",
        level: 2,
        blocks: [
          p("Les Nareysvors sont les Dragons venus d’Aèr. Ils se sont diffusés très tôt dans d’autres régions et d’autres mondes : leur puissance leur permit de franchir des frontières qui arrêtaient d’autres peuples, y compris pendant leurs guerres contre les Archanges."),
          p("Sous leur forme véritable, ce sont de grands reptiles à quatre pattes et deux ailes, protégés par des écailles, dotés de cornes et d’excroissances et capables de souffler du feu. Ils peuvent toutefois prendre une apparence humaine parfaitement crédible sans l’aide de l’Hologramme ; sous cette forme ils paraissent généralement grands, sans signe physique obligatoire qui les trahisse."),
          p("Les Dragons sont rares sur Aèr et plus rares encore sur Terre. Leur difficulté à être repérés tient moins à l’Hologramme qu’à leur capacité naturelle à vivre sous forme humaine. Leur comportement les distingue davantage : ils sont décrits comme très détachés, peu affectés par le stress, moins enthousiastes et moins émotionnels que les autres espèces.")
        ]
      },
      {
        id: "nareysvors-recurrences-2035",
        title: "Dragons en Grande Californie",
        level: 3,
        blocks: [
          p("Les Nareysvors californiens ne forment pas de communauté soudée et n’éprouvent pas de besoin particulier de vivre entre Dragons ou avec d’autres Exilés. Chaque individu suit ses propres goûts. Leur puissance physique ne les pousse pas nécessairement vers les métiers physiques : bureau, laboratoire, travail souterrain ou plein air leur conviennent également, et leur résistance au stress les rend notamment peu sensibles à la claustrophobie."),
          p("Leur longévité leur permet d’accumuler plusieurs vies humaines d’expérience avant même de se considérer comme pleinement matures. Cette accumulation compense souvent une implication immédiate plus faible. Ils sont toutefois décrits comme difficiles à motiver et peu attirés par les métiers réclamant une énergie expressive permanente, comme certaines formes de spectacle."),
          p("Les Dragons sont peu portés sur la création artistique et accordent beaucoup d’importance à une activité suffisamment rémunératrice pour assurer notamment leur alimentation. Ils manifestent peu d’intérêt pour l’Holonet et privilégient fortement leur propre corps ; le document les décrit également comme ne pratiquant pas les augmentations."),
          p("Ce sont de puissants combattants mais de mauvais soldats lorsqu’il s’agit d’obéir. Leur tempérament de prédateur dominant les pousse plutôt à rechercher des positions élevées dans une hiérarchie qu’à accepter durablement une place subalterne.")
        ]
      },
      {
        id: "valaerai",
        title: "Vala’Eraï — les Anciennes Races",
        level: 2,
        blocks: [
          p("Les Vala’Eraï sont décrits comme des esprits élémentaires primordiaux présents sur de nombreux mondes magiques, au point d’être comparés à des Architectes de la Création. Sur Aèr, leur nombre leur permit de bâtir de grandes civilisations et de vivre longtemps sous des formes humanoïdes."),
          p("Ils créèrent sur Aèr les Archanges et les Démons majeurs, qui furent d’abord leurs serviteurs. Certains Vala’Eraï se tournèrent ensuite vers la Terre.")
        ]
      },
      {
        id: "neva-iriel",
        title: "Neva’Iriel — Archanges d’Aèr",
        level: 3,
        blocks: [
          p("Les Neva’Iriel sont des créatures élémentaires liées au vent et à l’eau, créées par les Vala’Eraï. Certains suivirent Elynea lors de sa rébellion contre les dieux terrestres. Sur Aèr, ils créèrent à leur tour des Anges. Ils sont très peu nombreux sur Terre, où la guerre entre Anges et Démons terrestres rend leur présence particulièrement dangereuse.")
        ]
      },
      {
        id: "neva-erkal",
        title: "Neva’Erkal — Démons majeurs d’Aèr",
        level: 3,
        blocks: [
          p("Les Neva’Erkal sont des créatures élémentaires liées au feu et à la terre, elles aussi créées par les Vala’Eraï. Elles restent très rares sur Terre, où elles peuvent subir les conséquences d’un conflit céleste et infernal qui ne correspond pas à leur propre histoire.")
        ]
      },
      {
        id: "neva-yramar",
        title: "Neva’Yramar — Archanges noirs",
        level: 3,
        blocks: [
          p("Les Neva’Yramar sont des créatures élémentaires liées au temps et à la mort, créées par les Vala’Eraï. Déjà peu nombreux sur Aèr, ils sont proportionnellement encore plus rares sur Terre.")
        ]
      },
      {
        id: "yrskeli-dranash-kweets",
        title: "Yr’skeli, Dranash & Kweets",
        level: 2,
        blocks: [
          p("Les Berserk, ou Yr’skeli, sont issus des anciens Keltas et sont associés à l’ours. Ils ont une apparence humanoïde de grande taille et peuvent entrer dans des rages furieuses et dévastatrices."),
          p("Les Lycans, ou Dranash, sont eux aussi issus des anciens Keltas mais sont associés au loup. Ils ont une apparence largement humaine et peuvent se transformer de manière plus ou moins partielle."),
          p("Les Kweets sont également issus des anciens Keltas et sont associés aux rats. Leur forme reste humanoïde mais peut conserver des attributs de rongeur — queue, tête ou membres selon les individus.")
        ]
      },
      {
        id: "keltas",
        title: "Keltas — esprits thérianthropes",
        level: 2,
        blocks: [
          p("Les Keltas constituent un ancien peuple d’esprits thérianthropes, à mi-chemin entre des incarnations pures de la nature et des formes plus civilisées. Le peuple est extrêmement varié : l’animal associé ne crée pas des espèces séparées et les lignées peuvent se mêler entre elles, qu’il s’agisse d’aigles, de lézards, de loups, de corbeaux ou d’autres formes."),
          p("Leur signe commun est un ensemble de marques bleues présentes dès la naissance et transmissibles à leur descendance. Sur Terre, ils ont particulièrement influencé les populations humaines celtiques.")
        ]
      },
      {
        id: "communautes-minoritaires",
        title: "Communautés minoritaires sur Terre",
        level: 2,
        blocks: [
          p("Les Exilés issus de ces peuples plus rares ne forment généralement pas de communautés aussi structurées que les Elyë, Whurtens, Ashylls, Thulkars ou Azménoriens. Ils se rapprochent des communautés expatriées qui acceptent de les accueillir. Le document rappelle aussi que des Humains peuvent faire partie des Expatriés."),
          p("Les Archanges et Démons d’Aèr cherchent souvent à rester très discrets afin d’éviter d’être confondus avec les Angelus ou Daemons terrestres, auxquels ils ne sont pas naturellement liés. De la même façon, les Lycans d’Aèr ne sont pas des Loups-garous terrestres : les premiers descendent d’esprits, les seconds sont une espèce métamorphe locale. Ils ne peuvent pas se reproduire entre eux et les Dranash sont décrits comme beaucoup plus humains de nature, tandis que quelque chose chez les Loups-garous les repousse instinctivement.")
        ]
      }
    ]
  }
];

export const COMPENDIUM_VERITE_FANTASTIQUES_NAVIGATION = [
  {
    id: "verite-fantastiques-dragons-peuples-rares-aer",
    dataset: "verite-fantastiques",
    category: "Vérité",
    group: "Peuples & Natures",
    groupOrder: 30,
    subgroup: "Exilés",
    subgroupOrder: 60,
    pageOrder: 20,
    displayTitle: "Dragons & peuples rares d’Aèr"
  }
];

export const COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS = [
  {
    targetId: "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    sections: [
      {
        id: "reperes-chronologiques-especes-fantastiques",
        title: "Repères chronologiques des Expatriés",
        level: 2,
        blocks: [
          {
            type: "table",
            rows: [
              ["Repère", "Datation donnée par la source"],
              ["Création des univers", "Non précisée"],
              ["Création de la Terre", "Il y a environ 4,5 milliards d’années"],
              ["Expansion spatiale azménorienne", "Non précisée"],
              ["Création des Portails des Mondes", "Non précisée"],
              ["Installation de peuples d’Aèr sur Terre", "Non précisée"],
              ["Guerre de la Magie", "Non précisée"],
              ["Guerre des Cieux et des Enfers", "Non précisée"],
              ["Création de l’Hologramme", "Non précisée"],
              ["Époque actuelle", "2035"]
            ]
          },
          p("Le document source laisse volontairement plusieurs dates sous la forme « ??? ». Ces événements sont donc conservés comme repères d’ordre historique sans leur attribuer artificiellement une datation plus précise.")
        ]
      }
    ]
  },
  {
    targetId: "verite-v7-exiles-peuples-silcenters-traditions",
    sections: [
      {
        id: "conseil-des-anciens-detaille",
        title: "Le Conseil des Anciens",
        level: 2,
        blocks: [
          p("Sil’Elaith fonda le Conseil des Anciens à une époque reculée pour réunir les principaux dirigeants non-humains installés sur Terre. À l’origine, il comprenait les sièges des Elfes sylvains, des « beaux Elfes », des Elfes noirs, des Azménoriens, des Nains de l’Est, de l’Ouest et de l’intérieur, ainsi qu’un siège dit élémentaire. Les Elfes gris dépendaient alors de la communauté azménorienne, tandis que le siège élémentaire représentait notamment Archanges, Démons majeurs et Vala’Eraï."),
          p("Deux sièges humains furent créés, puis quatre et six à mesure que les civilisations humaines se multipliaient. Leur renouvellement extrêmement rapide et l’absence fréquente de leurs représentants rendirent ce système peu viable. Le Conseil finit surtout par protéger les communautés expatriées de l’Humanité. Des traces d’êtres nains ou elfiques subsistent encore dans des textes médiévaux, mais la décision de se cacher réellement remonte essentiellement au début de l’Antiquité."),
          p("En 2035, la structure décrite par cette source comporte trois sièges elfiques, trois sièges nains, un siège azménorien, un siège dragon, un siège vala’eraï et le siège de la Guide. Un candidat doit exercer une influence majeure dans sa communauté, posséder ancienneté et connaissance de l’histoire des Expatriés, puis obtenir le parrainage de deux sièges. Le Conseil cherche ainsi un équilibre entre figures très anciennes, parfois semi-immortelles, et membres actifs, riches ou influents dans la Réalité.")
        ]
      },
      {
        id: "reseaux-communautaires-et-silcenters-detail",
        title: "Réseaux communautaires & Silcenters",
        level: 2,
        blocks: [
          p("Le Conseil ne suffit pas à maintenir les espèces. Clubs, associations et entreprises servent aussi de lieux de retrouvailles. Les « country clubs Dorner » sont cités comme lieux de rassemblement de la haute noblesse elfique en Californie. Les bars « Rock&Brawl », que la Réalité associe volontiers aux motards ou aux anciens militaires, possèdent des arrière-salles réservées aux Whurtens."),
          p("Les Silcenters sont des lieux interespèces où l’Hologramme ne produit pas son effet ordinaire. Tous les non-Humains peuvent en principe s’y rendre : Exilés en priorité, mais aussi Vampires, Loups-garous, Aseryns, Daemons, Angelus et autres créatures locales. Leur présence y reste rare. Les Mages, en revanche, y sont explicitement interdits."),
          p("Un Silcenter est invisible depuis la Réalité et s’atteint par des cabinets de conseil portant la marque « Silcenter », qui jouent le rôle d’offices du tourisme du Seuil. Certains Chasseurs humains consultent ces cabinets pour obtenir des conseils sans connaître leur véritable fonction et peuvent les prendre pour l’équivalent de bars de Chasseurs."),
          p("Ces centres proposent commerce d’objets enchantés, augmentations adaptées, soins médicaux spécifiques et autres services impossibles à traiter normalement dans la Réalité. Leurs bars servent aussi de réseaux d’information et permettent de suivre les codes utilisés pour se reconnaître ; la source donne l’exemple d’une époque où un papillon vert porté dans le dos signalait les Elfes sans nécessiter de Révélation."),
          p("Les communautés utilisent également les Silcenters comme réseaux professionnels. CV, profils et offres circulent afin de concentrer plusieurs Expatriés dans certaines entreprises ou certains métiers et limiter l’isolement. Les méthodes d’embauche peuvent devenir immorales : corruption, violence, sorts ou potions sont explicitement cités."),
          p("Peu nombreux mais très vastes, les Silcenters centralisent informations et services. Leur fonctionnement est financé par des dons massifs des représentants les plus riches des communautés expatriées ; officiellement, ces fonds sont versés à l’association caritative d’aide aux émigrés « Zero Strangers ».")
        ]
      },
      {
        id: "syndicat-de-jade-origines",
        title: "Le Syndicat de Jade — origines et structure",
        level: 2,
        blocks: [
          p("Sur Aèr, Orques, Gobelins, Gnolls, Kweets et d’autres peuples craladoniens ont longtemps été considérés comme « nuisibles » parce qu’ils ne disposaient pas de territoire officiellement reconnu en surface et apparaissaient surtout lors d’invasions de royaumes existants. Berserk, Lycans et autres Keltas subirent autrefois une réputation comparable lorsqu’ils ne possédaient pas de territoire propre. Les anciennes communautés expatriées reproduisirent initialement cette hiérarchie et refusèrent de reconnaître pleinement Orques et Gobelins sur Terre."),
          p("La réalité terrestre contredit pourtant cette exclusion : Orques et Gobelins ne furent pas davantage pourchassés par les Humains que Nains ou Elfes. Les Orques s’intégrèrent même si bien que les récits humains les distinguèrent tardivement, tandis que les Gobelins furent souvent confondus avec les Nains dans les légendes."),
          p("Le Syndicat de Jade naquit d’un besoin de protection. Atreesha, reine gobeline à la tête d’un vaste empire souterrain, fut chassée vers la surface après le Schisme nain : les Duergars s’enfoncèrent dans les profondeurs et Motsognir, ancien maître des runes, dévasta plusieurs empires gobelins dont celui d’Atreesha. La reine engagea alors Ashorn et sa Horde comme mercenaires. La cheffe orque Usha voulut transformer ce pacte en véritable structure politique et fit rédiger des revendications communes."),
          p("Atreesha, qui cherchait surtout un siège au Conseil des Anciens, refusa d’abord cette extension. Sept seigneurs gobelins la trahirent en acceptant les revendications orques et en ajoutant les leurs : le Syndicat de Jade naquit de cette alliance. Atreesha n’obtint finalement ni siège au Conseil ni place à la table du Syndicat."),
          p("En 2035, le Syndicat fonctionne comme une grande mafia principalement orque et gobeline. Chaque pays humain possède un trio de « boss » ; chacun dispose d’une petite armée et d’une administration. Ses membres fréquentent les Silcenters mais aussi les « Jadecenters », structures analogues implantées plutôt à proximité des marchés noirs de la Réalité."),
          p("Le Syndicat vise les positions de pouvoir et emploie accidents provoqués, attaques armées, assassinats et sabotages. L’Hologramme rend particulièrement difficile la mise en relation de crimes commis par les mêmes acteurs sous des apparences différentes. Les réseaux syndicaux se concentrent donc souvent aux extrêmes de la société humaine plutôt que dans les couches intermédiaires. Malgré la violence de ces méthodes, leur objectif historique reste d’obtenir des représentants assez puissants pour protéger leurs communautés.")
        ]
      },
      {
        id: "elye-source-especes-fantastiques",
        title: "Elyë — lignées, apparence & récurrences",
        level: 2,
        blocks: [
          p("Les Elyë d’Aèr comprennent notamment les Vaeril’Elyë, Elfes gris ; Anlyth’Elyë, Elfes de la beauté ; Ilyra’Elyë, Elfes des forêts ; Keryth’Elyë, Elfes des ténèbres ; ainsi que des lignées plus rares comme les Elfes des neiges ou du désert. Leurs cultures étaient déjà anciennes lorsque les Portails des Mondes furent établis et la Terre devint l’une de leurs destinations."),
          p("Après des siècles de communautés ethniques séparées, les crises qui frappèrent les Elfes terrestres les poussèrent d’abord à se cacher puis à se mêler davantage aux Humains, sous illusions puis sous l’Hologramme. Les origines physiques restent perceptibles mais les différences culturelles se sont fortement atténuées par rapport aux sociétés d’Aèr."),
          p("Le document décrit les Elyë comme généralement beaux, fins, agiles, sensibles à l’esthétique, doués pour la Magie et le tir grâce à des sens affinés. Leurs oreilles sont pointues et même sous Hologramme une certaine grâce ou dignité tend à transparaître."),
          p("En Grande Californie, ils sont particulièrement présents dans les arts, l’acting, la mode, le commerce et la recherche, leur perfectionnisme favorisant ces domaines. Ils existent cependant dans tous les métiers ; ils occupent moins souvent les travaux exclusivement physiques sans être pour autant de mauvais sportifs. Très intégrés à la Réalité, ils ne recherchent pas systématiquement la compagnie d’autres Elyë, sauf notamment lorsqu’ils souhaitent fonder une descendance.")
        ]
      },
      {
        id: "whurtens-source-especes-fantastiques",
        title: "Whurtens — physiologie, artisanat & sociabilité",
        level: 2,
        blocks: [
          p("Les Whurtens se développèrent dans les montagnes et profondeurs d’Aèr. Presque aussi anciens que les Elfes, ils restèrent longtemps contraints à ces régions et se diversifièrent moins avant l’ouverture des Portails. Sur Terre, l’absence de ces mêmes contraintes produisit davantage de diversité dans les cheveux, les yeux et les carnations."),
          p("Trapus, larges d’épaules et dotés d’une ossature très robuste, ils sont plus résistants que les Humains. Leur culture relationnelle est décrite comme chaleureuse, directe et peu attachée aux formalités. Leur sensibilité manuelle et la précision de leurs mains favorisent l’artisanat. Ils possèdent également une affinité magique supérieure à la moyenne humaine et les Whurtens terrestres de 2035 ne passent pas nécessairement par les runes."),
          p("En Californie, ils sont très présents dans les métiers manuels et artisanaux, la sculpture, le dessin, la recherche, les chantiers, les usines, le sport, l’alimentaire et la restauration. Leur sociabilité entretient des communautés whurtennes visibles derrière la Réalité : il est rare qu’un Whurten soit totalement coupé de tout réseau de ses semblables.")
        ]
      },
      {
        id: "ashylls-source-especes-fantastiques",
        title: "Ashylls — discrétion, inventivité & communautés",
        level: 2,
        blocks: [
          p("Les origines précises des Ashylls sont obscures. Ils viennent des profondeurs d’Aèr, où leurs grands empires souterrains ne ressemblent guère aux bandes de pillards connues en surface. Petits, verts, dotés d’oreilles plus longues encore que celles des Elfes, ils sont souples et très réactifs aux stimulations sensorielles mais moins forts et moins résistants que les Humains."),
          p("Parce qu’ils étaient classés parmi les peuples « nuisibles », la source ne sait pas si leurs premiers passages sur Terre résultèrent de captivité ou de grandes invasions. Ils constituent néanmoins la troisième grande communauté expatriée d’Aèr et leur aptitude à la discrétion les a probablement aidés à survivre aux purges historiques."),
          p("Le document ne leur attribue ni charisme exceptionnel ni talent universel, mais insiste sur leur inventivité. Leur fragilité et leur durée de vie plus courte favoriseraient des tempéraments extrêmes : très prudents ou, au contraire, audacieux jusqu’au « tout pour le tout »."),
          p("En Grande Californie, les Ashylls apparaissent dans tous les milieux et sont souvent sous-estimés. Ils évitent généralement les métiers de force mais leur compétitivité peut les pousser à des performances remarquables. Ils excellent notamment comme journalistes ou espions. Les communautés terrestres sont largement intégrées mais maintiennent souvent des liens denses, parfois via gangs ou mafias ; on les rencontre aussi bien dans les quartiers abandonnés que parmi les salarymen.")
        ]
      },
      {
        id: "thulkars-source-especes-fantastiques",
        title: "Thulkars — corps, Horde & vie terrestre",
        level: 2,
        blocks: [
          p("Sur Aèr, les Thulkars sont souvent classés parmi les peuples « nuisibles » parce que leurs Hordes refusent l’autorité des royaumes. Les migrations anciennes vers la Terre peuvent avoir suivi de grandes attaques contre les Portails ou des déportations comme esclaves."),
          p("Sous leur forme réelle, ce sont de grands humanoïdes verts, nettement plus grands, larges et lourds que les Humains et impossibles à confondre avec les Ashylls. Leur corps est puissant, résistant et relativement peu sensible à la douleur. Le document leur attribue aussi moins d’affect et une perception moyenne plus faible. Les lignées terrestres apparaissent moins robustes que les guerriers d’Aèr mais plus rapides, physiquement comme intellectuellement."),
          p("Les Thulkars californiens sont très présents dans les métiers physiques : sport, catch, armée, industrie, pompiers, cascade ou films d’action. Ils peuvent toutefois exercer tous les métiers. La culture de la Horde se transpose facilement aux corporations et autres groupes : une fois intégrés, ils défendent souvent les valeurs collectives avec une grande fidélité."),
          p("Leur pugnacité peut devenir entêtement et compliquer certaines études. Comme les Ashylls, leur héritage de peuple longtemps considéré comme nuisible contribue aussi à leur présence plus fréquente dans des quartiers abandonnés ou marginalisés.")
        ]
      },
      {
        id: "azmenoriens-source-especes-fantastiques",
        title: "Azménoriens — origine hybride & adaptation terrestre",
        level: 2,
        blocks: [
          p("Les Azménoriens naquirent de la rencontre entre Elfes gris et Archanges noirs. La source rattache leur apparition à de graves épidémies elfiques : les grossesses portant des hybrides d’Archanges noirs protégeaient les mères de ces maladies. Cette nouvelle espèce devint ensuite l’un des moteurs de l’expansion spatiale, de l’installation des Portails des Mondes et de plusieurs épisodes majeurs de l’histoire d’Aèr et de la galaxie."),
          p("Leur faible nombre terrestre s’explique par une histoire de guerres répétées : conflits des communautés parties dans l’espace, luttes entre groupes restés sur Aèr et affrontements avec d’autres ennemis. Les implantations sur les autres mondes furent donc réduites ; le comptoir marchand établi sur Terre ne prospéra pas longtemps."),
          p("Un Azménorien ressemble globalement à un Humain aux oreilles légèrement pointues et possède des capacités physiques comparables. Ses ailes de plumes noires constituent la différence la plus visible, mais elles sont rarement utilisées. La vie troglodyte sur Aèr, les espaces confinés des vaisseaux puis l’habitude terrestre ont progressivement réduit leur importance : elles servent surtout à bondir ou planer sur de courtes distances."),
          p("La source leur attribue une tendance plus fréquente aux réactions excessives et à aller jusqu’au bout d’une décision au point de devenir destructeurs, sans présenter cela comme une pathologie individuelle."),
          p("En Grande Californie, ils sont rares et très intégrés. Certains alterhumanistes interprètent leurs différences comme une mutation et acceptent l’idée d’une reproduction difficile ou impossible ; les familles plus conscientes de leur histoire sont souvent proches des réseaux elfiques. Le document ne leur attribue pas d’avantage général sur les Humains en dehors de leur héritage historique exceptionnel.")
        ]
      }
    ]
  }
];
