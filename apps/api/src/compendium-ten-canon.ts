export const COMPENDIUM_TEN_CANON_SOURCE = "Canon de campagne · Les Ten";

export const COMPENDIUM_TEN_PAGE_ARTICLE = {
  id: "realite-les-ten",
  dataset: "ten-canon",
  category: "Réalité",
  sourceCategory: "Réalité",
  title: "Les Ten",
  source: COMPENDIUM_TEN_CANON_SOURCE,
  status: "canon_enrichi",
  rebuildV2: true,
  tags: ["Réalité", "Ten", "Californie", "Personnages-pivots"],
  sections: [
    {
      id: "ten-realite-introduction",
      title: "Les dix femmes les plus importantes de Californie",
      level: 2,
      blocks: [
        {
          type: "p",
          text: "En 2035, l’expression « les Ten » désigne dix femmes dont l’influence traverse la politique, la justice, les forces publiques, les sciences, les médias, les corporations, les réseaux indépendants et les communautés californiennes. Elles ne constituent pas une organisation formelle : leur importance vient de leurs trajectoires individuelles et de la place qu’elles occupent dans la transformation de la Californie."
        },
        {
          type: "table",
          rows: [
            ["Figure", "Rôle majeur dans la Réalité"],
            ["Veronica Silver", "Détective privée et Arbitre des Crawlers"],
            ["Catalina de la Caza", "Direction de la police de Los Angeles"],
            ["Dina Page", "Présidente de Californie"],
            ["Farah el Arshad", "Présidente de la Cour suprême de Californie"],
            ["Leslie Wright", "Scientifique majeure, « mère du monde moderne »"],
            ["Makana Keahi", "Directrice du CBII"],
            ["Wei Shi", "Journaliste et dirigeante éditoriale de premier plan"],
            ["Siobhain Nic Sirideain", "Présidente de Tuatha et puissance médiatique et industrielle"],
            ["Tokala", "Dirigeante de Tala et figure majeure de la Grande Réserve"],
            ["Svetlana Konstantinovna", "Cheffe cuisinière et restauratrice de renommée internationale"]
          ]
        }
      ]
    },
    {
      id: "ten-realite-role",
      title: "Dix trajectoires qui redessinent la Californie",
      level: 2,
      blocks: [
        {
          type: "p",
          text: "Leur influence ne se limite pas à leur fonction officielle. Les Ten relient entre elles des sphères qui communiquent habituellement peu : gouvernement, justice, armée, police, recherche, renseignement, médias, corporations, Crawlers et nations natives. Certaines se connaissent depuis la guerre, d’autres se croisent par leurs fonctions ou leurs réseaux. Ensemble, sans former de conseil ni de faction, elles constituent les principaux points de bascule humains de la Californie de 2035."
        }
      ]
    },
    {
      id: "ten-verite-ancres",
      title: "Dossier MJ · Les dix ancres de la Vérité",
      level: 2,
      audience: "mj",
      blocks: [
        {
          type: "p",
          text: "Dans la Vérité, la convergence est plus profonde encore : les Ten sont les dix ancres majeures de la Vérité et des changements qui la traversent. Chacune devient le point d’incarnation, de réunion ou de transformation d’un pan fondamental du monde occulte."
        },
        {
          type: "table",
          rows: [
            ["Ten", "Ancre de Vérité"],
            ["Veronica Silver", "Grande reine Aseryn légitime ; héritière de Kalira Athegos et Kyriak Zenos ; Architecte de la Création"],
            ["Catalina de la Caza", "V’Aagorlina : fusion de Catalina et de V’Aagor, Roi des Fléaux"],
            ["Svetlana Konstantinovna", "Descendante directe d’Elynea ; Nephilim divin et prophète"],
            ["Leslie Wright", "Attribut Divin du Génie ; Merlin comme Mageius ; lignée d’Arthur et Morrighan ; réincarnation de l’âme d’Ymir"],
            ["Siobhain Nic Sirideain", "Héritière de Morrighan et ancre du Sidh"],
            ["Tokala", "Khinae éveillée puis Nnyrss, le Khinae parfait"],
            ["Makana Keahi", "Descendante divine et incarnation de Sumarbrander, l’épée de Surtr"],
            ["Wei Shi", "Héritière du clan Shi ; devient accidentellement une forme de Légionnaire du Néant"],
            ["Farah el Arshad", "Héritière d’Akvan et de Gaïa ; couronne des Dives et des Nymphes"],
            ["Dina Page", "Maîtresse des esprits et de la mort ; manifestation de Helheim"]
          ]
        }
      ]
    }
  ]
} as Record<string, any>;

export const COMPENDIUM_TEN_PAGE_NAVIGATION = [
  {
    id: "realite-les-ten",
    dataset: "ten-canon",
    category: "Réalité",
    group: "Les Ten",
    groupOrder: 44,
    subgroup: "Vue d’ensemble",
    subgroupOrder: 1,
    pageOrder: 1,
    displayTitle: "Les Ten"
  }
] as Array<Record<string, any>>;

const truthSection = (text: string) => ({
  id: "ten-canon-ancre-verite",
  title: "Dossier MJ · Ancre de Vérité",
  level: 2,
  audience: "mj",
  blocks: [{ type: "p", text }]
});

export const COMPENDIUM_TEN_TRUTH_ENRICHMENTS = [
  {
    targetId: "pnj-crawlers-docx-veronica-silver",
    section: truthSection("Veronica Silver est avant tout la grande reine Aseryn légitime. Elle est la fille de Kalira Athegos, dernière reine Aseryn de l’époque où le peuple était encore unifié, et la petite-fille de Kyriak Zenos. Sa trajectoire doit la conduire à réunifier les Aseryn. À cette souveraineté s’ajoute sa nature d’Architecte : une entité liée à la Ténèbre et à l’organisation conceptuelle de la Création.")
  },
  {
    targetId: "pnj-police-catalina-de-la-caza",
    section: truthSection("Catalina a fusionné avec V’Aagor et devient V’Aagorlina : une nouvelle réalité où subsiste la volonté de Catalina tout en incarnant V’Aagor, le Roi des Fléaux. Elle ne porte donc pas seulement ses pouvoirs : elle est devenue le point d’incarnation du souverain des Fléaux.")
  },
  {
    targetId: "pnj-ten-svetlana-konstantinovna",
    section: truthSection("Svetlana Konstantinovna descend directement d’Elynea, le Dieu Unique. Elle est techniquement un Nephilim divin et un prophète, ce qui explique l’ampleur de ses capacités liées aux anges, à la lumière divine, aux marques et aux Attributs. Cette nature est distincte de son secret criminel : Svetlana est également Arkhangel, identité connue uniquement dans les informations MJ.")
  },
  {
    targetId: "pnj-crawlers-docx-leslie-wright",
    section: truthSection("Leslie Wright est la « mère du monde moderne » et la porteuse de l’Attribut Divin du Génie. Elle est Merlin au sens où Merlin est le Mageius, et non la personne historique : cette formulation doit éviter toute fusion d’identité avec l’ancien Merlin/Myrddin. Leslie descend de Mordred, donc d’Arthur et de Morrighan, et elle est en outre la réincarnation de l’âme d’Ymir.")
  },
  {
    targetId: "pnj-corporations-siobhain-nic-siridean",
    section: truthSection("Siobhain est une héritière directe de Morrighan et l’une des expressions majeures de sa lignée. Son éveil la relie au Sidh jusqu’à pouvoir en devenir une incarnation et canaliser les puissances de la fratrie de Morrighan qui y est reliée.")
  },
  {
    targetId: "pnj-corporations-tokala",
    section: truthSection("Tokala est une Khinae, et non une louve-garou. Elle s’éveille d’abord comme Khinae puis affronte les autres Khinae corrompus. Grièvement blessée et initialement dépassée, elle connaît un nouvel éveil : elle réveille les souvenirs et la puissance de la Ssrynn à l’origine des Khinae et atteint l’état de Nnyrss, un être supérieur décrit comme le Khinae parfait.")
  },
  {
    targetId: "pnj-agences-makana-keahi",
    section: truthSection("Makana est une descendante divine et l’incarnation de Sumarbrander : elle n’est pas simplement la porteuse de l’épée de Surtr, elle est aussi l’épée. Son héritage se relie également à Alabor et Belial et au pacte de la mer et du feu.")
  },
  {
    targetId: "pnj-corporations-wei-shi",
    section: truthSection("Avant son basculement de 2035, Wei Shi est d’abord liée au clan Shi, dont le corpus doit encore être complété. Lors de l’Œuf de l’Apocalypse, elle arrache les pouvoirs d’un Légionnaire du Néant pour empêcher sa survie et devient accidentellement une forme de Légionnaire du Néant.")
  },
  {
    targetId: "pnj-gouvernement-farah-el-arshad",
    section: truthSection("Farah est l’héritière conjointe d’Akvan et de Gaïa : une nature proche des Dives sans Mageius, avec des dons de Nymphe et de Djinn. Elle devient Akva’Farah et reçoit les couronnes d’Akvan et de Gaïa, faisant d’elle une souveraine des Dives et des Nymphes.")
  },
  {
    targetId: "pnj-gouvernement-dina-page",
    section: truthSection("Dina est une maîtresse des esprits et de la mort. Son héritage psychopompe passe par Papa Legba et Mammon ; son éveil révèle qu’elle ne détient pas simplement la clé de Helheim : elle est une manifestation de Helheim, incarnation du royaume des morts et portail vers les enfers terrestres.")
  }
] as Array<Record<string, any>>;
