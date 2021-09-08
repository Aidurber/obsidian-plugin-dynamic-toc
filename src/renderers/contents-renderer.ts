import { App, MarkdownRenderChild, MarkdownRenderer } from "obsidian";
import { mergeSettings } from "../utils/config";
import { extractHeadings } from "../utils/headings";
import { DynamicTOCSettings, ExtendedTFile, TableOptions } from "../types";

export class ContentsRenderer extends MarkdownRenderChild {
  constructor(
    private app: App,
    private config: TableOptions,
    private filePath: string,
    public container: HTMLElement
  ) {
    super(container);
  }
  async onload() {
    await this.render();
    this.app.metadataCache.on("changed", this.onFileChangeHandler);

    // TODO extend obsidian types
    this.app.metadataCache.on(
      //@ts-ignore
      "dynamic-toc:settings",
      this.onSettingsChangeHandler
    );
  }

  onunload() {
    this.app.metadataCache.off("changed", this.onFileChangeHandler);
    this.app.metadataCache.off(
      "dynamic-toc:settings",
      this.onSettingsChangeHandler
    );
  }
  onSettingsChangeHandler = (settings: DynamicTOCSettings) => {
    this.config = mergeSettings(this.config, settings);
    this.render();
  };
  onFileChangeHandler = (file: ExtendedTFile) => {
    if (file.deleted || file.path !== this.filePath) return;
    this.render();
  };

  async render() {
    this.container.empty();
    this.container.classList.add("table-of-contents");
    const headings = extractHeadings(
      this.app.metadataCache.getCache(this.filePath),
      this.config
    );
    await MarkdownRenderer.renderMarkdown(
      headings,
      this.container,
      this.filePath,
      this
    );
  }
}
