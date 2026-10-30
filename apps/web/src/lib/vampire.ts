import type {TruthState,TruthRulesPackage,TruthTalent} from './truth';
export {normalizeVampireBuild,vampireAnimalRoles,vampireWeaponProfiles} from '../../../api/src/rules/truth/vampire-build';
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ').toLowerCase();
export function vampireAwakening(id:string){const parts=id.startsWith('vampire_awaken_')?id.slice(15).split('__'):[];return parts.length===2?{from:parts[0]!,blood:parts[1]!}:null;}
export function vampireBloodOptions(pkg:TruthRulesPackage){return pkg.structure.natures.vampire?.choices.find(c=>c.key==='blood')?.options??[];}
export function vampireNativeBlood(s:TruthState){return s.truthTalents.map(vampireAwakening).find(Boolean)?.from??String(s.choices.blood??'');}
function bloodRows(pkg:TruthRulesPackage,blood:string){const needles=pkg.visibility.needles.vampire?.[blood]??[];return (pkg.catalogs.vampire??[]).filter(t=>needles.some(n=>norm(t.group).includes(norm(n))));}
function mastered(pkg:TruthRulesPackage,ids:string[],blood:string){const rows=bloodRows(pkg,blood),owned=new Set(ids),valid=new Set<string>();for(let i=0;i<rows.length;i++)for(const t of rows)if(owned.has(t.id)&&(!t.prerequisite||valid.has(t.prerequisite)))valid.add(t.id);return rows.reduce((n,t)=>n+(valid.has(t.id)?t.cost:0),0)>=4;}
/** Validate mastery at the moment of each awakening, not from future purchases. */
export function vampireAwakenedBloods(pkg:TruthRulesPackage,s:TruthState){
 if(s.nature!=='vampire')return [];const options=vampireBloodOptions(pkg),native=vampireNativeBlood(s);if(!options.some(o=>o.id===native))return [];
 const chain=[native],prior:string[]=[];for(const id of s.truthTalents){const a=vampireAwakening(id);if(a&&a.from===chain.at(-1)&&!chain.includes(a.blood)&&options.some(o=>o.id===a.blood)&&mastered(pkg,prior,a.from))chain.push(a.blood);prior.push(id);}return chain;
}
export function vampireAwakeningTalents(pkg:TruthRulesPackage,s:TruthState,all=false):TruthTalent[]{
 if(s.nature!=='vampire')return [];const options=vampireBloodOptions(pkg),chain=vampireAwakenedBloods(pkg,s),froms=all?options.map(o=>o.id):[chain.at(-1)??''];
 return froms.filter(Boolean).flatMap(from=>options.filter(o=>o.id!==from&&(all||!chain.includes(o.id))).map(o=>({id:'vampire_awaken_'+from+'__'+o.id,name:'Éveiller '+o.name,cost:3,group:'Éveiller un autre Sang',access:'Progression',effect:'Après 4 PTV de talents valides dans le dernier Sang éveillé, ouvrez ce nouveau Sang pour 3 PTV. Aucun talent n’est offert ; les Sangs précédents restent acquis.',prerequisiteName:'4 PTV dans le dernier Sang éveillé',effectDetails:o.description})));
}
export function vampireVisibleTalent(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent){
 if(s.nature!=='vampire')return false;if(vampireAwakening(t.id))return vampireAwakeningTalents(pkg,s).some(a=>a.id===t.id);
 const g=norm(t.group);return g.includes('vampire commun')||(pkg.visibility.needles.vampire?.[String(s.choices.court??'')]??[]).some(n=>g.includes(norm(n)))||vampireAwakenedBloods(pkg,s).some(b=>bloodRows(pkg,b).some(r=>r.id===t.id));
}
export function vampireAcquisitionIssues(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent):string[]|null{
 if(s.nature!=='vampire'||!(pkg.catalogs.vampire??[]).some(r=>r.id===t.id)&&!vampireAwakening(t.id))return null;
 const issues:string[]=[];if(s.consciousness==='profane')issues.push('Initiation à la Vérité nécessaire.');
 const a=vampireAwakening(t.id);if(a){const chain=vampireAwakenedBloods(pkg,s),i=chain.indexOf(a.blood),paid=s.truthTalents.includes(t.id);if(!(i>0&&chain[i-1]===a.from)&&(paid||!vampireVisibleTalent(pkg,s,t)||!mastered(pkg,s.truthTalents,a.from)))issues.push('4 PTV valides dans le dernier Sang éveillé sont requis avant cet éveil.');return issues;}
 if(!vampireVisibleTalent(pkg,s,t))issues.push('Cour ou Sang incompatible ; achat conservé.');
 const byId=new Map((pkg.catalogs.vampire??[]).map(r=>[r.id,r]));const seen=new Set<string>();let p=t.prerequisite;
 while(p){if(p==='echo_des_morts'){if(s.choices.court!=='alghul_almalakiu')issues.push('Écho des Morts requis.');break;}const parent=byId.get(p);if(seen.has(p)||!parent||!s.truthTalents.includes(p)||!vampireVisibleTalent(pkg,s,parent)){issues.push('Prérequis indisponible : '+(parent?.name??p));break;}seen.add(p);p=parent.prerequisite;}
 return issues;
}
export function vampireUnavailable(pkg:TruthRulesPackage,s:TruthState){if(s.nature!=='vampire')return [];const rows=new Map([...(pkg.catalogs.vampire??[]),...vampireAwakeningTalents(pkg,s,true)].map(t=>[t.id,t]));return s.truthTalents.filter(id=>{const t=rows.get(id);return t&&(vampireAcquisitionIssues(pkg,s,t)?.length??0)>0;});}
