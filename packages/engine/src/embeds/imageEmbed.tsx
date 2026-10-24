// @jsxRuntime automatic
import { defineEmbed } from "./defineEmbed.ts";

export const imageEmbed = defineEmbed({
  extensions: ["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"],
  component: ({ src, alt, width, height }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  ),
});
