/** Contextual test totals, never permanent skill ranks or derived defenses.
 * Equivalent talent test bonuses use the best; both Omertas are the explicit exception. */
export type ContextBonus={id:string;label:string;bonus:number;total:number};
type Choice={kind:string;contextual?:boolean;permanent?:boolean;bonus?:number;help?:string};
const rules:Readonly<Record<string,{skill:string;bonus:number;label:string}>>={
 sante_de_fer:{skill:'constitution',bonus:2,label:'Maladies et infections'},
 maitre_des_lames:{skill:'melee',bonus:1,label:'Avec une lame'},
 stable:{skill:'maitrise_spirituelle',bonus:1,label:'Tests de Stress'},
 debrouille:{skill:'survie',bonus:1,label:'Milieu urbain pauvre ou hors système'},
 fonctionnaire_experimente:{skill:'diplomatie',bonus:1,label:'Avec l’administration'},
 maitrise_des_codes_de_la_rue:{skill:'langages_argot',bonus:1,label:'Culture Crawler'},
 education_theologique:{skill:'savoirs',bonus:1,label:'Religion et doctrine'},
 conseiller_spirituel:{skill:'diplomatie',bonus:1,label:'Personne acceptant votre conseil'},
 ministere:{skill:'maitrise_spirituelle',bonus:2,label:'Premier Stress du scénario lié au domaine religieux choisi'}
};
export function contextualSkillBonuses(ids:readonly string[],choices:Record<string,unknown>,specs:Record<string,Choice>,skillMap:Record<string,string>,skill:string,total:number):ContextBonus[]{
 const owned=new Set(ids),rows:ContextBonus[]=[];
 const already=[...owned].reduce((n,id)=>n+(skillMap[id]===skill?1:0),0);
 const add=(id:string,label:string,bonus:number)=>rows.push({id,label,bonus,total:total-already+Math.max(already,bonus)});
 for(const id of owned){const r=rules[id];if(r?.skill===skill)add(id,r.label,r.bonus);}
 for(const id of owned){const s=specs[id];if(s?.kind==='skill'&&s.contextual&&!s.permanent&&choices[id]===skill&&Number(s.bonus)>0&&!rules[id])add(id,s.help||'Dans le contexte du talent',Number(s.bonus));}
 if(skill==='force_mentale'){
  if(owned.has('omerta_familiale'))add('omerta_familiale','Pressions profanes contre la famille ou l’ancien milieu',2);
  if(owned.has('omerta'))add('omerta','Pressions contre l’organisation',2);
  if(owned.has('omerta_familiale')&&owned.has('omerta'))add('omerta-cumul','Famille et organisation concernées ensemble',4);
 }
 return rows;
}
