import { describe, expect, it } from "vitest";
import { convertFromEUR, formatPrice } from "./currency";

describe("currency", () => {
  it("keeps EUR and rounds to tidy numbers", () => {
    expect(convertFromEUR(5400, "EUR")).toBe(5400);
    expect(convertFromEUR(5400, "NOK") % 500).toBe(0);
    expect(convertFromEUR(5400, "GBP") % 50).toBe(0);
  });
  it("formats without decimals", () => {
    expect(formatPrice(5400, "EUR")).toMatch(/5,400/);
    expect(formatPrice(5400, "USD")).toBe("$6,250");
  });
});
