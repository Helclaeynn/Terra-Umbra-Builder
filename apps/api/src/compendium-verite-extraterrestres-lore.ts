type Block = { type: "p"; text: string } | { type: "table"; rows: unknown[][] };
type Section = { id: string; title: string; level: number; blocks: Block[] };
type Article = { id: string; dataset: string; category: string; sourceCategory: string; title: string; source: string; status: string; rebuildV2: true; tags: string[]; sections: Section[] };

export const COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES = [
  {
    "id": "verite-extrals-talass-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "sourceCategory": "Vérité",
    "title": "Talass — physiologie, Talwa’Etax & factions",
    "source": "TUC_Vérité_ les espèces  extraterrestres(1).docx",
    "status": "canon_source",
    "rebuildV2": true,
    "tags": [
      "Vérité",
      "Extrals",
      "Talass",
      "GAAC",
      "CTU",
      "SRA",
      "Émeraude Sanglante"
    ],
    "sections": [
      {
        "id": "description",
        "title": "Description",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Talass sont une espèce galactique, c’est-dire qu’on les retrouve aisément dans une vaste partie de la galaxie. Ils appartiennent aux extraterrestres « fongiformes », c’est-à-dire qu’ils ont pour origine des formes très répandues de champignons chlorophylliens du monde Tallassena. Physiquement, on les penserait plus proche d’un mélange de reptiloïde ou d’insectoïde, avec leur petite taille d’environ 1.15 m et leur corps assez fin d’apparence, ils donnent une fausse impression d’extrême faiblesse."
          },
          {
            "type": "p",
            "text": "Ils vivent 1200 ans pour ceux dans l’espace, mais seulement 200 ans sur Terre, la chimie de l’air et de la nourriture, la génétique aussi, tout menant à ce que les Talas terrestres aient une espérance de vie bien plus courte sans que ça ne les dérange. Leur crane est allongé et ils ont de très grands yeux, une apparence qui aurait inspiré l’image typique du petit alien vert à grosse tête que les humains en ont sur Terre. Le corps des Talass est creux, ils ne pèsent que 25 kg dont l’essentiel du poids se situe dans leurs tissus musculaires, ils ont très peu de fluide dans leur corps en dehors de leur cerveau."
          },
          {
            "type": "p",
            "text": "Ils sont capables de tisser de la soie avec leurs mains, leurs deux queues et leurs pieds, cette soie est extrêmement conductrice que ce soit en électricité, magie ou en pouvoir psychique. Les Talass ont une anatomie segmentaire, la tête, les bras jusqu’aux poignets, le torse et le bassin forme un segment, chaque main puis chaque phalange, chaque cuisse, chaque morceau de queue est un segment à part, hormis le segment « vital », ils peuvent se faire arracher les autres sans ne subir aucune douleur, en revanche, cela ne repousse pas naturellement, donc ils n’apprécient pas vraiment quand ça arrive."
          },
          {
            "type": "p",
            "text": "Le « segment vital » est le seul qui possède un génome propre, les segments détachables sont dotés d’un ADN neutre, commun à tous les Talass, qui peuvent se les échanger, tels des personnages de lego. Ni mâles ni femelles étant des champignons, ils se clonent en s’échangeant un segment de queue où ils ont injecté des cellules de leur « segment vital », qu’un autre talass portera et éduquera. Les Talass ne sont pas grands et son très légers, leur corps est assez dur mais il se casse, et bien que les Talass ressentent peu la douleur, ils ne régénèrent pas, la moindre blessure est handicapante sans soin."
          },
          {
            "type": "p",
            "text": "En revanche, ils sont d’une agilité prodigieuse, capable de faire des bonds de plusieurs mètres tels des rainettes, ils sont encore plus insaisissables en apesanteur, pouvant ressembler à des balles rebondissantes à sauter de paroi en paroi, s’y accrochant avec leur soie électro-magnétique et leurs doigts proches de ceux des geckos terrestres. Leurs capacités physiques en dehors de leur agilité et de leurs bonds, sont assez en dessous de celles humaines, en revanche, ils ont un QI bien plus élevé de base, et bien moins émotifs, ils ont un sang froid prodigieux, comme s’ils étaient de petits robots biologiques."
          },
          {
            "type": "p",
            "text": "Physiquement, les Talass sont plus ou moins presque tous des clones d’individus ancestraux, alors sans spécisme, il s’agit d’une des espèces pour laquelle « tous les individus se ressemblent », les Talass ont d’ailleurs conscience qu’il est difficile de les distinguer, certains cherchant à se détacher par des singularités, sur Terre, cela donne parfois des Talass se revendiquant mâles ou femelles, se colorant la peau ou se tatouant à outrance"
          }
        ]
      },
      {
        "id": "recurrences",
        "title": "Récurrences",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Talass répugnent le combat ou les activités violentes, ils affectionnent les activités intellectuelles, techniques voire scientifiques, en revanche, ils n’ont aucun sens artistique. On les retrouvera donc à des postes scientifiques ou de bureau, ils font des salariés modèles. Les Talass de la Terre sont toutefois plus imprégnés de la culture humaine, les Talass terriens sont d’excellents politiciens et débateurs et apprécient ce qui touche à la gouvernance, pouvant se montrer assez vicieux, leur manque d’émotivité faisant de certains de vrais psychopathes sans pitié."
          }
        ]
      },
      {
        "id": "capacites-inhumaines",
        "title": "Capacités inhumaines",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Talass sont des extraterrestres, anatomiquement, ils disposent de capacités inhumaines. La première de ces capacités est celle de tisser de la soie, des fils très peu visibles et collant avec lesquels ils peuvent faire passer un courant ou leur pouvoir psychique, ils peuvent aussi s’en servir pour faire quelques fils plus épais, mais rien d’utilisable pour tirer leur propre corps et encore moins pour arrêter le moindre objet. La seconde capacité des talass est leur aptitude à bondir, peu importe leur athlétisme, tous les Talass sont instinctivement capable d’effectuer des bonds prodigieux sans élan, ils n’en font pas des milliers toutefois, dépendant de leur endurance, ce sont des bonds désespérés qui épuisent leurs jambes, une fois leur limite atteinte, ils risquent de perdre ces dernières après un ultime bond, leurs jambes se détachant simplement, mortes."
          },
          {
            "type": "p",
            "text": "La troisième compétence des Talass est de grimper sur les parois, même assez lisses, comme des hommes-araignées nains, ils grimpent sur les murs sans trop de soucis, même si culturellement, ils ne le font que peu, trouvant cela « barbare ». Les Talass sont capables de voir les « fluctuations » de l’espace-temps, c’est-à-dire les brèches dimensionnelles ou résidus du Néant, même quand ils sont invisibles, sur Terres, ils s’en servent pour éviter d’instinct des zones habitées dans la Vérité par des espèces surnaturelles ou fantastiques, ignorant qu’elles existent et ne voulant pas le savoir."
          },
          {
            "type": "p",
            "text": "Ils sont souvent les premiers à expliquer que les elfes et les vampires ne peuvent pas exister statistiquement, les talass visitant la Terre depuis assez longtemps, ils en auraient trouvé et disséquer certainement. Le dernier pouvoir des talass est nommé « Talwa’Etax », il s’agit d’une force psychique, une télékinésie puissante couplée à de la télépathie. Ce pouvoir se manifeste par la capacité de scanner l’environnement avant de pouvoir fonctionner, une façon de ne jamais se perdre et d’être assez peu surpris, une fois un talass ayant projeté son « Talwa » dans une zone, même avec une grande furtivité, tout déplacement sera perçu, car il sera porteur d’une entropie, du « chaos » ce que les Talass détestent et surveillent avec méfiance."
          }
        ]
      },
      {
        "id": "organisation",
        "title": "Organisation",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Talass sont incroyablement aptes à se mélanger dans tous les sociétés extraterrestres et forcément terrestres, bien qu’ils apparaissent comme un peu froids, ils sont généralement appréciés dans les groupes pour leur sérieux. Dans la Vérité, il existe quatre grandes factions Talass. La première faction est « L’Alliance mondiale des ressortissants extraterrestres » (Global Alliance of Alien Citizens : GAAC). C’est une sorte de “nations unies” des aliens où chaque communauté aliens possède deux sièges pour les 5 grandes espèces les plus représentées et 1 siège pour les autres, de même, l’AIDH y possède la présidence, les humains extraterrestres s’intégrant mieux mais n’ont pas pour autant un statut de terrien véritable."
          },
          {
            "type": "p",
            "text": "La seconde faction Talasse est l’Union Talasse Californienne (CTU), elle a pour but de s’insinuer dans les institutions scientifiques de Californie afin de pousser le progrès scientifique et de rattraper le retard terrestre sur la moyenne des autres mondes technologiques. Certains autres extraterrestres disent que le « C » de CTU était un K avant la guerre de 2022 et que les Talass seraient derrière le progrès Coréen ayant initié le grand conflit. Le GAAC est assez peu allié au CTU de plus, le but de la première organisation est de rendre les aliens terrestres prospères, leur offrir le plus de chance de s’acclimater à la Terre, de s’intégrer aux humains et à leurs cultures, le but de la seconde organisation est de pousser les humains vers des standards extraterrestres, au contraire de s’intégrer, d’Intégrer la Terre dans le cadres des Mondes Technologiques."
          },
          {
            "type": "p",
            "text": "On les retrouve ainsi énormément dans les cultes de l’Eglise cybernétique également pour pousser vers ce but. La troisième faction est « l’agence de recherche sur l’Ombre » (Shadow Research Agency : SRA), C’est une agence secrète d’aliens et d’humains des MT qui ont été mis en contact avec des manifestations de l’Ombre-monde ou des manifestations de Fléau, le but de ces agences est d’enquêter pour savoir ce qui se cache et déterminer si ces sources d’énergies sont utilisables ou non, si la menace est réelle ou non."
          },
          {
            "type": "p",
            "text": "La dernière faction Talasse est « L’émeraude sanglante », une faction militaire qui était autrefois connue dans la galaxie comme la seule armée Talasse. Historiquement, la conquête spatiale des talass a été pacifique, ils quittèrent leur monde sur d’immenses vaisseaux, des bulles de Soie qui voyageaient grâce à d’immenses voiles solaires. Ils ont changé de technologie par l’échange, mais n’ont jamais cherché à se venger des espèces les ayant broyé et pillé, de nombreuses grandes colonies spatiales des Talass ont été très aisément saccagées et la nature Talasse a toujours été d’aller de l’avant, sans haine… mais pour certains représentants de l’espèce, ce n’était pas une option."
          },
          {
            "type": "p",
            "text": "Imprégnés des Humains, ces talass ont décidé de se venger. La flotte était terrifiante et même les soldats Talass, une fois équipés de bioarmures telles que les Zaabors ou les orpacyors peuvent en produire, devenaient de prodigieux combattants, ne craignant pas la douleur, très peu la peur et n’ayant pas de dégout pour la violence. L’AIDH a officiellement décrété cette faction détruite quand le gros de la flotte s’attaqua à une planète Ad’rak, mais sur Terre, les survivants talass demeurent. Ils traquent essentiellement les Ad’rak et les Greys, deux races dangereuses."
          },
          {
            "type": "p",
            "text": "Ils se dissimulent de la Réalité, n’ayant que faire du jeu de l’AIDH, ils ne veulent que venger les milliards de leurs frères massacrés sur les différents mondes pillés. Si pour beaucoup, l’idée d’un talass guerrier est une blague quand on les connait, ceux qui les ont croisés n’ont plus de mépris ni de rictus à cette idée."
          }
        ]
      }
    ]
  },
  {
    "id": "verite-extrals-mosens-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "sourceCategory": "Vérité",
    "title": "Mo’sens — physiologie, Mosenine & REPTILE",
    "source": "TUC_Vérité_ les espèces  extraterrestres(1).docx",
    "status": "canon_source",
    "rebuildV2": true,
    "tags": [
      "Vérité",
      "Extrals",
      "Mo’sens",
      "REPTILE",
      "Saeniaforming Army",
      "Brotherhood of Hate"
    ],
    "sections": [
      {
        "id": "description",
        "title": "Description",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Mo’sens sont une espèce galactique, c’est-dire qu’on les retrouve aisément dans une vaste partie de la galaxie. Ils appartiennent aux extraterrestres « Reptiloïdes», c’est-à-dire qu’ils ont pour origine des formes de vie similaires aux reptiles qu’on peut croiser sur Terre. Ils mesurent entre 1.50 et 2.10 m, pèsent entre 95 kg et 250 kg,k ils ont une ossature robuste et une musculature dense mais ne manquent pas pour autant d’agilité. Physiquement, ce sont de de grands Humanoïdes, d’un peu moins de deux mètres, assez carrés et robustes, ils ont un corps couvert d’écailles et d’ostéodermes solides."
          },
          {
            "type": "p",
            "text": "Leur tête est similaire à un mélange de lézard, de crocodile et de dinosaure. Leur buste, leur nuque, leur dos, leurs avant-bras, leurs épaules et leurs cuisses sont extrêmement protégés par plusieurs couches, une véritable armure naturelle. Leurs écailles vont d’un gris rosé jusqu’à un marron sombre, passant par toutes les nuances de rouge et d’orangé entre ces deux extrêmes. Ils ont de grosses griffes tranchantes au bout des doigts ce qui ne les rends pas très doués pour les arts manuels."
          },
          {
            "type": "p",
            "text": "Ils ressemblent énormément aux Chezh’ons, en plus fins, plus petits et à la mâchoire plus courte et ce n’est pas un hasard, ils sont une espèce ayant la même origine, de même que celle des Xew’ens, autrefois, ces trois espèces majeures de la Galaxie n’en formaient qu’une seule, très vite les Xew’ens sont devenus bien plus gros et plus sombre, les Chezh’ons se sont ensuite divisés, la forme « Mo’sen » est apparue sur des mondes où ils servaient d’esclaves aux leurs. On parle de divergences évolutives non naturelles, faite en quelques millénaires, par une très forte sélection, des mutations fortes soit par radiations, contaminations génomiques et autres raisons."
          },
          {
            "type": "p",
            "text": "Dans tous les cas, les « Chezh’wens » se sont divisés pour donner une myriade d’espèces dont ces trois majeures sont très populeuses. Les Mo’sens sont la seule de ces espèces qui a des accords plus réguliers avec les mondes humains, et forcément la seule autorisée sur Terre. Même s’ils sont « frêles » comparés à leurs cousins, on parle de reptiliens extrêmement résistants et au tempérament explosif. Naturellement, ils n’ont pas besoin de s’entrainer pour avoir des compétences d’athlètes, leur métabolisme est très efficace, ils ont une musculature en proportion des protéines dans leur alimentation plus que par leur entrainement."
          },
          {
            "type": "p",
            "text": "Leur digestion est d’ailleurs singulière, ils peuvent presque tout assimiler, si un Mo’sen mange du métal, ses écailles finiront par avoir un aspect légèrement métallique, s’il mange de la pierre, il aura de la silice dans ses écailles, s’il mange du charbon ou du plastique, il aura un apport de carbone similaire à de la viande. Les Mo’sen ont des acides très efficaces dans leur estomac, en revanche, même s’ils assimilent tout, cela a un impact rapide sur leur santé, ne produisant que très peu de déjections, sèches, ils conservent les toxines longtemps en eux, ils sont donc sensibles aux intoxications et poisons mais restent globalement robustes."
          },
          {
            "type": "p",
            "text": "Etant doté d’une armure naturelle, les Mo’sens ont tendance à vivre sans habits mais ne disposant pas d’organes sexuels apparents, cela ne pose pas souvent de problème."
          }
        ]
      },
      {
        "id": "recurrences",
        "title": "Récurrences",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Mo’sens sont des êtres plus physiques qu’intellectuels. Ils ont de bons instincts et une résistance physique certaine. Bien qu’ils soient plus explosifs physiquement qu’ils ne sont endurants, ils aiment les métiers de force ou le sport, les tâches simples comme le ménage ou ceux d’ouvrier les rassurent sans les stresser, cependant, ils ont une certaine fierté et se rebellent assez vite. On ne les retrouvera pas à des postes de bureau, de laboratoire ou autre, ils ne sont pas idiots et certains Mo’sens ont même un QI qui effrayerait nombre d’humains, mais ils ont besoin de place et d’action, c’est pourquoi ils sont très attirés par la vie de Crawler en général."
          },
          {
            "type": "p",
            "text": "Ils sont d’excellents guerriers inévitablement, mais sont des soldats difficiles à gérer, il faut être capable d’écraser leur forte volonté pour avoir leur obéissance totale, ce n’est pas chose aisée et bien souvent les Mo’sens finissent par être virés de l’armée ou des groupes mercenaires, travaillant mieux seuls ou en nombre restreint. Les Mo’sens agissent vite et bien, ils ne sont pas très émotifs en dehors de la colère, ils sont donc excellents sur n’importe quel métier tel que livreur ou pilote, en revanche, ils ont a assez peu d’empathie, donc les métiers d’avocat, médecin ou assistant social ne sont pas parfaitement adaptés."
          }
        ]
      },
      {
        "id": "capacites-inhumaines",
        "title": "Capacités inhumaines",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Mo’sens sont des aliens, ils ont donc forcément des talents bien différents des humains. Leur première capacité est leur incroyable armure d’écailles, elle égale toute augmentation de blindage corporel qu’un humain pourrait rêver de s’implanter. La seconde capacité qu’ils ont est leur vue, ils ont une vue binoculaire similaire à celle des humains ou des rapaces, ils voient assez loin, assez précisément, bien plus qu’un humain non augmenté, ils ne souffrent jamais de maladies des yeux, les éblouissements tel qu’une grenade flash ou un éclair ne peuvent pas les éblouir."
          },
          {
            "type": "p",
            "text": "La troisième capacité surhumaine est leur digestion absolue, qu’ils mangent des gélules de protéines, des détritus métalliques ou de la haute gastronomie, les Mo’sens se nourrissent de tout ce qu’ils peuvent avaler et finiront par l’incorporer, ce n’est pas immédiat, il faut quelques jours pour les matières dures, les structures des matériaux ne sont pas conservées par exemple, un gros jouet en plastique, une buchette de charbon ou un gros diamant vaudront autant de carbone, mais le diamant sera plus long à digérer, il ne procurera pas « d’écailles de diamant »."
          },
          {
            "type": "p",
            "text": "La quatrième capacité des Mo’sens est une hormone leur étant propre la « mosenine », sorte d’adrénaline améliorée qui permet au Mo’sens pendant un temps très court de surpasser toutes ses aptitudes physiques très largement. La Mosenine serait un composant de certaines drogues de combat dans certaines sectes de la galaxie. Enfin, leur dernière aptitude est leur incroyable résistance à la chaleur. Les Mo’sens viennent de mondes bien plus chauds que la Terre, des déserts de sables, de pierres, des mondes laves ou bien encore des forêts tropicales étouffantes, ils ont une capacité rare à tolérer les températures plus élevées et le changement climatique de la Terre leur va de plus en plus, c’est pourquoi ils en nient souvent les dégâts."
          },
          {
            "type": "p",
            "text": "Ils n’aiment pas les températures froides, ils ont beau avoir le sang « chaud », et non variable, le froid ruine leur digestion et peut dégrader leur vue."
          }
        ]
      },
      {
        "id": "organisation",
        "title": "Organisation",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Mo’sens ont beau être moins du genre à se rechercher entre eux, moins sociables, ils n’en sont pas moins une des cinq grandes communautés d’aliens sur Terre. Les Mo’sens sont un peu les « mercenaires » de la Galaxie, dans leur grande quête pour anéantir leurs ennemis, les Chezh’ons, ils se sont rapproché des humains, Talass, Baséanhs, Rocréens et Thalsios. Ils ont tout naturellement intégré la première faction de « L’Alliance mondiale des ressortissants extraterrestres » (Global Alliance of Alien Citizens : GAAC)."
          },
          {
            "type": "p",
            "text": "C’est une sorte de “nations unies” des aliens où chaque communauté aliens possède deux sièges pour les 5 grandes espèces les plus représentées et 1 siège pour les autres, de même, l’AIDH y possède la présidence, les humains extraterrestres s’intégrant mieux mais n’ont pas pour autant un statut de terrien véritable. La seconde plus grande faction est ancienne sur Terre et spécifique à cette planète. Bien connue des complotistes, cette faction est appelée R.E.P.T.I.L.E. (Reptilian Extraterrestrial Politicians, Technologistes and Ideologists League on Earth) et ses membres sont surnommés « Reptiliens », ils n’intègrent pas que des Mo’sens, même si beaucoup de membres en sont."
          },
          {
            "type": "p",
            "text": "Ils n’ont pas pour but d’être des nuisances aux humains mais ils veulent gérer plusieurs aspect économiques, politiques et religieux de la Terre, qu’ils estiment merveilleuse et qu’ils aimeraient sincèrement voir posséder une très grande communauté Mo’sen. Pour ça, ils s’insinuent dans les grandes factions de la Réalité et visent des postes d’importance, même si la nature Mo’sen est plus guerrière que diplomate, ils s’y efforcent et ne déméritent pas du tout même si Davide ICKE leur fit énormément de mal autrefois en s’acharnant par ses théories complotistes."
          },
          {
            "type": "p",
            "text": "Au service du « REPTILE », une sous-faction est celle de « l’armée de Saeniaformation » (Saeniaforming army : SA), en vue qu’un jour la Terre accueille bien plus de Mo’sens, cette faction fanatique cherche à réchauffer et assécher la Terre, en faire une planète plus proche des conditions de vie de « Saenia » un des rares mondes majeurs où les Mo’sens s’épanouissent plus que els autres espèces par ses conditions plus extrêmes. L’AIDH et le GAAC condamnent sévèrement ces plans et les actions de cette armée terroriste qui cherche souvent à nier encore le changement climatique, dont elle est en moindre partie responsable, à desseins."
          },
          {
            "type": "p",
            "text": "Une autre de leurs sous-factions soumise au REPTILE et qui n’est pas très appréciée non plus est nommée sobrement « Confrérie de la Haine » (brotherhood of hate : BoH). Il s’agit de mercenaires, pas forcément seulement des Mo’sens, qui traquent spécifiquement d’autres aliens qui appartiennent à de grandes factions très régulièrement ennemies aux 6 grandes espèces (mo’sen, baséanh, rocréen, talass, thalsios et humains), peu importe à la confrérie qu’il s’agisse de communautés pacifiques, même officiellement acceptées et en règle, la Confrérie de la Haine n’en a rien à faire, Grey, Ad’rak, Zaabor, orpacyors, Losus et bien d’autres espèces, la confrérie se charge d’épurer la Terre de toute infestation du genre."
          },
          {
            "type": "p",
            "text": "Forcément très mal vue voire interdite par le GAAC ou l’AIDH, la confrérie est cachée par le REPTILE dont tous les membres ne cautionnent pas les actions mais qui , globalement préfère protéger ses assassins cruels que des communautés de potentiels dangers. La BoH a plusieurs représentants bien implantés dans la « Blanchisserie » aussi bien que « l’Association des Chasseurs ». Même si les Mo’sens apparaissent assez néfastes par les activités du REPTILE et de ses branches encore plus extrêmes, la grande majorité de ses représentants sont pacifiques et bien intégrés."
          }
        ]
      }
    ]
  },
  {
    "id": "verite-extrals-baseanhs-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "sourceCategory": "Vérité",
    "title": "Baséanhs — Tardollas, médecine & Ligue Baséanne",
    "source": "TUC_Vérité_ les espèces  extraterrestres(1).docx",
    "status": "canon_source",
    "rebuildV2": true,
    "tags": [
      "Vérité",
      "Extrals",
      "Baséanhs",
      "Tardollas",
      "Ligue Baséanne",
      "Xenobars"
    ],
    "sections": [
      {
        "id": "description",
        "title": "Description",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Baséanh sont une espèce galactique, c’est-dire qu’on les retrouve aisément dans une vaste partie de la galaxie. Ils appartiennent aux extraterrestres « reptiloïdes », c’est-à-dire qu’ils ont pour origine des formes de vie similaires aux reptiles de la Terre, sur leur monde d’origine, la lune de la planète géante Findria. Physiquement, ce sont des humanoïdes de 1.75 m de hauteur en moyenne, pour 200 kg lorsqu’ils sont à vide. Ils vivent en moyenne 200 ans."
          },
          {
            "type": "p",
            "text": "Ils ont six yeux d’un bleu ciel et des petites dents très fines et creuses relevant d’un passé venimeux dans leur évolution. Les Baséanhs sont dotés de poches dans leurs corps, ces poches sont des organes pouvant se gonfler ou se vider, cela peut être d’air mais généralement il s’agit de liquides très nutritifs, ils appellent ces poches de liquide des « Tardollas ». La peau des baséanhs est marron, ocre, couleur sable ou bien encore rouge sombre, elle est dotée de minuscules écailles à l’exception des zones au-dessus des « Tardollas », où la peau est semi-transparente, si fine qu’elle peut laisser suinter le liquide contenu."
          },
          {
            "type": "p",
            "text": "Le dimorphisme sexuel est très important, les mâles possèdent des « Tardollas » bien plus grandes que les femelles, ce qui rend leur carrure et leurs membres plus larges, leur donnant un coté très obèse comparé aux femelles. Les baséanh ancestraux avaient deux paires de membres antérieurs et deux de membres postérieurs, désormais, ils ont quatre bras, mais seulement deux jambes, extrêmement massives puisque constituées des deux paires de membres, ce qui leur offre une stabilité certaine. En revanche, avec leur corps se distendant et leur constitution assez robuste, les baséanh sont, d’une part, très larges et, d’autre part, très lents."
          },
          {
            "type": "p",
            "text": "Il ne faut pas attendre d’eux une vitesse de course égale aux humains, ils ne sont pas spécialement plus fort physiquement et ne sont pas plus résistants. La grande force des Baséanh est leurs poches « tardollas » où ils cultivent des bactéries et des cellules. Ces bactéries étaient essentiellement destinées à produire du poison, un peu comme celles de la peau de certains batraciens sur Terre, la différence étant que les Baséanhs actuels choisissent ce qu’ils cultivent dans chacune de leurs nombreuses poches, cela peut être des bactéries infectieuses, des toxines mais le plus souvent ce sont des anti-virus et autres protéines pour soigner."
          },
          {
            "type": "p",
            "text": "Originellement, les Baséanhs tribaux s’affrontaient pour posséder les meilleures souches de maladies, régnant sur leur lune par une guerre bactérienne constante, ils ont exporté cela en quittant leur monde, cultivant les souches à travers les planètes, cependant, ils ont très vite été ciblés et ont préféré adopter des comportements plus vertueux afin de ne pas être systématiquement éliminés comme les sacs à infection qu’ils étaient. Ainsi, ils sont devenus une espèce extrêmement avancée dans les savoirs médicaux et la chimie."
          },
          {
            "type": "p",
            "text": "Chez les Baséanh, ce sont les mâles qui portent la progéniture, qu’ils cultivent dans leurs poches après que la femelle a sacrifié une de ses Tardolla, c’est pourquoi sur Terre, il arrive que des Mâles baséanh prennent une identité de femelle humaine dans la Réalité."
          }
        ]
      },
      {
        "id": "recurrences",
        "title": "Récurrences",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Baséanh ne sont pas aussi frêles que les Talass ni aussi pacifistes de nature, autrefois il s’agissait d’une espèce carnivore même s’ils sont devenus plutôt végétarien avec le temps, ça laisse des comportements plus véhéments parfois. En revanche, ils n’apprécient pas les métiers sportifs ou guerriers, parce qu’ils n’ont pas les compétences des humains, ils sont bien plus lents et moins réactifs. Ils n’ont pas une intelligence supérieure ni un gout pour les métiers intellectuels plus que ça, tout dépend des individus, en revanche, ils aiment la biologie, la chimie, la médecine et tout métier qui tourne autour de ces domaines, l’agriculture, l’élevage ou la recherche sont aussi appréciés."
          },
          {
            "type": "p",
            "text": "Ils travaillent dans toutes les strates bien qu’on les retrouvera plus souvent dans de grandes biocorpo ou comme Insurgés, où rien ne les empêche de renouer avec le terrorisme biologique."
          }
        ]
      },
      {
        "id": "capacites-inhumaines",
        "title": "Capacités inhumaines",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Baséanh cultive à peu près tout ce qu’un corps peut produire, cela peut être des poisons, hémotoxiques, neurotoxiques ou autre, cela peut aussi bien être des bactéries, qu’elles servent à générer des maladies ou des soins. Ils incubent aussi des virus, plus rarement car ces derniers peuvent plus aisément les infecter. Ils peuvent cependant cultiver des cellules souche, pas que celles de Baséanh, il faut voir leurs poches comme des incubateurs où ils s’injectent ce qu’ils veulent, la chimie des Tardolla allant favoriser la réplication des cellules ou des organismes, certains Baséanh cultivant des vers ou bien des algues qui produisent de l’alcool."
          },
          {
            "type": "p",
            "text": "Par sa gorge, le baséanh possède la capacité de vomir un peu du contenu de chaque poche en lui sur un ennemi. Une autre capacité des baséanh est une résistance prodigieuse aux poisons et maladies, s’exposant à toute forme de contamination, les individus de cette espèce sont difficilement sensibles aux maladies, encore moins celles de la Terre. Quand ils sont attaqués, les Baséanhs peuvent expulser tout le contenu de leurs Tardolla. Cela se manifeste par une véritable explosion de vapeur accompagnée d’éclaboussement de liquide protéiné."
          },
          {
            "type": "p",
            "text": "Bien qu’extrêmement douloureux pour le baséanh et épuisant pour ce dernier, si l’ennemi n’est pas en tenue hermétique, il sera vite contaminé, brulé par la chaleur ou par l’acide et sera sévèrement affecté. Pour le Baséanh, il deviendra bien plus rapide de mouvement bien que blessé par cette capacité, souvent, la douleur les rende assez violents, c’est l’une des rares disposition où il faut vraiment craindre un baséanh au combat. Une capacité des baséanh est une extrême précision dans leurs mains et leurs bras, ils ne peuvent pas trembler, si on leur demande une activité manuelle, ils l’exécuteront lentement mais sûrement, en faisant presque jamais d’erreur dans un travail manuel."
          },
          {
            "type": "p",
            "text": "Leur dernière capacité est qu’un Baséanh ne fatigue presque jamais, lent et balourd, un baséanh sera certainement facile à semer pour un humain, en revanche, un baséanh , par sa lenteur, restaure sa vivacité aussi vite qu’il ne la dépense, un baséanh qui outrepassera ses capacités tombera donc, paralysé, sans avoir souffert de la fatigue avant."
          }
        ]
      },
      {
        "id": "organisation",
        "title": "Organisation",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Baséanh ont été sévèrement tués durant leur expansion spatiale, ils étaient de graves menaces pour la stabilité écologique des mondes qu’ils visitaient, à l’instar des Espagnoles et des Portugais débarquant aux Amériques, les baséanh ont été l’origine de pandémies stellaires et ont été traqués pour ça. Par peur d’être éliminés, ils ont changé leurs méthodes et ont commencé à porter des tenues étanches pur protéger les autochtones de leur propre biologie. Les baséanh se sont constitué une image de « croix rouge » de la galaxie, pour leur propre survie."
          },
          {
            "type": "p",
            "text": "Puis ils se sont associés aux humains toujours pour leur propre survie. Ils donnent donc l’air d’être souvent vertueux, mais au fond, ils sont surtout effrayés par les humains et les autres espèces. Sur Terre, ils ont tout naturellement intégré la première faction de « L’Alliance mondiale des ressortissants extraterrestres » (Global Alliance of Alien Citizens : GAAC). C’est une sorte de “nations unies” des aliens où chaque communauté aliens possède deux sièges pour les 5 grandes espèces les plus représentées et 1 siège pour les autres, de même, l’AIDH y possède la présidence, les humains extraterrestres s’intégrant mieux mais n’ont pas pour autant un statut de terrien véritable."
          },
          {
            "type": "p",
            "text": "La majorité des ressortissants Baséanh sont très bien intégrés, même s’ils ont besoin de se retrouver au moins entre aliens, c’est pour ça qu’ils possèdent des « Xenobars », des lieux de rencontre pour les extraterrestres, souvent les xenobars sont officieux, ils ne sont déclarés nulle part et personne ne vend la mèche, cela permettant l’import par la mafia rocréenne de nombreux produits interdits sur Terre. Les Baséanh ont un rôle prépondérant dans la tenue de ces bars, comme ils sont très souvent liés à l’agro-alimentaire, ces xenobars se cachent derrière la « Ligue Baséanne » , une organisation très officielle de distribution de ressources vitales pour les Aliens, certains souffrant de maladies ou de soucis à cause de l’atmosphère Terrestre, souvent les Talass, par une sorte d’asthme, voient leur vie extrêmement réduite en durée par exemple."
          },
          {
            "type": "p",
            "text": "Les baséanhs ont pour face plus sombre de jouer dans les pires pratiques des biocorpo, on peut ainsi citer la base des travaux d’un d’entre eux pour celles de Simon Zeiner de la Tuatha ou bien plusieurs baséanh à la tête de l’île carcérale de Biosun, à l’ouest de Los Angeles."
          }
        ]
      }
    ]
  },
  {
    "id": "verite-extrals-rocreens-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "sourceCategory": "Vérité",
    "title": "Rocréens — régénération, réseaux & diaspora clandestine",
    "source": "TUC_Vérité_ les espèces  extraterrestres(1).docx",
    "status": "canon_source",
    "rebuildV2": true,
    "tags": [
      "Vérité",
      "Extrals",
      "Rocréens",
      "Mafia rocréenne",
      "Rocréens obscurs"
    ],
    "sections": [
      {
        "id": "description",
        "title": "Description",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Rocréens sont une espèce galactique, c’est-dire qu’on les retrouve aisément dans une vaste partie de la galaxie. Ils appartiennent aux extraterrestres « Molluscoïdes», c’est-à-dire qu’ils ont pour origine des formes de vie similaires aux mollusques qu’on peut croiser sur Terre. Physiquement, ce sont de vagues humanoïdes, avec une tête, un torse, quatre bras et quatre jambes. Ils ont six yeux, généralement dans des teintes de jaunes ou de rouge, en fente horizontales, comme les pieuvres, chèvres ou crapauds."
          },
          {
            "type": "p",
            "text": "Ils ont une tête qui évoque une seiche ou une pieuvre, où se trouvent huit tentacules. Ils ont la peau humide et élastique généralement de couleur bleue allant du turquoise au violet et parcourue de zébrures ou de tâches qui permet de les reconnaitre. Leurs corps dispose de plaques calcaires se chevauchant du haut du crane jusqu’au bas du dos, faisant comme des tassettes sur le bassin et le haut des cuisses. Ils ont leurs tentacules par lot de huit, huit sur la tête, huit dans le dos, huit à l’extrémité de chaque « pied », huit sur le bassin."
          },
          {
            "type": "p",
            "text": "En revanche, leurs mains ont réduit et durcit leurs tentacules durant leur évolution pour former trois doigts à chaque main. Ils possèdent enfin une sphère transparente et gélatineuse laissant apparaitre un organe en plein milieu de leur torse. Petits, avec leur 1,30 m de haut et assez lourds, avec leurs 75 kg, ce sont des aliens aussi hideux que gluants, ils ont, comme les Talass, la capacité de faire de grands bonds pour fuir, mais s’épuisent bien plus vite encore. Les Rocréens n’ont pas de squelette interne donc leur corps a beau être très musculeux il ne génère pas une grande force et ne s’avère pas très réactif à l’air libre."
          },
          {
            "type": "p",
            "text": "Les rocréens ont une bonne vue mais c’est le seul sens meilleur que les humains. Leur corps génère du poison, ils sont donc parfaitement toxiques à consommer, malgré leur faible corps, il s’agit d’ancien prédateurs extrêmement grégaire et sociables communiquant par quelques petits dons télépathiques et chassant par le surnombre. La principale force des rocréens est leur régénération, ils peuvent vivre entre 5 ans et 5000 ans selon leur rythme de vie, ils peuvent régénérer de toute forme de blessure à partir de leur noyau, qui n’est ni dans leur crane, ni dans leur « bulle », leur noyau est situé près de leurs organes de reproduction, dans le bassin."
          },
          {
            "type": "p",
            "text": "En revanche, en cas de décapitation, ils se reforment parfaitement amnésiques. Autrefois les empires rocréens étaient tyranniques et esclavagistes, ils ont progressivement été vaincus et désormais l’espèce est plus docile, même si elle a la fâcheuse tendance à pratiquer le commerce illégal. Les Rocréens ancestraux vénéraient des Fléaux, sur Terre, certains disent que H.P. Lovecraft aurait rêvé d’un de leurs « Ancêtres » qu’il nomma Cthulhu dans ses ouvrages."
          }
        ]
      },
      {
        "id": "recurrences",
        "title": "Récurrences",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les rocréens répugnent les tâches physiques, ils n’ont aucun souci avec les métiers ingrats, salissant, en revanche, ils apprécient avoir la mer ou un point d’eau près de leurs communautés, un climat trop sec sera souvent associé à des maladies chez eux, on les trouve donc plus aisément sur les cotes qu’ailleurs. Ils sont peu souvent dans les structures trop hiérarchiques ou rigides, car les rocréens sont assez peu obéissants de nature, ils ont un sens du défi très prononcé. On les trouvera comme vendeur le plus souvent, où leur vivacité d’esprit est adaptée, on les trouve en politique également ou bien dans les entreprises du coté du management, on les trouvera moins dans les laboratoires ou les usines, les rocréens aiment peu les tâches rébarbatives, ils finissent tôt ou tard par tout envoyer en l’air pour changer d’air, le jeu et le danger sont des gouts qu’ils affectionnent malgré leur fragilité."
          },
          {
            "type": "p",
            "text": "De tous les domaines où ils s’épanouissent, c’est toutefois dans l’illégalité qu’on va les retrouver souvent, la pègre est incroyablement gangrenée par les rocréens, notamment celle Italienne qui se confond avec la pègre rocréenne parfois."
          }
        ]
      },
      {
        "id": "capacites-inhumaines",
        "title": "Capacités inhumaines",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les rocréens ont quelques compétences surhumaines. Espèce initialement aquatique, ils peuvent respirer sous l’eau et voir dans les eaux troubles également. En revanche, ils nagent aussi bien qu’un humain, ne flottant plus aussi bien que ses ancêtres. Outre le fait de respirer sous l’eau, un rocréen put retenir sa respiration dans l’air jusqu’à 20 minutes, cependant ils sont extrêmement sensibles aux poussières et la fumée est très dangereuse pour eux, moins par sa toxicité que l’assèchement des muqueuses."
          },
          {
            "type": "p",
            "text": "Comme il s’agit d’une espèce télépathe, ils peuvent créer un réseau télépathique entre créatures proches et dotées d’un sens du genre, ce réseau permettra d’échanger ce qu’ils voient, sente et perçoive parfaitement entre eux. En revanche, aucun échange n’est possible avec un allié sans un don du genre. Les rocréens peuvent générer des poisons et de l’encre qu’ils peuvent projeter comme un karcher sur une cible, un tir puissant donc mais qui se prépare et reste limité par heure. Le véritable pouvoir des rocréens reste leur régénération constante."
          },
          {
            "type": "p",
            "text": "Leur corps est faible et lourd, flasque et visqueux, pour le maintenir droit, ils utilisent un exosquelette calcaire à l’arrière de leur corps mais souvent ces plaques de calcaire sont acérées et pointures, blessant les rocréens. Ils régénèrent donc souvent de ces micro-blessures. De même qu’à la chasse, leurs ancêtres étaient souvent blessés, se jetant en groupe sur la proie en la dévorant vivante. Cette régénération dépend de l’hydratation du rocréen, plus il est en milieu humide, comme une salle de bain, une plage ou des égouts, plus il sera rapide à régénérer, plus il est exposé au soleil et au sec, plus il aura du mal."
          },
          {
            "type": "p",
            "text": "La régénération des rocréens est inversement proportionnelle à leur fécondité et leur taux de reproduction, en effet, les gamètes des rocréens sont formées à partir de cellules souches qui se divisent, plus un rocréen se reproduit et a de progéniture, moins il a de cellules souche à utiliser pour se régénérer. Le mucus cutané des Rocréens produit également un aphrodisiaque quand ils sont excités sexuellement, le plus souvent, ils ne se révèlent pas, donc le mucus ne leur sert pas, mais parfois, certains le déposent sur du mobilier ou dans la nourriture des humains."
          }
        ]
      },
      {
        "id": "organisation",
        "title": "Organisation",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les rocréens sont extrêmement populeux dans la galaxie mais ils sont aussi extrêmement détestés ayant asservi des centaines d’espèces intelligentes. Pour cette raison, ils ont un sens « corporatif » plus développé encore que les humains. Les rocréens ont su changer d’images pour devenir des marchands dans la galaxie, peu importe le monde où on va s’il y a des rocréens, il y a du commerce, et la Terre n’y fait absolument pas exception. Ils ont tout naturellement intégré la première faction de « L’Alliance mondiale des ressortissants extraterrestres » (Global Alliance of Alien Citizens : GAAC)."
          },
          {
            "type": "p",
            "text": "C’est une sorte de “nations unies” des aliens où chaque communauté aliens possède deux sièges pour les 5 grandes espèces les plus représentées et 1 siège pour les autres, de même, l’AIDH y possède la présidence, les humains extraterrestres s’intégrant mieux mais n’ont pas pour autant un statut de terrien véritable. La seconde faction des rocréens sur Terre est l’incommensurable et inévitable « Mafia rocréenne », qui n’a rien à envier à celles des humains et pour cause, elle en est une partie intégrante, presque chaque mafia humaine a des membres rocréens et tous sont de la mafia rocréenne, laquelle protège donc ses intérêts chez les humains."
          },
          {
            "type": "p",
            "text": "La mafia rocréenne s’assure de faire importer des matériaux, composants et aliments qui sont interdits sur Terre, elle gère aussi les faux-papiers des ressortissants illégaux et possède même des spatioports secrets pour quitter la Terre sans autorisation de l’AIDH. Les rocréens travaillent avec les émigrés illégaux, tels que les races ennemies scrupuleusement recherchées, notamment les « greys », cette race alien qui a inspiré les « grands gris » de l’imaginaire collectif. Les rocréens étaient aussi très nombreux au sein de la faction de l’Union Talasse Californienne (CTU), malgré le nom et bien que dirigée par des Talass, la CTU possède bien des Rocréens en quantité significative, en effet, c’est avant tout la portée commerciale qui est visée et le bond technologique qu’ils ont réussi à faire arriver a été une victoire majeure, de même, la naissance des megacorporation est – selon les rocréens – totalement le fait de leur influence, les G-corp (Galactic Corporations) étant l’équivalent des Megacorpo dans la galaxie et certaines ont , très évidemment influencé le développement de celles miniatures sur Terre."
          },
          {
            "type": "p",
            "text": "C’est donc évidemment dans les megacorporation qu’on retrouvera les rocréens le plus dans la Réalité. La dernière faction rocréenne n’est pas aussi triviale que leur amour du commerce. Les Rocréens sont sur la Terre depuis plus longtemps encore que les humains, ils seraient arrivés au devonien supérieur, sensiblement seraient la cause de la grande extinction marquant la fin de cette période géologique. C’est à cette époque qu’ils auraient réveillé un fléau tentaculaire qu’ils vénèrent."
          },
          {
            "type": "p",
            "text": "Les Rocréens descendants de cette époque ressemblent à ceux « normaux » mais sont totalement malfaisants, ils sont alliés des Abyssaux qu’ils auraient peut-être même créé pour leur maître immense. Naturellement semi-aquatiques, ils auraient été en guerre avec les atlantes sur le continent de l’Atlantide et auraient été dévoré par les Khinae ailleurs. Les restes de ces communautés de rocréens sont dispersées et cherchent à déchirer l’Ombre-Monde. Leur technologie est très souvent primale, mais leurs aptitudes physiques plus grandes, leurs dons mentaux encore plus… ils auraient inspirés les flagelleurs mentaux de Donjons&dragons par exemple et autant un rocréen « normal » est rarement un danger, autant un rocréen « obscur » est une calamité que beaucoup de chasseurs ne veulent pas affronter."
          },
          {
            "type": "p",
            "text": "Le plus gros souci des Rocréens obscurs est qu’ils disposent de sectes très insidieuses dans toute l’humanité."
          }
        ]
      }
    ]
  },
  {
    "id": "verite-extrals-thalsios-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "sourceCategory": "Vérité",
    "title": "Thalsios — adaptation, technologie & Hydroguard",
    "source": "TUC_Vérité_ les espèces  extraterrestres(1).docx",
    "status": "canon_source",
    "rebuildV2": true,
    "tags": [
      "Vérité",
      "Extrals",
      "Thalsios",
      "AGI",
      "SMRC",
      "THDF",
      "Hydroguard"
    ],
    "sections": [
      {
        "id": "description",
        "title": "Description",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Thalsios sont une espèce galactique, c’est-dire qu’on les retrouve aisément dans une vaste partie de la galaxie. Ils appartiennent aux extraterrestres « amphibioïdes », c’est-à-dire qu’ils ont pour origine des formes de vie similaires aux amphibiens de la Terre. Physiquement, ce sont des humanoïdes de 1.60 m de hauteur en moyenne, pour 95 kg, ils vivent une cinquantaine d’années en air sec mais ceux qui vivent sur des planètes très humides (ou dans l’eau) peuvent vivre plusieurs centaines d’années."
          },
          {
            "type": "p",
            "text": "Ils ont deux yeux sur une tête très large évoquant vaguement celle d’un crapaud, ils n’ont pas de cou mais ont des épaules très larges, des membres courts très denses et robustes. leurs os sont cartilagineux, mais très épais, ce qui leur offre une prodigieuse résistance pour presque jamais de cassure. Il n’y a pas de distinction physique entre mâle et physique à l’état naturel hormis lea taille des branchies, très volumineuses et apparentes chez les femelles, quasiment jamais extérieures chez le mâle."
          },
          {
            "type": "p",
            "text": "Ils ont la peau d’un jaune sombre, tirant sur le vert, elle est souvent pleine de petites rugosités molles, leur peau est visqueuse, car presque toujours humide, les Thalsios consomment beaucoup de spray pour leur corps afin de se préserver de la sécheresse. Hormis leur tête et leur peau, ils évoquent un peu des nains de fantasy dans leurs compétences, les thalsios étant de prodigieux techniciens et mécaniciens, des artisans de génie en général par la dextérité de leurs doigts, bien plus sensibles que ceux humains."
          },
          {
            "type": "p",
            "text": "Ils ont des épaules extrêmement larges, leur dos est capable de déployer une grande force ce qui en font aussi des ouvriers plutôt robustes. Travailleurs, les Thalsios disposaient d’un territoire restreint dans la galaxie avant d’être asservis et de servir à la fois de main d’œuvre et à la fois de nourriture à plusieurs factions aliens. Ils ont supporter l’oppression et, comme les Mo’sens, ont décidé de lutter, joignant les Talass et les Humains, un choix, plus que judicieux puisque les esclaves sont désormais une des 6 grandes espèces du secteur Prime."
          },
          {
            "type": "p",
            "text": "Les Thalsios sont assez râleur de culture, ils ont besoin de communiquer quand ils ne sont pas satisfaits, ce trait a tendance à leur donner une mauvaise image, mais les Thalsios sont aussi une espèce qui déteste subir des problèmes, ils ne s’en plaignent pas par plaisir mais pour trouver des solutions face à l‘adversité, un Thalsios cherchera toujours à régler un problème, peu importe comment, cela peu tourner chez eux à l’obsession, ils peuvent devenir vite maniaques si personne ne les écoute ou ne les aide."
          },
          {
            "type": "p",
            "text": "Les Thalsios s’incorporent très bien dans les sociétés humaines, ils ont la structure mentale la plus proche des humains parmi les 5 espèces aliens, hélas pour eux, ils ont des besoins atmosphériques plus exigeants et la qualité d’air sur Terre est en dessous des normes d’hygiènes pour leur survie, beaucoup sont donc malades ou affaiblis en grande Californie, à la merci des mafias leur vendant des médicaments rares ou interdit permettant de mieux survivre."
          }
        ]
      },
      {
        "id": "recurrences",
        "title": "Récurrences",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les thalsios sont assez polyvalents, dotés d’un physique très robuste, ils font de bons combattants, de bons travailleurs de force aussi, dotés d’une dextérité certaine, ils sont d’excellents mécaniciens et artisans, bricolant aisément. Intellectuellement ils peuvent se retrouver dans toutes les fonctions, ils sont assez ouverts et variés dans les caractères pour ne pas avoir de grande tendance majeure même si on les trouve moins en politique, les thalsios étant d’une nature assez vite revancharde, ils deviennent rapidement extrémistes, bien qu’ils ne soient pas humains, on en trouve aisément dans des mouvements humains comme la NRA aux Etats-Unis et en Californie."
          },
          {
            "type": "p",
            "text": "Les Thalsios aiment beaucoup la technologie, n’étant pas doté d’un physique spécialement supérieur à un humains, ils ont tendance à se faire modifier, souvent assez jeune, en effet, les Thalsios juvéniles ont une régénération similaire à celle des Axolotls, il est ainsi plus aisé de connecter des membres artificiels à cet âge où les nerfs repoussent qu’une fois adulte."
          }
        ]
      },
      {
        "id": "capacites-inhumaines",
        "title": "Capacités inhumaines",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Thalsios sont des êtres issus de monde très humides, ils ont un système pulmonaire couplé à un système de branchies à la fois interne aux poumons et externe, ce qui leur permet de respirer sous l’eau mais aussi de filtrer les poussières, toxines et boues. Outre ces organes respiratoires, ils ont une capacité d’apnée plus que prodigieuse, les Thalsios pouvant retenir leur respiration pendant 5 heures entières s’ils bougent et jusqu’à 10 heures s’ils sont immobiles. Les juvéniles sont capables de régénérer leur corps, ils perdent cette capacité à l’âge adulte, hormis celle de produire des dents."
          },
          {
            "type": "p",
            "text": "A la place, une fois adulte ils peuvent densifier leurs os et leurs muscles tout au long de leur vie, ainsi, les vieux thalsios ont une force et une résistance surhumaine, leur peau, devenue épaisse et plus sombre est un véritable cuir, plus un thalsios vieilli, plus il devient redoutablement dangereux bien qu’il guérisse de moins en moins. Les thalsios ont un sens du touché incroyablement supérieur aux humains, leurs doigts d’apparence boudinés sont capables de sentir des traces d’empreintes digitales sur une surface lisse."
          },
          {
            "type": "p",
            "text": "Ils sentent bien mieux les vibrations dans l’eau et dans l’air aussi, leurs branchies ne faisant pas que filtrer l’eau mais leurs minces filaments vibrants avec les changements de pression d’air ou d’eau, en respirant, un Thalsios peut donc sentir des mouvements d’air et des présences, de même ses mains et ses pieds sont sensibles aux infrasons. La peau des Thalsios est très humide, leur corps contient bien plus d’eau qu’un humain, les rendant plus lourds en étant plus petits, bien qu’ils détestent la sécheresse, ils sont pratiquement ignifugés, un lance-flamme par exemple sera bien moins efficace sur eux même si les plasmas montent bien trop haut pour qu’ils n’y résistent en revanche."
          },
          {
            "type": "p",
            "text": "Enfin, la dernière capacité des thalsios de Terra Umbra vient de leur lente adaptation à la Terre, propre à ceux natifs de la Terre, ils possèdent , par leur sensitivité aux changement de pression, la capacité de sentir les fluctuations de l’Hologramme, c’est-à-dire quand ils approche d’une créature fantastique, surnaturelle ou extraterrestre, l’Hologramme est plus dense, le Thalsios va le sentir, généralement pour s’en éloigner, de même si une créature inhumaine se révèlent autour de lui, même hors de son champ de vision, le Thalsios le sentira, même s’il ne saura rien de plus."
          }
        ]
      },
      {
        "id": "organisation",
        "title": "Organisation",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Thalsios ont fait le choix de joindre la grande alliance formée autour des humains, ils ne brillent pas pour des compétences extraordinaires ou un passé honteux, malgré tout, ils ont de nombreuses organisations. Sur Terre, ils ont tout naturellement intégré la première faction de « L’Alliance mondiale des ressortissants extraterrestres » (Global Alliance of Alien Citizens : GAAC). C’est une sorte de “nations unies” des aliens où chaque communauté aliens possède deux sièges pour les 5 grandes espèces les plus représentées et 1 siège pour les autres, de même, l’AIDH y possède la présidence, les humains extraterrestres s’intégrant mieux mais n’ont pas pour autant un statut de terrien véritable."
          },
          {
            "type": "p",
            "text": "La majorité des Thalsios se contentent toutefois d’associations, ce sont des créatures très grégaires même si les Thalsios ne cherchent pas forcément à vivre qu’entre eux, ils ont vite un humour qu’eux-seuls comprennent par exemple et dans les sociétés humaines peuvent paraitre un peu « bizarres ». La seconde faction où on trouve des Thalsios est l’Union Talasse Californienne (CTU), elle a pour but de s’insinuer dans les institutions scientifiques de Californie afin de pousser le progrès scientifique et de rattraper le retard terrestre sur la moyenne des autres mondes technologiques."
          },
          {
            "type": "p",
            "text": "Bien que le CTU soit initialement d’origine Talasse, les thalsios l’ont parfaitement intégré et ont les mêmes volontés à faire progresser la Terre à un niveau « convenable ». Outre les factions très politiques, les Thalsios ont leurs propres organisations telle que l’ AGI (Association for Genetic Improvement), qui est un puissant soutien quant à elle pour les Megacorporations de biogénétique et la face visible du SMRC (Species Merging Research Center), en effet, énormément de Thalsios se trouvent laids vis-à-vis des normes humaines, la chirurgie et la correction génétique est très répandus, les « Humalsios » sont des Thalsios à l’apparence humaine, ils restent lourds, carrés et d’un teint jaunâtre mais sont physiquement humains pour le reste, comme les « Humaséans » ont la peau marron tachetée, les yeux bleus sont très larges mais ressemblent à des humains."
          },
          {
            "type": "p",
            "text": "La dernière organisation Thalsios est directement liée aux Mo’sens, en effet, la SA ((Saeniaforming army ) qui est une branche du REPTILE a des plans qui mèneraient à rendre la Terre difficilement vivable pour les Thalsios et les rocréens, des espèces liées à l’humidité, ainsi ils ont formé le THDF (Terrestrial Hydrometry Defense Front) avec l’aide d’autres aliens, dès qu’une activité de la SA est détectée, les troupes d’assaut du THDF , surnommées « Hydroguard » , sont déployées pour contrecarrer par tous les moyens."
          },
          {
            "type": "p",
            "text": "L’hydroguard va plus loin puisqu’elle lutte contre le réchauffement climatique par de vastes usines à nuages, afin de réhumidifier l’air et protéger un peu mieux des rayonnements solaires, cependant, l’Hydroguard est source de très gros cyclones parfois dévastateurs."
          }
        ]
      }
    ]
  },
  {
    "id": "verite-extrals-peuples-rares-presences-clandestines",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "sourceCategory": "Vérité",
    "title": "Extrals rares — peuples, diasporas & présences clandestines",
    "source": "TUC_Vérité_ les espèces  extraterrestres(1).docx",
    "status": "canon_source",
    "rebuildV2": true,
    "tags": [
      "Vérité",
      "Extrals",
      "Orpacyors",
      "Effismes",
      "Greys",
      "Gamaanes",
      "Serys",
      "Zaabors",
      "Losus",
      "Triphoriens",
      "Letrophodiens"
    ],
    "sections": [
      {
        "id": "statut-des-presences-rares",
        "title": "Statut des présences rares sur Terre",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La source distingue les cinq grandes espèces officiellement autorisées par l’AIDH des autres présences extraterrestres. Talass, Mo’sens, Baséanhs, Rocréens et Thalsios sont soumis à des passeports, des réglementations et un recensement aussi complet que possible ; la majorité de leurs ressortissants est considérée comme pacifique."
          },
          {
            "type": "p",
            "text": "Les peuples plus rares ou hostiles disposent d’un statut beaucoup moins uniforme. Plusieurs arrivent sur Terre par l’intermédiaire de la mafia rocréenne, parfois à l’insu de l’AIDH, et leur présence est donc moins contrôlée et moins contrôlable."
          }
        ]
      },
      {
        "id": "orpacyors",
        "title": "Orpacyors",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les orpacyors sont une symbiose de deux espèces. Les « Orpas » sont des reptiloïdes gris qui ressemble parfaitement à des humains assez fins. Les « Cyorses » sont des cnidaroïdes, (formes similaires aux méduses, anémones et coraux) qui sécrètent des carapaces marrons plus ou moins complexes. Les Orpacyors sont des extraterrestres qui sont donc une symbiose, chaque Orpas est infesté par une communauté de Cyorses, les Cyorses ne sont pas que sur son corps mais dedans, le cerveau est en partie composé de cellules cyorses étendant celui des Orpas."
          },
          {
            "type": "p",
            "text": "Les Cyorses reprogramment l’ADN de l’orpas en fonction de signaux chimiques de l’orpas, ce qui donne une espèce polymorphe, les mâles, par exemple, sont extrêmement déformés pour remplir des fonctions : ils servent aussi bien de soldats que de véhicules, de vaisseaux ou de bâtiments, alors que les femelles constituent les « citoyens » et les dirigeants et auront une apparence humanoïde. C’est une espèce matriarcale et assez territoriale qui ne base sa technologie que sur le biologique."
          }
        ]
      },
      {
        "id": "effismes",
        "title": "effismes",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les effismes sont des aliens terrifiants. D’une taille humaine, ils sont vaguement humanoïdes, à la peau noire de jais et aux quatre yeux rouge lumineux, ils n’ont pas vraiment de bouche et ont une forme effilée avec de longs bras et de longues jambes. Ils ont dans le dos d’innombrables tentacules flottant dans l’air comme s’ils lévitaient hormis leur cerveau, ils n’ont aucun organe dans leur corps, ils ne respirent pas, ne mangent pas et vivent sur des planètes à très forte densité gravitationnelle, ce qui leur octroie une force ahurissante sur Terre en plus de leur capacité à concentrer la matière noire à leur guise."
          },
          {
            "type": "p",
            "text": "Ils peuvent même se déphaser de dimension pour fuir. Seuls les mâles réussissent à se matérialiser dans notre plan dimensionnel, les femelles sont plus éthérées et blanches, évoquant des spectres. Ils peuvent projeter une énergie psychique en concentrant les photos grâce à la matière noire les attirant, c’est la base de leur armement mais ils ne sont que rarement agressifs heureusement bien que les Effismes terriens ont tendance à vénérer les Fléaux qu’ils recherchent activement en les pensant être des dieux de leur planète natale."
          }
        ]
      },
      {
        "id": "greys",
        "title": "Greys",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les greys étaient la pire menace pour les systèmes autour de la Terre il y a 50 ans. Les greys sont des créatures encore plus singulières que les Orpacyors. les greys ont une apparence d’alien un peu caricaturale, avec leurs gros yeux rouges et leur couleur grise mais ils sont très étranges. D’une part, leur peau est transparente, ce sont leurs muscles qui sont gris, ils possèdent de nombreux « trous » dans leur corps pour évacuer des vapeurs et gaz qu’ils produisent. Les Greys sont des amiboïdes à l’origine des créatures proche des slimes des jeux-vidéos, des slimes qui, au lieu de totalement dévorer leurs proies, séparent leurs cellules les unes des autres, ils déconstruisent la structure des corps et les reforment, digérant ce qui n’est pas nécessaire."
          },
          {
            "type": "p",
            "text": "Les greys sont un amas de cellules « prisonnières » de cellules « greys », ils cultivent ainsi les organes, structures osseuses et autres tissus avantageux pour former un corps toujours plus performant. Comme les Greys ne sont pas des individus mais des communautés ils peuvent se diviser pour se reproduire et infecter n’importe quel organisme, quelques cellules greys allant vite parasiter un humain et remplacer son cerveau si rien n’est fait en cas de contamination. C’est pourquoi l’inquisition galactique extermina l’espèce en priorité il y a 50 ans par un virus empêchant les Greys de se diviser."
          },
          {
            "type": "p",
            "text": "Sur Terre, ils ont réussi à survivre non sans mal et s’y cachent sans chercher à se venger, traumatisés par leur extermination alors qu’ils valaient la menace Ad’rak il y avait encore 50 ans."
          }
        ]
      },
      {
        "id": "gamaanes",
        "title": "Gamaanes",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les deskoriens étaient une espèce d’alien dont la technologie se basait sur l’utilisation « d’ascaroïdes », des « vers » de l’espace, des créature scapable de vivre dans le vide stellaire, sur des astéroïdes ou des coques de vaisseaux. La technologie des Deskoriens a été pillé par les empires Rocréens et leurs serviteurs Zaabors d’autrefois, mais ils léguèrent une espèce artificielle, les Gamaanes. Somptueuses créatures blanches à l’apparence parfaitement humaines en dehors de leur peau livide décorée de tâches dorées, il s’agit d’amas de vers galactiques, chaque fibre d’une Gamaane étant un ver, chaque circonvolution de son cerveau est un nœud de vers."
          },
          {
            "type": "p",
            "text": "Les cheveux et Les habits sont de la soie qu’elles produisent elles-mêmes, en effet, les Gamaanes ont toute une apparence féminine, rarement masculine. Malgré leur composition interne, faite d’enchevêtrement de vers très fins, les Gamaanes ne régénèrent pas autant qu’on l’imaginerait, pour régénérer, il faut que les vers tués ne pondent œuf de remplacement et que le nouveau vers survive assez pour grandir. Elles adorent les humains mais sont très craintes car les Gamaanes attirent les astéroïdes et les vers géants galactiques qui les infestent, lesquels peuvent dévier les trajectoires des roches célestes pour s’écraser sur des mondes."
          }
        ]
      },
      {
        "id": "serys",
        "title": "Serys",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Serys sont des humanoïdes de type « elfoïdes », on ne sait pas s’ils sont vraiment assimilables aux primates mais ils ont l’air proche des elfes d’Aèr. Qu’il s’agisse d’une évolution convergente ou d’une espèce descendante importe peu, les Serys se distinguent des elfes par de puissants dons psychiques au lieu de la magie, par des sens d’orientation dans l’espace et par une très vaste variété de formes et de couleurs selon les mondes où ils vivent. Les serys ont lourdement dominé une partie de la galaxie pendant longtemps, alors ils ont mené à l’apparitions de sous-forme tels que les Xidoniens et les Elaymars."
          },
          {
            "type": "p",
            "text": "De nature très farouche on en trouve très peu sur Terre."
          }
        ]
      },
      {
        "id": "zaabors",
        "title": "Zaabors",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Immonde et abjecte caractérise les Zaabors, l’espèce la plus laide de la galaxie, cylope de la taille d’un gobelin, doté de quatre bras et quatre jambes, ils n’ont pas de nez et un torse grouillant de tentacules faibles. Ce sont des maitres dans le marché de la bio-arme, sauvés par les Effismes, ils en sont des alliés et traite aisément avec les rorcréens avec qui ils partagent nombre de choses. Ils sont encore plus faibles physiquement que des rocréens et n’ont pas de bons sens. En revanche, ils ont créé « Ashmyn k’Na » une créature artificielle « parfaite » dont on cherche encore la trace."
          }
        ]
      },
      {
        "id": "losus",
        "title": "Losus",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Losus sont une espèce galactique disposant de douze empires sur vingt-et-un systèmes d’une même région de la galaxie. Leur essor technologique est très récent : il y a moins de deux siècles, Losia était encore un monde fortement magique dont le niveau technologique était inférieur à celui de l’Humanité terrestre de la même époque."
          },
          {
            "type": "p",
            "text": "Leur histoire bascula lorsque des cultistes de Thul passèrent par les Portails des Mondes et commencèrent à détourner la magie de Losia vers leur Fléau. L’effondrement magique qui suivit fragilisa les protections du monde, détruisit ses dieux et permit plusieurs invasions extraterrestres. La tradition losus attribue sa survie au retour d’un héros porteur d’un « feu infini » obtenu de Belial ; son sacrifice purgea Losia d’une part de la corruption et ouvrit une période d’industrialisation et de conquête."
          }
        ]
      },
      {
        "id": "triphoriens",
        "title": "Triphoriens",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Triphoriens formaient une espèce systémique adaptée aux très fortes gravités et alliée aux Effismes. Le document les décrit comme physiquement surpuissants dans des conditions terrestres."
          },
          {
            "type": "p",
            "text": "Leur civilisation fut anéantie par les Greys, qui les dépeçaient pour récupérer des organes utiles, notamment le Diprona, producteur d’hormones et de cellules osseuses de grande qualité. Les rares survivants documentés portent donc directement les traces de ce génocide."
          }
        ]
      },
      {
        "id": "letrophodiens",
        "title": "Letrophodiens",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Letrophodiens sont une espèce « systémique », c’est-à-dire limitée à un système solaire, parfois deux. La source oppose ce statut aux espèces planétaires, confinées à un seul monde, et aux espèces galactiques présentes à très grande échelle."
          },
          {
            "type": "p",
            "text": "Ils étaient une population relativement discrète des Mondes Technologiques jusqu’au conflit opposant Beltor Rixil à une force Zarpheth. Letrophodia III fut détruite en représailles, ce qui transforma cet épisode local en fait connu à l’échelle des communautés extrales."
          }
        ]
      }
    ]
  },
  {
    "id": "verite-extrals-eons-zarpheth-anomalies-galactiques",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "sourceCategory": "Vérité",
    "title": "Eons, Zarpheth & anomalies galactiques",
    "source": "TUC_Vérité_ les espèces  extraterrestres(1).docx",
    "status": "canon_source",
    "rebuildV2": true,
    "tags": [
      "Vérité",
      "Extrals",
      "Eons",
      "Zarpheth",
      "Wolféens",
      "Espace N"
    ],
    "sections": [
      {
        "id": "zarpheth",
        "title": "La Voie Zarpheth",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Il ne s’agit pas d’une véritable espèce biologique, « Zarpheth » est plus une voie qu’autre chose. Pour l’AIDH c’est un fléau, pour les croyants c’est une idéologie profonde. la « voie zarpheth » est la recherche de l’universalité des espèces pensantes par l’abandon de leur génétique, en somme, renier la biologie pour communier en tant qu’intellects libérés des besoins biologiques et des contraintes chimiques. Une égalité parfaite grâce à la mécanisation des corps. La voie Zarpheth est l’ultime aboutissement d’un transhumanisme total et s’avère impossible à éviter même sur Terre où elle parasite l’Eglise cybernétique."
          }
        ]
      },
      {
        "id": "eons",
        "title": "Eons — dieux errants",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les éons sont les « aliens » les plus puissants et dangereux qu’on puisse croiser. Il s’agit de divinités planétaires ou stellaires, comme les dieux de la Terre, qui se sont retrouvés à errer dans la galaxie, étant des êtres immatériels en tant que dieux véritables, immortels, le voyage spatial est loin d’être un souci malgré les durées effrayantes que cela peut prendre. Les éons sont des êtres de pure énergie, ils sont de petites usines à raffiner la Magie dont ils peuvent en changer la nature aisément."
          },
          {
            "type": "p",
            "text": "L’AIDH n’a aucun moyen d’empêcher la chute d’un Eon sur Terre, et d’ailleurs, l’AIDH a énormément de mal à comprendre ce que sont ces êtres qui sont nommés ainsi car les Seigneurs-généraux refusent tout simplement de les appeler « dieux errants », refusant qu’on ne les vénère. Les Aliens font tout pour s’attirer leurs faveurs et les Eons en profitent grandement en général. Contrairement aux Fléaux, qui sont des vestiges d’une guerre aux origines de la création de l’univers, les éons naissent encore maintenant, sur certains mondes."
          },
          {
            "type": "p",
            "text": "Un éon est un dieu qui quitte sa planète ou son étoile d’origine, souvent, les mondes technologiques n’ont pas de magie ou peu, alors leurs éons sont nombreux à quitter ces mondes et sont relativement faibles. Un éon peut dont avoir des compétences allant du simple humain vaguement doué jusqu’à égaler Elynea, Morrighan ou Belial, même si, il est évident qu’une telle pointure sera vite identifiée. Les éons oublient souvent ce qu’ils sont néanmoins, à force d’errer, ils délaissent et dispersent leurs pouvoirs, même assez puissant pour faire face à un dieu local, ils ont rarement pleinement la maitrise de leurs dons et ne disposant pas de prières leur étant destinés, ne restaure pas leur énergie, c’est pourquoi, malgré un potentiel égal voire supérieur, ils sont rarement gagnant face aux dieux locaux."
          },
          {
            "type": "p",
            "text": "« Les dieux errants » sont aussi particulièrement recherchés par les fléaux, en effet, tout comme les éons restent en difficultés face à un dieu local, ils n’ont pas plus de chance face à un Fléau qui n’aura de cesse d’utiliser leur énergie pour se nourrir. L’inquisition galactique est la seule organisation à bien savoir ce que sont les Eons, dur Terre, elle n’a pas d’antenne, les dieux terrestres quant à eux ont bien d’autres soucis avec la surveillance des Fléau et leurs propres oppositions entre eux, mais ils n’ont jamais refusé de l’aide."
          },
          {
            "type": "p",
            "text": "Les éons ont pour principale capacité de ne pas être très sensibles aux pouvoirs des dieux et donc de leurs serviteurs, en outre, ils peuvent aisément copier toute capacité divine d’ailleurs même si ce n’est que temporaire."
          }
        ]
      },
      {
        "id": "wolfens",
        "title": "Nébuleuses & entités wolféennes",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les nébuleuses wolféennes sont décrites comme des zones où plusieurs dimensions se superposent et se chevauchent. Elles fonctionnent comme des conjonctions instables, apparentées à des croisements de trous de ver : l’Espace N s’y déverse naturellement pour refermer ces anomalies, tandis que l’espace-temps, les dimensions et la matière peuvent être fusionnés, broyés puis recomposés."
          },
          {
            "type": "p",
            "text": "Les entités wolféennes sont très mal connues. La source rapporte qu’elles peuvent posséder des cadavres et récupérer leurs souvenirs. Leur possible interaction avec une dimension déphasée telle que l’Ombre-Monde constitue une inquiétude explicite de l’AIDH."
          }
        ]
      }
    ]
  }
] as Article[];

export const COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS = [
  {
    "targetId": "verite-v7-extrals-gaac-aidh-diasporas",
    "sections": [
      {
        "id": "cinq-especes-majeures-source-extraterrestres",
        "title": "Cinq grandes communautés officiellement admises",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La source distingue cinq espèces extrales majeures officiellement autorisées sur Terre : Talass, Mo’sens, Baséanhs, Rocréens et Thalsios. Elles sont soumises à des passeports, des réglementations et un recensement destiné à contrôler les flux d’arrivée et de séjour."
          },
          {
            "type": "p",
            "text": "Le GAAC fonctionne comme espace de représentation des communautés extraterrestres : les cinq grandes espèces disposent chacune de deux sièges, les autres espèces d’un siège, tandis que l’AIDH en assure la présidence. Cette architecture ne supprime ni les factions internes ni les organisations transespèces."
          }
        ]
      },
      {
        "id": "classification-extension-especes",
        "title": "Espèces galactiques, systémiques & planétaires",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Le livre emploie trois niveaux de diffusion : une espèce planétaire n’existe que sur un seul monde ; une espèce systémique est limitée à un système solaire, parfois deux ; une espèce galactique peut être rencontrée à travers une vaste partie de la galaxie. Cette classification décrit l’extension d’un peuple, pas sa puissance ni son niveau technologique."
          }
        ]
      }
    ]
  },
  {
    "targetId": "verite-v7-homo-superior-adrak-profils-rares",
    "sections": [
      {
        "id": "adrak-refugies-source-extraterrestres",
        "title": "Ad’raks sur Terre — réfugiés sous contrôle",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les Ad’rak sont des « primatoïdes », ils sont très similaires aux humains, la principale différence étant leur peau bleue et leur taille, aisément le double des humains. Dotés très généralement d’une culture très guerrière et d’un comportement guerrier plus violent que les humains, ils sont, dans la galaxie, sensiblement incompatibles avec les humains tant les besoins se ressemblent. Sur Terre, l’AIDH a laissé des communautés d’exilés Ad’rak s’installer. Il existe des milliers de mondes Ad’rak, la très grande majorité de l’espèce est soumise à « l’armée noire » laquelle est extrêmement tyrannique pour asseoir ses idéaux belliqueux et expansionnistes à l’espèce entière, il existe donc d’innombrables Ad’rak essayant de fuir le périmètre de l’Armée noire et ceux sur Terre sont généralement de ces réfugiés."
          },
          {
            "type": "p",
            "text": "Ils restent agressifs et puissants mais ont aussi un certain sens de l’honneur leur venant de leurs cultures guerrières."
          }
        ]
      }
    ]
  },
  {
    "targetId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "sections": [
      {
        "id": "chronologie-source-extraterrestres",
        "title": "Repères chronologiques du dossier extral",
        "level": 2,
        "blocks": [
          {
            "type": "table",
            "rows": [
              [
                "Repère",
                "Datation donnée par la source"
              ],
              [
                "Création des univers",
                "Non précisée"
              ],
              [
                "Création de la Terre",
                "Il y a environ 4,5 milliards d’années"
              ],
              [
                "Expansion spatiale azménorienne",
                "Non précisée"
              ],
              [
                "Création des Portails des Mondes",
                "Non précisée"
              ],
              [
                "Création du Consortium",
                "Non précisée"
              ],
              [
                "Deux événements supplémentaires",
                "Non renseignés dans le document"
              ],
              [
                "Création de l’Hologramme",
                "Non précisée"
              ],
              [
                "Époque actuelle",
                "2035"
              ]
            ]
          },
          {
            "type": "p",
            "text": "Les mentions « ??? » de la source sont conservées comme des inconnues ; aucune date n’est reconstituée artificiellement."
          }
        ]
      }
    ]
  }
] as Array<{ targetId: string; sections: Section[] }>;

export const COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION = [
  {
    "id": "verite-extrals-talass-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "group": "Peuples & Natures",
    "groupOrder": 30,
    "subgroup": "Extrals",
    "subgroupOrder": 70,
    "pageOrder": 10,
    "displayTitle": "Talass — physiologie, Talwa’Etax & factions"
  },
  {
    "id": "verite-extrals-mosens-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "group": "Peuples & Natures",
    "groupOrder": 30,
    "subgroup": "Extrals",
    "subgroupOrder": 70,
    "pageOrder": 20,
    "displayTitle": "Mo’sens — physiologie, Mosenine & REPTILE"
  },
  {
    "id": "verite-extrals-baseanhs-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "group": "Peuples & Natures",
    "groupOrder": 30,
    "subgroup": "Extrals",
    "subgroupOrder": 70,
    "pageOrder": 30,
    "displayTitle": "Baséanhs — Tardollas, médecine & Ligue Baséanne"
  },
  {
    "id": "verite-extrals-rocreens-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "group": "Peuples & Natures",
    "groupOrder": 30,
    "subgroup": "Extrals",
    "subgroupOrder": 70,
    "pageOrder": 40,
    "displayTitle": "Rocréens — régénération, réseaux & diaspora clandestine"
  },
  {
    "id": "verite-extrals-thalsios-detail",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "group": "Peuples & Natures",
    "groupOrder": 30,
    "subgroup": "Extrals",
    "subgroupOrder": 70,
    "pageOrder": 50,
    "displayTitle": "Thalsios — adaptation, technologie & Hydroguard"
  },
  {
    "id": "verite-extrals-peuples-rares-presences-clandestines",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "group": "Peuples & Natures",
    "groupOrder": 30,
    "subgroup": "Extrals",
    "subgroupOrder": 70,
    "pageOrder": 60,
    "displayTitle": "Extrals rares — peuples & présences clandestines"
  },
  {
    "id": "verite-extrals-eons-zarpheth-anomalies-galactiques",
    "dataset": "verite-extraterrestres",
    "category": "Vérité",
    "group": "Peuples & Natures",
    "groupOrder": 30,
    "subgroup": "Extrals",
    "subgroupOrder": 70,
    "pageOrder": 70,
    "displayTitle": "Eons, Zarpheth & anomalies galactiques"
  }
];
