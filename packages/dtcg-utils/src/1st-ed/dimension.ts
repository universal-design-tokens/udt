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
export type DimensionValue1stED = `${number}${DimensionUnit1stED}`;

// Used by `isValidDimensionValue1stED()`:
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
export function isValidDimensionValue1stED(
  value: unknown
): value is DimensionValue1stED {
  return typeof value === "string" && dimensionValueRegex.test(value);
}

export interface SanitizeDimensionValue1stEDOptions {
  /**
   * Whether to normalize the input, before checking validity.
   *
   * Normlization will:
   * - Coerce to string (if needed)
   * - Trim whitespace characters
   * - Convert to lowercase
   */
  normalize?: boolean;
}

const whitespaceRegex = /\s+/g;

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
export function sanitizeDimensionValue1stED(
  input: unknown,
  options?: SanitizeDimensionValue1stEDOptions
): DimensionValue1stED {
  let output = options?.normalize
    ? String(input).replaceAll(whitespaceRegex, "").toLowerCase()
    : input;

  if (isValidDimensionValue1stED(output)) {
    return output;
  }
  throw new DtcgValueParseException("Invalid dimension value");
}
