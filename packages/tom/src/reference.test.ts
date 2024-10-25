import { describe, it, expect } from "vitest";
import { isReference, Reference } from "./reference.js";

const testPath = ["foo", "bar", "baz"];

describe("Reference", () => {
  it("lets you access its path", () => {
    const testRef = new Reference(testPath);
    expect(testRef.path).toBe(testPath);
  });
});

describe("isReference()", () => {
  it("returns true for a valid reference", () => {
    const testRef = new Reference(testPath);
    expect(isReference(testRef)).toBe(true);
  });

  it("returns false for a non-reference", () => {
    expect(isReference({ path: testPath })).toBe(false);
  });
});
