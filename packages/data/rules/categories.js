/* The category pages: one per buying intent, each a filter and a sort over
   this week's live deals plus the words that explain the rule. The copy
   states rules, never figures, so it stays true whatever the feed says. */
import { gb, byPrice, byValue, MIN_USEFUL_GB } from './picks.mjs';

const byCap = (a, b) => (b.roaming.euCapGB ?? -1) - (a.roaming.euCapGB ?? -1) || byPrice(a, b);

export const categories = {
  cheapest: {
    title: 'Cheapest SIM only deals',
    h1: 'Cheapest SIM only deals this week',
    query: 'cheapest SIM only deal',
    description: 'The cheapest SIM only deals we checked this week, ranked by what you pay each month over the whole term, with the price rise and roaming on every card.',
    answer: `The cheapest SIM only deal is the one with the lowest cost per month over the whole term, upfront included, on a plan with at least ${MIN_USEFUL_GB}GB. That is how these are ranked, and every card shows the mid-contract price rise in pounds and pence.`,
    filter: (d) => gb(d) >= MIN_USEFUL_GB,
    sort: byPrice,
    faq: [
      { q: 'How do you rank the cheapest SIM only deals?', a: `By effective monthly cost: the total over the term, including any upfront cost, divided by the number of months. Plans under ${MIN_USEFUL_GB}GB are left out because a plan you cannot use is not cheap.` },
      { q: 'Does the cheapest deal include the price rise?', a: 'The ranking uses the price you sign up at. Every card states the mid-contract rise in pounds and pence, or says there is none, so you can add it for the months after it lands.' },
      { q: 'Is a rolling plan cheaper than a contract?', a: 'Often, because there is no term to pay out and no mid-contract rise, but not always. The cards show the same total-cost figure for both, so compare on that.' },
    ],
    guides: ['sim-only-vs-contract-which-is-cheaper', 'mid-contract-price-rises-explained', 'best-uk-network-for-data'],
  },
  'unlimited-data': {
    title: 'Unlimited data SIM only deals',
    h1: 'Unlimited data SIM only deals',
    query: 'unlimited data SIM only deal',
    description: 'Unlimited data SIM only deals we checked this week, cheapest first, with each network\'s fair use rule, roaming cap and price rise on the card.',
    answer: 'Unlimited on every UK network comes with a fair use policy and, on some, a speed tier. These are the unlimited plans in this week\'s checked set, cheapest effective monthly cost first.',
    filter: (d) => d.data === 'unlimited',
    sort: byPrice,
    faq: [
      { q: 'Is unlimited data really unlimited?', a: 'Every network publishes a fair use policy, usually a monthly threshold for personal use and a limit on tethered devices, and some sell unlimited in speed tiers. Our guide to unlimited data lists what each network\'s own pages say.' },
      { q: 'Does unlimited data work abroad?', a: 'Not as unlimited. Every network caps roaming data with a fair use limit, and some charge by the day in the EU. Each card shows the roaming allowance, and the roaming table covers all 25 networks.' },
      { q: 'Who needs unlimited data?', a: 'People who stream video on mobile data or tether a laptop most days. If your last three bills show usage well under a capped plan, the cheapest category is the better buy.' },
    ],
    guides: ['is-unlimited-data-worth-it', 'best-uk-network-for-data', 'best-sim-only-deal-for-eu-roaming'],
  },
  'no-contract': {
    title: 'No contract SIM only deals',
    h1: 'No contract, rolling monthly SIM only deals',
    query: 'no contract SIM only deal',
    description: 'One month rolling SIM only deals we checked this week: leave whenever you like, no mid-contract price rise, cheapest first.',
    answer: `A rolling plan renews every month and you can leave whenever you like, so there is no term to pay out and no mid-contract price rise. These are the rolling plans in this week\'s checked set with at least ${MIN_USEFUL_GB}GB, cheapest first.`,
    filter: (d) => d.contractLengthMonths === 1 && gb(d) >= MIN_USEFUL_GB,
    sort: byPrice,
    faq: [
      { q: 'Can I keep my number on a rolling SIM?', a: 'Yes. Text PAC to 65075 from your old phone, give the code to the new network, and Ofcom says the number moves within one working day. Our switching guide walks through it.' },
      { q: 'Do rolling plans have credit checks?', a: 'Some networks say they run none on a rolling plan paid up front. Where a network states its policy on its own pages, the network page here says so; otherwise it is not stated.' },
      { q: 'Can a rolling plan go up in price?', a: 'There is no mid-contract rise because there is no contract, but a network can change the price of a rolling plan with notice. Where a network states that it does not raise prices, the card says no price rise.' },
    ],
    guides: ['how-to-switch-mobile-network-and-keep-your-number', 'esim-uk-which-networks-offer-it', 'sim-only-vs-contract-which-is-cheaper'],
  },
  'eu-roaming-included': {
    title: 'SIM only deals with EU roaming included',
    h1: 'SIM only deals with EU roaming included',
    query: 'SIM only deal with EU roaming',
    description: 'SIM only deals we checked this week with EU roaming included and no daily charge, ranked by the fair use cap, with the cap and the price rise on every card.',
    answer: 'These deals include EU roaming with no daily charge, ranked by the fair use cap the network publishes, highest first. A cap the network does not state ranks below any stated cap.',
    filter: (d) => d.roaming.euIncluded === true && d.roaming.dailyChargeGBP === null,
    sort: byCap,
    faq: [
      { q: 'What is a roaming fair use cap?', a: 'The most data you can use abroad in a month before charges or a cut-off, whatever your UK allowance. It is often lower than the UK allowance, which is why the card shows it separately.' },
      { q: 'Which networks charge by the day in the EU?', a: 'Several, and the daily rate is on their own pages. Our EU roaming table lists all 25 networks with the daily charge, the cap and what a week in Spain costs.' },
      { q: 'Does included roaming cover the whole of Europe?', a: 'Each network defines its own zone. Most cover the EU and a few neighbours, and some treat Switzerland or Ireland differently. The network\'s own page, linked from each network page here, has the list.' },
    ],
    guides: ['best-sim-only-deal-for-eu-roaming', 'esim-uk-which-networks-offer-it', 'which-uk-network-has-the-best-perks'],
  },
  '5g': {
    title: '5G SIM only deals',
    h1: '5G SIM only deals',
    query: '5G SIM only deal',
    description: 'SIM only deals we checked this week that include 5G at no extra cost, ranked by value, with roaming and the price rise on every card.',
    answer: 'Every deal here includes 5G, and none of the networks we list charges extra for it. Whether you get 5G is a coverage question, so check your postcode before you pay for anything.',
    filter: (d) => d.fiveG === true,
    sort: byValue,
    faq: [
      { q: 'Do I pay more for 5G?', a: 'Not on the networks we checked. The networks\' own pages say 5G is included on SIM only at no extra cost. You need a 5G phone and 5G coverage where you are.' },
      { q: 'How do I check 5G coverage?', a: 'Ofcom\'s mobile coverage checker shows predicted indoor and outdoor 4G and 5G coverage by postcode for each of the four host networks. Check the host your brand runs on, which every network page here names.' },
      { q: 'Is 5G worth it?', a: 'It is worth having when it is free and available, which is the case on every deal here. It is never worth paying more for. Our 5G guide covers what it needs and what it changes.' },
    ],
    guides: ['do-i-need-5g', 'best-uk-network-for-data', 'cheapest-sim-only-deal-for-students'],
  },
  'no-price-rise': {
    title: 'SIM only deals with no price rise',
    h1: 'SIM only deals with no mid-contract price rise',
    query: 'SIM only deal no price rise',
    description: 'SIM only deals we checked this week where the network states no mid-contract price rise, cheapest first, with the network\'s own wording on every card.',
    answer: 'These deals carry no mid-contract price rise, as stated on the network\'s own pages. Everything else in this week\'s set shows its rise in pounds and pence, which since January 2025 is what Ofcom requires.',
    filter: (d) => d.priceRise.type === 'none',
    sort: byPrice,
    faq: [
      { q: 'What does no price rise mean?', a: 'The network states that the monthly price does not go up during the term, or the plan rolls monthly with no term at all. Where a network states a rise, every card shows it in pounds and pence.' },
      { q: 'Can a network still change the price?', a: 'A rolling plan can be repriced with notice, and a fixed-term plan cannot be raised beyond what the contract states. Ofcom says you can leave penalty free if a provider raises the price by more than the contract stated.' },
      { q: 'Which networks put prices up each year?', a: 'Our price rises guide lists what each network states, with the amount and the month, taken from the network\'s own pages. Several smaller networks state no rise at all.' },
    ],
    guides: ['mid-contract-price-rises-explained', 'how-to-get-out-of-a-phone-contract-early', 'sim-only-vs-contract-which-is-cheaper'],
  },
  '12-month': {
    title: '12 month SIM only deals',
    h1: '12 month SIM only deals',
    query: '12 month SIM only deal',
    description: '12 month SIM only deals we checked this week, cheapest first, with the total over the year, the price rise and roaming on every card.',
    answer: 'A 12 month plan usually costs less a month than the same allowance rolling, in return for a year\'s commitment. These are the 12 month plans in this week\'s checked set, cheapest first, with the total for the year on each card.',
    filter: (d) => d.contractLengthMonths === 12,
    sort: byPrice,
    faq: [
      { q: 'Is a 12 month SIM cheaper than rolling?', a: 'Usually per month, but the total is what matters. Every card here shows the total over 12 months, and the rolling category shows the same figure for one month, so compare the two.' },
      { q: 'What happens after 12 months?', a: 'Ofcom requires the network to tell you between 10 and 40 days before the end and to state its best deals. Most plans then roll monthly at the same or a higher price, so diarise the date.' },
      { q: 'Can I leave a 12 month SIM early?', a: 'Yes, by paying an early termination charge, which Ofcom says must not exceed the payments left. Our guide to leaving a contract early explains how the big networks calculate it.' },
    ],
    guides: ['sim-only-vs-contract-which-is-cheaper', 'how-to-get-out-of-a-phone-contract-early', 'mid-contract-price-rises-explained'],
  },
};

export const categoryKeys = Object.keys(categories);
