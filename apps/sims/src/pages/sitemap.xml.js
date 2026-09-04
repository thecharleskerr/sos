import { getCollection } from 'astro:content';
import { getSite, sitemapXml } from '@sos/ui/site';
import { live } from '@sos/ui/posts';
import { networks } from '@sos/ui/networks';
import { categoryKeys } from '@sos/data/rules/categories';
import { pairs, pairSlug } from '@sos/data/rules/compare';

export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  const today = new Date().toISOString().slice(0, 10);
  const extra = [
    ...Object.keys(networks).map((k) => ({ path: `/networks/${k}/`, changefreq: 'weekly', priority: 0.7 })),
    ...categoryKeys.map((k) => ({ path: `/deals/${k}/`, changefreq: 'weekly', priority: 0.8 })),
    ...pairs.map((p) => ({ path: `/compare/${pairSlug(p)}/`, changefreq: 'weekly', priority: 0.6 })),
  ];
  return new Response(sitemapXml(getSite('sims'), posts, { today, extra }), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
