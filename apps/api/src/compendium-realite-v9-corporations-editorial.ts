import {
  COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES,
  COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT
} from "./compendium-realite-v9-corporations.js";
import {
  CORPORATION_HIERARCHY_ROWS,
  CORPORATION_ORGANIZATION_PROSE
} from "./compendium-realite-v9-corporations-hierarchy.js";

type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: string[][] };

const paragraph = (text: string): Block => ({ type: "p", style: "lore", text });
const table = (rows: string[][]): Block => ({ type: "table", rows });

const cleanText = (raw: unknown) => {
  let text = String(raw ?? "")
    .replace(/[�￾]/gu, "-")
    .replace(//gu, "•")
    .replace(/·/gu, " ")
    .replace(/[‘’]/gu, "’")
    .replace(/\s+/gu, " ")
    .replace(/\s+([,.;:!?])/gu, "$1")
    .replace(/\s+»/gu, " »")
    .replace(/«\s*/gu, "« ")
    .replace(/\s*([–—])\s*/gu, " $1 ")
    .trim();

  const substitutions: Array<[RegExp, string]> = [
    [/\bEtats-Unis\b/gu, "États-Unis"],
    [/\bEtats-unis\b/gu, "États-Unis"],
    [/\bEtats\b/gu, "États"],
    [/\bmegacorporations\b/gu, "mégacorporations"],
    [/\bMegacorporations\b/gu, "Mégacorporations"],
    [/\bmegacorporation\b/gu, "mégacorporation"],
    [/\bMegacorporation\b/gu, "Mégacorporation"],
    [/\bmegacités\b/gu, "mégacités"],
    [/\bmegacenters\b/gu, "mégacenters"],
    [/\bbienêtre\b/gu, "bien-être"],
    [/\bmaitre\b/gu, "maître"],
    [/\bmaitrise\b/gu, "maîtrise"],
    [/\bentrainement\b/gu, "entraînement"],
    [/\bs’entrainer\b/gu, "s’entraîner"],
    [/\bd’entrainer\b/gu, "d’entraîner"],
    [/\baout\b/gu, "août"],
    [/\bcinema\b/gu, "cinéma"],
    [/\bTalaCorporation\b/gu, "Tala Corporation"],
    [/\bTalacorporation\b/gu, "Tala Corporation"],
    [/\bnord-coérenne\b/gu, "nord-coréenne"],
    [/\bNord-coérenne\b/gu, "Nord-coréenne"],
    [/\bnord-Coréenne\b/gu, "nord-coréenne"],
    [/\bNord-Coréenne\b/gu, "Nord-coréenne"],
    [/\bNord-coréens\b/gu, "Nord-Coréens"],
    [/\bCorée du nord\b/gu, "Corée du Nord"],
    [/\bcorée du nord\b/gu, "Corée du Nord"],
    [/\bnouvelle Zélande\b/gu, "Nouvelle-Zélande"],
    [/\bTala corporation\b/gu, "Tala Corporation"],
    [/\bLesli WRIGHT\b/gu, "Leslie WRIGHT"],
    [/\bafin d’Intégrer\b/gu, "afin d’intégrer"],
    [/\bReseach Cluster\b/gu, "Research Cluster"],
    [/\bindustrie1\b/gu, "industrie"],
    [/\bmégacororations\b/gu, "mégacorporations"],
    [/\bLio-Kashiwa\b/gu, "Liao Kashiwa"],
    [/\bpanamerca\b/gu, "Panamerica"],
    [/\bPhenix corporation\b/gu, "Phoenix corporation"],
    [/\bWellesrping\b/gu, "Wellspring"],
    [/\bIsraêl\b/gu, "Israël"],
    [/\bFistlawyers\b/gu, "Firstlawyers"],
    [/\bcorproative\b/gu, "corporative"],
    [/\bcrawklers\b/gu, "Crawlers"],
    [/\bNextar\b/gu, "Nexstar"],
    [/\bNord-Coréens Pour\b/gu, "Nord-Coréens. Pour"]
  ];
  for (const [pattern, replacement] of substitutions) text = text.replace(pattern, replacement);
  return text;
};

const endsSentence = (text: string) => /[.!?…»”)]$/u.test(text.trim());
const startsLowercase = (text: string) => /^[a-zà-öø-ÿ]/u.test(text.trim());

const mergeFragments = (texts: string[]) => {
  const merged: string[] = [];
  for (const raw of texts) {
    const text = cleanText(raw);
    if (!text) continue;
    const previous = merged.at(-1);
    if (
      previous &&
      !previous.startsWith("•") &&
      !text.startsWith("•") &&
      (!endsSentence(previous) || startsLowercase(text))
    ) {
      merged[merged.length - 1] = cleanText(`${previous} ${text}`);
    } else {
      merged.push(text);
    }
  }
  return merged;
};

const splitLong = (raw: string, limit = 590) => {
  let remaining = cleanText(raw);
  const chunks: string[] = [];
  while (remaining.length > limit) {
    const window = remaining.slice(0, limit + 1);
    const candidates = [". ", "? ", "! ", "; ", ": ", ", ", " "];
    let cut = -1;
    let forcedSentenceBreak = false;
    for (const marker of candidates) {
      const found = window.lastIndexOf(marker);
      const sentenceBoundary = marker === ". " || marker === "? " || marker === "! ";
      const minimum = sentenceBoundary ? 120 : Math.floor(limit * 0.55);
      if (found >= minimum) {
        cut = found + (marker.trim() ? marker.length - 1 : 0);
        forcedSentenceBreak = !sentenceBoundary;
        break;
      }
    }
    if (cut < 1) {
      cut = limit;
      forcedSentenceBreak = true;
    }
    let chunk = remaining.slice(0, cut).trim();
    if (forcedSentenceBreak && !endsSentence(chunk)) {
      chunk = `${chunk.replace(/[,;:]$/u, "")}.`;
    }
    chunks.push(chunk);
    remaining = remaining.slice(cut).trim();
    if (forcedSentenceBreak) {
      remaining = remaining.replace(/^([a-zà-öø-ÿ])/u, (letter) => letter.toLocaleUpperCase("fr"));
    }
  }
  if (remaining) chunks.push(remaining);
  return chunks;
};

const cleanRows = (rows: unknown[][]) =>
  rows.map((row) => row.map((cell) => cleanText(cell)));

const paragraphsAndLists = (rawTexts: string[]) => {
  const texts = rawTexts.map(cleanText).filter(Boolean);
  const blocks: Block[] = [];
  const prose: string[] = [];

  const flushProse = () => {
    for (const text of mergeFragments(prose.splice(0))) {
      for (const chunk of splitLong(text)) blocks.push(paragraph(chunk));
    }
  };

  for (let index = 0; index < texts.length;) {
    if (!texts[index].startsWith("•")) {
      prose.push(texts[index]);
      index += 1;
      continue;
    }

    flushProse();
    const items: string[] = [];
    while (index < texts.length && texts[index].startsWith("•")) {
      let item = cleanText(texts[index].replace(/^•\s*/u, ""));
      index += 1;
      while (
        index < texts.length &&
        !texts[index].startsWith("•") &&
        (/[,:;]$/u.test(item) || startsLowercase(texts[index]))
      ) {
        item = cleanText(`${item} ${texts[index]}`);
        index += 1;
      }
      if (item) items.push(item);
    }
    if (items.length) blocks.push(table([["Éléments"], ...items.map((item) => [item])]));
  }
  flushProse();
  return blocks;
};

const cleanGenericBlocks = (blocks: Array<Record<string, any>>) => {
  const result: Block[] = [];
  let prose: string[] = [];
  const flush = () => {
    result.push(...paragraphsAndLists(prose));
    prose = [];
  };
  for (const block of blocks) {
    if (block.type === "p") {
      prose.push(String(block.text ?? ""));
    } else if (block.type === "table") {
      flush();
      result.push(table(cleanRows(block.rows ?? [])));
    }
  }
  flush();
  return result;
};

const editWarArticle = (article: Record<string, any>) => ({
  ...article,
  sections: (article.sections ?? []).map((section: Record<string, any>) => {
    const texts = (section.blocks ?? [])
      .filter((block: Record<string, any>) => block.type === "p")
      .map((block: Record<string, any>) => cleanText(block.text));
    const versus = texts.indexOf("VS");
    const context = texts.indexOf("Contexte:");
    const left = texts
      .slice(1, versus)
      .map((text: string) => cleanText(text.replace(/^•\s*/u, "")))
      .filter(Boolean);
    const right = texts
      .slice(versus + 1, context)
      .map((text: string) => cleanText(text.replace(/^•\s*/u, "")))
      .filter(Boolean);
    return {
      ...section,
      blocks: [
        table([
          ["Camp", "Corporations"],
          ["Alliance A", left.join(" ; ")],
          ["Alliance B", right.join(" ; ")]
        ]),
        ...paragraphsAndLists(texts.slice(context + 1))
      ]
    };
  })
});

const editCorporationArticle = (article: Record<string, any>) => ({
  ...article,
  sections: (article.sections ?? []).map((section: Record<string, any>) => {
    if (section.id === "activites") {
      return { ...section, blocks: cleanGenericBlocks(section.blocks ?? []) };
    }
    if (section.id !== "branches") return section;

    const sourceBlocks = (section.blocks ?? []).filter(
      (block: Record<string, any>) =>
        !(block.type === "p" && String(block.text ?? "").startsWith("Organigramme source"))
    );
    const prose = sourceBlocks
      .filter((block: Record<string, any>) => block.type === "p")
      .map((block: Record<string, any>) => String(block.text ?? ""));
    const organizationProse = CORPORATION_ORGANIZATION_PROSE[String(article.id)];
    if (organizationProse) prose.push(organizationProse);

    const leadership = sourceBlocks.find((block: Record<string, any>) => block.type === "table");
    const hierarchy = CORPORATION_HIERARCHY_ROWS[String(article.id)] ?? [];
    return {
      ...section,
      blocks: [
        ...paragraphsAndLists(prose),
        ...(leadership ? [table(cleanRows(leadership.rows ?? []))] : []),
        table([
          ["Niveau", "Responsable", "Périmètre", "Rattachement"],
          ...cleanRows(hierarchy)
        ])
      ]
    };
  })
});

const editChronology = (section: Record<string, any>) => {
  const texts = (section.blocks ?? [])
    .filter((block: Record<string, any>) => block.type === "p")
    .map((block: Record<string, any>) => cleanText(block.text));
  const historyStart = texts.findIndex((text: string) => text.startsWith("Entre 2024 et 2030"));
  const timeline: Array<[string, string]> = [];
  for (const raw of texts.slice(1, historyStart)) {
    const match = raw.match(/^•\s*(\d{4})\s*[–—-]\s*(.*)$/u);
    if (match) {
      timeline.push([match[1], match[2]]);
    } else if (timeline.length) {
      const current = timeline[timeline.length - 1];
      const continuation = raw.replace(/^-\s*/u, "");
      const hasOpenQuote = (current[1].match(/«/gu)?.length ?? 0) > (current[1].match(/»/gu)?.length ?? 0);
      const joinsDirectly =
        startsLowercase(continuation) ||
        hasOpenQuote ||
        /(?:[,;:]|\b(?:et|ou|de|des|du|la|le|les|un|une))$/iu.test(current[1]);
      current[1] = cleanText(`${current[1]}${joinsDirectly ? " " : ". "}${continuation}`);
    }
  }
  return {
    ...section,
    blocks: [
      table([["Année", "Événement"], ...timeline]),
      ...paragraphsAndLists(texts.slice(historyStart))
    ]
  };
};

const editFamilies = (section: Record<string, any>) => ({
  ...section,
  blocks: [
    table([
      ["Famille", "Activités"],
      ...(section.blocks ?? []).map((block: Record<string, any>) => {
        const [family, ...description] = cleanText(block.text).split(" — ");
        return [family, description.join(" — ")];
      })
    ])
  ]
});

const editInventory = (section: Record<string, any>) => {
  const rows = (section.blocks ?? []).find((block: Record<string, any>) => block.type === "table")?.rows ?? [];
  const entries = rows.slice(1).map((row: unknown[]) => cleanRows([row])[0]);
  const developed = entries.filter((row: string[]) => row[2] === "Fiche développée");
  const cited = entries.filter((row: string[]) => row[2] !== "Fiche développée");
  return {
    ...section,
    title: "Panorama des corporations",
    blocks: [
      paragraph("Les trente-quatre corporations suivantes disposent d’une présentation détaillée dans le compendium."),
      table([["Famille", "Corporation"], ...developed.map(([family, name]: string[]) => [family, name])]),
      paragraph("Vingt-six autres corporations appartiennent aux mêmes familles, sans autre information disponible."),
      table([["Famille", "Corporation"], ...cited.map(([family, name]: string[]) => [family, name])])
    ]
  };
};

export const COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_HUB_ENRICHMENT = {
  ...COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT,
  sections: (COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT.sections ?? []).map(
    (section: Record<string, any>) => {
      if (section.id === "corporations-source-chronologie") return editChronology(section);
      if (section.id === "corporations-source-familles") return editFamilies(section);
      if (section.id === "corporations-source-inventaire") return editInventory(section);
      return { ...section, blocks: cleanGenericBlocks(section.blocks ?? []) };
    }
  )
} as Record<string, any>;

export const COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES =
  COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES.map((article) =>
    article.id === "realite-v9-guerres-corporatives"
      ? editWarArticle(article)
      : editCorporationArticle(article)
  ) as Array<Record<string, any>>;
