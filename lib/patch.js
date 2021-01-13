const chalk = require("chalk");
const ora = require("ora");
const { existsSync } = require("fs");
const { mkdir, writeFile } = require("fs/promises");
const { join, sep, resolve } = require("path");
const getAppPath = require("./util/getAppPath");

module.exports = async function patch({ discordVersion }) {
  try {
    const spinner = ora({
      prefixText: chalk.blueBright("[Discordium:installer:patch]"),
    });
    spinner.start(`Patching ${discordVersion} with Discordium...`);
    const appPath = await getAppPath(discordVersion).catch((err) => {
      throw spinner.fail(err.stack);
    });
    if (existsSync(appPath)) {
      if (!existsSync(join(appPath, ".discordium"))) {
        return spinner.fail(
          "Your discord has been patched with someting other than Discordium."
        );
      }
      return spinner.warn(
        "Your discord has already been patched with Discordium."
      );
    } else {
      await mkdir(appPath, { recursive: true }).catch((_) => {
        throw spinner.fail(
          `Unable to make the following directory: "${appPath}"`
        );
      });
      await Promise.all([
        writeFile(
          join(appPath, "index.js"),
          `require(\`${resolve(__dirname, "../../bootstrap.js").replace(
            RegExp(sep.repeat(2), "g"),
            "/"
          )}\`)`
        ),
        writeFile(
          join(appPath, "package.json"),
          JSON.stringify(
            {
              main: "index.js",
            },
            null,
            2
          )
        ),
        writeFile(join(appPath, ".discordium"), ""),
      ]);
      spinner.succeed(
        `Successfully patched ${discordVersion} with Discordium!`
      );
    }
  } catch (_) {
    return;
  }
};
