---
title: Second
date: 2026-10-10
description: Second test
tags: [meta, garden]
---

# Hello World from Second this is a sad post

Second post on **garden**. It follows [hello world](/posts/hello-world/), the first one.

## Link preview tests

- [hello world](/posts/hello-world/): preview, top of the post
- [hello world, no slash](/posts/hello-world): preview (engine adds the slash)
- [hello world with query](/posts/hello-world/?ref=test): preview
- [edge cases, heading ids](/posts/edge-cases/#heading-ids): preview scrolled to "Heading ids"
- [edge cases, same name](/posts/edge-cases/#same-name-2): preview scrolled to the second "Same name"
- [a link with `code` and **bold** inside](/posts/edge-cases/): preview, no flicker moving across the code and bold
- [this post](/posts/second/): no preview (self-link)
- [this post's heading](/posts/second/#link-preview-tests): no preview (self-link with hash)
- [topics](/topics): no preview (not a post)
- [a missing post](/posts/does-not-exist/): no preview (not in the post list)
- [figtive](https://figtive.dev): no preview (external)
- [protocol-relative](//figtive.dev/posts/hello-world/): no preview (external, even though it starts with `/`)
- [jump down](#link-preview-tests): no preview (same-page hash)

This is a long paragraph so the next link wraps across two lines on a normal
screen, which checks that the preview sits under the line you hover:
[a deliberately long link to the hello world post that should wrap onto a second line](/posts/hello-world/).