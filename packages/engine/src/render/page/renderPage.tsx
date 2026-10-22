import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import type { ReactElement } from "react";
import { prerenderToNodeStream } from "react-dom/static";

export async function renderPage(element: ReactElement, url: string) {
  const { prelude } = await prerenderToNodeStream(element);

  const outDir = join("dist", url);
  await mkdir(outDir, { recursive: true });
  await pipeline(prelude, fs.createWriteStream(join(outDir, "index.html")));
}
