export type SearchPage = {
  url: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  data: Record<string, string>;
};

export type SearchSection = {
  url: string;
  page: number;
  heading: string;
  text: string;
};

export type SearchIndex = {
  pages: SearchPage[];
  sections: SearchSection[];
};
