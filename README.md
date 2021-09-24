# Obsidian Dynamic ToC

An Obsidian plugin to generate Tables of Contents that stay up to date with your document outline. Heavily inspired from [hipstersmoothie/obsidian-plugin-toc](https://github.com/hipstersmoothie/obsidian-plugin-toc)

![](media/screenshot.jpg)

## Usage

### Code Block

It's really simple to use, just add a code block to your document:

**Defaults**

````markdown
```toc
	style: bullet | number (default: bullet)
	min_depth: number (default: 2)
	max_depth: number (default: 6)
```
````

**Example**

````markdown
```toc
	style: number
	min_depth: 1
	max_depth: 6
```
````

You can specify the options on a case-by-case basis in your documents, or you can override the defaults in settings. If you have settings you always want to use, your usage just becomes:

````markdown
```toc

```
````

### External Rendering Support

![](media/settings.jpg)

You can also add custom injection for compatibility with markdown readers such as Markor or Gitlab with the External Rendering Support setting. Such as:

- `[toc]`/`[TOC]`
- Or `[[_TOC_]]`

This feature is to allow for consistency with another tool of your choice such as GitLab.

If you have another convention that is required for a markdown reader of your choosing. Create an issue with the name of the viewer and the convention that's used.

#### Support All

You can skip individual selection and support all renderers by checking "Support all external renderers" in settings.

> ! If you add a new line between each identifier, you will get a new table of contents for each

```markdown
[/toc/]

{{toc}}

[[__TOC__]]

[toc]
```

> ! If you add them all next to each other you will get a single block

```markdown
[/toc/]
{{toc}}
[[__TOC__]]
[toc]
```

## Contributing

```bash
yarn install
```

### Development

To start building the plugin with what mode enabled run the following command:

```bash
yarn dev
```

### Releasing

To start a release build run the following command:

```bash
yarn release
git push --follow-tags origin main
```

---
