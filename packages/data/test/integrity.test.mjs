import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assess, checkLink } from '../verify/integrity.mjs';

const base = {
  id: 'x', status: 'live', isAffiliate: true, network: 'smarty', lastVerified: '2026-09-01',
  monthlyPrice: 10, upfrontCost: 0, contractLengthMonths: 1,
  roaming: { euIncluded: true, euCapGB: 12, dailyChargeGBP: null },
};
const table = { smarty: { evidence: 'official-page', euIncluded: true, euCapGB: 12, dailyChargeGBP: null } };
const run = (deal, opts) => assess({ weekOf: '2026-09-07', deals: [{ ...base, ...deal }] }, { today: '2026-09-07', roamingTable: table, ...opts });

test('a dead link hides the deal', () => {
  const { set, changes } = run({}, { links: { x: { ok: false, status: 404 } } });
  assert.equal(set.deals[0].status, 'expired');
  assert.match(changes[0].why, /404/);
});

test('gone from the feed hides it, a moved price marks it stale', () => {
  assert.equal(run({}, { feed: new Map() }).set.deals[0].status, 'expired');
  const moved = run({}, { feed: new Map([['x', { ...base, monthlyPrice: 12 }]]) });
  assert.equal(moved.set.deals[0].status, 'stale');
  assert.match(moved.changes[0].why, /monthly 10 is now 12/);
  const same = run({}, { feed: new Map([['x', { ...base }]]) });
  assert.equal(same.changes.length, 0);
});

test('a hand-written listing is not expected in the feed', () => {
  assert.equal(run({ isAffiliate: false }, { feed: new Map() }).changes.length, 0);
});

test('old goes stale, fresh stays live', () => {
  assert.equal(run({ lastVerified: '2026-08-01' }, {}).set.deals[0].status, 'stale');
  assert.equal(run({ lastVerified: '2026-09-01' }, {}).set.deals[0].status, 'live');
});

test('a roaming line that disagrees with the verified table warns without hiding', () => {
  const { set, warnings } = run({ roaming: { euIncluded: true, euCapGB: 25, dailyChargeGBP: null } }, {});
  assert.equal(set.deals[0].status, 'live');
  assert.match(warnings[0].why, /25GB on the card but 12GB/);
  assert.equal(run({ roaming: { euIncluded: null, euCapGB: null, dailyChargeGBP: null } }, {}).warnings.length, 0, 'null is not a disagreement');
});

test('already hidden deals are left alone', () => {
  const { set, changes } = run({ status: 'stale', lastVerified: '2020-01-01' }, { links: { x: { ok: false, status: 410 } } });
  assert.equal(set.deals[0].status, 'stale');
  assert.equal(changes.length, 0);
});

test('checkLink falls back from HEAD to GET and retries a 5xx once', async () => {
  const calls = [];
  const fetchImpl = async (url, { method }) => {
    calls.push(method);
    if (method === 'HEAD') return { status: 405 };
    return { status: calls.length < 3 ? 503 : 200 };
  };
  const r = await checkLink('https://example.invalid/', { fetchImpl, pauseMs: 0 });
  assert.deepEqual(calls, ['HEAD', 'GET', 'GET']);
  assert.deepEqual(r, { ok: true, status: 200 });
  const dead = await checkLink('https://example.invalid/', { fetchImpl: async () => ({ status: 404 }), pauseMs: 0 });
  assert.deepEqual(dead, { ok: false, status: 404 });
});

test('guides past the freshness window are listed, not hidden', async () => {
  const { staleGuides, GUIDE_STALE_DAYS } = await import('../verify/integrity.mjs');
  const { mkdtempSync, mkdirSync, writeFileSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const root = mkdtempSync(join(tmpdir(), 'sos-'));
  mkdirSync(join(root, 'apps/sims/src/content/posts'), { recursive: true });
  writeFileSync(join(root, 'apps/sims/src/content/posts/old.md'), '---\ntitle: "Old"\nchecked: 2026-01-01\n---\nbody');
  writeFileSync(join(root, 'apps/sims/src/content/posts/new.md'), '---\ntitle: "New"\nchecked: 2026-09-01\n---\nbody');
  const out = staleGuides('2026-09-07', root);
  assert.deepEqual(out.map((g) => g.slug), ['old']);
  assert.ok(out[0].age > GUIDE_STALE_DAYS);
});
