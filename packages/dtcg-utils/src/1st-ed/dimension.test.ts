import { describe, it, expect } from "vitest";
import {
  dimensionUnits1stED,
  isValidDimensionUnit1stED,
  isValidDimensionValue1stED,
  sanitizeDimensionValue1stED,
  type DimensionValue1stED,
} from "./dimension.js";
import { DtcgValueParseException } from "../shared/exceptions.js";

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

describe("sanitizeDimensionValue1stED()", () => {
  const validValue = "1px";

  const sanitizableValues = [
    { testVal: "1PX", description: "Incorrectly cased unit" },
    { testVal: " 1  px  ", description: "Contains whitespace" },
    {
      testVal: {
        toString() {
          return "1px";
        },
      },
      description: "Object, but coercible to diemension",
    },
  ];

  const invalidValue = "foobar";

  describe("with normalization disabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeDimensionValue1stED(validValue)).toBe(validValue);
    });

    it.each([
      ...sanitizableValues,
      { testVal: invalidValue, description: "Not a dimension value" },
    ])(
      "throws an error for invalid value: $testVal ($description)",
      ({ testVal }) => {
        expect(() => {
          sanitizeDimensionValue1stED(testVal);
        }).toThrowError(DtcgValueParseException);
      }
    );
  });

  describe("with normalization enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeDimensionValue1stED(validValue, { normalize: true })).toBe(
        validValue
      );
    });

    it.each(sanitizableValues)(
      "sanitizes to valid dimension: $testVal ($description)",
      ({ testVal }) => {
        const dimension = sanitizeDimensionValue1stED(testVal, {
          normalize: true,
        });
        expect(isValidDimensionValue1stED(dimension)).toBe(true);
      }
    );

    it("throws an error for unsanitizable values", () => {
      expect(() => {
        sanitizeDimensionValue1stED(invalidValue, { normalize: true });
      }).toThrowError(DtcgValueParseException);
    });
  });
});
