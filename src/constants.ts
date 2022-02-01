import {
  DynamicTOCSettings,
  ExternalMarkdownKey,
  EXTERNAL_MARKDOWN_PREVIEW_STYLE,
} from "./types";

export const DEFAULT_SETTINGS: DynamicTOCSettings = {
  style: "bullet",
  min_depth: 2,
  max_depth: 6,
  externalStyle: "None",
  supportAllMatchers: false,
  allow_inconsistent_headings: false,
};

export const TABLE_CLASS_NAME = "dynamic-toc";
export const TABLE_CLASS_SELECTOR = `.${TABLE_CLASS_NAME}`;

export const ALL_MATCHERS = Object.keys(
  EXTERNAL_MARKDOWN_PREVIEW_STYLE
) as ExternalMarkdownKey[];
