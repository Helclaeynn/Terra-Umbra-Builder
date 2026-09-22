const lore = (text: string) => ({ type: "p", style: "lore", text });

const table = (rows: string[][]) => ({ type: "table", rows });

/**
 * Institutional lore rebuilt from Les temples Aseryns(1)(1).pdf.
 * Character biographies from the same source remain in the dedicated PNJ payloads.
 */
export const COMPENDIUM_VERITE_ASERYN_TEMPLES_LORE_SECTIONS: Record<
  string,
  Array<Record<string, any>>
> = {
  "verite-aseryns-ordre-sepulcral": [
    {
      id: "sepulcral-histoire",
      title: "Origine & mission de l’Ordre Sépulcral",
      level: 2,
      blocks: [
        lore(
          "L’Ordre Sépulcral est un ordre religieux indépendant des quatre Temples aseryns. Il fut fondé après la guerre d’Alesdryor, sous le règne de Vyrathè, lorsque les meilleurs maîtres du combat et de la foudre ainsi que les fidèles les plus fervents d’Athegos s’organisèrent pour défendre le Mausolée de Serathè. Kalirath avait pénétré et souillé le tombeau de la Mère ; l’Ordre reçut donc pour première mission d’en interdire l’accès à toute personne dangereuse."
        ),
        lore(
          "Vyrathè fit aussi de l’Ordre un appui de son autorité et développa un culte domestique de Serathè. Des statuettes ou bas-reliefs de la « Mère du foyer », de la « Mère du pain » ou de la « Mère des draps » occupaient chaque pièce des maisons atlantes. L’art de cette époque représenta si souvent Serathè sous les traits de Vyrathè que la reine encouragea elle-même leur confusion."
        ),
        lore(
          "L’Ordre ne protège ni la famille royale ni le peuple en tant que tels : il protège le Mausolée et l’image sacrée de la Mère. Il transporte vers les quatre Grands Temples de la capitale les offrandes déposées au tombeau, encadre les processions des fêtes et traque les abominations que Kalirath avait laissées dans les campagnes et les rues."
        ),
        lore(
          "Les hommes peuvent servir jusqu’au rang de maître, mais la charge suprême revient toujours à une Grande Maîtresse. Vyrathè cumula d’abord les titres de reine d’Atlantis, de Vicairesse des Rites et de Haute Maîtresse. La fonction passa ensuite à sa troisième fille, puis à l’une de ses nièces ; deux générations plus tard, sainte Tyraè fut la première Grande Maîtresse qui ne descendait pas des Athegos."
        ),
        lore(
          "Lors des insurrections de Cylonath contre le Temple de la Fin, l’Ordre demeura neutre. Il intervint quinze ans plus tard, lorsque les Cylonathiens pillèrent les chambres et brûlèrent des effigies de Serathè en les présentant comme des images obscènes de la Dame. La Grande Maîtresse considéra cette profanation comme une déclaration de guerre et fit châtier les coupables."
        ),
        lore(
          "L’Ordre actuel reste volontairement discret et très réduit. Il compte treize chevaliers, chacun attaché à la stèle d’un Fondateur, auxquels s’ajoutent le Maître et la Grande Maîtresse. Chaque chevalier peut former un écuyer ; si celui-ci est jugé indigne puis renvoyé, sa langue est tranchée afin de préserver les secrets du Mausolée. La quatorzième stèle, celle du Fondateur déchu, fut autrefois ensevelie sous le sable et les immondices ; l’Ordre a jusqu’à oublié son existence."
        )
      ]
    }
  ],

  "verite-aseryns-temple-createur": [
    {
      id: "createur-origines",
      title: "Du culte libre à la prêtrise",
      level: 2,
      blocks: [
        lore(
          "Le « Temple Véritable » désigne le culte majeur de l’Atlantide. Aux premiers âges, lorsque les Aseryns ne vivaient encore que sur leur île, la Terre paraissait changeante et dangereuse tandis que l’Atlantide demeurait stable. Le culte du Tout restait libre : la noblesse ne détenait aucune autorité religieuse et tout érudit capable de lire les textes anciens pouvait proposer un rite, que chaque communauté acceptait ou refusait. Cette émulation produisit des sanctuaires toujours plus grandioses, mais aussi des interprétations contradictoires."
        ),
        lore(
          "La crise éclata avec Cylonath. Convaincu que la Destruction devait être méprisée puis oubliée, il mena ses partisans contre le grand Temple de la Fin et mourut, selon la tradition, sous l’édifice qu’il avait fait s’effondrer. Pour prévenir de nouveaux débordements, les Aseryns instituèrent les Gardiennes : des érudites guerrières choisies pour leur affinité avec le pouvoir du Temple qu’elles défendaient. Elles protégèrent d’abord les bâtiments et les écrits, puis prirent en charge les rites."
        ),
        lore(
          "La prêtrise fut réservée aux femmes. Cette décision répondait d’abord au fait que les Cylonathiens étaient majoritairement des hommes ; la doctrine lui donna ensuite une justification religieuse : Serathè était la fille du Père et les prêtresses se considéraient comme les filles spirituelles des Puissances. Le Temple de la Fin, privé de son sanctuaire et continuellement attaqué, perdit peu à peu ses fidèles."
        ),
        lore(
          "Pendant les guerres d’unification, Cylhen Athegos s’allia à Nysalia, Haute Prêtresse du Créateur, tandis que Xenarilith Araenis obtint l’appui de Dothera, Haute Prêtresse de la Fin. L’alliance de la couronne et du Temple du Créateur l’emporta. Les descendants de Cylhen, jusqu’à Tyrkias Athegos, transformèrent cette victoire en doctrine d’État : le Temple de la Fin fut présenté comme un culte oppressif niant l’autorité du Créateur, et ses fidèles devinrent des hérétiques."
        )
      ]
    },
    {
      id: "createur-unification",
      title: "Unification, hérésies & institution",
      level: 2,
      blocks: [
        lore(
          "Atrelia Rylias, belle-sœur de Tyrkias et duchesse de Mû, porta les réformes religieuses destinées à faire reconnaître l’autorité absolue du roi atlante. Elle imposa une institution forte, mais dut composer avec les cultes locaux et avec les puissances qui réclamaient leur propre vénération."
        ),
        lore(
          "En Hyperborée, Nalykai Selerias conquit les terres de la reine-dive Angrboda au nom de Tyrkias, mais reçut de Belial la flamme qui lui permit de soumettre Dives et Amazones. Le duché resta donc loyal à la couronne tout en refusant la légitimité religieuse du Temple. En Lémurie, Galdor Merengos réprima brutalement les cultes voués aux Nymphes et aux dieux locaux. Son mariage avec Antrinea devait asseoir son autorité, mais les sources se contredisent encore sur l’identité de l’épouse, Athegos ou Sundosia. Lorsque les épidémies isolèrent l’île, les anciens cultes reparurent."
        ),
        lore(
          "En Australis, Amyliriia Athegos affronta le Temple de l’Esprit, très puissant sur cette terre vouée à la Nuit et aux Songes. Emprisonnée dans un tombeau de ténèbres, elle offrit malgré elle aux fidèles un lieu de rassemblement et leur permit de dénoncer le Temple de la Création comme hérétique. Les missions envoyées depuis l’Atlantide accentuèrent encore la rupture."
        ),
        lore(
          "Lorsque la reine Valyna concentra ses efforts sur Aèr, Mû succomba aux assauts de Thul, Hyperborée aux glaces d’Akryth et la Lémurie aux épidémies."
        ),
        lore(
          "Valaen Thumbreas prétendit avoir anéanti en Australis les Temples de l’Esprit, de la Fin et de l’Érosion, mais Feynron Darksun révéla son alliance avec les vampires et avec les ténèbres de V’Aagor. En repoussant l’invasion d’Aèr, le premier duc d’Aerilin renforça la légitimité du Temple du Créateur. Celui-ci demeura dès lors le seul Temple reconnu en Atlantide et en Aerilin, tandis que les autres cultes survivaient dans le secret ou sur des terres lointaines."
        )
      ]
    },
    {
      id: "createur-mu",
      title: "La branche mûlienne du Temple de la Création",
      level: 2,
      blocks: [
        lore(
          "Le Temple de la Création possède également une branche mûlienne. Ses rites sont les mêmes que ceux de l’institution atlante, mais les deux hiérarchies entretiennent des relations hostiles, à l’image des deux couronnes qu’elles soutiennent."
        )
      ]
    }
  ],

  "verite-aseryns-temple-esprit": [
    {
      id: "esprit-origines",
      title: "La Dame, l’Esprit & Australis",
      level: 2,
      blocks: [
        lore(
          "Les savoirs hérités de Serathè conduisirent les Aseryns à vénérer quatre principes universels réunis dans le grand Tout : le Père, l’Esprit, l’Érosion et la Fin. La Création et l’Esprit formaient une première paire ; l’Érosion et la Fin, une seconde. Chaque principe associait à l’origine une figure masculine et une figure féminine. Le Père conserva cependant une représentation surtout masculine, car il ne fut jamais confondu avec Serathè comme purent l’être d’autres aspects du Tout."
        ),
        lore(
          "L’Esprit incarne l’intelligence, l’astuce, la magie, les dimensions, l’ombre, l’inconnu et tout ce qui ne relève pas directement de la matière. Face au Père physique et matériel, cette puissance métaphysique fut appelée la Dame, la Marraine ou la Savante. La société atlante, fortement matriarcale, lui accorda une place majeure ; son aspect nocturne resta alors secondaire."
        ),
        lore(
          "Après la crise de Cylonath, les Temples se dotèrent de gardiennes et d’une prêtrise. Celui de l’Esprit avait toutefois une singularité : prier en son sein revenait à rejoindre l’Ombre-Songe, un rêve commun où les fidèles partageaient leurs connaissances. Cette communion empêchait les querelles de naître dans l’enceinte du sanctuaire, si bien que la Dame ne fut pas visée par les premières émeutes."
        ),
        lore(
          "L’alliance de la royauté avec le Temple du Créateur changea cet équilibre. Les prêtresses de l’Esprit vendirent officiellement leurs édifices à leurs rivales et gagnèrent les colonies au nom de la paix ; ce départ constituait en réalité un exode religieux. Amyliriia Athegos fut envoyée en Australis pour contenir le culte, mais les prêtresses l’emprisonnèrent et falsifièrent ses lettres afin de convaincre la couronne que la situation était réglée."
        ),
        lore(
          "Valaen Thumbreas, maître de la Noire-Foudre presque invisible, ouvrit ensuite la pratique religieuse aux hommes et provoqua un schisme. Kaligoora Vathyn, Haute Prêtresse et héritière du pouvoir ducal, répondit par une persécution féroce des hommes dotés de pouvoirs ou prétendant en posséder. Cette répression détourna la population du Temple et renforça Valaen, alors même que celui-ci servait secrètement V’Aagor."
        )
      ]
    },
    {
      id: "esprit-kaligoora",
      title: "Kaligoora, V’Aagor & survivance du culte",
      level: 2,
      blocks: [
        lore(
          "Kaligoora fut tuée et Amyliriia libérée, mais la duchesse légitime ne parvint pas à reprendre une Australis déjà gagnée à V’Aagor. Les esclaves non aseryns rejoignaient Valaen en devenant vampires ou Deimons. La cour atlante reconnut les Vathyn et se méfia de cette Athegos revenue après une longue absence ; les deux camps utilisèrent donc son nom à leurs propres fins. Amyliriia épousa finalement Valaen et la guerre des ténèbres l’opposa à Dolakai Vathyn."
        ),
        lore(
          "Dolakai évacua Australis et prévint Feynron Darksun. Le duc d’Aerilin écrasa l’assaut des vampires et des partisans de Valaen ; celui-ci disparut, tandis qu’Amyliriia fut livrée aux représailles des vampires. Les réfugiés d’Australis, peu nombreux mais profondément attachés à l’ancien Temple, subirent ensuite le mépris des Atlantes. Dolakai lui-même fut tué anonymement par un garde lorsque sa demande d’audience fut rejetée."
        ),
        lore(
          "Le culte de la Marraine se replia alors dans les quartiers pauvres. Par syncrétisme avec les traditions d’Aèr, la Dame devint la Dame Ténèbre ou la Mère du Songe. Ses prêtresses établirent leurs sanctuaires dans des lupanars, où les fidèles entraient dans l’Ombre-Songe par l’extase et partageaient de nouveau leurs connaissances. Difficiles à identifier sans participer aux rites, ces lieux furent tolérés dans les marges, mais le Temple de l’Esprit ne retrouva jamais son ancienne puissance."
        ),
        lore(
          "Le naufrage de l’Atlantide décima encore ce culte, les populations pauvres n’ayant pas été prioritaires lors des évacuations. Sur Aèr, il fut davantage pourchassé ; les rescapés de Mû exécutèrent les hérétiques, tandis que les Hyperboréens assimilèrent la Dame à leurs propres puissances des ténèbres."
        ),
        lore(
          "Lorsque l’Atlantide ressortit des flots, les prêtresses dispersées revinrent autour de Malariel Thumbreas, qui se disait fille d’Amyliriia. Après avoir accompli plusieurs prodiges et rédigé le Rouleau noir, Malariel mourut sans laisser de trace de sa dépouille. Depuis lors, les prêtresses consacrées prennent un nom commençant par « Mala- » et se teignent au moins une mèche en noir."
        )
      ]
    }
  ],

  "verite-aseryns-temple-erosion": [
    {
      id: "erosion-origines",
      title: "Érosion, vieillesse & premier temple",
      level: 2,
      blocks: [
        lore(
          "Le Temple de l’Érosion, aussi appelé Temple de la Ruine, est le plus discret des cultes aseryns. L’Érosion recouvre l’usure, le temps, la dégradation, l’oxydation, la pourriture, le flétrissement et la déchéance. Elle représente la contrepartie de l’Esprit au sein du Tout."
        ),
        table([
          ["Relation cosmologique", "Principes"],
          ["Première paire", "Création et Esprit"],
          ["Seconde paire", "Érosion / Déchéance et Fin"],
          ["Première opposition", "Création ↔ Fin"],
          ["Seconde opposition", "Esprit ↔ Érosion / Déchéance"]
        ]),
        lore(
          "Les anciens Aseryns redoutaient moins la Fin que la lente diminution des êtres et des choses. Le temps finissait par ternir la beauté, la force, l’importance et la mémoire. Cette crainte explique en partie leur rapport souple aux heures, aux jours et aux calendriers : hors des travaux agricoles et de la diplomatie nobiliaire, l’abondance de l’Atlantide permettait de négliger les saisons."
        ),
        lore(
          "Lorsque les disciples de Cylonath attaquèrent le Temple de la Fin, celui de l’Érosion ne se dota pas de gardiennes. Les vieilles femmes de la capitale vinrent y déposer des fleurs et des armes brisées, rappelant les proches qu’elles avaient déjà sacrifiés aux conflits. Elles avertirent ainsi les assaillants du poids des malédictions qu’ils attireraient sur eux ; aucun Cylonathien n’osa profaner le sanctuaire."
        ),
        lore(
          "Le culte resta longtemps sans prêtrise et ne parut pas menacer l’hégémonie du Temple du Créateur. Les fidèles accumulaient cependant objets endommagés, fleurs fanées, ossements d’animaux et biens de malades, jusqu’à transformer les lieux en foyers d’insalubrité."
        ),
        lore(
          "La couronne imposa alors des sanctuaires hors des villes et un contrôle des offrandes. Les premières prêtresses furent autant hospitalières et éboueuses que religieuses. Issues des classes populaires, elles soignaient les malades et récupéraient ce qui portait la marque de la Ruine ; par crainte de la contagion, on leur interdit de quitter l’Atlantide."
        )
      ]
    },
    {
      id: "erosion-kalarai",
      title: "Kalarai, crise & intervention d’Aeridia",
      level: 2,
      blocks: [
        lore(
          "Le naufrage ne détruisit pas le Temple : de nombreuses prêtresses survécurent dans les bulles protégeant les cuves de stase et se nourrirent des Profonds et des Rocréens qui envahissaient les cités. Lorsque Mylakai releva l’Atlantide, les Atlantes venus d’Aèr soupçonnèrent ces survivants d’être corrompus ou hybridés. Ils les enfermèrent dans des réserves et leur interdirent villes et villages."
        ),
        lore(
          "Kalarai Derallos, fils d’une prêtresse de la Ruine, se révolta contre le sort des « Atlantes abyssaux ». Ses sept tentatives échouèrent et il fut soumis au supplice du pâle atlante : son corps, perforé puis suspendu à un fin paratonnerre de Stroethil, resta exposé à la foudre. Une fumée grise et verdâtre finit par s’en dégager. Ceux qu’elle touchait perdaient peu à peu force, cheveux, dents, ongles et facultés avant de vomir à leur tour la poussière de la Ruine. L’épidémie de Kalarai se répandit dans une Atlantide déjà divisée par la guerre contre Mû."
        ),
        lore(
          "La purification électrique du Grand Temple demeura impuissante. Les archimages échouèrent également, car la magie ordinaire ne peut neutraliser directement les pouvoirs primordiaux : Création du Père, Ténèbres de la Dame, Ruine de l’Ancien et Destruction de la Dernière. Les magies divines d’Aèr peuvent les affronter parce qu’elles proviennent elles-mêmes d’une Puissance Majeure, mais aucun équivalent n’existait alors sur Terre."
        ),
        lore(
          "Aeridia Lostmoon, cousine éloignée de la reine Aerilith Darksun, quitta Aèr pour étudier l’épidémie et échapper au mariage qui devait l’unir au vieux Daerden Argurios. Placée dans les réserves, elle constata que les Atlantes abyssaux restaient épargnés au milieu des malades. Elle reprit les anciens rites de l’Érosion et stabilisa le fléau : il ne s’agissait pas d’une maladie, mais d’un déferlement de Ruine qu’aucune prêtresse ne contenait plus."
        ),
        lore(
          "Trente-cinq ans après Kalarai, Aeridia relança sa rébellion et contamina Daerden afin d’obtenir la reconnaissance du culte. Lorinae la tua et sauva l’Atlantide, puis comprit que sa cousine s’était sacrifiée pour contraindre les dirigeants à regarder la vérité. Les réserves furent abolies, puisque loin d’endiguer l’épidémie elles regroupaient justement ceux qui savaient la contenir. Les prêtresses de l’Érosion furent dispersées dans le royaume et placées sous la protection de la noblesse, malgré l’hostilité du Temple du Créateur."
        )
      ]
    },
    {
      id: "erosion-ordre",
      title: "Vieilles, Chevaliers de la Ruine & Foudre vaporeuse",
      level: 2,
      blocks: [
        lore(
          "Le Temple de l’Érosion est aujourd’hui un ordre errant sans infrastructure. Ses prêtresses sont surnommées les « Vieilles », car elles portent sur leur propre corps l’Érosion des êtres qu’elles soulagent. La loi interdit à la noblesse de les approcher et aux prêtresses de posséder un lieu fixe de prédication ou de réclamer la plupart des droits atlantes."
        ),
        lore(
          "En contrepartie, les Vieilles ne paient aucun impôt, circulent sans restriction et peuvent conserver une famille directe, qui choisit de partager ou non leur statut. Le Temple du Créateur leur verse une offrande afin qu’elles puissent se nourrir, se loger et s’équiper."
        ),
        lore(
          "Les Vieilles errent souvent en haillons, avec un sablier à la ceinture et un couteau rouillé cérémoniel. Leur apparence voûtée, ridée et squelettique n’est pas leur âge véritable, mais l’effet de la Ruine qu’elles absorbent. Elles peuvent transférer ce fardeau à leurs ennemis et retrouver alors leur corps réel. Les objets qu’elles touchent risquent de s’oxyder ou de pourrir ; elles prévoient donc toujours de quoi rembourser les dégâts."
        ),
        lore(
          "Chaque prêtresse peut être accompagnée de deux Chevaliers de la Ruine, aussi appelés Chevaliers d’Aeridia. Ces protecteurs ne manient pas eux-mêmes le pouvoir : leur corps, leurs armes et leurs armures servent de vecteurs afin que la Vieille ne porte pas seule son fardeau. Aucun chevalier ne peut rester noble ; il renonce à son statut social lorsqu’il choisit la prêtresse qu’il servira. La Foudre vaporeuse de l’ordre érode les malédictions et les corruptions, mais peut aussi effriter l’âme, la magie et les êtres immatériels."
        )
      ]
    }
  ],

  "verite-aseryns-temple-fin": [
    {
      id: "fin-origines",
      title: "La Fin avant l’hérésie",
      level: 2,
      blocks: [
        lore(
          "Le Temple de la Fin est le dernier des quatre cultes aseryns anciens. Avant Cylonath, rien ne le rendait maléfique. Le Temple de la Création encadrait la mort comme terme de la vie ; celui de l’Esprit, le devenir de l’âme ; celui de l’Érosion, l’effacement progressif des expériences passées ; celui de la Fin permettait enfin aux âmes accomplies de quitter le cycle universel. Toute chose devait s’achever pour que la suivante advienne : la saison, le jour, l’orage, la défaite comme la victoire."
        ),
        lore(
          "Cette doctrine différait des cultes néantistes d’Aèr. Le Néant n’était pas recherché pour lui-même, mais reconnu comme la dernière pièce du Tout. Sans la Fin, la Création deviendrait une répétition infinie, l’Esprit se figerait dans une perfection sans nouveauté et la Ruine condamnerait l’univers à une dégradation éternelle."
        ),
        lore(
          "Les prêtresses maniaient la Foudre du Silence, une décharge si intense qu’elle ne produisait ni tonnerre ni crépitement. Elle convertissait la matière en énergie, puis utilisait cette énergie pour détruire toujours davantage de matière, jusqu’aux plus petites particules. Elle servait aussi bien aux gravures les plus fines qu’à l’anéantissement des créatures des Fléaux. Adr’Aagor, une création de V’Aagor infiltrée au palais, fut ainsi détruit en quelques secondes ; il eut seulement le temps de corrompre l’esprit d’un enfant nommé Cylonath."
        ),
        lore(
          "Cylonath renversa la doctrine. À ses yeux, la Dernière ne pouvait être que la servante du Père : l’honorer comme son égale revenait à prier pour la fin du Tout. Ses partisans affaiblirent le Temple, détruisirent son grand sanctuaire et transformèrent peu à peu un culte nécessaire à l’équilibre en hérésie publique. Peu avant les guerres d’unification, la prêtresse Ellarystè extermina par ailleurs une communauté de renégats convertis à des cultes extérieurs, sans laisser de traces de son intervention."
        )
      ]
    },
    {
      id: "fin-decheance",
      title: "Dothera, Xenarilith, Vhodhal & les Dariath",
      level: 2,
      blocks: [
        lore(
          "Le choix politique de Xenarilith Araenis précipita la chute du Temple. Pour unifier l’Atlantide sous sa bannière, elle rechercha l’appui de Dothera, Haute Prêtresse de la Fin, et compta sur la peur qu’inspiraient ses guerrières. Mais l’ordre était déjà peu nombreux et détesté ; Cylhen Athegos, allié au Temple du Créateur, écrasa Xenarilith et obligea Dothera à se soumettre."
        ),
        lore(
          "Les prêtresses de la Fin refusèrent pourtant de disparaître. À dix reprises, le Temple du Créateur tenta de les assujettir ; à chaque tentative, la Haute Prêtresse de la Fin vint tuer celle d’Atlantis qui avait envoyé les troupes. Le culte resta invaincu, mais devint si redouté que les fidèles cessèrent de le fréquenter."
        ),
        lore(
          "Darilenae Nateas, duchesse d’Elisiel, lui offrit un second âge d’or. Éveillée à la Foudre du Silence et proclamée « Élue de la Fin », elle reçut pour mission d’exterminer ceux dont l’âme ouvrait une voie aux Fléaux. Elle anéantit l’âme de cent quatre-vingt-dix-sept Atlantes et imposa son propre jugement au-dessus de celui du roi et des autres prêtresses. Elle obligea finalement Valyna à intégrer une prêtresse de la Fin à sa garde."
        ),
        lore(
          "Valyna chargea alors Darilenae de rendormir Vhodhal dans les terres sauvages. Elle y rencontra Daemarath, descendant du Fondateur traître Kalirath, qui libéra le Fléau. Darilenae enferma de nouveau Vhodhal, ramena Daemarath comme esclave et fonda avec lui la lignée secrète des Dariath. Leur affinité avec la foudre rivalisait avec celle des Athegos et leur sang descendait plus directement encore des Fondateurs."
        ),
        lore(
          "Après le naufrage, les Dariath s’allièrent politiquement aux Zenos, cousins de la lignée royale Athegos. Sur Aèr, le culte fut traqué jusqu’à sa destruction. À Mû, Erameth Dariath épousa Kyriak Zenos et donna naissance à Saerith Zenos, mais une maîtresse du roi la fit assassiner avant qu’elle puisse former sa fille. Ardinae Morroth reprit alors le culte et profita de l’abandon du cratère de Thul pour y faire édifier le plus grand Temple de la Fin jamais construit."
        )
      ]
    }
  ]
};
