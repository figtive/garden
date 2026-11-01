import { createContext } from "react";

export const LocalPostUrlsContext = createContext<ReadonlySet<string>>(
  new Set(),
);
