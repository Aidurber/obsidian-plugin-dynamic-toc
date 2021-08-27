const stringifyPackage = require("stringify-package");
const detectIndent = require("detect-indent");
const detectNewline = require("detect-newline");

module.exports.readVersion = function (contents) {
  const data = JSON.parse(contents);
  return data.version;
};

module.exports.writeVersion = function (contents, version) {
  const json = JSON.parse(contents);
  let indent = detectIndent(contents).indent;
  let newline = detectNewline(contents);
  json.version = version;
  return stringifyPackage(json, indent, newline);
};
