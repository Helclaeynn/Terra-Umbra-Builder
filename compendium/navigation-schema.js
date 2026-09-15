const SUPPORTED_CATEGORIES = new Set(['Règles', 'Réalité', 'Vérité']);

const TRUTH_DOMAIN_ORDER = new Map([
  ['Humains & Chasseurs', 10],
  ['Vampires', 20],
  ['Garous', 30],
  ['Descendants de Khinae', 40],
  ['Mages', 50],
  ['Daemons', 60],
  ['Angelus', 70],
  ['Aseryns', 80],
  ['Exilés', 90],
  ['Extrals', 100],
]);

const GROUP_ORDER = {
  'Moteur commun': 10,
  'Réalité — Création & progression': 20,
  'Réalité — Talents & désavantages': 30,
  'Réalité — Augmentations': 40,
  'Réalité — Neurodive': 50,
  'Réalité — Économie & équipement': 60,
  'Vérité — Règles communes': 70,
  'Vérité — Natures & capacités': 80,
  'Vérité — Corruption & Fléaux': 90,
};

const REALITY_GROUP_ORDER = {
  'Grande Californie & quotidien': 10,
  'Augmentations': 20,
  'Neurodive': 30,
  'Économie, équipement & services': 40,
};

const TRUTH_GROUP_ORDER = {
  'Entrer dans la Vérité': 10,
  'Natures, peuples & traditions': 20,
  'Chasseurs': 30,
  'Corruption & Fléaux': 40,
  'Équipement & marchés de Vérité': 50,
};

function norm(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tagsOf(page) {
  return Array.isArray(page?.tags) ? page.tags.filter(Boolean).map(String) : [];
}

function hasTag(page, expected) {
  const needle = norm(expected);
  return tagsOf(page).some(tag => norm(tag) === needle);
}

function tagIncludes(page, expected) {
  const needle = norm(expected);
  return tagsOf(page).some(tag => norm(tag).includes(needle));
}

function prefixedNumber(title) {
  const match = String(title || '').match(/^\s*(\d+)\s*[.)-]\s*/);
  return match ? Number(match[1]) : null;
}

function romanValue(input) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const text = String(input || '').toUpperCase();
  let total = 0;
  let previous = 0;
  for (let i = text.length - 1; i >= 0; i -= 1) {
    const current = values[text[i]] || 0;
    total += current < previous ? -current : current;
    previous = Math.max(previous, current);
  }
  return total || null;
}

function prefixedRoman(title) {
  const match = String(title || '').match(/^\s*([IVXLCDM]+)\s*[—–.-]\s*/i);
  return match ? romanValue(match[1]) : null;
}

export function navigationDisplayTitle(title) {
  return String(title || '')
    .replace(/^\s*CHAPITRE\s*[—–:-]\s*/i, '')
    .replace(/^\s*\d+\s*[.)-]\s*/, '')
    .replace(/^\s*[IVXLCDM]+\s*[—–.-]\s*/i, '')
    .trim();
}

function pageOrder(page, fallback = 500) {
  const numeric = prefixedNumber(page?.title);
  if (numeric != null) return numeric;
  const roman = prefixedRoman(page?.title);
  if (roman != null) return roman;
  return fallback;
}

function truthDomain(page) {
  const tags = tagsOf(page).map(tag => norm(tag));
  const id = norm(page?.id);
  const probes = [
    ['Humains & Chasseurs', ['humain chasseur', 'chasseur']],
    ['Vampires', ['vampire']],
    ['Garous', ['garou']],
    ['Descendants de Khinae', ['descendants de khinae', 'descendant de khinae', 'khinae']],
    ['Mages', ['mage']],
    ['Daemons', ['daemon']],
    ['Angelus', ['angelus']],
    ['Aseryns', ['aseryn']],
    ['Exilés', ['exile']],
    ['Extrals', ['extral', 'humain galactique']],
  ];
  for (const [label, needles] of probes) {
    if (needles.some(needle => tags.some(tag => tag === needle || tag.includes(needle)) || id.includes(needle.replace(/ /g, '-')) || id.includes(needle.replace(/ /g, ' ')))) return label;
  }
  return null;
}

function truthPagePriority(page) {
  const id = String(page?.id || '');
  const title = norm(page?.title);
  if (id.startsWith('regles-verite-nature-')) return 0;
  if (/communs?|nature commune|cadre commun/.test(title) || /-commun(?:-|$)/.test(id)) return 10;
  if (/progression/.test(title) || /progression/.test(id)) return 20;
  return pageOrder(page, 100);
}

function classifyRules(page) {
  const title = String(page?.title || '');
  const source = String(page?.source || '');
  const id = String(page?.id || '');

  if (hasTag(page, 'Fléaux') || tagIncludes(page, 'Fléau') || hasTag(page, 'Corruption') || /(?:^|-)fleaux?(?:-|$)|(?:^|-)corruption(?:-|$)/i.test(id)) {
    const corruption = hasTag(page, 'Corruption') || /corruption/i.test(`${id} ${title}`);
    return {
      group: 'Vérité — Corruption & Fléaux',
      groupOrder: GROUP_ORDER['Vérité — Corruption & Fléaux'],
      subgroup: corruption ? 'Corruption' : 'Les six Fléaux',
      subgroupOrder: corruption ? 10 : 20,
      pageOrder: truthPagePriority(page),
    };
  }

  if (hasTag(page, 'Vérité') || id.startsWith('regles-verite-')) {
    if (tagIncludes(page, 'LIVRE I — RÈGLES COMMUNES DE LA VÉRITÉ') || /^\s*[1-9]\s*\./.test(title) && !id.startsWith('regles-verite-nature-') && !hasTag(page, 'Talent de Vérité') && !hasTag(page, 'Mécanique')) {
      return {
        group: 'Vérité — Règles communes',
        groupOrder: GROUP_ORDER['Vérité — Règles communes'],
        subgroup: 'Cadre commun',
        subgroupOrder: 10,
        pageOrder: pageOrder(page, 100),
      };
    }
    const domain = truthDomain(page);
    if (!domain) return null;
    return {
      group: 'Vérité — Natures & capacités',
      groupOrder: GROUP_ORDER['Vérité — Natures & capacités'],
      subgroup: domain,
      subgroupOrder: TRUTH_DOMAIN_ORDER.get(domain) || 999,
      pageOrder: truthPagePriority(page),
    };
  }

  if (hasTag(page, 'Réalité') || /realite/i.test(id)) {
    if (hasTag(page, 'Talent') || hasTag(page, 'Désavantage') || /talent|desavantage/i.test(`${id} ${title}`)) {
      let subgroup = 'Principes généraux';
      let subgroupOrder = 10;
      if (hasTag(page, 'Expertise')) [subgroup, subgroupOrder] = ['Talents d’expertise', 30];
      else if (hasTag(page, 'Origine')) [subgroup, subgroupOrder] = ["Talents d’Origine", 40];
      else if (hasTag(page, 'Sphère') && hasTag(page, 'Talent')) [subgroup, subgroupOrder] = ['Talents de Sphère', 50];
      else if (hasTag(page, 'Talent')) [subgroup, subgroupOrder] = ['Talents communs', 20];
      else if (hasTag(page, 'Attribut')) [subgroup, subgroupOrder] = ['Désavantages liés aux Attributs', 70];
      else if (hasTag(page, 'Sphère') && hasTag(page, 'Désavantage')) [subgroup, subgroupOrder] = ['Désavantages de Sphère', 80];
      else if (hasTag(page, 'Désavantage')) [subgroup, subgroupOrder] = ['Désavantages communs', 60];
      return { group: 'Réalité — Talents & désavantages', groupOrder: GROUP_ORDER['Réalité — Talents & désavantages'], subgroup, subgroupOrder, pageOrder: pageOrder(page, 100) };
    }

    if (tagIncludes(page, 'LIVRE II') || /augment/i.test(`${source} ${title}`)) {
      return { group: 'Réalité — Augmentations', groupOrder: GROUP_ORDER['Réalité — Augmentations'], subgroup: 'Intégration augmentique', subgroupOrder: 10, pageOrder: pageOrder(page, 100) };
    }
    if (tagIncludes(page, 'LIVRE III') || /neurodive/i.test(source) || /neurocombat|intrusion|neurodive|connexion, plongée|rang de neurodive|corruption de programmes|ia de sécurité/i.test(title)) {
      return { group: 'Réalité — Neurodive', groupOrder: GROUP_ORDER['Réalité — Neurodive'], subgroup: 'Règles de Neurodive', subgroupOrder: 10, pageOrder: pageOrder(page, 100) };
    }
    if (tagIncludes(page, 'LIVRE IV') || /économie|train de vie|équipement|marché noir|crawler/i.test(title)) {
      return { group: 'Réalité — Économie & équipement', groupOrder: GROUP_ORDER['Réalité — Économie & équipement'], subgroup: 'Économie et accès matériel', subgroupOrder: 10, pageOrder: pageOrder(page, 100) };
    }
    if (tagIncludes(page, 'LIVRE I') || /création et progression/i.test(title)) {
      return { group: 'Réalité — Création & progression', groupOrder: GROUP_ORDER['Réalité — Création & progression'], subgroup: 'Création de personnage', subgroupOrder: 10, pageOrder: pageOrder(page, 100) };
    }
    return null;
  }

  if (/TUC_Moteur/i.test(source) || /^moteur-/i.test(id) || /^\s*[1-5]\s*\./.test(title)) {
    return { group: 'Moteur commun', groupOrder: GROUP_ORDER['Moteur commun'], subgroup: 'Règles fondamentales', subgroupOrder: 10, pageOrder: pageOrder(page, 100) };
  }

  return null;
}

function classifyReality(page) {
  const title = String(page?.title || '');
  const roman = prefixedRoman(title);
  const numeric = prefixedNumber(title);

  if (/VIVRE EN GRANDE CALIFORNIE/i.test(title) || /Repères sociaux de Réalité/i.test(title)) {
    return { group: 'Grande Californie & quotidien', groupOrder: REALITY_GROUP_ORDER['Grande Californie & quotidien'], subgroup: 'Cadre de vie', subgroupOrder: 10, pageOrder: pageOrder(page, 100) };
  }
  if (roman != null && roman >= 1 && roman <= 9) {
    return { group: 'Augmentations', groupOrder: REALITY_GROUP_ORDER.Augmentations, subgroup: 'Familles augmentiques', subgroupOrder: 10, pageOrder: roman };
  }
  if (/Holonet|Neuroprogrammes/i.test(title)) {
    return { group: 'Neurodive', groupOrder: REALITY_GROUP_ORDER.Neurodive, subgroup: 'Réseau & logiciels', subgroupOrder: 10, pageOrder: numeric ?? 100 };
  }
  if (numeric != null && numeric >= 4 && numeric <= 12) {
    return { group: 'Économie, équipement & services', groupOrder: REALITY_GROUP_ORDER['Économie, équipement & services'], subgroup: 'Catalogues & vie matérielle', subgroupOrder: 10, pageOrder: numeric };
  }
  return null;
}

function classifyTruth(page) {
  const title = String(page?.title || '');
  const numeric = prefixedNumber(title);

  if (numeric == null) {
    return { group: 'Entrer dans la Vérité', groupOrder: TRUTH_GROUP_ORDER['Entrer dans la Vérité'], subgroup: 'Comprendre le monde caché', subgroupOrder: 10, pageOrder: 100 };
  }
  if (numeric >= 10 && numeric <= 18) {
    return { group: 'Natures, peuples & traditions', groupOrder: TRUTH_GROUP_ORDER['Natures, peuples & traditions'], subgroup: navigationDisplayTitle(title), subgroupOrder: numeric, pageOrder: numeric };
  }
  if (numeric === 19) {
    return { group: 'Chasseurs', groupOrder: TRUTH_GROUP_ORDER.Chasseurs, subgroup: 'Formation & doctrine', subgroupOrder: 10, pageOrder: numeric };
  }
  if (numeric >= 20 && numeric <= 21) {
    return { group: 'Corruption & Fléaux', groupOrder: TRUTH_GROUP_ORDER['Corruption & Fléaux'], subgroup: numeric === 20 ? 'Corruption' : 'Fléaux', subgroupOrder: numeric, pageOrder: numeric };
  }
  if (numeric >= 22 && numeric <= 27) {
    return { group: 'Équipement & marchés de Vérité', groupOrder: TRUTH_GROUP_ORDER['Équipement & marchés de Vérité'], subgroup: 'Pages transitoires à auditer', subgroupOrder: 10, pageOrder: numeric };
  }
  return null;
}

export function classifyNavigation(page) {
  if (!page || !SUPPORTED_CATEGORIES.has(page.category)) return null;
  const explicit = page.nav;
  if (explicit?.group && Number.isFinite(Number(explicit.groupOrder))) {
    return {
      group: String(explicit.group),
      groupOrder: Number(explicit.groupOrder),
      subgroup: String(explicit.subgroup || explicit.group),
      subgroupOrder: Number(explicit.subgroupOrder ?? 100),
      pageOrder: Number(explicit.pageOrder ?? pageOrder(page, 100)),
    };
  }
  if (page.category === 'Règles') return classifyRules(page);
  if (page.category === 'Réalité') return classifyReality(page);
  if (page.category === 'Vérité') return classifyTruth(page);
  return null;
}

export function isHierarchicalCategory(category) {
  return SUPPORTED_CATEGORIES.has(category);
}
