import { getCollection } from 'astro:content';
import { getSite, feedXml } from '@sos/ui/site';
import { live } from '@sos/ui/posts';
export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  return new Response(feedXml(getSite('phones'), posts), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
