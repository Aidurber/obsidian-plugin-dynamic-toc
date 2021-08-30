import { App, TFile } from "obsidian";
import { TableOptions } from "./types";

export interface IHeadingExtractor {
  extract(file: TFile, options: TableOptions): string;
}
export class HeadingExtractor implements IHeadingExtractor {
  constructor(protected app: App) {}

  private clean = (heading: string): string => heading.replace(/[[\]]/g, "");
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
        const cleanHeading = this.clean(heading.heading);
        return `${indent}${itemIndication} [[#${cleanHeading}|${cleanHeading}]]`;
      })
      .join("\n");
  }
}
