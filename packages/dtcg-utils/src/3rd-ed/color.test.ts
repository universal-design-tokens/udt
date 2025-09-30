import { describe, it, expect } from "vitest";
import {
  colorSpaces3rdED,
  isValidColorComponents3rdED,
  isValidColorSpace3rdED,
  isValidColor3rdED,
  type Color3rdED,
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

describe("isValidColor3rdED()", () => {
  it.each([
    {
      colorSpace: "a98-rgb",
      components: [1, 2, 3],
    },
    {
      colorSpace: "hsl",
      components: ["none", 2, 3],
    },
    {
      colorSpace: "a98-rgb",
      components: [1, 2, 3],
      alpha: 0.5,
    },
    {
      colorSpace: "a98-rgb",
      components: [1, 2, 3],
      hex: "#123456",
    },
    {
      colorSpace: "a98-rgb",
      components: [1, 2, 3],
      alpha: 0.5,
      hex: "#123456",
    },
  ] as Color3rdED[])("accepts valid color value: %o", (testVal) => {
    expect(isValidColor3rdED(testVal)).toBe(true);
  });

  it.each([
    {
      testVal: {
        components: [1, 2, 3],
      },
      reason: "Missing .colorSpace",
    },
    {
      testVal: {
        colorSpace: "a98-rgb",
      },
      reason: "Missing .components",
    },
    {
      testVal: {
        colorSpace: "a98-rgb",
        components: [1, 2, 3],
        foo: "bar",
      },
      reason: "Unsupported extra property",
    },
    {
      testVal: {
        colorSpace: "sbrg",
        components: [1, 2, 3],
      },
      reason: "Invalid colorSpace",
    },
    {
      testVal: {
        colorSpace: "a98-rgb",
        components: ["1", 2, 3],
      },
      reason: "Invalid components",
    },
    {
      testVal: {
        colorSpace: "a98-rgb",
        components: [1, 2, 3],
        alpha: "0.5",
      },
      reason: "Non-number alpha value",
    },

    {
      testVal: {
        colorSpace: "a98-rgb",
        components: [1, 2, 3],
        hex: "wrong",
      },
      reason: "Invalid hex value",
    },
  ])("rejects invalid color value: $testVal ($reason)", ({ testVal }) => {
    expect(isValidColor3rdED(testVal)).toBe(false);
  });

  it.each([
    { testVal: 123, type: "number" },
    { testVal: undefined, type: "undefined" },
    { testVal: "123px", type: "string" },
    { testVal: [], type: "array" },
    { testVal: true, type: "boolean" },
  ])("rejects non-object, $type value: $testVal", ({ testVal }) => {
    expect(isValidColor3rdED(testVal)).toBe(false);
  });
});
