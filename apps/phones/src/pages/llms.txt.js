import { getCollection } from 'astro:content';
import { getSite, llmsTxt } from '@sos/ui/site';
import { live } from '@sos/ui/posts';

export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  return new Response(llmsTxt(getSite('phones'), posts), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
