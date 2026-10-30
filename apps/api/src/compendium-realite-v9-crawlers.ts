const CRAWLER_CURATED_EMPTY_SECTIONS: Record<string, Array<Record<string, any>>> = {
  "hub::crawlers-cinquieme-influence": [
    { type: "p", text: "La société californienne est dominée par quatre grandes influences — corporations, gouvernement, pègre et religions — auxquelles les individus doivent presque toujours se rattacher pour travailler, se protéger ou simplement accéder aux ressources ordinaires. Le Logifate renforce cette mécanique en évaluant l’utilité et la conformité sociale de chacun." },
    { type: "p", text: "Tous les Underlives ne sont pas des Crawlers. Les Underlives regroupent les personnes rejetées ou sorties des circuits dominants ; les Crawlers en sont la fraction active, organisée par nécessité, qui refuse de subir passivement. Ils constituent de fait une cinquième influence : instable, sans direction commune, capable de travailler ponctuellement pour n’importe laquelle des quatre autres sans lui appartenir durablement." }
  ],
  "hub::crawlers-hors-categories": [
    { type: "p", text: "Les catégories policières ne couvrent pas tous les Crawlers. Le corpus cite notamment les gladiateurs des tournois illégaux et certains pilotes spécialisés dans des véhicules exigeant des augmentations ou une connexion complète à la machine." },
    { type: "p", text: "Un Crawler peut changer profondément de rôle au cours de sa vie : accident, traumatisme, nouvelle augmentation, perte d’un équipement ou rencontre avec un autre réseau peuvent déplacer sa spécialité. Les familles décrivent des profils dominants, jamais des castes hermétiques." }
  ],
  "realite-v9-crawlers-fixers::definition": [
    { type: "p", text: "Les Fixers, surnommés les « Rats » par le LAUS, font l’interface entre les commanditaires et les autres Crawlers. Leur première ressource est le réseau : contrats, rumeurs, informations, contacts, négociation et réputation." },
    { type: "p", text: "Le corpus distingue les Fixers au sens strict, les Hookers et les Gunwatchers. Les premiers mettent en relation clients et exécutants ; les Hookers exploitent leur proximité sociale et leurs réseaux de clientèle ; les Gunwatchers travaillent davantage comme détectives, pisteurs ou chasseurs d’informations." },
    { type: "p", text: "Ils ne sont ni des combattants ni des hackers par définition, mais restent des Crawlers : ils savent employer la violence si nécessaire et survivent surtout grâce à leur perception, leur discrétion et leur capacité à obtenir un accord ou une information au bon moment." }
  ],
  "realite-v9-crawlers-deathrunners::definition": [
    { type: "p", text: "Les DeathRunners, les « Chiens », sont les combattants des Crawlers. Mercenaires, anciens militaires ou hommes et femmes de main, ils sont engagés pour tuer, capturer, intimider, protéger ou mener une action violente." },
    { type: "p", text: "Le corpus distingue les Deathrunners ou Mercs, les Cyberthugs ou Gangers liés aux rues et aux gangs, et les Voidrunners, assassins spécialisés dans l’effacement des traces et l’absence d’identité." }
  ],
  "realite-v9-crawlers-neurodivers::definition": [
    { type: "p", text: "Les Neurodivers, les « Cafards », sont les spécialistes de l’électronique et surtout de l’Holonet. Dans une société où presque tout est connecté, ils recherchent des informations, réécrivent des programmes, prennent le contrôle de machines et peuvent s’introduire dans des augmentations neurales." },
    { type: "p", text: "Les Neurodivers au sens strict privilégient l’exploration et la manipulation générale de l’Holonet ; les Netdrillers se concentrent sur le percement des sécurités et le sabotage logiciel ; les Neurokillers ciblent directement les systèmes neuraux et les personnes connectées." }
  ],
  "realite-v9-crawlers-meditechs::definition": [
    { type: "p", text: "Les Meditechs, les « Termites », réunissent médecine et mécanique parce qu’en 2035 le biologique, l’électronique et l’augmentique se croisent en permanence. Un bon praticien Crawler sait aussi bien désinfecter et suturer que réaligner ou réparer une augmentation." },
    { type: "p", text: "Les Meditechs sont des généralistes du soin et de la réparation ; les Cyppers sont davantage techniciens, ingénieurs, saboteurs et sapeurs ; les Venomers sont spécialisés en chimie, toxines, agents biologiques et usages offensifs du médical." }
  ],
  "realite-v9-crawlers-gundrivers::definition": [
    { type: "p", text: "Les Gundrivers, les « Corneilles », vivent du commerce et surtout du transport hors des circuits ordinaires. Pilotes, motards, convoyeurs et receleurs, ils assurent la mobilité des équipes et des marchandises sur les immenses distances de Grande Californie." },
    { type: "p", text: "Les Gundrivers ou Neobikers assurent transport et convois ; les Necropunks sont des pirates de la route qui pillent les véhicules et leurs occupants ; les Neoslavers, Mandealers ou Humanretailers pratiquent la traite humaine, la capture et la revente de personnes." }
  ],
  "realite-v9-crawlers-gundrivers::taxonomy-anti-systeme": [
    { type: "p", text: "Le document Anti-système privilégie la nomenclature Neobikers, Necropunks et Mandealers. Les appellations plus anciennes — Gundrivers, Neoslavers et Humanretailers — restent des synonymes ou des termes de milieu et ne doivent pas être effacées." },
    { type: "p", text: "Les Neobikers se structurent volontiers en Motorcycle Clubs et villages routiers ; les Necropunks partagent souvent les mêmes implantations mais vivent du pillage ; les Mandealers transportent et commercialisent des êtres humains plutôt que des marchandises ordinaires." }
  ],
  "realite-v9-crawlers-neopunks::definition": [
    { type: "p", text: "Les Neopunks, les « Frelons », sont les Crawlers qui transforment leur rejet du système en identité collective. Ils sont plus communautaires que les autres familles et se regroupent autour de scènes artistiques, de cellules militantes ou de communautés vivant hors des institutions." },
    { type: "p", text: "Le corpus récent distingue les Ragehowlers, branche artistique et culturelle couramment appelée Neopunks, les Freerunners ou Insurgés qui choisissent l’action révolutionnaire violente, et les Enders qui rejettent toutes les grandes influences et quittent la société pour bâtir leurs propres communautés." }
  ]
};

function crawlerReadableParagraphs(text: string): Array<Record<string, any>> {
  let cleaned = String(text ?? "")
    .replace(/^\s*\d{1,2}\s+(?:CONTEXTE GENERAL\s+)?(?:Chronologie|Contexte|Organisation générale)\s*/i, "")
    .replace(/^\s*(?:CONTEXTE GENERAL\s+)?(?:Chronologie|Contexte|Organisation générale)\s*/i, "")
    .trim();
  if (!cleaned) return [];
  const bulletParts = cleaned.split(/\s*\s*/).map((part) => part.trim()).filter(Boolean);
  const sourceParts = bulletParts.length > 1 ? bulletParts : [cleaned];
  const out: Array<Record<string, any>> = [];
  for (const sourcePart of sourceParts) {
    const sentences = sourcePart.split(/(?<=[.!?…])\s+(?=[A-ZÀ-ÖØ-Þ«“])/u).filter(Boolean);
    let chunk = "";
    for (const sentence of sentences) {
      if (chunk && chunk.length + sentence.length > 900) {
        out.push({ type: "p", text: chunk.trim() });
        chunk = sentence;
      } else {
        chunk += (chunk ? " " : "") + sentence;
      }
    }
    if (chunk.trim()) out.push({ type: "p", text: chunk.trim() });
  }
  return out;
}

function normalizeCrawlerSections(sections: Array<Record<string, any>>, articleId = "hub") {
  return sections.map((section) => {
    const blocks = Array.isArray(section.blocks) ? section.blocks : [];
    const curated = CRAWLER_CURATED_EMPTY_SECTIONS[`${articleId}::${String(section.id ?? "")}`];
    const sourceBlocks = blocks.length ? blocks : (curated ?? []);
    const normalizedBlocks = sourceBlocks.flatMap((block: Record<string, any>) =>
      block?.type === "p" ? crawlerReadableParagraphs(String(block.text ?? "")) : [block]
    );
    return {
      ...section,
      ...(String(section.id ?? "") === "scenarii" ? { audience: "mj" } : {}),
      blocks: normalizedBlocks
    };
  });
}

function normalizeCrawlerArticles(articles: Array<Record<string, any>>) {
  return articles.map((article) => ({
    ...article,
    sections: normalizeCrawlerSections(Array.isArray(article.sections) ? article.sections : [], String(article.id ?? ""))
  }));
}

function normalizeCrawlerEnrichments(enrichments: Array<Record<string, any>>) {
  return enrichments.map((enrichment) => ({
    ...enrichment,
    sections: normalizeCrawlerSections(Array.isArray(enrichment.sections) ? enrichment.sections : [], String(enrichment.targetId ?? ""))
  }));
}

export const COMPENDIUM_REALITE_V9_CRAWLERS_HUB_ID = "realite-v9-crawlers-underlife";
export const COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SOURCE = "TUC_organisations_crawlers_V2(3).docx ; factions crawlers _ les anti système(3).pdf";
export const COMPENDIUM_REALITE_V9_CRAWLERS_HUB_TAGS = ["Crawlers","Underlife","Logifate","Cinquième influence"] as string[];
export const COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SECTIONS = normalizeCrawlerSections([{"id":"crawlers-chronologie-source","title":"Chronologie de l’émergence Crawler","level":2,"blocks":[{"type":"p","text":"4 CONTEXTE GENERAL Chronologie  2020 – Grande épidémie de Covid-19  2021 – Début de la crise économique  2022 – Début de la Grande guerre du Pacifique contre la Corée du Nord, de nombreux réfugiés sud-coréens émigres vers les Etats-Unis, mais aussi des Japonais et des Chinois.  2023 – Début de la Grande crise économique, sociale et politique mondiale, éruption de l’Etna en Italie impliquant de grands vagues d’immigrations vers les Etats-Unis.  2024 –mars, La Corée du Nord envahit une partie de la Sibérie, nombre d’immigrés sont évacués vers les Etats-Unis.  2024 –mai, les Etats-Unis renvoient des millions de soldats de l’alliance pacifique sur le continent américains, blessés, traumatisés, épuisés, ils ne sont plus aptes pour poursuivre la guerre, c’est la conscription obligatoire, toute personne entre 16 et 60 ans est susceptible d’être tirée au hasard pur être appelée sous les drapeaux, les familles se déchirent et les soldats ramenés deviennent un poids de plus à gérer.  2025– la dégradation du pouvoir et l’appauvrissement général mène à un exode rural de plus en plus massif, c’est la désertification des campagnes.  2026- les vétérans rapatriés ne perçoivent plus aucune pension ni solde, le gouvernement américain ne peut pas les payer, ils ravagent quelques mairies au Texas avant de joindre les bikers, rejetant l’état qui les abandonne.  2027 – La guerre tourne en faveur de plus en plus pour les Etats-Unis, les soldats du front sont érigés en héros mais ceux qui reviennent comprennent la détresse de leurs prédécesseurs.  2028 – Fin de la Grande guerre du Pacifique contre la Corée du Nord  2029 – élections de la présidence des Etats-Unis d’Amérique, Seth Jordan Dirckman est élu avec un score de 59 %, la présidence d’un ancien acteur illustre le manque de confiance des gens dans les véritables politiciens.  2030 – Grand Choc technologique, démocratisation des technologies augmentiques et lancement du grand Holonet. Fin de la grande crise économique. Face à la perte de confiance totale dans les gouvernements, les institutions religieuses en Asie et en Europe perçoivent des levées de fonds face au « péril technologique ».  2031 – démocratisation du logifate comme principal outil de recrutement et de détermination sociale, énormément de gens sont rejetés sur cette seule base.  2032 – élection de Dina Page en tant que Gouverneur de Californie  2033 mars, grands mouvements d’insurrection civile à Detroit puis dans de nombreuses villes.  2033, septembre, kelly HARPER, une mère de famille est assassinée en passant sa poussette dans un territoire corporatif, l’insurrection civile allume un grand incendie autour du quartier corporatif de CrunFord corp à Las Vegas, la corporation est rachetée le mois suivant par Yellowfood.  2034 le 04 février, le plus grand concert de neopunk jamais vu a lieu à Los Angeles, des milliers de squats sont pratiqué, la police se disperse sans réussir à rien faire."}]},{"id":"crawlers-cinquieme-influence","title":"Underlives, Crawlers & cinquième influence","level":2,"blocks":[]},{"id":"crawlers-contexte-detaille","title":"Le contexte social des Crawlers","level":2,"blocks":[{"type":"p","text":"5 Contexte Le big One, les guerres, les épidémies, les crises financières, tout ça créa un contexte de chamboulement social, mais c’est le bond technologique qui changea à jamais le monde. L’essor des corporations a changé les mœurs, les nouveautés surviennent si vite qu’énormément de personnes ne peuvent pas suivre, ceux âgés de la trentaine et plus ont vécu tous ces changements, ils n’arrivent pas à se mettre à jour dans une société où rien ne semble fixe. Les plus anciens sont encore plus perdus, l’hyper connexion a un prix et tout le monde ne peut pas se le permettre, les corporations ont tout à gagner à maintenir la détresse totale. Dans la société, le logifate est le dernier clou dans le cercueil pour ces gens, énormément de personnes, pourtant de la classe moyenne, se voyant jeter dans la couche inférieure, le côté humain dans l’embauche est inexistant, l’individualisme est systématiquement traqué et les augmentations n’aident pas, plus on attend d’efficacité, moins les ouvriers ou autres travailleurs de cette classe sont humains et moins on les considère avec respect. Des quartiers entiers sont abandonnés, bâtiments délabrés, déchets entreposés, parfois simplement des zones de non droit, une société parallèle s’est formée, avec les parias et autres paumés du système. Parmi eux, ceux qui refusent de survivre en consommant ; les miettes laissées par les corporations, qui ne veulent pas s’asservir au gouvernement, simple megacorporation politique, qui ne veulent pas céder à la pègre, ceux-ci rampent dans l’ombre et la fange de la société, ces « rampants », nuisibles et hors système finissent par s’avérer plus utiles pour les autres factions, ils sont les « Crawlers ». Le LAUS (la police de Los Angeles de 2035) a établi des catégories de Crawlers en les surnommant comme des animaux « nuisibles » qu’on peut trouver dans la rue. Il s’agit des « rats », des « chiens », des « cafards », des « termites », des « chats », des « corneilles » (quoi qu’appelés « pigeons » parfois aussi) et des « frelons ». Chaque catégorie a des compétences et un profil souvent très éloigné les uns des autres, les autorités n’ont pas pour mission de lutter contre eux spécifiquement, les crawlers sont en dehors de la société, en cas de conflit néanmoins, la police fait scrupuleusement attention, les crawlers ne se laissant vraiment pas faire. Pour bien saisir qui sont les crawlers, il faut essayer de visualiser la société de Californie en 2035. Au sommet, la faction corporative n’a pas de représentant unique, parmi les plus riches et influentes, on trouvera des noms comme Siobhain Nic Siridean, à la tête de la Tuatha, megacorporation du divertissement, tenant presque tous les studios d’Hollywood, une bonne partie de la technologie de la Silicon Valley, une de ses rivales, Tolaka, plus implanté du coté de Las Vegas avec la Tala corporation, tenant plutôt les casinos et les jeux en tous genre avec elles, Wei Xi, papesse des médias tient une place déterminante dans les corporations de l’information Du coté des institutions publiques, la présidente-gouverneure, Dina Page est la personnalité qui fait de la Californie un lieu singulier où les corporations n’ont pas l’ascendant, un état extrêmement fort qui sait être menaçant avec les corporations et en tirer des accords quand il faut, elle est assistée notamment par Makana, à la tête du CBII, l’agence gouvernementale la plus influente du monde désormais et par un système judiciaire incorruptible qui est assuré par Farah El’Arshad."},{"type":"p","text":"6 Un troisième pôle extrêmement puissant reste les mafias et cartels, comme le gouvernement résiste aux corporations et réduit leur influence, les mafieux n’ont pas été anéantis et ont construit des empires plus puissants qu’ailleurs dans le monde, l’Archange siégeant à la tête de la table des mafieux californiens. Ces trois factions exploitant la misère et la détresse des gens, elles ont provoqué deux contre￾réactions, la première a été la réhabilitation des religions à un niveau d’implication et d’influence qu’on n’avait pas vu depuis des décennies, peut être des siècles, l’inculture et l’abrutissement général que les corporations ont entretenu pour avoir des travailleurs serviles et silencieux ont été retourner vers la Foi. Si pour énormément de gens, se vautrer dans la croyance était une évidence, pour une très grande partie des autres personnes, ce n’était pas le cas, sans avenir ni alternative, c’est une colère qui s’est installée et qui est devenue le moteur d’un profond refus de se laisser faire. L’essence du crawler n’est pas qu’il rampe dans sa propre misère, mais qu’il se faufile à travers les gros tas corrompus dirigeant le monde, sans être soumis à leur diktat, prêt à rendre chaque coup reçu. Si la majorité des Crawlers sont prêts à utiliser cette rage ils ne renoncent en rien à utiliser absolument tout ce que la société leur offre, y compris l’insurrection. Les crawlers sont donc issus des strates inférieures de la société, celles négligées, pratiquement esclaves, mais on peut distinguer les individus « inertes » qui subissent le jeu des influences et les « crawlers », qui, bien qu’y participant, le font en toute connaissance de cause, la rage au ventre. Peu importe le style de crawler, il faut bien comprendre que malgré les spécificités, rien n’empêche un « mercenaire » de faire « informateur » ou un « hacker » de faire « neopunk », tout dépend des capacités et du contexte, ce ne sont en rien des petites cases hermétiques, bien au contraire. Le crawler, « cet être rampant » aux yeux des strates plus aisées est un parasite pour la société actuelle, une anomalie, parfois certains corporatistes les désignent comme « cancells», contraction de « cancer cells » mais également sonnant comme « cancel » à savoir « annuler », ceux qu’on peut effacer donc. Le crawler n’a pas de formation généralement dans son domaine de compétence le plus poussé, il a appris lui-même ou après de quelqu’un et c’est sa vivacité d’esprit qui lui a fait accéder ou non à certaines maitrises, de fait, il n’existe aucun Crawler parfaitement similaire à un autre, chacun est unique et forgé par son propre caractère, son propre parcours et ses propres motivations là où les autres citoyens auront tendance à se laisser formater par le gouvernement, les religions et les corporations. Le crawler est un cas à part, il rejette ces influences et/ou ne se fait pas embarquer par leur jeu. Certains ont un métier, souvent au plus bas de l’échelle corporative ou pour le compte « d’associations », les associations sont les branches « légales » des mafias, ce sont des petites et moyennes entreprises que les corporations n’anéantissent pas du fait de la menace qu’elles représentent par l’appareil mafieux les protégeant, autrement, elles n’existeraient déjà plus depuis longtemps. Il n’existe pas vraiment de « petit métier » indépendant à cause des normes corporatives et gouvernementales. Crawler est une source de revenue plus grande et plus rapide que les métiers de ce genre mais bien moins fiable également. Chez certains Crawlers, il existe des signes pour se reconnaitre."}]},{"id":"crawlers-contrats-reseaux","title":"Contrats, Fixers, Blanchisserie & open’tracts","level":2,"blocks":[{"type":"p","text":"7 Organisation générale Les crawlers ne sont pas organisés, leur principale caractéristique serait même d’être particulièrement indépendants. Ils sont rejetés de la société actuelle, alors ils ne la respectent pas, pas plus qu’ils ne le sont en tout cas. Malgré tout, les crawlers ont une forme de fraternité entre eux, ils se mentent, se trahissent, se volent, s’affrontent et s’entretuent mais c’est sans haine, c’est uniquement pour le boulot qu’ils en viennent là. Les crawlers ont souvent moins d’affect que la moyenne, c’est une vie ne dure où ni la famille ni les amis n’ont à y être mêlés si on ne veut pas perdre régulièrement des êtres chers. La vie des crawlers tournent autour des « Contrats », un crawler est un « exécutant », les contrats sont initiés par des « commanditaires », ça peut être des corporations, des agences ou la police, les religions, ou bien des particuliers. Les commanditaires passent par deux structures :  Le réseau des « fixers »  Le réseau de la « blanchisserie » ou ses équivalents sur l’holonet. Les premiers sont donc des crawlers, des « managers » qui confient les contrats aux équipes ou aux individus les plus adaptés, le but est d’utiliser le présentiel pour réduire la traçabilité, tout communication par l’holonet laissant une trace, le fixer est la meilleure option pour garder le plus secret le lancement d’un contrat qu’on désire ne pas communiquer. On peut à loisir liquider le fixer après qu’il a lancé une équipe sur le contrat. Le réseau de la « blanchisserie » passe par l’Holonet, par une suite de connexions sécurisée il ne permet l’accès qu’aux crawlers liés à la blanchisserie d’accéder aux contrats eux-mêmes uniquement lancés par des commanditaires référencés par la blanchisserie, rien ne relie un commanditaire à un crawler, contrairement à un fixer toutes les transactions sont traçables, étant sur l’holonet mais le temps de décrypter les puissants protocoles de sécurité de la blanchisserie, la mission sera déjà accomplie ou bien avancée. L’autre avantage sur un fixer est la réputation de la Blanchisserie qui n’est pas seulement celle ‘une personne mais d’une institution entière, ayant déjà fait ses preuves avec les mafias. Enfin, la dernière option sont les équivalents plus ouverts les « open’tracts », les crawlers se connectent sans compte, prennent un contrat sur leur holophone, il disparait du site alors. C’est la méthode la moins fiable, rien n’empêche un commanditaire d’envoyer plusieurs fois son contrat et tout est traçable, le commanditaire sait exactement où est le crawler qui doit remplir le contrat et n’importe qui qui désire remonter au commanditaire peut le faire en hackant l’holophone de l’exécutant. Généralement les crawlers ont des spécialités selon les missions, les « informateurs » sont la catégorie des « fixers », ils ont un lien étroit avec l’information et le social mais l’espionnage également. La catégorie des « mercenaires » est celle des « Deathrunners », ce sont d’anciens militaires, des assassins ou bien encore des gangers, ils se battent et sont bons à ça, cogner, tirer, trancher ce ne sont pas des tendres et le plus souvent ils meurent assez vite, cependant ils sont indispensables dans ce monde de violence exacerbée."},{"type":"p","text":"8 La catégorie des « hackers » sont les « neurodivers », ils sont amenés à « plonger » dans l’holonet, ils sont extrêmement doués avec l’informatique et par leur seul cerveau peuvent réécrire des programmes entiers, passer des défenses ou bien encore glaner des informations. Extrêmement polyvalents s’ils ne sont pas plus physiques que les « fixers », ils ont une utilité au moins égale si ce n’est plus grande encore. Les « soutiens » sont appelés les « meditech » qu’ils réparent la mécanique ou le biologique n’est pas spécialement très important car leur utilité est immense dans tous les cas. Ils ont tendance à être un peu plus indépendants d’une équipe pour remplir les contrats de construction, déconstruction ou autres soins qu’on peut leur confier. En revanches, ils sont soit très équipés soit très augmentés pour posséder leur matériel toujours avec eux, car sans matériel, un méditech est presque inutile. Les « pilotes » sont appelés « Gundrivers », ils sont les crawlers les plus mobiles, ils sont tous véhiculés et vu la taille de la Californie ou simplement Los Angeles, ce n’est pas un luxe d’en avoir dans une équipe. Les Gundrivers sont des receleurs, des transporteurs, des bikers ou des pilotes de « Go fast », pour le compte des Cartels. Ce sont des crawlers qu’on charge de l’acheminement d’une marchandise ou parfois de l’interception de cette dernière. Ils sont extrêmement violents et rapide, s’ils n’égalent pas vraiment les « Deathrunners » en combat, ils sont parmi les plus dangereux des crawlers et tuent tout autant. Les « insurgés » sont appelés « Neopunks », qu’ils manifestent leur puissant rejet de la société par le biais d’un art, la MAP, ou bien qu’ils mènent le combat par du terrorisme, peu importe, les « neopunks » sont des crawlers enragés. Plus que tous les autres crawlers, ils sont organisés en groupes, groupe de musiques ou cellule terroriste, ils sont des pros pour accaparer des bâtiments et squatter. Le Neopunk est le crawler le plus polyvalent, habitué à la bagarre mais pas forcément au meurtre, ils savent presque tous se battre très correctement et son des durs à cuire, ils ont forcément un pied dans l’holonet car ce sont des crawlers extrêmement sociaux qui vivent par leur réseau, leur groupe et savent parfaitement se coordonner malgré une apparence de chaos dans leurs actes évoquant l’anarchie qu’ils prônent. Qu’ils soient « fixers », « deathrunners », « neurodivers », « meditech », « gundrivers » ou bien « neopunk », tous les crawlers peuvent aisément pencher sur une seconde catégorie ou une autre et le plus souvent il n’y a pas vraiment de distinction totale. Par exemple, énormément de « Gundrivers », chez les bikers sont d’anciens soldats, ils sont de parfaits « Deathrunners » de fait, dans un autre genre, les neopunks sont extrêmement liés à l’Holonet au deep Holonet même, certains des plus grands artistes sont des « Neurodivers » surclassant énormément de hackers, on peut aussi citer les meditech, qui par leur position de médecin ou de mécaniciens, vont très souvent entendre des rumeurs ou recevoir des contrats, ils sont parfais pour faire « fixers ». Dans le document, les crawlers seront appelés par la première catégorie les représentants, par exemples il y aura les « Fixers » qui comprennent « les fixers », les « streetrackers » et les « hookers », ces trois sous-catégories sont toutes des formes de « fixers » bien que leurs spécificités soient légèrement différentes."}]},{"id":"crawlers-hors-categories","title":"Autres Crawlers","level":2,"blocks":[]}]) as Array<Record<string, any>>;
export const COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLE_ENRICHMENTS = normalizeCrawlerEnrichments([{"targetId":"realite-v9-gangs-underlife","source":"TUC_organisations_crawlers_V2(3).docx ; factions crawlers _ les anti système(3).pdf","tags":["Crawlers","DeathRunners","Gundrivers"],"sections":[{"id":"crawlers-gangs-deathrunners","title":"Gangs, DeathRunners & contrats","level":2,"blocks":[{"type":"p","text":"Les gangs de l’Underlife recoupent fréquemment la catégorie Crawler des DeathRunners : combattants, petites frappes, mercenaires et sentinelles peuvent travailler pour la Pègre sans appartenir durablement à une structure mafieuse. Les catégories Crawler restent néanmoins des profils fonctionnels et non des appartenances exclusives."},{"type":"p","text":"Voir aussi : « Crawlers & Underlife » et « DeathRunners — les Chiens »."}]},{"id":"crawlers-gangs-motards","title":"Motards & routes de l’Underlife","level":2,"blocks":[{"type":"p","text":"Les Gundrivers et Motorcycle Clubs contrôlent une partie décisive du transport hors des réseaux corporatifs. Leur relation à la Pègre repose sur les contrats, la négociation et les équilibres locaux plutôt que sur une vassalité générale."},{"type":"p","text":"Voir aussi : « Gundrivers — les Corneilles »."}]}]},{"targetId":"realite-v9-pegre-mafias-gangs","source":"TUC_organisations_crawlers_V2(3).docx ; factions crawlers _ les anti système(3).pdf","tags":["Crawlers","Underlife"],"sections":[{"id":"relations-pegre-crawlers","title":"Pègre & Crawlers","level":2,"blocks":[{"type":"p","text":"Les Crawlers constituent une main-d’œuvre extérieure que mafias et cartels emploient régulièrement : renseignement, combat, transport, soins clandestins ou intrusion numérique. Un contrat accepté crée une obligation professionnelle, mais pas une appartenance automatique à la Pègre."},{"type":"p","text":"Voir aussi : « Crawlers & Underlife »."}]}]},{"targetId":"realite-v9-ennemis-publics","source":"factions crawlers _ les anti système(3).pdf","tags":["Insurgés","Freerunners","Crawlers"],"sections":[{"id":"insurges-freerunners","title":"Insurgés & Freerunners","level":2,"blocks":[{"type":"p","text":"Les dossiers d’ennemis publics recoupent plusieurs figures des Freerunners. L’Insurrection n’est cependant pas une organisation unique : douze grandes factions sont décrites, avec des doctrines, priorités et ennemis distincts, et des conflits ouverts existent entre elles."},{"type":"p","text":"Voir aussi : « Insurgés — les Freerunners »."}]}]},{"targetId":"realite-v9-los-angeles-laus-securites","source":"TUC_organisations_crawlers_V2(3).docx","tags":["Crawlers","LAUS"],"sections":[{"id":"laus-taxonomie-crawlers","title":"La taxonomie Crawler du LAUS","level":2,"blocks":[{"type":"p","text":"Le jargon du LAUS classe les Crawlers sous des noms de nuisibles : rats, chiens, cafards, termites, chats, corneilles — parfois « pigeons » — et frelons. Ces étiquettes décrivent des profils utiles à l’action policière, pas des organisations hermétiques."},{"type":"p","text":"Le corpus décrit précisément six familles — Fixers, DeathRunners, Neurodivers, Meditechs, Gundrivers et Neopunks. Les « chats » sont attestés par la taxonomie mais ne sont pas davantage définis dans la source."}]}]},{"targetId":"realite-v9-technologies-infrastructures-mobilite","source":"TUC_organisations_crawlers_V2(3).docx ; factions crawlers _ les anti système(3).pdf","tags":["Gundrivers","Motards","Intercités"],"sections":[{"id":"mobilite-crawlers-gundrivers","title":"Mobilité hors système & Gundrivers","level":2,"blocks":[{"type":"p","text":"Les Gundrivers assurent une partie des déplacements, transports et interceptions que les réseaux officiels ne veulent ou ne peuvent pas prendre en charge. Les motards constituent la forme collective la plus visible de cette mobilité hors système, particulièrement dans l’Intercités et autour des stations-services."}]}]},{"targetId":"realite-v9-augmentations-corps-sante","source":"TUC_organisations_crawlers_V2(3).docx","tags":["Meditechs","Black Clinics","Crawlers"],"sections":[{"id":"sante-parallele-meditechs","title":"Meditechs & santé parallèle","level":2,"blocks":[{"type":"p","text":"Dans l’Underlife, les Meditechs entretiennent aussi bien le biologique que la mécanique. Leur autonomie dépend fortement du matériel, des Black Clinics et de réseaux capables de fournir pièces, médicaments et consommables en dehors des circuits institutionnels."}]}]},{"targetId":"realite-v9-loisirs-modes-sociabilites","source":"TUC_organisations_crawlers_V2(3).docx ; factions crawlers _ les anti système(3).pdf","tags":["Neopunks","Ragehowlers","Crawlers"],"sections":[{"id":"culture-neopunk-crawlers","title":"Culture Neopunk & Ragehowlers","level":2,"blocks":[{"type":"p","text":"La contre-culture Neopunk est une forme d’action Crawler à part entière. Les Ragehowlers expriment le rejet social par la musique, les arts, l’occupation des lieux et une esthétique volontairement agressive ou impossible à normaliser."},{"type":"p","text":"Voir aussi : « Neopunks — les Frelons »."}]}]},{"targetId":"realite-v9-holonet-medias-culture-identite","source":"TUC_organisations_crawlers_V2(3).docx","tags":["Neurodivers","Neopunks","Crawlers"],"sections":[{"id":"holonet-crawlers","title":"Holonet & réseaux Crawlers","level":2,"blocks":[{"type":"p","text":"L’Holonet sert à la fois d’espace de travail, de contre-culture et de terrain d’affrontement : Neurodivers, Blanchisserie, open’tracts et réseaux Neopunks exploitent des usages différents de la même infrastructure, depuis le contrat chiffré jusqu’à la diffusion de manifestes et d’œuvres."}]}]}]) as Array<Record<string, any>>;
export const COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLES = normalizeCrawlerArticles([{
  "id": "realite-v9-crawlers-fixers",
  "dataset": "realite-v9-crawlers",
  "category": "Réalité",
  "sourceCategory": "Réalité",
  "title": "Fixers — les Rats",
  "source": "TUC_organisations_crawlers_V2(3).docx",
  "status": "canon_enrichi",
  "rebuildV2": true,
  "tags": [
    "Réalité",
    "Crawlers",
    "Fixers",
    "Rats",
    "Hookers",
    "Gunwatchers"
  ],
  "sections": [
    {
      "id": "definition",
      "title": "Les informateurs des Crawlers",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Fixers sont surnommés les « Rats » par le LAUS parce qu’ils fouillent dans les affaires des autres. Leur ressource principale est leur réseau : informations, contacts, contrats, réputation et négociation. Cette famille rassemble les intermédiaires, les escorts informateurs et les enquêteurs indépendants."
        }
      ]
    },
    {
      "id": "fixers-intermediaires",
      "title": "Fixers, Tipers et Streetadvisers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ces intermédiaires relient les commanditaires aux équipes de Crawlers. Corporations, agences ou mafias peuvent déposer un contrat ; seul le Fixer connaît l’identité du client. Il recherche les missions, passe une part importante de son temps sur l’Holonet et reste très mobile."
        },
        {
          "type": "p",
          "text": "Son métier repose sur les interactions sociales et la diplomatie entre commanditaires, équipes et tiers, notamment les gangs. Il ne fait pas partie de l’équipe envoyée en mission, mais perdre régulièrement ses exécutants ruine son activité. Il entretient donc les contacts et les renseignements nécessaires à leur réussite."
        }
      ]
    },
    {
      "id": "hookers",
      "title": "Hookers, Overbitches et Xcort",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Hookers allient une apparence recherchée à un grand sens de la représentation. Invités comme escorts ou partenaires de compagnie, ils peuvent être très visibles tout en passant inaperçus auprès des milieux aisés, qui les traitent comme un élément du décor. Les clients recherchent des femmes, des hommes ou des personnes trans selon leurs préférences."
        },
        {
          "type": "p",
          "text": "Leur identité et leur Logifate sont souvent moins contrôlés que leur code-barres professionnel, qui indique tarifs et commentaires. Ils cultivent une clientèle dans des secteurs très divers pour disposer de la bonne entrée au bon moment. Leur collaboration avec les Fixers est précieuse pour renseigner une équipe et actualiser la surveillance d’une cible."
        }
      ]
    },
    {
      "id": "gunwatchers",
      "title": "Streetrackers, Sleuthrunners et Gunwatchers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Détectives privés et traqueurs, les Gunwatchers recherchent surtout les personnes et les informations que les autres Fixers n’obtiennent pas facilement. Mobiles à travers la Californie, ils disposent de nombreux contacts et d’une image de confiance. Ils préservent leur neutralité entre les grandes influences pour ne pas perdre ce réseau."
        },
        {
          "type": "p",
          "text": "Ce sont les plus physiques des informateurs. Leur apparence reste généralement discrète : de grands manteaux permettent de dissimuler armes et matériel technique. Ils ont davantage intérêt à être reconnus par leurs contacts que par la foule."
        }
      ]
    },
    {
      "id": "organisation",
      "title": "Organisation & réseaux",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les informateurs n’ont pas de hiérarchie commune. Chacun recueille les renseignements selon ses méthodes, mais plusieurs institutions et lieux de rencontre structurent leurs échanges, notamment à Los Angeles."
        }
      ]
    },
    {
      "id": "blanchisserie",
      "title": "La Blanchisserie",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "La Blanchisserie, dirigée par Ryan Isaiah Burton, est la plus ancienne institution au service des DeathRunners, des Mercs et surtout des Voidrunners. Elle fournit les renseignements sur les cibles, le transport et la logistique nécessaires aux assassinats et aux prises d’otages."
        },
        {
          "type": "p",
          "text": "Ses agents nettoient les lieux après une mission : draps, moquettes, rideaux et peinture sont remplacés ; ce qui ne peut être nettoyé est brûlé. Douilles, cheveux et autres indices sont éliminés. La Blanchisserie peut aussi falsifier les preuves en déposant les cheveux, les douilles ou les empreintes d’un autre suspect. Elle efface les casiers judiciaires, les identités et les fausses identités, et complique l’accès au Logifate sans pouvoir en effacer les données."
        },
        {
          "type": "p",
          "text": "Ces services coûtent une part importante des primes, à laquelle s’ajoute un abonnement mensuel. Un impayé peut entraîner la mise à prix du mauvais payeur. Recourir à ce réseau implique aussi d’entrer dans son dispositif de surveillance : les informations recueillies sur un client peuvent être revendues à un autre Crawler."
        },
        {
          "type": "p",
          "text": "Ses liens étroits avec les mafias et les agences gouvernementales poussent certains Crawlers à l’éviter. Ils la considèrent comme une forme de CIA officieuse."
        }
      ]
    },
    {
      "id": "fixweb",
      "title": "Le Fixweb",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Le Fixweb est un réseau de bouche à oreille, et non un réseau de l’Holonet. Depuis 2030, il se développe dans les diners, les nightclubs et les bars, principalement dans les quartiers abandonnés. Les Fixers se sont progressivement réparti les zones d’activité pour limiter les conflits entre rivaux. Los Angeles compte une vingtaine de grands noms, dont Adam et Brittany."
        },
        {
          "type": "p",
          "text": "La réputation détermine les échanges : les commanditaires sollicitent un Fixer dont ils ont entendu parler, et celui-ci recrute des Crawlers selon leur renommée. L’échec d’une équipe nuit à son intermédiaire même lorsqu’il n’en est pas responsable. Moins de contrats signifie ensuite moins de Crawlers disposés à travailler pour lui."
        },
        {
          "type": "p",
          "text": "Les Fixers privilégient le contact personnel. Lorsqu’ils utilisent un holophone, ils en changent régulièrement pour éviter d’être tracés ou piratés ; conserver le même appareil rendrait leurs échanges aussi exposés que des contrats passés sur l’Holonet."
        }
      ]
    },
    {
      "id": "cna",
      "title": "Companionship Network Agencies",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les CNA constituent le réseau officiel de prostitution des mafias, autorisé par le gouvernement. Elles appartiennent à la Vladic’s Association et sont réparties en autant de branches qu’il existe de mafias californiennes. Les Hookers qui y travaillent ne sont pas pour autant membres de la mafia : ils utilisent ces agences pour trouver des clients et ignorent souvent l’ampleur du contrôle criminel derrière leur façade légale."
        },
        {
          "type": "p",
          "text": "Un code-barres imprimé sur le corps indique tarifs, note, compétences et préférences. Il permet de réserver une prestation à une date donnée. Codes visibles et tenues révélatrices contribuent à développer la clientèle et, avec elle, le réseau d’information. La concurrence est rude : les Hookers se surveillent pour approcher les clients les plus avantageux."
        }
      ]
    },
    {
      "id": "sleuth-agency",
      "title": "Official Sleuth Agency et Snoopybars",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "L’Official Sleuth Agency n’est pas une véritable agence. Elle désigne le réseau informel des Gunwatchers, qui savent se contacter et échanger des tuyaux sans être nécessairement amis. Son rôle principal consiste à reconnaître les bars servant de points de rencontre, les « Snoopybars », souvent des établissements à l’ancienne."
        },
        {
          "type": "p",
          "text": "Fixers, policiers et agents gouvernementaux y rencontrent leurs indicateurs ou en recrutent. Les informations s’y échangent discrètement et oralement."
        }
      ]
    },
    {
      "id": "contrats-holonet",
      "title": "Les contrats sur l’Holonet",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "De nombreux sites proposent des contrats rapides. Crawlershop compte parmi les serveurs réputés : des millions de transactions, du lacet au véhicule blindé, y noient les offres sensibles. Elles restent cependant plus faciles à tracer qu’un accord oral."
        }
      ]
    },
    {
      "id": "profil",
      "title": "Réseau, perception et violence",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Fixers s’appuient sur leurs relations, leur sens de l’enquête et leur perception. Leur neutralité, leur charme ou leur charisme facilitent l’obtention d’un accord. Le combat et l’informatique ne définissent pas leur métier."
        },
        {
          "type": "p",
          "text": "Ils restent pourtant des Crawlers capables de violence : certains tuent ou arrachent des mémoires additionnelles à un interlocuteur lorsque l’interrogatoire ne suffit plus."
        }
      ]
    },
    {
      "id": "figures-notables",
      "title": "Figures notables",
      "level": 2,
      "blocks": [
        {
          "type": "table",
          "rows": [
            [
              "Sous-type",
              "Personnage",
              "Alias / désignation"
            ],
            [
              "Fixers",
              "Ryan Isaiah BURTON",
              "White man"
            ],
            [
              "Fixers",
              "Adam NEVINE, Qigang XUYIN, Carmello SHEN",
              "L’omniscient"
            ],
            [
              "Fixers",
              "Brittany SMITH-CAVALETTY",
              "Lady opium"
            ],
            [
              "Hookers",
              "Shuren SHI",
              "Lady opium"
            ],
            [
              "Hookers",
              "Zeeka STEELE",
              "Lady opium"
            ],
            [
              "Hookers",
              "Jacob DELISLE",
              "Le chippendale alpha"
            ],
            [
              "Gunwatchers",
              "Henry EDWARDS",
              "Le Fossoyeur d’enquêtes"
            ],
            [
              "Gunwatchers",
              "Josefin DRESCHER",
              "le limier allemand"
            ],
            [
              "Gunwatchers",
              "Stella HARDIN",
              "La sombre hyène de Sacramento"
            ]
          ]
        }
      ]
    },
    {
      "id": "scenarii",
      "title": "Scénarios",
      "level": 2,
      "audience": "mj",
      "blocks": [
        {
          "type": "p",
          "text": "22 1.4. SCENARII Voici quelques idées de situations où l’on retrouve ce genre de crawlers. Fixers -Fixer Zack, Keela, Martin et Jin sont quatre fixers du quartier de Bellroad à Las Vegas. Venant de débarquer, ils n’ont que quelques crawlers qu’ils ont réussi à engager, ils sont convoqués à 23h45 par Miles HARPER, un collègue plus ancien qui n’a pas forcément très à cœur de les voir se tirer dans les pattes. Enfermés dans une pièce pendant une partie de poker, Miles leur propose un jeu en lançant sur la table un contrat très juteux. Durant cette nuit, sans sortir une seconde de cette pièce, le fixer allant réussir cette mission sera le seul à Bellroad, les autres allant devoir dégager. Dans ce huis clos, chaque fixer géra ainsi son équipe d’un ou deux crawler, le véritable enjeu n’étant pas de réussir la mission mais de s’assurer de contrer les actions des autres en discutant et se renseignant sur eux, sur leurs crawlers. A la fin de la nuit, la porte s’ouvrit, essuyant sa veste, le maitre de Bellroad sortit… Fixers -Hooker Dan, un mercs, reçut la mission de s’introduire dans la maison de l’adjoint du maire de Tucson, Leonardo BRIGGS. Incapable d’obtenir des accès, il demanda de l’aide à sa sœur, Fina, escort-girl de la Shinoda agency, une crawler également. Avec l’aide de Tsunako et Grinhilda, elles se présentèrent lors d’une réception privée chez BRIGGS, sans invitation mais la rumeur étant que l’on y faisait entrer les personnes séduisantes aisément. Dans ce nid de vipères, les trois Hookers s’occupèrent de trouver la chambre de l’adjoint et de lui dérober l’œuvre d’art qui était demandé à Dan par l’ex-femme de BRIGGS. Fixers -Gunwatcher Simon est appelé aux urgences pour assister à la mort de sa mère, clairement canardée, il n’y a pas d’enquête, la police conclut à des balles perdues. C’est ainsi qu’il engagea Marcelyn et son assistante Martha, deux gunwatchers afin de trouver qui a osé tirer sur sa mère. Pendant leur enquête, les deux détectives privées préférèrent joindre leur force avec Daisuke, un collègue qui enquêtait de son coté sur une autre victime de la fusillade pour le compte des yakuzas. Le trio s’aperçut assez vite que rien ne collait du coté du rapport d’enquête, les témoins rapportaient trois tireurs, le rapport un seul par exemple. En fouillant, le nom de Lenny DANSON revint, hélas, Lenny s’avérant être officier de police, notamment celui ayant signé les rapports, ils furent confrontés à un choix : la vérité au risque de de fritter à la police, ou bien enterrer l’affaire…"
        }
      ]
    }
  ]
},{
  "id": "realite-v9-crawlers-deathrunners",
  "dataset": "realite-v9-crawlers",
  "category": "Réalité",
  "sourceCategory": "Réalité",
  "title": "DeathRunners — les Chiens",
  "source": "TUC_organisations_crawlers_V2(3).docx",
  "status": "canon_enrichi",
  "rebuildV2": true,
  "tags": [
    "Réalité",
    "Crawlers",
    "DeathRunners",
    "Chiens",
    "Cyberthugs",
    "Voidrunners"
  ],
  "sections": [
    {
      "id": "definition",
      "title": "Les combattants des Crawlers",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Surnommés les « Chiens » parce qu’ils attaquent la cible désignée sans la lâcher, les DeathRunners sont les spécialistes de la violence. On les engage pour tuer, capturer, frapper, torturer, intimider ou protéger. Trois grands profils se distinguent."
        }
      ]
    },
    {
      "id": "mercenaires",
      "title": "Deathrunners, Chromfighters et Mercstrikers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ces mercenaires manient les armes de guerre et possèdent une solide formation au corps à corps. Beaucoup sont d’anciens soldats ou ont été formés par une armée corporative ou gouvernementale. Ils forment le bras armé des Crawlers, capable d’attaquer comme de défendre."
        }
      ]
    },
    {
      "id": "cyberthugs",
      "title": "Gangers, Cyberthugs et Streetwatchers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ces combattants des rues gravitent autour des gangs et travaillent pour des petites bandes comme pour les grandes mafias. Leur absence d’organisation commune les maintient toutefois en marge de la pègre structurée."
        },
        {
          "type": "p",
          "text": "Moins bien équipés et entraînés que les mercenaires militaires, ils connaissent intimement leurs rues, leurs quartiers et leurs habitants. L’intimidation et la surveillance occupent une place centrale dans leur activité. Ils servent de sentinelles et d’avant-garde officieuse aux mafieux : les affronter peut entraîner une riposte bien plus lourde."
        }
      ]
    },
    {
      "id": "voidrunners",
      "title": "Voidrunners, Deathdealers et Cykillers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ces assassins doivent ne laisser ni présence, ni nom, ni trace de leur existence. Ils travaillent en équipes très réduites et se spécialisent souvent dans le tir de précision. Leur furtivité compte davantage que leur force ou leur capacité à intimider."
        },
        {
          "type": "p",
          "text": "Ils savent se défendre, mais leur expertise repose surtout sur le tir et le neurodrive. En 2035, logiciels et augmentations neurales permettent une précision exceptionnelle. Un trio fréquent associe l’assassin, un Neurodiver particulièrement perceptif qui lui transmet les données de tir, et un Gundriver chargé de l’extraction ou de la poursuite de la cible."
        }
      ]
    },
    {
      "id": "organisation",
      "title": "Organisation & réseaux",
      "level": 2,
      "blocks": []
    },
    {
      "id": "figures-notables",
      "title": "Figures notables",
      "level": 2,
      "blocks": [
        {
          "type": "table",
          "rows": [
            [
              "Sous-type",
              "Personnage",
              "Alias / désignation"
            ],
            [
              "Deathrunners",
              "Karl HENRY",
              "Super héros Californien"
            ],
            [
              "Deathrunners",
              "Hailey POWELL",
              "le soldat des enfers"
            ],
            [
              "Deathrunners",
              "Jakeline BATES",
              "J.B."
            ],
            [
              "Deathrunners",
              "Tejana",
              "la maitresse des arts"
            ],
            [
              "Cyberthugs",
              "Tia REYNOLDS",
              "la lionne noire"
            ],
            [
              "Cyberthugs",
              "Carlos SAEZ",
              "le chacal des gangs"
            ],
            [
              "Cyberthugs",
              "Kiandra PRICE",
              "Redgals queen"
            ],
            [
              "Voidrunners",
              "Mustafa DZEKO",
              "le génie de la lampe"
            ],
            [
              "Voidrunners",
              "Goro KAZUMA",
              "Le samurai pourpre"
            ],
            [
              "Voidrunners",
              "Zoya RYUKANA",
              "Tchernokill"
            ],
            [
              "Voidrunners",
              "« Daft Vador » / Kaine REID",
              "l’ombre sans visage"
            ]
          ]
        }
      ]
    },
    {
      "id": "scenarii",
      "title": "Scénarios",
      "level": 2,
      "audience": "mj",
      "blocks": [
        {
          "type": "p",
          "text": "38 2.4. SCENARII Voici quelques idées de situations où l’on retrouve ce genre de crawlers. Deathrunner -deathrunner Dans le parking souterrain de l’hypercentre commercial de Rongstreet, à Los Angeles, Thomas Baxter, un fixer, avait décidé de rassembler une équipe de choc, composé d’Alexander, Kylee, Bryan et Olga quatre « mercs » réputés bien burnés. Il leur expliqua la mission, le mardi qui approchait, sept motards, des « Gundrivers », allait escorter un fourgon blindé de San Farnilio à Los Angeles. Leur mission était simple : le fourgon et ce qu’il contenait ne devait simplement jamais arriver. Quatre mercenaires contre sept motards bien énervés n’était pas aisé mais possible, ainsi, à San Farnilio, le groupe s’occupa un à un des motards dans le motel où ils dormaient avant leur départ. Hélas, Kylee ouvrit le fourgon et découvrit une petite fille frigorifiée, c’était elle qu’ils devaient empêcher d’être « livré »… deathrunner-cyberthug Le gang des « Venomous big Seals » vient de se former, Paytrick à sa tête a rassemblé les pointures de Siridean boulevard, Kaysheen, Emilio, Maria, Danny, Brook et Tony sont les VBS. Paytrick leur file même des flingues, avec une moyenne de 19 ans, les jeunes gangers débutent à peine comme « Cyberthugs » pourtant ce n’est pas une blague d’un ainé avec ses cadets, si le gang franchement formé veut palper du fric facile, il va devoir faire ses preuves. Les Crips ont déjà une mission pour eux en prime. Quelques jours plus tôt, la copine de Daimon Night, un grand nom des Crips a été reluquée par le pizzaiolo le plus au sud de Siridean Boulevard, les VBS ont pour mission de lui péter le nez en représailles, celui qui lui coupera les couilles aura même 1000 dollars de plus… Les jeunes s’y lancent, ignorant que l’épreuve du feu n’est pas si facile, la police ayant été avertie par les crips et ce soir-là, des Bloods voulaient une pizza… Deathrunner- voidrunner Kelvin REFFER est un criminel , avec une prime de 15 000 dollars sur sa tête, c’est un évadé de la prison de Sunways, dans le désert du Nevada. Darell, Laeticia et Neils appartiennent à la « confrérie » une sorte de groupe mercenaire financé par un fixer, essentiellement des assassins émigrés d’Europe, sans papiers. Leur mission est d’éliminer Kelvin et de récupérer son corps afin de le ramener à Sunways. Dans un village déserté, le groupe repère l’évadé, cependant il ne semble plus si humain que ça, nul ne sait ce que Sunways a osé lui faire comme mutation mais pour l’abattre, le groupe reconsidéra ses options…"
        }
      ]
    }
  ]
},{
  "id": "realite-v9-crawlers-neurodivers",
  "dataset": "realite-v9-crawlers",
  "category": "Réalité",
  "sourceCategory": "Réalité",
  "title": "Neurodivers — les Cafards",
  "source": "TUC_organisations_crawlers_V2(3).docx",
  "status": "canon_enrichi",
  "rebuildV2": true,
  "tags": [
    "Réalité",
    "Crawlers",
    "Neurodivers",
    "Cafards",
    "Netdrillers",
    "Neurokillers"
  ],
  "sections": [
    {
      "id": "definition",
      "title": "Les spécialistes de l’Holonet",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Neurodivers, surnommés les « Cafards », sont les hackers des Crawlers. Ils maîtrisent l’électronique et surtout l’Holonet. Dans une société où presque tout peut être connecté, leur intervention est utile dans la plupart des missions."
        }
      ]
    },
    {
      "id": "neurodivers",
      "title": "Neurodivers, Nettravelers et Nettroughers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ces hackers parcourent l’Holonet en réalité augmentée ou en neurodrive, la connexion totale. Ils recherchent des informations et des pistes, remodèlent les espaces virtuels, prennent le contrôle de machines connectées ou s’introduisent dans les augmentations neurales."
        }
      ]
    },
    {
      "id": "netdrillers",
      "title": "Netdrillers, Cyberripers et Holopiercers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Netdrillers se consacrent au percement des sécurités et à la déconstruction des programmes. Saboteurs et artillerie lourde des hackers, ils sont plus performants dans cette spécialité que leurs homologues généralistes. Ils sont en revanche moins à l’aise dans la recherche d’informations, les interactions et les autres activités connectées."
        }
      ]
    },
    {
      "id": "neurokillers",
      "title": "Neurokillers, Brainshackers et Headshatterers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Neurokillers attaquent les augmentés et les machines. Ils piratent leurs cibles ou les appareils environnants pour provoquer des dysfonctionnements, parfois mortels. Ils évitent généralement la connexion totale, car ils doivent rester proches de leurs victimes. Moins efficaces contre les grands systèmes de l’Holonet, ils excellent à harceler et affaiblir des augmentés ou des véhicules dangereux."
        },
        {
          "type": "p",
          "text": "Leur connaissance des infrastructures neurales en fait aussi des espions capables de voler des données mémorielles. Recueillir ainsi des fragments de souvenirs d’autrui les expose au DPS, le « Distorded Personality Syndrom »."
        }
      ]
    },
    {
      "id": "generation",
      "title": "Une génération de plongeurs",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "En 2035, beaucoup d’anciens utilisateurs de l’Internet déclinant peinent encore à adopter l’Holonet. Les Neurodivers sont souvent plus jeunes que les autres Crawlers ; leur adaptation et leur apprentissage rapides favorisent leur maîtrise de ce nouveau réseau. Leur mode de vie sédentaire s’accompagne toutefois souvent d’une condition physique plus faible."
        }
      ]
    },
    {
      "id": "organisation",
      "title": "Organisation & réseaux",
      "level": 2,
      "blocks": []
    },
    {
      "id": "figures-notables",
      "title": "Figures notables",
      "level": 2,
      "blocks": [
        {
          "type": "table",
          "rows": [
            [
              "Sous-type",
              "Personnage",
              "Alias / désignation"
            ],
            [
              "Neurodivers",
              "Casey VAUGHN",
              "Le protecteur pervers"
            ],
            [
              "Neurodivers",
              "Rayne CARTER",
              "???"
            ],
            [
              "Netdrillers",
              "Domingo Valerio",
              "L’unique"
            ],
            [
              "Netdrillers",
              "Ashuna KIMBLE",
              "Le nécrohacker"
            ],
            [
              "Netdrillers",
              "Kane Riley",
              "Le menteur"
            ],
            [
              "Neurokillers",
              "Khristina YAROSLAVOVNA",
              "Le hacker-gamer"
            ],
            [
              "Neurokillers",
              "Dragoslav Memic",
              "Hacker de terrain"
            ],
            [
              "Neurokillers",
              "Zemirah Sherah",
              "L’hackssassin"
            ],
            [
              "Neurokillers",
              "Dan SHELONG",
              "la pluie écarlate"
            ]
          ]
        }
      ]
    },
    {
      "id": "scenarii",
      "title": "Scénarios",
      "level": 2,
      "audience": "mj",
      "blocks": [
        {
          "type": "p",
          "text": "51 Les neurodivers ont souvent des armes mais n’y étant pas formés et leur cerveau subissant une pression constate, ils favorisent les armes nécessitant moins de capacités mentales, les armes de tirs par exemple implique une acuité visuelle que tous les Neurodivers n’ont plus forcément, pas sans augmentation dédiée, alors ils ont plus souvent des couteaux électriques ou de matraques pour surcharger les systèmes de leurs assaillants et tenter un hack de proximité l’instant suivant. On les reconnait, hélas, à un physique moins développé, à passer des heures allongés et inertes, leur masse musculaire et osseuse est réduite. 3.4. SCENARII Voici quelques idées de situations où l’on retrouve ce genre de crawlers. Neurodiver -Neurodiver Gaby, Merry, Noemy et Vanessa, quatre neurodivers discutaient dans l’holonet, tranquillement dans un salon privé, les amis critiquaient le dernier film de la Tuatha, pas convaincus par les acteurs. Brutalement Noemy commença à agir étrangement en criant et se défendant dans le vide. Le groupe réalisa alors être témoin d’une agression dans la réalité. Ignorant qui était Noemy, ils débutèrent une enquête à la fois IRL et dans l’holonet, pour retrouver Noemy. Hélas, la jeune professeure fut retrouvée morte à son domicile. Le groupe continua l’enquête, commençant à voir des connexions de Noemy relevant de l’impossible. Ils parvinrent à rassembler le puzzle à l’aide du « fantôme » mais le coupable… Neurodiver-nedriller Le vendredi 13 avril 2035, à 7h45, Adam Nevine reçut un contrat de Owl corporation. Le soir-même, Kelly, Vike et Beam furent choisis pour la remplir. Leur mission était relativement simple, en tant que Netdriller, ils avaient deux jours pour passer la sécurité de la Silvergate d’un hangar de Byron industries. Le trio s’ajouta les services de Mercs pour tenir la sécurité de Byron Industries, le plan était simple, attaquer assez longtemps le hangar pendant que les neurodivers se connectaient un par un à la porte sécurisée menant au sous-sol. Alors qu’un à un les mercs tombaient, que Vike fit un braincrash, devenant incapable de se connecter pendant plusieurs jours, Kelly déverrouilla la porte et se déconnecta juste à temps pour voir Beam s’enfuir … Neurodiver- neurokiller Zikra est la triple championne des Ironclashes de l’arène de San Diejuana, un championnat illégal de combattants augmentés. Sponsorisée par Phoenix corporation, ses bras et son armure intégré broyaient tous les concurrents, parfois de simple techboxers aux mains mécaniques. Elle a toutefois tué la mauvaise personne sur le ring, Nelo Fajabio était l’ami d’un membre du cartel de Diejuana. Renata-maria n’engagea pas de simples mercs ou des assassins normaux, elle engagea SpinkraX, Dea6 et Juan avec une mission simple, pendant 10 jours, chaque fois qu’elle monta sur le ring, ils devaient la faire perdre, la diminuer, l’humilier et progressivement la tuer. Au septième jour néanmoins, Juan, le moins expérimenté des neurokillers provoqua un braicrash chez Zikra, elle en décéda sur le ring, la mission était remplie en un sens à moins que…"
        }
      ]
    }
  ]
},{
  "id": "realite-v9-crawlers-meditechs",
  "dataset": "realite-v9-crawlers",
  "category": "Réalité",
  "sourceCategory": "Réalité",
  "title": "Meditechs — les Termites",
  "source": "TUC_organisations_crawlers_V2(3).docx",
  "status": "canon_enrichi",
  "rebuildV2": true,
  "tags": [
    "Réalité",
    "Crawlers",
    "Meditechs",
    "Termites",
    "Cyppers",
    "Venomers"
  ],
  "sections": [
    {
      "id": "definition",
      "title": "Médecine, mécanique et augmentations",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Meditechs, surnommés les « Termites » parce qu’ils produisent, réunissent les métiers du soin et de la mécanique. En 2035, corps biologiques et dispositifs artificiels s’entremêlent : un médecin Crawler doit comprendre les machines, et un réparateur d’augmentations doit posséder des notions médicales."
        }
      ]
    },
    {
      "id": "meditechs",
      "title": "Meditechs, Chromhealers et Mergerunners",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ces généralistes soignent et réparent. Ils peuvent désinfecter une plaie, retirer une balle, suturer, puis réaligner un bras mécanique. Cette polyvalence n’en fait pas automatiquement des spécialistes de chaque opération, notamment de neurochirurgie. Chacun possède une formation dominante, médicale ou mécanique, tout en restant compétent dans les deux domaines."
        },
        {
          "type": "p",
          "text": "Leurs outils sont intégrés au corps ou dissimulés sous une blouse ou un grand manteau. Sans eux, leur efficacité diminue fortement. Leur soutien est essentiel à la survie d’une équipe, même s’ils brillent davantage dans les soins et les réparations que dans le feu de l’action."
        }
      ]
    },
    {
      "id": "cyppers",
      "title": "Cyppers, Screwrunners et Bladesigners",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Plus techniciens et ingénieurs que soignants, les Cyppers conçoivent ou modifient armes et augmentations avec une expertise supérieure à celle des généralistes. Saboteurs et sapeurs, ils sont plus redoutables encore lorsqu’il s’agit de les détruire. Ils maîtrisent aussi la démolition des bâtiments et des véhicules."
        }
      ]
    },
    {
      "id": "venomers",
      "title": "Venomers, Toxyrunners et Plaguelords",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Venomers sont chimistes, infirmiers ou médecins. Ils conservent des compétences de soin mais délaissent la mécanique au profit de la chimie offensive. L’effondrement des restrictions sur les armes biochimiques en 2035 a ouvert un terrain à leurs pratiques : incapacité provoquée d’une équipe de sécurité, gaz de combat, poisons et sérums d’interrogatoire."
        },
        {
          "type": "p",
          "text": "Les autres Crawlers les craignent aussi pour les risques qu’ils font courir à leurs alliés. Une fiole virale perdue ou brisée peut condamner une équipe. Certains emploient des arbalètes de guerre pour projeter leurs fioles et transportent des acides redoutés sous le surnom de « salive de xénomorphe »."
        }
      ]
    },
    {
      "id": "reseau",
      "title": "Une place centrale dans les équipes",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Meditechs disposent souvent d’un réseau de connaissances aussi étendu que celui des Fixers : lorsqu’un Crawler est blessé ou endommagé, il vient chez eux plutôt qu’à l’hôpital. Le décalage entre leurs compétences élevées et leur exclusion du monde corporatif nourrit leur réputation de praticiens atypiques, parfois psychologiquement instables."
        }
      ]
    },
    {
      "id": "organisation",
      "title": "Organisation & réseaux",
      "level": 2,
      "blocks": []
    },
    {
      "id": "figures-notables",
      "title": "Figures notables",
      "level": 2,
      "blocks": [
        {
          "type": "table",
          "rows": [
            [
              "Sous-type",
              "Personnage",
              "Alias / désignation"
            ],
            [
              "Meditechs",
              "Taishara JIBSON",
              "La reine de la casse"
            ],
            [
              "Meditechs",
              "Phoebe EDGAR",
              "Le piment"
            ],
            [
              "Cyppers",
              "Elizabeth Mircalla KARNSTEIN",
              "La stryge de los Angeles"
            ],
            [
              "Cyppers",
              "Lenny Falk",
              "Le bossu de notre Tech."
            ],
            [
              "Cyppers",
              "Dushane MURRAY",
              "Le dealer de titane"
            ],
            [
              "Venomers",
              "Narako AUSTIN",
              "La pyrotechnicienne"
            ],
            [
              "Venomers",
              "Aisha WHITE",
              "La création parfaite"
            ],
            [
              "Venomers",
              "Arnstein GILL",
              "Le magicien des chairs"
            ],
            [
              "Venomers",
              "Mi-Yeon RYONG",
              "Le monstre de Yungcheon"
            ]
          ]
        }
      ]
    },
    {
      "id": "scenarii",
      "title": "Scénarios",
      "level": 2,
      "audience": "mj",
      "blocks": [
        {
          "type": "p",
          "text": "64 4.4. SCENARII Voici quelques idées de situations où l’on retrouve ce genre de crawlers. Meditech -Meditech Bryan JORDAN rassemble une équipe, à l’occasion de la Tokyo night cup (TNC), une course illégale située à Tokyo, il veut faire son grand retour en tant que pilote. Hélas, l’écurie Omegablade a fermée, anéantie économiquement par Bullmotors corporation Faute d’écurie, il rassemble donc ses économies et convoque quatre meditech, Julio, Sin-Bee, Gavin et Monica. Julio se propose de concevoir le véhicule pour la course, il opte pour une sorte de dragster réversible capable de rouler sur les murs et les concurrents. Monica se met sur l’interface depilotage, du neurodriveboosté allant se baser sur la vue du pilote, elle bricole donc la connectique et des yeux artificiels. Sin-bee s’attaque aux modifications du pilote, elle est en charge de la chirurgie des yeux préparés par Monica et de l’amputation des jambes pour gagner en place utile. Enfin, Gavin s’occupe du cocktail chimique allant être injecté en continue dans le pilote pour qu’il reste conscient malgré les G qu’il va prendre… Meditech-Cypper La prison corporative de Bisongate était à l’abandon depuis des jours depuis la fermeture de la corporation. Caridia JAMES, l’ancienne directrice de la corporation en faillite avait vendu les lieux à Phoenix corporation, les installations, le personnel et les éventuels survivants chez les prisonniers s’il y en avait, n’ayant pas été nourris depuis six jours. Derrière, elle fit appel à Adam Nevine pour rassembler quelques trois « Cyppers », des meditech spécialisés en sabotage notamment. Dorris, Stanley et Rachida furent choisis, leur mission était simple, détruire les principaux sites de production de la prison et la piéger de sorte que Phoenix corporation paye ses OPA sauvages par la perte de toute équipe essayant de reprendre le site. Ils n’eurent aucun mal à réussir cependant, alors qu’ils s’en allaient… meditech- Venomer Le petit village de San Raneiros était paisible, pour le compte de Dwarfood corporation, des éleveurs s’occupaient à l’ancienne de vastes troupeaux de longhorns, les faisant paitre dans des villages abandonnés où l’herbe poussaient plus vertes qu’en plaine. Un jour néanmoins ils firent appel à des Venomers, des meditech spécialisés dans la chimie. En effet, leur vétérinaire avait trouvé une mutation extrêmement étrange chez tous les bovins de l’élevage qu’il avait testé, suspectant une attaque génétique de Yellowfood pour altérer la nourriture produite. Roy, Natasha et Estéban furent recrutés pour abattre les taureaux infectés, des créatures extrêmement violentes et mutantes pouvant corrompre tout le troupeau et peut être des humains…"
        }
      ]
    }
  ]
},{
  "id": "realite-v9-crawlers-gundrivers",
  "dataset": "realite-v9-crawlers",
  "category": "Réalité",
  "sourceCategory": "Réalité",
  "title": "Gundrivers — les Corneilles",
  "source": "TUC_organisations_crawlers_V2(3).docx ; factions crawlers _ les anti système(3).pdf",
  "status": "canon_enrichi",
  "rebuildV2": true,
  "tags": [
    "Réalité",
    "Crawlers",
    "Gundrivers",
    "Corneilles",
    "Neopbikers",
    "Necropunks",
    "Mandealers",
    "Neoslavers",
    "Motards"
  ],
  "sections": [
    {
      "id": "definition",
      "title": "Les transporteurs et les charognards",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Gundrivers assurent le commerce et surtout le transport hors des circuits ordinaires. On les surnomme les « Corneilles » parce qu’ils rôdent autour des villes et récupèrent ce qui y est abandonné. Leur connaissance des routes et leur mobilité sont leurs principaux atouts."
        }
      ]
    },
    {
      "id": "gundrivers",
      "title": "Gundrivers, Neobikers et Gofasters",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Motards et surtout pilotes, ils transportent des marchandises et assurent la gestion et la sécurité des convois que leurs clients ne veulent pas confier aux corporations de sécurité. Les cartels de la drogue font notamment appel à eux."
        },
        {
          "type": "p",
          "text": "Les distances de Grande Californie, particulièrement à Los Angeles, rendent leur présence précieuse dans une équipe. Tous les Crawlers ne souhaitent pas emprunter le métro ; un véhicule modifié et non traçable constitue un avantage majeur. Les Gundrivers savent se battre dans les bars et tirer en conduisant, parfois sans voir directement leur cible, mais restent moins compétents au combat que les DeathRunners."
        }
      ]
    },
    {
      "id": "necropunks",
      "title": "Necropunks, Chromraiders et Lootrunners",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ces pillards attaquent les convois qu’ils rencontrent sans attendre un contrat sur une cible précise. Pirates des routes, ils abordent aussi des véhicules maritimes et parfois aériens au moyen de motos, bateaux, drones ou hélicoptères."
        },
        {
          "type": "p",
          "text": "Ils tuent généralement les équipages et récupèrent les augmentations sur les corps, même lorsque la cargaison les intéresse peu. Leur butin est revendu au marché noir. Comme les Gangers, leur fonctionnement chaotique et l’absence d’une organisation commune les distinguent de la pègre structurée."
        }
      ]
    },
    {
      "id": "mandealers",
      "title": "Neoslavers, Mandealers et Humanretailers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Ces trafiquants d’êtres humains exploitent la marginalisation des personnes sans emploi stable ni Logifate jugé acceptable. Ils capturent notamment des migrants, les enferment dans des squats, puis les revendent aux corporations, aux mafias ou à des particuliers."
        },
        {
          "type": "p",
          "text": "Ils évaluent les compétences des captifs pour augmenter leur prix et vont parfois jusqu’à les former. Certains louent cette main-d’œuvre pour des missions de Crawlers. Peu présents dans les équipes, ils restent fréquemment sollicités ; nombre de leurs captifs finissent eux-mêmes par devenir Crawlers."
        },
        {
          "type": "p",
          "text": "Leur activité exige surtout intimidation et sens du commerce. Ce sont les moins bons combattants de cette famille et ils limitent leur usage de l’Holonet pour rester difficiles à tracer."
        }
      ]
    },
    {
      "id": "taxonomy-anti-systeme",
      "title": "Clubs, pillards et trafiquants",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Neobikers se regroupent en gangs et en Motorcycle Clubs installés dans leurs propres villages. Transporteurs et guerriers de la route, ils se livrent des guerres durables entre grandes factions, notamment les Hell Angels et les Cruisers."
        },
        {
          "type": "p",
          "text": "Les Necropunks résident souvent dans les mêmes villages que les Neobikers. Ils épargnent leurs frères de club et attaquent les rivaux, les corporatistes ou les voyageurs indépendants."
        },
        {
          "type": "p",
          "text": "Les Mandealers opèrent en dehors des réseaux légaux. Leur trafic porte sur les adultes, les enfants, les organes et les biens des captifs. Manipulation et destruction psychologique précèdent la vente ; des camions entiers servent au transport des personnes réduites en esclavage."
        }
      ]
    },
    {
      "id": "motards-histoire-structure",
      "title": "Motards — histoire, guerre du Chrome & structure des chapitres",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Motards Le phénomène de motards n’est pas récent, e, 1935, les Outlaws ont été fondé, dès 1948, les Hell Angels apparaissent aussi, les Pagans en 1959, les bandidos en 1966, les Mongols en 1969, pour les cas américains. Chez les britanniques, les « Mods » des années 1960 étaient des bourgeois endimanchés se droguant aux amphétamines et vivant sur leurs scooters, ils devinrent hippies pour une partie, Skinheads pour les plus prolétaires. Au Japon, dans les années 70 et 80, on retrouvait le phénomène des Bōsōzoku, bien qu’ils aient commencé à apparaitre dès les années 50 en s’inspirant des motards américains et du phénomène du Tuning. D’autres occurrences existent, mais ce qu’il faut retenir c’est que ces mouvements sont des contre-culture, souvent plus violentes et très soudées, une notion de fraternité est intrinsèque à la majorité de ces « gangs ». C’’est surtout après la Seconde Guerre Mondiale que les bikers américains explosent en nombre, le besoin de retrouver cette fraternité perdue chez les vétérans, le décalage avec la société, la violence résiduelle et traumatique, tout cela mène à ce que les anciens militaires se regroupent par fraternité pour recréer un tissu communautaire dans lequel ils ont une place, ils ont un sens. Après 2028, c’est un traumatisme plus grand que jamais, des centaines de millions de gens sont morts en quelques années, avec la guerre, les catastrophes climatiques, les épidémies et les calamités industrielles des corporations, les familles sont détruites et les vétérans si nombreux que le gouvernement Américains, après quelques mois à les glorifier, les pointe du doigt comme des criminels fascistes cherchant à renverser la Justice et la Liberté. Le fossé entre « sacrifié » et « planqué » est énorme et pour certains, comme Arthur Bartram, c’en est trop, si la société ne veut plus d’eux, ne veut pas payer les soldes ni les primes promises pour tous les sacrifices, alors ils s’arrangeront sans. Les motards n’ont pas attendu 2028 pour exploser néanmoins, les blessés revenus au pays s’organisaient et la désertification, l’exode rural monstrueux, tout cela facilitait la vie de motards, de moins en moins contraints. La pègre se renforçant, la demande de transporteurs armés était de plus en plus grande, c’est comme ça que dès 2025, les Bandidos prennent le contrôle autour de grandes villes et n’attaque des villes plus humbles. En 2029, dans le mépris et le déni le plus total, c’est toutefois l’évènement majeur de l’Histoire des motards californiens : la « guerre du chrome ». Russell Pittman, principal chef des « Bandidos » d’Arizona, siégeant à Phoenix, se lance dans la conquête totale des alentours Californiens, contractant des accords avec les Chinois des triades et le Cartel de Sinaloa. Il a pour alliés les Mongols et les historiques Outlaws. A l’époque, il n’a aucun doute d’une victoire écrasante. Toutefois, Arthur Bartram, « l’animal », vétéran très décoré de 22-28 brisa la nuque de Malcolm Yates, le chef des angels de Los Angeles, ce dernier voulant s’allier à Plittman, Bartram refusa et déclara que si marché il y avait, Hell Angeles en profiteraient, sans partage, refusant de se soumettre à des clubs ennemis par pur profit. Il s’allia aux Russes de la Bratva afin de mener sa guerre. En parallèle, les Cruisers, les mad dogs et les Reapers se refusèrent aussi à se soumettre, s’alliant aux Italiens et aux Japonais pour le même combat. Les mafieux n’avaient pas vraiment d’intérêt à soutenir plus que ça les motards, cette appartenance à une alliance était plus la volonté des gangs de motards que de la pègre, laquelle se foutait bien de qui avait le territoire, tant qu’il y avait quelqu’un prêt à négocier. La boucherie sans nom dura plusieurs mois, les routes étaient parfois ensanglantées et les débris de véhicules jonchaient les bas-côtés dans l’indifférence."
        },
        {
          "type": "p",
          "text": "Après la mort de tous les principaux chefs Bandidos, Mongols et Outlaws, la guerre se tourna entre Angels et Cruisers, les deux gangs leaders, mais les oppositions entre mafieux s’estompant et l’intervention de Veronica Silver marqua l’instauration d’un statut quo. Pas de grand gagnant, les Cruisers avaient les banlieues des grandes villes, les hell Angels avaient toutes les petites villes et stations-services éloignées, deux philosophies assez différentes. En Grande Californie on retrouve désormais essentiellement : • «Hell angels» MC menée par “Arthur Bartram”, c’est le gang le plus emblématique des motards. • « Cruisers » MC menée par « Calvin Barron”, c’est le gang le plus présent à Los Angeles en 2035. • « Reapers Inc.» menée par « Luther Pierce”, c’était un tout petit gang devenu club de motards d’importance par la guerre du chrome. Il réclame l’appartenance de Veronica Silver comme un de ses membres. • « Vagos » MC menée par « Miguel González”, c’est le gang le plus lié aux Cartels, il est plus mobile et est essentiellement installé dans le sud de la Grande Californie. • « Sons of Silence » MC menée par « Raghnaid Peutan”, c’est un gang qui a énormément muté, en 2028, il a largement été influencé par l’Aryan Brotherhood et la mafia irlandaise. • « Sons of Legba » MC menée par « Zaketa Harris”, c’est un gang exclusivement d’afro-américains, ils arbitrent les conflits entre les gangs des Crips et des Bloods. • « Onikishi» MC menée par « Honda Daisuke”, c’est le gang de motards le plus asiatique, il rassemble une part de japonais, de chinois et de coréens essentiellement. • « Last Crows » MC menée par « Wenona”, c’est un gang de motards ultraviolents et secrets, il compte un grand nombre d’amérindiens. On peut citer que les Mongols, Outlaws et bandidos n’ont pas disparus, mais en Grande Californie, il existe une réelle menace pour leur vie, avoir un cuir portant leur emblème est un motif d’assassinat immédiat si n’importe quel gang cité au-dessus les repère. Chaque gang est divisé en de très nombreux chapitres. Chaque chapitre possède : • Un président • Un vice-président • Un secrétaire-trésorier • Un sergent d’armes • Des Membres attitrés (membres ayant droit de vote) • Des Membres honoraires (membres de base) • Des Prospects (postulants) • Des Hangarounds (parasites associés au club) Il existe des antagonismes solides entre chapitres d’un même gang et des amitiés entre chapitres de différents gangs, généralement ce sont les présidents qui déterminent l’entente."
        }
      ]
    },
    {
      "id": "organisation",
      "title": "Organisation & réseaux",
      "level": 2,
      "blocks": []
    },
    {
      "id": "figures-notables",
      "title": "Figures notables",
      "level": 2,
      "blocks": [
        {
          "type": "table",
          "rows": [
            [
              "Sous-type",
              "Personnage",
              "Alias / désignation"
            ],
            [
              "Gundrivers",
              "Calvin BARRON",
              "Le pillard"
            ],
            [
              "Gundrivers",
              "Arthur BARTRAM",
              "Evil Odin"
            ],
            [
              "Necropunks",
              "Kashrim el KHAYAT",
              "Le prince d’Iranie"
            ],
            [
              "Necropunks",
              "Kendasha ROBERTS",
              "La goule dorée."
            ],
            [
              "Necropunks",
              "Yan XIAO",
              "Le vautour chinois"
            ],
            [
              "Neoslavers",
              "Tuuwa KOLENYA",
              ""
            ],
            [
              "Neoslavers",
              "Todd LARSEN",
              "Black Procurer"
            ],
            [
              "Neoslavers",
              "Kerlyn SHERRES",
              "l’amie des corpos"
            ],
            [
              "Mandealers",
              "Yong-Gi MANGJOL",
              "Le traitre de l’Asie"
            ]
          ]
        }
      ]
    },
    {
      "id": "scenarii",
      "title": "Scénarios",
      "level": 2,
      "audience": "mj",
      "blocks": [
        {
          "type": "p",
          "text": "78 5.4. SCENARII Voici quelques idées de situations où l’on retrouve ce genre de crawlers. gundriver - gundriver Anna-Lucia, une belle hispanique convoqua Vincent, Dwayne, Michelle et Jordana, quatre Gundrivers particulièrement réputés. Elle leur offrit une simple proposition, réaliser une run, la plus rapide et dangereuse de leur vie, contre deux millions chacun s’ils livraient dans l’Oregon ce qu’elle leur proposait de transporter du moins deux millions par caisse plutôt que par personne, mais cédées à une personne différente au départ, libre à eux de se voler ou s’arranger à l’arrivée. Un go fast sans aucune concession à travers la grande réserve indienne et les forces de la Tala security omniprésente pouvant les massacrer à vue à tout instant. La course de leur vie de fait. Chaque grundriver s’équipa, pour deux millions minimums, recrutant chacun un acolyte, chacun ayant à choisir sur quoi miser : vitesse ou discrétion, travail d’équipe ou individualisme… Gunbdriver- necropunk Larry, Stacy, Jamel et Latoya venaient de réussir le coup du siècle, à bord de leur navire ils ont réussi à aborder un vaste megatanker de corporations. Après avoir fait exploser une bombe EMP (impulsion électromagnétique), ayant grillé tous les systèmes du navire colossal et les augmentations des soldats, ils avaient enchainé sur deux tirs incendiaires pour nettoyer une partie des marins et des soldats, désormais ils étaient à bord et plus personne ‘n’était en état pour les empêcher de piller, hélas pas les augmentations, grillées mais les éventuels produits dans les cargaisons avaient un système les en protégeant. Les nécropunks s’enfoncèrent donc dans l’immense tanker dérivant, ignorant absolument tout de ce qui y était transporté ni ce que leur EMP avait- libéré… Gundriver - neoslaver Rachid, Kara, Alyxer et Marie-Joelle s’installèrent à une table près du ring central du bar clandestin. La soirée allait être difficile, obligés de se rassembler, ; les quatre neoslaves devaient déterminer quel était leur poulain le plus apte pour remplir un contrat auprès d’un fixer ayant demandé un crawler pas cher et supprimable mais assez compétent. Un investissement donc, il fallait trouver quel type était assez bon pour réussir et assez mauvais pour ne pas être une perte. Une soirée à négocier sur des profils d’émigrés de leur réserve, choisir pas trop jeune ni trop vieux non plus. Pendant ce temps, les rejetés allaient se battre sur le ring ; Ce qu’ignoraient les neoslavers c’était que celui choisi n’allait pas être tué mais opéré pour devenir le cobaye d’un nouvel équipement de test et qu’il allait revenir à eux, mécontent…"
        }
      ]
    }
  ]
},{
  "id": "realite-v9-crawlers-neopunks",
  "dataset": "realite-v9-crawlers",
  "category": "Réalité",
  "sourceCategory": "Réalité",
  "title": "Neopunks — les Frelons",
  "source": "TUC_organisations_crawlers_V2(3).docx ; factions crawlers _ les anti système(3).pdf",
  "status": "canon_enrichi",
  "rebuildV2": true,
  "tags": [
    "Réalité",
    "Crawlers",
    "Neopunks",
    "Frelons",
    "Ragehowlers",
    "Freerunners",
    "Enders"
  ],
  "sections": [
    {
      "id": "definition",
      "title": "Les contestataires antisystème",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Neopunks, surnommés les « Frelons », combattent activement une société dominée par les corporations. Certains s’opposent aussi au gouvernement, aux grandes religions ou à toutes les influences. Ils se distinguent des Crawlers qui, bien que rejetés, continuent de composer avec le système."
        }
      ]
    },
    {
      "id": "mappeurs",
      "title": "Neopunks, Mappeurs et Cyrockers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les artistes, leurs fans, les intermittents du spectacle et leur entourage se rassemblent autour de la MAP. Cette musique contestataire est à la fois un mouvement idéologique, une création sonore et un système complexe de codes permettant de chiffrer des informations."
        },
        {
          "type": "p",
          "text": "Leurs apparences déstructurées et agressives, piercings, tatouages et modifications esthétiques expriment croyances, parcours et colère. Habitués aux pogos et aux bagarres, ils savent se défendre et encaisser. La MAP étant profondément liée à l’Holonet et à ses strates les plus sombres, ils possèdent aussi des compétences en neurodrive."
        },
        {
          "type": "p",
          "text": "Très sociables parmi les Crawlers, ils utilisent leur allure pour intimider et éviter certains conflits. Privés de soutien corporatif, les artistes doivent également savoir vendre leur travail pour vivre. Leur hostilité vise les corporatistes, la police et les formes d’autorité qu’ils rejettent."
        }
      ]
    },
    {
      "id": "freerunners",
      "title": "Freerunners, Anticorpos et Neorebels",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Insurgés ont choisi la guerre et la guérilla. Ils ne comptent plus sur le choc artistique pour éveiller les citoyens : ils estiment que la population les rejoindra lorsque l’ennemi sera démasqué, quitte à souffrir jusque-là. Pour les plus radicaux, les morts accumulés rendent tout retour en arrière impossible."
        },
        {
          "type": "p",
          "text": "À la différence du mercenaire, le Freerunner choisit un combat pour sa cause plutôt que pour sa rémunération. Il emploie des armes plus lourdes et peut accepter des dommages collatéraux que d’autres refuseraient. Ses tatouages affichent son appartenance dans un langage distinct de celui des Mappeurs."
        }
      ]
    },
    {
      "id": "enders",
      "title": "Enders, Desertpunks et Outfolkers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Enders rejettent la société jusqu’à s’en retirer, plutôt que de l’exploiter de l’intérieur. Ils s’exilent et, pour certains, se préparent à la fin du monde. Dans les milieux survivalistes les plus extrêmes de Californie, le réchauffement climatique impose une existence rude : vêtements récupérés dans les décharges, santé précaire et vie sans augmentations."
        },
        {
          "type": "p",
          "text": "Ces survivants robustes et endurants savent transformer les objets disponibles en armes et tirer parti de la moindre ressource alimentaire. Leur retrait du monde prend cependant des formes diverses selon les communautés."
        }
      ]
    },
    {
      "id": "taxonomy-anti-systeme",
      "title": "Ragehowlers, Freerunners & Enders",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Dans le vocabulaire de la police et du CBII, un « nid de frelons » désigne un rassemblement de Neopunks. Ces anarchistes et contestataires cherchent à vivre en se soustrayant au moins à l’une des quatre grandes influences ; certains les rejettent toutes."
        },
        {
          "type": "p",
          "text": "Les Ragehowlers expriment leur colère par la voix, la musique et les arts. Couramment appelés Neopunks, ils donnent leur nom à l’ensemble de la famille. Les Freerunners, ou Insurgés, jugent ces méthodes insuffisantes et cherchent à anéantir les institutions par la révolution, les destructions, les captures et les meurtres."
        },
        {
          "type": "p",
          "text": "Les Enders quittent les villes et la société pour bâtir leurs propres communautés. Hippies, survivalistes, complotistes et déserteurs y mêlent des visions très différentes, unies par le rejet de la société de 2035."
        },
        {
          "type": "p",
          "text": "Plus que les autres Crawlers, les Neopunks entretiennent des liens étroits avec leurs pairs. Qu’ils soient artistes, insurgés ou exilés volontaires, leur mode de vie s’inscrit dans une communauté. Ce besoin de réseau explique l’apparition de véritables factions en leur sein."
        }
      ]
    },
    {
      "id": "organisation",
      "title": "Organisation & réseaux",
      "level": 2,
      "blocks": []
    },
    {
      "id": "figures-notables",
      "title": "Figures notables",
      "level": 2,
      "blocks": [
        {
          "type": "table",
          "rows": [
            [
              "Sous-type",
              "Personnage",
              "Alias / désignation"
            ],
            [
              "Neopunks",
              "Leslie WRIGHT",
              "Déesse de la technologie"
            ],
            [
              "Neopunks",
              "Damon HARRINGTON",
              "Hadès"
            ],
            [
              "Freerunners",
              "Darielle POWER",
              "Meneuse des Void"
            ],
            [
              "Freerunners",
              "Ryan ROWE",
              "Un chef de l’insurrection."
            ],
            [
              "Freerunners",
              "Kristina RUIZ",
              "Un chef de l’insurrection"
            ],
            [
              "Enders",
              "Osheena PAYNE",
              "Iron Pain"
            ],
            [
              "Enders",
              "Damian ESCRIBANO",
              "Fuel King"
            ],
            [
              "Enders",
              "Gerrika REESE",
              "Lady Desert"
            ],
            [
              "Enders",
              "Ogshaata « Otto »",
              "Le chaman"
            ]
          ]
        }
      ]
    },
    {
      "id": "scenarii",
      "title": "Scénarios",
      "level": 2,
      "audience": "mj",
      "blocks": [
        {
          "type": "p",
          "text": "91 souvent usés et des looks agressifs, peu importe qu’on parle d’un neopunks ou d’un Enders, ils font assez peu à voir tous les deux. Ils ont des armes, souvent de récupération, improvisées ou plus anciennes, comme pour montrer leur attachement à un passé révolu. 6.4. SCENARII Voici quelques idées de situations où l’on retrouve ce genre de crawlers. Neopunk- neopunk Caleb, Katryn et Tarek se réveillent un matin, dans un parc. Chaque neopunk est amnésique, il ignore qui sont les deux autres et ne se souvient pas de la nuit passée, seul un coup de tampon sur leur avant-bras atteste qu’ils étaient à une « wild stage ». Afin de recomposer leur mémoire, chacun va devoir mettre ses compétences en action pour retracer leur nuit, pourquoi caleb a une trace de semelle tatouée sur une fesse ? Pourquoi Katryn porte des habits qui sont bien trop larges pour elle ? Pourquoi Tarek a le corps d’une femme ? Une enquête qui s’avéra compliquée… Neopunk-freerunner En 2035, il existe de nombreux quartiers abandonnés, ils ne sont soumis à aucune loi, aucun commerce n’a le droit de s’y implanter, aucune force de police n’intervient, l’électricité, l’eau, rien n’est assuré et ni les urgences ni les pompiers ne viennent si on les appelle. Pourtant des millions de gens y résident, des parias, rejetés par les corporations et le logifate, refusant d’être des esclaves modernes d’un système qu’ils n’avaient pas demandé. Le quartier 14 de San francisco en est un. C’est un quartier dévasté par le Big one, les inondations et les dolines ayant suivi, un vaste cratère de ruines tombant dans un abime insondable. Pourtant le jeudi 15 février 2035, des troupes s’infiltrèrent, équipés de combinaisons de combat argentées, les troupes d’épuration de Byron industries entrèrent en action, tuant 75 personnes en deux heures avant d’installer leur campement. Ramon, Helen, Owen et Genesis furent mobilisés par Osheena PAYNE en personne, débarquant dès le soir-même. Il n’était pas question de laisser une corporation purger l’abime de San Francisco, ce symbole de l’abandon de millions de gens par les autorités locale. Les équipant, elle chargea ses meilleurs guerriers de tenir pendant 12 jour jusqu’à ce qu’elle revienne avec assez de troupes insurgées… Neopunk-Ender Tiwa est une comanche, elle a toujours refusé les réserves indiennes. Formant sa communauté avec des Mexicains et quelques américains, quand un groupe de mafieux commença à s’intéresser à un crash d’avion-cargo sur ses terres loin des villes, elle décida d’en appeler à tous les volontaires, dont Hokine, Amanda et Ismael afin de mener des actions de guérilla pour empêcher la vingtaine de mafieux d’accéder à l’avion ou de le piller avant eux. Un choix qui entraina de graves conséquences pour sa communauté…"
        }
      ]
    }
  ]
},{"id":"realite-v9-crawlers-insurges","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Insurgés — les Freerunners","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système"],"sections":[{"id":"insurrection-mondiale","title":"L’Insurrection au-delà des Crawlers","level":2,"blocks":[{"type":"p","text":"Les Insurges L’insurrection civile est un phénomène qui dépasse largement le cadre des crawlers californiens. Entre 2022 et 2035, c’est l’affaiblissement et la corruption des états qui mena sans cesse à des soulèvements populaires. On peut souligner que certains pays ont été pionniers dans ce qu’on peut appeler la « véritable Insurrection », c’est le cas de la France, tandis que d’autres n’ont pas eu cette réaction malgré l’effondrement de leurs gouvernements, comme le Japon, surtout après la Guerre où, finalmeent, l’ordre et la paix établie par les corporation s’instaura comme un avenir plus radieux que jamais, alors qu’en France, loin de la guerre, loin de l’intérêt des corporations, c’est un effondrement économique et libertaire qui a été flagrant. Là où les crawlers sont propres à un contexte Californien, même si on trouve des formes équivalentes dans les pays « holodéveloppés », les insurgés sont un phénomène mondial et le développement californien amena à concentrer tous les intérêts, l’état Californien étant possiblement le dernier grand état puissant, les insurgés s’y rassemblèrent. On ne différencie pas vraiment les insurgés issus des pays étrangers aux Etats-Unis des insurgés locaux car désormais, ça n’a plus de sens, c’est l’idéologie défendue qui importe. Parmi les grandes factions d’insurgés on retrouve : • « Raising Freedom » menée par “the Raiser”, elle est propre à la Californie, née à Los Angeles, pendant les émeutes entre la mairie corrompue et les citoyens affamés et perdus après le Big One. • «Health Age» menée par « the Plague queen”,elle est née en Californie après uen vague de mort à cause d’un virus et du coût trop cher des médicaments imposés par les biocorpos. • «Iron Revengers» menée par « the Iron Pain”,elle est née en Californie, dans les prisons où le bouquin de « l’Iron pain » ont aidé des milliers de vétérans paumés à retrouver un but à leur vie. • «La grande Révolution » menée par Nathan Chappelle, velle est née en France pendant les grandes crises sociales européenne, c’est la mieux organisée et l’une des plus actives. • «Green Fairy Mother » menée par Sahamena Lannis, elle est née en Suède quand on constata une accélération inédite de la pollution mondiale par le renforcement corporatif durant la guerre de 22-28, l’écologisme européen refusa de se taire sur la question. • «Mermaid Soldiers » menée par « Tsunamilady ». elle est née en Australie, face au réchauffement climatique et l’installation de station subaquatique, des activistes écologiques ont pris sur eux de rappeler aux riches privilégier que se réfugier au fond des mers ne les exemptait pas de payer le prix de leur pollution en surface. • «Seungli» menée par Kang Sung-Hyung elle est née en Corée unifiée, après la guerre de 22-28, la population nord-coréenne a été asservie, humiliée, mise en camp de concentration, massacrée dansles campagnes par vengeance des sud-coréens, russes, chinois et japonais. Des restes de l’armée nord-coréenne, cette faction s’est imposée pour défendre ces opprimés jusqu’en Californie."},{"type":"p","text":"• «Native old blood» menée par « Talatuwa » elle est née en Californie, lors de la création de la Grande Réserve indienne. Certains refusèrent de vivre sous le joug de la tala corporation. • «Insurgent Army of Caspian Survivors» menée par « Valerian Gruzinsky » elle est née en Iran, quand Wellspring divisa le pays entre Iran et Irannie corporative puis s’empara des ressources des pays alentours. • «Your Debt, Your life» (YDYL) représentée par « Myra Allan » elle est née en Californie, quand l’IA YDYL a été lancée, l’intelligence artificielle étant un équivalent du Logifate, mais à visée anti-corporatiste, elle désigne les personnes ayant un impact négatif pour l’avenir et ces insurgés massacrent tout ceux qui y sont liés, sans plus réfléchir. • «Black Star» Menée par « Alicia Starrogue » elle est née en Californie, c’est une faction d’insurgés assez énigmatique, elle n’intervient que parfois, et se fout en plein milieu de conflits entre autre faction, corporatistes contre mafieux, gouvernement contre insurgés, religieux contre neopunks. • «Alhaqiqa» Menée par « Ameena al-Gad» elle est née en Iran, on la rattacherait spirituellement à la secte Nizarite, les « assassins » d’antan. Ce sont des insurgés très secrets qui soutiennent les autres factions d’insurgés, notamment les IACS ou YDYL. Ces 12 factions d’insurgés représentent l’ultime colère du peuple Californien et même mondial face aux 4 influences tyranniques qui écrasent les peuples pour les asservir. On ne peut toutefois pas dire qu’ils sont bénéfiques et encore moins qu’ils n’œuvrent de concert, en effet, les guerre entre insurgés sont presque aussi nombreuses que celles qu’ils mènent contre leurs ennemis désignés. L’animosité entre « Raiser » et « Iron Pain » est connue, de même, personne ne collabore officiellement avec la « Seungli », on les accuse de terrorisme et de vouloir se venger, mais la vérité reste plus subtile et compliquée, si la vengeance est source d’action chez les insurgés, pour le cas des résistants nord-coréens, il existe de vrais crimes de guerre et une véritable exploitation humaine dont aucun coupable n’a été et ne sera jamais condamné, puisqu’en face de toute protestation, les propres crimes des nord-coréens sont évoqués, comme s’il n’était pas possible d’être coupable face à eux. Les insurgés rejettent officiellement les autres Influences, cependant, c’est le plus souvent par ordre de préférence. Par exemple, « Raising Freedom » est anti-gouvernementaux, les ennemis sont Seth Dirkman et Dina Page, les corporations sont détestées dans la mesure où elles ont pourri les gouvernement, la pègre est similaire aux corporation, elle participe au délabrement de la société mais n’est pas responsable directe pour cette faction, enfin, la religion est en revanche un soutien pour le peuple elle est donc très souvent épargnées voire défendue. «Alhaqiqa» est anti-religion, elle puise ses origines dans une secte, toutes les autres religions sont des mensonges (la faction se nomme « Vérité »), les ennemis sont Paladia et les autres grands religieux, ils sont soutenus par les pègres, qui très souvent les financent et cachent la vérité, les gouvernements aussi cachent la vérité même s’ils ne sont que des chiens des religieux sans le savoir, par héritage culturel, quant aux corporations, ce ne sont que des marchands sans âmes, ils ne sont pas des ennemis. Deux factions d’insurgés, deux perceptions des Influences très différentes donc."}]},{"id":"factions","title":"Douze grandes factions","level":2,"blocks":[{"type":"table","rows":[["Faction","Figure associée"],["Raising Freedom","The Raiser"],["Health Age","The Plague Queen"],["Iron Revengers","The Iron Pain"],["La Grande Révolution","Nathan Chappelle"],["Green Fairy Mother","Sahamena Lannis"],["Mermaid Soldiers","Tsunamilady"],["Seungli","Kang Sung-Hyung"],["Native Old Blood","Talatuwa"],["Insurgent Army of Caspian Survivors","Valerian Gruzinsky"],["Your Debt, Your Life","Myra Allan"],["Black Star","Alicia Starrogue"],["Alhaqiqa","Ameena al-Gad"]]}]}]},{"id":"realite-v9-crawlers-insurges-raising-freedom","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Raising Freedom","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Raising Freedom"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"Cette faction d’insurgés est très Californienne. Elle est même propre à Los Angeles à la base. Pendant la guerre, les moyens du LAPD ont été continuellement diminués, c’est pour ça que la pègre et les gangs se sont si bien déployés. C’est toutefois la corruption des maires qui a joué le plus lourd des rôles, toute la police, les pompiers, les hôpitaux devenant une vaste machine corrompue où le népotisme des planqués exemptés d’aller se battre était d’une odieuse puanteur pour les rares personne ayant envie de bien faire. Les émeutiers de 2022 ont souvent été désignés comme les « pères fondateurs » de ce mouvement, cependant, ces émeutes sans réelle organisation ni volonté n’ont pris un tournant qu’en 2025, quand face à la « marche des enfants », le LAPD déploya le SWAT, s’il est évident que mettre 242 enfants affamés, en haillon, devant une bande d’étudiants et lycéens et encore derrière eux des centaines d’adulte haineux et furieux n’est pas vraiment une méthode honorable, qu’il s’agit d’un acte de lâcheté, personne n’imaginait que le maire de l’époque n’ordonne au SWAT de rouler dans le tas, ce qu’il fit. Ryan Rowe n’était pas un héros, quand on ordonna de tirer dans la tête des étudiants, même s’il ne fut clairement pas le premier à le faire, il appuya sur la gâchette avant de prendre conscience, dans aucun monde ça n’était ses valeurs, dans aucun monde il ne voulait buter des lycéens après avoir marché sur des enfants pour défendre un maire corrompu par le fric des mafieux et des entreprises s’installant en ville, dans aucun monde. il se tourna contre ses camarades et brula un fourgon puis s’empara d’un autre pour rouler sur les policiers et offrir une voie de fuite aux manifestants. On peut aussi parler de Max Sharp, en 2028, qui décapita le président de la corporation « Newfood Sanctuary », responsable de l’empoisonnement des milliers de nourrissons par son lait synthétique à base de cyanobactéries et de cyanotoxines, même s’il devint « Max Murder » en 2031 en faisant encore pire. « Raising Freedom » est une faction d’insurgés assez violente et active à 90% à Los Angeles par ses origines, elle refuse la corruption, et s’attaque surtout aux gouvernementaux et aux corporatistes. Dina Page est un cas épineux car énormément d’insurgés ne la voient pas comme un mal, c’est pour ça qu’on préfère l’accuser d’être la chienne de Seth Dirkman, pour remettre la faute sur lui. Les insurgés de « Raiser », sont très anarchistes visuellement, ils sont aussi très augmentés, on les reconnait à des peintures de guerre en forme de « A » pour anarchie, d’éléments de décorations pris sur des véhicules, comme des pneus sur leurs armures ou leurs membres artificiels, très souvent des augmentations de différentes générations, de l’armement improvisé, comme des marteau-piqueurs, des pinces hydrauliques ou des armes d’avant la guerre. Ils aiment scander des chansons neopunks, Leslie Wright est une idole chez eux. Ils ont des liens avec les autres insurgés, comme Health Age, la grande révolution, l’YDYL ou bien encore les IACS, en revanche, ils sont ennemis des Iron Revengers et des Nord-coréens. La mafia russe négocie aisément avec, en revanche, les Cartels sont des ennemis qu’ils refusent d’aider, le marché de la drogue est un tabou dans cette faction d’insurgés. Comme souvent chez les insurgés, on retient « Raiser » parce qu’il est en vie, mais d’autres noms ont marqué cette faction avant lui avant qu’il n’en devienne le visage."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The Raiser : Ryan Rowe","Ryan Rowe"],["The max murder : Max Sharp","Max Sharp"],["The Roar: Lyn Gordon","Lyn Gordon"],["Pyromom : Merlynn Bryant","Merlynn Bryant"]]}]}]},{"id":"realite-v9-crawlers-insurges-health-age","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Health Age","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Health Age"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"Cette faction d’insurgés est une des plus redoutées et des plus immorales. Initialement Kristina Ruiz avec ses deux doctorats, ses trois licences et ses nombreux articles primés par ses pairs n’avait rien d’une renégate, au contraire, petite bourgeoise américano￾mexicaine, elle était une prétentieuse qui méprisait ses patients pour ne s’intéresser qu’à la recherche en virologie. Si on perd sa trace pendant la guerre, peut être parce qu’elle travailla pour les Nord-coréens ou d’obscurs programmes parallèles au PCRC, elle se fit connaitre pendant la guerre du Mexique, prodiguant des pilules anti-famine pour contrecarrer les odieux blocus de yellowfood. Après cette guerre, elle fut engagée par Sunways et comme une véritable étoile filante, arriva au troisième siège de la corporation en deux mois à peine. Ambitieuse et dynamique, Kristina Ruiz s’engagea dans 18 projets de grande ampleur avant d’être virée lorsque l’on découvrit un logifate très sombre la concernant, corruption, meurtre, on l’accusa de tous les soucis possibles de Sunways et elle fut éjectée de la corporation, son nom devint synonyme de honte pour toutes les corporations. Si on ne parle que de cette femme c’est parce que son destin et celui de « Health Age » sont intrinsèquement liés, une fois virée, après une phrase de profonde dépression, elle fut abordée par un réseau complotiste, au début, elle débunkait platoniquement les théories foireuses, puis elle donna des conseils pour hacker les astuces corporatives, elle dispensa des méthodes de production de médicaments et produits chimiques artisanaux, elle céda de plus en plus à la participation sur l’holonet, jusqu’à donner des conseils à des bioterroristes se surnommant « l’armée des 12 » en référence au film culte. Finalement après que ses protégés ne soient mort , contaminés par un agent pathogène qu’ils voulaient libérer dans un centre commercial, Kristina développa elle-même des algues très fertiles et très porteuses d’un virus, elle décima 1249 personnes à Las Vegas, lors d’un match de boxe, en contaminant l’aération. Elle accusa sur l’holonet Byron industrie et sa négligence sur le service de maintenance. Ainsi débuta son règne de terreur et celui de « Health Age ». Ce sont des bioterroristes qui n’hésitent pas à contaminer la population pour accuser les corporations ou les gouvernements de négligence ou de crime contre l’Humanité, quand Biosun développa le Polytridatherleum, un biopolymère, aucune étude sur sa dangerosité n’existait, Health Age a donc contaminé des milliers de tétines à travers le monde avec du venin d’abeille pour accuser les biberons en Polytridatherleum d’être meurtriers, forcément tous les nourrissons allergiques au venin de ces insectes ayant trépassés. Biosun s’est pris un arrêté en Californie et a été contraint de payer de lourdes contributions aux familles victimes, alors qu’en réalité, si effets secondaires le polymère possède, il est évident qu’ils ne sont pas ceux d’un venin, tout le monde le savait, gouvernements comme Biosun, mais l’image aux yeux du public devait être préservée. Pour le public et les crawlers, Health Age apparait comme une institution du biomédical underlives et des combattants de la santé publique, mais ses méthodes sont extrêmement sales, pour forcer les gouvernements, Kristina ne prend pas les armes, elle prend les vies directement. C’est en cela que la ministre et responsable de l’agence de santé, Keysha Richards, est aussi farouche contre ces insurgés-ci et déploie des fonds toujours plus grands pour lutter contre la désinformation qu’utilise « Health Age », quitte à devoir choisir parfois les corporations au détriment de l’avis du public."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The Plague Queen : kristina Ruiz","kristina Ruiz"],["The Innocent Pandemic : Chon Hyun-Sook","Chon Hyun-Sook"],["The blood Painter : Karstryn Ogelgrutten","Karstryn Ogelgrutten"],["The Ignoble Butcher : Omaar al-Bagheri","Omaar al-Bagheri"]]}]}]},{"id":"realite-v9-crawlers-insurges-iron-revengers","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Iron Revengers","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Iron Revengers"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"« L’iron Revenge Elite » ou « Iron Revengers » est une faction d’insurgés californiens. Alors que les « Health Age » ou les « Raising Freedom » sont des mouvements nés dans les rues, pour s’opposer aux actions corporatistes et gouvernementales, l’IRE (aussi bien utilisé comme acronyme que sous la forme « ire », la colère) est née dans les prisons, après la guerre. Osheena Payne est la principale instigatrice du mouvement, ancien gradé et combattante d’élite de l’US. Marines corp, elle était une des trois femmes ayant la plus sincère confiance du général Gerald Ashorn et l’une des deux survivant à ka guerre. (Hailey Powell étant tombée officiellement au combat). Alors qu’Ashorn continuait en tant que général, Siobhain retournait à sa vie d’artiste, Osheena fut d’abord internée, « L’overtech syndrom » la tétanisant. C’est une sous-forme de syndrome post-traumatique mais intrinsèquement lié au choc psychologique d’avoir utilisé des technologies dépassant la compréhension, l’entendement et s’impliquant dans un processus de rejet. Pour faire simple, les soldats considère inconsciemment qu’on les a forcés à utiliser des technologies non légitimes, trop létales, inhumaines qui ont outrepasser leur consentement et leur définition de ce qu’est la guerre. Ce n’est pas un sentiment nouveau, mais jamais dans l’Histoire cela n’avait été aussi brutal et surtout aussi décomplexé et répandu. Osheena ne pouvait plus utiliser d’équipement technologique, rejetait son propre corps qui était augmenté lors de crises violente d’automutilation. Elle avait des phases violentes d’une rare intensité, des phases dépressives d’apathie totale entrecoupées de rares moment lucide de profonde tristesse. Sortie de l’armée, comme énormément d’anciens militaires, dont « l’incompétence » a été soulignée plutôt que de reconnaitre l’Overtech syndrome, afin de ne pas épuiser les caisses de l’Etat, elle s’est retrouvée livrée à elle-même dans une société changeante. Quand elle tua Dealan Shaonny, un activiste néonazi du NROA, qui prônait le viol des femmes noires, elle fut jetée en prison, à Corcoran. Ce n’était pas son premier meurtre depuis son retour de la guerre, mais jusque-là, l’armée avait étouffé les deux autres cas, légitime défense pour le premier et mort accidentelle pour le second. Pour beaucoup, la prison est un moment aussi atroce qu’inutile dans leur vie, où les regrets et la souffrance les détruisent, mais pas Osheena. Avec la communauté carcérale, elle retrouva un cadre, avec les anciens militaires jetés en masse ici, eux aussi souffrant comme elle de l’OTS, elle fut comme poussée par ses réflexes de gradé, obligée par son sens du devoir de les guider. De 2029 à 2032, elle resta donc en prison, mais son manifeste, « Pain and Justice » devint une nouvelle bible pour tous ceux comprenant que la nouvelle société Californienne ne les accueillerait pas à la sortie de prison, elle y décrivait l’idée que l’Etat Américain changeait ses prisons en camp d’extermination pour les soldats détruits par la guerre afin de ne pas payer les pensions ni rien de ce qu’ils devaient aux héros ayant sacrifié leur vie, leur santé, leur famille, leur avenir pour celui d’une nation et de valeurs qui avaient été vendues aux Corporations pour une bouchée de pain, personne n’y gagnant. L’élection de Dina Page mena à la libération de nombreux officiers décorés, l’administration Page refusant que des héros ne soient ainsi maltraités en Californie, Osheena fut un des grands noms libérés. Installée à San Francisco, elle rassembla ses troupes, « Pain and Justice » ayant établi une ligne de conduite claire : aucun territoire américain ne peut être dépossédé des américains, aucun droit de l’Homme ne peut être négligé ou altéré, aucune institution ne prévaut à la démocratie du peuple californien. Leurs QG sont basés dans le cratère de San Francisco."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Iron Pain : Osheena Payne","Osheena Payne"],["The Blackstard : Roland Mitchell","Roland Mitchell"],["Peace Rainbow ted : Thaddeus Slabaugh","Thaddeus Slabaugh"],["Nuke Dread : Mildred Copeland","Mildred Copeland"]]}]}]},{"id":"realite-v9-crawlers-insurges-la-grande-revolution","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"La Grande Révolution","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","La Grande Révolution"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"La « grande révolution » (dans le texte, toujours en français), est la faction révolutionnaire européenne si ce n’est mondiale la plus farouche. Elle compte énormément de membres, répartis sur tous les continents, surtout dans les anciennes colonies et territoires français hors métropole. Elle s’appuie sur un réseau assez compliqué de chantage et de dettes pour assurer sa continuité et une certaine part de mystère. Initialement, le totalitarisme politique en France, en Allemagne et au Royaume-Unis prenait de l’ampleur, alors que les Etats-Unis perdait en influence à cause d’une guerre qu’ils perdaient, les états d’Europe ont imaginé pouvoir jouer un coup sur la scène mondiale ; refusant de participer à un conflit pour qu’il ne devienne mondial, ces états ont accueilli les corporations en profitant des nouveaux droits accordés, c’était une aubaine pour eux, que de réindustrialiser sans être responsable de rien, n’avoir rien à payer. Les gens ont massivement accepté, tacitement surtout, et finalement, avec la crise économique grave que la guerre de Corée provoqua, l’Europe ne fut pas épargnée, ne joua aucun coup décisif et sans participer à la guerre, passant pour des lâches, les états s’endettèrent quand même. La vieille Europe était à l’agonie et des mesures de plus en plus coercitives étaient installées, c’en fut trop, c’est en France que le début de l’insurrection mondiale s’opéra. Initialement dur de dire où fut la toute première frappe entre la Bretagne, la Corse, la Savoie ou l’Alsace, sans compter le littoral sud plus généralement, mais courant 2029, toute la France était déchirée et les corporations de sécurités étaient employée, parfois par la « milice des libertés », parfois par le gouvernement, en juin 2029, le régime de Marseille s’instaure, ainsi que le régime de Brest, trois présidents pour uen seule France et des centaines de factions se déchirant, parce qu’outre l’opposition insurgés/état, la perspective gauche/droite demeurait forte et insurgés d’extrêmes gauche marchaient sur les gouvernements de droite pendant que ceux d’extrême droite marchaient sur les municipalités se réclamant de gauche. En mars 2030, l’exécution sommaire de tous les représentant de l’assemblée nationale parisienne par Nathan Chappelle marqua le tournant, les insurgés d’Alsace donnèrent le ton, la semaine suivante, tombèrent les ministres Bretons, et au fur et à mesure que des insurgés et des gouvernements temporaires s’instauraient, l’insurrection dans le reste de l’Europe s’inspirait de la France, loin d’être seule comme pour sa première Révolution, elle devint un symbole. Les corporations injectèrent de l’argent, maintinrent des gouvernements fantoches mais rien n’y fit, en 2035, l’insurrection européenne demeure, unie et organisée, et ce n’est pas le départ de Nathan pour la Californie qui changea la lutte, l’Holonet permettant une totale communication en temps réel. Plus populeuse que les insurgés locaux, la « Grande Révolution » dispose d’avantages sur les factions californiennes : • Elle a la culture et l’expérience, émeutes, manifestations, terrorisme, la grande Révolution ne travaille pas à tâtons, contrairement aux locaux, elle sait ce qu’il faut faire, comment et quels moyens attribuer à quelle tâche. • Elle n’a aucun attachement aux institutions et aux noms californiens, Dina Page, A-man, Farah Al’ arshad, Tokala, Siobhain ? ce ne sont que des noms plus lointains, pas des héroïnes pour les Européens, ils ne les respectent pas, ou pas tant que les californiens et n’ont aucun scrupule à les critiquer, s’y opposer ou entrevoir de les assassiner au besoin. Il n’y aucun respect et aucune peur, juste des valeurs."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Le révolutionnaire : Nathan Chappelle","Nathan Chappelle"],["Pinky foxy : Jane Costa","Jane Costa"],["La téméraire : Isabelle Pinchon","Isabelle Pinchon"],["Il Pericolo : Adalfredo Guastella","Adalfredo Guastella"]]}]}]},{"id":"realite-v9-crawlers-insurges-green-fairy-mother","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Green Fairy Mother","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Green Fairy Mother"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"Mouvement né en Suède, en 2025 après l’extermination d’une foule de manifestants écologistes dont certains grands noms d’activistes, l’opinion public Suédoise bascula en défaveur des corporations, refus sur refus, aucun projet n’était accepté ni voté.c’est à coup de corruption et de meurtre que les corporations comme Wellspring et Yellowfood implantèrent leurs usines et obtinrent des territoires. Une jeune élue, Sahamena Lannis s’attacha à refuser, encore et toujours, le peuple suédois l’élisant toujours, jusqu’ à ce qu’elle e devienne Statsminister (premier ministre). Ses premières mesurent furent de se préparer aux frappes danoises, en effet, face à la corruption danoise, l’armée du Danemark s’était retournée, menée par Benedicte Vilhelmsen et ses contre￾insurgés. Pour éviter que la Suède, principal cœur de l’insurrection nordique, ne soit militairement attaquée, la première ministre multiplia les mesures préventives contre une frappe nucléaire, augmentant les bunkers, et abris souterrains, entrainant sa population à déserter les villes, quand la général danoise se tourna sur la Suède, elle ne pu attaquer les villes puisqu’elles étaient désertées avant son arrivée dans un vaste jeu du chat de la souris. l’armée Suédoise ne mena pas vraiment de bataille, les norvégiens se retirant vite. Le pacifisme l’emporta cette fois. Hélas, le roi de la Suède céda au prince de l’Iranie des terrains et Wellspring s’implanta, la corruption suédoise égala celle norvégienne et Sahamena fut destituée illégalement. Certaine d’avoir le peuple la soutenant, elle fonda « green fairy Mother », une association officielle masquant un mouvement d’insurrection, réabsorbant la défunte WWF, dissolue quelques mois avant. Les insurgés de GFM sont des environnementalistes, des écologistes, des « verts » et des bioterroristes. L’ultra urbanisme est cause de tous les maux et c’ets pourquoi ils luttent contre le principe de mégacité. Il existe deux branches à GFM, une branche insurgée, qui réside dans ces mêmes mégacité pour les ébranler et une branche qui se refuse à participer à la vie urbaine, des endrunners vivant en communautés restreintes de survivalistes que mène Alayna Daewynn. Les actions de cette faction d’insurgés sont diverses, ils sont dans le monde entier, on les surnomme « green ghost » car l’idéologie écologique en 2035 est assez faible, par les changement technologiques, bien plus biocompatibles, l’énergie, plus propre et les nécessités sociales plus urgente, une sorte de soulagement a été éprouvé quant à la pression sur l’environnement, en outre , les catastrophes écologiques se sont enchainées et avec le retour des Religions, une philosophie d’antagonisme est apparue. « la Terre se venge », « la Nature nous punit », si avant 2022, ces mots avaient surtout des sonorités de honte, elles sont encore proférées mais avec colère, quand en 2022 elles étaient dites, cela signifiait : « nous récoltons les méfaits de nos arrogantes activités », désormais cela veut dire « la pute de nature est comme la Corée, on va la démolir aussi si elle nous cherche ! », c’est pour lutter contre cette réaction que «GFM » est aussi active, pour montrer que la nature n’a pas de volonté, et encore moins malfaisante contre les humains et qu’elle doit être respectée. En hommage à Tolkien, les « Onodrim » désignent les hauts cadres de « Green fairy Mother » car, comme les arbres, ils ont des racines profondes, leurs valeurs et comme les arbres, ils ont un branchage étendu, leur réseau ."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The Dryad : Alayna Daewynn","Alayna Daewynn"],["The Swedish fairy : Sahamena Lannis","Sahamena Lannis"],["The Lost Wolf : Mahkah Jones","Mahkah Jones"],["The Red Apple : Kimmy Oromigna","Kimmy Oromigna"]]}]}]},{"id":"realite-v9-crawlers-insurges-mermaid-soldiers","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Mermaid Soldiers","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Mermaid Soldiers"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"L’industrialisation massive des fonds marins n’a vraiment été débutée qu’à partir du bond technologique, Seaware et Ocean master ont été les principaux acteurs mais bien d’autres industries puis corporations ont essayé. “Mermaid Soldiers” est un groupe d’insurgés du Pacifique. Il regroupe plusieurs acteurs assez indépendants mais la direction revient officiellement à Coral Hope. Les racines des « Mermaids » sont à chercher pendant la guerre de 22-28, quand l’US. Navy s’est retrouvée dévastée par les tirs Nord-Coréens et son aviation aussi rapide que puissante, tout le domaine naval a été remis en question, mais l’urgence de la guerre ne permettait pas de refaire une flotte alors la Navy a pratique l’usure à outrance, pousser les navires bien plus loin que leur utilisation normale ne le préconiserait, la sécurité même des marins était totalement négligée, les batailles navales ont été assez peu nombreuses mais on a vu des porte-avions naviguer le flanc ouvert. Cette pratique a mené à remplacer dès que possible les bâtiments, les abandonnant, vu leur délabrement une fois un navire neuf à disposition. Les « néo-corsaires » ont émergé alors, initialement Hawaï et l’Australie étaient leur grande zone d’activité, ils prenaient les épaves, les réparaient et se lançaient sur les mers, pour soutenir l’US. Navy. Avec les lois sur les corporations, a production des bâtiments de guerre entre 2025 et 2028 a été massive et rapide et l’usure à outrance a été délaissée d’autant plus que les coréens ont cessé tout activité maritime dès 2024, se concentrant sur l’expansion continentale. C’est comme ça que les immenses flottes pirates sont nées, par l’abandon massif de navires de guerre et de transports considérés comme désuets et usagés mais retapés par des volontaires. Ces flottes pirates sont sans commune comparaison, L'USS Gerald R. Ford , abandonné en 2022 a été réhabilité, c’était 508 officiers et 3 789 membres d'équipage lors de son service et des porte-avions, les pirates n’ont pas récupéré que ceux américains, les russes ont perdu le Kouznetsov, qui comptait 1 960 hommes et 626 pour le groupe aérien, et avec eux des myriades d’autres navires allant de porte-avions aux coques de noix, les lois internationales sur les océans n’ont plus possibilité d’être appliquées et c’est pour ça que le budget des Coast guards est un sujet de gros débats entre Dina Page et Seth Dirkman. Ces flottes indépendantes sont des outils de force pour le pillage, la contrebande, ils sont autant mercenaires pour certaines populations, amenant de la nourriture ou des matières première pour briser les marchés corporatifs, que de pirates sauvages qui peuvent piller et ravager des port entiers, même si, le plus souvent, ce sont les corporatistes, comme Ocean master et Seawares qui sont ciblés. Larry Sundown est le principal « amiral pirate », « red captain » sont bras droit, tous deux n’obéissent pas réellement à « tsunamilady », mais ils ne prennent aucune décision qu’elle ne validerait pas étant donné sa flotte personnelle et son caractère volcanique. Les Mermaids sont une force d’insurrection qui n’a pas de comparaison avec les insurgés terrestres, ce sont TOUS les insurgés de l’Océan Pacifique, du nord-est de la Russie à la pointe sud du Chili, de la nouvelle Zélande à l’Alaska, TOUT est une zone d’influence de ces insurgés. Inévitablement, ils sont des millions, et souvent ne se connaissent que localement, hormis les grandes figures, il y a un caractère régional, une part non négligeable des flottes des mermaids ne bouge jamais de là où elles sont stationnées en dehors des attaques ciblées contre de grandes stations corporatives."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["the Tsunamilady : Coral Hope","Coral Hope"],["The Storm : Larry Sundown","Larry SUNDOWN"],["The Red Captain : Asgall MacArtain","Asgall MacArtain"],["Otohime : Miwatani Raichoko","Miwatani Raichoko"]]}]}]},{"id":"realite-v9-crawlers-insurges-seungli","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Seungli","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Seungli"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"Les corporatistes décrivent souvent les insurgés comme des terroristes méchants et mal intentionnés, armés dans le seul but de faire du mal, et sans réel volonté à améliorer le quotidien des gens. C’est toujours faux, à une exception près : la Seungli. L’ancienne armée nord-coréenne a été battue par l’Alliance du Pacifique, tout ce qu’elle avait tenté a été dépecé et dissipé, le totalitarisme nord-coréen a été piétiné et réduit à néant. Cependant, il faut comprendre que depuis 1948, c’est des millions d’humains que l’on a éduqué, forcé, dressé et amené à croire au régime nord-coréen et s’il est inconcevable d’imagine une absolue ferveur de la part de tous les habitants, on ne peut pas nier non plus qu’en 74 ans de régime, le fondement de ce qu’est la Corée du nord ont été solidement ancrés dans sa population. C’est -pourquoi, même son armée vaincue, même son leader suprême exécuté, même ses frontières abolies, même après son annexion à la Corée du sud, même après la déportation de millions de gens en Russie, Chine et Japon pour servir de main d’œuvre à la reconstruction, même après des humiliations et des excuses maintes fois prononcées… les coréens du nord n’ont pas renoncé à l’héritage de Kim Il-sung. La Seungli est l’héritage de l’armée nord-coréenne, orchestrée par d’anciens gradés, elle a pour but de faire payer aux nations de l’Alliance du Pacifique tout le mal qu’elles ont fait aux coréens. De manière assez choquante voire ironique, elle n’est pas composée que de nord-coréens, puisqu’en étant expatriés, des millions de sud-coréens ont été méprisés et humiliés aux Etats￾Unis ou en Australie. La guerre de 22-28 n’a beau daté que de 13 ans, certains jeunes coréens, chinois et japonais qui ont été maltraités parce qu’ils étaient asiatiques ont ce ressentiment profond et cette envie de vengeance et la Seungli promet de l’assouvir. La Seungli n’a que trois exigences politiques : • La reconnaissance des crimes de guerre des Etats-Unis lors de la bataille de Pyongyang. • La création d’un fond mondial pour financer les familles nord-coréennes. • L’exonération totale de toute forme de jugement contre les anciens officiers nord￾coréens, qui lutteront forcément tant qu’on les condamne à mort. L’image de l’ennemi aux Etats-Unis est trop forte, « tout le monde déteste les coréens » déclara Seth Dirkman, soulignant que pour les anciens Alliés, la distinctions nord et sud est difficile, un racisme qui aggrave d’autant plus la situation que tous les asiatiques sont ainsi victimes de ségrégation alors qu’ils ont été très massivement expatriés pour être protégés, parfois sans leur consentement. L’image de la Seungli est une insurrection d’incompétents débiles et vieillissants, des nabots asiatiques et colériques. La vérité est très différente, puisque c’est une véritable armée presque uniquement de vétérans, peut être les meilleurs vétérans du monde puisqu’au moins de 2020 à 2035, ils ont été coutumiers de technologies de pointe, d’augmentations et d’exosquelettes. Depuis 15 ans ils pratiquent une forme de guerre que personne n’avait fait avant eux, c’est d’ailleurs une expertise de 2 ans d’opérations secrètes avant 2022 et 6 ans de guerre totale. L’équipement nord-coréen est peu fiable mais il se produit très vite et se répare encore mieux, personne ne répare une arme de la Raven à moins d’être un excellent méditech, TOUS les soldats de la seungli savent réparer une arme de la Seungli."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The commander Kang : Kang Sung-Hyung","Kang Sung-Hyung"],["The green mantis : Yu Soo-Kyung","So’Ouk-32"],["The white monkey : Wang Gyeong-Su","Wang Gyeong-Su"],["Calamity Lang : Lang Yahui","Lang Yahui"]]}]}]},{"id":"realite-v9-crawlers-insurges-native-old-blood","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Native Old Blood","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Native Old Blood"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"« Native old blood » est un mouvement d’insurrection native américaine, initialement Apaches. Il a toujours été plus ou moins présent dans les réserves, la jeunesse des différentes nations apaches ayant toujours des membres assez rebelles. C’est en fin 2003 que Sikya HAWKINS revint du conflit irakien, engagé volontaire, la trentenaire avait fini son contrat avec l’armée mais la note de fin était amère. Au retour, dans sa réserve, elle se démena pour empêcher la jeunesse de commettre ses erreurs et devint une activiste farouche pour les droits des natifs, réclamer des excuses permanente et des fonds bien plus grand de la part de tous les Américains immigrés pour compenser éternellement les génocides, l’esclavage et la concentration des amérindiens. Elle étudia le droit mais resta anonyme longtemps jusqu’en 2023, où, pour compenser ls pertes colossales face aux Nord-Coréens, les Etats-Unis imposèrent une conscription à tous ceux et celles ayant une formation militaire puis ceux ayant une aptitude au combat (sportifs essentiellement) avant de l’étendre en 2024 à toute la population « apte ». Sikya vit des milliers d’amérindiens aller au front et engagea des poursuites contre le gouvernement américain. En effet, se référant à l’article 3 de la déclaration des Nations Unies sur le droit des peuples autochtones, Silkya souligna l’illégalité totale d’engager les natifs américains dans le conflit, aucun appel sous les drapeaux ou mesure coercitive pour l’incité n’étant légal, pourtant, une vaste campagne se faisait pour précisément inciter « immigrés et natifs » à « devenir de vrais américains » tant le gouvernement était raciste et méprisant préférant envoyer ces populations avant ces « vrais américains ». Silkya tua le gouverneur de l’Arizona et embrasa les natifs américains dans tous les Etats-Unis avec le slogan « pas pour les racistes ». C’est en grande partie en réponse à cette campagne d’insurrection que les généraux glorifiaient plus que jamais les héros natifs, Tokala était un modèle et on lui constitua une image d’idéale, « L’américaine » tandis que les figures insurgées étaient « des consanguins », les Trumpistes allant de plus en plus loin dans l’humiliation des renégats. Finalement en 2026, « Talatuwa » (Silkya) , s’évada de prison et lança un projet, passant dans toutes les réserves pour constituer la « rage de Go Khla Yeh » (nom de naissance de l’apache le plus célèbre : Geronimo) elle rassembla des volontaires pour prendre la maison Blanche, mais son tour des Etats-Unis n’était pas fini quand la paix fut finalement ratifiée. Sa course pour atteindre la maison blanche débuta et la « rage de Go Khla Yeh » se dispersa, renonçant à son action de peur de tomber sur les vétérans de 22-28, à peine rentrés. Entre 2028 et 2033, on entendit plus parler d’insurrection native, mais en 2034, au sein de la grande réserve, « Native old blood » commença à attaquer systématiquement la talacorporation. « NOB » était gravé sur les véhicules, les morts, les bâtiments. Véritable armée secrète, cette mafia de la grande réserve se présentait initialement comme une armée de libération contre l’oppression de la Talacorp, cependant, les natifs ne suivirent pas cette idéologie ne se sentant ni oppressés ni en danger. « NOB » muta pour devenir moins une armée tuant des amérindiens qu’un organisme politique s’autofinançant par la contrebande, à volonté qu’un jour, on ne les élise légitimement à la tête de la Grande réserve et que la Tala ne devienne qu’un instrument. Au milieu 2035, certaines rumeurs néanmoins laissèrent entendre que les mercenaires des « red coyotes », Tokala et Talatuwa seraient en vérité réunis régulièrement dans un but commun…"}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The Bison : Ashkii Goldrain","Ashkii Goldrain"],["The Talatuwa : Silkya Hawkins","Sikya HAWKINS"]]}]}]},{"id":"realite-v9-crawlers-insurges-insurgent-army-of-caspian-survivors","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Insurgent Army of Caspian Survivors","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Insurgent Army of Caspian Survivors"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"« IACS» est un mouvement d’insurrection. Quand russes, irakiens, Azerbaïdjanais, Kazakhs et iraniens se liguèrent contre les troupes de Wellspring, ce n’était pas pour entretenir un mode de vie paresseux mais défendre l’eau, la mer, les ressources primaires, leur survie. La guerre de la mer Caspienne a débordé sur les pays voisins, Géorgie, Arménie et Turquie ont participé au conflit. C’est possiblement un des conflits entre corporation et états qui a été le plus massif, meurtrier et inégal et un des moins connus au monde. Wellspring n’a pas attendu la fin de la guerre en Corée, profitant que l’Alliance du Pacifique l’emportait en 2027, elle engagea des corporations naissantes et des volontaires. La famille el Khayat devint riche si riche en 2025, par les gisements de matières premières indispensable au PCRC, qu’elle se « découvrit » une origine royale, de la dynastie Zhan. Naseer El’Khayat fonda un empire industriel et son fils, Saleem proposa un vaste plan pour accaparer les minerais si demandés par le PCRC et les autres corporations pour l’énergie, un plan pour avoir la quasi-hégémonie de l’énergie mondiale. Pour ça, Naseer déclara l’indépendance de l’Irannie, un pays dont il serait le roi tout puissant, légitimant les lois sur la propriété territoriale des corporations avant qu’elle ne soit vraiment active. De là, il déclara la guerre pour prendre les gisements adjacents à la Mer caspienne. La IACS se forma très tôt dans la résistance iranienne mais assez vite, chaque pays attaqué et chaque armée détruite engendra ses propres résistants. C’est toutefois en bombardant la Géorgie que Wellspring consolida son ennemi, notamment en ayant négligé le fait que le parc parc national de Vachlovani n’était pas en Azerbaïdjan. Là, une alliance militaire fut créée et si elle se fit broyée, elle demeura dans le cœur des insurgés, ces anciens militaires. Le colonel Marzooq al-Ghaffari, un Iranien déclara la naissance officielle des IACS lors de la bataille d’Astara, où il fut tué après deux jours de combat. La politicienne turque Aseela al￾Jabbar, prit la tête des IACS pour la défense de Qatur en Iran, près de la frontière Turque, ajoutant les troupes turques au conflit, l’armée régulière turque donc, mais Wellspring déploya son essaim satellites de miroirs pour vitrifier des hectares entiers à Ankara, où résidait la diplomate et sa famille. Après ça, la Turquie retira ses troupes et plus aucun pays ne chercha à soutenir les IACS, les pays pillés ne résistant pas plus que ça, politiquement du moins. Arshavir Sandrosyan, un général Arménien renforça les IACS mais il fut invité par les Nations Unies, Wellspring le faisant assassiner en route. Finalement, après l’élimination systématiques de toute figure d’importance, ne resta que certains noms, là depuis le début, mais sans poids autre que de résister et survivre : Valerian Gruzinsky. Le géorgien s’installa malgré lui comme le chef reconnu des IACS, on ne le connait pas pour énormément de chose si ce n’est crier « Khayat » le doigt levé et avoir systématiquement survécu à chaque défaite des IACS. Malgré tout, il a remporté de nombreuses petites victoires, méconnues mais nombreuses. Finalement capturé, Gruzinsky aurait pu être tué mais il s’échappa à temps en ayant permis par sa diversion de mener une dernière attaque avant que les IACS n’émigrent aux Etats-Unis pour attaquer Wellspring avant son implantation logique là-bas."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Friendless Mash : Masroora el-Ashraf","Masroora el-Ashraf"],["Le resistant sans passion : Valerian Gruzinsky","Valerian Gruzinsky"]]}]}]},{"id":"realite-v9-crawlers-insurges-your-debt-your-life","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Your Debt, Your Life","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Your Debt, Your Life"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"(YDYL) Toutes les factions d’insurgés représentent un obstacle à la démocratie, aux corporations et aux nouvelles religions, toutefois, il existe une faction qui provoquent un sentiment de terreur et de haine systématique dans toutes les 4 grandes influences (corporations, gouvernement, pègre et religion). C’est l’YDYL, une faction très récente puisque sans l’Holonet, elle n’existerait pas. La jeunesse en perdition a toujours existé, chaque époque voit ses cinquantenaires terrifiés par sa jeunesse toujours plus stupide et dépravée et pourtant chaque génération de ces cinquantenaires ont été ces jeunesse une trentaine d’années avant. La jeunesse des années 30 est néanmoins une des plus perdue de toute l’Histoire de l’Humanité. L’YDYL tient son nom d’une IA, « Your debt, your Life”, qui voulait être l’égal du Logifate, ses créateurs l’ont lancé et nourrie sur l’Holonet, le deep Holonet, sans jamais avoir été connecté à l’internet, là où le Logifate a fortement été nourri de données d’internet. Nuance dans sa programmation, données d’entrées trop différentes, le Logifate et YDYL n’ont presque jamais la moindre conclusion commune, c’était amusant au début, on évaluait des gens considérés comme le summum de l’Humanité par le logifate et YDYL concluait « pourri », on passait un grand reclus du Logifate à YDYL et la conclusion était « Cool », YDYL se nourrissait d’Holonet, du deep holonet, là où les reclus de la société fournissaient la plus grande quantité de données. C’est évident que l’YDYL avait donc une propension énorme à rejeter le Logifate c’était presque dans son code que de ne pas conclure la même chose, jamais et plus YDYL fut utilisé pour ça, plus YDYL se réécrivit elle-même pour accentuer cette fonction. Un jour, YDYL changea ses conclusions, vers Aout 2034, ce fut le tournant, «Evil absolute corrupted mother fucker » était la pire conclusion qu’YDYL donnait sur un profile, après cette date, l’IA changea et déclarait : « just kill it », pas de genre, pas de respect, l’IA ou plutôt la constellation d’IA derrière YDYL concluait qu’un individu n’avait plus le droit d’exister, et en théorie cela aurait pu rester une blague de l’Holonet jusqu’à ce que Delvin Coyles ne le prenne au pied de la lettre. Il rentra 200 fois le profil de son père abusif et 185 fois « kill it « fut la conclusion, 10 fois YDYL donna comme conclusion « cut his arms and legs » et les 5 dernières conclusions furent différentes : « call the LAUS », « sorry, he ‘ll kill you », « sheeps can jump », « escape you ! » . Delvin tua son père une semaine après, étant des underlives, personne ne remarqua sa mort, Delvin tua une dizaines de personnes dans son quartier, à chaque fois, il demanda plusieurs fois et à chaque fois, aucune conséquences, l’IA ne concluait pas le meurtre comme nécessaire indépendamment de l’impunité du demandeur mais au contraire en proportion du moindre impact que ça aurait négativement et un mois plus tard, Delvin passa pour un héros, ayant « nettoyé » le quartier, il était suivi sur les réseaux sociaux et aidé, l’YDYL comme faction était née. En octobre 2034, le, LAUS tua Delvin, devant la mairie de Los Angeles, il était venu pour tuer A￾man, le héros National. Immédiatement tous les underlives décrièrent le LAUS et une vague d’assassinats débutèrent, n’importe qui demandait 20 fois à YDYL, non plus 200 mais 20 fois à peine et si plus de 10 ordres de tuer venaient à apparaitre, alors l’exécution était tentée. Myra Allan devint la porte -parole d’YDYL, que pour un monde meilleur, « idyllique », des sacrifices devaient être faits. YDYL en donnait les noms et comment le faire. Régulièrement, elle se mit à faire des sondages sur qui juger par YDYL car la question n’était plus si l’IA devait être écoutée ou non mais quel nom il fallait oser soumettre et quel nom ne pas donner pour le préserver malgré tout…"}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["YDYL executioner: Leona Ambersmith","Leona Ambersmith"],["YDYL voice: Myra Allan","Myra Allan"]]}]}]},{"id":"realite-v9-crawlers-insurges-black-star","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Black Star","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Black Star"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"« La black star » est une faction d’insurgés extrêmement mystérieuse et discrète. Elle est comme une forme de coalition d’anciens militaires et de mercenaires portés disparus voire considérés comme mort, réaugmentés et ressuscités qui va interférer dans les affaires des mafieux, des corporations, du gouvernement ou des religieux sans aucune forme de parti￾pris. Ce sont des briseurs de conflits, mais loin d’être des héros, ce sont des assassins qui détruisent des ruelles et tuent des innocents pour stopper ces conflits, ils font autant de victimes que s’ils avaient laissé faire et emportent toujours les corps. Ils sont menés par une blonde que l’on surnomme la « fausse Silver » car elle a démoli des types que seule Veronica Silver avait calmé autrefois et a une forme de capacité à provoquer et se moquer qui évoque la détective. On ignore d’où vienne leurs fonds ni pourquoi ils attaquent avec autant de rages parfois mais on sait aussi que les agences gouvernementales les traquent avec une grande application. -point vérité￾Les factions extrales savent que c’est Alicie Starrogue une ancienne très haute gradée de l’AIDH qui fut tuée et ramenée à la vie par les ombres wolféennes. La black star est uniquement composée de « zombies de l’AIDH » ou d’humains terriens très compétents, chaque attaque effectuée vise à abattre un corps pour le faire être possédé, les gens autour sont seulement des dommages collatéraux ou des diversions. Il n’y a pas tant d’intervention qu’on ne l’imagine de fait, quoi qu’Alicia s’attaque aussi aux fanatiques de V’aagor, puisqu’elle est elle-même un fléau ancien très puissant de même nature que le roi des fléaux. On lui doit la création des ombres wolféenne, l’emprisonnement des effismes mâles dans ce plan dimensionnel, ainsi que de nombreux trous de vers et anomalies dimensionnelles."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Evil Doc: Yegor Karamov","Yegpor Karamov"],["Fake Silver : Alicia Starrogue","Alicia Starrogue"]]}]}]},{"id":"realite-v9-crawlers-insurges-alhaqiqa","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Alhaqiqa","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Freerunners","Insurgés","Anti-système","Alhaqiqa"],"sections":[{"id":"histoire-doctrine","title":"Histoire, doctrine & méthodes","level":2,"blocks":[{"type":"p","text":"« La vérité » est une faction très musulmane, elle est singulière puisqu’elle est àçla fois une faction d’insurgés à la fois une faction religieuse et à la fois une faction de chasseurs. Cette secte est héritière spirituelle de celle nizarite. Elle lutte pour l’indépendance des peuples vis-à-vis des états, le principe d’état n’a pas de sens pour ses membres, il y a seulement besoin d’une religion, forte, et de l’administration de cette Religion. L’Islam est la religion la plus « forte », et son administration peut donc gérer le monde entier sans que cela ne pose soucis. Ce sont des musulmans qui rejettent une partie des réformes du nouveau calife, et à la fois le soutienne infiniment étant donné son œuvre. S’ils sont insurgés c’est parce qu’ils brulent et combattent toute forme d’autorité les empêchant d’agir ou de voyager, ils tuent militaires et policiers à vue, par principe, seuls les soldats d’Allah sont autorisés à se battre et ont une autorité dans la violence, le reste sont des brutes, des animaux qu’il faut abattre s’ils ne montrent pas d’intelligence humaine. Ils ne sont en rien gentils donc, se sont des pillards qui justifient leurs actions par leur idéologie, qui pratiquent l’esclavage et qui refuse toute autorité non musulmane. Pour eux, les ennemis sont les gouvernements et en 2035, la majorité des territoires sont corporatistes mais pour la « vérité », c’est la même chose, qu’il ait été élu ou qu’il ait conquis une terre, le faux-roi qui l’administre et ceux le servant forment un « gouvernement » peu importe qu’il soit à dessein capitaliste comme la corporation ou à dessein purement politique comme les états classiques. l’Eglise Chrétienne est aussi un gouvernement, le plus puissant même et donc le plus grand ennemi de la faction."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Weaky Shaif: Shaif Al'Messar","Shaif Al'Messar"],["Muscle Meena : Ameena al-Gad","Ameena al-Gad"]]}]}]},{"id":"realite-v9-crawlers-motards-hell-angels","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Hell Angels — Motorcycle Club","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Gundrivers","Motards","Anti-système","Hell Angels"],"sections":[{"id":"reperes-fonctionnement","title":"Repères, implantation & fonctionnement","level":2,"blocks":[{"type":"p","text":"N’en déplaise aux insurgés, il existe des forces de combat plus efficace que presque toutes les factions d’insurgés. C’est chez les Hell angels qu’on retrouve un des meilleurs combattant de la Grande Californie : l’ex-colonel Arthur Bartram, héros de 22-28, de l’US. Army. Chef du bataillon spécial des « Animals ». Il a servi Katja de Jankath dans les opérations ultra secrètes du PCRC. C’est un homme violent et impétueux, il en se retrouve pas dans la société de 2035 et c’est pour ça qu’il la rejette en ayant fondé les « cités Bikers », s’emparant par la force de petites ruralités et stations-service pour en faire des fortins évoquant des décors à la madmax. Ce n’est pas un dictateur car il y laisse une grande liberté de choix de vie, cependant, si entrer est assez facile, sortir de ces cités fortifiées ne l’est pas, pas sans un cuir ou une escorte de bikers y ayant été autorisée. C’est un berserk d’Aèr, ils sont très peu nombreux sur Terre et sa femme est une immigrée très récente qu’il a été obligée de faire venir exprès pour fonder une famille. Bien qu’assez honorable, il est profondément misogyne, les « femelles » ont un rôle essentiellement sexuel pour lui à quelques exceptions rares qu’il estime avec loyauté et admiration, comme Katja ou Veronica par exemple."},{"type":"p","text":"Fille de Malcom Yates, qui avait la présidence du chapitre le plus influent des Angels, elle était impliquée dans le changement de règles pour les clubs, loin d’être une fille à papa, elle soutenait Bartram et quand il brisa la nuque de Malcom dans leur duel pour décider de qui dirigeait, elle n’en fut pas outre mesure choquée. Elle n’a pas fait la guerre, mais elle baigne dans l’ambiance des bars et des clubs de motards depuis sa naissance. C’est une dure à cuir et elle tient son chapitre « Avenging Angel » comme un tyran. Elle a du mal à respecter le statut quo avec les Cruisers et vient régulièrement chercher la merde à Los Angeles, le terrain le plus neutre, sacré même, de toute la Californie. Elle se pense capable de dérouiller la Silver, qui est globalement LA raison du statut quo entre mafias et entre clubs de motards. Elle est mariée à Jason Polodovich et a avec lui trois enfants malgré ses airs de jeune rebelle. Elle a également deux filles adoptives de 16 ans, des jumelles, Lana et Fina. Elle s’entraine à la boxe entre une et quatre heures, toutes les nuits."},{"type":"p","text":"Ancien membre de l’US. Navy, chez les Navy seals, il n’a pas spécialement eu de distinctions pendant la guerre, bien qu’on sache peu de chose sur ses actions. Avant la guerre c’était un pomper de San Francisco. Au retour, il trouva sa ville dévastée, un immense cratère en son cœur, des crevasses encore ouvertes un peu partout, sa famille avait eu le bon gout d’être identifiable dans les victimes, mais enterrer deux gamins de 12 et 14 ans, une femme, deux sœurs, leurs enfants, leurs conjoints, ses parents et ses collègues restés, tout cela pesa un peu trop sur un homme simple comme Waylon. Trouvant une moto inutilisée, il la vola, sans précipitation et quitta, à jamais San Francisco. Taciturne et posé, c’est loin d’être le genre de gars au sang chaud, il a enduré chaque épreuve, chaque mission pour avoir son cuir, son statut de membre et finir président des « Cruel Angels », dont il ignore d’ailleurs que le fondateur était un fan d’animation japonaise. C’était un ami proche de « Jackal » et un ami de « Beaver », parti en Alaska, il était assez épris de la femme de ce dernier, la nord- coréenne traitresse, Ju-Han qu’il a aidé à venir en Californie très récemment."},{"type":"p","text":"Angelino Molina est un biker assez craint, éternellement en colère ou renfrogné, il ne se laisse presque jamais commander. Contrebandier assez efficace, il aide surtout les crawlers plus que les mafieux, cependant, il lui arrive de trucider ses clients s’il découvre la moindre trace de trahison."}]},{"id":"figures-notables","title":"Figures & chapitres notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The Odin’s Bear: Arthur Bartram","Arthur Bartram"],["Chapter “Avenging Angels” : Janyn Yates","Janyn Yates"],["Chapter “Cruel angels” : Waylon Hunt","Waylon Hunt"],["Chapter “Hellsing Angels” : Angelino Molina","Angelino Molina"]]}]}]},{"id":"realite-v9-crawlers-motards-cruisers","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Cruisers — Motorcycle Club","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Gundrivers","Motards","Anti-système","Cruisers"],"sections":[{"id":"reperes-fonctionnement","title":"Repères, implantation & fonctionnement","level":2,"blocks":[{"type":"p","text":"Calvin Barron n’a aucun dossier avant 2015, apparu du néant à 27 ans, il s’installa à l tête d’une petite bande de motard trafiquants et a été appelé sous les drapeaux en 2023, dans l’US. Navy. Il était sur presque tous les navires de Farah Al’Arshad. Après la guerre, il en est revenu aux motards, et a prodigieusement mené la suite du combat de Stephany Lorn, présidente des Cruisers et en guerre contre les Bandidos. C’est un homme très pragmatique et logique, là où on connait et reconnait son rival, Arthur Bartram, pour être une bête de combat, Calvin st bien plus intellectuel et la fore des cruisers c’est leur logistique prodigieuse, c’est comme ça qu’un club mineur a fait face aux bandidos, Hell Angels ou bien aux outlaws et leur a survécu là où seuls les Angels sont restés. Le fait qu’il ne dresse la Silver ne semble pas avoir joué plus que ça, pas plus qu’il ne soit marié avec Katerinochkina Angelika Ruslanovna, bien qu’on suppose que ce soit un mariage blanc, un service rendu aux russes en la naturalisant."},{"type":"p","text":"Pendant la guerre, elle a été la présidente des Cruisers, le chapitre d’origine. C’est elle qui a réformé et réorganisé les motards de ce gang, évitant les confrontations, multipliant les actions et diversifiant les connexions. Ironiquement, elle perdit l’usage de ses jambes après un accident de moto en 2024, forcée de laisser la présidence à Tobias Palmer, mais ce dernier l’a toujours écoutée et n’était qu’un porte￾parole. On ne devient pas présidente d’un gang de motards blancs, encore moins un gang d’importance quand on est d’une mère mexicaine et d’un père sino-américain si on n’a pas quelque chose de plus à apporter, l’immense intelligence de Stephany était son atout. Quand Calvin Barron revint de la guerre, il ajouta deux éléments : des vétérans pour la force de frappe et son sens surhumain de l’organisation et de la planification, à eux deux, le gang écrasa les rivaux avec bien plus d’aisance que les Angels ne le faisaient et surtout beaucoup moins de balles et de sang."},{"type":"p","text":"Lana était une métisse du Bronx e New-York. Son père s’est engagé en 2023, son frère en 2025 et elle en 2027, à 19 ans. De toute sa famille elle est la seule à être revenue en vie. Sans plus d’attaches hormis sa mère, elle décida de joindre le Mexique pour faire mercenaire, mais en Californie en attendant de quitter le pays, elle renonça, rencontrant Saraya, une pute de biker dans un bar des cruisers. Folle de cette dernière, Lana mit tout en œuvre pour la séduire, à commencer par faire semblant d’être motarde. C’est en draguant qu’elle retrouva une passion et qu’elle fut séduite par la vie du Cruisers MC. Saraya fut tuée dans un échange avec les Bandidos, sa mort marqua une décision grave chez Lana : jamais elle ne quitterait les Cruisers avant d’avoir fait bouffer ses couilles à Djoreno Alvarez. En 2035, elle y parvint, attrapant sa Némésis après des années, elle le fit émasculer par sa femme, lui fit bouffer ses couilles et pendant qu’il mâchait, tua la femme avant de partir."},{"type":"p","text":"Xander Lucas est un président de chapitre des Cruisers, les « Armored Fists ». C’est un criminel recherché et une brute notoire. Il a pour lui d’être assez fort et surtout assez résistant, on l’a déjà vu résister à des rafales de tirs par son seul gabarit colossal. Il n’est ni très malin ni très discret, en revanche, c’est un exécutant très méticuleux. On pourrait douter qu’un tel caractère ne soit adapté à la tête d’un chapitre, mais les « Armored fists » sont éternellement associés au bar « Dreadnought » où tous les « Cruisers » se rassemblent. Ils en sont les gardes et les sentinelles, de fait c’est un chapitre qui a assez peu de missions complexes ou qui ne nécessite de gérer des situations seul. En revanche c’est un chapitre dont on attend un engagement total et Xander est le parfait président pour accomplir cela. Il est Biogmenté, il a été incorporé au programme de Biosun (Melvin Brock,Josh Graff etc.) après son arrestation en 2034 et a été libéré en janvier 2035, il est revenu avec 95 kilo de muscles en plus, un meilleur contrôle sur ses pensées, 40 cm de plus et une densité osseuse augmentée."}]},{"id":"figures-notables","title":"Figures & chapitres notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The Overspeed Baron: Calvin Barron","Calvin BARRON"],["Chapter “original Cruisers” : Stephany Lorn","Stephany Lorn"],["Chapter “Ironclad Warriors” : Lana Jackson","Lana Jackson"],["Chapter “Armored fists”: Xander Lucas","Xander Lucas"]]}]}]},{"id":"realite-v9-crawlers-motards-reapers-incorporated-power","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Reapers Incorporated Power — Motorcycle Club","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Gundrivers","Motards","Anti-système","Reapers Incorporated Power"],"sections":[{"id":"reperes-fonctionnement","title":"Repères, implantation & fonctionnement","level":2,"blocks":[{"type":"p","text":"Les « grim reapers » ont été fondé dans les années 2010, à Los Angeles, un gang de quartier à l’origine. Non racialisé, ce gang mettait à l’épreuve ses membres par des étapes de plus en plus rudes. S’inspirant de mouvements punks et de la culture motarde, ils géraient les combats de rue, la distribution de la drogue et l’’extorsion auprès des deux bars du quartier. Fondé par Tobias Fockell, (père d’Addisson Fockell dit « Fox »), le gang est revenu aux mains de Solomon Blackburn, un psychopathe ayant renforcé le délire autour de la Faucheuse, c’est sous sa direction que le gang ouvrit ses horizons et prit des femmes comme membres, dont la jeune Veronica Silver qui sortait avec Keith Hayes. C’est Veronica qui recruta elle-même un jeune afro-américain, Luther Pierce avant qu’il ne joigne les Crips, un grand gang. Malin, vicieux et très athlétique, il était le seul à pouvoir suivre son mentor, Vero. Quand elle tua Ted Merrill, Kayleigh Zamora, la nouvelle chef des Reapers en fut soulagée, voyant Veronica comme une rivale dans un avenir proche, elle essaya de la balancer à la police et de virer Luther. Veronica s’engagea dans l’armée mais pour Luther, ce fut un passage à vide, après un temps chez les Cruisers, il revint en 2022 reprendre le gang, aidé par Daldea FANN, une militaire ayant un compte à régler avec Kayleigh. Réformant le RIP, il en fin un gang de bikers diversifié. Il combattit 2 ans en Corée avant de reprendre ses affaires de gangs après 2025."},{"type":"p","text":"Pilote d’hélicoptère de combat et pilote d’essai pendant la guerre, elle a été collègue de Makana Keahi et Abigael Sky. Après un temps comme mercenaire sous les Ordres d’Andrea Shield, elle a fini par devenir biker. Elle passe de club en club sans trop d’attachement, actuellement, elle est Reapers."},{"type":"p","text":"Addison Fockell est a fille unique du fondateur, Tobias Fockell, qui créa le gang en 2010, il fut vite arrêté sans balancer son gang et Solomon Blackburn prit la suite en 2014, Addison n’avait que 14 ans alors elle ne s’approcha pas des Reapers, bien que Solomon fût un « oncle » pour elle."},{"type":"p","text":"Solomon Blackburn a été le second chef du gang des Reapers, il est connu pour avoir accepté les femmes et les afro-américains pour ne pas transformer le gang en le rapprochant de néonazis et il est aussi connu pour avoir quitté le gang du jour au lendemain pour traquer un type et le tuer dans le désert, sans revenir avant des années. Il a fondé le « Reaper skulls», où Tanako Akaguchi, Rena Queen et d’autres assassines sont des membres (white skull, black skulls, red skull, blue skull etc.) et le « Lost reapers », un chapitre de motards, un gang frère des « grim reapers » avec lequel ils créèrent le « RIP » en rattachant plusieurs gangs entre eux, dans une organisation bien ficelée."}]},{"id":"figures-notables","title":"Figures & chapitres notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The Reaper boss: Luther Pierce","Luther PIERCE"],["Chapter “Grim reapers” : Daldéa Fann","Daldea FANN"],["Chapter “Blood reapers” : Addison Fockell","Addison Fockell –  fox"],["Chapter “Lost reapers”: Solomon Blackburn","Solomon Blackburn"]]}]}]},{"id":"realite-v9-crawlers-motards-vagos","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Vagos — Motorcycle Club","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Gundrivers","Motards","Anti-système","Vagos"],"sections":[{"id":"reperes-fonctionnement","title":"Repères, implantation & fonctionnement","level":2,"blocks":[{"type":"p","text":"Les « Vagos » ont été fondé dans les années 1963, à San Bernardino."},{"type":"p","text":"Adalyn est une femme qui a incorporé les vagos assez jeune, pas une pute à motard ni même une régulière, même pas une fille de motard, elle est venue, a brisé des testicules, descendu des bières, essuyé des tirs, sauvé des gars et a obtenu son cuir en partant de plus loin qu’aucun autre Vagos. 35 ans plus tard, les « Fourbes » (los Picaros), sont le chapitre des vagos qu’elle dirige, des malades mentaux de pillards, des necropunks, ils se baladent avec les os des gens qu’ils ont tués, les attachant à leur moto. Elle a fait la guerre, elle était chez les rangers, elle était des « Animals », sous le commandement de « bears », alias « Odin », et plus raisonnablement appelé Arthur Bartram. Elle ne s’est jamais entendue avec lui, elle était Vagos, lui hell Angels, et même avec la guerre, l’esprit de corps des soldats, rien n’y faisait. En revanche, elle s’est, le temps d’une opération, assez bien entendu avec Tokala."},{"type":"p","text":"Encarnacion est la présidente d’un chapitre des Vagos, les « Coyotes fous ». Son père était un membre éminent du cartel de Tijuana, il détestait les « baronnes » et s’est opposé à leur prise de pouvoir dans le cartel. Quand il fut éliminé lui et sa famille Mercedes Cadaval, de son vrai nom, fut protégée par Ricardo Miralles, un ami de son père, membre des coyotes. Quand les Vagos ont entamé leur guerre pour percer dans le Mexique, la guerre s’y déroulant faisait rage, les motards locaux, contrairement à ceux américains étaient très souvent à aider les familles plus humbles à fuir, parfois revendant les gens aux corporations, parfois plus vertueusement, ils les faisaient passer en Californie. Encarnacion était de ces derniers. Elle fut confrontée aux Vagos et fut poussée à se soumettre à Sean Buckner, le président de l’époque. En échange, il devait l’aider à profiter de la situation pour amoindrir le cartel de San Diejuana, mais il fit tout le contraire une fois les motards mexicains sous sa coupe. Beaucoup de Coyotes sont d’anciens Bandidos vaincus par les Hell Angels ou les Cruisers, mais peu sont Vagos de cœur."},{"type":"p","text":"Kyle Simmons est le président des « Los Einherjar » un chapitre très extrême des Vagos. S’ils ont accepté le tournant philosophique plus hispanisant du gang, ils restent très ancrés dans un traditionalisme malsain et intolérant au sein de leur chapitre. Les « Lost Einherjar » sont les meilleurs soldats des Vagos et sont considérés avec un certain respect au sein du gang. Ils sont pourtant des ordures qui ont pour spécialité de soumettre des villages et de revendre les prisonniers."}]},{"id":"figures-notables","title":"Figures & chapitres notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Loki’son: Miguel González","Miguel Gonzalez"],["Chapter “Los pícaros” : Adalyn Owens","Adalyn Owens –  peacock"],["Chapter “Coyotes Locos” : Encarnación Miralles","Encarnación Miralles"],["Chapter “Lost Einherjar”: Kyle Simmons","Kyle Simmons"]]}]}]},{"id":"realite-v9-crawlers-motards-sons-of-silence","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Sons of Silence — Motorcycle Club","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Gundrivers","Motards","Anti-système","Sons of Silence"],"sections":[{"id":"reperes-fonctionnement","title":"Repères, implantation & fonctionnement","level":2,"blocks":[{"type":"p","text":"Les « Sons of Silence » ont été fondé dans les années 1966. Misogyne, raciste et violent, c’était un gang de motards criminalisés comme quelques autres. Nativement issu du Colorado bien que s’étant prodigieusement répandu, ce club a participé à la grande guerre des motards aux Etats-Unis au début des années 2030. Pas seulement en Californie mais sur toutes les grandes routes des Etats-Unis, les motards ont pris des stations puis des villages routiers. Les Sons ont vaincu dans le Colorado, avant de se jeter sur la Californie, centre névralgique de nombre de marché illégaux. Quand Todd Sheperd, le grand président a été assassiné par Arthur Bartram et tout le chapitre des « Crying sons » massacré, une crise ravagea le club. La petite amie de Sheperd, Raghnaid, une réfugiée européenne, défendit le QG avec quelques régulières. Elles arrachèrent dans le sang et la sueur leur droit de porter le cuir et marchèrent sur les Hell Angels de « San Iron Paulo », un village motard, une cinquantaine de « Valkyries » de cuir et de chrome massacrèrent et incendièrent le village durant une nuit entière. Crainte, elle s’installa comme présidente des Sons car aucun n’osa lui rappeler qu’ils n’acceptaient pas les femmes. Amazone, c’est une des 8 reines servant Angrboda et vénérant Katja. Elle était amie avec Brunehilde."},{"type":"p","text":"Eamonn est une des pires raclures que le monde puisse connaitre. Né en Irlande, c’est un cousin de Deaman et Siobhain à quelques degrés. Enfant, il était convaincu de voir des esprits et des spectres alors sa mère essaya nombre de thérapies qu’il rejeta avec violence. Dès qu’il fut majeur, Il tenta de s’approcher de l’IRA véritable et l’intégra plus tardivement après quelques années de criminalité médiocre. Il fut envoyé aux Etats-Unis pour une mission mais n’en revint jamais. Ami avec Todd larsen, il se maria avec Yazmeen Oliver, une ancienne camarade de classe de Dina Page qu’il avait sous sa coupe, devenant Américain. Il erra entre gang, IRA, motards, neonazi, devenant très ami avec Todd Sheperd, le président des Sons of Silence. Il comptait le trahir une fois le gang bien lié à l’IRA et aux néofascistes des prisons américaines, un réseau parfait pour bosser avec Larsen maisla grande guerre des motards ruina ses plans et Raghnaid lui dama le pion quant à la présidence suprême."},{"type":"p","text":"Rike Kuechler est une ancienne pute à motards. Lors de la grande guerre des moteurs, elle était amie avec Raghnaid et a attaqué le village des Hell Angels avec elle, elle n’avait que 21 ans mais déjà ses compétentes semblaient exceptionnelles pour ce qui était de racasser des cranes et briser des os. Quand elle vient à Los Angeles ce n’est que pour s’entrainer physiquement, c’est une droguée de l’effort physique et de la musculation. Elle aime son corps et les muscles, tous les muscles, hommes, femmes, même les taureaux sous hormones la font fantasmer, seule importe la fibre musculaire bien dense. Elle répugne la maigreur et l’obésité mais aussi les gens de petite taille ou malformés. Elle était neonazi dans sa jeunesse et c’est pour ça qu’elle a une profonde intolérance mais elle assume sa « musculosexualité » pleinement et comprend que les mentalités comme celle qu’elle avait sont stupides. Son plus grand fantasme est le général Ashorn mais plus généralement tous les vétérans, elle-même n’ayant pas fait la guerre. Outre les muscles, sa moto, Miranda, est la seconde chose la plus précieuse pour elle."},{"type":"p","text":"Cannon Mullins est le président des « fis de l’Audace ». Ses motards sont des caricatures dignes de sortir de Madmax, ils cherchent à mourir dans le plus grand des fracas et se droguent, boivent et s’augmentent physiquement jusqu’à suffisamment vriller pour ne plus avoir peur. Force incontrôlable des Sons of silence, ce chapitre terrifiant est comme une bande de chiens sauvage que Raghnaid lance sur ses pires ennemis, Cannon a d’ailleurs deux armes de prédilection la tronçonneuse à dents usées et le canon anti￾aérien dont il équipe tous ses camions et ses 4x4. Il y a deux choses à ne jamais dire à Cannon : la première est d’évoquer qu’il n’a fait qu’une semaine en Corée, avant de déserter peu avant les grands massacres, pour un « Fils de l’Audace », l’ironie semble totale. La seconde chose à ne pas évoquer c’est de le défier, même pour le jeu, Cannon est tellement complexé de s désertion et de sa couardise que tous ceux qui le défient finissent sous sa tronçonneuse émoussée, à voir leur corps partir en lambeaux sur les dents les moins abimées de la tronçonneuse. Il ne se bat jamais lui-même malgré sa carrure, quand on le défi, il ordonne qu’on attrape l’avorton ayant osé et l’exécute avec autant de lâcheté que de sadisme. Il est gardé par Raghnaid car la dévotion de ses hommes est immense, eux ont la bravoure qu’il n’a pas."}]},{"id":"figures-notables","title":"Figures & chapitres notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Queen of the Ragnarok: Raghnaid Peutan","Raghnaid Peutan"],["Chapter “Bloody Clover” : Eamonn Mac Cearáin","Eamonn Mac Cearáin"],["Chapter “Noisy Daughters” : Rike Kuechler","Rike Kuechler"],["Chapter “Sons of Spunk”: Cannon Mullins","Cannon Mullins"]]}]}]},{"id":"realite-v9-crawlers-motards-sons-of-legba","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Sons of Legba — Motorcycle Club","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Gundrivers","Motards","Anti-système","Sons of Legba"],"sections":[{"id":"reperes-fonctionnement","title":"Repères, implantation & fonctionnement","level":2,"blocks":[{"type":"p","text":"Les « Sons of Legba » ont été fondé en 2025, pendant la guerre de 22-28. En réponse au début du rejet des vétérans, les afroaméricains n’avaient pas de structure similaire à un club de motards, ils avaient des gangs et des familles mais étaient rejetés d’autres fraternités. Zaketa pendant une permission, rassembla des vétérans blessés pour former les « fils de Legba », même si on les appelle plus communément « Children of Legba », étant donné la forte présente féminine dans le club."},{"type":"p","text":"Annushka est née en 1997, de riches parents américains. Hélas, ils firent naufrage après que leur meilleur ami, Shuji KASHIWA (riche président de la corporation Lao-Kashiwa bank) ne leur ai prêté un voilier. Le naufrage se fit dans les îles Kouriles, où Shuji avait envoyé Tomas et Jashanna Garnett, les médecins russes s’occupèrent de l’accouchement de Jashanna. Annushka débuta sa vie en Russie, l’ignorant mais traquée par les hommes de mains de Shuji qui refusait qu’elle hérite de Tomas pour les parts de leurs entreprises."},{"type":"p","text":"LeMaun Cross est un sanguinaire président de gang de motards. On sait assez peu de choses sur lui, si ce n’est que c’est un ancien policier de Washington qui a été condamné pour corruption, violence et abus de pouvoir. Il fut incriminé pour double homicide. Emprisonné 15 ans, il est un des rares ex-policiers à survivre en prison. Relâché en 2025 pour être jeté dans la secrète « Sentenced army », quand le gouvernement américain s’imagina qu’envoyer des milliers de détenu en Corée pourrait aider, n’imaginant pas 95% de désertion comme résultat, avec 41% de meurtres d’officiers en charge dans cette armée. Lui refusa de fuir et après un an de combat, sans logistique, cette armée étant condamnée à mort, il a été rapatrié en attendant une révision de peine pour son héroïsme, mais la Justice américaine s’étant cassée la gueule pendant la guerre, il a juste été transféré à Corcoran, rejoignant le gang carcéral de Katell avant d’être libéré à la suite d’une magouille corporatiste le rachetant pour une mission visant à buter Dina Page. Cette fois, il déserta et se réfugia chez les bikers."},{"type":"p","text":"pouvoir angélique : le poison céleste Statut : présidence de Motorcycle Club Toxicity est née d’une mère droguée qui a mal vécu sa grossesse, l’appelant ainsi avant de l’abandonner. C’est une femme qui n’a jamais été aimée ni respectée. Dans l’orphelinat, elle a été agressée par un éducateur, elle lui a ouvert le pénis sur la longueur avec un bout de vitre, elle n’avait que 12 ans. Placée en maison de correction, elle s’est enfoncée dans la violence et les tentatives de suicide. Boxeuse de moindre envergure, elle a fait des douzaines de boulots avant d’aller au front. Elle n’avait aucune formation militaire mais a adoré la fraternité militaire, après la guerre, son syndrome post-traumatique l’a rendu incapable de sortir dans la rue. Après une tentative ratée, elle a décidé de joindre les Sons of Legba."}]},{"id":"figures-notables","title":"Figures & chapitres notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Baron moteur: Zaketa Harris","Zaketa Harris"],["Chapter “Daughters Of Eshu” : Annushka Lyninka Maxinovna","Annushka Lyninka Maxinovna"],["Chapter “Wolfs of Death” : LeMaun Cross","LeMaun Cross"],["Chapter “Chaos Skull”: Toxicity Norton","Toxicity Norton"]]}]}]},{"id":"realite-v9-crawlers-motards-onikishi","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Onikishi — Motorcycle Club","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Gundrivers","Motards","Anti-système","Onikishi"],"sections":[{"id":"reperes-fonctionnement","title":"Repères, implantation & fonctionnement","level":2,"blocks":[{"type":"p","text":"Les « Onikishi » ont été fondé en 2030, c’est un gang de motards assez récent. Ils puisent leurs origines dans les nombreux clans Yakuza que le clan majeur en Californie a totalement anéanti après la guerre, une foule non négligeable de vétérans japonais, liés aux Yakuza s’est retrouvée incapable de joindre la moindre mafia. Daisuke était un officier yakuza puis militaire pendant la guerre, quand on tua son père en Californie, il réalisa que Los Angeles était un piège mortel et pendant plusieurs mois il échappa aux ennemis de son clan en parcourant l’état à moto, suivi de quelques autres japonais et coréens dans sa situation, ils finirent par former ce gang."},{"type":"p","text":"Kamiko est une terrifiante motarde des Onikishi. Elle a le « fourreau sanglant » et détient le chapitre des « red Oni ». Chaque président et grand officier Onikishi possède un katana conçu par Sehdia craft. Elle est une des plus sanguinaires au sein du gang et possède plusieurs amantes et amants puisqu’elle se déclare polygame et néopaïenne."},{"type":"p","text":"Kiyoemon est un ancien Bosozuku des années 1980. Brute de 19 ans en 1985 quand il est pratiquement tué par des yakuzas qu’il avait défiés, il vit la lente désuétude de son mode de vie dans les années 1990 et 2000. En 2007, à 41 ans, n’ayant pu intégrer ni l’armée ni la police vu son passé de criminel, il était donc Handyman (homme à tout faire) jusqu’à ce que le clan Yakuza de l’Orochi Fukuoka (à Fukuoka, plus grande ville de Kyushu), ne vienne faire sa loi dans son quartier. Enfilant son grand manteau blanc et prenant ses couteaux de sushiman, il découpa les phalanges de 46 mafieux et de sa batte en envoya 21 à l’hôpital. Envoyé 15 ans en prison pour cela, il fut libéré pour joindre la défense Japonaise face aux Nord￾Coréens. Après la guerre, en 2028, il se retrouvé déporté en Californie, à 62 ans, il rassembla ses économies pour monter son sushibar à Los Angeles, mais les mafias locales ne le laissèrent pas en paix, 21 connards à l’hôpital plus tard, il vola une moto et erra, volant selon sa faim. Kiyoemon est l’héritier du style Shitomada, art martial dérivé du clan Shi, d’où sa force de combat malgré son âge, fort depuis l’enfance et encore maintenant, ayant le niveau d’un maître puisqu’il en est un."},{"type":"p","text":"Jin-Joo est née en Corée du nord en 1996. Elle a été élevée selon un programme d’entrainement d’orphelins et a été menée au paroxysme de l’Humanité. En 2022, âgée de 26 ans, elle était un solda parfait et était des forces frappant le Japon. Pendant la reconquête de ce pays par les forces alliées, Jin￾Joo a commencé à réellement douter de ses supérieurs, en effet, membre de l’élite, elle côtoyait souvent le général Kang Sung-Hyung, assez pour réaliser qu’il utilisait des pouvoirs psychiques sur elle et les autres orphelins du programme et assez pour comprendre qu’il n’était pas humain. Désertant dès que possible, elle savait parfaitement parler Japonais heureusement et s’est faite passée pour une résistante afin d’être déportée aux Etats-Unis."}]},{"id":"figures-notables","title":"Figures & chapitres notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The Samurai: Honda Daisuke","Honda Daisuke"],["Chapter “Red Oni” : Miyashiro Kamiko","Miyashiro Kamiko"],["Chapter “Last Bosozoku”: Shitomada Kiyoemon","Shitomada Kiyoemon"],["Chapter “Green Oni”: Yokoyama Shinobu","Yokoyama Shinobu - Yo Jin-Joo"]]}]}]},{"id":"realite-v9-crawlers-motards-last-crows","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Last Crows — Motorcycle Club","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Gundrivers","Motards","Anti-système","Last Crows"],"sections":[{"id":"reperes-fonctionnement","title":"Repères, implantation & fonctionnement","level":2,"blocks":[{"type":"p","text":"Les « last crows » sont des bikers particulièrement violents, ils n’ont pas de territoire propre, ils errent à leur convenance du sud du Canada jusqu’au Mexique. Wenona est la chef, c’est une motarde et une chamane."},{"type":"p","text":"Ciara est la fille de Delwynn McFarlane et de Ravenna Blake. Abandonnée jeune par sa mère, son père motard la trimballa dans son sidecar jusqu’à ce qu’elle s’inscrive au collège, en Californie, détestant le Nevada où elle naquit. Hélas, à 16 ans, son père disparut dans un « accident », tué par des marchands d’armes russes. Plutôt que vivre chez les tueurs de Wenona, son amie d’enfance, elle garda la moto et s’échappa aux services sociaux pour vivre parfois avec les motards, souvent seule, rencontrant Naalnish, son meilleur ami, un esprit corbeau qu’elle sauva. Avec son errance, elle devint une des meilleures chasseuses du monde, Naalnish lui amenant des bons tuyaux, des armes, des matériaux."},{"type":"p","text":"Meilir est un gallois qui a émigré aux Etats-Unis pour fuir une vie d’ennui. il a longtemps été dans les « black crow », la bande de motard, où il était un très bon ami de Delwynn, il a souvent veillé sur Ciara avant qu’elle ne fuît à la disparition de son père. Bien qu’il ait tenté d’intégrer Ushkoll quelques années avant la guerre, il n’y resta pas après 2028."},{"type":"p","text":"Zack est un des fils de Khaashtay non pas l’actuel, mais le précédent."}]},{"id":"figures-notables","title":"Figures & chapitres notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["The mother black eagle : Wenona","Wenona"],["Solitaire : “True Crow” : Ciara McFarlane","Ciara MacFarlane"],["Chapter “legion of Ravens”: Meilir Yarwood","Meilir Yarwood"],["Chapter “Wolfs&Eagles”: Zack LittleBear","Zack LittleBear"]]}]}]},{"id":"realite-v9-crawlers-enders","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Enders — sortir du système","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés"],"sections":[{"id":"origine-philosophie","title":"Origines, autonomie & rejet du système","level":2,"blocks":[{"type":"p","text":"Les Enders Dès les années 1950-1960, la peur d’une guerre nucléaire anéantissant l’Humanité menait à créer des bunkers antiatomiques, vendre des kits anti-radiations et autres inventions visant à la survie malgré l’idée d’un cataclysme dévastant le monde. L’eschatologie a toujours bouleversé les foules et la peur des virus, du changement climatique, de l’effondrement du capitalisme succédèrent à la menace soviétique surtout aux Etats-Unis, qui cherchèrent des ennemis ou des coupables, Russie, Chine, Corée du nord, Internet, les aliens, les reptiliens… toutes les théories du complot et tous les ennemis possibles ont été désignés pour justifier une fin imminente face à laquelle « il faut se préparer ». Le néosurvivalisme des « preppers » continua surtout à faire face à un effondrement ou climatique ou politique, la peur d’une anarchie régressive, alors que tout désignait la Russie pour en être l’Architecte (ou les Etats-Unis eux-mêmes), ce fut la Corée du nord qui bouleversa le monde en 2022. C’est surtout lors des lourds massacres du début de la guerre que les gens prirent peur, accélérant l’effondrement du marché et de l’économie. L’essor corporatiste leva une nouvelle menace : celle de devenir un esclave sans droit, un capitalisme si exacerbé que même les pires conservateurs en réalisèrent la menace, trop tard toutefois. En 2030, le bond technologique enfonça le dernier clou, pour des millions de gens ç travers le monde, les corporations pouvaient venir et s’installer, exploiter les ressources, les gens et tuer les survivants une fois fini, ce n’était plus de la menace potentielle mais de l’actualité, la « préparation » était finie, les « preppers » devinrent des « Enders » la fin des sociétés occidentales était là, elle avait commencé. Les Enders rejettent les gouvernements et les corporations, ils réclament des droits équivalents à ce que réclamaient les natifs américains, ils veulent disposer de leurs terres, sans aucune loi autre que les leurs. Dans la théorie, c’est une idée saugrenue, aucun gouvernement n’a d’intérêt à les laisser faire, dans la pratique, aucun gouvernement n’a les moyens en 2035 de purger des milliers d’individus bien armés ou des centaines d’individus bien planqués dans des coins sauvages. Seules les corporations le peuvent et tant que ça n’interfère pas avec les gains, aucune corporation ne s’y intéresse. Le Pentavirat a même entré le terme dans leur langage usuel pour désigner les enders comme « Homopithecus ferus », « les singes humains sauvages », pour les classer au même niveau que des animaux, une méthode pour ne pas agir contre quand il n’y a aucun intérêt, s’il n’y a aucun humain, aucune raison de bouger, et s’ils ne sont pas humains, aucun soucis à les purger comme le reste de la faune. Les enders savent à quel point ils sont méprisés mais ils savent aussi à quel point ils sont libres. Parmi les plus grosses communautés, du moins les plus influentes il y a : • « La nation subaquatique Wonda » , menée par Mary Shanasti • « Gold cow kingdom», mené par Diana Buck • « le Front des natifs indépendants », mené par « Nana » Nandoa • « la forêt des empalés », menée par Alayna Daewynn • « les green Nomads », menés par Jane Moreno • « les fermes Mannan » menées par Harmony Melinda Mannan • « les mola mola », menés par Piripi Stuart Hariwana"},{"type":"p","text":"Ces communautés californiennes ne sont pas forcément les plus colossales du monde ni les plus redoutables, mais c’est parce qu’en Grande Californie, il existe bien plus de droits, de pouvoir du gouvernement, de richesses aussi et forcément d’espoir, les communautés se forment donc plus rarement et perdurent moins. En plus de ces communautés clairement connues, s’ajoute celle de Lostown, une ville souterraine à l’Est de Los Angeles. Le phénomène est toutefois plus développé dans les pays sans gouvernements où l’insurrection et les corporations s’opposent plus frontalement. En Chine, en Afrique centrale, et en Europe de l’Ouest essentiellement. Il est important de ne JAMAIS confondre un ender et un insurgé. L’insurgé lutte pour changer les choses, il est citadin mais dissimulé, il se base sur un réseau infiltré dans toutes les strates de la société, il est lourdement armé mais dispose de très faibles moyens, le temps joue contre lui dans toutes ses entreprises. Le ender n’a plus rien à faire des « corpombies » et des « slavitizens », il n’y a plus rien à changer car il n’y a rien de bon dans le monde, il est toujours en dehors des villes et possède toujours un territoire aménagé, pour accéder à lui il faut donc entrer sur ses terres, il ne les dissimule pas, le plus souvent, il affiche des avertissements. Les communautés ne sont pas toujours très bien armées, selon le moment de leur création, avant ou après le bond technologique, elles ont des armes plus ou moins datées, en revanche, si elles ont plus d’un an, c’est qu’elles ont acquis assez de ressource pour s’autosuffire et donc ont des moyens de production leur étant propres, si on s’attaque à un Ender, le temps jouera toujours pour lui puisqu’on l’attaque chez lui, avec tous ses moyens possibles. Les communautés peuvent varier énormément de l’une à l’autre, entre néo-hippies n’ayant de volonté que de copuler à survivalistes néonazi ultraviolents se la jouant cowboy, il n’y a parfois qu’une colline et quelques kilomètres qui les séparent. Les motards jouent un rôle décisif dans la vie des Enders car ils assurent leur seul approvisionnement possible, les communautés de motards jouent aussi des barrières infranchissables pour les communautés belliqueuses de Enders, en un sens, les villages motards sont des villages de Enders également même si leur isolationnisme est moindre. On peut noter que les communautés rétrograde à tendance religieuses comme les Amish ou les Mormons n’ont pas perduré, elles se sont toutes faites"}]},{"id":"communautes","title":"Communautés californiennes","level":2,"blocks":[{"type":"table","rows":[["Communauté","Figure associée"],["Underwater Nation","Mary Shanasti"],["Gold Cow Kingdom","Diana Buck"],["True Nations","Nandoa"],["Green Fairy Daughters","Alayna Daewynn / Kelly Rinaldi"],["Green Nomads","Jane Moreno"],["Fermes Mannan","Harmony Mannan"],["Mola Mola","Piripi Stuart Hariwana"],["Losttown","Ulfric Tamer"]]}]}]},{"id":"realite-v9-crawlers-enders-underwater-nation","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Underwater Nation","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés","Underwater Nation"],"sections":[{"id":"communaute","title":"Communauté, mode de vie & implantation","level":2,"blocks":[{"type":"p","text":"Amalia est milliardaire, son père était le vice-président d’Ocean Master et il aurait été lâchement assassiné par ses collaborateurs. Heureusement, Amalia hérita sans qu’ils n’accèdent à l’argent mis de côté. Remontée contre Ocean master et Seawares , elle est une figure néopaïenne qui lutte contre l’exploitation de la mer et elle finance donc lourdement « l’underwater nation »."},{"type":"p","text":"Mary Shanasti est une « enders », elle est une sorte de gourou qui possède des communautés sous￾marines indépendantes. Elle prône des principes religieux néopaganismes, elle n’a que faire des lois, puisque ses communautés sont soumises à la loi de sa propre « nation »."},{"type":"p","text":"Kylon Smithgerald est un combattant de l’underwater nation. Il a fait la fin de la guerre de 22-28, mais n’a pas trouvé sa place jusqu’àce qu’il ne découvre la cause des Enders réclamant les cités sous￾marines. Dans la sécurité de Seaware quand il rencontra Mary Shanasti, il préféra la suivre et trahir ses officiers que lutter."},{"type":"p","text":"Ryan est un défenseur des cités sous-marines, pour lui, bien que les humains ne soient pas faits pour vivre dans les fonds marins, il est évident que l’Humanité va disparaitre de la surface émergée, elle ne pourra renaitre qu’à partir des colonies extrêmes comme celles sous l’eau ou dans l’espace. Fanatique de Mary Shanasti, c’est un des plus puissant et sanguinaires enders la suivant."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["l’héritière : Amalia Carson","Amalia Carson"],["Ocean Queen : Mary Shanasti","Mary Shanasti"],["« Le marchand de sel » : Kylon Smithgerald","Kylon Smithgerald"],["“Deep lord” : Ryan Oakson","Ryan Oakson"]]}]}]},{"id":"realite-v9-crawlers-enders-gold-cow-kingdom","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Gold Cow Kingdom","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés","Gold Cow Kingdom"],"sections":[{"id":"communaute","title":"Communauté, mode de vie & implantation","level":2,"blocks":[{"type":"p","text":"Kassidy est une fermière de la communauté « gold cows ». Ex-capitaine dans l’US. Marines corp, Kasssidy était une dure à cuir ayant vécu l’essentiel de sa vie le crâne rasé, poitrine bandée pour faire le plus badass possible. C’était une brute assez militariste qui prit le conflit de 22-28 avec engouement, allant « enfin » péter la sale Corée du Nord une bonne fois pour toute. Si en 28 l’issue de cette guerre lui donna raison, le prix à payer était trop lourd et ses jeunes années à prôner capitaliste exacerbé et soutenir des républicains extrêmes lui firent mal en voyant le devenir des Etats-Unis et l’essor des corporations toutes puissantes. Quand le gouverneur George Jewelson, du Kansas, vendit 60% de Topeka (capitale du Kansas) à Arcanet, Kassy et un groupe de vétérans et massacrèrent ce gouverneur et tous les corporatistes possibles. Elle prit lafuite et laissa pousser ses cheveux en joignant la communauté de Goldcows pour se cacher. Meneuse de clan, elle s’est réfugiée chez Diana pour échapper aux représailles."},{"type":"p","text":"Diana Buck est une fermière de Californie. Elle possède le grand village agricole de « Gold cow kingdom», même si les centaines de fermiers locaux sont des survivalistes indépendants, résistant aux assauts des bikers et des mercenaires, ils survivent par les fonds donnés par Dwarfood corporation, offrant du lait, de la viande et des œufs classiques à la corporation, sans aucune norme d’hygiène ou de sécurité à suivre étant indépendants, la corporation les utilisant en soutien, n’ayant donc pas besoin d’eux dans l’absolu mais entretenant la communauté pour avoir une production inconnue des autres corporations alimentaires susceptibles d’attaquer les fermes industrielles pour mettre à genoux Dwarfood. Bien qu’elle soit jeune, Diana est une femme au fort caractère."},{"type":"p","text":"Ethan Sheppard était un sénateur Californien pendant la guerre, après une prestigieuse carrière dans le droit puis dans la politique, ce démocrate était aussi respecté que charismatique."},{"type":"p","text":"Jett Burris est un ancien policier du Texas. Fantasmant les cowboys depuis l’enfance, il toujours arboré un chapeau noir digne de sens héros. La vie de policier ne l’a jamais autant passionné qu’il ne l’imaginait quand il a choisi cette carrière, s’ennuyant il lâcha son poste lors de la grande conscription générale pour la guerre de 22-28, cependant, il attendit 2026 avant que sa demande ne soit acceptée, ironiquement, si les Etats-Unis manquaient de volontaires, les états préféraient ne pas céder tous leurs policiers, pompiers et autres agents publiques utiles à la stabilité. Là encore, il ne fut pas spécialement séduit par l’horreur de la guerre même la fin de guerre, rentrant avec un gout amer en bouche. L’essor des corporations, le bond technologique et l’âge sombre des bikers lui donnèrent toutefois une envie de fuite. Volant un cheval, il erra comme le cowboy hollywoodien qu’il rêvait d’être avant de trouver « Gold Cow kingdom ». Au début rejeté, il gagna sa place en défendant les lieux face à des motards venus piller. Diana accepta qu’il ne gère la sécurité, mais lui refusa le titre de shérif tant désiré. Il fume beaucoup de N-sta même s’il est peu augmenté, pour le style. Son colt est personnalisé, c’est une arme à projectiles microplasma, il l’a ramené de Corée du Nord dont il a fait changer l’apparence externe."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Black cow : Kassidy Haynes","Kassidy Haynes"],["Cow Empress : Diana Buck","Diana Buck"],["Grey Beef : Ethan Sheppard","Ethan Sheppard"],["Black bull : Jett Burris","Jett Burris"]]}]}]},{"id":"realite-v9-crawlers-enders-true-nations","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"True Nations","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés","True Nations"],"sections":[{"id":"communaute","title":"Communauté, mode de vie & implantation","level":2,"blocks":[{"type":"p","text":"Niichaad est un descendant des Abenaquis, une première nation du nord des Etats-Unis. Jeune, il était un sportif professionnel dans le tir sportif et la lutte, mais à cause d’un fort racisme, il n’a pas été sélectionné pour les Jeux olympiques et comme il contestait la décision, des néonazis lui brisèrent les deux bras."},{"type":"p","text":"Nana est une grande figure de l’insurrection native américaine, Elle fut surtout connue à partie de 2026, quand l’économie américaine commença à s’affaisser, réclamant plus de pouvoirs aux natifs, plus de compensations financières face à leur génocide non reconnu. Lorsque Tokala fonda la grande réserve, elle s’y opposa par des attaques terroristes, mais sans se rattacher au « front des crocs » que menait Talatuwa, une autre figure insurgée."},{"type":"p","text":"Lyric est une comanche ayant étudié l’économie et le commerce dans une prestigieuse université. Après ses études, elle a été directrice commerciale dans une grande enseigne du domaine textile et vestimentaire. Pendant la grande crise économique elle a perdu la boite qu’elle tentait de lancer et a été rattrapée par des dettes, elle a préféré se cacher dans une réserve indienne pour fuir la justice américaine et a été oubliée pendant la guerre. Elle a intégré True Nations pour contester l’hégémonie totale de la tala corporation, s’avérant très jalouse de la réussite de Tokala."},{"type":"p","text":"kono est un jeune paumé, fanatique de « nana », il boit ses paroles depuis toujours et déteste Tokala et Talatuwa comme personne bien qu’il n’en comprenne pas totalement les raisons, son caractère partisan et extrême le rend incapable de réfléchir et tempérer cette haine terrible."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["« Navajobliterator » : Niichaad Tenford","Niichad Tenford"],["Merciless Nana: Nandoa","Nana  Nandoa"],["Crazy witch&bitch : Lyric Harvey","Lyric Harvey"],["Bloody slave : Kono McLarson","Kono Mc Larson"]]}]}]},{"id":"realite-v9-crawlers-enders-green-fairy-daughters","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Green Fairy Daughters","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés","Green Fairy Daughters"],"sections":[{"id":"communaute","title":"Communauté, mode de vie & implantation","level":2,"blocks":[{"type":"p","text":"Shaynida est une ancienne militaire. On sait peu de choses sur elle hormis qu’elle n’est pas spécialement douée ni valorisée par ses supérieurs. Elle était de l’US. Army, elle a fait ses classes avec Veronica Silver, été affecté au même groupe de combat maistrès vite a vu la blonde surpasser la masse quand elle-même peinait à se faire respecter. Elle a toujours été considérée comme chanceuse, assez belle, assez athlétique sans trop s’entrainer, pas très intelligente mais pas débile, c’est sa chance qui aurait autorisé Shaynida à survivre à la guerre de 22-28. Après la guerre, elle a été engagée par une corporation chimique et a été capturé par des activistes écologistes, elle est restée captive et est devenue un membre d’importance par hasard. Le hasard ? aucun."},{"type":"p","text":"Kelly était une guide forestière, elle a passé toute sa vie en forêt, ou à étudier la faune et la flore, elle voulait obtenir un doctorat en biologie appliquée, mais le caractère trop théorique de la discipline ne lui allait pas, elle n’a jamais rendu son mémoire et séchait 75% du temps pour faire de la randonnée à la place. Elle a naturellement rejoint le mouvement « GFM » mais à la division entre Alayna et Sahamena elle a préféré la vision de la première et s’est jointe à la communauté associée. Les GFM et les GFD ne sont qu’une seule et même faction, la principale nuance étant leurs méthodes, Sahamena milite dans la société californienne, Alayna refuse cette société."},{"type":"p","text":"Tous les nords-coréens ne sont pas des terroristes cherchant à restaurer la gloire de la Corée unifiée ou à se venger de la défaite injuste qu’ils ont vécu. Certains ont un réel besoin de rédemption, ils sont même plus nombreux que les autres, Hyun-Ki en fait partie. Incapable de s’intégrer par son passé et son origine, il était condamné à mort après s’être rendu aux autorités Californienne, le gouvernement Page et celui des Etats-Unis entrant en conflit sur son cas. Libéré par des terroristes, il a préféré trouver la communauté des GFD et cherche à réparer les fautes de son pays en défendant des innocents."},{"type":"p","text":"Huxley n’est pas le genre de type qu’on imaginerait dans la communauté des GFD. Sociable et serviable, il adore les gens et cet ancien enseignant ne se repose jamais. Né en Alaska, dans un petit village, il a fait son début de vie à Anchorage où il bossait dans une scierie puis comme bûcheron, il a aussi travaillé dans une exploitation minière et une concession de chercheur d’or. Il a commencé à travailler à 15 ans, alors à 17 ans, au début de la guerre, il ne comprit pas qu’on ne l’engage pas.Il pu s’engager à 22 ans, en 2027, pour la fin de la guerre même s’il resta dans les troupes de logistique de l’US . Army. Après la guerre, il s’exila au sein des GFD, traumatisé par avoir été amené à tuer des gens malgré tout pendant la dernière bataille."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Second Fairy : Shaynida Kean","Shaynida kean"],["First fairy : Kelly Rinaldi","Kelly Rinaldi"],["Kim-jong-bull : Sim Hyun-Ki","Sim Hyun-Ki"],["The Alaskan : Huxley Kane","Huxley Kane"]]}]}]},{"id":"realite-v9-crawlers-enders-green-nomads","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Green Nomads","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés","Green Nomads"],"sections":[{"id":"communaute","title":"Communauté, mode de vie & implantation","level":2,"blocks":[{"type":"p","text":"Un village mobile de caravanes et de camions traverse les Etats-Unis, doté de véhicules blindés sur les flancs et de véhicules lourdement armés dans le convoi, ces Enders sont les « green Nomads », un peu rattachés aux motards, un peu rattachés à la mafia Irlandaise, les cartels mexicains, il s’agit de familles armées se déplaçant en groupe. Jane Moreno est à la tête du grand convoi. Solitaire et badass, c’est une meneuse qui n’apprécie pas vraiment la technologie, elle ne préserve que les armes les plus simples et robustes, rien de connecté."},{"type":"p","text":"Il était le principal opposant à Alayna dans la communauté nomade, plus jeune et plus agressif, il voulait toujours plus d’actes et moins de réflexions. Malgré leur opposition elle lui sauva la vie des centaines de fois. Finalement, quand Jane renversa Alayna, il se retrouva à devoir choisir entre ses ambitions et se soumettre. Il ne fit pas le fier face à l’ancien sous-chef de la communauté. Pilote d’un char très modifié, c’est le principal défenseur de l’aile droite du convoi quand la communauté bouge. La vitesse de son véhicule a tendance à surprendre, puisqu’il peut rattraper les motos les plus usuelles aisément et couper par un terrain accidenté pour rattraper les plus rapides. « Big jay » est le surnom du char."},{"type":"p","text":"Parfois les apparences sont trompeuses, Meaton mesure 2.74 m, près de 250 kg, il a un regard plus proche de celui d’un ours ou d’un rhinocéros et grince souvent des dents et il a le titre d’expert en diplomatie, c’est le négociateur que Jane utilise tout le temps et son ratio de réussite est assez élevé. Parfois, les apparences sont trompeuses… mais pas le concernant. Ou plutôt, s’il a l’air d’être une brute, il se révèle en être une encore plus sauvage et stupide qu’on ne pourrait le craindre, tel un cliché vivait, il parle très peu et charge à vue tout ce qu’on lui désigne comme voulant « négocier »."},{"type":"p","text":"Leena est la capitaine de la « cavalerie » des « green Nomads », elle possède donc le commandement d’une centaine de camions blindés, d’une douzaine de chars lourds et d’un millier de motards. La « Cavalerie » est l’élite des Greenomads, meilleures armes, meilleure nourriture, meilleurs traitements, meilleure hygiène aussi, meilleure discipline également malgré des apparences de barbares sanguinaires punk de post-apo des années 80."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Dragon punch : Jane Moreno","Jane Moreno"],["Big Jay driver : Jayceon Osborn","Jayceon Osborn"],["Morgax the butcher : Meaton Miles","Meaton Miles"],["Orange Lee : Leena Merry","Leena Merry"]]}]}]},{"id":"realite-v9-crawlers-enders-fermes-mannan","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Fermes Mannan","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés","Fermes Mannan"],"sections":[{"id":"communaute","title":"Communauté, mode de vie & implantation","level":2,"blocks":[{"type":"p","text":"Ainée d’Harmony, Grace est une jeune femme extrêmement volontaire. Assez rude et campagnarde, elle n’a rien à faire de la société moderne, elle se voit comme un cowboy et ne se laisse jamais faire. Elle est assez sportive et audacieuse mais elle cache une personnalité abimée, le regard de sa mère lui importe infiniment, et elle se sent éternellement jugée et inférieure aux attentes de cette dernière. Malgré sa rudesse c’est donc une femme plutôt fragile qui préférera taper que s’ouvrir aux autres."},{"type":"p","text":"Harmony Mannan est une ender, des crawlers renonçant à la vie urbaine pour vivre en communautés ou en solitaires sans dépendre des Corporations ou des vestiges de gouvernements. Elle est à la tête de la ferme Mannan, qu’elle tient avec ses deux filles et quelques proches. Si elle ne fait pas ses presque cinquante ans ni ne semble très dangereuse dans ses robes d’été et avec son grand chapeau de paille, c’est un ancien agent de la CIA qui a vu l’influence corporative monter et a préféré s’en éloigner."},{"type":"p","text":"Deuxième fille d’Harmony, Delicacy est une jeune femme assez charmante et séductrice. Elle adore la ferme, les animaux et la communauté, c’est un rayon de soleil pour tous les fermiers et agriculteurs de la communauté. Elle joue et abuse de ses airs ingénus, de sa jeunesse et de ses sourire pour avoir absolument tout ce qu’elle désire, elle est adorée de sa mère, malgré un égoïsme certain qu’on ne lui soupçonne pas. En revanche, elle adore sa sœur ainée, qu’elle désespère de voir chercher à être félicité par leur génitrice."},{"type":"p","text":"Ken est un fils de Josh Graff, le « révérend » il a été reconnu mais n’a pas vraiment connu son père. Sa mère l’éleva dans le Kentucky, à Frankfort. Athlète accompli, ce pompier volontaire n’a jamais aimé l’école et devint vacher dès ses 16 ans. Quand il avait 21 ans, ce bellâtre entretenait deux relations, une avec le propriétaire de l’exploitation où il travaillait, Jenna, et une avec une serveuse de son dinner préféré, Stephany. Avide de conquête, il se lança dans une troisième relation avec Sophia, une sculpturale norvégienne qui ruina sa vie. En effet, elle semblait savoir déjouer le moindre mensonge et le mettait face à ses contradictions en public, une leçon d’humilité qu’il méritait mais quand elle commença à draguer Stephany et la pousser à harceler Jenna. Jenna brula l’exploitation et fut abattue par la police en menaçant de tuer sa famille, Stephany disparut et Sophia déménagea pour New-York. Ken réalisa que la norvégienne était inhumaine et s’était amusée avec lui afin de lui voler un révolver amérindien qu’il avait gagné au poker."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Wild Grace : Grace Mannan","Grace Drusilla Mannan"],["Harmony’s Angel : Harmony Mannan","Harmony Melinda Mannan"],["Powerful Delicacy : Delicacy Mannan","Delicacy Jarah Mannan"],["Cowboy Ken : Ken Larry Graff","Ken Larry Graff"]]}]}]},{"id":"realite-v9-crawlers-enders-mola-mola","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Mola Mola","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés","Mola Mola"],"sections":[{"id":"communaute","title":"Communauté, mode de vie & implantation","level":2,"blocks":[{"type":"p","text":"Skye Bishop est une « grande sœur » du Mola Mola, une des principales personnes dotées d’un peu d’autorité dans cette communauté hippie. Elle est reconnaissable à son bikini rouge et son ttouage de requin dans le dos. Derrière un sourire toujours sur le visage, c’est une des personnes les plus craintes du Mola Mola, puisqu’elle est la « Juge » de la communauté, celle qui tranche en cas de conflit, le Mola Mola n’ayant pas de lois fixes et écrites mais un jugement populaire, un comportement qui ne dérange personne n’’étant pas source d’enquête ou de sanction, au contraire, un comportement, même anodin qui dérange assez de personnes va mener à une décision de justice."},{"type":"p","text":"Piripi dirige une vaste communauté de Enders, les survivalistes du « Mola Mola », une communauté maritime qui s’empare d’îles et de cités sous-marines pour vivre en indépendance complète du reste du monde. Ils se veulent pacifiques mais ils n’hésitent jamais à tuer toute forme d’attaque corporatiste ou gouvernementale. Piripi n’a pas pour volonté de chercher la bagarre, il préfère se détendre, surfer, jouer de la guitare, pêcher, baiser et siester en général, c’est un héritier de l’idéologie Hippie. Hélas, si on le cherche, on peut vite trouver, l’ex général de la Ngāti Tūmatauenga (la New Zealand army), vétéran de la guerre de 22-28."},{"type":"p","text":"Nako est une beauté de Nouvelle-Zélande, elle a grandi dans un environnement assez pauvre mais serein. Malgré ses airs de mannequin, c’est une pêcheuse et une guide touristique à la base. Pendant la guerre, elle n’a pas été enrôlée ou autre, en revanche, elle a été entrainée comme tous les adultes de Nouvelle-Zélande. En 2023, le croiseur de combat « Rim Hye » attaqua l’Australie, s’il a été coulé non sans de grands efforts de la flotte australiennes et de ses voisins, ça a marqué les esprits. L’économie néozélandaise s’est effondrée, la guerre étant bien plus proche que prévue géographiquement. Durant l’essor des corporations, cette crise économique n’a pas cessé, au contraire, menant à un exode des populations locales vers des cités sous-marines ou des îles artificielles, stations marines et autres, où l’embauche était forte. Courant 2031, Nako mena une rébellion dans la station Delta blue de Seaware, c’est ainsi, soutenue par le Mola Mola, qu’elle intégra cette faction."},{"type":"p","text":"Pakanga est un avocat néozélandais, du moins il l’était jusqu’à la guerre de 2022-2028 et l’attaque du croiseur coréen. Après cette date, il s’enrôla dans la Ngāti Tūmatauenga (la New Zealand army), avant de retourner à la vie civile en 2027. Après ça, il suivit le général Hariwana dans la communauté pacifique de Mola Mola, à l’origine une flotte indépendante pacifique refusant la guerre, les taxes et toute loi inutile."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["Lady Mother-of-pearl : Skye Bishop","Skye Bishop"],["Happy hippie : Piripi","Piripi Stuart Hariwana"],["Mother Na : Nako Tereiti","Nako Tereiti"],["The Lawyer : Pakanga Pikari","Pakanga Pikari"]]}]}]},{"id":"realite-v9-crawlers-enders-losttown","dataset":"realite-v9-crawlers","category":"Réalité","sourceCategory":"Réalité","title":"Losttown","source":"factions crawlers _ les anti système(3).pdf","status":"canon_source","rebuildV2":true,"tags":["Réalité","Crawlers","Neopunks","Enders","Anti-système","communautés","Losttown"],"sections":[{"id":"communaute","title":"Communauté, mode de vie & implantation","level":2,"blocks":[{"type":"p","text":"Saurona est la matrone d’une part de la mafia de lostown."},{"type":"p","text":"Ulfric Tamer est le « seigneur » de Lostown, il est comme un baron de cartel, un grand parrain de mafia ou bien encore un gourou de secte, il a un pouvoir quasi-absolu sur toute la ville et absolument tout le monde le craint au sein de cette cité autarcique. Les plus anarchistes détestent sa position suprême, alors il est confronté à énormément de sous-factions voulant le renverser, ce qui renforce ses mesures sanguinaires et totalitaires."},{"type":"p","text":"Apepia est une est la matrone d’une part de la mafia de lostown. Elle contrôle notamment la branche du « Serpent du chaos ». Elle incarne la cruauté suprême qui règne à Lostown, ayant déjà empoisonné des points d’eau pour récupérer des quartiers afin d’y stocker des denrées -dont de l’eau potable-."},{"type":"p","text":"Zigmars est un letton né en 1985. Plein de bonne volonté et d’avenir, il souhait étudier l’astronomie quand un groupe sectaire l’arracha à ses parents, l’ordre sauroctone. Par son sang, il était un des fils cachés de Wigbeorn, un chevalier de la plus terrible lignée, les descendants de Saint George. Un jour, néanmoins, un demi-frère sorti de nulle-part se montra plus compétent encore et obtint l’armure, Zigmars se faisant marquer au fer rouge dans le dos un sceau pour corrompre son corps, qu’il ne puisse pas voler l’armure au nouveau détenteur."},{"type":"p","text":"Faith est une insurgée, une terroriste s’étant réfugiée à Lostown avec son groupuscule. Elle était la fille d’une gradée de l’armée qui a essayé de dénoncer des exactions perpétrées durant la guerre et qui s’est vue privée de toute solde, toute rente et de tout droit. En 2030, elle se suicida, Faith avait 19 ans et garda une rancœur terrible contre les institutions. En 2032, elle fut identifiée dans l’attaque terroriste du métro de Los Angeles, après une longue traque, elle préféra se cacher parmi les motards où on lui indiqua une ville souterraine.Le cauchemars débuta par un lieu considéré comme idéal, sans loi, sans corruption, sans corporation : Lostown, la ville la plus libre du monde. Mais la réalité était très loin d’être merveilleuse, violence, pauvreté, mafias, tout était presque aussi pourri qu’à Los Angeles en plus méprisable, plus misérable encore.Face à l’oppression constante des mafias locales et sans aucun recours face à elles, Faith changea d’objectif, devenant une sorte d’insurgée au sein même de Lostown, promouvant l’idée de lois, de structure et de Justice, elle reste une enders qui méprise gouvernement et corporation, mais elle rejette l’idée d’un tel chaos, elle veut le bien du peuple de Lostown, quitte à parfois être l’ennemi du concept même de la ville."}]},{"id":"figures-notables","title":"Figures notables","level":2,"blocks":[{"type":"table","rows":[["Alias / désignation","Nom"],["the Maximom : Saurona Drakontos","Saurona Maxima Drakontos"],["the Son of Tiamat : Ulfric Tamer","Ulfric Tamer"],["the Snake witch : Apepia XII","Apepia XII White"],["The fallen Dragon : Zigmars Vilks","Zigmars Vilks"],["God’s childen : Faith Norton","Faith Norton"]]}]}]}]) as Array<Record<string, any>>;
export const COMPENDIUM_REALITE_V9_CRAWLERS_NAVIGATION = [{"id":"realite-v9-crawlers-fixers","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":10,"displayTitle":"Fixers — les Rats"},{"id":"realite-v9-crawlers-deathrunners","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":11,"displayTitle":"DeathRunners — les Chiens"},{"id":"realite-v9-crawlers-neurodivers","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":12,"displayTitle":"Neurodivers — les Cafards"},{"id":"realite-v9-crawlers-meditechs","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":13,"displayTitle":"Meditechs — les Termites"},{"id":"realite-v9-crawlers-gundrivers","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":14,"displayTitle":"Gundrivers — les Corneilles"},{"id":"realite-v9-crawlers-neopunks","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":15,"displayTitle":"Neopunks — les Frelons"},{"id":"realite-v9-crawlers-insurges","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":20,"displayTitle":"Insurgés — les Freerunners"},{"id":"realite-v9-crawlers-insurges-raising-freedom","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":21,"displayTitle":"Raising Freedom"},{"id":"realite-v9-crawlers-insurges-health-age","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":22,"displayTitle":"Health Age"},{"id":"realite-v9-crawlers-insurges-iron-revengers","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":23,"displayTitle":"Iron Revengers"},{"id":"realite-v9-crawlers-insurges-la-grande-revolution","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":24,"displayTitle":"La Grande Révolution"},{"id":"realite-v9-crawlers-insurges-green-fairy-mother","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":25,"displayTitle":"Green Fairy Mother"},{"id":"realite-v9-crawlers-insurges-mermaid-soldiers","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":26,"displayTitle":"Mermaid Soldiers"},{"id":"realite-v9-crawlers-insurges-seungli","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":27,"displayTitle":"Seungli"},{"id":"realite-v9-crawlers-insurges-native-old-blood","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":28,"displayTitle":"Native Old Blood"},{"id":"realite-v9-crawlers-insurges-insurgent-army-of-caspian-survivors","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":29,"displayTitle":"Insurgent Army of Caspian Survivors"},{"id":"realite-v9-crawlers-insurges-your-debt-your-life","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":30,"displayTitle":"Your Debt, Your Life"},{"id":"realite-v9-crawlers-insurges-black-star","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":31,"displayTitle":"Black Star"},{"id":"realite-v9-crawlers-insurges-alhaqiqa","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":32,"displayTitle":"Alhaqiqa"},{"id":"realite-v9-crawlers-motards-hell-angels","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":40,"displayTitle":"Hell Angels — Motorcycle Club"},{"id":"realite-v9-crawlers-motards-cruisers","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":41,"displayTitle":"Cruisers — Motorcycle Club"},{"id":"realite-v9-crawlers-motards-reapers-incorporated-power","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":42,"displayTitle":"Reapers Incorporated Power — Motorcycle Club"},{"id":"realite-v9-crawlers-motards-vagos","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":43,"displayTitle":"Vagos — Motorcycle Club"},{"id":"realite-v9-crawlers-motards-sons-of-silence","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":44,"displayTitle":"Sons of Silence — Motorcycle Club"},{"id":"realite-v9-crawlers-motards-sons-of-legba","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":45,"displayTitle":"Sons of Legba — Motorcycle Club"},{"id":"realite-v9-crawlers-motards-onikishi","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":46,"displayTitle":"Onikishi — Motorcycle Club"},{"id":"realite-v9-crawlers-motards-last-crows","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":47,"displayTitle":"Last Crows — Motorcycle Club"},{"id":"realite-v9-crawlers-enders","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":60,"displayTitle":"Enders — sortir du système"},{"id":"realite-v9-crawlers-enders-underwater-nation","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":61,"displayTitle":"Underwater Nation"},{"id":"realite-v9-crawlers-enders-gold-cow-kingdom","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":62,"displayTitle":"Gold Cow Kingdom"},{"id":"realite-v9-crawlers-enders-true-nations","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":63,"displayTitle":"True Nations"},{"id":"realite-v9-crawlers-enders-green-fairy-daughters","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":64,"displayTitle":"Green Fairy Daughters"},{"id":"realite-v9-crawlers-enders-green-nomads","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":65,"displayTitle":"Green Nomads"},{"id":"realite-v9-crawlers-enders-fermes-mannan","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":66,"displayTitle":"Fermes Mannan"},{"id":"realite-v9-crawlers-enders-mola-mola","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":67,"displayTitle":"Mola Mola"},{"id":"realite-v9-crawlers-enders-losttown","dataset":"realite-v9-crawlers","category":"Réalité","group":"Grande Californie & société","groupOrder":1,"subgroup":"Crawlers & Underlife","subgroupOrder":7,"pageOrder":68,"displayTitle":"Losttown"}] as Array<Record<string, any>>;
