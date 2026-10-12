import type { ComponentType } from "react";
import { groupBy } from "../content/groupBy.ts";
import type {
  GroupPageProps,
  PageOptions,
  PageProps,
  Post,
  PostPageProps,
  SiteData,
} from "../types/index.ts";
import { definePage } from "./definePage.ts";

export const generateStaticPage = <TPost>(
  url: string,
  component: ComponentType<PageProps<TPost>>,
  options: PageOptions = {},
) => definePage({ paths: () => [{ url, props: {} }], component }, options);

export const generatePostPages = <TPost extends Post>(
  component: ComponentType<PostPageProps<TPost>>,
  options: PageOptions = {},
) =>
  definePage(
    {
      paths: (site: SiteData<TPost>) =>
        site.posts.map((post) => ({ url: post.route.url, props: { post } })),
      component,
    },
    options,
  );

export const generateTagPages = <TPost extends Post>(
  component: ComponentType<GroupPageProps<TPost>>,
  {
    url = (tag: string) => `/topics/${tag}/`,
    ...options
  }: PageOptions & { url?: (tag: string) => string } = {},
) =>
  definePage(
    {
      paths: (site: SiteData<TPost>) =>
        groupBy(site.posts, (post) => {
          return post.meta.tags ?? [];
        }).map((group) => ({
          url: url(group.key),
          props: { group },
        })),
      component,
    },
    options,
  );
