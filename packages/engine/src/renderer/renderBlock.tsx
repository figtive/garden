// @jsxRuntime automatic
import type { ComponentType, ReactNode } from "react";
import type {
  Block,
  BlockComponents,
  Inline,
  TokenProps,
} from "../types/index.ts";
import { keyed } from "./keyed.tsx";

type AnyBlockComponent = ComponentType<TokenProps<Block["type"]>>;

export function renderBlocks(
  blocks: Block[],
  components: BlockComponents,
): ReactNode {
  return keyed(blocks, (block) => renderBlock(block, components));
}

export function renderBlock(
  block: Block,
  components: BlockComponents,
): ReactNode {
  const Component = components[block.type] as AnyBlockComponent;

  const render = (blocks: Block[]) => renderBlocks(blocks, components);

  return (
    <Component token={block} render={render}>
      {renderChildren(block, render)}
    </Component>
  );
}

function renderChildren(
  block: Block,
  render: (blocks: Block[]) => ReactNode,
): ReactNode {
  switch (block.type) {
    case "block:heading":
    case "block:paragraph":
      return renderInlines(block.children);
    case "block:quote":
    case "block:alert":
      return render(block.children);
    case "block:list":
      return keyed(block.items, (item) => (
        <li>
          {block.spread
            ? render(item.children)
            : renderTightItem(item.children, render)}
        </li>
      ));
    case "block:table":
      return [
        <thead key="head">
          <tr>
            {keyed(block.head, (cell, column) => (
              <th align={block.align[column] ?? undefined}>
                {renderInlines(cell)}
              </th>
            ))}
          </tr>
        </thead>,
        <tbody key="body">
          {keyed(block.rows, (row) => (
            <tr>
              {keyed(row, (cell, column) => (
                <td align={block.align[column] ?? undefined}>
                  {renderInlines(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>,
      ];
    default:
      return null;
  }
}

function renderTightItem(
  blocks: Block[],
  render: (blocks: Block[]) => ReactNode,
): ReactNode {
  return keyed(blocks, (block) =>
    block.type === "block:paragraph"
      ? renderInlines(block.children)
      : render([block]),
  );
}

function renderInlines(inlines: Inline[]): ReactNode {
  return keyed(inlines, renderInline);
}

function renderInline(inline: Inline): ReactNode {
  switch (inline.type) {
    case "inline:text":
      return inline.value;
    case "inline:strong":
      return <strong>{renderInlines(inline.children)}</strong>;
    case "inline:emphasis":
      return <em>{renderInlines(inline.children)}</em>;
    case "inline:strike":
      return <s>{renderInlines(inline.children)}</s>;
    case "inline:code":
      return <code>{inline.value}</code>;
    case "inline:link":
      return (
        <a href={inline.href} title={inline.title}>
          {renderInlines(inline.children)}
        </a>
      );
    case "inline:image":
      return <img src={inline.src} alt={inline.alt} title={inline.title} />;
    case "inline:break":
      return <br />;
  }
}
