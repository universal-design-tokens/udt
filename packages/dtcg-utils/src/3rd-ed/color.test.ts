import { describe, it, expect } from "vitest";
import { type TestVal } from "../test/testVal.js";
import {
  colorSpaces3rdED,
  isValidColorComponents3rdED,
  isValidColorSpace3rdED,
  isValidColor3rdED,
  type Color3rdED,
  fromColor1stEDTo3rdEd,
  sanitizeColor3rdED,
} from "./color.js";
import { DtcgValueParseException } from "../shared/exceptions.js";

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

describe("fromColor1stEDTo3rdEd()", () => {
  it("converts 1st ED to current spec opaque color correctly", () => {
    expect(fromColor1stEDTo3rdEd("#ff00ff")).toStrictEqual({
      colorSpace: "srgb",
      components: [1, 0, 1],
      hex: "#ff00ff",
    });
  });

  it("converts 1st ED to current spec trasparent color correctly", () => {
    expect(fromColor1stEDTo3rdEd("#ff00ff33")).toStrictEqual({
      colorSpace: "srgb",
      components: [1, 0, 1],
      alpha: 0.2,
      hex: "#ff00ff",
    });
  });

  it.each([
    {
      testVal: "",
      description: "Empty string",
    },
    {
      testVal: "#xxyyzz",
      description: "Invalid hex digits",
    },
    {
      testVal: undefined,
      description: "undefined",
    },
    {
      testVal: null,
      description: "null",
    },
    {
      testVal: 123,
      description: "number",
    },
    {
      testVal: {},
      description: "object",
    },
  ])(
    "throws an exception if provided with $testVal ($description)",
    ({ testVal }) => {
      expect(() => fromColor1stEDTo3rdEd(testVal as any)).toThrow(
        DtcgValueParseException
      );
    }
  );
});

describe("sanitizeColor3rdED()", () => {
  const validValue: Color3rdED = {
    colorSpace: "xyz-d50",
    components: [1, 1, 1],
    alpha: 0.5,
  };

  const sanitizableByTryAs1stEd: TestVal = {
    testVal: "#123456",
    description: "1st edition value",
  };

  const sanitizableByTryAs1stEDAndAddMissingHashTest: TestVal = {
    testVal: "123456",
    description: "1st edition value, with missing hash",
  };

  describe("with all sanitization options disabled", () => {
    it("passes through value values", () => {
      expect(sanitizeColor3rdED(validValue)).toBe(validValue);
    });

    it.each([
      sanitizableByTryAs1stEd,
      sanitizableByTryAs1stEDAndAddMissingHashTest,
    ])(
      "throws an error for invalid value: $testVal ($description)",
      ({ testVal }) => {
        expect(() => {
          sanitizeColor3rdED(testVal);
        }).toThrowError(DtcgValueParseException);
      }
    );
  });

  describe("with tryAs1stED enabled", () => {
    it("passes through valid values", () => {
      expect(sanitizeColor3rdED(validValue, { tryAs1stEd: true })).toBe(
        validValue
      );
    });

    it("accepts valid 1st ED values, and converts them to 3rd ED", () => {
      const color = sanitizeColor3rdED(sanitizableByTryAs1stEd.testVal, {
        tryAs1stEd: true,
      });

      expect(isValidColor3rdED(color)).toBe(true);
    });

    it("applies 1st ED sanitization options if provided", () => {
      const color = sanitizeColor3rdED(
        sanitizableByTryAs1stEDAndAddMissingHashTest.testVal,
        {
          tryAs1stEd: {
            addMissingHash: true,
          },
        }
      );

      expect(isValidColor3rdED(color)).toBe(true);
    });
  });
});
