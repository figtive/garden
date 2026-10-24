import type { ComponentType, ReactNode } from "react";
import type { CodePart, CodeTheme } from "./code.ts";
import type { RawDirectiveProps } from "./directives.ts";
import type { EmbedSource } from "./embeds.ts";

export type ListItem = {
  checked?: boolean;
  children: Block[];
};

export type Align = "left" | "center" | "right" | null;

export type TokenProps<T extends Block["type"]> = {
  token: Extract<Block, { type: T }>;
  children?: ReactNode;
  render: (blocks: Block[]) => ReactNode;
};

export type BlockComponents = {
  [T in Block["type"]]: ComponentType<TokenProps<T>>;
};

export type ContentProps = {
  components?: Partial<BlockComponents>;
};

export type Inline =
  | {
      type: "inline:text";
      value: string;
    }
  | {
      type: "inline:emphasis";
      children: Inline[];
    }
  | {
      type: "inline:strong";
      children: Inline[];
    }
  | {
      type: "inline:strike";
      children: Inline[];
    }
  | {
      type: "inline:code";
      value: string;
    }
  | {
      type: "inline:link";
      href: string;
      title?: string;
      children: Inline[];
    }
  | {
      type: "inline:embed";
      source: EmbedSource;
      title?: string;
      line: number;
    }
  | {
      type: "inline:break";
    };

export type Block =
  | {
      type: "block:heading";
      id: string;
      level: 1 | 2 | 3 | 4 | 5 | 6;
      children: Inline[];
    }
  | {
      type: "block:paragraph";
      children: Inline[];
    }
  | {
      type: "block:list";
      ordered: boolean;
      start?: number;
      spread: boolean;
      items: ListItem[];
    }
  | {
      type: "block:quote";
      children: Block[];
    }
  | {
      type: "block:code";
      language?: string;
      title?: string;
      highlight: number[];
      code: string;
      lines?: CodePart[][];
      theme?: CodeTheme;
    }
  | {
      type: "block:embed";
      source: EmbedSource;
      caption?: string;
      line: number;
    }
  | {
      type: "block:table";
      align: Align[];
      head: Inline[][];
      rows: Inline[][][];
    }
  | {
      type: "block:alert";
      kind: string;
      emoji?: string;
      children: Block[];
    }
  | {
      type: "block:divider";
    }
  | {
      type: "block:directive";
      name: string;
      props: RawDirectiveProps;
      line: number;
    };
