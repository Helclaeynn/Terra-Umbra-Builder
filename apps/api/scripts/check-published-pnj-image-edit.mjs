import assert from 'node:assert/strict';
import { applyNamedPnjStatProfile } from '../dist/compendium-pnj-corporate-stats.js';

const profile = { tier: 'elite', shape: 'terrain', skills: ['Autorité', 'Tir', 'Survie', 'Investigation'], anchor: 'fiche test', talents: ['test'] };
const article = { id: 'pnj-test-image', title: 'PNJ test', sections: [{ id: 'profil-statistique', title: 'Statistiques', audience: 'mj', blocks: [] }] };
applyNamedPnjStatProfile(article, profile);
const blocks = structuredClone(article.sections[0].blocks);
const edited = { ...structuredClone(article), image: null, __wikiPublishedEdit: true };
applyNamedPnjStatProfile(edited, profile);
assert.deepEqual(edited.sections[0].blocks, blocks, 'An image edit preserves the published statistics');
assert.equal(edited.sections.filter(section => section.id === 'profil-statistique').length, 1);
assert.equal(edited.sections[0].audience, 'mj');
console.log('Published PNJ image removal keeps one private statistical profile.');
