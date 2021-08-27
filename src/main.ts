import { MarkdownPostProcessorContext, Plugin, TFile } from "obsidian";
import { ContentsTableRenderer } from "./ContentsTableRenderer";

export default class DynamicTOCPlugin extends Plugin {
  private renderer: ContentsTableRenderer | null = null;
  onload = () => {
    console.log("ToC Plugin Loaded");
    this.registerMarkdownCodeBlockProcessor(
      "toc",
      this.codeblockProcessor.bind(this)
    );
  };
  onunload = () => {
    this.app.metadataCache.off("changed", this.renderer.build);
  };
  codeblockProcessor(
    source: string,
    element: HTMLElement,
    _: MarkdownPostProcessorContext
  ) {
    this.renderer = new ContentsTableRenderer(this.app, source, element, this);
    this.renderer.build(this.app.workspace.getActiveFile());
    this.app.metadataCache.on("changed", this.renderer.build);
  }
}
