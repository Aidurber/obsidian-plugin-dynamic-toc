import { CachedMetadata } from "obsidian";
import { Heading } from "../models/heading";
import { TableOptions } from "../types";

function buildMarkdownTextV2(headings: Heading[], options: TableOptions) {
  const firstHeadingDepth = headings[0].level;

  return headings
    .map((heading) => {
      const itemIndication = (options.style === "number" && "1.") || "-";
      const indent = new Array(Math.max(0, heading.level - firstHeadingDepth))
        .fill("\t")
        .join("");

      return `${indent}${itemIndication} ${heading.markdownHref}`;
    })
    .join("\n");
}
export function extractHeadings(
  fileMetaData: CachedMetadata,
  options: TableOptions
) {
  if (!fileMetaData?.headings) return "";
  const { headings } = fileMetaData;
  const processableHeadings = headings.filter(
    (h) => !!h && h.level >= options.min_depth && h.level <= options.max_depth
  );

  if (!processableHeadings.length) return "";
  return buildMarkdownTextV2(
    processableHeadings.map((h) => new Heading(h)),
    options
  );
}
