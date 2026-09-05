import { getCollection } from 'astro:content';
import { getSite, llmsFullTxt } from '@sos/ui/site';
import { live } from '@sos/ui/posts';
import { networks } from '@sos/ui/networks';
import { roaming } from '@sos/compliance/roaming';
import { priceRises } from '@sos/compliance/price-rises';
import { studentOffers } from '@sos/compliance/students';

const gbp = (n) => `£${n.toFixed(2)}`;
export async function GET() {
  const posts = live(await getCollection('posts'), { dev: false });
  const rows = Object.entries(networks).map(([k, n]) => {
    const r = roaming[k], p = priceRises[k], s = studentOffers[k];
    const roam = r?.evidence !== 'unverified' ? (r.euIncluded === true ? `included, ${r.euCapGB !== null ? `${r.euCapGB}GB cap` : r.euCapText ?? 'no cap stated'}` : r.euIncluded === false ? `${r.dailyChargeGBP !== null ? `${gbp(r.dailyChargeGBP)} a day` : 'charged'}, ${r.euCapGB !== null ? `${r.euCapGB}GB cap` : r.euCapText ?? 'no cap stated'}` : `${r.euIncludedText ?? 'by plan'}`) : 'not verified';
    const rise = p?.evidence !== 'unverified' ? (p.type === 'none' ? 'no price rise' : p.amountGBP !== null ? `${gbp(p.amountGBP)} a month each ${p.month}` : `by plan size each ${p.month}`) : 'not verified';
    const stu = s?.hasOffer === true ? s.offer : 'none found';
    return `| ${n.name} | ${n.hostNetwork === 'direct' ? 'its own' : n.hostNetwork ?? 'not stated'} | ${roam} | ${rise} | ${stu} |`;
  });
  const table = ['| Network | Runs on | EU roaming | Mid-contract price rise | Student offer |', '|---|---|---|---|---|', ...rows].join('\n');
  return new Response(llmsFullTxt(getSite('sims'), posts, [{ title: 'Every network, from its own pages', body: table }]), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
