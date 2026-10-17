import { describe, expect, it } from "vitest";
import { formatCoords, formatMonths } from "./format";

describe("formatMonths", () => {
  it("joins runs and wraps past December", () => {
    expect(formatMonths([5, 6, 7, 8, 9])).toBe("May–Sep");
    expect(formatMonths([11, 12, 1, 2, 3])).toBe("Nov–Mar");
    expect(formatMonths([2, 3, 6, 7, 8])).toBe("Feb–Mar, Jun–Aug");
    expect(formatMonths([12])).toBe("Dec");
  });
});

describe("formatCoords", () => {
  it("formats hemispheres", () => {
    expect(formatCoords(62.0107, -6.7741)).toBe("62.01°N 6.77°W");
  });
});
