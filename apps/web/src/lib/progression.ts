export type CashTransaction={
  uid:string;
  amount:number;
  label:string;
  type:string;
  at:string;
};

export type ProgressionState={
  xpEarned:number;
  ptvEarned:number;
  skillRanks:Record<string,number>;
  attributeRanks:Record<string,number>;
  realityTalents:string[];
  truthTalents:string[];
  corruptionTalents:string[];
  truthTalentsMjAuthorized:boolean;
  truthEquipmentMjAuthorized:boolean;
  flashUses:string[];
  flashReady:boolean;
  flashArmed:boolean;
  cashBase:number|null;
  cashTransactions:CashTransaction[];
};

// Shared by the progression controls and the read-only character sheet.
export function currentSkillRaw(state:ProgressionState,bases:Record<string,number>,id:string){
  return Number(bases[id]||0)+Number(state.skillRanks[id]||0);
}
export function currentSkillFinal(state:ProgressionState,bases:Record<string,number>,finalBases:Record<string,number>,talentSkills:Record<string,string>,id:string){
  const creationBonus=Number(finalBases[id]||0)-Number(bases[id]||0);
  const learnedBonus=state.realityTalents.reduce((sum,talentId)=>sum+(talentSkills[talentId]===id?1:0),0);
  return currentSkillRaw(state,bases,id)+creationBonus+learnedBonus;
}
export function currentAttribute(state:ProgressionState,bases:Record<string,number>,id:string){
  return Number(bases[id]||0)+Number(state.attributeRanks[id]||0);
}

export const commerceDegrees=[
  {id:0,label:"Sans jet de Commerce",sale:.50,buy:1.00,delta:0},
  {id:1,label:"Réussite simple · DR 0–2",sale:.55,buy:.95,delta:5},
  {id:2,label:"Réussite solide · DR 3–5",sale:.60,buy:.90,delta:10},
  {id:3,label:"Réussite forte · DR 6–8",sale:.65,buy:.85,delta:15},
  {id:4,label:"Réussite majeure · DR 9–11",sale:.70,buy:.80,delta:20},
  {id:5,label:"Réussite exceptionnelle · DR 12–14",sale:.75,buy:.75,delta:25},
  {id:6,label:"Réussite légendaire · DR 15+",sale:.80,buy:.70,delta:30}
] as const;

function record(value:unknown):Record<string,unknown>{
  return value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function stringArray(value:unknown){
  return Array.isArray(value)?value.filter((item):item is string=>typeof item==="string"):[];
}
function nonNegativeInt(value:unknown){
  return Math.max(0,Math.floor(Number(value)||0));
}

export function ensureProgression(
  raw:Record<string,unknown>,
  skillIds:string[],
  attributeIds:string[]
):ProgressionState{
  const skillRanks=record(raw.skillRanks);
  const attributeRanks=record(raw.attributeRanks);
  const transactions=Array.isArray(raw.cashTransactions)
    ?raw.cashTransactions.filter(item=>item&&typeof item==="object"&&!Array.isArray(item)).map(item=>{
        const row=item as Record<string,unknown>;
        return {
          uid:String(row.uid??progressionUid("tx")),
          amount:Number(row.amount)||0,
          label:String(row.label??"Mouvement d’argent"),
          type:String(row.type??"manual"),
          at:String(row.at??new Date(0).toISOString())
        };
      })
    :[];

  const next:ProgressionState={
    xpEarned:Math.max(0,Number(raw.xpEarned)||0),
    ptvEarned:Math.max(0,Number(raw.ptvEarned)||0),
    skillRanks:Object.fromEntries(skillIds.map(id=>[id,nonNegativeInt(skillRanks[id])])),
    attributeRanks:Object.fromEntries(attributeIds.map(id=>[id,nonNegativeInt(attributeRanks[id])])),
    realityTalents:stringArray(raw.realityTalents),
    truthTalents:stringArray(raw.truthTalents),
    corruptionTalents:stringArray(raw.corruptionTalents),
    truthTalentsMjAuthorized:Boolean(raw.truthTalentsMjAuthorized),
    truthEquipmentMjAuthorized:Boolean(raw.truthEquipmentMjAuthorized),
    flashUses:stringArray(raw.flashUses),
    flashReady:raw.flashReady!==false,
    flashArmed:Boolean(raw.flashArmed),
    cashBase:raw.cashBase===null||raw.cashBase===undefined
      ?null
      :(Number.isFinite(Number(raw.cashBase))?Number(raw.cashBase):null),
    cashTransactions:transactions
  };
  Object.assign(raw,next);
  return raw as unknown as ProgressionState;
}

export function flashKey(skillId:string,step:number){
  return skillId+":"+step;
}

export function skillStepBaseCost(base:number,step:number){
  const from=base+step-1;
  return from===0?3:from+1;
}

export function skillStepCost(
  state:ProgressionState,
  skillId:string,
  base:number,
  step:number
){
  const baseCost=skillStepBaseCost(base,step);
  return state.flashUses.includes(flashKey(skillId,step))
    ?Math.max(1,baseCost-2)
    :baseCost;
}

export function skillSpent(
  state:ProgressionState,
  skillId:string,
  base:number
){
  const ranks=Math.max(0,Number(state.skillRanks[skillId])||0);
  let total=0;
  for(let step=1;step<=ranks;step++)total+=skillStepCost(state,skillId,base,step);
  return total;
}

export function attributeStepCost(base:number,step:number){
  return 3*(base+step);
}

export function attributeSpent(
  state:ProgressionState,
  attributeId:string,
  base:number
){
  const ranks=Math.max(0,Number(state.attributeRanks[attributeId])||0);
  let total=0;
  for(let step=1;step<=ranks;step++)total+=attributeStepCost(base,step);
  return total;
}

export function xpSpent(
  state:ProgressionState,
  skillBases:Record<string,number>,
  attributeBases:Record<string,number>
){
  const skills=Object.entries(skillBases).reduce(
    (sum,[id,base])=>sum+skillSpent(state,id,base),
    0
  );
  const attributes=Object.entries(attributeBases).reduce(
    (sum,[id,base])=>sum+attributeSpent(state,id,base),
    0
  );
  return skills+attributes+state.realityTalents.length*10;
}

export function xpRemaining(
  state:ProgressionState,
  skillBases:Record<string,number>,
  attributeBases:Record<string,number>
){
  return Math.max(0,Number(state.xpEarned)||0)-xpSpent(state,skillBases,attributeBases);
}

export function ptvSpent(
  state:ProgressionState,
  costOf:(id:string)=>number,
  corruptionCostOf:(id:string)=>number=()=>0
){
  return state.truthTalents.reduce((sum,id)=>sum+Math.max(0,Number(costOf(id))||0),0)+
    (state.corruptionTalents??[]).reduce((sum,id)=>sum+Math.max(0,Number(corruptionCostOf(id))||0),0);
}

export function ptvRemaining(
  state:ProgressionState,
  creationReserve:number,
  costOf:(id:string)=>number,
  corruptionCostOf:(id:string)=>number=()=>0
){
  return Math.max(0,creationReserve)+Math.max(0,Number(state.ptvEarned)||0)-ptvSpent(state,costOf,corruptionCostOf);
}

export function campaignCashBase(state:ProgressionState,creationAccount:number){
  return state.cashBase===null?Math.max(0,creationAccount):state.cashBase;
}

export function campaignCash(state:ProgressionState,creationAccount:number){
  return campaignCashBase(state,creationAccount)+
    state.cashTransactions.reduce((sum,item)=>sum+Number(item.amount||0),0);
}

export function freezeCampaignCash(state:ProgressionState,creationAccount:number){
  if(state.cashBase===null)state.cashBase=Math.max(0,creationAccount);
  return state.cashBase;
}

export function addCashTransaction(
  state:ProgressionState,
  creationAccount:number,
  amount:number,
  label:string,
  type="manual"
){
  freezeCampaignCash(state,creationAccount);
  const rounded=Math.round(Number(amount)||0);
  if(!rounded)return;
  state.cashTransactions.push({
    uid:progressionUid("tx"),
    amount:rounded,
    label:String(label||"Mouvement d’argent"),
    type,
    at:new Date().toISOString()
  });
}

export function commerceDegree(id:number){
  const index=Math.max(0,Math.min(commerceDegrees.length-1,Math.floor(Number(id)||0)));
  return commerceDegrees[index];
}

export function progressionUid(prefix:string){
  return prefix+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
}
