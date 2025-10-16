/*
 * Utilities and types for working with DTCG color values, as
 * specified since the 1st Editor's Draft of the DTCG format
 * specification.
 */

import { DtcgValueParseException } from "../shared/exceptions.js";

/**
 * Color value, as specified in 1st & 2nd Editors' Drafts.
 *
 * Note, the syntax of color values changed in
 * non-backwards-compatible way in the 3rd Editor's Draft.
 *
 * @see https://www.designtokens.org/tr/first-editors-draft/format/#color
 * @see https://www.designtokens.org/tr/second-editors-draft/format/#color
 */
// TypeScript doesn't have a good way of representing color hex
// codes as a string, but this at least enforces the hash character
// at the start. Inspired by:
// https://medium.com/@steve.alves2/how-to-type-hex-colors-in-typescript-3c3b9a32baa7
export type Color1stED = `#${string}`;

// Used by `isValidColor1stED()`:
const colorValueRegex = /^#([\da-fA-F]{2}){3,4}$/;

/**
 * Checks if the value is a valid color value, as specified
 * in the 1st & 2nd Editors' Drafts.
 *
 * This is a strict check that follows the spec exactly. Whitespace,
 * or non-lowercase unit names will therefore be rejected.
 *
 * - `#abc123`: Valid
 * - `#FF00BBaa`: Valid
 * - `FFFFFF`: Invalid (missing # prefix)
 * - ` #abc123 `: Invalid (contains whitespace)
 * - `#xyz123`: Invalid (invalid hex digits)
 *
 * Note, the syntax of color values changed in
 * non-backwards-compatible way in the 3rd Editor's Draft.
 *
 * @see https://www.designtokens.org/tr/first-editors-draft/format/#color
 * @see https://www.designtokens.org/tr/second-editors-draft/format/#color
 *
 * @param value The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG color value, `false` otherwise.
 */
export function isValidColor1stED(value: unknown): value is Color1stED {
  return typeof value === "string" && colorValueRegex.test(value);
}

export interface SanitizeColor1stEDOptions {
  /**
   * Whether to coerce the input to a string.
   *
   * @default false
   */
  coerceToString?: boolean;

  /**
   * Whether to trim any leading and/or trailing whitespace.
   *
   * Not applied if the input is not a string an `coerceToString` is `false`.
   *
   * @default false
   */
  trimWhitespace?: boolean;

  /**
   * Prefix with a '#' character, if it is missing.
   *
   * @default false
   */
  addMissingHash?: boolean;

  /**
   * Expands shorthand hex values like `"#F00"` or `#FFF0` to their
   * 6 (or 8) digit equivalents.
   *
   * @default false
   */
  expandShorthand?: boolean;
}

const hexShorthandRegex = /^#([a-z\d])([a-z\d])([a-z\d])([a-z\d])?$/i;

/**
 * Attempts to sanitize the input value to a valid color value,
 * as specified in the 1st & 2nd Editors' Drafts.
 *
 * Tries to clean the input, to handle values that slightly
 * deviate from the spec.
 *
 * @throws {DtcgValueParseException} if the input could not be
 *                                    cleaned.
 *
 * @param input     The value to be sanitized.
 * @param options   Options for sanitizing the input. If omitted, only
 *                  spec-compliant values will be accepted.
 * @returns A spec-compliant color value.
 */
export function sanitizeColor1stED(
  input: unknown,
  options?: SanitizeColor1stEDOptions
): Color1stED {
  const {
    coerceToString = false,
    trimWhitespace = false,
    addMissingHash = false,
    expandShorthand = false,
  } = options ?? {};

  let output = input;

  if (typeof output !== "string" && coerceToString) {
    output = String(output);
  }

  if (typeof output === "string") {
    if (trimWhitespace) {
      output = output.trim();
    }

    if (addMissingHash && (output as string).charAt(0) !== "#") {
      output = `#${output}`;
    }

    if (expandShorthand) {
      const matches = (output as string).match(hexShorthandRegex);
      if (matches !== null) {
        const [, r, g, b, a = ""] = matches;
        // Need to double the digits: #abcd --> #aabbccdd
        output = `#${r}${r}${g}${g}${b}${b}${a}${a}`;
      }
    }
  }

  if (isValidColor1stED(output)) {
    return output;
  }
  throw new DtcgValueParseException("Invalid dimension value");
}
