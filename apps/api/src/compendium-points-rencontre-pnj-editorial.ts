type J = Record<string, any>;

type Decision = { title: string; summary: string };

// Une décision éditoriale explicite par fiche, après lecture continue des 52 pages source.
const DECISIONS: Record<string, Decision> = {
  "personnages-points-rencontre-ma-yimu": { title: "MA Yimu", summary: "MA Yimu occupe le poste prestigieux de réceptionniste de la Tour dorée." },
  "personnages-points-rencontre-manika-rimmer": { title: "Manika Rimmer", summary: "Manika Rimmer est l’autre réceptionniste de la Tour dorée." },
  "personnages-points-rencontre-kristina-moon": { title: "Kristina Moon", summary: "Ancienne pharmacienne de Sunways, Kristina Moon est devenue une crawler connue sous le surnom de « Frogchrist »." },
  "personnages-points-rencontre-murck-date": { title: "Murck Date", summary: "Murck Date est un jeune mercenaire crawler américain." },
  "personnages-points-rencontre-mukna": { title: "Mukna", summary: "Mukna est un crawler, biker et transporteur qui sillonne régulièrement la réserve." },
  "personnages-points-rencontre-lana-alvarez": { title: "Lana Alvarez", summary: "Lana Alvarez est une jeune croupière à la carrure impressionnante." },
  "personnages-points-rencontre-tina-miller": { title: "Tina Miller", summary: "Tina Miller dirige le Grand Théâtre et y accueille personnellement les invités des ventes prestigieuses." },
  "personnages-points-rencontre-rupert-sven-andersen": { title: "Rupert Sven Andersen", summary: "Rupert Sven Andersen est le jeune assistant allemand de Tina Miller au Grand Théâtre. Prétentieux et méprisant, il travaille pour Tortoise Security." },
  "personnages-points-rencontre-margareeta-rootare": { title: "Margareeta Rootare", summary: "Émigrée estonienne, Margareeta Rootare travaille comme serveuse et barmaid au Sugar Eden, dont elle assure la gestion en l’absence de J3." },
  "personnages-points-rencontre-jamal-jace-jayson": { title: "Jamal Jace Jayson", summary: "Jamal Jace Jayson, surnommé J3 ou Jcube, est acteur pour Redwheels, animateur publicitaire et propriétaire du Sugar Eden." },
  "personnages-points-rencontre-arielle-nova": { title: "Arielle Nova", summary: "Née à Las Vegas, Arielle Nova est une danseuse blonde, enjouée et volontiers provocatrice que l’on rencontre souvent au Dancing Rabbit." },
  "personnages-points-rencontre-rosina-vyacheslavovna": { title: "Rosina Vyacheslavovna", summary: "Arrivée de Russie, Rosina Vyacheslavovna a intégré les hommes de Drasko avant de rejoindre la sécurité du Dancing Rabbit. Mère de jumeaux, elle est froide, taciturne et peu portée sur la conversation." },
  "personnages-points-rencontre-jack-ken": { title: "Jack Ken", summary: "Jack Ken, alias « Jesus Jack Kenobi » ou JJK, est l’un des DJ les plus connus des quartiers abandonnés. Sa marque de fabrique est une MAP à dix-sept pistes de résonance." },
  "personnages-points-rencontre-barbara-amble": { title: "Barbara Amble", summary: "Barbara Amble est une musicienne neopunk, batteuse et chanteuse occasionnelle. Depuis la destruction de son groupe, elle joue avec différentes formations et travaille régulièrement avec Eliza." },
  "personnages-points-rencontre-jack-ashford": { title: "Jack Ashford", summary: "Ancien biker, vétéran et prêtre, Jack Ashford dirige un garage spécialisé dans les pièces de véhicules et d’armes anciennes. Il soutient matériellement les chasseurs de l’Église chrétienne." },
  "personnages-points-rencontre-elisenda-ruiz": { title: "Elisenda Ruiz", summary: "Ancienne tueuse du cartel de Sinaloa, Elisenda Ruiz est encore recherchée par ses anciens subordonnés. Au garage Ashford, elle vend des armes personnalisées et conseille leurs utilisateurs." },
  "personnages-points-rencontre-amber-nichols": { title: "Amber Nichols", summary: "Amber Nichols est la principale serveuse du Purple Embers. Elle se teint les cheveux en rose ou en violet et plaisante souvent en affirmant que le bar porte son nom." },
  "personnages-points-rencontre-aessa-lee-love": { title: "Aessa Lee Love", summary: "Aessa Lee Love dirige le Purple Embers, un établissement de nuit connu pour son atmosphère sensuelle et débridée." },
  "personnages-points-rencontre-jimmy-brazier": { title: "Jimmy Brazier", summary: "Jimmy Brazier fréquente le Purple Embers et évolue parmi les crawlers du quartier." },
  "personnages-points-rencontre-meryl-west": { title: "Meryl West", summary: "Meryl West est une travailleuse du sexe australienne d’une grande beauté, principalement au service de Todd Larsen. Discrète et effacée, elle paraît souvent assoupie." },
  "personnages-points-rencontre-demona-prince": { title: "Demona Prince", summary: "Demona Prince est une avocate de First Lawyers Incorporated. Souvent prise pour une secrétaire, elle gère pourtant des dossiers importants au service de Belyandra Queen." },
  "personnages-points-rencontre-belyandra-queen": { title: "Belyandra Queen", summary: "Belyandra Queen est seconde vice-présidente de First Lawyers Incorporated et cofondatrice du cabinet Faith. Avocate renommée, elle continue de plaider régulièrement." },
  "personnages-points-rencontre-barret-kelvin": { title: "Barret Kelvin", summary: "Barret Kelvin travaille pour la Blanchisserie comme agent de renseignement et organise des opérations de chasse." },
  "personnages-points-rencontre-ameena-al-gad": { title: "Ameena al-Gad", summary: "Ameena al-Gad est l’acolyte d’Hashem El’Khayat. Membre de la secte nizarite, elle veille sur le prince chasseur." },
  "personnages-points-rencontre-barbara-ui-maothain": { title: "Barbara Uí Maotháin", summary: "Barbara Uí Maotháin travaille pour Raven Corporation et se présente comme la sœur de Morgan Uí Maotháin." },
  "personnages-points-rencontre-morgan-brandubh": { title: "Morgan Brandubh", summary: "Morgan Brandubh est la fondatrice de Raven Corporation, constituée à partir du rachat d’Academi." },
  "personnages-points-rencontre-jeff-bezos": { title: "Jeff Bezos", summary: "Jeff Bezos est un sans-abri de Runyon Canyon, dont le nom évoque ironiquement celui d’un milliardaire du début du siècle." },
  "personnages-points-rencontre-rishabha-ajagavakar": { title: "Rishabha Ajagavakar", summary: "Ingénieure en mécanique de formation, Rishabha Ajagavakar est la principale meditech des tanières. Elle excelle dans le bricolage, l’improvisation et les soins de terrain." },
  "personnages-points-rencontre-clyde-w-mcshark": { title: "Clyde W. McShark", summary: "Le colonel Clyde William McShark est officier de l’armée de terre californienne et bras droit de Benedicte Vilhelmsen à l’académie militaire." },
  "personnages-points-rencontre-benedicte-vilhelmsen": { title: "Benedicte Vilhelmsen", summary: "Née au Danemark en 1998, Benedicte Vilhelmsen a embrassé une carrière d’officier après être sortie première de sa promotion à l’académie militaire danoise." },
  "personnages-points-rencontre-murton-keens": { title: "Murton Keens", summary: "Murton Keens est un biker américain et un criminel endurci, affilié aux Hell Angels." },
  "personnages-points-rencontre-frederic-jackelston": { title: "Frederic Jackelston", summary: "Frederic « Jackal » Jackelston est un ancien biker des Hell Angels, réputé pour son intelligence et ses talents de stratège." },
  "personnages-points-rencontre-sikya-hawkins": { title: "Sikya Hawkins", summary: "Sikya Hawkins est une insurgée américaine de soixante-deux ans qui paraît sensiblement plus jeune que son âge." },
  "personnages-points-rencontre-ron-smith": { title: "Ron Smith", summary: "Ron Smith est un jeune insurgé américain au caractère amer, marqué par les moqueries et les discriminations subies depuis l’enfance." },
  "personnages-points-rencontre-alsha-ashorn": { title: "Alsha Ashorn", summary: "Alsha Ashorn tient un petit bar dans un quartier abandonné et entretient des liens avec le Syndicat de Jade." },
  "personnages-points-rencontre-jackson-blade": { title: "Jackson Blade", summary: "Jackson Blade assure la sécurité du Jadecenter de Palameta. D’apparence stricte, il est réputé comme un tireur d’élite redoutable." },
  "personnages-points-rencontre-gerald-ashorn": { title: "Gerald Ashorn", summary: "Gerald Ashorn est un général renommé, passé de l’U.S. Marine Corps aux troupes de marine californiennes." },
  "personnages-points-rencontre-judy-rosheen-smith": { title: "Judy Rosheen Smith", summary: "Ancienne mercenaire gravement blessée pendant la guerre, Judy Rosheen Smith est désormais coach sportive pour Ushkoll Corporation." },
  "personnages-points-rencontre-kristian-morales": { title: "Kristian Morales", summary: "Kristian Morales est le batteur du groupe The Void. Ce neopunk se désintéresse largement de la culture martiale." },
  "personnages-points-rencontre-anna-hetfield": { title: "Anna « Annallica » Hetfield", summary: "Connue sous le nom de scène Annallica, Anna Hetfield est une musicienne polyvalente devenue célèbre pendant la guerre." },
  "personnages-points-rencontre-grigoria-ravinsky": { title: "Grigoria « Grim » Ravinsky", summary: "Ancienne subordonnée de Drasko Vladic dans l’escadron fantôme, Grigoria Ravinsky dirige aujourd’hui la Tour des rêves pour la Bratva." },
  "personnages-points-rencontre-valentyn-solovej": { title: "Valentyn Solovej", summary: "Valentyn Solovej est un officier ukrainien de la Bratva placé sous les ordres de Grigoria Ravinsky. Il exécute ses missions avec une efficacité intimidante." },
  "personnages-points-rencontre-kimberley-vasquez": { title: "Kimberley Vasquez", summary: "Kimberley Vasquez dirige l’académie militaire MNA. Ouverte mais exigeante, cette vétérane de la guerre du Mexique se méfie de ses financeurs corporatifs et gouvernementaux." },
  "personnages-points-rencontre-jordan-mulkenny": { title: "Jordan Mulkenny", summary: "Jordan Mulkenny est un vétéran et officier supérieur de l’académie MNA. Oncle du néonazi Russel Mulkenny, il est lui-même régulièrement accusé de fascisme." },
  "personnages-points-rencontre-lisa-eredhes": { title: "Lisa Eredhes", summary: "Née à Cancún en 2000, Lisa Eredhes a fondé Space Union en 2026 avec des scientifiques et d’anciens militaires. Elle préside la corporation et a accéléré le développement lunaire." },
  "personnages-points-rencontre-kirstyn-kjoll": { title: "Kirstyn Kjoll", summary: "Présentée comme la sœur d’Alladava Kjoll, Kirstyn Kjoll occupe un poste administratif important au sein de Space Union." },
  "personnages-points-rencontre-ivana-yevgenievna": { title: "Ivana Yevgenievna", summary: "Ancienne militaire russe formée aux sciences et à l’informatique, Ivana Yevgenievna est devenue Kapitan de la Bratva après la guerre." },
  "personnages-points-rencontre-ernesto-hidalgo": { title: "Ernesto Hidalgo", summary: "Membre du cartel de Sinaloa, Ernesto Hidalgo cultive une estime de lui-même hors normes et une réputation de séducteur aussi insistant que menaçant." },
  "personnages-points-rencontre-leia-irving": { title: "Leia Irving", summary: "Leia Irving est une jeune cadre prometteuse de Redwheels et le bras droit de la directrice de la branche Pacifique des productions." },
  "personnages-points-rencontre-james-hopper": { title: "James Hopper", summary: "James Hopper est un agent prometteur et travailleur du CBII, proche collaborateur de Cole Gallagher." },
  "personnages-points-rencontre-rached-kelley": { title: "Rached Kelley", summary: "Issu d’une famille fortunée active dans l’armement, Rached Kelley est un haut cadre de Raven Corporation et dirige sa sous-branche des armes lourdes individuelles." },
  "personnages-points-rencontre-racheyl-rosemann": { title: "Racheyl Rosemann", summary: "Racheyl Rosemann est l’assistante de direction de Rached Kelley. Froide mais extrêmement compétente, elle impressionne ses collègues par sa mémoire et sa connaissance des dossiers." }
};

function clean(text: string): string {
  return text
    .replace(/￾/g, "-")
    .replace(/\bmaitresse\b/gi, (value) => value[0] === "M" ? "Maîtresse" : "maîtresse")
    .replace(/\bmaitre\b/gi, (value) => value[0] === "M" ? "Maître" : "maître")
    .replace(/\bfraichement\b/gi, "fraîchement")
    .replace(/\bgrandit\b/g, "grandi")
    .replace(/\bcorportation\b/gi, "corporation")
    .replace(/\bobservatreurs\b/gi, "observateurs")
    .replace(/\barméede\b/g, "armée de")
    .replace(/\ba finit par\b/g, "a fini par")
    .replace(/Las Vegas\.Sa/g, "Las Vegas. Sa");
}

function apparentAge(raw: unknown): string | undefined {
  const text = String(raw ?? "");
  const quoted = text.match(/[«\"]\s*(\d+)\s*ans?\s*[»\"]/i);
  if (quoted) return `${quoted[1]} ans`;
  const plain = text.match(/^\s*(\d+)\s*ans?\s*$/i);
  return plain ? `${plain[1]} ans` : undefined;
}

export function applyPointsRencontrePnjEditorial(articles: J[]): void {
  if (articles.length !== 52 || Object.keys(DECISIONS).length !== 52) throw new Error(`Audit Points de rencontre incomplet : ${articles.length}/52`);
  for (const article of articles) {
    const decision = DECISIONS[article.id];
    if (!decision) throw new Error(`Fiche Points de rencontre non auditée : ${article.id}`);
    article.title = decision.title;
    article.pnj = { ...(article.pnj ?? {}), protect_truth_metadata: true, real_name: decision.title, identity_keys: [...new Set([...(article.pnj?.identity_keys ?? []), decision.title].filter(Boolean))] };
    if (article.id === "personnages-points-rencontre-aessa-lee-love") article.pnj.nom_verite = "Meririm–Messaline";
    for (const section of article.sections ?? []) {
      for (const block of section.blocks ?? []) if (typeof block?.text === "string") block.text = clean(block.text);
      if (section.id === "informations-mj" || section.id === "profil-statistique") section.audience = "mj";
      if (section.id === "informations-mj") section.title = "Informations Vérité · point de rencontre";
    }
    const profile = (article.sections ?? []).find((section: J) => section.id === "profil");
    const table = profile?.blocks?.find((block: J) => block.type === "table");
    if (!table) throw new Error(`${article.id}: profil public absent`);
    const safeRows: string[][] = [["Champ", "Valeur"], ["Nom / identité de Réalité", decision.title]];
    const age = apparentAge(article.pnj?.age);
    if (age) safeRows.push(["Âge apparent", age]);
    for (const row of (table.rows as string[][]).slice(1)) if (/^(?:Affiliations?|Nationalité)/i.test(row[0])) safeRows.push([row[0], clean(row[1])]);
    table.rows = safeRows;
    const sections = article.sections ?? [];
    const oldReality = sections.findIndex((section: J) => section.id === "informations-realite");
    if (oldReality >= 0) sections.splice(oldReality, 1);
    const firstMj = sections.findIndex((section: J) => section.audience === "mj");
    sections.splice(firstMj >= 0 ? firstMj : sections.length, 0, { id: "informations-realite", title: "Informations Réalité", level: 2, blocks: [{ type: "p", text: decision.summary }] });
  }
}
