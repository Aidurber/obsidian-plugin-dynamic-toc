import { App, TFile } from "obsidian";
import { DynamicTOCSettings, TableOptions } from "./types";

export interface IHeadingExtractor {
  extract(file: TFile, options: TableOptions): string;
}
export class HeadingExtractor implements IHeadingExtractor {
  constructor(protected app: App) {}
  extract(file: TFile, options: TableOptions): string {
    const { headings } = this.app.metadataCache.getFileCache(file);
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
        return `${indent}${itemIndication} [[#${heading.heading}|${heading.heading}]]`;
      })
      .join("\n");
  }
}
