import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA = 'compendium/data';
const SOURCE = 'compendium/source/reality-rules-v1.json.gz.b64';
const manifestPath = `${DATA}/manifest-v3.json`;
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const source = JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(SOURCE, 'utf8').replace(/\s+/g, ''), 'base64')).toString('utf8'));

function specFor(id) {
  const spec = manifest.datasets.find(dataset => dataset.id === id);
  if (!spec) throw new Error(`Dataset absent: ${id}`);
  return spec;
}

function loadDataset(id) {
  const spec = specFor(id);
  let b64 = '';
  for (let i = 0; i < spec.parts; i += 1) {
    b64 += fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2, '0')}.b64part`, 'utf8').replace(/\s+/g, '');
  }
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\(provisoire\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slug(value) {
  return normalize(value).replace(/\s+/g, '-').replace(/^-|-$/g, '') || 'item';
}

function walkJson(root) {
  const rows = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.json')) {
        const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
        const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.entries) ? parsed.entries : [];
        for (const item of list) rows.push({ ...item, __file: full.replaceAll('\\', '/') });
      }
    }
  }
  walk(root);
  return rows;
}

const builderTalents = walkJson('character-builder/rulesets/terra-umbra/talents');
const builderDisadvantages = walkJson('character-builder/rulesets/terra-umbra/disadvantages');

function nameOf(record) {
  return record?.name ?? record?.title ?? record?.label ?? '';
}
function effectOf(record) {
  return record?.effect ?? record?.description ?? record?.rules ?? record?.text ?? '';
}

function indexByName(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = normalize(nameOf(row));
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return map;
}

const talentIndex = indexByName(builderTalents);
const disadvantageIndex = indexByName(builderDisadvantages);

function chooseBuilder(sourceEntry, index) {
  const matches = index.get(normalize(sourceEntry.title)) || [];
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    const family = normalize(sourceEntry.family);
    const familyMatch = matches.find(match => normalize(`${match.__file} ${match.family || ''} ${match.sphere || ''} ${match.origin || ''} ${match.attribute || ''}`).includes(family));
    if (familyMatch) return familyMatch;
  }
  return null;
}

if (source.talents?.entries?.length !== 122) throw new Error(`Source Réalité: 122 Talents attendus, ${source.talents?.entries?.length ?? 0}`);
if (source.disadvantages?.entries?.length !== 55) throw new Error(`Source Réalité: 55 Désavantages attendus, ${source.disadvantages?.entries?.length ?? 0}`);

const missingTalentBuilder = source.talents.entries.filter(entry => !chooseBuilder(entry, talentIndex));
if (missingTalentBuilder.length) throw new Error(`Talents absents des catalogues Builder: ${missingTalentBuilder.map(entry => entry.title).join(', ')}`);

const missingDisBuilder = source.disadvantages.entries.filter(entry => !chooseBuilder(entry, disadvantageIndex));
if (missingDisBuilder.length) throw new Error(`Désavantages absents des catalogues Builder: ${missingDisBuilder.map(entry => `${entry.title} [${entry.family}]`).join(', ')}`);

function classificationLabel(kind) {
  return kind === 'commun' ? 'Commun' : kind === 'expertise' ? 'Expertise' : kind === 'origine' ? 'Origine' : kind === 'sphere' ? 'Sphère' : kind === 'attribut' ? 'Attribut' : kind;
}

function talentPage(entry) {
  const builder = chooseBuilder(entry, talentIndex);
  const canonicalTitle = String(nameOf(builder) || entry.title).replace(/\s*\(provisoire\)\s*/gi, '').trim();
  const effect = String(effectOf(builder) || entry.effect).trim();
  return {
    id: `regles-realite-talent-${entry.kind}-${slug(entry.family)}-${slug(canonicalTitle)}`,
    title: canonicalTitle,
    category: 'Règles',
    source: 'Catalogues Builder canoniques · TUC_Realite_V8_LIVRE_JDR_PAO_RESPIRATION_TOC_2026-09-09.docx',
    status: 'canon_recent',
    tags: ['Talent', 'Réalité', classificationLabel(entry.kind), entry.family].filter(Boolean),
    sections: [
      {
        id: 'classification',
        title: 'Classification',
        level: 3,
        blocks: [{ type: 'table', rows: [['Type', classificationLabel(entry.kind)], ['Famille', entry.family]] }],
      },
      {
        id: 'effet',
        title: 'Effet',
        level: 3,
        blocks: [{ type: 'p', text: effect, style: 'RPG Tech Card' }],
      },
    ],
  };
}

function disadvantagePage(entry) {
  const builder = chooseBuilder(entry, disadvantageIndex);
  const canonicalTitle = String(nameOf(builder) || entry.title).trim();
  const effect = String(effectOf(builder) || entry.effect).trim();
  const duplicate = source.disadvantages.entries.filter(other => normalize(other.title) === normalize(entry.title)).length > 1;
  const title = duplicate ? `${canonicalTitle} — ${entry.family}` : canonicalTitle;
  return {
    id: `regles-realite-desavantage-${entry.kind}-${slug(entry.family)}-${slug(canonicalTitle)}`,
    title,
    category: 'Règles',
    source: 'Catalogues Builder canoniques · TUC_Realite_V8_LIVRE_JDR_PAO_RESPIRATION_TOC_2026-09-09.docx',
    status: 'canon_recent',
    tags: ['Désavantage', 'Réalité', classificationLabel(entry.kind), entry.family].filter(Boolean),
    sections: [
      {
        id: 'classification',
        title: 'Classification',
        level: 3,
        blocks: [{ type: 'table', rows: [['Type', classificationLabel(entry.kind)], ['Famille', entry.family]] }],
      },
      {
        id: 'effet',
        title: 'Effet',
        level: 3,
        blocks: [{ type: 'p', text: effect, style: 'RPG Tech Card' }],
      },
    ],
  };
}

const talentPrinciples = [
  'Les Talents communs sont accessibles indépendamment de la Sphère.',
  'Il existe exactement un Talent d’expertise par Compétence, soit cinq par Attribut.',
  'Le modèle fréquent d’un Talent d’expertise est un bonus ciblé à la Compétence accompagné d’un effet signature.',
  'Un bonus de Talent n’augmente pas la valeur brute permanente d’une Compétence pour calculer une valeur dérivée, sauf indication explicite.',
  'Chaque personnage choisit une Origine sociale et reçoit gratuitement un des cinq Talents de cette Origine.',
  'Les Talents de Sphère actuelle représentent privilèges, réseaux, ressources, accès ou savoir-faire liés à l’appartenance présente ; leur usage peut dépendre du maintien de cette appartenance.',
];

function rulesTags(page, origin) {
  const tags = Array.isArray(page.tags) ? page.tags.filter(Boolean).filter(tag => tag !== 'Réalité' && tag !== 'Vérité' && tag !== 'Règles') : [];
  return [...new Set([...tags, 'Règles', origin])];
}

function moveToRules(page, origin) {
  return { ...page, category: 'Règles', tags: rulesTags(page, origin) };
}

let rules = loadDataset('moteur');
let reality = loadDataset('realite');
let truth = loadDataset('verite');

const realityRuleTitles = new Set([
  '2. Talents de Réalité',
  '3. Désavantages de Réalité',
  '4. Création et progression',
  '1. Intégration augmentique : Charge, Stress et Frénésie',
  '1. Principes du Neurodive',
  '2. Connexion, plongée et équipement',
  '3. Rang de Neurodive et chargement',
  '4. Actions de Neurodive',
  '5. Intrusion, sécurité, trace et contrôle',
  '6. Neurocombat',
  '7. Corruption de programmes et matériel',
  '10. IA de sécurité — profils MJ',
  "11. Exemple complet d'intrusion",
  '12. Référence rapide',
  '1. Économie et pouvoir d’achat',
  '2. Train de vie, charges fixes et accès matériel',
  '3. Règles communes d’équipement',
  '12. Crédit, marché noir et économie Crawler',
]);

const truthRuleTitles = new Set([
  '1. Architecture de la Vérité',
  '2. Points de Vérité, accès et conception des Talents',
  '3. PA, Réactions, durées et non-cumul',
  '4. Défense occulte et Puissance des effets',
  '5. Hologramme, Voile, Semi-Révélation et Révélation',
  '6. Continuité corporelle, objets et Mobilité ailée',
  '7. Humains, Chasseurs reconnus, Humanité et Intégrité',
  '8. Compagnons liés et réseaux de Vérité',
  '9. Équipement de Vérité — principe commun',
]);

const movedReality = [];
const keptReality = [];
for (const page of reality) {
  if (realityRuleTitles.has(page.title)) movedReality.push(moveToRules(page, 'Réalité'));
  else keptReality.push(page);
}
if (movedReality.length !== realityRuleTitles.size) {
  const found = new Set(movedReality.map(page => page.title));
  throw new Error(`Pages Réalité à migrer absentes: ${[...realityRuleTitles].filter(title => !found.has(title)).join(', ')}`);
}

const movedTruth = [];
const keptTruth = [];
for (const page of truth) {
  if (truthRuleTitles.has(page.title)) movedTruth.push(moveToRules(page, 'Vérité'));
  else keptTruth.push(page);
}
if (movedTruth.length !== truthRuleTitles.size) {
  const found = new Set(movedTruth.map(page => page.title));
  throw new Error(`Pages Vérité à migrer absentes: ${[...truthRuleTitles].filter(title => !found.has(title)).join(', ')}`);
}

const talentOverview = movedReality.find(page => page.title === '2. Talents de Réalité');
talentOverview.title = 'Talents de Réalité — règles générales';
talentOverview.sections = [
  {
    id: 'catalogue',
    title: 'Catalogue',
    level: 2,
    blocks: [
      { type: 'p', text: 'Le catalogue canonique comprend 122 Talents : 12 communs, 25 d’expertise, 25 d’Origine et 60 de Sphère. Chaque Talent possède désormais sa propre page de règle.', style: 'RPG Callout' },
      { type: 'table', rows: [['Famille', 'Nombre'], ['Communs', '12'], ['Expertise', '25'], ['Origine', '25'], ['Sphère', '60'], ['Total', '122']] },
    ],
  },
  {
    id: 'principes',
    title: 'Principes communs',
    level: 2,
    blocks: talentPrinciples.map(text => ({ type: 'p', text, style: 'RPG List' })),
  },
];

const disadvantageOverview = movedReality.find(page => page.title === '3. Désavantages de Réalité');
disadvantageOverview.title = 'Désavantages de Réalité — règles générales';
disadvantageOverview.sections = [
  {
    id: 'catalogue',
    title: 'Catalogue',
    level: 2,
    blocks: [
      { type: 'p', text: 'Le catalogue canonique comprend 55 Désavantages : 15 communs, 15 liés aux Attributs et 25 de Sphère. Chaque Désavantage possède désormais sa propre page de règle.', style: 'RPG Callout' },
      { type: 'table', rows: [['Famille', 'Nombre'], ['Communs', '15'], ['Attributs', '15'], ['Sphère', '25'], ['Total', '55']] },
    ],
  },
  {
    id: 'principes',
    title: 'Principes',
    level: 2,
    blocks: (source.disadvantages.principles || []).map(text => ({ type: 'p', text, style: 'RPG List' })),
  },
  {
    id: 'philosophie',
    title: 'Philosophie de conception',
    level: 2,
    blocks: (source.disadvantages.designPhilosophy || []).map(text => ({ type: 'p', text, style: 'RPG List' })),
  },
];

const generatedTalents = source.talents.entries.map(talentPage);
const generatedDisadvantages = source.disadvantages.entries.map(disadvantagePage);

rules = [...rules, ...movedReality, ...movedTruth, ...generatedTalents, ...generatedDisadvantages];
reality = keptReality;
truth = keptTruth;

const allIds = new Set();
for (const [datasetId, pages] of [['moteur', rules], ['realite', reality], ['verite', truth]]) {
  for (const page of pages) {
    if (!page.id || !page.title || !page.category) throw new Error(`${datasetId}: page invalide ${JSON.stringify(page)}`);
    if (allIds.has(page.id)) throw new Error(`ID dupliqué après restructuration: ${page.id}`);
    allIds.add(page.id);
  }
}

if (generatedTalents.length !== 122) throw new Error('Catalogue Talents incomplet après génération');
if (generatedDisadvantages.length !== 55) throw new Error('Catalogue Désavantages incomplet après génération');
if (reality.some(page => realityRuleTitles.has(page.title))) throw new Error('Une page mécanique Réalité migrée est encore dans Réalité');
if (truth.some(page => truthRuleTitles.has(page.title))) throw new Error('Une page de règles communes Vérité est encore dans Vérité');

function writeDataset(id, pages, prefix) {
  const json = JSON.stringify(pages);
  const b64 = zlib.gzipSync(Buffer.from(json), { level: 9, mtime: 0 }).toString('base64');
  const partSize = 8000;
  const parts = Math.ceil(b64.length / partSize);
  for (let i = 0; i < parts; i += 1) {
    fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2, '0')}.b64part`, `${b64.slice(i * partSize, (i + 1) * partSize)}\n`, 'utf8');
  }
  const spec = specFor(id);
  spec.prefix = prefix;
  spec.parts = parts;
  spec.count = pages.length;
  spec.sha256 = crypto.createHash('sha256').update(b64).digest('hex');
  return { id, count: pages.length, parts, sha256: spec.sha256 };
}

const outputs = [
  writeDataset('moteur', rules, 'v3-regles-v2'),
  writeDataset('realite', reality, 'v3-realite-v2'),
  writeDataset('verite', truth, 'v3-verite-v2'),
];
manifest.expectedTotal = manifest.datasets.reduce((sum, spec) => sum + Number(spec.count || 0), 0);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`RESTRUCTURATION RÈGLES — ${generatedTalents.length} Talents + ${generatedDisadvantages.length} Désavantages individualisés.`);
console.log(`MIGRATION — ${movedReality.length} pages Réalité + ${movedTruth.length} pages Vérité reclassées dans Règles.`);
for (const output of outputs) console.log(`DATASET ${output.id} — ${output.count} pages · ${output.parts} fragments · SHA ${output.sha256.slice(0, 12)}…`);
console.log(`TOTAL V3 — ${manifest.expectedTotal}`);
