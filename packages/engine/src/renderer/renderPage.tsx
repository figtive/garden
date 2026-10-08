import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { type ComponentType, createElement } from "react";
import { prerenderToNodeStream } from "react-dom/static";

export async function renderPage<Props extends object>(
  component: ComponentType<Props>,
  props: Props,
  url: string,
) {
  const { prelude } = await prerenderToNodeStream(
    createElement(component, props),
  );

  const outDir = join("dist", url);
  await mkdir(outDir, { recursive: true });
  await pipeline(prelude, fs.createWriteStream(join(outDir, "index.html")));
}
