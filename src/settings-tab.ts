import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import { BulletStyle } from "./types";
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
      .setName("Custom injection value")
      .setDesc(
        "A raw text to find which will act as the indicator that you want to render a table of contents."
      )
      .addText((text) =>
        text
          .setValue(this.plugin.settings.injectionString)
          .onChange(async (val) => {
            this.plugin.settings.injectionString = val;
            await this.plugin.saveSettings();
          })
      );
  }
}
