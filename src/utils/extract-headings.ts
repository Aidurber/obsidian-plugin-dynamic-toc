import { CachedMetadata } from "obsidian";
import { Heading } from "../models/heading";
import { TableOptions } from "../types";

function buildMarkdownText(headings: Heading[], options: TableOptions): string {
  const firstHeadingDepth = headings[0].level;
  const list: string[] = [];
  if (options.title) {
    list.push(`${options.title}`);
  }
  let previousIndent = 0;
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const itemIndication = (options.style === "number" && "1.") || "-";
    let numIndents = new Array(Math.max(0, heading.level - firstHeadingDepth));

    if (options.allow_inconsistent_headings) {
      if (numIndents.length - previousIndent > 1) {
        numIndents = new Array(previousIndent + 1);
      }
      previousIndent = numIndents.length;
    }

    const indent = numIndents.fill("\t").join("");
    list.push(`${indent}${itemIndication} ${heading.markdownHref}`);
  }
  return list.join("\n");
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
  return buildMarkdownText(
    processableHeadings.map((h) => new Heading(h)),
    options
  );
}
