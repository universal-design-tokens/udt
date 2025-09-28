import { describe, it, expect } from "vitest";
import { isValidColorValue1stED } from "./color.js";

describe("isValidColorValue1stED()", () => {
  it.each(["#ABCDEF", "#abcdef", "#123456", "#abc123"])(
    'accepts valid hex triplet "%s"',
    (value) => {
      expect(isValidColorValue1stED(value)).toBe(true);
    }
  );

  it.each(["#deadbeef", "#DEADBEEF", "#12345678", "#abcd1234"])(
    'accepts valid hex quartet "%s"',
    (value) => {
      expect(isValidColorValue1stED(value)).toBe(true);
    }
  );

  it.each([123, undefined, {}, [], true])(
    "rejects non-string value: %s",
    (value) => {
      expect(isValidColorValue1stED(value)).toBe(false);
    }
  );

  it.each(["F0F0F0", "#12345", "#1234567", "#123456789", "#ABCDEX"])(
    'rejects invalid value "%s"',
    (value) => {
      expect(isValidColorValue1stED(value)).toBe(false);
    }
  );
});
