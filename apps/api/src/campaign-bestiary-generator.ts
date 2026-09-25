import {BESTIARY_WEAPONS} from './campaign-bestiary-weapons.js';
import {BESTIARY_ARCHETYPES,BESTIARY_DIFFICULTIES,BESTIARY_STAT_KEYS,BESTIARY_WEAPON_GROUPS,weaponAttack,type BestiaryCatalog,type BestiaryData,type BestiaryStat,type BestiaryStats} from './campaign-bestiary-model.js';

// Direct scene values, calibrated against the compact 1.1 / 2.x Bestiary blocks.
const BASE:Record<string,BestiaryStats>={
 figurant:{movement:6,actions:1,initiative:5,perception:5,mastery:5,physicalDefense:5,occultDefense:5,pv:8,armor:0,attack:5},
 standard:{movement:7,actions:2,initiative:8,perception:8,mastery:7,physicalDefense:7,occultDefense:7,pv:13,armor:1,attack:8},
 dangereux:{movement:9,actions:2,initiative:11,perception:10,mastery:10,physicalDefense:10,occultDefense:10,pv:22,armor:3,attack:11},
 majeur:{movement:11,actions:3,initiative:15,perception:13,mastery:13,physicalDefense:13,occultDefense:13,pv:38,armor:5,attack:15},
 exceptionnel:{movement:13,actions:4,initiative:19,perception:17,mastery:18,physicalDefense:17,occultDefense:18,pv:75,armor:8,attack:19}
};
const OFFSETS:Record<string,Partial<BestiaryStats>>={
 civil:{attack:-1,pv:-1},combattant:{physicalDefense:1,attack:1,mastery:-1},tireur:{attack:2,physicalDefense:-1,perception:1},drone:{armor:2,occultDefense:-1,mastery:1},
 predateur:{movement:2,attack:1,mastery:-1},spectre:{movement:1,physicalDefense:-2,occultDefense:2,armor:-2},colosse:{movement:-2,pv:8,armor:2,physicalDefense:1},occultiste:{occultDefense:2,mastery:2,physicalDefense:-1,attack:-1}
};
const SPREAD:Record<BestiaryStat,number>={movement:2,actions:0,initiative:2,perception:2,mastery:2,physicalDefense:2,occultDefense:2,pv:4,armor:1,attack:2};
const INNATE:Record<string,{name:string;damage:number;range:string;properties:string}[]>={
 civil:[{name:'Coup ou morsure',damage:1,range:'Contact',properties:''}],combattant:[{name:'Frappe',damage:3,range:'Contact',properties:''}],tireur:[{name:'Coup improvisé',damage:2,range:'Contact',properties:''}],drone:[{name:'Choc mécanique',damage:4,range:'Contact',properties:''}],
 predateur:[{name:'Griffes',damage:4,range:'Contact',properties:''},{name:'Morsure',damage:5,range:'Contact',properties:''},{name:'Charge',damage:4,range:'Contact',properties:''}],
 spectre:[{name:'Contact spectral',damage:4,range:'Contact',properties:'Occulte'},{name:'Drain vital',damage:3,range:'Contact',properties:'Contre défense occulte'}],
 colosse:[{name:'Écrasement',damage:7,range:'Contact',properties:''},{name:'Balayage',damage:6,range:'Contact',properties:''}],
 occultiste:[{name:'Projection occulte',damage:5,range:'15 m',properties:'Occulte'},{name:'Emprise',damage:4,range:'10 m',properties:'Contre défense occulte'}]
};
const TACTICS:Record<string,string[]>={
 civil:['Cherche à se protéger ou à fuir.','Alerte les personnes à proximité.'],combattant:['Cherche une ouverture avant de frapper.','Protège un allié proche.'],tireur:['Cherche un couvert avant de tirer.','Change d’angle après un tir.'],drone:['Suit son protocole tant qu’il reçoit des ordres.','Cible la menace la plus proche.'],
 predateur:['Isole une cible avant de l’attaquer.','Se replie si la chasse tourne mal.'],spectre:['Apparaît près d’une cible vulnérable.','Évite les lieux où sa présence est révélée.'],colosse:['Bloque le passage et tient sa position.','Bouscule les ennemis qui s’approchent.'],occultiste:['Reste à distance et choisit sa cible.','Cherche à rompre la ligne de vue après son attaque.']
};
function randomFrom(seed:string){let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);return ()=>{n+=0x6D2B79F5;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};}
export function bestiaryRanges(difficultyId:string,archetypeId:string){const base=BASE[difficultyId],offset=OFFSETS[archetypeId];if(!base||!offset)return null;
 return Object.fromEntries(BESTIARY_STAT_KEYS.map(k=>{const value=Math.max(k==='armor'?0:1,base[k]+(offset[k]||0)),delta=SPREAD[k];return [k,{min:Math.max(k==='armor'?0:1,value-delta),max:value+delta}];})) as Record<BestiaryStat,{min:number;max:number}>;
}
export const BESTIARY_CATALOG:BestiaryCatalog={difficulties:BESTIARY_DIFFICULTIES,archetypes:BESTIARY_ARCHETYPES,weapons:BESTIARY_WEAPONS,ranges:Object.fromEntries(BESTIARY_DIFFICULTIES.flatMap(t=>BESTIARY_ARCHETYPES.map(a=>[`${t.id}:${a.id}`,bestiaryRanges(t.id,a.id)!])))};
export function generateBestiary(difficultyId:string,archetypeId:string,weaponGroup:string,seed:string):BestiaryData{
 const difficulty=BESTIARY_DIFFICULTIES.find(t=>t.id===difficultyId),archetype=BESTIARY_ARCHETYPES.find(a=>a.id===archetypeId),ranges=bestiaryRanges(difficultyId,archetypeId);
 if(!difficulty||!archetype||!ranges||!BESTIARY_WEAPON_GROUPS.includes(weaponGroup as any)||archetype.realm==='verite'&&weaponGroup!=='Aucune')throw Error('invalid_bestiary_generator');
 const random=randomFrom(seed),stats=Object.fromEntries(BESTIARY_STAT_KEYS.map(k=>{const r=ranges[k];return [k,r.min+Math.floor(random()*(r.max-r.min+1))];})) as BestiaryStats;
 const weapons=BESTIARY_WEAPONS.filter(w=>w.group===weaponGroup),weapon=weapons[Math.floor(random()*weapons.length)];
 const innate=INNATE[archetype.id],natural=innate[Math.floor(random()*innate.length)];
 const damage=Math.max(1,natural.damage+BESTIARY_DIFFICULTIES.findIndex(t=>t.id===difficultyId));
 const attacks=[weapon?weaponAttack(weapon,stats.attack):{...natural,damage,score:stats.attack,weaponId:''}];
 const tactic=TACTICS[archetype.id][Math.floor(random()*TACTICS[archetype.id].length)];
 return {name:`${archetype.name} · ${difficulty.name}`,realm:archetype.realm,difficultyId,archetypeId,description:'',role:archetype.name,hook:'',abilities:[tactic],weaknesses:[],equipment:weapon?.name||'',tags:[archetype.name],stats,attacks};
}
export function generateBestiaryBatch(value:unknown):BestiaryData[]|null{
 if(!value||typeof value!=='object'||Array.isArray(value))return null;const b=value as Record<string,unknown>;
 if(typeof b.seed!=='string'||!b.seed||b.seed.length>100||!Number.isInteger(b.count)||Number(b.count)<1||Number(b.count)>10||typeof b.difficultyId!=='string'||typeof b.archetypeId!=='string'||typeof b.weaponGroup!=='string')return null;
 try{return Array.from({length:Number(b.count)},(_,i)=>{const d=generateBestiary(b.difficultyId as string,b.archetypeId as string,b.weaponGroup as string,`${b.seed}:${i}`);if(Number(b.count)>1)d.name+=` ${i+1}`;return d;});}catch{return null;}
}
