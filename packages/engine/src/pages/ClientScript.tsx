import { fileURLToPath } from "node:url";
import { createElement, use } from "react";
import { bundle } from "./bundleClientScript.ts";

export function ClientScript({ src }: { src: () => void }) {
  if (typeof src !== "string") {
    throw new Error(
      "ClientScript: src must be the default import of a .client.ts file",
    );
  }
  const file = use(bundle(fileURLToPath(src)));
  return createElement("script", { type: "module", async: true, src: file });
}
