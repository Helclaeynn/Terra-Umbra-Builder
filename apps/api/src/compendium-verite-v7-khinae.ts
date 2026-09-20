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

const SOURCE = "TUC_Verite_V7_CROSSAUDIT_2026-09-10.docx";
const p = (text: string, style?: string): Block => ({ type: "p", text, ...(style ? { style } : {}) });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const talents = (natureId: string, groupLabel: string): Block =>
  p("{{Talents|group=" + natureId + ":" + slug(groupLabel) + "}}");

const allTalents = (natureId: string): Block => p("{{Talents|nature=" + natureId + "}}");

function loreArticle(id: string, title: string, tags: string[], sections: Section[]): Article {
  return {
    id,
    dataset: "verite-v7",
    category: "Vérité",
    sourceCategory: "Vérité",
    title,
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags,
    sections
  };
}

function ruleArticle(id: string, title: string, tags: string[], sections: Section[]): Article {
  return {
    id,
    dataset: "verite-v7",
    category: "Règles",
    sourceCategory: "Règles",
    title,
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags,
    sections
  };
}

export const COMPENDIUM_VERITE_V7_KHINAE_LORE_ARTICLES: Article[] = [
  loreArticle(
    "verite-v7-vampires-civilisation-cours-sangs",
    "Vampires — civilisation, Cours & Sangs",
    ["Vérité", "Vampires", "Khinae", "Cours", "Maisons", "Sangs noirs", "torpeur"],
    [
      {
        id: "branche-maudite",
        title: "Une branche maudite de Khinae",
        level: 2,
        blocks: [
          p("Les Vampires partagent avec les Garous une origine très ancienne : Khinae. Certaines lignées furent toutefois corrompues par les Fléaux. Cette altération ne s'est pas contentée de modifier leur corps : elle a changé leur destin métaphysique. Les descendants ordinaires de Khinae restent liés au Cycle ; la vraie mort du Vampire conduit son âme au Néant."),
          p("Cette condamnation explique une part de leur obsession de la survie. Un Vampire peut craindre la douleur, la perte d'une Maison ou l'effondrement de son influence comme n'importe quel être, mais derrière ces risques existe une certitude plus profonde : certaines destructions sont réellement définitives.")
        ]
      },
      {
        id: "vivants",
        title: "Des vivants, pas des cadavres",
        level: 2,
        blocks: [
          p("Le Vampire de TUC est biologiquement vivant. Il respire, possède un corps organique et peut avoir des enfants. Sa physiologie est maudite et capable de ralentir ses fonctions jusqu'à paraître cliniquement morte, mais il ne s'agit pas d'un cadavre animé."),
          p("La pleine expression de sa Nature suspend le vieillissement. Le sang nourrit sa régénération et ses capacités. Deux Vampires peuvent engendrer un Sang-pur, mais la naissance reste difficile et rare ; la majorité des Vampires contemporains sont des Transformés."),
          p("Beaucoup de Vampires de 2035 ont moins d'un siècle d'existence. Les anciens peuvent être beaucoup plus vieux tout en ayant perdu de longues périodes dans la torpeur : l'âge chronologique ne mesure donc ni l'expérience réelle ni la compréhension du monde moderne.")
        ]
      },
      {
        id: "couches-identite",
        title: "Cour, Maison et Sang noir",
        level: 2,
        blocks: [
          p("La société vampirique superpose trois couches qu'il ne faut jamais confondre. La Cour est un héritage profond, historique et métaphysique, lié à la manière dont la malédiction s'est structurée. La Maison, le rang et l'allégeance sont politiques et peuvent changer. Le Sang noir est l'expression surnaturelle personnelle du Vampire et ne suit pas mécaniquement les frontières politiques."),
          p("Un Vampire peut ainsi être Krovni par Cour, appartenir à une Maison implantée dans la Pègre californienne, porter un Sang noir associé à une autre histoire et avoir été Transformé il y a quinze ans dans une clinique clandestine. Aucun de ces éléments n'annule les autres.")
        ]
      },
      {
        id: "krovni",
        title: "Krovni Rytsari — la Couronne de Sang",
        level: 3,
        blocks: [
          p("La Krovni porte l'héritage occidental de la noblesse vampirique : rang, serment, commandement, guerre et continuité du pouvoir. Son féodalisme n'est pas un décor figé. Les Maisons ont appris à transposer leurs anciennes relations dans des holdings, sociétés de sécurité, réseaux immobiliers, structures politiques ou organisations criminelles."),
          p("Le serment y possède une valeur immense sans interdire l'intrigue. Un Krovni peut préparer pendant des décennies une situation qui rendra une promesse inutile plutôt que la rompre. La guerre reste une école de commandement, de logistique et d'organisation ; même la finance peut être pensée comme une campagne visant à isoler un adversaire."),
          p("En 2035, traditionalistes et modernistes ne s'opposent pas simplement sur les costumes : ils disputent la forme légitime que doit prendre une autorité durable. Dans les juridictions fragmentées de Californie, la Cour sait qu'il suffit souvent que les personnes qui décident sachent à qui elles doivent quelque chose.")
        ]
      },
      {
        id: "alghul",
        title: "Alghul Almalakiu — l'Assemblée des Goules",
        level: 3,
        blocks: [
          p("L'Alghul plonge ses racines dans les premières civilisations mésopotamiennes. L'ancienneté y vaut surtout parce qu'elle accumule langues mortes, souvenirs de villes disparues, rites, erreurs et secrets impossibles à reconstituer. Détruire un ancien peut revenir à incendier une bibliothèque dont une partie du catalogue n'existe nulle part ailleurs."),
          p("Cette logique explique le rapport de la Cour aux corps, aux restes et au sang. Un cadavre n'est pas seulement morbide : il peut être la dernière archive d'un événement. Une dette d'information peut durer plus longtemps qu'une dette d'argent et justifier la protection d'un individu que la Cour méprise par ailleurs."),
          p("Le numérique a élargi cette culture vers les archives cryptées, les génomes et les enregistrements invariants, sans remplacer la mémoire incarnée. Les Alghul savent mieux que beaucoup qu'un format disparaît, qu'un serveur brûle et qu'une correction du Voile peut altérer une preuve.")
        ]
      },
      {
        id: "ihuito",
        title: "Ihuito Meztzi — la Cour du Sang",
        level: 3,
        blocks: [
          p("L'Ihuito s'est développée sur les continents américains sous l'ombre de Quetzalcoatl. Le sang y est nourriture, héritage, puissance, dette et continuité sacrée. La prédation n'est donc pas nécessairement cachée derrière une gêne morale : elle peut être reconnue comme une réalité de Nature et encadrée par des obligations."),
          p("Qui peut donner, à qui peut-on prendre, que vaut un sang offert et quelle dette naît de l'alimentation sont des questions culturelles majeures. L'histoire coloniale et la destruction d'anciens cadres politiques ont forcé la Cour à se recomposer pendant des siècles ; elle n'est pas la survivance intacte d'un empire disparu."),
          p("Les cliniques, banques de sang et infrastructures médicales de 2035 ouvrent de nouvelles possibilités mais aussi de nouveaux débats : un sang stocké industriellement a-t-il la même valeur qu'un don direct ? Une transfusion crée-t-elle une obligation ? La Cour ne possède pas une réponse unique ; elle partage surtout l'idée que le sang n'est jamais totalement neutre.")
        ]
      },
      {
        id: "oru",
        title: "Oru Ayeraye — la Cour des Ténèbres",
        level: 3,
        blocks: [
          p("L'Oru rassemble l'héritage de plusieurs anciennes Cours africaines. Son unité ressemble moins à un État qu'à un réseau de filiations, de pactes et de mémoires. Les Ténèbres y sont un milieu de pouvoir et de dissimulation, mais aussi de relation avec des Deimons liés à certaines Maisons."),
          p("Ces créatures ne sont pas de simples familiers : le lien peut relever de l'héritage, de l'alliance, de la dette, d'une coopération intéressée ou d'une domination continuellement renégociée. La culture du pacte Oru s'intéresse donc autant aux dépendances réelles qu'aux mots prononcés."),
          p("La diaspora a trouvé dans les villes modernes de nouvelles ombres : infrastructures souterraines, zones de surveillance incomplète, bâtiments abandonnés et espaces socialement invisibles. Là où d'autres cherchent à contrôler une institution, l'Oru peut chercher à contrôler ce que cette institution ne voit pas.")
        ]
      },
      {
        id: "shi",
        title: "Shi Hun Zhe — la Cour des Anciens",
        level: 3,
        blocks: [
          p("Le Shi Hun Zhe s'est construit autour de lignées d'Extrême-Orient et de l'œuvre de Xinya. Sa doctrine comprend le Vampire comme un être fondamentalement déséquilibré et étudie sa relation au Yin, au Yang, au Hun et au Po."),
          p("Cette pensée a produit une culture d'étude, de discipline et d'administration. Justice, finances, diplomatie, sécurité et transmission donnent à la Cour l'allure d'un État sans territoire visible. Cette bureaucratie répond à des problèmes propres aux êtres qui vivent des siècles : dettes très anciennes, réveil d'un torpide, fonctions ayant survécu à plusieurs générations humaines, Transformés dont la famille ignore tout."),
          p("Les procédures restent politiques : elles n'empêchent ni rivalités ni clientélisme. Le monde de 2035 fournit au Shi des outils presque idéaux — bases de données, identités numériques, cryptographie — tout en multipliant les incohérences qu'un système enregistrant tout peut révéler.")
        ]
      },
      {
        id: "torpeur",
        title: "Torpeur et temps perdu",
        level: 2,
        blocks: [
          p("La torpeur n'est pas un raccourci vers l'expérience. Le corps attend tandis que le monde continue. Un ancien endormi en 1900 peut se réveiller après avoir manqué des guerres, la disparition d'empires, l'Holonet, les augmentations et toute l'accélération technologique des années 2020–2030."),
          p("Ses possessions peuvent avoir disparu, sa Maison changé de maître et ses titres perdu leur poids. Un Vampire de deux mille ans ayant dormi dix-huit siècles peut comprendre 2035 bien moins bien qu'un Transformé né en 1985.")
        ]
      },
      {
        id: "civilisation-2035",
        title: "Une civilisation de prédateurs en 2035",
        level: 2,
        blocks: [
          p("La mégapole moderne convient paradoxalement aux Vampires : professions nocturnes, Holonet, modifications corporelles, sociétés, cliniques, fonds d'investissement, clubs et réseaux criminels permettent à une Maison d'exister sans château. Mais les caméras, transactions, biométries et géolocalisations multiplient les traces ; le Voile ne remplace jamais la prudence."),
          p("La civilisation vampirique doit concilier des individus qui vieillissent lentement, des anciens ayant dormi des siècles et un renouvellement constant par les Transformés. Un Sang-pur peut recevoir dès l'enfance codes et alliances anciennes ; un Transformé apporte souvent une connaissance du présent que les lignées sous-estiment."),
          p("L'âge inspire le respect mais ne garantit ni compétence ni autorité pratique. Le réveil d'un ancien peut être l'arrivée simultanée d'un témoin irremplaçable du passé et d'un étranger incapable d'utiliser le monde moderne sans l'aide de plus jeunes."),
          p("Aucune Cour n'est un bloc absolu. Les Maisons changent de stratégie, les alliances traversent les frontières et les Transformés arrivent avec métiers, relations humaines, opinions, dépendances numériques et identités du XXIe siècle. Le passé demeure, mais le présent ne peut être gouverné uniquement par ceux qui l'ont le moins vécu.")
        ]
      },
      {
        id: "sangs-noirs",
        title: "Les douze Sangs noirs",
        level: 2,
        blocks: [
          table([
            ["Sang", "Expression dominante"],
            ["Écarlate — Anya", "Force, vitesse et perception hématique."],
            ["Primal — Lyssa", "Métamorphose animale et dissolution en brume."],
            ["Hypocrite — Briaerus", "Mensonge visuel, doubles et illusions."],
            ["Venimeux — Huitzitia", "Toxines biologiques et perception thermique."],
            ["Masqué — Kazuo", "Infiltration et imitation ; Sang volontairement très compatible avec la Semi-Révélation."],
            ["Aveugle — Ashream", "Perceptions non visuelles et accès astral."],
            ["Traqueur — Go’Ndai", "Analyse anatomique et manipulation hématique."],
            ["Glacial — Vjärmod", "Drain de chaleur et gel surnaturel."],
            ["Ardent — Larisha", "Chaleur, brûlure et embrasement."],
            ["Orageux — Branimir", "Électricité biologique et conduction."],
            ["Révélateur — Zhi Xia", "Pensée, dévoilement et destruction des mensonges surnaturels."],
            ["Condamné — Ashelia", "Dévoration magique et remplacement du corps."]
          ]),
          p("Les Sangs subtils privilégient perceptions et influences en SR ; transformation corporelle, prédation, puissance offensive et manifestations franches appartiennent surtout à R. Le Sang Masqué constitue une exception de conception importante, puisqu'il demeure presque entièrement utilisable en SR.")
        ]
      },
      {
        id: "sangs-exceptionnels",
        title: "Lignées rares et transformations exceptionnelles",
        level: 2,
        blocks: [
          table([
            ["Élément", "Statut"],
            ["Sang du Rêve", "Lignée rare liée aux vestiges de la Nemma Moogura : rêves, peur, voyeurisme et vampirisation de l'énergie vitale par le rêve ; branche exceptionnelle, pas catalogue ordinaire."],
            ["Vampires Oshiriques", "Transformation où le sang vampirique est remplacé par la Fontaine noire ; les dons natifs disparaissent au profit d'une autre physiologie et d'une autre prédation."],
            ["Sang d'Ivoire / Elfenbeinblut", "Altération liée à Vhodhal et à une faim destructrice ; ce n'est pas un Sang noir standard."],
            ["Héritages de Quetzalcoatl", "Phénomènes de fusion ou de possession liés au Roi divin ; ils dépassent l'échelle d'un Talent ordinaire et relèvent de personnages ou intrigues exceptionnels."]
          ])
        ]
      }
    ]
  ),
  loreArticle(
    "verite-v7-garous-khinae-meutes-pelages",
    "Garous — Khinae, Meutes & Pelages",
    ["Vérité", "Garous", "Khinae", "Meute", "Pelages", "Sangs vifs", "Héritage dévorant"],
    [
      {
        id: "heritage-khinae",
        title: "L'héritage de Khinae",
        level: 2,
        blocks: [
          p("Les Garous sont des descendants de Khinae restés liés au Cycle. Leur Nature n'est ni une maladie ni une infection et ne se transmet jamais par morsure. Le lignage peut rester silencieux pendant plusieurs générations : des parents se croyant entièrement Humains peuvent avoir un enfant chez qui l'héritage s'éveille."),
          p("Porter le sang de Khinae ne signifie pas nécessairement pouvoir se transformer. Certains descendants ne découvrent jamais leur Nature ; d'autres commencent par des perceptions ou des instincts anormaux avant la première véritable Mue.")
        ]
      },
      {
        id: "appel-meute",
        title: "L'Appel de la Meute",
        level: 2,
        blocks: [
          p("Chez les Loups, l'héritage de Khinae s'est combiné avec deux espèces profondément sociales, l'Humain et le loup. L'Appel de la Meute pousse à définir un groupe comme « les siens » et à ressentir intensément confiance, protection et appartenance. Une Meute peut être familiale, traditionnelle, professionnelle ou inclure des êtres qui ne sont pas Garous."),
          p("Cette tendance n'impose aucune obéissance automatique. Les Loups lisent aussi instinctivement la dominance et le danger ; ils peuvent choisir d'affronter ce que leur corps leur conseille d'éviter. Le courage garou consiste souvent précisément à agir malgré cette alarme.")
        ]
      },
      {
        id: "formes",
        title: "Trois formes et un corps de guerre",
        level: 2,
        blocks: [
          p("Sous le Voile, le Garou est réellement humain. La Révélation fait d'abord émerger instincts et sens ; la forme animale restitue le loup ; la Mue hybride produit un corps de guerre associant intelligence humaine, masse, griffes, crocs, régénération et instincts de prédateur."),
          p("La Mue exige un effort réel. Les transformations hybrides répétées fatiguent l'organisme et la Frénésie ne représente pas une disparition totale de l'intelligence : elle réorganise brutalement les priorités autour de la chasse, de la défense, de la poursuite ou de la destruction.")
        ]
      },
      {
        id: "pelages",
        title: "Les six Pelages",
        level: 2,
        blocks: [
          p("Les Pelages furent historiquement liés à des populations et couleurs de loup ; en 2035 ils sont avant tout des traditions culturelles, idéologiques et spirituelles. La couleur réelle de la fourrure n'impose aucune appartenance."),
          p("Les Gris placent la protection directe au centre de leur identité ; les Noirs pensent territoire et chasse collective ; les Blancs ont fait de la discipline martiale et de la mémoire des Ulfhednars une culture ; les Roux maîtrisent la Mue comme langage et outil ; les Bruns travaillent instinct, esprits et pactes ; les Dorés conservent une tradition inquiétante de dévoration occulte et d'acquisition de Traces."),
          p("Ces cultures peuvent produire autant des communautés protectrices que des structures autoritaires. Les Meutes mixtes et les changements d'allégeance existent : l'Appel vécu au quotidien peut compter davantage qu'une proximité idéologique lointaine.")
        ]
      },
      {
        id: "societe",
        title: "Meutes, familles et mémoire",
        level: 2,
        blocks: [
          p("La société garoue commence par la Meute puis s'élargit en Familles, clans et structures de Pelage. Les titres existent mais les liens réels comptent souvent davantage : un Alpha peu titré peut être influent parce qu'il appartient personnellement à la Meute d'un dirigeant, tandis qu'un titre prestigieux vaut peu si personne ne suit celui qui le porte."),
          p("La Meute n'est pas une caserne ni une caricature de hiérarchie animale. Elle peut être famille choisie, groupe de chasse, réseau urbain ou unité de protection. L'Alpha est suivi parce que le groupe lui reconnaît une capacité à tenir la Meute ou à décider, pas parce qu'une domination biologique universelle l'imposerait."),
          p("La rupture est néanmoins plus douloureuse que pour un Humain : exclusion, perte de la Meute ou incapacité à en trouver une peuvent produire un isolement profond. À l'inverse, appartenir à une Meute n'abolit jamais la personnalité.")
        ]
      },
      {
        id: "sangs-vifs",
        title: "Pelage, Sang vif et héritages",
        level: 2,
        blocks: [
          p("Le Pelage est culturel ; le Sang vif appartient à une couche plus profonde de l'héritage Khinae. Naturel, Alpha, Révélateur, Écarlate, Sculpteur, Funeste, Primal, Chasseur, Sagesse, Enragé, Enchaîné et Vengeur sont autant de directions possibles. Des membres d'une même famille peuvent porter des Sangs différents et des ennemis manifester la même affinité."),
          p("Le premier Sang se manifeste généralement comme un héritage spontané ; l'expérience peut ensuite ouvrir d'autres facettes. Certains anciens possèdent donc des combinaisons que de jeunes Garous considèrent presque comme mythiques.")
        ]
      },
      {
        id: "heritage-devorant",
        title: "L'Héritage dévorant",
        level: 2,
        blocks: [
          p("Aux plus hauts niveaux des vieilles structures subsiste un tabou : un Grand Meneur peut dévorer son prédécesseur et absorber une partie de sa mémoire, de sa personnalité et de sa puissance. Cette transmission ne rend pas tous les Garous immortels et n'est jamais une pratique banale."),
          p("Le nouveau Meneur reste une personne, mais habitudes, souvenirs et obsessions peuvent rejoindre sa propre identité. Certaines fonctions semblent ainsi plus anciennes que le corps qui les porte. Cette pratique révèle jusqu'où la logique collective de Khinae peut aller lorsqu'elle transforme la continuité du groupe en quelque chose de littéralement incorporé.")
        ]
      },
      {
        id: "ville-2035",
        title: "Les Garous dans la ville moderne",
        level: 2,
        blocks: [
          p("La société moderne n'a pas supprimé la Meute : elle lui a donné de nouvelles formes. Plusieurs appartements d'un même immeuble, une brigade, un groupe de Crawlers ou des liens maintenus entre plusieurs villes peuvent tous devenir une Meute."),
          p("La ville transforme aussi la territorialité. Un territoire peut être un quartier, une ligne de transport, un réseau d'entreprises ou une série de lieux où la Meute sait pouvoir agir. Deux Meutes peuvent vivre dans la même ville tout en occupant des écosystèmes sociaux presque sans contact."),
          p("Le Voile permet de travailler, louer, prendre le métro ou étudier sous forme humaine, mais les odeurs, les sons, les réactions à la menace et l'Appel donnent au quotidien une intensité propre. Les Garous de 2035 ne vivent ni dans une forêt hors du temps ni dans une société secrète unique : ce sont des individus modernes portant un héritage animal très ancien.")
        ]
      }
    ]
  ),
  loreArticle(
    "verite-v7-descendants-khinae",
    "Descendants de Khinae",
    ["Vérité", "Khinae", "thérianthropes", "Lignées", "Sangs vifs"],
    [
      {
        id: "famille",
        title: "Une famille beaucoup plus vaste",
        level: 2,
        blocks: [
          p("Khinae n'a jamais eu pour seuls héritiers les Loups. Canidés errants, renards, grands félins, chats, rapaces, requins, serpents, Boudas, Berserkirs, crocodiliens et d'autres lignées partagent la même origine fondamentale. Ils restent liés au Cycle, peuvent se Révéler, muer, régénérer et éveiller des Sangs vifs, sans partager les instincts spécifiquement lupins."),
          p("Un Tigre n'éprouve pas automatiquement l'Appel de la Meute, un Serpent ne lit pas la dominance comme un loup et un Requin n'organise pas son territoire comme un Pelage Noir. L'héritage commun est une parenté cosmologique ; l'animal réel continue de modeler corps, instincts et culture.")
        ]
      },
      {
        id: "eveil",
        title: "Lignage, secret et éveil tardif",
        level: 2,
        blocks: [
          p("Comme chez les Loups, l'héritage est généalogique et non contagieux. Il peut rester silencieux pendant des générations. Certaines familles savent exactement quels signes observer ; d'autres ont transformé le dernier souvenir fiable en superstition domestique."),
          p("Les petites lignées n'ont souvent aucune institution capable d'identifier un nouvel éveillé. Certains rejoignent des communautés Khinae plus vastes, parfois garoues, puis doivent adapter ce qu'ils ont appris. D'autres cherchent leurs semblables ou reconstruisent seuls leur identité à partir de fragments."),
          p("La ressemblance ne doit jamais devenir assimilation. Une Meute peut protéger un descendant félin sans répondre exactement à ses besoins. L'origine commune est une langue de parenté, pas un modèle unique de société.")
        ]
      },
      {
        id: "sans-pelage",
        title: "Sans Pelage et sans capitale commune",
        level: 2,
        blocks: [
          p("Les autres descendants n'ont généralement rien d'équivalent aux grandes structures lupines. Les Canidés errants sont sociaux mais leurs cultures sont locales et fragmentées. Les Félins peuvent former alliances et familles durables sans ressentir le besoin d'une présence collective constante. Les Renards survivent volontiers dans les espaces déjà occupés par d'autres."),
          p("Cette faible densité constitue elle-même un camouflage. Même des initiés peuvent rencontrer une lignée sans disposer d'une catégorie correcte et lui appliquer le folklore local. Les Chasseurs expérimentés apprennent alors à revenir au corps, aux traces et au comportement plutôt qu'au nom donné par le premier témoin.")
        ]
      },
      {
        id: "milieux",
        title: "Des instincts qui changent avec le milieu",
        level: 2,
        blocks: [
          p("Les prédateurs aquatiques organisent leur existence autour des ports, littoraux, installations offshore, communautés de plongeurs ou zones de pêche plutôt qu'autour de territoires terrestres. Chez les reptiles, température, immobilité, perception et économie d'énergie produisent d'autres rapports au temps et à l'action."),
          p("Un même Sang vif peut donc apparaître à travers des instincts radicalement différents tout en appartenant au même héritage profond. Le Compendium traite chaque Lignée comme une culture et une physiologie réelles, jamais comme un « Garou avec un autre animal ». ")
        ]
      },
      {
        id: "lignees",
        title: "Lignées majeures conservées dans le corpus",
        level: 2,
        blocks: [
          table([
            ["Lignée", "Profil culturel et biologique"],
            ["Canidés errants", "Coyotes, Chacals, Lycaons, Dholes et Dingos ; poursuite, endurance et survie sans civilisation de Pelages."],
            ["Renards", "Survivants libres très rares ; adaptation, pistes, odeurs et fausses directions. La majorité historique connue a cédé à V’Aagor."],
            ["Grands Félins", "Tigres et lignées apparentées ; puissance individuelle, embuscade, bond et frontières personnelles plutôt que Meute."],
            ["Chats", "Moins puissants mais très adaptables, diplomates et curieux ; capables de côtoyer d'autres monstres sans se définir comme leurs familiers."],
            ["Rapaces", "Aigles, Faucons, Hiboux et Vautours ; hauteur, observation et Bonds ailés plutôt qu'un sous-système de vol permanent."],
            ["Requins", "Principaux Khinae marins restés indépendants de Thul ; existence façonnée par l'eau, les profondeurs et la perception bioélectrique."],
            ["Serpents", "Lignées dispersées, venimeuses, constrictrices ou furtives ; patience, locomotion ophidienne et physiologies très différentes."],
            ["Boudas", "Hommes-Hyènes presque exterminés puis renaissants ; vie sociale organisée autour de Bandes plus opportunistes que la Meute lupine."],
            ["Berserkirs", "Hommes-Ours massifs, historiquement liés par un pacte de sang aux Ulfhednars ; peu de communautés permanentes."],
            ["Crocodiliens", "Branche lourde d'embuscade aquatique ; armure naturelle, lenteur terrestre et morphologies héritées d'un corpus ancien plus esquissé."]
          ])
        ]
      },
      {
        id: "rarete-corruption",
        title: "Rareté et cas corrompus",
        level: 2,
        blocks: [
          p("Ces Lignées sont rares et leur présence dans le corpus ne signifie pas qu'elles soient disponibles partout. La rareté doit servir le monde : familles dispersées, petites communautés, manque d'infrastructure et rencontres parfois uniques."),
          p("Un Renard libre est exceptionnel parce que la majorité historique connue a cédé à V’Aagor. Les Jaguars libres de Quetzal sont rares. Les Requins ne sont pas immunisés à Thul. Certaines lignées serpentines peuvent vénérer Shaoggith sans être automatiquement corrompues : religion, héritage culturel et Source de Corruption restent distincts. Boudas et Berserkirs peuvent posséder leurs propres alliances sans créer de Pelage supplémentaire.")
        ]
      }
    ]
  )
];

export const COMPENDIUM_VERITE_V7_KHINAE_RULE_ARTICLES: Article[] = [
  ruleArticle(
    "regles-verite-v7-vampire-nature-predation-cours",
    "Nature Vampire, prédation & Cours",
    ["Vérité", "Vampire", "Nature", "prédation", "Cours", "Révélation"],
    [
      {
        id: "architecture",
        title: "Architecture du Vampire",
        level: 2,
        blocks: [
          p("Le Vampire est une Nature issue de l'héritage Khinae corrompu par les Fléaux. La Nature fournit le socle biologique et métaphysique ; la Cour d'origine est une variation durable de la malédiction donnant une Empreinte gratuite ; le Sang noir est l'expression surnaturelle individuelle ; les Talents communs approfondissent le socle ; Maison, rang et allégeance restent politiques et peuvent évoluer."),
          p("La Cour doit modifier réellement la manière de jouer sans créer un sous-système séparé. Changer d'allégeance ne change ni Cour d'origine ni Nature.")
        ]
      },
      {
        id: "etats",
        title: "Voilé, Semi-Révélé, Révélé",
        level: 2,
        blocks: [
          table([
            ["État", "Effets communs"],
            ["Voilé", "Corps humain ; aucun bonus de Nature. Le Vampire vieillit et subit les limites biologiques humaines s'il demeure durablement dans cet état."],
            ["Semi-Révélé", "+1 Vigueur, +1 Volonté ; accès aux sens surnaturels et pouvoirs subtils. Compromis, pas forme de combat principale."],
            ["Révélé", "+2 Vigueur, +1 Agilité, +1 Volonté ; accès au corps prédateur, à la prédation, à la stase, à la régénération, à l'Empreinte de Cour et à la majorité des Talents de Sang."]
          ])
        ]
      },
      {
        id: "proprietes",
        title: "Propriétés gratuites de la Nature",
        level: 2,
        blocks: [
          table([
            ["Propriété", "Règle"],
            ["Âme condamnée", "À la mort véritable, l'âme vampirique finit dans le Néant au lieu de rejoindre le Cycle."],
            ["Petite immortalité — R", "Le véritable corps ne vieillit pas. Un maintien anormalement long en V fait reprendre un vieillissement humain ; se Révéler suffisamment régulièrement l'empêche. La cadence reste fictionnelle."],
            ["Physiologie maudite — R", "+3 Constitution contre maladies ordinaires ; peut ralentir ou interrompre les fonctions vitales et paraître cliniquement mort, sans tromper nécessairement un examen poussé."],
            ["Sens prédateurs — SR", "Vision claire dans l'obscurité naturelle et perception extrêmement fine du sang frais ; une blessure ouverte proche est difficile à dissimuler."],
            ["Prédation sanguine — R, 1 PA", "Sur résistance : Vigueur + Pugilat contre Défense. Une réussite inflige les dégâts normaux et rend 1 + DR PV, au maximum autant que la victime perd réellement. Pas de jet si cible consentante ou impuissante et aucune incertitude."],
            ["Effacement prédateur — R", "Dans des ombres suffisantes, peut tenter Furtivité sans couvert humain normalement suffisant. Ce n'est pas l'effacement absolu d'Enfant des Ténèbres."],
            ["Fascination vampirique — SR, 1 PA", "Charisme + Diplomatie contre Volonté + Force Mentale. Force une vraie attention et ouvre une influence sociale normalement rejetée ; ne donne aucun ordre forcé."],
            ["Stase — R, 2 PA", "Devient inerte et sans défense ; dégradation naturelle et hémorragies s'arrêtent ; récupère 1 PV/heure. Sortie volontaire : 1 PA sous pression."],
            ["Malédiction vampirique — R", "Soleil direct : 2 PV irréductibles par round. Les pouvoirs réellement divins peuvent exploiter la malédiction ; une prière ordinaire n'est pas une arme."]
          ])
        ]
      },
      {
        id: "talents-communs",
        title: "Talents communs",
        level: 2,
        blocks: [
          p("Le détail mécanique des Talents communs vient directement du registre canonique du Builder. Ils approfondissent des propriétés déjà présentes et ne remplacent ni Sang noir ni Empreinte de Cour."),
          talents("vampire", "Vampire — commun"),
          p("Progression du charme : Fascination signifie « écoute-moi » ; Charme inhumain « fais-moi confiance » ; Domination « obéis-moi » ; Somnambulisme agit sur l'esprit jusque dans le sommeil.")
        ]
      },
      {
        id: "empreintes",
        title: "Empreintes gratuites des cinq Cours",
        level: 2,
        blocks: [
          p("L'Empreinte est liée à la Cour d'origine et non à l'allégeance actuelle."),
          table([
            ["Cour", "Empreinte gratuite"],
            ["Krovni Rytsari", "Prédateur de guerre — R : tant qu'il n'est pas Surpris, +3 Défense passive et active contre les attaques physiques."],
            ["Alghul Almalakiu", "Écho des Morts — R : au contact d'un cadavre ou d'une quantité significative de sang, perçoit des traces utiles de la mort — cause probable, violence, émotion finale, présence marquante, etc."],
            ["Oru Ayeraye", "Enfant des Ténèbres — R, 1 PA : dans une zone suffisamment obscure, fait un avec l'ombre ; n'est pas vu ni directement ciblable. Ce n'est pas un Couvert matériel et aucun capteur profane ne contourne l'effet."],
            ["Ihuito Meztzi", "Cycle du Sang — R : 1/scène après une Prédation réussie, le prochain Talent de Sang utilisé avant la fin du round coûte 1 PA de moins, minimum 0."],
            ["Shi Hun Zhe", "Équilibre dérobé — R : après s'être nourri, 1/scène, peut consumer le Hun/Yang absorbé pour obtenir une résistance contre une faiblesse ou un effet auquel sa Nature ne permettrait normalement pas de résister."]
          ])
        ]
      },
      {
        id: "krovni-talents",
        title: "Krovni Rytsari — traditions de Cour",
        level: 3,
        blocks: [
          p("Signature culturelle : +1 Diplomatie lorsque rang, noblesse, serment, commandement ou protocole vampirique sont directement en jeu."),
          talents("vampire", "Krovni Rytsari — Talents de Cour")
        ]
      },
      {
        id: "alghul-talents",
        title: "Alghul Almalakiu — traditions de Cour",
        level: 3,
        blocks: [talents("vampire", "Alghul Almalakiu — Talents de Cour")]
      },
      {
        id: "oru-talents",
        title: "Oru Ayeraye — traditions de Cour",
        level: 3,
        blocks: [
          talents("vampire", "Oru Ayeraye — Talents de Cour"),
          p("Le Lien du Deimon utilise le moteur transversal des Compagnons liés : le Deimon demeure un PNJ réel et ne reçoit aucun pool de PA indépendant.")
        ]
      },
      {
        id: "ihuito-talents",
        title: "Ihuito Meztzi — traditions de Cour",
        level: 3,
        blocks: [talents("vampire", "Ihuito Meztzi — Talents de Cour")]
      },
      {
        id: "shi-talents",
        title: "Shi Hun Zhe — traditions de Cour",
        level: 3,
        blocks: [talents("vampire", "Shi Hun Zhe — Talents de Cour")]
      }
    ]
  ),
  ruleArticle(
    "regles-verite-v7-vampire-sangs-transformations",
    "Sangs noirs & transformations exceptionnelles",
    ["Vérité", "Vampire", "Sangs noirs", "transformations", "lignées rares"],
    [
      {
        id: "principe",
        title: "Principe des Sangs noirs",
        level: 2,
        blocks: [
          p("SR couvre normalement perceptions, influences discrètes et prémices du pouvoir ; R couvre transformation corporelle, prédation, puissance offensive et manifestations franches. Les Sangs subtils peuvent déroger à cette convention lorsque leur fonction l'exige, notamment le Sang Masqué.")
        ]
      },
      ...[
        ["sang-ecarlate", "Sang Écarlate — Anya", "Force, vitesse et perception hématique.", "Sang Écarlate — Anya"],
        ["sang-primal", "Sang Primal — Lyssa", "Métamorphose animale et dissolution en brume.", "Sang Primal — Lyssa"],
        ["sang-hypocrite", "Sang Hypocrite — Briaerus", "Mensonge visuel, doubles et illusions.", "Sang Hypocrite — Briaerus"],
        ["sang-venimeux", "Sang Venimeux — Huitzitia", "Toxines biologiques et perception thermique.", "Sang Venimeux — Huitzitia"],
        ["sang-masque", "Sang Masqué — Kazuo", "Infiltration et imitation ; ce Sang reste presque entièrement utilisable en SR par conception.", "Sang Masqué — Kazuo"],
        ["sang-aveugle", "Sang Aveugle — Ashream", "Perceptions non visuelles et accès astral.", "Sang Aveugle — Ashream"],
        ["sang-traqueur", "Sang Traqueur — Go’Ndai", "Analyse anatomique et manipulation hématique.", "Sang Traqueur — Go’Ndai"],
        ["sang-glacial", "Sang Glacial — Vjärmod", "Drain de chaleur et gel surnaturel.", "Sang Glacial — Vjärmod"],
        ["sang-ardent", "Sang Ardent — Larisha", "Chaleur, brûlure et embrasement.", "Sang Ardent — Larisha"],
        ["sang-orageux", "Sang Orageux — Branimir", "Électricité biologique et conduction.", "Sang Orageux — Branimir"],
        ["sang-revelateur", "Sang Révélateur — Zhi Xia", "Pensée, dévoilement et destruction des mensonges surnaturels.", "Sang Révélateur — Zhi Xia"],
        ["sang-condamne", "Sang Condamné — Ashelia", "Dévoration magique et remplacement du corps.", "Sang Condamné — Ashelia"]
      ].map(([id, title, intro, group]) => ({
        id,
        title,
        level: 3,
        blocks: [p(intro), talents("vampire", group)]
      })),
      {
        id: "exceptionnels",
        title: "Sangs rares et transformations exceptionnelles",
        level: 2,
        blocks: [
          p("Tout ce qui existe dans le lore vampirique n'entre pas dans le catalogue normal à 1–3 PTV. Certaines lignées sont des récompenses narratives, transformations ou catastrophes à part entière."),
          table([
            ["Élément", "Traitement"],
            ["Sang du Rêve", "Branche exceptionnelle liée aux vestiges de la Nemma Moogura : rêves, peur, voyeurisme et vampirisation de l'énergie vitale par le rêve."],
            ["Vampires Oshiriques", "Transformation complète par la Fontaine noire ; remplace la physiologie et les dons vampiriques ordinaires."],
            ["Sang d'Ivoire / Elfenbeinblut", "Altération liée à Vhodhal et à une faim destructrice ; hors catalogue des Sangs noirs."],
            ["Héritages de Quetzalcoatl", "Fusion ou possession liée au Roi divin ; phénomène exceptionnel de scénario ou de personnage."]
          ])
        ]
      },
      {
        id: "eveil",
        title: "Éveiller d'autres Sangs",
        level: 2,
        blocks: [
          p("Un Sang noir est considéré comme maîtrisé après 4 PTV réellement investis dans son arbre. Une fois ce seuil atteint, l'éveil d'un Sang supplémentaire coûte 3 PTV ; ses Talents doivent ensuite être achetés normalement. La petite immortalité du Vampire reste volontairement fictionnelle et n'est pas une monnaie de progression.")
        ]
      }
    ]
  ),
  ruleArticle(
    "regles-verite-v7-garou-nature-formes-frenesie-pelages",
    "Nature Garou, formes, Frénésie & Pelages",
    ["Vérité", "Garou", "formes", "Mue", "Frénésie", "Pelages"],
    [
      {
        id: "architecture",
        title: "Architecture du Garou",
        level: 2,
        blocks: [
          p("Le Garou est un descendant de Khinae. Sa Nature exprime instincts, sens, régénération, Appel de la Meute et transformation. Les formes humaine révélée, animale et hybride sont distinctes de la simple Révélation. Le Pelage est une tradition culturelle et spirituelle ; le Sang vif une facette profonde de Khinae ; les Talents communs perfectionnent chasse, régénération et maîtrise du corps."),
          p("Sa puissance doit rester physiquement explosive mais coûteuse : l'hybride dépasse la Révélation vampirique commune, en échange d'une Mue lente et de l'épuisement des transformations répétées.")
        ]
      },
      {
        id: "etats",
        title: "Nature commune et états du Voile",
        level: 2,
        blocks: [
          table([
            ["État", "Expression"],
            ["Voilé", "Corps humain complet ; pas de régénération surnaturelle, transformation ou expression physique des dons."],
            ["Semi-Révélé", "Toujours humain extérieurement ; instincts, sens et Talents SR commencent à percer."],
            ["Révélé — humain", "Morphologie humaine avec véritable Nature présente ; petite régénération, Talents R et accès aux transformations ; peut être maintenu durablement."],
            ["Révélé — animal", "Vraie forme animale ; chez le Garou classique, un loup anatomiquement lupin, souvent grand et impressionnant."],
            ["Révélé — hybride", "Forme de guerre Khinae : puissance, régénération complète, griffes et instinct de combat."]
          ])
        ]
      },
      {
        id: "dons",
        title: "Dons gratuits de la Nature Garou",
        level: 2,
        blocks: [
          table([
            ["Don", "Règle"],
            ["Âme du Cycle", "À la mort véritable, rejoint normalement le Cycle."],
            ["Appel de la Meute", "Peut reconnaître comme « les siens » des proches de toute espèce ; l'isolement durable est contre-nature et peut devenir source de Stress ou de malaise narratif."],
            ["Hiérarchie instinctive — SR", "Ressent dominance et danger réels avant de les rationaliser. Le MJ transmet l'alarme face à un prédateur écrasant ; aucune obéissance n'est forcée et le titre seul ne suffit pas."],
            ["Sens éveillés — SR", "Odorat et ouïe donnent les informations naturellement inaccessibles à un Humain : odeurs, sang, piste récente, présence proche ; aucun bonus universel."],
            ["Bravoure lupine — SR", "+3 uniquement pour résister à peur ou intimidation surnaturelle ; n'annule pas la Hiérarchie instinctive."],
            ["Régénération lente — R", "Humain révélé ou animal : 1 PV/heure hors combat."],
            ["Aura prédatrice — R", "Lorsqu'il traque ou approche une proie, peut tenter de masquer anormalement sa présence, y compris contre des perceptions animales ; autorise le test, sans bonus automatique."]
          ])
        ]
      },
      {
        id: "forme-humaine",
        title: "Forme humaine révélée",
        level: 3,
        blocks: [
          p("Mode polyvalent : mains, parole, équipement, armes, augmentations et Compétences restent disponibles. La Nature R et la Régénération lente s'appliquent, sans gros bonus automatique d'Attribut.")
        ]
      },
      {
        id: "forme-loup",
        title: "Forme animale — Loup",
        level: 3,
        blocks: [
          table([
            ["Propriété", "Effet"],
            ["Agilité", "+2 Agilité."],
            ["Déplacement", "Environ ×2 sur terrain adapté."],
            ["Sens", "+3 Perception quand odorat ou ouïe sont réellement utiles ; une piste fraîche évidente ne demande pas de jet."],
            ["Furtivité", "+3 dans un environnement où un loup peut raisonnablement progresser discrètement."],
            ["Attaque naturelle", "Morsure DGT 3."],
            ["Régénération", "Régénération lente."],
            ["Morphologie", "Pas de mains ni de parole humaine articulée ; l'équipement ordinaire ne fusionne pas."]
          ]),
          p("Les autres formes animales acquises suivent le même principe : quelques propriétés évidentes et contextuelles, jamais une seconde fiche complète.")
        ]
      },
      {
        id: "forme-hybride",
        title: "Forme hybride — corps de guerre Khinae",
        level: 3,
        blocks: [
          table([
            ["Propriété", "Effet"],
            ["Puissance", "+3 Vigueur."],
            ["Vitesse", "+2 Agilité."],
            ["Instinct de combat", "+3 Pugilat."],
            ["Armes naturelles", "Griffes et crocs DGT 5."],
            ["Armure corporelle", "Armure 2."],
            ["Régénération monstrueuse", "Au début de chaque round : +2 PV tant que le Garou est vivant et reste hybride ; reconstruction hors combat très accélérée."],
            ["Mobilité", "Déplacement environ ×2 sur terrain adapté ; prouesses évidentes pour ce corps sans jet."],
            ["Machine de guerre", "À partir du round suivant la fin de la transformation : +1 PA par round au-delà du maximum normal."],
            ["Morphologie", "Une action est possible selon le corps ; une arme adaptée peut être utilisée, un clavier standard ou une petite voiture posent les problèmes évidents."]
          ]),
          p("L'hybride est volontairement le pic de puissance physique du Garou. Son équilibrage vient principalement du temps de transformation et de l'épuisement.")
        ]
      },
      {
        id: "mue",
        title: "Transformation et épuisement de Mue",
        level: 2,
        blocks: [
          p("La transformation hybride prend un round complet, sans autre action significative. La forme est achevée au début du round suivant et le +1 PA ne commence qu'aux rounds ultérieurs. Passer directement de V ou SR à R hybride utilise ce même round complet ; une interruption réelle peut demander Vigueur + Constitution."),
          p("Passer de l'humain révélé à l'animal coûte 1 PA et ne compte normalement pas dans l'épuisement des Mues hybrides."),
          table([
            ["Mue hybride depuis le dernier repos réel", "Vigueur + Constitution"],
            ["1re", "Automatique"],
            ["2e", "Difficulté 15"],
            ["3e", "Difficulté 18"],
            ["4e", "Difficulté 21"],
            ["5e et suivantes", "Difficulté 25"]
          ]),
          p("Réussite : Mue normale. Échec : le Garou peut forcer et subit 3 PV irréductibles de fatigue organique. Échec narratif : le round est perdu et aucune nouvelle Mue hybride n'est possible durant la scène.")
        ]
      },
      {
        id: "frenesie",
        title: "Frénésie",
        level: 2,
        blocks: [
          p("La Frénésie n'est ni une jauge ni un état de Stress. Elle n'apparaît que lorsqu'un Talent, un Sang, un effet surnaturel ou une situation l'indique explicitement."),
          table([
            ["Règle", "Effet"],
            ["Impulsion", "Objet clair — proie, ennemi, menace, protection, vengeance. Au moins 1 PA par round doit être consacré à le poursuivre lorsque possible."],
            ["Instinct contre raison", "−3 aux actions exigeant calme et concentration ; une action violente simple, y compris tirer, reste possible."],
            ["Peur écrasée", "Les conséquences de Tendu/Paniqué dues uniquement à la peur sont ignorées pendant la Frénésie et reviennent ensuite."],
            ["Meute", "Les membres restent normalement reconnus. S'ils empêchent physiquement l'Impulsion, Volonté + Maîtrise spirituelle difficulté 15 peut être requis ; en échec l'obstacle est hostile pour le round."],
            ["Sortie volontaire", "Volonté + Maîtrise spirituelle difficulté 15 ; 12 si la cause a disparu."],
            ["Rappel de la Meute", "Un membre reconnu peut dépenser 1 PA pour accorder +2 au test de sortie."]
          ]),
          p("La Hiérarchie instinctive continue d'exister : la rage n'empêche pas le corps de sentir qu'un prédateur écrasant lui est supérieur.")
        ]
      },
      {
        id: "talents-communs",
        title: "Talents communs",
        level: 2,
        blocks: [talents("garou", "Garou — commun")]
      },
      {
        id: "pelages",
        title: "Pelages — traditions gratuites et arbres",
        level: 2,
        blocks: [
          p("Le Pelage est une appartenance culturelle, idéologique et spirituelle ; la couleur historique est un symbole.")
        ]
      },
      {
        id: "gris",
        title: "Pelages Gris — Gardien de la Meute",
        level: 3,
        blocks: [
          p("Tradition gratuite — Gardien de la Meute — R, Réaction 1 PA : lorsqu'un allié à moins d'un Déplacement est ciblé par une attaque physique et que l'interposition est possible, le Gris se déplace jusqu'à lui et devient la cible."),
          talents("garou", "Pelages Gris — Gardien de la Meute")
        ]
      },
      {
        id: "noirs",
        title: "Pelages Noirs — Territoire de la Meute",
        level: 3,
        blocks: [
          p("Tradition gratuite — Territoire de la Meute — R : après avoir parcouru et marqué instinctivement un site cohérent, le Garou le considère comme son territoire jusqu'à en choisir un autre ; une créature vivante qui s'y introduit ne peut le Surprendre sans vaincre son instinct par une opposition appropriée."),
          talents("garou", "Pelages Noirs — Territoire de la Meute")
        ]
      },
      {
        id: "blancs",
        title: "Pelages Blancs — Discipline de Fenrir",
        level: 3,
        blocks: [
          p("Tradition gratuite — Discipline de Fenrir — R : à la fin d'un round, peut conserver 1 PA inutilisé jusqu'au début du round suivant, exclusivement pour une Réaction — Défense active, déplacement d'urgence ou Talent explicitement réactif."),
          talents("garou", "Pelages Blancs — Discipline de Fenrir")
        ]
      },
      {
        id: "roux",
        title: "Pelages Roux — Mue partielle",
        level: 3,
        blocks: [
          p("Tradition gratuite — Mue partielle — R, 1 PA : sous forme humaine révélée, manifeste jusqu'à la fin du round une propriété morphologique animale ou hybride. N'accorde jamais l'Armure 2, le +1 PA ou la régénération complète de l'hybride."),
          talents("garou", "Pelages Roux — Mue partielle")
        ]
      },
      {
        id: "bruns",
        title: "Pelages Bruns — Accord des Kami",
        level: 3,
        blocks: [
          p("Tradition gratuite — Accord des Kami — SR : perçoit les esprits/Keltas suffisamment présents et peut communiquer. 1/scène dans un lieu spirituellement marqué, peut obtenir une impression simple : danger, violence passée, perturbation surnaturelle, émotion dominante…"),
          talents("garou", "Pelages Bruns — Accord des Kami")
        ]
      },
      {
        id: "dores",
        title: "Pelages Dorés — Dévoration occulte",
        level: 3,
        blocks: [
          p("Tradition gratuite — Trace dévorée — R : après avoir mangé une quantité significative de chair ou un organe d'une créature surnaturelle récemment morte, conserve jusqu'au prochain repos une seule Trace ; une nouvelle Trace remplace l'ancienne."),
          table([
            ["Trace", "Effet"],
            ["Sens", "Acquiert temporairement un sens naturel ou surnaturel mineur réellement possédé par la proie."],
            ["Chair", "Acquiert une adaptation physique simple ou +3 pour résister à une substance/énergie à laquelle la proie était naturellement adaptée."],
            ["Essence", "Les attaques naturelles peuvent interagir avec le même type d'existence que la proie — esprit, corps partiellement immatériel, etc."]
          ]),
          p("Une Trace ne copie jamais un sort complet, une mémoire, une Compétence ou un pouvoir unique."),
          talents("garou", "Pelages Dorés — Dévoration occulte")
        ]
      }
    ]
  ),
  ruleArticle(
    "regles-verite-v7-garou-sangs-vifs",
    "Sangs vifs",
    ["Vérité", "Garou", "Sangs vifs", "Khinae"],
    [
      {
        id: "progression",
        title: "Progression et éveil",
        level: 2,
        blocks: [
          p("Le Sang vif est une expression raffinée de la Nature Khinae. Le premier Sang est généralement héréditaire et spontané ; expérience et exploration de sa Vérité permettent ensuite d'autres éveils. Chaque Sang possède deux voies."),
          p("Un Sang est maîtrisé lorsque le Garou possède au moins le Talent avancé de chacune de ses deux voies, soit généralement 6 PTV investis. Une fois ce Sang maîtrisé, 3 PTV permettent d'en éveiller un nouveau ; ce nouveau Sang doit lui-même être maîtrisé avant le suivant. Il n'existe pas de limite théorique, mais les cas altérés ou corrompus restent narratifs.")
        ]
      },
      ...[
        ["vortigern", "Sang Naturel — Vortigern", "Éléments et accord primordial avec le territoire.", "Sang Naturel — Vortigern"],
        ["ohtana", "Sang Alpha — Ohtana", "Dominance et cohésion de meute.", "Sang Alpha — Ohtana"],
        ["ceallachan", "Sang Révélateur — Ceallachán", "Pensées et destruction des mensonges surnaturels.", "Sang Révélateur — Ceallachán"],
        ["keyna", "Sang Écarlate — Keyna", "Puissance physique et perception du sang.", "Sang Écarlate — Keyna"],
        ["svenn", "Sang Sculpteur — Svenn", "Modelage de matière et de chair.", "Sang Sculpteur — Svenn"],
        ["verica", "Sang Funeste — Verica", "Mort, spectres et violence immatérielle.", "Sang Funeste — Verica"],
        ["khuyildar", "Sang Primal — Khuyildar", "Assimilation animale et projection de brume.", "Sang Primal — Khuyildar"],
        ["thorkel", "Sang Chasseur — Thorkel", "Traque absolue et disparition.", "Sang Chasseur — Thorkel"],
        ["tomoko", "Sang de Sagesse — Tomoko", "Mémoire et assimilation des savoirs.", "Sang de Sagesse — Tomoko"],
        ["asulf", "Sang Enragé — Asulf", "Frénésie volontaire et contamination de la rage.", "Sang Enragé — Asulf"],
        ["jayanti", "Sang Enchaîné — Jayanti", "Puissance humaine révélée, sans forme hybride.", "Sang Enchaîné — Jayanti"],
        ["astaphium", "Sang Vengeur — Astaphium", "Plaies, douleur et violence de la Mue.", "Sang Vengeur — Astaphium"]
      ].map(([id, title, intro, group]) => ({
        id,
        title,
        level: 3,
        blocks: [p(intro), talents("garou", group)]
      })),
      {
        id: "enchaîne",
        title: "Cas particulier — Sang Enchaîné",
        level: 2,
        blocks: [
          p("Le porteur du Sang Enchaîné ne peut pas prendre la forme hybride. Sa forme humaine révélée devient son corps de guerre et reste compatible avec toute la technologie TUC."),
          table([
            ["Corps Enchaîné — R", "Effet"],
            ["Vigueur", "+2 Vigueur."],
            ["Agilité", "+2 Agilité."],
            ["Rythme", "+1 PA par round au-delà du maximum normal."],
            ["Mobilité", "Déplacement environ ×2."],
            ["Équipement", "Conserve mains, armes, armures, véhicules, augmentations et toutes les possibilités d'un corps humain."],
            ["Ce qu'il n'a pas", "Pas d'Armure corporelle 2, pas de DGT 5 gratuit, pas de régénération de combat 2 PV/round et pas de Mue hybride."]
          ]),
          p("Cette permanence explique qu'un vieux Enchaîné puisse devenir un combattant monstrueux tout en restant armé, équipé et techniquement précis.")
        ]
      }
    ]
  ),
  ruleArticle(
    "regles-verite-v7-khinae-moteur-lignees",
    "Autres descendants de Khinae — moteur commun & lignées",
    ["Vérité", "Khinae", "Lignées", "Mue", "Variantes", "Sangs vifs"],
    [
      {
        id: "nature",
        title: "Nature commune des descendants de Khinae",
        level: 2,
        blocks: [
          p("Les autres thérianthropes sont des descendants de Khinae et non des Garous remaquillés. Ils restent liés au Cycle mais ne reçoivent jamais gratuitement Appel de la Meute, Hiérarchie instinctive, Bravoure lupine ou traditions de Pelage."),
          table([
            ["État", "Expression"],
            ["Voilé", "Corps humain complet ; pas de régénération surnaturelle, transformation ou expression physique."],
            ["Semi-Révélé", "Toujours humain extérieurement ; instincts, perceptions et Talents SR de Lignée commencent à s'exprimer."],
            ["Révélé — humain", "Morphologie humaine, Régénération lente, Talents R et possibilité d'entamer une Mue."],
            ["Révélé — animal", "Vraie forme animale définie par profil et Variante."],
            ["Révélé — hybride", "Corps de guerre Khinae : bonus physiques, armes naturelles, régénération de combat et +1 PA selon la Lignée."]
          ])
        ]
      },
      {
        id: "communs",
        title: "Propriétés communes, Mue et Frénésie",
        level: 2,
        blocks: [
          table([
            ["Propriété", "Règle"],
            ["Âme du Cycle", "À la mort véritable, rejoint normalement le Cycle."],
            ["Régénération lente", "R, humain révélé ou animal : 1 PV/heure hors combat."],
            ["Instinct de Lignée", "La Frénésie et les perceptions prennent l'animal de la Lignée comme référence, sans mécaniques lupines gratuites."],
            ["Corps de guerre", "En hybride : +3 Pugilat et 2 PV récupérés au début de chaque round tant que le personnage vit et reste hybride."],
            ["Rythme Khinae", "À partir du round suivant la fin de la Mue hybride : +1 PA par round au-delà du maximum normal."],
            ["Morphologie", "Les actions dépendent réellement du corps ; aucun profil ne crée mains, parole ou compatibilité d'équipement inexistantes."]
          ]),
          p("La Mue hybride prend un round complet ; aucune autre action significative n'est possible. L'animal depuis l'humain révélé coûte 1 PA et ne compte normalement pas dans l'épuisement."),
          table([
            ["Mue hybride depuis le dernier repos", "Vigueur + Constitution"],
            ["1re", "Automatique"],
            ["2e", "15"],
            ["3e", "18"],
            ["4e", "21"],
            ["5e et suivantes", "25"]
          ]),
          p("Échec : possibilité de forcer pour 3 PV irréductibles. Échec narratif : round perdu et plus de Mue hybride durant la scène."),
          p("La Frénésie reprend le sous-système Garou : Impulsion, au moins 1 PA vers elle, −3 aux actions de calme/concentration, peur temporairement écrasée, sortie Volonté + Maîtrise spirituelle 15 ou 12 si la cause a disparu. L'objet instinctif dépend de la Lignée, et aucune Meute permanente n'est supposée.")
        ]
      },
      {
        id: "variantes",
        title: "Variantes morphologiques & Sangs vifs",
        level: 2,
        blocks: [
          p("Chaque personnage choisit gratuitement une Variante morphologique au sein de sa Lignée. Elle représente l'espèce réelle et modifie gabarit, milieu, sens, venin, robustesse, agilité ou déplacement. Ce n'est ni un Talent, ni une Tradition, ni un Sang vif et elle ne se change pas normalement par PTV."),
          p("Les Sangs vifs fonctionnent exactement comme chez les Garous : premier Sang natif, maîtrise généralement à 6 PTV, puis 3 PTV pour éveiller le suivant. Les cas rares, altérés ou corrompus utilisent leur propre moteur de Corruption.")
        ]
      },
      {
        id: "canides",
        title: "Canidés errants — Coyote, Chacal, Lycaon, Dhole & Dingo",
        level: 3,
        blocks: [
          p("Arbre centré sur poursuite, endurance et survie sans territoire stable."),
          table([
            ["Forme", "Profil"],
            ["Animal", "+2 Agilité ; Déplacement ×2 sur terrain adapté ; morsure DGT 3 ; odorat/ouïe de grand canidé ; Régénération lente."],
            ["Hybride", "+3 Vigueur, +2 Agilité ; crocs/griffes DGT 5 ; Armure 1 ; Régénération 2 PV/round ; Déplacement ×2 ; +1 PA."]
          ]),
          table([
            ["Variante", "Particularité"],
            ["Coyote", "Gabarit compact ; friches, infrastructures, égouts et environnements urbains encombrés sont terrain adapté."],
            ["Chacal / Dhole", "Charognard robuste ; viande très décomposée tolérée et distinction naturelle sang frais/charogne récente."],
            ["Lycaon", "Coureur de fond ; une poursuite physiquement continue ne s'arrête pas pour la seule fatigue ordinaire."],
            ["Dingo", "Aridophile ; supporte chaleur et manque d'eau bien au-delà d'un Humain."]
          ]),
          p("Signature gratuite — Piste nomade — SR : après avoir identifié directement une odeur, peut la distinguer du bruit olfactif ordinaire pour la scène ; ne crée aucune piste si aucune trace physique n'existe.")
        ]
      },
      {
        id: "renards",
        title: "Renards — les survivants libres",
        level: 3,
        blocks: [
          p("La majorité des lignées Renard a cédé à V’Aagor ; les libres sont rares. Leur ruse surnaturelle agit surtout sur présence, odeurs, sons, pistes et fausses directions."),
          table([
            ["Forme", "Profil"],
            ["Animal", "+3 Agilité ; Déplacement ×2 ; morsure DGT 2 ; excellente ouïe ; Régénération lente."],
            ["Hybride", "+2 Vigueur, +3 Agilité ; crocs/griffes DGT 4 ; Armure 1 ; Régénération 2 PV/round ; +1 PA."]
          ]),
          p("Variantes : Roux équilibré ; Fennec adapté à chaleur et écoute ; Arctique au froid et camouflage neige/glace ; Gris/forestier excellent grimpeur."),
          p("Signature gratuite — Odeur mouvante — SR : peut atténuer, accentuer ou déformer sa propre odeur sans copier encore fidèlement celle d'un individu.")
        ]
      },
      {
        id: "grands-felins",
        title: "Grands Félins — Tigres et lignées apparentées",
        level: 3,
        blocks: [
          p("Parmi les Khinae les plus redoutables individuellement et les moins enclins à bâtir des sociétés globales ; embuscade, bond et domination d'une proie isolée."),
          table([
            ["Forme", "Profil"],
            ["Animal", "+2 Vigueur, +2 Agilité ; Déplacement ×2 ; griffes/crocs DGT 4 ; sens de prédateur ; Régénération lente."],
            ["Hybride", "+4 Vigueur, +2 Agilité ; griffes/crocs DGT 6 ; Armure 2 ; Régénération 2 PV/round ; Déplacement ×2 ; +1 PA."]
          ]),
          p("Variantes : Tigre de référence et excellent nageur ; Lion +4 Vigueur/+1 Agilité avec petite troupe narrative ; Panthère +3/+3, DGT 5, Armure 1 et escalade nocturne ; Jaguar de référence, eau et végétation dense, libres de Quetzal rares ; Puma +3/+3, DGT 5, Armure 1 et terrain montagneux adapté."),
          p("Signature gratuite — Silence du grand fauve — SR : un déplacement naturel ne suffit pas à révéler la position si couvert ou dissimulation crédible existent ; ne rend pas invisible et n'annule pas un sol réellement bruyant.")
        ]
      },
      {
        id: "chats",
        title: "Chats — les familiers de personne",
        level: 3,
        blocks: [
          p("Moins puissants que les grands Félins mais plus diplomates, curieux et adaptés aux milieux d'autres monstres ; ils peuvent servir d'intermédiaires sans accepter d'être des familiers."),
          table([
            ["Forme", "Profil"],
            ["Animal", "+4 Agilité ; petit gabarit ; griffes/morsure DGT 1 ; Déplacement ×2 sur terrain encombré ; Régénération lente."],
            ["Hybride", "+1 Vigueur, +4 Agilité ; griffes/crocs DGT 3 ; Armure 0 ; Régénération 2 PV/round ; +1 PA."]
          ]),
          p("Variantes : Domestique crédible dans l'environnement humain ; Sauvage +2 Vigueur/+3 Agilité, DGT 4, Armure 1 ; Nocturne à l'aise en faible lumière ; Grimpeur utilisant surfaces verticales comme terrain normal."),
          p("Signature gratuite — Inoffensif par nature — SR : un instinct qui ne connaît que « prédateur dangereux » ne classe pas automatiquement le Chat comme menace majeure tant qu'il ne manifeste pas d'hostilité ; n'efface aucune preuve connue.")
        ]
      },
      {
        id: "rapaces",
        title: "Rapaces — Aigles, Faucons, Hiboux & Vautours",
        level: 3,
        blocks: [
          p("Le vol tactique n'est pas une position permanente dans les airs : ailes et corps Khinae donnent de grands Bonds ailés, descentes contrôlées et passages de hauteur en hauteur."),
          table([
            ["Forme", "Profil"],
            ["Animal", "+3 Agilité ; serres/bec DGT 3 ; Bond ailé ; sens selon Variante ; Régénération lente."],
            ["Hybride", "+2 Vigueur, +3 Agilité ; serres DGT 5 ; Armure 1 ; Régénération 2 PV/round ; Bond ailé ; +1 PA."]
          ]),
          p("Variantes : Aigle +3 Vigueur/+2 Agilité ; Faucon +1/+4 et vitesse horizontale ; Hibou +1/+3, nuit et battements silencieux ; Vautour +2/+2, charogne et endurance."),
          p("Signature gratuite — Bond ailé — R Animal/Hybride : un Déplacement peut franchir un vide, gagner/perdre fortement de l'altitude et ignorer les obstacles au sol ; distance environ ×2 si trajectoire favorable. Doit finir sur un support ou une prise, sans vol stationnaire.")
        ]
      },
      {
        id: "requins",
        title: "Requins — les indépendants des abysses",
        level: 3,
        blocks: [
          p("Principaux Khinae marins ayant conservé leur indépendance face à Thul. La forme animale exige l'eau ; l'hybride peut agir à l'air libre mais reste nettement meilleur dans son milieu."),
          table([
            ["Forme", "Profil"],
            ["Animal", "Dans l'eau : +2 Agilité ; nage très rapide ; morsure DGT 4 ; pression et odeur sanguine ; Régénération lente. Hors de l'eau, devient non fonctionnel à terme."],
            ["Hybride", "Dans l'eau : +4 Vigueur, +2 Agilité ; morsure DGT 6 ; Armure 2 ; Régénération 2 PV/round ; +1 PA. Sur terre, perd le bonus d'Agilité et subit les contraintes de locomotion du corps."]
          ]),
          p("Variantes : Blanc de référence et profondeur/froid ; Bouledogue +3/+2, DGT 5, Armure 2, eau douce/salée ; Tigre robuste et opportuniste ; Marteau +3/+3, DGT 5, Armure 1 et électroréception ; Baleine +5/+1, DGT 4, Armure 3 et très grand gabarit."),
          p("Signature gratuite — Sang qui refuse l'abysse : 1/scène, relance d'une exposition biologique à la Corruption de Thul provenant directement d'un milieu abyssal, tissu thulien ou créature thulienne.")
        ]
      },
      {
        id: "serpents",
        title: "Serpents — venimeux, constricteurs & lignées furtives",
        level: 3,
        blocks: [
          p("Petites lignées dispersées ; la Variante décide si l'arme corporelle dominante est hémotoxique, neurotoxique, constrictrice ou furtive."),
          table([
            ["Variante", "Profil et propriété"],
            ["Vipère", "Base hybride +2 Vigueur/+3 Agilité, DGT 3, Armure 1. Morsure causant au moins 1 PV : Vigueur + Constitution 15 ; échec = 1 PV irréductible au début des deux prochaines activations, une exposition/cible/scène."],
            ["Cobra", "+2 Vigueur/+2 Agilité, DGT 3, Armure 1. Venin difficulté 15 ; échec = maximum 1 PA en actions physiques à la prochaine activation, une exposition/cible/scène."],
            ["Python / Boa", "+4 Vigueur/+1 Agilité, DGT 4, Armure 2 ; pas de venin ; saisie utilisable comme constriction."],
            ["Couleuvre / petite furtive", "+1 Vigueur/+4 Agilité, DGT 2, Armure 0 ; aucun venin significatif ; gabarit réduit et passages très étroits."]
          ]),
          p("Forme animale : +3 Agilité, locomotion ophidienne, morsure DGT 2 ou 3 selon Variante et Régénération lente."),
          p("Signature gratuite — Corps ophidien — R Animal/Hybride : progresse sans membres, s'enroule aux supports et comprime son corps de manière impossible pour un Humain.")
        ]
      },
      {
        id: "boudas",
        title: "Boudas — Hommes-Hyènes",
        level: 3,
        blocks: [
          p("Presque exterminés en Afrique avant la déportation d'une partie des survivants vers les Amériques. Sociaux, mais leur Bande est opportuniste, bruyante, conflictuelle et distincte de la Meute lupine."),
          table([
            ["Forme", "Profil"],
            ["Animal", "+2 Vigueur, +2 Agilité ; morsure DGT 4 ; excellente digestion ; Régénération lente."],
            ["Hybride", "+3 Vigueur, +2 Agilité ; morsure DGT 6 ; Armure 2 ; Régénération 2 PV/round ; +1 PA."]
          ]),
          p("Variantes : Tachetée +4 Vigueur/+1 Agilité ; Rayée +2/+3 ; Brune profil de référence avec grande tolérance aux charognes et aux milieux arides."),
          p("Signature gratuite — Bande de ricanement : au début d'une scène ou chasse, peut reconnaître jusqu'à trois créatures consentantes comme sa Bande pour la scène ; ce n'est ni une Meute permanente ni une obligation émotionnelle.")
        ]
      },
      {
        id: "berserkirs",
        title: "Berserkirs — Hommes-Ours",
        level: 3,
        blocks: [
          p("Khinae massifs rarement organisés en communautés permanentes. Ils furent autrefois liés par un pacte de sang aux Ulfhednars, ancêtres des Pelages Blancs ; l'alliance est largement oubliée par les Garous modernes, pas nécessairement par les Ours."),
          table([
            ["Forme", "Profil"],
            ["Animal", "+3 Vigueur ; griffes/morsure DGT 5 ; Armure 2 ; déplacement puissant non accéléré ; Régénération lente."],
            ["Hybride", "+5 Vigueur, +0 Agilité ; griffes/crocs DGT 6 ; Armure 3 ; Régénération 2 PV/round ; +1 PA."]
          ]),
          p("Variantes : Brun/Grizzly de référence ; Polaire adapté froid/nage/immersion glaciale ; Ours noir +4 Vigueur/+1 Agilité, DGT 6, Armure 2 et meilleure grimpe."),
          p("Signature gratuite — Masse ursine — R Hybride : une force humaine ordinaire ne peut normalement pas le renverser, pousser ou soulever ; adversaire surnaturel, véhicule, explosion ou rupture du support le peuvent.")
        ]
      },
      {
        id: "crocodiliens",
        title: "Crocodiliens — les fossiles d'embuscade",
        level: 3,
        blocks: [
          p("Développement mécanique extrapolé d'un corpus ancien plus esquissé : branche terrestre lourde, très blindée, lente à terre et spécialisée dans l'embuscade aquatique et la prise de mâchoire."),
          table([
            ["Forme", "Profil"],
            ["Animal", "+3 Vigueur ; morsure DGT 5 ; Armure 3 ; excellente nage ; lenteur et encombrement à terre ; Régénération lente."],
            ["Hybride", "+5 Vigueur ; +0 Agilité à terre / +2 dans l'eau ; morsure DGT 6 ; Armure 4 ; Régénération 2 PV/round ; +1 PA."]
          ]),
          p("Variantes : Nil/marin de référence ; Alligator +4 Vigueur/+1 Agilité à terre et +2 dans l'eau, Armure 4 ; Caïman +4/+1, DGT 5, Armure 3 ; Gavial +3 Vigueur/+2 Agilité dans l'eau, DGT 5, Armure 2."),
          p("Signature gratuite — Fossile de vase — R Animal/Hybride : peut rester presque parfaitement immobile et ralentir fonctions durant une scène ; une détection reposant seulement sur mouvement/agitation de l'eau échoue, mais thermique, odorat, contact ou capteurs adaptés fonctionnent.")
        ]
      },
      {
        id: "acces",
        title: "Accès, rareté et cas corrompus",
        level: 2,
        blocks: [
          p("Ces options sont rares et soumises au cadre de campagne. Renards libres et Jaguars libres sont des exceptions narratives ; les Requins ne sont pas immunisés à Thul ; une tradition serpent liée à Shaoggith ne vaut pas Corruption automatique ; Boudas et Berserkirs peuvent avoir leurs alliances sans créer de Pelages supplémentaires.")
        ]
      }
    ]
  )
];

export const COMPENDIUM_VERITE_V7_KHINAE_LORE_NAVIGATION = [
  { id: "verite-v7-vampires-civilisation-cours-sangs", dataset: "verite-v7", category: "Vérité", group: "Peuples & Natures", groupOrder: 30, subgroup: "Khinae", subgroupOrder: 10, pageOrder: 10, displayTitle: "Vampires — civilisation, Cours & Sangs" },
  { id: "verite-v7-garous-khinae-meutes-pelages", dataset: "verite-v7", category: "Vérité", group: "Peuples & Natures", groupOrder: 30, subgroup: "Khinae", subgroupOrder: 10, pageOrder: 20, displayTitle: "Garous — Khinae, Meutes & Pelages" },
  { id: "verite-v7-descendants-khinae", dataset: "verite-v7", category: "Vérité", group: "Peuples & Natures", groupOrder: 30, subgroup: "Khinae", subgroupOrder: 10, pageOrder: 30, displayTitle: "Descendants de Khinae" }
];

export const COMPENDIUM_VERITE_V7_KHINAE_RULE_NAVIGATION = [
  { id: "regles-verite-v7-vampire-nature-predation-cours", dataset: "verite-v7", category: "Règles", group: "Vérité — Natures & capacités", groupOrder: 80, subgroup: "Vampires", subgroupOrder: 10, pageOrder: 10, displayTitle: "Nature Vampire, prédation & Cours" },
  { id: "regles-verite-v7-vampire-sangs-transformations", dataset: "verite-v7", category: "Règles", group: "Vérité — Natures & capacités", groupOrder: 80, subgroup: "Vampires", subgroupOrder: 10, pageOrder: 20, displayTitle: "Sangs noirs & transformations exceptionnelles" },
  { id: "regles-verite-v7-garou-nature-formes-frenesie-pelages", dataset: "verite-v7", category: "Règles", group: "Vérité — Natures & capacités", groupOrder: 80, subgroup: "Garous", subgroupOrder: 20, pageOrder: 10, displayTitle: "Nature Garou, formes, Frénésie & Pelages" },
  { id: "regles-verite-v7-garou-sangs-vifs", dataset: "verite-v7", category: "Règles", group: "Vérité — Natures & capacités", groupOrder: 80, subgroup: "Garous", subgroupOrder: 20, pageOrder: 20, displayTitle: "Sangs vifs" },
  { id: "regles-verite-v7-khinae-moteur-lignees", dataset: "verite-v7", category: "Règles", group: "Vérité — Natures & capacités", groupOrder: 80, subgroup: "Khinae", subgroupOrder: 30, pageOrder: 10, displayTitle: "Autres descendants de Khinae — moteur commun & lignées" }
];
