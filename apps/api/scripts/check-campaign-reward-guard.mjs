import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {campaignRewardViolation, pinCampaignCash} from '../dist/campaign-reward-guard.js';
import {purchaseWithTalents, saleWithTalents} from '../dist/rules/reality-talents-policy.js';

const item = (id, price, extra={}) => ({id,name:id,kind:'equipment',category:'Armes de poing',sourceCategory:'Armes',price,priceMin:price,priceMax:price,priceLabel:price+' $',generation:null,charge:0,stress:0,slots:0,effect:'',lore:'',data:{},vehicle:false,neuro:false,recurring:'durable_purchase',monthlyCost:0,families:[],...extra});
const gun=item('gun',1000),limit=item('gun-limit',5000),over=item('gun-over',5001),kit=item('kit',1000,{category:'Outils',sourceCategory:'Outils'}),ammo=item('ammo',30,{category:'Munitions',sourceCategory:'Munitions'}),car=item('car',9000,{vehicle:true,category:'Véhicules'});
const context={base:10000,items:[gun,limit,over,kit,ammo,car]};
const asset=(uid='owned',extra={})=>({uid,itemId:'gun',kind:'equipment',selectedPrice:1000,cataloguePrice:1000,priceConfirmed:true,...extra});
const seed=()=>({creation:{origin:'mafieuse',sphere:'mafieuse',style:'soldato'},talents:{sphere:'armurier_du_milieu',edge:[]},truth:{corruption:1,corruptionSource:'source',corruptionMjAuthorized:true},reality:{equipment:[asset()],augmentations:[],fixedChargeItems:[]},progression:{xpEarned:30,ptvEarned:10,cashBase:10000,cashTransactions:[{uid:'gm-award',amount:500,label:'Récompense',type:'campaign-gm',at:'2026-09-27'}]}});
const tx=(uid,amount,type='manual',trade)=>({uid,amount,type,label:'Test',at:'2026-09-28',...(trade?{trade}:{})});
let checks=0;
function accept(mutate, {before=seed(),restore=false}={}){const after=structuredClone(before);mutate(after);assert.equal(campaignRewardViolation(before,after,restore,context),null);checks++;return after;}
function deny(mutate, expected, {before=seed(),restore=false}={}){const after=structuredClone(before);mutate(after);const failure=campaignRewardViolation(before,after,restore,context);assert.ok(failure,expected||'Expected rejection');if(expected)assert.equal(failure,expected);checks++;}
accept(()=>{});accept(d=>{d.identity={notes:'Notes modifiables'};d.progression.skillRanks={melee:1};d.progression.realityTalents=['renomme'];});
for(const field of ['xpEarned','ptvEarned'])for(const value of [0,999,Infinity,NaN,-1])deny(d=>d.progression[field]=value,field==='xpEarned'?'xp':'ptv');
for(const value of [0,2,100,NaN])deny(d=>d.truth.corruption=value,'corruption');
deny(d=>d.truth.corruptionSource='other','corruption');deny(d=>d.truth.corruptionMjAuthorized=false,'corruption');
deny(d=>d.progression.cashBase=10001,'cash_base');
accept(d=>d.progression.cashBase=null);
deny(d=>d.progression.cashTransactions=[],'cash_history');
deny(d=>d.progression.cashTransactions[0].amount=501,'cash_history');
deny(d=>d.progression.cashTransactions[0].label='Retouche','cash_history');
for(const type of ['manual','campaign-gm','gain','refund','award','expense'])deny(d=>d.progression.cashTransactions.push(tx('forged',100,type)),'cash_reward');
deny(d=>{d.campaignId=null;d.progression.xpEarned=500;},'xp');
accept(d=>d.progression.cashTransactions.push(tx('cost',-100)));
deny(d=>d.progression.cashTransactions.push(tx('cost',-20000)),'cash_insufficient');
deny(d=>d.progression.cashTransactions.push(tx('gm-award',-100)),'cash_transaction');
deny(d=>d.progression.cashTransactions.push(tx('fraction',-2.5)),'cash_transaction');
deny(d=>d.reality.equipment[0].cataloguePrice=100000,'inventory_value');
deny(d=>d.reality.equipment[0].itemId='gun-limit','inventory_value');
accept(d=>d.reality.equipment[0].loaded=true);
accept(d=>d.reality.equipment=[]); // discard: no credit
for(let degree=0;degree<=6;degree++){
 for(const troc of [false,true]){
  const before=seed();if(troc)before.talents.edge=['maitre_du_troc'];
  const credit=saleWithTalents(1000,.5+degree*.05,troc);
  const sold=accept(d=>{d.reality.equipment=[];d.progression.cashTransactions.push(tx('sold',credit,'sale',{uid:'owned',degree}));},{before});
  deny(d=>d.progression.cashTransactions.push(tx('again',credit,'sale',{uid:'owned',degree})),'sale_asset',{before:sold});
  deny(d=>d.reality.equipment.push(asset()),'inventory_grant',{before:sold});
  deny(d=>{d.reality.equipment=[];d.progression.cashTransactions.push(tx('too-much',credit+1,'sale',{uid:'owned',degree}));},'sale_amount',{before});
 }
}
deny(d=>d.progression.cashTransactions.push(tx('kept',500,'sale',{uid:'owned',degree:0})),'sale_asset');
deny(d=>{d.reality.equipment=[];d.progression.cashTransactions.push(tx('missing',500,'sale'));},'trade');
deny(d=>{d.reality.equipment=[];d.progression.cashTransactions.push(tx('bad-degree',500,'sale',{uid:'owned',degree:7}));},'trade');
const loanSeed=seed();loanSeed.reality.equipment=[asset('loan',{selectedPrice:0,talentGrant:'armurier_du_milieu',grantCreated:true})];
deny(d=>{d.reality.equipment=[];d.progression.cashTransactions.push(tx('loan-sale',500,'sale',{uid:'loan',degree:0}));},'sale_asset',{before:loanSeed});
deny(d=>delete d.reality.equipment[0].talentGrant,'inventory_value',{before:loanSeed});
accept(d=>d.reality.equipment=[],{before:loanSeed});
for(const chosen of [gun,limit])accept(d=>d.reality.equipment.push(asset('loan',{itemId:chosen.id,selectedPrice:0,cataloguePrice:chosen.price,talentGrant:'armurier_du_milieu',grantCreated:true,acquiredInCampaign:true})));
for(const chosen of [over,ammo,kit,car])deny(d=>d.reality.equipment.push(asset('loan',{itemId:chosen.id,selectedPrice:0,cataloguePrice:chosen.price,talentGrant:'armurier_du_milieu',grantCreated:true})), 'inventory_grant');
deny(d=>d.reality.equipment.push(asset('free',{selectedPrice:0,acquiredInCampaign:true})),'inventory_grant');
for(let degree=0;degree<=6;degree++)for(const troc of [false,true])for(const supplier of [false,true]){
 const before=seed();before.creation.sphere='corporatiste';before.talents.edge=[...(troc?['maitre_du_troc']:[]),...(supplier?['acces_fournisseur']:[])];
 const cost=purchaseWithTalents(1000,1-degree*.05,troc,supplier);
 const received=accept(d=>{
  d.reality.equipment.push(asset('bought',{selectedPrice:cost,campaignCatalogPrice:1000,acquiredInCampaign:true}));
  d.progression.cashTransactions.push(tx('buy',-cost,'purchase',{uid:'bought',itemId:'gun',reference:1000,degree,supplier}));
 },{before});
 accept(d=>{d.reality.equipment=d.reality.equipment.filter(a=>a.uid!=='bought');d.progression.cashTransactions.push(tx('sell',saleWithTalents(1000,.5,troc),'sale',{uid:'bought',degree:0}));},{before:received});
 deny(d=>{d.reality.equipment.push(asset('bought',{selectedPrice:cost,campaignCatalogPrice:1000,acquiredInCampaign:true}));d.progression.cashTransactions.push(tx('buy',-cost+1,'purchase',{uid:'bought',itemId:'gun',reference:1000,degree,supplier}));},'purchase_amount',{before});
}
accept(d=>{d.progression.cashTransactions.push(tx('buy',-1000,'purchase',{uid:'round-trip',itemId:'gun',reference:1000,degree:0}),tx('sell',500,'sale',{uid:'round-trip',degree:0}));});
deny(d=>{d.progression.cashTransactions.push(tx('buy',-1,'purchase',{uid:'cheap',itemId:'gun',reference:1,degree:0}));},'purchase_asset');
accept(d=>{d.identity={notes:'Restaurer des notes sans altérer de récompense'};},{restore:true});
deny(d=>d.progression.xpEarned=0,'xp',{restore:true});
deny(d=>d.progression.cashTransactions.push(tx('added',-1)),'cash_history',{restore:true});
const source=seed(),copy=structuredClone(source);pinCampaignCash(copy);copy.progression.xpEarned=99;assert.equal(source.progression.xpEarned,30);checks++;
const routes=readFileSync(new URL('../src/characters.ts',import.meta.url),'utf8');
assert.equal((routes.match(/if\(current.campaignId\)\{/g)||[]).length,2,'Both saving and restoration guard the server-owned campaign ID');
assert.match(routes,/current\.version !== version[\s\S]*campaignRewardViolation\(current.data,nextData\)/,'Version conflict is checked before reward policy');
assert.match(routes,/FOR UPDATE[\s\S]*campaignRewardViolation/,'Guard runs after locking the current row');
checks+=3;
console.log(`CAMPAIGN REWARD GUARD OK — ${checks} assertions: protected awards, immutable ledger, all Commerce grades, genuine sales/purchases, no sale replay or loan monetisation, 5000-dollar cap, restore restrictions and original-copy isolation.`);
