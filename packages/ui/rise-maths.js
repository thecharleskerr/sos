/* The arithmetic behind the price rise calculator, kept apart from the page
   so it can be tested and so the client script and the build share one
   version. Money in pounds as numbers, never strings.

   A rise "lands" once a year. Every verified network's rise applies from the
   April bill, including EE's, which takes effect on 31 March: the first
   full bill at the new price is April's. The calculator therefore counts
   Aprils inside the months left on the contract, starting from next month.
   Nothing here reads the compliance table directly; the page passes the
   entry in, so a plain object with the same shape works in tests. */

export const RISE_MONTH = 3; // April, zero based

/* The monthly rise in pounds for an entry and a plan size, or null when it
   cannot be stated: unverified, or a tiered rise with no allowance given.
   Zero means the network states no rise. */
export function amountFor(entry, dataGB = null) {
  if (!entry || entry.evidence === 'unverified' || !entry.type) return null;
  if (entry.type === 'none') return 0;
  if (entry.type === 'fixed') {
    if (entry.amountGBP !== null && entry.amountGBP !== undefined) return entry.amountGBP;
    if (!entry.tiers?.length) return null;
    if (dataGB === null || dataGB === undefined) return null;
    const gb = dataGB === 'unlimited' ? Infinity : Number(dataGB);
    const tier = entry.tiers.find((t) => t.maxGB === null || gb <= t.maxGB);
    return tier ? tier.amountGBP : null;
  }
  return null;
}

/* Round to pence, avoiding the floating point tail on sums like 22.5 * 3. */
const pence = (n) => Math.round(n * 100) / 100;

/* What a plan costs over the months left, once the rises are counted.
   from is the date the sum starts; the first counted bill is next month's. */
export function project({ price, monthsLeft, amount, from = new Date() }) {
  const months = Math.max(0, Math.floor(Number(monthsLeft) || 0));
  const base = Number(price) || 0;
  let risesSoFar = 0, extra = 0, firstRiseIn = null;
  const rises = [];
  let y = from.getUTCFullYear(), m = from.getUTCMonth();
  for (let i = 1; i <= months; i++) {
    m += 1; if (m > 11) { m = 0; y += 1; }
    if (m === RISE_MONTH && amount > 0) {
      risesSoFar += 1;
      if (firstRiseIn === null) firstRiseIn = i;
      rises.push({ year: y, monthsIn: i, monthly: pence(base + risesSoFar * amount) });
    }
    extra += risesSoFar * amount;
  }
  return {
    months,
    amount,
    rises,
    firstRiseIn,
    monthlyAfterFirst: rises.length ? rises[0].monthly : base,
    extraTotal: pence(extra),
    totalWithoutRises: pence(base * months),
    totalWithRises: pence(base * months + extra),
  };
}
