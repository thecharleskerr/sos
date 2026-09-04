/* UK student SIM offers reference table.
 *
 * Hand-maintained, same rules as roaming.ts: every claim comes from the
 * network's own pages, anything unverified is null, and every entry carries
 * its source and check date. hasOffer is null when nothing official could be
 * found either way, false only when an official page says there is none.
 *
 * This is a reference of published student pricing, not feed deal data, so
 * it lives here rather than in content/, which changes only via the weekly
 * pull request.
 */

export interface StudentOffer {
  /** Key into the networks map in packages/ui/networks.js. */
  network: string;
  /** true: an official page describes a current offer. false: an official
   *  page says there is none. null: nothing official found either way. */
  hasOffer: boolean | null;
  /** One short sentence describing the offer. */
  offer: string | null;
  /** Percentage off, where the offer is a percentage. */
  discountPercent: number | null;
  /** A stated student monthly price in pounds, where one exists. */
  priceGBP: number | null;
  /** How you prove you are a student: UNiDAYS, Student Beans, TOTUM, direct. */
  via: string | null;
  /** Does the offer apply to SIM only plans? */
  simOnly: boolean | null;
  /** Eligibility, duration and exclusions in one sentence. */
  conditions: string | null;
  source: string | null;
  checked: string | null;
  evidence: 'official-page' | 'unverified';
}

export const studentOffers: Record<string, StudentOffer> = {

  /* O2
   * Source:  https://www.o2.co.uk/studentoffer
   * Checked: 2026-09-01. Quote-verified against the student offer page and
   * the Refresh airtime discount terms.
   * Official wording:
   *   "As a student you'll get 20% off your Airtime Plan when you buy a
   *   connected phone or tablet."
   *   "SIM only, Pay As You Go, Family Plans, Sharer Plans and O2 Business
   *   tariffs are not eligible for the Airtime Discount."
   */
  o2: {
    network: 'o2',
    hasOffer: true,
    offer: '20% off the Airtime Plan on an O2 Refresh phone or tablet contract.',
    discountPercent: 20,
    priceGBP: null,
    via: 'UNiDAYS',
    simOnly: false,
    conditions: 'Needs an active UNiDAYS, UNiDAYS GRADLiFE or TOTUM account, applies from the second bill until the device plan ends, and excludes SIM only, Pay As You Go, family, sharer and Ultimate plans.',
    source: 'https://www.o2.co.uk/studentoffer',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* Vodafone
   * Source:  https://support.vodafone.co.uk/Getting-started-and-upgrading/Vodafone-Discounts/Vodafone-Student-Discount/48188254/Which-plans-are-compatible-with-a-student-discount.htm
   * Also:    https://www.vodafone.co.uk/student-deals
   * Checked: 2026-09-01. Twenty vodafone.co.uk searches; the student deals
   * page, the student discount support articles and the discount terms FAQ
   * agree. The terms FAQ still names Phones 4 U and Carphone Warehouse, so
   * parts of it are stale; the plan list and the 10% figure are repeated on
   * the current support pages.
   * Official wording:
   *   "A 10% discount is available on 12- and 24-month pay monthly handset
   *   plans and 12-month SIM only plans."
   *   "To qualify, you must be enrolled at a UK educational institution,
   *   complete the online form, have a .ac.uk email or valid student
   *   documentation, log into your educational portal, and be verified by
   *   GoCertify, Student Beans or Unidays."
   *   "Please submit your form within 60 days of your new connection or
   *   upgrade."
   *   "You won't be able to get the discount on any of the following plans:
   *   30-day SIM only, Business, Data or broadband, Household, Pay as you go"
   */
  vodafone: {
    network: 'vodafone',
    hasOffer: true,
    offer: '10% off the line rental on 12 month SIM only plans and 12 or 24 month pay monthly phone plans, claimed through Vodafone\'s own online form.',
    discountPercent: 10,
    priceGBP: null,
    via: 'direct',
    simOnly: true,
    conditions: 'Enrolled at a UK institution with a .ac.uk email or student documents, verified by GoCertify, Student Beans or UNiDAYS, form submitted within 60 days of connecting, one connection per student, lasts the contract, and excludes 30 day SIM only, pay as you go and plans bought through third parties.',
    source: 'https://www.vodafone.co.uk/student-deals',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* Three
   * Source:  https://www.three.co.uk/offers/student-discount
   * Checked: 2026-09-01. Twenty three.co.uk searches, every result pointing
   * at the same official page. No UNiDAYS, Student Beans or TOTUM route is
   * mentioned in official content, so the claim is direct via ac.uk email.
   * The page also sells a Student Saver pay as you go SIM, £199 for ten
   * months of unlimited UK use, which is a one-off price rather than a
   * monthly one, so priceGBP stays null.
   * Official wording:
   *   "To be eligible for student discount at Three, you'll need to enter an
   *   active student ac.uk email address in the box towards the top of this
   *   page. In the basket, enter STUDY20 into the promo code box near the
   *   bottom."
   *   "You can save up to 20% on an airtime plan (your data, minutes, and
   *   texts), but device repayment costs are not eligible for the discount."
   *   "You can get 20% off all our SIMs, except our 120GB and 25GB SIMs when
   *   you choose a 24-month plan."
   *   "Your student discount will last for the duration of the contract
   *   period you sign up for."
   *   "You can only get a student discount when you take out a new plan."
   *   "Get 10 months of unlimited UK calls, texts and data for £199."
   */
  three: {
    network: 'three',
    hasOffer: true,
    offer: '20% off the airtime on SIM only and phone plans with the code STUDY20, plus a Student Saver pay as you go SIM at £199 for ten months of unlimited UK calls, texts and data.',
    discountPercent: 20,
    priceGBP: null,
    via: 'direct',
    simOnly: true,
    conditions: 'Active ac.uk email address, new plans only, lasts the contract you sign up for, device repayments excluded, and the 120GB and 25GB SIMs are excluded on a 24 month plan.',
    source: 'https://www.three.co.uk/offers/student-discount',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* EE
   * Source:  https://ee.co.uk/mobile/student-discount
   * Terms:   EE Student Discount Terms and Conditions from 21 April 2026 (PDF
   *          under ee.co.uk/content/dam/help/terms-and-conditions/).
   * Checked: 2026-09-01. Quote-verified against the student discount page and
   * the terms from 21 April 2026. The current terms name Student Beans only.
   * Official wording:
   *   "Students and key workers save by joining EE on pay monthly or SIM-only
   *   plans with 20% off their monthly phone plan."
   *   "Available to StudentBeans verified students, registered with a UK
   *   university."
   *   "The 20% discount will only apply to the plan's airtime charge and will
   *   last for a 24-month duration."
   *   "One single use code per person and per customer account"
   *   "The EE Student Discount is not compatible with All Rounder or Full
   *   Works SIM Only plans"
   */
  ee: {
    network: 'ee',
    hasOffer: true,
    offer: '20% off the monthly airtime charge on pay monthly, Flex Pay and SIM only plans, with a Student Beans code entered online at checkout.',
    discountPercent: 20,
    priceGBP: null,
    via: 'Student Beans',
    simOnly: true,
    conditions: 'Student Beans verified students at a UK university, online only, one code per person, lasts 24 months, and excludes All Rounder and Full Works SIM only plans, plans already on offer and other discounts on the same plan.',
    source: 'https://ee.co.uk/mobile/student-discount',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* SMARTY
   * NOT VERIFIED. Checked: 2026-09-01. Seventeen smarty.co.uk searches. The student landing page is
   * indexed with standard plan copy only. The one student terms PDF with
   * dates (UNiDAYS Unlimited at £15 for 12 months) states the offer "ran from
   * 00:01 GMT on 14 June 2023 up to 23:59 GMT on 11 December 2024". A later
   * student terms PDF exists but no snippet shows its dates or price, so
   * nothing official confirms a current offer.
   * Lead:    https://smarty.co.uk/student-sim
   */
  /* SMARTY
   * NOT VERIFIED as an offer. 2026-09-04, one agent: /student-sim is a
   * landing page that points students at the ordinary plans with no
   * student price, and the UNiDAYS unlimited offer ran 14 June 2023 to
   * 11 December 2024 and has ended. That is evidence of no current offer,
   * but no page says so outright, so the entry stays null.
   */
  smarty: {
    network: 'smarty', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: 'https://smarty.co.uk/student-sim', checked: null, evidence: 'unverified',
  },

  /* VOXI
   * Source:  https://www.voxi.co.uk/acquisition/students
   * Checked: 2026-09-01. Quote-verified against the students page and help
   * centre articles.
   * Official wording:
   *   "VOXI offers students flexible payments and 30-day rolling SIM only
   *   plans with Unlimited Social Media built-in, plus the first month is
   *   free."
   *   "VOXI's student offers are only available to new customers."
   */
  voxi: {
    network: 'voxi',
    hasOffer: true,
    offer: 'First month free on any 30 day rolling SIM only plan for new customers at a UK university, with a voucher code entered at checkout.',
    discountPercent: null,
    priceGBP: null,
    via: 'Student Beans',
    simOnly: true,
    conditions: 'New customers currently at or recently accepted to a UK university, code obtained via GoCertify on the VOXI site, UNiDAYS, Student Beans or UCAS, and the plan renews at full price after the free month unless cancelled.',
    source: 'https://www.voxi.co.uk/acquisition/students',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* giffgaff
   * Source:  https://www.giffgaff.com/terms/promotions
   * Also:    https://www.giffgaff.com/students
   * Checked: 2026-09-01. Twenty giffgaff.com searches. The students page
   * snippet still shows last year's promotion as ended; the promotions terms
   * page carries the new offer period, which is live today. No UNiDAYS,
   * Student Beans or TOTUM route: verification is a .ac.uk email address.
   * Official wording:
   *   "giffgaff is giving 100GB of data per month for 12 months to student
   *   members who purchase our £10 monthly rolling plan"
   *   "This offer commences on 4th August 2026 at 09:00 and ends on 4th
   *   August 2027 at 23:59."
   *   "Members must have a valid student email address (i.e.
   *   yourname@youruniversity.ac.uk) and, during the Offer Period, must
   *   purchase the Promo Plan or set it as their next plan"
   *   "After the end of the Benefit Period, the Promo Plan may no longer be
   *   available and members might be moved to a plan of equivalent price."
   */
  giffgaff: {
    network: 'giffgaff',
    hasOffer: true,
    offer: '100GB a month for 12 months on the £10 monthly rolling plan, for members registered with a .ac.uk email address.',
    discountPercent: null,
    priceGBP: 10,
    via: 'direct',
    simOnly: true,
    conditions: 'New and existing UK members over 18 with a .ac.uk email, one account per student email, buy the plan between 4 August 2026 and 4 August 2027 and keep it on auto renew, and after the 12 months you may be moved to a plan of equivalent price.',
    source: 'https://www.giffgaff.com/terms/promotions',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* iD Mobile
   * Source:  https://www.idmobile.co.uk/student-discount-sim/
   * Also:    https://www.idmobile.co.uk/student-discount
   * Checked: 2026-09-01. Fifteen idmobile.co.uk searches; three official
   * pages describe the same two offers. No official page states a
   * verification partner, contract length for the £15 SIM or how long the
   * student price lasts, so those fields stay null.
   * Official wording:
   *   "Unlimited ultra-fast 5G data, minutes and texts for just £15 a month"
   *   "Take £20 off the upfront cost on any iD Mobile phone contract, with
   *   £20 upfront or more!"
   */
  idmobile: {
    network: 'idmobile',
    hasOffer: true,
    offer: 'A student only SIM with unlimited 5G data, minutes and texts for £15 a month, or £20 off the upfront cost of a phone contract.',
    discountPercent: null,
    priceGBP: 15,
    via: null,
    simOnly: true,
    conditions: 'The £20 off applies only to phone contracts with an upfront cost of £20 or more; the contract length and how student status is checked are not stated on the official pages.',
    source: 'https://www.idmobile.co.uk/student-discount-sim/',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* Tesco Mobile
   * NOT VERIFIED. Checked: 2026-09-01. Eleven tescomobile.com searches surfaced Clubcard Prices,
   * Family Perks and Safe Start but no page that describes a student offer
   * or states there is none.
   */
  /* Tesco Mobile
   * NOT VERIFIED. 2026-09-04, one agent: no student page found, only
   * Clubcard Prices and the colleague discount. Absence from the index is
   * not a statement, so null.
   */
  tesco: {
    network: 'tesco', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* Lebara
   * NOT VERIFIED. Checked: 2026-09-01. Nineteen lebara.co.uk searches found an official page titled
   * "Student SIM Only Deals | Student Offers | Lebara UK", but its body is
   * not indexed (every result reports it needs JavaScript). No help, terms or
   * blog page states a price, plan or verification route, so a page title
   * alone is not enough to publish a claim.
   * Lead:    https://www.lebara.co.uk/en/student-offers.html
   */
  lebara: {
    network: 'lebara', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: 'https://www.lebara.co.uk/en/student-offers.html', checked: null, evidence: 'unverified',
  },

  /* Talkmobile
   * NOT VERIFIED. Checked: 2026-09-01. Two talkmobile.co.uk searches returned a blog post about
   * phones for students and standard SIM pages only.
   */
  talkmobile: {
    network: 'talkmobile', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* Sky Mobile
   * NOT VERIFIED. Checked: 2026-09-01. Fifteen sky.com searches. sky.com/students covers TV and
   * broadband only; no official Sky Mobile page describes a student offer or
   * states there is none.
   * Lead:    https://sky.com/students
   * 2026-09-04: Sky's own help forum carries "Sky does not offer student
   * discounts for students", a community answer rather than a Sky page,
   * so still null. Lead: https://helpforum.sky.com/t5/Sky-Mobile/Student-discount/td-p/5332484
   */
  sky: {
    network: 'sky', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: 'https://sky.com/students', checked: null, evidence: 'unverified',
  },

  /* BT Mobile
   * NOT VERIFIED. Checked: 2026-09-01. Not searched. BT Mobile no longer takes new customers, so
   * there is nothing a student could buy.
   */
  bt: {
    network: 'bt', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* Asda Mobile
   * Source:  https://mobile.asda.com/student-discount
   * Checked: 2026-09-01. Two mobile.asda.com searches; the student discount
   * page and its terms are indexed. The terms describe reduced pricing but
   * do not state the price or percentage, and name only unspecified
   * affiliate partners as the route, so via is null.
   * Official wording:
   *   "Asda Mobile offers a student discount on contract plans for 18+ UK
   *   customers who access the deal via affiliate partners, with reduced
   *   pricing available for the initial contract term (either 12 or 24
   *   months)"
   *   "For pay-as-you-go plans, students must purchase deals as
   *   auto-renewing plans and activate through their online account to
   *   receive reduced pricing for a consecutive 6-month duration"
   *   "After the promotional period ends, pricing reverts to standard rates
   *   on a monthly rolling basis"
   */
  asda: {
    network: 'asda',
    hasOffer: true,
    offer: 'Reduced pricing on SIM plans for the first 12 or 24 months of a contract, or for six months on an auto renewing pay as you go plan.',
    discountPercent: null,
    priceGBP: null,
    via: null,
    simOnly: true,
    conditions: 'UK customers aged 18 or over who reach the deal through Asda Mobile\'s student discount partners, one use per customer, not combinable with other offers, and pricing returns to the standard rate afterwards.',
    source: 'https://mobile.asda.com/student-discount',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* 1pMobile
   * NOT VERIFIED. Checked: 2026-09-01. Two 1pmobile.com searches returned a university tariff blog
   * post and a family bundle discount, but no student scheme.
   */
  onep: {
    network: 'onep', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* spusu
   * NOT VERIFIED. Checked: 2026-09-01. Two spusu.co.uk searches returned standard plan pages only.
   */
  spusu: {
    network: 'spusu', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* Lycamobile
   * Source:  https://www.lycamobile.co.uk/en/studentbeans/
   * Checked: 2026-09-01. Two lycamobile.co.uk searches; the Student Beans
   * page and a student SIM deals page are indexed. A page titled "15GB For
   * Only £3 | Student Discounts" also exists but its currency could not be
   * confirmed, so the £5 plan is the only price recorded.
   * Official wording:
   *   "To unlock this deal, you need to verify your student status through
   *   Student Beans, which is a quick and free process"
   *   "5 GB for £5 a Month"
   *   "This plan also includes unlimited UK minutes, SMS, 100 international
   *   minutes, and up to 5GB EU roaming"
   *   "Student plans have no contracts, offering flexibility to choose and
   *   switch plans as needed"
   */
  lyca: {
    network: 'lyca',
    hasOffer: true,
    offer: 'Student plans unlocked through Student Beans, including 5GB for £5 a month with unlimited UK minutes and texts and up to 5GB of EU roaming.',
    discountPercent: null,
    priceGBP: 5,
    via: 'Student Beans',
    simOnly: true,
    conditions: 'Student status verified through Student Beans, no contract and no credit check.',
    source: 'https://www.lycamobile.co.uk/en/studentbeans/',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* Mozillion
   * Source:  https://www.mozillion.com/students
   * Checked: 2026-09-01. Two mozillion.com searches; the students page is
   * indexed with a "How to claim your student discount" section but the
   * indexed text states no percentage, price or verification partner.
   * Official wording:
   *   "How to claim your student discount"
   *   "At Mozillion, students can save big time on their mobile bills"
   */
  mozillion: {
    network: 'mozillion',
    hasOffer: true,
    offer: 'A student discount on Mozillion SIM plans, claimed through its students page. The amount is not stated on the indexed page.',
    discountPercent: null,
    priceGBP: null,
    via: null,
    simOnly: true,
    conditions: null,
    source: 'https://www.mozillion.com/students',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* Simp
   * Source:  https://simpmobile.com/students
   * Checked: 2026-09-01. The students page is indexed under its title on the
   * official domain and its full text was supplied verbatim by the site
   * owner; the roaming figures it repeats match the quote-verified roaming
   * entry.
   * Official wording:
   *   "Students get Standard Unlimited for £10 a month, billed monthly, by
   *   verifying through Student Beans, the pay-upfront price without having
   *   to pay upfront."
   *   "unlimited UK data, calls and texts on both plans, fine for streaming
   *   and hotspotting, with a 750GB per month fair-use limit"
   */
  simp: {
    network: 'simp',
    hasOffer: true,
    offer: 'Standard Unlimited for £10 a month billed monthly, the pay upfront price without paying upfront, once verified through Student Beans.',
    discountPercent: null,
    priceGBP: 10,
    via: 'Student Beans',
    simOnly: true,
    conditions: 'Rolling monthly with no contract, unlimited data subject to a 750GB a month fair use limit, and Premium Unlimited stays at standard pricing.',
    source: 'https://simpmobile.com/students',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* Honest Mobile
   * Source:  https://honestmobile.co.uk/
   * Checked: 2026-09-01. Twenty honestmobile.co.uk searches. The homepage
   * index text invites students to enter a student email for a discount
   * code; no dedicated page, amount or verification partner was found, so
   * everything but the existence of the offer is null.
   * Official wording:
   *   "enter your student email address to get your discount code"
   */
  honest: {
    network: 'honest',
    hasOffer: true,
    offer: 'A discount code sent to your student email address. The amount is not stated on the indexed page.',
    discountPercent: null,
    priceGBP: null,
    via: 'direct',
    simOnly: true,
    conditions: null,
    source: 'https://honestmobile.co.uk/',
    checked: '2026-09-01',
    evidence: 'official-page',
  },

  /* Revolut Mobile
   * NOT VERIFIED. Checked: 2026-09-01. Two revolut.com searches returned banking promotions only
   * (a freshers account promotion, an expired UNiDAYS PDF), nothing about
   * Revolut Mobile.
   */
  revolut: {
    network: 'revolut', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* Klarna Mobile
   * NOT VERIFIED. Checked: 2026-09-01. Not searched; Klarna Mobile publishes no student pricing in
   * the help pages already checked for roaming.
   */
  klarna: {
    network: 'klarna', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* Utility Warehouse
   * NOT VERIFIED. Checked: 2026-09-01. Two uw.co.uk searches returned bundle and multi SIM discounts
   * only.
   */
  uw: {
    network: 'uw', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* Your Co-op Mobile
   * NOT VERIFIED. Checked: 2026-09-01. Two yourcoop.coop searches returned membership and welcome
   * rewards only.
   */
  coop: {
    network: 'coop', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },

  /* Ecotalk
   * NOT VERIFIED. Checked: 2026-09-01. Two ecotalk.co.uk searches returned standard plan pages only.
   */
  ecotalk: {
    network: 'ecotalk', hasOffer: null, offer: null, discountPercent: null, priceGBP: null, via: null, simOnly: null,
    conditions: null, source: null, checked: null, evidence: 'unverified',
  },
};

/** Mirrors the get() helper in packages/ui/networks.js. */
export const getStudentOffer = (key: string): StudentOffer | null => studentOffers[key] ?? null;

/* The featured student deal, in the shape DealCard renders. Built from
   Simp's students page on 2026-09-01; every figure in it is stated there.
   Rolling monthly, so the total is one month and the term is 1. */
export const featuredStudentDeal = {
  id: 'student-simp-standard-unlimited',
  site: 'sims',
  network: 'simp',
  hostNetwork: 'Three',
  merchant: 'Simp',
  monthlyPrice: 10,
  upfrontCost: 0,
  totalContractCost: 10,
  data: 'unlimited',
  minutes: 'unlimited',
  texts: 'unlimited',
  contractLengthMonths: 1,
  fiveG: true,
  roaming: {
    euIncluded: true,
    euCapGB: 10,
    destinationCount: null,
    dailyChargeGBP: null,
    worldwideIncluded: true,
    note: 'Worldwide roaming included too, data only, 3GB at 5G speed then unlimited at 4G.',
  },
  priceRise: { type: 'none', amountGBP: null, month: null, wording: 'No price rise' },
  url: 'https://simpmobile.com/students',
  isAffiliate: false,
  lastVerified: '2026-09-01',
  feedLastUpdated: '2026-09-01',
  pick: 'best-for-students',
  status: 'live',
};
