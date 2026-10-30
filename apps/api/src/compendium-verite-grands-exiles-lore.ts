const lore = (text: string) => ({ type: "p", style: "lore", text });
const table = (rows: string[][]) => ({ type: "table", rows });

/**
 * Institutional lore rebuilt from factions_les grands exilés(1)(1).pdf and
 * normalized against TUC_Verite_V7_CROSSAUDIT_2026-09-10.docx.
 * Character biographies remain in the dedicated PNJ payloads.
 */
export const COMPENDIUM_VERITE_GRANDS_EXILES_HUB_LORE_SECTIONS: Record<
  string,
  Record<string, any>
> = {
  "grands-exiles-definition": {
    id: "grands-exiles-definition",
    title: "Grands Exilés — origines, mondes & diasporas",
    level: 2,
    blocks: [
      lore(
        "Le terme Exilé désigne une catégorie historique et sociale, pas une famille biologique. Il concerne principalement les peuples venus d’Aèr par les passages entre les mondes, ainsi que quelques lignées issues de Gaerras, d’Inryase, de Vinndor ou d’autres mondes aujourd’hui disparus. Leur point commun est une histoire de migration intermondiale, non une origine unique."
      ),
      lore(
        "Les cinq grandes communautés exilées de 2035 sont les Elyë, les Whurtens, les Ashylls, les Thulkars et les Azménoriens. D’autres peuples existent en effectifs plus réduits. Les Aseryns occupent une place distincte : nés sur Terre, certains ont survécu sur Aèr avant que leurs descendants ne reviennent, mais leur histoire ne se confond pas avec celle des peuples originaires d’Aèr."
      ),
      lore(
        "Le mot « exil » évoque à tort une arrivée récente. Beaucoup de communautés vivent sur Terre depuis des millénaires ; la plupart de leurs membres actuels y sont nés, parfois comme des dizaines de générations avant eux. Aèr peut être pour eux un héritage, une destination lointaine ou un monde qu’ils n’ont jamais vu."
      ),
      lore(
        "Les sociétés terrestres ne reproduisent donc pas celles de leurs mondes d’origine. Des lignées autrefois séparées se sont brassées, des traditions ennemies ont appris à cohabiter et des institutions nouvelles ont répondu au Voile, à la Guerre de la Magie et aux sociétés humaines. Pour beaucoup, la Terre n’est plus seulement le lieu de l’exil : elle est devenue leur monde."
      )
    ]
  },
  "grands-exiles-histoire": {
    id: "grands-exiles-histoire",
    title: "Portails, Architectes & grandes migrations",
    level: 2,
    blocks: [
      lore(
        "Les traditions exilées attribuent aux Architectes du Créateur plusieurs bases communes de la vie sur les mondes : les Grands Élémentaires, les Ssrynns, les Grands Esprits et la Loi azotée. Sur Aèr, certains Élémentaires éveillés devinrent les Vala’eraï ; sur Terre, des êtres apparentés furent connus comme Nymphes. Les Ssrynns devaient engendrer des espèces clés, tandis que les Grands Esprits nourrirent des lignées divines ou totémiques."
      ),
      lore(
        "La Loi azotée décrit une évolution structurée autour de l’ADN sur plusieurs mondes. Lorsque la magie est abondante, elle atténue certaines divergences et rend possibles des métissages que la seule génétique terrestre expliquerait mal. Cette parenté de forme ne signifie pourtant pas que toutes les espèces partagent un ancêtre récent."
      ),
      table([
        ["Repère", "Événement"],
        [
          "Avant les portails",
          "Les Anciennes Races et les Aseryns disposent déjà de moyens exceptionnels pour franchir les mondes."
        ],
        [
          "Guerres archangéliques",
          "L’intervention aseryne depuis un autre monde conduit Sil’Elaith à engloutir le principal continent atlante."
        ],
        [
          "Âge azménorien",
          "Les Azménoriens établissent les portails des mondes ; de petits groupes migrent notamment par la cité cosmopolite d’Aerethia."
        ],
        [
          "Rébellion d’Elynea",
          "Des armées angéliques asservies sont amenées d’Aèr sur Terre ; la mémoire des anciennes guerres pousse de nombreux Exilés à se dissimuler."
        ],
        [
          "Diasporas terrestres",
          "Les communautés se réorganisent sous la pression des sociétés humaines, du Voile et de la Guerre de la Magie."
        ]
      ]),
      lore(
        "Les voyageurs passés par Aerethia furent souvent des marchands, des aventuriers, des captifs ou des personnes déjà habituées à une cité mêlant de nombreuses espèces. Les Humains d’Aèr constituent une exception : déplacés en plus grand nombre au service des Azménoriens, ils oublièrent leur origine et ne rejoignirent pas les diasporas exilées."
      )
    ]
  },
  "grands-exiles-servants-pluton": {
    id: "grands-exiles-servants-pluton",
    title: "Servants de Pluton",
    level: 2,
    blocks: [
      lore(
        "Les Servants de Pluton sont une résurgence terrestre de la maison Proleyh. Leurs fondateurs comptaient parmi les proches du roi fou Kaless, qui tenta de conquérir puis de détruire Aèr. Plutôt que d’assumer leur participation à sa chute, certains survivants se terrèrent sur Terre et transformèrent la mémoire de la grandeur azménorienne en doctrine clandestine."
      ),
      lore(
        "La faction maîtrise les technologies xéno et entretient des liens rares avec les Extrals, leurs marchés noirs et certains intermédiaires rocréens ou feeshrii. Ses membres apparaissent dans des organisations stratégiques liées à la défense planétaire, à la Chasse, à l’espace ou au commerce extral, sans révéler l’ensemble de leurs fidélités."
      ),
      lore(
        "Leur priorité est de garder la Terre discrète à l’échelle galactique. Ils ne la jugent pas insignifiante, mais dangereusement singulière : elle réunit de nouveau magie, technologie rapide et héritages capables d’attirer des puissances qu’elle ne pourrait pas encore contenir. Cette doctrine les rapproche parfois de l’AIDH tout en les rendant profondément méfiants envers sa façon de gérer le risque."
      )
    ]
  },
  "grands-exiles-lueurs-azmenor": {
    id: "grands-exiles-lueurs-azmenor",
    title: "Lueurs d’Azménor",
    level: 2,
    blocks: [
      lore(
        "Les Lueurs d’Azménor forment un ordre de chevaliers et de paladins opposé aux ambitions dangereuses, aux usages incontrôlés de la magie et aux énergies des Fléaux. Là où les Servants de Pluton privilégient la discrétion stratégique et la technologie, les Lueurs se tournent vers la Chasse et l’intervention directe."
      ),
      lore(
        "Leur histoire les a conduites à vénérer le Néant, qu’elles considèrent comme la seule puissance capable de purger certaines corruptions de Fléaux, marques divines ou altérations magiques du corps. Cette solution rend l’ordre aussi inquiétant que les phénomènes qu’il combat : ses membres cherchent à employer une force d’effacement sans se laisser eux-mêmes absorber par elle."
      )
    ]
  },
  "grands-exiles-eglise-tishane": {
    id: "grands-exiles-eglise-tishane",
    title: "Nouvelle Église Tishane",
    level: 2,
    blocks: [
      lore(
        "La Nouvelle Église Tishane est une faction récente, âgée de moins d’un siècle mais forte d’environ un millier de fidèles. Tous sont des Groelns, peuple gobelin de Gaerras. Ils servent Tishane, la pseudo-humaine qui les a créés, et poursuivent son projet de conquête par l’influence."
      ),
      lore(
        "Les Groelns sont des Driwliens : leur nature marquée les rapproche, par certains mécanismes, des Astharès, des Daemons ou des Angelus, et les rend insensibles à plusieurs formes de pouvoir. L’Église dissimule cette particularité avec efficacité. Les communautés d’Aèr, les acteurs surnaturels terrestres et les Extrals la perçoivent rarement comme une menace ; les ressortissants de Gaerras Seconde sont les principaux à reconnaître son danger."
      )
    ]
  }
};

export const COMPENDIUM_VERITE_GRANDS_EXILES_ARTICLE_LORE_SECTIONS: Record<
  string,
  Array<Record<string, any>>
> = {
  "verite-exiles-conseil-anciens": [
    {
      id: "conseil-fondation",
      title: "Fondation, Guerre de la Magie & dix sièges",
      level: 2,
      blocks: [
        lore(
          "Le Conseil des Anciens fut créé pour unir et protéger sur Terre les peuples qu’Aèr qualifiait de « civilisés ». La diaspora ne conserva toutefois pas toute la diversité du monde d’origine. Les Elyë et les Whurtens devinrent majoritaires ; les Azménoriens restèrent rares, tandis que les lignées archangéliques, daemoniaques, lycanes ou berserks suivirent souvent d’autres trajectoires."
        ),
        lore(
          "Ses premiers ennemis furent aussi bien nouveaux qu’anciens. Certaines communautés aserynes restées sur Terre tenaient les ressortissants d’Aèr pour responsables du cataclysme atlante, contrairement aux lignées accueillies sur Aèr. Cette hostilité historique ne décrit pas tous les rapports modernes, mais elle pesa lourdement sur les premiers siècles du Conseil."
        ),
        lore(
          "Le conflit le plus structurant opposa ensuite les Exilés aux Mages humains. Sur Aèr, la magie éclairait, chauffait, soignait et soutenait la vie ordinaire. Les tentatives des Loges pour en contrôler l’usage privèrent donc certaines communautés de leurs moyens de subsistance et contribuèrent aux famines, aux épidémies et à la Guerre de la Magie."
        ),
        lore(
          "L’Archimage azménorienne Dalametria conçut alors le « poison des Mageius » avec l’aide de R’Gahanath. Anahita tua Dalametria pour empêcher la corruption des Mageius et des Attributs divins, puis repoussa R’Gahanath. Sil’Elaith obtint finalement un compromis permettant aux diasporas de survivre sans que la magie structure encore chaque besoin quotidien."
        ),
        lore(
          "Le Conseil possède dix sièges, renouvelés chaque année. Les élections modifient rarement les grands équilibres, car ancienneté, alliances et réseaux pèsent davantage que la seule procédure. En 2035, le Conseil donne une direction commune et administre des infrastructures, mais il ne constitue pas un État parallèle auquel tout Exilé obéirait automatiquement."
        )
      ]
    },
    {
      id: "conseil-silcenters",
      title: "Silcenters & courants des communautés",
      level: 2,
      blocks: [
        lore(
          "Les Silcenters sont les principaux points de rencontre des Exilés protégés par le Conseil. Ils peuvent occuper l’équivalent d’un grand immeuble, d’un complexe ou d’un quartier et réunissent logements, commerces, écoles, lieux de formation, réseaux de solidarité et espaces adaptés à des morphologies que la Réalité ordinaire rend difficiles."
        ),
        lore(
          "Pour un nouvel arrivant, le Silcenter sert de sas vers le droit terrestre, la monnaie, la conduite, l’informatique, le Holonet et les usages sociaux contemporains. Pour une famille née sur Terre depuis plusieurs générations, il est simplement un quartier où parler d’Aèr et de sa véritable forme ne met personne en danger."
        ),
        lore(
          "Le Conseil donne à ce réseau une dimension politique sans faire de chaque résident le citoyen d’un même gouvernement. Les communautés disposent de quartiers et de courants propres ; certaines bénéficient d’une représentation ancienne, tandis que d’autres utilisent les infrastructures tout en contestant les règles ou l’équilibre des sièges."
        ),
        table([
          ["Courant", "Orientation"],
          [
            "Union Elfique",
            "Préserve cursus, langues et mémoires elyë ; développe la HDS et les Protocoles de Continuité, au risque d’être accusée de lisser les différences."
          ],
          [
            "Iron Law",
            "Courant d’origine whurtenne, ouvert à d’autres peuples, qui recherche des augmentations robustes et intégrées à la physiologie propre de chaque espèce."
          ],
          [
            "Crystal Feathers",
            "Rassemble de rares lignées d’Aèr qui refusent les assimilations terrestres et cherchent une strate de retrait plus profonde que la vie ordinaire sous le Voile."
          ],
          [
            "Green Union",
            "Organise l’intégration et la respectabilité ashyll ; elle accède largement aux Silcenters malgré l’exclusion historique des Gobelins du Conseil."
          ]
        ]),
        lore(
          "Les Protocoles de Continuité apprennent à passer entre états, à agir ensemble et à éviter qu’une crise individuelle ne provoque une rupture publique. La HDS est une spécialisation plus poussée, particulièrement développée par l’Union Elfique ; elle ne résume ni les Silcenters ni l’ensemble de l’éducation exilée."
        )
      ]
    }
  ],
  "verite-exiles-syndicat-jade": [
    {
      id: "jade-origines",
      title: "Peuples dits nuisibles, Porte de Sharmadel & naissance du Syndicat",
      level: 2,
      blocks: [
        lore(
          "Sur Aèr, l’opposition entre peuples « civilisés » et « nuisibles » fut d’abord territoriale et politique. Les cartes reconnaissaient les nations établies ; les espèces nomades, souterraines ou organisées sans territoire visible étaient rejetées hors du monde réputé civilisé. Cette étiquette ne disait rien de leur intelligence, de leur histoire ni de leurs héros."
        ),
        lore(
          "Avant même les portails azménoriens, la Porte de Sharmadel reliait déjà les mondes. Ancien bastion de Val’Erkal enfoui sous terre, elle tomba dans l’empire ashyll d’Araneesha IV. Menacée par les Kweets et par l’approche d’une Ssrynn larvaire, l’impératrice évacua une partie de son peuple vers la Terre."
        ),
        lore(
          "Atreesha II bâtit ensuite un puissant empire souterrain, jusqu’à ce que Motsognir et ses Duergars contraignent les Ashylls à remonter vers la surface. Atreesha tenta d’obtenir une place au Conseil des Anciens et rapprocha les anciens empires des Hordes thulkars. Ses propres ducs et plusieurs chefs de Horde détournèrent cette alliance pour fonder le Syndicat de Jade, indépendant du Conseil."
        ),
        lore(
          "Les Ashylls et les Thulkars forment le cœur historique du Syndicat, mais son réseau a toujours été plus large : Kweets, Gnolls, Cralads, Minotaures, Berserks, Lycans et autres Exilés peuvent y trouver une place. Son identité vient moins d’une espèce que de la circulation clandestine entre communautés exclues des structures officielles."
        ),
        lore(
          "En 2035, le Syndicat est l’une des grandes infrastructures criminelles de l’Underlife de Vérité. Jadecenters, protection, contrebande, courtage occulte et équipes de sécurité relient des marchandises que les circuits légaux ne savent pas transporter. L’appartenance ne crée jamais une ressource : elle apprend qui consulter, quel risque accepter et ce que le réseau demandera en échange."
        )
      ]
    }
  ],
  "verite-exiles-croix-emphyrra": [
    {
      id: "emphyrra-fondation",
      title: "Emphyrra & fondation de la Fédération elfique",
      level: 2,
      blocks: [
        lore(
          "Les Elyë vivent assez longtemps pour porter personnellement des fidélités et des traumatismes vieux de plusieurs siècles. Sur Terre, les lignées sylvaines, grises, belles, noires et d’autres traditions plus locales se sont pourtant brassées. Elles subsistent davantage comme mémoires et cultures que comme sous-races biologiques rigides."
        ),
        lore(
          "Emphyrra fonda la première Fédération elfique avant le Conseil des Anciens. Elle cherchait à garantir la survie des communautés en renonçant aux guerres héritées d’Aèr et en préparant un avenir où la magie pourrait manquer. La faible fécondité elyë rendait aussi nécessaire le rapprochement de lignées capables d’avoir une descendance commune."
        ),
        lore(
          "La Croix d’Emphyrra représente quatre oiseaux : le Faucon de Malachite, le Serpentaire de Citrine, l’Aigle de Larvikite et le Hibou d’Onyx. Ces figures rappellent quatre grands héritages elfiques, mais désignent aujourd’hui des traditions idéologiques auxquelles on adhère par l’éducation, le mentorat et parfois l’épreuve."
        ),
        lore(
          "La fin d’Emphyrra demeure obscure. Les traditions rapportent qu’Obéron et Mirrissi l’écartèrent de leur alliance, et certaines accusent Obéron de l’avoir assassinée ; aucun témoin fiable ne permet de trancher. La Fédération survécut néanmoins et offrit aux opposants d’Obéron une alternative durable au Conseil."
        )
      ]
    },
    {
      id: "emphyrra-quatre-faces",
      title: "Les quatre faces de la Croix d’Emphyrra",
      level: 2,
      blocks: [
        lore(
          "La Fédération se pense comme un tétraèdre : chaque face peut défendre ses intérêts parce que les trois autres protègent son dos. Elle n’exige donc pas l’uniformité recherchée par certaines institutions du Conseil, mais une coopération entre doctrines qui restent parfois profondément hostiles."
        ),
        table([
          ["Face", "Doctrine"],
          [
            "Faucon de Malachite",
            "Autonomie, terrain et proximité avec la nature ; refuse que technologie ou magie deviennent une prison. La tradition accueille aussi des non-Elyë."
          ],
          [
            "Serpentaire de Citrine",
            "Ascendant, exigence lignagère et Haute Magie difficilement accessible ; courant minoritaire, élitiste et distant de la Réalité ordinaire."
          ],
          [
            "Aigle de Larvikite",
            "Fidélité intransigeante aux anciens dieux d’Aèr et à Emphyrra comme prophète ; rejette les cultes terrestres, les Fléaux et les autorités jugées déviantes."
          ],
          [
            "Hibou d’Onyx",
            "Travail avec les Ombres, les Voyageurs et les Deimons ; recherche des symbioses capables de dépasser le corps physique et conserve une forte hostilité envers les Mages."
          ]
        ]),
        lore(
          "Ces branches ne sont ni des espèces ni des destinées de naissance. Elles proposent des réponses différentes à la même question : comment conserver une mémoire elyë très ancienne sans laisser ses anciennes frontières condamner les communautés terrestres à disparaître ?"
        )
      ]
    }
  ],
  "verite-exiles-hordes-orques": [
    {
      id: "hordes-origines",
      title: "La Horde comme institution politico-religieuse",
      level: 2,
      blocks: [
        lore(
          "Les Hordes thulkars sont des institutions politiques, militaires et communautaires héritées d’Aèr. Les Thulkars ayant longtemps vécu sans territoire reconnu, elles assuraient la défense, la cohésion et la continuité du groupe. Leur rudesse ne les rend pas archaïques : une Horde est une doctrine d’action collective, pas une foule guidée par la seule force."
        ),
        lore(
          "Ashorn conduisit sa Horde à travers le portail d’Aerethia après sa victoire, à la recherche de la déesse perdue des Thulkars. Toutes les Hordes terrestres se disent issues de cette Horde Divine, elle-même héritière de la Horde de la déesse. La puissance martiale d’Ashorn sert encore de preuve religieuse et politique à ceux qui revendiquent cette continuité."
        ),
        lore(
          "En 2035, une Horde n’est plus nécessairement un clan nomade tenant un territoire. Elle fixe des règles, transmet une formation et définit une manière de réussir ensemble. Son chef cumule souvent les rôles de commandant, législateur, chaman et grand prêtre ; peu de personnes peuvent conserver durablement cette autorité."
        ),
        lore(
          "La Formation de Horde enseigne des réflexes communs : se déployer, s’épauler, relever un allié et déplacer une formation. Chaque branche donne ensuite un sens différent à cette coordination. Des non-Thulkars peuvent être initiés lorsque leur conduite correspond réellement aux valeurs de la Horde."
        )
      ]
    },
    {
      id: "hordes-branches",
      title: "Hordes terrestres & doctrines de 2035",
      level: 2,
      blocks: [
        table([
          ["Horde", "Orientation"],
          ["Divine", "Tactique, plans, fixation des cibles, ripostes et coordination au service d’un dispositif collectif."],
          ["Abyssale", "Petite branche liée à Grim et à l’essence de Thul ; la corruption qui la renforce l’écarte d’une trajectoire ordinaire."],
          ["Marais", "Opportunisme et réussite concrète ; recrute largement parmi les parias et privilégie le résultat sur la pureté tactique."],
          ["Fantôme", "Intégration dans la Réalité, identités cloisonnées et vies humaines capables de résister à la pression de la Vérité."],
          ["Maudite", "Communauté issue de lignées longtemps isolées ; compense de lourdes fragilités biologiques par la technologie et le savoir."],
          ["Blanche", "Branche carcérale très belliqueuse, marquée par un ancien bannissement de la Horde Divine et par une scission récente avec l’Abyssale."],
          ["Cendres", "Construction, artisanat, infrastructure et logistique conçus comme une doctrine de guerre ; historiquement liée aux chemins de fer."],
          ["Rose", "Polyvalence, éducation, arts et représentation ; contredit volontairement le stéréotype qui réduit les Thulkars à la force brute."],
          ["Métro", "Petite Horde mixte née pendant le Big One pour secourir survivants et parias ; présente surtout à Los Angeles et Las Vegas."]
        ]),
        lore(
          "Une cinquantaine d’autres Hordes mineures existeraient dans le monde. Environ un tiers des Thulkars n’en revendiquent aucune, par attachement exclusif à la Réalité ou par désaccord politique. L’absence de Horde n’entraîne pas automatiquement le rejet, et un changement reste possible lorsqu’une autre doctrine correspond mieux à l’individu."
        )
      ]
    }
  ],
  "verite-exiles-enfants-nidavellir": [
    {
      id: "nidavellir-schisme",
      title: "Nidavellir, clans whurtens & schisme des profondeurs",
      level: 2,
      blocks: [
        lore(
          "Les Whurtens forment sur Aèr un seul peuple organisé en grands clans, non plusieurs espèces naines. Leurs maisons possèdent des habitudes et des politiques différentes, mais les premières diasporas terrestres furent rapidement ramenées à l’unité, d’abord entre elles puis au sein des alliances exilées."
        ),
        lore(
          "Nidavellir était autrefois une dimension terrestre où plusieurs clans whurtens s’installèrent. Après la fusion des dimensions, les Nymphes en chassèrent les Exilés. Les clans revenus des profondeurs rejoignirent ceux de Midgard, mais leur conception de l’alliance divergea : certains se rapprochèrent des Elyë et du Conseil, d’autres des Gorgones et des Deimons."
        ),
        lore(
          "Pendant la Guerre de la Magie, l’Archimage Motsognir enferma dans les profondeurs une part considérable de la magie qu’il refusait de partager. Le Conseil crut les Duergars détruits par cette puissance. Ils survécurent pourtant, se lièrent davantage à l’Ombre et traquèrent des Mages en surface ; l’échec de Mirrissi à vaincre Motsognir contribua à la fin de son règne sur la Chasse Fantastique."
        ),
        lore(
          "L’expression « enfants de Nidavellir » regroupe donc imparfaitement deux trajectoires : les Nibelungen de la surface, dont beaucoup ne vécurent jamais dans cette dimension, et les Duergars des profondeurs, hostiles à la surface et aux principales institutions exilées."
        ),
        table([
          ["Courant", "Position"],
          ["Ymirin", "Force institutionnelle liée aux sièges whurtens du Conseil des Anciens."],
          ["Elegarin", "Nibelungen ouverts au commerce et à la mixité ; opposants aux titulaires des sièges plutôt qu’au Conseil lui-même."],
          ["Traditionalistes", "Nibelungen attachés aux runes, aux clans, aux anciens dieux, aux langues et aux savoirs, méfiants envers le modernisme."],
          ["Nidavellin", "Duergars qui suivent Motsognir comme une figure divine."],
          ["Vagorrin", "Duergars corrompus par le Fléau V’Aagor."]
        ]),
        lore(
          "Les branches duergars restent importantes dans l’histoire whurtenne, mais elles ne représentent pas la trajectoire ordinaire d’un Exilé de 2035. Les différences entre Ymirin, Elegarin et Traditionalistes sont d’abord politiques et culturelles ; elles ne constituent pas des pouvoirs raciaux distincts."
        )
      ]
    }
  ],
  "verite-exiles-ligue-quatre-empereurs": [
    {
      id: "ligue-origines",
      title: "Concile impérial, Atreesha & stratégie d’influence",
      level: 2,
      blocks: [
        lore(
          "La Ligue des Quatre Empereurs, ou Concile impérial, est une faction des Ashylls terrestres. Grâce à la Porte de Sharmadel, l’empire d’Araneesha IV put migrer autrement que par les portails azménoriens. Trois autres empires se formèrent puis s’effondrèrent avant qu’Atreesha, descendante d’Araneesha, ne perde ses domaines souterrains face à Motsognir."
        ),
        lore(
          "Les Gobelins restèrent exclus du Conseil des Anciens malgré les efforts d’Atreesha pour unir les empires et les Hordes thulkars. Ses plus proches serviteurs préférèrent fonder le Syndicat de Jade et conserver leur indépendance. Atreesha rompit avec eux, rallia les Ashylls lésés par le Syndicat et obtint des trois autres héritages impériaux un pacte d’union."
        ),
        lore(
          "Les quatre « empereurs » ne possèdent plus ni empire ni sujets. Ils forment un comité restreint dont Atreesha demeure l’architecte centrale ; les trois autres sièges reviennent à des personnes qu’elle juge capables de représenter et d’administrer les anciens héritages. La Ligue compte peu de membres, mais traite avec soin ceux qu’elle place officiellement à son service."
        ),
        lore(
          "Son pouvoir repose sur des trésors anciens transformés en capitaux, sociétés écrans, contrats et positions de marché. La Ligue ne crée pas magiquement la richesse : elle prépare l’environnement économique jusqu’à ce que l’autre partie comprenne le coût d’un refus avant même que la négociation commence."
        ),
        lore(
          "Son objectif est d’accroître l’influence ashyll et, à terme, de supplanter le Syndicat de Jade afin d’en faire un simple outil de réseau. Elle manque d’effectifs et d’implantations populaires, mais peut menacer des institutions beaucoup plus grandes par ses investissements, ses alliances et des pressions révélées seulement lorsque tout est déjà en place."
        )
      ]
    }
  ],
  "verite-exiles-cercle-ecarlate": [
    {
      id: "cercle-nordrar",
      title: "Nordrar, Astharès & sceau infernal",
      level: 2,
      blocks: [
        lore(
          "Le Cercle Écarlate est la principale faction terrestre issue de Gaerras. Ancienne mais très peu nombreuse, elle entretient une loyauté profonde envers les Daemons de Belial. Son histoire commence avec Nordrar, « père des Astharès », qui créa cinq Archidémons à partir du cadavre titanesque de sa génitrice, une pseudo-Ssrynn."
        ),
        lore(
          "Sur Gaerras Première, le corps, l’âme et les pouvoirs de Nordrar furent séparés dans la Porte infernale. Morrighan conduisit auprès de Belial ce qu’il restait de lui, privé de mémoire et de puissance. Les Astharès transmettaient son essence par le « sceau infernal » ; l’étude de ce mécanisme inspira aux Dieux Anciens une partie des marques accordées à leurs Héros."
        ),
        lore(
          "Le sceau astharès n’est pas en lui-même une corruption forcée : la marque daemoniaque distingue une âme déjà loyale. Les Seigneurs Écarlates servirent Belial et consolidèrent sa Cour, tandis que Nordrar combattait les Dives et participait à une diplomatie rendue possible par son maître."
        ),
        lore(
          "Nordrar disparut après avoir été tué par un Fléau mineur, puis une Architecte le ramena sur Gaerras dans le corps d’un noble kotsu. Son absence interrompit la croissance de son fils Caïn. Dans le même temps, la multiplication des Astharès consomma tant de magie que Belial leur accorda une ancienne dimension des Dives pour les contenir. La fusion ultérieure des dimensions les ramena sur Terre."
        )
      ]
    },
    {
      id: "cercle-survivants",
      title: "Purges, Makhanorea & projet du Nor",
      level: 2,
      blocks: [
        lore(
          "Lorsque Caïn devint adulte, la puissance des Astharès augmenta brutalement. Belial et Anahita le scellèrent pour éviter un désastre magique. R’Gahanath perça ensuite une partie des secrets du sceau infernal et corrompit certains Astharès, provoquant une guerre entre les Héros des dieux, les marqués corrompus et ceux qui tentaient de rester cachés."
        ),
        lore(
          "Après la rébellion d’Elynea, les Archanges purgèrent les communautés de Gaerras sans distinguer Astharès et autres réfugiés. Le sceau pouvait défaire des marques divines ou angéliques et servir de porte à V’Aagor ; cette menace réelle devint le prétexte d’une persécution générale. Les anciens Seigneurs Écarlates fondèrent le Cercle pour sauver les survivants."
        ),
        lore(
          "La destruction de Vinndor amena plus tard d’autres Astharès et quelques Dornfyrels. Le Cercle resta une société secrète, méfiante et peu populeuse. Il vénère Makhanorea, la « déesse-mère », et cherche à former un couple divin autour de Nordrar et Caïn. Il revendique aussi l’actuel Enfer de Méphisto, vestige de la dimension autrefois donnée aux Astharès."
        ),
        lore(
          "La marque de Caïn, obtenue par la tromperie de R’Gahanath, est une variante plus corruptive du sceau infernal. Elle relie Caïn aux Vampires krovni comme Nordrar l’est aux Astharès, mais l’exposerait à V’Aagor s’il ouvrait pleinement ce lien. Belial refuse donc de le libérer tant qu’il ne le juge pas capable de survivre à cette confrontation."
        ),
        lore(
          "Le grand projet du Cercle est de créer un Astharès capable de devenir un Nor, être parfait selon sa doctrine. Ses tentatives ont déjà provoqué des invocations forcées, notamment celles de Rilka et de Zehol, puis l’arrivée d’Erea. La faction recherche ainsi moins une armée qu’une puissance divine apte à garantir enfin la survie de son peuple."
        )
      ]
    }
  ]
};
