import { existsSync } from "node:fs";
import { parseArgs } from "node:util";
import { build } from "../build.ts";

const HELP_TEXT = `Usage: garden <command> [options]

Commands:
  build    Build the site into dist/
  help     List supported commands and options

Options:
  --content <folder>    Process markdown files from this folder instead of the config's 
                        (default: 'content' in garden.config.ts)
                        
  -h, --help           Same as 'garden help' `;

const HELP_HINT = `Run "garden help" to see the commands`;

const options = {
  content: {
    type: "string",
  },
  help: {
    type: "boolean",
    short: "h",
  },
} as const;

try {
  const { values, positionals } = parseArgs({
    options,
    allowPositionals: true,
  });

  const [command] = positionals;

  if (values.help || command === undefined || command === "help") {
    console.log(HELP_TEXT);
  } else {
    if (existsSync(".env")) {
      process.loadEnvFile(".env");
    }

    switch (command) {
      case "build": {
        if (values.content !== undefined && !existsSync(values.content)) {
          throw new Error(`Content folder "${values.content}" not found`);
        }

        await build({
          contentPath: values.content,
        });
        break;
      }
      default:
        throw new Error(`"${command}" is not a valid command. ${HELP_HINT}`);
    }
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const isArgsError =
    error instanceof Error &&
    "code" in error &&
    String(error.code).startsWith("ERR_PARSE_ARGS");

  console.error(`✖  ${message}`);
  if (isArgsError) {
    console.error(`   ${HELP_HINT}`);
  }
  process.exitCode = 1;
}
