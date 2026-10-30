type J = Record<string, any>;
type Decision = {
  publicTitle: string;
  realName: string;
  truthName?: string;
  mjOnly?: boolean;
  safeReality?: boolean;
  apparentAge?: string;
  nationality?: string;
  publicAffiliation?: string;
};

// Une décision explicite par fiche, après lecture continue des pages 5 à 96.
const DECISIONS: Record<string, Decision> = {
  "pnj-fleaux-neeba-ngubenani": { publicTitle: "Neeba Ngubenani", realName: "Neeba Ngubenani", truthName: "Neeba Ngubenani", apparentAge: "35 ans", nationality: "Zambienne", publicAffiliation: "Corporatiste" },
  "pnj-fleaux-fredegonda": { publicTitle: "Fredegonda Vonrim", realName: "", truthName: "Fredegonda Vonrim", mjOnly: true },
  "pnj-fleaux-baldwin-de-vandrick": { publicTitle: "Baldwin Vandrick", realName: "Baldwin Vandrick", safeReality: false, apparentAge: "70 ans", nationality: "Suisse", publicAffiliation: "Président de corporation" },
  "pnj-fleaux-rolf-de-vandrick": { publicTitle: "Rolf de Vandrick", realName: "Rolf de Vandrick", safeReality: false, apparentAge: "35 ans", nationality: "Suisse", publicAffiliation: "Crawler (mercenaire)" },
  "pnj-fleaux-raghnaid-maccalmain": { publicTitle: "Raghnaid Maccalmain", realName: "Raghnaid Maccalmain", truthName: "Pustule cancéreuse", apparentAge: "42 ans", nationality: "Écossaise" },
  "pnj-fleaux-siadara": { publicTitle: "Sianna Danein", realName: "Sianna Danein", truthName: "Siadara", apparentAge: "25 ans", nationality: "Allemande" },
  "pnj-fleaux-roi-du-givre": { publicTitle: "Le Roi du Givre", realName: "", truthName: "Le Roi du Givre", mjOnly: true },
  "pnj-fleaux-ryong-myung-sook": { publicTitle: "Ryong Myung-Sook", realName: "Ryong Myung-Sook", truthName: "Ryong Myung-Sook", apparentAge: "26 ans", nationality: "Coréenne", publicAffiliation: "Crawler (hooker et neurodiver)" },
  "pnj-fleaux-am-mleeac": { publicTitle: "Am’Mleeac", realName: "", truthName: "Am’Mleeac", mjOnly: true },
  "pnj-fleaux-dagon": { publicTitle: "Aberration Z-19", realName: "Aberration Z-19", truthName: "Dagon" },
  "pnj-fleaux-telipinu": { publicTitle: "Aberration Z-75", realName: "Aberration Z-75", truthName: "Telipinu" },
  "pnj-fleaux-r-sheraag": { publicTitle: "Aberration Z-45", realName: "Aberration Z-45", truthName: "R’Sheraag", safeReality: true },
  "pnj-fleaux-dsherra-neth": { publicTitle: "Aberration Z-47", realName: "Aberration Z-47", truthName: "Dsherra’neth", safeReality: true },
  "pnj-fleaux-pestiria": { publicTitle: "Pestiria", realName: "", truthName: "Pestiria", mjOnly: true },

  "pnj-fleaux-focus-anastasia-vargas-awan-aklima-anastasia-vargas": { publicTitle: "Anastasia Vargas", realName: "Anastasia Vargas", truthName: "R’Gahanath", apparentAge: "30 ans", nationality: "Bulgare" },
  "pnj-fleaux-focus-ombre-pape-valentino-sombra-valentino-sombra": { publicTitle: "Ombre-Pape", realName: "Ombre-Pape", truthName: "Absariath’V’Aagor" },
  "pnj-fleaux-focus-stephania-volkov-stephania-volkov": { publicTitle: "Stephania Volkov", realName: "Stephania Volkov", safeReality: false, apparentAge: "41 ans", nationality: "Russe" },
  "pnj-fleaux-focus-azaliah-springer-azaliah-springer": { publicTitle: "Azaliah Springer", realName: "Azaliah Springer", truthName: "Zaalia’Gaer", apparentAge: "38 ans" },
  "pnj-fleaux-focus-noah-brenneman-6-noah-brenneman": { publicTitle: "Noah Brenneman", realName: "Noah Brenneman", truthName: "Rnael’gem", safeReality: false, apparentAge: "49 ans", nationality: "Russe" },
  "pnj-fleaux-focus-olayinka-najja-8-olayinka-najja": { publicTitle: "Olayinka Najja", realName: "Olayinka Najja", truthName: "Olayinka", safeReality: false, apparentAge: "29 ans", nationality: "Nigériane" },
  "pnj-fleaux-focus-neals-corvo-ruth-neals-corvo": { publicTitle: "Neals Corvo", realName: "Neals Corvo", truthName: "Nerediath Lisindrith « Painscar »", safeReality: true, apparentAge: "41 ans", nationality: "Canadienne", publicAffiliation: "Crawler" },
  "pnj-fleaux-focus-mira-stephens-5-mir-a-stephens": { publicTitle: "Mira Stephens", realName: "Mira Stephens", truthName: "Mirrissi", safeReality: false, apparentAge: "49 ans", nationality: "Américaine" },
  "pnj-fleaux-focus-tellia-fedirivna-skrypnyk-dirivna-skrypnyk": { publicTitle: "Tellia Fedirivna Skrypnyk", realName: "Tellia Fedirivna Skrypnyk", truthName: "Tel’Shaerith", apparentAge: "40 ans", nationality: "Ukrainienne" },
  "pnj-fleaux-focus-kennisha-arnold--kennisha-arnold": { publicTitle: "Kennisha Arnold", realName: "Kennisha Arnold", truthName: "Karr’Shahan V’Rothl", apparentAge: "42 ans", nationality: "Américaine" },
  "pnj-fleaux-focus-lidira-pnj-091-lidira": { publicTitle: "Lidira", realName: "Lidira", truthName: "Lidira" },
  "pnj-fleaux-focus-nora-shakir--097-nora-shakir": { publicTitle: "Nora Shakir", realName: "Nora Shakir", truthName: "Furoncle purulent", safeReality: false, apparentAge: "29 ans", nationality: "Tunisienne" },
  "pnj-fleaux-focus-ana-diana-de-la-caza-diana-de-la-caza": { publicTitle: "Ana Diana de la Caza", realName: "Ana Diana de la Caza", truthName: "Anadia", apparentAge: "79 ans", nationality: "Espagnole" },
  "pnj-fleaux-focus-yegor-karamov-05-yegor-karamov": { publicTitle: "Yegor Karamov", realName: "Yegor Karamov", truthName: "Yegor Karamov", safeReality: false, apparentAge: "59 ans", nationality: "Russe" },
  "pnj-fleaux-focus-arkady-karamov-4-arkady-karamov": { publicTitle: "Arkady Karamov", realName: "Arkady Karamov", truthName: "Arkady Karamov / Yegor Karamov", safeReality: false, apparentAge: "57 ans", nationality: "Russe" },
  "pnj-fleaux-focus-sven-scythe--102-sven-scythe": { publicTitle: "Sven Scythe", realName: "Sven Scythe", truthName: "Selm Scytheri’Tayn", safeReality: true, nationality: "Estonienne" },
  "pnj-fleaux-focus-mila-shilove-094-mila-shilove": { publicTitle: "Mila Shilove", realName: "Mila Shilove", truthName: "Milushka Voroshilov", apparentAge: "46 ans", nationality: "Américano-russe", publicAffiliation: "Enders" },
  "pnj-fleaux-focus-maximilian-valentin-von-stroheim-tin-von-stroheim": { publicTitle: "Maximilian Valentin von Stroheim", realName: "Maximilian Valentin von Stroheim", truthName: "Maximilian Valentin von Stroheim", apparentAge: "26 ans", nationality: "Autrichienne", publicAffiliation: "Crawler (hooker et fixer)" },
  "pnj-fleaux-focus-arthur-savas-085-arthur-savas": { publicTitle: "Arthur Savas", realName: "Arthur Savas", truthName: "Aristaeus", apparentAge: "66 ans", nationality: "Grecque", publicAffiliation: "Religieux" },
  "pnj-fleaux-focus-margareta-diaconescu-areta-diaconescu": { publicTitle: "Margareta Diaconescu", realName: "Margareta Diaconescu", truthName: "Héméra", apparentAge: "42 ans", nationality: "Roumaine", publicAffiliation: "Religieux" },
  "pnj-fleaux-focus-ulfric-tamer-104-ulfric-tamer": { publicTitle: "Ulfric Tamer", realName: "Ulfric Tamer", truthName: "Rulfam", apparentAge: "55 ans", nationality: "Suédoise" },
  "pnj-fleaux-focus-leona-elliott-90-leona-elliott": { publicTitle: "Leona Elliott", realName: "Leona Elliott", truthName: "Li’loth", safeReality: true, apparentAge: "26 ans", nationality: "Américaine", publicAffiliation: "Tuatha Corporation" },
  "pnj-fleaux-focus-aberration-z-87--aberration-z-87": { publicTitle: "Aberration Z-87", realName: "Aberration Z-87", truthName: "Shy’Krerath", safeReality: true },
  "pnj-fleaux-focus-olla-berwick-099-olla-berwick": { publicTitle: "Olla Berwick", realName: "Olla Berwick", truthName: "Olla Berwick", safeReality: true, apparentAge: "30 ans", nationality: "Américaine", publicAffiliation: "Eversor Corporation" },
  "pnj-fleaux-focus-grim-grigoria-ravinsky-rigoria-ravinsky": { publicTitle: "Grigoria « Grim » Ravinsky", realName: "Grigoria « Grim » Ravinsky", truthName: "Greem’Sha", safeReality: true, apparentAge: "48 ans", nationality: "Ukrainienne", publicAffiliation: "Pègre (Bratva)" }
};

function clean(text: string): string {
  return text
    .replace(/￾/g, "-")
    .replace(/\bNeeba  voue\b/g, "Neeba voue")
    .replace(/qu’au moins elle ne pardonne aux vampires/g, "qu’au moins elle pardonne aux vampires")
    .replace(/\bse perds\b/g, "se perd")
    .replace(/\bses années entre 2020 et 2035\b/g, "ces années entre 2020 et 2035")
    .replace(/\bsous-estimer\b/g, "sous-estimer")
    .replace(/\bs’infiltter\b/g, "s’infiltrer")
    .replace(/ses pouvoirs ont été à sa descendante directe/g, "ses pouvoirs ont été transmis à sa descendante directe")
    .replace(/\bles gouvernement\b/g, "les gouvernements")
    .replace(/La presse n’a jamais relégué l’alerte/g, "La presse n’a jamais relayé l’alerte")
    .replace(/\bparvienne abuser\b/g, "parvienne à abuser")
    .replace(/\bles homme-poissons\b/g, "les hommes-poissons")
    .replace(/\btraque els atlantes\b/g, "traque les Atlantes")
    .replace(/\bsi on unique but\b/g, "si son unique but")
    .replace(/\bThul eu avec elle\b/g, "Thul eut avec elle")
    .replace(/\bnextar corporation\b/gi, "Nextar Corporation")
    .replace(/\ble muscus\b/g, "le mucus")
    .replace(/\bdans le pue et la vase\b/g, "dans le pus et la vase")
    .replace(/\bELLIOTTT\b/g, "ELLIOTT")
    .replace(/\bcelui de maria\b/g, "celui de paria")
    .replace(/\bde perfection, l’objectif\b/g, "la perfection, l’objectif")
    .replace(/\bCe qui l’a motivé\b/g, "Ce qui l’a motivée")
    .replace(/\bune famille d’oligarque russe\b/g, "une famille d’oligarques russes")
    .replace(/\ba été simplement massacré\b/g, "a été simplement massacrée")
    .replace(/\bmaitresse\b/gi, (value) => value[0] === "M" ? "Maîtresse" : "maîtresse")
    .replace(/\bmaitre\b/gi, (value) => value[0] === "M" ? "Maître" : "maître")
    .replace(/\bgout\b/g, "goût")
    .replace(/\bapparaitre\b/g, "apparaître");
}

function publicIdentity(decision: Decision): J {
  const rows: string[][] = [["Champ", "Valeur"], ["Nom / identité de Réalité", decision.realName]];
  if (decision.apparentAge) rows.push(["Âge apparent", decision.apparentAge]);
  if (decision.publicAffiliation) rows.push(["Affiliation publique", decision.publicAffiliation]);
  if (decision.nationality) rows.push(["Nationalité d’origine", decision.nationality]);
  return { id: "fleaux-identite-realite", title: "Identité · Réalité", level: 2, blocks: [{ type: "table", rows }] };
}

export function applyFleauxPnjEditorial(...groups: Array<Array<Record<string, any>>>): void {
  const source = groups.flat();
  if (source.length !== Object.keys(DECISIONS).length) throw new Error(`Audit Fléaux incomplet : ${source.length}/${Object.keys(DECISIONS).length}`);
  for (const article of source as J[]) {
    const decision = DECISIONS[article.id];
    if (!decision) throw new Error(`Fiche Fléaux non auditée : ${article.id}`);
    article.title = decision.publicTitle;
    article.pnj = {
      ...(article.pnj ?? {}),
      real_name: decision.realName,
      nom_verite: decision.truthName ?? "",
      protect_truth_metadata: true,
      identity_keys: [...new Set([...(article.pnj?.identity_keys ?? []), decision.publicTitle, decision.realName, decision.truthName].filter(Boolean))]
    };
    if (article.id === "pnj-fleaux-focus-arkady-karamov-4-arkady-karamov") {
      article.pnj.identity_keys = article.pnj.identity_keys.filter((key: unknown) => !/^Yegor Karamov(?:ich)?$/i.test(String(key).trim()));
    }
    if (decision.mjOnly) article.audience = "mj";

    for (const section of article.sections ?? []) {
      for (const block of section.blocks ?? []) if (typeof block?.text === "string") block.text = clean(block.text);
      if (section.id === "fleaux-focus-dossier") {
        section.audience = "mj";
        section.title = "Dossier MJ · Focus Fléaux";
      }
      if ((section.id === "fleaux-focus-realite" || section.id === "fleaux-focus-informations") && decision.safeReality !== true) {
        section.audience = "mj";
        section.title = "Informations cachées · Focus Fléaux";
      }
      if (section.id === "fleaux-focus-verite") section.audience = "mj";
    }

    if (!decision.mjOnly && decision.realName && !(article.sections ?? []).some((section: J) => section.id === "fleaux-identite-realite")) {
      const sections = article.sections ?? [];
      const firstMj = sections.findIndex((section: J) => section.audience === "mj");
      if (firstMj >= 0) sections.splice(firstMj, 0, publicIdentity(decision));
      else sections.unshift(publicIdentity(decision));
      article.sections = sections;
    }
  }
}
