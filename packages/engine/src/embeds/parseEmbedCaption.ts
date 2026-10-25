const LABEL_SEPARATOR = " | ";

type EmbedCaption = {
  label?: string;
  caption?: string;
};

export function parseEmbedCaption(title?: string): EmbedCaption {
  if (!title) {
    return {};
  }

  const separatorIndex = title.indexOf(LABEL_SEPARATOR);

  if (separatorIndex === -1) {
    return { caption: title };
  }

  const label = title.slice(0, separatorIndex).trim();
  const caption = title.slice(separatorIndex + LABEL_SEPARATOR.length).trim();

  return {
    label: label || undefined,
    caption: caption || undefined,
  };
}
