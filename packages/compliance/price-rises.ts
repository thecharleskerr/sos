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
   * Checked: 2026-09-04, two independent agents, resolving the 2026-09-02
   * conflict. The £1.50 figure belongs to the earlier terms (SIM only
   * plans sold from 10 April 2024, first applied 31 March 2025); the terms
   * in force from 7 August 2025 state £2.50, and the help page's worked
   * example agrees. The second agent found the same £2.50 in the pay
   * monthly plan terms from 7 August 2025 as well, so the airtime part of
   * a phone plan carries it too by the document's scope, though no single
   * sentence says so, which is why handset stays null. EE's own name for
   * a plan with no rise is "Fixed Price Plan". EE is editorial only under
   * hard rule 1, so this releases no feed deal.
   * Official wording (terms PDF):
   *   "If you are not on a fixed price plan, the monthly plan price will
   *   increase by £2.50 on 31 March each year, and out of bundle charges
   *   will increase by 5%. If you are on a fixed price plan, the monthly
   *   price that you pay for your mobile plan will not increase during the
   *   minimum term."
   *   "If your Price Plan is a Fixed Price Plan, the annual price increase
   *   does not apply to your Price Plan Charge during the Minimum Term."
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
   * NOT VERIFIED. Checked: 2026-09-02, and by two agents on 2026-09-04.
   * No official page found stating a mid-contract price rise policy
   * either way; the terms, charges and help pages say nothing, and the
   * plans are 30 day rolling with no minimum term.
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
   * 2026-09-04, two independent agents, high confidence: "their basic
   * monthly usage price or basic monthly price will receive an annual
   * increase each April, as shown in pounds (GBP) and pence at the point
   * of sale, for their minimum contract period", for deals taken from
   * 17 December 2024 other than Clubcard Price deals, which "freeze your
   * basic monthly usage price for the length of your minimum contract
   * period". No single published figure. Still null: a feed row cannot
   * say which kind of deal it is, so the card could not print the rise.
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
   * Checked: 2026-09-04, one agent, two searches, then an independent
   * second search the same day that returned the same page and added
   * "no annual CPI or RPI increases" and a statement that monthly plan
   * prices will not rise in 2026. Out of plan charges (roaming and
   * international) are outside the promise.
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
   * 2026-09-04, two agents: the general contract wording is "Prices may
   * increase, including during the minimum term, unless we've agreed a
   * fixed price with you", and "will not increase" applies only to plans
   * sold as fixed price offers. No pounds figure and no annual formula
   * published for the general case, and the clearest contract wording
   * came from a 2019 PDF whose currency is unconfirmed. Null.
   */
  sky: unverified('sky'),

  /* BT Mobile is sold only to BT Broadband customers as a bundle (see
     networks.js), with no affiliate route, so nothing here would release a
     deal. */
  bt: unverified('bt'),

  /* Asda Mobile
   * Source:  https://mobile.asda.com/help/bundles-and-pricing
   * Checked: 2026-09-04, two independent agents, the second also finding
   * the pay monthly terms PDFs, medium confidence because the search index
   * paraphrases the page. Pay as you go bundles roll with no term and are
   * not covered by the promise.
   * Official wording (as indexed):
   *   "Asda Mobile offers no mid-contract price rises for their 12 and
   *   24-month SIM-only plans"
   */
  asda: {
    network: 'asda', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: '12 and 24 month SIM only contracts. Pay as you go bundles are not covered.',
    source: 'https://mobile.asda.com/help/bundles-and-pricing', checked: '2026-09-04', evidence: 'official-page',
  },

  /* 1pMobile
   * Source:  https://www.1pmobile.com/blog?post=43
   * Also:    https://www.1pmobile.com/terms-and-conditions
   * Checked: 2026-09-04, two independent agents, medium confidence. The
   * explicit promise is in 1pMobile's own blog; the terms carry only the
   * standard clause (30 days' notice of any change not in your favour and
   * a free right to leave). It sells PAYG and 30 day bundles only, so
   * there is no minimum term for a rise to sit inside, the same footing
   * as SMARTY's entry.
   * Official wording:
   *   "1pMobile customers are protected with no mid-contract price rises,
   *   no CPI-linked uplifts, and no surprises."
   *   "Any contractual changes not to your benefit will be notified to you
   *   with at least 30-days notice and will give you the right to leave
   *   your contract without charge."
   */
  onep: {
    network: 'onep', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'PAYG and 30 day bundles, which roll monthly. Any change comes with 30 days\' notice and a free exit.',
    source: 'https://www.1pmobile.com/blog?post=43', checked: '2026-09-04', evidence: 'official-page',
  },

  /* spusu
   * NOT VERIFIED as a rise or a no-rise promise. 2026-09-04, two agents:
   * the advertised price freeze ran to 31 January 2026 for existing
   * customers. The general terms say plans and costs "are subject to
   * change" and that a change to pricing gets one month's written notice
   * with a free exit. That is neither a fixed rise nor "No price rise",
   * and the table has no type for it, so the entry stays null and the
   * question of how to label a rolling plan with a notice clause sits in
   * docs/TODO.md for the owner.
   * Lead: https://www.spusu.co.uk/imoscmsapi/files/general_terms_and_conditions.pdf
   */
  spusu: unverified('spusu'),

  /* Lycamobile
   * Source:  https://www.lycamobile.co.uk/en/general/no-price-rises/
   * Checked: 2026-09-04, two independent agents, medium confidence. The
   * page is titled "No Mid Contract Price Rises". A 2023 blog post framed
   * the pay monthly freeze as lasting "until at least 2026", so this
   * entry is due a re-check in January 2027 (docs/TODO.md). Exclusions
   * found are the usual fair use policy on unlimited allowances and the
   * Isle of Man and Channel Islands being outside UK allowances.
   * Official wording:
   *   "No Mid Contract Price Rises"
   */
  lyca: {
    network: 'lyca', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'SIM only plans. The pay monthly freeze was framed as running until at least 2026, so re-check in January 2027.',
    source: 'https://www.lycamobile.co.uk/en/general/no-price-rises/', checked: '2026-09-04', evidence: 'official-page',
  },

  /* Mozillion
   * Source:  https://www.mozillion.com/resources/help/payments-and-billing/
   * Checked: 2026-09-04, two independent agents, the second from the plan
   * pages, medium confidence. The terms reserve a rise only for
   * non-personal, commercial or abusive use.
   * Official wording:
   *   "There are no mid-contract price rises with Mozillion plans. The
   *   price you pay each month is the price displayed at checkout."
   *   "Your payments are fixed, no matter what."
   */
  mozillion: {
    network: 'mozillion', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'SIM only and phone plus SIM airtime plans, for normal personal use.',
    source: 'https://www.mozillion.com/resources/help/payments-and-billing/', checked: '2026-09-04', evidence: 'official-page',
  },

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
   * Source:  https://honestmobile.co.uk/price-hikes/
   * Also:    https://join.honestmobile.co.uk/bills-reducing-esim
   * Checked: 2026-09-04, two independent agents, medium confidence. Both
   * pages are marketing rather than terms, but the promise is unconditional
   * and the bill falls rather than rises: a loyalty discount grows 5% a
   * year to a 30% cap.
   * Official wording:
   *   "No more annual price hikes."
   *   "Your bill drops 5% each year until you reach a 30% discount which
   *   you can keep forever, even if you change plan."
   */
  honest: {
    network: 'honest', type: 'none', amountGBP: null, month: null,
    wording: 'No price rise', appliesTo: 'All plans, 30 day and 12 month. The bill falls by a loyalty discount instead.',
    source: 'https://honestmobile.co.uk/price-hikes/', checked: '2026-09-04', evidence: 'official-page',
  },

  /* Revolut Mobile
   * NOT VERIFIED as a rise or a no-rise promise. 2026-09-04, two agents,
   * high confidence on what the terms say: no scheduled rise, a general
   * right to change prices on one month's notice with a free exit, and
   * rolling monthly eSIM plans with no minimum term. Same position as
   * spusu, so the entry stays null pending the owner's call in
   * docs/TODO.md on how to label a notice clause.
   * Lead: https://www.revolut.com/legal/revolut-mobile-terms-and-condition-gigs/
   */
  revolut: unverified('revolut'),

  /* Klarna Mobile is waitlist only in the UK as of 2026-09-04
     (https://www.klarna.com/uk/klarna-mobile_waitlist/), so there are no
     terms to record. */
  klarna: unverified('klarna'),

  /* Utility Warehouse
   * NOT VERIFIED. 2026-09-04, two agents: no mobile-specific rise clause
   * found. The Price Pledge is a whole-bundle savings guarantee, and the
   * "fixed until 2025" mobile tariff wording is a lapsed 2024 press
   * release. Needs a direct read of the mobile terms.
   * Lead: https://uw.co.uk/legal/tariffs-charges
   */
  uw: unverified('uw'),

  /* Your Co-op Mobile
   * NOT VERIFIED. 2026-09-04, two agents. The live pricing page states
   * "Each year, on 1 March, the price of your subscription plan, add-ons
   * (including discounts) and calls will increase by an amount equal to
   * the Consumer Price Index rate of inflation published by the Office
   * for National Statistics in January of that year, plus 3.9%", while
   * the blog says "no hidden fees or in-contract price rises". An
   * inflation-linked rise cannot be printed in pounds and pence, and
   * Ofcom banned such terms in new contracts from January 2025, so either
   * the page is stale or it applies to older contracts. Null until the
   * page is read directly; the deals stay held.
   * Lead: https://broadband.yourcoop.coop/help-resources/pricing/
   */
  coop: unverified('coop'),

  /* Ecotalk
   * Source:  https://www.ecotalk.co.uk/terms-and-conditions
   * Checked: 2026-09-04, two independent agents, high confidence; the
   * second found the same wording on the homepage. All plans roll
   * monthly.
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
