import {
  App,
  MarkdownPostProcessorContext,
  Plugin,
  PluginSettingTab,
  Setting,
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
    console.log(this.settings);
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
  loadSettings = async () => {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    console.log({ DEFAULT_SETTINGS, settings: this.settings });
  };

  saveSettings = async () => {
    await this.saveData(this.settings);
    console.log("Save settings", this.settings);
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

    console.log("Before render settings", this.plugin.settings);
    new Setting(containerEl)
      .setName("List Style")
      .setDesc("The table indication")
      .addDropdown((cb) => {
        cb.setValue(this.plugin.settings.style);
        cb.addOptions({ bullet: "Bullet", number: "Number" });
        cb.onChange((val) => {
          console.log(val);
          this.plugin.settings.style = val as BulletStyle;
          this.plugin.saveData(this.plugin.settings);
          console.log("Saving settings");
        });
      });

    // Just testing to see if toggle sets value correctly
    new Setting(containerEl)
      .setName("Use numeric indicators")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.style === "number")
          .onChange(async (val) => {
            console.log(val);
            this.plugin.settings.style = val === true ? "number" : "bullet";
            this.plugin.saveData(this.plugin.settings);
          })
      );
  }
}
