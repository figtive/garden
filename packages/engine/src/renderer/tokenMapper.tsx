// @jsxRuntime automatic
import type { BlockComponents, Directive } from "../types/index.ts";
import { keyed } from "./keyed.tsx";

export function createBlockComponents(
  directives: Record<string, Directive>,
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
      <figure className="code" data-language={token.language}>
        {token.title && (
          <figcaption className="code__title">{token.title}</figcaption>
        )}
        <pre>
          <code>
            {keyed(token.code.split("\n"), (line, index) => (
              <span
                className="code__line"
                data-highlighted={
                  token.highlight.includes(index + 1) || undefined
                }
              >
                {`${line}\n`}
              </span>
            ))}
          </code>
        </pre>
      </figure>
    ),

    "block:image": ({ token }) => (
      <figure>
        <img src={token.src} alt={token.alt} />
        {token.caption && <figcaption>{token.caption}</figcaption>}
      </figure>
    ),

    "block:table": ({ children }) => <table>{children}</table>,

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
