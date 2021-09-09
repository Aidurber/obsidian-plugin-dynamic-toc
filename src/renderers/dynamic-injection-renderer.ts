import { App, MarkdownRenderChild, MarkdownRenderer } from "obsidian";
import {
  DynamicTOCSettings,
  ExtendedTFile,
  EXTERNAL_MARKDOWN_PREVIEW_STYLE,
} from "../types";
import { extractHeadings } from "../utils/headings";

export class DynamicInjectionRenderer extends MarkdownRenderChild {
  constructor(
    private app: App,
    private settings: DynamicTOCSettings,
    private filePath: string,
    private element: HTMLElement
  ) {
    super(element);
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
  onSettingsChangeHandler = () => {
    this.render();
  };
  onFileChangeHandler = (file: ExtendedTFile) => {
    if (file.deleted || file.path !== this.filePath) return;
    this.render();
  };
  private findMatch = (text: string): HTMLElement | null => {
    const match =
      Array.from(this.element.querySelectorAll("p, span, a")).find(
        (element) => {
          return element.textContent.toLowerCase().includes(text.toLowerCase());
        }
      ) || null;
    return match as HTMLElement | null;
  };
  async render() {
    const matcher =
      EXTERNAL_MARKDOWN_PREVIEW_STYLE[
        this.settings
          .externalStyle as keyof typeof EXTERNAL_MARKDOWN_PREVIEW_STYLE
      ];
    if (!matcher) {
      return;
    }
    let match: HTMLElement | null = null;
    try {
      match = this.findMatch(matcher);
    } catch (error) {
      console.error(error);
    }

    if (!match || !match?.parentNode) return;
    const headings = extractHeadings(
      this.app.metadataCache.getCache(this.filePath),
      this.settings
    );
    const newElement = document.createElement("div");
    newElement.classList.add("table-of-contents");
    await MarkdownRenderer.renderMarkdown(
      headings,
      newElement,
      this.filePath,
      this
    );
    match.parentNode.replaceChild(newElement, match);
  }
}
