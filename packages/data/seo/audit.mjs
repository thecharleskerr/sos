/* SEO and answer-engine audit of a built site.
 *
 *   node packages/data/seo/audit.mjs apps/sims/dist https://saveonsims.co.uk
 *
 * Reads every HTML page in the dist folder and checks what a crawler and an
 * answer engine read first: one title of a sensible length, one description,
 * one h1, a canonical that matches the page's own path, Open Graph tags,
 * the html lang attribute, structured data that parses, internal links that
 * resolve to a built page, images with alt text, and the sitemap listing
 * every indexable page and nothing that does not exist. It also catches
 * the copy faults the house rules forbid: em dashes, lowercase units such
 * as "25gb", a lowercase month, and template leaks like "undefined".
 *
 * Errors fail the run; warnings print and pass. No network access.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const [,, distArg, siteUrlArg] = process.argv;
if (!distArg) { console.error('usage: audit.mjs <dist dir> <site url>'); process.exit(2); }
const dist = resolve(distArg);
const siteUrl = (siteUrlArg ?? '').replace(/\/$/, '');

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

const decode = (s) => s.replace(/&#34;/g, '"').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`)); return m ? decode(m[2] ?? m[3]) : null; };
const tags = (html, re) => [...html.matchAll(re)].map((m) => m[0]);
const meta = (html, key, val) => tags(html, /<meta\s[^>]*>/g).filter((t) => attr(t, key) === val).map((t) => attr(t, 'content'));
const text = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/* The path a built file serves at, and whether a link target exists. */
const pathOf = (file) => { const rel = '/' + relative(dist, file).replace(/\\/g, '/'); return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel; };
const exists = (path) => {
  const clean = path.split(/[?#]/)[0];
  if (clean === '/') return existsSync(join(dist, 'index.html'));
  const candidates = [join(dist, clean), join(dist, clean, 'index.html'), join(dist, clean.replace(/\/$/, '') + '.html')];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
};

const MONTHS = 'january|february|march|april|may|june|july|august|september|october|november|december';
const errors = [], warnings = [];
const err = (page, rule, detail) => errors.push({ page, rule, detail });
const warn = (page, rule, detail) => warnings.push({ page, rule, detail });

const pages = walk(dist);
const titles = new Map(), descriptions = new Map();
const indexable = new Set();

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = pathOf(file);
  const is404 = page === '/404.html';
  const robots = meta(html, 'name', 'robots')[0] ?? '';
  const noindex = /noindex/.test(robots);

  /* html lang */
  const htmlTag = html.match(/<html[^>]*>/)?.[0] ?? '';
  if (!/lang=["']en(-GB)?["']/.test(htmlTag)) err(page, 'lang', 'html element has no lang="en-GB"');

  /* title */
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').trim();
  if (!title) err(page, 'title', 'no <title>');
  else {
    if (title.length > 70) warn(page, 'title-length', `${title.length} chars: "${title}"`);
    if (title.length < 20) warn(page, 'title-length', `${title.length} chars: "${title}"`);
    if (!is404 && !noindex) { if (titles.has(title)) err(page, 'title-duplicate', `same title as ${titles.get(title)}: "${title}"`); else titles.set(title, page); }
  }

  /* description */
  const desc = meta(html, 'name', 'description')[0];
  if (!desc) err(page, 'description', 'no meta description');
  else {
    if (desc.length > 165) warn(page, 'description-length', `${desc.length} chars`);
    if (desc.length < 60) warn(page, 'description-length', `${desc.length} chars: "${desc}"`);
    if (!is404 && !noindex) { if (descriptions.has(desc)) err(page, 'description-duplicate', `same description as ${descriptions.get(desc)}`); else descriptions.set(desc, page); }
  }

  /* h1 */
  const h1s = tags(html, /<h1[\s>]/g).length;
  if (h1s !== 1) err(page, 'h1', `${h1s} h1 elements`);

  /* canonical */
  const canon = tags(html, /<link\s[^>]*>/g).filter((t) => attr(t, 'rel') === 'canonical').map((t) => attr(t, 'href'));
  if (canon.length !== 1) err(page, 'canonical', `${canon.length} canonical links`);
  else if (siteUrl && !is404 && canon[0] !== `${siteUrl}${page}`) err(page, 'canonical', `canonical ${canon[0]} does not match ${siteUrl}${page}`);

  /* open graph and twitter */
  for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) if (!meta(html, 'property', k)[0]) err(page, 'open-graph', `missing ${k}`);
  if (!meta(html, 'name', 'twitter:card')[0]) warn(page, 'twitter', 'missing twitter:card');
  if (!is404 && !robots) warn(page, 'robots', 'no robots meta');
  if (!is404 && !noindex) indexable.add(page);

  /* structured data */
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (ld.length === 0 && !is404) warn(page, 'json-ld', 'no structured data');
  const types = [];
  for (const block of ld) {
    try {
      const parsed = JSON.parse(block);
      const list = Array.isArray(parsed) ? parsed : parsed['@graph'] ?? [parsed];
      for (const node of list) {
        if (!node['@type']) err(page, 'json-ld', 'node with no @type');
        types.push(node['@type']);
        if (node['@type'] === 'FAQPage' && !(node.mainEntity?.length > 0)) err(page, 'json-ld', 'FAQPage with no questions');
        if (node['@type'] === 'BreadcrumbList' && !(node.itemListElement?.length > 0)) err(page, 'json-ld', 'BreadcrumbList with no items');
        if (['Article', 'BlogPosting'].includes(node['@type']) && !(node.headline && node.datePublished)) err(page, 'json-ld', `${node['@type']} without headline or datePublished`);
        const dump = JSON.stringify(node);
        if (/\b(undefined|NaN|null,)\b/.test(dump) && /"(name|headline|description|text|url)":(null|"undefined")/.test(dump)) err(page, 'json-ld', 'null or undefined in a required field');
      }
    } catch (e) { err(page, 'json-ld', `does not parse: ${e.message}`); }
  }
  const nested = page !== '/' && !is404 && page.split('/').filter(Boolean).length >= 1;
  if (nested && !noindex && !types.includes('BreadcrumbList')) warn(page, 'breadcrumb', 'no BreadcrumbList structured data');

  /* links */
  const anchors = tags(html, /<a\s[^>]*>/g);
  for (const a of anchors) {
    const href = attr(a, 'href');
    if (href === null || href === '' || href === '#') { err(page, 'link', `empty href: ${a.slice(0, 80)}`); continue; }
    if (href.startsWith('/') && !href.startsWith('//')) {
      if (!exists(href)) err(page, 'link', `internal link to ${href} has no built page`);
    } else if (/^https?:/.test(href)) {
      if (siteUrl && href.startsWith(siteUrl + '/')) warn(page, 'link', `absolute internal link ${href}, use a path`);
      const rel = attr(a, 'rel') ?? '';
      if (/awin1\.com|cread\.php/.test(href) && !/sponsored/.test(rel)) err(page, 'link', `affiliate link without rel="sponsored": ${href.slice(0, 80)}`);
      if (!/noopener|noreferrer/.test(rel) && /target=["']_blank["']/.test(a)) warn(page, 'link', `target=_blank without rel=noopener: ${href.slice(0, 60)}`);
    }
  }

  /* images */
  for (const img of tags(html, /<img\s[^>]*>/g)) {
    if (attr(img, 'alt') === null) err(page, 'img', `image without alt: ${(attr(img, 'src') ?? '').slice(0, 80)}`);
    if (!attr(img, 'width') || !attr(img, 'height')) warn(page, 'img', `image without width and height: ${(attr(img, 'src') ?? '').slice(0, 80)}`);
  }

  /* copy faults, checked in the visible text and the head */
  const visible = text(html.replace(/<head>[\s\S]*?<\/head>/, ''));
  const headText = `${title} ${desc ?? ''}`;
  for (const [where, t] of [['head', headText], ['body', visible]]) {
    if (t.includes('—')) err(page, 'em-dash', `${where} contains an em dash`);
    const unit = t.match(/\b\d+(gb|mb)\b/);
    if (unit) err(page, 'copy', `${where}: lowercase unit "${unit[0]}"`);
    const month = t.match(new RegExp(`\\b(each|every|from|in|on \\d+) (${MONTHS})\\b`));
    if (month) err(page, 'copy', `${where}: lowercase month "${month[0]}"`);
    const leak = t.match(/\b(undefined|NaN|\[object Object\]|null null)\b/);
    if (leak) err(page, 'copy', `${where}: template leak "${leak[0]}"`);
  }
  const words = visible.split(' ').length;
  if (!is404 && !noindex && words < 200) warn(page, 'thin', `${words} words of visible text`);
  if (/ (colour|color)=/.test(html)) {}
}

/* The sitemap should list every indexable page and nothing else. */
const smFile = join(dist, 'sitemap.xml');
if (!existsSync(smFile)) err('/sitemap.xml', 'sitemap', 'missing');
else {
  const sm = readFileSync(smFile, 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const listed = new Set(locs.map((l) => siteUrl ? l.replace(siteUrl, '') : new URL(l).pathname));
  for (const l of listed) if (!exists(l)) err('/sitemap.xml', 'sitemap', `lists ${l}, which has no built page`);
  for (const p of indexable) if (!listed.has(p)) err('/sitemap.xml', 'sitemap', `does not list indexable page ${p}`);
  if (siteUrl) for (const l of locs) if (!l.startsWith(siteUrl)) err('/sitemap.xml', 'sitemap', `${l} is not on ${siteUrl}`);
}
for (const f of ['robots.txt', 'llms.txt', 'llms-full.txt', 'feed.xml', '404.html', 'favicon.svg', 'og.png']) if (!existsSync(join(dist, f))) err(`/${f}`, 'missing', 'file not built');
if (existsSync(join(dist, 'robots.txt')) && !/Sitemap:/.test(readFileSync(join(dist, 'robots.txt'), 'utf8'))) err('/robots.txt', 'robots', 'no Sitemap line');
if (existsSync(join(dist, 'feed.xml'))) {
  const feed = readFileSync(join(dist, 'feed.xml'), 'utf8');
  if (!/<rss|<feed/.test(feed)) err('/feed.xml', 'feed', 'not RSS or Atom');
  for (const l of [...feed.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1])) if (siteUrl && l.startsWith(siteUrl) && !exists(l.replace(siteUrl, ''))) err('/feed.xml', 'feed', `links to ${l}, which has no built page`);
}

/* Report */
const group = (list) => { const by = {}; for (const f of list) (by[f.rule] ??= []).push(f); return by; };
const print = (label, list) => {
  const by = group(list);
  for (const rule of Object.keys(by).sort()) {
    console.log(`${label}  ${rule} (${by[rule].length})`);
    for (const f of by[rule].slice(0, 12)) console.log(`      ${f.page}  ${f.detail}`);
    if (by[rule].length > 12) console.log(`      ... and ${by[rule].length - 12} more`);
  }
};
console.log(`audit ${relative(process.cwd(), dist)}: ${pages.length} pages, ${indexable.size} indexable, ${errors.length} errors, ${warnings.length} warnings`);
print('ERROR', errors);
print('warn ', warnings);
process.exit(errors.length ? 1 : 0);
