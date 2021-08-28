import { App, Component, MarkdownRenderer, parseYaml, TFile } from "obsidian";
import { DynamicTOCSettings, TableOptions } from "./types";

export class ContentsTableRenderer {
  constructor(
    private app: App,
    private source: string,
    private element: HTMLElement,
    private component: Component,
    private settings: DynamicTOCSettings
  ) {}

  private get options(): TableOptions {
    try {
      const options = parseYaml(this.source) as TableOptions;
      const merged = Object.assign({}, this.settings, options);
      return Object.keys(merged).reduce((acc, curr: keyof TableOptions) => {
        const value = options[curr];
        const isEmptyValue = typeof value === "undefined" || value === null;
        return {
          ...acc,
          [curr]: isEmptyValue ? this.settings[curr] : value,
        };
      }, {} as TableOptions);
    } catch (error) {
      return this.settings;
    }
  }

  /**
   * Get the markdown headings for the current file
   */
  private getMarkdownHeadings = (file: TFile) => {
    const { headings } = this.app.metadataCache.getFileCache(file);
    const processableHeadings = headings.filter(
      (h) =>
        h.level >= this.options.min_depth && h.level <= this.options.max_depth
    );
    const firstHeadingDepth = processableHeadings[0].level;
    return processableHeadings
      .map((heading) => {
        const itemIndication = (this.options.style === "number" && "1.") || "-";
        const indent = new Array(Math.max(0, heading.level - firstHeadingDepth))
          .fill("\t")
          .join("");
        return `${indent}${itemIndication} [[#${heading.heading}|${heading.heading}]]`;
      })
      .join("\n");
  };

  /**
   * Build the table of contents
   * @param file - Current file
   */
  build = (file: TFile) => {
    try {
      this.clearElement();
      const headings = this.getMarkdownHeadings(file);
      MarkdownRenderer.renderMarkdown(
        headings,
        this.element,
        file.path,
        this.component
      );
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Clear the container HTML
   */
  private clearElement = () => {
    this.element.empty();
  };
}
