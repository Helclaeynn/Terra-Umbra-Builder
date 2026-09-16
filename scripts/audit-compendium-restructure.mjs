import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA = 'compendium/data';
const manifest = JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`, 'utf8'));

function loadDataset(id) {
  const spec = manifest.datasets.find(dataset => dataset.id === id);
  if (!spec) throw new Error(`Dataset absent du manifeste: ${id}`);
  let b64 = '';
  for (let i = 0; i < spec.parts; i += 1) {
    const part = `${DATA}/${spec.prefix}-${String(i).padStart(2, '0')}.b64part`;
    b64 += fs.readFileSync(part, 'utf8').replace(/\s+/g, '');
  }
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));
}

function scalarStrings(value, out = []) {
  if (value == null) return out;
  if (typeof value === 'string') {
    out.push(value);
    return out;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    out.push(String(value));
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) scalarStrings(item, out);
    return out;
  }
  if (typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (/^(id|slug|image|portrait|url|src|href|sha|hash|illustration)/i.test(key)) continue;
      scalarStrings(child, out);
    }
  }
  return out;
}

function pageText(page) {
  return scalarStrings(page).join(' ').replace(/\s+/g, ' ').trim();
}

const ruleSignals = [
  ['dice', /\b1d10e?\b|\bjet(?:s)?\b|\btest(?:s)?\b/gi, 2],
  ['actions', /\bPA\b|point(?:s)? d['’]action|réaction(?:s)?/gi, 2],
  ['health', /\bPV\b|point(?:s)? de vie|dégât(?:s)?|réduction(?:s)?/gi, 2],
  ['progression', /\bXP\b|\bPTV\b|point(?:s)? de vérité|coût(?:s)?|progression/gi, 2],
  ['difficulty', /difficulté|seuil(?:s)?|marge(?:s)?|\bDR\b/gi, 2],
  ['bonuses', /bonus|malus|\+\d|−\d|-\d/gi, 1],
  ['combat', /défense|attaque|initiative|armure|surpris|surprise/gi, 2],
  ['character', /attribut(?:s)?|compétence(?:s)?|talent(?:s)?|désavantage(?:s)?/gi, 2],
  ['states', /stress|raison|corruption|humanité|intégrité|frénésie|stase/gi, 2],
  ['access', /\bSR\b|\bR\b|semi-révélé|révélé|voilé|accès\s*:/gi, 2],
  ['timing', /\bround\b|\bscène\b|\bscénario\b|durée|1\/scène|1\/scénario/gi, 1],
  ['rules-words', /mécaniqu|règle(?:s)?|effet(?:s)?|résolution|non-cumul|gratuit(?:e)?/gi, 1],
];

function mechanics(page) {
  const text = pageText(page);
  let score = 0;
  const hits = [];
  for (const [name, regex, weight] of ruleSignals) {
    regex.lastIndex = 0;
    const matches = text.match(regex) || [];
    if (!matches.length) continue;
    const capped = Math.min(matches.length, 4);
    score += weight * capped;
    hits.push(`${name}:${matches.slice(0, 4).join(',')}`);
  }
  return { score, hits };
}

function sectionSummary(page) {
  return (page.sections || [])
    .map(section => section?.title || section?.heading || section?.name || '')
    .filter(Boolean)
    .join(' / ');
}

function normalizeTitle(value) {
  return String(value || '').normalize('NFKC').trim();
}

const report = {
  generatedAt: new Date().toISOString(),
  expectedTotal: manifest.expectedTotal,
  datasets: {},
  candidates: [],
};

for (const id of ['moteur', 'realite', 'verite']) {
  const pages = loadDataset(id);
  const rows = pages.map(page => {
    const text = pageText(page);
    const mechanical = mechanics(page);
    return {
      id: page.id,
      title: normalizeTitle(page.title),
      category: page.category || page.type || '',
      textLength: text.length,
      sections: (page.sections || []).length,
      sectionSummary: sectionSummary(page),
      mechanicsScore: mechanical.score,
      mechanicsHits: mechanical.hits,
      likelyRules: mechanical.score >= 6,
      thin: text.length < 700,
      nearlyEmpty: text.length < 300,
    };
  });
  report.datasets[id] = {
    count: rows.length,
    likelyRules: rows.filter(row => row.likelyRules).length,
    thin: rows.filter(row => row.thin).length,
    nearlyEmpty: rows.filter(row => row.nearlyEmpty).length,
    pages: rows,
  };
}

for (const sourceId of ['realite', 'verite']) {
  for (const page of report.datasets[sourceId].pages) {
    if (!page.likelyRules && !page.thin) continue;
    report.candidates.push({ sourceDataset: sourceId, ...page });
  }
}

fs.mkdirSync('compendium/audits', { recursive: true });
fs.writeFileSync(
  'compendium/audits/restructure-baseline.json',
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

console.log(`COMPENDIUM RESTRUCTURE AUDIT — total V3 ${manifest.expectedTotal}`);
for (const id of ['moteur', 'realite', 'verite']) {
  const dataset = report.datasets[id];
  console.log(`DATASET ${id.toUpperCase()} — ${dataset.count} pages · règles probables ${dataset.likelyRules} · fines ${dataset.thin} · quasi vides ${dataset.nearlyEmpty}`);
  for (const page of dataset.pages) {
    const flags = [page.likelyRules ? 'MECH' : '', page.thin ? 'THIN' : '', page.nearlyEmpty ? 'EMPTY' : ''].filter(Boolean).join(',') || 'LORE';
    console.log(`${id.toUpperCase()} | ${flags} | score=${page.mechanicsScore} | len=${page.textLength} | ${page.title} | ${page.sectionSummary}`);
  }
}
console.log(`CANDIDATES À RECLASSER/CONSOLIDER — ${report.candidates.length}`);
for (const page of report.candidates) {
  console.log(`CANDIDATE | ${page.sourceDataset} | ${page.likelyRules ? 'MECH' : 'THIN'} | score=${page.mechanicsScore} | ${page.title} | ${page.mechanicsHits.join(' ; ')}`);
}
