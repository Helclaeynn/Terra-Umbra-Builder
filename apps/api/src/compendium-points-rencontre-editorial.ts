import { COMPENDIUM_POINTS_RENCONTRE_ARTICLES } from "./compendium-points-rencontre.js";

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

const TEXT_FIXES: Array<[RegExp, string]> = [
  [/\bLs points de rencontre\b/gu, "Les points de rencontre"],
  [/\blieus\b/giu, "lieux"],
  [/\bla vérité caché\b/giu, "la vérité cachée"],
  [/\bmaitres\b/giu, "maîtres"],
  [/\bmaitre\b/giu, "maître"],
  [/\bmaitresse\b/giu, "maîtresse"],
  [/\bmaitrise\b/giu, "maîtrise"],
  [/\bmaitriser\b/giu, "maîtriser"],
  [/\bmaitrisé\b/giu, "maîtrisé"],
  [/\bmaitrisée\b/giu, "maîtrisée"],
  [/\bs’entrainer\b/giu, "s’entraîner"],
  [/\bentrainement\b/giu, "entraînement"],
  [/\bdéchainé\b/giu, "déchaîné"],
  [/\bdéchainée\b/giu, "déchaînée"],
  [/\bEtats-Unis\b/gu, "États-Unis"],
  [/\bEtat-Unis\b/gu, "États-Unis"],
  [/\bA l’extérieur\b/gu, "À l’extérieur"],
  [/\bA la \b/gu, "À la "],
  [/\bA chaque \b/gu, "À chaque "],
  [/\bEn soit\b/gu, "En soi"],
  [/\ben soit\b/gu, "en soi"],
  [/\bquelque soit\b/giu, "quel que soit"],
  [/\bquelques soit\b/giu, "quels que soient"],
  [/\bNew-York\b/gu, "New York"],
  [/\bMorrghan\b/gu, "Morrighan"],
  [/\bShadiri\b/gu, "Shaediri"],
  [/\bFeeshrii\b/gu, "Feeshri"],
  [/\bRaven industries\b/giu, "Raven Industries"],
  [/\bRaven tower\b/giu, "Raven Tower"],
  [/\bMorgan brandubh\b/gu, "Morgan Brandubh"],
  [/\bestlà\b/gu, "est là"],
  [/\bl’agent peur\b/giu, "l’agent peut"],
  [/\ble soutient et l’équipement\b/giu, "le soutien et l’équipement"],
  [/\bsa propre horde\b/giu, "sa propre horde"],
  [/\bcorporatiste\b/giu, "corporatiste"],
  [/\bamerindien\b/giu, "amérindien"],
  [/\bamericaine\b/giu, "américaine"],
  [/\binterêt\b/giu, "intérêt"],
  [/\binterêts\b/giu, "intérêts"],
  [/\bextrals\b/gu, "Extrals"],
  [/\bangelus\b/gu, "Angelus"],
  [/\bdaemons\b/gu, "Daemons"]
];

const cleanText = (raw: unknown) => {
  let text = String(raw ?? "")
    .replace(/[�￾]/gu, "-")
    .replace(/>\s*(?=[A-Z])/gu, "")
    .replace(/\s+/gu, " ")
    .replace(/\s+([,.;:!?])/gu, "$1")
    .replace(/«\s*/gu, "« ")
    .replace(/\s*»/gu, " »")
    .replace(/\(\s+/gu, "(")
    .replace(/\s+\)/gu, ")")
    .replace(/([.!?])(?=[A-ZÀ-ÖØ-Þ])/gu, "$1 ")
    .trim();

  for (const [pattern, replacement] of TEXT_FIXES) text = text.replace(pattern, replacement);
  return text;
};

const breakOversized = (text: string, limit: number) => {
  const parts: string[] = [];
  let rest = text.trim();

  while (rest.length > limit) {
    const window = rest.slice(0, limit + 1);
    const candidates = [window.lastIndexOf("; "), window.lastIndexOf(": "), window.lastIndexOf(", ")];
    let cut = Math.max(...candidates);
    if (cut < Math.floor(limit * 0.55)) cut = window.lastIndexOf(" ");
    if (cut <= 0) cut = limit;
    else cut += 1;
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }

  if (rest) parts.push(rest);
  return parts;
};

const splitLongText = (raw: unknown, limit = 540) => {
  const text = cleanText(raw);
  if (!text) return [];

  const sentences = text.split(/(?<=[.!?…])\s+(?=[«“A-ZÀ-ÖØ-Þ])/u);
  const units = sentences.flatMap((sentence) =>
    sentence.length > limit ? breakOversized(sentence, limit) : [sentence]
  );
  const paragraphs: string[] = [];
  let current = "";

  for (const unit of units) {
    const candidate = current ? `${current} ${unit}` : unit;
    if (candidate.length <= limit) {
      current = candidate;
      continue;
    }
    if (current) paragraphs.push(current);
    current = unit;
  }

  if (current) paragraphs.push(current);
  return paragraphs;
};

const GUARDIAN_FIXES: Record<string, string> = {
  "Jamal Jace Jayson (J3": "Jamal Jace Jayson (« J3 » / Jcube)"
};

const repairGuardians = (section: Record<string, any>): Section => {
  const source = cleanText(section.blocks?.map((block: Record<string, any>) => block.text ?? "").join(" "))
    .replace(/^Gardiens\s*:\s*/iu, "")
    .replace(/\.$/u, "");
  const guardians = source
    .split(/\s*;\s*/u)
    .map((name) => GUARDIAN_FIXES[name] ?? name)
    .filter(Boolean);

  return {
    id: String(section.id),
    title: String(section.title),
    level: Number(section.level ?? 2),
    blocks: [table([["Gardiens"], ...guardians.map((name) => [name])])]
  };
};

const repairSection = (section: Record<string, any>): Section => {
  if (section.id === "gardiens") return repairGuardians(section);

  const blocks = (section.blocks ?? []).flatMap((block: Record<string, any>): Block[] => {
    if (block.type === "table") return [{ type: "table", rows: block.rows ?? [] }];
    return splitLongText(block.text).map(lore);
  });

  return {
    id: String(section.id),
    title: String(section.title),
    level: Number(section.level ?? 2),
    blocks
  };
};

const CURATED_DESCRIPTION_BLOCKS: Record<string, Record<string, string[]>> = {
  "points-rencontre-tour-or": {
    "dossier-mages-1": [
      "Située dans le quartier des affaires, la Tour d’or est un phare architectural dont la façade dorée illumine la nuit. Elle abrite officiellement un vaste institut académique indépendant consacré à l’éducation et à l’amélioration des méthodes corporatistes.",
      "Tous les maîtres de la Loge de Los Angeles y résident avec leurs familles, leurs Sorciers et leurs partisans, qui composent le personnel de la tour. Détruire le bâtiment reviendrait à anéantir la Loge, mais cette hypothèse paraît presque impossible tant le lieu constitue un puissant nœud magique.",
      "Les Mages installés dans la tour perçoivent les activités magiques dans un rayon d’une centaine de kilomètres, jusque dans leurs manifestations mineures. Les défenses accumulées sont telles que même un dieu ne pourrait y déchaîner toute sa puissance dans une attaque frontale."
    ]
  },
  "points-rencontre-decharge-san-diejuana": {
    "dossier-mages-3": [
      "À l’extérieur de San Diejuana, la Décharge est d’abord une véritable casse : détritus, véhicules et fragments de bâtiments s’étendent sur plusieurs kilomètres. Des préfabriqués y forment pourtant un réseau de bunkers magiques.",
      "Les familles de Mages dispersent dans les déchets des pièces et des métaux enchantés, puis élèvent des chiens et des chats modifiés par magie. Ces millions de sources minuscules dissipent la magie et les pouvoirs ennemis ; dans cet amas, nul ne sait s’il est observé ou déjà maudit par un objet voisin.",
      "Neopunks, Crawlers et autres membres de la Loge se réunissent dans un préfabriqué différent selon les décisions de Paul, pigeon artificiellement magique qui pense et agit comme un véritable oiseau. Son errance rend les réunions difficiles à prévoir.",
      "La Tour d’or décourage toute attaque ; la Décharge privilégie la fuite. Un vaste réseau souterrain complète les préfabriqués et permet de disparaître dans toutes les directions. L’isolement du site affaiblit aussi l’Hologramme, ce qui facilite l’entraînement des jeunes Mages sous la tutelle de Mithridate, président de la Loge."
    ]
  },
  "points-rencontre-grand-theatre-milo": {
    "dossier-mages-7": [
      "Le Grand Théâtre Milo se trouve dans l’un des quartiers les plus prestigieux de Los Angeles. Il appartient aux Luciano, famille qui domine la mafia italo-américaine locale en 2035. Ses rares grands spectacles remplissent la salle ; le reste du temps, celle-ci est louée.",
      "Ryan Foster, dit Faust, la réserve sans jamais s’y montrer. Une fois par semaine, elle accueille les ventes d’antiquités et de curiosités les plus prestigieuses de Californie — en réalité, les principales enchères magiques du monde.",
      "Les Mages y échangent objets, sorts, formations et renseignements. Des familles venues du monde entier suspendent provisoirement leurs querelles afin d’accroître leurs connaissances et leurs collections.",
      "La marchandise la plus chère demeure toutefois le Mageius. Comme celui-ci peut se fixer à un nouveau corps lorsque l’âme de son hôte disparaît, des êtres vivants sont vendus pour être sacrifiés. Humains, Dives, Amazones, Babayagas et autres Voyageurs porteurs d’un Mageius peuvent finir sur l’estrade.",
      "Le trafic comprend aussi des ovules ou du sperme de grands Mages, destinés à renforcer la puissance magique d’une descendance. Des Sorciers et des héritiers sont échangés ; certaines familles cèdent même leurs enfants pour obtenir l’amitié de lignées plus puissantes mais moins fécondes."
    ]
  },
  "points-rencontre-sugar-eden": {
    "dossier-angelus-9": [
      "Le Sugar Eden est le pendant angélique du First Flame. Jcube, Séraphin de Zophielle, tient ce bar d’hôtes de très grand standing. Alcools rares, marbre véritable et or sur les tables affichent un luxe ostentatoire qui compense mal son manque de discrétion et de confort.",
      "Les Angelus y viennent surtout boire la « grâce de Dieu ». Pour les autres clients, cet alcool ressemble à un simple vin d’orange ; chez un Angelus, il provoque une transe, anime la marque et éveille les pouvoirs dans une extase sans équivalent physique.",
      "L’effet ne dure qu’environ une minute, mais confère à un simple Angelus la puissance d’un Archange. L’abus peut émousser tout autre plaisir et transforme la boisson en véritable drogue.",
      "Le bar fournit aussi renseignements et contacts non angéliques afin d’aider les jeunes plumes dans leurs missions. Elynea s’y montre rarement : elle juge le lieu beaucoup trop luxueux et prétentieux."
    ]
  },
  "points-rencontre-dancing-rabbit": {
    "dossier-angelus-11": [
      "Le Dancing Rabbit occupe un secteur à la fois gouvernemental et partiellement abandonné. Il compte parmi les plus grands night-clubs de Los Angeles et communique par un tunnel secret avec l’Angel’s Table, restaurant de renommée mondiale. Seul le personnel habilité connaît ce passage.",
      "Drasko Vladic possède le club et les bureaux de son association se trouvent sous la salle. Le lieu sert aussi de quartier général officiel à la Bratva. Galya, gérante souriante et avenante, est une Humaine, mais son travail et son autorité dépassent largement le rôle de façade qu’on lui prête.",
      "L’Archange Urielle a choisi le club comme lieu de travail : elle y danse et sert chaque nuit, appréciant particulièrement Galya et son épouse Svetlana. La présence régulière de cette dernière attire parfois Elynea, qui offre ici l’une des rares occasions pour les Archanges de l’approcher.",
      "La simple proximité d’Elynea renforce les Angelus. Avec l’influence inconsciente de Svetlana, elle leur permet aussi de négocier et d’échanger plus librement hors de l’emprise de leur propre Archange. Cette forte fréquentation angélique impose une discrétion absolue : aucune manifestation surnaturelle ne doit troubler le club."
    ]
  },
  "points-rencontre-angels-never-cry": {
    "dossier-angelus-13": [
      "Les night-clubs neopunks sont souvent déplacés ou détruits par les attaques corporatives. L’Angels Never Cry, ou ANC, échappe à cette règle : ce vaste club illégal, tenu par JJN — DJ neopunk célèbre et proche de Damon Harrington, dit Red Hadès — n’a encore jamais cédé sous une attaque.",
      "La grande salle assourdissante et ses foules violentes se prêtent mal aux pourparlers. En revanche, le réseau souterrain comprend des centaines de réserves et de petites salles où Neopunks et insurgés s’organisent, entreposent leur matériel et négocient avec la pègre.",
      "Jesus Kenobi, Séraphin de Sandalphon devenu fidèle d’Urielle, protège les Angelus qui descendent négocier. Dans sa grande salle, son pouvoir lui donne une emprise partielle sur les personnes présentes.",
      "Archanges et Séraphins y sont rares. Seuls les Crawlers les plus endurcis atteignent les salles secrètes sans être refoulés par la sécurité neopunk ; Leslie Wright, par exemple, ne laisse personne approcher librement de ses guitares.",
      "Urielle vient parfois elle-même. Le plus souvent, elle envoie des mafieux russes qu’elle a manipulés ou de jeunes Angelus encore mal préparés, afin que la rudesse du lieu les endurcisse."
    ]
  },
  "points-rencontre-garage-ashford": {
    "dossier-angelus-15": [
      "Au cœur de Los Angeles, le Garage Ashford est une institution. Il fabrique encore des pièces pour les automobiles antérieures aux années 2010, désormais abandonnées par les corporations. Les collectionneurs y trouvent des composants coûteux, presque artisanaux, mais particulièrement durables.",
      "Le garage applique le même savoir-faire aux armes anciennes : révolvers et fusils peuvent être réparés ou reconstruits sur mesure. Cette activité dissimule un fragment du « saint Arsenal » de l’ordre d’Arianwen.",
      "Jack Ashford travaille pour Sœur Sacha, ou Sacha Novogvna. Sa réserve cache des véhicules et des armes destinés aux Chasseurs, exorcistes et inquisiteurs de l’Église. Il les fournit gratuitement et assure de courtes formations pour les équipements inhabituels.",
      "D’anciens bikers religieux tiennent le lieu : des moines musculeux et tatoués, toujours munis d’une clé à molette et d’une arme. Jack est lui-même une Vertu au service de l’ancien Archange Sachielle ; il équipe surtout les Angelus de Sachielle et de Zophielle intégrés aux communautés religieuses.",
      "Son crucifix masque sa nature aux observateurs inattentifs. Il apprécie peu les autres Archanges, mais aide malgré tout les Angelus qui se révèlent à lui lorsque leur demande reste compatible avec les plans de Sachielle."
    ]
  },
  "points-rencontre-purple-embers": {
    "dossier-daemons-17": [
      "Quatre lieux de débauche associés au Temple de Lilith dessinent un pentacle dont le centre indique l’emplacement exact du Purple Embers. Night-club la nuit, café le matin et bar à toute heure, il n’est pas un temple mais constitue le centre du réseau d’influence de Lilith.",
      "Aessa, duchesse daemoniaque, créa ce sanctuaire ouvert aux Daemons de la Terre après la crise de 2018, lorsque l’éveil de Sharith rendit plusieurs créatures folles. En 2031, l’Archange Camaelle tua Belphegor, autre duc de Lilith ; Aessa dut dès lors gérer seule le bar et renoncer à enquêter elle-même.",
      "Estrades de pole dance, grandes tables, alcools très sucrés et musique enchantée par des voix de Succubes composent une ambiance sensuelle. Contrairement au First Flame, les rencontres intimes n’y sont pas tarifées : tout repose sur le plaisir volontaire des participants.",
      "Les Daemons y échangent aussi sortilèges, adresses, informations et noms. Channel 666, chaîne de Nextar tenue par des serviteurs d’Astaroth, tourne sur de petits écrans.",
      "Aessa reste la personne la mieux informée du club. Elle demande rarement de l’argent : une information ou un service futur suffit généralement à payer ce qu’elle révèle."
    ]
  },
  "points-rencontre-first-flame": {
    "dossier-daemons-19": [
      "Le First Flame occupe l’un des sept bars et night-clubs d’une rue abandonnée, depuis rachetée par des associations. Dans une ambiance chic et tamisée, ce bar d’hôtes propose la compagnie tarifée d’hommes et de femmes chargés de faire parler, boire et rire les clients ; la prostitution est légale en Californie en 2035.",
      "Rideaux et salles privées garantissent une relative intimité. Le lieu sert de référence aux Daemons de Belial, même s’il est mal vu d’y mener des affaires daemoniaques en groupe. Des Angelus de la rue voisine viennent aussi s’y changer les idées.",
      "Tous les hôtes sont des démons de Belial, mais ils assistent volontiers les autres serviteurs divins. Le bar n’est ni un temple ni un territoire neutre et subit parfois des attaques. Belial venge rarement Moloch elle-même ; les nombreuses personnes qui lui doivent un service s’en chargent à sa place.",
      "Parce que Belial est la reine des dieux, le First Flame reste apprécié bien au-delà de sa faction. Les Daemons qui veulent négocier dans un cadre calme et discret le préfèrent souvent au Purple Embers."
    ]
  },
  "points-rencontre-cabinet-faith": {
    "dossier-daemons-21": [
      "First Lawyers Incorporated — FiLaw ou FLInc — possède le cabinet Faith. L’établissement n’a pas les dimensions industrielles de sa corporation, mais jouit d’une immense renommée. Il se trouve dans le quartier des Lois, qui constitue en pratique le territoire de FLInc.",
      "Belyandra Queen, cofondatrice du cabinet et vice-présidente officielle de la corporation, y travaille avec un personnel mêlant Humains et non-Humains. Demona Prince, l’une de ses duchesses les plus loyales, paraît parfois n’être qu’une secrétaire ; elle est pourtant une avocate qui traite des dossiers majeurs.",
      "Le bureau de Belyandra sert de salle du trône. Aux étages supérieurs, les prophètes du feu, de la domination, de la destruction et de la puissance disposent chacun d’un bureau. Leur présence n’est pas permanente : occuper la pièce suffit à activer le lien symbolique avec leur trône.",
      "Les Daemons ne viennent pas consulter Belial directement, sauf urgence ou ignorance complète du protocole. Contourner sa propre hiérarchie ou sa divinité peut offenser à la fois cette dernière et la reine, dont on gaspille le temps. Les ducs de Belial, en revanche, sont régulièrement invités dans son bureau."
    ]
  },
  "points-rencontre-night-feathers": {
    "dossier-daemons-23": [
      "Le Night Feathers se trouve à quelques minutes du quartier abandonné de Veronica Silver. Une moitié du bar souterrain relève de la zone sans loi, l’autre d’un quartier gouvernemental, sous une ancienne caserne de recrutement. Son entrée, dissimulée dans une ruelle trop étroite pour une voiture, est presque impossible à découvrir par hasard.",
      "Ce bar de l’Association distribue des armes dans des casiers aux Chasseurs qui présentent l’insigne et le rang requis. Tout y paraît ancien et miteux, sans l’être réellement. Les conversations restent basses et méfiantes.",
      "Barret Kelvin, ou Barrachiel, tient le comptoir. Acide et moqueur, il aide pourtant toujours les nouveaux venus. Des Observateurs se mêlent aux Chasseurs ; certains prennent la forme de corneilles.",
      "La communauté se concentre davantage sur l’occulte que sur les Elfes ou les Extraterrestres. Hunt15 y jouit d’un grand prestige. De faux articles de journaux racontent ses grandes chasses, tandis que des palmarès plus absurdes — paroles du Faucheur noir, apparitions de la blonde de Cypher ou mésaventures d’Alisa — humanisent ses membres célèbres.",
      "Morrighan tient parfois elle-même le bar sous le nom de Mary Gaine. Sa propre fille Ciara l’y a déjà draguée sans la reconnaître."
    ]
  },
  "points-rencontre-raven-corporation-hq": {
    "dossier-daemons-25": [
      "Raven Industries siège dans un immense gratte-ciel noir surnommé Black Tower ou Raven Tower. La corporation y prend ses décisions, y loge ses principaux directeurs et certains proches de Morgan Brandubh, tandis que ses meilleurs ingénieurs développent aux étages inférieurs les armes et véhicules du futur.",
      "Les niveaux supérieurs accueillent la politique corporative puis les grandes salles où Morrighan reçoit les Mages de sa Loge de New York lorsqu’ils viennent à Los Angeles. La tour forme ainsi une Loge secondaire new-yorkaise.",
      "Sa sécurité est surtout humaine, mais sa capacité de représailles suffit à maintenir une guerre froide avec la Loge de Los Angeles. Même sans sort, Raven peut frapper les familles, les alliés et les réseaux de ses Mages ; Morgan peut en outre invoquer Daghain.",
      "Morrighan est une déesse et la tour son grand Temple. Prêtres, grands corbeaux et ducs daemoniaques y travaillent. Des ascenseurs réservés conduisent ses agents vers des interlocuteurs toujours plus prestigieux selon leur rang, jusqu’à la déesse elle-même.",
      "Un agent qui vient sur place peut obtenir renseignements, équipement, soins et bénédictions aux frais de Raven. Celui qui reste à distance ne reçoit presque rien : la présence dans la tour entretient autant la hiérarchie que la dépendance au réseau de Morrighan."
    ],
    "dossier-rocreens-aliens-51": [
      "Pour les Extrals, la Black Tower représente une puissance terrienne capable d’arrêter un escadron de l’AIDH ou des Ad’rak de l’Armée noire avec les seules technologies humaines de 2035.",
      "Rached Kelley, ou Raysh’kan Feeshri, y réside comme directeur de sous-branche. Son rang reste inférieur à celui d’un directeur de branche ou d’un vice-président, mais il compte parmi les plus hauts cadres de Raven.",
      "Clone du plus grand empereur rocréen connu, il possède des pouvoirs exceptionnels qui fondent l’influence de sa lignée. Il dirige les Feeshri d’une main de fer et cherche à détruire les Shaediri pour s’emparer de leur marché noir.",
      "Raysh’kan obéit sans désir de vengeance à Morrighan, Seigneur-Général qui anéantit autrefois son empire. Le rencontrer offre aux Extrals une voie dangereuse mais légale : il agit avec l’accord de l’AIDH, travaille officiellement pour Morgan Brandubh et oppose sa richesse déclarée aux activités clandestines des Shaediri."
    ]
  },
  "points-rencontre-runyon-canyon": {
    "dossier-loups-garous-27": [
      "Runyon Canyon fut largement abandonné pendant la grande crise économique et rendu plus aride par le réchauffement climatique. Lorsque Tuatha acquit une influence considérable à Hollywood, la corporation racheta le parc et lui rendit sa verdure. Elle le loue au gouvernement et à la municipalité ; le public y accède, sauf lors de certains tournages.",
      "Depuis longtemps, ce parc naturel sert de lieu de rencontre aux Loups-Garous de Californie. Les espaces sauvages sont trop vastes pour se retrouver aisément ; un parc urbain offre le meilleur compromis entre nature et accessibilité. Chaque faction y cache des « tanières », en réalité proches de bunkers.",
      "La solidarité locale l’emporte souvent sur les guerres de Pelage, car les Garous restent peu nombreux. Les tanières abritent les recherchés, les blessés et ceux qui perdent le contrôle.",
      "Des médecins sans faction y vivent des services de leurs patients. Autrefois parias, ceux que l’on surnomme « nudistes » ou « galeux » ont acquis un véritable prestige et assurent désormais la liaison entre les meutes rivales.",
      "Les Garous viennent chercher le contact physique que l’Holonet ne remplace pas. Soins, faux papiers, faux Logifates et caches d’armes complètent les services, avec notamment des fléchettes anti-Wendigo et des seringues contre la contamination faramine."
    ]
  },
  "points-rencontre-ivory-fangs": {
    "dossier-loups-garous-29": [
      "Ivory Fangs est une base de l’Independent Californian Army exclusivement occupée par des forces spéciales, dont l’équivalent californien des Bérets verts. La colonelle Benedicte Vilhelmsen, dite Thorunn, y commande tout en dirigeant les Pelages blancs.",
      "Les pôles de recrutement et de surveillance offrent une porte d’entrée discrète aux Garous. Tous les Pelages blancs portent une tête de Fenrir tatouée dans le dos, de manière ostensible ou presque invisible. La visite médicale permet au personnel initié de les orienter sans question vers un Alpha ou un Meneur.",
      "Thorunn emploie ses Garous comme soldats et gradés. Elle combat les Pelages gris, les Faramines et la contamination de Vhodhal. L’autonomie de la base et ses liens secrets avec l’armée d’Andrea Shield lui permettent de prêter des armes à des alliés non militaires et d’affecter des soldats humains à des objectifs propres aux Garous.",
      "Eversor assure une partie des convois à travers la Grande Réserve. Les Crawlers et Chasseurs les plus atypiques évitent toutefois la base s’ils ne veulent pas subir la discipline des troupes d’élite, jusqu’au crâne rasé et aux journées de pompes."
    ]
  },
  "points-rencontre-wild-angel-wolf": {
    "dossier-loups-garous-31": [
      "Le Wild Angel Wolf se trouve à Angeltown, village de bikers contrôlé par les Hells Angels et quartier général de leur chef Arthur Bartram. Isolé sans être trop éloigné de Los Angeles, le bar fut construit notamment par Frederic Jackelston, dit Jackal, Maddox Sharp, dit Moose, Arthur Bartram, dit Bear, et Ephraim Bahal, dit Bull, tous vétérans de la guerre de 2022-2028.",
      "De nombreux Garous des Pelages blancs sont restés à Angeltown. Les Ulfhednars, leur élite aux tendances néonazies, pratiquent la Dévoration malgré l’interdit qui réserve normalement cet acte aux Grands Meneurs. Thorunn appartenait à ce groupe avant de remplacer le Meneur précédent au Moyen Âge.",
      "Le bar facilite les contacts avec les Pelages blancs sans imposer le cadre militaire d’Ivory Fangs, mais atteindre Angeltown exige de traverser un territoire dangereux.",
      "Bartram est en réalité un Berserk d’Aèr. Le lieu accueille donc aussi Berserks et Lycans d’Aèr. Ces communautés et les Garous terrestres se côtoient comme alliés sans connaître leurs véritables origines respectives ; seuls Bartram et Thorunn comprennent la situation et gardent le silence. Thorunn vient régulièrement s’y détendre.",
      "Les échanges portent surtout sur le matériel et les prisonniers. Les Ulfhednars n’hésitent pas à dévorer les Alphas ou Meneurs ennemis capturés après qu’ils ont attaqué leurs meutes."
    ]
  },
  "points-rencontre-jadecenter-palameta": {
    "dossier-orques-gobelins-35": [
      "Le Syndicat de Jade utilise rarement les Silcenters, bars-hôpitaux destinés aux Exilés d’Aèr protégés par le Conseil. Orques et Gobelins jugés « nuisibles » en sont largement exclus. Les Jadecenters leur offrent un équivalent plus clandestin, accessible par une entrée révélée comme la partie cachée d’un bar de Chasseurs.",
      "Habituellement, des Gobelins gèrent les affaires tandis que des Orques assurent la sécurité. Palameta inverse cette répartition : Alsha, fille du légendaire Ashorn, dirige le café et plus de deux cents Gobelins le défendent.",
      "Les tireurs sont installés dans les aérations, placards et autres cachettes aménagées. Ils peuvent abattre un perturbateur sans que la clientèle voie la moindre arme ; le lieu conserve ainsi l’apparence d’un café underground convivial tenu par une hôtesse séduisante.",
      "Palameta sert aux retrouvailles familiales, mais constitue surtout l’un des principaux centres du Syndicat de Jade. Matériel du marché noir magique, recommandations et rencontres s’y négocient. Atreesha, Martin Green, Ashorn, Grim ou Shiloh Floyd peuvent y apparaître.",
      "Beaucoup de Crawlers orques travaillent pour Alsha sans le savoir. Elle exige de ses subordonnés qu’ils l’appellent « mère » et jouent les fils obéissants ; ses récompenses et ses punitions donnent un sens très concret aux expressions « donner le sein » et « fesser »."
    ]
  },
  "points-rencontre-green-health": {
    "dossier-orques-gobelins-37": [
      "Green Health est une chaîne de salles de sport occupant chacune un immeuble de cinq étages. Quatre salles se partagent chaque niveau, sauf le rez-de-chaussée réservé à une piscine olympique et aux saunas. Le toit accueille un terrain de football entouré d’une piste de course.",
      "L’établissement de Fall Avenue fait face au centre de recrutement des Independent Californian Marines. Le général Ashorn possède la salle et l’ensemble de la chaîne ; d’anciens militaires blessés ou traumatisés y encadrent les clients.",
      "Ashorn fut le supérieur direct de Siobhain Nic Siridean et le premier officier à l’exposer au danger en lui accordant toute sa confiance. En retour, Tuatha finance Green Health par sa branche Santé et Bien-être, et obtient pour ses acteurs et cascadeurs des formateurs de premier ordre.",
      "Les Orques sont rapidement devenus la majorité des habitués. Des étages leur sont réservés ; près de la piscine, certaines salles utilisent des boues traditionnelles pour régénérer leur peau épaisse et leurs muscles denses. Des compléments alimentaires adaptés entretiennent aussi leur pilosité et leur regard.",
      "La culture orque terrestre reste individualiste : les communautés, rares et isolées, ont longtemps vécu parmi d’autres peuples. Les Orques éprouvent donc peu le besoin de se rassembler, mais deviennent très compétitifs lorsqu’ils le font."
    ]
  },
  "points-rencontre-fuckalifornia": {
    "dossier-orques-gobelins-39": [
      "Le Fuckalifornia se cache sous le quartier abandonné proche de la plage. En cas de fusillade ou de catastrophe, ses souterrains servent aussi de refuge à la population locale. Désormais fréquenté par les Neopunks, le bar fut fondé par des insurgés et traite l’anarchisme comme une quasi-religion. Kristian Morales, dit Kran’Rag, finance largement son entretien.",
      "Le décor ressemble à un dépotoir couvert de tags, mais le lieu est très fréquenté. Un dédale de couloirs à angles droits remplace la grande salle. Sur la petite scène, The Void — groupe dont Kristian est le batteur — expérimente et se produit ; Darlene y a souvent été vue.",
      "Le militantisme agressif du bar sanctionne les paroles mal choisies. Le lieu sert aussi de repaire aux Greenvoids, gang exclusivement orque dirigé par Kristian et réputé parmi les Crawlers, notamment les assassins.",
      "Les Greenvoids refusent Fixers, Blanchisserie et autres intermédiaires. Ils méprisent les mafias, à l’exception du Syndicat de Jade, rejettent les corporations et ignorent le gouvernement. Ils fournissent aide, équipement et soutien à ceux qui veulent abattre les agents d’un système qu’ils jugent corrompu, quelles que soient leurs motivations réelles."
    ]
  },
  "points-rencontre-dream-vladic-tower": {
    "dossier-orques-gobelins-41": [
      "La Dream Vladic Tower fut l’un des grands monuments de l’après-guerre, avant les tours corporatistes et le Neovatican. Construite en deux semaines comme démonstration de force des ouvriers russes expatriés, elle devait officiellement loger une population importante.",
      "Les normes corporatives puis gouvernementales déclarèrent pourtant l’édifice inhabitable et structurellement instable. Vladic Association reçut l’ordre de le détruire sans jamais l’exécuter. Drasko Vladic savait dès l’origine que personne n’y habiterait : dans un quartier abandonné contrôlé en partie par la mafia russe, la tour devait servir à d’autres usages.",
      "Prison, salles de torture, reconditionnement de prostituées et cache d’armes occupent le bâtiment. Grigoria Ravinsky, dite Grim, en assure la garde. Cette Ukrainienne du cercle personnel de Drasko compte, avec Zoya Ryukana, parmi ses proches malgré sa récente sortie de prison.",
      "À moitié Fléau, Grim aide néanmoins les Orques à combattre les aberrations et les Fléaux mineurs. Elle cache Turuhoken, katana scellé qui renferme un Fléau mineur qu’elle considère comme son frère.",
      "Elle offre son sang aux Orques prêts à en supporter la douleur afin d’accroître leur force, puis leur confie des missions contre les Fléaux. Ceux qui refusent cet engagement l’intéressent à peine davantage que les Gobelins."
    ]
  },
  "points-rencontre-military-next-academy": {
    "dossier-orques-gobelins-43": [
      "La Military Next Academy est une école militaire gouvernementale qui forme rigoureusement les futurs officiers des armées et des corporations. Sa directrice, Kimberley Vasquez — Kiarn Kay — fut une subordonnée et un soutien proche de Rick Scott, numéro deux d’Ushkoll Security.",
      "Les corporations financent l’établissement. Lorsqu’une entreprise ouvre sa propre académie et réduit son soutien, les diplômés mécontents de la MNA alimentent volontiers l’anticorporatisme et l’insurrection ; les ravages qui suivent convainquent généralement les financeurs de rétablir leur budget.",
      "Tous les instructeurs sont des Orques de la Horde divine, clan qu’Ashorn amena d’Aèr. La tradition les fait descendre des guerriers laissés par une divinité orque lorsqu’elle quitta ce monde : héritiers de héros légendaires, ils cherchent avant tout à se montrer dignes d’Ashorn.",
      "Tout Orque peut se présenter à Kiarn pour être formé et équipé, en échange d’une dévotion totale envers Ashorn. L’académie entretient des liens étroits avec Ushkoll, Tortoise et Pixy Security, ainsi qu’avec les armées californienne et américaine.",
      "Derrière l’école se cache une faction de Chasseurs d’élite capable de rivaliser avec la Chasse Fantastique de Titania. Ses guerriers refusent les proies insignifiantes et considèrent l’admission dans la Horde divine comme un honneur sans égal."
    ]
  },
  "points-rencontre-space-union-aidh": {
    "dossier-rocreens-aliens-45": [
      "L’AIDH est la principale autorité militaire de la galaxie. Intrinsèquement spéciste, elle défend exclusivement l’Humanité au moyen d’armées immenses affectées à ses secteurs d’influence.",
      "Les espèces non humaines restent tolérées dans les secteurs protégés et une petite communauté humaine suffit parfois à déclencher cette protection. Les peuples pleinement alliés, notamment certains Mo’sen ou Thalsios situés aux frontières, bénéficient aussi d’un statut particulier.",
      "La singularité de la Terre exige un Seigneur-Général dédié : Lisa Erédhès commande l’armée locale, contrôle l’entrée des Extrals dans le système solaire, puis autorise ou refuse leur accès à la planète.",
      "Le GAAC, force politique de l’union des peuples extrals, possède un bureau dans la base californienne. Les flux atmosphériques sont réglementés ; les principaux spatioports restent en Antarctique et dans les déserts australiens afin de limiter la pression exercée sur l’Hologramme.",
      "Space Union sert de corporation écran civile à l’AIDH et gère l’accès à la base lunaire. Les Extrals peuvent ainsi passer pour des touristes Terre-Lune. Comme la Lune constitue son territoire corporatif, le contrôle des visas lunaires permet aussi d’administrer discrètement les entrées et sorties de la Terre."
    ]
  },
  "points-rencontre-shaediri": {
    "dossier-rocreens-aliens-47": [
      "Le terme « Extral » désigne les êtres extraterrestres expatriés sur Terre. Ils se répartissent en trois grandes catégories : officiels, natifs et illégaux. L’AIDH et le GAAC surveillent les deux premières afin qu’elles ne menacent pas la population terrienne.",
      "La Terre ne s’adapte pas à leurs besoins : les visiteurs doivent s’acclimater, parfois au prix d’une espérance de vie réduite, notamment chez les Thalsios, les Rocréens ou les Talass. Les illégaux ne disposent d’aucune protection ni voie d’intégration.",
      "Le clan Shaediri s’imposa donc à Los Demonos, sous Los Angeles, et participa à la création du marché noir actuel. Celui-ci ne vend pas seulement des technologies importées : conseils et services permettent aux Extrals clandestins de survivre sans s’exposer.",
      "Les Shaediri descendent de peuples rocréens asservis puis libérés lors de la chute de leur empire. Réfugiés sur Terre, ils défendent les opprimés et ont protégé des Greys, Orpacyors, Losus ou Ad’rak venus de communautés persécutées. Des espèces ennemies dans la galaxie coopèrent ainsi sur Terre.",
      "Le clan refuse les dykals et utilise des points de crédit. Chaque nouvel arrivant reçoit une réserve qu’il rembourse plus tard en services ou en obligations ; le solde peut évoluer selon les besoins. Ce réseau fait des Shaediri la faction extrale la plus influente de la planète."
    ]
  },
  "points-rencontre-feeshri": {
    "dossier-rocreens-aliens-49": [
      "L’Empire azuré, ou clan Feeshri, est le vestige de l’ancien empire rocréen et conserve encore une influence écrasante sur plusieurs mondes. Sa partie du marché noir exclut les Shaediri mais reste ouverte aux autres Extrals. Les technologies proposées ciblent surtout la physiologie, les pouvoirs et le patrimoine génétique des Feeshri.",
      "Leur armement surclasse largement celui des Shaediri. Le clan sert de relais aux G-corporations, que l’AIDH, le GAAC et les Shaediri empêchent d’approcher les entreprises terriennes. Il collabore aussi ponctuellement avec les Roesis, auxquels le GAAC interdit toute implantation sur Terre.",
      "Tous les Feeshri reconnus occupent des positions de cadre, disposent d’une grande richesse ou exercent une influence visible dans la Réalité. Les autres sont traités comme des parias. Venus de l’extérieur de la Terre, ils ne deviennent ni Crawlers ni Chasseurs, contrairement aux Shaediri, natifs de la planète à environ 95 %.",
      "Leur santé reste difficile à maintenir sans équipement adapté. Leurs dons psychiques rivalisent toutefois avec ceux de l’ordre Scytheri : les armes feeshri sont des dispositifs mentaux qui amplifient ces pouvoirs plutôt que de tirer des projectiles ou de l’énergie."
    ]
  }
};

const repairArticleSection = (articleId: string, section: Record<string, any>): Section => {
  if (section.id === "gardiens") return repairGuardians(section);
  const curated = CURATED_DESCRIPTION_BLOCKS[articleId]?.[String(section.id)];
  if (!curated) return repairSection(section);
  return {
    id: String(section.id),
    title: String(section.title),
    level: Number(section.level ?? 2),
    blocks: curated.map(lore)
  };
};

const HUB_SECTIONS: Section[] = [
  {
    id: "definition",
    title: "Principe",
    level: 2,
    blocks: [
      lore(
        "Les points de rencontre paraissent ordinaires, mais occupent une place essentielle dans les communautés qu’ils représentent. Bars, sièges sociaux, clubs, bases, salles de spectacle ou quartiers entiers servent de refuge, de relais et de terrain diplomatique."
      ),
      lore(
        "La plupart restent accessibles aux Humains profanes. Ceux-ci voient les mêmes clients et les mêmes activités de façade, sans disposer des codes qui révèlent les réseaux de Vérité présents derrière les habitués."
      )
    ]
  },
  repairSection(COMPENDIUM_POINTS_RENCONTRE_ARTICLES[0].sections[1])
];

const MAGIC_CASINO_SECTIONS: Section[] = [
  {
    id: "dossier-mages-5",
    title: "Rôle pour Mages",
    level: 2,
    blocks: [
      lore(
        "Les casinos de la Grande Réserve se dressent à ses frontières, dans les déserts rocheux, les forêts ou sur les collines, souvent derrière un lac artificiel peu profond. Ces immenses bâtiments sont à la fois des portes d’entrée et des forteresses où se concentre l’essentiel du dispositif local de Tala Corporation."
      ),
      lore(
        "Le « M », ainsi nommé parce que le bâtiment en dessine la forme, compte parmi les plus vastes et les plus fréquentés. Roowinu, Amérindien micmac, le dirige depuis sa construction extrêmement rapide par Tala Corporation ; des milliers de touristes y passent."
      ),
      lore(
        "Sa sécurité et son isolement en font le grand lieu de négociation de la pègre amérindienne dirigée par Muna. Gundrivers, représentants des mafias italienne et russe, et émissaires des cartels y négocient leurs activités avant de pouvoir agir dans la Réserve."
      ),
      lore(
        "Le M abrite aussi le quartier général de la Loge de la Grande Réserve. Mages et alliés surnaturels s’y rencontrent ; Talatuwa, meneuse des Pelages sombres, y consulte notamment Muna au sujet de ses activités insurrectionnelles. Réalité criminelle et diplomatie de Vérité s’y confondent."
      ),
      lore(
        "La Loge utilise le casino pour contourner les interdictions de Tala, coordonner la défense magique de la Réserve contre les Pelages roux et les Loges ennemies, et recueillir les renseignements obtenus par la sécurité corporative locale."
      )
    ]
  },
  {
    id: "dossier-loups-garous-33",
    title: "Rôle pour Loups-garous",
    level: 2,
    blocks: [
      lore(
        "Pour les Pelages sombres, le M offre un territoire protégé où rencontrer la Loge, négocier sans exposer directement leurs réseaux et préparer la défense de la Grande Réserve. Cette coopération vise en particulier les Pelages roux et les adversaires magiques."
      ),
      lore(
        "Les informations remontées par la sécurité de Tala profitent donc autant à la Loge qu’aux Pelages sombres. Le casino sert de charnière entre une corporation qui ne tolère pas toutes leurs méthodes et les factions clandestines qui contribuent pourtant à protéger son territoire."
      )
    ]
  },
  repairGuardians(
    COMPENDIUM_POINTS_RENCONTRE_ARTICLES.find(
      (article) => article.id === "points-rencontre-magic-casino"
    )!.sections.find((section: Record<string, any>) => section.id === "gardiens")!
  )
];

export const COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES =
  COMPENDIUM_POINTS_RENCONTRE_ARTICLES.map((article) => {
    if (article.id === "verite-points-rencontre") return { ...article, sections: HUB_SECTIONS };
    if (article.id === "points-rencontre-magic-casino") {
      return { ...article, sections: MAGIC_CASINO_SECTIONS };
    }
    return {
      ...article,
      sections: (article.sections ?? []).map((section: Record<string, any>) =>
        repairArticleSection(String(article.id), section)
      )
    };
  }) as Array<Record<string, any>>;
