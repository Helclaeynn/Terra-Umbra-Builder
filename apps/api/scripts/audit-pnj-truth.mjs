// Run after `npm run build`: DATABASE_URL=postgres://local:local@localhost/local
// node scripts/audit-pnj-truth.mjs /tmp/tuc-pnj-truth-audit.json
// This uses the same assembled active corpus as the site. It does not infer
// purchases, powers, or PTV from a race, a title, or a public occupation.
import { writeFile } from 'node:fs/promises';
import pg from 'pg';

pg.Pool.prototype.query = async () => ({ rows: [], rowCount: 0 });
const { getCompendiumQualityCorpus } = await import('../dist/compendium.js');
const { INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS } = await import('../dist/compendium-pnj-truth-profiles.js');
const corpus = await getCompendiumQualityCorpus();
const people = corpus.articles.filter(article => article.category === 'Personnages');
const reviewed = new Set(INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS);

const entries = people.map(article => {
  const pnj = article.pnj ?? {};
  const realitySection = article.sections?.find(section => section.id === 'profil-statistique');
  const realityIntro = realitySection?.blocks?.[0]?.text ?? '';
  const truthSections = (article.sections ?? []).filter(section =>
    section.audience === 'mj' && section.id !== 'profil-statistique');
  const evidence = truthSections.flatMap(section => (section.blocks ?? []).flatMap((block, index) => {
    if (block.type !== 'p' || !block.text?.trim()) return [];
    return [{ sectionId: section.id, blockIndex: index, text: block.text.trim() }];
  }));
  const truthIdentity = Boolean(pnj.nom_verite || pnj.race || pnj.statut_verite);
  return {
    id: article.id,
    title: article.title,
    source: article.source ?? null,
    dataset: article.dataset ?? null,
    realityTier: realityIntro.match(/^(Sbire|Ennemi lambda|Entraîné|Élite|Haute élite|Héroïque|Légendaire|Supérieur)/)?.[1] ?? null,
    hasRealityStats: Boolean(realitySection?.blocks?.length > 1),
    individuallyReviewedTruthProfile: reviewed.has(article.id),
    truth: {
      identity: pnj.nom_verite ?? null,
      natureRaw: pnj.race ?? null,
      statusRaw: pnj.statut_verite ?? null,
      organization: pnj.organisation ?? null,
      hasTruthMetadata: truthIdentity,
      evidence
    }
  };
});
const summary = {
  active: entries.length,
  truthMetadata: entries.filter(entry => entry.truth.hasTruthMetadata).length,
  realityStats: entries.filter(entry => entry.hasRealityStats).length,
  individuallyReviewedTruthProfiles: entries.filter(entry => entry.individuallyReviewedTruthProfile).length,
  natureCounts: Object.fromEntries([...new Set(entries.map(entry => entry.truth.natureRaw).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'fr'))
    .map(nature => [nature, entries.filter(entry => entry.truth.natureRaw === nature).length]))
};
const output = JSON.stringify({ summary, entries }, null, 2);
if (process.argv[2]) await writeFile(process.argv[2], output);
else console.log(output);
console.error(`Audited ${summary.active} active PNJ; ${summary.truthMetadata} have Truth metadata; ${summary.realityStats} have Reality stats.`);
