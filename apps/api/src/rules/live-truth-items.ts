/** Explicit weapon profiles from TruthEquipment v6 and the author-approved AIDH additions. */
export type TruthWeaponVector='melee'|'balistique'|'antichoc'|'feu'|'electricite';
export type TruthItemWeapon={id:string;sourceId:string;label:string;damage:number;penetration:number;range:string;attackMode:'melee'|'ranged';attackSkill:'melee'|'tir';damageType:TruthWeaponVector|null;group:string;requiresAdjudication:boolean;notes:string;mode?:string;modeChangeCost?:number;realityAlias?:string};
type Row=[sourceId:string,label:string,damage:number,penetration:number,range:string,attackMode:'melee'|'ranged',damageType:TruthWeaponVector|null,notes?:string,mode?:string,modeChangeCost?:number,realityAlias?:string];
const rows:Row[]=[
 ['verite-23-phoenix-pck-08-feather','Phoenix PCK-08 « Feather »',4,1,'Contact','melee','melee','Chaleur/cautérisation à arbitrer ; aucun feu persistant automatique.',undefined,undefined,'armes-melee-phoenix-pck-08-feather'],
 ['verite-23-phoenix-ba-037-sun-axe','Phoenix BA-037 « Sun Axe »',7,1,'Contact','melee','melee','Chaleur/cautérisation à arbitrer.',undefined,undefined,'armes-melee-phoenix-ba-037-sun-axe'],
 ['verite-23-raven-cl-038-claymore','Raven CL-038 « Claymore »',8,0,'Contact','melee','melee','EMP sur système réellement exposé, jamais une attaque mentale.',undefined,undefined,'armes-melee-raven-cl-038-claymore'],
 ['verite-23-raven-sp-016-raven-spear','Raven SP-016 « Raven Spear »',6,1,'1,5 m','melee','melee','Allonge de mêlée ; EMP conditionnel.',undefined,undefined,'armes-melee-raven-sp-016-raven-spear'],
 ['verite-23-phoenix-pw-026-vampire-killer','Phoenix PW-026 « Vampire Killer »',7,1,'3,5 m','melee','melee','Nom commercial sans propriété anti-Vampire ; chaleur à arbitrer.',undefined,undefined,'armes-melee-phoenix-pw-026-vampire-killer'],
 ['verite-23-raven-mc-025-hitman','Raven MC-025 « Hitman »',5,2,'1,5 m','melee','melee','Allonge de mêlée.',undefined,undefined,'armes-melee-raven-mc-025-hitman'],
 ['verite-23-owl-lc-014-chasseur','Owl LC-014 « Chasseur »',7,1,'25 m','ranged','balistique','Arbalète, Tir ; un carreau par tir.',undefined,undefined,'armes-melee-owl-lc-014-chasseur'],
 ['verite-23-raven-ht-014-immobilisateur','Raven HT-014 « Immobilisateur »',6,0,'15 m','ranged','electricite','Taser lourd ; conséquences de neutralisation à arbitrer.',undefined,undefined,'armes-poing-tasers-raven-ht-014-immobilisateur'],
 ['verite-24-marteau-de-scellement','Marteau de Scellement',7,0,'Contact','melee','melee','Scellement séparé : 1 PA, difficulté18, scène ; support destructible.'],
 ['verite-24-jadehook','Jadehook',6,0,'35 m','ranged','balistique','Charges runiques séparées et consommées ; aucun DGT additionnel implicite.'],
 ['verite-24-black-nail','Black Nail',4,0,'Contact','melee','melee','Biphysique, mais ne détecte pas une cible immatérielle et ne traverse pas une Protection spirituelle.'],
 ['verite-24-epee-nibelungen-runique-ready','Épée nibelungen runique-ready',6,0,'Contact','melee','melee','Support de plaque runique, sans rune gratuite.'],
 ['verite-24-hache-de-clan-runique-ready','Hache de clan runique-ready',7,0,'Contact','melee','melee','Support de plaque runique.'],
 ['verite-25-pistolet-laser','Pistolet laser',5,0,'25 m','ranged',null,'Vecteur Laser à arbitrer, réserve100 ; aucune assimilation automatique à Balistique.'],
 ['verite-25-pistolet-laser-lourd','Pistolet laser lourd',6,0,'25 m','ranged',null,'Vecteur Laser à arbitrer, réserve75.'],
 ['verite-25-fusil-laser','Fusil laser',7,0,'80 m','ranged',null,'Vecteur Laser à arbitrer, réserve1000.'],
 ['verite-25-fusil-laser-de-precision','Fusil laser de précision',8,0,'250 m','ranged',null,'Vecteur Laser à arbitrer, optique intégrée, réserve50.'],
 ['verite-25-pistolet-a-ions','Pistolet à ions',4,0,'20 m','ranged',null,'Ion/EMP : vecteur et système exposé à arbitrer, réserve75.'],
 ['verite-25-fusil-a-ions','Fusil à ions',6,0,'60 m','ranged',null,'Ion/EMP : vecteur à arbitrer, réserve25.'],
 ['verite-25-pistolet-a-plasma','Pistolet à plasma',7,0,'25 m','ranged',null,'Plasma, Incendiaire, Surchauffe ; famille de réduction à arbitrer, réserve50.'],
 ['verite-25-fusil-a-plasma','Fusil à plasma',9,1,'70 m','ranged',null,'Plasma, Incendiaire, Surchauffe ; vecteur à arbitrer, réserve100.'],
 ['verite-25-sniper-plasma','Sniper plasma',9,2,'200 m','ranged',null,'Plasma, Incendiaire, Surchauffe ; vecteur à arbitrer, réserve50.'],
 ['verite-25-grenade-plasma','Grenade plasma',10,0,'Lancer','ranged',null,'Zone4m : plusieurs Défenses individuelles ; Incendiaire, consommable.'],
 ['verite-25-fusil-projectile-galactique','Fusil projectile galactique',7,1,'90 m','ranged','balistique','Réserve10 ; Fiable selon fiction.'],
 ['verite-25-sniper-projectile-galactique','Sniper projectile galactique',9,1,'250 m','ranged','balistique','Réserve10.'],
 ['verite-25-blaster-atomus','Blaster Atomus · rafale',7,0,'70 m','ranged',null,'Mode rafale, suppression compatible ; générateur/vector à arbitrer.','rafale',0],
 ['verite-25-blaster-atomus','Blaster Atomus · concentré',9,1,'90 m','ranged',null,'Tir unitaire, changement gratuit 1/activation ; vérifier morphologie.','concentre',0],
 ['verite-25-karpan-trius','Karpan Trius',5,0,'25 m','ranged','balistique','Projectile, boîtier blindé ; ne fournit aucun bonus de Furtivité automatique.'],
 ['verite-25-vultar-trius','Vultar Trius',5,0,'50 m','ranged',null,'EMP et automatique : système/vector à arbitrer.'],
 ['verite-25-lantarksan-trius','Lantarksan Trius',7,0,'70 m','ranged',null,'EMP, étanche : système/vector à arbitrer.'],
 ['verite-25-go-02','GO-02',6,0,'60 m','ranged',null,'Laser + EMP, auto-alimenté : vecteur à arbitrer, aucune munition conventionnelle.'],
 ['verite-25-pistolet-plasma-serys','Pistolet plasma Sérys',7,0,'30 m','ranged',null,'Plasma Incendiaire/Surchauffe : vecteur à arbitrer.'],
 ['verite-25-fusil-plasma-serys','Fusil plasma Sérys',9,1,'90 m','ranged',null,'Plasma Incendiaire/Surchauffe : vecteur à arbitrer.'],
 ['verite-25-repetiteur-serys','Répétiteur Sérys',8,0,'70 m','ranged',null,'Plasma automatique/Surchauffe : vecteur à arbitrer.'],
 ['verite-25-sniper-serys','Sniper Sérys',10,2,'250 m','ranged',null,'Plasma, optique thermique/mouvement : vecteur à arbitrer.'],
 ['verite-25-mitrailleuse-serys','Mitrailleuse Sérys',10,1,'80 m','ranged',null,'Plasma automatique/Surchauffe : vecteur à arbitrer.'],
 ['verite-25-lance-plasma-serys','Lance-plasma Sérys',9,0,'20 m','ranged',null,'Zone conique/Incendiaire/Surchauffe : vecteur et cibles à arbitrer.'],
 ['verite-25-lance-roquette-serys','Lance-roquette Sérys',12,2,'120 m','ranged',null,'Zone5m et Incendiaire : vecteur/cibles à arbitrer.'],
 ['verite-25-sellecion-12','Sellecion 12',10,1,'140 m','ranged',null,'Laser ; ergonomie étrangère −3 sans adaptation ou Vigueur4+, à confirmer.'],
 ['verite-25-tk-x','TK X',8,0,'70 m','ranged',null,'EMP, très lourd ; échec narratif exige2PA remise en place, vecteur à arbitrer.'],
 ['verite-25-tanax-alpha','Tanax Alpha · cinétique',7,0,'60 m','ranged','balistique','Mode cinétique ; ondes modulables/morphologie à valider.','cinetique'],
 ['verite-25-tanax-alpha','Tanax Alpha · perturbation',5,0,'60 m','ranged',null,'EMP, altération capteurs/mobilité sur drone/robot : vecteur à arbitrer.','perturbation'],
 ['verite-25-pistolet-aidh-2e-generation','Pistolet AIDH — 2e génération',7,1,'35 m','ranged','balistique','Verrouillé, matière200tirs : autorisation/compatibilité doivent être vérifiées.'],
 ['verite-25-fusil-aidh-1re-generation','Fusil AIDH — 1re génération · automatique',8,0,'80 m','ranged','balistique','Verrouillé, mode automatique ; capteurs ne voient pas sous le Voile.','automatique'],
 ['verite-25-fusil-aidh-1re-generation','Fusil AIDH — 1re génération · perforant',10,2,'70 m','ranged','balistique','Verrouillé, tir unique, mode à déclarer.','perforant'],
 ['verite-25-couteau-de-survie-vibrant','Couteau de survie vibrant',4,1,'Contact','melee','melee','Outil de survie ; Perforant matériel uniquement.'],
 ['verite-25-dague-mono-filament','Dague mono-filament',5,3,'Contact','melee','melee','Lame rétractable ; Perforant matériel uniquement.'],
 ['verite-25-spectrale-s40','Spectrale S40',6,0,'Contact','melee','melee','Occulteur visuel technologique, aucun effet d’âme malgré son nom.'],
 ['verite-25-hache-mono-filament','Hache mono-filament',7,3,'Contact','melee','melee','Perforant matériel uniquement.'],
 ['verite-25-lc-108x','LC-108X',7,0,'Contact','melee','melee','Champ court/EMP sur électronique accessible, pas suppression de Magie.'],
 ['verite-26-defensor','Defensor',14,2,'50 m','ranged','balistique','Verrou nanitique/biométrique requis, matière~1000tirs ; fiabilité mécanique1/scénario à arbitrer.'],
 ['verite-26-praetor-c-14','Praetor C-14',14,1,'70 m','ranged','balistique','Verrou AIDH, déploiement1PA ; automatique/suppression, matière~1500tirs.'],
 ['verite-26-custodian-ar-9','Custodian AR-9 · standard',16,2,'100 m','ranged','balistique','Verrou AIDH, automatique/suppression ; régime conservé.','standard',1],
 ['verite-26-custodian-ar-9','Custodian AR-9 · perforant',17,3,'90 m','ranged','balistique','Verrou AIDH, tir unique, changement 1 PA ; pas de deuxième Altération.','perforant',1],
 ['verite-26-long-watch-sr-6','Long Watch SR-6 · standard',18,3,'400 m','ranged','balistique','Verrou AIDH, réserve100 ; optique ne voit pas une cibleV sous le Voile.','standard'],
 ['verite-26-long-watch-sr-6','Long Watch SR-6 · subsonique',16,3,'250 m','ranged','balistique','Verrou AIDH, régime subsonique et moindre signature à déclarer.','subsonique'],
 ['verite-26-cerberus-hmg-3','Cerberus HMG-3',17,2,'120 m','ranged','balistique','Verrou AIDH, servomotricité/affût/Vigueur adaptée ; automatique lourd, réserve~10000tirs.'],
 ['verite-26-helios-pr-8','Helios PR-8',18,2,'100 m','ranged',null,'Plasma, Incendiaire ; refroidissement après usage intensif jusqu’à prochaine activation ; vecteur à arbitrer.'],
 ['verite-26-prometheus-px-2','Prometheus PX-2',17,0,'25 m','ranged',null,'Plasma, zone conique, Incendiaire/Surchauffe ; vecteur et cibles à arbitrer.'],
 ['verite-26-null-lance-ie-4','Null Lance IE-4 · standard',14,1,'90 m','ranged',null,'Ion/EMP sur électronique exposée ; vecteur à arbitrer.','standard'],
 ['verite-26-null-lance-ie-4','Null Lance IE-4 · faible',8,1,'90 m','ranged',null,'Ion/EMP conservé ; moindre DGT, sans annuler la Magie ; vecteur à arbitrer.','faible'],
 ['verite-26-judicator-rl-5','Judicator RL-5',20,3,'180 m','ranged',null,'Explosion/Zone5m ; guidage par capteur et munitions distinctes ; vecteur/cibles à arbitrer.'],
 ['verite-26-blackstar-gr-1','Blackstar GR-1',18,2,'150 m','ranged',null,'Zone4m + Vigueur/Athlétisme18 après dégâts, sans ignorer l’Armure ; vecteur/cibles à arbitrer.'],
 ['verite-26-ward-m-6','Ward M-6',6,3,'Contact','melee','melee','Prise autorisée / Verrou AIDH ; Perforant matériel.'],
 ['verite-26-breacher-b-9','Breacher B-9',9,3,'Contact','melee','melee','Armure assistée ou puissance suffisante pour le profil complet ; aucune attaque gratuite.'],
 ['verite-26-fulgur-eb-7','Fulgur EB-7',8,3,'Contact','melee','melee','Allumage/extinction 1 PA ; cellule 10 scènes, aucune parade de Tir / Biphysique gratuite.'],
 ['verite-26-duplex-ar-12','Duplex AR-12 · assaut',16,2,'70 m','ranged','balistique','Verrou AIDH, automatique ; régime conservé ; matière 1 500 tirs.','assaut',1],
 ['verite-26-duplex-ar-12','Duplex AR-12 · dispersion',15,1,'20 m','ranged','balistique','Verrou AIDH, tir unique une cible ; changement 1 PA, consomme 3 unités ; aucune zone automatique.','dispersion',1],
 ['verite-27-croc-de-la-faim','Croc de la Faim',4,0,'Contact','melee','melee','Souillure 15 et Corruptif 15 après 1 PV réel ; coût/résistance/quota à arbitrer.'],
 ['verite-27-extracteur-entropique-vhd-4','Extracteur entropique VHD-4',10,0,'50 m','ranged',null,'Dévoration d’énergie, Souillure 18/INSTABLE ; vecteur à arbitrer.'],
 ['verite-27-lame-de-l-interstice','Lame de l’Interstice',5,0,'Contact','melee','melee','1/scène option ignore 3 Armure matérielle, Souillure 18 ; cette option n’est pas un Perforant permanent.'],
 ['verite-27-gantelet-de-fusion-vag-9','Gantelet de Fusion VAG-9',4,0,'Contact','melee','melee','Souillure 18/INSTABLE ; fusion adjacente sur Altération à arbitrer.'],
 ['verite-27-scalpel-du-prisme','Scalpel du Prisme',3,0,'Contact','melee','melee','Souillure 18, coupure de lien Volonté + Maîtrise contre Puissance distincte d’une attaque PV.'],
 ['verite-27-dissecteur-shr-11','Dissecteur SHR-11',11,0,'60 m','ranged',null,'Souillure 18/INSTABLE, composant externe sur Altération ; vecteur à arbitrer.']
];
export const truthWeaponProfiles:readonly TruthItemWeapon[]=rows.map(([sourceId,label,damage,penetration,range,attackMode,damageType,notes='',mode,modeChangeCost,realityAlias])=>({id:'truth:'+sourceId+(mode?':'+mode:''),sourceId,label,damage,penetration,range,attackMode,attackSkill:attackMode==='melee'?'melee':'tir',damageType,group:'Équipement de Vérité',requiresAdjudication:damageType===null,notes,mode,modeChangeCost,realityAlias}));
/** One instance per item/profile; only explicitly saved owned IDs are offered to players. */
export function truthItemWeapons(data:any,all=false):TruthItemWeapon[]{
 const owned=new Set<string>(Array.isArray(data?.truth?.truthEquipment)?data.truth.truthEquipment.filter((x:any):x is string=>typeof x==='string'):[]);
 return truthWeaponProfiles.filter(w=>all||owned.has(w.sourceId)).map(w=>({...w}));
}

/** Material protection only. Possession offers a choice; the GM still arbitrates wear and compatibility. */
export type TruthItemProtection={id:string;sourceId:string;name:string;armor:number;body:number;reductions:Record<string,number>;additive:Record<string,number>;ablation:number;conditional:string|null;text:string};
const armorRows:Array<[sourceId:string,name:string,armor:number,text:string]>=[
 ['verite-24-brigandine-de-garde','Brigandine de Garde',2,'Armure matérielle 2. La Rune de Garde, charge unique de −3 aux premiers dégâts surnaturels du scénario, se traite séparément.'],
 ['verite-24-armure-de-clan','Armure de clan',4,'Armure matérielle 4. Les plaques prévues pour Rune de Garde ne donnent aucune rune gratuite.'],
 ['verite-24-manteau-de-jade','Manteau de Jade',2,'Armure matérielle 2. Les poches occultes et supports de consommables ne donnent aucun bonus chiffré implicite.'],
 ['verite-26-farwalker-es-4','Farwalker ES-4',2,'Armure matérielle 2 contre dommages matériels ordinaires. Air, étanchéité et limites environnementales à arbitrer.'],
 ['verite-26-second-skin','Second Skin',4,'Armure matérielle 4. Auto-colmatage de la combinaison seulement ; aucun soin du porteur.'],
 ['verite-26-vesper-recon','Vesper Recon',5,'Armure matérielle 5. Occultation active séparée : 1 PA, circonstance favorable visuelle/thermique conditionnelle, jusqu’à mouvement brutal ou action offensive.'],
 ['verite-26-urgent-matter','Urgent Matter',8,'Armure matérielle 8. Déploiement complet sous pression : 2 PA ; aucun bonus générique d’Agilité/Vigueur ou résistance mentale.'],
 ['verite-26-bastion','Bastion',10,'Armure matérielle 10. Compatibilité plateforme et efforts supportés à arbitrer ; aucun bonus générique de Vigueur.'],
 ['verite-27-carapace-de-couvee','Carapace de Couvée',2,'Armure matérielle 2. Prolifération 1/scène (−2 après Armure) et Souillure 15 physique se traitent séparément.']
];
export const truthProtectionProfiles:readonly TruthItemProtection[]=armorRows.map(([sourceId,name,armor,text])=>({id:'truth:'+sourceId,sourceId,name,armor,body:0,reductions:{},additive:{},ablation:0,conditional:null,text}));
export function truthItemProtections(data:any):TruthItemProtection[]{
 const owned=new Set<string>(Array.isArray(data?.truth?.truthEquipment)?data.truth.truthEquipment.filter((x:any):x is string=>typeof x==='string'):[]);
 return truthProtectionProfiles.filter(p=>owned.has(p.sourceId)).map(p=>({...p,reductions:{...p.reductions},additive:{...p.additive}}));
}
