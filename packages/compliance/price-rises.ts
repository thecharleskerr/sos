/* UK network mid-contract price rise reference table.
 *
 * Hand-maintained, same rules as roaming.ts: every figure from the network's
 * own terms, quoted beside the entry with its source and check date, null
 * where nothing official states it. Since January 2025 Ofcom requires the
 * rise to be stated in pounds and pence at the point of sale, so every
 * network publishes one, which is what makes this table fillable.
 *
 * The weekly refresh reads this table by network. A network marked
 * unverified has every one of its feed deals held back, because hard rule 2
 * says a card must show the rise in pounds and pence or "No price rise", and
 * neither can be printed on a guess. Filling an entry here, with its source,
 * is what releases that network's deals into the next weekly pull request.
 *
 * Research method that worked for roaming.ts: domain-scoped search on the
 * network's own site for its price rise or "annual price change" page and
 * the current pay monthly terms, then an independent quote check. Where a
 * network states different rises for different plan cohorts, record the one
 * applying to plans sold now and say so in appliesTo.
 */

export interface NetworkPriceRise {
  /** Key into the networks map in packages/ui/networks.js. */
  network: string;
  /** none: the network states no mid-contract rise. fixed: a stated amount in
   *  pounds a month. cpi: an inflation-linked rise (rare on plans sold now).
   *  null: not verified. */
  type: 'none' | 'fixed' | 'cpi' | null;
  /** The monthly rise in pounds, for fixed and, where stated, cpi. */
  amountGBP: number | null;
  /** The month it lands, e.g. 'April'. */
  month: string | null;
  /** The network's own wording, printed on the card as the headline. */
  wording: string | null;
  /** Which plans the figure applies to, e.g. 'Pay monthly and SIM only plans
   *  taken from 1 April 2025'. */
  appliesTo: string | null;
  source: string | null;
  checked: string | null;
  evidence: 'official-page' | 'official-pdf' | 'unverified';
}

const unverified = (network: string): NetworkPriceRise => ({
  network, type: null, amountGBP: null, month: null, wording: null, appliesTo: null,
  source: null, checked: null, evidence: 'unverified',
});

/* Nothing here is verified yet. Each entry is a research task, and until it
   is done that network's feed deals are held back by the weekly refresh. */
export const priceRises: Record<string, NetworkPriceRise> = Object.fromEntries(
  [
    'o2', 'vodafone', 'three', 'ee', 'smarty', 'voxi', 'giffgaff', 'idmobile', 'tesco',
    'lebara', 'talkmobile', 'sky', 'bt', 'asda', 'onep', 'spusu', 'lyca', 'mozillion',
    'simp', 'honest', 'revolut', 'klarna', 'uw', 'coop', 'ecotalk',
  ].map((k) => [k, unverified(k)]),
);

/** Mirrors the get() helper in packages/ui/networks.js. */
export const getPriceRise = (key: string): NetworkPriceRise | null => priceRises[key] ?? null;
