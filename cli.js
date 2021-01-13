#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const cli = yargs(hideBin(process.argv));

cli
  .command(
    "patch [discordVersion]",
    "Patches Discordium into Discord.",
    (argv) => {
      argv.positional("discordVersion", {
        describe: "Discord version to patch.",
        default: "DiscordCanary",
      });
    },
    (args) => {
      const patch = require("./lib/patch");
      patch(args);
    }
  )
  .command(
    "unpatch [discordVersion]",
    "Unpatches Discordium into Discord.",
    (argv) => {
      argv.positional("discordVersion", {
        describe: "Discord version to unpatch.",
        default: "canary",
      });
    },
    (args) => {
      const unpatch = require("./lib/unpatch");
      unpatch(args);
    }
  ).argv;
