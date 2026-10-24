import { readFile } from "node:fs/promises";
import { splitFrontmatter } from "../src/content/frontmatter/splitFrontmatter.ts";
import { tokenizeMarkdown } from "../src/markdown/tokenize/index.ts";

const file = process.argv[2] ?? new URL("./embeds.md", import.meta.url);

const source = await readFile(file, "utf-8");
const { body } = splitFrontmatter(source, String(file));

console.dir(tokenizeMarkdown(body, new Set()), { depth: null });
