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
 * Research method, the same as roaming.ts: domain-scoped search on the
 * network's own site for its price rise or "annual price change" page and
 * the current pay monthly terms, then an independent quote check. Where a
 * network states different rises for different plan cohorts, record the one
 * applying to plans sold now and say so in appliesTo. Conflicting figures
 * mean null, never a choice between them.
 */

export interface PriceRiseTier {
  /** The tier applies to plans with a data allowance up to and including
   *  this many GB; null means every larger plan, including unlimited. */
  maxGB: number | null;
  amountGBP: number;
}

export interface NetworkPriceRise {
  /** Key into the networks map in packages/ui/networks.js. */
  network: string;
  /** none: the network states no mid-contract rise. fixed: a stated amount in
   *  pounds a month. cpi: an inflation-linked rise (rare on plans sold now).
   *  null: not verified. */
  type: 'none' | 'fixed' | 'cpi' | null;
  /** The monthly rise in pounds, for fixed and, where stated, cpi. Null on a
   *  fixed rise that varies by plan size; see tiers. */
  amountGBP: number | null;
  /** Where the fixed rise depends on the plan's data allowance. The ingest
   *  picks the tier from the deal's allowance. */
  tiers?: PriceRiseTier[];
  /** The month it lands, e.g. 'April'. */
  month: string | null;
  /** The network's own wording, printed on the card as the headline. */
  wording: string | null;
  /** Which plans the figure applies to, e.g. 'Pay monthly and SIM only plans
   *  taken from 1 April 2025'. */
  appliesTo: string | null;
  /** The rise on the airtime part of a phone contract, where the network
   *  states one that differs from SIM only. Absent means the entry above
   *  applies to both; null means not verified for phone plans. */
  handset?: Pick<NetworkPriceRise, 'type' | 'amountGBP' | 'tiers' | 'month' | 'wording'> | null;
  source: string | null;
  checked: string | null;
  evidence: 'official-page' | 'official-pdf' | 'unverified';
}

const unverified = (network: string): NetworkPriceRise => ({
  network, type: null, amountGBP: null, month: null, wording: null, appliesTo: null,
  source: null, checked: null, evidence: 'unverified',
});

/* Verified entries were built from the guide writers' research records on
   2026-09-02, each figure found by at least two agents searching the
   network's own domain independently, then re-checked by the fact refuter
   on the price rises guide. The exact snippets are kept beside each entry.
   Everything else stays unverified, and that network's feed deals stay held. */
export const priceRises: Record<string, NetworkPriceRise> = {

  /* O2
   * Source:  https://www.o2.co.uk/prices
   * Checked: 2026-09-02, four independent agents.
   * Official wording:
   *   "Each April, your airtime plan will increase by £2.50 for voice plans
   *   and 75p for data-only and smartwatch plans. ... In line with new Ofcom
   *   regulations ... shown in pounds and pence, not percentages or
   *   inflation measures. ... with the cost of your device remaining frozen."
   */
  o2: {
    network: 'o2', type: 'fixed', amountGBP: 2.5, month: 'April',
    wording: 'Goes up by £2.50 a month each April',
    appliesTo: 'Airtime plans, SIM only and the airtime part of a phone contract. Data-only and smartwatch plans rise by 75p. The device plan is frozen.',
    source: 'https://www.o2.co.uk/prices', checked: '2026-09-02', evidence: 'official-page',
  },

  /* Vodafone
   * Source:  https://www.vodafone.co.uk/pricechanges
   * Checked: 2026-09-02, three independent agents.
   * Official wording:
   *   "The monthly cost will increase each year on 1 April by £2.50 for Pay
   *   monthly plans with Airtime/Data, and £3.50 for Home Broadband plans.
   *   This doesn't affect Device Plans."
   */
  vodafone: {
    network: 'vodafone', type: 'fixed', amountGBP: 2.5, month: 'April',
    wording: 'Goes up by £2.50 a month each 1 April',
    appliesTo: 'Pay monthly plans with airtime or data, SIM only included. Device Plans are not affected.',
    source: 'https://www.vodafone.co.uk/pricechanges', checked: '2026-09-02', evidence: 'official-page',
  },

  /* Three
   * Source:  https://www.three.co.uk/support/bills-and-contracts/your-monthly-plan-and-usage/price-increase-9nov25
   * Checked: 2026-09-02, three independent agents. The figure depends on
   * the plan's data allowance, so the ingest picks the tier.
   * Official wording:
   *   "Plans 4GB or less and Smartwatch Pairing Plans will increase by £1.80
   *   per month, plans from 5GB to 99GB will increase by £1.90 per month,
   *   and plans 100GB or over will increase by £2.30 per month ... This
   *   increase applies to the recurring monthly charge and does not apply to
   *   any device payments."
   */
  three: {
    network: 'three', type: 'fixed', amountGBP: null,
    tiers: [
      { maxGB: 4, amountGBP: 1.8 },
      { maxGB: 99, amountGBP: 1.9 },
      { maxGB: null, amountGBP: 2.3 },
    ],
    month: 'April',
    wording: 'Goes up each 1 April by a fixed amount set by plan size',
    appliesTo: 'Customers joining or upgrading on or after 9 November 2025. Device payments are excluded.',
    source: 'https://www.three.co.uk/support/bills-and-contracts/your-monthly-plan-and-usage/price-increase-9nov25',
    checked: '2026-09-02', evidence: 'official-page',
  },

  /* EE
   * NOT VERIFIED. Checked: 2026-09-02. Agents found £1.50 a month (new and
   * re-contracting mobile customers from 31 March 2025) and £2.50 a month
   * (SIM only and airtime plans, as of March 2026) attributed to the same
   * page, https://ee.co.uk/help/billing-payments/guide-to-bill/about-annual-prices-changes,
   * and fifteen further searches could not settle which applies to a new
   * sign-up. Conflicting figures mean null. EE is editorial only under hard
   * rule 1, so this blocks no feed deal; a hand-written EE card needs the
   * page read directly first.
   */
  ee: unverified('ee'),

  /* SMARTY
   * Source:  https://smarty.co.uk/blog/save-money-with-smarty
   * Checked: 2026-09-02, writer plus the fact refuter.
   * Official wording:
   *   "SMARTY doesn't do annual prices, meaning no sudden messages to say
   *   your bill will be going up ... prices will stay the same from when you
   *   first signed up. ... SMARTY plans are not subject to Consumer Price
   *   Index rate of inflation and so will not increase each April."
   */
  smarty: {
    network: 'smarty', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'All plans, which roll monthly.',
    source: 'https://smarty.co.uk/blog/save-money-with-smarty', checked: '2026-09-02', evidence: 'official-page',
  },

  /* VOXI
   * NOT VERIFIED. Checked: 2026-09-02. No official page found stating a
   * mid-contract price rise policy either way; the plans are 30 day rolling.
   */
  voxi: unverified('voxi'),

  /* giffgaff
   * Source:  https://www.giffgaff.com/why-giffgaff
   * Checked: 2026-09-02, writer plus the fact refuter.
   * Official wording:
   *   "There won't be any mid-contract price rises when you take out an
   *   18-month mobile contract with us."
   */
  giffgaff: {
    network: 'giffgaff', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: '18 month contracts, and the monthly goodybags roll month to month.',
    source: 'https://www.giffgaff.com/why-giffgaff', checked: '2026-09-02', evidence: 'official-page',
  },

  /* iD Mobile
   * Source:  https://www.idmobile.co.uk/price-increases
   * Also:    https://www.idmobile.co.uk/sim-only-deals ("SIM Only Deals &
   *          Contracts | No Annual Price Rises")
   * Checked: 2026-09-02, writer plus the fact refuter. SIM only plans carry
   * no annual rise. Phone plans carry a fixed rise whose amount was not
   * found stated, so the handset variant is unverified.
   * Official wording:
   *   "A fixed-price increase will only apply if you upgrade or purchase a
   *   new iD Mobile phone plan."
   */
  idmobile: {
    network: 'idmobile', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'SIM only plans. Phone plans carry a fixed annual rise stated at checkout.',
    handset: null,
    source: 'https://www.idmobile.co.uk/price-increases', checked: '2026-09-02', evidence: 'official-page',
  },

  /* Tesco Mobile
   * NOT VERIFIED. Checked: 2026-09-02. Clubcard Price deals freeze the basic
   * monthly price for the minimum term; other deals taken from 17 December
   * 2024 carry an annual rise shown in pounds and pence at the point of
   * sale, with no single figure published. A feed row does not say which
   * kind of deal it is, so the entry stays null.
   * Lead: https://www.tescomobile.com/help/pricing-and-charges/our-pricing
   */
  tesco: unverified('tesco'),

  /* Lebara
   * Source:  https://www.lebara.co.uk/en/no-price-rise-disclaimer.html
   * Checked: 2026-09-02, writer plus the fact refuter.
   * Official wording:
   *   "no annual or mid-contract price rises unlike Big Mobile networks ...
   *   haven't increased prices since 2020 and are committed to keeping them
   *   fixed for 2026."
   */
  lebara: {
    network: 'lebara', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'All plans.',
    source: 'https://www.lebara.co.uk/en/no-price-rise-disclaimer.html', checked: '2026-09-02', evidence: 'official-page',
  },

  talkmobile: unverified('talkmobile'),

  /* Sky Mobile
   * NOT VERIFIED. Checked: 2026-09-02. The customer contract says "Prices
   * may increase, including during the minimum term, unless we've agreed a
   * fixed price with you", and no pound figure was found.
   * Lead: https://www.sky.com/shop/__PDF/Sky-Mobile-Contract.pdf
   */
  sky: unverified('sky'),

  bt: unverified('bt'),
  asda: unverified('asda'),
  onep: unverified('onep'),
  spusu: unverified('spusu'),
  lyca: unverified('lyca'),
  mozillion: unverified('mozillion'),

  /* Simp
   * Source:  https://simpmobile.com/students
   * Checked: 2026-09-02, the page text was also supplied by the site owner.
   * Official wording:
   *   "There is no contract and no mid-contract price rises."
   */
  simp: {
    network: 'simp', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'All plans, which roll monthly.',
    source: 'https://simpmobile.com/students', checked: '2026-09-02', evidence: 'official-page',
  },

  honest: unverified('honest'),
  revolut: unverified('revolut'),
  klarna: unverified('klarna'),
  uw: unverified('uw'),
  coop: unverified('coop'),
  ecotalk: unverified('ecotalk'),
};

/** Mirrors the get() helper in packages/ui/networks.js. */
export const getPriceRise = (key: string): NetworkPriceRise | null => priceRises[key] ?? null;
