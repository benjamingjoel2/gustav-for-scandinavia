import { describe, expect, it } from "vitest";
import { emptyEnquiry, validateEnquiry } from "./enquiry";

const valid = { ...emptyEnquiry, name: "Ana", email: "ana@example.com" };

describe("validateEnquiry", () => {
  it("accepts a minimal enquiry", () => {
    expect(validateEnquiry(valid)).toEqual({});
  });
  it("needs a name and a valid email", () => {
    expect(Object.keys(validateEnquiry(emptyEnquiry))).toEqual(expect.arrayContaining(["name", "email"]));
  });
  it("needs a phone number when asked to call", () => {
    expect(validateEnquiry({ ...valid, contact: "phone" }).phone).toBeTruthy();
    expect(validateEnquiry({ ...valid, contact: "phone", phone: "+47 900 00 000" })).toEqual({});
  });
  it("checks the number of days", () => {
    expect(validateEnquiry({ ...valid, days: "1" }).days).toBeTruthy();
    expect(validateEnquiry({ ...valid, days: "12" }).days).toBeUndefined();
  });
});
