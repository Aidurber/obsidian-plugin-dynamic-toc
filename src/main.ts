import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { parseConfig } from "./utils/config";
import { DEFAULT_SETTINGS } from "./constants";
import { ContentsRenderer } from "./renderers/contents-renderer";
import { DynamicTOCSettingsTab } from "./settings-tab";
import { DynamicTOCSettings, EXTERNAL_MARKDOWN_PREVIEW_STYLE } from "./types";
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
          match = DynamicInjectionRenderer.findMatch(el, matcher);
        } catch (error) {
          console.error(error);
        }

        if (match?.parentNode) {
          ctx.addChild(
            new DynamicInjectionRenderer(
              this.app,
              this.settings,
              ctx.sourcePath,
              el,
              match
            )
          );
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
