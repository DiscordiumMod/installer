const { existsSync } = require("fs");
const { readdir } = require("fs/promises");
const { join, resolve } = require("path");

module.exports = async function getAppPath(discordVersion) {
  const discordPath = resolve(process.env.LOCALAPPDATA, discordVersion);
  if (!existsSync(discordPath)) {
    return Promise.reject(new Error("Invalid Discord Version."));
  }
  const discordDir = await readdir(discordPath).catch((_) => {
    return Promise.reject(new Error(`Failed to read "${discordPath}"`));
  });
  const currentBuild = discordDir
    .filter((path) => path.startsWith("app-"))
    .reverse()[0];
  const appPath = join(discordPath, currentBuild, "resources", "app");
  return appPath;
};
