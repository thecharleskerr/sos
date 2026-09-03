/* The two Awin product data endpoints the weekly job uses. Both are keyed by
   the data feed API key from Create-a-Feed, held in AWIN_API_TOKEN.

   List      https://productdata.awin.com/datafeed/list/apikey/{key}
             One CSV row per feed the account can see: vertical, advertiser,
             last upload, product count and a download URL for that feed.
   Download  the URL from the list row. A CSV, usually gzipped.

   From help.awin.com/docs/product-feed-list-download and
   developer.awin.com/docs/downloading-feeds-using-create-a-feed, read on
   2026-09-02. The docs describe the list columns in words rather than as
   exact headers, so they are matched loosely below and the first real pull
   will confirm them. */
import { gunzipSync } from 'node:zlib';
import { parseCSVObjects } from './csv.mjs';

const LIST_URL = (key) => `https://productdata.awin.com/datafeed/list/apikey/${encodeURIComponent(key)}`;

/* The API key sits in the URL, so it must never reach a log line. */
export const redact = (url) => String(url).replace(/apikey\/[^/]+/i, 'apikey/***');

export async function fetchText(url, { timeoutMs = 90000, fetchImpl = fetch } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'saveonsims-weekly-refresh (+https://saveonsims.co.uk)' },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${redact(url)}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const gzipped = buf.length > 1 && buf[0] === 0x1f && buf[1] === 0x8b;
    return (gzipped ? gunzipSync(buf) : buf).toString('utf8');
  } finally {
    clearTimeout(timer);
  }
}

const col = (row, re) => {
  const k = Object.keys(row).find((h) => re.test(h));
  return k ? row[k] : '';
};

/* Every feed in the telco vertical. Other verticals are ignored here rather
   than filtered later, so a fashion feed never costs a download. */
export async function listTelcoFeeds(apiKey, opts = {}) {
  const text = await fetchText(LIST_URL(apiKey), opts);
  const { rows } = parseCSVObjects(text);
  return rows
    .map((r) => ({
      feedId: col(r, /feed.?id/i),
      advertiserId: col(r, /advertiser.?id|merchant.?id/i),
      advertiser: col(r, /advertiser.?name|merchant.?name/i),
      vertical: col(r, /vertical|category/i),
      membership: col(r, /membership|joined|status/i),
      products: Number(col(r, /products/i)) || 0,
      lastUploaded: col(r, /last.?upload/i),
      url: col(r, /^url$|download/i),
    }))
    .filter((f) => f.url && /telco|telecom|mobile|phone/i.test(f.vertical));
}

export async function downloadFeed(url, opts = {}) {
  return parseCSVObjects(await fetchText(url, opts));
}
