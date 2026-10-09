import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { EmittedFile } from "../plugins/definePlugin.ts";

export async function writeEmittedFile(file: EmittedFile) {
  const out = join("dist", file.path);
  await mkdir(dirname(out), { recursive: true });
  if ("content" in file) {
    await writeFile(out, file.content);
  } else {
    await copyFile(file.from, out);
  }
}
