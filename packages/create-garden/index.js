#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { parseArgs, styleText } from "node:util";

const ENGINE_PACKAGE_NAME = "@figtive/garden-engine";

const TEMPLATE_FOLDER = "template";
const TEMPLATE_GITIGNORE_FILE = "_gitignore";
const PACKAGE_JSON_FILE = "package.json";
const WELCOME_POST_FILE = "content/writings/hello-world/index.md";

const FRONTMATTER_DATE_PATTERN = /^date: .*$/gm;

const COPY_IGNORE_LIST = ["node_modules", "dist"];

const USAGE_TEXT = "Usage: npm create @figtive/garden <folder>";

const HELP_TEXT = `
${USAGE_TEXT}

Create a new garden blog in <folder>.

Options:
  -h, --help    display this help message
`;

const HELP_HINT = `Run "npm create @figtive/garden -- --help" to see the options`;

const options = {
  help: {
    type: "boolean",
    short: "h",
  },
};

const NEXT_STEP_COMMANDS = {
  npm: {
    install: "npm install",
    dev: "npm run dev",
  },
  pnpm: {
    install: "pnpm install",
    dev: "pnpm dev",
  },
  yarn: {
    install: "yarn",
    dev: "yarn dev",
  },
  bun: {
    install: "bun install",
    dev: "bun run dev",
  },
};

function loadPackageJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function getPackageManagerName() {
  const userAgent = process.env.npm_config_user_agent ?? "";
  const packageManagerName = userAgent.split("/")[0];

  return packageManagerName in NEXT_STEP_COMMANDS ? packageManagerName : "npm";
}

function getTodayDate() {
  return new Date().toLocaleDateString("sv-SE");
}

function setWelcomePostDate(blogPath) {
  const welcomePostFile = join(blogPath, WELCOME_POST_FILE);

  if (!existsSync(welcomePostFile)) {
    return;
  }

  const welcomePostSource = readFileSync(welcomePostFile, "utf8");

  writeFileSync(
    welcomePostFile,
    welcomePostSource.replace(
      FRONTMATTER_DATE_PATTERN,
      `date: ${getTodayDate()}`,
    ),
  );
}

function createBlog(blogFolder) {
  const blogPath = resolve(blogFolder);

  if (existsSync(blogPath) && readdirSync(blogPath).length > 0) {
    throw new Error(`"${blogFolder}" already exists and is not empty`);
  }

  const templatePath = join(import.meta.dirname, TEMPLATE_FOLDER);

  cpSync(templatePath, blogPath, {
    recursive: true,
    filter: (copiedPath) => !COPY_IGNORE_LIST.includes(basename(copiedPath)),
  });

  renameSync(
    join(blogPath, TEMPLATE_GITIGNORE_FILE),
    join(blogPath, ".gitignore"),
  );

  setWelcomePostDate(blogPath);

  const createGardenPackageJson = loadPackageJson(
    join(import.meta.dirname, PACKAGE_JSON_FILE),
  );
  const blogPackageJsonFile = join(blogPath, PACKAGE_JSON_FILE);
  const blogPackageJson = loadPackageJson(blogPackageJsonFile);

  blogPackageJson.name = basename(blogPath);
  blogPackageJson.dependencies[ENGINE_PACKAGE_NAME] =
    createGardenPackageJson.devDependencies[ENGINE_PACKAGE_NAME];

  writeFileSync(
    blogPackageJsonFile,
    `${JSON.stringify(blogPackageJson, null, 2)}\n`,
  );

  const nextStepCommands = NEXT_STEP_COMMANDS[getPackageManagerName()];

  console.log(`
${styleText("green", `✔  Your garden is ready in ${blogFolder}/`)}

Next steps:
  ${styleText("cyan", `cd ${blogFolder}`)}
  ${styleText("cyan", nextStepCommands.install)}
  ${styleText("cyan", nextStepCommands.dev)}
`);
}

try {
  const { values, positionals } = parseArgs({
    options,
    allowPositionals: true,
  });

  const [blogFolder] = positionals;

  if (values.help) {
    console.log(HELP_TEXT);
  } else if (blogFolder === undefined) {
    throw new Error(`Missing <folder>. ${USAGE_TEXT}`);
  } else {
    createBlog(blogFolder);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const isArgsError =
    error instanceof Error &&
    "code" in error &&
    String(error.code).startsWith("ERR_PARSE_ARGS");

  console.error("");
  console.error(
    styleText("red", `✖  ${message}`, {
      stream: process.stderr,
    }),
  );
  if (isArgsError) {
    console.error(`   ${HELP_HINT}`);
  }
  console.error("");
  process.exitCode = 1;
}
