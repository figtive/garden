import { createElement, Fragment, type ReactElement } from "react";
import type { Styles } from "../../types/index.ts";

export function withStyles(
  element: ReactElement,
  styles: Styles,
  defaultPrecedence: string,
) {
  const { files, precedence = defaultPrecedence } = Array.isArray(styles)
    ? { files: styles }
    : styles;

  const links = files.map((file) =>
    createElement("link", {
      key: file,
      rel: "stylesheet",
      href: file,
      precedence,
    }),
  );
  return createElement(Fragment, null, ...links, element);
}
