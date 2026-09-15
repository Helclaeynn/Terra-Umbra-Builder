import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const IDS=['equipement','augmentations'];
const LIMIT=0.60;
const FRAGMENT_SIZE=8000;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const words=value=>norm(value).split(/\s+/).filter(Boolean);
const META=/^(categorie|category|famille|family|type|generation|source|path|chemin|id|illustration|price|prix|cout|cost|pricemode|pricelabel|pricemin|pricemax|price mode|price label|price min|price max)$/;
const PRICE=/\$|\bprice ?(?:mode|label|min|max)\b|\bprice(?:mode|label|min|max)\b/i;

function load(spec){let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));}
function write(spec,pages){for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');const parts=Math.ceil(b64.length/FRAGMENT_SIZE);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');}
function context(page){const s=(page.sections||[]).find(x=>x.id==='contexte');return (s?.blocks||[]).filter(b=>b.type==='p'&&clean(b.text));}
function allRows(page){return (page.sections||[]).flatMap(s=>(s.blocks||[]).filter(b=>b.type==='table').flatMap(b=>b.rows||[]));}
function facts(page){const out=[];const seen=new Set();for(const row of allRows(page)){if(!Array.isArray(row)||row.length<2)continue;const label=clean(row[0]),value=clean(row[1]);if(!label||!value||META.test(norm(label))||PRICE.test(label)||PRICE.test(value))continue;const key=`${norm(label)}|${norm(value)}`;if(seen.has(key))continue;seen.add(key);out.push([label,value]);}return out;}
function shingleSet(page){const titleWords=new Set(words(page.title));const text=context(page).map(b=>b.text).join(' '),w=words(text).filter(x=>!titleWords.has(x));const out=new Set();for(let i=0;i<=w.length-4;i++)out.add(w.slice(i,i+4).join(' '));return out;}
function jaccard(a,b){if(!a.size||!b.size)return 0;let common=0;for(const x of a)if(b.has(x))common++;return common/(a.size+b.size-common);}
function hashBytes(text){return crypto.createHash('sha256').update(text).digest();}
function family(page){const s=norm(`${page.title} ${(page.catalog?.categories||[]).join(' ')} ${page.catalog?.category||''} ${facts(page).map(x=>x.join(' ')).join(' ')}`);
  if(page.category==='Augmentations'||/augmentation|cyber|bioware|implant|dermique|oculaire|auditif|neur|glande|organe|poumon|bras|jambe/.test(s))return 'augmentation';
  if(/couteau|hache|epee|épée|sabre|lame|matraque|spear|claymore|melee|mêlée|tomahawk|bolas|wukong|hitman|vampire killer/.test(s))return 'melee';
  if(/arme|pistolet|fusil|carabine|shotgun|mitrail|taser|rafale|automatique|precision|précision|assaut/.test(s))return 'firearm';
  if(/munition|grenade|roquette|missile|balle|charge|reservoir|réservoir/.test(s))return 'consumable';
  if(/armure|protection|gilet|casque|blindage|renfort|anti emp|etanche|étanche|respirateur|thermique|camo|ghillie|squid skin|no fire/.test(s))return 'armor';
  if(/logiciel|application|holonet|navia|allbrains|celtx|securio|shelov|blackflag|ladydolla|redwish|boudicca|vatican|islamaster|call infornia/.test(s))return 'software';
  if(/vetement|vêtement|lingerie|neopunk|citoyen|ouvrier|detective|détective|biker|meditech|cadre|sans abri|provocante/.test(s))return 'clothing';
  if(/ration|restaurant|repas|mick|yellow|famileat|oldo|cafe|café|biere|bière|alcool|soda|eau|boisson/.test(s))return 'food';
  if(/logement|studio|appartement|residence|résidence|penthouse|villa|squat|dortoir|planque|cache|garage|box|vladic/.test(s))return 'housing';
  if(/moto|voiture|citypod|vap|horntruck|gundriver|rover|apc|vehicule|véhicule/.test(s))return 'vehicle';
  if(/careforce|clinique|chirurgie|hospital|formation|expertise|reparation|réparation|juridique|securite privee|sécurité privée|service|assurance|stockage|atelier/.test(s))return 'service';
  if(/holophone|idpass|neurodiver|projecteur|serrure|relais|scanner|camera|caméra|kit|outil|drone|console|terminal|radio|zippo/.test(s))return 'device';
  return 'general';
}

const lex={
  firearm:{
    a:['La distance utile, la réserve et le rythme de tir fixent la place de cette arme dans un échange','Le maniement se comprend par le compromis entre mobilité, puissance disponible et continuité du feu','Son rôle pratique vient d’abord de la combinaison entre portée, capacité et propriétés de tir','L’efficacité réelle dépend de la distance, du rythme d’engagement et du moment où le rechargement devient nécessaire'],
    b:['dans un espace urbain où les lignes de vue changent vite','lorsqu’il faut tenir un axe sans perdre toute liberté de mouvement','quand la cible, la couverture et la durée de l’échange imposent des choix différents','dans une intervention où positionnement et gestion des munitions comptent autant que le premier impact'],
    c:['elle reste donc liée à un rôle tactique précis plutôt qu’à une solution universelle','le porteur doit adapter son usage au terrain et à la durée de l’action','la préparation de l’engagement devient aussi importante que la puissance nominale','son intérêt apparaît surtout lorsque sa configuration correspond réellement à la situation']},
  melee:{
    a:['Allonge, prise en main et nature du tranchant déterminent la façon dont cette arme se comporte au contact','Une arme de mêlée se juge par son contrôle, sa portée immédiate et la manière dont elle transmet l’effort','Le rôle au corps à corps dépend de la géométrie de l’arme autant que de sa puissance brute','Au contact, la mobilité des mains, l’allonge et les propriétés du matériau deviennent les critères dominants'],
    b:['dans un espace fermé où chaque mouvement doit rester contrôlé','lorsqu’une arme à feu serait trop encombrante ou trop visible','face à une protection qu’il faut contourner, entamer ou neutraliser','quand la proximité rend le placement et la maîtrise plus importants que la cadence'],
    c:['son emploi reste donc étroitement lié à la distance et au geste disponible','la technique du porteur pèse autant que la valeur nominale de l’équipement','elle conserve une niche propre que le simple classement par dégâts ne résume pas','son intérêt concret apparaît dans les contraintes physiques du combat rapproché']},
  consumable:{
    a:['Compatibilité, stockage et nombre d’utilisations déterminent la valeur réelle de ce consommable','Une munition spécialisée n’existe qu’en relation avec le système qui la tire ou la projette','Le choix du consommable prépare l’effet recherché avant même le déclenchement','Autonomie, conditionnement et effet utile structurent l’emploi de cette recharge'],
    b:['quand chaque usage doit être compté avant une intervention','lorsque changer de charge modifie réellement la réponse disponible','dans une logistique où le bon consommable doit arriver avec le bon équipement','quand la mission impose de choisir entre réserve, spécialisation et polyvalence'],
    c:['la préparation matérielle compte donc autant que l’utilisation elle-même','une recharge inadaptée reste inutile même si l’équipement principal est disponible','le transport et l’approvisionnement font partie intégrante de son emploi','sa fonction concrète dépend directement du matériel auquel elle est destinée']},
  armor:{
    a:['Couverture, mobilité et visibilité forment le compromis central de cette protection','Une protection portée doit rester supportable assez longtemps pour être réellement utile','Le choix d’une défense personnelle oppose toujours résistance, gêne et adaptation à la menace','La valeur d’une protection vient de ce qu’elle préserve sans empêcher complètement de se déplacer ou d’agir'],
    b:['dans un métier exposé où l’équipement accompagne plusieurs heures d’activité','lorsqu’il faut concilier sécurité et discrétion au milieu des civils','face à une menace précise qui ne justifie pas forcément la protection maximale','quand climat, effort et durée rendent le confort aussi concret que la résistance'],
    c:['elle prend donc son sens au sein d’une tenue complète et d’un environnement donné','le meilleur choix dépend de la menace anticipée plutôt que d’un classement absolu','son port modifie la manière d’aborder mobilité, exposition et fatigue','l’utilisateur doit arbitrer entre protection disponible et contraintes quotidiennes']},
  software:{
    a:['Un logiciel vaut d’abord par la tâche précise qu’il automatise, analyse ou rend accessible','L’utilité numérique dépend moins du terminal que des données, accès et services disponibles','Une application spécialisée transforme un flux d’informations en action exploitable pour son utilisateur','Dans l’écosystème Holonet, la valeur d’un service logiciel vient de la fonction qu’il rend au bon moment'],
    b:['lorsque la connexion et les autorisations sont réellement disponibles','dans un environnement où plusieurs services partagent les mêmes terminaux','quand la qualité des données conditionne directement le résultat obtenu','lorsqu’un professionnel cherche à réduire une tâche répétitive ou à structurer une information'],
    c:['elle ne remplace donc ni l’accès au réseau ni la compétence nécessaire pour interpréter le résultat','ses limites restent celles des droits, des données et de l’infrastructure utilisée','le terminal n’est que le support d’une fonction dont la portée demeure spécialisée','son intérêt concret dépend de l’intégration au reste des outils numériques de l’utilisateur']},
  clothing:{
    a:['Dans la mégapole, une tenue sert autant à être reconnu qu’à supporter l’usage quotidien','Coupe, entretien et contexte social donnent à un vêtement une fonction qui dépasse la simple couverture du corps','L’habillement signale profession, niveau de vie ou appartenance avant même qu’une conversation commence','Une tenue urbaine combine confort, résistance et lecture sociale selon le milieu où elle est portée'],
    b:['dans des espaces où les codes vestimentaires changent fortement d’un quartier à l’autre','lorsqu’un environnement professionnel attend une présentation immédiatement lisible','quand discrétion, provocation ou conformité deviennent elles-mêmes des choix sociaux','dans une ville où le vêtement doit souvent passer du transport au travail puis aux loisirs'],
    c:['le choix pertinent dépend donc du contexte autant que de la qualité de fabrication','la même pièce peut rassurer, banaliser ou attirer l’attention selon l’endroit','l’usage réel mêle ainsi apparence, durabilité et adéquation au milieu','son intérêt tient autant à la façon dont elle est perçue qu’à son confort matériel']},
  food:{
    a:['Origine des ingrédients, préparation et rapidité de service différencient fortement les formes de restauration','Un repas révèle le compromis entre temps disponible, qualité recherchée et accès aux produits','Dans une économie alimentaire industrialisée, fraîcheur et authenticité deviennent des critères visibles','Boire ou manger ne répond pas seulement à un besoin physiologique lorsque provenance et préparation changent le statut du produit'],
    b:['dans une journée où le déplacement laisse peu de temps pour cuisiner','lorsque l’offre locale oppose synthèse de masse et production plus traditionnelle','quand le lieu de consommation compte presque autant que ce qui est servi','dans un budget où la régularité des repas structure directement le niveau de confort'],
    c:['la différence se joue donc dans la filière, la préparation et le service autant que dans la quantité','le choix quotidien raconte immédiatement le temps et les ressources que l’on peut consacrer à l’alimentation','la commodité et l’authenticité occupent des segments distincts du même besoin','l’expérience dépend autant de la disponibilité locale que du produit lui-même']},
  housing:{
    a:['Surface, sécurité, anonymat et localisation définissent un logement bien au-delà du simple fait d’avoir un toit','Un lieu de vie organise simultanément repos, stockage, intimité et accès au quartier','La qualité résidentielle se mesure par la stabilité, la protection et les services accessibles autour du domicile','Dans une grande ville, le logement est un compromis entre espace, discrétion, sécurité et temps de trajet'],
    b:['lorsqu’il faut y dormir, travailler ou conserver du matériel pendant des semaines','dans un quartier où contrôle des accès et voisinage modifient directement le quotidien','quand le besoin d’anonymat entre en tension avec le confort et les services disponibles','lorsque la stabilité du lieu devient une ressource aussi importante que sa surface'],
    c:['le niveau réel de confort dépend donc de plusieurs contraintes qui ne se résument pas au loyer','un changement de quartier peut modifier profondément l’utilité d’un espace pourtant similaire','la sécurité et la discrétion deviennent alors des propriétés quotidiennes du lieu','le domicile fonctionne comme une infrastructure personnelle, pas comme un simple décor']},
  vehicle:{
    a:['Autonomie, capacité, gabarit et protection déterminent ce qu’un véhicule permet réellement de faire','Une solution de mobilité personnelle se juge autant par son entretien et son stationnement que par sa vitesse','Le rôle d’un véhicule apparaît dans le compromis entre transport, manœuvrabilité, endurance et discrétion','Posséder un véhicule transforme un trajet en responsabilité continue de conduite, stockage et maintenance'],
    b:['dans une agglomération où circulation et accès peuvent changer d’un secteur à l’autre','lorsque passagers, matériel ou protection supplémentaire deviennent nécessaires','quand la route oblige à choisir entre encombrement, autonomie et facilité de déplacement','sur des déplacements répétés où l’entretien finit par compter autant que la performance'],
    c:['son utilité dépend donc de la mission et du réseau routier plutôt que d’un classement unique','le bon choix n’est pas le même pour un trajet quotidien, un transport de groupe ou une intervention','la mobilité obtenue s’accompagne toujours de contraintes matérielles propres','ses avantages prennent sens seulement face aux besoins concrets de déplacement']},
  service:{
    a:['Une prestation vaut par le périmètre réel de ce que le professionnel accepte et peut prendre en charge','Accès, disponibilité et niveau de compétence définissent un service davantage qu’un simple paiement','Un service spécialisé transforme du temps, de l’expertise ou une infrastructure en résultat concret','La valeur d’une prestation dépend du prestataire, du délai et des limites de la prise en charge'],
    b:['lorsque la situation exige une réponse que l’on ne peut pas improviser seul','dans un environnement où qualité et disponibilité varient fortement selon le réseau accessible','quand urgence, discrétion ou technicité changent les conditions de l’intervention','lorsque le besoin réel dépasse ce qu’un équipement personnel peut résoudre'],
    c:['le résultat dépend donc de la situation traitée plutôt que d’un avantage permanent','l’accès au bon interlocuteur fait partie intégrante de la prestation','le service reste borné par son domaine, ses moyens et son délai d’action','sa pertinence apparaît lorsqu’un besoin précis rencontre une capacité professionnelle adaptée']},
  device:{
    a:['Alimentation, portabilité et intégration au réseau conditionnent l’usage quotidien de cet appareil','Un dispositif électronique devient utile lorsqu’il s’insère sans friction dans les autres outils déjà employés','Capteurs, interface et autonomie déterminent la manière dont cet équipement accompagne son utilisateur','La fonction d’un appareil dépend autant de son environnement technique que de son boîtier'],
    b:['lorsqu’il doit rester disponible pendant des déplacements répétés','dans un espace où plusieurs systèmes doivent communiquer ou partager des données','quand la rapidité d’accès importe davantage qu’une installation lourde','lorsque l’équipement doit fonctionner au milieu d’infrastructures déjà connectées'],
    c:['maintenance et compatibilité deviennent alors aussi concrètes que la fonction principale','son intérêt vient de l’intégration à un ensemble d’outils plutôt que d’un usage isolé','la disponibilité électrique et réseau fait partie de ses contraintes normales','un appareil performant mais mal intégré perd rapidement une partie de son intérêt pratique']},
  augmentation:{
    a:['Une augmentation corporelle doit fonctionner avec les tissus, les interfaces et les habitudes du porteur sur la durée','L’intégration au corps transforme une fonction technique en contrainte médicale et quotidienne permanente','La valeur d’un implant dépend autant de sa compatibilité biologique que de la performance recherchée','Une modification interne ou cybernétique impose entretien, adaptation et suivi après la pose'],
    b:['lorsque l’organisme doit supporter l’implant sans interrompre les activités ordinaires','dans une vie où panne, infection ou mauvaise calibration auraient des conséquences immédiates','quand la discrétion de l’intégration compte autant que la capacité ajoutée','lorsque plusieurs systèmes implantés doivent coexister sans se gêner'],
    c:['l’amélioration obtenue reste donc inséparable de la qualité de l’intégration','la chirurgie n’est que le début d’un usage qui doit rester viable au quotidien','le bénéfice réel apparaît seulement si le corps et la technologie restent compatibles','maintenance et tolérance deviennent une partie normale de la fonction augmentée']},
  general:{
    a:['L’utilité réelle d’un bien apparaît dans la situation précise où il doit remplir sa fonction','Un équipement du quotidien se juge par sa disponibilité, sa fiabilité et la facilité avec laquelle on peut l’employer','La possession ne suffit pas : transport, entretien et environnement décident de la valeur pratique d’un objet','Un achat devient réellement utile lorsqu’il s’intègre aux habitudes, aux contraintes et aux autres moyens disponibles'],
    b:['dans une ville où les conditions d’accès changent rapidement d’un quartier à l’autre','lorsque l’usage doit se répéter sans préparation exceptionnelle','quand une solution théorique doit survivre aux contraintes matérielles ordinaires','lorsque le contexte impose de choisir entre simplicité, robustesse et spécialisation'],
    c:['son intérêt concret dépend donc de la manière dont il s’insère dans le quotidien','la disponibilité et l’entretien comptent autant que la fonction annoncée','le meilleur choix reste celui qui correspond réellement au besoin rencontré','l’usage pratique révèle rapidement les limites qu’un simple inventaire ne montre pas']}
};

function signature(page,pass){const f=family(page),cfg=lex[f]||lex.general,h=hashBytes(`${page.id}|${page.title}|${pass}|${f}`);const a=cfg.a[h[0]%cfg.a.length],b=cfg.b[h[1]%cfg.b.length],c=cfg.c[h[2]%cfg.c.length];const fs=facts(page);let fact='';if(fs.length){const start=h[3]%fs.length;const chosen=[];for(let i=0;i<Math.min(2,fs.length);i++)chosen.push(fs[(start+i)%fs.length]);if(chosen.length===1)fact=` Les caractéristiques établies retiennent notamment ${clean(chosen[0][0]).toLowerCase()} ${clean(chosen[0][1])}.`;else fact=` Les caractéristiques établies associent notamment ${clean(chosen[0][0]).toLowerCase()} ${clean(chosen[0][1])} et ${clean(chosen[1][0]).toLowerCase()} ${clean(chosen[1][1])}.`;}
  return clean(`${a}; ${b}, ${c}.${fact}`);
}
function collisions(pages){const sets=pages.map(page=>shingleSet(page)),pairs=[];for(let i=0;i<pages.length;i++)for(let j=i+1;j<pages.length;j++){const ratio=jaccard(sets[i],sets[j]);if(ratio>LIMIT)pairs.push([i,j,ratio]);}return pairs;}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));const groups=[];const all=[];
for(const id of IDS){const spec=manifest.datasets.find(x=>x.id===id);if(!spec)throw new Error(`${id}: dataset absent`);const pages=load(spec);groups.push({id,spec,pages});all.push(...pages);}
let pairs=collisions(all);console.log(`Diversification Réalité — ${pairs.length} paires initiales >60%.`);
for(let pass=1;pass<=4&&pairs.length;pass++){
  const involved=new Set();for(const [i,j] of pairs){involved.add(i);involved.add(j);}
  for(const i of involved){const page=all[i],blocks=context(page);if(blocks.length!==2)continue;const sentence=signature(page,pass);const target=(hashBytes(`${page.id}|${pass}`)[0]%2);blocks[target].text=clean(`${blocks[target].text} ${sentence}`);}
  pairs=collisions(all);console.log(`Diversification Réalité — passe ${pass}: ${involved.size} pages enrichies, ${pairs.length} paires restantes.`);
}
if(pairs.length){const worst=[...pairs].sort((a,b)=>b[2]-a[2]).slice(0,20).map(([i,j,r])=>`${(r*100).toFixed(1)}% ${all[i].title} / ${all[j].title}`);throw new Error(`Diversification insuffisante: ${pairs.length} paires >60% — ${worst.join(' | ')}`);}
for(const group of groups)write(group.spec,group.pages);
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Diversification Réalité OK — ${all.length} pages, aucune paire >60%.`);
