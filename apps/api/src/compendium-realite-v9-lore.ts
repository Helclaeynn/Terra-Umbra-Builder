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

const p = (text: string, style?: string): Block => ({ type: "p", text, ...(style ? { style } : {}) });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

export const COMPENDIUM_REALITE_V9_LORE_ARTICLES: Article[] = [
  {
    id: "realite-v9-grande-californie-2035",
    dataset: "realite-v9",
    category: "Réalité",
    sourceCategory: "Réalité",
    title: "Grande Californie en 2035",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Grande Californie", "2035", "chronologie", "société", "territoires", "juridictions"],
    sections: [
      {
        id: "un-pays-jeune-sur-un-territoire-ancien",
        title: "Un pays jeune sur un territoire ancien",
        level: 2,
        blocks: [
          p("En 2035, la Grande Californie est un pays jeune bâti sur un territoire ancien, encore marqué par les crises sanitaires, la guerre, l'effondrement économique des années 2020 et quinze années de transformations accélérées. Ce n'est ni une utopie technologique ni une ruine cyberpunk uniforme : prospérité spectaculaire, reconstruction incomplète, institutions publiques, mégacorporations, mafias et réseaux indépendants coexistent à quelques rues de distance."),
          p("La technologie est omniprésente sans avoir uniformisé les existences. Les habitants les plus favorisés vivent au milieu d'automatismes, de surfaces adaptatives, de véhicules autonomes, de médecine augmentée et de l'Holonet ; les moins favorisés utilisent des versions minimales ou anciennes des mêmes technologies, et l'Underlife transforme l'obsolescence, la récupération et le bricolage en économie locale.")
        ]
      },
      {
        id: "chronologie",
        title: "Quinze années qui ont changé le rythme du monde",
        level: 2,
        blocks: [
          table([
            ["Période", "Repère", "Conséquence majeure"],
            ["2020–2021", "Crises sanitaires et économiques", "Fragilisation des services, précarité, accélération du travail à distance et des réseaux numériques."],
            ["2022", "Grande Guerre du Pacifique", "Mobilisation industrielle, prototypes, cybernétique militaire, robotique, nouveaux matériaux et armements."],
            ["2025–2028", "Années de rupture", "Migrations massives, désertification de zones, montée des pouvoirs locaux et multiplication des acteurs privés."],
            ["2028", "Fin de la guerre", "Les technologies financées par l'effort militaire commencent à basculer massivement vers le civil."],
            ["2030", "Grand choc technologique", "Holonet, connectivité omniprésente, démocratisation accélérée des augmentations et des automatismes."],
            ["2032–2033", "Dina Page et l'émancipation californienne", "Consolidation du pouvoir californien et autonomie politique débouchant sur la Grande Californie."],
            ["2034", "Réforme de Los Angeles", "Catalina de la Caza transforme la police de Los Angeles en LAUS."],
            ["2035", "Nouvel équilibre", "État fort mais en reconstruction, corporations immenses, Pègre structurée, société augmentée et frontières sociales visibles."]
          ]),
          p("Les générations qui ont connu la guerre accordent souvent une valeur particulière à la sécurité, aux stocks et à l'autonomie matérielle. Les plus jeunes considèrent déjà comme ordinaires des technologies que leurs parents ont vu apparaître en quelques années.")
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
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "gouvernement", "Dina Page", "agences", "Grande Réserve", "CBII", "CNAD", "CBAC"],
    sections: [
      {
        id: "etat-robuste",
        title: "Un État volontairement robuste",
        level: 2,
        blocks: [
          p("L'indépendance californienne n'a pas produit un État minimal. Sous l'impulsion de Dina Page, la Grande Californie reconstruit au contraire une puissance publique capable de négocier avec les mégacorporations, de réprimer une organisation criminelle devenue incontrôlable et de maintenir des services essentiels dans les zones économiquement délaissées."),
          p("L'exécutif est fortement incarné autour de la présidente-gouverneure et d'un cabinet resserré appuyé par des secrétariats comparables à des ministères. Les municipalités conservent néanmoins un poids considérable, et des villes comme Los Angeles disposent d'institutions assez puissantes pour négocier presque d'égal à égal avec l'État.")
        ]
      },
      {
        id: "legislatif-justice-services",
        title: "Congrès, justice et services publics",
        level: 2,
        blocks: [
          p("Le législatif s'organise autour d'un Congrès associant Sénat et Assemblée, avec commissions et mécanismes de contrôle. Une Cour suprême californienne se trouve au sommet de l'ordre judiciaire."),
          p("Défense, pompiers, santé, écoles, administrations, urbanisme et énergie restent des services publics visibles. Leur qualité varie fortement : certaines structures ont été modernisées à marche forcée, d'autres utilisent des équipements récents dans des bâtiments encore marqués par les années de pénurie.")
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
            ["Agence", "Mission", "Présence concrète"],
            ["CNAD", "Direction et coordination des agences", "Budgets, restructurations, création ou suppression de services, contrôle de performance ; pas de force de terrain propre."],
            ["CBII", "Investigation et renseignement", "Crime majeur, contre-espionnage, terrorisme, grandes enquêtes corporatives, mafias et soutien aux polices locales."],
            ["CPP", "Produits prohibés et contrebande", "Armes, drogues chimiques ou numériques, agents biologiques, augmentations militaires interdites et trafics spécialisés."],
            ["INATA", "Affaires des nations amérindiennes", "Droits, négociations, dossiers juridiques et relations avec les territoires et institutions autochtones."],
            ["CBAC", "Abus et corruption", "Contrôle des forces publiques et des sécurités corporatives, corruption, procédures et abus de pouvoir."],
            ["CCHS", "Surveillance sanitaire", "Épidémies, risques biologiques, santé mentale, augmentations et réponses de santé publique."],
            ["NRMD", "Ressources naturelles", "Énergie, matières premières, biodiversité, quotas et prévention des monopoles destructeurs."],
            ["EIO", "Inspection de l'éducation", "Évaluation des établissements publics, privés, corporatifs et centres de formation."],
            ["CSCO", "Standards corporatifs", "Inspections inopinées, conformité aux normes californiennes et transmission des infractions."],
            ["STAB", "Abus technologiques", "Technologies dangereuses, laboratoires d'analyse, confinement et intervention spécialisée."]
          ])
        ]
      },
      {
        id: "cbii-charniere",
        title: "Le CBII comme charnière",
        level: 2,
        blocks: [
          p("Le CBII est en 2035 la structure la plus complète et la plus capable d'opérer seule. Là où une petite agence apporte surtout expertise, inspection ou compétence juridique, le Bureau peut fournir locaux, effectifs, renseignement, matériel et capacité opérationnelle."),
          p("Hors de Los Angeles, il peut prendre la direction d'une affaire majeure ; à Los Angeles, il doit composer avec la puissance propre et la connaissance du terrain du LAUS. Ses rapports avec la Pègre sont pragmatiques : informateurs, accords ponctuels et infiltrations existent dans un monde où les grandes mafias ont des activités légales et où des corporations peuvent commettre des délits d'une ampleur considérable.")
        ]
      },
      {
        id: "administration-transition",
        title: "Une administration de transition",
        level: 2,
        blocks: [
          p("Les frontières entre agences restent plus souples que dans les anciens appareils fédéraux. Une affaire technologique peut naître au STAB, demander une saisie au CPP, mobiliser le CBII pour l'opération et finir sous le regard du CBAC si l'usage de la force est contesté.")
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
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Los Angeles", "LAUS", "Catalina de la Caza", "SII", "USC", "sécurité privée"],
    sections: [
      {
        id: "reforme-laus",
        title: "La réforme de Catalina de la Caza",
        level: 2,
        blocks: [
          p("En 2034, Catalina de la Caza, ancienne Navy SEAL et héroïne de guerre, prend la tête d'une police de Los Angeles devenue inadaptée à une ville de criminalité lourdement armée, de milices corporatives, de cyberattaques et de populations augmentées. Elle transforme l'institution en Los Angeles Urban Security : LAUS."),
          p("Sa doctrine repose sur trois fonctions : Surveillance, Investigation, Intervention. La Surveillance cartographie risques, flux, Holonet, drones et frontières de juridiction ; l'Investigation réunit détectives, scientifique, cyber-enquête et traitement des données ; l'Intervention doit disposer immédiatement du niveau de force proportionné à la menace.")
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
            ["Ensemble", "Fonction dominante", "Exemples"],
            ["Bureau du Chef", "Commandement et doctrine", "Coordination générale, relations politiques, priorités de sécurité."],
            ["Surveillance Bureau", "Voir la ville", "Central, West, Valley, South, Holonet et dispositifs de veille."],
            ["Investigation Bureau", "Établir les faits", "Détectives, forensic, cyber, preuves et chaînes d'enquête."],
            ["Intervention Bureau", "Agir sous pression", "Heavy Operations, Special Operations, Data Operations et soutien tactique."],
            ["USC", "Ancrage territorial", "Accueil, détention, coordination, refuge, armurerie et moyens de crise."]
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
          p("La nuit accentue les contrastes : quartiers riches éclairés et surveillés, secteurs de loisirs actifs tard, ateliers et marchés informels là où la surveillance est plus facile à voir. Los Angeles ne dort pas ; l'autorité apparente change avec l'heure.")
        ]
      },
      {
        id: "securites-privees",
        title: "Sécurités privées et monopole imparfait de la force",
        level: 2,
        blocks: [
          p("Les sécurités corporatives sont un héritage majeur des années de guerre. Certaines sont devenues de véritables organisations dotées de blindés, drones, équipes médicales, cyberdéfense et personnels de niveau militaire ; les Armacorpos vendent protection de site, escorte, renseignement et intervention."),
          p("Elles peuvent protéger un site, un convoi ou des employés et retenir un intrus dans leur périmètre, mais ne disposent pas d'un droit général de police. Leur pouvoir réel dépend du territoire, du contrat, de la coopération avec les autorités et de leur capacité à supporter le coût politique d'un affrontement.")
        ]
      },
      {
        id: "controle-et-abus",
        title: "Efficacité, armement et contrôle",
        level: 2,
        blocks: [
          p("La surveillance accrue, l'armement lourd et l'intégration des données du LAUS inquiètent autant qu'ils rassurent. Le CBAC existe notamment pour empêcher qu'une force publique se transforme en milice au prétexte qu'elle affronte des milices privées."),
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
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "corporations", "mégacorporations", "Eversor", "Saskia", "contrats", "territoires corporatifs"],
    sections: [
      {
        id: "puissance-nee-urgence",
        title: "Une puissance née de l'urgence",
        level: 2,
        blocks: [
          p("Les mégacorporations ont construit leur pouvoir pendant les guerres et crises logistiques : produire plus vite, extraire des ressources, reconstruire, sécuriser des chaînes d'approvisionnement et financer des technologies exigeait des acteurs capables d'agir hors des rythmes administratifs ordinaires."),
          p("En Californie, leur autonomie n'est jamais absolue. Elles disposent de sécurités privées, règlements internes, logements, cliniques, commerces et parfois réseaux de transport, mais restent soumises au droit californien et aux inspections de services tels que le CSCO ou le CBAC.")
        ]
      },
      {
        id: "secteurs",
        title: "Les grands secteurs corporatifs",
        level: 2,
        blocks: [
          table([
            ["Ensemble", "Domaines", "Noms connus"],
            ["Agrocorpos", "Alimentation, eau, agriculture industrielle, mer", "Yellow Food, ASCO, Dwarfood, Ocean Master, Herbrews, Wellspring, Seawares"],
            ["Mediacorpos", "Information, divertissement, musique, image", "Tuatha, Dreampoint, Nexstar Media, Omegacoustics, Hound Record, Peach Media, Phantasmedia"],
            ["Manucorpos", "Industrie, véhicules, énergie, construction", "Raven Industries, Phoenix, Byron Industries, Bullmotors, Nymphrover, Omega Systems"],
            ["Cybercorpos", "Holonet, IA, neurotechnologies, cybersécurité", "Arcanetworks, Monarch Systems, Aces, Allico, Apexi, Sphere, Sphinx Solution"],
            ["Biocorpos", "Médecine, génétique, biotech, corps", "Biosun, Sunways, Antelligence, Mysticorps, Boarco, Joytechs, Rabbitechnologies"],
            ["Armacorpos", "Sécurité privée, armement, protection", "Ushkoll, Pixy, Tortoise, Remo"],
            ["Servicorpos", "Services, droit, renseignement, navigation", "Tala, FirstLawyer, Northstar, Antler Systems, Canics, Dreamscoms, Nightelligence"],
            ["Bankcorpos", "Crédit, finance, compensation", "Corebank, Laguna Bank, Liao Kashiwa Banking, Euro Monetary Found, Panamerica Banking"]
          ])
        ]
      },
      {
        id: "vivre-sous-contrat",
        title: "Vivre sous contrat",
        level: 2,
        blocks: [
          p("Un bon contrat peut inclure logement, assurance médicale, école, transport, accès prioritaire à certaines augmentations, protection juridique et réductions dans les services du groupe. La vie peut être extrêmement confortable tant que le contrat tient."),
          p("Cette dépendance rend la frontière entre vie professionnelle et vie privée poreuse : perdre son poste peut signifier changer de médecin, rendre un véhicule, quitter un logement et découvrir que plusieurs services n'étaient jamais réellement la propriété de l'employé."),
          p("Tous les corporatistes ne vivent pas cette relation comme une prison. Beaucoup considèrent que leur groupe tient mieux ses promesses que l'État ou la Pègre ; d'autres passent d'une corporation à l'autre, négocient leur expertise et exploitent les rivalités internes.")
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
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Pègre", "mafias", "gangs", "Table des Mafias", "crime organisé", "dette", "réputation"],
    sections: [
      {
        id: "empires-nes-dans-les-vides",
        title: "Des empires nés dans les vides",
        level: 2,
        blocks: [
          p("Pendant les pires années, le crime organisé n'a pas seulement vendu des produits interdits : il a déplacé des marchandises, prêté de l'argent, protégé des rues, trouvé des médicaments, fourni des faux papiers et donné du travail là où les institutions ne répondaient plus."),
          p("Lorsque l'économie s'est stabilisée, ces réseaux étaient devenus trop enracinés, trop riches et parfois trop utiles pour disparaître. Une mafia peut aujourd'hui posséder restaurants, transports et immobilier parfaitement déclarés ; une corporation peut de son côté commettre des délits plus vastes que nombre de trafics traditionnels.")
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
            ["Organisation", "Ancrage", "Image et spécialités visibles"],
            ["Vladivostokskaïa / Bratva", "Réseaux russes et est-européens", "Influence forte au Comité, finance, protection, réseaux transnationaux, nombreuses activités légales."],
            ["La Famille", "Italo-américaine", "Vieilles structures familiales, affaires, influence locale et criminalité classique modernisée."],
            ["Vingt-deux Dragons", "Triades chinoises", "Réseaux commerciaux, communautés, contrebande et connexions asiatiques."],
            ["Yamaguchi", "Yakuza", "Organisation disciplinée, entreprises, jeux, protection et réseaux japonais."],
            ["Oglaigh", "Mafia irlandaise", "Réseaux communautaires, trafic, violence ciblée et alliances anciennes."],
            ["New Yiddish Californian Connection", "Mafia juive", "Finance, réseaux d'affaires et implantation relationnelle."],
            ["French Connection", "Réseaux français", "Trafic, finance, luxe et connexions transatlantiques."],
            ["Cartels", "Mexique et frontière sud", "Sinaloa et groupes de Diejuana restent des puissances majeures, parfois hors des équilibres de la Table."]
          ])
        ]
      },
      {
        id: "gangs",
        title: "La place des gangs",
        level: 2,
        blocks: [
          p("Bloods, Crips, 18th Street, MS-13, Sons of Samoa et structures plus récentes peuvent contrôler un quartier ou fournir des combattants. Les grandes mafias les considèrent cependant souvent comme sous-traitants, outils ou acteurs consommables : un gang peut être terrifiant dans trois rues et politiquement insignifiant à l'échelle de la Table.")
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
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "religions", "Église chrétienne réunifiée", "Innocentia XIV", "Grand Architecte", "néopaganisme"],
    sections: [
      {
        id: "retour-fonction-sociale",
        title: "Le retour des communautés",
        level: 2,
        blocks: [
          p("Les crises des années 2020 rendent aux religions une fonction sociale très visible. Paroisses, mosquées, synagogues, temples, associations spirituelles et réseaux communautaires continuent à nourrir, héberger, soigner, enseigner et organiser lorsque administrations et entreprises ne couvrent plus tous les besoins."),
          p("La foi n'est pas redevenue universelle ; elle est redevenue institutionnellement utile. L'Holonet sert aux sermons, consultations, réseaux d'entraide et enseignements, et les responsables religieux participent aux débats sur augmentations, IA, consentement neurochimique et définition de la personne.")
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
          p("Islam, judaïsme et autres traditions anciennes modernisent également médias, entraide et présence numérique tout en conservant leurs identités propres. Bouddhisme, taoïsme, hindouisme, confucianisme, shintoïsme et de nombreuses traditions régionales restent présents dans des communautés anciennes ou diasporiques.")
        ]
      },
      {
        id: "grand-architecte",
        title: "Le Grand Architecte",
        level: 2,
        blocks: [
          p("Le transhumanisme produit aussi ses expressions spirituelles. Le courant du Grand Architecte interprète augmentation et cybernétique comme des instruments permettant à l'Humanité de dépasser les limites de la chair et d'approcher une forme de perfection.")
        ]
      },
      {
        id: "neopaganismes",
        title: "Néopaganismes et mouvements nouveaux",
        level: 2,
        blocks: [
          p("Le néopaganisme profite du même paysage : souvent syncrétique, présent dans des milieux contestataires et très à l'aise avec les outils numériques, il emprunte à des références grecques, nordiques, égyptiennes et autres sans chercher nécessairement à reconstituer une religion antique à l'identique."),
          p("À côté existent sectes, philosophies de fin du monde et communautés trop petites ou trop récentes pour entrer dans les grandes classifications administratives.")
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
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "vie quotidienne", "logement", "alimentation", "mobilité", "santé", "école", "travail", "niveau de vie"],
    sections: [
      {
        id: "logement",
        title: "Se loger",
        level: 2,
        blocks: [
          p("Après les pertes démographiques et migrations, le logement devient plus accessible dans certaines zones alors même que la population s'appauvrit. Beaucoup d'immeubles anciens restent sous-entretenus, mais les technologies de 2030 permettent de les moderniser sans reconstruction complète."),
          p("Surfaces-écrans, papier peint caméléon, hologrammes, serrures électroniques, cuisine automatisée et petits robots d'entretien sont ordinaires. La différence sociale tient moins à l'existence de la technologie qu'à son intégration, sa fiabilité, son entretien et la qualité des abonnements associés.")
        ]
      },
      {
        id: "alimentation",
        title: "Manger",
        level: 2,
        blocks: [
          p("La Californie ne manque généralement plus de calories, mais la nourriture dite traditionnelle est devenue un marqueur de richesse. La ration universelle garantit un minimum ; céréales, algues génétiquement modifiées et protéines d'insectes transformées alimentent la production de masse ; viande et certains végétaux sont largement clonés."),
          table([
            ["Niveau", "Exemples", "Ce que cela raconte"],
            ["Survie", "Ration universelle, céréales de base, eau reconditionnée", "Les besoins essentiels sont couverts sans promettre le plaisir."],
            ["Populaire", "Synthétique d'algues, protéines d'insectes transformées, cloné standard", "La majorité de la restauration quotidienne."],
            ["Confort", "Cloné premium, recettes complexes, produits frais contrôlés", "Le goût et la variété redeviennent importants."],
            ["Luxe", "Agriculture traditionnelle, élevage réel, terroirs, alcools classiques", "La rareté tient au mode de production autant qu'à l'ingrédient."]
          ])
        ]
      },
      {
        id: "mobilite",
        title: "Se déplacer",
        level: 2,
        blocks: [
          p("Les véhicules autonomes privés sont la norme sur les modèles récents. Posséder une voiture n'exige pas de savoir la piloter ; le permis sert surtout à reprendre les commandes hors urgence. Métro et tramway assurent les flux massifs, et les Modules autonomes de service remplacent une partie des bus et taxis."),
          p("Les longues distances sont comprimées par les vactrains très rapides, l'aviation classique et supersonique et des transports spécialisés. Le dernier kilomètre reste pourtant décisif : trois juridictions, un incident de sécurité ou une fermeture corporative peuvent rendre un trajet urbain plus compliqué qu'un voyage entre deux métropoles.")
        ]
      },
      {
        id: "energie-materiaux-robots",
        title: "Énergie, matériaux et automatisation",
        level: 2,
        blocks: [
          p("Fusion, piles à combustible, hydrogène et biocarburants issus d'algues réduisent fortement le rôle du pétrole comme carburant. Batteries cellulaires, polymères biosynthétisés, impression additive et composites vivants brouillent les frontières entre mécanique, chimie et biologie."),
          p("Les robots sont surtout présents dans les usines, conduits, cuisines, ateliers et dispositifs de sécurité plutôt que sous forme humanoïde dans la rue. Les humains surveillent, entretiennent et prennent en charge les situations où l'automatisation échoue.")
        ]
      },
      {
        id: "corps-medecine",
        title: "Le corps ordinaire est devenu négociable",
        level: 2,
        blocks: [
          p("Prothèses, interfaces sensorielles, améliorations médicales, biomodifications et implants utilitaires font partie du paysage. Certaines professions les traitent comme de simples outils de travail ; d'autres personnes les refusent ou ne peuvent pas en assumer l'entretien."),
          p("Le coût d'une augmentation ne s'arrête pas à l'achat : maintenance, assurance, médicaments, mises à jour et financement par l'employeur peuvent transformer le corps en instrument de mobilité sociale autant qu'en source de dette."),
          p("Biotechnologies, organes produits, prothèses avancées et diagnostic automatisé améliorent fortement les chances de survie, mais l'accès détermine vitesse d'intervention, qualité des matériaux, durée de convalescence et possibilité de remplacer plutôt que réparer.")
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
            ["Train de vie", "Habitat typique", "Mobilité et sécurité"],
            ["Précaire / Modeste", "Dortoir, micro-logement, vieux studio, squat ou chambre", "Métro, tram, MAS ponctuel ; sécurité locale inégale."],
            ["Standard", "Studio ancien ou logement connecté simple", "Transports réguliers, vieille voiture ou moto, CityPod financé ; refuge simple."],
            ["Confortable", "Bon appartement connecté ou logement protégé", "VAP familial, moto haut de gamme, mobilité souple ; planque simple."],
            ["Aisé", "Résidence sécurisée de cadre ou grand appartement", "Plusieurs solutions de mobilité et second lieu sécurisé."],
            ["Luxe", "Penthouse, villa, résidence corporative premium", "Véhicules multiples, haute sécurité, plusieurs planques et services à la demande."]
          ]),
          p("Accès n'est pas propriété. Un employé, fonctionnaire ou membre d'une communauté peut utiliser logement, véhicule ou service d'un niveau très supérieur à son patrimoine personnel, puis le perdre en même temps que son statut.")
        ]
      },
      {
        id: "sante-assurance",
        title: "Santé, urgence et assurance",
        level: 2,
        blocks: [
          p("La première question reste souvent : qui paie ? Les identifiants ou dispositifs de santé peuvent transmettre des données vitales et déclencher une alerte. Les réseaux les mieux financés envoient rapidement une équipe équipée pour les zones dangereuses ; les contrats plus faibles se limitent parfois à l'alerte ou au diagnostic à distance."),
          p("L'État surveille épidémies et risques biologiques au travers du CCHS. Les corporations offrent des couvertures à leurs salariés, les institutions religieuses entretiennent des dispensaires, la Pègre finance des cliniques clandestines et les Crawlers connaissent les adresses où l'on soigne avant de demander le nom.")
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
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Holonet", "Logifate", "médias", "mode", "culture", "sports augmentés", "identité"],
    sections: [
      {
        id: "holonet",
        title: "L'Holonet comme environnement social",
        level: 2,
        blocks: [
          p("L'Holonet n'est pas seulement un Internet plus rapide. Communications, médias, services administratifs, commerce, réputation et une part croissante des relations sociales s'y superposent. Logements, véhicules, augmentations, cliniques et institutions peuvent tous être reliés au même écosystème."),
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
        id: "information-attention",
        title: "Information, publicité et confiance",
        level: 2,
        blocks: [
          p("Les Mediacorpos organisent autant l'attention qu'elles ne produisent des contenus. Corporations, partis, institutions religieuses, influenceurs, mafias et mouvements indépendants construisent leurs propres récits. La participation et les consultations sont plus rapides ; la manipulation l'est aussi."),
          p("La censure brutale existe, mais l'inondation est souvent plus efficace : une information peut être techniquement accessible et pratiquement invisible si aucun système ne la montre à la bonne personne."),
          p("Dans ce contexte, la confiance redevient locale. Une source personnelle, un journaliste suivi depuis des années, un fixer, un collègue ou un membre de communauté peut compter davantage qu'un agrégateur prétendument objectif.")
        ]
      },
      {
        id: "mode-identite",
        title: "Mode, apparence et identité visible",
        level: 2,
        blocks: [
          p("Textiles synthétiques changeant de couleur, régulation thermique, tatouages modulables, peaux artificielles, lentilles et cheveux augmentés rendent l'apparence très flexible. La mode corporative transforme cette apparence en langage d'appartenance ; les scènes underground et neopunks privilégient rupture, détournement et visibilité."),
          p("Les augmentations elles-mêmes deviennent un vêtement social : certains cherchent à rendre une prothèse indiscernable, d'autres exhibent articulation, matière, lumière ou interface comme preuve de réussite, d'appartenance ou de choix idéologique."),
          p("La possibilité de changer facilement d'apparence crée aussi de nouvelles pressions : refuser de se modifier peut devenir un choix aussi visible que la transformation.")
        ]
      },
      {
        id: "culture-loisirs",
        title: "Loisirs, culture et spectacle",
        level: 2,
        blocks: [
          p("La culture a explosé dans toutes les directions. Les grands groupes médiatiques disposent de moyens immenses tandis que l'Holonet permet à une personne isolée de diffuser une œuvre sans studio."),
          p("Musique commerciale, analyse de données et artistes-marques coexistent avec rock, rap, descendants neopunks et scènes underground. Certaines œuvres utilisent des fréquences ou sensations destinées aux auditeurs augmentés."),
          p("Cinéma et séries haut de gamme peuvent être parcourus ou ressentis ; le neo-théâtre mêle performance réelle, hologrammes et avatars ; les jeux emploient les mêmes outils. Le rétrogaming reste très vivant, porté par la nostalgie du monde d'avant-guerre.")
        ]
      },
      {
        id: "sports",
        title: "Sports augmentés",
        level: 2,
        blocks: [
          p("Certains circuits limitent strictement les modifications ; d'autres assument la performance augmentée et rapprochent athlètes, fabricants d'implants et sponsors. Des compétitions transmettent directement une partie des sensations de l'athlète au public ; sports de combat et arènes poussent cette logique jusqu'à faire de certains champions de véritables vitrines technologiques.")
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
  { id: "realite-v9-holonet-medias-culture-identite", dataset: "realite-v9", category: "Réalité", group: "Grande Californie & société", groupOrder: 20, subgroup: "Vie quotidienne", subgroupOrder: 40, pageOrder: 20, displayTitle: "Holonet, médias, culture & identité" }
];
