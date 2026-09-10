import { describe, expect, it } from "vitest";
import { buildConceptTree } from "@/lib/curriculum/tree";

describe("buildConceptTree", () => {
  it("nests children without hard-coded concept names", () => {
    const tree = buildConceptTree([
      {
        id: "arrays",
        parentId: null,
        slug: "arrays",
        name: "Arrays",
        sortOrder: 2,
      },
      {
        id: "fundamentals",
        parentId: null,
        slug: "fundamentals",
        name: "Fundamentals",
        sortOrder: 1,
      },
      {
        id: "two-pointers",
        parentId: "arrays",
        slug: "two-pointers",
        name: "Two Pointers",
        sortOrder: 1,
      },
    ]);

    expect(tree.map((node) => node.slug)).toEqual(["fundamentals", "arrays"]);
    expect(tree[1]?.children.map((node) => node.slug)).toEqual(["two-pointers"]);
  });
});
