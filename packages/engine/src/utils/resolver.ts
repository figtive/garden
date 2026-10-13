import type { PageOption } from "../types/page.ts";

export function resolveOption<T, Props>(
  option: PageOption<T, Props> | undefined,
  props: Props,
  fallback: T,
): T {
  if (typeof option === "function") {
    return (option as (props: Props) => T)(props);
  }
  return option ?? fallback;
}
