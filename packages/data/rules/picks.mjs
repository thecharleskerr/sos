/* Editorial ranking for the weekly picks. Deterministic, so the same feed
   always produces the same showcase and a reviewer can reason about why a
   deal was chosen. The rules are written out in README.md beside this file;
   change them there and here together. */

/* Below this, a plan is a phone-in-a-drawer plan and does not compete for
   cheapest or deal of the week. */
export const MIN_USEFUL_GB = 5;
/* Unlimited data counts as this much for value scoring. It is a ranking
   weight, not a claim about any allowance, and never reaches the page. */
export const UNLIMITED_GB = 200;
export const SHOWCASE_SIZE = 12;
export const MAX_PER_NETWORK = 2;

export const gb = (d) => (d.data === 'unlimited' ? UNLIMITED_GB : d.data);
/* Upfront cost folded into the monthly figure, so a £30 upfront on a 12 month
   plan ranks as £2.50 a month dearer. */
export const effectiveMonthly = (d) => d.totalContractCost / d.contractLengthMonths;
export const valueScore = (d) => gb(d) / effectiveMonthly(d);

export const byPrice = (a, b) =>
  effectiveMonthly(a) - effectiveMonthly(b) || a.contractLengthMonths - b.contractLengthMonths || a.id.localeCompare(b.id);
export const byValue = (a, b) => valueScore(b) - valueScore(a) || byPrice(a, b);

export const PICK_RULES = [
  { pick: 'deal-of-week', filter: (d) => gb(d) >= MIN_USEFUL_GB, sort: byValue },
  {
    pick: 'best-roaming',
    filter: (d) => d.roaming.euIncluded === true && d.roaming.dailyChargeGBP === null,
    sort: (a, b) => (b.roaming.euCapGB ?? -1) - (a.roaming.euCapGB ?? -1) || byPrice(a, b),
  },
  { pick: 'best-unlimited', filter: (d) => d.data === 'unlimited', sort: byPrice },
  { pick: 'cheapest', filter: (d) => gb(d) >= MIN_USEFUL_GB, sort: byPrice },
  { pick: 'best-short-contract', filter: (d) => d.contractLengthMonths === 1 && gb(d) >= MIN_USEFUL_GB, sort: byPrice },
];

/* One pick per deal, awarded in the order above, so a plan that is both the
   best value and the cheapest is deal of the week and the cheapest pick goes
   to the next in line. Returns new objects; nothing is mutated. */
export function assignPicks(deals) {
  const taken = new Set();
  const picks = {};
  for (const rule of PICK_RULES) {
    const winner = deals.filter((d) => d.status === 'live' && !taken.has(d.id) && rule.filter(d)).sort(rule.sort)[0];
    if (winner) {
      taken.add(winner.id);
      picks[winner.id] = rule.pick;
    }
  }
  return deals.map((d) => ({ ...d, pick: picks[d.id] ?? null }));
}

/* The showcase: every pick winner, then the best value of the rest up to the
   size, with no more than perNetwork non-pick deals from one network so the
   page is not a wall of one brand. Deal of the week leads. */
export function selectShowcase(candidates, { size = SHOWCASE_SIZE, perNetwork = MAX_PER_NETWORK } = {}) {
  const picked = assignPicks(candidates.filter((d) => d.status === 'live'));
  const winners = picked.filter((d) => d.pick);
  const chosen = [...winners];
  const count = {};
  for (const d of chosen) count[d.network] = (count[d.network] ?? 0) + 1;
  for (const d of picked.filter((d) => !d.pick).sort(byValue)) {
    if (chosen.length >= size) break;
    if ((count[d.network] ?? 0) >= perNetwork) continue;
    chosen.push(d);
    count[d.network] = (count[d.network] ?? 0) + 1;
  }
  const rank = (d) => (d.pick ? PICK_RULES.findIndex((r) => r.pick === d.pick) : PICK_RULES.length);
  chosen.sort((a, b) => rank(a) - rank(b) || byValue(a, b));
  return { deals: chosen, picks: Object.fromEntries(winners.map((d) => [d.pick, d.id])) };
}
