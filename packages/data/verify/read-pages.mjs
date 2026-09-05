/* Reads the pages the compliance tables are waiting on and writes what each
   one says, so a figure can be filled from the page's own text rather than
   from a search snippet.

     node packages/data/verify/read-pages.mjs [--only pixel-10,tesco-pricing] [--out data/reads]

   Runs in GitHub Actions, where the network is open, on a schedule and on
   demand; the workflow opens a pull request with the results. Each read
   becomes data/reads/<slug>.md holding the page title, status and final URL,
   every pound amount with its surrounding words, the lookFor matches with
   context, and the first part of the visible text. PDFs are fetched and
   their size recorded; their text is not extracted here. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const outDir = resolve(opt('--out', 'data/reads'));
const only = opt('--only', null)?.split(',').map((s) => s.trim());
const today = new Date().toISOString().slice(0, 10);
const { reads } = JSON.parse(readFileSync(new URL('../../compliance/reads.json', import.meta.url), 'utf8'));
const list = only ? reads.filter((r) => only.includes(r.slug)) : reads;

const context = (text, re, width, cap) => {
  const out = []; const seen = new Set();
  for (const m of text.matchAll(re)) {
    const s = Math.max(0, m.index - width), e = Math.min(text.length, m.index + m[0].length + width);
    const snip = text.slice(s, e).replace(/\s+/g, ' ').trim();
    if (seen.has(snip)) continue;
    seen.add(snip); out.push(snip);
    if (out.length >= cap) break;
  }
  return out;
};

const { chromium } = await import('playwright');
const browser = await chromium.launch({ executablePath: process.env.SOS_CHROME || undefined, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 saveonsims-page-read', locale: 'en-GB' });
mkdirSync(outDir, { recursive: true });
const index = [];

for (const r of list) {
  const rec = { slug: r.slug, url: r.url, table: r.table, status: null, finalUrl: null, title: null, amounts: [], phrases: {}, text: '', error: null, pdfBytes: null };
  const page = await ctx.newPage();
  try {
    if (/\.pdf(\?|$)/i.test(r.url)) {
      const res = await page.request.get(r.url, { timeout: 45000 });
      rec.status = res.status(); rec.finalUrl = res.url(); rec.pdfBytes = (await res.body()).length;
    } else {
      const res = await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      rec.status = res?.status() ?? null;
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      for (const label of [/accept all/i, /allow all/i, /accept/i, /agree/i, /got it/i]) {
        const btn = page.getByRole('button', { name: label }).first();
        if (await btn.isVisible().catch(() => false)) { await btn.click().catch(() => {}); break; }
      }
      await page.waitForTimeout(2000);
      rec.finalUrl = page.url();
      rec.title = await page.title();
      const text = (await page.evaluate(() => document.body?.innerText ?? '')).replace(/\s+/g, ' ').trim();
      rec.text = text;
      rec.amounts = context(text, /£\s?\d[\d,]*(?:\.\d{2})?/g, 70, 40);
      for (const pat of r.lookFor ?? []) rec.phrases[pat] = context(text, new RegExp(pat, 'gi'), 120, 8);
    }
  } catch (e) {
    rec.error = e.message.split('\n')[0].slice(0, 200);
  } finally {
    await page.close();
  }
  const lines = [
    `# ${r.slug}`, '',
    `- For: ${r.table}`, `- URL: ${r.url}`, `- Final URL: ${rec.finalUrl ?? ''}`, `- Status: ${rec.status ?? ''}`, `- Read: ${today}`,
    rec.title ? `- Title: ${rec.title}` : null, rec.error ? `- Error: ${rec.error}` : null,
    rec.pdfBytes !== null ? `- PDF: ${rec.pdfBytes} bytes fetched; open it to read the clause.` : null,
    '',
  ].filter((l) => l !== null);
  if (rec.amounts.length) { lines.push('## Pound amounts in context', ''); for (const a of rec.amounts) lines.push(`- ${a}`); lines.push(''); }
  for (const [pat, hits] of Object.entries(rec.phrases)) {
    lines.push(`## Matches for "${pat}"`, '');
    if (!hits.length) lines.push('- none'); else for (const h of hits) lines.push(`- ${h}`);
    lines.push('');
  }
  if (rec.text) lines.push('## Visible text, first 6,000 characters', '', rec.text.slice(0, 6000), '');
  writeFileSync(resolve(outDir, `${r.slug}.md`), lines.join('\n'));
  index.push(rec);
  console.log(`${r.slug.padEnd(22)} ${String(rec.status ?? '-').padEnd(4)} amounts ${String(rec.amounts.length).padEnd(3)} ${rec.error ?? ''}`);
}
await browser.close();

const summary = [
  `# Page reads, ${today}`, '',
  'Each file holds what the page says today. Fill the table entry named in its "For" line from the quoted text, with this date as the checked date, then delete the read or leave it for the next run to overwrite.', '',
  '| Read | For | Status | Pound amounts | Note |', '|---|---|---|---|---|',
  ...index.map((r) => `| [${r.slug}](${r.slug}.md) | ${r.table} | ${r.status ?? ''} | ${r.amounts.length} | ${r.error ?? (r.pdfBytes !== null ? 'PDF fetched' : '')} |`),
  '',
];
writeFileSync(resolve(outDir, 'README.md'), summary.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join('\n'), { flag: 'a' });
console.log(`${index.length} pages read, written to ${outDir}`);
