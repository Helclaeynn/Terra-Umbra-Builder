type J = Record<string, any>;
type Decision = { publicTitle: string; realName?: string; truthName?: string; mjOnly?: boolean };

// Une décision explicite par fiche, après lecture des pages 8 à 28 du PDF continu.
const DECISIONS: Record<string, Decision> = {
  "personnages-verite-humains-galactiques-lisa-eredhes": { publicTitle: "Lisa Eredhès", realName: "Lisa Eredhès", truthName: "Lisa Eredhès" },
  "personnages-verite-humains-galactiques-alladava-kjoll": { publicTitle: "Alladava Kjoll", realName: "Alladava Kjoll", truthName: "Alladava Kjoll" },
  "personnages-verite-humains-galactiques-james-zero": { publicTitle: "James Zero", realName: "James Zero", truthName: "CBT-0-0013" },
  "personnages-verite-humains-galactiques-lance-goldstar": { publicTitle: "Lance Goldstar", realName: "Lance Goldstar", truthName: "Lance Goldstar" },
  "personnages-verite-humains-galactiques-chris-sunborne": { publicTitle: "Chris Sunborne", realName: "Chris Sunborne", truthName: "Chris Sunborne" },
  "personnages-verite-humains-galactiques-karina-kelack": { publicTitle: "Karina Kelack", truthName: "Karina Kelack", mjOnly: true },
  "personnages-verite-humains-galactiques-jol-la-etrys": { publicTitle: "Jol’la Etrys", truthName: "Jol’la Etrys", mjOnly: true },
  "personnages-verite-humains-galactiques-moira-blake": { publicTitle: "Moira Blake", realName: "Moira Blake", truthName: "Moira Blackraven" },
  "personnages-verite-humains-galactiques-sigmund-vandendriessche": { publicTitle: "Sigmund Vandendriessche", realName: "Sigmund Vandendriessche" },
  "personnages-verite-humains-galactiques-lois-xavier": { publicTitle: "Lois Xavier", realName: "Lois Xavier", truthName: "Loyxa’Aeliey" },
  "personnages-verite-humains-galactiques-sally-melia-goom": { publicTitle: "Sally Melia Goom", realName: "Sally Melia Goom", truthName: "Saniggoumelia" },
  "personnages-verite-humains-galactiques-kassim-heirdaen-castanelli": { publicTitle: "Kassim Heirdaen-Castanelli", realName: "Kassim Heirdaen-Castanelli" },
  "personnages-verite-humains-galactiques-christopher-zaakdu": { publicTitle: "Christopher Zaakdu", realName: "Christopher Zaakdu" },
  "personnages-verite-humains-galactiques-ogum-mi-yeon": { publicTitle: "Ogum Mi-Yeon", realName: "Ogum Mi-Yeon", truthName: "Kirr’Shala" },
  "personnages-verite-humains-galactiques-zack-ray-ashford": { publicTitle: "Zack Ray Ashford", realName: "Zack Ray Ashford", truthName: "Zaugeih’Arrphor" },
  "personnages-verite-humains-galactiques-alkiwa-sebeth-mir": { publicTitle: "Alkiwa Sebeth’mir", realName: "Alkiwa Sebeth’mir" },
  "personnages-verite-humains-galactiques-ysabel-thorne": { publicTitle: "Ysabel Thorne", realName: "Ysabel Thorne" },
  "personnages-verite-humains-galactiques-noma-langa": { publicTitle: "Noma Langa", realName: "Noma Langa" },
  "personnages-verite-humains-galactiques-satan-kirchov": { publicTitle: "Satan Kirchov", realName: "Satan Kirchov", truthName: "Lentrix-44892" },
  "personnages-verite-humains-galactiques-cassie-gloves": { publicTitle: "Cassie Gloves", realName: "Cassie Gloves" },
  "personnages-verite-humains-galactiques-gustavo-shiba": { publicTitle: "Gustavo Shiba", realName: "Gustavo Shiba", truthName: "Gustavo Shiba" },
  "personnages-verite-humains-galactiques-kenneth-shatter": { publicTitle: "Kenneth Shatter", realName: "Kenneth Shatter" },
  "personnages-verite-humains-galactiques-saskia": { publicTitle: "Saskia", realName: "Saskia", truthName: "A.E-95" },
  "personnages-verite-humains-galactiques-mike-tenq": { publicTitle: "Mike Tenq", realName: "Mike Tenq", truthName: "MTT-E95-47" },
  "personnages-verite-humains-galactiques-sharon-skull": { publicTitle: "Sharon Skull", realName: "Sharon Skull", truthName: "A.E-98" },
  "personnages-verite-humains-galactiques-kay-salzer": { publicTitle: "Kay Salzer", realName: "Kay Salzer", truthName: "A.P-148" },
  "personnages-verite-humains-galactiques-kaylarie-dandwalb": { publicTitle: "Kaylarie Dandwalb", realName: "Kaylarie Dandwalb" },
  "personnages-verite-humains-galactiques-zairon-tenfi": { publicTitle: "Zairon Tenfi", realName: "Zairon Tenfi", truthName: "Zairon Tenfi – « Lord Cised »" },
  "personnages-verite-humains-galactiques-kim-sera": { publicTitle: "Kim Sera", realName: "Kim Sera", truthName: "Sera’lin" },
  "personnages-verite-humains-galactiques-nehemiah-hooley": { publicTitle: "Nehemiah Hooley", realName: "Nehemiah Hooley", truthName: "Hooley’Makal" },
  "personnages-verite-humains-galactiques-dona-di-canerra": { publicTitle: "Dona di Canerra", realName: "Dona di Canerra", truthName: "Dokannia Rwal" },
  "personnages-verite-humains-galactiques-justice-whittingham": { publicTitle: "Justice Whittingham", realName: "Justice Whittingham" }
};

// La première fiche de chaque page à deux profils avait perdu sa dernière phrase.
const COMPLETIONS: Record<string, string> = {
  "personnages-verite-humains-galactiques-lisa-eredhes": "rappelant son monde natal, elle a une légère affection pour ce monde étrange, magique et technologique.",
  "personnages-verite-humains-galactiques-james-zero": "et assez glacial dans ses réflexions.",
  "personnages-verite-humains-galactiques-chris-sunborne": "passion le « No-G ball », une sorte de soccer sans gravité, dont il est un excellent joueur.",
  "personnages-verite-humains-galactiques-jol-la-etrys": "secours, devenant le système solaire « Legacy », d’où s’échappent parfois des robots étranges.",
  "personnages-verite-humains-galactiques-sigmund-vandendriessche": "dépérissent avec la nourriture locale ; c’est donc la G-corpo que Lisa surveille le moins.",
  "personnages-verite-humains-galactiques-sally-melia-goom": "probation dans la Vérité, en quelque sorte.",
  "personnages-verite-humains-galactiques-christopher-zaakdu": "cul, alors il se cache sur Terre. Malgré son corps très faible, c’est un tireur d’une précision inhumaine.",
  "personnages-verite-humains-galactiques-zack-ray-ashford": "pouvoirs de Tejana et possède un don naturel pour cette énergie ad’rak, comme Tommy Rosemann.",
  "personnages-verite-humains-galactiques-ysabel-thorne": "elle n’existe plus ; elle est donc là pour rien, mais c’est cool.",
  "personnages-verite-humains-galactiques-satan-kirchov": "combattant très correct et un bon tireur, même si ses capacités se révèlent en apesanteur.",
  "personnages-verite-humains-galactiques-gustavo-shiba": "qu’il n’en est rien.",
  "personnages-verite-humains-galactiques-saskia": "d’assassin, qui semble lui répugner.",
  "personnages-verite-humains-galactiques-sharon-skull": "différence avec elle-même. Bien qu’inférieure à 95, elle est terriblement puissante.",
  "personnages-verite-humains-galactiques-kaylarie-dandwalb": "la trace de Kenneth sur cet étrange monde qu’est la Terre.",
  "personnages-verite-humains-galactiques-kim-sera": "le Photonaire des Effismes.",
  "personnages-verite-humains-galactiques-dona-di-canerra": "engagé Worlddealer pour prendre la main sur leurs projets et les faire échouer. Un accord avec la seigneur-générale pourrait être derrière cela et libérerait Dokannia de son statut de traîtresse."
};

function clean(text: string): string {
  return text
    .replace(/￾/g, "-")
    .replace(/\bJames Bow\b/g, "James Zero")
    .replace(/\bMorgan Blackraven\b/g, "Moira Blackraven")
    .replace(/\bMorgan est Morrighan\b/g, "Moira est Morrighan")
    .replace(/\bchris Sunborne\b/g, "Chris Sunborne")
    .replace(/\bKatylarie\b/g, "Kaylarie")
    .replace(/\bZairon tenfi\b/g, "Zairon Tenfi")
    .replace(/\bDona Di Canerra\b/g, "Dona di Canerra")
    .replace(/\bAextrals\b/g, "Extrals")
    .replace(/\bconfis de la galaxie\b/g, "confins de la galaxie")
    .replace(/\bgerre\b/g, "guerre")
    .replace(/\bses recherchent furent\b/g, "ses recherches furent")
    .replace(/\bs’entends\b/g, "s’entend")
    .replace(/\bc’’est\b/g, "c’est")
    .replace(/\brelation sets vite achevée\b/g, "relation s’est vite achevée")
    .replace(/\bCassie Gloves et juste\b/g, "Cassie Gloves est juste")
    .replace(/\breveue traumatisée\b/g, "revenue traumatisée")
    .replace(/\bafromaéricains\b/g, "afro-américains")
    .replace(/\brègles quelques petits soucis\b/g, "règle quelques petits soucis")
    .replace(/\bl’Assassin Eversor n°95 Mike est\b/g, "Mike est")
    .replace(/\bqu’entretien Corveo\b/g, "qu’entretient Corveo")
    .replace(/\btraitresse\b/g, "traîtresse")
    .replace(/\bMaitresse\b/g, "Maîtresse")
    .replace(/\bmaitre\b/g, "maître");
}

function safeIdentity(article: J, name: string): J {
  const rows: string[][] = [["Champ", "Valeur"], ["Nom / identité de Réalité", name]];
  const age = String(article.pnj?.age ?? "").replace(/[«»]/g, "").match(/\d+\s*ans/i)?.[0];
  if (age) rows.push(["Âge apparent", age.replace(/\s+/g, " ")]);
  const affiliation = String(article.pnj?.statut ?? "").trim();
  if (affiliation && !/extrals?|chasseur|xenoshield|crawler|ordre|aidh|inquisition|assassin/i.test(affiliation)) rows.push(["Affiliations", affiliation]);
  const origin = String(article.pnj?.origine ?? "").trim();
  if (origin && !/^[?_]+$/.test(origin)) rows.push(["Nationalité déclarée", origin]);
  return { id: "identite-realite", title: "Identité · Réalité", level: 2, blocks: [{ type: "table", rows }] };
}

function moveRealityToMj(article: J): void {
  const reality = article.sections?.find((section: J) => section.id === "informations-realite");
  if (!reality) return;
  reality.audience = "mj";
  reality.title = "Informations complémentaires · MJ";
}

function replaceReality(article: J, safeText: string): void {
  const reality = article.sections?.find((section: J) => section.id === "informations-realite");
  const block = reality?.blocks?.find((candidate: J) => typeof candidate?.text === "string");
  const mj = article.sections?.find((section: J) => section.id === "informations-mj");
  if (!block || !mj) throw new Error(`Séparation Réalité/MJ impossible : ${article.id}`);
  mj.blocks ??= [];
  mj.blocks.push({ type: "p", text: block.text });
  block.text = safeText;
}

export function editorializeHumansGalacticPnj(source: Array<Record<string, any>>): Array<Record<string, any>> {
  if (source.length !== Object.keys(DECISIONS).length) throw new Error(`Audit Humains galactiques incomplet : ${source.length}/${Object.keys(DECISIONS).length}`);
  return source.map((raw) => {
    const article = JSON.parse(JSON.stringify(raw)) as J;
    const decision = DECISIONS[article.id];
    if (!decision) throw new Error(`Fiche Humaine galactique non auditée : ${article.id}`);
    article.title = decision.publicTitle;
    article.pnj = { ...(article.pnj ?? {}), protect_truth_metadata: true };
    if (decision.realName) article.pnj.real_name = decision.realName;
    else delete article.pnj.real_name;
    article.pnj.nom_verite = decision.truthName ?? "";
    const designation = String(article.pnj.source_designation ?? "").trim();
    article.pnj.identity_keys = [...new Set([
      ...(article.pnj.identity_keys ?? []).filter((key: unknown) => String(key).trim() !== designation),
      decision.publicTitle,
      decision.realName,
      decision.truthName
    ].filter(Boolean))];
    delete article.pnj.source_designation;

    for (const section of article.sections ?? []) {
      if (section.id === "profil" || /^profil$/i.test(String(section.title ?? ""))) {
        section.title = "Profil MJ";
        section.audience = "mj";
      }
      for (const block of section.blocks ?? []) if (typeof block?.text === "string") block.text = clean(block.text);
    }

    const completion = COMPLETIONS[article.id];
    if (completion) {
      const mj = article.sections?.find((section: J) => section.id === "informations-mj");
      const block = mj?.blocks?.findLast((candidate: J) => typeof candidate?.text === "string");
      if (!block) throw new Error(`Bloc MJ tronqué introuvable : ${article.id}`);
      block.text = `${block.text.trim()} ${completion}`;
    }

    if (article.id === "personnages-verite-humains-galactiques-moira-blake" || article.id === "personnages-verite-humains-galactiques-kay-salzer") {
      moveRealityToMj(article);
    }
    if (article.id === "personnages-verite-humains-galactiques-kaylarie-dandwalb") {
      replaceReality(article, "Kaylarie Dandwalb travaille comme détective. Elle enquête en recueillant des témoignages et en utilisant des techniques de mentalisme.");
    }
    if (article.id === "personnages-verite-humains-galactiques-zairon-tenfi") {
      replaceReality(article, "Zairon Tenfi est surnommé le « Capuchon noir ». Sa présence et son regard lumineux intimident ceux qui le croisent.");
      const mj = article.sections?.find((section: J) => section.id === "informations-mj");
      const block = mj?.blocks?.find((candidate: J) => typeof candidate?.text === "string" && /joindre Nel’Akna jusque sur Terre\s*$/.test(candidate.text));
      if (block && !/[.!?…]$/.test(block.text.trim())) block.text += ".";
    }
    if (article.id === "personnages-verite-humains-galactiques-kim-sera") {
      replaceReality(article, "Kim Sera est agente spéciale de sécurité chez Biosun. Elle est chargée du confinement et de la récupération de cobayes.");
    }

    if (decision.realName && !decision.mjOnly) article.sections.unshift(safeIdentity(article, decision.realName));
    if (decision.mjOnly) {
      article.audience = "mj";
      for (const section of article.sections ?? []) section.audience = "mj";
    }
    return article;
  });
}
