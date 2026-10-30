import assert from 'node:assert/strict';
import {truthCatalogVampire as original} from '../dist/rules/truth/catalog-vampire.js';
import {terraUmbraTruthRules as pkg} from '../dist/rules/truth/rules.js';
import {normalizeVampireBuild} from '../dist/rules/truth/vampire-build.js';
const rows=pkg.catalogs.vampire;assert.equal(rows.length,71);assert.equal(new Set(rows.map(t=>t.id)).size,71);assert.equal(rows.reduce((n,t)=>n+t.cost,0),113);
for(const old of original){const t=rows.find(t=>t.id===old.id);for(const key of ['name','cost','group','prerequisite','prerequisiteName'])assert.equal(t[key],old[key],old.id+' '+key);assert.ok(t.effectDetails);assert.ok([...new Intl.Segmenter('fr',{granularity:'sentence'}).segment(t.effect)].length<=2,t.id);}
const byId=id=>rows.find(t=>t.id===id).effectDetails;
assert.match(byId('sang_preserve'),/avant son passage au Néant/);assert.match(byId('sang_preserve'),/24 heures/);assert.match(byId('lien_du_deimon'),/déjà rencontré et consentant/);assert.match(byId('deferlement_ecarlate'),/sans PA/);assert.match(byId('arme_hematique'),/DGT 5.*DGT 4.*DGT 5/);
const clean=normalizeVampireBuild({forms:Array.from({length:8},()=>({articleId:'a',name:'A',role:'vol',attributes:99})),deimon:{reference:'PNJ',name:'Nom',pa:99},anchor:{container:'flacon',heal:99},approved:true});assert.equal(clean.forms.length,4);assert.equal(clean.forms[0].attributes,undefined);assert.equal(clean.deimon.pa,undefined);assert.equal(clean.anchor.heal,undefined);assert.equal(clean.approved,undefined);
console.log('VAMPIRE API OK — 71 stable IDs, 113 unchanged PTV, exact prerequisites, short cards, complete rules and bounded permanent records');
