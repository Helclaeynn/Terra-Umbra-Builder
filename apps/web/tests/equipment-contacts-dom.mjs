import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';

const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({
  stdin:{resolveDir:root,loader:'ts',contents:`
    import {createApp,h,ref} from 'vue';
    import EquipmentStep from './src/components/builder/EquipmentStep.vue';
    import BuilderWikiLink from './src/components/builder/BuilderWikiLink.vue';
    import * as reality from './src/lib/reality';
    window.reality=reality;
    window.start=(component,props)=>{
      const state=ref(props.modelValue);
      const app=createApp({render:()=>h(component==='equipment'?EquipmentStep:BuilderWikiLink,{
        ...props,modelValue:state.value,'onUpdate:modelValue':value=>state.value=value
      })});
      app.mount('#app');window.stop=()=>app.unmount();window.state=()=>state.value;
    };`},
  bundle:true,write:false,format:'iife',platform:'browser',
  define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},
  plugins:[{name:'vue',setup(builder){builder.onLoad({filter:/\.vue$/},async({path:filename})=>{
    const {descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});assert.deepEqual(errors,[]);
    return {contents:compileScript(descriptor,{id:'equipment-contacts-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};
  });}}]
});
const errors=[],console=new VirtualConsole();
console.on('jsdomError',error=>errors.push(error.message));console.on('error',error=>errors.push(String(error)));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only',virtualConsole:console});
const w=dom.window,d=w.document;
w.Headers=Headers;
w.fetch=async()=>({ok:true,json:async()=>({items:[],article:{title:'Contact test',sections:[{blocks:[{type:'p',text:'Portrait du contact.'}]}]}})});
w.eval(bundle.outputFiles[0].text);
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
const item=(name,price,extra={})=>({
  id:name,name,kind:'equipment',category:'Services',sourceCategory:'Services',price,priceMin:price,priceMax:price,priceLabel:price+' $',
  generation:null,charge:0,stress:0,slots:0,effect:'',lore:'',data:{},vehicle:false,neuro:false,recurring:'durable_purchase',monthlyCost:0,families:[],...extra
});

// Use the real source entries; access families deliberately include the false
// audio/optical inference that previously demanded the unrelated support.
const source=JSON.parse(gunzipSync(Buffer.from(await readFile(new URL('../../../character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64',import.meta.url),'utf8'),'base64')));
const entries=[];
function walk(value){if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object'){if(value.name)entries.push(value);Object.values(value).forEach(walk);}}
walk(source);
for(const entry of entries.filter(row=>/Audiovox|SynthéDerm/.test(row.name))){
  const candidate=item(entry.name,entry.price,{...entry,kind:'augmentation',data:entry,families:[entry.name==='Audiovox'?'audio':'optical']});
  assert.equal(w.reality.augmentationSupportAlternatives(candidate).length,0,entry.id);
  assert.equal(w.reality.augmentationSupportLabel(candidate),'',entry.id);
  assert.equal(w.reality.augmentationSupportSatisfied({equipment:[],augmentations:[candidate]},{augmentations:[]},candidate),true,entry.id);
}
assert.equal(entries.filter(row=>/Audiovox|SynthéDerm/.test(row.name)).length,3);
assert.equal(w.reality.augmentationSupportSatisfied({equipment:[],augmentations:[]},{augmentations:[]},item('Zoom optique',100,{kind:'augmentation',families:['optical']})),false,'Actual optical modules still require their support');

const equipment=[item('Z abordable',100),item('A cher',900),item('Milieu',400)];
const augmentations=equipment.map(row=>({...row,kind:'augmentation',generation:1}));
const recurring=[item('Bull Basic',150,{recurring:'monthly'}),item('Bull Executive',1500,{recurring:'monthly'}),item('Bull Premium',750,{recurring:'monthly'}),item('Annuel',2400,{recurring:'annual'})];
const rules={
  economy:{advancedPurchaseThreshold:20000,unusedEnvelopeRefundRate:.5,styleAugAccess:{test:{gen1:['all'],gen2:['all']}},lifestyle:{order:['Survie','Modeste','Standard','Confortable','Aisé','Luxe'],monthlyReference:{Standard:650},lore:{}}},
  equipment,augmentations,recurring
};
const state={augmentations:[],equipment:[],fixedChargeItems:[],mjAdvancedOverride:false,mjAccessOverride:false,sphereSupportType:'',sphereSupportItemId:''};
const silver=item('CareForce Silver',1200,{recurring:'annual'});
const benefitRules={...rules,recurring:[...recurring,silver]};
const benefitState=structuredClone(state);
w.reality.syncRealityTalentBenefits(benefitRules,benefitState,['assurance_silver']);
w.reality.syncRealityTalentBenefits(benefitRules,benefitState,['assurance_silver']);
assert.equal(benefitState.fixedChargeItems.length,1);
assert.equal(benefitState.fixedChargeItems[0].monthly,0);
w.reality.syncRealityTalentBenefits(benefitRules,benefitState,[]);
assert.equal(benefitState.fixedChargeItems.length,0,'Removing the talent removes its automatic grant');
benefitState.fixedChargeItems.push({uid:'paid-policy',name:silver.name,sourceItemId:silver.id,monthly:100});
w.reality.syncRealityTalentBenefits(benefitRules,benefitState,['assurance_silver']);
assert.equal(benefitState.fixedChargeItems.length,1,'An existing policy is reused');
assert.equal(benefitState.fixedChargeItems[0].monthly,0);
w.reality.syncRealityTalentBenefits(benefitRules,benefitState,[]);
assert.equal(benefitState.fixedChargeItems[0].monthly,100,'Previously paid coverage returns when the talent is removed');
w.start('equipment',{modelValue:state,rules,style:{id:'test',name:'Test',lifestyle:'Standard',account:10000,augmentationEnvelope:10000,gen2SlotsBase:1,vehicleCapital:0},edge:{},talentIds:[],disadvantages:[],neurodiveRaw:0,sphereId:'',integrity:10,augmentStressMax:10,valid:true});
await tick();
const names=selector=>Array.from(d.querySelectorAll(selector),node=>node.textContent.replace('↗','').trim());
const recurringNames=()=>names('.recurring-card .catalog-head .builder-wiki-link');
assert.deepEqual(recurringNames(),['Bull Basic','Annuel','Bull Premium','Bull Executive'],'Annual prices use their monthly equivalent');
const set=(node,value)=>{node.value=value;node.dispatchEvent(new w.Event('change',{bubbles:true}));};
set(d.querySelector('.catalog-sort select'),'price-desc');await tick();
assert.deepEqual(recurringNames(),['Bull Executive','Bull Premium','Annuel','Bull Basic']);
set(d.querySelector('.catalog-sort select'),'name');await tick();
assert.deepEqual(recurringNames(),['Annuel','Bull Basic','Bull Executive','Bull Premium']);
for(const id of ['augmentation-catalog','equipment-catalog']){
  const catalog=id==='augmentation-catalog'?d.getElementById(id):Array.from(d.querySelectorAll('.catalog-disclosure')).find(node=>node.querySelector('summary')?.textContent.includes('Choisir équipement'));assert.ok(catalog,id);
  set(catalog.querySelector('select'),'Services');await tick();
  const cards=()=>Array.from(catalog.querySelectorAll('.catalog-card .catalog-head .builder-wiki-link'),node=>node.textContent.replace('↗','').trim());
  assert.deepEqual(cards(),['Z abordable','Milieu','A cher'],id+' starts by ascending price');
  const sort=Array.from(catalog.querySelectorAll('.catalog-tools label')).find(label=>label.textContent.includes('Trier')).querySelector('select');
  set(sort,'name');await tick();assert.deepEqual(cards(),['A cher','Milieu','Z abordable']);
}
w.stop();await tick();

const mission=item('New Partisan test',null,{priceLabel:'Mission',data:{priceMode:'reference',price:null}});
assert.equal(w.reality.realityPriceSpec(mission).defaultCost,null,'A Mission price never becomes an implicit zero');
assert.equal(w.reality.realityPriceSpec(mission).configurable,true);
assert.equal(w.reality.canAffordRealityPurchase(rules,state,{account:10000,augmentationEnvelope:0,vehicleCapital:0,gen2SlotsBase:0},{},{...mission,price:0},true).ok,false);
w.start('equipment',{modelValue:state,rules:{...rules,equipment:[mission],augmentations:[],recurring:[]},style:{id:'test',name:'Test',lifestyle:'Standard',account:10000,augmentationEnvelope:0,gen2SlotsBase:1,vehicleCapital:0},edge:{},talentIds:[],disadvantages:[],neurodiveRaw:0,sphereId:'',integrity:10,augmentStressMax:10,valid:true});
await tick();
const missionCatalog=Array.from(d.querySelectorAll('.catalog-disclosure')).find(node=>node.querySelector('summary')?.textContent.includes('Choisir équipement'));
set(missionCatalog.querySelector('select'),'Services');await tick();
const missionCard=missionCatalog.querySelector('.catalog-card'),priceInput=missionCard.querySelector('.price-config input');
assert.match(missionCard.textContent,/aucun prix public/);
assert.match(missionCard.textContent,/Prix convenu avec le MJ/);
assert.equal(priceInput.value,'');assert.equal(missionCard.querySelector('.primary').disabled,true);
const enterPrice=value=>{priceInput.value=value;priceInput.dispatchEvent(new w.Event('input',{bubbles:true}));};
enterPrice('0');await tick();assert.equal(missionCard.querySelector('.primary').disabled,true);
enterPrice('700');await tick();assert.equal(missionCard.querySelector('.primary').disabled,true,'A specified price alone does not confirm Mission acquisition');
assert.match(missionCard.textContent,/Accord MJ requis/);
missionCatalog.querySelector('.permission-switch input').click();await tick();
assert.equal(missionCard.querySelector('.primary').disabled,false);
missionCard.querySelector('.primary').click();await tick();
assert.equal(w.state().equipment.at(-1).selectedPrice,700,'Only the expressly entered price is recorded');
w.stop();await tick();

// Preview must live outside a scrolling list and stay inside the viewport.
w.start('wiki',{label:'Contact test',articleId:'contact-test',compact:true});
await tick();
const ref=d.querySelector('.builder-wiki-ref');
const list=d.createElement('div');list.style.overflowY='auto';ref.parentNode.insertBefore(list,ref);list.append(ref);
list.getBoundingClientRect=()=>({left:10,right:700,top:100,bottom:600,width:690,height:500});
let anchorTop=480;
ref.getBoundingClientRect=()=>({left:50,right:200,top:anchorTop,bottom:anchorTop+20,width:150,height:20});
ref.dispatchEvent(new w.MouseEvent('mouseenter'));await tick();await tick();
const tooltip=d.querySelector('[role="tooltip"]');assert.ok(tooltip);assert.equal(tooltip.parentNode,d.body);
tooltip.getBoundingClientRect=()=>({width:320,height:240});
list.dispatchEvent(new w.Event('scroll'));await tick();
assert.equal(tooltip.style.top,'231px');assert.equal(tooltip.style.visibility,'visible');
anchorTop=180;list.dispatchEvent(new w.Event('scroll'));await tick();
assert.equal(tooltip.style.top,'209px','Tooltip follows the contact while its container scrolls');
anchorTop=60;list.dispatchEvent(new w.Event('scroll'));await tick();
assert.equal(tooltip.style.visibility,'hidden','A contact scrolled outside the list leaves no detached tooltip');
ref.dispatchEvent(new w.MouseEvent('mouseleave'));await tick();assert.equal(d.querySelector('[role="tooltip"]'),null);
w.stop();dom.window.close();assert.deepEqual(errors,[]);
globalThis.console.log('EQUIPMENT / CONTACTS OK — autonomous implants; price/name sorting; Mission acquisition requires a positive agreed price and GM confirmation; preview follows scroll outside clipping container.');
