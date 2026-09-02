/* The daily integrity check. Everything it does is subtractive, which is why
   it is allowed to commit to main: taking a wrong deal down is always safe.

   For every live deal it
     1. follows the link, and hides the deal if the link is dead;
     2. re-pulls the feed when credentials exist, and hides a deal that has
        gone from the feed or marks it stale if its price or term moved;
     3. marks a deal stale when nobody has verified it for STALE_DAYS;
     4. compares its roaming line with the verified roaming table for the
        network and warns on any disagreement, without hiding.

   Hidden means status expired or stale. The site only renders live deals.

     node --experimental-strip-types packages/data/verify/integrity.mjs
       --dry-run      report only, write nothing
       --no-network   skip the link checks and the feed pull, for tests
       --today <iso>  pin the date */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { listTelcoFeeds, downloadFeed, redact } from '../ingest/awin.mjs';
import { normaliseRow } from '../ingest/normalise.mjs';
import { roaming } from '../../compliance/roaming.ts';
import { priceRises } from '../../compliance/price-rises.ts';

export const STALE_DAYS = 14;
const root = resolve(dirname(new URL(import.meta.url).pathname), '../../..');

/* HEAD first, GET if the host refuses HEAD, and one retry after a pause on a
   network error or a 5xx so a blip does not hide a good deal. A 4xx is taken
   at its word. */
export async function checkLink(url, { fetchImpl = fetch, timeoutMs = 15000, pauseMs = 2000 } = {}) {
  const attempt = async (method) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetchImpl(url, {
        method, redirect: 'follow', signal: ctrl.signal,
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; saveonsims-integrity; +https://saveonsims.co.uk)' },
      });
      return { ok: res.status < 400, status: res.status };
    } catch (e) {
      return { ok: false, status: 0, error: e.name === 'AbortError' ? 'timeout' : e.message };
    } finally {
      clearTimeout(timer);
    }
  };
  let r = await attempt('HEAD');
  if (!r.ok) r = await attempt('GET');
  if (!r.ok && (r.status === 0 || r.status >= 500)) {
    await new Promise((s) => setTimeout(s, pauseMs));
    r = await attempt('GET');
  }
  return r;
}

const daysBetween = (from, to) => Math.round((Date.parse(to) - Date.parse(from)) / 86400000);

/* Pure. links: { [id]: { ok, status } } or null to skip. feed: Map of id to
   freshly normalised deal, or null to skip. Returns a new set. */
export function assess(set, { today, links = null, feed = null, roamingTable = roaming, staleDays = STALE_DAYS }) {
  const changes = [];
  const warnings = [];
  const hide = (d, to, why) => {
    changes.push({ id: d.id, from: d.status, to, why });
    return { ...d, status: to };
  };
  const deals = set.deals.map((d) => {
    if (d.status !== 'live') return d;

    const link = links?.[d.id];
    if (link && !link.ok) return hide(d, 'expired', `link returned ${link.status || link.error}`);

    if (feed && d.isAffiliate) {
      const f = feed.get(d.id);
      if (!f) return hide(d, 'expired', 'no longer in the feed');
      const moved = [['monthlyPrice', 'monthly'], ['upfrontCost', 'upfront'], ['contractLengthMonths', 'term']]
        .filter(([k]) => f[k] !== d[k])
        .map(([k, label]) => `${label} ${d[k]} is now ${f[k]}`);
      if (moved.length) return hide(d, 'stale', moved.join(', '));
    }

    const age = daysBetween(d.lastVerified, today);
    if (age > staleDays) return hide(d, 'stale', `not verified for ${age} days`);

    const ref = roamingTable[d.network];
    if (ref && ref.evidence !== 'unverified') {
      const diff = [];
      const both = (a, b) => a !== null && a !== undefined && b !== null && b !== undefined;
      if (both(ref.euIncluded, d.roaming.euIncluded) && ref.euIncluded !== d.roaming.euIncluded) diff.push(`EU included is ${d.roaming.euIncluded} on the card but ${ref.euIncluded} in the roaming table`);
      if (both(ref.euCapGB, d.roaming.euCapGB) && ref.euCapGB !== d.roaming.euCapGB) diff.push(`cap is ${d.roaming.euCapGB}GB on the card but ${ref.euCapGB}GB in the roaming table`);
      if (both(ref.dailyChargeGBP, d.roaming.dailyChargeGBP) && ref.dailyChargeGBP !== d.roaming.dailyChargeGBP) diff.push(`daily charge is £${d.roaming.dailyChargeGBP} on the card but £${ref.dailyChargeGBP} in the roaming table`);
      if (diff.length) warnings.push({ id: d.id, why: diff.join('; ') });
    }
    return d;
  });
  return { set: { ...set, deals }, changes, warnings };
}

export async function main(argv = process.argv.slice(2)) {
  const flag = (n) => argv.includes(n);
  const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const today = opt('--today', new Date().toISOString().slice(0, 10));
  const dry = flag('--dry-run');
  const offline = flag('--no-network');

  const files = ['sims', 'phones']
    .map((site) => ({ site, path: resolve(root, `content/${site}/deals.json`) }))
    .filter((f) => existsSync(f.path));

  const notes = [];
  let feedRows = null;
  const key = process.env.AWIN_API_TOKEN;
  if (offline) {
    notes.push('Link checks and the feed pull skipped (--no-network).');
  } else if (!key) {
    notes.push('No AWIN_API_TOKEN, so the feed drift check was skipped. Links and freshness were still checked.');
  } else {
    try {
      const feeds = await listTelcoFeeds(key);
      feedRows = [];
      for (const f of feeds) feedRows.push(...(await downloadFeed(f.url)).rows);
      notes.push(`${feeds.length} feeds re-pulled, ${feedRows.length} rows.`);
    } catch (e) {
      notes.push(`Feed re-pull failed (${redact(e.message)}), so the drift check was skipped today.`);
      feedRows = null;
    }
  }

  const report = [`# Integrity check, ${today}`, '', ...notes.map((n) => `- ${n}`), ''];
  let hidden = 0;
  for (const f of files) {
    const set = JSON.parse(readFileSync(f.path, 'utf8'));
    const live = set.deals.filter((d) => d.status === 'live');

    let links = null;
    if (!offline) {
      links = {};
      for (const d of live) links[d.id] = await checkLink(d.url);
    }

    let feed = null;
    if (feedRows) {
      feed = new Map();
      for (const row of feedRows) {
        const r = normaliseRow(row, { site: f.site, today, roaming, priceRises });
        if (r.deal && !feed.has(r.deal.id)) feed.set(r.deal.id, r.deal);
      }
    }

    const { set: next, changes, warnings } = assess(set, { today, links, feed });
    hidden += changes.length;
    report.push(`## content/${f.site}/deals.json`, '', `${live.length} live deals checked, ${changes.length} hidden, ${warnings.length} warnings.`, '');
    for (const c of changes) report.push(`- HIDE  ${c.id}: ${c.why} (${c.from} to ${c.to})`);
    for (const w of warnings) report.push(`- WARN  ${w.id}: ${w.why}`);
    if (links) for (const [id, l] of Object.entries(links)) if (l.ok) report.push(`- ok    ${id}: ${l.status}`);
    report.push('');
    if (changes.length && !dry) writeFileSync(f.path, `${JSON.stringify(next, null, 2)}\n`);
  }
  if (dry && hidden) report.push('Dry run: nothing was written.', '');

  const text = report.join('\n');
  console.log(text);
  const out = resolve(root, '.github/integrity-report.md');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${text}\n`);
  return 0;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname;
if (isMain) process.exit(await main());
