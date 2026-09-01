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
  /** Short verified wording for when no single GB figure exists, such as
   *  "None" or "Varies by plan". Only ever set on quote-verified evidence;
   *  absent or null otherwise, and the UI then shows To confirm. */
  euCapText?: string | null;
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
   *   "Zone B consists of 52 destinations, most of which are in Europe and are
   *   EU member states. For anyone with a Vodafone Pay Monthly plan that started
   *   on or after 11 August 2021, roaming costs £2.75 a day. All pay monthly
   *   plans are subject to a 25GB roaming fair use policy, meaning that if your
   *   UK allowance is greater than 25GB, you can use up to 25GB data a month
   *   while roaming."
   * The URL slug says 2022 but it is Vodafone's continuously updated roaming
   * guide, titled for the current year when checked.
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
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "European Roaming Passes are available from £2.45 a day, or at a reduced
   *   rate if you purchase an 8 or 15 day pass."
   *   "In the Europe Zone, your allowance of general-purpose data will have a
   *   roam fair use policy of 20GB, or your plan's allowance, whichever is less,
   *   per 30-day plan."
   *   "If you're travelling outside the Europe Zone, you'll need to buy a Global
   *   Roaming Pass."
   * The pass price and cap were first verified on 2026-08-31; the worldwide
   * field was added and quote-verified on 2026-09-01.
   */
  voxi: {
    network: 'voxi',
    euIncluded: false,
    euCapGB: 20,
    destinationCount: null,
    dailyChargeGBP: 2.45,
    worldwideIncluded: false,
    note: "Ireland, the Isle of Man, Iceland and Norway sit in VOXI's Zone A and need no pass, while the rest of Europe is Zone B and requires a paid European Roaming Pass, with the 20GB cap applied as your plan allowance or 20GB, whichever is lower.",
    source: "https://www.voxi.co.uk/help/roaming-international/does-voxi-have-european-roaming",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* giffgaff
   * Source:  https://help.giffgaff.com/en/articles/229458-everything-you-need-to-know-about-roaming-in-the-eu
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "Call and text just like at home in 37 EU Zone destinations, all at no
   *   extra cost. You'll also get up to 5GB of data to use."
   *   "When roaming around the EU and selected destinations, you get a maximum
   *   of 5GB of data included from your plan (subject to your plan having at
   *   least 5GB of UK data)"
   *   "Call and text just like at home in 37 EU Zone destinations, all at no
   *   extra cost."
   */
  giffgaff: {
    network: 'giffgaff',
    euIncluded: true,
    euCapGB: 5,
    destinationCount: 37,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "Inclusive roaming needs recent UK usage and lasts up to 63 days per trip, and data beyond the 5GB fair use limit costs 10p per MB.",
    source: "https://help.giffgaff.com/en/articles/229458-everything-you-need-to-know-about-roaming-in-the-eu",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* iD Mobile
   * Source:  https://www.idmobile.co.uk/help-and-support/eu-roaming
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "From 1 October 2024 and until further notice, all customers can use their
   *   full UK data allowance in Roam Free destinations, at no extra cost!"
   *   "customers who joined or upgraded to iD on or after 21st June 2023 can use
   *   up to 30GB data from their plan each month at no extra cost"
   *   "use your UK monthly allowances of minutes, text and data (up to 30GB) in
   *   50 destinations worldwide"
   * The 30GB figure is the standing fair use policy. A promotion running from
   * 1 October 2024 until further notice lets all customers use their full UK
   * allowance, so readers currently get more than the cap suggests.
   */
  idmobile: {
    network: 'idmobile',
    euIncluded: true,
    euCapGB: 30,
    destinationCount: 50,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "The 30GB fair use cap is suspended from 1 October 2024 until further notice, so all customers can currently use their full UK data allowance, and Ireland is excluded from the fair usage policy.",
    source: "https://www.idmobile.co.uk/help-and-support/eu-roaming",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Tesco Mobile
   * Source:  https://www.tescomobile.com/why-tesco-mobile/awards-and-reviews/home-from-home
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "use your UK data, minutes and texts in 48 destinations across the EU and
   *   beyond, at no extra cost"
   *   "Using data in rest of the world destinations is chargeable and can cost
   *   up to £5 per MB"
   */
  tesco: {
    network: 'tesco',
    euIncluded: true,
    euCapGB: null,
    euCapText: 'None',
    destinationCount: 48,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "Home From Home was due to stop in 2026 but Tesco Mobile is letting it roll on. There is no GB cap, only a travel pattern fair usage policy: roaming more than two months in any rolling four adds a 0.35p per MB surcharge until the pattern falls back.",
    source: "https://www.tescomobile.com/why-tesco-mobile/awards-and-reviews/home-from-home",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Lebara
   * Source:  https://www.lebara.co.uk/en/roaming/roaming-rate-finder.html
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "Roaming in Europe is included with all Lebara SIM Only plans (up to
   *   30GB)."
   *   "If you use your plan outside the EU or India when roaming, standard
   *   roaming charges will apply."
   */
  lebara: {
    network: 'lebara',
    euIncluded: true,
    euCapGB: 30,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "The zone is stated as 36 plus EU and EEA countries rather than an exact count, Roam Like Home also covers India within the same 30GB cap, and a fair use surcharge of 0.20p per MB applies if EU roaming exceeds UK usage over any continuous 120 day period.",
    source: "https://www.lebara.co.uk/en/roaming/roaming-rate-finder.html",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Talkmobile
   * Source:  https://talkmobile.co.uk/roam-charges
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "You can use your UK minutes, texts and data allowance in Talkmobile's
   *   European roaming zone A at no extra cost."
   *   "With your SIM Only deal, you can use your allowance to call, text and use
   *   up to 5GB of data at no extra cost in European roaming destinations"
   *   "All of Talkmobile's SIM-Only deals offer Inclusive Roaming within the EU,
   *   which accounts for 47 popular European destinations, including France,
   *   Germany, Ireland, Italy and dozens more."
   */
  talkmobile: {
    network: 'talkmobile',
    euIncluded: true,
    euCapGB: 5,
    destinationCount: 47,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "A 5GB fair use limit applies in Zone A, above which a paid Euro Holiday Booster is needed, and roaming for 61 or more days in any 120 day period can attract a £7 weekly surcharge.",
    source: "https://talkmobile.co.uk/roam-charges",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Sky Mobile
   * Source:  https://www.sky.com/shop/mobile/roaming
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "For just £2 a day, Sky customers can use their UK data, calls and texts
   *   as if they were still in the UK."
   *   "When you roam using Sky's Roaming Passport Plus, up to 25GB per billing
   *   period is considered a reasonable amount of data to use."
   *   "For £2 a day, you can use your UK data, calls, and text allowances as if
   *   you are still in the UK and stay connected across 120 destinations."
   * Roaming Passport Plus is one global zone: the same £2 a day covers the EU
   * and worldwide destinations alike.
   */
  sky: {
    network: 'sky',
    euIncluded: false,
    euCapGB: 25,
    destinationCount: 120,
    dailyChargeGBP: 2,
    worldwideIncluded: false,
    note: "Roaming Passport Plus is a single global zone, so the 120 destinations span the EU, EEA and worldwide, with data beyond the 25GB fair use limit charged at £2.50 per GB and countries outside the zone billed at rest of world rates.",
    source: "https://www.sky.com/shop/mobile/roaming",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* BT Mobile
   * Source:  https://www.bt.com/help/mobile/going-abroad/using-bt-mobile-abroad/what-is-roam-like-home-
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "Roam Like Home lets you use your mobile abroad in 47 destinations without
   *   paying extra roaming charges."
   */
  bt: {
    network: 'bt',
    euIncluded: true,
    euCapGB: null,
    euCapText: '15GB or 25GB',
    destinationCount: 47,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: "BT Mobile is closed to new customers, with bt.com now selling EE plans instead. Roam Like Home terms remain published for existing customers, with a tiered roaming fair use cap of 15GB on plans up to 32GB and 25GB above that.",
    source: "https://www.bt.com/help/mobile/going-abroad/using-bt-mobile-abroad/what-is-roam-like-home-",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Plusnet Mobile
   * NOT VERIFIED. Every figure left null on purpose. Checked: 2026-09-01.
   * plus.net states verbatim that Plusnet Mobile has now closed, with services
   * ended from June 2024.
   */
  plusnet: {
    network: 'plusnet',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: "Plusnet Mobile has closed and sells no mobile plans: the official help page states Plusnet Mobile has now closed, services ended from June 2024, and Plusnet points customers to EE SIM only deals.",
    source: "https://www.plus.net/help/plusnet-mobile-closed/",
    checked: null,
    evidence: 'unverified',
  },

  /* Asda Mobile
   * Source:  https://mobile.asda.com/roaming-calling-abroad
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "you will be able to use your bundle allowances for mobile data at no
   *   extra cost up to a fair use limit of 5GB per month"
   *   "at no extra cost up to a fair use limit of 5GB per month (or, if your
   *   bundle data cap is less than 5GB per month, up to your bundle data cap)"
   *   "use your data, minutes and texts as if you were in the UK in 46 European
   *   destinations"
   * The pay as you go unlimited page states 46 European destinations while an
   * indexed terms list enumerates around 36, so the stated marketing count is
   * recorded and the list needs manual reconciliation in the weekly pull.
   */
  asda: {
    network: 'asda',
    euIncluded: true,
    euCapGB: 5,
    destinationCount: 46,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "Allowances roam in 46 European destinations up to a 5GB monthly fair use cap, after which data costs 10p per MB, and roaming outside those destinations is charged at rest of world rates.",
    source: "https://mobile.asda.com/roaming-calling-abroad",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* 1pMobile
   * Source:  https://www.1pmobile.com/international-and-roaming
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "1pMobile includes EU roaming as standard on all plans - no hidden fees,
   *   no daily surcharges."
   *   "There is a cap of 14GB when using the data in the EU with
   *   roam-like-at-home. Any additional data used, over 14GB, will be charged at
   *   the standard rate of 1p a MB."
   *   "Take our amazing tariffs and Boosts with you when you travel to any of 46
   *   European destinations."
   */
  onep: {
    network: 'onep',
    euIncluded: true,
    euCapGB: 14,
    destinationCount: 46,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "Roam like at home is for periodic travel only: 1pMobile monitors time and usage abroad over a rolling 90 day period and reserves the right to a £1 per day surcharge, and Boosts do not work outside the EU.",
    source: "https://www.1pmobile.com/international-and-roaming",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* spusu
   * Source:  https://www.spusu.co.uk/roaming
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "use data, call and text within the EU for free"
   *   "The pulsing rate outside the EU is 60/1 for outgoing and incoming calls
   *   and for data it is 30kb/10kb"
   */
  spusu: {
    network: 'spusu',
    euIncluded: true,
    euCapGB: null,
    euCapText: 'Varies by plan',
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "Free EU roaming is fair use capped at roughly 6GB to 10GB depending on plan, and Iceland, Liechtenstein, Norway and Switzerland are included in the free roaming zone.",
    source: "https://www.spusu.co.uk/roaming",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Lycamobile
   * Source:  https://www.lycamobile.co.uk/en/euroaming/
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "As of 17 July 2023, all current Lyca Mobile Pay As You Go (PAYG) and Pay
   *   monthly plans come with EU Roaming included as standard."
   *   "When calling from outside the UK and EU, you'll be charged for calls,
   *   texts and data based on our international roaming rates."
   */
  lyca: {
    network: 'lyca',
    euIncluded: true,
    euCapGB: null,
    euCapText: 'Varies by plan',
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "EU roaming allowances have fair use caps that vary by bundle, for example 12GB on some plans and 35GB on unlimited plans, so no single cap applies to all plans sold now.",
    source: "https://www.lycamobile.co.uk/en/euroaming/",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Mozillion
   * Source:  https://www.mozillion.com/resources/help/roaming-travel/
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "You can use your included Mozillion calls, texts and data roaming
   *   allowance in 41 EU destinations including Spain, France, Portugal,
   *   Ireland, Greece, Poland, Italy, Germany, Netherlands"
   *   "You can use your included Mozillion calls, texts and data roaming
   *   allowance in 41 EU destinations"
   *   "You can also roam with your Mozillion plan in 200+ countries, including
   *   USA, Mexico, Canada, India, Australia and more (charges apply)."
   */
  mozillion: {
    network: 'mozillion',
    euIncluded: true,
    euCapGB: null,
    euCapText: 'Varies by plan',
    destinationCount: 41,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "The EU fair use data cap varies by plan tier, roughly a quarter of the monthly allowance on mid tier plans and 25GB on unlimited plans, and roaming beyond the EU is charged via Mozillion Wallet credit.",
    source: "https://www.mozillion.com/resources/help/roaming-travel/",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Simp
   * NOT VERIFIED. Every figure left null on purpose. Checked: 2026-09-01.
   * simp.co.uk has no indexed content at all and simp.com is a parked domain
   * for sale page, so there is no official source to verify anything against.
   */
  simp: {
    network: 'simp',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: "No official Simp site is indexed at all: simp.co.uk returns nothing and simp.com is a parked domain for sale page, so no official wording exists to verify anything against.",
    source: null,
    checked: null,
    evidence: 'unverified',
  },

  /* Honest Mobile
   * Source:  https://join.honestmobile.co.uk/honest-plans
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "you can call and text UK numbers as normal and use your normal data
   *   allowance up to a maximum of 20GB per month while you're in the EU"
   *   "When travelling in the EU, you can use your standard plan up to 20GB per
   *   month"
   */
  honest: {
    network: 'honest',
    euIncluded: true,
    euCapGB: 20,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: "EU roaming has a fair usage limit of 60 days, so you can roam at no extra cost for a maximum of two months before additional charges apply.",
    source: "https://join.honestmobile.co.uk/honest-plans",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Revolut Mobile
   * Source:  https://www.revolut.com/mobile-plans/
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "Get 20 GB of travel data, plus calls and texts to use every month in 30
   *   EU countries and the US."
   *   "If you're outside the EEA and US, you can stay in touch with Messaging
   *   Pass in 100+ countries."
   */
  revolut: {
    network: 'revolut',
    euIncluded: true,
    euCapGB: 20,
    destinationCount: 30,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "Roaming is capped at 20GB a month in 30 EU countries plus the US, and outside the EEA and US only a restricted bandwidth Messaging Pass is included.",
    source: "https://www.revolut.com/mobile-plans/",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Klarna Mobile
   * NOT VERIFIED. Every figure left null on purpose. Checked: 2026-09-01.
   * The UK plan is promoted through a waitlist page and the help centre
   * indexes only article titles.
   */
  klarna: {
    network: 'klarna',
    euIncluded: null,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: "Klarna Mobile's UK plan is still promoted through a waitlist page and its help centre indexes only article titles, so no official wording states any roaming allowance, cap, charge or host network.",
    source: "https://www.klarna.com/uk/help/klarna-mobile/can-i-use-klarna-mobile-internationally/",
    checked: null,
    evidence: 'unverified',
  },

  /* Utility Warehouse
   * Source:  https://uw.co.uk/mobile/roaming-costs
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "stream, text, and call home from 45 locations in Europe"
   */
  uw: {
    network: 'uw',
    euIncluded: null,
    euCapGB: null,
    euCapText: 'Varies by tariff',
    destinationCount: 45,
    dailyChargeGBP: null,
    worldwideIncluded: null,
    note: "Inclusive EU roaming varies by tariff: Unlimited tiers roam at no extra cost with a 14GB fair use cap, Essential tiers include smaller roaming allowances, and tariffs without inclusive roaming pay £2 a day with an 8GB cap.",
    source: "https://uw.co.uk/mobile/roaming-costs",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Your Co-op Mobile
   * Source:  https://broadband.yourcoop.coop/help-resources/roaming-charges/
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "Within the EU and selected other destinations, calls, texts and data are
   *   included in your bundle."
   *   "Within the EU and selected other destinations, calls, texts and data are
   *   included in your bundle, or charged as per UK use where bundles have not
   *   been applied or have been exhausted."
   */
  coop: {
    network: 'coop',
    euIncluded: true,
    euCapGB: null,
    euCapText: '25% of plan',
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: false,
    note: "EU roaming has a fair use cap of a quarter of your monthly data allowance, 25GB on unlimited plans, with use above the cap charged at 5p per MB. The EE host applies to the consumer service.",
    source: "https://broadband.yourcoop.coop/help-resources/roaming-charges/",
    checked: "2026-09-01",
    evidence: 'official-page',
  },

  /* Ecotalk
   * Source:  https://www.ecotalk.co.uk/faqs
   * Checked: 2026-09-01. Researched against the network's own domain, then
   * every figure independently quote-verified by a second pass.
   * Official wording:
   *   "When roaming in Europe, it costs £2 a day to use call, text and data
   *   services."
   *   "Data cannot be used when roaming outside of the EU."
   */
  ecotalk: {
    network: 'ecotalk',
    euIncluded: false,
    euCapGB: null,
    destinationCount: null,
    dailyChargeGBP: 2,
    worldwideIncluded: false,
    note: "A fair use policy has applied to EU roaming since 1st October 2025, and data cannot be used when roaming outside the EU.",
    source: "https://www.ecotalk.co.uk/faqs",
    checked: "2026-09-01",
    evidence: 'official-page',
  },
};

/** Mirrors the get() helper in packages/ui/networks.js. */
export const getRoaming = (key: string): NetworkRoaming | null => roaming[key] ?? null;
