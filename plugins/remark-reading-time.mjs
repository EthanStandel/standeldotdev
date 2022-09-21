import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

// copied straight out of Astro docs
// https://docs.astro.build/en/guides/markdown-content/#example-calculate-reading-time
export const remarkReadingTime = () => {
  return (tree, { data }) => {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}