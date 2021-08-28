import { App, MarkdownPostProcessorContext, MarkdownRenderer } from "obsidian";
import { IHeadingExtractor } from "./HeadingExtractor";
import { DynamicTOCSettings } from "./types";
export class DynamicInjectionPostProcessor {
  constructor(
    protected headingExtractor: IHeadingExtractor,
    protected app: App,
    protected settings: DynamicTOCSettings
  ) {}
  process = async (
    el: HTMLElement,
    _: MarkdownPostProcessorContext
  ): Promise<any> => {
    if (!this.settings.injectionString?.length) return;
    let match: HTMLElement | null = null;
    try {
      const result = document.evaluate(
        `//*[text()[contains(.,'${this.settings.injectionString}')]]`,
        el
      );
      const firstResult = result.iterateNext();
      match = firstResult as HTMLElement;
    } catch (error) {
      console.error(error);
    }

    if (!match) return;
    const file = this.app.workspace.getActiveFile();
    const headings = this.headingExtractor.extract(file, this.settings);
    const newElement = document.createElement("div");
    newElement.classList.add("table-of-contents");

    await MarkdownRenderer.renderMarkdown(
      headings,
      newElement,
      file.path,
      undefined
    );
    match.parentNode.replaceChild(newElement, match);
  };
}
