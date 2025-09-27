/**
 * Utilities and types for working with DTCG dimension values, as
 * specified in the most recent, published spec version (currently
 * 3rd Editor's Draft).
 */
import {
  dimensionUnits1stED,
  isValidDimensionUnit1stED,
  type DimensionUnit1stED,
  type DimensionValue1stED,
} from "./1st-ed/dimension.js";
import {
  isValidDimensionValue3rdED,
  type DimensionValue3rdED,
} from "./3rd-ed/dimensions.js";

/**
 * All allowed units for dimension values, as specified in the most
 * recent, published spec version.
 */
export const dimensionUnits = dimensionUnits1stED;

/**
 * Allowed unit for dimension values, as specified in the most
 * recent, published spec version.
 */
export type DimensionUnit = DimensionUnit1stED;

/**
 * Checks if the given unit value is valid, as specified in the most
 * recent, published spec version.
 *
 * @param unit  The value to check.
 * @returns
 */
export const isValidDimensionUnit: (unit: unknown) => unit is DimensionUnit =
  isValidDimensionUnit1stED;

/**
 * Dimension value, as specified in the most recent, published
 * spec version.
 */
export type DimensionValue = DimensionValue3rdED;

/**
 * Checks if the value is a valid dimension value, as specified
 * in the most recent, published spec version.
 *
 * This is a strict check that follows the spec exactly.
 *
 * - `{ value: 123, unit: 'px' }`: Valid
 * - `{ value: 23.45, unit: 'rem' }`: Valid
 * - `{ value: 123, unit: 'PX' }`: Invalid (unit is not lowercase)
 * - `{ value: 123, unit: 'dp' }`: Invalid (unsupported unit)
 * - `{ value: 123 }`: Invalid (missing .unit property)
 * - `{ value: 123, unit: 'px', foo: 'bar' }`: Invalid (superfluous property)
 * - `{ value: '123', unit: 'px' }`: Invalid (.value is not a number)
 *
 * @param value The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG dimension value, `false` otherwise.
 */
export const isValidDimensionValue: (
  value: unknown
) => value is DimensionValue = isValidDimensionValue3rdED;

/**
 * Converts a legacy dimension value that conforms to the syntax
 * of the 1st and 2nd Editor's Drafts to one that conforms to
 * the most recent, published spec version.
 *
 * @param legacyDimensionVal A legacy dimension value (e.g. `"123px"`)
 * @returns The equivalent, current spec dimension value (e.g. `{ value: 123, unit: 'px' }`)
 */
export function fromDimensionValue1stED(
  legacyDimensionVal: DimensionValue1stED
): DimensionValue {
  const value = parseFloat(legacyDimensionVal);
  const unit = legacyDimensionVal.substring(-2) as DimensionUnit1stED;

  return {
    value,
    unit,
  };
}

/**
 * Converts a dimension value that conforms to the syntax
 * of the most recent, published spec version to a legacy one
 * that conforms to the 1st and 2nd Editor's Drafts.
 *
 * @param dimensionVal A dimension value (e.g. `{ value: 123, unit: 'px' }`)
 * @returns The equivalent, legacy dimension value (e.g. `"123px"`)
 */
export function toDimensionValue1stED(
  dimensionVal: Readonly<DimensionValue>
): DimensionValue1stED {
  return `${dimensionVal.value}${dimensionVal.unit}`;
}

/**
 * Converts a dimension value to its `rem` equivalent, assuming a
 * default font size.
 *
 * If the given dimension value already uses `rem` as its unit, it
 * will be returned as is.
 *
 * Note that `1rem` is not the _same_ as `16px`, as `rem`s are
 * relative to the user's chosen default font size (on platforms
 * that support that), and may therefore vary at runtime. This
 * conversion is therefore mainly meant for changing design tokens
 * with `px` values (e.g. as output by a design tool that lacks the
 * concept of `rem`) to equivalent `rem` values, because they are
 * _intended_ to be variable by end-users.
 *
 * @param input Any valid dimension value.
 * @param defaultPxFontSize The assumed default font size in `px`.
 *                          Defaults to 16, if not specified.
 * @returns An equivalent dimension value with the unit set to `rem`.
 */
export function toRemEquivalent(
  input: DimensionValue,
  defaultPxFontSize: number = 16
): DimensionValue {
  if (input.unit === "px") {
    return {
      value: input.value / defaultPxFontSize,
      unit: "rem",
    };
  }
  // else:
  return input;
}

/**
 * Converts a dimension value to its `px` equivalent, assuming a
 * default font size.
 *
 * If the given dimension value already uses `px` as its unit, it
 * will be returned as is.
 *
 * Note that `1rem` is not the _same_ as `16px`, as `rem`s are
 * relative to the user's chosen default font size (on platforms
 * that support that), and may therefore vary at runtime. This
 * conversion is therefore mainly meant doing lossy conversions
 * of `rem` values to _representative_ `px` values for tools or
 * platforms that lack the concept of `rem`.
 *
 * @param input Any valid dimension value.
 * @param defaultPxFontSize The assumed default font size in `px`.
 *                          Defaults to 16, if not specified.
 * @returns An equivalent dimension value with the unit set to `rem`.
 */
export function toPxEquivalent(
  input: DimensionValue,
  defaultPxFontSize: number = 16
): DimensionValue {
  if (input.unit === "rem") {
    return {
      value: input.value * defaultPxFontSize,
      unit: "px",
    };
  }
  // else:
  return input;
}
