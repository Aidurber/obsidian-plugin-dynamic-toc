import { HeadingCache } from "obsidian";

export type TableOptions = {
  style: "bullet" | "number";
};

// Taken from obsidian-plugin-toc
export function convertHeadingsToNestedStructure(
  headings: HeadingCache[],
  options: TableOptions
): string {
  const firstHeadingDepth = headings[0].level;
  return headings
    .map((heading) => {
      const itemIndication = (options.style === "number" && "1.") || "-";
      const indent = new Array(Math.max(0, heading.level - firstHeadingDepth))
        .fill("\t")
        .join("");

      return `${indent}${itemIndication} [[#${heading.heading}|${heading.heading}]]`;
    })
    .join("\n");
}
