type J = Record<string, any>;

type EditorialDecision = {
  publicTitle: string;
  realName?: string;
  mjOnly?: boolean;
};

// Chaque décision correspond à une lecture individuelle de la fiche active et
// de sa page dans TUC_Vérité_ les espèces fantastiques.docx.
const DECISIONS: Record<string, EditorialDecision> = {
  "personnages-verite-fantastiques-tobias-dorner": { publicTitle: "Tobias Dorner", realName: "Tobias Dorner" },
  "personnages-verite-fantastiques-lolitasex666-allholes": { publicTitle: "Casey Vaughn", realName: "Casey Vaughn" },
  "personnages-verite-fantastiques-alayna-daewynn": { publicTitle: "Alayna Daewynn", realName: "Alayna Daewynn" },
  "personnages-verite-fantastiques-neals-corvo": { publicTitle: "Neals Corvo", realName: "Neals Corvo" },
  "personnages-verite-fantastiques-ielynnoesi-alianmar": { publicTitle: "Lynda Noesi", realName: "Lynda Noesi" },
  "personnages-verite-fantastiques-ciliren-faelen": { publicTitle: "Ciliren Faelen", realName: "Ciliren Faelen, « Flamy »" },
  "personnages-verite-fantastiques-daldea-fann": { publicTitle: "Daldea Fann", realName: "Daldea Fann" },
  "personnages-verite-fantastiques-laegeltias-alduryn": { publicTitle: "Larry Duryn", realName: "Larry Duryn" },
  "personnages-verite-fantastiques-roberrik-reimer": { publicTitle: "Roberrick Reimer", realName: "Roberrick Reimer" },
  "personnages-verite-fantastiques-beatrix-kruger": { publicTitle: "Beatrix Krüger", realName: "Beatrix Krüger" },
  "personnages-verite-fantastiques-motsognir": { publicTitle: "Bob", realName: "Bob" },
  "personnages-verite-fantastiques-helmi-liikanen": { publicTitle: "Helmi Liikanen", realName: "Helmi Liikanen" },
  "personnages-verite-fantastiques-russell-vinderbeck": { publicTitle: "Russell Vinderbeck", realName: "Russell Vinderbeck" },
  "personnages-verite-fantastiques-mya-simon": { publicTitle: "Mya Simon", realName: "Mya Simon" },
  "personnages-verite-fantastiques-theoderid": { publicTitle: "Theoderid", realName: "Theoderid" },
  "personnages-verite-fantastiques-fredegonda": { publicTitle: "Fredegonda", mjOnly: true },
  "personnages-verite-fantastiques-atreesha": { publicTitle: "Atreesha Johnson", realName: "Atreesha Johnson" },
  "personnages-verite-fantastiques-yun": { publicTitle: "Yun", realName: "Yun" },
  "personnages-verite-fantastiques-phoebe-edgar": { publicTitle: "Phoebe Edgar", realName: "Phoebe Edgar" },
  "personnages-verite-fantastiques-izchara": { publicTitle: "Neekolas Hara", realName: "Neekolas Hara" },
  "personnages-verite-fantastiques-lhizza": { publicTitle: "Lisa", realName: "Lisa" },
  "personnages-verite-fantastiques-martin-green": { publicTitle: "Martin Green", realName: "Martin Green" },
  "personnages-verite-fantastiques-lidira": { publicTitle: "Lidira", mjOnly: true },
  "personnages-verite-fantastiques-king-frazier": { publicTitle: "King Frazier", realName: "King Frazier" },
  "personnages-verite-fantastiques-ashorn": { publicTitle: "Gerald Ashorn", realName: "Gerald Ashorn" },
  "personnages-verite-fantastiques-cassie-murdock": { publicTitle: "Cassie Murdock", realName: "Cassie Murdock" },
  "personnages-verite-fantastiques-gawel-prowacjesky": { publicTitle: "Gawel Prowacjesky", realName: "Gawel Prowacjesky" },
  "personnages-verite-fantastiques-emilynn-marshall": { publicTitle: "Emilynn Marshall", realName: "Emilynn Marshall" },
  "personnages-verite-fantastiques-kristian-morales": { publicTitle: "Kristian Morales", realName: "Kristian Morales" },
  "personnages-verite-fantastiques-grim": { publicTitle: "Grim", realName: "Grim (Grigoria Ravinsky)" },
  "personnages-verite-fantastiques-shiloh-floyd": { publicTitle: "Shiloh Floyd", realName: "Shiloh Floyd" },
  "personnages-verite-fantastiques-marjolein-enneman": { publicTitle: "Marjolein Enneman", realName: "Marjolein Enneman" },
  "personnages-verite-fantastiques-samanthea-malanwe": { publicTitle: "Samantha Maxwell", realName: "Samantha Maxwell" },
  "personnages-verite-fantastiques-skyler-murray": { publicTitle: "Skyler Murray", realName: "Skyler Murray" },
  "personnages-verite-fantastiques-selravae-rocyne": { publicTitle: "Sylvia Rose", realName: "Sylvia Rose" },
  "personnages-verite-fantastiques-jay-bentley": { publicTitle: "Jay Bentley", realName: "Jay Bentley" },
  "personnages-verite-fantastiques-cassandra-helen": { publicTitle: "Cassandra Helen", realName: "Cassandra Helen" },
  "personnages-verite-fantastiques-selm-scytheri": { publicTitle: "Sven Scythe", realName: "Sven Scythe" },
  "personnages-verite-fantastiques-ceara-duinghail": { publicTitle: "Ceara Duinghail", realName: "Ceara Duinghail" },
  "personnages-verite-fantastiques-tharlal-rark": { publicTitle: "Thor", realName: "Thor" },
  "personnages-verite-fantastiques-keegan-foster": { publicTitle: "Keegan Foster", realName: "Keegan Foster" },
  "personnages-verite-fantastiques-kareen-botha": { publicTitle: "Kareen Botha", realName: "Kareen Botha" },
  "personnages-verite-fantastiques-kevin-eckker": { publicTitle: "Kevin Eckker", realName: "Kevin Eckker" },
  "personnages-verite-fantastiques-morgan-nic-brandubh": { publicTitle: "Morgan nic Brandubh", realName: "Morgan nic Brandubh" },
  "personnages-verite-fantastiques-alexander-shorolth": { publicTitle: "Alexander Shorolth", realName: "Alexander Shorolth" },
  "personnages-verite-fantastiques-silia-ellen-sky": { publicTitle: "Silia Ellen Sky", realName: "Silia Ellen Sky" },
  "personnages-verite-fantastiques-kain-ferno": { publicTitle: "Kain Ferno", realName: "Kain Ferno" },
  "personnages-verite-fantastiques-katell-odalaigh": { publicTitle: "Katell O’Dalaigh", realName: "Katell O’Dalaigh" },
  "personnages-verite-fantastiques-newt-greetterro": { publicTitle: "Newt Greetterro", realName: "Newt Greetterro" },
  "personnages-verite-fantastiques-kerys": { publicTitle: "Kerys", realName: "Kerys" },
  "personnages-verite-fantastiques-koldraalsheroh": { publicTitle: "Connor Shero", realName: "Connor Shero" },
  "personnages-verite-fantastiques-andrea-shield": { publicTitle: "Andrea Shield", realName: "Andrea Shield" }
};

function apparentAge(value: unknown): string {
  const text = String(value ?? "").replace(/[«»]/g, "").trim();
  if (!text || /^[_?]+$/.test(text)) return "";
  return text.split(/\s*[-,]\s*/)[0].trim().replace(/\s+/g, " ");
}

function safeRealitySection(article: J, realName: string): J {
  const pnj = article.pnj ?? {};
  const rows: string[][] = [["Champ", "Valeur"], ["Nom / identité de Réalité", realName]];
  const age = apparentAge(pnj.age);
  if (age && !age.includes("?") && !age.includes("_")) rows.push(["Âge apparent", age]);
  const affiliation = String(pnj.statut ?? "").replace(/[«»]/g, "").trim();
  if (affiliation && !/abominations?|créatures?|duergars?|gobelins?|elfes?|nains?|mages?|chasseurs?/i.test(affiliation)) {
    rows.push(["Affiliations", affiliation]);
  }
  const origin = String(pnj.origine ?? "").trim();
  if (origin && !/[?_]/.test(origin) && origin !== "-" && !/azménorien|aèr|silkestria|inryase/i.test(origin)) {
    rows.push(["Nationalité déclarée", origin]);
  }
  return { id: "identite-realite", title: "Identité · Réalité", level: 2, blocks: [{ type: "table", rows }] };
}

function cleanText(text: string): string {
  return text
    .replace(/\bschiisme\b/gi, "schisme")
    .replace(/\bson cops est difforme\b/g, "son corps est difforme")
    .replace(/\bc’était u véritable fléau\b/g, "c’était un véritable fléau")
    .replace(/\bMarjolein réapparu\b/g, "Marjolein réapparut")
    .replace(/\bréhaussa\b/g, "rehaussa")
    .replace(/\belle créer des Deimons\b/g, "elle crée des Deimons")
    .replace(/\belle se perds\b/g, "elle se perd")
    .replace(/\bla raven corps\b/gi, "la Ravencorp")
    .replace(/\bvue les quantités\b/g, "vu les quantités")
    .replace(/\bayant notamment arracher\b/g, "ayant notamment arraché")
    .replace(/\bessayant souvent de bruler\b/g, "essayant souvent de brûler")
    .replace(/\bKarenn mena\b/g, "Kareen mena");
}

export function editorializeFantastiquesPnj(source: Array<Record<string, any>>): Array<Record<string, any>> {
  if (source.length !== Object.keys(DECISIONS).length) {
    throw new Error(`Audit Fantastiques incomplet : ${source.length}/${Object.keys(DECISIONS).length}`);
  }

  return source.map((raw) => {
    const article = JSON.parse(JSON.stringify(raw)) as J;
    const decision = DECISIONS[article.id];
    if (!decision) throw new Error(`Fiche Fantastiques non auditée : ${article.id}`);

    article.title = decision.publicTitle;
    article.pnj = { ...(article.pnj ?? {}), protect_truth_metadata: true };
    if (decision.realName) article.pnj.real_name = decision.realName;
    article.pnj.identity_keys = [...new Set([
      ...(article.pnj.identity_keys ?? []),
      decision.publicTitle,
      decision.realName,
      article.pnj.nom_verite
    ].filter(Boolean))];

    if (article.id === "personnages-verite-fantastiques-roberrik-reimer") {
      article.pnj.nom_verite = "Roberrick Reimer";
      article.pnj.identity_keys = [...new Set([...article.pnj.identity_keys, "Roberrik Reimer", "Roberrick Reimer"])];
    }

    const sections = article.sections ?? [];
    for (const section of sections) {
      const title = String(section?.title ?? "");
      if (section?.id === "profil" || /^profil$/i.test(title)) {
        section.title = "Profil MJ";
        section.audience = "mj";
      }
      if (/seuil/i.test(title)) section.audience = "mj";
      if (article.id === "personnages-verite-fantastiques-marjolein-enneman" && section?.id === "informations-realite-1") {
        // La source qualifie explicitement ce bloc de « Réalité et seuil » :
        // son contenu (deimon, magie, Ombre-monde) ne doit pas être public.
        section.audience = "mj";
        section.title = "Informations Seuil";
      }
      if (article.id === "personnages-verite-fantastiques-motsognir" && section?.id === "informations-realite-1") {
        // Le dossier Grands Exilés actuel donne « Bob » comme couverture. La
        // mention mythologique de Motsognir reste toutefois un indice MJ.
        section.audience = "mj";
        section.title = "Mention mythologique · MJ";
      }
      for (const block of section?.blocks ?? []) {
        if (typeof block?.text === "string") {
          block.text = cleanText(block.text);
          if (article.id === "personnages-verite-fantastiques-roberrik-reimer") {
            block.text = block.text
              .replace(/\bRoberrik\b/g, "Roberrick")
              .replace(/\bgout\b/g, "goût")
              .replace(/\bchaines hôtelières\b/g, "chaînes hôtelières")
              .replace(/\bfastfoods\b/g, "fast-foods");
          }
        }
      }
    }
    for (const entry of article.pnj.source_verite ?? []) {
      if (typeof entry?.text === "string") {
        entry.text = cleanText(entry.text);
        if (article.id === "personnages-verite-fantastiques-roberrik-reimer") {
          entry.text = entry.text.replace(/\bRoberrik\b/g, "Roberrick");
        }
      }
    }

    if (article.id === "personnages-verite-fantastiques-phoebe-edgar") {
      const reality = sections.find((section: J) => section?.id === "informations-realite-1");
      for (const block of reality?.blocks ?? []) {
        if (typeof block?.text === "string" && !/[.!?…]$/.test(block.text.trim())) block.text += ".";
      }
    }

    if (decision.realName && !decision.mjOnly) {
      sections.unshift(safeRealitySection(article, decision.realName));
    }

    if (decision.mjOnly) {
      article.audience = "mj";
      for (const section of sections) section.audience = "mj";
    }

    return article;
  });
}
