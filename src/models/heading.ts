import { HeadingCache } from "obsidian";
// TODO refactor this
export class Heading {
  constructor(private cached: HeadingCache) {}

  get level(): number {
    return this.cached.level;
  }

  get rawHeading(): string {
    return this.cached.heading;
  }
  get isLink(): boolean {
    return /\[\[(.*?)\]\]/.test(this.cached.heading);
  }
  get href(): string | null {
    if (!this.isLink) return null;
    const value = this.parseMarkdownLink(this.rawHeading);
    const parts = value.split("|");
    return `#${parts.join(" ")}`;
  }
  get markdownHref(): string | null {
    if (!this.isLink) return `[[#${this.rawHeading}]]`;
    const value = this.parseMarkdownLink(this.rawHeading);
    const parts = value.split("|");
    const hasAlias = parts.length > 1;
    if (!hasAlias) {
      return `[[#${parts[0]}]]`;
    }

    // The way obsidian needs to render the link is to have the link be
    // the header + alias such as [[#Something Alt Text]]
    // Then we need to append the actual alias
    const link = parts.join(" ");
    return `[[#${link}|${parts[1]}]]`;
  }

  private parseMarkdownLink(link: string): string {
    const [, base] = link.match(/\[\[(.*?)]\]/) || [];
    return base;
  }
}
