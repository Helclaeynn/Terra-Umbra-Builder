// Shared, pure data contract. A player's technique description is never GM approval.
export const mageTechniqueIds = {
  echo: 'capacites_et_talents_communs_talents_communs_resonance_heritee',
  work: 'capacites_et_talents_communs_talents_communs_uvre_personnelle',
  family: 'capacites_et_talents_communs_talents_communs_heritage_familial'
} as const;
export type MageTechniqueKind = keyof typeof mageTechniqueIds;
export const mageTechniqueKinds = ['echo', 'work', 'family'] as const;
export const mageTechniqueNames = {echo:'Écho du Mageius',work:'Œuvre personnelle',family:'Héritage familial'} as const;
export const mageMasteries = [{id:'initiale',name:'Initiale'},{id:'affinee',name:'Affinée'},{id:'superieure',name:'Supérieure'},{id:'magistrale',name:'Magistrale'}] as const;
export const mageAmplitudes = [{id:'mineure',name:'Mineure'},{id:'significative',name:'Significative'},{id:'majeure',name:'Majeure'},{id:'cataclysmique',name:'Cataclysmique'}] as const;
export type MageRequirement = { affinity:string; mastery:string; amplitude:string };
export type MageTechnique = {
  name:string; effect:string; source:string; exception:string;
  requirements:MageRequirement[]; pa:number|null; range:string; tension:number|null;
};
export type MageTechniques = Partial<Record<MageTechniqueKind,MageTechnique>>;
const record=(value:unknown):Record<string,unknown>=>value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const text=(value:unknown,max:number)=>typeof value==='string'?value.replace(/\u0000/g,'').slice(0,max):'';
const integer=(value:unknown,max:number):number|null=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0&&value<=max?value:null;
export function mageTechniqueKind(id:string):MageTechniqueKind|undefined {
  return mageTechniqueKinds.find(kind=>mageTechniqueIds[kind]===id);
}
export function blankMageTechnique():MageTechnique {
  return {name:'',effect:'',source:'',exception:'',requirements:[{affinity:'',mastery:'initiale',amplitude:'mineure'}],pa:null,range:'',tension:null};
}
/** Whitelist fields and bound payloads; deliberately discard approval/author/reward fields. */
export function normalizeMageTechniques(value:unknown):MageTechniques {
  const input=record(value),out:MageTechniques={};
  for(const kind of mageTechniqueKinds){
    if(!Object.hasOwn(input,kind)||!input[kind]||typeof input[kind]!=='object'||Array.isArray(input[kind]))continue;
    const row=record(input[kind]);
    const requirements=(Array.isArray(row.requirements)?row.requirements:[]).slice(0,15).map(raw=>{
      const r=record(raw);return {affinity:text(r.affinity,80),mastery:mageMasteries.some(m=>m.id===r.mastery)?String(r.mastery):'',amplitude:mageAmplitudes.some(a=>a.id===r.amplitude)?String(r.amplitude):''};
    });
    out[kind]={name:text(row.name,160),effect:text(row.effect,4000),source:text(row.source,400),exception:text(row.exception,2000),requirements,pa:integer(row.pa,100),range:text(row.range,200),tension:integer(row.tension,20)};
  }
  return out;
}
export function mageTechniqueDefinitionIssues(kind:MageTechniqueKind,technique:MageTechnique|undefined,affinityIds:ReadonlySet<string>):string[] {
  if(!technique)return ['Définissez la technique avant son acquisition.'];
  const issues:string[]=[];
  if(!technique.name.trim())issues.push('Nom de la technique manquant.');
  if(!technique.effect.trim())issues.push('Effet concret manquant.');
  if(!technique.source.trim())issues.push(kind==='work'?'Développement narratif à préciser.':'Origine de l’Écho ou enseignement transmis à préciser.');
  if(kind!=='echo'&&!technique.exception.trim())issues.push('Règle particulière de la technique à préciser.');
  if(technique.pa===null)issues.push('Coût en PA manquant ou invalide.');
  if(technique.tension===null)issues.push('Tension manquante ou invalide.');
  if(!technique.range.trim())issues.push('Portée manquante.');
  if(!technique.requirements.length)issues.push('Au moins une Affinité est nécessaire.');
  if(kind==='echo'&&technique.requirements.length!==1)issues.push('Un Écho doit préciser une seule Affinité.');
  const seen=new Set<string>();
  for(const r of technique.requirements){
    if(!affinityIds.has(r.affinity))issues.push('Affinité requise non renseignée ou inconnue.');
    if(seen.has(r.affinity))issues.push('La même Affinité ne peut être indiquée deux fois.');
    seen.add(r.affinity);
    if(!mageMasteries.some(x=>x.id===r.mastery))issues.push('Maîtrise requise invalide.');
    if(!mageAmplitudes.some(x=>x.id===r.amplitude))issues.push('Amplitude requise invalide.');
  }
  return [...new Set(issues)];
}
