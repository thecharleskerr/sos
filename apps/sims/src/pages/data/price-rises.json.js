import { priceRises as table } from '@sos/compliance/price-rises';
import { getSite } from '@sos/ui/site';
/* The verified table as it stands, with the source URL and check date on
   every entry, so anyone citing a figure can cite where it came from. */
export function GET() {
  const site = getSite('sims');
  const body = {
    table: 'price-rises',
    publisher: site.name,
    page: `${site.url}/networks/`,
    terms: `${site.url}/terms/`,
    note: 'Every entry names the network\'s own page it was read from and the date. evidence: unverified means no figure has been confirmed and every field is null. Deal prices are not in this file; they live on the deal cards and change weekly.',
    entries: table,
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
