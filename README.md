# Obsidian Dynamic ToC

An Obsidian plugin to generate Tables of Contents that stay up to date with your document outline. Heavily inspired from [hipstersmoothie/obsidian-plugin-toc](https://github.com/hipstersmoothie/obsidian-plugin-toc)

![](media/screenshot.jpg)

## Usage

It's really simple to use, just add a code block to your document:

````markdown
```toc
    style: bullet or number
```
````

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
