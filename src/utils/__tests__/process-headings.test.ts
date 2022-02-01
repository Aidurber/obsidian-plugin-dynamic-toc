import { CachedMetadata } from "obsidian";
import { TableOptions } from "src/types";
import { extractHeadings } from "../extract-headings";

describe("Extract headings", () => {
  it("should match snapshot", () => {
    const fileMetaData = {
      headings: [
        {
          heading: "foo",
          level: 1,
        },
        {
          heading: "bar",
          level: 2,
        },
        {
          heading: "baz",
          level: 3,
        },
        {
          heading: "[[Something|Alt Text]]",
          level: 4,
        },
      ],
    } as CachedMetadata;
    const options = {
      max_depth: 4,
      min_depth: 1,
      style: "number",
    } as TableOptions;
    expect(extractHeadings(fileMetaData, options)).toMatchSnapshot();
  });

  it("should match snapshot with title", () => {
    const fileMetaData = {
      headings: [
        {
          heading: "foo",
          level: 1,
        },
        {
          heading: "bar",
          level: 2,
        },
        {
          heading: "baz",
          level: 3,
        },
        {
          heading: "[[Something|Alt Text]]",
          level: 4,
        },
      ],
    } as CachedMetadata;
    const options = {
      max_depth: 4,
      min_depth: 1,
      style: "number",
      title: "## Table of Contents",
    } as TableOptions;
    expect(extractHeadings(fileMetaData, options)).toMatchSnapshot();
  });

  it("should match snapshot with inconsistent heading levels", () => {
    const fileMetaData = {
      headings: [
        {
          heading: "Level 2",
          level: 2,
          position: {
            start: {
              line: 7,
              col: 0,
              offset: 25,
            },
            end: {
              line: 7,
              col: 10,
              offset: 35,
            },
          },
        },
        {
          heading: "Level 4",
          level: 4,
          position: {
            start: {
              line: 10,
              col: 0,
              offset: 49,
            },
            end: {
              line: 10,
              col: 12,
              offset: 61,
            },
          },
        },
        {
          heading: "Level 5",
          level: 5,
          position: {
            start: {
              line: 13,
              col: 0,
              offset: 79,
            },
            end: {
              line: 13,
              col: 13,
              offset: 92,
            },
          },
        },
        {
          heading: "Level 2",
          level: 2,
          position: {
            start: {
              line: 16,
              col: 0,
              offset: 110,
            },
            end: {
              line: 16,
              col: 10,
              offset: 120,
            },
          },
        },
        {
          heading: "Level 3",
          level: 3,
          position: {
            start: {
              line: 18,
              col: 0,
              offset: 126,
            },
            end: {
              line: 18,
              col: 11,
              offset: 137,
            },
          },
        },
      ],
    } as CachedMetadata;
    const options = {
      max_depth: 4,
      min_depth: 1,
      style: "number",
      allow_inconsistent_headings: true,
    } as TableOptions;
    expect(extractHeadings(fileMetaData, options)).toMatchSnapshot();
  });
});
