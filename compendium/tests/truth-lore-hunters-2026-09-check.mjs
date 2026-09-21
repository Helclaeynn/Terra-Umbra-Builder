import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const navigation=JSON.parse(fs.readFileSync(`${DATA}/navigation-v1.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
const all={lore:load('lore'),verite:load('verite'),bestiaire:load('bestiaire')};
const newIds=['lore-hunters-association','lore-hunters-association-gate-hunt','lore-hunters-xenoshield','lore-hunters-chretiens','lore-hunters-musulmans','lore-hunters-hindouistes','lore-hunters-shientaoistes','lore-hunters-confreries'];
for(const id of newIds){const p=all.lore.find(x=>x.id===id);if(!p)throw new Error(`Page Chasseurs absente: ${id}`);if(p.category!=='V\xe9rit\xe9')throw new Error(`${id}: cat\xe9gorie ${p.category}`);if(!(p.sections||[]).length)throw new Error(`${id}: aucune section`)}
const enrich=[
  ['verite','verite-055-19-formation-et-doctrine-de-chasseur','Origines historiques de la Chasse'],
  ['lore','verite-lore-traditions-chasseurs-detaillees','Association des Chasseurs — dossier détaillé'],
  ['lore','lore-angelus-kabbalistes-sephiriens','Fonctionnement des chasseurs kabbalistes'],
  ['lore','lore-extrals-groups-autres-factions-extrals','Cercle de Da’karva'],
  ['lore','lore-extrals-groups-emeraude-sanglante','Armées de purge alien — Émeraude sanglante'],
  ['lore','lore-extrals-groups-reptile','Confrérie de la Haine et chasse alien'],
  ['lore','lore-grands-exiles-chasse-fantastique','Origines et fonctionnement de la Chasse fantastique'],
  ['lore','lore-grands-exiles-autres-factions-exiles','Fils de Nathral'],
  ['verite','verite-046-10-vampires','Lavandières — chasse interne aux Cours'],
  ['lore','lore-pelages-pelages-concept','Chasse, Latents et Bêtes faramines'],
  ['bestiaire','bestiaire-v15-bete-faramine','Place parmi les Garous'],
  ['verite','verite-049-13-mages','Cryptomanciens — chasseurs des Mages'],
  ['verite','verite-052-16-aseryns','Chasseurs aseryns et Aeriliniens'],
  ['lore','lore-angelus-angelus-daemons','Purgateurs — chasseurs daemons et angelus'],
  ['lore','lore-plagues-contexte','Abominations chasseresses'],
  ['lore','lore-religions-christianisme-informations','Éclairage 2035 — influence sociale'],
  ['lore','lore-religions-islam-informations','Éclairage 2035 — organisation sociale'],
  ['lore','lore-religions-hindouisme-informations','Éclairage 2035 — brahmanes et diaspora'],
  ['lore','lore-religions-shientaoisme-informations','Éclairage 2035 — diversité des communautés'],
];
for(const [did,id,title] of enrich){const p=all[did].find(x=>x.id===id);if(!p)throw new Error(`Cible absente ${did}:${id}`);if(!(p.sections||[]).some(s=>s.title===title))throw new Error(`${id}: section absente ${title}`)}
const navById=new Map(navigation.entries.map(entry=>[entry.id,entry]));
const expectedHunterSubgroups=new Map([
  ['lore-hunters-association','Organisations de Chasse'],
  ['lore-hunters-association-gate-hunt','Organisations de Chasse'],
  ['lore-hunters-xenoshield','Organisations de Chasse'],
  ['lore-hunters-chretiens','Traditions religieuses de Chasse'],
  ['lore-hunters-musulmans','Traditions religieuses de Chasse'],
  ['lore-hunters-hindouistes','Traditions religieuses de Chasse'],
  ['lore-hunters-shientaoistes','Traditions religieuses de Chasse'],
  ['lore-hunters-confreries','Traditions religieuses de Chasse'],
]);
for(const id of newIds){const entry=navById.get(id);if(!entry)throw new Error(`Navigation absente: ${id}`);if(entry.category!=='Vérité'||entry.group!=='Chasseurs & traditions')throw new Error(`${id}: navigation inattendue ${entry.category} > ${entry.group}`);if(entry.subgroup!==expectedHunterSubgroups.get(id))throw new Error(`${id}: sous-groupe inattendu ${entry.subgroup}`)}
if(manifest.expectedTotal<1870)throw new Error(`Total V3 inférieur au socle Chasseurs 1870: ${manifest.expectedTotal}`);
console.log('TRUTH HUNTERS LORE OK \u2014 8 nouvelles pages, 19 enrichissements distribu\xe9s, aucun portrait requis.');
