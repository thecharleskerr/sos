/* Turns what a plan page shows into feed-shaped rows. Two routes, in order
   of trust: the page's own structured data (Product and Offer JSON-LD, which
   several networks publish), then the visible text of each plan card. Both
   feed the same row shape the Awin normaliser already understands, so a
   scraped plan and a feed plan go through the same rules.

   Nothing here guesses. A card that does not state a monthly price and a
   data allowance yields no row. Allowances the card does not state stay
   blank and the normaliser drops the row with a reason. */

const money = (s) => {
  const m = String(s ?? '').replace(/,/g, '').match(/£\s*(\d+(?:\.\d+)?)/);
  return m ? Math.round(Number(m[1]) * 100) / 100 : null;
};

/* One plan card's visible text to the fields it states. */
export function parsePlanText(text) {
  const t = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!t) return null;
  const out = {};

  const unlimitedData = /unlimited\s+(?:5g\s+)?data/i.test(t) || /^unlimited\b/i.test(t);
  const dataM = t.match(/(\d+(?:\.\d+)?)\s*(GB|MB)\b(?!\s*(?:eu|roaming|abroad))/i);
  out.inc_data = unlimitedData ? 'Unlimited' : dataM ? `${dataM[1]}${dataM[2].toUpperCase()}` : '';

  /* The monthly price is the one followed by a month word; a bare price
     next to "upfront" is the upfront cost. */
  const monthlyM = t.match(/£\s*(\d+(?:\.\d+)?)\s*(?:\/|a|per|each)\s*(?:month|mth|mo)\b/i)
    ?? t.match(/£\s*(\d+(?:\.\d+)?)\s*(?:p\/m|pm)\b/i);
  out.month_cost = monthlyM ? String(Math.round(Number(monthlyM[1]) * 100) / 100) : '';
  const upfrontM = t.match(/£\s*(\d+(?:\.\d+)?)\s*(?:upfront|up front)/i) ?? t.match(/(?:upfront|up front)(?:\s*cost)?:?\s*£\s*(\d+(?:\.\d+)?)/i);
  out.initial_cost = upfrontM ? String(Math.round(Number(upfrontM[1]) * 100) / 100) : (/no upfront|£0 upfront|nothing upfront/i.test(t) ? '0' : '');

  const termM = t.match(/(\d+)\s*-?\s*month(?:s|ly)?\b(?!\s*(?:free|of))/i);
  if (/rolling|30\s*-?\s*day|no contract|1\s*-?\s*month|monthly plan/i.test(t) && !/(1[2-9]|2[0-9]|36)\s*-?\s*month/i.test(t)) out.term = '1 Month';
  else if (termM) out.term = `${termM[1]} Months`;
  else out.term = '';

  out.inc_minutes = /unlimited\s+(?:uk\s+)?(?:calls|minutes|mins)/i.test(t) || /unlimited\s+(?:uk\s+)?calls?\s*(?:&|and)\s*texts/i.test(t) ? 'Unlimited' : (t.match(/(\d+)\s*(?:uk\s+)?(?:minutes|mins)\b/i)?.[1] ?? '');
  out.inc_texts = /unlimited\s+(?:uk\s+)?texts/i.test(t) || /unlimited\s+(?:uk\s+)?calls?\s*(?:&|and)\s*texts/i.test(t) || /unlimited\s+(?:calls|minutes|mins)\s*(?:&|and|,)\s*texts/i.test(t) ? 'Unlimited' : (t.match(/(\d+)\s*texts\b/i)?.[1] ?? '');
  out.connectivity = /\b5g\b/i.test(t) ? '5G' : /\b4g\b/i.test(t) ? '4G' : '';
  out.product_name = t.slice(0, 120);
  return out;
}

/* Product and Offer blocks the page publishes. Only GBP offers with a price
   and a name count, and the allowances are read from the name and the
   description, never assumed. */
export function rowsFromJsonLd(blocks) {
  const rows = [];
  const done = new Set();
  const take = (product, o) => {
    if (!o || typeof o !== 'object' || done.has(o)) return;
    done.add(o);
    if (o.priceCurrency && o.priceCurrency !== 'GBP') return;
    const price = o.price ?? o.priceSpecification?.price;
    if (price === undefined || price === null || price === '' || Number.isNaN(Number(price))) return;
    const text = [product?.name, product?.description, o.name, o.description].filter(Boolean).join(' ');
    const parsed = parsePlanText(text) ?? {};
    rows.push({ ...parsed, product_name: product?.name ?? o.name ?? '', month_cost: String(Number(price)), url: o.url ?? product?.url ?? '', _via: 'jsonld' });
  };
  const walk = (node, parent = null) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((n) => walk(n, parent));
    const type = [].concat(node['@type'] ?? []);
    if (type.includes('Product')) {
      [].concat(node.offers ?? []).forEach((o) => take(node, o));
    } else if (type.includes('Offer')) {
      take(parent?.['@type'] ? parent : null, node);
    }
    for (const [k, v] of Object.entries(node)) if (k !== 'offers' && v && typeof v === 'object') walk(v, node);
  };
  for (const b of blocks) { try { walk(typeof b === 'string' ? JSON.parse(b) : b); } catch { /* malformed block, ignore */ } }
  return rows;
}

/* Card texts to rows. A card counts only if it states a monthly price and a
   data allowance. Cards that read the same collapse to one. */
export function rowsFromCards(texts) {
  const seen = new Set();
  const rows = [];
  for (const text of texts) {
    if (!/£/.test(text) || !/\d\s*(GB|MB)\b|unlimited/i.test(text)) continue;
    const p = parsePlanText(text);
    if (!p || !p.month_cost || !p.inc_data) continue;
    const key = `${p.inc_data}|${p.term}|${p.month_cost}|${p.initial_cost}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ ...p, _via: 'cards' });
  }
  return rows;
}

/* The finished feed-shaped row. Direct link unless the network has an Awin
   programme and the account is known, in which case the Awin deep link. */
export function toFeedRow(partial, { network, merchant, pageUrl, today, awinMid = null, publisherId = null }) {
  const affiliate = Boolean(awinMid && publisherId);
  const target = partial.url || pageUrl;
  return {
    aw_product_id: '',
    merchant_product_id: `${network}-${partial.inc_data}-${partial.term}-${partial.month_cost}`.toLowerCase().replace(/[^a-z0-9.-]+/g, '-'),
    product_name: partial.product_name || `${merchant} ${partial.inc_data} SIM only`,
    merchant_name: merchant,
    merchant_id: awinMid ? String(awinMid) : '',
    aw_deep_link: affiliate ? awinLink(awinMid, publisherId, target) : '',
    url: affiliate ? '' : target,
    is_affiliate: affiliate ? '1' : '0',
    last_updated: today,
    in_stock: '1',
    network,
    contract_type: 'SIM Only',
    term: partial.term,
    initial_cost: partial.initial_cost,
    month_cost: partial.month_cost,
    inc_data: partial.inc_data,
    inc_minutes: partial.inc_minutes,
    inc_texts: partial.inc_texts,
    connectivity: partial.connectivity,
    tariff: '',
    special_offer: '',
    brand_name: '',
    storage_size: '',
    _source: 'scrape',
  };
}

/* Awin's deep link: awinmid is the advertiser's programme id, awinaffid the
   publisher id, ued the destination. It only tracks once the account is
   approved on that programme, which the first run should confirm in Awin's
   link checker. */
export const awinLink = (mid, affid, url) => `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${affid}&ued=${encodeURIComponent(url)}`;

/* HotUKDeals RSS items become leads: title, link and date only. A lead is a
   prompt to check the network's own page, never a figure the site prints. */
export function parseRssLeads(xml, { limit = 40 } = {}) {
  const items = [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  const pick = (block, tag) => {
    const m = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`));
    return m ? m[1].trim() : '';
  };
  return items.slice(0, limit).map((b) => ({ title: pick(b, 'title'), link: pick(b, 'link'), published: pick(b, 'pubDate') })).filter((l) => l.title && l.link);
}
