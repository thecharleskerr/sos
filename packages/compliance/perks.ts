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
  /* The seven below were found by one agent on 2026-09-04 from each
     network's own pages; the second, independent check is listed in
     docs/TODO.md. The amounts are quoted as the pages state them:
     Talkmobile: "If your friend purchases a 12-month plan you will both receive a reward of £30, and if your friend purchases a 30-day plan you will both receive a reward of £20."
     Asda: "Receive 2% of your monthly bill into your Asda Reward Cashpot on 12-month contracts and 5% on 24-month contracts."
     1pMobile: "You receive a £5 bonus for referring someone once their account has been live for 30 days."
     Lycamobile: "the participant may be eligible for a cash reward of up to £65 ... New customers who sign-up via your link receive a 50% discount off their plan for the first (3) months"
     Mozillion: "Earn £30 when someone buys a Pay Monthly Phone Contract, £15 when someone buys a Pay Monthly SIM Only Plan, and £5 when someone buys a Pay Monthly Plus SIM Only Plan."
     Honest: "your loyalty discount increasing by 5% every year, capped at 30%."
     Your Co-op: "you can claim up to £25 as a welcome reward when choosing a SIM only plan as a member" and "Refer a friend and get £20 credit on your account" */
  talkmobile: { network: 'talkmobile', scheme: 'Refer a friend', detail: '£30 each for you and a friend who takes a 12 month plan, or £20 each on a 30 day plan, as an Amazon gift card once both of you have made two consecutive monthly payments.', eligibility: 'Talkmobile customers and the friends they refer.', source: 'https://talkmobile.co.uk/friend-deals', checked: '2026-09-04', evidence: 'official-page' },
  asda: { network: 'asda', scheme: 'Asda Rewards Cashpot', detail: 'Cash, not points, paid into your Asda Rewards Cashpot every month: 2% of the monthly bill on a 12 month contract and 5% on a 24 month contract.', eligibility: 'Contract customers with an Asda Rewards account.', source: 'https://mobile.asda.com/help/bundles-and-pricing/plan-howdoesrewardswork', checked: '2026-09-04', evidence: 'official-page' },
  onep: { network: 'onep', scheme: 'Friends of Penny referral', detail: '£5 of credit once the friend you referred has been live for 30 days, with both of you rewarded as top up credit; surplus rewards can be paid to a bank account once a month.', eligibility: '1pMobile customers.', source: 'https://www.1pmobile.com/refer-a-friend', checked: '2026-09-04', evidence: 'official-page' },
  lyca: { network: 'lyca', scheme: 'Lyca Rewards and refer a friend', detail: 'Partner discounts through Lyca Rewards, and a refer a friend cash reward of up to £65 per referral paid to your bank account, with the friend getting 50% off their first three months.', eligibility: 'Lycamobile customers.', source: 'https://www.lycamobile.co.uk/en/refer-a-friend/', checked: '2026-09-04', evidence: 'official-page' },
  mozillion: { network: 'mozillion', scheme: 'Kill Your Bill cashback and refer a friend', detail: 'Cashback from shopping with over 200 brands through the app comes off the phone bill, and referrals pay £30 for a phone contract, £15 for a SIM only plan or £5 for a SIM only Plus plan.', eligibility: 'Mozillion customers.', source: 'https://www.mozillion.com/resources/refer-a-friend/', checked: '2026-09-04', evidence: 'official-page' },
  honest: { network: 'honest', scheme: 'Loyalty discount', detail: 'The bill falls the longer you stay: the loyalty discount grows by 5% a year up to 30% off.', eligibility: 'All Honest Mobile customers.', source: 'https://join.honestmobile.co.uk/bills-reducing-esim', checked: '2026-09-04', evidence: 'official-page' },
  coop: { network: 'coop', scheme: 'Co-op membership rewards', detail: 'Member pricing at checkout, a welcome reward of up to £25 on a SIM only plan, and £20 of credit for referring a friend.', eligibility: 'Co-op members, with the membership number entered at checkout.', source: 'https://broadband.yourcoop.coop/membership/', checked: '2026-09-04', evidence: 'official-page' },
  /* spusu: no scheme found on its pages on 2026-09-04, which is not the
     same as a page saying there is none, so it stays unverified. */
  idmobile: unverified('idmobile'), lebara: unverified('lebara'), bt: unverified('bt'), spusu: unverified('spusu'), simp: unverified('simp'),
  revolut: unverified('revolut'), klarna: unverified('klarna'), uw: unverified('uw'), ecotalk: unverified('ecotalk'),
};
export const getPerks = (key: string): NetworkPerks | null => perks[key] ?? null;
