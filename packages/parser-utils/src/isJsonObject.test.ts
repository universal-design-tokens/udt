import { describe, it, expect } from "vitest";
import { isJsonObject } from "./isJsonObject.js";

describe("isJsonObject()", () => {
  it("Returns true for a genuine object", () => {
    expect(isJsonObject({ foo: "bar" })).toBe(true);
  });

  it("Returns false for null", () => {
    expect(isJsonObject(null)).toBe(false);
  });

  it("Returns false for an array", () => {
    expect(isJsonObject([1, 2, 3])).toBe(false);
  });

  it("Returns false for undefined", () => {
    expect(isJsonObject(undefined)).toBe(false);
  });

  it("Returns false for a function", () => {
    expect(isJsonObject(function () {})).toBe(false);
  });

  it("Returns false for a boolean", () => {
    expect(isJsonObject(true)).toBe(false);
  });

  it("Returns false for a number", () => {
    expect(isJsonObject(42)).toBe(false);
  });
});
