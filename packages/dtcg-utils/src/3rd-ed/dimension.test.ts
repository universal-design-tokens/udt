import { describe, it, expect } from "vitest";
import { isValidDimension3rdED, type Dimension3rdED } from "./dimensions.js";

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
