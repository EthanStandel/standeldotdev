import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";
import inspectUrls from "@jsdevtools/rehype-url-inspector";

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
    rehypePlugins: [
      [
        inspectUrls,
        {
          selectors: ["a[href]"],
          inspectEach(element) {
            const url = element?.node?.properties?.href;
            if (!url) return;
            const urlIsInternal = ["/", "#"].some((internalPrefix) =>
              url.startsWith(internalPrefix)
            );
            if (!urlIsInternal) {
              element.node.properties.target = "_blank";
              element.node.properties.rel = "noreferrer";
            }
          },
        },
      ],
    ],
  },
  integrations: [solidJs(), mdx(), sitemap()],
});
