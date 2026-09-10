import { describe, expect, it } from "vitest";
import {
  isBasicsTopicSlug,
  matchesBasicsTopic,
  primerTopicForConcept,
} from "@/lib/curriculum/tracks";

describe("basics topics", () => {
  it("accepts known topic slugs", () => {
    expect(isBasicsTopicSlug("loops")).toBe(true);
    expect(isBasicsTopicSlug("control-structures")).toBe(true);
    expect(isBasicsTopicSlug("graphs")).toBe(false);
  });

  it("maps control structures and arrays without mixing tracks", () => {
    expect(
      matchesBasicsTopic({ concept: { slug: "control-structures" } }, "control-structures"),
    ).toBe(true);
    expect(matchesBasicsTopic({ concept: { slug: "loops" } }, "control-structures")).toBe(false);
    expect(matchesBasicsTopic({ concept: { slug: "arrays" } }, "arrays")).toBe(true);
    expect(matchesBasicsTopic({ concept: { slug: "sets" } }, "arrays")).toBe(false);
    expect(matchesBasicsTopic({ concept: { slug: "operators" } }, "variables")).toBe(true);
  });

  it("maps operators into the variables primer topic", () => {
    expect(primerTopicForConcept("operators")).toBe("variables");
    expect(primerTopicForConcept("variables")).toBe("variables");
    expect(primerTopicForConcept("accumulator")).toBeNull();
  });
});
