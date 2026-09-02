import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCSVObjects } from '../ingest/csv.mjs';
import { normaliseRow, parseAllowance, parseTerm, parseMoney, networkKey } from '../ingest/normalise.mjs';
import { DealSchema } from '../schema.js';
import { roaming } from '../../compliance/roaming.ts';

/* A small verified price-rise table for tests only. Not real figures. */
const rises = {
  smarty: { type: 'none', amountGBP: null, month: null, wording: 'No price rise', evidence: 'official-page' },
  o2: { type: 'fixed', amountGBP: 1.8, month: 'April', wording: 'Rises £1.80 a month each April', evidence: 'official-page' },
  three: { type: 'fixed', amountGBP: 1.25, month: 'April', wording: 'Rises £1.25 a month each April', evidence: 'official-page' },
  voxi: { type: 'none', amountGBP: null, month: null, wording: 'No price rise', evidence: 'official-page' },
  idmobile: { evidence: 'unverified' },
};
const ctx = { site: 'sims', today: '2026-09-07', roaming, priceRises: rises };
const { rows } = parseCSVObjects(readFileSync(new URL('./fixtures/telco-feed.csv', import.meta.url), 'utf8'));
const byId = Object.fromEntries(rows.map((r) => [r.aw_product_id, normaliseRow(r, ctx)]));

test('parsers', () => {
  assert.equal(parseMoney('£12.50'), 12.5);
  assert.equal(parseMoney(''), null);
  assert.equal(parseMoney('free'), null);
  assert.deepEqual(parseAllowance('500MB', 'data'), { value: 0.5, assumed: false });
  assert.deepEqual(parseAllowance('40', 'data'), { value: 40, assumed: true });
  assert.deepEqual(parseAllowance('Unlimited', 'minutes'), { value: 'unlimited', assumed: false });
  assert.deepEqual(parseAllowance('', 'texts'), { value: null, assumed: false });
  assert.equal(parseTerm('1 Month'), 1);
  assert.equal(parseTerm('11 months'), 11);
  assert.equal(parseTerm('30 Days'), 1);
  assert.equal(parseTerm('24'), 24);
  assert.equal(parseTerm(''), null);
  assert.equal(networkKey('iD Mobile'), 'idmobile');
  assert.equal(networkKey('Tesco Mobile'), 'tesco');
  assert.equal(networkKey('Fresh Mobile'), null);
});

test('a complete SIM only row becomes a deal that passes the schema', () => {
  const r = byId['fixture-1'];
  assert.equal(r.drop, null);
  assert.deepEqual(r.needs, []);
  const d = r.deal;
  assert.equal(d.id, 'smarty-smarty-fixture1');
  assert.equal(d.network, 'smarty');
  assert.equal(d.hostNetwork, 'Three');
  assert.equal(d.monthlyPrice, 9.99);
  assert.equal(d.totalContractCost, 9.99);
  assert.equal(d.contractLengthMonths, 1);
  assert.equal(d.data, 40);
  assert.equal(d.fiveG, true);
  assert.equal(d.roaming.euIncluded, roaming.smarty.euIncluded);
  assert.equal(d.priceRise.type, 'none');
  assert.equal(d.feedLastUpdated, '2026-09-01');
  assert.equal(d.lastVerified, '2026-09-07');
  assert.equal(DealSchema.safeParse(d).success, true);
});

test('total cost folds the term and upfront in, and the fixed rise carries its amount', () => {
  const d = byId['fixture-2'].deal;
  assert.equal(d.totalContractCost, 179.88);
  assert.deepEqual(d.priceRise, { type: 'fixed', amountGBP: 1.8, month: 'April', wording: 'Rises £1.80 a month each April' });
});

test('drops, each with its reason', () => {
  assert.equal(byId['fixture-3'].drop, 'ee-editorial-only');
  assert.equal(byId['fixture-4'].drop, 'unknown-network');
  assert.equal(byId['fixture-4'].rawNetwork, 'Fresh Mobile');
  assert.equal(byId['fixture-6'].drop, 'not-sim-only');
  assert.equal(byId['fixture-7'].drop, 'out-of-stock');
  assert.equal(byId['fixture-8'].drop, 'missing-monthly-price');
});

test('a network with no verified price rise is held, and its placeholder fails the schema gate', () => {
  const r = byId['fixture-5'];
  assert.equal(r.drop, null);
  assert.deepEqual(r.needs, ['price-rise-unverified']);
  assert.equal(r.deal.priceRise.type, 'cpi');
  assert.equal(r.deal.priceRise.amountGBP, null);
});

test('a tiered roaming entry passes through as null rather than a guess', () => {
  const d = byId['fixture-9'].deal;
  assert.equal(roaming.three.euIncluded, null);
  assert.equal(d.roaming.euIncluded, null);
  assert.equal(DealSchema.safeParse(d).success, true);
});

test('the same handset row is a deal on the phones site', () => {
  const r = normaliseRow(rows.find((x) => x.aw_product_id === 'fixture-6'), { ...ctx, site: 'phones', priceRises: { vodafone: rises.o2 } });
  assert.equal(r.drop, null);
  assert.equal(r.deal.device.storageGB, 128);
  assert.equal(r.deal.device.brand, 'Apple');
  assert.equal(r.deal.upfrontCost, 49);
  assert.equal(r.deal.totalContractCost, 817);
  assert.equal(DealSchema.safeParse(r.deal).success, true);
});
