import { App, MarkdownRenderChild, MarkdownRenderer, TFile } from "obsidian";
import { TABLE_CLASS_NAME, TABLE_CLASS_SELECTOR } from "src/constants";
import { createTimer } from "src/utils/timer";
import { DynamicTOCSettings, EXTERNAL_MARKDOWN_PREVIEW_STYLE } from "../types";
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
    this.render();
    this.app.metadataCache.on("changed", this.onFileChangeHandler);
    this.app.metadataCache.on(
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
  onFileChangeHandler = (file: TFile) => {
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
    const timer = createTimer("dynamic injection renderer");
    timer.start();
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
    newElement.classList.add(TABLE_CLASS_NAME);
    await MarkdownRenderer.renderMarkdown(
      headings,
      newElement,
      this.filePath,
      this
    );
    // Keep the match in the document as a hook but hide it
    match.style.display = "none";
    const existing = this.containerEl.querySelector(TABLE_CLASS_SELECTOR);
    // We need to keep cleaning up after ourselves on settings or file changes
    if (existing) {
      this.containerEl.removeChild(existing);
    }
    // Attach the table to the parent of the match
    match.parentNode.appendChild(newElement);
    timer.stop();
  }
}
