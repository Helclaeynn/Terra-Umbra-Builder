type J = Record<string, any>;

type EditorialDecision = { publicTitle: string; realName?: string; mjOnly?: boolean };

// Décisions prises fiche par fiche après lecture du DOCX extraterrestre continu.
const DECISIONS: Record<string, EditorialDecision> = {
  "personnages-verite-extraterrestres-walter-jefferson": { publicTitle: "Walter Jefferson", realName: "Walter Jefferson" },
  "personnages-verite-extraterrestres-diana-maellchire": { publicTitle: "Diana Maellchire", realName: "Diana Maellchire" },
  "personnages-verite-extraterrestres-sunghyon-kang": { publicTitle: "Sunghyon Kang", realName: "Kang Sunghyon" },
  "personnages-verite-extraterrestres-soo-kyung-yu": { publicTitle: "Soo-Kyung Yu", realName: "Soo-Kyung Yu" },
  "personnages-verite-extraterrestres-zoran-kozic": { publicTitle: "Zoran Kozic", realName: "Zoran Kozic" },
  "personnages-verite-extraterrestres-summer-stevenson": { publicTitle: "Summer Stevenson", realName: "Summer Stevenson" },
  "personnages-verite-extraterrestres-nikita-chernov": { publicTitle: "Nikita Chernov", realName: "Nikita Chernov" },
  "personnages-verite-extraterrestres-esperanza-martinez": { publicTitle: "Esperanza Martinez", realName: "Esperanza Martinez" },
  "personnages-verite-extraterrestres-sonny-dawson": { publicTitle: "Sonny Dawson", realName: "Sonny Dawson" },
  "personnages-verite-extraterrestres-yae-jin-ryong": { publicTitle: "Yae-Jin Ryong", realName: "Yae-Jin Ryong" },
  "personnages-verite-extraterrestres-arkinas": { publicTitle: "Apollo Gaines", realName: "Apollo Gaines" },
  "personnages-verite-extraterrestres-tiana-hawkins": { publicTitle: "Tiana Hawkins", realName: "Tiana Hawkins" },
  "personnages-verite-extraterrestres-kraid": { publicTitle: "Kraid", realName: "Kevin Raid (« Kraid »)" },
  "personnages-verite-extraterrestres-nishikawa-yumia": { publicTitle: "Nishikawa Yumia", realName: "Nishikawa Yumia" },
  "personnages-verite-extraterrestres-derek-stevenson": { publicTitle: "Derek Stevenson", realName: "Derek Stevenson (« Raptor »)" },
  "personnages-verite-extraterrestres-rosalinda-maldonado": { publicTitle: "Rosalinda Maldonado", realName: "Rosalinda Maldonado" },
  "personnages-verite-extraterrestres-dai-zhenya": { publicTitle: "Dai Zhenya", realName: "Dai Zhenya" },
  "personnages-verite-extraterrestres-leona-elliott": { publicTitle: "Leona Elliott", realName: "Leona Elliott" },
  "personnages-verite-extraterrestres-malcolm-moss": { publicTitle: "Malcolm Moss", realName: "Malcolm Moss (« Mammoth »)" },
  "personnages-verite-extraterrestres-shykrerath": { publicTitle: "Aberration Z-87", realName: "Aberration Z-87" },
  "personnages-verite-extraterrestres-eyteliana-guwundha": { publicTitle: "Eyteliana Guwunda", realName: "Eyteliana Guwunda" },
  "personnages-verite-extraterrestres-ramaesh-talavalakr": { publicTitle: "Ramaesh Talavalakr", realName: "Ramaesh Talavalakr" },
  "personnages-verite-extraterrestres-meira-zoegell": { publicTitle: "Meira Zoegell", realName: "Meira Zoegell" },
  "personnages-verite-extraterrestres-makar-kazlouski": { publicTitle: "Makar Kazloǔski", realName: "Makar Kazloǔski" },
  "personnages-verite-extraterrestres-kaitlyn-alvin": { publicTitle: "Kaitlyn Alvin", realName: "Kaitlyn Alvin" },
  "personnages-verite-extraterrestres-valerian-gruzinsky": { publicTitle: "Valerian Gruzinsky", realName: "Valerian Gruzinsky" },
  "personnages-verite-extraterrestres-olishia-harmon": { publicTitle: "Olishia Harmon", realName: "Olishia Harmon" },
  "personnages-verite-extraterrestres-finn-dixon": { publicTitle: "Finn Dixon", realName: "Finn Dixon" },
  "personnages-verite-extraterrestres-ademichelle-dunard": { publicTitle: "Ademichelle Dunard", realName: "Ademichelle Dunard" },
  "personnages-verite-extraterrestres-le-chaperon-dor": { publicTitle: "Golden Hood", realName: "« Steeve » — Golden Hood" },
  "personnages-verite-extraterrestres-renaldi-rezzini": { publicTitle: "Renaldi Rezzini", realName: "Renaldi Rezzini" },
  "personnages-verite-extraterrestres-ivanna-yevgenievna": { publicTitle: "Ivanna Yevgenievna", realName: "Ivanna Yevgenievna" },
  "personnages-verite-extraterrestres-rsheraag": { publicTitle: "Aberration Z-45", realName: "Aberration Z-45" },
  "personnages-verite-extraterrestres-jorun-bergland": { publicTitle: "Jorun Bergland", realName: "Jorun Bergland" },
  "personnages-verite-extraterrestres-rached-kelley": { publicTitle: "Rached Kelley", realName: "Rached Kelley" },
  "personnages-verite-extraterrestres-dsherraneth": { publicTitle: "Aberration Z-47", realName: "Aberration Z-47" },
  "personnages-verite-extraterrestres-kaine-reid": { publicTitle: "Kaine Reid", realName: "Kaine Reid (« Daft Vador »)" },
  "personnages-verite-extraterrestres-chesiree-armstrong": { publicTitle: "Chesiree Armstrong", realName: "Chesiree Armstrong" },
  "personnages-verite-extraterrestres-shimamura-nobuhito": { publicTitle: "Shimamura Nobuhito", realName: "Shimamura Nobuhito" },
  "personnages-verite-extraterrestres-leia-irving": { publicTitle: "Leia Irving", realName: "Leia Irving" },
  "personnages-verite-extraterrestres-donald-griffin": { publicTitle: "Donald Griffin", realName: "Donald Griffin" },
  "personnages-verite-extraterrestres-emilie-dimont": { publicTitle: "Émilie Dimont", realName: "Émilie Dimont" },
  "personnages-verite-extraterrestres-murak-maar": { publicTitle: "Murak", realName: "Murak" },
  "personnages-verite-extraterrestres-adelaide-de-cuvier": { publicTitle: "Adélaïde de Cuvier", realName: "Adélaïde de Cuvier" },
  "personnages-verite-extraterrestres-isidoro-berganza": { publicTitle: "Isidoro Berganza", realName: "Isidoro Berganza (« le Vieux »)" },
  "personnages-verite-extraterrestres-peste-des-vases": { publicTitle: "Peste des vases", mjOnly: true },
  "personnages-verite-extraterrestres-atticus-sharp": { publicTitle: "Atticus Sharp", realName: "Atticus Sharp" },
  "personnages-verite-extraterrestres-myra-allan": { publicTitle: "Myra Allan", realName: "Myra Allan" },
  "personnages-verite-extraterrestres-chin-hyung-joon": { publicTitle: "Chin Hyung-Joon", realName: "Chin Hyung-Joon" },
  "personnages-verite-extraterrestres-amandara-barvadekar": { publicTitle: "Amandara Barvadekar", realName: "Amandara Barvadekar" },
  "personnages-verite-extraterrestres-tejana": { publicTitle: "Tejana Aguilar", realName: "Tejana Aguilar" },
  "personnages-verite-extraterrestres-zeelthan": { publicTitle: "Jack Tang", realName: "Jack Tang" },
  "personnages-verite-extraterrestres-opalia-sanders": { publicTitle: "Opalia Sanders", realName: "Opalia Sanders" },
  "personnages-verite-extraterrestres-maximilian-marshall": { publicTitle: "Maximilian Marshall", realName: "Maximilian Marshall" },
  "personnages-verite-extraterrestres-ariana-douglas": { publicTitle: "Ariana Douglas", realName: "Ariana Douglas" },
  "personnages-verite-extraterrestres-dhanuka-samara": { publicTitle: "Dhanuka Samara", realName: "Dhanuka Samara (« Inferno »)" },
  "personnages-verite-extraterrestres-carmen-hodges": { publicTitle: "Carmen Hodges", realName: "Carmen Hodges" },
  "personnages-verite-extraterrestres-yvan-abscisse": { publicTitle: "Yvan Abscisse", realName: "Yvan Abscisse" },
  "personnages-verite-extraterrestres-alicia-starrogue": { publicTitle: "Alicia Starrogue", realName: "Alicia Starrogue" },
  "personnages-verite-extraterrestres-t-n": { publicTitle: "T.N.", realName: "T.N." },
  "personnages-verite-extraterrestres-assymedira-fel": { publicTitle: "Asheylinn Medira", realName: "Asheylinn Medira" },
  "personnages-verite-extraterrestres-beltor-rixil": { publicTitle: "Bryan Rixil", realName: "Bryan Rixil" }
};

function apparentAge(value: unknown): string {
  const text = String(value ?? "").replace(/[«»]/g, "").trim();
  if (!text || /^[_?]+$/.test(text)) return "";
  return text.split(/\s*[-,;]\s*/)[0].trim().replace(/\s+/g, " ").replace(/\s+en apparence$/i, "");
}

function safeRealitySection(article: J, realName: string): J {
  const pnj = article.pnj ?? {};
  const rows: string[][] = [["Champ", "Valeur"], ["Nom / identité de Réalité", realName]];
  const age = apparentAge(pnj.age);
  if (age && !/[?_]/.test(age)) rows.push(["Âge apparent", age]);
  const affiliation = String(pnj.statut ?? "").replace(/[«»]/g, "").trim();
  if (affiliation && !/abominations?|créatures?|extrals?|extraterrestres?|chasseurs?|reptile|culte/i.test(affiliation)) {
    rows.push(["Affiliations", affiliation]);
  }
  const origin = String(pnj.origine ?? "").trim();
  if (origin && !/[?_]/.test(origin) && origin !== "-" && !/galactique|abyssale/i.test(origin)) {
    rows.push(["Nationalité déclarée", origin]);
  }
  return { id: "identite-realite", title: "Identité · Réalité", level: 2, blocks: [{ type: "table", rows }] };
}

function cleanText(text: string): string {
  return text
    .replace(/\bWalker JEFFERSON\b/g, "Walter JEFFERSON")
    .replace(/\ban proportion\b/g, "en proportion")
    .replace(/\bsans le gouvernement Californien\b/g, "dans le gouvernement californien")
    .replace(/\bpuis qu’il\b/g, "puisqu’il")
    .replace(/\bLeona ELLIOTTT\b/g, "Leona ELLIOTT")
    .replace(/\bun de ses plus bel arguments\b/g, "l’un de ses plus beaux arguments")
    .replace(/\bcorporatioon\b/g, "corporation")
    .replace(/\bElexaranda\b/g, "Elexarandra")
    .replace(/\bu véritable\b/g, "un véritable")
    .replace(/\buen sous-faction\b/g, "une sous-faction")
    .replace(/\bà termes\b/g, "à terme");
}

function restoreMalformedThreshold(article: J): void {
  const source = String(article.pnj?.source_extract ?? "");
  const marker = /Informations Réalité er Seuil\s*:/i;
  const start = source.search(marker);
  if (start < 0) return;
  const contentStart = start + source.slice(start).match(marker)![0].length;
  const end = source.indexOf("Informations Vérité", contentStart);
  if (end < 0) throw new Error(`Fin du bloc Réalité/Seuil introuvable pour ${article.id}`);
  const text = cleanText(source.slice(contentStart, end).replace(/\s+/g, " ").trim());
  if (!text) throw new Error(`Bloc Réalité/Seuil vide pour ${article.id}`);
  article.sections.splice(1, 0, {
    id: "informations-seuil-restaurees",
    title: "Informations Seuil · restaurées",
    level: 2,
    audience: "mj",
    blocks: [{ type: "p", text }]
  });
}

export function editorializeExtraterrestresPnj(source: Array<Record<string, any>>): Array<Record<string, any>> {
  if (source.length !== Object.keys(DECISIONS).length) {
    throw new Error(`Audit Extraterrestres incomplet : ${source.length}/${Object.keys(DECISIONS).length}`);
  }

  return source.map((raw) => {
    const article = JSON.parse(JSON.stringify(raw)) as J;
    const decision = DECISIONS[article.id];
    if (!decision) throw new Error(`Fiche Extraterrestres non auditée : ${article.id}`);

    article.title = decision.publicTitle;
    article.pnj = { ...(article.pnj ?? {}), protect_truth_metadata: true };
    if (decision.realName) article.pnj.real_name = decision.realName;
    if (article.id === "personnages-verite-extraterrestres-dai-zhenya") article.pnj.age = "65 ans en apparence ; 195 ans";
    if (article.id === "personnages-verite-extraterrestres-carmen-hodges") article.pnj.nom_verite = "Elexarandra";
    article.pnj.identity_keys = [...new Set([
      ...(article.pnj.identity_keys ?? []), decision.publicTitle, decision.realName, article.pnj.nom_verite
    ].filter(Boolean))];

    const sections = article.sections ?? [];
    for (const section of sections) {
      const title = String(section?.title ?? "");
      if (section?.id === "profil" || /^profil$/i.test(title)) {
        section.title = "Profil MJ";
        section.audience = "mj";
      }
      if (/seuil/i.test(title)) section.audience = "mj";
      for (const block of section?.blocks ?? []) {
        if (typeof block?.text === "string") block.text = cleanText(block.text);
      }
    }
    for (const entry of article.pnj.source_verite ?? []) {
      if (typeof entry?.text === "string") entry.text = cleanText(entry.text);
    }

    restoreMalformedThreshold(article);

    if (decision.realName && !decision.mjOnly) sections.unshift(safeRealitySection(article, decision.realName));
    if (decision.mjOnly) {
      article.audience = "mj";
      for (const section of sections) section.audience = "mj";
    }
    return article;
  });
}
