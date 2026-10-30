import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const manifest='tools/reality-builder-dev/generated-files.json';
const files=new Set(JSON.parse(readFileSync(manifest,'utf8')));
function sub(path,from,to,count=1){const text=readFileSync(path,'utf8');assert.equal(text.split(from).length-1,count,`${path}: expected exact source to update: ${from}`);writeFileSync(path,text.split(from).join(to));files.add(path);}
const page='apps/web/src/pages/CharacterBuilderPage.vue';
sub(page,'Number.isFinite(Number(purchase.selectedPrice))?Number(purchase.selectedPrice):null','Number.isFinite(Number(purchase.cataloguePrice??purchase.selectedPrice))?Number(purchase.cataloguePrice??purchase.selectedPrice):null',2);
const reality='apps/web/src/lib/reality.ts';
sub(reality,'    return sum+purchasePrice(p,item??null);','    return sum+Math.max(0,Number(p.cataloguePrice??p.campaignCatalogPrice??purchasePrice(p,item??null))||0);');
const equipment='apps/web/src/components/builder/EquipmentStep.vue';
sub(equipment,'  return canAffordRealityPurchase(props.rules,state.value,props.style,props.edge,pricedItem(item));',`  if(item.kind==='augmentation'){
    const access=augmentationAccess(props.rules,props.style,{...item,price:priceValue(item)??item.price},props.edge,state.value.mjAccessOverride);
    if(!access.ok)return access;
  }
  return canAffordRealityPurchase(props.rules,state.value,props.style,props.edge,pricedItem(item));`);
// Test selectors must target the purchase action, not the adjacent wiki-info button.
sub('apps/web/tests/reality-talents-integration.mjs','/plafond/','/plafond/i');
sub('apps/web/tests/reality-talents-integration.mjs',"buy.querySelector('.trade-preview button').click();","buy.querySelector('.trade-preview button.primary').click();");
sub(reality,'export function syncRealityTalentBenefits(pkg:RealityRulesPackage,state:RealityState,talentIds:string[]){','export function syncRealityTalentBenefits(pkg:RealityRulesPackage,state:RealityState,talentIds:string[],creationTalentIds:readonly string[]=talentIds){');
sub(reality,'const {talentGrant,grantCreated,grantOriginalMonthly,...original}=charge;','const {talentGrant,grantCreated,grantOriginalMonthly,grantAcquiredInCampaign,...original}=charge;');
sub(reality,'    existing.monthly=0;','    existing.monthly=0;\n    existing.grantAcquiredInCampaign=!creationTalentIds.includes(talentId);');
sub(reality,'sourceItemId:item.id,talentGrant:talentId,grantCreated:true','sourceItemId:item.id,talentGrant:talentId,grantCreated:true,grantAcquiredInCampaign:!creationTalentIds.includes(talentId)');
sub(page,'syncRealityTalentBenefits(realityRules.value,realityState.value,ownedRealityTalentIds());','syncRealityTalentBenefits(realityRules.value,realityState.value,ownedRealityTalentIds(),selectedRealityTalentIds());');
sub('apps/web/src/lib/reality-benefits.ts',"for(const id of ['avantages_salaries','hebergement_religieux'])", "for(const id of ['avantages_salaries','hebergement_religieux','assurance_silver'])");
sub(equipment,'<span>{{ realityPriceSpec(selectedVariant(group)).label }}</span>',`<span>{{ realityPriceSpec(selectedVariant(group)).label }}</span><span v-if="priceValue(selectedVariant(group))!==null&&acquisitionCost(priceValue(selectedVariant(group))??0,selectedVariant(group),talentIds,useSupplier&&sphereId==='corporatiste')!==(priceValue(selectedVariant(group))??0)">À payer après Talents : {{ money(acquisitionCost(priceValue(selectedVariant(group))??0,selectedVariant(group),talentIds,useSupplier&&sphereId==='corporatiste')) }}</span>`);
sub('apps/web/tests/reality-talents-integration.mjs',"console.log('REALITY BENEFITS MODEL OK",`const silver=item('CareForce Silver',1200,{recurring:'annual',category:'Services'}),silverPkg={...pkg,recurring:[silver]},silverState=initial();
silverState.fixedChargeItems=[{uid:'paid-policy',name:silver.name,sourceItemId:silver.id,monthly:100}];
r.syncRealityTalentBenefits(silverPkg,silverState,['assurance_silver'],[]);
assert.equal(silverState.fixedChargeItems[0].monthly,0);
assert.equal(silverState.fixedChargeItems[0].grantAcquiredInCampaign,true);
b.projectBenefits(silverState,[],'crawler',false);
assert.equal(silverState.fixedChargeItems[0].monthly,100,'Campaign Silver coverage does not rewrite creation charges');
console.log('REALITY BENEFITS MODEL OK`);
writeFileSync(manifest,JSON.stringify([...files].sort(),null,2)+'\n');
console.log('DEV FINISH OK — inventory scope, gross-price eligibility and asset-value maintenance');
