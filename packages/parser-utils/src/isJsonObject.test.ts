import { describe, it, expect } from "vitest";
import { isPlainObject } from "./isJsonObject.js";

describe("isPlainObject()", () => {
  it("Returns true for a genuine object", () => {
    expect(isPlainObject({ foo: "bar" })).toBe(true);
  });

  it("Returns false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("Returns false for an array", () => {
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it("Returns false for undefined", () => {
    expect(isPlainObject(undefined)).toBe(false);
  });

  it("Returns false for a function", () => {
    expect(isPlainObject(function () {})).toBe(false);
  });

  it("Returns false for a boolean", () => {
    expect(isPlainObject(true)).toBe(false);
  });

  it("Returns false for a number", () => {
    expect(isPlainObject(42)).toBe(false);
  });
});
