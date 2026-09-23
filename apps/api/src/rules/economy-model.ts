// Pure calculation shared by the browser and campaign effects on the server.
type EconomyItem={id:string;price:number|null;priceMin:number|null;vehicle:boolean};
type EconomyPurchase={itemId:string;selectedPrice?:number;acquiredInCampaign?:boolean};
type EconomyPackage={equipment:EconomyItem[];augmentations:EconomyItem[];economy:{unusedEnvelopeRefundRate:number}};
type EconomyState={equipment:EconomyPurchase[];augmentations:EconomyPurchase[]};
type EconomyStyle={account:number;augmentationEnvelope:number;vehicleCapital:number;gen2SlotsBase:number};
export function purchasePrice(purchase:EconomyPurchase,item:EconomyItem|null){
  if(!item)return 0;
  const selected=Number(purchase.selectedPrice);
  if(Number.isFinite(selected)&&selected>=0)return selected;
  if(item.price!==null)return item.price;
  if(item.priceMin!==null)return item.priceMin;
  return 0;
}

export function realityEconomic(
  pkg:EconomyPackage,
  state:EconomyState,
  style:EconomyStyle,
  edge:Record<string,number>
){
  const items=new Map([...pkg.equipment,...pkg.augmentations].map(item=>[item.id,item]));
  const augSpend=state.augmentations
    .filter(p=>!p.acquiredInCampaign)
    .reduce((sum,p)=>sum+purchasePrice(p,items.get(p.itemId)??null),0);
  const equipmentRows=state.equipment
    .filter(p=>!p.acquiredInCampaign)
    .map(p=>({p,item:items.get(p.itemId)??null}));
  const equipSpend=equipmentRows
    .filter(row=>!row.item?.vehicle)
    .reduce((sum,row)=>sum+purchasePrice(row.p,row.item),0);
  const vehSpend=equipmentRows
    .filter(row=>row.item?.vehicle)
    .reduce((sum,row)=>sum+purchasePrice(row.p,row.item),0);

  const envelope=style.augmentationEnvelope+Number(edge.augmentationPacks||0)*5000;
  const vehicleCapital=style.vehicleCapital||0;
  const augOverflow=Math.max(0,augSpend-envelope);
  const augUnused=Math.max(0,envelope-augSpend);
  const vehOverflow=Math.max(0,vehSpend-vehicleCapital);
  const vehUnused=Math.max(0,vehicleCapital-vehSpend);
  const startAccount=style.account+Number(edge.cashPacks||0)*5000;
  const refund=pkg.economy.unusedEnvelopeRefundRate;
  const account=startAccount-equipSpend-augOverflow-vehOverflow+augUnused*refund+vehUnused*refund;

  return {
    account,startAccount,envelope,vehicleCapital,
    gen2:(style.gen2SlotsBase||0)+Number(edge.augmentationPacks||0),
    augUnused,vehUnused,augOverflow,vehOverflow,augSpend,equipSpend,vehSpend
  };
}

