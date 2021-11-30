import { App, FuzzySuggestModal } from "obsidian";
import DynamicTOCPlugin from "./main";
import { ExternalMarkdownKey } from "./types";

type OptionsCollection = Record<
  Exclude<ExternalMarkdownKey, "None"> & "code-block",
  {
    label: string;
    value: string;
  }
>;

// TODO refactor to use this as external matchers value so we have a single source of truth
const options: OptionsCollection = {
  "code-block": { value: `\`\`\`toc\n\`\`\``, label: "Code block" },
  TOC: { value: "[TOC]", label: "[TOC]" },
  _TOC_: { label: "__TOC__", value: "[[__TOC__]]" },
  AzureWiki: { label: "_TOC_", value: "[[_TOC_]]" },
  DevonThink: { label: "{{toc}}", value: "{{toc}}" },
  TheBrain: { label: "[/toc/]", value: "[/toc/]" },
};
export class InsertCommandModal extends FuzzySuggestModal<string> {
  private plugin: DynamicTOCPlugin;
  callback: (item: string) => void;
  constructor(app: App, plugin: DynamicTOCPlugin) {
    super(app);
    this.app = app;
    this.plugin = plugin;
    this.setPlaceholder("Type name of table of contents type...");
  }
  getItems(): string[] {
    if (this.plugin.settings.supportAllMatchers) {
      return Object.keys(options);
    }
    if (this.plugin.settings.externalStyle !== "None") {
      return ["code-block", this.plugin.settings.externalStyle];
    }
    return ["code-block"];
  }
  getItemText(id: string): string {
    const foundKey = Object.keys(options).find((v) => v === id);
    return options[foundKey].label;
  }
  onChooseItem(item: string): void {
    this.callback(options[item].value);
  }
  public start(callback: (item: string) => void): void {
    this.callback = callback;
    this.open();
  }
}
