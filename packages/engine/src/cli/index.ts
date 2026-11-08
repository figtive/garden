import { existsSync } from "node:fs";
import { parseArgs } from "node:util";
import { build } from "../build.ts";

const options = {
  content: {
    type: "string",
  },
} as const;

try {
  const { values, positionals } = parseArgs({
    options,
    allowPositionals: true,
  });

  if (existsSync(".env")) {
    process.loadEnvFile(".env");
  }

  const [command] = positionals;

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
      if (command === undefined) {
        throw new Error("Usage: garden build [--content <folder>]");
      }
      throw new Error(`"${command}" is not a valid command`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`✖  ${message}`);
  process.exitCode = 1;
}
