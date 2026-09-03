/* The weekly refresh. Pulls the Awin telco feeds, normalises every row into
   the deal shape, holds back anything that would need a guess, ranks what is
   left, and writes the proposal for the weekly pull request with a summary a
   reviewer can read in a minute.

   It proposes. It never deploys. Merging the pull request is what publishes.

     node --experimental-strip-types packages/data/ingest/run.mjs
       --site sims|phones     default sims
       --fixture <csv>        use a local file instead of Awin
       --write                write content/<site>/deals.json (the default in
                              GitHub Actions; a dry run everywhere else)
       --dry-run              never write content/
       --summary <path>       default .github/refresh-summary.md
       --today <yyyy-mm-dd>   pin the date, for tests */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { listTelcoFeeds, downloadFeed, redact } from './awin.mjs';
import { parseCSVObjects } from './csv.mjs';
import { normaliseRow } from './normalise.mjs';
import { selectShowcase } from '../rules/picks.mjs';
import { DealSetSchema } from '../schema.js';
import { networks } from '../../ui/networks.js';
import { roaming } from '../../compliance/roaming.ts';
import { priceRises } from '../../compliance/price-rises.ts';

const root = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const gbp = (n) => `£${n.toFixed(2)}`;

/* The Monday of the week containing the date, in UTC. */
export function mondayOf(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

const tally = (list) => list.reduce((m, k) => ((m[k] = (m[k] ?? 0) + 1), m), {});

export async function refresh({ site, fixture, today, write, summaryPath, tables = { roaming, priceRises } }) {
  const contentPath = resolve(root, `content/${site}/deals.json`);
  const feeds = [];
  const rows = [];
  const headersSeen = new Set();

  if (fixture) {
    const { headers, rows: r } = parseCSVObjects(readFileSync(fixture, 'utf8'));
    rows.push(...r);
    headers.forEach((h) => headersSeen.add(h));
    feeds.push({ advertiser: `fixture ${fixture}`, rows: r.length });
  } else {
    const key = process.env.AWIN_API_TOKEN;
    if (!key) {
      throw new Error('AWIN_API_TOKEN is not set. Add the Create-a-Feed API key as a repository secret, or run with --fixture <csv>.');
    }
    for (const f of await listTelcoFeeds(key)) {
      const entry = { advertiser: f.advertiser, products: f.products, lastUploaded: f.lastUploaded, rows: 0 };
      feeds.push(entry);
      try {
        const { headers, rows: r } = await downloadFeed(f.url);
        rows.push(...r);
        headers.forEach((h) => headersSeen.add(h));
        entry.rows = r.length;
      } catch (e) {
        entry.error = redact(e.message);
      }
    }
  }

  const results = rows.map((row) => normaliseRow(row, { site, today, roaming: tables.roaming, priceRises: tables.priceRises }));
  const dropped = tally(results.filter((r) => r.drop).map((r) => r.drop));
  const unknownNames = [...new Set(results.filter((r) => r.drop === 'unknown-network').map((r) => r.rawNetwork))];
  const assumedGB = results.filter((r) => r.assumed).length;
  const held = results.filter((r) => r.deal && r.needs.length);

  /* First row wins on a duplicate id; feeds repeat a product now and then. */
  const seen = new Set();
  const ready = [];
  for (const r of results) {
    if (!r.deal || r.needs.length || seen.has(r.deal.id)) continue;
    seen.add(r.deal.id);
    ready.push(r.deal);
  }

  const existing = existsSync(contentPath) ? JSON.parse(readFileSync(contentPath, 'utf8')) : { weekOf: today, deals: [] };
  /* Hand-written listings, EE among them, are not in any feed. They carry
     over untouched with their old checked date, so the daily check will
     mark them stale unless someone re-verifies them. */
  const editorial = existing.deals.filter((d) => d.isAffiliate === false && !d.id.startsWith('sample-'));
  const editorialPicks = new Set(editorial.map((d) => d.pick).filter(Boolean));

  const { deals: showcase } = selectShowcase(ready);
  const proposed = showcase.map((d) => (d.pick && editorialPicks.has(d.pick) ? { ...d, pick: null } : d));
  const next = { weekOf: mondayOf(today), deals: [...editorial, ...proposed] };

  const prev = new Map(existing.deals.filter((d) => d.isAffiliate !== false).map((d) => [d.id, d]));
  const added = proposed.filter((d) => !prev.has(d.id));
  const gone = [...prev.values()].filter((d) => !proposed.some((p) => p.id === d.id));
  const moved = proposed
    .filter((d) => prev.has(d.id))
    .map((d) => ({ d, p: prev.get(d.id) }))
    .filter(({ d, p }) => d.monthlyPrice !== p.monthlyPrice || d.upfrontCost !== p.upfrontCost || d.contractLengthMonths !== p.contractLengthMonths);

  const heldByNetwork = {};
  for (const r of held) {
    const h = (heldByNetwork[r.deal.network] ??= { deals: 0, needs: new Set() });
    h.deals += 1;
    r.needs.forEach((n) => h.needs.add(n));
  }

  const lines = [];
  lines.push(`# Deals, week of ${next.weekOf}`, '');
  lines.push(`${feeds.length} feed${feeds.length === 1 ? '' : 's'} read, ${rows.length} rows. ${ready.length} deals ready, ${held.length} held back for research, ${results.filter((r) => r.drop).length} rows dropped.`, '');
  lines.push(`## Proposed showcase, ${proposed.length} deals`, '');
  if (proposed.length) {
    lines.push('| Network | Merchant | Monthly | Upfront | Term | Data | Pick |', '|---|---|---|---|---|---|---|');
    for (const d of proposed) {
      lines.push(`| ${networks[d.network].name} | ${d.merchant} | ${gbp(d.monthlyPrice)} | ${gbp(d.upfrontCost)} | ${d.contractLengthMonths === 1 ? 'Rolling' : `${d.contractLengthMonths} months`} | ${d.data === 'unlimited' ? 'Unlimited' : `${d.data}GB`} | ${d.pick ?? ''} |`);
    }
  } else {
    lines.push('Nothing to propose. Every ready row was held back or dropped; see below. content/ is untouched.');
  }
  lines.push('');
  if (editorial.length) lines.push(`${editorial.length} hand-written listing${editorial.length === 1 ? '' : 's'} carried over unchanged: ${editorial.map((d) => d.id).join(', ')}. Re-verify by hand.`, '');
  lines.push('## Changes since last week', '');
  if (!proposed.length) lines.push('None. Nothing was proposed, so last week\'s file stands.');
  else if (!added.length && !gone.length && !moved.length) lines.push('No change to the affiliate listings.');
  for (const d of proposed.length ? added : []) lines.push(`- New: ${d.id} at ${gbp(d.monthlyPrice)} a month`);
  for (const d of proposed.length ? gone : []) lines.push(`- Gone: ${d.id}`);
  for (const { d, p } of proposed.length ? moved : []) lines.push(`- Moved: ${d.id} ${gbp(p.monthlyPrice)} to ${gbp(d.monthlyPrice)} a month, ${gbp(p.upfrontCost)} to ${gbp(d.upfrontCost)} upfront, ${p.contractLengthMonths} to ${d.contractLengthMonths} months`);
  lines.push('');
  lines.push('## Held back until the compliance tables cover the network', '');
  if (Object.keys(heldByNetwork).length) {
    lines.push('| Network | Deals | Needs |', '|---|---|---|');
    for (const [k, h] of Object.entries(heldByNetwork)) lines.push(`| ${networks[k].name} | ${h.deals} | ${[...h.needs].join(', ')} |`);
    lines.push('', 'Fill packages/compliance/price-rises.ts and roaming.ts for these networks, with sources, and they list themselves next week.');
  } else {
    lines.push('None.');
  }
  lines.push('', '## Dropped rows', '');
  if (Object.keys(dropped).length) {
    lines.push('| Reason | Rows |', '|---|---|');
    for (const [k, n] of Object.entries(dropped).sort((a, b) => b[1] - a[1])) lines.push(`| ${k} | ${n} |`);
  } else {
    lines.push('None.');
  }
  if (unknownNames.length) lines.push('', `Network names not recognised: ${unknownNames.join(', ')}. Add an alias in packages/data/ingest/normalise.mjs if one is a network we list.`);
  if (assumedGB) lines.push('', `${assumedGB} row${assumedGB === 1 ? '' : 's'} stated data as a bare number, read as GB.`);
  lines.push('', '## Feeds', '');
  lines.push('| Advertiser | Rows | Note |', '|---|---|---|');
  for (const f of feeds) lines.push(`| ${f.advertiser} | ${f.rows} | ${f.error ?? (f.lastUploaded ? `uploaded ${f.lastUploaded}` : '')} |`);
  lines.push('', `Headers seen: ${[...headersSeen].join(', ')}`, '');
  const summary = lines.join('\n');

  const parsed = DealSetSchema.safeParse(next);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`The proposal does not pass the schema, so nothing was written:\n${issues}`);
  }

  const outSummary = resolve(root, summaryPath);
  mkdirSync(dirname(outSummary), { recursive: true });
  writeFileSync(outSummary, `${summary}\n`);

  let wrote = false;
  if (write && proposed.length) {
    mkdirSync(dirname(contentPath), { recursive: true });
    writeFileSync(contentPath, `${JSON.stringify(next, null, 2)}\n`);
    /* The changelog feeds the What changed this week page: a fresh, dated
       record every Monday, kept for half a year. */
    const logPath = resolve(root, `content/${site}/changelog.json`);
    const log = existsSync(logPath) ? JSON.parse(readFileSync(logPath, 'utf8')) : { weeks: [] };
    const brief = (d) => ({ id: d.id, network: d.network, monthlyPrice: d.monthlyPrice, data: d.data, contractLengthMonths: d.contractLengthMonths, pick: d.pick ?? null });
    log.weeks = [
      { weekOf: next.weekOf, checked: today, proposed: proposed.length, added: added.map(brief), gone: gone.map((d) => ({ id: d.id, network: d.network })), moved: moved.map(({ d, p }) => ({ id: d.id, network: d.network, from: p.monthlyPrice, to: d.monthlyPrice })) },
      ...log.weeks.filter((w) => w.weekOf !== next.weekOf),
    ].slice(0, 26);
    writeFileSync(logPath, `${JSON.stringify(log, null, 2)}\n`);
    wrote = true;
  }
  return { summary, next, proposed, held, dropped, wrote, contentPath, summaryPath: outSummary };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname;
if (isMain) {
  const args = process.argv.slice(2);
  const flag = (n) => args.includes(n);
  const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
  try {
    const out = await refresh({
      site: opt('--site', 'sims'),
      fixture: opt('--fixture', null),
      today: opt('--today', new Date().toISOString().slice(0, 10)),
      write: flag('--write') || (!flag('--dry-run') && Boolean(process.env.GITHUB_ACTIONS)),
      summaryPath: opt('--summary', '.github/refresh-summary.md'),
    });
    console.log(out.summary);
    console.log(out.wrote ? `wrote  ${out.contentPath}` : `dry run, content/ untouched. Summary at ${out.summaryPath}`);
  } catch (e) {
    console.error(`FAIL  ${e.message}`);
    process.exit(1);
  }
}
