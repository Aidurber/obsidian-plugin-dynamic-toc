import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import { BulletStyle, EXTERNAL_MARKDOWN_PREVIEW_STYLE } from "./types";
import DynamicTOCPlugin from "./main";

export class DynamicTOCSettingsTab extends PluginSettingTab {
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
            await this.plugin.saveSettings();
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
              await this.plugin.saveSettings();
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
              await this.plugin.saveSettings();
            }
          })
      );
    new Setting(containerEl)
      .setName("External rendering support")
      .setDesc(
        "Different markdown viewers provided Table of Contents support such as [TOC] or [[TOC]]"
      )
      .addDropdown((cb) =>
        cb
          .addOptions(
            Object.keys(EXTERNAL_MARKDOWN_PREVIEW_STYLE).reduce(
              (acc, curr: keyof typeof EXTERNAL_MARKDOWN_PREVIEW_STYLE) => {
                const value = EXTERNAL_MARKDOWN_PREVIEW_STYLE[curr];
                return { ...acc, [curr]: value };
              },
              {} as Record<string, string>
            )
          )
          .setValue(this.plugin.settings.externalStyle)
          .onChange(async (val: string) => {
            this.plugin.settings.externalStyle = val;
            await this.plugin.saveSettings();
          })
      );
  }
}
