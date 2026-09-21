import P0 from "./compendium-verite-vampire-courts-pnj-payload-0.js";
import P1 from "./compendium-verite-vampire-courts-pnj-payload-1.js";
import P2 from "./compendium-verite-vampire-courts-pnj-payload-2.js";
import P3 from "./compendium-verite-vampire-courts-pnj-payload-3.js";
export const COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_ARTICLES = [...P0, ...P1, ...P2, ...P3];
const SUBGROUP_ORDER: Record<string, number> = {"Krovni Rytsari":10,"Alghul Almalakiu":20,"Ihuito Meztzi":30,"Oru Ayeraye":40,"Shì hun zhe":50,"Cours secondaires":60,"Lavandières":70};
export const COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_NAVIGATION = COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_ARTICLES.filter((article)=>article.audience!=="mj").map((article)=>{const subgroup=String(article.pnj?.source_group??"Vampires");return{id:article.id,dataset:"verite-vampire-courts-pnj",category:"Personnages",group:"Personnages de Vérité",groupOrder:45,subgroup,subgroupOrder:SUBGROUP_ORDER[subgroup]??99,pageOrder:Number(article.pnj?.source_order??0)+1,displayTitle:article.title};});
