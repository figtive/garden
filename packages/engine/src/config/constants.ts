const GARDEN_CONFIG_FILE = "garden.config.ts";
const DEFAULT_CONTENT_PATH = "./content";

const DEFAULT_CODE_THEME = "material-theme-darker";

const REQUIRED_FRONTMATTER_KEYS = ["title", "date", "description"] as const;

const DEFAULT_ATTACHMENTS_PATH = "./content/attachments";

const ATTACHMENTS_FOLDER = "attachments";

const TAGS_FOLDER = "_tags";

export {
  ATTACHMENTS_FOLDER,
  DEFAULT_ATTACHMENTS_PATH,
  DEFAULT_CODE_THEME,
  DEFAULT_CONTENT_PATH,
  GARDEN_CONFIG_FILE,
  REQUIRED_FRONTMATTER_KEYS,
  TAGS_FOLDER,
};
