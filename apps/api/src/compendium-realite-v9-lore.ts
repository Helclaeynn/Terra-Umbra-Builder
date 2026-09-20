type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };

type Section = {
  id: string;
  title: string;
  level: number;
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

const SOURCE = "TUC_Realite_V9_CROSSAUDIT_2026-09-10.pdf";
const LEGACY_SOURCE = "TUC_organisations_vie quotidienne.docx";
const CONSOLIDATED_SOURCE = `${SOURCE} ; ${LEGACY_SOURCE}`;

const p = (text: string, style?: string): Block => ({ type: "p", text, ...(style ? { style } : {}) });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

export const COMPENDIUM_REALITE_V9_LORE_ARTICLES: Article[] = [
  {
    id: "realite-v9-grande-californie-2035",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Grande Californie en 2035",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","Grande Californie","2035","chronologie","société","territoires","juridictions","reconstruction","géopolitique"],
    sections: [
      {
        id: "un-pays-jeune-sur-un-territoire-ancien",
        title: "Un pays jeune sur un territoire ancien",
        level: 2,
        blocks: [
          p("En 2035, la Grande Californie est un pays jeune bâti sur un territoire ancien, encore marqué par les crises sanitaires, la guerre, l'effondrement économique des années 2020 et quinze années de transformations accélérées. Ce n'est ni une utopie technologique ni une ruine cyberpunk uniforme : prospérité spectaculaire, reconstruction incomplète, institutions publiques, mégacorporations, mafias et réseaux indépendants coexistent parfois à quelques rues de distance."),
          p("La technologie est omniprésente sans avoir uniformisé les existences. Les habitants les plus favorisés vivent au milieu d'automatismes, de surfaces adaptatives, de véhicules autonomes, de médecine augmentée et de l'Holonet ; les moins favorisés utilisent des versions minimales, anciennes ou bricolées des mêmes technologies. L'Underlife transforme l'obsolescence et la récupération en économie locale, tandis que des quartiers entiers dépendent d'infrastructures publiques, corporatives ou communautaires très différentes."),
          p("La Grande Californie n'est pas isolée de la recomposition mondiale. Guerres, épidémies, catastrophes écologiques et crises économiques ont fragilisé plusieurs anciennes puissances, déplacé des centres industriels et accéléré la montée de nouveaux pôles. Dans plusieurs régions d'Afrique, d'Amérique latine et d'Asie, l'amélioration du niveau de vie et l'industrialisation réduisent une partie de l'ancien écart Nord-Sud, mais au prix d'une transition encore violente et très dépendante des corporations. L'Europe conserve davantage de solidarité institutionnelle que d'autres grands ensembles, tandis que les anciens États-Unis ont connu une fragmentation dont l'indépendance californienne est l'un des résultats les plus visibles.")
        ]
      },
      {
        id: "chronologie",
        title: "Quinze années qui ont changé le rythme du monde",
        level: 2,
        blocks: [
          table([
            [
              "Période",
              "Repère",
              "Conséquence majeure"
            ],
            [
              "2020–2021",
              "Crises sanitaires et économiques",
              "Fragilisation des services, précarité, ruptures logistiques et accélération des réseaux numériques."
            ],
            [
              "2022",
              "Grande Guerre du Pacifique",
              "Mobilisation industrielle, prototypes, cybernétique militaire, robotique, nouveaux matériaux, nouveaux armements et doctrines."
            ],
            [
              "2025–2028",
              "Années de rupture",
              "Migrations massives, désertification de zones, montée des pouvoirs locaux, privatisation d'infrastructures et multiplication des acteurs armés."
            ],
            [
              "2028",
              "Fin de la guerre",
              "Les technologies financées par l'effort militaire commencent à basculer massivement vers le civil."
            ],
            [
              "2030",
              "Grand choc technologique",
              "Holonet, connectivité omniprésente, démocratisation accélérée des augmentations, automatismes, matériaux et nouveaux modes de transport."
            ],
            [
              "2032–2033",
              "Dina Page et l'émancipation californienne",
              "Consolidation du pouvoir californien et autonomie politique débouchant sur la Grande Californie."
            ],
            [
              "2034",
              "Réforme de Los Angeles",
              "Catalina de la Caza transforme la police de Los Angeles en LAUS."
            ],
            [
              "2035",
              "Nouvel équilibre",
              "État fort mais encore en reconstruction, corporations immenses, Pègre structurée, société augmentée et frontières sociales visibles."
            ]
          ]),
          p("Les générations qui ont connu la guerre accordent souvent une valeur particulière à la sécurité, aux stocks et à l'autonomie matérielle. Les plus jeunes considèrent déjà comme ordinaires des technologies que leurs parents ont vu apparaître en quelques années.")
        ]
      },
      {
        id: "choc-technologique",
        title: "Du choc militaire au choc civil",
        level: 2,
        blocks: [
          p("La révolution technologique des années 2030 n'est pas née d'une croissance paisible. Pendant la guerre, les progrès sur les augmentations, les matériaux, l'énergie, la robotique, l'armement et les doctrines militaires ont été développés dans l'urgence. Leslie Wright est associée à la phase où l'avantage technologique ennemi est d'abord compris, puis contrecarré et dépassé. L'ouverture de brevets aux industriels et la mobilisation des chaînes de production donnent ensuite aux futures mégacorporations un accès durable à ce patrimoine de guerre."),
          p("Après le conflit, les entreprises ne rendent ni les brevets ni les savoir-faire : elles les transforment en produits civils, services et standards. Les habitants ont donc parfois l'impression qu'une décennie entière de progrès leur tombe dessus en quelques années. Les corporations accompagnent ce bouleversement en vendant non seulement les objets, mais aussi les usages, les modes, les discours et les habitudes qui permettent de vivre avec eux.")
        ]
      },
      {
        id: "territoire-en-strates",
        title: "Un territoire en strates",
        level: 2,
        blocks: [
          p("La Grande Californie se lit moins comme une carte administrative unique que comme une mosaïque de juridictions. Zones municipales, territoires corporatifs, quartiers sous influence mafieuse et zones abandonnées peuvent se toucher directement."),
          p("La loi californienne n'est pas abolie dans les territoires privés ou criminels ; ce qui change est la capacité immédiate à l'appliquer. Un site corporatif peut transformer une enquête en négociation de procédures et de mandats. Une organisation criminelle peut rendre une intervention trop coûteuse pour être improvisée. Dans une zone morte, la question est parfois simplement de savoir qui répondra à l'appel et dans combien de temps.")
        ]
      },
      {
        id: "lire-une-rue",
        title: "Lire une rue en 2035",
        level: 2,
        blocks: [
          p("Uniformes, drones, logos de services, qualité du mobilier urbain, état des caméras, tags, entretien de la chaussée et authentification du réseau indiquent souvent mieux que le nom du quartier qui surveille, qui répare, qui facture et qui viendra si quelque chose tourne mal."),
          p("La frontière n'est donc pas toujours un mur. À Los Angeles comme ailleurs, un changement brutal d'éclairage, de propreté, de réseau ou de présence sécuritaire peut signaler le passage d'un système d'autorité à un autre.")
        ]
      },
      {
        id: "ce-que-signifie-realite",
        title: "Ce que signifie « Réalité »",
        level: 2,
        blocks: [
          p("La Réalité est le monde visible et quotidien de Terra Umbra California : institutions humaines, corporations, criminalité organisée, religions, réseaux, technologies, habitudes sociales et conflits de pouvoir. Rien de cela n'a besoin du surnaturel pour être dangereux, étrange ou digne d'intérêt.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-etat-institutions-grande-reserve",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "État, institutions & Grande Réserve",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","gouvernement","Dina Page","agences","Grande Réserve","CBII","CNAD","CBAC","justice","éducation","recherche","Caltech"],
    sections: [
      {
        id: "etat-robuste",
        title: "Un État volontairement robuste",
        level: 2,
        blocks: [
          p("L'indépendance californienne n'a pas produit un État minimal. Sous l'impulsion de Dina Page, la Grande Californie reconstruit au contraire une puissance publique capable de négocier avec les mégacorporations, de réprimer une organisation criminelle devenue incontrôlable et de maintenir des services essentiels dans les zones économiquement délaissées."),
          p("L'exécutif est fortement incarné autour de la présidente-gouverneure et d'un cabinet resserré appuyé par des secrétariats comparables à des ministères. Les municipalités conservent néanmoins un poids considérable : pendant les crises, les pouvoirs locaux ont souvent été les derniers à pouvoir répondre rapidement, et des villes comme Los Angeles disposent désormais d'institutions assez puissantes pour négocier presque d'égal à égal avec l'État."),
          p("La politique californienne demeure traversée par des lobbies corporatifs, écologistes, religieux, transhumanistes et technologiques. Des courants spatialistes, encore minoritaires, défendent l'idée que l'avenir humain se joue hors de la Terre. L'Holonet facilite référendums, consultations et sondages, mais l'abondance de participation ne garantit ni la neutralité des questions ni celle des informations présentées.")
        ]
      },
      {
        id: "legislatif-justice-services",
        title: "Congrès, justice et services publics",
        level: 2,
        blocks: [
          p("Le législatif s'organise autour d'un Congrès associant Sénat et Assemblée, avec commissions et mécanismes de contrôle. Une Cour suprême californienne se trouve au sommet de l'ordre judiciaire."),
          p("Défense, pompiers, santé, écoles, administrations, urbanisme et énergie restent des services publics visibles. Leur qualité varie fortement : certaines structures ont été modernisées à marche forcée, d'autres utilisent des équipements récents dans des bâtiments encore marqués par les années de pénurie."),
          p("La justice doit composer avec une mosaïque de juridictions, contrats privés et règlements corporatifs sans devenir pour autant une justice corporative séparée. Une affaire peut opposer droit californien, obligations contractuelles et règles internes d'un territoire privé ; le juge doit alors déterminer jusqu'où celles-ci produisent leurs effets sans supplanter la loi de l'État.")
        ]
      },
      {
        id: "grande-reserve",
        title: "La Grande Réserve",
        level: 2,
        blocks: [
          p("La Grande Réserve bénéficie d'un statut particulier accordant une très large autonomie aux nations amérindiennes qui y vivent. Elle constitue à la fois un territoire politique, un espace de négociation avec l'État et un acteur économique important."),
          p("Ses rapports avec les entreprises, les administrations californiennes et les structures locales reposent sur des accords spécifiques, parfois anciens et parfois renégociés dans l'urgence des années 2030 ; son statut ne se résume pas à une simple délégation de souveraineté.")
        ]
      },
      {
        id: "agences-californiennes",
        title: "Les agences californiennes",
        level: 2,
        blocks: [
          table([
            [
              "Agence",
              "Mission",
              "Présence concrète"
            ],
            [
              "CNAD",
              "Direction et coordination des agences",
              "Budgets, restructurations, création ou suppression de services, contrôle de performance ; pas de force de terrain propre."
            ],
            [
              "CBII",
              "Investigation et renseignement",
              "Crime majeur, contre-espionnage, terrorisme, grandes enquêtes corporatives, mafias et soutien aux polices locales."
            ],
            [
              "CPP",
              "Produits prohibés et contrebande",
              "Armes, drogues chimiques ou numériques, agents biologiques, augmentations militaires interdites et trafics spécialisés."
            ],
            [
              "INATA",
              "Affaires des nations amérindiennes",
              "Droits, négociations, dossiers juridiques et relations avec les territoires et institutions autochtones."
            ],
            [
              "CBAC",
              "Abus et corruption",
              "Contrôle des forces publiques et des sécurités corporatives, corruption, procédures et abus de pouvoir."
            ],
            [
              "CCHS",
              "Surveillance sanitaire",
              "Épidémies, risques biologiques, santé mentale, augmentations et réponses de santé publique."
            ],
            [
              "NRMD",
              "Ressources naturelles",
              "Énergie, matières premières, biodiversité, quotas et prévention des monopoles destructeurs."
            ],
            [
              "EIO",
              "Inspection de l'éducation",
              "Évaluation des établissements publics, privés, corporatifs et centres de formation."
            ],
            [
              "CSCO",
              "Standards corporatifs",
              "Inspections inopinées, conformité aux normes californiennes et transmission des infractions."
            ],
            [
              "STAB",
              "Abus technologiques",
              "Technologies dangereuses, laboratoires d'analyse, confinement et intervention spécialisée."
            ]
          ])
        ]
      },
      {
        id: "cbii-charniere",
        title: "Le CBII comme charnière",
        level: 2,
        blocks: [
          p("Le CBII est en 2035 la structure la plus complète et la plus capable d'opérer seule. Là où une petite agence apporte surtout expertise, inspection ou compétence juridique, le Bureau peut fournir locaux, effectifs, renseignement, matériel et capacité opérationnelle."),
          p("Hors de Los Angeles, il peut prendre la direction d'une affaire majeure ; à Los Angeles, il doit composer avec la puissance propre et la connaissance du terrain du LAUS. Ses rapports avec la Pègre sont pragmatiques : informateurs, accords ponctuels et infiltrations existent dans un monde où les grandes mafias ont des activités légales et où des corporations peuvent commettre des délits d'une ampleur considérable. Ses interventions sur un territoire corporatif restent politiquement sensibles et exigent souvent plus de préparation qu'une opération ordinaire.")
        ]
      },
      {
        id: "administration-transition",
        title: "Une administration de transition",
        level: 2,
        blocks: [
          p("Les frontières entre agences restent plus souples que dans les anciens appareils fédéraux. Une affaire technologique peut naître au STAB, demander une saisie au CPP, mobiliser le CBII pour l'opération et finir sous le regard du CBAC si l'usage de la force est contesté.")
        ]
      },
      {
        id: "education-recherche",
        title: "Éducation, universités et recherche",
        level: 2,
        blocks: [
          p("Le système éducatif public a survécu aux crises, mais les inégalités anciennes se sont aggravées dans les quartiers les plus pauvres. Des programmes de soutien, dont les mesures Richards constituent un exemple historique, cherchent à empêcher que la reconstruction ne transforme durablement certaines populations en main-d'œuvre sans qualification."),
          p("Les corporations ont parallèlement développé leurs propres écoles, académies et universités. Pour les enfants de salariés, ces établissements offrent un enseignement bien financé mais lient parfois très tôt formation, réputation et carrière. Dans l'enseignement supérieur corporatif, classements et évaluations continues entretiennent une forte pression ; les modèles d'hyperspécialisation extrême ont toutefois montré leurs limites lorsque des cadres formés à une seule fonction se sont révélés incapables de suivre les changements du marché."),
          p("Les universités privées indépendantes combinent frais de scolarité, dons d'anciens élèves, brevets et partenariats multiples afin de ne pas dépendre d'une seule corporation. Leur formation plus large produit parfois des spécialistes rares qu'aucun groupe industriel n'aurait jugé rentable de former lui-même. Caltech demeure un symbole de cette recherche fondamentale coûteuse dont les applications peuvent n'apparaître que des années plus tard.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-los-angeles-laus-securites",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Los Angeles, LAUS & sécurités",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","Los Angeles","LAUS","Catalina de la Caza","SII","USC","sécurité privée","vétérans","milices","armement"],
    sections: [
      {
        id: "reforme-laus",
        title: "La réforme de Catalina de la Caza",
        level: 2,
        blocks: [
          p("En 2034, Catalina de la Caza, ancienne Navy SEAL et héroïne de guerre, prend la tête d'une police de Los Angeles devenue inadaptée à une ville de criminalité lourdement armée, de milices corporatives, de cyberattaques et de populations augmentées. Elle transforme l'institution en Los Angeles Urban Security : LAUS."),
          p("Sa doctrine repose sur trois fonctions : Surveillance, Investigation, Intervention. La Surveillance cartographie risques, flux, Holonet, drones et frontières de juridiction ; l'Investigation réunit détectives, scientifique, cyber-enquête et traitement des données ; l'Intervention doit disposer immédiatement du niveau de force proportionné à la menace."),
          p("Cette réforme répond aussi à l'héritage de la démobilisation. Après la guerre, des milliers de vétérans formés aux armes, aux augmentations et aux tactiques modernes ont rejoint l'armée californienne, les sécurités privées, les mafias, les gangs ou des milices locales. Les anciennes structures policières ne pouvaient plus traiter ces adversaires comme de simples criminels ordinaires.")
        ]
      },
      {
        id: "usc",
        title: "Urban Security Centers",
        level: 2,
        blocks: [
          p("Les anciens commissariats sont progressivement remplacés ou transformés en Urban Security Centers. Un USC peut réunir accueil, détention provisoire, cellules d'enquête, armurerie, coordination de drones, espaces de commandement, garages, unités médicales et zones de refuge pour civils."),
          p("L'architecture des USC participe au message politique de la réforme : la puissance publique est revenue dans les quartiers et entend y rester.")
        ]
      },
      {
        id: "organisation",
        title: "Organisation opérationnelle",
        level: 2,
        blocks: [
          table([
            [
              "Ensemble",
              "Fonction dominante",
              "Exemples"
            ],
            [
              "Bureau du Chef",
              "Commandement et doctrine",
              "Coordination générale, relations politiques, priorités de sécurité."
            ],
            [
              "Surveillance Bureau",
              "Voir la ville",
              "Central, West, Valley, South, Holonet et dispositifs de veille."
            ],
            [
              "Investigation Bureau",
              "Établir les faits",
              "Détectives, forensic, cyber, preuves et chaînes d'enquête."
            ],
            [
              "Intervention Bureau",
              "Agir sous pression",
              "Heavy Operations, Special Operations, Data Operations et soutien tactique."
            ],
            [
              "USC",
              "Ancrage territorial",
              "Accueil, détention, coordination, refuge, armurerie et moyens de crise."
            ]
          ]),
          p("Le Holonet Bureau traite la dimension numérique de la ville. Un Ghost Bureau, dont l'existence et le périmètre restent volontairement flous selon les interlocuteurs, gère les situations que l'administration préfère pouvoir contenir ou nier sans publicité.")
        ]
      },
      {
        id: "ville-frontieres",
        title: "Une ville faite de frontières",
        level: 2,
        blocks: [
          p("Central, West, Valley et South organisent des densités, usages et profils sociaux très différents sans former des mondes étanches. Les territoires corporatifs peuvent devenir des enclaves reliées par leurs propres navettes, sécurités et services ; des zones abandonnées ou semi-abandonnées vivent de réparation, marchés informels et réseaux Underlife que les cartes administratives décrivent mal."),
          p("Dans une zone publique, services municipaux et loi californienne disposent de moyens directs. Dans une zone corporative, sécurité, entretien, contrôle des accès et une partie des règles quotidiennes sont assurés par l'entreprise propriétaire ou délégataire. Dans une zone abandonnée, l'État peut conserver une compétence théorique sans disposer des effectifs ou infrastructures permettant de l'exercer en permanence."),
          p("La nuit accentue les contrastes : quartiers riches éclairés et surveillés, secteurs de loisirs actifs tard, ateliers et marchés informels là où la surveillance est plus facile à voir. Los Angeles ne dort pas ; l'autorité apparente change avec l'heure.")
        ]
      },
      {
        id: "securites-privees",
        title: "Sécurités privées et monopole imparfait de la force",
        level: 2,
        blocks: [
          p("Les sécurités corporatives sont un héritage majeur des années de guerre. Certaines sont devenues de véritables organisations dotées de blindés, drones, équipes médicales, cyberdéfense et personnels de niveau militaire ; les Armacorpos vendent protection de site, escorte, renseignement et intervention. Le recrutement de vétérans explique une partie de leur professionnalisation et de leur avance tactique."),
          p("Elles peuvent protéger un site, un convoi ou des employés et retenir un intrus dans leur périmètre, mais ne disposent pas d'un droit général de police. Leur pouvoir réel dépend du territoire, du contrat, de la coopération avec les autorités et de leur capacité à supporter le coût politique d'un affrontement."),
          p("Dans les secteurs les plus isolés, la sécurité peut être confiée à des milices ou prestataires beaucoup moins puissants. Certaines petites villes très dépendantes d'une entreprise voient même la sécurité corporative déborder largement du site industriel et devenir, de fait, l'essentiel de la présence armée locale.")
        ]
      },
      {
        id: "armement-contre-mesures",
        title: "Armement, blindages et contre-mesures",
        level: 2,
        blocks: [
          p("L'armement individuel reste reconnaissable, mais nouveaux polymères, assistance électronique et interaction avec les augmentations ont changé son emploi. Les armes peuvent échanger données de visée, état du système et contexte tactique avec l'équipement du porteur."),
          p("La diffusion des exosquelettes, armures assistées et protections composites a entraîné une hausse de la puissance de certains calibres et un intérêt renouvelé pour les engagements à courte distance. Les contre-mesures électromagnétiques se sont développées en parallèle afin qu'une force moins augmentée puisse neutraliser ou dégrader des systèmes complexes."),
          p("Armes intégrées au corps, furtivité visuelle, thermique ou acoustique et multiplication des capteurs compliquent fouilles, détention et contrôles d'accès. La sécurité de 2035 consiste autant à identifier ce qu'un individu peut dissimuler ou désactiver qu'à compter les armes visibles.")
        ]
      },
      {
        id: "controle-et-abus",
        title: "Efficacité, armement et contrôle",
        level: 2,
        blocks: [
          p("La surveillance accrue, l'armement lourd et l'intégration des données du LAUS inquiètent autant qu'ils rassurent. Les années de guerre ont banalisé la violence chez une partie des professionnels et des criminels ; la réforme cherche précisément à encadrer ce niveau de force plutôt qu'à le laisser devenir la norme informelle. Le CBAC existe notamment pour empêcher qu'une force publique se transforme en milice au prétexte qu'elle affronte des milices privées."),
          p("La réforme inspire d'autres villes californiennes, sans créer de copies exactes de Los Angeles : San Diego-Tijuana, San Francisco, Phoenix, San José, Mexicali, Las Vegas et Tucson adaptent leurs modèles à leurs réalités locales.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-corporations-territoires",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Corporations & territoires corporatifs",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","corporations","mégacorporations","Eversor","Saskia","contrats","territoires corporatifs","extraterritorialité","banques"],
    sections: [
      {
        id: "puissance-nee-urgence",
        title: "Une puissance née de l'urgence",
        level: 2,
        blocks: [
          p("Les mégacorporations ont construit leur pouvoir pendant les guerres et crises logistiques : produire plus vite, extraire des ressources, reconstruire, sécuriser des chaînes d'approvisionnement et financer des technologies exigeait des acteurs capables d'agir hors des rythmes administratifs ordinaires."),
          p("Après les épidémies, l'effondrement économique et la guerre, des gouvernements incapables de protéger seuls infrastructures, emplois et approvisionnements ont accordé aux entreprises encore solvables des droits qui auraient paru inimaginables auparavant. L'extraterritorialité a d'abord été une réponse d'urgence : permettre à une corporation de sécuriser ses sites, laboratoires, universités, logements et chaînes logistiques avec ses propres moyens."),
          p("Ce transfert a accéléré l'hypercapitalisme corporatif, mais il a aussi financé la reconstruction et apporté des infrastructures là où l'État n'avait plus les moyens d'investir. En Californie, cette autonomie n'est jamais absolue : sécurités privées, règlements internes, logements, cliniques, commerces et réseaux de transport corporatifs restent soumis au droit californien et aux inspections de services tels que le CSCO ou le CBAC.")
        ]
      },
      {
        id: "secteurs",
        title: "Les grands secteurs corporatifs",
        level: 2,
        blocks: [
          table([
            [
              "Ensemble",
              "Domaines",
              "Noms connus"
            ],
            [
              "Agrocorpos",
              "Alimentation, eau, agriculture industrielle, mer",
              "Yellow Food, ASCO, Dwarfood, Ocean Master, Herbrews, Wellspring, Seawares"
            ],
            [
              "Mediacorpos",
              "Information, divertissement, musique, image",
              "Tuatha, Dreampoint, Nexstar Media, Omegacoustics, Hound Record, Peach Media, Phantasmedia"
            ],
            [
              "Manucorpos",
              "Industrie, véhicules, énergie, construction",
              "Raven Industries, Phoenix, Byron Industries, Bullmotors, Nymphrover, Omega Systems"
            ],
            [
              "Cybercorpos",
              "Holonet, IA, neurotechnologies, cybersécurité",
              "Arcanetworks, Monarch Systems, Aces, Allico, Apexi, Sphere, Sphinx Solution"
            ],
            [
              "Biocorpos",
              "Médecine, génétique, biotech, corps",
              "Biosun, Sunways, Antelligence, Mysticorps, Boarco, Joytechs, Rabbitechnologies"
            ],
            [
              "Armacorpos",
              "Sécurité privée, armement, protection",
              "Ushkoll, Pixy, Tortoise, Remo"
            ],
            [
              "Servicorpos",
              "Services, droit, renseignement, navigation",
              "Tala, FirstLawyer, Northstar, Antler Systems, Canics, Dreamscoms, Nightelligence"
            ],
            [
              "Bankcorpos",
              "Crédit, finance, compensation",
              "Corebank, Laguna Bank, Liao Kashiwa Banking, Euro Monetary Found, Panamerica Banking"
            ]
          ])
        ]
      },
      {
        id: "banques-monnaies",
        title: "Banques, monnaies et pouvoir financier",
        level: 2,
        blocks: [
          p("La crise monétaire a favorisé la concentration bancaire. Des États ont cédé actifs, droits et fonctions à des banques capables de préserver les paiements lorsque les monnaies se dépréciaient. Les mégabanques ont ainsi acquis un poids politique immense, puis les mégacorporations industrielles ont fini par posséder ou contrôler leurs propres structures bancaires."),
          p("Cette intégration explique pourquoi les grands groupes n'ont pas tous cherché à créer une monnaie privée indépendante : ils étaient déjà imbriqués dans les systèmes bancaires et publics qui avaient survécu. En pratique, emploi, logement, crédit, assurance et consommation peuvent néanmoins appartenir au même écosystème corporatif.")
        ]
      },
      {
        id: "vivre-sous-contrat",
        title: "Vivre sous contrat",
        level: 2,
        blocks: [
          p("Un bon contrat peut inclure logement, assurance médicale, école, transport, accès prioritaire à certaines augmentations, protection juridique et réductions dans les services du groupe. La vie peut être extrêmement confortable tant que le contrat tient."),
          p("Cette dépendance rend la frontière entre vie professionnelle et vie privée poreuse : perdre son poste peut signifier changer de médecin, rendre un véhicule, quitter un logement et découvrir que plusieurs services n'étaient jamais réellement la propriété de l'employé. Certains contrats imposent en outre une forte exclusivité, l'usage de services internes ou des obligations de confidentialité très durables."),
          p("Les corporations favorisent souvent les candidats dont les augmentations correspondent déjà au travail demandé ; certains postes peuvent même impliquer une modification corporelle, payée ou non par l'entreprise. Cela crée une inégalité supplémentaire entre ceux qui peuvent investir dans leur corps et ceux dont le seul accès à une technologie passe par l'employeur."),
          p("Tous les corporatistes ne vivent pas cette relation comme une prison. Beaucoup considèrent que leur groupe tient mieux ses promesses que l'État ou la Pègre ; d'autres passent d'une corporation à l'autre, négocient leur expertise et exploitent les rivalités internes.")
        ]
      },
      {
        id: "recherche-innovation",
        title: "Recherche, brevets et dépendance technique",
        level: 2,
        blocks: [
          p("La recherche et développement demeure l'un des instruments principaux de la puissance corporative. Les grands groupes investissent massivement pour conserver l'avantage né des brevets de guerre, puis transforment les innovations en produits, normes et habitudes de consommation. La dépendance n'est donc pas seulement financière : elle peut être technique, médicale, sociale et culturelle.")
        ]
      },
      {
        id: "eversor",
        title: "Eversor — la nouvelle venue",
        level: 2,
        blocks: [
          p("Eversor Corporation est une anomalie de 2035 : presque neuve dans un paysage où les places semblent déjà prises. Fondée autour de Saskia, ancienne mercenaire d'Ushkoll, elle s'est développée à partir de la restauration, des bars, de l'alimentation et de services installés dans des espaces jugés peu rentables ou trop instables par les groupes plus anciens."),
          p("Sa croissance rapide repose notamment sur le recrutement d'anciens militaires, Crawlers, techniciens hors réseau et spécialistes rejetés par les filières classiques. Son image insiste sur une corporation plus humaine et accueillante, sans supprimer sa nature de corporation : sécurité, administration, juristes, réseau, transport et expansion rapide.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-pegre-mafias-gangs",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Pègre, mafias & gangs",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","Pègre","mafias","gangs","Table des Mafias","crime organisé","dette","réputation","vétérans"],
    sections: [
      {
        id: "empires-nes-dans-les-vides",
        title: "Des empires nés dans les vides",
        level: 2,
        blocks: [
          p("Pendant les pires années, le crime organisé n'a pas seulement vendu des produits interdits : il a déplacé des marchandises, prêté de l'argent, protégé des rues, trouvé des médicaments, fourni des faux papiers et donné du travail là où les institutions ne répondaient plus."),
          p("Lorsque l'économie s'est stabilisée, ces réseaux étaient devenus trop enracinés, trop riches et parfois trop utiles pour disparaître. Les corporations les avaient parfois employés comme intermédiaires, saboteurs ou sous-traitants clandestins ; les mafias avaient en retour utilisé marchés, contrats et rivalités corporatives pour se reconstruire en véritables entreprises criminelles."),
          p("Une mafia peut aujourd'hui posséder restaurants, transports, clubs, textile ou immobilier parfaitement déclarés ; ces activités servent à la fois de revenu, de réseau d'influence et parfois de couverture. Une corporation peut de son côté commettre des délits plus vastes que nombre de trafics traditionnels, ce qui brouille encore la frontière entre criminalité économique et Pègre.")
        ]
      },
      {
        id: "comite-table",
        title: "Comité général du Crime et Table des Mafias",
        level: 2,
        blocks: [
          p("Le Comité général du Crime californien et la Table des Mafias cherchent avant tout à empêcher qu'une querelle entre organisations transforme Los Angeles ou San Diego-Tijuana en champ de bataille. Ils ne sont ni un gouvernement légal ni une interdiction de la violence : ils organisent reconnaissance, arbitrage, dettes et conséquences."),
          p("Attaquer un membre important d'une organisation reconnue peut déclencher une chaîne d'obligations dépassant largement la personne visée. La prévisibilité du système est précisément ce que les grandes organisations cherchent à préserver.")
        ]
      },
      {
        id: "organisations",
        title: "Organisations majeures",
        level: 2,
        blocks: [
          table([
            [
              "Organisation",
              "Ancrage",
              "Image et spécialités visibles"
            ],
            [
              "Vladivostokskaïa / Bratva",
              "Réseaux russes et est-européens",
              "Influence forte au Comité, finance, protection, réseaux transnationaux, restauration et nightclubs."
            ],
            [
              "La Famille",
              "Italo-américaine",
              "Vieilles structures familiales, restauration, textile, affaires, influence locale et criminalité classique modernisée."
            ],
            [
              "Vingt-deux Dragons",
              "Triades chinoises",
              "Réseaux commerciaux, restauration, communautés, contrebande et connexions asiatiques."
            ],
            [
              "Yamaguchi",
              "Yakuza",
              "Organisation disciplinée, entreprises, jeux, protection et réseaux japonais."
            ],
            [
              "Oglaigh",
              "Mafia irlandaise",
              "Réseaux communautaires, trafic, violence ciblée et alliances anciennes."
            ],
            [
              "New Yiddish Californian Connection",
              "Mafia juive",
              "Finance, réseaux d'affaires et implantation relationnelle."
            ],
            [
              "French Connection",
              "Réseaux français",
              "Trafic, finance, luxe et connexions transatlantiques."
            ],
            [
              "Cartels",
              "Mexique et frontière sud",
              "Sinaloa et groupes de Diejuana restent des puissances majeures, parfois hors des équilibres de la Table."
            ]
          ])
        ]
      },
      {
        id: "gangs",
        title: "La place des gangs",
        level: 2,
        blocks: [
          p("Bloods, Crips, 18th Street, MS-13, Sons of Samoa et structures plus récentes peuvent contrôler un quartier ou fournir des combattants. Les grandes mafias les considèrent cependant souvent comme sous-traitants, outils ou acteurs consommables : un gang peut être terrifiant dans trois rues et politiquement insignifiant à l'échelle de la Table."),
          p("La démobilisation a donné à certains gangs, mafias et cartels des vétérans connaissant armes lourdes, drones, contre-surveillance, augmentations et tactiques d'intervention. Cette professionnalisation coexiste avec une dimension très locale : selon le quartier, un gang peut être protection, communauté, économie de survie ou structure de prédation.")
        ]
      },
      {
        id: "dette-reputation",
        title: "Dette, faveur et réputation",
        level: 2,
        blocks: [
          p("Dans la Pègre, une faveur n'est presque jamais seulement une faveur. Qui a payé l'avocat, trouvé le médicament, laissé passer le camion ou garanti un inconnu crée une comptabilité sociale parallèle qui peut survivre à l'argent lui-même.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-religions-communautes",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Religions & communautés",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","religions","Église chrétienne réunifiée","Innocentia XIV","Grand Architecte","néopaganisme","sectes","apocalypse"],
    sections: [
      {
        id: "retour-fonction-sociale",
        title: "Le retour des communautés",
        level: 2,
        blocks: [
          p("Les crises des années 2020 rendent aux religions une fonction sociale très visible. Paroisses, mosquées, synagogues, temples, associations spirituelles et réseaux communautaires continuent à nourrir, héberger, soigner, enseigner et organiser lorsque administrations et entreprises ne couvrent plus tous les besoins."),
          p("La foi n'est pas redevenue universelle ; elle est redevenue institutionnellement utile. L'appauvrissement, les épidémies et la guerre ont aussi renforcé chez beaucoup un besoin de sens et de continuité que le progrès technique n'a pas effacé. L'Holonet sert aux sermons, consultations, réseaux d'entraide et enseignements, et les responsables religieux participent aux débats sur augmentations, IA, consentement neurochimique et définition de la personne."),
          p("Certaines institutions acceptent des financements corporatifs, avec les tensions que cela implique sur leur indépendance et leurs discours ; d'autres revendiquent au contraire une séparation stricte et vivent de dons ou de réseaux communautaires.")
        ]
      },
      {
        id: "eglise-reunifiee",
        title: "L'Église chrétienne réunifiée",
        level: 2,
        blocks: [
          p("En 2026, le pape Alexandre IX convoque un Grand Concile de la Chrétienté. Guerre, précarité et fragmentation politique poussent plusieurs courants chrétiens à simplifier leurs structures, harmoniser des pratiques et rechercher un front commun sans effacer toutes leurs sensibilités."),
          p("Après le choc technologique de 2030, l'Église refuse autant le rejet aveugle de la technologie que son adoption sans limites. Elle recrute des scientifiques, investit l'Holonet, développe une doctrine de vigilance face aux abus technologiques, élargit la place des femmes dans le clergé et assouplit plusieurs obligations disciplinaires."),
          p("En 2033, Paladia di Melucci succède à Alexandre IX sous le nom d'Innocentia XIV et devient la figure la plus visible de cette nouvelle Église.")
        ]
      },
      {
        id: "autres-traditions",
        title: "Foi, modernité et autres traditions",
        level: 2,
        blocks: [
          p("Islam, judaïsme et autres traditions anciennes modernisent également médias, entraide et présence numérique tout en conservant leurs identités propres. Bouddhisme, taoïsme, hindouisme, confucianisme, shintoïsme et de nombreuses traditions régionales restent présents dans des communautés anciennes ou diasporiques."),
          p("La modernisation porte davantage sur les moyens que sur une disparition des pratiques : textes, cours, sermons et accompagnement circulent sur l'Holonet, tandis que les lieux physiques restent importants pour la solidarité, les rites et l'appartenance.")
        ]
      },
      {
        id: "grand-architecte",
        title: "Le Grand Architecte",
        level: 2,
        blocks: [
          p("Le transhumanisme produit aussi ses expressions spirituelles. Le courant du Grand Architecte interprète augmentation et cybernétique comme des instruments permettant à l'Humanité de dépasser les limites de la chair et d'approcher une forme de perfection. Il emprunte une partie de son langage à des traditions ésotériques et maçonniques tout en se présentant comme pleinement compatible avec la révolution technologique.")
        ]
      },
      {
        id: "neopaganismes",
        title: "Néopaganismes et mouvements nouveaux",
        level: 2,
        blocks: [
          p("Le néopaganisme profite du même paysage : souvent syncrétique, présent dans des milieux contestataires et très à l'aise avec les outils numériques, il emprunte à des références grecques, nordiques, égyptiennes et autres sans chercher nécessairement à reconstituer une religion antique à l'identique. Certaines branches se mêlent à des traditions satanistes, écologistes ou issues des contre-cultures."),
          p("D'autres groupes empruntent directement à la littérature fantastique ou lovecraftienne et affirment l'existence d'entités occultes ou hostiles. Du point de vue de la Réalité, il s'agit ici d'une croyance humaine : cette page ne confirme rien de ce qui pourrait exister derrière le Voile."),
          p("À côté existent sectes, nouveaux prophètes et philosophies annonçant une fin du monde prochaine, parfois décrite comme inéluctable ou même nécessaire. Leur importance va de minuscules communautés à des mouvements disposant de moyens considérables.")
        ]
      },
      {
        id: "sphere-religieuse",
        title: "La Sphère religieuse",
        level: 2,
        blocks: [
          p("Vivre dans une institution de foi ne signifie pas être prêtre. Médecins, enseignants, logisticiens, juristes, travailleurs sociaux, communicants, agents de sécurité, chercheurs et responsables associatifs peuvent passer toute leur vie professionnelle au sein d'un réseau religieux.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-crawlers-underlife",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Crawlers & Underlife",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Crawlers", "Underlife", "Fixers", "Neurodivers", "Meditechs", "Gundrivers", "Neopunks"],
    sections: [
      {
        id: "nom-devenu-identite",
        title: "D'une insulte à une identité",
        level: 2,
        blocks: [
          p("Le mot Crawler vient d'une vieille habitude de classer les indépendants sous des noms de nuisibles : rats, chiens, cafards, termites, chats, corneilles, frelons. L'insulte a fini par devenir une identité."),
          p("Mercenaires, fixers, Neurodivers, Meditechs, Gundrivers, NeoPunks, récupérateurs, artistes ou réparateurs partagent moins un métier qu'une position : ils travaillent entre les grandes structures plutôt qu'à l'intérieur d'elles.")
        ]
      },
      {
        id: "hors-des-systemes",
        title: "Vivre entre les systèmes",
        level: 2,
        blocks: [
          p("Certains Crawlers ont été rejetés par le Logifate, les processus de recrutement corporatifs, une institution publique ou leur communauté d'origine ; d'autres ont volontairement quitté un système trop contraignant. Beaucoup alternent périodes de stabilité et contrats dangereux."),
          p("Un Crawler n'est pas nécessairement pauvre. Un spécialiste exceptionnel peut facturer très cher ; ce qui lui manque par défaut est l'infrastructure protectrice d'une grande institution : service juridique, assurance, médecin, police interne ou famille mafieuse.")
        ]
      },
      {
        id: "infrastructure-sociale",
        title: "L'infrastructure sociale de l'Underlife",
        level: 2,
        blocks: [
          p("L'Underlife compense par les réseaux personnels. Un fixer fiable, une clinique qui ne pose pas de questions, un garage capable de réparer une pièce interdite, un bar où circulent les contrats et une personne assez réputée pour garantir un inconnu forment une infrastructure aussi réelle qu'une administration."),
          p("La réputation y est une monnaie parce qu'elle détermine qui acceptera d'ouvrir une porte lorsque le paiement seul ne suffit pas.")
        ]
      },
      {
        id: "zones-mortes",
        title: "Zones mortes et économie de récupération",
        level: 2,
        blocks: [
          p("Les zones abandonnées ou seulement partiellement reconnues par les cartes administratives rendent l'Underlife particulièrement visible. On y répare véhicules et machines, recycle des matériaux, organise des marchés, aménage des logements et maintient des réseaux bricolés."),
          p("L'abandon administratif ne signifie pas absence de société : il signifie que les habitants doivent produire eux-mêmes une part plus importante de la sécurité, de la maintenance et de la solidarité.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-vivre-en-2035",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Vivre en 2035",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","vie quotidienne","logement","alimentation","mobilité","santé","école","travail","niveau de vie"],
    sections: [
      {
        id: "quotidien-infrastructures",
        title: "Un quotidien fait d'infrastructures",
        level: 2,
        blocks: [
          p("Vivre en 2035 ne signifie pas posséder une collection de gadgets futuristes. Énergie, alimentation, logement, santé, mobilité, communication et loisirs sont devenus des systèmes interconnectés. Le niveau de vie détermine moins l'existence ou l'absence absolue d'une technologie que sa qualité, son intégration, son entretien, la rapidité du service et la liberté conservée face au fournisseur."),
          p("Les pages « Technologies, infrastructures & mobilité », « Alimentation, logement & quotidien matériel », « Augmentations, corps & santé » et « Loisirs, modes & sociabilités » détaillent ces dimensions. Elles décrivent le monde vécu ; les catalogues d'équipement et d'augmentations restent les sources mécaniques.")
        ]
      },
      {
        id: "education-travail-appartenances",
        title: "École, travail et appartenances",
        level: 2,
        blocks: [
          p("État, corporations, religions et communautés entretiennent leurs propres établissements ; l'EIO inspecte ces structures. La réputation d'une école ou d'un centre de formation continue cependant à influencer les carrières."),
          p("Le travail trie les individus par compétences, profil administratif, recommandations et compatibilité institutionnelle. Les corporations recherchent des spécialistes fiables, l'État des personnes habilitables, la Pègre des loyautés compréhensibles et l'Underlife des gens qui tiennent parole."),
          p("Famille, ancienne unité militaire, école, corporation, religion, gang, réseau Crawler ou service public restent fondamentaux parce qu'ils fournissent quelque chose qu'un compte bancaire ne remplace pas : quelqu'un qui connaît votre nom avant que vous ayez à le prouver.")
        ]
      },
      {
        id: "securite-niveau-vie",
        title: "Sécurité et niveau de vie",
        level: 2,
        blocks: [
          p("En 2035, la richesse mesure largement la quantité d'incertitude qu'une personne peut acheter. Les plus pauvres ignorent souvent ce que coûtera la prochaine panne ou qui répondra à une agression ; les classes moyennes achètent de la prévisibilité ; les riches achètent de la redondance."),
          table([
            [
              "Train de vie",
              "Habitat typique",
              "Mobilité et sécurité"
            ],
            [
              "Précaire / Modeste",
              "Dortoir, micro-logement, vieux studio, squat ou chambre",
              "Métro, tram, MAS ponctuel ; sécurité locale inégale."
            ],
            [
              "Standard",
              "Studio ancien ou logement connecté simple",
              "Transports réguliers, vieille voiture ou moto, CityPod financé ; refuge simple."
            ],
            [
              "Confortable",
              "Bon appartement connecté ou logement protégé",
              "VAP familial, moto haut de gamme, mobilité souple ; planque simple."
            ],
            [
              "Aisé",
              "Résidence sécurisée de cadre ou grand appartement",
              "Plusieurs solutions de mobilité et second lieu sécurisé."
            ],
            [
              "Luxe",
              "Penthouse, villa, résidence corporative premium",
              "Véhicules multiples, haute sécurité, plusieurs planques et services à la demande."
            ]
          ]),
          p("Accès n'est pas propriété. Un employé, fonctionnaire ou membre d'une communauté peut utiliser logement, véhicule ou service d'un niveau très supérieur à son patrimoine personnel, puis le perdre en même temps que son statut.")
        ]
      },
      {
        id: "abonnement-dette",
        title: "Consommer, s'abonner, s'endetter",
        level: 2,
        blocks: [
          p("Mobilité, logement, sécurité, logiciels, maintenance augmentique, soins, médias et services domestiques sont souvent vendus par abonnement plutôt que possédés définitivement. Une perte d'emploi peut couper plusieurs services en cascade ; entrer dans une institution riche peut produire l'effet inverse sans changer le patrimoine personnel."),
          p("Bankcorpos et réseaux de crédit prospèrent dans ce modèle. La dette peut être monétaire, professionnelle, mafieuse ou morale : la Californie fonctionne sur plusieurs économies superposées qui n'utilisent pas toutes la même monnaie.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-holonet-medias-culture-identite",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Holonet, médias, culture & identité",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","Holonet","Logifate","médias","mode","culture","identité","réalité augmentée","holophone","IA","hackers"],
    sections: [
      {
        id: "holonet",
        title: "L'Holonet comme environnement social",
        level: 2,
        blocks: [
          p("L'Holonet n'est pas seulement un Internet plus rapide. Communications, médias, services administratifs, commerce, réputation et une part croissante des relations sociales s'y superposent. Logements, véhicules, augmentations, cliniques et institutions peuvent tous être reliés au même écosystème."),
          p("Dans ses interfaces immersives, les données sont traduites en objets et lieux manipulables : un texte peut apparaître comme une feuille, une image comme un panneau, un dossier comme un contenant. Ce que l'utilisateur n'a pas l'autorisation ou le logiciel pour consulter peut simplement ne pas apparaître dans son environnement. Une connexion directe peut projeter l'utilisateur dans une modélisation de son environnement immédiat puis dans les espaces propres aux services qu'il rejoint."),
          p("Cette omniprésence n'a pas créé une société parfaitement informée : elle a surtout augmenté la vitesse à laquelle une information vraie ou fausse peut devenir socialement réelle.")
        ]
      },
      {
        id: "logifate",
        title: "Logifate et présence administrative",
        level: 2,
        blocks: [
          p("Le Logifate est le profil social et administratif numérique d'une personne. Il devient important dès qu'il faut prouver identité, fiabilité, habilitation ou historique à une institution."),
          p("Il ne remplace pas les relations humaines : une personne respectée dans son quartier peut devenir administrativement invisible dès qu'elle entre dans un système qui ne la connaît pas.")
        ]
      },
      {
        id: "cybersecurite",
        title: "Sécurité virtuelle et zones dangereuses",
        level: 2,
        blocks: [
          p("Les équipes de cybersécurité travaillent dans des environnements où bots, pare-feu, virus et anomalies peuvent être représentés par des avatars, armes, créatures ou formes incohérentes. Une attaque peut viser le vol de données, la destruction d'un avatar ou les interfaces neuronales elles-mêmes."),
          p("La plupart des incidents graves provoquent perte de données, verrouillage du profil ou incapacité temporaire à se reconnecter. Les attaques visant directement une interface cérébrale peuvent toutefois provoquer convulsions, lésions neurologiques ou arrêt vital. Des secteurs virtuels mal entretenus accumulent logiciels abandonnés, malwares et données perdues : les hackers les considèrent à la fois comme des décharges et comme des mines d'information."),
          p("Lorsqu'un utilisateur très intégré meurt, ses traces peuvent survivre sous des formes plus complexes que de simples historiques. La culture populaire parle volontiers de « fantômes » numériques ; le terme recouvre aussi bien automatismes et copies partielles que phénomènes techniques difficiles à interpréter.")
        ]
      },
      {
        id: "realite-augmentee-ia",
        title: "Réalité augmentée et IA personnelles",
        level: 2,
        blocks: [
          p("La réalité augmentée superpose l'Holonet au monde physique grâce aux surfaces, hologrammes, lentilles et implants. Elle peut afficher un agenda sur une vitre, transformer un mur en écran ou ajouter aux sens des informations comme température, infrarouge, composition d'une substance ou trajectoires calculées."),
          p("L'holophone accueille couramment une IA d'assistance personnelle. Elle apprend les habitudes de son utilisateur, coordonne objets domestiques, agenda, achats et paiements, puis filtre les informations qu'elle lui présente. Elle n'est pas nécessairement consciente : son efficacité vient de son adaptation continue et de son accès à l'écosystème numérique de la personne."),
          p("Cette proximité fait de l'IA un intermédiaire commercial permanent. Elle peut recommander, commander ou modifier des habitudes au bénéfice de son utilisateur, mais aussi selon les priorités du fournisseur qui la maintient. Dans l'espace virtuel, elle peut apparaître comme un avatar accompagnant l'utilisateur et se retrouver en première ligne lors d'une attaque.")
        ]
      },
      {
        id: "information-attention",
        title: "Information, publicité et confiance",
        level: 2,
        blocks: [
          p("Les Mediacorpos organisent autant l'attention qu'elles ne produisent des contenus. Corporations, partis, institutions religieuses, influenceurs, mafias et mouvements indépendants construisent leurs propres récits. Les mégagroupes médiatiques diffusent en continu sur tous les formats, et leur poids politique vient autant de leur capacité à fixer les sujets importants que de leurs prises de position explicites."),
          p("La censure brutale existe, mais l'inondation est souvent plus efficace : une information peut être techniquement accessible et pratiquement invisible si aucun système ne la montre à la bonne personne. Les assistants personnels et systèmes de recommandation jouent donc un rôle politique et commercial considérable."),
          p("Dans ce contexte, la confiance redevient locale. Une source personnelle, un journaliste suivi depuis des années, un fixer, un collègue ou un membre de communauté peut compter davantage qu'un agrégateur prétendument objectif.")
        ]
      },
      {
        id: "mode-identite",
        title: "Mode, apparence et identité visible",
        level: 2,
        blocks: [
          p("Textiles synthétiques changeant de couleur, régulation thermique, tatouages modulables, peaux artificielles, lentilles et cheveux augmentés rendent l'apparence très flexible. La mode corporative transforme cette apparence en langage d'appartenance ; les scènes underground et neopunks privilégient rupture, détournement et visibilité."),
          p("Les augmentations elles-mêmes deviennent un vêtement social : certains cherchent à rendre une prothèse indiscernable, d'autres exhibent articulation, matière, lumière ou interface comme preuve de réussite, d'appartenance ou de choix idéologique. Les bijoux connectés et textiles réactifs ajoutent une couche supplémentaire à cette identité modulable."),
          p("La possibilité de changer facilement d'apparence crée aussi de nouvelles pressions : refuser de se modifier peut devenir un choix aussi visible que la transformation.")
        ]
      },
      {
        id: "culture-loisirs",
        title: "Culture et spectacle",
        level: 2,
        blocks: [
          p("Les grands groupes médiatiques disposent de moyens immenses tandis que l'Holonet permet à une personne isolée de diffuser une œuvre sans studio. Musique, cinéma, jeux, sport et sociabilités sont détaillés dans « Loisirs, modes & sociabilités », qui développe la manière dont ces technologies sont vécues au quotidien.")
        ]
      },
      {
        id: "generations",
        title: "Une génération entre deux mondes",
        level: 2,
        blocks: [
          p("Les adolescents de 2035 sont nés autour du début des crises. Pour beaucoup, un monde sans Holonet omniprésent, véhicules autonomes ou augmentations courantes relève de l'histoire familiale."),
          p("Les plus jeunes sont souvent moins impressionnés par la modification du corps et plus sensibles à la réputation numérique ; les générations de guerre valorisent davantage sécurité, stocks et capacité d'agir lorsque les services cessent de répondre. Ces tendances ne sont jamais universelles : la société n'a pas choisi collectivement le futur, elle y a été projetée à des vitesses différentes.")
        ]
      },
      {
        id: "journee-ordinaire",
        title: "Une journée parfaitement ordinaire",
        level: 2,
        blocks: [
          p("Le matin, un appartement Standard simule le lever du soleil, propose une recette à partir du stock du frigo et laisse les véhicules autonomes répartir le trafic pendant qu'un drone municipal inspecte une canalisation. Un métro transporte des employés vers une zone dont l'accès exige une identité corporative ; un Crawler descend plus tôt pour éviter de laisser apparaître sa destination."),
          p("À midi, nourriture clonée premium, diner synthétique et repas communautaire gratuit peuvent coexister dans quelques rues. Le soir, une alerte du LAUS coupe une avenue pendant qu'un territoire corporatif ferme ses accès ; la plupart des habitants contournent le problème, rentrent chez eux, consultent dix récits concurrents sur l'Holonet ou rejoignent bar, église, gymnase, salle de Neurodive ou amis."),
          p("Le monde de 2035 est spectaculaire lorsque quelque chose se brise. Le reste du temps, il est surtout devenu normal pour ceux qui doivent y vivre.")
        ]
      }
    ]
  },
  {
    id: "realite-v9-loisirs-modes-sociabilites",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Loisirs, modes & sociabilités",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","loisirs","musique","mode","sexualité","cinéma","jeux vidéo","sport","drogues","nightclubs"],
    sections: [
      {
        id: "musique",
        title: "Musique commerciale et scènes underground",
        level: 2,
        blocks: [
          p("Les grandes corporations médiatiques analysent depuis longtemps les styles, publics et réactions émotionnelles. Une part de la musique commerciale est composée ou optimisée par algorithmes, interprétée par des artistes dont l'image est aussi travaillée que la voix, et associée à des produits, idées ou modes de vie. Des interprètes entièrement virtuels existent aux côtés d'artistes humains."),
          p("Cette industrie a néanmoins produit de vraies innovations. Certaines œuvres utilisent infrasons, ultrasons ou sensations accessibles seulement à des augmentations, créant des genres qu'un auditeur non équipé ne peut pas percevoir complètement."),
          p("En opposition, rock, rap, descendants neopunks et une multitude de scènes underground utilisent l'Holonet pour diffuser gratuitement morceaux, manifestes et contre-cultures. Les corporations récupèrent vite les tendances, mais de nouveaux styles apparaissent en permanence. Les nightclubs restent l'un des grands lieux de rencontre entre ces mondes.")
        ]
      },
      {
        id: "mode",
        title: "La mode comme appartenance",
        level: 2,
        blocks: [
          p("Les corporations utilisent la mode pour mettre en scène leur identité : sérieux, innovation, luxe ou proximité. Les contre-cultures font l'inverse et recherchent rupture, agressivité visuelle ou détournement. Le neopunk, coloré et volontairement difficile à normaliser, est l'un des marqueurs les plus visibles de cette opposition."),
          p("Textiles réactifs capables de chauffer, refroidir, changer de couleur ou signaler leur usure se mêlent à des matières classiques produites par de nouveaux procédés. Tatouages modulables, peaux artificielles et augmentations capillaires permettent de changer de motif, texture, couleur ou longueur en quelques secondes."),
          p("Une mode augmentique revendique ouvertement les transitions cybernétiques. Là où certains dissimulent la technologie sous une peau synthétique, d'autres exposent métal, lumière et articulations. Bijoux connectés et décorations adaptatives prolongent cette identité jusque dans les accessoires.")
        ]
      },
      {
        id: "sexualite-relations",
        title: "Sexualité, relations et technologies du désir",
        level: 2,
        blocks: [
          p("La possibilité de modifier le corps, l'apparence et les sensations a profondément changé la sexualité. Augmentations esthétiques ou sensorielles, hologrammes et interfaces connectées rendent possible une intimité à distance beaucoup plus immersive qu'auparavant. La sexualité virtuelle peut transmettre des sensations physiques plutôt que de se limiter à l'image et au son."),
          p("La prostitution est légale et encadrée dans une grande partie de la Californie, en partie pour limiter les réseaux d'esclavage sexuel. Des systèmes d'identification et de paiement instantané se sont développés autour de cette activité, tandis que d'anciens réseaux mafieux se sont transformés en entreprises légalement enregistrées."),
          p("Pornographie, réalité virtuelle et hologrammes se mélangent à l'industrie des sexbots. Un robot de plaisir peut prendre une apparence virtuelle, exécuter un scénario ou être piloté à distance par une personne, brouillant la frontière entre jouet, performance enregistrée et service sexuel."),
          p("La libéralisation des mœurs n'a pas supprimé les interdits. Les actes sexuels impliquant enfants, animaux ou cadavres restent interdits et socialement rejetés, même lorsque certaines technologies prétendent en simuler les apparences sans victime réelle. Le mariage et la fidélité restent également des valeurs importantes pour une partie de la population : plus de possibilités ne signifie pas disparition des engagements.")
        ]
      },
      {
        id: "cinema-jeux",
        title: "Cinéma, néo-théâtre et jeux vidéo",
        level: 2,
        blocks: [
          p("Le cinéma immersif se tourne pour permettre au spectateur de se déplacer dans la scène, d'adopter le point de vue d'un personnage et parfois de recevoir pression, odeur, vent ou autres sensations. La réalité augmentée prolonge ce spectacle hors des salles."),
          p("Le néo-théâtre mélange acteurs, bots et hologrammes capables de rejouer une œuvre en direct. Les productions industrielles disposent de moyens considérables ; des mouvements contestataires plus artisanaux existent grâce à l'Holonet, mais égalent rarement leur niveau d'immersion."),
          p("Les jeux vidéo utilisent les mêmes technologies, avec la différence décisive que le joueur modifie le scénario par ses choix. Les grosses productions rivalisent avec le cinéma et proviennent souvent des mêmes studios. Le rétrogaming des décennies d'avant-guerre reste populaire parce qu'il est moins exigeant en matériel et porte une forte nostalgie.")
        ]
      },
      {
        id: "sport",
        title: "Le spectacle sportif augmenté",
        level: 2,
        blocks: [
          p("Le sport n'a pas abandonné toutes ses disciplines historiques, mais ses catégories ont été bouleversées par la possibilité de modifier le corps. Les circuits contemporains privilégient des classifications fonctionnelles — poids, capacités autorisées, niveau d'augmentation — plutôt qu'une simple séparation héritée des anciennes divisions biologiques."),
          p("Deux grandes cultures coexistent : circuits limitant strictement les modifications et compétitions assumant la performance augmentée. Ces dernières sont devenues d'immenses vitrines pour les fabricants d'implants, sponsors et médias. Des champions servent de porte-étendards à une marque autant qu'à une équipe."),
          p("La recherche du spectacle favorise sports de combat, arènes mêlant augmentés et machines, ainsi que des sports collectifs particulièrement violents comme le deathball. L'immersion permet en outre à des millions de spectateurs de recevoir en direct une partie des sensations d'un athlète équipé de capteurs.")
        ]
      },
      {
        id: "drogues",
        title: "Drogues chimiques et numériques",
        level: 2,
        blocks: [
          p("Le recul de certaines agricultures traditionnelles a réduit la place de plusieurs psychotropes naturels, tandis que la chimie et la biotech ont multiplié les nouvelles molécules. Les drogues de 2035 jouent sur la transe, la surcharge sensorielle, la perception et surtout l'interaction avec les augmentations."),
          p("Certaines substances sont conçues pour un type d'implant ou une augmentation organique et poussent ses effets bien au-delà des paramètres normaux. Elles se combinent particulièrement bien — et dangereusement — avec les expériences virtuelles."),
          p("Il existe aussi des drogues purement numériques : logiciels et flux de données destinés à provoquer euphorie, distorsion sensorielle ou stimulation extrême via une interface neuronale. Elles contournent les sécurités normales de l'Holonet et peuvent provoquer déconnexion brutale, destruction de données, crise neurologique ou surcharge physiologique.")
        ]
      }
    ]
  }
  {
    id: "realite-v9-augmentations-corps-sante",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Augmentations, corps & santé",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","augmentations","cybernétique","organique","santé","médecine","assurance","prothèses","corps"],
    sections: [
      {
        id: "deux-familles",
        title: "Deux grandes familles d'augmentations",
        level: 2,
        blocks: [
          p("Une augmentation est tout ajout ou remplacement durable sur ou dans le corps humain. Elle peut être esthétique, compensatrice, utilitaire ou combiner plusieurs fonctions. Les catalogues du Builder décrivent les objets et effets mécaniques ; ici, l'enjeu est la manière dont ces technologies transforment la vie."),
          p("Les augmentations cybermécaniques utilisent métaux, polymères, composites et céramiques. Les modèles bas de gamme compensent parfois à peine une perte : une pince lourde peut remplacer une main. Les modèles haut de gamme utilisent des matériaux avancés, une peau synthétique crédible et des interfaces nerveuses précises. Leur puissance technique peut dépasser celle du corps naturel, ce qui rend calibrage, entretien et alimentation indispensables. Une augmentation connectée peut aussi devenir une cible de piratage."),
          p("Les augmentations organiques sont cultivées à partir du code génétique de l'utilisateur puis modifiées par ingénierie génétique et hormonale. Elles peuvent reprendre des structures humaines ou emprunter au vivant écailles, ostéodermes et organes sensoriels. Leur entrée de gamme est coûteuse parce qu'il faut cultiver des tissus ; à haut niveau, elles peuvent devenir moins coûteuses que des dispositifs mécaniques extrêmement complexes, tout en restant limitées par ce que la biologie peut supporter.")
        ]
      },
      {
        id: "avantages-limites",
        title: "Ce que le corps gagne et ce qu'il paie",
        level: 2,
        blocks: [
          p("Les augmentations organiques conservent naturellement sensibilité, cicatrisation et renouvellement cellulaire, mais subissent maladies, chaleur, froid, acides et vieillissement. Les cybermécaniques peuvent filtrer douleur ou signaux sensoriels et être réparées rapidement, mais elles s'usent, dépendent de pièces et peuvent devenir obsolètes indépendamment de l'utilisateur."),
          p("Aucune technologie n'est exempte de rejet. Les systèmes mécaniques peuvent provoquer intoxications ou réactions aux matériaux ; les organiques peuvent s'infecter ou souffrir d'une mauvaise compatibilité cellulaire. Le choix entre les deux familles est donc médical, financier, professionnel et culturel autant que technique.")
        ]
      },
      {
        id: "identite-troubles",
        title: "Charge mentale, identité et dépendances",
        level: 2,
        blocks: [
          p("Plus une personne ajoute de fonctions, plus elle doit apprendre à les intégrer. Les systèmes mécaniques complexes imposent au cerveau un flux de données et de contrôles supplémentaires ; un mauvais calibrage ou une surcharge chronique peut ralentir la décision, altérer le contrôle des impulsions ou produire un épuisement cognitif."),
          p("La transformation répétée du corps peut aussi perturber l'image de soi. Certains augmentés connaissent une dépersonnalisation, une difficulté à reconnaître leur apparence ou une distance croissante avec les personnes non augmentées. La puissance physique ou sensorielle peut favoriser chez certains une confiance excessive, voire un sentiment d'invulnérabilité."),
          p("Les augmentations peuvent devenir addictives comme n'importe quel produit de statut ou modification esthétique. Les augmentations organiques les plus exotiques ajoutent un autre risque : leurs équilibres hormonaux peuvent modifier humeur, agressivité ou apathie si le suivi médical est mauvais. Ces troubles ne sont ni automatiques ni universels ; ils constituent des risques connus que qualité du matériel, suivi et contexte social peuvent aggraver ou réduire.")
        ]
      },
      {
        id: "emploi-corps",
        title: "Le corps comme capital professionnel",
        level: 2,
        blocks: [
          p("Les différences de taille, force, apparence, sexe ou capacités sensorielles sont devenues beaucoup plus modifiables qu'auparavant. Cette liberté ne supprime pas les inégalités : elle les déplace vers l'accès aux opérations, à la maintenance et aux traitements."),
          p("Les corporations favorisent souvent les employés déjà adaptés au poste et peuvent proposer, financer ou exiger certaines modifications. Une augmentation conçue pour le travail peut donc être à la fois outil, avantage de carrière et dette envers l'employeur.")
        ]
      },
      {
        id: "sante-assurance",
        title: "Santé, assurance et vitesse d'intervention",
        level: 2,
        blocks: [
          p("Les hôpitaux publics se développent sous l'impulsion de Dina Page et coexistent avec dispensaires, cliniques corporatives, réseaux religieux et structures clandestines. L'assurance santé est fortement liée au rang social et professionnel."),
          p("Chaque citoyen peut disposer d'un identifiant de santé capable de transmettre localisation et données vitales. La qualité du dispositif dépend des moyens. En cas d'accident, les meilleurs contrats déclenchent l'intervention rapide d'équipes médicales équipées pour entrer en terrain hostile ; les plus faibles se limitent à l'alerte ou obligent encore le blessé à trouver lui-même une structure disponible."),
          p("Des portiques et systèmes de diagnostic urbains mettent à jour certaines données sanitaires ; les hôpitaux disposent d'équipements beaucoup plus complets capables de dresser rapidement un bilan préliminaire. Le médecin reste indispensable dès que le diagnostic devient complexe.")
        ]
      },
      {
        id: "medecine-regeneration",
        title: "Médecine, organes et longévité",
        level: 2,
        blocks: [
          p("La génétique, la culture d'organes et les prothèses avancées permettent de remplacer de nombreux tissus autrefois perdus. Une grande partie des maladies est mieux traitée et des cures de longévité peuvent ralentir fortement certains effets de l'âge, sans être infinies ni accessibles à tous."),
          p("L'inégalité reste donc brutale : une blessure qui vaut une prothèse minimaliste au plus pauvre peut être suivie chez un riche d'une reconstruction organique presque invisible. Le progrès médical a augmenté ce qui est possible bien plus vite qu'il n'a égalisé qui peut se le permettre."),
          p("Après la mort, prélèvement d'organes viables et crémation sont devenus courants dans plusieurs systèmes sanitaires. Les modalités exactes dépendent du droit, des contrats, des convictions et des institutions concernées ; les pratiques de 2035 restent un terrain de tension entre efficacité médicale, liberté individuelle et rites funéraires.")
        ]
      }
    ]
  }
  {
    id: "realite-v9-alimentation-logement-quotidien-materiel",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Alimentation, logement & quotidien matériel",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","alimentation","logement","ration universelle","clonage","insectes","eau","domotique","robotique domestique"],
    sections: [
      {
        id: "hierarchie-alimentaire",
        title: "Manger : de la survie au luxe",
        level: 2,
        blocks: [
          p("La Californie ne manque généralement plus de calories, mais le mode de production est devenu un marqueur social. La ration universelle concentre vitamines, protéines, lipides, sucres et sels minéraux dans une barre fibreuse adaptée aux grandes tranches d'âge. Bon marché et peu plaisante à mâcher, elle existe avant tout pour rendre la famine beaucoup plus difficile."),
          p("Les céréales comme le blé, le riz ou le soja restent massivement cultivées. L'élevage d'insectes fournit d'énormes quantités de protéines et recycle des déchets biologiques ; les insectes sont surtout transformés en purées ou ingrédients plutôt que consommés sous leur forme entière."),
          table([
            [
              "Production",
              "Principe",
              "Place sociale"
            ],
            [
              "Synthétique",
              "Algues modifiées produisant protéines et arômes, puis impression en formes désirées",
              "Bon marché ; très présente dans diners et restauration de masse."
            ],
            [
              "Clonée",
              "Viandes, fruits et légumes cultivés à partir de tissus sélectionnés",
              "Standard à premium ; qualité stable, peu de pertes climatiques ou sanitaires."
            ],
            [
              "Pêche d'élevage",
              "Grandes zones marines closes gérées comme des réserves",
              "Production importante ; reproduction et prélèvement sont administrés par les exploitants."
            ],
            [
              "Classique",
              "Élevage, agriculture, terroirs et méthodes traditionnelles",
              "Rare et coûteuse ; recherchée par les riches et la restauration de luxe."
            ]
          ])
        ]
      },
      {
        id: "boissons-saveurs",
        title: "Boissons, sucre et saveurs disparues",
        level: 2,
        blocks: [
          p("L'eau courante et embouteillée est le plus souvent reconditionnée et épurée. Les véritables eaux de source non contaminées sont plus rares et se vendent comme des produits de qualité."),
          p("Des algues spécialisées produisent des sucres destinés aux sodas, alcools industriels et confiseries. Bière et autres fermentations restent donc faciles à produire sans agriculture sucrière classique."),
          p("Certaines saveurs traditionnelles sont devenues difficiles à obtenir. Cacao, vanille et lait animal sont largement remplacés par des arômes, des bases synthétiques ou des productions biologiques spécialisées ; les versions classiques ou issues de tissus clonés complexes relèvent davantage du luxe. Les alcools suivent la même hiérarchie : production traditionnelle pour les plus riches, filières industrielles ou algales pour le marché de masse.")
        ]
      },
      {
        id: "logement",
        title: "Se loger après les crises",
        level: 2,
        blocks: [
          p("Les pertes démographiques, migrations et nouvelles possibilités de construction ont rendu certains logements plus accessibles malgré l'appauvrissement général. Beaucoup d'immeubles restent toutefois marqués par des années de sous-entretien."),
          p("Le choc technologique de 2030 a rendu ces bâtiments beaucoup plus vivables sans reconstruction complète. Une fenêtre peut devenir écran, un mur afficher une autre matière, des hologrammes recouvrir une table ou une porte, et un papier peint adaptatif changer entièrement l'ambiance d'une pièce. Pour un foyer moyen, cette couche numérique coûte souvent moins cher qu'une rénovation lourde."),
          p("Les logements aisés intègrent ces fonctions au point de les rendre presque invisibles. À l'autre extrême, les dortoirs ouvriers et logements très pauvres disposent de peu de connectivité, tandis que les zones abandonnées sont occupées par sans-abris, hors-la-loi, contestataires ou toxicomanes qui vivent parfois sans infrastructure numérique fiable.")
        ]
      },
      {
        id: "maison-connectee",
        title: "La maison connectée",
        level: 2,
        blocks: [
          p("Serrures électroniques, capteurs, surfaces interactives et petits robots d'entretien rendent les logements connectés plus sûrs et faciles à maintenir. Une intrusion physique peut être détectée immédiatement et signalée à une sécurité privée ou publique ; en contrepartie, le piratage devient l'une des principales menaces domestiques."),
          p("Les cuisines automatisées choisissent une recette, déplacent les ingrédients depuis le stockage et coordonnent cuiseurs, batteurs ou distributeurs. Les ingrédients synthétiques et clonés, très standardisés, rendent cette automatisation particulièrement efficace, même si elle limite les recettes qui sortent des formats prévus.")
        ]
      },
      {
        id: "niveau-vie",
        title: "Le confort est une qualité de service",
        level: 2,
        blocks: [
          p("Deux personnes peuvent posséder les mêmes fonctions de base tout en vivant dans des mondes différents. L'une dispose d'un écran mural lent, d'une serrure bon marché et d'une cuisine semi-automatique ; l'autre d'un environnement discret, redondant, surveillé et entretenu en permanence. En 2035, le luxe vient souvent moins de l'invention elle-même que de son intégration et de l'absence de friction.")
        ]
      }
    ]
  }
  {
    id: "realite-v9-technologies-infrastructures-mobilite",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Technologies, infrastructures & mobilité",
    source: CONSOLIDATED_SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité","technologie","énergie","transports","matériaux","robotique","espace","Lune","Vactrain"],
    sections: [
      {
        id: "energie",
        title: "Produire et stocker l'énergie",
        level: 2,
        blocks: [
          p("La fusion a profondément changé les infrastructures lourdes. De grandes centrales remplacent progressivement les installations à fission ou au charbon et fournissent l'énergie continue exigée par les villes, les industries et les réseaux de transport. Les systèmes portables à fusion existent encore surtout sous forme expérimentale ou spécialisée."),
          p("À plus petite échelle, plusieurs technologies coexistent. Les batteries cellulaires produisent du courant à partir de cellules vivantes qu'il faut nourrir et renouveler ; en fin de cycle, leur matière biologique peut être recyclée puis la batterie reconditionnée. Les piles à combustible utilisent de l'hydrogène, notamment produit grâce à des cultures d'algues, et rejettent principalement de l'eau."),
          p("Le pétrole a perdu l'essentiel de son rôle comme carburant. Les biocarburants issus d'algues à haut rendement ont repris une partie des usages nécessitant encore un liquide combustible ; leur production recycle une partie du dioxyde de carbone grâce à la photosynthèse. Le paysage énergétique reste donc diversifié plutôt que dominé par une solution unique.")
        ]
      },
      {
        id: "transports-urbains",
        title: "Mobilité urbaine",
        level: 2,
        blocks: [
          p("La voiture existe toujours, mais son usage recule face aux transports collectifs et services autonomes. Les véhicules autonomes privés équipent tous les modèles récents : ils gèrent circulation, collision et itinéraire avec une sécurité supérieure à celle d'un conducteur moyen. Le permis n'est nécessaire que pour reprendre réellement les commandes hors situation d'urgence, tandis que les véhicules anciens non autonomes sont davantage taxés."),
          p("Métro et tramway assurent des flux continus. Les réseaux les plus profonds relient centres urbains et pôles industriels ; les tramways desservent souvent des quartiers résidentiels plus éloignés. Les Modules autonomes de service, ou MAS, remplacent une partie des bus, cars et taxis : on ne les possède pas, on achète un trajet ou un temps de service. Les plus riches disposent de forfaits quasi permanents.")
        ]
      },
      {
        id: "longue-distance",
        title: "Voyager loin et vite",
        level: 2,
        blocks: [
          p("Le Vactrain circule sur rampe magnétique dans un tube à très basse pression et relie les principales métropoles à des vitesses qui peuvent approcher plusieurs milliers de kilomètres par heure. Son coût d'infrastructure est immense, mais il offre l'un des moyens les plus rapides et réguliers de parcourir de longues distances."),
          p("L'aviation se partage entre appareils classiques et supersoniques, alimentés par des systèmes à pile à combustible et stockage d'hydrogène. Les longues distances restent rentables ; les liaisons courtes et moyennes ont nettement reculé face au rail et aux réseaux terrestres."),
          p("Des transports balistiques propulsent un véhicule vers sa destination sans moteur autonome pendant la majeure partie du trajet ; le transport par cavitation applique une logique comparable sous l'eau, dans une bulle limitant les frottements. Ces systèmes sont rapides et économes après l'impulsion initiale, mais leur trajectoire doit être totalement sécurisée car un obstacle devient catastrophique."),
          p("Les bateaux ont surtout évolué par leur énergie et leur taille. Les aéroglisseurs ont gagné du terrain pour le tout-terrain. Jetpacks et pulsocrafts à réacteurs existent également ; ces derniers sont encore souvent qualifiés abusivement d'antigravité et restent majoritairement militaires ou spécialisés en 2035.")
        ]
      },
      {
        id: "materiaux",
        title: "Matériaux de la révolution industrielle",
        level: 2,
        blocks: [
          p("Les polymères biosynthétisés à partir d'algues ont réduit la dépendance aux hydrocarbures et se combinent très bien avec l'impression additive. Une grande partie des objets ordinaires peut ainsi être produite ou réparée localement avec relativement peu de métal."),
          p("Les composites modernes imitent de mieux en mieux le vivant : peaux synthétiques, fibres adaptatives, carrosseries photovoltaïques et textiles capables de changer de couleur ou de texture sont devenus courants dans les produits haut de gamme."),
          p("À l'inverse, certains matériaux organiques imitent le minéral ou le manufacturé. Vêtements vivants se nourrissant de déchets biologiques, charpentes osseuses capables de se réparer ou surfaces d'émail vivant autonettoyantes existent réellement, même s'ils restent déroutants et coûteux."),
          p("Les nouvelles céramiques résistantes aux températures extrêmes sont essentielles aux vactrains, transports par cavitation, réacteurs et boucliers thermiques. Elles ont aussi joué un rôle dans les technologies ayant rendu possible le voyage martien de Dina Page.")
        ]
      },
      {
        id: "robotique",
        title: "Une robotique surtout invisible",
        level: 2,
        blocks: [
          p("La robotique s'est développée pendant la guerre puis a envahi le quotidien sans prendre partout une forme humanoïde. L'industrie utilise des chaînes coordonnées où les travailleurs humains supervisent, entretiennent et interviennent sur les tâches complexes. Les postes ouvriers ont donc souvent glissé de l'exécution vers la maintenance."),
          p("Dans les logements, bâtiments et rues, de petits robots désinfectent, inspectent, réparent et surveillent. Les cuisines automatisées combinent stock du frigo, recettes, cuisson et préparation avec des ingrédients conditionnés pour être manipulés par machine."),
          p("Les vestiges les plus visibles de la guerre sont les robots de sécurité et militaires, souvent associés à des drones de surveillance. Ils permettent de contenir une menace avant l'arrivée d'une équipe humaine ou d'intervenir dans un environnement trop dangereux.")
        ]
      },
      {
        id: "espace",
        title: "La Lune avant Mars",
        level: 2,
        blocks: [
          p("En 2035, la Lune est déjà un territoire d'exploitation et d'échange de cargaisons. Les corporations y opèrent sous une législation différente de celle de la Terre ; l'USF demeure l'autorité de référence chargée de la sécurité et de la coexistence entre exploitants."),
          p("Des stations orbitales privées servent au divertissement, au prestige ou de refuge rêvé pour les plus riches. Le voyage vers Mars a été accompli, mais aucune ruée générale ne s'est encore déclenchée : gouvernements ruinés, risques techniques et rentabilité incertaine limitent les investissements. L'espace est accessible sans être encore devenu un nouveau continent.")
        ]
      }
    ]
  }
];

export const COMPENDIUM_REALITE_V9_LORE_NAVIGATION = [
  { id: "realite-v9-grande-californie-2035", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Cadre général", subgroupOrder: 10, pageOrder: 10, displayTitle: "Grande Californie en 2035" },
  { id: "realite-v9-etat-institutions-grande-reserve", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Institutions & territoires", subgroupOrder: 20, pageOrder: 10, displayTitle: "État, institutions & Grande Réserve" },
  { id: "realite-v9-los-angeles-laus-securites", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Institutions & territoires", subgroupOrder: 20, pageOrder: 20, displayTitle: "Los Angeles, LAUS & sécurités" },
  { id: "realite-v9-corporations-territoires", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Puissances de Réalité", subgroupOrder: 30, pageOrder: 10, displayTitle: "Corporations & territoires corporatifs" },
  { id: "realite-v9-pegre-mafias-gangs", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Puissances de Réalité", subgroupOrder: 30, pageOrder: 20, displayTitle: "Pègre, mafias & gangs" },
  { id: "realite-v9-religions-communautes", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Puissances de Réalité", subgroupOrder: 30, pageOrder: 30, displayTitle: "Religions & communautés" },
  { id: "realite-v9-crawlers-underlife", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Puissances de Réalité", subgroupOrder: 30, pageOrder: 40, displayTitle: "Crawlers & Underlife" },
  { id: "realite-v9-vivre-en-2035", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Vie quotidienne", subgroupOrder: 40, pageOrder: 10, displayTitle: "Vivre en 2035" },
  { id: "realite-v9-technologies-infrastructures-mobilite", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Vie quotidienne", subgroupOrder: 40, pageOrder: 20, displayTitle: "Technologies, infrastructures & mobilité" },
  { id: "realite-v9-alimentation-logement-quotidien-materiel", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Vie quotidienne", subgroupOrder: 40, pageOrder: 30, displayTitle: "Alimentation, logement & quotidien matériel" },
  { id: "realite-v9-augmentations-corps-sante", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Vie quotidienne", subgroupOrder: 40, pageOrder: 40, displayTitle: "Augmentations, corps & santé" },
  { id: "realite-v9-loisirs-modes-sociabilites", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Vie quotidienne", subgroupOrder: 40, pageOrder: 50, displayTitle: "Loisirs, modes & sociabilités" },
  { id: "realite-v9-holonet-medias-culture-identite", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Vie quotidienne", subgroupOrder: 40, pageOrder: 60, displayTitle: "Holonet, médias, culture & identité" }
]
