---
title: Test Page for .md
date: 2025-09-20
updated: 2026-10-22
description: test, test, test. Every component on one page.
tags: [test, garden]
---

# Test page

Hello world this is a test page. Everything **garden** can render should be on here.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Text

This is *italic*, this is **bold**, this is ***both***, this is ~~deleted~~ and this is `code`.

This is **bold with *italic* and `code` inside it**.

This is a [link](https://figtive.dev), this is a [link with a title](https://figtive.dev "hello"), and this is just https://figtive.dev.

This line has a break at the end\
and this is the next line.

This is an image ![icon](/figtive-icon.png) inside a sentence.

Thisisaverylongwordwithnospacesinitjusttoseewhathappensonmobilelolthisisaverylongword.

## Headings

### This is h3

#### This is h4

##### This is h5

###### This is h6

### Same name

### Same name

### This is a really long heading lorem ipsum dolor sit amet consectetur adipiscing elit

## Lists

- apple
- banana
- this one is long, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
  - nested
    - nested again
      - ok thats enough
- orange

1. first
2. second
   1. second but nested
   2. second but nested again
3. third

7. this starts at seven
8. eight

- [x] done
- [ ] not done
- [ ] not done with `code` and a [link](https://figtive.dev)

- this list has space between items

- so it should look more spaced out

  and this is another paragraph inside the item.

## Code

Here is the loader as it shipped. Both requests start at the same time, which is good, but the `return` waits for both.

```ts title="routes/course.tsx" {4}
export async function loader({ params }: Route.LoaderArgs) {
  const course = getCourse(params.id)
  const reviews = getReviews(params.id)
  return { course: await course, reviews: await reviews } // waits 1.8 s
}
```

This one highlights more than one line.

```ts title="hello.ts" {1,3-4}
const hello = "world";
console.log(hello);
const garden = true;
console.log("hello world! garden");
```

This one has no language.

```
just some text
  with spaces
```

This one has a language that doesnt exist.

```garden
hello world from garden
```

This one has a really long line.

```js title="this-is-a-really-long-file-name-for-testing.js"
const fruits = ["apple", "banana", "orange", "grape", "mango", "melon", "kiwi", "peach", "pear", "plum", "cherry", "lemon"].map((fruit) => fruit.toUpperCase());
```

```tsx
export function Hello({ name }: { name: string }) {
  return <h1>Hello {name}!</h1>;
}
```

```css
.hello {
  color: var(--color-primary);
}
```

```json
{ "name": "garden", "private": true }
```

```sh title="terminal"
$ pnpm test routes/course
  ✓ renders course before reviews resolve  38 ms
  ✓ review fallback keeps a fixed height    12 ms
  ✓ review errors stay inside the list      21 ms
  3 passed · 0.41 s
```

## Tables

This is a small table.

| fruit | count |
| ----- | ----- |
| apple | 3     |

This is a table with random values within it

| version              | first paint | reviews visible | layout shift |
| -------------------- | ----------: | --------------: | -----------: |
| Await both           |    1,840 ms |        1,840 ms |         0.00 |
| Fetch in an effect   |      310 ms |        2,260 ms |         0.21 |
| Unawaited + Suspense |       60 ms |        1,810 ms |         0.00 |

This one has a notes column with long text.

| version              | first paint | reviews visible | layout shift | notes |
| -------------------- | ----------: | --------------: | -----------: | ----- |
| Await both           |    1,840 ms |        1,840 ms |         0.00 | Lorem ipsum dolor sit amet, consectetur adipiscing elit |
| Fetch in an effect   |      310 ms |        2,260 ms |         0.21 | Sed do eiusmod tempor incididunt ut labore |
| Unawaited + Suspense |       60 ms |        1,810 ms |         0.00 | Best of both |
| Another version      |      100 ms |  10000000000 ms |   0.00       | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo nulla rhoncus eros dignissim, non aliquam arcu consectetur. Nulla pulvinar dolor vitae enim tempor, at gravida augue volutpat. Nulla volutpat enim mi, at pharetra lacus dictum cursus. Duis scelerisque, justo vel malesuada interdum, mi risus auctor est, ac finibus sem augue nec nulla. Aliquam erat volutpat. Aenean vitae ante tincidunt, maximus diam ut, sodales quam. Cras pulvinar ante odio. Duis ac elit pretium, mattis lorem in, pharetra neque. Quisque nisl velit, finibus id nulla commodo, mollis mollis neque. Praesent varius dolor a velit venenatis imperdiet. Aenean tincidunt ipsum lacinia ex placerat, in commodo neque ornare. Donec eu risus nisl.

 |

This one has too many columns.

| a | b | c | d | e | f | g | h | i | j | k | l |
| - | - | - | - | - | - | - | - | - | - | - | - |
| apple | banana | cherry | grape | kiwi | lemon | mango | melon | orange | peach | pear | plum |

## Quotes

> This is a quote.

> This is a quote with two paragraphs. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
>
> This is the second paragraph.

> This is a quote.
>
> > This is a quote inside a quote.
> >
> > > And another one.
> > > > And another one.
> > > > > And another one.
> > > > > > And another one.
> > > > > > > And another one.

> **This starts with bold** so [!TIP] this should not be an alert.

### Some alert examples

> [!NOTE]
> This is a note.

> [!TIP]
> This is a regular tip.

> [!TIP|🔥]
> This is a tip with an emoji in it.

> [!WARNING]
> If you `await` the reviews anywhere before returning, the loader blocks again. The type checker will not warn you.

> [!CAUTION]
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in pharetra libero, ac convallis orci. Nam ullamcorper vehicula ipsum eu ullamcorper. Curabitur at neque et magna dapibus ullamcorper. Fusce venenatis commodo sapien, in facilisis ipsum mollis nec. Nulla porta dolor diam. Sed blandit quis massa ac volutpat.

> [!CAREFUL|⚠️]
> This is careful with an emoji.

> [!SUCCESS]
> This is a success.

> [!success] This is a success on one line.

> [!TIP]
> This tip has a list and code in it.
>
> - apple
> - banana
>
> ```ts
> console.log("hello world! garden");
> ```

> [!banana]
> This is a banana alert, it doesnt have a color.

## Images

![garden icon](/figtive-icon.png "This is the caption")

![garden icon](/figtive-icon.png)

## Divider

This is above the line.

---

This is below the line.

## Directives

@youtube{videoId="kPnN4IE_a98"}

@gigantic-text{text="This is a Big text"}

@not-real{text="hello"}

That one above is not a real directive.

## Does it help?

Median of 50 cold loads on a throttled 4G profile, measured in the browser.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Bye.