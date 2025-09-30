import { describe, it, expect } from "vitest";
import {
  dimensionUnits1stED,
  isValidDimensionUnit1stED,
  isValidDimension1stED,
  sanitizeDimension1stED,
  type Dimension1stED,
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

describe("isValidDimension1stED()", () => {
  it.each(["123px", "23.45rem"] as Dimension1stED[])(
    'accepts valid value "%s"',
    (testVal) => {
      expect(isValidDimension1stED(testVal)).toBe(true);
    }
  );

  it.each([
    { testVal: "123PX", reason: "Uppercase unit" },
    { testVal: "  123 px ", reason: "Contains whitespace" },
    { testVal: "123dp", reason: "Unsupported unit" },
  ])("rejects invalid value: $testVal ($reason)", ({ testVal }) => {
    expect(isValidDimension1stED(testVal)).toBe(false);
  });

  it.each([
    { testVal: 123, type: "number" },
    { testVal: undefined, type: "undefined" },
    { testVal: {}, type: "object" },
    { testVal: [], type: "array" },
    { testVal: true, type: "boolean" },
  ])("rejects non-string, $type value: $testVal", ({ testVal }) => {
    expect(isValidDimension1stED(testVal)).toBe(false);
  });
});

describe("sanitizeDimension1stED()", () => {
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
      expect(sanitizeDimension1stED(validValue)).toBe(validValue);
    });

    it.each([
      ...sanitizableValues,
      { testVal: invalidValue, description: "Not a dimension value" },
    ])(
      "throws an error for invalid value: $testVal ($description)",
      ({ testVal }) => {
        expect(() => {
          sanitizeDimension1stED(testVal);
        }).toThrowError(DtcgValueParseException);
      }
    );
  });

  describe("with normalization enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeDimension1stED(validValue, { normalize: true })).toBe(
        validValue
      );
    });

    it.each(sanitizableValues)(
      "sanitizes to valid dimension: $testVal ($description)",
      ({ testVal }) => {
        const dimension = sanitizeDimension1stED(testVal, {
          normalize: true,
        });
        expect(isValidDimension1stED(dimension)).toBe(true);
      }
    );

    it("throws an error for unsanitizable values", () => {
      expect(() => {
        sanitizeDimension1stED(invalidValue, { normalize: true });
      }).toThrowError(DtcgValueParseException);
    });
  });
});
