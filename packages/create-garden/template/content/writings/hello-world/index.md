---
title: Welcome to your garden
date: 2026-11-13
description: A quick tour of what you can write. Copy what you need, then delete this post (or set it to draft).
tags: [garden]
stage: seedling
draft: false
---

Greetings, stranger!

This is your first garden post. It lives in `content/writings/hello-world/index.md`,
so its address is `/writings/hello-world/`.

To write a new post, make a new folder next to this one with an `index.md` inside.

## Frontmatter

The block at the top between the `---` lines describes the post:

- `title`, `date` (YYYY-MM-DD) and `description` are required.
- `tags` groups posts into topics.
- `stage` shows how finished the post is: `seedling`, `budding` or `evergreen`.
- `draft: true` hides a post until it's ready.

If you are wondering about this post's frontmatter:

```md
---
title: Welcome to your garden
date: 2026-11-13
description: A quick tour of what you can write. Copy what you need, then delete this post (or set it to draft).
tags: [garden]
stage: seedling
draft: false
---
```

## Writing

Normal Markdown works: **bold**, *italic*, [links](https://commonmark.org),
lists, tables and footnotes.[^1]

```ts title="greet.ts"
export function greet(name: string) {
  return `Hello, ${name}!`;
}
```

> [!TIP]
> Alerts start with `> [!TIP]`. Also try `WARNING`, `CAUTION`, `CAREFUL`
> and `SUCCESS`.

## Directives

A directive puts a component on its own line. Your garden comes with one from the template,
`@youtube`, and you can register your own component as a directive in `garden.config.ts`.

The `title` is optional and becomes the caption:

```md
@youtube{videoId="LqijGdqe3xM" title="Light Rain by WOOF! IT'S BILLY, and it's my favourite song!"}
```

@youtube{videoId="LqijGdqe3xM" title="Light Rain by WOOF! IT'S BILLY, and it's my favourite song!"}

## Next steps

1. Change the site title in `garden.config.ts`.
2. Delete this post (or set `draft: true`).
3. Start writing your own posts, thoughts and directives!

> [!CAREFUL]
> For now, your site must live at a root URL, like `you.github.io` or a
> custom domain. A sub-path like `you.github.io/my-blog/` isn't supported yet.

[^1]: Like this one. It automatically collects and referenced at the bottom of the page.
