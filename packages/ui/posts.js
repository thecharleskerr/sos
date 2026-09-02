/* Helpers shared by both sites' blog pages. */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

/* Posts that are published: not a draft, and dated on or before the build.
   In dev every post shows so it can be previewed. Sorted newest first. */
export function live(posts, { today = new Date(), dev = Boolean(import.meta.env?.DEV) } = {}) {
  /* PREVIEW_POSTS=1 builds every dated post, for checking a batch before its
     dates arrive. Never set in CI or on the hosts. */
  const preview = dev || process.env.PREVIEW_POSTS === '1';
  return posts
    .filter((p) => !p.data.draft && (preview || new Date(p.data.publishDate) <= today))
    .sort((a, b) => new Date(b.data.publishDate) - new Date(a.data.publishDate));
}

/* The live deals for the picks a post names, read from content/<site>/ at
   build time. Absent file, absent pick or a deal that is not live all give
   nothing, never a stale card. Deduplicated and kept in the order named. */
export function dealsFor(site, picks, fromUrl) {
  if (!picks?.length) return [];
  const here = dirname(fileURLToPath(fromUrl));
  const path = resolve(here, '../../../../../content', site, 'deals.json');
  if (!existsSync(path)) return [];
  const { deals } = JSON.parse(readFileSync(path, 'utf8'));
  const out = [];
  for (const pick of picks) {
    const d = deals.find((x) => x.status === 'live' && x.pick === pick);
    if (d && !out.includes(d)) out.push(d);
  }
  return out;
}
