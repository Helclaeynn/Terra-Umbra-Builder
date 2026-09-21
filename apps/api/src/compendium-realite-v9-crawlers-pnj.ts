import { COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_DOCX } from "./compendium-realite-v9-crawlers-pnj-docx.js";
import { COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_PDF_0 } from "./compendium-realite-v9-crawlers-pnj-pdf-0.js";
import { COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_PDF_1 } from "./compendium-realite-v9-crawlers-pnj-pdf-1.js";
export const COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_ARTICLES = [...COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_DOCX,...COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_PDF_0,...COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_PDF_1] as Array<Record<string, any>>;
export const COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_NAVIGATION = COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_ARTICLES.map((article,index)=>({id:article.id,dataset:"realite-v9-crawlers-pnj",category:"Personnages",group:"Crawlers & Underlife",groupOrder:6,subgroup:String(article?.pnj?.organisation??"Crawlers"),subgroupOrder:1,pageOrder:index+1,displayTitle:article.title}));
