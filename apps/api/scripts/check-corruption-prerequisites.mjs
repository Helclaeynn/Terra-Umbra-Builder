// Node 22.6+ with --experimental-strip-types, or Node 24+.
// Run from the repository root; no database or HTTP service required.
import assert from 'node:assert/strict';
import {corruptionTalents} from '../src/rules/truth/corruption.ts';
import {truthCorruptionPrerequisiteSatisfied, truthCorruptionTalentActive} from '../../web/src/lib/truth.ts';

const expected = new Map([
  ['Partage de l’Écume', 'Récolter les miettes'],
  ['Choisir la bouchée', 'Récolter les miettes'],
  ['Autel affamé', 'Partage de l’Écume'],
  ['Toucher contaminant', 'Porteur sain'],
  ['Écume du Porteur', 'Porteur sain'],
  ['Deuxième estomac', 'Digestion lente'],
  ['Assimilation interdite', 'Deuxième estomac'],
  ['Affinité dévorée', 'Goûter le Mageius'],
  ['Dévorer le Mageius', 'Affinité dévorée'],
  ['Se fondre dans le noir', 'Ombre docile'],
  ['Ombre solide', 'Ombre docile'],
  ['Voir par ce qui est mien', 'Annexe sombre'],
  ['Corps-annexe', 'Annexe sombre'],
  ['Rejoindre ce qui est mien', 'Annexe sombre'],
  ['Noyer la silhouette', 'Ombre docile'],
  ['Enfoncer la ténèbre', 'Souillure d’Ombre'],
  ['Ombre appropriée', 'Enfoncer la ténèbre'],
  ['Appeler par le nom', 'Nom dans la nuit'],
  ['Arracher à l’Ombre', 'Appeler par le nom'],
  ['Prendre les rênes', 'Ombre appropriée'],
  ['Traverser le sanctuaire', 'Hérésie désignée'],
  ['Coup d’angle mort', 'Ombre de la proie'],
  ['Écarter la couture', 'Voir la couture'],
  ['Conception impossible', 'Illumination'],
  ['Transmission charnelle', 'Porte des Secrets'],
  ['Régénération dirigée', 'Correction fonctionnelle'],
  ['Mue successive', 'Adaptation durable'],
  ['Bourgeon sensoriel', 'Sang-graine'],
  ['Hérédité choisie', 'Viabilité impossible'],
  ['Hérédité abyssale', 'Corps du peuple'],
  ['Réseau myxinien', 'Marque visqueuse']
]);

assert.equal(corruptionTalents.length, 227);
assert.equal(new Set(corruptionTalents.map(t => t.id)).size, 227);
assert.equal(corruptionTalents.reduce((sum, t) => sum + t.cost, 0), 493);
assert.equal(corruptionTalents.filter(t => t.prerequisiteName).length, expected.size);
for (const talent of corruptionTalents) {
  assert.equal(talent.prerequisiteName, expected.get(talent.name) || '', talent.name);
  if (!talent.prerequisiteName) continue;
  const prerequisite = corruptionTalents.find(t => t.name === talent.prerequisiteName);
  assert(prerequisite, `Missing prerequisite for ${talent.name}`);
  assert.equal(prerequisite.sourceId, talent.sourceId);
  assert.notEqual(prerequisite.id, talent.id);
  const rules = {corruption: {talents: corruptionTalents}};
  assert.equal(truthCorruptionPrerequisiteSatisfied(rules, {corruptionTalents: []}, talent), false);
  assert.equal(truthCorruptionPrerequisiteSatisfied(rules, {corruptionTalents: [prerequisite.id]}, talent), true);
  assert.equal(truthCorruptionPrerequisiteSatisfied(rules, {corruptionTalents: [talent.id]}, talent), false);
}
const nearRupture = corruptionTalents.filter(t => t.kind === 'DON' && /Au bord/i.test(t.access));
assert.equal(nearRupture.length, 21);
assert(corruptionTalents.filter(t => t.kind === 'DON').every(t => t.depth));
for (const talent of nearRupture) {
  assert.equal(talent.depth, 'Au bord de la Rupture', talent.name);
  for (const corruption of [0, 1, 3, 4]) {
    assert.equal(truthCorruptionTalentActive(talent, {corruption, corruptionSource: talent.sourceId}, 6), false, talent.name);
  }
  for (const corruption of [5, 6]) {
    assert.equal(truthCorruptionTalentActive(talent, {corruption, corruptionSource: talent.sourceId}, 6), true, talent.name);
  }
  assert.equal(truthCorruptionTalentActive(talent, {corruption: 5, corruptionSource: 'another-source'}, 6), false);
}
// Every chain must terminate in an entry-level capacity.
for (const talent of corruptionTalents) {
  const seen = new Set();
  let current = talent;
  while (current.prerequisiteName) {
    assert(!seen.has(current.id), `Circular prerequisite for ${talent.name}`);
    seen.add(current.id);
    current = corruptionTalents.find(t => t.name === current.prerequisiteName);
  }
}
console.log('227 capacities, 493 PTV, 31 complete prerequisites: all chains resolve without cycles. 21 near-Rupture DON depth gates verified.');
