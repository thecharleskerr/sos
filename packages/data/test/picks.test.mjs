import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assignPicks, selectShowcase, PICK_RULES, valueScore } from '../rules/picks.mjs';

const roamIn = { euIncluded: true, euCapGB: 12, destinationCount: null, dailyChargeGBP: null, worldwideIncluded: false, note: null };
const roamOut = { euIncluded: false, euCapGB: null, destinationCount: null, dailyChargeGBP: 2, worldwideIncluded: false, note: null };
const deal = (id, network, monthly, term, data, roamingOverride = roamIn, extra = {}) => ({
  id, site: 'sims', network, hostNetwork: 'x', merchant: network,
  monthlyPrice: monthly, upfrontCost: 0, totalContractCost: Math.round(monthly * term * 100) / 100,
  data, minutes: 'unlimited', texts: 'unlimited', contractLengthMonths: term, fiveG: true,
  roaming: roamingOverride, priceRise: { type: 'none', amountGBP: null, month: null, wording: 'No price rise' },
  url: 'https://example.invalid/', isAffiliate: true, lastVerified: '2026-09-07', feedLastUpdated: '2026-09-07',
  pick: null, status: 'live', ...extra,
});

const pool = [
  deal('a-unl-16', 'three', 16, 24, 'unlimited', roamOut),
  deal('b-unl-18', 'smarty', 18, 1, 'unlimited'),
  deal('c-40-10', 'smarty', 9.99, 1, 40),
  deal('d-75-15', 'o2', 14.99, 12, 75, { ...roamIn, euCapGB: 25 }),
  deal('e-2gb-3', 'voxi', 3, 1, 2),
  deal('f-5gb-4', 'lebara', 4, 1, 5),
  deal('g-100-12', 'idmobile', 12, 24, 100),
  deal('h-dead', 'o2', 1, 1, 500, roamIn, { status: 'expired' }),
];

test('one pick per deal, and every winner satisfies its own rule', () => {
  const picked = assignPicks(pool);
  const winners = picked.filter((d) => d.pick);
  assert.equal(new Set(winners.map((d) => d.id)).size, winners.length);
  for (const w of winners) {
    const rule = PICK_RULES.find((r) => r.pick === w.pick);
    assert.ok(rule.filter(w), `${w.id} does not satisfy ${w.pick}`);
  }
  assert.equal(picked.find((d) => d.id === 'h-dead').pick, null, 'an expired deal never wins');
});

test('the rules land where the README says they do', () => {
  const picks = Object.fromEntries(assignPicks(pool).filter((d) => d.pick).map((d) => [d.pick, d.id]));
  assert.equal(picks['deal-of-week'], 'a-unl-16', 'best gigabytes per pound');
  assert.equal(picks['best-roaming'], 'd-75-15', 'highest EU cap with no daily charge');
  assert.equal(picks['best-unlimited'], 'b-unl-18', 'cheapest unlimited not already taken');
  assert.equal(picks.cheapest, 'f-5gb-4', 'cheapest with at least 5GB; the 2GB plan does not compete');
  assert.equal(picks['best-short-contract'], 'c-40-10', 'cheapest rolling plan not already taken');
});

test('the showcase leads with deal of the week, caps a network, and never mutates its input', () => {
  const before = JSON.stringify(pool);
  const { deals } = selectShowcase(pool, { size: 6, perNetwork: 1 });
  assert.equal(JSON.stringify(pool), before);
  assert.equal(deals[0].pick, 'deal-of-week');
  assert.ok(deals.length <= 6);
  assert.ok(!deals.some((d) => d.status !== 'live'));
  const nonPick = deals.filter((d) => !d.pick);
  const perNet = nonPick.reduce((m, d) => ((m[d.network] = (m[d.network] ?? 0) + 1), m), {});
  assert.ok(Object.values(perNet).every((n) => n <= 1));
  for (let i = 1; i < deals.length; i++) {
    if (!deals[i - 1].pick && !deals[i].pick) assert.ok(valueScore(deals[i - 1]) >= valueScore(deals[i]));
  }
});
