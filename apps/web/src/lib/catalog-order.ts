const collator=new Intl.Collator('fr',{numeric:true,sensitivity:'base'});
export const compareLabels=(a:string,b:string)=>collator.compare(a,b);
export const compareNames=(a:{name:string},b:{name:string})=>compareLabels(a.name,b.name);
export function sortedNames<T extends {name:string}>(items:readonly T[]):T[]{return [...items].sort(compareNames);}
export function compareTruthTalents(a:{name:string;group?:string;cost:number},b:{name:string;group?:string;cost:number}){
  return compareLabels(a.group??'',b.group??'')||a.cost-b.cost||compareNames(a,b);
}
