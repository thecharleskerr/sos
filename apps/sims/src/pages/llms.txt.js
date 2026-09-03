import { getCollection } from 'astro:content';
import { getSite, llmsTxt } from '@sos/ui/site';
import { live } from '@sos/ui/posts';
import { networks } from '@sos/ui/networks';
import { categories, categoryKeys } from '@sos/data/rules/categories';

export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  const nets = Object.entries(networks).map(([key, n]) => ({ key, name: n.name }));
  const cats = categoryKeys.map((key) => ({ key, title: categories[key].title, answer: categories[key].answer }));
  return new Response(llmsTxt(getSite('sims'), posts, { networks: nets, categories: cats }), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
