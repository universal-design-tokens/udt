import { describe, it, expect, vitest } from "vitest";
import {
  isValidDimension3rdED,
  fromDimension1stEDTo3rdEd,
  type Dimension3rdED,
  sanitizeDimension3rdED,
} from "./dimensions.js";
import { DtcgValueParseException } from "../shared/exceptions.js";

describe("isValidDimension3rdED()", () => {
  it.each([
    { value: 123, unit: "px" },
    { value: 23.45, unit: "rem" },
  ] as Dimension3rdED[])("accepts valid value: %o", (testVal) => {
    expect(isValidDimension3rdED(testVal)).toBe(true);
  });

  it.each([
    { testVal: { value: 123, unit: "PX" }, reason: "Non-lowercase unit" },
    { testVal: { value: 123, unit: "dp" }, reason: "Unsopported unit" },
    { testVal: { value: 123 }, reason: "Missing unit" },
    {
      testVal: { value: 123, unit: "px", foo: "bar" },
      reason: "Extra property",
    },
    { testVal: { value: "123", unit: "px" }, reason: "Non-number value" },
    { testVal: { value: NaN, unit: "px" }, reason: "NaN value" },
  ])("rejects invalid value: $testVal ($reason)", ({ testVal }) => {
    expect(isValidDimension3rdED(testVal)).toBe(false);
  });

  it.each([
    { testVal: 123, type: "number" },
    { testVal: undefined, type: "undefined" },
    { testVal: "123px", type: "string" },
    { testVal: [], type: "array" },
    { testVal: true, type: "boolean" },
  ])("rejects non-object, $type value: $testVal", ({ testVal }) => {
    expect(isValidDimension3rdED(testVal)).toBe(false);
  });
});

describe("fromDimension1stEDTo3rdEd()", () => {
  it("converts 1st ED to current spec dimension correctly", () => {
    expect(fromDimension1stEDTo3rdEd("123px")).toStrictEqual({
      value: 123,
      unit: "px",
    });
  });
});

describe("sanitizeDimension3rdED()", () => {
  const validValue = {
    value: 42,
    unit: "rem",
  };

  const sanitizableByTryAs1stEDTest = {
    testVal: "1px",
    description: "Uses 1st ED syntax",
  };

  const sanitizableByTryAs1stEDAndLowercaseTest = {
    testVal: "1PX",
    description: "Uses invalid, but sanitizable 1st ED syntax",
  };

  const sanitizableByStripExtraneousPropertiesTest = {
    testVal: { value: 2, unit: "rem", nonStandard: true },
    description: "Uses 1st ED syntax",
  };

  const sanitizableAddMissingUnitTest = {
    testVal: { value: 2 },
    description: "Missing .unit",
  };

  const invalidTest = {
    testVal: {},
    description: "Empty object",
  };

  describe("with all santization options disabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeDimension3rdED(validValue)).toBe(validValue);
    });

    it.each([
      sanitizableByTryAs1stEDTest,
      sanitizableByTryAs1stEDAndLowercaseTest,
      sanitizableByStripExtraneousPropertiesTest,
      sanitizableAddMissingUnitTest,
      invalidTest,
    ])(
      "throws an error for invalid value: $testVal ($description)",
      ({ testVal }) => {
        expect(() => {
          sanitizeDimension3rdED(testVal);
        }).toThrowError(DtcgValueParseException);
      }
    );
  });

  describe("with tryAs1stED enabled", () => {
    it("passes through valid values", () => {
      expect(
        sanitizeDimension3rdED(validValue, {
          tryAs1stEd: true,
        })
      ).toBe(validValue);
    });

    it("accepts valid 1st ED values, and converts them to 3rd ED", () => {
      const dimension = sanitizeDimension3rdED(
        sanitizableByTryAs1stEDTest.testVal,
        {
          tryAs1stEd: true,
        }
      );

      expect(isValidDimension3rdED(dimension)).toBe(true);
    });

    it("applies 1st ED sanitization options if provided", () => {
      const dimension = sanitizeDimension3rdED(
        sanitizableByTryAs1stEDAndLowercaseTest.testVal,
        {
          tryAs1stEd: {
            lowercase: true,
          },
        }
      );

      expect(isValidDimension3rdED(dimension)).toBe(true);
    });
  });

  describe("with stripExtraneousProperties enabled", () => {
    it("passes through valid values", () => {
      expect(
        sanitizeDimension3rdED(validValue, {
          stripExtraneousProperties: true,
        })
      ).toBe(validValue);
    });

    it("accepts values with extraneous properties", () => {
      const dimension = sanitizeDimension3rdED(
        sanitizableByStripExtraneousPropertiesTest.testVal,
        {
          stripExtraneousProperties: true,
        }
      );

      expect(isValidDimension3rdED(dimension)).toBe(true);
    });

    it("does not modify the input object when sanitizing", () => {
      const testValCopy = structuredClone(
        sanitizableByStripExtraneousPropertiesTest.testVal
      );
      const dimension = sanitizeDimension3rdED(
        sanitizableByStripExtraneousPropertiesTest.testVal,
        {
          stripExtraneousProperties: true,
        }
      );

      // Verify that we returned a new object and didn't
      // mutate the original input
      expect(dimension).not.toBe(
        sanitizableByStripExtraneousPropertiesTest.testVal
      );
      expect(testValCopy).toStrictEqual(
        sanitizableByStripExtraneousPropertiesTest.testVal
      );
    });
  });

  describe("with addMissingUnit enabled", () => {
    it("passes through valid values", () => {
      expect(
        sanitizeDimension3rdED(validValue, {
          addMissingUnit: "rem",
        })
      ).toBe(validValue);
    });

    it("accepts values with extraneous properties", () => {
      const dimension = sanitizeDimension3rdED(
        sanitizableAddMissingUnitTest.testVal,
        {
          addMissingUnit: "rem",
        }
      );

      expect(isValidDimension3rdED(dimension)).toBe(true);
    });

    it("does not modify the input object when sanitizing", () => {
      const testValCopy = structuredClone(
        sanitizableAddMissingUnitTest.testVal
      );
      const dimension = sanitizeDimension3rdED(
        sanitizableAddMissingUnitTest.testVal,
        {
          addMissingUnit: "rem",
        }
      );

      // Verify that we returned a new object and didn't
      // mutate the original input
      expect(dimension).not.toBe(sanitizableAddMissingUnitTest.testVal);
      expect(testValCopy).toStrictEqual(sanitizableAddMissingUnitTest.testVal);
    });
  });
});
