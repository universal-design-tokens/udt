/**
 * Utilities and types for working with DTCG dimension values, as first specified
 * in the 3rd Editor's Draft of the DTCG format specification.
 */
import { isPlainObject } from "@udt/parser-utils";
import {
  isValidDimensionUnit1stED,
  sanitizeDimension1stED,
  SanitizeDimension1stEDOptions,
  type Dimension1stED,
  type DimensionUnit1stED,
} from "../1st-ed/dimension.js";
import { DtcgValueParseException } from "../shared/exceptions.js";

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
 * - `{ value: -1, unit: 'px' }`: Valid
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

/**
 * Converts a legacy dimension value that conforms to the syntax
 * of the 1st and 2nd Editor's Drafts to one that conforms to
 * the 3rd Third Editors' Draft.
 *
 * @param legacyDimensionVal A legacy dimension value (e.g. `"123px"`)
 * @returns The equivalent, 3rd Editor's Draft dimension value (e.g. `{ value: 123, unit: 'px' }`)
 */
export function fromDimension1stEDTo3rdEd(
  legacyDimensionVal: Dimension1stED
): Dimension3rdED {
  const value = parseFloat(legacyDimensionVal);
  const unit = legacyDimensionVal.substring(
    legacyDimensionVal.length - 2
  ) as DimensionUnit1stED;

  return {
    value,
    unit,
  };
}

export interface SanitizeDimension3rdEDOptions {
  /**
   * Strip away properties other than `.value` and `.unit` from
   * the input.
   */
  stripExtraneousProperties?: boolean;

  /**
   * Add the specified unit to value that are missing a `.unit`
   * property.
   */
  addMissingUnit?: DimensionUnit1stED;

  /**
   * Attempt to sanitize invalid values (after all other santization
   * options have been applied) as 1st Editor's Draft syntax.
   */
  tryAs1stEd?: boolean | SanitizeDimension1stEDOptions;
}

/**
 * Attempts to sanitize the input value to a valid dimension value,
 * as specified in the 3rd Editors' Drafts.
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
export function sanitizeDimension3rdED(
  input: unknown,
  options?: SanitizeDimension3rdEDOptions
): Dimension3rdED {
  const {
    stripExtraneousProperties = false,
    addMissingUnit,
    tryAs1stEd = false,
  } = options ?? {};

  let output = input;

  if (output !== null && typeof output === "object") {
    if (addMissingUnit && Object.keys(output).length < 2) {
      output = {
        ...output,
        unit: addMissingUnit,
      };
    }

    if (stripExtraneousProperties && Object.keys(output as object).length > 2) {
      const { value, unit } = output as any;
      output = { value, unit };
    }
  }

  if (isValidDimension3rdED(output)) {
    return output;
  }
  // Fallback to attempt to parse as a 1st ED value, if allowed by the
  // options
  if (tryAs1stEd) {
    return fromDimension1stEDTo3rdEd(
      sanitizeDimension1stED(
        output,
        tryAs1stEd !== true ? tryAs1stEd : undefined
      )
    );
  }
  // Give up
  throw new DtcgValueParseException("Invalid dimension value");
}
