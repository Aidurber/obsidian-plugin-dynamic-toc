export function parseMarkdownLink(link: string): string | MarkdownLink {
  const [, base, alt] = link.match(/\[\[(.*?)\|(.*?)\]\]/) || [];
  return base && alt ? [base, alt] : link;
}
export type MarkdownLink = [string, string];
export function isMarkdownLink(
  link: string | [string, string]
): link is MarkdownLink {
  return Array.isArray(link) && link.length === 2;
}
