import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categories, categoryKeys } from '../rules/categories.js';

const roamIn = { euIncluded: true, euCapGB: 12, dailyChargeGBP: null };
const deal = (id, monthly, term, data, extra = {}) => ({ id, network: 'smarty', monthlyPrice: monthly, upfrontCost: 0, totalContractCost: monthly * term, data, contractLengthMonths: term, fiveG: true, roaming: roamIn, priceRise: { type: 'none' }, status: 'live', ...extra });
const pool = [deal('a', 10, 1, 40), deal('b', 18, 12, 'unlimited', { fiveG: false }), deal('c', 3, 1, 2), deal('d', 15, 12, 75, { priceRise: { type: 'fixed', amountGBP: 2.5 }, roaming: { euIncluded: false, euCapGB: 25, dailyChargeGBP: 2.75 } })];

test('every category has the copy the page needs and a rule that runs', () => {
  for (const key of categoryKeys) {
    const c = categories[key];
    assert.ok(c.title && c.h1 && c.query && c.description.length <= 160 && c.answer.length > 40, key);
    assert.ok(c.faq.length >= 3 && c.faq.every((f) => f.a.length >= 40), key);
    assert.ok(c.guides.length >= 1, key);
    const out = pool.filter(c.filter).sort(c.sort);
    assert.ok(Array.isArray(out), key);
  }
});

test('the rules land where the copy says', () => {
  const pick = (k) => pool.filter(categories[k].filter).sort(categories[k].sort).map((d) => d.id);
  assert.deepEqual(pick('cheapest'), ['a', 'd', 'b'], 'under 5GB is out, cheapest effective monthly first');
  assert.deepEqual(pick('unlimited-data'), ['b']);
  assert.deepEqual(pick('no-contract'), ['a']);
  assert.deepEqual(pick('eu-roaming-included'), ['c', 'a', 'b'], 'no allowance floor here: same cap, so cheapest first');
  assert.deepEqual(pick('5g'), ['d', 'a', 'c'], 'best value first');
  assert.deepEqual(pick('no-price-rise'), ['c', 'a', 'b']);
  assert.deepEqual(pick('12-month'), ['d', 'b']);
});
