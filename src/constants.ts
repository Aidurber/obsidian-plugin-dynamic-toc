import { DynamicTOCSettings } from "./types";

export const DEFAULT_SETTINGS: DynamicTOCSettings = {
  style: "bullet",
  min_depth: 2,
  max_depth: 6,
  externalStyle: "",
};

export const TABLE_CLASS_NAME = "dynamic-toc";
export const TABLE_CLASS_SELECTOR = `.${TABLE_CLASS_NAME}`;
