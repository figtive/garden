import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { posix } from "node:path";
import { globby } from "globby";
import { TAGS_FOLDER } from "../config/constants.ts";
import type { CodeHighlighter } from "../markdown/highlight/createCodeHighlighter.ts";
import type { Config, Post, TagInfo } from "../types/index.ts";
import { fail } from "../utils/fail.ts";
import { compileMarkdownContent } from "./compileMarkdownContent.ts";
import { parseFrontmatter } from "./frontmatter/parseFrontmatter.ts";
import { splitFrontmatter } from "./frontmatter/splitFrontmatter.ts";

async function loadTagInfo(
  relativePath: string,
  tagsDirectory: string,
  config: Config,
  highlighter: CodeHighlighter,
): Promise<TagInfo> {
  const file = posix.join(tagsDirectory, relativePath);
  const name = relativePath.slice(0, -".md".length);

  const source = await readFile(file, "utf-8");
  const { frontmatter, body, bodyLineOffset } = splitFrontmatter(source, file);
  const { description } = parseFrontmatter(frontmatter);

  if (description !== undefined && typeof description !== "string") {
    fail({ file }, `"description" must be text`);
  }

  const content = await compileMarkdownContent(body, {
    file,
    url: `/tags/${name}/`,
    lineOffset: bodyLineOffset,
    config,
    highlighter,
  });

  return {
    name,
    file,
    description,
    content,
  };
}

export async function loadTagInfos(
  config: Config,
  highlighter: CodeHighlighter,
): Promise<Map<string, TagInfo>> {
  const tagsDirectory = posix.join(config.content, TAGS_FOLDER);

  if (!existsSync(tagsDirectory)) {
    return new Map();
  }

  const files = await globby("**/*.md", {
    cwd: tagsDirectory,
  });

  const tagInfos = await Promise.all(
    files.map((file) => loadTagInfo(file, tagsDirectory, config, highlighter)),
  );

  return new Map(tagInfos.map((tagInfo) => [tagInfo.name, tagInfo] as const));
}

export function checkTagInfosAreUsed(
  tagInfos: Map<string, TagInfo>,
  posts: Post[],
) {
  const usedTags = new Set(posts.flatMap((post) => post.meta.tags ?? []));

  for (const { name, file } of tagInfos.values()) {
    if (!usedTags.has(name)) {
      fail({ file }, `no post uses the tag "${name}"`);
    }
  }
}
