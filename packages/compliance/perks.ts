/* Perk and reward schemes by network, in the network's own words. From the
 * research behind the perks guide (checked 2026-09-02 by a writer and an
 * independent fact refuter). A scheme's stated standing offers are recorded;
 * marketing claims of value are not. */

export interface NetworkPerks {
  network: string;
  /** The scheme's name, or null where the network runs none we found. */
  scheme: string | null;
  /** What the network's page says it gives, in one or two sentences. */
  detail: string | null;
  /** Who can use it. */
  eligibility: string | null;
  source: string | null;
  checked: string | null;
  evidence: 'official-page' | 'unverified';
}

const unverified = (network: string): NetworkPerks => ({ network, scheme: null, detail: null, eligibility: null, source: null, checked: null, evidence: 'unverified' });

export const perks: Record<string, NetworkPerks> = {
  /* "Priority is a free service and it's exclusive to O2 mobile and Virgin Media broadband customers." "a Greggs hot drink (RRP at £4.20) or savoury treat (RRP at £3.95) for just £1 every week, up to four times a month" "four Vue tickets (regular single ticket RRP at £13.99) for £18, once per month" */
  o2: { network: 'o2', scheme: 'O2 Priority', detail: 'Free. Standing offers on its page include a Greggs hot drink or savoury treat for £1 a week up to four times a month, four Vue cinema tickets for £18 once a month, and ticket presales.', eligibility: 'O2 mobile and Virgin Media broadband customers aged 16 and over.', source: 'https://www.o2.co.uk/priority', checked: '2026-09-02', evidence: 'official-page' },
  /* "the 2-for-£10 Cineworld offer provides 1 code per week for 2 x adult 2D screening standard seat Cineworld movie tickets for £10" */
  three: { network: 'three', scheme: 'Three+', detail: 'Two adult 2D Cineworld tickets for £10, one code a week, plus presales for festivals, gigs and comedy. Offers change; the app carries the current terms.', eligibility: 'Three pay monthly, active pay as you go, home broadband and business customers.', source: 'https://www.three.co.uk/why-three/threeplus', checked: '2026-09-02', evidence: 'official-page' },
  /* "Every week, it is packed with treats, offers and discounts. Prize draws are also available" */
  vodafone: { network: 'vodafone', scheme: 'VeryMe Rewards', detail: 'Weekly treats, offers, discounts and prize draws in the My Vodafone app. No standing offer with a stated value on its page.', eligibility: 'Pay monthly customers, pay as you go customers topping up at least £10 every six weeks, and small business customers.', source: 'https://www.vodafone.co.uk/my-vodafone-account/my-vodafone-app/vodafone-veryme-rewards', checked: '2026-09-02', evidence: 'official-page' },
  /* "Inclusive Extras are the amazing benefits included in our Full Works and All Rounder plans ... you can even swap them every 30 days." */
  ee: { network: 'ee', scheme: 'Inclusive Extras', detail: 'One subscription included on All Rounder or Full Works plans, swappable every 30 days: Apple Music, Apple TV, Netflix Standard with adverts or Google AI Plus on All Rounder; Apple One, Netflix Premium, Google AI Pro, Xbox Game Pass Ultimate or TNT Sports on Full Works.', eligibility: 'All Rounder and Full Works plans.', source: 'https://ee.co.uk/inclusive-extras', checked: '2026-09-02', evidence: 'official-page' },
  /* "You can earn Payback points by bringing mates to giffgaff or helping out on the community. ... 1 Payback point equals £0.01" */
  giffgaff: { network: 'giffgaff', scheme: 'Payback', detail: 'Points for referring friends or helping on the community, one point worth 1p, paid in June and December as cash, credit or a matched charity donation.', eligibility: 'giffgaff members.', source: 'https://www.giffgaff.com/payback', checked: '2026-09-02', evidence: 'official-page' },
  /* "Unlimited Social Media is included in all plans ... Snapchat, Instagram, WhatsApp, Facebook, Twitter, Pinterest and Facebook Messenger" */
  voxi: { network: 'voxi', scheme: 'Unlimited Social Media', detail: 'Snapchat, Instagram, WhatsApp, Facebook, Twitter, Pinterest and Facebook Messenger do not use your data in the UK. Calls in those apps are not included and some general data must remain.', eligibility: 'All VOXI plans.', source: 'https://www.voxi.co.uk/help/plans-extras/whats-included-unlimited-social-media', checked: '2026-09-02', evidence: 'official-page' },
  /* "Anyone who has a Tesco Clubcard can link it to their Tesco Mobile account and enjoy special Clubcard Prices." "collect 1 Clubcard point for every £1" "Double the value of your Clubcard points when you use them to pay your bill" */
  tesco: { network: 'tesco', scheme: 'Clubcard Prices and points', detail: 'Clubcard Prices on selected deals, which freeze the basic monthly price for the minimum term, one Clubcard point per £1 of bill, and double value when points pay the bill or buy a phone.', eligibility: 'Anyone with a Tesco Clubcard linked to their Tesco Mobile account.', source: 'https://www.tescomobile.com/why-tesco-mobile/supermarket-value/clubcard-prices', checked: '2026-09-02', evidence: 'official-page' },
  /* "Any unused data will roll back to your piggybank ... Unused data lasts for 12 months, with no limit" */
  sky: { network: 'sky', scheme: 'Sky Piggybank', detail: 'Unused data rolls into the Piggybank automatically each billing date, keeps for 12 months with no limit, and can be spent in whole gigabytes or cashed in for money off phones, tablets and accessories. Not on Unlimited Data plans.', eligibility: 'Sky Mobile customers on capped data plans.', source: 'https://www.sky.com/help/articles/sky-mobile-sky-piggybank', checked: '2026-09-02', evidence: 'official-page' },
  /* "For each friend you refer who joins SMARTY and renews for a second month, you and your friend can each earn up to £20 in gift cards." */
  smarty: { network: 'smarty', scheme: 'Refer a friend', detail: 'Up to £20 in John Lewis, Amazon or Uber gift cards each for you and a friend who joins and renews for a second month; the amount depends on the plan.', eligibility: 'SMARTY customers.', source: 'https://smarty.co.uk/refer-a-friend', checked: '2026-09-02', evidence: 'official-page' },
  idmobile: unverified('idmobile'), lebara: unverified('lebara'), talkmobile: unverified('talkmobile'), bt: unverified('bt'), asda: unverified('asda'),
  onep: unverified('onep'), spusu: unverified('spusu'), lyca: unverified('lyca'), mozillion: unverified('mozillion'), simp: unverified('simp'), honest: unverified('honest'),
  revolut: unverified('revolut'), klarna: unverified('klarna'), uw: unverified('uw'), coop: unverified('coop'), ecotalk: unverified('ecotalk'),
};
export const getPerks = (key: string): NetworkPerks | null => perks[key] ?? null;
