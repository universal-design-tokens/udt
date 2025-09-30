import { describe, it, expect } from "vitest";
import {
  colorSpaces3rdED,
  isValidColorComponents3rdED,
  isValidColorSpace3rdED,
} from "./color.js";

describe("isValidColorSpace3rdED()", () => {
  it.each(colorSpaces3rdED)('accepts valid color space key "%s"', (testVal) => {
    expect(isValidColorSpace3rdED(testVal)).toBe(true);
  });

  it.each([
    { testVal: "SRGB", reason: "Not lowercase" },
    { testVal: "duhsplay-p3", reason: "Not supported by spec" },
  ])("rejects invalid color space key: $testVal ($reason)", ({ testVal }) => {
    expect(isValidColorSpace3rdED(testVal)).toBe(false);
  });

  it.each([
    { testVal: 123, type: "number" },
    { testVal: undefined, type: "undefined" },
    { testVal: {}, type: "object" },
    { testVal: [], type: "array" },
    { testVal: true, type: "boolean" },
  ])("rejects non-string, $type value: $testVal", ({ testVal }) => {
    expect(isValidColorSpace3rdED(testVal)).toBe(false);
  });
});

describe("isValidColorComponents3rdED()", () => {
  it.each([
    { testVal: [1, 2], reason: "Too few components" },
    { testVal: [1, 2, 3, 4], reason: "Too many components" },
    { testVal: [1, 2, NaN], reason: "NaN component" },
    { testVal: ["1", "2", "3"], reason: "Non-number components" },
  ])("rejects invalid color components: $testVal ($reason)", ({ testVal }) => {
    expect(isValidColorComponents3rdED(testVal)).toBe(false);
  });
});
