/**
 * Utilities and types for working with DTCG color values, as first specified
 * in the 3rd Editor's Draft of the DTCG format specification.
 */

import { isPlainObject } from "@udt/parser-utils";
import { DtcgValueParseException } from "../shared/exceptions.js";
import {
  Color1stED,
  sanitizeColor1stED,
  type SanitizeColor1stEDOptions,
} from "../1st-ed/color.js";

/**
 * All support color space keys, as specified since the 3rd Editor's
 * Draft.
 *
 * @see https://www.designtokens.org/tr/third-editors-draft/color/#supported-color-spaces
 */
export const colorSpaces3rdED = [
  "srgb",
  "srgb-linear",
  "hsl",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "display-p3",
  "a98-rgb",
  "prophoto-rgb",
  "rec2020",
  "xyz-d65",
  "xyz-d50",
] as const;

/**
 * Supported color space key, as specified since the 3rd Editor's
 * Draft.
 *
 * @see https://www.designtokens.org/tr/third-editors-draft/color/#supported-color-spaces
 */
export type ColorSpace3rdED = (typeof colorSpaces3rdED)[number];

/**
 * Checks if the given color space key is valid, as specified since
 * the 3rd Editor's Draft.
 *
 * @param colorSpaceKey
 * @returns
 */
export function isValidColorSpace3rdED(
  colorSpaceKey: unknown
): colorSpaceKey is ColorSpace3rdED {
  return (colorSpaces3rdED as ReadonlyArray<unknown>).includes(colorSpaceKey);
}

export type ColorComponents3rdED = [
  number | "none",
  number | "none",
  number | "none"
];

export function isValidColorComponents3rdED(
  components: unknown
): components is ColorComponents3rdED {
  return (
    Array.isArray(components) &&
    components.length === 3 &&
    components.every(
      (component) =>
        (typeof component === "number" && !isNaN(component)) ||
        component === "none"
    )
  );
}

/**
 * Color value, as specified since the 3rd Editor's Draft.
 */
export type Color3rdED<
  ColorSpaceType = ColorSpace3rdED,
  ColorComponentsType = ColorComponents3rdED
> = {
  /**
   * A string that specifies the color space or color model.
   */
  colorSpace: ColorSpaceType;

  /**
   * An array representing the color components. The number of components depends on the color space.
   */
  components: ColorComponentsType;

  /**
   * A number that represents the alpha value of the color. This value is between 0 and 1, where 0 is fully transparent and 1 is fully opaque. If omitted, the alpha value of the color MUST be assumed to be 1 (fully opaque).
   */
  alpha?: number;

  /**
   * A string that represents a fallback value of the color. The fallback color MUST be formatted in 6 digit CSS hex color notation format to avoid conflicts with the provided alpha value.
   */
  hex?: `#${string}`;
};

const hexTripletRegex = /^#[\da-zA-Z]{6}$/;

/**
 * Checks if the value is a valid color value, as specified
 * since the 3rd Third Editors' Draft.
 *
 * This is a strict check that follows the spec exactly.
 *
 * - `.colorSpace` and `.components` must be present
 * - `.colorSpace` must be a supported color space key
 * - `.components` must be an array of numbers or "none" strings
 * - `.alpha`, if present, must be a number
 * - `.hex`, if present, must be a hex triplet
 * - no other properties may be present
 *
 * @param value The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG dimension value, `false` otherwise.
 */
export function isValidColor3rdED(value: unknown): value is Color3rdED {
  if (!isPlainObject(value)) {
    return false;
  }

  const { colorSpace, components, alpha, hex, ...rest } = value;

  if (Object.keys(rest).length > 0) {
    // contains non-standard properties
    return false;
  }

  return (
    // MUST have a valid .colorSpace
    isValidColorSpace3rdED(value.colorSpace) &&
    // MUST have valid .components
    isValidColorComponents3rdED(value.components) &&
    // If .alpha exists, it MUST be a number
    (alpha === undefined || typeof alpha === "number") &&
    // If .hex exists, it MUST be a hex triplet
    (hex === undefined ||
      (typeof hex === "string" && hexTripletRegex.test(hex)))
  );
}

const color1stEdComponentsRegex =
  /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i;

function hexByteToFloat(hexByteVal: string): number {
  const intVal = parseInt(hexByteVal, 16);
  return intVal / 255;
}

/**
 * Converts a legacy color value that conforms to the syntax
 * of the 1st and 2nd Editor's Drafts to one that conforms to
 * the 3rd Third Editors' Draft.
 *
 * @param legacyColorVal A legacy color value (e.g. `"#aabbcc"`)
 * @returns The equivalent, 3rd Editor's Draft color value.
 */
export function fromColor1stEDTo3rdEd(legacyColorVal: Color1stED): Color3rdED {
  const matches = String(legacyColorVal).match(color1stEdComponentsRegex);

  if (matches === null) {
    throw new DtcgValueParseException("Invalid color value");
  }

  const [, r, g, b, a] = matches;

  const output: Color3rdED = {
    colorSpace: "srgb",
    components: [hexByteToFloat(r), hexByteToFloat(g), hexByteToFloat(b)],
    hex: `#${r}${g}${b}`,
  };

  if (a !== undefined) {
    output.alpha = hexByteToFloat(a);
  }

  return output;
}

export interface SanitizeColor3rdEDOptions {
  /**
   * Attempt to sanitize invalid values (after all other santization
   * options have been applied) as 1st Editor's Draft syntax.
   */
  tryAs1stEd?: boolean | SanitizeColor1stEDOptions;

  /**
   * Strip away properties other than `.colorSpace`, `.components`,
   * `.alpha` and `.hex` from the input.
   */
  stripExtraneousProperties?: boolean;
}

/**
 * Attempts to sanitize the input value to a valid color value,
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
 * @returns A spec-compliant color value.
 */
export function sanitizeColor3rdED(
  input: unknown,
  options?: SanitizeColor3rdEDOptions
): Color3rdED {
  const { tryAs1stEd = false, stripExtraneousProperties = false } =
    options ?? {};

  let output = input;

  if (output !== null && typeof output === "object") {
    if (stripExtraneousProperties && Object.keys(output as object).length > 4) {
      const { colorSpace, components, alpha, hex } = output as any;
      output = { colorSpace, components, alpha, hex };
    }
  }

  if (isValidColor3rdED(output)) {
    return output;
  }
  // Fallback to attempt to parse as a 1st ED value, if allowed by the
  // options
  if (tryAs1stEd) {
    return fromColor1stEDTo3rdEd(
      sanitizeColor1stED(output, tryAs1stEd !== true ? tryAs1stEd : undefined)
    );
  }
  // Give up
  throw new DtcgValueParseException("Invalid color value");
}
