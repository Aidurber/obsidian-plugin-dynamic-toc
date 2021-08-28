import {
  App,
  MarkdownPostProcessorContext,
  Plugin,
  PluginSettingTab,
  Setting,
  Notice,
} from "obsidian";
import { DEFAULT_SETTINGS } from "./constants";
import { ContentsTableRenderer } from "./ContentsTableRenderer";
import { BulletStyle, DynamicTOCSettings } from "./types";

export default class DynamicTOCPlugin extends Plugin {
  private renderer: ContentsTableRenderer | null = null;
  settings: DynamicTOCSettings;
  onload = async () => {
    await this.loadSettings();
    this.addSettingTab(new DynamicTOCSettingsTab(this.app, this));

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
    this.renderer = new ContentsTableRenderer(
      this.app,
      source,
      element,
      this,
      this.settings
    );
    this.renderer.build(this.app.workspace.getActiveFile());
    this.app.metadataCache.on("changed", this.renderer.build);
  }

  rerenderToC = () => {
    if (!this.renderer) return;
    this.renderer.build(this.app.workspace.getActiveFile());
  };
  loadSettings = async () => {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  };

  saveSettings = async () => {
    await this.saveData(this.settings);
  };
}

class DynamicTOCSettingsTab extends PluginSettingTab {
  private readonly plugin: DynamicTOCPlugin;

  constructor(app: App, plugin: DynamicTOCPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Dynamic Table of Contents Settings" });
    new Setting(containerEl)
      .setName("List Style")
      .setDesc("The table indication")
      .addDropdown((cb) =>
        cb
          .addOptions({ bullet: "Bullet", number: "Number" })
          .setValue(this.plugin.settings.style)
          .onChange(async (val) => {
            this.plugin.settings.style = val as BulletStyle;
            await this.plugin.saveData(this.plugin.settings);
            this.plugin.rerenderToC();
          })
      );
    new Setting(containerEl)
      .setName("Minimum Header Depth")
      .setDesc("The default minimum header depth to render")
      .addSlider((slider) =>
        slider
          .setLimits(1, 6, 1)
          .setValue(this.plugin.settings.min_depth)
          .setDynamicTooltip()
          .onChange(async (val) => {
            if (val > this.plugin.settings.max_depth) {
              new Notice("Min Depth is higher than Max Depth");
            } else {
              this.plugin.settings.min_depth = val;
              await this.plugin.saveData(this.plugin.settings);
              this.plugin.rerenderToC();
            }
          })
      );
    new Setting(containerEl)
      .setName("Maximum Header Depth")
      .setDesc("The default maximum header depth to render")
      .addSlider((slider) =>
        slider
          .setLimits(1, 6, 1)
          .setValue(this.plugin.settings.max_depth)
          .setDynamicTooltip()
          .onChange(async (val) => {
            if (val < this.plugin.settings.min_depth) {
              new Notice("Max Depth is higher than Min Depth");
            } else {
              this.plugin.settings.max_depth = val;
              await this.plugin.saveData(this.plugin.settings);
              this.plugin.rerenderToC();
            }
          })
      );
  }
}
