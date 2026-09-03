/* The two sites, as the SEO head, the sitemap, the policies and llms.txt
   describe them. One place, so the name or URL cannot drift between pages.

   legalName and contactEmail are null until the owner sets them: the
   privacy policy needs the name of the data controller and a contact route,
   and a made-up one is worse than a blank, so the pages omit the line until
   the value exists. */
export const sites = {
  sims: {
    key: 'sims',
    name: 'Save on Sims',
    url: 'https://saveonsims.co.uk',
    strap: 'The best UK SIM only deals, checked every Monday.',
    description: 'A weekly showcase of the best UK SIM only deals. Every card shows the monthly price, the total cost, the mid-contract price rise in pounds and pence, roaming and the date it was checked.',
    sister: { name: 'Save on Smartphones', url: 'https://saveonsmartphones.co.uk' },
    legalName: null,
    contactEmail: null,
    /* Every page that is not a post. Paths with trailing slashes to match
       the directory build format. */
    pages: [
      { path: '/', changefreq: 'weekly', priority: 1.0 },
      { path: '/students/', changefreq: 'weekly', priority: 0.8 },
      { path: '/guides/eu-roaming-by-network/', changefreq: 'monthly', priority: 0.8 },
      { path: '/blog/', changefreq: 'weekly', priority: 0.7 },
      { path: '/networks/', changefreq: 'weekly', priority: 0.8 },
      { path: '/this-week/', changefreq: 'weekly', priority: 0.6 },
      { path: '/how-we-pick-deals/', changefreq: 'monthly', priority: 0.5 },
      { path: '/about/', changefreq: 'yearly', priority: 0.4 },
      { path: '/terms/', changefreq: 'yearly', priority: 0.2 },
      { path: '/privacy/', changefreq: 'yearly', priority: 0.2 },
    ],
  },
  phones: {
    key: 'phones',
    name: 'Save on Smartphones',
    url: 'https://saveonsmartphones.co.uk',
    strap: "Deals on the UK's top 10 phones, checked every Monday.",
    description: "A weekly showcase of the best UK deals on the ten best-selling phones. Every card shows the monthly price, the upfront cost, the total over the contract, the mid-contract price rise in pounds and pence, and the date it was checked.",
    sister: { name: 'Save on Sims', url: 'https://saveonsims.co.uk' },
    legalName: null,
    contactEmail: null,
    pages: [
      { path: '/', changefreq: 'weekly', priority: 1.0 },
      { path: '/blog/', changefreq: 'weekly', priority: 0.7 },
      { path: '/how-we-pick-deals/', changefreq: 'monthly', priority: 0.5 },
      { path: '/about/', changefreq: 'yearly', priority: 0.4 },
      { path: '/terms/', changefreq: 'yearly', priority: 0.2 },
      { path: '/privacy/', changefreq: 'yearly', priority: 0.2 },
    ],
  },
};

export const getSite = (key) => sites[key];

/* The sitemap XML for a site, from its static pages and the live posts. */
export function sitemapXml(site, posts = [], { today, extra = [] }) {
  const iso = (d) => new Date(d).toISOString().slice(0, 10);
  const entries = [
    ...site.pages.map((p) => ({ loc: `${site.url}${p.path}`, lastmod: today, changefreq: p.changefreq, priority: p.priority })),
    ...extra.map((e) => ({ loc: `${site.url}${e.path}`, lastmod: e.lastmod ?? today, changefreq: e.changefreq ?? 'weekly', priority: e.priority ?? 0.7 })),
    ...posts.map((p) => ({ loc: `${site.url}/blog/${p.id}/`, lastmod: iso(p.data.checked), changefreq: 'monthly', priority: 0.6 })),
  ];
  const rows = entries.map((e) =>
    `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority.toFixed(1)}</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`;
}

export const robotsTxt = (site) => `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`;

/* llms.txt: what an AI assistant should know about the site, in Markdown,
   so an answer engine quotes verified pages rather than guessing. */
export function llmsTxt(site, posts = [], { networks = [], categories = [] } = {}) {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'Every figure on the site comes from the network\'s or maker\'s own pages on the date shown beside it, or from a deal card that is re-checked every Monday. Where a network does not state something, the site says "Not stated" rather than guessing. Nothing on the site is a checkout: deals link to the network or retailer, and the site earns an affiliate commission on some of them, which each card discloses.',
    '',
    '## Key pages',
    '',
    ...site.pages.filter((p) => !/terms|privacy/.test(p.path)).map((p) => `- [${site.url}${p.path}](${site.url}${p.path})`),
    '',
  ];
  if (categories.length) {
    lines.push('## Deal categories, re-ranked every Monday', '');
    for (const c of categories) lines.push(`- [${c.title}](${site.url}/deals/${c.key}/): ${c.answer}`);
    lines.push('');
  }
  if (networks.length) {
    lines.push('## Networks, one page each with roaming, price rise and student offer from the network\'s own pages', '');
    for (const n of networks) lines.push(`- [${n.name}](${site.url}/networks/${n.key}/)`);
    lines.push('', '## Verified tables as JSON', '', `- ${site.url}/data/roaming.json`, `- ${site.url}/data/price-rises.json`, `- ${site.url}/data/students.json`, `- ${site.url}/data/networks.json`, '', 'Every entry carries the source URL and the date it was checked. Unverified entries are null rather than guessed.', '');
  }
  if (posts.length) {
    lines.push('## Guides', '');
    for (const p of posts) lines.push(`- [${p.data.title}](${site.url}/blog/${p.id}/): ${p.data.answer}`);
    lines.push('');
  }
  lines.push('## Sister site', '', `- [${site.sister.name}](${site.sister.url})`, '', '## Policies', '', `- [Terms](${site.url}/terms/)`, `- [Privacy](${site.url}/privacy/)`, '');
  return lines.join('\n');
}

/* llms-full.txt: the whole site's text in one Markdown file, for answer
   engines that read one document rather than crawl. */
export function llmsFullTxt(site, posts = [], sections = []) {
  const out = [llmsTxt(site, posts), '', '---', ''];
  for (const sec of sections) out.push(`# ${sec.title}`, '', sec.body.trim(), '', '---', '');
  for (const p of posts) {
    out.push(`# ${p.data.title}`, '', `Published ${new Date(p.data.publishDate).toISOString().slice(0, 10)}. Figures checked ${new Date(p.data.checked).toISOString().slice(0, 10)}. ${site.url}/blog/${p.id}/`, '', `**Short answer:** ${p.data.answer}`, '', (p.body ?? '').trim(), '', '## Questions people ask', '');
    for (const f of p.data.faq) out.push(`**${f.q}** ${f.a}`, '');
    out.push('## Sources', '', ...p.data.sources.map((s) => `- ${s.name}: ${s.url} (checked ${new Date(s.checked).toISOString().slice(0, 10)})`), '', '---', '');
  }
  return out.join('\n');
}

/* RSS for the guides. */
export function feedXml(site, posts = []) {
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const items = posts.map((p) => `  <item>
    <title>${esc(p.data.title)}</title>
    <link>${site.url}/blog/${p.id}/</link>
    <guid isPermaLink="true">${site.url}/blog/${p.id}/</guid>
    <pubDate>${new Date(p.data.publishDate).toUTCString()}</pubDate>
    <description>${esc(p.data.answer)}</description>
  </item>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(site.name)} guides</title>
  <link>${site.url}/blog/</link>
  <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
  <description>${esc(site.description)}</description>
  <language>en-GB</language>
${items.join('\n')}
</channel>
</rss>
`;
}
