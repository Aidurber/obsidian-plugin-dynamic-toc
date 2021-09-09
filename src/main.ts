import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { parseConfig } from "./utils/config";
import { DEFAULT_SETTINGS } from "./constants";
import { ContentsRenderer } from "./renderers/contents-renderer";
import { DynamicTOCSettingsTab } from "./settings-tab";
import { DynamicTOCSettings } from "./types";
import { DynamicInjectionRenderer } from "./renderers/dynamic-injection-renderer";

export default class DynamicTOCPlugin extends Plugin {
  settings: DynamicTOCSettings;
  onload = async () => {
    await this.loadSettings();
    console.log("Dynamic TOC Loaded");
    this.addSettingTab(new DynamicTOCSettingsTab(this.app, this));

    this.registerMarkdownCodeBlockProcessor(
      "toc",
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        const options = parseConfig(source, this.settings);
        ctx.addChild(
          new ContentsRenderer(this.app, options, ctx.sourcePath, el)
        );
      }
    );
    this.registerMarkdownPostProcessor(
      (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        try {
          ctx.addChild(
            new DynamicInjectionRenderer(
              this.app,
              this.settings,
              ctx.sourcePath,
              el
            )
          );
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  loadSettings = async () => {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  };

  saveSettings = async () => {
    await this.saveData(this.settings);
    this.app.metadataCache.trigger("dynamic-toc:settings", this.settings);
  };
}
