import { describe, it, expect } from "vitest";
import {
  dimensionUnits1stED,
  isValidDimensionUnit1stED,
  isValidDimensionValue1stED,
  type DimensionValue1stED,
} from "./dimension.js";

describe("isValidDimensionUnit1stED()", () => {
  it.each(dimensionUnits1stED)('accepts supported unit "%s"', (testVal) => {
    expect(isValidDimensionUnit1stED(testVal)).toBe(true);
  });

  it.each([
    { testVal: "REM", reason: "Not lowercase" },
    { testVal: " px ", reason: "Contains whitespace" },
    { testVal: "dp", reason: "Unsupported unit" },
  ])("rejects invalid unit: $testVal ($reason)", ({ testVal }) => {
    expect(isValidDimensionUnit1stED(testVal)).toBe(false);
  });

  it.each([
    { testVal: 123, type: "number" },
    { testVal: undefined, type: "undefined" },
    { testVal: {}, type: "object" },
    { testVal: [], type: "array" },
    { testVal: true, type: "boolean" },
  ])("rejects non-string, $type value: $testVal", ({ testVal }) => {
    expect(isValidDimensionUnit1stED(testVal)).toBe(false);
  });
});

describe("isValidDimensionValue1stED()", () => {
  it.each(["123px", "23.45rem"] as DimensionValue1stED[])(
    'accepts valid value "%s"',
    (testVal) => {
      expect(isValidDimensionValue1stED(testVal)).toBe(true);
    }
  );

  it.each([
    { testVal: "123PX", reason: "Uppercase unit" },
    { testVal: "  123 px ", reason: "Contains whitespace" },
    { testVal: "123dp", reason: "Unsupported unit" },
  ])("rejects invalid value: $testVal ($reason)", ({ testVal }) => {
    expect(isValidDimensionValue1stED(testVal)).toBe(false);
  });

  it.each([
    { testVal: 123, type: "number" },
    { testVal: undefined, type: "undefined" },
    { testVal: {}, type: "object" },
    { testVal: [], type: "array" },
    { testVal: true, type: "boolean" },
  ])("rejects non-string, $type value: $testVal", ({ testVal }) => {
    expect(isValidDimensionValue1stED(testVal)).toBe(false);
  });
});
