import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import rehypeLiveLinks from '@sos/ui/rehype-live-links';

/* Guide links to posts not yet published render as plain text. Every post
   shows in dev and under PREVIEW_POSTS=1, matching live() in posts.js. */
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const preview = process.env.PREVIEW_POSTS === '1' || process.env.npm_lifecycle_event === 'dev';

export default defineConfig({
  site: 'https://saveonsmartphones.co.uk',
  output: 'static',
  build: { format: 'directory' },
  markdown: {
    rehypePlugins: [[rehypeLiveLinks, { postsDir: here('./src/content/posts'), cross: { 'https://saveonsims.co.uk': here('../sims/src/content/posts') }, preview }]],
  },
});
