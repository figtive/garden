// @jsxRuntime automatic
import { Fragment, type ReactNode } from "react";

export function keyed<T>(
  items: T[],
  render: (item: T, index: number) => ReactNode,
): ReactNode[] {
  return items.map((item, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: tokens have no ids and never reorder
    <Fragment key={index}>{render(item, index)}</Fragment>
  ));
}
