/**
 * Utilities and types for working with DTCG dimension values, as first specified
 * in the 3rd Editor's Draft of the DTCG format specification.
 */
import { isPlainObject } from "@udt/parser-utils";
import {
  isValidDimensionUnit1stED,
  type DimensionUnit1stED,
} from "../1st-ed/dimension.js";

/**
 * Dimension value, as specified since the 3rd Editor's Draft.
 */
export type Dimension3rdED = {
  /**
   * An integer or floating-point value representing the numeric value.
   */
  value: number;

  /**
   * Unit of distance.
   */
  unit: DimensionUnit1stED;
};

/**
 * Checks if the value is a valid dimension value, as specified
 * since the 3rd Third Editors' Draft.
 *
 * This is a strict check that follows the spec exactly.
 *
 * - `{ value: 123, unit: 'px' }`: Valid
 * - `{ value: 23.45, unit: 'rem' }`: Valid
 * - `{ value: 123, unit: 'PX' }`: Invalid (unit is not lowercase)
 * - `{ value: 123, unit: 'dp' }`: Invalid (unsupported unit)
 * - `{ value: 123 }`: Invalid (missing .unit property)
 * - `{ value: 123, unit: 'px', foo: 'bar' }`: Invalid (superfluous property)
 * - `{ value: '123', unit: 'px' }`: Invalid (.value is not a JS number)
 * - `{ value: NaN, unit: 'px'}`: Invalid (.value is NaN)
 *
 * @param input The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG dimension value, `false` otherwise.
 */
export function isValidDimension3rdED(input: unknown): input is Dimension3rdED {
  return (
    // MUST be an object
    isPlainObject(input) &&
    // MUST NOT have additional properties, beyond
    // .value & .unit
    Object.keys(input).length === 2 &&
    // .value MUST be number
    typeof input.value === "number" &&
    // .value MUST NOT be NaN
    !isNaN(input.value) &&
    // .unit MUST be one of the supported ones
    isValidDimensionUnit1stED(input.unit)
  );
}
