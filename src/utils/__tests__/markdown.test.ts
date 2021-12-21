import { parseMarkdownLink } from "../markdown";

describe("Markdown utilities", () => {
  describe(parseMarkdownLink.name, () => {
    it("should return raw text if not a link", () => {
      expect(parseMarkdownLink("foo")).toBe("foo");
      expect(parseMarkdownLink("foo|bar")).toBe("foo|bar");
      expect(parseMarkdownLink("[[foo|bar")).toBe("[[foo|bar");
    });
    it("should return link parts", () => {
      expect(parseMarkdownLink("[[foo|bar]]")).toEqual(["foo", "bar"]);
    });
  });
});
