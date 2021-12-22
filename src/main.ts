import { Editor, MarkdownPostProcessorContext, Plugin } from "obsidian";
import { parseConfig } from "./utils/config";
import { ALL_MATCHERS, DEFAULT_SETTINGS } from "./constants";
import { CodeBlockRenderer } from "./renderers/code-block-renderer";
import { DynamicTOCSettingsTab } from "./settings-tab";
import {
  DynamicTOCSettings,
  ExternalMarkdownKey,
  EXTERNAL_MARKDOWN_PREVIEW_STYLE,
} from "./types";
import { DynamicInjectionRenderer } from "./renderers/dynamic-injection-renderer";
import { InsertCommandModal } from "./insert-command.modal";

export default class DynamicTOCPlugin extends Plugin {
  settings: DynamicTOCSettings;
  onload = async () => {
    await this.loadSettings();
    this.addSettingTab(new DynamicTOCSettingsTab(this.app, this));
    this.addCommand({
      id: "dynamic-toc-insert-command",
      name: "Insert Table of Contents",
      editorCallback: (editor: Editor) => {
        const modal = new InsertCommandModal(this.app, this);
        modal.start((text: string) => {
          editor.setCursor(editor.getCursor().line, 0);
          editor.replaceSelection(text);
        });
      },
    });
    this.registerMarkdownCodeBlockProcessor(
      "toc",
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        const options = parseConfig(source, this.settings);
        ctx.addChild(
          new CodeBlockRenderer(this.app, options, ctx.sourcePath, el)
        );
      }
    );

    this.registerMarkdownPostProcessor(
      (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        const matchers =
          this.settings.supportAllMatchers === true
            ? ALL_MATCHERS
            : [this.settings.externalStyle];
        for (let matcher of matchers as ExternalMarkdownKey[]) {
          if (!matcher || matcher === "None") continue;
          const match = DynamicInjectionRenderer.findMatch(
            el,
            EXTERNAL_MARKDOWN_PREVIEW_STYLE[matcher as ExternalMarkdownKey]
          );
          if (!match?.parentNode) continue;
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
