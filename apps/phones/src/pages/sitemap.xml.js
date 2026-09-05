import { getCollection } from 'astro:content';
import { getSite, sitemapXml } from '@sos/ui/site';
import { live } from '@sos/ui/posts';
import { phones } from '@sos/compliance/phones';

export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  const today = new Date().toISOString().slice(0, 10);
  const extra = Object.keys(phones).map((k) => ({ path: `/phones/${k}/`, changefreq: 'weekly', priority: 0.8 }));
  return new Response(sitemapXml(getSite('phones'), posts, { today, extra }), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
