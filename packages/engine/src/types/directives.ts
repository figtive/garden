import type { ComponentType, ReactElement } from "react";

export type RawDirectiveProps = Record<string, string | true>;

export type LooseDirectiveDefinitions = {
  component: ComponentType<RawDirectiveProps>;
};

export type StrictDirectiveDefinitions<Props> = {
  props: (raw: RawDirectiveProps) => Props;
  component: ComponentType<Props>;
};

export type Directive = {
  render: (raw: RawDirectiveProps) => ReactElement;
};
