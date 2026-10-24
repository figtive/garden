import { existsSync } from "node:fs";
import { posix } from "node:path";
import type {
  Block,
  Embed,
  EmbedSource,
  Inline,
  PostAsset,
} from "../types/index.ts";
import { fail } from "../utils/fail.ts";

type Token = Block | Inline;

type EmbedToken = Extract<Token, { type: "block:embed" | "inline:embed" }>;

type ResolveOptions = {
  postFile: string;
  postUrl: string;
  lineOffset: number;
  attachments: string;
  embeds: Record<string, Embed>;
};

function isExternalSource(src: string) {
  return /^([a-z][a-z\d+.-]*:|\/)/i.test(src);
}

function getExtension(src: string) {
  const path = src.split("?")[0] ?? "";

  return posix.extname(path).slice(1).toLowerCase();
}

function findKind(src: string, embeds: Record<string, Embed>): string | null {
  const extension = getExtension(src);

  for (const [kind, embed] of Object.entries(embeds)) {
    if (embed.extensions.includes(extension)) {
      return kind;
    }
  }

  return null;
}

function findAsset(name: string, options: ResolveOptions): PostAsset | null {
  if (name.split("/").includes("..")) {
    return null;
  }

  const postDir = posix.dirname(options.postFile);
  const nextToPost = posix.join(postDir, name);

  if (existsSync(nextToPost)) {
    return { from: nextToPost, to: `${options.postUrl.slice(1)}${name}` };
  }

  const inAttachments = posix.join(options.attachments, name);

  if (existsSync(inAttachments)) {
    return { from: inAttachments, to: `attachments/${name}` };
  }

  return null;
}

function childrenOf(token: Token): Token[] {
  switch (token.type) {
    case "block:heading":
    case "block:paragraph":
    case "block:quote":
    case "block:alert":
    case "inline:strong":
    case "inline:emphasis":
    case "inline:strike":
    case "inline:link":
      return token.children;
    case "block:list":
      return token.items.flatMap((item) => item.children);
    case "block:table":
      return [...token.head.flat(), ...token.rows.flat(2)];
    default:
      return [];
  }
}

function collectEmbeds(tokens: Token[]): EmbedToken[] {
  const embeds: EmbedToken[] = [];

  for (const token of tokens) {
    if (token.type === "block:embed" || token.type === "inline:embed") {
      embeds.push(token);
      continue;
    }

    embeds.push(...collectEmbeds(childrenOf(token)));
  }

  return embeds;
}

function resolveSource(
  source: EmbedSource,
  line: number,
  options: ResolveOptions,
): PostAsset | null {
  const location = {
    file: options.postFile,
    line: line + options.lineOffset,
  };

  const isExternal = isExternalSource(source.src);
  const kind =
    findKind(source.src, options.embeds) ?? (isExternal ? "image" : null);

  if (!kind) {
    fail(location, `no embed registered for "${source.src}"`);
  }

  source.kind = kind;

  if (isExternal) {
    return null;
  }

  const asset = findAsset(decodeURI(source.src), options);

  if (!asset) {
    fail(location, `embed "${source.src}" not found`);
  }

  source.src = encodeURI(`/${asset.to}`);

  return asset;
}

export function resolveEmbeds(
  tokens: Block[],
  options: ResolveOptions,
): PostAsset[] {
  const assets: PostAsset[] = [];

  for (const token of collectEmbeds(tokens)) {
    const asset = resolveSource(token.source, token.line, options);

    if (asset) {
      assets.push(asset);
    }
  }

  return assets;
}
