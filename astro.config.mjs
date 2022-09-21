import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";

import mdx from "@astrojs/mdx";
import { remarkReadingTime } from './plugins/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "css-variables"
    },
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [solidJs(), mdx()]
});
