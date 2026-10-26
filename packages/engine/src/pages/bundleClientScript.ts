import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { build } from "esbuild";

const entry = (file: string) => `
import run from ${JSON.stringify(file)};
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => run());
} else {
  run();
}
`;

export async function bundle(file: string) {
  const result = await build({
    stdin: { contents: entry(file), resolveDir: dirname(file), loader: "js" },
    bundle: true,
    format: "esm",
    minify: true,
    write: false,
  });

  const [output] = result.outputFiles;
  if (!output) {
    throw new Error(`esbuild produced no output for ${file}`);
  }

  const hash = createHash("sha256")
    .update(output.contents)
    .digest("hex")
    .slice(0, 8);
  const name = `${basename(file, ".ts")}.${hash}.js`;

  await mkdir("dist/_garden", { recursive: true });
  await writeFile(join("dist/_garden", name), output.contents);
  return `/_garden/${name}`;
}
