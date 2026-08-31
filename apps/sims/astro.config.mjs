import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://saveonsims.co.uk',
  output: 'static',
  build: { format: 'directory' },
});
