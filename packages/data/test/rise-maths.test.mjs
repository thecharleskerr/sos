import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amountFor, project } from '../../ui/rise-maths.js';

const fixed = { type: 'fixed', amountGBP: 2.5, evidence: 'official-page' };
const none = { type: 'none', amountGBP: null, evidence: 'official-page' };
const tiered = { type: 'fixed', amountGBP: null, tiers: [{ maxGB: 4, amountGBP: 1.8 }, { maxGB: 99, amountGBP: 1.9 }, { maxGB: null, amountGBP: 2.3 }], evidence: 'official-page' };

test('amountFor reads fixed, none, tiered and unverified entries', () => {
  assert.equal(amountFor(fixed), 2.5);
  assert.equal(amountFor(none), 0);
  assert.equal(amountFor(tiered, 4), 1.8);
  assert.equal(amountFor(tiered, 50), 1.9);
  assert.equal(amountFor(tiered, 100), 2.3);
  assert.equal(amountFor(tiered, 'unlimited'), 2.3);
  assert.equal(amountFor(tiered), null, 'a tiered rise needs the allowance');
  assert.equal(amountFor({ type: null, evidence: 'unverified' }), null);
  assert.equal(amountFor(null), null);
});

test('a September start with 12 months left crosses one April', () => {
  const r = project({ price: 20, monthsLeft: 12, amount: 2.5, from: new Date('2026-09-04') });
  assert.equal(r.rises.length, 1);
  assert.equal(r.rises[0].year, 2027);
  assert.equal(r.firstRiseIn, 7, 'October is month 1, so April is month 7');
  assert.equal(r.monthlyAfterFirst, 22.5);
  assert.equal(r.extraTotal, 15, 'six months at £2.50 more');
  assert.equal(r.totalWithoutRises, 240);
  assert.equal(r.totalWithRises, 255);
});

test('a 24 month term from September crosses two Aprils and the second rise stacks', () => {
  const r = project({ price: 20, monthsLeft: 24, amount: 2.5, from: new Date('2026-09-04') });
  assert.deepEqual(r.rises.map((x) => [x.year, x.monthly]), [[2027, 22.5], [2028, 25]]);
  /* Months 7 to 18 at +2.50 (12 months), months 19 to 24 at +5 (6 months). */
  assert.equal(r.extraTotal, 12 * 2.5 + 6 * 5);
});

test('no rise means nothing changes, and a start in April counts only the next April', () => {
  const flat = project({ price: 15, monthsLeft: 12, amount: 0, from: new Date('2026-09-04') });
  assert.equal(flat.rises.length, 0);
  assert.equal(flat.extraTotal, 0);
  assert.equal(flat.totalWithRises, 180);
  const april = project({ price: 10, monthsLeft: 12, amount: 1, from: new Date('2026-04-10') });
  assert.equal(april.rises.length, 1);
  assert.equal(april.rises[0].year, 2027);
  assert.equal(april.firstRiseIn, 12);
});

test('bad inputs degrade to zero rather than NaN', () => {
  const r = project({ price: 'abc', monthsLeft: -3, amount: 2.5 });
  assert.equal(r.months, 0);
  assert.equal(r.totalWithRises, 0);
  assert.equal(r.extraTotal, 0);
});
