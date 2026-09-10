import { describe, expect, it } from "vitest";
import { computeStreak } from "@/lib/progress/streak";

describe("computeStreak", () => {
  it("counts consecutive UTC days ending today", () => {
    expect(
      computeStreak({
        passingSubmitDaysUtc: ["2026-09-08", "2026-09-09", "2026-09-10"],
        todayUtc: "2026-09-10",
      }),
    ).toBe(3);
  });

  it("is zero when today has no passing submit", () => {
    expect(
      computeStreak({
        passingSubmitDaysUtc: ["2026-09-09"],
        todayUtc: "2026-09-10",
      }),
    ).toBe(0);
  });

  it("stops at a gap", () => {
    expect(
      computeStreak({
        passingSubmitDaysUtc: ["2026-09-08", "2026-09-10"],
        todayUtc: "2026-09-10",
      }),
    ).toBe(1);
  });
});
