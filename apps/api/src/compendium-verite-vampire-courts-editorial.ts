import { COMPENDIUM_VERITE_VAMPIRE_COURTS_ARTICLES } from "./compendium-verite-vampire-courts-lore.js";

type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };

type Section = {
  id: string;
  title: string;
  level: number;
  blocks: Block[];
};

const lore = (text: string): Block => ({ type: "p", style: "lore", text });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

const COURT_SECTIONS: Record<string, Section[]> = {
  "verite-vampires-krovni-rytsari": [
    {
      id: "fondation-de-la-couronne",
      title: "Fondation de la Couronne de Sang",
      level: 2,
      blocks: [
        lore(
          "La Krovni Rytsari, ou Couronne de Sang, est la plus occidentale des grandes Cours vampiriques. Elle naquit dans l’Antiquité autour d’un héros proto-thrace des Balkans, gardien d’une porte dimensionnelle qui ouvrait sur un royaume amazone."
        ),
        lore(
          "Une inconnue anéantit sa communauté et le royaume amazone. Le héros fut le seul à se relever face à elle ; son baiser lui imposa la marque de Caïn et fit de lui un Vampire. Renommé à plusieurs reprises au fil des siècles, il porte aujourd’hui le nom de Dragoy Skotia, fondateur et roi de la Krovni."
        )
      ]
    },
    {
      id: "deux-heritages",
      title: "L’honneur du roi et les intrigues de l’ombre",
      level: 2,
      blocks: [
        lore(
          "La Cour porte les deux héritages de Dragoy. Celui du guerrier honorable, privé de son peuple et de toute sa famille, a élevé la volonté, la valeur martiale et le respect du serment au rang de vertus cardinales. Certains de ses Vampires préféreraient mourir de soif plutôt que trahir leur parole."
        ),
        lore(
          "L’autre héritage vient de R’Gahanath, dite Awan, qui transforma Dragoy, et d’Hécate, née de leur union. Toutes deux manient les pouvoirs de V’Aagor, l’intrigue et la tromperie. La Krovni rassemble donc aussi certaines des figures les plus retorses des anciennes cours européennes."
        ),
        lore(
          "Ses membres occupent une place centrale dans les légendes occidentales sur les Vampires. Une rumeur fait ainsi de Vlad Dracula un Dhampyr, fils illégitime de Dragoy, vaincu par les Ottomans puis tué à l’époque victorienne."
        )
      ]
    },
    {
      id: "marque-et-politique",
      title: "Marque de Caïn et pouvoir politique",
      level: 2,
      blocks: [
        lore(
          "La Krovni s’insinua très tôt dans la politique européenne. Son influence faillit même porter un Vampire sur le trône pontifical, avant qu’un Ange ne tue le candidat. Cette présence dans les institutions humaines nourrit autant sa puissance que ses rivalités internes."
        ),
        lore(
          "Tous ses membres portent la marque de Caïn. Souvent cachée sous un tatouage, elle sert aussi de signe de reconnaissance. Chaque Vampire prête allégeance à une maison princière et les mariages arrangés servent à consolider les lignages, les clientèles et les alliances."
        )
      ]
    },
    {
      id: "noblesse-et-succession",
      title: "Une société sans roturiers vampiriques",
      level: 2,
      blocks: [
        lore(
          "Tout Vampire de la Krovni est noble, même au plus bas de la hiérarchie. Les fonctions subalternes reviennent aux Moroï et aux Strygoï. L’appartenance à une maison donne donc à chacun une part de pouvoir politique et constitue une protection indispensable."
        ),
        lore(
          "Lorsqu’un noble meurt sans héritier désigné, ses vassaux directs élisent son successeur. Le vote n’est pas anonyme : même un serviteur de rang modeste peut devoir choisir son futur maître et répondre publiquement de ce choix."
        ),
        lore(
          "Les Vampires sont polygames. Un noble peut prendre jusqu’à cinq partenaires, lesquels reçoivent automatiquement le rang immédiatement inférieur au sien. Duels et guerres permettent parfois d’intégrer ainsi un membre d’une autre Cour, même s’il y occupait auparavant un rang supérieur."
        )
      ]
    },
    {
      id: "systeme-quinaire",
      title: "Le système quinaire",
      level: 2,
      blocks: [
        lore(
          "La hiérarchie de la Krovni repose sur des groupes de cinq. Cinq sièges princiers sont attachés aux cinq concubines de Dragoy, qui choisissent parmi leurs enfants le représentant de leur maison. Il existe bien davantage de princes et princesses, mais leur mère doit conquérir l’un de ces sièges pour qu’ils deviennent héritiers."
        ),
        lore(
          "Le « jeu des concubines » désigne la guerre politique entre les épouses du roi. Awan, première épouse, conserve un siège bien qu’elle ne soit pas réellement une Vampire et ne participe pas aux assemblées. Sa fille Hécate, la plus ancienne des princesses, dirige l’inamovible Maison Empusa, surtout composée de Vampires qu’elle a rassemblés. Elle n’eut qu’un autre enfant et le tua elle-même."
        ),
        table([
          ["Rang", "Place dans la hiérarchie"],
          ["Prince ou princesse héritière", "Détient l’un des cinq sièges liés aux concubines."],
          ["Duc ou duchesse", "Cinq maisons ducales peuvent relever de chaque siège princier."],
          ["Marquis ou marquise", "Cinq marquis peuvent relever de chaque maison ducale."],
          ["Comte ou comtesse", "Échelon inférieur du système quinaire."],
          ["Baron ou baronne", "Commande à son tour un groupe de chevaliers."],
          ["Chevalier", "Rang noble le plus bas, généralement accordé même à un héritier déchu."]
        ]),
        lore(
          "Les concubines n’ont pas toujours été elles-mêmes des Vampires : l’union avec un mortel peut produire un Dhampyr. Celui-ci peut devenir prince, mais sa puissance moindre et la mortalité de sa mère fragilisent sa position. Quand elle est remplacée, il redescend dans la hiérarchie : duc, marquis, comte, baron, puis chevalier selon les places disponibles. Le dernier rang d’une maison vaut mieux que l’absence de maison."
        )
      ]
    },
    {
      id: "autorites-de-l-ombre",
      title: "L’Ombre-Pape et la Sauveuse des Ombres",
      level: 2,
      blocks: [
        lore(
          "L’Ombre-Pape n’est pas un Vampire. Cette entité ténébreuse exerce pourtant une autorité cérémonielle comparable à celle que le pape chrétien possédait sur l’ancienne noblesse : les grands mariages et les rites majeurs de la Krovni sollicitent sa présence."
        ),
        lore(
          "Katja, la Sauveuse des Ombres, a récemment pris la tête des Voyageurs et des Deimons. Amie proche de Dragoy, elle est regardée par certains Vampires comme une déesse supérieure venue bénir ceux qu’ils considèrent eux aussi comme des enfants des ombres."
        )
      ]
    }
  ],
  "verite-vampires-alghul-almalakiu": [
    {
      id: "urungad-et-la-premiere-cour",
      title: "Urungad et la première Cour",
      level: 2,
      blocks: [
        lore(
          "L’Alghul Almalakiu, ou Assemblée des Goules, étend son influence du nord de l’Afrique jusqu’à la moitié de l’Asie. Elle apparut en Mésopotamie à l’époque d’Uruk, vers 3500 avant notre ère."
        ),
        lore(
          "L’archivampire Shub-Alghul régnait avec cinq de ses enfants sur les Vampires, les grandes goules, des Deimons et des communautés humaines. Sa cité d’Urungad surpassait alors Uruk par sa richesse et son influence dans le Croissant fertile."
        )
      ]
    },
    {
      id: "chute-et-refondation",
      title: "La chute d’Urungad et la refondation",
      level: 2,
      blocks: [
        lore(
          "Régulièrement attaquée par les Daemons et les Anges, la première Cour provoqua sa propre chute en éveillant Gajh’Shaoggith, le Fléau des Écailles associé à Tiamat. Archivampires et grandes goules dévorèrent sa chair : leur puissance augmenta, mais leur intelligence céda peu à peu à une sauvagerie incontrôlable."
        ),
        lore(
          "Uruk écrasa Urungad et l’effaça de l’Histoire. La Cour se fragmenta ; Radjnishag, une grande goule devenue souveraine, sauva les Vampires et fit creuser une nouvelle cité troglodyte. Ceux qui refusaient de servir encore une archivampire ou une goule finirent par l’assassiner."
        ),
        lore(
          "Au premier millénaire avant notre ère, la reine Manatum consolida l’Alghul. Pour remplacer le souvenir humiliant de Shub-Alghul, elle diffusa le mythe d’Arawn, premier Vampire hypothétique inspiré d’Awan, dont l’ancienne archivampire parlait souvent."
        )
      ]
    },
    {
      id: "savoir-pouvoir-et-anciennete",
      title: "Savoir, pouvoir et ancienneté",
      level: 2,
      blocks: [
        lore(
          "Ancrée au Moyen-Orient, en Mésopotamie et en Égypte, l’Alghul accompagna la Perse, l’empire d’Alexandre puis une partie du monde romain. Ses membres refusent la marque de Caïn et accordent davantage de valeur à l’ancienneté qu’au lignage."
        ),
        lore(
          "La naissance ne fonde pas le rang : un ancien transformé dans la misère peut dépasser un jeune Vampire de sang pur. La Cour ne reconnaît que deux valeurs, le Savoir et le Pouvoir, que les siècles permettent généralement d’accumuler."
        ),
        lore(
          "L’Alghul est moins meurtrière que les autres grandes Cours. Ses rivalités visent la soumission d’un adversaire et le contrôle d’une connaissance ou d’une source de puissance, plutôt que l’assassinat systématique."
        )
      ]
    },
    {
      id: "transformation-et-moroi",
      title: "Transformation et place des Moroï",
      level: 2,
      blocks: [
        lore(
          "La faible fertilité des Vampires et l’indifférence de l’Alghul au lignage favorisent la transformation. Les naissances de sang pur y sont rares, mais la Cour, très ancienne et vieillissante, recrute peu : seuls les génies, les artistes et les talents exceptionnels l’intéressent vraiment, bien davantage que les politiciens ou les guerriers."
        ),
        lore(
          "Les Moroï intelligents occupent un rang plus élevé que dans les autres Cours. Leurs maîtres les enchantent, prolongent parfois leur existence aussi longtemps que la leur et en font les Moroï les plus puissants du monde vampirique, capables d’égaler au moins les jeunes Vampires d’autres factions."
        )
      ]
    },
    {
      id: "masques-et-degres-de-conscience",
      title: "Les Masques et les degrés de conscience",
      level: 2,
      blocks: [
        lore(
          "La reine gouverne par l’intermédiaire de Vizirs, ministres souvent issus d’anciens souverains vaincus ou volontairement soumis. Leur vie, leurs connaissances et leurs pouvoirs sont jugés trop précieux pour être gaspillés. Leur identité reste secrète pour les membres ordinaires et ils paraissent masqués auprès de la reine, d’où leur nom collectif de « Masques »."
        ),
        lore(
          "Chaque Vizir dirige un ministère nommé d’après sa fonction, comme le Masque occulte pour la magie ou le Masque légaliste pour les lois. La Cour organise ainsi l’existence de ceux qu’elle classe encore parmi les Innocents."
        ),
        table([
          ["Degré", "Position dans l’Alghul"],
          ["Innocence", "Moroï et Vampires généralement âgés de moins de cinq siècles."],
          ["Intuition", "Premier accès conscient aux savoirs et pouvoirs de la Cour."],
          ["Connaissance", "Maîtrise reconnue des secrets accumulés."],
          ["Transcendance", "Rang de la reine et des Vizirs."]
        ])
      ]
    },
    {
      id: "le-pouvoir-dans-le-sang",
      title: "Le Vampire comme pouvoir du sang",
      level: 2,
      blocks: [
        lore(
          "Pour l’Alghul, un Vampire n’est pas d’abord un être vivant : le mot désigne un pouvoir contenu dans le sang. Ses membres conservent donc leur sang dans des jarres ou des fioles afin de préparer leur retour après la destruction du corps."
        ),
        lore(
          "Le rituel injecte ce sang dans un captif vampirique d’une autre Cour, choisi pour des dons compatibles, puis remplace progressivement le sang de l’hôte par celui du défunt. Cette pratique réduit la peur de la mort sans effacer la crainte de l’avenir propre à une faction tournée vers le passé."
        ),
        lore(
          "Des momies et d’autres Revenants gardent les cryptes profondes à la place de Veilleurs vampiriques, dont le sacrifice serait impensable. La nécromancie de l’Alghul inquiète jusque chez certains Mages ; ses réincarnations font aussi de plusieurs anciens des êtres plus proches du Revenant que du Vampire, constat qu’il serait dangereux d’énoncer devant eux."
        )
      ]
    },
    {
      id: "diplomatie-de-megda",
      title: "La diplomatie de Megda",
      level: 2,
      blocks: [
        lore(
          "Megda, reine actuelle, entretient des liens avec toutes les grandes Cours malgré leurs divergences. Elle a donné une fille à Dragoy pour répondre au culte du lignage de la Krovni et offert de son sang à Quetzalcoatl, puisque l’Ihuito Meztzi place le sang au centre de son identité."
        ),
        lore(
          "Elle cherche aussi à maintenir un dialogue avec Xinya malgré le mépris de cette dernière. Elle tenta enfin, sans succès, de donner une descendance à Neeba. Cette politique fait d’elle l’une des principales médiatrices d’un monde vampirique profondément divisé."
        )
      ]
    }
  ],
  "verite-vampires-ihuito-meztzi": [
    {
      id: "quetzalcoatl-et-la-conquete-des-ameriques",
      title: "Quetzalcoatl et la conquête des Amériques",
      level: 2,
      blocks: [
        lore(
          "L’Ihuito Meztzi, ou Cour du Sang, couvre les Amériques. Fondée avant les premières civilisations humaines du continent, elle rassemblait dès l’origine des créatures de nombreuses natures autour de Quetzalcoatl."
        ),
        lore(
          "Sous ce nom divin se cache un archivampire, ancien Khinae corrompu par un fragment de V’Aagor. Prédateur particulièrement agressif, il traqua durant des dizaines de millénaires les autres Khinae, surtout ceux que d’autres puissances avaient corrompus, jusqu’à ne laisser sur les continents américains que sa propre lignée vampirique."
        ),
        lore(
          "Quetzalcoatl s’allia aux Kochtchei, notamment à l’Ancienne, qui l’aida à éliminer ses rivaux et repoussa vers le nord les Khinae restés intacts. Elle lui apprit aussi à employer ses pouvoirs de V’Aagor pour emprisonner le Mageius de Brimhild, ancienne Dive et fille d’Ymir."
        )
      ]
    },
    {
      id: "un-dieu-parmi-les-mortels",
      title: "Un dieu parmi les mortels",
      level: 2,
      blocks: [
        lore(
          "Renforcé par ce Mageius, ses dons khinae et les innombrables créatures qu’il avait dévorées, Quetzalcoatl se fit adorer comme une divinité. Il ne se cacha ni des dieux ni du soleil et imposa le socle de nombreux cultes précolombiens liés au sang."
        ),
        lore(
          "Le Mageius le protège du soleil, le culte du sang mobilise ses fidèles contre les dieux et les grandes cités forment un réseau magique qui isole une partie de l’Amérique du Sud de l’influence des Mages et d’autres Inhumains. Les dieux redoutent surtout qu’un Prophète porteur d’un attribut divin y soit vampirisé, ou qu’il naisse Vampire de sang pur."
        )
      ]
    },
    {
      id: "cycle-du-sang",
      title: "Le Cycle du sang",
      level: 2,
      blocks: [
        lore(
          "Quetzalcoatl est le plus fertile des Vampires. Ancêtre des lignées vampiriques d’Amérique centrale et du Sud, il compte aussi parmi les lointains géniteurs de nombreux Garous et hommes-jaguars issus des Khinae."
        ),
        lore(
          "Le Cycle du sang relie toute la Cour à son souverain. Chaque Vampire de l’Ihuito descend de Quetzalcoatl, ou fut transformé par l’un de ses descendants, et peut devenir le corps du dieu vampirique. Celui-ci fusionne alors avec l’hôte et assimile entièrement son être."
        ),
        lore(
          "Métamorphe, Quetzalcoatl adopte d’innombrables formes humaines ou animales, dont celle du serpent à plumes. Il engendre sous des apparences masculines ou féminines et s’est même déjà autofécondé. À force de dévorer des émissaires de V’Aagor, il est devenu lui-même un fragment du Fléau ; l’Ihuito ne vénère donc que lui."
        )
      ]
    },
    {
      id: "seigneurs-et-hauts-pretres",
      title: "Seigneurs divins et hauts-prêtres",
      level: 2,
      blocks: [
        lore(
          "Les héritiers qui siègent à la Cour sont peu nombreux et chacun dirige une Maison militaire ou religieuse. Tous peuvent être choisis comme corps de Quetzalcoatl : certains considèrent cette fusion comme l’accomplissement suprême, d’autres la redoutent comme une mort."
        ),
        table([
          ["Titre", "Fonction"],
          ["K’uhul Ajaw", "Seigneur divin, héritier guerrier et commandant d’une armée de l’Ihuito."],
          ["Ah’kin Ajaw", "Haut-prêtre chargé du sang, d’une communauté religieuse et de ses sanctuaires."]
        ]),
        lore(
          "Les Ah’kin sont des Veilleurs par principe. Ensevelis dans des temples, cryptes ou souterrains oubliés, ils gouvernent des Maisons de gardiens, cultivent pouvoirs et savoirs, et surveillent des Vampires ennemis comme des entités immortelles emprisonnées, notamment des Dives ou des Mages. Leurs domaines sont redoutés jusque par les K’uhul."
        )
      ]
    },
    {
      id: "armees-du-sang",
      title: "Les armées du Sang",
      level: 2,
      blocks: [
        lore(
          "La Cour privilégie la puissance et la pureté du sang. Elle purge souvent les Dhampyrs et les Moroï, puis appuie ses Maisons sur des Strygoï noires, d’autres Revenants, des Deimons et des Voyageurs corrompus. Presque chaque K’uhul Ajaw chevauche un Hellghest et confie la garde de sa Maison à une momie façonnée par de complexes rites funéraires."
        ),
        lore(
          "L’autorité spirituelle des Ah’kin l’emporte lorsqu’apparaît un mauvais présage. Un haut-prêtre fit autrefois sacrifier un K’uhul et toute sa Maison : ce cas exceptionnel restaura une part de la puissance de Quetzalcoatl et éleva la Maison religieuse au détriment de sa rivale."
        ),
        lore(
          "La violence de l’Ihuito ne produit pourtant pas la même guerre de succession que dans la Krovni. Chaque K’uhul peut devenir Quetzalcoatl, mais aucun ne remplacera jamais le souverain. La place royale n’est donc pas disputée."
        )
      ]
    },
    {
      id: "guerres-et-expansion",
      title: "Guerres vampiriques et expansion",
      level: 2,
      blocks: [
        lore(
          "La Krovni redoute une nouvelle guerre comme celle de 1800. La Nemma Moogura, puissante Cour australienne menée par Jurooga, attaqua alors les implantations krovni liées à la colonisation. La reine remonta ensuite vers l’Indonésie et la Thaïlande, où elle affronta les Vampires asiatiques ; l’alliance Krovni–Shì Hun Zhe finit par anéantir sa Cour."
        ),
        lore(
          "Les seigneurs de l’Ihuito ne partagent pas cette prudence. Ils se préservent entre eux, mais attaquent presque à vue les Vampires étrangers pour les soumettre. Ils se pensent chacun rois au service d’un dieu et restent incompatibles avec les autres Cours."
        ),
        lore(
          "Autarcique et mal considérée, l’Ihuito agit dans la Réalité par les cartels, les gangs et les mouvements insurgés. Elle domine les Amériques, opère dans le Pacifique et s’étend en Afrique du Sud, devenue avec la Californie l’un des principaux fronts où s’affrontent les factions vampiriques."
        )
      ]
    }
  ],
  "verite-vampires-oru-ayeraye": [
    {
      id: "les-trois-cours-africaines",
      title: "Les trois grandes Cours africaines",
      level: 2,
      blocks: [
        lore(
          "L’Oru Ayeraye, ou Cour des Ténèbres, couvre l’Afrique et les îles voisines, dont Madagascar. Les premiers Vampires issus de lignées humaines apparurent vraisemblablement sur ce continent, longtemps partagé entre des milliers de petites Cours rivales."
        ),
        lore(
          "Trois puissances dominaient : Ọna ti ẹjẹ dans l’actuel Ghana, Meno ya vusiku au Mozambique et Mbula ya Makila en Centrafrique. Leur alliance entreprit de soumettre les autres Cours et d’éliminer les lignées venues de Khinae corrompus par Vhodhal, Shaoggith ou Thul, plutôt que par les Ténèbres."
        )
      ]
    },
    {
      id: "oluwasegun-et-la-guerre-du-tyran",
      title: "Oluwasegun et la guerre du Tyran",
      level: 2,
      blocks: [
        lore(
          "Le dernier archivampire de l’alliance engendra Oluwasegun, Oba Okunkun — roi des Ténèbres ou roi des Deimons — capable d’imposer sa volonté à ces créatures. Les souverains le maintinrent artificiellement dans l’enfance afin qu’il ne puisse ni ambitionner davantage ni se reproduire."
        ),
        lore(
          "Le Khinae corrompu Kragen sortit alors d’un long sommeil. Les trois Cours lui opposèrent leur champion, mais il déchira l’enfant dès la première attaque et absorba son énergie ténébreuse. La guerre du Tyran opposa ensuite les Vampires restés libres à ceux que Kragen avait asservis."
        ),
        lore(
          "Kragen déterra et réveilla Loredana, une autre Khinae corrompue. Des Mages finirent par l’enfermer, laissant les Cours exsangues face à cette nouvelle menace. Deux siècles après sa défaite, Oluwasegun reparut adulte : abandonné par ses créateurs, il n’était plus soumis à leurs sorts et les traîtres l’accueillirent comme un sauveur."
        ),
        lore(
          "Envoyé contre Loredana, Oluwasegun choisit de s’allier à elle pour se venger des trois Cours. Il l’enferma ensuite par surprise et s’installa comme souverain de l’unique grande Cour africaine."
        )
      ]
    },
    {
      id: "naissance-de-la-fontaine",
      title: "Naissance de la Fontaine des Ténèbres",
      level: 2,
      blocks: [
        lore(
          "Olugbenga, roi déchu d’Ọna ti ẹjẹ, céda sa couronne à son fils puis se sacrifia pour invoquer Osh’bawa, nom donné à V’Aagor. Le rite fit venir N’sa’Aagor, une ancienne engeance du Fléau, mais celle-ci attira R’Gahanath, autre fille de V’Aagor."
        ),
        lore(
          "R’Gahanath transforma N’sa’Aagor en une matière liquide et amorphe. Olayinka, jeune prêtresse des Ténèbres, recueillit cette substance dans un puits. Chaque nuit, l’essence du Fléau y suintait ; les animaux et les Moroï qu’elle y jetait devenaient des Strygoï noires."
        ),
        lore(
          "Olayinka but elle-même la substance, fonda le culte de la Fontaine des Ténèbres et s’en proclama archevêque. Elle transforma un mouvement de résistance secret et marginal en une puissance capable d’affronter Oluwasegun."
        )
      ]
    },
    {
      id: "avènement-de-neeba",
      title: "L’avènement de Neeba",
      level: 2,
      blocks: [
        lore(
          "Olayinka captura Ade, plus jeune fille d’Oluwasegun et de Loredana. Elle l’asservit, la plongea chaque jour dans la Fontaine et la saigna avant que sa conscience ne disparaisse, puis l’offrit au nouveau roi. Ade donna naissance à Neeba avant de tomber en cendres."
        ),
        lore(
          "Petit-fils d’Oluwasegun et de Loredana, Neeba fut à son tour plongé dans la Fontaine. Olayinka l’éleva et dosa cette immersion sans le rendre fou, jusqu’à faire de lui le Vampire le plus puissant qu’elle connaissait. Il massacra son grand-père et reprit le titre d’Oba Okunkun."
        ),
        lore(
          "Neeba laissa une autonomie aux Cours lointaines, mais réunit les trois puissances historiques au sein de l’Oru Ayeraye. Son règne mit fin à près de dix millénaires de conflits entre les grandes factions vampiriques africaines."
        )
      ]
    },
    {
      id: "maisons-et-deimons",
      title: "Maisons, lignages et Deimons",
      level: 2,
      blocks: [
        lore(
          "Chaque Maison de l’Oru se rattache à un très ancien Deimon créé par le Khinae corrompu dont elle descend. Le lignage compte, mais la maîtrise des Ténèbres compte davantage encore."
        ),
        lore(
          "Une Maison domine ainsi un type de Deimon qui lui est propre. Ces créatures d’ombre sont polymorphes et leur apparence varie selon la synergie qui les unit au Vampire. Ce lien n’assure pas toujours la domination : certains Deimons se servent de leur maître autant qu’ils le servent."
        ),
        lore(
          "Neenymah, héritier de l’Ihuito, a par exemple volé son Deimon à un seigneur de l’Oru. Pour le conserver, il doit désormais partager son propre corps avec la créature."
        )
      ]
    },
    {
      id: "culte-oshiba-et-sang-oshirique",
      title: "Le culte d’Osh’bawa et le sang Oshirique",
      level: 2,
      blocks: [
        lore(
          "Les membres de l’Oru doivent une forte obédience au culte d’Osh’bawa et à sa manifestation, la Fontaine des Ténèbres. Olayinka en est la Veilleuse suprême ; son autorité approche celle du roi et elle se fait parfois appeler Olayink’aagor, comme si elle incarnait elle-même la Fontaine."
        ),
        lore(
          "Les Vampires Oshiriques remplacent leur sang vampirique par celui de la Fontaine noire. Ils perdent leurs dons de sang natifs, mais gagnent les pouvoirs de la Fontaine et une force physique accrue. Ils ne peuvent plus se rassasier que de ce qu’elle produit, ou d’une victime qui y a d’abord été plongée."
        ),
        lore(
          "Les prêtres et les paladins de la Fontaine sont souvent Oshiriques. Cette transformation les rend plus étroitement dépendants du culte et de son sanctuaire que ne le sont les autres membres de la Cour."
        )
      ]
    },
    {
      id: "cour-royale-et-identite",
      title: "Cour royale, héritage et diplomatie",
      level: 2,
      blocks: [
        lore(
          "Neeba possède de nombreuses reines, mais sa nature complexe le rend presque stérile, ce qui constitue une profonde honte dans l’Oru. Seules trois reines, celles qui ont enfanté, disposent d’un statut supérieur ; aucun de leurs enfants n’a pourtant survécu plus de quelques jours."
        ),
        lore(
          "Les membres de l’Oru se pensent plus nobles et plus purs que les autres Vampires. Ils invoquent l’ancienneté de leur histoire, des origines qu’ils jugent plus valeureuses et l’absence de consanguinité ou de déviation du chemin ancestral."
        ),
        lore(
          "Ce sentiment nourrit leur mépris pour les autres Cours sans interdire toute négociation. L’Alghul peut notamment devenir une alliée lorsque leurs intérêts convergent."
        )
      ]
    }
  ],
  "verite-vampires-shi-hun-zhe": [
    {
      id: "xinya-et-les-premiers-vampires-orientaux",
      title: "Xinya et les premiers Vampires orientaux",
      level: 2,
      blocks: [
        lore(
          "La Shì Hun Zhe, ou Cour des Anciens, couvre principalement l’Extrême-Orient. Les Vampires orientaux ne formèrent d’abord aucune Cour commune : ils parasitaient des clans humains ou surnaturels et s’inséraient dans les grandes familles du continent eurasiatique. Xinya influença ainsi l’histoire de la Chine, de la Mongolie, du Japon et de la Corée."
        ),
        lore(
          "Dans un passé très ancien, l’archivampire Xinya fut fécondée en songe par V’Aagor. Les engeances d’ombre du Fléau possédèrent des descendants de Khinae et formèrent sa première lignée. Comme une reine fourmi, elle produisait de nouvelles créatures chaque fois qu’elle rêvait de son maître."
        ),
        lore(
          "Xinya imposa progressivement les Vampires de V’Aagor aux lignées issues d’autres Fléaux. Sachant toutefois ses fils plus puissants qu’elle, elle détourna leur ambition vers les Dives corrompus. Les Hēi’àn zhīzǐ, ou fils des Ténèbres, réveillèrent ainsi des entités trop anciennes et furent presque tous détruits."
        )
      ]
    },
    {
      id: "guerre-des-dives-et-xinyagor",
      title: "La guerre des Dives et Xiny’Aagor",
      level: 2,
      blocks: [
        lore(
          "Pendant que ses fils disparaissaient, Xinya complota avec les premiers Mages, qui s’allièrent aux Vampires contre les Dives et récupérèrent leurs Mageius. Elle organisa ainsi la destruction de ses propres engeances, puis leur vengeance par les Mages."
        ),
        lore(
          "Ravana, fils d’Ymir et puissant roi de l’Est, renversa pourtant la guerre en dévorant un grand nombre de Mages. Anahita, Archimage et amie de Xinya, le scella afin d’arrêter les combats."
        ),
        lore(
          "Xinya absorba alors l’essence de ses fils et devint Xiny’Aagor, puissant fragment de V’Aagor, avant de s’endormir. Depuis ses songes, elle continua à manipuler les rois vampiriques et leurs Cours calquées sur les institutions humaines, orientant guerres et décisions politiques."
        )
      ]
    },
    {
      id: "defaite-et-taoisme-primaire",
      title: "La défaite de 590 et le taoïsme primaire",
      level: 2,
      blocks: [
        lore(
          "En 590 avant notre ère, une invasion de l’Alghul infligea une lourde défaite aux Vampires des steppes. Le roi Bozheng réveilla Xinya ; elle le dévora pour se régénérer, repoussa les envoyés ennemis et constata que les membres de l’Alghul savaient dépasser les seuls dons du sang."
        ),
        lore(
          "Pour corriger cette faiblesse, elle fit travailler d’innombrables serviteurs humains, dont plus tard Laozi, sur les Hun et les Po de l’âme ainsi que sur le Yin et le Yang. Ces recherches nourrirent un taoïsme primaire et permirent aux Vampires d’absorber le Yang de leurs victimes et de dévorer les Hun afin de compenser leur nature exclusivement Yin."
        ),
        lore(
          "Xinya poussa ensuite Qin Shi Huang à conquérir les royaumes et à former le premier empire chinois. L’unification devait aussi répandre ces doctrines parmi les Cours vampiriques les plus influentes."
        )
      ]
    },
    {
      id: "naissance-de-la-cour-imperiale",
      title: "Naissance de la Cour impériale",
      level: 2,
      blocks: [
        lore(
          "Sous le premier empire Qin, Xinya forma sa première Cour véritable. Elle occupait alors la fonction de Taiyinying, ministre de l’Ombre auprès de la Cour impériale, et son organisation vampirique constituait son propre ministère."
        ),
        lore(
          "Sous les Han postérieurs, elle rendit cette Cour indépendante des institutions humaines afin de gouverner au-delà des frontières de l’empire. La Shì Hun Zhe prit réellement forme en 185, avec la chute de la Cour Zhu Ting et la soumission du redoutable Vampire Xunhao."
        ),
        lore(
          "Xinya adapta l’administration impériale chinoise. Cette architecture resta en place jusqu’en 2035 et subordonna les grandes Maisons à une autorité commune, faisant de la Shì Hun Zhe la plus structurée et la plus unie des grandes Cours."
        )
      ]
    },
    {
      id: "trois-excellences-et-huit-ministres",
      title: "Les Trois Excellences et les huit ministres",
      level: 2,
      blocks: [
        lore(
          "L’impératrice domine les Trois Excellences : le grand chancelier, le grand conseiller et le grand commandant. Huit ministres administrent ensuite la Cour."
        ),
        table([
          ["Ministère", "Attributions"],
          ["Cérémonies", "Religion, divination et magie de la Cour."],
          ["Maison", "Sécurité de l’impératrice, de la Cour et de ses sanctuaires."],
          ["Gardes", "Élite guerrière chargée de défendre les intérêts vampiriques et d’exécuter les ordres punitifs du grand commandant."],
          ["Serviteurs", "Troupeaux humains et Armurerie ; autorisation exclusive d’employer les armes alchimiques créées par les Mages et alchimistes."],
          ["Justice", "Juge suprême, pouvoir de grâce et direction de la grande prison de la Vérité dont les captifs renforcent la Cour."],
          ["Héraut", "Diplomatie entre factions et représentation de l’impératrice, qui ne se déplace pas auprès d’un simple roi."],
          ["Finances", "Trésor commun, répartition des biens et perception mensuelle d’un impôt en sang humain."],
          ["Intendant", "Maison personnelle, santé, esclaves et attribution des « Trésors » du harem impérial aux serviteurs récompensés."]
        ]),
        lore(
          "Aucun Vampire ne possède librement sa fortune : revenus, infrastructures et biens appartiennent à la Cour, qui lui en laisse l’usage tant que le ministre des Finances ne les réaffecte pas. Ce collectivisme précède de très loin Mao, autre dirigeant humain conseillé par Xinya."
        )
      ]
    },
    {
      id: "unite-et-diplomatie",
      title: "Unité et diplomatie",
      level: 2,
      blocks: [
        lore(
          "Les grandes Maisons subsistent, mais restent soumises au système impérial. Cette discipline distingue la Shì Hun Zhe des Cours où lignages et ambitions princières menacent sans cesse l’autorité centrale."
        ),
        lore(
          "Xinya entretient des rapports relativement corrects avec Megda et plus distants avec Dragoy. Elle déteste Neeba et Quetzalcoatl, qu’elle considère comme des bêtes sanguinaires. Elle haïssait aussi Jurooga et prit un grand plaisir à participer à l’anéantissement de sa Cour australienne."
        )
      ]
    }
  ],
  "verite-vampires-cours-secondaires": [
    {
      id: "des-cours-sans-couronne-reconnue",
      title: "Des Cours sans couronne reconnue",
      level: 2,
      blocks: [
        lore(
          "L’individualisme vampirique interdit de réduire le monde à cinq factions. Les grandes Cours actuelles se sont formées en ralliant ou assimilant des rivales, en les soumettant et redistribuant leurs membres, ou plus rarement en les exterminant."
        ),
        lore(
          "Les cinq puissances reconnaissent parfois l’existence d’une faction secondaire sans reconnaître la royauté de son dirigeant. Anciennes Cours vaincues, jeunes organisations et lignées vouées à un Fléau forment ainsi près d’une centaine de cas différents."
        )
      ]
    },
    {
      id: "un-rapport-de-forces-ecrasant",
      title: "Un rapport de forces écrasant",
      level: 2,
      blocks: [
        lore(
          "Le système quinaire permet d’estimer la Krovni à environ vingt mille Vampires : cinq grandes Maisons, chacune divisée en cinq maisons ducales, puis cinq marquis, cinq comtes, cinq barons et généralement deux à dix chevaliers. Les autres grandes Cours se situent dans un ordre de grandeur comparable."
        ),
        lore(
          "Une Cour officieuse compte moins d’un millier de membres, parfois à peine une centaine. Même remarquables, ses agents n’ont aucune chance dans une guerre ouverte contre une grande puissance ; la discrétion constitue donc leur première défense."
        )
      ]
    },
    {
      id: "heritages-de-cours-defaites",
      title: "Héritages de Cours défaites",
      level: 2,
      blocks: [
        lore(
          "L’Elfenbeinblut, ou Sang d’Ivoire, dérive de la Krovni mais fut corrompue par Vhodhal. Sa faim destructrice la rapproche des Wendigos, autres abominations liées au même Fléau."
        ),
        lore(
          "Les vestiges de la Nemma Moogura perpétuent une Cour australienne autrefois maîtresse d’un vaste domaine. L’alliance Krovni–Shì Hun Zhe la décima afin de la démembrer et de faire disparaître le Sang du Rêve, pouvoir jugé trop dangereux."
        )
      ]
    },
    {
      id: "cours-atypiques-et-micro-cours",
      title: "Cours atypiques et micro-Cours",
      level: 2,
      blocks: [
        lore(
          "Les Lavandières travaillent sans distinction de Cour : elles effacent les traces laissées par les autres Vampires et chassent ceux dont la destruction devient nécessaire. Leur organisation fait l’objet d’une page distincte."
        ),
        lore(
          "La Cour de l’Ombre-Monde réunit des Veilleurs et des abominations difformes prisonniers de cette dimension. Ses membres refusent d’en sortir autant qu’ils attaquent ce qui tente d’y pénétrer."
        ),
        lore(
          "D’autres groupes ne sont guère plus que des Cours autoproclamées. La Notte Nostra rassemble des mafieux renégats de la Krovni ; la Ditele Cayla descend des restes de l’ancienne Cour de Kragen et Loredana qui refusèrent l’autorité de l’Oru Ayeraye."
        )
      ]
    }
  ]
};

export const COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES =
  COMPENDIUM_VERITE_VAMPIRE_COURTS_ARTICLES.map((article) => ({
    ...article,
    sections: COURT_SECTIONS[article.id] ?? article.sections
  })) as Array<Record<string, any>>;
