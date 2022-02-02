export type BulletStyle = "bullet" | "number" | "inline";
export interface TableOptions {
  style: BulletStyle;
  min_depth: number;
  max_depth: number;
  title?: string;
  allow_inconsistent_headings: boolean;
  delimiter?: string;
  varied_style?: boolean;
}

export const EXTERNAL_MARKDOWN_PREVIEW_STYLE = {
  None: "",
  TOC: "[TOC]",
  _TOC_: "__TOC__",
  AzureWiki: "_TOC_",
  DevonThink: "{{toc}}",
  TheBrain: "[/toc/]",
};

export type ExternalMarkdownKey = keyof typeof EXTERNAL_MARKDOWN_PREVIEW_STYLE;
export interface DynamicTOCSettings extends TableOptions {
  externalStyle: ExternalMarkdownKey;
  supportAllMatchers: boolean;
}
