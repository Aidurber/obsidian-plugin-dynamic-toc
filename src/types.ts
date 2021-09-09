import "obsidian";

declare module "obsidian" {
  interface MetadataCache {
    trigger(
      name: "dynamic-toc:settings",
      settings: DynamicTOCSettings
    ): EventRef;
    on(
      name: "dynamic-toc:settings",
      callback: (api: DynamicTOCSettings) => any,
      ctx?: any
    ): EventRef;
  }
  interface TFile {
    deleted: boolean;
  }
}

export type BulletStyle = "bullet" | "number";
export interface TableOptions {
  style: BulletStyle;
  min_depth: number;
  max_depth: number;
}

export const EXTERNAL_MARKDOWN_PREVIEW_STYLE = {
  None: "",
  TOC: "[TOC]",
  _TOC_: "__TOC__",
};
export interface DynamicTOCSettings extends TableOptions {
  externalStyle: string;
}
