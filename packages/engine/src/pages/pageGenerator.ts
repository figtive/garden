import type { ComponentType } from "react";
import { groupBy } from "../content/groupBy.ts";
import type {
  GroupPageProps,
  PageProps,
  Post,
  PostPageProps,
  SiteData,
} from "../types/index.ts";
import { definePage } from "./definePage.ts";

export const generateStaticPage = <TPost>(
  url: string,
  component: ComponentType<PageProps<TPost>>,
) => definePage({ paths: () => [{ url, props: {} }], component });

export const generatePostPages = <TPost extends Post>(
  component: ComponentType<PostPageProps<TPost>>,
) =>
  definePage({
    paths: (site: SiteData<TPost>) =>
      site.posts.map((post) => ({ url: post.route.url, props: { post } })),
    component,
  });

export const generateTagPages = <TPost extends Post>(
  component: ComponentType<GroupPageProps<TPost>>,
  url: (tag: string) => string = (tag) => `/topics/${tag}/`,
) =>
  definePage({
    paths: (site: SiteData<TPost>) =>
      groupBy(site.posts, (post) => post.meta.tags ?? []).map((group) => ({
        url: url(group.key),
        props: { group },
      })),
    component,
  });
