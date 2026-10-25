// @jsxRuntime automatic
import type { CSSProperties } from "react";
import type {
  BlockComponents,
  CodePart,
  Directive,
  Embed,
} from "../../types/index.ts";
import { keyed } from "./keyed.tsx";

export function createBlockComponents(
  directives: Record<string, Directive>,
  embeds: Record<string, Embed>,
): BlockComponents {
  return {
    "block:heading": ({ token, children }) => {
      const Heading = `h${token.level}` as const;
      return <Heading id={token.id}>{children}</Heading>;
    },

    "block:paragraph": ({ children }) => <p>{children}</p>,

    "block:list": ({ token, children }) => {
      const List = token.ordered ? "ol" : "ul";
      return <List start={token.start}>{children}</List>;
    },

    "block:quote": ({ children }) => <blockquote>{children}</blockquote>,

    "block:code": ({ token }) => (
      <figure
        className="code"
        data-language={token.language}
        style={
          {
            "--code-background": token.theme?.background,
            "--code-foreground": token.theme?.foreground,
            "--code-line-number": token.theme?.lineNumber,
          } as CSSProperties
        }
      >
        {token.title && (
          <figcaption className="code__title">{token.title}</figcaption>
        )}
        <pre>
          <code>
            {keyed(
              token.lines ??
                token.code
                  .split("\n")
                  .map((line): CodePart[] =>
                    line ? [{ content: line, italic: false }] : [],
                  ),
              (parts, index) => (
                <span
                  className="code__line"
                  data-highlighted={
                    token.highlight.includes(index + 1) || undefined
                  }
                >
                  {parts.length
                    ? keyed(parts, (part) => (
                        <span
                          style={{
                            color: part.color,
                            fontStyle: part.italic ? "italic" : undefined,
                          }}
                        >
                          {part.content}
                        </span>
                      ))
                    : " "}
                </span>
              ),
            )}
          </code>
        </pre>
      </figure>
    ),

    "block:embed": ({ token }) => {
      const EmbedComponent = embeds[token.source.kind]?.component;

      return (
        <figure className="figure" data-kind={token.source.kind}>
          {EmbedComponent && <EmbedComponent {...token.source} />}
          {(token.label || token.caption) && (
            <figcaption className="figure__caption">
              {token.label && (
                <span className="figure__label">{token.label}</span>
              )}
              {token.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    "block:table": ({ children }) => (
      <div className="table">
        <table>{children}</table>
      </div>
    ),

    "block:alert": ({ token, children }) => (
      <aside className="alert" data-kind={token.kind}>
        <p className="alert__label">
          {token.emoji && <span className="alert__emoji">{token.emoji}</span>}
          {token.kind}
        </p>
        {children}
      </aside>
    ),

    "block:divider": () => <hr />,

    "block:directive": ({ token }) =>
      directives[token.name]?.render(token.props) ?? null,
  };
}
