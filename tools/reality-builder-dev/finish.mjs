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
writeFileSync(manifest,JSON.stringify([...files].sort(),null,2)+'\n');
console.log('DEV FINISH OK — inventory scope, gross-price eligibility and asset-value maintenance');
