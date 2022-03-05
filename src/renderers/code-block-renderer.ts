import {
  App,
  MarkdownRenderChild,
  MarkdownRenderer,
  TFile,
  WorkspaceLeaf,
} from "obsidian";
import { mergeSettings } from "../utils/config";
import { extractHeadings } from "../utils/extract-headings";
import { DynamicTOCSettings, TableOptions } from "../types";
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
      this.app.workspace.on(
        "active-leaf-change",
        this.onActiveLeafChangeHandler
      )
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", this.onFileChangeHandler)
    );
  }

  onActiveLeafChangeHandler = (_: WorkspaceLeaf) => {
    const activeFile = this.app.workspace.getActiveFile();
    this.filePath = activeFile.path;
    this.onFileChangeHandler(activeFile);
  };

  onSettingsChangeHandler = (settings: DynamicTOCSettings) => {
    this.render(mergeSettings(this.config, settings));
  };
  onFileChangeHandler = (file: TFile) => {
    this.filePath = file.path;
    if (file.deleted) return;
    this.render();
  };

  async render(configOverride?: TableOptions) {
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
  }
}
