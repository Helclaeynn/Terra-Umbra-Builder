type Article = Record<string, any> & { id: string; sections?: Array<Record<string, any>> };

// Âges de Réalité arbitrés par l'auteur le 23 septembre 2026.
const CONFIRMED_AGES: Record<string, number> = {
  "pnj-crawlers-docx-aisha-white": 25,
  "personnages-verite-humains-galactiques-alladava-kjoll": 45,
  "personnages-verite-especes-anahita": 28,
  "pnj-pegre-dante-guzman": 31,
  "pnj-pegre-fuyumi-shinoda": 38,
  "personnages-verite-humains-galactiques-kay-salzer": 42,
  "personnages-verite-especes-lorinae-athegos": 30,
  "personnages-verite-especes-neeba-ngubenani": 49,
  "pnj-fleaux-focus-olayinka-najja-8-olayinka-najja": 29,
  "pnj-police-ryan-rowe": 42,
  "personnages-verite-humains-galactiques-saskia": 34,
  "pnj-crawlers-antisysteme-p70-ulfric-tamer": 48
};

export function applyConfirmedPnjRealityAges(byId: Map<string, Article>): void {
  for (const [id, age] of Object.entries(CONFIRMED_AGES)) {
    const article = byId.get(id);
    if (!article) throw new Error(`PNJ · âge confirmé, fiche absente : ${id}`);
    let changed = false;
    for (const section of article.sections ?? []) {
      for (const block of section.blocks ?? []) {
        if (block.type !== "table" || !Array.isArray(block.rows)) continue;
        for (const row of block.rows) {
          if (!Array.isArray(row)) continue;
          const label = String(row[0] ?? "").trim();
          if (section.audience === "mj") {
            // Keep the age of Vérité after the separator; correct only the
            // apparent civilian age reproduced in the source MJ.
            if (/^âge\b/i.test(label) && !/^âge réel\b/i.test(label)) {
              row[1] = String(row[1] ?? "").replace(/\b\d{1,3}\s*ans\b/i, `${age} ans`);
            }
          } else if (/^âge(?: apparent)?$/i.test(label)) {
            row[1] = `${age} ans`;
            changed = true;
          }
        }
      }
    }
    if (!changed) {
      const card = (article.sections ?? []).find((section) => section.id === "identite-realite-consolidee");
      const rows = card?.blocks?.find((block: Record<string, any>) => block.type === "table")?.rows;
      if (!Array.isArray(rows)) throw new Error(`PNJ · carte de Réalité absente : ${id}`);
      rows.push(["Âge", `${age} ans`]);
    }
    if (article.pnj && typeof article.pnj === "object") article.pnj.age = `${age} ans`;
    if (Array.isArray(article.__realityIdentityConflicts)) {
      article.__realityIdentityConflicts = article.__realityIdentityConflicts.filter((field: string) => field !== "Âge");
    }
  }
}
