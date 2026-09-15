import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const SPARSE_SOURCE='compendium/source/reality-lore-v3-sparse.json';
const NEURO_SOURCE='compendium/source/reality-lore-v3-neuro.json';
const FRAGMENT_SIZE=8000;
const DATASETS=['equipement','augmentations'];
const LORE_VERSION=3;

const sparseBook=JSON.parse(fs.readFileSync(SPARSE_SOURCE,'utf8')).entries||{};
const neuroBook=JSON.parse(fs.readFileSync(NEURO_SOURCE,'utf8')).entries||{};

const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const lowerFirst=value=>{const s=clean(value);return s?s[0].toLowerCase()+s.slice(1):s;};
const finish=value=>{const s=clean(value);return !s?'':/[.!?…]$/.test(s)?s:`${s}.`;};
const stableVariant=(key,count=4)=>crypto.createHash('sha1').update(String(key)).digest()[0]%count;
const EFFECT_LABEL=/^(effet usage|effet|usage|fonction|description|profil)$/;

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    const file=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    if(!fs.existsSync(file))throw new Error(`${spec.id}: fragment absent ${file}`);
    b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
  }
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function writeDataset(spec,pages){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');
  const parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
  spec.quality={...(spec.quality||{}),loreVersion:LORE_VERSION,maxIdenticalTextRatio:0.6,method:'reality-book-semantic-lore'};
}
function rowsOf(page){return (page.sections||[]).flatMap(s=>(s.blocks||[]).filter(b=>b.type==='table').flatMap(b=>Array.isArray(b.rows)?b.rows:[]));}
function rowLabel(row){return clean(row?.[0]);}
function rowValue(row){return clean(row?.[1]);}
function uniqueRows(rows){
  const out=[],seen=new Set();
  for(const row of rows){if(!Array.isArray(row)||row.length<2)continue;const l=rowLabel(row),v=rowValue(row),k=`${norm(l)}|${norm(v)}`;if(!l||!v||seen.has(k))continue;seen.add(k);out.push([l,v]);}
  return out;
}
function firstRow(rows,re){return uniqueRows(rows).find(([l,v])=>re.test(norm(l))&&norm(v));}
function effectOf(rows){return rowValue(firstRow(rows,EFFECT_LABEL)||[]);}
function isMeta(label){return /^(categorie|category|famille|family|type|generation|source|path|chemin|id|price|prix|cout|cost|price mode|price label|price min|price max|illustration)$/.test(norm(label));}
function factsOf(rows){return uniqueRows(rows).filter(([l,v])=>norm(v)&&!isMeta(l)&&!EFFECT_LABEL.test(norm(l)));}
function categoryOf(page,rows){return rowValue(firstRow(rows,/^(categorie|category|famille|family|type)$/)||[])||clean(page.catalog?.category||page.catalog?.categories?.join(' · ')||'');}
function replaceContext(page,result){
  const section=(page.sections||[]).find(s=>s.id==='contexte');if(!section)throw new Error(`${page.title}: section contexte absente`);
  section.title='Description et usage';
  section.blocks=result.paragraphs.map(text=>({type:'p',style:'lore reality-book-lore',text:clean(text)}));
  page.catalog={...(page.catalog||{}),loreVersion:LORE_VERSION,loreMethod:'reality-book-semantic-lore',loreGrounding:result.grounding,loreSource:result.source||'Réalité V8 / données de catalogue'};
}

function parseBookCard(title,card){
  const text=clean(card);let rest=text;
  const nt=norm(title),ntext=norm(text);
  if(ntext.startsWith(nt))rest=text.slice(Math.min(text.length,title.length)).trim();
  const parts=rest.split(/\s*•\s*/).map(clean).filter(Boolean),out={};
  for(const part of parts){
    const m=part.match(/^(TYPE|CLASSE|DGT|PORTEE|CAP\.?|ROLE|PROPRIETES|PRIX(?: DE REFERENCE| INDICATIF)?|QUANTITE|PROFIL \/ EFFET)\s+(.+)$/i);
    if(m)out[norm(m[1])]=clean(m[2]);
  }
  return out;
}
function propText(props){
  const p=norm(props);if(!p||p==='-')return '';
  const bits=[];
  if(/rafale/.test(p)&&/automatique/.test(p))bits.push('elle peut enchaîner les rafales et maintenir un tir de suppression');
  else if(/rafale/.test(p))bits.push('elle est prévue pour le tir en rafale');
  else if(/automatique/.test(p))bits.push('elle peut maintenir un tir automatique de suppression');
  if(/fiable|robuste/.test(p))bits.push('sa conception privilégie la robustesse et limite les incidents de fonctionnement');
  if(/smartlink/.test(p))bits.push('son électronique accepte une liaison Smartlink pour le ciblage et le Verrouillage');
  if(/autoguide/.test(p))bits.push('son guidage peut suivre un Verrouillage fourni par le tireur ou un désignateur');
  if(/emp/.test(p))bits.push('ses effets EMP permettent de compromettre électronique, capteurs ou interfaces accessibles');
  if(/perforant\s*\d+/.test(p))bits.push('son pouvoir perforant est pensé pour entamer les protections matérielles plutôt que seulement la cible exposée');
  if(/dispersion/.test(p))bits.push('sa gerbe perd de son efficacité au-delà de sa zone de tir rapproché');
  if(/electrique|electricite/.test(p))bits.push('sa décharge électrique vise la neutralisation et les systèmes sensibles autant que le traumatisme brut');
  if(/\bfeu\b/.test(p))bits.push('son effet incendiaire peut mettre le décor combustible en jeu');
  if(/chimique/.test(p))bits.push('son vecteur chimique impose une protection étanche ou spécialisée');
  if(/cauterise/.test(p))bits.push('son tranchant énergétique cautérise au passage');
  if(/aquatique/.test(p))bits.push('elle reste conçue pour fonctionner en milieu aquatique');
  if(/pliant/.test(p))bits.push('son architecture pliante réduit l’encombrement au transport');
  if(/silencieux/.test(p))bits.push('sa signature acoustique est réduite sans rendre le tir réellement inaudible');
  if(/encombrant/.test(p))bits.push('son gabarit impose un portage, un appui ou un harnais adapté');
  if(/zone/.test(p))bits.push('elle traite une zone plutôt qu’un point unique');
  return bits.slice(0,3).join(' ; ');
}
function weaponNoun(data,title){
  const role=clean(data.role);if(role)return lowerFirst(role);
  const c=norm(data.classe||data.type||'');
  if(/taser leger/.test(c))return 'taser compact de neutralisation';
  if(/taser lourd/.test(c))return 'taser lourd de neutralisation';
  if(/poche/.test(c))return 'pistolet de poche conçu pour le port discret';
  if(/pistolet leger/.test(c))return 'pistolet léger de service';
  if(/pistolet lourd/.test(c))return 'pistolet lourd privilégiant l’impact';
  if(/^pm$/.test(c))return 'pistolet-mitrailleur compact';
  if(/^smg$/.test(c))return 'mitraillette automatique';
  if(/assaut/.test(c))return 'fusil d’assaut polyvalent';
  if(/precision/.test(c))return 'fusil de précision';
  if(/shotgun/.test(c))return 'shotgun de combat rapproché';
  if(/jet melee/.test(c))return 'arme mixte de jet et de mêlée';
  if(/trait/.test(c))return 'arme de trait à tir unique';
  if(/jet/.test(c))return 'arme de jet';
  if(/melee/.test(c))return 'arme de mêlée';
  return /arme|bastion|manticore|hellstorm|doorbell|breacher|wasp|wallbreaker|salamander|purifier/i.test(title)?'arme spécialisée':'arme';
}
function weaponBookLore(page,entry){
  const d=parseBookCard(page.title,entry.card),noun=weaponNoun(d,page.title),range=d.portee,cap=d.cap,props=d.proprietes||'';
  const key=norm(page.title);
  if(key==='bastion')return {grounding:'book',source:entry.section,paragraphs:[
    `Bastion est une mitrailleuse lourde d’appui alimentée par une bande de 60 cartouches. Sa portée de 80 m et son volume de feu la destinent à tenir un axe, couvrir une progression ou verrouiller une position plutôt qu’au port discret.`,
    `Rafale et fonctionnement automatique permettent un feu soutenu et la suppression. Son gabarit Encombrant réclame un portage ou un appui adapté ; la Bande Bastion de 60 coups constitue son alimentation conventionnelle.`]};
  if(key==='manticore')return {grounding:'book',source:entry.section,paragraphs:[
    `Manticore est une arme lourde de neutralisation à six coups, pensée pour frapper les cibles technologiques aussi bien que les combattants protégés. Elle travaille à une portée comparable à Bastion mais remplace le volume de feu par des impacts EMP lourds.`,
    `Son intérêt est de pouvoir mettre en difficulté capteurs, interfaces, armes ou mobilité électronique lorsqu’une Altération le permet. L’ensemble reste Encombrant et relève d’un matériel de soutien, pas d’une arme de poing surdimensionnée.`]};
  if(key==='hellstorm')return {grounding:'book',source:entry.section,paragraphs:[
    `Hellstorm est une Gatling lourde alimentée par une bande de 200 coups. Elle échange la discrétion et la légèreté contre une cadence capable de saturer durablement un secteur à moyenne portée.`,
    `Rafale, tir automatique et mécanique Fiable en font une arme d’appui conçue pour continuer à cracher du feu sous pression. Sa bande dédiée fournit les 200 coups nécessaires à cette cadence, mais le système reste franchement Encombrant.`]};
  if(key==='doorbell')return {grounding:'book',source:entry.section,paragraphs:[
    `Doorbell est un lance-grenades lourd à barillet de six coups. Son profil change avec la grenade chargée : fragmentation, EMP, flash ou fumigène en font davantage une plateforme de munitions qu’une arme à effet unique.`,
    `À 60 m, il sert à projeter une zone d’effet là où une arme directe serait moins utile. Son encombrement et la dépendance au type de grenade imposent de préparer le chargement en fonction de la mission.`]};
  if(key==='breacher')return {grounding:'book',source:entry.section,paragraphs:[
    `Breacher est un lance-roquette de brèche monocoup. Sa roquette combine une forte puissance d’impact, Perforant 2 et une zone de 3 m pour ouvrir une structure, une porte renforcée ou une position fortifiée.`,
    `Le tube privilégie la frappe préparée plutôt que la cadence : après chaque lancement, il faut gérer une nouvelle roquette. À 90 m, c’est un outil d’ouverture violente et d’appui spécialisé, avec l’encombrement qui va avec.`]};
  if(key==='wasp')return {grounding:'book',source:entry.section,paragraphs:[
    `Wasp est un lance-missile guidé monocoup destiné aux cibles que l’on veut atteindre malgré une trajectoire complexe. Le missile combine Autoguide, Smartlink et une zone de 4 m, avec une portée nominale de 150 m.`,
    `Le guidage peut exploiter le Verrouillage du tireur ou d’un désignateur compatible ; avec une trajectoire plausible, le lancement n’exige pas nécessairement une ligne de vue directe au dernier instant. Le système reste Encombrant et chaque tir consomme un missile dédié.`]};
  if(key==='wallbreaker')return {grounding:'book',source:entry.section,paragraphs:[
    `Wallbreaker est une arme lourde anti-matériel et anti-fortification, prévue pour traiter une cible dure plutôt qu’un volume d’infanterie. Ses trois coups portent jusqu’à 200 m et son Perforant 3 vise précisément les protections matérielles.`,
    `Son emploi logique est la destruction de couverture, de structure ou d’équipement protégé. Le modèle est Encombrant : sa puissance et sa portée supposent un portage adapté et une position de tir préparée.`]};
  if(key==='salamander')return {grounding:'book',source:entry.section,paragraphs:[
    `Salamander est un projecteur incendiaire lourd à courte portée, alimenté pour six usages. Il couvre un cône d’environ 3 m et transforme le décor combustible en partie du problème plutôt que de se limiter à l’impact initial.`,
    `Le feu ne crée pas automatiquement un dommage persistant abstrait : ses conséquences passent par les brûlures et l’environnement réellement incendié. L’arme reste Encombrante et se manie comme un outil d’assaut spécialisé.`]};
  if(key==='purifier')return {grounding:'book',source:entry.section,paragraphs:[
    `Purifier est un projecteur chimique lourd dérivé de technologies industrielles de décontamination et de corrosion. À très courte portée, il répand un cône chimique destiné à contaminer une zone ou attaquer un équipement exposé.`,
    `Les protections étanches ou chimiques adaptées comptent réellement contre lui. Une Altération peut laisser une contamination locale ou neutraliser une fonction exposée ; le réservoir offre cinq usages et l’ensemble demeure Encombrant.`]};
  const rangeText=range?` Sa portée nominale de ${range} fixe clairement son domaine d’emploi.`:'';
  const capText=cap?` Il emporte ${cap}${/coup|usage/i.test(cap)?'':` coups`} avant rechargement.`:'';
  const prop=propText(props);
  const v=stableVariant(page.title,4);
  const openings=[
    `${page.title} est ${noun}.${rangeText}${capText}`,
    `${page.title} prend la forme d’un ${noun}.${capText}${rangeText}`,
    `Conçu comme ${noun}, ${page.title} est dimensionné pour son rôle plutôt que comme simple variante cosmétique.${rangeText}${capText}`,
    `${page.title} appartient à la famille des ${noun}s.${rangeText}${capText}`
  ];
  const roleLine=prop?`${prop[0].toUpperCase()+prop.slice(1)}.`:`Son profil ne repose sur aucun dispositif spécial : son intérêt vient du calibre, de la portée et de la manière dont il se porte.`;
  const contextual=/precision/.test(norm(d.classe))?'Son emploi privilégie un tir préparé et la distance plutôt que la cadence.':/shotgun/.test(norm(d.classe))?'Il reste une arme de proximité : la dispersion fait de la distance un facteur beaucoup plus pénalisant.':/poche/.test(norm(d.classe))?'Son format est pensé pour rester transportable et discret, au prix d’une réserve limitée.':/pistolet lourd/.test(norm(d.classe))?'Il privilégie la puissance d’une arme de poing lourde sans devenir une arme d’épaule.':/assaut/.test(norm(d.classe))?'C’est une arme d’épaule généraliste, adaptée au combat mobile et aux échanges soutenus.':/^(pm|smg)$/.test(norm(d.classe))?'Son format automatique vise surtout les distances urbaines et le combat rapproché.':/taser/.test(norm(d.classe))?'Il sert d’abord à neutraliser par décharge électrique plutôt qu’à reproduire le comportement d’une arme balistique.':/melee|jet|trait/.test(norm(d.type))?'Sa forme, sa portée et ses propriétés déterminent sa place entre duel rapproché, lancer et attaque de trait.':'Son profil définit une niche d’emploi nette au sein de l’armement terrestre.';
  return {grounding:'book',source:entry.section,paragraphs:[finish(openings[v]),`${roleLine} ${contextual}`]};
}

const curated=new Map(Object.entries({
  'bande bastion':[
    `La Bande Bastion est une alimentation de 60 cartouches destinée à la mitrailleuse lourde Bastion. C’est la munition conventionnelle de l’arme : elle fournit la réserve nécessaire à ses rafales et à son tir automatique soutenu.`,
    `Une bande complète correspond donc à un cycle d’appui, pas à quelques coups de circonstance. Son volume explique en partie pourquoi Bastion se traite comme une arme Encombrante et s’emploie avec un portage ou un appui adapté.`],
  'charge manticore':[
    `La Charge Manticore regroupe six munitions lourdes EMP pour l’arme de neutralisation Manticore. Elles sont destinées aux cibles où l’électronique, les capteurs ou les interfaces comptent autant que la protection physique.`,
    `Cette charge accompagne le faible magasin de l’arme : chaque tir est plus spécialisé qu’une balle conventionnelle et sert surtout à créer une Altération technologique exploitable.`],
  'bande hellstorm':[
    `La Bande Hellstorm est l’alimentation de 200 coups de la Gatling lourde Hellstorm. Elle existe pour soutenir la cadence de l’arme et éviter qu’un système conçu pour saturer un secteur ne passe son temps à recharger.`,
    `Son volume fait partie de la logique même de Hellstorm : rafales longues, suppression et continuité de feu. Transporter plusieurs bandes devient rapidement un problème logistique autant qu’un problème de prix.`],
  'roquette breacher':[
    `La Roquette Breacher est la munition monocoup du lance-roquette de brèche du même nom. Elle concentre sa puissance sur les structures et positions durcies, avec un effet perforant et une zone d’impact resserrée.`,
    `Elle sert à créer une ouverture ou à traiter un point fort plutôt qu’à arroser un secteur. Chaque projectile correspond à un tir préparé, ce qui rend le choix de la cible important.`],
  'missile wasp':[
    `Le Missile Wasp est la munition guidée du lanceur Wasp. Son électronique accepte un Verrouillage et peut suivre une trajectoire plausible vers une cible même lorsque le tireur ne conserve pas une ligne de vue parfaite au moment du lancement.`,
    `Avec sa charge de zone, c’est une munition de haute valeur destinée aux cibles qui justifient guidage et puissance. Le missile reste opposé à la Défense : Autoguide n’en fait jamais une touche automatique.`],
  'munition wallbreaker':[
    `La Munition Wallbreaker est un projectile anti-matériel conçu pour l’arme lourde du même nom. Son rôle est d’attaquer blindage, couverture et fortification grâce à une pénétration matérielle élevée.`,
    `Elle n’est pas pensée comme une munition de saturation : chaque coup sert à faire céder une protection ou un élément de structure que des tirs ordinaires auraient du mal à entamer.`],
  'reservoir salamander':[
    `Le Réservoir Salamander alimente le projecteur incendiaire lourd Salamander pour six usages. Il contient le consommable qui permet de projeter un cône de feu à courte portée.`,
    `Le danger ne tient pas seulement à l’impact : sur un décor réellement combustible, la projection peut déclencher un incendie cohérent. Le réservoir est donc une ressource de mission autant qu’une simple recharge.`],
  'reservoir purifier':[
    `Le Réservoir Purifier fournit cinq usages au projecteur chimique lourd Purifier. Le consommable descend de procédés industriels de décontamination et de corrosion adaptés à un usage de terrain.`,
    `Une projection peut contaminer localement une zone ou attaquer un équipement exposé ; les protections chimiques étanches restent la réponse logique. Le réservoir conditionne directement l’autonomie de l’arme.`],
  'silencieux':[
    `Un Silencieux est un modérateur de signature acoustique monté sur une arme à feu. Il rend le départ du coup plus difficile à entendre et surtout à localiser, sans transformer l’arme en dispositif inaudible.`,
    `Son intérêt est donc la discrétion relative : distance, environnement et autres bruits peuvent aider le tireur, mais une personne suffisamment proche peut toujours comprendre qu’un tir a eu lieu.`],
  'optique de precision':[
    `L’Optique de précision est un système de visée destiné à exploiter réellement la portée d’une arme lors d’un tir préparé. Elle aide le tireur à identifier et suivre une cible que l’œil nu traiterait déjà comme lointaine.`,
    `Elle prend tout son sens avec l’action Viser : son aide compense les difficultés de longue portée jusqu’à deux fois la portée nominale, sans augmenter magiquement la portée mécanique de l’arme.`],
  'chargeur etendu':[
    `Le Chargeur étendu remplace le magasin standard par une réserve plus volumineuse. Il augmente d’environ moitié le nombre de coups disponibles avant rechargement, ce qui favorise les échanges prolongés.`,
    `Le gain se paie en volume : l’arme devient plus difficile à dissimuler et le chargeur dépasse davantage du profil prévu par le fabricant.`],
  'bipied':[
    `Le Bipied fournit un appui mécanique à une arme lourde ou encombrante. Une fois déployé sur une surface stable, il reporte une partie du poids et du recul vers le sol plutôt que vers le tireur.`,
    `Il est surtout utile lorsque le tireur peut rester stationnaire : l’appui neutralise alors les contraintes directement liées au poids et à l’encombrement, mais n’aide guère dans un déplacement précipité.`],
  'smartlink':[
    `Le Smartlink est une interface de ciblage reliant une arme compatible au système de visée de son utilisateur. Il permet au matériel de partager suivi et solution de tir plutôt que de rester un simple viseur indépendant.`,
    `Avec une interface appropriée, cette liaison autorise le Verrouillage. Les Unsinkables ne peuvent pas exploiter la connexion neuroassistée, ce qui en fait une amélioration inutile pour eux.`],
  'facecaster dfl':[
    `Le FaceCaster DFL est un projecteur porté de déguisement holographique. Employé seul, il modifie l’apparence de surface — visage et vêtements — sans prétendre reconstruire tout le volume du corps.`,
    `Couplé à une Holo’Rmor, il peut participer à une simulation corporelle complète. C’est donc un outil d’apparence et d’infiltration visuelle, pas une transformation physique du porteur.`]
}).map(([k,v])=>[norm(k),v]));

const lifestyle=new Map(Object.entries({
  'eau reconditionnee':[`L’Eau reconditionnée est de l’eau remise en circulation après traitement et purification. Dans une mégapole qui recycle massivement ses flux, c’est la boisson utilitaire par excellence : sûre, banale et sans prestige.`,`Elle appartient au quotidien le plus élémentaire de la Grande Californie. Sa valeur sociale vient précisément de son absence de rareté : on la boit pour s’hydrater, pas pour afficher un goût ou un statut.`],
  'soda':[`Le Soda est la boisson sucrée industrielle de masse : facile à produire, à parfumer et à distribuer partout où un distributeur ou un comptoir fonctionne.`,`C’est un produit de consommation immédiate, associé aux repas rapides, aux lieux de passage et aux loisirs ordinaires. Il n’a rien d’un produit rare ou statutaire.`],
  "biere fermentation d algues":[`La bière issue de fermentation d’algues transforme une biomasse abondante en boisson populaire. Elle remplit le rôle social de la bière traditionnelle sans dépendre des mêmes cultures agricoles.`,`On la rencontre comme alcool courant dans les bars et repas modestes : son origine algale relève du quotidien de 2035 bien plus que de l’exotisme gastronomique.`],
  'alcool industriel':[`L’Alcool industriel désigne les alcools de grande série produits et assemblés par procédés industriels, puis aromatisés ou dilués pour la consommation.`,`La qualité peut varier fortement d’un produit à l’autre. Ce qui les réunit est une disponibilité facile et une production détachée des filières agricoles traditionnelles.`],
  'alcool traditionnel':[`L’Alcool traditionnel provient encore de filières de fermentation ou de distillation agricoles classiques. Dans la Grande Californie de 2035, cette origine suffit à le distinguer des alcools industriels de masse.`,`Selon le cru, la provenance et l’authenticité, il peut aller du produit simplement recherché à la bouteille de prestige. Ici, le procédé et la matière première comptent autant que l’ivresse.`],
  'cafe synthetique':[`Le Café synthétique imite le profil stimulant et aromatique du café sans dépendre de grains cultivés. C’est la solution quotidienne lorsque l’on veut l’usage du café plutôt que son authenticité.`,`Il accompagne bureaux, trajets et nuits de travail comme un consommable banal. La différence avec les cafés plus chers tient surtout à l’origine et au rendu sensoriel, pas à la fonction de base.`],
  'cafe clone cellulaire':[`Le Café clone ou cellulaire est produit à partir de matière cultivée en environnement contrôlé afin de reproduire plus fidèlement le goût et la chimie du café.`,`Il occupe le milieu du marché : plus proche du produit agricole réel qu’une imitation synthétique, mais sans exiger les plantations et chaînes d’approvisionnement d’un vrai grain.`],
  'vrai cafe':[`Le Vrai café est préparé à partir de grains réellement cultivés. Cette origine agricole en fait un produit rare et recherché dans un monde où synthèse et culture cellulaire couvrent l’essentiel de la demande.`,`Le boire tient autant de la dégustation que du signe de statut. Provenance, fraîcheur et méthode de préparation deviennent des sujets que le café synthétique n’a jamais eu besoin de résoudre.`],
  'media holonet reseaux':[`Les médias Holonet et réseaux constituent la couche ordinaire d’information, de divertissement et de sociabilité numérique. L’accès de base peut être gratuit tandis que certains services, flux ou fonctions passent par abonnement.`,`Pour beaucoup d’habitants, cette couche numérique accompagne la journée en continu : actualité, communautés, vidéo, musique et services personnels partagent le même espace connecté.`],
  'bar club sortie populaire':[`Une sortie populaire en bar ou en club correspond à la vie nocturne ordinaire de la mégapole : boire, danser, rencontrer du monde ou simplement rester dans un lieu animé.`,`Le niveau reste accessible sans infrastructure d’exception. Quartier, programmation et sécurité peuvent changer l’ambiance, mais on reste dans le loisir urbain courant plutôt que dans l’événement exclusif.`],
  'concert spectacle sport':[`Concerts, spectacles et rencontres sportives sont des loisirs physiques et collectifs qui conservent leur valeur précisément parce qu’ils réunissent un public réel dans un lieu réel.`,`Le billet paie autant l’accès à l’événement que la place, la visibilité et parfois les services associés. L’expérience se distingue des flux Holonet par sa présence et sa temporalité.`],
  'immersion experience premium':[`Une immersion premium vend une expérience sensorielle ou interactive plus poussée qu’un média Holonet ordinaire. Le client paie la qualité de la simulation, l’encadrement et un environnement conçu autour de l’expérience.`,`Ces offres occupent le segment où le loisir devient prestation spécialisée : on ne regarde plus seulement un contenu, on achète un moment construit pour donner l’impression d’y être.`],
  'evenement luxe vip':[`Un événement luxe ou VIP ajoute au spectacle une couche d’accès contrôlé : espace réservé, service dédié, proximité avec les invités ou filtrage social.`,`La prestation sert autant à être vu au bon endroit qu’à profiter de l’événement lui-même. C’est un loisir où le statut et l’exclusivité font partie du produit.`],
  'compagnie sociale courte':[`La Compagnie sociale courte est une prestation de présence : accompagnement à un verre, une sortie, un événement ou une conversation, sans impliquer par défaut de relation intime.`,`Elle répond au besoin d’avoir un partenaire social disponible et professionnel pour une durée limitée. Le service se situe entre hôte, accompagnateur et présence rémunérée selon le cadre choisi.`],
  'compagnie intime prostitution legale':[`La compagnie intime légale relève d’un service adulte réglementé où la prestation peut inclure une relation sexuelle consentie. Elle se distingue de la simple compagnie sociale par la nature explicite du contrat.`,`Comme tout service légal de ce type, lieu, sécurité, durée et intermédiaire peuvent changer fortement les conditions. Le tarif n’est donc qu’un repère, pas une description de l’expérience.`],
  'metro tram':[`Métro et tram forment l’ossature de transport collectif des déplacements urbains ordinaires. Ils servent les trajets courts et réguliers sans exiger véhicule personnel ni réservation complexe.`,`Leur logique est celle du réseau : fréquence, correspondances et densité des stations comptent davantage que le confort individuel. Pour les budgets serrés, le paiement au trajet reste la porte d’entrée de la mobilité motorisée.`],
  'pass metro tram':[`Le Pass métro/tram transforme les transports collectifs en accès mensuel plutôt qu’en succession de tickets. Il vise ceux qui utilisent le réseau assez souvent pour que le trajet unitaire n’ait plus de sens.`,`Dans un budget personnel, c’est une dépense récurrente de mobilité : le personnage achète la continuité d’accès au réseau, pas un véhicule ni un nombre précis de kilomètres.`],
  'mas court trajet':[`Un MAS de court trajet est un service de mobilité à la demande pour traverser rapidement une portion de ville. Les MAS remplacent largement bus, cars et taxis : le client paie le déplacement et ne pilote pas lui-même.`,`Cette formule sert aux courses urbaines ponctuelles que le métro ou la marche couvrent mal. Elle évite la possession d’un véhicule et reporte conduite, navigation et entretien sur le service.`],
  'mas trajet long urbain':[`Le MAS longue distance urbaine applique la même logique de transport à la demande à un trajet plus important dans la mégapole. Le passager choisit une destination ; il n’a pas à conduire le véhicule de service.`,`Il remplace une grande partie de ce que taxis et cars assuraient autrefois. On paie la disponibilité du déplacement, sans supporter achat, stationnement ou maintenance d’un véhicule personnel.`],
  'bull basic':[`Bull Basic est l’entrée de gamme des abonnements Bull, une solution de mobilité urbaine récurrente plutôt qu’un achat de véhicule. La formule se situe au niveau des solutions courantes d’un Train de vie Standard.`,`Elle convient à quelqu’un qui veut pouvoir compter régulièrement sur un service de déplacement sans financer ni entretenir sa propre voiture. L’abonnement devient alors une charge mensuelle de mobilité.`],
  'bull standard':[`Bull Standard est la formule courante de l’abonnement de mobilité Bull. Comme Basic, elle appartient aux solutions typiques d’un Train de vie Standard, avec un engagement mensuel plutôt qu’un véhicule possédé.`,`Le service achète surtout de la disponibilité et de la simplicité de déplacement. Le client reste passager d’une infrastructure de mobilité au lieu de gérer assurance, stationnement et maintenance d’un véhicule personnel.`],
  'bull premium':[`Bull Premium place l’abonnement de mobilité dans le registre Confortable. Il s’adresse à ceux qui veulent faire du service leur solution régulière sans passer par la possession d’un véhicule haut de gamme.`,`Le supplément paie une offre de mobilité située au-dessus des formules Basic et Standard. Dans le Train de vie, c’est une solution crédible au même niveau qu’un VAP familial ou une moto haut de gamme.`],
  'bull executive':[`Bull Executive est la formule haute de la gamme d’abonnements Bull et fait partie des solutions de mobilité plausibles d’un Train de vie Aisé.`,`À ce niveau, l’abonnement fonctionne comme un service premium permanent plutôt que comme une dépense ponctuelle de transport. Il concurrence directement les autres choix de mobilité haut de gamme sans donner pour autant la propriété d’un véhicule.`]
}).map(([k,v])=>[norm(k),v]));

function neuroLore(page,source){
  const parts=clean(source.meta).split(/\s*•\s*/).filter(Boolean),maker=parts[0]||'',role=parts[1]||'Neuroprogramme';
  const key=norm(page.title);
  if(key==='2 fence')return {grounding:'neuro-book',source:source.section,paragraphs:[
    `2-Fence, signé Aces, se manifeste sous la forme de deux agents humanoïdes qui interceptent successivement les attaques. Tant qu’au moins l’un d’eux reste disponible, le programme soutient activement la défense du Neurodiver.`,
    `Après une Défense active ratée, une Interception peut être sacrifiée pour annuler entièrement les dégâts de la Neuroattaque ; l’opération peut se produire deux fois. Une fois les deux agents dépensés, la défense reste possible mais perd son bonus, et leur restauration exige environ dix minutes de réinitialisation sûre hors pression.`]};
  const detail=source.details||[];
  let p2='';
  if(detail.length<=2)p2=detail.join(' ');
  else if(/defensif/.test(norm(role)))p2=detail.filter(x=>!/permet une defense/i.test(x)).slice(0,3).join(' ');
  else if(/offensif/.test(norm(role)))p2=detail.filter(x=>!/permet une neuroattaque/i.test(x)).slice(0,3).join(' ');
  else p2=detail.slice(0,3).join(' ');
  if(!p2)p2='Le programme n’ajoute pas une fonction universelle : il reste spécialisé dans le rôle décrit par son agent et son environnement d’emploi.';
  const p1=`${page.title} est un neuroprogramme ${lowerFirst(role)} de ${maker}. ${finish(source.flavor)}`;
  return {grounding:'neuro-book',source:source.section,paragraphs:[p1,finish(p2)]};
}
function familyIntro(page,category){
  const s=norm(`${category} ${page.title}`);
  if(/munition/.test(s))return `${page.title} est un consommable d’armement : son intérêt tient à la manière dont il modifie ou alimente le tir, pas à un usage autonome.`;
  if(/grenade/.test(s))return `${page.title} est une munition de zone conçue pour produire son effet dans un volume plutôt que sur un point unique.`;
  if(/armure|protection|gilet|casque|blindage/.test(s))return `${page.title} est une protection portée destinée à interposer une couche matérielle ou spécialisée entre le porteur et une menace réelle.`;
  if(/medical|medkit|soin|trauma|chirurg|pharma/.test(s))return `${page.title} est un outil de soin ou de médecine de terrain destiné à traiter un problème concret avant qu’il ne s’aggrave.`;
  if(/camera|caméra|capteur|scanner|surveillance|alarme/.test(s))return `${page.title} est un dispositif de détection ou de surveillance : il sert d’abord à obtenir une information exploitable sur l’environnement.`;
  if(/outil|kit|atelier|maintenance|reparation|réparation/.test(s))return `${page.title} est un équipement technique de terrain conçu pour permettre une intervention, une maintenance ou une préparation qui serait difficile à improviser.`;
  if(/application|holonet|logiciel|terminal|ordinateur|tablette|radio|comm/.test(s))return `${page.title} est un service ou outil numérique de la vie connectée, pensé pour agir sur l’information, les communications ou les services Holonet.`;
  if(/drogue|n sta|stim|dose|pharma/.test(s))return `${page.title} est un produit pharmacologique dont l’intérêt vient de son effet physiologique immédiat et des risques qui l’accompagnent.`;
  if(/service|abonnement|assurance|loyer|logement|planque|hotel|hôtel/.test(s))return `${page.title} est une prestation plutôt qu’un objet : ce que l’on achète est un accès, un lieu ou une continuité de service.`;
  if(/vehicule|voiture|moto|citypod|nymph|vap/.test(s))return `${page.title} est une solution de mobilité terrestre dont la valeur pratique dépend de son autonomie, de sa capacité et de son intégration aux réseaux de transport.`;
  return `${page.title} est un bien de Réalité dont l’usage est défini par sa fonction concrète plutôt que par son seul prix de catalogue.`;
}
function semanticEffect(effect){
  const e=clean(effect),n=norm(e);if(!e)return '';
  if(/perception.*entendre|localiser.*tir/.test(n))return `Il réduit surtout la signature acoustique et la facilité de localisation, sans supprimer physiquement le bruit produit.`;
  if(/viser.*longue portee/.test(n))return `Il est conçu pour les tirs préparés à longue distance, où l’optique aide à conserver une solution de visée au-delà de la portée confortable.`;
  if(/50.*capacite/.test(n))return `Il augmente sensiblement la réserve avant rechargement, au prix d’un volume plus difficile à dissimuler.`;
  if(/stationnaire|appuye/.test(n))return `Il devient utile dès que l’utilisateur peut prendre appui : le dispositif reporte le poids et stabilise un matériel autrement pénible à tenir.`;
  if(/smartlink|verrouillage/.test(n))return `Il établit une liaison de ciblage avec une interface compatible afin de suivre une cible et maintenir un Verrouillage.`;
  if(/apparence|holo|visage|vetement/.test(n))return `Il agit sur l’apparence perçue plutôt que sur le corps lui-même, ce qui le place du côté du déguisement et de la tromperie visuelle.`;
  return `En pratique, ${lowerFirst(finish(e))}`;
}
function genericEquipmentLore(page){
  const rows=rowsOf(page),category=categoryOf(page,rows),effect=effectOf(rows),facts=factsOf(rows);
  const intro=familyIntro(page,category),effectText=semanticEffect(effect),useful=facts.filter(([l])=>!isMeta(l)).slice(0,3);
  let p2=effectText;
  if(useful.length){const rendered=useful.map(([l,v])=>`${lowerFirst(l)} ${v}`);const fact=`Les éléments qui le distinguent sont ${rendered.join(', ')}.`;p2=p2?`${p2} ${fact}`:fact;}
  if(!p2)p2=`Son usage reste celui suggéré par sa désignation et son environnement d’emploi ; aucune fonction supplémentaire n’est introduite au-delà des données établies.`;
  return {grounding:'derived',source:'Catalogue Réalité',paragraphs:[intro,p2]};
}
function augmentationNature(page,category){
  const s=norm(`${page.title} ${category}`);
  if(/cyberbras/.test(s))return `un remplacement cybernétique du bras, conçu comme support mécanique et plateforme de modules`;
  if(/cybermain/.test(s))return `un remplacement limité à la main, moins invasif qu’un cyberbras complet et doté de moins d’espace interne`;
  if(/pistolet de bras/.test(s))return `une arme intégrée directement à un cyberbras, pensée pour être disponible sans dégainer une arme externe`;
  if(/lame retractable/.test(s))return `une lame intégrée à un membre cybernétique, escamotée tant qu’elle n’est pas déployée`;
  if(/monofilament/.test(s))return `un système monofilament implanté, conçu pour fournir une arme de contact extrêmement coupante sans port externe`;
  if(/oeil|œil|optique|retine|rétine|vision/.test(s))return `une augmentation cyberoptique qui remplace ou complète la vision biologique par des capteurs intégrés`;
  if(/audio|oreille|auditif|sonar/.test(s))return `une augmentation auditive qui traite le son directement au niveau de l’implant plutôt qu’avec un appareil externe`;
  if(/derm|peau|sous cutan|blindage|armure/.test(s))return `une modification dermique ou sous-cutanée qui transforme directement la surface protectrice du corps`;
  if(/coeur|cœur|poumon|rein|foie|organe|interne|metabol|métabol/.test(s))return `une augmentation interne qui modifie un organe ou une fonction physiologique plutôt que l’apparence extérieure`;
  if(/neural|neur|memoire|mémoire|reflex|réflex|cerveau/.test(s))return `une augmentation neurale placée au plus près des circuits de perception, de mémoire ou de décision`;
  if(/bio|gene|gène|genet|génét/.test(s))return `une modification biogénétique qui agit sur les tissus vivants plutôt que d’ajouter une pièce mécanique visible`;
  return `une augmentation corporelle destinée à remplacer, renforcer ou étendre une fonction biologique précise`;
}
function augmentationLore(page){
  const sections=(page.sections||[]).filter(s=>s.id!=='contexte'),rows=sections.flatMap(s=>(s.blocks||[]).filter(b=>b.type==='table').flatMap(b=>b.rows||[]));
  const category=clean(page.catalog?.categories?.join(' · ')||page.catalog?.category||'Augmentations'),nature=augmentationNature(page,category);
  const effects=[...new Set(sections.map(s=>effectOf((s.blocks||[]).filter(b=>b.type==='table').flatMap(b=>b.rows||[]))).filter(Boolean))];
  const generations=[...new Set((page.catalog?.generations||[]).map(Number).filter(Number.isFinite))].sort((a,b)=>a-b);
  let p1=`${page.title} est ${nature}.`,p2='';
  if(effects.length===1)p2=semanticEffect(effects[0]);
  else if(effects.length>1)p2=`Ses versions ne sont pas de simples finitions : elles modifient réellement la fonction disponible. ${effects.slice(0,2).map(semanticEffect).join(' ')}`;
  if(generations.length>1)p1+=` Les générations présentes montrent l’évolution d’une même fonction entre une implantation plus ancienne et une intégration plus récente.`;
  else if(generations.length===1)p1+=` La version retenue appartient à la génération ${generations[0]} de cette technologie.`;
  if(!p2)p2=`La pose doit être pensée autour de sa fonction et de son support anatomique ; elle n’est pas traitée comme un simple accessoire que l’on enlève une fois installé.`;
  return {grounding:'augmentation',source:'Réalité V8 — Augmentations terrestres',paragraphs:[p1,p2]};
}
function equipmentLore(page){
  const key=norm(page.title);
  const neuroHit=neuroBook[page.title]||Object.entries(neuroBook).find(([title])=>norm(title)===key)?.[1];if(neuroHit)return neuroLore(page,neuroHit);
  if(curated.has(key))return {grounding:'curated',source:'Réalité V8',paragraphs:curated.get(key)};
  if(lifestyle.has(key))return {grounding:'book-context',source:'Réalité V8',paragraphs:lifestyle.get(key)};
  const sparseHit=sparseBook[page.title]||Object.entries(sparseBook).find(([title])=>norm(title)===key)?.[1];
  if(sparseHit&&/arme/i.test(sparseHit.section||''))return weaponBookLore(page,sparseHit);
  return genericEquipmentLore(page);
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
let total=0,bookCount=0,neuroCount=0,derivedCount=0,augCount=0;const samples={};
for(const id of DATASETS){
  const spec=manifest.datasets.find(x=>x.id===id);if(!spec)throw new Error(`Dataset ${id} absent du manifeste`);
  const pages=loadDataset(spec);
  for(const page of pages){
    const result=id==='equipement'?equipmentLore(page):augmentationLore(page);
    if(result.paragraphs.length!==2||result.paragraphs.some(t=>clean(t).length<70))throw new Error(`${page.title}: lore V3 insuffisant`);
    replaceContext(page,result);
    if(result.grounding==='neuro-book')neuroCount++;else if(result.grounding==='derived')derivedCount++;else if(result.grounding==='augmentation')augCount++;else bookCount++;
    if(['Bastion','Bande Bastion','2-Fence','Silencieux','Vrai cafe','Bull Executive'].includes(page.title))samples[page.title]=result.paragraphs;
  }
  writeDataset(spec,pages);total+=pages.length;
  console.log(`Lore Réalité V3 — ${id}: ${pages.length} pages · SHA ${spec.sha256}`);
}
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
for(const [title,p] of Object.entries(samples))console.log(`V3 SAMPLE ${title} — ${p.join(' || ')}`);
console.log(`Lore Réalité V3 — ${total} pages · ${bookCount} book/curated · ${neuroCount} neuro · ${derivedCount} derived · ${augCount} augmentations.`);
