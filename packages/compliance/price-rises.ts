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
   * Source:  https://ee.co.uk/content/dam/help/terms-and-conditions/price-plans/mobile/pay-monthly-price-plans/ee-simo-plan-tncs-from-7-august-2025.pdf
   * Also:    https://ee.co.uk/help/billing-payments/guide-to-bill/about-annual-prices-changes
   * Checked: 2026-09-04, one agent, resolving the 2026-09-02 conflict. The
   * £1.50 figure belongs to the earlier terms (from 10 April 2024, first
   * applied 31 March 2025); the terms in force from 7 August 2025 state
   * £2.50, and the help page's worked example agrees. The second,
   * independent check is listed in docs/TODO.md. EE is editorial only
   * under hard rule 1, so this releases no feed deal.
   * Official wording (terms PDF):
   *   "If you are not on a fixed price plan, the monthly plan price will
   *   increase by £2.50 on 31 March each year, and out of bundle charges
   *   will increase by 5%. If you are on a fixed price plan, the monthly
   *   price that you pay for your mobile plan will not increase during the
   *   minimum term."
   * Official wording (help page):
   *   "if you take out a new SIM-Only mobile plan at £25 per month on a
   *   24-month contract, your price will be £27.50 per month from 31 March
   *   2026, and then £30 per month from 31 March 2027."
   */
  ee: {
    network: 'ee', type: 'fixed', amountGBP: 2.5, month: 'March',
    wording: 'Goes up by £2.50 a month each 31 March',
    appliesTo: 'Pay monthly and SIM only plans taken under the terms in force from 7 August 2025, unless the plan is sold as a fixed price plan. Out of bundle charges rise by 5%.',
    handset: null,
    source: 'https://ee.co.uk/content/dam/help/terms-and-conditions/price-plans/mobile/pay-monthly-price-plans/ee-simo-plan-tncs-from-7-august-2025.pdf',
    checked: '2026-09-04', evidence: 'official-pdf',
  },

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
   * NOT VERIFIED. Checked: 2026-09-02 and again 2026-09-04. No official page
   * found stating a mid-contract price rise policy either way; the plans
   * are 30 day rolling and only marketing copy came back.
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
   * 2026-09-04, one agent, high confidence: the page confirms a fixed rise
   * each April shown in pounds and pence per customer at the point of
   * sale, no single published figure, and Clubcard Price deals frozen for
   * the minimum term. Still null: the ingest cannot tell the two apart.
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

  /* Talkmobile
   * Source:  https://talkmobile.co.uk/price-rises
   * Checked: 2026-09-04, one agent, two searches, high confidence. The
   * page exists for this purpose and its wording is unconditional. The
   * second, independent check is listed in docs/TODO.md; out of plan
   * charges are outside the promise.
   * Official wording:
   *   "All Talkmobile plans come with no annual price rises"
   */
  talkmobile: {
    network: 'talkmobile', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'All plans. Out of plan charges are not covered by the promise.',
    source: 'https://talkmobile.co.uk/price-rises', checked: '2026-09-04', evidence: 'official-page',
  },

  /* Sky Mobile
   * NOT VERIFIED. Checked: 2026-09-02. The customer contract says "Prices
   * may increase, including during the minimum term, unless we've agreed a
   * fixed price with you", and no pound figure was found.
   * Lead: https://www.sky.com/shop/__PDF/Sky-Mobile-Contract.pdf
   * 2026-09-04: still conflicting on sky.com, "will not increase during
   * minimum term" against "may increase", low confidence. Null.
   */
  sky: unverified('sky'),

  /* BT Mobile is closed to new customers (see networks.js), so nothing here
     would release a deal. */
  bt: unverified('bt'),

  /* Asda Mobile
   * NOT VERIFIED. Lead, 2026-09-04, one agent, medium confidence: the
   * bundles and pricing help page describes 12 and 24 month SIM only
   * contracts with no mid-contract rise.
   * Lead: https://mobile.asda.com/help/bundles-and-pricing
   */
  asda: unverified('asda'),

  /* 1pMobile
   * NOT VERIFIED. Lead, 2026-09-04, one agent, medium confidence: blog
   * posts only ("1pMobile does not build in mid-contract price rises"),
   * no terms page found. Sells PAYG and 30 day bundles.
   * Lead: https://www.1pmobile.com/blog?post=43
   */
  onep: unverified('onep'),

  /* spusu
   * NOT VERIFIED. 2026-09-04: a "price freeze" was advertised to the end
   * of January 2026 for existing customers, now lapsed, and no current
   * policy was found. Low confidence. Lead: https://www.spusu.co.uk/
   */
  spusu: unverified('spusu'),

  /* Lycamobile
   * NOT VERIFIED. Lead, 2026-09-04, one agent, medium confidence: a page
   * titled "no price rises". Its end date and exclusions are unchecked.
   * Lead: https://www.lycamobile.co.uk/en/general/no-price-rises/
   */
  lyca: unverified('lyca'),

  /* Mozillion
   * NOT VERIFIED. Lead, 2026-09-04, one agent, medium confidence, help
   * page: "There are no mid-contract price rises with Mozillion plans.
   * The price you pay each month is the price displayed at checkout."
   * The terms reserve a rise for non-personal or abusive use only.
   * Lead: https://www.mozillion.com/resources/help/payments-and-billing/
   */
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

  /* Honest Mobile
   * NOT VERIFIED. Lead, 2026-09-04, one agent, medium confidence,
   * marketing page: "No more annual price hikes", with a loyalty discount
   * that grows 5% a year to a 30% cap. No terms wording found.
   * Lead: https://honestmobile.co.uk/price-hikes/
   */
  honest: unverified('honest'),

  /* Revolut Mobile
   * NOT VERIFIED. 2026-09-04: the terms give Revolut a general right to
   * change prices on one month's notice with a free exit; no scheduled
   * rise. Rolling monthly eSIM plans, so no minimum term to rise within.
   * Lead: https://www.revolut.com/legal/revolut-mobile-terms-and-condition-gigs/
   */
  revolut: unverified('revolut'),

  /* Klarna Mobile is waitlist only in the UK as of 2026-09-04
     (https://www.klarna.com/uk/klarna-mobile_waitlist/), so there are no
     terms to record. */
  klarna: unverified('klarna'),

  /* Utility Warehouse
   * NOT VERIFIED. 2026-09-04: the no mid-contract rise pledge was only
   * confirmed for broadband; no mobile clause found. Low confidence.
   * Lead: https://help.uw.co.uk/article/mobile/tariff_information/what-mobile-price-plans-do-you-have-available
   */
  uw: unverified('uw'),

  /* Your Co-op Mobile
   * NOT VERIFIED. 2026-09-04: conflicting. Blog copy says "no hidden fees
   * or in-contract price rises"; an indexed terms PDF describes a CPI plus
   * 3.9% rise each 1 March. Conflicting figures mean null.
   * Lead: https://broadband.yourcoop.coop/help-resources/blog/SIM-only-contracts-with-Your-Co-op-Mobile/
   */
  coop: unverified('coop'),

  /* Ecotalk
   * Source:  https://www.ecotalk.co.uk/terms-and-conditions
   * Checked: 2026-09-04, one agent, two searches, high confidence, and
   * the wording is the network's own tagline. The second, independent
   * check is listed in docs/TODO.md. All plans roll monthly.
   * Official wording:
   *   "All Ecotalk plans come with a no annual price rise guarantee."
   *   "No price rises. Ever."
   */
  ecotalk: {
    network: 'ecotalk', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'All plans, which roll monthly with no exit fees.',
    source: 'https://www.ecotalk.co.uk/terms-and-conditions', checked: '2026-09-04', evidence: 'official-page',
  },
};

/** Mirrors the get() helper in packages/ui/networks.js. */
export const getPriceRise = (key: string): NetworkPriceRise | null => priceRises[key] ?? null;
