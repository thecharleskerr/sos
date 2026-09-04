/* Visits each network's plan page in a real browser, extracts the plans,
   and writes feed-shaped rows plus the leads from HotUKDeals to one JSON
   file for the weekly refresh to merge.

     node packages/data/ingest/scrape/run-scrape.mjs --out data/scrape/latest.json
       --networks smarty,giffgaff   only these recipes
       --no-leads                   skip the lead feeds
       --html <file> --network smarty   extract from a saved page instead of the web

   AWIN_PUBLISHER_ID turns a scraped link into an Awin deep link on networks
   that have a programme; without it every scraped link is direct and the
   deal is editorial (isAffiliate false). SOS_CHROME points at a Chromium
   binary when the bundled one is not installed. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { recipes, leadFeeds, GENERIC_SELECTORS } from './recipes.mjs';
import { rowsFromJsonLd, rowsFromCards, toFeedRow, parseRssLeads } from './extract.mjs';
import { networks } from '../../../ui/networks.js';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const flag = (n) => args.includes(n);
const out = opt('--out', 'data/scrape/latest.json');
const only = opt('--networks', null)?.split(',').map((s) => s.trim());
const today = new Date().toISOString().slice(0, 10);
const publisherId = process.env.AWIN_PUBLISHER_ID || null;

const rowsFor = (recipe, { jsonLd, cards, pageUrl }) => {
  const net = networks[recipe.network];
  const awinMid = net?.affiliate && net?.awin ? net.awin : null;
  const partials = [...rowsFromJsonLd(jsonLd), ...rowsFromCards(cards)];
  const seen = new Set();
  return partials.filter((p) => {
    const k = `${p.inc_data}|${p.term}|${p.month_cost}`;
    if (!p.month_cost || !p.inc_data || seen.has(k)) return false;
    seen.add(k);
    return true;
  }).map((p) => toFeedRow(p, { network: recipe.merchant, merchant: recipe.merchant, pageUrl, today, awinMid, publisherId }));
};

async function scrapeWithBrowser(list) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ executablePath: process.env.SOS_CHROME || undefined, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 saveonsims-weekly-check', locale: 'en-GB' });
  const results = [];
  const rows = [];
  for (const recipe of list) {
    for (const url of recipe.urls) {
      const rec = { network: recipe.network, url, status: null, cards: 0, jsonLd: 0, rows: 0, error: null };
      const page = await ctx.newPage();
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        rec.status = res?.status() ?? null;
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        /* Cookie banners hide the plans on most of these sites. */
        for (const label of [/accept all/i, /allow all/i, /accept/i, /agree/i, /got it/i]) {
          const btn = page.getByRole('button', { name: label }).first();
          if (await btn.isVisible().catch(() => false)) { await btn.click().catch(() => {}); break; }
        }
        await page.waitForTimeout(1500);
        const jsonLd = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent));
        const selectors = [...(recipe.cardSelector ? [recipe.cardSelector] : []), ...GENERIC_SELECTORS];
        const cards = await page.evaluate((sels) => {
          const seen = new Set(); const out = [];
          for (const sel of sels) for (const el of document.querySelectorAll(sel)) {
            const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
            if (t.length < 12 || t.length > 900 || !t.includes('£') || seen.has(t)) continue;
            /* Skip containers that hold several priced cards. */
            if ((t.match(/£/g) || []).length > 4) continue;
            seen.add(t); out.push(t);
          }
          return out;
        }, selectors);
        rec.cards = cards.length; rec.jsonLd = jsonLd.length;
        const found = rowsFor(recipe, { jsonLd, cards, pageUrl: url });
        rec.rows = found.length;
        rows.push(...found);
      } catch (e) {
        rec.error = e.message.split('\n')[0].slice(0, 200);
      } finally {
        await page.close();
      }
      results.push(rec);
      console.log(`${recipe.network.padEnd(11)} ${String(rec.status ?? '-').padEnd(4)} cards ${String(rec.cards).padEnd(4)} rows ${String(rec.rows).padEnd(3)} ${rec.error ?? ''}`);
    }
  }
  await browser.close();
  return { results, rows };
}

async function gatherLeads() {
  const leads = [];
  for (const feed of leadFeeds) {
    try {
      const res = await fetch(feed.url, { headers: { 'user-agent': 'saveonsims-weekly-check' }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) { leads.push({ feed: feed.name, error: `${res.status}` }); continue; }
      for (const l of parseRssLeads(await res.text())) leads.push({ feed: feed.name, ...l });
    } catch (e) {
      leads.push({ feed: feed.name, error: e.message.slice(0, 120) });
    }
  }
  return leads;
}

let results = [], rows = [], leads = [];
if (opt('--html', null)) {
  /* Offline: a saved page through the same extraction, for tuning a recipe. */
  const html = readFileSync(opt('--html'), 'utf8');
  const recipe = recipes.find((r) => r.network === opt('--network', 'smarty'));
  const jsonLd = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const cards = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').split(/<\/(?:li|article|div|section)>/i).map((s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).filter((t) => t.includes('£') && t.length < 900);
  rows = rowsFor(recipe, { jsonLd, cards, pageUrl: recipe.urls[0] });
  results = [{ network: recipe.network, url: opt('--html'), status: 'file', cards: cards.length, jsonLd: jsonLd.length, rows: rows.length, error: null }];
} else {
  const list = only ? recipes.filter((r) => only.includes(r.network)) : recipes;
  ({ results, rows } = await scrapeWithBrowser(list));
  if (!flag('--no-leads')) leads = await gatherLeads();
}

mkdirSync(dirname(resolve(out)), { recursive: true });
writeFileSync(resolve(out), `${JSON.stringify({ generated: new Date().toISOString(), publisherId: Boolean(publisherId), recipes: results, rows, leads }, null, 2)}\n`);
const empty = results.filter((r) => !r.rows);
console.log(`${rows.length} rows from ${results.length - empty.length} pages; ${empty.length} pages yielded nothing; ${leads.filter((l) => l.title).length} leads. Written to ${out}`);
