import { App, Component, MarkdownRenderer, parseYaml, TFile } from "obsidian";
import { TableOptions } from "./types";

export class ContentsTableRenderer {
  constructor(
    private app: App,
    private source: string,
    private element: HTMLElement,
    private component: Component
  ) {}
  private defaults: TableOptions = {
    style: "bullet",
  };
  private get options(): TableOptions {
    try {
      const options = parseYaml(this.source) as TableOptions;
      return { ...this.defaults, ...options };
    } catch (error) {
      return this.defaults;
    }
  }

  /**
   * Get the markdown headings for the current file
   */
  private getMarkdownHeadings = (file: TFile) => {
    const { headings } = this.app.metadataCache.getFileCache(file);
    const processableHeadings = headings.filter((h) => h.level !== 1);
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
