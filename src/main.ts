import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { parseConfig } from "./utils/config";
import { DEFAULT_SETTINGS } from "./constants";
import { ContentsRenderer } from "./renderers/contents-renderer";
import { DynamicTOCSettingsTab } from "./settings-tab";
import { DynamicTOCSettings } from "./types";

export default class DynamicTOCPlugin extends Plugin {
  settings: DynamicTOCSettings;
  onload = async () => {
    await this.loadSettings();

    this.addSettingTab(new DynamicTOCSettingsTab(this.app, this));
    // this.dynamicPostProcessor = new DynamicInjectionPostProcessor(
    //   this.headingExtractor,
    //   this.app,
    //   this.settings
    // );

    this.registerMarkdownCodeBlockProcessor(
      "toc",
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        const options = parseConfig(source, this.settings);
        ctx.addChild(
          new ContentsRenderer(this.app, options, ctx.sourcePath, el)
        );
      }
    );

    // this.registerMarkdownPostProcessor(this.dynamicPostProcessor.process);
  };

  loadSettings = async () => {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  };

  saveSettings = async () => {
    await this.saveData(this.settings);
    this.app.metadataCache.trigger("dynamic-toc:settings", this.settings);
  };
}
