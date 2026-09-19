import { terraUmbraTruthRules } from "./truth/rules.js";

export type TalentRegistryRow={
  talentId:string;
  natureId:string;
  groupId:string;
  groupLabel:string;
  name:string;
  lore:string;
  mechanics:string;
  cost:number;
  access:string;
  prerequisiteId?:string;
  prerequisiteName?:string;
};

function slug(value:string){
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");
}

export function talentGroupId(natureId:string,groupLabel:string){
  return natureId+":"+slug(groupLabel||"commun");
}

let cache:TalentRegistryRow[]|null=null;

export function getTalentRegistry():TalentRegistryRow[]{
  if(cache)return cache;
  const rows:TalentRegistryRow[]=[];

  for(const [natureId,catalog] of Object.entries(terraUmbraTruthRules.catalogs)){
    for(const raw of catalog as readonly Record<string,unknown>[]){
      const groupLabel=String(raw.group??"Commun").trim()||"Commun";
      rows.push({
        talentId:String(raw.id??"").trim(),
        natureId,
        groupId:talentGroupId(natureId,groupLabel),
        groupLabel,
        name:String(raw.name??raw.id??"").trim(),
        lore:String(raw.runtimeLore??"").trim(),
        mechanics:String(raw.effect??"").trim(),
        cost:Number(raw.cost??0),
        access:String(raw.access??"").trim(),
        ...(raw.prerequisite?{prerequisiteId:String(raw.prerequisite)}:{}),
        ...(raw.prerequisiteName?{prerequisiteName:String(raw.prerequisiteName)}:{})
      });
    }
  }

  cache=rows.filter(row=>row.talentId&&row.name);
  return cache;
}

export function queryTalentRegistry(filters:{
  natureId?:string;
  groupId?:string;
  ids?:string[];
}={}){
  const ids=new Set((filters.ids??[]).filter(Boolean));
  return getTalentRegistry().filter(row=>{
    if(filters.natureId&&row.natureId!==filters.natureId)return false;
    if(filters.groupId&&row.groupId!==filters.groupId)return false;
    if(ids.size&&!ids.has(row.talentId))return false;
    return true;
  });
}

export function talentRegistryMeta(){
  const rows=getTalentRegistry();
  const groups=new Map<string,{groupId:string;natureId:string;label:string;count:number}>();
  for(const row of rows){
    const current=groups.get(row.groupId)??{
      groupId:row.groupId,natureId:row.natureId,label:row.groupLabel,count:0
    };
    current.count+=1;
    groups.set(row.groupId,current);
  }
  return{
    total:rows.length,
    natures:[...new Set(rows.map(row=>row.natureId))],
    groups:[...groups.values()].sort((a,b)=>a.natureId.localeCompare(b.natureId)||a.label.localeCompare(b.label,"fr"))
  };
}
