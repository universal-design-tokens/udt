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

  const sanitizableByCoerceToStringTest = {
    testVal: {
      toString() {
        return "1px";
      },
    },
    description: "Object, but coercible to diemension",
  };

  const sanitizableByTrimWhitespaceTest = {
    testVal: " 1px  ",
    description: "Has leading and trailing whitespace",
  };

  const sanitizableByRemoveInnerWhitespaceTest = {
    testVal: "1  px",
    description: "Whitespace between value and unit",
  };

  const sanitizableByLowercaseTest = {
    testVal: "1PX",
    description: "Incorrectly cased unit",
  };

  const invalidTest = {
    testVal: "invalid",
    description: "Not a dimension value",
  };

  describe("with all santization options disabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeDimension1stED(validValue)).toBe(validValue);
    });

    it.each([
      sanitizableByCoerceToStringTest,
      sanitizableByTrimWhitespaceTest,
      sanitizableByRemoveInnerWhitespaceTest,
      sanitizableByLowercaseTest,
      invalidTest,
    ])(
      "throws an error for invalid value: $testVal ($description)",
      ({ testVal }) => {
        expect(() => {
          sanitizeDimension1stED(testVal);
        }).toThrowError(DtcgValueParseException);
      }
    );
  });

  describe("with coerceToString enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeDimension1stED(validValue, { coerceToString: true })).toBe(
        validValue
      );
    });

    it("coerces non-strings to strings, before checking if they are a valid dimension", () => {
      const dimension = sanitizeDimension1stED(
        sanitizableByCoerceToStringTest.testVal,
        {
          coerceToString: true,
        }
      );
      expect(isValidDimension1stED(dimension)).toBe(true);
    });

    it("throws an error for values, that once coerced to strings, are not valid dimensions", () => {
      expect(() => {
        sanitizeDimension1stED(
          {
            toString() {
              return "invalid";
            },
          },
          { coerceToString: true }
        );
      }).toThrowError(DtcgValueParseException);
    });
  });

  describe("with trimWhitespace enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeDimension1stED(validValue, { trimWhitespace: true })).toBe(
        validValue
      );
    });

    it("trims leading and trailing whitespace off strings, before checking if they are a valid dimension", () => {
      const dimension = sanitizeDimension1stED(
        sanitizableByTrimWhitespaceTest.testVal,
        {
          trimWhitespace: true,
        }
      );
      expect(isValidDimension1stED(dimension)).toBe(true);
    });

    it("throws an error for values, that after trimming, are not valid dimensions", () => {
      expect(() => {
        sanitizeDimension1stED(" 1 px  ", { trimWhitespace: true });
      }).toThrowError(DtcgValueParseException);
    });

    describe("and coerceToString", () => {
      it("accepts non-string values that can be coerced to strings that are valid dimensions", () => {
        const dimension = sanitizeDimension1stED(
          {
            toString() {
              return "   1px    ";
            },
          },
          {
            coerceToString: true,
            trimWhitespace: true,
          }
        );
        expect(isValidDimension1stED(dimension)).toBe(true);
      });

      it("rejects non-string values that can be coerced to strings, but are not valid dimensions", () => {
        expect(() => {
          sanitizeDimension1stED(
            {
              toString() {
                return "   1 px    ";
              },
            },
            { coerceToString: true, trimWhitespace: true }
          );
        }).toThrowError(DtcgValueParseException);
      });
    });
  });

  describe("with removeInnerWhitespace enabled", () => {
    it("passes through valid values", () => {
      expect(
        sanitizeDimension1stED(validValue, { removeInnerWhitespace: true })
      ).toBe(validValue);
    });

    it("trims whitespace between value and unit, before checking if it is a valid dimension", () => {
      const dimension = sanitizeDimension1stED(
        sanitizableByRemoveInnerWhitespaceTest.testVal,
        {
          removeInnerWhitespace: true,
        }
      );
      expect(isValidDimension1stED(dimension)).toBe(true);
    });

    it("throws an error for values, that after removing inner whitespace, are not valid dimensions", () => {
      expect(() => {
        sanitizeDimension1stED("  1 px  ", { removeInnerWhitespace: true });
      }).toThrowError(DtcgValueParseException);
    });

    describe("and coerceToString", () => {
      it("accepts non-string values that can be coerced to strings that are valid dimensions", () => {
        const dimension = sanitizeDimension1stED(
          {
            toString() {
              return "1 px";
            },
          },
          {
            coerceToString: true,
            removeInnerWhitespace: true,
          }
        );
        expect(isValidDimension1stED(dimension)).toBe(true);
      });

      it("rejects non-string values that can be coerced to strings, but are not valid dimensions", () => {
        expect(() => {
          sanitizeDimension1stED(
            {
              toString() {
                return "   1 px    ";
              },
            },
            { coerceToString: true, removeInnerWhitespace: true }
          );
        }).toThrowError(DtcgValueParseException);
      });
    });
  });

  describe("with lowercase enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeDimension1stED(validValue, { lowercase: true })).toBe(
        validValue
      );
    });

    it("lowercases the input, before checking if it is a valid dimension", () => {
      const dimension = sanitizeDimension1stED(
        sanitizableByLowercaseTest.testVal,
        {
          lowercase: true,
        }
      );
      expect(isValidDimension1stED(dimension)).toBe(true);
    });

    it("throws an error for values, that after lowercasing, are not valid dimensions", () => {
      expect(() => {
        sanitizeDimension1stED("  1PX  ", { lowercase: true });
      }).toThrowError(DtcgValueParseException);
    });

    describe("and coerceToString", () => {
      it("accepts non-string values that can be coerced to strings that are valid dimensions", () => {
        const dimension = sanitizeDimension1stED(
          {
            toString() {
              return "1PX";
            },
          },
          {
            coerceToString: true,
            lowercase: true,
          }
        );
        expect(isValidDimension1stED(dimension)).toBe(true);
      });

      it("rejects non-string values that can be coerced to strings, but are not valid dimensions", () => {
        expect(() => {
          sanitizeDimension1stED(
            {
              toString() {
                return "   1PX    ";
              },
            },
            { coerceToString: true, lowercase: true }
          );
        }).toThrowError(DtcgValueParseException);
      });
    });
  });
});
