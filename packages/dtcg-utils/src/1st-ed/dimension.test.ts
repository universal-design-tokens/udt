import { describe, it, expect } from "vitest";
import {
  dimensionUnits1stED,
  isValidDimensionUnit1stED,
  isValidDimensionValue1stED,
} from "./dimension.js";

describe("isValidDimensionUnit1stED()", () => {
  it.each(dimensionUnits1stED)('accepts supported unit "%s"', (unit) => {
    expect(isValidDimensionUnit1stED(unit)).toBe(true);
  });

  it.each(["REM", "pX", " px ", "pt", "dp"])(
    'rejects other string "%s"',
    (unit) => {
      expect(isValidDimensionUnit1stED(unit)).toBe(false);
    }
  );

  it.each([123, undefined, {}, [], true])(
    "rejects non-string value: %s",
    (value) => {
      expect(isValidDimensionUnit1stED(value)).toBe(false);
    }
  );
});

describe("isValidDimensionValue1stED()", () => {
  it.each(["123px", "23.45rem"])('accepts valid value "%s"', (value) => {
    expect(isValidDimensionValue1stED(value)).toBe(true);
  });

  it.each(["123PX", "  123 px ", "123dp"])(
    'rejects invalid value "%s"',
    (value) => {
      expect(isValidDimensionValue1stED(value)).toBe(false);
    }
  );

  it.each([123, undefined, {}, [], true])(
    "rejects non-string value: %s",
    (value) => {
      expect(isValidDimensionValue1stED(value)).toBe(false);
    }
  );
});
