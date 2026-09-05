/* Submits every URL in a site's built sitemap to IndexNow, which Bing,
   Yandex, Naver and Seznam share. Google does not use it. The key is public
   by design: the protocol proves ownership by serving <key>.txt from the
   site root, so the key files live in each app's public/ directory.

     node packages/data/seo/indexnow.mjs --site sims
     node packages/data/seo/indexnow.mjs --site phones --dry-run */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const args = process.argv.slice(2);
const site = args[args.indexOf('--site') + 1] || 'sims';
const dry = args.includes('--dry-run');

const pub = resolve(root, `apps/${site}/public`);
const keyFile = readdirSync(pub).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.error(`no IndexNow key file in ${pub}`); process.exit(1); }
const key = keyFile.replace(/\.txt$/, '');

const sitemap = resolve(root, `apps/${site}/dist/sitemap.xml`);
if (!existsSync(sitemap)) { console.error(`build first: ${sitemap} is missing`); process.exit(1); }
const urls = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const host = new URL(urls[0]).host;
const body = { host, key, keyLocation: `https://${host}/${keyFile}`, urlList: urls };

console.log(`${site}: ${urls.length} URLs for ${host}`);
if (dry) { console.log(JSON.stringify(body, null, 2).slice(0, 600)); process.exit(0); }
const res = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
console.log(`IndexNow responded ${res.status}`);
/* 200 and 202 both mean accepted. Anything else is reported, never fatal:
   a missed ping costs nothing the next crawl will not recover. */
