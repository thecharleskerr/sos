/* One recipe per network: the page that lists its SIM only plans, and how
   to find the plan cards on it. urlVerified says whether a person has
   watched the recipe work on the live page; until then the runner reports
   the page status and the card count so a wrong URL or a changed layout
   shows up in the weekly summary rather than as a silent empty week.

   Selectors are deliberately loose. The runner tries the recipe's own
   selector, then the generic list, and keeps any element whose text states
   a price and an allowance. */
export const GENERIC_SELECTORS = [
  '[class*="plan"]', '[class*="Plan"]', '[class*="tariff"]', '[class*="bundle"]', '[class*="deal"]',
  '[class*="card"]', '[class*="Card"]', '[class*="product"]', 'article', 'li',
];

export const recipes = [
  { network: 'smarty', merchant: 'SMARTY', urls: ['https://smarty.co.uk/sim-only-deals'], urlVerified: false },
  { network: 'giffgaff', merchant: 'giffgaff', urls: ['https://www.giffgaff.com/sim-only-plans'], urlVerified: false },
  { network: 'voxi', merchant: 'VOXI', urls: ['https://www.voxi.co.uk/plans'], urlVerified: false },
  { network: 'lebara', merchant: 'Lebara', urls: ['https://www.lebara.co.uk/en/sim-only-deals.html'], urlVerified: false },
  { network: 'idmobile', merchant: 'iD Mobile', urls: ['https://www.idmobile.co.uk/sim-only-deals'], urlVerified: false },
  { network: 'o2', merchant: 'O2', urls: ['https://www.o2.co.uk/sim-only'], urlVerified: false },
  { network: 'vodafone', merchant: 'Vodafone', urls: ['https://www.vodafone.co.uk/sim-only'], urlVerified: false },
  { network: 'three', merchant: 'Three', urls: ['https://www.three.co.uk/sim-only'], urlVerified: false },
  { network: 'tesco', merchant: 'Tesco Mobile', urls: ['https://www.tescomobile.com/sim-only-deals'], urlVerified: false },
  { network: 'talkmobile', merchant: 'Talkmobile', urls: ['https://www.talkmobile.co.uk/sim-only-deals'], urlVerified: false },
  { network: 'sky', merchant: 'Sky Mobile', urls: ['https://www.sky.com/shop/mobile/sim-only'], urlVerified: false },
  { network: 'asda', merchant: 'Asda Mobile', urls: ['https://mobile.asda.com/sim-only-deals'], urlVerified: false },
  { network: 'lyca', merchant: 'Lycamobile', urls: ['https://www.lycamobile.co.uk/en/sim-only-deals/'], urlVerified: false },
  { network: 'onep', merchant: '1pMobile', urls: ['https://www.1pmobile.com/'], urlVerified: false },
  { network: 'spusu', merchant: 'spusu', urls: ['https://www.spusu.co.uk/tariffs'], urlVerified: false },
  { network: 'mozillion', merchant: 'Mozillion', urls: ['https://www.mozillion.com/plans'], urlVerified: false },
  { network: 'simp', merchant: 'Simp', urls: ['https://simpmobile.com/plans'], urlVerified: false },
  { network: 'honest', merchant: 'Honest Mobile', urls: ['https://honestmobile.co.uk/plans'], urlVerified: false },
  { network: 'coop', merchant: 'Your Co-op Mobile', urls: ['https://www.yourcoop.coop/mobile/sim-only'], urlVerified: false },
  { network: 'ecotalk', merchant: 'Ecotalk', urls: ['https://www.ecotalk.co.uk/sim-only'], urlVerified: false },
  { network: 'uw', merchant: 'Utility Warehouse', urls: ['https://uw.co.uk/mobile'], urlVerified: false },
  /* EE is editorial only under hard rule 1, so it is scraped for the record
     and the normaliser drops it before it can reach the table. */
  { network: 'ee', merchant: 'EE', urls: ['https://ee.co.uk/mobile/sim-only-deals'], urlVerified: false },
];

/* Lead feeds. HotUKDeals publishes RSS by tag; the exact tag paths need
   confirming on first run. Leads are titles and links only. */
export const leadFeeds = [
  { name: 'HotUKDeals, SIM only', url: 'https://www.hotukdeals.com/rss/tag/sim-only' },
  { name: 'HotUKDeals, mobile phones', url: 'https://www.hotukdeals.com/rss/tag/mobile-phones' },
];
