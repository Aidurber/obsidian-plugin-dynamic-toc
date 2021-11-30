import { App, MarkdownRenderChild, MarkdownRenderer, TFile } from "obsidian";
import { mergeSettings } from "../utils/config";
import { extractHeadings } from "../utils/headings";
import { DynamicTOCSettings, TableOptions } from "../types";
import { createTimer } from "src/utils/timer";
import { TABLE_CLASS_NAME } from "src/constants";

export class CodeBlockRenderer extends MarkdownRenderChild {
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
    this.registerEvent(
      this.app.metadataCache.on(
        //@ts-ignore
        "dynamic-toc:settings",
        this.onSettingsChangeHandler
      )
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", this.onFileChangeHandler)
    );
  }

  onSettingsChangeHandler = (settings: DynamicTOCSettings) => {
    this.render(mergeSettings(this.config, settings));
  };
  onFileChangeHandler = (file: TFile) => {
    if (file.deleted || file.path !== this.filePath) return;
    this.render();
  };

  async render(configOverride?: TableOptions) {
    const timer = createTimer("codeblock renderer");
    timer.start();
    this.container.empty();
    this.container.classList.add(TABLE_CLASS_NAME);
    const headings = extractHeadings(
      this.app.metadataCache.getCache(this.filePath),
      configOverride || this.config
    );
    await MarkdownRenderer.renderMarkdown(
      headings,
      this.container,
      this.filePath,
      this
    );
    timer.stop();
  }
}
