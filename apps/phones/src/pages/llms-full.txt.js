import { getCollection } from 'astro:content';
import { getSite, llmsFullTxt } from '@sos/ui/site';
import { live } from '@sos/ui/posts';
export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  return new Response(llmsFullTxt(getSite('phones'), posts), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
