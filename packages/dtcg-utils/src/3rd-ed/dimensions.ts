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
export type DimensionValue3rdED = {
  value: number;
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
 * - `{ value: '123', unit: 'px' }`: Invalid (.value is not a number)
 *
 * @param value The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG dimension value, `false` otherwise.
 */
export function isValidDimensionValue3rdED(
  value: unknown
): value is DimensionValue3rdED {
  return (
    // MUST be an object
    isPlainObject(value) &&
    // MUST have both .value & .unit properties
    Object.keys(value).length === 2 &&
    // .value MUST be number
    typeof value.value === "number" &&
    // .unit MUST be one of the supported ones
    isValidDimensionUnit1stED(value.unit)
  );
}
