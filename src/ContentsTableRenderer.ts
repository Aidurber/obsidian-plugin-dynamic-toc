import { Component, MarkdownRenderer, parseYaml, TFile } from "obsidian";
import { IHeadingExtractor } from "./HeadingExtractor";
import { DynamicTOCSettings, TableOptions } from "./types";

export class ContentsTableRenderer {
  constructor(
    protected headingExtractor: IHeadingExtractor,
    protected source: string,
    protected element: HTMLElement,
    protected component: Component,
    protected settings: DynamicTOCSettings
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
   * Build the table of contents
   * @param file - Current file
   */
  build = async (file: TFile) => {
    try {
      this.element.empty();
      this.element.classList.add("table-of-contents");
      const headings = this.headingExtractor.extract(file, this.options);
      await MarkdownRenderer.renderMarkdown(
        headings,
        this.element,
        file.path,
        this.component
      );
    } catch (error) {
      console.error(error);
    }
  };
}
