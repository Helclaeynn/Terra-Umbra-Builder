const collator=new Intl.Collator('fr',{numeric:true,sensitivity:'base'});
export const compareLabels=(a:string,b:string)=>collator.compare(a,b);
export const compareNames=(a:{name:string},b:{name:string})=>compareLabels(a.name,b.name);
export function sortedNames<T extends {name:string}>(items:readonly T[]):T[]{return [...items].sort(compareNames);}
type TalentVoieOrder={title:string;palier:string|null;porte:string|null;position:number|null};
const PALIER_ORDER:Record<string,number>={entree:0,I:1,II:2,III:3};
export function compareTruthTalents(
  a:{name:string;group?:string;cost:number;voie?:TalentVoieOrder},
  b:{name:string;group?:string;cost:number;voie?:TalentVoieOrder}
){
  const byGroup=compareLabels(a.group??'',b.group??'');
  if(byGroup)return byGroup;
  // Règles en voies : l'ordre de la voie (porte, palier, place) remplace le coût.
  if(a.voie&&b.voie){
    return compareLabels(a.voie.title,b.voie.title)
      ||compareLabels(a.voie.porte??'',b.voie.porte??'')
      ||(PALIER_ORDER[a.voie.palier??'']??9)-(PALIER_ORDER[b.voie.palier??'']??9)
      ||(a.voie.position??0)-(b.voie.position??0)
      ||compareNames(a,b);
  }
  return a.cost-b.cost||compareNames(a,b);
}
