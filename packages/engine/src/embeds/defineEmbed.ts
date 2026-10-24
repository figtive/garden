import type { Embed } from "../types/index.ts";

export function defineEmbed(options: Embed): Embed {
  return {
    ...options,
    extensions: options.extensions.map((extension) =>
      extension.replace(/^\./, "").toLowerCase(),
    ),
  };
}
