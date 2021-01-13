const chalk = require("chalk");
const ora = require("ora");
const { existsSync } = require("fs");
const { rmdir } = require("fs/promises");
const { join } = require("path");
const getAppPath = require("./util/getAppPath");

module.exports = async function unpatch({ discordVersion }) {
  try {
    const spinner = ora({
      prefixText: chalk.blueBright("[Discordium:installer:unpatch]"),
    });
    spinner.start(`Unpatching Discordium from ${discordVersion}...`);
    const appPath = await getAppPath(discordVersion);
    if (!existsSync(appPath)) {
      return spinner.fail("Your discord is not patched with Discordium.");
    }
    if (!existsSync(join(appPath, ".discordium"))) {
      return spinner.fail(
        "Your discord is patched with something other than Discordium."
      );
    }
    await rmdir(appPath, { recursive: true }).catch((_) => {
      throw spinner.fail(
        `Unable to delete the following directory: "${appPath}"`
      );
    });
    spinner.succeed(
      `Successfully unpatched Discordium from ${discordVersion}!`
    );
  } catch (_) {
    return;
  }
};
