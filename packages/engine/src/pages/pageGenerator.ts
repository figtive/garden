import type { ComponentType } from "react";
import { groupBy } from "../content/groupBy.ts";
import type {
  GroupPageProps,
  HeadMeta,
  PageOptions,
  PageProps,
  Post,
  PostPageProps,
  SiteData,
} from "../types/index.ts";
import { resolveOption } from "../utils/resolver.ts";
import { definePage } from "./definePage.ts";

export const generateStaticPage = <TPost>(
  url: string,
  component: ComponentType<PageProps<TPost>>,
  options: PageOptions = {},
) => definePage({ paths: () => [{ url, props: {} }], component }, options);

function postMeta(post: Post): Partial<HeadMeta> {
  return {
    title: post.meta.title,
    description: post.meta.description,
    type: "article",
    image: post.meta.image,
    publishedTime: post.meta.date,
    modifiedTime: post.meta.updated,
    tags: post.meta.tags,
  };
}

export const generatePostPages = <TPost extends Post>(
  component: ComponentType<PostPageProps<TPost>>,
  options: PageOptions<{ post: TPost }> = {},
) =>
  definePage(
    {
      paths: (site: SiteData<TPost>) =>
        site.posts.map((post) => ({ url: post.route.url, props: { post } })),
      component,
    },
    {
      ...options,
      meta: (props) => ({
        ...postMeta(props.post),
        ...resolveOption(options.meta, props, {}),
      }),
    },
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
    {
      ...options,
      meta: (props) => ({
        title: `#${props.group.key}`,
        ...resolveOption(options.meta, props, {}),
      }),
    },
  );
