import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { postSchema } from '@sos/ui/post-schema';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: postSchema(z),
});

export const collections = { posts };
