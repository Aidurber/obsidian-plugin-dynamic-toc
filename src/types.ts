import { TFile } from "obsidian";

export type BulletStyle = "bullet" | "number";
export interface TableOptions {
  style: BulletStyle;
  min_depth: number;
  max_depth: number;
}

export interface DynamicTOCSettings extends TableOptions {
  injectionString?: string;
}
export interface ExtendedTFile extends TFile {
  deleted: boolean;
}
