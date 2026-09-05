/* The phones the phones site tracks, with the maker's UK recommended price
 * as the maker's own pages state it, dated. Same rules as the other tables:
 * a figure needs the maker's page and a quote, or it is null.
 *
 * Deal prices are never here. They come from the weekly feed. The maker's
 * price is the outright figure a contract's total is compared with.
 */

export interface TrackedPhone {
  slug: string;
  name: string;
  maker: 'Apple' | 'Samsung' | 'Google';
  /** UK recommended price in pounds for the base model, or null. */
  rrpGBP: number | null;
  /** Storage the price applies to, where stated. */
  storageGB: number | null;
  fiveG: boolean;
  /** The maker's stated software update commitment, in its own words. */
  updates: string | null;
  source: string;
  checked: string;
  evidence: 'official-page' | 'unverified';
}

export const phones: Record<string, TrackedPhone> = {

  /* iPhone 17
   * Source:  https://www.apple.com/uk/shop/buy-iphone/iphone-17
   * Checked: 2026-09-02, and again 2026-09-04 by a second agent, who
   * confirmed 256GB as the entry storage: "iPhone 17 256GB in Sage is
   * available for \u00a3799.00, from only \u00a326.63/mo at 0% APR."
   * Official wording: "The iPhone 17 starts from \u00a3799 ... You can also purchase it from \u00a326.63/month at 0% APR (second search: available for \u00a3799.00 or \u00a326.63 per month for 30 months at 0% APR)"
   */
  'iphone-17': {
    slug: 'iphone-17', name: 'iPhone 17', maker: 'Apple', rrpGBP: 799, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.apple.com/uk/shop/buy-iphone/iphone-17', checked: '2026-09-02', evidence: 'official-page',
  },
  /* iPhone 17 Pro and 17 Pro Max
   * Source:  https://www.apple.com/uk/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max-the-most-powerful-and-advanced-pro-models-ever/
   * Checked: 2026-09-04, two independent agents, the second on the UK buy
   * pages ("iPhone 17 Pro 256GB is available at £1,099.00", "iPhone 17
   * Pro Max with 256GB storage is available ... at £1,199.00").
   * Official wording: "iPhone 17 Pro starts at £1,099, and iPhone 17 Pro
   * Max starts at £1,199." and "iPhone 17 Pro will be available in 256GB,
   * as well as 512GB and 1TB storage capacities."
   */
  'iphone-17-pro': {
    slug: 'iphone-17-pro', name: 'iPhone 17 Pro', maker: 'Apple', rrpGBP: 1099, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.apple.com/uk/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max-the-most-powerful-and-advanced-pro-models-ever/', checked: '2026-09-04', evidence: 'official-page',
  },
  'iphone-17-pro-max': {
    slug: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max', maker: 'Apple', rrpGBP: 1199, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.apple.com/uk/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max-the-most-powerful-and-advanced-pro-models-ever/', checked: '2026-09-04', evidence: 'official-page',
  },
  /* iPhone Air
   * Source:  https://www.apple.com/uk/shop/buy-iphone/iphone-air
   * Checked: 2026-09-04, two independent agents. The Air is eSIM only,
   * with no physical SIM tray.
   * Official wording: "the iPhone Air 256GB is available for £999.00 in
   * the UK" and "iPhone Air 256GB in Sky Blue is available unlocked for
   * £999.00, or £33.30 per month for 30 months at 0% APR."
   */
  'iphone-air': {
    slug: 'iphone-air', name: 'iPhone Air', maker: 'Apple', rrpGBP: 999, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.apple.com/uk/shop/buy-iphone/iphone-air', checked: '2026-09-04', evidence: 'official-page',
  },
  /* iPhone 16 and 16 Plus
   * Source:  https://www.apple.com/uk/shop/buy-iphone/iphone-16
   * Checked: 2026-09-04, two independent agents; both found the phones
   * still sold new on the consumer store. The £699 seen for the iPhone 16
   * on one search is the Education Store price, not the consumer one.
   * Official wording: "iPhone 16 128GB is available starting from £599 on
   * Apple's UK shop" and "iPhone 16 Plus 128GB is priced at £699.00".
   */
  'iphone-16': {
    slug: 'iphone-16', name: 'iPhone 16', maker: 'Apple', rrpGBP: 599, storageGB: 128, fiveG: true,
    updates: null,
    source: 'https://www.apple.com/uk/shop/buy-iphone/iphone-16', checked: '2026-09-04', evidence: 'official-page',
  },
  'iphone-16-plus': {
    slug: 'iphone-16-plus', name: 'iPhone 16 Plus', maker: 'Apple', rrpGBP: 699, storageGB: 128, fiveG: true,
    updates: null,
    source: 'https://www.apple.com/uk/shop/buy-iphone/iphone-16', checked: '2026-09-04', evidence: 'official-page',
  },
  /* iPhone 16e: not entered. On 2026-09-04 its consumer buy page title had
     gone generic and a refurbished listing existed, consistent with the
     17e replacing it in March 2026, but no Apple statement says so. */

  /* iPhone 17e
   * Source:  https://www.apple.com/uk/newsroom/2026/03/apple-introduces-iphone-17e/
   * Checked: 2026-09-02, writer plus the fact refuter on the cheapest 5G phone guide.
   * Official wording: "iPhone 17e starts at £599 with 256GB of storage"
   */
  'iphone-17e': {
    slug: 'iphone-17e', name: 'iPhone 17e', maker: 'Apple', rrpGBP: 599, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.apple.com/uk/newsroom/2026/03/apple-introduces-iphone-17e/', checked: '2026-09-02', evidence: 'official-page',
  },

  /* Galaxy S26, S26 Plus, S26 Ultra
   * Source:  https://news.samsung.com/uk/galaxy-unpacked-2026-a-first-look-at-the-galaxy-s26-series-samsungs-most-intuitive-ai-phone-yet
   * Also:    https://www.samsung.com/uk/smartphones/galaxy-s26/buy/
   * Checked: 2026-09-02, two writers and a fact refuter, and again on
   * 2026-09-04 by a second agent, who confirmed 256GB as the Ultra's base
   * storage ("three storage options: 1TB, 512GB, and 256GB") and found
   * Samsung's update commitment for the series on its newsroom:
   * "Galaxy S26 series supports seven generations of OS upgrades and
   * seven years of security updates from the initial global launch date."
   * (https://news.samsung.com/uk/samsung-galaxy-s26-fe-delivering-the-latest-flagship-experience-focused-on-what-matters-most)
   * Official wording: "Galaxy S26 starts from RRP £879 (256GB), Galaxy S26+
   * from RRP £1,099 (256GB) and Galaxy S26 Ultra from RRP £1,279."
   */
  'galaxy-s26': {
    slug: 'galaxy-s26', name: 'Samsung Galaxy S26', maker: 'Samsung', rrpGBP: 879, storageGB: 256, fiveG: true,
    updates: 'Seven generations of OS upgrades and seven years of security updates from the initial global launch date',
    source: 'https://www.samsung.com/uk/smartphones/galaxy-s26/buy/', checked: '2026-09-02', evidence: 'official-page',
  },
  'galaxy-s26-plus': {
    slug: 'galaxy-s26-plus', name: 'Samsung Galaxy S26 Plus', maker: 'Samsung', rrpGBP: 1099, storageGB: 256, fiveG: true,
    updates: 'Seven generations of OS upgrades and seven years of security updates from the initial global launch date',
    source: 'https://news.samsung.com/uk/galaxy-unpacked-2026-a-first-look-at-the-galaxy-s26-series-samsungs-most-intuitive-ai-phone-yet', checked: '2026-09-02', evidence: 'official-page',
  },
  'galaxy-s26-ultra': {
    slug: 'galaxy-s26-ultra', name: 'Samsung Galaxy S26 Ultra', maker: 'Samsung', rrpGBP: 1279, storageGB: 256, fiveG: true,
    updates: 'Seven generations of OS upgrades and seven years of security updates from the initial global launch date',
    source: 'https://news.samsung.com/uk/galaxy-unpacked-2026-a-first-look-at-the-galaxy-s26-series-samsungs-most-intuitive-ai-phone-yet', checked: '2026-09-02', evidence: 'official-page',
  },

  /* Galaxy Z Fold8, Z Fold8 Ultra and Z Flip8
   * Source:  https://www.samsung.com/uk/smartphones/galaxy-z-fold8/buy/
   *          https://www.samsung.com/uk/smartphones/galaxy-z-fold8-ultra/buy/
   *          https://www.samsung.com/uk/smartphones/galaxy-z-flip8/buy/
   * Checked: 2026-09-04, two independent agents; the second from the
   * Samsung Newsroom UK launch article, which gives general availability
   * from 7 August 2026: "Galaxy Z Fold8: 256GB – £1,699.00", "Galaxy Z
   * Fold8 Ultra: Starts at £1,899.00, available in 256GB, 512GB, and 1TB",
   * "Galaxy Z Flip8: 256GB – £1,149.00".
   * Official wording: "The Galaxy Z Fold8 256GB RRP is £1,699.00", "the
   * Galaxy Z Fold8 Ultra 256GB RRP is £1,899.00", "the Galaxy Z Flip8
   * 256GB has an RRP of £1,149.00."
   */
  'galaxy-z-fold8': {
    slug: 'galaxy-z-fold8', name: 'Samsung Galaxy Z Fold8', maker: 'Samsung', rrpGBP: 1699, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.samsung.com/uk/smartphones/galaxy-z-fold8/buy/', checked: '2026-09-04', evidence: 'official-page',
  },
  'galaxy-z-fold8-ultra': {
    slug: 'galaxy-z-fold8-ultra', name: 'Samsung Galaxy Z Fold8 Ultra', maker: 'Samsung', rrpGBP: 1899, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.samsung.com/uk/smartphones/galaxy-z-fold8-ultra/buy/', checked: '2026-09-04', evidence: 'official-page',
  },
  'galaxy-z-flip8': {
    slug: 'galaxy-z-flip8', name: 'Samsung Galaxy Z Flip8', maker: 'Samsung', rrpGBP: 1149, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.samsung.com/uk/smartphones/galaxy-z-flip8/buy/', checked: '2026-09-04', evidence: 'official-page',
  },

  /* Galaxy Z Flip7 FE, A56 5G, A36 5G and A26 5G
   * Confirmed on sale on samsung.com/uk on 2026-09-04, but the buy pages
   * render their price by script, so no snippet stated a pound figure.
   * Listed so the gap is visible and the feed has somewhere to attach;
   * the price needs a direct page read (docs/TODO.md).
   */
  'galaxy-z-flip7-fe': {
    slug: 'galaxy-z-flip7-fe', name: 'Samsung Galaxy Z Flip7 FE', maker: 'Samsung', rrpGBP: null, storageGB: 128, fiveG: true,
    updates: null,
    source: 'https://www.samsung.com/uk/smartphones/galaxy-z-flip7-fe/buy/', checked: '2026-09-04', evidence: 'unverified',
  },
  'galaxy-a56-5g': {
    slug: 'galaxy-a56-5g', name: 'Samsung Galaxy A56 5G', maker: 'Samsung', rrpGBP: null, storageGB: 128, fiveG: true,
    updates: null,
    source: 'https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a56-5g/buy/', checked: '2026-09-04', evidence: 'unverified',
  },
  'galaxy-a36-5g': {
    slug: 'galaxy-a36-5g', name: 'Samsung Galaxy A36 5G', maker: 'Samsung', rrpGBP: null, storageGB: 128, fiveG: true,
    updates: null,
    source: 'https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a36-5g/buy/', checked: '2026-09-04', evidence: 'unverified',
  },
  'galaxy-a26-5g': {
    slug: 'galaxy-a26-5g', name: 'Samsung Galaxy A26 5G', maker: 'Samsung', rrpGBP: null, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a26-5g-black-256gb-sm-a266bzkceub/buy/', checked: '2026-09-04', evidence: 'unverified',
  },

  /* Galaxy A57 5G and A37 5G
   * Source:  https://news.samsung.com/uk/samsung-galaxy-a57-5g-and-galaxy-a37-5g-now-available
   * Also:    https://news.samsung.com/uk/samsung-unveils-galaxy-a57-5g-and-galaxy-a37-5g-packing-pro-level-features-at-awesome-price
   * Checked: 2026-09-04, one reader, two Samsung UK newsroom pages agreeing.
   * On sale from 10 April on samsung.com/uk. These replace the A56 and A36
   * as the current mid-range models.
   * Official wording: "Galaxy A57 5G price starting from RRP £529 (256GB)
   * and Galaxy A37 5G starting from RRP £399 (128GB)."
   */
  'galaxy-a57-5g': {
    slug: 'galaxy-a57-5g', name: 'Samsung Galaxy A57 5G', maker: 'Samsung', rrpGBP: 529, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://news.samsung.com/uk/samsung-galaxy-a57-5g-and-galaxy-a37-5g-now-available', checked: '2026-09-04', evidence: 'official-page',
  },
  'galaxy-a37-5g': {
    slug: 'galaxy-a37-5g', name: 'Samsung Galaxy A37 5G', maker: 'Samsung', rrpGBP: 399, storageGB: 128, fiveG: true,
    updates: null,
    source: 'https://news.samsung.com/uk/samsung-galaxy-a57-5g-and-galaxy-a37-5g-now-available', checked: '2026-09-04', evidence: 'official-page',
  },

  /* Galaxy A17 5G
   * Source:  https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a17-5g-black-128gb-sm-a176bzkaeub/buy/
   * Checked: 2026-09-02, writer plus the fact refuter.
   * Official wording: "The new Galaxy A17 5G ... available now in retail
   * stores and on Samsung.com for £199." and "supported with six
   * generations of OS upgrades and six years of security updates from the
   * first global launch date."
   */
  'galaxy-a17-5g': {
    slug: 'galaxy-a17-5g', name: 'Samsung Galaxy A17 5G', maker: 'Samsung', rrpGBP: 199, storageGB: 128, fiveG: true,
    updates: 'Six generations of OS upgrades and six years of security updates from the first global launch date',
    source: 'https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a17-5g-black-128gb-sm-a176bzkaeub/buy/', checked: '2026-09-02', evidence: 'official-page',
  },

  /* Pixel 10 family, Pixel 11 family and Pixel 9a
   * Checked: 2026-09-04, one agent on store.google.com and blog.google.
   * All are sold new on the UK store; the Pixel 11, 11 Pro and 11 Pro XL
   * launched on 12 August 2026 with a Tensor G6 chip. No UK price came
   * back for any of the 10 or 11 family: the snippets carried dollar and
   * euro figures only, and the one sterling pair found was implausible
   * (Pro XL below Pro) so it was discarded. Pixel 9a came back as "starts
   * at £499 with 128 GB of storage" from one angle only, so it waits for
   * a second. Listed so the gaps are visible; see docs/TODO.md.
   */
  'pixel-11': {
    slug: 'pixel-11', name: 'Google Pixel 11', maker: 'Google', rrpGBP: null, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://store.google.com/gb/config/pixel_11?hl=en-GB', checked: '2026-09-04', evidence: 'unverified',
  },
  'pixel-11-pro': {
    slug: 'pixel-11-pro', name: 'Google Pixel 11 Pro', maker: 'Google', rrpGBP: null, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://store.google.com/gb/product/pixel_11_pro?hl=en-GB', checked: '2026-09-04', evidence: 'unverified',
  },
  'pixel-11-pro-xl': {
    slug: 'pixel-11-pro-xl', name: 'Google Pixel 11 Pro XL', maker: 'Google', rrpGBP: null, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://store.google.com/gb/product/pixel_11_pro?hl=en-GB', checked: '2026-09-04', evidence: 'unverified',
  },
  'pixel-10': {
    slug: 'pixel-10', name: 'Google Pixel 10', maker: 'Google', rrpGBP: null, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://store.google.com/gb/product/pixel_10?hl=en-GB', checked: '2026-09-04', evidence: 'unverified',
  },
  'pixel-10-pro': {
    slug: 'pixel-10-pro', name: 'Google Pixel 10 Pro', maker: 'Google', rrpGBP: null, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://store.google.com/gb/product/pixel_10_pro?hl=en-GB', checked: '2026-09-04', evidence: 'unverified',
  },
  'pixel-10-pro-xl': {
    slug: 'pixel-10-pro-xl', name: 'Google Pixel 10 Pro XL', maker: 'Google', rrpGBP: null, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://store.google.com/gb/product/pixel_10_pro?hl=en-GB', checked: '2026-09-04', evidence: 'unverified',
  },
  'pixel-10-pro-fold': {
    slug: 'pixel-10-pro-fold', name: 'Google Pixel 10 Pro Fold', maker: 'Google', rrpGBP: null, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://store.google.com/gb/product/pixel_10_pro_fold?hl=en-GB', checked: '2026-09-04', evidence: 'unverified',
  },
  'pixel-9a': {
    slug: 'pixel-9a', name: 'Google Pixel 9a', maker: 'Google', rrpGBP: null, storageGB: 128, fiveG: true,
    updates: null,
    source: 'https://store.google.com/gb/product/pixel_9a?hl=en-GB', checked: '2026-09-04', evidence: 'unverified',
  },

  /* Pixel 10a
   * Source:  https://store.google.com/gb/product/pixel_10a?hl=en-GB
   * Checked: 2026-09-02. No Google Store UK snippet stated a price across
   * three searches, so the price is null. The update commitment is stated.
   * Official wording: "7 years of OS & security updates"
   */
  'pixel-10a': {
    slug: 'pixel-10a', name: 'Google Pixel 10a', maker: 'Google', rrpGBP: null, storageGB: null, fiveG: true,
    updates: 'Seven years of OS and security updates',
    source: 'https://store.google.com/gb/product/pixel_10a?hl=en-GB', checked: '2026-09-02', evidence: 'official-page',
  },
};

export const getPhone = (slug: string): TrackedPhone | null => phones[slug] ?? null;
