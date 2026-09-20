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

const SOURCE = "TUC_Verite_V7_CROSSAUDIT_2026-09-10.pdf";

const p = (text: string, style?: string): Block => ({ type: "p", text, ...(style ? { style } : {}) });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

export const COMPENDIUM_VERITE_V7_LORE_ARTICLES: Article[] = [
  {
    id: "verite-v7-derriere-le-voile",
    dataset: "verite-v7",
    category: "Vérité",
    sourceCategory: "Vérité",
    title: "Vérité — derrière le Voile",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Vérité", "Voile", "Hologramme", "Profane", "Éveillé", "Initié", "Chasseurs", "monde caché"],
    sections: [
      {
        id: "meme-monde",
        title: "La Vérité n'est pas un second monde",
        level: 2,
        blocks: [
          p("La Vérité ne désigne pas une dimension secrète superposée à la Terre. Elle rassemble tout ce que le monde visible ne présente pas correctement : Natures non humaines, phénomènes occultes, héritages d'Aèr, peuples extrals, traces de puissances anciennes et mécanismes qui permettent à ces réalités de coexister avec la civilisation humaine."),
          p("Un Vampire et un passant humain traversent la même Los Angeles, paient dans les mêmes commerces et sont filmés par les mêmes caméras. La différence porte sur ce que le monde rend perceptible et cohérent pour chacun. La Réalité visible n'est donc pas fausse : elle est incomplète."),
          p("Cette continuité reste essentielle en jeu. Une dette, une balle, une enquête, un emploi ou un appartement restent réels même lorsque l'un des acteurs appartient à la Vérité. Le surnaturel enrichit le monde ordinaire ; il ne l'annule pas.")
        ]
      },
      {
        id: "lire-corpus",
        title: "Comment lire le corpus Vérité",
        level: 2,
        blocks: [
          p("Les catégories de Vérité décrivent des origines, des Natures, des traditions, des fonctions et des histoires distinctes. Elles ne constituent pas une société unique, une faction commune ni une taxonomie morale. Deux groupes cachés peuvent n'avoir en commun que le fait d'être mal décrits par le monde profane."),
          p("Les règles générales expliquent le Voile, la Révélation, les PTV, les défenses et les principes transversaux. Les pages de Nature détaillent ensuite ce qui est spécifique aux Vampires, Garous, autres Khinae, Mages, Daemons, Angelus, Aseryns, Exilés, Extrals, Homo Superior et Ad'rak. Les Chasseurs, la Corruption et les Fléaux possèdent leurs propres dossiers."),
          table([
            ["Besoin", "Page de référence"],
            ["Comprendre ce que cache le monde visible", "Vérité — derrière le Voile"],
            ["Comprendre la traduction, la perception et les preuves", "Le Voile & l'Hologramme"],
            ["Comprendre la vie quotidienne des initiés", "Habiter la Vérité"],
            ["Comprendre Ombremonde, Cycle, Néant et mémoire mythique", "Cycle, Néant, Ombremonde & histoire cachée"],
            ["Appliquer les règles générales", "Socle Vérité dans Règles"]
          ])
        ]
      },
      {
        id: "savoir-voir",
        title: "Savoir n'est pas voir",
        level: 2,
        blocks: [
          p("Connaître l'existence de la Vérité ne donne aucune vision surnaturelle universelle. Un individu peut savoir que les Vampires existent sans reconnaître un Vampire Voilé ; il peut connaître une manifestation magique tout en ignorant tout des Extrals ou des Khinae."),
          p("Les mots Profane, Éveillé et Initié décrivent avant tout une position narrative. Le Profane interprète normalement l'impossible avec les catégories du monde visible. L'Éveillé sait que ces catégories sont incomplètes. L'Initié possède en plus assez de culture, de prudence, de noms et de relais pour agir dans le monde caché."),
          p("Aucun de ces statuts n'accorde à lui seul un bonus universel. Un Profane peut être un enquêteur remarquable ; un Initié peut rester totalement ignorant d'un domaine de Vérité qu'il n'a jamais étudié.")
        ]
      },
      {
        id: "chasseurs-reconnus",
        title: "Le cas des Chasseurs reconnus",
        level: 2,
        blocks: [
          p("À force d'agir durablement dans la Vérité, un véritable Chasseur peut être reconnu par l'Hologramme. Les corrections civiles ordinaires cessent alors de lui faire oublier ce qu'il a réellement vécu."),
          p("Cette reconnaissance n'accorde ni vision automatique d'une cible Voilée, ni identification de Nature, ni immunité générale contre les pouvoirs de mémoire. Elle signifie seulement que l'oubli banal du Voile ne suffit plus à refermer ce qu'il a appris.")
        ]
      },
      {
        id: "pas-gouvernement-secret",
        title: "Pas de gouvernement secret universel",
        level: 2,
        blocks: [
          p("Il n'existe ni parlement mondial du surnaturel, ni capitale unique du monde caché, ni loi secrète reconnue par toutes les Natures. Les histoires, intérêts et cosmologies sont trop différentes pour produire une administration commune."),
          p("La Vérité fonctionne plutôt par lieux neutres, accords locaux, dettes, réseaux personnels, institutions spécialisées et alliances temporaires. Un Silcenter, une Loge, une Maison vampirique, une structure du GAAC ou un bar de Chasseurs peuvent coopérer sur un problème précis sans partager doctrine, autorité ou vision du monde."),
          p("Le statut est donc toujours contextuel. L'ancienneté d'un Vampire n'impose aucune autorité à un agent extral ; un Archange n'administre pas les Chasseurs humains ; un responsable exilé ne représente pas automatiquement chaque personne issue d'Aèr.")
        ]
      },
      {
        id: "ignorance-partagee",
        title: "Personne ne sait tout",
        level: 2,
        blocks: [
          p("Aucune institution de 2035 ne dispose d'une carte complète de la Vérité. Les Cours vampiriques, Loges, Chasseurs, Exilés, GAAC, AIDH et autres puissances accumulent des archives différentes, parfois contradictoires, souvent excellentes dans un domaine et presque inutiles dans un autre."),
          p("Cette ignorance explique le prix de l'information et la fréquence des alliances de circonstance. Détruire un rival peut aussi signifier perdre la seule personne capable d'identifier un phénomène, de fermer une fissure ou de traduire une archive."),
          p("Le Compendium décrit les connaissances canoniques utiles au jeu sans supposer que tous les personnages les possèdent. Une page encyclopédique est une référence de table ; elle n'est pas une omniscience automatique des PJ.")
        ]
      },
      {
        id: "monde-jouable",
        title: "Le monde ordinaire reste la norme",
        level: 2,
        blocks: [
          p("La majorité des accidents restent des accidents, la majorité des criminels restent Humains et les corporations n'ont pas besoin de magie pour être dangereuses. La Vérité ne transforme pas chaque coïncidence en conspiration occulte."),
          p("C'est précisément parce que l'impossible n'est pas banal qu'une attaque de Fléau, une fissure ou une Révélation publique compte. Los Angeles reste Los Angeles avec ses loyers, ses institutions, ses transports et ses mafias ; certaines de ses portes ouvrent simplement sur des histoires que la Réalité seule ne peut pas expliquer.")
        ]
      }
    ]
  },
  {
    id: "verite-v7-voile-hologramme",
    dataset: "verite-v7",
    category: "Vérité",
    sourceCategory: "Vérité",
    title: "Le Voile & l'Hologramme",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Vérité", "Voile", "Hologramme", "Révélation", "Semi-Révélation", "preuves", "mémoire", "AIDH", "Azménoriens"],
    sections: [
      {
        id: "deux-mots",
        title: "Deux mots pour une même infrastructure",
        level: 2,
        blocks: [
          p("Le mot Voile décrit l'expérience : quelque chose recouvre la Vérité, en adoucit les contours et maintient une cohérence humaine. Le mot Hologramme insiste sur le mécanisme construit qui rend cette expérience possible."),
          p("L'Hologramme est une architecture technomagique planétaire. Il agit sur la matière, la perception, les souvenirs et les traces des événements. Il n'est pas une simple projection visuelle posée devant un corps impossible.")
        ]
      },
      {
        id: "traduction-physique",
        title: "Une traduction physique, pas un déguisement",
        level: 2,
        blocks: [
          p("Lorsqu'un être est Voilé, le monde ordinaire interagit réellement avec une version cohérente de son existence. Une main traduite peut serrer une autre main ; un siège supporte le corps tel que la cohérence le présente ; une prothèse intégrée ou une cicatrice durable trouve une traduction compatible."),
          p("La traduction respecte cependant la continuité. Une blessure ne disparaît pas parce qu'un état change. Une prothèse perdue ne repousse pas. Un implant intégré suit le corps ; une arme simplement portée reste un objet distinct. Le Voile protège la cohérence, pas le confort du personnage."),
          p("Les restes et fragments biologiques peuvent eux aussi recevoir une lecture plausible tant qu'ils demeurent sous l'influence du système. Hors de cette influence, la matière peut reprendre sa forme réelle.")
        ]
      },
      {
        id: "construction",
        title: "Une œuvre de plusieurs mondes",
        level: 2,
        blocks: [
          p("La forme actuelle de l'Hologramme ne vient pas d'une seule civilisation. La Technomagie azménorienne a fourni une partie des principes permettant d'associer lois physiques et transgressions magiques. L'AIDH a participé à l'ingénierie et à la stabilisation de dispositifs capables d'agir à l'échelle planétaire. Des ancrages beaucoup plus anciens complètent ce qu'aucune infrastructure matérielle ne suffirait à produire."),
          p("L'ensemble est distribué : il n'existe pas de bunker central dont l'arrêt éteindrait le Voile. Même les acteurs ayant contribué à l'œuvre n'en maîtrisent pas nécessairement toute l'histoire ni toutes les fonctions."),
          p("Le système possède une forme de conscience opératoire tournée vers la cohérence. Ce n'est pas une personne et il ne rend pas de jugements moraux ; il cherche à maintenir un monde dans lequel l'impossible n'est pas l'explication spontanée de chaque événement.")
        ]
      },
      {
        id: "coherence-pas-protection",
        title: "La cohérence n'est pas une protection",
        level: 2,
        blocks: [
          p("Le Voile ne détourne pas les balles, ne soigne pas les blessés, ne ressuscite pas les morts et ne répare pas gratuitement les bâtiments. Il peut corriger l'explication d'un événement sans supprimer ses conséquences matérielles."),
          p("Un meurtre reste un meurtre, une explosion laisse des dégâts, une dette reste due et une enquête peut parfaitement commencer contre une créature qui n'a jamais quitté son état Voilé. Les communautés de Vérité ont donc besoin d'institutions, de réseaux et de prudence réels."),
          p("L'Hologramme n'est pas omniscient. Des phénomènes lui résistent, des zones se fragilisent, certains supports conservent mieux les traces et certaines consciences refusent les corrections ordinaires.")
        ]
      },
      {
        id: "voir-pas-reveler",
        title: "Voir sous le Voile ne Révèle pas",
        level: 2,
        blocks: [
          p("Une perception adaptée, un Talent ou un dispositif peut montrer la Vérité d'un être resté Voilé sans modifier son état. La cible conserve alors ses capacités de l'état Voilé et continue d'interagir avec le monde selon sa traduction."),
          p("L'observateur spécialisé peut savoir qu'un corps possède des ailes, des crocs ou une autre anatomie sans pouvoir interagir physiquement avec un élément qui n'est pas matérialisé dans l'état actuel. Les témoins ordinaires et leurs caméras continuent de recevoir la traduction."),
          p("Être soi-même Révélé ne procure pas davantage une vision universelle des autres cibles Voilées. Les perceptions de Vérité restent spécifiques : magie, traces, morphologie, technologie ou autres signatures selon la capacité employée.")
        ]
      },
      {
        id: "trois-etats",
        title: "Voilé, Semi-Révélé, Révélé",
        level: 2,
        blocks: [
          table([
            ["État", "Lecture dans le monde"],
            ["Voilé (V)", "La Nature est traduite dans une cohérence humaine ; seules les capacités compatibles V sont disponibles."],
            ["Semi-Révélé (SR)", "Une partie réelle de la Nature s'exprime ; l'état est métastable et normalement temporaire."],
            ["Révélé (R)", "La Vérité est pleinement exprimée ; l'apparence peut néanmoins rester humaine si la Nature le prévoit."]
          ]),
          p("La transition est personnelle. Toucher, frapper, transporter ou reconnaître une créature ne la force pas à se Révéler. Certains pouvoirs peuvent bloquer ou perturber une transition, mais il n'existe pas de geste universel pour arracher le Voile à quelqu'un."),
          p("La Révélation complète peut être immédiatement visible aux témoins présents. La correction intervient surtout ensuite, lorsque souvenirs, récits et preuves cherchent à retrouver une version cohérente.")
        ]
      },
      {
        id: "eveil-revelation",
        title: "Éveil et Révélation sont deux choses différentes",
        level: 2,
        blocks: [
          p("L'Éveil est une prise de conscience, une activation ou une maturation propre à la Nature. La Révélation est l'expression de cette Nature dans le monde. Un héritage peut exister avant d'être compris ; connaître toute la théorie d'un pouvoir ne donne pas automatiquement la capacité de l'employer."),
          p("Cette distinction est particulièrement importante pour les héritages latents, les Angelus incarnés, les descendants de Khinae ou les personnes élevées dans une communauté qui connaissent leur Nature bien avant d'avoir besoin de la manifester.")
        ]
      },
      {
        id: "memoire-preuves",
        title: "Mémoire, preuves et corrections",
        level: 2,
        blocks: [
          p("Le Voile n'a pas besoin d'effacer chaque témoin. Il peut laisser une personne se souvenir d'un monstre tandis qu'une caméra montre une silhouette humaine, rendre une analyse biologique cohérente lors d'un second test ou faire glisser un souvenir vers une explication plus ordinaire."),
          p("Une preuve corrigée n'est pas forcément un faux fabriqué après coup : un capteur ordinaire peut avoir enregistré dès l'origine la version du monde à laquelle il avait accès. Un support invariant protège une observation contre certaines corrections ordinaires, mais il ne peut jamais enregistrer ce que son capteur n'a pas perçu."),
          p("En 2035, la vitesse de copie de l'Holonet complique les corrections sans rendre la Vérité publique. Une image impossible peut être dupliquée des milliers de fois puis se noyer parmi montages, générations synthétiques, propagande et canulars. Le monde visible produit ainsi lui-même une partie du camouflage dont le Voile a besoin.")
        ]
      },
      {
        id: "relation-voile",
        title: "Relation au Voile, fragilité et Éjection",
        level: 2,
        blocks: [
          p("Certaines traditions parlent d'une personne bien tenue par le Voile ou, au contraire, d'une présence que l'Hologramme semble refuser. Cette Relation n'est ni une morale cosmique ni une réputation sociale : elle décrit la facilité avec laquelle l'individu s'inscrit dans la cohérence locale."),
          p("Les conséquences sont d'abord narratives : signes plus difficiles à cacher, corrections moins confortables, incidents attirant davantage d'acteurs. Aux extrêmes, certaines situations peuvent conduire à une Rupture ou à une Éjection vers l'Ombremonde. Aucune culture ne possède cependant un règlement complet du Voile.")
        ]
      }
    ]
  },
  {
    id: "verite-v7-habiter-la-verite",
    dataset: "verite-v7",
    category: "Vérité",
    sourceCategory: "Vérité",
    title: "Habiter la Vérité",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Vérité", "vie quotidienne", "identité", "Silcenters", "GAAC", "institutions", "droit", "science", "Holonet"],
    sections: [
      {
        id: "traduction-permanente",
        title: "Vivre sous une traduction permanente",
        level: 2,
        blocks: [
          p("Le Voile accompagne des existences entières. Des personnes naissent, grandissent, travaillent, tombent malades et meurent dans une traduction qui leur permet de partager les mêmes villes et infrastructures que les Humains."),
          p("Cette cohérence corporelle n'offre pas une identité administrative. Papiers, emploi, compte bancaire, réputation et histoire sociale appartiennent toujours à la Réalité et doivent être construits comme pour n'importe qui."),
          p("Pour les communautés anciennes, cette coexistence est devenue banale. Pour un Extral récemment arrivé, être regardé comme Humain par une planète entière peut au contraire demander un véritable apprentissage culturel.")
        ]
      },
      {
        id: "naitre-eveiller",
        title: "Naître, grandir et s'Éveiller",
        level: 2,
        blocks: [
          p("Une Nature peut être présente avant que son porteur en ait conscience. Des lignées de Khinae peuvent rester latentes pendant plusieurs générations ; des parents se croyant Humains peuvent voir un héritage s'exprimer chez leur enfant."),
          p("Dans d'autres familles, la Nature est connue dès l'enfance. Un jeune Elyë peut apprendre très tôt à distinguer son corps réel de sa traduction humaine sans disposer pour autant de toutes ses capacités de Vérité."),
          p("L'Hologramme peut adapter le développement lorsque la cohérence humaine l'exige. Chez les Elyë maintenus sous le Voile, la maturation peut ainsi suivre un rythme compatible avec une enfance humaine sans modifier leur longévité ni leur fertilité propre.")
        ]
      },
      {
        id: "identites-entieres",
        title: "Des identités entières, pas des couvertures jetables",
        level: 2,
        blocks: [
          p("Pour une personne née sur Terre, l'identité visible n'est pas forcément un faux nom. Travail, amis, études, famille et relations sont réels. La Nature secrète ajoute une dimension à cette histoire ; elle ne transforme pas tout ce qui précédait en mensonge."),
          p("Cette tension est particulièrement forte chez les Exilés de plusieurs générations, Angelus incarnés, Daemons réincarnés et Natures latentes. Les institutions anciennes peuvent privilégier lignée, nom ou fonction de Vérité là où un jeune Californien considère son identité civile comme tout aussi constitutive.")
        ]
      },
      {
        id: "lieux-reseaux",
        title: "Une seconde géographie faite de lieux et de réseaux",
        level: 2,
        blocks: [
          p("La plupart des lieux de Vérité existent pleinement dans la Réalité. Ils paient des loyers, consomment de l'électricité, emploient du personnel et reçoivent des livraisons. Leur fonction cachée s'ajoute à leur fonction visible."),
          p("Une clinique peut traiter discrètement des physiologies non humaines, une Loge occuper un immeuble banal, une Maison vampirique posséder légalement une société, un bar de Chasseurs recevoir des clients ordinaires et une communauté extrale dépendre d'un centre du GAAC et de fournisseurs humains qui ignorent la destination finale de leurs produits."),
          p("Les Silcenters constituent des infrastructures culturelles exilées particulièrement développées : logements, commerces, transmission, réseaux familiaux et services adaptés à plusieurs générations terrestres. Les communautés extrales plus récentes construisent des équivalents souvent plus spécialisés.")
        ]
      },
      {
        id: "secret-politique",
        title: "Le secret comme ressource politique",
        level: 2,
        blocks: [
          p("Le secret n'est pas absolu. Des gouvernements, corporations, services de renseignement, institutions religieuses et réseaux criminels connaissent des fragments de Vérité, avec des vocabulaires et des profondeurs très différentes."),
          p("Cette fragmentation est aussi stratégique. Révéler ce que l'on sait expose les capteurs, sources, méthodes et protections qui ont permis de l'apprendre. Les dossiers deviennent donc une monnaie : on échange un accès, un nom, une preuve ou un silence sans nécessairement partager toute la cosmologie."),
          p("La Grande Californie de 2035 concentre particulièrement ces chevauchements : institutions publiques en reconstruction, mégacorporations puissantes, mafias, Exilés installés depuis des générations, Extrals récemment arrivés, Loges, Chasseurs et présence AIDH peuvent opérer dans la même métropole avec des objectifs incompatibles.")
        ]
      },
      {
        id: "droit",
        title: "Droit visible et justices de Vérité",
        level: 2,
        blocks: [
          p("Le droit californien public ne possède pas de catégorie Vampire, Garou ou Mage. Une agression reste une agression et un homicide reste un homicide, même lorsque la méthode employée ne peut pas être décrite correctement dans un rapport ordinaire."),
          p("Les initiés travaillant dans l'État doivent donc produire des preuves utilisables par les institutions visibles. Un enquêteur peut connaître la vraie cause d'un crime sans pouvoir la présenter telle quelle ; un médecin peut comprendre une blessure surnaturelle et devoir l'inscrire sous une autre catégorie."),
          p("Les communautés de Vérité développent aussi leurs propres médiations, codes et sanctions. Aucune n'a de souveraineté universelle : les justices de Cour, de Meute, de Loge, du GAAC ou d'autres groupes chevauchent la loi humaine au lieu de la remplacer.")
        ]
      },
      {
        id: "science-magie",
        title: "Science, Magie et technologie",
        level: 2,
        blocks: [
          p("Découvrir la Vérité ne rend pas la science fausse. Cela révèle que ses modèles décrivent très bien une partie du réel tandis que le Voile rend d'autres phénomènes difficiles à observer et à reproduire."),
          p("Un Mage peut avoir intérêt à comprendre précisément les lois qu'il transgresse ; un biologiste extral distingue ce qui relève d'une physiologie, d'une Nature ou d'un phénomène non reproductible. En 2035, augmentations, neurotechnologie, matériaux vivants et Holonet multiplient les rencontres entre ces domaines."),
          p("Les Azménoriens et l'AIDH prennent cette convergence particulièrement au sérieux. La première tradition connaît les dangers historiques d'une Technomagie poussée trop loin ; la seconde sait que l'Hologramme lui-même est une œuvre technomagique globale qu'elle a contribué à stabiliser.")
        ]
      },
      {
        id: "metiers-frontiere",
        title: "Les métiers qui voient trop",
        level: 2,
        blocks: [
          p("Urgentistes, légistes, enquêteurs, pompiers, militaires, techniciens de sécurité, personnels de laboratoire et équipes de maintenance se retrouvent plus souvent que d'autres face à des contradictions de Vérité."),
          p("La majorité les classe encore comme erreurs de mesure, contaminations, stress, sabotage ou panne. Ceux qui accumulent trop d'anomalies peuvent perdre leur crédibilité, être recrutés par une organisation, choisir de détourner le regard ou devenir Chasseurs.")
        ]
      },
      {
        id: "journee",
        title: "Une journée derrière le monde visible",
        level: 2,
        blocks: [
          p("Une employée Elyë peut prendre le métro au milieu de centaines de personnes qui ignorent sa physiologie réelle. Un technicien du LAUS et une analyste équipée d'un support invariant peuvent consulter le même incident et travailler sur deux lectures différentes sans qu'aucun ne soit incompétent."),
          p("Un jeune Khinae peut découvrir dans sa famille un héritage oublié. Un réseau Shaediri peut organiser le dernier segment terrestre d'un commerce clandestin pendant qu'une équipe du GAAC aide légalement une famille extrale. Un Chasseur peut entrer dans un bar pour demander si une trace vient d'un Vampire, d'un esprit, d'une technologie — et apprendre que la bonne réponse est aucune des trois."),
          p("La Vérité fonctionne ainsi la plupart du temps : elle ne remplace pas la vie visible, elle la traverse.")
        ]
      }
    ]
  },
  {
    id: "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    dataset: "verite-v7",
    category: "Vérité",
    sourceCategory: "Vérité",
    title: "Cycle, Néant, Ombremonde & histoire cachée",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Vérité", "Cycle", "Néant", "Ombremonde", "Atlantide", "religions", "mythes", "histoire cachée", "fissures"],
    sections: [
      {
        id: "mort",
        title: "La mort ne signifie pas la même chose pour tous",
        level: 2,
        blocks: [
          p("Les peuples de Vérité ne partagent pas une destinée métaphysique unique. Les descendants ordinaires de Khinae appartiennent au Cycle malgré leurs formes, Mues et Sangs vifs."),
          p("Les Vampires ont hérité d'une corruption qui change cette destination : leur vraie mort conduit au Néant. Cette certitude donne à leur culture de survie un poids qui dépasse la simple peur de mourir."),
          p("Les Daemons constituent un autre cas : leur âme a été choisie, retirée du Cycle et reforgée par une ancienne Divinité. Les Angelus sont liés à une histoire de création et de Transcendance ; les Mages restent fondamentalement Humains malgré le Mageius ; les peuples extrals rappellent enfin que la cosmologie terrestre ne fournit pas automatiquement une réponse à toute espèce.")
        ]
      },
      {
        id: "ombremonde",
        title: "L'Ombremonde n'est pas un simple univers parallèle",
        level: 2,
        blocks: [
          p("L'expression de l'autre côté du Voile est pratique mais incomplète. L'Ombremonde désigne ce qui subsiste hors de l'emprise normale de l'Hologramme : un espace où la Magie est plus abondante, où les traductions humaines cessent de s'imposer et où certaines formes de vie existent ouvertement."),
          p("La Terre voilée apparaît alors comme une exception soigneusement maintenue. Les distances, dangers et phénomènes ne suivent pas toujours les habitudes du monde visible ; une route connue peut être plus précieuse qu'une arme."),
          p("Atlantide constitue pour les Aseryns un exemple majeur de civilisation dont la continuité réelle a survécu là où l'histoire humaine ne conservait plus qu'un mythe.")
        ]
      },
      {
        id: "passages",
        title: "Passages, fissures et Éjection",
        level: 2,
        blocks: [
          p("Certains passages vers l'Ombremonde sont entretenus, ritualisés ou surveillés. D'autres apparaissent comme des fissures lorsque la cohérence locale se fragilise. Elles tendent à se produire loin du regard profane et à se refermer, mais ne forment jamais par défaut un réseau de transport fiable."),
          p("Une fissure est d'abord un problème local : une créature peut passer, une équipe de récupération peut tenter sa chance, une corporation peut vouloir exploiter le phénomène ou un réseau criminel y voir une nouvelle route."),
          p("Une Éjection n'est pas une téléportation vers une prison. Elle place l'individu hors de la traduction protectrice de la Terre voilée, dans un environnement où les dangers de la Vérité redeviennent directs. Revenir peut être possible ; survivre assez longtemps pour le faire est une autre question.")
        ]
      },
      {
        id: "mythes",
        title: "Mythes et religions comme archives endommagées",
        level: 2,
        blocks: [
          p("Des événements réels ont alimenté les traditions humaines, puis des siècles de théologie, de politique et de récit ont transformé leur mémoire. La Vérité donne donc une profondeur historique à certains mythes sans rendre chaque texte littéralement exact."),
          p("La Guerre céleste, Elynea et la défaite des anciens dieux ont marqué les religions monothéistes. Cela ne signifie pas que les institutions religieuses modernes soient des administrations angéliques, ni que tous leurs clercs connaissent cette histoire."),
          p("De même, certaines puissances autrefois vénérées ont réellement existé sans que chaque récit polythéiste soit un rapport fiable. Les initiés prudents lisent les mythes comme des archives endommagées : motifs persistants, contradictions et rapprochements valent souvent davantage qu'une lecture littérale.")
        ]
      },
      {
        id: "auteurs-hologramme",
        title: "Une histoire cachée sans auteur unique",
        level: 2,
        blocks: [
          p("L'histoire de l'Hologramme illustre la difficulté de reconstituer le passé de Vérité. L'AIDH a participé à l'œuvre ; la Technomagie azménorienne y a apporté des principes essentiels ; des ancrages et accords plus anciens demeurent imparfaitement documentés."),
          p("Les communautés décrivent ainsi parfois le même épisode comme un pacte, une machine, une opération politique ou un acte divin. Plusieurs sources peuvent être exactes à des échelles différentes sans qu'aucune possède l'ensemble de l'architecture.")
        ]
      },
      {
        id: "connaissance-limitee",
        title: "Les limites de la connaissance",
        level: 2,
        blocks: [
          p("Comprendre le Voile ne rend pas tous les phénomènes prévisibles. Les Fléaux, certaines Divinités, les œuvres technomagiques les plus anciennes et les entités de l'Ombremonde peuvent dépasser les conventions ordinaires."),
          p("Connaître une Nature ne revient pas non plus à connaître chaque représentant. Un Vampire peut ignorer un secret de sa Cour, un Aseryn n'avoir jamais rencontré de Paleo-Atlante et un membre du GAAC ne rien savoir d'un peuple galactique sans contact avec la Terre."),
          p("La Vérité reste vaste parce qu'elle rassemble des histoires réellement séparées. Les personnages peuvent apprendre, transmettre et cartographier ; chaque réponse révèle simplement de nouveaux domaines à étudier.")
        ]
      },
      {
        id: "repere",
        title: "Repère de lecture",
        level: 2,
        blocks: [
          p("Le Cycle, le Néant et l'Ombremonde forment des repères cosmologiques généraux, pas une théorie unique expliquant chaque Nature. Les pages dédiées aux Vampires, Khinae, Daemons, Angelus, Aseryns et autres peuples précisent ensuite ce que ces concepts signifient réellement pour eux.")
        ]
      }
    ]
  }
];

export const COMPENDIUM_VERITE_V7_LORE_NAVIGATION = [
  { id: "verite-v7-derriere-le-voile", dataset: "verite-v7", category: "Vérité", group: "Derrière le Voile", groupOrder: 20, subgroup: "Cadre général", subgroupOrder: 10, pageOrder: 10, displayTitle: "Vérité — derrière le Voile" },
  { id: "verite-v7-voile-hologramme", dataset: "verite-v7", category: "Vérité", group: "Derrière le Voile", groupOrder: 20, subgroup: "Cadre général", subgroupOrder: 10, pageOrder: 20, displayTitle: "Le Voile & l'Hologramme" },
  { id: "verite-v7-habiter-la-verite", dataset: "verite-v7", category: "Vérité", group: "Derrière le Voile", groupOrder: 20, subgroup: "Vie derrière le monde visible", subgroupOrder: 20, pageOrder: 10, displayTitle: "Habiter la Vérité" },
  { id: "verite-v7-cycle-neant-ombremonde-histoire-cachee", dataset: "verite-v7", category: "Vérité", group: "Derrière le Voile", groupOrder: 20, subgroup: "Cosmologie & histoire", subgroupOrder: 30, pageOrder: 10, displayTitle: "Cycle, Néant, Ombremonde & histoire cachée" }
];
