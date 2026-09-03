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
   * Checked: 2026-09-02. Official wording: "The iPhone 17 starts from \u00a3799 ... You can also purchase it from \u00a326.63/month at 0% APR (second search: available for \u00a3799.00 or \u00a326.63 per month for 30 months at 0% APR)"
   */
  'iphone-17': {
    slug: 'iphone-17', name: 'iPhone 17', maker: 'Apple', rrpGBP: 799, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://www.apple.com/uk/shop/buy-iphone/iphone-17', checked: '2026-09-02', evidence: 'official-page',
  },
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
   * Checked: 2026-09-02, two writers and a fact refuter.
   * Official wording: "Galaxy S26 starts from RRP £879 (256GB), Galaxy S26+
   * from RRP £1,099 (256GB) and Galaxy S26 Ultra from RRP £1,279."
   */
  'galaxy-s26': {
    slug: 'galaxy-s26', name: 'Samsung Galaxy S26', maker: 'Samsung', rrpGBP: 879, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://www.samsung.com/uk/smartphones/galaxy-s26/buy/', checked: '2026-09-02', evidence: 'official-page',
  },
  'galaxy-s26-plus': {
    slug: 'galaxy-s26-plus', name: 'Samsung Galaxy S26 Plus', maker: 'Samsung', rrpGBP: 1099, storageGB: 256, fiveG: true,
    updates: null,
    source: 'https://news.samsung.com/uk/galaxy-unpacked-2026-a-first-look-at-the-galaxy-s26-series-samsungs-most-intuitive-ai-phone-yet', checked: '2026-09-02', evidence: 'official-page',
  },
  'galaxy-s26-ultra': {
    slug: 'galaxy-s26-ultra', name: 'Samsung Galaxy S26 Ultra', maker: 'Samsung', rrpGBP: 1279, storageGB: null, fiveG: true,
    updates: null,
    source: 'https://news.samsung.com/uk/galaxy-unpacked-2026-a-first-look-at-the-galaxy-s26-series-samsungs-most-intuitive-ai-phone-yet', checked: '2026-09-02', evidence: 'official-page',
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
