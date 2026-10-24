// @jsxRuntime automatic
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { extractInlineText } from "../../markdown/extractTextContent.ts";
import type {
  Block,
  BlockComponents,
  Embed,
  Inline,
  TokenProps,
} from "../../types/index.ts";
import { keyed } from "./keyed.tsx";

type AnyBlockComponent = ComponentType<TokenProps<Block["type"]>>;

type RenderContext = {
  components: BlockComponents;
  embeds: Record<string, Embed>;
};

export function renderBlocks(
  blocks: Block[],
  context: RenderContext,
): ReactNode {
  return keyed(blocks, (block) => renderBlock(block, context));
}

export function renderBlock(block: Block, context: RenderContext): ReactNode {
  const Component = context.components[block.type] as AnyBlockComponent;

  const render = (blocks: Block[]) => renderBlocks(blocks, context);

  return (
    <Component token={block} render={render}>
      {renderChildren(block, context)}
    </Component>
  );
}

function renderChildren(block: Block, context: RenderContext): ReactNode {
  const render = (blocks: Block[]) => renderBlocks(blocks, context);

  switch (block.type) {
    case "block:heading":
    case "block:paragraph":
      return renderInlines(block.children, context);
    case "block:quote":
    case "block:alert":
      return render(block.children);
    case "block:list":
      return keyed(block.items, (item) => (
        <li>
          {block.spread
            ? render(item.children)
            : renderTightItem(item.children, context)}
        </li>
      ));
    case "block:table":
      return [
        <thead key="head">
          <tr>
            {keyed(block.head, (cell, column) => (
              <th align={block.align[column] ?? undefined}>
                {renderInlines(cell, context)}
              </th>
            ))}
          </tr>
        </thead>,
        <tbody key="body">
          {keyed(block.rows, (row) => (
            <tr>
              {keyed(row, (cell, column) => (
                <td
                  align={block.align[column] ?? undefined}
                  style={
                    {
                      "--cell-chars": extractInlineText(cell).length,
                    } as CSSProperties
                  }
                >
                  {renderInlines(cell, context)}
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

function renderTightItem(blocks: Block[], context: RenderContext): ReactNode {
  return keyed(blocks, (block) =>
    block.type === "block:paragraph"
      ? renderInlines(block.children, context)
      : renderBlocks([block], context),
  );
}

function renderInlines(inlines: Inline[], context: RenderContext): ReactNode {
  return keyed(inlines, (inline) => renderInline(inline, context));
}

function renderInline(inline: Inline, context: RenderContext): ReactNode {
  switch (inline.type) {
    case "inline:text":
      return inline.value;
    case "inline:strong":
      return <strong>{renderInlines(inline.children, context)}</strong>;
    case "inline:emphasis":
      return <em>{renderInlines(inline.children, context)}</em>;
    case "inline:strike":
      return <s>{renderInlines(inline.children, context)}</s>;
    case "inline:code":
      return <code>{inline.value}</code>;
    case "inline:link":
      return (
        <a href={inline.href} title={inline.title}>
          {renderInlines(inline.children, context)}
        </a>
      );
    case "inline:embed": {
      const EmbedComponent = context.embeds[inline.source.kind]?.component;
      return EmbedComponent ? <EmbedComponent {...inline.source} /> : null;
    }
    case "inline:break":
      return <br />;
  }
}
