import type {
  BundledLanguage,
  BundledTheme,
  LanguageInput,
  ThemeRegistrationAny,
} from "shiki";

export type CodeOptions = {
  theme?: BundledTheme | ThemeRegistrationAny;
  languages?: (BundledLanguage | LanguageInput)[];
};

export type CodePart = {
  content: string;
  color?: string;
  italic: boolean;
};

export type CodeTheme = {
  background?: string;
  foreground?: string;
  lineNumber?: string;
};
