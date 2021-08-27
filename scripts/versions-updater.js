const stringifyPackage = require("stringify-package");
const detectIndent = require("detect-indent");
const detectNewline = require("detect-newline");

module.exports.readVersion = function (contents) {
  const data = JSON.parse(contents);
  const keys = Object.keys(data);
  return keys[keys.length - 1];
};

module.exports.writeVersion = function (contents, version) {
  const json = JSON.parse(contents);
  let indent = detectIndent(contents).indent;
  let newline = detectNewline(contents);
  const values = Object.values(json);
  json[version] = values[values.length - 1];

  const result = stringifyPackage(json, indent, newline);

  return result;
};
