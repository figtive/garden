import type { ComponentType } from "react";

export type EmbedSource = {
  kind: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fragment?: string;
};

export type EmbedProps = Omit<EmbedSource, "kind">;

export type Embed = {
  extensions: string[];
  component: ComponentType<EmbedProps>;
};
