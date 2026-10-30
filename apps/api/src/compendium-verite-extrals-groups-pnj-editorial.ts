type J = Record<string, any>;
type Decision = { publicTitle: string; realName?: string; mjOnly?: boolean };

// Une décision explicite par fiche, après contrôle du PDF continu.
const DECISIONS: Record<string, Decision> = {
  "personnages-verite-extrals-groupes-walter-jefferson": { publicTitle: "Walter Jefferson", realName: "Walter Jefferson" },
  "personnages-verite-extrals-groupes-nikita-chernov": { publicTitle: "Nikita Chernov", realName: "Nikita Chernov" },
  "personnages-verite-extrals-groupes-ramaesh-talavalakr": { publicTitle: "Ramaesh Talavalakr", realName: "Ramaesh Talavalakr" },
  "personnages-verite-extrals-groupes-eyteliana-guwunda": { publicTitle: "Eyteliana Guwunda", realName: "Eyteliana Guwunda" },
  "personnages-verite-extrals-groupes-shanandra-fear": { publicTitle: "Shanandra Fear", realName: "Shanandra Fear" },
  "personnages-verite-extrals-groupes-appolo-gaines": { publicTitle: "Apollo Gaines", realName: "Apollo Gaines" },
  "personnages-verite-extrals-groupes-leia-irving": { publicTitle: "Leia Irving", realName: "Leia Irving" },
  "personnages-verite-extrals-groupes-rached-kelley": { publicTitle: "Rached Kelley", realName: "Rached Kelley" },
  "personnages-verite-extrals-groupes-amandara-barvadekar": { publicTitle: "Amandara Barvadekar", realName: "Amandara Barvadekar" },
  "personnages-verite-extrals-groupes-karl-moonger": { publicTitle: "Karl Moonger", realName: "Karl Moonger" },
  "personnages-verite-extrals-groupes-elleth-dyx": { publicTitle: "Elleth-Dyx", mjOnly: true },
  "personnages-verite-extrals-groupes-kirstyn-kjoll": { publicTitle: "Kirstyn Kjoll", realName: "Kirstyn Kjoll" },
  "personnages-verite-extrals-groupes-rikardo-schenaz": { publicTitle: "Rikardo Schenaz", realName: "Rikardo Schenaz" },
  "personnages-verite-extrals-groupes-diana-maellchire": { publicTitle: "Diana Maellchire", realName: "Diana Maellchire" },
  "personnages-verite-extrals-groupes-summer-stevenson": { publicTitle: "Summer Stevenson", realName: "Summer Stevenson" },
  "personnages-verite-extrals-groupes-jaymor-milgan": { publicTitle: "Jaymor Milgan", realName: "Jaymor Milgan" },
  "personnages-verite-extrals-groupes-olisha-harmon": { publicTitle: "Olishia Harmon", realName: "Olishia Harmon" },
  "personnages-verite-extrals-groupes-derek-stevenson": { publicTitle: "Derek Stevenson", realName: "Derek Stevenson" },
  "personnages-verite-extrals-groupes-kang-sung-hyung": { publicTitle: "Kang Sunghyon", realName: "Kang Sunghyon" },
  "personnages-verite-extrals-groupes-so-ouk-32": { publicTitle: "Soo-Kyung Yu", realName: "Soo-Kyung Yu" },
  "personnages-verite-extrals-groupes-gong-min-ju": { publicTitle: "Gong Min-Ju", realName: "Gong Min-Ju" },
  "personnages-verite-extrals-groupes-katasha-barkirov": { publicTitle: "Katasha Barkirov", realName: "Katasha Barkirov" },
  "personnages-verite-extrals-groupes-mazeeda-el-sadheen": { publicTitle: "Mazeeda El’Sadheen", realName: "Mazeeda El’Sadheen" },
  "personnages-verite-extrals-groupes-sharmon-leonard": { publicTitle: "Sharmon Leonard", realName: "Sharmon Leonard" },
  "personnages-verite-extrals-groupes-zirine-fa-meonn": { publicTitle: "Zirine fa’Meonn", mjOnly: true },
  "personnages-verite-extrals-groupes-otrax-01": { publicTitle: "Otrax-01", mjOnly: true },
  "personnages-verite-extrals-groupes-tiana-hawkins": { publicTitle: "Tiana Hawkins", realName: "Tiana Hawkins" },
  "personnages-verite-extrals-groupes-leona-elliott": { publicTitle: "Leona Elliott", realName: "Leona Elliott" },
  "personnages-verite-extrals-groupes-aureliana-longo-austin": { publicTitle: "Aureliana Longo-Austin", realName: "Aureliana Longo-Austin" },
  "personnages-verite-extrals-groupes-dai-zhenya": { publicTitle: "Dai Zhenya", realName: "Dai Zhenya" },
  "personnages-verite-extrals-groupes-cool-blake-morrisson": { publicTitle: "Cool Blake Morrisson", realName: "Cool Blake Morrisson" },
  "personnages-verite-extrals-groupes-honoka": { publicTitle: "Honoka", realName: "Honoka" },
  "personnages-verite-extrals-groupes-ivana-yevgenievna": { publicTitle: "Ivanna Yevgenievna", realName: "Ivanna Yevgenievna" },
  "personnages-verite-extrals-groupes-renaldi-rezzini": { publicTitle: "Renaldi Rezzini", realName: "Renaldi Rezzini" },
  "personnages-verite-extrals-groupes-wei-lin": { publicTitle: "Wei Lin", realName: "Wei Lin" },
  "personnages-verite-extrals-groupes-alante-dennis": { publicTitle: "Alante Dennis", realName: "Alante Dennis" },
  "personnages-verite-extrals-groupes-ogum-so-yung": { publicTitle: "Ogum So-Yung", realName: "Ogum So-Yung" },
  "personnages-verite-extrals-groupes-ernesto-hidalgo": { publicTitle: "Ernesto Hidalgo", realName: "Ernesto Hidalgo" },
  "personnages-verite-extrals-groupes-yvan-abscisse": { publicTitle: "Yvan Abscisse", realName: "Yvan Abscisse" },
  "personnages-verite-extrals-groupes-opalia-sanders": { publicTitle: "Opalia Sanders", realName: "Opalia Sanders" },
  "personnages-verite-extrals-groupes-bryan-rixil": { publicTitle: "Bryan Rixil", realName: "Bryan Rixil" },
  "personnages-verite-extrals-groupes-noya-kagami": { publicTitle: "Noya Kagami", realName: "Noya Kagami" },
  "personnages-verite-extrals-groupes-valerian-gruzinsky": { publicTitle: "Valerian Gruzinsky", realName: "Valerian Gruzinsky" },
  "personnages-verite-extrals-groupes-axelle-monroy": { publicTitle: "Axelle Monroy", realName: "Axelle Monroy" },
  "personnages-verite-extrals-groupes-emilie-dimont": { publicTitle: "Émilie Dimont", realName: "Émilie Dimont" },
  "personnages-verite-extrals-groupes-mustafa-dzeko": { publicTitle: "Mustafa Dzeko", realName: "Mustafa Dzeko" },
  "personnages-verite-extrals-groupes-donald-griffin": { publicTitle: "Donald Griffin", realName: "Donald Griffin" },
  "personnages-verite-extrals-groupes-coral-hope": { publicTitle: "Coral Hope", realName: "Coral Hope" },
  "personnages-verite-extrals-groupes-sheylinn-williams": { publicTitle: "Sheylinn Williams", realName: "Sheylinn Williams" },
  "personnages-verite-extrals-groupes-piripi-stuart-hariwana": { publicTitle: "Piripi Stuart Hariwana", realName: "Piripi Stuart Hariwana" },
  "personnages-verite-extrals-groupes-asheylinn-medira": { publicTitle: "Asheylinn Medira", realName: "Asheylinn Medira" },
  "personnages-verite-extrals-groupes-elsa-rys": { publicTitle: "Elsa Rys", realName: "Elsa Rys" },
  "personnages-verite-extrals-groupes-monorra-smith": { publicTitle: "Monorra Smith", realName: "Monorra Smith" },
  "personnages-verite-extrals-groupes-carmen-hodge": { publicTitle: "Carmen Hodges", realName: "Carmen Hodges" },
  "personnages-verite-extrals-groupes-lisa-koenig": { publicTitle: "Lisa Koenig", realName: "Lisa Koenig" },
  "personnages-verite-extrals-groupes-jack-tang": { publicTitle: "Jack Tang", realName: "Jack Tang" },
  "personnages-verite-extrals-groupes-dhanuka-samara": { publicTitle: "Dhanuka Samara", realName: "Dhanuka Samara" },
  "personnages-verite-extrals-groupes-maximilian-marshall": { publicTitle: "Maximilian Marshall", realName: "Maximilian Marshall" }
};

const COMPLETIONS: Record<string, string> = {
  "personnages-verite-extrals-groupes-walter-jefferson": "jamais séduit.",
  "personnages-verite-extrals-groupes-ramaesh-talavalakr": "et a récupéré ses données sur Siobhain nic Siridean.",
  "personnages-verite-extrals-groupes-leia-irving": "membre du conseil du GAAC pour ça.",
  "personnages-verite-extrals-groupes-amandara-barvadekar": "de l’Eon, prête à s’opposer à Ysabel Thorn ou Saskia si elles s’approchent de l’Eon.",
  "personnages-verite-extrals-groupes-elleth-dyx": "lui parle, le reste, il dort possiblement et jamais ne répondra.",
  "personnages-verite-extrals-groupes-rikardo-schenaz": "méchant néanmoins.",
  "personnages-verite-extrals-groupes-summer-stevenson": "extrêmement sexy, pour percer les secrets derrière cette stratégie reproductive.",
  "personnages-verite-extrals-groupes-olisha-harmon": "la tactique et les actions militaires plus organisées.",
  "personnages-verite-extrals-groupes-kang-sung-hyung": "ses efforts, s’en voulant bien qu’elle ne soit Ad’rak elle-même.",
  "personnages-verite-extrals-groupes-gong-min-ju": "fantasmant les armures de combat inertes aussi bien que les animaux.",
  "personnages-verite-extrals-groupes-mazeeda-el-sadheen": "qui affectionne la force brute malgré sa nature et une pilote exceptionnelle.",
  "personnages-verite-extrals-groupes-zirine-fa-meonn": "du CTU craignent toutefois qu’elle n’ait corrompu Saoden autant que l’inverse.",
  "personnages-verite-extrals-groupes-tiana-hawkins": "déclare parfaitement lesbienne bien que dans la Vérité, elle n’a aucun souci avec les mâles Mo’sens.",
  "personnages-verite-extrals-groupes-aureliana-longo-austin": "REPTILE avait abandonné toute influence chez cette religion.",
  "personnages-verite-extrals-groupes-cool-blake-morrisson": "estime tricher par son corps modifié.",
  "personnages-verite-extrals-groupes-ivana-yevgenievna": "« impériale » des Rocréens, et cherche un moyen d’endiguer leur installation sur Terre.",
  "personnages-verite-extrals-groupes-wei-lin": "l’ancien clan impérial, protégeant de temps en temps certains pour avoir quelques garanties ultérieures.",
  "personnages-verite-extrals-groupes-ogum-so-yung": "Boss.",
  "personnages-verite-extrals-groupes-yvan-abscisse": "général, il est ouvert à la cause des Extrals et souhaiterait négocier avec Lisa Eredhès un jour.",
  "personnages-verite-extrals-groupes-bryan-rixil": "Nehemiah Hooley, le ravagé génie galactique.",
  "personnages-verite-extrals-groupes-valerian-gruzinsky": "Nea’Aeri, pour éviter qu’une seconde communauté orpacyorse ne naisse.",
  "personnages-verite-extrals-groupes-emilie-dimont": "amie d’Isha, l’actrice marocaine et une grande fan de Siobhain.",
  "personnages-verite-extrals-groupes-donald-griffin": "besoin qu’envie d’en découdre, son ennemie jurée est « T-ra’queen », la matriarche mo’senne.",
  "personnages-verite-extrals-groupes-sheylinn-williams": "désormais elle lutte pour en massacrer le plus dès qu’ils apparaissent, les pensant être juste fous.",
  "personnages-verite-extrals-groupes-asheylinn-medira": "elle a été sauvée par des Rocréens partisans des humains, les Feeshri.",
  "personnages-verite-extrals-groupes-monorra-smith": "sanglante, le voulant dans son équipage pirate quand elle retournerait, enfin, à Fellegaris.",
  "personnages-verite-extrals-groupes-lisa-koenig": "Khir’stae’Elynn qui décida de la protéger vu qu’elle aida un inquisiteur renégat.",
  "personnages-verite-extrals-groupes-dhanuka-samara": "prophètes de Belial, il a largement dépassé sa durée de vie mais semble immortel."
};

function safeIdentity(article: J, name: string): J {
  const rows: string[][] = [["Champ", "Valeur"], ["Nom / identité de Réalité", name]];
  const age = String(article.pnj?.age ?? "").replace(/[«»]/g, "").match(/\d+\s*ans/i)?.[0];
  if (age) rows.push(["Âge apparent", age.replace(/\s+/g, " ")]);
  const affiliation = String(article.pnj?.statut ?? "").replace(/[«»]/g, "").trim();
  if (affiliation && !/extrals?|chasseurs?|reptile|abominations?|créatures?/i.test(affiliation)) rows.push(["Affiliations", affiliation]);
  const origin = String(article.pnj?.origine ?? "").trim();
  if (origin && !/^[?_]+$/.test(origin)) rows.push(["Nationalité déclarée", origin]);
  return { id: "identite-realite", title: "Identité · Réalité", level: 2, blocks: [{ type: "table", rows }] };
}

function clean(text: string): string {
  return text
    .replace(/\bAppolo\b/g, "Apollo")
    .replace(/\bOlisha\b/g, "Olishia")
    .replace(/\bIvana YEVGENIEVNA\b/g, "Ivanna YEVGENIEVNA")
    .replace(/\bCarmen Hodge\b/g, "Carmen Hodges")
    .replace(/\bElexaranda\b/g, "Elexarandra")
    .replace(/\bRETPILE\b/g, "REPTILE")
    .replace(/\bA￾man\b/g, "A-man")
    .replace(/\betg\b/g, "et")
    .replace(/\bdees erreurs\b/g, "des erreurs")
    .replace(/\bL’’académie\b/g, "l’académie");
}

export function editorializeExtralsGroupsPnj(source: Array<Record<string, any>>): Array<Record<string, any>> {
  if (source.length !== Object.keys(DECISIONS).length) throw new Error(`Audit Groupes extrals incomplet : ${source.length}/${Object.keys(DECISIONS).length}`);
  return source.map((raw) => {
    const article = JSON.parse(JSON.stringify(raw)) as J;
    const decision = DECISIONS[article.id];
    if (!decision) throw new Error(`Fiche Groupe extral non auditée : ${article.id}`);
    article.title = decision.publicTitle;
    article.pnj = { ...(article.pnj ?? {}), protect_truth_metadata: true };
    if (decision.realName) article.pnj.real_name = decision.realName;
    if (article.id === "personnages-verite-extrals-groupes-so-ouk-32") article.pnj.nom_verite = "So’Ouk-32";
    if (article.id === "personnages-verite-extrals-groupes-elsa-rys") article.pnj.nom_verite = "";
    if (article.id === "personnages-verite-extrals-groupes-carmen-hodge") article.pnj.nom_verite = "Elexarandra";
    const designation = String(article.pnj.source_designation ?? "").trim();
    article.pnj.identity_keys = [...new Set([
      ...(article.pnj.identity_keys ?? []).filter((key: unknown) => String(key).trim() !== designation),
      decision.publicTitle, decision.realName, article.pnj.nom_verite
    ].filter(Boolean))];
    delete article.pnj.source_designation;

    const sections = article.sections ?? [];
    for (const section of sections) {
      if (section.id === "profil" || /^profil$/i.test(String(section.title ?? ""))) {
        section.title = "Profil MJ";
        section.audience = "mj";
      }
      for (const block of section.blocks ?? []) if (typeof block?.text === "string") block.text = clean(block.text);
    }
    const completion = COMPLETIONS[article.id];
    if (completion) {
      const mj = sections.find((section: J) => section.id === "informations-mj");
      const block = mj?.blocks?.findLast((candidate: J) => typeof candidate?.text === "string");
      if (!block) throw new Error(`Bloc MJ tronqué introuvable : ${article.id}`);
      block.text = `${block.text.trim()} ${completion}`;
    }
    if (article.id === "personnages-verite-extrals-groupes-monorra-smith") {
      const reality = sections.find((section: J) => section.id === "informations-realite");
      const block = reality?.blocks?.findLast((candidate: J) => typeof candidate?.text === "string");
      if (!block) throw new Error(`Bloc Réalité introuvable : ${article.id}`);
      block.text = "Monorra Smith est sud-africaine, maîtresse BDSM et acupunctrice.";
    }
    if (article.id === "personnages-verite-extrals-groupes-shanandra-fear") {
      const reality = sections.find((section: J) => section.id === "informations-realite");
      const publicBlock = reality?.blocks?.find((candidate: J) => typeof candidate?.text === "string");
      if (!publicBlock) throw new Error(`Bloc Réalité introuvable : ${article.id}`);
      publicBlock.text = "Shanandra est une fixer de New York ; elle travaille peu en Californie.";
      const mj = sections.find((section: J) => section.id === "informations-mj");
      if (!mj) throw new Error(`Bloc MJ introuvable : ${article.id}`);
      mj.blocks ??= [];
      mj.blocks.push({
        type: "paragraph",
        text: "Le GAAC la menace souvent de la remplacer, étant donné qu’elle ne prend pas souvent parti contre le REPTILE."
      });
    }
    if (decision.realName && !decision.mjOnly) sections.unshift(safeIdentity(article, decision.realName));
    if (decision.mjOnly) {
      article.audience = "mj";
      for (const section of sections) section.audience = "mj";
    }
    return article;
  });
}
