import { applyCompendiumPnjRepairs as applyBaseCompendiumPnjRepairs } from "./compendium-pnj-repairs-base.js";

type J = Record<string, any>;
type A = J & { id: string; status?: string; rebuildV2?: boolean; sections?: J[] };

function setOrganisation(byId: Map<string, A>, id: string, paragraphs: string[]) {
  const article = byId.get(id);
  if (!article) throw new Error(`Réparation Crawlers classiques · article absent: ${id}`);
  const section = (article.sections ?? []).find((value) => {
    const sectionId = String(value?.id ?? "").toLowerCase();
    const title = String(value?.title ?? "").toLowerCase();
    return sectionId === "organisation" || title === "organisation";
  });
  if (!section) throw new Error(`Réparation Crawlers classiques · section Organisation absente: ${id}`);
  section.blocks = paragraphs.map((text) => ({ type: "p", text }));
  article.status = "canon_enrichi";
  article.rebuildV2 = true;
}

function repairClassicCrawlerOrganisations(byId: Map<string, A>) {
  setOrganisation(byId, "realite-v9-crawlers-deathrunners", [
    "Les « DeathRunners », ou « Mercs », sont les Crawlers engagés lorsqu'il faut mener des actions plus percutantes. Là où les Fixers enquêtent et négocient, où les Neurodivers travaillent dans le virtuel et l'informatique, où les Gundrivers commercent et transportent, où les Neopunks agissent par idéologie et où les Meditechs soignent ou réparent, le DeathRunner est là pour tuer, capturer, tabasser, torturer ou, dans la version la plus douce de ses activités, intimider. Ce ne sont ni des tendres ni des « gentils ».",
    "La Blanchisserie, dirigée par Ryan Isaiah Burton, est la plus ancienne institution liée aux DeathRunners, aux Mercs et plus particulièrement aux Voidrunners, les assassins. Elle fournit toute la logistique nécessaire aux missions, surtout les assassinats et prises d'otages : renseignements sur les victimes, transport, puis nettoyage des lieux. Ses agents changent draps, moquettes, rideaux et peinture, brûlent ce qu'ils ne peuvent nettoyer et veillent à ne laisser ni douille, ni cheveu, ni autre indice. Lorsqu'elle ne fait pas disparaître totalement les preuves, elle peut au contraire en fabriquer en déposant cheveux, douilles et empreintes d'un suspect que l'on souhaite faire accuser. Elle peut aussi effacer casiers judiciaires, identités et fausses identités, et compliquer l'accès au Logifate sans toutefois pouvoir l'effacer.",
    "En échange de ce réseau, la Blanchisserie prélève une part importante des primes et demande un abonnement mensuel. Ne pas payer est particulièrement dangereux : elle peut alors poser un contrat sur le mauvais payeur. C'est aussi un réseau d'information et de surveillance à double tranchant : dès qu'un Crawler y entre, il ne peut pratiquement plus rien lui cacher et toute information à son sujet peut être vendue à un autre Crawler qui en a besoin. Ses liens étroits avec les mafias et des agences gouvernementales conduisent certains à la considérer comme une sorte de CIA officieuse.",
    "Le Fixweb est le réseau des Fixers. Malgré son nom, ce n'est pas un réseau de l'Holonet : il repose sur le bouche-à-oreille et se tisse depuis 2030 dans les diners, nightclubs et bars, surtout dans les quartiers abandonnés. Chaque Fixer protège son territoire contre les rivaux et une répartition géographique s'est progressivement installée ; Los Angeles compte une vingtaine de grands noms, dont Adam et Brittany. La réputation est essentielle : les commanditaires approchent les Fixers parce qu'ils ont entendu parler d'eux, et les Fixers recrutent de la même manière. Une équipe qui échoue dégrade la réputation du Fixer, qui reçoit alors moins de contrats et devient moins attractif pour les Crawlers.",
    "Les DeathRunners peuvent aussi se rendre eux-mêmes dans les Snoopybars, mais surtout lorsqu'ils manquent d'argent ou de renommée : venir y solliciter du travail est humiliant et les Fixers en profitent pour les payer le moins possible. Leur autre grand lieu de rendez-vous est le Big Black Market, ou BBM. Chaque mégacité possède son BBM, présidé par un mafieux souvent élu par le syndicat du crime organisé.",
    "L'accès aux BBM est sécurisé et tous les Crawlers n'y entrent pas. Ils peuvent occuper d'immenses hangars ou des portions entières de métro réaménagées. On y vend des produits ordinaires à prix réduit, mais surtout des biens interdits, soumis à autorisation, restrictions ou traçabilité : augmentations plus dangereuses, armes de guerre non approuvées par le gouvernement californien, IA efficaces mais invasives ou très avancées mais instables. Les Mercs y trouvent également des holophones crackés, associés à de fausses identités et de faux comptes bancaires qui, lorsqu'ils sont tracés, renvoient vers les victimes de l'usurpation et non vers le Crawler. Le BBM sert aussi d'espace d'échange de missions et de matériel entre fournisseurs. Il est extrêmement dangereux : le simple soupçon qu'une personne soit un agent gouvernemental peut entraîner son exécution. Comme les concerts Neopunks, il change régulièrement de position.",
    "Enfin, les DeathRunners fréquentent les Black Clinics des Meditechs. Pour eux, soins et réparations sont presque incontournables : contrairement à un Fixer ou à un Neurodiver, un Merc revient rarement d'une mission sans avoir encaissé de coups. Ces cliniques sont faciles à trouver, malgré le matériel et les produits rares qu'elles abritent, car des dizaines de personnes privées des soins gouvernementaux ou corporatifs en dépendent. Cette utilité les protège en partie : les Crawlers évitent généralement de les piller et les traitent presque comme des lieux sacrés.",
    "En résumé, les DeathRunners sont les combattants des Crawlers : ils passent à l'action et encaissent à la place des autres. Ils sont généralement plus forts, plus athlétiques et plus lourdement armés. Leur passé est souvent militaire et leur donne des savoirs tactiques, notamment la compréhension des signes manuels. Leur équipement suffit souvent à intimider les citoyens ordinaires, mais ils restent humains et deviennent rapidement incapables de combattre s'ils sont blessés ou terrifiés."
  ]);

  setOrganisation(byId, "realite-v9-crawlers-neurodivers", [
    "Les Neurodivers paraissent extrêmement divisés et indépendants. En 2035, alors que l'Holonet n'existe que depuis cinq ans, certains n'ont même jamais croisé consciemment un autre Neurodiver dans la rue. Il n'existe ni grand salon du Neurodrive ni centre officiel où les recruter.",
    "Les Holobars remplissent en partie ce rôle. L'Holonet est vaste, neuf et florissant ; son environnement 3D, très réaliste, accueille des forums et des chats où les Neurodivers ont leurs habitudes. Pour ceux capables de « plonger » suffisamment profondément — on « surfait » sur Internet, on « plonge » dans l'Holonet — les « Abyss » constituent leurs principaux lieux de rencontre. Des milliers de sites et salons existent, le plus souvent éphémères : une petite salle, peu de décor, une discussion, puis l'environnement est reconverti. Certains lieux persistent, comme le « Saloon », espace sombre où se rassemblent les Voidrunners, assassins Neurodivers qui ciblent des noms et les détruisent en groupe. D'innombrables espaces plus ordinaires servent également de lieux de rencontre.",
    "Les Neurodivers utilisent aussi les lieux classiques des Crawlers, notamment la Blanchisserie et les Snoopybars pour les contrats. Un Neurodiver est un atout difficile à négliger et, en 2035, les bons spécialistes sont encore peu nombreux et vivent rarement vieux.",
    "Les Cybercafés constituent l'autre grande infrastructure de la communauté. Équipés de connexions « Neurodrive », c'est-à-dire d'une liaison directe entre l'Holonet et le cerveau, certains alignent des centaines de corps inanimés plongés en connexion, tandis que les salles de réalité virtuelle destinées au grand public sont moins austères. Les Neurodivers les apprécient parce qu'il est beaucoup plus difficile de les y repérer que chez eux ou dans le sous-sol d'une Black Clinic.",
    "Les Cybercafés permettent aussi d'échanger des données sans passer par l'Holonet : un Neurodiver peut laisser des informations dans la console utilisée, équivalent de l'ordinateur, afin que le collègue qui prendra ensuite sa place sur la même machine les récupère sans connexion. Certains commanditaires utilisent ce procédé pour contourner les Fixers et leurs frais ; le trafic de données mémorielles passe également largement par ces établissements.",
    "Loin de l'image de geeks asociaux, les Neurodivers forment généralement une communauté très soudée. Ils se connaissent au moins de réputation et par leurs pseudonymes. Certains portent des tenues moulantes proches de combinaisons de plongée : la pression neurale simule une pression réelle sur le corps, échauffe nerfs et muscles, et ces combinaisons servent à les refroidir tout en limitant écrasements et engourdissements.",
    "Ils possèdent souvent des armes, mais leur formation martiale est limitée et leur cerveau subit une pression constante. Les armes de tir exigent une acuité visuelle que tous n'ont plus sans augmentation dédiée ; ils privilégient donc souvent couteaux électriques et matraques, afin de surcharger les systèmes adverses puis tenter un hack de proximité. Les heures passées allongés et inertes réduisent souvent leur masse musculaire et osseuse, ce qui les rend physiquement reconnaissables."
  ]);

  setOrganisation(byId, "realite-v9-crawlers-meditechs", [
    "En 2035, les Meditechs travaillent à la fois dans le soin et la réparation : chez eux, les deux domaines vont ensemble. Même issus d'une formation médicale, ils touchent souvent à la mécanique, et les profils venus de la mécanique acquièrent inversement des compétences médicales. Il n'existe pratiquement pas de pur mécanicien ou de pur médecin chez les Crawlers ; ceux qui auraient le luxe de rester aussi spécialisés et conformes travailleraient plutôt dans une corporation.",
    "Le Big Black Market est essentiel aux Meditechs. Tous les Crawlers n'y ont pas accès : ces marchés sécurisés occupent de vastes hangars ou des portions de métro entièrement réaménagées. Ils proposent des produits courants à prix réduit mais surtout des biens interdits, réglementés ou normalement soumis à traçabilité, notamment des augmentations dangereuses, des armes de guerre non approuvées par le gouvernement californien, ainsi que des IA invasives ou avancées mais instables. Les Meditechs y trouvent le matériel que les mégacorporations pharmaco-médicales et industrielles se réservent ; c'est l'un des meilleurs moyens, pour ces artisans du corps transcendé, de se fournir sans licence.",
    "Les Meditechs s'organisent surtout autour des Black Clinics. Ce sont des ateliers-cliniques où ils réparent des objets, soignent les blessures, conservent des organes, perfectionnent des armes, cultivent des plantes, impriment des pièces, fabriquent des véhicules et peuvent opérer à cœur ouvert. Tous ne sont évidemment pas aussi compétents dans chaque domaine, de la même manière qu'un Merc n'est pas forcément aussi bon au tir qu'au corps à corps.",
    "Une Black Clinic appartient souvent à un seul Meditech qui la partage avec une dizaine de plus jeunes ou de professionnels plus pauvres. Un « résident » y demeure en permanence et plusieurs « contractuels » travaillent pour lui, soit sur des missions de Meditech, soit au sein d'équipes de Crawlers.",
    "En résumé, les Meditechs sont des techno-infirmiers : ils possèdent des bases en mécanique, électronique, chimie et médecine, avec généralement un domaine de prédilection mieux maîtrisé. Ils portent souvent une blouse au-dessus d'un bleu ou d'un jean de travail et de grosses sacoches remplies de matériel. Ils sont spécialisés dans la construction, la réparation, l'électronique, la chimie, le soin et l'analyse, et sont particulièrement liés aux technogmentations qu'ils peuvent poser sur leurs alliés. Seul un Meditech peut aider efficacement un Neurodiver en braincrash, un DeathRunner en surchauffe ou un Fixer en hardlagging."
  ]);

  setOrganisation(byId, "realite-v9-crawlers-gundrivers", [
    "Les Gundrivers gravitent autour de plusieurs organisations et lieux selon leurs contrats. Le Big Black Market est leur place centrale. Tous les Crawlers n'accèdent pas à ces BBM sécurisés, installés dans d'immenses hangars ou des portions de métro réaménagées. On y trouve à prix réduit des produits ordinaires, mais surtout des biens interdits, réglementés ou tracés ailleurs : augmentations dangereuses, armes de guerre non approuvées par le gouvernement californien, IA invasives ou très avancées mais instables.",
    "Pratiquement tout ce qui se trouve dans un BBM a été convoyé par des Gundrivers, qu'ils aient volé la marchandise ou qu'une corporation les ait payés pour l'y apporter. Ils ont eux-mêmes intérêt à y acheter, car armes et véhicules sont difficiles à obtenir lorsqu'on vit comme pillard.",
    "Les stations-service situées hors des villes sont aux mains des gangs de motards et de leurs associés. Elles forment de véritables petits villages servant de bases logistiques aux Gundrivers : on y mange, on y remplit les réservoirs, on s'y divertit et on y échange des informations. Un Crawler extérieur au groupe qui a la chance d'y être toléré peut y apprendre énormément de choses sur le monde hors des grandes villes, dont la vie n'a souvent plus grand-chose à voir avec celle des citadins.",
    "En ville, les Gundrivers fréquentent aussi les Snoopybars. Pour les Neoslavers notamment, ces lieux constituent l'une des meilleures manières de faire travailler leur main-d'œuvre.",
    "En résumé, les Gundrivers sont des trafiquants et des transporteurs, généralement indissociables de leur véhicule et, pour les motards, de leur blouson de cuir. Ils sont plus structurés en bandes que la plupart des autres Crawlers et un peu plus franchement criminels. Davantage tournés vers la vie autour des villes qu'à l'intérieur, ils sont souvent mieux armés que la majorité des Crawlers, sans égaler pour autant les DeathRunners au combat. Leur grand avantage est la mobilité : ils connaissent les routes et ne sont pas attachés à une ville plus qu'à une autre."
  ]);

  setOrganisation(byId, "realite-v9-crawlers-neopunks", [
    "Les Neopunks sont très organisés bien qu'ils soient anarchistes pour la quasi-totalité d'entre eux. Leur grande différence avec les autres Crawlers est qu'ils ne recherchent pas les contrats. Beaucoup en remplissent, mais ils sont rarement choisis directement par les Fixers : ils rejoignent plutôt des alliés ou des amis qui ont besoin de leur réseau ou de leur volonté insoumise.",
    "Ils sont très présents dans les « Abyss » de l'Holonet et utilisent donc virtuellement les mêmes lieux de rencontre que les Neurodivers. Dans les quartiers abandonnés, ils disposent de nombreux bars et surtout de bases aménagées dans les sous-sols, les ruines et parfois des stations de métro entières.",
    "Le Pandémonium est probablement leur institution la plus colossale : un sous-sol gigantesque sous Los Angeles auquel seuls les Neopunks connus et reconnus par leurs pairs peuvent accéder. On n'y entre pas facilement et, lorsqu'on n'est pas des leurs, on n'en ressort généralement pas. Cet « antre des démons » accueille les plus grands concerts, tandis que les autorités restent incapables de le localiser précisément.",
    "L'accès dépend d'un tatouage polyforme qui change régulièrement. L'orientation des pigments constitue un code parmi plusieurs milliards de combinaisons : connaître la forme choisie ne suffit pas sans le code, et connaître le code ne sert à rien sans la bonne forme. Le tatouage change simultanément sur tous les Neopunks toutes les cinq minutes, ce qui rend son décryptage extrêmement difficile.",
    "Le Pandémonium n'est pas seulement un lieu secret de fête. Il sert de refuge, de centre de propagande anticorporatiste — parfois antigouvernementale — et de centre d'information. Les Neopunks rejettent les médias, qu'ils considèrent comme des relais corporatistes vendant la « news » comme un soda ; ils y discutent donc directement des événements du monde et organisent même des conférences entières sur l'histoire ou la science.",
    "Les « Wild Stages » sont des concerts sauvages organisés dans des hangars, stations de métro ou centres commerciaux abandonnés. Extensions improvisées du Pandémonium, ils sont accessibles à un public plus large, notamment aux amis des Neopunks et à des citoyens ordinaires. Pendant que musique et discours font rage, on y échange produits, armes, munitions, informations et adresses ; on s'y bat aussi pour mesurer la force de chacun. L'ambiance reste sauvage et punk, mais fortement clanique : le sentiment d'appartenir à une communauté cohérente y est extrêmement puissant.",
    "En résumé, les Neopunks regroupent les Crawlers qui refusent la société et combattent activement l'un ou l'autre de ses aspects, contrairement à ceux qui, bien que rejetés, composent avec elle. Ils présentent des profils très différents — Neopunks, Freerunners ou Enders — mais portent souvent des vêtements usés, des looks agressifs et des armes de récupération, improvisées ou anciennes, comme pour afficher leur attachement à un passé révolu."
  ]);
}

// Corrections vérifiées sur les fiches actives, après les fusions documentaires.
function repairFinalPnjSurfaces(byId: Map<string, A>) {
  // Ces deux lignes de l'import V3 ne désignent aucun personnage.
  byId.delete("pnj-080-section");
  byId.delete("pnj-060-terre");

  const racheyl = byId.get("personnages-points-rencontre-racheyl-rosemann");
  if (racheyl) {
    for (const section of racheyl.sections ?? []) {
      if (section.audience === "mj") continue;
      for (const block of section.blocks ?? []) {
        if (block.type === "p" && typeof block.text === "string") {
          block.text = block.text.replace(/\s*Sa nature artificielle d’Ashmyn K’Na reste MJ\./g, "");
        }
      }
    }
  }

  const noah = byId.get("pnj-fleaux-focus-noah-brenneman-6-noah-brenneman");
  if (noah) {
    const hidden = (noah.sections ?? []).filter((section) => section.audience === "mj");
    let dossier = hidden.find((section) => section.id === "dossier-mj-consolidation");
    if (!dossier) {
      dossier = { id: "dossier-mj-consolidation", title: "Informations MJ", audience: "mj", level: 2, blocks: [] };
      noah.sections = [...(noah.sections ?? []), dossier];
    }
    for (const section of noah.sections ?? []) {
      if (section.audience === "mj") continue;
      const keep: J[] = [];
      for (const block of section.blocks ?? []) {
        if (block.type === "p" && /Rnael[’']gem|V[’']Aagor|fragments de V|Effismes|dimension de la matière noire/i.test(String(block.text ?? ""))) {
          dossier.blocks.push(block);
        } else keep.push(block);
      }
      section.blocks = keep;
    }
  }

  const amunthosis = byId.get("personnages-verite-chasseurs-aymn-salib");
  if (amunthosis) amunthosis.title = "Aymn Salib";

  const mira = byId.get("pnj-fleaux-focus-mira-stephens-5-mir-a-stephens");
  if (mira) {
    mira.title = "Mira Stephens";
    // Ces deux sections sont déjà recopiées dans le dossier Focus Fléaux MJ.
    mira.sections = (mira.sections ?? []).filter((section) => !["pnj-095-s1", "pnj-095-s2"].includes(section.id));
  }

  const olisha = byId.get("personnages-verite-extraterrestres-olishia-harmon");
  if (olisha) {
    let dossier = (olisha.sections ?? []).find((section) => section.id === "dossier-mj-parentage");
    if (!dossier) {
      dossier = { id: "dossier-mj-parentage", title: "Parentage protégé", audience: "mj", level: 2, blocks: [] };
      olisha.sections = [...(olisha.sections ?? []), dossier];
    }
    for (const section of olisha.sections ?? []) {
      if (section.audience === "mj") continue;
      section.blocks = (section.blocks ?? []).filter((block: J) => {
        if (block.type !== "p" || !/Kelford Bentley|père n’est autre que Kelford/i.test(String(block.text ?? ""))) return true;
        dossier.blocks.push(block);
        return false;
      });
    }
  }

  // Chaque identifiant ci-dessous a été contrôlé : la section indiquée contient
  // des phrases d'un même paragraphe coupées à la mise en page de la source.
  const fragmented = new Set([
    "pnj-police-ryan-isaiah-burton", "pnj-police-ryan-rowe", "pnj-police-kristina-ruiz",
    "pnj-police-osheena-payne", "pnj-police-todd-larsen", "pnj-police-calvin-barron",
    "pnj-police-arthur-bartram", "pnj-police-casey-vaughn",
    "pnj-crawlers-docx-adam-nevine-qigang-xuyin-carmello-shen", "pnj-crawlers-docx-brittany-smith-cavaletty",
    "pnj-crawlers-docx-shuren-shi", "pnj-crawlers-docx-zeeka-steele", "pnj-crawlers-docx-jacob-delisle",
    "pnj-crawlers-docx-henry-edwards", "pnj-crawlers-docx-josefin-drescher", "pnj-crawlers-docx-stella-hardin",
    "pnj-crawlers-docx-karl-henry", "pnj-crawlers-docx-hailey-powell", "pnj-crawlers-docx-jakeline-bates",
    "pnj-crawlers-docx-tia-reynolds", "pnj-crawlers-docx-carlos-saez", "pnj-crawlers-docx-kiandra-price",
    "pnj-crawlers-docx-goro-kazuma", "pnj-crawlers-docx-zoya-ryukana", "pnj-crawlers-docx-rayne-carter",
    "pnj-crawlers-docx-domingo-valerio", "pnj-crawlers-docx-ashuna-kimble", "pnj-crawlers-docx-khristina-yaroslavovna",
    "pnj-crawlers-docx-dragoslav-memic", "pnj-crawlers-docx-zemirah-sherah", "pnj-crawlers-docx-taishara-jibson",
    "pnj-crawlers-docx-lenny-falk", "pnj-crawlers-docx-dushane-murray", "pnj-crawlers-docx-narako-austin",
    "pnj-crawlers-docx-aisha-white", "pnj-crawlers-docx-arnstein-gill", "pnj-crawlers-docx-kashrim-el-khayat",
    "pnj-crawlers-docx-kendasha-roberts", "pnj-crawlers-docx-yan-xiao", "pnj-crawlers-docx-tuuwa-kolenya",
    "pnj-crawlers-docx-kerlyn-sherres", "pnj-crawlers-docx-leslie-wright", "pnj-crawlers-docx-damon-harrington",
    "pnj-crawlers-docx-damian-escribano", "pnj-crawlers-docx-gerrika-reese", "pnj-crawlers-docx-daft-vador-kaine-reid",
    "pnj-crawlers-docx-dan-shelong", "pnj-crawlers-docx-mi-yeon-ryong", "pnj-crawlers-docx-yong-gi-mangjol",
    "pnj-crawlers-docx-ogshaata-otto", "personnages-verite-especes-elizabeth-mircalla-karnstein",
    "personnages-verite-especes-veronica-silver", "personnages-verite-extrals-groupes-mustafa-dzeko",
    "personnages-verite-extraterrestres-tejana"
  ]);
  for (const id of fragmented) {
    const article = byId.get(id);
    const section = (article?.sections ?? []).find((item) => item.id === "crawlers-v2-realite");
    if (!section) throw new Error(`Biographie fragmentée introuvable : ${id}`);
    const joined: J[] = [];
    for (const block of section.blocks ?? []) {
      const previous = joined.at(-1);
      if (block.type === "p" && previous?.type === "p" &&
          !/[.!?…»:]\s*$/.test(String(previous.text ?? "").trim())) {
        previous.text = `${String(previous.text).trimEnd()} ${String(block.text ?? "").trimStart()}`;
      } else joined.push(block);
    }
    section.blocks = joined;
  }

  // Les anciennes fiches qui ont réellement été promues dans le corpus actif
  // gardent parfois leur profil mixte importé de Word. Conserver chaque bloc
  // original dans le dossier MJ ; les biographies Réalité restent publiques.
  for (const article of byId.values()) {
    if (article.dataset !== "pnj" || article.rebuildV2 !== true) continue;
    let dossier = (article.sections ?? []).find((section) => section.id === "profil-source-protege");
    for (const section of article.sections ?? []) {
      if (section.audience === "mj") continue;
      const keep: J[] = [];
      for (const block of section.blocks ?? []) {
        if (block.type !== "p" || !/Nom de la Vérité\s*:|Ethnie réelle\s*:|Nature réelle\s*:/i.test(String(block.text ?? ""))) {
          keep.push(block);
          continue;
        }
        if (!dossier) {
          dossier = { id: "profil-source-protege", title: "Profil source", audience: "mj", level: 2, blocks: [] };
          article.sections = [...(article.sections ?? []), dossier];
        }
        dossier.blocks.push(block);
      }
      section.blocks = keep;
    }
  }

  const unresolvedWordCells = new Set([
    "pnj-pegre-dante-guzman", "pnj-police-calvin-barron", "pnj-crawlers-docx-rayne-carter",
    "pnj-crawlers-docx-domingo-valerio", "pnj-crawlers-docx-ashuna-kimble",
    "pnj-crawlers-docx-dragoslav-memic", "pnj-crawlers-docx-zemirah-sherah",
    "pnj-crawlers-docx-aisha-white", "pnj-crawlers-docx-arnstein-gill",
    "pnj-crawlers-docx-yan-xiao", "pnj-crawlers-docx-tuuwa-kolenya",
    "pnj-crawlers-docx-damon-harrington", "pnj-crawlers-docx-darielle-power",
    "pnj-crawlers-docx-dan-shelong", "pnj-crawlers-docx-mi-yeon-ryong",
    "pnj-crawlers-antisysteme-p46-raghnaid-peutan", "pnj-crawlers-antisysteme-p48-zaketa-harris",
    "pnj-crawlers-antisysteme-p50-honda-daisuke", "pnj-crawlers-antisysteme-p52-wenona",
    "personnages-verite-especes-elizabeth-mircalla-karnstein"
  ]);
  for (const id of unresolvedWordCells) {
    const article = byId.get(id);
    if (!article) throw new Error(`Fiche à nettoyer introuvable : ${id}`);
    for (const section of article.sections ?? []) {
      if (section.audience === "mj") continue;
      for (const block of section.blocks ?? []) {
        if (block.type !== "table" || !Array.isArray(block.rows)) continue;
        block.rows = block.rows
          .map((row: unknown[]) => row.map((cell) => typeof cell === "string"
            ? cell.replace(/\s*-\s*\?{3,}\s*$/, "").trim() : cell))
          .filter((row: unknown[]) => !row.some((cell) => /^\?{3,}$/.test(String(cell ?? "").trim())));
      }
    }
  }

  for (const article of byId.values()) {
    if (article.category !== "Personnages" && !String(article.dataset ?? "").includes("pnj")) continue;
    for (const section of article.sections ?? []) {
      if (section.audience === "mj") continue;
      if (/^Complément Réalité · dossier /.test(section.title ?? "") ||
          /^Informations Réalité — Focus /.test(section.title ?? "")) section.title = "Informations Réalité";
      if (/^Complément de fiche · dossier /.test(section.title ?? "")) section.title = "Complément d’identité";
      if (/^Dossier — Focus /.test(section.title ?? "")) section.title = "Dossier";
    }
  }
}

function restoreMageRealityProfiles(byId: Map<string, A>) {
  // Ces 27 fiches n'ont aucune section publique après les consolidations.
  // La source donne pourtant leur identité et leurs données de Réalité.
  const ids = [
    "pnj-loges-mages-nina-le-guellec-03", "pnj-loges-mages-morgane-o-broin-04",
    "pnj-loges-mages-arash-ostaan-05", "pnj-loges-mages-gwendoleen-macguire-06",
    "pnj-loges-mages-zhao-guanyu-10", "pnj-loges-mages-anayah-kumba-11",
    "pnj-loges-mages-sergio-venegas-12", "pnj-loges-mages-adrien-daigremont-14",
    "pnj-loges-mages-melina-apapoulos-15", "pnj-loges-mages-adalardo-gravina-16",
    "pnj-loges-mages-zephia-brummer-17", "pnj-loges-mages-shane-rosenberg-18",
    "pnj-loges-mages-mada-oromo-nerayo-19", "pnj-loges-mages-mertkan-sabanci-20",
    "pnj-loges-mages-bassaam-el-akram-21", "pnj-loges-mages-hassan-abate-yideg-22",
    "pnj-loges-mages-asuka-yamamuro-23", "pnj-loges-mages-anggriawan-yang-24",
    "pnj-loges-mages-jin-tian-myong-25", "pnj-loges-mages-robert-peng-26",
    "pnj-loges-mages-roowinu-27", "pnj-loges-mages-mike-michabou-28",
    "pnj-loges-mages-muna-29", "pnj-loges-mages-lara-steven-30",
    "pnj-loges-mages-edwin-kelly-31", "pnj-loges-mages-nike-celio-37",
    "pnj-loges-mages-alice-carroll-38"
  ];

  for (const id of ids) {
    const article = byId.get(id);
    if (!article?.pnj?.real_name) throw new Error(`Profil Réalité du Mage introuvable : ${id}`);
    const source = (article.sections ?? []).find((section) => section.id === "profil-loges-mages");
    const table = (source?.blocks ?? []).find((block: J) => block.type === "table");
    if (!table?.rows) throw new Error(`Profil source du Mage introuvable : ${id}`);
    const field = (label: string) => String(table.rows.find((row: unknown[]) => row[0] === label)?.[1] ?? "").trim();
    const civilName = String(article.pnj.real_name).trim();
    const age = /[«" ]\s*(\d+)\s*ans/i.exec(field("Âge"))?.[1];
    const affiliation = field("Affiliations").replace(/^[«"\s]+|[»"\s]+$/g, "");
    const nationality = field("Nationalité d’origine");
    const rows: string[][] = [["Champ", "Valeur"], ["Nom / identité de Réalité", civilName]];
    if (age) rows.push(["Âge apparent", `${age} ans`]);
    if (affiliation && !/^\?+$/.test(affiliation) && !/\b(?:mages?|chasseurs?|créatures?)\b/i.test(affiliation)) {
      rows.push(["Affiliations", affiliation]);
    }
    if (nationality && !/^\?+$/.test(nationality)) rows.push(["Nationalité déclarée", nationality]);
    const blocks: J[] = [{ type: "table", rows }];
    if (id === "pnj-loges-mages-nina-le-guellec-03") {
      blocks.push({ type: "p", text: "Officiellement française, elle est directrice de branche de la Tuatha." });
    }
    article.title = civilName;
    const publicSection = { id: "identite-realite-restauree", title: "Identité · Réalité", level: 2, blocks };
    article.sections = [publicSection, ...(article.sections ?? [])];
  }
}

export function applyCompendiumPnjRepairs(byId: Map<string, A>) {
  const result = applyBaseCompendiumPnjRepairs(byId);
  repairClassicCrawlerOrganisations(byId);
  repairFinalPnjSurfaces(byId);
  restoreMageRealityProfiles(byId);
  return result;
}
