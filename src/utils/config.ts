import { parseYaml } from "obsidian";
import { DynamicTOCSettings, TableOptions } from "../types";
/**
 * Merge settings and codeblock options taking truthy values
 * @param options - Code block options
 * @param settings - Plugin settings
 * @returns
 */
export function mergeSettings(
  options: TableOptions,
  settings: DynamicTOCSettings
): TableOptions {
  const merged = Object.assign({}, settings, options);
  return Object.keys(merged).reduce((acc, curr: keyof TableOptions) => {
    const value = options[curr];
    const isEmptyValue = typeof value === "undefined" || value === null;
    return {
      ...acc,
      [curr]: isEmptyValue ? settings[curr] : value,
    };
  }, {} as TableOptions);
}
/**
 * Parse the YAML source and merge it with plugin settings
 * @param source - Code block YAML source
 * @param settings - Plugin settings
 * @returns
 */
export function parseConfig(
  source: string,
  settings: DynamicTOCSettings
): TableOptions {
  try {
    const options = parseYaml(source) as TableOptions;
    return mergeSettings(options, settings);
  } catch (error) {
    return settings;
  }
}
