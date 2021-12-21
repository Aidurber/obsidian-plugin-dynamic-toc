import { CachedMetadata, HeadingCache } from "obsidian";
import { Heading } from "../models/heading";
import { DynamicTOCSettings, TableOptions } from "../types";

function clean(heading: string): string {
  return heading.replace(/[[\]]/g, "");
}

function buildMarkdownText(headings: HeadingCache[], options: TableOptions) {
  const firstHeadingDepth = headings[0].level;
  return headings
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
  options: TableOptions,
  settings: DynamicTOCSettings
) {
  if (!fileMetaData?.headings) return "";
  const { headings } = fileMetaData;
  const processableHeadings = headings.filter(
    (h) => !!h && h.level >= options.min_depth && h.level <= options.max_depth
  );

  if (!processableHeadings.length) return "";
  if (settings.useNewHeaderExtraction) {
    return buildMarkdownTextV2(
      processableHeadings.map((h) => new Heading(h)),
      options
    );
  }
  return buildMarkdownText(processableHeadings, options);
}
