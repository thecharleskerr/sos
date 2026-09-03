import { networks } from '@sos/ui/networks';
import { getSite } from '@sos/ui/site';
/* Which network each brand runs on, and whether it has an affiliate
   programme. Colours are left out: they are the site's, not the data. */
export function GET() {
  const site = getSite('sims');
  const entries = Object.fromEntries(Object.entries(networks).map(([k, n]) => [k, { name: n.name, hostNetwork: n.hostNetwork, note: n.note ?? null, page: `${site.url}/networks/${k}/` }]));
  return new Response(JSON.stringify({ table: 'networks', publisher: site.name, terms: `${site.url}/terms/`, entries }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
