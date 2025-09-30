import { describe, it, expect } from "vitest";
import { isValidColor1stED, type Color1stED } from "./color.js";

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
