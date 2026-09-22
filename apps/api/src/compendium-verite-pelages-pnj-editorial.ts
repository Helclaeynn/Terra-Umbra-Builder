type J = Record<string, any>;
type Decision = { publicTitle: string; realName: string; truthName?: string };

// Une décision explicite par fiche, après lecture des pages 4 à 17 du PDF continu.
const DECISIONS: Record<string, Decision> = {
  "personnages-verite-pelages-benedicte-vilhelmsen": { publicTitle: "Benedicte Vilhelmsen", realName: "Benedicte Vilhelmsen", truthName: "Thorunn" },
  "personnages-verite-pelages-migina-evans": { publicTitle: "Migina Evans", realName: "Migina Evans" },
  "personnages-verite-pelages-tsvetomir-nickolov": { publicTitle: "Tsvetomir Nickolov", realName: "Tsvetomir Nickolov" },
  "personnages-verite-pelages-frederic-jackelston-jackal": { publicTitle: "Frederic Jackelston « Jackal »", realName: "Frederic Jackelston « Jackal »" },
  "personnages-verite-pelages-sikya-hawkins": { publicTitle: "Sikya Hawkins", realName: "Sikya Hawkins", truthName: "Talatuwa" },
  "personnages-verite-pelages-jaynee-kelly": { publicTitle: "Jaynee Kelly", realName: "Jaynee Kelly" },
  "personnages-verite-pelages-juan-martin-reyes": { publicTitle: "Juan Martín Reyes", realName: "Juan Martín Reyes" },
  "personnages-verite-pelages-ron-smith": { publicTitle: "Ron Smith", realName: "Ron Smith" },
  "personnages-verite-pelages-nathan-chappelle": { publicTitle: "Nathan Chappelle", realName: "Nathan Chappelle", truthName: "Ascanius" },
  "personnages-verite-pelages-jane-costa": { publicTitle: "Jane Costa", realName: "Jane Costa" },
  "personnages-verite-pelages-josefin-drescher": { publicTitle: "Josefin Drescher", realName: "Josefin Drescher" },
  "personnages-verite-pelages-virgil-lupesbei": { publicTitle: "Virgil Lupesbei", realName: "Virgil Lupesbei", truthName: "Lycovicus" },
  "personnages-verite-pelages-chamunda-dhavale": { publicTitle: "Chamunda Dhavale", realName: "Chamunda Dhavale", truthName: "Kadriye" },
  "personnages-verite-pelages-louvell-craig": { publicTitle: "Louvell Craig", realName: "Louvell Craig" },
  "personnages-verite-pelages-diana-buck": { publicTitle: "Diana Buck", realName: "Diana Buck" },
  "personnages-verite-pelages-shiva-dattachaudhuri": { publicTitle: "Shiva Dattachaudhuri", realName: "Shiva Dattachaudhuri" },
  "personnages-verite-pelages-shingen-inukawa": { publicTitle: "Shingen Inukawa", realName: "Shingen Inukawa", truthName: "Inukami" },
  "personnages-verite-pelages-michelle-akanishi": { publicTitle: "Michelle Akanishi", realName: "Michelle Akanishi" },
  "personnages-verite-pelages-tishandra-debrun": { publicTitle: "Tishandra Debrun", realName: "Tishandra Debrun" },
  "personnages-verite-pelages-yin-lao": { publicTitle: "Yin Lao", realName: "Yin Lao" },
  "personnages-verite-pelages-john-sandrock": { publicTitle: "John Sandrock", realName: "John Sandrock", truthName: "Khaashtay" },
  "personnages-verite-pelages-sarah-irving": { publicTitle: "Sarah Irving", realName: "Sarah Irving" },
  "personnages-verite-pelages-cynthea-marraniro": { publicTitle: "Cynthea Marraniro", realName: "Cynthea Marraniro" },
  "personnages-verite-pelages-diego-alejandro-lasa": { publicTitle: "Diego Alejandro Lasa", realName: "Diego Alejandro Lasa" },
  "personnages-verite-pelages-tokala": { publicTitle: "Tokala", realName: "Tokala" },
  "personnages-verite-pelages-koshaway-le-gris": { publicTitle: "Koshaway « le Gris »", realName: "Koshaway « le Gris »" },
  "personnages-verite-pelages-jacob-delisle": { publicTitle: "Jacob Delisle", realName: "Jacob Delisle" },
  "personnages-verite-pelages-jeff-bezos": { publicTitle: "Jeff Bezos", realName: "Jeff Bezos" }
};

const COMPLETIONS: Record<string, string> = {
  "personnages-verite-pelages-benedicte-vilhelmsen": "de pouvoir. Elle est à la tête des « pelages blancs ».",
  "personnages-verite-pelages-tsvetomir-nickolov": "faramines y étaient nombreuses.",
  "personnages-verite-pelages-sikya-hawkins": "rejette assez ; elle n’estime pas en avoir besoin.",
  "personnages-verite-pelages-juan-martin-reyes": "sérieux souci de mémoire des noms, désignant les gens par leur physique à la place.",
  "personnages-verite-pelages-nathan-chappelle": "En tant que meneur des pelages gris, il n’a qu’un idéal : la paix de tous les garous et leur sécurité.",
  "personnages-verite-pelages-josefin-drescher": "pelages blancs.",
  "personnages-verite-pelages-chamunda-dhavale": "acquis quelques savoirs magiques et dévore régulièrement des Barghests en prime.",
  "personnages-verite-pelages-diana-buck": "dernier souffle et même de forcer l’éveil des siens par sa seule rage.",
  "personnages-verite-pelages-shingen-inukawa": "personnalité.",
  "personnages-verite-pelages-tishandra-debrun": "connue. Tish a des liens avec Osheena, même si elle est aussi loyale que possible à Ushkoll.",
  "personnages-verite-pelages-john-sandrock": "Ryan Foster, mais aussi la vice-présidente de Sunway, Elody Katherine Skotia.",
  "personnages-verite-pelages-cynthea-marraniro": "c’est un connard, elle sait ce qu’elle lui doit.",
  "personnages-verite-pelages-tokala": "espace, un « vrai » territoire amérindien de fait.",
  "personnages-verite-pelages-jacob-delisle": "refusa. Malgré tout, c’est un maître de clan assez influent."
};

function clean(text: string): string {
  return text
    .replace(/￾/g, "-")
    .replace(/\bBenedicte VILHELMSEN\b/g, "Benedicte Vilhelmsen")
    .replace(/\bSikya HAWKINS\b/g, "Sikya Hawkins")
    .replace(/\bNathan CHAPPELLE\b/g, "Nathan Chappelle")
    .replace(/\bJosefin DRESCHER\b/g, "Josefin Drescher")
    .replace(/\bChamunda DHAVALE\b/g, "Chamunda Dhavale")
    .replace(/\bYin LAO\b/g, "Yin Lao")
    .replace(/\bDiego Alejandro LASA\b/g, "Diego Alejandro Lasa")
    .replace(/\bjacob Delisle\b/g, "Jacob Delisle")
    .replace(/\bTsvetimir\b/g, "Tsvetomir")
    .replace(/\bThorrunn\b/g, "Thorunn")
    .replace(/\bVirgil Lupsbei\b/g, "Virgil Lupesbei")
    .replace(/\bplages bruns\b/g, "pelages bruns")
    .replace(/\bSi lle\b/g, "Si elle")
    .replace(/\bqu’ls\b/g, "qu’ils")
    .replace(/\bs’ets\b/g, "s’est")
    .replace(/\brisquaient d s’occuper\b/g, "risquaient de s’occuper")
    .replace(/\bC’ets\b/g, "C’est")
    .replace(/\bteni tête\b/g, "tenir tête")
    .replace(/\bde nos jour\b/g, "de nos jours")
    .replace(/\blous-garous\b/g, "loups-garous")
    .replace(/\bparc cet ‘l’emplacement\b/g, "Park et l’emplacement")
    .replace(/\bil tenté de les tester\b/g, "il tente de les tester")
    .replace(/\bd toute façon\b/g, "de toute façon")
    .replace(/\bun un biker\b/g, "un biker")
    .replace(/\bSauvé par Saskia\b/g, "sauvé par Saskia")
    .replace(/\bTrès occupé\b/g, "très occupé")
    .replace(/\baucun soucis\b/g, "aucun souci")
    .replace(/\bsurement\b/g, "sûrement")
    .replace(/\bmaitresse\b/g, "maîtresse")
    .replace(/\bmaitre\b/g, "maître");
}

function appendPublic(article: J, text: string): void {
  const reality = article.sections?.find((section: J) => section.id === "pelages-realite");
  if (!reality) throw new Error(`Bloc Réalité introuvable : ${article.id}`);
  reality.blocks ??= [];
  reality.blocks.push({ type: "p", text });
}

export function editorializePelagesPnj(source: Array<Record<string, any>>): Array<Record<string, any>> {
  if (source.length !== Object.keys(DECISIONS).length) throw new Error(`Audit Pelages incomplet : ${source.length}/${Object.keys(DECISIONS).length}`);
  return source.map((raw) => {
    const article = JSON.parse(JSON.stringify(raw)) as J;
    const decision = DECISIONS[article.id];
    if (!decision) throw new Error(`Fiche Pelage non auditée : ${article.id}`);
    article.title = decision.publicTitle;
    article.pnj = {
      ...(article.pnj ?? {}),
      real_name: decision.realName,
      nom_verite: decision.truthName ?? "",
      protect_truth_metadata: true
    };
    const designation = String(article.pnj.source_designation ?? "").trim();
    article.pnj.identity_keys = [...new Set([
      ...(article.pnj.identity_keys ?? []).filter((key: unknown) => String(key).trim() !== designation),
      decision.publicTitle,
      decision.realName,
      decision.truthName
    ].filter(Boolean))];
    delete article.pnj.source_designation;

    for (const section of article.sections ?? []) {
      for (const block of section.blocks ?? []) {
        if (typeof block?.text === "string") block.text = clean(block.text);
        if (block?.type === "table" && Array.isArray(block.rows) && section.id === "pelages-realite") {
          block.rows = block.rows.filter((row: unknown[]) => {
            const label = String(row?.[0] ?? "");
            const value = String(row?.[1] ?? "");
            return !/affiliations/i.test(label) || !/crawlers?|créatures?/i.test(value);
          });
        }
      }
    }

    const completion = COMPLETIONS[article.id];
    if (completion) {
      const truth = article.sections?.find((section: J) => section.id === "pelages-verite");
      const block = truth?.blocks?.findLast((candidate: J) => typeof candidate?.text === "string");
      if (!block) throw new Error(`Bloc MJ tronqué introuvable : ${article.id}`);
      block.text = `${block.text.trim()} ${completion}`;
    }

    if (article.id === "personnages-verite-pelages-frederic-jackelston-jackal") {
      const reality = article.sections?.find((section: J) => section.id === "pelages-realite");
      const block = reality?.blocks?.findLast((candidate: J) => typeof candidate?.text === "string");
      if (!block) throw new Error(`Bloc Réalité introuvable : ${article.id}`);
      block.text = "« Jackal » était un biker des Hell’s Angels, connu comme l’un des stratèges les plus intelligents et redoutables de cette faction criminelle. Pris dans l’embuscade d’un gang rival, il fut sauvé par Saskia alors qu’il tentait de protéger ses hommes. Il devint ensuite directeur de la branche transport d’Eversor.";
    }
    if (article.id === "personnages-verite-pelages-virgil-lupesbei") {
      appendPublic(article, "Virgil Lupesbei est directeur de Lagucorpo, sous-branche de Laguna Bank chargée de la gestion des crédits.");
    }
    if (article.id === "personnages-verite-pelages-ron-smith") {
      const reality = article.sections?.find((section: J) => section.id === "pelages-realite");
      const block = reality?.blocks?.findLast((candidate: J) => typeof candidate?.text === "string");
      if (!block) throw new Error(`Bloc Réalité introuvable : ${article.id}`);
      block.text = block.text.replace(/il intégra la grande Réserve sous la protection de Talatuwa\.?$/i, "il rejoignit la Grande Réserve.");
    }
    if (article.id === "personnages-verite-pelages-tokala") {
      appendPublic(article, "Tokala est une femme d’affaires farouche et une héroïne de la guerre de 2022-2028, inscrite au panthéon des grands héros américains. Elle a créé et administre la Grande Réserve, vaste territoire corporatif amérindien.");
    }
    if (article.id === "personnages-verite-pelages-jacob-delisle") {
      appendPublic(article, "Jacob Delisle a travaillé comme croupier et stripteaseur avant de se retrouver à la rue pendant la guerre.");
    }
    if (article.id === "personnages-verite-pelages-jeff-bezos") {
      const reality = article.sections?.find((section: J) => section.id === "pelages-realite");
      const block = reality?.blocks?.findLast((candidate: J) => typeof candidate?.text === "string");
      if (block) block.text = block.text.replace(/,\s*$/, ".");
    }
    return article;
  });
}
