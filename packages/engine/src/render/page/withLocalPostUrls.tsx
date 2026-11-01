import { createElement, type ReactElement } from "react";
import { LocalPostUrlsContext } from "../content/localPostUrls.ts";

export function withLocalPostUrls(
  element: ReactElement,
  postUrls: ReadonlySet<string>,
) {
  return createElement(
    LocalPostUrlsContext,
    {
      value: postUrls,
    },
    element,
  );
}
