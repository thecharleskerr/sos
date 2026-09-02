/* The frontmatter contract for a guide post, shared by both sites. Takes the
   zod instance from astro:content so the schema is built with the same zod
   Astro validates with.

   Every figure a post states must be traceable: a source with a checked date,
   or one of the verified tables in packages/compliance. Prices never sit in
   prose. They render live from content/ through the deals field, so a post
   written in September is still right in November. */
export const PICKS = [
  'deal-of-week', 'best-roaming', 'best-unlimited', 'cheapest',
  'best-short-contract', 'best-for-students',
];

export const postSchema = (z) => z.object({
  /* The H1 and the title tag. Written as the question people type. */
  title: z.string().min(10).max(90),
  /* The meta description. */
  description: z.string().min(50).max(160),
  /* The day it goes live. The build skips a post dated after the build. */
  publishDate: z.coerce.date(),
  /* The day its figures were last checked. Shown on the page. */
  checked: z.coerce.date(),
  /* The search query this post exists to answer, verbatim. */
  query: z.string().min(5),
  /* One or two sentences that answer the query outright. Printed first. */
  answer: z.string().min(40).max(400),
  /* Live deal cards to render, by pick, from this site's content/. */
  deals: z.array(z.enum(PICKS)).default([]),
  /* Where the reader should go next. */
  cta: z.object({ label: z.string().min(4).max(40), href: z.string().min(1) }),
  /* Every official page a figure came from. */
  sources: z.array(z.object({
    name: z.string().min(1),
    url: z.string().url(),
    checked: z.coerce.date(),
  })).min(1),
  /* Three to six questions people ask, answered in one short paragraph each.
     Rendered on the page and as FAQ structured data. */
  faq: z.array(z.object({ q: z.string().min(8), a: z.string().min(40) })).min(3).max(6),
  draft: z.boolean().default(false),
});
