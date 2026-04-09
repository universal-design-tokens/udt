/*
 * Utilities and types for working with DTCG dimension values, as
 * specified since the 1st Editor's Draft of the DTCG format
 * specification.
 */

import { DtcgValueParseException } from "../shared/exceptions.js";

/**
 * All allowed units for dimension values, as specified since
 * the 1st Editor's Draft.
 */
export const dimensionUnits1stED = ["px", "rem"] as const;

/**
 * Allowed unit for dimension values, as specified since
 * the 1st Editor's Draft.
 */
export type DimensionUnit1stED = (typeof dimensionUnits1stED)[number];

/**
 * Checks if the given unit value is valid, as specified since
 * the 1st Editor's Draft.
 *
 * @param unit  The value to check.
 * @returns
 */
export function isValidDimensionUnit1stED(
  unit: unknown
): unit is DimensionUnit1stED {
  return (dimensionUnits1stED as ReadonlyArray<unknown>).includes(unit);
}

/**
 * Dimension value, as specified in 1st & 2nd Editors' Drafts.
 *
 * Note, the syntax of dimension values changed in
 * non-backwards-compatible way in the 3rd Editor's Draft.
 *
 * @see https://www.designtokens.org/tr/first-editors-draft/format/#dimension
 * @see https://www.designtokens.org/tr/second-editors-draft/format/#dimension
 */
export type Dimension1stED = `${number}${DimensionUnit1stED}`;

// Used by `isValidDimension1stED()`:
const dimensionValueRegex = /^\d+(\.\d+)?(px|rem)$/;

/**
 * Checks if the value is a valid dimension value, as specified
 * in the 1st & 2nd Editors' Drafts.
 *
 * This is a strict check that follows the spec exactly. Whitespace,
 * or non-lowercase unit names will therefore be rejected.
 *
 * - `123px`: Valid
 * - `23.45rem`: Valid
 * - `123PX`: Invalid (unit is not lowercase)
 * - `  123 px `: Invalid (contains whitespace)
 * - `123dp`: Invalid (unsupported unit)
 *
 * Note, the syntax of dimension values changed in
 * non-backwards-compatible way in the 3rd Editor's Draft.
 *
 * @see https://www.designtokens.org/tr/first-editors-draft/format/#dimension
 * @see https://www.designtokens.org/tr/second-editors-draft/format/#dimension
 *
 * @param value The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG dimension value, `false` otherwise.
 */
export function isValidDimension1stED(value: unknown): value is Dimension1stED {
  return typeof value === "string" && dimensionValueRegex.test(value);
}

export interface SanitizeDimension1stEDOptions {
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
   * Whether to remove whitespace between value and unit.
   *
   * Not applied if the input is not a string an `coerceToString` is `false`.
   *
   * @default false
   */
  removeInnerWhitespace?: boolean;

  /**
   * Whether to force the input to be lowercase.
   *
   * Not applied if the input is not a string an `coerceToString` is `false`.
   *
   * @default false
   */
  lowercase?: boolean;
}

/**
 * Matches any whitespace between a digit and letter.
 */
const innerWhitespaceRegex = /(?<=\d)(\s*)(?=[a-z])/i;

/**
 * Attempts to sanitize the input value to a valid dimension value,
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
 * @returns A spec-compliant dimension value.
 */
export function sanitizeDimension1stED(
  input: unknown,
  options?: SanitizeDimension1stEDOptions
): Dimension1stED {
  const {
    coerceToString = false,
    trimWhitespace = false,
    removeInnerWhitespace = false,
    lowercase = false,
  } = options ?? {};

  let output = input;

  if (typeof output !== "string" && coerceToString) {
    output = String(output);
  }

  if (typeof output === "string") {
    if (trimWhitespace) {
      output = output.trim();
    }

    if (removeInnerWhitespace) {
      output = (output as string).replace(innerWhitespaceRegex, "");
    }

    if (lowercase) {
      output = (output as string).toLowerCase();
    }
  }

  if (isValidDimension1stED(output)) {
    return output;
  }
  throw new DtcgValueParseException("Invalid dimension value");
}
