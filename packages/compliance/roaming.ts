/* UK EU roaming reference table.
 *
 * Hand-maintained. This is the reference we check deal data against, so the
 * rules that govern it are stricter than the rest of the codebase:
 *
 *   1. Every figure comes from the network's own official pages. Never a
 *      comparison site, never recalled knowledge.
 *   2. A value nobody official states is null. It is never estimated, never
 *      carried over from a sibling network, never inferred from the host
 *      network. null renders as "Not stated", which is honest and costs us
 *      nothing. A wrong cap published against a network's name costs us the
 *      affiliate relationship.
 *   3. Every entry carries the source URL and the date it was checked, in the
 *      comment above it and in the data itself.
 *
 * Figures describe the terms offered to someone buying the plan NOW. Where a
 * network's terms differ by plan start date, the note says which cohort.
 *
 * Field names deliberately match RoamingSchema in packages/data/schema.js so
 * a deal's roaming object and this table can be compared directly.
 */

export type RoamingEvidence = 'official-page' | 'official-pdf' | 'unverified';

export interface NetworkRoaming {
  /** Key into the networks map in packages/ui/networks.js. */
  network: string;
  /** Can the plan allowance be used in the EU with no extra daily fee? */
  euIncluded: boolean | null;
  /** Fair use data cap in GB while roaming in the EU. */
  euCapGB: number | null;
  /** How many destinations the Europe or EU roaming zone covers. */
  destinationCount: number | null;
  /** Daily roaming charge in pounds. null when there is no daily charge. */
  dailyChargeGBP: number | null;
  /** Is roaming beyond Europe included at no extra cost? */
  worldwideIncluded: boolean | null;
  /** One short sentence naming any exception worth stating. */
  note: string | null;
  /** The official URL the figures came from. */
  source: string | null;
  /** ISO date the source was last checked. */
  checked: string | null;
  /** How the figures were established. 'unverified' means we hold no figure. */
  evidence: RoamingEvidence;
}

export const roaming: Record<string, NetworkRoaming> = {
  /* O2
   * Source:  https://www.o2.co.uk/international
   * Checked: 2026-08-31. Two independent passes agreed on the figures recorded below.
   * Official wording:
   *   "If your UK monthly data allowance is over 25GB, you'll have a Roaming
   *   Limit of 25GB when roaming in our Europe Zone. This means you can use up
   *   to 25GB of your allowance at no extra costs."
   */
  o2: {
    network: 'o2',
    euIncluded: true,
    euCapGB: 25,
    destinationCount: 48,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "Inclusive Europe Zone roaming is for periodic travel only, and using it for more than 63 days in any four month period triggers surcharges; travel beyond the Europe Zone needs the O2 Travel Bolt On at £7 a day.",
    source: "https://www.o2.co.uk/international",
    checked: '2026-08-31',
    evidence: 'official-page',
  },

  /* Vodafone
   * Source:  https://www.vodafone.co.uk/newscentre/smart-living/everything-you-need-to-know-about/roaming-with-vodafone-in-2022-everything-you-need-to-know/
   * Checked: 2026-08-31. Two independent passes agreed on the figures recorded below.
   * Official wording:
   *   "Zone B includes 52 destinations, most of which are in Europe and are EU
   *   member states. For anyone with a Vodafone Pay Monthly plan that started on
   *   or after 11 August 2021, roaming costs £2.75 a day."
   */
  vodafone: {
    network: 'vodafone',
    euIncluded: false,
    euCapGB: 25,
    destinationCount: 52,
    dailyChargeGBP: 2.75,
    worldwideIncluded: false,
    note: "Selected higher tier plans bought with Euro Roam or Global Roam include Europe roaming at no extra cost, and Zone A destinations, namely the Republic of Ireland, the Isle of Man, Iceland and Norway, carry no daily charge on any Pay monthly plan.",
    source: "https://www.vodafone.co.uk/newscentre/smart-living/everything-you-need-to-know-about/roaming-with-vodafone-in-2022-everything-you-need-to-know/",
    checked: '2026-08-31',
    evidence: 'official-page',
  },

  /* Three
   * Source:  https://www.three.co.uk/support/roaming-and-calling-abroad/roaming-abroad/go-roam
   * Checked: 2026-08-31. Two independent passes agreed on the figures recorded below.
   * Official wording:
   *   "When roaming in a destination included with your plan, there's no need to
   *   purchase passes, or pay any daily roaming charges, simply use your phone
   *   as you would at home. Our monthly fair use limit of 12GB applies when
   *   roaming in our Go Roam in Europe destinations."
   * Not recorded, the two passes did not agree:
   *   euIncluded: passes disagree (true vs false)
   */
  three: {
    network: 'three',
    euIncluded: null,
    euCapGB: 12,
    destinationCount: 49,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: "Value plans include Europe and Complete plans include over 160 destinations worldwide, but Lite plans still pay a daily roaming charge or need a Go Roam pass, and the Republic of Ireland is exempt from the 12GB cap.",
    source: "https://www.three.co.uk/support/roaming-and-calling-abroad/roaming-abroad/go-roam",
    checked: '2026-08-31',
    evidence: 'official-page',
  },

  /* EE
   * Source:  https://ee.co.uk/content/dam/help/terms-and-conditions/price-plans/mobile/pay-monthly-price-plans/ee-pay-monthly-plan-tncs-from-7-august-2025.pdf
   * Checked: 2026-08-31. Two independent passes agreed on the figures recorded below.
   * Official wording:
   *   "If your domestic data allowance is greater than 50GB, a fair usage policy
   *   of 50GB whilst roaming in the Europe zone will apply"
   * Not recorded, the two passes did not agree:
   *   euIncluded: passes disagree (false vs true)
   */
  ee: {
    network: 'ee',
    euIncluded: null,
    euCapGB: 50,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: "A daily charge applies to plans started on or after 7 July 2021 unless EU roaming is included with the plan, and older plans retain inclusive EU roaming, so terms differ by plan start date and tier.",
    source: "https://ee.co.uk/content/dam/help/terms-and-conditions/price-plans/mobile/pay-monthly-price-plans/ee-pay-monthly-plan-tncs-from-7-august-2025.pdf",
    checked: '2026-08-31',
    evidence: 'official-pdf',
  },

  /* SMARTY
   * Source:  https://smarty.co.uk/roaming/europe
   * Checked: 2026-08-31. Two independent passes agreed on the figures recorded below.
   * Official wording:
   *   "When you visit any country in the EU, you can still use your unlimited
   *   calls & texts and up to 12GB of mobile data from your monthly plan
   *   allowance at no extra cost."
   */
  smarty: {
    network: 'smarty',
    euIncluded: true,
    euCapGB: 12,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "Ireland is exempt from the 12GB cap, where the full monthly plan allowance applies to avoid inadvertent roaming charges on the Northern Ireland border.",
    source: "https://smarty.co.uk/roaming/europe",
    checked: '2026-08-31',
    evidence: 'official-page',
  },

  /* VOXI
   * Source:  https://www.voxi.co.uk/help/roaming-international/does-voxi-have-european-roaming
   * Checked: 2026-08-31. Two independent passes agreed on the figures recorded below.
   * Official wording:
   *   "European Roaming Passes are available from £2.45 a day, or at a reduced
   *   rate if you purchase an 8 or 15 day pass. [...] If you're travelling to
   *   Ireland, the Isle of Man, Iceland or Norway, you can use your inclusive
   *   plan data allowance (or 20GB, whichever is less), as well as unlimited
   *   minutes, texts and picture messages, and you won't need to buy a roaming
   *   pass."
   * Not recorded, the two passes did not agree:
   *   worldwideIncluded: re-check could not confirm (false)
   */
  voxi: {
    network: 'voxi',
    euIncluded: false,
    euCapGB: 20,
    destinationCount: null,
    dailyChargeGBP: 2.45,
    worldwideIncluded: null,
    note: "Ireland, the Isle of Man, Iceland and Norway sit in VOXI's Zone A and need no pass, while the rest of Europe is Zone B and requires a paid European Roaming Pass, with the 20GB cap applied as your plan allowance or 20GB, whichever is lower.",
    source: "https://www.voxi.co.uk/help/roaming-international/does-voxi-have-european-roaming",
    checked: '2026-08-31',
    evidence: 'official-page',
  },

  /* giffgaff: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   euCapGB: re-check could not confirm (5)
   *   destinationCount: re-check could not confirm (37)
   *   worldwideIncluded: re-check could not confirm (false)
   * Start here when re-checking: https://help.giffgaff.com/en/articles/229458-everything-you-need-to-know-about-roaming-in-the-eu
   */
  giffgaff: {
    network: 'giffgaff',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://help.giffgaff.com/en/articles/229458-everything-you-need-to-know-about-roaming-in-the-eu",
    checked: null,
    evidence: 'unverified',
  },

  /* iD Mobile: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   euCapGB: re-check could not confirm (30)
   *   destinationCount: re-check could not confirm (50)
   *   worldwideIncluded: re-check could not confirm (false)
   * Start here when re-checking: https://www.idmobile.co.uk/help-and-support/eu-roaming/fair-usage-policy
   */
  idmobile: {
    network: 'idmobile',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://www.idmobile.co.uk/help-and-support/eu-roaming/fair-usage-policy",
    checked: null,
    evidence: 'unverified',
  },

  /* Tesco Mobile: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   destinationCount: re-check could not confirm (48)
   *   worldwideIncluded: re-check could not confirm (false)
   * Start here when re-checking: https://www.tescomobile.com/why-tesco-mobile/awards-and-reviews/home-from-home
   */
  tesco: {
    network: 'tesco',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://www.tescomobile.com/why-tesco-mobile/awards-and-reviews/home-from-home",
    checked: null,
    evidence: 'unverified',
  },

  /* Lebara: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   euCapGB: re-check could not confirm (30)
   *   worldwideIncluded: re-check could not confirm (false)
   * Start here when re-checking: https://www.lebara.co.uk/en/roaming/roaming-rate-finder.html
   */
  lebara: {
    network: 'lebara',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://www.lebara.co.uk/en/roaming/roaming-rate-finder.html",
    checked: null,
    evidence: 'unverified',
  },

  /* Talkmobile: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   euCapGB: re-check could not confirm (5)
   *   destinationCount: re-check could not confirm (47)
   *   worldwideIncluded: re-check could not confirm (false)
   * Start here when re-checking: https://talkmobile.co.uk/roaming-in-europe
   */
  talkmobile: {
    network: 'talkmobile',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://talkmobile.co.uk/roaming-in-europe",
    checked: null,
    evidence: 'unverified',
  },

  /* 1pMobile: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   euCapGB: re-check could not confirm (14)
   *   destinationCount: re-check could not confirm (46)
   *   worldwideIncluded: re-check could not confirm (false)
   * Start here when re-checking: https://www.1pmobile.com/international-and-roaming
   */
  onep: {
    network: 'onep',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://www.1pmobile.com/international-and-roaming",
    checked: null,
    evidence: 'unverified',
  },

  /* Plusnet Mobile: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * Neither pass found any official statement of roaming terms.
   * Start here when re-checking: https://www.plus.net/help/plusnet-mobile-closed/
   */
  plusnet: {
    network: 'plusnet',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://www.plus.net/help/plusnet-mobile-closed/",
    checked: null,
    evidence: 'unverified',
  },

  /* Mozillion: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   destinationCount: re-check could not confirm (41)
   *   worldwideIncluded: re-check could not confirm (false)
   * Start here when re-checking: https://www.mozillion.com/resources/help/roaming-travel/
   */
  mozillion: {
    network: 'mozillion',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://www.mozillion.com/resources/help/roaming-travel/",
    checked: null,
    evidence: 'unverified',
  },

  /* Simp: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * Neither pass found any official statement of roaming terms.
   */
  simp: {
    network: 'simp',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: null,
    checked: null,
    evidence: 'unverified',
  },

  /* Honest Mobile: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   euCapGB: re-check could not confirm (20)
   * Start here when re-checking: https://honestmobile.co.uk/unlimited-plan/
   */
  honest: {
    network: 'honest',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://honestmobile.co.uk/unlimited-plan/",
    checked: null,
    evidence: 'unverified',
  },

  /* Revolut Mobile: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * A first pass proposed figures that an independent second pass could
   * not reproduce from official sources, so none of them are recorded:
   *   euIncluded: re-check could not confirm (true)
   *   euCapGB: re-check could not confirm (20)
   *   destinationCount: re-check could not confirm (30)
   *   worldwideIncluded: re-check could not confirm (false)
   * Start here when re-checking: https://www.revolut.com/mobile-plans/
   */
  revolut: {
    network: 'revolut',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://www.revolut.com/mobile-plans/",
    checked: null,
    evidence: 'unverified',
  },

  /* Klarna Mobile: NOT VERIFIED. Every figure left null on purpose.
   * Checked: 2026-08-31.
   * Neither pass found any official statement of roaming terms.
   * Start here when re-checking: https://www.klarna.com/uk/help/klarna-mobile/can-i-use-klarna-mobile-internationally/
   */
  klarna: {
    network: 'klarna',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: null,
    source: "https://www.klarna.com/uk/help/klarna-mobile/can-i-use-klarna-mobile-internationally/",
    checked: null,
    evidence: 'unverified',
  },
};

/** Mirrors the get() helper in packages/ui/networks.js. */
export const getRoaming = (key: string): NetworkRoaming | null => roaming[key] ?? null;
