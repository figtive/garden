import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { type ComponentType, createElement } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import type { LayoutProps, PostFile } from "../types.ts";

async function postRenderer(
  component: ComponentType<LayoutProps>,
  props: LayoutProps,
  postFile: PostFile,
) {
  const { prelude } = await prerenderToNodeStream(
    createElement(component, props),
  );

  const outDir = join("dist", postFile.folder, postFile.slug);
  await mkdir(outDir, { recursive: true });
  const out = fs.createWriteStream(join(outDir, "index.html"));
  out.write("<!doctype html>");
  await pipeline(prelude, out);
}

export default postRenderer;
