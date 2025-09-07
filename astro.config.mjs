import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";
import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://standel.dev",
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [solidJs(), mdx(), sitemap()],
});
