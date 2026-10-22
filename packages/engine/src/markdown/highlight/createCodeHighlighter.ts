import {
  type BundledLanguage,
  bundledLanguages,
  createHighlighter,
  type ThemedToken,
} from "shiki";
import { DEFAULT_CODE_THEME } from "../../config/constants.ts";
import type { CodeOptions, CodePart, CodeTheme } from "../../types/index.ts";

const ITALIC = 1;

export type CodeHighlighter = {
  theme: CodeTheme;
  highlight: (code: string, language?: string) => Promise<CodePart[][]>;
};

export async function createCodeHighlighter({
  theme = DEFAULT_CODE_THEME,
  languages = [],
}: CodeOptions = {}): Promise<CodeHighlighter> {
  const highlighter = await createHighlighter({
    themes: [theme],
    langs: languages,
  });

  const loadedTheme = highlighter.getTheme(theme);

  async function resolveLanguage(language?: string) {
    if (!language) {
      return "text";
    }

    if (highlighter.getLoadedLanguages().includes(language)) {
      return language;
    }

    if (language in bundledLanguages) {
      await highlighter.loadLanguage(language as BundledLanguage);
      return language;
    }

    return "text";
  }

  return {
    theme: {
      background: loadedTheme.bg,
      foreground: loadedTheme.fg,
      lineNumber: loadedTheme.colors?.["editorLineNumber.foreground"],
    },

    highlight: async (code, language) => {
      const lang = await resolveLanguage(language);

      return highlighter
        .codeToTokensBase(code, { lang: lang as BundledLanguage, theme })
        .map((line) => line.map(toCodePart));
    },
  };
}

function toCodePart(token: ThemedToken): CodePart {
  return {
    content: token.content,
    color: token.color,
    italic: Boolean((token.fontStyle ?? 0) & ITALIC),
  };
}
