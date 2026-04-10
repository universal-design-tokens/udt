import { describe, it, expect } from "vitest";
import {
  isValidColor1stED,
  sanitizeColor1stED,
  type Color1stED,
} from "./color.js";
import { DtcgValueParseException } from "../shared/exceptions.js";

describe("isValidColor1stED()", () => {
  it.each(["#ABCDEF", "#abcdef", "#123456", "#abc123"] as Color1stED[])(
    'accepts valid hex triplet "%s"',
    (testVal) => {
      expect(isValidColor1stED(testVal)).toBe(true);
    }
  );

  it.each(["#deadbeef", "#DEADBEEF", "#12345678", "#abcd1234"] as Color1stED[])(
    'accepts valid hex quartet "%s"',
    (testVal) => {
      expect(isValidColor1stED(testVal)).toBe(true);
    }
  );

  it.each([
    { testVal: 123, type: "number" },
    { testVal: undefined, type: "undefined" },
    { testVal: {}, type: "object" },
    { testVal: [], type: "array" },
    { testVal: true, type: "boolean" },
  ])("rejects non-string, $type value: $testVal", ({ testVal }) => {
    expect(isValidColor1stED(testVal)).toBe(false);
  });

  it.each([
    { testVal: "F0F0F0", reason: "No hash prefix" },
    { testVal: "#12345", reason: "Too few digits (5)" },
    { testVal: "#1234567", reason: "invalid number of digits (7)" },
    { testVal: "#123456789", reason: "Too many digits (9)" },
    { testVal: "#ABCDEX", reason: "Invalid digit (X)" },
  ])("rejects invalid value: $testVal ($reason)", ({ testVal }) => {
    expect(isValidColor1stED(testVal)).toBe(false);
  });
});

describe("sanitizeColor1stED()", () => {
  const validValue: Color1stED = "#123456";

  const sanitizableByCoerceToStringTest = {
    testVal: {
      toString() {
        return validValue;
      },
    },
    description: "Object, but coercible to color",
  };

  const sanitizableByTrimWhitespaceTest = {
    testVal: " #123456  ",
    description: "Has leading and trailing whitespace",
  };

  const sanitizableByAddMissingHashTest = {
    testVal: "123456",
    description: "Missing #",
  };

  const sanitizableByExpandShorthandTest = {
    testVal: "#1234",
    description: "Shorthand format (3/4 digits instead of 6/8)",
  };

  const invalidTest = {
    testVal: "invalid",
    description: "Not a dimension value",
  };

  describe("with all santization options disabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeColor1stED(validValue)).toBe(validValue);
    });

    it.each([
      sanitizableByCoerceToStringTest,
      sanitizableByTrimWhitespaceTest,
      sanitizableByAddMissingHashTest,
      sanitizableByExpandShorthandTest,
      invalidTest,
    ])(
      "throws an error for invalid value: $testVal ($description)",
      ({ testVal }) => {
        expect(() => {
          sanitizeColor1stED(testVal);
        }).toThrow(DtcgValueParseException);
      }
    );
  });

  describe("with coerceToString enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeColor1stED(validValue, { coerceToString: true })).toBe(
        validValue
      );
    });

    it("coerces non-strings to strings, before checking if they are a valid colors", () => {
      const color = sanitizeColor1stED(
        sanitizableByCoerceToStringTest.testVal,
        {
          coerceToString: true,
        }
      );
      expect(isValidColor1stED(color)).toBe(true);
    });

    it("throws an error for values, that once coerced to strings, are not valid colors", () => {
      expect(() => {
        sanitizeColor1stED(invalidTest.testVal, { coerceToString: true });
      }).toThrow(DtcgValueParseException);
    });
  });

  describe("with trimWhitespace enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeColor1stED(validValue, { trimWhitespace: true })).toBe(
        validValue
      );
    });

    it("trims leading and trailing whitespace off strings, before checking if they are a valid colors", () => {
      const color = sanitizeColor1stED(
        sanitizableByTrimWhitespaceTest.testVal,
        {
          trimWhitespace: true,
        }
      );
      expect(isValidColor1stED(color)).toBe(true);
    });

    it("throws an error for values, that after trimming, are not valid colors", () => {
      expect(() => {
        sanitizeColor1stED(" invalid  ", { trimWhitespace: true });
      }).toThrow(DtcgValueParseException);
    });

    describe("and coerceToString", () => {
      it("accepts non-string values that can be coerced to strings that are valid colors", () => {
        const color = sanitizeColor1stED(
          {
            toString() {
              return "   #123456    ";
            },
          },
          {
            coerceToString: true,
            trimWhitespace: true,
          }
        );
        expect(isValidColor1stED(color)).toBe(true);
      });

      it("rejects non-string values that can be coerced to strings, but are not valid colors", () => {
        expect(() => {
          sanitizeColor1stED(
            {
              toString() {
                return "   invalid    ";
              },
            },
            { coerceToString: true, trimWhitespace: true }
          );
        }).toThrow(DtcgValueParseException);
      });
    });
  });

  describe("with addMissingHash enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeColor1stED(validValue, { addMissingHash: true })).toBe(
        validValue
      );
    });

    it("adds a missing hash, before checking if it is a valid color", () => {
      const color = sanitizeColor1stED(
        sanitizableByAddMissingHashTest.testVal,
        {
          addMissingHash: true,
        }
      );
      expect(isValidColor1stED(color)).toBe(true);
    });

    it("throws an error for values, that after adding a hash, are not valid colors", () => {
      expect(() => {
        sanitizeColor1stED(invalidTest.testVal, { addMissingHash: true });
      }).toThrow(DtcgValueParseException);
    });

    describe("and coerceToString", () => {
      it("accepts non-string values that can be coerced to strings that are valid colors", () => {
        const dimension = sanitizeColor1stED(
          {
            toString() {
              return sanitizableByAddMissingHashTest.testVal;
            },
          },
          {
            coerceToString: true,
            addMissingHash: true,
          }
        );
        expect(isValidColor1stED(dimension)).toBe(true);
      });

      it("rejects non-string values that can be coerced to strings, but are not valid colors", () => {
        expect(() => {
          sanitizeColor1stED(
            {
              toString() {
                return invalidTest.testVal;
              },
            },
            { coerceToString: true, addMissingHash: true }
          );
        }).toThrow(DtcgValueParseException);
      });
    });
  });

  describe("with expandShorthand enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeColor1stED(validValue, { expandShorthand: true })).toBe(
        validValue
      );
    });

    it("expands shorthand hex, before checking if it is a valid color", () => {
      const color = sanitizeColor1stED(
        sanitizableByExpandShorthandTest.testVal,
        {
          expandShorthand: true,
        }
      );
      expect(isValidColor1stED(color)).toBe(true);
    });

    it("throws an error for values, that after expanding shorthand hex, are not valid colors", () => {
      expect(() => {
        sanitizeColor1stED(invalidTest.testVal, { expandShorthand: true });
      }).toThrow(DtcgValueParseException);
    });

    describe("and coerceToString", () => {
      it("accepts non-string values that can be coerced to strings that are valid colors", () => {
        const dimension = sanitizeColor1stED(
          {
            toString() {
              return sanitizableByExpandShorthandTest.testVal;
            },
          },
          {
            coerceToString: true,
            expandShorthand: true,
          }
        );
        expect(isValidColor1stED(dimension)).toBe(true);
      });

      it("rejects non-string values that can be coerced to strings, but are not valid colors", () => {
        expect(() => {
          sanitizeColor1stED(
            {
              toString() {
                return invalidTest.testVal;
              },
            },
            { coerceToString: true, expandShorthand: true }
          );
        }).toThrow(DtcgValueParseException);
      });
    });
  });
});
