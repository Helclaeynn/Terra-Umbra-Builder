import { COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES } from "./compendium-verite-extrals-groups-pnj.js";
import { COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_ARTICLES } from "./compendium-verite-humans-galactic-pnj.js";

type J = Record<string, any>;
type A = J & { id:string; title?:string; dataset?:string; source?:string; tags?:string[]; pnj?:J; sections?:J[]; rebuildV2?:boolean };

const cp=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
const n=(v:unknown)=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const stats=(s:J)=>["profil statistique","statistiques"].includes(n(s?.title))||n(s?.id)==="profil statistique";
const blockKey=(b:J)=>n(b?.type==="p"?b.text:b?.type==="table"&&Array.isArray(b.rows)?b.rows.flat().join(" "):"");

function article(byId:Map<string,A>, names:string[], prefer=""):A|null {
  const want=new Set(names.map(n));
  const found=[...byId.values()].filter(a=>{
    const p=a.pnj??{};
    return [a.title,p.real_name,p.nom_reel,p.nom_realite,p.nom_verite,...(Array.isArray(p.identity_keys)?p.identity_keys:[])].map(n).some(k=>want.has(k));
  });
  if(prefer){const p=found.filter(a=>String(a.dataset??"").includes(prefer));if(p.length===1)return p[0];}
  const t=found.filter(a=>want.has(n(a.title))); if(t.length===1)return t[0];
  return found.length===1?found[0]:null;
}
function tableValue(a:A, labels:string[]):string {
  const want=new Set(labels.map(n));
  for(const s of a.sections??[])for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))
    for(const r of b.rows)if(Array.isArray(r)&&want.has(n(r[0])))return String(r[1]??"").trim();
  return "";
}
function mj(a:A):J {
  let s=(a.sections??[]).find(x=>x?.audience==="mj"&&!stats(x));
  if(!s){s={id:"dossier-mj",title:"Dossier MJ · Vérité & informations cachées",level:2,audience:"mj",blocks:[]};
    const all=[...(a.sections??[])],i=all.findIndex(stats);if(i>=0)all.splice(i,0,s);else all.push(s);a.sections=all;}
  s.blocks=Array.isArray(s.blocks)?s.blocks:[]; return s;
}
function addMj(a:A, blocks:J[]){
  const s=mj(a), have=new Set((s.blocks??[]).map(blockKey).filter(Boolean));
  for(const b of blocks){const k=blockKey(b);if(k&&!have.has(k)){s.blocks.push(cp(b));have.add(k);}}
}
function addPublic(a:A,id:string,title:string,text:string){
  if((a.sections??[]).some(s=>String(s?.id??"")===id))return;
  const s={id,title,level:2,blocks:[{type:"p",text}]},all=[...(a.sections??[])],i=all.findIndex(x=>x?.audience==="mj"||stats(x));
  if(i>=0)all.splice(i,0,s);else all.push(s);a.sections=all;
}
function setTable(a:A,label:string,value:string){
  for(const s of a.sections??[])for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))
    for(const r of b.rows)if(Array.isArray(r)&&n(r[0])===n(label))r[1]=value;
}
function dropRows(a:A,labels:string[]){
  const want=new Set(labels.map(n));
  for(const s of a.sections??[]){if(s?.audience==="mj")continue;for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))b.rows=b.rows.filter((r:any[])=>!want.has(n(r?.[0])));}
}
function mapStrings(v:any, reps:Array<[RegExp,string]>):any{
  if(typeof v==="string"){let x=v;for(const [p,r] of reps)x=x.replace(p,r);return x;}
  if(Array.isArray(v))return v.map(x=>mapStrings(x,reps));
  if(v&&typeof v==="object"){const o:J={};for(const [k,x] of Object.entries(v))o[k]=mapStrings(x,reps);return o;} return v;
}
function replace(a:A,reps:Array<[RegExp,string]>){const x=mapStrings(a,reps);for(const k of Object.keys(a))delete a[k];Object.assign(a,x);}
function moveParagraphs(a:A, match:(t:string)=>boolean){
  const moved:J[]=[];
  for(const s of a.sections??[]){if(s?.audience==="mj"||stats(s))continue;const keep:J[]=[];for(const b of s.blocks??[]){if(b?.type==="p"&&match(String(b.text??"")))moved.push(b);else keep.push(b);}s.blocks=keep;}
  if(moved.length)addMj(a,moved);
}
function removeParas(a:A,match:(t:string)=>boolean){
  for(const s of a.sections??[]){if(s?.audience==="mj")continue;s.blocks=(s.blocks??[]).filter((b:J)=>!(b?.type==="p"&&match(String(b.text??""))));}
}
function order(a:A){if(!a.pnj&&!String(a.dataset??"").includes("pnj"))return;const pub:J[]=[],priv:J[]=[],st:J[]=[];for(const s of a.sections??[]){if(stats(s))st.push(s);else if(s?.audience==="mj")priv.push(s);else pub.push(s);}a.sections=[...pub,...priv,...st];}
function secretProfile(a:A){
  if(!a.pnj&&!String(a.dataset??"").includes("pnj"))return;
  const truthIdentityLabels=new Set(["nom de la verite","nature reelle","ethnie reelle"]);
  const legacyTruthDatasets=new Set(["verite-species-pnj","verite-fantastiques-pnj","verite-extraterrestres-pnj","verite-hunters-pnj"]);
  const hideRepere=legacyTruthDatasets.has(String(a.dataset??""));
  const rows:any[][]=[];
  for(const s of a.sections??[]){if(s?.audience==="mj")continue;for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))b.rows=b.rows.filter((r:any[])=>{const label=n(r?.[0]);if(!truthIdentityLabels.has(label)&&!(hideRepere&&label==="repere"))return true;const v=String(r?.[1]??"").trim();if(v&&!/^[_?]+$/.test(v))rows.push(cp(r));return false;});}
  if(rows.length)addMj(a,[{type:"table",rows:[["Champ MJ","Valeur"],...rows]}]);
}
function sourceKeyCleanup(a:A){
  if(!["verite-extrals-groupes-pnj","verite-humains-galactiques-pnj"].includes(String(a.dataset??"")))return;
  const d=n(a.pnj?.source_designation);if(d&&Array.isArray(a.pnj?.identity_keys))a.pnj.identity_keys=a.pnj.identity_keys.filter((k:unknown)=>n(k)!==d);
  if(a.pnj)delete a.pnj.source_designation;
}
function mergeLegacy(target:A,src:A){
  for(const s of src.sections??[])if(s?.audience==="mj"&&!stats(s))addMj(target,cp(s.blocks??[]));
  const realities=(src.sections??[]).filter(s=>s?.audience!=="mj"&&!stats(s)&&n(s?.id)!=="profil"&&n(s?.title)!=="profil");
  for(const s of realities){const blocks=cp(s.blocks??[]);if(!blocks.length)continue;const id="source-reparee-"+String(src.dataset??"legacy")+"-realite";if(!(target.sections??[]).some(x=>x.id===id)){const all=[...(target.sections??[])],i=all.findIndex(x=>x?.audience==="mj"||stats(x)),neo={id,title:"Complément Réalité · source antérieure",level:2,blocks};if(i>=0)all.splice(i,0,neo);else all.push(neo);target.sections=all;}}
  target.source=[...new Set([target.source,src.source].flatMap(v=>String(v??"").split(" ; ")).map(x=>x.trim()).filter(Boolean))].join(" ; ");
  target.tags=[...new Set([...(target.tags??[]),...(src.tags??[]),"Multi-source"])];target.status="canon_enrichi";target.rebuildV2=true;
}
function absorbOld(byId:Map<string,A>){
  const olds=new Set(["verite-species-pnj","verite-fantastiques-pnj","verite-extraterrestres-pnj"]);
  for(const src of [...byId.values()].filter(a=>olds.has(String(a.dataset??"")))){
    const rn=String(src.pnj?.real_name??tableValue(src,["Nom de la Réalité","Nom / identité de Réalité"])).trim();if(!rn||/^[_?]+$/.test(rn))continue;
    const forms=rn.split(/\s*\/\s*/).map(n).filter(Boolean);
    const cand=[...byId.values()].filter(a=>a.id!==src.id&&!olds.has(String(a.dataset??""))&&forms.some(f=>[a.title,a.pnj?.real_name,a.pnj?.nom_reel,a.pnj?.nom_realite].map(n).includes(f)));
    let t:A|null=null;if(cand.length===1)t=cand[0];else {const e=cand.filter(a=>forms.includes(n(a.title)));if(e.length===1)t=e[0];}
    if(t){mergeLegacy(t,src);byId.delete(src.id);}
  }
}
function splitHooley(byId:Map<string,A>){
  const e=COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES.find((x:J)=>n(x.title)===n("Elsa Rys"));
  const h=COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_ARTICLES.find((x:J)=>n(x.title)===n("Nehemiah Hooley"));if(!e||!h)return;
  for(const a of [...byId.values()]){const keys=[a.title,a.pnj?.real_name,a.pnj?.nom_verite,...(Array.isArray(a.pnj?.identity_keys)?a.pnj.identity_keys:[])].map(n);if(keys.includes(n("Elsa Rys"))||keys.includes(n("Nehemiah Hooley")))byId.delete(a.id);}
  const el=cp(e) as A;const elPnj:J=el.pnj={...(el.pnj??{}),nom_verite:""};elPnj.identity_keys=(elPnj.identity_keys??[]).filter((k:unknown)=>n(k)!==n("Hooley’Makal")&&n(k)!==n(elPnj.source_designation));delete elPnj.source_designation;
  for(const s of el.sections??[])if(s?.audience==="mj")for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))b.rows=b.rows.filter((r:any[])=>n(r?.[0])!=="nom de la verite");
  const ne=cp(h) as A;const nePnj:J=ne.pnj={...(ne.pnj??{})};nePnj.identity_keys=(nePnj.identity_keys??[]).filter((k:unknown)=>n(k)!==n(nePnj.source_designation));delete nePnj.source_designation;
  byId.set(el.id,el);byId.set(ne.id,ne);
}
function stripExactDupes(a:A){
  const m=new Set<string>();for(const s of a.sections??[])if(s?.audience==="mj")for(const b of s.blocks??[]){const k=blockKey(b);if(k)m.add(k);}
  for(const s of a.sections??[])if(s?.audience!=="mj"&&!stats(s))s.blocks=(s.blocks??[]).filter((b:J)=>{const k=blockKey(b);return !k||!m.has(k);});
  const dossier=(a.sections??[]).find(s=>n(s?.title).includes("dossier des forces de l ordre")),bio=(a.sections??[]).find(s=>n(s?.title)==="biographie informations publiques");
  if(dossier&&bio&&n((dossier.blocks??[]).map(blockKey).join(" "))===n((bio.blocks??[]).map(blockKey).join(" ")))a.sections=(a.sections??[]).filter(s=>s!==bio);
}
function removeTrailing(a:A,vals:string[]){const bad=new Set(vals.map(n));for(const s of a.sections??[])if(s?.audience!=="mj")s.blocks=(s.blocks??[]).filter((b:J)=>!(b?.type==="p"&&bad.has(n(b.text))));}

export function applyCompendiumPnjRepairs(byId:Map<string,A>){
  const before=new Set(byId.keys());
  splitHooley(byId);
  for(const a of byId.values()){sourceKeyCleanup(a);secretProfile(a);}
  absorbOld(byId);

  // Erroneous obsolete Azazel sheet: Alexander Zazelov is the canonical Azazel.
  byId.delete("personnages-verite-chasseurs-zarey-lysenko");

  const laurie=byId.get("pnj-aseryns-terres-temples-laurie-d-sun-01")??article(byId,["Laurie D. Sun"]);
  if(laurie){laurie.pnj={...(laurie.pnj??{}),nom_verite:"Lorinae Darksun",nom_verite_source:"Lorinae Darksun",statut:"Reine d’Atlantide par intérim"};laurie.pnj.identity_keys=[...new Set((laurie.pnj.identity_keys??[]).filter((k:unknown)=>!n(k).includes("lorinae athegos")).concat(["Laurie D. Sun","Lorinae Darksun","Darksun"]))];replace(laurie,[[/Lorinae Athegos \(Darksun\)/gi,"Lorinae Darksun"],[/Lorinae Athegos/gi,"Lorinae Darksun"]]);addMj(laurie,[{type:"p",text:"Canon actuel : Lorinae Darksun règne sur l’Atlantide par nécessité. Elle soutient Veronica Silver et n’a accepté la couronne que pour préserver le royaume en attendant une souveraine plus légitime ; Veronica est l’héritière appelée à réunifier les Aseryn."}]);}
  const veronica=article(byId,["Veronica Silver","Veronica SILVER"],"crawlers");if(veronica){replace(veronica,[[/Californian Bank Tower/gi,"US Bank Tower"]]);addMj(veronica,[{type:"p",text:"Veronica Silver est la légitime grande reine Aseryn : fille de Kalira Athegos et petite-fille de Kyriak Zenos, elle est appelée à réunifier les Aseryn. Cette souveraineté s’ajoute à sa nature d’Architecte."}]);}
  const carolina=article(byId,["Carolina Nates","Katryn Ruthberg"]);if(carolina){carolina.pnj={...(carolina.pnj??{})};carolina.pnj.identity_keys=[...new Set([...(carolina.pnj.identity_keys??[]),"Carolina Nates","Katryn Ruthberg"])];addPublic(carolina,"reparation-identite-carolina-katryn","Identités publiques","Katryn Ruthberg est son identité civile et professionnelle chez Wellspring ; Carolina Nates est son nom de scène comme mannequin de Tuatha. Les deux identités sont publiques.");}
  const muya=article(byId,["Muya Mitchell"]);if(muya){muya.pnj={...(muya.pnj??{}),race:"Aseryne (lemurianne)"};replace(muya,[[/Aseryne \(Paleo-atlante\)/gi,"Aseryne (lemurianne)"]]);}
  const denise=article(byId,["Denise Zane"]);if(denise){denise.pnj={...(denise.pnj??{}),nom_verite:"Deidea Eina Zenos / Coronis"};setTable(denise,"Nom de la Vérité","Deidea Eina Zenos / Coronis");}

  const sh=[...byId.values()].filter(a=>[n("Shingen Inukawa"),n("INUKAWA Shingen")].includes(n(a.title))||[n("Shingen Inukawa"),n("INUKAWA Shingen")].includes(n(a.pnj?.real_name)));
  if(sh.length){const t=sh.find(a=>String(a.dataset??"").includes("pelages"))??sh[0];for(const s of sh)if(s.id!==t.id){mergeLegacy(t,s);byId.delete(s.id);}t.title="Shingen Inukawa";t.pnj={...(t.pnj??{}),real_name:"Shingen Inukawa",nom_verite:"Inukami"};t.pnj.identity_keys=[...new Set([...(t.pnj.identity_keys??[]),"Shingen Inukawa","INUKAWA Shingen","Inukami"])];setTable(t,"Nom de la Vérité","Inukami");}
  const tokala=article(byId,["Tokala"]);if(tokala){tokala.pnj={...(tokala.pnj??{}),race:"Khinae",statut_verite:"Nnyrss · Khinae parfait"};addMj(tokala,[{type:"p",text:"Canon actuel : Tokala est une Khinae, et non une louve-garou. Son rôle historique auprès des Pelages demeure ; après son éveil et son affrontement avec les Khinae corrompus, elle réveille la mémoire et la puissance de la Ssrynn originelle et atteint l’état de Nnyrss, le Khinae parfait."}]);}
  const connor=article(byId,["Connor Cherros","Connor SHERO","Connor Shero","Koldraal’Sheroh"]);if(connor){connor.title="Connor Shero";connor.pnj={...(connor.pnj??{}),real_name:"Connor Shero",nom_verite:"Koldraal’Sheroh"};connor.pnj.identity_keys=(connor.pnj.identity_keys??[]).filter((k:unknown)=>n(k)!==n("Connor Cherros"));connor.pnj.identity_keys=[...new Set([...(connor.pnj.identity_keys??[]),"Connor Shero","Koldraal’Sheroh"])];replace(connor,[[/Connor Cherros/gi,"Connor Shero"]]);}
  const rob=article(byId,["Roberrick Reimer","Roberrik Reimer"]);if(rob){rob.title="Roberrik Reimer";rob.pnj={...(rob.pnj??{}),real_name:"Roberrik Reimer"};replace(rob,[[/Roberrick Reimer/gi,"Roberrik Reimer"]]);}
  const kain=article(byId,["Ken Ferno","Kain Ferno","Kai’nor","Caïnor"]);if(kain){kain.title="Kain Ferno";kain.pnj={...(kain.pnj??{}),real_name:"Kain Ferno",nom_verite:"Kai’nor / Caïn"};replace(kain,[[/\bKen Ferno\b/gi,"Kain Ferno"]]);}
  const lis=article(byId,["Lisbeth Bruun","Lisbeth Brunn"]);if(lis){lis.title="Lisbeth Brunn";lis.pnj={...(lis.pnj??{}),real_name:"Lisbeth BRUNN",nom_verite:"Lisbeth BRUNN"};replace(lis,[[/Lisbeth Bruun/gi,"Lisbeth Brunn"]]);}
  const dra=article(byId,["Dan Harrington","Dragoy Skotialov","Dragoy Skotia"]);if(dra){dra.pnj={...(dra.pnj??{}),nom_verite:"Dragoy SKOTIA"};replace(dra,[[/Dragoy SKOTIALOV/gi,"Dragoy SKOTIA"],[/Dragoy Skotialov/gi,"Dragoy Skotia"]]);setTable(dra,"Nom de la Vérité","Dragoy SKOTIA");}
  const meg=article(byId,["Megda Ayshin"]);if(meg){setTable(meg,"Repère","La Lamia");if(meg.pnj)meg.pnj.statut_verite="La Lamia";}
  const amu=article(byId,["Amunthoris","Amunthosis"]);if(amu){amu.title="Amunthosis";amu.pnj={...(amu.pnj??{}),nom_verite:"Amunthosis"};replace(amu,[[/Amunthoris/gi,"Amunthosis"]]);}

  const vh=[...byId.values()].find(a=>/vhodhal/i.test(String(a.title??"")));if(vh){vh.pnj={...(vh.pnj??{})};if(/shaoggith/i.test(String(vh.pnj.nom_verite??"")))delete vh.pnj.nom_verite;if(/famine/i.test(String(vh.pnj.statut_verite??"")))delete vh.pnj.statut_verite;vh.pnj.identity_keys=(vh.pnj.identity_keys??[]).filter((k:unknown)=>!/shaoggith/i.test(String(k)));for(const s of vh.sections??[])if(s?.audience==="mj")s.blocks=(s.blocks??[]).filter((b:J)=>!/shaoggith|famine liquide|chien de sharith/i.test(String(b.text??"")));dropRows(vh,["Nom de la Vérité","Nature réelle","Repère"]);addMj(vh,[{type:"p",text:"Les données de Gajh’ Shaoggith qui avaient été recopiées par erreur sur cette fiche ont été retirées. Aucun nouveau canon n’est attribué à Vhodhal sans source."}]);}
  const fuy=article(byId,["Fuyumi Shinoda"]);if(fuy)replace(fuy,[[/Ishikwa/gi,"Ishikawa"]]);
  const jack=article(byId,["Jack Tang"]);if(jack){jack.pnj={...(jack.pnj??{}),nom_verite:"Zeel'Tan"};setTable(jack,"Nom de la Vérité","Zeel'Tan");}
  const carmen=article(byId,["Carmen Hodge","Carmen Hodges","Elexarandra"]);if(carmen){carmen.title="Carmen Hodges";carmen.pnj={...(carmen.pnj??{}),real_name:"Carmen Hodges",nom_verite:"Elexarandra"};replace(carmen,[[/Carmen Hodge\b/gi,"Carmen Hodges"],[/Elexaranda/gi,"Elexarandra"]]);}
  const ol=article(byId,["Olisha Harmon","Olishia Harmon"]);if(ol){ol.title="Olisha Harmon";ol.pnj={...(ol.pnj??{}),real_name:"Olisha Harmon"};replace(ol,[[/Olishia Harmon/gi,"Olisha Harmon"]]);}
  const kay=article(byId,["Kay Salzer","P-148","A.P-148"]);if(kay){kay.pnj={...(kay.pnj??{}),nom_verite:"A.P-148"};replace(kay,[[/\bP-148\b/g,"A.P-148"]]);setTable(kay,"Nom de la Vérité","A.P-148");}
  const shayna=article(byId,["Shayna Arc","Esdrael","Erakziel"]);if(shayna){shayna.pnj={...(shayna.pnj??{}),nom_verite:"Esdrael / Erakziel"};shayna.pnj.identity_keys=[...new Set([...(shayna.pnj.identity_keys??[]),"Esdrael","Erakziel"])];setTable(shayna,"Nom de la Vérité","Esdrael / Erakziel");}
  const az=article(byId,["Alexander Zazelov","Azazel"]);if(az){az.pnj={...(az.pnj??{}),real_name:"Alexander Zazelov",nom_verite:"Azazel"};az.pnj.identity_keys=[...new Set([...(az.pnj.identity_keys??[]),"Alexander Zazelov","Azazel"])];}
  const vin=article(byId,["Vicente Pardo","Vincente Pardo"]);if(vin){vin.title="Vincente Pardo";vin.pnj={...(vin.pnj??{}),real_name:"Vincente Pardo"};replace(vin,[[/Vicente PARDO/g,"Vincente PARDO"],[/Vicente Pardo/g,"Vincente Pardo"]]);}
  const lor=article(byId,["Lorenzo Luciano","Lorenzo Luciani"]);if(lor)replace(lor,[[/Lorenzo LUCIANI/gi,"Lorenzo LUCIANO"],[/Lorenzo Luciani/gi,"Lorenzo Luciano"]]);

  const mor=article(byId,["Morgan nic Brandubh"]),moi=article(byId,["Moira Blake","Moira Blackraven"]);if(mor&&moi&&mor.id!==moi.id){addMj(mor,[{type:"p",text:"Moira Blake / Moira Blackraven est une autre couverture humaine de Morrighan. Les deux identités publiques restent distinctes."}]);addMj(moi,[{type:"p",text:"Morgan nic Brandubh est une autre couverture humaine de Morrighan. Les deux identités publiques restent distinctes."}]);}

  const drag=article(byId,["Dragomir Mikhaïlovich","Graphiel"]);if(drag){replace(drag,[[/Dragomir Mikailovich/gi,"Dragomir Mikhaïlovich"]]);for(const s of drag.sections??[])for(const b of s.blocks??[])if(b?.type==="p"&&typeof b.text==="string")b.text=b.text.replace(/Commenté \[BH2\]:[\s\S]*?(?=Commenté \[BH3\]:|$)/gi,"").replace(/Commenté \[BH3\]:[^\n]*/gi,"").trim();}
  const jam=article(byId,["Jamal Jace Jayson"]);if(jam)for(const s of jam.sections??[])if(s?.audience!=="mj")for(const b of s.blocks??[])if(b?.type==="p"&&/est en concurrence avec lui,\s*$/i.test(String(b.text??"")))b.text=String(b.text).replace(/,\s*$/,".");
  const tsh=article(byId,["Tshaddy el’Sharif","Tshaddy el'Sharif"]);if(tsh){moveParagraphs(tsh,t=>/saabiq el.?sharif/i.test(t));addPublic(tsh,"reparation-realite-tshaddy","Informations Réalité","Tshaddy el’Sharif est l’identité sous laquelle il est aujourd’hui connu ; son histoire antérieure relève du dossier MJ.");}
  for(const [name,re] of [["Milda Tarasknovna",/section assassinat.*bratva/i],["Katerinochkina Angelika Ruslanovna",/assassin.*sokolnitcheska|loyal.*svetlana/i],["Murton Blade",/transplantation|greffe|goro.*carotide|27 février 2035/i]] as Array<[string,RegExp]>){const a=article(byId,[name]);if(a)moveParagraphs(a,t=>re.test(t));}

  const gt:Record<string,string[]>={
    "Dina Page":["Vice-Président"],"Finn Sherman":["Procureur général"],"Katherine Warren":["Directeur de la sécurité"],"Keysha Richards":["Secrétaire à l'éducation"],"Robert Hamilton":["Maire de San Diejuana"],"Kelford Bentley":["Générale du CG. Net Corps"]
  };for(const [name,v] of Object.entries(gt)){const a=article(byId,[name]);if(a)removeTrailing(a,v);}
  const hom=article(byId,["Homer Duke"]);if(hom){hom.pnj={...(hom.pnj??{}),statut:"Président du Sénat"};setTable(hom,"Fonction / désignation","Président du Sénat");}
  const bro=article(byId,["Brooker Adams"]);if(bro){if(bro.pnj&&n(bro.pnj.statut).includes("qualites de sa collegue"))delete bro.pnj.statut;dropRows(bro,["Fonction / désignation"]);}
  const far=article(byId,["Farah El Arshad","Farah el Arshad"]);if(far){far.pnj={...(far.pnj??{}),statut:"Présidente de la Cour suprême de Californie"};setTable(far,"Fonction / désignation","Présidente de la Cour suprême de Californie");}
  const ji=article(byId,["Ji-mi Ryong"]);if(ji&&Array.isArray(ji.archiveReferences))ji.archiveReferences=ji.archiveReferences.filter((x:unknown)=>n(x)!==n("pnj-031-mi-yeon-ryong"));
  for(const name of ["Emerald Monroe","Connor K. McDougals"]){const a=article(byId,[name]);if(a)for(const s of a.sections??[])if(/relations/i.test(String(s?.id??s?.title??"")))for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))b.rows=b.rows.filter((r:any[])=>!r.some(c=>/^\?+$/.test(String(c??"").trim())));}
  const finn=article(byId,["Finn Sherman"]);if(finn)replace(finn,[[/^Née à San Francisco/gm,"Né à San Francisco"],[/c['’]est privilégié fils d['’]avocat/gi,"ce fils d’avocat privilégié"]]);

  const at:Record<string,string[]>={
    "Harper Long":["Directeur du personnel"],"Darren Wills":["Directrice « renseignement »"],"Christopher Wegener":["Directrice Adjointe"],"Tasunke":["Directrice"],"Hilda Magnuson":["Directrice Adjointe"],"Riguel Black":["Directeur"],"Gavin Clay":["Directrice Adjointe"],"Nehemiah Sellers":["Directrice Adjointe"]
  };for(const [name,v] of Object.entries(at)){const a=article(byId,[name]);if(a)removeTrailing(a,v);}
  const qu=article(byId,["Quinn Tucker"]);if(qu)moveParagraphs(qu,t=>/zarana|corps arkhangel|leader suprême.*corée/i.test(t));
  const we=article(byId,["Christopher Wegener"]);if(we)moveParagraphs(we,t=>/traversa la frontière mexicaine|supposés alliés.*narco/i.test(t));
  const hi=article(byId,["Shigenobu Higuchi"]);if(hi){const b=(hi.sections??[]).find(s=>s.id==="biographie");if(b?.blocks?.length){addMj(hi,cp(b.blocks));b.blocks=[{type:"p",text:"Shigenobu Higuchi est un cadre opérationnel de la STAB spécialisé dans la lutte contre l’usage criminel des augmentations. Son passé antérieur n’est pas publiquement détaillé."}];}}
  const lu=article(byId,["Luna Eckelberg"]);if(lu)moveParagraphs(lu,t=>/faux.?papiers|suspectée d.?espionnage|makana.*libérer/i.test(t));
  const sel=article(byId,["Nehemiah Sellers"]);if(sel)for(const s of sel.sections??[])if(s?.audience!=="mj")for(const b of s.blocks??[])if(b?.type==="p"&&typeof b.text==="string")b.text=b.text.replace(/, mais officieusement simple assassin à la solde des mafias/gi,"");

  for(const name of ["Shuren SHI","Zeeka STEELE"]){const a=article(byId,[name]);if(!a)continue;a.pnj={...(a.pnj??{})};a.pnj.identity_keys=(a.pnj.identity_keys??[]).filter((k:unknown)=>n(k)!==n("Lady opium"));for(const s of a.sections??[])for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))b.rows=b.rows.filter((r:any[])=>!(n(r?.[0])==="alias designation"&&n(r?.[1])===n("Lady opium")));}
  const shu=article(byId,["Shuren SHI"]);if(shu)removeParas(shu,t=>/quand elle fit son reportage dessus/i.test(t));
  const zee=article(byId,["Zeeka STEELE"]);if(zee)for(const s of zee.sections??[])if(s?.audience==="mj")s.blocks=(s.blocks??[]).filter((b:J)=>!/comme elle assiste a enormement de\s*$/i.test(n(b.text)));
  const ver=article(byId,["Veronica SILVER","Veronica Silver"]);if(ver)replace(ver,[[/\bdétective est clairement la personne/gi,"Cette détective est clairement la personne"],[/\bcompliquées\. Elle aurait/gi,"Elle aurait"]]);

  const fra=article(byId,["Franklin Bentley"]);if(fra)setTable(fra,"Nom","Franklin BENTLEY");
  const rom=article(byId,["Romina de la Cavalleria"]);if(rom){if(rom.pnj&&n(rom.pnj.statut).includes("terrorisme coreen"))delete rom.pnj.statut;dropRows(rom,["Fonction / désignation"]);}
  const fio=article(byId,["Fiona Boyer"]);if(fio)removeTrailing(fio,["3. REPARTITION (CARTE DE LA)"]);
  const jord=article(byId,["Jordel Sharzmann"]);if(jord){if(jord.pnj&&n(jord.pnj.statut).includes("wakagashira"))delete jord.pnj.statut;dropRows(jord,["Fonction / désignation","Statut"]);}
  const tos=article(byId,["Toshiyuki Yodokawa","Yoshiyuki Yodokawa"]);if(tos)replace(tos,[[/Yoshiyuki YODOKAWA/gi,"Toshiyuki YODOKAWA"],[/Shateigashura/gi,"Shateigashira"]]);

  const xi=article(byId,["Xieren Song"]);if(xi){xi.pnj={...(xi.pnj??{}),statut:"Grande figure shientaoïste californienne"};setTable(xi,"Statut","Grande figure shientaoïste californienne");setTable(xi,"Fonction / désignation","Grande figure shientaoïste californienne");}
  for(const [name,re] of [["Durgawati Ghandi",/subterfuge|aura/i],["Meina Korgovski",/douzaine|aucune enquête/i],["Rafaella",/viol de paladia/i]] as Array<[string,RegExp]>){const a=article(byId,[name]);if(a)moveParagraphs(a,t=>re.test(t));}

  for(const [name,re] of [["Munke Ghaimur",/assassin.*samoel gaster|fit assassiner.*gaster/i],["Elianna Knowles",/assassin|corruption/i],["Aghna Ui Siomoin",/combat.*mort|clandestin/i],["Athinea Dimitrios",/intrigue|prise de pouvoir/i],["Tiana Hawkins",/chantage/i],["Quahna Alvarez",/nettoy.*dossier|tortoise.*dossier/i],["Shuji Kashiwa",/exécution|exécuter/i]] as Array<[string,RegExp]>){const a=article(byId,[name]);if(a)moveParagraphs(a,t=>re.test(t));}
  const lev=article(byId,["Lenavah Uriel","Levanah Uriel"]);if(lev){lev.title="Levanah Uriel";replace(lev,[[/Lenavah URIEL/gi,"Levanah URIEL"],[/Lenavah Uriel/gi,"Levanah Uriel"]]);}
  const sal=article(byId,["Saleem el Khayat"]);if(sal)replace(sal,[[/Présidente/g,"Président"]]);
  const wei=article(byId,["Wei Shi"]);if(wei)replace(wei,[[/Vice-Président\b/g,"Vice-Présidente"]]);

  for(const [name,rep] of [["Yun","Le patriarche des profondeurs"],["Yura","Le patriarche des profondeurs"],["Izchara","La prêtresse du fer"],["Gawel Prowacjesky","Le patriarche des profondeurs"],["Kevin Eckker","La maitresse des industries"],["Cassandra Helen","La noble chasse"],["Selm Scytheri","La noble chasse"]]){const a=article(byId,[name]);if(!a)continue;if(a.pnj&&n(a.pnj.statut_verite)===n(rep))delete a.pnj.statut_verite;for(const s of a.sections??[])if(s?.audience==="mj")for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))b.rows=b.rows.filter((r:any[])=>!(n(r?.[0])==="repere"&&n(r?.[1])===n(rep)));}
  const king=article(byId,["King Frazier","Kiizaga"]);if(king){king.pnj={...(king.pnj??{}),race:"Gobelin"};setTable(king,"Nature réelle","Gobelin");}

  const soo=article(byId,["Soo-Kyung Yu","So’Ouk-32","So'Ouk-32"]);if(soo){soo.pnj={...(soo.pnj??{}),real_name:"Soo-Kyung Yu",nom_verite:"So’Ouk-32"};setTable(soo,"Nom de la Vérité","So’Ouk-32");}
  const kan=article(byId,["Kang Sung-Hyung","Sunghyon Kang","KANG Sunghyon"]);if(kan){kan.title="Kang Sung-Hyung";kan.pnj={...(kan.pnj??{}),real_name:"Kang Sung-Hyung",nom_verite:"Saoden II-B2"};}
  const iva=article(byId,["Ivana Yevgenievna","Ivanna Yevgenievna"]);if(iva){iva.title="Ivana Yevgenievna";replace(iva,[[/Ivanna YEVGENIEVNA/gi,"Ivana YEVGENIEVNA"],[/Ivanna Yevgenievna/gi,"Ivana Yevgenievna"]]);}
  for(const name of ["Shimamura Nobuhito","Leona Elliott","T.N.","T.N"]){const a=article(byId,[name]);if(a)setTable(a,"Repère","");}
  const kai=article(byId,["Kaine Reid","Daft Vador"]);if(kai){for(const s of kai.sections??[])if(s?.audience!=="mj")for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))b.rows=b.rows.filter((r:any[])=>!/Kaine Reid/i.test(String(r?.[1]??"")));addMj(kai,[{type:"p",text:"Identité protégée : Daft Vador est Kaine Reid. Cette correspondance est une information MJ."}]);}

  const points:Record<string,string>={
    "Kristina Moon":"Kristina Moon, dite « Frogchrist », est une Venomer et ancienne pharmacienne de Sunways. Elle est connue comme une assassine utilisant poisons et acides ; ses capacités magiques et la magie familiale de l’Empire vert restent MJ.",
    "Murck Date":"Murck Date est un Crawler mercenaire élevé par Mickael Date. Son histoire familiale et sa loyauté envers celui qui l’a élevé appartiennent à sa biographie de Réalité ; son Mageius et ses techniques de projection spectrale restent MJ.",
    "Mukna":"Mukna est un biker et gundriver comanche qui sillonne la Grande Réserve comme transporteur. Son rôle de sentinelle de Loge et sa magie du sang restent MJ.",
    "Lana Alvarez":"Lana Alvarez est une jeune croupière de Tala, connue aussi pour sa carrure de combattante. Sa magie de malédiction et la technique du « Tueur de Mageius » restent MJ.",
    "Gerald Ashorn":"Gerald Ashorn est un grand général, vétéran et héros des Marines américains puis californiens. Son identité thulkar et ses liens avec les puissances de la Vérité restent MJ.",
    "Lisa Eredhes":"Née à Cancun en 2000, Lisa Eredhes a participé au PCRC avant de fonder Space Union en 2026 avec des scientifiques et d’anciens militaires. Elle a ensuite poussé le développement lunaire et les missions spatiales. Son rang au sein de l’AIDH reste MJ.",
    "James Hopper":"James Hopper est un agent prometteur du CBII, enquêteur proche de Cole Gallagher et habitué à travailler avec les détectives du LAUS. Sa nature rocréenne, son origine clonale et son rôle dans les réseaux Feeshri restent MJ.",
    "Racheyl Rosemann":"Racheyl Rosemann est l’assistante de direction de Rached Kelley chez Raven, remarquée pour son efficacité et sa mémoire exceptionnelle. Sa nature artificielle d’Ashmyn K’Na reste MJ."
  };for(const [name,text] of Object.entries(points)){const a=article(byId,[name]);if(a)addPublic(a,"reparation-biographie-realite","Biographie & informations publiques",text);}

  const cla=article(byId,["Clara Arellano"]);if(cla)addPublic(cla,"reparation-relation-svetlana","Relation publique · Svetlana Konstantinovna","Clara Arellano connaît publiquement Svetlana Konstantinovna en tant que restauratrice ; cette relation ne révèle pas l’identité criminelle d’Arkhangel.");
  const dina=article(byId,["Dina Page"]);if(dina)addPublic(dina,"reparation-annexion-basse-californie","Réalité · recomposition territoriale","Sous Dina Page, la Californie a annexé le territoire du Sinaloa correspondant à la Basse-Californie dans la recomposition territoriale du sud.");

  for(const a of byId.values()){stripExactDupes(a);order(a);}
  for(const a of byId.values()){if(!a.pnj&&!String(a.dataset??"").includes("pnj"))continue;for(const s of a.sections??[]){if(s?.audience==="mj")continue;for(const b of s.blocks??[])if(b?.type==="table"&&Array.isArray(b.rows))for(const r of b.rows){const l=n(r?.[0]);if(["nom de la verite","nature reelle","ethnie reelle"].includes(l))throw new Error(`Réparation PNJ · fuite publique: ${a.id} / ${String(r?.[0]??"")}`);}}}

  const after=new Set(byId.keys());
  return {removedIds:[...before].filter(id=>!after.has(id)),restoredIds:[...after].filter(id=>!before.has(id))};
}
