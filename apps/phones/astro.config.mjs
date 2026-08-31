import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://saveonsmartphones.co.uk',
  output: 'static',
  build: { format: 'directory' },
});
