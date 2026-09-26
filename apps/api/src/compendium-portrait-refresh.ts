import type { Article } from "./compendium.js";

export type PortraitRefresh = {
  version: number;
  items: Array<{ id: string; src: string; visibility: "public" | "mj" }>;
  articles: Array<{ id: string; name: string; group: string }>;
};

const groups: Record<string, { group: string; groupOrder: number }> = {
  pegre: { group: "Pègre & réseaux criminels", groupOrder: 3 },
  gouvernement: { group: "Gouvernement & institutions", groupOrder: 4 },
  religions: { group: "Religions & communautés", groupOrder: 30 }
};

export function portraitRefreshNavigation(refresh: PortraitRefresh) {
  return refresh.articles.map((entry, index) => ({
    id: entry.id, dataset: "pnj-portrait-refresh-20260926", category: "Personnages",
    ...groups[entry.group], subgroup: "Portraits à documenter", subgroupOrder: 98, pageOrder: index + 1
  }));
}

// A portrait alone supplies no age, role, nature, biography or numerical values.
// Create these before the editor base snapshot so the ordinary wiki editor can
// publish and reload subsequent additions to the initially empty character.
export function addPortraitRefreshArticles(byId: Map<string, Article>, refresh: PortraitRefresh): void {
  for (const entry of refresh.articles) {
    if (byId.has(entry.id)) continue;
    const item = refresh.items.find((item) => item.id === entry.id);
    if (!item) throw new Error(`Portrait manquant : ${entry.id}`);
    const image = { src: item.src, alt: `Portrait de ${entry.name}`, caption: "" };
    byId.set(entry.id, {
      id: entry.id, title: entry.name, dataset: "pnj-portrait-refresh-20260926",
      category: "Personnages", sourceCategory: "Réalité", rebuildV2: true,
      status: "portrait_only", source: "Portrait transmis · septembre 2026",
      ...(item.visibility === "mj" ? { audience: "mj" } : {}),
      tags: ["réalité/type/personnage", "Réalité", "PNJ", "Portrait seul", "À compléter"],
      image, pnj: { completeness: "portrait_only", real_name: entry.name,
        nature: "", organisation: "", statut: "", age: "", origine: "", portrait: item.src },
      sections: [
        { id: "identite-apparente", title: "Identité apparente", level: 2, blocks: [
          { type: "table", rows: [["Identité", "Valeur"], ["Nom", entry.name],
            ["Âge", ""], ["Sexe", ""], ["Nationalité d’origine", ""], ["Rôle", ""]] }
        ] },
        { id: "biographie", title: "Biographie", level: 2, blocks: [] },
        { id: "dossier-mj", title: "Dossier MJ", level: 2, audience: "mj", blocks: [] },
        { id: "profil-statistique", title: "Profil statistique", level: 2, audience: "mj", blocks: [
          { type: "table", rows: [["Attribut", "Valeur"], ["Vigueur", ""], ["Agilité", ""],
            ["Esprit", ""], ["Volonté", ""], ["Charisme", ""]] },
          { type: "table", rows: [["Compétence", "Rang", "Jet"]] }
        ] }
      ]
    });
  }
}

export function applyRefreshedPortrait(article: Article, item: PortraitRefresh["items"][number]): void {
  if (!/^images\/portraits\/lot-3\/(public|mj)\/portrait-[a-z0-9-]+\.webp$/.test(item.src) ||
      !item.src.includes(`/${item.visibility}/`)) throw new Error(`Portrait invalide : ${item.id}`);
  // A later portrait uploaded through the wiki editor remains an author choice.
  if (article.__wikiPublishedEdit &&
      [article.image?.src, article.illustration?.src, article.pnj?.portrait]
        .some((src) => /(?:^|\/)uploads\//.test(String(src ?? "")))) return;
  // Keep superseded files in the archive, but hide them from the article gallery.
  article.gallery = (article.gallery ?? []).filter((media: { src: string }) =>
    media.src !== item.src && !/^images\/portraits\/lot-[123]\//.test(media.src));
  const media = { src: item.src, alt: `Portrait de ${article.title ?? article.id}`, caption: "" };
  article.image = media;
  if (article.illustration) article.illustration = { ...media };
  article.pnj ??= {};
  article.pnj.portrait = item.src;
  article.pnj.portrait_alt = media.alt;
  article.pnj.portrait_caption = "";
}
