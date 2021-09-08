import { CachedMetadata } from "obsidian";
import { TableOptions } from "../types";

function clean(heading: string): string {
  return heading.replace(/[[\]]/g, "");
}
export function extractHeadings(
  fileMetaData: CachedMetadata,
  options: TableOptions
) {
  const { headings } = fileMetaData;
  const processableHeadings = headings.filter(
    (h) => h.level >= options.min_depth && h.level <= options.max_depth
  );
  const firstHeadingDepth = processableHeadings[0].level;
  return processableHeadings
    .map((heading) => {
      const itemIndication = (options.style === "number" && "1.") || "-";
      const indent = new Array(Math.max(0, heading.level - firstHeadingDepth))
        .fill("\t")
        .join("");
      const cleanHeading = clean(heading.heading);
      return `${indent}${itemIndication} [[#${cleanHeading}|${cleanHeading}]]`;
    })
    .join("\n");
}
