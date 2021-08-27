const versionUpdater = {
  filename: "versions.json",
  updater: require("./scripts/versions-updater"),
};
const manifestUpdater = {
  filename: "manifest.json",
  updater: require("./scripts/manifest-updater"),
};

const packageJson = {
  filename: "package.json",
  // The `json` updater assumes the version is available under a `version` key in the provided JSON document.
  type: "json",
};
module.exports = {
  bumpFiles: [packageJson, versionUpdater, manifestUpdater],
  packageFiles: [packageJson],
};
