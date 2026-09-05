import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePlanText, rowsFromJsonLd, rowsFromCards, toFeedRow, awinLink, parseRssLeads } from '../ingest/scrape/extract.mjs';
import { normaliseRow } from '../ingest/normalise.mjs';
import { roaming } from '../../compliance/roaming.ts';

test('a plan card in prose becomes the fields it states, nothing more', () => {
  const p = parsePlanText('40GB data Unlimited calls & texts 5G ready 1 month plan £9.99 a month No contract');
  assert.equal(p.inc_data, '40GB'); assert.equal(p.month_cost, '9.99'); assert.equal(p.term, '1 Month');
  assert.equal(p.inc_minutes, 'Unlimited'); assert.equal(p.inc_texts, 'Unlimited'); assert.equal(p.connectivity, '5G');
  assert.equal(p.initial_cost, '', 'no upfront stated means blank, never zero');
  const q = parsePlanText('Unlimited data, unlimited minutes and texts. 24 month contract. £16 per month. £0 upfront');
  assert.equal(q.inc_data, 'Unlimited'); assert.equal(q.term, '24 Months'); assert.equal(q.month_cost, '16'); assert.equal(q.initial_cost, '0');
  const r = parsePlanText('Something with a price £5 and no allowance');
  assert.equal(r.inc_data, ''); assert.equal(r.month_cost, '');
});

test('Product and Offer structured data yields rows in GBP only', () => {
  const block = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'Product', name: '100GB SIM only 12 months', description: 'Unlimited minutes and texts, 5G', offers: { '@type': 'Offer', price: '12.00', priceCurrency: 'GBP', url: 'https://example.invalid/100gb' } },
    { '@type': 'Product', name: 'US plan', offers: { '@type': 'Offer', price: '10', priceCurrency: 'USD' } },
  ] });
  const rows = rowsFromJsonLd([block, '{not json']);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].inc_data, '100GB'); assert.equal(rows[0].term, '12 Months'); assert.equal(rows[0].month_cost, '12'); assert.equal(rows[0].url, 'https://example.invalid/100gb');
});

test('cards collapse duplicates and skip anything without a price and an allowance', () => {
  const rows = rowsFromCards(['40GB £9.99 a month 1 month Unlimited calls & texts', '40GB £9.99 a month 1 month Unlimited calls & texts', 'Read our blog about 5G', '£3 a month 2GB 30 day rolling']);
  assert.equal(rows.length, 2);
});

test('a scraped row is direct and editorial without a programme, an Awin deep link with one', () => {
  const partial = parsePlanText('40GB £9.99 a month 1 month Unlimited calls & texts');
  const direct = toFeedRow(partial, { network: 'Simp', merchant: 'Simp', pageUrl: 'https://simpmobile.com/plans', today: '2026-09-07' });
  assert.equal(direct.is_affiliate, '0'); assert.equal(direct.url, 'https://simpmobile.com/plans'); assert.equal(direct.aw_deep_link, '');
  const aff = toFeedRow(partial, { network: 'SMARTY', merchant: 'SMARTY', pageUrl: 'https://smarty.co.uk/sim-only-deals', today: '2026-09-07', awinMid: 10933, publisherId: '12345' });
  assert.equal(aff.is_affiliate, '1');
  assert.equal(aff.aw_deep_link, awinLink(10933, '12345', 'https://smarty.co.uk/sim-only-deals'));
  assert.match(aff.aw_deep_link, /^https:\/\/www\.awin1\.com\/cread\.php\?awinmid=10933&awinaffid=12345&ued=https%3A%2F%2Fsmarty/);
});

test('the normaliser honours the affiliate flag on a scraped row', () => {
  const partial = parsePlanText('Unlimited data Unlimited calls & texts 5G £10 a month rolling monthly £0 upfront');
  const row = toFeedRow(partial, { network: 'Simp', merchant: 'Simp', pageUrl: 'https://simpmobile.com/plans', today: '2026-09-07' });
  const rises = { simp: { type: 'none', amountGBP: null, wording: 'No price rise', evidence: 'official-page' } };
  const r = normaliseRow(row, { site: 'sims', today: '2026-09-07', roaming, priceRises: rises });
  assert.equal(r.drop, null);
  assert.equal(r.deal.isAffiliate, false);
  assert.equal(r.deal.monthlyPrice, 10);
  assert.equal(r.deal.contractLengthMonths, 1);
});

test('RSS items become leads with a title, a link and a date', () => {
  const xml = `<rss><channel><item><title><![CDATA[SMARTY 40GB for £9.99 a month]]></title><link>https://www.hotukdeals.com/deals/x</link><pubDate>Mon, 07 Sep 2026 08:00:00 GMT</pubDate></item><item><title>No link</title></item></channel></rss>`;
  const leads = parseRssLeads(xml);
  assert.deepEqual(leads, [{ title: 'SMARTY 40GB for £9.99 a month', link: 'https://www.hotukdeals.com/deals/x', published: 'Mon, 07 Sep 2026 08:00:00 GMT' }]);
});
