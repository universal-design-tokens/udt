/**
 * Utilities and types for working with DTCG dimension values, as
 * specified since the 1st Editor's Draft of the DTCG format
 * specification.
 *
 */

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
 */
export type DimensionValue1stED = `${number}${DimensionUnit1stED}`;

const strictDimensionValueRegex = /^\d+(\.\d+)?(px|rem)$/;

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
 * @param value The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG dimension value, `false` otherwise.
 */
export function isValidDimensionValue1stED(
  value: unknown
): value is DimensionValue1stED {
  return typeof value === "string" && strictDimensionValueRegex.test(value);
}

export interface NormalizeDimensionValueOptions {
  /**
   * Whether whitespace at the start, end or between value & unit should be ignored.
   *
   * If enabled, values like `"  100  px  "`, which don't conform to the spec, will be
   * accepted and parsed to a valid DTCG value: `"100px"`.
   */
  ignoreWhitespace: boolean;

  /**
   * Whether the case of units should be ignored.
   *
   * If enabled, values like `"100PX"`, which don't confirm to the spec, will be accepted
   * and parsed to a valid DTCG value: `"100px"`
   */
  ignoreCase: boolean;
}

// export function normalizeDimensionValue(
//   value: unknown,
//   options: NormalizeDimensionValueOptions
// ): DimensionValue {}
