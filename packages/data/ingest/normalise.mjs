/* Turns one feed row into one deal in the shape of DealSchema, or says why it
   cannot. Nothing here guesses. A field the feed does not state is null, and
   a deal that would need a guess to render is dropped with a reason the
   weekly summary prints.

   Roaming and the mid-contract price rise are not in the feed at all. They
   come from the hand-verified tables in packages/compliance, keyed by
   network. A deal on a network whose price rise has not been researched yet
   is held back rather than published with a blank, which is hard rule 2. */
import { readFileSync } from 'node:fs';
import { networks } from '../../ui/networks.js';

export const columns = JSON.parse(readFileSync(new URL('./columns.json', import.meta.url), 'utf8'));

/* Network names as advertisers write them, folded to letters and digits, so
   "iD Mobile", "ID mobile" and "id-mobile" all land on idmobile. A name that
   is not here is not guessed: the row is dropped and the name is listed in
   the summary so an alias can be added. */
export const NETWORK_ALIASES = {
  o2: 'o2', three: 'three', 3: 'three', vodafone: 'vodafone', ee: 'ee',
  smarty: 'smarty', voxi: 'voxi', giffgaff: 'giffgaff',
  idmobile: 'idmobile', id: 'idmobile',
  tescomobile: 'tesco', tesco: 'tesco', lebara: 'lebara', lebaramobile: 'lebara',
  talkmobile: 'talkmobile', skymobile: 'sky', sky: 'sky', btmobile: 'bt', bt: 'bt',
  asdamobile: 'asda', asda: 'asda', '1pmobile': 'onep', onepmobile: 'onep',
  spusu: 'spusu', lycamobile: 'lyca', lyca: 'lyca', mozillion: 'mozillion',
  simp: 'simp', simpmobile: 'simp', honestmobile: 'honest', honest: 'honest',
  revolutmobile: 'revolut', revolut: 'revolut', klarnamobile: 'klarna', klarna: 'klarna',
  utilitywarehouse: 'uw', uw: 'uw', uwmobile: 'uw',
  yourcoopmobile: 'coop', coopmobile: 'coop', coop: 'coop', ecotalk: 'ecotalk',
};

export const fold = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

export function networkKey(raw) {
  const key = NETWORK_ALIASES[fold(raw)] ?? null;
  return key && key in networks ? key : null;
}

/* "£12.00", "12" and "12.5" are all money. Anything else is null. */
export function parseMoney(s) {
  const m = String(s ?? '').replace(/[£,\s]/g, '').match(/^\d+(\.\d+)?$/);
  return m ? Math.round(Number(m[0]) * 100) / 100 : null;
}

/* Allowances. Data comes back in GB, minutes and texts as a count. A bare
   number in the data column is read as GB, which is how Awin telco feeds
   state it; the summary counts how often that reading was needed so it can
   be checked against the first real pull. */
export function parseAllowance(s, kind) {
  const t = String(s ?? '').trim();
  if (!t) return { value: null, assumed: false };
  if (/unlimited|unltd|^inf/i.test(t)) return { value: 'unlimited', assumed: false };
  const m = t.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(tb|gb|mb)?/i);
  if (!m) return { value: null, assumed: false };
  const n = Number(m[1]);
  if (kind !== 'data') return { value: Math.round(n), assumed: false };
  const unit = (m[2] ?? '').toLowerCase();
  if (unit === 'tb') return { value: n * 1000, assumed: false };
  if (unit === 'mb') return { value: Math.round(n / 10) / 100, assumed: false };
  return { value: n, assumed: unit === '' };
}

/* Contract length in months. Rolling, 30 day and one month plans are all a
   term of 1, which is what the card treats as rolling. */
export function parseTerm(s) {
  const t = String(s ?? '').trim().toLowerCase();
  if (!t) return null;
  if (/rolling|no contract|monthly|\b1\s*-?\s*month/.test(t)) return 1;
  const days = t.match(/(\d+)\s*-?\s*days?/);
  if (days) return Number(days[1]) <= 31 ? 1 : Math.round(Number(days[1]) / 30);
  const m = t.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

export function isSimOnly(v) {
  const type = v('contractType');
  if (/sim/i.test(type)) return true;
  if (/handset|phone|device|contract/i.test(type)) return false;
  if (/sim[\s-]?only/i.test(v('name')) || /sim[\s-]?only/i.test(v('tariff'))) return true;
  if (v('storageGB') || v('brand')) return false;
  return null;
}

const toISODate = (s, fallback) => {
  const d = new Date(String(s ?? '').trim());
  return Number.isNaN(d.getTime()) ? fallback : d.toISOString().slice(0, 10);
};

/* The rise a deal carries, from the network's verified entry. A phone deal
   uses the handset variant where the network states one (null there means
   not verified for phone plans). A fixed rise that varies by plan size is
   picked from the tiers by the deal's data allowance. Null means hold. */
export function resolvePriceRise(entry, { site, data }) {
  if (!entry || entry.evidence === 'unverified' || !entry.type) return null;
  let r = entry;
  if (site === 'phones' && 'handset' in entry) {
    if (!entry.handset || !entry.handset.type) return null;
    r = entry.handset;
  }
  let amountGBP = r.amountGBP ?? null;
  if (r.type === 'fixed' && amountGBP === null) {
    if (!r.tiers?.length) return null;
    const gb = data === 'unlimited' ? Infinity : data;
    const tier = r.tiers.find((t) => t.maxGB === null || gb <= t.maxGB);
    if (!tier) return null;
    amountGBP = tier.amountGBP;
  }
  return {
    type: r.type,
    amountGBP,
    month: r.month ?? null,
    wording: r.wording ?? (r.type === 'none' ? 'No price rise' : `Goes up by £${amountGBP.toFixed(2)} a month`),
  };
}

const EMPTY_ROAMING = { euIncluded: null, euCapGB: null, destinationCount: null, dailyChargeGBP: null, worldwideIncluded: null, note: null };

/* ctx: { site, today, roaming, priceRises, cols }. The two tables are passed
   in rather than imported so tests can hand in a small verified set. */
export function normaliseRow(row, ctx) {
  const { site = 'sims', today, roaming = {}, priceRises = {}, cols = columns } = ctx;
  const keys = Object.keys(row);
  const v = (field) => {
    for (const c of cols[field] ?? []) {
      const k = keys.find((h) => h.toLowerCase() === c.toLowerCase());
      if (k && String(row[k]).trim() !== '') return String(row[k]).trim();
    }
    return '';
  };
  const drop = (reason, extra = {}) => ({ deal: null, needs: [], drop: reason, assumed: false, rawNetwork: v('network'), ...extra });

  const key = networkKey(v('network'));
  if (!key) return drop('unknown-network');
  /* Hard rule 1: EE never enters an automated table. EE deals are editorial
     and hand-written, with isAffiliate false, or they do not exist. */
  if (key === 'ee') return drop('ee-editorial-only');

  const stock = v('inStock');
  if (stock && /^(0|no|false|out)/i.test(stock)) return drop('out-of-stock');

  const sim = isSimOnly(v);
  if (sim === null) return drop('contract-type-unknown');
  if (site === 'sims' && !sim) return drop('not-sim-only');
  if (site === 'phones' && sim) return drop('not-a-handset');

  const monthlyPrice = parseMoney(v('monthlyGBP'));
  if (monthlyPrice === null) return drop('missing-monthly-price');
  /* A blank upfront is not read as zero. Showing £0 upfront against a deal
     that charges one is drip pricing, the worst failure the site can have. */
  const upfrontCost = parseMoney(v('upfrontGBP'));
  if (upfrontCost === null) return drop('missing-upfront-cost');
  const term = parseTerm(v('termMonths'));
  if (!term) return drop('missing-term');

  const data = parseAllowance(v('data'), 'data');
  const minutes = parseAllowance(v('minutes'), 'minutes');
  const texts = parseAllowance(v('texts'), 'texts');
  if (data.value === null || minutes.value === null || texts.value === null) return drop('missing-allowance');

  const url = v('url');
  if (!/^https?:\/\//i.test(url)) return drop('bad-link');
  /* Feed rows are affiliate by definition. Scraped rows say: a direct link
     on a network with no programme is editorial, and verify.mjs refuses an
     affiliate flag on such a network. */
  const isAffiliate = v('isAffiliate') === '' ? true : /^(1|true|yes)$/i.test(v('isAffiliate'));

  let storageGB = null;
  if (site === 'phones') {
    const st = parseAllowance(v('storageGB'), 'data').value;
    storageGB = typeof st === 'number' && st > 0 ? Math.round(st) : null;
    if (storageGB === null) return drop('missing-storage');
  }

  const net = networks[key];
  const needs = [];

  const roam = roaming[key];
  const roamingOut = roam && roam.evidence !== 'unverified'
    ? {
        euIncluded: roam.euIncluded, euCapGB: roam.euCapGB, destinationCount: roam.destinationCount,
        dailyChargeGBP: roam.dailyChargeGBP, worldwideIncluded: roam.worldwideIncluded, note: roam.note,
      }
    : (needs.push('roaming-unverified'), { ...EMPTY_ROAMING });

  /* The placeholder for an unverified rise is a cpi rise with no amount,
     which verify.mjs refuses. So a held deal can never pass CI even if it is
     pasted into content/ by hand. */
  const priceRise = resolvePriceRise(priceRises[key], { site, data: data.value })
    ?? (needs.push('price-rise-unverified'), { type: 'cpi', amountGBP: null, month: null, wording: 'Price rise not yet verified' });

  const connectivity = v('connectivity');
  const fiveG = /5g/i.test(connectivity) ? true : /[34]g/i.test(connectivity) ? false : null;
  const feedId = fold(v('id') || v('name')).slice(0, 32) || 'row';

  const deal = {
    /* Stable across weeks, so the daily check can find the same deal in a
       fresh pull and the weekly diff can say what changed. */
    id: `${key}-${fold(v('merchant')).slice(0, 24) || 'feed'}-${feedId}`,
    site,
    network: key,
    hostNetwork: net.hostNetwork === 'direct' ? net.name : (net.hostNetwork ?? 'Not stated'),
    merchant: v('merchant') || net.name,
    monthlyPrice,
    upfrontCost,
    totalContractCost: Math.round((monthlyPrice * term + upfrontCost) * 100) / 100,
    data: data.value,
    minutes: minutes.value,
    texts: texts.value,
    contractLengthMonths: term,
    fiveG,
    roaming: roamingOut,
    priceRise,
    url,
    isAffiliate,
    lastVerified: today,
    feedLastUpdated: toISODate(v('lastUpdated'), today),
    pick: null,
    status: 'live',
  };
  if (site === 'phones') {
    deal.device = {
      name: v('name'), brand: v('brand'), storageGB, colours: [], imageUrl: v('imageUrl'), contractType: 'contract',
    };
  }
  return { deal, needs, drop: null, assumed: data.assumed, rawNetwork: v('network') };
}
