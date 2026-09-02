import { getCollection } from 'astro:content';
import { getSite, sitemapXml } from '@sos/ui/site';
import { live } from '@sos/ui/posts';

export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  const today = new Date().toISOString().slice(0, 10);
  return new Response(sitemapXml(getSite('phones'), posts, { today }), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
