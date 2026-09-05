import { getCollection } from 'astro:content';
import { getSite, llmsTxt } from '@sos/ui/site';
import { live } from '@sos/ui/posts';
import { networks } from '@sos/ui/networks';
import { categories, categoryKeys } from '@sos/data/rules/categories';
import { pairs, pairSlug } from '@sos/data/rules/compare';

export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  const nets = Object.entries(networks).map(([key, n]) => ({ key, name: n.name }));
  const cats = categoryKeys.map((key) => ({ key, title: categories[key].title, answer: categories[key].answer }));
  const compares = pairs.map((p) => ({ slug: pairSlug(p), title: `${networks[p[0]].name} vs ${networks[p[1]].name}` }));
  return new Response(llmsTxt(getSite('sims'), posts, { networks: nets, categories: cats, compares }), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
