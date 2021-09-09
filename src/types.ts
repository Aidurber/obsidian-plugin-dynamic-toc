import { TFile } from "obsidian";

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
export interface ExtendedTFile extends TFile {
  deleted: boolean;
}
