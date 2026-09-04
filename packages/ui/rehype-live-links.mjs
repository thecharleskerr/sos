/* A rehype plugin for the guide bodies: a link to a guide whose publish
   date has not arrived becomes plain text. The production build leaves
   future posts out, so without this a guide written in September would
   link to a page that 404s until November. Sentences are written to stand
   without the link, and the link returns on its own once the date passes,
   because the build runs daily.

   Same-site links are paths under /blog/. Cross-site links are matched by
   origin against the sister site's posts folder, since both sites live in
   this repository and build from the same checkout. */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { visit } from 'unist-util-visit';

/* The slugs of posts that are published: not a draft, dated on or before
   today. preview includes everything, matching PREVIEW_POSTS=1 and dev. */
export function liveSlugs(postsDir, { today = new Date(), preview = false } = {}) {
  const out = new Set();
  if (!postsDir || !existsSync(postsDir)) return out;
  for (const f of readdirSync(postsDir).filter((n) => n.endsWith('.md'))) {
    const text = readFileSync(join(postsDir, f), 'utf8');
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const date = fm.match(/^publishDate:\s*"?([0-9]{4}-[0-9]{2}-[0-9]{2})/m)?.[1];
    const draft = /^draft:\s*true/m.test(fm);
    if (!draft && (preview || (date && new Date(date) <= today))) out.add(f.replace(/\.md$/, ''));
  }
  return out;
}

/* options: { postsDir, cross: { [origin]: postsDir }, today, preview } */
export default function rehypeLiveLinks(options = {}) {
  const { postsDir, cross = {}, today, preview } = options;
  return (tree) => {
    const local = liveSlugs(postsDir, { today, preview });
    const remote = Object.fromEntries(Object.entries(cross).map(([origin, dir]) => [origin, liveSlugs(dir, { today, preview })]));
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'a' || !parent || typeof index !== 'number') return;
      const href = String(node.properties?.href ?? '');
      let slug = null, set = null;
      const same = /^\/blog\/([^/#?]+)\/?(?:[#?].*)?$/.exec(href);
      if (same) { slug = same[1]; set = local; }
      else {
        for (const [origin, slugs] of Object.entries(remote)) {
          const m = new RegExp(`^${origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/blog/([^/#?]+)/?(?:[#?].*)?$`).exec(href);
          if (m) { slug = m[1]; set = slugs; break; }
        }
      }
      if (slug === null || set.has(slug)) return;
      parent.children.splice(index, 1, ...node.children);
      return index;
    });
  };
}
