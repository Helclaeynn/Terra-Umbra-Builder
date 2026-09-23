export type SceneReference={npcId?:string;articleId:string;title:string;category:string;quantity:number;notes:string};
export type CampaignScene={id:string;title:string;notes:string;done:boolean;references:SceneReference[]};
export function validScenes(value:unknown):value is CampaignScene[]{
 if(!Array.isArray(value)||value.length>30||JSON.stringify(value).length>150000)return false;
 const text=(v:unknown,max:number)=>typeof v==='string'&&v.length<=max;
 const ids=new Set();
 return value.every(s=>{
  if(!s||typeof s!=='object'||!text(s.id,80)||!s.id||ids.has(s.id)||!text(s.title,120)||!s.title.trim()||!text(s.notes,6000)||typeof s.done!=='boolean'||!Array.isArray(s.references)||s.references.length>30)return false;
  ids.add(s.id);const refs=new Set();
  return s.references.every((r:any)=>{
   if(!r||typeof r!=='object'||!text(r.articleId,200)||!r.articleId||refs.has(r.articleId)||!text(r.title,300)||!text(r.category,100)||!text(r.notes,2000)||!Number.isInteger(r.quantity)||r.quantity<1||r.quantity>999)return false;
   if(r.npcId!==undefined&&(typeof r.npcId!=='string'||!/^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(r.npcId)||r.articleId!=='campaign-npc:'+r.npcId))return false;
   if(r.articleId.startsWith('campaign-npc:')&&!r.npcId)return false;
   refs.add(r.articleId);return true;
  });
 });
}
export function cleanScenes(scenes:CampaignScene[]){return scenes.map(s=>({id:s.id,title:s.title,notes:s.notes,done:s.done,references:s.references.map(r=>({articleId:r.articleId,title:r.title,category:r.category,quantity:r.quantity,notes:r.notes,...(r.npcId?{npcId:r.npcId}:{})}))}));}
