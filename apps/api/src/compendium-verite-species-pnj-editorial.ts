type J = Record<string, any>;

type EditorialDecision = {
  publicTitle: string;
  realName?: string;
  mjOnly?: boolean;
};

// Each entry below records the individual editorial decision taken after
// comparing the active profile with TUC_Vérité_ les espèces surnaturelles.
const DECISIONS: Record<string, EditorialDecision> = {
  "personnages-verite-especes-ming-xinya": { publicTitle: "Ming Xinya", realName: "Ming Xinya" },
  "personnages-verite-especes-dragoy-skotialov": { publicTitle: "Dan Harrington", realName: "Dan Harrington" },
  "personnages-verite-especes-megda-ayshin": { publicTitle: "Megda Ayshin", realName: "Megda Ayshin" },
  "personnages-verite-especes-neeba-ngubenani": { publicTitle: "Neeba Ngubenani", realName: "Neeba Ngubenani" },
  "personnages-verite-especes-quetzalcoatl": { publicTitle: "Quetzalcoatl", mjOnly: true },
  "personnages-verite-especes-elody-katherine-skotia": { publicTitle: "Elody Katherine Skotia", realName: "Elody Katherine Skotia" },
  "personnages-verite-especes-elizabeth-mircalla-karnstein": { publicTitle: "Elizabeth Mircalla Karnstein", realName: "Elizabeth Mircalla Karnstein" },
  "personnages-verite-especes-ascanius": { publicTitle: "Nathan Chappelle", realName: "Nathan Chappelle" },
  "personnages-verite-especes-talatuwa": { publicTitle: "Sikya Hawkins", realName: "Sikya Hawkins" },
  "personnages-verite-especes-khaashtay": { publicTitle: "John Sandrock", realName: "John Sandrock" },
  "personnages-verite-especes-thorunn": { publicTitle: "Benedicte Vilhelmsen", realName: "Benedicte Vilhelmsen" },
  "personnages-verite-especes-inukawa-shingen": { publicTitle: "Inukawa Shingen", realName: "Inukawa Shingen" },
  "personnages-verite-especes-kadriye": { publicTitle: "Chamunda Dhavale", realName: "Chamunda Dhavale" },
  "personnages-verite-especes-tokala": { publicTitle: "Tokala", realName: "Tokala" },
  "personnages-verite-especes-koshaway-le-gris": { publicTitle: "Koshaway le Gris", realName: "Koshaway" },
  "personnages-verite-especes-anahita": { publicTitle: "Anna Hita", realName: "Anna Hita" },
  "personnages-verite-especes-saint-germain": { publicTitle: "Kai Gehrman", realName: "Kai Gehrman" },
  "personnages-verite-especes-daghain": { publicTitle: "Dana O’Bryan", realName: "Dana O’Bryan" },
  "personnages-verite-especes-mithridate": { publicTitle: "Mickael Date", realName: "Mickael Date" },
  "personnages-verite-especes-gullveig": { publicTitle: "Alicia Gullveig", realName: "Alicia Gullveig" },
  "personnages-verite-especes-faust": { publicTitle: "Ryan Foster", realName: "Ryan Foster" },
  "personnages-verite-especes-circe": { publicTitle: "Cylia Patra", realName: "Cylia Patra" },
  "personnages-verite-especes-zebediah-jacobsen": { publicTitle: "Zebediah Jacobsen", realName: "Zebediah Jacobsen" },
  "personnages-verite-especes-veronica-silver": { publicTitle: "Veronica Silver", realName: "Veronica Silver" },
  "personnages-verite-especes-kyriakos-zenos": { publicTitle: "Kyriakos Zenos", realName: "Kyriakos Zenos" },
  "personnages-verite-especes-kalira-athegos": { publicTitle: "Katelyn Attenborough", realName: "Katelyn Attenborough" },
  "personnages-verite-especes-sagarion-nagilia": { publicTitle: "Collin Perez", realName: "Collin Perez" },
  "personnages-verite-especes-kelrana-nateas": { publicTitle: "Carolina Nates", realName: "Carolina Nates" },
  "personnages-verite-especes-laetheas-sundosia": { publicTitle: "Larry Sundown", realName: "Larry Sundown" },
  "personnages-verite-especes-lorinae-athegos": { publicTitle: "Laurie D. Sun", realName: "Laurie D. Sun" },
  "personnages-verite-especes-iwashita-koji": { publicTitle: "Iwashita Koji", realName: "Iwashita Koji" },
  "personnages-verite-especes-belyandra-queen": { publicTitle: "Belyandra Queen", realName: "Belyandra Queen" },
  "personnages-verite-especes-diego-rasgado": { publicTitle: "Diego Rasgado", realName: "Diego Rasgado" },
  "personnages-verite-especes-alice-river": { publicTitle: "Alice River", realName: "Alice River" },
  "personnages-verite-especes-ramon-payne": { publicTitle: "Ramon Payne", realName: "Ramon Payne" },
  "personnages-verite-especes-athena-clyde": { publicTitle: "Athena Clyde", realName: "Athena Clyde" },
  "personnages-verite-especes-martin-guiden": { publicTitle: "Martin Guiden", realName: "Martin Guiden" },
  "personnages-verite-especes-liliana-shera": { publicTitle: "Liliana Shera", realName: "Liliana Shera" },
  "personnages-verite-especes-nathan-prince": { publicTitle: "Nathan Prince", realName: "Nathan Prince" },
  "personnages-verite-especes-abigael-sky": { publicTitle: "Abigael Sky", realName: "Abigael Sky" },
  "personnages-verite-especes-luke-cypher": { publicTitle: "Luke Cypher", realName: "Luke Cypher" },
  "personnages-verite-especes-ephraim-bahal": { publicTitle: "Ephraim Bahal", realName: "Ephraim Bahal" },
  "personnages-verite-especes-zabeel-albel": { publicTitle: "Zabeel Al’Bel", realName: "Zabeel Al’Bel" },
  "personnages-verite-especes-sigrid-jorgensen": { publicTitle: "Sigrid Jorgensen", realName: "Sigrid Jorgensen" },
  "personnages-verite-especes-elysabeth-godwin": { publicTitle: "Elysabeth Godwin", realName: "Elysabeth Godwin" },
  "personnages-verite-especes-az-la-faucheuse-noire": { publicTitle: "La Faucheuse noire (Az)", realName: "La Faucheuse noire (Az)" },
  "personnages-verite-especes-mickael-krieg": { publicTitle: "Mickael Krieg", realName: "Mickael Krieg" },
  "personnages-verite-especes-gabrielle-power": { publicTitle: "Gabrielle Power", realName: "Gabrielle Power" },
  "personnages-verite-especes-ralph-zeiner": { publicTitle: "Ralph Zeiner", realName: "Ralph Zeiner" },
  "personnages-verite-especes-arielle-nova": { publicTitle: "Arielle Nova", realName: "Arielle Nova" },
  "personnages-verite-especes-kane-riley": { publicTitle: "Kane Riley", realName: "Kane Riley" },
  "personnages-verite-especes-kaydence-o-dalaigh": { publicTitle: "Kaydence Ó Dálaigh", realName: "Kaydence Ó Dálaigh" },
  "personnages-verite-especes-alexander-zazelov": { publicTitle: "Alexander Zazelov", realName: "Alexander Zazelov" },
  "personnages-verite-especes-sophie-lovecraft": { publicTitle: "Sophie Lovecraft", realName: "Sophie Lovecraft" },
  "personnages-verite-especes-barret-kelvin": { publicTitle: "Barret Kelvin", realName: "Barret Kelvin" },
  "personnages-verite-especes-svetlana-konstantinovna": { publicTitle: "Svetlana Konstantinovna", realName: "Svetlana Konstantinovna" },
  "personnages-verite-especes-lombre-pape": { publicTitle: "L’Ombre-Pape", realName: "L’Ombre-Pape" },
  "personnages-verite-especes-mloxol-vaagor": { publicTitle: "Mloxol V’Aagor", mjOnly: true },
  "personnages-verite-especes-uxsharith": { publicTitle: "Alisa Svalisdottir", realName: "Alisa Svalisdottir" },
  "personnages-verite-especes-vhodhalnactru": { publicTitle: "Vhodhal’nact’ru", mjOnly: true },
  "personnages-verite-especes-gajh-shaoggith": { publicTitle: "Gajh’ Shaoggith", mjOnly: true },
  "personnages-verite-especes-cthath-vhadhi": { publicTitle: "C’Thath Vhadhi", mjOnly: true },
  "personnages-verite-especes-kthuhuthlul": { publicTitle: "Cthulhu", realName: "Cthulhu" },
  "personnages-verite-especes-amphitrite": { publicTitle: "Amalia Carson", realName: "Amalia Carson" },
  "personnages-verite-especes-ravana": { publicTitle: "Ravana" },
  "personnages-verite-especes-angrboda": { publicTitle: "Angrboda", realName: "Angrboda" },
  "personnages-verite-especes-akvan": { publicTitle: "Akvan" },
  "personnages-verite-especes-fuyumi-shinoda": { publicTitle: "Fuyumi Shinoda", realName: "Fuyumi Shinoda" }
};

const GAROU_SPLITS: Record<string, string> = {
  "personnages-verite-especes-talatuwa": "Alors qu’elle n’avait que 17 ans",
  "personnages-verite-especes-khaashtay": "Sa prise de pouvoir sur les réseaux",
  "personnages-verite-especes-thorunn": "Si Benedicte est un officier",
  "personnages-verite-especes-kadriye": "Dès sa toute jeunesse"
};

const VHODHAL_LORE = [
  "Vhodhal est la faim portée à une échelle où la notion même de nourriture cesse d’être biologique. Matière, énergie, douleur, fonction, espace et jusqu’à la mort peuvent devenir des prises dès lors que la Famine apprend à les reconnaître.",
  "Les textes anciens l’appellent Famine véritable, Bouche absolue, Crocs du chaos ou Chien de la Reine. Ses quatre « regards » décrivent une compréhension des formes, des énergies, des structures mentales et des trames temporelles : plus Vhodhal comprend une chose, plus elle peut finir par l’envisager comme consommable.",
  "Ux’Sharith est longtemps décrite comme la puissance capable de donner une direction à cette faim, d’où le titre de Chien de la Reine. Cette relation n’avait rien d’affectueux : la Division imposait assez de séparation dans l’appétit de Vhodhal pour qu’une intention puisse momentanément exister entre deux besoins de dévorer.",
  "La Famine Blanche produit des Ruptures très différentes selon la Nature touchée : Wendigos, Bêtes Faramines, Sangs d’Ivoire, Noctiels ou Egams ne sont pas une même espèce, mais la même loi de dévoration appliquée à des organismes différents. La Loge d’Écume transforme cette faim en religion et apprend à nourrir le manque avec la destruction d’autrui."
];

function textBlocks(section: J | undefined): string {
  return (section?.blocks ?? []).map((block: J) => String(block?.text ?? "")).filter(Boolean).join(" ").trim();
}

function apparentAge(value: unknown): string {
  const text = String(value ?? "").replace(/[«»]/g, "").trim();
  if (!text || /^\?+$/.test(text)) return "";
  return text.split(/\s*[-,]\s*/)[0].trim().replace(/\s+/g, " ");
}

function safeRealitySection(article: J, realName: string): J {
  const pnj = article.pnj ?? {};
  const rows: string[][] = [["Champ", "Valeur"], ["Nom / identité de Réalité", realName]];
  const age = apparentAge(pnj.age);
  if (age && !age.includes("?")) rows.push(["Âge apparent", age]);
  const affiliation = String(pnj.statut ?? "").replace(/[«»]/g, "").trim();
  if (affiliation && !/créatures?|vampires?|garous?|mages?|angelus|daemons?|fléaux?|aseryns?|atlantes?/i.test(affiliation)) {
    rows.push(["Affiliations", affiliation]);
  }
  if (pnj.origine && !String(pnj.origine).includes("?")) rows.push(["Nationalité déclarée", String(pnj.origine)]);
  return { id: "identite-realite", title: "Identité · Réalité", level: 2, blocks: [{ type: "table", rows }] };
}

function splitGarouReality(article: J, boundary: string): void {
  const reality = (article.sections ?? []).find((section: J) => section?.id === "info-realite");
  const full = textBlocks(reality);
  const index = full.indexOf(boundary);
  if (!reality || index <= 0) throw new Error(`Coupure éditoriale introuvable pour ${article.id}`);
  const publicText = full.slice(0, index).trim();
  const truthText = full.slice(index).trim();
  reality.blocks = [{ type: "p", text: publicText }];
  article.pnj.source_verite = [{ label: "Informations Vérité", text: truthText }];
  const mj = (article.sections ?? []).find((section: J) => section?.id === "informations-mj");
  if (!mj) throw new Error(`Section MJ introuvable pour ${article.id}`);
  mj.blocks = [{ type: "p", text: truthText }];
}

function repairLaurie(article: J): void {
  const truth = "Autrefois membre d’un groupe d’aventuriers sur Aèr, dont fit partie l’ancienne reine elfe Nysril Isildwind, Lorinae reçut l’honneur et la tâche d’assurer la gouvernance héritée par sa sœur. Sacrée par Kalira Athegos, elle fut considérée comme sa fille adoptive et son héritière légitime. Son arrivée en Atlantide resta difficile : certains Aseryns refusaient l’autorité des Néo-Atlantes, tandis que les Mûliens demeuraient fermés et hostiles. Malgré les ducs tentés de reconnaître Kyriak, l’ancienne aventurière poursuit avec ténacité son projet de réunification des Aseryns.";
  article.title = "Laurie D. Sun";
  article.pnj = {
    ...article.pnj,
    real_name: "Laurie D. Sun",
    real_name_source: "Laurie D. Sun",
    nom_verite: "Lorinae Athegos (Darksun)",
    nom_verite_source: "Lorinae Athegos (Darksun)",
    race: "Aseryne (paleo-atlante)",
    age: "30 ans en apparence ; âge réel inconnu",
    origine: "Américaine",
    statut: "Crawlers : Gunwatcher",
    statut_verite: "Reine des Atlantes et des Aseryns",
    identity_keys: ["Laurie D. Sun", "Lorinae Athegos", "Lorinae Athegos (Darksun)", "Darksun"],
    source_verite: [{ label: "Informations Vérité", text: truth }]
  };
  article.sections = [
    {
      id: "info-realite",
      title: "Informations Réalité",
      level: 2,
      blocks: [{
        type: "p",
        text: "Laurie D. Sun possède un vaste réseau d’enquête. Elle dirige la Darksun Association, une petite entreprise de renseignement réunissant enquêteurs, espions et anciens commandos. Elle dispose de l’élite des Gunwatchers, et les fixers recourent volontiers à ses professionnels plutôt qu’à des indépendants moins structurés."
      }]
    },
    {
      id: "informations-mj",
      title: "Informations MJ",
      level: 2,
      audience: "mj",
      blocks: [{
        type: "p",
        text: truth
      }]
    },
    { id: "statistiques", title: "Statistiques", level: 2, audience: "mj", blocks: [] }
  ];
}

function repairVhodhal(article: J): void {
  article.title = "Vhodhal’nact’ru";
  article.pnj = {
    ...article.pnj,
    nom_verite: "Vhodhal",
    race: "Fléau ancien",
    statut_verite: "La Famine Blanche",
    identity_keys: ["Vhodhal", "Vhodhal’nact’ru", "Famine Blanche"],
    source_verite: [{ label: "Informations Vérité", text: VHODHAL_LORE.join(" ") }]
  };
  article.sections = [
    {
      id: "informations-mj",
      title: "Informations MJ",
      level: 2,
      audience: "mj",
      blocks: [{ type: "p", text: VHODHAL_LORE.join(" ") }]
    },
    { id: "statistiques", title: "Statistiques", level: 2, audience: "mj", blocks: [] }
  ];
}

export function editorializeSpeciesPnj(source: Array<Record<string, any>>): Array<Record<string, any>> {
  if (source.length !== Object.keys(DECISIONS).length) {
    throw new Error(`Audit Espèces surnaturelles incomplet : ${source.length}/${Object.keys(DECISIONS).length}`);
  }

  return source.map((raw) => {
    const article = JSON.parse(JSON.stringify(raw)) as J;
    const decision = DECISIONS[article.id];
    if (!decision) throw new Error(`Fiche Espèces surnaturelles non auditée : ${article.id}`);

    if (article.id === "personnages-verite-especes-lorinae-athegos") repairLaurie(article);
    if (article.id === "personnages-verite-especes-vhodhalnactru") repairVhodhal(article);

    article.title = decision.publicTitle;
    article.pnj = { ...(article.pnj ?? {}), protect_truth_metadata: true };
    if (decision.realName) article.pnj.real_name = decision.realName;
    article.pnj.identity_keys = [...new Set([
      ...(article.pnj.identity_keys ?? []),
      decision.publicTitle,
      decision.realName,
      article.pnj.nom_verite
    ].filter(Boolean))];

    const boundary = GAROU_SPLITS[article.id];
    if (boundary) splitGarouReality(article, boundary);

    const originalSections = article.sections ?? [];
    for (const section of originalSections) {
      if (section?.id === "profil" || /^profil$/i.test(String(section?.title ?? ""))) {
        section.title = "Profil MJ";
        section.audience = "mj";
      }
      if (/informations seuil/i.test(String(section?.title ?? ""))) section.audience = "mj";
      for (const block of section?.blocks ?? []) {
        if (typeof block?.text !== "string") continue;
        block.text = block.text
          .replace(/\bVoire le mythe de Cthulhu\./g, "Voir le mythe de Cthulhu.")
          .replace(/où sa\) plastique/g, "où sa plastique");
      }
    }

    if (article.id === "personnages-verite-especes-sophie-lovecraft") {
      for (const section of originalSections) for (const block of section?.blocks ?? []) {
        if (typeof block?.text === "string" && /cabinet privé$/.test(block.text)) block.text += ".";
      }
    }
    if (article.id === "personnages-verite-especes-uxsharith") {
      for (const entry of article.pnj.source_verite ?? []) {
        if (typeof entry?.text === "string" && !/[.!?…]$/.test(entry.text)) entry.text += ".";
      }
      const mj = originalSections.find((section: J) => section?.id === "informations-mj");
      for (const block of mj?.blocks ?? []) {
        if (typeof block?.text === "string" && !/[.!?…]$/.test(block.text)) block.text += ".";
      }
    }

    if (decision.realName && !decision.mjOnly) {
      const alreadySafe = originalSections.some((section: J) => section?.id === "identite-realite");
      if (!alreadySafe) originalSections.unshift(safeRealitySection(article, decision.realName));
    }

    if (decision.mjOnly) {
      article.audience = "mj";
      for (const section of originalSections) section.audience = "mj";
    }

    return article;
  });
}
