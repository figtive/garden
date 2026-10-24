---
title: "Edge Cases: what breaks garden?"
date: 2026-10-23
updated: 2026-10-23
description: A post built to break garden. Every weird corner of markdown on one page.
tags: [test, garden, "edge case", 日本語, a-really-long-tag-name-that-keeps-going-and-going]
image: /figtive-icon.png
draft: false
---

# Edge cases

This post is meant to break things. If something here looks wrong, that's the point.

## Heading IDs

### Same name

### Same name

### Same name 2

### 日本語の見出し

### 🌱🌱🌱

### Привет мир

### `code` in a **heading** with a [link](https://figtive.dev)

Setext heading h2
-----------------

Setext heading h1
=================

## Stuff that might get dropped

This sentence has a footnote[^1] and another one[^note].

[^1]: This is the footnote.
[^note]: This is a named footnote with **bold** in it.

This is a [reference link][garden] and a [collapsed one][] and an image reference ![icon][icon-ref].

[garden]: https://figtive.dev "Garden"
[collapsed one]: https://figtive.dev
[icon-ref]: /figtive-icon.png

<div class="raw-html">This is raw block HTML.</div>

This has <kbd>Ctrl</kbd> + <kbd>C</kbd> inline HTML and a <!-- hidden comment --> comment.

<details>
<summary>Click me</summary>

Hidden content inside details.

</details>

## Inline weirdness

Autolinks: <https://figtive.dev>, www.figtive.dev, hello@figtive.dev and <mailto:hello@figtive.dev>.

Underscores: _italic_, __bold__, snake_case_variable_name, and 2*3*4.

Escapes: \*not italic\*, \`not code\`, \[not a link\](nope), \@youtube{videoId="nope"}.

Entities: &copy; &amp; &lt;div&gt; &nbsp;&nbsp;&nbsp; &#x1F331; &hearts;

Single tilde ~strike~ and double ~~strike~~.

Code with backticks inside: `` `backtick` `` and ``` `` double `` ```.

Two trailing spaces for a break  
then this line.

Emoji: 🌱🌿🌳🍂 👨‍👩‍👧‍👦 🏳️‍🌈 and a flag 🇮🇩.

CJK: 庭園は静かな場所です。这是一个花园。정원은 조용합니다.

RTL: مرحبا بالعالم and שלום עולם mixed with English.

Z̴̢̛a̷͎̓l̵̰̈́g̸̣̈o̶̺͝ text.

A very long URL: https://figtive.dev/this/is/a/very/long/path/that/goes/on/and/on/and/on/forever/and/ever/until/it/breaks/the/layout?query=string&with=params&and=more#and-a-hash

A [link containing ![an image](/figtive-icon.png)](https://figtive.dev) inside it.

[![linked image alone](/figtive-icon.png)](https://figtive.dev)

![](/figtive-icon.png)

![missing image](/does-not-exist.png "This image doesn't exist")

![external image](https://picsum.photos/1200/400 "An external image")

![one](/figtive-icon.png) ![two](/figtive-icon.png)

## Lists

0. starts at zero
1. one

- [x] task with a nested list
  - [ ] nested task
    1. [x] ordered task inside
- item with a code block:

  ```ts
  const inList = true;
  ```

- item with a quote:

  > quoted inside a list

- item with an alert:

  > [!WARNING]
  > Alert inside a list.

- item with an image alone:

  ![icon](/figtive-icon.png "caption in a list")

- item with a directive:

  @gigantic-text{text="in a list"}

* star bullet
+ plus bullet

1) paren ordered
2) second

## Code fences

````md title="nested fences"
```ts
const inside = "a fence inside a fence";
```
````

~~~py title="tilde fence"
print("hello from tildes")
~~~

    indented code block
    with no fence at all

```
```

```ts title="highlight out of range" {99}
const a = 1;
```

```ts title="backwards range" {3-1}
const a = 1;
const b = 2;
const c = 3;
```

```ts title="zero and spaces" {0, 2 , 2-2}
const a = 1;
const b = 2;
```

```ts {2} title="meta in the other order"
const a = 1;
const b = 2;
```

```ts title="title with {braces} and spaces"
const a = 1;
```

```diff
- const old = true;
+ const updated = true;
```

```typescript
const alias: string = "typescript instead of ts";
```

```ts title="blank lines"
const a = 1;



const b = 2;
```

```ts title="tabs and unicode"
	const tabbed = "→ 日本語 🌱";
		const doubleTab = true;
```

```ts title="many lines" {50}
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10
// 11
// 12
// 13
// 14
// 15
// 16
// 17
// 18
// 19
// 20
// 21
// 22
// 23
// 24
// 25
// 26
// 27
// 28
// 29
// 30
// 31
// 32
// 33
// 34
// 35
// 36
// 37
// 38
// 39
// 40
// 41
// 42
// 43
// 44
// 45
// 46
// 47
// 48
// 49
// 50 highlighted
```

## Tables

| left | center | right | none |
| :--- | :----: | ----: | ---- |
| a | b | c | d |
| `pipe \| in code` | **bold** | ![icon](/figtive-icon.png) | [link](https://figtive.dev) |
| | | | empty cells |
| only one cell |
| 1 | 2 | 3 | 4 | 5 extra cell |

| 日本語 | 🌱 |
| --- | --- |
| 庭 | 花 |

| single |
| ------ |

## Alerts

> [!TIP|]
> Empty emoji.

> [!TIP| 🌱 🌿 ]
> Emoji with spaces around it.

> [!my-custom-kind]
> A kind with a hyphen.

> [!NOTE]

> [!NOTE]
> > A quote inside an alert.

> [!WARNING]
> > [!TIP]
> > An alert inside an alert.

> [!CAUTION]
> ### Heading inside an alert
>
> | table | inside |
> | ----- | ------ |
> | an    | alert  |
>
> @gigantic-text{text="directive in an alert"}

>[!TIP]No space after the bracket.

> [! TIP]
> Space inside the marker, shouldn't be an alert.

## Directives

@gigantic-text{text="two"}
@gigantic-text{text="in one paragraph"}

@gigantic-text{text="valid"}
@not-real{text="invalid next to valid"}

@gigantic-text{text="trailing text"} after it

@gigantic-text{text="has a } brace"}

@gigantic-text{text="never closed}

@gigantic-text{text=unquoted extra flag}

@gigantic-text{}

@gigantic-text{text="   "}

   @gigantic-text{text="indented directive"}

@GIGANTIC-TEXT{text="uppercase name"}

@youtube{videoId="kPnN4IE_a98" videoId="dQw4w9WgXcQ"}

Inline @gigantic-text{text="mid sentence"} directive.

## Dividers

---
***
___

- - -

## End

Thisisaverylongwordwithnospaces-and-hyphens-that-might-break-somewhere-on-a-really-small-mobile-screen-lol.

Bye.