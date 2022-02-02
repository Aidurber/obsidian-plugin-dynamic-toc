import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import {
  BulletStyle,
  ExternalMarkdownKey,
  EXTERNAL_MARKDOWN_PREVIEW_STYLE,
} from "./types";
import DynamicTOCPlugin from "./main";

export class DynamicTOCSettingsTab extends PluginSettingTab {
  constructor(app: App, private plugin: DynamicTOCPlugin) {
    super(app, plugin);
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
          .addOptions({ bullet: "Bullet", number: "Number", inline: "Inline" })
          .setValue(this.plugin.settings.style)
          .onChange(async (val) => {
            this.plugin.settings.style = val as BulletStyle;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
      .setName("Enable varied style")
      .setDesc(
        "Varied style allows for the most top level heading to match your list style, then subsequent levels to be the opposite. For example if your list style is number, then your level 2 headings will be number, any levels lower then 2 will be bullet and vice versa."
      )
      .addToggle((cb) =>
        cb.setValue(this.plugin.settings.varied_style).onChange(async (val) => {
          this.plugin.settings.varied_style = val;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Delimiter")
      .setDesc(
        "Only used when list style is inline. The delimiter between the list items"
      )
      .addText((text) =>
        text
          .setPlaceholder("e.g. -, *, ~")
          .setValue(this.plugin.settings.delimiter)
          .onChange(async (val) => {
            this.plugin.settings.delimiter = val;
            this.plugin.saveSettings();
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
      .setName("Title")
      .setDesc(
        "The title of the table of contents, supports simple markdown such as ## Contents or **Contents**"
      )
      .addText((text) =>
        text
          .setPlaceholder("## Table of Contents")
          .setValue(this.plugin.settings.title)
          .onChange(async (val) => {
            this.plugin.settings.title = val;
            this.plugin.saveSettings();
          })
      );
    const externalRendererSetting = new Setting(containerEl)
      .setName("External rendering support")
      .setDesc(
        "Different markdown viewers provided Table of Contents support such as [TOC] or [[_TOC_]]. You may need to restart Obsidian for this to take effect."
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
          .setDisabled(this.plugin.settings.supportAllMatchers)
          .setValue(this.plugin.settings.externalStyle)
          .onChange(async (val: ExternalMarkdownKey) => {
            this.plugin.settings.externalStyle = val;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Support all external renderers")
      .setDesc("Cannot be used in conjunction with individual renderers")
      .addToggle((cb) =>
        cb
          .setValue(this.plugin.settings.supportAllMatchers)
          .onChange(async (val) => {
            this.plugin.settings.supportAllMatchers = val;
            externalRendererSetting.setDisabled(val);
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
      .setName("Allow inconsistent heading levels")
      .setDesc(
        "NOT RECOMMENDED (may be removed in future): If enabled, the table of contents will be generated even if the header depth is inconsistent. This may cause the table of contents to be rendered incorrectly."
      )
      .addToggle((cb) =>
        cb
          .setValue(this.plugin.settings.allow_inconsistent_headings)
          .onChange(async (val) => {
            this.plugin.settings.allow_inconsistent_headings = val;
            await this.plugin.saveSettings();
          })
      );
  }
}
