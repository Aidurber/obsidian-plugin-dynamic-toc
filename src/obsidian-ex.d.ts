import "obsidian";

declare module "obsidian" {
  interface TFile {
    deleted: boolean;
  }
}
