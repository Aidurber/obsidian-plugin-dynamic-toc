import {
  MarkdownPostProcessorContext,
  parseYaml,
  MarkdownRenderer,
  Plugin,
  TFile,
} from "obsidian";
import { SampleSettingTab } from "./SampleSettingTab";
import {
  convertHeadingsToNestedStructure,
  TableOptions,
} from "./utilities/headings";

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class DynamicTOCPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.registerMarkdownCodeBlockProcessor(
      "toc",
      this.codeblockProcessor.bind(this)
    );
  }
  tryParseOptions = (source: string): TableOptions => {
    const defaults: TableOptions = {
      style: "bullet",
    };
    try {
      const options = parseYaml(source) as TableOptions;
      return { ...defaults, ...options };
    } catch (error) {
      return defaults;
    }
  };
  codeblockProcessor(
    source: string,
    el: HTMLElement,
    _: MarkdownPostProcessorContext
  ) {
    const process = (file: TFile) => {
      try {
        el.innerHTML = "";
        const options = this.tryParseOptions(source);
        const fileCache = this.app.metadataCache.getFileCache(file);
        const headings = fileCache.headings;
        const acceptableHeadings = headings.filter((h) => h.level !== 1);
        const renderedHeadings = convertHeadingsToNestedStructure(
          acceptableHeadings,
          options
        );
        MarkdownRenderer.renderMarkdown(renderedHeadings, el, file.path, this);
      } catch (error) {
        console.error(error);
      }
    };
    process(this.app.workspace.getActiveFile());
    this.app.metadataCache.on("changed", process.bind(this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
