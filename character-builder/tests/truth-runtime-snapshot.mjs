import { chromium } from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1500,height:1100}});
const page=await context.newPage();

try {
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(
    ()=>window.__TUC_APP_READY__===true&&window.__TUC_LATE_STATE_READY__===true&&window.TUCBuilderSeptFixes?.truthLoreMetaProblems!==undefined,
    null,
    {timeout:30000}
  );

  const snapshot=await page.evaluate(()=>{
    const clone=value=>JSON.parse(JSON.stringify(value));
    const saved=clone(state.truth);

    const selectedFreeTraits=()=>{
      const out=[...(truthNature()?.freeTraits||[])];
      if(typeof vgSelectedFreeTraits==='function')out.push(...vgSelectedFreeTraits());
      if(typeof daSelectedFreeTraits==='function')out.push(...daSelectedFreeTraits());
      const seen=new Set();
      return out.filter(item=>{
        const key=`${item.name||''}|${item.source||''}|${item.effect||''}`;
        if(seen.has(key))return false;
        seen.add(key);return true;
      }).map(clone);
    };

    const refresh=()=>{
      if(typeof t16RefreshDependentChoices==='function')t16RefreshDependentChoices();
    };

    const structures={};
    for(const nature of ruleset.truth.natures){
      const variants=[];
      const seen=new Set();

      const explore=(assignments,depth=0)=>{
        if(depth>12)return;
        state.truth.nature=nature.id;
        state.truth.consciousness='initie';
        state.truth.choices={...assignments};
        state.truth.truthTalents=[];
        refresh();

        const current=truthNature();
        const choices=clone(current?.choices||[]);
        const freeTraits=selectedFreeTraits();
        const signature=JSON.stringify({
          choices:choices.map(ch=>({
            key:ch.key,label:ch.label,optional:!!ch.optional,
            options:(ch.options||[]).map(o=>({id:o.id,name:o.name,description:o.description||''}))
          })),
          freeTraits
        });

        if(!seen.has(signature)){
          seen.add(signature);
          variants.push({
            exampleChoices:clone(state.truth.choices||{}),
            choices,
            freeTraits
          });
        } else {
          return;
        }

        const pending=(current?.choices||[]).find(ch=>
          !Object.prototype.hasOwnProperty.call(assignments,ch.key)
        );
        if(!pending)return;

        const values=(pending.options||[]).map(o=>o.id);
        if(pending.optional)values.unshift('');
        if(!values.length)return;

        for(const value of values){
          explore({...assignments,[pending.key]:value},depth+1);
        }
      };

      explore({});
      structures[nature.id]={
        id:nature.id,
        name:nature.name,
        description:nature.description||'',
        variants
      };
    }

    const catalogs={};
    for(const nature of ruleset.truth.natures){
      state.truth.nature=nature.id;
      state.truth.consciousness='initie';
      state.truth.choices={};
      state.truth.truthTalents=[];
      refresh();
      catalogs[nature.id]=(truthCatalog[nature.id]||[]).map(t=>({
        ...clone(t),
        runtimeLore:typeof t28TruthLore==='function'?String(t28TruthLore(t)||''):''
      }));
    }

    state.truth=clone(saved);
    refresh();

    return {
      source:'V1 final runtime',
      ptvInitial:ruleset.truth.ptvInitial,
      consciousness:clone(ruleset.truth.consciousness),
      structures,
      catalogs
    };
  });

  const summary={
    natures:Object.keys(snapshot.structures),
    structureVariants:Object.fromEntries(Object.entries(snapshot.structures).map(([id,n])=>[id,n.variants.length])),
    catalogCounts:Object.fromEntries(Object.entries(snapshot.catalogs).map(([id,rows])=>[id,rows.length])),
    consciousness:snapshot.consciousness,
    ptvInitial:snapshot.ptvInitial
  };

  console.log('TRUTH_RUNTIME_AUDIT_SUMMARY '+JSON.stringify(summary));
  console.log('TRUTH_RUNTIME_SNAPSHOT_BEGIN'+JSON.stringify(snapshot)+'TRUTH_RUNTIME_SNAPSHOT_END');
} finally {
  await context.close();
  await browser.close();
}
