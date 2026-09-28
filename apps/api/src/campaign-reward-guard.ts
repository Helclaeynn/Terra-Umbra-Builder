import { isDeepStrictEqual } from 'node:util';
import { campaignCharacterState } from './campaign-character.js';
import { getRealityRules, type RealityItem } from './rules/reality.js';
import { purchaseWithTalents, saleWithTalents, loanBudgets } from './rules/reality-talents-policy.js';

type Row = Record<string, unknown>;
type Asset = Row & { uid: string; itemId: string; kind: string };
export type CampaignRewardContext = { base: number; items: readonly RealityItem[] };
const record = (value: unknown): Row =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Row : {};
const array = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const number = (value: unknown, fallback = 0) => value == null ? fallback : Number(value);
const norm = (value: unknown) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const isLoan = (asset: Asset) => Boolean(asset.sphereSupport || asset.talentGrant);

function talentIds(data: Row): Set<string> {
  const talents = record(data.talents), progression = record(data.progression);
  return new Set([
    talents.origin, talents.sphere, talents.expertise, talents.common,
    ...array(talents.edge), ...array(progression.realityTalents)
  ].filter((value): value is string => typeof value === 'string'));
}

function stock(data: Row): Map<string, Asset> {
  const reality = record(data.reality), result = new Map<string, Asset>();
  for (const [list, kind] of [['equipment', 'equipment'], ['augmentations', 'augmentation']] as const) {
    for (const value of array(reality[list])) {
      const asset = record(value);
      if (typeof asset.uid !== 'string' || !asset.uid || typeof asset.itemId !== 'string' ||
          !asset.itemId || result.has(asset.uid) || (asset.kind !== undefined && asset.kind !== kind)) throw new Error('inventory');
      result.set(asset.uid, { ...asset, uid: asset.uid, itemId: asset.itemId, kind });
    }
  }
  return result;
}

/** Gameplay settings (loaded, installed, etc.) are editable; monetary provenance is not. */
function economic(asset: Asset) {
  return {
    uid: asset.uid, itemId: asset.itemId, kind: asset.kind,
    selectedPrice: asset.selectedPrice ?? null, cataloguePrice: asset.cataloguePrice ?? null,
    campaignCatalogPrice: asset.campaignCatalogPrice ?? null,
    acquiredInCampaign: Boolean(asset.acquiredInCampaign),
    sphereSupport: Boolean(asset.sphereSupport), talentGrant: String(asset.talentGrant ?? '')
  };
}

function transaction(value: unknown) {
  const row = record(value);
  return {
    uid: String(row.uid ?? ''), amount: number(row.amount),
    label: String(row.label ?? 'Mouvement d’argent'), type: String(row.type ?? 'manual'),
    at: String(row.at ?? new Date(0).toISOString()), trade: row.trade ?? null
  };
}

function validReference(item: RealityItem, price: number): boolean {
  if (!Number.isFinite(price) || price <= 0 || price > 1e9) return false;
  if (item.price !== null && item.priceMin === item.priceMax) return price === item.price;
  if (item.priceMin !== null && price < item.priceMin) return false;
  if (item.priceMax !== null && price > item.priceMax) return false;
  return item.price !== null || item.priceMin !== null || item.priceMax !== null;
}

function savedReference(asset: Asset, item: RealityItem): number {
  return number(asset.cataloguePrice ?? asset.campaignCatalogPrice ?? asset.selectedPrice ?? item.price ?? item.priceMin);
}

/** Existing free material benefits remain usable, but never create resalable possessions. */
function permittedGrant(asset: Asset, data: Row, all: Map<string, Asset>, catalog: Map<string, RealityItem>): boolean {
  const item = catalog.get(asset.itemId), ids = talentIds(data);
  const sphere = String(record(data.creation).sphere ?? ''), grant = String(asset.talentGrant ?? '');
  if (!item || asset.kind !== 'equipment' || number(asset.selectedPrice) !== 0) return false;
  if (!grant) return Boolean(asset.sphereSupport) && sphere === 'corporatiste' && item.vehicle &&
    record(data.reality).sphereSupportItemId === asset.itemId;
  const spheres: Record<string, string> = {
    dotation_standard: 'corporatiste', dotation_de_service: 'gouvernementale',
    armurier_du_milieu: 'mafieuse', programme_pilote: 'corporatiste', avantages_salaries: 'corporatiste'
  };
  if (!Object.hasOwn(spheres, grant) || !ids.has(grant) || sphere !== spheres[grant]) return false;
  const same = [...all.values()].filter(row => row.talentGrant === grant);
  if (grant === 'avantages_salaries') return item.vehicle && Boolean(asset.sphereSupport) && same.length === 1;
  if (item.vehicle || ['monthly', 'annual', 'per_use'].includes(item.recurring)) return false;
  const price = number(item.price ?? item.priceMin);
  if (price <= 0 || item.priceMin !== item.priceMax) return false;
  if (grant === 'armurier_du_milieu') {
    const text = norm(`${item.category} ${item.sourceCategory} ${item.name}`);
    if (!/arme|pistolet|fusil|carabine|lame|matraque/.test(text) ||
        /munition|cartouche|grenade|explosif/.test(text) || same.length !== 1) return false;
  }
  if (grant === 'programme_pilote' && (same.length !== 1 || !String(asset.loanEffect ?? '').trim())) return false;
  const budget = loanBudgets[grant];
  if (budget !== undefined && same.reduce((sum, row) =>
    sum + number(catalog.get(row.itemId)?.price ?? catalog.get(row.itemId)?.priceMin, Infinity), 0) > budget) return false;
  return true;
}

/**
 * Only call for a SQL row with campaign_id, under its FOR UPDATE lock.
 * No role-based bypass: awards use the actual campaign owner's dedicated routes.
 * Existing cash records are immutable. New sale credits consume owned stock;
 * purchase receipts bind new stock to the debit in the same save transaction.
 * Context injection is for unit tests; callers never read it from request data.
 */
export function campaignRewardViolation(
  before: Row, after: Row, restoring = false, context?: CampaignRewardContext
): string | null {
  try {
    const oldProgress = record(before.progression), nextProgress = record(after.progression);
    const oldTruth = record(before.truth), nextTruth = record(after.truth);
    for (const [key, field] of [['xpEarned', 'xp'], ['ptvEarned', 'ptv'], ['renownAdjustment', 'renown']] as const) {
      if (!Number.isFinite(number(nextProgress[key])) || number(nextProgress[key]) !== number(oldProgress[key])) return field;
    }
    if (!Number.isFinite(number(nextTruth.corruption)) || number(nextTruth.corruption) !== number(oldTruth.corruption) ||
        String(nextTruth.corruptionSource ?? '') !== String(oldTruth.corruptionSource ?? '') ||
        Boolean(nextTruth.corruptionMjAuthorized) !== Boolean(oldTruth.corruptionMjAuthorized)) return 'corruption';
    const base = context?.base ?? campaignCharacterState(before).base;
    if (!Number.isFinite(base) || (nextProgress.cashBase != null && number(nextProgress.cashBase) !== base)) return 'cash_base';
    const old = array(oldProgress.cashTransactions).map(transaction), next = array(nextProgress.cashTransactions).map(transaction);
    if (next.length < old.length || old.some((row, index) => !isDeepStrictEqual(row, next[index]))) return 'cash_history';
    if (restoring && next.length !== old.length) return 'cash_history';
    const original = stock(before), final = stock(after), working = new Map(original), bought = new Set<string>();
    // A biography/build edit needs no equipment catalogue. In particular, an
    // empty/unchanged inventory remains saveable before catalogue preloading.
    // Trades and new loans still require the authoritative catalogue (fail closed).
    const needsCatalog = next.slice(old.length).some(tx => tx.type === 'purchase' || tx.type === 'sale') ||
      [...final.keys()].some(uid => !original.has(uid));
    const items = needsCatalog
      ? context?.items ?? (() => { const rules = getRealityRules(); return [...rules.equipment, ...rules.augmentations]; })()
      : [];
    const catalog = new Map(items.map(item => [item.id, item]));
    const ids = talentIds(after), troc = ids.has('maitre_du_troc');
    let cash = base + old.reduce((sum, row) => sum + row.amount, 0);
    const transactionIds = new Set(old.map(row => row.uid));
    const usedAssetIds = new Set([...original.keys(), ...old.flatMap(row => {
      const trade = record(row.trade); return typeof trade.uid === 'string' ? [trade.uid] : [];
    })]);
    for (const tx of next.slice(old.length)) {
      if (!tx.uid || transactionIds.has(tx.uid) || !Number.isSafeInteger(tx.amount) || Math.abs(tx.amount) > 1e9) return 'cash_transaction';
      transactionIds.add(tx.uid);
      if (tx.type === 'manual' || tx.type === 'expense') {
        if (tx.amount >= 0 || tx.trade !== null) return 'cash_reward';
      } else if (tx.type === 'purchase' || tx.type === 'sale') {
        const trade = record(tx.trade), uid = String(trade.uid ?? ''), degree = number(trade.degree, -1);
        if (!uid || !Number.isInteger(degree) || degree < 0 || degree > 6) return 'trade';
        if (tx.type === 'sale') {
          const asset = working.get(uid), item = asset && catalog.get(asset.itemId);
          if (!asset || !item || isLoan(asset) || final.has(uid)) return 'sale_asset';
          const price = savedReference(asset, item);
          if (!Number.isFinite(price) || price <= 0 || tx.amount !== saleWithTalents(price, .50 + degree * .05, troc)) return 'sale_amount';
          working.delete(uid);
        } else {
          const item = catalog.get(String(trade.itemId ?? '')), price = number(trade.reference), supplier = trade.supplier === true;
          if (!item || usedAssetIds.has(uid) || !validReference(item, price)) return 'purchase_asset';
          if (supplier && (!ids.has('acces_fournisseur') || record(after.creation).sphere !== 'corporatiste' ||
              ['monthly', 'annual', 'per_use'].includes(item.recurring) ||
              /prototype|unique|prestation medicale|operation chirurgicale/.test(norm(`${item.category} ${item.name}`)))) return 'supplier';
          const cost = purchaseWithTalents(price, 1 - degree * .05, troc, supplier);
          if (tx.amount !== -cost) return 'purchase_amount';
          const receipt = final.get(uid);
          if (receipt && (receipt.itemId !== item.id || receipt.kind !== item.kind || isLoan(receipt) || !receipt.acquiredInCampaign ||
              number(receipt.selectedPrice) !== cost || number(receipt.cataloguePrice) !== price ||
              number(receipt.campaignCatalogPrice, price) !== price)) return 'purchase_receipt';
          working.set(uid, receipt ?? { uid, itemId: item.id, kind: item.kind, selectedPrice: cost, cataloguePrice: price, acquiredInCampaign: true });
          bought.add(uid); usedAssetIds.add(uid);
        }
      } else return 'cash_reward';
      cash += tx.amount;
      if (!Number.isFinite(cash) || cash < 0) return 'cash_insufficient';
    }
    for (const [uid, asset] of final) {
      const previous = original.get(uid);
      if (previous) {
        if (!working.has(uid) || !isDeepStrictEqual(economic(previous), economic(asset))) return 'inventory_value';
      } else if (!bought.has(uid) && (restoring || !permittedGrant(asset, after, final, catalog))) return 'inventory_grant';
    }
    // Ordinary removals are discards or returns, never a source of cash.
    // Freeze the copy's baseline so editing its build cannot mint campaign money.
    after.progression = { ...nextProgress, cashBase: base };
    return null;
  } catch {
    return 'invalid_campaign_resources';
  }
}

/** Pin the independent campaign copy only, never its source character. */
export function pinCampaignCash(data: Row): Row {
  const progression = record(data.progression);
  if (progression.cashBase == null) data.progression = { ...progression, cashBase: campaignCharacterState(data).base };
  return data;
}
